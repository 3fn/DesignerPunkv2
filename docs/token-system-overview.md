# Token System Overview

**Date**: October 22, 2025
**Purpose**: Master document mapping token files to their documentation guides
**Organization**: process-standard
**Scope**: cross-project

---

## Getting Started with the Token System

### New to the System?

If you're new to the DesignerPunk token system, we recommend this learning path:

1. **[Token Ecosystem Narrative](./concepts/token-ecosystem-narrative.md)** - Understand the conceptual foundation through the business localization metaphor. This narrative explains the "why" behind the architecture and helps you build a mental model of how tokens, developers, components, platforms, and the build system work together.

2. **[Token System Overview](#introduction)** (this document) - Navigate to specific token files and documentation guides. Use this as your reference for finding token implementations and related documentation.

3. **[Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md)** - Learn how to add new token categories following established patterns. Essential reading before creating new token types.

### Already Familiar?

Jump directly to:
- [Primitive Tokens](#primitive-tokens) - Find specific token implementation files
- [Semantic Tokens](#semantic-tokens) - Find semantic token compositions
- [Related Documentation](#related-documentation) - Explore specifications and guides

### For AI Agents

This learning path is designed to help you build the correct mental model of the token system before making implementation decisions. Following this path will help you:
- Understand the architectural principles that guide token design
- Make decisions that align with the system's philosophy
- Apply systematic skepticism effectively by understanding the "why" behind patterns
- Avoid common mistakes that come from incomplete context

**Recommendation**: Even if you're familiar with design token systems in general, read the Token Ecosystem Narrative to understand DesignerPunk's specific approach.

---

## Introduction

This document provides an overview of the DesignerPunk token system, mapping each token type to its implementation file and related documentation guides. The token system follows a mathematical foundation with a primitive→semantic hierarchy, enabling cross-platform consistency and AI-human collaboration through precise, unambiguous design language.

The token system is organized into two main categories:
- **Primitive Tokens**: Base-level tokens with mathematical relationships (fontSize, spacing, colors, etc.)
- **Semantic Tokens**: Higher-level tokens that compose primitives for specific use cases (typography, semantic colors, etc.)

### System Architecture

The token system follows a clear separation of concerns with three main components:

**Validators** (IValidator implementations):
- Validate tokens against specific criteria (baseline grid, mathematical relationships, etc.)
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

For detailed information on how these components interact, see the [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md).

---

## Validation Flow

The token system uses a **caller-validates-then-registers** pattern where validation happens before registration:

```typescript
// 1. Caller validates the token
const validationResult = validator.validate(token);

// 2. Caller checks validation result
if (validationResult.valid) {
  // 3. Caller registers the token
  registry.register(token);
} else {
  // 4. Caller handles validation failure
  throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
}
```

### Validation Workflow

**Step 1: Token Creation**
- Tokens are created with mathematical relationships and metadata
- Primitive tokens define base values (fontSize100 = 16, space100 = 8)
- Semantic tokens reference primitive tokens (colorPrimary references purple300)

**Step 2: Validation**
- Validators check tokens against specific criteria:
  - **BaselineGridValidator**: Ensures spacing aligns to 4px/8px grid
  - **SemanticTokenValidator**: Verifies primitive references exist
  - **SyntaxValidator**: Checks token structure and naming
  - **ThreeTierValidator**: Orchestrates multiple validators with Pass/Warning/Error levels

**Step 3: Registration**
- If validation passes, tokens are registered in appropriate registry
- **PrimitiveTokenRegistry**: Stores primitive tokens (fontSize, spacing, colors)
- **SemanticTokenRegistry**: Stores semantic tokens (typography, semantic colors)

**Step 4: Generation**
- Registered tokens are used to generate platform-specific files
- Cross-platform consistency maintained through unitless base values
- Platform formatters convert to native syntax (CSS, Swift, Kotlin)

### Validation Interfaces

The token system uses common interfaces to ensure consistent validation and storage contracts:

**IValidator Interface**:
```typescript
interface IValidator<TInput = any> {
  validate(input: TInput): ValidationResult | Promise<ValidationResult>;
  readonly name: string;
}
```

**IRegistry Interface**:
```typescript
interface IRegistry<TToken> {
  register(token: TToken, options?: RegistrationOptions): void;
  query(): TToken[];
  get(name: string): TToken | undefined;
  has(name: string): boolean;
  readonly name: string;
}
```

These interfaces enable:
- **Polymorphic usage**: Work with any validator or registry through common interface
- **Type safety**: TypeScript enforces correct usage patterns
- **Testability**: Easy to test validation and registration independently
- **Consistency**: Unambiguous pattern applied uniformly across system

For complete details on validation patterns, usage examples, and guidelines for AI agents, see the [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md).

**Migrating from Old Pattern**: If you're updating code that used the old validation pattern (where registries and generators performed validation), see the [Validation Refactoring Migration Guide](./migration/validation-refactoring-guide.md) for step-by-step migration instructions and troubleshooting.

---

## Semantic Token Generation

### Overview

The DesignerPunk token system generates platform-specific files that include both primitive and semantic tokens. Semantic tokens reference primitive tokens by name (not resolved values), preserving the architectural relationships between tokens across all platforms.

**Key Benefits**:
- **Visible Relationships**: Developers can see that `colorPrimary` references `purple300`, not just that both are `#9333EA`
- **Cross-Platform Consistency**: Same semantic token names work across web, iOS, and Android
- **Reference Maintenance**: Changing a primitive token automatically updates all semantic tokens that reference it
- **AI-Friendly**: Unambiguous token relationships enable reliable AI-human collaboration

### Generated File Structure

All generated platform files follow this structure:

```
// Header Comment (usage guidance)

// ============================================
// PRIMITIVE TOKENS
// Mathematical foundation
// ============================================

[All primitive tokens - fontSize100, space100, purple300, etc.]

// ============================================
// SEMANTIC TOKENS  
// Use these for UI development
// ============================================

[All semantic tokens - colorPrimary, typographyBodyMd, etc.]
```

**Usage Guidance**: The generated files include header comments directing developers to:
1. Use semantic tokens (colorPrimary, spacingGroupedNormal) for all UI development
2. Use primitive tokens (purple300, space100) only when no semantic token exists
3. Refer to comments showing semantic → primitive relationships

### Platform-Specific Output Examples

#### Web (CSS Custom Properties)

**Single-Reference Token** (color, spacing, border):
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

**Multi-Reference Token** (typography):
```css
/* Primitives */
:root {
  --font-size-100: 16px;
  --line-height-100: 24px;
  --font-family-body: system-ui;
  --font-weight-400: 400;
  --letter-spacing-100: 0;
}

/* Semantic (references multiple primitives) */
:root {
  --typography-body-md-font-size: var(--font-size-100);
  --typography-body-md-line-height: var(--line-height-100);
  --typography-body-md-font-family: var(--font-family-body);
  --typography-body-md-font-weight: var(--font-weight-400);
  --typography-body-md-letter-spacing: var(--letter-spacing-100);
}
```

#### iOS (Swift)

**Single-Reference Token**:
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

**Multi-Reference Token**:
```swift
struct Typography {
    let fontSize: CGFloat
    let lineHeight: CGFloat
    let fontFamily: String
    let fontWeight: UIFont.Weight
    let letterSpacing: CGFloat
}

struct DesignTokens {
    // Primitives
    static let fontSize100: CGFloat = 16
    static let lineHeight100: CGFloat = 24
    static let fontFamilyBody = "system-ui"
    static let fontWeight400 = UIFont.Weight.regular
    static let letterSpacing100: CGFloat = 0
    
    // Semantic (references multiple primitives)
    static let typographyBodyMd = Typography(
        fontSize: fontSize100,
        lineHeight: lineHeight100,
        fontFamily: fontFamilyBody,
        fontWeight: fontWeight400,
        letterSpacing: letterSpacing100
    )
}
```

#### Android (Kotlin)

**Single-Reference Token**:
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

**Multi-Reference Token**:
```kotlin
data class Typography(
    val fontSize: TextUnit,
    val lineHeight: TextUnit,
    val fontFamily: String,
    val fontWeight: FontWeight,
    val letterSpacing: TextUnit
)

object DesignTokens {
    // Primitives
    val font_size_100 = 16.sp
    val line_height_100 = 24.sp
    val font_family_body = "system-ui"
    val font_weight_400 = FontWeight.Normal
    val letter_spacing_100 = 0.sp
    
    // Semantic (references multiple primitives)
    val typography_body_md = Typography(
        fontSize = font_size_100,
        lineHeight = line_height_100,
        fontFamily = font_family_body,
        fontWeight = font_weight_400,
        letterSpacing = letter_spacing_100
    )
}
```

### Platform Naming Conventions

The token generation system automatically converts token names to platform-appropriate conventions:

| Platform | Convention | Prefix | Example Primitive | Example Semantic |
|----------|-----------|--------|-------------------|------------------|
| **Web** | `kebab-case` | `--` | `--font-size-100` | `--color-primary` |
| **iOS** | `camelCase` | none | `fontSize100` | `colorPrimary` |
| **Android** | `snake_case` | none | `font_size_100` | `color_primary` |

**Dot Notation Handling**: Semantic tokens use dot notation in source definitions (e.g., `color.primary`, `typography.bodyMd`). The platform formatters automatically convert these:
- **Web**: `color.primary` → `--color-primary`
- **iOS**: `color.primary` → `colorPrimary`
- **Android**: `color.primary` → `color_primary`

### Primitive→Semantic Reference Maintenance

The generation system maintains references rather than resolving to values:

**Why References Matter**:
- **Architectural Clarity**: Developers see that `colorPrimary` comes from `purple300`
- **Automatic Updates**: Changing `purple300` automatically updates `colorPrimary`
- **AI Reasoning**: AI agents can understand token relationships for better collaboration
- **Debugging**: Clear token chains make debugging easier

**How It Works**:
1. Semantic tokens define primitive references in source: `{ value: 'purple300' }`
2. Generator validates that referenced primitives exist
3. Platform formatters output references using platform syntax:
   - Web: `var(--purple-300)`
   - iOS: `purple300` (constant reference)
   - Android: `purple_300` (property reference)

### Semantic Token Source Files

All semantic tokens are defined in TypeScript source files that the generation system reads:

- **Color Tokens**: `src/tokens/semantic/ColorTokens.ts` - Semantic color assignments (primary, error, success, etc.)
- **Spacing Tokens**: `src/tokens/semantic/SpacingTokens.ts` - Layout pattern spacing (grouped, related, separated, sectioned, inset)
- **Typography Tokens**: `src/tokens/semantic/TypographyTokens.ts` - Complete typography styles (body, label, heading, display)
- **Border Tokens**: `src/tokens/semantic/BorderWidthTokens.ts` - Semantic border widths (default, emphasis, heavy)
- **Shadow Tokens**: `src/tokens/semantic/ShadowTokens.ts` - Complete shadow compositions (container, modal, hover, fab)
- **Style Tokens**: `src/tokens/semantic/StyleTokens.ts` - Component styling patterns

**Semantic Token Index**: `src/tokens/semantic/index.ts` provides utility functions:
- `getAllSemanticTokens()` - Returns all semantic tokens as flat array
- `getSemanticTokensByCategory()` - Filters tokens by category
- `getSemanticToken()` - Retrieves specific token by name
- `validateSemanticTokenStructure()` - Validates token structure

### Cross-Platform Consistency

The generation system ensures semantic tokens work identically across all platforms:

**Consistent Token Names**: All platforms use the same semantic token names (converted to platform conventions)

**Identical Relationships**: All platforms maintain the same primitive→semantic relationships

**Platform-Appropriate Syntax**: Each platform uses its native syntax while preserving semantic meaning

**Validation**: Cross-platform consistency is validated during generation to ensure no platform diverges

### Related Documentation

- **Semantic Token Generation Spec**: [`.kiro/specs/semantic-token-generation/design.md`](../.kiro/specs/semantic-token-generation/design.md) - Complete design and architecture for semantic token generation system
- **Platform Naming Rules**: `src/naming/PlatformNamingRules.ts` - Source of truth for platform-specific naming conventions
- **Token File Generator**: `src/generators/TokenFileGenerator.ts` - Main generator orchestrating platform-specific file generation
- **Platform Formatters**: 
  - `src/providers/WebFormatGenerator.ts` - Web/CSS formatting
  - `src/providers/iOSFormatGenerator.ts` - iOS/Swift formatting
  - `src/providers/AndroidFormatGenerator.ts` - Android/Kotlin formatting

---

## Adding New Token Categories

> ⚠️ **IMPORTANT**: Before adding a new token category, read the [Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md)

The Token Category Pattern Guide provides the definitive patterns for adding new token categories to the system. It covers:

- **Primitive Token Structure**: How to export complete PrimitiveToken objects with all required metadata
- **Semantic Token Structure**: How to reference primitive tokens using `{ value: 'primitiveTokenName' }` format
- **File Organization**: Where to place token files, tests, and how to integrate with index.ts
- **What NOT to Do**: Common mistakes to avoid (no registration functions, no simple value exports)
- **Complete Checklist**: Step-by-step checklist for adding new token categories
- **Cross-References**: Links to example files (SpacingTokens, FontSizeTokens, semantic tokens)

**Why this matters**: Following the established patterns ensures consistency, maintainability, and proper integration with the existing token infrastructure. The guide prevents common mistakes that were made during early token category implementations.

**When to use**: Whenever you're creating a new token category (e.g., BorderWidthTokens, OpacityTokens, ShadowTokens, etc.)

---

## Primitive Tokens

### Font Size Tokens

- **File**: `src/tokens/FontSizeTokens.ts`
- **Description**: Font size tokens based on 1.125 modular scale (musical fourth) with systematic progression
- **Base Value**: 16px (standard browser default)
- **Scale**: 1.125 modular scale ratio

### Spacing Tokens

- **File**: `src/tokens/SpacingTokens.ts`
- **Description**: Spacing tokens following 8-unit baseline grid alignment with strategic flexibility exceptions using numeric naming that exposes mathematical relationships
- **Base Value**: 8px
- **Grid**: 8-unit baseline grid with 4px subgrid alignment
- **Related Guides**:
  - [Spacing Tokens Guide](./tokens/spacing-tokens.md) - Complete spacing token reference with numeric naming convention, mathematical relationships, and cross-platform usage examples

### Line Height Tokens

- **File**: `src/tokens/LineHeightTokens.ts`
- **Description**: Line height tokens using precision multipliers to align with 8pt vertical rhythm when combined with fontSize tokens
- **Base Value**: 1.5 (optimal reading ratio)

### Font Weight Tokens

- **File**: `src/tokens/FontWeightTokens.ts`
- **Description**: Font weight tokens following standard numeric font weight values with systematic progression
- **Base Value**: 400 (normal weight)

### Font Family Tokens

- **File**: `src/tokens/FontFamilyTokens.ts`
- **Description**: Font family tokens providing categorical font stack definitions for different use cases (system, mono, display, body)

### Letter Spacing Tokens

- **File**: `src/tokens/LetterSpacingTokens.ts`
- **Description**: Letter spacing tokens providing unitless em-based values for character spacing adjustments
- **Base Value**: 0 (normal spacing)

### Color Tokens

- **File**: `src/tokens/ColorTokens.ts`
- **Description**: Mode-aware and theme-aware color primitive tokens with systematic color families (gray, black, white, yellow, orange, purple, violet, cyan, teal) supporting light/dark modes with base/wcag themes

### Radius Tokens

- **File**: `src/tokens/RadiusTokens.ts`
- **Description**: Radius tokens following 8-unit baseline grid alignment with strategic flexibility exceptions for border radius values
- **Base Value**: 8px

### Shadow Tokens

- **File**: `src/tokens/ShadowOffsetTokens.ts`
- **Description**: Shadow offset tokens determining shadow direction based on light source position (sun arc: sunrise, morning, noon, afternoon, sunset)
- **Base Value**: 4px (4px baseline grid alignment)

- **File**: `src/tokens/ShadowBlurTokens.ts`
- **Description**: Shadow blur tokens determining edge definition based on shadow quality (hard, moderate, soft) and depth (depth100, depth200, depth300)
- **Base Value**: 4px

- **File**: `src/tokens/ShadowOpacityTokens.ts`
- **Description**: Shadow opacity tokens determining shadow darkness based on quality and depth
- **Base Value**: 0.3 (unitless)

- **File**: `src/tokens/ColorTokens.ts` (shadow color family)
- **Description**: Shadow color primitives based on art theory (warm light creates cool shadows, cool light creates warm shadows) - shadowBlack100, shadowBlue100, shadowOrange100, shadowGray100
- **Related Documentation**:
  - [Shadow Tokens Guide](./tokens/shadow-tokens.md) - Complete shadow token reference with usage examples and lighting framework concepts

### Glow Tokens

- **File**: `src/tokens/GlowBlurTokens.ts`
- **Description**: Glow blur tokens with extended blur range for radial emphasis effects
- **Base Value**: 8px

- **File**: `src/tokens/GlowOpacityTokens.ts`
- **Description**: Glow opacity tokens with decreasing progression for multi-layer glow effects
- **Base Value**: 0.8 (unitless)

- **File**: `src/tokens/semantic/ColorTokens.ts` (glow color semantics)
- **Description**: Glow color semantics referencing vibrant primitive colors (purple500, cyan500, yellow500) for neon emphasis effects
- **Related Documentation**:
  - [Glow Tokens Guide](./tokens/glow-tokens.md) - Glow primitive token reference with usage examples

### Blend Tokens

- **File**: `src/tokens/BlendTokens.ts`
- **Description**: Blend tokens for color modifications (darken, lighten, saturate, desaturate) with 5-token scale from 4% to 20% in 4% increments
- **Base Value**: 0.04 (4%)
- **Scale**: 5 tokens (blend100-blend500) with systematic multiples of base value
- **Related Documentation**:
  - [Blend Tokens Guide](./tokens/blend-tokens.md) - Complete blend token reference with utility functions and theme-aware patterns

---

## Semantic Tokens

### Typography Tokens

- **File**: `src/tokens/semantic/TypographyTokens.ts`
- **Description**: Semantic typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives to create complete typography styles for different use cases (body, label, heading, display)
- **Related Guides**:
  - [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md) - Explains why typography tokens don't include color properties
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
  - [Inline Emphasis Guide](../.kiro/specs/typography-token-expansion/inline-emphasis-guide.md) - Explains platform-native emphasis patterns
  - [Migration Guide](../.kiro/specs/typography-token-expansion/migration-guide.md) - Provides migration path for renamed tokens

### Semantic Color Tokens

- **File**: `src/tokens/semantic/ColorTokens.ts`
- **Description**: Semantic color tokens providing purpose-driven color assignments for UI elements (primary, error, success, warning, info) that reference primitive color tokens

### Semantic Spacing Tokens

- **File**: `src/tokens/semantic/SpacingTokens.ts`
- **Description**: Semantic spacing tokens providing layout pattern-specific spacing values (grouped, related, separated, sectioned, inset) that reference primitive spacing tokens
- **Related Guides**:
  - [Spacing Tokens Guide](./tokens/spacing-tokens.md) - Complete spacing token reference with numeric naming convention, mathematical relationships, and usage examples

### Style Tokens

- **File**: `src/tokens/semantic/StyleTokens.ts`
- **Description**: Semantic style tokens combining multiple primitives for complete component styling patterns (shadows, borders, effects)

### Semantic Shadow Tokens

- **File**: `src/tokens/semantic/ShadowTokens.ts`
- **Description**: Semantic shadow tokens composing offsetX, offsetY, blur, opacity, and color primitives to create complete shadow styles for specific use cases (container, modal, hover, fab) with lighting framework concepts (sun arc positions and shadow quality)
- **Related Guides**:
  - [Shadow Tokens Guide](./tokens/shadow-tokens.md) - Complete shadow token reference with usage examples and lighting framework concepts
  - [Lighting Framework Guide](../.kiro/specs/shadow-glow-token-system/lighting-framework.md) - Conceptual framework for light source positioning and shadow quality

### Semantic Blend Tokens

- **File**: `src/tokens/semantic/BlendTokens.ts`
- **Description**: Semantic blend tokens providing contextual meaning for common color modification use cases (hover, pressed, focus, disabled states) with explicit blend direction
- **Tokens**: 7 semantic tokens (blend.hoverDarker, blend.hoverLighter, blend.pressedDarker, blend.focusSaturate, blend.disabledDesaturate, blend.containerHoverDarker, color.icon.opticalBalance)
- **Related Guides**:
  - [Blend Tokens Guide](./tokens/blend-tokens.md) - Complete blend token reference with utility functions and theme-aware patterns
  - [Blend Infrastructure Design](../.kiro/specs/031-blend-infrastructure-implementation/design.md) - Architecture and design decisions for blend token infrastructure

### Layering Tokens

The Layering Token System provides platform-specific semantic tokens for controlling element stacking order across web, iOS, and Android platforms. Unlike other token categories that follow a primitive→semantic hierarchy, layering tokens are **semantic-only** with no primitive token layer.

**Why Semantic-Only?**

Layering tokens are an architectural exception to the typical primitive→semantic pattern because:
- **Ordinal Values**: Z-index and elevation values establish ordering, not mathematical relationships
- **Platform-Specific Scales**: Web uses arbitrary z-index values (100, 200, 300), Android uses Material Design elevation scale (4dp, 8dp, 16dp), iOS uses small integers (1, 2, 3)
- **Component-Driven**: Layering is about component stacking order (modal above dropdown), not mathematical progressions

**Two Token Sets**:

1. **Z-Index Tokens** (Web + iOS)
   - **File**: `src/tokens/semantic/ZIndexTokens.ts`
   - **Description**: Stacking order tokens for web and iOS platforms that control z-axis positioning independently from visual depth (shadows)
   - **Platform**: Web, iOS
   - **Values**: 100-based increments (100, 200, 300, 400, 500, 600)
   - **Usage**: Use independently with shadow tokens for visual depth

2. **Elevation Tokens** (Android)
   - **File**: `src/tokens/semantic/ElevationTokens.ts`
   - **Description**: Material Design elevation tokens for Android that handle both stacking order and shadow rendering
   - **Platform**: Android
   - **Values**: Material Design scale (4dp, 8dp, 16dp, 24dp)
   - **Usage**: Elevation handles both z-order and shadow (Material Design convention)

**Unified Entry Point**:
- **File**: `src/tokens/semantic/LayeringTokens.ts`
- **Description**: Unified API that re-exports all layering tokens and provides platform-agnostic helper functions
- **Helpers**: `getAllLayeringTokens()`, `getLayeringTokensByPlatform(platform)`

**Semantic Levels** (consistent across platforms):
- `container` - Base z-index for container components (cards, panels, surfaces)
- `navigation` - Persistent navigation (headers, sidebars, sticky elements)
- `dropdown` - Temporary overlay content (dropdowns, popovers, menus)
- `modal` - Modal overlay content (dialogs, sheets, overlays)
- `toast` - Notification elements (toasts, snackbars, alerts)
- `tooltip` - Always-visible elements (tooltips, critical overlays)

**Related Documentation**:
- [Layering Tokens Guide](./tokens/layering-tokens.md) - Complete layering token reference with platform-specific usage examples and AI agent generation rules
- [Layering Token System Design](../.kiro/specs/layering-token-system/design.md) - Architecture and design decisions for platform-specific layering tokens

---

## Related Documentation

### Conceptual Foundation

- [Token Ecosystem Narrative](./concepts/token-ecosystem-narrative.md) - Understand the token system through the business localization metaphor

### Architecture

- [Registry-Validator Interaction Pattern](../architecture/registry-validator-pattern.md) - Definitive guide for validation and registration patterns with usage examples and guidelines for AI agents

### Process Standards

- [Token Category Pattern Guide](../.kiro/specs/token-system/token-category-pattern-guide.md) - Definitive guide for adding new token categories with complete patterns and checklist

### Specifications

- [Typography Token Expansion](../.kiro/specs/typography-token-expansion/design.md) - Comprehensive design and architecture for typography token system
- [Mathematical Token System](../.kiro/specs/mathematical-token-system/design.md) - Mathematical foundations and validation system for all tokens
- [Cross-Platform Build System](../.kiro/specs/cross-platform-build-system/design.md) - Token generation and platform-specific conversion system
- [Shadow and Glow Token System](../.kiro/specs/shadow-glow-token-system/design.md) - Shadow and glow token architecture with lighting framework concepts and cross-platform translation

### Project Overview

- [README](../README.md) - Project overview, getting started guide, and high-level architecture

### How to Use This Document

This document serves as a navigation hub for the token system:

1. **Find Token Files**: Use the Primitive Tokens and Semantic Tokens sections to locate specific token implementation files
2. **Understand Token Architecture**: Follow the Related Guides links to learn about design decisions and architectural patterns
3. **Explore Specifications**: Use the Related Documentation section to dive deeper into system design and implementation details
4. **Navigate to Project Context**: Use the README link for broader project context and getting started information

The token system follows a primitive→semantic hierarchy where semantic tokens compose primitive tokens to create higher-level design patterns. This mathematical foundation enables cross-platform consistency and reliable AI-human collaboration through precise, unambiguous design language.

---

*This overview provides navigation to token files and their related documentation guides.*
