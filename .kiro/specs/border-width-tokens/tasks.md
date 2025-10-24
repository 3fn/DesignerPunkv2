# Implementation Plan: Border Width Tokens

**Date**: October 23, 2025
**Spec**: border-width-tokens - Border Width Token System
**Status**: Implementation Planning
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Implementation Plan

This implementation plan converts the border width token design into a series of coding tasks that build incrementally. Each task focuses on specific implementation work, building on previous tasks to create a complete, integrated border width token system.

The implementation follows the established patterns from SpacingTokens and FontSizeTokens: create primitive tokens with mathematical relationships, create semantic tokens with primitive references, integrate with token registries, add cross-platform generation support, implement validation, and create documentation guides.

---

## Task List

- [x] 1. Create Border Width Token Files

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Border width token files created with primitive and semantic tokens
  - Mathematical relationships explicit in code
  - Files follow existing token file organization pattern
  
  **Primary Artifacts:**
  - `src/tokens/BorderWidthTokens.ts`
  - `src/tokens/semantic/BorderWidthTokens.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-1-completion.md`

  - [x] 1.1 Create primitive BorderWidthTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/BorderWidthTokens.ts` file (primitive tokens)
    - Define borderWidth100 with base value of 1
    - Define borderWidth200 as borderWidth100 × 2 (explicit multiplication)
    - Define borderWidth400 as borderWidth100 × 4 (explicit multiplication)
    - Add TypeScript type definitions for BorderWidthTokenKey
    - Add JSDoc comments documenting each token's purpose and platform output
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Create semantic BorderWidthTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/BorderWidthTokens.ts` file (semantic tokens)
    - Define borderDefault referencing BorderWidthTokens.borderWidth100
    - Define borderEmphasis referencing BorderWidthTokens.borderWidth200
    - Define borderHeavy referencing BorderWidthTokens.borderWidth400
    - Add TypeScript type definitions for SemanticBorderWidthTokenKey
    - Add JSDoc comments documenting use cases and visual weight for each token
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Integrate Border Width Tokens with Token Registries

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Status**: ⚠️ Superseded by Task 2.Fix - Implementation used incorrect pattern
  
  **Success Criteria:**
  - Border width tokens registered with PrimitiveTokenRegistry and SemanticTokenRegistry
  - Token retrieval working correctly
  - Reference resolution working for semantic tokens
  
  **Primary Artifacts:**
  - Token registration code in registry initialization
  - Registry integration tests
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-2-completion.md`

  - [x] 2.1 Register primitive border width tokens with PrimitiveTokenRegistry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: ⚠️ Superseded by Task 2.Fix - Used registration function pattern not used in system
    - Add registration code for primitive BorderWidthTokens (from src/tokens/BorderWidthTokens.ts) in PrimitiveTokenRegistry initialization
    - Ensure tokens are stored with category "border-width" and type "primitive"
    - Verify mathematical relationships are preserved in registry
    - Test token retrieval by name (e.g., getToken('borderWidth100'))
    - _Requirements: 5.1, 5.2_

  - [x] 2.2 Register semantic border width tokens with SemanticTokenRegistry
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: ⚠️ Superseded by Task 2.Fix - Used registration function pattern not used in system
    - Add registration code for semantic BorderWidthTokens (from src/tokens/semantic/BorderWidthTokens.ts) in SemanticTokenRegistry initialization
    - Ensure tokens are stored with primitive references
    - Verify reference resolution works (borderDefault → borderWidth100 → 1)
    - Test semantic token retrieval and resolution
    - _Requirements: 2.5, 5.2_

- [x] 2.Fix Align Border Width Tokens with System Patterns

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Rationale:**
  Tasks 1.1, 2.1, and 2.2 were implemented based on incorrect understanding of system patterns. 
  Border width tokens were created with simple value exports and registration functions, but the 
  system actually uses PrimitiveToken objects exported directly from token files with no separate 
  registration step. This task corrects the implementation to match how SpacingTokens, FontSizeTokens, 
  and other token families work.
  
  **Success Criteria:**
  - BorderWidthTokens.ts exports PrimitiveToken objects (matches SpacingTokens.ts pattern)
  - Registration functions removed (tokens consumed directly from definition files)
  - Border width tokens accessible via src/tokens/index.ts
  - All tests validate token structure, not registration functions
  - Pattern guide created to prevent future mistakes
  
  **Artifacts to Review/Correct:**
  - `src/tokens/BorderWidthTokens.ts` - Refactor to export PrimitiveToken objects
  - `src/registries/registerBorderWidthTokens.ts` - Delete (pattern not used in system)
  - `src/registries/__tests__/registerBorderWidthTokens.test.ts` - Delete and replace
  - `src/tokens/index.ts` - Update to include border width tokens
  - `src/tokens/__tests__/BorderWidthTokens.test.ts` - Create new tests
  
  **Primary Artifacts:**
  - Refactored `src/tokens/BorderWidthTokens.ts`
  - Updated `src/tokens/index.ts`
  - New `src/tokens/__tests__/BorderWidthTokens.test.ts`
  - New `.kiro/specs/token-system/token-category-pattern-guide.md`
  - Updated `docs/token-system-overview.md`
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-2-fix-completion.md`

  - [x] 2.Fix.1 Refactor BorderWidthTokens.ts to export PrimitiveToken objects
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/tokens/BorderWidthTokens.ts` to export complete PrimitiveToken objects
    - Follow pattern from SpacingTokens.ts: `borderWidthTokens: Record<string, PrimitiveToken>`
    - Include all required metadata for each token:
      - name, category (TokenCategory.BORDER_WIDTH), baseValue, familyBaseValue
      - description, mathematicalRelationship, baselineGridAlignment
      - isStrategicFlexibility, isPrecisionTargeted, platforms
    - Add helper function: `getBorderWidthToken(name: string): PrimitiveToken | undefined`
    - Add helper function: `getAllBorderWidthTokens(): PrimitiveToken[]`
    - Export constant: `BORDER_WIDTH_BASE_VALUE = 1`
    - Export type: `borderWidthTokenNames` array for type safety
    - Verify mathematical relationships preserved (borderWidth200 = borderWidth100 × 2, etc.)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1_

  - [x] 2.Fix.2 Remove registration functions and create proper token tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Delete `src/registries/registerBorderWidthTokens.ts` (pattern not used in system)
    - Delete `src/registries/__tests__/registerBorderWidthTokens.test.ts`
    - Update `src/tokens/semantic/BorderWidthTokens.ts` to use `{ value: 'primitiveTokenName' }` pattern:
      - Change `BorderWidthTokens.borderWidth100` to `{ value: 'borderWidth100' }`
      - Change `BorderWidthTokens.borderWidth200` to `{ value: 'borderWidth200' }`
      - Change `BorderWidthTokens.borderWidth400` to `{ value: 'borderWidth400' }`
      - Remove import of `BorderWidthTokens` from primitive file
      - Follow pattern from semantic/SpacingTokens.ts
    - Create `src/tokens/__tests__/BorderWidthTokens.test.ts` following pattern from other token tests
    - Test PrimitiveToken object structure (all required fields present)
    - Test mathematical relationships (borderWidth200 = borderWidth100 × 2, borderWidth400 = borderWidth100 × 4)
    - Test helper functions (getBorderWidthToken, getAllBorderWidthTokens)
    - Test token names array matches exported tokens
    - Test platform values are correct (px, pt, dp)
    - Test baselineGridAlignment is false (border widths don't require grid alignment)
    - Test isStrategicFlexibility is false (no strategic flexibility tokens in border width family)
    - _Requirements: 1.5, 5.1_

  - [x] 2.Fix.3 Update token index files to include border width tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add border width exports to `src/tokens/index.ts`:
      - Export borderWidthTokens, borderWidthTokenNames, getBorderWidthToken, getAllBorderWidthTokens, BORDER_WIDTH_BASE_VALUE
    - Add `[TokenCategory.BORDER_WIDTH]: borderWidthTokens` to allTokens object
    - Add `[TokenCategory.BORDER_WIDTH]: 1` to TOKEN_FAMILY_BASE_VALUES
    - Update `getAllTokens()` function to include border width tokens in flat array
    - Update `getTokensByCategory()` to handle TokenCategory.BORDER_WIDTH
    - Test that border width tokens are accessible via index exports
    - Test that `getAllTokens()` includes all border width tokens
    - Test that `getTokensByCategory(TokenCategory.BORDER_WIDTH)` returns border width tokens
    - _Requirements: 5.1, 5.2_

  - [x] 2.Fix.4 Create token category pattern guide and update overview
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/specs/token-system/token-category-pattern-guide.md`
    - Document primitive token structure:
      - PrimitiveToken object format with all required fields
      - Export pattern: `tokenFamilyTokens: Record<string, PrimitiveToken>`
      - Helper functions: `getToken()`, `getAllTokens()`
      - Constants: `FAMILY_BASE_VALUE`
      - Type exports: `tokenNames` array
    - Document semantic token structure:
      - `{ value: 'primitiveTokenName' }` format for primitive references
      - Nested object structure for hierarchical semantic tokens
      - No registration functions needed
    - Document file organization pattern:
      - Token definition file: `src/tokens/TokenFamilyTokens.ts`
      - Semantic tokens: `src/tokens/semantic/TokenFamilyTokens.ts`
      - Tests: `src/tokens/__tests__/TokenFamilyTokens.test.ts`
      - Index integration: `src/tokens/index.ts`
    - Document what NOT to do:
      - ❌ Don't export simple values (export PrimitiveToken objects)
      - ❌ Don't create registration functions (tokens consumed directly)
      - ❌ Don't create tests for registration (test token structure)
    - Include complete checklist for adding new token categories
    - Add cross-references to existing token files as examples:
      - SpacingTokens.ts (primitive tokens with strategic flexibility)
      - FontSizeTokens.ts (primitive tokens with modular scale)
      - semantic/SpacingTokens.ts (semantic tokens with nested structure)
      - semantic/TypographyTokens.ts (semantic tokens composing multiple primitives)
    - Update `docs/token-system-overview.md`:
      - Add prominent "Adding New Token Categories" section after Introduction
      - Include warning callout with link to pattern guide
      - Explain what the guide covers and why it's important
      - Add cross-reference from "Related Documentation" section
    - _Requirements: 5.1 (documentation of system patterns)_

  - [x] 2.Fix.5 Verify border width tokens work with existing system
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run all existing tests to ensure no regressions
    - Verify border width tokens accessible via `getAllTokens()`
    - Verify border width tokens accessible via `getTokensByCategory(TokenCategory.BORDER_WIDTH)`
    - Verify border width tokens accessible via `getTokenByName('borderWidth100')`
    - Test that semantic BorderWidthTokens can reference primitive tokens by name
    - Verify mathematical relationships preserved in token objects
    - Run getDiagnostics on all modified files
    - Document any integration issues discovered
    - _Requirements: 5.1, 5.2_

