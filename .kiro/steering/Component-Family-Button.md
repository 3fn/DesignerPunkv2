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
**Last Reviewed**: 2026-01-25

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

Button-Icon (Standalone)
    │
    └── Icon-only button with size variants

Button-VerticalList-Set (Container/Orchestrator)
    │
    └── Manages selection behavior across modes:
        ├── tap (action buttons, no selection)
        ├── select (single-selection, radio-style)
        └── multiSelect (multiple-selection, checkbox-style)
    │
    └── Contains: Button-VerticalList-Item children

Button-VerticalList-Item (Presentational)
    │
    └── Visual states controlled by parent:
        ├── rest (default state)
        ├── selected (single-select active)
        ├── notSelected (single-select inactive)
        ├── checked (multi-select active)
        └── unchecked (multi-select inactive)
```

### Component Overview

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Button-CTA | Standalone | 🟢 Production Ready | Call-to-action button with visual variants via props |
| Button-Icon | Standalone | 🟢 Production Ready | Icon-only button with size variants |
| Button-VerticalList-Set | Container | 🟢 Production Ready | Orchestrator for vertical list selection patterns |
| Button-VerticalList-Item | Presentational | 🟢 Production Ready | Child item for vertical list selection |

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
| primary | color.action.primary | color.contrast.onDark | none | highest |
| secondary | color.structure.canvas | color.action.primary | 1px color.action.primary | medium |
| tertiary | transparent | color.action.primary | none | lowest |

#### Emphasis Prop Guidance

The `variant` prop controls **visual emphasis**, not action type. Both primary and secondary variants can be CTAs — the distinction is about visual hierarchy:

| Emphasis Level | Variant | When to Use | Example |
|----------------|---------|-------------|---------|
| **Highest** | `primary` | Single, focused instances — hero moments, main CTAs | "Get Started" on landing page |
| **Medium** | `secondary` | Alternative actions, clear secondary options | "Cancel" next to "Save" |
| **Lowest** | `tertiary` | De-emphasized actions, repetitive instances | "Skip" or "Learn More" links |

**Avoiding "Purple-ication"**: Use `primary` sparingly. When multiple CTAs appear together (e.g., action lists), use `secondary` to avoid overwhelming the UI with high-emphasis purple buttons.

```html
<!-- ✅ Good: Single hero CTA uses primary -->
<button-cta label="Get Started" variant="primary"></button-cta>

<!-- ✅ Good: List of actions uses secondary to avoid visual overload -->
<div class="action-list">
  <button-cta label="Edit Profile" variant="secondary"></button-cta>
  <button-cta label="Change Password" variant="secondary"></button-cta>
  <button-cta label="Manage Notifications" variant="secondary"></button-cta>
</div>

<!-- ❌ Avoid: Multiple primary buttons compete for attention -->
<div class="action-list">
  <button-cta label="Edit Profile" variant="primary"></button-cta>
  <button-cta label="Change Password" variant="primary"></button-cta>
</div>
```

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

### Button-VerticalList-Set

**Type**: Container/Orchestrator
**Status**: 🟢 Production Ready
**Inherits**: None

#### Purpose

Container component that orchestrates selection behavior across child Button-VerticalList-Item components. Manages three interaction modes (tap, select, multiSelect), coordinates animation timing, handles keyboard navigation, and provides accessibility semantics.

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `mode` | `'tap' \| 'select' \| 'multiSelect'` | Yes | - | Selection mode |
| `selectedIndex` | `number \| null` | No | `null` | Selected index (Select mode) |
| `selectedIndices` | `number[]` | No | `[]` | Selected indices (MultiSelect mode) |
| `required` | `boolean` | No | `false` | Selection required (Select mode) |
| `minSelections` | `number` | No | - | Minimum selections (MultiSelect mode) |
| `maxSelections` | `number` | No | - | Maximum selections (MultiSelect mode) |
| `error` | `boolean` | No | `false` | Error state indicator |
| `errorMessage` | `string` | No | - | Error message to display |
| `onItemClick` | `(index: number) => void` | No | - | Item click callback (Tap mode) |
| `onSelectionChange` | `(index: number \| null) => void` | No | - | Selection change callback (Select mode) |
| `onMultiSelectionChange` | `(indices: number[]) => void` | No | - | Multi-selection change callback (MultiSelect mode) |
| `testID` | `string` | No | - | Test identifier |

#### Behavioral Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `mode_driven` | Behavior determined by mode prop | - |
| `controlled_state` | Selection state managed by parent via props | - |
| `state_coordination` | Derives and propagates visual states to children | - |
| `animation_coordination` | Coordinates transition timing across children | 2.3.3 |
| `keyboard_navigation` | Arrow keys, Home, End, Enter, Space support | 2.1.1 |
| `roving_tabindex` | Single tab stop with arrow key navigation | 2.4.3 |
| `error_propagation` | Error state propagates to all children | 3.3.1 |
| `aria_roles` | Appropriate ARIA roles based on mode | 4.1.2 |

#### Usage Example

```html
<!-- Web - Select mode -->
<button-vertical-list-set mode="select" selected-index="0" required>
  <button-vertical-list-item label="Option A"></button-vertical-list-item>
  <button-vertical-list-item label="Option B"></button-vertical-list-item>
  <button-vertical-list-item label="Option C"></button-vertical-list-item>
