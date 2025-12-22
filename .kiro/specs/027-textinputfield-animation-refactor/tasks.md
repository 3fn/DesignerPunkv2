# Implementation Plan: TextInputField Animation Refactor

**Date**: December 21, 2025
**Spec**: 027 - TextInputField Animation Refactor
**Status**: Implementation Planning
**Dependencies**: Spec 013 (TextInputField), Spec 014 (Motion Token System)

---

## Overview

This implementation plan converts the TextInputField animation refactor design into actionable coding tasks. The refactor eliminates JavaScript-based animation timing coordination by replacing `setTimeout` with CSS `transition-delay`.

**Approach**: 
1. Update CSS first (foundation for new behavior)
2. Simplify state management (remove animation state)
3. Update component (remove JS timing code)
4. Update tests (remove workarounds, update signatures)
5. Verify and validate

---

## Task List

- [x] 1. Add CSS Transition-Delay for Icon Timing

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - CSS transition-delay rules added for icon container
  - Icons fade in after label animation completes (250ms delay)
  - Icons fade out immediately on blur (0ms delay)
  - Reduced motion support preserves instant transitions
  
  **Primary Artifacts:**
  - Updated CSS styles in `TextInputField.web.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/027-textinputfield-animation-refactor/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/027-textinputfield-animation-refactor/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Add CSS Transition-Delay for Icon Timing"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add transition-delay CSS rules to icon container
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.trailing-icon-container` base styles with `opacity: 0` and `transition-delay`
    - Add `.input-wrapper.focused .trailing-icon-container` styles with `opacity: 1`
    - Add `.input-wrapper.filled .trailing-icon-container` styles with `opacity: 1`
    - Add `.input-wrapper:not(.focused):not(.filled) .trailing-icon-container` with `transition-delay: 0ms`
    - Ensure CSS references `--motion-float-label-duration` custom property
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1, 7.2_

  - [x] 1.2 Add reduced motion support for icon transitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `@media (prefers-reduced-motion: reduce)` rule
    - Set `transition: none` for `.trailing-icon-container` in reduced motion
    - Verify existing reduced motion rules for label are preserved
    - _Requirements: 5.1_

  - [x] 1.3 Checkpoint - Verify CSS changes
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Ensure CSS compiles without errors
    - Manual verification: Focus empty input, observe icon delay
    - Manual verification: Blur empty input, observe immediate icon hide

- [x] 2. Simplify State Management

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `calculateIconVisibility()` uses state-only signature (no animationState)
  - All animation state functions removed from stateManagement.ts
  - `LabelAnimationState` type removed from types.ts
  - TypeScript compiles without errors
  
  **Primary Artifacts:**
  - `src/components/core/TextInputField/stateManagement.ts`
  - `src/components/core/TextInputField/types.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/027-textinputfield-animation-refactor/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/027-textinputfield-animation-refactor/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Simplify State Management"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Update calculateIconVisibility() function signature
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `animationState` parameter from function signature
    - Update function body to remove animation state checks
    - Return icon visibility based only on `TextInputFieldState`
    - Update JSDoc comments to reflect new signature
    - _Requirements: 3.1, 3.2_

  - [x] 2.2 Remove animation state functions from stateManagement.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `createInitialAnimationState()` function
    - Remove `startLabelAnimation()` function
    - Remove `updateAnimationProgress()` function
    - Remove `completeLabelAnimation()` function
    - Update exports to remove animation state functions
    - _Requirements: 3.3_

  - [x] 2.3 Remove LabelAnimationState type from types.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `LabelAnimationState` interface definition
    - Remove any related type exports
    - _Requirements: 3.3_

  - [x] 2.4 Checkpoint - Verify state management changes
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Run TypeScript compiler to check for type errors
    - Ensure no remaining references to removed functions/types

- [ ] 3. Update TextInputField Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `getAnimationDuration()` method removed
  - `animationState` property and `setTimeout` calls removed
  - Component uses simplified `calculateIconVisibility(state)`
  - Component builds and renders without errors
  
  **Primary Artifacts:**
  - `src/components/core/TextInputField/platforms/web/TextInputField.web.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/027-textinputfield-animation-refactor/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/027-textinputfield-animation-refactor/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Update TextInputField Component"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Remove getAnimationDuration() method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Delete `getAnimationDuration()` method (~30 lines)
    - Remove any imports related to this method
    - _Requirements: 1.1, 1.4, 7.4_

  - [ ] 3.2 Remove animationState property and setTimeout calls
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `animationState` property declaration
    - Remove animation state initialization in constructor/connectedCallback
    - Remove `setTimeout` calls in `updateLabelPosition()` method
    - Remove animation state imports from stateManagement
    - _Requirements: 1.2, 1.3, 3.4_

  - [ ] 3.3 Update updateIconVisibility() to use simplified calculateIconVisibility()
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update call to `calculateIconVisibility(state)` (remove animationState argument)
    - Ensure icon visibility updates correctly based on state only
    - _Requirements: 3.1, 3.2_

  - [ ] 3.4 Checkpoint - Verify component changes
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Run TypeScript compiler to check for errors
    - Ensure component builds without errors
    - Manual verification: Component renders correctly

