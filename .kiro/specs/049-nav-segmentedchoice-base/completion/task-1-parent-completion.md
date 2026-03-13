# Task 1 Parent Completion: Easing Token Infrastructure Extension

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1 — Easing Token Infrastructure Extension
**Type**: Parent (Architecture)
**Agent**: Ada

---

## Success Criteria Verification

| Criteria | Status |
|----------|--------|
| Easing token system supports both `cubicBezier` and `linear` (piecewise) types | ✅ |
| `easingGlideDecelerate` primitive token defined with stops array | ✅ |
| All 3 platform builders generate correct output for linear easing type | ✅ |
| DTCG generator handles new easing type | ✅ |
| Figma transformer handles new easing type | ✅ |
| All existing easing tests continue passing unchanged | ✅ |
| New tests cover linear easing path in each generator | ✅ |

## Subtask Summary

| Task | Description | Key Outcome |
|------|-------------|-------------|
| 1.1 | iOS easing research spike | `CustomAnimation` protocol selected (Option C). `UnitCurve` rejected (no piecewise support). `KeyframeAnimator` rejected (wrong API shape). Lina confirmed composition with four-phase choreography. |
| 1.2 | Extend easing token type system | Added `EASING` category, `easingType`/`stops`/`easingDuration` fields to `PrimitiveToken`. Defined `easingGlideDecelerate` (15 stops, 350ms). |
| 1.3 | Update platform builders | Web: CSS `linear()`. iOS: `PiecewiseLinearEasing` struct via `CustomAnimation`. Android: `PiecewiseLinearEasing` class via `Easing` interface. Binary search interpolation on iOS/Android. |
| 1.4 | Update DTCG generator and Figma transformer | Added `linearEasing` DTCGType. Per-token `$type` in easing group. Figma resolves linear stops to `linear()` string. |
| 1.5 | Tests for linear easing path | +5 new tests across Web, iOS, Android, cross-platform, and Figma test files. |
| 1.6 | Steering documentation updates | Token-Family-Motion.md updated via ballot measure. All Material Design references removed per Peter's direction. |

## Files Modified

| File | Change |
|------|--------|
| `src/types/PrimitiveToken.ts` | Added `EASING` to `TokenCategory`. Added `easingType`, `stops`, `easingDuration` optional fields. |
| `src/tokens/EasingTokens.ts` | Added `generateLinearEasingPlatformValues()`. Updated 3 tokens to `EASING` category. Defined `easingGlideDecelerate`. |
| `src/tokens/index.ts` | Added `EASING` to `allTokens` map. |
| `src/build/platforms/WebBuilder.ts` | Linear easing → CSS `linear()` output. |
| `src/build/platforms/iOSBuilder.ts` | `PiecewiseLinearEasing` struct + `Animation()` constant generation. |
| `src/build/platforms/AndroidBuilder.ts` | `PiecewiseLinearEasing` class + instance generation. |
| `src/generators/types/DTCGTypes.ts` | Added `'linearEasing'` to `DTCGType`. |
| `src/generators/DTCGFormatGenerator.ts` | Added `'linearEasing'` to `VALID_DTCG_TYPES`. Updated `generateEasingTokens()` for mixed types. |
| `src/generators/transformers/FigmaTransformer.ts` | Added `linearEasing` to type mapping and value resolution. |
| `.kiro/steering/Token-Family-Motion.md` | Added piecewise linear easing docs. Removed Material Design references. |

## Test Results

- 295 suites, 7485 tests, 0 failures
- Net +5 tests (7480 → 7485)
- No regressions
