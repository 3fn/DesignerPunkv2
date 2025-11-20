# Requirements Document: CTA Button Component

**Date**: November 19, 2025
**Spec**: 005 - CTA Button Component
**Status**: Requirements Phase
**Dependencies**: Spec 004 (Icon System), Spec 006 (Icon Size Tokens)

---

## Introduction

The CTA Button Component provides a cross-platform call-to-action button with three size variants, three visual styles, and comprehensive interaction states. The component follows True Native Architecture with build-time platform separation for web, iOS, and Android, ensuring optimal performance and platform-native user experience.

The button integrates with the mathematical token system for sizing, spacing, typography, and colors, and supports optional leading icons with automatic optical weight compensation. The component prioritizes accessibility (WCAG 2.1 AA compliance) and provides consistent visual design across all platforms while respecting platform-specific interaction patterns.

**Key Architectural Principles**:
- **True Native Architecture**: Separate implementations per platform (web, iOS, Android)
- **Token-based design**: All styling uses semantic or primitive tokens (no hard-coded values)
- **Mathematical foundation**: Sizing follows 8px baseline grid with strategic flexibility
- **Accessibility-first**: WCAG 2.1 AA compliance for touch targets, color contrast, keyboard navigation
- **Optical balance**: Icon-text pairing uses blend tokens for visual weight compensation

---

## Glossary

- **Button Component**: Cross-platform UI component for user actions and navigation
- **CTA (Call-to-Action)**: Primary user action button (submit, continue, purchase, etc.)
- **True Native Architecture**: Build-time platform separation with platform-specific implementations
- **Semantic Token**: Token with contextual meaning that references primitive tokens
- **Blend Token**: Token for color modification operations (lighter, darker, saturate, desaturate)
- **Optical Weight Compensation**: Visual adjustment where icons are lightened to balance with text
- **Baseline Grid**: 8px vertical rhythm system for component height alignment
- **Touch Target**: Minimum interactive area for touch input (44px × 44px per WCAG 2.1 AA)
- **Icon Size Token**: Semantic token calculated via formula (fontSize × lineHeight)

---

## Requirements

### Requirement 1: Size Variants

**User Story**: As a product designer, I want three button size variants (small, medium, large), so that I can use appropriately sized buttons for different UI contexts and hierarchies.

#### Acceptance Criteria

1. WHEN the Button Component is instantiated with size "small" THEN the Button Component SHALL render with 40px total height
2. WHEN the Button Component is instantiated with size "medium" THEN the Button Component SHALL render with 48px total height
3. WHEN the Button Component is instantiated with size "large" THEN the Button Component SHALL render with 56px total height
4. WHEN the Button Component renders any size variant THEN the Button Component SHALL align the total height to the 8px baseline grid
5. WHEN the Button Component renders small size THEN the Button Component SHALL use typography.bodyMd for text styling
6. WHEN the Button Component renders medium size THEN the Button Component SHALL use typography.bodyMd for text styling
7. WHEN the Button Component renders large size THEN the Button Component SHALL use typography.bodyLg for text styling

### Requirement 2: Visual Styles

**User Story**: As a product designer, I want three visual button styles (primary, secondary, tertiary), so that I can establish clear visual hierarchy and distinguish between primary and secondary actions.

#### Acceptance Criteria

1. WHEN the Button Component is instantiated with style "primary" THEN the Button Component SHALL render with color.primary background and color.text.onPrimary text color
2. WHEN the Button Component is instantiated with style "secondary" THEN the Button Component SHALL render with color.background background, color.primary text color, and border.default border with color.primary border color
3. WHEN the Button Component is instantiated with style "tertiary" THEN the Button Component SHALL render with transparent background and color.primary text color
4. WHEN the Button Component renders any visual style THEN the Button Component SHALL use only semantic or primitive tokens for all styling properties

### Requirement 3: Horizontal Padding

**User Story**: As a product designer, I want button horizontal padding to follow a consistent mathematical relationship with button height, so that buttons maintain balanced visual proportions across all sizes.

#### Acceptance Criteria

