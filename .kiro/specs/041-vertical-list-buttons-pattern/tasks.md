# Implementation Plan: Vertical List Buttons Pattern

**Date**: January 13, 2026
**Spec**: 041 - Vertical List Buttons Pattern
**Status**: Implementation Planning
**Dependencies**: 
- Spec 038 (Button-VerticalListItem) - Component to be renamed
- Spec 040 (Component Alignment) - Architectural standards

---

## Implementation Plan

This implementation follows a phased approach:
1. **Phase 1**: Rename existing Button-VerticalListItem component and fix bugs
2. **Phase 2**: Create Button-VerticalList-Set component structure
3. **Phase 3**: Implement mode behaviors (Tap, Select, MultiSelect)
4. **Phase 4**: Add keyboard navigation and accessibility
5. **Phase 5**: Implement error handling and validation
6. **Phase 6**: Add animation coordination
7. **Phase 7**: Testing and documentation

---

## Task List

- [x] 1. Component Rename and Bug Fixes

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Button-VerticalListItem renamed to Button-VerticalList-Item
  - Custom element tag updated to `<button-vertical-list-item>`
  - All imports, references, and tests updated
  - delegatesFocus bug fixed
  - Duplicate click event bug fixed
  - All existing tests pass
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalList-Item/` directory
  - Updated custom element registration
  - Updated README.md
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-1-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Component Rename and Bug Fixes"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Rename directory and update file structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Rename `Button-VerticalListItem/` to `Button-VerticalList-Item/`
    - Update all internal file names if needed
    - Verify directory structure matches Stemma System conventions
    - _Requirements: 1.1_

  - [x] 1.2 Update custom element tag registration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Change custom element tag from `<vertical-list-button-item>` to `<button-vertical-list-item>`
    - Update `customElements.define()` call
    - Update any HTML templates or usage examples
    - _Requirements: 1.2_

  - [x] 1.3 Update all imports and references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Search and update all import statements across codebase
    - Update any re-exports in index files
    - Update any type references
    - **CRITICAL**: Fix token file import paths (blocking tests)
      - Token file was renamed: `buttonVerticalListItem.tokens.ts` → `Button-VerticalList-Item.tokens.ts`
      - Update import in `ButtonVerticalListItem.web.ts`: `'../../buttonVerticalListItem.tokens'` → `'../../Button-VerticalList-Item.tokens'`
      - Update import in test files that reference the token file
    - **CRITICAL**: Fix browser-entry.ts import path
      - Current: `'./components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.web'`
      - Should be: `'./components/core/Button-VerticalList-Item/platforms/web/ButtonVerticalListItem.web'`
    - _Requirements: 1.3_

  - [x] 1.4 Fix delegatesFocus bug
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `attachShadow()` call to include `{ mode: 'open', delegatesFocus: true }`
    - Verify tab navigation works correctly
    - _Requirements: 1.5_

  - [x] 1.5 Fix duplicate click event bug
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove manual `dispatchEvent(new CustomEvent('click'))` call
    - Verify native click event bubbles correctly
    - Verify only one click event reaches external listeners
    - _Requirements: 1.6, 1.7_

  - [x] 1.6 Update documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update README.md with new naming
    - Update any JSDoc comments
    - Update usage examples
    - _Requirements: 1.4_

  - [x] 1.7 Update and run existing tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update test imports to use new paths
    - Update test assertions for new custom element tag
    - Run all existing tests and verify they pass
    - _Requirements: 1.3_

- [x] 2. Create Button-VerticalList-Set Component Structure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Set component directory structure created
  - Web component registered with correct tag
  - Basic rendering working with slot for children
  - External CSS file architecture in place
  - Incremental DOM update pattern implemented
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalList-Set/` directory
  - `Button-VerticalList-Set.web.ts`
  - `Button-VerticalList-Set.styles.css`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-2-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Set Component Structure"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Button-VerticalList-Set/` directory
    - Create `platforms/web/` subdirectory
    - Create placeholder files for component and styles
    - _Requirements: 2.6, 11.1_

  - [x] 2.2 Implement base web component class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListSet` class extending `HTMLElement`
    - Implement `_createDOM()` for initial shadow DOM structure
    - Implement `_updateDOM()` for incremental updates
    - Register custom element as `<button-vertical-list-set>`
    - _Requirements: 2.1, 2.6, 11.2_

  - [x] 2.3 Create external CSS file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `Button-VerticalList-Set.styles.css`
    - Define `.vls-container` styles with flexbox column layout
    - Use `--_vls-*` prefix for component-scoped properties
    - Apply `space.grouped.normal` token for gap
    - Set width to 100%
    - _Requirements: 2.3, 2.4, 2.5, 11.1, 11.3, 11.4_

  - [x] 2.4 Implement props interface
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Define observed attributes for all props
    - Implement attribute getters/setters
    - Handle `mode`, `selectedIndex`, `selectedIndices`, `error`, `errorMessage` props
    - _Requirements: 2.2, 9.1, 9.2_

- [x] 3. Implement Mode Behaviors

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Tap mode working with click callbacks
  - Select mode working with single selection
  - MultiSelect mode working with multiple selections
  - Visual states correctly derived from controlled props
  - All mode-specific callbacks invoked correctly
  
  **Primary Artifacts:**
  - Mode behavior logic in `ButtonVerticalListSet`
  - State derivation functions
  - Callback invocation logic
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-3-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Mode Behaviors"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement state derivation logic
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Implement `deriveItemStates()` function per design
    - Handle all three modes (tap, select, multiSelect)
    - Derive visual states from controlled props only
    - _Requirements: 3.1, 4.1, 4.2, 5.1, 9.6_

  - [x] 3.2 Implement Tap mode behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Handle click events on child items
    - Invoke `onItemClick` callback with item index
    - Ensure no selection state tracking
    - _Requirements: 3.2, 3.3, 9.5_

  - [x] 3.3 Implement Select mode behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Handle selection changes
    - Implement deselection (clicking selected item)
    - Invoke `onSelectionChange` callback with index or null
    - Update child visual states correctly
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 9.3_

  - [x] 3.4 Implement MultiSelect mode behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Handle toggle behavior for items
    - Invoke `onMultiSelectionChange` callback with indices array
    - Update child visual states correctly
    - _Requirements: 5.2, 5.3, 9.4_

  - [x] 3.5 Wire up child item communication
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Pass `visualState` prop to child items
    - Pass `transitionDelay` prop to child items
    - Pass `error` prop to child items
    - Listen for click events from children
    - _Requirements: 7.1, 9.6_

- [x] 4. Implement Accessibility

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Correct ARIA roles applied per mode
  - Keyboard navigation working (arrows, Home, End, Enter, Space)
  - Roving tabindex pattern implemented
  - Screen reader announcements working
  
  **Primary Artifacts:**
  - ARIA role logic
  - Keyboard event handlers
  - Focus management logic
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-4-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Accessibility"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Implement ARIA roles per mode
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `role="group"` for tap mode
    - Apply `role="radiogroup"` for select mode
    - Apply `role="group"` with `aria-multiselectable="true"` for multiSelect mode
    - Pass appropriate `role` and `aria-checked` to child items
    - _Requirements: 3.4, 4.6, 4.7, 5.4, 5.5_

  - [x] 4.2 Implement keyboard navigation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Handle Arrow Up/Down for focus movement
    - Handle Home/End for first/last item focus
    - Handle Enter/Space for activation
    - Implement focus wrapping at boundaries
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 4.3 Implement roving tabindex
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Track focused item index internally
    - Set `tabindex="0"` on focused item
    - Set `tabindex="-1"` on other items
    - Update tabindex when focus moves
    - _Requirements: 8.6_

- [x] 5. Implement Error Handling

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Error state propagates to all children
  - Error message displays above list with role="alert"
  - Error clears on valid selection
  - Min/max selection validation working
  - Error accessibility attributes set correctly
  
  **Primary Artifacts:**
  - Error state logic
  - Validation functions
  - Error message rendering
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-5-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Error Handling"`
  - Verify: Check GitHub for committed changes

  - [x] 5.1 Implement error state propagation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Pass `error={true}` to all children when error prop is true
    - Update children when error state changes
    - _Requirements: 7.1_

  - [x] 5.2 Implement error message display
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Conditionally render error message element
    - Position above list (in shadow DOM structure)
    - Apply `role="alert"` for screen reader announcement
    - Style with `color.error.strong` token
    - _Requirements: 7.2_

  - [x] 5.3 Implement validation logic
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `validateSelection()` function per design
    - Handle `required` prop for select mode
    - Handle `minSelections` and `maxSelections` for multiSelect mode
    - Clear error on valid selection
    - _Requirements: 7.3, 7.4, 7.5_

  - [x] 5.4 Implement max selection enforcement
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `canSelectItem()` function per design
    - Prevent selecting beyond max in multiSelect mode
    - Allow deselection even at max
    - _Requirements: 7.5_

  - [x] 5.5 Implement error accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `aria-invalid` when error is true
    - Apply `aria-describedby` linking to error message
    - Generate unique ID for error message element
    - _Requirements: 7.6_

