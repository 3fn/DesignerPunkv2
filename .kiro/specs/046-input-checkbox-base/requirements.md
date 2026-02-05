# Requirements Document: Input-Checkbox-Base & Input-Checkbox-Legal

**Date**: February 5, 2026
**Spec**: 046 - Input-Checkbox-Base
**Status**: Requirements Phase
**Dependencies**: 
- Icon-Base component (for checkmark/dash icon rendering)
- Accessibility token family (`accessibility.focus.*` tokens)
- Feedback color tokens (`color.feedback.select.*`, `color.feedback.error.*`)
- Motion tokens (`motion.selectionTransition`, `motion.buttonPress`)
- Scale tokens (`scale096`)
- Blend tokens (`blend.hoverDarker`, `blend.pressedDarker`)

---

## Introduction

The Input-Checkbox components provide binary selection controls for web, iOS, and Android platforms. This spec covers two components:

- **Input-Checkbox-Base**: General-purpose checkbox with three size variants, configurable label alignment, and support for checked, unchecked, and indeterminate states
- **Input-Checkbox-Legal**: Specialized checkbox for legal consent scenarios (terms of service, privacy policies, GDPR consent) with audit capabilities and stricter validation

Both components follow True Native Architecture with build-time platform separation, use the Icon-Base component for checkmark rendering, and maintain WCAG 2.1 AA accessibility compliance.

**Key Architectural Principles**:
- **Stemma System**: Component architecture following [Family]-[Type]-[Variant] naming (Input-Checkbox-Base, Input-Checkbox-Legal)
- **Rosetta System**: Token architecture for new `inset.075` semantic token
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic tokens (no hard-coded values)
- **Icon-Base integration**: Checkmark and dash icons rendered via Icon-Base component
- **Input-Text-Base alignment**: Error and helper text patterns follow Input-Text-Base conventions
- **Test-Development-Standards**: All tests follow established testing patterns and Stemma validators

**Glossary**:
- **Checkbox**: Binary selection control (checked/unchecked)
- **Indeterminate**: Visual state indicating partial selection (neither fully checked nor unchecked)
- **Legal consent**: User acknowledgment of terms, policies, or agreements with audit requirements
- **Stemma System**: DesignerPunk's component architecture system
- **Rosetta System**: DesignerPunk's token architecture system

---

## Requirements

### Requirement 1: Checkbox States

**User Story**: As a user, I want to see clear visual feedback for checkbox states, so that I understand whether an option is selected.

#### Acceptance Criteria

1. WHEN checkbox is unchecked THEN the system SHALL display transparent background with default border color
2. WHEN checkbox is checked THEN the system SHALL display filled background with checkmark icon
3. WHEN checkbox is indeterminate THEN the system SHALL display filled background with horizontal dash icon
4. WHEN checkbox receives hover (web) THEN the system SHALL apply hover feedback to border
5. WHEN checkbox receives keyboard focus THEN the system SHALL display focus ring using accessibility tokens
6. WHEN checkbox has error THEN the system SHALL display error border color
7. WHEN checkbox state changes THEN the system SHALL animate the transition using `motion.selectionTransition` token

---

### Requirement 2: Size Variants (Base Only)

**User Story**: As a developer, I want multiple checkbox sizes, so that I can use appropriate sizing for different UI contexts.

#### Acceptance Criteria

1. WHEN size is "sm" THEN the system SHALL render 24px box (16px icon + 4px inset padding × 2)
2. WHEN size is "md" THEN the system SHALL render 32px box (20px icon + 6px inset padding × 2)
3. WHEN size is "lg" THEN the system SHALL render 40px box (24px icon + 8px inset padding × 2)
4. WHEN size is "sm" THEN the system SHALL use `labelSm` typography for label
5. WHEN size is "md" THEN the system SHALL use `labelMd` typography for label
6. WHEN size is "lg" THEN the system SHALL use `labelLg` typography for label
7. WHEN size is "sm" or "md" THEN the system SHALL use `space.grouped.normal` gap between box and label
8. WHEN size is "lg" THEN the system SHALL use `space.grouped.loose` gap between box and label
9. IF size prop is not provided THEN the system SHALL default to "md"

---

### Requirement 3: Label Alignment (Base Only)

**User Story**: As a developer, I want to control label alignment, so that I can optimize layout for single-line or multi-line labels.

#### Acceptance Criteria

