---
inclusion: manual
name: Component-Family-Chip
description: Chip component family — compact, interactive elements for filtering, selection, or input management (tags, toggles). Load when working with chip components, filter controls, or tag inputs.
---

# Chip Components

**Date**: February 4, 2026
**Purpose**: MCP-queryable documentation for Chip component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, chip-implementation
**Last Reviewed**: February 4, 2026

---

## Family Overview

**Family**: Chip
**Shared Need**: Compact, interactive elements for filtering, selection, or input management
**Readiness**: 🟢 Production Ready

### Purpose

Chips are compact, interactive elements used for filtering content, toggling selections, or managing user-entered values like tags. Unlike badges (read-only), chips are interactive and respond to user input.

### Key Characteristics

- **Interactive**: Responds to press/click/tap events
- **Compact**: 32px visual height with 48px tap area for accessibility
- **Pill-shaped**: Uses radius.full for rounded appearance
- **Token-first**: All styling via design tokens, no hard-coded values

### DesignerPunk Philosophy

**NO DISABLED STATES**: Chip components do not support disabled states. If an action is unavailable, the component should not be rendered. This ensures users always see actionable UI elements.

### Stemma System Integration

- **Primitive Base**: Chip-Base (consumer-facing)
- **Semantic Variants**: 2 implemented (Chip-Filter, Chip-Input)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Chip (Family)
│
└── Chip-Base (Type Primitive) ─── Consumer-facing
    │
    ├── Chip-Filter (Semantic Variant)
    │   └── Toggle selection for filtering content
    │
    └── Chip-Input (Semantic Variant)
        └── Dismissible chip for user-entered values
