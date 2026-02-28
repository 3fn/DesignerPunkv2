# Component Metadata Schema

**Date**: 2026-02-25
**Purpose**: Design a tool-agnostic, machine-readable schema that describes each Stemma component's purpose, capabilities, contracts, composition rules, and data expectations — enabling agent-driven component selection and UI composition
**Organization**: spec-guide
**Scope**: 064-component-metadata-schema
**Status**: Early draft — captures known requirements and open questions from 062/063 work

---

## Problem Statement

The uniform contract system (063) gives every component a consistent, machine-parseable contracts.yaml. But contracts describe *what a component guarantees* — they don't describe *what a component is for*, *when to use it*, *what data it expects*, or *how it relates to other components in a composition*.

An AI agent selecting components for a UI needs all of that. "Show me components that handle email input" requires understanding purpose, not just behavioral contracts. "Can I put a Badge inside a Card?" requires composition rules. "What data shape does a Progress-Stepper expect?" requires data contracts.

The component metadata schema is the queryable layer that sits between the raw component files (schema YAML + contracts.yaml) and agent consumers (application MCP, A2UI renderer, future protocols).

---

## What This Consumes from 063

The metadata schema depends on 063's outputs:

| 063 Output | How 064 Consumes It |
|------------|-------------------|
| contracts.yaml per component (sole source of truth) | Schema reads contracts to describe component capabilities |
| `{category}_{concept}` naming convention | Schema uses category prefixes for capability indexing and filtering |
| `inherits:` declarations | Schema resolves inheritance to present fully resolved contract sets |
| `excludes:` blocks | Schema exposes intentional exclusions to agents querying capabilities |
| `composes:` in schema YAML | Schema reads composition relationships for assembly rule generation |
| 10-category taxonomy with definitions | Schema uses categories for capability discovery queries |

---

## Objectives

1. **Define the schema structure** — What fields describe a component to an agent? Purpose, capabilities, composition rules, data expectations, appropriate contexts, platform availability.
2. **Build capability discovery** — The query interface deferred from 063 Decision 5. "Show me all focusable components," "What components handle text input?" — resolved here.
3. **Resolve inheritance at read time** — Per 063 Decision 6, child components declare `inherits:` but don't list parent contracts. The schema resolves the full contract set.
4. **Define composition rules** — Beyond `composes:` (structural), define valid/invalid assembly patterns. What can nest inside what? What combinations are prohibited?
5. **Define data contracts** — Formal descriptions of the data each component expects, beyond TypeScript prop types. Bridges agent data models to component models.
6. **Add semantic annotations** — Purpose descriptions, appropriate contexts, "when to use / when not to use" guidance. Human-authored, not generated.
7. **Validate against A2UI** — Use A2UI compatibility as the proof-of-concept for schema expressiveness. If the schema can produce valid A2UI component descriptions, it's expressive enough.

---

## Key Design Questions (Known)

These surfaced during 062/063 work. Q1–Q3 resolved during design outline review (2026-02-28). Q4–Q5 resolved during design outline review (2026-02-28). Q6–Q7 resolved 2026-02-28 with Ada's research and recommendation.

### Q1: Generated vs. manually maintained?
**Decision: Hybrid — resolve on read (Option B).** Structural data (props, platforms, contracts, inheritance) resolved at query time from existing source files (schema.yaml, contracts.yaml). No generated metadata files. Semantic annotations (purpose, guidance, contexts) are human-authored in per-component YAML files — the only manually maintained content. Sync problem eliminated architecturally: structural data is always current because it's read from source.

### Q2: Schema format?
**Decision: YAML source, JSON output.** Human-authored semantic annotations stored in YAML (consistent with schema.yaml and contracts.yaml). The MCP assembles and serves JSON to agent consumers. Humans never touch JSON; agents never parse YAML.

### Q3: How does capability discovery work?
**Decision: Index on startup, query from memory (Option C).** MCP loads all schema.yaml + contracts.yaml + semantic annotation files into memory at startup, builds an in-memory index. File watcher re-indexes on source file changes. Follows the proven pattern from the docs MCP (`DocumentIndexer` + `FileWatcher`). Progressive disclosure: lightweight catalog → component summary → full detail.

