# Application MCP Serving Stale Index — 19 of 34 Components

**Date**: 2026-04-03
**Reported by**: Leonardo
**Severity**: High — blocks product screen specification
**Status**: Open

---

## Summary

The running Application MCP server is serving 19 components. The filesystem has 34. The indexer finds all 34 when run fresh. The MCP server is holding a stale index.

## Evidence

| Source | Component Count |
|--------|----------------|
| Filesystem (`*.schema.yaml`) | 34 |
| Filesystem (`component-meta.yaml`) | 34 |
| Fresh indexer run (`node -e "..."`) | 34, zero warnings |
| Running MCP server (`get_component_health`) | 19 |
| Running MCP server (`get_component_catalog`) | 19 |

### Missing Components (15)

Avatar-Base, Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base, Button-CTA, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set, Chip-Base, Chip-Filter, Chip-Input, Container-Base, Container-Card-Base, Icon-Base, Input-Checkbox-Base

These include every structural foundation component (Container-Base, Container-Card-Base), every button (Button-CTA, Button-Icon), and every badge — the most commonly used components in the catalog.

## Impact

- Leonardo cannot select missing components for screen specs via `find_components` or `get_component_full`
- `validate_assembly` cannot validate trees containing missing components
- Product development is blocked until the index is current

## Root Cause

Likely the same class of issue Thurgood documented during Spec 086 Task 5.2 — the MCP server was started before recent components were added (Specs 088, 090) or the Kiro CLI session is holding a stale MCP connection from a previous server state.

The indexer code is correct. The data on disk is correct. The server lifecycle is the problem.

## Prior Occurrence

Spec 086 Task 5.2 completion doc noted: "MCP queries returned 28 components instead of 30. Investigation revealed Thurgood's Kiro CLI session was holding a stale MCP connection from before the server restart. No indexer bug. No missing components. Session caching artifact."

This is the same pattern at larger scale (19 vs 34 instead of 28 vs 30).

## Fix

Restart the MCP server. Verify `get_component_health` reports 34 components indexed.

## Suggested Follow-Up

Consider a staleness detection mechanism — if the number of component directories on disk exceeds the index count, the health check should report a warning rather than "healthy." The current health check reports zero warnings with 15 missing components because the indexer doesn't know it's stale.

## Resolution

**Server-side: Resolved.** Peter restarted the Application MCP server on 2026-04-03. Server logs confirm "Indexed 34 components (0 warnings)" at 16:16:58. The server is serving the correct count.

**Client-side: Session caching.** Leonardo's CLI session (`kiro-cli chat`) continued to see 19 components after the server restart. The stale connection persists until the CLI session is restarted. This matches the Spec 086 Task 5.2 finding — the issue is session/connection caching, not server or indexer logic.

**Staleness detection suggestion still stands.** The health check reported "healthy" with 0 warnings while serving 19 of 34 components. A filesystem-vs-index count comparison in the health check would surface this earlier.

**Route to**: Lina (MCP server owner) or Thurgood (infrastructure governance)
