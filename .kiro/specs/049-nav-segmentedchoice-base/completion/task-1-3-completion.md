# Task 1.3 Completion: Update Platform Builders

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.3 — Update platform builders
**Type**: Implementation
**Agent**: Ada

---

## What Was Done

Updated all 3 platform builders to generate correct output for piecewise linear easing tokens alongside existing cubic bezier tokens.

### Changes

| File | Change |
|------|--------|
| `src/build/platforms/WebBuilder.ts` | Linear easing outputs CSS `linear()` function with stops as percentage positions |
| `src/build/platforms/iOSBuilder.ts` | Generates `PiecewiseLinearEasing` struct (CustomAnimation protocol) + `Animation()` constant |
| `src/build/platforms/AndroidBuilder.ts` | Generates `PiecewiseLinearEasing` class (Easing interface) with binary search interpolation |
| `src/build/__tests__/WebMotionTokenGeneration.test.ts` | Updated comment assertion |
| `src/build/validation/__tests__/MotionTokenCrossPlatformValidation.test.ts` | Updated easing count 3→4 |

### Generated Output

**Web:**
```css
--easing-glide-decelerate: linear(0, 0.012 0.9%, 0.05 2.0%, ...);
```

**iOS:**
```swift
struct PiecewiseLinearEasing: CustomAnimation { /* binary search + lerp */ }
public static let easingGlideDecelerate = Animation(PiecewiseLinearEasing(stops: [...], duration: 0.35))
```

**Android:**
```kotlin
class PiecewiseLinearEasing(private val stops: List<Pair<Float, Float>>) : Easing { /* binary search + lerp */ }
val EasingGlideDecelerate = PiecewiseLinearEasing(listOf(0f to 0f, ...))
```

### Design Notes

- Helper structs/classes generated once per file (only when linear easing tokens exist)
- Binary search interpolation in iOS and Android for O(log n) lookup
- Android `PiecewiseLinearEasing` implements `Easing` interface directly (not `AnimationSpec`)
- iOS duration stored on struct per 1.1 architecture decision
- Android `Easing.transform(fraction)` receives normalized 0–1 fraction natively — no duration needed on struct
- All existing cubic bezier output unchanged

## Validation

- `src/build/`: 49 suites, 890 tests, 0 failures
