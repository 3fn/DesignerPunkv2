# Family Guidance Indexer: Machine-Queryable Prop and Selection Guidance

**Date**: 2026-03-04
**Purpose**: Parse structured guidance from Component-Family docs into the Application MCP, enabling agents to query prop selection, family member selection, and common composition patterns
**Organization**: spec-guide
**Scope**: 068-family-guidance-indexer
**Status**: Design outline — promoted from seed, pending formalization

---

## Problem Statement

The Application MCP (Spec 067) provides component selection, pattern serving, and assembly validation. But it lacks family-level intelligence — the knowledge captured in Component-Family docs about when to use which family member, prop guidance, and common composition patterns.

This knowledge exists in 13 family docs as human-authored prose and tables but isn't machine-queryable. An agent can find that Button-CTA exists and what it composes, but can't ask "which Button variant should I use for a destructive action?" or "what emphasis level is appropriate for a secondary action in a form?"

The `get_prop_guidance` tool was deferred from Spec 067 (Decision D6) specifically because it depends on this indexer work.

---

## What Exists Today

### Family Docs (13, all production-ready content)

Each Component-Family doc contains rich guidance that's currently human-readable only:

- **"When to Use" / "When NOT to Use"** — structured bullet lists per family
- **"Primitive vs Semantic Selection"** — decision tables mapping scenarios → recommended components with rationale (Form-Inputs, Container)
- **Prop guidance** — emphasis variant selection (Button), padding override hierarchy (Container)
- **Common Patterns** — code examples showing cross-family composition (login form, settings panel, card patterns)
- **Inheritance hierarchies** — component status, relationships, planned variants

### What's NOT Machine-Parseable Yet

- Structure varies between docs (custom sections, different table formats)
- Common Patterns are code examples, not structured data
- No consistent schema across the 13 family docs

### Revised Timeline Assessment (from 067 discussion)

Originally estimated 2 specs away from family-doc-level MCP sophistication. After auditing Button, Form-Inputs, and Container docs during 067: the content is rich enough already. The gap is an indexer + structured data format, not content authoring.

---

## Proposed Approach

### 1. Family Guidance YAML Schema
Design a structured schema for the guidance data each family doc should contain. Covers prop selection rules, family member selection criteria, and common composition patterns.

### 2. Interview-Driven Authoring
Author YAML blocks inline in 2-3 family docs (Button, Form-Inputs, Container — already audited during 067) to validate the schema. Same interview-driven process that produced experience patterns in 067.

### 3. Family Guidance Indexer
Build an indexer that parses YAML blocks from family doc markdown files. Integrates with the existing ComponentIndexer.

### 4. `get_prop_guidance` MCP Tool
Implement the tool deferred from 067 (D6). Agents query by component name and receive structured prop selection guidance, family member recommendations, and composition patterns.

### 5. Rollout
Extend structured YAML blocks to remaining 10 family docs.

---

## Open Decisions

### D1: YAML Inline vs Companion Files — RESOLVED
Separate companion YAML files, not inline in family docs.

**Rationale**: The primary consumers of structured guidance are agents querying the Application MCP — particularly product application agents (070) who need decisions, not rationale. Separate files let the MCP serve structured data directly without loading full family docs. This optimizes for machine consumption and minimizes token cost.

**Drift mitigation**:
- Bidirectional cross-references: family doc names its companion YAML, YAML names its family doc
- Mandatory read-both protocol: agents must read both files before modifying either, enforced via frontmatter convention (similar to `inclusion: always` pattern in 00-Steering)
- Commit-level validation (follow-up): hook or CI check that flags when one file is modified without the other in the same commit

**File organization**: Companion YAML files live alongside the family docs they mirror. Exact location TBD during implementation (likely `.kiro/steering/` siblings or a dedicated guidance directory).

### D2: Schema Shape — RESOLVED (foundation, refinement expected per family)
The companion YAML schema covers four guidance categories observed across Button, Form-Inputs, and Container family docs:

**Core fields:**
- `family` — family name
- `companion` — path to paired family doc (bidirectional cross-reference)
- `whenToUse` — string array of use cases
- `whenNotToUse` — string array with alternative recommendations
- `selectionRules` — scenario → recommendation mappings (see below)
- `accessibilityNotes` — string array of accessibility considerations

**Selection rules structure:**
```yaml
selectionRules:
  - scenario: "Primary action (submit, save)"
    recommend: Button-CTA
    props:                    # optional — when selection is by prop, not component
      variant: primary
    rationale: "Highest visual emphasis — use for single, focused CTAs"
    notes: "optional additional context"
  - group: "Text Inputs"     # optional — for families with sub-type groupings
    rules:
      - scenario: "Email address collection"
        recommend: Input-Text-Email
        rationale: "Built-in email validation and autocomplete"
```

Key design choices:
- `group` is optional — Button doesn't need it, Form-Inputs does
- `props` is optional — only present when selection is by prop variant on a single component vs. choosing between components
- Schema deliberately excludes behavioral contracts (in contracts.yaml) and token dependencies (in schema.yaml) to avoid duplication
- Common Patterns representation deferred to D4
- Refinement expected per family during Phase 2 interview-driven authoring

### D3: Ballot Measure Scope — RESOLVED
Family docs are steering docs — changes go through the ballot measure model. Approach: phased.

- **Phase 1**: One ballot measure for the YAML schema convention itself (the format being added to family docs).
- **Phase 2**: First 3 family docs (Button, Form-Inputs, Container) processed individually — these are the schema discovery phase where the YAML shape will evolve.
- **Phase 3**: Remaining 10 family docs batched by similarity where content structure aligns, processed individually where content meaningfully diverges. Batch groupings determined after Phase 2 provides evidence.

### D4: Common Patterns Representation — RESOLVED (low confidence, revisit during Phase 2)
Family guidance YAML carries family-scoped patterns only. Cross-family compositions belong in experience patterns (067).

**Family-scoped patterns**: How members of *this family* work together or how *this family's* props are configured in context. Example: Button's "Form Actions" pattern (primary submit + tertiary cancel).

**Cross-family patterns**: Full compositions across multiple families. Example: login form using Form-Inputs + Button + Container. These are experience patterns, not family guidance.

**Schema:**
```yaml
patterns:                        # optional — empty or absent for simpler families
  - name: "Form Actions"
    description: "Primary + tertiary button pairing for form submit/cancel"
    components:
      - component: Button-CTA
        role: submit
        props:
          variant: primary
      - component: Button-CTA
        role: cancel
        props:
          variant: tertiary
    relatedPatterns:             # cross-references to experience patterns
      - simple-form
      - account-onboarding
```

Key design choices:
- `patterns` is optional — simpler families (Button, Badge) may not need it
- Structured data, not code examples — code examples remain in the family doc prose for human readers
- `relatedPatterns` provides cross-references to experience patterns, avoiding duplication
- Family guidance can reference experience patterns but must not duplicate them

**Low confidence note:** The boundary between family-scoped patterns and experience patterns is theoretical until tested against real content during Phase 2 interviews. If the distinction proves artificial or confusing, this decision should be revisited.

---

## Dependencies

- **Spec 067 (Application MCP)**: Complete. Provides the MCP infrastructure and deferred D6.
- **Component-Family docs (13)**: All exist with production-ready content.

---

## Agents

- **Lina** (lead) — component domain, indexer implementation
- **Ada** (consult) — token references in prop guidance
- **Thurgood** (consult) — schema validation, test governance

---

## Downstream Impact

Specs 069 (Layout Templates) and 070 (Agent Architecture) should be reevaluated after 068 outcomes are known. Findings from the family guidance interviews and indexer implementation may surface insights that affect layout template design or agent responsibility boundaries.
