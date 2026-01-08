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

**True Native Cross-Platform Implementation**: This spec delivers native implementations for all three platforms (Web, iOS, Android) following DesignerPunk's True Native Architecture.

**Implementation Approach**:
1. Set up component structure and tokens (shared)
2. Implement Web platform (vanilla web component)
3. Implement iOS platform (SwiftUI)
4. Implement Android platform (Jetpack Compose)
5. Write platform-specific tests following Test Development Standards

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

- [x] 2. Visual State Rendering

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

  - [x] 2.1 Implement visual state mapping
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `visualStateMap` object mapping states to CSS classes
    - Implement `getVisualStateStyles()` function
    - Apply correct tokens for each state (background, border, text colors)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 Implement error state overlay
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `applyErrorStyles()` function
    - Implement Select mode error treatment (border + background + colors)
    - Implement Multi-Select mode error treatment (colors only)
    - Ensure Tap mode ignores error prop
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.3 Implement web component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListItem` web component class
    - Implement `connectedCallback` with fail-loudly token validation
    - Implement `attributeChangedCallback` for reactive updates
    - Use CSS logical properties (`padding-block`, `padding-inline`)
    - _Requirements: 10.1, 11.1_

  - [x] 2.4 Create CSS styles
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `ButtonVerticalListItem.styles.css`
    - Define base styles with token CSS variables
    - Define state-specific modifier classes
    - Implement hover/pressed overlays using blend tokens
    - Implement focus-visible outline using accessibility tokens
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4_

- [x] 3. Content and Icons

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

  - [x] 3.1 Implement label and description rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render label with `typography.buttonMd` styling
    - Conditionally render description with `typography.bodySm` styling
    - Apply `color.text.muted` to description regardless of visual state
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.2 Implement leading icon rendering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Conditionally render Icon-Base component when `leadingIcon` prop provided
    - Pass `iconBaseSizes.size100` (24px) to Icon-Base
    - Apply label color with optical balance blend
    - Position far left, vertically centered
    - _Requirements: 4.4, 4.5, 9.1_

  - [x] 3.3 Implement selection indicator (checkmark)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render Icon-Base checkmark when `visualState` is `selected` or `checked`
    - Pass `iconBaseSizes.size100` (24px) to Icon-Base
    - Apply `color.select.selected.strong` with optical balance (or `color.error.strong` in error state)
    - Add `aria-hidden="true"` for accessibility
    - Position far right, vertically centered
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2_

  - [x] 3.4 Implement internal spacing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply `space.grouped.loose` (12px) gap between icon and label
    - Apply `space.grouped.loose` (12px) gap between label and checkmark
    - Use flexbox with gap property for consistent spacing
    - _Requirements: 4.6, 4.7_

- [x] 4. Animation and Transitions

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

  - [x] 4.1 Implement state transition animations
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `motion.selectionTransition` semantic token in `src/tokens/semantic/MotionTokens.ts`
      - Duration: `duration250` (250ms)
      - Easing: `easingStandard`
      - Context: Selection state transitions for selectable elements
    - Update CSS to use token-generated CSS variables (`--motion-selection-transition-duration`, `--motion-selection-transition-easing`)
    - Animate background, border-color, border-width, padding, color properties
    - Ensure padding and border-width animate together for height stability
    - _Requirements: 7.1, New Tokens Required (motion.selectionTransition)_

  - [x] 4.2 Implement checkmark animation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement fade-in animation when checkmark becomes visible
    - Implement fade-out animation when `checkmarkTransition='fade'`
    - Implement instant hide when `checkmarkTransition='instant'`
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 4.3 Implement transition delay
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Accept `transitionDelay` prop (milliseconds)
    - Apply CSS `transition-delay` property
    - Enable parent pattern to create staggered animations
    - _Requirements: 7.5_
    
    **Learnings from 4.1/4.2:**
    - **No fallback values**: Use `var(--token-name)` without fallbacks per fail-loudly philosophy
    - **Token validation**: If adding new token dependencies, add them to `REQUIRED_CSS_VARIABLES` array
    - **Inline styles already support transitionDelay**: The `transitionDelayStyle` variable is already generated in render() - just verify it's applied correctly without fallbacks

- [x] 5. Event Handling and Accessibility

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

  - [x] 5.1 Implement event handlers
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `onClick` callback invocation on click/tap
    - Implement `onFocus` callback invocation on focus
    - Implement `onBlur` callback invocation on blur
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 5.2 Implement accessibility features
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Ensure component renders as `<button>` element
    - Explicitly NOT support disabled state (throw error if attempted)
    - Verify checkmark has `aria-hidden="true"`
    - _Requirements: 10.1, 10.2, 10.4_

  - [x] 5.3 Verify RTL support
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Verify CSS logical properties work in RTL context
    - Verify leading icon appears on right in RTL
    - Verify checkmark appears on left in RTL
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 6. Testing ✅

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

  - [x] 6.1 Write unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test rendering behavior (component renders with required props)
    - Test visual state behavior (correct CSS classes applied)
    - Test error state behavior (mode-specific treatment)
    - Test accessibility behavior (semantic button, aria-hidden checkmark)
    - Test event behavior (callbacks fire on interaction)
    - Follow JSDOM web component patterns (async, whenDefined, setTimeout)
    - _Requirements: All_

  - [x] 6.2 Write property-based tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Property 1: Visual State Styling Consistency (100+ iterations)
    - Property 2: Selection Indicator Visibility (100+ iterations)
    - Property 11: Padding Compensation Correctness (100+ iterations)
    - Property 17: Event Callback Invocation (100+ iterations)
    - Tag each test with Feature and Property number
    - _Requirements: Properties 1, 2, 11, 17 from design_

  - [x] 6.3 Write integration tests ✅
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test token integration (component uses Rosetta CSS variables)
    - Test Icon-Base integration (icons render at correct size)
    - Test fail-loudly behavior (throws when tokens missing)
    - _Requirements: Token Dependencies from requirements_

  - [x] 6.4 Write fail-loudly tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test component throws when required CSS variables missing
    - Test component does NOT use hard-coded fallback values
    - Verify error messages are descriptive
    - _Requirements: Fail Loudly Philosophy from design_

- [x] 7. Web Final Checkpoint

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All Web tests pass (`npm test`)
  - Web component exports correctly from index.ts
  - No TypeScript errors
  - Web component ready for consumption by parent pattern
  
  **Primary Artifacts:**
  - Complete `Button-VerticalListItem` Web component
  - All Web test files passing
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Web Final Checkpoint"`
  - Verify: Check GitHub for committed changes

  - [x] 7.1 Run full test suite ✅
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run `npm test` and verify all tests pass
    - Address any failing tests
    - _Requirements: All_

  - [x] 7.2 Verify exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Verify `index.ts` exports component, types, and tokens
    - Verify no TypeScript compilation errors
    - _Requirements: N/A (structural verification)_

