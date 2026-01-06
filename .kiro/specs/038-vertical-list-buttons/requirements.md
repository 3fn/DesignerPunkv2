# Requirements Document: Vertical List Buttons

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Buttons
**Status**: Requirements Phase
**Dependencies**: Icon Component, Icon Size Tokens, Accessibility Tokens

---

## Introduction

Vertical List Buttons are a component family for presenting actionable choices in a stacked vertical layout. The component supports three interaction models (Tap, Select, Multi-Select) to accommodate different selection patterns while maintaining consistent visual design and accessibility standards.

The component follows True Native Architecture with build-time platform separation for web, iOS, and Android. All styling uses semantic or primitive tokens from the mathematical token system, with new Select color tokens introduced in this spec.

**Key Architectural Principles**:
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic or primitive tokens (no hard-coded values)
- **Mathematical foundation**: Sizing follows 8px baseline grid with strategic flexibility
- **Accessibility-first**: WCAG 2.1 AA compliance for touch targets, color contrast, keyboard navigation
- **Icon component integration**: Uses Icon component for all icon rendering

---

## Glossary

- **Vertical List Button**: Individual button within a vertically stacked button group
- **Tap Mode**: Interaction model where button tap triggers immediate action
- **Select Mode**: Single-selection interaction model where one item can be selected at a time
- **Multi-Select Mode**: Multiple-selection interaction model where multiple items can be selected
- **Selection Indicator**: Checkmark icon displayed on far right when item is selected
- **Leading Icon**: Optional icon displayed on far left, inline with label
- **True Native Architecture**: Build-time platform separation with platform-specific implementations
- **Semantic Token**: Token with contextual meaning that references primitive tokens
- **Component Token**: Token scoped to a specific component, referencing primitive tokens
- **Icon Size Formula**: Icon size calculation: `fontSize × lineHeight` of paired typography

---

## Requirements

### Requirement 1: Interaction Models

**User Story**: As a product designer, I want three interaction models (Tap, Select, Multi-Select), so that I can use the appropriate selection pattern for different UI contexts.

#### Acceptance Criteria

1. WHEN the Vertical List Button group is instantiated with mode "tap" THEN the component SHALL trigger the button's action immediately on tap/click
2. WHEN the Vertical List Button group is instantiated with mode "select" THEN the component SHALL allow only one button to be selected at a time
3. WHEN the Vertical List Button group is instantiated with mode "select" AND a button is tapped THEN the component SHALL deselect the previously selected button and select the tapped button
4. WHEN the Vertical List Button group is instantiated with mode "multiSelect" THEN the component SHALL allow multiple buttons to be selected simultaneously
5. WHEN the Vertical List Button group is instantiated with mode "multiSelect" AND a button is tapped THEN the component SHALL toggle that button's selected state without affecting other buttons

### Requirement 2: Button Anatomy

**User Story**: As a product designer, I want buttons to support optional icons and descriptions, so that I can enhance button meaning with visual indicators and explanatory text.

#### Acceptance Criteria

1. WHEN a Vertical List Button is instantiated with label prop THEN the component SHALL render the label text using `typography.buttonMd`
2. WHEN a Vertical List Button is instantiated with description prop THEN the component SHALL render description text below the label using `typography.bodySm`
3. WHEN a Vertical List Button is instantiated with icon prop THEN the component SHALL render the icon in leading position (far left) using the Icon component
4. WHEN a Vertical List Button renders a leading icon THEN the component SHALL size the icon to match `typography.buttonMd` using the icon size formula (`fontSize × lineHeight`)
5. WHEN a Vertical List Button renders a leading icon THEN the component SHALL apply `color.icon.opticalBalance` blend to the icon color

### Requirement 3: Sizing and Layout

**User Story**: As a product designer, I want buttons to have consistent sizing and fill their container width, so that button lists maintain visual consistency and alignment.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders THEN the component SHALL enforce minimum height of `accessibility.tapAreaRecommended` (48px)
2. WHEN a Vertical List Button renders THEN the component SHALL expand to fill 100% width of its container
3. WHEN a Vertical List Button renders THEN the component SHALL use `radiusNormal` for border radius
4. WHEN a Vertical List Button renders THEN the component SHALL use component token referencing `space075` (6px) for top and bottom padding
5. WHEN a Vertical List Button renders THEN the component SHALL use `space.inset.200` (16px) for left and right padding
6. WHEN a Vertical List Button group renders multiple buttons THEN the component SHALL use `space.grouped.normal` (8px) for vertical gap between buttons

### Requirement 4: Internal Spacing

