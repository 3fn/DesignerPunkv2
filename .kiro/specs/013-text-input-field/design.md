# Design Document: Text Input Field Component

**Date**: December 6, 2025  
**Spec**: 013-text-input-field  
**Status**: Design Phase  
**Dependencies**: 
- Spec 014 (Motion Token System) - Complete
- Icon Component (Spec 008) - Complete
- Existing semantic tokens (typography, color, spacing, border, accessibility)

---

## Overview

This document defines the technical design for the Text Input Field component, implementing the float label pattern with animated transitions. The component validates the motion token system (Spec 014) and establishes animation patterns for the DesignerPunk design system.

**Key Design Principles**:
- **True Native Architecture**: Separate platform implementations (web/iOS/Android)
- **Compositional Token Usage**: References semantic tokens, not hard-coded values
- **Accessibility First**: WCAG 2.1 AA compliance built-in, not bolted-on
- **Motion Token Integration**: First component to use motion.floatLabel semantic token
- **Future-Proof Structure**: Background property support for future enhancements

---

## Architecture

### Component Structure

```
src/components/core/TextInputField/
├── README.md                          # Component documentation
├── types.ts                           # Shared TypeScript interfaces
├── tokens.ts                          # Component-level token references
├── __tests__/                         # Cross-platform tests
│   ├── TextInputField.test.ts         # Unit tests
│   └── TextInputField.integration.test.ts  # Integration tests
├── examples/                          # HTML canary validation examples
│   └── TextInputStateExamples.html    # All component states in one file
└── platforms/                         # Platform-specific implementations
    ├── web/
    │   ├── TextInputField.web.ts      # Web component implementation
    │   └── TextInputField.web.css     # Web component styles
    ├── ios/
    │   └── TextInputField.ios.swift   # SwiftUI implementation
    └── android/
        └── TextInputField.android.kt  # Jetpack Compose implementation
```

### Component Hierarchy

```
TextInputField (Container)
├── Label (Float Label)
├── Input (Text Field)
├── Helper Text (Persistent)
├── Error Message (Conditional)
└── Trailing Icon (Conditional)
```

---

## Components and Interfaces

### TypeScript Interfaces

```typescript
/**
 * Text Input Field Component Props
 * 
 * Defines the public API for the TextInputField component across all platforms.
 */
export interface TextInputFieldProps {
  /** Unique identifier for the input element */
  id: string;
  
  /** Label text (floats between placeholder and floated positions) */
  label: string;
  
  /** Current input value */
  value: string;
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Callback when input receives focus */
  onFocus?: () => void;
  
  /** Callback when input loses focus */
  onBlur?: () => void;
  
  /** Helper text displayed below input (persistent) */
  helperText?: string;
  
  /** Error message displayed below helper text (conditional) */
  errorMessage?: string;
  
  /** Success state indicator (shows success icon) */
  isSuccess?: boolean;
  
  /** Info icon support (shows info icon, triggers helper text) */
  showInfoIcon?: boolean;
  
  /** Input type (text, email, password, etc.) */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  
  /** Autocomplete attribute for browser autofill */
  autocomplete?: string;
  
  /** Placeholder text (only shown when label is floated and input is empty) */
  placeholder?: string;
  
  /** Read-only state (alternative to disabled) */
  readOnly?: boolean;
  
  /** Required field indicator */
  required?: boolean;
  
  /** Maximum length for input value */
  maxLength?: number;
  
  /** Test ID for automated testing */
  testID?: string;
  
  /** Additional CSS class names (web only) */
  className?: string;
}

/**
 * Text Input Field State
 * 
 * Internal state management for component behavior.
 */
export interface TextInputFieldState {
  /** Whether input currently has focus */
  isFocused: boolean;
  
  /** Whether input has content (determines label position) */
  isFilled: boolean;
  
  /** Whether input is in error state */
  hasError: boolean;
  
  /** Whether input is in success state */
  isSuccess: boolean;
  
  /** Whether label should be in floated position */
  isLabelFloated: boolean;
}

/**
 * Label Animation State
 * 
 * Tracks label animation for coordinated icon timing.
 */
export interface LabelAnimationState {
  /** Whether label is currently animating */
  isAnimating: boolean;
  
  /** Animation direction (float up or return down) */
  direction: 'up' | 'down';
  
  /** Animation progress (0-1) */
  progress: number;
}
```

