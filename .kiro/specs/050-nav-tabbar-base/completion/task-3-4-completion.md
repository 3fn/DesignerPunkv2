# Task 3.4 Completion: Selection Animation Choreography

**Date**: 2026-03-18
**Task**: 3.4 Selection animation choreography
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

- `src/components/core/Nav-TabBar-Base/platforms/web/NavTabBarBase.web.ts` — Rewrote with animation choreography
- `src/components/core/Nav-TabBar-Base/platforms/web/NavTabBarBase.styles.css` — Added dot positioning, animation phase classes

## Implementation Details

**Architecture change**: Dot indicator moved from per-tab-item element to a single absolutely-positioned element (`tab-bar__dot`) in the container. This enables smooth CSS transition between tab positions without DOM manipulation during animation.

**Shared `_selectTab()` method**: Click and keyboard handlers both delegate to `_selectTab()`, which:
1. Fires `onSelectionChange` callback immediately (before animation — R3 callback timing)
2. Dispatches `selection-change` CustomEvent
3. Routes to `_animateSelection()` or immediate update based on reduced motion / initial render

**Three-phase `_animateSelection()`**:
- Phase 1 (0ms): Adds `tab-item--departing` class → CSS transitions glow `::before` opacity to 0 over `duration150` with `easingAccelerate`
- Phase 2 (after duration150): Dot gets CSS `transition: left duration350 easingGlideDecelerate`, `left` set to arriving tab center
- Phase 3 (~80% through Phase 2): `_updateTabs()` snaps icon swap (outline↔solid), adds `tab-item--arriving` class → CSS transitions glow opacity to 1 over `duration150` with `easingDecelerate`
- Cleanup (after Phase 3 duration150): Removes phase classes, clears transitions, resets `_animating` flag

**Motion token usage**: All timing read from CSS custom properties (`--duration-150`, `--duration-350`) via `getComputedStyle()`. Easing functions referenced as CSS custom properties in transition strings. No hard-coded timing values in animation logic.

**Reduced motion**: `_prefersReducedMotion()` checks `prefers-reduced-motion: reduce`. When active, `_selectTab()` skips animation entirely — immediate `_updateTabs()` + `_positionDot()`. CSS `@media (prefers-reduced-motion: reduce)` also forces `transition: none !important` on all animated elements.

**Initial render**: `_isInitialRender` flag prevents animation on first render. Selected tab appears immediately in active state.

**Re-entrant protection**: `_animating` flag prevents overlapping animations. If selection changes during animation, snaps to new state immediately.

## Validation (Tier 2: Standard)

- ✅ TypeScript compiles clean
- ✅ Component MCP: 136/136 tests pass
- ✅ All timing uses motion token CSS custom properties (no hard-coded values)
- ✅ Callback fires before animation begins
- ✅ Reduced motion bypasses all animation
- ✅ Initial render has no animation
- ✅ Icon swap is snap (DOM rebuild), not crossfade

## Requirements Trace

- R3 AC1: Three-phase sequence (depart → glide → arrive) ✅
- R3 AC2: Glow dims on departing tab (opacity transition) ✅
- R3 AC3: Dot glides, icon swap snaps when arriving glow begins ✅
- R3 AC4: Arriving icon lifts + glow brightens, overlaps Phase 2 at ~80% ✅
- R3 AC5: Reduced motion collapses to immediate state change ✅
- R3 AC6: Initial render — no animation ✅
- R3 AC7: All timing uses Rosetta motion tokens ✅
