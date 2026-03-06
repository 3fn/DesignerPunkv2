# Requirements Document: Opacity Architecture Evolution

**Date**: 2026-03-06
**Spec**: 073 - Opacity Architecture Evolution
**Status**: Requirements Phase
**Dependencies**: None (foundational infrastructure)

---

## Introduction

This spec addresses two architectural gaps in the DesignerPunk token system: unintuitive opacity primitive naming and the inability to express composed tokens (a color at a specific opacity). The immediate motivator is the pagination container's dark translucent background (`rgba(0, 0, 0, 0.80)`), which cannot be expressed with the current `SemanticToken` interface. This spec establishes the infrastructure that Spec 072 (Pagination Container Styling) depends on.

---

## Requirements

### Requirement 1: Opacity Primitive Rename

**User Story**: As a design system contributor, I want opacity token names to directly represent their percentage value, so that I can use them without consulting a lookup table.

#### Acceptance Criteria

1. WHEN an opacity primitive token is defined THEN the token name SHALL use three-digit zero-padded percentage values (e.g., `opacity080` for 80% opacity).
2. WHEN the opacity primitive rename is applied THEN the system SHALL maintain the same 14 opacity values (0%, 8%, 16%, 24%, 32%, 40%, 48%, 56%, 64%, 72%, 80%, 88%, 96%, 100%) with no scale changes.
3. WHEN the rename is applied THEN all source code references to old opacity primitive names (opacity000–opacity1300) SHALL be updated to the new names (opacity000–opacity100).
4. WHEN the rename is applied THEN all test files referencing old opacity primitive names SHALL be updated and SHALL pass.
5. WHEN the rename is applied THEN shadow opacity primitives (`ShadowOpacityTokens.ts`) and glow opacity primitives (`GlowOpacityTokens.ts`) SHALL follow the same rename pattern.
6. WHEN the rename is applied THEN component platform files (Container-Base, Avatar-Base) SHALL have comment references updated to reflect new names. No functional code changes are required per Lina's audit (comment-only references).
7. WHEN the rename is applied THEN historical spec completion docs, old audit findings, and archived analysis documents SHALL NOT be modified.

### Requirement 2: Token Modifier Architecture

**User Story**: As a token system architect, I want to express "a color at a specific opacity" as a semantic token, so that composed values like scrim backgrounds maintain Rosetta traceability through the primitive→semantic reference chain.

#### Acceptance Criteria

1. The `SemanticToken` interface SHALL support an optional `modifiers` field of type `TokenModifier[]`.
2. The `TokenModifier` interface SHALL include a `type` field (starting with `'opacity'` only) and a `reference` field (primitive token name).
3. WHEN a semantic token has no `modifiers` field THEN the token system SHALL behave identically to the current system (backward compatible).
4. WHEN a semantic token has a `modifiers` array THEN the generator pipeline SHALL resolve modifiers in array order after resolving the base value from `primitiveReferences.value`.
5. WHEN a modifier has `type: 'opacity'` THEN the generator SHALL resolve the referenced opacity primitive and apply it as the alpha channel of the base color value.

### Requirement 3: Mode-Invariance Field

**User Story**: As a component developer, I want to know programmatically whether a semantic token changes between light/dark modes, so that I don't accidentally wrap mode-invariant tokens in mode-switching conditionals.

#### Acceptance Criteria

1. The `SemanticToken` interface SHALL support an optional `modeInvariant` field of type `boolean`.
2. WHEN `modeInvariant` is `true` THEN the token's resolved value SHALL be identical in all theme modes.
3. WHEN `modeInvariant` is `undefined` or `false` THEN the token MAY have different values per mode (existing behavior).
4. WHEN a token is marked `modeInvariant: true` AND references a mode-aware primitive (one that shifts between light/dark) THEN the `SemanticTokenValidator` SHALL flag this as a suspicious configuration.

### Requirement 4: Scrim Semantic Token

**User Story**: As a component developer, I want a semantic token for dark translucent overlay backgrounds, so that I can apply consistent scrim styling across components (pagination pills, modal backdrops, floating toolbars) without hard-coding RGBA values.

#### Acceptance Criteria