---

## Data Models

### Component State Machine

The TextInputField follows a state machine pattern for clear state transitions:

```
States:
- Empty, Not Focused (default)
- Empty, Focused (active)
- Filled, Not Focused (filled)
- Filled, Focused (active filled)
- Error (any focus/fill state)
- Success (any focus/fill state)

Transitions:
Empty, Not Focused → Empty, Focused (user focuses)
Empty, Focused → Empty, Not Focused (user blurs empty input)
Empty, Focused → Filled, Focused (user types)
Filled, Focused → Filled, Not Focused (user blurs filled input)
Filled, Not Focused → Filled, Focused (user focuses filled input)
Any State → Error (validation fails)
Any State → Success (validation succeeds)
Error/Success → Previous State (validation clears)
```

### Label Position Calculation

Label position depends on state:

```typescript
function calculateLabelPosition(state: TextInputFieldState): LabelPosition {
  // Label floats when input has focus OR has content
  const shouldFloat = state.isFocused || state.isFilled;
  
  return {
    isFloated: shouldFloat,
    fontSize: shouldFloat ? 'typography.labelMdFloat' : 'typography.labelMd',
    color: state.hasError ? 'color.error' :
           state.isSuccess ? 'color.success' :
           state.isFocused ? 'color.primary' :
           shouldFloat ? 'color.text.subtle' :
           'color.text.subtle',
    position: shouldFloat ? 'above' : 'inside'
  };
}
```

### Icon Visibility Logic

Icons appear based on state and timing:

```typescript
function calculateIconVisibility(state: TextInputFieldState, animationState: LabelAnimationState): IconVisibility {
  // Icons appear after label floats (no spatial conflict)
  const labelFloated = state.isLabelFloated;
  const animationComplete = !animationState.isAnimating || animationState.progress >= 1.0;
  
  return {
    showErrorIcon: state.hasError && labelFloated && animationComplete,
    showSuccessIcon: state.isSuccess && labelFloated && animationComplete,
    showInfoIcon: state.showInfoIcon && (state.isFocused || state.isFilled) && animationComplete
  };
}
```

---

## Token Consumption

### Typography Tokens

```typescript
export const textInputFieldTokens = {
  typography: {
    label: 'typography.labelMd',           // 16px, inside input
    labelFloat: 'typography.labelMdFloat', // 14px (scale088 × 16px), floated above
    input: 'typography.input',             // 16px, input text
    helper: 'typography.caption',          // 13px, helper text
    error: 'typography.caption'            // 13px, error message
  }
};
```

### Color Tokens

```typescript
export const textInputFieldTokens = {
  color: {
    labelDefault: 'color.text.subtle',     // Label when not focused
    labelFocused: 'color.primary',         // Label when focused (with blend.focusSaturate)
    labelError: 'color.error',             // Label in error state
    labelSuccess: 'color.success',         // Label in success state
    inputText: 'color.text.default',       // Input text color
    helperText: 'color.text.subtle',       // Helper text color
    errorText: 'color.error',              // Error message color
    borderDefault: 'color.border',         // Border when not focused
    borderFocused: 'color.primary',        // Border when focused (with blend.focusSaturate)
    borderError: 'color.error',            // Border in error state
    borderSuccess: 'color.success',        // Border in success state
    background: 'color.background',        // Input background (white, supports future tint)
    focusRing: 'accessibility.focus.color' // Focus ring color
  }
};
```

### Spacing Tokens

```typescript
export const textInputFieldTokens = {
  spacing: {
    inputPadding: 'space.inset.normal',    // Input padding (horizontal and vertical)
    labelOffset: 'space.grouped.tight',    // Space between floated label and input
    helperOffset: 'space.grouped.minimal', // Space between input and helper text
    errorOffset: 'space.grouped.minimal'   // Space between helper text and error message
  }
};
```

