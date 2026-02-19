# Task 3.4 Completion: Update TokenSyncWorkflow to Pass Correct Parameters

**Date**: 2026-02-19
**Purpose**: Document completion of TokenSyncWorkflow parameter updates for incremental sync
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes
**Task**: 3.4 Update TokenSyncWorkflow to pass correct parameters

## Summary

Updated `TokenSyncWorkflow` to pass `collectionId` and `modesMap` to `batchCreateVariables` (instead of `this.figmaFileKey`) and to build `{ variableId, modeId, value }` update tuples for `batchUpdateVariables` (instead of passing raw `FigmaVariable[]`).

## Changes Made

### `src/figma/TokenSyncWorkflow.ts`

**`syncVariables`**: Now extracts `collectionId` and `modesMap` from current Figma variables (returned by `getVariables`). Passes these to `batchCreateVariables`. Passes `currentByName` map to `batchUpdateVariables` so it can look up variable IDs.

**`batchCreateVariables`**: Accepts `collectionId` and `modesMap` parameters. Uses `collectionId` when available (incremental sync), falls back to `figmaFileKey` for backwards compatibility. Passes `modesMap` through to `consoleMcp.batchCreateVariables()`.

**`batchUpdateVariables`**: Accepts `currentByName` map instead of relying on `this.figmaFileKey`. Builds `{ variableId, modeId, value }` tuples by matching desired variables to current Figma state (which carries `id` and mode IDs). Passes tuples to `consoleMcp.batchUpdateVariables()`.

### `src/figma/ConsoleMCPClientImpl.ts`

**`getVariables`**: Now maps `id` and `collectionId` from the `figma_get_token_values` response into the returned `FigmaVariable[]` objects, enabling the workflow to use these IDs for incremental sync operations.

## Preservation

- `initialSetup` path: Unchanged — still uses `figma_setup_design_tokens` atomically
- `detectDrift`: Unchanged — still compares expected vs actual values
- `syncStyles`: Unchanged — still uses Plugin API code generation
- `sync` orchestration: Unchanged — same flow (fetch state → drift check → sync variables → sync styles)

## Validation

- TypeScript diagnostics: Clean (no errors in either modified file)
- Test files have a pre-existing mock issue (`createVariableAliases` missing from mock) — this is task 3.5's scope
