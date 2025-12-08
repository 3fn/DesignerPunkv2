# Requirements Document: Color Palette & Display Font Update

**Date**: December 8, 2025  
**Spec**: 015 - Color Palette & Display Font Update  
**Status**: Requirements Phase  
**Dependencies**: None

---

## Introduction

This specification defines requirements for updating the DesignerPunk color palette and display typography to create a more cohesive, accessible, and brand-aligned visual identity. The update encompasses two related changes:

1. **Color Palette Refinement**: Streamline from 9 to 7 color families with clearer semantic roles and improved accessibility
2. **Display Font Update**: Introduce Rajdhani as the display font to strengthen visual hierarchy and align with cyberpunk aesthetic

Both updates leverage the existing token architecture, requiring minimal code changes while delivering significant visual impact.

---

## Glossary

- **Design System**: The DesignerPunk cross-platform design system with mathematical token foundations
- **Primitive Token**: Base-level token defining raw values (e.g., `green400`, `fontFamilyDisplay`)
- **Semantic Token**: Context-aware token referencing primitive tokens (e.g., `color.success`, `typography.h1`)
- **Token Architecture**: The hierarchical system where semantic tokens reference primitive tokens
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines level AA compliance (4.5:1 contrast ratio for normal text)
- **Display Typography**: Typography used for headings, labels, buttons, and UI elements
- **Body Typography**: Typography used for paragraphs, descriptions, and general text content
- **Font Stack**: Ordered list of fonts with fallbacks for graceful degradation
- **Cross-Platform**: Consistent implementation across web, iOS, and Android platforms

---

## Requirements

### Requirement 1: Color Palette Primitive Tokens

**User Story**: As a design system maintainer, I want to update primitive color tokens to reflect the new 7-family palette, so that the system has a clearer, more functional color vocabulary.

#### Acceptance Criteria

1. WHEN the system defines primitive color tokens THEN it SHALL include green family tokens (green100, green200, green300, green400, green500) with electric green base color
2. WHEN the system defines primitive color tokens THEN it SHALL include pink family tokens (pink100, pink200, pink300, pink400, pink500) with hot pink base color
3. WHEN the system defines primitive color tokens THEN it SHALL remove violet family tokens (violet100-violet500) from the system
4. WHEN primitive color tokens are generated THEN they SHALL maintain mathematical relationships following the modular scale progression
5. WHEN primitive color tokens are generated THEN they SHALL generate platform-specific values for web, iOS, and Android

### Requirement 2: Semantic Color Token Migration

**User Story**: As a design system maintainer, I want to update semantic color tokens to use the new primitive colors, so that components automatically inherit the updated palette.

#### Acceptance Criteria

1. WHEN success semantic tokens are defined THEN `color.success.strong` SHALL reference `green400` and `color.success.subtle` SHALL reference `green100`
2. WHEN error semantic tokens are defined THEN `color.error.strong` SHALL reference `pink400` and `color.error.subtle` SHALL reference `pink100`
3. WHEN warning semantic tokens are defined THEN `color.warning.strong` SHALL reference `amber400` and `color.warning.subtle` SHALL reference `amber100`
4. WHEN attention semantic tokens are defined THEN `color.attention` SHALL reference `yellow400` and `color.highlight` SHALL reference `yellow300`
5. WHEN tech/data semantic tokens are defined THEN `color.tech` SHALL reference `cyan400` and `color.data` SHALL reference `cyan300`
6. WHEN the system defines semantic color tokens THEN it SHALL remove `color.secondary` token from the system
7. WHEN semantic color tokens are updated THEN existing components SHALL automatically inherit new colors through token references

### Requirement 3: Color Accessibility Values

**User Story**: As a design system maintainer, I want color token values chosen for accessibility, so that components have a foundation for meeting WCAG 2.1 AA standards.

#### Acceptance Criteria

1. WHEN amber warning color values are selected THEN they SHALL be chosen to provide better contrast than yellow (the previous warning color)
2. WHEN green success color values are selected THEN they SHALL avoid "matrix green" extremes and use accessible mid-range values
3. WHEN pink error color values are selected THEN they SHALL provide sufficient saturation for urgency while maintaining readability
4. WHEN color token values are documented THEN they SHALL include guidance on accessible usage contexts
5. WHEN color tokens are used in components THEN component-level tests SHALL validate actual contrast ratios in context

### Requirement 4: Display Font Primitive Token

