# DTCG Token Format Generator - Design Outline

**Date**: February 3, 2026
**Purpose**: Capture design decisions and architecture for DTCG-compliant token output
**Status**: Design Outline (Open Questions Resolved)
**Last Updated**: February 17, 2026

---

## Executive Summary

This design outline establishes the architecture for generating DTCG (Design Tokens Community Group) compliant token output from DesignerPunk's Rosetta System. DTCG is the emerging industry standard for design token interchange, and this spec positions DesignerPunk as a first-class citizen in the design systems ecosystem.

**Core Value Proposition:**
- **Industry standard compliance** — DesignerPunk tokens in a format recognized by the design systems community
- **Tool interoperability** — Compatible with Style Dictionary, Tokens Studio, Terrazzo, and other DTCG-aware tools
- **Transformer architecture** — Foundation for tool-specific outputs (Figma, Sketch, Adobe, etc.)

**Target Specification**: DTCG Format Module 2025.10 (CG-FINAL-format-20251028)

---

## Architecture Overview

### Layered Generation Architecture

The DTCG format serves as the canonical interchange layer between Rosetta and tool-specific transformers.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Rosetta System                              │
│                                                                 │
│  Token Definitions → DTCGFormatGenerator                        │
│                           │                                     │
│                           ▼                                     │
│                  DesignTokens.dtcg.json (canonical)             │
│                           │                                     │
│              ┌────────────┼────────────┬────────────┐           │
│              ▼            ▼            ▼            ▼           │
│     FigmaTransformer  SketchTrans  AdobeTrans  CustomTrans      │
│        (Spec 054)      (Future)    (Future)    (Future)         │
│              │                                                  │
│              ▼                                                  │
│     DesignTokens.figma.json                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Output Files

```
dist/
├── DesignTokens.dtcg.json      # Canonical DTCG format (THIS SPEC)
├── DesignTokens.web.css        # Existing
├── DesignTokens.ios.swift      # Existing
└── DesignTokens.android.kt     # Existing
```

---

## DTCG Specification Compliance

### Target Version

**DTCG Format Module 2025.10** (Candidate Recommendation, October 28, 2025)

Key quote from spec:
> "This specification is considered stable. Further updates will be provided in superseding specifications."

### Supported Token Types

| DTCG Type | DesignerPunk Mapping | Status |
|-----------|---------------------|--------|
| `color` | Color tokens (primitives + semantics) | ✅ Direct mapping |
| `dimension` | Spacing, radius, border-width, tap-area, breakpoint | ✅ Direct mapping |
| `fontFamily` | Font family tokens | ✅ Direct mapping |
| `fontWeight` | Font weight tokens | ✅ Direct mapping |
| `duration` | Duration tokens | ✅ Direct mapping |
| `cubicBezier` | Easing tokens | ✅ Direct mapping |
| `number` | Opacity, blend, scale, density, z-index, elevation | ✅ Direct mapping |
| `shadow` (composite) | Shadow compositions | ✅ Direct mapping |
| `typography` (composite) | Typography compositions | ✅ Direct mapping |
| `transition` (composite) | Motion compositions | ✅ Direct mapping |
| `gradient` (composite) | Not currently used | ⏸️ Future |
| `border` (composite) | Not currently used | ⏸️ Future |

### Extensions Required

DesignerPunk concepts not covered by DTCG core spec:

| Concept | Extension Key | Purpose |
|---------|--------------|---------|
| Mathematical formulas | `$extensions.designerpunk.formula` | Document token derivation |
| Token family | `$extensions.designerpunk.family` | Group tokens by category |
| Base value | `$extensions.designerpunk.baseValue` | Mathematical foundation |
| Blend operations | `$extensions.designerpunk.blendType` | darkerBlend, lighterBlend, etc. |
| Glow properties | `$extensions.designerpunk.glowType` | Glow-specific metadata (e.g., `"emission"`) |
| Platform hints | `$extensions.designerpunk.platforms` | Platform-specific capability flags and notes |
| Token deprecation | `$extensions.designerpunk.deprecated` | Deprecation status, reason, version |
| Partial support status | `$extensions.designerpunk.status` | Mark incomplete features (e.g., `"partial"` for glows) |

---

## DTCG Output Format

### File Structure

