# Implementation Plan: Semantic Token Generation

**Date**: 2025-01-15
**Spec**: semantic-token-generation
**Status**: Implementation Planning
**Dependencies**: None (extends existing TokenFileGenerator)

---

## Implementation Plan

This implementation extends the existing TokenFileGenerator to include semantic token generation alongside primitive tokens. The approach is incremental: build semantic token export, then extend generation platform-by-platform (web first, then iOS, then Android), add validation, test thoroughly, and update documentation.

---

## Task List

- [x] 1. Semantic Token Export Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Semantic token export function returns all semantic tokens from all categories
  - Export includes colors, spacing (all categories), typography, and borders
  - Export function is accessible to TokenFileGenerator
  
  **Primary Artifacts:**
  - `src/tokens/semantic/index.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-1-completion.md`

  - [x] 1.1 Create semantic token barrel export
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/index.ts` if it doesn't exist
    - Import all semantic token modules (ColorTokens, SpacingTokens, TypographyTokens, BorderWidthTokens)
    - Export individual token collections for external use
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.2 Implement getAllSemanticTokens function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `getAllSemanticTokens()` function that returns flat array of all semantic tokens
    - Flatten spacing token hierarchy (grouped, related, separated, sectioned, inset)
    - Include color tokens from colorTokens object
    - Include typography tokens from typographyTokens object
    - Include border tokens from SemanticBorderWidthTokens object
    - Return as SemanticToken[] array
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.3 Implement getSemanticTokensByCategory function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `getSemanticTokensByCategory(category: SemanticCategory)` function
    - Filter semantic tokens by category (COLOR, SPACING, TYPOGRAPHY, BORDER)
    - Return filtered array of semantic tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Web Platform Semantic Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web generator outputs semantic tokens with references to primitive token names
  - Generated file has clear sections (primitives first, semantics second)
  - Single-reference tokens (colors, spacing, borders) reference primitives correctly
  - Multi-reference tokens (typography) reference all required primitives
  
  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts` (extended)
  - `src/providers/WebFormatGenerator.ts` (extended)
  - `output/DesignTokens.web.js` (generated with semantics)
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-2-completion.md`

  - [x] 2.1 Extend WebFormatGenerator for semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `formatSingleReferenceToken(semantic: SemanticToken): string` method
    - Generate format: `export const ${semantic.name} = ${primitiveRef};`
    - Add `formatMultiReferenceToken(semantic: SemanticToken): string` method
    - Generate object literal format for typography tokens
    - Add `generateSectionComment(section: 'primitive' | 'semantic'): string` method
    - _Requirements: 2.1, 4.2, 4.3, 4.4_

  - [x] 2.2 Extend TokenFileGenerator.generateWebTokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Import `getAllSemanticTokens` from semantic token index
    - Add `generateSemanticSection(semantics, 'web')` call after primitive generation
    - Add section comments to separate primitives and semantics
    - Maintain existing primitive generation unchanged
    - _Requirements: 2.1, 2.4, 4.1, 4.2, 4.3, 6.1, 6.2, 6.4_

  - [x] 2.3 Implement generateSemanticSection method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `generateSemanticSection(semantics: SemanticToken[], platform: string)` method
    - Iterate over semantic tokens
    - Detect single-reference vs multi-reference tokens
    - Call appropriate formatter method for each token
    - Return array of formatted token strings
    - _Requirements: 2.1, 3.1, 3.4_

  - [x] 2.4 Add header comment with usage guidance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extend header comment generation to include usage guidance
    - Add guidance: "Use semantic tokens (colorPrimary, borderDefault) for all UI development"
    - Add guidance: "Use primitive tokens (purple300, space100) only when no semantic exists"
    - Add guidance: "Comments show semantic → primitive relationships"
    - _Requirements: 4.1, 4.5_

- [x] 3. iOS Platform Semantic Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - iOS generator outputs semantic tokens with references to primitive token names
  - Generated Swift file has clear sections (primitives first, semantics second)
  - Single-reference tokens use Swift constant reference syntax
  - Multi-reference tokens use Swift struct initialization syntax
  
  **Primary Artifacts:**
  - `src/providers/iOSFormatGenerator.ts` (extended)
  - `output/DesignTokens.ios.swift` (generated with semantics)
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-3-completion.md`

  - [x] 3.1 Extend iOSFormatGenerator for semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `formatSingleReferenceToken(semantic: SemanticToken): string` method
    - Generate format: `static let ${semantic.name} = ${primitiveRef}`
    - Add `formatMultiReferenceToken(semantic: SemanticToken): string` method
    - Generate Typography struct initialization format
    - Add `generateSectionComment(section: 'primitive' | 'semantic'): string` method
    - _Requirements: 2.2, 3.2, 4.2, 4.3, 4.4_

  - [x] 3.2 Extend TokenFileGenerator.generateiOSTokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `generateSemanticSection(semantics, 'ios')` call after primitive generation
    - Add section comments to separate primitives and semantics
    - Maintain existing primitive generation unchanged
    - Ensure primitives defined before semantics in struct
    - _Requirements: 2.2, 2.4, 4.1, 4.2, 4.3, 6.1, 6.2, 6.4_