**User Story**: As a design system maintainer, I want to update the display font primitive token to use Rajdhani, so that display typography has a distinct, brand-aligned appearance.

#### Acceptance Criteria

1. WHEN `fontFamilyDisplay` primitive token is defined THEN it SHALL reference Rajdhani as the primary font with system font fallbacks
2. WHEN `fontFamilyDisplay` token is updated THEN the font stack SHALL be `'Rajdhani, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'`
3. WHEN `fontFamilyBody` primitive token is defined THEN it SHALL reference Inter as the primary font with system font fallbacks
4. WHEN font family tokens are generated THEN they SHALL generate identical font stacks for web, iOS, and Android platforms
5. WHEN `fontFamilyDisplay` is updated THEN all 15 semantic typography tokens SHALL automatically inherit Rajdhani through token references

### Requirement 5: Font File Assets

**User Story**: As a design system maintainer, I want font files properly organized and accessible, so that custom fonts load correctly across all platforms.

#### Acceptance Criteria

1. WHEN font files are stored THEN they SHALL be organized in `src/assets/fonts/` directory with subdirectories for each font family
2. WHEN Inter font files are stored THEN they SHALL include Regular, Medium, SemiBold, and Bold weights in TTF, WOFF, and WOFF2 formats
3. WHEN Rajdhani font files are stored THEN they SHALL include Regular, Medium, SemiBold, and Bold weights in TTF, WOFF, and WOFF2 formats
4. WHEN font files are organized THEN Inter SHALL be in `src/assets/fonts/inter/` and Rajdhani SHALL be in `src/assets/fonts/rajdhani/`
5. WHEN font file formats are provided THEN TTF SHALL be available for iOS/Android and WOFF/WOFF2 SHALL be available for web

### Requirement 6: Web Font Loading

**User Story**: As a web developer, I want fonts to load efficiently with proper fallbacks, so that users experience minimal layout shift and no invisible text.

#### Acceptance Criteria

1. WHEN web fonts are configured THEN @font-face declarations SHALL be created for all Inter and Rajdhani weights
2. WHEN @font-face declarations are defined THEN they SHALL use `font-display: swap` to prevent invisible text (FOIT)
3. WHEN web fonts are loaded THEN WOFF2 format SHALL be prioritized over WOFF for better compression
4. WHEN web font paths are specified THEN they SHALL reference `/assets/fonts/[font-family]/[font-file]` structure
5. WHEN web fonts fail to load THEN the system SHALL gracefully fall back to system fonts in the font stack

### Requirement 7: iOS Font Integration

**User Story**: As an iOS developer, I want custom fonts properly bundled and configured, so that Rajdhani and Inter render correctly in the iOS app.

#### Acceptance Criteria

1. WHEN iOS font files are bundled THEN they SHALL include Inter and Rajdhani TTF files for all required weights
2. WHEN iOS fonts are configured THEN Info.plist SHALL list all Inter and Rajdhani font files in the UIAppFonts array
3. WHEN iOS fonts are referenced THEN SwiftUI code SHALL use `.custom("Rajdhani", size:)` for display text and `.custom("Inter", size:)` for body text
4. WHEN iOS fonts fail to load THEN the system SHALL fall back to SF Pro Display for display text and SF Pro Text for body text
5. WHEN iOS font weights are applied THEN they SHALL map correctly to the bundled font files (Regular=400, Medium=500, SemiBold=600, Bold=700)

### Requirement 8: Android Font Integration

**User Story**: As an Android developer, I want custom fonts properly configured and accessible, so that Rajdhani and Inter render correctly in the Android app.

#### Acceptance Criteria

1. WHEN Android font files are stored THEN they SHALL be placed in `app/src/main/res/font/` directory with lowercase, underscore-separated names
2. WHEN Android fonts are configured THEN FontFamily objects SHALL be created for both Inter and Rajdhani with all required weights
3. WHEN Android fonts are referenced THEN Jetpack Compose SHALL use `fontFamily = rajdhaniFamily` for display text and `fontFamily = interFamily` for body text
4. WHEN Android fonts fail to load THEN the system SHALL fall back to Roboto for both display and body text
5. WHEN Android font weights are applied THEN they SHALL map correctly to font resources (FontWeight.Normal, FontWeight.Medium, FontWeight.SemiBold, FontWeight.Bold)

### Requirement 9: Cross-Platform Token Generation

**User Story**: As a design system maintainer, I want the build system to generate platform-specific token files, so that updated colors and fonts are available in native formats for each platform.

