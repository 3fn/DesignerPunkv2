# Requirements Document: Button-Icon Component

**Date**: January 2, 2026
**Spec**: 035 - Button-Icon Component
**Status**: Requirements Phase
**Dependencies**: Icon Component, CTA Button Component, Accessibility Tokens

---

## Introduction

The Button-Icon Component provides a circular, icon-only interactive button for accessible actions without text labels. The component follows the same style matrix as CTA buttons (Primary, Secondary, Tertiary × Small, Medium, Large) while introducing icon-specific accessibility patterns and circular visual treatment.

The component integrates with the mathematical token system for sizing, spacing, and colors, and uses the Icon System (Spec 004) for icon rendering. The component prioritizes accessibility (WCAG 2.1 AA compliance) with required `aria-label` for screen reader support and 48px minimum touch targets.

**Key Architectural Principles**:
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic or primitive tokens (no hard-coded values)
- **Circular shape**: Uses `radiusCircle` semantic token for true circular rendering
- **Accessibility-first**: Required `aria-label`, 48px minimum touch targets, focus ring with buffer
- **Self-contained focus ring**: 4px transparent buffer included in component box model

**Design Decisions** (from design outline):
- No disabled state by design (use alternative patterns)
- Loading state deferred pending animation token system
- Press animations are platform-specific (scale on iOS, ripple on Android, CSS on web)

---

## Glossary

- **Button-Icon**: Circular icon-only button component for actions without text labels
- **Visual Circle**: The visible circular button area (icon + padding)
- **Total Box**: Visual circle plus focus ring buffer (self-contained component size)
- **Focus Ring Buffer**: 4px transparent area on all sides to contain focus ring
- **Touch Target**: Minimum interactive area for touch input (48px × 48px per WCAG 2.1 AA)
- **radiusCircle**: Semantic token for circular shape (references `radiusHalf` primitive)
- **radiusHalf**: Primitive token representing 50% border-radius
- **color.contrast.onPrimary**: Semantic token for content (text/icons) on primary backgrounds

---

## Requirements

### Requirement 1: Size Variants

**User Story**: As a product designer, I want three button-icon size variants (small, medium, large), so that I can use appropriately sized icon buttons for different UI contexts.

#### Acceptance Criteria

1. WHEN the Button-Icon Component is instantiated with size "small" THEN the Button-Icon Component SHALL render with 16px icon, 8px inset padding, 32px visual circle, and 40px total box
2. WHEN the Button-Icon Component is instantiated with size "medium" THEN the Button-Icon Component SHALL render with 20px icon, 10px inset padding, 40px visual circle, and 48px total box
3. WHEN the Button-Icon Component is instantiated with size "large" THEN the Button-Icon Component SHALL render with 24px icon, 12px inset padding, 48px visual circle, and 56px total box
4. WHEN the Button-Icon Component renders any size variant THEN the Button-Icon Component SHALL use `icon.size050` (16px), `icon.size075` (20px), or `icon.size100` (24px) tokens for icon sizing
5. WHEN the Button-Icon Component renders any size variant THEN the Button-Icon Component SHALL include 4px transparent focus ring buffer on all sides

### Requirement 2: Visual Styles

**User Story**: As a product designer, I want three visual button-icon styles (primary, secondary, tertiary), so that I can establish clear visual hierarchy for icon actions.

#### Acceptance Criteria

1. WHEN the Button-Icon Component is instantiated with variant "primary" THEN the Button-Icon Component SHALL render with `color.primary` background and `color.contrast.onPrimary` icon color
2. WHEN the Button-Icon Component is instantiated with variant "secondary" THEN the Button-Icon Component SHALL render with transparent background, `color.primary` border, and `color.primary` icon color
3. WHEN the Button-Icon Component is instantiated with variant "tertiary" THEN the Button-Icon Component SHALL render with transparent background, no border, and `color.primary` icon color
4. WHEN the Button-Icon Component renders any visual style THEN the Button-Icon Component SHALL use only semantic or primitive tokens for all styling properties

### Requirement 3: Circular Shape

