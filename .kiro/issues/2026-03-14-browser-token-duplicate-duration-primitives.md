# Browser Token Build: Duplicate Duration Primitives (Unitless + Platform)

**Date**: 2026-03-14
**Discovered by**: Lina (during Safari ESM bug investigation)
**Domain**: Ada (token pipeline)
**Severity**: Medium
**Status**: Resolved (Spec 079 Task 1.3 — filtered from primitive pass)

---

## Issue

The browser distribution's `dist/browser/tokens.css` outputs duration tokens twice in the same `:root` block:

1. **Line ~433** — Raw primitives (unitless, cross-platform):
   ```css
   --duration-150: 150;
   --duration-250: 250;
   --duration-350: 350;
   ```

2. **Line ~829** — Platform-specific web tokens (with `ms` units):
   ```css
   --duration-150: 150ms;
   --duration-250: 250ms;
   --duration-350: 350ms;
   ```

The second declaration wins via CSS cascade, so the resolved values are correct (`150ms`). But the unitless primitives are dead weight in the browser CSS and actively misleading.

## Impact

This directly caused the Safari ESM animation bug in Nav-SegmentedChoice. The component was written using `calc(var(--duration-150) * 1ms)` — a pattern that assumes unitless token values. Since the browser build actually resolves `--duration-150` to `150ms`, the `calc()` evaluated to `calc(150ms * 1ms)` which is invalid CSS (can't multiply ms × ms). Chrome was lenient and ignored the error; Safari silently dropped the entire transition declaration.

The `* 1ms` pattern was a reasonable assumption if you looked at the first (unitless) declaration in tokens.css and didn't know the platform override existed below it.

## Questions for Ada

1. **Should the unitless duration primitives be excluded from the browser CSS build?** They serve no purpose in a web context since the platform tokens override them. Other token families (space, radius) already output with `px` units in their primitive declarations — duration is the outlier.

2. **Are there other token families with the same dual-output pattern?** (unitless primitive + platform-specific override in the same file)

3. **Is the dual-declaration intentional** (e.g., for consumers that need the raw number via `getComputedStyle`) or an artifact of the build pipeline concatenating both layers?

## Workaround Applied

Nav-SegmentedChoice now uses `var(--duration-150)` directly in transition shorthand — no `calc()`, no `* 1ms`. This works correctly because the cascaded value is `150ms`.

One hardcoded delay remains: `500ms` for the box-shadow phase (sum of `--duration-150` + `--duration-350`). This could be `calc(var(--duration-150) + var(--duration-350))` but needs Safari validation.

## Files Referenced

- `dist/browser/tokens.css` — lines ~433 (unitless) and ~829 (with units)
- `src/components/core/Nav-SegmentedChoice-Base/platforms/web/NavSegmentedChoiceBase.web.ts` — animation method
