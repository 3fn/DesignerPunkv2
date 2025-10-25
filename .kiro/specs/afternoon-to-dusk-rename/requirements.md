# Requirements Document: Afternoon to Dusk Rename

**Date**: October 24, 2025
**Spec**: afternoon-to-dusk-rename
**Status**: Requirements Phase
**Dependencies**: shadow-glow-token-system

---

## Introduction

This specification addresses the renaming of "Afternoon" to "Dusk" in the Shadow Tokens and Lighting Framework. The change improves semantic clarity, eliminates naming repetition with "Noon", and creates space for a meaningful dedication to Tracy Weiss, whose suggestion inspired this improvement.

The rename affects shadow token naming, documentation, and test files across the codebase while maintaining the mathematical relationships and lighting framework integrity.

---

## Glossary

- **Shadow Token System**: Token system for directional shadows based on light source position throughout the day
- **Sun Arc Framework**: Conceptual model of light source position (sunrise, morning, noon, afternoon/dusk, sunset)
- **Dusk**: Transitional lighting period between day and night, characterized by golden hour light and long shadows
- **Easter Egg**: Hidden dedication or message embedded in code or documentation
- **Lighting Framework**: System for modeling shadow behavior based on time-of-day lighting conditions

---

## Requirements

### Requirement 1: Rename Afternoon to Dusk

**User Story**: As a developer using the Shadow Token System, I want "Dusk" instead of "Afternoon" so that the lighting framework has distinct, non-repetitive naming and clearer semantic meaning.

#### Acceptance Criteria

1. WHEN referencing the transitional evening lighting period THEN the Shadow Token System SHALL use "Dusk" instead of "Afternoon"
2. WHEN documenting the sun arc framework THEN the system SHALL describe the progression as "sunrise, morning, noon, dusk, sunset"
3. WHEN naming shadow tokens THEN the semantic token SHALL be named "shadow.dusk" instead of "shadow.afternoon"
4. WHEN describing shadow offset directions THEN documentation SHALL reference "dusk" for medium right offset with default color
5. WHEN generating platform-specific code THEN the system SHALL output "dusk" in variable names and CSS custom properties

### Requirement 2: Update All References

**User Story**: As a maintainer of the design system, I want all references to "Afternoon" updated to "Dusk" so that the codebase is consistent and the naming change is complete.

#### Acceptance Criteria

1. WHEN updating token definitions THEN the system SHALL rename "shadow.afternoon" to "shadow.dusk" in semantic shadow tokens
2. WHEN updating primitive token documentation THEN the system SHALL replace "Afternoon" with "Dusk" in shadowOffsetX descriptions
3. WHEN updating test files THEN the system SHALL update test expectations from "afternoon" to "dusk"
4. WHEN updating spec documentation THEN the system SHALL replace "afternoon" with "dusk" in requirements, design, tasks, and completion documents
5. WHEN updating code comments THEN the system SHALL replace "Afternoon" with "Dusk" in all explanatory text

### Requirement 3: Create Tracy Weiss Dedication

**User Story**: As the creator of this design system, I want to include a meaningful Easter egg dedication to Tracy Weiss so that her contribution and inspiration are honored in the codebase.

#### Acceptance Criteria

1. WHEN adding code comment dedication THEN the system SHALL include a poetic comment in shadowOffsetX token file referencing Tracy Weiss and "she lights me up"
2. WHEN adding metadata dedication THEN the system SHALL include hidden metadata in shadow.dusk token with dedication details (dedicatedTo, reason)
3. WHEN creating completion documentation THEN the system SHALL include a "Personal Note" section explaining the Tracy Weiss inspiration and dedication
4. WHEN describing the dedication THEN all three locations SHALL connect Tracy's contribution to the lighting framework theme
5. WHEN formatting dedications THEN they SHALL be tasteful, professional, and appropriate for a design system codebase while being personally meaningful

### Requirement 4: Maintain Mathematical Relationships

**User Story**: As a developer relying on the mathematical token foundation, I want the rename to preserve all mathematical relationships so that the lighting framework integrity is maintained.

#### Acceptance Criteria

1. WHEN renaming tokens THEN the system SHALL preserve the shadowOffsetX.150 (6px) primitive reference
2. WHEN updating semantic tokens THEN the system SHALL maintain the same offsetX, offsetY, blur, opacity, and color values
3. WHEN generating platform code THEN the system SHALL produce identical numerical values with only naming changes
4. WHEN validating tokens THEN the system SHALL confirm mathematical relationships remain unchanged
5. WHEN testing shadow behavior THEN the system SHALL verify visual output is identical to pre-rename state

### Requirement 5: Update Generated Platform Code

**User Story**: As a platform developer using generated tokens, I want platform-specific code updated to use "dusk" so that the naming is consistent across web, iOS, and Android.

#### Acceptance Criteria

1. WHEN generating web CSS THEN the system SHALL output "--shadow-dusk" instead of "--shadow-afternoon"
2. WHEN generating iOS Swift THEN the system SHALL output "static let dusk" instead of "static let afternoon"
3. WHEN generating Android Kotlin THEN the system SHALL output appropriate "dusk" naming instead of "afternoon"
4. WHEN regenerating platform code THEN the system SHALL update all platform outputs with the new naming
5. WHEN validating platform code THEN the system SHALL confirm no references to "afternoon" remain in generated files

---

*This requirements document establishes the foundation for renaming "Afternoon" to "Dusk" in the Shadow Tokens and Lighting Framework, including a meaningful dedication to Tracy Weiss while maintaining mathematical integrity and cross-platform consistency.*
