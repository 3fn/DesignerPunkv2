# Requirements Document: Input-Radio-Base & Input-Radio-Set

**Date**: February 7, 2026
**Spec**: 047 - Input-Radio-Base
**Status**: Requirements Phase
**Dependencies**: 
- Accessibility token family (`accessibility.focus.*` tokens)
- Feedback color tokens (`color.feedback.select.*`, `color.feedback.error.*`)
- Motion tokens (`motion.selectionTransition`, `motion.buttonPress`)
- Scale tokens (`scale096`)
- Blend tokens (`blend.hoverDarker`, `blend.pressedDarker`)
- Spacing tokens (`space.inset.050`, `space.inset.075`, `space.inset.100`, `space.grouped.*`)

---

## Introduction

The Input-Radio components provide single-selection controls for web, iOS, and Android platforms. This spec covers two components:

- **Input-Radio-Base**: Individual radio button with three size variants, configurable label alignment, and support for selected/unselected states
- **Input-Radio-Set**: Container that orchestrates child Input-Radio-Base components, managing mutual exclusivity, validation, and keyboard navigation

Both components follow True Native Architecture with build-time platform separation and maintain WCAG 2.1 AA accessibility compliance.

**Key Architectural Principles**:
- **Stemma System**: Component architecture following [Family]-[Type]-[Variant] naming (Input-Radio-Base, Input-Radio-Set)
- **Rosetta System**: Token architecture using existing semantic tokens (no new tokens required)
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic tokens (no hard-coded values)
- **Orchestration pattern**: Set orchestrates Base children without duplicating rendering logic (lesson from Spec 046)
- **Input-Checkbox-Base alignment**: Visual sizing and token usage matches checkbox for consistency
- **Test-Development-Standards**: All tests follow established testing patterns and Stemma validators

**Glossary**:
- **Radio**: Single-selection control within a mutually exclusive group
- **Mutual exclusivity**: Only one option can be selected at a time within a group
- **Dot**: Filled circle indicator showing selected state (distinguishes from checkbox checkmark)
- **Set**: Container component that manages group behavior (selection, validation, keyboard nav)
- **Stemma System**: DesignerPunk's component architecture system
- **Rosetta System**: DesignerPunk's token architecture system

---

## Requirements

### Requirement 1: Radio States

**User Story**: As a user, I want to see clear visual feedback for radio states, so that I understand whether an option is selected.

#### Acceptance Criteria

1. WHEN radio is unselected THEN the system SHALL display transparent background with default border color (`color.feedback.select.border.default`)
2. WHEN radio is selected THEN the system SHALL display filled dot with selected border color (`color.feedback.select.border.rest`)
3. WHEN radio receives hover (web) THEN the system SHALL apply `blend.hoverDarker` (8%) to border
4. WHEN radio receives keyboard focus THEN the system SHALL display focus ring using accessibility tokens
5. WHEN radio has error THEN the system SHALL display error border color (`color.feedback.error.border`)
6. WHEN radio state changes THEN the system SHALL animate the transition using `motion.selectionTransition` token (250ms)
7. WHEN radio is selected THEN the dot SHALL scale in using `motion.selectionTransition` timing

---

### Requirement 2: Size Variants

**User Story**: As a developer, I want multiple radio sizes, so that I can use appropriate sizing for different UI contexts.

#### Acceptance Criteria

1. WHEN size is "sm" THEN the system SHALL render 24px circle (16px dot + 4px inset padding × 2)
2. WHEN size is "md" THEN the system SHALL render 32px circle (20px dot + 6px inset padding × 2)
3. WHEN size is "lg" THEN the system SHALL render 40px circle (24px dot + 8px inset padding × 2)
4. WHEN size is "sm" THEN the system SHALL use `labelSm` typography for label
5. WHEN size is "md" THEN the system SHALL use `labelMd` typography for label
6. WHEN size is "lg" THEN the system SHALL use `labelLg` typography for label
7. WHEN size is "sm" or "md" THEN the system SHALL use `space.grouped.normal` gap between circle and label
8. WHEN size is "lg" THEN the system SHALL use `space.grouped.loose` gap between circle and label
9. IF size prop is not provided THEN the system SHALL default to "md"

---

### Requirement 3: Label Alignment

**User Story**: As a developer, I want to control label alignment, so that I can optimize layout for single-line or multi-line labels.

#### Acceptance Criteria

1. WHEN labelAlign is "center" THEN the system SHALL vertically center the label with the radio circle
2. WHEN labelAlign is "top" THEN the system SHALL align the label to the top of the radio circle
3. IF labelAlign prop is not provided THEN the system SHALL default to "center"
4. WHEN label wraps to multiple lines AND labelAlign is "top" THEN the radio circle SHALL remain aligned to the first line of text

---

### Requirement 4: Selection Indicator (Dot)

