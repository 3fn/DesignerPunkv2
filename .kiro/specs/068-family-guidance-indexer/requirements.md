# Requirements Document: Family Guidance Indexer

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Status**: Requirements Phase
**Dependencies**: 067 (Application MCP — COMPLETE)

---

## Introduction

The Application MCP (Spec 067) provides component selection, experience patterns, and assembly validation. It answers "what components exist?" and "how do they compose?" but not "which family member should I use for this scenario?" or "what prop values are appropriate for this context?"

This knowledge exists in 13 Component-Family steering docs as human-authored prose and decision tables. It's rich, production-ready content — but not machine-queryable. An agent can discover that Button-CTA exists, but can't ask "which variant for a destructive action?"

This spec makes family-level guidance machine-queryable by introducing companion YAML files parsed by a new indexer, served through a new MCP tool (`get_prop_guidance`) deferred from Spec 067 (Decision D6).

---

## Requirements

### Requirement 1: Family Guidance YAML Schema

**User Story**: As a design system maintainer, I want a structured YAML format for expressing component family guidance, so that selection rules and prop recommendations can be machine-parsed.

#### Acceptance Criteria

1. The schema SHALL support: `family`, `companion` (path to paired family doc), `whenToUse`, `whenNotToUse`, `selectionRules`, `accessibilityNotes`, and `patterns`.
2. Each selection rule SHALL support: `scenario`, `recommend` (component name), `props` (optional key-value map), and `rationale`.
3. Selection rules SHALL support optional `group` field for families with sub-type groupings (e.g., Form-Inputs: Text Inputs, Checkboxes, Radio Buttons).
4. `patterns` SHALL be optional — absent or empty for simpler families.
5. Each pattern entry SHALL support: `name`, `description`, `components` (array with `component`, `role`, `props`), and `relatedPatterns` (cross-references to experience patterns).
6. Rationale text referencing visual properties SHALL use token names, not raw values (D9 compliance).
7. The schema SHALL be designed to accommodate future extension to token family docs without breaking changes.

### Requirement 2: Companion File Organization

**User Story**: As a design system maintainer, I want family guidance YAML files stored separately from family docs, so that the MCP can serve structured data without loading full steering docs.

#### Acceptance Criteria

1. Companion YAML files SHALL live in a dedicated `family-guidance/` directory at project root.
2. Each companion YAML file SHALL include a `companion` field referencing its paired family doc path.
3. Each paired family doc SHALL include a cross-reference to its companion YAML file.
4. WHEN an agent modifies either a family doc or its companion YAML THEN the agent SHALL read both files before making changes (mandatory read-both protocol).
5. The `family-guidance/` directory SHALL include a README.md documenting the schema and the read-both protocol.

### Requirement 3: Family Guidance Indexer

**User Story**: As the Application MCP, I want to parse and index family guidance YAML files at startup, so that guidance data is available for MCP tool queries.

#### Acceptance Criteria

1. The indexer SHALL scan the `family-guidance/` directory for YAML files.
2. The indexer SHALL validate each file against the family guidance schema and report warnings for malformed entries.
3. The indexer SHALL integrate with the existing `ComponentIndexer`, following the same integration pattern as `PatternIndexer`.
4. WHEN a companion YAML references a family that doesn't exist in the component catalog THEN the indexer SHALL emit a warning, not a fatal error.
5. The indexer SHALL be testable in isolation with fixture YAML files.

### Requirement 4: `get_prop_guidance` MCP Tool

**User Story**: As an AI agent building an experience, I want to query prop selection guidance by component or family name, so that I can make informed prop and variant choices.

#### Acceptance Criteria

1. The tool SHALL accept a `component` parameter (component name or family name).
2. WHEN queried with a component name THEN it SHALL return the guidance for that component's family, filtered to rules relevant to the queried component.
3. WHEN queried with a family name THEN it SHALL return the full family guidance.
4. The response SHALL include `whenToUse`, `whenNotToUse`, `selectionRules`, `accessibilityNotes`, and `patterns`.
5. The tool SHALL support an optional `verbose` parameter (default: false). WHEN verbose is false THEN `rationale` fields on selection rules AND `description` fields on patterns SHALL be omitted from the response to reduce token cost.
6. WHEN no guidance exists for the queried component or family THEN the tool SHALL return a clear "no guidance available" response, not an error.

### Requirement 5: Phased Authoring with Ballot Measures

**User Story**: As the project lead, I want family guidance authored in phases with governance review, so that the schema is validated through real content before broad rollout.

#### Acceptance Criteria

1. Phase 1 SHALL be a ballot measure for the YAML schema convention itself.
2. Phase 2 SHALL author companion YAML files for Button, Form-Inputs, and Container — strictly serially in that order. Schema changes from each doc SHALL be applied before starting the next.
3. Phase 2 interviews SHALL explicitly ask "does this pattern belong in family guidance, experience pattern, or both?" for every pattern encountered.
4. Phase 3 SHALL author remaining family docs, batched by structural similarity where content aligns, processed individually where content meaningfully diverges.
5. Batch groupings for Phase 3 SHALL be determined after Phase 2 provides evidence.

### Requirement 6: Drift Mitigation

**User Story**: As a governance auditor, I want mechanisms to detect when companion YAML files and family docs drift out of sync, so that guidance accuracy is maintained.

#### Acceptance Criteria

1. Bidirectional cross-references SHALL exist between each companion YAML and its family doc.
2. The read-both protocol SHALL be documented in companion YAML frontmatter or header comments — not only in external steering docs.
3. A commit-level validation mechanism (hook or CI check) SHALL be implemented as a follow-up to flag when one file is modified without the other in the same commit.


---

## Lina's Review Notes (2026-03-04)

**Reviewer**: Lina (Stemma Component Specialist)

### Actionable: Requirement 4.5 — verbose=false scope gap
Ada caught this: Requirement 4.5 says `verbose=false` omits `rationale` from selection rules, but the design doc also strips `description` from `FamilyPattern` entries. Update to: "WHEN verbose is false THEN `rationale` fields on selection rules AND `description` fields on patterns SHALL be omitted."

### No other requirement-level concerns. Acceptance criteria are testable and specific. Requirement 6 (drift mitigation) is appropriately scoped with the commit-level hook as follow-up.

---

## Ada's Technical Review (2026-03-04)

**Reviewer**: Ada (Rosetta Token Specialist)

### Actionable: Requirement 4.5 gap — `verbose=false` scope

Requirement 4.5 says `verbose=false` omits `rationale` from selection rules. The design doc also strips `description` from `FamilyPattern` entries. The requirement should match the design doc — add: "WHEN verbose is false THEN `rationale` fields on selection rules AND `description` fields on patterns SHALL be omitted."

### No other requirement-level concerns. Requirements are clean and map directly to design outline decisions.
