# MCP Integration Guide

**Date**: February 17, 2026
**Purpose**: Guide for loading, parsing, and querying DTCG tokens programmatically
**Organization**: spec-guide
**Scope**: 053-dtcg-token-format-generator
**Layer**: 3
**Relevant Tasks**: mcp-integration, dtcg-integration

---

## Overview

This guide covers how to work with DesignerPunk's DTCG token output programmatically — loading the file, querying specific tokens by path, and using the transformer architecture for tool-specific formats.

**File location**: `dist/DesignTokens.dtcg.json`

**When to use this guide**: When building tooling, scripts, or MCP server resources that need to read, traverse, or transform the DTCG token file at runtime.

---

## Loading and Parsing DTCG Tokens

The DTCG output is a standard JSON file. Load it with Node.js built-ins:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';

const dtcgPath = path.resolve(__dirname, '../../dist/DesignTokens.dtcg.json');
const dtcgTokens: DTCGTokenFile = JSON.parse(fs.readFileSync(dtcgPath, 'utf-8'));
```

### Verifying the Load

After parsing, confirm the file has the expected structure:

```typescript
// Check schema presence
console.log(dtcgTokens.$schema);
// → "https://tr.designtokens.org/format/"

// Check root extensions (if generated with includeExtensions: true)
console.log(dtcgTokens.$extensions?.designerpunk?.version);
// → "1.0.0"

// List top-level token groups
const groups = Object.keys(dtcgTokens).filter(k => !k.startsWith('$'));
console.log('Token groups:', groups);
// → ["space", "color", "fontSize", "fontWeight", ..., "typography", "motion"]
```

---

## Querying Tokens by Path

DTCG tokens are organized in a nested object structure. To access a specific token, split the path and traverse:

```typescript
import type { DTCGToken, DTCGTokenFile } from '../generators/types/DTCGTypes';

/**
 * Query a specific token by dot-separated path.
 *
 * @param dtcgTokens - The parsed DTCG token file
 * @param tokenPath - Dot-separated path (e.g., "space.space200", "shadow.container")
 * @returns The token object, or undefined if not found
 */
function getToken(dtcgTokens: DTCGTokenFile, tokenPath: string): DTCGToken | undefined {
  const segments = tokenPath.split('.');
  let current: unknown = dtcgTokens;

  for (const segment of segments) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  // Verify it's a token (has $value)
  if (current && typeof current === 'object' && '$value' in (current as object)) {
    return current as DTCGToken;
  }

  return undefined;
}
```

### Usage Examples

```typescript
// Primitive spacing token
const space200 = getToken(dtcgTokens, 'space.space200');
console.log(space200?.$value);       // → "16px"
console.log(space200?.$type);        // → "dimension"

// Semantic color token (alias)
const successText = getToken(dtcgTokens, 'semanticColor.color.feedback.success.text');
console.log(successText?.$value);    // → "{color.green400}"

// Shadow composite token
const containerShadow = getToken(dtcgTokens, 'shadow.container');
console.log(containerShadow?.$value);
// → { offsetX: "0px", offsetY: "4px", blur: "12px", spread: "0px", color: "rgba(0, 0, 0, 0.3)" }

// Typography composite token
const bodyMd = getToken(dtcgTokens, 'typography.bodyMd');
console.log(bodyMd?.$value);
// → { fontFamily: "{fontFamily.fontFamilyBody}", fontSize: "{fontSize.fontSize100}", ... }
```

### Querying a Group

To get all tokens in a group, access the group directly and filter out `$`-prefixed metadata:

```typescript
import type { DTCGGroup, DTCGToken } from '../generators/types/DTCGTypes';

/**
 * Get all tokens in a group (non-recursive, one level deep).
 */
function getGroupTokens(
  dtcgTokens: DTCGTokenFile,
  groupPath: string
): Record<string, DTCGToken> {
  const segments = groupPath.split('.');
  let current: unknown = dtcgTokens;

  for (const segment of segments) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return {};
    }
  }

  const group = current as Record<string, unknown>;
  const tokens: Record<string, DTCGToken> = {};

  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in (value as object)) {
      tokens[key] = value as DTCGToken;
    }
  }

  return tokens;
}
```

```typescript
// Get all spacing tokens
const spacingTokens = getGroupTokens(dtcgTokens, 'space');
console.log(Object.keys(spacingTokens));
// → ["space025", "space050", "space075", "space100", "space125", ...]
```

---

## Walking All Tokens

To iterate over every token in the file (useful for indexing, searching, or bulk operations):

```typescript
import type { DTCGToken, DTCGTokenFile } from '../generators/types/DTCGTypes';

/**
 * Walk all tokens in a DTCG file, invoking a callback for each.
 *
 * @param obj - The DTCG object to traverse
 * @param callback - Called with (dotPath, token) for each token found
 * @param prefix - Internal: current path prefix for recursion
 */
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

