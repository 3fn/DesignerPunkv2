# Task 1.2 Completion: Update InheritanceResolver for Omits

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion and Contract Audit Resolution
**Lead**: Lina
**Validation**: Tier 2 - Standard

---

## What Changed

### InheritanceResolver (`indexer/InheritanceResolver.ts`)
- Added `validateOmits()` function and `OmitsValidationResult` interface
- Validates omitted props exist on parent's property set
- Three warning cases: prop not found on parent, no parent declared, parent not indexed

### ComponentIndexer (`indexer/ComponentIndexer.ts`)
- Imported `validateOmits`
- Added omits validation step in `assembleComponent()` after contract resolution
- Warnings from omits validation surfaced in component metadata

### Tests (`InheritanceResolver.test.ts`)
- 5 new tests: valid omits, nonexistent prop warning, no parent warning, empty omits, unindexed parent

## Design Note

The InheritanceResolver handles contract inheritance (merging parent contracts into child). Property inheritance doesn't exist in the current model — each component declares its own properties. `omits` is validated (do these props exist on the parent?) but not applied as a filter, because there's no property merging to filter from. The `omits` field is declarative metadata that tells agents which parent props are unavailable on the child.

## Validation

- `npx tsc --noEmit`: clean
- Component MCP tests: 7 suites, 64 tests, 64 passed (+5 new)
- Main project tests: 290 suites, 7437 tests, 7437 passed
