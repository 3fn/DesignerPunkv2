# Design Outline: TextInputField Animation Refactor

**Date**: December 20, 2025
**Purpose**: Refactor TextInputField to use pure CSS animation coordination instead of JavaScript timing
**Organization**: spec-guide
**Scope**: 027-textinputfield-animation-refactor

---

## Overview

This design outline describes a targeted refactor of the TextInputField web component to eliminate JavaScript-based animation timing coordination. The current implementation uses `getComputedStyle()` to read CSS custom properties at runtime, which fails in JSDOM test environments.

**Problem Statement**: TextInputField tests fail with "Required motion token missing: --motion-float-label-duration" because JSDOM doesn't properly compute CSS custom properties from stylesheets for Shadow DOM elements.

**Solution**: Replace JavaScript `setTimeout` coordination with pure CSS `transition-delay`, following the pattern established by ButtonCTA.

---

## Current Architecture (Problem)

### How It Works Now

The TextInputField component coordinates icon visibility with label animation using JavaScript:

```typescript
// TextInputField.web.ts - Current approach
private updateLabelPosition(): void {
  // ...
  if (this.animationState.isAnimating) {
    const duration = this.getAnimationDuration(); // ❌ Reads CSS custom property
    setTimeout(() => {                             // ❌ JavaScript timing
      this.animationState = completeLabelAnimation(this.animationState);
      this.updateIconVisibility();
    }, duration);
  }
}

private getAnimationDuration(): number {
  const computedStyle = getComputedStyle(this.labelElement);
  const durationStr = computedStyle.getPropertyValue('--motion-float-label-duration').trim();
  
  if (!durationStr) {
    throw new Error('Required motion token missing: --motion-float-label-duration');
  }
  // ... parse and return duration
}
```

### Why This Fails in Tests

1. **JSDOM Limitation**: JSDOM doesn't compute CSS custom properties from stylesheets
2. **Shadow DOM Complexity**: Shadow DOM elements don't inherit CSS custom properties properly in JSDOM
3. **Runtime Dependency**: Component requires CSS to be loaded and computed before it can function

### Current Workaround

Tests inject motion tokens as inline styles:

```typescript
// setup.ts - Current workaround
export function injectMotionTokens(component: HTMLElement): void {
  const shadowRoot = (component as any).shadowRoot;
  const labelElement = shadowRoot.querySelector('.input-label');
  (labelElement as HTMLElement).style.setProperty('--motion-float-label-duration', '250ms');
}
```

**Problems with workaround**:
- Every test file must remember to inject tokens
- Tests don't reflect production behavior
- Maintenance burden for new tests

---

## Proposed Architecture (Solution)

### Pure CSS Animation Coordination

Replace JavaScript timing with CSS `transition-delay`:

```css
/* Current: Icons appear immediately, JavaScript delays visibility */
.trailing-icon-container {
  opacity: 1;
  transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
}

/* Proposed: CSS delays icon appearance until label animation completes */
.trailing-icon-container {
  opacity: 0;
  transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
  transition-delay: var(--motion-float-label-duration); /* Wait for label to float */
}

.input-wrapper.focused .trailing-icon-container,
.input-wrapper.filled .trailing-icon-container {
  opacity: 1;
  transition-delay: var(--motion-float-label-duration); /* Delay appearance */
}

/* When unfocusing empty input, icons hide immediately (no delay) */
.input-wrapper:not(.focused):not(.filled) .trailing-icon-container {
  opacity: 0;
  transition-delay: 0ms; /* Hide immediately, don't wait */
}
```

### What Gets Removed

**From `TextInputField.web.ts`**:
- `getAnimationDuration()` method (~30 lines)
- `animationState` property
- `setTimeout` calls in `updateLabelPosition()`
- Animation state imports and initialization

**From `stateManagement.ts`**:
- `LabelAnimationState` type (move to deprecated or remove)
- `createInitialAnimationState()` function
- `startLabelAnimation()` function
- `updateAnimationProgress()` function
- `completeLabelAnimation()` function
- `calculateIconVisibility()` animation parameter

### What Gets Simplified

