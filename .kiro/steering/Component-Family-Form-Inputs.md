---
inclusion: manual
---

# Form Inputs Components

**Date**: 2026-01-02
**Purpose**: MCP-queryable documentation for Form Inputs component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, form-implementation
**Last Reviewed**: 2026-01-02

---

## Family Overview

**Family**: Form Inputs
**Shared Need**: Data collection and validation
**Readiness**: 🟢 Production Ready

### Purpose

The Form Inputs family provides text input components for collecting user data with built-in validation, accessibility, and cross-platform consistency. All components implement the float label pattern with smooth animated transitions and comprehensive error/success state handling.

### Key Characteristics

- **Float Label Animation**: Labels smoothly transition between placeholder and floated positions using motion tokens
- **Built-in Validation**: Validation triggers on blur with error/success state display
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Cross-Platform Consistent**: Mathematically equivalent animations across web, iOS, and Android
- **Semantic Specialization**: Semantic variants extend the primitive base with domain-specific functionality

### Stemma System Integration

- **Primitive Base**: Input-Text-Base
- **Semantic Variants**: 3 implemented (Email, Password, PhoneNumber)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Input-Text-Base (Primitive)
    │
    ├── Input-Text-Email (Semantic)
    │   └── Email validation + autocomplete
    │
    ├── Input-Text-Password (Semantic)
    │   └── Secure input + password toggle
    │
    └── Input-Text-PhoneNumber (Semantic)
        └── Phone formatting + international validation
```

### Primitive Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Input-Text-Base | Primitive | 🟢 Production Ready | Foundational text input with float label pattern |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Input-Text-Email | Input-Text-Base | 🟢 Production Ready | Email validation + autocomplete |
| Input-Text-Password | Input-Text-Base | 🟢 Production Ready | Secure input + password toggle |
| Input-Text-PhoneNumber | Input-Text-Base | 🟢 Production Ready | Phone formatting + international validation |

---

## Behavioral Contracts

### Base Contracts (Inherited by All)

All components in the Form Inputs family inherit these 9 foundational contracts from Input-Text-Base:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `focusable` | Can receive keyboard focus | 2.1.1 | web, ios, android |
| `float_label_animation` | Label animates on focus | 2.3.3 | web, ios, android |
| `validates_on_blur` | Validation triggers on blur | 3.3.1 | web, ios, android |
| `error_state_display` | Shows error message and styling | 3.3.1, 1.4.1 | web, ios, android |
| `success_state_display` | Shows success styling | 1.4.1 | web, ios, android |
| `disabled_state` | Prevents interaction when disabled | 4.1.2 | web, ios, android |
| `trailing_icon_display` | Shows contextual trailing icons | 1.4.1 | web, ios, android |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 | web, ios, android |
| `reduced_motion_support` | Respects prefers-reduced-motion | 2.3.3 | web, ios, android |

### Contract Details

#### focusable

**Description**: Component can receive keyboard focus via Tab key navigation.

**Behavior**: Focus state is visually indicated and triggers label animation. Tab key moves focus to input, focus state is visually distinct.

**WCAG Compliance**: 2.1.1 Keyboard

#### float_label_animation

**Description**: Label smoothly transitions from placeholder position inside input to floated position above input when focused or filled.

**Behavior**: Animation uses `motion.floatLabel` token (250ms, standard easing). Label stays floated when input has content. Animation respects `prefers-reduced-motion`.

**WCAG Compliance**: 2.3.3 Animation from Interactions

#### error_state_display

**Description**: When in error state, component displays red border, red label text, error icon, and error message.

**Behavior**: Error state uses `color.error` tokens. Error message is associated via `aria-describedby`. Error state is announced to screen readers.

**WCAG Compliance**: 3.3.1 Error Identification, 1.4.1 Use of Color

#### focus_ring

**Description**: When focused via keyboard, component displays a visible focus indicator.

**Behavior**: 2px focus ring with 2px offset using `accessibility.focus.*` tokens. Focus ring visible in all states (default, error, success). Uses `:focus-visible` on web for keyboard-only indication.

**WCAG Compliance**: 2.4.7 Focus Visible

### Extended Contracts by Component

#### Input-Text-Email Extended Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `validates_email_format` | Validates email against RFC 5322 pattern | 3.3.1 |
| `provides_email_autocomplete` | Enables browser/platform email autofill | 1.3.5 |

#### Input-Text-Password Extended Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `provides_secure_input` | Masks password input by default | 3.3.2 |
| `supports_password_toggle` | Provides show/hide password functionality | 2.1.1, 4.1.2 |
| `provides_password_autocomplete` | Enables browser/platform password autofill | 1.3.5 |

#### Input-Text-PhoneNumber Extended Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `validates_phone_format` | Validates phone number against country-specific patterns | 3.3.1 |
| `provides_phone_formatting` | Formats phone numbers as user types | 3.3.2 |
| `supports_international_formats` | Handles multiple country phone number formats | 3.3.2 |

---

## Component Schemas

### Input-Text-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | `string` | Yes | - | Unique identifier for the input element |
| `label` | `string` | Yes | - | Label text (floats between placeholder and floated positions) |
| `value` | `string` | Yes | - | Current input value |
| `onChange` | `(value: string) => void` | Yes | - | Callback when value changes |
| `onFocus` | `() => void` | No | - | Callback when input receives focus |
| `onBlur` | `() => void` | No | - | Callback when input loses focus |
| `helperText` | `string` | No | - | Helper text displayed below input (persistent) |
| `errorMessage` | `string` | No | - | Error message displayed below helper text |
| `isSuccess` | `boolean` | No | `false` | Success state indicator |
| `showInfoIcon` | `boolean` | No | `false` | Info icon support |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url'` | No | `'text'` | Input type |
| `autocomplete` | `string` | No | - | Autocomplete attribute for browser autofill |
| `placeholder` | `string` | No | - | Placeholder text |
| `readOnly` | `boolean` | No | `false` | Read-only state |
| `required` | `boolean` | No | `false` | Required field indicator |
| `maxLength` | `number` | No | - | Maximum length for input value |
| `testID` | `string` | No | - | Test ID for automated testing |
| `className` | `string` | No | - | Additional CSS class names (web only) |

