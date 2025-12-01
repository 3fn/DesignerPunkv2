# Container Component

**Date**: November 30, 2025  
**Component**: Container  
**Type**: Primitive Layout Component  
**Platforms**: Web, iOS, Android

---

## Overview

Container is a foundational primitive component that provides structural wrapping with individual styling capabilities. It serves as the building block for semantic components (Card, Panel, Hero) by exposing granular styling props that map to design system tokens.

**Key Characteristics**:
- **Primitive Capability Provider**: Exposes individual styling capabilities, not preset variants
- **Token-First Architecture**: All styling references design system tokens
- **True Native Architecture**: Platform-specific implementations (web/iOS/Android)
- **Generated Type Safety**: Build-time type generation for flexible token acceptance
- **Compositional Design**: Semantic components compose Container with specific prop combinations

**What Container Is**:
- A layout primitive that wraps content with styling
- A capability provider for padding, background, shadow, border, etc.
- A foundation for building semantic components

**What Container Is Not**:
- Not a designed component with preset variants
- Not a replacement for semantic components (Card, Panel, Hero)
- Not a component with opinions about specific use cases

---

## Related Documentation

- [Requirements Document](../../../.kiro/specs/010-container-component/requirements.md) - Complete requirements and acceptance criteria
- [Design Document](../../../.kiro/specs/010-container-component/design.md) - Architecture and design decisions
- [Tasks Document](../../../.kiro/specs/010-container-component/tasks.md) - Implementation plan and progress

---

## Usage

### Basic Usage

```typescript
// Web
<Container padding="200" background="color.surface">
  <p>Content goes here</p>
</Container>

// iOS (SwiftUI)
Container(
  padding: .p200,
  background: "color.surface"
) {
  Text("Content goes here")
}

// Android (Jetpack Compose)
Container(
  padding = PaddingValue.P200,
  background = "color.surface"
) {
  Text("Content goes here")
}
```

### With Multiple Props

```typescript
// Web
<Container 
  padding="300"
  background="color.surface"
  shadow="shadow.container"
  borderRadius="normal"
  border="default"
>
  <h2>Card Title</h2>
  <p>Card content with multiple styling props</p>
</Container>

// iOS
Container(
  padding: .p300,
  background: "color.surface",
  shadow: "shadow.container",
  borderRadius: .normal,
  border: .default
) {
  VStack {
    Text("Card Title")
    Text("Card content")
  }
}

// Android
Container(
  padding = PaddingValue.P300,
  background = "color.surface",
  shadow = "shadow.container",
  borderRadius = BorderRadiusValue.Normal,
  border = BorderValue.Default
) {
  Column {
    Text("Card Title")
    Text("Card content")
  }
}
```

### Semantic HTML (Web Only)

```html
<!-- Article container -->
<Container semantic="article" padding="300">
  <h1>Article Title</h1>
  <p>Article content</p>
</Container>

<!-- Main content area -->
<Container semantic="main" padding="400">
  <h1>Page Title</h1>
  <!-- Page content -->
</Container>

<!-- Navigation container -->
<Container semantic="nav" padding="200">
  <!-- Navigation links -->
</Container>
```

### With Layering

```typescript
// Web
<Container layering="modal" background="color.surface" padding="300">
  <h2>Modal Content</h2>
</Container>

// iOS
Container(
  layering: .modal,
  background: "color.surface",
  padding: .p300
) {
  Text("Modal Content")
}

// Android
Container(
  layering = LayeringValue.Modal,
  background = "color.surface",
  padding = PaddingValue.P300
) {
  Text("Modal Content")
}
```

### With Accessibility Labels

```typescript
// Web
<Container accessibilityLabel="Product card" padding="200">
  <h3>Product Name</h3>
  <p>Product description</p>
</Container>

// iOS
Container(
  accessibilityLabel: "Product card",
  padding: .p200
) {
  VStack {
    Text("Product Name")
    Text("Product description")
  }
}

// Android
Container(
  accessibilityLabel = "Product card",
  padding = PaddingValue.P200
) {
  Column {
    Text("Product Name")
    Text("Product description")
  }
}
```