1. WHEN labelAlign is "center" THEN the system SHALL vertically center the label with the checkbox box
2. WHEN labelAlign is "top" THEN the system SHALL align the label to the top of the checkbox box
3. IF labelAlign prop is not provided THEN the system SHALL default to "center"
4. WHEN label wraps to multiple lines AND labelAlign is "top" THEN the checkbox box SHALL remain aligned to the first line of text

---

### Requirement 4: Icon-Base Integration

**User Story**: As a developer, I want checkmarks rendered via Icon-Base, so that icons are consistent with other components.

#### Acceptance Criteria

1. WHEN checkbox is checked THEN the system SHALL render "check" icon from Icon-Base
2. WHEN checkbox is indeterminate THEN the system SHALL render "minus" icon from Icon-Base
3. WHEN rendering icon THEN the system SHALL use icon size matching the checkbox size variant
4. WHEN rendering icon THEN the system SHALL apply `color.contrast.onDark` for icon color
5. WHEN checkbox is unchecked THEN the system SHALL NOT render any icon

---

### Requirement 5: Helper Text and Error Messages

**User Story**: As a user, I want to see helpful context and error messages, so that I understand what is expected.

#### Acceptance Criteria

1. WHEN helperText is provided THEN the system SHALL display it below the checkbox+label row
2. WHEN errorMessage is provided THEN the system SHALL display it below the helper text (or below checkbox if no helper text)
3. WHEN errorMessage is provided THEN the system SHALL apply error styling to checkbox border
4. WHEN errorMessage is provided THEN the system SHALL set `aria-invalid="true"` on the checkbox
5. WHEN errorMessage is provided THEN the system SHALL associate error with checkbox via `aria-describedby`
6. WHEN helperText is provided THEN the system SHALL associate helper text with checkbox via `aria-describedby`

---

### Requirement 6: Accessibility

**User Story**: As a user with disabilities, I want the checkbox to be fully accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. WHEN checkbox is rendered THEN the system SHALL associate label with checkbox via `for`/`id` (web) or accessibility label (native)
2. WHEN checkbox state changes THEN screen readers SHALL announce "checked", "unchecked", or "partially checked"
3. WHEN checkbox receives keyboard focus THEN the system SHALL display visible focus ring
4. WHEN user presses Space key on focused checkbox THEN the system SHALL toggle checkbox state
5. WHEN checkbox is rendered THEN the entire label area SHALL be tappable/clickable
6. WHEN checkbox is rendered on mobile THEN touch target SHALL meet minimum 44px requirement

---

### Requirement 7: Platform-Specific Interactions

**User Story**: As a user, I want platform-appropriate interaction feedback, so that the checkbox feels native to my device.

#### Acceptance Criteria

1. WHEN checkbox is pressed on iOS THEN the system SHALL apply scale transform using `scale096` token
2. WHEN checkbox is pressed on iOS THEN the system SHALL animate using `motion.buttonPress` timing
3. WHEN checkbox is tapped on Android THEN the system SHALL display Material ripple effect
4. WHEN checkbox is hovered on web THEN the system SHALL apply `blend.hoverDarker` to border
5. WHEN checkbox receives focus on web THEN the system SHALL display focus ring only for keyboard navigation (`:focus-visible`)

---

### Requirement 8: Web Component Implementation

**User Story**: As a web developer, I want a custom element, so that I can use the checkbox in any web framework.

#### Acceptance Criteria

1. WHEN checkbox is used on web THEN the system SHALL register as `<input-checkbox-base>` custom element
2. WHEN checkbox is rendered THEN the system SHALL use hidden native `<input type="checkbox">` for form compatibility
3. WHEN checkbox is rendered on web THEN the system SHALL use CSS logical properties for RTL support (`padding-inline`, `margin-inline-start`, etc.)
4. WHEN checkbox is rendered on iOS THEN the system SHALL use SwiftUI's native RTL handling (`leading`/`trailing` alignment)
5. WHEN checkbox is rendered on Android THEN the system SHALL use Compose's native RTL handling (`Arrangement.Start`/`End`)
6. WHEN checkbox attributes change THEN the system SHALL reactively update rendering
7. WHEN checkbox is used in a form THEN native form submission SHALL include checkbox value
8. WHEN form is reset THEN checkbox SHALL return to unchecked state (pre-checked checkboxes are not supported)

---

### Requirement 9: Input-Checkbox-Legal Specific Requirements

