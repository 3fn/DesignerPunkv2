# Task 7.3 Completion: Audit InputCheckboxLegal.test.ts Failures

**Date**: February 6, 2026
**Task**: 7.3 Audit InputCheckboxLegal.test.ts failures (23 tests)
**Status**: Complete
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base

---

## Executive Summary

The InputCheckboxLegal test file has **23 failing tests** out of 37 total tests. The root cause is a **DOM structure mismatch** between what the tests expect and what the implementation actually renders.

**Key Finding:** The implementation uses a **wrapper pattern** that embeds `<input-checkbox-base>` as a child element, while the tests expect a **standalone pattern** with direct DOM elements like `.checkbox__input`.

---

## Architectural Analysis

### Design Doc Expectation (Wrapper Pattern)

The design document specifies that Input-Checkbox-Legal should **wrap** Input-Checkbox-Base:

```typescript
// Design doc expectation
class InputCheckboxLegal extends HTMLElement {
  private baseCheckbox: InputCheckboxBase;
  
  connectedCallback() {
    // Fixed configuration
    this.baseCheckbox.size = 'lg';
    this.baseCheckbox.labelAlign = 'top';
  }
}
```

### Actual Implementation (Wrapper Pattern - Matches Design Doc)

The implementation correctly uses the wrapper pattern:

```typescript
// Actual implementation
export class InputCheckboxLegalElement extends HTMLElement {
  private _baseCheckbox: InputCheckboxBaseElement | null = null;
  
  render() {
    this._shadowRoot.innerHTML = `
      <div class="legal-checkbox-container">
        <span class="legal-checkbox__required">Required</span>
        <input-checkbox-base
          class="legal-checkbox__base"
          size="lg"
          label-align="top"
          ...
        ></input-checkbox-base>
      </div>
    `;
  }
}
```

### Actual DOM Structure (Verified via Debug Test)

```html
<div class="legal-checkbox-container">
  <span class="legal-checkbox__required" aria-hidden="true">Required</span>
  <input-checkbox-base 
    class="legal-checkbox__base" 
    id="legal-checkbox-1-base" 
    label="Test" 
    size="lg" 
    label-align="top" 
    value="on">
  </input-checkbox-base>
</div>
```

### Tests Expect (Standalone Pattern - INCORRECT)

The tests were written expecting a standalone implementation:

```html
<!-- Tests expect this structure -->
<div class="checkbox-container">
  <span class="checkbox__required">Required</span>
  <div class="checkbox checkbox--legal">
    <input class="checkbox__input" />
    <label class="checkbox__touch-target">
      <span class="checkbox__box">...</span>
      <span class="checkbox__content">...</span>
    </label>
  </div>
  <span class="checkbox__helper">...</span>
  <span class="checkbox__error">...</span>
</div>
```

### Key Mismatches

| Aspect | Tests Expect | Actual Implementation |
|--------|--------------|----------------------|
| Container class | `.checkbox-container` | `.legal-checkbox-container` |
| Required indicator | `.checkbox__required` | `.legal-checkbox__required` |
| Input element | `.checkbox__input` (direct) | Inside nested `<input-checkbox-base>` shadow DOM |
| Checkbox wrapper | `.checkbox.checkbox--legal` | `<input-checkbox-base>` element |
| Helper text | `.checkbox__helper` | Passed as attribute to `<input-checkbox-base>` |
| Error message | `.checkbox__error` | Passed as attribute to `<input-checkbox-base>` |

---

## Failure Categories and Root Causes

### Category 1: Input Element Not Found (12 tests)

**Affected Tests:**
- ISO 8601 Timestamp Format (3 tests)
- Audit Trail Data (6 tests)
- Events (3 tests)

**Root Cause:** Tests query `.checkbox__input` directly from Legal's shadow root, but the input is inside the nested `<input-checkbox-base>` element's shadow DOM.

**Test Code (Incorrect):**
```typescript
const input = checkbox.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
input.click(); // TypeError: Cannot read properties of null
```

**Correct Approach:**
```typescript
// Need to traverse through nested shadow DOM
const baseCheckbox = checkbox.shadowRoot?.querySelector('input-checkbox-base');
const input = baseCheckbox?.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
input.click();
```

---

### Category 2: Missing `.checkbox--legal` Class (2 tests)

**Affected Tests:**
- "should render with fixed lg box size (checkbox--legal class)"
- "should use top alignment for label (flex-start)"

**Root Cause:** Tests expect `.checkbox--legal` class on a wrapper element, but the implementation uses `<input-checkbox-base>` which has its own internal structure. The Legal component doesn't add a `.checkbox--legal` class.

