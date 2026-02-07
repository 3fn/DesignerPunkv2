# Input-Radio-Base Component

**Stemma System**: Form Inputs Family  
**Component Type**: Primitive (Base)  
**Readiness**: 🟡 In Development  
**Version**: 1.0.0

---

## Overview

Input-Radio-Base is a single-selection control for web, iOS, and Android platforms. It provides three size variants, configurable label alignment, and support for selected/unselected states while maintaining WCAG 2.1 AA accessibility compliance.

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Input-Radio-Base`

**Key Features**:
- ✅ Token-based styling (zero hard-coded values)
- ✅ Three size variants (sm, md, lg)
- ✅ Label alignment options (center, top)
- ✅ Circular shape with filled dot indicator
- ✅ Helper text and error message support
- ✅ No Icon-Base dependency (simpler than checkbox)
- ✅ Platform-specific interaction patterns
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)
- ✅ RTL support via CSS logical properties (web) and native handling (iOS/Android)

**DesignerPunk Philosophy**: This component does not support disabled states. If an action is unavailable, the component should not be rendered.

**Key Differences from Checkbox**:
- Single-select (mutual exclusivity within a group) vs multi-select
- Circular shape with filled dot vs rounded square with checkmark
- No indeterminate state (not applicable to radio buttons)
- `value` prop is required (for form submission and group identification)
- `name` prop is important for native radio grouping

---

## Behavioral Contracts

This component guarantees the following behaviors across all platforms:

| Contract | Description | WCAG |
|----------|-------------|------|
| `focusable` | Can receive keyboard focus | 2.1.1 |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 |
| `pressed_state` | Visual feedback when pressed | 2.4.7 |
| `selected_state` | Shows filled dot when selected | 1.4.1 |
| `error_state` | Shows error border and message | 3.3.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |
| `form_integration` | Native form submission | 4.1.2 |

---

## Usage

### HTML Custom Element

```html
<!-- Basic usage -->
<input-radio-base
  label="Option A"
  value="option-a"
></input-radio-base>

<!-- With all attributes -->
<input-radio-base
  label="Premium Plan"
  value="premium"
  name="subscription-plan"
  size="lg"
  label-align="top"
  helper-text="Best value for teams"
  test-id="premium-plan-radio"
></input-radio-base>

<!-- With error state -->
<input-radio-base
  label="I agree to the terms"
  value="agree"
  error-message="You must select an option to continue"
></input-radio-base>

<!-- Selected state -->
<input-radio-base
  label="Standard Plan"
  value="standard"
  selected
></input-radio-base>
```

### JavaScript/TypeScript

```typescript
import { InputRadioBaseElement } from './platforms/web/InputRadioBase.web';

// Programmatic usage
const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
radio.label = 'Option A';
radio.value = 'option-a';
radio.name = 'my-group';
radio.onSelect = (value) => console.log('Selected:', value);
document.body.appendChild(radio);

// Listen for selection events
radio.addEventListener('change', (event) => {
  const { value, selected } = (event as CustomEvent).detail;
  console.log('Radio changed:', value, selected);
});
```

### iOS (SwiftUI)

```swift
import DesignerPunk

@State private var selectedValue: String? = nil

InputRadioBase(
    value: "option-a",
    label: "Option A",
    selectedValue: $selectedValue,
    size: .md,
    labelAlign: .center,
    onSelect: { value in
        print("Selected: \(value)")
    }
)

// With helper text
InputRadioBase(
    value: "premium",
    label: "Premium Plan",
    selectedValue: $selectedValue,
    size: .lg,
    labelAlign: .top,
    helperText: "Best value for teams"
)

// With error state
InputRadioBase(
    value: "agree",
    label: "I agree to the terms",
    selectedValue: $selectedValue,
    errorMessage: "You must select an option"
)
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

var selectedValue by remember { mutableStateOf<String?>(null) }

InputRadioBase(
    value = "option-a",
    label = "Option A",
    selectedValue = selectedValue,
    onSelectedChange = { selectedValue = it },
    size = RadioSize.Medium,
    labelAlign = LabelAlignment.Center
)

// With helper text
InputRadioBase(
    value = "premium",
    label = "Premium Plan",
    selectedValue = selectedValue,
    onSelectedChange = { selectedValue = it },
    size = RadioSize.Large,
    labelAlign = LabelAlignment.Top,
    helperText = "Best value for teams"
)

