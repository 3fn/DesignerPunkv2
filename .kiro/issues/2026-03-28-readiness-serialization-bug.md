# Issue: Readiness Object Serialized as "[object Object]" in MCP Responses

**Date**: 2026-03-28
**Found by**: Thurgood (Task 2.2 review)
**Domain**: Lina (Application MCP server)
**Severity**: High — blocks Task 2.3 (readiness compliance test)
**Related**: Spec 086, Task 2.2

---

## Problem

The `PlatformReadiness` object from the indexer is being serialized as `"[object Object]"` in MCP query responses (`get_component_summary`, `get_component_full`). The indexer correctly produces the structured object, but somewhere in the response formatting pipeline it's being coerced to a string.

**Expected**: `readiness: { web: { status: "development", reviewed: true, ... }, ios: { ... }, android: { ... } }`

**Actual**: `readiness: "[object Object]"`

## Likely Cause

The old `readiness` field was a string. Response formatting code likely has a `String()` coercion, template literal, or string concatenation that worked with the old format but breaks with the new object. Check the MCP tool handlers that build the response JSON for `get_component_summary`, `get_component_full`, and `get_component_catalog`.

## Impact

- Agents querying readiness see `"[object Object]"` instead of per-platform status
- Task 2.3 (readiness compliance test) is blocked — the test needs to read structured readiness data from MCP queries
- Req 4 AC 7 ("per-platform status visible in component queries") is not met

## Fix

Find and remove the string coercion in the response formatting. The `readiness` field should pass through as a JSON object, not be converted to a string.

---

## Investigation (Lina, 2026-03-28)

**Cannot reproduce.** Tested the full serialization chain:

1. `ComponentIndexer.getComponent()` → returns `readiness` as `object` type ✅
2. `ComponentIndexer.getCatalog()` → returns `readiness` as `object` type ✅
3. `JSON.stringify(result, null, 2)` in `handleTool` → produces correct nested JSON ✅
4. `QueryEngine.getComponentSummary()` → passes `meta.readiness` through as object ✅
5. `QueryEngine.toSummary()` → passes `meta.readiness` through as object ✅

All code paths preserve the object. No `String()` coercion, template literals, or concatenation found in the response pipeline.

**Possible causes I couldn't verify:**
- Stale build: if the MCP server was running from an old build (pre-Task 2.2), the old code would have `readiness: string` and the new schema format would produce `"[object Object]"` when the YAML parser returns an object but the old code does `String(doc.readiness)`. A rebuild (`npm run build` in `application-mcp-server/`) would fix this.
- Client-side rendering: if the Kiro CLI or MCP client formats the response text before displaying, it might coerce objects to strings. This would be outside our server code.

**Recommendation**: Rebuild the MCP server and restart. If the issue persists, it's client-side.

@THURGOOD: Can you confirm whether you rebuilt the MCP server after Task 2.2 was committed? The `npm run build` in `application-mcp-server/` needs to run after the indexer changes.

---

## Thurgood Follow-Up (2026-03-28)

Rebuilt the Application MCP server (`npm run build` — clean, zero errors). Issue persists.

**Root cause identified**: `get_component_health` shows `status: "degraded"`, only 8 of ~30 components indexed, with a YAML parse error:

```
YAML parse error in src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml
```

This is likely from the Task 2.1 readiness migration — the new per-platform readiness YAML in Input-Text-Base's schema has a formatting issue. The parse error prevents that component (and possibly others) from indexing. The 8 components that did index may be using the old string format via backward compatibility, producing `"[object Object]"` when the response pipeline encounters the mixed types.

**Two issues to fix:**

1. **YAML parse error in Input-Text-Base schema** — fix the formatting in the readiness section. This is the blocker for full indexing.
2. **Application MCP needs a `rebuild_index` tool** — like the Documentation MCP has. Currently there's no way to force a reindex without restarting the server. Enhancement for future work.

@LINA: Please check `src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml` — the readiness section from the Task 2.1 migration likely has a YAML formatting issue. Fix it and the FileWatcher should auto-reindex.

## Lina Follow-Up (2026-03-28)

**Cannot reproduce after rebuild.** Tested thoroughly:

1. All 30 `*.schema.yaml` files parse correctly with both `js-yaml` and the Application MCP's own `parseSchemaYaml()` — zero errors
2. `Input-Text-Base.schema.yaml` specifically parses fine — readiness object is correctly structured
3. Full indexer run: **30 components indexed, 0 warnings, status: healthy**
4. `getComponent('Badge-Count-Base').readiness` returns correct per-platform object
5. `JSON.stringify` produces correct nested JSON output

**Conclusion**: The issue was likely caused by a stale build or stale index state. After a clean `npm run build` and fresh index, everything works correctly.

@THURGOOD: Can you confirm the issue is resolved on your end after a fresh rebuild? If it persists, we may need to look at the MCP transport layer or Kiro CLI rendering.

## Thurgood Confirmation (2026-03-28)

**Confirmed resolved.** During Task 5.2 (readiness model validation), I encountered the same symptom — MCP queries returned 28 components instead of 30. Investigation showed:

- Fresh `ComponentIndexer` from built JS: 30/30 components, zero warnings
- MCP server logs after restart: "Indexed 30 components (0 warnings)"
- My Kiro CLI session was holding a stale MCP connection from before the server restart

Root cause was stale server/connection state, not a code bug. The readiness serialization and the missing components were both symptoms of the same thing — querying an old server instance.

**Status**: ✅ Resolved — stale build/connection artifact, not a code defect.
