# Requirements Document: Inset Token Renaming

**Date**: November 25, 2025
**Spec**: 011 - Inset Token Renaming
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

This specification defines the renaming of inset spacing semantic tokens from subjective synonyms (tight, normal, comfortable, spacious, expansive, generous) to a numeric scale (050, 100, 150, 200, 300, 400) that exposes mathematical relationships and proportions. Component prop values will use an "inset" prefix (inset050, inset100, etc.) for clarity and AI-friendly context.

The renaming aligns with the mathematical foundation of the DesignerPunk token system, enabling developers and AI agents to reason about proportions and ratios without memorization.

---

## Glossary

- **Inset Spacing**: Internal spacing (padding) within containers and components
- **Semantic Token**: Token with contextual meaning that references primitive tokens
- **Primitive Token**: Base token with mathematical value (e.g., space050, space100)
- **Token Path**: Hierarchical reference to semantic token (e.g., space.inset.150)
- **Prop Value**: Value used in component props (e.g., padding="inset150")
- **Mathematical Relationship**: Proportional relationship between token values (e.g., 300 is 2× 150)

---

## Requirements

### Requirement 1: Token Definition Renaming

**User Story**: As a developer, I want inset token names to expose mathematical relationships, so that I can reason about proportions without memorization.

#### Acceptance Criteria

1. WHEN inset tokens are defined THEN the token system SHALL use numeric names (050, 100, 150, 200, 300, 400) instead of subjective synonyms
2. WHEN a developer references a token path THEN the system SHALL use the format space.inset.{number} (e.g., space.inset.150)
3. WHEN token values are compared THEN the numeric names SHALL clearly indicate mathematical relationships (e.g., 300 is 2× 150, 3× 100)
4. WHEN tokens are documented THEN the system SHALL include mathematical relationships in token descriptions

---

### Requirement 2: Component Prop Value Format

**User Story**: As a developer, I want component prop values to include context, so that I can understand what the value represents without looking up documentation.

#### Acceptance Criteria

1. WHEN a component accepts inset padding props THEN the prop values SHALL use "inset" prefix (inset050, inset100, inset150, inset200, inset300, inset400)
2. WHEN a developer uses a prop value THEN the value SHALL be self-documenting (e.g., padding="inset150" clearly indicates inset padding token 150)
3. WHEN TypeScript types are defined THEN the system SHALL use string literal unions with "inset" prefix
4. WHEN components map prop values to tokens THEN the system SHALL strip the "inset" prefix to resolve token paths (inset150 → space.inset.150)

---

### Requirement 3: Token Value Mapping

**User Story**: As a developer, I want token values to maintain their current pixel values, so that existing designs are not affected by the renaming.

#### Acceptance Criteria

1. WHEN tokens are renamed THEN the system SHALL maintain the same primitive token references (050 → space050, 100 → space100, etc.)
2. WHEN tokens are used in components THEN the system SHALL produce the same pixel values as before renaming
3. WHEN tokens are generated for platforms THEN the system SHALL output the same CSS/Swift/Kotlin values as before renaming
4. WHEN mathematical relationships are documented THEN the system SHALL accurately reflect the base multipliers (050 = 0.5× base, 100 = 1× base, 150 = 1.5× base, etc.)

---

### Requirement 4: Existing Component Migration

**User Story**: As a developer, I want existing components to be updated to use new token names, so that the codebase is consistent.

#### Acceptance Criteria

1. WHEN ButtonCTA component is updated THEN the component SHALL use new inset token prop values (inset050, inset100, etc.)
2. WHEN Icon component is updated THEN the component SHALL use new inset token prop values if applicable
3. WHEN components are migrated THEN the system SHALL maintain the same visual appearance and spacing
4. WHEN all components are updated THEN the system SHALL have no references to old token names (tight, normal, comfortable, spacious, expansive, generous)

---

### Requirement 5: Platform Generator Updates

**User Story**: As a developer, I want platform generators to output tokens with new names, so that generated code uses consistent naming.

#### Acceptance Criteria

1. WHEN web CSS is generated THEN the system SHALL output CSS custom properties with numeric names (--space-inset-050, --space-inset-100, etc.)
2. WHEN iOS Swift is generated THEN the system SHALL output Swift constants with numeric names (spaceInset050, spaceInset100, etc.)
3. WHEN Android Kotlin is generated THEN the system SHALL output Kotlin constants with numeric names (spaceInset050, spaceInset100, etc.)
4. WHEN generated code is used THEN the system SHALL produce the same visual results as before renaming

