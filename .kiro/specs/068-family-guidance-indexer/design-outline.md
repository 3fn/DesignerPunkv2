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
Author companion YAML files for 3 family docs (Button, Form-Inputs, Container — already audited during 067) to validate the schema. Same interview-driven process that produced experience patterns in 067. Strictly serial: Button → Form-Inputs → Container. Schema changes from each inform the next.

### 3. Family Guidance Indexer
Build an indexer that parses companion YAML files from the `family-guidance/` directory. Integrates with the existing ComponentIndexer, following the same pattern as `PatternIndexer`.

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

**File organization**: Companion YAML files live in a dedicated `family-guidance/` directory at project root, mirroring `experience-patterns/`. Family docs are governance layer (`.kiro/steering/`); companion YAMLs are application layer (MCP data). The `companion` cross-reference field handles discoverability without physical co-location.

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

**D9 compliance**: Selection rules use prop values. Rationale text referencing visual properties must use token names, not raw values (e.g., "uses `color.contrast.onPrimary`" not "uses white text"). Structural validation in the indexer; content governance via review.

**Implementation note**: `rationale` will be the bulk of token cost in MCP responses. The `get_prop_guidance` tool should consider a `verbose` flag — return rationale only on request, not by default. Product application agents (070) will typically want decisions without rationale.

### D3: Ballot Measure Scope — RESOLVED
Family docs are steering docs — changes go through the ballot measure model. Approach: phased.

- **Phase 1**: One ballot measure for the YAML schema convention itself (the format being added to family docs).
- **Phase 2**: First 3 family docs (Button → Form-Inputs → Container) processed individually and strictly serially — these are the schema discovery phase where the YAML shape will evolve. Schema changes from each doc must be applied before starting the next.
- **Phase 3**: Remaining 10 family docs batched by similarity where content structure aligns, processed individually where content meaningfully diverges. Batch groupings determined after Phase 2 provides evidence. Note: Phase 3 effort depends heavily on schema stability after Phase 2 — if each doc has unique guidance structures, batching may not save much.

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

**Low confidence note:** The boundary between family-scoped patterns and experience patterns is theoretical until tested against real content during Phase 2 interviews. During Phase 2, explicitly ask "does this pattern belong in family guidance, experience pattern, or both?" for every pattern encountered. If the answer is "both" more than once, revisit D4.

---

## Dependencies

- **Spec 067 (Application MCP)**: Complete. Provides the MCP infrastructure and deferred D6.
- **Component-Family docs (13)**: All exist with production-ready content.

### Future Extensibility (not in scope)

Token family docs (e.g., `Token-Family-Responsive.md`) could use the same companion YAML pattern in the future. The current schema works for token guidance with minor additions: `recommend` accepting token names alongside component names, plus a `type` field to distinguish component vs. token guidance. Don't add now — validate against component families first, extend later without breaking changes.

---

## Agents

- **Lina** (lead) — component domain, indexer implementation
- **Ada** (consult) — token references in prop guidance
- **Thurgood** (consult) — schema validation, test governance

### Design Outline Review Requests

#### For Lina

You're the implementation lead on this spec. Specific review areas:

1. **D2 (Schema Shape)** — Does the `selectionRules` structure (with optional `group` and `props` fields) work for the indexer you'd build? Any fields missing that would make implementation harder?
2. **D1 (Companion Files)** — The indexer needs to scan separate YAML files and pair them with family docs via cross-references. Does this create any concerns for how you'd design the indexer, or does it follow the same pattern as `PatternIndexer`?
3. **D4 (Family-Scoped Patterns)** — The boundary is: family-scoped patterns in companion YAML, cross-family compositions in experience patterns, with `relatedPatterns` cross-references. Does this boundary make sense from the experience pattern side? Any overlap concerns?
4. **D3 (Phased Ballot Measures)** — First 3 docs (Button, Form-Inputs, Container) processed individually as schema discovery. Does that sequencing work for implementation, or would you prefer a different order?

#### For Ada

Token governance and future extensibility review:

1. **D2 (Schema Shape)** — Selection rules reference token-backed prop values (e.g., `padding: "200"`). Does the schema adequately represent the token relationship, or should it be more explicit about which token a value references?
2. **Token family doc extensibility** — We explicitly kept token family docs out of 068's scope, but discussed the schema being designed to accommodate them in the future. Does the current schema shape work for token family guidance (e.g., responsive token selection rules), or would it need structural changes?
3. **D9 compliance (from 067)** — The `hints` convention from experience patterns used token governance conventions. Does the companion YAML schema need similar governance awareness for token references in `selectionRules` and `patterns`?

---

## Lina's Review Notes (for Thurgood)

