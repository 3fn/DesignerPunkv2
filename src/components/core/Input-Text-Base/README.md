# Input-Text-Base Component

**Status**: Production Ready 🟢  
**Spec**: 034-component-architecture-system  
**Platforms**: Web, iOS, Android  
**Family**: Form Inputs  
**Type**: Primitive (Base)

---

## Overview

Input-Text-Base is the foundational primitive component for all text input components in the Form Inputs family. It implements the float label pattern with smooth animated transitions, serving as the inheritance base for semantic text input variants (Email, Password, PhoneNumber, etc.).

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Input-Text-Base`

**Key Features**:
- **Float Label Animation**: Label smoothly transitions between placeholder and floated positions using motion tokens
- **Validation States**: Built-in support for error and success states with visual indicators
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Cross-Platform Consistent**: Mathematically equivalent animations across web, iOS, and Android
- **Helper Text Support**: Persistent helper text with conditional error messages
- **Icon Integration**: Automatic error, success, and info icons that coordinate with label animation
- **Responsive Width**: Fills 100% of container width with minimum touch target height

---

## Behavioral Contracts

This component guarantees the following behaviors across all platforms:

| Contract | Description | WCAG |
|----------|-------------|------|
| `focusable` | Can receive keyboard focus | 2.1.1 |
| `float_label_animation` | Label animates on focus | 2.3.3 |
| `validates_on_blur` | Validation triggers on blur | 3.3.1 |
| `error_state_display` | Shows error message and styling | 3.3.1, 1.4.1 |
| `success_state_display` | Shows success styling | 1.4.1 |
| `disabled_state` | Prevents interaction when disabled | 4.1.2 |
| `trailing_icon_display` | Shows contextual trailing icons | 1.4.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |
| `reduced_motion_support` | Respects prefers-reduced-motion | 2.3.3 |

---

## Related Documentation

- [Schema](./Input-Text-Base.schema.yaml) - Behavioral contracts and properties
- [Design](../../../../.kiro/specs/034-component-architecture-system/design.md) - Stemma System architecture
- [Tasks](../../../../.kiro/specs/034-component-architecture-system/tasks.md) - Implementation task breakdown

---

## Usage

### Basic Usage

```html
<!-- Web -->
<input-text-base
  id="email"
  label="Email address"
  value=""
></input-text-base>
```

```swift
// iOS
InputTextBase(
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
InputTextBase(
    id = "email",
    label = "Email address",
    value = emailValue,
    onValueChange = { newValue ->
        emailValue = newValue
    }
)
```

### With Helper Text

```html
<!-- Web -->
<input-text-base
  id="password"
  label="Password"
  type="password"
  helper-text="Must be at least 8 characters with one number and one special character"
></input-text-base>
```

### With Validation (Error State)

```html
<!-- Web -->
<input-text-base
  id="email"
  label="Email address"
  value="invalid-email"
  error-message="Please enter a valid email address"
></input-text-base>
```

### With Validation (Success State)

```html
<!-- Web -->
<input-text-base
  id="email"
  label="Email address"
  value="jane@example.com"
  is-success="true"
></input-text-base>
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

---

## Token Consumption

### Typography Tokens

- `typography.labelMd` - Label when inside input (16px)
- `typography.labelMdFloat` - Label when floated above input (14px)
- `typography.input` - Input text (16px)
- `typography.caption` - Helper text and error messages (13px)

### Color Tokens

- `color.text.muted` - Label and helper text (default state)
- `color.text.default` - Input text
- `color.primary` - Label and border (focused state)
- `color.error` / `color.error.strong` - Error state
- `color.success.strong` - Success state
- `color.border` - Border (default state)
- `color.background` - Input background

### Spacing Tokens

- `space.inset.100` - Input padding (8px)
- `space.grouped.tight` - Space between floated label and input (4px)
- `space.grouped.minimal` - Space between input and helper text (2px)

### Motion Tokens

- `motion.floatLabel` - Label float animation timing (250ms)
- `motion.focusTransition` - Focus state transition timing (150ms)

### Accessibility Tokens

- `tapAreaRecommended` - Minimum touch target height (48px)
- `accessibility.focus.width` - Focus ring width (2px)
- `accessibility.focus.offset` - Focus ring offset (2px)
- `accessibility.focus.color` - Focus ring color

---

## Semantic Variants

Input-Text-Base serves as the primitive base for these semantic components:

| Variant | Extends | Status |
|---------|---------|--------|
| `Input-Text-Email` | Email validation + autocomplete | Planned |
| `Input-Text-Password` | Secure input + password toggle | Planned |
| `Input-Text-PhoneNumber` | Phone formatting + international validation | Planned |

---

## Migration from TextInputField

This component replaces the legacy `TextInputField` component. Key changes:

| Legacy | New |
|--------|-----|
| `<text-input-field>` | `<input-text-base>` |
| `TextInputField` class | `InputTextBase` class |
| `TextInputFieldProps` | `InputTextBaseProps` |
| `TextInputFieldState` | `InputTextBaseState` |

Legacy type aliases are provided for backward compatibility during migration.

---

## Changelog

### v1.0.0 (January 2026)

- Initial release as Input-Text-Base (renamed from TextInputField)
- Implements Stemma System naming convention
- Formalizes 9 behavioral contracts in YAML schema
- Full cross-platform support (web, iOS, Android)
- WCAG 2.1 AA compliant

---

**Organization**: component-documentation  
**Scope**: 034-component-architecture-system