**User Story**: As a product designer, I want consistent spacing between button elements, so that icons, labels, and selection indicators maintain balanced visual relationships.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders with a leading icon THEN the component SHALL use `space.grouped.loose` (12px) between icon and label
2. WHEN a Vertical List Button renders with a selection indicator THEN the component SHALL use `space.grouped.loose` (12px) between label and checkmark
3. WHEN a Vertical List Button renders with both icon and selection indicator THEN the component SHALL position icon on far left and checkmark on far right with label in between

### Requirement 5: Tap Mode Visual States

**User Story**: As a product designer, I want Tap mode buttons to show appropriate visual feedback, so that users understand the button is interactive.

#### Acceptance Criteria

1. WHEN a Vertical List Button in Tap mode renders in rest state THEN the component SHALL use `color.background` for background and `color.text.primary` for label
2. WHEN a Vertical List Button in Tap mode renders in rest state THEN the component SHALL NOT display a border
3. WHEN a Vertical List Button in Tap mode receives hover interaction (web) THEN the component SHALL apply `opacity.hover` overlay
4. WHEN a Vertical List Button in Tap mode receives press interaction THEN the component SHALL apply `opacity.pressed` overlay
5. WHEN a Vertical List Button in Tap mode renders THEN the component SHALL NOT display a selection indicator

### Requirement 6: Select Mode Visual States

**User Story**: As a product designer, I want Select mode buttons to clearly indicate selected and not-selected states, so that users understand which option is currently chosen.

#### Acceptance Criteria

1. WHEN a Vertical List Button in Select mode renders in not-selected state THEN the component SHALL use `color.select.notSelected.background` for background
2. WHEN a Vertical List Button in Select mode renders in not-selected state THEN the component SHALL use `color.select.notSelected` for label text
3. WHEN a Vertical List Button in Select mode renders in not-selected state THEN the component SHALL NOT display a border
4. WHEN a Vertical List Button in Select mode renders in not-selected state THEN the component SHALL NOT display the selection indicator (checkmark)
5. WHEN a Vertical List Button in Select mode renders in selected state THEN the component SHALL use `color.select.selected.background` for background
6. WHEN a Vertical List Button in Select mode renders in selected state THEN the component SHALL use `color.select.selected` for label text
7. WHEN a Vertical List Button in Select mode renders in selected state THEN the component SHALL display `borderEmphasis` border
8. WHEN a Vertical List Button in Select mode renders in selected state THEN the component SHALL display the selection indicator (checkmark) on far right
9. WHEN a Vertical List Button in Select mode renders the checkmark THEN the component SHALL use `color.select.selected` with `color.icon.opticalBalance` blend applied
10. WHEN a Vertical List Button in Select mode renders the checkmark THEN the component SHALL size the checkmark to match `typography.buttonMd` using the icon size formula

### Requirement 7: Select Mode Animation

**User Story**: As a product designer, I want Select mode to animate selection changes smoothly, so that users receive clear visual feedback when changing their selection.

#### Acceptance Criteria

1. WHEN selection changes in Select mode THEN the component SHALL animate the border on the newly selected button using the same animation specs as Button-Icon Secondary hover state
2. WHEN selection changes in Select mode THEN the component SHALL begin the deselected button's border fade-out animation at T=0
3. WHEN selection changes in Select mode THEN the component SHALL begin the newly selected button's border fade-in animation at T=50% of the animation duration (staggered delay)
4. WHEN selection changes in Select mode THEN the component SHALL remove the checkmark from the deselected button instantly (no fade animation)
5. WHEN selection changes in Select mode THEN the component SHALL fade in the checkmark on the newly selected button

### Requirement 8: Multi-Select Mode Visual States

**User Story**: As a product designer, I want Multi-Select mode buttons to clearly indicate checked and unchecked states, so that users understand which options are currently selected.

#### Acceptance Criteria

1. WHEN a Vertical List Button in Multi-Select mode renders in unchecked state THEN the component SHALL use `color.background` for background
2. WHEN a Vertical List Button in Multi-Select mode renders in unchecked state THEN the component SHALL use `color.text.primary` for label text
3. WHEN a Vertical List Button in Multi-Select mode renders in unchecked state THEN the component SHALL NOT display a border
4. WHEN a Vertical List Button in Multi-Select mode renders in unchecked state THEN the component SHALL NOT display the selection indicator (checkmark)
5. WHEN a Vertical List Button in Multi-Select mode renders in checked state THEN the component SHALL use `color.select.selected.background` for background
6. WHEN a Vertical List Button in Multi-Select mode renders in checked state THEN the component SHALL use `color.select.selected` for label text
7. WHEN a Vertical List Button in Multi-Select mode renders in checked state THEN the component SHALL NOT display a border
8. WHEN a Vertical List Button in Multi-Select mode renders in checked state THEN the component SHALL display the selection indicator (checkmark) on far right
9. WHEN a Vertical List Button in Multi-Select mode renders the checkmark THEN the component SHALL use `color.select.selected` with `color.icon.opticalBalance` blend applied

