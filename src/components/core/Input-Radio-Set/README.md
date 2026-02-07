# Input-Radio-Set Component

**Stemma System**: Form Inputs Family  
**Component Type**: Pattern (Set)  
**Readiness**: 🟡 In Development  
**Version**: 1.0.0

---

## Overview

Input-Radio-Set is an orchestrator component that manages a group of Input-Radio-Base children across web, iOS, and Android platforms. It provides mutual exclusivity, keyboard navigation, validation, and error display while maintaining WCAG 2.1 AA accessibility compliance.

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Input-Radio-Set`

**Key Features**:
- ✅ Orchestration pattern (coordinates Base children, never duplicates rendering)
- ✅ Mutual exclusivity (only one radio selected at a time)
- ✅ Keyboard navigation (arrow keys, Home, End, Space)
- ✅ Group-level validation and error display
- ✅ Controlled selection state via `selectedValue`
- ✅ Size propagation to all children
- ✅ WCAG 2.1 AA accessibility compliance (`role="radiogroup"`)
- ✅ True Native Architecture (separate implementations per platform)
- ✅ RTL support via CSS logical properties (web) and native handling (iOS/Android)

**DesignerPunk Philosophy**: This component does not support disabled states. If an action is unavailable, the component should not be rendered.

**Architectural Principle — Orchestration, Not Duplication**:
Input-Radio-Set orchestrates child Input-Radio-Base components. It does NOT duplicate radio circle/dot rendering logic from Base. This ensures:
- ~80% less code than a standalone implementation
- Base improvements automatically benefit Set usage
- Single source of truth for radio rendering

---

## Behavioral Contracts

This component guarantees the following behaviors across all platforms:

| Contract | Description | WCAG |
|----------|-------------|------|
| `mutual_exclusivity` | Only one radio selected at a time | N/A |
| `keyboard_navigation` | Arrow keys navigate within group | 2.1.1 |
| `group_validation` | Required validation at group level | 3.3.1 |
| `error_announcement` | Error message announced to screen readers | 4.1.3 |
| `radiogroup_role` | Proper ARIA role for group | 4.1.2 |

---

## Usage

### HTML Custom Element

```html
<!-- Basic usage -->
<input-radio-set selected-value="option-a">
  <input-radio-base label="Option A" value="option-a"></input-radio-base>
  <input-radio-base label="Option B" value="option-b"></input-radio-base>
  <input-radio-base label="Option C" value="option-c"></input-radio-base>
</input-radio-set>

<!-- With size propagation -->
<input-radio-set size="lg" selected-value="premium">
  <input-radio-base label="Basic Plan" value="basic" helper-text="Free forever"></input-radio-base>
  <input-radio-base label="Premium Plan" value="premium" helper-text="Best value for teams"></input-radio-base>
</input-radio-set>

<!-- With validation and error -->
<input-radio-set required error error-message="Please select a plan">
  <input-radio-base label="Basic Plan" value="basic"></input-radio-base>
  <input-radio-base label="Premium Plan" value="premium"></input-radio-base>
</input-radio-set>
```

### JavaScript/TypeScript

```typescript
import { InputRadioSetElement } from './platforms/web/InputRadioSet.web';

// Programmatic usage
const radioSet = document.createElement('input-radio-set') as InputRadioSetElement;
radioSet.size = 'md';
radioSet.onSelectionChange = (value) => console.log('Selected:', value);

// Add child radios
['Option A', 'Option B', 'Option C'].forEach((label, i) => {
  const radio = document.createElement('input-radio-base');
  radio.setAttribute('label', label);
  radio.setAttribute('value', `option-${i}`);
  radioSet.appendChild(radio);
});

document.body.appendChild(radioSet);

// Read current selection
console.log(radioSet.selectedValue); // 'option-0' or null
```

### iOS (SwiftUI)

```swift
import DesignerPunk

@State private var selectedPlan: String? = nil

