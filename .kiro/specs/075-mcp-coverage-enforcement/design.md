# Design Document: MCP Coverage Enforcement

**Date**: 2026-03-20
**Spec**: 075 - MCP Coverage Enforcement
**Status**: Design Phase
**Dependencies**: Spec 068 (Family Guidance Indexer), Spec 071 (Family Guidance YAMLs)

---

## Overview

A single test file that wires together existing ComponentIndexer and FamilyGuidanceIndexer APIs to enforce that production families and components have Application MCP coverage. No new MCP tools, no schema changes, no new steering docs.

---

## Architecture

The test instantiates the ComponentIndexer (which internally creates the FamilyGuidanceIndexer), then cross-references the catalog against guidance coverage:

```
ComponentIndexer.getCatalog()
    → filter by readiness: "production-ready"
    → extract unique families
    → for each family: verify getGuidance(family) returns non-null
    → for each production component: verify getGuidance(componentName) returns non-null

FamilyGuidanceIndexer (via ComponentIndexer)
    → for each guidance YAML's selectionRules.recommend
    → verify referenced components exist in catalog
```

### Data Flow

1. **Production family derivation**: `getCatalog()` returns all components with `readiness` field. Filter to `production-ready`, skip entries with empty/missing `family` field (defensive), extract unique `family` values. This is the set of families that must have guidance.
2. **Family coverage check**: For each production family, call `getGuidance(familyName)`. Null = missing guidance = test failure.
3. **Component-to-guidance check**: For each guidance YAML, iterate `selectionRules` and verify every `recommend` component name exists in the catalog. Error messages should be diagnostic enough to distinguish missing components from name/casing mismatches.
4. **Reverse coverage check**: For each production component, call `getGuidance(componentName)`. Null = unreachable component = test failure. Error messages must distinguish between "family has no guidance YAML" and "component not listed in family's selectionRules" — these are different problems with different fixes.

---

## Components and Interfaces

### Existing APIs Used (No Changes)

| API | Source | Purpose |
|-----|--------|---------|
| `ComponentIndexer.getCatalog()` | ComponentIndexer.ts | Get all components with family and readiness |
| `ComponentIndexer.getGuidance(name)` | ComponentIndexer.ts (delegates to FamilyGuidanceIndexer) | Check guidance exists for family or component |
| `FamilyGuidanceIndexer.getHealth()` | FamilyGuidanceIndexer.ts | Verify no indexing warnings |

### New File

| File | Purpose |
|------|---------|
| `component-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts` | Coverage enforcement test |

---

## Testing Strategy

The deliverable *is* a test. The test validates itself by:
- Passing when all production families have guidance (current state: 8/8)
- Failing when a production family is added without guidance (verified by temporarily removing a guidance YAML during development)

---

## Design Decisions

### Decision 1: Derive Production Families from Schema Readiness

**Options**: (A) Derive from schema `readiness` field, (B) Explicit registry, (C) Parse markdown
**Choice**: A
**Rationale**: The `readiness` field already exists in schema.yaml and is already parsed by ComponentIndexer. No manual registry to maintain, no markdown parsing fragility. When a new component ships with `readiness: production-ready`, it automatically enters the enforcement scope.

### Decision 2: Test Location in Component MCP Server

**Options**: (a) FamilyGuidanceIndexer test file, (b) Dedicated test file, (c) ComponentIndexer health check
**Choice**: B — dedicated `CoverageDrift.test.ts`
**Rationale**: Coverage enforcement is its own concern, distinct from indexer unit tests. Dedicated file makes the purpose clear and keeps indexer tests focused on their own behavior.

### Decision 3: Hard Fail Over Warning

**Options**: (a) Hard fail, (b) Warning
**Choice**: A
**Rationale**: The entire purpose of enforcement is to prevent silent regression. Warnings get ignored. If a production family lacks guidance, that's a real gap that product agents will hit.

---

**Organization**: spec-completion
**Scope**: 075-mcp-coverage-enforcement
