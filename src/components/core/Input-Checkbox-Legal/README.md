# Input-Checkbox-Legal Component

**Stemma System**: Form Inputs Family  
**Component Type**: Semantic Variant (extends Base)  
**Readiness**: 🟢 Production Ready  
**Version**: 1.0.0

---

## Overview

Input-Checkbox-Legal is a specialized checkbox for legal consent scenarios (terms of service, privacy policies, GDPR consent) with audit capabilities and stricter validation. It extends Input-Checkbox-Base conceptually while enforcing fixed configuration for legal compliance.

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Input-Checkbox-Legal`

**Key Features**:
- ✅ Fixed sizing: lg box (40px) with `labelSm` typography
- ✅ Fixed top label alignment for multi-line legal text
- ✅ Explicit consent enforcement (prevents pre-checking)
- ✅ Audit trail support (ISO 8601 timestamp, legalTextId, version)
- ✅ Required indicator visible by default
- ✅ No label truncation (full legal text always visible)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)

**Key Differences from Input-Checkbox-Base**:
| Aspect | Base | Legal |
|--------|------|-------|
| Size | sm, md, lg (configurable) | Fixed: lg box (40px) |
| Typography | Matches size | Fixed: `labelSm` |
| Label alignment | center (default), top | Fixed: top |
| Indeterminate | Supported | Not supported |
| Required indicator | Optional | Default visible |
| Label truncation | Allowed | Not allowed |
| Pre-checking | Allowed | Prevented (with warning) |
| Audit trail | Not included | ISO 8601 timestamp + metadata |

**DesignerPunk Philosophy**: This component does not support disabled states. If an action is unavailable, the component should not be rendered.

---

## Legal Consent Best Practices

### GDPR Compliance

1. **Explicit Consent Required**: Users must actively check the box; pre-checked boxes are not valid consent under GDPR
2. **Clear Language**: Legal text should be clear, specific, and easy to understand
3. **Granular Consent**: Separate checkboxes for different purposes (marketing, analytics, etc.)
4. **Easy Withdrawal**: Users should be able to withdraw consent as easily as they gave it
5. **Record Keeping**: Maintain audit trails with timestamps and document versions

### Implementation Guidelines

```typescript
// ✅ CORRECT: Explicit consent with audit trail
<input-checkbox-legal
  label="I agree to the Terms of Service and Privacy Policy"
  legal-text-id="tos-v2"
  legal-text-version="2.0.0"
  requires-explicit-consent
></input-checkbox-legal>

// ❌ WRONG: Pre-checked consent (will be overridden with warning)
<input-checkbox-legal
  label="I agree to marketing emails"
  checked  <!-- This will be ignored and a console warning emitted -->
></input-checkbox-legal>
```

### Audit Trail Usage

The `onConsentChange` callback provides all data needed for legal audit trails:

```typescript
interface ConsentChangeData {
  consented: boolean;      // true = consent given, false = consent withdrawn
  timestamp: string;       // ISO 8601 format: "2026-02-05T14:30:00.000Z"
  legalTextId?: string;    // ID of the legal document
  legalTextVersion?: string; // Version of the legal document
}
```

**Recommended Audit Log Fields**:
- User identifier
- Consent action (given/withdrawn)
- Timestamp (from callback)
- Legal document ID and version
- IP address (if applicable)
- User agent (if applicable)

---

## Behavioral Contracts

This component guarantees the following behaviors across all platforms:

| Contract | Description | WCAG |
|----------|-------------|------|
| `focusable` | Can receive keyboard focus | 2.1.1 |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 |
| `pressed_state` | Visual feedback when pressed | 2.4.7 |
| `checked_state` | Shows checkmark icon when checked | 1.4.1 |
| `error_state` | Shows error border and message | 3.3.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |
| `form_integration` | Native form submission and reset | 4.1.2 |
| `explicit_consent` | Prevents pre-checking with warning | N/A |
| `audit_trail` | Provides ISO 8601 timestamp and metadata | N/A |

---

## Usage

### HTML Custom Element

```html
<!-- Basic legal consent -->
<input-checkbox-legal
  label="I agree to the Terms of Service and Privacy Policy"
