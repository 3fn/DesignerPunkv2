# Lina Review: Android Indicator Shadow + Icon currentColor

**Date**: 2026-03-12
**Spec**: 049 — Nav-SegmentedChoice-Base
**Author**: Lina
**Type**: Design feedback (Ada dependency)

---

## 1. Android Modifier.shadow() — Confirmed Correct

The design outline's guidance is correct: the indicator must use `Modifier.shadow()`, not `Surface(elevation = ...)` or the `mapShadowToElevation()` pipeline.

**Why**: Android elevation is absolute. An indicator at `elevation = 2.dp` inside a Card at `8.dp` renders *below* its parent — the shadow disappears. `Modifier.shadow()` renders a purely visual shadow without affecting z-ordering.

**One amendment**: The outline says `.clip(shape)` after `.shadow()` "may need" to be applied. It should be "must." Without `.clip(shape)`, the shadow can bleed outside rounded corners on some Android versions. Recommend updating the design outline from "May need `.clip(shape)`" to "Must apply `.clip(shape)` after `.shadow()`".

**Shadow choreography**: Animating elevation between `0.dp` and `2.dp` via `animateDpAsState` is sound for the fade-out/fade-in phases.

**Implication for Ada**: `shadow.navigation.indicator` cannot use the standard `mapShadowToElevation()` pipeline on Android. The token definition should note that Android consumption is direct `Modifier.shadow()` with explicit elevation, not routed through the elevation mapping utility.

---

## 2. Icon currentColor Inheritance — Confirmed Working

The design outline states icon stroke color inherits from `color.action.navigation` via `currentColor`. Verified in Icon-Base source:

- `createIconBase()` defaults `color` prop to `'inherit'`
- When `color === 'inherit'`, stroke is set to `currentColor`
- SVG renders with `stroke="${strokeColor}"` → `stroke="currentColor"`

**Conclusion**: Setting `color: var(--color-action-navigation)` on the segment container is sufficient. Icon-Base will inherit it through `currentColor`. No special handling needed.