**Test Code (Incorrect):**
```typescript
const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
expect(wrapper?.classList.contains('checkbox--legal')).toBe(true);
```

**Correct Approach:** Either:
1. Update tests to check for `.legal-checkbox-container` instead
2. Or verify the `<input-checkbox-base>` element has correct attributes (size="lg", label-align="top")

---

### Category 3: Required Indicator Selector Mismatch (2 tests)

**Affected Tests:**
- "should show required indicator by default"
- "should show required indicator when show-required-indicator is explicitly true"

**Root Cause:** Tests query `.checkbox__required` but implementation uses `.legal-checkbox__required`.

**Test Code (Incorrect):**
```typescript
const requiredIndicator = checkbox.shadowRoot?.querySelector('.checkbox__required');
```

**Correct Approach:**
```typescript
const requiredIndicator = checkbox.shadowRoot?.querySelector('.legal-checkbox__required');
```

---

### Category 4: Icon Not Found (1 test)

**Affected Test:**
- "should only render check icon when checked (no minus icon)"

**Root Cause:** Tests query `.checkbox__box svg.icon-base` directly from Legal's shadow root, but the icon is inside the nested `<input-checkbox-base>` shadow DOM.

**Test Code (Incorrect):**
```typescript
const icon = checkbox.shadowRoot?.querySelector('.checkbox__box svg.icon-base');
```

**Correct Approach:**
```typescript
const baseCheckbox = checkbox.shadowRoot?.querySelector('input-checkbox-base');
const icon = baseCheckbox?.shadowRoot?.querySelector('.checkbox__box svg.icon-base');
```

---

### Category 5: Form Reset Not Working (1 test)

**Affected Test:**
- "should reset to unchecked on form reset"

**Root Cause:** The form reset handler in Legal component sets `this.checked = false`, but this doesn't propagate to the nested `<input-checkbox-base>`. The Base component has its own form reset handler.

**Analysis:** The Legal component's `_onFormReset` handler:
```typescript
private _onFormReset = (): void => {
  this.checked = false;
  if (this._input) {
    this._input.checked = false;
  }
};
```

But `this._input` is null because the input is inside the nested Base component. The Legal component should either:
1. Forward the reset to the Base component
2. Or let the Base component handle form reset directly

---

### Category 6: Name Attribute Not Found (1 test)

**Affected Test:**
- "should include name attribute on native input"

**Root Cause:** Tests query `.checkbox__input` directly from Legal's shadow root, but the input is inside the nested `<input-checkbox-base>`.

**Test Code (Incorrect):**
```typescript
const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
expect(input?.getAttribute('name')).toBe('consent');
```

**Correct Approach:**
```typescript
const baseCheckbox = checkbox.shadowRoot?.querySelector('input-checkbox-base');
const input = baseCheckbox?.shadowRoot?.querySelector('.checkbox__input');
expect(input?.getAttribute('name')).toBe('consent');
```

---

### Category 7: Accessibility Attributes Not Found (3 tests)

**Affected Tests:**
- "should set aria-invalid when error is present"
- "should associate error message via aria-describedby"
- "should have aria-hidden on required indicator"

**Root Cause:** 
- For aria-invalid and aria-describedby: Tests query `.checkbox__input` directly, but it's inside nested Base component
- For aria-hidden on required indicator: Tests query `.checkbox__required` but implementation uses `.legal-checkbox__required`

**Correct Approach:**
```typescript
// For aria-invalid and aria-describedby
const baseCheckbox = checkbox.shadowRoot?.querySelector('input-checkbox-base');
const input = baseCheckbox?.shadowRoot?.querySelector('.checkbox__input');

// For required indicator
const requiredIndicator = checkbox.shadowRoot?.querySelector('.legal-checkbox__required');
expect(requiredIndicator?.getAttribute('aria-hidden')).toBe('true');
```

---

## Recommended Fix Strategy

### Option A: Update Tests to Match Implementation (Recommended)

The implementation correctly follows the design doc's wrapper pattern. The tests need to be updated to:

1. **Use correct class selectors:**
   - `.legal-checkbox-container` instead of `.checkbox-container`
   - `.legal-checkbox__required` instead of `.checkbox__required`

2. **Traverse nested shadow DOM for Base component elements:**
   ```typescript
   // Get the nested input-checkbox-base element
   const baseCheckbox = checkbox.shadowRoot?.querySelector('input-checkbox-base');
   
   // Then query its shadow DOM for internal elements
   const input = baseCheckbox?.shadowRoot?.querySelector('.checkbox__input');
   const box = baseCheckbox?.shadowRoot?.querySelector('.checkbox__box');
   ```