- [x] 3. Add Cross-Platform Generation Support

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Prerequisites**: Task 2.Fix must be complete (border width tokens must be in correct format)
  
  **Success Criteria:**
  - Border width tokens generate correctly for web (CSS), iOS (Swift), and Android (Kotlin)
  - Unitless values convert to platform-specific units (px, pt, dp)
  - Mathematical relationships maintained in generated output
  
  **Primary Artifacts:**
  - Updated platform generators (WebCSSGenerator, iOSSwiftGenerator, AndroidKotlinGenerator)
  - Generated platform-specific token files
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-3-completion.md`

  - [x] 3.1 Add border width generation to WebCSSGenerator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update WebCSSGenerator to handle border width tokens from src/tokens/index.ts
    - Retrieve border width tokens via getAllTokens() or getTokensByCategory(TokenCategory.BORDER_WIDTH)
    - Convert unitless values to px (borderWidth100: 1 → --border-width-100: 1px)
    - Generate CSS custom properties for primitive tokens
    - Generate CSS custom properties for semantic tokens
    - Test generated CSS output matches expected format
    - _Requirements: 3.2, 3.5, 5.3, 5.4_

  - [x] 3.2 Add border width generation to iOSSwiftGenerator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update iOSSwiftGenerator to handle border width tokens from src/tokens/index.ts
    - Retrieve border width tokens via getAllTokens() or getTokensByCategory(TokenCategory.BORDER_WIDTH)
    - Convert unitless values to pt (borderWidth100: 1 → static let borderWidth100: CGFloat = 1)
    - Generate Swift constants for primitive tokens
    - Generate Swift constants for semantic tokens
    - Test generated Swift output matches expected format
    - _Requirements: 3.3, 3.5, 5.3, 5.4_

  - [x] 3.3 Add border width generation to AndroidKotlinGenerator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update AndroidKotlinGenerator to handle border width tokens from src/tokens/index.ts
    - Retrieve border width tokens via getAllTokens() or getTokensByCategory(TokenCategory.BORDER_WIDTH)
    - Convert unitless values to dp (borderWidth100: 1 → val borderWidth100 = 1.dp)
    - Generate Kotlin vals for primitive tokens
    - Generate Kotlin vals for semantic tokens
    - Test generated Kotlin output matches expected format
    - _Requirements: 3.4, 3.5, 5.3, 5.4_

  - [x] 3.4 Integrate border width tokens with BuildOrchestrator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BuildOrchestrator to include border width tokens in build process
    - Retrieve border width tokens from src/tokens/index.ts (via getAllTokens() or getTokensByCategory())
    - Verify border width tokens are passed to platform generators
    - Test end-to-end build process generates border width tokens for all platforms
    - _Requirements: 5.3_

- [x] 4. Implement Mathematical Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Mathematical relationships validated for primitive tokens
  - Semantic token references validated
  - Validation errors provide clear, actionable messages
  
  **Primary Artifacts:**
  - Border width validation logic in ThreeTierValidator
  - Validation tests
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-4-completion.md`

  - [x] 4.1 Add border width mathematical relationship validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add validation logic to ThreeTierValidator for border width tokens
    - Validate borderWidth200 = borderWidth100 × 2
    - Validate borderWidth400 = borderWidth100 × 4
    - Return validation results with Pass/Warning/Error status
    - Provide clear error messages with expected vs actual values
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.2 Add semantic token reference validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add validation logic to verify semantic tokens reference valid primitives
    - Validate borderDefault references borderWidth100
    - Validate borderEmphasis references borderWidth200
    - Validate borderHeavy references borderWidth400
    - Return validation errors for invalid references
    - _Requirements: 4.4, 4.5_

