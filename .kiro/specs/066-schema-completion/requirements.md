# Requirements Document: Schema Completion and Contract Audit Resolution

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion
**Status**: Requirements Phase
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 063 (Uniform Contract System — COMPLETE)

---

## Introduction

Eight of 28 Stemma components lack schema.yaml files, making them invisible to the component MCP server. These components have working platform implementations, behavioral contracts, and semantic annotations — but without schema.yaml, they cannot be indexed, queried, or composed through the MCP.

This spec creates schema.yaml for all 8 components, resolves 4 contract audit findings from the post-064 review, and evolves the component MCP data models to support composition semantics (`internal`/`children.requires` split), property omission (`omits`), and resolved token assembly (`resolvedTokens`).

---

## Requirements

### Requirement 1: Schema Creation

**User Story**: As an AI agent, I want all 28 Stemma components to appear in the component MCP catalog, so that I can discover and select any component in the system.

#### Acceptance Criteria

1. WHEN the component MCP indexes the components directory THEN it SHALL index 28 components with zero "no schema.yaml" warnings.
2. Each schema.yaml SHALL contain: name, type, family, version, readiness, description, behaviors, properties, accessibility, tokens, platforms, and platform_notes — matching the format of existing schemas.
3. Each property definition SHALL include: type, default (where applicable), and description — derived from the component's types.ts and verified against all 3 platform implementations.
4. Each schema's token list SHALL include all tokens directly used in the component's platform code, including blend tokens.
5. WHEN a component inherits from a parent THEN the schema SHALL declare `inherits:` and document only the component's own props — not duplicate the parent's.

### Requirement 2: Composition Model Evolution

**User Story**: As an AI agent, I want to distinguish between components a parent uses internally and components I must provide as children, so that I can correctly compose UI trees.

#### Acceptance Criteria

1. The schema format SHALL support an `internal` field listing components used internally by the parent — components the agent does not instantiate.
2. The schema format SHALL support a `children.requires` field listing component types the agent MUST provide (at least one of each).
3. The schema format SHALL support `children.allowed`, `children.prohibited`, `children.minCount`, and `children.maxCount` for child constraints.
4. WHEN the component MCP parses a schema with the new composition structure THEN it SHALL populate the `CompositionDefinition` model with `internal` and `children` fields.
5. Existing schemas using `composes` SHALL be migrated to the new `internal`/`children` structure.
6. The CompositionChecker SHALL validate against the new structure, checking `requires`, `allowed`, and `prohibited` constraints.

### Requirement 3: Property Omission

**User Story**: As an AI agent, I want to know which parent props are NOT available on a child variant, so that I don't attempt to set props that will be ignored.

#### Acceptance Criteria

1. The schema format SHALL support an `omits` field listing parent property names that are not available on the child component.
2. WHEN the component MCP resolves inheritance for a component with `omits` THEN the assembled metadata SHALL exclude omitted properties from the merged property set.
3. WHEN an `omits` entry references a property name that does not exist on the parent THEN the MCP SHALL surface a warning — not a silent pass.
4. `omits` (API surface — props) SHALL be distinct from `excludes` (behavioral contracts).

### Requirement 4: Resolved Token Assembly

**User Story**: As an AI agent, I want to see the full token picture for a component — including tokens from its composed children — so that I can assess theme impact and token dependencies.

#### Acceptance Criteria

1. The assembled ComponentMetadata SHALL include a `resolvedTokens` field with `own` (component's direct tokens) and `composed` (tokens from composed children, keyed by component name).
2. Token resolution SHALL traverse `internal` and `children.requires` composition relationships at depth-1 only — no recursive resolution.
3. The flat `tokens` field SHALL remain unchanged (own tokens only) for backward compatibility.
4. WHEN a composed child component is not indexed THEN the `composed` entry SHALL be empty with a warning — not a failure.

### Requirement 5: Contract Audit Resolution

**User Story**: As a design system maintainer, I want contract audit findings resolved so that the contract system accurately reflects component behavior.

#### Acceptance Criteria

1. Avatar-Base's `interaction_hover` contract SHALL include a clarifying note that hover is pointer-only with no keyboard equivalent.
2. Chip-Base SHALL be investigated for `interaction_hover`, `interaction_pressed`, and `interaction_focus_ring` behavior. IF behavior exists in platform implementations THEN the contracts SHALL be added.
3. The `state_disabled` exclusion SHALL be investigated across all 9 affected components. Each SHALL be classified as: gap (implementation supports disabled but contract missing), intentional (not supported by design), or deferred (planned but not yet implemented).
4. WHEN a `state_disabled` classification is "gap" AND the component is one of the 8 being schemaed THEN the contract SHALL be added. For components outside the 8, findings SHALL be documented only.
5. Blend tokens identified in the contract audit SHALL be included in the token lists of all 8 new schemas where applicable.

### Requirement 6: Catalog Integrity Verification

**User Story**: As a design system maintainer, I want to verify that the complete 28-component catalog is healthy after all changes, so that I can trust the MCP's output.

#### Acceptance Criteria

1. WHEN all schemas are created and MCP models updated THEN `get_component_health` SHALL report 28 indexed components with zero errors.
2. All existing component MCP tests SHALL pass after model changes — zero regressions.
3. New integration tests SHALL verify: composition with `internal`/`children.requires`, inheritance with `omits`, and `resolvedTokens` assembly.

---

## Related Documentation

- `.kiro/steering/Component-Schema-Format.md` — Schema authoring standards and field reference
- `.kiro/steering/Contract-System-Reference.md` — Contract taxonomy, naming convention, canonical format
- `.kiro/specs/064-component-metadata-schema/design.md` — Component MCP architecture and data models
- `docs/component-metadata-schema-reference.md` — Assembled metadata field reference
- `.kiro/issues/contract-audit-*.md` — 5 audit findings (4 included, 1 excluded)