```

### Primitive Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Chip-Base | Primitive | 🟢 Production | General-purpose interactive chip with optional leading icon |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Chip-Filter | Chip-Base | 🟢 Production | Toggle chip with selected state for filtering content |
| Chip-Input | Chip-Base | 🟢 Production | Dismissible chip with trailing X icon for user-entered values |

---

## Behavioral Contracts

### Base Contracts (Chip-Base)

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| renders_pill_container | Renders pill-shaped container with label text | — | web, ios, android |
| renders_icon | Optionally displays leading icon via Icon-Base at icon.size075 | — | web, ios, android |
| press_interaction | Responds to press/click/tap events, calls onPress callback | 2.1.1 | web, ios, android |
| state_styling | Visual feedback for default, hover, pressed states | 1.4.13 | web, ios, android |
| keyboard_focusable | Can receive keyboard focus via Tab key | 2.1.1, 2.4.7 | web, ios, android |
| keyboard_activation | Activates on Space/Enter key press | 2.1.1 | web |
| expanded_tap_area | 48px tap area exceeds WCAG 44px minimum | 2.5.5 | web, ios, android |
| accessibility_role | Announces as button to assistive technology | 4.1.2 | web, ios, android |

### Extended Contracts (Chip-Filter)

Inherits all contracts from Chip-Base, plus:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| toggle_selection | Toggles selected state on press, calls onSelectionChange | 4.1.2 | web, ios, android |
| selected_styling | Visual feedback for selected state using select feedback colors | 1.4.1 | web, ios, android |
| checkmark_icon | Displays checkmark icon when selected (replaces leading icon) | — | web, ios, android |
| aria_pressed | Announces selection state via aria-pressed attribute | 4.1.2 | web |

### Extended Contracts (Chip-Input)

Inherits most contracts from Chip-Base, plus:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| dismiss_on_press | Dismisses chip on press anywhere, calls onDismiss | 2.1.1 | web, ios, android |
| trailing_x_icon | Always displays X icon as trailing element | — | web, ios, android |
| dual_icons | Supports both leading icon AND trailing X icon | — | web, ios, android |
| x_icon_accessible_label | X icon has accessible label "Remove [label]" | 4.1.2 | web, ios, android |

---

## Component Schemas

### Chip-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | — | Chip text content |
| icon | IconName | No | — | Optional leading icon (uses Icon-Base at icon.size075) |
| onPress | () => void | No | — | Called when chip is pressed |
| testID | string | No | — | Test identifier |

#### Visual Specifications

| Property | Token | Value |
|----------|-------|-------|
| Block Padding | chip.paddingBlock | 6px (references space075) |
| Inline Padding | space.inset.150 | 12px |
| Icon Gap | space.grouped.tight | 4px |
| Border Width | borderDefault | 1px |
| Border Radius | radius.full | pill shape |
| Typography | typography.buttonSm | 14px, medium |
| Visual Height | (derived) | 32px |
| Tap Area | tapAreaRecommended | 48px |

#### Usage Example

```html
<!-- Web -->
<chip-base label="Category"></chip-base>
<chip-base label="Technology" icon="code"></chip-base>
```

```swift
// iOS
ChipBase(label: "Category")
ChipBase(label: "Technology", icon: "code")
```

```kotlin
// Android
ChipBase(label = "Category")
ChipBase(label = "Technology", icon = "code")
```

---

### Chip-Filter

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Chip-Base

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | — | Chip text content |
| icon | IconName | No | — | Optional leading icon (replaced by checkmark when selected) |
| selected | boolean | No | false | Whether chip is in selected state |
| onSelectionChange | (selected: boolean) => void | No | — | Called when selection state changes |
| testID | string | No | — | Test identifier |

#### Selected State Styling

| Property | Token |
|----------|-------|
| Background | color.feedback.select.background.rest |
| Border | color.feedback.select.border.rest |
| Text | color.feedback.select.text.rest |

#### Checkmark Behavior

When `selected=true`, a checkmark icon appears in the leading position. If an `icon` prop is provided, the checkmark **replaces** the leading icon when selected. This maintains consistent chip width.

#### Usage Example

```html
<!-- Web -->
<chip-filter label="Active" selected></chip-filter>
<chip-filter label="Category" icon="tag" onselectionchange="handleChange"></chip-filter>
```

```swift
// iOS
ChipFilter(label: "Active", selected: $isSelected)
ChipFilter(label: "Category", icon: "tag", selected: $isSelected)
```

```kotlin
// Android
ChipFilter(label = "Active", selected = isSelected, onSelectionChange = { isSelected = it })
```

---

### Chip-Input

**Type**: Semantic
**Status**: 🟢 Production Ready
**Inherits**: Chip-Base

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| label | string | Yes | — | Chip text content |
| icon | IconName | No | — | Optional leading icon (X icon is always trailing) |
| onDismiss | () => void | No | — | Called when chip is dismissed |
| testID | string | No | — | Test identifier |

#### X Icon Behavior

- X icon is **always** displayed as trailing element
- Tap **anywhere** on chip dismisses (not just X icon)
- X icon has accessible label "Remove [label]"
- When `icon` prop provided, displays **both** leading icon AND trailing X icon

#### Usage Example

```html
<!-- Web -->
<chip-input label="JavaScript" ondismiss="handleDismiss"></chip-input>
<chip-input label="React" icon="code" ondismiss="handleDismiss"></chip-input>
```

```swift
// iOS
ChipInput(label: "JavaScript", onDismiss: { removeTag("JavaScript") })
ChipInput(label: "React", icon: "code", onDismiss: { removeTag("React") })
```

```kotlin
// Android
ChipInput(label = "JavaScript", onDismiss = { removeTag("JavaScript") })
ChipInput(label = "React", icon = "code", onDismiss = { removeTag("React") })
```

---

## Token Dependencies

### Required Tokens

Components in this family consume these design tokens:

| Category | Token | Purpose |
|----------|-------|---------|
| Component | chip.paddingBlock | Block padding (6px, references space075) |
| Typography | typography.buttonSm | Label text styling |
| Spacing | space.inset.150 | Inline padding (12px) |
| Spacing | space.grouped.tight | Icon-to-label gap (4px) |
| Border | borderDefault | Border width (1px) |
| Border | radius.full | Pill shape |
| Motion | motion.duration.fast | State transition animation |
| Accessibility | tapAreaRecommended | Minimum tap area (48px) |
| Accessibility | accessibility.focus.width | Focus ring width |
| Accessibility | accessibility.focus.offset | Focus ring offset |
| Accessibility | accessibility.focus.color | Focus ring color |
| Icon | icon.size075 | Icon size (20px) |

### Color Tokens

| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | color.structure.surface | color.structure.border | color.text.default |
| Hover | blend.hoverDarker applied | color.action.primary | color.text.default |
| Pressed | blend.pressedDarker applied | color.action.primary | color.text.default |
| Selected | color.feedback.select.background.rest | color.feedback.select.border.rest | color.feedback.select.text.rest |

### Token Resolution

Chip components resolve tokens at render time using platform-appropriate mechanisms:
- **Web**: CSS custom properties via Shadow DOM
- **iOS**: Swift extensions on DesignTokens
- **Android**: Kotlin extensions on DesignTokens object

---

## Usage Guidelines

### When to Use This Family

**Use Chip components when**:
- Filtering content by multiple criteria (Chip-Filter)
- Managing user-entered tags or selections (Chip-Input)
- Providing compact, interactive selection elements
- Building filter bars or tag input fields

**Do NOT use Chip components when**:
- Display-only indicators are needed (use Badge instead)
- Primary actions are needed (use Button instead)
- Navigation is needed (use Tab or Link instead)
- The element should not be interactive

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| General interactive chip | Chip-Base | Flexible base for custom behavior |
| Multi-select filter | Chip-Filter | Built-in toggle with selected styling |
| Tag input field | Chip-Input | Built-in dismiss with X icon |
| Single-select choice | Chip-Base (future: Chip-Choice) | Chip-Filter is for multi-select |

### Common Patterns

#### Filter Bar

```html
<div class="filter-bar">
  <chip-filter label="All" selected></chip-filter>
  <chip-filter label="Active"></chip-filter>
  <chip-filter label="Completed"></chip-filter>
