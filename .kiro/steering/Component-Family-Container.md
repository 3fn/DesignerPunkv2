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
**Last Reviewed**: 2026-01-21

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
    ├── Container-Card-Base (Type Primitive)
    │   └── Curated card styling with opinionated defaults
    │       │
    │       ├── Container-Card-Interactive (Semantic) [PLANNED]
    │       │   └── Interactive card behaviors
    │       │
    │       └── Container-Card-Static (Semantic) [PLANNED]
    │           └── Static card behaviors
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

### Type Primitive Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Container-Card-Base | Container-Base | 🟢 Production Ready | Curated card container with opinionated defaults |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Container-Card-Interactive | Container-Card-Base | 🔴 Planned | Interactive card behaviors |
| Container-Card-Static | Container-Card-Base | 🔴 Planned | Static card behaviors |
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
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Block-axis padding (overrides `padding` for block axis) |
| `paddingHorizontal` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Inline-axis padding (overrides `padding` for inline axis) |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Block-start padding (overrides axis props) |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Block-end padding (overrides axis props) |
| `paddingInlineStart` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Inline-start padding (overrides axis props) |
| `paddingInlineEnd` | `'none' \| '050' \| '100' \| '150' \| '200' \| '300' \| '400'` | No | - | Inline-end padding (overrides axis props) |
| `background` | `ColorTokenName` | No | - | Background color token |
| `shadow` | `ShadowTokenName` | No | - | Shadow token |
| `border` | `'none' \| 'default' \| 'emphasis' \| 'heavy'` | No | - | Border width |
| `borderColor` | `ColorTokenName` | No | `color.border.default` | Border color token |
| `borderRadius` | `'none' \| 'tight' \| 'normal' \| 'loose'` | No | - | Border radius |
| `opacity` | `OpacityTokenName` | No | - | Opacity token |
| `layering` | `'container' \| 'navigation' \| 'dropdown' \| 'modal' \| 'toast' \| 'tooltip'` | No | - | Stacking order |
| `semantic` | `'div' \| 'section' \| 'article' \| 'aside' \| 'nav' \| 'header' \| 'footer' \| 'main' \| 'fieldset'` | No | `'div'` | Semantic HTML element (web only) |
| `accessibilityLabel` | `string` | No | - | Accessibility label |
| `ignoresSafeArea` | `boolean` | No | `false` | Ignore safe area insets (iOS only) |
| `hoverable` | `boolean` | No | `false` | Enable hover state |
| `children` | `any` | No | - | Child content |

#### Padding Override Hierarchy

Container-Base supports granular padding control with a clear override hierarchy:

1. **Individual edges** (`paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd`) — highest priority
2. **Axis props** (`paddingVertical`, `paddingHorizontal`) — override uniform padding
3. **Uniform padding** (`padding`) — base value

**Logical Properties Reference** (for internationalization):

| Prop | LTR Effect | RTL Effect |
|------|------------|------------|
| `paddingBlockStart` | top | top |
| `paddingBlockEnd` | bottom | bottom |
| `paddingInlineStart` | left | right |
| `paddingInlineEnd` | right | left |

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

### Container-Card-Base

**Type**: Type Primitive
**Status**: 🟢 Production Ready
**Inherits**: Container-Base (via composition)

Container-Card-Base is a type primitive that provides card-specific styling and behaviors through a curated subset of Container-Base's API. It uses composition (not inheritance) to expose only card-appropriate props with opinionated defaults.

#### Design Philosophy

Inspired by Spotify Encore and Shopify Polaris—opinionated defaults with constrained flexibility. The base provides consistent card styling through a filtered subset of Container-Base's API; semantic variants handle content-specific layouts.

#### Curated Subset Model

Container-Card-Base intentionally restricts the Container-Base API to provide:

