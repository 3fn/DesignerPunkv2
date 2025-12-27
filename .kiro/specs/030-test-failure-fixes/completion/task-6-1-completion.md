# Task 6.1 Completion: Verify lineHeight Formula Correctness

**Date**: December 27, 2025
**Task**: 6.1 Verify lineHeight formula correctness
**Type**: Implementation
**Status**: Complete
**Organization**: spec-completion
**Scope**: 030-test-failure-fixes

---

## Summary

Verified that the lineHeight formula implementation in `LineHeightTokens.ts` is **correct**. The current implementation uses precision-targeted multipliers designed to achieve 8pt vertical rhythm alignment when combined with their paired fontSize values.

---

## Formula Analysis

### LineHeight Token Design Philosophy

LineHeight tokens are **precision-targeted multipliers** that, when multiplied by their paired fontSize values, produce computed line heights that align with the 8pt vertical rhythm grid.

**Base Value**: `LINE_HEIGHT_BASE_VALUE = 1.5` (optimal reading ratio)

### Formula Verification Table

| Token | fontSize | lineHeight | Computed (fontSize × lineHeight) | Target (8pt grid) | Alignment |
|-------|----------|------------|----------------------------------|-------------------|-----------|
| 050 | 13 | 1.538 | 13 × 1.538 = 19.994 | 20 (8×2.5) | ✓ |
| 075 | 14 | 1.429 | 14 × 1.429 = 20.006 | 20 (8×2.5) | ✓ |
| 100 | 16 | 1.5 | 16 × 1.5 = 24 | 24 (8×3) | ✓ |
| 125 | 18 | 1.556 | 18 × 1.556 = 28.008 | 28 (8×3.5) | ✓ |
| 150 | 20 | 1.4 | 20 × 1.4 = 28 | 28 (8×3.5) | ✓ |
| 200 | 23 | 1.391 | 23 × 1.391 = 31.993 | 32 (8×4) | ✓ |
| 300 | 26 | 1.231 | 26 × 1.231 = 32.006 | 32 (8×4) | ✓ |
| 400 | 29 | 1.241 | 29 × 1.241 = 35.989 | 36 (8×4.5) | ✓ |
| 500 | 33 | 1.212 | 33 × 1.212 = 39.996 | 40 (8×5) | ✓ |
| 600 | 37 | 1.19 | 37 × 1.19 = 44.03 | 44 (8×5.5) | ✓ |
| 700 | 42 | 1.143 | 42 × 1.143 = 48.006 | 48 (8×6) | ✓ |

**All 11 lineHeight tokens produce computed values within 0.03 units of their 8pt grid targets.**

---

## Current Implementation Values (Correct)

```typescript
// From src/tokens/LineHeightTokens.ts
lineHeight050: 1.538  // Produces ~20 with fontSize050 (13)
lineHeight075: 1.429  // Produces ~20 with fontSize075 (14)
lineHeight100: 1.5    // Produces 24 with fontSize100 (16) - BASE VALUE
lineHeight125: 1.556  // Produces ~28 with fontSize125 (18)
lineHeight150: 1.4    // Produces 28 with fontSize150 (20)
lineHeight200: 1.391  // Produces ~32 with fontSize200 (23)
lineHeight300: 1.231  // Produces ~32 with fontSize300 (26)
lineHeight400: 1.241  // Produces ~36 with fontSize400 (29)
lineHeight500: 1.212  // Produces ~40 with fontSize500 (33)
lineHeight600: 1.19   // Produces ~44 with fontSize600 (37)
lineHeight700: 1.143  // Produces ~48 with fontSize700 (42)
```

---

## Test File Issue Identified

The test file `LineHeightTokensFormulaValidation.test.ts` contains **outdated "original values"** that represent an older formula approach:

### Outdated Test Expectations (Incorrect)

```typescript
const originalValues: Record<string, number> = {
  lineHeight050: 1.0,    // ❌ Should be 1.538
  lineHeight075: 1.25,   // ❌ Should be 1.429
  lineHeight100: 1.5,    // ✓ Correct
  lineHeight125: 1.75,   // ❌ Should be 1.556
  lineHeight150: 1.4,    // ✓ Correct
  lineHeight200: 1.391,  // ✓ Correct
  lineHeight300: 1.231,  // ✓ Correct
  lineHeight400: 1.241,  // ✓ Correct
  lineHeight500: 1.212,  // ✓ Correct
  lineHeight600: 1.19,   // ✓ Correct
  lineHeight700: 1.143   // ✓ Correct
};
```

### Failing Tests (4 total)

1. `lineHeight050 formula should match original value 1.0` - Expected 1.0, Actual 1.538
2. `lineHeight075 formula should match original value 1.25` - Expected 1.25, Actual 1.429
3. `lineHeight125 formula should match original value 1.75` - Expected 1.75, Actual 1.556
4. `should validate all lineHeight tokens match original values` - Comprehensive validation fails

---

## Root Cause Analysis

The test file was created to validate a formula refactoring, but the "original values" in the test represent an **older design** that used simpler multipliers (1.0, 1.25, 1.75) rather than the current **precision-targeted multipliers** designed for 8pt vertical rhythm alignment.

The current implementation is **correct** - the test expectations need to be updated to match the actual formula outputs.

---

## Recommended Fix (Task 6.2)

Update the test file's `originalValues` to match the current implementation:

```typescript
const originalValues: Record<string, number> = {
  lineHeight050: 1.538,  // Updated: precision-targeted for 8pt grid
  lineHeight075: 1.429,  // Updated: precision-targeted for 8pt grid
  lineHeight100: 1.5,    // Unchanged: base value
  lineHeight125: 1.556,  // Updated: precision-targeted for 8pt grid
  lineHeight150: 1.4,    // Unchanged
  lineHeight200: 1.391,  // Unchanged
  lineHeight300: 1.231,  // Unchanged
  lineHeight400: 1.241,  // Unchanged
  lineHeight500: 1.212,  // Unchanged
  lineHeight600: 1.19,   // Unchanged
  lineHeight700: 1.143   // Unchanged
};
```

Also update the formula multipliers in individual tests to match the precision-targeted approach.

---

## Validation

- ✅ Reviewed lineHeight formula implementation in `LineHeightTokens.ts`
- ✅ Calculated expected outputs for each token
- ✅ Verified 8pt vertical rhythm alignment for all 11 tokens
- ✅ Documented formula and expected values
- ✅ Identified root cause of test failures

---

## Requirements Traceability

- **Requirement 5.1**: WHEN lineHeight tokens are tested THEN the Test_Suite SHALL use expectations matching the formula-based outputs
  - **Status**: Formula outputs verified as correct; test expectations need updating

---

## Files Analyzed

- `src/tokens/LineHeightTokens.ts` - Implementation (correct)
- `src/tokens/FontSizeTokens.ts` - Paired fontSize values for verification
- `src/tokens/__tests__/LineHeightTokensFormulaValidation.test.ts` - Test file (needs update)
