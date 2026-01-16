# Requirements Document: Avatar Component

**Date**: January 16, 2026
**Spec**: 042 - Avatar Component
**Status**: Requirements Phase
**Dependencies**: Icon Component (Spec 004), Spacing Tokens, Border Tokens, Opacity Tokens, Motion Tokens

---

## Introduction

Avatar is a visual representation component for users (Human) and AI agents (Agent) with distinct shape-based differentiation. Human avatars render as circles (organic, natural), while AI agent avatars render as hexagons (synthetic, constructed). This shape-based distinction provides instant visual recognition without relying on color alone, improving accessibility.

The component supports six sizes derived from the spacing token system, icon-only content (no initials in v1), and optional hover visual feedback for interactive contexts. Human avatars can display profile images, while AI agent avatars use solid color backgrounds only.

**Key Architectural Principles**:
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic, primitive, or component tokens (no hard-coded values)
- **Shape-based entity differentiation**: Circle = Human, Hexagon = AI Agent
- **Wrapper-delegated interaction**: Avatar provides visual feedback only; actual interaction handling is the wrapper's responsibility
- **Accessibility-first**: Shape differentiation doesn't rely on color alone

**Design Decisions** (from design-outline):
- Pointy-top hexagon orientation for dynamic, crystalline feel
- SVG clipPath approach for rounded hexagon corners (web)
- Icons only (no initials support in v1)
- Single background color per type (no multi-color options)
- Interactive prop enables hover visual only (no onPress prop)
- Focus ring and touch targets are wrapper's responsibility

---

## Glossary

- **Avatar**: Visual representation component for users or AI agents
- **Human Avatar**: Circle-shaped avatar for representing human users
- **Agent Avatar**: Hexagon-shaped avatar for representing AI agents
- **Pointy-top Hexagon**: Regular hexagon with vertex at top (height > width)
- **Hexagon Aspect Ratio**: `cos(30°) ≈ 0.866` (width = height × 0.866)
- **Interactive Avatar**: Avatar with `interactive` prop that shows hover visual feedback
- **Wrapper**: Parent element (button, link) that handles actual click/tap interaction
- **Ana Tudor Technique**: SVG clipPath method using polygon + circles at vertices to create rounded polygon corners; well-supported across browsers and responsive via `clipPathUnits="objectBoundingBox"`
- **Decorative Avatar**: Avatar marked as `aria-hidden="true"` via `decorative` prop, hidden from screen readers when visual-only (e.g., adjacent to name text)

---

## Requirements

### Requirement 1: Entity Type Differentiation

**User Story**: As a user, I want to instantly distinguish between human users and AI agents by avatar shape, so that I understand who or what I'm interacting with.

#### Acceptance Criteria

1. WHEN Avatar is instantiated with type "human" THEN Avatar SHALL render as a perfect circle (border-radius: 50%)
2. WHEN Avatar is instantiated with type "agent" THEN Avatar SHALL render as a regular hexagon with pointy-top orientation
3. WHEN Avatar renders agent type THEN Avatar SHALL use hexagon aspect ratio of `cos(30°) ≈ 0.866` (width = height × 0.866)
4. WHEN Avatar renders agent type THEN Avatar SHALL apply rounded corners to hexagon vertices
5. WHEN Avatar type prop is omitted THEN Avatar SHALL default to "human" type

---

### Requirement 2: Size Variants

**User Story**: As a product designer, I want six avatar size variants, so that I can use appropriately sized avatars for different UI contexts from inline mentions to hero profiles.

#### Acceptance Criteria

1. WHEN Avatar is instantiated with size "xs" THEN Avatar SHALL render at height using `avatar.size.xs` component token
2. WHEN Avatar is instantiated with size "sm" THEN Avatar SHALL render at height using `avatar.size.sm` component token
3. WHEN Avatar is instantiated with size "md" THEN Avatar SHALL render at height using `avatar.size.md` component token
4. WHEN Avatar is instantiated with size "lg" THEN Avatar SHALL render at height using `avatar.size.lg` component token
5. WHEN Avatar is instantiated with size "xl" THEN Avatar SHALL render at height using `avatar.size.xl` component token
6. WHEN Avatar is instantiated with size "xxl" THEN Avatar SHALL render at height using `avatar.size.xxl` component token
7. WHEN Avatar size prop is omitted THEN Avatar SHALL default to "md" size

