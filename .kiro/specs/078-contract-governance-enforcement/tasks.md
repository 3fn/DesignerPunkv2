# Implementation Plan: Contract Governance & Enforcement

**Date**: 2026-03-13
**Spec**: 078 - Contract Governance & Enforcement
**Status**: Implementation Planning
**Dependencies**: None

---

The implementation is organized into 4 parent tasks:

1. **Existing Component Audit** — One-time audit of all contracts against Concept Catalog (prerequisite for automated validation)
2. **Automated Validation** — Three test files: existence check, catalog name validation, auto-discovery fix
3. **Process & Prompt Updates** — Lina's prompt, Process-Spec-Planning, Component Development Guide
4. **Stemma Documentation Updates** — Scan + targeted updates to Stemma-referencing docs

Task 1 must complete before Task 2 (audit resolves non-catalog names so the validation test passes on existing components). Tasks 3 and 4 are independent of each other and of Tasks 1-2.

---

## Task List

- [x] 1. Existing Component Audit

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  **Agent**: Lina (audit) + Thurgood (review)

  **Success Criteria:**
  - All `contracts.yaml` files under `src/components/core/` scanned
  - Every concept name classified as catalog-aligned or non-catalog
  - Non-catalog names resolved: catalog updated (ballot measure) or name fixed
  - Concept Catalog header updated with current count
  - Spec 049's three new concepts (`noop_active`, `initial_render`, `aria_controls`) added to catalog

  **Primary Artifacts:**
  - `.kiro/specs/078-contract-governance-enforcement/findings/contract-catalog-audit.md`
  - `.kiro/steering/Contract-System-Reference.md` (updated catalog)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/078-contract-governance-enforcement/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/078-contract-governance-enforcement/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Existing Component Audit"`
  - Verify: `npm test` — all suites pass, no regressions

  - [x] 1.1 Scan all contracts.yaml and diff against Concept Catalog
    **Type**: Architecture
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Scan all `contracts.yaml` files under `src/components/core/`
    - Extract all concept names, split by `{category}_{concept}`
    - Diff against Concept Catalog in Contract-System-Reference.md
    - Classify each non-catalog name: (a) legitimate new concept or (b) naming mistake
    - Document findings in `findings/contract-catalog-audit.md`
    - _Requirements: 6.1, 6.2_

  - [x] 1.2 Resolve non-catalog names
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (changes) + Thurgood (review classifications) + Peter (ballot measures)
    - For legitimate new concepts: propose catalog additions as a single batched ballot measure
    - For naming mistakes: rename in the component's `contracts.yaml`
    - Include Spec 049's three new concepts: `noop_active` (interaction), `initial_render` (animation), `aria_controls` (accessibility)
    - Update Concept Catalog header with current concept count and component count
    - Completion doc must include final concept count as a named deliverable (e.g., "Final catalog count: N concepts across 10 categories") — Task 2.2 depends on this number for the baseline floor assertion
    - _Requirements: 6.2, 6.3, 9.3_

- [x] 2. Automated Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  **Agent**: Thurgood (test infrastructure) + Lina (consult)

  **Success Criteria:**
  - Contract existence test catches any component with `platforms/` but no `contracts.yaml`
  - Catalog name validation test catches any non-catalog concept name (error, not warning)
  - Catalog structural assertion catches format changes (10 categories, >= baseline count, per-category count match)
  - Per-category parenthetical count matches actual parsed concept count
  - Behavioral-contract-validation test auto-discovers all components with `contracts.yaml`
  - All existing tests continue passing

  **Primary Artifacts:**
  - `src/__tests__/stemma-system/contract-existence-validation.test.ts` (new)
  - `src/__tests__/stemma-system/contract-catalog-name-validation.test.ts` (new)
  - `src/__tests__/stemma-system/behavioral-contract-validation.test.ts` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/078-contract-governance-enforcement/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/078-contract-governance-enforcement/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Automated Validation"`
  - Verify: `npm test` — all suites pass, no regressions

  - [x] 2.1 Create contract existence validation test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Create `src/__tests__/stemma-system/contract-existence-validation.test.ts`
    - Scan `src/components/core/*/` for directories with `platforms/` subdirectory
    - Verify sibling `contracts.yaml` exists for each
    - Descriptive error on failure: "Component {name} has platforms/ but no contracts.yaml"
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 2.2 Create catalog name validation test
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Create `src/__tests__/stemma-system/contract-catalog-name-validation.test.ts`
    - Parse Concept Catalog from Contract-System-Reference.md: category headings + inline backtick-delimited concept lists separated by `·` (U+00B7)
    - Structural assertions: exactly 10 categories, total concepts >= baseline (post-audit count from Task 1), per-category parenthetical count matches parsed count
    - Scan all `contracts.yaml`, extract names, split `{category}_{concept}`, verify concept exists in catalog for that category
    - Error format: "Component {name}: contract '{full_name}' has unrecognized concept '{concept}' in category '{category}'"
    - Handle edge cases: no underscore in name (format error), unknown category, empty contracts.yaml (skip)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.3 Update behavioral-contract-validation test to auto-discover
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood + Lina (consult)
    - Replace hard-coded `COMPONENTS` array (line ~68) with filesystem discovery
    - Scan `src/components/core/*/contracts.yaml`, filter to components with non-empty contracts
    - No other changes to existing test logic
    - Verify all previously validated components still pass
    - _Requirements: 5.1, 5.2_

