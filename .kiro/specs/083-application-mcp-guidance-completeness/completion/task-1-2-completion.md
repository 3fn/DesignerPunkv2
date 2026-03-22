# Task 1.2 Completion: Migrate Component Reachability out of CoverageDrift

**Date**: 2026-03-22
**Spec**: 083 — Application MCP Guidance Completeness
**Agent**: Lina
**Validation Tier**: 2 — Standard

---

## What Was Done

Removed the third assertion ("every production component is reachable via getGuidance()") from `CoverageDrift.test.ts`. This assertion now lives in `GuidanceCompleteness.test.ts` Test 1 (created in Task 1.1).

Updated the CoverageDrift doc comment to reflect the migration and reference spec 083.

## Migration Validation Checklist

| # | Pre-migration assertion | Post-migration home | Status |
|---|------------------------|-------------------|--------|
| 1 | every production family has family guidance | CoverageDrift (retained) | ✅ |
| 2 | every component in guidance exists in catalog | CoverageDrift (retained) | ✅ |
| 3 | every production component reachable via getGuidance() | GuidanceCompleteness Test 1 | ✅ migrated |

No assertion dropped.

## Artifacts

- Modified: `application-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts`

## Validation

- CoverageDrift: 2 tests passing (down from 3 — third migrated)
- GuidanceCompleteness: 2 tests passing (includes migrated reachability)
- Combined: 4 tests, 2 suites, all passing
