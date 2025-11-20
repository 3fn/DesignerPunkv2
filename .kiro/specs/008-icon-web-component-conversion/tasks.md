# Implementation Plan: Icon Web Component Conversion

**Date**: November 19, 2025
**Spec**: 008 - Icon Web Component Conversion
**Status**: Implementation Planning
**Dependencies**: 
- Spec 004 (Icon System - existing implementation)
  - Status: Complete
  - Required for: All tasks (existing Icon implementation)
  - Integration point: loadIconSVG(), createIcon(), Icon class
- Spec 005 (ButtonCTA Component) - Working web component
  - Status: In Progress (Task 3.3 not complete)
  - Required for: Task 3.7 (integration tests)
  - Integration point: ButtonCTA web component with shadow DOM
  - **BLOCKER**: Cannot complete Task 3.7 until ButtonCTA works in test environment

---

## Implementation Plan

This implementation plan converts the existing Icon web implementation from a TypeScript class-based approach to a vanilla web component (Custom Element). The conversion maintains True Native Architecture consistency while preserving the existing Icon API, accessibility features, and token integration.

**Implementation Approach**:
1. Create web component class extending HTMLElement with Shadow DOM
2. Implement custom element registration as `<dp-icon>`
3. Create CSS stylesheet for minimal icon styling
4. Maintain backward compatibility with existing `createIcon()` and `Icon` class exports
5. Update ButtonCTA to continue working without changes
6. Create comprehensive tests for web component functionality
7. Update documentation with web component usage examples

**Key Principles**:
- True Native Architecture (vanilla web components for web)
- Backward compatibility (zero breaking changes)
- Token-based styling (CSS custom properties)
- Accessibility-first (aria-hidden for decorative icons)
- Pattern consistency (follow ButtonCTA web component pattern)

---

## Task List

- [x] 1. Implement Icon Web Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Web component renders all 15 icons correctly
  - Shadow DOM encapsulation working with CSS custom properties
  - Attributes and properties API functional (name, size, color, test-id)
  - Backward compatibility maintained (createIcon and Icon class still work)
  - ButtonCTA continues working without changes
  
  **Primary Artifacts:**
  - `src/components/core/Icon/platforms/web/Icon.web.ts` (converted to web component)
  - `src/components/core/Icon/platforms/web/Icon.web.css` (new stylesheet)
  - Custom element `<dp-icon>` registered and functional
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/008-icon-web-component-conversion/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/008-icon-web-component-conversion/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Create DPIcon web component class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `DPIcon` class extending HTMLElement
    - Attach Shadow DOM in constructor with `mode: 'open'`
    - Define observed attributes: ['name', 'size', 'color', 'test-id']
    - Implement connectedCallback for initial render
    - Implement attributeChangedCallback for reactive updates
    - Add property getters/setters for name, size, color, testID
    - Implement render() method to generate SVG in shadow DOM
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2_

  - [x] 1.2 Implement SVG rendering in shadow DOM
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Load SVG content from loadIconSVG() function (maintain existing registry)
    - Generate SVG element with width, height, viewBox attributes
    - Apply stroke color (currentColor or CSS custom property)
    - Set stroke-width="2", stroke-linecap="round", stroke-linejoin="round"
    - Add class="icon icon-{name}" for styling hooks
    - Set aria-hidden="true" for accessibility
    - Add data-testid attribute when testID prop provided
    - Inject SVG content into shadow DOM innerHTML
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 5.1_

  - [x] 1.3 Register custom element
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Register custom element as 'dp-icon' using customElements.define()
    - Add conditional check to prevent duplicate registration
    - Export DPIcon class as named export
    - Export DPIcon as default export
    - Verify custom element available in DOM
    - _Requirements: 3.1, 3.2_

  - [x] 1.4 Maintain backward compatibility exports
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Keep existing loadIconSVG() function (used by createIcon)
    - Keep existing createIcon() function export (used by ButtonCTA)
    - Keep existing Icon class export (legacy API)
    - Ensure createIcon() generates same SVG output as before
    - Ensure Icon class render() method works unchanged
    - Test ButtonCTA continues working without modifications
    - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2_



