# Requirements Document: Application MCP — Agent-Facing Component Catalog

**Date**: 2026-03-01
**Spec**: 067 - Application MCP
**Status**: Requirements Phase
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 066 (Schema Completion — COMPLETE)

---

## Introduction

The component MCP (built in 064, completed in 066) serves agents who build and maintain DesignerPunk. It answers structural questions — props, tokens, contracts, composition rules. It does not serve agents who use DesignerPunk to build experiences.

This spec evolves the component MCP into an application MCP — a callable catalog that teaches agents how to select, compose, configure, and validate components for building experiences. It extends the existing server (D1) with enhanced selection queries, authored experience patterns, and assembly validation including accessibility checks.

The scope is Tier 1 only: core application capabilities with no external dependencies. `get_prop_guidance` (Tier 2) and A2UI integration (Tier 3) are deferred to follow-up specs.

---

## Requirements

### Requirement 1: Context-Based Component Selection

**User Story**: As an AI agent building an experience, I want to find components by the context they belong to (e.g., "login-forms", "settings-screens"), so that I can select appropriate components for a specific use case.

#### Acceptance Criteria

1. WHEN `findComponents` is called with a `context` filter THEN it SHALL return only components whose `contexts` array contains a matching value.
2. Context matching SHALL be exact string match against the structured `contexts` array in component-meta.yaml — not a text search.
3. WHEN `findComponents` is called with `context` combined with other filters (category, concept, platform, purpose) THEN all filters SHALL be applied conjunctively (AND logic).
4. WHEN no components match the context filter THEN the result SHALL be an empty array with no error.

### Requirement 2: Application-Enriched Response Shape

**User Story**: As an AI agent, I want component search results to include selection guidance (when to use, when not to use, alternatives), so that I can make informed component choices without a second query.

#### Acceptance Criteria

1. `findComponents` SHALL return an `ApplicationSummary` response shape that extends the existing `ComponentSummary` with: `purpose`, `whenToUse`, `whenNotToUse`, `alternatives`, and `contexts`.
2. The `ApplicationSummary` SHALL include all fields from the existing `ComponentSummary` for backward compatibility.
3. WHEN a component has no semantic annotations THEN the application-specific fields SHALL be null or empty arrays — not omitted.
4. Results SHALL be sorted alphabetically by component name. No relevance scoring.

### Requirement 3: Experience Pattern Schema

**User Story**: As a design system maintainer, I want a structured YAML format for describing multi-component assemblies, so that agents can learn how to build common experiences.

#### Acceptance Criteria

1. The pattern schema SHALL support: `name`, `source`, `extends`, `description`, `category`, `tags`, `steps`, `accessibility`, and `alternatives`.
2. Each step SHALL support: `name`, `purpose`, `layout`, and `components` (ordered list).
3. Each component entry SHALL support: `component` (name reference), `role` (semantic role), `optional` (boolean, defaults to false), `hints` (key-value guidance), and `children` (nested components, recursive).
4. The `source` field SHALL accept `system` or `project`. Tier 1 implements system-level only.
5. The `extends` field SHALL be supported in the schema definition but not implemented in Tier 1 resolution logic.
6. Single-step patterns SHALL have exactly one step. Multi-step patterns SHALL have two or more ordered steps.
7. Hints SHALL reference prop values and semantic intent only — never raw pixel, color, or spacing values. Token names SHALL be used for visual properties (D9).

### Requirement 4: Experience Pattern Indexing and Serving

**User Story**: As an AI agent, I want to query available experience patterns and retrieve their full content, so that I can learn how to build common experiences.

#### Acceptance Criteria

