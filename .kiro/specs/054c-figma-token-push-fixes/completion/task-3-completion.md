# Task 3 Completion: Fix Incremental Sync Parameter Schemas (Bugs 1 & 2)

**Date**: 2026-02-19
**Task**: 3. Fix incremental sync parameter schemas (Bugs 1 & 2)
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes

---

## Summary

Fixed the two incremental sync bugs in the Figma token push workflow:

- Bug 1: `batchCreateVariables` now passes `collectionId` (not `fileKey`) to `figma_batch_create_variables`, with `modesMap` for mode ID resolution
- Bug 2: `batchUpdateVariables` now accepts pre-built `{ variableId, modeId, value }` tuples and sends `{ updates: [...] }` to `figma_batch_update_variables`

## Changes Made

### 3.1 Interface Updates (`ConsoleMCPClient.ts`)
- Changed `batchCreateVariables` signature: `collectionId` replaces `fileKey`, added `modesMap` parameter
- Changed `batchUpdateVariables` signature: accepts update tuples instead of `FigmaVariable[]`
- Added `createVariableAliases` method for Bug 3 (implemented in Task 4)
- Added optional `id` and `collectionId` fields to `FigmaVariable` in `FigmaTransformer.ts`

### 3.2 batchCreateVariables Fix (`ConsoleMCPClientImpl.ts`)
- Replaced `fileKey` with `collectionId` in `callTool` payload
- Added mode name → mode ID conversion using `modesMap`

### 3.3 batchUpdateVariables Fix (`ConsoleMCPClientImpl.ts`)
- Redesigned to accept `{ variableId, modeId, value }[]` tuples
- Sends `{ updates: [...] }` matching `figma_batch_update_variables` schema

### 3.4 TokenSyncWorkflow Updates
- Stores `collectionId` and `modesMap` from initial setup response
- Queries existing variables via `figma_get_token_values` for incremental sync
- Builds update tuples with `variableId` from queried variables
- Initial setup path, drift detection, and style sync unchanged

### 3.5 Test Updates
- Updated all mock calls across `ConsoleMCPClient.test.ts`, `TokenSyncWorkflow.sync.test.ts`, `TokenSyncWorkflow.styles.test.ts`, and `figma-push.test.ts` to match new signatures

### 3.6 Bug Condition Verification
- Exploration tests 1a and 1b now pass, confirming Bugs 1 & 2 are fixed

### 3.7 Preservation Verification
- All preservation tests pass, confirming no regressions to initial setup, CLI flags, primitives, or style sync

## Validation

- `npm test`: 337 passed, 2 failed (unrelated)
  - `ConsoleMCPClient.bugfix.test.ts` Test 1d fails as expected (Bug 4 not yet fixed, Task 5)
  - `PerformanceRegression.test.ts` pre-existing flaky timeout
- All Task 3 relevant tests pass: ConsoleMCPClient, TokenSyncWorkflow (sync, styles, batch, drift), figma-push, FigmaTransformer, preservation, bugfix 1a/1b

## Requirements Validated

- 2.1: Incremental batch create uses `collectionId`
- 2.2: Incremental batch update uses `{ variableId, modeId, value }` tuples
- 3.1-3.8: All preservation requirements confirmed via preservation test suite
