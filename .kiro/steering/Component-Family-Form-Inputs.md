---
inclusion: manual
---

# Form Inputs Components

**Date**: 2026-02-07
**Purpose**: MCP-queryable documentation for Form Inputs component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, form-implementation
**Last Reviewed**: 2026-02-07

---

## Family Overview

**Family**: Form Inputs
**Shared Need**: Data collection and validation
**Readiness**: 🟢 Production Ready

### Purpose

The Form Inputs family provides text input, checkbox, and radio components for collecting user data with built-in validation, accessibility, and cross-platform consistency. Text input components implement the float label pattern with smooth animated transitions. Selection controls (checkbox, radio) provide binary and single-selection capabilities with comprehensive state handling.

### Key Characteristics

- **Float Label Animation**: Text inputs smoothly transition labels between placeholder and floated positions using motion tokens
- **Built-in Validation**: Validation triggers on blur (text inputs) or group-level (radio sets) with error/success state display
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Cross-Platform Consistent**: Mathematically equivalent animations across web, iOS, and Android
- **Semantic Specialization**: Semantic variants extend primitive bases with domain-specific functionality
- **Orchestration Pattern**: Set components orchestrate Base children without duplicating rendering logic

### Stemma System Integration

- **Primitive Bases**: Input-Text-Base, Input-Checkbox-Base, Input-Radio-Base
- **Pattern Components**: Input-Radio-Set (orchestrates Input-Radio-Base children)
- **Semantic Variants**: 4 implemented (Email, Password, PhoneNumber, Checkbox-Legal)
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

Input-Checkbox-Base (Primitive)
    │
    └── Input-Checkbox-Legal (Semantic)
        └── Legal consent + audit trail + explicit consent enforcement

Input-Radio-Base (Primitive)
    │
    └── [Used by] Input-Radio-Set (Pattern/Orchestrator)
        └── Mutual exclusivity + keyboard navigation + group validation
