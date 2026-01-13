# Implementation Plan: Component Alignment and Consistency

**Date**: 2026-01-12
**Spec**: 040 - Component Alignment
**Status**: Implementation Planning
**Dependencies**: None

---

## Overview

This implementation plan aligns four web components (Button-CTA, Button-VerticalListItem, ButtonIcon, Input-Text-Base) to consistent architectural patterns. Work is organized by component, with ButtonIcon receiving the most changes and Input-Text-Base the least.

## Task List

### Task 1: ButtonIcon Alignment

- [x] 1. ButtonIcon Alignment
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: ButtonIcon uses blend utilities, incremental DOM, semantic motion tokens, external CSS, token-referenced sizing, and follows naming conventions

  - [x] 1.1 Rename directory from `ButtonIcon/` to `Button-Icon/`
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `Button-Icon/` directory structure
    - Move all files from `ButtonIcon/` to `Button-Icon/`
    - Update all internal import paths
    - Delete old `ButtonIcon/` directory
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 1.2 Extract inline CSS to external file
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `Button-Icon/platforms/web/ButtonIcon.web.css`
    - Move styles from `_generateStyles()` method to CSS file
    - Update component to import CSS using esbuild plugin pattern
    - Remove `_generateStyles()` method
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 1.3 Integrate blend utilities for state colors
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Import `getBlendUtilities` from `blend/ThemeAwareBlendUtilities.web`
    - Initialize blend utilities in constructor
    - Add `_calculateBlendColors()` method with retry pattern
    - Calculate hover and pressed colors in `connectedCallback()`
    - Apply colors via CSS custom properties (`--_bi-hover-bg`, `--_bi-pressed-bg`)
    - Remove `filter: brightness()` from CSS
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

  - [x] 1.4 Implement incremental DOM update pattern
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add `_domCreated` flag
    - Create `_createDOM()` method for initial render
    - Create `_updateDOM()` method for attribute changes
    - Cache DOM element references (`_button`, `_iconEl`)
    - Update `render()` to route through `_createDOM`/`_updateDOM`
    - Update `attributeChangedCallback()` to call `_updateDOM()` instead of full render
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.5 Add semantic motion token
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Update CSS transitions to use `--motion-button-press-duration` and `--motion-button-press-easing`
    - Remove primitive `--duration-150` with hard-coded easing
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 1.6 Replace hard-coded values with token references
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add CSS custom property definitions in `:host` for size and inset values
    - Update size variant classes to use `var(--_bi-size-*)` and `var(--_bi-inset-*)`
    - Remove hard-coded pixel values (8px, 32px, 40px, 48px, etc.)
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 1.7 Update CSS custom property naming
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Rename `--button-icon-*` properties to `--_bi-*`
    - Update all CSS references to use new naming
    - _Requirements: 7.3, 7.4_

  - [x] 1.8 Write ButtonIcon alignment tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Write evergreen tests for blend utility integration
    - Write evergreen tests for DOM element identity preservation
    - Write evergreen tests for motion token usage
    - Write temporary migration tests (no filter: brightness, no hard-coded values)
    - _Requirements: 1.1, 1.2, 2.2, 2.3, 3.2_

---

### Task 2: Button-CTA Alignment

- [ ] 2. Button-CTA Alignment
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: Button-CTA uses incremental DOM and semantic motion tokens

  - [ ] 2.1 Implement incremental DOM update pattern
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add `_domCreated` flag
    - Create `_createDOM()` method for initial render
    - Create `_updateDOM()` method for attribute changes
    - Cache DOM element references (`_button`, `_labelEl`, `_iconEl`)
    - Update `render()` to route through `_createDOM`/`_updateDOM`
    - Update `attributeChangedCallback()` to call `_updateDOM()` instead of full render
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 2.2 Add semantic motion token
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Update CSS transitions to use `--motion-button-press-duration` and `--motion-button-press-easing`
    - Remove primitive `--duration-150` with hard-coded `ease-in-out`
    - _Requirements: 3.1, 3.3, 3.4_

  - [ ] 2.3 Write Button-CTA alignment tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Write evergreen tests for DOM element identity preservation
    - Write evergreen tests for motion token usage
    - Write temporary migration tests (no primitive + hard-coded easing)
    - _Requirements: 2.2, 2.3, 3.1_