**User Story**: As a product designer, I want button-icons to render as perfect circles, so that they are visually distinct from rectangular CTA buttons.

#### Acceptance Criteria

1. WHEN the Button-Icon Component renders THEN the Button-Icon Component SHALL use `radiusCircle` semantic token for border-radius
2. WHEN the Button-Icon Component renders on web platform THEN the Button-Icon Component SHALL output `border-radius: 50%`
3. WHEN the Button-Icon Component renders on iOS platform THEN the Button-Icon Component SHALL use `.clipShape(Circle())`
4. WHEN the Button-Icon Component renders on Android platform THEN the Button-Icon Component SHALL use `CircleShape`
5. WHEN the Button-Icon Component renders THEN the Button-Icon Component SHALL NOT use hard-coded percentage or pixel values for border-radius

### Requirement 4: Component Tokens (Inset Padding)

**User Story**: As a token system maintainer, I want button-icon inset padding to use component tokens where semantic tokens are insufficient, so that all three sizes have consistent token-based styling.

#### Acceptance Criteria

1. WHEN the Button-Icon Component renders large size THEN the Button-Icon Component SHALL use `buttonIcon.inset.large` token (12px, references `inset.150`)
2. WHEN the Button-Icon Component renders medium size THEN the Button-Icon Component SHALL use `buttonIcon.inset.medium` token (10px, unique value)
3. WHEN the Button-Icon Component renders small size THEN the Button-Icon Component SHALL use `buttonIcon.inset.small` token (8px, references `inset.100`)
4. WHEN the Button-Icon Component component tokens are created THEN the component tokens SHALL reference semantic tokens where available (large and small sizes)

### Requirement 5: Accessibility - Screen Reader Support

**User Story**: As a screen reader user, I want button-icons to announce their purpose clearly, so that I understand what action the button performs.

#### Acceptance Criteria

1. WHEN the Button-Icon Component is instantiated THEN the Button-Icon Component SHALL require `ariaLabel` prop
2. WHEN the Button-Icon Component renders on web platform THEN the Button-Icon Component SHALL apply `aria-label` attribute to the button element
3. WHEN the Button-Icon Component renders on iOS platform THEN the Button-Icon Component SHALL apply `.accessibilityLabel()` modifier
4. WHEN the Button-Icon Component renders on Android platform THEN the Button-Icon Component SHALL apply `contentDescription` parameter
5. WHEN the Button-Icon Component renders icon THEN the Button-Icon Component SHALL mark icon as decorative (aria-hidden on web)

### Requirement 6: Touch Target Accessibility

**User Story**: As a mobile user, I want button-icons to meet minimum touch target requirements, so that I can reliably tap buttons on touch devices.

#### Acceptance Criteria

1. WHEN the Button-Icon Component renders large size (56px total box) THEN the Button-Icon Component SHALL use total box as touch target (exceeds 48px minimum)
2. WHEN the Button-Icon Component renders medium size (48px total box) THEN the Button-Icon Component SHALL use total box as touch target (meets 48px minimum)
3. WHEN the Button-Icon Component renders small size (40px total box) THEN the Button-Icon Component SHALL extend touch target to 48px minimum using invisible hit area
4. WHEN the Button-Icon Component extends touch target THEN the Button-Icon Component SHALL maintain visual circle size while providing 48px interactive area
5. WHEN the Button-Icon Component renders THEN the Button-Icon Component SHALL meet WCAG 2.5.5 (Target Size Enhanced) and 2.5.8 (Target Size Minimum)

### Requirement 7: Focus State

**User Story**: As a keyboard user, I want button-icons to show clear focus indicators within a self-contained buffer, so that I can navigate the interface and focus rings don't overlap adjacent elements.

#### Acceptance Criteria