```

### Primitive Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Input-Text-Base | Primitive | 🟢 Production Ready | Foundational text input with float label pattern |
| Input-Checkbox-Base | Primitive | 🟢 Production Ready | Binary selection control with three size variants |
| Input-Radio-Base | Primitive | 🟢 Production Ready | Single-selection control with three size variants |

### Pattern Components

| Component | Orchestrates | Status | Purpose |
|-----------|-------------|--------|---------|
| Input-Radio-Set | Input-Radio-Base | 🟢 Production Ready | Mutual exclusivity, keyboard navigation, group validation |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Input-Text-Email | Input-Text-Base | 🟢 Production Ready | Email validation + autocomplete |
| Input-Text-Password | Input-Text-Base | 🟢 Production Ready | Secure input + password toggle |
| Input-Text-PhoneNumber | Input-Text-Base | 🟢 Production Ready | Phone formatting + international validation |
| Input-Checkbox-Legal | Input-Checkbox-Base | 🟢 Production Ready | Legal consent + audit trail |

---

## Behavioral Contracts

### Text Input Base Contracts (Inherited by Text Input Components)

All text input components in the Form Inputs family inherit these 9 foundational contracts from Input-Text-Base:

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

### Checkbox Base Contracts (Inherited by Checkbox Components)

All checkbox components in the Form Inputs family inherit these 9 foundational contracts from Input-Checkbox-Base:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `focusable` | Can receive keyboard focus | 2.1.1 | web, ios, android |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 | web, ios, android |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 | web |
| `pressed_state` | Visual feedback when pressed | 2.4.7 | web, ios, android |
| `checked_state` | Shows checkmark icon when checked | 1.4.1 | web, ios, android |
| `indeterminate_state` | Shows minus icon for partial selection | 1.4.1 | web, ios, android |
| `error_state_display` | Shows error border and message | 3.3.1 | web, ios, android |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 | web, ios, android |
| `form_integration` | Native form submission and reset | 4.1.2 | web, ios, android |

### Checkbox Contract Details

#### checked_state

**Description**: When checked, component displays filled background with checkmark icon via Icon-Base.

**Behavior**: Background uses `color.feedback.select.background.rest`. Border uses `color.feedback.select.border.rest`. Checkmark icon uses `color.contrast.onDark`. State transition animated via `motion.selectionTransition` (250ms).

**WCAG Compliance**: 1.4.1 Use of Color (icon provides non-color indication)

#### indeterminate_state

**Description**: When indeterminate, component displays filled background with horizontal minus icon via Icon-Base.

**Behavior**: Same styling as checked state but with minus icon instead of checkmark. Used for parent checkboxes with partially selected children. Indeterminate state overrides checked state visually.

**WCAG Compliance**: 1.4.1 Use of Color (icon provides non-color indication)

#### form_integration

**Description**: Checkbox integrates with native form submission and reset.

**Behavior**: Hidden native `<input type="checkbox">` ensures form compatibility. Value included in form submission when checked. Form reset returns checkbox to unchecked state (pre-checked checkboxes not supported per DesignerPunk philosophy).

**WCAG Compliance**: 4.1.2 Name, Role, Value

#### Input-Checkbox-Legal Extended Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `explicit_consent` | Prevents pre-checking with console warning | N/A |
| `audit_trail` | Provides ISO 8601 timestamp and metadata | N/A |
| `required_indicator` | Shows "Required" indicator by default | 3.3.2 |

### Radio Base Contracts (Inherited by Radio Components)

All radio components in the Form Inputs family inherit these 8 foundational contracts from Input-Radio-Base:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `focusable` | Can receive keyboard focus | 2.1.1 | web, ios, android |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 | web, ios, android |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 | web |
| `pressed_state` | Visual feedback when pressed | 2.4.7 | web, ios, android |
| `selected_state` | Shows filled dot when selected | 1.4.1 | web, ios, android |
| `error_state` | Shows error border and message | 3.3.1 | web, ios, android |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 | web, ios, android |
| `form_integration` | Native form submission | 4.1.2 | web, ios, android |

### Radio Contract Details

#### selected_state

**Description**: When selected, component displays a filled circular dot centered within the outer circle.

**Behavior**: Dot uses `color.feedback.select.background.rest` fill. Border uses `color.feedback.select.border.rest`. Dot scales in via `motion.selectionTransition` (250ms). Unlike checkbox (which uses a checkmark icon via Icon-Base), radio uses a simple filled circle — no icon dependency required.

**WCAG Compliance**: 1.4.1 Use of Color (dot shape provides non-color indication)

#### form_integration (Radio)

**Description**: Radio integrates with native form submission via hidden `<input type="radio">`.

**Behavior**: Hidden native radio ensures form compatibility. Value included in form submission when selected. `name` attribute groups radios for mutual exclusivity. Unlike checkbox, radio `value` is required for group identification.

**WCAG Compliance**: 4.1.2 Name, Role, Value

### Input-Radio-Set Contracts

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `mutual_exclusivity` | Only one radio selected at a time | N/A | web, ios, android |
| `keyboard_navigation` | Arrow keys navigate within group | 2.1.1 | web, ios, android |
| `group_validation` | Required validation at group level | 3.3.1 | web, ios, android |
| `error_announcement` | Error message announced to screen readers | 4.1.3 | web, ios, android |
| `radiogroup_role` | Proper ARIA role for group | 4.1.2 | web, ios, android |

### Radio Set Contract Details

#### mutual_exclusivity

**Description**: Only one radio within the group can be selected at any time.

**Behavior**: When a user selects a radio, the previously selected radio becomes unselected. Clicking an already-selected radio does NOT deselect it (radio convention). The Set coordinates this via event listening (web), environment values (iOS), or CompositionLocal (Android).

#### keyboard_navigation

**Description**: Arrow keys navigate between radios within the group following WAI-ARIA radio group pattern.

**Behavior**: Tab enters/exits the group. Arrow Down/Right moves to next radio. Arrow Up/Left moves to previous radio. Wrap-around at group boundaries. Space selects focused radio. Home/End jump to first/last radio. Roving tabindex pattern ensures only one radio is in the tab order.

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

### Input-Checkbox-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Label text (required for accessibility) |
| `checked` | `boolean` | No | `false` | Whether checkbox is checked |
| `indeterminate` | `boolean` | No | `false` | Indeterminate state (overrides checked visually) |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `labelAlign` | `'center' \| 'top'` | No | `'center'` | Vertical alignment of label |
| `helperText` | `string` | No | - | Helper text displayed below checkbox |
| `errorMessage` | `string` | No | - | Error message (triggers error styling) |
| `onChange` | `(checked: boolean) => void` | No | - | Change callback |
| `id` | `string` | No | auto-generated | Unique identifier |
| `name` | `string` | No | - | Form field name |
| `value` | `string` | No | `'on'` | Value submitted when checked |
| `testID` | `string` | No | - | Test identifier |

#### Size Variants

| Size | Box Size | Icon Size | Inset | Gap | Typography |
|------|----------|-----------|-------|-----|------------|
| `sm` | 24px | `icon.size050` (16px) | `inset.050` (4px) | `space.grouped.normal` | `labelSm` |
| `md` | 32px | `icon.size075` (20px) | `inset.075` (6px) | `space.grouped.normal` | `labelMd` |
| `lg` | 40px | `icon.size100` (24px) | `inset.100` (8px) | `space.grouped.loose` | `labelLg` |

**Box Size Formula**: `iconSize + (inset × 2)`

#### Usage Example

```html
<!-- Web -->
<input-checkbox-base
  label="Accept terms and conditions"
