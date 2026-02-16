# Progress-Indicator-Label-Base

**Family**: Progress Indicator
**Type**: Primitive (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Indicator-Label-Base is a primitive component that renders text labels centered below progress indicator nodes. It supports a primary label with optional helper text, using the `typography.labelSm` token for consistent text styling across platforms.

This component is non-interactive and decorative. Accessibility (ARIA roles, labels) is handled by the semantic variant that composes it: Stepper-Detailed. Pagination-Base and Stepper-Base do not use labels.

### Key Characteristics

- Positioned centered below the associated node
- Uses `typography.labelSm` composite token (14px)
- Supports optional helper text below the primary label
- Truncates with ellipsis when text exceeds available width
- Supports optional step indication
- Decorative primitive — hidden from assistive technology on all platforms

---

## Usage

### Web (Custom Element)

```html
<!-- Basic label -->
<progress-indicator-label-base label="Step 1"></progress-indicator-label-base>

<!-- Label with helper text -->
<progress-indicator-label-base label="Personal Info" helper-text="Name, email, phone"></progress-indicator-label-base>

<!-- Optional step -->
<progress-indicator-label-base label="Additional Details" optional></progress-indicator-label-base>

<!-- With test ID -->
<progress-indicator-label-base label="Review" test-id="step-4-label"></progress-indicator-label-base>
```

### iOS (SwiftUI)

```swift
// Basic label
ProgressIndicatorLabelBase(label: "Step 1")

// Label with helper text
ProgressIndicatorLabelBase(label: "Personal Info", helperText: "Name, email, phone")

// Optional step
ProgressIndicatorLabelBase(label: "Additional Details", optional: true)

// With test ID
ProgressIndicatorLabelBase(label: "Review", testID: "step-4-label")
```

### Android (Jetpack Compose)

```kotlin
// Basic label
ProgressIndicatorLabelBase(label = "Step 1")

// Label with helper text
ProgressIndicatorLabelBase(label = "Personal Info", helperText = "Name, email, phone")

// Optional step
ProgressIndicatorLabelBase(label = "Additional Details", optional = true)

// With test tag
ProgressIndicatorLabelBase(label = "Review", testTag = "step-4-label")
```


---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` | `string` | — | Yes | Primary label text displayed below the node |
| `helperText` | `string` | `undefined` | No | Optional helper text displayed below the primary label |
| `optional` | `boolean` | `false` | No | Whether this step is optional |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### Text Overflow Behavior

Both the primary label and helper text truncate with ellipsis when they exceed the available width:

| Text | Overflow | Lines |
|------|----------|-------|
| Primary label | Ellipsis truncation | Single line |
| Helper text | Ellipsis truncation | Single line |

### Helper Text Rendering

| `helperText` value | Rendering |
|--------------------|-----------|
| `undefined` / not set | No helper text rendered |
| `"Some text"` | Rendered below primary label at reduced emphasis (0.7 opacity) |

---

## Token Dependencies

### Typography Tokens (`typography.labelSm`)

| Token | Value | Usage |
|-------|-------|-------|
| `typography.labelSm.fontFamily` | Inter / system | Font family for label and helper text |
| `typography.labelSm.fontSize` | 14px (fontSize075) | Font size for all text |
| `typography.labelSm.lineHeight` | lineHeight075 | Line height for all text |
| `typography.labelSm.fontWeight` | fontWeight500 (Medium) | Font weight for all text |
| `typography.labelSm.letterSpacing` | letterSpacing075 | Letter spacing for all text |

### Color Tokens

| Token | Usage |
|-------|-------|
| `color.text.default` | Primary label text color |
| `color.text.subtle` | Helper text color (at 0.7 opacity) |

**Token source files:**
- Typography: Referenced via CSS custom properties / platform constants
- Color: Referenced via design token system

---

## Accessibility

This primitive is **decorative** — it is hidden from assistive technology on all platforms:

| Platform | Mechanism |
|----------|-----------|
| Web | `aria-hidden="true"`, `role="presentation"` |
| iOS | `accessibilityHidden(true)` |
| Android | `clearAndSetSemantics { }` |

Semantic variant (Stepper-Detailed) provides ARIA roles, labels, and screen reader announcements. The label text is incorporated into the variant's accessibility attributes — the primitive itself carries no semantic meaning for assistive technology.

### WCAG 2.1 AA Compliance

- **1.4.3 Contrast (Minimum)**: Label text meets 4.5:1 contrast ratio against background
- **1.4.4 Resize Text**: Text scales with user font size preferences on all platforms

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-indicator-label-base>`
- Shadow DOM for style encapsulation
- CSS custom properties for token-based styling (`--typography-label-sm-*`)
- CSS logical properties (`max-inline-size`) for RTL/LTR support
- Flexbox column layout with centered alignment
- HTML-escaped text output for security
- Helper text gap: 2px between label and helper

### iOS
- SwiftUI `View` struct (`ProgressIndicatorLabelBase`)
- Uses `Text` views within a `VStack(spacing: 2)`
- Font applied via `.font(.system(size: 14, weight: .medium))`
- Truncation via `.lineLimit(1)` and `.truncationMode(.tail)`
- Helper text at 0.7 opacity using `.opacity()` modifier
- Centered via `.multilineTextAlignment(.center)` and `.frame(maxWidth: .infinity)`
- Hidden from VoiceOver via `.accessibilityHidden(true)`

### Android
- Jetpack Compose `@Composable` function (`ProgressIndicatorLabelBase`)
- Uses `Text` composables within a `Column` with `Arrangement.spacedBy(space_025)`
- Font applied via `fontSize = 14.sp` and `fontWeight = FontWeight.Medium`
- Truncation via `maxLines = 1` and `overflow = TextOverflow.Ellipsis`
- Helper text at 0.7 alpha using `Color.copy(alpha = 0.7f)`
- Centered via `Alignment.CenterHorizontally` and `textAlign = TextAlign.Center`
- Hidden from TalkBack via `.clearAndSetSemantics { }`

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive circular indicator element
- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector line between nodes
- [Pagination-Base](../Progress-Pagination-Base/README.md) — Semantic variant: dot pagination (does not use labels)
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors (does not use labels)
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 1.8–1.10
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
- [Design Outline](/.kiro/specs/048-progress-family/design-outline.md) — Original design outline
