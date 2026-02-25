# Implementation Plan: Stemma Catalog Readiness Audit

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Plan

This audit is executed as a phased evidence-gathering process. Each task produces one or more markdown deliverables in `.kiro/specs/062-stemma-catalog-readiness-audit/findings/`. Human checkpoints gate progression at key decision points.

All tasks are executed by Thurgood (audit specialist). Domain-specific findings are flagged for Ada (tokens) and Lina (components) but not acted on within this spec.

---

## Task List

- [ ] 1. Catalog Inventory and Contract Taxonomy

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Every component in `src/components/core/` mapped to its Stemma family
  - Platform coverage (web/iOS/Android) verified per component
  - Complete contract category taxonomy discovered from actual components
  - Contract documentation format identified per component
  - Naming inconsistencies between standard library and component-level contracts documented

  **Primary Artifacts:**
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/catalog-inventory.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/contract-taxonomy.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/format-divergence-summary.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/062-stemma-catalog-readiness-audit/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/062-stemma-catalog-readiness-audit/task-1-summary.md` (triggers release detection)

  **Post-Completion:**
  - Human checkpoint review of inventory and taxonomy findings
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Catalog Inventory and Contract Taxonomy"`
  - Verify: Check GitHub for committed changes

  - [ ] 1.1 Enumerate all components and map to Stemma families
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Scan `src/components/core/` for all component directories
    - Map each component to one of the 11 Stemma families using Component-Inheritance-Structures.md and component schemas
    - Verify platform implementations by checking for non-stub files in `platforms/web/`, `platforms/ios/`, `platforms/android/`
    - Confirm family status (active vs. placeholder) against Rosetta-Stemma-Systems-Overview
    - Produce `findings/catalog-inventory.md` with component table
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 1.2 Discover contract taxonomy from components
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Read all `.schema.yaml` files and `contracts.yaml` files across the catalog
    - Extract every distinct contract name and category
    - Cross-reference against the standard contracts library (Component-Schema-Format.md) to identify which are in the library and which are component-specific
    - Document naming variants (e.g., `hover_state` vs. `hoverable`)
    - Produce `findings/contract-taxonomy.md` with complete category list and component usage
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ] 1.3 Document contract format divergence
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - For each component, identify which contract documentation format is used: standard library reference, `contracts.yaml` file, schema-level inline, or undocumented
    - Summarize the format split across the catalog
    - Produce `findings/format-divergence-summary.md`
    - **Human checkpoint**: Present catalog inventory, contract taxonomy, and format divergence findings for review before proceeding to Task 2
    - _Requirements: 2.2, 2.5_

---

- [ ] 2. Contract Coverage Analysis

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Coverage matrix produced using discovered taxonomy as columns
  - Intentional exclusions distinguished from gaps with documented evidence
  - Inheritance relationships mapped showing contract flow through hierarchies
  - Test coverage overlaid on the matrix

  **Primary Artifacts:**
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/coverage-matrix.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/intentional-exclusions.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/inheritance-map.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/test-coverage-overlay.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/062-stemma-catalog-readiness-audit/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/062-stemma-catalog-readiness-audit/task-2-summary.md` (triggers release detection)

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Contract Coverage Analysis"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Build contract coverage matrix
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Using the catalog inventory (Task 1.1) and contract taxonomy (Task 1.2), build a components × contracts matrix
    - For each cell, determine status: ✅ implemented, ⚠️ gap, 🚫 intentional exclusion, `—` not applicable
    - Require documented evidence for every 🚫 classification
    - Identify contracts with zero or single coverage
    - Produce `findings/coverage-matrix.md`
    - Produce `findings/intentional-exclusions.md` with design rationale for each exclusion
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 2.2 Map contract inheritance and propagation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - For each component hierarchy (e.g., Input-Text-Base → Input-Text-Email/Password/PhoneNumber), document which contracts are inherited, overridden, extended, or restricted
    - Flag cases where inheritance is declared but not explicitly documented
    - Produce `findings/inheritance-map.md`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 2.3 Overlay test coverage on contract matrix
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Scan `__tests__/` directories for each component
    - Identify which contracts have corresponding test files
    - Note the test approach: behavioral correctness, source code pattern matching, or no tests
    - Flag contracts with `test_approach` documentation but no test implementation
    - Produce `findings/test-coverage-overlay.md`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

---

- [ ] 3. Readiness Assessment and Design Brief

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Clear proceed/align/defer/condition recommendation with rationale and counter-argument
  - Contract system design brief produced with taxonomy, format convergence recommendation, and hierarchy model
  - Domain gaps flagged for Ada and Lina with severity ratings
  - All findings traceable to evidence gathered in Tasks 1 and 2

  **Primary Artifacts:**
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/readiness-recommendation.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/contract-system-design-brief.md`
  - `.kiro/specs/062-stemma-catalog-readiness-audit/findings/domain-gap-summary.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/062-stemma-catalog-readiness-audit/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/062-stemma-catalog-readiness-audit/task-3-summary.md` (triggers release detection)

  **Post-Completion:**
  - Human checkpoint review of recommendation and design brief
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Readiness Assessment and Design Brief"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Assess diversity and produce readiness recommendation
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Evaluate whether active families exercise enough distinct contract patterns to validate a schema design
    - Identify contract patterns that placeholder families would likely introduce
    - Assess whether the contract format divergence blocks schema formalization or can be resolved during schema design
    - Produce recommendation: proceed / align existing components first / add specific components first / defer
    - Include counter-argument for the alternative path
    - Produce `findings/readiness-recommendation.md`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 3.2 Produce contract system design brief
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Document the complete contract taxonomy discovered during the audit
    - Recommend a format convergence point
    - Outline the relationship between abstract contracts and component-specific contracts (hierarchical vs. flat)
    - Document how intentional exclusions should be represented
    - Produce `findings/contract-system-design-brief.md`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 3.3 Flag domain gaps for Ada and Lina
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Compile component behavioral contract test gaps for Lina
    - Compile token compliance test gaps for Ada
    - Categorize each gap by severity: Critical, High, Medium, Low
    - Produce `findings/domain-gap-summary.md`
    - **Human checkpoint**: Present readiness recommendation, contract system design brief, and domain gap summary for review
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
