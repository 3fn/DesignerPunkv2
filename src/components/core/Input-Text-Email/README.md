# Input-Text-Email Component

**Stemma System**: Form Inputs Family  
**Component Type**: Semantic (inherits from Input-Text-Base)  
**Naming Convention**: [Family]-[Type]-[Variant] = Input-Text-Email  
**Readiness**: Production Ready 🟢

## Overview

Input-Text-Email is a semantic text input component that extends Input-Text-Base with email-specific validation and autocomplete functionality. It validates email format on blur using an RFC 5322 compliant pattern and enables browser/platform email autofill.

## Features

- **Inherits all Input-Text-Base features**: Float label animation, validation states, accessibility, etc.
- **Email format validation**: RFC 5322 compliant validation on blur
- **Email autocomplete**: Browser/platform email autofill support
- **Email keyboard**: Shows email keyboard on mobile platforms
- **Custom validation**: Support for custom validation functions
- **Cross-platform**: Consistent behavior across web, iOS, and Android

## Usage

### Web

```html
<input-text-email
  id="email-input"
  label="Email Address"
  value=""
  helper-text="Enter your email address"
  required
></input-text-email>
```

```javascript
// Listen for validation events
const emailInput = document.querySelector('input-text-email');
emailInput.addEventListener('validate', (e) => {
  console.log('Valid:', e.detail.isValid);
  console.log('Error:', e.detail.errorMessage);
});

// Programmatic validation
const result = emailInput.validate();
console.log(result.isValid, result.errorMessage);
```

### iOS (SwiftUI)

```swift
@State private var email = ""

InputTextEmail(
    id: "email-input",
    label: "Email Address",
    value: $email,
    helperText: "Enter your email address",
    required: true,
    onValidate: { isValid, errorMessage in
        print("Valid: \(isValid), Error: \(errorMessage ?? "none")")
    }
)
```

### Android (Jetpack Compose)

```kotlin
var email by remember { mutableStateOf("") }

InputTextEmail(
    id = "email-input",
    label = "Email Address",
    value = email,
    onValueChange = { email = it },
    helperText = "Enter your email address",
    required = true,
    onValidate = { isValid, errorMessage ->
        println("Valid: $isValid, Error: $errorMessage")
    }
)
```

## Props

### Inherited from Input-Text-Base

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | string | Yes | - | Unique identifier for the input |
| `label` | string | Yes | - | Label text (floats on focus/fill) |
| `value` | string | Yes | - | Current input value |
| `onChange` | function | Yes | - | Callback when value changes |
| `onFocus` | function | No | - | Callback when input receives focus |
| `onBlur` | function | No | - | Callback when input loses focus |
| `helperText` | string | No | - | Helper text below input |
| `errorMessage` | string | No | - | Error message (overrides validation error) |
| `isSuccess` | boolean | No | false | Success state indicator |
| `showInfoIcon` | boolean | No | false | Show info icon |
| `placeholder` | string | No | - | Placeholder text |
| `readOnly` | boolean | No | false | Read-only state |
| `required` | boolean | No | false | Required field indicator |
| `maxLength` | number | No | - | Maximum input length |
| `testID` | string | No | - | Test ID for automation |

### Email-Specific Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `customValidator` | function | No | - | Custom validation function |
| `invalidEmailMessage` | string | No | "Please enter a valid email address" | Custom error message |
| `onValidate` | function | No | - | Callback when validation occurs |

### Fixed Props

| Prop | Value | Description |
|------|-------|-------------|
| `type` | "email" | Input type is fixed to email |
| `autocomplete` | "email" | Autocomplete is fixed to email |

## Behavioral Contracts

### Inherited from Input-Text-Base

1. **focusable**: Can receive keyboard focus
2. **float_label_animation**: Label animates on focus
3. **validates_on_blur**: Validation triggers on blur
4. **error_state_display**: Shows error message and styling
5. **success_state_display**: Shows success styling
6. **disabled_state**: Prevents interaction when disabled
7. **trailing_icon_display**: Shows contextual trailing icons
8. **focus_ring**: WCAG 2.4.7 focus visible indicator
9. **reduced_motion_support**: Respects prefers-reduced-motion

### Email-Specific Contracts

10. **validates_email_format**: Validates email against RFC 5322 pattern
11. **provides_email_autocomplete**: Enables browser/platform email autofill

## Validation

### Default Validation

The component uses an RFC 5322 compliant regex pattern for email validation:

```
^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
```

**Valid examples:**
- `user@example.com`
- `user.name@example.co.uk`
- `user+tag@example.org`

**Invalid examples:**
- `invalid-email`
- `@example.com`
- `user@`

### Custom Validation

You can provide a custom validation function:

```javascript
// Web
<input-text-email
  id="email"
  label="Work Email"
  custom-validator="validateWorkEmail"
></input-text-email>

<script>
function validateWorkEmail(email) {
  return email.endsWith('@company.com');
}
</script>
```

```swift
// iOS
InputTextEmail(
    id: "email",
    label: "Work Email",
    value: $email,
    customValidator: { email in
        email.hasSuffix("@company.com")
    }
)
```

```kotlin
// Android
InputTextEmail(
    id = "email",
    label = "Work Email",
    value = email,
    onValueChange = { email = it },
    customValidator = { it.endsWith("@company.com") }
)
```

## Accessibility

- **WCAG 2.1 AA compliant**
- **1.3.5 Identify Input Purpose**: Email autocomplete enabled
- **3.3.1 Error Identification**: Clear error messages for invalid emails
- **Keyboard accessible**: Full keyboard navigation support
- **Screen reader support**: Proper ARIA attributes and announcements

## Platform-Specific Notes

### Web
- Uses `<input type="email">` for native email validation hints
- Sets `autocomplete="email"` for browser autofill
- Shows email keyboard on mobile browsers

### iOS
- Uses `UIKeyboardType.emailAddress` for email keyboard
- Sets `UITextContentType.emailAddress` for autofill
- Integrates with iOS password/email autofill

### Android
- Uses `KeyboardType.Email` for email keyboard
- Integrates with Android Autofill framework
- Supports Material Design patterns

## Related Components

- **Input-Text-Base**: Parent primitive component
- **Input-Text-Password**: Sibling semantic component for passwords
- **Input-Text-PhoneNumber**: Sibling semantic component for phone numbers

## Files

```
src/components/core/Input-Text-Email/
├── Input-Text-Email.schema.yaml    # Component schema
├── README.md                        # This documentation
├── types.ts                         # TypeScript types
├── validation.ts                    # Email validation logic
├── stateManagement.ts               # State management
├── tokens.ts                        # Token references
└── platforms/
    ├── web/
    │   ├── InputTextEmail.web.ts    # Web component
    │   └── InputTextEmail.browser.ts # Browser build
    ├── ios/
    │   └── InputTextEmail.ios.swift # SwiftUI view
    └── android/
        └── InputTextEmail.android.kt # Compose composable
```