#### Usage Example

```html
<!-- Web -->
<input-text-base
  id="username"
  label="Username"
  value=""
  helper-text="Enter your username"
></input-text-base>
```

```swift
// iOS
InputTextBase(
    id: "username",
    label: "Username",
    value: $usernameValue,
    onChange: { newValue in usernameValue = newValue },
    helperText: "Enter your username"
)
```

```kotlin
// Android
InputTextBase(
    id = "username",
    label = "Username",
    value = usernameValue,
    onValueChange = { newValue -> usernameValue = newValue },
    helperText = "Enter your username"
)
```

---

### Input-Text-Email

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Input-Text-Base

#### Extended Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `'email'` | No | `'email'` | Fixed to 'email' |
| `autocomplete` | `'email'` | No | `'email'` | Fixed to 'email' for autofill |
| `customValidator` | `(email: string) => boolean` | No | - | Custom email validation function |
| `invalidEmailMessage` | `string` | No | `'Please enter a valid email address'` | Custom error message |
| `onValidate` | `(isValid: boolean, errorMessage?: string) => void` | No | - | Validation callback |

#### Extended Contracts

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `validates_email_format` | Validates email against RFC 5322 pattern on blur | web, ios, android |
| `provides_email_autocomplete` | Enables browser/platform email autofill | web, ios, android |

#### Usage Example

```html
<!-- Web -->
<input-text-email
  id="email"
  label="Email address"
  value=""
  helper-text="We'll never share your email"
></input-text-email>
```

```swift
// iOS
InputTextEmail(
    id: "email",
    label: "Email address",
    value: $emailValue,
    onChange: { newValue in emailValue = newValue },
    helperText: "We'll never share your email"
)
```

---

### Input-Text-Password

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Input-Text-Base

