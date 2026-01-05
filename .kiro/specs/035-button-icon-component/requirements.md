# Requirements Document: Button-Icon Component

**Date**: January 4, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Requirements Phase
**Dependencies**: Icon Component (Spec 004), CTA Button Component, Accessibility Tokens, Radius Tokens

---

## Introduction

Button-Icon is a circular, icon-only interactive button component that provides accessible actions without text labels. It follows the same style matrix as CTA buttons (Primary, Secondary, Tertiary × Small, Medium, Large) while introducing icon-specific accessibility patterns and circular visual treatment.

The component integrates with the mathematical token system for sizing, spacing, and colors, and uses the Icon System for icon rendering. The component prioritizes accessibility (WCAG 2.1 AA compliance) with required `aria-label` for screen reader support and `tapAreaRecommended` (48px) minimum touch targets.

**Key Architectural Principles**:
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic, primitive, or component tokens (no hard-coded values)
- **Circular shape**: Uses `radiusCircle` semantic token for true circular rendering
- **Accessibility-first**: Required `aria-label`, 48px minimum touch targets, focus ring with buffer
- **Self-contained focus ring**: 4px transparent buffer included in component box model

**Design Decisions** (from design-outline):
- No disabled state by design (use alternative patterns)
- Loading state deferred pending animation token system
- Press animations are platform-specific (scale on iOS, ripple on Android, CSS on web)

---

## Glossary

- **Button-Icon**: Circular icon-only button component for actions without text labels
- **Focus_Ring_Buffer**: Transparent area on all sides to contain focus ring, calculated as `accessibility.focus.offset` + `accessibility.focus.width`
- **radiusCircle**: Semantic token for circular shape (references `radiusHalf` primitive)
- **radiusHalf**: Primitive token representing 50% border-radius
- **color.contrast.onPrimary**: Semantic token for content (text/icons) on primary backgrounds
- **tapAreaRecommended**: Semantic token for minimum touch target size (48px)

---

## Requirements

### Requirement 1: Size Variants

**User Story**: As a product designer, I want three button-icon size variants (small, medium, large), so that I can use appropriately sized icon buttons for different UI contexts.

#### Acceptance Criteria

1. WHEN Button-Icon is instantiated with size "small" THEN Button-Icon SHALL render icon using `icon.size050` token and padding using `buttonIcon.inset.small` token
2. WHEN Button-Icon is instantiated with size "medium" THEN Button-Icon SHALL render icon using `icon.size075` token and padding using `buttonIcon.inset.medium` token
3. WHEN Button-Icon is instantiated with size "large" THEN Button-Icon SHALL render icon using `icon.size100` token and padding using `buttonIcon.inset.large` token
4. WHEN Button-Icon renders any size variant THEN Button-Icon SHALL include transparent buffer on all sides equal to `accessibility.focus.offset` + `accessibility.focus.width` (4px total)
5. WHEN Button-Icon size prop is omitted THEN Button-Icon SHALL default to "medium" size

---

### Requirement 2: Visual Style Variants

**User Story**: As a product designer, I want three visual button-icon styles (primary, secondary, tertiary), so that I can establish clear visual hierarchy for icon actions.

#### Acceptance Criteria

1. WHEN Button-Icon is instantiated with variant "primary" THEN Button-Icon SHALL render with `color.primary` background fill and `color.contrast.onPrimary` icon color
2. WHEN Button-Icon is instantiated with variant "secondary" THEN Button-Icon SHALL render with transparent background, `borderDefault` (1px) border using `color.primary`, and `color.primary` icon color
3. WHEN Button-Icon is instantiated with variant "tertiary" THEN Button-Icon SHALL render with transparent background, no border, and `color.primary` icon color
4. WHEN Button-Icon variant prop is omitted THEN Button-Icon SHALL default to "primary" variant

---

### Requirement 3: Circular Shape

**User Story**: As a product designer, I want button-icons to render as perfect circles, so that they are visually distinct from rectangular CTA buttons.

#### Acceptance Criteria

1. WHEN Button-Icon renders THEN Button-Icon SHALL use `radiusCircle` semantic token for border-radius
2. WHEN Button-Icon renders on web platform THEN Button-Icon SHALL output `border-radius: 50%`
3. WHEN Button-Icon renders on iOS platform THEN Button-Icon SHALL use `.clipShape(Circle())`
4. WHEN Button-Icon renders on Android platform THEN Button-Icon SHALL use `CircleShape`

---

### Requirement 4: Accessibility - Screen Reader Support

**User Story**: As a screen reader user, I want button-icons to announce their purpose clearly, so that I understand what action the button performs.

#### Acceptance Criteria