></input-checkbox-base>

<!-- With all attributes -->
<input-checkbox-base
  label="Subscribe to newsletter"
  size="lg"
  label-align="top"
  helper-text="We'll send weekly updates"
  name="newsletter"
></input-checkbox-base>

<!-- Indeterminate state (for parent checkboxes) -->
<input-checkbox-base
  label="Select all items"
  indeterminate
></input-checkbox-base>
```

```swift
// iOS
InputCheckboxBase(
    checked: $isChecked,
    label: "Accept terms",
    size: .md,
    labelAlign: .center,
    onChange: { newValue in
        print("Checked: \(newValue)")
    }
)
```

```kotlin
// Android
InputCheckboxBase(
    checked = isChecked,
    onCheckedChange = { isChecked = it },
    label = "Accept terms",
    size = CheckboxSize.Medium,
    labelAlign = LabelAlignment.Center
)
```

---

### Input-Checkbox-Legal

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Input-Checkbox-Base (conceptually, with fixed configuration)

#### Fixed Configuration

Input-Checkbox-Legal uses fixed configuration that cannot be changed:

| Aspect | Fixed Value | Rationale |
|--------|-------------|-----------|
| Box Size | 40px (lg) | Larger touch target for important legal actions |
| Typography | `labelSm` (14px) | Readable for longer legal text |
| Label Alignment | top | Checkbox aligns to first line of multi-line text |
| Indeterminate | Not supported | Legal consent is binary (yes/no) |
| Label Truncation | Disabled | Full legal text must always be visible |

#### Extended Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Label text (required for accessibility) |
| `checked` | `boolean` | No | `false` | Whether checkbox is checked |
| `helperText` | `string` | No | - | Helper text displayed below checkbox |
| `errorMessage` | `string` | No | - | Error message (triggers error styling) |
| `requiresExplicitConsent` | `boolean` | No | `true` | Prevents pre-checking (GDPR compliance) |
| `legalTextId` | `string` | No | - | ID linking to legal document (audit trail) |
| `legalTextVersion` | `string` | No | - | Version of legal document (audit trail) |
| `showRequiredIndicator` | `boolean` | No | `true` | Show "Required" indicator |
| `onChange` | `(checked: boolean) => void` | No | - | Base change callback |
| `onConsentChange` | `(data: ConsentChangeData) => void` | No | - | Consent change callback with audit data |
| `id` | `string` | No | auto-generated | Unique identifier |
| `name` | `string` | No | - | Form field name |
| `value` | `string` | No | `'on'` | Value submitted when checked |
| `testID` | `string` | No | - | Test identifier |

#### ConsentChangeData Interface

```typescript
interface ConsentChangeData {
  /** Whether consent was given (true) or withdrawn (false) */
  consented: boolean;
  
  /** ISO 8601 timestamp: "2026-02-05T14:30:00.000Z" */
  timestamp: string;
  
  /** ID linking to legal document (if provided) */
  legalTextId?: string;
  
  /** Version of legal document (if provided) */
  legalTextVersion?: string;
}
```

#### Extended Contracts

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `explicit_consent` | Prevents pre-checking with console warning | web, ios, android |
| `audit_trail` | Provides ISO 8601 timestamp and metadata | web, ios, android |
| `required_indicator` | Shows "Required" indicator by default | web, ios, android |

#### Usage Example

```html
<!-- Web -->
<input-checkbox-legal
  label="I agree to the Terms of Service and Privacy Policy"
  legal-text-id="tos-v2"
  legal-text-version="2.0.0"
