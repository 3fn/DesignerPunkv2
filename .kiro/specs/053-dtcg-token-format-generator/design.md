# Design Document: DTCG Token Format Generator

**Date**: February 17, 2026
**Spec**: 053 - DTCG Token Format Generator
**Status**: Design Phase
**Dependencies**: None (foundational spec)

---

## Overview

The DTCG Token Format Generator transforms DesignerPunk's Rosetta System tokens into DTCG (Design Tokens Community Group) Format Module 2025.10 compliant JSON. This enables integration with industry-standard design tools (Figma, Style Dictionary, Tokens Studio, Terrazzo) while preserving DesignerPunk's mathematical foundations and governance rules through extensions.

**Core Architecture:**
- `DTCGFormatGenerator` — Main generator class that orchestrates token transformation
- `ITokenTransformer` — Interface for tool-specific transformers (e.g., FigmaTransformer in Spec 054)
- `TransformerRegistry` — Registry pattern for managing and invoking transformers
- `DTCGTokenFile` — TypeScript types representing DTCG structure

**Output:**
- `dist/DesignTokens.dtcg.json` — Canonical DTCG format (this spec)
- `dist/DesignTokens.figma.json` — Figma-specific format (Spec 054, uses transformer)
- Future: Additional tool-specific formats via transformers

**Key Principle:** DTCG output is a parallel export for external tools. DesignerPunk components continue importing tokens from TypeScript sources. Code (Rosetta) remains the source of truth.

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Rosetta System                              │
│                                                                 │
│  Token TypeScript Sources                                       │
│  ├── primitive/SpacingTokens.ts                                 │
│  ├── primitive/ColorTokens.ts                                   │
│  ├── semantic/ColorTokens.ts                                    │
│  └── ... (24 primitive files, 15+ semantic categories)          │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │ DTCGFormatGenerator    │                         │
│              │                        │                         │
│              │ - generate()           │                         │
│              │ - generateSpacing()    │                         │
│              │ - generateColor()      │                         │
│              │ - generateShadow()     │                         │
│              │ - generateTypography() │                         │
│              │ - mergeShadowColor()   │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│                  DesignTokens.dtcg.json                         │
│                  (DTCG Format Module 2025.10)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (consumed by)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Transformer Architecture                           │
│                                                                 │
│  ┌──────────────────────┐                                       │
│  │ TransformerRegistry  │                                       │
│  │                      │                                       │
│  │ - register()         │                                       │
│  │ - get()              │                                       │
│  │ - transform()        │                                       │
│  │ - transformAll()     │                                       │
│  └──────────────────────┘                                       │
│              │                                                  │
│              ├─────────────┬─────────────┬─────────────┐        │
│              ▼             ▼             ▼             ▼        │
│      FigmaTransformer  SketchTrans   AdobeTrans   CustomTrans  │
│      (Spec 054)        (Future)      (Future)     (Future)     │
│              │                                                  │
│              ▼                                                  │
│      DesignTokens.figma.json                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Token Collection**: Generator reads Rosetta token TypeScript sources
2. **Type Mapping**: Maps Rosetta types to DTCG types (dimension, color, number, etc.)
3. **Value Transformation**: Converts values to DTCG format (hex colors, unitless dimensions)
4. **Extension Addition**: Adds DesignerPunk metadata ($extensions.designerpunk)
5. **Alias Preservation**: Maintains primitive→semantic references using {token.path} syntax
6. **Composite Handling**: Merges shadow color+opacity, composes typography/motion
7. **JSON Generation**: Writes formatted JSON to dist/DesignTokens.dtcg.json
8. **Transformer Invocation** (optional): Registered transformers consume DTCG output

---

## Components and Interfaces

### DTCGFormatGenerator

**Purpose**: Main generator class that orchestrates token transformation from Rosetta to DTCG format.

**Location**: `src/generators/DTCGFormatGenerator.ts`

