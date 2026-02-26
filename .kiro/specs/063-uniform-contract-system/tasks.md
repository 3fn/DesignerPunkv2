# Implementation Plan: Uniform Contract System

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Status**: Implementation Planning
**Dependencies**: 062 - Stemma Catalog Readiness Audit (complete)

---

## Implementation Plan

Migration is executed in phases: canonical name mapping first (prevents mid-migration ambiguity), then component migration by current format complexity, then inheritance/composition formalization, then governance updates, then validation.

Lina executes the migration work. Thurgood validates the result and handles governance proposals. Peter approves ballot measures.

---

## Task List

- [x] 1. Canonical Name Mapping and Format Specification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Complete mapping from all 108 discovered contract names to canonical `{category}_{concept}` names
  - Canonical format fully specified with header fields, contract fields, and exclusion fields
  - All ambiguous categorizations resolved with documented reasoning
  - Mapping reviewed and approved before migration begins

  **Primary Artifacts:**
  - `.kiro/specs/063-uniform-contract-system/findings/canonical-name-mapping.md`
  - `.kiro/specs/063-uniform-contract-system/findings/format-specification.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/063-uniform-contract-system/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/063-uniform-contract-system/task-1-summary.md` (triggers release detection)

  **Post-Completion:**
  - Human checkpoint review of name mapping and format specification
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Canonical Name Mapping and Format Specification"`

  - [x] 1.1 Build complete 108→canonical name mapping
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Map all 108 contract names discovered in 062 audit to `{category}_{concept}` canonical names
    - Apply classification tiebreaker rule for ambiguous cases
    - Document reasoning for each edge case as precedent
    - Flag any contracts that don't fit cleanly into the 10 categories
    - _Requirements: 2.1, 2.2, 2.5, 3.1, 7.1, 7.2, 7.3_

  - [x] 1.2 Finalize canonical format specification
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Document the complete contracts.yaml format with all fields
    - Document the exclusion format (reason, category, reference)
    - Document header fields (version, component, family)
    - Document inheritance declaration format (`inherits:`)
    - Provide annotated examples for each migration scenario (existing contracts.yaml, schema-inline, README-only, undocumented)
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 5.1, 5.2_

  - [x] 1.3 Review checkpoint
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Present canonical name mapping for human review
    - Present format specification for human review
    - **Human checkpoint**: Mapping and format must be approved before migration begins
    - _Requirements: 7.2_

---

- [x] 2. Component Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 28 components have contracts.yaml in the canonical format
  - All contract names use `{category}_{concept}` convention
  - All inline contract definitions removed from schema YAML
  - All intentional exclusions captured in `excludes:` blocks

  **Primary Artifacts:**
  - 28 `contracts.yaml` files (created or updated)
  - 14 schema YAML files (inline contracts removed)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/063-uniform-contract-system/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/063-uniform-contract-system/task-2-summary.md` (triggers release detection)

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component Migration"`

  - [x] 2.1 Define contracts for undocumented components (Avatar, Button-Icon)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Analyze Avatar and Button-Icon implementations to identify behavioral contracts
    - Create contracts.yaml for each with all required fields
    - Apply canonical naming convention
    - _Requirements: 1.6, 2.1, 2.3_

  - [x] 2.2 Create contracts.yaml for schema-less components (6 remaining)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create contracts.yaml for: Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set
    - Extract contracts from README documentation
    - Apply canonical naming convention and all required fields
    - _Requirements: 1.5, 2.1, 2.3_

  - [x] 2.3 Extract and restructure contracts from schema-inline components (14 components)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Extract full contract definitions from schema YAML into dedicated contracts.yaml
    - Restructure to canonical format (add `category`, `test_approach`, `required` fields)
    - Apply canonical naming convention
    - Remove inline contract definitions from schema YAML
    - _Requirements: 1.4, 2.1, 2.3_

  - [x] 2.4 Update existing contracts.yaml files (9 components)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `required` field to all existing contracts
    - Rename contracts to canonical `{category}_{concept}` names
    - Verify all required fields present
    - Add `excludes:` blocks where intentional exclusions were identified in 062 audit
    - _Requirements: 1.3, 2.1, 2.3, 4.1, 4.4_

---

- [x] 3. Inheritance, Composition, and Governance

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All inheritance relationships formally declared with `inherits:`
  - All composition relationships formalized with `composes:` in schema YAML
  - No conceptual-only inheritance claims remain
  - Standard library deprecated with ballot measure approval
  - Governance docs updated with ballot measure approval
  - Migration validated by Thurgood audit

  **Primary Artifacts:**
  - Updated contracts.yaml files (inheritance declarations)
  - Updated schema YAML files (composition declarations)
  - Updated Component-Schema-Format.md (deprecation note)
  - Updated stemma-system-principles.md (family list)
  - `.kiro/specs/063-uniform-contract-system/findings/migration-validation.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/063-uniform-contract-system/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/063-uniform-contract-system/task-3-summary.md` (triggers release detection)

  **Post-Completion:**
  - Human checkpoint review of governance proposals and migration validation
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Inheritance, Composition, and Governance"`

  - [x] 3.1 Formalize inheritance relationships
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `inherits:` declarations to all child components
    - Formalize Input-Checkbox-Legal → Input-Checkbox-Base (real inheritance)
    - Remove inherited contract listings from child contracts.yaml (keep only extended contracts)
    - Verify all "conceptual" inheritance is either formalized or dropped
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 3.2 Formalize composition relationships
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `composes:` blocks to schema YAML for: Progress-Stepper-Base, Container-Card-Base, Button-VerticalList-Set, Input-Radio-Set
    - Include `component` and `relationship` fields
    - Confirm Input-Radio-Set uses `composes:` not `inherits:`
    - _Requirements: 6.1, 6.2, 6.3, 5.5_

  - [x] 3.3 Propose and apply governance updates (ballot measures)
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Draft deprecation note for Component-Schema-Format.md
    - Draft family list update for stemma-system-principles.md
    - Draft Avatar reconciliation proposal
    - Present each proposal with counter-argument for Peter's approval
    - Apply approved changes
    - **Human checkpoint**: All governance changes require ballot measure approval
    - _Requirements: 8.1, 8.2, 9.1, 9.2, 9.3_

  - [x] 3.4 Validate migration completeness
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Validate all 28 components have contracts.yaml in canonical format
    - Validate zero naming inconsistencies
    - Validate all inheritance formally declared
    - Validate all exclusions captured
    - Validate standard library deprecated
    - Validate governance docs updated
    - Produce migration validation report
    - **Human checkpoint**: Present validation results — gate for downstream schema work (spec 064)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
