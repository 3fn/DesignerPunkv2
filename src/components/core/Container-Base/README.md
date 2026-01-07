# Container-Base Component

**Stemma System Naming**: `[Family]-[Type]` = `Container-Base`  
**Type**: Primitive (foundational component)  
**Family**: Containers  
**Version**: 1.0.0  
**Readiness**: Production Ready 🟢

---

## Overview

Container-Base is a foundational primitive component that provides structural wrapping with individual styling capabilities. It serves as the building block for semantic components (Card, Panel, Hero) by exposing granular styling props that map to design system tokens.

### Key Features

- **Token-Based Styling**: All visual properties map to design system tokens
- **Cross-Platform Consistency**: Identical API across web, iOS, and Android
- **Semantic HTML Support**: Web platform supports semantic HTML elements
- **Safe Area Handling**: iOS platform supports safe area control
- **Hover State**: Interactive hover feedback using blend utilities
- **Accessibility**: Full accessibility support across all platforms

---

## Usage

### Web (Custom Element)

```html
<!-- Basic usage -->
<container-base padding="200" background="color.surface">
  <p>Content</p>
</container-base>

<!-- With multiple styling props -->
<container-base 
  padding="300"
  background="color.primary"
  shadow="shadow.container"
  border-radius="normal"
  layering="navigation"
>
  <p>Content</p>
</container-base>

<!-- Semantic HTML -->
<container-base semantic="article" accessibility-label="Blog post">
  <p>Content</p>
</container-base>

<!-- With hover state -->
<container-base padding="200" background="color.surface" hoverable="true">
  <p>Hoverable content</p>
</container-base>
```

### iOS (SwiftUI)

```swift
// Basic usage
ContainerBase(padding: .p200, background: "color.surface") {
    Text("Content")
}

// With multiple styling props
ContainerBase(
    padding: .p300,
    background: "color.primary",
    shadow: "shadow.container",
    borderRadius: .normal,
    layering: .navigation
) {
    Text("Content")
}

// With safe area control
ContainerBase(
    padding: .p200,
    background: "color.surface",
    ignoresSafeArea: true
) {
    Text("Full screen content")
}

// With hover state (macOS/iPadOS with pointer)
ContainerBase(
    padding: .p200,
    background: "color.surface",
    hoverable: true
) {
    Text("Hoverable content")
}
```

### Android (Jetpack Compose)

