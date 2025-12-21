# Task 6.2 Completion: TextInputField Motion Token Regression

**Date**: 2025-12-20
**Task**: 6.2 Fix TextInputField regression (motion tokens)
**Status**: MOVED TO SEPARATE SPEC
**Organization**: spec-completion
**Scope**: 026-test-failure-resolution

---

## Summary

Task 6.2 has been deferred to a separate specification. The TextInputField test failures are not a test infrastructure issue but rather a component architecture issue that requires refactoring the component itself.

---

## Root Cause Analysis

### The Problem

TextInputField tests fail with:
```
Error: Required motion token missing: --motion-float-label-duration
```

### Why This Happens

The TextInputField component has a fundamental architectural conflict between:

1. **CSS Custom Properties** - The component uses `--motion-float-label-duration` token for animation timing
2. **Shadow DOM** - The component uses Shadow DOM for style encapsulation
3. **JavaScript Timing** - The component reads the CSS custom property at runtime via `getComputedStyle()` to coordinate icon visibility with label animation
4. **JSDOM Limitations** - Jest's JSDOM environment doesn't properly compute CSS custom properties from stylesheets for Shadow DOM elements

### The Architectural Issue

Unlike ButtonCTA (which uses pure CSS transitions), TextInputField needs JavaScript to know when the label animation completes so it can show/hide icons at the right time. This creates a dependency:

```typescript
// TextInputField.web.ts - getAnimationDuration() method
private getAnimationDuration(): number {
  const computedStyle = getComputedStyle(this.labelElement);
  const durationStr = computedStyle.getPropertyValue('--motion-float-label-duration').trim();
  
  if (!durationStr) {
    throw new Error('Required motion token missing: --motion-float-label-duration');
  }
  // ... parse and return duration for setTimeout
}
```

This pattern works in real browsers but fails in JSDOM because:
- JSDOM doesn't compute CSS custom properties from stylesheets
- Shadow DOM elements don't inherit CSS custom properties properly in JSDOM
- `getComputedStyle().getPropertyValue('--custom-prop')` returns empty string

---

## Workaround Implemented

A temporary test-side workaround was implemented in `src/components/core/TextInputField/__tests__/setup.ts`:

### Helper Functions

```typescript
// Injects motion tokens directly as inline styles (bypasses JSDOM limitation)
export function injectMotionTokens(component: HTMLElement): void {
  const shadowRoot = (component as any).shadowRoot;
  const labelElement = shadowRoot.querySelector('.input-label');
  (labelElement as HTMLElement).style.setProperty('--motion-float-label-duration', '250ms');
  // ... also sets on input-element and host element
}

// Convenience function for containers with multiple components
export function injectMotionTokensInContainer(container: HTMLElement): void { ... }

// Factory function for creating components with tokens pre-injected
export function createTextInputFieldWithTokens(attributes: Record<string, string>): HTMLElement { ... }
```

### Tests Updated

The following test files were updated to use these helpers:
- `keyboardNavigation.test.ts` - All 14 tests now PASS
- `labelAssociation.test.ts` - All 8 tests now PASS
- `touchTargetSizing.test.ts` - 4 pass, 7 fail (pre-existing issues unrelated to motion tokens)

### Limitation

This workaround requires every test file to explicitly inject tokens. It's a band-aid, not a fix. The underlying architectural issue remains.

---

## Recommended Solution

Refactor TextInputField to use **pure CSS** for animation coordination instead of JavaScript timing:

### Option 1: CSS `transition-delay` (Recommended)

```css
.trailing-icon-container {
  opacity: 0;
  transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
  transition-delay: var(--motion-float-label-duration); /* Delay icon appearance */
}

.input-wrapper.focused .trailing-icon-container,
.input-wrapper.filled .trailing-icon-container {
  opacity: 1;
}
```

This eliminates:
- `getAnimationDuration()` method
- `animationState` tracking in component state
- `setTimeout` calls for animation coordination
- The JSDOM/CSS custom property conflict entirely

### Option 2: `transitionend` Event

Listen for CSS transition completion instead of using `setTimeout`:

```typescript
this.labelElement.addEventListener('transitionend', () => {
  this.animationState = completeLabelAnimation(this.animationState);
  this.updateIconVisibility();
});
```

More robust than `setTimeout` but still requires JavaScript coordination.

---

## Why This Requires a Separate Spec

1. **Scope** - This is component architecture refactoring, not test fixing
2. **Design Decisions** - Choosing between CSS-only vs event-based approaches needs proper design review
3. **Cross-Platform Impact** - Changes to TextInputField may affect iOS/Android implementations
4. **Testing Strategy** - The new approach needs its own test strategy
5. **Validation** - Requires visual/behavioral validation, not just test passing

---

## Files Involved

### Component Files
- `src/components/core/TextInputField/platforms/web/TextInputField.web.ts` - Contains `getAnimationDuration()` method (lines 550-580)
- `src/components/core/TextInputField/stateManagement.ts` - Contains `animationState` tracking and `calculateIconVisibility()`

### Test Files (with workaround)
- `src/components/core/TextInputField/__tests__/setup.ts` - Workaround helpers
- `src/components/core/TextInputField/__tests__/keyboardNavigation.test.ts` - Updated
- `src/components/core/TextInputField/__tests__/labelAssociation.test.ts` - Updated
- `src/components/core/TextInputField/__tests__/touchTargetSizing.test.ts` - Updated

### Reference (pure CSS pattern)
- `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts` - Example of component that works without JavaScript timing

---

## Impact on Spec 026

- **19 test failures remain** due to this deferred task
- Spec 026 cannot achieve "green test suite" without this refactor
- Recommend closing spec 026 with this documented deferral and creating new spec for TextInputField refactoring

---

## New Spec Recommendation

Create spec for "TextInputField Pure CSS Animation Refactor" with:

### Requirements
1. Remove JavaScript dependency on CSS custom property values
2. Maintain icon visibility coordination with label animation
3. Preserve accessibility (WCAG 2.1 AA compliance)
4. Ensure tests pass without workarounds
5. Respect `prefers-reduced-motion`

### Design Considerations
1. CSS `transition-delay` vs `transitionend` event approach
2. Impact on state management (`animationState` removal)
3. Cross-platform consistency (iOS/Android implementations)
4. Backward compatibility

---

*This completion document preserves the investigation findings for the new spec to build upon.*
