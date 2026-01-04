---
inclusion: manual
---

# Buttons Components

**Date**: 2026-01-02
**Purpose**: MCP-queryable documentation for Buttons component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, button-implementation
**Last Reviewed**: 2026-01-02

---

## Family Overview

**Family**: Buttons
**Shared Need**: User interaction and actions
**Readiness**: 🟢 Production Ready

### Purpose

The Buttons family provides interactive components for triggering user actions with clear visual hierarchy and comprehensive interaction states. All components implement consistent press, hover, and focus behaviors with WCAG 2.1 AA accessibility compliance.

### Key Characteristics

- **Visual Hierarchy**: Three visual variants (primary, secondary, tertiary) establish clear action hierarchy
- **Size Variants**: Three sizes (small, medium, large) for different contexts and emphasis levels
- **Interaction States**: Comprehensive hover, pressed, disabled, and loading states
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Cross-Platform Consistent**: Platform-appropriate feedback (ripple on Android, scale on iOS)

### Stemma System Integration

- **Standalone Component**: Button-CTA (no behavioral variants, styling via props)
- **Semantic Variants**: 0 implemented (styling handled via `variant` prop)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Button-CTA (Standalone)
    │
    └── Styling via `variant` prop:
        ├── primary (filled background, highest emphasis)
        ├── secondary (outlined, medium emphasis)
        └── tertiary (text-only, lowest emphasis)
```

### Standalone Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Button-CTA | Standalone | 🟢 Production Ready | Call-to-action button with visual variants via props |

### Naming Convention Note

Button-CTA uses the `[Family]-[Type]` pattern without a variant suffix because it has no behavioral variants—only styling variations controlled via the `variant` prop. This follows the Stemma System principle that variant suffixes are reserved for components with distinct behavioral differences.

---

## Behavioral Contracts

### Base Contracts

All Button-CTA instances implement these 7 foundational contracts:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `focusable` | Can receive keyboard focus | 2.1.1, 2.4.7 | web, ios, android |
| `pressable` | Responds to press/click events | 2.1.1 | web, ios, android |
| `hover_state` | Visual feedback on hover (desktop) | 1.4.13 | web |
| `pressed_state` | Visual feedback when pressed | 2.4.7 | web, ios, android |
| `disabled_state` | Prevents interaction when disabled | 4.1.2 | web, ios, android |
| `loading_state` | Shows loading indicator during async | 4.1.3 | web, ios, android |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 | web, ios, android |

### Contract Details

#### focusable

**Description**: Component can receive keyboard focus via Tab key navigation.

**Behavior**: Focus state is visually indicated with a focus ring. Focus is managed appropriately when disabled state changes. Disabled buttons are not keyboard focusable.

**WCAG Compliance**: 2.1.1 Keyboard, 2.4.7 Focus Visible

#### pressable

**Description**: Component responds to click, tap, Enter key, and Space key.

**Behavior**: Press triggers the onPress callback when not disabled. Platform-appropriate feedback is provided during press (ripple on Android, scale on iOS).

**WCAG Compliance**: 2.1.1 Keyboard

#### hover_state

**Description**: Visual feedback on hover (desktop only).

**Behavior**: On desktop platforms, component shows visual feedback when mouse hovers over the button. Uses `blend.hoverDarker` token (8% darker) for primary variant background color change.

**WCAG Compliance**: 1.4.13 Content on Hover or Focus

#### pressed_state

**Description**: Visual feedback when pressed.

**Behavior**: Component shows visual feedback during active press/click. Uses `blend.pressedDarker` token (12% darker). Platform-specific feedback: Web uses background color change, iOS uses scale animation with haptic feedback, Android uses ripple effect with haptic feedback.

**WCAG Compliance**: 2.4.7 Focus Visible

#### disabled_state

**Description**: Prevents interaction when disabled.

**Behavior**: When disabled, component cannot receive focus, cannot be clicked/tapped, uses desaturated colors (`blend.disabledDesaturate` - 12% less saturated), shows `cursor: not-allowed` (web), and communicates disabled state to assistive technology.

**WCAG Compliance**: 4.1.2 Name, Role, Value

#### focus_ring

**Description**: WCAG 2.4.7 focus visible indicator.

**Behavior**: When focused via keyboard, component displays 2px focus ring with 2px offset using `accessibility.focus.*` tokens. Focus ring visible in all visual variants. Uses `:focus-visible` (web) for keyboard-only focus indication.

**WCAG Compliance**: 2.4.7 Focus Visible

---

## Component Schemas

### Button-CTA

**Type**: Standalone
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Button text label (action-oriented) |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Button size variant |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | No | `'primary'` | Visual variant for hierarchy |
| `icon` | `IconName` | No | - | Optional leading icon |
| `noWrap` | `boolean` | No | `false` | Truncate text instead of wrapping |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `onPress` | `() => void` | Yes | - | Press callback |
| `testID` | `string` | No | - | Test identifier |

#### Size Variants

| Size | Height | Touch Target | Min Width | Typography | Icon Size |
|------|--------|--------------|-----------|------------|-----------|
| small | 40px | 44px | 56px | labelMd | 24px |
| medium | 48px | 48px | 72px | labelMd | 24px |
| large | 56px | 56px | 80px | labelLg | 32px |

#### Visual Variants

| Variant | Background | Text | Border | Emphasis |
|---------|------------|------|--------|----------|
| primary | color.primary | color.text.onPrimary | none | highest |
| secondary | color.background | color.primary | 1px color.primary | medium |
| tertiary | transparent | color.primary | none | lowest |

#### Usage Example

```html
<!-- Web -->
<button-cta
  label="Get Started"
  variant="primary"
  size="large"
