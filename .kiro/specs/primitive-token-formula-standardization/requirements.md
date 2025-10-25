# Requirements Document: Primitive Token Formula Standardization

**Date**: October 24, 2025
**Spec**: primitive-token-formula-standardization
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

This specification addresses the inconsistency in primitive token definitions where mathematical relationships are documented as strings but implemented as hard-coded values. The current pattern treats formulas as "documentation for humans" rather than "executable mathematical truth," which undermines the system's ability to serve as a Rosetta Stone for AI-human collaboration.

The refactoring will convert hard-coded values to executable formulas using category-specific BASE_VALUE constants, making the mathematical foundation machine-readable and automatically maintainable. This change is critical for AI collaboration, as it transforms the token system from documentation-based to truth-based mathematical relationships.

### Key Architectural Principles

1. **Formula as Truth**: Mathematical relationships must be executable code, not just documentation strings
2. **Category-Specific BASE_VALUE**: Each token category maintains its own BASE_VALUE constant for clarity
3. **Strategic Flexibility Preservation**: Strategic flexibility tokens continue using constant references for usage tracking
4. **Rounding Where Necessary**: Math.round() used only where mathematically required (FontSize, TapArea)
5. **Cross-Token Dependencies Deferred**: LineHeight-to-FontSize relationships remain as simple multipliers for now

---

## Glossary

- **Primitive Token**: Base-level design token with mathematical relationships to a BASE_VALUE
- **BASE_VALUE**: Category-specific constant that serves as the mathematical foundation for token calculations
- **Hard Value**: Numeric literal directly assigned to baseValue property (e.g., `baseValue: 12`)
- **Formula Value**: Mathematical expression using BASE_VALUE constant (e.g., `baseValue: SPACING_BASE_VALUE * 1.5`)
- **Mathematical Relationship String**: Documentation string describing the formula (e.g., `'base × 1.5 = 8 × 1.5 = 12'`)
- **Strategic Flexibility Token**: Token with intentional deviation from strict mathematical progression, tracked for ≥80% appropriate usage
- **Category-Specific BASE_VALUE**: Named constant per token category (e.g., `SPACING_BASE_VALUE`, `FONT_SIZE_BASE_VALUE`)
- **Token System**: The DesignerPunk primitive token architecture
- **AI Agent**: Artificial intelligence system collaborating with humans on design system development
- **Rosetta Stone Principle**: System design enabling unambiguous communication between humans and AI through mathematical precision

---

## Requirements

### Requirement 1: Audit Primitive Token Files for Formula Consistency

**User Story**: As a design system maintainer, I want to identify which primitive token files use hard values vs formulas, so that I can understand the scope of refactoring needed.

#### Acceptance Criteria

1. WHEN the audit is performed, THEN the Token System SHALL identify all primitive token files in `src/tokens/`
2. WHEN each token file is analyzed, THEN the Token System SHALL categorize each file as "uses formulas," "uses hard values," or "mixed pattern"
3. WHEN the audit is complete, THEN the Token System SHALL produce a report listing:
   - Files using formulas consistently (e.g., GlowBlurTokens.ts)
   - Files using hard values (e.g., SpacingTokens.ts, RadiusTokens.ts)
   - Files with mixed patterns (e.g., BorderWidthTokens.ts)
   - Categorical tokens without mathematical relationships (e.g., ColorTokens.ts, FontFamilyTokens.ts)
4. WHEN the audit report is generated, THEN the Token System SHALL exclude categorical tokens (ColorTokens, FontFamilyTokens, DensityTokens) from refactoring scope

### Requirement 2: Establish Category-Specific BASE_VALUE Constants

**User Story**: As a design system developer, I want each token category to have an explicitly named BASE_VALUE constant, so that the mathematical foundation is clear and unambiguous for both humans and AI agents.

#### Acceptance Criteria

