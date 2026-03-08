# Task 3.14 Completion: Evaluate clip-path 2px Magic Number

**Date**: 2026-03-08
**Spec**: 074 — Pagination Animation
**Task**: 3.14 — Evaluate `clip-path` 2px magic number
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 1 — Minimal

---

## Summary

Evaluated the 2px horizontal inset in `clip-path: inset(0 2px round var(--radius-full))`. Conclusion: 2px is stable across all three sizes, does not need to scale, and is not a tokenization candidate. Added a code comment explaining the rationale.

---

## Analysis

The 2px inset clips dot slivers that peek past the pill curve. `overflow: hidden` clips to the rectangular bounding box, but the pill's rounded ends create a zone where dots are inside the box but outside the curve.

Container heights by size:
- sm: 28px (dot 16px + 2×6px block padding) → pill radius 14px
- md: 32px (dot 20px + 2×6px block padding) → pill radius 16px
- lg: 40px (dot 24px + 2×8px block padding) → pill radius 20px

The 2px is stable because:
1. At the horizontal midline (where dots sit), the pill curve geometry is nearly identical across sizes
2. It's a sub-pixel safety margin, not a proportional design value
3. All sizes have enough inline padding (8px sm/md, 12px lg) to absorb 2px without visual impact

Not a token candidate — this is a rendering artifact workaround, not a design decision.

---

## Change

Added explanatory comment to `.pagination` rule in `ProgressPaginationBase.styles.css`.

---

## Verification

- Tests: all passing ✅