**User Story**: As a user, I want a clear visual indicator for selection, so that I can distinguish selected from unselected radios.

#### Acceptance Criteria

1. WHEN radio is selected THEN the system SHALL display a filled circular dot centered within the outer circle
2. WHEN radio is selected THEN the dot SHALL use `color.feedback.select.background.rest` fill color
3. WHEN radio is selected THEN the dot size SHALL match the icon size token for the current size variant (16px/20px/24px)
4. WHEN radio is unselected THEN the system SHALL NOT display any dot
5. WHEN radio border is rendered THEN the system SHALL use `borderEmphasis` (2px) width
6. WHEN radio border is rendered THEN the system SHALL use `radius.full` (50%) for circular shape

---

### Requirement 5: Helper Text and Error Messages

**User Story**: As a user, I want to see helpful context and error messages, so that I understand what is expected.

#### Acceptance Criteria

1. WHEN helperText is provided THEN the system SHALL display it below the radio+label row
2. WHEN errorMessage is provided THEN the system SHALL display it below the helper text (or below radio if no helper text)
3. WHEN errorMessage is provided THEN the system SHALL apply error styling to radio border
4. WHEN errorMessage is provided THEN the system SHALL set `aria-invalid="true"` on the radio
5. WHEN errorMessage is provided THEN the system SHALL associate error with radio via `aria-describedby`
6. WHEN helperText is provided THEN the system SHALL associate helper text with radio via `aria-describedby`

---

### Requirement 6: Accessibility

**User Story**: As a user with disabilities, I want the radio to be fully accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. WHEN radio is rendered THEN the system SHALL associate label with radio via `for`/`id` (web) or accessibility label (native)
2. WHEN radio state changes THEN screen readers SHALL announce "selected" or "not selected"
3. WHEN radio receives keyboard focus THEN the system SHALL display visible focus ring
4. WHEN user presses Space key on focused radio THEN the system SHALL select the radio
5. WHEN radio is rendered THEN the entire label area SHALL be tappable/clickable
6. WHEN radio is rendered on mobile THEN touch target SHALL meet minimum 44px requirement

---

### Requirement 7: Platform-Specific Interactions

**User Story**: As a user, I want platform-appropriate interaction feedback, so that the radio feels native to my device.

#### Acceptance Criteria

1. WHEN radio is pressed on iOS THEN the system SHALL apply scale transform using `scale096` token
2. WHEN radio is pressed on iOS THEN the system SHALL animate using `motion.buttonPress` timing (150ms)
3. WHEN radio is tapped on Android THEN the system SHALL display Material ripple effect using `blend.pressedDarker` (12%)
4. WHEN radio is hovered on web THEN the system SHALL apply `blend.hoverDarker` (8%) to border via CSS custom property
5. WHEN radio receives focus on web THEN the system SHALL display focus ring only for keyboard navigation (`:focus-visible`)

---

### Requirement 8: Web Component Implementation

**User Story**: As a web developer, I want a custom element, so that I can use the radio in any web framework.

#### Acceptance Criteria

1. WHEN radio is used on web THEN the system SHALL register as `<input-radio-base>` custom element
2. WHEN radio is rendered THEN the system SHALL use hidden native `<input type="radio">` for form compatibility
3. WHEN radio is rendered on web THEN the system SHALL use CSS logical properties for RTL support
4. WHEN radio is rendered on iOS THEN the system SHALL use SwiftUI's native RTL handling
5. WHEN radio is rendered on Android THEN the system SHALL use Compose's native RTL handling
6. WHEN radio attributes change THEN the system SHALL reactively update rendering
7. WHEN radio is used in a form THEN native form submission SHALL include radio value
8. WHEN `name` attribute is provided THEN the system SHALL use it for native radio grouping
9. WHEN `value` attribute is provided THEN the system SHALL use it for form submission value

---

### Requirement 9: Input-Radio-Set Container

**User Story**: As a developer, I want a container component that manages radio group behavior, so that I don't have to implement mutual exclusivity manually.

#### Acceptance Criteria

1. WHEN Input-Radio-Set is rendered THEN the system SHALL orchestrate child Input-Radio-Base components (not duplicate their rendering)
2. WHEN Input-Radio-Set is rendered THEN the system SHALL apply `role="radiogroup"` for accessibility
3. WHEN `selectedValue` prop is provided THEN the system SHALL pass `selected={true}` to the matching child
4. WHEN user selects a radio THEN the system SHALL call `onSelectionChange` with the selected value
5. WHEN user selects a different radio THEN the previously selected radio SHALL become unselected (mutual exclusivity)
6. WHEN user clicks an already-selected radio THEN the system SHALL NOT deselect it (radio convention)
7. WHEN `required` is true AND no selection exists THEN validation SHALL fail
8. WHEN `error` is true THEN the system SHALL display `errorMessage` above the radio group
9. WHEN `errorMessage` is displayed THEN the system SHALL use `role="alert"` for screen reader announcement
10. WHEN `size` prop is provided on Set THEN the system SHALL apply it to all child radios