></input-checkbox-legal>

<!-- With audit trail callback -->
<input-checkbox-legal
  label="I consent to the processing of my personal data"
  legal-text-id="privacy-policy-v2"
  legal-text-version="2.1.0"
></input-checkbox-legal>
```

```swift
// iOS
InputCheckboxLegal(
    checked: $hasConsented,
    label: "I agree to the Terms of Service",
    legalTextId: "tos-v3",
    legalTextVersion: "3.0.0",
    onConsentChange: { data in
        print("Consent: \(data.consented) at \(data.timestamp)")
    }
)
```

```kotlin
// Android
InputCheckboxLegal(
    checked = hasConsented,
    onCheckedChange = { hasConsented = it },
    label = "I agree to the Terms of Service",
    legalTextId = "tos-v3",
    legalTextVersion = "3.0.0",
    onConsentChange = { data ->
        println("Consent: ${data.consented} at ${data.timestamp}")
    }
)
```

---

### Input-Radio-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Label text (required for accessibility) |
| `value` | `string` | Yes | - | Value for form submission and group identification |
| `selected` | `boolean` | No | `false` | Whether radio is selected |
| `name` | `string` | No | - | Radio group name (for native form behavior) |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `labelAlign` | `'center' \| 'top'` | No | `'center'` | Vertical alignment of label |
| `helperText` | `string` | No | - | Helper text displayed below radio (persistent) |
| `errorMessage` | `string` | No | - | Error message (triggers error styling) |
| `onSelect` | `(value: string) => void` | No | - | Called when radio is selected |
| `id` | `string` | No | auto-generated | Unique identifier |
| `testID` | `string` | No | - | Test identifier |

#### Size Variants

| Size | Circle Size | Dot Size | Inset | Gap | Typography |
|------|-------------|----------|-------|-----|------------|
| `sm` | 24px | `icon.size050` (16px) | `inset.050` (4px) | `space.grouped.normal` | `labelSm` |
| `md` | 32px | `icon.size075` (20px) | `inset.075` (6px) | `space.grouped.normal` | `labelMd` |
| `lg` | 40px | `icon.size100` (24px) | `inset.100` (8px) | `space.grouped.loose` | `labelLg` |

**Circle Size Formula**: `dotSize + (inset × 2)`

#### Key Differences from Checkbox

| Aspect | Checkbox | Radio |
|--------|----------|-------|
| Selection | Multi-select | Single-select (mutual exclusivity) |
| Shape | Rounded square | Circle (`radius.full`) |
| Indicator | Icon (check/minus) via Icon-Base | Filled dot (no icon dependency) |
| Indeterminate | Supported | Not applicable |
| `value` prop | Optional | Required |
| Set component | N/A | Input-Radio-Set |

#### Usage Example

```html
<!-- Web -->
<input-radio-base
  label="Option A"
  value="option-a"
  name="my-group"
></input-radio-base>

<!-- With all attributes -->
<input-radio-base
  label="Premium Plan"
  value="premium"
  name="subscription"
  size="lg"
  label-align="top"
  helper-text="Best value for teams"
  selected