></input-checkbox-legal>

<!-- With audit trail metadata -->
<input-checkbox-legal
  label="I consent to the processing of my personal data as described in the Privacy Policy"
  legal-text-id="privacy-policy-v2"
  legal-text-version="2.1.0"
></input-checkbox-legal>

<!-- With helper text -->
<input-checkbox-legal
  label="I agree to receive marketing communications"
  helper-text="You can unsubscribe at any time"
  show-required-indicator="false"
></input-checkbox-legal>

<!-- With error state -->
<input-checkbox-legal
  label="I have read and accept the Terms of Service"
  error-message="You must accept the terms to continue"
></input-checkbox-legal>

<!-- GDPR consent with full audit trail -->
<input-checkbox-legal
  label="I consent to the collection and processing of my personal data for the purposes described in the Privacy Policy. I understand that I can withdraw my consent at any time."
  legal-text-id="gdpr-consent-2026"
  legal-text-version="1.0.0"
  name="gdpr-consent"
  value="accepted"
></input-checkbox-legal>
```

### JavaScript/TypeScript

```typescript
import { InputCheckboxLegalElement, ConsentChangeData } from './platforms/web/InputCheckboxLegal.web';

// Programmatic usage
const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
checkbox.label = 'I agree to the Terms of Service';
checkbox.legalTextId = 'tos-v3';
checkbox.legalTextVersion = '3.0.0';

// Listen for consent changes with audit trail
checkbox.onConsentChange = (data: ConsentChangeData) => {
  console.log('Consent:', data.consented);
  console.log('Timestamp:', data.timestamp);
  console.log('Document ID:', data.legalTextId);
  console.log('Document Version:', data.legalTextVersion);
  
  // Send to audit log
  auditService.logConsent({
    userId: currentUser.id,
    action: data.consented ? 'CONSENT_GIVEN' : 'CONSENT_WITHDRAWN',
    timestamp: data.timestamp,
    documentId: data.legalTextId,
    documentVersion: data.legalTextVersion
  });
};

document.body.appendChild(checkbox);

// Listen for consent-change custom event
checkbox.addEventListener('consent-change', (event) => {
  const data = (event as CustomEvent<ConsentChangeData>).detail;
  console.log('Consent event:', data);
});
```

### iOS (SwiftUI)

```swift
import DesignerPunk

@State private var hasConsented = false

// Basic legal consent
InputCheckboxLegal(
    checked: $hasConsented,
    label: "I agree to the Terms of Service and Privacy Policy"
)

// With audit trail
InputCheckboxLegal(
    checked: $hasConsented,
    label: "I consent to the processing of my personal data",
    legalTextId: "privacy-policy-v2",
    legalTextVersion: "2.1.0",
    onConsentChange: { data in
        // Log to audit system
        AuditLogger.shared.record(
            action: data.consented ? .consentGiven : .consentWithdrawn,
            timestamp: data.timestamp,
            documentId: data.legalTextId,
            documentVersion: data.legalTextVersion
        )
    }
)

// Optional consent (no required indicator)
InputCheckboxLegal(
    checked: $hasConsented,
    label: "I would like to receive the newsletter",
    showRequiredIndicator: false
)
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

var hasConsented by remember { mutableStateOf(false) }

// Basic legal consent
InputCheckboxLegal(
    checked = hasConsented,
    onCheckedChange = { hasConsented = it },
    label = "I agree to the Terms of Service and Privacy Policy"
)

