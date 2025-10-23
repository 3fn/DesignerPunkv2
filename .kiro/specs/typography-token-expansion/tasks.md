# Implementation Plan: Typography Token Expansion

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Status**: Implementation Planning
**Dependencies**: None (extends existing typography tokens)

---

## Implementation Plan

This implementation plan converts the typography token expansion design into actionable coding tasks. The plan focuses on modifying the existing `TypographyTokens.ts` file to add new size variants and rename existing tokens for consistency.

All tasks reference specific requirements from the requirements document and follow the task type classification system (Setup, Implementation, Architecture) with appropriate validation and documentation tiers.

---

## Task List

- [x] 1. Typography Token Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 13 new typography tokens implemented (4 label, 3 code, 3 button, 3 body renames)
  - Naming consistency achieved across all size variants (Xs, Sm, Md, Lg)
  - Mathematical foundation preserved (fontSize paired with lineHeight)
  - Cross-platform generation working for all new tokens
  
  **Primary Artifacts:**
  - `src/tokens/semantic/TypographyTokens.ts` (modified)
  
  **Completion Documentation:**
  - `.kiro/specs/typography-token-expansion/completion/task-1-completion.md`

  - [x] 1.1 Rename existing body typography tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename `typography.bodySmall` to `typography.bodySm`
    - Rename `typography.body` to `typography.bodyMd`
    - Rename `typography.bodyLarge` to `typography.bodyLg`
    - Maintain all existing primitive references (fontSize, lineHeight, fontWeight, fontFamily, letterSpacing)
    - Update context and description strings to reflect new names
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Rename existing button typography token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename `typography.button` to `typography.buttonMd`
    - Maintain all existing primitive references
    - Update context and description strings to reflect new name
    - _Requirements: 1.4_

  - [x] 1.3 Implement label typography size variants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `typography.labelXs` (fontSize050, lineHeight050, fontWeight500)
    - Create `typography.labelSm` (fontSize075, lineHeight075, fontWeight500)
    - Create `typography.labelMd` (fontSize100, lineHeight100, fontWeight500)
    - Create `typography.labelLg` (fontSize125, lineHeight125, fontWeight500)
    - Use fontFamilyBody and letterSpacing100 for all variants
    - Add appropriate context and description for each variant
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 1.4 Implement code typography size variants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `typography.codeSm` (fontSize075, lineHeight075, fontWeight400)
    - Create `typography.codeMd` (fontSize100, lineHeight100, fontWeight400)
    - Create `typography.codeLg` (fontSize125, lineHeight125, fontWeight400)
    - Use fontFamilyMono and letterSpacing100 for all variants
    - Add appropriate context and description for each variant
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 1.5 Implement button typography size variants
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `typography.buttonSm` (fontSize075, lineHeight075, fontWeight500)
    - Create `typography.buttonLg` (fontSize125, lineHeight125, fontWeight500)
    - Use fontFamilyBody and letterSpacing100 for all variants
    - Add appropriate context and description for each variant
    - Note: `typography.buttonMd` already exists from rename in task 1.2
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 1.6 Verify mathematical foundation preservation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify all fontSize references use modular scale tokens (050, 075, 100, 125)
    - Verify all lineHeight references pair correctly with fontSize
    - Verify all fontWeight references use appropriate values (400 for body/code, 500 for label/button)
    - Verify all fontFamily references use appropriate families (body vs mono)
    - Run getDiagnostics to check for type errors
    - _Requirements: All requirements (mathematical foundation check)_

- [x] 2. Documentation and Migration Guide

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Migration guide created with old→new token mappings
  - Compositional color architecture documented with platform examples
  - Inline emphasis patterns documented for web, iOS, Android
  - Strategic flexibility rationale documented
  
  **Primary Artifacts:**
  - Documentation files (location TBD - could be in spec completion or separate docs)
  
  **Completion Documentation:**
  - `.kiro/specs/typography-token-expansion/completion/task-2-completion.md`

  - [x] 2.1 Create migration guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create table showing old token names → new token names
    - Document search-and-replace patterns for each platform
    - Explain rationale for naming changes (consistency with size scale)
    - Provide examples of before/after code
    - _Requirements: 1.5_

  - [x] 2.2 Document compositional color architecture
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Explain why typography tokens don't include color
    - Provide examples of composing typography + color for web, iOS, Android
    - Document recommended color pairings (body text, labels, code, buttons)
    - Explain combinatorial explosion rationale
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.3 Document inline emphasis patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document platform-native modifier patterns for bold and italic
    - Provide examples for web (semantic HTML `<strong>`, `<em>`)
    - Provide examples for iOS (SwiftUI `.fontWeight(.bold)`, `.italic()`)
    - Provide examples for Android (Compose AnnotatedString with SpanStyle)
    - Explain why emphasis tokens aren't needed
    - Discourage direct use of primitive fontWeight tokens
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 2.4 Document strategic flexibility rationale
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Explain why labelXs exists (floating label UI pattern)
    - Explain why bodyXs doesn't exist (caption/legal already cover 13px)
    - Explain why codeXs doesn't exist (readability below 14px)
    - Explain why buttonXs doesn't exist (accessibility guidelines)
    - Provide guidance on when to add new size variants
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