1. WHEN the Button Component renders small size THEN the Button Component SHALL use space.inset.spacious (16px) for horizontal padding
2. WHEN the Button Component renders medium size THEN the Button Component SHALL use space.inset.expansive (24px) for horizontal padding
3. WHEN the Button Component renders large size THEN the Button Component SHALL use space.inset.generous (32px) for horizontal padding
4. WHEN the Button Component renders any size THEN the Button Component SHALL maintain approximately 2:1 ratio between horizontal padding and button height

### Requirement 4: Vertical Padding

**User Story**: As a product designer, I want button vertical padding to be calculated from typography line height, so that button height aligns to the 8px baseline grid.

#### Acceptance Criteria

1. WHEN the Button Component renders small size THEN the Button Component SHALL use space.inset.normal (8px) for vertical padding
2. WHEN the Button Component renders medium size THEN the Button Component SHALL use space.inset.comfortable (12px) for vertical padding
3. WHEN the Button Component renders large size THEN the Button Component SHALL use space.inset.comfortable (12px) for vertical padding
4. WHEN the Button Component calculates vertical padding THEN the Button Component SHALL use formula: (Target Height - Line Height rendered) / 2

### Requirement 5: Border Radius

**User Story**: As a product designer, I want button border radius to scale proportionally with button size, so that larger buttons have appropriately larger corner radius.

#### Acceptance Criteria

1. WHEN the Button Component renders small size THEN the Button Component SHALL use radius100 (8px) for border radius
2. WHEN the Button Component renders medium size THEN the Button Component SHALL use radius150 (12px) for border radius
3. WHEN the Button Component renders large size THEN the Button Component SHALL use radius200 (16px) for border radius

### Requirement 6: Minimum Width

**User Story**: As a product designer, I want buttons to have a minimum width that prevents awkwardly narrow buttons, so that buttons with short text maintain balanced proportions.

#### Acceptance Criteria

1. WHEN the Button Component renders small size THEN the Button Component SHALL enforce minimum width of 56px
2. WHEN the Button Component renders medium size THEN the Button Component SHALL enforce minimum width of 72px
3. WHEN the Button Component renders large size THEN the Button Component SHALL enforce minimum width of 80px
4. WHEN the Button Component calculates minimum width THEN the Button Component SHALL use formula: minWidth = height + (2 × verticalPadding per side)

### Requirement 7: Text Wrapping

**User Story**: As a product designer, I want button text to wrap when it exceeds button width, so that long text or translations remain fully visible and accessible.

#### Acceptance Criteria

1. WHEN the Button Component renders with text exceeding button width THEN the Button Component SHALL allow text to wrap to multiple lines
2. WHEN the Button Component text wraps THEN the Button Component SHALL grow height to accommodate wrapped text while maintaining minimum height
3. WHEN the Button Component is instantiated with noWrap prop THEN the Button Component SHALL truncate text with ellipsis instead of wrapping
4. WHEN the Button Component renders text THEN the Button Component SHALL center-align text horizontally within button

### Requirement 8: Icon Support

**User Story**: As a product designer, I want to add optional leading icons to buttons, so that I can enhance button meaning with visual indicators.

#### Acceptance Criteria

1. WHEN the Button Component is instantiated with icon prop THEN the Button Component SHALL render icon in leading position (left of text)
2. WHEN the Button Component renders small or medium size with icon THEN the Button Component SHALL use icon.size100 (24px) for icon size
3. WHEN the Button Component renders large size with icon THEN the Button Component SHALL use icon.size125 (32px) for icon size
4. WHEN the Button Component renders small size with icon THEN the Button Component SHALL use space.grouped.tight (4px) for icon-text spacing
5. WHEN the Button Component renders medium or large size with icon THEN the Button Component SHALL use space.grouped.normal (8px) for icon-text spacing
6. WHEN the Button Component renders icon THEN the Button Component SHALL center icon vertically to button height (not text baseline)

### Requirement 9: Icon Color Inheritance

**User Story**: As a product designer, I want button icons to automatically inherit button text color, so that icon and text colors remain consistent without manual specification.

#### Acceptance Criteria

1. WHEN the Button Component renders primary style with icon THEN the Button Component SHALL apply color.text.onPrimary to icon
2. WHEN the Button Component renders secondary or tertiary style with icon THEN the Button Component SHALL apply color.primary to icon with color.icon.opticalBalance blend adjustment
3. WHEN the Button Component renders icon THEN the Button Component SHALL use Icon component with optional color parameter for optical weight compensation as documented in Icon System (Spec 004)

