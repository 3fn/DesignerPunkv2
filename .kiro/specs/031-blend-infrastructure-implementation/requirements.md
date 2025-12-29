# Requirements Document: Blend Infrastructure Implementation

**Date**: December 28, 2025
**Spec**: 031 - Blend Infrastructure Implementation
**Status**: Requirements Phase
**Dependencies**: 024-blend-token-infrastructure-audit (completed)

---

## Introduction

This specification addresses the infrastructure gap identified in Spec 024: blend tokens are defined as calculation parameters, but no mechanism exists to execute the calculation and deliver consumable color values to components.

The solution integrates the existing BlendUtilityGenerator into the build pipeline, providing platform-native runtime utilities (Web, iOS, Android) that components can consume to apply blend operations (darken, lighten, saturate, desaturate) to colors.

## Glossary

- **Blend_Utility**: A platform-native function that applies a blend operation to a color value
- **Blend_Token**: A design token defining the amount of a blend operation (e.g., `blend.hoverDarker = 0.08`)
- **BlendUtilityGenerator**: Existing TypeScript class that generates platform-specific blend utility code
- **TokenFileGenerator**: Build pipeline orchestrator that generates design token output files
- **Layer_1_Validation**: Numerical precision testing of blend utility calculations
- **Layer_2_Validation**: Token-naming validation of component blend utility usage

---

## Requirements

### Requirement 1: Build Pipeline Integration

**User Story**: As a build system, I want BlendUtilityGenerator integrated into TokenFileGenerator, so that blend utilities are generated alongside design tokens.

#### Acceptance Criteria

1. WHEN the build pipeline runs THEN TokenFileGenerator SHALL invoke BlendUtilityGenerator
2. WHEN BlendUtilityGenerator completes THEN the build output SHALL include blend utility files for all platforms
3. IF BlendUtilityGenerator fails THEN the build SHALL report the error and halt
4. WHEN blend utilities are generated THEN they SHALL be placed in the dist/ directory alongside token files

---

### Requirement 2: Web Platform Utilities

**User Story**: As a web developer, I want TypeScript blend utility functions, so that I can apply blend operations to colors in web components.

#### Acceptance Criteria

1. WHEN the build completes THEN the system SHALL produce `dist/BlendUtilities.web.ts`
2. WHEN a developer imports `darkerBlend` THEN the function SHALL accept a color string and blend amount and return a darkened color string
3. WHEN a developer imports `lighterBlend` THEN the function SHALL accept a color string and blend amount and return a lightened color string
4. WHEN a developer imports `saturate` THEN the function SHALL accept a color string and blend amount and return a saturated color string
5. WHEN a developer imports `desaturate` THEN the function SHALL accept a color string and blend amount and return a desaturated color string
6. WHEN any blend function receives invalid input THEN it SHALL return the original color unchanged

---

### Requirement 3: iOS Platform Utilities

**User Story**: As an iOS developer, I want Swift Color extensions for blend operations, so that I can apply blend operations to colors in SwiftUI components.

#### Acceptance Criteria

1. WHEN the build completes THEN the system SHALL produce `dist/BlendUtilities.ios.swift`
2. WHEN a developer calls `color.darkerBlend(amount)` THEN the extension SHALL return a darkened Color
3. WHEN a developer calls `color.lighterBlend(amount)` THEN the extension SHALL return a lightened Color
4. WHEN a developer calls `color.saturate(amount)` THEN the extension SHALL return a saturated Color
5. WHEN a developer calls `color.desaturate(amount)` THEN the extension SHALL return a desaturated Color
6. WHEN blend amount is outside valid range (0.0-1.0) THEN the extension SHALL clamp to valid range

---

### Requirement 4: Android Platform Utilities

**User Story**: As an Android developer, I want Kotlin Color extension functions for blend operations, so that I can apply blend operations to colors in Compose components.

#### Acceptance Criteria

1. WHEN the build completes THEN the system SHALL produce `dist/BlendUtilities.android.kt`
2. WHEN a developer calls `color.darkerBlend(amount)` THEN the extension SHALL return a darkened Color
3. WHEN a developer calls `color.lighterBlend(amount)` THEN the extension SHALL return a lightened Color
4. WHEN a developer calls `color.saturate(amount)` THEN the extension SHALL return a saturated Color
5. WHEN a developer calls `color.desaturate(amount)` THEN the extension SHALL return a desaturated Color
6. WHEN blend amount is outside valid range (0.0f-1.0f) THEN the extension SHALL clamp to valid range

---

### Requirement 5: Cross-Platform Consistency

**User Story**: As a design system maintainer, I want identical blend results across platforms, so that components look the same on Web, iOS, and Android.

#### Acceptance Criteria

1. WHEN the same color and blend amount are provided to Web, iOS, and Android utilities THEN the resulting RGB values SHALL match within ±1 on the 0-255 scale
2. WHEN Layer 1 validation tests run THEN all cross-platform precision tests SHALL pass
3. WHEN the TypeScript implementation produces a result THEN iOS and Android implementations SHALL produce numerically equivalent results
4. IF platform-specific color handling causes drift THEN the implementation SHALL normalize to match the TypeScript reference

---

### Requirement 6: Package Exports

**User Story**: As a consuming application, I want to import blend utilities from the design system package, so that I can use them without additional setup.

