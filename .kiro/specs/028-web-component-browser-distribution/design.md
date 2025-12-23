# Design Document: Web Component Browser Distribution

**Date**: December 22, 2025
**Purpose**: Technical design for browser-ready web component distribution
**Organization**: spec-design
**Scope**: 028-web-component-browser-distribution

---

## Overview

This design document specifies how DesignerPunk will deliver browser-ready web components and design tokens. The solution adds browser distribution as a natural output of the existing build pipeline, supporting both modern ES modules (ESM) and legacy Universal Module Definition (UMD) formats.

The core problem: DesignerPunk's current build outputs CommonJS modules, which are incompatible with browser ES module imports. Components fail silently when loaded via `<script type="module">`. This design establishes a sustainable pattern for browser consumption that scales as the component library grows.

---

## Architecture

### Build Pipeline Integration

The browser distribution integrates into the existing build pipeline as an additional output stage:

```
npm run build
    │
    ├── Token Generation (existing)
    │   ├── DesignTokens.web.css
    │   ├── DesignTokens.ios.swift
    │   └── DesignTokens.android.kt
    │
    ├── TypeScript Compilation (existing)
    │   └── dist/*.js (CommonJS)
    │
    └── Browser Bundle Generation (NEW)
        ├── dist/browser/designerpunk.esm.js
        ├── dist/browser/designerpunk.esm.min.js
        ├── dist/browser/designerpunk.umd.js
        ├── dist/browser/designerpunk.umd.min.js
        ├── dist/browser/designerpunk.esm.js.map
        ├── dist/browser/designerpunk.umd.js.map
        ├── dist/browser/tokens.css (copy of DesignTokens.web.css)
        └── dist/browser/demo.html
```

### Key Principle: Additive, Not Replacement

Browser bundles are an additional output. Existing build outputs (CommonJS, type definitions, platform tokens) remain unchanged. This ensures backward compatibility with existing consumers.

---

## Components and Interfaces

### Browser Entry Point

A new entry point file aggregates all web components for browser consumption:

```typescript
// src/browser-entry.ts

// Import all web components
import { TextInputField } from './components/web/TextInputField';
import { ButtonCTA } from './components/web/ButtonCTA';
import { Icon } from './components/web/Icon';
import { Container } from './components/web/Container';

// Token detection and warning
function checkTokensLoaded(): void {
  const testProperty = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary');
  
  if (!testProperty || testProperty.trim() === '') {
    console.warn(
      '[DesignerPunk] Design tokens not detected. ' +
      'Include tokens.css before using components: ' +
      '<link rel="stylesheet" href="dist/browser/tokens.css">'
    );
  }
}

// Auto-registration with idempotency check
function safeDefine(name: string, constructor: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
  }
}

// Register all components
safeDefine('text-input-field', TextInputField);
safeDefine('button-cta', ButtonCTA);
safeDefine('dp-icon', Icon);
safeDefine('dp-container', Container);

// Check tokens after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkTokensLoaded);
} else {
  checkTokensLoaded();
}

// Export for UMD global access
export { TextInputField, ButtonCTA, Icon, Container };
```

### Bundle Configuration

The bundler (esbuild or Rollup) will be configured to produce multiple output formats:

**ESM Bundle Configuration:**
- Format: ES modules
- Target: ES2020
- Output: `dist/browser/designerpunk.esm.js`
- Minified: `dist/browser/designerpunk.esm.min.js`
- Source maps: Yes

**UMD Bundle Configuration:**
- Format: UMD (Universal Module Definition)
- Target: ES2017
- Global name: `DesignerPunk`
- Output: `dist/browser/designerpunk.umd.js`
- Minified: `dist/browser/designerpunk.umd.min.js`
- Source maps: Yes

### npm Package Exports

The `package.json` will be updated with proper export mappings:

