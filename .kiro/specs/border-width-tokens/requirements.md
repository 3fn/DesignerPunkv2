# Requirements Document: Border Width Tokens

**Date**: October 23, 2025
**Spec**: border-width-tokens - Border Width Token System
**Status**: Requirements Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Introduction

This specification defines the border width token system for DesignerPunk, establishing primitive and semantic tokens for border widths across web, iOS, and Android platforms. The system follows the mathematical foundation principles established in the mathematical token system, using explicit multiplier relationships (similar to SpacingTokens where space200 = space100 × 2) and unitless base values that convert to platform-specific units at build time (like FontSizeTokens).

Border width tokens provide a minimal, purposeful set of values (1, 2, 4) with a clean doubling progression, supporting standard borders, emphasized states, and strong visual weight. The system intentionally excludes focus ring tokens, deferring to platform-native focus indicator patterns documented in usage guidelines.

## Dependencies

This specification builds on the following existing DesignerPunk infrastructure:

- **Mathematical Token System** (`.kiro/specs/mathematical-token-system/`): Provides the mathematical foundation, validation patterns, and unitless architecture that border width tokens follow.

- **Cross-Platform Build System** (`.kiro/specs/cross-platform-build-system/`): Provides the BuildOrchestrator, platform generators (WebCSSGenerator, iOSSwiftGenerator, AndroidKotlinGenerator), and token file generation that border width tokens integrate with.

- **Token Registries**: PrimitiveTokenRegistry and SemanticTokenRegistry for token storage and resolution.

- **Three-Tier Validation System**: Pass/Warning/Error validation framework for mathematical relationship verification.

---

## Glossary

- **Border Width Token**: A design token representing the thickness of borders, expressed as a unitless value that converts to platform-specific units (px, pt, dp)
- **Primitive Token**: A foundational token with a direct numeric value or mathematical relationship to a base value
- **Semantic Token**: A token that references primitive tokens and provides contextual meaning for specific use cases
- **Base Value**: The foundational numeric value (borderWidth100 = 1) from which other values are mathematically derived
- **Unitless Value**: A numeric value without platform-specific units, converted at build time to px (web), pt (iOS), or dp (Android)
- **Mathematical Relationship**: Explicit multiplier expressions (e.g., borderWidth200 = borderWidth100 × 2) that define token values
- **Build System**: The cross-platform token generation system that converts unitless tokens to platform-specific output files
- **Platform-Native Focus Pattern**: Platform-specific focus indicator implementations (web outline, iOS system focus, Android ripple)

---

## Requirements

### Requirement 1: Primitive Border Width Token Foundation

**User Story**: As a product architect, I want primitive border width tokens with explicit mathematical relationships, so that border thickness values are consistent, predictable, and maintainable across the design system.

#### Acceptance Criteria

1. WHEN the system defines primitive border width tokens, THEN the system SHALL include borderWidth100 with a base value of 1
2. WHEN the system defines borderWidth200, THEN the system SHALL calculate the value as borderWidth100 × 2
3. WHEN the system defines borderWidth400, THEN the system SHALL calculate the value as borderWidth100 × 4
4. WHEN primitive tokens are defined, THEN the system SHALL express mathematical relationships explicitly in code (not just as computed values)
5. WHEN the base value borderWidth100 changes, THEN the system SHALL automatically update borderWidth200 and borderWidth400 through their mathematical relationships

### Requirement 2: Semantic Border Width Tokens

**User Story**: As a product architect, I want semantic border width tokens that provide contextual meaning, so that I can apply borders with clear intent (default, emphasis, heavy) rather than arbitrary numeric values.

#### Acceptance Criteria

1. WHEN the system defines semantic tokens, THEN the system SHALL include borderDefault referencing borderWidth100
2. WHEN the system defines semantic tokens, THEN the system SHALL include borderEmphasis referencing borderWidth200
3. WHEN the system defines semantic tokens, THEN the system SHALL include borderHeavy referencing borderWidth400
4. WHEN semantic tokens are defined, THEN the system SHALL reference primitive tokens (not duplicate numeric values)
5. WHEN a semantic token is used, THEN the system SHALL resolve to the underlying primitive token value through the reference chain

### Requirement 3: Cross-Platform Unitless Architecture

**User Story**: As a product architect, I want border width tokens to use unitless base values that convert to platform-specific units at build time, so that the same token definitions generate correct output for web, iOS, and Android without platform-specific token files.

#### Acceptance Criteria

1. WHEN primitive tokens are defined, THEN the system SHALL use unitless numeric values (not px, pt, or dp)
2. WHEN the build system generates web output, THEN the system SHALL convert unitless values to px (borderWidth100 = 1 → 1px)
3. WHEN the build system generates iOS output, THEN the system SHALL convert unitless values to pt (borderWidth100 = 1 → 1pt)
4. WHEN the build system generates Android output, THEN the system SHALL convert unitless values to dp (borderWidth100 = 1 → 1dp)
5. WHEN platform-specific files are generated, THEN the system SHALL maintain mathematical relationships in the output (borderWidth200 = 2px/pt/dp)