#### Acceptance Criteria

1. WHEN a developer imports from `@designerpunk/tokens/BlendUtilities` THEN the Web utilities SHALL be available
2. WHEN the package is published THEN blend utility files SHALL be included in the distribution
3. WHEN existing token imports are used THEN they SHALL continue to work unchanged (no breaking changes)
4. WHEN blend utilities are imported THEN TypeScript types SHALL be available for all functions

---

### Requirement 7: ButtonCTA Component Updates

**User Story**: As a component consumer, I want ButtonCTA to use blend utilities for state colors, so that hover, pressed, disabled, and icon states use the design system's blend tokens.

#### Acceptance Criteria

1. WHEN ButtonCTA enters hover state THEN it SHALL use `darkerBlend(color.primary, blend.hoverDarker)` instead of `opacity: 0.92`
2. WHEN ButtonCTA enters pressed state THEN it SHALL use `darkerBlend(color.primary, blend.pressedDarker)` instead of opacity or scale workarounds
3. WHEN ButtonCTA enters disabled state THEN it SHALL use `desaturate(color.primary, blend.disabledDesaturate)` instead of `opacity: 0.6`
4. WHEN ButtonCTA renders an icon THEN it SHALL use `lighterBlend(color.onPrimary, blend.iconLighter)` instead of `filter: brightness()`
5. WHEN Layer 2 validation tests run THEN ButtonCTA token usage tests SHALL pass

---

### Requirement 8: TextInputField Component Updates

**User Story**: As a component consumer, I want TextInputField to use blend utilities for state colors, so that focus and disabled states use the design system's blend tokens.

#### Acceptance Criteria

1. WHEN TextInputField enters focus state THEN it SHALL use `saturate(color.primary, blend.focusSaturate)` instead of direct color reference
2. WHEN TextInputField enters disabled state THEN it SHALL use `desaturate(color.primary, blend.disabledDesaturate)` instead of `opacity: 0.6`
3. WHEN Layer 2 validation tests run THEN TextInputField token usage tests SHALL pass

---

### Requirement 9: Container Component Updates

**User Story**: As a component consumer, I want Container to use blend utilities for hover state, so that hover effects use the design system's blend tokens.

#### Acceptance Criteria

1. WHEN Container enters hover state THEN it SHALL use `darkerBlend(color.surface, blend.hoverDarker)` for hover effect
2. WHEN Layer 2 validation tests run THEN Container token usage tests SHALL pass

---

### Requirement 10: Icon Component Updates

**User Story**: As a component consumer, I want Icon to use blend utilities for optical balance, so that icon lightening uses the design system's blend tokens.

#### Acceptance Criteria

1. WHEN Icon requires optical balance adjustment THEN it SHALL use `lighterBlend(color, blend.iconLighter)` instead of CSS filters
2. WHEN Layer 2 validation tests run THEN Icon token usage tests SHALL pass

---

### Requirement 11: Theme-Aware Utilities

**User Story**: As a theme system, I want blend utilities to work correctly with light and dark themes, so that blend operations produce appropriate results in both modes.

#### Acceptance Criteria

1. WHEN a component uses blend utilities in light theme THEN the blend operation SHALL produce visually appropriate results
2. WHEN a component uses blend utilities in dark theme THEN the blend operation SHALL produce visually appropriate results
3. WHEN theme context changes THEN components using blend utilities SHALL update their colors accordingly
4. WHEN theme-aware wrapper functions are provided THEN they SHALL automatically use the current theme's color values

---

### Requirement 12: Two-Layer Validation

**User Story**: As a quality assurance process, I want two-layer validation (numerical precision + token naming), so that both calculation correctness and semantic usage are verified.

#### Acceptance Criteria

1. WHEN Layer 1 tests run THEN they SHALL validate blend utility numerical precision within ±1 RGB
2. WHEN Layer 2 tests run THEN they SHALL validate components use correct blend utility + token combinations
3. WHEN a component uses incorrect token naming THEN Layer 2 tests SHALL fail
4. WHEN blend calculations produce incorrect results THEN Layer 1 tests SHALL fail
5. WHEN all validation passes THEN the system SHALL be considered ready for release

---

### Requirement 13: Workaround Removal

**User Story**: As a codebase maintainer, I want all blend-related workarounds removed, so that the codebase uses consistent, token-based blend operations.

#### Acceptance Criteria

1. WHEN component updates are complete THEN no component SHALL use `opacity` for hover/pressed/disabled states
2. WHEN component updates are complete THEN no component SHALL use `filter: brightness()` for icon lightening
3. WHEN component updates are complete THEN no component SHALL use `scaleEffect` as a pressed state workaround
4. WHEN component updates are complete THEN no component SHALL use Material ripple as a pressed state workaround
5. WHEN Layer 2 validation runs THEN it SHALL detect and fail on any remaining workarounds

---

### Requirement 14: Documentation Updates

**User Story**: As a developer, I want updated documentation for blend utility usage, so that I can correctly implement blend operations in new components.

#### Acceptance Criteria

1. WHEN blend utilities are released THEN component guides SHALL include blend utility usage examples
2. WHEN a developer reads the documentation THEN they SHALL understand how to use blend utilities for each state type
3. WHEN AI agents assist with component development THEN steering documentation SHALL guide correct blend utility usage
