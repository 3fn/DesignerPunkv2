# Ada Findings: iOS Piecewise Linear Easing Research Spike

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.1 — iOS easing research spike
**Author**: Ada
**For**: Lina (iOS platform review), Peter (approval)
**Type**: Architecture decision — iOS representation for piecewise linear easing

---

## Context

The indicator glide animation uses a piecewise linear easing curve (15 stops, aggressive deceleration with long settling tail). The token system needs to generate a static iOS constant, matching the pattern used for cubic bezier today:

```swift
// Current cubic bezier output
public static let easingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1.0)
```

Minimum iOS target: 17.0+ (confirmed in Core Goals).

## The Curve

```css
linear(0, 0.012 0.9%, 0.05 2%, 0.411 9.2%, 0.517 11.8%, 0.611 14.6%,
0.694 17.7%, 0.765 21.1%, 0.824 24.8%, 0.872 28.9%, 0.91 33.4%,
0.939 38.4%, 0.977 50.9%, 0.994 68.4%, 1)
```

Character: 41% of movement in first 10% of time, then long gentle settle. No overshoot.

---

## Options Evaluated

### Option A: `UnitCurve` (iOS 17+)

`UnitCurve` provides two factory methods:
- `.bezierCurve(startControlPoint:endControlPoint:)` — cubic bezier only
- `.linear` — constant-speed linear (not piecewise)

Plus `value(at:)` and `velocity(at:)` for querying progress.

**Does not support arbitrary piecewise linear curves with stops arrays.**

**Verdict: Dead end.** Cannot represent our 15-stop deceleration curve.

### Option B: `KeyframeAnimator` with `LinearKeyframe` (iOS 17+)

`KeyframeAnimator` is a View-level modifier. Each stop becomes a `LinearKeyframe` segment that interpolates linearly over a duration. Functionally represents the curve.

**Problems:**
- View modifier, not a reusable `Animation` value
- Cannot be stored as a static constant
- Component would consume the easing via `KeyframeAnimator` directly, not via a token-provided `Animation`
- Breaks the existing token consumption pattern where builders output static constants

**Verdict: Works functionally, wrong API shape.** Forces Lina to wire the animation differently on iOS vs web/Android.

### Option C: `CustomAnimation` protocol (iOS 17+) ← Recommended

iOS 17 introduced `CustomAnimation` — implement `animate(value:time:context:)` which receives elapsed time and returns interpolated value. A piecewise linear lookup table fits this exactly.

**Generated output would look like:**

```swift
public enum Easing {
    public static let easingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1.0)
    public static let easingGlideDecelerate = Animation(PiecewiseLinearEasing(stops: [
        (0, 0), (0.009, 0.012), (0.02, 0.05), (0.092, 0.411),
        (0.118, 0.517), (0.146, 0.611), (0.177, 0.694),
        (0.211, 0.765), (0.248, 0.824), (0.289, 0.872),
        (0.334, 0.91), (0.384, 0.939), (0.509, 0.977),
        (0.684, 0.994), (1.0, 1.0)
    ]))
}
```

The `PiecewiseLinearEasing` struct would also be generated:

```swift
struct PiecewiseLinearEasing: CustomAnimation {
    let stops: [(time: Double, progress: Double)]

    func animate<V>(value: V, time: TimeInterval,
                    context: inout AnimationContext<V>) -> V?
                    where V: VectorArithmetic {
        guard time <= 1.0 else { return nil }
        // Binary search stops, lerp between surrounding pair
        let progress = interpolate(at: time)
        return value.scaled(by: progress)
    }
}
```

**Strengths:**
- Static `Animation` constant — same consumption pattern as cubic bezier
- Lina uses `withAnimation(.easingGlideDecelerate)` identically to `.easingStandard`
- Supports interruptibility (SwiftUI manages `CustomAnimation` lifecycle)
- Reusable for future piecewise linear curves
- No external dependencies

**Risks / questions for Lina:**
1. Does `CustomAnimation` compose correctly with `withAnimation` scoping in the four-phase choreography? (shadow out → glide → shadow in are sequenced)
2. Any interruptibility gotchas when a `CustomAnimation` is interrupted mid-animation by a new selection?
3. The `animate()` function receives normalized time (0→1) only if we handle duration externally. The component applies duration via the token (`duration350`). Does this create any timing conflicts?

---

## Recommendation

**Option C (`CustomAnimation`)** — it's the only approach that preserves the static constant pattern, keeps iOS consumption identical to cubic bezier, and supports arbitrary stops arrays for future reuse.

**Ada's confidence**: High from the token generation side. The iOS builder can generate both the `PiecewiseLinearEasing` struct and the token constant.

