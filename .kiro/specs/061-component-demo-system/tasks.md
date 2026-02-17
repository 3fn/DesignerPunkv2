# Implementation Plan: Component Demo System

**Date**: February 16, 2026
**Spec**: 061 - Component Demo System
**Status**: Implementation Planning
**Dependencies**:
- Spec 028 (Web Component Browser Distribution) - Complete
- Spec 034 (Component Architecture System) - Complete

---

## Implementation Plan

The Component Demo System will be implemented in two phases:

**Phase 1 (Infrastructure + Validation):** Establish the demo infrastructure and validate the approach with 6 demo pages (3 migrated + 3 new representing different complexity levels). This phase includes a checkpoint to review guidelines and refine the system before scaling.

**Phase 2 (Comprehensive Coverage):** Create the remaining 10 demo pages to achieve comprehensive coverage of all component families with web implementations.

**Total deliverable:** 16 demo pages with standardized structure, shared styling, central index, and build integration.

---

## Task List

- [x] 1. Demo Infrastructure Setup

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - `demos/` directory structure exists with demo-styles.css
  - Build script copies demo files to dist/browser/
  - README documents demo creation guidelines and local server setup
  - Shared CSS provides consistent styling for all demo pages
  
  **Primary Artifacts:**
  - `demos/` directory
  - `demos/demo-styles.css`
  - `demos/README.md`
  - `scripts/build-browser-bundles.js` (updated)
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-1-parent-completion.md`

  - [x] 1.1 Create demos directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `demos/` directory at project root
    - Add `.gitkeep` or initial placeholder file
    - _Requirements: 4.1_

  - [x] 1.2 Create shared demo stylesheet
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extract common CSS patterns from existing demos (avatar, badge, checkbox)
    - Create `demos/demo-styles.css` with shared classes (demo-section, demo-row, demo-item, demo-code, demo-header, demo-footer, demo-interactive, demo-note, demo-index, demo-category, demo-card-grid, demo-card)
    - Use CSS logical properties (no padding-left, margin-right, etc.)
    - Use DesignerPunk design tokens for colors, spacing, typography
    - Dark background theme
    - Responsive layout (320px to 1920px)
    - _Requirements: 2.7, 6.1, 6.2, 6.3, 6.4_

  - [x] 1.3 Update build script with demo file copying
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `copyDemoFiles()` function to `scripts/build-browser-bundles.js`
    - Copy all HTML and CSS files from `demos/` to `dist/browser/`
    - Handle case where `demos/` directory doesn't exist (log note, continue gracefully)
    - Call `copyDemoFiles()` after bundle building and token copying
    - _Requirements: 4.3, 4.4_

  - [x] 1.4 Create demo system README
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Document how to build demos (`npm run build`)
    - Document how to serve demos locally (npx serve, python http.server, etc.)
    - Document demo page guidelines (required elements, recommended sections, styling guidelines, organization guidelines)
    - Include minimal example of a demo page following guidelines
    - Document how to add a new demo page (file naming, location, index update)
    - Document how to test a demo locally before committing
    - Include "Demo Health Check" section for maintenance expectations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4_

- [x] 2. Demo Index Page

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - Index page lists all component demos organized by category
  - Navigation links work correctly
  - Index page loads tokens and bundle for component previews
  
  **Primary Artifacts:**
  - `demos/index.html`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-2-parent-completion.md`

  - [x] 2.1 Create index page structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `demos/index.html` with page header, category sections, and demo card grid
    - Load tokens.css, demo-styles.css, and designerpunk.esm.js
    - Organize demos by 8 categories (Avatar, Badge, Button, Chip, Container, Icon, Input, Progress)
    - Each demo entry includes component family name and brief description
    - Use demo-index, demo-category, demo-card-grid, demo-card CSS classes
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Migrate Existing Demos

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - All 3 existing demos migrated to new structure
  - Migrated demos follow demo page guidelines
  - All existing demo content and interactive examples preserved
  
  **Primary Artifacts:**
  - `demos/avatar-demo.html`
  - `demos/badge-demo.html`
  - `demos/checkbox-demo.html`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-3-parent-completion.md`

  - [ ] 3.1 Migrate avatar-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Copy existing `dist/browser/avatar-demo.html` to `demos/avatar-demo.html`
    - Replace inline CSS with demo-styles.css classes
    - Add required elements (back link to index, token verification section, usage examples)
    - Preserve all existing demo content and interactive examples
    - Test locally to verify component rendering
    - _Requirements: 7.1, 7.4_

  - [ ] 3.2 Migrate badge-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Copy existing `dist/browser/badge-demo.html` to `demos/badge-demo.html`
    - Replace inline CSS with demo-styles.css classes
    - Add required elements (back link to index, token verification section, usage examples)
    - Preserve all existing demo content and interactive examples
    - Test locally to verify component rendering
    - _Requirements: 7.2, 7.4_

  - [ ] 3.3 Migrate checkbox-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Copy existing `dist/browser/checkbox-demo.html` to `demos/checkbox-demo.html`
    - Replace inline CSS with demo-styles.css classes
    - Add required elements (back link to index, token verification section, usage examples)
    - Preserve all existing demo content and interactive examples
    - Test locally to verify component rendering
    - _Requirements: 7.3, 7.4_

- [ ] 4. Create Phase 1 New Demos

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - 3 new demos created representing different complexity levels
  - Demos follow guidelines and use shared CSS
  - Demos demonstrate all variants, states, and interactive examples
  
  **Primary Artifacts:**
  - `demos/icon-base-demo.html`
  - `demos/button-cta-demo.html`
  - `demos/input-text-demo.html`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-4-parent-completion.md`

  - [ ] 4.1 Create icon-base-demo.html (Simple)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Icon-Base component
    - Demonstrate size variants (if applicable)
    - Demonstrate color variants (if applicable)
    - Show icon grid with all available icons
    - Include token verification section
    - Include HTML and JavaScript usage examples
    - Follow demo page guidelines
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.3_

  - [ ] 4.2 Create button-cta-demo.html (Medium)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Button-CTA component
    - Demonstrate size variants (small, medium, large)
    - Demonstrate visual variants (primary, secondary, etc.)
    - Demonstrate state variants (disabled, loading, etc.)
    - Demonstrate interactive states (hover, focus, active, pressed)
    - Demonstrate icon support
    - Demonstrate event handling with visible output
    - Include token verification section
    - Include HTML and JavaScript usage examples
    - Follow demo page guidelines
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 4.3 Create input-text-demo.html (Complex)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing all Input-Text variants (Base, Email, Password, PhoneNumber)
    - Demonstrate size variants (if applicable)
    - Demonstrate validation states (error, success, default)
    - Demonstrate helper text
    - Demonstrate disabled state
    - Demonstrate interactive states (focus, blur)
    - Demonstrate accessibility features (ARIA attributes, keyboard navigation)
    - Demonstrate event handling (change, input, blur events)
    - Include token verification section
    - Include HTML and JavaScript usage examples
    - Follow demo page guidelines
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Phase 1 Testing and Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All 8 correctness properties have passing tests
  - Build integration works correctly
  - File protocol detection works
  - Demo pages pass structural validation
  
  **Primary Artifacts:**
  - `src/__tests__/browser-distribution/demo-system.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-5-parent-completion.md`

  - [ ] 5.1 Implement property-based tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/__tests__/browser-distribution/demo-system.test.ts`
    - Implement Property 1: Index entry completeness
    - Implement Property 2: Index-to-file bidirectional consistency
    - Implement Property 3: Demo page structural compliance
    - Implement Property 4: CSS logical property compliance
    - Implement Property 5: Demo file naming convention
    - Implement Property 6: Build output completeness
    - Implement Property 7: Component family demo coverage (using mapping table)
    - Implement Property 8: Visual consistency via shared stylesheet
    - Use fast-check for property-based testing where applicable
    - Tag tests with "Feature: component-demo-system, Property {number}: {property_text}"
    - _Requirements: All requirements (validation)_

  - [ ] 5.2 Implement unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test `copyDemoFiles()` function (files copied correctly)
    - Test file protocol detection script (banner element created)
    - Test README content (required sections exist)
    - _Requirements: 4.3, 4.4, 5.5_

- [ ] 6. Phase 1 Checkpoint and Review

  **Type**: Architecture
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - Guidelines reviewed and refined based on Phase 1 learnings
  - Shared CSS covers common patterns identified in Phase 1 demos
  - Index organization validated
  - Decision made to proceed with Phase 2
  
  **Primary Artifacts:**
  - Updated `demos/README.md` (if guidelines refined)
  - Updated `demos/demo-styles.css` (if patterns added)
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-6-parent-completion.md`

  - [ ] 6.1 Review Phase 1 demos and guidelines
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Review all 6 Phase 1 demos (3 migrated + 3 new)
    - Identify common patterns not covered by shared CSS
    - Identify guideline gaps or ambiguities
    - Identify sections that are boilerplate vs. valuable
    - Document findings and recommendations
    - Update guidelines in README if needed
    - Update demo-styles.css if new patterns identified
    - _Requirements: All requirements (validation)_

