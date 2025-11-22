# ButtonCTA Test Failures Analysis

**Date**: November 20, 2025
**Purpose**: Document ButtonCTA test failures discovered during test infrastructure stabilization
**Organization**: spec-validation
**Scope**: 005-cta-button-component
**Status**: Active - Awaiting Resolution

---

## Executive Summary

The ButtonCTA component test suite has **37 failing tests** (100% failure rate) due to Shadow DOM not initializing in the Jest test environment. All tests are well-written and comprehensive, but cannot execute because `shadowRoot` returns `null` or `undefined`.

**Impact**: Complete test coverage exists but cannot validate component functionality.

**Root Cause**: Web component Shadow DOM initialization issue in Jest environment.

**Discovered By**: Test Infrastructure Stabilization spec (task 1.1)

---

## Failure Statistics

- **Total Tests**: 37
- **Failed Tests**: 37 (100%)
- **Test File**: `src/components/core/ButtonCTA/__tests__/ButtonCTA.test.ts`
- **Error Pattern**: `shadowRoot` returns `null` or `undefined`

---

## Affected Test Categories

### 1. Size Variants (4 tests)
**Tests**:
- Should render small size with correct class
- Should render medium size with correct class
- Should render large size with correct class
- Should apply all size classes correctly

**Error Pattern**:
```javascript
expect(received).toContain(expected) // indexOf
Matcher error: received value must not be null nor undefined
Received has value: undefined

const shadowButton = button.shadowRoot?.querySelector('button');
expect(shadowButton?.className).toContain('button-cta--small');
//                    ^ undefined - shadowRoot is null
```

**What's Being Tested**: Size variant classes (`button-cta--small`, `button-cta--medium`, `button-cta--large`) are applied correctly to the shadow DOM button element.

---

### 2. Style Variants (4 tests)
**Tests**:
- Should render primary style with correct class
- Should render secondary style with correct class
- Should render tertiary style with correct class
- Should apply all style classes correctly

**Error Pattern**: Same as size variants - cannot access shadow DOM

**What's Being Tested**: Style variant classes (`button-cta--primary`, `button-cta--secondary`, `button-cta--tertiary`) are applied correctly.

---

### 3. Icon Integration (4 tests)
**Tests**:
- Should render icon when icon prop provided
- Should render icon with correct size for small/medium buttons
- Should render icon with correct size for large buttons
- Should mark icon as decorative with aria-hidden

**Error Pattern**:
```javascript
expect(received).toBeTruthy()
Received: undefined

const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
expect(iconElement).toBeTruthy();
//     ^ undefined - shadowRoot is null
```

**What's Being Tested**: Icon rendering, sizing, and accessibility attributes when `icon` prop is provided.

---

### 4. Text Wrapping (3 tests)
**Tests**:
- Should allow text wrapping by default
- Should truncate text with ellipsis when noWrap is true
- Should center-align text horizontally

**Error Pattern**: Cannot access `.button-cta__label` or `.button-cta__label--no-wrap` elements

**What's Being Tested**: Text wrapping behavior and CSS class application for label elements.

---

### 5. Disabled State (2 tests)
**Tests**:
- Should render disabled button with correct attributes
- Should not have disabled attributes when disabled is false

**Error Pattern**:
```javascript
expect(received).toBe(expected) // Object.is equality
Expected: true
Received: undefined

const shadowButton = button.shadowRoot?.querySelector('button');
expect(shadowButton?.hasAttribute('disabled')).toBe(true);
//                  ^ undefined - shadowRoot is null
```

**What's Being Tested**: Disabled state attributes (`disabled`, `aria-disabled`) and CSS classes.

---

### 6. Accessibility Attributes (3 tests)
**Tests**:
- Should have correct ARIA role
- Should have aria-label matching button text
- Should have correct type attribute

**Error Pattern**: Cannot access button element to verify ARIA attributes

**What's Being Tested**: WCAG compliance - role, aria-label, and type attributes.

---

### 7. Test ID Support (2 tests)
**Tests**:
- Should apply test ID when provided
- Should not have test ID attribute when not provided

**Error Pattern**: Cannot access button element to verify `data-testid` attribute

**What's Being Tested**: Test automation support via `data-testid` attribute.

---

### 8. Combined Props (1 test)
**Tests**:
- Should render with all props combined correctly

**Error Pattern**: Cannot access shadow DOM to verify multiple props working together

**What's Being Tested**: Integration of size, style, icon, disabled, and testId props.

---

## Root Cause Analysis

### Technical Issue

**Problem**: Web Components with Shadow DOM don't initialize properly in Jest's JSDOM environment.

**Why This Happens**:
1. Jest uses JSDOM to simulate browser environment
2. JSDOM has limited Web Components support
3. Shadow DOM attachment may require additional configuration
4. Custom element registration timing issues in test environment

### Evidence

Every test follows this pattern:
```javascript
const button = createButtonCTA({ /* props */ });
document.body.appendChild(button);

// This returns null in Jest environment
const shadowButton = button.shadowRoot?.querySelector('button');
```

The component likely works correctly in actual browsers but fails in the test environment.

---

## Test Quality Assessment

**The tests themselves are well-written**:
- ✅ Comprehensive coverage of all component features
- ✅ Clear test descriptions
- ✅ Proper setup and teardown
- ✅ Good use of test utilities
- ✅ Accessibility testing included
- ✅ Edge cases covered

**The issue is environmental, not test quality**.

---

## Potential Solutions

### Option 1: Fix Jest Configuration
Configure Jest to properly support Web Components with Shadow DOM:
- Add polyfills for Web Components
- Configure JSDOM with Shadow DOM support
- Update test environment setup

### Option 2: Use Real Browser Testing
Switch to a real browser test environment:
- Playwright or Puppeteer for E2E tests
- Web Test Runner for component tests
- Maintains full Web Components support

### Option 3: Test Without Shadow DOM
Modify test approach to work around Shadow DOM:
- Test component API and props
- Test rendered output without querying shadow DOM
- Use integration tests for visual validation

### Option 4: Wait for Infrastructure Fix
The test-infrastructure-stabilization spec may resolve this as part of systematic infrastructure fixes.

---

## Recommended Approach

**Short-term**: Document the issue and exclude ButtonCTA tests from CI until resolved.

**Long-term**: Investigate Option 1 (Jest configuration) as part of test infrastructure work. If that fails, consider Option 2 (real browser testing) for component tests.

**Rationale**: The tests are valuable and comprehensive. Fixing the environment is better than rewriting tests or abandoning coverage.

---

## Related Documentation

- **Test Infrastructure Stabilization**: `.kiro/specs/test-infrastructure-stabilization/`
- **Test Failure Report**: `test-failure-verification-report.md`
- **ButtonCTA Tests**: `src/components/core/ButtonCTA/__tests__/ButtonCTA.test.ts`
- **Test Utilities**: `src/components/core/ButtonCTA/__tests__/test-utils.ts`

---

## Status Updates

### November 20, 2025 - Initial Discovery
- 37 test failures identified during test infrastructure stabilization
- Root cause: Shadow DOM not initializing in Jest
- All tests blocked by same infrastructure issue
- Documented for future resolution

---

**Next Steps**: Monitor test-infrastructure-stabilization spec for systematic fixes that may resolve Shadow DOM initialization issues.
