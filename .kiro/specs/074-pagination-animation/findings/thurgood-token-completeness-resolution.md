# Thurgood: Token-Completeness Test Failure Resolution

**Date**: 2026-03-08
**Author**: Thurgood (governance audit)
**For**: Lina (implementation)
**Context**: Spec 074, Task 3.8 — Resolve 2 token-completeness test failures
**Status**: Audit complete, ready for Lina to implement

---

## The Failures

Two token-completeness test failures caused by experimental CSS custom properties in Node-Base that aren't defined in `tokens.css`:
- `--motion-color-transition-duration`
- `--motion-color-transition-easing`

These were placeholder names used during the split-timing experimentation. Peter decided Path A (Task 3.4): create `motion.settleTransition` (350ms/easingDecelerate). Ada created the token. The generated CSS custom properties are:
- `--motion-settle-transition-duration: var(--duration-350)`
- `--motion-settle-transition-easing: var(--easing-decelerate)`

These exist in `dist/DesignTokens.web.css` and `dist/browser/tokens.css`. The experimental names just need to be replaced with the real ones.

---

## Change 1: Node-Base CSS

**File**: `src/components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.styles.css`
**Lines**: 114-115

**Current** (experimental fallback pattern):
```css
:host([sizing="scale"]) .node {
  transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
              background-color var(--motion-color-transition-duration, var(--motion-selection-transition-duration))
                              var(--motion-color-transition-easing, var(--motion-selection-transition-easing));
}
```

**Replace with** (real token, no fallback needed):
```css
:host([sizing="scale"]) .node {
  transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
              background-color var(--motion-settle-transition-duration) var(--motion-settle-transition-easing);
}
```

The fallback pattern is no longer needed — the token exists.

---

## Change 2: PaginationBase Track Slide

**File**: `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.web.ts`
**Line**: 257

**Current** (uses selection timing for slide):
```ts
this._track.style.transition = 'transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing)';
```

**Replace with** (uses settle timing — slide follows through at 350ms):
```ts
this._track.style.transition = 'transform var(--motion-settle-transition-duration) var(--motion-settle-transition-easing)';
```

This implements the split-timing feel: scale snaps at 250ms/easingStandard (`selectionTransition`), color+slide follow through at 350ms/easingDecelerate (`settleTransition`).

---

## Verification

After both changes:
- The 2 token-completeness test failures should resolve (no more undefined custom properties)
- `npm test` should show no regressions
- Visual feel: dot scale snaps quickly (250ms), color fade and track slide settle smoothly (350ms)

---

## References

- `findings/motion-timing-split.md` — split-timing analysis
- `completion/task-3-4-completion.md` — Ada's token creation record
- `findings/ada-token-review-render-all-dots.md`, Finding #4 — original flag