1. WHEN the Button-Icon Component receives keyboard focus THEN the Button-Icon Component SHALL render focus ring using `accessibility.focus.width` and `accessibility.focus.color` tokens
2. WHEN the Button-Icon Component renders focus ring THEN the Button-Icon Component SHALL position ring at `accessibility.focus.offset` from visual circle edge
3. WHEN the Button-Icon Component renders focus ring THEN the Button-Icon Component SHALL contain focus ring within the 4px transparent buffer (no overflow beyond total box)
4. WHEN the Button-Icon Component receives focus via mouse click THEN the Button-Icon Component SHALL NOT render focus ring (focus-visible only)
5. WHEN the Button-Icon Component receives focus via keyboard navigation THEN the Button-Icon Component SHALL render focus ring

### Requirement 8: Hover State

**User Story**: As a user, I want button-icons to show visual feedback on hover, so that I understand the button is interactive.

#### Acceptance Criteria

1. WHEN the Button-Icon Component receives hover interaction on web platform THEN the Button-Icon Component SHALL apply darkened fill using blend tokens
2. WHEN the Button-Icon Component renders primary variant on hover THEN the Button-Icon Component SHALL apply `blend.hoverDarker` overlay to background
3. WHEN the Button-Icon Component renders secondary or tertiary variant on hover THEN the Button-Icon Component SHALL apply subtle fill appearance
4. WHEN the Button-Icon Component renders hover state THEN the Button-Icon Component SHALL maintain circular shape and icon color

### Requirement 9: Pressed State

**User Story**: As a user, I want button-icons to show visual feedback when pressed, so that I receive confirmation of my interaction.

#### Acceptance Criteria

1. WHEN the Button-Icon Component receives press interaction THEN the Button-Icon Component SHALL apply `blend.pressedDarker` overlay
2. WHEN the Button-Icon Component renders pressed state THEN the Button-Icon Component SHALL maintain circular shape and icon color
3. WHEN the Button-Icon Component renders on iOS platform THEN the Button-Icon Component SHALL apply scale transform (0.97) as platform-specific press feedback
4. WHEN the Button-Icon Component renders on Android platform THEN the Button-Icon Component SHALL apply Material ripple effect as platform-specific press feedback

### Requirement 10: Icon Color

**User Story**: As a product designer, I want button-icon colors to follow the same patterns as CTA button text colors, so that icon buttons are visually consistent with text buttons.

#### Acceptance Criteria

1. WHEN the Button-Icon Component renders primary variant THEN the Button-Icon Component SHALL use `color.contrast.onPrimary` for icon color
2. WHEN the Button-Icon Component renders secondary variant THEN the Button-Icon Component SHALL use `color.primary` for icon color
3. WHEN the Button-Icon Component renders tertiary variant THEN the Button-Icon Component SHALL use `color.primary` for icon color
4. WHEN the Button-Icon Component renders hover or pressed state THEN the Button-Icon Component SHALL maintain icon color while applying background blend

### Requirement 11: No Disabled State

**User Story**: As an accessibility advocate, I want button-icons to not support disabled states, so that users always understand why an action is unavailable through alternative patterns.

#### Acceptance Criteria

1. WHEN the Button-Icon Component is instantiated THEN the Button-Icon Component SHALL NOT accept a `disabled` prop
2. WHEN an action is unavailable THEN the consuming application SHALL hide the button or show validation messaging on interaction
3. WHEN the Button-Icon Component documentation is created THEN the documentation SHALL explain alternative patterns to disabled states

### Requirement 12: Cross-Platform Consistency

**User Story**: As a product designer, I want button-icons to maintain consistent visual design across all platforms, so that the brand experience remains unified.

#### Acceptance Criteria

1. WHEN the Button-Icon Component renders on any platform THEN the Button-Icon Component SHALL use identical token values for sizing, spacing, and colors
2. WHEN the Button-Icon Component renders on any platform THEN the Button-Icon Component SHALL maintain identical visual proportions (icon size, padding, visual circle diameter)
3. WHEN the Button-Icon Component renders on any platform THEN the Button-Icon Component SHALL use platform-specific implementations for press feedback while maintaining visual consistency
4. WHEN the Button-Icon Component renders on any platform THEN the Button-Icon Component SHALL follow True Native Architecture with separate platform implementations

---

## Prerequisites

The following prerequisite work must be completed before implementing the Button-Icon Component:

### Prerequisite 1: Token Rename (`color.text.onPrimary` → `color.contrast.onPrimary`)