- [x] 2. Create Icon Web Component Stylesheet

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - CSS stylesheet provides minimal, token-based styling
  - Icons inherit color from parent by default (currentColor)
  - Size variants work correctly (16px, 24px, 32px, 40px)
  - Stylesheet loads correctly in Shadow DOM
  - High contrast mode and print styles implemented
  
  **Primary Artifacts:**
  - `src/components/core/Icon/platforms/web/Icon.web.css`
  - Token-based styling via CSS custom properties
  - Accessibility and print optimizations
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/008-icon-web-component-conversion/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/008-icon-web-component-conversion/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Create base icon styles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Icon.web.css file
    - Add .icon base class with display: inline-block
    - Set vertical-align: middle for text alignment
    - Set flex-shrink: 0 to prevent shrinking in flex containers
    - Set color: inherit for color inheritance
    - Add minimal styling (no unnecessary properties)
    - _Requirements: 4.1, 4.2_

  - [x] 2.2 Add size variant classes
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add all 11 icon size token classes (one per scale level: 050, 075, 100, 125, 150, 200, 300, 400, 500, 600, 700)
    - Add .icon--size-050 class using var(--icon-size-050) token (13px - caption, legal, labelXs)
    - Add .icon--size-075 class using var(--icon-size-075) token (18px - bodySm, buttonSm, labelSm)
    - Add .icon--size-100 class using var(--icon-size-100) token (24px - bodyMd, buttonMd, labelMd, input)
    - Add .icon--size-125 class using var(--icon-size-125) token (32px - bodyLg, buttonLg, labelLg)
    - Add .icon--size-150 class using var(--icon-size-150) token (28px - h6)
    - Add .icon--size-200 class using var(--icon-size-200) token (32px - h5)
    - Add .icon--size-300 class using var(--icon-size-300) token (32px - h4)
    - Add .icon--size-400 class using var(--icon-size-400) token (36px - h3)
    - Add .icon--size-500 class using var(--icon-size-500) token (40px - h2)
    - Add .icon--size-600 class using var(--icon-size-600) token (44px - h1)
    - Add .icon--size-700 class using var(--icon-size-700) token (48px - display)
    - Class names match token names to preserve semantic meaning
    - No consolidation of tokens even when pixel values are same (125, 200, 300 all = 32px)
    - Document that size is primarily controlled via size attribute
    - Document icon size token formula (fontSize × lineHeight from spec 006)
    - Document typography pairing for each scale level
    - _Requirements: 1.3, 4.1_

  - [x] 2.3 Add accessibility and print styles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add @media print styles (force color: #000)
    - Add @media (prefers-contrast: high) styles (force stroke: currentColor)
    - Document aria-hidden="true" handling (already in SVG attribute)
    - Ensure icons remain visible in all viewing contexts
    - _Requirements: 5.1, 5.2_

  - [x] 2.4 Integrate stylesheet with Shadow DOM
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add <link rel="stylesheet" href="./Icon.web.css"> to shadow DOM
    - Verify stylesheet loads correctly in shadow DOM
    - Test that styles apply to SVG element
    - Verify CSS custom properties pierce shadow DOM boundary
    - Test token-based color overrides work correctly
    - _Requirements: 3.2, 4.2_


- [x] 3. Create Web Component Tests

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Unit tests cover web component lifecycle and rendering
  - Attribute/property tests verify reactive updates
  - Accessibility tests validate aria-hidden and screen reader behavior
  - Backward compatibility tests ensure legacy APIs still work
  - Integration tests verify ButtonCTA continues working
  - Test coverage meets 90%+ for unit tests
  
  **Primary Artifacts:**
  - `src/components/core/Icon/platforms/web/__tests__/Icon.web.test.ts`
  - `src/components/core/Icon/platforms/web/__tests__/Icon.accessibility.test.ts`
  - `src/components/core/Icon/platforms/web/__tests__/Icon.integration.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/008-icon-web-component-conversion/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/008-icon-web-component-conversion/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Create web component lifecycle tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test custom element registration (customElements.get('dp-icon'))
    - Test element creation (document.createElement('dp-icon'))
    - Test connectedCallback fires when added to DOM
    - Test attributeChangedCallback fires on attribute changes
    - Test disconnectedCallback fires when removed from DOM
    - Test shadow DOM attachment (shadowRoot exists)
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Create rendering tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test icon renders with default attributes (circle, 24px)
    - Test icon renders with all 15 icon names
    - Test icon renders at all size token scale levels (050, 075, 100, 125, 150, 200, 300, 400, 500, 600, 700)
    - Test custom element uses createIcon internally for consistent output
    - Test SVG element exists in shadow DOM
    - Test SVG has correct width/height attributes
    - Test SVG has correct viewBox="0 0 24 24"
    - Test SVG content matches icon name
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [x] 3.3 Create attribute and property tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test name attribute updates icon rendering
    - Test size attribute updates icon size
    - Test color attribute updates stroke color
    - Test test-id attribute adds data-testid to SVG
    - Test property setters update attributes
    - Test property getters return correct values
    - Test invalid size defaults to 24px
    - Test invalid name defaults to 'circle'
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [x] 3.4 Create color inheritance tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test default color uses currentColor
    - Test color='inherit' uses currentColor
    - Test color token reference uses var(--token-name)
    - Test icon inherits parent element color
    - Test color updates when parent color changes
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.5 Create accessibility tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test SVG has aria-hidden="true" attribute
    - Test icon is not announced by screen readers
    - Test icon doesn't interfere with button labels
    - Test test-id attribute works for automated testing
    - _Requirements: 5.1, 5.2_

  - [x] 3.6 Create backward compatibility tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test createIcon() function still exports
    - Test createIcon() generates correct SVG string
    - Test Icon class still exports
    - Test Icon class render() method works
    - Test Icon class update() method works
    - Test Icon class getProps() method works
    - Verify no breaking changes to existing API
    - _Requirements: 6.1, 6.2_

  - [x] 3.7 Create ButtonCTA integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Status**: COMPLETE - All 37 tests passing
    **Integration Contract**: `.kiro/specs/integration-contracts/icon-buttoncta.md`
    
    - Test ButtonCTA imports createIcon successfully ✅
    - Test ButtonCTA renders icons using createIcon ✅
    - Test ButtonCTA icon rendering unchanged ✅
    - Test ButtonCTA with all icon names ✅
    - Test ButtonCTA with different icon sizes ✅
    - Verify ButtonCTA requires no code changes ✅
    - Run existing 37 integration tests ✅
    - Fix integration issues (custom element registration) ✅
    - Update integration contract with results ✅
    - _Requirements: 6.1, 6.2_


- [ ] 4. Update Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - README updated with web component usage examples
  - Migration guide explains old vs new usage
  - API documentation covers attributes and properties
  - Examples demonstrate common use cases
  - Backward compatibility clearly documented
  
  **Primary Artifacts:**
  - `src/components/core/Icon/README.md` (updated)
  - `src/components/core/Icon/examples/WebComponentUsage.html` (new)
  - Migration guide section in README
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/008-icon-web-component-conversion/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/008-icon-web-component-conversion/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Update README with web component usage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Web Component Usage" section to README
    - Document <dp-icon> custom element
    - Document all attributes (name, size, color, test-id)
    - Document all properties (name, size, color, testID)
    - Add HTML usage examples
    - Add JavaScript programmatic usage examples
    - Document Shadow DOM encapsulation
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2_

  - [ ] 4.2 Create migration guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add "Migration Guide" section to README
    - Document old usage (createIcon function)
    - Document new usage (<dp-icon> element)
    - Explain backward compatibility (both work)
    - Provide side-by-side comparison examples
    - Document ButtonCTA continues working unchanged
    - Add "when to migrate" guidance
    - _Requirements: 6.1, 6.2_

  - [ ] 4.3 Create web component usage examples
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create WebComponentUsage.html example file
    - Demonstrate basic icon usage
    - Demonstrate all size variants
    - Demonstrate color inheritance
    - Demonstrate color token override
    - Demonstrate programmatic manipulation
    - Add code comments explaining each example
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

  - [ ] 4.4 Document platform-specific information
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update README with "Platform Implementations" section
    - Document web uses vanilla web components
    - Document iOS uses SwiftUI (unchanged)
    - Document Android uses Jetpack Compose (unchanged)
    - Explain True Native Architecture approach
    - Document cross-platform API consistency
    - _Requirements: 3.1, 3.2_


- [ ] 5. Final Validation and Cleanup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All tests passing (unit, accessibility, integration)
  - No TypeScript errors or warnings
  - ButtonCTA continues working without changes
  - Documentation complete and accurate
  - No breaking changes introduced
  - Code follows project conventions
  
  **Primary Artifacts:**
  - All test suites passing
  - Clean TypeScript compilation
  - Updated documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/008-icon-web-component-conversion/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/008-icon-web-component-conversion/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Run all tests and verify passing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run unit tests for Icon web component
    - Run accessibility tests
    - Run integration tests with ButtonCTA
    - Run backward compatibility tests
    - Verify all tests pass
    - Check test coverage meets 90%+ threshold
    - _Requirements: All requirements (comprehensive validation)_

  - [ ] 5.2 Verify TypeScript compilation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run TypeScript compiler (tsc)
    - Verify no compilation errors
    - Verify no type warnings
    - Check that IconName and IconSize types still work
    - Verify type safety maintained
    - _Requirements: 1.1, 1.2_

  - [ ] 5.3 Verify ButtonCTA integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test ButtonCTA component manually
    - Verify icons render in ButtonCTA
    - Test all ButtonCTA size variants with icons
    - Test all ButtonCTA style variants with icons
    - Verify no visual regressions
    - Confirm zero code changes needed in ButtonCTA
    - _Requirements: 6.1, 6.2_

  - [ ] 5.4 Code review and cleanup
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review code for consistency with ButtonCTA pattern
    - Remove any unused code or comments
    - Verify JSDoc comments are complete
    - Check code formatting and style
    - Verify file organization follows project conventions
    - Update any outdated comments
    - _Requirements: All requirements (code quality)_

---

*This implementation plan provides actionable coding tasks with proper task type classification, validation tiers, and requirement traceability for the Icon Web Component Conversion.*

