# Requirements Document: Layering Token System

**Date**: October 28, 2025
**Spec**: layering-token-system
**Status**: Requirements Phase
**Dependencies**: shadow-glow-token-system, semantic-token-generation

---

## Introduction

This specification defines the Layering Token System for DesignerPunk, which provides semantic tokens for controlling element stacking order across web, iOS, and Android platforms. The system acknowledges fundamental platform differences: web and iOS separate stacking order (z-index) from visual depth (shadows), while Android Material Design couples these concerns through elevation.

The Layering Token System introduces two platform-specific token sets:
- **Z-Index Tokens** (Web + iOS): Pure stacking order, used independently with shadow tokens
- **Elevation Tokens** (Android): Stacking order + shadow rendering (Material Design convention)

**Architectural Decision**: Layering tokens are **semantic-only** with no primitive token layer. Unlike other token categories (spacing, fontSize, etc.) that follow a primitive→semantic hierarchy, layering tokens use direct semantic values because:
1. **No Mathematical Relationships**: Z-index values are ordinal (ordering), not mathematical (relationships). There's no meaningful mathematical relationship between z-index 100 and 400.
2. **Platform-Specific Scales**: Web uses arbitrary z-index values (100, 200, 300), Android uses Material Design elevation scale (4dp, 8dp, 16dp). These scales don't align mathematically.
3. **Component-Driven**: Layering is inherently about component stacking order (modal above dropdown), not mathematical progressions.

This approach respects platform-native conventions while maintaining cross-platform semantic consistency, enabling AI agents to generate platform-appropriate code with clear generation rules.

---

## Glossary

- **Layering**: The conceptual category encompassing element stacking order across all platforms
- **Z-Index**: Web/iOS property controlling stacking order without visual effects
- **Elevation**: Android Material Design property controlling both stacking order and shadow rendering
- **Stacking Order**: The order in which UI elements are layered on the z-axis
- **Material Design**: Android's design system that couples elevation with shadow rendering
- **Platform-Native**: Following the conventions and terminology of each specific platform
- **Semantic Token**: Purpose-driven token that references primitive tokens or provides platform-specific values
- **AI Agent**: Automated system generating platform-specific code from design tokens

---

## Requirements

### Requirement 1: Platform-Specific Token Sets

**User Story**: As a product architect, I want platform-specific layering tokens so that each platform uses its native terminology and conventions.

#### Acceptance Criteria

1. WHEN defining layering tokens THEN the system SHALL provide two distinct token sets: zIndex tokens for web/iOS and elevation tokens for Android
2. WHEN a zIndex token is defined THEN it SHALL include platform metadata indicating ['web', 'ios'] as supported platforms
3. WHEN an elevation token is defined THEN it SHALL include platform metadata indicating ['android'] as supported platform
4. WHEN an elevation token is defined THEN it SHALL include a shadowReference property documenting the related shadow token
5. WHEN generating platform code THEN web and iOS SHALL use zIndex tokens and Android SHALL use elevation tokens

### Requirement 2: Semantic Naming Consistency

**User Story**: As a developer, I want consistent semantic names across platforms so that I can understand component layering regardless of platform.

#### Acceptance Criteria

1. WHEN defining layering tokens THEN each semantic level SHALL have corresponding tokens in both zIndex and elevation sets (e.g., zIndex.modal and elevation.modal)
2. WHEN naming layering tokens THEN names SHALL use component-based semantics (container, navigation, dropdown, modal, toast, tooltip)
3. WHEN documenting layering tokens THEN each token SHALL include context describing its intended use case
4. WHEN an AI agent requests a layering token THEN the semantic name SHALL be consistent across platforms (e.g., "modal" means the same layering level on all platforms)

### Requirement 3: Z-Index Token Structure (Web/iOS)

**User Story**: As a web or iOS developer, I want z-index tokens that control stacking order independently from shadows so that I can compose layering and visual depth separately.

#### Acceptance Criteria

