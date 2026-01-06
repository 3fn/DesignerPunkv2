# Implementation Plan: Vertical List Buttons

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Buttons
**Status**: Implementation Planning
**Dependencies**: Icon Component, Icon Size Tokens, Accessibility Tokens

---

## Overview

This implementation plan covers the Vertical List Buttons component (`Button-VerticalList`) with three interaction modes (Tap, Select, Multi-Select). The plan is organized into phases: token creation, component setup, core implementation, platform implementations, testing, and documentation.

---

## Task List

- [x] 1. Create Select Color Token Family

  **Type**: Implementation
  **Validation**: Tier 2: Standard
  
  **Success Criteria:**
  - Four new Select color tokens created and registered with SemanticTokenRegistry
  - Tokens follow compositional architecture (reference primitive tokens)
  - Cross-platform generation working (web CSS, iOS Swift, Android Kotlin)
  - Token values validated against design specifications
  
  **Primary Artifacts:**
  - `src/tokens/semantic/ColorTokens.ts` (updated with Select color tokens)
  - Platform-specific generated token files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-1-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Define Select color tokens in SemanticColorTokens
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add `color.select.selected` token (cyan400)
    - Add `color.select.selected.background` token (cyan100)
    - Add `color.select.notSelected` token (gray200)
    - Add `color.select.notSelected.background` token (gray100)
    - Ensure tokens reference appropriate primitive colors
    - Register tokens with SemanticTokenRegistry
    - _Requirements: New Semantic Tokens Required section_

  - [x] 1.2 Verify token generation across platforms
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Run token generation for web (CSS custom properties)
    - Run token generation for iOS (Swift constants)
    - Run token generation for Android (Kotlin constants)
    - Verify generated output matches expected format
    - _Requirements: 18.1_

  - [x] 1.3 Write unit tests for Select color tokens
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Test token registration
    - Test token value resolution
    - Test cross-platform generation
    - _Requirements: New Semantic Tokens Required section_


- [x] 2. Create Component Token

  **Type**: Setup
  **Validation**: Tier 1: Minimal
  
  **Success Criteria:**
  - Vertical padding component token created and registered
  - Token references primitive `space075` correctly
  
  **Primary Artifacts:**
  - Component token definition file
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-2-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Define vertical padding component token
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `verticalListButton.padding.vertical` token referencing `space075`
    - Register with component token system
    - _Requirements: 3.4, Component Tokens Required section_


- [ ] 3. Set Up Component Structure

  **Type**: Setup
  **Validation**: Tier 1: Minimal
  
  **Success Criteria:**
  - Component directory follows True Native Architecture pattern
  - All required subdirectories and placeholder files created
  - Shared type definitions exported
  - Component registered with Stemma system
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/` directory structure
  - `src/components/core/ButtonVerticalList/types.ts`
  - Stemma registration
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-3-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-3-summary.md` (triggers release detection)

  - [ ] 3.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Create `src/components/core/ButtonVerticalList/` directory
    - Create `platforms/web/`, `platforms/ios/`, `platforms/android/` subdirectories
    - Create `__tests__/` and `examples/` directories
    - _Requirements: 18.3_

  - [ ] 3.2 Create shared type definitions
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `types.ts` with `VerticalListButtonMode` type
    - Create `VerticalListButtonItem` interface
    - Create `VerticalListButtonGroupProps` interface
    - Export all types
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3_

  - [ ] 3.3 Register component with Stemma
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Register `Button-VerticalList` with Stemma system
    - Add category, description, status metadata
    - Register mode variants (`tap`, `select`, `multiSelect`)
    - Document all props with types and descriptions
    - _Requirements: 19.1, 19.2, 19.3, 19.5_