- [x] 5. Create Documentation Guides

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Usage pattern guide created with clear examples
  - Focus indicator guide created with platform-specific patterns
  - Integration examples guide created with code samples
  - All guides follow cross-reference standards
  
  **Primary Artifacts:**
  - `.kiro/specs/border-width-tokens/usage-patterns-guide.md`
  - `.kiro/specs/border-width-tokens/focus-indicator-guide.md`
  - `.kiro/specs/border-width-tokens/integration-examples.md`
  
  **Completion Documentation:**
  - `.kiro/specs/border-width-tokens/completion/task-5-completion.md`

  - [x] 5.1 Create usage patterns guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/specs/border-width-tokens/usage-patterns-guide.md`
    - Document when to use borderDefault (cards, inputs at rest, buttons at rest, dividers)
    - Document when to use borderEmphasis (inputs on focus, selected cards, active buttons)
    - Document when to use borderHeavy (strong visual weight, rare use)
    - Include appropriate and inappropriate usage examples
    - Add cross-references to compositional color guide and spacing token guide
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 5.2 Create focus indicator guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/specs/border-width-tokens/focus-indicator-guide.md`
    - Document web focus pattern (outline with borderEmphasis width)
    - Document iOS focus pattern (system-provided focus indicators)
    - Document Android focus pattern (ripple effects and elevation)
    - Include code examples for each platform
    - Add cross-references to accessibility guidelines and platform documentation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.3 Create integration examples guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/specs/border-width-tokens/integration-examples.md`
    - Document border width + color composition patterns
    - Include component implementation examples (cards, inputs, buttons)
    - Show migration examples from hardcoded values to tokens
    - Add cross-references to component documentation and color token guides
    - _Requirements: 5.5_

---

## Note on Task 6 (Add Tests for Border Width Tokens)

**Task 6 was removed as redundant.** All necessary testing was completed through existing work:

### 1. Token-Specific Tests (Task 2.Fix.2)

Comprehensive tests for border width token structure, mathematical relationships, and system integration were created in Task 2.Fix.2:

- **`src/tokens/__tests__/BorderWidthTokens.test.ts`** (20+ test cases)
  - ✅ PrimitiveToken object structure validation
  - ✅ Mathematical relationships (borderWidth200 = borderWidth100 × 2, borderWidth400 = borderWidth100 × 4)
  - ✅ Helper functions (getBorderWidthToken, getAllBorderWidthTokens)
  - ✅ Platform values (px, pt, dp)
  - ✅ Token properties (baselineGridAlignment, isStrategicFlexibility, isPrecisionTargeted)
  - ✅ Index file integration (getAllTokens, getTokensByCategory, getTokenByName)

- **`src/tokens/semantic/__tests__/BorderWidthTokens.test.ts`** (10+ test cases)
  - ✅ Semantic token structure ({ value: 'primitiveTokenName' } pattern)
  - ✅ Primitive references (borderDefault → 'borderWidth100', etc.)
  - ✅ Pattern consistency with semantic/SpacingTokens.ts

### 2. System-Level Validation Tests (mathematical-token-system spec)

The validation system was built in the mathematical-token-system spec and validates ALL tokens, including border width:

- **`src/validators/__tests__/ThreeTierValidator.test.ts`** (20 test cases)
  - ✅ Pass/Warning/Error validation for all token types
  - ✅ Mathematical relationship validation
  - ✅ Validation report generation

- **`src/validators/__tests__/ValidationReasoning.test.ts`** (15 test cases)
  - ✅ Mathematical reasoning generation for all token types

- **`src/validators/__tests__/BaselineGridValidator.test.ts`**
  - ✅ Baseline grid validation (border widths correctly marked as not requiring alignment)

- **`src/validators/__tests__/CrossPlatformConsistency.test.ts`** (25 test cases)
  - ✅ Cross-platform mathematical consistency validation

### 3. Build System Tests (cross-platform-build-system spec)

The cross-platform generation system was tested in the cross-platform-build-system spec:

- **`src/generators/__tests__/TokenFileGenerator.test.ts`**
  - ✅ Web token generation (CSS custom properties)
  - ✅ iOS token generation (Swift constants)
  - ✅ Android token generation (Kotlin vals)
  - ✅ Cross-platform consistency validation

Border width tokens are automatically included in generation if properly structured (which Task 2.Fix verified).

### Why Task 6 Was Redundant

**Task 6 violated the Spec Planning Standards principle**:
> "When required, testing MUST not have a stand-alone task, instead it should be a sub-task under some parent task."

The correct pattern (which was followed) is:
1. **Token-specific tests** created alongside implementation (Task 2.Fix.2)
2. **System-level tests** created in system specs (mathematical-token-system, cross-platform-build-system)
3. **No separate test task** at the end of the spec

Task 6 was attempting to duplicate tests that already exist at the appropriate levels of the system architecture.

---

*This implementation plan provides a structured approach to implementing the border width token system, building incrementally from token creation through integration, generation, validation, and documentation.*