></input-radio-base>
```

```swift
// iOS
InputRadioBase(
    value: "option-a",
    label: "Option A",
    selectedValue: $selectedValue,
    size: .md,
    onSelect: { value in print("Selected: \(value)") }
)
```

```kotlin
// Android
InputRadioBase(
    value = "option-a",
    label = "Option A",
    selectedValue = selectedValue,
    onSelectedChange = { selectedValue = it },
    size = RadioSize.Medium
)
```

---

### Input-Radio-Set

**Type**: Pattern (Orchestrator)
**Status**: 🟢 Production Ready
**Orchestrates**: Input-Radio-Base

**Architectural Principle**: Input-Radio-Set orchestrates child Input-Radio-Base components — it does NOT duplicate radio circle/dot rendering logic. This ensures Base improvements automatically benefit Set usage and maintains a single source of truth for radio rendering.

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `selectedValue` | `string \| null` | No | `null` | Currently selected value (controlled) |
| `onSelectionChange` | `(value: string \| null) => void` | No | - | Callback when selection changes |
| `required` | `boolean` | No | `false` | Whether a selection is required |
| `error` | `boolean` | No | `false` | Error state indicator |
| `errorMessage` | `string` | No | - | Error message to display |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant applied to all children |
| `testID` | `string` | No | - | Test identifier |

#### Platform State Coordination

| Platform | Mechanism | Description |
|----------|-----------|-------------|
| Web | Slot-based composition | Children rendered via `<slot>`, events bubble up |
| iOS | Environment values | Selection state passed via SwiftUI environment |
| Android | CompositionLocal | Selection state passed via CompositionLocalProvider |

#### Usage Example

```html
<!-- Web -->
<input-radio-set selected-value="monthly" size="md">
  <input-radio-base label="Monthly" value="monthly"></input-radio-base>
  <input-radio-base label="Yearly" value="yearly" helper-text="Save 20%"></input-radio-base>
  <input-radio-base label="Lifetime" value="lifetime"></input-radio-base>
</input-radio-set>

<!-- With validation -->
<input-radio-set required error error-message="Please select a plan">
  <input-radio-base label="Basic" value="basic"></input-radio-base>
  <input-radio-base label="Pro" value="pro"></input-radio-base>
</input-radio-set>
```

```swift
// iOS
InputRadioSet(selectedValue: $selectedPlan, size: .md) {
    InputRadioBase(value: "monthly", label: "Monthly", selectedValue: $selectedPlan)
    InputRadioBase(value: "yearly", label: "Yearly", selectedValue: $selectedPlan, helperText: "Save 20%")
    InputRadioBase(value: "lifetime", label: "Lifetime", selectedValue: $selectedPlan)
}
```

```kotlin
// Android
InputRadioSet(
    selectedValue = selectedPlan,
    onSelectionChange = { selectedPlan = it },
    size = RadioSize.Medium
) {
    InputRadioBase(value = "monthly", label = "Monthly", selectedValue = selectedPlan, onSelectedChange = { selectedPlan = it })
    InputRadioBase(value = "yearly", label = "Yearly", selectedValue = selectedPlan, onSelectedChange = { selectedPlan = it }, helperText = "Save 20%")
    InputRadioBase(value = "lifetime", label = "Lifetime", selectedValue = selectedPlan, onSelectedChange = { selectedPlan = it })
}
```

---

## Token Dependencies

### Required Tokens

Components in the Form Inputs family consume these design tokens:

#### Text Input Tokens

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

#### Checkbox Tokens

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.labelSm` | Small size label (14px) |
| Typography | `typography.labelMd` | Medium size label (16px) |
| Typography | `typography.labelLg` | Large size label (18px) |
| Typography | `typography.caption` | Helper text and error messages |
| Color | `color.feedback.select.background.rest` | Checked/indeterminate background |
| Color | `color.feedback.select.border.default` | Unchecked border |
| Color | `color.feedback.select.border.rest` | Checked/hover border |
| Color | `color.feedback.error.border` | Error state border |
| Color | `color.contrast.onDark` | Checkmark/minus icon color |
| Color | `color.contrast.onLight` | Label text color |
| Spacing | `inset.050` | Small size internal padding (4px) |
| Spacing | `inset.075` | Medium size internal padding (6px) |
| Spacing | `inset.100` | Large size internal padding (8px) |
| Spacing | `space.grouped.normal` | Gap for sm/md sizes |
| Spacing | `space.grouped.loose` | Gap for lg size |
| Border | `borderEmphasis` | Checkbox border width (2px) |
| Border | `radiusSubtle` | Small size corner radius (2px) |
| Border | `radiusSmall` | Medium/large size corner radius (4px) |
| Motion | `motion.selectionTransition` | State change animation (250ms) |
| Motion | `motion.buttonPress` | iOS press feedback (150ms) |
| Blend | `blend.hoverDarker` | Web hover state (8% darker) |
| Blend | `blend.pressedDarker` | Android ripple (12% darker) |
| Scale | `scale096` | iOS press scale (96%) |
| Accessibility | `accessibility.focus.color` | Focus ring color |
| Accessibility | `accessibility.focus.width` | Focus ring width (2px) |
| Accessibility | `accessibility.focus.offset` | Focus ring offset (2px) |
| Icon | `icon.size050` | Small checkbox icon (16px) |
| Icon | `icon.size075` | Medium checkbox icon (20px) |
| Icon | `icon.size100` | Large checkbox icon (24px) |

