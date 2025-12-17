# TextInputField Component

**Status**: Complete  
**Spec**: 013-text-input-field  
**Platforms**: Web, iOS, Android

---

## Overview

The TextInputField is a single-line text input component that implements the float label pattern with smooth animated transitions. The label animates from a placeholder position inside the input to a floated position above the input when the field receives focus or contains content.

**Key Features**:
- **Float Label Animation**: Label smoothly transitions between placeholder and floated positions using motion tokens
- **Validation States**: Built-in support for error and success states with visual indicators
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Cross-Platform Consistent**: Mathematically equivalent animations across web, iOS, and Android
- **Helper Text Support**: Persistent helper text with conditional error messages
- **Icon Integration**: Automatic error, success, and info icons that coordinate with label animation
- **Responsive Width**: Fills 100% of container width with minimum touch target height

---

## Related Documentation

- [Requirements](../../../../.kiro/specs/013-text-input-field/requirements.md) - Formal requirements with EARS acceptance criteria
- [Design](../../../../.kiro/specs/013-text-input-field/design.md) - Architecture, token usage, and design decisions
- [Tasks](../../../../.kiro/specs/013-text-input-field/tasks.md) - Implementation task breakdown

---

## Usage

### Basic Usage

```html
<!-- Web -->
<text-input-field
  id="email"
  label="Email address"
  value=""
></text-input-field>
```

```swift
// iOS
TextInputField(
    id: "email",
    label: "Email address",
    value: $emailValue,
    onChange: { newValue in
        emailValue = newValue
    }
)
```

```kotlin
// Android
TextInputField(
    id = "email",
    label = "Email address",
    value = emailValue,
    onChange = { newValue ->
        emailValue = newValue
    }
)
```

### With Helper Text

```html
<!-- Web -->
<text-input-field
  id="password"
  label="Password"
  type="password"
  helper-text="Must be at least 8 characters with one number and one special character"
></text-input-field>
```

### With Validation (Error State)

```html
<!-- Web -->
<text-input-field
  id="email"
  label="Email address"
  value="invalid-email"
  error-message="Please enter a valid email address"
></text-input-field>
```

### With Validation (Success State)

```html
<!-- Web -->
<text-input-field
  id="email"
  label="Email address"
  value="jane@example.com"
  is-success="true"
></text-input-field>
```

### Required Field

```html
<!-- Web -->
<text-input-field
  id="username"
  label="Username"
  required="true"
></text-input-field>
```

### Read-Only (Alternative to Disabled)

```html
<!-- Web -->
<text-input-field
  id="account-id"
  label="Account ID"
  value="ACC-12345"
  read-only="true"
></text-input-field>
```

### With Autocomplete

```html
<!-- Web -->
<text-input-field
  id="email"
  label="Email address"
  type="email"
  autocomplete="email"
></text-input-field>
```

### With Max Length

```html
<!-- Web -->
<text-input-field
  id="username"
  label="Username"
  max-length="20"
  helper-text="Maximum 20 characters"
></text-input-field>
```

---

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | Yes | - | Unique identifier for the input element |
| `label` | `string` | Yes | - | Label text (floats between placeholder and floated positions) |
| `value` | `string` | Yes | - | Current input value |
| `onChange` | `(value: string) => void` | Yes | - | Callback when value changes |
| `onFocus` | `() => void` | No | - | Callback when input receives focus |
| `onBlur` | `() => void` | No | - | Callback when input loses focus |
| `helperText` | `string` | No | - | Helper text displayed below input (persistent) |
| `errorMessage` | `string` | No | - | Error message displayed below helper text (conditional) |
| `isSuccess` | `boolean` | No | `false` | Success state indicator (shows success icon) |
| `showInfoIcon` | `boolean` | No | `false` | Info icon support (shows info icon, triggers helper text) |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url'` | No | `'text'` | Input type |
| `autocomplete` | `string` | No | - | Autocomplete attribute for browser autofill |
| `placeholder` | `string` | No | - | Placeholder text (only shown when label is floated and input is empty) |
| `readOnly` | `boolean` | No | `false` | Read-only state (alternative to disabled) |
| `required` | `boolean` | No | `false` | Required field indicator |
| `maxLength` | `number` | No | - | Maximum length for input value |
| `testID` | `string` | No | - | Test ID for automated testing |
| `className` | `string` | No | - | Additional CSS class names (web only) |

### States

The component manages the following internal states:

- **Default**: Empty, not focused (label inside input)
- **Focused**: Empty, focused (label animates to floated position)
- **Filled**: Contains content (label stays floated regardless of focus)
- **Error**: Validation error (red border, error icon, error message)
- **Success**: Validation success (green border, success icon)

---

## Token Consumption

The TextInputField component uses the following design tokens:

### Typography Tokens

- `typography.labelMd` - Label when inside input (16px)
- `typography.labelMdFloat` - Label when floated above input (14px, via scale088 × fontSize100)
- `typography.input` - Input text (16px)
- `typography.caption` - Helper text and error messages (13px)