**Configuration**:
```typescript
interface DTCGGeneratorConfig {
  /** Include DesignerPunk extensions */
  includeExtensions: boolean;
  /** Include deprecated tokens */
  includeDeprecated: boolean;
  /** Pretty print output */
  prettyPrint: boolean;
  /** Schema URL to include */
  schemaUrl: string;
  /** Resolve aliases to final values (default: false, preserves alias references) */
  resolveAliases: boolean;
}
```

**Public Methods**:
```typescript
class DTCGFormatGenerator {
  constructor(config: DTCGGeneratorConfig);
  
  /** Generate DTCG-compliant JSON from Rosetta tokens */
  generate(): DTCGTokenFile;
  
  /** Write output to file */
  writeToFile(outputPath: string): void;
}
```

**Private Methods** (one per token category):
```typescript
private generateRootExtensions(): DTCGExtensions;
private generateSpacingTokens(): DTCGGroup;
private generateColorTokens(): DTCGGroup;
private generateFontSizeTokens(): DTCGGroup;
private generateFontWeightTokens(): DTCGGroup;
private generateFontFamilyTokens(): DTCGGroup;
private generateLineHeightTokens(): DTCGGroup;
private generateLetterSpacingTokens(): DTCGGroup;
private generateRadiusTokens(): DTCGGroup;
private generateBorderWidthTokens(): DTCGGroup;
private generateTapAreaTokens(): DTCGGroup;
private generateDensityTokens(): DTCGGroup;
private generateBreakpointTokens(): DTCGGroup;
private generateOpacityTokens(): DTCGGroup;
private generateDurationTokens(): DTCGGroup;
private generateEasingTokens(): DTCGGroup;
private generateScaleTokens(): DTCGGroup;
private generateBlendTokens(): DTCGGroup;
private generateShadowTokens(): DTCGGroup;
private generateGlowTokens(): DTCGGroup;
private generateTypographyTokens(): DTCGGroup;
private generateMotionTokens(): DTCGGroup;
private generateZIndexTokens(): DTCGGroup;
private generateElevationTokens(): DTCGGroup;

/** Helper: Merge shadow color and opacity into single RGBA value */
private mergeShadowColor(colorRgba: string, opacity: number): string;

/** Helper: Convert Rosetta token to DTCG token with extensions */
private toDTCGToken(rosettaToken: any, type: DTCGType): DTCGToken;

/** Helper: Validate token counts match expected */
private validateTokenCounts(output: DTCGTokenFile): void;
```

---

### ITokenTransformer Interface

**Purpose**: Interface for tool-specific transformers that consume DTCG output and produce tool-specific formats.

**Location**: `src/generators/transformers/ITokenTransformer.ts`

**Interface Definition**:
```typescript
interface TransformerConfig {
  /** Transformer identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Output file extension */
  outputExtension: string;
  /** Whether to include extensions in output */
  includeExtensions: boolean;
}

interface TransformResult {
  /** Transformed content as string */
  content: string;
  /** Output filename */
  filename: string;
  /** Any warnings during transformation */
  warnings: string[];
}

interface ITokenTransformer {
  /** Transformer configuration */
  readonly config: TransformerConfig;
  
  /** Transform DTCG tokens to target format */
  transform(dtcgTokens: DTCGTokenFile): TransformResult;
  
  /** Validate transformer can handle the input */
  canTransform(dtcgTokens: DTCGTokenFile): boolean;
}
```

**Usage Example** (Spec 054 will implement this):
```typescript
export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables',
    outputExtension: '.figma.json',
    includeExtensions: false
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    // Transform DTCG to Figma Variables API format
    const figmaFormat = this.convertToFigmaFormat(dtcgTokens);
    return {
      content: JSON.stringify(figmaFormat, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: []
    };
  }
  
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return true; // Figma can handle all DTCG tokens
  }
}
```

---

### TransformerRegistry

**Purpose**: Registry pattern for managing and invoking transformers.

**Location**: `src/generators/transformers/TransformerRegistry.ts`

