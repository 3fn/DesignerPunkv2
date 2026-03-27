# Component Meta Extraction Pipeline

**Date**: 2026-03-27
**Purpose**: Derive component-meta.yaml from Component-Family steering docs, eliminating dual maintenance and improving discoverability
**Organization**: spec-guide
**Scope**: 086-component-meta-extraction-pipeline
**Status**: Draft — Pending review

---

## Problem Statement

Component discoverability data is maintained in two places:

1. **Component-Family steering docs** (`.kiro/steering/Component-Family-*.md`) — human-authored, ballot-measure-governed, the authoritative source for when/why to use each component
2. **component-meta.yaml files** (per-component) — agent-optimized, hand-authored separately, what the Application MCP actually reads

These drift apart. The Spec 083 gap report found that natural search terms don't appear in `purpose` text (#16), context tags don't cross-reference purpose (#17), and common UI contexts like "dashboards" are undertagged (#18). The root cause isn't content quality — it's that the meta files are maintained independently from the family docs that contain the same information.

Additionally, three reference docs (`component-meta-authoring-guide.md`, `component-mcp-query-guide.md`, `component-metadata-schema-reference.md`) live in `docs/` and are not indexed by the docs MCP, making them invisible to agents other than Lina.

---

## Goals

1. **Single source of truth**: Component-Family steering docs become the authoritative source for all discoverability data, including the agent-optimized `purpose` field
2. **Build-time extraction**: A script generates `component-meta.yaml` files from family docs, eliminating manual dual maintenance
3. **Docs MCP coverage**: Reference docs are migrated into the docs MCP index so all agents can query them
4. **Discoverability enrichment**: The extraction process addresses gap report items #16, #17, #18 by ensuring family docs contain rich, searchable content

---

## Current State

### Component-Family Doc Structure (existing)

Each family doc has a "Usage Guidelines" section with:
- "When to Use This Family" — maps to `usage.when_to_use` / `when_not_to_use`
- "Primitive vs Semantic Selection" — table mapping scenarios to components with rationale, maps to `alternatives`
- "Common Patterns" — code examples showing component in context

**What's missing for extraction:**
- No `purpose` field per component (agent-optimized one-liner)
- No `contexts` list per component (UI regions)
- Selection guidance is at the family level, not per-component
- Format is human prose, not structured for machine extraction

### component-meta.yaml Structure (existing)

Per the authoring guide, each file has:
- `purpose` (string) — agent-optimized, verb-first, ~30 words
- `usage.when_to_use` (list) — concrete scenarios
- `usage.when_not_to_use` (list) — with alternatives named
- `contexts` (list) — kebab-case UI regions
- `alternatives` (list of {component, reason})

---

## Proposed Approach: Hybrid Extraction

### Add Structured Metadata Section to Family Docs

Each Component-Family doc gets a new "Component Metadata" section (or subsection per component within "Component Schemas") containing the extractable fields:

```markdown
### Badge-Count-Base Metadata

**Purpose**: Display a numeric count indicator, such as unread notifications or item quantities, in a compact badge.

**Contexts**: navigation-tabs, list-items, icon-overlays, app-bars

**Alternatives**:
- Badge-Label-Base: When the indicator shows text labels instead of numbers
- Badge-Count-Notification: When the count represents notifications requiring semantic color and live region announcements
```

The `usage.when_to_use` and `usage.when_not_to_use` are already in the "Usage Guidelines" section at the family level. The extraction script maps family-level guidance to individual components based on the selection table.

### Build-Time Extraction Script

A Node.js script that:
1. Reads each `Component-Family-*.md` file
2. Parses the structured metadata sections (purpose, contexts, alternatives per component)
3. Extracts family-level usage guidance and maps to individual components
4. Generates `component-meta.yaml` files in each component directory
5. Validates output against the existing schema (purpose ≥10 words, contexts ≥2, etc.)

### Reference Doc Migration

Move or configure the docs MCP to index:
- `docs/component-meta-authoring-guide.md` → add metadata header, update to reflect generated (not hand-authored) workflow
- `docs/component-mcp-query-guide.md` → add metadata header
- `docs/component-metadata-schema-reference.md` → add metadata header

These may move to `.kiro/steering/` or the docs MCP indexer may be extended to cover `docs/`. The simpler path depends on how the docs MCP indexer is configured — needs investigation.

---

## What Changes

### Component-Family Docs (13 families, 7-8 with content)
- Add per-component metadata sections (purpose, contexts, alternatives)
- Ensure "Usage Guidelines" has structured when_to_use / when_not_to_use per component (not just family-level)
- Template update: `Component-MCP-Document-Template.md` gets the new section format

### component-meta.yaml Files (28 components)
- Become generated artifacts, not hand-authored
- Added to `.gitignore` or marked with a "generated — do not edit" header
- Authoring guide updated to point authors to family docs instead

### Reference Docs (3 files)
- Metadata headers added for docs MCP indexing
- Authoring guide content updated to reflect extraction workflow

### Build System
- New extraction script in project tooling
- Optionally integrated into `npm run build` or run as a standalone command

---

## Scope

### In Scope
- Structured metadata format for Component-Family docs
- Template update (`Component-MCP-Document-Template.md`)
- Updating existing Component-Family docs with per-component metadata
- Build-time extraction script
- Reference doc migration to docs MCP
- Authoring guide update
- Discoverability enrichment (gap report #16, #17, #18)

### Out of Scope
- Changing the Application MCP's indexing logic (it still reads `component-meta.yaml` — the files are just generated now)
- Changing the `component-meta.yaml` schema itself
- New component creation (gap report #1, #2)
- Container-Card-Base readiness update (gap report #3 — separate one-line change)

---

## Agent Coordination

| Area | Agent | Role |
|------|-------|------|
| Family doc metadata sections | Lina | Author per-component metadata in family docs |
| Template update | Lina | Update Component-MCP-Document-Template.md |
| Extraction script | Thurgood | Build tooling (his infrastructure domain) |
| Reference doc migration | Lina + Thurgood | Lina updates content, Thurgood configures indexing |
| Discoverability enrichment | Lina | Ensure purpose text includes natural search terms |
| Token references in family docs | Ada | Verify if extraction affects token documentation |
| Application MCP verification | Thurgood | Confirm generated meta files index correctly |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Extraction script misparses family doc format | Medium | Validate output against existing hand-authored meta files before replacing them |
| Family docs become cluttered with structured metadata | Low | Keep metadata sections concise; they complement, not replace, the prose guidance |
| Generated meta files diverge from what Application MCP expects | Low | Schema hasn't changed; only the authoring source changes |
| Docs MCP migration breaks existing references | Low | Update cross-references in the same spec |

---

## Success Criteria

1. All 28 components have `component-meta.yaml` files generated from family docs
2. Generated files pass Application MCP health check with zero warnings
3. `find_components({ purpose: "filter bar" })` returns Chip-Filter (gap #16 resolved)
4. `find_components({ context: "dashboards" })` returns ≥5 production components (gap #18 resolved)
5. Three reference docs are queryable via docs MCP `get_section()`
6. No hand-authored `component-meta.yaml` files remain (all generated)

---

## Open Questions

1. **Docs MCP indexing**: Does the indexer need code changes to cover `docs/`, or is moving files to `.kiro/steering/` simpler? Thurgood to assess.
2. **Family-level vs component-level usage**: Some when_to_use/when_not_to_use entries apply to the whole family, others to specific components. How does the extraction script handle this mapping? Needs design during requirements phase.
3. **Components without family docs**: Are there any indexed components whose family doc is a placeholder (no real content)? Those would need content authored, not just extracted.

---

## Next Steps

1. Agent feedback on this design outline
2. Resolve open questions
3. Formalize into requirements, design, tasks
