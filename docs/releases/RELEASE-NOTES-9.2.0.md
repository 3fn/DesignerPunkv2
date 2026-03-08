# Release Notes: v9.2.0 — Pagination Animation & Render-All-Dots Architecture

**Date**: 2026-03-08
**Specs**: 072 (Pagination Container Styling), 073 (Opacity Architecture Evolution), 074 (Pagination Animation)
**Previous**: v9.1.0

---

## What's New

Progress-Pagination-Base gains smooth, split-timed animation across all three platforms, powered by a new rendering architecture that replaces the windowed buffer model entirely. The opacity token system evolves to `color-mix()` based architecture with theme-aware semantic tokens.

### Render-All-Dots Architecture (Spec 074)

The pagination component previously rendered a windowed subset of 7 nodes (1 buffer + 5 visible + 1 buffer). Buffer nodes in flex layout caused persistent centering bugs. The new architecture renders all dots in a flex track inside a fixed-width clipping viewport, with track-level `translateX` centering clamped at edges.

- **Web**: `overflow: hidden` + `clip-path: inset(0 2px round var(--radius-full))` for pill-shape clipping. Track `translateX` animated via CSS transition.
- **iOS**: `ScrollViewReader` + `scrollTo(anchor: .center)` — native scroll centering.
- **Android**: `LazyRow` + `ScrollState` + `animateScrollToItem()` — native scroll centering.

The public API is unchanged. Same attributes, same ARIA behavior, same visual output. The change is entirely internal.

### Split-Timing Motion

New semantic token: `motion.settleTransition` (350ms, easingDecelerate).

Pagination dots now use split timing:
- **Scale**: `motion.selectionTransition` (250ms, easingStandard) — snappy response
- **Color + slide**: `motion.settleTransition` (350ms, easingDecelerate) — smooth follow-through

The `settleTransition` token is general-purpose — available for any component that needs a decelerate-into-rest-position feel.

### Scale-Based Sizing

New `sizing="scale"` attribute on Progress-Indicator-Node-Base. When set, the node uses a fixed layout box at current-state size with `transform: scale()` for inactive states. This eliminates layout reflow during animation — no sibling displacement, no flex gap shifts.

The attribute is opt-in. Steppers (which render content inside nodes) are unaffected.

### Pagination Container Styling (Spec 072)

Pill-shaped container with scrim background, asymmetric padding (larger inline for pill curve clearance), and size-variant-specific gap tokens.

### Opacity Architecture Evolution (Spec 073)

Opacity tokens evolve from raw alpha values to `color-mix()` based architecture with theme-aware semantic tokens. Enables opacity that responds to theme context rather than being fixed values.

---

## By the Numbers

| Metric | v9.1.0 | v9.2.0 |
|--------|--------|--------|
| Test suites | 290 | 291 |
| Tests | 7,422 | 7,448 |
| Missing tokens | 0 | 0 |
| Semantic motion tokens | 1 | 2 |
| Behavioral contracts (Pagination) | 4 | 4 (1 rewritten) |

---

## Behavioral Contract Changes

`performance_virtualization` renamed to `rendering_and_animation`. The contract now describes the render-all-dots model with per-platform rendering details. All four Pagination-Base contracts verified via behavioral audit.

---

## New Token

| Token | Duration | Easing | Purpose |
|-------|----------|--------|---------|
| `motion.settleTransition` | 350ms (`duration-350`) | easingDecelerate | Follow-through animation for color transitions and positional settling |

---

## Process Notes

- Spec 074 Task 3 underwent a mid-task architectural pivot from windowed buffer to render-all-dots. The pivot was managed via a 6-gate realignment plan with strict sequencing.
- Three-agent coordination (Ada, Lina, Thurgood) with structured findings documents as handoffs — early proof-of-concept for inter-agent communication protocol.
- Split-timing decision made via Peter's DevTools experimentation, formalized as a new semantic token by Ada.

---

## Not Breaking

This is a minor release. The rendering architecture change is internal — the component's public API (attributes, ARIA, visual output) is identical to v9.1.0. `motion.settleTransition` is a new additive token. No existing tokens renamed or removed. No consumer code changes required.
