# Implementation Plan: Variant Attribute Standardization

**Date**: November 25, 2025
**Spec**: 009 - Variant Attribute Standardization
**Status**: Implementation Planning
**Dependencies**: 
- Spec 005 (ButtonCTA Component) - Component implementation uses `style` attribute

---

## Implementation Plan

This implementation plan systematically updates the `style` attribute to `variant` across all affected files in the DesignerPunk design system. The approach is file-by-file to ensure accuracy and prevent unintended replacements. Each task includes verification steps to confirm changes are correct.

---

## Task List

- [x] 1. Update Component Development Standards

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component Development Guide establishes `variant` as standard attribute pattern
  - Anti-pattern warning added against using `style` for variants
  - Industry standards rationale documented
  - All future components will follow variant attribute pattern
  
  **Primary Artifacts:**
  - `.kiro/steering/Component Development Guide.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Update Component Development Guide with variant standard
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add section documenting `variant` as standard attribute name for component variations
    - Document rationale: IDE warnings, industry standards (Material, Shoelace, Spectrum)
    - Add anti-pattern warning against using `style` attribute for variants
    - Include example showing correct `variant` usage
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 2. Update ButtonCTA Component Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - ButtonCTA web component reads from `variant` attribute
  - TypeScript types use `variant` property
  - No references to `style` attribute remain in component code
  - Component behavior unchanged (only attribute name changed)
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.tsx`
  - `src/components/core/ButtonCTA/types.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Update ButtonCTA web component implementation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change `getAttribute('style')` to `getAttribute('variant')` in web component
    - Update internal variable names from `style` to `variant` for consistency
    - Verify component still renders all variants correctly (primary, secondary, danger)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Update ButtonCTA TypeScript types
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change `style` property to `variant` in ButtonCTAProps interface
    - Verify TypeScript compilation passes with no errors
    - Verify type definitions are correct for all variant values
    - _Requirements: 1.5_

- [x] 3. Update ButtonCTA Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All ButtonCTA documentation uses `variant` attribute
  - All code examples use `variant` attribute
  - HTML canary examples validate successfully
  - Documentation is consistent across all files
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/README.md`
  - `src/components/core/ButtonCTA/examples/*.html`
  - `src/components/core/ButtonCTA/examples/*.tsx`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Update ButtonCTA README documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace all `style` attribute references with `variant` in README
    - Update API reference table to show `variant` attribute
    - Update all code examples to use `variant` attribute
    - Verify documentation is clear and consistent
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 3.2 Update ButtonCTA HTML canary examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BasicUsage.html to use `variant` attribute
    - Update WithIcon.html to use `variant` attribute
    - Update Variants.html to use `variant` attribute
    - Run validation script to verify examples are correct
    - _Requirements: 2.3_

  - [x] 3.3 Update ButtonCTA TypeScript examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update BasicUsage.tsx to use `variant` property
    - Update any other TypeScript examples to use `variant` property
    - Verify TypeScript compilation passes
    - _Requirements: 2.5_

- [x] 4. Update ButtonCTA Test Suite

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All ButtonCTA tests use `variant` attribute
  - All tests pass with same assertions as before
  - Validation script passes for HTML examples
  - No test failures related to attribute naming
  
  **Primary Artifacts:**
  - `src/components/core/ButtonCTA/__tests__/ButtonCTA.test.ts`
  - `scripts/validate-examples.js` (if updates needed)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-4-summary.md` (triggers release detection)

  - [x] 4.1 Update ButtonCTA component tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Replace all `setAttribute('style', ...)` with `setAttribute('variant', ...)`
    - Update test descriptions to reference `variant` instead of `style`
    - Run test suite to verify all tests pass
    - Verify test assertions remain unchanged (behavior unchanged)
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Verify validation script compatibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `node scripts/validate-examples.js` to verify HTML examples
    - Update validation script if needed to check for `variant` attribute
    - Verify all HTML canary examples pass validation
    - _Requirements: 3.3_

- [x] 5. Verify Icon Component Consistency

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Icon component reviewed for variant attribute usage
  - If Icon uses variants, it uses `variant` attribute (not `style`)
  - Icon documentation consistent with variant standard
  - Cross-component consistency verified
  
  **Primary Artifacts:**
  - Icon component files (if variant patterns exist)
  - Icon documentation (if variant patterns exist)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-5-summary.md` (triggers release detection)

  - [x] 5.1 Review Icon component for variant patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Check if Icon component uses variant patterns (size variants, style variants, etc.)
    - If yes, verify it uses `variant` attribute (not `style`)
    - If no, document that Icon doesn't currently use variant patterns
    - Update Icon documentation if variant patterns exist
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Final Verification and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - No `style` attribute references remain in component code
  - All tests pass
  - All documentation is consistent
  - Migration guidance documented
  - Breaking change communicated
  
  **Primary Artifacts:**
  - Verification grep results
  - Test suite results
  - Migration guidance documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/009-variant-attribute-standardization/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/009-variant-attribute-standardization/task-6-summary.md` (triggers release detection)

  - [x] 6.1 Verify no style attribute references remain
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run grep search for `style="primary"`, `style="secondary"`, `style="danger"`
    - Run grep search for `getAttribute('style')` in component code
    - Run grep search for `style:` in TypeScript types
    - Document verification results showing no remaining references
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 6.2 Run full test suite verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to verify all tests pass
    - Run `node scripts/validate-examples.js` to verify HTML examples
    - Verify TypeScript compilation passes with no errors
    - Document test results showing all passing
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.3 Document breaking change and migration guidance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Document this as a breaking change in spec completion notes
    - Provide find-replace migration pattern for any affected code
    - Document rationale (IDE warnings, industry standards)
    - Note that old `style` attribute is not supported (clean break)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

