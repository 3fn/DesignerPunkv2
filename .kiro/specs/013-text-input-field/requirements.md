# Requirements Document: Text Input Field Component

**Date**: December 6, 2025  
**Spec**: 013-text-input-field  
**Status**: Requirements Phase  
**Dependencies**: 
- Spec 014 (Motion Token System) - Complete
- Existing semantic tokens (typography, color, spacing, border)

---

## Introduction

This document defines requirements for the Text Input Field component, a foundational form input using the float label pattern with animated transitions. This component establishes animation patterns for the DesignerPunk design system and validates the motion token system completed in Spec 014.

The component prioritizes accessibility (WCAG 2.1 AA compliance), cross-platform consistency, and modern UX patterns while intentionally excluding disabled states in favor of better alternatives.

---

## Glossary

- **TextInputField**: Single-line text input component with float label pattern
- **Float Label Pattern**: Label animates from placeholder position inside input to floated position above input
- **labelMdFloat**: New typography token for floated label state (14px, derived from scale088 × fontSize100)
- **Motion Tokens**: Animation tokens from Spec 014 (duration, easing, scale)
- **Helper Text**: Persistent descriptive text below input explaining expected input
- **Error Message**: Conditional text below helper text explaining validation failure
- **Trailing Icon**: Icon positioned at the end of input field (validation, info, show/hide)
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines Level AA compliance
- **prefers-reduced-motion**: User preference to minimize non-essential motion

---

## Requirements

### Requirement 1: Float Label Animation

**User Story**: As a user, I want the input label to animate smoothly between states, so that I understand the input's state while maintaining visual context.

#### Acceptance Criteria

1. WHEN the TextInputField is empty and not focused THEN the label SHALL appear inside the input field using typography.labelMd with color.text.subtle
2. WHEN a user focuses an empty TextInputField THEN the label SHALL animate to floated position above the input using motion.floatLabel timing and scale to typography.labelMdFloat (via scale088) with color.primary
3. WHEN a user blurs an empty TextInputField THEN the label SHALL animate back to placeholder position inside the input using motion.floatLabel timing with color.text.subtle
4. WHEN the TextInputField contains text THEN the label SHALL remain in floated position regardless of focus state
5. WHEN a user has prefers-reduced-motion enabled THEN the TextInputField SHALL disable all label animations and show instant state changes

### Requirement 2: Input States and Visual Feedback

**User Story**: As a user, I want clear visual feedback about the input's current state, so that I understand when the input is focused, filled, has errors, or is successfully validated.

#### Acceptance Criteria

1. WHEN the TextInputField is in default state (empty, not focused) THEN the component SHALL display border using borderDefault width with color.border and radius150
2. WHEN a user focuses the TextInputField THEN the component SHALL display border with color.primary enhanced by blend.focusSaturate and show focus ring using accessibility.focus.width with accessibility.focus.color and accessibility.focus.offset
3. WHEN the TextInputField is filled but not focused THEN the component SHALL display border with color.border and label with color.text.subtle in floated position
4. WHEN the TextInputField has validation error THEN the component SHALL display border with color.error, label with color.error in floated position, and error message below input
5. WHEN the TextInputField has validation success THEN the component SHALL display border with color.success, label with color.success in floated position, and success icon as trailing icon

### Requirement 3: Helper Text and Error Messages

**User Story**: As a user, I want persistent helper text explaining what input is expected and clear error messages when validation fails, so that I understand both the requirement and any mistakes.

#### Acceptance Criteria

1. WHEN the TextInputField has helper text provided THEN the component SHALL display helper text below the input using typography.caption with color.text.subtle
2. WHEN the TextInputField enters error state THEN the component SHALL display error message below helper text using typography.caption with color.error
3. WHEN the TextInputField has both helper text and error message THEN both SHALL be visible simultaneously with error message appearing below helper text
4. WHEN the TextInputField exits error state THEN the error message SHALL be removed and helper text SHALL remain visible
5. WHEN the TextInputField has helper text or error message THEN the text SHALL be associated with the input via aria-describedby for screen reader support

### Requirement 4: Trailing Icon Support

**User Story**: As a user, I want visual indicators and interactive controls at the end of the input field, so that I can see validation status and access input-specific functionality.

#### Acceptance Criteria

1. WHEN the TextInputField is in error state THEN the component SHALL display error icon (icons-feather/x-circle.svg) as trailing icon using platform-appropriate icon component
2. WHEN the TextInputField is in success state THEN the component SHALL display success icon (icons-feather/check.svg) as trailing icon using platform-appropriate icon component
3. WHEN the TextInputField supports optional info icon THEN the component SHALL display info icon (icons-feather/info.svg) as trailing icon using platform-appropriate icon component and trigger helper text display on interaction
4. WHEN the TextInputField transitions from empty to filled state THEN trailing icons SHALL fade in coordinated with label float animation timing
5. WHEN the TextInputField transitions from filled to empty state THEN trailing icons SHALL fade out coordinated with label animation timing

### Requirement 5: Container Width and Sizing

**User Story**: As a developer, I want the input to conform to its container width, so that the component works flexibly in any layout context without requiring size variants.

#### Acceptance Criteria

1. WHEN the TextInputField is placed in a container THEN the component SHALL expand to fill 100% of the container width
2. WHEN the TextInputField is rendered THEN the component SHALL maintain minimum height using tapAreaRecommended for touch target accessibility
3. WHEN the TextInputField has padding applied THEN the padding SHALL adjust to maintain the tapAreaRecommended minimum height
4. WHEN the TextInputField is in any state THEN the component SHALL NOT provide size variants (small, medium, large)
5. WHEN a developer needs different input widths THEN the width SHALL be controlled by the container, not component props

