# Input-Text-Password Component

**Stemma System**: Form Inputs Family  
**Component Type**: Semantic (inherits from Input-Text-Base)  
**Naming Convention**: [Family]-[Type]-[Variant] = Input-Text-Password  
**Readiness**: Production Ready 🟢

## Overview

Input-Text-Password is a semantic text input component that extends Input-Text-Base with secure password input and toggle functionality. It masks password characters by default and provides a toggle button to show/hide the password. Supports password strength validation and autocomplete for current/new passwords.

## Features

- **Inherits all Input-Text-Base features**: Float label animation, validation states, accessibility, etc.
- **Secure password masking**: Characters masked by default
- **Password visibility toggle**: Show/hide password button
- **Password strength validation**: Configurable requirements (length, uppercase, lowercase, numbers, special chars)
- **Password autocomplete**: Browser/platform password autofill support
- **Custom validation**: Support for custom validation functions
- **Cross-platform**: Consistent behavior across web, iOS, and Android

## Usage

### Web

```html
<input-text-password
  id="password-input"
  label="Password"
  value=""
  helper-text="Enter your password"
  required
></input-text-password>
```

```javascript
// Listen for validation events
const passwordInput = document.querySelector('input-text-password');
passwordInput.addEventListener('validate', (e) => {
  console.log('Valid:', e.detail.isValid);
  console.log('Error:', e.detail.errorMessage);
  console.log('Details:', e.detail.details);
});

// Listen for visibility toggle
passwordInput.addEventListener('toggle-visibility', (e) => {
  console.log('Password visible:', e.detail.visible);
});

// Programmatic validation
const result = passwordInput.validate();
console.log(result.isValid, result.errorMessage, result.details);

// Toggle visibility programmatically
passwordInput.toggleVisibility();
```

### With Password Requirements (Web)

```html
<input-text-password
  id="new-password"
  label="New Password"
  value=""
  helper-text="Create a strong password"
  is-new-password
  min-length="8"
  require-uppercase
  require-lowercase
  require-number
  require-special-char
  invalid-password-message="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
></input-text-password>
```

### iOS (SwiftUI)

```swift
@State private var password = ""

InputTextPassword(
    id: "password-input",
    label: "Password",
    value: $password,
    helperText: "Enter your password",
    required: true,
    onValidate: { isValid, errorMessage, details in
        print("Valid: \(isValid), Error: \(errorMessage ?? "none")")
    },
    onToggleVisibility: { visible in
        print("Password visible: \(visible)")
    }
)
```

### With Password Requirements (iOS)

```swift
@State private var newPassword = ""

InputTextPassword(
    id: "new-password",
    label: "New Password",
    value: $newPassword,
    helperText: "Create a strong password",
    required: true,
    isNewPassword: true,
    invalidPasswordMessage: "Password must meet all requirements",
    requirements: PasswordRequirements(
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: true
    )
)
```

### Android (Jetpack Compose)

```kotlin
var password by remember { mutableStateOf("") }

InputTextPassword(
    id = "password-input",
    label = "Password",
    value = password,
    onValueChange = { password = it },
    helperText = "Enter your password",
    required = true,
    onValidate = { isValid, errorMessage, details ->
        println("Valid: $isValid, Error: $errorMessage")
    },
    onToggleVisibility = { visible ->
        println("Password visible: $visible")
    }
)
```

### With Password Requirements (Android)

