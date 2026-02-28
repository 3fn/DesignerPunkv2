# Requirements Document: Component Metadata Schema

**Date**: 2026-02-28
**Spec**: 064 - Component Metadata Schema
**Status**: Requirements Phase
**Dependencies**: 063 (Uniform Contract System — COMPLETE)

---

## Introduction

The component metadata schema provides a tool-agnostic, machine-readable description layer for Stemma components. It enables agent-driven component selection and UI composition by assembling structural data (schema.yaml, contracts.yaml) with human-authored semantic annotations (component-meta.yaml) into a queryable catalog served by an MCP server.

This spec builds on 063's uniform contract system and the existing docs MCP architecture. It does NOT implement the A2UI renderer bridge or expand the motion token family — those are downstream concerns.

---

## Requirements

### Requirement 1: Schema Assembly

**User Story**: As an AI agent, I want a single query to return a component's complete metadata (structural identity, behavioral contracts, semantic annotations), so that I don't need to parse multiple files or understand the project's file layout.

#### Acceptance Criteria

1. WHEN an agent queries a component by name THEN the MCP SHALL return an assembled JSON object containing: props (from schema.yaml), platforms (from schema.yaml), tokens (from schema.yaml), composition relationships (from schema.yaml), behavioral contracts (from contracts.yaml), and semantic annotations (from component-meta.yaml).
2. WHEN a source file (schema.yaml, contracts.yaml, or component-meta.yaml) is modified THEN the MCP SHALL re-index that component within the current server session without requiring a restart.
3. WHEN a component's schema.yaml exists but component-meta.yaml does not THEN the MCP SHALL return structural data with semantic annotation fields set to null — not an error.
4. WHEN the MCP starts THEN it SHALL index all components by reading source files from disk — no pre-generated metadata files SHALL exist in the repository.

### Requirement 2: Inheritance Resolution

**User Story**: As an AI agent, I want to see a component's full set of behavioral contracts (including inherited ones), so that I understand the complete behavioral guarantees without manually traversing the inheritance chain.

#### Acceptance Criteria

1. WHEN a component's contracts.yaml declares `inherits: [Parent-Name]` THEN the MCP SHALL resolve the parent's contracts and merge them with the child's contracts in the returned metadata.
2. WHEN a child component declares `excludes:` for a parent contract THEN the resolved contract set SHALL omit the excluded contract and include the exclusion with its rationale.
3. WHEN a child component extends a parent contract (same canonical name, additional behavior) THEN the resolved metadata SHALL present the child's version, not the parent's.
4. WHEN inheritance resolution encounters a missing parent contracts.yaml THEN the MCP SHALL return the child's contracts with a visible warning indicating unresolved inheritance — not a silent failure.
5. The inheritance resolver SHALL support a maximum depth of 1 (parent-child only). WHEN a grandchild relationship is detected THEN the MCP SHALL surface a warning.

### Requirement 3: Capability Discovery

**User Story**: As an AI agent, I want to query the component catalog by capability (e.g., "focusable components," "components with email validation"), so that I can select appropriate components for a UI composition task.

#### Acceptance Criteria

1. WHEN an agent queries by contract category (e.g., "accessibility") THEN the MCP SHALL return all components that have contracts in that category, including inherited contracts.
2. WHEN an agent queries by specific contract concept (e.g., "keyboard_navigation") THEN the MCP SHALL return all components that have that contract, whether declared directly or inherited.
3. WHEN an agent queries by purpose keyword THEN the MCP SHALL search component-meta.yaml `purpose` fields and return matching components ranked by relevance.
4. WHEN an agent queries by platform (e.g., "ios") THEN the MCP SHALL return only components whose schema.yaml declares that platform.
5. The MCP SHALL provide a lightweight catalog endpoint that returns all component names with their `purpose` field — enabling agents to browse before drilling into detail.
6. The MCP SHALL support progressive disclosure: catalog (~50 tokens/component) → component summary (~200 tokens) → full component detail.

### Requirement 4: Composition Rules

**User Story**: As an AI agent composing a UI, I want to know which components can be nested inside which, and what combinations are prohibited, so that I produce valid component trees.

#### Acceptance Criteria

1. WHEN a component's schema.yaml declares `composes:` THEN the assembled metadata SHALL include the composition relationships with allowed and prohibited children.
2. WHEN a component defines composition `rules:` with `when/then` blocks THEN the MCP SHALL include conditional composition constraints in the metadata, expressing which prop values change valid children.
3. WHEN an agent queries whether Component A can contain Component B THEN the MCP SHALL return a yes/no answer with the applicable rule (static constraint or conditional rule) that determines the answer.
4. The composition rule syntax SHALL be bounded: `when` matches on prop values, `then` overrides composition constraints. Nested conditions, boolean combinators, and cross-component queries are NOT supported. WHEN a composition constraint requires unsupported syntax THEN it SHALL be documented as a known limitation.
5. WHEN a component prohibits self-nesting (`nesting.self: false`) THEN the MCP SHALL include this constraint in composition query responses.

### Requirement 5: Semantic Annotations

**User Story**: As an AI agent, I want human-authored guidance about when to use a component, what contexts it fits, and what alternatives exist, so that I can make informed selection decisions beyond structural data.

#### Acceptance Criteria

