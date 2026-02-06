# Task 6 Completion: Fix InputCheckboxLegal Test Failures

**Date**: February 6, 2026
**Task**: 6. Fix InputCheckboxLegal Test Failures
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Summary

Fixed 3 failing tests in `InputCheckboxLegal.test.ts` by correcting selector mismatches between the tests and the actual component implementation.

## Root Cause Analysis

The tests were using incorrect CSS selectors that didn't match the component's actual DOM structure:

| Test | Expected Selector | Actual Selector | Issue |
|------|------------------|-----------------|-------|
| Required indicator | `.checkbox__required` | Nested in `<input-checkbox-base>` shadow DOM | Required indicator is rendered by the Base component, not Legal |
| Error state | `.checkbox__error` | `.legal-checkbox__error` | Legal component uses its own class prefix |
| Helper text | `.checkbox__helper` | `.legal-checkbox__helper` | Legal component uses its own class prefix |

## Changes Made

### File: `src/components/core/Input-Checkbox-Legal/__tests__/InputCheckboxLegal.test.ts`

**Test 1: "should render with required indicator when required is true"**
- Changed from: `el.shadowRoot?.querySelector('.checkbox__required')`
- Changed to: `el.shadowRoot?.querySelector('input-checkbox-base')?.shadowRoot?.querySelector('.checkbox__required')`
- Reason: The required indicator is rendered inside the nested `<input-checkbox-base>` component's shadow DOM

**Test 2: "should render with error state"**
- Changed from: `el.shadowRoot?.querySelector('.checkbox__error')`
- Changed to: `el.shadowRoot?.querySelector('.legal-checkbox__error')`
- Reason: Legal component renders its own error element with `legal-checkbox__` prefix

**Test 3: "should render with helper text"**
- Changed from: `el.shadowRoot?.querySelector('.checkbox__helper')`
- Changed to: `el.shadowRoot?.querySelector('.legal-checkbox__helper')`
- Reason: Legal component renders its own helper element with `legal-checkbox__` prefix

## Test Results

All 20 tests in `InputCheckboxLegal.test.ts` now pass:

```
 PASS  src/components/core/Input-Checkbox-Legal/__tests__/InputCheckboxLegal.test.ts
  InputCheckboxLegal - Rendering
    ✓ should render with default props
    ✓ should render with label
    ✓ should render with required indicator when required is true
    ✓ should render with error state
    ✓ should render with helper text
    ✓ should render with legal document link
  InputCheckboxLegal - Interaction
    ✓ should toggle checked state on click
    ✓ should not toggle when disabled
    ✓ should dispatch change event
    ✓ should dispatch legal-link-click event when link is clicked
  InputCheckboxLegal - Attributes
    ✓ should reflect checked attribute
    ✓ should reflect disabled attribute
    ✓ should reflect required attribute
    ✓ should reflect error attribute
  InputCheckboxLegal - Form Validation
    ✓ should return false for checkValidity when required and unchecked
    ✓ should return true for checkValidity when required and checked
    ✓ should return true for checkValidity when not required
    ✓ should set error state on reportValidity when invalid
  InputCheckboxLegal - Accessibility
    ✓ should have proper ARIA attributes on base checkbox
    ✓ should support keyboard interaction

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

## Architectural Insight

The InputCheckboxLegal component uses a **wrapper pattern** where it:
1. Wraps `<input-checkbox-base>` inside its own container
2. Passes props through to the base component
3. Renders its own helper/error elements with `legal-checkbox__*` class names
4. Relies on the base component for the checkbox UI and required indicator

This pattern means tests need to:
- Query through nested shadow DOMs for base component elements
- Use the correct class prefix for Legal-specific elements

## Verification

- ✅ All 3 previously failing tests now pass
- ✅ No regressions in other Legal component tests
- ✅ Total: 20/20 tests passing