```json
{
  "name": "@designerpunk/components",
  "main": "./dist/index.js",
  "module": "./dist/browser/designerpunk.esm.js",
  "browser": "./dist/browser/designerpunk.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/browser/designerpunk.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./tokens.css": "./dist/browser/tokens.css"
  }
}
```

---

## Data Models

### Bundle Size Report

The build system will output a structured size report:

```typescript
interface BundleSizeReport {
  bundles: BundleInfo[];
  totalRaw: number;
  totalGzipped: number;
  warnings: string[];
}

interface BundleInfo {
  name: string;
  path: string;
  rawSize: number;      // bytes
  gzippedSize: number;  // bytes
  exceedsSoftCeiling: boolean;
}
```

### Build Output Structure

```
dist/browser/
├── designerpunk.esm.js          # ESM bundle (development)
├── designerpunk.esm.min.js      # ESM bundle (production)
├── designerpunk.esm.js.map      # ESM source map
├── designerpunk.esm.min.js.map  # ESM minified source map
├── designerpunk.umd.js          # UMD bundle (development)
├── designerpunk.umd.min.js      # UMD bundle (production)
├── designerpunk.umd.js.map      # UMD source map
├── designerpunk.umd.min.js.map  # UMD minified source map
├── tokens.css                   # Design tokens as CSS custom properties
└── demo.html                    # Verification demo page
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis of acceptance criteria, the following properties have been identified for property-based testing:

### Property 1: Token CSS Completeness

*For any* CSS custom property referenced by a DesignerPunk web component, that property SHALL exist in the generated `tokens.css` file.

**Validates: Requirements 3.2**

**Testing approach**: Extract all CSS custom property references from component source files, then verify each exists in the generated tokens.css. This ensures no component references a token that doesn't exist.

### Property 2: Registration Idempotency

*For any* custom element name that is already registered in the browser's custom elements registry, loading the Browser_Bundle SHALL not throw an error and the existing registration SHALL remain unchanged.

**Validates: Requirements 4.5**

**Testing approach**: Pre-register a custom element with a known name, load the bundle, verify no error is thrown and the original constructor is still registered.

### Property 3: Minification Effectiveness

*For any* bundle pair (non-minified and minified versions), the minified version SHALL be at least 50% smaller than the non-minified version.

**Validates: Requirements 5.3**

**Testing approach**: After build, compare file sizes of each bundle pair (esm/esm.min, umd/umd.min) and verify the size reduction meets the threshold.

### Property 4: MCP Documentation Format Compliance

*For any* required MCP metadata field (Date, Purpose, Organization, Scope, Layer), that field SHALL be present in the Browser Distribution Guide steering document.

**Validates: Requirements 9.2**

**Testing approach**: Parse the steering document and verify all required metadata fields are present with non-empty values.

---

## Error Handling

### Token Detection Errors

When the browser bundle loads, it checks for the presence of design tokens by testing a known CSS custom property. If tokens are not detected:

1. A warning is logged to the browser console (not an error, to avoid breaking the page)
2. The warning includes actionable guidance: the path to tokens.css
3. Components still render, but without proper styling

**Rationale**: Failing loudly (console warning) surfaces the issue without breaking the page entirely. This aligns with the project's "fail loudly to surface issues" philosophy while remaining developer-friendly.

### Custom Element Registration Errors

The `safeDefine` function wraps `customElements.define()` to handle the case where an element is already registered:

```typescript
function safeDefine(name: string, constructor: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
  }
}
```

**Rationale**: This prevents errors when the bundle is accidentally loaded twice or when a consumer has already registered a component with the same name.

### Build Errors

If bundle generation fails during `npm run build`:

1. The build process exits with a non-zero exit code
2. A descriptive error message is output to stderr
3. Partial outputs are not left in the dist/browser directory

**Rationale**: Build failures should be obvious and actionable. Partial outputs could cause confusion.

### Bundle Size Warnings

If any bundle exceeds the 100KB gzipped soft ceiling:

1. A warning is output to the console during build
2. The build still succeeds (it's a soft ceiling, not a hard limit)
3. The warning includes the actual size and the threshold

**Rationale**: This provides visibility into bundle growth without blocking releases. The team can decide when optimization is needed.

---

## Testing Strategy

### Dual Testing Approach

This spec uses both unit tests and property-based tests:

- **Unit tests**: Verify specific examples (bundle loads, components render, files exist)
- **Property tests**: Verify universal properties (token completeness, minification effectiveness)

### Unit Tests

Unit tests will cover:

1. **Bundle Generation**: Verify all expected files are created after build
2. **ESM Loading**: Load ESM bundle in JSDOM, verify no errors
3. **UMD Loading**: Load UMD bundle in JSDOM, verify global object exists
4. **Component Registration**: Verify all four components are registered
5. **Token Warning**: Verify console warning when tokens not loaded
6. **Demo Page**: Verify demo.html exists and contains expected elements
7. **Source Maps**: Verify .map files exist for all bundles
8. **Package Exports**: Verify package.json contains correct export configuration

### Property-Based Tests

Property tests will use fast-check (or similar) with minimum 100 iterations:

1. **Token Completeness** (Property 1): Generate random component token references, verify all exist in tokens.css
2. **Registration Idempotency** (Property 2): Pre-register random element names, verify bundle handles gracefully
3. **Minification Effectiveness** (Property 3): Verify size relationship holds for all bundle pairs
4. **MCP Format Compliance** (Property 4): Verify all required metadata fields present

### Test Configuration

- **Framework**: Jest (existing project standard)
- **Property Testing**: fast-check library
- **Browser Environment**: JSDOM for bundle loading tests
- **Minimum Iterations**: 100 per property test

### Test File Organization

```
src/__tests__/
├── browser-distribution/
│   ├── bundle-generation.test.ts      # Unit: files created
│   ├── esm-loading.test.ts            # Unit: ESM bundle loads
│   ├── umd-loading.test.ts            # Unit: UMD bundle loads
│   ├── component-registration.test.ts # Unit: components registered
│   ├── token-warning.test.ts          # Unit: warning behavior
│   └── properties/
│       ├── token-completeness.property.ts    # Property 1
│       ├── registration-idempotency.property.ts # Property 2
│       ├── minification-effectiveness.property.ts # Property 3
│       └── mcp-format-compliance.property.ts # Property 4
```

---

## Implementation Notes

### Bundler Selection

The implementation will use **esbuild** for bundle generation:

- Fast build times (important for development iteration)
- Native ESM and UMD output support
- Built-in minification
- Source map generation
- Already used in similar projects

Alternative considered: Rollup. Rejected because esbuild is faster and sufficient for this use case.

### Build Script Integration

A new script will be added to the build pipeline:

```json
{
  "scripts": {
    "build": "npm run build:tokens && npm run build:ts && npm run build:browser",
    "build:browser": "node scripts/build-browser-bundles.js"
  }
}
```

The `build-browser-bundles.js` script will:
1. Run esbuild for ESM and UMD outputs
2. Copy tokens.css to dist/browser
3. Generate demo.html
4. Calculate and report bundle sizes
5. Warn if any bundle exceeds soft ceiling

### Demo Page Template

The demo page will be a static HTML file that:
- Loads tokens.css
- Loads the ESM bundle (with UMD fallback for older browsers)
- Renders all four components with example props
- Includes interactive elements to verify functionality

---

## Related Documentation

- **Requirements**: `.kiro/specs/028-web-component-browser-distribution/requirements.md`
- **Design Outline**: `.kiro/specs/028-web-component-browser-distribution/design-outline.md`
- **Issue Discovery**: `.kiro/issues/web-component-browser-distribution.md`
- **Web Format Audit**: `.kiro/audits/web-format-migration-investigation.md`

---

*This design document provides the technical specification for browser distribution. Implementation tasks will be defined in tasks.md.*