- [ ] 4. Implement Web Component

  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  
  **Success Criteria:**
  - Web button component renders with all three modes
  - Token-based styling via CSS custom properties working
  - Icon integration with Icon component functional
  - All interaction states (hover, pressed, focus) working correctly
  - Select mode border animation with stagger working
  - Accessibility features (WCAG 2.1 AA) implemented and validated
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/platforms/web/ButtonVerticalList.web.ts`
  - `src/components/core/ButtonVerticalList/platforms/web/ButtonVerticalList.web.css`
  - Web-specific interaction patterns
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-4-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Create web component base structure
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `ButtonVerticalList.web.ts` custom element
    - Set up Shadow DOM with CSS custom properties
    - Implement prop handling for mode, items, selectedIds
    - Wire up onSelectionChange callback
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ] 4.2 Implement button rendering and layout
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Render semantic `<button>` elements for each item
    - Apply min-height of `accessibility.tapAreaRecommended`
    - Apply full-width layout (100% container width)
    - Apply `radiusNormal` border radius
    - Apply vertical and horizontal padding tokens
    - Apply `space.grouped.normal` gap between buttons
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 14.3_

  - [ ] 4.3 Implement icon and label rendering
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Render label with `typography.buttonMd`
    - Render optional description with `typography.bodySm` and `color.text.secondary`
    - Render optional leading icon via Icon component
    - Apply icon size formula and optical balance blend
    - Apply `space.grouped.loose` spacing for icon-label gap
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 10.1, 10.2, 10.3_

  - [ ] 4.4 Implement Tap mode visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply `color.background` and `color.text.primary` for rest state
    - Apply `opacity.hover` overlay on hover
    - Apply `opacity.pressed` overlay on press
    - Ensure no border and no checkmark displayed
    - Apply `cursor: pointer` on hover
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 17.1_

  - [ ] 4.5 Implement Select mode visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply not-selected state: `color.select.notSelected.background`, `color.select.notSelected` text, no border, no checkmark
    - Apply selected state: `color.select.selected.background`, `color.select.selected` text, `borderEmphasis` border, checkmark visible
    - Render checkmark with optical balance blend
    - Apply `space.grouped.loose` for label-checkmark gap
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 4.2_

  - [ ] 4.6 Implement Select mode animations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Implement border fade-out animation on deselected button (T=0)
    - Implement border fade-in animation on newly selected button (T=50% stagger)
    - Implement instant checkmark removal on deselected button
    - Implement checkmark fade-in on newly selected button
    - Use Button-Icon Secondary hover animation specs
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 4.7 Implement Multi-Select mode visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply unchecked state: `color.background`, `color.text.primary`, no border, no checkmark
    - Apply checked state: `color.select.selected.background`, `color.select.selected` text, no border, checkmark visible
    - Render checkmark with optical balance blend
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [ ] 4.8 Implement Multi-Select mode animations
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Implement checkmark fade-in on check
    - Implement checkmark fade-out on uncheck
    - Ensure independent animation per button
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 4.9 Implement hover and press states for all modes
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply `opacity.hover` overlay on hover (all modes)
    - Apply `opacity.pressed` overlay on press (all modes)
    - Ensure overlay applies on top of current visual state
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ] 4.10 Implement focus states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply focus outline with `accessibility.focus.width`
    - Apply `accessibility.focus.color` for outline color
    - Position outline `accessibility.focus.offset` outside button bounds
    - Use `:focus-visible` for keyboard-only focus
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 4.11 Implement keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Handle Tab to focus first/selected button
    - Handle Arrow Down to move focus to next button (with wrap)
    - Handle Arrow Up to move focus to previous button (with wrap)
    - Handle Enter/Space to trigger action (Tap) or toggle selection (Select/Multi-Select)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ] 4.12 Implement accessibility attributes
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Apply `role="radiogroup"` for Select mode container
    - Apply `role="group"` for Multi-Select mode container
    - Apply `aria-checked` or `aria-selected` for selection state
    - Apply `aria-hidden="true"` to icons
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

  - [ ] 4.13 Checkpoint - Web component validation
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Ensure all web tests pass
    - Ask user if questions arise



- [ ] 5. Implement iOS Component

  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  
  **Success Criteria:**
  - iOS button component renders with all three modes
  - Token-based styling via Swift constants working
  - Icon integration with Icon component functional
  - Platform-specific interaction (scale transform on press) working
  - Touch target accessibility (44pt minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/platforms/ios/ButtonVerticalList.ios.swift`
  - iOS-specific interaction patterns (scale transform)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-5-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Create iOS component structure
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `ButtonVerticalList.ios.swift` SwiftUI view
    - Implement prop handling for mode, items, selectedIds
    - Wire up onSelectionChange callback
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ] 5.2 Implement iOS layout and styling
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Use `VStack` for button layout with `space.grouped.normal` spacing
    - Apply min-height of `accessibility.tapAreaRecommended`
    - Apply full-width layout
    - Apply `radiusNormal` border radius
    - Apply padding tokens
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 5.3 Implement iOS visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Implement Tap mode states
    - Implement Select mode states with border animation
    - Implement Multi-Select mode states
    - Apply hover/press overlays
    - _Requirements: 5.x, 6.x, 7.x, 8.x, 9.x, 11.x_

  - [ ] 5.4 Implement iOS accessibility
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add VoiceOver support with selection state announcements
    - Mark icons as decorative
    - Support Dynamic Type
    - _Requirements: 14.6_

  - [ ] 5.5 Implement iOS haptic feedback
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add haptic feedback on selection changes (Select/Multi-Select modes)
    - Use `UIImpactFeedbackGenerator`
    - _Requirements: 17.2_


