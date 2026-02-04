# Requirements Document: Chip Component Family

**Date**: February 3, 2026
**Spec**: 045 - Chip Component Family
**Status**: Requirements Phase
**Dependencies**: 
- Icon-Base component
- Icon size tokens — requires type alignment fix

---

## Introduction

This specification defines the Chip component family for the DesignerPunk design system. Chips are compact, interactive elements used for filtering, selection, or input. The family includes a base primitive (Chip-Base) and two semantic variants (Chip-Filter, Chip-Input) following the Stemma System architecture.

---

## Requirements

### Requirement 1: Chip-Base Component Structure

**User Story**: As a developer, I want a base chip component with consistent visual styling, so that I can build chip-based UI patterns with design system compliance.

#### Acceptance Criteria

1. WHEN Chip-Base renders THEN it SHALL display a pill-shaped container with label text
2. WHEN Chip-Base has an icon prop THEN it SHALL display the icon before the label using Icon-Base at `icon.size075`
3. WHEN Chip-Base is pressed THEN it SHALL call the onPress callback
4. WHEN Chip-Base has disabled=true THEN it SHALL not respond to press events
5. WHEN Chip-Base has disabled=true THEN it SHALL apply disabled visual styling
6. WHEN Chip-Base renders THEN it SHALL use `typography.buttonSm` for label text
7. WHEN Chip-Base renders THEN it SHALL use `borderDefault` border width

---

### Requirement 2: Chip-Base Visual Specifications

**User Story**: As a designer, I want chips to have consistent sizing and spacing, so that they integrate harmoniously with other UI elements.

#### Acceptance Criteria

1. WHEN Chip-Base renders THEN it SHALL have 6px block padding (component token referencing `space075`)
2. WHEN Chip-Base renders THEN it SHALL have 12px inline padding (`space.inset.150`)
3. WHEN Chip-Base has an icon THEN it SHALL have 4px gap between icon and label (`space.grouped.tight`)
4. WHEN Chip-Base renders THEN it SHALL have pill shape using `radius.full`
5. WHEN Chip-Base renders THEN the visual height SHALL be 32px (derived from padding + content)
6. WHEN Chip-Base renders THEN the tap area SHALL be 48px (`tapAreaRecommended`)

---

### Requirement 3: Chip-Base State Styling

**User Story**: As a user, I want clear visual feedback when interacting with chips, so that I understand the chip's current state.

#### Acceptance Criteria

1. WHEN Chip-Base is in default state THEN it SHALL use `color.surface.secondary` background, `color.border.default` border, `color.content.primary` text
2. WHEN Chip-Base is hovered (web) THEN it SHALL use `color.surface.tertiary` background, `color.border.emphasis` border
3. WHEN Chip-Base is pressed THEN it SHALL use `color.surface.tertiary` background, `color.border.emphasis` border
4. WHEN Chip-Base is disabled THEN it SHALL use `color.surface.disabled` background, `color.border.disabled` border, `color.content.disabled` text
5. WHEN Chip-Base state changes THEN it SHALL animate using `motion.duration.fast`

---

### Requirement 4: Chip-Filter Semantic Variant

**User Story**: As a user, I want to toggle filter chips on and off, so that I can filter content by multiple criteria.

#### Acceptance Criteria

1. WHEN Chip-Filter renders THEN it SHALL inherit all Chip-Base visual styling and behavior
2. WHEN Chip-Filter has selected=true THEN it SHALL use `color.interactive.primary` background, `color.interactive.primary` border, `color.content.onPrimary` text
3. WHEN Chip-Filter has selected=true THEN it SHALL display a checkmark icon (Icon-Base, `icon.size075`)
4. WHEN Chip-Filter has selected=true AND has an icon prop THEN the checkmark SHALL replace the leading icon
5. WHEN Chip-Filter is pressed THEN it SHALL toggle the selected state and call onSelectionChange callback
6. WHEN Chip-Filter has disabled=true THEN it SHALL not toggle on press

---

### Requirement 5: Chip-Input Semantic Variant