```json
{
  "$schema": "https://tr.designtokens.org/format/",
  "$extensions": {
    "designerpunk": {
      "version": "1.0.0",
      "generatedAt": "2026-02-03T12:00:00Z",
      "rosettaVersion": "1.0.0"
    }
  },
  "space": {
    "$type": "dimension",
    "$description": "Spacing tokens based on 8px baseline grid",
    "100": {
      "$value": "8px",
      "$description": "8px - base × 1",
      "$extensions": {
        "designerpunk": {
          "formula": "base × 1 = 8 × 1 = 8",
          "family": "spacing",
          "baseValue": 8
        }
      }
    },
    "200": {
      "$value": "16px",
      "$description": "16px - base × 2",
      "$extensions": {
        "designerpunk": {
          "formula": "base × 2 = 8 × 2 = 16",
          "family": "spacing",
          "baseValue": 8
        }
      }
    }
  },
  "color": {
    "$type": "color",
    "purple": {
      "300": {
        "$value": "#B026FF",
        "$description": "Primary brand purple",
        "$extensions": {
          "designerpunk": {
            "family": "color",
            "modes": {
              "light": { "base": "#B026FF", "wcag": "#B026FF" },
              "dark": { "base": "#B026FF", "wcag": "#B026FF" }
            }
          }
        }
      }
    },
    "primary": {
      "$value": "{color.purple.300}",
      "$description": "Primary brand color"
    }
  },
  "typography": {
    "$type": "typography",
    "bodyMd": {
      "$value": {
        "fontFamily": "{fontFamily.body}",
        "fontSize": "{fontSize.100}",
        "fontWeight": "{fontWeight.400}",
        "lineHeight": "{lineHeight.100}",
        "letterSpacing": "{letterSpacing.100}"
      },
      "$description": "Medium body text style"
    }
  }
}
```

### Alias Syntax

DTCG uses curly brace syntax for references:

```json
{
  "color": {
    "primary": {
      "$value": "{color.purple.300}"
    }
  }
}
```

This preserves the primitive→semantic hierarchy in the output.

---

## Transformer Architecture

### Interface Definition

```typescript
// src/generators/transformers/ITokenTransformer.ts

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

### Transformer Registry

```typescript
// src/generators/transformers/TransformerRegistry.ts

class TransformerRegistry {
  private transformers: Map<string, ITokenTransformer> = new Map();
  
  /** Register a transformer */
  register(transformer: ITokenTransformer): void;
  
  /** Get transformer by ID */
  get(id: string): ITokenTransformer | undefined;
  
  /** Get all registered transformers */
  getAll(): ITokenTransformer[];
  
  /** Transform DTCG tokens using specified transformer */
  transform(id: string, dtcgTokens: DTCGTokenFile): TransformResult;
  
  /** Transform DTCG tokens using all registered transformers */
  transformAll(dtcgTokens: DTCGTokenFile): TransformResult[];
}
```

### Adding New Transformers

Downstream specs (like 054) implement transformers by:

1. **Implement ITokenTransformer interface**
```typescript
// src/generators/transformers/FigmaTransformer.ts
export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables',
    outputExtension: '.figma.json',
    includeExtensions: false
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    // Transform DTCG to Figma Variables API format
  }
  
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return true; // Figma can handle all DTCG tokens
  }
}
```

2. **Register with TransformerRegistry**
```typescript
// src/generators/transformers/index.ts
import { FigmaTransformer } from './FigmaTransformer';

const registry = new TransformerRegistry();
registry.register(new FigmaTransformer());
```

3. **Output is generated automatically**
```
dist/DesignTokens.figma.json
```

---

## Downstream Dependencies

### How to Connect Transformers

Transformers consume `DesignTokens.dtcg.json` as input:

```typescript
// Example: Building a custom transformer

import { DTCGTokenFile } from '../types/DTCGTypes';
import { ITokenTransformer, TransformResult } from './ITokenTransformer';

export class MyCustomTransformer implements ITokenTransformer {
  readonly config = {
    id: 'my-custom',
    name: 'My Custom Format',
    outputExtension: '.custom.json',
    includeExtensions: true
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    // 1. Read DTCG structure
    const tokens = dtcgTokens;
    
    // 2. Transform to your format
    const customFormat = this.convertToCustomFormat(tokens);
    
    // 3. Return result
    return {
      content: JSON.stringify(customFormat, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: []
    };
  }
  
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return true;
  }
  
  private convertToCustomFormat(tokens: DTCGTokenFile): object {
    // Your transformation logic
  }
}
```

### When to Leverage DesignTokens.dtcg.json

| Use Case | Approach |
|----------|----------|
| **Tool integration** | Import DTCG file directly into DTCG-aware tools |
| **Custom transformer** | Read DTCG, transform to target format |
| **Token documentation** | Parse DTCG for automated docs generation |
| **Validation** | Validate against DTCG schema |
| **Diff/comparison** | Compare DTCG files across versions |

### MCP Integration Patterns

For MCP servers that need token data:

```typescript
// Pattern 1: Read DTCG file directly
const dtcgTokens = JSON.parse(
  fs.readFileSync('dist/DesignTokens.dtcg.json', 'utf-8')
);

// Pattern 2: Use transformer for tool-specific format
const registry = new TransformerRegistry();
const figmaTokens = registry.transform('figma', dtcgTokens);