### Q4: How do composition rules express constraints?
**Decision: Level 3 — bounded conditional rule syntax.** Composition rules include static constraints (allowed/prohibited children, min/max counts, self-nesting) plus a `rules:` array for prop-conditional overrides using `when/then` blocks. Known driver: Container-Card-Base's `role` prop changes valid children (button-role prohibits interactive children, article-role allows them).

Rule syntax is intentionally bounded: `when` matches on prop values, `then` overrides composition constraints. No nested conditions, no boolean combinators, no cross-component queries. If those are needed, that's the reassessment point.

Example:
```yaml
composition:
  children:
    prohibited: [Container-Card-Base]
  nesting:
    self: false
  rules:
    - when:
        prop: role
        equals: button
      then:
        children:
          prohibited_categories: [interaction]
```

### Q5: How does the schema map to A2UI's model?
**Decision: Tool-agnostic design with early mapping exercise on draft schema.** The schema uses DesignerPunk's own vocabulary (Stemma families, behavioral categories, primitive/semantic types). It is not designed around A2UI. However, an early mapping exercise against A2UI is performed once 2-3 representative components are drafted, to identify translation gaps before the schema is finalized.

Workflow:
1. Design schema structure (tool-agnostic, DesignerPunk vocabulary)
2. Draft for 2-3 representative components (primitive, semantic, compositional)
3. Mapping exercise: How does each field translate to A2UI? Where are gaps?
4. Evaluate gaps — genuine schema omissions vs. A2UI-specific concerns for the renderer bridge
5. Adjust draft if step 4 reveals omissions, then proceed to full implementation

The mapping exercise is a design input, not a design driver. The actual A2UI transformer is the renderer bridge spec's responsibility (downstream).

**A2UI Reference Material:**
- A2UI specification: https://a2ui.org/specification/v0.9-a2ui/
- Agent development guide: https://a2ui.org/guides/agent-development/
- Client setup guide: https://a2ui.org/guides/client-setup/
- Quickstart: https://a2ui.org/quickstart/#step-4-install-and-run
- General: https://a2ui.org/

### Q6: Contract-token relationship?
**Decision: Option B — derived at query time, scoped to high-confidence contract categories.** Resolved 2026-02-28 with Ada's research and recommendation.

The MCP resolves contract-token relationships at query time by cross-referencing schema `tokens:` lists with contract prose. No contract-token mappings are stored in source files — they're computed. This avoids sync burden while making relationships queryable.

Scope is limited to contract categories where token names are explicitly stated in contract prose and the relationship is auditable:
- **Accessibility contracts** (e.g., `accessibility_color_contrast`) — token pairs that produce measurable ratios
- **Animation contracts** (e.g., `animation_checkmark`, `animation_coordination`) and contracts referencing motion tokens — semantic motion tokens that define timing/easing

Visual and interaction contracts where tokens are implementation details (not behavioral dependencies) are excluded from derivation. For those, the component-level `tokens:` list in schema YAML is sufficient.

Inference logic: lightweight parser extracts token name patterns from contract `behavior:` text and cross-references against the component's schema `tokens:` list. Unresolvable references (contract mentions animation but no motion token in schema) surface as visible gaps — no special schema field needed.

Prerequisite: 3 contracts with stale token naming (`motion.duration.fast` → correct semantic token name) must be updated before derivation logic is built. This is a cleanup task during early 064 execution.

**Research basis (Ada, 2026-02-28):**
- Traced `accessibility_color_contrast` across all 4 components that have it. Token names are explicit in contract prose for 4/4 — mechanical derivation is feasible.
- Traced animation/motion references across all 12 components that reference motion. Token names are explicit or recognizable (with 3 stale naming cases).
- A2UI v0.9 spec has no token dependency model — styling is client-controlled via semantic hints and theme configuration. Contract-token relationships are DesignerPunk-internal tooling only (token impact analysis, accessibility auditing, theme composition).
- Docs MCP's "absence is the signal" pattern means gap detection comes free from the derivation itself.
- Scoping to high-confidence categories avoids false precision for fuzzy relationships in visual/interaction contracts.

**Counter-argument considered:** Inference reliability depends on contract authoring discipline. If future contracts use vague language ("uses appropriate color tokens") instead of naming specific tokens, mechanical derivation breaks down. Mitigation: contract authoring standards (from 063) already require explicit token references in accessibility and animation contracts.