1. WHEN a primitive token file defines a BASE_VALUE, THEN the Token System SHALL use category-specific naming (e.g., `SPACING_BASE_VALUE`, `FONT_SIZE_BASE_VALUE`, `RADIUS_BASE_VALUE`)
2. WHEN a BASE_VALUE constant is defined, THEN the Token System SHALL export it for potential cross-file reference
3. WHEN a BASE_VALUE constant is defined, THEN the Token System SHALL include a documentation comment explaining its mathematical significance
4. WHEN reviewing BASE_VALUE constants, THEN the Token System SHALL verify that the constant name matches the token category

### Requirement 3: Refactor Hard Values to Formula Values

**User Story**: As a design system developer, I want baseValue properties to use formulas instead of hard values, so that changing the BASE_VALUE automatically updates all derived tokens.

#### Acceptance Criteria

1. WHEN a token has a mathematical relationship to BASE_VALUE, THEN the Token System SHALL express baseValue as a formula using the BASE_VALUE constant
2. WHEN a token uses a simple multiplier, THEN the Token System SHALL express it as `BASE_VALUE * multiplier` (e.g., `SPACING_BASE_VALUE * 1.5`)
3. WHEN a token uses a divisor, THEN the Token System SHALL express it as `BASE_VALUE / divisor` (e.g., `FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO`)
4. WHEN a token requires rounding, THEN the Token System SHALL use `Math.round()` around the formula (e.g., `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2))`)
5. WHEN a token is the base token (100 level), THEN the Token System SHALL use the BASE_VALUE constant directly (e.g., `baseValue: SPACING_BASE_VALUE`)
6. WHEN a formula is applied, THEN the Token System SHALL verify that the calculated value matches the original hard value

### Requirement 4: Preserve Strategic Flexibility Tokens

**User Story**: As a design system architect, I want strategic flexibility tokens to remain unchanged during refactoring, so that the ≥80% appropriate usage tracking system remains functional.

#### Acceptance Criteria

1. WHEN a token is marked as strategic flexibility (`isStrategicFlexibility: true`), THEN the Token System SHALL exclude it from refactoring
2. WHEN a strategic flexibility token is identified, THEN the Token System SHALL preserve its existing baseValue pattern unchanged
3. WHEN a strategic flexibility token is preserved, THEN the Token System SHALL maintain the `isStrategicFlexibility: true` flag
4. WHEN the refactoring is complete, THEN the Token System SHALL verify that all strategic flexibility tokens remain unchanged from their original implementation

### Requirement 5: Maintain Mathematical Relationship Documentation Strings

**User Story**: As a human developer, I want the mathematicalRelationship string to remain as human-readable documentation, so that I can quickly understand the formula without parsing code.

#### Acceptance Criteria

1. WHEN a token baseValue is refactored to a formula, THEN the Token System SHALL preserve the existing mathematicalRelationship string unchanged
2. WHEN a mathematicalRelationship string exists, THEN the Token System SHALL verify it accurately describes the formula in baseValue
3. WHEN a mathematicalRelationship string includes the final calculated value, THEN the Token System SHALL preserve that value for human reference
4. WHEN reviewing a token, THEN the Token System SHALL ensure the formula in code and the formula in the string are mathematically equivalent

### Requirement 6: Handle Rounding Requirements for FontSize and TapArea Tokens

**User Story**: As a design system developer, I want FontSize and TapArea tokens to use Math.round() where mathematically necessary, so that modular scale calculations produce integer values.

#### Acceptance Criteria

1. WHEN a FontSize token uses modular scale calculations, THEN the Token System SHALL wrap the formula in `Math.round()` (e.g., `Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2))`)
2. WHEN a TapArea token uses accessibility-based multipliers, THEN the Token System SHALL wrap the formula in `Math.round()` (e.g., `Math.round(TAP_AREA_BASE_VALUE * 1.09)`)
3. WHEN a token does not require rounding, THEN the Token System SHALL use the formula directly without Math.round()
4. WHEN Math.round() is used, THEN the Token System SHALL verify the rounded value matches the original hard value