</button-vertical-list-set>
```

```swift
// iOS
@State private var selectedOption: Int? = 0

ButtonVerticalListSet(
    mode: .select,
    selectedIndex: $selectedOption,
    required: true
) {
    ButtonVerticalListItem(label: "Option A")
    ButtonVerticalListItem(label: "Option B")
    ButtonVerticalListItem(label: "Option C")
}
```

```kotlin
// Android
var selectedOption by remember { mutableStateOf<Int?>(0) }

ButtonVerticalListSet(
    mode = SelectionMode.Select,
    selectedIndex = selectedOption,
    onSelectionChange = { index -> selectedOption = index },
    required = true
) {
    ButtonVerticalListItem(label = "Option A")
    ButtonVerticalListItem(label = "Option B")
    ButtonVerticalListItem(label = "Option C")
}
```

---

### Button-VerticalList-Item

**Type**: Presentational
**Status**: 🟢 Production Ready
**Inherits**: None

#### Purpose

Presentational button component for vertical list selection patterns. Renders visual states based on props received from parent container (Button-VerticalList-Set), handling no selection logic internally.

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Button text label |
| `description` | `string` | No | - | Secondary text below label |
| `leadingIcon` | `IconName` | No | - | Optional leading icon |
| `visualState` | `'rest' \| 'selected' \| 'notSelected' \| 'checked' \| 'unchecked'` | Yes | - | Visual state (controlled by parent) |
| `error` | `boolean` | No | `false` | Error state indicator |
| `checkmarkTransition` | `'fade' \| 'instant'` | No | `'fade'` | Checkmark hide transition |
| `transitionDelay` | `number` | No | `0` | Transition delay in ms |
| `onClick` | `() => void` | No | - | Click/tap handler |
| `testID` | `string` | No | - | Test identifier |

#### Visual States

| State | Mode | Background | Border | Checkmark |
|-------|------|------------|--------|-----------|
| `rest` | Tap/Initial | `color.structure.canvas` | 1px default | Hidden |
| `selected` | Select | `color.feedback.select.background.rest` | 2px emphasis | Visible |
| `notSelected` | Select | `color.feedback.select.background.default` | 1px default | Hidden |
| `checked` | MultiSelect | `color.structure.canvas` | 1px default | Visible |
| `unchecked` | MultiSelect | `color.structure.canvas` | 1px default | Hidden |

#### Behavioral Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `focusable` | Can receive keyboard focus | 2.1.1, 2.4.7 |
| `pressable` | Responds to press/click events | 2.1.1 |
| `hover_state` | Visual feedback on hover | 1.4.13 |
| `pressed_state` | Visual feedback when pressed | 2.4.7 |
| `visual_state_driven` | Renders appearance based on visualState prop | - |
| `checkmark_animation` | Animated selection indicator | 2.3.3 |
| `error_state_display` | Shows error styling when error=true | 3.3.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |

#### Usage Example

```html
<!-- Web -->
<button-vertical-list-item
  label="Dark Mode"
  description="Automatically switch at sunset"
  leading-icon="moon"
  visual-state="selected"