**Rationale**: "Contrast" is semantically accurate for both text and icons on primary backgrounds, aligns with WCAG terminology, and is future-proof for other element types.

**Changes Required**:
1. Rename token in semantic color tokens
2. Update CTA button to use `color.contrast.onPrimary`
3. Update documentation

**Estimated Effort**: ~30 minutes

### Prerequisite 2: New Tokens (`radiusHalf` primitive + `radiusCircle` semantic)

**Rationale**: Token-based circular shape ensures consistency across Button-Icon, Button-Media, avatars, badges, and other circular components.

**Changes Required**:
1. Extend `PrimitiveToken.ts` to add `'%'`, `'shape'`, `'percent'` unit types
2. Add `radiusHalf` primitive token with platform-specific values
3. Add `radiusCircle` semantic token referencing `radiusHalf`
4. Update platform generators to handle new unit types
5. Add tests

**Estimated Effort**: 2-4 hours

### Prerequisite 3: Component Tokens (`buttonIcon.inset.*`)

**Rationale**: Medium size (10px) has no semantic equivalent; component tokens provide cohesive family where semantic tokens are insufficient.

**Changes Required**:
1. Create `buttonIcon.inset.large` (references `inset.150`)
2. Create `buttonIcon.inset.medium` (unique value: 10px)
3. Create `buttonIcon.inset.small` (references `inset.100`)

**Estimated Effort**: ~30 minutes

---

## Architecture

### Component Structure

The Button-Icon Component follows the True Native Architecture pattern established by the Icon and CTA Button components.

#### Directory Structure

```
src/components/core/ButtonIcon/
├── README.md                      # Component documentation
├── types.ts                       # Shared TypeScript interfaces
├── __tests__/                     # Cross-platform tests
├── examples/                      # Usage examples
└── platforms/                     # Platform-specific implementations
    ├── web/
    │   ├── ButtonIcon.web.ts     # Web implementation (Vanilla Web Component)
    │   └── ButtonIcon.web.css    # Web component styles
    ├── ios/
    │   └── ButtonIcon.ios.swift  # iOS implementation (SwiftUI)
    └── android/
        └── ButtonIcon.android.kt # Android implementation (Jetpack Compose)
```

#### Shared Type Definitions

```typescript
// types.ts - Platform-agnostic interfaces

export type ButtonIconSize = 'small' | 'medium' | 'large';
export type ButtonIconVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonIconProps {
  /** Icon to display (from Icon System) */
  icon: IconName;
  
  /** Accessible label for screen readers (required) */
  ariaLabel: string;
  
  /** Button size variant */
  size: ButtonIconSize;
  
  /** Button visual style */
  variant: ButtonIconVariant;
  
  /** Click/tap handler */
  onPress: () => void;
  
  /** Optional test ID */
  testID?: string;
}
```

### Token Integration

The Button-Icon Component consumes tokens from the mathematical token system:

**Semantic Tokens (Direct Usage)**:
- `icon.size050`, `icon.size075`, `icon.size100` - Icon sizing
- `accessibility.focus.offset`, `accessibility.focus.width`, `accessibility.focus.color` - Focus ring
- `radiusCircle` - Circular shape
- `color.primary`, `color.contrast.onPrimary` - Colors
- `blend.hoverDarker`, `blend.pressedDarker` - State overlays

**Component Tokens (New)**:
- `buttonIcon.inset.large` (12px) - Large size padding
- `buttonIcon.inset.medium` (10px) - Medium size padding
- `buttonIcon.inset.small` (8px) - Small size padding

---

## Dependencies

### Icon Component
**Status**: ✅ Available
**Usage**: Icon rendering within button

### CTA Button Component
**Status**: ✅ Available
**Usage**: Pattern reference for style matrix, state behavior, platform implementations

### Accessibility Tokens
**Status**: ✅ Available
**Usage**: Focus ring tokens (`accessibility.focus.*`)

---

*This requirements document provides comprehensive EARS-format requirements with acceptance criteria, prerequisite work, and architectural guidance for the Button-Icon Component implementation.*