**Class Definition**:
```typescript
class TransformerRegistry {
  private transformers: Map<string, ITokenTransformer> = new Map();
  
  /** Register a transformer */
  register(transformer: ITokenTransformer): void {
    this.transformers.set(transformer.config.id, transformer);
  }
  
  /** Get transformer by ID */
  get(id: string): ITokenTransformer | undefined {
    return this.transformers.get(id);
  }
  
  /** Get all registered transformers */
  getAll(): ITokenTransformer[] {
    return Array.from(this.transformers.values());
  }
  
  /** Transform DTCG tokens using specified transformer */
  transform(id: string, dtcgTokens: DTCGTokenFile): TransformResult {
    const transformer = this.get(id);
    if (!transformer) {
      throw new Error(`Transformer not found: ${id}`);
    }
    if (!transformer.canTransform(dtcgTokens)) {
      throw new Error(`Transformer ${id} cannot handle input`);
    }
    return transformer.transform(dtcgTokens);
  }
  
  /** Transform DTCG tokens using all registered transformers */
  transformAll(dtcgTokens: DTCGTokenFile): TransformResult[] {
    return this.getAll()
      .filter(t => t.canTransform(dtcgTokens))
      .map(t => t.transform(dtcgTokens));
  }
}

// Singleton instance
export const transformerRegistry = new TransformerRegistry();
```

---

## Data Models

### DTCGTokenFile

**Purpose**: TypeScript representation of DTCG format structure.

**Location**: `src/generators/types/DTCGTypes.ts`

**Type Definitions**:
```typescript
type DTCGType = 
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'typography'
  | 'transition';

interface DTCGToken {
  $value: any;
  $type?: DTCGType;
  $description?: string;
  $extensions?: {
    designerpunk?: DesignerPunkExtensions;
  };
}

interface DesignerPunkExtensions {
  /** Mathematical formula (e.g., "base × 2 = 8 × 2 = 16") */
  formula?: string;
  /** Token family (e.g., "spacing", "color") */
  family?: string;
  /** Base value for mathematical relationships */
  baseValue?: number;
  /** Blend operation type */
  blendType?: 'darkerBlend' | 'lighterBlend' | 'contrastBlend';
  /** Glow type (for glow tokens) */
  glowType?: 'emission';
  /** Platform-specific capability flags */
  platforms?: {
    web?: { supported: boolean; note?: string };
    ios?: { supported: boolean; note?: string };
    android?: { supported: boolean; note?: string; elevation?: number };
  };
  /** Deprecation metadata */
  deprecated?: boolean;
  deprecatedReason?: string;
  deprecatedSince?: string;
  /** Partial support status */
  status?: 'partial';
  /** Primitive token references (for composite tokens) */
  primitiveRefs?: Record<string, string>;
}

interface DTCGGroup {
  $type?: DTCGType;
  $description?: string;
  [key: string]: DTCGToken | DTCGGroup | string | undefined;
}

interface DTCGTokenFile {
  $schema: string;
  $extensions?: {
    designerpunk?: {
      version: string;
      generatedAt: string;
      rosettaVersion: string;
    };
  };
  [key: string]: DTCGGroup | string | object | undefined;
}
```

---

## Correctness Properties

### Property 1: DTCG Schema Compliance

*For any* generated DTCG output, it SHALL validate against the DTCG Format Module 2025.10 JSON schema without errors.

**Validates**: Requirements 1.1, 1.3

**Test approach**: Use DTCG schema validator library to validate generated output.

---

### Property 2: Token Completeness

*For any* Rosetta token source file, there SHALL be a corresponding generation method in DTCGFormatGenerator that exports those tokens.

**Validates**: Requirements 2.1, 2.2

**Test approach**: Compare count of token source files to count of generation methods. Validate programmatic token counts match expected minimums (240 primitives, 199 semantics).

---

### Property 3: Alias Preservation

*For any* semantic token that references a primitive token, the DTCG output SHALL use alias syntax (`{token.path}`) when `resolveAliases: false`.