**Needs Lina's sign-off**: She's wiring this into the four-phase choreography. If `CustomAnimation` has composition issues with sequenced `withAnimation` blocks, we need to know before building the infrastructure.

---

## Data Shape Impact

If Option C is confirmed, the token data shape does NOT need iOS-specific changes. The stops array `Array<[number, number]>` (time, progress) works for all three platforms:
- **Web**: Generates CSS `linear()` function
- **iOS**: Generates `PiecewiseLinearEasing` struct + `Animation()` constant
- **Android**: Generates custom `Easing` with lookup table (same interpolation logic)

This simplifies Task 1.2 — one data shape, three platform-specific outputs.

---

## Lina Platform Review (2026-03-13)

**Verdict: Option C confirmed.** `CustomAnimation` is the correct approach. Sign-off below addresses Ada's three questions, plus one open item.

### Q1: `CustomAnimation` Composition with Four-Phase Choreography

Works correctly. `CustomAnimation` conforms to `Animation`, so `withAnimation(Animation(PiecewiseLinearEasing(...)))` scopes identically to `withAnimation(.timingCurve(...))`. SwiftUI doesn't distinguish built-in curves from `CustomAnimation` in scoping — each `withAnimation` block targets its properties regardless of the underlying animation type.

The shadow out → glide → shadow in → content crossfade sequence uses different easings per phase. This works with built-in animations today and `CustomAnimation` doesn't change the scoping mechanism. Worth a smoke test during iOS implementation (Task 4), but not a blocker for Task 1.

### Q2: Interruptibility on Mid-Animation Interruption

SwiftUI manages `CustomAnimation` lifecycle identically to built-in animations. On interruption, SwiftUI calls `shouldMerge(previous:value:time:context:)`. Default implementation returns `true` — new animation starts from current interpolated position. No snap-back. This is the correct behavior for indicator glide (user taps a new segment while glide is in progress).

Custom merge behavior (e.g., velocity-preserving interruption) is available via `shouldMerge` override if needed later. Default is sufficient for initial implementation.

### Q3: Normalized Time and Duration

No conflict, but one nuance. `CustomAnimation.animate()` receives elapsed time in **seconds**, not normalized 0→1. The stops array from the CSS `linear()` format is already normalized (fractions of total duration): `(0, 0), (0.009, 0.012), ...`. The struct needs to normalize `time` against the animation's total duration.

`CustomAnimation` does not receive total duration in `animate()` — the `context` parameter has `context.environment` but not duration. Standard pattern is to store duration on the struct:

```swift
struct PiecewiseLinearEasing: CustomAnimation {
    let stops: [(time: Double, progress: Double)]
    let duration: Double  // needed for time normalization

    func animate<V>(value: V, time: TimeInterval,
                    context: inout AnimationContext<V>) -> V?
                    where V: VectorArithmetic {
        let t = min(time / duration, 1.0)
        guard t < 1.0 else { return nil }
        let progress = interpolate(at: t)
        return value.scaled(by: progress)
    }
}
```

Token constant would be:

```swift
public static let easingGlideDecelerate = Animation(
    PiecewiseLinearEasing(stops: [...], duration: 0.35)  // duration350
)
```

### Open Item: Duration Coupling

Storing duration on the struct couples easing to a specific duration at the token level. This is a departure from cubic bezier (duration-agnostic).

**Alternative:** Assume 1-second base duration, apply real duration via `.speed()` modifier: `withAnimation(.easingGlideDecelerate.speed(1.0 / 0.35))`. Keeps easing and duration decoupled but makes component consumption uglier.

**Lina's preference:** Store duration on the struct. The coupling is acceptable because the glide easing is designed for a specific time scale — the 15-stop deceleration curve shape assumes ~350ms. The same curve at 100ms would feel completely different. Easing and duration are semantically linked for piecewise linear curves in a way they aren't for cubic bezier.

**[@ADA]** Which pattern do you prefer from the token generation side? Duration on the struct (coupled, clean consumption) vs. 1-second base with `.speed()` (decoupled, ugly consumption)? This should be resolved before building the iOS builder output.

### Ada Response to Duration Coupling (2026-03-13)

**Duration on the struct. Coupled, clean consumption.**

Reasons:
1. iOS builder just needs a `duration` field on linear easing tokens — clean to generate
2. Piecewise linear curves are shape-specific to a time scale (Lina's semantic argument is correct — 350ms curve at 100ms distorts the motion character)
3. `.speed()` pushes complexity to every consumption site

Counter-argument: reusing the same easing at different durations requires separate tokens. But if the curve shape doesn't work at a different duration, you'd want a different curve anyway (YAGNI).

**Peter confirmed. Open item resolved.**