1. **Constrained Flexibility**: Only card-appropriate options exposed
2. **Opinionated Defaults**: Sensible values without configuration (zero-config card)
3. **Centralized Updates**: Container-Base changes propagate automatically
4. **Escape Hatch**: Developers can use Container-Base directly if needed

**Why curate?** Cards have specific visual requirements. Exposing the full Container-Base API would allow configurations that don't make sense for cards (e.g., `opacity`, `layering`, `ignoresSafeArea`). The curated subset guides developers toward correct usage.

#### Props Mapping: Container-Base → Card-Base

| Container-Base Prop | Card-Base Exposes | Card-Base Values | Default |
|---------------------|-------------------|------------------|---------|
| `padding` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | `'150'` |
| `paddingVertical` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingHorizontal` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `paddingBlockStart` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingBlockEnd` | ✅ Subset | `'none' \| '050' \| '100' \| '150' \| '200'` | - |
| `paddingInlineStart` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `paddingInlineEnd` | ✅ Subset | `'none' \| '100' \| '150' \| '200'` | - |
| `background` | ✅ Subset | `'surface.primary' \| 'surface.secondary' \| 'surface.tertiary'` | `'surface.primary'` |
| `shadow` | ✅ Subset | `'none' \| 'container'` | `'container'` |
| `border` | ✅ Subset | `'none' \| 'default'` | `'none'` |
| `borderColor` | ✅ Subset | `'border.default' \| 'border.subtle'` | `'border.default'` |
| `borderRadius` | ✅ Subset | `'normal' \| 'loose'` | `'normal'` |
| `semantic` | ✅ Subset | `'div' \| 'section' \| 'article'` | `'div'` |
| `accessibilityLabel` | ✅ Pass-through | `string` | - |
| `opacity` | ❌ Not exposed | - | - |
| `layering` | ❌ Not exposed | - | - |
| `ignoresSafeArea` | ❌ Not exposed | - | - |
| `hoverable` | ❌ Derived | - | Derived from `interactive` |

**Note**: Vertical padding includes `'050'` for fine-tuning typography rhythm. Horizontal padding excludes `'050'` as it's rarely needed for horizontal spacing.

#### Card-Specific Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `interactive` | `boolean` | No | `false` | Enable interactive behavior (hover, press, focus, keyboard) |
| `onPress` | `() => void` | No | - | Press callback (requires `interactive`) |
| `role` | `'button' \| 'link'` | No | `'button'` | ARIA role for interactive cards |
| `testID` | `string` | No | - | Test identifier |

#### Default Semantic Tokens

| Purpose | Token | Value |
|---------|-------|-------|
| Default padding | `space.inset.150` | 12px |
| Default background | `color.surface.primary` | Primary surface color |
| Default shadow | `shadow.container` | Container shadow |
| Default border radius | `radius.normal` | 8px |
| Default border color | `color.border.default` | Default border color |
| Hover feedback | `blend.hoverDarker` | 8% darker |
| Press feedback | `blend.pressedDarker` | 12% darker |
| Focus transition | `motion.focusTransition` | 150ms ease-out |

#### Interactive Behavior Architecture

When `interactive={true}`, Container-Card-Base provides built-in interaction states:

**Hover State** (pointer devices only):
- **Trigger**: Pointer device hover (web, macOS/iPadOS with trackpad)
- **Visual**: Background darkens using `blend.hoverDarker` (8% darker)
- **Transition**: Uses `motion.focusTransition` token (150ms ease-out)
- **Implementation**: Internally sets `hoverable: true` on Container-Base

**Press State**:
- **Trigger**: Mouse down / touch start
- **Visual**: Background darkens using `blend.pressedDarker` (12% darker)
- **Transition**: Immediate on press, ease-out on release
- **Design Decision**: No scale transform to avoid layout shift in card grids

**Focus State**:
- **Trigger**: Keyboard focus (Tab navigation)
- **Visual**: Uses established DesignerPunk focus ring pattern
- **WCAG**: Meets 2.4.7 Focus Visible requirement

