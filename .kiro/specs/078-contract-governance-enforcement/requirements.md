# Requirements Document: Contract Governance & Enforcement

**Date**: 2026-03-13
**Spec**: 078 - Contract Governance & Enforcement
**Status**: Requirements Phase
**Dependencies**: None (process and tooling spec — no code dependencies)

---

## Introduction

This spec ensures behavioral contracts are authored before implementation, use Concept Catalog names, and are integrated into the spec planning and implementation workflow. Contracts are core Stemma — a component without contracts is incomplete.

The requirements implement Option D (approved): prompt fix + task template enforcement + automated validation, plus documentation updates to reflect the contracts-as-core-Stemma framing.

---

## Requirements

### Requirement 1: Contracts Scaffolding Step

**User Story**: As a component-implementing agent, I want an explicit contracts.yaml authoring step in my scaffolding workflow, so that behavioral contracts are authored before platform implementation begins.

#### Acceptance Criteria

1. WHEN Lina's scaffolding workflow is executed THEN the workflow SHALL include a dedicated step for authoring `contracts.yaml` between types.ts authoring and platform implementation.
2. WHEN the contracts.yaml step is reached THEN the step SHALL instruct the agent to query the Concept Catalog via MCP before authoring.
3. WHEN the contracts.yaml step is reached THEN the step SHALL state that all contract names must follow `{category}_{concept}` naming from the Concept Catalog.
4. WHEN a new concept is introduced that does not exist in the Concept Catalog THEN the agent SHALL propose a catalog addition (ballot measure) before proceeding to platform implementation. The agent may complete contracts.yaml authoring with the new concept name; the ballot measure gates implementation, not authoring. The Req 4 validation test enforces catalog alignment in CI.

---

### Requirement 2: Task Template Enforcement

**User Story**: As a spec author, I want the task planning process to require a contracts.yaml subtask for every component spec, so that contracts are never omitted from the task plan.

#### Acceptance Criteria

1. WHEN a spec creates a new component THEN Process-Spec-Planning.md SHALL include a "Required Artifacts for Component Specs" checklist that includes `contracts.yaml`.
2. WHEN a component spec's scaffolding parent task is authored THEN the task plan SHALL include an explicit subtask for contracts.yaml authoring.
3. WHEN a component spec's implementation subtasks are authored THEN every platform implementation subtask SHALL include `_Contracts:` lines mapping the subtask to the contracts it satisfies.

---

### Requirement 3: Contract Existence Validation

**User Story**: As a test governance specialist, I want an automated test that verifies every component with platform implementations has a contracts.yaml file, so that missing contracts are caught in CI rather than during review.

#### Acceptance Criteria

1. WHEN `npm test` is run THEN a test SHALL scan `src/components/core/*/` and verify that every component directory containing a `platforms/` subdirectory also contains a `contracts.yaml` file.
2. WHEN a component directory has `platforms/` but no `contracts.yaml` THEN the test SHALL fail with a descriptive error naming the component.
3. WHEN the test discovers components THEN it SHALL use filesystem auto-discovery, not a hard-coded component list.

---

### Requirement 4: Catalog Name Validation

**User Story**: As a test governance specialist, I want an automated test that verifies all contract names use Concept Catalog concepts, so that naming drift is caught before it breaks cross-component searchability.

#### Acceptance Criteria

1. WHEN `npm test` is run THEN a test SHALL parse each `contracts.yaml` file and extract contract concept names.
2. WHEN a contract concept name does not exist in the Concept Catalog THEN the test SHALL fail with an error identifying the component, the contract name, the unrecognized concept, and the category (e.g., "Component Nav-SegmentedChoice-Base: contract 'interaction_noop_active' has unrecognized concept 'noop_active' in category 'interaction'").
3. WHEN the test parses the Concept Catalog THEN it SHALL read from `Contract-System-Reference.md` markdown directly (no separate machine-readable format).
4. WHEN the test parses the Concept Catalog THEN it SHALL include a structural assertion (expected column headers, row count >= current baseline of 112) that fails loudly if the catalog format changes or concepts are deleted. The floor rises as concepts are added.

---

### Requirement 5: Behavioral Contract Validation Test Auto-Discovery

**User Story**: As a test governance specialist, I want the existing behavioral-contract-validation test to auto-discover components from the filesystem, so that new components are automatically included in system-level contract validation.

#### Acceptance Criteria

1. WHEN `behavioral-contract-validation.test.ts` runs THEN it SHALL discover components by scanning `src/components/core/*/contracts.yaml` rather than using a hard-coded component list.
2. WHEN a new component with `contracts.yaml` is added THEN it SHALL be automatically included in the next test run without any test file modification.

---

### Requirement 6: Existing Component Audit

**User Story**: As the Stemma component specialist, I want a one-time audit of all existing components' contracts against the Concept Catalog, so that the catalog name validation test (Req 4) doesn't fail on pre-existing non-catalog names when it ships.

#### Acceptance Criteria

1. WHEN the audit is performed THEN it SHALL scan all `contracts.yaml` files under `src/components/core/` and extract all concept names.
2. WHEN a concept name is not in the Concept Catalog THEN the audit SHALL classify it as either (a) a legitimate new concept requiring catalog addition or (b) an invented name requiring renaming. Lina performs the audit; Thurgood reviews the classification decisions.
3. WHEN the audit is complete THEN all non-catalog names SHALL be resolved (catalog updated or name fixed) and the Concept Catalog header SHALL be updated to reflect the current concept count and component count, before the Req 4 validation test is enabled.

