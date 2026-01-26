# Container-Card-Base Component

**Stemma System Naming**: `[Family]-[Type]-[Variant]` = `Container-Card-Base`  
**Type**: Type Primitive (Card)  
**Family**: Containers  
**Version**: 1.0.0  
**Readiness**: Development 🟡

---

## Overview

Container-Card-Base is a type primitive component that provides card-specific styling and behaviors. It uses Container-Base internally via composition and exposes a curated subset of props appropriate for card use cases.

### Design Philosophy

Inspired by Spotify Encore and Shopify Polaris—opinionated defaults with constrained flexibility. The base provides consistent card styling through a filtered subset of Container-Base's API; semantic variants handle content-specific layouts.

### Key Features

- **Zero-Config Rendering**: Sensible defaults produce a good-looking card without configuration
- **Curated Props**: Only card-appropriate values exposed (no full Container-Base API)
- **Interactive Behavior**: Built-in hover, press, focus, and keyboard support
- **ARIA Semantics**: Automatic role application based on `interactive` and `role` props
- **Cross-Platform Consistency**: Identical API and behavior across web, iOS, and Android

---

## Default Semantic Tokens

Container-Card-Base uses these semantic tokens by default:

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

---

## Usage

### Web (Custom Element)

```html
<!-- Zero-config card (uses all defaults) -->
<container-card-base>
  <p>Card content</p>
</container-card-base>

<!-- Interactive card -->
<container-card-base interactive="true" accessibility-label="View details">
  <h3>Card Title</h3>
  <p>Card description</p>
</container-card-base>

<!-- Interactive link card -->
<container-card-base 
  interactive="true" 
  role="link"
  accessibility-label="Read article"
>
  <h3>Article Title</h3>
  <p>Article excerpt...</p>
</container-card-base>

<!-- Custom styling -->
<container-card-base 
  padding="200"
  background="surface.secondary"
  border="default"
  border-color="border.subtle"
  border-radius="loose"
>
  <p>Styled card content</p>
</container-card-base>

<!-- Asymmetric padding (image-bleeding card) -->
<container-card-base 
  padding-block-start="none"
  padding-horizontal="150"
  padding-block-end="150"
>
  <img src="hero.jpg" alt="Hero image" />
  <p>Card content below image</p>
</container-card-base>

<!-- Semantic HTML -->
<container-card-base semantic="article">
  <h2>Blog Post Title</h2>
  <p>Blog post content...</p>
</container-card-base>
```

### iOS (SwiftUI)

```swift
// Zero-config card (uses all defaults)
ContainerCardBase {
    Text("Card content")
}

// Interactive card
ContainerCardBase(
    interactive: true,
    accessibilityLabel: "View details"
) {
    VStack {
        Text("Card Title").font(.headline)
        Text("Card description")
    }
}

// Interactive link card
ContainerCardBase(
    interactive: true,
    role: .link,
    accessibilityLabel: "Read article",
    onPress: { navigateToArticle() }
) {
    VStack {
        Text("Article Title").font(.headline)
        Text("Article excerpt...")
    }
}

// Custom styling
ContainerCardBase(
    padding: .p200,
    background: .surfaceSecondary,
    border: .default,
    borderColor: .subtle,
    borderRadius: .loose
) {
    Text("Styled card content")
}

// Asymmetric padding
ContainerCardBase(
    paddingBlockStart: .none,
    paddingHorizontal: .p150,
    paddingBlockEnd: .p150
) {
    VStack {
        Image("hero")
        Text("Card content below image")
    }
}
```

### Android (Jetpack Compose)

```kotlin
// Zero-config card (uses all defaults)
ContainerCardBase {
    Text("Card content")
}

// Interactive card
ContainerCardBase(
    interactive = true,
    accessibilityLabel = "View details",
    onPress = { /* handle press */ }
) {
    Column {
        Text("Card Title", style = MaterialTheme.typography.titleMedium)
        Text("Card description")
    }
}

// Interactive link card
ContainerCardBase(
    interactive = true,
    role = CardRole.Link,
    accessibilityLabel = "Read article",
    onPress = { navigateToArticle() }
) {
    Column {
        Text("Article Title", style = MaterialTheme.typography.titleMedium)
        Text("Article excerpt...")
    }
}

// Custom styling
ContainerCardBase(
    padding = CardPadding.P200,
    background = CardBackground.SurfaceSecondary,
    border = CardBorder.Default,
    borderColor = CardBorderColor.Subtle,
    borderRadius = CardRadius.Loose
) {
    Text("Styled card content")
}

// Asymmetric padding
ContainerCardBase(
    paddingBlockStart = CardPadding.None,
    paddingHorizontal = CardPadding.P150,
    paddingBlockEnd = CardPadding.P150
) {
    Column {
        Image(painter = painterResource(R.drawable.hero), contentDescription = "Hero")
        Text("Card content below image")
    }
}
```

