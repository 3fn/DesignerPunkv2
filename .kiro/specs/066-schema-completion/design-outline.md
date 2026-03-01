# Schema Completion and Contract Audit Resolution

**Date**: 2026-02-28
**Purpose**: Create schema.yaml files for the 8 schemaless components and resolve contract audit findings from the post-064 review
**Organization**: spec-guide
**Scope**: 066-schema-completion
**Status**: Design outline — all questions resolved

---

## Problem Statement

The component MCP server (064) indexes components by reading schema.yaml, contracts.yaml, and component-meta.yaml. Of 28 components, 8 lack schema.yaml and are skipped during indexing. These components have platform implementations, contracts, and now component-meta.yaml files — but without schema.yaml, they're invisible to the catalog.

The 8 components:
- **Avatar-Base** — Avatar family primitive
- **Button-Icon** — Buttons family standalone
- **Button-VerticalList-Item** — Buttons family item
- **Button-VerticalList-Set** — Buttons family orchestration pattern
- **Input-Checkbox-Base** — Input-Checkbox family primitive
- **Input-Checkbox-Legal** — Input-Checkbox family semantic (inherits Input-Checkbox-Base)
- **Input-Radio-Base** — Input-Radio family primitive
- **Input-Radio-Set** — Input-Radio family orchestration pattern

These are not new components. They have working implementations across web, iOS, and Android. The work is documenting what already exists — not designing new behavior.

---

## What This Consumes

| Source | What 066 Reads |
|--------|---------------|
| Platform implementations (`platforms/web/`, `platforms/ios/`, `platforms/android/`) | Props, types, defaults, token usage, composition relationships |
| contracts.yaml (existing) | Contract categories, inheritance declarations, behavioral descriptions |
| component-meta.yaml (from 064) | Already created — no changes needed |
| Existing schema.yaml files (20 components) | Format reference, consistency patterns |

---

## Objectives

1. **Create schema.yaml for all 8 components** — matching the format and depth of existing schemas
2. **Accurately document the public API** — props, types, defaults, descriptions derived from actual implementations
3. **Catalog all token dependencies** — including blend tokens, spacing, color, typography, and motion tokens
4. **Document composition relationships** — Button-VerticalList-Set composes Item, Input-Radio-Set composes Radio-Base
5. **Bring the component MCP to 28/28 indexed** — eliminating all "no schema.yaml" warnings from health output
6. **Resolve contract audit findings** — address 4 issues from the post-064 contract audit (see below)
7. **Evolve the component MCP models** — add `internal`/`children.requires` composition split, `omits` field, and `resolvedTokens` assembly

---

## Contract Audit Resolution

Four issues from the post-064 contract audit are bundled into this spec:

### Included

| Issue | Resolution Approach |
|-------|-------------------|
| `contract-audit-blend-token-documentation-gap.md` (Partially Resolved) | Complete resolution: add blend tokens to schema token lists for the 8 new schemas. Contract prose already updated for 3 components. |
| `contract-audit-avatar-hover-clarification.md` (Open) | Add clarifying note to Avatar-Base's `interaction_hover` contract: pointer-only, no keyboard equivalent. Done during Avatar-Base schema creation. |
| `contract-audit-chip-base-missing-interaction.md` (Open) | Investigate Chip-Base platform implementations. Add `interaction_hover`, `interaction_pressed`, `interaction_focus_ring` contracts if behavior exists. Chip-Base already has a schema — this is contract-only work. |
| `contract-audit-state-disabled-exclusions.md` (Open) | Investigation task: check platform implementations for disabled prop support across all 9 affected components. Classify each as gap/intentional/deferred. Implement fixes only for the 8 components we're already touching. Document findings for remaining components. |

### Excluded

| Issue | Reason |
|-------|--------|
| `contract-audit-repeated-interaction-prose.md` | Contract system architecture change (shared templates). Deferred to a future spec. 066 will surface the full pattern picture across all 28 components, informing that future design. Doing it after 066 avoids designing templates with incomplete data. |

---

## Scope Boundaries