**Keyboard Activation**:

| Role | Enter Key | Space Key |
|------|-----------|-----------|
| `'button'` | ✅ Triggers `onPress` | ✅ Triggers `onPress` |
| `'link'` | ✅ Triggers `onPress` | ❌ Does NOT trigger (scrolls page) |

**ARIA Semantics**:
- `role="button"` applied when `interactive={true}` and `role='button'` (default)
- `role="link"` applied when `interactive={true}` and `role='link'`
- No role applied when `interactive={false}`

#### Usage Example

```html
<!-- Web: Zero-config card -->
<container-card-base>
  <h3>Card Title</h3>
  <p>Card content</p>
</container-card-base>

<!-- Web: Interactive card -->
<container-card-base 
  interactive="true" 
  accessibility-label="View details"
>
  <h3>Card Title</h3>
  <p>Click to view details</p>
</container-card-base>

<!-- Web: Interactive link card -->
<container-card-base 
  interactive="true" 
  role="link"
  accessibility-label="Read article"
>
  <h3>Article Title</h3>
  <p>Article excerpt...</p>
</container-card-base>

<!-- Web: Asymmetric padding (image-bleeding card) -->
<container-card-base 
  padding-block-start="none"
  padding-horizontal="150"
  padding-block-end="150"
>
  <img src="hero.jpg" alt="Hero image" />
  <p>Card content below image</p>
</container-card-base>
```

```swift
// iOS: Zero-config card
ContainerCardBase {
    Text("Card Title").font(.headline)
    Text("Card content")
}

// iOS: Interactive card
ContainerCardBase(
    interactive: true,
    accessibilityLabel: "View details",
    onPress: { handlePress() }
) {
    Text("Card Title").font(.headline)
    Text("Click to view details")
}
```

```kotlin
// Android: Zero-config card
ContainerCardBase {
    Text("Card Title", style = MaterialTheme.typography.titleMedium)
    Text("Card content")
}

// Android: Interactive card
ContainerCardBase(
    interactive = true,
    accessibilityLabel = "View details",
    onPress = { handlePress() }
) {
    Text("Card Title", style = MaterialTheme.typography.titleMedium)
    Text("Click to view details")
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
| Color | `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary` | Card background colors |
| Color | `color.border`, `color.border.default`, `color.border.subtle` | Border colors |
| Shadow | `shadow.*`, `shadow.container` | Shadow styling |
| Border | `border.border.*` | Border widths |
| Border | `radius-*`, `radius.normal`, `radius.loose` | Border radius |
| Layering | `zIndex.*` | Stacking order (web/iOS) |
| Layering | `elevation.*` | Stacking order + shadow (Android) |
| Motion | `motion.focusTransition` | Hover/focus transition |
| Blend | `blend.hoverDarker` | Hover state (8% darker) |
| Blend | `blend.pressedDarker` | Press state (12% darker) |

### Token Resolution

Container components resolve tokens through the Rosetta System's semantic-to-primitive hierarchy. Color tokens resolve to theme-aware values supporting light/dark modes. On Android, elevation tokens handle both stacking order and shadow rendering.

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md) - Token routing table
- [Shadow Tokens](./Token-Family-Shadow.md) - Shadow token details
- [Layering Tokens](./Token-Family-Layering.md) - Layering token details

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
| Card with elevation | Container-Card-Base | Opinionated defaults, curated API |
| Interactive card | Container-Card-Base (interactive) | Built-in hover, press, focus, keyboard |
| Page section | Container-Base (semantic="section") | Semantic HTML for accessibility |
| Navigation wrapper | Container-Base (semantic="nav") | Semantic HTML for accessibility |
| Custom container needs | Container-Base | Full API access when Card-Base is too restrictive |

### Common Patterns

#### Card Pattern (Recommended: Container-Card-Base)

```html
<!-- Web: Zero-config card -->
<container-card-base>
  <h3>Card Title</h3>
  <p>Card content</p>
