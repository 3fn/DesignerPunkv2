# Design Document: TextInputField Animation Refactor

**Date**: December 21, 2025
**Spec**: 027 - TextInputField Animation Refactor
**Status**: Design Phase
**Dependencies**: Spec 013 (TextInputField), Spec 014 (Motion Token System)

---

## Overview

This design document describes the refactoring of the TextInputField web component to eliminate JavaScript-based animation timing coordination. The current implementation uses `getComputedStyle()` to read CSS custom properties at runtime, which fails in JSDOM test environments because JSDOM doesn't compute CSS custom properties from stylesheets for Shadow DOM elements.

The solution replaces JavaScript `setTimeout` coordination with pure CSS `transition-delay`, following the pattern established by ButtonCTA. This is a targeted refactor focused on animation timing—not a full component rewrite.

### Problem Statement

TextInputField tests fail with "Required motion token missing: --motion-float-label-duration" because:
1. Component uses `getComputedStyle().getPropertyValue('--motion-float-label-duration')` to read CSS custom property
2. JSDOM doesn't compute CSS custom properties from stylesheets for Shadow DOM elements
3. Current workaround requires every test to call `injectMotionTokens()` helper

### Solution Summary

Replace JavaScript `setTimeout` timing with CSS `transition-delay`:
- Icons fade in after label floats via CSS `transition-delay: var(--motion-float-label-duration)`
- Icons fade out immediately on blur via `transition-delay: 0ms`
- Remove ~100 lines of animation state management code
- Tests pass without workarounds

---

## Architecture

### Current Architecture (Problem)

```
┌─────────────────────────────────────────────────────────────┐
│                    TextInputField.web.ts                     │
├─────────────────────────────────────────────────────────────┤
│  updateLabelPosition()                                       │
│    ├── getAnimationDuration() ──► getComputedStyle() ❌      │
│    │                              (fails in JSDOM)           │
│    └── setTimeout(updateIconVisibility, duration) ❌         │
│                                                              │
│  animationState: LabelAnimationState ❌                      │
│    ├── isAnimating: boolean                                  │
│    ├── direction: 'up' | 'down'                              │
│    └── progress: number                                      │
└─────────────────────────────────────────────────────────────┘
```

### Proposed Architecture (Solution)

```
┌─────────────────────────────────────────────────────────────┐
│                    TextInputField.web.ts                     │
├─────────────────────────────────────────────────────────────┤
│  updateLabelPosition()                                       │
│    └── Updates CSS classes only ✅                           │
│                                                              │
│  No animation state ✅                                       │
│  No getComputedStyle() ✅                                    │
│  No setTimeout() ✅                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         CSS Styles                           │
├─────────────────────────────────────────────────────────────┤
│  .trailing-icon-container {                                  │
│    opacity: 0;                                               │
│    transition: opacity var(--motion-float-label-duration);   │
│    transition-delay: var(--motion-float-label-duration); ✅  │
│  }                                                           │
│                                                              │
│  .input-wrapper.focused .trailing-icon-container {           │
│    opacity: 1;                                               │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Change

| Aspect | Before | After |
|--------|--------|-------|
| Icon timing coordination | JavaScript `setTimeout` | CSS `transition-delay` |
| Animation state tracking | `LabelAnimationState` object | None (CSS handles) |
| Motion token reading | `getComputedStyle()` at runtime | CSS custom properties only |
| Test compatibility | Requires `injectMotionTokens()` | Works without workarounds |

---

## Components and Interfaces

### Modified Components

#### TextInputField.web.ts

**Removals:**
- `getAnimationDuration()` method (~30 lines)
- `animationState` property
- `setTimeout` calls in `updateLabelPosition()`
- Animation state imports and initialization

**Unchanged:**
- Focus/blur event handlers
- Value change handling
- Validation state management
- Label position CSS class updates
- Icon rendering logic

#### stateManagement.ts

**Removals:**
- `LabelAnimationState` type
- `createInitialAnimationState()` function
- `startLabelAnimation()` function
- `updateAnimationProgress()` function
- `completeLabelAnimation()` function

**Modifications:**
```typescript
// Before: Required animation state parameter
export function calculateIconVisibility(
  state: TextInputFieldState,
  animationState: LabelAnimationState
): IconVisibility {
  const labelFloated = state.isLabelFloated;
  const animationComplete = !animationState.isAnimating || animationState.progress >= 1.0;
  
  return {
    showErrorIcon: state.hasError && labelFloated && animationComplete,
    showSuccessIcon: state.isSuccess && labelFloated && animationComplete,
    showInfoIcon: !!state.showInfoIcon && (state.isFocused || state.isFilled) && animationComplete
  };
}