</div>
```

#### Tag Input

```html
<div class="tag-input">
  <chip-input label="JavaScript" ondismiss="removeTag('js')"></chip-input>
  <chip-input label="TypeScript" ondismiss="removeTag('ts')"></chip-input>
  <input type="text" placeholder="Add tag..." />
</div>
```

### Accessibility Considerations

- All chips are focusable via Tab key
- Space/Enter activates chips (press, toggle, or dismiss)
- Chip-Filter uses `aria-pressed` to announce selection state
- Chip-Input X icon has accessible label "Remove [label]"
- 48px tap area exceeds WCAG 2.5.5 minimum (44px)
- Focus ring visible on keyboard focus only (`:focus-visible`)

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/[Component].web.ts` |
| iOS | SwiftUI | `platforms/ios/[Component].swift` |
| Android | Jetpack Compose | `platforms/android/[Component].android.kt` |

### Platform-Specific Behaviors

#### Web

- Shadow DOM for style encapsulation
- CSS custom properties for token consumption
- `role="button"` and `tabindex="0"` for accessibility
- `::before` pseudo-element for expanded tap area
- `:focus-visible` for keyboard-only focus indication
- Logical properties (padding-block, padding-inline) for RTL support

#### iOS

- SwiftUI Button with custom styling
- Token consumption via DesignTokens constants
- Capsule shape for pill appearance
- `frame(minHeight:)` for 48px tap area
- `accessibilityIdentifier` for testID

#### Android

- Jetpack Compose Surface with onClick handler
- Token consumption via DesignTokens object
- `RoundedCornerShape(50)` for pill shape
- `Modifier.sizeIn(minHeight = 48.dp)` for tap area
- `testTag` for testID

### Behavioral Consistency

All behavioral contracts are maintained across platforms through:
- Shared schema definitions (YAML)
- Platform-specific implementations following contracts
- Stemma validator tests verifying contract compliance
- Cross-platform visual regression testing

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Component Schema Format](./Component-Schema-Format.md) - YAML schema specification
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [Test Development Standards](./Test-Development-Standards.md) - Testing patterns for chip components
