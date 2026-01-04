---
inclusion: manual
---

# Containers Components

**Date**: 2026-01-02
**Purpose**: MCP-queryable documentation for Containers component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, layout-implementation
**Last Reviewed**: 2026-01-02

---

## Family Overview

**Family**: Containers
**Shared Need**: Layout and content organization
**Readiness**: 🟢 Production Ready

### Purpose

The Containers family provides structural wrapping components for organizing content with consistent styling capabilities. All components expose granular styling props that map directly to design system tokens, enabling flexible composition while maintaining design system consistency.

### Key Characteristics

- **Granular Styling**: Individual props for padding, background, shadow, border, radius, opacity, and layering
- **Semantic HTML Support**: Web platform supports semantic HTML elements (section, article, nav, etc.)
- **Safe Area Handling**: iOS platform supports safe area control for edge-to-edge layouts
- **Hover State**: Optional hover feedback for interactive containers
- **Cross-Platform Consistent**: Token-based styling ensures visual consistency across platforms

### Stemma System Integration

- **Primitive Base**: Container-Base
- **Semantic Variants**: 0 implemented, 3 planned (Card, Panel, Hero)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Container-Base (Primitive)
    │
    ├── Container-Card (Semantic) [PLANNED]
    │   └── Card-specific styling and behaviors
    │
    ├── Container-Panel (Semantic) [PLANNED]
    │   └── Panel-specific styling and behaviors
    │
    └── Container-Hero (Semantic) [PLANNED]
        └── Hero section styling and behaviors
```

### Primitive Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Container-Base | Primitive | 🟢 Production Ready | Foundational container with granular styling props |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Container-Card | Container-Base | 🔴 Planned | Card-specific styling and behaviors |
| Container-Panel | Container-Base | 🔴 Planned | Panel-specific styling and behaviors |
| Container-Hero | Container-Base | 🔴 Planned | Hero section styling and behaviors |

---

## Behavioral Contracts

### Base Contracts (Inherited by All)

All components in the Containers family inherit these 7 foundational contracts from Container-Base:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `contains_children` | Can contain child components | 1.3.1 | web, ios, android |
| `applies_padding` | Applies consistent internal padding | 1.4.12 | web, ios, android |
| `applies_background` | Applies background color styling | 1.4.3 | web, ios, android |
| `applies_shadow` | Applies shadow/elevation styling | 1.4.11 | web, ios, android |
| `applies_border` | Applies border styling | 1.4.11 | web, ios, android |
| `applies_radius` | Applies border radius styling | N/A | web, ios, android |
| `hover_state` | Visual feedback on hover (pointer devices) | 1.4.13 | web, ios, android |

### Contract Details

#### contains_children

**Description**: Container-Base can contain any child components or content.

**Behavior**: Children are rendered inside the container with applied styling. Platform-specific implementation: Web uses `<slot>` element, iOS uses `@ViewBuilder`, Android uses Composable content lambda.

**WCAG Compliance**: 1.3.1 Info and Relationships

#### applies_padding

**Description**: Applies consistent internal padding using space.inset tokens.

**Behavior**: When padding prop is set, Container-Base applies uniform padding on all sides. Padding values follow the 8px baseline grid with mathematical relationships.

**WCAG Compliance**: 1.4.12 Text Spacing

#### applies_background

**Description**: Applies background color styling.

**Behavior**: When background prop is set, Container-Base applies the specified semantic color token as the background color. Background color is applied behind all child content and respects border radius.

**WCAG Compliance**: 1.4.3 Contrast (Minimum)

#### applies_shadow

**Description**: Applies shadow/elevation styling.

**Behavior**: When shadow prop is set, Container-Base applies the specified semantic shadow token. On Android, layering prop takes precedence over shadow (elevation handles both stacking and shadow).

**WCAG Compliance**: 1.4.11 Non-text Contrast

#### hover_state

**Description**: Visual feedback on hover (pointer devices only).

**Behavior**: When hoverable prop is true and user hovers with a pointer device, Container-Base shows visual feedback by darkening the background using `darkerBlend(color.surface, blend.hoverDarker)` - 8% darker.

**WCAG Compliance**: 1.4.13 Content on Hover or Focus

---

## Component Schemas

### Container-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `padding` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Internal padding (maps to space.inset tokens) |
| `background` | `ColorTokenName` | No | - | Background color token |
| `shadow` | `ShadowTokenName` | No | - | Shadow token |
| `border` | `'none' \| 'default' \| 'emphasis' \| 'heavy'` | No | - | Border width |
| `borderRadius` | `'none' \| 'tight' \| 'normal' \| 'loose'` | No | - | Border radius |
| `opacity` | `OpacityTokenName` | No | - | Opacity token |
| `layering` | `'container' \| 'navigation' \| 'dropdown' \| 'modal' \| 'toast' \| 'tooltip'` | No | - | Stacking order |
| `semantic` | `'div' \| 'section' \| 'article' \| 'aside' \| 'nav' \| 'header' \| 'footer' \| 'main' \| 'fieldset'` | No | `'div'` | Semantic HTML element (web only) |
| `accessibilityLabel` | `string` | No | - | Accessibility label |
| `ignoresSafeArea` | `boolean` | No | `false` | Ignore safe area insets (iOS only) |
| `hoverable` | `boolean` | No | `false` | Enable hover state |
| `children` | `any` | No | - | Child content |

#### Padding Values

| Value | Pixels | Token |
|-------|--------|-------|
| none | 0px | - |
| 050 | 4px | space.inset.050 |
| 100 | 8px | space.inset.100 |
| 150 | 12px | space.inset.150 |
| 200 | 16px | space.inset.200 |
| 300 | 24px | space.inset.300 |
| 400 | 32px | space.inset.400 |

#### Border Radius Values

| Value | Pixels | Token |
|-------|--------|-------|
| none | 0px | - |
| tight | 4px | radius-050 |
| normal | 8px | radius-100 |
| loose | 16px | radius-200 |

#### Usage Example

```html
<!-- Web -->
<container-base
  padding="200"
  background="color.surface"
  border-radius="normal"
  shadow="shadow.container"
