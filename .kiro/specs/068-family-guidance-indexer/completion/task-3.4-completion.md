# Task 3.4 Completion: Cross-reference validation

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task Type**: Implementation (Subtask)
**Tier**: 2 (Standard)
**Agent**: Lina

---

## Changes

- `component-mcp-server/src/indexer/FamilyGuidanceIndexer.ts` — added `validateCrossReferences()` method
- `component-mcp-server/src/indexer/ComponentIndexer.ts` — calls `validateCrossReferences()` after guidance indexing with component names, pattern names, and project root
- `component-mcp-server/src/indexer/__tests__/FamilyGuidanceIndexer.test.ts` — 4 new cross-reference tests (23 total)

## Validations Implemented

1. `recommend` values in selection rules checked against component catalog
2. `relatedPatterns` values checked against experience pattern index
3. `companion` paths checked for file existence relative to project root

All emit warnings (not fatal errors) per Requirement 3.4.

## Test Results

- 11 suites, 136 tests, all passing
- TypeScript compilation clean