1. WHEN defining a zIndex token THEN it SHALL be a semantic-only token with no primitive token layer
2. WHEN a zIndex token is defined THEN it SHALL include a direct numeric value (not a primitive reference) appropriate for the platform's z-index scale
3. WHEN a zIndex token is used on web THEN it SHALL map to the CSS z-index property
4. WHEN a zIndex token is used on iOS THEN it SHALL map to SwiftUI's zIndex() modifier or UIKit's zPosition property
5. WHEN using zIndex tokens THEN they SHALL be independent from shadow tokens (can be used with or without shadows)
6. WHEN validating zIndex tokens THEN the system SHALL NOT apply mathematical relationship validation (z-index values are ordinal, not mathematical)

### Requirement 4: Elevation Token Structure (Android)

**User Story**: As an Android developer, I want elevation tokens that follow Material Design conventions so that my code aligns with platform best practices.

#### Acceptance Criteria

1. WHEN defining an elevation token THEN it SHALL be a semantic-only token with no primitive token layer
2. WHEN an elevation token is defined THEN it SHALL include a direct numeric value (not a primitive reference) in dp (density-independent pixels) following Material Design elevation scale
3. WHEN an elevation token is used on Android THEN it SHALL map to the Material elevation property
4. WHEN an elevation token is applied THEN it SHALL handle both stacking order and shadow rendering (Material Design convention)
5. WHEN an elevation token is defined THEN it SHALL document the related shadow token via shadowReference property for cross-platform consistency
6. WHEN validating elevation tokens THEN the system SHALL NOT apply mathematical relationship validation (elevation values follow Material Design scale, not mathematical progressions)

### Requirement 5: Layering Hierarchy

**User Story**: As a designer, I want a clear layering hierarchy so that components stack in predictable and consistent ways across platforms.

#### Acceptance Criteria

1. WHEN defining layering tokens THEN the system SHALL provide at least six semantic levels: container, navigation, dropdown, modal, toast, tooltip
2. WHEN layering tokens are ordered THEN container SHALL have the lowest stacking order and tooltip SHALL have the highest
3. WHEN defining z-index values THEN they SHALL use 100-based increments (100, 200, 300, 400, 500, 600) to allow for future insertion of intermediate levels
4. WHEN defining elevation values THEN they SHALL follow Material Design elevation scale (4dp, 8dp, 16dp, 24dp)
5. WHEN components use layering tokens THEN higher semantic levels SHALL always stack above lower levels

### Requirement 6: AI Agent Generation Rules

**User Story**: As an AI agent, I want clear platform-specific generation rules so that I can generate correct layering code for each platform without ambiguity.

#### Acceptance Criteria

1. WHEN generating web code THEN the AI agent SHALL use zIndex tokens for stacking order and shadow tokens for visual depth
2. WHEN generating iOS code THEN the AI agent SHALL use zIndex tokens for stacking order and shadow tokens for visual depth
3. WHEN generating Android code THEN the AI agent SHALL use elevation tokens which handle both stacking order and shadow rendering
4. WHEN generating Android code THEN the AI agent SHALL NOT use separate shadow tokens (elevation handles both concerns)
5. WHEN an AI agent encounters a layering request THEN it SHALL select the appropriate token set based on target platform metadata

### Requirement 7: Cross-Platform Semantic Consistency

**User Story**: As a product architect, I want semantic consistency across platforms so that "modal" means the same layering concept everywhere, even if implementation differs.

#### Acceptance Criteria

1. WHEN a semantic layering level is defined THEN it SHALL have corresponding tokens in both zIndex and elevation sets
2. WHEN documenting layering tokens THEN the semantic meaning SHALL be consistent across platforms (e.g., "modal" always means dialog overlays)
3. WHEN elevation tokens reference shadow tokens THEN the referenced shadow SHALL align with the semantic layering level
4. WHEN comparing cross-platform layering THEN semantic levels SHALL maintain relative ordering (modal above dropdown on all platforms)
5. WHEN numeric values differ between platforms THEN the semantic meaning and relative ordering SHALL remain consistent

### Requirement 8: Edge Case Handling

**User Story**: As a developer, I want clear guidance for edge cases so that I know how to handle scenarios where standard tokens don't apply.

#### Acceptance Criteria