---

## Props

### Padding Props (Curated Subset)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| '100' \| '150' \| '200'` | `'150'` | Uniform padding |
| `paddingVertical` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Block-axis padding |
| `paddingHorizontal` | `'none' \| '100' \| '150' \| '200'` | - | Inline-axis padding |
| `paddingBlockStart` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Block-start padding |
| `paddingBlockEnd` | `'none' \| '050' \| '100' \| '150' \| '200'` | - | Block-end padding |
| `paddingInlineStart` | `'none' \| '100' \| '150' \| '200'` | - | Inline-start padding |
| `paddingInlineEnd` | `'none' \| '100' \| '150' \| '200'` | - | Inline-end padding |

**Padding Override Hierarchy** (highest to lowest priority):
1. Individual edges (`paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd`)
2. Axis props (`paddingVertical`, `paddingHorizontal`)
3. Uniform padding (`padding`)

**Note**: Vertical padding includes `'050'` for fine-tuning typography rhythm. Horizontal padding excludes `'050'` as it's rarely needed for horizontal spacing.

### Visual Styling Props (Curated Subset)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `background` | `'surface.primary' \| 'surface.secondary' \| 'surface.tertiary'` | `'surface.primary'` | Background color |
| `shadow` | `'none' \| 'container'` | `'container'` | Shadow |
| `border` | `'none' \| 'default'` | `'none'` | Border width |
| `borderColor` | `'border.default' \| 'border.subtle'` | `'border.default'` | Border color |
| `borderRadius` | `'normal' \| 'loose'` | `'normal'` | Border radius |

### Semantic & Accessibility Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `semantic` | `'div' \| 'section' \| 'article'` | `'div'` | Semantic HTML element (web only) |
| `accessibilityLabel` | `string` | - | Accessibility label for screen readers |

### Interactive Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `interactive` | `boolean` | `false` | Enable interactive behavior |
| `onPress` | `() => void` | - | Press callback (requires `interactive`) |
| `role` | `'button' \| 'link'` | `'button'` | ARIA role (requires `interactive`) |

### Standard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `any` | - | Child content |
| `testID` | `string` | - | Test identifier |

---

## Props NOT Exposed

These Container-Base props are intentionally excluded from Container-Card-Base:

| Prop | Reason |
|------|--------|
| `opacity` | Use background color variants instead |
| `layering` | Cards don't need z-index control; use layout composition |
| `ignoresSafeArea` | Cards should respect safe areas |
| `hoverable` | Derived from `interactive` prop; not directly exposed |

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

### Background Values

| Value | Token |
|-------|-------|
| `'surface.primary'` | `color.surface.primary` |
| `'surface.secondary'` | `color.surface.secondary` |
| `'surface.tertiary'` | `color.surface.tertiary` |

### Shadow Values

| Value | Token |
|-------|-------|
| `'none'` | - |
| `'container'` | `shadow.container` |

### Border Values

| Value | Token | Width |
|-------|-------|-------|
| `'none'` | - | 0px |
| `'default'` | `border.border.default` | 1px |

### Border Color Values

| Value | Token |
|-------|-------|
| `'border.default'` | `color.border.default` |
| `'border.subtle'` | `color.structure.border.subtle` |

### Border Radius Values

| Value | Token | Radius |
|-------|-------|--------|
| `'normal'` | `radius-100` | 8px |
| `'loose'` | `radius-200` | 16px |

---

## Behavioral Contracts

Container-Card-Base guarantees the following behaviors:

### Base Contracts (All Cards)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_visual_boundary` | Card has clear visual separation from background | web, ios, android |
| `provides_consistent_padding` | Content has consistent internal spacing | web, ios, android |
| `provides_rounded_corners` | Card has rounded corners per token | web, ios, android |

### Interactive Contracts (when `interactive={true}`)

| Contract | Description | Platforms |
|----------|-------------|-----------|
| `provides_hover_feedback` | Background darkens on hover (8% via blend token) | web |
| `provides_press_feedback` | Background darkens on press (12% via blend.pressedDarker, no scale) | web, ios, android |
| `provides_focus_indication` | Visible focus ring using established focus pattern | web, ios, android |
| `supports_keyboard_activation` | Enter activates; Space activates if `role="button"` | web |
| `applies_aria_role` | Applies `role="button"` or `role="link"` based on prop | web |

See `Container-Card-Base.schema.yaml` for detailed contract specifications.

---

## Interaction States

### Hover State (when `interactive={true}`)

- **Trigger**: Pointer device hover (web, macOS/iPadOS with trackpad)
- **Visual**: Background darkens using `blend.hoverDarker` (8% darker)
- **Transition**: Uses `motion.focusTransition` token (150ms ease-out)