// After: Pure state-based (no animation parameter)
export function calculateIconVisibility(state: TextInputFieldState): IconVisibility {
  const labelFloated = state.isLabelFloated;
  
  return {
    showErrorIcon: state.hasError && labelFloated,
    showSuccessIcon: state.isSuccess && labelFloated,
    showInfoIcon: !!state.showInfoIcon && (state.isFocused || state.isFilled)
  };
}
```

#### types.ts

**Removals:**
- `LabelAnimationState` interface

```typescript
// Remove this interface
export interface LabelAnimationState {
  isAnimating: boolean;
  direction: 'up' | 'down';
  progress: number;
}
```

### CSS Changes

**Add to inline styles in TextInputField.web.ts:**

```css
/* Icon container - hidden by default with delayed appearance */
.trailing-icon-container {
  opacity: 0;
  transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
  transition-delay: var(--motion-float-label-duration);
}

/* Icons visible when focused or filled (after delay) */
.input-wrapper.focused .trailing-icon-container,
.input-wrapper.filled .trailing-icon-container {
  opacity: 1;
  transition-delay: var(--motion-float-label-duration);
}

/* Icons hide immediately when unfocusing empty input (no delay) */
.input-wrapper:not(.focused):not(.filled) .trailing-icon-container {
  opacity: 0;
  transition-delay: 0ms;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .input-label,
  .trailing-icon-container,
  .input-element {
    transition: none;
  }
}
```

---

## Data Models

### State Model (Unchanged)

```typescript
export interface TextInputFieldState {
  isFocused: boolean;
  isFilled: boolean;
  hasError: boolean;
  isSuccess: boolean;
  isLabelFloated: boolean;
  showInfoIcon?: boolean;
}
```

### Icon Visibility Model (Unchanged)

```typescript
export interface IconVisibility {
  showErrorIcon: boolean;
  showSuccessIcon: boolean;
  showInfoIcon: boolean;
}
```

### Removed Model

```typescript
// REMOVED - No longer needed
export interface LabelAnimationState {
  isAnimating: boolean;
  direction: 'up' | 'down';
  progress: number;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Icon Visibility Determined by State Only

*For any* valid `TextInputFieldState`, calling `calculateIconVisibility(state)` SHALL return an `IconVisibility` object where:
- `showErrorIcon` is true if and only if `state.hasError && state.isLabelFloated`
- `showSuccessIcon` is true if and only if `state.isSuccess && state.isLabelFloated`
- `showInfoIcon` is true if and only if `state.showInfoIcon && (state.isFocused || state.isFilled)`

**Validates: Requirements 3.1, 3.2**

### Property 2: Label Floated When Filled

*For any* `TextInputFieldState` where `isFilled` is true, `isLabelFloated` SHALL also be true, regardless of `isFocused` state.

**Validates: Requirements 4.5**

### Property 3: Validation Icons Require Floated Label

*For any* `TextInputFieldState` where `hasError` or `isSuccess` is true, the corresponding icon SHALL only be visible when `isLabelFloated` is true.

**Validates: Requirements 4.6**

### Property 4: Label Association Integrity

*For any* rendered TextInputField component, the label element's `for` attribute SHALL match the input element's `id` attribute.

**Validates: Requirements 5.2**

### Property 5: Focus Indicator Visibility

*For any* TextInputField component in focused state, the component SHALL have visible focus indicators (CSS class `focused` applied to wrapper).

**Validates: Requirements 5.4**

### Property 6: Error State Dual Identification

*For any* TextInputField component in error state with floated label, the component SHALL display both:
- Visual color indication (error color on label/border)
- Text indication (error message visible)

**Validates: Requirements 5.5**

### Property 7: Keyboard Accessibility

*For any* TextInputField component, the input element SHALL be focusable via keyboard (Tab key) and have appropriate `tabindex` value.

**Validates: Requirements 5.6**

---

## Error Handling

### Graceful Degradation

**CSS Custom Property Fallback:**
If motion tokens are not loaded, CSS transitions will use browser defaults or no transition. This is acceptable because:
1. Visual behavior degrades gracefully (instant state changes)
2. Functionality is not affected
3. No JavaScript errors thrown

**No Runtime Errors:**
The refactored component does not throw errors for missing CSS custom properties because it never reads them via JavaScript.

### Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Rapid focus/blur | CSS `transition-delay` respects current state; no race conditions |
| Validation during animation | Icons appear based on state; CSS handles timing |
| Programmatic value changes | Update `isFilled` state; CSS handles presentation |
| Missing motion tokens | Graceful degradation to instant transitions |

---

## Testing Strategy

### Dual Testing Approach

This refactor uses both unit tests and relies on CSS for visual behavior:

**Unit Tests (Jest/JSDOM):**
- Test `calculateIconVisibility()` state logic
- Test state management functions
- Test component state transitions
- Verify no animation state dependencies

**CSS Behavior (Manual/Visual):**
- Verify icon timing coordination
- Verify reduced motion support
- Verify transition smoothness

### Property-Based Testing Configuration

- **Library**: Jest with custom property generators
- **Minimum iterations**: 100 per property test
- **Tag format**: `Feature: textinputfield-animation-refactor, Property N: [description]`

### Test File Changes

| File | Action | Details |
|------|--------|---------|
| `setup.ts` | Remove helpers | Delete `injectMotionTokens()`, `injectMotionTokensInContainer()`, `createTextInputFieldWithTokens()` |
| `stateManagement.test.ts` | Update + Remove | Remove animation state tests, update `calculateIconVisibility` tests |
| `integration.test.ts` | Update + Remove | Update icon visibility tests, remove "during animation" tests |
| `keyboardNavigation.test.ts` | Update | Remove `injectMotionTokensInContainer` calls |
| `labelAssociation.test.ts` | Update | Remove `injectMotionTokensInContainer` calls |
| `touchTargetSizing.test.ts` | Update | Remove `injectMotionTokens` calls |
| `crossPlatformAnimation.test.ts` | Keep | Token consistency tests unchanged |

### Tests to Remove

```typescript
// Remove these test patterns:
describe('Animation State Management', () => {
  it('should create initial animation state'); // REMOVE
  it('should start label animation'); // REMOVE
  it('should update animation progress'); // REMOVE
  it('should complete label animation'); // REMOVE
});

it('should hide error icon during label animation'); // REMOVE
it('should hide all icons when animation is in progress'); // REMOVE
```

### Tests to Update

```typescript
// Before:
const visibility = calculateIconVisibility(state, animationState);

// After:
const visibility = calculateIconVisibility(state);
```

---

## Design Decisions

### Decision 1: Pure CSS over transitionend Events

**Options Considered**:
1. CSS `transition-delay` for icon timing coordination
2. JavaScript `transitionend` event listeners
3. Keep current `setTimeout` approach with test workarounds

**Decision**: Use CSS `transition-delay` instead of `transitionend` event listeners.

**Rationale**:
- Simpler implementation (no event listener management)
- No edge cases for cancelled transitions
- CSS handles all timing coordination
- `transitionend` can be added later as enhancement if needed

**Trade-offs**: Less precise timing control than `transitionend` events, but sufficient for this use case. Cannot programmatically detect when transitions complete.

### Decision 2: Remove Animation State Entirely

**Options Considered**:
1. Remove `LabelAnimationState` type and all related functions completely
2. Deprecate animation state but keep for backward compatibility
3. Keep animation state but make it optional

**Decision**: Remove `LabelAnimationState` type and all related functions completely.

**Rationale**:
- Animation state was only used for icon timing coordination
- CSS now handles timing via `transition-delay`
- Keeping deprecated types adds confusion
- Clean removal is preferred over deprecation

**Trade-offs**: Breaking change for any code depending on animation state. However, this is internal implementation detail not exposed in public API.

### Decision 3: Trust CSS for Timing

**Options Considered**:
1. Don't unit test CSS timing behavior (trust CSS)
2. Add E2E tests with real browser for timing verification
3. Mock CSS transitions in JSDOM tests

**Decision**: Don't unit test CSS timing behavior; trust CSS for timing coordination.

**Rationale**:
- JSDOM doesn't execute CSS transitions
- CSS `transition-delay` is a well-understood, reliable mechanism
- Unit tests verify state logic; CSS handles presentation
- Visual verification for timing is sufficient

**Trade-offs**: No automated verification of timing behavior. Timing bugs would only be caught through manual testing or user reports.

### Decision 4: Follow ButtonCTA Pattern

**Options Considered**:
1. Use the same CSS transition pattern as ButtonCTA
2. Create a new shared animation utility
3. Use a third-party animation library

**Decision**: Use the same CSS transition pattern as ButtonCTA.

**Rationale**:
- Proven pattern in the codebase
- Consistent architecture across components
- Known to work without JSDOM issues

**Trade-offs**: Pattern duplication across components. Could be refactored into shared utility later if more components need similar behavior.

---

## Implementation Order

1. **Update CSS** - Add `transition-delay` rules to icon container
2. **Simplify stateManagement.ts** - Remove animation state functions, update `calculateIconVisibility()`
3. **Update types.ts** - Remove `LabelAnimationState` interface
4. **Update TextInputField.web.ts** - Remove `getAnimationDuration()`, `animationState`, `setTimeout`
5. **Update test setup** - Remove `injectMotionTokens()` helpers
6. **Update stateManagement.test.ts** - Remove animation tests, update icon visibility tests
7. **Update integration.test.ts** - Update signature, remove "during animation" tests
8. **Update other test files** - Remove token injection calls
9. **Verify behavior** - Manual testing in browser
10. **Run full test suite** - Ensure all tests pass

---

## References

- **Design Outline**: `.kiro/specs/027-textinputfield-animation-refactor/design-outline.md`
- **Requirements**: `.kiro/specs/027-textinputfield-animation-refactor/requirements.md`
- **Root Cause Analysis**: `.kiro/specs/026-test-failure-resolution/completion/task-6-2-completion.md`
- **CodePen Reference**: https://codepen.io/DCODESHOW/pen/VwBGOyP
- **ButtonCTA Pattern**: `src/components/core/ButtonCTA/platforms/web/`
- **Original TextInputField Spec**: `.kiro/specs/013-text-input-field/`

---

*This design document provides the technical specification for implementing the TextInputField animation refactor.*
