# MCP Coverage Enforcement: Automated Drift Detection

**Date**: 2026-03-09
**Updated**: 2026-03-20
**Purpose**: Detect when implemented components or families lack corresponding Application MCP coverage (family guidance YAML, experience patterns, component-meta.yaml)
**Organization**: spec-guide
**Scope**: 075-mcp-coverage-enforcement
**Status**: Design outline — decisions resolved, ready for formalization

---

## Problem Statement

The Application MCP serves family guidance, experience patterns, and component metadata. When new components or families are added to DesignerPunk, the corresponding MCP content must be created or updated — but nothing enforces this today. The only safeguard is a checklist in Component-Templates.md, which is advisory.

Spec 071 brought coverage from 3/8 to 8/8 production families. Without enforcement, the next component spec could silently regress that coverage. A product agent querying `get_prop_guidance` for a new family would get null with no indication that content is missing vs. intentionally absent.

---

## Current State

- 30 implemented components across 9 production families (including Progress Indicators and Navigation)
- 8 family guidance YAMLs indexed by FamilyGuidanceIndexer
- 3 experience patterns indexed
- FamilyGuidanceIndexer reports health (familiesIndexed, warnings) but doesn't compare against implemented families
- ComponentIndexer reports health (componentsIndexed) but doesn't cross-check guidance coverage
- No CI or test-time validation that implemented families have guidance

---

## Proposed Approach: Coverage Drift Test

A test that runs as part of `npm test` and fails when an implemented production family lacks a corresponding family guidance YAML.

### What it checks

1. **Family coverage**: Every production component family with implemented components must have a `family-guidance/<family>.yaml` that the FamilyGuidanceIndexer parses without warnings.
2. **Component coverage**: Every component referenced in a family guidance YAML's `selectionRules.recommend` must exist in the component catalog.
3. **Reverse coverage**: Every implemented production component must be reachable via `getGuidance(componentName)` — i.e., it appears in at least one family's selectionRules.

### What it does NOT check

- YAML content quality (that's D9 compliance — manual review)
- Experience pattern coverage (patterns are optional compositions, not 1:1 with components)
- Placeholder family coverage (no guidance required for unimplemented families)
- Enriched schema field presence (discouragedPatterns, composesWithFamilies are optional)

---

## Resolved Decisions

### D1: Production Family Source of Truth
**Resolution**: Option A — derive from the `readiness` field in each component's schema.yaml. The ComponentIndexer already parses this field and exposes it in the component catalog. A family is "production" if any of its components have `readiness: production-ready`. No separate registry needed.

### D2: Test Location
**Resolution**: Dedicated coverage test file in `component-mcp-server/src/indexer/__tests__/`. Colocated with the indexers it validates. Runs automatically when agents work on component or MCP changes.

### D3: Failure Mode
**Resolution**: Hard fail — test fails, blocks CI. The whole point is enforcement. Warnings get ignored.

### D4: Reverse Coverage Granularity
**Resolution**: Every production component must be reachable via `getGuidance(componentName)`. This uses the component→family map built from selectionRules, which is sufficient.

---

## Scope

- One test file in component-mcp-server
- No new MCP tools
- No schema changes (readiness field already exists and is indexed)
- No new steering docs

---

## Dependencies

| Spec | Relationship |
|------|-------------|
| 068 | FamilyGuidanceIndexer (the thing being validated) |
| 071 | Family guidance YAMLs (the content being validated) |

---

## Effort Estimate

Small. Single test file wiring together existing indexer APIs (ComponentIndexer for catalog/readiness, FamilyGuidanceIndexer for guidance coverage, getGuidance for reverse coverage).

---

## Reevaluation Triggers

- If a product agent reports a null pattern query for an implemented flow, consider adding experience pattern coverage checks.
- If layout templates (Spec 069) add a new content type to the Application MCP, extend coverage enforcement to include it.