1. WHEN Button-Icon is instantiated THEN Button-Icon SHALL require `ariaLabel` prop (non-optional)
2. WHEN Button-Icon renders on web platform THEN Button-Icon SHALL apply `aria-label` attribute to the button element
3. WHEN Button-Icon renders on iOS platform THEN Button-Icon SHALL apply `.accessibilityLabel()` modifier
4. WHEN Button-Icon renders on Android platform THEN Button-Icon SHALL apply `contentDescription` parameter
5. WHEN Button-Icon renders icon THEN Button-Icon SHALL mark icon as decorative (`aria-hidden="true"` on web)

---

### Requirement 5: Touch Target Accessibility

**User Story**: As a mobile user, I want button-icons to meet minimum touch target requirements, so that I can reliably tap buttons on touch devices.

#### Acceptance Criteria

1. WHEN Button-Icon renders large size THEN Button-Icon SHALL have touch target that exceeds `tapAreaRecommended`
2. WHEN Button-Icon renders medium size THEN Button-Icon SHALL have touch target that meets `tapAreaRecommended`
3. WHEN Button-Icon renders small size THEN Button-Icon SHALL extend touch target to `tapAreaRecommended` using invisible hit area
4. WHEN Button-Icon extends touch target THEN Button-Icon SHALL maintain visual button size while providing `tapAreaRecommended` interactive area
5. WHEN Button-Icon renders any size THEN Button-Icon SHALL meet WCAG 2.5.5 (Target Size Enhanced) and 2.5.8 (Target Size Minimum)

---

### Requirement 6: Focus State

**User Story**: As a keyboard user, I want button-icons to show clear focus indicators within a self-contained buffer, so that I can navigate the interface and focus rings don't overlap adjacent elements.

#### Acceptance Criteria

1. WHEN Button-Icon receives keyboard focus THEN Button-Icon SHALL render focus ring using `accessibility.focus.width` and `accessibility.focus.color` tokens
2. WHEN Button-Icon renders focus ring THEN Button-Icon SHALL position ring at `accessibility.focus.offset` from visual button edge
3. WHEN Button-Icon renders focus ring THEN Button-Icon SHALL contain focus ring within the transparent Focus_Ring_Buffer (no overflow beyond component bounds)
4. WHEN Button-Icon receives focus via mouse click THEN Button-Icon SHALL NOT render focus ring (`:focus-visible` only)
5. WHEN Button-Icon receives focus via keyboard navigation THEN Button-Icon SHALL render focus ring

---

### Requirement 7: Hover State

**User Story**: As a user, I want button-icons to show visual feedback on hover, so that I understand the button is interactive.

#### Acceptance Criteria

1. WHEN Button-Icon primary variant receives hover THEN Button-Icon SHALL apply `blend.hoverDarker` overlay to `color.primary` background
2. WHEN Button-Icon secondary variant receives hover THEN Button-Icon SHALL apply `color.background.primary.subtle` background, `borderEmphasis` (2px) border with `blend.hoverDarker`, and `blend.hoverDarker` to icon color
3. WHEN Button-Icon tertiary variant receives hover THEN Button-Icon SHALL apply `blend.hoverDarker` to icon color only
4. WHEN Button-Icon renders hover state THEN Button-Icon SHALL maintain circular shape

---

### Requirement 8: Pressed State

**User Story**: As a user, I want button-icons to show visual feedback when pressed, so that I receive confirmation of my interaction.

#### Acceptance Criteria

1. WHEN Button-Icon primary variant receives press THEN Button-Icon SHALL apply `blend.pressedDarker` overlay to `color.primary` background
2. WHEN Button-Icon secondary variant receives press THEN Button-Icon SHALL apply `color.background.primary.subtle` background, `borderEmphasis` (2px) border with `blend.pressedDarker`, and `blend.pressedDarker` to icon color
3. WHEN Button-Icon tertiary variant receives press THEN Button-Icon SHALL apply `blend.pressedDarker` to icon color only
4. WHEN Button-Icon renders on iOS platform THEN Button-Icon SHALL apply scale transform (0.97) as platform-specific press feedback
5. WHEN Button-Icon renders on Android platform THEN Button-Icon SHALL apply Material ripple effect as platform-specific press feedback
6. WHEN Button-Icon renders pressed state THEN Button-Icon SHALL maintain circular shape

---

### Requirement 9: Secondary Border Shift Prevention

**User Story**: As a user, I want the secondary button-icon border to change thickness on hover/press without causing layout shift, so that the UI remains stable during interactions.

#### Acceptance Criteria

1. WHEN Button-Icon secondary variant renders default state THEN Button-Icon SHALL reserve `borderEmphasis` (2px) border space while visually displaying `borderDefault` (1px) border
2. WHEN Button-Icon secondary variant transitions to hover/pressed THEN Button-Icon SHALL NOT cause layout shift
3. WHEN Button-Icon secondary variant renders on web THEN Button-Icon SHALL use box-shadow technique to simulate 1px border within 2px reserved space

---

### Requirement 10: Component Tokens

**User Story**: As a token system maintainer, I want button-icon inset padding to use component tokens where semantic tokens are insufficient, so that all three sizes have consistent token-based styling.

