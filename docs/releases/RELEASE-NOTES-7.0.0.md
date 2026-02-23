# Release Notes: v7.0.0

**Date**: February 23, 2026
**Type**: Major Release (new Figma integration pipeline, breaking API changes)
**Previous**: v6.4.0 (Progress Indicator Family, Custom Agent System)

---

## Summary

The Figma Integration Pipeline release. Six specs deliver an end-to-end workflow from DTCG token generation through Figma variable push to component design extraction with three-tier token classification. Also includes a component demo system with 16 interactive demos.

**Breaking changes**: `DesignOutline` type removed (replaced by `ComponentAnalysis`), `ConsoleMCPClient` interface expanded with `getComponentImage()`.

---

## New Feature: DTCG Token Format Generator (Spec 053)

Complete DTCG Format Module 2025.10 compliant JSON generator — the foundation for external tool interoperability.

- 23 generation methods covering all primitive and semantic token categories
- Shadow color-opacity merge with alpha replacement
- Typography and motion composite token generation
- Full configuration: extensions, deprecated flags, aliases, pretty print, schema URL
- Transformer architecture for platform-specific output (CSS, Swift, Kotlin, Figma)
- Integrated into build pipeline (`npm run build:tokens`)

---

## New Feature: Figma Token Push (Spec 054a)

Push DesignerPunk tokens to Figma as native variables and styles via figma-console-mcp.

- **FigmaTransformer**: Converts DTCG tokens to Figma variable format with collection grouping (Primitives, Semantics), mode support (light/dark), and type mapping
- **TokenSyncWorkflow**: Orchestrates full and incremental sync with diff detection, batch operations, and rollback on failure
- **ConsoleMCPClient**: MCP client abstraction for figma-console-mcp communication (Desktop Bridge plugin via WebSocket)
- **CLI command**: `npm run figma:push` with `--dry-run`, `--incremental`, `--collection` flags
- **Desktop Bridge pre-flight**: Validates Figma Desktop Bridge plugin connectivity before operations
- Shadow and typography pushed as Figma styles (not variables — Figma limitation)

---

## New Feature: Figma Design Extraction (Spec 054b)

Extract component data from Figma and translate back to DesignerPunk tokens.

- **TokenTranslator**: Reverse-maps Figma variable names to DTCG token paths via `figmaToTokenIndex`, with binding-first and value-fallback matching
- **VariantAnalyzer**: Detects variant axes, analyzes property differences across variants, generates component token recommendations
- **DesignExtractor**: Reads Figma components via REST + Plugin API, translates token bindings, detects composition patterns
- **CLI command**: `npm run figma:extract -- --file KEY --node ID`
- Value matching with category-specific tolerances: ±2px spacing, ±1px font/radius, ΔE < 3 color

---

## New Feature: Figma Token Push Fixes (Spec 054c)

Bug fixes for the token push pipeline discovered during integration testing.

- Fixed incremental sync parameter schemas (batch create/update variable payloads)
- Fixed semantic token alias creation (alias references now resolve correctly)
- Fixed stale figma-console-mcp process cleanup on startup (port range 9223-9232)
- Added checkpoint task confirming 512/512 tests passing

---

## New Feature: Component Analysis Extraction (Spec 054d)

Hierarchical component analysis with three-tier token classification — the design-to-code bridge.

### Three-Tier Classification

- **Semantic Identified**: Figma variable binding resolves to a semantic token (alias `$value`)
- **Primitive Identified**: Figma variable binding resolves to a primitive token (raw `$value`)
- **Unidentified**: No binding, or binding resolves to a token not in the DTCG system
- Value-based matches classify as Unidentified with `suggestedToken` — only bindings earn Identified status

### Binding Resolution Pipeline

- Collects `boundVariables` from all node properties (spacing, color, radius, opacity, stroke, typography)
- Batch-resolves variable IDs via Plugin API (`figma.variables.getVariableByIdAsync`)
- Fetches collection name alongside variable name for tier determination
- Reclassifies without semantic promotion — primitives stay primitive, semantics stay semantic
- Handles flat dot-separated DTCG keys (e.g., `semanticColor["color.feedback.success.text"]`)

### Full Design Property Extraction

- **Layout**: padding, spacing, radius, dimensions, sizing mode (FIXED/HUG/FILL), alignment, opacity
- **Typography**: fontSize, fontFamily, fontWeight, lineHeight, letterSpacing, characters, textAlign
- **Stroke**: strokeWeight, stroke color, strokeAlign
- **Fills**: fill color with opacity multiplication
- 7 new token categories: fontSize, fontWeight, lineHeight, letterSpacing, borderWidth, opacity, sizing

### Noise Reduction

- Skip `counter-axis-spacing: 0` (Figma default)
- Skip `item-spacing` when `layoutMode: NONE` (no auto-layout)
- Skip `padding: 0` on leaf nodes (TEXT, VECTOR, etc.)
- Skip `border-radius: 0` (the none case)

### COMPONENT_SET Support

- Fetches all variant children via single Plugin API call (not just default variant)
- Screenshots each variant individually (COMPONENT_SET nodes are unrenderable)
- Component-specific output directories: `analysis/analysis-[component-name]/`

### CLI Enhancements

- `--url` flag accepts full Figma URLs (parses fileKey, nodeId, fileUrl)
- Screenshot download from Figma CDN to local `images/` directory
- Dual output: JSON (machine-readable) + Markdown (human-readable)
- Classification summary in terminal output

---

## New Feature: Component Demo System (Spec 061)

Interactive HTML demos for all 16 DesignerPunk components.

- Central index page (`demos/index.html`) with 8 categories
- Individual demo pages with live component rendering
- Property controls for interactive variant exploration
- Responsive layout with DesignerPunk token-based styling
- 8 tasks completed covering infrastructure, index, and all component demos

---

## Breaking Changes

| Change | Migration |
|---|---|
| `DesignOutline` type removed from exports | Use `ComponentAnalysis` instead — same data, richer structure |
| `ConsoleMCPClient.getComponentImage()` added | Implementors of `ConsoleMCPClient` interface must add this method |
| `TokenCategory` expanded | Existing values unchanged; 7 new values added (additive but type-narrowing code may need updates) |
| `familyToCategory('fontSize')` returns `'fontSize'` instead of `'typography'` | Code using `category === 'typography'` for font size matching should use `'fontSize'` |

---

## Test Status

- 512/512 figma + CLI tests passing
- 31 test suites
- Zero regressions

---

## Specs Completed

| Spec | Name | Tasks |
|---|---|---|
| 053 | DTCG Token Format Generator | 6 |
| 054a | Figma Token Push | 7 |
| 054b | Figma Design Extract | 6 |
| 054c | Figma Token Push Fixes | 6 |
| 054d | Hierarchical Design Extraction | 7 |
| 061 | Component Demo System | 8 |
| **Total** | **6 specs** | **40 tasks** |
