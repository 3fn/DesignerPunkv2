# DTCG Token Format Generator - Design Outline

**Date**: February 3, 2026
**Purpose**: Capture design decisions and architecture for DTCG-compliant token output
**Status**: Design Outline (Pre-Requirements)
**Last Updated**: February 3, 2026

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
| `dimension` | Spacing, radius, border-width, tap-area | ✅ Direct mapping |
| `fontFamily` | Font family tokens | ✅ Direct mapping |
| `fontWeight` | Font weight tokens | ✅ Direct mapping |
| `duration` | Duration tokens | ✅ Direct mapping |
| `cubicBezier` | Easing tokens | ✅ Direct mapping |
| `number` | Opacity, blend, scale, density tokens | ✅ Direct mapping |
| `shadow` (composite) | Shadow compositions | ✅ Direct mapping |
| `typography` (composite) | Typography compositions | ✅ Direct mapping |
| `gradient` (composite) | Not currently used | ⏸️ Future |
| `border` (composite) | Not currently used | ⏸️ Future |
| `transition` (composite) | Motion compositions | ✅ Direct mapping |

### Extensions Required

DesignerPunk concepts not covered by DTCG core spec:

| Concept | Extension Key | Purpose |
|---------|--------------|---------|
| Mathematical formulas | `$extensions.designerpunk.formula` | Document token derivation |
| Token family | `$extensions.designerpunk.family` | Group tokens by category |
| Base value | `$extensions.designerpunk.baseValue` | Mathematical foundation |
| Blend operations | `$extensions.designerpunk.blendType` | darkerBlend, lighterBlend, etc. |
| Glow properties | `$extensions.designerpunk.glowType` | Glow-specific metadata |
| Platform hints | `$extensions.designerpunk.platforms` | Platform-specific guidance |

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
| `ShadowTokens.ts` (semantic) | `shadow` | `shadow` (composite) |
| `OpacityTokens.ts` | `opacity` | `number` |
| `DurationTokens.ts` | `duration` | `duration` |
| `EasingTokens.ts` | `easing` | `cubicBezier` |
| `TypographyTokens.ts` (semantic) | `typography` | `typography` (composite) |
| `BlendTokens.ts` | `blend` | `number` + extensions |
| `GlowTokens.ts` | `glow` | `number` + extensions |

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

| Category | Expected Count | Validation |
|----------|---------------|------------|
| Spacing | 14 | Count tokens in `space` group |
| Color (primitives) | 45+ | Count tokens in `color` group |
| Typography (semantic) | 25+ | Count tokens in `typography` group |
| **Total** | ~310 | Match Rosetta token inventory |

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

---

## Open Questions (Must Resolve Before Requirements)

The following questions must be answered before this spec can proceed to requirements.md:

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

## Next Steps

1. ✅ **Design outline created** — Architecture and decisions documented
2. ✅ **DTCG spec researched** — Target version identified (2025.10)
3. ⏳ **Resolve open questions** — OQ-053-1 through OQ-053-4
4. ⏳ **Create requirements.md** — EARS format (blocked by open questions)
5. ⏳ **Create design.md** — Detailed architecture
6. ⏳ **Create tasks.md** — Implementation plan
7. ⏳ **Implement DTCGFormatGenerator**
8. ⏳ **Implement transformer architecture**
9. ⏳ **Write documentation guides**

---

**Organization**: spec-guide
**Scope**: 053-dtcg-token-format-generator
