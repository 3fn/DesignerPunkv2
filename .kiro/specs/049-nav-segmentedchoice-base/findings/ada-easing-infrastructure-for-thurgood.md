# Ada Findings: Piecewise Linear Easing Token Infrastructure

**Date**: 2026-03-12
**Spec**: 049 — Nav-SegmentedChoice-Base
**Author**: Ada
**For**: Thurgood (task formalization)
**Type**: Infrastructure requirement with implementation guidance

---

## Context

Spec 049's indicator glide animation uses a piecewise linear easing curve that can't be expressed as a cubic-bezier. Peter approved tokenizing it to prevent cross-platform drift. This requires extending the easing token infrastructure.

## The Curve

```css
linear(0, 0.012 0.9%, 0.05 2%, 0.411 9.2%, 0.517 11.8%, 0.611 14.6%,
0.694 17.7%, 0.765 21.1%, 0.824 24.8%, 0.872 28.9%, 0.91 33.4%,
0.939 38.4%, 0.977 50.9%, 0.994 68.4%, 1)
```

Character: Aggressive deceleration with long settling tail. 41% of movement in first 10% of time. No overshoot. Weighted slide-to-stop feel.

## Files That Need Changes

### 1. Token Definition — `src/tokens/EasingTokens.ts`

Current structure assumes cubic-bezier string in `platforms.web.value`. New token needs:
- A `type` discriminator (`cubicBezier` | `linear`)
- A stops array: `Array<[number, number]>` where each entry is `[progress, timePercent]`

Suggested token name: `easingGlideDecelerate`

Consider: the `PrimitiveToken` interface uses `baseValue: number` which doesn't fit an array of stops. May need a type union or a new field. The `generateEasingPlatformValues()` function currently takes a single cubic-bezier string — needs an overload or conditional path.

### 2. Web Builder — `src/build/platforms/WebBuilder.ts`

`generateEasingTokens()` (line 694) currently outputs:
```css
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
```

For linear type, needs to output:
```css
--easing-glide-decelerate: linear(0, 0.012 0.9%, 0.05 2%, ...);
```

The `toCSSVariableName()` helper should work as-is.

### 3. iOS Builder — `src/build/platforms/iOSBuilder.ts`

`generateEasingTokens()` (line 1324) currently outputs:
```swift
public static let easingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1)
```

For linear type, the equivalent is `KeyframeAnimator` with `LinearKeyframe` segments (iOS 17+). However, `KeyframeAnimator` is a View-level API, not a reusable `Animation` value. The more practical approach may be generating a helper function that returns keyframe timing data, or a `UnitCurve` with linear segments.

**This is the trickiest platform.** Recommend researching `UnitCurve` (iOS 17) as a potential fit — it can represent arbitrary curves as a callable that maps time → progress.

### 4. Android Builder — `src/build/platforms/AndroidBuilder.ts`

`generateEasingTokens()` (line 1083) currently outputs:
```kotlin
val EasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
```

For linear type, Compose `keyframes` is the equivalent:
```kotlin
keyframes {
    durationMillis = 350
    0.0f at 0
    0.012f at 3   // 0.9% of 350ms
    0.05f at 7    // 2% of 350ms
    // ...
}
```

**Important**: `keyframes` is an `AnimationSpec`, not an `Easing`. This is a type-level difference from `CubicBezierEasing`. The generated code structure may need to accommodate both types. One option: generate a custom `Easing` implementation that does the linear interpolation lookup internally, keeping the consumer API consistent.

### 5. DTCG Generator — `src/generators/DTCGFormatGenerator.ts`

`generateEasingTokens()` (line 466) assumes all easing tokens are `cubicBezier` type with 4-element arrays. Needs a new DTCG type. The DTCG spec doesn't define a `linear` easing type — this would be a custom extension. Consider using `$type: 'cubicBezier'` for cubic-bezier tokens and a custom `$type` (e.g., `'linearEasing'` or a vendor-prefixed type) for piecewise linear.

Also update `DTCGTypes.ts` (line 20) which defines the allowed types.

### 6. Figma Transformer — `src/generators/transformers/FigmaTransformer.ts`

Line 740 handles `cubicBezier` case. Needs a `linear` / `linearEasing` case. Line 775 stringifies cubic-bezier arrays — needs equivalent for stops arrays.

### 7. Steering Documentation

- **Token-Family-Motion.md** (or equivalent easing section): Document the new easing type, the `easingGlideDecelerate` token, and platform generation differences
- **Rosetta-System-Architecture.md**: If the easing type extension changes the primitive token type system, note it

### 8. Tests

Files with easing-specific assertions:
- `src/build/__tests__/WebMotionTokenGeneration.test.ts` (6 easing matches)
- `src/build/__tests__/iOSMotionTokenGeneration.test.ts` (5 easing matches)
- `src/build/__tests__/AndroidMotionTokenGeneration.test.ts` (4 easing matches)
- `src/build/__tests__/MotionTokenCrossPlatformIntegration.test.ts` (5 easing matches)
- `src/generators/__tests__/DTCGFormatGenerator.test.ts` (assumes cubicBezier type)
- `src/generators/__tests__/FigmaTransformer.variables.test.ts` (cubicBezier assertions)

Existing tests should continue passing unchanged (they test cubic-bezier tokens). New tests needed for the linear easing path in each generator.

## Considerations

1. **Naming**: `easingGlideDecelerate` communicates the motion character. Open to alternatives — `easingWeightedDecelerate`, `easingSlideSettle`, etc. Peter should approve the final name.

2. **Reusability**: This is the first piecewise linear easing, but likely not the last. The infrastructure should support arbitrary stops arrays, not be hardcoded to this specific curve.

3. **iOS complexity**: This is the highest-risk platform. `KeyframeAnimator` and `UnitCurve` are iOS 17+ APIs. If the system needs to support iOS 16, a fallback cubic-bezier approximation may be needed. Worth checking minimum iOS target.

4. **Semantic motion token**: The design outline deliberately does NOT create a semantic motion token for the glide (e.g., `motion.indicatorGlide`). The fast phases and glide are choreography details composed at the component level. If Thurgood disagrees and thinks a semantic token is warranted, that's a valid counterpoint — but Peter and I discussed this and landed on primitive refs at the component level.

5. **Duration**: The glide uses `duration350` (existing primitive). No new duration token needed.