- [x] 3. Process & Prompt Updates

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  **Agent**: Thurgood (process docs) + Peter (ballot measures)

  **Success Criteria:**
  - Lina's scaffolding workflow includes contracts.yaml authoring step before platform implementation
  - Process-Spec-Planning includes required artifacts checklist and `_Contracts:` line mandate
  - Component Development Guide includes Behavioral Contracts Workflow section

  **Primary Artifacts:**
  - Lina's prompt file (modified)
  - `.kiro/steering/Process-Spec-Planning.md` (modified)
  - `.kiro/steering/Component-Development-Guide.md` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/078-contract-governance-enforcement/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/078-contract-governance-enforcement/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Process & Prompt Updates"`

  - [x] 3.1 Add contracts.yaml step to Lina's scaffolding workflow
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Peter (prompt authoring — direct edit, not ballot measure)
    - Add dedicated Step 3 between types.ts and platform implementation
    - Step must cover: MCP query instruction for Concept Catalog, `{category}_{concept}` naming, "before platform implementation" gate
    - Renumber existing Steps 3-6 to 4-7
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 3.2 Add required artifacts checklist and _Contracts: mandate to Process-Spec-Planning
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood + Peter (ballot measure)
    - Add "Required Artifacts for Component Specs" checklist: `contracts.yaml`, `component-meta.yaml`, `schema/`, `types.ts`
    - Add note: every platform implementation subtask must include `_Contracts:` lines mapping to satisfied contracts
    - Ballot measure required
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Add Behavioral Contracts Workflow section to Component Development Guide
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood (draft) + Lina (consult) + Peter (ballot measure)
    - New section covering: when to author contracts, `{category}_{concept}` naming convention, Concept Catalog consultation via MCP, relationship between contracts.yaml and platform implementation
    - Frame contracts as core Stemma, not separate governance
    - Ballot measure required
    - _Requirements: 7.1, 7.2_

- [x] 4. Stemma Documentation Updates

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  **Agent**: Thurgood (scan + drafts) + Peter (ballot measures)

  **Success Criteria:**
  - Scan of all Stemma-referencing steering docs completed
  - Critical docs updated: Rosetta-Stemma-Systems-Overview.md, Component-Primitive-vs-Semantic-Philosophy.md
  - List of additional docs requiring updates produced
  - Individual ballot measures for each update

  **Primary Artifacts:**
  - `.kiro/specs/078-contract-governance-enforcement/findings/stemma-doc-scan.md`
  - `.kiro/steering/Rosetta-Stemma-Systems-Overview.md` (modified)
  - `.kiro/steering/Component-Primitive-vs-Semantic-Philosophy.md` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/078-contract-governance-enforcement/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/078-contract-governance-enforcement/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Stemma Documentation Updates"`

  - [x] 4.1 Scan Stemma-referencing steering docs
    **Type**: Architecture
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Scan all steering docs mentioning "Stemma" that don't reference contracts
    - Produce list of docs requiring contracts-as-core-Stemma updates
    - Document in `findings/stemma-doc-scan.md`
    - _Requirements: 8.2_

  - [x] 4.2 Update critical Stemma docs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood (draft) + Peter (ballot measures)
    - Update `Rosetta-Stemma-Systems-Overview.md` — add contracts as core Stemma concept
    - Update `Component-Primitive-vs-Semantic-Philosophy.md` — add contracts as specification layer
    - Individual ballot measure for each doc
    - _Requirements: 8.1, 8.3_

  - [x] 4.3 Update additional Stemma docs from scan
    **Type**: Implementation
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood (draft) + Peter (ballot measures)
    - Apply updates to docs identified in 4.1 scan
    - Individual ballot measure for each doc
    - Scope bounded by scan results — not an open-ended audit
    - _Requirements: 8.2, 8.3_

---

## Dependency Graph

```
Task 1 (Audit) ──→ Task 2 (Automated Validation)

Task 3 (Process & Prompt)     [independent]
Task 4 (Stemma Docs)          [independent]
```

Task 1 must complete before Task 2 (audit resolves non-catalog names so validation tests pass). Tasks 3 and 4 have no dependencies on Tasks 1-2 or each other — they can proceed in parallel.