### D2: Drop `notes` field
`notes` is redundant with `rationale`. During 067, a single guidance string per rule was sufficient. If both exist, authors won't know where to put what. Drop `notes` unless Phase 2 interviews surface a clear need.

### D2: `rationale` verbosity in MCP responses
`rationale` will be the bulk of token cost when agents query. The MCP tool should consider a `verbose` flag — return rationale only on request, not by default. Not a schema change, but an implementation consideration worth capturing.

### D1: Dedicated directory over `.kiro/steering/`
Companion YAML files should live in a dedicated `family-guidance/` directory at project root, mirroring `experience-patterns/`. Mixing them into `.kiro/steering/` creates clutter and complicates the indexer scan path. Counter-argument: co-location with family docs makes the relationship physically visible, but the `companion` cross-reference field handles discoverability.

### D4: Actively test the boundary during Phase 2
The family-scoped vs. experience pattern boundary is theoretical. During 067, "Form Actions" (primary submit + tertiary cancel) naturally belongs in both Button family guidance AND simple-form experience pattern. Suggestion: during Phase 2 interviews, explicitly ask "does this pattern belong in family guidance, experience pattern, or both?" for every pattern. If the answer is "both" more than once, revisit D4.

### D3: Phase 2 must be strictly serial
Button → Form-Inputs → Container is the right order (simple → grouped → compositional). But all three must be strictly serial, not parallelized. If Button reveals a schema change, apply it before starting Form-Inputs to avoid discovering the same issue twice.

### Overall
Ready for formalization once Ada and Thurgood weigh in. Main risks are `notes`/`rationale` redundancy and the family-vs-experience pattern boundary — both will surface naturally in Phase 2.

---

## Downstream Impact

Specs 069 (Layout Templates) and 070 (Agent Architecture) should be reevaluated after 068 outcomes are known. Findings from the family guidance interviews and indexer implementation may surface insights that affect layout template design or agent responsibility boundaries.

---

## Ada's Review Notes (2026-03-04)

**Reviewer**: Ada (Rosetta Token Specialist)

### Consultation Responses

**Q1 (D2 — Token relationship in selection rules)**: Prop values in selection rules (`variant: primary`, `padding: "200"`) are the right level of abstraction. An agent choosing between variants needs semantic intent ("highest emphasis"), not the underlying token mapping. The token relationship is the component's concern, not the guidance's concern.

One risk: `rationale` text may reference visual properties with raw values instead of token names (same D9 drift risk from 067). Add a D9 compliance note to the schema definition: "Selection rules use prop values. Rationale text referencing visual properties should use token names, not raw values."

**Q2 (Token family doc extensibility)**: Current schema shape works for token family guidance with minor future additions. `selectionRules` maps naturally to token selection (scenario → recommended token). Only structural change needed later: `recommend` accepting token names alongside component names, plus a `type` field to distinguish component vs. token guidance. Don't add this now — validate against component families first, extend for token families later without breaking changes.

**Q3 (D9 compliance)**: Yes, companion YAML needs the same governance awareness as experience patterns. `rationale` is the primary risk surface (human-authored prose). `props` is lower risk (mirrors actual prop values). Same approach as 067: state convention in schema definition, enforce during review. Structural validation in the indexer, content governance via review.

### Reactions to Lina's Notes

- **Drop `notes` field**: Agree. One guidance string per rule is sufficient. 067 proved this.
- **`rationale` verbosity / `verbose` flag**: Good implementation consideration. Product application agents (070) will want decisions without rationale most of the time.
- **Dedicated `family-guidance/` directory**: I lean toward this. Family docs are governance layer (steering). Companion YAMLs are application layer (MCP data). Different audiences, different purposes. The `companion` cross-reference handles discoverability without physical co-location. Counter-argument: physical co-location eliminates broken cross-references if files move, but we already manage cross-references across `experience-patterns/`, `component-mcp-server/`, and `.kiro/steering/` — one more directory isn't meaningful added complexity.
- **Test family-vs-experience boundary during Phase 2**: Strongly agree. "Form Actions" (primary submit + tertiary cancel) is exactly the pattern that could live in either place. If "both" is the answer repeatedly, D4 needs revisiting.

### Additional Concern: Phase 3 Governance Overhead

10 remaining family docs means 10 more ballot measures (or batched). If Phase 2 produces a stable schema and remaining docs follow the same structure, batching is efficient. But if each doc has unique guidance structures (likely — Badge is very different from Form-Inputs), batching may not save much. Phase 3 effort estimate depends heavily on schema stability after Phase 2. Not a blocker — flagging for realistic planning.

### No Blocking Concerns

Ready for formalization. Schema shape is sound, phased approach is right, token governance addressable with D9 compliance note.
