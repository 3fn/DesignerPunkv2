# Task 8.3 Completion: Update Stemma Test Token Expectations

**Date**: February 6, 2026
**Task**: 8.3 Update stemma test token expectations
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Updated the `InputCheckboxBase.stemma.test.ts` file to use the correct token names following the Spec 052 token naming migration. The test was expecting deprecated token names that no longer exist in the CSS implementation.

## Changes Made

### File Modified
- `src/components/core/Input-Checkbox-Base/__tests__/InputCheckboxBase.stemma.test.ts`

### Token Name Updates

| Old (Deprecated) | New (Current) |
|------------------|---------------|
| `--color-select-not-selected-strong` | `--color-feedback-select-border-default` |
| `--color-select-selected-strong` | `--color-feedback-select-background-rest` |
| `--color-error-strong` | `--color-feedback-error-border` |

### Code Change

Updated the `expectedTokenPatterns` array in the `'should use CSS custom properties for token values'` test to reference the correct semantic token names from the Rosetta System feedback color family.

Added a comment documenting the migration:
```typescript
// Updated per Spec 052 token naming migration:
// - --color-select-not-selected-strong → --color-feedback-select-border-default
// - --color-select-selected-strong → --color-feedback-select-background-rest
// - --color-error-strong → --color-feedback-error-border
```

## Validation

- Ran `npm test -- --testNamePattern="Token Usage Validation" src/components/core/Input-Checkbox-Base/__tests__/InputCheckboxBase.stemma.test.ts`
- All 7 Token Usage Validation tests pass:
  - ✓ should detect web platform from file path
  - ✓ should pass token usage validation for web component
  - ✓ should find token references in web component
  - ✓ should not have hardcoded color values
  - ✓ should use CSS custom properties for token values
  - ✓ should reference size tokens for all variants
  - ✓ should reference typography tokens for all sizes

## Requirements Addressed

- **Requirement 11.2**: Use Stemma System validators for token compliance

## Notes

The CSS implementation (`InputCheckboxBase.web.css`) was already using the correct token names. Only the test file needed updating to match the actual implementation.