### Motion Tokens

```typescript
export const textInputFieldTokens = {
  motion: {
    labelFloat: 'motion.floatLabel',       // Semantic token (duration250 + easingStandard)
    iconFade: 'motion.floatLabel',         // Reuse same timing for icon coordination
    scale: 'scale088'                      // Typography scale for label animation
  }
};
```

### Border and Accessibility Tokens

```typescript
export const textInputFieldTokens = {
  border: {
    width: 'borderDefault',                // Border width (1px)
    radius: 'radius150'                    // Border radius (6px)
  },
  accessibility: {
    minHeight: 'tapAreaRecommended',       // Minimum touch target height (48px)
    focusWidth: 'accessibility.focus.width',   // Focus ring width (2px)
    focusOffset: 'accessibility.focus.offset', // Focus ring offset (2px)
    focusColor: 'accessibility.focus.color'    // Focus ring color (primary)
  }
};
```

### Blend Tokens

```typescript
export const textInputFieldTokens = {
  blend: {
    focusSaturate: 'blend.focusSaturate'   // Focus state emphasis (8% more saturated)
  }
};
```

---

## Float Label Animation

### Animation Sequence

**Empty → Focused (Label Floats Up)**:

```
1. User focuses empty input
2. Label animates simultaneously:
   - fontSize: typography.labelMd → typography.labelMdFloat (via scale088)
   - color: color.text.subtle → color.primary (with blend.focusSaturate)
   - position: inside input → above input (translateY)
   - Duration: motion.floatLabel (250ms)
   - Easing: easingStandard
3. After animation completes (250ms):
   - Icons fade in (if applicable)
   - Border color: color.border → color.primary (with blend.focusSaturate)
   - Focus ring appears
```

**Focused → Empty (Label Returns Down)**:

```
1. User blurs empty input
2. Label animates simultaneously:
   - fontSize: typography.labelMdFloat → typography.labelMd
   - color: color.primary → color.text.subtle
   - position: above input → inside input (translateY)
   - Duration: motion.floatLabel (250ms)
   - Easing: easingStandard
3. After animation completes (250ms):
   - Icons fade out (if applicable)
   - Border color: color.primary → color.border
   - Focus ring disappears
```

**Filled States (No Animation)**:

When input has content, label stays floated regardless of focus:
- Focused → Blurred: Label stays floated, only border/focus ring changes
- Blurred → Focused: Label stays floated, only border/focus ring changes

### Platform-Specific Animation Implementation

**Web (CSS Transitions)**:

```css
.input-label {
  font-size: var(--typography-label-md-font-size);
  color: var(--color-text-subtle);
  transform: translateY(-50%);
  transition: 
    font-size var(--motion-float-label-duration) var(--motion-float-label-easing),
    color var(--motion-float-label-duration) var(--motion-float-label-easing),
    transform var(--motion-float-label-duration) var(--motion-float-label-easing);
}

.input-label.floated {
  font-size: var(--typography-label-md-float-font-size);
  color: var(--color-primary);
  transform: translateY(-100%) translateY(calc(-1 * var(--space-grouped-tight)));
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .input-label {
    transition: none;
  }
}
```

**iOS (SwiftUI)**:

```swift
Text(label)
  .font(isFloated ? typographyLabelMdFloat : typographyLabelMd)
  .foregroundColor(isFloated ? colorPrimary : colorTextSubtle)
  .offset(y: isFloated ? -labelFloatOffset : 0)
  .animation(
    reduceMotion ? .none : .timingCurve(0.4, 0.0, 0.2, 1.0, duration: 0.25),
    value: isFloated
  )
```

**Android (Jetpack Compose)**:

```kotlin
Text(
    text = label,
    style = if (isFloated) typographyLabelMdFloat else typographyLabelMd,
    color = if (isFloated) colorPrimary else colorTextSubtle,
    modifier = Modifier
        .offset(y = animateFloatAsState(
            targetValue = if (isFloated) -labelFloatOffset else 0f,
            animationSpec = if (reduceMotion) snap() else tween(
                durationMillis = 250,
                easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
            )
        ).value.dp)
)
```