### Requirement 6: Keyboard and Focus Management

**User Story**: As a keyboard user, I want to navigate and interact with the input using standard keyboard controls, so that I can complete forms without a mouse.

#### Acceptance Criteria

1. WHEN a user presses Tab key THEN the TextInputField SHALL receive focus and display focus state
2. WHEN a user clicks the label THEN the associated input SHALL receive focus
3. WHEN the TextInputField has focus and user presses Enter THEN the form SHALL submit using standard browser behavior
4. WHEN the TextInputField has focus THEN the focus ring SHALL be visible using accessibility.focus.width with accessibility.focus.color and accessibility.focus.offset
5. WHEN a user navigates away from the TextInputField THEN the component SHALL lose focus and update to appropriate state (filled or empty)

### Requirement 7: Accessibility Compliance

**User Story**: As a user with disabilities, I want the input to work with assistive technologies and meet accessibility standards, so that I can use forms regardless of my abilities.

#### Acceptance Criteria

1. WHEN the TextInputField is rendered THEN the label SHALL have for attribute matching input id for programmatic association
2. WHEN the TextInputField has helper text or error message THEN the text SHALL be associated with input via aria-describedby
3. WHEN the TextInputField enters error state THEN the error message SHALL be announced to screen readers
4. WHEN the TextInputField displays colors for state indication THEN all colors SHALL meet WCAG 2.1 AA contrast ratio requirements
5. WHEN the TextInputField shows error state THEN the error SHALL be indicated by both color AND text (not color alone)

### Requirement 8: Motion Token Integration

**User Story**: As a developer, I want the component to use motion tokens from the design system, so that animations are consistent across all components and platforms.

#### Acceptance Criteria

1. WHEN the TextInputField animates label float THEN the animation SHALL use motion.floatLabel semantic token
2. WHEN the TextInputField scales label typography THEN the scaling SHALL use scale088 primitive token applied to fontSize100 to produce typography.labelMdFloat
3. WHEN the TextInputField animates on web platform THEN the animation SHALL use CSS transitions with motion token CSS custom properties
4. WHEN the TextInputField animates on iOS platform THEN the animation SHALL use SwiftUI animation with motion token values
5. WHEN the TextInputField animates on Android platform THEN the animation SHALL use Jetpack Compose animation with motion token values

### Requirement 9: Cross-Platform Consistency

**User Story**: As a product architect, I want the input to behave consistently across web, iOS, and Android platforms, so that users have a familiar experience regardless of platform.

#### Acceptance Criteria

1. WHEN the TextInputField is rendered on any platform THEN the label animation timing SHALL be mathematically equivalent using motion.floatLabel token values
2. WHEN the TextInputField is rendered on any platform THEN the label scaling SHALL be mathematically equivalent using scale088 token value
3. WHEN the TextInputField is rendered on any platform THEN the spacing, colors, and typography SHALL use the same semantic tokens
4. WHEN the TextInputField is rendered on any platform THEN the component SHALL respect platform-specific accessibility features (prefers-reduced-motion, screen readers)
5. WHEN the TextInputField is rendered on any platform THEN the focus indicators SHALL be visible and meet platform conventions

### Requirement 10: Intentional Exclusions

**User Story**: As a UX designer, I want the component to exclude disabled states in favor of better alternatives, so that users always understand why they cannot interact with an input.

#### Acceptance Criteria

1. WHEN the TextInputField component is implemented THEN the component SHALL NOT support disabled state
2. WHEN a developer needs to prevent input interaction THEN the component documentation SHALL recommend read-only attribute, conditional visibility, or clear messaging as alternatives
3. WHEN the TextInputField is read-only THEN the component SHALL display with visual indication but remain accessible to screen readers
4. WHEN the TextInputField documentation is written THEN the exclusion of disabled state SHALL be documented as intentional design decision with rationale
5. WHEN the TextInputField is in any state THEN the component SHALL remain keyboard accessible and screen reader compatible

---

## Design Notes

**Background Property Structure**: Component structure should support background property from the start (even if unused initially) to make future enhancements trivial (e.g., error background tint with color.error.subtle). This allows adding background color variations later without component restructuring.

**Source**: Design outline architectural decision

**labelMdFloat Typography Token**: This component requires a new semantic typography token (typography.labelMdFloat) that uses scale088 applied to fontSize100 to produce scaled font size. The token maintains the same lineHeight, fontWeight, fontFamily, and letterSpacing as typography.labelMd to prevent layout shift during animation. Implementation must use the `applyScaleWithRounding` utility from UnitConverter (Spec 014) to ensure consistent rounding across platforms.

**Platform-Specific Icon Components**: Icons must use platform-appropriate components:
- **Web**: `<dp-icon>` web component or `createIcon()` function from Icon component
- **iOS**: SwiftUI Image or SF Symbols integration (platform-specific implementation)
- **Android**: Jetpack Compose Icon or Vector Asset integration (platform-specific implementation)

**Source**: Design outline typography token strategy

**Error vs Success Message Behavior**: Error states display error message below helper text (both visible simultaneously). Success states display success icon as trailing icon but do NOT display success message. This asymmetry reflects that errors require explanation while success is self-evident visual confirmation.

**Source**: Requirements clarification discussion

---

## Related Documentation

- **Design Outline**: `.kiro/specs/013-text-input-field/design-outline.md` - Detailed design exploration and decisions
- **Motion Token System**: `.kiro/specs/014-motion-token-system/` - Motion tokens used by this component
- **Motion Token Guide**: `docs/tokens/motion-tokens.md` - Usage guide for motion tokens
- **Component Development Guide**: `.kiro/steering/Component Development Guide.md` - Standards for component development

---

**Organization**: spec-requirements  
**Scope**: 013-text-input-field