</container-card-base>

<!-- Web: Interactive card -->
<container-card-base interactive="true" accessibility-label="View details">
  <h3>Card Title</h3>
  <p>Click to view details</p>
</container-card-base>
```

#### Card Pattern (Alternative: Container-Base)

Use Container-Base directly when you need props not exposed by Container-Card-Base (e.g., `opacity`, `layering`):

```html
<!-- Web: Card with opacity -->
<container-base
  padding="200"
  background="color.surface"
  border-radius="normal"
  shadow="shadow.container"
  opacity="opacity.80"
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

| Platform | Technology | Container-Base Location | Container-Card-Base Location |
|----------|------------|-------------------------|------------------------------|
| Web | Web Components | `platforms/web/ContainerBase.web.ts` | `platforms/web/ContainerCardBase.web.ts` |
| iOS | SwiftUI | `platforms/ios/ContainerBase.ios.swift` | `platforms/ios/ContainerCardBase.ios.swift` |
| Android | Jetpack Compose | `platforms/android/ContainerBase.android.kt` | `platforms/android/ContainerCardBase.android.kt` |

### Platform-Specific Behaviors

#### Web

**Container-Base:**
- Uses Shadow DOM for style encapsulation
- Custom element registration: `<container-base>`
- Supports semantic HTML elements via semantic prop
- Hover state uses CSS `:hover` with blend utilities
- Uses CSS logical properties for directional padding (`padding-block`, `padding-inline`)

**Container-Card-Base:**
- Custom element registration: `<container-card-base>`
- Composes Container-Base internally
- Interactive cards support `:hover`, `:active`, and `:focus` states
- Keyboard activation based on `role` prop (Enter/Space)
- ARIA role applied based on `interactive` and `role` props

#### iOS

**Container-Base:**
- SwiftUI modifier chains for styling
- Supports safe area control via ignoresSafeArea prop
- Hover state uses `.onHover` modifier (macOS/iPadOS with pointer)
- Uses `@ViewBuilder` for child content

**Container-Card-Base:**
- Composes ContainerBase internally
- Interactive cards use `.simultaneousGesture` for tap feedback
- Accessibility traits based on `interactive` and `role` props
- VoiceOver support via `.accessibilityLabel()` and `.accessibilityAddTraits()`

#### Android

**Container-Base:**
- Jetpack Compose modifier chains for styling
- Elevation tokens handle both stacking order and shadow
- If both layering and shadow props provided, layering takes precedence
- Hover state uses hoverable modifier (desktop/ChromeOS with pointer)
- Development warning logged when both layering and shadow used

**Container-Card-Base:**
- Composes ContainerBase internally
- Interactive cards use `clickable` with indication
- Semantics based on `interactive` and `role` props
- TalkBack support via `contentDescription` and `role` in semantics

### Behavioral Consistency

All platforms implement the same behavioral contracts:

**Container-Base:**
- Padding values match across platforms
- Background colors resolve to same visual appearance
- Shadow rendering is mathematically equivalent
- Hover state uses same blend percentage (8% darker)

**Container-Card-Base:**
- Same curated prop subset across platforms
- Same opinionated defaults across platforms
- Interactive behavior consistent (hover 8%, press 12%)
- Keyboard activation follows platform conventions (web-specific Enter/Space handling)
- ARIA/accessibility semantics applied consistently

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Container-Base Schema](../../src/components/core/Container-Base/Container-Base.schema.yaml) - Full schema definition
- [Container-Base README](../../src/components/core/Container-Base/README.md) - Container-Base documentation
- [Container-Card-Base Schema](../../src/components/core/Container-Card-Base/Container-Card-Base.schema.yaml) - Card-Base schema definition
- [Container-Card-Base README](../../src/components/core/Container-Card-Base/README.md) - Card-Base documentation
- [Container-Card-Base Design](../../.kiro/specs/043-container-card-base/design.md) - Design specification