### Q7: What about the motion token gap?
**Decision: Downstream follow-up. Gap is narrower than initially assessed — cleanup task, not a spec.** Resolved 2026-02-28 with Ada's research and recommendation.

**Research findings (Ada, 2026-02-28):**
- 12 of 28 components reference motion (not 16 as initially estimated from pre-063 data)
- 5 fully token-backed, 3 with stale naming in contracts, 1 genuine hardcode (Button-Icon iOS scale 0.97), 2 generic references, 1 explicitly no-animation
- The motion token family has 3 duration primitives, 3 easing primitives, 6 scale primitives, and 5 semantic tokens — functional coverage for current component needs

The single hardcoded value (Button-Icon iOS `0.97` scale) doesn't align with the 8-interval scale progression (0.88, 0.92, 0.96, 1.00, 1.04, 1.08). Options: adjust implementation to use `scale096` (0.96), or acknowledge as a platform-specific exception. This is a Lina decision (component implementation) with token implications — coordinate with her.

No schema design changes needed. The schema handles incomplete token coverage by design: the `tokens:` list shows what's covered, and Q6's derived contract-token relationships surface gaps where animation contracts lack resolvable motion token links.

**Early 064 cleanup tasks:**
1. Update 3 contracts with stale `motion.duration.fast` naming (Avatar, Chip-Base, Chip-Filter)
2. Coordinate with Lina on Button-Icon iOS scale value (0.97 → `scale096` or documented exception)

Motion token family expansion (stagger sequencing, additional semantic tokens) deferred to when component needs drive it — not speculative.

---

### Q8: What does the semantic annotations file look like?
**Decision: Per-component `component-meta.yaml` with four fields.** Resolved 2026-02-28.

Each component gets a small, human-authored YAML file covering what can't be derived from schema.yaml or contracts.yaml:

```yaml
# src/components/core/[Component-Name]/component-meta.yaml
purpose: "Agent-selection-oriented description of what this component is for"

usage:
  when_to_use:
    - "Scenario where this component is the right choice"
  when_not_to_use:
    - "Scenario where a different component is better — name the alternative"

contexts:
  - "UI context where this component is typically used"

alternatives:
  - component: Other-Component-Name
    reason: "When to use the alternative instead"
```

Fields: `purpose` (one-line, agent-oriented), `usage` (when to / when not to), `contexts` (typical UI locations), `alternatives` (similar components with differentiation). ~15-20 lines per component. Changes rarely — only when component purpose or relationships change.

Distinct from schema.yaml `description:` which is implementation-focused. `purpose` here answers "I need a component that does X — is this the one?"

### Q9: Data contracts — formal data shape descriptions?
**Decision: Defer to v2. Explicit pause point at A2UI mapping exercise.** Resolved 2026-02-28.

Only 2 of 28 components have complex data shapes (Progress-Stepper-Detailed with `StepDefinition[]`, Progress-Stepper-Base with `number[]`). The rest use simple props. Schema.yaml descriptions provide sufficient human-readable data shape information for v1.

**Explicit pause point:** During the A2UI mapping exercise (Q5, step 3), evaluate whether agents can construct correct component invocations without formal data schemas. If Progress-Stepper-Detailed's `StepDefinition[]` shape can't be communicated adequately through schema.yaml descriptions alone, add a `data_shapes:` section to `component-meta.yaml` before proceeding to full implementation. This is a small, additive change — not an architectural revision.

Trigger criteria for adding data contracts:
- A2UI mapping exercise reveals agents need machine-parseable data shapes to generate correct invocations
- New components are added with complex nested data structures (tables, data grids, tree views)
- Three or more components require data shape documentation beyond what schema.yaml descriptions provide

---

## Docs MCP Architectural Learnings

The existing documentation MCP server (`mcp-server/`) provides proven patterns directly applicable to the component metadata schema. These should inform architectural decisions for Q1, Q2, and Q3.

**Applicable patterns:**
- **Resolve on read, not generated files**: The docs MCP indexes `.kiro/steering/` at startup and resolves queries from source files in memory. No static generated output. Eliminates sync drift by design. Validates Option B (Q1).
- **Progressive disclosure**: Three tiers — `get_documentation_map` (~50 tokens/doc), `get_document_summary` (~200 tokens), `get_document_full` (complete). Agents start cheap and drill down. The component MCP should follow the same pattern (catalog → summary → full detail).
- **File watcher for freshness**: `FileWatcher` detects source file changes and re-indexes individual files. No manual regeneration. The component MCP should watch schema.yaml, contracts.yaml, and semantic annotation files.
- **Mechanical parsing, no interpretation**: The indexer extracts structure without interpreting content. The component MCP should similarly parse YAML structure mechanically, with human-authored semantic annotations as the only interpreted content.