#### Radio Tokens

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.labelSm` | Small size label (14px) |
| Typography | `typography.labelMd` | Medium size label (16px) |
| Typography | `typography.labelLg` | Large size label (18px) |
| Typography | `typography.caption` | Helper text and error messages |
| Color | `color.feedback.select.background.rest` | Selected dot fill color |
| Color | `color.feedback.select.border.default` | Unselected border |
| Color | `color.feedback.select.border.rest` | Selected border |
| Color | `color.feedback.error.border` | Error state border |
| Color | `color.contrast.onLight` | Label text color |
| Spacing | `inset.050` | Small size internal padding (4px) |
| Spacing | `inset.075` | Medium size internal padding (6px) |
| Spacing | `inset.100` | Large size internal padding (8px) |
| Spacing | `space.grouped.normal` | Gap for sm/md sizes |
| Spacing | `space.grouped.loose` | Gap for lg size |
| Border | `borderEmphasis` | Radio border width (2px) |
| Border | `radius.full` | Fully rounded circle (50%) |
| Motion | `motion.selectionTransition` | State change animation (250ms) |
| Motion | `motion.buttonPress` | iOS press feedback (150ms) |
| Blend | `blend.hoverDarker` | Web hover state (8% darker) |
| Blend | `blend.pressedDarker` | Android ripple (12% darker) |
| Scale | `scale096` | iOS press scale (96%) |
| Accessibility | `accessibility.focus.color` | Focus ring color |
| Accessibility | `accessibility.focus.width` | Focus ring width (2px) |
| Accessibility | `accessibility.focus.offset` | Focus ring offset (2px) |
| Icon | `icon.size050` | Small radio dot (16px) |
| Icon | `icon.size075` | Medium radio dot (20px) |
| Icon | `icon.size100` | Large radio dot (24px) |

**Note**: Radio tokens overlap significantly with checkbox tokens. No new tokens were required — all tokens existed from prior specs.

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

#### Text Inputs

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Email address collection | Input-Text-Email | Built-in email validation and autocomplete |
| Password entry | Input-Text-Password | Secure input with toggle functionality |
| Phone number collection | Input-Text-PhoneNumber | Auto-formatting and international support |
| Generic text input | Input-Text-Base | No specialized validation needed |
| Custom validation needs | Input-Text-Base | Use customValidator prop |

#### Checkboxes

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Terms of service acceptance | Input-Checkbox-Legal | Audit trail + explicit consent enforcement |
| Privacy policy consent | Input-Checkbox-Legal | GDPR compliance + timestamp logging |
| Marketing opt-in | Input-Checkbox-Legal | Audit trail for consent records |
| Generic binary selection | Input-Checkbox-Base | No legal/audit requirements |
| Parent checkbox (select all) | Input-Checkbox-Base | Supports indeterminate state |
| Settings toggle | Input-Checkbox-Base | Simple on/off without audit needs |

#### Radio Buttons

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Single selection from a group | Input-Radio-Set + Input-Radio-Base | Mutual exclusivity + keyboard navigation |
| Subscription plan selection | Input-Radio-Set + Input-Radio-Base | Clear single-choice with group validation |
| Survey question (pick one) | Input-Radio-Set + Input-Radio-Base | Required validation at group level |
| Standalone radio (rare) | Input-Radio-Base | Only when group behavior is managed externally |

**Radio vs Checkbox Decision**:
- Use **radio** when the user must pick exactly one option from a group (single-select)
- Use **checkbox** when the user can pick zero or more options (multi-select)
- Radios are almost always used in groups via Input-Radio-Set

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

#### Registration Form with Legal Consent

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
  
  <input-text-password
    id="new-password"
    label="Create password"
    value=""
    is-new-password="true"
    min-length="8"
  ></input-text-password>
  
  <input-checkbox-legal
    label="I agree to the Terms of Service and Privacy Policy"
    legal-text-id="tos-privacy-v2"
    legal-text-version="2.0.0"
    name="terms-consent"
  ></input-checkbox-legal>
  
  <input-checkbox-legal
    label="I would like to receive marketing communications"
    show-required-indicator="false"
    legal-text-id="marketing-consent"
    legal-text-version="1.0.0"
    name="marketing-consent"
  ></input-checkbox-legal>
  
  <button-cta variant="primary">Create Account</button-cta>
</form>
```

