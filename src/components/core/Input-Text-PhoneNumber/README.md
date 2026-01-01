# Input-Text-PhoneNumber Component

**Stemma System**: Form Inputs Family  
**Component Type**: Semantic (inherits from Input-Text-Base)  
**Naming Convention**: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber  
**Readiness**: Production Ready 🟢

## Overview

Input-Text-PhoneNumber is a semantic text input component that extends Input-Text-Base with phone number formatting and international validation support. It formats phone numbers as the user types and validates against country-specific patterns.

## Features

- **Inherits all Input-Text-Base features**: Float label animation, validation states, accessibility, etc.
- **Phone number formatting**: Automatic formatting as user types
- **International support**: 10 country formats (US, CA, GB, DE, FR, AU, JP, IN, BR, MX)
- **Phone keyboard**: Shows phone keyboard on mobile platforms
- **Custom validation**: Support for custom validation functions
- **Cross-platform**: Consistent behavior across web, iOS, and Android

## Usage

### Web

```html
<input-text-phone-number
  id="phone-input"
  label="Phone Number"
  value=""
  helper-text="Enter your phone number"
  country-code="US"
  required
></input-text-phone-number>
```

```javascript
// Listen for validation events
const phoneInput = document.querySelector('input-text-phone-number');
phoneInput.addEventListener('validate', (e) => {
  console.log('Valid:', e.detail.isValid);
  console.log('Formatted:', e.detail.formattedNumber);
  console.log('Error:', e.detail.errorMessage);
});

// Programmatic validation
const result = phoneInput.validate();
console.log(result.isValid, result.formattedNumber);
```

### iOS (SwiftUI)

```swift
@State private var phone = ""

InputTextPhoneNumber(
    id: "phone-input",
    label: "Phone Number",
    value: $phone,
    helperText: "Enter your phone number",
    countryCode: "US",
    required: true,
    onValidate: { isValid, errorMessage in
        print("Valid: \(isValid), Error: \(errorMessage ?? "none")")
    }
)
```

### Android (Jetpack Compose)

```kotlin
var phone by remember { mutableStateOf("") }

InputTextPhoneNumber(
    id = "phone-input",
    label = "Phone Number",
    value = phone,
    onValueChange = { phone = it },
    helperText = "Enter your phone number",
    countryCode = "US",
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

### Phone-Specific Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `countryCode` | string | No | "US" | ISO 3166-1 alpha-2 country code |
| `showCountrySelector` | boolean | No | false | Show country code selector |
| `onCountryChange` | function | No | - | Callback when country changes |
| `autoFormat` | boolean | No | true | Format phone number as user types |
| `customValidator` | function | No | - | Custom validation function |
| `invalidPhoneMessage` | string | No | "Please enter a valid phone number" | Custom error message |
| `onValidate` | function | No | - | Callback when validation occurs |

### Fixed Props

| Prop | Value | Description |
|------|-------|-------------|
| `type` | "tel" | Input type is fixed to tel |
| `autocomplete` | "tel" | Autocomplete is fixed to tel |

## Supported Countries

| Code | Country | Format | Digits |
|------|---------|--------|--------|
| US | United States | (###) ###-#### | 10 |
| CA | Canada | (###) ###-#### | 10 |
| GB | United Kingdom | #### ### #### | 11 |
| DE | Germany | #### ####### | 11 |
| FR | France | ## ## ## ## ## | 10 |
| AU | Australia | #### ### ### | 10 |
| JP | Japan | ###-####-#### | 11 |
| IN | India | ##### ##### | 10 |
| BR | Brazil | (##) #####-#### | 11 |
| MX | Mexico | ## #### #### | 10 |

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

### Phone-Specific Contracts

10. **validates_phone_format**: Validates phone against country-specific patterns
11. **provides_phone_formatting**: Formats phone numbers as user types
12. **supports_international_formats**: Handles multiple country formats

## Validation

### Default Validation

The component validates phone numbers based on the expected digit count for each country:

**US/CA (10 digits):**
- Valid: `(555) 123-4567`, `5551234567`
- Invalid: `555-1234` (too few), `555-123-45678` (too many)

**UK (11 digits):**
- Valid: `0791 112 3456`, `07911123456`
- Invalid: `0791 112 345` (too few)

### Custom Validation

You can provide a custom validation function:

```javascript
// Web
<input-text-phone-number
  id="phone"
  label="US Phone"
  custom-validator="validateUSPhone"
></input-text-phone-number>

<script>
function validateUSPhone(phone, countryCode) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('555');
}
</script>
```

```swift
// iOS
InputTextPhoneNumber(
    id: "phone",
    label: "US Phone",
    value: $phone,
    customValidator: { phone, countryCode in
        let digits = phone.filter { $0.isNumber }
        return digits.count == 10 && digits.hasPrefix("555")
    }
)
```

```kotlin
// Android
InputTextPhoneNumber(
    id = "phone",
    label = "US Phone",
    value = phone,
    onValueChange = { phone = it },
    customValidator = { phoneNumber, countryCode ->
        val digits = phoneNumber.filter { it.isDigit() }
        digits.length == 10 && digits.startsWith("555")
    }
)
```

## Accessibility

- **WCAG 2.1 AA compliant**
- **1.3.5 Identify Input Purpose**: Tel autocomplete enabled
- **3.3.1 Error Identification**: Clear error messages for invalid phone numbers
- **Keyboard accessible**: Full keyboard navigation support
- **Screen reader support**: Proper ARIA attributes and announcements

## Platform-Specific Notes

### Web
- Uses `<input type="tel">` for native phone input hints
- Sets `autocomplete="tel"` for browser autofill
- Shows phone keyboard on mobile browsers

### iOS
- Uses `UIKeyboardType.phonePad` for phone keyboard
- Sets `UITextContentType.telephoneNumber` for autofill
- Integrates with iOS phone number autofill

### Android
- Uses `KeyboardType.Phone` for phone keyboard
- Integrates with Android Autofill framework
- Supports Material Design patterns

## Related Components

- **Input-Text-Base**: Parent primitive component
- **Input-Text-Email**: Sibling semantic component for emails
- **Input-Text-Password**: Sibling semantic component for passwords

## Files

```
src/components/core/Input-Text-PhoneNumber/
├── Input-Text-PhoneNumber.schema.yaml    # Component schema
├── README.md                              # This documentation
├── types.ts                               # TypeScript types
├── validation.ts                          # Phone validation logic
├── stateManagement.ts                     # State management
├── tokens.ts                              # Token references
├── __tests__/
│   └── validation.test.ts                 # Validation tests
└── platforms/
    ├── web/
    │   ├── InputTextPhoneNumber.web.ts    # Web component
    │   └── InputTextPhoneNumber.browser.ts # Browser build
    ├── ios/
    │   └── InputTextPhoneNumber.ios.swift # SwiftUI view
    └── android/
        └── InputTextPhoneNumber.android.kt # Compose composable
```
