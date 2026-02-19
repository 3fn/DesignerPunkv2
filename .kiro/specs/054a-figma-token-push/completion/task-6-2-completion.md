# Task 6.2 Completion: Implement Partial Failure Error Reporting

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Task**: 6.2 Implement partial failure error reporting
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## What Was Implemented

Added `formatPartialFailure(info: PartialFailureInfo): string` to `src/figma/error-reporting.ts`.

The function formats a partial sync failure into a structured, human-readable report with four sections:

1. What succeeded — created count with completed batch range (singular/plural wording)
2. What failed — batch number, total batches, error message, and recovery command
3. What remains — remaining count with remaining batch range (omitted when last batch fails)
4. Resume instruction footer — directs user to `--resume` flag

The `PartialFailureInfo` interface captures: `createdCount`, `failedBatch`, `totalBatches`, `errorMessage`, `remainingCount`.

Both `formatPartialFailure` and `PartialFailureInfo` exported from `src/figma/index.ts`.

## Test Coverage

5 tests added to `src/figma/__tests__/error-reporting.test.ts`:

- Mid-batch failure with completed range and remaining batches
- First-batch failure with no completed range
- Last-batch failure with no remaining section
- Resume instruction footer present
- Singular batch wording when only one batch completed

## Artifacts

- Modified: `src/figma/error-reporting.ts` (added `formatPartialFailure`, `PartialFailureInfo`)
- Modified: `src/figma/__tests__/error-reporting.test.ts` (added 5 tests)
- Modified: `src/figma/index.ts` (added exports)