---

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `PaddingValue` | `'none'` | Internal spacing using inset tokens |
| `background` | `ColorTokenName` | `undefined` | Background color using semantic color tokens |
| `shadow` | `ShadowTokenName` | `undefined` | Shadow using semantic shadow tokens |
| `border` | `BorderValue` | `'none'` | Border width using border tokens |
| `borderRadius` | `BorderRadiusValue` | `'none'` | Corner rounding using radius tokens |
| `opacity` | `OpacityTokenName` | `undefined` | Transparency using semantic opacity tokens |
| `layering` | `LayeringValue` | `undefined` | Stacking order (z-index on web/iOS, elevation on Android) |
| `children` | `ReactNode \| SwiftUIView \| ComposableContent` | Required | Content to render inside Container |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |
| `semantic` | `SemanticHTMLElement` | `'div'` | Semantic HTML element (web only) |
| `ignoresSafeArea` | `boolean` | `false` | Ignore safe area insets (iOS only) |

### Type Definitions

```typescript
// Padding values (fixed set)
type PaddingValue = 
  | 'none'
  | '050'  // 4px
  | '100'  // 8px
  | '150'  // 12px
  | '200'  // 16px
  | '300'  // 24px
  | '400'; // 32px

// Border values (fixed set)
type BorderValue = 
  | 'none'
  | 'default'  // 1px
  | 'emphasis' // 2px
  | 'heavy';   // 4px

// Border radius values (fixed set)
type BorderRadiusValue = 
  | 'none'
  | 'tight'   // 4px
  | 'normal'  // 8px
  | 'loose';  // 16px

// Layering values (fixed set)
type LayeringValue = 
  | 'container'
  | 'navigation'
  | 'dropdown'
  | 'modal'
  | 'toast'
  | 'tooltip';

// Semantic HTML elements (web only)
type SemanticHTMLElement = 
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'fieldset';

// Generated types (flexible - updates when tokens change)
type ColorTokenName = 'color.surface' | 'color.background' | 'color.primary' | ...;
type ShadowTokenName = 'shadow.container' | 'shadow.modal' | 'shadow.sunrise' | ...;
type OpacityTokenName = 'opacity.subtle' | 'opacity.medium' | 'opacity.heavy' | ...;
```

---

## Token Consumption

Container references the following design system tokens:

### Spacing Tokens
- `space.inset.050` (4px) - padding="050"
- `space.inset.100` (8px) - padding="100"
- `space.inset.150` (12px) - padding="150"
- `space.inset.200` (16px) - padding="200"
- `space.inset.300` (24px) - padding="300"
- `space.inset.400` (32px) - padding="400"

### Color Tokens
- All semantic color tokens (via generated `ColorTokenName` type)
- Examples: `color.surface`, `color.background`, `color.primary`

### Shadow Tokens
- All semantic shadow tokens (via generated `ShadowTokenName` type)
- Examples: `shadow.container`, `shadow.modal`, `shadow.sunrise`, `shadow.noon`, `shadow.dusk`

### Border Tokens
- `border.default` (1px) - border="default"
- `border.emphasis` (2px) - border="emphasis"
- `border.heavy` (4px) - border="heavy"
- `color.border` - Border color (applied automatically)

### Radius Tokens
- `radius050` (4px) - borderRadius="tight"
- `radius100` (8px) - borderRadius="normal"
- `radius200` (16px) - borderRadius="loose"

### Opacity Tokens
- All semantic opacity tokens (via generated `OpacityTokenName` type)
- Examples: `opacity.subtle`, `opacity.medium`, `opacity.heavy`, `opacity.ghost`

### Layering Tokens (Platform-Specific)

**Web + iOS (Z-Index)**:
- `zIndex.container` (100)
- `zIndex.navigation` (200)
- `zIndex.dropdown` (300)
- `zIndex.modal` (400)
- `zIndex.toast` (500)
- `zIndex.tooltip` (600)

**Android (Elevation)**:
- `elevation.container` (8dp)
- `elevation.navigation` (4dp)
- `elevation.dropdown` (8dp)
- `elevation.modal` (16dp)
- `elevation.toast` (24dp)
- `elevation.tooltip` (24dp)

