# Requirements Document

**Date**: January 13, 2026
**Spec**: 041 - Vertical List Buttons Pattern
**Status**: Requirements
**Author**: Peter Michaels Allen
**Organization**: spec-validation
**Scope**: 041-vertical-list-buttons-pattern

## Introduction

This specification defines the `Button-VerticalList-Set` component — a container/orchestrator pattern for presenting actionable choices in a stacked vertical layout. The Set manages selection behavior, state coordination between child items, animations, keyboard navigation, and accessibility semantics across three interaction modes: Tap, Select, and Multi-Select.

This spec also includes renaming the existing `Button-VerticalListItem` component to `Button-VerticalList-Item` for naming consistency, and updating its custom element tag from `<vertical-list-button-item>` to `<button-vertical-list-item>`.

**Platforms**: Web, iOS, Android (True Native Architecture)

## Glossary

- **Button_VerticalList_Set**: The container component that orchestrates selection behavior and coordinates child item states
- **Button_VerticalList_Item**: The presentational child component that renders visual states based on props from the Set
- **Visual_State**: One of five states an item can display: `rest`, `selected`, `notSelected`, `checked`, `unchecked`
- **Tap_Mode**: Interaction mode where items act as simple action buttons with no selection tracking
- **Select_Mode**: Single-selection interaction mode (radio-button style) where one item can be selected at a time
- **MultiSelect_Mode**: Multiple-selection interaction mode (checkbox style) where multiple items can be selected
- **Controlled_Component**: A component where the parent manages state and passes it down via props
- **Staggered_Animation**: Animation technique where multiple elements animate with offset timing to create a "handoff" effect

## Requirements

### Requirement 1: Component Rename and Bug Fixes

**User Story:** As a developer, I want consistent naming across the Button-VerticalList family and working accessibility/event handling, so that components are discoverable, follow Stemma System conventions, and function correctly.

#### Acceptance Criteria

1. THE System SHALL rename the directory from `Button-VerticalListItem/` to `Button-VerticalList-Item/`
2. THE System SHALL update the custom element tag from `<vertical-list-button-item>` to `<button-vertical-list-item>`
3. THE System SHALL update all internal references, imports, and tests to use the new naming
4. THE System SHALL update documentation (README.md) to reflect the new naming
5. THE Button_VerticalList_Item SHALL attach shadow DOM with `delegatesFocus: true` to enable tab navigation focus
6. THE Button_VerticalList_Item SHALL NOT dispatch a redundant custom click event (remove manual `dispatchEvent` call since native click already bubbles)
7. THE Button_VerticalList_Item SHALL ensure only one click event reaches external listeners per user interaction

### Requirement 2: Set Component Structure

**User Story:** As a developer, I want a container component that manages vertical list button groups, so that I can implement selection patterns without managing state coordination manually.

#### Acceptance Criteria

1. THE Button_VerticalList_Set SHALL render as a semantic container element with appropriate ARIA role based on mode
2. THE Button_VerticalList_Set SHALL accept a `mode` prop with values `'tap'`, `'select'`, or `'multiSelect'`
3. THE Button_VerticalList_Set SHALL render child Button_VerticalList_Item components in a vertical stack
4. THE Button_VerticalList_Set SHALL apply `space.grouped.normal` (8px) gap between child items
5. THE Button_VerticalList_Set SHALL fill 100% width of its parent container
6. THE Button_VerticalList_Set SHALL use the custom element tag `<button-vertical-list-set>`

### Requirement 3: Tap Mode Behavior

**User Story:** As a user, I want to tap buttons that trigger immediate actions, so that I can navigate or perform actions without selection state.

#### Acceptance Criteria