### Color Tokens

- `color.text.muted` - Label and helper text (default state)
- `color.text.default` - Input text
- `color.primary` - Label and border (focused state, enhanced with blend.focusSaturate)
- `color.error` - Label, border, and error message (error state)
- `color.success.strong` - Label and border (success state)
- `color.border` - Border (default state)
- `color.background` - Input background
- `accessibility.focus.color` - Focus ring color

### Spacing Tokens

- `space.inset.100` - Input padding (8px)
- `space.grouped.tight` - Space between floated label and input (4px)
- `space.grouped.minimal` - Space between input and helper text, helper text and error message (2px)

### Motion Tokens

- `motion.floatLabel` - Label float animation timing (duration250 + easingStandard)
  - Used for label floating animation
  - Used for icon fade in/out animations (error, success, info icons)
- `motion.focusTransition` - Focus state transition timing (duration150 + easingStandard)
  - Used for focus ring opacity animation
- `scale088` - Typography scale for label animation (0.88 × fontSize100 = 14px)

### Border Tokens

- `borderDefault` - Border width (1px)
- `radius150` - Border radius (12px)

### Accessibility Tokens

- `tapAreaRecommended` - Minimum touch target height (48px)
- `accessibility.focus.width` - Focus ring width (2px)
- `accessibility.focus.offset` - Focus ring offset (2px)
- `accessibility.focus.color` - Focus ring color

### Blend Tokens

- `blend.focusSaturate` - Focus state emphasis (8% more saturated)

### Token Usage Philosophy

**No Fallback Values**: This component intentionally does not use fallback values for missing tokens. If a required token is missing, the component will fail loudly with a clear error message indicating which token is missing and where it's needed. This ensures token system issues are caught immediately during development rather than masked by fallbacks.

**Explicit Error Handling**: When tokens cannot be resolved, the component throws descriptive errors (e.g., "Required motion token missing: --motion-float-label-duration"). This approach maintains token system integrity and prevents silent failures in production.

---

## Accessibility Features

The TextInputField component is designed with accessibility as a core requirement, meeting WCAG 2.1 AA compliance standards.

### Keyboard Navigation

- **Tab**: Moves focus to the input field
- **Enter**: Submits the form (standard browser behavior)
- **Escape**: Clears focus (standard browser behavior)

### Screen Reader Support

- **Label Association**: Label has `for` attribute matching input `id` for programmatic association
- **Helper Text**: Associated with input via `aria-describedby`
- **Error Messages**: Associated with input via `aria-describedby` and announced with `role="alert"`
- **Error State**: Input has `aria-invalid="true"` when in error state
- **Required Fields**: Input has `required` attribute for screen reader announcement

### Focus Indicators

- **Visible Focus Ring**: 2px focus ring with 2px offset using `accessibility.focus.color`
- **Contrast Requirements**: Focus ring meets 3:1 contrast ratio (WCAG 2.1 1.4.11 Non-text Contrast)
- **Keyboard-Only**: Focus ring only appears for keyboard navigation (`:focus-visible`)

### Color Contrast

All text colors meet WCAG 2.1 AA contrast ratio requirements:

- **Label Colors**: 4.5:1 contrast in all states (default, focused, error, success)
- **Input Text**: 4.5:1 contrast
- **Helper Text**: 4.5:1 contrast
- **Error Messages**: 4.5:1 contrast
- **Focus Ring**: 3:1 contrast

### Touch Target Sizing

- **Minimum Height**: 48px minimum touch target height using `tapAreaRecommended` token
- **Mobile Friendly**: Meets WCAG 2.1 2.5.5 Target Size requirements

### Reduced Motion Support

- **prefers-reduced-motion**: Label animation disabled when user has reduced motion preference
- **Instant State Changes**: Label position changes instantly without animation
- **Cross-Platform**: Reduced motion support on web, iOS, and Android

---

## Platform-Specific Notes

### Web

- **Web Component**: Implemented as a custom element (`<text-input-field>`)
- **Shadow DOM**: Uses shadow DOM for style encapsulation
- **CSS Custom Properties**: Consumes design tokens as CSS custom properties
- **Browser Support**: Modern browsers with web component support

### iOS

- **SwiftUI**: Implemented as a SwiftUI view
- **Native Animations**: Uses SwiftUI animation with motion token values
- **Accessibility**: Integrates with VoiceOver and Dynamic Type
- **Touch Targets**: Meets iOS Human Interface Guidelines (44pt minimum)

### Android

- **Jetpack Compose**: Implemented as a Compose component
- **Material Design**: Follows Material Design principles while maintaining design system consistency
- **Accessibility**: Integrates with TalkBack and font scaling
- **Touch Targets**: Meets Material Design guidelines (48dp minimum)

---

## Validation Examples

**⚠️ Note**: The validation examples are automated test files, not documentation. These examples validate component behavior and must remain functional. They demonstrate all component states for testing purposes.

- [TextInputStateExamples.html](./examples/TextInputStateExamples.html) - All component states in one file

