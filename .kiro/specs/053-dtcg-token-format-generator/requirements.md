# Requirements Document: DTCG Token Format Generator

**Date**: February 17, 2026
**Spec**: 053 - DTCG Token Format Generator
**Status**: Requirements Phase
**Dependencies**: None (foundational spec)

---

## Introduction

DesignerPunk's Rosetta System defines tokens with mathematical relationships, primitive→semantic hierarchy, and platform-specific implementations. However, these tokens are currently only consumable within the DesignerPunk ecosystem. The DTCG (Design Tokens Community Group) format is the emerging industry standard for design token interchange, enabling integration with external tools like Figma, Style Dictionary, Tokens Studio, and Terrazzo.

This spec establishes the DTCG Token Format Generator, which transforms Rosetta tokens into DTCG-compliant JSON output. This positions DesignerPunk as a first-class citizen in the design systems ecosystem and enables the Code → Figma → Spec workflow critical for design validation.

**Key Architectural Principles:**
- Code (Rosetta) remains the source of truth
- DTCG output is a parallel export for external tools (not a replacement for TypeScript sources)
- DesignerPunk-specific concepts (formulas, mathematical relationships, governance) are preserved via extensions
- Transformer architecture enables tool-specific outputs (Figma, Sketch, Adobe, etc.)

---

## Requirements

### Requirement 1: DTCG Format Compliance

**User Story:** As a design systems engineer, I want DesignerPunk tokens exported in DTCG format, so that I can integrate with industry-standard design tools.

#### Acceptance Criteria

1. THE DTCGFormatGenerator SHALL generate output conforming to DTCG Format Module 2025.10 specification
2. THE generated output SHALL include the `$schema` property referencing `https://tr.designtokens.org/format/`
3. THE generated output SHALL validate against the DTCG JSON schema without errors
4. WHEN a token type has a direct DTCG equivalent, THE generator SHALL use the standard DTCG type (not extensions)
5. THE generated output SHALL be valid JSON parseable by standard JSON parsers

### Requirement 2: Token Type Coverage

**User Story:** As a design systems engineer, I want all Rosetta token types exported to DTCG, so that external tools have access to the complete token system.

#### Acceptance Criteria