**Note**: Android elevation tokens couple stacking order with shadow rendering, following Material Design guidelines.

---

## Nested Containers

When nesting Container components with borderRadius and padding, follow this mathematical relationship for visually harmonious results:

### Formula

```
inner borderRadius = outer borderRadius - padding
```

### Example

```typescript
// Web
<Container borderRadius="loose" padding="100">  {/* loose=16px, padding=8px */}
  <Container borderRadius="normal">  {/* normal=8px (16 - 8 = 8) */}
    Content
  </Container>
</Container>

// iOS
Container(borderRadius: .loose, padding: .p100) {  // loose=16pt, padding=8pt
  Container(borderRadius: .normal) {  // normal=8pt (16 - 8 = 8)
    Text("Content")
  }
}

// Android
Container(borderRadius = BorderRadiusValue.Loose, padding = PaddingValue.P100) {
  Container(borderRadius = BorderRadiusValue.Normal) {
    Text("Content")
  }
}
```

### Visual Examples

**✅ Correct**: Inner radius = outer radius - padding
```
┌─────────────────────────┐
│ Outer (loose: 16px)     │
│  padding: 8px           │
│  ┌───────────────────┐  │
│  │ Inner (normal: 8) │  │
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**❌ Incorrect**: Inner radius = outer radius (creates awkward visual overlap)
```
┌─────────────────────────┐
│ Outer (loose: 16px)     │
│  padding: 8px           │
│  ┌───────────────────┐  │
│  │ Inner (loose: 16) │  │ ← Looks wrong
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Why This Works

The padding creates visual space between containers. Reducing the inner radius by the padding amount maintains consistent visual curvature and prevents awkward overlapping corners.

### Common Patterns

| Outer Radius | Padding | Recommended Inner Radius | Calculation |
|--------------|---------|--------------------------|-------------|
| loose (16px) | 100 (8px) | normal (8px) | 16 - 8 = 8 |
| loose (16px) | 200 (16px) | none (0px) | 16 - 16 = 0 |
| normal (8px) | 050 (4px) | tight (4px) | 8 - 4 = 4 |
| normal (8px) | 100 (8px) | none (0px) | 8 - 8 = 0 |

---

## Platform-Specific Notes

### Web Platform

**Semantic HTML Support**:
- Use `semantic` prop to render appropriate HTML elements
- Improves accessibility and SEO
- Default is `div` if not specified

```html
<Container semantic="article">  <!-- Renders as <article> -->
<Container semantic="main">     <!-- Renders as <main> -->
<Container semantic="nav">      <!-- Renders as <nav> -->
```

**Shadow DOM Encapsulation**:
- Container uses Shadow DOM for style encapsulation
- Styles don't leak to parent or children
- CSS custom properties used for token values

**Accessibility**:
- `accessibilityLabel` prop applies `aria-label` attribute
- Semantic HTML elements improve screen reader navigation

### iOS Platform

**SwiftUI Implementation**:
- Container uses SwiftUI modifier chains
- Native SwiftUI performance optimizations
- Token values are compile-time constants

**Safe Area Support**:
- Use `ignoresSafeArea` prop to extend content into safe area insets
- Useful for full-bleed backgrounds or edge-to-edge layouts

```swift
Container(
  ignoresSafeArea: true,
  background: "color.primary"
) {
  // Content extends into safe area
}
```

**Accessibility**:
- `accessibilityLabel` prop applies `.accessibilityLabel()` modifier
- Integrates with iOS VoiceOver

### Android Platform

**Jetpack Compose Implementation**:
- Container uses Compose modifier chains
- Native Compose recomposition optimizations
- Token values are compile-time constants

**Elevation Behavior**:
- Android elevation tokens couple stacking order with shadow rendering
- Follows Material Design elevation guidelines
- If both `layering` and `shadow` props provided, `layering` takes precedence

**Elevation Conflict Warning**:
```kotlin
// This logs a development warning
Container(
  layering = LayeringValue.Modal,  // Used
  shadow = "shadow.sunrise"        // Ignored with warning
) {
  // Content
}

// Console output:
// W/Container: Both layering and shadow props provided on Android.
//              Android elevation handles both stacking and shadow.
//              Using layering prop, shadow prop ignored.
```

