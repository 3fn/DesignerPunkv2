# Release Notes: v8.0.0

**Date**: February 28, 2026
**Type**: Major Release (uniform contract system, component metadata schema, release system rebuild)
**Previous**: v7.0.0 (Figma Integration Pipeline)

---

## Summary

The Contract & Metadata Infrastructure release. Three specs deliver a uniform behavioral contract system across all 28 components, a machine-readable component metadata schema served by a new MCP server, and a rebuilt release analysis pipeline. Agents can now discover, select, and compose Stemma components through structured queries instead of parsing raw files.

**Breaking changes**: Avatar renamed to Avatar-Base across all references. Component MCP server is a new sibling server requiring separate configuration. Release tool relocated from `src/release-analysis/` to `src/tools/release/`.

---

## New Feature: Uniform Contract System (Spec 063)

Standardized behavioral contracts across all 28 Stemma components with a 10-category taxonomy and 112 concepts.

- 10 contract categories: layout, interaction, state, validation, accessibility, composition, content, animation, visual, performance
- 112 canonical concepts with `{category}_{concept}` naming convention
- 28 `contracts.yaml` files — one per component, sole source of truth for behavioral guarantees
- Formal inheritance (`inherits:` declarations) and intentional exclusions (`excludes:` with rationale)
- Three-state model: implemented, excluded by design, or not applicable
- Contract-System-Reference.md steering doc with full taxonomy, concept catalog, and canonical format
- Component-Schema-Format.md rewritten as catalog-derived spec

---

## New Feature: Component Metadata Schema (Spec 064)

Tool-agnostic, machine-readable component metadata served by a new MCP server for agent-driven component selection and UI composition.

- **Component MCP Server** (`component-mcp-server/`): Sibling MCP server with 6 query tools
  - `get_component_catalog` — browse all 20 indexed components (~50 tokens each)
  - `get_component_summary` — structural identity + contracts + annotations (~200 tokens)
  - `get_component_full` — complete assembled metadata with all contracts and composition rules
  - `find_components` — combinable filters: category, concept, platform, purpose keyword
  - `check_composition` — validate parent-child relationships with conditional rules
  - `get_component_health` — index diagnostics and warnings
- **Resolve on read**: No generated metadata files — assembles from schema.yaml + contracts.yaml + component-meta.yaml at query time
- **Progressive disclosure**: Three-tier responses manage agent token budgets
- **Inheritance resolution**: Parent contracts merged with child extensions, excludes preserved
- **Contract-token derivation**: Accessibility and animation contracts cross-referenced with schema tokens
- **Composition checking**: Static constraints and bounded conditional rules (when/then on prop values)
- **FileWatcher**: Live re-indexing on source file changes
- **28 component-meta.yaml files**: Semantic annotations with purpose, usage guidance, contexts, and alternatives
- **A2UI v0.9 mapping exercise**: 0 schema omissions found — all gaps classified as renderer bridge concerns
- **Data contracts**: Deferred to v2 with governance trigger criteria documented

### Pre-Schema Cleanup
- Avatar renamed to Avatar-Base across all file paths, schema references, contract references, test files, and steering docs
- 3 stale motion contract token names corrected (Avatar-Base, Chip-Base, Chip-Filter)
- Button-Icon iOS scale value resolved

---

## New Feature: Release System Rebuild (Spec 065)

Rebuilt release analysis pipeline with summary-driven change detection and modular architecture.

- Summary doc parser extracts changes from `docs/specs/` completion summaries
- LLM-powered change classifier categorizes changes by type and significance
- Version calculator recommends semantic version bumps with confidence scores
- Release notes renderer generates markdown from classified changes
- CLI interface: `npm run release:analyze`, `npm run release:generate`, `npm run release:publish`
- Hook integration: commit-task.sh runs release analysis automatically on task completion
- Old release analysis system removed (`src/release-analysis/` cleaned up)
- Summary format enhanced with optional Deliverables field (ballot measure approved)

---

## Documentation

- `docs/component-metadata-schema-reference.md` — All assembled JSON fields with types and sources
- `docs/component-mcp-query-guide.md` — All 6 MCP tools with parameters and example responses
- `docs/component-meta-authoring-guide.md` — How to author component-meta.yaml files
- `.kiro/steering/Contract-System-Reference.md` — Contract taxonomy, naming convention, canonical format
- `.kiro/steering/Component-Meta-Data-Shapes-Governance.md` — Data shapes governance criteria

---

## Agent System Updates

- Lina's scaffolding workflow updated with component-meta.yaml creation step
- Lina's MCP query table expanded with Contract-System-Reference and data shapes governance
- Component MCP server added to Lina's allowed write paths
- Authoring guide added as Lina skill

---

## Stats

| Metric | v7.0.0 | v8.0.0 |
|--------|--------|--------|
| Tests | 8,200+ | 7,496 (7,437 + 59 component MCP) |
| Components | 24 | 28 production-ready |
| Tokens | 310+ | 310+ |
| Contract concepts | — | 112 across 10 categories |
| MCP servers | 1 (docs) | 2 (docs + components) |
| Steering docs | 51 | 53 |
| Component-meta.yaml files | — | 28 |

---

## Breaking Changes

1. **Avatar → Avatar-Base**: All references renamed. Import paths, test files, schema references, and steering docs updated.
2. **Component MCP Server**: New sibling server at `component-mcp-server/`. Requires separate `npm install` and MCP client configuration.
3. **Release tool relocation**: `src/release-analysis/` removed. New location: `src/tools/release/`. CLI commands unchanged (`npm run release:*`).

---

## What Changed from Previous Version

1. ✅ **Added** Uniform Contract System: 10-category taxonomy, 112 concepts, 28 contracts.yaml files (Spec 063)
2. ✅ **Added** Component MCP Server: 6 query tools with progressive disclosure, resolve-on-read assembly (Spec 064)
3. ✅ **Added** 28 component-meta.yaml semantic annotations with purpose, usage, contexts, alternatives (Spec 064)
4. ✅ **Added** Contract-token derivation for accessibility and animation contracts (Spec 064)
5. ✅ **Added** Composition checking with bounded conditional rules (Spec 064)
6. ✅ **Added** Release analysis pipeline rebuild with summary-driven change detection (Spec 065)
7. ✅ **Added** Contract-System-Reference.md and Component-Schema-Format.md steering docs (Spec 063)
8. ✅ **Added** Component-Meta-Data-Shapes-Governance.md steering doc (Spec 064)
9. ✅ **Added** Schema reference, query guide, and authoring guide documentation (Spec 064)
10. ✅ **Breaking** Avatar renamed to Avatar-Base across all references (Spec 064)
11. ✅ **Breaking** Component MCP server is a new sibling server requiring configuration (Spec 064)
12. ✅ **Breaking** Release tool relocated from `src/release-analysis/` to `src/tools/release/` (Spec 065)
13. ✅ **Updated** Agent configurations: Lina's scaffolding workflow, MCP queries, write paths (Spec 064)
14. ✅ **Updated** Specs reference to 048-065 (active implementation)
