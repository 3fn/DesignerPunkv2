# Button-VerticalList-Item Component

**Stemma System**: Buttons Family  
**Component Type**: Primitive (VerticalList-Item)  
**Readiness**: 🟢 Production Ready  
**Version**: 1.1.0

---

## Overview

The Button-VerticalList-Item component is a "dumb" presentational button designed for vertical list selection patterns. It renders visual states based on props received from a parent container, handling no selection logic internally. This enables flexible composition for Tap, Select (single-selection), and Multi-Select (checkbox-style) patterns.

**Stemma System Naming**: This component follows the `[Family]-[Type]` naming convention:
- **Family**: Button
- **Type**: VerticalList-Item (vertical list selection item)

**Key Design Decision**: This is a presentational component — all selection state management is delegated to the parent pattern. The component simply renders the visual state it's told to display.

---

## Key Features

- ✅ Token-based styling (zero hard-coded values)
- ✅ Five visual states (rest, selected, notSelected, checked, unchecked)
- ✅ Optional leading icons with optical balance
- ✅ Optional description text below label
- ✅ Animated checkmark with configurable transitions
- ✅ Error state support with mode-specific styling
- ✅ Padding compensation for height stability during state transitions
- ✅ CSS logical properties for RTL support
- ✅ Platform-specific interaction patterns
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)
- ❌ No disabled state (by design—see Design Decisions)

---

## Behavioral Contracts

This component guarantees the following behaviors across all platforms:

| Contract | Description | Platforms | WCAG |
|----------|-------------|-----------|------|
| `focusable` | Can receive keyboard focus | web, ios, android | 2.1.1, 2.4.7 |
| `pressable` | Responds to press/click events | web, ios, android | 2.1.1 |
| `hover_state` | Visual feedback on hover | web | 1.4.13 |
| `pressed_state` | Visual feedback when pressed | web, ios, android | 2.4.7 |
| `visual_state_driven` | Renders appearance based on visualState prop | web, ios, android | - |
| `checkmark_animation` | Animated selection indicator | web, ios, android | 2.3.3 |
| `error_state_display` | Shows error styling when error=true | web, ios, android | 3.3.1, 1.4.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | web, ios, android | 2.4.7 |

---

## Usage

### HTML Custom Element

```html
<!-- Basic usage (Tap mode) -->
<button-vertical-list-item
  label="Settings"
  visual-state="rest"
></button-vertical-list-item>

<!-- With description and leading icon -->
<button-vertical-list-item
  label="Dark Mode"
  description="Automatically switch to dark mode at sunset"
  leading-icon="moon"
  visual-state="rest"
></button-vertical-list-item>

<!-- Select mode - selected state -->
<button-vertical-list-item
  label="Option A"
  description="This is the first option"
  visual-state="selected"
></button-vertical-list-item>

<!-- Multi-Select mode - checked state -->
<button-vertical-list-item
  label="Enable notifications"
  visual-state="checked"
></button-vertical-list-item>

<!-- With error state -->
<button-vertical-list-item
  label="Required Option"
  visual-state="unchecked"
  error="true"
></button-vertical-list-item>

<!-- With all attributes -->
<button-vertical-list-item
  label="Account Settings"
  description="Manage your account preferences"
  leading-icon="user"
  visual-state="selected"
  error="false"
  checkmark-transition="fade"
  transition-delay="0"
  test-id="account-settings-option"
></button-vertical-list-item>
```

### JavaScript/TypeScript

```typescript
import { ButtonVerticalListItem } from '@designerpunk/components/Button-VerticalList-Item';

// Programmatic usage
const item = document.createElement('button-vertical-list-item') as ButtonVerticalListItem;
item.label = 'Settings';
item.description = 'Configure your preferences';
item.leadingIcon = 'settings';
item.visualState = 'rest';
item.onClick = () => console.log('Clicked');
document.body.appendChild(item);

// Update visual state (parent pattern controls this)
item.visualState = 'selected';
```

### iOS (SwiftUI)

```swift
import DesignerPunk

// Basic usage
ButtonVerticalListItem(
    label: "Settings",
    visualState: .rest
) {
    handleTap()
}

// With all options
ButtonVerticalListItem(
    label: "Dark Mode",
    description: "Automatically switch to dark mode at sunset",
    leadingIcon: "moon",
    visualState: .selected,
    error: false,
    checkmarkTransition: .fade
) {
    handleSelect()
}
```

### Android (Jetpack Compose)