**Accessibility**:
- `accessibilityLabel` prop applies `.semantics { contentDescription = ... }`
- Integrates with Android TalkBack

---

## Accessibility

Container supports WCAG 2.1 AA accessibility standards across all platforms.

### Accessibility Labels

**Purpose**: Provide descriptive labels for screen readers

**Usage**:
```typescript
// Web
<Container accessibilityLabel="Product card">
  {/* Renders with aria-label="Product card" */}
</Container>

// iOS
Container(accessibilityLabel: "Product card") {
  // Applies .accessibilityLabel("Product card")
}

// Android
Container(accessibilityLabel = "Product card") {
  // Applies Modifier.semantics { contentDescription = "Product card" }
}
```

### Semantic HTML (Web)

**Purpose**: Improve document structure and screen reader navigation

**Usage**:
```html
<!-- Article container -->
<Container semantic="article" accessibilityLabel="Blog post">
  <h1>Post Title</h1>
  <p>Post content</p>
</Container>

<!-- Main content area -->
<Container semantic="main">
  <h1>Page Title</h1>
  <!-- Page content -->
</Container>

<!-- Navigation -->
<Container semantic="nav" accessibilityLabel="Main navigation">
  <!-- Navigation links -->
</Container>
```

### Best Practices

1. **Use Semantic HTML**: Choose appropriate semantic elements for web implementations
2. **Provide Labels**: Add `accessibilityLabel` for containers with important content
3. **Maintain Hierarchy**: Use proper heading levels inside containers
4. **Test with Screen Readers**: Verify container content is accessible with VoiceOver/TalkBack
5. **Color Contrast**: Ensure sufficient contrast between background and text colors

---

## Examples

### Card Component (Semantic Component)

```typescript
// Card uses Container with specific prop combinations
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding="200"
      background="color.surface"
      shadow="shadow.container"
      borderRadius="normal"
    >
      {children}
    </Container>
  );
}
```

### Panel Component (Semantic Component)

```typescript
// Panel uses different Container prop combination
export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding="300"
      background="color.background"
      border="emphasis"
      borderRadius="tight"
    >
      {children}
    </Container>
  );
}
```

### Hero Component (Semantic Component)

```typescript
// Hero uses larger spacing and different layering
export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding="400"
      background="color.primary"
      layering="container"
      borderRadius="none"
    >
      {children}
    </Container>
  );
}
```

### Modal Container

```typescript
// Web
<Container 
  layering="modal"
  background="color.surface"
  padding="300"
  borderRadius="normal"
  shadow="shadow.modal"
>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</Container>

// iOS
Container(
  layering: .modal,
  background: "color.surface",
  padding: .p300,
  borderRadius: .normal,
  shadow: "shadow.modal"
) {
  VStack {
    Text("Modal Title")
    Text("Modal content")
  }
}

// Android
Container(
  layering = LayeringValue.Modal,  // Handles both z-order and shadow
  background = "color.surface",
  padding = PaddingValue.P300,
  borderRadius = BorderRadiusValue.Normal
  // Note: shadow prop not needed on Android (elevation handles it)
) {
  Column {
    Text("Modal Title")
    Text("Modal content")
  }
}
```

---

## Validation

**Note**: Validation files are automated tests that verify component behavior. They are not the source of truth for documentation - this README is the authoritative documentation.

**For AI Agents**: Code examples in this README are authoritative and should be referenced for correct usage patterns. However, code in validation/example files (`examples/*.html`) should NOT be copy-pasted into production implementations, as those files may use simplified patterns for demonstration purposes. Always refer to TypeScript interfaces (`types.ts`) and this README for correct prop types and usage.

### Validation Files

- `__tests__/Container.test.ts` - Core unit tests
- `platforms/web/__tests__/Container.web.test.ts` - Web-specific tests
- `platforms/ios/__tests__/Container.ios.swift` - iOS-specific tests
- `platforms/android/__tests__/Container.android.kt` - Android-specific tests
- `__tests__/integration/CrossPlatform.test.ts` - Integration tests

