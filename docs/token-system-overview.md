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
- **Description**: Spacing tokens following 8-unit baseline grid alignment with strategic flexibility exceptions
- **Base Value**: 8px
- **Grid**: 8-unit baseline grid with 4px subgrid alignment

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
- **Description**: Semantic spacing tokens providing layout pattern-specific spacing values (stack, inline, inset) that reference primitive spacing tokens

### Style Tokens

- **File**: `src/tokens/semantic/StyleTokens.ts`
- **Description**: Semantic style tokens combining multiple primitives for complete component styling patterns (shadows, borders, effects)

### Semantic Shadow Tokens

- **File**: `src/tokens/semantic/ShadowTokens.ts`
- **Description**: Semantic shadow tokens composing offsetX, offsetY, blur, opacity, and color primitives to create complete shadow styles for specific use cases (container, modal, hover, fab) with lighting framework concepts (sun arc positions and shadow quality)
- **Related Guides**:
  - [Shadow Tokens Guide](./tokens/shadow-tokens.md) - Complete shadow token reference with usage examples and lighting framework concepts
  - [Lighting Framework Guide](../.kiro/specs/shadow-glow-token-system/lighting-framework.md) - Conceptual framework for light source positioning and shadow quality

---

## Related Documentation

### Conceptual Foundation

- [Token Ecosystem Narrative](./concepts/token-ecosystem-narrative.md) - Understand the token system through the business localization metaphor

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
