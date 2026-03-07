# Task 3.2 Completion: Web — Add Scroll Slide Animation

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 3.2 — Web: Add scroll slide animation
**Agent**: Lina (component implementation)
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Added positional slide animation when the visible window shifts. Nodes slide left on forward navigation, right on backward. Composes with the scale animation from 3.1 — `translateX` is on the outer custom element, `scale()` is on the inner `.node` via Shadow DOM.

---

## Changes

### ProgressPaginationBase.web.ts

- Added `_prevWindowStart` field to track previous window position
- On window shift: calculates pixel offset (`shift × stride`), applies `translateX` with `transition: none`, then removes on next frame via double-rAF to trigger CSS transition back to origin
- Stride per variant: sm=20px (16+4), md=24px (20+4), lg=32px (24+8)
- Reduced motion: checks `matchMedia('(prefers-reduced-motion: reduce)')` — skips slide when active
- JSDOM safety: `typeof globalThis.matchMedia === 'function'` guard — slide block skipped in test environment

## How It Works

1. `_render()` detects window shift by comparing `window.start` to `_prevWindowStart`
2. If shifted, each node gets `style.transform = translateX(offset)` with `transition: none` (instant positioning)
3. Double `requestAnimationFrame` ensures the browser paints the offset position
4. Then `style.transition` is set to the motion token timing and `style.transform` is cleared
5. CSS transition animates from the offset back to origin — visual slide effect

## Composition with Scale

- `translateX` is applied on the `<progress-indicator-node-base>` custom element (the flex child)
- `scale()` is applied on the internal `.node` element inside Shadow DOM
- Different elements, no conflict — they compose naturally

---

## ⚠️ GATE: Peter Demo Verification Required

Per task definition: "Peter verifies web demo after this task — must approve feel before native work."

---

## Verification

- Pagination-Base tests: 35/35 passed ✅
- Node-Base tests: 19/19 passed ✅
- Full suite: 291 suites, 7457 tests passed ✅
