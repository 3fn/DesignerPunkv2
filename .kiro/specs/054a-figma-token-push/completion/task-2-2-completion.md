# Task 2.2 Completion: Implement Drift Detection

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Task**: 2.2 Implement drift detection
**Status**: Complete
**Organization**: spec-completion
**Scope**: 054a-figma-token-push

---

## What Was Implemented

Added `detectDrift()` method to `TokenSyncWorkflow` that compares current Figma variable state against expected token state from `FigmaTokenFile`.

- Builds a lookup map of expected variables by name across all collections
- Iterates current Figma variables and compares `valuesByMode` per mode
- Reports first drifted mode per variable (avoids duplicate entries)
- Ignores variables in Figma that aren't in the expected state (not drift, may be from another source)
- Returns `DriftReport` with `hasDrift` flag and array of `DriftedVariable` entries

Supporting additions:
- `DriftedVariable` interface (name, expectedValue, actualValue)
- `DriftReport` interface (hasDrift, driftedVariables)
- `buildExpectedVariableMap()` private helper
- `valuesEqual()` deep-equal comparison for primitives and objects (color values, alias references)

## Key Decisions

- Variables present in Figma but absent from expected state are skipped (not treated as drift). These may be variables from other sources or manual additions.
- Only the first drifted mode is reported per variable to keep the report concise.
- Deep equality handles nested objects (color `{r, g, b, a}`) via recursive structural comparison.

## Test Coverage

7 tests in `src/figma/__tests__/TokenSyncWorkflow.drift.test.ts`:
- No drift when Figma matches expected state
- Detects numeric value drift
- Detects color value drift (object comparison)
- Ignores unknown Figma variables
- Detects drift in only one mode
- Handles multiple drifted variables across collections
- No drift when Figma has no variables

## Artifacts

- Modified: `src/figma/TokenSyncWorkflow.ts`
- Created: `src/figma/__tests__/TokenSyncWorkflow.drift.test.ts`
