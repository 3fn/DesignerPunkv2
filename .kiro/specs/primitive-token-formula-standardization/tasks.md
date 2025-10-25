# Implementation Plan: Primitive Token Formula Standardization

**Date**: October 24, 2025
**Spec**: primitive-token-formula-standardization
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This implementation plan converts primitive token hard values to formulas using BASE_VALUE constants. The work is lightweight refactoring - replacing numeric literals with simple formulas (e.g., `12` → `SPACING_BASE_VALUE * 1.5`). Each task focuses on minimal code changes with validation to ensure correctness.

---

## Task List

- [x] 1. Audit and Document Current Token Patterns

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Complete audit report identifying all tokens requiring refactoring
  - Clear categorization of formula-based, hard-value, strategic flexibility, and categorical tokens
  - Documented refactoring scope with token counts per file
  
  **Primary Artifacts:**
  - Audit report document or markdown file
  - Token classification list
  
  **Completion Documentation:**
  - `.kiro/specs/primitive-token-formula-standardization/completion/task-1-completion.md`

  - [x] 1.1 Scan and categorize all primitive token files
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Review all files in `src/tokens/`
    - Categorize each as: formula-based, hard-value, mixed, or categorical
    - Identify strategic flexibility tokens in each file
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Generate audit report with refactoring scope
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create audit report listing files by category
    - Count tokens requiring refactoring per file
    - Identify strategic flexibility tokens to preserve
    - Document categorical tokens to exclude
    - _Requirements: 1.3, 1.4, 8.1, 8.2, 8.3, 8.4_

