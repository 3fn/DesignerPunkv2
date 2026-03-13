# Task 1.4 Completion: Update DTCG Generator and Figma Transformer

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.4 — Update DTCG generator and Figma transformer
**Type**: Implementation
**Agent**: Ada

---

## What Was Done

Updated DTCG generator and Figma transformer to handle piecewise linear easing alongside cubic bezier.

### Changes

| File | Change |
|------|--------|
| `src/generators/types/DTCGTypes.ts` | Added `'linearEasing'` to `DTCGType` union |
| `src/generators/DTCGFormatGenerator.ts` | Added `'linearEasing'` to `VALID_DTCG_TYPES`. Updated `generateEasingTokens()` — removed group-level `$type`, each token gets its own type. Linear tokens emit stops array as `$value`. |
| `src/generators/transformers/FigmaTransformer.ts` | Added `'linearEasing'` case to `dtcgTypeToFigmaType()` (→ STRING). Added linear easing stops serialization to `resolveDirectValue()`. |
| `src/generators/__tests__/DTCGFormatGenerator.test.ts` | Updated easing test to verify both `cubicBezier` and `linearEasing` token types |
| `src/generators/__tests__/DTCGFormatGenerator.property.test.ts` | Added `'linearEasing'` to test's `VALID_DTCG_TYPES` set (was causing non-deterministic failure via random sampling) |

### DTCG Output

```json
{
  "easing": {
    "easingStandard": {
      "$value": [0.4, 0, 0.2, 1],
      "$type": "cubicBezier"
    },
    "easingGlideDecelerate": {
      "$value": [[0, 0], [0.009, 0.012], ...],
      "$type": "linearEasing"
    }
  }
}
```

### Note on Property Test

The `DTCGFormatGenerator.property.test.ts` had a duplicate `VALID_DTCG_TYPES` constant separate from the source. The first run randomly sampled the linear easing token and failed; subsequent runs might not. This was a real bug (missing type in test validation set), not a flaky test. Fixed by adding `linearEasing` to the test's set.

## Validation

- `src/generators/`: 20 suites, 434 tests, 0 failures
- Property test run 3x to confirm stability across random seeds