1. The system SHALL define `color.scrim.standard` as a semantic color token.
2. `color.scrim.standard` SHALL compose `black500` with `opacity080` using the modifier pattern.
3. `color.scrim.standard` SHALL be marked `modeInvariant: true`.
4. WHEN resolved for web THEN `color.scrim.standard` SHALL output `rgba(0, 0, 0, 0.80)`.
5. WHEN resolved for iOS THEN `color.scrim.standard` SHALL output `UIColor(red: 0, green: 0, blue: 0, alpha: 0.80)`.
6. WHEN resolved for Android THEN `color.scrim.standard` SHALL output `Color(0f, 0f, 0f, 0.80f)`.

### Requirement 5: Validator Updates

**User Story**: As a token system maintainer, I want validators to enforce correctness of modifier references and mode-invariance annotations, so that invalid token configurations are caught at definition time rather than at runtime.

#### Acceptance Criteria

1. WHEN a semantic token has a modifier with `type: 'opacity'` THEN the `PrimitiveReferenceValidator` SHALL verify the `reference` field points to a valid opacity primitive token.
2. WHEN a modifier references a non-existent primitive THEN the validator SHALL report an error.
3. WHEN a modifier references a primitive of the wrong family (e.g., a color primitive in an opacity modifier) THEN the validator SHALL report an error.
4. WHEN a token is marked `modeInvariant: true` AND references a mode-aware primitive THEN the `SemanticTokenValidator` SHALL report a warning.

### Requirement 6: Generator Updates

**User Story**: As a platform developer, I want the DTCG and platform generators to resolve modifier-based tokens into platform-native values, so that composed tokens like scrims produce correct output without manual intervention.

#### Acceptance Criteria

1. WHEN the DTCG generator encounters a semantic token with modifiers THEN it SHALL resolve the base value, apply modifiers in order, and output the composed value.
2. WHEN the web generator resolves a modifier-based color token THEN it SHALL output an `rgba()` CSS value with the opacity applied as the alpha channel.
3. WHEN the iOS generator resolves a modifier-based color token THEN it SHALL output a `UIColor(red:green:blue:alpha:)` value.
4. WHEN the Android generator resolves a modifier-based color token THEN it SHALL output a Compose `Color(red, green, blue, alpha)` value.
5. WHEN a semantic token has no modifiers THEN all generators SHALL produce identical output to the current system (backward compatible).

### Requirement 7: Documentation Updates

**User Story**: As a design system contributor, I want steering documentation to reflect the renamed opacity primitives and new scrim concept, so that governance docs remain accurate and authoritative.

#### Acceptance Criteria

1. `Token-Family-Opacity.md` SHALL be rewritten to use the new opacity naming convention (000–100).
2. `Token-Family-Color.md` SHALL include a Scrim Concept section documenting `color.scrim.*` tokens, their mode-invariance, and the modifier pattern.
3. `Token-Family-Glow.md` SHALL have opacity primitive references updated to the new naming convention.
4. `rosetta-system-principles.md`, `Token-Family-Color.md`, and `DTCG-Integration-Guide.md` SHALL have minor opacity name references updated.
5. `docs/token-system-overview.md` SHALL be updated to reflect the new naming convention.
6. All steering doc updates SHALL follow the ballot measure process.

### Requirement 8: Modifier Extensibility Governance

**User Story**: As a governance steward, I want a documented gate for adding future modifier types, so that the modifier pattern doesn't grow ungoverned.

#### Acceptance Criteria

1. Steering documentation SHALL include criteria for when a new modifier type is justified (e.g., multiple components need the transformation, no existing pattern covers the use case, the transformation is mathematically composable).
2. The governance gate SHALL require Peter's approval before a new modifier type is added.
3. The governance documentation SHALL be established via ballot measure.

---

## Documentation Requirements

This spec introduces new token patterns (modifiers, mode-invariance) and modifies an existing token family (opacity). Per Process-Spec-Planning documentation requirements:

**Token work documentation required**:
- Token-Family-Opacity.md rewrite (Requirement 7, AC 1)
- Token-Family-Color.md scrim section (Requirement 7, AC 2)
- Modifier extensibility governance (Requirement 8)
- Token-Semantic-Structure.md modifier pattern documentation

**Waiver**: No component README updates required — this spec does not introduce or modify components. Component documentation updates will occur in Spec 072 when `color.scrim.standard` is consumed.