1. Each component SHALL have a `component-meta.yaml` file with the following fields: `purpose` (string), `usage.when_to_use` (list), `usage.when_not_to_use` (list), `contexts` (list), `alternatives` (list of `{component, reason}` objects).
2. WHEN an agent queries a component's metadata THEN the semantic annotations SHALL be included in the assembled response alongside structural data.
3. WHEN a component-meta.yaml is missing THEN the MCP SHALL return structural data without semantic annotations — the component is still queryable, just without guidance.
4. The `alternatives` field SHALL reference other components by their canonical Stemma name. WHEN an alternative references a component that doesn't exist in the catalog THEN the MCP SHALL surface a warning during indexing.

### Requirement 6: Contract-Token Derivation

**User Story**: As an AI agent or auditor, I want to see which tokens are behaviorally linked to which contracts, so that I can assess the impact of token changes on behavioral guarantees.

#### Acceptance Criteria

1. WHEN a component has accessibility or animation contracts that reference token names in their `behavior:` text THEN the MCP SHALL derive and include contract-token relationships in the component's metadata.
2. The derivation SHALL cross-reference token names found in contract prose against the component's schema.yaml `tokens:` list. Only tokens present in both SHALL be reported as relationships.
3. WHEN a contract references a token name that is NOT in the component's `tokens:` list THEN the MCP SHALL surface this as a visible gap — not silently omit it.
4. Contract-token derivation SHALL be scoped to accessibility and animation contract categories. Visual and interaction contracts SHALL NOT have derived token relationships.
5. WHEN stale token naming is detected in contract prose (e.g., `motion.duration.fast` instead of the current semantic token name) THEN the derivation SHALL flag the stale reference as a warning.

### Requirement 7: A2UI Compatibility Validation

**User Story**: As the project lead, I want confidence that the schema is expressive enough to produce valid A2UI component descriptions, so that the downstream renderer bridge has a solid foundation.

#### Acceptance Criteria

1. WHEN 2-3 representative components are drafted in the schema THEN a mapping exercise SHALL be performed against A2UI v0.9 to identify translation gaps.
2. The mapping exercise SHALL evaluate: component identity, prop mapping, behavioral hints, composition relationships, and platform availability.
3. WHEN the mapping exercise identifies a gap that is a genuine schema omission (not an A2UI-specific renderer concern) THEN the schema SHALL be adjusted before proceeding to full implementation.
4. WHEN the mapping exercise identifies a gap that is A2UI-specific (renderer bridge responsibility) THEN it SHALL be documented for the downstream renderer bridge spec — not addressed in this spec.
5. **Explicit pause point (data contracts):** WHEN the mapping exercise reveals that agents cannot construct correct component invocations for components with complex data shapes (e.g., `StepDefinition[]`) using only schema.yaml descriptions THEN a `data_shapes:` section SHALL be added to component-meta.yaml before proceeding to full implementation.

### Requirement 8: Pre-Schema Cleanup

**User Story**: As a developer, I want the component catalog to start from a clean baseline, so that the schema encodes correct names and references from day one.

#### Acceptance Criteria

1. WHEN 064 execution begins THEN Avatar SHALL be renamed to Avatar-Base before any schema work starts — all file paths, schema.yaml references, contracts.yaml references, and test files updated.
2. WHEN 064 execution begins THEN the 3 contracts with stale `motion.duration.fast` naming (Avatar/Avatar-Base, Chip-Base, Chip-Filter) SHALL be updated to reference the correct semantic motion token name.
3. WHEN the Button-Icon iOS scale value (0.97) is reviewed THEN a decision SHALL be documented: either adjust to `scale096` (0.96) or document as a platform-specific exception. This requires coordination with Lina (component implementation) and Ada (token alignment).

### Requirement 9: Documentation

**User Story**: As a developer or AI agent author, I want clear documentation of the metadata schema format, query interface, and authoring guide for component-meta.yaml, so that I can extend the system as new components are added.

#### Acceptance Criteria

1. The spec SHALL produce a schema format reference documenting all fields in the assembled component metadata JSON, their types, sources (which file they come from), and whether they are required or optional.
2. The spec SHALL produce a component-meta.yaml authoring guide with: field descriptions, examples for each field, guidance on writing effective `purpose` strings, and the `alternatives` cross-referencing convention.
3. The spec SHALL produce MCP query interface documentation listing all available queries, their parameters, and example responses.
4. The spec SHALL update Contract-System-Reference.md if any contract system conventions are extended or modified during 064 execution.
5. WHEN a new component is added to the system THEN the documentation SHALL provide a clear checklist for creating the component-meta.yaml file.

---

## Related Documentation

- `.kiro/steering/Contract-System-Reference.md` — Authoritative reference for contract taxonomy (10 categories), `{category}_{concept}` naming convention, `inherits:`/`excludes:` semantics, and canonical format. Requirements 2, 3, and 6 depend on conventions defined here.
- `.kiro/specs/063-uniform-contract-system/findings/format-specification.md` — Detailed canonical format with annotated migration examples. Reference for contract structure parsing in Requirements 1 and 2.
- `.kiro/specs/064-component-metadata-schema/design-outline.md` — Design decisions (Q1–Q9), A2UI reference URLs, docs MCP architectural learnings, and scope boundaries informing all requirements.

---
