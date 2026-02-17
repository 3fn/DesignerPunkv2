# Issue: Token Completeness Test — Missing Motion Tokens

**Date**: February 16, 2026
**Severity**: Medium
**Status**: Open
**Discovered During**: Spec 061 - Component Demo System (Task 7.4, observed in test run)
**Affects**: token-completeness.property.test.ts

---

## Summary

The token completeness property test reports two motion tokens referenced in the browser bundles (ESM and UMD) that don't exist in `tokens.css`:

- `motion-duration-fast`
- `motion-easing-standard`

---

## Failing Tests

**File**: `src/__tests__/browser-distribution/token-completeness.property.test.ts`

- `all token references in ESM bundle should exist in tokens.css` (line 379)
- `all token references in UMD bundle should exist in tokens.css` (line 405)

Both report the same two missing tokens: `["motion-duration-fast", "motion-easing-standard"]`

---

## Root Cause

A component (likely Chip or another recently added component) references `--motion-duration-fast` and `--motion-easing-standard` CSS custom properties, but these tokens are not generated in `tokens.css`. This could mean:

1. The token names in the component don't match the generated token names (naming mismatch)
2. These motion tokens haven't been added to the token generation pipeline yet
3. The component should be using different token names (e.g., `--motion-focus-transition-duration` instead of `--motion-duration-fast`)

---

## Investigation Needed

- Check which component(s) reference these token names
- Check if equivalent tokens exist under different names in tokens.css
- Determine if this is a naming mismatch or a missing token generation issue

---

## Related Specs

- Spec 014: Motion Token System (if it exists)
- Spec 047 or similar (Chip components — likely source of references)
