# Task 1.5 Completion: Tests for Linear Easing Path

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.5 — Tests for linear easing path
**Type**: Implementation
**Agent**: Ada

---

## What Was Done

Added dedicated linear easing tests to all 6 specified test files. Verified all existing easing tests continue passing.

### New Tests Added

| File | Test |
|------|------|
| `WebMotionTokenGeneration.test.ts` | Verifies CSS `linear()` output, stop format, no cubic-bezier on linear token. Updated count 3→4. |
| `iOSMotionTokenGeneration.test.ts` | Verifies `PiecewiseLinearEasing` struct generation, `Animation()` constant, duration, stops. |
| `AndroidMotionTokenGeneration.test.ts` | Verifies `PiecewiseLinearEasing` class generation, Kotlin `Pair` syntax. |
| `MotionTokenCrossPlatformIntegration.test.ts` | Verifies linear easing present on all 3 platforms with correct format. |
| `DTCGFormatGenerator.test.ts` | Already updated in 1.4 — verifies both `cubicBezier` and `linearEasing` types. |
| `FigmaTransformer.variables.test.ts` | Verifies `linearEasing` type resolves to STRING with `linear()` value. |

### Net Test Changes

+5 new tests across 5 files (DTCG test was already updated in 1.4).

## Validation

- All 6 target files: 147 tests passing
- Full token/build/generator/validator scope: 115 suites, 2906 tests, 0 failures
- All existing easing tests unchanged and passing