---

## Icon Integration

### Icon Component Usage

**Web Platform** (`src/components/core/Icon/platforms/web/Icon.web.ts`):

```typescript
// Using dp-icon web component
<dp-icon 
  name="x-circle" 
  size="24" 
  color="color-error"
  test-id="error-icon"
></dp-icon>

// Or using createIcon function
import { createIcon } from '../Icon/platforms/web/Icon.web';
const errorIcon = createIcon({ 
  name: 'x-circle', 
  size: 24, 
  color: 'color-error' 
});
```

**iOS Platform** (`src/components/core/Icon/platforms/ios/Icon.ios.swift`):

```swift
// Using Icon component iOS implementation
// Platform-specific icon rendering with Feather icon assets
Icon(name: "x-circle", size: 24, color: colorError)
```

**Android Platform** (`src/components/core/Icon/platforms/android/Icon.android.kt`):

```kotlin
// Using Icon component Android implementation
// Platform-specific icon rendering with Feather icon assets
Icon(name = "x-circle", size = 24, color = colorError)
```

### Icon Specifications

**Error Icon**: `icons-feather/x-circle.svg`
- Size: 24px
- Color: color.error
- Appears when: hasError && isLabelFloated && animationComplete

**Success Icon**: `icons-feather/check.svg`
- Size: 24px
- Color: color.success
- Appears when: isSuccess && isLabelFloated && animationComplete

**Info Icon**: `icons-feather/info.svg`
- Size: 24px
- Color: color.text.subtle
- Appears when: showInfoIcon && (isFocused || isFilled) && animationComplete
- Interaction: Triggers helper text display/tooltip

### Icon Animation Timing

Icons coordinate with label float animation:

```typescript
// Icon fade-in after label floats
const iconOpacity = labelAnimationComplete ? 1.0 : 0.0;
const iconTransition = `opacity ${motion.floatLabel.duration} ${motion.floatLabel.easing}`;
```

---

## Validation Feedback

### Validation States

**Error State**:
- Triggered by: External validation (prop: errorMessage)
- Visual indicators: Red border, red label, error icon, error message
- Accessibility: Error message announced to screen readers via aria-describedby

**Success State**:
- Triggered by: External validation (prop: isSuccess)
- Visual indicators: Green border, green label, success icon (checkmark)
- No success message (visual confirmation only)

**Validation Timing**:
- Validation triggered externally (not by component)
- Component displays validation state via props
- Validation can occur on blur, on submit, or real-time

### Error Message Display

**Two-Element Approach**:

```html
<div class="input-messages">
  <!-- Helper text (persistent) -->
  <p class="helper-text" id="helper-{id}">
    {helperText}
  </p>
  
  <!-- Error message (conditional) -->
  {#if errorMessage}
    <p class="error-message" id="error-{id}">
      {errorMessage}
    </p>
  {/if}
</div>
```

**Accessibility Association**:

```html
<input
  id="{id}"
  aria-describedby="helper-{id} error-{id}"
  aria-invalid="{hasError}"
/>
```

---

## Accessibility Implementation

### WCAG 2.1 AA Compliance

**Label Association** (2.4.6 Headings and Labels):
```html
<label for="{id}">{label}</label>
<input id="{id}" />
```

**Error Identification** (3.3.1 Error Identification):
```html
<input aria-invalid="true" aria-describedby="error-{id}" />
<p id="error-{id}" role="alert">{errorMessage}</p>
```

**Focus Visible** (2.4.7 Focus Visible):
```css
.input-field:focus {
  outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
  outline-offset: var(--accessibility-focus-offset);
}
```

**Color Contrast** (1.4.3 Contrast Minimum):
- All text colors meet 4.5:1 contrast ratio
- Focus indicators meet 3:1 contrast ratio (1.4.11 Non-text Contrast)

**Reduced Motion** (2.3.3 Animation from Interactions):
```css
@media (prefers-reduced-motion: reduce) {
  .input-label {
    transition: none;
  }
}
```

### Screen Reader Support

