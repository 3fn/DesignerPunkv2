# Task 5.1: MCP Scope Split — Draft for Review

**Date**: 2026-03-28
**Author**: Lina (component system perspective)
**Reviewer**: Leonardo (product/consumer perspective)
**Spec**: 086 — Component Discoverability & Metadata Infrastructure
**Status**: Draft — awaiting Leonardo validation

---

## Principle: Content Organization, Not Access Control

The split organizes content by domain responsibility. All agents retain read access to both MCPs. A product agent querying the Application MCP for component details is expected and supported. A system agent querying the Product MCP for experience pattern context is equally valid.

The split determines which MCP *owns* the content (indexes it, validates it, serves it as the authoritative source) — not who can read it.

---

## Scope Boundary

### Application MCP (Design System)

Owns the building blocks — what exists, how it works, how to select it.

| Content Type | Tools | Source Data |
|-------------|-------|-------------|
| Component catalog | `get_component_catalog`, `get_component_summary`, `get_component_full` | `*.schema.yaml`, `component-meta.yaml`, `contracts.yaml` |
| Component search | `find_components` | Indexed from component-meta.yaml (purpose, contexts) |
| Composition rules | `check_composition`, `validate_assembly` | Schema composition + requires fields |
| Selection guidance | `get_prop_guidance` | `family-guidance/*.yaml` |
| Component health | `get_component_health` | Index status, warnings |
| Per-platform readiness | (within component queries) | Schema readiness + filesystem scan |

**Stays in Application MCP because**: These are design system internals. Component schemas, contracts, tokens, and composition rules are authored and maintained by system agents (Lina, Ada). The indexer validates against the component source files. Moving these to a separate server would break the tight coupling between source files and indexed data.

### Product MCP (Product Consumption)

Owns the assembly guidance — how to compose building blocks into product screens.

| Content Type | Tools | Source Data |
|-------------|-------|-------------|
| Experience patterns | `list_experience_patterns`, `get_experience_pattern` | `experience-patterns/*.yaml` |
| Layout templates | `list_layout_templates`, `get_layout_template` | `layout-templates/*.yaml` |

**Moves to Product MCP because**: Experience patterns and layout templates are product-level concerns. They describe how to assemble components into screens — that's Leonardo's domain, not the component system's. Product agents (Sparky, Kenya, Data) are the primary consumers. The patterns reference components by name but don't need the component indexer to serve them.

### Boundary Cases

| Content | Current Home | Proposed Home | Rationale |
|---------|-------------|---------------|-----------|
| `validate_assembly` | Application MCP | Application MCP | Validates component composition rules — needs the component index |
| `get_prop_guidance` | Application MCP | Application MCP | Selection guidance is component-level, not product-level |
| Experience patterns | Application MCP | Product MCP | Product assembly guidance, not component internals |
| Layout templates | Application MCP | Product MCP | Screen-level layout, not component-level |

---

## Readiness Dependency

Per-platform readiness (Spec 086 Task 2) must be validated as reliable before the Product MCP can consume it. The readiness model is served inline with component queries — when Leonardo queries a component for a screen spec, he sees per-platform status (production-ready, development, scaffold, not-started).

**Prerequisite for Spec 081**: Readiness compliance test (Task 2.3) must pass with zero failures. Current status: passing.

**Inline readiness requirement**: The Product MCP should be able to query readiness without calling back to the Application MCP. Options for Spec 081:
1. Product MCP re-indexes readiness from the same filesystem (duplicated scan)
2. Product MCP calls Application MCP at startup to cache readiness (dependency)
3. Readiness data is exported to a shared artifact that both MCPs read (shared file)

This is a Spec 081 design decision, not a 086 decision. Documenting it here so 081 has the context.

---

## Experience Pattern Migration Concern

Currently, the Application MCP serves 9 experience patterns and 4 layout templates. Moving them to the Product MCP requires a cutover plan:

**Risk**: During migration, if the Application MCP stops serving patterns before the Product MCP starts, agents lose access.

**Recommended cutover for Spec 081**:
1. Product MCP implements pattern/template serving
2. Both MCPs serve patterns simultaneously (overlap period)
3. Application MCP removes pattern/template tools after Product MCP is validated
4. Agent prompts updated to query Product MCP for patterns

**Not a risk for 086**: This spec doesn't move anything. It documents the boundary for 081 to implement.

---

## Content Ownership Summary

| Domain | Application MCP | Product MCP |
|--------|----------------|-------------|
| Components (schemas, contracts, tokens) | ✅ Owns | Reads |
| Component metadata (purpose, usage, contexts) | ✅ Owns | Reads |
| Composition rules | ✅ Owns | Reads |
| Selection guidance (family guidance) | ✅ Owns | Reads |
| Readiness | ✅ Owns | Reads (inline with component queries) |
| Experience patterns | Serves (current) → Removes (post-081) | ✅ Owns (post-081) |
| Layout templates | Serves (current) → Removes (post-081) | ✅ Owns (post-081) |
| Screen specifications | — | ✅ Owns |

---

## Questions for Leonardo

1. Does this boundary match how you'd naturally query? Component details from one MCP, assembly guidance from another?
2. For the readiness dependency — which of the 3 options (re-index, cache, shared file) would you prefer as a Product MCP consumer?
3. Are there any product-level queries you make today against the Application MCP that wouldn't be covered by either MCP after the split?