>
  <h2>Card Title</h2>
  <p>Card content goes here.</p>
</container-base>

<!-- Semantic HTML -->
<container-base
  semantic="section"
  padding="300"
  background="color.canvas"
>
  <h1>Page Section</h1>
</container-base>
```

```swift
// iOS
ContainerBase(
    padding: .p200,
    background: .surface,
    borderRadius: .normal,
    shadow: .container
) {
    Text("Card Title")
    Text("Card content goes here.")
}
```

```kotlin
// Android
ContainerBase(
    padding = ContainerPadding.P200,
    background = ColorToken.Surface,
    borderRadius = BorderRadius.Normal,
    shadow = ShadowToken.Container
) {
    Text("Card Title")
    Text("Card content goes here.")
}
```

---

## Token Dependencies

### Required Tokens

Components in the Containers family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Spacing | `space.inset.*` | Internal padding |
| Color | `color.background`, `color.surface`, `color.canvas` | Background colors |
| Color | `color.border` | Border color |
| Shadow | `shadow.*` | Shadow styling |
| Border | `border.border.*` | Border widths |
| Border | `radius-*` | Border radius |
| Layering | `zIndex.*` | Stacking order (web/iOS) |
| Layering | `elevation.*` | Stacking order + shadow (Android) |
| Motion | `motion.focusTransition` | Hover transition |
| Blend | `blend.hoverDarker` | Hover state (8% darker) |

### Token Resolution

Container components resolve tokens through the Rosetta System's semantic-to-primitive hierarchy. Color tokens resolve to theme-aware values supporting light/dark modes. On Android, elevation tokens handle both stacking order and shadow rendering.

### Related Token Documentation

- [Token Quick Reference](./Token%20Quick%20Reference.md) - Token routing table
- [Shadow Tokens](./shadow-tokens.md) - Shadow token details
- [Layering Tokens](./layering-tokens.md) - Layering token details

---

## Usage Guidelines

### When to Use Containers

**Use Container components when**:
- Wrapping content with consistent padding and styling
- Creating cards, panels, or sections
- Establishing visual hierarchy through elevation
- Grouping related content together

**Do NOT use Container components when**:
- Creating interactive buttons (use Buttons instead)
- Building form inputs (use Form Inputs instead)
- Creating modals (use Modals when available)

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Generic content wrapper | Container-Base | Flexible styling via props |
| Card with elevation | Container-Base (with shadow) | Until Container-Card is implemented |
| Page section | Container-Base (semantic="section") | Semantic HTML for accessibility |
| Navigation wrapper | Container-Base (semantic="nav") | Semantic HTML for accessibility |

### Common Patterns

#### Card Pattern

```html
<!-- Web -->
<container-base
  padding="200"
  background="color.surface"
  border-radius="normal"
  shadow="shadow.container"
>
  <!-- Card content -->
</container-base>
```

#### Section Pattern

```html
<!-- Web -->
<container-base
  semantic="section"
  padding="300"
  background="color.canvas"
>
  <h2>Section Title</h2>
  <!-- Section content -->
</container-base>
```

### Accessibility Considerations

- **Semantic HTML**: Use semantic prop for improved accessibility and SEO (web)
- **Accessibility Labels**: Provide accessibilityLabel for containers with important content
- **Color Contrast**: Background colors use semantic tokens ensuring proper contrast
- **Safe Areas**: Use ignoresSafeArea carefully to avoid content being obscured (iOS)

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/ContainerBase.web.ts` |
| iOS | SwiftUI | `platforms/ios/ContainerBase.ios.swift` |
| Android | Jetpack Compose | `platforms/android/ContainerBase.android.kt` |

### Platform-Specific Behaviors

#### Web

- Uses Shadow DOM for style encapsulation
- Custom element registration: `<container-base>`
- Supports semantic HTML elements via semantic prop
- Hover state uses CSS `:hover` with blend utilities

#### iOS

- SwiftUI modifier chains for styling
- Supports safe area control via ignoresSafeArea prop
- Hover state uses `.onHover` modifier (macOS/iPadOS with pointer)
- Uses `@ViewBuilder` for child content

#### Android

- Jetpack Compose modifier chains for styling
- Elevation tokens handle both stacking order and shadow
- If both layering and shadow props provided, layering takes precedence
- Hover state uses hoverable modifier (desktop/ChromeOS with pointer)
- Development warning logged when both layering and shadow used

### Behavioral Consistency

All platforms implement the same behavioral contracts:
- Padding values match across platforms
- Background colors resolve to same visual appearance
- Shadow rendering is mathematically equivalent
- Hover state uses same blend percentage (8% darker)

---

## Related Documentation

- [Component Quick Reference](./Component%20Quick%20Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token%20Quick%20Reference.md) - Token documentation
- [MCP Component Family Document Template](./mcp-component-family-document-template.md) - Template specification
- [Container-Base Schema](../../../src/components/core/Container-Base/Container-Base.schema.yaml) - Full schema definition