### Requirement 10: Hover State

**User Story**: As a product designer, I want buttons to show visual feedback on hover, so that users understand the button is interactive.

#### Acceptance Criteria

1. WHEN the Button Component receives hover interaction on web platform THEN the Button Component SHALL apply opacity.hover (8% opacity overlay)
2. WHEN the Button Component receives hover interaction on iOS or Android THEN the Button Component SHALL use platform-native touch feedback
3. WHEN the Button Component renders hover state THEN the Button Component SHALL maintain all other visual properties unchanged

### Requirement 11: Pressed State

**User Story**: As a product designer, I want buttons to show visual feedback when pressed, so that users receive confirmation of their interaction.

#### Acceptance Criteria

1. WHEN the Button Component receives press interaction THEN the Button Component SHALL apply opacity.pressed (16% opacity overlay)
2. WHEN the Button Component renders pressed state on all platforms THEN the Button Component SHALL use consistent opacity overlay approach
3. WHEN the Button Component renders pressed state THEN the Button Component SHALL maintain all other visual properties unchanged

### Requirement 12: Focus State

**User Story**: As a keyboard user, I want buttons to show clear focus indicators, so that I can navigate the interface using keyboard controls.

#### Acceptance Criteria

1. WHEN the Button Component receives keyboard focus THEN the Button Component SHALL render outline with border.emphasis (2px) width and color.primary color
2. WHEN the Button Component renders focus outline THEN the Button Component SHALL position outline accessibility.focus.offset outside button bounds (Note: Token defined in Spec 007 - Accessibility Token Family)
3. WHEN the Button Component renders focus outline THEN the Button Component SHALL apply shadow.hover for additional depth
4. WHEN the Button Component renders focus outline THEN the Button Component SHALL calculate outline radius as button radius + accessibility.focus.offset
5. WHEN the Button Component receives focus via mouse click THEN the Button Component SHALL NOT render focus outline (focus-visible only)
6. WHEN the Button Component receives focus via keyboard navigation THEN the Button Component SHALL render focus outline

### Requirement 13: Touch Target Accessibility

**User Story**: As a mobile user, I want buttons to meet minimum touch target requirements, so that I can reliably tap buttons on touch devices.

#### Acceptance Criteria

1. WHEN the Button Component renders small size (40px) on iOS or Android THEN the Button Component SHALL extend touch target to 44px height using tapAreaMinimum token
2. WHEN the Button Component renders medium size (48px) or large size (56px) THEN the Button Component SHALL use visual height as touch target (meets 44px minimum)
3. WHEN the Button Component extends touch target THEN the Button Component SHALL maintain 40px visual height while providing 44px interactive area
4. WHEN the Button Component extends touch target THEN the Button Component SHALL use platform-specific implementation (frame modifier on iOS, clickable area on Android)

### Requirement 14: Color Contrast Accessibility

**User Story**: As a user with visual impairments, I want button text and backgrounds to meet WCAG 2.1 AA color contrast requirements, so that I can read button labels clearly.

#### Acceptance Criteria

1. WHEN the Button Component renders primary style THEN the Button Component SHALL achieve minimum 4.5:1 contrast ratio between color.text.onPrimary and color.primary
2. WHEN the Button Component renders secondary style THEN the Button Component SHALL achieve minimum 4.5:1 contrast ratio between color.primary text and color.background
3. WHEN the Button Component renders tertiary style THEN the Button Component SHALL achieve minimum 4.5:1 contrast ratio between color.primary text and transparent background
4. WHEN the Button Component renders focus outline THEN the Button Component SHALL achieve minimum 3:1 contrast ratio between color.primary outline and any background

### Requirement 15: Keyboard Navigation

**User Story**: As a keyboard user, I want to navigate and activate buttons using standard keyboard controls, so that I can interact with the interface without a mouse.

#### Acceptance Criteria