```kotlin
import com.designerpunk.components

// Basic usage
ButtonVerticalListItem(
    label = "Settings",
    visualState = VisualState.Rest,
    onClick = { handleTap() }
)

// With all options
ButtonVerticalListItem(
    label = "Dark Mode",
    description = "Automatically switch to dark mode at sunset",
    leadingIcon = "moon",
    visualState = VisualState.Selected,
    error = false,
    checkmarkTransition = CheckmarkTransition.Fade,
    onClick = { handleSelect() }
)
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | - | Button text label |
| `description` | `string` | No | - | Secondary text below label |
| `leadingIcon` | `IconBaseName` | No | - | Optional leading icon |
| `visualState` | `VisualState` | ✅ Yes | - | Visual state (controlled by parent) |
| `error` | `boolean` | No | `false` | Error state indicator |
| `checkmarkTransition` | `'fade' \| 'instant'` | No | `'fade'` | Checkmark hide transition |
| `transitionDelay` | `number` | No | `0` | Transition delay in ms |
| `onClick` | `() => void` | No | - | Click/tap handler |
| `onFocus` | `() => void` | No | - | Focus handler |
| `onBlur` | `() => void` | No | - | Blur handler |
| `testID` | `string` | No | - | Test identifier |

**Note**: There is no `disabled` prop. See [Design Decisions](#no-disabled-state) for rationale and alternatives.

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `click` | `{}` | Fired when button is clicked or activated via keyboard |

---

## Visual States

The `visualState` prop determines the button's appearance. Different states are used in different selection modes:

| State | Mode | Background | Border | Checkmark | Use Case |
|-------|------|------------|--------|-----------|----------|
| `rest` | Tap/Initial | `color.background` | `borderDefault` (1px) | Hidden | Default state, simple actions |
| `selected` | Select | `color.select.selected.subtle` | `borderEmphasis` (2px) `color.select.selected.strong` | Visible | Active selection (single-select) |
| `notSelected` | Select | `color.select.notSelected.subtle` | `borderDefault` (1px) `color.select.notSelected.strong` | Hidden | Inactive when another is selected |
| `checked` | Multi-Select | `color.background` | `borderDefault` (1px) | Visible | Checked item (checkbox-style) |
| `unchecked` | Multi-Select | `color.background` | `borderDefault` (1px) | Hidden | Unchecked item (checkbox-style) |

### Selection Mode Patterns

**Tap Mode**: Uses `rest` state only — simple action buttons without selection.

**Select Mode** (single-selection, radio-style):
- Initial: All items in `rest` state
- After selection: Selected item → `selected`, others → `notSelected`

**Multi-Select Mode** (checkbox-style):
- Items toggle between `checked` and `unchecked`
- Multiple items can be `checked` simultaneously

---

## Error State Behavior

The `error` prop applies error styling, but the treatment differs by mode:

| Mode | Error Treatment |
|------|-----------------|
| **Select mode** (`rest`, `selected`, `notSelected`) | Full error treatment: `color.error.subtle` background, `borderEmphasis` (2px) border, `color.error.strong` border/text colors |
| **Multi-Select mode** (`checked`, `unchecked`) | Text/icon colors only change to `color.error.strong` (no border/background change) |
| **Tap mode** (`rest` only) | Error prop has no effect |

---

## Token Dependencies

### Typography
- `typography.buttonMd` - Label text
- `typography.bodySm` - Description text

### Color
- `color.background` - Default background
- `color.text.default` - Label text (default)
- `color.text.muted` - Description text
- `color.select.selected.strong` - Selected state border/text
- `color.select.selected.subtle` - Selected state background
- `color.select.notSelected.strong` - Not-selected state border/text
- `color.select.notSelected.subtle` - Not-selected state background
- `color.error.strong` - Error state border/text
- `color.error.subtle` - Error state background

### Border
- `borderDefault` - 1px default border
- `borderEmphasis` - 2px emphasis border (selected/error states)

### Radius
- `radiusNormal` - 8px border radius

### Spacing
- `space.inset.200` - Inline padding (16px)
- `space.grouped.loose` - Icon-to-content gap (16px)

### Component Tokens
- `verticalListItem.paddingBlock.rest` - 11px (rest state padding)
- `verticalListItem.paddingBlock.selected` - 10px (selected state padding)

### Motion
- `motion.selectionTransition` - 250ms checkmark animation

### Blend
- `blend.hoverDarker` - Hover state (8% darker)
- `blend.pressedDarker` - Pressed state (12% darker)

### Accessibility
- `tapAreaRecommended` - 48px minimum touch target
- `accessibility.focus.width` - 2px focus ring width
- `accessibility.focus.offset` - 2px focus ring offset
- `accessibility.focus.color` - Focus ring color

---

## Height Stability (Padding Compensation)

The component maintains a constant 48px height during state transitions using padding compensation:

| State | Border | Padding | Content | Total |
|-------|--------|---------|---------|-------|
| Rest (1px border) | 1px × 2 = 2px | 11px × 2 = 22px | 24px | **48px** |
| Selected (2px border) | 2px × 2 = 4px | 10px × 2 = 20px | 24px | **48px** |

This prevents layout shift when transitioning between states with different border widths.

---

## Accessibility

### WCAG 2.1 AA Compliance

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| 1.4.1 Use of Color | ✅ | Visual states use border/background, not just color |
| 1.4.3 Contrast | ✅ | All text meets 4.5:1 contrast ratio |
| 1.4.11 Non-text Contrast | ✅ | Focus ring meets 3:1 contrast ratio |
| 2.1.1 Keyboard | ✅ | Fully keyboard accessible (Tab, Enter, Space) |
| 2.3.3 Animation | ✅ | Respects prefers-reduced-motion |
| 2.4.7 Focus Visible | ✅ | Clear focus indicator with :focus-visible |
| 2.5.5 Target Size | ✅ | Touch targets meet 48px minimum |
| 3.3.1 Error Identification | ✅ | Error state provides visual indication |
| 4.1.2 Name, Role, Value | ✅ | Proper ARIA attributes |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to/from button |
| Enter | Activate button |
| Space | Activate button |

### Screen Reader Support

- Semantic `<button>` element provides implicit role
- `aria-label` set from label prop
- Checkmark icon marked as decorative (`aria-hidden="true"`)
- State changes announced to assistive technology

---

## Design Decisions

### No Disabled State

Button-VerticalList-Item intentionally does not support a `disabled` prop.

**Rationale**:
- Disabled buttons remove affordance without explanation
- Screen reader users may not understand *why* something is disabled
- Disabled states often have poor contrast (ironic for accessibility)

**Alternative Patterns**:

1. **Hide unavailable options**: If an option isn't available, don't show it
   ```html
   <!-- Instead of disabled button -->
   {isOptionAvailable && <button-vertical-list-item label="Option" ... />}
   ```

2. **Show validation messaging**: Keep button enabled, show error on interaction
   ```typescript
   item.onClick = () => {
     if (!isValid) {
       showError('Please complete the required fields first');
       return;
     }
     handleSelection();
   };
   ```

### Presentational Component Pattern

The component is intentionally "dumb" — it renders visual states but doesn't manage selection logic.

**Benefits**:
- Parent pattern has full control over selection behavior
- Same component works for Tap, Select, and Multi-Select modes
- Easier to test (visual output is deterministic based on props)
- Enables complex selection patterns (e.g., max selections, dependencies)

### Checkmark Transition Options

The `checkmarkTransition` prop controls how the checkmark hides:
- `fade`: Smooth 250ms fade-out (default, good for single-select)
- `instant`: Immediate hide (better for rapid multi-select toggling)

Note: Checkmark always fades IN regardless of this setting.

---

## Platform-Specific Behavior

### Web
- Hover state with blend utility color transition
- `:focus-visible` for keyboard-only focus ring
- Shadow DOM for style encapsulation
- CSS logical properties for RTL support
- Fail-loudly token validation on mount
- Custom element tag: `<button-vertical-list-item>`

### iOS
- Scale animation on press (0.97 scale)
- `.accessibilityLabel()` for VoiceOver support
- SwiftUI state-driven rendering

### Android
- Material ripple effect on press
- `contentDescription` for TalkBack accessibility
- Jetpack Compose state-driven rendering

---

## File Structure

```
src/components/core/Button-VerticalList-Item/
├── Button-VerticalList-Item.tokens.ts    # Component-specific tokens
├── types.ts                              # Shared type definitions
├── index.ts                              # Module exports
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── ButtonVerticalListItem.web.ts      # Web Component implementation
│   │   ├── ButtonVerticalListItem.styles.css  # Web styles
│   │   └── visualStateMapping.ts              # Visual state → styles mapping
│   ├── ios/
│   │   └── ButtonVerticalListItem.swift       # SwiftUI implementation
│   └── android/
│       └── ButtonVerticalListItem.kt          # Compose implementation
└── __tests__/
    ├── ButtonVerticalListItem.unit.test.ts        # Unit tests
    ├── ButtonVerticalListItem.alignment.test.ts   # Alignment tests
    ├── ButtonVerticalListItem.integration.test.ts # Integration tests
    └── ButtonVerticalListItem.properties.test.ts  # Property tests
```

---

## Related Documentation

- [Button-CTA Component](../Button-CTA/README.md) - Text button with similar style matrix
- [Button-Icon Component](../Button-Icon/README.md) - Icon-only button
- [Icon-Base Component](../Icon-Base/README.md) - Icon rendering component used internally
- [Component Quick Reference](/.kiro/steering/Component-Quick-Reference.md)

---

*This component is part of the DesignerPunk Design System, following Stemma System principles for cross-platform consistency and AI-optimal discoverability.*