**Label Announcement**:
- Label announced when input receives focus
- Label remains programmatically associated even when floated

**Error Announcement**:
- Error message has `role="alert"` for immediate announcement
- Error message associated via `aria-describedby`

**Helper Text Announcement**:
- Helper text associated via `aria-describedby`
- Announced when input receives focus

---

## Testing Strategy

### Unit Tests

**Label Animation Tests**:
- Label floats when input focused (empty)
- Label returns when input blurred (empty)
- Label stays floated when input has content
- Label uses correct typography tokens (labelMd, labelMdFloat)
- Label uses correct colors based on state

**State Management Tests**:
- State transitions follow state machine
- isFocused updates on focus/blur
- isFilled updates when value changes
- hasError updates when errorMessage provided
- isSuccess updates when isSuccess prop changes

**Icon Visibility Tests**:
- Error icon appears in error state after label floats
- Success icon appears in success state after label floats
- Info icon appears when focused/filled after label floats
- Icons fade in/out coordinated with label animation

**Accessibility Tests**:
- Label has correct `for` attribute
- Input has correct `aria-describedby`
- Error message has `role="alert"`
- Focus ring visible and meets contrast requirements
- Reduced motion respected

### Integration Tests

**Form Integration**:
- Input works in form context
- Enter key submits form
- Validation integrates with form validation
- Autocomplete works correctly

**Icon Component Integration**:
- Error icon renders using platform icon component
- Success icon renders using platform icon component
- Info icon renders using platform icon component
- Icons use correct Feather icon assets

**Motion Token Integration**:
- Animation uses motion.floatLabel timing
- Animation uses scale088 for typography scaling
- Animation respects prefers-reduced-motion
- Cross-platform timing mathematically equivalent

### Cross-Platform Tests

**Visual Consistency**:
- Label animation timing identical across platforms
- Label scaling mathematically equivalent (scale088)
- Spacing and colors use same semantic tokens
- Focus indicators visible on all platforms

**Accessibility Consistency**:
- Screen reader support on all platforms
- Keyboard navigation on all platforms
- Reduced motion support on all platforms
- Touch target size meets requirements on all platforms

---

## Design Decisions

### Decision 1: Two-Element Helper/Error Approach

**Options Considered**:
1. Single element with state-based content (helper OR error)
2. Two elements (helper AND error, both visible)
3. Three elements (helper, error, success messages)

**Decision**: Two elements (helper + error)

