# Task 3.3 Completion: Indicator Animation Choreography

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 3.3 — Indicator animation choreography
**Agent**: Lina
**Type**: Architecture
**Validation Tier**: Tier 3 — Comprehensive

---

## Summary

Implemented the four-phase indicator animation choreography: shadow out → resize + glide (simultaneous) → shadow in. Uses CSS transitions with JS-orchestrated phase sequencing via `transitionend` events. Consumes Ada's easing token infrastructure including the new `easingGlideDecelerate` piecewise linear curve via `linear()` CSS function.

## Files Modified

| File | Action |
|------|--------|
| `platforms/web/NavSegmentedChoiceBase.web.ts` | Modified — animation state, choreography engine, reduced motion |

## Implementation Details

### Animation Architecture
- **Phase sequencing**: Async method (`_animateIndicator`) chains CSS transitions via `transitionend` promises
- **Phase 1 — Shadow out**: `box-shadow` transitions to `none` (150ms, `var(--easing-accelerate)`)
- **Phase 2+3 — Resize + Glide**: `inline-size` (150ms, `var(--easing-standard)`) and `inset-inline-start` (350ms, `var(--easing-glide-decelerate)`) run simultaneously; waits for the longer glide transition
- **Phase 4 — Shadow in**: `box-shadow` transitions back to CSS default (150ms, `var(--easing-decelerate)`)
- **Cleanup**: Transition property cleared after completion

### Token Consumption
- Duration: `calc(var(--duration-150) * 1ms)` and `calc(var(--duration-350) * 1ms)` — unitless tokens converted to ms
- Easing: `var(--easing-standard)`, `var(--easing-accelerate)`, `var(--easing-decelerate)` (cubic-bezier), `var(--easing-glide-decelerate)` (piecewise linear via `linear()`)
- Shadow: Falls back to CSS default `var(--shadow-navigation-indicator)` when inline `boxShadow` is cleared

### Initial Render (contract: animation_initial_render)
- `_isInitialRender` flag tracked; `_updateIndicator()` sets `transition: none` and positions instantly
- Flag cleared after first render

### Reduced Motion (contract: accessibility_reduced_motion)
- JS checks `window.matchMedia('(prefers-reduced-motion: reduce)')` before animating
- CSS safety net: `@media (prefers-reduced-motion: reduce)` sets `transition: none !important` on indicator
- Both layers collapse all phases to instant position change

### Re-entrant Protection
- `_animating` flag prevents overlapping animations
- If a new selection occurs mid-animation, indicator snaps to new position instantly

### Token Compliance
- Initial implementation used `rgba(0,0,0,0)` for shadow-out — caught by TokenCompliance test
- Fixed to use `box-shadow: none` — no hard-coded color values

## Contracts Addressed

| Contract | Status |
|----------|--------|
| `animation_coordination` | ✅ Implemented — four-phase sequence with correct timing/easing tokens |
| `animation_initial_render` | ✅ Implemented — no animation on mount |
| `accessibility_reduced_motion` | ✅ Implemented — JS check + CSS safety net |

## Validation

- Build: clean (1.55 MB raw, ~298.07 KB gzipped)
- Full suite: 296 suites, 7517 tests, 0 failures
- Token compliance: passes (no hard-coded colors)