### Requirement 4: Mathematical Validation

**User Story**: As a product architect, I want the system to validate that border width tokens maintain their mathematical relationships, so that I can trust the token system's consistency and catch errors early.

#### Acceptance Criteria

1. WHEN the system validates borderWidth200, THEN the system SHALL verify that borderWidth200 equals borderWidth100 × 2
2. WHEN the system validates borderWidth400, THEN the system SHALL verify that borderWidth400 equals borderWidth100 × 4
3. WHEN a mathematical relationship is violated, THEN the system SHALL report an error with the expected and actual values
4. WHEN semantic tokens are validated, THEN the system SHALL verify that each semantic token references a valid primitive token
5. WHEN validation completes successfully, THEN the system SHALL confirm that all mathematical relationships are maintained

### Requirement 5: Token Integration with Existing System

**User Story**: As a product architect, I want border width tokens to integrate seamlessly with the existing token system, so that they follow the same patterns, file organization, and build processes as spacing and typography tokens.

#### Acceptance Criteria

1. WHEN border width tokens are implemented, THEN the system SHALL follow the same file organization pattern as existing primitive tokens
2. WHEN border width tokens are implemented, THEN the system SHALL follow the same primitive → semantic hierarchy as spacing and typography tokens
3. WHEN the build system processes tokens, THEN the system SHALL include border width tokens in the cross-platform generation process
4. WHEN border width tokens are generated, THEN the system SHALL produce output files in the same directory structure as other token types
5. WHEN border width tokens are used in components, THEN the system SHALL allow composition with color tokens (border width + border color)

### Requirement 6: Platform-Native Focus Pattern Documentation

**User Story**: As a product architect, I want clear documentation on how to implement focus indicators using border width tokens and platform-native patterns, so that I can create accessible, platform-appropriate focus states without a dedicated focus ring token.

#### Acceptance Criteria

1. WHEN focus indicator documentation is provided, THEN the system SHALL specify that web implementations use outline (not border) with borderEmphasis width
2. WHEN focus indicator documentation is provided, THEN the system SHALL specify that iOS implementations use system-provided focus indicators
3. WHEN focus indicator documentation is provided, THEN the system SHALL specify that Android implementations use ripple effects and elevation changes
4. WHEN focus indicator documentation is provided, THEN the system SHALL include code examples for each platform showing proper focus implementation
5. WHEN developers implement focus states, THEN the system SHALL provide guidance on using borderEmphasis for outline-width on web

### Requirement 7: Minimal Token Set with Strategic Flexibility

**User Story**: As a product architect, I want a minimal set of border width tokens that covers common use cases without premature abstraction, so that the system remains simple and maintainable while allowing for future expansion through strategic flexibility.

#### Acceptance Criteria

1. WHEN primitive tokens are defined, THEN the system SHALL include only borderWidth100, borderWidth200, and borderWidth400 (not borderWidth300)
2. WHEN semantic tokens are defined, THEN the system SHALL include only borderDefault, borderEmphasis, and borderHeavy (not borderSubtle)
3. WHEN the system requires hairline borders in the future, THEN the system SHALL allow adding borderWidth050 with value 0.5 as strategic flexibility
4. WHEN the system requires subtle borders in the future, THEN the system SHALL allow adding borderSubtle referencing borderWidth050
5. WHEN new tokens are added, THEN the system SHALL maintain the mathematical progression and naming conventions established by existing tokens

### Requirement 8: Usage Pattern Documentation

**User Story**: As a product architect, I want clear documentation of when to use each semantic border width token, so that I can make consistent decisions across components and communicate effectively with AI agents.

#### Acceptance Criteria

1. WHEN usage documentation is provided, THEN the system SHALL specify that borderDefault is used for standard borders (cards, inputs at rest, buttons at rest, dividers)
2. WHEN usage documentation is provided, THEN the system SHALL specify that borderEmphasis is used for emphasized states (inputs on focus, selected cards, active buttons)
3. WHEN usage documentation is provided, THEN the system SHALL specify that borderHeavy is used for strong visual weight (rare, use sparingly)
4. WHEN usage documentation is provided, THEN the system SHALL include examples of appropriate and inappropriate usage for each semantic token
5. WHEN AI agents reference usage documentation, THEN the system SHALL provide unambiguous guidance on token selection for common component states

---

*This requirements document establishes the foundation for a minimal, mathematically consistent border width token system that integrates with DesignerPunk's cross-platform architecture while respecting platform-native patterns for accessibility-critical features like focus indicators.*