1. WHEN mode is `'tap'` THEN THE Button_VerticalList_Set SHALL render all items in `rest` visual state
2. WHEN mode is `'tap'` AND a user clicks an item THEN THE Button_VerticalList_Set SHALL invoke the `onItemClick` callback with the item index
3. WHEN mode is `'tap'` THEN THE Button_VerticalList_Set SHALL NOT track selection state
4. WHEN mode is `'tap'` THEN THE Button_VerticalList_Set SHALL apply `role="group"` to the container

### Requirement 4: Select Mode Behavior

**User Story:** As a user, I want to select one option from a list, so that I can make single-choice selections like radio buttons.

#### Acceptance Criteria

1. WHEN mode is `'select'` AND no selection exists THEN THE Button_VerticalList_Set SHALL render all items in `rest` visual state
2. WHEN mode is `'select'` AND a user selects an item THEN THE Button_VerticalList_Set SHALL set that item to `selected` state AND all other items to `notSelected` state
3. WHEN mode is `'select'` AND a user selects the currently selected item THEN THE Button_VerticalList_Set SHALL reset all items to `rest` state (deselection)
4. WHEN mode is `'select'` AND a user selects a different item THEN THE Button_VerticalList_Set SHALL update the selected item and transition other items appropriately
5. WHEN mode is `'select'` AND selection changes THEN THE Button_VerticalList_Set SHALL invoke the `onSelectionChange` callback with the new index (or `null` for deselection)
6. WHEN mode is `'select'` THEN THE Button_VerticalList_Set SHALL apply `role="radiogroup"` to the container
7. WHEN mode is `'select'` THEN THE Button_VerticalList_Set SHALL apply `role="radio"` and `aria-checked` to each item

### Requirement 5: Multi-Select Mode Behavior

**User Story:** As a user, I want to select multiple options from a list, so that I can make multi-choice selections like checkboxes.

#### Acceptance Criteria

1. WHEN mode is `'multiSelect'` AND no selections exist THEN THE Button_VerticalList_Set SHALL render all items in `unchecked` visual state
2. WHEN mode is `'multiSelect'` AND a user toggles an item THEN THE Button_VerticalList_Set SHALL toggle that item between `checked` and `unchecked` states
3. WHEN mode is `'multiSelect'` AND selections change THEN THE Button_VerticalList_Set SHALL invoke the `onMultiSelectionChange` callback with the array of selected indices
4. WHEN mode is `'multiSelect'` THEN THE Button_VerticalList_Set SHALL apply `role="group"` with `aria-multiselectable="true"` to the container
5. WHEN mode is `'multiSelect'` THEN THE Button_VerticalList_Set SHALL apply `role="checkbox"` and `aria-checked` to each item

### Requirement 6: Animation Coordination

**User Story:** As a user, I want smooth animations when selection changes, so that the interface feels polished and responsive.

**Note:** The `Button-VerticalList-Item` component already implements animation mechanics (border fade, background transition, checkmark fade) using `motion.selectionTransition`. The Set's responsibility is to coordinate *timing* across children, not implement the animations themselves.

#### Acceptance Criteria

1. WHEN selection changes between items in Select mode THEN THE Button_VerticalList_Set SHALL set `transitionDelay` on the deselecting item to `0ms` AND on the selecting item to `125ms` (staggered handoff)
2. WHEN the first selection is made in Select mode THEN THE Button_VerticalList_Set SHALL set `transitionDelay` to `0ms` on all items (simultaneous)
3. WHEN deselection occurs in Select mode THEN THE Button_VerticalList_Set SHALL set `transitionDelay` to `0ms` on all items (simultaneous)
4. WHEN items toggle in Multi-Select mode THEN THE Button_VerticalList_Set SHALL set `transitionDelay` to `0ms` on the toggled item (independent animation)
5. THE Button_VerticalList_Set SHALL set `checkmarkTransition` to `'instant'` on deselecting items in Select mode (checkmark hides immediately while border animates)

### Requirement 7: Error State Management

**User Story:** As a user, I want to see validation errors clearly, so that I know when my selection is invalid.

#### Acceptance Criteria

