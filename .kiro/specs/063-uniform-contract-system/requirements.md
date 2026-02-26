# Requirements Document: Uniform Contract System

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Status**: Requirements Phase
**Dependencies**: 062 - Stemma Catalog Readiness Audit (complete)

---

## Introduction

This spec defines the design and migration of a uniform behavioral contract system for all 28 Stemma components. The 062 audit found 4 incompatible contract documentation formats, a disconnected standard library, naming inconsistencies, and 8 components without machine-parseable contract sources. This blocks schema formalization for the agentic UI pipeline.

The readiness recommendation from 062 was: align the contract system first, then proceed with schema formalization. This spec is that alignment work.

The uniform system converges all components to a single contracts.yaml format with canonical vocabulary, a 10-category taxonomy, explicit exclusions, and formalized inheritance. It does not build the component metadata schema (downstream spec 064) or write new behavioral tests.

---

## Requirements

### Requirement 1: Canonical Contract Format

**User Story**: As an AI agent, I want every component's behavioral contracts in a single, predictable YAML format, so that I can read and write contract definitions without handling multiple formats.

#### Acceptance Criteria

1. WHEN the migration is complete THEN every component in `src/components/core/` SHALL have a `contracts.yaml` file in the canonical format
2. WHEN a contracts.yaml file exists THEN it SHALL include header fields: `version`, `component`, `family`
3. WHEN a contracts.yaml file exists THEN each contract entry SHALL include fields: `category`, `description`, `behavior`, `wcag`, `platforms`, `validation`, `test_approach`, `required`
4. WHEN a component has contracts defined in its schema YAML THEN those inline contract definitions SHALL be extracted to contracts.yaml and removed from the schema YAML
5. WHEN a component has contracts documented only in its README THEN those contracts SHALL be formalized into contracts.yaml with all required fields
6. WHEN a component has no documented contracts (Avatar, Button-Icon) THEN contracts SHALL be defined from implementation analysis and documented in contracts.yaml

---

### Requirement 2: Canonical Vocabulary

**User Story**: As an AI agent, I want every behavioral concept to have exactly one name following a predictable pattern, so that I can construct and parse contract names without ambiguity.

#### Acceptance Criteria

1. WHEN naming contracts THEN all contract names SHALL follow the `{category}_{concept}` pattern in snake_case
2. WHEN naming contracts THEN no contract name SHALL use `supports_`, `provides_`, or other directional prefixes
3. WHEN the migration is complete THEN zero naming inconsistencies SHALL exist across the catalog (e.g., no `hover_state` alongside `interaction_hover`)
4. WHEN a contract name's category prefix and its `category:` field disagree THEN this SHALL be flagged as a validation error
5. WHEN a contract could fit multiple categories THEN it SHALL be assigned to the category that best reflects its purpose for the end user

---

### Requirement 3: Contract Taxonomy

**User Story**: As a system maintainer, I want behavioral contracts organized into purpose-oriented categories with clear definitions, so that I can audit coverage and classify new contracts consistently.

#### Acceptance Criteria

1. WHEN the taxonomy is finalized THEN it SHALL contain exactly 10 categories: `layout`, `interaction`, `state`, `validation`, `accessibility`, `composition`, `content`, `animation`, `visual`, `performance`
2. WHEN the taxonomy is documented THEN each category SHALL have a one-sentence purpose-oriented definition
3. WHEN classifying contracts THEN the boundary between `animation` and `interaction` SHALL be determined by primary purpose: user input response is `interaction`, motion behavior description is `animation`
4. WHEN classifying contracts THEN the boundary between `content` and `composition` SHALL be determined by subject: data display is `content`, component assembly is `composition`
5. WHEN a new contract is created THEN the classification tiebreaker rule SHALL apply: assign to the category that best reflects the contract's purpose for the end user

---

### Requirement 4: Intentional Exclusion Representation

**User Story**: As an AI agent, I want to distinguish between "this component doesn't support X by design" and "this component doesn't support X because nobody documented it yet," so that I can make informed decisions about component capabilities.

#### Acceptance Criteria

1. WHEN a component intentionally does not support a behavioral contract THEN it SHALL be documented in an `excludes:` block in contracts.yaml
2. WHEN an exclusion is documented THEN it SHALL include three fields: `reason`, `category`, `reference`
3. WHEN a behavioral contract is absent from both `contracts:` and `excludes:` THEN it SHALL be interpreted as not applicable or not yet addressed
4. WHEN the migration is complete THEN all intentional exclusions identified in the 062 audit SHALL be captured in `excludes:` blocks