1. WHEN the Button Component receives Tab key THEN the Button Component SHALL receive focus and display focus indicator
2. WHEN the Button Component has focus and receives Enter key THEN the Button Component SHALL activate button action
3. WHEN the Button Component has focus and receives Space key THEN the Button Component SHALL activate button action
4. WHEN the Button Component renders on web platform THEN the Button Component SHALL use semantic button element for native keyboard support

### Requirement 16: Screen Reader Accessibility

**User Story**: As a screen reader user, I want buttons to announce their purpose clearly, so that I understand what action the button performs.

#### Acceptance Criteria

1. WHEN the Button Component renders on web platform THEN the Button Component SHALL use semantic button element with button role
2. WHEN the Button Component renders with icon and text THEN the Button Component SHALL use button text as accessible label
3. WHEN the Button Component renders icon THEN the Button Component SHALL mark icon as decorative (aria-hidden on web, accessibilityHidden on iOS, contentDescription null on Android)
4. WHEN the Button Component renders on iOS THEN the Button Component SHALL support Dynamic Type for text size preferences
5. WHEN the Button Component renders on Android THEN the Button Component SHALL support TalkBack screen reader

### Requirement 17: Platform-Specific Interaction Patterns

**User Story**: As a platform user, I want buttons to follow platform-native interaction patterns, so that buttons feel natural and familiar on each platform.

#### Acceptance Criteria

1. WHEN the Button Component renders on web platform THEN the Button Component SHALL apply cursor pointer on hover
2. WHEN the Button Component renders on iOS platform THEN the Button Component SHALL apply scale transform to 0.97 (97%) on press with 100ms ease-out animation
3. WHEN the Button Component renders on Android platform THEN the Button Component SHALL apply Material ripple effect on press with color.primary at 16% opacity
4. WHEN the Button Component renders on iOS platform THEN the Button Component SHALL respect safe area insets for full-width buttons
5. WHEN the Button Component renders on iOS platform THEN the Button Component SHALL render border inside frame bounds

### Requirement 18: Cross-Platform Consistency

**User Story**: As a product designer, I want buttons to maintain consistent visual design across all platforms, so that the brand experience remains unified.

#### Acceptance Criteria

1. WHEN the Button Component renders on any platform THEN the Button Component SHALL use identical token values for sizing, spacing, typography, and colors
2. WHEN the Button Component renders on any platform THEN the Button Component SHALL maintain identical visual proportions (height, padding ratios, border radius)
3. WHEN the Button Component renders on any platform THEN the Button Component SHALL use platform-specific implementations for interaction states while maintaining visual consistency
4. WHEN the Button Component renders on any platform THEN the Button Component SHALL follow True Native Architecture with separate platform implementations

---

## Architecture

### Component Structure

The Button Component follows the True Native Architecture pattern established by the Icon System (Spec 004), with build-time platform separation and shared type definitions.

#### Directory Structure

```
src/components/core/ButtonCTA/
├── README.md                    # Component documentation
├── types.ts                     # Shared TypeScript interfaces
├── __tests__/                   # Cross-platform tests
├── examples/                    # Usage examples
└── platforms/                   # Platform-specific implementations
    ├── web/
    │   └── ButtonCTA.web.tsx   # Web implementation (React/TypeScript)
    ├── ios/
    │   └── ButtonCTA.ios.swift # iOS implementation (SwiftUI)
    └── android/
        └── ButtonCTA.android.kt # Android implementation (Jetpack Compose)
```

#### Shared Type Definitions

```typescript
// types.ts - Platform-agnostic interfaces

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonStyle = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  /** Button text label */
  label: string;
  
  /** Button size variant */
  size: ButtonSize;
  
  /** Button visual style */
  style: ButtonStyle;
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Optional text wrapping behavior */
  noWrap?: boolean;
  
  /** Click/tap handler */
  onPress: () => void;
  
  /** Optional test ID */
  testID?: string;
}
```

#### Platform Implementations

**Web (React/TypeScript)**:
- Uses semantic `<button>` element
- CSS custom properties for token consumption
- Flexbox for icon-text layout
- `:focus-visible` for keyboard focus
- `cursor: pointer` for hover affordance

**iOS (SwiftUI)**:
- Native `Button` component
- Swift constants for token consumption
- `HStack` for icon-text layout
- `.frame(minHeight: 44)` for touch target
- Scale transform for press feedback

