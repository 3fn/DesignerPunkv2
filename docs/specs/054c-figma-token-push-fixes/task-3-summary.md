# Task 3 Summary: Fix Incremental Sync Parameter Schemas (Bugs 1 & 2)

**Date**: 2026-02-19
**Task**: 3. Fix incremental sync parameter schemas (Bugs 1 & 2)
**Type**: Implementation
**Status**: Complete
**Organization**: spec-summary
**Scope**: 054c-figma-token-push-fixes

---

## What Changed

Fixed two parameter schema mismatches in the Figma token push incremental sync path:

1. `batchCreateVariables` now correctly passes `collectionId` instead of `fileKey` to `figma_batch_create_variables`
2. `batchUpdateVariables` now sends `{ updates: [{ variableId, modeId, value }] }` instead of the wrong payload shape

## Why

The incremental sync path (second+ push) was broken because the MCP client methods were built against assumed tool schemas rather than the actual `figma-console-mcp` API. This forced designers to use `--clean` (delete and re-push) as a workaround, requiring them to reassign all variable bindings in Figma.

## Impact

- Incremental token pushes now work correctly for both new and updated variables
- Designers no longer need `--clean` workaround for iterative token updates
- All preservation behaviors confirmed unchanged (initial setup, CLI flags, drift detection, style sync)

## Files Modified

- `src/figma/ConsoleMCPClient.ts` — Interface signatures
- `src/figma/ConsoleMCPClientImpl.ts` — Implementation fixes
- `src/figma/TokenSyncWorkflow.ts` — Workflow parameter passing
- `src/generators/transformers/FigmaTransformer.ts` — FigmaVariable type extension
- Test files updated to match new signatures
