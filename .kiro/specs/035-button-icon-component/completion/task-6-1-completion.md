# Task 6.1 Completion: Set up test infrastructure

**Date**: January 4, 2026
**Spec**: 035 - Button-Icon Component
**Task**: 6.1 Set up test infrastructure
**Type**: Setup
**Validation**: Tier 1 - Minimal
**Status**: Complete

---

## Summary

Set up comprehensive test infrastructure for the Button-Icon web component, including Jest configuration for web components, test utilities for custom element registration and shadow DOM handling, and a smoke test suite to verify the setup works correctly.

---

## Artifacts Created

### 1. Test Utilities (`src/components/core/ButtonIcon/__tests__/test-utils.ts`)

Provides helper functions for Button-Icon component testing:

- **`setupButtonIconTokens()`**: Sets up required CSS custom properties for token-based styling
- **`cleanupButtonIconTokens()`**: Cleans up CSS custom properties
- **`registerButtonIcon()`**: Registers the custom element (prevents duplicate registration errors)
- **`waitForShadowDOM()`**: Waits for shadow DOM to initialize with configurable timeout
- **`createButtonIcon()`**: Creates a Button-Icon element with shadow DOM ready
- **`cleanupButtonIcon()`**: Removes element from DOM
- **`getShadowButton()`**: Gets the button element inside shadow DOM
- **`getIconContainer()`**: Gets the icon container element
- **`getIconElement()`**: Gets the icon-base element
- **`clickButton()`**: Simulates a click on the button
- **`pressKey()`**: Simulates keyboard events (Enter, Space)
- **`hasClass()`**: Checks if button has a specific CSS class
- **`getButtonComputedStyle()`**: Gets computed style of the shadow button

### 2. Setup/Smoke Test (`src/components/core/ButtonIcon/__tests__/setup.test.ts`)

Verifies test infrastructure works correctly with 25 tests across 6 categories:

1. **Custom Element Registration** (3 tests)
   - Registers Button-Icon custom element
   - Handles multiple registration attempts
   - Creates elements via document.createElement

2. **Shadow DOM Rendering** (4 tests)
   - Initializes shadow DOM when appended to document
   - Renders button element inside shadow DOM
   - Renders icon-base element inside shadow DOM
   - Applies aria-label to shadow button

3. **Test Utilities** (8 tests)
   - createButtonIcon helper works
   - All props can be set via helper
   - getShadowButton helper works
   - getIconContainer helper works
   - getIconElement helper works
   - cleanupButtonIcon helper works
   - hasClass helper works

4. **Event Handling** (3 tests)
   - Dispatches press event on click
   - Dispatches press event on Enter key
   - Dispatches press event on Space key

5. **Jest Configuration** (3 tests)
   - jsdom environment available
   - async/await support
   - DOM manipulation support

6. **Web Components API** (3 tests)
   - Custom elements API available
   - Shadow DOM API available
   - Shadow DOM content manipulation works

7. **Default Values** (2 tests)
   - Defaults to medium size
   - Defaults to primary variant

---

## Technical Decisions

### 1. Pattern Alignment with Button-CTA

The test utilities follow the same patterns established in `Button-CTA/__tests__/test-utils.ts`:
- Same helper function signatures
- Same shadow DOM wait mechanism
- Same cleanup patterns

This ensures consistency across component test suites.

### 2. CSS Custom Property Setup

The `setupButtonIconTokens()` function sets up all required CSS custom properties:
- Color tokens (primary, contrast, subtle background)
- Focus ring tokens (offset, width, color)
- Border tokens (default, emphasis)
- Animation token (duration-150)
- Icon stroke width token (required by Icon-Base)

### 3. Jest Environment

Tests use `@jest-environment jsdom` annotation for DOM API access. This is consistent with other web component tests in the codebase.

---

## Validation

All 25 tests pass:

```
PASS src/components/core/ButtonIcon/__tests__/setup.test.ts
  Button-Icon Test Infrastructure Setup
    Custom Element Registration
      ✓ should register Button-Icon custom element
      ✓ should not throw error when registering multiple times
      ✓ should create Button-Icon element using document.createElement
    Shadow DOM Rendering
      ✓ should initialize shadow DOM when element is appended to document
      ✓ should render button element inside shadow DOM
      ✓ should render icon-base element inside shadow DOM
      ✓ should apply aria-label to shadow button
    Test Utilities
      ✓ should create button with createButtonIcon helper
      ✓ should create button with all props using helper
      ✓ should get shadow button using helper
      ✓ should get icon container using helper
      ✓ should get icon element using helper
      ✓ should clean up button using helper
      ✓ should check CSS class using hasClass helper
    Event Handling
      ✓ should dispatch press event on click
      ✓ should dispatch press event on Enter key
      ✓ should dispatch press event on Space key
    Jest Configuration
      ✓ should have jsdom environment available
      ✓ should support async/await in tests
      ✓ should support DOM manipulation
    Web Components API
      ✓ should support custom elements API
      ✓ should support shadow DOM API
      ✓ should support shadow DOM content manipulation
    Default Values
      ✓ should default to medium size
      ✓ should default to primary variant

Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```

---

## Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| Configure Jest for web components | ✅ | Uses jsdom environment, follows existing patterns |
| Create test utilities for custom element registration | ✅ | `registerButtonIcon()` with duplicate prevention |
| Create helper for shadow DOM rendering waits | ✅ | `waitForShadowDOM()` with configurable timeout |
| Write one smoke test to verify setup works | ✅ | 25 tests across 6 categories |

---

## Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `src/components/core/ButtonIcon/__tests__/test-utils.ts` | Created | Test utilities for Button-Icon |
| `src/components/core/ButtonIcon/__tests__/setup.test.ts` | Created | Smoke test suite |
| `src/components/core/ButtonIcon/__tests__/.gitkeep` | Deleted | No longer needed |

---

## Next Steps

Task 6.2 and 6.3 will use this test infrastructure to implement property-based tests for the 13 correctness properties defined in the design document.