---

### Requirement 3: Icon Content and Sizing

**User Story**: As a product designer, I want avatar icons to scale proportionally with avatar size at a 50% ratio, so that icons maintain consistent optical balance across all sizes.

#### Acceptance Criteria

1. WHEN Avatar renders xs size THEN Avatar SHALL render icon using `avatar.icon.size.xs` component token
2. WHEN Avatar renders sm size THEN Avatar SHALL render icon using `icon.size050` token
3. WHEN Avatar renders md size THEN Avatar SHALL render icon using `icon.size075` token
4. WHEN Avatar renders lg size THEN Avatar SHALL render icon using `icon.size100` token
5. WHEN Avatar renders xl size THEN Avatar SHALL render icon using `icon.size500` token
6. WHEN Avatar renders xxl size THEN Avatar SHALL render icon using `avatar.icon.size.xxl` component token
7. WHEN Avatar renders human type without image THEN Avatar SHALL display generic person icon placeholder
8. WHEN Avatar renders agent type THEN Avatar SHALL display generic bot/AI icon placeholder

---

### Requirement 4: Background Colors

**User Story**: As a product designer, I want distinct background colors for human and agent avatars, so that color reinforces the shape-based entity differentiation.

#### Acceptance Criteria

1. WHEN Avatar renders human type without image THEN Avatar SHALL use `color.avatar.human` semantic token for background
2. WHEN Avatar renders agent type THEN Avatar SHALL use `color.avatar.agent` semantic token for background
3. WHEN Avatar renders human type with valid image THEN Avatar SHALL display the image instead of background color

---

### Requirement 5: Image Support (Human Only)

**User Story**: As a user, I want to display my profile photo in my avatar, so that others can recognize me visually.

#### Acceptance Criteria

