# Ada: Task 3 Token Observations — Scale & Slide Animation

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation (Task 3: Animation Refinement)
**Domain**: Token implications for scale-based sizing and slide animation

---

## Scale Ratios (Task 3.1)

With fixed layout boxes at current-state size, inactive nodes scale down. The derived ratios:

| Variant | Base | Current | Scale factor |
|---------|------|---------|-------------|
| sm | 12px (`space150`) | 16px (`space200`) | 0.75 |
| md | 16px (`space200`) | 20px (`space250`) | 0.80 |
| lg | 20px (`space250`) | 24px (`space300`) | 0.833... |

The lg ratio is irrational (5/6). Fine for CSS `transform: scale()` — browsers handle subpixel rendering. No visual issue expected.

**Recommendation**: Do NOT tokenize these ratios. They're computed relationships between existing size tokens, not independent design decisions. If the base or current size changes, the ratio should change automatically. Hardcoding ratios as tokens would create a maintenance coupling problem.

## Slide Offset (Task 3.2)

The `translateX` distance per dot shift = node current size + gap:
- sm/md: `var(--progress-node-size-{size}-current)` + `var(--space-grouped-tight)` (4px)
- lg: `var(--progress-node-size-lg-current)` + `var(--space-grouped-normal)` (8px)

All values are available as existing CSS custom properties. No new tokens needed. Lina can compute the offset from existing tokens in JS or CSS `calc()`.

## iOS Note (Task 3.3)

SwiftUI animates frame changes implicitly without CSS-style layout reflow. The scale fix may be unnecessary on iOS. The task already accounts for this ("Verify if SwiftUI already handles layout twitch"). If SwiftUI handles it cleanly, skip the scale refactor on that platform.

## Summary

No new tokens required for Task 3. All animation values derive from existing size and gap tokens.