**Rationale**:
- **Context preservation**: Helper text remains visible during error (user knows what's expected AND what went wrong)
- **Better UX**: User doesn't lose context when error appears
- **Clearer accessibility**: Two distinct aria-describedby references
- **Success doesn't need message**: Visual confirmation (icon) is sufficient

**Trade-offs**:
- ✅ Gained: Better UX, clearer context, better accessibility
- ❌ Lost: Slightly more complex DOM structure
- ⚠️ Risk: Vertical space usage (mitigated by minimal spacing)

### Decision 2: scale088 for labelMdFloat

**Options Considered**:
1. Direct fontSize token (fontSize050 = 13px)
2. Scale token applied to fontSize100 (scale088 × 16px = 14px)
3. Component-level hard-coded value

**Decision**: scale088 applied to fontSize100

**Rationale**:
- **Validates scale token system**: First typography use of scale tokens
- **Mathematical consistency**: 14px is closer to modular scale relationships
- **Reusable pattern**: Establishes pattern for other animated typography
- **Infrastructure ready**: `applyScaleWithRounding` utility exists (Spec 014)

**Trade-offs**:
- ✅ Gained: Scale token validation, mathematical consistency, reusable pattern
- ❌ Lost: 1px difference from design outline (14px vs 13px)
- ⚠️ Risk: 14px might be too large for floated label (test with real content)

### Decision 3: Background Property from Start

**Options Considered**:
1. Add background property only when needed (error tint)
2. Include background property from start (future-proof)
3. Skip background property entirely

**Decision**: Include background property from start

**Rationale**:
- **Future-proof**: Adding error background tint later requires no restructuring
- **Minimal cost**: Property exists but unused initially (no performance impact)
- **Design flexibility**: Enables future enhancements without breaking changes
- **Captured from design outline**: Implementation detail preserved from exploration phase

**Trade-offs**:
- ✅ Gained: Future flexibility, no restructuring needed later
- ❌ Lost: Slight complexity (unused property initially)
- ⚠️ Risk: None (property is optional and has no impact when unused)

### Decision 4: Icon Timing Coordination

**Options Considered**:
1. Icons appear immediately with label float
2. Icons appear after label float completes
3. Icons appear with delay after label float

**Decision**: Icons appear after label float completes

**Rationale**:
- **No spatial conflict**: Label and icons don't compete for space during animation
- **Progressive disclosure**: Controls appear when relevant (after label floats)
- **Coordinated timing**: Uses same motion.floatLabel timing for consistency
- **Cleaner animation**: Sequential rather than simultaneous reduces visual noise

**Trade-offs**:
- ✅ Gained: Cleaner animation, no spatial conflict, progressive disclosure
- ❌ Lost: Slightly longer total animation time (250ms + fade)
- ⚠️ Risk: Icons might feel delayed (mitigated by fast fade-in)

### Decision 5: Platform-Specific Icon Components

**Options Considered**:
1. Single cross-platform icon abstraction
2. Platform-specific Icon component implementations (src/components/core/Icon/platforms/)
3. SVG strings embedded in component

**Decision**: Platform-specific Icon component implementations

**Rationale**:
- **True Native Architecture**: Each platform has its own Icon component implementation
- **Existing infrastructure**: Icon component (Spec 008) already exists with platform implementations
- **Consistent API**: Same icon names (Feather icons) work across all platforms
- **Platform optimization**: Each platform renders icons using native capabilities

**Trade-offs**:
- ✅ Gained: Existing infrastructure, consistent API, platform optimization
- ❌ Lost: None (Icon component already handles cross-platform)
- ⚠️ Risk: None (Icon component already proven in ButtonCTA)

---

## Integration Points

### Dependencies

**Motion Token System** (Spec 014):
- motion.floatLabel semantic token
- scale088 primitive token
- applyScaleWithRounding utility in UnitConverter

**Icon Component** (Spec 008):
- Web: dp-icon web component, createIcon function
- iOS: Platform-specific icon implementation
- Android: Platform-specific icon implementation

**Semantic Tokens**:
- Typography: labelMd, labelMdFloat (NEW), input, caption
- Color: text.subtle, text.default, primary, error, success, border, background
- Spacing: inset.normal, grouped.tight, grouped.minimal
- Border: borderDefault, radius150
- Accessibility: focus.width, focus.offset, focus.color, tapAreaRecommended
- Blend: focusSaturate

### Dependents

**Form Components** (Future):
- Form validation integration
- Form submission handling
- Form layout patterns

**Input Type Variants** (Future):
- Password input (with show/hide toggle)
- Email input (with validation)
- Phone input (with formatting)
- Search input (with clear button)

### Extension Points

**Custom Validation**:
- External validation prop (errorMessage)
- Real-time validation support
- Custom validation rules

**Icon Customization**:
- Custom trailing icons beyond error/success/info
- Leading icon support (future enhancement)
- Icon interaction callbacks

**Styling Customization**:
- CSS custom properties for web
- Theme integration for iOS/Android
- Component-level token overrides

---

## Related Documentation

- **Requirements**: `.kiro/specs/013-text-input-field/requirements.md` - Formal requirements with EARS criteria
- **Design Outline**: `.kiro/specs/013-text-input-field/design-outline.md` - Design exploration and decisions
- **Motion Token System**: `.kiro/specs/014-motion-token-system/` - Motion tokens used by this component
- **Motion Token Guide**: `docs/tokens/motion-tokens.md` - Usage guide for motion tokens
- **Icon Component**: `src/components/core/Icon/` - Icon component implementation
- **Component Development Guide**: `.kiro/steering/Component Development Guide.md` - Component development standards

---

**Organization**: spec-design  
**Scope**: 013-text-input-field