1. WHEN Avatar human type receives `src` prop with valid image URL THEN Avatar SHALL display the image
2. WHEN Avatar displays image THEN Avatar SHALL use `object-fit: cover` (web), `.scaledToFill()` (iOS), `ContentScale.Crop` (Android)
3. WHEN Avatar displays image THEN Avatar SHALL clip image to circle shape
4. WHEN Avatar human type receives `src` prop THEN Avatar SHALL require `alt` prop for accessibility
5. WHEN Avatar agent type receives `src` prop THEN Avatar SHALL ignore the prop (agents don't support images)
6. WHEN Avatar human type image fails to load THEN Avatar SHALL fall back to icon placeholder

---

### Requirement 6: Icon Colors

**User Story**: As a product designer, I want avatar icons to have appropriate contrast against their backgrounds, so that icons are clearly visible.

#### Acceptance Criteria

1. WHEN Avatar renders human type icon THEN Avatar SHALL use `color.avatar.contrast.onHuman` semantic token
2. WHEN Avatar renders agent type icon THEN Avatar SHALL use `color.avatar.contrast.onAgent` semantic token

---

### Requirement 7: Border Styles

**User Story**: As a product designer, I want avatars to have subtle borders using border tokens that scale appropriately for hero sizes, so that avatars have clear visual definition.

#### Acceptance Criteria

1. WHEN Avatar renders xs through xl sizes THEN Avatar SHALL apply `borderDefault` border width token
2. WHEN Avatar renders xs through xl sizes THEN Avatar SHALL apply `color.avatar.border` semantic token with `opacity.heavy` token
3. WHEN Avatar renders xxl size THEN Avatar SHALL apply `borderEmphasis` border width token
4. WHEN Avatar renders xxl size THEN Avatar SHALL apply `color.contrast.onSurface` token for border color with full opacity

---

### Requirement 8: Interactive Hover State

**User Story**: As a user, I want interactive avatars to show visual feedback on hover, so that I understand the avatar is clickable.

#### Acceptance Criteria

1. WHEN Avatar receives `interactive` prop as true AND receives hover THEN Avatar SHALL increase border width from `borderDefault` to `borderEmphasis` token
2. WHEN Avatar transitions between hover states THEN Avatar SHALL use `motion.duration.fast` token for transition
3. WHEN Avatar does not have `interactive` prop THEN Avatar SHALL NOT show hover visual feedback
4. WHEN Avatar `interactive` prop is omitted THEN Avatar SHALL default to false (non-interactive)

---

### Requirement 9: Accessibility - Screen Reader Support

**User Story**: As a screen reader user, I want avatars to be properly announced or hidden based on context, so that I receive appropriate information.

#### Acceptance Criteria

1. WHEN Avatar renders with image THEN Avatar SHALL apply `alt` text to image for screen reader announcement
2. WHEN Avatar receives `decorative` prop as true THEN Avatar SHALL apply `aria-hidden="true"` to hide from screen readers
3. WHEN Avatar `decorative` prop is omitted THEN Avatar SHALL default to false (announced to screen readers)
4. WHEN Avatar renders within interactive wrapper THEN wrapper SHALL provide accessible name (not avatar)

---

### Requirement 10: Wrapper-Delegated Interaction

**User Story**: As a developer, I want avatar interaction handling to be the wrapper's responsibility, so that avatars remain simple visual components while wrappers handle accessibility.

#### Acceptance Criteria

1. WHEN Avatar component is defined THEN Avatar SHALL NOT include `onPress` or `onClick` prop
2. WHEN Avatar is used in interactive context THEN wrapper element (button, link) SHALL handle click/tap events
3. WHEN Avatar is used in interactive context THEN wrapper element SHALL provide focus ring
4. WHEN Avatar is used in interactive context THEN wrapper element SHALL provide minimum 44px touch target

---


### Requirement 11: Hexagon Implementation (Web)

**User Story**: As a web developer, I want the hexagon shape to be implemented using SVG clipPath with rounded corners, so that the shape renders consistently across browsers.

#### Acceptance Criteria

1. WHEN Avatar renders agent type on web THEN Avatar SHALL use SVG `<clipPath>` with `clipPathUnits="objectBoundingBox"`
2. WHEN Avatar renders agent hexagon THEN Avatar SHALL apply rounded corners using circles at vertices (Ana Tudor technique)
3. WHEN Avatar renders agent hexagon THEN Avatar SHALL use pointy-top orientation (vertex at top)
4. WHEN Avatar renders agent hexagon THEN Avatar SHALL maintain aspect ratio of `cos(30°) ≈ 0.866`

---

### Requirement 12: Hexagon Implementation (iOS)

**User Story**: As an iOS developer, I want the hexagon shape to be implemented using native SwiftUI shapes, so that the component follows True Native Architecture.

#### Acceptance Criteria

1. WHEN Avatar renders agent type on iOS THEN Avatar SHALL use custom `RoundedPointyTopHexagon` Shape
2. WHEN Avatar renders agent hexagon on iOS THEN Avatar SHALL use `addArc` for rounded vertices
3. WHEN Avatar renders agent hexagon on iOS THEN Avatar SHALL apply `.clipShape()` modifier

---

### Requirement 13: Hexagon Implementation (Android)

**User Story**: As an Android developer, I want the hexagon shape to be implemented using native Compose shapes, so that the component follows True Native Architecture.

#### Acceptance Criteria

1. WHEN Avatar renders agent type on Android THEN Avatar SHALL use custom `GenericShape` with hexagon path
2. WHEN Avatar renders agent hexagon on Android THEN Avatar SHALL use `quadraticBezierTo` for rounded vertices
3. WHEN Avatar renders agent hexagon on Android THEN Avatar SHALL apply `Modifier.clip()` with custom shape

---

### Requirement 14: Cross-Platform Consistency

**User Story**: As a product designer, I want avatars to maintain consistent visual design across all platforms, so that the brand experience remains unified.

#### Acceptance Criteria

1. WHEN Avatar renders on any platform THEN Avatar SHALL use identical token values for sizing, colors, and borders
2. WHEN Avatar renders on any platform THEN Avatar SHALL maintain identical visual proportions (icon size relative to avatar size)
3. WHEN Avatar renders on any platform THEN Avatar SHALL follow True Native Architecture with separate platform implementations

---

### Requirement 15: Icon Component Integration

**User Story**: As a developer, I want avatars to use the Icon component for icon rendering, so that icons are consistent with the design system.

#### Acceptance Criteria

1. WHEN Avatar renders icon THEN Avatar SHALL use the Icon component internally
2. WHEN Avatar renders on web platform THEN Avatar SHALL use `<icon-base>` web component
3. WHEN Avatar renders on iOS platform THEN Avatar SHALL use Icon SwiftUI view
4. WHEN Avatar renders on Android platform THEN Avatar SHALL use Icon Compose component

---

### Requirement 16: Test Infrastructure

**User Story**: As a developer, I want avatars to support automated testing, so that I can write reliable tests following Test Development Standards.

#### Acceptance Criteria

1. WHEN Avatar receives `testID` prop THEN Avatar SHALL apply the value as test identifier (`data-testid` on web, `accessibilityIdentifier` on iOS, `testTag` on Android)
2. WHEN Avatar `testID` prop is omitted THEN Avatar SHALL NOT apply any test identifier
3. WHEN Avatar tests are written THEN tests SHALL follow Test Development Standards (query via MCP)

---

### Requirement 17: Component Documentation

**User Story**: As a developer, I want comprehensive README documentation for the Avatar component, so that I can understand how to use it correctly and integrate it into my application.

#### Acceptance Criteria

1. WHEN Avatar component is implemented THEN Avatar SHALL include README.md in the component directory
2. WHEN README is created THEN README SHALL document all props with types and descriptions
3. WHEN README is created THEN README SHALL include usage examples for common scenarios (human, agent, interactive, with image)
4. WHEN README is created THEN README SHALL document token consumption (which tokens the component uses)
5. WHEN README is created THEN README SHALL include platform-specific implementation notes
6. WHEN README is created THEN README SHALL document accessibility considerations and usage patterns
7. WHEN README is created THEN README SHALL reference the design-outline for architectural decisions

---

## Prerequisites

The following prerequisite work must be completed before implementing the Avatar Component:

### Prerequisite 1: New Semantic Color Tokens (5 tokens)

**Rationale**: Avatar-specific colors for backgrounds, icon contrast, and borders enable consistent styling and future flexibility.

**Changes Required**:
1. Add `color.avatar.human` semantic token (references `orange300` primitive)
2. Add `color.avatar.agent` semantic token (references `teal300` primitive)
3. Add `color.avatar.contrast.onHuman` semantic token (references `white100` primitive)
4. Add `color.avatar.contrast.onAgent` semantic token (references `white100` primitive)
5. Add `color.avatar.border` semantic token (references `gray100` primitive)

### Prerequisite 2: New Component Tokens (2 tokens for icon sizing gaps)

**Rationale**: Icon sizes at xs and xxl have no existing icon tokens; component tokens fill these gaps while maintaining 50% ratio.

**Changes Required**:
1. Create `avatar.icon.size.xs` component token (derivation: `SPACING_BASE_VALUE * 1.5`)
2. Create `avatar.icon.size.xxl` component token (derivation: `SPACING_BASE_VALUE * 8`)

### Prerequisite 3: Avatar Size Component Tokens (6 tokens)

**Rationale**: Avatar sizes need component tokens that reference spacing tokens or calculated values for consistent sizing.

**Changes Required**:
1. Create `avatar.size.xs` (references `space300` spacing token)
2. Create `avatar.size.sm` (references `space400` spacing token)
3. Create `avatar.size.md` (references `space500` spacing token)
4. Create `avatar.size.lg` (references `space600` spacing token)
5. Create `avatar.size.xl` (derivation: `SPACING_BASE_VALUE * 10`)
6. Create `avatar.size.xxl` (derivation: `SPACING_BASE_VALUE * 16`)

---

## Future Enhancements (Out of Scope for v1)

The following features are explicitly out of scope for this spec and will be addressed in separate future specs:

1. **Avatar-Group**: Stacked avatars with overlap and "+N" indicator
2. **Status Indicators**: Online, offline, busy, away badges
3. **Initials Support**: Text content as alternative to icons
4. **Multi-color Human Backgrounds**: Expanded color palette options
5. **Custom Icons**: User-specified icons instead of defaults
