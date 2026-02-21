---
inclusion: manual
name: Transformer-Development-Guide
description: Transformer development guide — ITokenTransformer interface, TransformerRegistry usage, implementation examples. Load when building custom transformers or extending DTCG output for new tools.
---

# Transformer Development Guide

**Date**: 2026-02-17
**Last Reviewed**: 2026-02-21
**Purpose**: Guide for building custom token transformers that consume DTCG output and produce tool-specific formats
**Organization**: process-standard
**Scope**: transformer-development
**Layer**: 2
**Relevant Tasks**: transformer-development, dtcg-integration, tool-integration

---

## Overview

The DesignerPunk transformer architecture enables tool-specific token outputs without modifying the core DTCG generator. Transformers consume the canonical `dist/DesignTokens.dtcg.json` and produce formats tailored to specific design tools (Figma, Sketch, Adobe, etc.).

**Architecture summary:**
- `DTCGFormatGenerator` produces canonical DTCG output (Spec 053)
- `ITokenTransformer` defines the contract for tool-specific transformers
- `TransformerRegistry` manages transformer instances and orchestrates invocation
- Each transformer is a separate concern — add new tools by implementing the interface

---

## ITokenTransformer Interface

Every transformer implements `ITokenTransformer`, which defines three members:

```typescript
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';

interface ITokenTransformer {
  /** Transformer configuration (read-only) */
  readonly config: TransformerConfig;

  /** Transform DTCG tokens to target format */
  transform(dtcgTokens: DTCGTokenFile): TransformResult;

  /** Validate that the transformer can handle the given input */
  canTransform(dtcgTokens: DTCGTokenFile): boolean;
}
```

### TransformerConfig

Configuration metadata that identifies the transformer and controls its behavior:

```typescript
interface TransformerConfig {
  /** Unique identifier (e.g., 'figma', 'sketch', 'style-dictionary') */
  id: string;
  /** Human-readable name (e.g., 'Figma Variables') */
  name: string;
  /** Output file extension (e.g., '.figma.json') */
  outputExtension: string;
  /** Whether to include $extensions.designerpunk in output */
  includeExtensions: boolean;
}
```

- `id` — Used by the registry to look up transformers. Must be unique across all registered transformers.
- `name` — For logging and UI display. Not used programmatically.
- `outputExtension` — Appended to the base filename (e.g., `DesignTokens` + `.figma.json`).
- `includeExtensions` — Signals whether the transformer's output format benefits from DesignerPunk metadata. The transformer itself decides how to use this flag.

### TransformResult

The return type from `transform()`:

```typescript
interface TransformResult {
  /** Transformed content as string (typically JSON) */
  content: string;
  /** Output filename (e.g., 'DesignTokens.figma.json') */
  filename: string;
  /** Warnings generated during transformation */
  warnings: string[];
}
```

- `content` — The serialized output. Most transformers produce JSON, but the type is `string` to support any format.
- `filename` — The transformer decides the output filename. Convention: `DesignTokens` + `config.outputExtension`.
- `warnings` — Non-fatal issues encountered during transformation (e.g., unsupported token types, skipped tokens). Empty array when everything succeeds.

### Method: transform()

Receives the full DTCG token file and returns the tool-specific output. This is where the core transformation logic lives.

```typescript
transform(dtcgTokens: DTCGTokenFile): TransformResult
```

The input `DTCGTokenFile` contains:
- `$schema` — DTCG specification URL
- `$extensions.designerpunk` — Root-level metadata (version, generation timestamp)
- Token groups — Nested objects containing `DTCGToken` entries with `$value`, `$type`, `$description`, and optional `$extensions`

### Method: canTransform()

A guard that validates whether the transformer can handle the given input. Called by the registry before invoking `transform()`.

```typescript
canTransform(dtcgTokens: DTCGTokenFile): boolean
```

Common validation patterns:
- Check for required token groups
- Verify schema version compatibility
- Validate that expected token types are present

For most transformers, returning `true` is sufficient — the DTCG generator produces a consistent structure.

---

## TransformerRegistry

The registry manages transformer instances and provides methods for invoking them individually or collectively.

### Importing

```typescript
import { TransformerRegistry, transformerRegistry } from '../generators/transformers';
```

- `TransformerRegistry` — The class (for creating additional registry instances if needed)
- `transformerRegistry` — The singleton instance for application-wide use

### Methods

#### register(transformer)

Registers a transformer by its `config.id`. Overwrites any existing transformer with the same ID.

```typescript
transformerRegistry.register(new FigmaTransformer());
transformerRegistry.register(new SketchTransformer());
```

#### get(id)

Retrieves a transformer by ID. Returns `undefined` if not found.

```typescript
const figma = transformerRegistry.get('figma');
if (figma) {
  const result = figma.transform(dtcgTokens);
}
```

#### getAll()

Returns all registered transformers as an array.

```typescript
const all = transformerRegistry.getAll();
console.log(`${all.length} transformers registered`);
```

