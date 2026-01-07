# Implementation Plan: Vertical List Button Item

**Date**: January 7, 2026
**Spec**: 038 - Vertical List Button Item
**Status**: Implementation Planning
**Dependencies**: 
- `Icon-Base` — Icon component for leading icons and checkmark indicator
- `Button-CTA` — Shares focus state patterns and padding compensation approach

---

## Overview

This implementation plan creates the `Button-VerticalListItem` component — a "dumb" presentational component that renders visual states based on props. The component supports Tap, Select, and Multi-Select modes through its `visualState` prop.

**Implementation Approach**:
1. Set up component structure and tokens
2. Implement core rendering logic with visual state mapping
3. Add interactive states and animations
4. Implement accessibility features
5. Write tests following Test Development Standards

---

## Task List

- [x] 1. Component Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Component renders with all required props
  - Component tokens registered with ComponentTokenRegistry
  - Directory structure follows Stemma System conventions
  - TypeScript types exported correctly
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalListItem/` directory structure
  - `src/components/core/Button-VerticalListItem/types.ts`
  - `src/components/core/Button-VerticalListItem/buttonVerticalListItem.tokens.ts`
  - `src/components/core/Button-VerticalListItem/index.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Component Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Button-VerticalListItem/` directory
    - Create `src/components/core/Button-VerticalListItem/platforms/web/` subdirectory
    - Create `src/components/core/Button-VerticalListItem/__tests__/` subdirectory
    - _Requirements: N/A (structural setup)_

  - [x] 1.2 Define TypeScript types and interfaces
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `types.ts` with `VerticalListButtonItemProps` interface
    - Define `VisualState` union type (`'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked'`)
    - Export types from `index.ts`
    - _Requirements: Props/API Surface from design_

  - [x] 1.3 Implement component tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `buttonVerticalListItem.tokens.ts`
    - Define `paddingBlock.rest` using `TokenWithValue` pattern (`SPACING_BASE_VALUE * 1.375`)
    - Define `paddingBlock.selected` referencing `space125`
    - Verify tokens register with ComponentTokenRegistry
    - _Requirements: 6.1, 6.2_

- [ ] 2. Visual State Rendering

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 5 visual states render with correct styling
  - Error state applies mode-specific treatment
  - Component fails loudly when tokens missing (no fallbacks)
  - CSS uses logical properties for RTL support
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.web.ts`
  - `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.styles.css`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Visual State Rendering"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Implement visual state mapping
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `visualStateMap` object mapping states to CSS classes
    - Implement `getVisualStateStyles()` function
    - Apply correct tokens for each state (background, border, text colors)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 2.2 Implement error state overlay
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `applyErrorStyles()` function
    - Implement Select mode error treatment (border + background + colors)
    - Implement Multi-Select mode error treatment (colors only)
    - Ensure Tap mode ignores error prop
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 2.3 Implement web component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListItem` web component class
    - Implement `connectedCallback` with fail-loudly token validation
    - Implement `attributeChangedCallback` for reactive updates
    - Use CSS logical properties (`padding-block`, `padding-inline`)
    - _Requirements: 10.1, 11.1_

  - [ ] 2.4 Create CSS styles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListItem.styles.css`
    - Define base styles with token CSS variables
    - Define state-specific modifier classes
    - Implement hover/pressed overlays using blend tokens
    - Implement focus-visible outline using accessibility tokens
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4_

- [ ] 3. Content and Icons

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Label always renders with correct typography
  - Description renders when provided with muted color
  - Leading icon renders with optical balance
  - Selection indicator (checkmark) shows/hides based on state
  - Icons use Icon-Base component with correct size
  
  **Primary Artifacts:**
  - Updated `ButtonVerticalListItem.web.ts` with content rendering
  - Updated `ButtonVerticalListItem.styles.css` with content styles
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Content and Icons"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Implement label and description rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render label with `typography.buttonMd` styling
    - Conditionally render description with `typography.bodySm` styling
    - Apply `color.text.muted` to description regardless of visual state
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 3.2 Implement leading icon rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Conditionally render Icon-Base component when `leadingIcon` prop provided
    - Pass `iconBaseSizes.size100` (24px) to Icon-Base
    - Apply label color with optical balance blend
    - Position far left, vertically centered
    - _Requirements: 4.4, 4.5, 9.1_

  - [ ] 3.3 Implement selection indicator (checkmark)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render Icon-Base checkmark when `visualState` is `selected` or `checked`
    - Pass `iconBaseSizes.size100` (24px) to Icon-Base
    - Apply `color.select.selected.strong` with optical balance (or `color.error.strong` in error state)
    - Add `aria-hidden="true"` for accessibility
    - Position far right, vertically centered
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2_

  - [ ] 3.4 Implement internal spacing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `space.grouped.loose` (12px) gap between icon and label
    - Apply `space.grouped.loose` (12px) gap between label and checkmark
    - Use flexbox with gap property for consistent spacing
    - _Requirements: 4.6, 4.7_

