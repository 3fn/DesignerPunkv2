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