### Requirement 7: Validate Formula Correctness Against Original Values

**User Story**: As a quality assurance engineer, I want to verify that refactored formulas produce the same values as the original hard values, so that the refactoring doesn't introduce regressions.

#### Acceptance Criteria

1. WHEN a token is refactored from hard value to formula, THEN the Token System SHALL calculate the formula result
2. WHEN the formula result is calculated, THEN the Token System SHALL compare it to the original hard value
3. IF the formula result does not match the original hard value, THEN the Token System SHALL report a validation error with the token name, expected value, and actual value
4. WHEN all tokens are refactored, THEN the Token System SHALL confirm that 100% of formula results match original hard values

### Requirement 8: Exclude Categorical Tokens from Refactoring

**User Story**: As a design system architect, I want categorical tokens (ColorTokens, FontFamilyTokens, DensityTokens) to remain unchanged, so that tokens without mathematical relationships are not forced into an inappropriate pattern.

#### Acceptance Criteria

1. WHEN identifying tokens for refactoring, THEN the Token System SHALL exclude ColorTokens.ts from the refactoring scope
2. WHEN identifying tokens for refactoring, THEN the Token System SHALL exclude FontFamilyTokens.ts from the refactoring scope
3. WHEN identifying tokens for refactoring, THEN the Token System SHALL exclude DensityTokens.ts from the refactoring scope
4. WHEN categorical tokens are excluded, THEN the Token System SHALL document the rationale (no mathematical relationships to BASE_VALUE)

### Requirement 9: Verify AI-Readable Mathematical Relationships

**User Story**: As a design system architect, I want to verify that refactored formulas enable AI reasoning about token values, so that the system serves as a Rosetta Stone for AI-human collaboration.

#### Acceptance Criteria

1. WHEN a token is refactored to use a formula, THEN the Token System SHALL express the mathematical relationship as executable code in the baseValue property
2. WHEN a formula is evaluated programmatically, THEN the Token System SHALL produce the correct numeric value
3. WHEN a BASE_VALUE changes, THEN the Token System SHALL automatically recalculate all derived token values through formula evaluation
4. WHEN validating refactored tokens, THEN the Token System SHALL verify that the formula in code matches the formula described in the mathematicalRelationship string

### Requirement 10: Maintain Backward Compatibility with Token Consumers

**User Story**: As a component developer, I want the refactoring to be transparent to token consumers, so that existing code using tokens continues to work without changes.

#### Acceptance Criteria

1. WHEN tokens are refactored, THEN the Token System SHALL maintain the same exported token structure
2. WHEN a token consumer accesses a token's baseValue, THEN the Token System SHALL return the calculated numeric value (not the formula)
3. WHEN a token consumer accesses platform values, THEN the Token System SHALL return the same values as before refactoring
4. WHEN existing tests run against refactored tokens, THEN the Token System SHALL pass all existing tests without modification

---

## Out of Scope

The following items are explicitly out of scope for this specification:

1. **Cross-Token Dependencies**: LineHeight tokens referencing FontSize tokens (deferred to future work)
2. **Semantic Token Refactoring**: Changes to semantic tokens that compose primitive tokens
3. **New Token Creation**: Adding new primitive tokens beyond existing set
4. **BASE_VALUE Changes**: Modifying the actual BASE_VALUE numbers (e.g., changing SPACING_BASE_VALUE from 8 to 12)
5. **Platform Value Generation**: Changes to how platform-specific values are calculated
6. **Token Validation System**: Changes to the three-tier validation system
7. **Strategic Flexibility Tracking**: Changes to the ≥80% usage tracking system

---

*This requirements document establishes the foundation for converting primitive tokens from documentation-based to truth-based mathematical relationships, enabling reliable AI-human collaboration through executable formulas.*
