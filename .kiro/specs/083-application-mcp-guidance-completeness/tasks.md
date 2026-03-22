# Tasks Document: Application MCP Guidance Completeness

**Date**: 2026-03-21
**Spec**: 083 - Application MCP Guidance Completeness
**Status**: Tasks Phase
**Dependencies**: Spec 075 (CoverageDrift), Spec 082 (Family Naming + Registry), Spec 068 (FamilyGuidanceIndexer)

---

## Implementation Plan

Three parent tasks corresponding to the three pillars: governance (Task 1), content (Task 2), and signal (Task 3). Governance first establishes the clean baseline, then exercises validate the governance and produce content and signal.

---

## Task List

- [x] 1. Guidance Quality Governance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `GuidanceCompleteness.test.ts` enforces component reachability and non-empty quality fields for all production families
  - CoverageDrift retains only existence enforcement (family-level and phantom detection)
  - Component Development Guide § "Family Guidance Standards" documents the quality bar and serves as the resolution path for test failures
  - Full test suite passes with no regressions

  **Primary Artifacts:**
  - `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`
  - `application-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts` (modified)
  - `.kiro/steering/Component-Development-Guide.md` (new section)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/083-application-mcp-guidance-completeness/completion/task-1-completion.md`
  - Summary: `docs/specs/083-application-mcp-guidance-completeness/task-1-summary.md`

  **Post-Completion:**
  - Run `npm test` — all suites pass
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Guidance Quality Governance"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create GuidanceCompleteness.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`
    - Test 1: every production component reachable via `getGuidance(componentName)` — error message includes component name and points to Component Dev Guide § "Family Guidance Standards"
    - Test 2: every family guidance has non-empty `whenToUse`, `whenNotToUse`, and `accessibilityNotes` — error message says "empty or missing [field]" and points to Component Dev Guide § "Family Guidance Standards"
    - Run `npm test -- application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts` — passes
    - _Requirements: Req 1_

  - [x] 1.2 Migrate component reachability out of CoverageDrift
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Remove third assertion ("every production component is reachable via getGuidance()") from `CoverageDrift.test.ts`
    - Verify CoverageDrift retains: (1) family-level existence, (2) phantom detection
    - Migration validation checklist: list 3 pre-migration assertions, map each to post-migration home, verify no assertion dropped
    - Run `npm test -- application-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts` — passes with 2 tests
    - _Requirements: Req 2_

  - [x] 1.3 Add "Family Guidance Standards" to Component Development Guide
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood (Lina reviews before commit)
    - Add "Family Guidance Standards" section to Component Development Guide, placed after "Family Naming Convention" and before "Component Attribute Standards"
    - Document minimum quality bar: component reachability, non-empty `whenToUse`, non-empty `whenNotToUse`, non-empty `accessibilityNotes`, `displayName` presence
    - Include rationale for each standard
    - Reference enforcement mechanism: `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`
    - Note that this section is the resolution path for test failures
    - Lina reviews section content before commit — it governs her domain (guidance authoring standards)
    - _Requirements: Req 3_

