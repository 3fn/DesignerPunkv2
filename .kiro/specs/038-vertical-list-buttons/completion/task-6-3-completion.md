# Task 6.3 Completion: Write Integration Tests

**Date**: January 7, 2026
**Task**: 6.3 Write integration tests
**Status**: Complete
**Organization**: spec-completion
**Scope**: 038-vertical-list-buttons

---

## Summary

Implemented comprehensive integration tests for Button-VerticalListItem component covering token integration, Icon-Base integration, and fail-loudly behavior as specified in the task requirements.

---

## Implementation Details

### Test File Created

**File**: `src/components/core/Button-VerticalListItem/__tests__/ButtonVerticalListItem.integration.test.ts`

### Test Coverage

#### 1. Token Integration (5 tests)
- Verifies component consumes Rosetta-generated CSS variables for styling
- Tests token-based values for selected state (`color.select.selected` tokens)
- Tests token-based values for error state (`color.error` tokens)
- Validates padding compensation based on border width (11px rest, 10px selected)
- Confirms motion tokens used for transitions (`--motion-selection-transition-duration`, `--motion-selection-transition-easing`)

#### 2. Icon-Base Integration (11 tests)
- Tests leading icon renders using Icon-Base component
- Tests checkmark renders using Icon-Base component
- Validates `iconBaseSizes.size100` (24px) used for leading icon
- Validates `iconBaseSizes.size100` (24px) used for checkmark
- Tests optical balance applied to leading icon
- Tests optical balance applied to checkmark
- Verifies color passed to Icon-Base for leading icon
- Verifies color passed to Icon-Base for checkmark
- Tests checkmark marked as decorative with `aria-hidden`
- Validates nested Shadow DOM works in test environment

#### 3. Fail-Loudly Behavior (8 tests)
- Tests component throws error when required CSS variables missing
- Validates descriptive error message listing missing tokens
- Tests error thrown when color tokens missing
- Tests error thrown when motion tokens missing
- Tests error thrown when accessibility tokens missing
- Confirms component does NOT use hard-coded fallback values
- Tests error thrown when disabled attribute set
- Validates component works correctly when all required tokens present

#### 4. Component Token Registry Integration (2 tests)
- Tests component tokens used for padding compensation
- Validates height stability across visual states (border + padding = constant)

---

## Test Patterns Used

### Shadow DOM Testing
- Used `getShadowButton()` helper for accessing shadow DOM elements
- Implemented `getIconSvg()` helper for nested Shadow DOM access (Button → icon-base → SVG)
- Followed async patterns with `createVerticalListButtonItem()` and `waitForShadowDOM()`

### Token Validation Testing
- Used `setupRequiredTokens()` and `cleanupRequiredTokens()` from test-utils
- Tested fail-loudly by removing specific tokens and verifying errors thrown
- Validated CSS custom property references in inline styles

### Icon-Base Integration Testing
- Verified icon-base element presence and attributes
- Tested size attribute matches `iconBaseSizes.size100` (24)
- Validated size class in nested Shadow DOM (`icon-base--size-100`)
- Tested optical-balance attribute presence

---

## Requirements Addressed

From requirements.md - Token Dependencies:
- ✅ Component uses Rosetta CSS variables (not hard-coded values)
- ✅ Icons render at correct size via Icon-Base integration
- ✅ Component throws when tokens missing (fail-loudly behavior)

---

## Validation

- All 26 integration tests pass
- Full test suite passes (272 suites, 6549 tests)
- Tests follow Test Development Standards (behavior not implementation)
- Tests use established test-utils patterns

---

## Related Documents

- [Design Document](../../design.md) - Testing Strategy section
- [Requirements Document](../../requirements.md) - Token Dependencies
- [Test Utils](../../../../../src/components/core/Button-VerticalListItem/__tests__/test-utils.ts) - Helper functions