- [x] 6. Implement Animation Coordination

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Staggered animation working for selection changes
  - Simultaneous animation for first selection and deselection
  - Independent animation for multiSelect toggles
  - Instant checkmark transition on deselection
  
  **Primary Artifacts:**
  - Animation timing calculation functions
  - transitionDelay prop coordination
  - checkmarkTransition prop coordination
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-6-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Animation Coordination"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Implement animation timing calculations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `calculateStaggeredDelays()` for selection changes
    - Implement `calculateFirstSelectionDelays()` for first selection
    - Implement `calculateDeselectionDelays()` for deselection
    - Implement `calculateMultiSelectDelay()` for toggles
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.2 Track selection history for animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Track `previousSelectedIndex` for stagger calculation
    - Track `isFirstSelection` flag
    - Reset flags on deselection
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.3 Implement checkmark transition coordination
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `getCheckmarkTransition()` function per design
    - Pass `checkmarkTransition='instant'` to deselecting items
    - Pass `checkmarkTransition='animated'` to selecting items
    - _Requirements: 6.5_

- [x] 7. Testing and Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All unit tests passing
  - All property-based tests passing
  - Integration tests passing
  - README documentation complete
  - Component registered in design system index
  
  **Primary Artifacts:**
  - `Button-VerticalList-Set.test.ts`
  - `Button-VerticalList-Set.property.test.ts`
  - `Button-VerticalList-Set.integration.test.ts`
  - `README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-7-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Testing and Documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Write unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test component registration and setup
    - Test initial state by mode
    - Test error state behavior
    - Test keyboard navigation edge cases
    - Test animation timing edge cases
    - Follow web component testing patterns from Test Development Standards
    - _Requirements: All_

  - [x] 7.2 Write property-based tests (Properties 1-9)
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    - Implement Properties 1-9 from design document (click events, ARIA, tap mode, select mode)
    - Use fast-check for property generation
    - Run minimum 100 iterations per property
    - Tag each test with property number and requirements
    - _Requirements: 1.6, 1.7, 2.1, 3.1-3.4, 4.1-4.7, 5.1-5.5_

  - [x] 7.3 Write property-based tests (Properties 10-18)
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    - Implement Properties 10-18 from design document (multiSelect, animation, error, keyboard, controlled)
    - Use fast-check for property generation
    - Run minimum 100 iterations per property
    - Tag each test with property number and requirements
    - _Requirements: 5.2-5.5, 6.1-6.5, 7.1-7.6, 8.2-8.6, 9.6, 11.4_

  - [x] 7.4 Write integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Set/Item contract (visualState passing)
    - Test Set/Item contract (transitionDelay passing)
    - Test Set/Item contract (error prop passing)
    - Test Set/Item contract (ARIA attributes passing)
    - _Requirements: All_

  - [x] 7.5 Create demo page for visual verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create demo page showing all three modes
    - Include error state examples
    - Include keyboard navigation testing area
    - Add visual regression baseline
    - _Requirements: All_

  - [x] 7.6 Write README documentation
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Document component API and props
    - Provide usage examples for each mode
    - Document accessibility features
    - Document token usage
    - _Requirements: All_

  - [x] 7.7 Register component in design system
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add export to component index
    - Update any component catalogs
    - Verify component is discoverable
    - _Requirements: 2.6_

- [x] 8. Checkpoint - Final Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All tests pass (`npm test`)
  - No TypeScript errors
  - No linting errors
  - Component works in browser preview
  - Accessibility audit passes
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-8-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Final Validation"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` and verify all tests pass
    - Fix any failing tests
    - _Requirements: All_

  - [x] 8.2 Run type checking and linting
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run TypeScript compiler and fix any errors
    - Run linter and fix any issues
    - Run Stemma validators
    - _Requirements: 11.4, 11.5_

  - [x] 8.3 Manual accessibility verification (requires human testing with assistive technologies)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test with keyboard navigation
    - Test with screen reader (VoiceOver/NVDA)
    - Verify ARIA attributes are announced correctly
    - _Requirements: 8.1-8.6, 7.6_