**Validates**: Requirements 3.1, 3.2

**Test approach**: Parse generated DTCG output, verify semantic tokens use `{...}` syntax for primitive references.

---

### Property 4: Extension Completeness

*For any* token with DesignerPunk-specific metadata (formula, family, base value, blend type, platform flags, deprecation), the DTCG output SHALL include corresponding `$extensions.designerpunk` properties when `includeExtensions: true`.

**Validates**: Requirements 4.1-4.8

**Test approach**: Verify tokens with known metadata have corresponding extension properties in output.

---

### Property 5: Shadow Color-Opacity Merge

*For any* shadow token, the DTCG output color value SHALL have its alpha channel replaced with the shadow's opacity value (not multiplied).

**Validates**: Requirements 5.1, 5.2

**Test approach**: Verify shadow color RGBA alpha matches shadow opacity primitive, not color primitive's alpha.

---

### Property 6: Composite Token Structure

*For any* composite token (shadow, typography, transition), the DTCG output SHALL include all required properties for that DTCG type.

**Validates**: Requirements 5.3, 6.1, 6.2

**Test approach**: Verify shadow has offsetX/offsetY/blur/spread/color, typography has fontFamily/fontSize/fontWeight/lineHeight/letterSpacing, transition has duration/timingFunction/delay.

---

## Error Handling

### Invalid Token Type

**Scenario**: A token has a type that doesn't map to any DTCG type.

**Handling**: Throw error with token name and invalid type.

**Example**:
```typescript
throw new Error(`Invalid token type for ${tokenName}: ${tokenType}. No DTCG mapping exists.`);
```

---

### Invalid Token Value

**Scenario**: A token has a value that can't be converted to DTCG format (e.g., malformed color).

**Handling**: Throw error with token name and invalid value.

**Example**:
```typescript
throw new Error(`Invalid token value for ${tokenName}: ${tokenValue}. Expected valid color format.`);
```

---

### Shadow Color Merge Failure

**Scenario**: Shadow color is not in valid RGBA format for merging with opacity.

**Handling**: Throw error with shadow name and color value.

**Example**:
```typescript
throw new Error(`Shadow color merge failed for ${shadowName}: ${colorValue}. Expected rgba(r, g, b, a) format.`);
```

---

### File Write Failure

**Scenario**: Cannot write to `dist/DesignTokens.dtcg.json` (permissions, disk full, etc.).

**Handling**: Throw error with file path and system error message.

**Example**:
```typescript
throw new Error(`Failed to write DTCG output to ${outputPath}: ${error.message}`);
```

---

### Token Count Validation Failure

**Scenario**: Generated token count is significantly lower than expected (indicates missing tokens).

**Handling**: Throw error with expected vs actual counts.

**Example**:
```typescript
throw new Error(`Token count validation failed. Expected at least 240 primitives, got ${actualCount}.`);
```

---

## Testing Strategy

### Unit Tests

**Location**: `src/generators/__tests__/DTCGFormatGenerator.test.ts`

**Coverage**:
1. **DTCG schema validation** — Generated output validates against DTCG schema
2. **Token type mapping** — Each Rosetta type maps to correct DTCG type
3. **Alias preservation** — Semantic tokens use `{...}` syntax for primitive references
4. **Extension inclusion** — Tokens with metadata have corresponding extensions
5. **Shadow color merge** — Shadow color alpha matches shadow opacity
6. **Composite token structure** — Shadow/typography/transition have all required properties
7. **Configuration options** — includeExtensions, includeDeprecated, resolveAliases work correctly
8. **Token count validation** — Programmatic counts match expected minimums
9. **Error handling** — Invalid types, values, merge failures throw appropriate errors

### Integration Tests

**Location**: `src/generators/__tests__/DTCGFormatGenerator.integration.test.ts`

