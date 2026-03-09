# MCP Coverage Enforcement: Automated Drift Detection

**Date**: 2026-03-09
**Purpose**: Detect when implemented components or families lack corresponding Application MCP coverage (family guidance YAML, experience patterns, component-meta.yaml)
**Organization**: spec-guide
**Scope**: 075-mcp-coverage-enforcement
**Status**: Design outline — pending review

---

## Problem Statement

The Application MCP serves family guidance, experience patterns, and component metadata. When new components or families are added to DesignerPunk, the corresponding MCP content must be created or updated — but nothing enforces this today. The only safeguard is a checklist in Component-Templates.md, which is advisory.

Spec 071 brought coverage from 3/8 to 8/8 production families. Without enforcement, the next component spec could silently regress that coverage. A product agent querying `get_prop_guidance` for a new family would get null with no indication that content is missing vs. intentionally absent.

---

## Current State

- 28 implemented components across 9 production families (including Progress Indicators)
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
3. **Reverse coverage**: Every implemented component must be reachable via `getGuidance(componentName)` — i.e., it appears in at least one family's selectionRules.

### What it does NOT check

- YAML content quality (that's D9 compliance — Ada's domain, manual review)
- Experience pattern coverage (patterns are optional compositions, not 1:1 with components)
- Placeholder family coverage (no guidance required for unimplemented families)
- Enriched schema field presence (discouragedPatterns, composesWithFamilies are optional)

### How it distinguishes production from placeholder

The test needs a source of truth for which families are production vs. placeholder. Options:

**Option A: Derive from component catalog.** If any component in a family has `readiness: production` in its component-meta.yaml, the family is production. No separate registry needed.

**Option B: Explicit registry.** A config file or constant listing production families. Must be manually maintained.

**Option C: Derive from Quick Reference.** Parse Component-Quick-Reference.md for 🟢 Production rows. Fragile — depends on markdown formatting.

**Recommendation**: Option A. The component-meta.yaml files already exist and are the source of truth for readiness. Deriving production families from them avoids a separate registry that can drift.

**Counter-argument for Option A**: component-meta.yaml doesn't have a `readiness` field today — it has `purpose`, `usage`, `contexts`, `alternatives`. The readiness status lives in Component-Readiness-Status.md. So Option A requires either adding a readiness field to component-meta.yaml or parsing the readiness doc. Option B (explicit list) is simpler and more honest about the manual step.

---

## Open Decisions

| ID | Decision | Options | Notes |
|----|----------|---------|-------|
| D1 | Production family source of truth | (A) Derive from component-meta, (B) Explicit registry, (C) Parse Quick Reference | See trade-offs above |
| D2 | Test location | (a) FamilyGuidanceIndexer test file, (b) Dedicated coverage test file, (c) ComponentIndexer health check | Dedicated file is cleanest |
| D3 | Failure mode | (a) Hard fail — test fails, blocks CI, (b) Warning — test passes with console warning | Hard fail is the point of enforcement |
| D4 | Reverse coverage granularity | (a) Every component must appear in selectionRules, (b) Every component must be reachable via getGuidance() | (b) is sufficient — getGuidance uses the component→family map built from selectionRules |

---

## Scope

- One test file
- No new MCP tools
- No schema changes
- No new steering docs
- Possibly one small data addition (production family list or readiness field, depending on D1)

---

## Dependencies

| Spec | Relationship |
|------|-------------|
| 068 | FamilyGuidanceIndexer (the thing being validated) |
| 071 | Family guidance YAMLs (the content being validated) |

---

## Effort Estimate

Small. This is a single test file that wires together existing indexer APIs. The hardest part is D1 — deciding where the production family list comes from.

---

## Reevaluation Triggers

- If component-meta.yaml gains a readiness field in a future spec, D1 should be revisited in favor of Option A.
- If experience patterns grow beyond 3, consider adding pattern coverage checks.