#### Acceptance Criteria

1. WHEN the build system generates tokens THEN it SHALL create web CSS custom properties for all color and font tokens
2. WHEN the build system generates tokens THEN it SHALL create iOS Swift constants for all color and font tokens
3. WHEN the build system generates tokens THEN it SHALL create Android Kotlin constants for all color and font tokens
4. WHEN color tokens are generated THEN green and pink families SHALL be included and violet family SHALL be excluded
5. WHEN font tokens are generated THEN `fontFamilyDisplay` SHALL reference Rajdhani and `fontFamilyBody` SHALL reference Inter across all platforms

### Requirement 10: Migration Visual Validation

**User Story**: As a design system maintainer, I want to validate that components render correctly with updated colors and fonts during migration, so that visual changes are intentional and consistent.

#### Acceptance Criteria

1. WHEN components using success colors are validated THEN they SHALL display green instead of cyan
2. WHEN components using error colors are validated THEN they SHALL display pink instead of orange
3. WHEN components using warning colors are validated THEN they SHALL display amber instead of yellow
4. WHEN components using display typography are validated THEN headings, labels, and buttons SHALL render in Rajdhani font
5. WHEN components using body typography are validated THEN paragraphs and descriptions SHALL render in Inter font
6. WHEN migration validation is complete THEN visual regression baseline screenshots SHALL be updated to reflect new colors and fonts
7. WHEN baseline screenshots are updated THEN ongoing visual regression testing SHALL use the new baseline (not compare against old colors/fonts)
8. WHEN migration validation is confirmed complete THEN migration-specific test files SHALL be removed from the codebase

### Requirement 11: Documentation Updates

**User Story**: As a design system user, I want updated documentation that reflects the new color palette and typography, so that I understand how to use the refreshed design system.

#### Acceptance Criteria

1. WHEN color token documentation is updated THEN it SHALL explain the semantic meaning of each color family (green=success, pink=error, amber=warning, yellow=attention, cyan=tech/data, teal=info, purple=brand)
2. WHEN typography token documentation is updated THEN it SHALL explain that display typography uses Rajdhani and body typography uses Inter
3. WHEN component examples are updated THEN they SHALL demonstrate the new color palette and Rajdhani typography
4. WHEN token documentation is updated THEN it SHALL include guidance on accessible usage contexts for color tokens
5. WHEN migration guidance is needed THEN it SHALL be documented in the spec completion notes (not in evergreen documentation)

### Requirement 12: Backward Compatibility

**User Story**: As a design system maintainer, I want to understand breaking changes, so that I can communicate migration requirements to design system users.

#### Acceptance Criteria

1. WHEN semantic color tokens are updated THEN components referencing `color.success.*`, `color.error.*`, or `color.warning.*` SHALL experience visual changes
2. WHEN `color.secondary` token is removed THEN any components using it SHALL be identified and updated to use `purple700` directly
3. WHEN `fontFamilyDisplay` is updated THEN all components using display typography SHALL experience visual changes
4. WHEN breaking changes are documented THEN they SHALL include before/after comparisons and migration guidance
5. WHEN the update is released THEN it SHALL be communicated as a major version change due to visual breaking changes

---

## Success Criteria

The Color Palette & Display Font Update will be considered successful when:

1. All 7 color families (yellow, amber, purple, pink, cyan, teal, green) are implemented as primitive tokens
2. All semantic color tokens are updated to reference the new primitive colors
3. Rajdhani is configured as the display font across web, iOS, and Android
4. Inter is configured as the body font across web, iOS, and Android
5. All color combinations meet WCAG 2.1 AA accessibility standards
6. Visual regression tests pass for all affected components
7. Documentation is updated to reflect the new color palette and typography
8. The system successfully generates platform-specific token files for all platforms

---

## Out of Scope

The following items are explicitly out of scope for this specification:

1. **Component redesigns**: Components will inherit new colors/fonts through tokens, but no structural redesigns
2. **New components**: This update focuses on existing components only
3. **Animation updates**: Motion tokens and animation timing are not affected by this update
4. **Spacing changes**: Spacing tokens remain unchanged
5. **Additional font weights**: Only Regular, Medium, SemiBold, and Bold weights are included
6. **Font subsetting**: Initial implementation uses complete font files; optimization is future work
7. **Dark mode**: Color palette update focuses on light mode; dark mode is separate work
8. **Brand logo updates**: Visual identity changes are limited to color palette and typography

---