---

### Requirement 10: Input-Radio-Set Keyboard Navigation

**User Story**: As a keyboard user, I want to navigate radio groups with arrow keys, so that I can efficiently select options.

#### Acceptance Criteria

1. WHEN user presses Tab THEN focus SHALL enter the radio group (on selected item, or first item if none selected)
2. WHEN user presses Tab again THEN focus SHALL exit the radio group
3. WHEN user presses Arrow Down or Arrow Right THEN focus SHALL move to the next radio in the group
4. WHEN user presses Arrow Up or Arrow Left THEN focus SHALL move to the previous radio in the group
5. WHEN focus reaches the last radio AND user presses Arrow Down THEN focus SHALL wrap to the first radio
6. WHEN focus reaches the first radio AND user presses Arrow Up THEN focus SHALL wrap to the last radio
7. WHEN user presses Space on a focused radio THEN the system SHALL select that radio
8. WHEN user presses Home THEN focus SHALL move to the first radio in the group
9. WHEN user presses End THEN focus SHALL move to the last radio in the group

---

### Requirement 11: Input-Radio-Set State Coordination

**User Story**: As a developer, I want the Set to coordinate state with children efficiently, so that the implementation is maintainable.

#### Acceptance Criteria

1. WHEN Input-Radio-Set is implemented on web THEN the system SHALL use slot-based composition (children rendered via `<slot>`)
2. WHEN Input-Radio-Set is implemented on iOS THEN the system SHALL use environment values to pass selection state
3. WHEN Input-Radio-Set is implemented on Android THEN the system SHALL use CompositionLocal to pass selection state
4. WHEN Input-Radio-Set is implemented THEN the system SHALL NOT duplicate radio circle/dot rendering logic from Base
5. WHEN Input-Radio-Base improvements are made THEN Input-Radio-Set usage SHALL automatically benefit (inheritance)

---

### Requirement 12: Testing (Test-Development-Standards)

**User Story**: As a developer, I want comprehensive tests following established patterns, so that the component is reliable and maintainable.

#### Acceptance Criteria

1. WHEN implementing tests THEN the system SHALL follow Test-Development-Standards steering document
2. WHEN testing token usage THEN the system SHALL use Stemma System validators for token compliance
3. WHEN testing accessibility THEN the system SHALL validate WCAG 2.1 AA compliance
4. WHEN testing web component THEN the system SHALL test custom element registration and attribute reactivity
5. WHEN testing states THEN the system SHALL cover selected, unselected, hover, focus, and error states
6. WHEN testing sizes THEN the system SHALL validate all three size variants (sm, md, lg)
7. WHEN testing Input-Radio-Set THEN the system SHALL validate mutual exclusivity and keyboard navigation
8. WHEN testing Input-Radio-Set THEN the system SHALL validate orchestration pattern (Set does not duplicate Base rendering)
9. WHEN testing form integration THEN the system SHALL validate form submission includes radio value when selected and excludes value when unselected

---

### Requirement 13: Documentation

**User Story**: As a developer, I want comprehensive documentation, so that I can understand and use the radio components correctly.

#### Acceptance Criteria

1. WHEN component is complete THEN the system SHALL create component README following existing component documentation patterns
2. WHEN component is complete THEN the system SHALL update Component-Quick-Reference.md with radio family entry
3. WHEN component is complete THEN the system SHALL update Component-Family-Form-Inputs.md with radio components
4. WHEN component is complete THEN the system SHALL create usage examples demonstrating Base and Set usage
5. WHEN Input-Radio-Set is complete THEN documentation SHALL include keyboard navigation patterns and validation usage

---

## Non-Functional Requirements

### Performance

1. WHEN radio state changes THEN animation SHALL complete within 250ms
2. WHEN radio is rendered THEN initial paint SHALL occur within 16ms frame budget

### Compatibility

1. WHEN radio is used on web THEN the system SHALL support all modern browsers (Chrome, Firefox, Safari, Edge)
2. WHEN radio is used on iOS THEN the system SHALL support iOS 15+
3. WHEN radio is used on Android THEN the system SHALL support Android API 26+

### Architectural Constraints (Lessons from Spec 046)

1. WHEN implementing Input-Radio-Set THEN the system SHALL use orchestration pattern (not standalone duplication)
2. WHEN implementing Input-Radio-Set THEN the system SHALL NOT duplicate radio circle/dot rendering from Base
3. WHEN implementing Input-Radio-Set THEN the system SHALL pass state to children via context/environment (platform-idiomatic)

---

**Organization**: spec-validation
**Scope**: 047-input-radio-base