---

### Requirement 5: Inheritance Formalization

**User Story**: As an AI agent, I want inheritance relationships formally declared so that I can resolve a child component's full contract set by reading the parent, without relying on prose documentation.

#### Acceptance Criteria

1. WHEN a child component inherits from a parent THEN it SHALL declare `inherits: ParentComponent` in its contracts.yaml
2. WHEN a child component declares inheritance THEN it SHALL list only its own extended contracts, not inherited ones
3. WHEN a "conceptual" inheritance relationship exists (prose-only, no formal declaration) THEN it SHALL be either formalized with `inherits:` or dropped during migration
4. WHEN Input-Checkbox-Legal's relationship to Input-Checkbox-Base is formalized THEN it SHALL use `inherits:` (confirmed real inheritance)
5. WHEN Input-Radio-Set's relationship to Input-Radio-Base is formalized THEN it SHALL use `composes:` in schema YAML, not `inherits:` (confirmed composition, not inheritance)

---

### Requirement 6: Composition Representation

**User Story**: As an AI agent, I want composition relationships documented in a structured format, so that I can determine what child components a parent contains or orchestrates.

#### Acceptance Criteria

1. WHEN a component composes other components THEN it SHALL declare a `composes:` block in its schema YAML (not contracts.yaml)
2. WHEN a composition relationship is declared THEN it SHALL include `component` (child name) and `relationship` (required-child, optional-child, orchestrates)
3. WHEN the migration is complete THEN all composition relationships identified in the 062 audit SHALL be formalized: Progress-Stepper-Base (Node + Connector), Container-Card-Base (Container-Base), Button-VerticalList-Set (Button-VerticalList-Item), Input-Radio-Set (Input-Radio-Base)

---

### Requirement 7: Canonical Name Mapping

**User Story**: As a migration executor, I want a complete mapping from all 108 existing contract names to their canonical names before migration begins, so that ambiguities are resolved upfront rather than mid-migration.

#### Acceptance Criteria

1. WHEN migration planning begins THEN a complete mapping from all 108 discovered contract names to canonical `{category}_{concept}` names SHALL be produced
2. WHEN the mapping is produced THEN it SHALL be reviewed for ambiguous categorizations before any component files are modified
3. WHEN the mapping contains edge cases THEN the classification tiebreaker rule SHALL be applied and the reasoning documented as precedent

---

### Requirement 8: Standard Library Disposition

**User Story**: As a system maintainer, I want the disconnected standard contracts library either updated or deprecated, so that governance documentation reflects reality.

#### Acceptance Criteria

1. WHEN the migration is complete THEN Component-Schema-Format.md SHALL have a deprecation note pointing to the uniform contract system as the replacement
2. WHEN the deprecation is applied THEN it SHALL follow the ballot measure process (propose → present with counter-argument → vote → apply)

---

### Requirement 9: Governance Updates

**User Story**: As a system maintainer, I want the stale family list and Avatar misalignment corrected, so that governance documentation matches the actual catalog.

#### Acceptance Criteria

1. WHEN governance updates are applied THEN stemma-system-principles.md SHALL reflect the actual family count (13+, not 11) including Chip and Progress-Indicator
2. WHEN governance updates are applied THEN Avatar's naming and status SHALL be reconciled (either renamed to Avatar-Base or documented as an exception)
3. WHEN governance updates are applied THEN they SHALL follow the ballot measure process

---

### Requirement 10: Migration Validation

**User Story**: As a project lead, I want the completed migration validated by audit, so that I have confidence the uniform system is consistent and complete before downstream schema work begins.

#### Acceptance Criteria

1. WHEN migration is complete THEN Thurgood SHALL validate that all 28 components have contracts.yaml in the canonical format
2. WHEN migration is complete THEN Thurgood SHALL validate zero naming inconsistencies exist
3. WHEN migration is complete THEN Thurgood SHALL validate all inheritance relationships are formally declared
4. WHEN migration is complete THEN Thurgood SHALL validate all intentional exclusions are captured in `excludes:` blocks
5. WHEN migration is complete THEN Thurgood SHALL validate the standard library deprecation is applied
6. WHEN migration is complete THEN Thurgood SHALL validate governance docs are updated
7. WHEN validation passes THEN downstream schema work (spec 064) SHALL be unblocked