### Requirement 9: Multi-Select Mode Animation

**User Story**: As a product designer, I want Multi-Select mode to animate checkmark appearance smoothly, so that users receive clear visual feedback when toggling selections.

#### Acceptance Criteria

1. WHEN a button is checked in Multi-Select mode THEN the component SHALL fade in the checkmark
2. WHEN a button is unchecked in Multi-Select mode THEN the component SHALL fade out the checkmark
3. WHEN multiple buttons are toggled in Multi-Select mode THEN each button SHALL animate independently

### Requirement 10: Description Text Styling

**User Story**: As a product designer, I want description text to use secondary styling, so that it's visually subordinate to the label while remaining readable.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders with description THEN the component SHALL use `color.text.secondary` for description text color
2. WHEN a Vertical List Button renders with description THEN the component SHALL maintain `color.text.secondary` for description regardless of selection state
3. WHEN a Vertical List Button renders with description THEN the component SHALL position description below the label within the button bounds

### Requirement 11: Hover and Press States

**User Story**: As a product designer, I want all button modes to show hover and press feedback, so that users understand the buttons are interactive.

#### Acceptance Criteria

1. WHEN any Vertical List Button receives hover interaction (web) THEN the component SHALL apply `opacity.hover` overlay while maintaining current visual state
2. WHEN any Vertical List Button receives press interaction THEN the component SHALL apply `opacity.pressed` overlay while maintaining current visual state
3. WHEN a Vertical List Button in Select or Multi-Select mode is in selected state AND receives hover/press THEN the component SHALL apply overlay on top of selected styling

### Requirement 12: Focus States

**User Story**: As a keyboard user, I want buttons to show clear focus indicators, so that I can navigate the interface using keyboard controls.

#### Acceptance Criteria

1. WHEN a Vertical List Button receives keyboard focus THEN the component SHALL render outline with `accessibility.focus.width`
2. WHEN a Vertical List Button renders focus outline THEN the component SHALL use `accessibility.focus.color` for outline color
3. WHEN a Vertical List Button renders focus outline THEN the component SHALL position outline `accessibility.focus.offset` outside button bounds
4. WHEN a Vertical List Button receives focus via mouse click THEN the component SHALL NOT render focus outline (focus-visible only)
5. WHEN a Vertical List Button receives focus via keyboard navigation THEN the component SHALL render focus outline

### Requirement 13: Keyboard Navigation

**User Story**: As a keyboard user, I want to navigate and interact with button lists using standard keyboard controls, so that I can use the interface without a mouse.

#### Acceptance Criteria

1. WHEN a Vertical List Button group receives Tab key THEN the component SHALL focus the first (or currently selected) button in the group
2. WHEN a button in the group has focus AND receives Arrow Down key THEN the component SHALL move focus to the next button
3. WHEN a button in the group has focus AND receives Arrow Up key THEN the component SHALL move focus to the previous button
4. WHEN a button has focus AND receives Enter or Space key in Tap mode THEN the component SHALL trigger the button's action
5. WHEN a button has focus AND receives Enter or Space key in Select or Multi-Select mode THEN the component SHALL toggle the button's selection state
6. WHEN the last button has focus AND receives Arrow Down key THEN the component SHALL wrap focus to the first button
7. WHEN the first button has focus AND receives Arrow Up key THEN the component SHALL wrap focus to the last button

### Requirement 14: Screen Reader Accessibility

**User Story**: As a screen reader user, I want button lists to announce their purpose and state clearly, so that I understand the available options and current selections.

#### Acceptance Criteria

1. WHEN a Vertical List Button group renders in Select mode on web THEN the component SHALL use `role="radiogroup"` on the container
2. WHEN a Vertical List Button group renders in Multi-Select mode on web THEN the component SHALL use `role="group"` on the container
3. WHEN a Vertical List Button renders on web THEN the component SHALL use semantic button element
4. WHEN a Vertical List Button renders with selection state THEN the component SHALL announce selection state to screen readers (aria-checked or aria-selected as appropriate)
5. WHEN a Vertical List Button renders leading icon or checkmark THEN the component SHALL mark icons as decorative (aria-hidden on web)
6. WHEN a Vertical List Button renders on iOS THEN the component SHALL support VoiceOver with selection state announcements
7. WHEN a Vertical List Button renders on Android THEN the component SHALL support TalkBack with selection state announcements

### Requirement 15: Touch Target Accessibility

**User Story**: As a mobile user, I want buttons to meet touch target requirements, so that I can reliably tap buttons on touch devices.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders THEN the component SHALL maintain minimum height of `accessibility.tapAreaRecommended` (48px)
2. WHEN a Vertical List Button renders at full container width THEN the component SHALL provide touch target across entire button width
3. WHEN a Vertical List Button renders on iOS or Android THEN the component SHALL use platform-appropriate touch feedback

