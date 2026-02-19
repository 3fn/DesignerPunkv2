# Task 3.2 Completion — Fix `ConsoleMCPClientImpl.batchCreateVariables` implementation

**Date**: 2026-02-19
**Purpose**: Document completion of Bug 1 fix in ConsoleMCPClientImpl
**Organization**: spec-completion
**Scope**: 054c-figma-token-push-fixes
**Task**: 3.2 Fix `ConsoleMCPClientImpl.batchCreateVariables` implementation

## Changes Made

**File**: `src/figma/ConsoleMCPClientImpl.ts` — `batchCreateVariables` method (line 155)

**Before (buggy)**:
- First parameter was `fileKey: string`
- Payload sent `{ fileKey, variables: [...] }` to `figma_batch_create_variables`
- No mode name → mode ID conversion
- `valuesByMode` keys passed through as-is (mode names)

**After (fixed)**:
- First parameter changed to `collectionId: string`
- Added `modesMap?: Record<string, string>` parameter
- Payload sends `{ collectionId, variables: [...] }` to `figma_batch_create_variables`
- Converts `valuesByMode` keys from mode names to mode IDs using `modesMap` (falls back to key as-is when no map provided)
- Matches the overflow batch pattern already used in `setupDesignTokens()`

## Bug Condition Addressed

```
Bug_Condition: input.isIncrementalSync AND input.hasNewVariables
  AND payload.hasProperty("fileKey") AND NOT payload.hasProperty("collectionId")
```

## Validation Note

The bugfix test suite (`ConsoleMCPClient.bugfix.test.ts`) cannot compile until task 3.3 also fixes `batchUpdateVariables` — the interface was updated in task 3.1 but the implementation still has the old signature. Test 1a validation will be confirmed in task 3.6.

## Requirements

- **2.1**: `batchCreateVariables` passes `collectionId` to `figma_batch_create_variables`
