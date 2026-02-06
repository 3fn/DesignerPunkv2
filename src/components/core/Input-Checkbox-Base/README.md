# Input-Checkbox-Base Component

**Stemma System**: Form Inputs Family  
**Component Type**: Primitive (Base)  
**Readiness**: 🟢 Production Ready  
**Version**: 1.0.0

---

## Overview

Input-Checkbox-Base is a binary selection control for web, iOS, and Android platforms. It provides three size variants, configurable label alignment, and support for checked, unchecked, and indeterminate states while maintaining WCAG 2.1 AA accessibility compliance.

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Input-Checkbox-Base`

**Key Features**:
- ✅ Token-based styling (zero hard-coded values)
- ✅ Three size variants (sm, md, lg)
- ✅ Label alignment options (center, top)
- ✅ Indeterminate state for partial selection
- ✅ Helper text and error message support
- ✅ Icon-Base integration for checkmark/minus icons
- ✅ Platform-specific interaction patterns
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)
- ✅ RTL support via CSS logical properties (web) and native handling (iOS/Android)

**DesignerPunk Philosophy**: This component does not support disabled states. If an action is unavailable, the component should not be rendered.

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
| `indeterminate_state` | Shows minus icon for partial selection | 1.4.1 |
| `error_state` | Shows error border and message | 3.3.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |
| `form_integration` | Native form submission and reset | 4.1.2 |

---

## Usage

### HTML Custom Element

```html
<!-- Basic usage -->
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
  value="subscribed"
  test-id="newsletter-checkbox"
></input-checkbox-base>

<!-- With error state -->
<input-checkbox-base
  label="I agree to the privacy policy"
  error-message="You must accept the privacy policy to continue"
></input-checkbox-base>

<!-- Indeterminate state (for parent checkboxes) -->
<input-checkbox-base
  label="Select all items"
  indeterminate
></input-checkbox-base>
```

### JavaScript/TypeScript

```typescript
import { InputCheckboxBaseElement } from './platforms/web/InputCheckboxBase.web';

// Programmatic usage
const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
checkbox.label = 'Accept terms';
checkbox.size = 'md';
checkbox.onChange = (checked) => console.log('Checked:', checked);
document.body.appendChild(checkbox);

// Listen for change events
checkbox.addEventListener('change', (event) => {
  const { checked } = (event as CustomEvent).detail;
  console.log('Checkbox changed:', checked);
});
```

### iOS (SwiftUI)

```swift
import DesignerPunk

@State private var isChecked = false

InputCheckboxBase(
    checked: $isChecked,
    label: "Accept terms",
    size: .md,
    labelAlign: .center,
    onChange: { newValue in
        print("Checked: \(newValue)")
    }
)

// With helper text
InputCheckboxBase(
    checked: $isChecked,
    label: "Subscribe to newsletter",
    size: .lg,
    labelAlign: .top,
    helperText: "We'll send weekly updates"
)
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

var isChecked by remember { mutableStateOf(false) }

InputCheckboxBase(
    checked = isChecked,
    onCheckedChange = { isChecked = it },
    label = "Accept terms",
    size = CheckboxSize.Medium,
    labelAlign = LabelAlignment.Center
)

