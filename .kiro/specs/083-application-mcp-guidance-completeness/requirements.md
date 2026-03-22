# Requirements Document: Application MCP Guidance Completeness

**Date**: 2026-03-21
**Spec**: 083 - Application MCP Guidance Completeness
**Status**: Requirements Phase — R1 feedback incorporated
**Dependencies**: Spec 075 (CoverageDrift), Spec 082 (Family Naming + Registry), Spec 068 (FamilyGuidanceIndexer)

---

## Introduction

This spec matures the Application MCP's guidance layer across three pillars: governance enforcement (quality checks), content creation (experience patterns from design exercises), and signal generation (gap report for downstream specs). The governance pillar establishes `GuidanceCompleteness.test.ts` as the dedicated home for quality enforcement, migrating the component reachability check out of CoverageDrift and adding non-empty field validation. The content pillar seeds the experience pattern pipeline through Leonardo + Peter design exercises during the design phase. The signal pillar produces a structured gap report that informs Specs 069 and 081.

---

## Requirements

### Requirement 1: Guidance Quality Enforcement Test

**User Story**: As an AI agent authoring or maintaining family guidance, I want a dedicated quality enforcement test with actionable error messages, so that I can immediately understand what's wrong and how to fix it when guidance is insufficient.

#### Acceptance Criteria

1. WHEN a production-ready component is not reachable via `getGuidance(componentName)` THEN `GuidanceCompleteness.test.ts` SHALL fail with a message identifying the component and pointing to Component Development Guide § "Family Guidance Standards"
2. WHEN a family guidance YAML has an empty `whenToUse` array THEN `GuidanceCompleteness.test.ts` SHALL fail identifying the family and the missing field
3. WHEN a family guidance YAML has an empty `whenNotToUse` array THEN `GuidanceCompleteness.test.ts` SHALL fail identifying the family and the missing field
4. WHEN a family guidance YAML has an empty `accessibilityNotes` array THEN `GuidanceCompleteness.test.ts` SHALL fail identifying the family and the missing field
5. WHEN all production-ready components are reachable and all quality fields are non-empty THEN `GuidanceCompleteness.test.ts` SHALL pass

### Requirement 2: CoverageDrift Migration

**User Story**: As a governance maintainer, I want CoverageDrift to focus exclusively on existence enforcement, so that each test file has a single clear concern optimized for AI agent disambiguation.

#### Acceptance Criteria

1. WHEN `CoverageDrift.test.ts` runs THEN it SHALL check that every production family has a guidance YAML (existence)
2. WHEN `CoverageDrift.test.ts` runs THEN it SHALL check that every component referenced in guidance exists in the catalog (phantom detection)
3. WHEN `CoverageDrift.test.ts` runs THEN it SHALL NOT check component reachability via `getGuidance()` (migrated to GuidanceCompleteness)

#### Migration Validation (task-level checklist, not runtime assertion)

During implementation, the implementer SHALL:
1. List the 3 CoverageDrift assertions before migration
2. Map each to its post-migration home (CoverageDrift or GuidanceCompleteness)
3. Verify no assertion was dropped — combined coverage equals pre-migration coverage

### Requirement 3: Family Guidance Standards Documentation

**User Story**: As an AI agent creating a new family guidance YAML, I want documented quality standards with clear minimum requirements, so that I produce guidance that is useful to product agents from day one.

#### Acceptance Criteria

1. WHEN an agent reads Component Development Guide § "Family Guidance Standards" THEN it SHALL find the minimum quality bar: component reachability, non-empty `whenToUse`, non-empty `whenNotToUse`, non-empty `accessibilityNotes`, `displayName` presence
2. WHEN a `GuidanceCompleteness.test.ts` failure message references the Component Development Guide THEN the referenced section SHALL exist and contain resolution guidance
3. WHEN the section is read THEN it SHALL explain the rationale for each standard (not just the rule)

**Placement note**: The "Family Guidance Standards" section should be adjacent to but distinct from the "Family Naming Convention" section added by Spec 082. Naming convention covers identity; guidance standards cover content quality.

### Requirement 4: Experience Pattern Seeding via Design Exercises

**User Story**: As a product design agent (Leonardo), I want to run design exercises against real screen problems using Application MCP tools, so that the experience pattern library is grounded in actual component selection reasoning rather than speculation.

#### Acceptance Criteria

1. WHEN design exercises are conducted THEN Leonardo and Peter SHALL work through at least 3 practice screens
2. WHEN screens are selected THEN the selection rationale SHALL document which production families each screen exercises and confirm that at least 5 of 7 production families are exercised across the full set
3. WHEN an exercise produces a component arrangement that represents a generalizable UI pattern THEN it SHALL be formalized as an experience pattern in the existing format
4. WHEN an exercise references a development-readiness component THEN the resulting pattern SHALL include a readiness caveat noting which components must ship before the pattern is fully validatable
5. WHEN an experience pattern is produced THEN it SHALL be tagged with a provisional classification: `general`, `product-specific`, or `uncertain`
6. WHEN exercises surface token needs THEN Leonardo SHALL route them to Ada via the gap report with sufficient context for assessment
7. WHEN design exercises are conducted THEN the design document SHALL capture the component selection reasoning for each screen, including MCP queries attempted, trade-offs considered, and where guidance helped or fell short

### Requirement 5: Application MCP Gap Report

**User Story**: As a governance agent (Thurgood) planning downstream specs, I want a structured gap report from the design exercises with a classification gate, so that only universal gaps proceed to system changes and product-specific findings stay in product documentation.

#### Acceptance Criteria

1. WHEN design exercises are complete THEN a gap report SHALL exist at `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`
2. WHEN a gap is recorded THEN the entry SHALL include: description, what was tried, what happened, classification (missing component / missing pattern / missing guidance / search/discovery gap / token gap), provisional scope (Leonardo's tag), final scope (Peter's classification), and downstream target
3. WHEN downstream specs (069, 081) reference the gap report THEN the report SHALL be discoverable at its documented location
4. WHEN a gap has no final scope from Peter THEN it SHALL NOT proceed to a downstream spec
5. WHEN a gap is classified as `product-specific` THEN it SHALL NOT enter the Application MCP

---

## Documentation Requirements

### Documentation Waiver: Component/Token Documentation

This spec does not introduce new components or tokens. The governance test and Component Development Guide section are the documentation deliverables themselves. No additional component README, API documentation, or token documentation is required.

**Waiver rationale**: The spec's deliverables *are* documentation and governance infrastructure. The Component Development Guide section (Req 3) and the gap report (Req 5) serve as the documentation artifacts.
