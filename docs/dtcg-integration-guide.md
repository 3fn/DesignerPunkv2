---
inclusion: manual
name: DTCG-Integration-Guide
description: DTCG integration guide — file location, token type mapping, DesignerPunk extensions, Style Dictionary integration, Tokens Studio integration. Load when working with DTCG export, design tool integration, or external token consumption.
---

# DTCG Integration Guide

**Date**: February 17, 2026
**Last Reviewed**: February 18, 2026
**Purpose**: Guide for integrating DesignerPunk tokens via DTCG format with external design tools (Style Dictionary, Tokens Studio, and other DTCG-aware tools)
**Organization**: spec-guide
**Scope**: 053-dtcg-token-format-generator
**Layer**: 3
**Relevant Tasks**: dtcg-integration, design-tool-integration

---

## Overview

DesignerPunk exports its Rosetta System tokens in [DTCG (Design Tokens Community Group) Format Module 2025.10](https://tr.designtokens.org/format/) — the emerging industry standard for design token interchange. This enables integration with external tools like Style Dictionary, Tokens Studio, Figma, and Terrazzo.

**File location**: `dist/DesignTokens.dtcg.json`

**Key principle**: DTCG output is a parallel export for external tools. Code (Rosetta TypeScript sources) remains the source of truth. DesignerPunk components continue importing tokens from TypeScript — they never consume the DTCG file directly.

---

## DTCG Format Overview

### Structure

The DTCG format organizes tokens into a nested JSON structure with special `$`-prefixed properties:

- `$schema` — References the DTCG specification URL
- `$type` — Declares the token type (can be set at group level)
- `$value` — The token's resolved or aliased value
- `$description` — Human-readable description
- `$extensions` — Vendor-specific metadata (DesignerPunk uses `$extensions.designerpunk`)

### Token Types

DesignerPunk maps Rosetta token families to these DTCG types:

| DTCG Type | Rosetta Families |
|-----------|-----------------|
| `color` | Color primitives, semantic colors, progress colors |
| `dimension` | Spacing, font size, letter spacing, radius, border width, tap area, breakpoint, grid spacing, icon sizes |
| `fontFamily` | Font family primitives |
| `fontWeight` | Font weight primitives |
| `duration` | Duration primitives |
| `cubicBezier` | Easing primitives |
| `number` | Line height, density, opacity, scale, blend, z-index, elevation |
| `shadow` | Shadow compositions |
| `typography` | Typography compositions |
| `transition` | Motion compositions |

### Aliases

Semantic tokens reference primitives using DTCG alias syntax: `{group.tokenName}`. This preserves the primitive→semantic hierarchy that is central to DesignerPunk's architecture.

```json
{
  "color.feedback.success.text": {
    "$value": "{color.green400}",
    "$type": "color",
    "$description": "Green text color for success states"
  }
}
```

DTCG-aware tools resolve aliases automatically. If a tool doesn't support aliases, generate with `resolveAliases: true` to get final values instead.

---

## Token Groups

The generated file contains these top-level groups:

| Group | Type | Description |
|-------|------|-------------|
| `space` | dimension | Spacing scale (8px base, modular) |
| `color` | color | Color primitives (gray, black, white, yellow, orange, purple, pink, green, cyan, teal) |
| `fontSize` | dimension | Type scale |
| `fontWeight` | fontWeight | Weight scale (300–700) |
| `fontFamily` | fontFamily | Body, display, monospace families |
| `lineHeight` | number | Line height ratios |
| `letterSpacing` | dimension | Letter spacing values |
| `radius` | dimension | Border radius scale |
| `borderWidth` | dimension | Border width scale |
| `tapArea` | dimension | Touch target sizes |
| `density` | number | Density multipliers |
| `breakpoint` | dimension | Responsive breakpoints |
| `opacity` | number | Opacity scale |
| `duration` | duration | Animation durations |
| `easing` | cubicBezier | Animation curves |
| `scale` | number | Scale multipliers |
| `blend` | number | Blend operation values |
| `semanticColor` | color | Semantic color aliases |
| `semanticSpacing` | dimension | Semantic spacing aliases |
| `semanticBorderWidth` | dimension | Semantic border width aliases |
| `semanticRadius` | dimension | Semantic radius aliases |
| `semanticOpacity` | number | Semantic opacity aliases |
| `semanticBlend` | number | Semantic blend aliases |
| `zIndex` | number | Z-index layering values |
| `elevation` | number | Elevation levels |
| `shadow` | shadow | Shadow compositions |
| `glow` | number/dimension/color | Glow primitives (partial) |
| `typography` | typography | Typography compositions |
| `motion` | transition | Motion compositions |
| `gridSpacing` | dimension | Grid spacing values |
| `icon` | dimension | Icon size tokens |
| `accessibility` | dimension | Accessibility tokens |
| `progressColor` | color | Progress indicator colors |

---

## DesignerPunk Extensions Schema

All tokens include `$extensions.designerpunk` metadata (unless generated with `includeExtensions: false`). This preserves mathematical relationships, governance rules, and platform behavior that DTCG's standard properties can't express.

### Extension Properties

```typescript
interface DesignerPunkExtensions {
  formula?: string;          // e.g., "base × 2 = 8 × 2 = 16"
  family?: string;           // e.g., "spacing", "color", "shadow"
  baseValue?: number;        // e.g., 8 for spacing
  blendType?: string;        // "darkerBlend" | "lighterBlend" | "contrastBlend"
  glowType?: string;         // "emission" for glow tokens
  platforms?: {
    web?: { supported: boolean; note?: string };
    ios?: { supported: boolean; note?: string };
    android?: { supported: boolean; note?: string; elevation?: number };
  };
  deprecated?: boolean;
  deprecatedReason?: string;
  deprecatedSince?: string;
  status?: "partial";        // Indicates incomplete support (e.g., glow primitives only)
  primitiveRefs?: Record<string, string>;  // Maps composite properties to primitive token names
}
```

### Extension Examples

**Mathematical formula** (spacing token):
```json
{
  "space200": {
    "$value": "16px",
    "$type": "dimension",
    "$extensions": {
      "designerpunk": {
        "formula": "base × 2 = 8 × 2 = 16",
        "family": "spacing",
        "baseValue": 8
      }
    }
  }
}
```

**Platform-specific behavior** (shadow token):
```json
{
  "container": {
    "$value": { "offsetX": "0px", "offsetY": "4px", "blur": "12px", "spread": "0px", "color": "rgba(0, 0, 0, 0.3)" },
    "$type": "shadow",
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
        "platforms": {
          "android": { "supported": true, "elevation": 8 }
        }
      }
    }
  }
}
```

**Partial support** (glow token):
```json
{
  "glowBlurSubtle": {
    "$value": "4px",
    "$type": "dimension",
    "$extensions": {
      "designerpunk": {
        "family": "glow",
        "glowType": "emission",
        "status": "partial"
      }
    }
  }
}
```

---

## DTCG Output Examples by Token Type

### Color (primitive)

```json
{
  "purple300": {
    "$value": "rgba(176, 38, 255, 1)",
    "$type": "color",
    "$description": "Bright purple for primary brand color and focus states",
    "$extensions": {
      "designerpunk": {
        "family": "color"
      }
    }
  }
}
```

### Color (semantic alias)

```json
{
  "color.feedback.success.text": {
    "$value": "{color.green400}",
    "$type": "color",
    "$description": "Green text color for success states",
    "$extensions": {
      "designerpunk": {
        "family": "color"
      }
    }
  }
}
```

### Dimension (spacing)

```json
{
  "space100": {
    "$value": "8px",
    "$type": "dimension",
    "$description": "Base spacing - 1x base value",
    "$extensions": {
      "designerpunk": {
        "formula": "base × 1 = 8 × 1 = 8",
        "family": "spacing",
        "baseValue": 8
      }
    }
  }
}
```

### Font Family

```json
{
  "fontFamilyBody": {
    "$value": "Inter",
    "$type": "fontFamily",
    "$description": "Primary body font family"
  }
}
```

### Font Weight

```json
{
  "fontWeight400": {
    "$value": 400,
    "$type": "fontWeight",
    "$description": "Normal/regular weight"
  }
}
```

### Duration

```json
{
  "duration250": {
    "$value": "250ms",
    "$type": "duration",
    "$description": "Standard animation duration"
  }
}
```

### Cubic Bezier (easing)

```json
{
  "easingStandard": {
    "$value": [0.2, 0, 0, 1],
    "$type": "cubicBezier",
    "$description": "Standard easing curve for balanced animations"
  }
}
```

### Number (opacity)

```json
{
  "opacity100": {
    "$value": 1,
    "$type": "number",
    "$description": "Full opacity"
  }
}
```

### Shadow (composite)

```json
{
  "container": {
    "$value": {
      "offsetX": "0px",
      "offsetY": "4px",
      "blur": "12px",
      "spread": "0px",
      "color": "rgba(0, 0, 0, 0.3)"
    },
    "$type": "shadow",
    "$description": "Container shadow",
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
        "platforms": {
          "android": { "supported": true, "elevation": 8 }
        }
      }
    }
  }
}
```

### Typography (composite)

```json
{
  "bodySm": {
    "$value": {
      "fontFamily": "{fontFamily.fontFamilyBody}",
      "fontSize": "{fontSize.fontSize075}",
      "fontWeight": "{fontWeight.fontWeight400}",
      "lineHeight": "{lineHeight.lineHeight075}",
      "letterSpacing": "{letterSpacing.letterSpacing100}"
    },
    "$type": "typography",
    "$description": "Small body typography",
    "$extensions": {
      "designerpunk": {
        "family": "typography",
        "primitiveRefs": {
          "fontSize": "fontSize075",
          "lineHeight": "lineHeight075",
          "fontFamily": "fontFamilyBody",
          "fontWeight": "fontWeight400",
          "letterSpacing": "letterSpacing100"
        }
      }
    }
  }
}
```

### Transition (motion composite)

```json
{
  "floatLabel": {
    "$value": {
      "duration": "{duration.duration250}",
      "timingFunction": "{easing.easingStandard}",
      "delay": "0ms"
    },
    "$type": "transition",
    "$description": "Standard motion for label floating up",
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
```

---

## Integration with Style Dictionary

[Style Dictionary](https://amzn.github.io/style-dictionary/) supports DTCG format natively (v4+). To consume DesignerPunk tokens:

### Configuration

```json
{
  "source": ["dist/DesignTokens.dtcg.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    }
  }
}
```

### Handling Extensions

Style Dictionary ignores `$extensions` by default. To access DesignerPunk metadata, register a custom transform:

```javascript
StyleDictionary.registerTransform({
  name: 'designerpunk/formula',
  type: 'attribute',
  transform: (token) => {
    const ext = token.$extensions?.designerpunk;
    if (ext?.formula) {
      token.comment = ext.formula;
    }
    return token;
  }
});
```

### Alias Resolution

Style Dictionary resolves `{token.path}` aliases automatically during build. No special configuration needed.

---

## Integration with Tokens Studio

[Tokens Studio](https://tokens.studio/) supports DTCG format for importing and syncing tokens.

### Importing Tokens

1. Open Tokens Studio in Figma
2. Go to Settings → Token Storage
3. Select "JSON" as the storage type
4. Point to `dist/DesignTokens.dtcg.json`
5. Tokens Studio will parse the DTCG structure and create Figma variables

### Sync Configuration

For automated sync, configure Tokens Studio to read from your repository:

```json
{
  "storage": {
    "provider": "github",
    "repository": "your-org/your-repo",
    "filePath": "dist/DesignTokens.dtcg.json",
    "branch": "main"
  }
}
```

### Extension Handling

Tokens Studio preserves `$extensions` metadata but doesn't display it in the UI by default. Extensions are available when exporting tokens back to JSON.

---

## Figma Integration

DesignerPunk supports bidirectional Figma integration: pushing tokens to Figma as Variables and Styles, and extracting validated designs back into design outlines. The DTCG file (`dist/DesignTokens.dtcg.json`) serves as the interchange format for both workflows.

For complete Figma integration documentation — including MCP setup, Desktop Bridge configuration, CLI commands, drift detection, design extraction, troubleshooting, and authentication — see the [Figma Workflow Guide](./figma-workflow-guide.md).

---

## For DesignerPunk Component Developers

**DTCG output is for external tool integration. Components continue importing TypeScript sources.**

If you're building DesignerPunk components, you should not consume `dist/DesignTokens.dtcg.json`. Instead, import tokens directly from the Rosetta TypeScript sources:

```typescript
// ✅ CORRECT — Import from TypeScript sources
import { space100, space200 } from '../tokens/primitive/SpacingTokens';
import { colorPrimary } from '../tokens/semantic/ColorTokens';

// ❌ WRONG — Don't parse the DTCG file in components
import dtcg from '../../dist/DesignTokens.dtcg.json';
```

**Why?**
- TypeScript sources provide type safety and IDE autocompletion
- Rosetta's mathematical relationships are enforced at the source level
- DTCG is a serialization format for interchange — not a runtime dependency
- Components benefit from tree-shaking when importing specific tokens

The DTCG file exists so that external tools (Figma, Style Dictionary, Tokens Studio) can consume DesignerPunk's token system without needing access to the TypeScript codebase.

---

## Configuration Options

The generator accepts these configuration options:

| Option | Default | Description |
|--------|---------|-------------|
| `includeExtensions` | `true` | Include `$extensions.designerpunk` metadata |
| `includeDeprecated` | `true` | Include deprecated tokens in output |
| `prettyPrint` | `true` | Format JSON with 2-space indentation |
| `schemaUrl` | `https://tr.designtokens.org/format/` | DTCG schema URL |
| `resolveAliases` | `false` | Resolve alias references to final values |

### Generating Without Extensions

For tools that don't handle extensions well:

```typescript
const generator = new DTCGFormatGenerator({ includeExtensions: false });
generator.writeToFile('dist/DesignTokens.dtcg.json');
```

### Generating With Resolved Aliases

For tools that don't support alias resolution:

```typescript
const generator = new DTCGFormatGenerator({ resolveAliases: true });
generator.writeToFile('dist/DesignTokens.resolved.dtcg.json');
```

---

## Related Documentation

- [DTCG Format Module 2025.10 Specification](https://tr.designtokens.org/format/)
- [Figma Workflow Guide](./figma-workflow-guide.md) — Complete Figma integration: token push, design extraction, MCP setup, Desktop Bridge, troubleshooting
- [Token System Overview](./token-system-overview.md) — Complete Rosetta token system documentation
- [Transformer Development Guide](./transformer-development-guide.md) — Building custom transformers for tool-specific output
- [MCP Integration Guide](./mcp-integration-guide.md) — Loading and querying DTCG tokens programmatically