1. THE generator SHALL export all primitive token families (spacing, color, font size, font weight, font family, line height, letter spacing, radius, border width, tap area, density, breakpoint, opacity, duration, easing, scale, blend, shadow primitives, glow primitives)
2. THE generator SHALL export all semantic token families (color, spacing, typography, shadow, border width, radius, opacity, blend, motion, icon, accessibility, grid spacing, z-index, elevation, progress color)
3. WHEN a Rosetta token type maps to a DTCG type, THE generator SHALL use the correct DTCG type (`color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `shadow`, `typography`, `transition`)
4. WHEN a token is deprecated, THE generator SHALL include it in the output with deprecation metadata (unless `includeDeprecated: false`)
5. THE generator SHALL export at least 240 primitive tokens and 199 semantic tokens (programmatically validated)

### Requirement 3: Primitive-Semantic Hierarchy Preservation

**User Story:** As a design systems engineer, I want the primitive→semantic token hierarchy preserved in DTCG output, so that external tools understand token relationships.

#### Acceptance Criteria

1. WHEN a semantic token references a primitive token, THE generator SHALL use DTCG alias syntax (`{token.path}`)
2. THE generator SHALL NOT resolve aliases to final values by default (preserves hierarchy)
3. WHEN `resolveAliases: true` configuration is set, THE generator SHALL resolve all alias references to final values
4. THE generator SHALL organize tokens into logical groups (e.g., `space`, `color`, `fontSize`) matching Rosetta structure
5. WHEN a token has a `$description`, THE generator SHALL include it in the DTCG output

### Requirement 4: DesignerPunk Extensions

**User Story:** As a design systems engineer, I want DesignerPunk-specific metadata preserved in DTCG output, so that mathematical relationships and governance rules are not lost.

#### Acceptance Criteria

1. THE generator SHALL include `$extensions.designerpunk` metadata for all tokens
2. WHEN a token has a mathematical formula, THE generator SHALL include `$extensions.designerpunk.formula` (e.g., "base × 2 = 8 × 2 = 16")
3. WHEN a token belongs to a family, THE generator SHALL include `$extensions.designerpunk.family` (e.g., "spacing", "color")
4. WHEN a token has a base value, THE generator SHALL include `$extensions.designerpunk.baseValue` (e.g., 8 for spacing)
5. WHEN a token has blend operations, THE generator SHALL include `$extensions.designerpunk.blendType` (e.g., "darkerBlend", "lighterBlend")
6. WHEN a token has platform-specific behavior, THE generator SHALL include `$extensions.designerpunk.platforms` with capability flags
7. WHEN a token is deprecated, THE generator SHALL include `$extensions.designerpunk.deprecated`, `deprecatedReason`, and `deprecatedSince`
8. WHEN a token has partial support (e.g., glow primitives only), THE generator SHALL include `$extensions.designerpunk.status: "partial"`

### Requirement 5: Shadow and Glow Token Handling

**User Story:** As a design systems engineer, I want shadow and glow tokens exported correctly, so that external tools can render depth and emphasis effects.

#### Acceptance Criteria

1. WHEN generating shadow tokens, THE generator SHALL merge shadow color and opacity into a single DTCG color value (replace color's alpha with shadow's opacity)
2. WHEN a shadow references a semantic color with embedded opacity, THE generator SHALL override the color's alpha with the shadow's opacity (shadow opacity is authoritative)
3. THE generator SHALL export shadow compositions as DTCG `shadow` type with properties: `offsetX`, `offsetY`, `blur`, `spread`, `color`
4. THE generator SHALL set `spread` to `0px` for all shadows (DesignerPunk doesn't use spread)
5. WHEN a shadow has Android elevation metadata, THE generator SHALL include it in `$extensions.designerpunk.android.elevation`
6. THE generator SHALL export glow primitives (blur, opacity, color) individually with `$extensions.designerpunk.glowType: "emission"`
7. THE generator SHALL mark glow tokens with `$extensions.designerpunk.status: "partial"` (composed glows not yet implemented)

### Requirement 6: Composite Token Handling

**User Story:** As a design systems engineer, I want composite tokens (typography, motion) exported correctly, so that external tools can apply complete styles.

#### Acceptance Criteria

1. THE generator SHALL export typography compositions as DTCG `typography` type with properties: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`
2. THE generator SHALL export motion compositions as DTCG `transition` type with properties: `duration`, `timingFunction`, `delay`
3. WHEN a motion composition doesn't define delay, THE generator SHALL default to `0ms`
4. WHEN a motion composition has a scale property, THE generator SHALL include it in `$extensions.designerpunk.scale`
5. THE generator SHALL preserve alias references in composite token properties (e.g., `"fontFamily": "{fontFamily.body}"`)

### Requirement 7: Output File Generation

**User Story:** As a design systems engineer, I want DTCG output written to a standard location, so that external tools can reliably find it.

#### Acceptance Criteria

1. THE generator SHALL write output to `dist/DesignTokens.dtcg.json`
2. WHEN `prettyPrint: true` configuration is set, THE generator SHALL format JSON with 2-space indentation
3. WHEN `prettyPrint: false` configuration is set, THE generator SHALL output minified JSON
4. THE generator SHALL create the `dist/` directory if it doesn't exist
5. THE generator SHALL overwrite existing `DesignTokens.dtcg.json` without prompting (generation is idempotent)

### Requirement 8: Transformer Architecture

**User Story:** As a developer, I want a transformer interface for tool-specific outputs, so that I can add new export formats without modifying the DTCG generator.

#### Acceptance Criteria

1. THE system SHALL provide an `ITokenTransformer` interface with methods: `transform()`, `canTransform()`, and `config` property
2. THE system SHALL provide a `TransformerRegistry` class with methods: `register()`, `get()`, `getAll()`, `transform()`, `transformAll()`
3. WHEN a transformer is registered, THE registry SHALL store it by its `config.id`
4. WHEN `transform(id, dtcgTokens)` is called, THE registry SHALL invoke the transformer with the specified ID
5. WHEN `transformAll(dtcgTokens)` is called, THE registry SHALL invoke all registered transformers and return an array of results
6. THE transformer interface SHALL accept `DTCGTokenFile` as input and return `TransformResult` with properties: `content`, `filename`, `warnings`

### Requirement 9: Configuration Options

**User Story:** As a design systems engineer, I want configuration options for DTCG generation, so that I can customize output for different use cases.

#### Acceptance Criteria

1. THE generator SHALL accept a `DTCGGeneratorConfig` with properties: `includeExtensions`, `includeDeprecated`, `prettyPrint`, `schemaUrl`, `resolveAliases`
2. WHEN `includeExtensions: false`, THE generator SHALL omit `$extensions.designerpunk` from all tokens
3. WHEN `includeDeprecated: false`, THE generator SHALL exclude deprecated tokens from output
4. WHEN `resolveAliases: true`, THE generator SHALL resolve all alias references to final values (not recommended, breaks hierarchy)
5. THE generator SHALL use default configuration values when not explicitly provided: `includeExtensions: true`, `includeDeprecated: true`, `prettyPrint: true`, `schemaUrl: "https://tr.designtokens.org/format/"`, `resolveAliases: false`

### Requirement 10: Token Count Validation

**User Story:** As a design systems engineer, I want validation that all tokens are exported, so that I can detect missing tokens early.

#### Acceptance Criteria

1. THE generator SHALL programmatically count primitive tokens using `getAllPrimitiveTokens().length`
2. THE generator SHALL programmatically count semantic tokens using `getAllSemanticTokens().length`
3. WHEN generation completes, THE generator SHALL log token counts: "Generated X primitive tokens, Y semantic tokens"
4. WHEN a token category is accidentally skipped, THE generator SHALL detect the missing tokens via count comparison
5. THE generator SHALL validate that at least 240 primitive tokens and 199 semantic tokens are exported (fail if counts are significantly lower)

### Requirement 11: Documentation Requirements

**User Story:** As a developer integrating DesignerPunk with external tools, I want documentation on DTCG output, so that I can understand the format and use it correctly.

#### Acceptance Criteria

1. THE system SHALL provide a DTCG Integration Guide documenting: file location, DTCG format overview, DesignerPunk extensions schema, integration with Style Dictionary, integration with Tokens Studio
2. THE system SHALL provide a Transformer Development Guide documenting: ITokenTransformer interface, TransformerRegistry usage, example transformer implementations
3. THE system SHALL provide an MCP Integration Guide documenting: how to load and parse DTCG tokens, how to query specific tokens by path, how to use transformers for tool-specific formats
4. THE DTCG Integration Guide SHALL include a section titled "For DesignerPunk Component Developers" clarifying that DTCG output is for external tool integration (components continue importing TypeScript sources)
5. THE documentation SHALL include examples of DTCG output for each token type (color, dimension, shadow, typography, etc.)

### Requirement 12: Error Handling

**User Story:** As a design systems engineer, I want clear error messages when generation fails, so that I can diagnose and fix issues quickly.

#### Acceptance Criteria

1. WHEN a token has an invalid type, THE generator SHALL throw an error with the token name and invalid type
2. WHEN a token has an invalid value, THE generator SHALL throw an error with the token name and invalid value
3. WHEN shadow color merge fails (invalid color format), THE generator SHALL throw an error with the shadow name and color value
4. WHEN file write fails, THE generator SHALL throw an error with the file path and system error message
5. THE generator SHALL NOT silently skip tokens (all tokens must be exported or fail with error)

---

## Related Documentation

- Design Outline: `.kiro/specs/053-dtcg-token-format-generator/design-outline.md`
- DTCG Specification: https://tr.designtokens.org/format/ (Format Module 2025.10)
- Rosetta System Architecture: `.kiro/steering/Rosetta-System-Architecture.md`
- Token Governance: `.kiro/steering/Token-Governance.md`
