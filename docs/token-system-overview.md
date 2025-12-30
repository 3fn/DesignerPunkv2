# Token System Overview

**Date**: December 29, 2025
**Last Updated**: December 29, 2025
**Purpose**: Master document mapping token files to their documentation guides
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2

---

## Document Outline

This document is organized for efficient MCP section queries. Use `get_section` with these headings:

| Section | Purpose |
|---------|---------|
| [Quick Reference](#quick-reference) | Token counts, file locations, status summary |
| [Getting Started](#getting-started) | Learning path for new users and AI agents |
| [System Architecture](#system-architecture) | Validators, registries, coordinators |
| [Primitive Tokens](#primitive-tokens) | All primitive token files and descriptions |
| [Semantic Tokens](#semantic-tokens) | All semantic token files and descriptions |
| [Blend Infrastructure](#blend-infrastructure) | Blend utilities and theme-aware patterns |
| [Token Generation](#token-generation) | Cross-platform generation system |
| [Related Documentation](#related-documentation) | Links to specs, guides, and patterns |

---

## Quick Reference

### Token Inventory Summary

| Category | Primitive Count | Semantic Count | Status |
|----------|-----------------|----------------|--------|
| Spacing | 12 | 20+ | ✅ Complete |
| Typography | 40+ | 25+ | ✅ Complete |
| Color | 45+ | 15+ | ✅ Complete |
| Radius | 12 | 6 | ✅ Complete |
| Shadow | 23 | 8 | ✅ Complete |
| Glow | 9 | 3 | ✅ Complete |
| Blend | 5 | 7 | ✅ Complete |
| Opacity | 14 | 8 | ✅ Complete |
| Border Width | 3 | 5 | ✅ Complete |
| Layering | - | 12 | ✅ Complete |
| Motion | 12 | 1+ | ✅ Complete |
| Accessibility | - | 8 | ✅ Complete |
| Breakpoint | 4 | - | ✅ Complete |
| Grid Spacing | - | 8 | ✅ Complete |
| Density | 4 | - | ✅ Complete |
| Tap Area | 4 | - | ✅ Complete |
| **Total** | **~185** | **~125** | **~310 tokens** |

### Key File Locations

```
src/tokens/                    # Primitive tokens
src/tokens/semantic/           # Semantic tokens
src/blend/                     # Blend utilities
dist/                          # Generated platform files
docs/tokens/                   # Token guides
```

### Current Version

- **Token System**: Phase 1 Complete
- **Blend Infrastructure**: v2.1.0 (December 2025)
- **Test Coverage**: 6,000+ tests, 262 suites

---

## Getting Started

### Learning Path for New Users

1. **[Token Ecosystem Narrative](./concepts/token-ecosystem-narrative.md)** - Understand the conceptual foundation through the business localization metaphor
2. **[Token System Overview](#introduction)** (this document) - Navigate to specific token files and documentation
3. **[Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md)** - Learn patterns for adding new token categories

### Quick Navigation

- [Primitive Tokens](#primitive-tokens) - Find primitive token implementation files
- [Semantic Tokens](#semantic-tokens) - Find semantic token compositions
- [Blend Infrastructure](#blend-infrastructure) - Blend utilities and theme-aware patterns
- [Related Documentation](#related-documentation) - Explore specifications and guides

### For AI Agents

This document is optimized for MCP section queries. Key patterns:

- **Finding token files**: Query "Primitive Tokens" or "Semantic Tokens" sections
- **Understanding blend utilities**: Query "Blend Infrastructure" section
- **Cross-platform generation**: Query "Token Generation" section
- **Architecture patterns**: Query "System Architecture" section

**Recommendation**: Read the Token Ecosystem Narrative to understand DesignerPunk's specific approach before making implementation decisions.

---

## Introduction

The DesignerPunk token system provides a mathematical foundation for cross-platform design consistency. It follows a primitive→semantic hierarchy where:

- **Primitive Tokens**: Base-level tokens with mathematical relationships (fontSize, spacing, colors)
- **Semantic Tokens**: Higher-level tokens that compose primitives for specific use cases (typography, semantic colors)

### Core Principles

1. **Mathematical Foundation**: 8px baseline grid with 1.125 modular scale
2. **Cross-Platform Consistency**: Same token values across Web, iOS, Android
3. **Primitive→Semantic Hierarchy**: Semantic tokens reference primitives by name
4. **AI-Friendly**: Unambiguous relationships enable reliable AI collaboration

---

## System Architecture

### Component Overview

The token system follows a clear separation of concerns:

**Validators** (IValidator implementations):
- Validate tokens against specific criteria (baseline grid, mathematical relationships)
- Return structured validation results (Pass/Warning/Error)
- Focus solely on validation logic

**Registries** (IRegistry implementations):
- Store and retrieve tokens (primitive and semantic)
- Provide query operations (get, has, query)
- Focus solely on storage operations

**Coordinators** (ValidationCoordinator, TokenEngine):
- Coordinate validation and registration
- Call validators before registration
- Handle validation failures appropriately

### Validation Pattern

The system uses a **caller-validates-then-registers** pattern:

```typescript
// 1. Validate the token
const validationResult = validator.validate(token);

// 2. Check validation result
if (validationResult.valid) {
  // 3. Register the token
  registry.register(token);
} else {
  // 4. Handle validation failure
  throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
}
```

### Validators

- **BaselineGridValidator**: Ensures spacing aligns to 4px/8px grid
- **SemanticTokenValidator**: Verifies primitive references exist
- **SyntaxValidator**: Checks token structure and naming
- **ThreeTierValidator**: Orchestrates multiple validators with Pass/Warning/Error levels

### Related Architecture Documentation

- [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md) - Definitive guide for validation and registration patterns

---

## Primitive Tokens

### Typography Primitives

#### Font Size Tokens
- **File**: `src/tokens/FontSizeTokens.ts`
- **Description**: Font size tokens based on 1.125 modular scale (major second)
- **Base Value**: 16px (standard browser default)
- **Scale**: 1.125 modular scale ratio
- **Tokens**: fontSize050 (13px) through fontSize600 (41px)

#### Line Height Tokens
- **File**: `src/tokens/LineHeightTokens.ts`
- **Description**: Line height tokens using precision multipliers for 8pt vertical rhythm
- **Base Value**: 1.5 (optimal reading ratio)
- **Tokens**: lineHeight075 through lineHeight200

#### Font Weight Tokens
- **File**: `src/tokens/FontWeightTokens.ts`
- **Description**: Standard numeric font weight values with systematic progression
- **Base Value**: 400 (normal weight)
- **Tokens**: fontWeight100 through fontWeight900

#### Font Family Tokens
- **File**: `src/tokens/FontFamilyTokens.ts`
- **Description**: Categorical font stack definitions for different use cases
- **Tokens**: fontFamilySystem, fontFamilyMono, fontFamilyDisplay, fontFamilyBody

#### Letter Spacing Tokens
- **File**: `src/tokens/LetterSpacingTokens.ts`
- **Description**: Unitless em-based values for character spacing adjustments
- **Base Value**: 0 (normal spacing)
- **Tokens**: letterSpacingTight (-0.05em) through letterSpacingLoose (0.05em)

### Spacing Primitives

#### Spacing Tokens
- **File**: `src/tokens/SpacingTokens.ts`
- **Description**: 8-unit baseline grid with strategic flexibility exceptions
- **Base Value**: 8px
- **Grid**: 8-unit baseline with 4px subgrid alignment
- **Tokens**: space050 (4px), space075 (6px), space100 (8px), space150 (12px), space200 (16px), etc.
- **Related Guide**: [Spacing Tokens Guide](./tokens/spacing-tokens.md)

### Color Primitives

#### Color Tokens
- **File**: `src/tokens/ColorTokens.ts`
- **Description**: Mode-aware and theme-aware color primitives with systematic color families
- **Families**: gray, black, white, yellow, orange, purple, violet, cyan, teal
- **Modes**: Light/dark mode support
- **Themes**: Base and WCAG-compliant themes
- **Shadow Colors**: shadowBlack100, shadowBlue100, shadowOrange100, shadowGray100 (art theory-based)

### Shape Primitives

#### Radius Tokens
- **File**: `src/tokens/RadiusTokens.ts`
- **Description**: Border radius values following 8-unit baseline grid
- **Base Value**: 8px
- **Tokens**: radius050 (4px), radius100 (8px), radius200 (16px), radiusFull (9999px)

#### Border Width Tokens
- **File**: `src/tokens/BorderWidthTokens.ts`
- **Description**: Border width values with doubling progression
- **Tokens**: borderWidth100 (1px), borderWidth200 (2px), borderWidth400 (4px)

### Effect Primitives

#### Shadow Offset Tokens
- **File**: `src/tokens/ShadowOffsetTokens.ts`
- **Description**: Shadow direction based on light source position (sun arc concept)
- **Base Value**: 4px (4px baseline grid alignment)
- **Positions**: sunrise, morning, noon, afternoon, sunset
- **Related Guide**: [Shadow Tokens Guide](./tokens/shadow-tokens.md)

#### Shadow Blur Tokens
- **File**: `src/tokens/ShadowBlurTokens.ts`
- **Description**: Shadow edge definition based on quality and depth
- **Quality Levels**: hard, moderate, soft
- **Depth Levels**: depth100, depth200, depth300

#### Shadow Opacity Tokens
- **File**: `src/tokens/ShadowOpacityTokens.ts`
- **Description**: Shadow darkness based on quality and depth
- **Base Value**: 0.3 (unitless)
- **Range**: 0.1-0.5

#### Glow Blur Tokens
- **File**: `src/tokens/GlowBlurTokens.ts`
- **Description**: Extended blur range for radial emphasis effects
- **Base Value**: 8px
- **Tokens**: glowBlur100 (8px) through glowBlur500 (64px)
- **Related Guide**: [Glow Tokens Guide](./tokens/glow-tokens.md)

#### Glow Opacity Tokens
- **File**: `src/tokens/GlowOpacityTokens.ts`
- **Description**: Decreasing progression for multi-layer glow effects
- **Base Value**: 0.8 (unitless)
- **Tokens**: glowOpacity100 (0.8) through glowOpacity400 (0.2)

#### Opacity Tokens
- **File**: `src/tokens/OpacityTokens.ts`
- **Description**: Comprehensive opacity progression for various use cases
- **Range**: opacity005 (0.05) through opacity100 (1.0)
- **Count**: 14 tokens

#### Blend Tokens
- **File**: `src/tokens/BlendTokens.ts`
- **Description**: Blend amount scale for color modifications
- **Base Value**: 0.04 (4%)
- **Scale**: 5 tokens in 4% increments (blend100=4% through blend500=20%)
- **Related Guide**: [Blend Tokens Guide](./tokens/blend-tokens.md)

### Motion Primitives

#### Duration Tokens
- **File**: `src/tokens/DurationTokens.ts`
- **Description**: Animation timing with linear progression
- **Tokens**: duration150 (150ms fast), duration250 (250ms standard), duration350 (350ms deliberate)

#### Easing Tokens
- **File**: `src/tokens/EasingTokens.ts`
- **Description**: Material Design cubic-bezier curves for natural motion
- **Tokens**: easingStandard, easingDecelerate, easingAccelerate

#### Scale Tokens
- **File**: `src/tokens/ScaleTokens.ts`
- **Description**: Transform scale factors for size-based animations
- **Range**: scale088 (0.88) through scale108 (1.08)
- **Progression**: 8-interval steps

### Layout Primitives

#### Breakpoint Tokens
- **File**: `src/tokens/BreakpointTokens.ts`
- **Description**: Viewport width definitions for responsive layouts
- **Tokens**: breakpointXs (320px), breakpointSm (375px), breakpointMd (1024px), breakpointLg (1440px)

#### Density Tokens
- **File**: `src/tokens/DensityTokens.ts`
- **Description**: Selective scaling factors for functional tokens
- **Range**: 0.75x through 1.5x

#### Tap Area Tokens
- **File**: `src/tokens/TapAreaTokens.ts`
- **Description**: WCAG 2.1 AA/AAA compliant touch target sizes
- **Range**: 44pt through 64pt

---

## Semantic Tokens

### Typography Semantics

#### Typography Tokens
- **File**: `src/tokens/semantic/TypographyTokens.ts`
- **Description**: Complete typography styles combining fontSize, lineHeight, fontFamily, fontWeight, letterSpacing
- **Categories**:
  - Body: bodySm, bodyMd, bodyLg
  - Labels: labelXs, labelSm, labelMd, labelLg
  - Code: codeSm, codeMd, codeLg
  - Buttons: buttonSm, buttonMd, buttonLg
  - Headings: h1-h6 (all using display font family)
  - Display: display, displayLarge
- **Related Guides**:
  - [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md)
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md)
  - [Inline Emphasis Guide](../.kiro/specs/typography-token-expansion/inline-emphasis-guide.md)
  - [Migration Guide](../.kiro/specs/typography-token-expansion/migration-guide.md)

### Color Semantics

#### Semantic Color Tokens
- **File**: `src/tokens/semantic/ColorTokens.ts`
- **Description**: Purpose-driven color assignments for UI elements
- **Tokens**: color.primary, color.error, color.success, color.warning, color.info, color.text, color.background, color.surface

### Spacing Semantics

#### Semantic Spacing Tokens
- **File**: `src/tokens/semantic/SpacingTokens.ts`
- **Description**: Layout pattern-specific spacing values
- **Layout Tokens** (external spacing):
  - space.grouped.* - Elements in same logical group (2-12pt)
  - space.related.* - Connected but distinct elements (8-24pt)
  - space.separated.* - Independent elements (16-32pt)
  - space.sectioned.* - Major section boundaries (32-48pt)
- **Inset Tokens** (internal spacing):
  - space.inset.tight (4pt)
  - space.inset.normal (8pt)
  - space.inset.comfortable (12pt)
  - space.inset.spacious (16pt)
  - space.inset.expansive (24pt)
- **Related Guide**: [Spacing Tokens Guide](./tokens/spacing-tokens.md)

#### Grid Spacing Tokens
- **File**: `src/tokens/semantic/GridSpacingTokens.ts`
- **Description**: Gutter and margin tokens for responsive grid layouts
- **Tokens**: 8 semantic tokens referencing spacing primitives per breakpoint

### Effect Semantics

#### Semantic Shadow Tokens
- **File**: `src/tokens/semantic/ShadowTokens.ts`
- **Description**: Complete shadow compositions for specific use cases
- **Tokens**: shadow.container, shadow.modal, shadow.hover, shadow.fab
- **Composition**: offsetX, offsetY, blur, opacity, color primitives
- **Related Guides**:
  - [Shadow Tokens Guide](./tokens/shadow-tokens.md)
  - [Lighting Framework Guide](../.kiro/specs/shadow-glow-token-system/lighting-framework.md)

#### Semantic Opacity Tokens
- **File**: `src/tokens/semantic/OpacityTokens.ts`
- **Description**: Purpose-driven opacity values
- **Tokens**: opacity.disabled, opacity.overlay, opacity.hover, opacity.pressed, opacity.ghost

#### Semantic Blend Tokens
- **File**: `src/tokens/semantic/BlendTokens.ts`
- **Description**: Contextual blend amounts for interaction states
- **Tokens**: blend.hoverDarker, blend.hoverLighter, blend.pressedDarker, blend.focusSaturate, blend.disabledDesaturate, blend.containerHoverDarker, color.icon.opticalBalance
- **Related Guides**:
  - [Blend Tokens Guide](./tokens/blend-tokens.md)
  - [Blend Infrastructure Design](../.kiro/specs/031-blend-infrastructure-implementation/design.md)

### Shape Semantics

#### Semantic Radius Tokens
- **File**: `src/tokens/semantic/RadiusTokens.ts`
- **Description**: Component-specific border radius values
- **Tokens**: radius.button, radius.card, radius.input, radius.modal, radius.pill, radius.circle

#### Semantic Border Width Tokens
- **File**: `src/tokens/semantic/BorderWidthTokens.ts`
- **Description**: Component-specific border widths
- **Tokens**: border.input, border.divider, border.focus, border.card, border.emphasis

### Layering Semantics

#### Layering Tokens (Unified Entry Point)
- **File**: `src/tokens/semantic/LayeringTokens.ts`
- **Description**: Unified API re-exporting z-index and elevation tokens
- **Helpers**: `getAllLayeringTokens()`, `getLayeringTokensByPlatform(platform)`

#### Z-Index Tokens (Web + iOS)
- **File**: `src/tokens/semantic/ZIndexTokens.ts`
- **Description**: Stacking order tokens for web and iOS
- **Values**: 100-based increments (100, 200, 300, 400, 500, 600)
- **Levels**: container, navigation, dropdown, modal, toast, tooltip

#### Elevation Tokens (Android)
- **File**: `src/tokens/semantic/ElevationTokens.ts`
- **Description**: Material Design elevation tokens for Android
- **Values**: Material Design scale (4dp, 8dp, 16dp, 24dp)
- **Related Guide**: [Layering Tokens Guide](./tokens/layering-tokens.md)

### Motion Semantics

#### Semantic Motion Tokens
- **File**: `src/tokens/semantic/MotionTokens.ts`
- **Description**: Compositional animation tokens combining duration, easing, and scale
- **Tokens**: motion.floatLabel (250ms + easingStandard for text input animations)

### Accessibility Semantics

#### Accessibility Tokens
- **File**: `src/tokens/semantic/AccessibilityTokens.ts`
- **Description**: WCAG-compliant accessibility tokens
- **Documentation**: `src/tokens/semantic/AccessibilityTokens.README.md`
- **Count**: 8 tokens

### Icon Semantics

#### Icon Tokens
- **File**: `src/tokens/semantic/IconTokens.ts`
- **Description**: Icon sizing tokens calculated from typography line heights
- **Sizes**: 8 variants (13px-48px)

### Style Compositions

#### Style Tokens
- **File**: `src/tokens/semantic/StyleTokens.ts`
- **Description**: Complete component styling patterns combining multiple primitives

---

## Blend Infrastructure

### Overview

The blend infrastructure (v2.1.0, December 2025) provides cross-platform color blending utilities integrated into the build pipeline. This addresses the gap where blend tokens defined calculation parameters but no mechanism existed to execute the calculations.

### Blend Utility Functions

Four blend operations are available on all platforms:

| Function | Purpose | Example Use Case |
|----------|---------|------------------|
| `darkerBlend(color, amount)` | Darken a color | Hover states, pressed states |
| `lighterBlend(color, amount)` | Lighten a color | Icon optical balance |
| `saturate(color, amount)` | Increase saturation | Focus states |
| `desaturate(color, amount)` | Decrease saturation | Disabled states |

### Generated Files

```
dist/BlendUtilities.web.ts      # TypeScript for Web
dist/BlendUtilities.ios.swift   # Swift Color extensions
dist/BlendUtilities.android.kt  # Kotlin Color extensions
```

### Theme-Aware Wrappers

**Web (TypeScript)**:
```typescript
import { getBlendUtilities, createBlendUtilities } from '@designerpunk/tokens/BlendUtilities';

// Factory function returns utilities bound to current theme
const blend = getBlendUtilities();
const hoverColor = blend.darkerBlend(color.primary, blend.hoverDarker);
```

**iOS (SwiftUI)**:
```swift
// Color extensions with SwiftUI environment integration
let hoverColor = Color.primary.darkerBlend(amount: BlendTokens.hoverDarker)
```

**Android (Compose)**:
```kotlin
// Color extensions with MaterialTheme integration
val hoverColor = MaterialTheme.colorScheme.primary.darkerBlend(BlendTokens.hoverDarker)
```

### Component Integration

All four core components use blend utilities:

| Component | Blend Usage |
|-----------|-------------|
| ButtonCTA | hover (darkerBlend), pressed (darkerBlend), disabled (desaturate), icon (lighterBlend) |
| TextInputField | focus (saturate), disabled (desaturate) |
| Container | hover (darkerBlend) |
| Icon | optical balance (lighterBlend) |

### Validation

- **Layer 1**: Numerical precision (±1 RGB tolerance across platforms)
- **Layer 2**: Token-naming validation (correct blend utility + token combinations)
- **Tests**: 150 blend-specific tests

### Related Documentation

- [Blend Tokens Guide](./tokens/blend-tokens.md) - Complete reference with utility functions and patterns
- [Blend Infrastructure Design](../.kiro/specs/031-blend-infrastructure-implementation/design.md) - Architecture and design decisions
- [Component Development Guide](../.kiro/steering/Component%20Development%20and%20Practices%20Guide.md) - Blend utility integration patterns

---

## Token Generation

### Overview

The token generation system produces platform-specific files that include both primitive and semantic tokens. Semantic tokens reference primitives by name (not resolved values), preserving architectural relationships.

### Generated File Structure

```
// Header Comment (usage guidance)

// ============================================
// PRIMITIVE TOKENS
// Mathematical foundation
// ============================================

[All primitive tokens]

// ============================================
// SEMANTIC TOKENS  
// Use these for UI development
// ============================================

[All semantic tokens with primitive references]
```

### Platform Output Examples

#### Web (CSS Custom Properties)
```css
/* Primitive */
:root {
  --purple-300: #9333EA;
  --space-100: 8px;
}

/* Semantic (references primitive) */
:root {
  --color-primary: var(--purple-300);
  --spacing-grouped-normal: var(--space-100);
}
```

#### iOS (Swift)
```swift
struct DesignTokens {
    // Primitive
    static let purple300 = UIColor(hex: "#9333EA")
    static let space100: CGFloat = 8
    
    // Semantic (references primitive)
    static let colorPrimary = purple300
    static let spacingGroupedNormal = space100
}
```

#### Android (Kotlin)
```kotlin
object DesignTokens {
    // Primitive
    val purple_300 = Color(0xFF9333EA)
    val space_100 = 8.dp
    
    // Semantic (references primitive)
    val color_primary = purple_300
    val spacing_grouped_normal = space_100
}
```

### Platform Naming Conventions

| Platform | Convention | Prefix | Example |
|----------|-----------|--------|---------|
| Web | kebab-case | `--` | `--font-size-100` |
| iOS | camelCase | none | `fontSize100` |
| Android | snake_case | none | `font_size_100` |

### Generator Components

- **Token File Generator**: `src/generators/TokenFileGenerator.ts`
- **Blend Utility Generator**: `src/generators/BlendUtilityGenerator.ts`
- **Platform Formatters**:
  - `src/providers/WebFormatGenerator.ts`
  - `src/providers/iOSFormatGenerator.ts`
  - `src/providers/AndroidFormatGenerator.ts`

---

## Adding New Token Categories

> ⚠️ **IMPORTANT**: Before adding a new token category, read the [Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md)

The guide covers:
- Primitive token structure with required metadata
- Semantic token structure with `{ value: 'primitiveTokenName' }` format
- File organization and index.ts integration
- Common mistakes to avoid
- Complete checklist for new categories

---

## Related Documentation

### Conceptual Foundation
- [Token Ecosystem Narrative](./concepts/token-ecosystem-narrative.md) - Business localization metaphor

### Architecture
- [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md) - Validation and registration patterns

### Process Standards
- [Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md) - Adding new token categories

### Token Guides
- [Spacing Tokens Guide](./tokens/spacing-tokens.md)
- [Shadow Tokens Guide](./tokens/shadow-tokens.md)
- [Glow Tokens Guide](./tokens/glow-tokens.md)
- [Blend Tokens Guide](./tokens/blend-tokens.md)
- [Layering Tokens Guide](./tokens/layering-tokens.md)

### Specifications
- [Typography Token Expansion](../.kiro/specs/typography-token-expansion/design.md)
- [Shadow and Glow Token System](../.kiro/specs/shadow-glow-token-system/design.md)
- [Blend Infrastructure Implementation](../.kiro/specs/031-blend-infrastructure-implementation/design.md)
- [Layering Token System](../.kiro/specs/layering-token-system/design.md)
- [Responsive Layout System](../.kiro/specs/responsive-layout-system/design.md)

### Project Overview
- [README](../README.md) - Project overview and high-level architecture

---

*This overview provides navigation to token files and their related documentation guides. Last updated December 29, 2025.*