- [x] 4. Android Platform Semantic Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Android generator outputs semantic tokens with references to primitive token names
  - Generated Kotlin file has clear sections (primitives first, semantics second)
  - Single-reference tokens use Kotlin property reference syntax
  - Multi-reference tokens use Kotlin data class initialization syntax
  
  **Primary Artifacts:**
  - `src/providers/AndroidFormatGenerator.ts` (extended)
  - `output/DesignTokens.android.kt` (generated with semantics)
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-4-completion.md`

  - [x] 4.1 Extend AndroidFormatGenerator for semantic tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `formatSingleReferenceToken(semantic: SemanticToken): string` method
    - Generate format: `val ${semantic.name} = ${primitiveRef}`
    - Add `formatMultiReferenceToken(semantic: SemanticToken): string` method
    - Generate Typography data class initialization format
    - Add `generateSectionComment(section: 'primitive' | 'semantic'): string` method
    - _Requirements: 2.3, 3.3, 4.2, 4.3, 4.4_

  - [x] 4.2 Extend TokenFileGenerator.generateAndroidTokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `generateSemanticSection(semantics, 'android')` call after primitive generation
    - Add section comments to separate primitives and semantics
    - Maintain existing primitive generation unchanged
    - Ensure primitives defined before semantics in object
    - _Requirements: 2.3, 2.4, 4.1, 4.2, 4.3, 6.1, 6.2, 6.4_

- [x] 5. Reference Validation and Error Handling

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Invalid primitive references detected and reported with clear error messages
  - Missing required references (typography) detected and reported
  - Generation fails gracefully without breaking primitive token output
  - Error messages include semantic token name and invalid reference
  
  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts` (validation logic)
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-5-completion.md`

  - [x] 5.1 Implement semantic token reference validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `validateSemanticReferences(semantics: SemanticToken[], primitives: PrimitiveToken[])` method
    - Check single-reference tokens: validate `primitiveReferences.value` exists in primitives
    - Check multi-reference tokens: validate all required references exist (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
    - Return validation result with list of invalid references
    - _Requirements: 2.5, 3.5_

  - [x] 5.2 Add error handling to generation methods
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Call validation before generating semantic section
    - If validation fails, log errors and skip semantic generation
    - Continue with primitive generation (graceful degradation)
    - Add errors to GenerationResult
    - Update GenerationResult interface to include `semanticTokenCount` and `warnings`
    - _Requirements: 2.5, 3.5, 6.5_

  - [x] 5.3 Implement clear error messages
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Format error: `Semantic token '${name}' references non-existent primitive '${ref}'`
    - Format error: `Semantic token '${name}' has invalid ${property} reference '${ref}'`
    - Format error: `Typography token '${name}' missing required reference: ${property}`
    - Include semantic token name and specific invalid reference in all errors
    - _Requirements: 2.5, 3.5, 6.5_

- [x] 6. Cross-Platform Validation and Testing

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All three platforms generate semantic tokens with identical names
  - All three platforms maintain identical primitive→semantic relationships
  - Cross-platform consistency validation passes
  - Unit and integration tests pass for all platforms
  
  **Primary Artifacts:**
  - `src/generators/__tests__/SemanticTokenGeneration.test.ts`
  - `src/generators/__tests__/CrossPlatformConsistency.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-6-completion.md`

  - [x] 6.1 Implement cross-platform consistency validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extend `validateCrossPlatformConsistency` method to check semantic tokens
    - Verify all platforms have same semantic token count
    - Verify all platforms have same semantic token names
    - Verify all platforms maintain same primitive→semantic relationships
    - Add validation results to consistency check
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 Write unit tests for semantic token export
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test `getAllSemanticTokens()` returns all semantic tokens
    - Test includes color, spacing, typography, and border tokens
    - Test returns correct count of semantic tokens
    - Test each token has valid structure (name, primitiveReferences, category)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 6.3 Write unit tests for single-reference generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test web formatter generates correct JavaScript syntax with references
    - Test iOS formatter generates correct Swift syntax with references
    - Test Android formatter generates correct Kotlin syntax with references
    - Test references use primitive token names (not values)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 6.4 Write unit tests for multi-reference generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test web formatter generates object literal with all properties
    - Test iOS formatter generates struct instance with all parameters
    - Test Android formatter generates data class instance with all parameters
    - Test all primitive references included (fontSize, lineHeight, fontFamily, fontWeight, letterSpacing)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.5 Write integration tests for end-to-end generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test generate web tokens with primitives + semantics
    - Test generate iOS tokens with primitives + semantics
    - Test generate Android tokens with primitives + semantics
    - Test file structure (primitives first, semantics second)
    - Test cross-platform consistency (same token names)
    - Test backward compatibility (primitive tokens unchanged)
    - _Requirements: 2.4, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4_

  - [x] 6.6 Rewrite integration tests based on corrected design and format
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Delete existing `src/__tests__/integration/SemanticTokenGeneration.test.ts`
    - Create new integration test file from scratch
    - Reference corrected design document "Platform Naming Conventions" section
    - Reference web-format-mismatch-issue.md for CSS format requirements
    - Write web platform tests expecting CSS format with `:root { }` wrapper
    - Write web platform tests expecting kebab-case with `--` prefix (e.g., `--color-primary`)
    - Write web platform tests expecting `var(--token-name)` references for semantic tokens
    - Write iOS platform tests expecting camelCase with proper casing (e.g., `colorPrimary`)
    - Write Android platform tests expecting snake_case (e.g., `color_primary`)
    - Use `getPlatformTokenName()` for cross-platform consistency assertions
    - Verify all test scenarios from original task 6.5 are covered (file structure, consistency, backward compatibility)
    - Verify generated file is `DesignTokens.web.css` (not `.js`)
    - Run tests and verify all pass
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3_

- [x] 7. Documentation Update

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Token System Overview documents semantic token generation
  - Examples show generated output for all three platforms
  - Primitive→semantic reference maintenance explained
  - Links to semantic token source files included
  
  **Primary Artifacts:**
  - `docs/token-system-overview.md` (updated)
  
  **Completion Documentation:**
  - `.kiro/specs/semantic-token-generation/completion/task-7-completion.md`

  - [x] 7.1 Update Token System Overview with semantic generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add section documenting semantic token generation capability
    - Add examples of generated output for web, iOS, and Android
    - Explain primitive→semantic reference maintenance
    - Add links to semantic token source files (ColorTokens.ts, SpacingTokens.ts, etc.)
    - Document usage guidance (use semantics first, primitives when needed)
    - _Requirements: All requirements (documentation of complete system)_
