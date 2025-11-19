# Implementation Plan: Icon Size Tokens

**Date**: November 18, 2025
**Spec**: 006 - Icon Size Tokens
**Status**: Implementation Planning
**Dependencies**: Spec 001 (Mathematical Token System), Spec 004 (Icon System)

---

## Implementation Plan

This spec implements icon size tokens as semantic tokens that reference primitive fontSize and lineHeight tokens. The tokens use the formula `fontSize × lineHeight` to create mathematically-derived icon sizes that maintain perfect optical balance with typography.

---

## Task List

- [x] 1. Token System Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SemanticCategory.ICON added to type system
  - Icon size tokens created with fontSize × lineHeight formula
  - All 11 icon sizes calculated correctly
  - Token structure validated
  
  **Primary Artifacts:**
  - `src/types/SemanticToken.ts` (updated with ICON category)
  - `src/tokens/semantic/IconTokens.ts` (new file)
  - Token calculation and generation functions
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/006-icon-size-tokens/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/006-icon-size-tokens/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Add SemanticCategory.ICON to type system
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `ICON = 'icon'` to SemanticCategory enum in `src/types/SemanticToken.ts`
    - Verify enum compiles without errors
    - _Requirements: 1.1, 2.1_

  - [x] 1.2 Create IconTokens.ts with token structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/IconTokens.ts`
    - Define iconTokens object with all 11 sizes (050-700)
    - Each token includes name, primitiveReferences, category, context, description
    - Use SemanticCategory.ICON for all tokens
    - _Requirements: 1.1, 1.4, 2.1, 9.1, 9.2, 9.3, 9.4, 9.5_


  - [x] 1.3 Implement icon size calculation function
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create calculateIconSize() function (fontSize × lineHeight, rounded)
    - Create generateIconSizeTokens() function to generate all tokens
    - Add helper function for context generation
    - Verify calculations match expected values
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.4 Add icon tokens to semantic token exports
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `src/tokens/semantic/index.ts` to export IconTokens
    - Add getIconToken() and getAllIconTokens() helper functions
    - Update getSemanticToken() to handle icon.size* tokens
    - Update getSemanticTokensByCategory() for ICON category
    - _Requirements: 2.1, 7.1_

- [x] 2. Icon Component Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - IconSize type updated to include all calculated sizes
  - Icon component accepts new size values
  - Type safety maintained across all platforms
  - No breaking changes to existing Icon usage
  
  **Primary Artifacts:**
  - `src/components/core/Icon/types.ts` (updated)
  - Icon component implementations (unchanged)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/006-icon-size-tokens/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/006-icon-size-tokens/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Update IconSize type definition
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update IconSize type in `src/components/core/Icon/types.ts`
    - Change from `16 | 24 | 32 | 40` to `13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48`
    - Verify type compiles correctly
    - Verify Icon component still accepts size prop
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.2 Create icon size token reference object
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create iconSizes constant object in types.ts
    - Map token names to calculated values (size050: 13, size075: 18, etc.)
    - Export for use in Icon component
    - Verify type safety with IconSize type
    - _Requirements: 2.1, 5.1, 5.2, 5.3_


- [x] 3. Cross-Platform Token Generation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Icon size tokens generate correctly for web (TypeScript)
  - Icon size tokens generate correctly for iOS (Swift)
  - Icon size tokens generate correctly for Android (Kotlin)
  - Platform-specific constants match calculated values
  
  **Primary Artifacts:**
  - Build system updates for icon token generation
  - Generated platform-specific token files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/006-icon-size-tokens/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/006-icon-size-tokens/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Extend semantic token generation for icon sizes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update semantic token generation pipeline to handle ICON category
    - Implement icon size token resolution (resolve primitiveReferences)
    - Apply fontSize × lineHeight calculation during generation
    - Verify generated values match token definitions
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 3.2 Generate web TypeScript constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate TypeScript constants (iconSize050 = 13, etc.)
    - Generate CSS custom properties (--icon-size-050: 13px, etc.)
    - Include formula and typography pairing in comments
    - Verify generated file compiles correctly
    - _Requirements: 4.1, 4.5, 7.1, 7.2, 7.3_

  - [x] 3.3 Generate iOS Swift constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Swift CGFloat constants (let iconSize050: CGFloat = 13)
    - Include formula and typography pairing in comments
    - Verify generated file compiles in Xcode
    - _Requirements: 4.2, 4.4, 4.5, 7.1, 7.2, 7.3_

  - [x] 3.4 Generate Android Kotlin constants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Generate Kotlin Dp constants (val iconSize050 = 13.dp)
    - Include formula and typography pairing in comments
    - Verify generated file compiles in Android Studio
    - _Requirements: 4.3, 4.4, 4.5, 7.1, 7.2, 7.3_


- [x] 4. Testing and Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All token calculation tests pass
  - Icon component integration tests pass
  - Cross-platform generation tests pass
  - Type safety verified
  
  **Primary Artifacts:**
  - `src/tokens/semantic/__tests__/IconTokens.test.ts`
  - Updated Icon component tests
  - Cross-platform generation tests
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/006-icon-size-tokens/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/006-icon-size-tokens/task-4-summary.md` (triggers release detection)

  - [x] 4.1 Create icon size token calculation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/semantic/__tests__/IconTokens.test.ts`
    - Test calculateIconSize() function with various inputs
    - Test rounding behavior for non-integer results
    - Test all 11 token calculations match expected values
    - Verify 4pt subgrid alignment for applicable sizes
    - _Requirements: 1.1, 1.2, 1.3, 3.6_

  - [x] 4.2 Create icon size token structure tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test semantic token structure validation
    - Test primitiveReferences point to valid tokens
    - Test SemanticCategory.ICON is set correctly
    - Test context and description fields are populated
    - _Requirements: 1.4, 2.1, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 4.3 Update Icon component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update size variant tests to include new sizes
    - Test Icon component accepts all IconSize values
    - Test type safety with new IconSize type
    - Verify no breaking changes to existing tests
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 4.4 Create cross-platform generation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test web token generation (TypeScript + CSS)
    - Test iOS token generation (Swift)
    - Test Android token generation (Kotlin)
    - Verify generated values match calculated sizes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_


- [x] 5. Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Icon README updated with new sizes and formula
  - Typography pairing documented
  - Core vs available sizes guidance provided
  - AI agent reasoning examples included
  
  **Primary Artifacts:**
  - `src/components/core/Icon/README.md` (updated)
  - Icon size token usage guide
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/006-icon-size-tokens/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/006-icon-size-tokens/task-5-summary.md` (triggers release detection)

  - [x] 5.1 Update Icon README with new sizes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update size variants table with all 8 unique sizes
    - Add fontSize × lineHeight formula explanation
    - Document 4pt subgrid alignment
    - Update usage examples with new sizes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Document typography pairing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create typography pairing table (icon size → typography styles)
    - Add examples showing icon + text pairings
    - Document optical balance rationale
    - Explain why icons fill line height space
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4_

  - [x] 5.3 Document core vs available sizes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document core sizes (18, 24, 32, 36, 40) for 90% of use cases
    - Document available sizes (13, 28, 44, 48) for edge cases
    - Provide usage guidance for each size
    - Explain when to use each size category
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.4_

  - [x] 5.4 Add AI agent reasoning examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document icon size selection reasoning path
    - Show calculation examples (bodyMd → icon.size100)
    - Explain adaptability (fontSize changes → icon size adapts)
    - Provide formula breakdown for AI agents
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

---

## Post-Implementation Notes

### Build System Integration

Icon size tokens integrate with the existing semantic token generation pipeline. No new build infrastructure is required - the tokens use the same generation, validation, and registration systems as other semantic tokens (color, typography, spacing).

### No Breaking Changes

This implementation is non-breaking:
- Icon component API unchanged (still accepts numeric sizes)
- Existing hard-coded sizes (16, 24, 32, 40) remain valid
- New sizes are additions, not replacements
- Token usage is optional (can still use numeric literals)

### Future Enhancements

Not included in this implementation but documented for future consideration:
- Formula multiplier for fine-tuning optical balance
- Additional icon token types (icon.color.*, icon.spacing.*, icon.stroke.*)
- Runtime validation of icon-typography pairings
- Automated visual regression testing for optical balance

---

*This implementation plan creates icon size tokens as semantic tokens that reference primitive fontSize and lineHeight tokens, establishing mathematically-derived icon sizes that maintain perfect optical balance with typography.*