---

### Requirement 7: Component Development Guide Update

**User Story**: As a component-implementing agent, I want the Component Development Guide to include a behavioral contracts section, so that contracts are visible in the primary component development reference.

#### Acceptance Criteria

1. WHEN the Component Development Guide is updated THEN it SHALL include a "Behavioral Contracts Workflow" section covering: when to author contracts, naming convention, Concept Catalog consultation, and the relationship between contracts.yaml and platform implementation.
2. WHEN the section is authored THEN it SHALL frame contracts as core Stemma, not as a separate governance layer.

---

### Requirement 8: Stemma Documentation Updates

**User Story**: As any agent working with Stemma, I want Stemma-referencing documentation to reflect that contracts are a core Stemma artifact, so that my mental model of Stemma is complete from session start.

#### Acceptance Criteria

1. WHEN Stemma-referencing steering docs are updated THEN the following critical docs SHALL include contracts as a core Stemma concept:
   - `Rosetta-Stemma-Systems-Overview.md` (Layer 1, always-loaded)
   - `Component-Primitive-vs-Semantic-Philosophy.md`
2. WHEN Stemma-referencing steering docs are audited THEN a scan of all steering docs mentioning "Stemma" SHALL be performed, and a list of docs requiring contracts-as-core-Stemma updates SHALL be produced. Updates to docs on that list are scoped as individual ballot measures. The scan is the deliverable; the updates are individually bounded.
3. WHEN updates are applied THEN each update SHALL require a ballot measure (steering doc change).

---

### Requirement 9: Concept Catalog Ownership

**User Story**: As the Stemma component specialist, I want a clear ownership model for the Concept Catalog, so that new concepts are cataloged as part of the contracts authoring workflow rather than drifting.

#### Acceptance Criteria

1. WHEN a new concept is introduced in any `contracts.yaml` THEN Lina SHALL propose the catalog addition as a ballot measure.
2. WHEN the contracts.yaml authoring subtask template is defined THEN it SHALL include an explicit step: "Check all concept names against catalog. If new concepts exist, propose catalog addition before proceeding."
3. WHEN the Concept Catalog is updated THEN the three concepts from Spec 049 (`noop_active`, `initial_render`, `aria_controls`) SHALL be added as part of the existing component audit (Req 6).

---

## Documentation Waiver

This spec is primarily process and tooling infrastructure. Requirements 1, 2, 7, 8, and 9 produce steering doc changes (ballot measures). Requirements 3, 4, 5, and 6 produce test infrastructure. No developer-facing API is created.

---

## Resolved Review Items

| # | Source | Resolution |
|---|--------|------------|
| Q1 | Peter/Thurgood | Option D approved — all three layers |
| Q2 | Peter/Thurgood | Catalog stays in markdown; extraction triggered when second consumer needs to parse |
| Q3 | Peter/Thurgood | Existence check as test file following demo-system pattern |
| Q4 | Peter/Thurgood | Non-catalog names are errors, not warnings |
| Q5 | Peter/Thurgood | Formal checklist in Process-Spec-Planning |
| Q6 | Peter/Thurgood | Every implementation subtask requires `_Contracts:` lines |
| Q7 | Peter/Thurgood | Lina owns Concept Catalog updates |
| Q8 | Peter/Thurgood | Auto-discovery for behavioral-contract-validation test |
| Ada DO-R1 | Ada | Structural assertion on catalog parsing — incorporated in Req 4 AC 4 |
| Ada DO-R1 | Ada | One-time audit of existing components — Req 6 |
| Ada DO-R1 | Ada | Ballot measure dependency chain — monitor after 2-3 components |
| Lina DO-R1 | Lina | CDG contracts section as fourth safeguard — Req 7 |
| Lina DO-R1 | Lina | Contract inheritance out of scope — noted as boundary |
| Lina DO-R1 | Lina | `_Contracts:` lines are real safeguard, not overhead — confirmed Q6 |
| Finding 5 | Thurgood | Stemma docs don't reflect contracts as core — Req 8 (added to design-outline.md) |
| Lina Req-R1 | Lina | Req 1 AC 4: ballot measure gates implementation, not authoring — clarified |
| Lina Req-R1 | Lina | Req 4 AC 2: include category in error message — added |
| Lina Req-R1 | Lina | Req 6: Lina performs audit, Thurgood reviews — updated user story and AC 2 |
| Lina Req-R1 | Lina | Req 8 AC 2: open-ended — reframed as bounded scan + individual ballot measures |
| Lina Req-R1 | Lina | Concept Catalog header count — folded into Req 6 AC 3 |
| Ada Req-R1 | Ada | Req 4 AC 4: baseline row count >= 112, floor rises — refined |
| Ada Req-R1 | Ada | Req 8 AC 2: scan as deliverable, not open-ended update — incorporated |
| Ada Req-R1 | Ada | Req 6 AC 3: catalog header update — incorporated |
| Ada Req-R1 | Ada | Req 4 AC 3: catalog table has separate columns — implementation note, no AC change |
