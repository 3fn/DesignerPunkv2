# Task 3.8 Completion: Replace Experimental Motion Tokens with settleTransition

**Date**: 2026-03-08
**Spec**: 074 — Pagination Animation
**Task**: 3.8 — Wire `motion.settleTransition` into CSS / JS
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Replaced experimental `--motion-color-transition-*` custom properties with the real `--motion-settle-transition-*` tokens Ada created in Task 3.4. Also switched the pagination track slide from `selectionTransition` (250ms) to `settleTransition` (350ms), completing the split-timing design.

---

## Changes

### 1. Node-Base CSS (`ProgressIndicatorNodeBase.styles.css`, line 114)

Before (experimental fallback pattern):
```css
background-color var(--motion-color-transition-duration, var(--motion-selection-transition-duration))
                var(--motion-color-transition-easing, var(--motion-selection-transition-easing));
```

After (real token, no fallback):
```css
background-color var(--motion-settle-transition-duration) var(--motion-settle-transition-easing);
```

### 2. PaginationBase track slide (`ProgressPaginationBase.web.ts`, line 257)

Before: `selectionTransition` (250ms/easingStandard)
After: `settleTransition` (350ms/easingDecelerate)

---

## Split-Timing Result

| Property | Token | Duration | Easing |
|----------|-------|----------|--------|
| `transform` (dot scale) | `selectionTransition` | 250ms | easingStandard |
| `background-color` (dot color) | `settleTransition` | 350ms | easingDecelerate |
| `transform` (track slide) | `settleTransition` | 350ms | easingDecelerate |

Scale snaps, color and slide follow through.

---

## Verification

- Token-completeness tests: 2 failures → 0 ✅
- Full suite: 291 suites, 7457 tests, 0 failures ✅
- Build: successful ✅