// With audit trail
InputCheckboxLegal(
    checked = hasConsented,
    onCheckedChange = { hasConsented = it },
    label = "I consent to the processing of my personal data",
    legalTextId = "privacy-policy-v2",
    legalTextVersion = "2.1.0",
    onConsentChange = { data ->
        // Log to audit system
        auditLogger.record(
            action = if (data.consented) "CONSENT_GIVEN" else "CONSENT_WITHDRAWN",
            timestamp = data.timestamp,
            documentId = data.legalTextId,
            documentVersion = data.legalTextVersion
        )
    }
)

// With error state
InputCheckboxLegal(
    checked = hasConsented,
    onCheckedChange = { hasConsented = it },
    label = "I have read and accept the Terms of Service",
    errorMessage = "You must accept the terms to continue"
)
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | - | Label text (required for accessibility) |
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

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `consent-change` | `ConsentChangeData` | Fired when consent state changes (includes audit data) |
| `change` | `{ checked: boolean }` | Standard change event for compatibility |

### ConsentChangeData Interface

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

---

## Fixed Configuration

Input-Checkbox-Legal uses fixed configuration that cannot be changed:

| Aspect | Fixed Value | Rationale |
|--------|-------------|-----------|
| Box Size | 40px (lg) | Larger touch target for important legal actions |
| Typography | `labelSm` (14px) | Readable for longer legal text |
| Label Alignment | top | Checkbox aligns to first line of multi-line text |
| Indeterminate | Not supported | Legal consent is binary (yes/no) |
| Label Truncation | Disabled | Full legal text must always be visible |

---

## Explicit Consent Enforcement

When `requiresExplicitConsent` is `true` (default), the component prevents pre-checking:

```typescript
// This will be overridden to unchecked with a console warning
<input-checkbox-legal
  label="I agree to the terms"
  checked  <!-- Ignored! -->
></input-checkbox-legal>
```

**Console Warning**:
```
Input-Checkbox-Legal: Pre-checked state not allowed with requiresExplicitConsent. 
Overriding to unchecked. Legal consent must be explicitly given by the user.
```

**Why?** Under GDPR and similar regulations, consent must be:
- Freely given
- Specific
- Informed
- Unambiguous indication of wishes (active opt-in)

Pre-checked boxes do not constitute valid consent.

---

## Token Dependencies

### Typography
- `typography.labelSm` - Fixed label typography (14px)
- `typography.caption` - Helper text and error messages

### Color
- `color.feedback.select.background.rest` - Checked background
- `color.feedback.select.border.default` - Unchecked border
- `color.feedback.select.border.rest` - Checked border
- `color.feedback.error.border` - Error state border
- `color.contrast.onDark` - Checkmark icon color
- `color.contrast.onLight` - Label text color
- `color.text.muted` - Helper text and required indicator

### Spacing
- `inset.100` - Internal padding (8px, lg size)
- `space.grouped.loose` - Gap between box and label (12px)
- `space.grouped.tight` - Spacing for helper/error text

### Border
- `borderEmphasis` - Checkbox border width (2px)
- `radiusSmall` - Corner radius (4px)

### Motion
- `motion.selectionTransition` - State change animation (250ms)
- `motion.buttonPress` - iOS press feedback (150ms)

### Accessibility
- `accessibility.focus.color` - Focus ring color
- `accessibility.focus.width` - Focus ring width (2px)
- `accessibility.focus.offset` - Focus ring offset (2px)

---

## Accessibility

### WCAG 2.1 AA Compliance

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| 1.4.1 Use of Color | ✅ | States use icons and borders, not just color |
| 1.4.3 Contrast | ✅ | All text meets 4.5:1 contrast ratio |
| 1.4.11 Non-text Contrast | ✅ | Focus ring meets 3:1 contrast ratio |
| 2.1.1 Keyboard | ✅ | Fully keyboard accessible (Tab, Space) |
| 2.4.7 Focus Visible | ✅ | Clear focus indicator with :focus-visible |
| 2.5.5 Target Size | ✅ | Touch targets meet 44px minimum |
| 3.3.1 Error Identification | ✅ | Error messages with aria-invalid |
| 4.1.2 Name, Role, Value | ✅ | Proper ARIA attributes and state |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to/from checkbox |
| Space | Toggle checkbox state |

