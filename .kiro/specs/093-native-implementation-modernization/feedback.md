# Spec Feedback: Native Implementation Modernization

**Spec**: 093-native-implementation-modernization
**Created**: 2026-04-03

---

## Design Outline Feedback

### Context for Reviewers

Lina developed this outline to address systemic patterns from Spec 091's native readiness sweep. 5 code fixes, 2 design decisions, 3 deferred. ~2 days estimated effort. Ada input requested on iOS easing consumption API.

### Ada — Token Review

**Issue 1 (P1 Easing) — iOS consumption API confirmed.**

The generated Swift output provides two levels:

- **Semantic motion tokens** (preferred): `DesignTokens.MotionFocusTransition.easing` returns an `Animation` (`Animation.timingCurve(0.4, 0.0, 0.2, 1)`). Duration is a separate `TimeInterval`.
- **Raw easing tokens**: `DesignTokens.Easing.easingStandard` — also an `Animation`.

Recommended consumption pattern:

```swift
// When a semantic motion token matches the use case (preferred):
withAnimation(DesignTokens.MotionFocusTransition.easing) { ... }

// When combining easing + duration from separate tokens:
withAnimation(DesignTokens.Easing.easingStandard.speed(1.0 / DesignTokens.Duration.duration150)) { ... }
```

The `.speed()` modifier adjusts the animation's duration relative to its default (1 second for `timingCurve`). It's verbose but correct — SwiftUI's `withAnimation` takes an `Animation`, not separate easing + duration parameters.

**Trade-off to acknowledge**: The current hard-coded `.easeInOut(duration:)` is simpler code for a subtle visual difference (symmetric vs asymmetric easing). The spec should be explicit that we're choosing token correctness over code simplicity. Right call for a design system, but worth documenting.

**Issue 2 (Button-CTA Android) — `minWidth` values need investigation.**

The outline says `minWidth` and `touchTargetHeight` should derive from sizing/accessibility tokens. Specifics:

- `touchTargetHeight` (48, 56): 48 = `size600` or `tapAreaRecommended`, 56 = `size700`. Covered.
- `minWidth` (56, 72, 80): 56 = `size700` ✅, 80 = `size1000` ✅, but **72 is not on the sizing scale** (not a multiple of 8). This value may need to remain a component constant, or we need to verify whether 72 is the correct design intent.

**Action**: Lina to verify which Button-CTA hard-coded values map to existing tokens before requirements assume full tokenization. Some may legitimately remain as component constants.

**Issues 5, 6, 7 — No token concerns.** Agree with all three resolutions. No new tokens needed for this spec.

**No new tokens needed.** All fixes use existing tokens or existing patterns.

---

## Requirements Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]