### Example: Count Tokens by Type

```typescript
const typeCounts: Record<string, number> = {};

walkTokens(dtcgTokens, (_path, token) => {
  const type = token.$type || 'unknown';
  typeCounts[type] = (typeCounts[type] || 0) + 1;
});

console.log(typeCounts);
// → { dimension: 85, color: 120, number: 45, fontWeight: 5, ... }
```

### Example: Find Tokens by Extension Property

```typescript
// Find all tokens with a mathematical formula
const formulaTokens: Array<{ path: string; formula: string }> = [];

walkTokens(dtcgTokens, (path, token) => {
  const formula = token.$extensions?.designerpunk?.formula;
  if (formula) {
    formulaTokens.push({ path, formula });
  }
});

console.log(`Found ${formulaTokens.length} tokens with formulas`);
```

---

## Using Transformers for Tool-Specific Formats

The transformer architecture lets you convert DTCG tokens into formats tailored to specific tools. The `TransformerRegistry` manages registered transformers and orchestrates invocation.

### Importing

```typescript
import { transformerRegistry } from '../generators/transformers';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';
```

### Running a Specific Transformer

```typescript
import * as fs from 'fs';

// Load DTCG tokens
const dtcgTokens: DTCGTokenFile = JSON.parse(
  fs.readFileSync('dist/DesignTokens.dtcg.json', 'utf-8')
);

// Transform using a registered transformer (e.g., 'figma')
try {
  const result = transformerRegistry.transform('figma', dtcgTokens);
  fs.writeFileSync(`dist/${result.filename}`, result.content);
  console.log(`Wrote ${result.filename}`);

  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings.join(', '));
  }
} catch (error) {
  console.error('Transform failed:', (error as Error).message);
}
```

### Running All Registered Transformers

```typescript
const results = transformerRegistry.transformAll(dtcgTokens);

for (const result of results) {
  fs.writeFileSync(`dist/${result.filename}`, result.content);
  console.log(`Wrote ${result.filename}`);

  if (result.warnings.length > 0) {
    console.warn(`${result.filename} warnings:`, result.warnings.join(', '));
  }
}

console.log(`Generated ${results.length} tool-specific outputs`);
```

### Listing Available Transformers

```typescript
const transformers = transformerRegistry.getAll();

for (const t of transformers) {
  console.log(`${t.config.id}: ${t.config.name} (${t.config.outputExtension})`);
}
// Example output:
// figma: Figma Variables (.figma.json)
// flat: Flat Key-Value Map (.flat.json)
```

---

## Resolving Aliases

Semantic tokens use alias syntax (`{group.tokenName}`) to reference primitives. If you need resolved values at runtime:

```typescript
/**
 * Resolve a DTCG alias value to its final value.
 *
 * @param value - The token value (may be an alias string like "{color.purple300}")
 * @param dtcgTokens - The full DTCG token file for lookups
 * @returns The resolved value, or the original value if not an alias
 */
function resolveAlias(value: unknown, dtcgTokens: DTCGTokenFile): unknown {
  if (typeof value !== 'string') return value;

  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const segments = match[1].split('.');
  let current: unknown = dtcgTokens;

  for (const segment of segments) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return value; // Unresolvable — return original alias
    }
  }

  const resolved = (current as Record<string, unknown>)?.$value;
  if (resolved === undefined) return value;

  // Recursively resolve chained aliases
  return resolveAlias(resolved, dtcgTokens);
}
```

```typescript
// Resolve a semantic color alias
const token = getToken(dtcgTokens, 'semanticColor.color.feedback.success.text');
const resolved = resolveAlias(token?.$value, dtcgTokens);
console.log(resolved); // → "rgba(0, 200, 83, 1)" (the actual color value)
```

### Resolving Composite Token Aliases

Composite tokens (typography, transition) contain alias references in their properties. Resolve each property individually:

```typescript
function resolveCompositeAliases(
  compositeValue: Record<string, unknown>,
  dtcgTokens: DTCGTokenFile
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [prop, val] of Object.entries(compositeValue)) {
    resolved[prop] = resolveAlias(val, dtcgTokens);
  }
  return resolved;
}
```

```typescript
const motionToken = getToken(dtcgTokens, 'motion.floatLabel');
if (motionToken && typeof motionToken.$value === 'object') {
  const resolved = resolveCompositeAliases(
    motionToken.$value as Record<string, unknown>,
    dtcgTokens
  );
  console.log(resolved);
  // → { duration: "250ms", timingFunction: [0.2, 0, 0, 1], delay: "0ms" }
}
```

---

## Related Documentation

- [DTCG Integration Guide](./dtcg-integration-guide.md) — DTCG format overview, token groups, extensions schema, tool integrations
- [Transformer Development Guide](./transformer-development-guide.md) — Building custom transformers for tool-specific output
- [DTCG Format Module 2025.10 Specification](https://tr.designtokens.org/format/)
