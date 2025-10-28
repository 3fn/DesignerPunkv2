# Implementation Plan: Opacity Token System

**Date**: October 27, 2025
**Spec**: opacity-tokens
**Status**: Implementation Planning
**Dependencies**: mathematical-token-system, cross-platform-build-system, shadow-glow-token-system
**Coordinated With**: blend-tokens (shared platform generator architecture)

---

## Implementation Plan

Implement opacity token system with formula-based primitive tokens, semantic layer, and cross-platform translation. Implementation follows established patterns from shadow-glow-token-system with direct alpha channel translation. Coordination with blend-tokens ensures shared platform generator architecture and composition syntax compatibility.

**Implementation Approach**: Build primitive tokens first, then semantic layer, then platform translation, following proven patterns from existing token systems.

---

## Task List

- [x] 1. Implement Opacity Primitive Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Opacity primitive tokens implemented with 0.08 base value and 13-token scale
  - All tokens follow formula-based derivation (base × multiplier)
  - Scale notation consistent with other token families (opacity100, opacity200...)
  - Mathematical relationships documented for each token
  
  **Primary Artifacts:**
  - `src/tokens/OpacityTokens.ts`
  - `src/tokens/__tests__/OpacityTokens.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/opacity-tokens/completion/task-1-completion.md`

  - [x] 1.1 Create OpacityTokens.ts with base value and token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define OPACITY_BASE_VALUE constant (0.08)
    - Create generateOpacityPlatformValues() helper function
    - Implement opacity000 through opacity1300 (13 tokens)
    - Document mathematical relationship for each token
    - Export opacityTokens object and helper functions
    - _Requirements: 1, 2, 3_

  - [x] 1.2 Create unit tests for opacity primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test OPACITY_BASE_VALUE equals 0.08
    - Test opacity100 equals base value
    - Test opacity600 equals 6 × base value
    - Test all tokens have unitless platform values
    - Test mathematical relationships are correct
    - _Requirements: 1, 2, 3_

- [x] 2. Implement Opacity Semantic Layer

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Semantic opacity tokens implemented for common use cases
  - All semantic tokens reference primitive tokens by name
  - Context and descriptions provide clear usage guidance
  - Semantic tokens follow established naming patterns
  
  **Primary Artifacts:**
  - `src/tokens/semantic/OpacityTokens.ts`
  - `src/tokens/semantic/__tests__/OpacityTokens.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/opacity-tokens/completion/task-2-completion.md`

  - [x] 2.1 Create semantic opacity token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement opacityDisabled (references opacity600)
    - Implement opacityOverlay (references opacity400)
    - Implement opacityHover (references opacity100)
    - Implement opacityPressed (references opacity200)
    - Implement opacityLoading (references opacity200)
    - Document context and use cases for each semantic token
    - _Requirements: 5_

  - [x] 2.2 Create unit tests for semantic opacity tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test opacityDisabled resolves to opacity600 (0.48)
    - Test all semantic tokens resolve to valid primitive values
    - Test semantic token references are valid
    - _Requirements: 5_

- [x] 3. Implement Platform Translation for Opacity

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Platform generators translate opacity tokens to web, iOS, and Android formats
  - Web generator produces valid CSS opacity properties
  - iOS generator produces valid SwiftUI opacity modifiers
  - Android generator produces valid Compose alpha modifiers
  - All platforms use same unitless values (cross-platform consistency)
  
  **Primary Artifacts:**
  - `src/generators/OpacityGenerator.ts` (or integrated into existing generators)
  - `src/generators/__tests__/OpacityGenerator.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/opacity-tokens/completion/task-3-completion.md`

  - [x] 3.1 Implement web opacity generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create generateOpacityProperty() method (outputs `opacity: 0.48;`)
    - Create generateRgbaAlpha() method (outputs `rgba(r, g, b, 0.48)`)
    - Create generateCustomProperty() method (outputs `--opacity600: 0.48;`)
    - Integrate with existing web generator infrastructure
    - _Requirements: 7_

  - [x] 3.2 Implement iOS opacity generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create generateOpacityModifier() method (outputs `.opacity(0.48)`)
    - Create generateColorWithOpacity() method (outputs `Color(..., opacity: 0.48)`)
    - Create generateConstant() method (outputs `static let opacity600 = 0.48`)
    - Integrate with existing iOS generator infrastructure
    - _Requirements: 7_

  - [x] 3.3 Implement Android opacity generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create generateAlphaModifier() method (outputs `Modifier.alpha(0.48f)`)
    - Create generateColorWithAlpha() method (outputs `Color(...).copy(alpha = 0.48f)`)
    - Create generateConstant() method (outputs `const val OPACITY_600 = 0.48f`)
    - Integrate with existing Android generator infrastructure
    - _Requirements: 7_

  - [x] 3.4 Create integration tests for platform translation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test web generator produces valid CSS
    - Test iOS generator produces valid SwiftUI
    - Test Android generator produces valid Compose
    - Test all platforms use same opacity values
    - _Requirements: 7_

- [x] 4. Implement Composition Support

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Composition syntax supports "color at opacity" pattern
  - Composition with blend tokens follows agreed order (blend → opacity)
  - Composition parser validates token references
  - Platform generators handle composition correctly
  
  **Primary Artifacts:**
  - `src/composition/OpacityComposition.ts`
  - `src/composition/__tests__/OpacityComposition.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/opacity-tokens/completion/task-4-completion.md`

  - [x] 4.1 Implement opacity composition parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Parse "color at opacity" syntax
    - Validate color token exists
    - Validate opacity token exists
    - Return OpacityComposition structure
    - _Requirements: 6, 10_

  - [x] 4.2 Implement blend + opacity composition support (coordinated with blend-tokens)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Parse "color with blend at opacity" syntax
    - Enforce order: blend first, then opacity
    - Validate all token references
    - Return BlendOpacityComposition structure
    - _Requirements: 10_

  - [x] 4.3 Create composition tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test "color at opacity" parsing
    - Test "color with blend at opacity" parsing
    - Test composition validation
    - Test order of operations
    - _Requirements: 6, 10_

- [x] 5. Documentation and Safe Combinations Guide

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Safe opacity + color combinations documented with WCAG guidance
  - Examples provided for common use cases
  - Relationship to shadow/glow opacity clearly explained
  - AI agent guidance included for token selection
  
  **Primary Artifacts:**
  - `.kiro/specs/opacity-tokens/safe-combinations-guide.md`
  - `.kiro/specs/opacity-tokens/usage-examples.md`
  
  **Completion Documentation:**
  - `.kiro/specs/opacity-tokens/completion/task-5-completion.md`

  - [x] 5.1 Create safe combinations guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document safe opacity + color combinations for text (WCAG 4.5:1)
    - Document safe combinations for backgrounds
    - Document unsafe combinations with alternatives
    - Provide button state opacity examples
    - _Requirements: 9_

  - [x] 5.2 Document relationship to shadow/glow opacity
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Explain difference between general opacity and shadow/glow opacity
    - Provide use case guidance (when to use which)
    - Document that shadow/glow opacity is specialized
    - _Requirements: 10_

  - [x] 5.3 Create usage examples and AI agent guidance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Provide examples for modal overlays, disabled states, glassmorphism
    - Document composition patterns (single opacity, layered opacity, gradients)
    - Include AI agent guidance for token selection
    - _Requirements: 6, 9_

---

*This implementation plan provides a structured approach to building the opacity token system with cross-platform support, semantic layer, and coordination with blend tokens for compositional flexibility.*
