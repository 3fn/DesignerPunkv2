---
inclusion: manual
---

# Icons Components

**Date**: 2026-01-02
**Purpose**: MCP-queryable documentation for Icons component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, icon-implementation
**Last Reviewed**: 2026-01-02

---

## Family Overview

**Family**: Icons
**Shared Need**: Visual communication
**Readiness**: 🟢 Production Ready

### Purpose

The Icons family provides inline SVG icon components with automatic color inheritance and typography-aligned sizing. All components render decorative icons that inherit color from parent elements, ensuring consistent visual integration with surrounding UI.

### Key Characteristics

- **Color Inheritance**: Icons automatically inherit color from parent elements via currentColor
- **Typography-Aligned Sizing**: 11 size variants calculated from fontSize × lineHeight formula
- **Optical Balance**: Optional 8% lighter blend for icon-text pairing
- **Decorative by Default**: Icons are hidden from assistive technology (parent provides context)
- **Cross-Platform Consistent**: Feather Icons standard with consistent stroke attributes

### Stemma System Integration

- **Primitive Base**: Icon-Base
- **Semantic Variants**: 0 implemented, 3 planned (Status, Action, Navigation)
- **Cross-Platform**: web, ios, android

---

## Inheritance Structure

### Component Hierarchy

```
Icon-Base (Primitive)
    │
    ├── Icon-Status (Semantic) [PLANNED]
    │   └── Status-specific icons with semantic colors
    │
    ├── Icon-Action (Semantic) [PLANNED]
    │   └── Action icons with interactive states
    │
    └── Icon-Navigation (Semantic) [PLANNED]
        └── Navigation icons with directional semantics
```

### Primitive Component

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Icon-Base | Primitive | 🟢 Production Ready | Foundational icon with color inheritance and sizing |

### Semantic Components

| Component | Inherits From | Status | Specialized Purpose |
|-----------|---------------|--------|---------------------|
| Icon-Status | Icon-Base | 🔴 Planned | Status-specific icons with semantic colors |
| Icon-Action | Icon-Base | 🔴 Planned | Action icons with interactive states |
| Icon-Navigation | Icon-Base | 🔴 Planned | Navigation icons with directional semantics |

---

## Behavioral Contracts

### Base Contracts (Inherited by All)

All components in the Icons family inherit these 5 foundational contracts from Icon-Base:

| Contract | Description | WCAG | Platforms |
|----------|-------------|------|-----------|
| `renders_svg` | Renders inline SVG with correct viewBox and stroke | N/A | web, ios, android |
| `color_inheritance` | Inherits color from parent via currentColor | 1.4.1 | web, ios, android |
| `size_variants` | Supports 11 size variants from typography scale | N/A | web, ios, android |
| `optical_balance` | Optional 8% lighter blend for icon-text pairing | 1.4.3 | web, ios, android |
| `accessibility_hidden` | Decorative icons hidden from assistive technology | 1.1.1 | web, ios, android |

### Contract Details

#### renders_svg

**Description**: Renders inline SVG with correct viewBox and stroke attributes.

**Behavior**: Icon-Base renders an inline SVG element with viewBox="0 0 24 24" (Feather Icons standard), fill="none" (stroke-based icons), stroke-linecap="round", stroke-linejoin="round", and stroke-width from `--icon-stroke-width` token.

**WCAG Compliance**: N/A

#### color_inheritance

**Description**: Inherits color from parent via currentColor.

**Behavior**: By default, Icon-Base inherits color from its parent element using platform-specific mechanisms: Web uses `stroke="currentColor"`, iOS uses `.renderingMode(.template)`, Android uses `tint = LocalContentColor.current`.

**WCAG Compliance**: 1.4.1 Use of Color

#### size_variants

**Description**: Supports 11 size variants calculated from typography scale.

**Behavior**: Icon-Base supports 11 size variants calculated from fontSize × lineHeight formula to maintain optical balance with paired typography:
- 13px (caption, legal, labelXs)
- 18px (bodySm, buttonSm, labelSm)
- 24px (bodyMd, buttonMd, labelMd, input) - standard
- 28px (h6)
- 32px (bodyLg, buttonLg, h5, h4)
- 36px (h3)
- 40px (h2)
- 44px (h1)
- 48px (display)

**WCAG Compliance**: N/A

#### optical_balance

**Description**: Optional 8% lighter blend for icon-text pairing.

**Behavior**: When opticalBalance prop is true and a hex color is provided, Icon-Base applies `lighterBlend(color, blend.iconLighter)` to compensate for icons appearing heavier than adjacent text due to stroke density and fill area.

**WCAG Compliance**: 1.4.3 Contrast (Minimum)

#### accessibility_hidden

**Description**: Decorative icons hidden from assistive technology.

**Behavior**: Icon-Base icons are decorative and hidden from assistive technology. Parent elements (buttons, links) provide accessible labels. Web uses `aria-hidden="true"`, iOS uses `.accessibilityHidden(true)`, Android uses `contentDescription = null`.

**WCAG Compliance**: 1.1.1 Non-text Content

---

## Component Schemas

### Icon-Base

**Type**: Primitive
**Status**: 🟢 Production Ready
**Inherits**: None

#### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `IconBaseName` | Yes | - | Icon name (type-safe) |
| `size` | `IconBaseSize` | Yes | - | Icon size in pixels (13, 18, 24, 28, 32, 36, 40, 44, 48) |
| `color` | `'inherit' \| string` | No | `'inherit'` | Color override for optical weight compensation |
| `opticalBalance` | `boolean` | No | `false` | Apply 8% lighter blend for icon-text pairing |
| `className` | `string` | No | - | Additional CSS class names (web only) |
| `style` | `Record<string, any>` | No | - | Style overrides (web only) |
| `testID` | `string` | No | - | Test identifier |