#### transform(id, dtcgTokens)

Invokes a specific transformer by ID. Throws if the transformer is not found or `canTransform()` returns `false`.

```typescript
try {
  const result = transformerRegistry.transform('figma', dtcgTokens);
  fs.writeFileSync(`dist/${result.filename}`, result.content);
} catch (error) {
  console.error('Transform failed:', error.message);
}
```

**Errors thrown:**
- `Transformer not found: {id}` — No transformer registered with that ID
- `Transformer {id} cannot handle input` — `canTransform()` returned `false`

#### transformAll(dtcgTokens)

Invokes all registered transformers that can handle the input. Filters by `canTransform()` automatically.

```typescript
const results = transformerRegistry.transformAll(dtcgTokens);
for (const result of results) {
  fs.writeFileSync(`dist/${result.filename}`, result.content);
  if (result.warnings.length > 0) {
    console.warn(`${result.filename}: ${result.warnings.join(', ')}`);
  }
}
```

---

## Example: Minimal Transformer

Here's a complete, minimal transformer that strips extensions and flattens tokens into a simple key-value map:

```typescript
import type { ITokenTransformer, TransformResult, TransformerConfig } from '../generators/transformers';
import type { DTCGTokenFile, DTCGToken } from '../generators/types/DTCGTypes';

export class FlatTokenTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'flat',
    name: 'Flat Key-Value Map',
    outputExtension: '.flat.json',
    includeExtensions: false,
  };

  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    const flat: Record<string, unknown> = {};
    this.flatten(dtcgTokens, '', flat);

    return {
      content: JSON.stringify(flat, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: [],
    };
  }

  canTransform(_dtcgTokens: DTCGTokenFile): boolean {
    return true;
  }

  private flatten(
    obj: Record<string, unknown>,
    prefix: string,
    result: Record<string, unknown>
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue; // Skip DTCG meta-properties

      const path = prefix ? `${prefix}.${key}` : key;
      const entry = value as Record<string, unknown>;

      if (entry && typeof entry === 'object' && '$value' in entry) {
        // This is a token — extract its value
        result[path] = entry.$value;
      } else if (entry && typeof entry === 'object') {
        // This is a group — recurse
        this.flatten(entry, path, result);
      }
    }
  }
}
```

### Registering and Using

```typescript
import { transformerRegistry } from '../generators/transformers';
import { FlatTokenTransformer } from './FlatTokenTransformer';

// Register
transformerRegistry.register(new FlatTokenTransformer());

// Use
const dtcgTokens = generator.generate();
const result = transformerRegistry.transform('flat', dtcgTokens);
fs.writeFileSync(`dist/${result.filename}`, result.content);
```

---

## FigmaTransformer: Style Generation via Plugin API

The `FigmaTransformer` (Spec 054a) is a production transformer that converts DTCG tokens into Figma Variables and Styles. It demonstrates two key patterns beyond the minimal example: generating composite styles via Plugin API code, and applying different naming conventions for variables vs styles.

### Configuration

```typescript
readonly config: TransformerConfig = {
  id: 'figma',
  name: 'Figma Variables and Styles',
  outputExtension: '.figma.json',
  includeExtensions: false, // Figma doesn't consume DesignerPunk extensions
};
```

### Output Structure

The transformer produces a `FigmaTokenFile` with two sections:

```typescript
interface FigmaTokenFile {
  collections: FigmaVariableCollection[];  // Variables (primitives + semantics)
  styles: FigmaStyleDefinition[];          // Effect styles + text styles
}
```

- `collections` — Two variable collections ("Primitives" and "Semantics"), each with light/dark modes containing identical values (Phase 1)
- `styles` — Effect styles from shadow tokens and text styles from typography tokens

### Variable vs Style Separation

Not all DTCG tokens become Figma variables. Composite tokens (shadow, typography) become Figma styles instead, because designers apply them as one-click presets in the style picker.

| DTCG Group | Figma Artifact | Rationale |
|------------|---------------|-----------|
| `space`, `color`, `fontSize`, etc. | Variables (Primitives collection) | Atomic values that bind to design properties |
| `semanticColor`, `semanticSpace`, etc. | Variables (Semantics collection) | Alias references to primitives |
| `shadow` | Effect Styles | Composite — designers apply as a single shadow preset |
| `typography` | Text Styles | Composite — designers apply as a single type preset |

### Naming Conventions

Variables and styles use different separators because Figma's UI treats them differently:

**Variables** use `/` for visual grouping hierarchy:
```
space/100          ← primitive: "space100" → strip prefix, keep number
color/purple/300   ← primitive: "purple300" → split name + number
color/primary      ← semantic: "color.primary" → dots become slashes
```

**Styles** use `.` for flat display in the style picker:
```
shadow.container
shadow.elevation200
typography.bodySm
typography.heading200
```

The naming logic lives in two methods:

```typescript
// Variables: group + token key → slash-separated path
toFigmaVariableName("space", "space100")     // → "space/100"
toFigmaVariableName("color", "purple300")    // → "color/purple/300"

// Styles: group + token key → dot-separated flat name
toFigmaStyleName("shadow", "container")      // → "shadow.container"
toFigmaStyleName("typography", "bodySm")     // → "typography.bodySm"
```

### Style Generation via Plugin API

Figma's Variables API handles atomic tokens (numbers, colors, strings), but composite tokens like shadows and typography require the Plugin API. The `FigmaTransformer` generates style definitions that the `TokenSyncWorkflow` later executes as Plugin API code.

**Effect styles** (shadows):

```typescript
// FigmaTransformer extracts shadow properties from DTCG:
{
  type: 'EFFECT',
  name: 'shadow.container',
  properties: {
    effects: [{
      type: 'DROP_SHADOW',
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      color: { r: 0, g: 0, b: 0, a: 0.3 }
    }]
  },
  description: 'Source: shadow.container — Container shadow'
}

// TokenSyncWorkflow converts this to Plugin API code:
const style = figma.createEffectStyle();
style.name = "shadow.container";
style.effects = [{
  type: "DROP_SHADOW",
  offset: { x: 0, y: 4 },
  radius: 12,
  spread: 0,
  color: { r: 0, g: 0, b: 0, a: 0.3 }
}];
```

**Text styles** (typography):

```typescript
// FigmaTransformer resolves alias references to concrete values:
{
  type: 'TEXT',
  name: 'typography.bodySm',
  properties: {
    fontFamily: 'Inter',       // resolved from {fontFamily.fontFamilyBody}
    fontSize: 12,              // resolved from {fontSize.fontSize075}
    fontWeight: 400,           // resolved from {fontWeight.fontWeight400}
    lineHeight: 16,            // resolved from {lineHeight.lineHeight075}
    letterSpacing: 0           // resolved from {letterSpacing.letterSpacing100}
  },
  description: 'Source: typography.bodySm — Small body typography'
}
```

Typography tokens in DTCG use alias references (e.g., `{fontFamily.fontFamilyBody}`). The transformer resolves these to concrete values by looking up the referenced primitive in the DTCG file, since Figma's Plugin API needs actual values, not references.

### Registration

The FigmaTransformer registers without modifying any Spec 053 code:

```typescript
import { transformerRegistry } from '../generators/transformers';
import { FigmaTransformer } from './FigmaTransformer';

transformerRegistry.register(new FigmaTransformer());
```

After registration, `transformerRegistry.transformAll()` produces both `DesignTokens.dtcg.json` and `DesignTokens.figma.json` in a single build pass.

---

## Writing Your Own Transformer

### Step-by-step

1. Create a new file (e.g., `src/generators/transformers/MyToolTransformer.ts`)
2. Implement `ITokenTransformer`
3. Register with `transformerRegistry`
4. Run via `transformerRegistry.transform('my-tool', dtcgTokens)` or `transformAll()`

### Traversing DTCG Tokens

The `DTCGTokenFile` is a nested object. Tokens have `$value` and optionally `$type`, `$description`, `$extensions`. Groups contain tokens and nested groups. Properties starting with `$` are metadata.

A common traversal pattern:

```typescript
function walkTokens(
  obj: Record<string, unknown>,
  callback: (path: string, token: DTCGToken) => void,
  prefix = ''
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    const entry = value as Record<string, unknown>;
    if (entry && typeof entry === 'object' && '$value' in entry) {
      callback(path, entry as unknown as DTCGToken);
    } else if (entry && typeof entry === 'object') {
      walkTokens(entry, callback, path);
    }
  }
}
```

### Handling Aliases

Alias values use `{group.tokenName}` syntax. If your target tool doesn't support references, resolve them before output:

```typescript
function resolveAlias(value: unknown, dtcgTokens: DTCGTokenFile): unknown {
  if (typeof value !== 'string') return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const path = match[1].split('.');
  let current: unknown = dtcgTokens;
  for (const segment of path) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return value; // Unresolvable — return original
    }
  }
  return (current as Record<string, unknown>)?.$value ?? value;
}
```

### Reporting Warnings

Use the `warnings` array in `TransformResult` for non-fatal issues:

```typescript
const warnings: string[] = [];

// During transformation
if (token.$type === 'cubicBezier') {
  warnings.push(`Skipped unsupported type cubicBezier for token: ${path}`);
}

return { content, filename, warnings };
```

---

## Related Documentation

- [DTCG Integration Guide](./dtcg-integration-guide.md) — DTCG format overview, token groups, extensions schema, tool integrations, Figma token push workflow
- [MCP Integration Guide](./mcp-integration-guide.md) — Loading and querying DTCG tokens programmatically
- [DTCG Format Module 2025.10 Specification](https://tr.designtokens.org/format/)
- [Figma Token Push Design](../.kiro/specs/054a-figma-token-push/design.md) — Architecture and data models for the Figma sync workflow