></button-cta>

<button-cta
  label="Learn More"
  variant="secondary"
></button-cta>

<button-cta
  label="Cancel"
  variant="tertiary"
></button-cta>
```

```swift
// iOS
ButtonCTA(
    label: "Get Started",
    variant: .primary,
    size: .large,
    onPress: { /* action */ }
)
```

```kotlin
// Android
ButtonCTA(
    label = "Get Started",
    variant = ButtonVariant.Primary,
    size = ButtonSize.Large,
    onPress = { /* action */ }
)
```

---

## Token Dependencies

### Required Tokens

Components in the Buttons family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.button.*` | Button text sizing |
| Typography | `typography.labelMd`, `typography.labelLg` | Label typography |
| Color | `color.primary` | Primary button background |
| Color | `color.text.onPrimary` | Text on primary background |
| Color | `color.text.primary` | Secondary/tertiary text |
| Color | `color.background` | Secondary button background |
| Color | `color.border` | Secondary button border |
| Spacing | `space.inset.*` | Button padding |
| Spacing | `space.inline.100` | Icon-label gap |
| Motion | `motion.button.press` | Press animation timing |
| Motion | `motion.button.hover` | Hover transition timing |
| Border | `border.button.default` | Border width |
| Border | `radius.100`, `radius.150` | Border radius |
| Accessibility | `accessibility.tapArea.recommended` | Touch target (48px) |
| Accessibility | `accessibility.focus.*` | Focus ring styling |
| Icon | `icon.size100`, `icon.size125` | Icon sizing |
| Blend | `blend.hoverDarker` | Hover state (8% darker) |
| Blend | `blend.pressedDarker` | Pressed state (12% darker) |
| Blend | `blend.disabledDesaturate` | Disabled state (12% less saturated) |

### Token Resolution

Button components resolve tokens through the Rosetta System's semantic-to-primitive hierarchy. Color tokens resolve to theme-aware values supporting light/dark modes. Blend tokens provide consistent state modifications across platforms.

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md) - Token routing table
- [Blend Tokens](./Token-Family-Blend.md) - Blend token details

---

## Usage Guidelines

### When to Use Buttons

**Use Button components when**:
- Triggering user actions (submit, save, cancel)
- Navigating to new views or pages
- Opening modals or dialogs
- Confirming or dismissing operations

**Do NOT use Button components when**:
- Displaying read-only status (use Badges instead)
- Creating inline text links (use Link component when available)
- Building toggle controls (use Toggle component when available)

### Visual Variant Selection

| Scenario | Recommended Variant | Rationale |
|----------|---------------------|-----------|
| Primary action (submit, save) | primary | Highest visual emphasis |
| Secondary action (cancel, back) | secondary | Medium emphasis, clear alternative |
| Tertiary action (skip, dismiss) | tertiary | Lowest emphasis, de-emphasized |
| Destructive action | primary (with error color) | High emphasis for important action |

### Common Patterns

#### Form Actions

```html
<!-- Web -->
<div class="form-actions">
  <button-cta label="Save Changes" variant="primary"></button-cta>
  <button-cta label="Cancel" variant="tertiary"></button-cta>
</div>
```

#### Dialog Actions

```html
<!-- Web -->
<div class="dialog-actions">
  <button-cta label="Confirm" variant="primary"></button-cta>
  <button-cta label="Cancel" variant="secondary"></button-cta>
</div>
```

### Accessibility Considerations

- **Keyboard Navigation**: All buttons are fully keyboard accessible (Tab, Enter, Space)
- **Focus Visibility**: Clear focus indicators meet WCAG 2.4.7 requirements
- **Color Independence**: Visual variants use shape/border, not just color
- **Touch Targets**: All sizes meet 44px minimum touch target requirement
- **Screen Reader Support**: Proper ARIA attributes for state announcements

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/ButtonCTA.web.ts` |
| iOS | SwiftUI | `platforms/ios/ButtonCTA.ios.swift` |
| Android | Jetpack Compose | `platforms/android/ButtonCTA.android.kt` |

### Platform-Specific Behaviors

#### Web

- Uses Shadow DOM for style encapsulation
- Custom element registration: `<button-cta>`
- Uses `:focus-visible` for keyboard-only focus indication
- Hover state via CSS `:hover` pseudo-class

#### iOS

- SwiftUI Button with custom styling
- Haptic feedback via UIImpactFeedbackGenerator
- Scale animation on press
- Safe area handling for edge-to-edge layouts

#### Android

- Jetpack Compose Button with custom styling
- Haptic feedback via HapticFeedback
- Ripple effect on press
- Material Design integration

### Behavioral Consistency

All platforms implement the same behavioral contracts:
- Press feedback timing matches across platforms
- Disabled state appearance is mathematically equivalent
- Focus ring appearance is consistent
- Touch targets meet platform guidelines

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Button-CTA Schema](../../../src/components/core/Button-CTA/Button-CTA.schema.yaml) - Full schema definition