### Screen Reader Support

- Label associated via `for`/`id` (web) or accessibility label (native)
- State announced as "checked" or "unchecked" (no indeterminate)
- Error messages associated via `aria-describedby`
- Helper text associated via `aria-describedby`
- `aria-invalid="true"` when error present
- Required indicator announced as "Required field"

---

## Platform-Specific Behavior

### Web
- Shadow DOM for style encapsulation
- Hidden native `<input type="checkbox">` for form compatibility
- CSS logical properties for RTL support
- `:focus-visible` for keyboard-only focus ring
- Console warning for explicit consent violations

### iOS
- SwiftUI implementation with `@Binding` for state
- Scale animation on press (96% via `scale096`)
- Animation timing via `motion.buttonPress`
- Native RTL handling via `leading`/`trailing` alignment
- VoiceOver support with accessibility labels
- Print statement for explicit consent violations

### Android
- Jetpack Compose implementation
- Material ripple effect on press
- Ripple color via `blend.pressedDarker`
- Native RTL handling via `Arrangement.Start`/`End`
- TalkBack support with semantics
- Log.w for explicit consent violations

---

## Common GDPR Scenarios

### Terms of Service Acceptance

```html
<input-checkbox-legal
  label="I have read and agree to the Terms of Service"
  legal-text-id="terms-of-service"
  legal-text-version="2024-01-15"
  error-message="You must accept the Terms of Service to create an account"
></input-checkbox-legal>
```

### Privacy Policy Consent

```html
<input-checkbox-legal
  label="I consent to the collection and processing of my personal data as described in the Privacy Policy"
  legal-text-id="privacy-policy"
  legal-text-version="3.0.0"
></input-checkbox-legal>
```

### Marketing Communications (Optional)

```html
<input-checkbox-legal
  label="I would like to receive marketing communications about products and services"
  helper-text="You can unsubscribe at any time by clicking the link in our emails"
  show-required-indicator="false"
  legal-text-id="marketing-consent"
  legal-text-version="1.0.0"
></input-checkbox-legal>
```

### Age Verification

```html
<input-checkbox-legal
  label="I confirm that I am 18 years of age or older"
  legal-text-id="age-verification"
  legal-text-version="1.0.0"
></input-checkbox-legal>
```

### Cookie Consent

```html
<input-checkbox-legal
  label="I accept the use of cookies for analytics and personalization as described in our Cookie Policy"
  legal-text-id="cookie-policy"
  legal-text-version="2.0.0"
  helper-text="Essential cookies are always enabled"
></input-checkbox-legal>
```

---

## File Structure

```
src/components/core/Input-Checkbox-Legal/
├── types.ts                              # Shared type definitions
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── InputCheckboxLegal.web.ts     # Web Component implementation
│   │   └── InputCheckboxLegal.web.css    # Web styles
│   ├── ios/
│   │   └── InputCheckboxLegal.ios.swift  # SwiftUI implementation
│   └── android/
│       └── InputCheckboxLegal.android.kt # Compose implementation
└── __tests__/
    └── InputCheckboxLegal.test.ts        # Unit tests
```

---

## Related Components

| Component | Relationship |
|-----------|--------------|
| `Input-Checkbox-Base` | Parent primitive that Legal extends |
| `Icon-Base` | Used for checkmark icon |
| `Input-Text-Base` | Sibling in Form Inputs family |

---

## Related Documentation

- [Design Specification](/.kiro/specs/046-input-checkbox-base/design.md)
- [Requirements](/.kiro/specs/046-input-checkbox-base/requirements.md)
- [Input-Checkbox-Base README](../Input-Checkbox-Base/README.md)
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)
- [Token Quick Reference](/.kiro/steering/Token-Quick-Reference.md)

---

**Organization**: component-documentation  
**Scope**: 046-input-checkbox-base