- [ ] 6. Implement Android Component

  **Type**: Architecture
  **Validation**: Tier 3: Comprehensive
  
  **Success Criteria:**
  - Android button component renders with all three modes
  - Token-based styling via Kotlin constants working
  - Icon integration with Icon component functional
  - Platform-specific interaction (Material ripple) working
  - Touch target accessibility (44dp minimum) implemented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/platforms/android/ButtonVerticalList.android.kt`
  - Android-specific interaction patterns (Material ripple)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-6-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-6-summary.md` (triggers release detection)

  - [ ] 6.1 Create Android component structure
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Create `ButtonVerticalList.android.kt` Compose composable
    - Implement prop handling for mode, items, selectedIds
    - Wire up onSelectionChange callback
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ] 6.2 Implement Android layout and styling
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Use `Column` for button layout with `space.grouped.normal` spacing
    - Apply min-height of `accessibility.tapAreaRecommended`
    - Apply full-width layout
    - Apply `radiusNormal` border radius
    - Apply padding tokens
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 6.3 Implement Android visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Implement Tap mode states
    - Implement Select mode states with border animation
    - Implement Multi-Select mode states
    - Apply hover/press overlays
    - _Requirements: 5.x, 6.x, 7.x, 8.x, 9.x, 11.x_

  - [ ] 6.4 Implement Android accessibility
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add TalkBack support with selection state announcements
    - Mark icons as decorative via semantics
    - _Requirements: 14.7_

  - [ ] 6.5 Implement Android ripple effect
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add Material ripple effect on press
    - Use `Modifier.clickable` with ripple indication
    - _Requirements: 17.3_