#### Settings Panel with Checkboxes

```html
<!-- Web -->
<container-base padding="200">
  <h2>Notification Settings</h2>
  
  <input-checkbox-base
    label="Email notifications"
    helper-text="Receive updates via email"
    name="email-notifications"
  ></input-checkbox-base>
  
  <input-checkbox-base
    label="Push notifications"
    helper-text="Receive push notifications on your device"
    name="push-notifications"
  ></input-checkbox-base>
  
  <input-checkbox-base
    label="SMS notifications"
    helper-text="Receive text message alerts"
    name="sms-notifications"
  ></input-checkbox-base>
  
  <button-cta variant="primary">Save Settings</button-cta>
</container-base>
```

#### Parent-Child Checkbox Pattern

```html
<!-- Web -->
<div class="checkbox-group">
  <!-- Parent checkbox with indeterminate state -->
  <input-checkbox-base
    id="select-all"
    label="Select all items"
    indeterminate
  ></input-checkbox-base>
  
  <!-- Child checkboxes -->
  <div class="checkbox-children">
    <input-checkbox-base
      label="Item 1"
      name="items"
      value="item-1"
    ></input-checkbox-base>
    
    <input-checkbox-base
      label="Item 2"
      name="items"
      value="item-2"
      checked
    ></input-checkbox-base>
    
    <input-checkbox-base
      label="Item 3"
      name="items"
      value="item-3"
    ></input-checkbox-base>
  </div>
</div>
```

#### Radio Group Selection

```html
<!-- Web: Subscription plan selection -->
<input-radio-set selected-value="pro" size="md">
  <input-radio-base
    label="Basic"
    value="basic"
    helper-text="5 projects, 1 GB storage"
  ></input-radio-base>
  
  <input-radio-base
    label="Pro"
    value="pro"
    helper-text="Unlimited projects, 100 GB storage"
  ></input-radio-base>
  
  <input-radio-base
    label="Enterprise"
    value="enterprise"
    helper-text="Custom limits, dedicated support"
  ></input-radio-base>
</input-radio-set>
```

#### Radio Group with Validation

```html
<!-- Web: Required radio group with error state -->
<input-radio-set required error error-message="Please select a shipping method">
  <input-radio-base label="Standard (5-7 days)" value="standard"></input-radio-base>
  <input-radio-base label="Express (2-3 days)" value="express"></input-radio-base>
  <input-radio-base label="Overnight" value="overnight"></input-radio-base>
</input-radio-set>
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
- Custom element registration: `<input-text-base>`, `<input-text-email>`, `<input-checkbox-base>`, `<input-checkbox-legal>`, `<input-radio-base>`, `<input-radio-set>`, etc.
- Supports `className` prop for additional styling
- Uses `:focus-visible` for keyboard-only focus indication
- Autocomplete attributes for browser autofill
- Checkbox uses hidden native `<input type="checkbox">` for form compatibility
- CSS logical properties for RTL support

#### iOS

- SwiftUI View implementations
- Uses `@State` and `@Binding` for value management
- `UIKeyboardType` for specialized keyboards (email, phone)
- `UITextContentType` for autofill support
- SF Symbols for icons
- Checkbox uses scale animation on press (96% via `scale096`)
- Radio uses scale animation on press (96% via `scale096`)
- Native RTL handling via `leading`/`trailing` alignment

#### Android

- Jetpack Compose Composable implementations
- Uses `MutableState` for value management
- `KeyboardType` for specialized keyboards
- Autofill framework integration
- Material Design icons

### Behavioral Consistency

All platforms implement the same behavioral contracts:
- Float label animation timing matches across platforms (250ms)
- Selection transition timing matches across platforms (250ms)
- Validation triggers on blur consistently (text inputs) or group-level (radio sets)
- Error/success states display identically
- Focus ring appearance is mathematically equivalent
- Reduced motion preference is respected

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Input-Text-Base Schema](../../src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml) - Full schema definition