></button-vertical-list-item>
```

```swift
// iOS
ButtonVerticalListItem(
    label: "Dark Mode",
    description: "Automatically switch at sunset",
    leadingIcon: "moon",
    visualState: .selected
) {
    handleSelect()
}
```

```kotlin
// Android
ButtonVerticalListItem(
    label = "Dark Mode",
    description = "Automatically switch at sunset",
    leadingIcon = "moon",
    visualState = VisualState.Selected,
    onClick = { handleSelect() }
)
```

---

## Token Dependencies

### Required Tokens

Components in the Buttons family consume these design tokens:

Button uses a **compositional token architecture** where component styling references semantic concept tokens. This follows the Nathan Curtis concept-first naming model.

#### Semantic Concept Tokens (Foundation)

Button components rely on three semantic concepts:

| Concept | Token | Primitive | Purpose |
|---------|-------|-----------|---------|
| **Action** | `color.action.primary` | purple300 | Emphasized action (single, focused instances) |
| **Action** | `color.action.secondary` | black400 | De-emphasized action (repetitive, supporting instances) |
| **Contrast** | `color.contrast.onDark` | white100 | Content on dark/colored backgrounds |
| **Contrast** | `color.contrast.onLight` | black500 | Content on light backgrounds |
| **Feedback** | `color.feedback.select.text.rest` | cyan400 | Selected state text/border |
| **Feedback** | `color.feedback.select.background.rest` | cyan100 | Selected state background |
| **Feedback** | `color.feedback.select.text.default` | gray200 | Not-selected state text/border |
| **Feedback** | `color.feedback.select.background.default` | gray100 | Not-selected state background |
| **Feedback** | `color.feedback.error.text` | pink400 | Error state text/border |
| **Feedback** | `color.feedback.error.background` | pink100 | Error state background |
| **Structure** | `color.structure.canvas` | white100 | Base background |
| **Structure** | `color.structure.border` | gray100 | Default border color |

#### Token Usage by Component

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Typography | `typography.button.*` | Button text sizing |
| Typography | `typography.labelMd`, `typography.labelLg` | Label typography |
| Typography | `typography.body.sm` | Description text, error messages |
| Color | `color.action.primary` | Primary button background |
| Color | `color.action.secondary` | Secondary button text/border |
| Color | `color.contrast.onDark` | Content (text/icons) on primary background |
| Color | `color.text.primary` | Secondary/tertiary text |
| Color | `color.text.muted` | Description text |
| Color | `color.structure.canvas` | Secondary button background |
| Color | `color.structure.border` | Secondary button border |
| Color | `color.feedback.select.text.rest` | Selected state border/text |
| Color | `color.feedback.select.background.rest` | Selected state background |
| Color | `color.feedback.select.text.default` | Not-selected state border/text |
| Color | `color.feedback.select.background.default` | Not-selected state background |
| Color | `color.feedback.error.text` | Error state border/text |
| Color | `color.feedback.error.background` | Error state background |
| Spacing | `space.inset.*` | Button padding |
| Spacing | `space.inline.100` | Icon-label gap |
| Spacing | `space.grouped.normal` | Gap between list items (8px) |
| Motion | `motion.button.press` | Press animation timing |
| Motion | `motion.button.hover` | Hover transition timing |
| Motion | `motion.selectionTransition` | Selection animation (250ms) |
| Border | `border.button.default` | Border width |
| Border | `borderDefault` | 1px default border |
| Border | `borderEmphasis` | 2px emphasis border |
| Border | `radius.100`, `radius.150` | Border radius |
| Border | `radiusNormal` | 8px border radius |
| Accessibility | `accessibility.tapArea.recommended` | Touch target (48px) |
| Accessibility | `accessibility.focus.*` | Focus ring styling |
| Icon | `icon.size100`, `icon.size125` | Icon sizing |
| Blend | `blend.hoverDarker` | Hover state (8% darker) |
| Blend | `blend.pressedDarker` | Pressed state (12% darker) |
| Blend | `blend.disabledDesaturate` | Disabled state (12% less saturated) |

**Why Semantic Concept Tokens**:
- **Action concept**: `color.action.primary` clearly indicates emphasized interactive elements
- **Feedback concept**: `color.feedback.select.*` groups all selection-related colors together
- **Contrast concept**: `color.contrast.onDark` ensures readable content on colored backgrounds
- **Structure concept**: `color.structure.canvas` provides consistent base backgrounds

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
| Primary action (submit, save) | primary | Highest visual emphasis — use for single, focused CTAs |
| Secondary action (cancel, back) | secondary | Medium emphasis, clear alternative |
| Tertiary action (skip, dismiss) | tertiary | Lowest emphasis, de-emphasized |
| Multiple actions in a list | secondary | Avoid "purple-ication" — use primary sparingly |
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

| Component | Platform | Technology | File Location |
|-----------|----------|------------|---------------|
| Button-CTA | Web | Web Components | `platforms/web/ButtonCTA.web.ts` |
| Button-CTA | iOS | SwiftUI | `platforms/ios/ButtonCTA.ios.swift` |
| Button-CTA | Android | Jetpack Compose | `platforms/android/ButtonCTA.android.kt` |
| Button-VerticalList-Set | Web | Web Components | `platforms/web/ButtonVerticalListSet.web.ts` |
| Button-VerticalList-Set | iOS | SwiftUI | `platforms/ios/ButtonVerticalListSet.swift` |
| Button-VerticalList-Set | Android | Jetpack Compose | `platforms/android/ButtonVerticalListSet.kt` |
| Button-VerticalList-Item | Web | Web Components | `platforms/web/ButtonVerticalListItem.web.ts` |
| Button-VerticalList-Item | iOS | SwiftUI | `platforms/ios/VerticalListButtonItem.ios.swift` |
| Button-VerticalList-Item | Android | Jetpack Compose | `platforms/android/VerticalListButtonItem.kt` |

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
- [Token-Family-Color](./Token-Family-Color.md) - Color token reference including action, feedback, and contrast concepts
- [Token Governance](./Token-Governance.md) - Token selection and usage governance
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Button-CTA Schema](../../src/components/core/Button-CTA/Button-CTA.schema.yaml) - Full schema definition
- [Button-VerticalList-Set README](../../src/components/core/Button-VerticalList-Set/README.md) - Set component documentation
- [Button-VerticalList-Item README](../../src/components/core/Button-VerticalList-Item/README.md) - Item component documentation
- [Semantic Token Naming Design Authority](../.kiro/specs/051-semantic-token-naming-restructure/design-outline.md) - Naming model reference