#### Extended Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `'password' \| 'text'` | No | `'password'` | Toggles between masked and visible |
| `autocomplete` | `'current-password' \| 'new-password'` | No | `'current-password'` | Password autofill type |
| `showPassword` | `boolean` | No | `false` | Whether password is currently visible |
| `onToggleVisibility` | `(visible: boolean) => void` | No | - | Visibility toggle callback |
| `showToggle` | `boolean` | No | `true` | Whether to show toggle button |
| `minLength` | `number` | No | - | Minimum password length |
| `requireUppercase` | `boolean` | No | `false` | Require uppercase letter |
| `requireLowercase` | `boolean` | No | `false` | Require lowercase letter |
| `requireNumber` | `boolean` | No | `false` | Require number |
| `requireSpecialChar` | `boolean` | No | `false` | Require special character |
| `isNewPassword` | `boolean` | No | `false` | Whether this is for a new password |

#### Extended Contracts

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_secure_input` | Masks password input by default | web, ios, android |
| `supports_password_toggle` | Provides show/hide password functionality | web, ios, android |
| `provides_password_autocomplete` | Enables browser/platform password autofill | web, ios, android |

#### Usage Example

```html
<!-- Web -->
<input-text-password
  id="password"
  label="Password"
  value=""
  helper-text="Must be at least 8 characters"
  min-length="8"
></input-text-password>
```

```swift
// iOS
InputTextPassword(
    id: "password",
    label: "Password",
    value: $passwordValue,
    onChange: { newValue in passwordValue = newValue },
    helperText: "Must be at least 8 characters",
    minLength: 8
)
```

---

### Input-Text-PhoneNumber

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Input-Text-Base

#### Extended Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `'tel'` | No | `'tel'` | Fixed to 'tel' |
| `autocomplete` | `'tel'` | No | `'tel'` | Fixed to 'tel' for autofill |
| `countryCode` | `string` | No | `'US'` | ISO 3166-1 alpha-2 country code |
| `showCountrySelector` | `boolean` | No | `false` | Whether to show country selector |
| `onCountryChange` | `(countryCode: string) => void` | No | - | Country change callback |
| `autoFormat` | `boolean` | No | `true` | Whether to format as user types |
| `customValidator` | `(phoneNumber: string, countryCode: string) => boolean` | No | - | Custom validation function |
| `invalidPhoneMessage` | `string` | No | `'Please enter a valid phone number'` | Custom error message |

#### Extended Contracts

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `validates_phone_format` | Validates phone number against country-specific patterns | web, ios, android |
| `provides_phone_formatting` | Formats phone numbers as user types | web, ios, android |
| `supports_international_formats` | Handles multiple country phone number formats | web, ios, android |

#### Supported Countries

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

#### Usage Example

```html
<!-- Web -->
<input-text-phone-number
  id="phone"
  label="Phone number"
  value=""
  country-code="US"
></input-text-phone-number>
```

```swift
// iOS
InputTextPhoneNumber(
    id: "phone",
    label: "Phone number",
    value: $phoneValue,
    onChange: { newValue in phoneValue = newValue },
    countryCode: "US"
)
```

---

## Token Dependencies

### Required Tokens

Components in the Form Inputs family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.labelMd` | Label when inside input (16px) |
| Typography | `typography.labelMdFloat` | Label when floated above input (14px) |
| Typography | `typography.input` | Input text (16px) |
| Typography | `typography.caption` | Helper text and error messages (13px) |
| Color | `color.text.muted` | Label and helper text (default state) |
| Color | `color.text.default` | Input text |
| Color | `color.primary` | Label and border (focused state) |
| Color | `color.error` / `color.error.strong` | Error state |
| Color | `color.success.strong` | Success state |
| Color | `color.border` | Border (default state) |
| Color | `color.background` | Input background |
| Spacing | `space.inset.100` | Input padding (8px) |
| Spacing | `space.grouped.tight` | Space between floated label and input (4px) |
| Spacing | `space.grouped.minimal` | Space between input and helper text (2px) |
| Motion | `motion.floatLabel` | Label float animation timing (250ms) |
| Motion | `motion.focusTransition` | Focus state transition timing (150ms) |
| Border | `borderDefault` | Default border width |
| Border | `radius150` | Border radius |
| Accessibility | `tapAreaRecommended` | Minimum touch target height (48px) |
| Accessibility | `accessibility.focus.width` | Focus ring width (2px) |
| Accessibility | `accessibility.focus.offset` | Focus ring offset (2px) |
| Accessibility | `accessibility.focus.color` | Focus ring color |
| Icon | `icon.size100` | Icon size |
| Blend | `blend.focusSaturate` | Focus state saturation |
| Blend | `blend.disabledDesaturate` | Disabled state desaturation |