- [ ] 2. Experience Pattern Seeding

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - At least 3 design exercises completed with Leonardo and Peter
  - At least 5 of 7 production families exercised across the full set
  - Design reasoning captured per screen (MCP queries, trade-offs, where guidance helped or fell short)
  - Generalizable patterns formalized as experience patterns with readiness caveats and provisional classification
  - Gap findings documented for formalization in Task 3

  **Primary Artifacts:**
  - `.kiro/specs/083-application-mcp-guidance-completeness/design-exercises.md`
  - New experience pattern YAML files (count TBD by exercises)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/083-application-mcp-guidance-completeness/completion/task-2-completion.md`
  - Summary: `docs/specs/083-application-mcp-guidance-completeness/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Experience Pattern Seeding"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Conduct design exercises
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Leonardo + Peter
    - Create `design-exercises.md` at start of first session (do not pre-template)
    - Work through at least 3 practice screens with Peter
    - Document screen selection rationale: which families each screen exercises, confirm 5+ of 7 covered
    - Capture per-screen: MCP queries attempted, component selection reasoning, trade-offs, where guidance helped or fell short
    - Use Application MCP tools (`find_components`, `get_experience_pattern`, `validate_assembly`) against real design problems
    - Produce per-pattern output with: (a) component list with roles, (b) composition/nesting structure, (c) which props matter, (d) design rationale — structured enough for Lina to formalize without interpretation
    - Flag which arrangements are generalizable patterns vs screen-specific compositions (maps to provisional classification)
    - Tag development-readiness components with readiness caveats when referenced
    - Route token gaps to Ada via gap findings with sufficient context
    - _Requirements: Req 4_

  - [x] 2.2 Formalize experience patterns
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - **Triage first**: Read `design-exercises.md` and sort pattern gaps into three buckets before formalizing:
      - *Formalizable now* — exercise output has component list, roles, composition structure sufficient for YAML
      - *Needs design refinement* — concept is clear but component-level details aren't specific enough
      - *Deferred to classification gate* — no point formalizing until Peter classifies the gap as universal
    - Present triage to Peter for confirmation of which patterns to formalize
    - Extract confirmed generalizable patterns from design exercises
    - Create experience pattern YAML files in existing format
    - Add readiness caveats for patterns referencing development-readiness components
    - Tag each pattern with provisional classification: `general`, `product-specific`, or `uncertain`
    - Run `npm test` — all suites pass (patterns indexed correctly)
    - _Requirements: Req 4_

  - [ ] 2.3 Rename existing experience patterns for naming consistency
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Rename `settings-screen` → `settings` (YAML filename + `name:` field)
    - Rename `account-onboarding` → `onboarding` (YAML filename + `name:` field)
    - Update cross-references in `simple-form.yaml` (alternatives), family guidance YAMLs (`relatedPatterns`), and any other live references
    - Convention: pattern names describe the *thing*, not the *container* — consistent with `simple-form`
    - Historical completion docs and release notes preserve original names (Spec 082 precedent)
    - **Before and after**: Run grep for both old and new names to verify no stale references in live files (historical docs excluded)
    - Run `npm test` — all suites pass
    - _Requirements: Req 4_

- [ ] 3. Application MCP Gap Report

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Structured gap report exists at documented location
  - All gap findings from design exercises formalized with classification and downstream targets
  - Report is referenceable by downstream specs (069, 081)

  **Primary Artifacts:**
  - `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/083-application-mcp-guidance-completeness/completion/task-3-completion.md`
  - Summary: `docs/specs/083-application-mcp-guidance-completeness/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Application MCP Gap Report"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Create and populate gap report
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Create `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`
    - Formalize raw gap findings into structured entries. Sources:
      - Primary: `design-exercises.md` (raw exercise gaps)
      - Supplementary: `feedback.md` § "Task 2.2 Execution" ([LINA R2] component gap scoping, [LEONARDO R1–R3] scope classifications)
      - Supplementary: `completion/task-2-2-completion.md` (triage results, 6 formalized vs 6 gap report split)
      - Note: some exercise gaps were refined during Task 2.2 triage — feedback doc has updated framing (e.g., content list item scoped as primitive component, not semantic container variant)
    - Each entry: description, what was tried, what happened, classification (missing component / missing pattern / missing guidance / search/discovery gap / token gap), provisional scope (Leonardo's tag), downstream target
    - Present gap report to Peter for classification gate review — Peter assigns final scope to each gap (`universal`, `structurally-universal`, `product-specific`, `deferred`)
    - **Pre-populate recommended classifications**: Each gap entry should include Thurgood's recommended `final scope` with rationale based on Leonardo's provisional tags and universality assessment — Peter confirms or overrides, not classifies from scratch
    - Only gaps with `universal` or `structurally-universal` final scope get downstream targets assigned
    - Gaps classified `product-specific` are documented but do NOT proceed to downstream specs
    - Verify report is complete — all exercise gap findings accounted for
    - _Requirements: Req 5_
