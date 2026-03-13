# Task 1.1 Completion: iOS Easing Research Spike

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.1 — iOS easing research spike
**Type**: Architecture
**Agent**: Ada (token pipeline) + Lina (iOS platform review)

---

## What Was Done

Researched iOS 17+ APIs for representing piecewise linear easing curves as static constants. Evaluated three options:

| Option | API | Verdict |
|--------|-----|---------|
| A | `UnitCurve` | Dead end — only supports cubic bezier and constant-speed linear |
| B | `KeyframeAnimator` + `LinearKeyframe` | Wrong API shape — View modifier, not reusable `Animation` value |
| C | `CustomAnimation` protocol | **Selected** — static `Animation` constant, same consumption as cubic bezier |

## Architecture Decision

**`CustomAnimation` with `PiecewiseLinearEasing` struct**, storing duration on the struct (coupled to time scale).

Generated iOS output pattern:
```swift
struct PiecewiseLinearEasing: CustomAnimation {
    let stops: [(time: Double, progress: Double)]
    let duration: Double
    func animate<V>(...) -> V? { /* normalize time, interpolate stops */ }
}

public static let easingGlideDecelerate = Animation(
    PiecewiseLinearEasing(stops: [...], duration: 0.35)
)
```

## Key Decisions

1. **Duration coupled to struct** — piecewise linear curves are shape-specific to time scale (unlike scale-invariant cubic bezier). Lina and Ada agreed, Peter confirmed.
2. **One data shape for all platforms** — stops array `Array<[number, number]>` as `(time, progress)` works for web (`linear()`), iOS (`CustomAnimation`), and Android (custom `Easing`).
3. **Android direction** — custom `Easing` with lookup table (same pattern as iOS). `keyframes` rejected for same API shape reason as iOS Option B.

## Lina's Review

Confirmed Option C. Addressed three composition questions:
- `CustomAnimation` scopes identically to built-in animations in `withAnimation` blocks
- Interruptibility handled by default `shouldMerge` (starts from current position, no snap-back)
- `animate()` receives elapsed seconds, not normalized time — struct must normalize against stored duration

## Artifacts

- Findings doc: `.kiro/specs/049-nav-segmentedchoice-base/findings/ada-ios-easing-research-spike.md`

## Impact on Remaining Tasks

- **1.2**: Token data shape confirmed — `type` discriminator + stops array + paired duration for linear type
- **1.3 iOS**: Generate `PiecewiseLinearEasing` struct + `Animation()` constant (more output than cubic bezier)
- **1.3 Android**: Custom `Easing` with lookup table (not `keyframes`)
- **1.4**: DTCG/Figma handle stops array format
- **1.5**: Tests cover new generation paths