**`calculateIconVisibility()`** becomes:

```typescript
// Before: Requires animation state
export function calculateIconVisibility(
  state: TextInputFieldState,
  animationState: LabelAnimationState  // ❌ Remove this parameter
): IconVisibility {
  const labelFloated = state.isLabelFloated;
  const animationComplete = !animationState.isAnimating || animationState.progress >= 1.0;
  
  return {
    showErrorIcon: state.hasError && labelFloated && animationComplete,
    // ...
  };
}

// After: Pure state-based
export function calculateIconVisibility(state: TextInputFieldState): IconVisibility {
  const labelFloated = state.isLabelFloated;
  
  return {
    showErrorIcon: state.hasError && labelFloated,
    showSuccessIcon: state.isSuccess && labelFloated,
    showInfoIcon: !!state.showInfoIcon && (state.isFocused || state.isFilled)
  };
}
```

---

## Reference: Pure CSS Float Label Pattern

### External Reference: DCODESHOW CodePen

**URL**: https://codepen.io/DCODESHOW/pen/VwBGOyP

This CodePen demonstrates the pure CSS float label pattern using sibling selectors:

```css
/* Label default state - positioned inside input */
.form-group label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  font-size: 14px;
  color: #999;
  padding: 0 5px;
  transition: 0.2s;
  pointer-events: none;
}

/* Label floats when input is focused OR has valid content */
.form-group input:focus ~ label,
.form-group input:valid ~ label {
  top: 0;
  background-color: #fff;
  font-size: 12px;
}
```

**Key CSS Techniques**:
1. **Sibling selector (`~`)**: Label must come AFTER input in DOM for CSS to target it
2. **`:focus` pseudo-class**: Triggers float when user focuses input
3. **`:valid` pseudo-class**: Keeps label floated when input has content (requires `required` attribute)
4. **`transition`**: Animates all property changes smoothly
5. **`pointer-events: none`**: Allows clicks to pass through label to input

**Limitation**: The `:valid` approach requires the `required` attribute on inputs. Our implementation uses JavaScript state (`isFilled`) for more flexibility, but the CSS transition pattern is the same.

### Internal Reference: ButtonCTA Pattern

ButtonCTA uses pure CSS transitions without JavaScript timing:

```css
/* ButtonCTA.web.css - Pure CSS transitions */
.button-cta {
  transition: background-color var(--duration-150) ease-in-out,
              border-color var(--duration-150) ease-in-out,
              color var(--duration-150) ease-in-out,
              opacity var(--duration-150) ease-in-out,
              box-shadow var(--duration-150) ease-in-out;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .button-cta {
    transition: none;
  }
}
```

**Key insight**: Neither the CodePen nor ButtonCTA need JavaScript to coordinate animation timing. CSS handles all timing through `transition` properties. TextInputField should follow the same pattern.

---

## Animation Behavior (Unchanged)

The visual behavior remains identical to the current implementation:

### State Transitions

**1. Rest, Empty → Active, Empty** (user focuses empty input):
- Label floats up (250ms, standard easing)
- Label color: muted → primary
- Icons fade in **after** label floats (via `transition-delay`)
- Border: default → primary

**2. Active, Empty → Rest, Empty** (user blurs empty input):
- Label returns down (250ms, standard easing)
- Label color: primary → muted
- Icons fade out **immediately** (no delay)
- Border: primary → default

**3. Active, Filled → Rest, Filled** (user blurs filled input):
- Label stays floated (no animation)
- Icons fade out (optional, depends on design)
- Border: primary → default

### Icon Timing Coordination

The key insight is that `transition-delay` achieves the same effect as `setTimeout`:

| Scenario | Current (JS) | Proposed (CSS) |
|----------|--------------|----------------|
| Focus empty input | `setTimeout(showIcons, 250)` | `transition-delay: 250ms` |
| Blur empty input | `setTimeout(hideIcons, 0)` | `transition-delay: 0ms` |
| Focus filled input | Icons already visible | Icons already visible |
| Blur filled input | Icons hide | Icons hide |

**Applying the CodePen Pattern to Icons**:

The CodePen shows how CSS can coordinate multiple property changes with a single `transition`. We extend this to coordinate icon visibility with label position:

```css
/* Label transitions (from CodePen pattern) */
.input-label {
  transition: 
    transform var(--motion-float-label-duration) var(--motion-float-label-easing),
    font-size var(--motion-float-label-duration) var(--motion-float-label-easing),
    color var(--motion-float-label-duration) var(--motion-float-label-easing);
}

/* Icon transitions - DELAYED to start after label animation */
.trailing-icon-container {
  opacity: 0;
  transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
  transition-delay: var(--motion-float-label-duration); /* Wait for label to finish */
}

/* When focused/filled, icons become visible (after delay) */
.input-wrapper.focused .trailing-icon-container,
.input-wrapper.filled .trailing-icon-container {
  opacity: 1;
}
```

This achieves the same "icons appear after label floats" behavior without any JavaScript timing coordination.

---

## Token Usage (Unchanged)

The refactor uses the same motion tokens:

### Motion Tokens
- `motion.floatLabel.duration` (250ms) - Label transition duration
- `motion.floatLabel.easing` (standard) - Label transition easing

### CSS Custom Properties
- `--motion-float-label-duration`: 250ms
- `--motion-float-label-easing`: cubic-bezier(0.4, 0.0, 0.2, 1)

**Key difference**: Tokens are only used in CSS, never read by JavaScript.

---

## Accessibility (Unchanged)

All accessibility features remain intact:

### WCAG 2.1 AA Compliance
- ✅ Label association (for attribute)
- ✅ Color contrast (4.5:1 minimum)
- ✅ Focus indicators (2px solid primary)
- ✅ Error identification (color AND text)
- ✅ Keyboard navigation
- ✅ Screen reader support

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .input-label,
  .trailing-icon-container,
  .input-element {
    transition: none;
  }
}
```

---

## Tradeoffs Analysis

### What Stays JavaScript-Controlled

The refactor only affects **animation timing coordination**. All other logic remains in JavaScript:

| Feature | Before Refactor | After Refactor | Why |
|---------|-----------------|----------------|-----|
| Focus/blur detection | JS event handlers | JS event handlers | CSS can't dispatch events |
| Value tracking (`isFilled`) | JS state | JS state | Need to know if input has content |
| Error state (`hasError`) | JS state (from props) | JS state (from props) | Validation is external |
| Success state (`isSuccess`) | JS state (from props) | JS state (from props) | Validation is external |
| Label position (`isLabelFloated`) | JS state | JS state | Drives CSS classes |
| Icon selection (which icon) | JS logic | JS logic | Based on validation state |
| **Icon visibility timing** | **JS setTimeout** | **CSS transition-delay** | **This is the change** |

### What We Gain

1. ✅ **Tests work without workarounds** - No `injectMotionTokens()` calls needed
2. ✅ **~100 fewer lines of code** - Remove animation state management
3. ✅ **No runtime CSS property reading** - Eliminates JSDOM incompatibility
4. ✅ **More predictable behavior** - CSS timing is deterministic
5. ✅ **Better separation of concerns** - JS handles state, CSS handles presentation
6. ✅ **Simpler mental model** - No animation state machine to reason about

### What We Lose

1. ⚠️ **Less precise timing control** - CSS `transition-delay` is "fire and forget"; can't cancel mid-animation
2. ⚠️ **No animation callbacks** - Can't run arbitrary code "when animation completes" (without `transitionend`)
3. ⚠️ **Harder to debug** - Animation timing issues are harder to trace in CSS than JS

### Edge Case Analysis

**Edge Case 1: Rapid Focus/Blur**

User quickly focuses and blurs the input.

- **Current (JS)**: `setTimeout` might fire after blur, showing icons briefly
- **Proposed (CSS)**: `transition-delay` respects current state - if unfocused, icons stay hidden
- **Winner**: CSS - More predictable behavior

**Edge Case 2: Validation Changes During Animation**

User focuses empty input, starts typing, validation error appears mid-animation.

- **Current (JS)**: Animation state might delay error icon appearance
- **Proposed (CSS)**: Error icon appears based on state (CSS handles timing)
- **Winner**: CSS - Error feedback is faster

**Edge Case 3: Programmatic Value Changes**

JavaScript sets input value without user interaction.

- **Current (JS)**: Needs to manually trigger animation state
- **Proposed (CSS)**: Just update `isFilled` state, CSS handles the rest
- **Winner**: CSS - Simpler state management

---

## Future Extensibility

### The `transitionend` Option

While pure CSS `transition-delay` solves our immediate problem, we may want animation callbacks in the future. Good news: **`transitionend` events work fine in JSDOM** - the issue is only with `getComputedStyle()` reading CSS custom property values.

| Feature | JSDOM Support | Our Current Problem |
|---------|---------------|---------------------|
| `transitionend` event | ✅ Works | Not the issue |
| `getComputedStyle()` | ✅ Works | Not the issue |
| CSS custom properties from stylesheets | ❌ Doesn't compute | **This is the issue** |

### Hybrid Approach (Future Enhancement)

If we need animation callbacks later, we can add `transitionend` listeners without breaking the CSS-based timing:

```typescript
// CSS handles the visual timing (transition-delay)
// transitionend provides optional callbacks