// Pattern 3: Query specific tokens
function getToken(path: string): DTCGToken {
  const parts = path.split('.');
  let current = dtcgTokens;
  for (const part of parts) {
    current = current[part];
  }
  return current;
}
```

**MCP Server Integration Example:**

```typescript
// In an MCP server tool handler
async function handleGetTokens(params: { format?: string }) {
  const dtcgTokens = await loadDTCGTokens();
  
  if (params.format) {
    const transformer = registry.get(params.format);
    if (transformer) {
      return transformer.transform(dtcgTokens);
    }
  }
  
  return dtcgTokens; // Return DTCG format by default
}
```

---

## DTCGFormatGenerator Implementation

### Generator Structure

```typescript
// src/generators/DTCGFormatGenerator.ts

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

class DTCGFormatGenerator {
  constructor(private config: DTCGGeneratorConfig) {}
  
  /** Generate DTCG-compliant JSON from Rosetta tokens */
  generate(): DTCGTokenFile {
    const output: DTCGTokenFile = {
      $schema: this.config.schemaUrl,
      $extensions: this.generateRootExtensions()
    };
    
    // Generate each token category
    output.space = this.generateSpacingTokens();
    output.color = this.generateColorTokens();
    output.fontSize = this.generateFontSizeTokens();
    output.fontWeight = this.generateFontWeightTokens();
    output.fontFamily = this.generateFontFamilyTokens();
    output.lineHeight = this.generateLineHeightTokens();
    output.letterSpacing = this.generateLetterSpacingTokens();
    output.radius = this.generateRadiusTokens();
    output.borderWidth = this.generateBorderWidthTokens();
    output.shadow = this.generateShadowTokens();
    output.glow = this.generateGlowTokens();
    output.opacity = this.generateOpacityTokens();
    output.duration = this.generateDurationTokens();
    output.easing = this.generateEasingTokens();
    output.typography = this.generateTypographyTokens();
    // ... etc
    
    return output;
  }
  
  /** Write output to file */
  writeToFile(outputPath: string): void {
    const content = this.generate();
    const json = this.config.prettyPrint 
      ? JSON.stringify(content, null, 2)
      : JSON.stringify(content);
    fs.writeFileSync(outputPath, json);
  }
}
```

### Token Category Mapping

| Rosetta Source | DTCG Group | DTCG Type |
|----------------|------------|-----------|
| `SpacingTokens.ts` | `space` | `dimension` |
| `ColorTokens.ts` | `color` | `color` |
| `FontSizeTokens.ts` | `fontSize` | `dimension` |
| `FontWeightTokens.ts` | `fontWeight` | `fontWeight` |
| `FontFamilyTokens.ts` | `fontFamily` | `fontFamily` |
| `LineHeightTokens.ts` | `lineHeight` | `number` |
| `LetterSpacingTokens.ts` | `letterSpacing` | `dimension` |
| `RadiusTokens.ts` | `radius` | `dimension` |
| `BorderWidthTokens.ts` | `borderWidth` | `dimension` |
| `TapAreaTokens.ts` | `tapArea` | `dimension` |
| `DensityTokens.ts` | `density` | `number` |
| `BreakpointTokens.ts` | `breakpoint` | `dimension` |
| `ShadowTokens.ts` (semantic) | `shadow` | `shadow` (composite) |
| `OpacityTokens.ts` | `opacity` | `number` |
| `DurationTokens.ts` | `duration` | `duration` |
| `EasingTokens.ts` | `easing` | `cubicBezier` |
| `ScaleTokens.ts` | `scale` | `number` |
| `TypographyTokens.ts` (semantic) | `typography` | `typography` (composite) |
| `MotionTokens.ts` (semantic) | `motion` | `transition` (composite) |
| `BlendTokens.ts` | `blend` | `number` + extensions |
| `GlowTokens.ts` | `glow` | `shadow` (composite) + extensions |
| `ZIndexTokens.ts` (semantic) | `zIndex` | `number` |
| `ElevationTokens.ts` (semantic) | `elevation` | `number` + platform extensions |

---

## Validation

### DTCG Schema Validation

```typescript
// src/generators/__tests__/DTCGFormatGenerator.test.ts