1. WHEN web or iOS requires z-index without shadow THEN developers SHALL use zIndex token without shadow token
2. WHEN web or iOS requires shadow without z-index THEN developers SHALL use shadow token with default z-index (auto)
3. WHEN Android requires z-order without shadow THEN developers SHALL use Compose's Modifier.zIndex() directly (not a token)
4. WHEN Android edge cases arise THEN documentation SHALL explain why elevation tokens don't apply and provide platform-specific alternatives
5. WHEN edge cases are documented THEN they SHALL include code examples showing the non-token approach

### Requirement 9: Token Metadata and Documentation

**User Story**: As a developer or AI agent, I want comprehensive token metadata so that I understand platform support, usage context, and relationships to other tokens.

#### Acceptance Criteria

1. WHEN a layering token is defined THEN it SHALL include name, value, platforms array, category, context, and description properties
2. WHEN an elevation token is defined THEN it SHALL additionally include shadowReference property
3. WHEN layering tokens are documented THEN documentation SHALL explain why two token sets exist (platform differences)
4. WHEN layering tokens are documented THEN documentation SHALL include AI agent generation rules for each platform
5. WHEN layering tokens are documented THEN documentation SHALL include edge case handling with code examples

### Requirement 10: Cross-Platform Build System Integration

**User Story**: As a system architect, I want layering tokens to integrate with the existing cross-platform build system so that they generate correctly alongside other token categories.

#### Acceptance Criteria

1. WHEN layering tokens are generated THEN the TokenFileGenerator SHALL process both zIndex and elevation tokens
2. WHEN generating web output THEN the build system SHALL include zIndex tokens in the generated CSS custom properties file
3. WHEN generating iOS output THEN the build system SHALL include zIndex tokens in the generated Swift constants file
4. WHEN generating Android output THEN the build system SHALL include elevation tokens in the generated Kotlin constants file
5. WHEN the build system processes layering tokens THEN it SHALL apply platform-specific naming conventions (kebab-case for web, camelCase for iOS, snake_case for Android)
6. WHEN the build system validates layering tokens THEN it SHALL NOT require primitive token references (semantic-only tokens are valid for this category)

### Requirement 11: Shadow Token Integration (Android)

**User Story**: As an Android developer, I want elevation tokens to align with existing shadow tokens so that cross-platform shadow definitions remain consistent.

#### Acceptance Criteria

1. WHEN an elevation token is defined THEN it SHALL include a shadowReference property that references an existing shadow semantic token by name
2. WHEN an elevation token references a shadow token THEN the shadow token SHALL exist in the shadow token system
3. WHEN generating Android code THEN the elevation value SHALL be derived from or aligned with the referenced shadow token's visual depth
4. WHEN Android shadow tokens are implemented THEN they SHALL include platform-specific elevation values (in dp) for Material Design compatibility
5. WHEN elevation tokens are documented THEN they SHALL explain the relationship between elevation values and referenced shadow tokens for cross-platform consistency

### Requirement 12: Token System Architecture Alignment

**User Story**: As a system architect, I want layering tokens to follow established token system patterns so that they integrate seamlessly with existing infrastructure.

#### Acceptance Criteria

1. WHEN layering tokens are implemented THEN they SHALL follow the semantic-only pattern with no primitive token layer (documented exception to typical primitive→semantic hierarchy)
2. WHEN layering tokens are implemented THEN they SHALL be located in src/tokens/semantic/ directory
3. WHEN layering tokens are implemented THEN they SHALL be exported via src/tokens/semantic/index.ts
4. WHEN layering tokens are defined THEN they SHALL use the SemanticToken type structure with appropriate metadata
5. WHEN layering tokens are documented THEN documentation SHALL explicitly note the semantic-only architecture and rationale for not having primitives
6. WHEN the Token Category Pattern Guide is referenced THEN layering tokens SHALL be documented as an exception case with clear justification

---

*This requirements document defines the foundation for the Layering Token System, establishing clear acceptance criteria for platform-specific token sets that respect native conventions while maintaining cross-platform semantic consistency and integration with existing token infrastructure.*
