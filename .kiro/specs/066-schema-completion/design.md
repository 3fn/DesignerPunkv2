# Design Document: Schema Completion and Contract Audit Resolution

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion
**Status**: Design Phase
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 063 (Uniform Contract System — COMPLETE)

---

## Overview

This spec has two workstreams: (1) create schema.yaml for 8 schemaless components so the component MCP indexes 28/28, and (2) evolve the component MCP data models to support richer composition semantics, property omission, and resolved token assembly.

The schema creation is documentation work — capturing what already exists in platform implementations. The model evolution is implementation work — changing TypeScript interfaces, parsers, indexer assembly, composition checker, and tests.

Both workstreams are bundled because the model changes are motivated by what the 8 schemas need to express (Set orchestration patterns, Legal's prop omission). Splitting them would create a circular dependency.

---

## Architecture

No new architectural components. This spec modifies existing component MCP modules:

| Module | Changes |
|--------|---------|
| `models/index.ts` | `CompositionDefinition` restructured, `omits` added to schema parsing, `resolvedTokens` added to `ComponentMetadata` |
| `indexer/parsers.ts` | Parse `internal`, `children.requires`, `omits` from schema YAML |
| `indexer/ComponentIndexer.ts` | New assembly step: resolve composed tokens at depth-1 |
| `indexer/InheritanceResolver.ts` | Filter omitted props from merged property set |
| `composition/CompositionChecker.ts` | Validate against `requires`, `allowed`, `prohibited` |
| `query/QueryEngine.ts` | No changes — passes through updated models |

---

## Data Model Changes

### CompositionDefinition (before → after)

**Before** (064):
```typescript
interface CompositionDefinition {
  composes: CompositionRelationship[];
  children?: {
    allowed?: string[];
    prohibited?: string[];
    allowedCategories?: string[];
    prohibitedCategories?: string[];
    minCount?: number;
    maxCount?: number;
  };
  nesting?: { self: boolean };
  rules?: CompositionRule[];
}
```

**After** (066):
```typescript
interface CompositionDefinition {
  internal: CompositionRelationship[];
  children?: {
    requires?: string[];
    allowed?: string[];
    prohibited?: string[];
    allowedCategories?: string[];
    prohibitedCategories?: string[];
    minCount?: number;
    maxCount?: number;
  };
  nesting?: { self: boolean };
  rules?: CompositionRule[];
}
```

Changes:
- `composes` → `internal` (rename — clarifies agent doesn't instantiate these)
- `children.requires` added (component types agent MUST provide)
- `allowedCategories` and `prohibitedCategories` retained for future use

### ComponentMetadata additions

```typescript
interface ComponentMetadata {
  // ... existing fields unchanged ...

  /** Property omissions from parent (schema-level, distinct from contract excludes) */
  omits: string[];

  /** Resolved token assembly (own + composed children) */
  resolvedTokens: {
    own: string[];
    composed: Record<string, string[]>;
  };
}
```

### Schema YAML additions

```yaml
# Property omission (inheriting components only)
omits: [size, indeterminate, labelAlign]

# Composition with internal/children split
composition:
  internal:
    - component: Container-Base
      relationship: Uses internally for layout
  children:
    requires: [Input-Radio-Base]
    allowed: [Input-Radio-Base]
    minCount: 2
    maxCount: 8
  nesting:
    self: false
```

---

## Component-Specific Design Notes

### Set/Pattern Components

Button-VerticalList-Set and Input-Radio-Set are orchestration patterns. Their schemas express:
- `internal`: none (they don't wrap hidden components)
- `children.requires`: the item type they orchestrate
- `children.allowed`: same as requires (constrained to one type)
- `children.minCount`/`maxCount`: cardinality constraints from types.ts

### Input-Checkbox-Legal (omits)

Legal narrows Base's API via `Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'>`. Schema declares `omits: [size, indeterminate, labelAlign]`. The MCP's inheritance resolution filters these from the merged property set.

### Token Verification Approach

Each schema's token list is derived from platform code, not contracts. For each component:
1. Read types.ts for token references
2. Read web platform file for CSS custom property usage
3. Read iOS/Android platform files for token constant usage
4. Cross-reference with contract prose for blend tokens
5. Deduplicate and alphabetize

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `omits` references nonexistent parent prop | Warning: "Omit '[prop]' not found on parent [Parent]" |
| `children.requires` references unindexed component | Warning: "Required child [name] not in catalog" |
| `resolvedTokens` composed child not indexed | Empty array for that child, warning surfaced |
| `internal` component not indexed | Relationship preserved, tokens not resolved, warning |

---

## Testing Strategy

### Unit Tests

| Component | What to Test | Tier |
|-----------|-------------|------|
| Schema parser | Parse `internal`, `children.requires`, `omits` from YAML | Tier 2 |
| InheritanceResolver | Filter omitted props, warn on nonexistent omit | Tier 2 |
| CompositionChecker | Validate `requires` constraint, `allowed`/`prohibited` with new structure | Tier 2 |
| ComponentIndexer | `resolvedTokens` assembly from composition graph, depth-1 limit | Tier 2 |

### Integration Tests

| Scenario | What to Test | Tier |
|----------|-------------|------|
| Input-Radio-Set | Composition with `requires` + `allowed`, token resolution from Radio-Base | Tier 3 |
| Input-Checkbox-Legal | Inheritance with `omits`, verify omitted props absent from assembled metadata | Tier 3 |
| Full catalog | 28/28 indexed, zero errors, health check clean | Tier 3 |

### Existing Test Updates

The `internal`/`children.requires` rename will break existing composition tests (CompositionChecker, integration tests using Container-Card-Base). These must be updated as part of the model evolution task — not deferred.

---

## Design Decisions

### Decision 1: `internal` vs `composes` Rename

**Options**: (A) Keep `composes`, add `requires` alongside, (B) Rename `composes` → `internal`, add `children.requires`
**Decision**: Option B
**Rationale**: `composes` is ambiguous — it could mean "uses internally" or "orchestrates children." The rename makes the distinction explicit. The migration cost is bounded (4 existing schemas use `composes`).
**Trade-off**: Breaking change to schema format. Mitigated by migrating all existing schemas in the same task.

### Decision 2: `omits` as Schema-Level Field

**Options**: (A) Handle in MCP code only (hardcoded omission logic), (B) Declare in schema YAML as `omits` field
**Decision**: Option B
**Rationale**: Schema should be the source of truth for the component's public API. Hardcoding omissions in MCP code creates hidden knowledge. The `omits` field is declarative, auditable, and follows the same pattern as `excludes` in contracts.yaml.
**Trade-off**: New field to maintain. Low cost — only inheriting components that narrow their parent's API need it.

### Decision 3: Resolved Tokens at Depth-1

**Options**: (A) Recursive token resolution through full composition graph, (B) Depth-1 only (direct children), (C) No resolution — own tokens only
**Decision**: Option B
**Rationale**: Depth-1 covers the real use case (Set needs to know its Item's tokens for theme impact). Recursive resolution is speculative — no current component has depth-2 composition. Same pattern as inheritance (max depth 1).
**Trade-off**: If depth-2 composition appears, resolution must be extended. The depth-1 limit is explicit and easy to relax.

---

## Related Documentation

- `.kiro/specs/066-schema-completion/requirements.md` — Requirements this design implements
- `.kiro/specs/066-schema-completion/design-outline.md` — Design decisions Q1–Q4, scope boundaries
- `.kiro/specs/064-component-metadata-schema/design.md` — Original MCP architecture and data models
- `.kiro/steering/Component-Schema-Format.md` — Schema authoring standards
- `.kiro/steering/Contract-System-Reference.md` — Contract taxonomy and canonical format