**Coverage**:
1. **End-to-end generation** — Generate full DTCG output from Rosetta sources
2. **File write** — Output written to correct location with correct formatting
3. **Transformer integration** — TransformerRegistry can consume generated DTCG output
4. **Token completeness** — All token source files have corresponding output

### Property-Based Tests

**Location**: `src/generators/__tests__/DTCGFormatGenerator.property.test.ts`

**Coverage**:
1. **Property 1**: DTCG schema compliance
2. **Property 2**: Token completeness
3. **Property 3**: Alias preservation
4. **Property 4**: Extension completeness
5. **Property 5**: Shadow color-opacity merge
6. **Property 6**: Composite token structure

**Tag format**: `Feature: dtcg-generator, Property {number}: {property_text}`

---

## Design Decisions

### Decision 1: DTCG 2025.10 as Target Specification

**Options Considered:**
- A) Target DTCG 2025.10 (Candidate Recommendation, stable)
- B) Target earlier DTCG draft (more widely supported)
- C) Target future DTCG version (cutting edge)

**Decision:** Option A — Target DTCG 2025.10

**Rationale:**
- DTCG 2025.10 is marked as stable ("Further updates will be provided in superseding specifications")
- Provides comprehensive type coverage (12 types including composites)
- Widely supported by major tools (Style Dictionary, Tokens Studio, Terrazzo)
- Extensions mechanism allows DesignerPunk-specific metadata without breaking compliance

**Trade-offs:**
- Some tools may not support 2025.10 yet (can fall back to earlier versions via transformers)
- Future DTCG versions may introduce breaking changes (can update generator when needed)

---

### Decision 2: Preserve Aliases by Default

**Options Considered:**
- A) Always preserve aliases (`{token.path}` syntax)
- B) Always resolve aliases to final values
- C) Config option with aliases as default (`resolveAliases: boolean`, default `false`)

**Decision:** Option C — Config option with aliases as default

**Rationale:**
- Aliases preserve the primitive→semantic hierarchy that is central to DesignerPunk's architecture
- DTCG-aware tools handle alias resolution natively
- Resolved values lose the relationship information (can't tell which primitive a semantic references)
- When a downstream transformer (like FigmaTransformer) needs resolved values, it resolves aliases during transformation — not at the DTCG generation layer

**Trade-offs:**
- Some tools may not support aliases (can set `resolveAliases: true` for those cases)
- Resolved output is larger (duplicates primitive values in semantic tokens)

---

### Decision 3: Shadow Opacity Overrides Color Alpha

**Options Considered:**
- A) Shadow opacity overrides color alpha (replace)
- B) Shadow opacity multiplies color alpha (combine)
- C) Use color alpha if present, otherwise use shadow opacity

**Decision:** Option A — Shadow opacity overrides color alpha

**Rationale:**
- Shadow color primitives have alpha=1 by design (opacity is controlled separately)
- Separate opacity primitives provide mathematical relationships and independent control
- If a semantic color has embedded opacity (e.g., `color.overlay.background = rgba(0, 0, 0, 0.5)`), the shadow's opacity primitive should be authoritative (not multiplied)
- This matches designer intent: "I want this shadow at 30% opacity" means 30%, not 30% × 50% = 15%

**Trade-offs:**
- Requires careful merge logic (must parse RGBA and replace alpha)
- Edge case: if color alpha ≠ 1, the merge discards it (but this shouldn't happen by design)

---

### Decision 4: Glow Partial Support Acceptable

**Options Considered:**
- A) Add composed glow tokens before Spec 053
- B) Export glow primitives only, defer composed glows
- C) Omit glows entirely from DTCG output

**Decision:** Option B — Export glow primitives only

