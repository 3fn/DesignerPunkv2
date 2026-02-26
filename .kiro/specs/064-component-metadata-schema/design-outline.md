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

These surfaced during 062/063 work. Not decisions yet — questions to investigate during this spec's design phase.

### Q1: Generated vs. manually maintained?
Per agentic UI strategy doc (Q2): generated with human-authored semantic annotations and a manual confirmation gate. Structural parts derived from component files; semantic parts (purpose, contexts, guidance) require human judgment. How much can be generated? Where's the boundary?

### Q2: Schema format?
YAML to match contracts.yaml and schema YAML? JSON for broader tooling compatibility? A custom format optimized for MCP queries? The application MCP needs to serve this efficiently.

### Q3: How does capability discovery work?
063 deferred this here. Options: index file generated from contracts.yaml files, in-memory resolution by the application MCP, or a query API that scans on demand. Performance matters if the catalog grows beyond 28 components.

### Q4: How do composition rules express constraints?
`composes:` says "Stepper contains Nodes and Connectors." But agents need: "A Card can contain Badges, Labels, and Buttons but not other Cards." "A Radio-Set requires at least 2 Radio-Base children." Where do these rules live and how are they expressed?

### Q5: How does the schema map to A2UI's model?
A2UI uses Layout/Display/Interactive/Container categories and flat component descriptions. Our 10 behavioral categories are a different axis. The schema needs to bridge both — express components in DesignerPunk's terms internally and translate to A2UI's terms for the renderer.

### Q6: Contract-token relationship?
Ada recommended deferring this from 063 to here. The schema can express "this contract's implementation depends on these tokens" as a derived relationship. How? Is it a field in the schema, a separate mapping, or a query the application MCP resolves?

### Q7: What about the motion token gap?
Ada flagged that 16 components have animation contracts but the motion token family is thin. Does the schema need to handle components where contracts exist but token support is incomplete? Or is that a prerequisite (motion token family spec) before this work?

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
- Motion token family (Ada's domain — separate spec if needed)
- Writing new behavioral tests (flagged in 063, still out of scope)
- Feedback loop mechanism (agent → UI → agent signals — further downstream)

---

## Agent Assignments (Preliminary)

| Agent | Likely Role |
|-------|------------|
| Lina | Schema structure design, semantic annotations for components she built, composition rule definition |
| Thurgood | Schema validation methodology, A2UI compatibility audit, spec formalization |
| Ada | Contract-token relationship design, motion token gap assessment |

---

## Connection to Agentic UI Strategy

```
1. ✅ Catalog readiness audit (062) — COMPLETE
2. → Uniform contract system (063) — design decisions complete, pending formalization
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
- **Resolve stale behavioral contract documentation**: Component-Schema-Format.md contains outdated Contract Structure (old fields: `depends_on`, `conflicts_with`, `verification`), Contract Categories (6 categories, not 10), and Standard Contracts Library (deprecated but retained). Principle 2 in stemma-system-principles.md still shows old list-based contract format with deprecated names. Either remove these sections and replace with uniform contract system references, or create Contract-System-Reference.md and redirect. Must be completed before any 064 implementation tasks begin.
- Avatar → Avatar-Base rename complete (063 follow-up item — schema will encode component names, should use final name)
- Lina + Ada available for design consultation

---

## Related Documentation

- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Uniform contract system (direct prerequisite)
- `.kiro/specs/062-stemma-catalog-readiness-audit/` — Audit findings
- `.kiro/docs/agentic-ui-strategy.md` — Strategic context and sequencing
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology (this is the third implementation)
