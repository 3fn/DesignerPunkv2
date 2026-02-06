# Task 8.1 Completion: Fix Deprecated Token Names in CSS

**Date**: February 6, 2026
**Task**: 8.1 Fix deprecated token names in CSS
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Fixed deprecated token names in both Input-Checkbox-Base and Input-Checkbox-Legal CSS files to use the correct Rosetta System token names.

## Changes Made

### InputCheckboxBase.web.css

1. **Icon color token** (line ~210):
   - Before: `var(--color-contrast-on-primary)`
   - After: `var(--color-contrast-on-light)`
   - Rationale: Icon on light cyan background needs dark color for contrast

2. **Error border token** (line ~247):
   - Before: `var(--color-error-strong)`
   - After: `var(--color-feedback-error-border)`
   - Rationale: Aligns with Rosetta System feedback token naming

### InputCheckboxLegal.web.css

1. **Icon color token** (line ~159):
   - Before: `var(--color-contrast-on-primary)`
   - After: `var(--color-contrast-on-light)`
   - Rationale: Icon on light cyan background needs dark color for contrast

2. **Error border token** (line ~181):
   - Before: `var(--color-error-strong)`
   - After: `var(--color-feedback-error-border)`
   - Rationale: Aligns with Rosetta System feedback token naming

## Validation

- ✅ CSS files have no diagnostics/syntax errors
- ✅ Deprecated tokens completely removed from checkbox CSS files
- ✅ New tokens correctly applied in all four locations

## Requirements Addressed

- **Requirement 1.6**: Error state uses correct error border color token
- **Requirement 4.4**: Icon color uses correct contrast token for visibility

## Notes

Pre-existing test failures (stemma test expecting `--color-select-selected-strong`, Legal audit trail tests) are documented in Task 7 audit and will be addressed in subsequent tasks (8.2, 8.3, 8.5, 8.6).
