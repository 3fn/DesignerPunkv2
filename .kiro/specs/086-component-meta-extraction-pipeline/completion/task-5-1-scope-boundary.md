# MCP Scope Split: Application MCP vs Product MCP

**Date**: 2026-03-28
**Spec**: 086 — Component Discoverability & Metadata Infrastructure (Task 5.1)
**Purpose**: Define the content boundary between Application MCP and Product MCP for Spec 081 consumption
**Authors**: Thurgood + Leonardo (design review pending)

---

## Context

The MCP-Relationship-Model (`.kiro/steering/MCP-Relationship-Model.md`) defines three MCPs:
- **Docs MCP** — "How the system works" (system knowledge)
- **Application MCP** — "How to use the system" (component selection, assembly, patterns)
- **Product MCP** — "What we're building" (product-specific context)

The Relationship Model describes the Product MCP as a future, product-side MCP living in the product's own repository. Spec 086's scope split refines this by identifying content currently in the Application MCP that belongs in the Product MCP — specifically, experience patterns and layout templates are product-level guidance, not component-level application knowledge.

This document defines the boundary. Spec 081 implements it.

**Important**: This is a design input to Spec 081, not an implementation commitment on any timeline. Spec 081 has an activation trigger (DesignerPunk must be packageable) that hasn't fired. The boundary defined here is ready for 081 to consume when it activates.

---

## Content Ownership

### Application MCP — "Which component, and how to assemble it"

| Content Type | Examples | Rationale |
|-------------|----------|-----------|
| Component catalog | Names, types, families, readiness | Core component identity |
| Component metadata | Contracts, composition rules, token relationships | Component behavior and constraints |
| Prop guidance | Family selection rules, whenToUse, alternatives | Component selection decisions |
| Assembly validation | `validate_assembly`, `check_composition` | Structural correctness |
| Per-platform readiness | Derived status per component × platform | Availability gate |
| Component patterns | Composition patterns within families | Component-level assembly |

### Product MCP — "What screen to build, and how to structure it"

| Content Type | Examples | Rationale |
|-------------|----------|-----------|
| Experience patterns | `simple-form`, `onboarding-flow` | Screen-level assembly guidance |
| Layout templates | `centered-content-page`, `split-panel` | Page-level structure |
| Screen-level design guidance (future) | Responsive adaptation, navigation flow | Product architecture — TBD, placeholder for future content types beyond patterns and templates |

### The Distinction

Application MCP answers: "I need a form — which components do I use, and how do they compose?"
Product MCP answers: "I need a registration screen — what's the experience pattern, layout, and flow?"

The Application MCP is component-centric. The Product MCP is screen-centric. Components are the building blocks; screens are the assemblies.

---

## Governing Principles

### Content Organization, Not Access Control

The split is about where content lives and which MCP serves it. It is NOT about restricting access.

**All agents retain read access to both MCPs.**

- Lina needs pattern access during component scaffolding (to understand how components are used in context)
- Leonardo needs component access during screen specification (to select and validate components)
- Stacy needs both for governance (component selection verification + pattern compliance)
- Platform agents need component access for implementation + pattern access for screen context

Restricting access would create information silos. The split improves content organization without reducing visibility.

### One Direction of Dependency

Product MCP depends on Application MCP. Never the reverse.

- Product MCP pattern responses reference Application MCP component names
- Application MCP has no knowledge of which patterns use its components
- This matches the existing MCP-Relationship-Model dependency direction

### Readiness as a Prerequisite

**The readiness model (Spec 086 Task 2) must be validated as reliable before the MCP split ships.**

When the Product MCP recommends "use Container-Card-Base for stat cards," the recommendation is only useful if the consumer can assess whether Container-Card-Base is available on their target platform. The Product MCP must include per-platform readiness data in its responses.

This creates a dependency: Product MCP pattern responses need readiness data from the Application MCP. The mechanism (index-time caching, query-time cross-call, or consumer-side cross-query) is a Spec 081 design decision. Leonardo's review recommends a shared artifact approach (Application MCP exports readiness to a JSON file, Product MCP reads it) — simplest, no runtime dependency, acceptable staleness risk at current scale.