1. The system SHALL provide a `list_experience_patterns` tool that returns all indexed patterns with: name, description, category, and tags.
2. The system SHALL provide a `get_experience_pattern` tool that returns the full pattern content by name.
3. WHEN the pattern indexer scans the `experience-patterns/` directory THEN it SHALL parse all `.yaml` files and validate them against the pattern schema.
4. WHEN a pattern file fails schema validation THEN the indexer SHALL surface a warning and skip the file — not fail the entire index.
5. WHEN `get_experience_pattern` is called with a name that does not exist THEN it SHALL return an error message — not null.
6. Pattern results SHALL include all fields defined in the schema: steps with components, roles, hints, accessibility notes, and alternatives.

### Requirement 5: Assembly Validation

**User Story**: As an AI agent, I want to validate a complete component tree before rendering, so that I can catch composition errors and accessibility violations early.

#### Acceptance Criteria

1. The system SHALL provide a `validate_assembly` tool that accepts a component tree and returns validation results.
2. The assembly input SHALL represent a tree of components, where each node specifies a component name and optionally its children and props.
3. For each parent-child relationship in the tree, `validate_assembly` SHALL check composition constraints using the existing `checkComposition` logic (allowed, prohibited, requires).
4. `validate_assembly` SHALL check that all `children.requires` constraints are satisfied — every required child type is present.
5. `validate_assembly` SHALL check `minCount` and `maxCount` constraints where defined.
6. Validation results SHALL distinguish between errors (invalid composition) and warnings (advisory).
7. WHEN the assembly tree references a component not in the catalog THEN the result SHALL include an error for that node.

### Requirement 6: Assembly-Level Accessibility Validation

**User Story**: As an AI agent, I want assembly-level accessibility checks beyond individual component contracts, so that composed experiences meet WCAG holistically.

#### Acceptance Criteria

1. `validate_assembly` SHALL include assembly-level accessibility checks in addition to structural composition checks.
2. Accessibility checks SHALL be implemented in an isolated module, separate from composition validation logic.
3. Specific accessibility checks SHALL emerge from the pattern interviews — not predetermined.
4. Each accessibility check SHALL reference the WCAG criterion it supports.
5. Accessibility validation results SHALL be returned alongside composition validation results in a unified response.
6. WHEN the pattern count exceeds ~5 or the first project-level pattern is authored THEN the accessibility module SHALL be refactored to declarative assertions in pattern files.

### Requirement 7: Pattern Indexer Integration

**User Story**: As a design system maintainer, I want experience patterns indexed alongside components in the same server, so that agents have a single MCP to query for both component metadata and application guidance.

#### Acceptance Criteria

1. The experience pattern indexer SHALL be integrated into the existing component MCP server (D1) — not a separate server.
2. The pattern indexer SHALL scan the `experience-patterns/` directory at startup alongside component indexing.
3. The health endpoint SHALL report pattern index status alongside component index status.
4. WHEN the `experience-patterns/` directory does not exist THEN the server SHALL start normally with zero patterns indexed and no error.

### Requirement 8: Documentation

**User Story**: As a design system maintainer, I want the experience pattern schema and new tools documented, so that future agents and maintainers understand the application MCP capabilities.

#### Acceptance Criteria

1. The experience pattern schema SHALL be documented with field descriptions, required vs optional fields, and examples.
2. Each new MCP tool (`list_experience_patterns`, `get_experience_pattern`, `validate_assembly`) SHALL have tool descriptions following the existing tool documentation pattern in `index.ts`.
3. The enhanced `findComponents` filter and response shape SHALL be documented in the tool description.

**Documentation waiver**: This spec does not introduce new components or tokens. Documentation requirements are limited to schema reference and tool descriptions. No component README, usage examples, or token consumption docs required.

---

## Related Documentation

- `.kiro/specs/067-application-mcp/design-outline.md` — Approved design outline with 10 decisions
- `.kiro/specs/064-component-metadata-schema/design.md` — Component MCP architecture and data models
- `.kiro/specs/066-schema-completion/design.md` — Model evolution (internal/children, omits, resolvedTokens)
- `.kiro/docs/agentic-ui-strategy.md` — Strategic vision and sequencing
- `component-mcp-server/` — Existing server to extend
