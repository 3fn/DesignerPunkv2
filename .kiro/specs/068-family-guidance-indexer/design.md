# Design Document: Family Guidance Indexer

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Status**: Design Phase
**Dependencies**: 067 (Application MCP — COMPLETE)

---

## Overview

This spec adds family-level prop and selection guidance to the Application MCP. A new `FamilyGuidanceIndexer` parses companion YAML files from a `family-guidance/` directory, integrates with the existing `ComponentIndexer`, and serves guidance through a new `get_prop_guidance` MCP tool.

The companion YAML files are authored in phases: schema convention first (ballot measure), then 3 discovery docs serially (Button → Form-Inputs → Container), then remaining 10 docs batched by similarity.

---

## Architecture

### Module Map

| Module | Status | Changes |
|--------|--------|---------|
| `models/index.ts` | Existing | Add `FamilyGuidance`, `SelectionRule`, `FamilyPattern` interfaces |
| `indexer/FamilyGuidanceIndexer.ts` | **New** | Parse and index companion YAML files |
| `indexer/ComponentIndexer.ts` | Existing | Integrate `FamilyGuidanceIndexer`, expose guidance queries |
| `index.ts` | Existing | Register `get_prop_guidance` tool |

### Data Flow

```
Startup sequence (strict ordering):
  ComponentIndexer → PatternIndexer → FamilyGuidanceIndexer
  (Cross-reference validation requires prior indexes to be built)

Agent query (get_prop_guidance)
  → MCP tool handler (index.ts)
    → ComponentIndexer.getGuidance(componentOrFamily)
      → FamilyGuidanceIndexer (parsed YAML data)
    → Apply verbose filter (omit rationale/description if verbose=false)
  → Response to agent
```

### File Organization

```
project-root/
├── family-guidance/
│   ├── README.md              # Schema reference + read-both protocol
│   ├── button.yaml            # Companion to Component-Family-Button.md
│   ├── form-inputs.yaml       # Companion to Component-Family-Form-Inputs.md
│   └── container.yaml         # Companion to Component-Family-Container.md
├── experience-patterns/       # Existing (067)
├── component-mcp-server/      # Existing
└── .kiro/steering/
    ├── Component-Family-Button.md        # Cross-ref → family-guidance/button.yaml
    ├── Component-Family-Form-Inputs.md   # Cross-ref → family-guidance/form-inputs.yaml
    └── Component-Family-Container.md     # Cross-ref → family-guidance/container.yaml
```

---

## Data Models

### FamilyGuidance

Represents a parsed companion YAML file.

```typescript
export interface FamilyGuidance {
  family: string;
  companion: string;
  whenToUse: string[];
  whenNotToUse: string[];
  selectionRules: SelectionRuleGroup[];
  accessibilityNotes: string[];
  patterns: FamilyPattern[];
}
```

### SelectionRuleGroup

Supports both flat rules (Button) and grouped rules (Form-Inputs).

```typescript
export interface SelectionRuleGroup {
  group?: string;
  rules: SelectionRule[];
}

export interface SelectionRule {
  scenario: string;
  recommend: string;
  props?: Record<string, unknown>;
  rationale: string;
}
```

Design note: When `group` is absent, the group contains top-level rules. When present, it names a sub-type grouping (e.g., "Text Inputs", "Checkboxes"). This handles both Button's flat structure and Form-Inputs' grouped structure with a single interface.

Normalization: For families without groups (e.g., Button), the indexer wraps flat rules in a single `SelectionRuleGroup` with no `group` field. The MCP tool can flatten this for simple families.

### FamilyPattern

Family-scoped composition patterns (not cross-family — those are experience patterns).

```typescript
export interface FamilyPattern {
  name: string;
  description: string;
  components: FamilyPatternComponent[];
  relatedPatterns: string[];
}

export interface FamilyPatternComponent {
  component: string;
  role: string;
  props?: Record<string, unknown>;
}
```

### get_prop_guidance Response

```typescript
export interface PropGuidanceResponse {
  family: string;
  whenToUse: string[];
  whenNotToUse: string[];
  selectionRules: SelectionRuleGroup[];
  accessibilityNotes: string[];
  patterns: FamilyPattern[];
}
```

When `verbose=false` (default), `rationale` is stripped from all `SelectionRule` entries and `description` is stripped from `FamilyPattern` entries.

---

## Design Decisions

### Decision 1: Companion Files in Dedicated Directory

Family guidance YAML files live in `family-guidance/` at project root, not in `.kiro/steering/`.

**Rationale**: Family docs are governance layer (steering). Companion YAMLs are application layer (MCP data). Different audiences, different purposes. Mirrors `experience-patterns/` convention. The `companion` cross-reference field handles discoverability.

