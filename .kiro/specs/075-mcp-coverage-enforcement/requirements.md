# Requirements Document: MCP Coverage Enforcement

**Date**: 2026-03-20
**Spec**: 075 - MCP Coverage Enforcement
**Status**: Requirements Phase
**Dependencies**: Spec 068 (Family Guidance Indexer), Spec 071 (Family Guidance YAMLs)

---

## Introduction

The Application MCP serves family guidance, experience patterns, and component metadata. When new components or families are added to DesignerPunk, the corresponding MCP content must be created — but nothing enforces this today. This spec adds automated drift detection that fails at test time when production families or components lack Application MCP coverage.

---

## Requirements

### Requirement 1: Family Coverage Enforcement

**User Story**: As a design system maintainer, I want the test suite to fail when a production family lacks family guidance, so that Application MCP coverage cannot silently regress.

#### Acceptance Criteria

1. WHEN a component family has at least one component with `readiness: production-ready` in its schema.yaml THEN the test SHALL verify that a corresponding family guidance YAML exists and is indexed without warnings
2. WHEN a production family lacks a family guidance YAML THEN the test SHALL fail with a message identifying the missing family
3. WHEN a family has no components with `readiness: production-ready` THEN the test SHALL NOT require family guidance for that family

### Requirement 2: Component-to-Guidance Coverage

**User Story**: As a design system maintainer, I want every component referenced in family guidance to exist in the catalog, so that guidance doesn't reference phantom components.

#### Acceptance Criteria

1. WHEN a family guidance YAML references a component in `selectionRules.recommend` THEN that component SHALL exist in the component catalog
2. WHEN a guidance YAML references a non-existent component THEN the test SHALL fail with a diagnostic message distinguishing "component doesn't exist" from potential name/casing mismatches

### Requirement 3: Reverse Coverage (Component Reachability)

**User Story**: As a design system maintainer, I want every production component to be reachable via `getGuidance()`, so that product agents can always find selection guidance for any production component.

#### Acceptance Criteria

1. WHEN a component has `readiness: production-ready` THEN `getGuidance(componentName)` SHALL return non-null
2. WHEN a production component is not reachable via `getGuidance()` THEN the test SHALL fail with a message identifying the unreachable component and distinguishing whether the component's family lacks guidance entirely or the component is missing from the family's selectionRules
3. WHEN a production component has an empty or missing `family` field in its schema THEN the test SHALL skip that component (defensive — not expected in current schemas)

### Requirement 4: Test Integration

**User Story**: As a design system maintainer, I want coverage enforcement to run as part of the standard test suite, so that drift is caught automatically without extra steps.

#### Acceptance Criteria

1. WHEN `npm test` is run THEN the coverage drift test SHALL execute as part of the component-mcp-server test suite
2. WHEN any coverage check fails THEN the test SHALL hard-fail (not warn), blocking CI

---

**Organization**: spec-completion
**Scope**: 075-mcp-coverage-enforcement