**Android (Jetpack Compose)**:
- `Button` composable
- Kotlin constants for token consumption
- `Row` for icon-text layout
- `Modifier.size(minHeight = 44.dp)` for touch target
- Material ripple for press feedback

### Token Integration

The Button Component consumes tokens from the mathematical token system without creating component-level tokens. All sizing, spacing, typography, and colors use existing semantic or primitive tokens.

**Token Categories Used**:
- **Typography**: `typography.bodyMd`, `typography.bodyLg`
- **Spacing**: `space.inset.*`, `space.grouped.*`
- **Colors**: `color.primary`, `color.background`, `color.text.onPrimary`
- **Border Radius**: `radius100`, `radius150`, `radius200`
- **Interaction**: `opacity.hover`, `opacity.pressed`
- **Focus**: `border.emphasis`, `shadow.hover`
- **Icons**: `icon.size100`, `icon.size125`
- **Blend**: `color.icon.opticalBalance` (for optical weight compensation)

### Icon Integration

The Button Component integrates with the Icon System (Spec 004) for optional leading icons:

- Uses Icon component's type-safe `IconName` type
- Leverages Icon component's color inheritance mechanism
- Applies optical weight compensation via `color.icon.opticalBalance` blend token
- Icon sizes calculated from typography line heights via icon size tokens (Spec 006)

### Cross-Platform API Consistency

All platforms expose identical component APIs with platform-specific prop types:

**Web**: `ButtonProps` interface with React event handlers
**iOS**: `ButtonProps` struct with Swift closures
**Android**: `ButtonProps` data class with Kotlin lambdas

Platform-specific behaviors (hover, press feedback, focus indicators) are handled internally by each implementation while maintaining visual consistency through shared token values.

---

## Dependencies

### Spec 007: Accessibility Token Family

**Status**: To be created  
**Blocking**: ButtonCTA implementation requires accessibility tokens for focus indicators

**Required Tokens**:
- `accessibility.focus.offset` - Focus indicator outline offset (WCAG 2.4.7 Focus Visible)
- `accessibility.focus.width` - Focus indicator outline width (may reference `border.emphasis`)
- `accessibility.focus.color` - Focus indicator color (may reference `color.primary`)

**Note**: Spec 007 will establish the accessibility token family pattern for focus indicators and other accessibility-specific tokens. Touch target sizing uses existing tokens (not accessibility-specific) as it serves general usability for all users, not specific accessibility needs.

---

## New Semantic Tokens Required

The following semantic tokens must be created before implementing the Button Component:

### 1. color.text.onPrimary

**Value**: `white100` (primitive)  
**Purpose**: Text color for content on primary-colored backgrounds  
**Usage**: Primary buttons, badges, chips with primary background  
**Rationale**: Follows compositional architecture and industry patterns (Material "on-primary", Carbon "text-on-color")

### 2. color.icon.opticalBalance

**Value**: `blend200` (primitive) with `BlendDirection.LIGHTER`  
**Purpose**: Icon optical weight compensation when paired with text  
**Usage**: Secondary/tertiary buttons, any component with icon-text pairing on light backgrounds  
**Rationale**: Icons appear heavier than text at same color due to stroke density. Blend token approach is color-agnostic and avoids explosion of color-specific tokens

### 3. space.inset.generous

**Value**: `space400` (32px primitive)  
**Purpose**: Generous internal spacing for large components  
**Usage**: Large button horizontal padding, spacious card padding, hero section insets  
**Rationale**: Fills gap in inset token progression (tight→normal→comfortable→spacious→expansive→generous)

### 4. accessibility.focus.offset (Spec 007 Dependency)

**Value**: `space050` (2px primitive)  
**Purpose**: Focus indicator outline offset from component bounds  
**Usage**: Focus rings on buttons, inputs, links, any focusable element  
**Rationale**: WCAG 2.4.7 Focus Visible - ensures focus indicators are clearly visible and separated from component  
**Note**: Defined in Spec 007 (Accessibility Token Family)

---

*This requirements document provides comprehensive EARS-format requirements with acceptance criteria, architectural guidance following the Icon System pattern, and token requirements for the CTA Button Component implementation.*