- [ ] 7. Checkpoint - Cross-Platform Validation

  **Type**: Setup
  **Validation**: Tier 1: Minimal
  
  **Success Criteria:**
  - Identical token values across all platforms
  - Identical visual proportions
  - Stemma validation passes
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-7-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-7-summary.md` (triggers release detection)

  - [ ] 7.1 Verify cross-platform token consistency
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify identical token values across web, iOS, Android
    - Verify identical visual proportions
    - _Requirements: 18.1, 18.2_

  - [ ] 7.2 Run Stemma validators
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run all Stemma System validators
    - Fix any validation errors
    - _Requirements: 19.4_


- [ ] 8. Write Tests

  **Type**: Implementation
  **Validation**: Tier 2: Standard
  
  **Success Criteria:**
  - Unit tests cover all component rendering scenarios
  - Interaction tests verify all user interactions work correctly
  - Accessibility tests validate WCAG 2.1 AA compliance
  - Property tests verify universal correctness properties
  - Test coverage meets 90%+ for unit tests
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/__tests__/ButtonVerticalList.test.ts`
  - `src/components/core/ButtonVerticalList/__tests__/ButtonVerticalList.accessibility.test.ts`
  - `src/components/core/ButtonVerticalList/__tests__/ButtonVerticalList.property.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-8-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-8-summary.md` (triggers release detection)

  - [ ] 8.1 Write unit tests for mode behavior
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Test Tap mode triggers action on tap
    - Test Select mode enforces single selection
    - Test Multi-Select mode allows multiple selections
    - Test selection state transitions
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 8.2 Write unit tests for visual states
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Test correct tokens applied for each mode/state
    - Test border visibility matches specification
    - Test checkmark visibility matches specification
    - _Requirements: 5.x, 6.x, 8.x_

  - [ ] 8.3 Write unit tests for keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Test Tab focuses first/selected button
    - Test Arrow keys move focus with wrapping
    - Test Enter/Space activates button
    - _Requirements: 13.x_

  - [ ] 8.4 Write unit tests for accessibility
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Test ARIA roles applied correctly
    - Test selection state announced
    - Test icons marked as decorative
    - _Requirements: 14.x_

  - [ ] 8.5 Write property tests for selection invariants
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - **Property 1: Mode Behavior Correctness**
    - **Property 2: Selection State Transitions**
    - Generate random button groups and interaction sequences
    - Verify selection constraints maintained
    - _Requirements: 1.x_

  - [ ] 8.6 Write property tests for token application
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - **Property 3: Token Application Correctness**
    - **Property 4: Spacing Token Application**
    - **Property 5: Sizing Constraints**
    - Generate buttons with random mode/state combinations
    - Verify correct tokens applied
    - _Requirements: 3.x, 4.x, 5.x, 6.x, 8.x_

  - [ ] 8.7 Write property tests for keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - **Property 6: Keyboard Navigation Correctness**
    - Generate random button groups
    - Verify arrow key navigation wraps correctly
    - _Requirements: 13.x_

  - [ ] 8.8 Write property tests for accessibility
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - **Property 7: Accessibility Attribute Correctness**
    - **Property 8: Color Contrast Compliance**
    - Generate buttons in all modes
    - Verify ARIA attributes and contrast ratios
    - _Requirements: 14.x, 16.x_


- [ ] 9. Create Documentation

  **Type**: Implementation
  **Validation**: Tier 2: Standard
  
  **Success Criteria:**
  - README serves as single source of truth for component usage
  - Examples demonstrate all component variants and features
  - Documentation explains token consumption and customization
  - Accessibility guidance provided for proper usage
  - Cross-platform considerations documented
  
  **Primary Artifacts:**
  - `src/components/core/ButtonVerticalList/README.md`
  - `src/components/core/ButtonVerticalList/examples/` directory
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-9-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-9-summary.md` (triggers release detection)

  - [ ] 9.1 Create README.md with usage guidelines
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Write component overview
    - Document all props with types and descriptions
    - Include installation/import instructions
    - _Requirements: 20.1_

  - [ ] 9.2 Add code examples for each mode
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add Tap mode example
    - Add Select mode example
    - Add Multi-Select mode example
    - _Requirements: 20.2_

  - [ ] 9.3 Add code examples for each platform
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Add web (TypeScript) example
    - Add iOS (SwiftUI) example
    - Add Android (Kotlin Compose) example
    - _Requirements: 20.3_

  - [ ] 9.4 Add accessibility documentation
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document keyboard navigation behavior
    - Document screen reader behavior per platform
    - Document ARIA attributes used
    - _Requirements: 20.4_

  - [ ] 9.5 Add do's and don'ts
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Document common use cases
    - Document anti-patterns to avoid
    - Include guidance on mode selection
    - _Requirements: 20.5_

  - [ ] 9.6 Add visual state examples
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Include examples showing rest, hover, pressed states
    - Include examples showing selected/not-selected states
    - Include examples showing focus state
    - _Requirements: 20.6_


- [ ] 10. Final Validation

  **Type**: Setup
  **Validation**: Tier 1: Minimal
  
  **Success Criteria:**
  - All tests pass
  - Color contrast compliance verified
  - Stemma validation passes
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-10-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-10-summary.md` (triggers release detection)

  - [ ] 10.1 Run full test suite
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Run `npm test` to validate all tests pass
    - Fix any failing tests

  - [ ] 10.2 Verify color contrast compliance
    **Type**: Implementation
    **Validation**: Tier 2: Standard
    - Verify 4.5:1 contrast for label text
    - Verify 4.5:1 contrast for description text
    - Verify 3:1 contrast for focus outline
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 10.3 Final checkpoint
    **Type**: Setup
    **Validation**: Tier 1: Minimal
    - Ensure all tests pass
    - Ensure Stemma validation passes
    - Ask user if questions arise

---

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
