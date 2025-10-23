# Token System Overview

**Date**: October 22, 2025
**Purpose**: Master document mapping token files to their documentation guides
**Organization**: process-standard
**Scope**: cross-project

---

## Introduction

This document provides an overview of the DesignerPunk token system, mapping each token type to its implementation file and related documentation guides. The token system follows a mathematical foundation with a primitive→semantic hierarchy, enabling cross-platform consistency and AI-human collaboration through precise, unambiguous design language.

The token system is organized into two main categories:
- **Primitive Tokens**: Base-level tokens with mathematical relationships (fontSize, spacing, colors, etc.)
- **Semantic Tokens**: Higher-level tokens that compose primitives for specific use cases (typography, semantic colors, etc.)

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

---

## Related Documentation

### Specifications

- [Typography Token Expansion](../.kiro/specs/typography-token-expansion/design.md) - Comprehensive design and architecture for typography token system
- [Mathematical Token System](../.kiro/specs/mathematical-token-system/design.md) - Mathematical foundations and validation system for all tokens
- [Cross-Platform Build System](../.kiro/specs/cross-platform-build-system/design.md) - Token generation and platform-specific conversion system

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