### Token Resolution

Form Inputs components resolve tokens through the Rosetta System's semantic-to-primitive hierarchy. Typography tokens compose fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives. Color tokens resolve to theme-aware values supporting light/dark modes.

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md) - Token routing table
- [Typography Tokens](./Token-Family-Typography.md) - Typography token details

---

## Usage Guidelines

### When to Use Form Inputs

**Use Form Inputs components when**:
- Collecting user data that requires validation
- Building forms with consistent styling and behavior
- Need accessible text input with float label pattern
- Require cross-platform consistency

**Do NOT use Form Inputs components when**:
- Displaying read-only text (use Data Displays instead)
- Need multi-line text input (use Textarea component when available)
- Building search interfaces (use Search component when available)

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Email address collection | Input-Text-Email | Built-in email validation and autocomplete |
| Password entry | Input-Text-Password | Secure input with toggle functionality |
| Phone number collection | Input-Text-PhoneNumber | Auto-formatting and international support |
| Generic text input | Input-Text-Base | No specialized validation needed |
| Custom validation needs | Input-Text-Base | Use customValidator prop |

### Common Patterns

#### Login Form

```html
<!-- Web -->
<form>
  <input-text-email
    id="login-email"
    label="Email address"
    value=""
    required
  ></input-text-email>
  
  <input-text-password
    id="login-password"
    label="Password"
    value=""
    autocomplete="current-password"
    required
  ></input-text-password>
  
  <button-cta variant="primary">Sign In</button-cta>
</form>
```

#### Registration Form

```html
<!-- Web -->
<form>
  <input-text-base
    id="full-name"
    label="Full name"
    value=""
    required
  ></input-text-base>
  
  <input-text-email
    id="reg-email"
    label="Email address"
    value=""
    required
  ></input-text-email>
  
  <input-text-phone-number
    id="phone"
    label="Phone number"
    value=""
    country-code="US"
  ></input-text-phone-number>
  
  <input-text-password
    id="new-password"
    label="Create password"
    value=""
    is-new-password="true"
    min-length="8"
    require-uppercase="true"
    require-number="true"
    helper-text="At least 8 characters with one uppercase and one number"
  ></input-text-password>
  
  <button-cta variant="primary">Create Account</button-cta>
</form>
```

### Accessibility Considerations

- **Label Association**: All inputs have programmatically associated labels via the float label pattern
- **Error Identification**: Errors are identified with color, icon, and text (not color alone)
- **Focus Visibility**: Clear focus indicators meet WCAG 2.4.7 requirements
- **Keyboard Navigation**: All components are fully keyboard accessible
- **Screen Reader Support**: Proper ARIA attributes for state announcements
- **Reduced Motion**: Animations respect `prefers-reduced-motion` preference

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/[Component].web.ts` |
| iOS | SwiftUI | `platforms/ios/[Component].ios.swift` |
| Android | Jetpack Compose | `platforms/android/[Component].android.kt` |

### Platform-Specific Behaviors

#### Web

- Uses Shadow DOM for style encapsulation
- Custom element registration: `<input-text-base>`, `<input-text-email>`, etc.
- Supports `className` prop for additional styling
- Uses `:focus-visible` for keyboard-only focus indication
- Autocomplete attributes for browser autofill

#### iOS

- SwiftUI View implementations
- Uses `@State` and `@Binding` for value management
- `UIKeyboardType` for specialized keyboards (email, phone)
- `UITextContentType` for autofill support
- SF Symbols for icons

#### Android

- Jetpack Compose Composable implementations
- Uses `MutableState` for value management
- `KeyboardType` for specialized keyboards
- Autofill framework integration
- Material Design icons

### Behavioral Consistency

All platforms implement the same behavioral contracts:
- Float label animation timing matches across platforms (250ms)
- Validation triggers on blur consistently
- Error/success states display identically
- Focus ring appearance is mathematically equivalent
- Reduced motion preference is respected

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Input-Text-Base Schema](../../../src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml) - Full schema definition
