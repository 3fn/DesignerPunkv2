# Lina's Review: Task 3 — Animation Refinement

**Date**: 2026-03-07
**Reviewer**: Lina (Component Specialist)
**Subject**: Task 3 structure and implementation approach

---

## Positive

- Scale-based sizing (3.1) is the right fix. `width`/`height` animation causes layout reflow every frame — the flex container recalculates gap positions, producing the twitch. `transform: scale()` runs on the compositor layer with no layout recalculation.
- Peter verification gate on 3.2 before native work is smart — slide feel is subjective.
- Clean separation between layout-twitch fix (3.1) and scroll-slide (3.2).

---

## Concerns

### 1. Gap spacing with fixed layout box (3.1, 3.4) — Needs resolution before implementation

If every node's layout box is always the `current` size and inactive nodes scale down, the visual gap between scaled-down dots will be larger than the token-specified gap. Example for md: layout box = 20px, visual dot = 16px (scale 0.8), so there's 2px of invisible space on each side of every inactive dot. The visual gap becomes `token-gap + 4px` instead of `token-gap`.

Options:
- Accept the larger visual gap (simplest, may look fine)
- Compensate with negative margins (fragile, couples layout to scale ratio)
- Use a different layout box size and scale both directions (complex)

**Recommendation**: Implement 3.1 first, check the visual result, then decide. May need Ada's input if a layout-compensation token is warranted.

### 2. `translateX` next-frame pattern (3.2) — Consider alternatives

"Apply initial offset, remove on next frame" typically requires `requestAnimationFrame` double-buffering, which can be fragile across browsers. Alternative: use a CSS class toggle that controls `translateX` via transition, avoiding the manual rAF dance. Worth evaluating which is more robust.

### 3. Cross-component impact (3.1) — Node-Base is shared

Changing Node-Base CSS from `width`/`height` to `transform: scale()` affects all Node-Base consumers: Stepper-Base and Stepper-Detailed, not just Pagination-Base. Is the scale behavior intentional for steppers too? If not, the scale approach may need to be scoped (e.g., via a CSS class or attribute that Pagination-Base sets on its nodes).

### 4. iOS twitch assumption (3.3) — Verify, don't assume

SwiftUI's `.animation()` modifier animates layout changes implicitly via declarative diffing. The twitch may not exist. But it depends on whether SwiftUI animates the frame size change or just the visual. Quick verification needed before marking "may not need fix."

### 5. Missing: reduced motion for slide animation (3.2)

The existing `prefers-reduced-motion` rule in Node-Base sets `transition: none` on `.node`, but the `translateX` slide would be at the Pagination-Base level. Need a reduced-motion rule in Pagination-Base CSS for the slide, or the slide must be instant when reduced motion is active. This was absent from the task description.

---

## Summary

Task 3 is well-structured. The gap spacing question (concern #1) and cross-component impact (concern #3) should be resolved before implementation starts. The rest can be addressed during implementation.
