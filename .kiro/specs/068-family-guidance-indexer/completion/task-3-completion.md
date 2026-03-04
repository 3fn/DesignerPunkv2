# Task 3 Completion: Indexer and MCP Tool Implementation

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task Type**: Implementation (Parent)
**Tier**: 3 (Comprehensive)
**Agent**: Lina

---

## Summary

Implemented `FamilyGuidanceIndexer`, integrated it with `ComponentIndexer`, registered the `get_prop_guidance` MCP tool, and added cross-reference validation. The Application MCP now serves family-level prop and selection guidance — the capability deferred from Spec 067 (Decision D6).

## Subtasks Completed

| Subtask | Description | Tests Added |
|---------|-------------|-------------|
| 3.1 | FamilyGuidanceIndexer implementation | 19 |
| 3.2 | ComponentIndexer integration | 0 (integration verified via existing tests) |
| 3.3 | `get_prop_guidance` MCP tool | 0 (integration spot-checked) |
| 3.4 | Cross-reference validation | 4 |

## Artifacts Created/Modified

### New Files
- `component-mcp-server/src/indexer/FamilyGuidanceIndexer.ts` — indexer (scan, parse, validate, query)
- `component-mcp-server/src/indexer/__tests__/FamilyGuidanceIndexer.test.ts` — 23 tests

### Modified Files
- `component-mcp-server/src/models/index.ts` — added FamilyGuidance, SelectionRule, SelectionRuleGroup, FamilyPattern, FamilyPatternComponent, PropGuidanceResponse, FamilyGuidanceHealth interfaces; added `guidanceFamiliesIndexed` to IndexHealth
- `component-mcp-server/src/indexer/ComponentIndexer.ts` — imported FamilyGuidanceIndexer, wired startup ordering, added getGuidance/getGuidanceFamilies methods, integrated health reporting, added cross-reference validation call
- `component-mcp-server/src/query/QueryEngine.ts` — added getGuidance method with verbose filtering
- `component-mcp-server/src/index.ts` — registered get_prop_guidance tool

## Architecture Decisions Applied

- **Startup ordering**: ComponentIndexer → PatternIndexer → FamilyGuidanceIndexer (explicit, per Ada's review)
- **Normalization**: flat rules wrapped in ungrouped SelectionRuleGroup (per design Decision 2)
- **Verbose flag**: `verbose=false` strips rationale from rules and description from patterns (per design Decision 3)
- **Cross-references**: warnings not fatal errors (per Requirement 3.4)
- **Response shape**: always returns SelectionRuleGroup[] array, no flattening (per Lina's review)

## Validation

- Full test suite: 290 suites, 7435 tests, all passing
- TypeScript compilation: clean
- Integration spot-check: 28 components, 3 patterns, 3 guidance families, all queries functional