#### Acceptance Criteria

1. WHEN Button-Icon renders large size THEN Button-Icon SHALL use `buttonIcon.inset.large` component token (12px, references `space.inset.150`)
2. WHEN Button-Icon renders medium size THEN Button-Icon SHALL use `buttonIcon.inset.medium` component token (10px, unique value)
3. WHEN Button-Icon renders small size THEN Button-Icon SHALL use `buttonIcon.inset.small` component token (8px, references `space.inset.100`)

---

### Requirement 11: No Disabled State

**User Story**: As an accessibility advocate, I want button-icons to not support disabled states, so that users always understand why an action is unavailable through alternative patterns.

#### Acceptance Criteria

1. WHEN Button-Icon is instantiated THEN Button-Icon SHALL NOT accept a `disabled` prop
2. WHEN Button-Icon component documentation is created THEN documentation SHALL explain alternative patterns to disabled states (hide unavailable actions, show validation messaging, use loading states)

---

### Requirement 12: Animation Tokens

**User Story**: As a product designer, I want button-icon state transitions to use consistent animation tokens, so that interactions feel cohesive with other components.

#### Acceptance Criteria

1. WHEN Button-Icon transitions between states (default, hover, pressed) THEN Button-Icon SHALL use `duration150` token for transition duration
2. WHEN Button-Icon animates state transitions THEN Button-Icon SHALL use standard ease-in-out easing

---

### Requirement 13: Icon Component Integration

**User Story**: As a developer, I want button-icons to use the Icon component for icon rendering, so that icons are consistent with the design system and benefit from Icon component features.

#### Acceptance Criteria

1. WHEN Button-Icon renders THEN Button-Icon SHALL use the Icon component internally for icon rendering
2. WHEN Button-Icon accepts `icon` prop THEN Button-Icon SHALL pass icon name to Icon component
3. WHEN Button-Icon renders icon THEN Button-Icon SHALL apply icon size token (`icon.size050`, `icon.size075`, `icon.size100`) based on Button-Icon size variant
4. WHEN Button-Icon renders icon THEN Button-Icon SHALL apply icon color based on Button-Icon variant (see Requirement 2)
5. WHEN Button-Icon renders on web platform THEN Button-Icon SHALL use `<icon-base>` web component
6. WHEN Button-Icon renders on iOS platform THEN Button-Icon SHALL use Icon SwiftUI view
7. WHEN Button-Icon renders on Android platform THEN Button-Icon SHALL use Icon Compose component

---

### Requirement 14: Cross-Platform Consistency

**User Story**: As a product designer, I want button-icons to maintain consistent visual design across all platforms, so that the brand experience remains unified.

#### Acceptance Criteria

1. WHEN Button-Icon renders on any platform THEN Button-Icon SHALL use identical token values for sizing, spacing, and colors
2. WHEN Button-Icon renders on any platform THEN Button-Icon SHALL maintain identical visual proportions (icon size relative to padding)
3. WHEN Button-Icon renders on any platform THEN Button-Icon SHALL follow True Native Architecture with separate platform implementations

---

## Prerequisites

The following prerequisite work must be completed before implementing the Button-Icon Component:

### Prerequisite 1: Token Rename (`color.text.onPrimary` → `color.contrast.onPrimary`)

**Rationale**: "Contrast" is semantically accurate for both text and icons on primary backgrounds, aligns with WCAG terminology, and is future-proof for other element types.

**Changes Required**:
1. Rename token in `SemanticColorTokens.ts`
2. Update CTA button to use `color.contrast.onPrimary`
3. Update Token-Family-Color.md documentation

### Prerequisite 2: New Semantic Token (`color.background.primary.subtle`)

**Rationale**: Secondary button hover state needs a subtle purple tint background. Reusable for selected list items, hover states on cards/containers.

**Changes Required**:
1. Add token to `SemanticColorTokens.ts` (references `purple100`)
2. Update Token-Family-Color.md documentation

### Prerequisite 3: Radius Tokens (`radiusHalf` primitive + `radiusCircle` semantic)

**Rationale**: Token-based circular shape ensures consistency across Button-Icon, Button-Media, avatars, badges, and other circular components.

**Changes Required**:
1. Extend `PrimitiveToken.ts` to add `'%'`, `'shape'`, `'percent'` unit types
2. Add `radiusHalf` primitive token with platform-specific values
3. Add `radiusCircle` semantic token referencing `radiusHalf`
4. Update platform generators to handle new unit types

### Prerequisite 4: Component Tokens (`buttonIcon.inset.*`)

**Rationale**: Medium size (10px) has no semantic equivalent; component tokens provide cohesive family where semantic tokens are insufficient.

**Changes Required**:
1. Create `buttonIcon.inset.large` (references `inset.150`, 12px)
2. Create `buttonIcon.inset.medium` (unique value: 10px)
3. Create `buttonIcon.inset.small` (references `inset.100`, 8px)