private setupTransitionCallbacks(): void {
  if (this.labelElement) {
    this.labelElement.addEventListener('transitionend', this.onLabelTransitionEnd);
  }
}

private onLabelTransitionEnd = (event: TransitionEvent): void => {
  // Only respond to transform transitions (the label float)
  if (event.propertyName === 'transform') {
    // Dispatch custom event for external listeners
    this.dispatchEvent(new CustomEvent('label-animation-complete', {
      detail: { direction: this.state.isLabelFloated ? 'up' : 'down' },
      bubbles: true,
      composed: true
    }));
  }
};

// Cleanup in disconnectedCallback
private cleanupTransitionCallbacks(): void {
  if (this.labelElement) {
    this.labelElement.removeEventListener('transitionend', this.onLabelTransitionEnd);
  }
}
```

### Potential Future Use Cases

**Analytics**:
```typescript
textInput.addEventListener('label-animation-complete', (e) => {
  analytics.track('input_focused', { field: e.target.id });
});
```

**Sequential Animations**:
```typescript
textInput.addEventListener('label-animation-complete', (e) => {
  this.showTooltip(); // Start next animation after label settles
});
```

**Accessibility Announcements**:
```typescript
textInput.addEventListener('label-animation-complete', (e) => {
  this.announceToScreenReader('Label moved to top of field');
});
```

### Recommendation

**Start with pure CSS, design for extensibility.**

1. **Solve the immediate problem first** - Get tests passing with `transition-delay`
2. **Don't over-engineer** - No concrete use case for `transitionend` callbacks yet
3. **Keep the door open** - The hybrid approach can be added as a non-breaking enhancement
4. **YAGNI principle** - "You Aren't Gonna Need It" until you do

The CSS `transition-delay` approach doesn't prevent us from also listening to `transitionend` events later.

---

## Scope Boundaries

### In Scope (Web Only)
- `TextInputField.web.ts` - Remove JS timing coordination
- `stateManagement.ts` - Simplify animation state
- CSS styles - Add `transition-delay` for icon timing
- Tests - Remove token injection workarounds

### Out of Scope
- iOS implementation (uses native animation APIs)
- Android implementation (uses native animation APIs)
- Float label pattern (unchanged)
- Typography tokens (unchanged)
- State management logic (focus, blur, validation)
- Accessibility features (unchanged)

---

## Risk Assessment

### Low Risk
- **Visual behavior unchanged** - Same animations, same timing
- **CSS-only change** - No new JavaScript complexity
- **Follows established pattern** - ButtonCTA already works this way
- **Testable** - No JSDOM workarounds needed

### Medium Risk
- **CSS specificity** - Need to ensure `transition-delay` rules apply correctly
- **State combinations** - Must handle all focus/filled/error combinations

### Mitigation
- Comprehensive test coverage for all state combinations
- Visual regression testing (manual or automated)
- Compare before/after behavior in real browser

---

## Success Criteria

1. **Tests pass without workarounds** - No `injectMotionTokens()` calls needed
2. **Visual behavior identical** - Icons appear after label floats
3. **Reduced code complexity** - Remove ~100 lines of animation state management
4. **Accessibility maintained** - All WCAG 2.1 AA requirements still met
5. **Reduced motion respected** - `prefers-reduced-motion` still works
6. **Test suite updated** - Animation state tests removed, icon visibility tests use new signature
7. **Clean test setup** - No token injection helpers needed

---

## Files to Modify

### Primary Changes
| File | Change |
|------|--------|
| `src/components/core/TextInputField/platforms/web/TextInputField.web.ts` | Remove `getAnimationDuration()`, `animationState`, `setTimeout` |
| `src/components/core/TextInputField/stateManagement.ts` | Remove animation state functions, simplify `calculateIconVisibility()` |
| `src/components/core/TextInputField/types.ts` | Remove or deprecate `LabelAnimationState` type |

### CSS Changes
| File | Change |
|------|--------|
| Inline styles in `TextInputField.web.ts` | Add `transition-delay` to `.trailing-icon-container` |

### Test Changes
| File | Change |
|------|--------|
| `src/components/core/TextInputField/__tests__/setup.ts` | Remove `injectMotionTokens()`, `injectMotionTokensInContainer()`, `createTextInputFieldWithTokens()` |
| `src/components/core/TextInputField/__tests__/stateManagement.test.ts` | Remove animation state tests, update `calculateIconVisibility` tests |
| `src/components/core/TextInputField/__tests__/integration.test.ts` | Update icon visibility tests to use new signature, remove "during animation" tests |
| `src/components/core/TextInputField/__tests__/keyboardNavigation.test.ts` | Remove `injectMotionTokensInContainer` calls |
| `src/components/core/TextInputField/__tests__/labelAssociation.test.ts` | Remove `injectMotionTokensInContainer` calls |
| `src/components/core/TextInputField/__tests__/touchTargetSizing.test.ts` | Remove `injectMotionTokens` calls |

---

## Testing Strategy

### Test Categories After Refactor

**Tests to KEEP unchanged:**
- Icon creation tests (`createIcon({ name: 'x-circle', ... })`) - Icon component integration unaffected
- Motion token retrieval tests (`getMotionToken('motion.floatLabel')`) - Token system unaffected
- Form integration tests - Form submission/validation unaffected
- Cross-platform token consistency tests - Token values unchanged
- State management tests for focus/blur/value/validation - Core state logic unchanged

**Tests to UPDATE (signature change):**
- All `calculateIconVisibility(state, animationState)` calls → `calculateIconVisibility(state)`
- Tests verifying "show icon when label floated" - Keep logic, remove animation parameter

**Tests to REMOVE:**
- `createInitialAnimationState()` tests
- `startLabelAnimation()` tests
- `updateAnimationProgress()` tests
- `completeLabelAnimation()` tests
- "should hide icon during label animation" tests
- "should hide all icons when animation is in progress" tests

**Test helpers to REMOVE:**
- `injectMotionTokens()` - No longer needed
- `injectMotionTokensInContainer()` - No longer needed
- `createTextInputFieldWithTokens()` - No longer needed
- `:root` CSS custom property injection in setup.ts - No longer needed

### Rationale for Test Changes

**Why remove "during animation" tests?**

The "icons hidden during animation" behavior moves from JavaScript to CSS:

```css
/* CSS now handles timing via transition-delay */
.trailing-icon-container {
  transition-delay: var(--motion-float-label-duration);
}
```

This behavior:
1. Cannot be reliably tested in JSDOM (CSS transitions don't execute)
2. Is a well-understood CSS mechanism that doesn't need unit testing
3. Can be verified manually or with visual regression tools if needed

**Why keep icon visibility state tests?**

The business rule "show error icon when in error state with label floated" is still valid. We're just simplifying the function signature:

```typescript
// Before: Required animation state
calculateIconVisibility(state, animationState)