### Press State (when `interactive={true}`)

- **Trigger**: Mouse down / touch start
- **Visual**: Background darkens using `blend.pressedDarker` (12% darker)
- **Transition**: Immediate on press, ease-out on release
- **Note**: No scale transform to avoid layout shift in card grids

### Focus State (when `interactive={true}`)

- **Trigger**: Keyboard focus (Tab navigation)
- **Visual**: Uses established DesignerPunk focus ring pattern

### Keyboard Activation (when `interactive={true}`)

| Role | Enter Key | Space Key |
|------|-----------|-----------|
| `'button'` | ✅ Triggers `onPress` | ✅ Triggers `onPress` |
| `'link'` | ✅ Triggers `onPress` | ❌ Does NOT trigger (scrolls page) |

---

## Platform-Specific Behavior

### Web
- Composes Container-Base internally
- Uses Shadow DOM for style encapsulation
- Supports semantic HTML elements via `semantic` prop
- Hover state uses CSS `:hover` with blend utilities
- Press state uses `:active` with blend utilities
- Focus ring uses established focus pattern
- Keyboard activation based on `role` prop

### iOS
- Composes ContainerBase internally
- Uses SwiftUI modifier chains for styling
- Hover state uses `.onHover` modifier (macOS/iPadOS with pointer)
- Press state uses `.simultaneousGesture` for tap feedback
- Accessibility traits based on `interactive` and `role` props

### Android
- Composes ContainerBase internally
- Uses Compose modifier chains for styling
- Hover state uses `hoverable` modifier (desktop/ChromeOS with pointer)
- Press state uses `clickable` with indication
- Semantics based on `interactive` and `role` props

---

## Accessibility

### WCAG Compliance

| Criterion | Description | Implementation |
|-----------|-------------|----------------|
| 1.4.11 | Non-text Contrast | Visual boundary provides clear separation |
| 1.4.12 | Text Spacing | Padding uses semantic spacing tokens |
| 1.4.13 | Content on Hover or Focus | Hover state provides visual feedback |
| 2.1.1 | Keyboard | Keyboard activation supported for interactive cards |
| 2.4.7 | Focus Visible | Focus ring visible for interactive cards |
| 4.1.2 | Name, Role, Value | ARIA role applied for interactive cards |

### Platform Accessibility

| Platform | Implementation |
|----------|----------------|
| Web | `aria-label`, `role` attributes |
| iOS | `.accessibilityLabel()`, `.accessibilityAddTraits()` for VoiceOver |
| Android | `contentDescription`, `role` in semantics for TalkBack |

---

## Error Handling

### Invalid Prop Values

| Scenario | Behavior |
|----------|----------|
| Invalid `padding` value | Fall back to default (`'150'`) |
| Invalid `background` value | Fall back to default (`'surface.primary'`) |
| `onPress` without `interactive={true}` | `onPress` is ignored |
| `role` without `interactive={true}` | `role` is ignored |

### Development Warnings

| Scenario | Warning |
|----------|---------|
| `onPress` provided but `interactive={false}` | "onPress will be ignored when interactive is false" |
| `role` provided but `interactive={false}` | "role will be ignored when interactive is false" |

---

## Composition Pattern

Container-Card-Base uses Container-Base internally via composition (not inheritance):

```typescript
// Simplified implementation pattern
function ContainerCardBase(props: ContainerCardBaseProps) {
  const { interactive, onPress, role, ...containerProps } = props;
  
  return (
    <ContainerBase
      {...mapToContainerBaseProps(containerProps)}
      hoverable={interactive}
      // Additional interactive handling
    >
      {props.children}
    </ContainerBase>
  );
}
```

This provides:
1. **Constrained Flexibility**: Only card-appropriate options exposed
2. **Opinionated Defaults**: Sensible values without configuration
3. **Centralized Updates**: Container-Base changes propagate automatically
4. **Escape Hatch**: Developers can use Container-Base directly if needed

---

## Related Documentation

- [Container-Card-Base Schema](./Container-Card-Base.schema.yaml) - Formal behavioral contracts
- [Container-Base Component](../Container-Base/README.md) - Underlying primitive component
- [Container-Card-Base Design](/.kiro/specs/043-container-card-base/design.md) - Design specification
- [Component-Family-Container](/.kiro/steering/Component-Family-Container.md) - Container family documentation
- [Stemma System Principles](/.kiro/steering/stemma-system-principles.md) - Component architecture standards

---

## Semantic Variants (Planned)

Container-Card-Base serves as the type primitive base for these planned semantic components:

| Component | Purpose | Status |
|-----------|---------|--------|
| `Container-Card-Senator` | Senator content format card | Planned |
| `Container-Card-Bill` | Bill content format card | Planned |
| `Container-Card-[ContentType]` | Content-specific card variants | Planned |

