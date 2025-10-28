# Implementation Plan: Blend Token System

**Date**: October 27, 2025
**Spec**: blend-tokens
**Status**: Implementation Planning
**Dependencies**: mathematical-token-system, cross-platform-build-system
**Coordinated With**: opacity-tokens (shared platform generator architecture, composition syntax)

---

## Implementation Plan

Implement blend token system with formula-based primitive tokens, multiple blend directions (darker, lighter, saturate, desaturate), semantic layer, and unified generator integration for runtime calculation (Phase 1). Implementation coordinates with opacity-tokens for shared platform generator architecture and composition support.

**Implementation Approach**: Build primitive tokens and blend calculator first, then semantic layer, then unified generator integration to output blend values and platform-specific utilities for runtime calculation.

**Phase 1 Focus**: Generate blend values and utilities for runtime calculation. Phase 2 (build-time pre-calculation) deferred to future enhancement.

---

## Task List

- [x] 1. Implement Blend Primitive Tokens

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Blend primitive tokens implemented with 0.04 base value and 5-token scale
  - All tokens follow formula-based derivation (base × multiplier)
  - Scale notation consistent with opacity and other token families
  - Mathematical relationships documented for each token
  
  **Primary Artifacts:**
  - `src/tokens/BlendTokens.ts`
  - `src/tokens/__tests__/BlendTokens.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-1-completion.md`

  - [x] 1.1 Create BlendTokens.ts with base value and token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define BLEND_BASE_VALUE constant (0.04)
    - Create BlendDirection enum (darker, lighter, saturate, desaturate)
    - Create generateBlendPlatformValues() helper function
    - Implement blend100 through blend500 (5 tokens)
    - Document mathematical relationship for each token
    - Export blendTokens object and helper functions
    - _Requirements: 1, 2, 3_

  - [x] 1.2 Create unit tests for blend primitive tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test BLEND_BASE_VALUE equals 0.04
    - Test blend100 equals base value
    - Test blend200 equals 2 × base value
    - Test all tokens have unitless platform values
    - Test mathematical relationships are correct
    - _Requirements: 1, 2, 3_

- [x] 2. Implement Blend Calculation Algorithms

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Blend calculator implements all four blend directions correctly
  - Darker/lighter blends use overlay operations (black/white at specified opacity)
  - Saturate/desaturate blends use HSL color space adjustments
  - All calculations use sRGB color space for consistency
  - Color space conversion utilities (RGB ↔ HSL) work correctly
  
  **Primary Artifacts:**
  - `src/blend/BlendCalculator.ts`
  - `src/blend/ColorSpaceUtils.ts`
  - `src/blend/__tests__/BlendCalculator.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-2-completion.md`

  - [x] 2.1 Implement color space conversion utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement rgbToHsl() conversion function
    - Implement hslToRgb() conversion function
    - Implement hexToRgb() parsing function
    - Implement rgbToHex() formatting function
    - Create unit tests for color space conversions
    - _Requirements: 4, 6, 7_

  - [x] 2.2 Implement darker blend calculation (black overlay)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement calculateDarkerBlend() function
    - Use overlay formula: baseColor + (black at blendValue opacity)
    - Clamp RGB values to 0-255 range
    - Create unit tests verifying darker colors
    - _Requirements: 4, 5_

  - [x] 2.3 Implement lighter blend calculation (white overlay)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement calculateLighterBlend() function
    - Use overlay formula: baseColor + (white at blendValue opacity)
    - Clamp RGB values to 0-255 range
    - Create unit tests verifying lighter colors
    - _Requirements: 4, 5_

  - [x] 2.4 Implement saturate blend calculation (HSL adjustment)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement calculateSaturateBlend() function
    - Convert RGB to HSL, increase saturation, convert back
    - Clamp saturation to 0.0-1.0 range
    - Create unit tests verifying increased saturation
    - _Requirements: 4, 5_

  - [x] 2.5 Implement desaturate blend calculation (HSL adjustment)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement calculateDesaturateBlend() function
    - Convert RGB to HSL, decrease saturation, convert back
    - Clamp saturation to 0.0-1.0 range
    - Create unit tests verifying decreased saturation
    - _Requirements: 4, 5_

  - [x] 2.6 Create BlendCalculator orchestrator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement calculateBlend() method that routes to correct blend function
    - Accept baseColor, blendToken, and direction parameters
    - Return calculated color as hex string
    - Create integration tests for all blend directions
    - _Requirements: 4, 5, 6_

- [x] 3. Implement Blend Semantic Layer

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Semantic blend tokens implemented for common interaction states
  - All semantic tokens reference primitive tokens with explicit direction
  - Context and descriptions provide clear usage guidance
  - Semantic tokens follow established naming patterns (state + direction)
  
  **Primary Artifacts:**
  - `src/tokens/semantic/BlendTokens.ts`
  - `src/tokens/semantic/__tests__/BlendTokens.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-3-completion.md`

  - [x] 3.1 Create semantic blend token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement blendHoverDarker (blend200 darker)
    - Implement blendHoverLighter (blend200 lighter)
    - Implement blendPressedDarker (blend300 darker)
    - Implement blendFocusSaturate (blend200 saturate)
    - Implement blendDisabledDesaturate (blend300 desaturate)
    - Implement blendContainerHoverDarker (blend100 darker)
    - Document context and use cases for each semantic token
    - _Requirements: 8_

  - [x] 3.2 Create unit tests for semantic blend tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all semantic tokens reference valid primitive tokens
    - Test semantic tokens have correct directions
    - Test semantic token naming follows pattern (state + direction)
    - _Requirements: 8_