```kotlin
var newPassword by remember { mutableStateOf("") }

InputTextPassword(
    id = "new-password",
    label = "New Password",
    value = newPassword,
    onValueChange = { newPassword = it },
    helperText = "Create a strong password",
    required = true,
    isNewPassword = true,
    invalidPasswordMessage = "Password must meet all requirements",
    requirements = PasswordRequirements(
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumber = true,
        requireSpecialChar = true
    )
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

### Password-Specific Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `showPassword` | boolean | No | false | Whether password is visible |
| `onToggleVisibility` | function | No | - | Callback when visibility toggled |
| `showToggle` | boolean | No | true | Show visibility toggle button |
| `isNewPassword` | boolean | No | false | For new password (affects autocomplete) |
| `minLength` | number | No | - | Minimum password length |
| `requireUppercase` | boolean | No | false | Require uppercase letter |
| `requireLowercase` | boolean | No | false | Require lowercase letter |
| `requireNumber` | boolean | No | false | Require number |
| `requireSpecialChar` | boolean | No | false | Require special character |
| `customValidator` | function | No | - | Custom validation function |
| `invalidPasswordMessage` | string | No | "Password does not meet requirements" | Custom error message |
| `onValidate` | function | No | - | Callback when validation occurs |

### Dynamic Props

| Prop | Value | Description |
|------|-------|-------------|
| `type` | "password" / "text" | Toggles based on visibility |
| `autocomplete` | "current-password" / "new-password" | Based on isNewPassword |

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

### Password-Specific Contracts

10. **provides_secure_input**: Masks password input by default
11. **supports_password_toggle**: Show/hide password functionality
12. **provides_password_autocomplete**: Enables browser/platform password autofill

## Validation

### Default Validation

When requirements are specified, the component validates against:

- **minLength**: Minimum number of characters
- **maxLength**: Maximum number of characters
- **requireUppercase**: At least one uppercase letter (A-Z)
- **requireLowercase**: At least one lowercase letter (a-z)
- **requireNumber**: At least one digit (0-9)
- **requireSpecialChar**: At least one special character (!@#$%^&*()_+-=[]{}|;':",./<>?)

### Validation Details

The validation result includes detailed information about each requirement:

```javascript
{
  isValid: false,
  errorMessage: "Password does not meet requirements",
  details: {
    meetsMinLength: true,
    meetsMaxLength: true,
    hasUppercase: false,
    hasLowercase: true,
    hasNumber: true,
    hasSpecialChar: false
  }
}
```

### Custom Validation

You can provide a custom validation function:

```javascript
// Web
<input-text-password
  id="password"
  label="Password"
  custom-validator="validateCustomPassword"
></input-text-password>

<script>
function validateCustomPassword(password) {
  // Custom validation logic
  return password.length >= 10 && !password.includes('password');
}
</script>
```

```swift
// iOS
InputTextPassword(
    id: "password",
    label: "Password",
    value: $password,
    customValidator: { password in
        password.count >= 10 && !password.contains("password")
    }
)
```

```kotlin
// Android
InputTextPassword(
    id = "password",
    label = "Password",
    value = password,
    onValueChange = { password = it },
    customValidator = { it.length >= 10 && !it.contains("password") }
)
```

## Accessibility

- **WCAG 2.1 AA compliant**
- **1.3.5 Identify Input Purpose**: Password autocomplete enabled
- **3.3.1 Error Identification**: Clear error messages for invalid passwords
- **4.1.2 Name, Role, Value**: Toggle button properly labeled
- **Keyboard accessible**: Full keyboard navigation including toggle
- **Screen reader support**: Proper ARIA attributes and announcements
- **Toggle announcements**: "Show password" / "Hide password" labels

## Platform-Specific Notes

### Web
- Uses `<input type="password">` for secure input
- Sets `autocomplete="current-password"` or `"new-password"`
- Toggle button with eye/eye-off SVG icons
- Focus returns to input after toggle

### iOS
- Uses `SecureField` for masked input, `TextField` for visible
- Sets `UITextContentType.password` or `.newPassword`
- Toggle button with SF Symbols (eye/eye.slash)
- Integrates with iOS password autofill

### Android
- Uses `PasswordVisualTransformation` for masking
- Material Design visibility icons
- Integrates with Android Autofill framework
- Supports Material Design patterns

## Related Components

- **Input-Text-Base**: Parent primitive component
- **Input-Text-Email**: Sibling semantic component for emails
- **Input-Text-PhoneNumber**: Sibling semantic component for phone numbers

## Files

```
src/components/core/Input-Text-Password/
├── Input-Text-Password.schema.yaml    # Component schema
├── README.md                           # This documentation
├── types.ts                            # TypeScript types
├── validation.ts                       # Password validation logic
├── stateManagement.ts                  # State management
├── tokens.ts                           # Token references
└── platforms/
    ├── web/
    │   ├── InputTextPassword.web.ts    # Web component
    │   └── InputTextPassword.browser.ts # Browser build
    ├── ios/
    │   └── InputTextPassword.ios.swift # SwiftUI view
    └── android/
        └── InputTextPassword.android.kt # Compose composable
```