3. **Update fixed configuration tests:**
   - Instead of checking for `.checkbox--legal` class, verify the `<input-checkbox-base>` has `size="lg"` and `label-align="top"` attributes

4. **Fix form reset test:**
   - The Legal component may need to forward form reset to the Base component, OR
   - The test should verify the Base component's checked state

**Estimated Effort:** Medium - requires updating ~20 test selectors and adding nested shadow DOM traversal

### Option B: Update Implementation to Standalone Pattern

Refactor the Legal component to NOT wrap Base, implementing its own DOM structure. This would:

1. Match what the tests expect
2. Give Legal component full control over its DOM
3. Allow the unique lg+labelSm combination

**Trade-offs:**
- Duplicates code from Base component
- Loses automatic updates when Base is improved
- More maintenance burden

**Estimated Effort:** High - requires significant refactoring

### Option C: Hybrid Approach

Keep the wrapper pattern but add pass-through selectors:

1. Add `.checkbox__input` as an alias that queries through to Base
2. Add `.checkbox--legal` class to the container
3. Expose Base's internal elements via CSS parts

**Trade-offs:**
- More complex implementation
- May not work well with shadow DOM encapsulation

**Estimated Effort:** Medium-High

---

## Decision Recommendation

**Recommended Approach: Option A (Update Tests)**

The implementation correctly follows the design doc's wrapper pattern. The tests were written with incorrect assumptions about the DOM structure.

**Rationale:**
1. Implementation matches design doc specification
2. Wrapper pattern is the correct architectural choice (reuses Base functionality)
3. Tests are the source of the mismatch, not the implementation
4. Updating tests is less risky than changing implementation
5. Test updates are straightforward (selector changes + nested shadow DOM traversal)

---

## Test Category Summary

| Category | Count | Root Cause | Fix Approach |
|----------|-------|------------|--------------|
| Input element not found | 12 | Nested shadow DOM | Traverse to Base's shadow DOM |
| Missing .checkbox--legal | 2 | Wrong selector | Check Base attributes instead |
| Required indicator | 2 | Wrong class name | Use `.legal-checkbox__required` |
| Icon not found | 1 | Nested shadow DOM | Traverse to Base's shadow DOM |
| Form reset | 1 | Reset not propagated | Fix Legal's reset handler |
| Name attribute | 1 | Nested shadow DOM | Traverse to Base's shadow DOM |
| Accessibility | 3 | Mixed issues | Update selectors + traverse |
| **Total** | **23** | | |

---

## Detailed Test-by-Test Fix Mapping

### ISO 8601 Timestamp Tests (3 tests)
- **Fix:** Query `input-checkbox-base` first, then its shadow DOM for `.checkbox__input`

### Audit Trail Tests (6 tests)
- **Fix:** Same as timestamp tests - traverse nested shadow DOM

### Fixed Configuration Tests (4 tests)
- **Fix:** 
  - Check `<input-checkbox-base>` has `size="lg"` attribute
  - Check `<input-checkbox-base>` has `label-align="top"` attribute
  - Remove `.checkbox--legal` class check (not applicable to wrapper pattern)

### Required Indicator Tests (2 tests)
- **Fix:** Change selector from `.checkbox__required` to `.legal-checkbox__required`

### Indeterminate Rejection Tests (2 tests)
- **Fix:** Traverse to Base's shadow DOM for visual state checks

### Form Integration Tests (2 tests)
- **Fix:** 
  - Form reset: May need implementation fix to propagate reset to Base
  - Name attribute: Traverse to Base's shadow DOM

### Accessibility Tests (3 tests)
- **Fix:**
  - aria-invalid: Traverse to Base's shadow DOM
  - aria-describedby: Traverse to Base's shadow DOM
  - aria-hidden on required: Use `.legal-checkbox__required` selector

### Event Tests (3 tests)
- **Fix:** Traverse to Base's shadow DOM to click the input

---

## Next Steps

1. **Task 7.4**: Document fix strategy decision and get user approval
2. **Task 8.2**: Update tests to match implementation DOM structure
3. **Task 8.4**: Run full test suite to verify all tests pass

---

## Files Analyzed

- `src/components/core/Input-Checkbox-Legal/__tests__/InputCheckboxLegal.test.ts`
- `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.ts`
- `src/components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web.css`
- `.kiro/specs/046-input-checkbox-base/design.md`