### Running Validation

```bash
# Run all Container tests
npm test -- Container

# Run platform-specific tests
npm test -- Container.web
npm test -- Container.ios
npm test -- Container.android

# Run integration tests
npm test -- CrossPlatform
```

---

## Migration and Versioning

### Current Version: v1.0.0

**Included Capabilities**:
- ✅ Padding (7 values: none, 050-400)
- ✅ Background (flexible via generated types)
- ✅ Shadow (flexible via generated types)
- ✅ Border (4 values: none, default, emphasis, heavy)
- ✅ Border Radius (4 values: none, tight, normal, loose)
- ✅ Opacity (flexible via generated types)
- ✅ Layering (6 values: container, navigation, dropdown, modal, toast, tooltip)
- ✅ Accessibility labels
- ✅ Web semantic HTML
- ✅ iOS safe area support
- ✅ Android elevation with warning

**Not Included in v1.0.0**:
- ❌ Gradient backgrounds (token system not yet designed)
- ❌ Advanced border controls (per-side borders, border colors)
- ❌ Transform properties (rotate, scale, translate)

### Future Enhancements

Future versions may include:
- Gradient background support (requires gradient token system)
- Per-side padding control (paddingTop, paddingBottom, etc.)
- Per-side border control (borderTop, borderBottom, etc.)
- Border color customization (currently uses color.border)
- Transform properties (if design system adds transform tokens)

All future enhancements will maintain backward compatibility with existing Container usage.

---

## Troubleshooting

### Issue: TypeScript Error for Token Names

**Symptom**: TypeScript error when using color/shadow/opacity token names

**Cause**: Generated types may be out of date

**Solution**: Run type generation to update token types
```bash
npm run generate:types
```

### Issue: Android Elevation Warning

**Symptom**: Console warning about both layering and shadow props on Android

**Cause**: Android elevation handles both stacking order and shadow rendering

**Solution**: Use only `layering` prop on Android, or ignore the warning if intentional
```kotlin
// Preferred: Use layering only
Container(layering = LayeringValue.Modal) { }

// Or: Use shadow only (no layering)
Container(shadow = "shadow.modal") { }
```

### Issue: Nested Container Corners Look Wrong

**Symptom**: Inner container corners don't align visually with outer container

**Cause**: Inner borderRadius not adjusted for outer padding

**Solution**: Follow nested Container formula: inner radius = outer radius - padding
```typescript
// Correct
<Container borderRadius="normal" padding="100">
  <Container borderRadius="none">  {/* 8 - 8 = 0 */}
```

### Issue: Container Not Rendering

**Symptom**: Container doesn't appear on screen

**Cause**: Missing required `children` prop or no visible styling

**Solution**: Ensure Container has children and at least one visible styling prop
```typescript
// Add background or border to make Container visible
<Container background="color.surface" padding="200">
  <p>Content</p>
</Container>
```

---

## Performance Considerations

### Build-Time Optimization

- Token types generated at build time (zero runtime cost)
- Platform-specific token values generated at build time
- TypeScript type checking happens at compile-time

### Runtime Performance

- Container is stateless (no internal state management)
- Props are simple values (no complex objects)
- Token values are constants (shared across all instances)
- Platform-native rendering optimizations (Shadow DOM, SwiftUI, Compose)

### Memory Footprint

- Minimal memory usage (no caching or memoization needed)
- Token constants shared across all Container instances
- No runtime token lookup or resolution

---

## Contributing

When contributing to Container:

1. **Maintain Token-First Architecture**: All styling must reference design system tokens
2. **Follow True Native Architecture**: Platform-specific implementations in separate files
3. **Update Generated Types**: Run `npm run generate:types` after token changes
4. **Add Tests**: Include tests for new functionality across all platforms
5. **Update Documentation**: Keep this README in sync with implementation changes
6. **Preserve Backward Compatibility**: New props should be additive, not breaking

---

**Component**: Container  
**Version**: 1.0.0  
**Last Updated**: November 30, 2025  
**Maintainer**: DesignerPunk Design System Team
