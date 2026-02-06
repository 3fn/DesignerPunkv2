# Release v6.2.0

**Date**: February 6, 2026
**Type**: Minor Release

---

## Summary

This release completes the Input-Checkbox component family with two new components for form inputs and legal consent scenarios. Also includes architectural improvements, token fixes, and full test suite validation.

---

## New Features

### Input-Checkbox Component Family (Spec 046)

Two new components following the Stemma System architecture:

#### Input-Checkbox-Base (Primitive)
- Binary selection control with three size variants (sm/md/lg)
- States: unchecked, checked, indeterminate, error
- Token-based styling with Icon-Base integration for checkmark/minus icons
- Full accessibility support (WCAG 2.1 AA, keyboard navigation, screen readers)
- Cross-platform: Web, iOS, Android

#### Input-Checkbox-Legal (Semantic)
- Legal consent checkbox extending Input-Checkbox-Base
- GDPR-compliant explicit consent enforcement (prevents pre-checked state)
- Audit trail support with ISO 8601 timestamps, legalTextId, and version tracking
- Fixed configuration: lg box (40px) + labelSm typography for legal text readability
- Required indicator displayed by default

**Test Coverage**: 40+ new tests across checkbox components

### New Token: inset.075

Added `inset.075` semantic token (6px) for medium-density component internal spacing:
- Fills gap between `inset.050` (4px) and `inset.100` (8px)
- Mathematical consistency: 0.75 × 8px base = 6px
- Cross-platform generation (CSS, Swift, Kotlin)

---

## Bug Fixes

### Token Naming Fixes

Fixed deprecated token references in checkbox CSS:
- `--color-contrast-on-primary` → `--color-contrast-on-light`
- `--color-error-strong` → `--color-feedback-error-border`

### Badge-Count-Notification Token Resolution

Added semantic tokens to resolve token-completeness test failures:
- `color.feedback.notification.background`
- `color.feedback.notification.text`

---

## Improvements

### LabelTypography Extension

Added `labelTypography` prop to Input-Checkbox-Base enabling independent control of label typography:
- Supports `inherit`, `sm`, `md`, `lg` values
- Enables lg box + sm typography combination for legal text
- Available on all platforms (web, iOS, Android)

### Wrapper Pattern Architecture

Refactored Input-Checkbox-Legal to wrap Input-Checkbox-Base:
- ~80% code reduction in Legal component
- Legal automatically inherits Base improvements
- Implementation now matches design document specification

---

## Technical Details

### New Files
- `src/components/core/Input-Checkbox-Base/` - Base primitive component (web, iOS, Android)
- `src/components/core/Input-Checkbox-Legal/` - Legal semantic variant (web, iOS, Android)
- `src/tokens/semantic/SpacingTokens.ts` - Updated with `inset.075`
- `dist/browser/checkbox-demo.html` - Interactive demo page

### Modified Files
- `src/tokens/semantic/ColorTokens.ts` - Added notification feedback tokens
- `src/components/core/Badge-Count-Notification/` - Updated token references
- `.kiro/steering/Component-Family-Form-Inputs.md` - Added checkbox documentation
- `.kiro/steering/Component-Quick-Reference.md` - Added checkbox family entry

### Documentation
- Component READMEs with props, usage examples, platform guidance
- 9 checkbox behavioral contracts documented
- Legal consent best practices for GDPR compliance

---

## Test Results

```
Test Suites: 306 passed, 306 total
Tests:       7813 passed, 7826 total (13 skipped)
```

All tests pass with 0 failures.

---

## Upgrade Notes

No breaking changes. All existing APIs remain compatible.

---

## Contributors

- Peter Michaels Allen
- AI Collaboration (Kiro)