- [ ] 7. Phase 2 Comprehensive Coverage

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - All 10 remaining demo pages created
  - All demos follow refined guidelines from Phase 1
  - Comprehensive coverage of all component families with web implementations
  
  **Primary Artifacts:**
  - `demos/button-icon-demo.html`
  - `demos/button-vertical-list-demo.html`
  - `demos/chip-demo.html`
  - `demos/container-base-demo.html`
  - `demos/container-card-demo.html`
  - `demos/radio-demo.html`
  - `demos/progress-indicator-demo.html`
  - `demos/progress-pagination-demo.html`
  - `demos/progress-stepper-demo.html`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-7-parent-completion.md`

  - [ ] 7.1 Create button-icon-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Button-Icon component
    - Demonstrate all variants, sizes, states
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.2 Create button-vertical-list-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Button-VerticalList-Item and Button-VerticalList-Set
    - Demonstrate compositional pattern
    - Demonstrate all variants, sizes, states
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.3 Create chip-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Chip-Base, Chip-Filter, Chip-Input
    - Demonstrate comparison value (all variants side-by-side)
    - Demonstrate all states and interactions
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.4 Create container-base-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Container-Base component
    - Demonstrate padding, background, border-radius, shadow options
    - Demonstrate composition with other components
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 7.5 Create container-card-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Container-Card-Base component
    - Demonstrate specialized semantic container patterns
    - Demonstrate composition with other components
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 7.6 Create radio-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Input-Radio-Base and Input-Radio-Set
    - Demonstrate base + compositional wrapper pattern
    - Demonstrate all states and keyboard navigation
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.7 Create progress-indicator-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base
    - Demonstrate compositional primitives
    - Demonstrate how primitives compose into patterns
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 7.8 Create progress-pagination-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Progress-Pagination-Base
    - Demonstrate page indicator pattern
    - Demonstrate virtualization for large page counts
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.9 Create progress-stepper-demo.html
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo showing Progress-Stepper-Base and Progress-Stepper-Detailed
    - Demonstrate sequential workflow pattern
    - Demonstrate comparison value (Base vs Detailed side-by-side)
    - Follow refined guidelines from Phase 1
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 7.10 Update index with Phase 2 demos
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add links to all 10 new demos in index.html
    - Organize by category
    - Include component family names and descriptions
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 8. Final Validation and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All 16 demos pass property tests
  - Index links to all demos correctly
  - README is complete and accurate
  - Component-Development-Guide updated with demo maintenance checklist
  
  **Primary Artifacts:**
  - Updated `.kiro/steering/Component-Development-Guide.md`
  - Updated `demos/README.md`
  
  **Completion Documentation:**
  - `.kiro/specs/061-component-demo-system/completion/task-8-parent-completion.md`

  - [ ] 8.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run all property-based tests against all 16 demos
    - Verify all tests pass
    - Fix any failing tests or demo issues
    - _Requirements: All requirements (validation)_

  - [ ] 8.2 Update Component-Development-Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add demo maintenance checklist to component development workflow
    - Document when to update demos (component API changes, new variants added)
    - Document how to verify demo health (load demo, verify all examples work)
    - _Requirements: Decision 2 (maintenance strategy)_

  - [ ] 8.3 Final README review
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Verify README is complete and accurate
    - Verify all 16 demos are documented
    - Verify guidelines reflect Phase 1 learnings
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4_