describe('DTCGFormatGenerator', () => {
  it('generates valid DTCG structure', () => {
    const generator = new DTCGFormatGenerator(defaultConfig);
    const output = generator.generate();
    
    // Validate against DTCG schema
    const valid = validateDTCGSchema(output);
    expect(valid).toBe(true);
  });
  
  it('includes all primitive tokens', () => {
    const output = generator.generate();
    
    expect(output.space['100'].$value).toBe('8px');
    expect(output.color.purple['300'].$value).toBe('#B026FF');
  });
  
  it('preserves alias references', () => {
    const output = generator.generate();
    
    expect(output.color.primary.$value).toBe('{color.purple.300}');
  });
  
  it('includes DesignerPunk extensions', () => {
    const output = generator.generate();
    
    expect(output.space['100'].$extensions.designerpunk.formula)
      .toBe('base × 1 = 8 × 1 = 8');
  });
});
```

### Token Count Validation

Ensure all tokens are exported:

| Category | Source | Validation |
|----------|--------|------------|
| **Primitives** | `getAllPrimitiveTokens()` | Programmatic count at generation time (~240+ tokens) |
| **Semantics** | `getAllSemanticTokens()` | Programmatic count at generation time (~199 tokens) |

**Validation approach**: The generator uses `getAllPrimitiveTokens().length` and `getAllSemanticTokens().length` at generation time to validate completeness. Exact counts are living values that change as the token system grows.

**Primitive token families** (24 sources):
- Spacing (14), Color (~100+), Font size (9), Font weight (5), Font family (3), Line height (9), Letter spacing (9), Radius (9), Border width (4), Tap area (3), Density (3), Breakpoint (5), Opacity (13), Duration (5), Easing (4), Scale (5), Blend (13), Shadow blur/offset/opacity (~20), Glow blur/opacity (~8)

**Semantic token families** (15+ categories):
- Color (45), Spacing (29), Typography (24), Shadow (14), Border width (4), Radius (7), Opacity (4), Blend (7), Motion (5), Icon (24), Accessibility (3), Grid spacing (10), Z-index (6), Elevation (7), Progress color (10)

---

## Documentation Deliverables

### 1. DTCG Integration Guide

Document for downstream consumers:

```markdown
# DesignerPunk DTCG Integration Guide

## Overview
DesignerPunk exports tokens in DTCG Format Module 2025.10 compliant JSON.

## File Location
`dist/DesignTokens.dtcg.json`

## For DesignerPunk Component Developers

**IMPORTANT**: The DTCG output is for external tool integration (Figma, Style Dictionary, Tokens Studio, etc.). DesignerPunk components should continue importing tokens from TypeScript sources, not from the DTCG file.

**Component token consumption patterns remain unchanged:**
- Import token TypeScript files directly: `import { space125 } from '@/tokens/primitive/spacing'`
- Web components use CSS custom properties: `var(--space-125)`
- iOS/Android use platform-native constants

The DTCG file is a parallel export for external tools. It does not replace the existing token consumption patterns within DesignerPunk components.

## Using with Style Dictionary
[Instructions for Style Dictionary integration]

## Using with Tokens Studio
[Instructions for Tokens Studio integration]

## Creating Custom Transformers
[Instructions for implementing ITokenTransformer]

## DesignerPunk Extensions
[Documentation of $extensions.designerpunk schema]
```

### 2. Transformer Development Guide

Document for creating new transformers:

```markdown
# Creating DesignerPunk Token Transformers

## Overview
Transformers convert DTCG tokens to tool-specific formats.

## Interface
[ITokenTransformer documentation]

## Registration
[TransformerRegistry usage]

## Examples
[Example transformer implementations]
```

### 3. MCP Integration Guide

Document for MCP server integration:

```markdown
# DesignerPunk MCP Integration

## Reading Tokens
[How to load and parse DTCG tokens]

## Querying Tokens
[How to query specific tokens by path]

## Using Transformers
[How to use transformers for tool-specific formats]

