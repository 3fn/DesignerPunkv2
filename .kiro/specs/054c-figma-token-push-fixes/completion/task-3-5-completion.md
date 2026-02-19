# Task 3.5 Completion: Update existing tests for new signatures

**Date**: 2026-02-19
**Purpose**: Document completion of test signature updates for bugfix 054c
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes
**Task**: 3.5 Update existing tests for new signatures

## Summary

Updated all existing test files to match the new `ConsoleMCPClient` interface signatures introduced in tasks 3.1–3.4. This includes the new `batchCreateVariables(collectionId, variables, modesMap?)` signature, the new `batchUpdateVariables(updates[])` tuple-based signature, and the addition of `createVariableAliases` to all mock objects.

## Changes Made

### ConsoleMCPClient.test.ts
- Updated `batchCreateVariables` tests to use `collectionId` instead of `fileKey`
- Added test for `modesMap` mode name → mode ID conversion
- Updated `batchUpdateVariables` tests to use `{ variableId, modeId, value }` tuples
- Updated `setupDesignTokens` test to match new `{ collectionName, modes, tokens }` payload shape
- Updated `getVariables` test for `{ tokens: [...] }` response shape (from `figma_get_token_values`)
- Updated connection tests to use `execute()` instead of `getVariables()` for "not connected" assertions (since `getVariables` now catches errors gracefully)
- Updated error handling test to use `collectionId`

### TokenSyncWorkflow.sync.test.ts
- Added `createVariableAliases` to mock
- Added `id` and `collectionId` to mock variables returned by `getVariables` (required for update tuple building)

### TokenSyncWorkflow.styles.test.ts
- Added `createVariableAliases` to mock

### TokenSyncWorkflow.batch.test.ts
- Added `createVariableAliases` to mock
- Updated `batchCreateVariables` resume test for new `(vars, collectionId?, modesMap?, startBatch?)` signature
- Rewrote `batchUpdateVariables` tests with `buildCurrentMap` helper providing `id` fields
- Updated `syncVariables` tests with `withFigmaIds` helper for current Figma variables
- Adjusted batch count expectations for tuple-based updates (variables × modes)

### TokenSyncWorkflow.drift.test.ts
- Added `createVariableAliases` to mock

### TokenSyncWorkflow.preservation.test.ts
- Added `createVariableAliases` to mock

### ConsoleMCPClient.preservation.test.ts
- Added `createVariableAliases` to all four Desktop Bridge mock objects

### preflight.test.ts
- Added `createVariableAliases` to mock
- Added 30-second timeouts to retry-based tests (5 retries × 3s delays)

### figma-push.test.ts
- Added `getVariables` to `ConsoleMCPClientImpl` mock
- Added `initialSetup` to `TokenSyncWorkflow` mock
- Updated `parseArgs` default expectation to include `clean: false`
- Updated normal sync test to expect `initialSetup` (empty getVariables → initial setup path)
- Updated force/resume/error tests to return existing variables so sync path is taken

### FigmaTransformer.variables.test.ts
- Updated color value expectation from `rgba(176, 38, 255, 1)` to `#B026FF`

## Verification

All targeted tests pass (147/149). The 2 remaining failures are bugfix test 1d (port cleanup, task 5 — not yet implemented).