**Alternative considered**: Co-location in `.kiro/steering/`. Rejected because it clutters the steering directory and complicates the indexer scan path.

### Decision 2: Normalization of Flat vs Grouped Rules

All selection rules are stored as `SelectionRuleGroup[]`, even for families without sub-type groupings.

**Rationale**: Uniform data structure simplifies the indexer and MCP tool. Flat rules (Button) are wrapped in a single group with no `group` field. The MCP tool can detect single-ungrouped-group and flatten for simpler response when appropriate.

**Alternative considered**: Union type (`SelectionRule[] | SelectionRuleGroup[]`). Rejected because it pushes type-checking to every consumer.

The MCP tool always returns `SelectionRuleGroup[]` as-is — no flattening of single-ungrouped-groups for simple families. Consumers check `group === undefined` themselves. This avoids special-case logic for marginal benefit.

### Decision 3: Verbose Flag for Token Cost Control

`get_prop_guidance` defaults to `verbose=false`, omitting `rationale` and `description` fields.

**Rationale**: Product application agents (070) typically need decisions, not reasoning. `rationale` is the bulk of token cost. System agents or humans who want the full context can pass `verbose=true`.

### Decision 4: Schema Extensibility for Token Families

The current schema uses `recommend` for component names. Future token family guidance would use `recommend` for token names. A `type` field (`component` | `token`) will be added when token family support is implemented — not now.

**Rationale**: Validate against component families first. The schema shape works for both; only the `type` discriminator is missing. Adding it now would be speculative.

---

## D9 Compliance

Selection rules use prop values (`variant: primary`, `padding: "200"`). This is the correct abstraction level — agents need semantic intent, not token mappings.

Risk surface: `rationale` text (human-authored prose) may reference visual properties with raw values instead of token names. Convention: rationale referencing visual properties must use token names (e.g., "uses `color.contrast.onPrimary`" not "uses white text").

Enforcement: structural validation in the indexer (prop values checked against schema), content governance via review (rationale text checked during ballot measures).

---

## Testing Strategy

### Unit Tests

- `FamilyGuidanceIndexer`: Parse valid YAML, handle malformed entries, validate schema, emit warnings for unknown families
- `get_prop_guidance` tool: Query by component name, query by family name, verbose vs non-verbose response, no-guidance-found response

### Fixture Files

- Valid companion YAML for a simple family (Button-like: flat rules, no groups)
- Valid companion YAML for a complex family (Form-Inputs-like: grouped rules, multiple sub-types)
- Malformed YAML (missing required fields, invalid references)

### Integration

- `ComponentIndexer` integration: verify `FamilyGuidanceIndexer` data is accessible through `ComponentIndexer` queries
- Cross-reference validation: companion YAML references resolve to real family docs

---

## Correctness Properties

1. Every `recommend` value in a selection rule must reference a component that exists in the component catalog.
2. Every `companion` path must reference a file that exists.
3. Every `relatedPatterns` entry must reference an experience pattern that exists in the pattern index.
4. `props` values in selection rules must be valid prop values for the recommended component (validated against schema.yaml when available).
5. No duplicate `scenario` values within the same group.


---

## Lina's Review Notes (2026-03-04)

**Reviewer**: Lina (Stemma Component Specialist)

### Actionable: Architecture section — explicit startup ordering
The Data Flow section implies but doesn't state the initialization sequence. Make it explicit: `ComponentIndexer` → `PatternIndexer` → `FamilyGuidanceIndexer`. Cross-reference validation (`recommend` against component catalog, `relatedPatterns` against pattern index) requires both prior indexes to be built. Without this stated, someone wiring the integration without reading Ada's review will hit runtime errors against an empty catalog.

### Actionable: Decision 2 — MCP tool behavior for single-ungrouped-group
The normalization decision is correct (always `SelectionRuleGroup[]`). But the design doc should specify what the MCP tool does with it in the response: always return the array as-is. Don't flatten single-ungrouped-groups for simple families — that adds special-case logic for marginal benefit. Consumers can check `group === undefined` themselves.

### No other design-level concerns. Data models, normalization, verbose flag, and D9 compliance are sound.

---

## Ada's Technical Review (2026-03-04)

**Reviewer**: Ada (Rosetta Token Specialist)

### Actionable: Correctness Property 4 — ordering dependency

Property 4 ("props values validated against schema.yaml") requires the component index to be built before the guidance index validates. This means the indexer startup sequence must be: `ComponentIndexer` → `PatternIndexer` → `FamilyGuidanceIndexer`. This ordering isn't stated in the design doc but is implied by the cross-reference validation. Make it explicit — either in the Architecture section or as a note on Correctness Property 4.

### No other design-level concerns. Data models, normalization approach, verbose filter, and D9 compliance section are all sound.