**Requirement for Spec 081**: Product MCP pattern responses SHALL include inline per-platform readiness for referenced components. This prevents agents from making separate cross-MCP queries for every component in a pattern.

---

## Experience Pattern Migration

Experience patterns currently live in the Application MCP. Moving them to the Product MCP requires a transition plan.

### Current State
- 9 experience patterns served by Application MCP via `list_experience_patterns` and `get_experience_pattern`
- Agents query these tools during screen specification and component selection
- Pattern responses reference Application MCP component names

### Migration Concerns

1. **Tool continuity**: If `get_experience_pattern` moves from Application MCP to Product MCP, every agent's `allowedTools` config needs updating. Alternatively, the Application MCP could proxy pattern queries to the Product MCP during transition.

2. **Dual availability period**: During migration, patterns should be available from both MCPs to avoid breaking existing workflows. The cutover should be explicit — a point where the Application MCP stops serving patterns and the Product MCP takes over.

3. **Pattern-component coupling**: Patterns reference components by name. If a pattern moves to the Product MCP but the component it references is renamed or removed from the Application MCP, the pattern breaks. The stability contract in the MCP-Relationship-Model governs this — component names are stable identifiers.

4. **Layout templates**: Same migration concerns apply. Currently served by Application MCP via `list_layout_templates` and `get_layout_template`.

### Suggested Approach for Spec 081

The following is one viable migration strategy — Spec 081 may choose a different approach:

1. Product MCP implements pattern and layout template tools
2. Application MCP retains pattern/template tools during transition (dual availability)
3. Agents are updated to query Product MCP for patterns/templates
4. Application MCP pattern/template tools are deprecated, then removed
5. Cutover is a discrete step, not a gradual migration

---

## Relationship to MCP-Relationship-Model

The MCP-Relationship-Model describes the Product MCP as living in the product's own repository, containing product-specific content (brand tokens, personas, business rules, product primitives). The scope split defined here is compatible with that vision:

- Experience patterns and layout templates are *DesignerPunk system content* that serves product-level concerns. They're generalizable across products, not product-specific.
- In the Relationship Model's framing, they belong in the "system application" layer — but they serve the "product execution" layer. The Product MCP is the right home because consumers query them during product work, not during component development.
- Product-specific content (brand tokens, personas, etc.) would be *additional* content in the Product MCP, not a replacement for the patterns/templates.

**Specific refinement to the Relationship Model**: The current model states Application MCP "Owns: Experience patterns (assembly guidance for common UI scenarios)" and "Layout templates (future — Spec 069)." This scope split moves both to Product MCP ownership. The MCP-Relationship-Model should be updated via ballot measure when Spec 081 implements the split.

### Docs MCP: Unaffected

The Docs MCP continues to own system knowledge (tokens, architecture, governance, process). It neither gains nor loses content in this split.

---

## Decision Criteria for Future Content

When new content types are added, use this litmus test:

- **Application MCP**: Content that describes what a component *is* and how it *works* — schemas, contracts, composition rules, selection guidance, readiness
- **Product MCP**: Content that describes how to *assemble* components into product screens — patterns, templates, screen-level guidance

**The test**: "Does this content make sense without a product context?" If yes → Application MCP. If it assumes a product screen or user flow → Product MCP.

---

## Requirements Traceability

| Req 9 AC | Status | Where Addressed |
|----------|--------|-----------------|
| 9.1 — Scope split documented | ✅ | Content Ownership section |
| 9.2 — Content organization, not access control | ✅ | Governing Principles section |
| 9.3 — Readiness validated before split | ✅ | Readiness as a Prerequisite section + Task 5.2 |
| 9.4 — Cross-MCP reference mechanism deferred to 081 | ✅ | Readiness section (mechanism is 081 design decision) |

---

## Open Items for Spec 081

1. Cross-MCP reference mechanism (index-time cache vs query-time call vs consumer cross-query)
2. Inline readiness in Product MCP pattern responses (requirement, not optional)
3. Experience pattern migration cutover plan (dual availability → deprecation → removal)
4. Layout template migration (same plan as patterns)
5. MCP-Relationship-Model update to reflect the refined Product MCP scope
6. Product MCP tool naming (reuse `get_experience_pattern` or new tool names?)