1. WHEN `error` prop is `true` THEN THE Button_VerticalList_Set SHALL pass `error={true}` to all child items
2. WHEN `errorMessage` prop is provided THEN THE Button_VerticalList_Set SHALL display the error message above the list
3. WHEN a valid selection is made AND `required` is `true` THEN THE Button_VerticalList_Set SHALL clear the error state
4. WHEN mode is `'multiSelect'` AND `minSelections` is set THEN THE Button_VerticalList_Set SHALL validate that at least that many items are selected
5. WHEN mode is `'multiSelect'` AND `maxSelections` is set THEN THE Button_VerticalList_Set SHALL prevent selecting more than that many items
6. THE Button_VerticalList_Set SHALL apply `aria-invalid` and `aria-describedby` for screen reader error announcements

### Requirement 8: Keyboard Navigation

**User Story:** As a keyboard user, I want to navigate and select items using the keyboard, so that I can use the component without a mouse.

#### Acceptance Criteria

1. WHEN the user presses Tab THEN THE Button_VerticalList_Set SHALL move focus into or out of the button group
2. WHEN the user presses Arrow Up or Arrow Down THEN THE Button_VerticalList_Set SHALL move focus between items within the group
3. WHEN the user presses Enter or Space on a focused item THEN THE Button_VerticalList_Set SHALL activate or toggle that item based on mode
4. WHEN the user presses Home THEN THE Button_VerticalList_Set SHALL move focus to the first item
5. WHEN the user presses End THEN THE Button_VerticalList_Set SHALL move focus to the last item
6. THE Button_VerticalList_Set SHALL manage focus within the group using roving tabindex pattern

### Requirement 9: Controlled API

**User Story:** As a developer, I want a controlled component API, so that I can manage selection state in my application.

#### Acceptance Criteria

1. THE Button_VerticalList_Set SHALL accept `selectedIndex` prop for Select mode (number or null)
2. THE Button_VerticalList_Set SHALL accept `selectedIndices` prop for Multi-Select mode (array of numbers)
3. THE Button_VerticalList_Set SHALL invoke `onSelectionChange` callback when selection changes in Select mode
4. THE Button_VerticalList_Set SHALL invoke `onMultiSelectionChange` callback when selections change in Multi-Select mode
5. THE Button_VerticalList_Set SHALL invoke `onItemClick` callback when items are clicked in Tap mode
6. THE Button_VerticalList_Set SHALL derive child visual states from the controlled props (not internal state)

### Requirement 10: Cross-Platform Implementation

**User Story:** As a developer, I want the component to work consistently across Web, iOS, and Android, so that I can use it in any platform.

#### Acceptance Criteria

1. THE Button_VerticalList_Set SHALL be implemented as a Web Component for the Web platform
2. THE Button_VerticalList_Set SHALL be implemented as a SwiftUI View for the iOS platform
3. THE Button_VerticalList_Set SHALL be implemented as a Jetpack Compose Composable for the Android platform
4. THE Button_VerticalList_Set SHALL provide consistent behavior across all platforms
5. THE Button_VerticalList_Set SHALL use platform-appropriate accessibility APIs (ARIA for Web, VoiceOver for iOS, TalkBack for Android)

### Requirement 11: Architectural Alignment

**User Story:** As a developer, I want the component to follow established architectural patterns, so that it integrates well with the design system.

#### Acceptance Criteria

1. THE Button_VerticalList_Set SHALL use external CSS file architecture (Web platform)
2. THE Button_VerticalList_Set SHALL use incremental DOM update pattern (`_createDOM` + `_updateDOM`) for Web platform
3. THE Button_VerticalList_Set SHALL use `--_vls-*` prefix for component-scoped CSS custom properties
4. THE Button_VerticalList_Set SHALL use token references for all spacing, color, and animation values
5. THE Button_VerticalList_Set SHALL fail loudly when required tokens are missing (no fallback values)