---

### Requirement 6: TypeScript Type Safety

**User Story**: As a developer, I want TypeScript to enforce valid inset token values, so that I cannot use invalid or non-existent tokens.

#### Acceptance Criteria

1. WHEN TypeScript types are defined THEN the system SHALL use string literal unions for inset padding values
2. WHEN a developer uses an invalid token value THEN TypeScript SHALL produce a type error
3. WHEN a developer uses autocomplete THEN the IDE SHALL show all valid inset token values (inset050, inset100, inset150, inset200, inset300, inset400)
4. WHEN TypeScript types are documented THEN the system SHALL include descriptions of what each value represents (pixel values and mathematical relationships)

---

### Requirement 7: Documentation Updates

**User Story**: As a developer, I want documentation to explain the new naming convention, so that I understand how to use inset tokens correctly.

#### Acceptance Criteria

1. WHEN token documentation is updated THEN the system SHALL explain the numeric naming convention and its benefits
2. WHEN token documentation is updated THEN the system SHALL include mathematical relationships between values
3. WHEN component documentation is updated THEN the system SHALL show examples using new prop values (padding="inset150")
4. WHEN migration guides are created THEN the system SHALL provide a mapping table from old names to new names

---

### Requirement 8: Test Updates

**User Story**: As a developer, I want tests to validate the new token names, so that I can be confident the renaming is correct.

#### Acceptance Criteria

1. WHEN semantic token tests are updated THEN the tests SHALL verify numeric token names exist (050, 100, 150, 200, 300, 400)
2. WHEN component tests are updated THEN the tests SHALL use new prop values (padding="inset150")
3. WHEN platform generator tests are updated THEN the tests SHALL verify generated output uses new token names
4. WHEN all tests are run THEN the system SHALL pass all tests with no references to old token names

---

### Requirement 9: Breaking Change Communication

**User Story**: As a developer, I want to be informed about the breaking change, so that I understand the impact and migration path.

#### Acceptance Criteria

1. WHEN the renaming is implemented THEN the system SHALL document this as a breaking change
2. WHEN migration guidance is provided THEN the system SHALL include a complete mapping table from old to new names
3. WHEN the change is communicated THEN the system SHALL explain the rationale (mathematical transparency, AI-friendly, proportion reasoning)
4. WHEN examples are provided THEN the system SHALL show before/after code snippets for common use cases

---

### Requirement 10: Layout Token Consistency

**User Story**: As a developer, I want layout tokens to remain unchanged, so that the semantic system for layout spacing is preserved.

#### Acceptance Criteria

1. WHEN inset tokens are renamed THEN the system SHALL NOT rename layout token density modifiers (tight, normal, loose)
2. WHEN layout tokens are used THEN the system SHALL maintain the two-level semantic structure (category + density)
3. WHEN layout token documentation is reviewed THEN the system SHALL confirm that grouped, related, separated, and sectioned categories remain unchanged
4. WHEN the token system is validated THEN the system SHALL verify that layout tokens and inset tokens use different naming conventions appropriately

---

## Token Mapping Reference

| Old Name | New Token Name | New Prop Value | Primitive Value | Mathematical Relationship |
|----------|----------------|----------------|-----------------|---------------------------|
| tight | 050 | inset050 | space050 (4px) | 0.5 × base (space100) |
| normal | 100 | inset100 | space100 (8px) | 1 × base (space100) |
| comfortable | 150 | inset150 | space150 (12px) | 1.5 × base (space100) |
| spacious | 200 | inset200 | space200 (16px) | 2 × base (space100) |
| expansive | 300 | inset300 | space300 (24px) | 3 × base (space100) |
| generous | 400 | inset400 | space400 (32px) | 4 × base (space100) |

---

## Success Criteria

The inset token renaming is successful when:

1. ✅ All inset tokens use numeric names (050, 100, 150, 200, 300, 400)
2. ✅ All component prop values use "inset" prefix (inset050, inset100, etc.)
3. ✅ All existing components (ButtonCTA, Icon) are updated to use new names
4. ✅ All platform generators output tokens with new names
5. ✅ All tests pass with no references to old token names
6. ✅ Documentation explains the new naming convention and provides migration guidance
7. ✅ TypeScript enforces valid token values through string literal types
8. ✅ Visual appearance and spacing remain unchanged after renaming
9. ✅ Layout tokens remain unchanged (tight, normal, loose preserved)
10. ✅ Developers and AI agents can reason about mathematical relationships between token values