**User Story**: As a user, I want to remove input chips by tapping them, so that I can manage user-entered values like tags or selections.

#### Acceptance Criteria

1. WHEN Chip-Input renders THEN it SHALL inherit all Chip-Base visual styling
2. WHEN Chip-Input renders THEN it SHALL always display an X icon (Icon-Base, `icon.size075`) as trailing element
3. WHEN Chip-Input has an icon prop THEN it SHALL display both leading icon AND trailing X icon
4. WHEN Chip-Input is pressed (anywhere on chip) THEN it SHALL call onDismiss callback
5. WHEN Chip-Input has disabled=true THEN it SHALL not call onDismiss on press
6. WHEN Chip-Input renders THEN it SHALL NOT have a selected state (dismiss-only behavior)

---

### Requirement 6: Cross-Platform Implementation

**User Story**: As a developer, I want chips to work consistently across web, iOS, and Android, so that I can build cross-platform applications.

#### Acceptance Criteria

1. WHEN Chip components render on web THEN they SHALL use CSS custom properties for token values
2. WHEN Chip components render on iOS THEN they SHALL use SwiftUI with token constants
3. WHEN Chip components render on Android THEN they SHALL use Jetpack Compose with token constants
4. WHEN Chip components render THEN they SHALL use logical properties (padding-block, padding-inline) for RTL support
5. WHEN Chip components render THEN they SHALL produce visually identical results across platforms

---

### Requirement 7: Accessibility Compliance

**User Story**: As a user with accessibility needs, I want chips to be fully accessible, so that I can use them with assistive technologies.

#### Acceptance Criteria

1. WHEN Chip-Base renders THEN it SHALL be focusable via keyboard (Tab)
2. WHEN Chip-Base has focus THEN it SHALL display a visible focus indicator using accessibility tokens
3. WHEN Chip-Base is focused AND Space/Enter is pressed THEN it SHALL activate (same as press)
4. WHEN Chip-Filter renders THEN it SHALL announce selected state to screen readers (`aria-pressed`)
5. WHEN Chip-Input renders THEN the X icon SHALL have accessible label "Remove [label]"
6. WHEN Chip components render THEN the tap area SHALL be minimum 48px (exceeds WCAG 44px requirement)

---

### Requirement 8: Component Token Definition

**User Story**: As a design system maintainer, I want chip-specific tokens defined, so that chip styling can be adjusted systematically.

#### Acceptance Criteria

1. WHEN chip component tokens are defined THEN `chip.paddingBlock` SHALL reference `space075` (6px)
2. WHEN chip component tokens are defined THEN they SHALL include reasoning explaining the token's purpose
3. WHEN chip component tokens are defined THEN they SHALL follow the component token pattern established by Button-VerticalList-Item

---

### Requirement 9: Icon-Base Type Alignment (Prerequisite)

**User Story**: As a developer, I want Icon-Base TypeScript types to match actual token values, so that the API is not misleading.

#### Acceptance Criteria

1. WHEN IconBaseSize type is defined THEN it SHALL include `20` (not `18`) for `icon.size075`
2. WHEN iconBaseSizes.size075 is accessed THEN it SHALL return `20` (not `18`)
3. WHEN Icon-Base validates size prop THEN it SHALL accept `20` as valid for size075
4. WHEN components reference icon.size075 THEN they SHALL use size value `20`
5. WHEN Icon-Base type is updated THEN components using `size={18}` (Button-Icon, Avatar, Badge-Label-Base) SHALL be updated to `size={20}` and validated

---

### Requirement 10: Stemma System Compliance

**User Story**: As a design system maintainer, I want chip components to follow Stemma System architecture, so that they integrate consistently with other component families.

#### Acceptance Criteria