#### Available Icons

| Category | Icons |
|----------|-------|
| Navigation | arrow-right, arrow-left, arrow-up, arrow-down, chevron-right, chevron-left, chevron-up, chevron-down |
| Actions | check, x, x-circle, info, plus, minus, edit, trash, copy, save |
| UI Elements | circle, heart, star, bell, search, menu, settings, user, mail, calendar |

#### Size Variants

| Size | Pixels | Typography Pairing |
|------|--------|-------------------|
| size050 | 13px | caption, legal, labelXs |
| size075 | 18px | bodySm, buttonSm, labelSm |
| size100 | 24px | bodyMd, buttonMd, labelMd, input (standard) |
| size125 | 32px | bodyLg, buttonLg, labelLg |
| size150 | 28px | h6 |
| size200 | 32px | h5 |
| size300 | 32px | h4 |
| size400 | 36px | h3 |
| size500 | 40px | h2 |
| size600 | 44px | h1 |
| size700 | 48px | display |

#### Usage Example

```html
<!-- Web -->
<icon-base name="check" size="24"></icon-base>

<!-- With color override -->
<icon-base name="heart" size="24" color="#FF0000"></icon-base>

<!-- With optical balance -->
<icon-base name="info" size="24" color="#333333" optical-balance></icon-base>
```

```swift
// iOS
IconBase(name: .check, size: .size100)

// With color override
IconBase(name: .heart, size: .size100, color: .red)

// With optical balance
IconBase(name: .info, size: .size100, color: "#333333", opticalBalance: true)
```

```kotlin
// Android
IconBase(name = IconName.Check, size = IconSize.Size100)

// With color override
IconBase(name = IconName.Heart, size = IconSize.Size100, color = Color.Red)

// With optical balance
IconBase(name = IconName.Info, size = IconSize.Size100, color = "#333333", opticalBalance = true)
```

---

## Token Dependencies

### Required Tokens

Components in the Icons family consume these design tokens:

| Category | Token Pattern | Purpose |
|----------|---------------|---------|
| Icon | `icon.size050` through `icon.size700` | Icon sizing |
| Icon | `icon.strokeWidth` | Stroke width |
| Blend | `blend.iconLighter` | Optical balance (8% lighter) |
| Color | `color.print.default` | Default icon color |

### Token Resolution

Icon components resolve tokens through the Rosetta System's semantic-to-primitive hierarchy. Size tokens are calculated from typography scale to maintain optical balance with paired text.

### Related Token Documentation

- [Token Quick Reference](./Token-Quick-Reference.md) - Token routing table
- [Blend Tokens](./Token-Family-Blend.md) - Blend token details

---

## Usage Guidelines

### When to Use Icons

**Use Icon components when**:
- Adding visual indicators to buttons, links, or labels
- Providing visual cues for actions or status
- Enhancing navigation with directional indicators
- Decorating UI elements with recognizable symbols

**Do NOT use Icon components when**:
- Icon is the only way to convey information (add text label)
- Creating complex illustrations (use images instead)
- Building logos or brand marks (use dedicated assets)

### Primitive vs Semantic Selection

| Scenario | Recommended Component | Rationale |
|----------|----------------------|-----------|
| Generic icon display | Icon-Base | Flexible color and sizing |
| Status indicator | Icon-Base (until Icon-Status available) | Use with semantic color |
| Action button icon | Icon-Base (until Icon-Action available) | Pair with Button component |
| Navigation arrow | Icon-Base (until Icon-Navigation available) | Use directional icons |

### Common Patterns

#### Button with Icon

```html
<!-- Web -->
<button-cta label="Save" icon="check"></button-cta>
```

#### Icon with Text

```html
<!-- Web -->
<span style="display: flex; align-items: center; gap: 8px;">
  <icon-base name="info" size="24"></icon-base>
  <span>Information</span>
</span>
```

### Accessibility Considerations

- **Decorative by Default**: Icons are hidden from screen readers; parent elements provide context
- **Color Independence**: Never use color alone to convey meaning; pair with text or other indicators
- **Optical Balance**: Use opticalBalance prop when icons appear heavier than adjacent text
- **Parent Context**: Ensure parent elements (buttons, links) have accessible labels

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | File Location |
|----------|------------|---------------|
| Web | Web Components | `platforms/web/IconBase.web.ts` |
| iOS | SwiftUI | `platforms/ios/IconBase.ios.swift` |
| Android | Jetpack Compose | `platforms/android/IconBase.android.kt` |

### Platform-Specific Behaviors

#### Web

- Uses Shadow DOM for style encapsulation
- Custom element registration: `<icon-base>`
- Inline SVG rendering with currentColor inheritance
- CSS classes for size variants (icon-base--size-*)
- Supports className and style props for customization

#### iOS

- Uses Image from Asset Catalog with template rendering mode
- Color inheritance via `.foregroundColor(.primary)`
- Optical balance via `iconBlend()` extension
- testID via `.accessibilityIdentifier()`
- Icon typealias for backward compatibility

#### Android

- Uses Icon composable with painterResource
- Color inheritance via `LocalContentColor.current`
- Optical balance via `iconBlend()` extension function
- Decorative icons use `contentDescription = null`
- Icon composable wrapper for backward compatibility

### Behavioral Consistency

All platforms implement the same behavioral contracts:
- Color inheritance works identically across platforms
- Size variants render at same pixel dimensions
- Optical balance applies same 8% lighter blend
- Accessibility hiding is consistent

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation
- [MCP Component Family Document Template](./Component-MCP-Document-Template.md) - Template specification
- [Icon-Base Schema](../../../src/components/core/Icon-Base/Icon-Base.schema.yaml) - Full schema definition