**User Story**: As a product owner, I want a specialized legal checkbox, so that I can collect legally compliant consent.

#### Acceptance Criteria

1. WHEN Input-Checkbox-Legal is rendered THEN the system SHALL use fixed sizing: lg box (40px) with `labelSm` typography
2. WHEN Input-Checkbox-Legal is rendered THEN the system SHALL use top label alignment (not configurable)
3. WHEN `requiresExplicitConsent` is true THEN the system SHALL prevent pre-checking the checkbox
4. WHEN `requiresExplicitConsent` is true AND `checked={true}` is passed THEN the system SHALL override to `checked={false}` and emit console warning
5. WHEN checkbox state changes THEN the system SHALL call `onConsentChange` with boolean and ISO 8601 timestamp string
6. WHEN `legalTextId` is provided THEN the system SHALL include it in consent callback for audit trail
7. WHEN `legalTextVersion` is provided THEN the system SHALL include it in consent callback for audit trail
8. WHEN `showRequiredIndicator` is true THEN the system SHALL display required indicator
9. IF `showRequiredIndicator` is not provided THEN the system SHALL default to true
10. WHEN Input-Checkbox-Legal is rendered THEN the system SHALL NOT support indeterminate state
11. WHEN Input-Checkbox-Legal is rendered THEN label text SHALL NOT be truncated

---

### Requirement 10: New Token Creation (Rosetta System)

**User Story**: As a design system maintainer, I want the inset.075 token created following Rosetta architecture, so that checkbox sizing follows mathematical consistency.

#### Acceptance Criteria

1. WHEN implementing checkbox THEN the system SHALL create `inset.075` semantic token in `src/tokens/semantic/SpacingTokens.ts`
2. WHEN creating `inset.075` THEN the token SHALL reference `space075` primitive token
3. WHEN creating `inset.075` THEN the token SHALL follow mathematical relationship: 0.75 × base (8px) = 6px
4. WHEN creating `inset.075` THEN the token SHALL include JSDoc documentation following existing inset token patterns
5. WHEN `inset.075` is created THEN platform-specific token generation SHALL automatically include the new token
6. WHEN `inset.075` is created THEN Chip-Base component MAY be updated to reference it (optional refactor)

---

### Requirement 11: Testing (Test-Development-Standards)

**User Story**: As a developer, I want comprehensive tests following established patterns, so that the component is reliable and maintainable.

#### Acceptance Criteria

1. WHEN implementing tests THEN the system SHALL follow Test-Development-Standards steering document
2. WHEN testing token usage THEN the system SHALL use Stemma System validators for token compliance
3. WHEN testing accessibility THEN the system SHALL validate WCAG 2.1 AA compliance
4. WHEN testing web component THEN the system SHALL test custom element registration and attribute reactivity
5. WHEN testing states THEN the system SHALL cover checked, unchecked, indeterminate, hover, focus, and error states
6. WHEN testing sizes THEN the system SHALL validate all three size variants (sm, md, lg)
7. WHEN testing Input-Checkbox-Legal THEN the system SHALL validate consent timestamp and audit trail functionality

---

### Requirement 12: Documentation

**User Story**: As a developer, I want comprehensive documentation, so that I can understand and use the checkbox components correctly.

#### Acceptance Criteria

1. WHEN component is complete THEN the system SHALL create component README following existing component documentation patterns
2. WHEN component is complete THEN the system SHALL update Component-Quick-Reference.md with checkbox family entry
3. WHEN `inset.075` token is created THEN the system SHALL update Token-Quick-Reference.md with new token
4. WHEN component is complete THEN the system SHALL create usage examples in component examples directory
5. WHEN Input-Checkbox-Legal is complete THEN documentation SHALL include legal consent best practices and audit trail usage

---

## Non-Functional Requirements

### Performance

1. WHEN checkbox state changes THEN animation SHALL complete within 250ms
2. WHEN checkbox is rendered THEN initial paint SHALL occur within 16ms frame budget

### Compatibility

1. WHEN checkbox is used on web THEN the system SHALL support all modern browsers (Chrome, Firefox, Safari, Edge)
2. WHEN checkbox is used on iOS THEN the system SHALL support iOS 15+
3. WHEN checkbox is used on Android THEN the system SHALL support Android API 26+

---

**Organization**: spec-validation
**Scope**: 046-input-checkbox-base