1. WHEN Chip-Base is created THEN it SHALL have a schema file at `src/components/core/Chip-Base/Chip-Base.schema.yaml`
2. WHEN Chip-Base schema is defined THEN it SHALL specify type as `primitive` and family as `Chip`
3. WHEN Chip-Filter is created THEN it SHALL have a schema file specifying `inherits: Chip-Base`
4. WHEN Chip-Input is created THEN it SHALL have a schema file specifying `inherits: Chip-Base`
5. WHEN chip schemas are defined THEN they SHALL include behavioral contracts for all interactive behaviors
6. WHEN chip schemas are defined THEN they SHALL list all required design tokens
7. WHEN chip schemas are defined THEN they SHALL specify platform implementation notes for web, iOS, and Android

---

### Requirement 11: Component Documentation

**User Story**: As a developer, I want MCP-queryable documentation for the Chip family, so that I can discover and use chip components efficiently.

#### Acceptance Criteria

1. WHEN Chip family documentation is created THEN it SHALL be located at `.kiro/steering/Component-Family-Chip.md`
2. WHEN Chip family documentation is created THEN it SHALL include Family Overview section (~200-400 tokens)
3. WHEN Chip family documentation is created THEN it SHALL include Inheritance Structure section with component hierarchy
4. WHEN Chip family documentation is created THEN it SHALL include Behavioral Contracts section
5. WHEN Chip family documentation is created THEN it SHALL include Component Schemas section with individual component details
6. WHEN Chip family documentation is created THEN it SHALL include Token Dependencies section
7. WHEN Chip family documentation is created THEN it SHALL include Usage Guidelines section with primitive vs semantic selection guidance
8. WHEN Chip family documentation is created THEN it SHALL include Cross-Platform Notes section

---

### Requirement 12: Rosetta System Integration

**User Story**: As a design system maintainer, I want chip component tokens to integrate with the Rosetta token pipeline, so that tokens are generated consistently across platforms.

#### Acceptance Criteria

1. WHEN chip component tokens are defined THEN they SHALL use `defineComponentTokens()` helper
2. WHEN chip component tokens are defined THEN they SHALL specify component name as `Chip`
3. WHEN chip component tokens are defined THEN they SHALL specify family as `spacing`
4. WHEN chip component tokens are defined THEN they SHALL include required reasoning for each token
5. WHEN chip component tokens are defined THEN they SHALL reference primitive tokens (not hard-coded values)
6. WHEN chip component tokens are generated THEN web output SHALL use CSS custom properties format
7. WHEN chip component tokens are generated THEN iOS output SHALL use Swift constants format
8. WHEN chip component tokens are generated THEN Android output SHALL use Kotlin constants format

---

### Requirement 13: Test Development Standards Compliance

**User Story**: As a developer, I want chip component tests to follow project testing standards, so that tests are maintainable and provide long-term value.

#### Acceptance Criteria

1. WHEN chip component tests are created THEN they SHALL be categorized as evergreen tests (permanent behavior verification)
2. WHEN chip web component tests are created THEN they SHALL use explicit custom element registration pattern
3. WHEN chip web component tests are created THEN they SHALL wait for `customElements.whenDefined()` before creating elements
4. WHEN chip web component tests are created THEN they SHALL wait after `appendChild()` before querying shadow DOM
5. WHEN chip tests verify accessibility THEN they SHALL test ARIA attributes and screen reader compatibility
6. WHEN chip tests are created THEN they SHALL clean up DOM elements after each test
7. WHEN chip tests are created THEN they SHALL NOT use mocks for core functionality validation

---

## Success Criteria

1. All three chip variants (Base, Filter, Input) render correctly on web, iOS, and Android
2. Chip-Filter toggles selected state with visual feedback
3. Chip-Input dismisses on tap with callback
4. All chips meet WCAG 2.1 AA accessibility requirements
5. All chips use design system tokens (no hard-coded values)
6. Icon-Base TypeScript types align with actual token values
7. Component tokens are defined and documented
8. Stemma System schemas exist for all chip components
9. MCP-queryable family documentation is complete
10. Component tokens integrate with Rosetta pipeline
11. Tests follow project testing standards

---

## Out of Scope

- Chip-Set container component (separate spec)
- Chip-Choice single-select variant (future spec)
- Chip-Action variant (future spec)
- Chip animations beyond state transitions

---

**Organization**: spec-validation
**Scope**: 045-chip-base