**Rationale:**
- Glows are "bright shadows" — structurally identical (offsetX, offsetY, blur, color)
- Glow primitives exist (blur, opacity, color), but composed glow tokens don't
- Adding composed glows is a token creation task (Ada's domain), not a generator task
- Partial support is acceptable for first release — downstream tools can still use glow primitives
- Document partial support with `$extensions.designerpunk.status: "partial"`

**Trade-offs:**
- Downstream tools won't get usable glow tokens (they need compositions, not primitives)
- But: glows might change during design validation anyway (visual design "sucks" per Peter)

---

### Decision 5: Programmatic Token Count Validation

**Options Considered:**
- A) Hard-code expected token counts (240 primitives, 199 semantics)
- B) Programmatic validation at generation time (`getAllPrimitiveTokens().length`)
- C) No validation (trust that all tokens are exported)

**Decision:** Option B — Programmatic validation

**Rationale:**
- Token counts are living values that change as the token system grows
- Hard-coded counts become stale and require manual updates
- Programmatic validation catches missing tokens automatically
- Can still validate against minimum thresholds (e.g., "at least 240 primitives")

**Trade-offs:**
- Requires `getAllPrimitiveTokens()` and `getAllSemanticTokens()` helper functions
- Doesn't catch if a specific token category is missing (only total count)
- But: better than hard-coded counts that go stale

---

### Decision 6: Transformer Architecture for Tool-Specific Outputs

**Options Considered:**
- A) DTCG generator produces all formats (DTCG, Figma, Sketch, etc.)
- B) DTCG generator produces canonical format, transformers produce tool-specific formats
- C) Each tool has its own generator (no shared DTCG layer)

**Decision:** Option B — Transformer architecture

**Rationale:**
- DTCG is the canonical interchange format (industry standard)
- Tool-specific formats are transformations of DTCG (not independent generations)
- Transformer interface enables extensibility (add new tools without modifying DTCG generator)
- Registry pattern provides discoverability and centralized management
- Spec 054 (Figma) validates the architecture immediately

**Trade-offs:**
- Adds abstraction layer (interface, registry)
- Transformers must handle DTCG format (can't customize earlier in pipeline)
- But: clean separation of concerns, extensible architecture

---

### Decision 7: Extensions Included by Default

**Options Considered:**
- A) Always include `$extensions.designerpunk`
- B) Never include extensions (pure DTCG)
- C) Config option with extensions as default (`includeExtensions: boolean`, default `true`)

**Decision:** Option C — Config option with extensions as default

**Rationale:**
- DesignerPunk-specific metadata (formulas, families, governance) is valuable for internal tools
- External tools can ignore extensions (DTCG spec allows this)
- Some tools may not support extensions (can set `includeExtensions: false`)
- Default to `true` because preserving metadata is more important than minimal output

**Trade-offs:**
- Output is larger with extensions
- Some tools may choke on unknown extensions (can disable if needed)

---

### Decision 8: Parallel Output Alongside Existing Generators

**Options Considered:**
- A) DTCG generator runs alongside existing platform generators (parallel output)
- B) DTCG becomes canonical source, existing generators consume DTCG
- C) Replace existing generators with DTCG + transformers

**Decision:** Option A — Parallel output

**Rationale:**
- Zero risk to existing pipeline (DTCG is additive, not a replacement)
- Existing platform generators (web CSS, iOS Swift, Android Kotlin) continue unchanged
- DesignerPunk components continue importing TypeScript sources (not DTCG)
- DTCG is the "outward-facing Rosetta Stone" for external tools
- Integration is just adding a few lines to `generate-platform-tokens.ts`

**Trade-offs:**
- Maintains two generation paths (Rosetta → platform files, Rosetta → DTCG)
- But: no risk of breaking existing workflow, DTCG is purely additive

---

## Related Documentation

- Requirements: `.kiro/specs/053-dtcg-token-format-generator/requirements.md`
- Design Outline: `.kiro/specs/053-dtcg-token-format-generator/design-outline.md`
- DTCG Specification: https://tr.designtokens.org/format/ (Format Module 2025.10)
- Rosetta System Architecture: `.kiro/steering/Rosetta-System-Architecture.md`
- Token Governance: `.kiro/steering/Token-Governance.md`
- Process-Spec-Planning: `.kiro/steering/Process-Spec-Planning.md`