- [ ] 9. iOS Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SwiftUI View implemented for Button-VerticalList-Set
  - All three modes working (tap, select, multiSelect)
  - VoiceOver accessibility working
  - Haptic feedback on selection changes
  - Consistent behavior with Web implementation
  
  **Primary Artifacts:**
  - `platforms/ios/ButtonVerticalListSet.swift`
  - `platforms/ios/ButtonVerticalListSetPreview.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-9-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: iOS Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 9.1 Create iOS directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `platforms/ios/` directory for Set component
    - Create placeholder Swift files
    - _Requirements: 10.2_

  - [ ] 9.2 Implement SwiftUI View structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListSet` SwiftUI View
    - Implement `@Binding` for controlled selection state
    - Implement `@State` for internal focus tracking
    - Use VStack with spacing from tokens
    - _Requirements: 10.2, 10.4_

  - [ ] 9.3 Implement mode behaviors for iOS
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement tap mode with onItemClick callback
    - Implement select mode with onSelectionChange callback
    - Implement multiSelect mode with onMultiSelectionChange callback
    - Derive child visual states from controlled props
    - _Requirements: 3.1-3.4, 4.1-4.7, 5.1-5.5, 10.4_

  - [ ] 9.4 Implement iOS accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add VoiceOver support with accessibility modifiers
    - Implement selection state announcements
    - Add haptic feedback on selection changes
    - _Requirements: 10.5_

  - [ ] 9.5 Implement iOS error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement error state propagation to children
    - Display error message above list
    - Implement validation logic
    - _Requirements: 7.1-7.6_

  - [ ] 9.6 Create iOS preview and tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create SwiftUI Preview for all modes
    - Write unit tests for iOS implementation
    - Verify cross-platform consistency
    - _Requirements: 10.4_

