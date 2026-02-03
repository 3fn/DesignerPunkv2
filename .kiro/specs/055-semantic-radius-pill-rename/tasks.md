# Implementation Plan: Primitive Radius Token Rename

**Date**: 2026-02-03
**Spec**: 055 - Primitive Radius Token Rename (radiusFull → radiusMax)
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This is a focused rename operation with minimal blast radius. The implementation follows a bottom-up approach: rename primitive first, update semantic reference, then update tests and documentation.

---

## Task List

- [x] 1. Rename Primitive Token and Update References

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Primitive token renamed from `radiusFull` to `radiusMax` with value 9999
  - Semantic token `radiusFull` references `radiusMax`
  - CSS generation produces valid output (no self-references)
  - All tests pass
  - Documentation updated
  
  **Primary Artifacts:**
  - `src/tokens/RadiusTokens.ts` (primitive rename)
  - `src/tokens/semantic/RadiusTokens.ts` (reference update)
  - Test files updated
  - `.kiro/steering/Token-Family-Radius.md` updated
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/055-semantic-radius-pill-rename/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/055-semantic-radius-pill-rename/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Primitive Radius Token Rename"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Rename primitive token in RadiusTokens.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Rename `radiusFull` key to `radiusMax` in `radiusTokens` object
    - Update `name` property from `'radiusFull'` to `'radiusMax'`
    - Update `description` from "Full radius" to "Maximum radius"
    - Preserve all other metadata (category, baseValue, mathematicalRelationship, isStrategicFlexibility)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Update semantic token reference
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change `radiusFull` semantic token from `{ value: 'radiusFull' }` to `{ value: 'radiusMax' }`
    - Verify semantic token name remains `radiusFull` (unchanged)
    - Update JSDoc comment to reference `radiusMax` instead of `radiusFull`
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Update test files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `AIReadableMathematicalRelationships.test.ts`: Change `radiusFull` to `radiusMax`
    - Update `RadiusTokensFormulaValidation.test.ts`: Change test names and assertions
    - Update `RadiusStrategicFlexibilityValidation.test.ts`: Change describe block and assertions
    - Update `TokenCategories.test.ts`: Change special case references
    - Run `npm test` to verify all tests pass
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.4 Update Token-Family-Radius.md documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Replace primitive `radiusFull` references with `radiusMax`
    - Update primitive token table to show `radiusMax` with value 9999px
    - Update semantic token table to show `radiusFull` referencing `radiusMax`
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 1.5 Verify badge components render correctly
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Build browser distribution: `npm run build:browser`
    - Open `dist/browser/badge-demo.html` in browser
    - Verify single-digit badges display as circles
    - Verify multi-digit badges display as pills (not circles)
    - _Requirements: 5.1, 5.2, 5.3_