### Requirement 16: Color Contrast Accessibility

**User Story**: As a user with visual impairments, I want button text and backgrounds to meet WCAG 2.1 AA color contrast requirements, so that I can read button labels clearly.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders in any state THEN the component SHALL achieve minimum 4.5:1 contrast ratio between label text and background
2. WHEN a Vertical List Button renders description text THEN the component SHALL achieve minimum 4.5:1 contrast ratio between description text and background
3. WHEN a Vertical List Button renders focus outline THEN the component SHALL achieve minimum 3:1 contrast ratio between outline and adjacent colors

### Requirement 17: Platform-Specific Interaction Patterns

**User Story**: As a platform user, I want buttons to follow platform-native interaction patterns, so that buttons feel natural and familiar on each platform.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders on web THEN the component SHALL apply cursor pointer on hover
2. WHEN a Vertical List Button renders on iOS THEN the component SHALL apply haptic feedback on selection changes (Select/Multi-Select modes)
3. WHEN a Vertical List Button renders on Android THEN the component SHALL apply Material ripple effect on press

### Requirement 18: Cross-Platform Consistency

**User Story**: As a product designer, I want buttons to maintain consistent visual design across all platforms, so that the brand experience remains unified.

#### Acceptance Criteria

1. WHEN a Vertical List Button renders on any platform THEN the component SHALL use identical token values for sizing, spacing, typography, and colors
2. WHEN a Vertical List Button renders on any platform THEN the component SHALL maintain identical visual proportions (height, padding, border radius)
3. WHEN a Vertical List Button renders on any platform THEN the component SHALL follow True Native Architecture with separate platform implementations

### Requirement 19: Stemma Compliance

**User Story**: As a design system maintainer, I want the component to be Stemma compliant, so that it integrates properly with the component registry and validation system.

#### Acceptance Criteria

1. WHEN the component is registered THEN it SHALL use the Stemma naming convention `Button-VerticalList`
2. WHEN the component is registered THEN it SHALL include required Stemma metadata (category, description, status)
3. WHEN the component defines mode variants THEN it SHALL register `tap`, `select`, and `multiSelect` as valid mode values with Stemma
4. WHEN the component is validated THEN it SHALL pass all Stemma System validators
5. WHEN the component exposes props THEN it SHALL document all props with types and descriptions in Stemma-compatible format

### Requirement 20: Documentation

**User Story**: As a developer, I want comprehensive documentation for the component, so that I can understand how to use it correctly and consistently.

#### Acceptance Criteria

1. WHEN the component is released THEN it SHALL include a README.md with usage guidelines
2. WHEN the component documentation is created THEN it SHALL include code examples for each interaction mode (Tap, Select, Multi-Select)
3. WHEN the component documentation is created THEN it SHALL include code examples for each platform (web, iOS, Android)
4. WHEN the component documentation is created THEN it SHALL include accessibility considerations and screen reader behavior
5. WHEN the component documentation is created THEN it SHALL include do's and don'ts for common use cases
6. WHEN the component documentation is created THEN it SHALL include visual examples showing all states (rest, hover, pressed, selected, focus)

---

## New Semantic Tokens Required

### Select Color Token Family

The following semantic tokens must be created for selection state styling:

| Token | Primitive Reference | Hex Value | Purpose |
|-------|---------------------|-----------|---------|
| `color.select.selected` | `cyan400` | #00C0CC | Foreground color for selected state (label text, border, checkmark base) |
| `color.select.selected.background` | `cyan100` | #CCFBFF | Background fill for selected state |
| `color.select.notSelected` | `gray200` | #68658A | Foreground color for not-selected state (label text in Select mode) |
| `color.select.notSelected.background` | `gray100` | #B8B6C8 | Background fill for not-selected state (Select mode) |

### Component Tokens Required

| Token | References | Purpose |
|-------|------------|---------|
| `verticalListButton.padding.vertical` | `space075` | Top and bottom internal padding |

---

## Dependencies

### Icon Component
- **Usage**: All icons (leading icons, checkmark) rendered via Icon component
- **Integration**: Icon color inheritance, optical balance blend application
- **Reference**: `src/components/core/Icon/`

### Icon Size Tokens
- **Usage**: Icon sizing via formula (`fontSize × lineHeight` of paired typography)
- **Reference**: `src/tokens/semantic/IconSizeTokens.ts`

### Accessibility Tokens
- **Usage**: Focus state styling (`accessibility.focus.*` tokens), touch target sizing (`accessibility.tapAreaRecommended`)
- **Reference**: `src/tokens/semantic/AccessibilityTokens.ts`

---

*This requirements document provides comprehensive EARS-format requirements with acceptance criteria for the Vertical List Buttons component family.*