- [x] 8. iOS Implementation (SwiftUI)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - SwiftUI component renders all 5 visual states correctly
  - Error state applies mode-specific treatment
  - Padding compensation maintains 48pt height
  - VoiceOver announces label and selection state
  - RTL layout adapts automatically
  - Animations use `motion.selectionTransition` timing
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalListItem/platforms/ios/VerticalListButtonItem.swift`
  - `src/components/core/Button-VerticalListItem/platforms/ios/VisualStateStyles.swift`
  - `src/components/core/Button-VerticalListItem/platforms/ios/VerticalListButtonItemTests.swift`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-8-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: iOS Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 8.1 Create iOS directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Button-VerticalListItem/platforms/ios/` directory
    - Create placeholder Swift files
    - _Requirements: N/A (structural setup)_

  - [x] 8.2 Implement visual state mapping (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `VisualStateStyles.swift` with state-to-style mapping
    - Implement `VisualState` enum matching TypeScript definition
    - Implement `applyErrorStyles()` function with mode-specific treatment
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3_

  - [x] 8.3 Implement SwiftUI component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `VerticalListButtonItem.swift` SwiftUI View
    - Implement props interface matching TypeScript definition
    - Use `@Environment(\.designTokens)` for token access
    - Use `strokeBorder` modifier for border rendering (inside view bounds)
    - _Requirements: 13.1, 13.2, 13.5, 13.6_

  - [x] 8.4 Implement padding compensation (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement padding calculation based on border width
    - 11pt padding for 1pt border, 10pt padding for 2pt border
    - Ensure total height remains constant at 48pt
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 8.5 Implement content and icons (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render label with `typography.buttonMd` styling
    - Conditionally render description with `typography.bodySm` styling
    - Render leading icon using IconBase component
    - Render checkmark when `visualState` is `selected` or `checked`
    - Apply `space.grouped.loose` (12pt) spacing between elements
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 2.1, 2.2, 9.1, 9.2_

  - [x] 8.6 Implement animations (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `withAnimation` with `motion.selectionTransition` timing (250ms)
    - Animate background, border, padding, and colors together
    - Implement checkmark fade-in/fade-out based on `checkmarkTransition` prop
    - Support `transitionDelay` prop for staggered animations
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 13.3_

  - [x] 8.7 Implement accessibility (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `.accessibilityLabel()` with button label
    - Add `.accessibilityValue()` with selection state description
    - Mark checkmark icon as decorative (not announced)
    - Verify VoiceOver announces correctly
    - _Requirements: 10.3, 10.5, 10.7, 2.5_

  - [x] 8.8 Implement RTL support (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `@Environment(\.layoutDirection)` for RTL detection
    - Verify layout mirrors automatically in RTL context
    - Verify leading icon appears on right in RTL
    - Verify checkmark appears on left in RTL
    - _Requirements: 11.4, 11.6_

  - [x] 8.9 Implement event handling (iOS)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `onClick` callback via Button action
    - Support haptic feedback delegation to parent pattern
    - _Requirements: 12.1, 13.4_

  - [x] 8.10 Write iOS tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test visual state rendering behavior
    - Test padding compensation correctness
    - Test VoiceOver accessibility
    - Test RTL layout adaptation
    - Use ViewInspector for SwiftUI testing
    - _Requirements: Properties 1, 2, 11, 18, 19 from design_

- [x] 9. Android Implementation (Jetpack Compose)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Compose component renders all 5 visual states correctly
  - Error state applies mode-specific treatment
  - Padding compensation maintains 48dp height
  - TalkBack announces label and selection state
  - RTL layout adapts automatically
  - Material ripple effects applied
  - Animations use `motion.selectionTransition` timing
  
  **Primary Artifacts:**
  - `src/components/core/Button-VerticalListItem/platforms/android/VerticalListButtonItem.kt`
  - `src/components/core/Button-VerticalListItem/platforms/android/VisualStateStyles.kt`
  - `src/components/core/Button-VerticalListItem/platforms/android/VerticalListButtonItemTest.kt`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-9-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Android Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 9.1 Create Android directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/components/core/Button-VerticalListItem/platforms/android/` directory
    - Create placeholder Kotlin files
    - _Requirements: N/A (structural setup)_

  - [x] 9.2 Implement visual state mapping (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `VisualStateStyles.kt` with state-to-style mapping
    - Implement `VisualState` enum matching TypeScript definition
    - Implement `applyErrorStyles()` function with mode-specific treatment
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3_

  - [x] 9.3 Implement Compose component structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `VerticalListButtonItem.kt` Composable function
    - Implement props interface matching TypeScript definition
    - Use `LocalDesignTokens.current` for token access
    - Use border modifier that draws inside composable bounds
    - Apply Material ripple effects via `Modifier.clickable` with `indication`
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

  - [x] 9.4 Implement padding compensation (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement padding calculation based on border width
    - 11dp padding for 1dp border, 10dp padding for 2dp border
    - Ensure total height remains constant at 48dp
    - Ensure minimum touch target of 48dp per Material Design guidelines
    - _Requirements: 6.1, 6.2, 6.3, 14.6_

  - [x] 9.5 Implement content and icons (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Render label with `typography.buttonMd` styling
    - Conditionally render description with `typography.bodySm` styling
    - Render leading icon using IconBase composable
    - Render checkmark when `visualState` is `SELECTED` or `CHECKED`
    - Apply `space.grouped.loose` (12dp) spacing between elements
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 2.1, 2.2, 9.1, 9.2_

  - [x] 9.6 Implement animations (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `animateColorAsState` and `animateDpAsState` with `motion.selectionTransition` timing (250ms)
    - Animate background, border, padding, and colors together
    - Implement checkmark fade-in/fade-out based on `checkmarkTransition` prop
    - Support `transitionDelay` prop for staggered animations
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 14.3_

  - [x] 9.7 Implement accessibility (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `contentDescription` via Compose semantics
    - Add `stateDescription` with selection state
    - Mark checkmark icon as decorative (not announced)
    - Verify TalkBack announces correctly
    - _Requirements: 10.3, 10.6, 10.8, 2.5_

  - [x] 9.8 Implement RTL support (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Use `LocalLayoutDirection` for RTL detection
    - Verify layout mirrors automatically in RTL context
    - Verify leading icon appears on right in RTL
    - Verify checkmark appears on left in RTL
    - _Requirements: 11.5, 11.7_

  - [x] 9.9 Implement event handling (Android)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `onClick` callback via `Modifier.clickable`
    - Implement `onFocus` and `onBlur` callbacks via focus state
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 9.10 Write Android tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test visual state rendering behavior
    - Test padding compensation correctness
    - Test TalkBack accessibility
    - Test RTL layout adaptation
    - Test Material ripple effect
    - Use ComposeTestRule for Compose testing
    - _Requirements: Properties 1, 2, 11, 20, 21 from design_

- [ ] 10. Cross-Platform Final Checkpoint

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All Web tests pass (`npm test`)
  - All iOS tests pass (Swift test suite)
  - All Android tests pass (Kotlin test suite)
  - All platforms export correctly
  - No compilation errors on any platform
  - Component ready for consumption by parent pattern on all platforms
  
  **Primary Artifacts:**
  - Complete `Button-VerticalListItem` component for Web, iOS, Android
  - All test files passing on all platforms
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/038-vertical-list-buttons/completion/task-10-parent-completion.md`
  - Summary: `docs/specs/038-vertical-list-buttons/task-10-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 10 Complete: Cross-Platform Final Checkpoint"`
  - Verify: Check GitHub for committed changes

  - [ ] 10.1 Verify cross-platform consistency
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Verify all platforms implement same visual states
    - Verify all platforms implement same props interface
    - Verify all platforms implement padding compensation
    - _Requirements: All_

  - [ ] 10.2 Run all platform tests
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Run Web tests: `npm test`
    - Run iOS tests: Swift test suite
    - Run Android tests: Kotlin test suite
    - Address any failing tests
    - _Requirements: All_

  - [ ] 10.3 Verify exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Verify Web `index.ts` exports component, types, and tokens
    - Verify iOS module exports SwiftUI view
    - Verify Android module exports Composable function
    - Verify no compilation errors on any platform
    - _Requirements: N/A (structural verification)_

---

## Notes

- **True Native Architecture**: Each platform (Web, iOS, Android) has its own native implementation
- All tasks follow Test Development Standards (test behavior, not implementation)
- Component follows "fail loudly" philosophy — no hard-coded fallbacks
- Property-based tests run 100+ iterations each
- Web component tests use JSDOM async patterns (whenDefined, setTimeout)
- iOS tests use ViewInspector for SwiftUI testing
- Android tests use ComposeTestRule for Compose testing
- Tasks marked with specific Requirements from requirements.md for traceability
- Padding compensation ensures 48px/pt/dp height across all platforms and states