- [ ] 4. Animation and Transitions

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Visual state transitions animate smoothly
  - Padding compensation animates with border width
  - Checkmark fades in/out based on `checkmarkTransition` prop
  - Transition delay prop works correctly
  
  **Primary Artifacts:**
  - Updated CSS with transition properties
  - Updated component with animation control props
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Animation and Transitions"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Implement state transition animations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add CSS transitions using `motion.selectionTransition` token (250ms, standard easing)
    - Animate background, border-color, border-width, padding, color properties
    - Ensure padding and border-width animate together for height stability
    - _Requirements: 7.1_

  - [ ] 4.2 Implement checkmark animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement fade-in animation when checkmark becomes visible
    - Implement fade-out animation when `checkmarkTransition='fade'`
    - Implement instant hide when `checkmarkTransition='instant'`
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ] 4.3 Implement transition delay
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Accept `transitionDelay` prop (milliseconds)
    - Apply CSS `transition-delay` property
    - Enable parent pattern to create staggered animations
    - _Requirements: 7.5_

- [ ] 5. Event Handling and Accessibility

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Event callbacks fire correctly (onClick, onFocus, onBlur)
  - Component renders as semantic `<button>` element
  - No disabled state support (per accessibility standards)
  - RTL layout adapts automatically
  
  **Primary Artifacts:**
  - Updated component with event handlers
  - Accessibility attributes applied correctly
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Event Handling and Accessibility"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Implement event handlers
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `onClick` callback invocation on click/tap
    - Implement `onFocus` callback invocation on focus
    - Implement `onBlur` callback invocation on blur
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 5.2 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Ensure component renders as `<button>` element
    - Explicitly NOT support disabled state (throw error if attempted)
    - Verify checkmark has `aria-hidden="true"`
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 5.3 Verify RTL support
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify CSS logical properties work in RTL context
    - Verify leading icon appears on right in RTL
    - Verify checkmark appears on left in RTL
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 6. Testing

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All unit tests pass
  - All property-based tests pass (100+ iterations each)
  - Integration tests verify token and Icon-Base integration
  - Tests follow Test Development Standards (behavior not implementation)
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalListItem/__tests__/ButtonVerticalListItem.unit.test.ts`
  - `src/components/core/Button-VerticalListItem/__tests__/ButtonVerticalListItem.properties.test.ts`
  - `src/components/core/Button-VerticalListItem/__tests__/ButtonVerticalListItem.integration.test.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Testing"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Write unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test rendering behavior (component renders with required props)
    - Test visual state behavior (correct CSS classes applied)
    - Test error state behavior (mode-specific treatment)
    - Test accessibility behavior (semantic button, aria-hidden checkmark)
    - Test event behavior (callbacks fire on interaction)
    - Follow JSDOM web component patterns (async, whenDefined, setTimeout)
    - _Requirements: All_

  - [ ] 6.2 Write property-based tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Property 1: Visual State Styling Consistency (100+ iterations)
    - Property 2: Selection Indicator Visibility (100+ iterations)
    - Property 11: Padding Compensation Correctness (100+ iterations)
    - Property 17: Event Callback Invocation (100+ iterations)
    - Tag each test with Feature and Property number
    - _Requirements: Properties 1, 2, 11, 17 from design_

  - [ ] 6.3 Write integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test token integration (component uses Rosetta CSS variables)
    - Test Icon-Base integration (icons render at correct size)
    - Test fail-loudly behavior (throws when tokens missing)
    - _Requirements: Token Dependencies from requirements_

  - [ ] 6.4 Write fail-loudly tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test component throws when required CSS variables missing
    - Test component does NOT use hard-coded fallback values
    - Verify error messages are descriptive
    - _Requirements: Fail Loudly Philosophy from design_

- [ ] 7. Final Checkpoint

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All tests pass (`npm test`)
  - Component exports correctly from index.ts
  - No TypeScript errors
  - Component ready for consumption by parent pattern
  
  **Primary Artifacts:**
  - Complete `Button-VerticalListItem` component
  - All test files passing
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Final Checkpoint"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Run full test suite
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run `npm test` and verify all tests pass
    - Address any failing tests
    - _Requirements: All_

  - [ ] 7.2 Verify exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Verify `index.ts` exports component, types, and tokens
    - Verify no TypeScript compilation errors
    - _Requirements: N/A (structural verification)_

---

## Notes

- All tasks follow Test Development Standards (test behavior, not implementation)
- Component follows "fail loudly" philosophy — no hard-coded fallbacks
- Property-based tests run 100+ iterations each
- Web component tests use JSDOM async patterns (whenDefined, setTimeout)
- Tasks marked with specific Requirements from requirements.md for traceability