- [x] 2. Refactor SpacingTokens to Use Formulas

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All non-strategic-flexibility spacing tokens use formulas
  - Strategic flexibility tokens (space075, space125, space250) preserved unchanged
  - All formula results match original hard values
  
  **Primary Artifacts:**
  - `src/tokens/SpacingTokens.ts` (refactored)
  
  **Completion Documentation:**
  - `.kiro/specs/primitive-token-formula-standardization/completion/task-2-completion.md`

  - [x] 2.1 Replace hard values with SPACING_BASE_VALUE formulas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `baseValue: 2` with `baseValue: SPACING_BASE_VALUE * 0.25`
    - Replace `baseValue: 4` with `baseValue: SPACING_BASE_VALUE * 0.5`
    - Replace `baseValue: 12` with `baseValue: SPACING_BASE_VALUE * 1.5`
    - Replace `baseValue: 16` with `baseValue: SPACING_BASE_VALUE * 2`
    - Replace `baseValue: 24` with `baseValue: SPACING_BASE_VALUE * 3`
    - Replace `baseValue: 32` with `baseValue: SPACING_BASE_VALUE * 4`
    - Replace `baseValue: 40` with `baseValue: SPACING_BASE_VALUE * 5`
    - Replace `baseValue: 48` with `baseValue: SPACING_BASE_VALUE * 6`
    - Replace `baseValue: 8` with `baseValue: SPACING_BASE_VALUE`
    - Preserve mathematicalRelationship strings unchanged
    - _Requirements: 3.1, 3.2, 3.5, 5.1_

  - [x] 2.2 Verify strategic flexibility tokens preserved
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Confirm space075, space125, space250 use STRATEGIC_FLEXIBILITY_TOKENS constants
    - Verify isStrategicFlexibility flags remain true
    - Ensure no changes to strategic flexibility token baseValue patterns
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.3 Validate formula results match original values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Calculate each formula result
    - Compare to original hard value
    - Verify 100% match rate
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Refactor RadiusTokens to Use Formulas

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All non-strategic-flexibility radius tokens use formulas
  - Strategic flexibility tokens (radius075, radius125, radius250, radiusFull) preserved unchanged
  - All formula results match original hard values
  
  **Primary Artifacts:**
  - `src/tokens/RadiusTokens.ts` (refactored)
  
  **Completion Documentation:**
  - `.kiro/specs/primitive-token-formula-standardization/completion/task-3-completion.md`

  - [x] 3.1 Replace hard values with RADIUS_BASE_VALUE formulas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace `baseValue: 0` with `baseValue: RADIUS_BASE_VALUE * 0`
    - Replace `baseValue: 2` with `baseValue: RADIUS_BASE_VALUE * 0.25`
    - Replace `baseValue: 4` with `baseValue: RADIUS_BASE_VALUE * 0.5`
    - Replace `baseValue: 12` with `baseValue: RADIUS_BASE_VALUE * 1.5`
    - Replace `baseValue: 16` with `baseValue: RADIUS_BASE_VALUE * 2`
    - Replace `baseValue: 24` with `baseValue: RADIUS_BASE_VALUE * 3`
    - Replace `baseValue: 32` with `baseValue: RADIUS_BASE_VALUE * 4`
    - Replace `baseValue: 8` with `baseValue: RADIUS_BASE_VALUE`
    - Preserve mathematicalRelationship strings unchanged
    - _Requirements: 3.1, 3.2, 3.5, 5.1_

  - [x] 3.2 Verify strategic flexibility tokens preserved
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Confirm radius075, radius125, radius250, radiusFull unchanged
    - Verify isStrategicFlexibility flags remain true
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 3.3 Validate formula results match original values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Calculate each formula result
    - Compare to original hard value
    - Verify 100% match rate
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 4. Refactor FontSizeTokens to Use Formulas with Math.round()

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All fontSize tokens use formulas with Math.round() where needed
  - Modular scale calculations produce correct integer values
  - All formula results match original hard values
  
  **Primary Artifacts:**
  - `src/tokens/FontSizeTokens.ts` (refactored)
  
  **Completion Documentation:**
  - `.kiro/specs/primitive-token-formula-standardization/completion/task-4-completion.md`

  - [x] 4.1 Replace hard values with FONT_SIZE_BASE_VALUE formulas
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace fontSize050 hard value with `Math.round(FONT_SIZE_BASE_VALUE / Math.pow(MODULAR_SCALE_RATIO, 2))`
    - Replace fontSize075 hard value with `Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO)`
    - Replace fontSize100 hard value with `FONT_SIZE_BASE_VALUE`
    - Replace fontSize125 hard value with `Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO)`
    - Replace fontSize150 hard value with `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2))`
    - Replace fontSize200 hard value with `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 3))`
    - Replace fontSize300 hard value with `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 4))`
    - Replace fontSize400 hard value with `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 5))`
    - Replace fontSize500, fontSize600, fontSize700 hard values with appropriate formulas
    - Preserve mathematicalRelationship strings unchanged
    - _Requirements: 3.1, 3.3, 3.4, 5.1, 6.1, 6.4_

  - [x] 4.2 Validate formula results match original values
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Calculate each formula result
    - Compare to original hard value
    - Verify 100% match rate
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5. Run Existing Tests and Verify Backward Compatibility

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All existing token tests pass without modification
  - Token consumers receive same numeric values as before
  - Platform values unchanged
  
  **Primary Artifacts:**
  - Test results
  - Compatibility verification report
  
  **Completion Documentation:**
  - `.kiro/specs/primitive-token-formula-standardization/completion/task-5-completion.md`

  - [x] 5.1 Run existing token tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run all tests in `src/tokens/__tests__/`
    - Verify 100% pass rate
    - Document any failures for investigation
    - _Requirements: 10.4_

  - [x] 5.2 Verify token consumer compatibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify token structure unchanged (name, category, baseValue, platforms)
    - Verify baseValue returns numeric value (not formula)
    - Verify platform values unchanged
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 5.3 Verify AI-readable mathematical relationships
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify formulas are executable code in baseValue property
    - Verify formulas produce correct numeric values
    - Verify formulas match mathematicalRelationship strings
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

---

*This implementation plan provides a systematic approach to refactoring primitive tokens from hard values to formulas through lightweight code changes with comprehensive validation.*