- [ ] 4. Update Test Suite

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Test setup helpers removed from setup.ts
  - All test files updated to use new `calculateIconVisibility(state)` signature
  - "During animation" tests removed with documentation
  - All tests pass without motion token injection
  
  **Primary Artifacts:**
  - `src/components/core/TextInputField/__tests__/setup.ts`
  - `src/components/core/TextInputField/__tests__/stateManagement.test.ts`
  - `src/components/core/TextInputField/__tests__/integration.test.ts`
  - `src/components/core/TextInputField/__tests__/keyboardNavigation.test.ts`
  - `src/components/core/TextInputField/__tests__/labelAssociation.test.ts`
  - `src/components/core/TextInputField/__tests__/touchTargetSizing.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/027-textinputfield-animation-refactor/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/027-textinputfield-animation-refactor/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Update Test Suite"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Remove test setup helpers from setup.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `injectMotionTokens()` function
    - Remove `injectMotionTokensInContainer()` function
    - Remove `createTextInputFieldWithTokens()` function
    - Remove `MOTION_TOKENS` constant
    - Remove `:root` CSS custom property injection
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 4.2 Update stateManagement.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `LabelAnimationState` import
    - Remove animation state function imports
    - Remove `describe('Animation State Management')` test block entirely
    - Update `calculateIconVisibility` tests to use new signature (remove animationState)
    - Update tests that check "animation complete" to check state only
    - Add comment explaining CSS now handles animation timing
    - _Requirements: 8.1, 8.2_

  - [ ] 4.3 Update integration.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `LabelAnimationState` import
    - Update all `calculateIconVisibility(state, animationState)` calls to `calculateIconVisibility(state)`
    - Remove tests with "during label animation" in description
    - Remove tests checking `isAnimating: true` behavior
    - Keep icon creation tests unchanged
    - Keep motion token retrieval tests unchanged
    - Add comment explaining CSS handles animation timing coordination
    - _Requirements: 8.3, 8.4, 8.6, 8.7_

  - [ ] 4.4 Update keyboardNavigation.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `injectMotionTokensInContainer` import
    - Remove `injectMotionTokens` import
    - Remove all `injectMotionTokensInContainer(container)` calls
    - Remove all `injectMotionTokensInContainer(form)` calls
    - _Requirements: 6.1, 6.2_

  - [ ] 4.5 Update labelAssociation.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `injectMotionTokensInContainer` import
    - Remove `injectMotionTokensInContainer(container)` call in `setContainerHTML()`
    - _Requirements: 6.1, 6.2_

  - [ ] 4.6 Update touchTargetSizing.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove `injectMotionTokens` import
    - Remove `injectMotionTokens(component)` call in component creation
    - _Requirements: 6.1, 6.2_

  - [ ] 4.7 Checkpoint - Run test suite
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Run `npm test` to verify all tests pass
    - Ensure no tests reference removed functions or types
    - Verify no "Required motion token missing" errors

- [ ] 5. Final Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All TextInputField tests pass without workarounds
  - Visual behavior identical to before (manual verification)
  - ~100 lines of animation state code removed
  - No remaining references to removed code
  
  **Primary Artifacts:**
  - All modified files from Tasks 1-4
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/027-textinputfield-animation-refactor/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/027-textinputfield-animation-refactor/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Final Verification"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` and verify all tests pass
    - Verify no JSDOM-related failures
    - Verify no motion token injection needed
    - _Requirements: 6.1, 6.2_

  - [ ] 5.2 Manual browser verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test focus on empty input: label floats, icons appear after delay
    - Test blur on empty input: label returns, icons hide immediately
    - Test focus on filled input: label stays floated, icons visible
    - Test validation states: error/success icons appear correctly
    - Test reduced motion: verify instant transitions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1_

  - [ ] 5.3 Code cleanup verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify no remaining references to `LabelAnimationState`
    - Verify no remaining references to `getAnimationDuration`
    - Verify no remaining references to `injectMotionTokens`
    - Verify ~100 lines of code removed
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.3_

  - [ ] 5.4 Final checkpoint
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    - Ensure all tests pass
    - Ensure visual behavior matches requirements

---

## Notes

- CSS changes (Task 1) must be completed before component changes (Task 3)
- State management changes (Task 2) can be done in parallel with CSS changes
- Test updates (Task 4) should be done after component changes are complete
- Manual browser verification is essential for visual behavior confirmation

---

*This implementation plan provides actionable tasks for the TextInputField animation refactor.*
