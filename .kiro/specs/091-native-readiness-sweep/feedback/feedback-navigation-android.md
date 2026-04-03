# Task 3.8 Review: Navigation Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Nav-SegmentedChoice-Base, Nav-TabBar-Base (sanity check)

---

## Nav-SegmentedChoice-Base

**Gold standard. The best-engineered component in the catalog.**

#### Contract Compliance — All Satisfied

Every contract is explicitly referenced in code comments. The four-phase indicator animation (shadow out → resize + glide → shadow in) with per-phase easing tokens is the most sophisticated animation in the codebase.

#### Strengths
- Every `tween()` call has explicit easing from `DesignTokens.Easing.*` — the only component that does this consistently across all animations
- Reduced motion via `TRANSITION_ANIMATION_SCALE` with `snapTo()` fallback — correct
- Re-entrant animation handling: if selection changes mid-animation, snaps to new position instead of queuing — prevents visual glitches
- `require(segments.size >= 2)` — fail-loudly validation, consistent with Progress-Bar-Base
- Fallback to first segment when `selectedValue` doesn't match any segment — graceful degradation
- `Role.Tab` + `selected` semantics per segment — correct TalkBack pattern for tablist
- Arrow key navigation with wrapping (left/up = previous, right/down = next) — correct keyboard pattern
- `FocusRequester` per segment for programmatic focus management
- `BoxWithConstraints` for measuring total width and calculating segment positions — correct approach
- `Animatable` for indicator offset/width/shadow — proper Compose animation primitive for interruptible animations
- All tokens referenced via `DesignTokens.*` — zero hard-coded values

#### Concerns

**C1: `iconSize` in `NavSegmentedChoiceSize` returns `Int` (28, 24) instead of `Dp` — NON-BLOCKING.**
```kotlin
val iconSize get() = when (this) {
    STANDARD -> 28
    CONDENSED -> 24
}
```
These should reference `DesignTokens.icon_size_125` (28dp) and `DesignTokens.icon_size_100` (24dp). The values are correct but not token-driven. Minor inconsistency in an otherwise exemplary component.

**C2: Uses `TRANSITION_ANIMATION_SCALE` instead of `ANIMATOR_DURATION_SCALE` — NON-BLOCKING.**
Same inconsistency as Input-Text-Base. Both settings are typically set together, but `ANIMATOR_DURATION_SCALE` is the canonical one for Compose animations.

---

## Nav-TabBar-Base (Sanity Check)

**In good shape for a pre-Data component. One known issue.**

#### Strengths
- `selectableGroup()` semantics — correct TalkBack tablist pattern
- Explicit easing on glide animation: `DesignTokens.Easing.EasingGlideDecelerate`
- Reduced motion handling present
- Token-driven colors, sizes, and spacing throughout `NavTabBarTokens`
- Three-phase dot animation (similar to SegmentedChoice but simpler)

#### Concerns

**C3: `NavTabBarTokens.borderWidth.dp` — BLOCKING.**
Line 207: `Divider(color = NavTabBarTokens.borderColor, thickness = NavTabBarTokens.borderWidth.dp)`. `borderWidth` is `DesignTokens.border_default` which is already `Dp`. Appending `.dp` is the same pattern flagged across the sweep. Should be just `NavTabBarTokens.borderWidth`.

**C4: Material `Divider` for top stroke — NON-BLOCKING.**
Same convention issue as other components. Token-driven `Box` with height/background would be more consistent with DesignerPunk patterns. The `Divider` works but introduces Material theme dependency.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Nav-SegmentedChoice-Base | 0 | 2 (C1-C2) | Gold standard. Reference implementation. |
| Nav-TabBar-Base | 1 (C3) | 1 (C4) | Good. `.dp` on Dp fix needed. |

**Ship readiness:** SegmentedChoice is ship-ready as-is. TabBar needs the `.dp` fix — one-liner.