// With error state
InputRadioBase(
    value = "agree",
    label = "I agree to the terms",
    selectedValue = selectedValue,
    onSelectedChange = { selectedValue = it },
    errorMessage = "You must select an option"
)
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | - | Label text (required for accessibility) |
| `value` | `string` | ✅ Yes | - | Value for form submission and group identification |
| `selected` | `boolean` | No | `false` | Whether radio is selected |
| `name` | `string` | No | - | Radio group name (for native form behavior) |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant |
| `labelAlign` | `'center' \| 'top'` | No | `'center'` | Vertical alignment of label |
| `helperText` | `string` | No | - | Helper text displayed below radio |
| `errorMessage` | `string` | No | - | Error message (triggers error styling) |
| `onSelect` | `(value: string) => void` | No | - | Selection callback |
| `id` | `string` | No | auto-generated | Unique identifier |
| `testID` | `string` | No | - | Test identifier |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string, selected: boolean }` | Fired when radio selection changes |

---

## Size Variants

| Size | Circle Size | Dot Size | Inset | Gap | Typography |
|------|-------------|----------|-------|-----|------------|
| `sm` | 24px | `icon.size050` (16px) | `inset.050` (4px) | `space.grouped.normal` | `labelSm` |
| `md` | 32px | `icon.size075` (20px) | `inset.075` (6px) | `space.grouped.normal` | `labelMd` |
| `lg` | 40px | `icon.size100` (24px) | `inset.100` (8px) | `space.grouped.loose` | `labelLg` |

**Circle Size Formula**: `dotSize + (inset × 2)`
- sm: 16 + (4 × 2) = 24px
- md: 20 + (6 × 2) = 32px
- lg: 24 + (8 × 2) = 40px

---

## States

### Visual States

| State | Circle Background | Circle Border | Dot |
|-------|-------------------|---------------|-----|
| Unselected | Transparent | `color.feedback.select.border.default` | None |
| Selected | Transparent | `color.feedback.select.border.rest` | Filled dot |
| Error | Transparent | `color.feedback.error.border` | (same as above) |

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
- `color.feedback.select.background.rest` - Dot fill color (selected)
- `color.feedback.select.border.default` - Unselected border
- `color.feedback.select.border.rest` - Selected border
- `color.feedback.error.border` - Error state border
- `color.contrast.onLight` - Label text color

### Spacing
- `inset.050` - Small size internal padding (4px)
- `inset.075` - Medium size internal padding (6px)
- `inset.100` - Large size internal padding (8px)
- `space.grouped.normal` - Gap for sm/md sizes (8px)
- `space.grouped.loose` - Gap for lg size (12px)

### Border
- `borderEmphasis` - Radio border width (2px)
- `radius.full` - Fully rounded (circle)

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
| 1.4.1 Use of Color | ✅ | States use dot indicator and borders, not just color |
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
| Tab | Move focus to/from radio |
| Space | Select the focused radio |

### Screen Reader Support

- Label associated via `for`/`id` (web) or accessibility label (native)
- State announced as "selected" or "not selected"
- Error messages associated via `aria-describedby`
- Helper text associated via `aria-describedby`
- `aria-invalid="true"` when error present

---

## Platform-Specific Behavior

### Web
- Shadow DOM for style encapsulation
- Hidden native `<input type="radio">` for form compatibility
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
<form id="plan-form">
  <input-radio-base
    label="Basic Plan"
    name="plan"
    value="basic"
  ></input-radio-base>
  <input-radio-base
    label="Premium Plan"
    name="plan"
    value="premium"
  ></input-radio-base>
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('plan-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('plan:', formData.get('plan')); // 'basic' or 'premium' if selected, null if not
  });
</script>
```

### Form Reset

When a form is reset, the radio returns to unselected state. Pre-selected radios are not supported per DesignerPunk philosophy.

---

## File Structure

```
src/components/core/Input-Radio-Base/
├── types.ts                              # Shared type definitions
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── InputRadioBase.web.ts         # Web Component implementation
│   │   └── InputRadioBase.web.css        # Web styles
│   ├── ios/
│   │   └── InputRadioBase.ios.swift      # SwiftUI implementation
│   └── android/
│       └── InputRadioBase.android.kt     # Compose implementation
└── __tests__/
    ├── InputRadioBase.test.ts            # Unit tests
    └── InputRadioBase.stemma.test.ts     # Stemma System validators
```

---

## Related Components

| Component | Relationship |
|-----------|--------------|
| `Input-Radio-Set` | Orchestrates multiple Base components for group behavior |
| `Input-Checkbox-Base` | Sibling in Form Inputs family (multi-select) |
| `Input-Text-Base` | Sibling in Form Inputs family |

---

## Related Documentation

- [Design Specification](/.kiro/specs/047-input-radio-base/design.md)
- [Requirements](/.kiro/specs/047-input-radio-base/requirements.md)
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)
- [Token Quick Reference](/.kiro/steering/Token-Quick-Reference.md)

---

**Organization**: component-documentation  
**Scope**: 047-input-radio-base