- [ ] 10. Android Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Jetpack Compose Composable implemented for Button-VerticalList-Set
  - All three modes working (tap, select, multiSelect)
  - TalkBack accessibility working
  - Consistent behavior with Web and iOS implementations
  
  **Primary Artifacts:**
  - `platforms/android/ButtonVerticalListSet.kt`
  - `platforms/android/ButtonVerticalListSetPreview.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-10-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-10-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 10 Complete: Android Implementation"`
  - Verify: Check GitHub for committed changes

  - [ ] 10.1 Create Android directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `platforms/android/` directory for Set component
    - Create placeholder Kotlin files
    - _Requirements: 10.3_

  - [ ] 10.2 Implement Jetpack Compose Composable structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListSet` Composable
    - Use state hoisting for controlled selection
    - Use `remember` for internal focus tracking
    - Use Column with spacing from tokens
    - _Requirements: 10.3, 10.4_

  - [ ] 10.3 Implement mode behaviors for Android
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement tap mode with onItemClick callback
    - Implement select mode with onSelectionChange callback
    - Implement multiSelect mode with onMultiSelectionChange callback
    - Derive child visual states from controlled props
    - _Requirements: 3.1-3.4, 4.1-4.7, 5.1-5.5, 10.4_

  - [ ] 10.4 Implement Android accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add TalkBack support with semantics modifiers
    - Implement selection state announcements
    - Ensure proper focus management
    - _Requirements: 10.5_

  - [ ] 10.5 Implement Android error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement error state propagation to children
    - Display error message above list
    - Implement validation logic
    - _Requirements: 7.1-7.6_

  - [ ] 10.6 Create Android preview and tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Compose Preview for all modes
    - Write unit tests for Android implementation
    - Verify cross-platform consistency
    - _Requirements: 10.4_

- [ ] 11. Cross-Platform Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - All three platforms behave consistently
  - Accessibility works on all platforms
  - Visual appearance matches across platforms
  - All requirements satisfied
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/041-vertical-list-buttons-pattern/completion/task-11-completion.md`
  - Summary: `docs/specs/041-vertical-list-buttons-pattern/task-11-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 11 Complete: Cross-Platform Validation"`
  - Verify: Check GitHub for committed changes

  - [ ] 11.1 Cross-platform behavioral consistency tests
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    - Verify all three modes work identically across platforms
    - Verify callbacks are invoked with same parameters
    - Verify state transitions match
    - _Requirements: 10.4_

  - [ ] 11.2 Cross-platform accessibility audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test ARIA on Web with screen reader
    - Test VoiceOver on iOS
    - Test TalkBack on Android
    - Document any platform-specific variations
    - _Requirements: 10.5_

  - [ ] 11.3 Final documentation update
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Update README with all platform examples
    - Document any platform-specific considerations
    - Update component catalog with all platforms
    - _Requirements: 10.1-10.5_

---

## Notes

- Tasks are ordered to build incrementally on previous work
- Task 1 (rename) must complete before Task 2 (new component) to avoid conflicts
- Property-based tests (Tasks 7.2 and 7.3) validate the 18 correctness properties from the design document
- All tests follow the web component testing patterns from Test Development Standards
- Web implementation (Tasks 1-8) should complete before iOS (Task 9) and Android (Task 10)
- Cross-platform validation (Task 11) ensures behavioral consistency across all three platforms