**New capabilities needed (beyond docs MCP):**
- **Multi-file assembly**: Docs MCP parses one file per document. Component MCP must assemble from schema.yaml + contracts.yaml + semantic annotations per component.
- **Inheritance resolution**: `inherits:` declarations require reading parent contracts.yaml and merging. Docs MCP has no equivalent. Current inheritance is shallow (max depth 1 — no grandchild components).
- **Cross-file type parsing**: YAML (schema, contracts) + whatever format semantic annotations use. Docs MCP only parses markdown.

**Scaling assessment**: Docs MCP handles ~40 steering docs efficiently. 28 components × 3 files = ~84 files — same order of magnitude. Inheritance resolution adds minimal overhead given shallow graph depth. This approach holds to 100+ components.

---

## Scope Boundaries (Preliminary)

### Likely In Scope
- Schema structure definition
- Capability discovery / query interface
- Inheritance resolution
- Composition rule expression
- Data contract definitions
- Semantic annotations (purpose, contexts, guidance)
- A2UI compatibility validation
- Application MCP design (callable component catalog)

### Likely Out of Scope
- A2UI renderer bridge implementation (separate spec — consumes schema output)
- Motion token family expansion (deferred — current coverage is functional, expand when component needs drive it)
- Writing new behavioral tests (flagged in 063, still out of scope)
- Feedback loop mechanism (agent → UI → agent signals — further downstream)

---

## Agent Assignments (Preliminary)

| Agent | Likely Role |
|-------|------------|
| Lina | Schema structure design, semantic annotations for components she built, composition rule definition |
| Thurgood | Schema validation methodology, A2UI compatibility audit, spec formalization |
| Ada | Contract-token derivation logic design, motion contract cleanup (stale naming), token compliance validation |

---

## Connection to Agentic UI Strategy

```
1. ✅ Catalog readiness audit (062) — COMPLETE
2. ✅ Uniform contract system (063) — COMPLETE (28 components migrated, validated, governance applied)
3.   Component metadata schema (this spec)
4.   A2UI validation — validates schema against A2UI as proof-of-concept
5.   Application MCP — callable component catalog server
6.   A2UI renderer bridge — first protocol-specific integration
```

Per the agentic UI strategy doc, this spec produces the "component catalog schema" — the tool-agnostic, machine-readable description layer that A2UI and future protocols consume. The DTCG analogy applies: this is the canonical schema, A2UI is the first transformer.

---

## Prerequisites

- 063 execution complete (all 28 components migrated to uniform contracts.yaml)
- 063 governance updates applied (family list, standard library deprecated)
- **Resolve stale behavioral contract documentation**: ✅ Resolved (2026-02-25). Component-Schema-Format.md rewritten to reflect actual schema YAML structure. Contract System Reference created as authoritative contract format doc. Old Standard Contracts Library, stale Contract Structure/Categories sections, and outdated Principle 2 examples replaced. Approved via ballot measure.
- Avatar → Avatar-Base rename: scheduled as early 064 task (before core schema work begins, so the schema encodes the final name from day one)
- Lina + Ada available for design consultation
- `.kiro/steering/Contract-System-Reference.md` current and accurate — authoritative reference for taxonomy, naming convention, canonical format, inheritance, and composition. Must be updated if 064 extends or modifies contract system conventions.

---

## Related Documentation

- `.kiro/steering/Contract-System-Reference.md` — Authoritative contract system reference (taxonomy, naming, format, inheritance, composition)
- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Uniform contract system (direct prerequisite)
- `.kiro/specs/063-uniform-contract-system/findings/format-specification.md` — Detailed canonical format with annotated migration examples
- `.kiro/specs/062-stemma-catalog-readiness-audit/` — Audit findings
- `.kiro/docs/agentic-ui-strategy.md` — Strategic context and sequencing
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology (this is the third implementation)
- `mcp-server/` — Existing docs MCP server (architectural patterns: resolve-on-read, progressive disclosure, file watching)