---

### Task 3: Button-VerticalListItem Alignment

- [ ] 3. Button-VerticalListItem Alignment
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: Button-VerticalListItem uses blend utilities and follows CSS property naming convention

  - [ ] 3.1 Integrate blend utilities for state colors
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Import `getBlendUtilities` from `blend/ThemeAwareBlendUtilities.web`
    - Initialize blend utilities in constructor
    - Add `_calculateBlendColors()` method with retry pattern
    - Calculate hover and pressed colors in `connectedCallback()`
    - Apply colors via CSS custom properties
    - Remove `filter: brightness()` from CSS
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [ ] 3.2 Update CSS custom property naming
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Rename `--vlbi-*` properties to `--_vlbi-*`
    - Update all CSS references to use new naming
    - _Requirements: 7.2, 7.4_

  - [ ] 3.3 Write Button-VerticalListItem alignment tests
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Write evergreen tests for blend utility integration
    - Write temporary migration tests (no filter: brightness)
    - _Requirements: 1.3, 1.4_

---

### Task 4: Input-Text-Base Alignment

- [ ] 4. Input-Text-Base Alignment
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: Input-Text-Base uses external CSS file

  - [ ] 4.1 Extract inline CSS to external file
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `Input-Text-Base/platforms/web/InputTextBase.web.css`
    - Move styles from `getStyles()` method to CSS file
    - Update component to import CSS using esbuild plugin pattern
    - Remove `getStyles()` method
    - _Requirements: 5.2, 5.3, 5.4_

---

### Task 5: Focus Ring Standardization

- [ ] 5. Focus Ring Standardization
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: All components implement focus rings consistently using accessibility tokens

  - [ ] 5.1 Audit and standardize focus ring implementations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Review focus ring CSS in all four components
    - Ensure all use `outline` property (not `box-shadow` alone)
    - Ensure all reference `--accessibility-focus-*` tokens
    - Update any inconsistent implementations
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

---

### Task 6: Component Development Guide Updates

- [ ] 6. Component Development Guide Updates
  **Type**: Documentation
  **Validation**: Tier 1: Minimal
  **Success Criteria**: Component Development Guide documents blend utilities, incremental DOM, and CSS property naming patterns

  - [ ] 6.1 Add blend utility usage section
    **Type**: Documentation
    **Validation**: Tier 1: Minimal
    - Add section explaining why blend utilities are preferred over CSS filters
    - Reference Button-CTA as canonical implementation example
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 6.2 Add incremental DOM pattern section
    **Type**: Documentation
    **Validation**: Tier 1: Minimal
    - Add section explaining `_createDOM()` + `_updateDOM()` architecture
    - Explain why this pattern preserves CSS transitions
    - Reference Button-VerticalListItem as canonical implementation example
    - _Requirements: 9.4, 9.5, 9.6, 9.7_

  - [ ] 6.3 Add CSS custom property naming guidance
    **Type**: Documentation
    **Validation**: Tier 1: Minimal
    - Add section explaining `--_[abbrev]-*` naming convention
    - Explain distinction between component-scoped and design system tokens
    - _Requirements: 9.8_

---

### Task 7: Final Validation

- [ ] 7. Final Validation
  **Type**: Implementation
  **Validation**: Tier 2: Standard
  **Success Criteria**: All tests pass, all components render correctly, no regressions

  - [ ] 7.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Run `npm test` to validate all tests pass
    - Verify no regressions in existing functionality
    - Ensure all new alignment tests pass

  - [ ] 7.2 Visual verification
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify ButtonIcon renders correctly in browser demo
    - Verify Button-CTA renders correctly in browser demo
    - Verify Button-VerticalListItem renders correctly in browser demo
    - Verify Input-Text-Base renders correctly in browser demo
    - Verify hover/pressed state colors are consistent across components

  - [ ] 7.3 Retire temporary tests
    **Type**: Documentation
    **Validation**: Tier 1: Minimal
    - Review temporary migration tests
    - Document which tests should be retired
    - (Actual deletion deferred to post-spec cleanup)

---

## Notes

- Each task references specific requirements for traceability
- ButtonIcon has the most work (8 subtasks); Input-Text-Base has the least (1 subtask)
- All components maintain existing public APIs (non-breaking internally)
- Temporary migration tests should be retired after spec completion
