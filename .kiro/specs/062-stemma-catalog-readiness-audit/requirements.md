# Requirements Document: Stemma Catalog Readiness Audit

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Status**: Requirements Phase
**Dependencies**: None (prerequisite for agentic UI schema formalization)
**Type**: Audit

---

## Introduction

This spec defines an audit of the Stemma component catalog to determine whether it has sufficient behavioral contract diversity and Stemma alignment to support agentic UI schema formalization. The audit was initiated as a prerequisite gate for the agentic UI application MCP work documented in `.kiro/docs/agentic-ui-strategy.md`.

Pre-audit investigation (Thurgood + Lina consultation) identified a behavioral contract system divergence: three different contract documentation formats exist across the catalog (standard contracts library, component-level `contracts.yaml` files, and schema-level inline contracts). This divergence affects the audit methodology and the schema readiness assessment.

The audit produces findings and recommendations. It does not produce code fixes, contract migrations, or schema designs.

---

## Requirements

### Requirement 1: Catalog Inventory

**User Story**: As a system architect, I want every implemented component mapped to its Stemma family with platform coverage noted, so that I have a complete picture of what exists before assessing diversity.

#### Acceptance Criteria

1. WHEN the audit begins THEN the Audit SHALL enumerate all implemented components in `src/components/` across web, iOS, and Android platforms
2. WHEN enumerating components THEN the Audit SHALL map each component to one of the 11 Stemma families
3. WHEN mapping is complete THEN the Audit SHALL confirm which families have active implementations vs. placeholder status
4. WHEN Phase 1 is complete THEN the Audit SHALL produce a catalog inventory table showing: component name, Stemma family, platform implementations (web/iOS/Android), and component type (primitive/semantic)
5. WHEN Phase 1 deliverables are complete THEN the Audit SHALL request human checkpoint review before proceeding

---

### Requirement 2: Contract Taxonomy Discovery

**User Story**: As a system architect, I want the full set of behavioral contract categories discovered from actual components (not assumed from the standard library), so that the coverage matrix uses the real taxonomy.

#### Acceptance Criteria

1. WHEN discovering the contract taxonomy THEN the Audit SHALL inventory all contract categories in use across the catalog, including categories not present in the standard contracts library (Component-Schema-Format.md)
2. WHEN discovering the taxonomy THEN the Audit SHALL document the contract documentation format used by each component (standard library reference, `contracts.yaml` file, schema-level inline, or undocumented)
3. WHEN discovering the taxonomy THEN the Audit SHALL identify naming inconsistencies between the standard contracts library and component-level contract definitions (e.g., `hover_state` vs. `hoverable`)
4. WHEN Phase 2 is complete THEN the Audit SHALL produce a complete contract category list with the components that use each category
5. WHEN Phase 2 is complete THEN the Audit SHALL produce a format divergence summary showing which components use which contract documentation format
6. WHEN Phase 2 deliverables are complete THEN the Audit SHALL request human checkpoint review before proceeding

---

### Requirement 3: Contract Coverage Matrix

**User Story**: As a system architect, I want a components × contracts coverage matrix, so that I can see which behavioral patterns are well-represented and which have gaps.

#### Acceptance Criteria

