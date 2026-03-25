# Issue: Text Color Tokens Missing Dark Mode Support

**Date**: 2026-03-24
**Found by**: Thurgood (audit of showcase site rendering)
**Domain**: Ada (Rosetta token generation)
**Severity**: High — text is unreadable in dark mode

---

## Problem

The following semantic text color tokens are fixed light-mode values with no `light-dark()` wrapper:

```css
--color-text-default: rgba(38, 50, 58, 1);   /* dark gray */
--color-text-muted: rgba(94, 112, 124, 1);    /* medium gray */
--color-text-subtle: rgba(178, 188, 196, 1);  /* light gray */
```

Meanwhile, surface/canvas tokens correctly use `light-dark()`:

```css
--color-structure-canvas: light-dark(rgba(255, 255, 255, 1), rgba(24, 34, 40, 1));
```

Result: dark mode renders dark text on a dark background — near-zero contrast. Discovered on the showcase site but affects any consumer using these tokens with `prefers-color-scheme: dark`.

## Expected Behavior

Text color tokens should use `light-dark()` to provide appropriate contrast in both modes, consistent with how `color-structure-canvas`, `color-action-primary`, and `color-action-navigation` already handle mode switching.

## Affected Tokens

- `--color-text-default`
- `--color-text-muted`
- `--color-text-subtle`
- Potentially other semantic color tokens that lack `light-dark()` — Ada should audit the full set

## Impact

- Showcase site (https://3fn.github.io/DesignerPunk/) is unreadable in dark mode
- Any web consumer using these tokens in a dark-mode context would hit the same issue
- Demo pages may also be affected (they use the same `tokens.css`)
