# Transformer Development Guide

**Date**: February 17, 2026
**Purpose**: Guide for building custom token transformers that consume DTCG output and produce tool-specific formats
**Organization**: spec-guide
**Scope**: 053-dtcg-token-format-generator
**Layer**: 3
**Relevant Tasks**: transformer-development, dtcg-integration

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

## Spec 054: Figma Transformer

Spec 054 will implement a `FigmaTransformer` that converts DTCG tokens into Figma's Variables API format. Here's how it fits into the architecture:

### Planned Implementation

```typescript
import type { ITokenTransformer, TransformResult, TransformerConfig } from '../generators/transformers';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';

export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables',
    outputExtension: '.figma.json',
    includeExtensions: false, // Figma doesn't use DesignerPunk extensions
  };

  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    const figmaFormat = this.convertToFigmaFormat(dtcgTokens);
    return {
      content: JSON.stringify(figmaFormat, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: [],
    };
  }

  canTransform(_dtcgTokens: DTCGTokenFile): boolean {
    return true; // Figma can handle all DTCG token types
  }

  private convertToFigmaFormat(dtcgTokens: DTCGTokenFile): object {
    // Spec 054 will implement:
    // - Map DTCG types to Figma variable types (COLOR, FLOAT, STRING, BOOLEAN)
    // - Create Figma variable collections from token groups
    // - Resolve aliases to Figma variable references
    // - Handle composite tokens (shadow, typography) as Figma styles
    return {};
  }
}
```

### Integration Point

Spec 054 registers its transformer without modifying any Spec 053 code:

```typescript
import { transformerRegistry } from '../generators/transformers';
import { FigmaTransformer } from './FigmaTransformer';

// Registration — no changes to DTCGFormatGenerator needed
transformerRegistry.register(new FigmaTransformer());
```

### Build Pipeline Integration

After registration, the Figma transformer runs alongside DTCG generation:

```typescript
// In generate-platform-tokens.ts (or equivalent)
const generator = new DTCGFormatGenerator();
const dtcgTokens = generator.generate();
generator.writeToFile('dist/DesignTokens.dtcg.json');

// Run all registered transformers
const results = transformerRegistry.transformAll(dtcgTokens);
for (const result of results) {
  fs.writeFileSync(`dist/${result.filename}`, result.content);
}
```

This produces both `dist/DesignTokens.dtcg.json` (canonical) and `dist/DesignTokens.figma.json` (Figma-specific) in a single build pass.

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

- [DTCG Integration Guide](./dtcg-integration-guide.md) — DTCG format overview, token groups, extensions schema, tool integrations
- [MCP Integration Guide](./mcp-integration-guide.md) — Loading and querying DTCG tokens programmatically
- [DTCG Format Module 2025.10 Specification](https://tr.designtokens.org/format/)