1. WHEN building the coverage matrix THEN the Audit SHALL use the discovered taxonomy (Requirement 2) as the column set, not the standard library's 16 contracts
2. WHEN building the matrix THEN the Audit SHALL distinguish between: contract implemented ✅, contract gap ⚠️, and intentional exclusion 🚫 (design decision)
3. WHEN an intentional exclusion is identified THEN the Audit SHALL document the design rationale (e.g., Chips' "no disabled states" philosophy)
4. WHEN building the matrix THEN the Audit SHALL identify contracts with zero coverage (no component implements them) and single coverage (only one component implements them)
5. WHEN Phase 3 is complete THEN the Audit SHALL produce the coverage matrix and an intentional exclusion inventory

---

### Requirement 4: Inheritance and Propagation Mapping

**User Story**: As a system architect, I want to understand how contracts flow through component hierarchies, so that the agentic UI schema can accurately represent inheritance relationships.

#### Acceptance Criteria

1. WHEN mapping inheritance THEN the Audit SHALL document how contracts propagate from base components to semantic variants (e.g., Input-Text-Base → Input-Text-Email)
2. WHEN mapping inheritance THEN the Audit SHALL identify where semantic variants override, extend, or restrict base contracts
3. WHEN mapping inheritance THEN the Audit SHALL flag cases where inheritance is declared but not explicitly documented (e.g., "inherits all contracts from Chip-Base" without listing which contracts)
4. WHEN Phase 4 is complete THEN the Audit SHALL produce an inheritance map showing contract flow per component hierarchy

---

### Requirement 5: Test Coverage Overlay

**User Story**: As a test governance specialist, I want to know which contracts are tested and which are documented-only, so that I can assess the confidence level of the contract system.

#### Acceptance Criteria

1. WHEN assessing test coverage THEN the Audit SHALL identify which contracts have corresponding test files and which are documentation-only
2. WHEN assessing test coverage THEN the Audit SHALL note the test approach used (behavioral correctness testing vs. source code pattern matching vs. no tests)
3. WHEN assessing test coverage THEN the Audit SHALL flag contracts that include `test_approach` fields in their documentation but have no corresponding test implementation
4. WHEN Phase 5 is complete THEN the Audit SHALL produce a test coverage overlay on the contract coverage matrix

---

### Requirement 6: Diversity and Readiness Assessment

**User Story**: As a system architect, I want a clear recommendation on whether the catalog is ready for schema formalization, so that I can make an informed decision about next steps.

#### Acceptance Criteria

1. WHEN assessing diversity THEN the Audit SHALL evaluate whether the active families exercise enough distinct behavioral contract patterns to validate a schema design
2. WHEN assessing diversity THEN the Audit SHALL identify contract patterns that placeholder families (Modals, Data Displays, Dividers, Loading, Navigation) would likely introduce that no active component currently exercises
3. WHEN assessing readiness THEN the Audit SHALL evaluate whether the contract system divergence (three formats) is a blocker for schema formalization or can be resolved during schema design
4. WHEN the assessment is complete THEN the Audit SHALL produce a recommendation with one of four outcomes: proceed / align existing components first / add specific components first / defer
5. WHEN making the recommendation THEN the Audit SHALL provide a counter-argument articulating the case for the alternative path
6. WHEN Phase 6 is complete THEN the Audit SHALL request human checkpoint review

---

### Requirement 7: Contract System Design Brief

**User Story**: As a system architect, I want a short document capturing the full taxonomy, format convergence point, and outline of what a uniform contract system would look like, so that post-audit design work has a starting point.

#### Acceptance Criteria

1. WHEN producing the design brief THEN the Audit SHALL document the complete contract taxonomy discovered during the audit
2. WHEN producing the design brief THEN the Audit SHALL recommend a format convergence point (which of the existing formats to standardize on, or whether a new format is needed)
3. WHEN producing the design brief THEN the Audit SHALL outline the relationship between abstract contracts (standard library level) and component-specific contracts (component level) — whether the uniform system should be hierarchical or flat
4. WHEN producing the design brief THEN the Audit SHALL document how intentional exclusions should be represented in the uniform system
5. WHEN the design brief is complete THEN the Audit SHALL present it for human review — the design brief is a recommendation, not a decision

---

### Requirement 8: Domain Gap Flagging

**User Story**: As a project lead, I want test coverage gaps and contract alignment issues surfaced for the appropriate domain agents, so that follow-up work can be coordinated.

#### Acceptance Criteria

1. WHEN the audit identifies component behavioral contract test gaps THEN the Audit SHALL flag them for Lina (Stemma component specialist)
2. WHEN the audit identifies token compliance test gaps THEN the Audit SHALL flag them for Ada (Rosetta token specialist)
3. WHEN flagging domain gaps THEN the Audit SHALL categorize each gap by severity: Critical (blocks schema work), High (affects schema quality), Medium (should be addressed), Low (improvement opportunity)
4. WHEN the audit is complete THEN the Audit SHALL produce a domain gap summary organized by agent responsibility