InputRadioSet(selectedValue: $selectedPlan, size: .md) {
    InputRadioBase(
        value: "basic",
        label: "Basic Plan",
        selectedValue: $selectedPlan,
        helperText: "Free forever"
    )
    InputRadioBase(
        value: "premium",
        label: "Premium Plan",
        selectedValue: $selectedPlan,
        helperText: "Best value for teams"
    )
}

// With validation
InputRadioSet(
    selectedValue: $selectedPlan,
    required: true,
    error: selectedPlan == nil,
    errorMessage: "Please select a plan"
) {
    InputRadioBase(value: "basic", label: "Basic", selectedValue: $selectedPlan)
    InputRadioBase(value: "premium", label: "Premium", selectedValue: $selectedPlan)
}
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

var selectedPlan by remember { mutableStateOf<String?>(null) }

InputRadioSet(
    selectedValue = selectedPlan,
    onSelectionChange = { selectedPlan = it },
    size = RadioSize.Medium
) {
    InputRadioBase(
        value = "basic",
        label = "Basic Plan",
        selectedValue = selectedPlan,
        onSelectedChange = { selectedPlan = it },
        helperText = "Free forever"
    )
    InputRadioBase(
        value = "premium",
        label = "Premium Plan",
        selectedValue = selectedPlan,
        onSelectedChange = { selectedPlan = it },
        helperText = "Best value for teams"
    )
}

// With validation
InputRadioSet(
    selectedValue = selectedPlan,
    onSelectionChange = { selectedPlan = it },
    required = true,
    error = selectedPlan == null,
    errorMessage = "Please select a plan"
) {
    InputRadioBase(value = "basic", label = "Basic", selectedValue = selectedPlan, onSelectedChange = { selectedPlan = it })
    InputRadioBase(value = "premium", label = "Premium", selectedValue = selectedPlan, onSelectedChange = { selectedPlan = it })
}
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `selectedValue` | `string \| null` | No | `null` | Currently selected value (controlled) |
| `onSelectionChange` | `(value: string \| null) => void` | No | - | Callback when selection changes |
| `required` | `boolean` | No | `false` | Whether a selection is required |
| `error` | `boolean` | No | `false` | Error state indicator |
| `errorMessage` | `string` | No | - | Error message to display |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size variant applied to all children |
| `testID` | `string` | No | - | Test identifier |

### Web Component Attributes

| Attribute | Maps To | Description |
|-----------|---------|-------------|
| `selected-value` | `selectedValue` | Currently selected value |
| `required` | `required` | Whether selection is required |
| `error` | `error` | Error state indicator |
| `error-message` | `errorMessage` | Error message text |
| `size` | `size` | Size variant for all children |
| `test-id` | `testID` | Test identifier |

---

## Keyboard Navigation

Input-Radio-Set implements the WAI-ARIA Radio Group pattern for keyboard interaction:

| Key | Action |
|-----|--------|
| Tab | Enter the radio group (focus lands on selected item, or first item if none selected) |
| Tab (again) | Exit the radio group |
| Arrow Down / Arrow Right | Move focus to the next radio |
| Arrow Up / Arrow Left | Move focus to the previous radio |
| Space | Select the focused radio |
| Home | Move focus to the first radio |
| End | Move focus to the last radio |

### Wrap-Around Behavior

- Pressing Arrow Down on the last radio wraps focus to the first radio
- Pressing Arrow Up on the first radio wraps focus to the last radio

### Roving Tabindex

The Set uses the roving tabindex pattern: only one radio within the group participates in the tab order at a time. This means a single Tab press enters the group, and a second Tab press exits it entirely.

---

## Validation and Error Handling

### Required Validation

When `required` is true and no radio is selected, validation fails. The consuming application controls when to display the error:

```html
<!-- Error state managed by application logic -->
<input-radio-set required error error-message="Please select an option">
  <input-radio-base label="Option A" value="a"></input-radio-base>
  <input-radio-base label="Option B" value="b"></input-radio-base>
</input-radio-set>
```

### Error Display

- Error message renders above the radio group
- Error message uses `role="alert"` for immediate screen reader announcement
- Error styling is applied to the container when `error` is true

### Mutual Exclusivity

