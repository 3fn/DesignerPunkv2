# Task 8.5 Completion: Refactor Input-Checkbox-Legal to Wrapper Pattern

**Date**: February 6, 2026
**Spec**: 046 - Input-Checkbox-Base
**Task**: 8.5 Refactor Input-Checkbox-Legal to wrapper pattern
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Refactored all three platform implementations of Input-Checkbox-Legal from standalone implementations to wrapper pattern, where Legal wraps Input-Checkbox-Base with fixed configuration and adds Legal-specific features on top.

## Changes Made

### 8.5.1 Web Implementation (InputCheckboxLegal.web.ts)
- Rewrote to wrap `<input-checkbox-base>` element in shadow DOM
- Configured Base with fixed props: `size="lg"`, `label-align="top"`, `label-typography="sm"`
- Forwards relevant attributes to Base (label, helper-text, error-message, name, value)
- Implements Legal-specific features:
  - Required indicator (rendered by Legal, not Base)
  - Explicit consent enforcement (intercepts checked attribute)
  - Audit trail (onConsentChange with timestamp, legalTextId, version)
  - Indeterminate rejection (ignores/warns if set)
- Listens to Base's change event and transforms to consent-change event
- Updated CSS to style only Legal-specific elements

### 8.5.2 iOS Implementation (InputCheckboxLegal.ios.swift)
- Rewrote to wrap `InputCheckboxBase` view internally
- Fixed configuration: `size: .lg`, `labelAlign: .top`, `labelTypography: .sm`
- Forwards relevant properties to Base (label, helperText, errorMessage)
- Implements Legal-specific features:
  - Required indicator (rendered above Base)
  - Explicit consent enforcement (intercepts checked binding)
  - Audit trail (onConsentChange with timestamp, legalTextId, version)
  - No indeterminate support (not passed to Base)
- Transforms Base's onChange to Legal's onConsentChange

### 8.5.3 Android Implementation (InputCheckboxLegal.android.kt)
- Rewrote to wrap `InputCheckboxBase` composable internally
- Fixed configuration: `size = CheckboxSize.Large`, `labelAlign = LabelAlignment.Top`, `labelTypography = LabelTypography.Small`
- Forwards relevant parameters to Base (label, helperText, errorMessage)
- Implements Legal-specific features:
  - Required indicator (rendered above Base)
  - Explicit consent enforcement (intercepts checked state)
  - Audit trail (onConsentChange with timestamp, legalTextId, version)
  - No indeterminate support (not passed to Base)
- Transforms Base's onCheckedChange to Legal's onConsentChange

## Code Reduction

The wrapper pattern achieved approximately 80% code reduction across all platforms by:
- Eliminating duplicated checkbox rendering logic
- Removing duplicated state management
- Removing duplicated interaction handling (press gestures, ripple effects)
- Removing duplicated accessibility implementation
- Keeping only Legal-specific: ConsentChangeData, required indicator, consent enforcement, audit trail

## Benefits

1. **Inheritance**: Legal automatically inherits Base improvements
2. **Consistency**: Single source of truth for checkbox behavior
3. **Maintainability**: Changes to Base automatically apply to Legal
4. **Reduced bugs**: Less duplicated code means fewer places for bugs

## Test Results

All 306 test suites pass with 7813 tests passing:
- InputCheckboxLegal.test.ts: All tests pass
- InputCheckboxBase.stemma.test.ts: All tests pass
- token-completeness.property.test.ts: All tests pass

## Requirements Validated

- 9.1: Fixed sizing (lg box + labelSm typography) ✓
- 9.2: Fixed top label alignment ✓
- 9.3-9.4: Explicit consent enforcement ✓
- 9.5-9.7: Audit trail support (timestamp, legalTextId, version) ✓
- 9.8-9.9: Required indicator ✓
- 9.10: No indeterminate state ✓
- 9.11: No label truncation (inherited from Base) ✓