```kotlin
// Basic usage
ContainerBase(padding = ContainerBasePaddingValue.P200, background = "color.surface") {
    Text("Content")
}

// With multiple styling props
ContainerBase(
    padding = ContainerBasePaddingValue.P300,
    background = "color.primary",
    shadow = "shadow.container",
    borderRadius = ContainerBaseBorderRadiusValue.Normal,
    layering = ContainerBaseLayeringValue.Navigation
) {
    Text("Content")
}

// With hover state (desktop/ChromeOS with pointer)
ContainerBase(
    padding = ContainerBasePaddingValue.P200,
    background = "color.surface",
    hoverable = true
) {
    Text("Hoverable content")
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `PaddingValue` | `undefined` | Internal padding using space.inset tokens |
| `background` | `ColorTokenName` | `undefined` | Background color using semantic color tokens |
| `shadow` | `ShadowTokenName` | `undefined` | Shadow using semantic shadow tokens |
| `border` | `BorderValue` | `undefined` | Border width using border tokens |
| `borderRadius` | `BorderRadiusValue` | `undefined` | Border radius using radius tokens |
| `opacity` | `OpacityTokenName` | `undefined` | Opacity using semantic opacity tokens |
| `layering` | `LayeringValue` | `undefined` | Stacking order (z-index on web/iOS, elevation on Android) |
| `semantic` | `SemanticHTMLElement` | `'div'` | Semantic HTML element (web only) |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |
| `ignoresSafeArea` | `boolean` | `false` | Ignore safe area insets (iOS only) |
| `hoverable` | `boolean` | `false` | Enable hover state feedback |
| `children` | `any` | - | Child content to render inside container |

---

## Token Mappings

### Padding Values

| Value | Token | Size |
|-------|-------|------|
| `'none'` | - | 0px |
| `'050'` | `space.inset.050` | 4px |
| `'100'` | `space.inset.100` | 8px |
| `'150'` | `space.inset.150` | 12px |
| `'200'` | `space.inset.200` | 16px |
| `'300'` | `space.inset.300` | 24px |
| `'400'` | `space.inset.400` | 32px |

### Border Values

| Value | Token | Width |
|-------|-------|-------|
| `'none'` | - | 0px |
| `'default'` | `border.border.default` | 1px |
| `'emphasis'` | `border.border.emphasis` | 2px |
| `'heavy'` | `border.border.heavy` | 4px |

### Border Radius Values

| Value | Token | Radius |
|-------|-------|--------|
| `'none'` | - | 0px |
| `'tight'` | `radius-050` | 4px |
| `'normal'` | `radius-100` | 8px |
| `'loose'` | `radius-200` | 16px |

### Layering Values

| Value | Web/iOS Token | Android Token |
|-------|---------------|---------------|
| `'container'` | `zIndex.container` | `elevation.container` |
| `'navigation'` | `zIndex.navigation` | `elevation.navigation` |
| `'dropdown'` | `zIndex.dropdown` | `elevation.dropdown` |
| `'modal'` | `zIndex.modal` | `elevation.modal` |
| `'toast'` | `zIndex.toast` | `elevation.toast` |
| `'tooltip'` | `zIndex.tooltip` | `elevation.tooltip` |

---

## Behavioral Contracts

Container-Base guarantees the following behaviors across all platforms:

| Contract | Description | WCAG |
|----------|-------------|------|
| `contains_children` | Can contain child components | 1.3.1 |
| `applies_padding` | Applies consistent internal padding | 1.4.12 |
| `applies_background` | Applies background color styling | 1.4.3 |
| `applies_shadow` | Applies shadow/elevation styling | 1.4.11 |
| `applies_border` | Applies border styling | 1.4.11 |
| `applies_radius` | Applies border radius styling | - |
| `hover_state` | Visual feedback on hover (pointer devices) | 1.4.13 |

See `Container-Base.schema.yaml` for detailed contract specifications.

---

## Platform-Specific Behavior

### Web
- Uses Shadow DOM for style encapsulation
- Supports semantic HTML elements via `semantic` prop
- Hover state uses CSS `:hover` pseudo-class with blend utilities

### iOS
- Uses SwiftUI modifier chains for styling
- Supports safe area control via `ignoresSafeArea` prop
- Hover state uses `.onHover` modifier (macOS/iPadOS with pointer)
- Uses `@ViewBuilder` for child content

### Android
- Uses Jetpack Compose modifier chains for styling
- Elevation tokens handle both stacking order and shadow rendering
- If both `layering` and `shadow` props are provided, `layering` takes precedence
- Development warning logged when both props are used
- Hover state uses `hoverable` modifier (desktop/ChromeOS with pointer)

---

## Accessibility

Container-Base provides comprehensive accessibility support:

### Web
- Supports `aria-label` via `accessibilityLabel` prop
- Semantic HTML elements improve document structure
- Focus management for interactive containers

### iOS
- Uses `.accessibilityLabel()` modifier for VoiceOver
- Safe area handling ensures content visibility

### Android
- Uses `contentDescription` in semantics for TalkBack
- Proper focus handling for accessibility services

### WCAG Compliance
- **1.3.1 Info and Relationships**: Semantic HTML elements supported
- **1.4.3 Contrast (Minimum)**: Background colors use semantic tokens
- **1.4.11 Non-text Contrast**: Borders and shadows use semantic tokens
- **1.4.12 Text Spacing**: Padding uses semantic spacing tokens
- **1.4.13 Content on Hover or Focus**: Hover state provides visual feedback

---

## Related Documentation

- [Container-Base Schema](./Container-Base.schema.yaml) - Formal behavioral contracts
- [Container Component Design](/.kiro/specs/010-container-component/design.md) - Original design spec
- [Stemma System Architecture](/.kiro/specs/034-component-architecture-system/design.md) - Component architecture
- [Blend Infrastructure](/.kiro/specs/031-blend-infrastructure-implementation/design.md) - Blend utilities for hover state

---

## Semantic Variants (Planned)

Container-Base serves as the primitive base for these planned semantic components:

| Component | Purpose | Status |
|-----------|---------|--------|
| `Container-Card` | Card-specific styling and behaviors | Planned |
| `Container-Panel` | Panel-specific styling and behaviors | Planned |
| `Container-Hero` | Hero section styling and behaviors | Planned |