// With error state
InputCheckboxBase(
    checked = isChecked,
    onCheckedChange = { isChecked = it },
    label = "I agree to the privacy policy",
    errorMessage = "You must accept the privacy policy"
)
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | - | Label text (required for accessibility) |
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

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ checked: boolean }` | Fired when checkbox state changes |

---

## Size Variants

| Size | Box Size | Icon Size | Inset | Gap | Typography |
|------|----------|-----------|-------|-----|------------|
| `sm` | 24px | `icon.size050` (16px) | `inset.050` (4px) | `space.grouped.normal` | `labelSm` |
| `md` | 32px | `icon.size075` (20px) | `inset.075` (6px) | `space.grouped.normal` | `labelMd` |
| `lg` | 40px | `icon.size100` (24px) | `inset.100` (8px) | `space.grouped.loose` | `labelLg` |

**Box Size Formula**: `iconSize + (inset × 2)`

---

## States

### Visual States

| State | Background | Border | Icon |
|-------|------------|--------|------|
| Unchecked | Transparent | `color.feedback.select.border.default` | None |
| Checked | `color.feedback.select.background.rest` | `color.feedback.select.border.rest` | Checkmark |
| Indeterminate | `color.feedback.select.background.rest` | `color.feedback.select.border.rest` | Minus |
| Error | (same as above) | `color.feedback.error.border` | (same as above) |

### Interaction States

| State | Platform | Effect |
|-------|----------|--------|
| Hover | Web | Border color darkened via `blend.hoverDarker` (8%) |
| Focus | Web | Focus ring via `:focus-visible` |
| Pressed | iOS | Scale transform via `scale096` (96%) |
| Pressed | Android | Material ripple via `blend.pressedDarker` (12%) |

---

## Token Dependencies

### Typography
- `typography.labelSm` - Small size label
- `typography.labelMd` - Medium size label
- `typography.labelLg` - Large size label
- `typography.caption` - Helper text and error messages

### Color
- `color.feedback.select.background.rest` - Checked/indeterminate background
- `color.feedback.select.border.default` - Unchecked border
- `color.feedback.select.border.rest` - Checked/hover border
- `color.feedback.error.border` - Error state border
- `color.contrast.onDark` - Checkmark/minus icon color
- `color.contrast.onLight` - Label text color

### Spacing
- `inset.050` - Small size internal padding (4px)
- `inset.075` - Medium size internal padding (6px)
- `inset.100` - Large size internal padding (8px)
- `space.grouped.normal` - Gap for sm/md sizes
- `space.grouped.loose` - Gap for lg size

### Border
- `borderEmphasis` - Checkbox border width (2px)
- `radiusSubtle` - Small size corner radius (2px)
- `radiusSmall` - Medium/large size corner radius (4px)

### Motion
- `motion.selectionTransition` - State change animation (250ms)
- `motion.buttonPress` - iOS press feedback (150ms)

### Blend
- `blend.hoverDarker` - Web hover state (8% darker)
- `blend.pressedDarker` - Android ripple (12% darker)

### Scale
- `scale096` - iOS press scale (96%)

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
- State announced as "checked", "unchecked", or "partially checked"
- Error messages associated via `aria-describedby`
- Helper text associated via `aria-describedby`
- `aria-invalid="true"` when error present

---

## Platform-Specific Behavior

### Web
- Shadow DOM for style encapsulation
- Hidden native `<input type="checkbox">` for form compatibility
- CSS logical properties for RTL support
- `:focus-visible` for keyboard-only focus ring
- Hover state with `blend.hoverDarker` border color

### iOS
- SwiftUI implementation with `@Binding` for state
- Scale animation on press (96% via `scale096`)
- Animation timing via `motion.buttonPress`
- Native RTL handling via `leading`/`trailing` alignment
- VoiceOver support with accessibility labels

### Android
- Jetpack Compose implementation
- Material ripple effect on press
- Ripple color via `blend.pressedDarker`
- Native RTL handling via `Arrangement.Start`/`End`
- TalkBack support with semantics

---

## Form Integration

### Form Submission

```html
<form id="signup-form">
  <input-checkbox-base
    label="Accept terms"
    name="terms"
    value="accepted"
  ></input-checkbox-base>
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('terms:', formData.get('terms')); // 'accepted' if checked, null if not
  });
</script>
```

### Form Reset

When a form is reset, the checkbox returns to unchecked state. Pre-checked checkboxes are not supported per DesignerPunk philosophy.

---

## File Structure

```
src/components/core/Input-Checkbox-Base/
├── types.ts                              # Shared type definitions
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── InputCheckboxBase.web.ts      # Web Component implementation
│   │   └── InputCheckboxBase.web.css     # Web styles
│   ├── ios/
│   │   └── InputCheckboxBase.ios.swift   # SwiftUI implementation
│   └── android/
│       └── InputCheckboxBase.android.kt  # Compose implementation
└── __tests__/
    ├── InputCheckboxBase.test.ts         # Unit tests
    └── InputCheckboxBase.stemma.test.ts  # Stemma System validators
```

---

## Related Components

| Component | Relationship |
|-----------|--------------|
| `Input-Checkbox-Legal` | Extends Base for legal consent scenarios |
| `Icon-Base` | Used for checkmark and minus icons |
| `Input-Text-Base` | Sibling in Form Inputs family |

---

## Related Documentation

- [Design Specification](/.kiro/specs/046-input-checkbox-base/design.md)
- [Requirements](/.kiro/specs/046-input-checkbox-base/requirements.md)
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)
- [Token Quick Reference](/.kiro/steering/Token-Quick-Reference.md)

---

**Organization**: component-documentation  
**Scope**: 046-input-checkbox-base