**In scope:**
- schema.yaml creation for 8 components
- Token list accuracy (including blend tokens identified in the contract audit)
- Composition relationships for Set/pattern components
- Component MCP model evolution: `internal`/`children.requires` split, `omits` field, `resolvedTokens`
- Contract fixes: Avatar-Base hover clarification, Chip-Base missing interaction contracts
- Investigation: `state_disabled` exclusion classification across 9 components
- Verification that all 28 components index without warnings

**Out of scope:**
- Modifying existing platform implementations
- Modifying component-meta.yaml files (already created in 064)
- Shared contract template system (deferred — depends on 066's findings)
- `state_disabled` implementation changes for components outside the 8 being schemaed (document findings only)

---

## Key Design Questions

### Q1: How do we ensure schema accuracy against implementations?

Each schema must be verified against all 3 platform implementations. The risk is documenting a prop that exists on web but not iOS, or missing a default that differs across platforms.

**Proposed approach**: For each component, read the types.ts (platform-agnostic contract), then cross-reference against each platform file. Props in types.ts are the canonical API. Platform-specific props (like `testID` mapping) follow the established pattern from existing schemas.

### Q2: How do we handle the Set/pattern components?

Button-VerticalList-Set and Input-Radio-Set are orchestration patterns that compose child components. Their schemas need:
- `composition.composes` listing the child component
- `composition.children` constraints (allowed children, counts)
- Props that control child behavior (e.g., `mode` on Button-VerticalList-Set)

**Proposed approach**: Follow Container-Card-Base's schema as the composition reference pattern. It already demonstrates `composes` + child constraints.

**Decision: Split composition into `internal` and `children`, add `requires` field.**

The current `composes` field conflates two distinct relationships:
- **Internal composition**: Component uses another internally — agent doesn't touch (Card wraps Container-Base)
- **Orchestrated composition**: Component manages children the agent must provide (Set manages Items)

Agents need to distinguish these without inferring from description text. New structure:

```yaml
composition:
  internal:
    - component: Container-Base
      relationship: Uses internally for layout primitives
  children:
    requires: [Input-Radio-Base]
    allowed: [Input-Radio-Base]
    prohibited: []
    minCount: 2
    maxCount: 8
  nesting:
    self: false
```

Field semantics:
- `internal` — components wired in, agent doesn't instantiate
- `children.requires` — component types the agent MUST provide (at least one)
- `children.allowed` — component types permitted as children (constraint)
- `children.prohibited` — component types explicitly forbidden
- `children.minCount` / `maxCount` — cardinality constraints

`requires` and `allowed` answer different questions: "what must be present" vs "what types are valid." They may overlap today (Sets require and allow the same type) but will diverge as compositions grow more complex (e.g., a container that allows Badges, Icons, and Buttons but requires at least one Button).

**Impact**: This changes the `CompositionDefinition` interface in the component MCP models. The `composes` field becomes `internal`. Existing schemas (Container-Card-Base, Progress-Stepper-Detailed, etc.) need migration. CompositionChecker needs updating to read the new structure. Parsers need updating.

### Q3: What about the inheritance pair (Input-Checkbox-Legal → Input-Checkbox-Base)?

Input-Checkbox-Legal inherits from Input-Checkbox-Base via contracts. Its schema should only document the props and tokens that are unique to Legal — not duplicate Base's content.

**Proposed approach**: Follow Badge-Count-Notification's schema pattern (inherits Badge-Count-Base). Schema documents own props only. The MCP's inheritance resolver handles the rest.

**Decision: Option C — Own props + explicit omissions via `omits` field.**

Input-Checkbox-Legal narrows its parent's API: it uses `Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'>` to remove props that are fixed for legal consent scenarios. This is different from Badge-Count-Notification, which only adds props without removing any.

Without an `omits` declaration, the MCP's inheritance resolution would merge Base props into Legal's view — and an agent would think `size`, `indeterminate`, and `labelAlign` are available. They're not.

Schema structure for Legal:

```yaml
inherits: Input-Checkbox-Base

omits: [size, indeterminate, labelAlign]

properties:
  requiresExplicitConsent:
    type: boolean
    default: true
    description: Prevents pre-checking for GDPR compliance
  onConsentChange:
    type: "(data: ConsentChangeData) => void"
    description: Callback with ISO 8601 timestamp and audit trail
  legalTextId:
    type: string
    description: ID linking to full legal text for audit trail
  legalTextVersion:
    type: string
    description: Version of legal text being consented to
  showRequiredIndicator:
    type: boolean
    default: true
    description: Whether to show required indicator
```

`omits` is distinct from `excludes`:
- `omits` = API surface layer — parent props not available on this variant
- `excludes` = behavioral contract layer — parent guarantees that don't apply

**Impact**: New `omits` field in schema format. MCP's inheritance resolution needs to filter omitted props from the merged view. `ComponentMetadata` model needs an `omits` field. Parsers need updating.

### Q4: Token list completeness — how thorough?

The contract audit revealed blend tokens missing from documentation. For these 8 schemas, should we:
- (A) List only tokens explicitly referenced in the component's own code
- (B) List tokens including those used by composed children
- (C) List tokens including inherited ones from parent contracts

**Decision: Option A in schema, Option C resolved by MCP at query time.**

Schemas list own tokens only — tokens directly used in the component's platform code. This keeps schemas minimal, accurate, and free from sync drift.

The MCP resolves the full token picture at query time by traversing `internal` and `children.requires` composition relationships (depth-1 only). The assembled response includes:

```json
{
  "tokens": ["space.grouped.normal", "color.feedback.error.text"],
  "resolvedTokens": {
    "own": ["space.grouped.normal", "color.feedback.error.text"],
    "composed": {
      "Input-Radio-Base": ["blend.hoverDarker", "blend.pressedDarker", "..."]
    }
  }
}
```

This follows the same pattern as contract resolution:
- `tokens` — flat list of own tokens (backward compatible)
- `resolvedTokens.own` — same as `tokens`, explicit label
- `resolvedTokens.composed` — tokens from composed children, keyed by component name for source attribution

Agents get the full picture for theme completeness and impact analysis, while schemas stay clean.

**Impact**: New `resolvedTokens` field in `ComponentMetadata` model. New assembly step in `ComponentIndexer` that traverses composition relationships to gather child tokens. Depth-1 only — no recursive resolution.

---

## Risk Assessment

**Low risk**: Schema creation — documentation tasks for existing, tested implementations. No behavioral changes. No new code.

**Medium risk**: Token list accuracy. The blend token audit showed documentation can drift from implementation. Each schema's token list needs verification against actual platform code, not just contracts.

**Medium risk**: MCP model evolution. The `internal`/`children.requires` split, `omits` field, and `resolvedTokens` assembly change the data models and require parser + indexer + checker updates. Existing tests will need updating. Bounded by the fact that only 3-4 components currently use composition.

**Medium risk**: `state_disabled` investigation. May reveal that disabled state is a broader design decision requiring Peter's input. Scoped as investigation-only to contain this risk — implementation deferred if findings are complex.

**Dependency**: None for schema creation. MCP model changes should be done before schemas are authored so the new fields are available.

---

## Sequencing Note

This spec should execute **before** any shared contract template system (repeated-interaction-prose issue). 066 produces the complete picture of all 28 components' contracts and schemas, which informs the template design. Designing templates without this complete picture risks rework.

---

## Related Issues

- `.kiro/issues/contract-audit-blend-token-documentation-gap.md` — **Included** (completion). Schema creation adds blend tokens to token lists.
- `.kiro/issues/contract-audit-avatar-hover-clarification.md` — **Included**. One-line contract update during Avatar-Base schema work.
- `.kiro/issues/contract-audit-chip-base-missing-interaction.md` — **Included**. Add 3 missing contracts to Chip-Base.
- `.kiro/issues/contract-audit-state-disabled-exclusions.md` — **Included** (investigation). Classify each component, fix only the 8 we're touching.
- `.kiro/issues/contract-audit-repeated-interaction-prose.md` — **Excluded**. Deferred to future spec, informed by 066's findings.

---

## Related Documentation

- `.kiro/specs/064-component-metadata-schema/design.md` — Schema format, data models, assembly pipeline
- `.kiro/steering/Component-Schema-Format.md` — Schema authoring standards
- `docs/component-metadata-schema-reference.md` — Field reference for assembled metadata
- Existing schemas for format reference: `Badge-Count-Base`, `Badge-Count-Notification` (inheritance), `Container-Card-Base` (composition)