- Selecting a radio automatically deselects the previously selected radio
- Clicking an already-selected radio does NOT deselect it (standard radio convention)
- The `onSelectionChange` callback fires only when the selection actually changes

---

## Orchestration Pattern

### How Set Coordinates Base Children

Input-Radio-Set does not render radio circles or dots. It delegates all visual rendering to its Input-Radio-Base children and focuses on group-level concerns:

| Responsibility | Owner |
|----------------|-------|
| Radio circle and dot rendering | Input-Radio-Base |
| Hover, focus, and press states | Input-Radio-Base |
| Label and helper text display | Input-Radio-Base |
| Mutual exclusivity | Input-Radio-Set |
| Keyboard navigation | Input-Radio-Set |
| Group validation | Input-Radio-Set |
| Error message display | Input-Radio-Set |
| Size propagation | Input-Radio-Set |

### Platform-Specific State Coordination

| Platform | Mechanism | Description |
|----------|-----------|-------------|
| Web | Slot-based composition | Children rendered via `<slot>`, Set listens for selection events |
| iOS | Environment values | Selection state passed to children via SwiftUI environment |
| Android | CompositionLocal | Selection state passed to children via CompositionLocalProvider |

---

## Accessibility

### WCAG 2.1 AA Compliance

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| 1.3.1 Info and Relationships | ✅ | `role="radiogroup"` groups related radios |
| 2.1.1 Keyboard | ✅ | Full keyboard navigation (arrows, Tab, Space, Home, End) |
| 2.4.7 Focus Visible | ✅ | Focus ring on active radio within group |
| 3.3.1 Error Identification | ✅ | Error message with `role="alert"` |
| 4.1.2 Name, Role, Value | ✅ | Proper ARIA radiogroup role and state |
| 4.1.3 Status Messages | ✅ | Error messages announced via `role="alert"` |

### Screen Reader Support

- Group announced as "radiogroup" with associated label
- Individual radios announce "selected" or "not selected" state
- Error messages announced immediately via `role="alert"`
- Navigation context provided (e.g., "2 of 3")

---

## Platform-Specific Behavior

### Web
- Shadow DOM with `<slot>` for child composition
- `role="radiogroup"` on container
- Roving tabindex for keyboard navigation
- Error message with `role="alert"`
- CSS logical properties for RTL support

### iOS
- SwiftUI `VStack` with `@ViewBuilder` content
- Selection state passed via environment values
- `.accessibilityElement(children: .contain)` for group
- Error message with accessibility label
- Native RTL handling

### Android
- Jetpack Compose `Column` with `CompositionLocalProvider`
- Selection state passed via `CompositionLocal`
- `role = Role.RadioGroup` semantics
- Error message with `liveRegion = LiveRegionMode.Polite`
- Native RTL handling

---

## File Structure

```
src/components/core/Input-Radio-Set/
├── types.ts                              # Shared type definitions
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── InputRadioSet.web.ts          # Web Component implementation
│   │   └── InputRadioSet.web.css         # Web styles
│   ├── ios/
│   │   └── InputRadioSet.ios.swift       # SwiftUI implementation
│   └── android/
│       └── InputRadioSet.android.kt      # Compose implementation
└── __tests__/
    ├── InputRadioSet.test.ts             # Unit tests
    └── InputRadioSet.stemma.test.ts      # Stemma System validators
```

---

## Related Components

| Component | Relationship |
|-----------|--------------|
| `Input-Radio-Base` | Primitive child component orchestrated by this Set |
| `Input-Checkbox-Base` | Sibling in Form Inputs family (multi-select) |
| `Input-Text-Base` | Sibling in Form Inputs family |

---

## Related Documentation

- [Input-Radio-Base README](../Input-Radio-Base/README.md)
- [Design Specification](/.kiro/specs/047-input-radio-base/design.md)
- [Requirements](/.kiro/specs/047-input-radio-base/requirements.md)
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)
- [Token Quick Reference](/.kiro/steering/Token-Quick-Reference.md)

---

**Organization**: component-documentation  
**Scope**: 047-input-radio-base