- [x] 4. Integrate Blend Tokens with Unified Generator

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Unified generator outputs blend value constants for all platforms
  - Unified generator outputs platform-specific blend utility functions
  - Web utilities use TypeScript with same algorithms as iOS/Android
  - iOS utilities use Swift extensions with same algorithms as web/Android
  - Android utilities use Kotlin extensions with same algorithms as web/iOS
  - Cross-platform consistency verified (same algorithms produce same colors)
  
  **Primary Artifacts:**
  - `src/generators/BlendValueGenerator.ts`
  - `src/generators/BlendUtilityGenerator.ts`
  - `src/generators/__tests__/BlendGenerator.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-4-completion.md`

  - [x] 4.1 Implement blend value generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create generateBlendValues() method for each platform
    - Output blend100-blend500 constants in platform format
    - Web: export const blend100 = 0.04
    - iOS: static let blend100: Double = 0.04
    - Android: const val blend100 = 0.04f
    - Integrate with existing unified generator infrastructure
    - _Requirements: 6_

  - [x] 4.2 Implement web blend utility generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate darkerBlend(), lighterBlend(), saturate(), desaturate() functions
    - Use existing ColorSpaceUtils and blend calculation functions
    - Output TypeScript functions that work with hex color strings
    - Create tests verifying utilities produce correct colors
    - _Requirements: 6, 9_

  - [x] 4.3 Implement iOS blend utility generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Color extension methods (darkerBlend, lighterBlend, saturate, desaturate)
    - Port blend calculation algorithms to Swift
    - Output Swift code that works with SwiftUI Color
    - Create tests verifying utilities produce same colors as web
    - _Requirements: 6, 9_

  - [x] 4.4 Implement Android blend utility generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Color extension functions (darkerBlend, lighterBlend, saturate, desaturate)
    - Port blend calculation algorithms to Kotlin
    - Output Kotlin code that works with Compose Color
    - Create tests verifying utilities produce same colors as web/iOS
    - _Requirements: 6, 9_

  - [x] 4.5 Create cross-platform consistency tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test all platforms generate same blend values
    - Test all platforms' utilities produce mathematically identical colors
    - Test purple500 with blend200 darker produces same result on all platforms
    - Test all blend directions (darker, lighter, saturate, desaturate) are consistent
    - _Requirements: 6, 9_

- [x] 5. Implement Composition Support (Coordinated with Opacity)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Composition syntax supports "color with blend direction" pattern
  - Composition with opacity follows agreed order (blend → opacity)
  - Composition parser validates all token references
  - Platform generators handle blend + opacity composition correctly
  
  **Primary Artifacts:**
  - `src/composition/BlendComposition.ts`
  - `src/composition/__tests__/BlendComposition.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-5-completion.md`

  - [x] 5.1 Implement blend composition parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Parse "color with blend direction" syntax
    - Validate color token exists
    - Validate blend token exists
    - Validate direction is valid (darker/lighter/saturate/desaturate)
    - Return BlendComposition structure
    - _Requirements: 5, 10_

  - [x] 5.2 Implement blend + opacity composition (coordinated with opacity-tokens)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Parse "color with blend direction at opacity" syntax
    - Enforce order: blend first, then opacity
    - Calculate blended color first, then apply opacity
    - Return BlendOpacityComposition structure with color and opacity
    - _Requirements: 10_

  - [x] 5.3 Create composition tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test "color with blend direction" parsing
    - Test "color with blend direction at opacity" parsing
    - Test composition validation
    - Test order of operations (blend → opacity)
    - Test all blend directions work in composition
    - _Requirements: 5, 10_

- [x] 6. Documentation and Usage Guidance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Blend token usage documented with examples for all directions
  - Relationship to explicit color tokens explained
  - When to use blend vs explicit colors guidance provided
  - AI agent guidance included for token selection
  
  **Primary Artifacts:**
  - `.kiro/specs/blend-tokens/usage-guide.md`
  - `.kiro/specs/blend-tokens/blend-vs-explicit-colors.md`
  
  **Completion Documentation:**
  - `.kiro/specs/blend-tokens/completion/task-6-completion.md`

  - [x] 6.1 Create blend usage guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document darker blend examples (button hover, pressed states)
    - Document lighter blend examples (dark background hover)
    - Document saturate blend examples (focus states)
    - Document desaturate blend examples (disabled states)
    - Provide container/surface hover examples
    - _Requirements: 4, 5, 8_

  - [x] 6.2 Document blend vs explicit colors guidance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Explain when to use blend (dynamic theming, consistent patterns)
    - Explain when to use explicit colors (precise control, brand guidelines)
    - Document coexistence strategy (blend as modifier)
    - Provide decision framework for developers
    - _Requirements: 11_

  - [x] 6.3 Create AI agent guidance for blend selection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document blend direction selection criteria
    - Provide semantic token selection guidance
    - Include composition pattern examples
    - Document component token boundary (semantic vs component)
    - _Requirements: 8, 11_

---

*This implementation plan provides a structured approach to building the blend token system with build-time color calculation, multiple blend directions, cross-platform support, and coordination with opacity tokens for compositional flexibility.*