**Validation Disclaimer**: These files are living validation examples that test component functionality. They are not intended as primary documentation and may include technical implementation details for testing purposes.

---

## Design Decisions

### Float Label Pattern

The float label pattern was chosen to:
- **Save Vertical Space**: Label serves as both label and placeholder
- **Maintain Context**: Label remains visible when input has content
- **Improve UX**: Smooth animation provides visual feedback

### Two-Element Helper/Error Approach

Helper text and error messages use separate elements:
- **Context Preservation**: Helper text remains visible during error state
- **Better UX**: User knows what's expected AND what went wrong
- **Clearer Accessibility**: Two distinct `aria-describedby` references

### No Disabled State

The component intentionally excludes disabled state:
- **Better Alternatives**: Use read-only, conditional visibility, or clear messaging
- **Accessibility**: Disabled inputs are not accessible to screen readers
- **UX**: Users should always understand why they cannot interact

### Background Property from Start

The component includes a background property (even if unused initially):
- **Future-Proof**: Adding error background tint later requires no restructuring
- **Minimal Cost**: Property exists but unused initially (no performance impact)
- **Design Flexibility**: Enables future enhancements without breaking changes

---

## Testing

The component includes comprehensive test coverage:

### Unit Tests

- Label animation (float up, return down, stay floated)
- State management (focus, blur, fill, error, success)
- Icon visibility logic
- Helper text and error message display
- Accessibility attributes

### Integration Tests

- Icon component integration (error, success, info icons)
- Motion token integration (animation timing, scaling)
- Form integration (submission, validation)
- Cross-platform token usage

### Accessibility Tests

- Label association
- Focus indicators
- Keyboard navigation
- Screen reader support
- Color contrast
- Touch target sizing

### Cross-Platform Tests

- Animation timing consistency
- Label scaling equivalence
- Token usage consistency
- Reduced motion support

---

## Icon Usage

The TextInputField component uses the Icon component system for status indicators (error, success, info icons). This section documents the icon integration approach and rationale.

### Icon Integration Pattern

TextInputField uses the Icon component (not direct platform icons like SF Symbols) for all status indicators:

```swift
// iOS - Using Icon component (CORRECT)
Icon(name: "x", size: iconSize100, color: colorError)
Icon(name: "check", size: iconSize100, color: colorSuccessStrong)
Icon(name: "info", size: iconSize100, color: colorTextMuted)
```

```kotlin
// Android - Using Icon component (CORRECT)
Icon(name = "x", size = iconSize100, tint = colorError)
Icon(name = "check", size = iconSize100, tint = colorSuccessStrong)
Icon(name = "info", size = iconSize100, tint = colorTextMuted)
```

```html
<!-- Web - Using Icon component (CORRECT) -->
<dp-icon name="x" size="24" color="color-error"></dp-icon>
<dp-icon name="check" size="24" color="color-success"></dp-icon>
<dp-icon name="info" size="24" color="color-text-muted"></dp-icon>
```

### Rationale for Using Icon Component

The TextInputField uses the Icon component system (rather than direct platform icons like SF Symbols) for the following reasons:

1. **Cross-Platform Consistency**: The Icon component provides unified icon rendering across web, iOS, and Android, ensuring status indicators look consistent across all platforms.

2. **Token-Based Sizing**: Icon sizes use icon size tokens (`iconSize100` = 24px) that align with the typography system, ensuring proper optical balance with input text.

3. **Color Token Integration**: Icon colors use semantic color tokens (`colorError`, `colorSuccessStrong`, `colorTextMuted`) that automatically adapt to theme changes.

4. **Unified Icon Library**: Using the Icon component ensures all icons come from the same Feather Icons source, maintaining visual consistency.

5. **Accessibility**: The Icon component includes built-in accessibility features (hidden from screen readers as decorative icons).

### Icon Size Selection

Status icons use `iconSize100` (24px) because:
- They pair with `typography.input` (16px font size, 24px line height)
- The icon fills the vertical space of the input line for optical balance
- 24px is the standard icon size for bodyMd/labelMd typography contexts

### When Direct Platform Icons Would Be Acceptable

While TextInputField uses the Icon component, direct platform icons (like SF Symbols on iOS) would be acceptable when:
- Icons are internal implementation details not exposed to the component API
- Icons follow platform-specific UI conventions (e.g., iOS system UI patterns)
- Icons are tightly coupled to platform behavior

TextInputField's status icons are exposed through the component's visual design (users see them), so using the unified Icon component ensures cross-platform consistency.

---

## Related Components

- [Icon](../Icon/README.md) - Icon component used for error, success, and info icons
- [ButtonCTA](../ButtonCTA/README.md) - Button component that may be used with forms containing TextInputField

---

## Changelog

### v1.0.0 (December 2025)

- Initial release with float label animation
- Error and success validation states
- Helper text and error message support
- Icon integration (error, success, info)
- Full accessibility compliance (WCAG 2.1 AA)
- Cross-platform support (web, iOS, Android)

---

**Organization**: component-documentation  
**Scope**: 013-text-input-field