## Best Practices
[Caching, error handling, etc.]
```

---

## Scope Boundaries

### In Scope (Spec 053)

1. **DTCGFormatGenerator** — Generate DTCG-compliant JSON from Rosetta
2. **DesignTokens.dtcg.json** — Canonical output file
3. **DTCG 2025.10 compliance** — Full spec compliance with validation
4. **DesignerPunk extensions** — `$extensions.designerpunk` schema
5. **Transformer architecture** — ITokenTransformer interface and registry
6. **Documentation** — Integration guides for downstream consumers

### Out of Scope (Future Specs)

1. **FigmaTransformer** — Spec 054
2. **Console MCP integration** — Spec 054
3. **Translation layer** — Spec 054
4. **Other transformers** — Future specs as needed

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| DTCG spec changes | Low | Medium | Pin to 2025.10, monitor updates |
| Token mapping edge cases | Medium | Low | Comprehensive test coverage |
| Extension schema evolution | Medium | Low | Version extensions, document changes |

### Adoption Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tool incompatibility | Low | Medium | Test with major DTCG tools |
| Community confusion | Low | Low | Clear documentation |

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Target DTCG 2025.10 | Stable candidate recommendation |
| 2 | Include DesignerPunk extensions | Preserve mathematical metadata |
| 3 | Use curly brace alias syntax | DTCG standard for references |
| 4 | Transformer interface pattern | Clean separation, easy extension |
| 5 | Registry pattern for transformers | Centralized management, discoverability |
| 6 | Comprehensive documentation | Enable downstream adoption |
| 7 | Aliases by default with config option | Preserves primitive→semantic hierarchy; DTCG tools resolve natively; `resolveAliases: boolean` (default `false`) |
| 8 | Parallel output alongside existing generators | Zero risk to existing pipeline; DTCG is additive, not a replacement; "outward-facing Rosetta Stone" |
| 9 | Glows as DTCG `shadow` type with extension metadata | Glows are "bright shadows" — structurally identical; `$extensions.designerpunk.glowType: "emission"` distinguishes semantically |
| 10 | Opacity-color merge during generation | Shadow/glow colors store alpha=1 with separate opacity primitives; generator merges at output time, preserving internal mathematical integrity |

---

## Resolved Open Questions

All four open questions have been resolved through collaborative discussion (February 2026).

### OQ-053-1: Exact Token Inventory — RESOLVED

**Decision**: Token counts are programmatically verifiable at generation time.

**Primitive tokens**: ~186 across 24 source files, covering spacing, color, font size, font weight, font family, line height, letter spacing, radius, border width, opacity, duration, easing, scale, tap area, density, breakpoint, blend, shadow blur/offset/opacity, and glow blur/opacity.

**Semantic tokens**: 15+ categories including color (45 validated), spacing (29 layout+inset), typography (24), shadow (14), border width (4), radius (7), opacity (4 validated), blend (7 validated), motion (5), icon (24 generated), accessibility (3), grid spacing (10), z-index (6), elevation (7), and progress color (varies by component).

**Validation approach**: The generator will use `getAllPrimitiveTokens().length` and `getAllSemanticTokens().length` at generation time to validate completeness. Exact counts are living values that change as the token system grows.

---

### OQ-053-2: Composite Type Mapping — RESOLVED

**Decision**: All four composite types have clear DTCG mappings. See "Composite Type Mapping Details" section below for exact output structures.

Key insights:
- **Shadow → DTCG `shadow`**: Requires opacity-color merge (see dedicated section below)
- **Typography → DTCG `typography`**: Clean 1:1 mapping of all 5 properties
- **Motion → DTCG `transition`**: Maps duration + easing; delay defaults to `0ms`
- **Glow → DTCG `shadow`**: Glows are "bright shadows" — structurally identical, distinguished by extension metadata (`$extensions.designerpunk.glowType: "emission"`)

---

### OQ-053-3: Alias Resolution Strategy — RESOLVED

**Decision**: Config option with aliases as default (`resolveAliases: boolean`, default `false`).

**Rationale**: Aliases preserve the primitive→semantic hierarchy that is central to DesignerPunk's architecture. DTCG-aware tools handle alias resolution natively. When a downstream transformer (like FigmaTransformer in spec 054) needs resolved values, it resolves aliases during transformation — not at the DTCG generation layer.

---

### OQ-053-4: Integration with Existing Generators — RESOLVED

**Decision**: Parallel output alongside existing generators (Option 1).

**Rationale**: DTCGFormatGenerator runs as a peer to existing platform generators (web CSS, iOS Swift, Android Kotlin), not a replacement. Zero risk to the existing pipeline; DTCG output is purely additive. Integration is just adding a few lines to `generate-platform-tokens.ts`.

Peter's framing: DTCG is the "outward-facing Rosetta Stone" — the internal Rosetta System prioritizes DesignerPunk's needs first, and DTCG serves as the translation layer for communicating the system outwardly to the broader design tools ecosystem.

---

## Composite Type Mapping Details

### Shadow → DTCG `shadow` Type

DesignerPunk shadow compositions (from `ShadowTokens.ts`) reference five primitives: `offsetX`, `offsetY`, `blur`, `opacity`, and `color`. DTCG's `shadow` type expects: `{offsetX, offsetY, blur, spread, color}`.

**Critical implementation detail**: DesignerPunk stores shadow color and opacity as SEPARATE primitives. The generator must MERGE these into a single DTCG color value by replacing the color's alpha channel with the opacity value.

```json
{
  "shadow": {
    "$type": "shadow",
    "container": {
      "$value": {
        "offsetX": "0px",
        "offsetY": "{shadowOffsetY.100}",
        "blur": "{shadowBlurModerate}",
        "spread": "0px",
        "color": "rgba(0, 0, 0, 0.3)"
      },
      "$description": "Container shadow - subtle depth for card-like elements",
      "$extensions": {
        "designerpunk": {
          "family": "shadow",
          "primitiveRefs": {
            "offsetX": "shadowOffsetX.000",
            "offsetY": "shadowOffsetY.100",
            "blur": "shadowBlurModerate",
            "opacity": "shadowOpacityModerate",
            "color": "shadowBlack100"
          },
          "android": { "elevation": 2 }
        }
      }
    }
  }
}
```

**Notes**:
- `spread` is always `0px` (DesignerPunk doesn't use spread)
- Android elevation goes into `$extensions.designerpunk.android` since DTCG has no elevation concept
- The merged `color` value is the resolved RGBA with opacity applied (see "Shadow/Glow Opacity-Color Merge" section)

### Glow → DTCG `shadow` Type

Glows are structurally identical to shadows — they're "bright shadows." The DTCG `shadow` composite type is used, with extension metadata distinguishing them semantically.

**Current state**: DesignerPunk has glow primitives (blur via `GlowBlurTokens.ts`, opacity via `GlowOpacityTokens.ts`) and glow colors (semantic `glow.neonPurple`, `glow.neonCyan`, etc. in `semantic/ColorTokens.ts`), but does NOT yet have composed glow tokens equivalent to `ShadowTokens.ts`. The generator will export glow primitives individually for now, with composed glow tokens as a future addition.

**Offset sharing**: Glows and shadows share offset primitives (currently `ShadowOffsetTokens.ts`). Potential rename to `OffsetTokens.ts` (generic) is under consideration but deferred to spec 053 implementation to avoid premature churn.

```json
{
  "glow": {
    "$type": "shadow",
    "$description": "Glow effects - bright shadows for emphasis and energy",
    "$extensions": {
      "designerpunk": {
        "glowType": "emission"
      }
    },
    "blur": {
      "$type": "dimension",
      "100": {
        "$value": "8px",
        "$description": "Base glow blur"
      }
    },
    "opacity": {
      "$type": "number",
      "100": {
        "$value": 0.8,
        "$description": "Inner glow layer opacity"
      }
    },
    "color": {
      "$type": "color",
      "neonPurple": {
        "$value": "{color.purple.500}",
        "$description": "Vibrant purple glow color"
      }
    }
  }
}
```

### Typography → DTCG `typography` Type

Clean 1:1 mapping. DesignerPunk typography compositions reference exactly the five properties DTCG expects.

```json
{
  "typography": {
    "$type": "typography",
    "bodyMd": {
      "$value": {
        "fontFamily": "{fontFamily.body}",
        "fontSize": "{fontSize.100}",
        "fontWeight": "{fontWeight.400}",
        "lineHeight": "{lineHeight.100}",
        "letterSpacing": "{letterSpacing.100}"
      },
      "$description": "Medium body typography - 16px, 1.5 line height, normal weight"
    }
  }
}
```

### Motion → DTCG `transition` Type

DesignerPunk motion tokens compose `duration` + `easing` (and optionally `scale`). DTCG's `transition` type expects: `{duration, timingFunction, delay}`.

```json
{
  "motion": {
    "$type": "transition",
    "floatLabel": {
      "$value": {
        "duration": "{duration.250}",
        "timingFunction": "{easing.standard}",
        "delay": "0ms"
      },
      "$description": "Float label animation for text input fields (250ms, standard curve)",
      "$extensions": {
        "designerpunk": {
          "family": "motion",
          "primitiveRefs": {
            "duration": "duration250",
            "easing": "easingStandard"
          }
        }
      }
    }
  }
}
```

**Notes**:
- `delay` defaults to `0ms` (DesignerPunk doesn't define delay)
- Optional `scale` property goes into `$extensions.designerpunk` when present

---

## Shadow/Glow Opacity-Color Merge

### The Problem

DesignerPunk stores shadow (and glow) color and opacity as separate primitives:
- **Color**: `shadowBlack100` = `rgba(0, 0, 0, 1)` (alpha is always `1`)
- **Opacity**: `shadowOpacityModerate` = `0.3`

DTCG's `shadow` type expects a single `color` value with opacity baked in.

### The Solution

The generator must merge these by replacing the color's alpha channel with the opacity value:

```
Input:  color = rgba(0, 0, 0, 1)  +  opacity = 0.3
Output: color = rgba(0, 0, 0, 0.3)
```

**Edge case**: When a shadow references a semantic color with embedded opacity (e.g., `color.overlay.background = rgba(0, 0, 0, 0.5)`), the shadow's opacity primitive OVERRIDES the color's alpha channel (does not multiply). The shadow opacity is authoritative.

### Why Colors Have Alpha = 1

Shadow color primitives were migrated to RGBA format (spec 052) for consistency with the color system. However, the alpha channel in shadow colors is always `1` because opacity is controlled separately — this is by design. The separate opacity primitives (`shadowOpacityHard: 0.4`, `shadowOpacityModerate: 0.3`, `shadowOpacitySoft: 0.2`) provide mathematical relationships and independent control that would be lost if opacity were embedded in the color value.

### Implementation

```typescript
function mergeShadowColor(colorRgba: string, opacity: number): string {
  // Parse rgba(r, g, b, 1) → extract r, g, b
  const match = colorRgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Invalid shadow color: ${colorRgba}`);
  const [, r, g, b] = match;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
```

This merge happens during DTCG generation only — the internal Rosetta representation preserves the separate primitives for mathematical integrity.

---

## Open Questions (Must Resolve Before Requirements)

~~The following questions must be answered before this spec can proceed to requirements.md:~~

**All open questions have been resolved.** See "Resolved Open Questions" section above for decisions and rationale.

### OQ-053-1: Exact Token Inventory

**Question**: What is the exact count of tokens in each category that will be exported?

**Why it matters**: "~310 total" and "45+" are too vague for validation. We need precise counts to verify the generator exports everything.

**Action required**: Audit Rosetta token sources and document exact counts per category.

---

### OQ-053-2: Composite Type Mapping

**Question**: How exactly do DesignerPunk shadow and typography compositions map to DTCG composite type structures?

**Why it matters**: DTCG has specific schemas for `shadow` and `typography` composite types. The outline marks these as "✅ Direct mapping" but doesn't show the actual structure transformation.

**Action required**: Document the exact DTCG output structure for:
- Shadow compositions (from `ShadowTokens.ts`)
- Typography compositions (from `TypographyTokens.ts`)
- Motion/transition compositions

---

### OQ-053-3: Alias Resolution Strategy

**Question**: When should the generator emit alias references (`{color.purple.300}`) vs resolved values (`#B026FF`)?

**Why it matters**: Both are valid DTCG. The choice affects:
- File size (aliases are smaller)
- Downstream tool compatibility (some tools don't resolve aliases)
- Debugging experience (resolved values are easier to inspect)

**Options to evaluate**:
1. Always emit aliases for semantic tokens
2. Provide a config option (`resolveAliases: boolean`)
3. Emit both (aliases in `$value`, resolved in extensions)

**Action required**: Decide on strategy and document rationale.

---

### OQ-053-4: Integration with Existing Generators

**Question**: How does DTCGFormatGenerator integrate with the existing `generate-platform-tokens.ts` script?

**Why it matters**: There's already a token generation pipeline. Adding DTCG output needs to fit cleanly.

**Options to evaluate**:
1. DTCGFormatGenerator runs alongside existing generators (parallel output)
2. DTCGFormatGenerator becomes the new canonical source, existing generators consume DTCG
3. Existing script is extended to include DTCG output

**Action required**: Review `scripts/generate-platform-tokens.ts` and decide on integration approach.

---

## Review Questions (Pending Response)

**Review Status**: ✅ **COMPLETE** (Ada responded February 17, 2026; Lina responded February 17, 2026)

### For Ada (Token Specialist)

**Q1: Token Type Mapping Completeness**
Review the "Supported Token Types" table. Does this mapping cover all Rosetta token types? Are there any missing?

**Response**: ✅ **RESOLVED (2026-02-17)** — Mapping is mostly complete but missing five token families:
- Tap area tokens (`TapAreaTokens.ts`) — `dimension` type
- Density tokens (`DensityTokens.ts`) — `number` type
- Breakpoint tokens (`BreakpointTokens.ts`) — `dimension` type
- Z-index tokens (semantic) — `number` type
- Elevation tokens (semantic, iOS/Android) — `number` type

**Decision**: Add these five families to the mapping table.

---

**Q2: Shadow/Glow Opacity-Color Merge**
Review the "Shadow/Glow Opacity-Color Merge" section. Is this merge approach correct? Are there edge cases we're missing?

**Response**: ✅ **RESOLVED (2026-02-17)** — Merge approach is correct with one edge case clarification:

**Edge case**: When a shadow references a semantic color that has embedded opacity (e.g., `color.overlay.background = rgba(0, 0, 0, 0.5)`), the shadow's opacity primitive should OVERRIDE the color's alpha channel, not multiply.

**Decision**: Shadow opacity is authoritative. Strip color's alpha and replace with shadow's opacity value.

---

**Q3: Glow Token Completeness**
The design outline notes that composed glow tokens don't exist yet (only primitives). Should we add composed glow tokens before spec 053, or is partial glow support acceptable for the first release?

**Response**: ✅ **RESOLVED (2026-02-17)** — Partial glow support is acceptable.

**Context**: Glows are "bright shadows" — structurally identical (offsetX, offsetY, blur, color), distinguished by positive/bright colors and `$extensions.designerpunk.glowType: "emission"` metadata.

**Offset sharing**: Glows and shadows share offset primitives (currently `ShadowOffsetTokens`). Potential rename to `OffsetTokens` deferred to spec 053 implementation.

**Decision**: Export glow primitives individually in spec 053. Add composed glow tokens in future spec when use cases emerge. Document partial support with `"status": "partial"` in extensions.

---

**Q4: Token Count Validation**
The design outline estimates ~186 primitives, ~150+ semantics. Can you verify these counts are accurate? Are there token categories missing from the DTCG mapping?

**Response**: ✅ **RESOLVED (2026-02-17)** — Counts are underestimated:

**Actual counts**:
- Primitives: ~240+ (not ~186)
- Semantics: ~199 (not ~150+)

**Decision**: Use programmatic validation at generation time (`getAllPrimitiveTokens().length`, `getAllSemanticTokens().length`) rather than hard-coded counts. Update design outline to reflect this approach.

---

**Q5: Extension Schema Completeness**
Review the `$extensions.designerpunk` schema in "Extensions Required" section. Does this schema capture all Rosetta metadata you need (formulas, families, base values, blend operations)?

**Response**: ✅ **RESOLVED (2026-02-17)** — Schema is mostly complete but needs deprecation metadata:

**Missing**: Token deprecation metadata
```json
{
  "$extensions": {
    "designerpunk": {
      "deprecated": true,
      "deprecatedReason": "Use space.grouped.normal instead",
      "deprecatedSince": "1.2.0"
    }
  }
}
```

**Governance**: Token deprecation requires human approval (Ada proposes → Thurgood audits usage → Peter approves → Ada implements). Mirrors token creation flow.

**Decision**: Add deprecation metadata to extension schema. Export deprecated tokens by default with clear metadata (downstream consumers can filter if needed).

---

### For Lina (Component Specialist)

**Q1: Component Token Scope**
The design outline says "component tokens add complexity" and are out of scope for spec 053 (primitives + semantics only). Do you agree with this decision? Are there component-specific tokens that MUST be in DTCG output?

**Response**: ✅ **RESOLVED (2026-02-17)** — Component tokens should be out of scope for Spec 053.

**Rationale**: After reviewing Spec 054 (Figma integration workflow), component tokens are implementation details that don't exist until component implementation (step 4 of the workflow). The Figma workflow (push primitives/semantics → design iteration → extract → spec → implement) doesn't require component tokens in the DTCG output. Designers work with primitives and semantics; component tokens are created during code implementation.

**Decision**: Spec 053 exports primitives + semantics only. Component tokens remain out of scope unless future evidence shows they're needed for a different tool integration.

---

**Q2: Composite Type Decomposition**
DTCG doesn't support shadow/typography as single variables in Figma. They're decomposed into individual properties. Does this affect how components consume tokens? Are there breaking changes?

**Response**: ✅ **RESOLVED (2026-02-17)** — No breaking changes for components.

**Rationale**: Web components consume tokens via CSS custom properties. Whether the DTCG file has composite `typography` objects or individual `fontSize`/`fontWeight` properties doesn't affect component consumption — the web CSS generator already outputs individual properties. The decomposition happens at the Figma transformer layer (Spec 054), not at the DTCG generation layer. DTCG preserves composites; FigmaTransformer decomposes them.

**Decision**: No changes needed. The transformer architecture (Spec 053) already handles this correctly.

---

**Q3: Platform-Specific Hints**
The extension schema includes `$extensions.designerpunk.platforms`. What platform hints do you need in DTCG extensions? Are there component-specific platform notes that should be included?

**Response**: ✅ **RESOLVED (2026-02-17)** — Two categories of platform hints are needed.

**Category 1: Platform Capability Flags** (IN SCOPE for Spec 053)
Components need to know when a token has platform-specific limitations:

```json
{
  "$extensions": {
    "designerpunk": {
      "platforms": {
        "web": { "supported": true },
        "ios": { "supported": true },
        "android": { "supported": true, "note": "Uses elevation instead of shadow" }
      }
    }
  }
}
```

**Example**: Android elevation vs. shadow. Components need to know that `shadow.container` maps to `elevation: 2` on Android.

**Category 2: Component-Specific Platform Overrides** (OUT OF SCOPE for Spec 053)
Component-specific token usage overrides (e.g., Button-CTA uses different tap areas on iOS vs Android). Deferred to future spec when real use cases emerge.

**Decision**: Add platform capability flags to extension schema (Category 1). Defer component-specific overrides (Category 2).

---

**Q4: Token Consumption Patterns**
Will DTCG output support current component token consumption patterns? Are there breaking changes we need to address?

**Response**: ✅ **RESOLVED (2026-02-17)** — No breaking changes, but documentation gap identified.

**Current consumption patterns:**
1. Components import token TypeScript files directly (`import { space125 } from '@/tokens/primitive/spacing'`)
2. Web components use CSS custom properties (`var(--space-125)`)
3. iOS/Android use platform-native constants

**DTCG output doesn't replace any of these.** It's a parallel export for external tools (Figma, Style Dictionary, etc.). Components continue consuming tokens the same way.

**Documentation gap**: Developers might see `DesignTokens.dtcg.json` and wonder if they should import it instead of TypeScript sources. The answer is no, but this needs to be explicit.

**Decision**: Add section to DTCG Integration Guide titled "For DesignerPunk Component Developers" clarifying: "DTCG output is for external tool integration. DesignerPunk components continue importing tokens from TypeScript sources."

---

## Next Steps

1. ✅ **Design outline created** — Architecture and decisions documented
2. ✅ **DTCG spec researched** — Target version identified (2025.10)
3. ✅ **Open questions resolved** — OQ-053-1 through OQ-053-4 all resolved (February 2026)
4. ⏳ **Create requirements.md** — EARS format (unblocked)
5. ⏳ **Create design.md** — Detailed architecture
6. ⏳ **Create tasks.md** — Implementation plan
7. ⏳ **Implement DTCGFormatGenerator**
8. ⏳ **Implement transformer architecture**
9. ⏳ **Write documentation guides**

---

**Organization**: spec-guide
**Scope**: 053-dtcg-token-format-generator