// After: Pure state-based
calculateIconVisibility(state)
```

The tests verify the state-based logic, which is still JavaScript and still testable.

### Trust CSS Principle

For timing coordination, we adopt a "trust CSS" approach:

1. **CSS `transition-delay` is reliable** - Well-supported, deterministic behavior
2. **Unit tests verify state logic** - What icons should show based on state
3. **CSS handles presentation timing** - When icons appear relative to label animation
4. **Visual verification for timing** - Manual testing or visual regression tools

This separation of concerns (JS for state, CSS for presentation) is cleaner and more testable than the previous approach.

---

## Alternative Approaches Considered

### Option 1: `transitionend` Event Only (Rejected for Now)

```typescript
this.labelElement.addEventListener('transitionend', () => {
  this.updateIconVisibility();
});
```

**Pros**: 
- More precise timing (fires exactly when transition ends)
- Can run arbitrary code on animation complete
- Works in JSDOM (no CSS property reading)

**Cons**: 
- More code than pure CSS
- Need to manage event listener lifecycle
- Need to filter by `propertyName` (multiple properties transition)
- Edge case handling for cancelled transitions

**Verdict**: Not rejected permanently - can be added later as enhancement. See "Future Extensibility" section.

### Option 2: CSS Animation with `animation-delay` (Rejected)

```css
@keyframes fadeInIcon {
  from { opacity: 0; }
  to { opacity: 1; }
}

