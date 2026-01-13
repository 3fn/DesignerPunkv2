# Task 1.6 Completion: Replace Hard-Coded Values with Token References

**Date**: 2026-01-12
**Spec**: 040 - Component Alignment
**Task**: 1.6 Replace hard-coded values with token references
**Status**: Complete
**Organization**: spec-completion
**Scope**: 040-component-alignment

---

## Summary

Replaced all hard-coded pixel values for sizing and spacing in ButtonIcon CSS with token references, fulfilling Requirements 6.1, 6.2, and 6.3.

## Changes Made

### 1. Added Size Tokens to buttonIcon.tokens.ts

Added three new size tokens that reference primitive spacing tokens:
- `size.large`: References `space600` (48px)
- `size.medium`: References `space500` (40px)
- `size.small`: References `space400` (32px)

Also added helper functions and type definitions:
- `ButtonIconSizeVariant` type
- `getButtonIconSize()` function
- `ButtonIconSizeTokenReferences` constant
- `getButtonIconSizeTokenReference()` function

### 2. Updated ButtonIcon.web.css

Added component-scoped CSS custom properties in `:host`:
```css
/* Inset (padding) tokens */
--_bi-inset-large: var(--buttonicon-inset-large);
--_bi-inset-medium: var(--buttonicon-inset-medium);
--_bi-inset-small: var(--buttonicon-inset-small);

/* Size (width/height) tokens */
--_bi-size-large: var(--buttonicon-size-large);
--_bi-size-medium: var(--buttonicon-size-medium);
--_bi-size-small: var(--buttonicon-size-small);

/* Touch target token reference */
--_bi-touch-target: var(--tap-area-recommended);
```

Updated size variant classes to use token references:
```css
.button-icon--small {
  padding: var(--_bi-inset-small);
  width: var(--_bi-size-small);
  height: var(--_bi-size-small);
  min-width: var(--_bi-size-small);
  min-height: var(--_bi-size-small);
}
```

Updated touch target extension to use token reference:
```css
.button-icon--small::after {
  width: var(--_bi-touch-target);
  height: var(--_bi-touch-target);
}
```

### 3. Regenerated Component Tokens

Ran `npx ts-node scripts/generate-platform-tokens.ts` to regenerate ComponentTokens.web.css with the new size tokens:
```css
--buttonicon-size-large: var(--space-600);
--buttonicon-size-medium: var(--space-500);
--buttonicon-size-small: var(--space-400);
```

### 4. Updated Tests

Updated tests to check for token references instead of hard-coded pixel values:
- `ButtonIcon.properties.test.ts`: Updated Property 7 tests
- `ButtonIcon.unit.test.ts`: Updated dimension consistency test
- `ButtonIcon.stemma.test.ts`: Updated touch target extension test

## Requirements Validation

| Requirement | Status | Evidence |
|-------------|--------|----------|
| 6.1 Size dimensions reference CSS custom properties | ✅ | `width: var(--_bi-size-*)` |
| 6.2 Padding values reference CSS custom properties | ✅ | `padding: var(--_bi-inset-*)` |
| 6.3 No hard-coded pixel values for sizing/spacing | ✅ | Only fallback values in `:host` |

## Test Results

All 128 ButtonIcon tests pass:
- ButtonIcon.properties.test.ts: 100 tests passed
- ButtonIcon.properties-8-13.test.ts: Tests passed
- ButtonIcon.unit.test.ts: Tests passed
- ButtonIcon.stemma.test.ts: Tests passed
- setup.test.ts: Tests passed

## Files Modified

1. `src/components/core/Button-Icon/buttonIcon.tokens.ts` - Added size tokens
2. `src/components/core/Button-Icon/platforms/web/ButtonIcon.web.css` - Token references
3. `src/components/core/Button-Icon/__tests__/ButtonIcon.properties.test.ts` - Updated tests
4. `src/components/core/Button-Icon/__tests__/ButtonIcon.unit.test.ts` - Updated tests
5. `src/components/core/Button-Icon/__tests__/ButtonIcon.stemma.test.ts` - Updated tests
6. `dist/ComponentTokens.web.css` - Regenerated with size tokens

## Notes

- The `--button-icon-*` naming convention was preserved for non-size/inset properties (task 1.7 scope)
- Size and inset tokens use `--_bi-*` naming per task requirements
- No fallback values were added to token references (per user feedback)
- The only remaining hard-coded pixel value is `outline-width: 4px` in high contrast mode, which is an accessibility requirement