.trailing-icon-container {
  animation: fadeInIcon 250ms ease-in-out 250ms forwards;
}
```

**Pros**: More control over animation
**Cons**: More complex, harder to coordinate with transitions, requires animation reset logic

### Option 3: Pure CSS `transition-delay` (Selected)

**Pros**: 
- Simplest approach
- No JavaScript timing
- Follows ButtonCTA pattern
- Works in JSDOM (no runtime CSS computation needed)
- Extensible with `transitionend` later if needed

**Cons**: 
- Less precise than `transitionend` event
- Relies on CSS cascade for state management
- Can't run arbitrary code on animation complete (without adding `transitionend`)

### Option 4: Hybrid CSS + `transitionend` (Future Enhancement)

**Description**: Use CSS `transition-delay` for visual behavior, add optional `transitionend` listeners for callbacks.

**Status**: Documented as future enhancement path. Not implementing now (YAGNI), but architecture supports it.

---

## Implementation Order

1. **Update CSS** - Add `transition-delay` rules
2. **Simplify state management** - Remove animation state
3. **Update component** - Remove JS timing code
4. **Update tests** - Remove workarounds
5. **Verify behavior** - Manual testing in browser
6. **Document** - Update any affected documentation

---

## Open Questions

### Q1: Should we keep `LabelAnimationState` type for backward compatibility?

**Decision**: Remove. The type is no longer used and keeping it suggests the old architecture is still relevant. Clean removal is preferred.

### Q2: Should `injectMotionTokens()` helpers remain in test setup?

**Decision**: Remove. They're no longer needed and their presence suggests the workaround is still required. Clean removal prevents confusion.

### Q3: Should we add visual regression tests?

**Recommendation**: Not for this refactor. Manual verification is sufficient for the scope. Visual regression testing can be added as a separate initiative if needed.

### Q4: How should we handle "during animation" tests?

**Decision**: Remove with documentation. These tests verified JavaScript-based timing coordination that now moves to CSS. The behavior is still correct, but CSS `transition-delay` handles it. Add comments in test files explaining this architectural change.

---

## References

- **CodePen (DCODESHOW)**: https://codepen.io/DCODESHOW/pen/VwBGOyP - Pure CSS float label pattern
- **Spec 013**: Original TextInputField implementation
- **Spec 014**: Motion Token System
- **Spec 026 Task 6.2**: Root cause analysis and workaround documentation
- **ButtonCTA**: Reference implementation for pure CSS transitions
- **Brad Frost Float Label Pattern**: https://bradfrost.com/blog/post/float-label-pattern/
- **CSS-only Floating Label (dev.to)**: https://dev.to/peiche/css-only-floating-label-3cp/

---

*This design outline provides the foundation for requirements and implementation planning.*
