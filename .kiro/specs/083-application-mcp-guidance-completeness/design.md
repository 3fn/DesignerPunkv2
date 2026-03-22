# Design Document: Application MCP Guidance Completeness

**Date**: 2026-03-21
**Spec**: 083 - Application MCP Guidance Completeness
**Status**: Design Phase
**Dependencies**: Spec 075 (CoverageDrift), Spec 082 (Family Naming + Registry), Spec 068 (FamilyGuidanceIndexer)

---

## Overview

This design covers two of the three pillars: governance (Pillar 1) and signal infrastructure (Pillar 3). The content pillar (Pillar 2 — design exercises) will be executed as a separate design session between Leonardo and Peter, with output captured in a companion design-exercises document. This document provides the architectural decisions and implementation details for the governance test, CoverageDrift migration, Component Dev Guide section, and gap report structure.

---

## Architecture

### Test File Separation

```
application-mcp-server/src/indexer/__tests__/
├── CoverageDrift.test.ts          ← Existence enforcement (Spec 075)
├── FamilyNameValidation.test.ts   ← Name governance (Spec 082)
└── GuidanceCompleteness.test.ts   ← Quality enforcement (Spec 083) ← NEW
```

Each file answers one question:
- CoverageDrift: "Does every production family have guidance?"
- FamilyNameValidation: "Are all family names canonical?"
- GuidanceCompleteness: "Is the guidance sufficient for every production component?"

### Data Flow

```
ComponentIndexer.getCatalog()
    ↓
Filter to production-ready components
    ↓
For each component: indexer.getGuidance(name) → reachability check
    ↓
For each family with guidance: check non-empty whenToUse, whenNotToUse, accessibilityNotes
    ↓
On failure: actionable message → Component Dev Guide § "Family Guidance Standards"
```

GuidanceCompleteness uses the same `ComponentIndexer` instance and `getGuidance()` API as CoverageDrift. No new infrastructure needed — it's a new test file consuming existing APIs.

---

## Components and Interfaces

### GuidanceCompleteness.test.ts

Three test cases in one describe block:

**Test 1: "every production component is reachable via guidance"**
- Migrated from CoverageDrift's third assertion
- Reads catalog, filters to `readiness === 'production-ready'`
- Calls `getGuidance(component.name)` for each
- On failure: `"Component \"X\" is production-ready but not reachable via any family guidance selectionRule.\nSee Component Development Guide § \"Family Guidance Standards\" for requirements."`

**Test 2: "every family guidance has non-empty quality fields"**
- Iterates all families via `getAllFamilies()`
- For each family, gets guidance via `getGuidance(family)`
- Asserts `whenToUse.length > 0`, `whenNotToUse.length > 0`, `accessibilityNotes.length > 0`
- On failure: `"Family \"X\" has empty or missing whenToUse. See Component Development Guide § \"Family Guidance Standards\" for requirements."`

**Test 3: not needed** — `displayName` presence is already enforced by `FamilyNameValidation.test.ts` (Spec 082) and the `FamilyGuidanceIndexer` fallback. No duplication.

### CoverageDrift.test.ts — Post-Migration

Two test cases remain (third removed):

1. "every production family has family guidance" — unchanged
2. "every component referenced in guidance exists in the catalog" — unchanged
3. ~~"every production component is reachable via getGuidance()"~~ — migrated to GuidanceCompleteness

### Component Development Guide — "Family Guidance Standards" Section

Placed immediately after "Family Naming Convention" (line ~375, before "Component Attribute Standards"). Content:

- Minimum quality bar (component reachability, non-empty fields)
- Rationale for each standard
- Reference to `GuidanceCompleteness.test.ts` (`application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`) as the enforcement mechanism
- Note that this section is the resolution path for test failures

---

## Data Models

No new data models. GuidanceCompleteness consumes existing interfaces:
- `ComponentIndexer.getCatalog()` → `ComponentSummary[]`
- `ComponentIndexer.getGuidance(name)` → `FamilyGuidance | null`
- `FamilyGuidance.whenToUse: string[]`
- `FamilyGuidance.whenNotToUse: string[]`
- `FamilyGuidance.accessibilityNotes: string[]`

---

## Error Handling

All test failures produce actionable messages with two components:
1. **What's wrong**: identifies the specific component or family and the specific field
2. **How to fix it**: points to Component Development Guide § "Family Guidance Standards"

Pattern established by `FamilyNameValidation.test.ts` (Spec 082) which prints valid family names on failure.

---

## Testing Strategy

### GuidanceCompleteness.test.ts validates itself against current state

All 7 production families currently pass all quality checks (confirmed during design outline review — Avatar and Icon both have 3 `whenToUse` entries, all families have non-empty `whenNotToUse` and `accessibilityNotes`). The test should pass on first run with no guidance changes needed.

### Migration validation

Per Req 2, the implementer verifies migration completeness via checklist:

| Pre-migration CoverageDrift assertion | Post-migration home |
|---------------------------------------|---------------------|
| "every production family has family guidance" | CoverageDrift (stays) |
| "every component referenced in guidance exists in the catalog" | CoverageDrift (stays) |
| "every production component is reachable via getGuidance()" | GuidanceCompleteness (migrated) |

### Full suite validation

`npm test` must pass after migration — 306+ suites, 7,965+ tests. The migration is a test reorganization, not a behavior change.

---

## Design Decisions

### Decision 1: Three Tests, Not Four

**Options Considered**: (a) One test per quality field (4 tests: reachability, whenToUse, whenNotToUse, accessibilityNotes), (b) Two tests (reachability + combined quality fields)
**Decision**: Two tests — reachability is the migrated assertion (distinct lineage), quality fields are a single new concern.
**Rationale**: Reachability has a different failure mode (component missing from selectionRules) than field emptiness (author forgot to fill in a field). Two tests, two failure categories. Four tests would over-fragment — all three field checks have the same root cause (incomplete authoring) and the same resolution path.
**Trade-offs**: If a future quality check has a genuinely different failure mode, it may warrant a third test. But for now, two is sufficient.

### Decision 2: Non-Empty, Not Minimum Count

**Options Considered**: (a) Enforce minimum counts (whenToUse ≥ 2, etc.), (b) Enforce non-empty only, (c) No enforcement (documentation only)
**Decision**: Non-empty only.
**Rationale**: Count-based enforcement is theater — `whenNotToUse: ["Don't"]` passes a count check but is useless. Non-empty catches the real failure mode (author forgot or left it as `[]`). Quality beyond presence requires human judgment, not automated counting. Three-agent consensus from design outline review.
**Trade-offs**: A guidance YAML with `whenToUse: ["Use this"]` passes. That's a quality problem no automated test can solve — the Component Dev Guide standards section addresses it through author guidance.

### Decision 3: Design Exercises as Companion Document

**Options Considered**: (a) Exercises in this design document, (b) Exercises as a separate companion document, (c) Exercises captured only in tasks
**Decision**: Separate companion document (`design-exercises.md`) created during Leonardo + Peter sessions.
**Rationale**: This design document covers governance architecture — implementation details, data flow, test structure. The exercises are a fundamentally different kind of artifact: live design reasoning, MCP query traces, component selection trade-offs. Mixing them would make this document serve two audiences (implementer and design reviewer) poorly. The companion document captures the exercise output per Req 4 AC7 (design reasoning, MCP queries attempted, trade-offs, where guidance helped or fell short).
**Trade-offs**: Two design-phase documents instead of one. But the audiences and content types are different enough to justify separation.

### Decision 4: Gap Report in docs/ Not .kiro/

**Options Considered**: (a) `.kiro/specs/083-*/gap-report.md` (internal), (b) `docs/specs/083-*/gap-report.md` (public)
**Decision**: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`
**Rationale**: The gap report's primary consumers are downstream specs (069, 081). Those specs' authors need to find it. `docs/` is the discoverable location for cross-spec reference material. `.kiro/` is filtered from some tooling and is intended for internal process artifacts.
**Trade-offs**: Gap report is visible in the public docs directory. That's fine — it's useful context for anyone understanding the Application MCP's evolution.

---

## Design Exercises (Pillar 2)

The design exercises are not covered in this document. They will be conducted as Leonardo + Peter sessions and captured in:

```
.kiro/specs/083-application-mcp-guidance-completeness/design-exercises.md
```

That document will contain:
- Screen selection rationale (which families each screen exercises, confirming 5+ of 7 covered)
- Per-screen component selection reasoning (MCP queries, trade-offs, discoveries)
- Experience patterns extracted (in existing format, with readiness caveats and provisional classification)
- Gap findings (raw discoveries feeding into the formal gap report)

**Relationship between exercise findings and gap report**: Raw gap findings live in `design-exercises.md` as they're discovered during sessions. Formalized gap entries live in the gap report (`docs/specs/083-*/gap-report.md`) with structured classification and downstream targets. The exercises doc is the source; the gap report is the structured output for downstream spec consumption.

**Note**: Do not pre-template `design-exercises.md`. Create it at the start of the first exercise session and let the structure emerge from the design reasoning. Fitting exercises to a template would constrain the signal.

The tasks document will reference both this design document (for governance implementation) and the design-exercises document (for pattern formalization and gap report creation).

---

## Gap Report Structure

Location: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`

```markdown
# Application MCP Gap Report — Spec 083

**Date**: [exercise completion date]
**Source**: Design exercises conducted during Spec 083
**Purpose**: Structured findings for downstream specs (069, 081) and system agents
**Classification gate**: All gaps require Peter's classification before proceeding to downstream specs

---

## Gaps

### [Gap Title]

**Description**: What was needed
**What was tried**: MCP query or tool used
**What happened**: Result or lack thereof
**Classification**: missing component | missing pattern | missing guidance | search/discovery gap | token gap
**Provisional scope**: general | product-specific | uncertain (Leonardo's initial tag)
**Final scope**: [Populated by Peter during classification gate review]
**Downstream target**: Spec or agent that should address this (populated only for universal gaps after classification)

---
```

Each gap is a discrete entry. Classification enables filtering by downstream spec. The `provisional scope` is Leonardo's first-pass tag from the exercises. The `final scope` is Peter's classification gate decision — gaps without a final scope do not proceed to downstream specs.

**Classification categories for `final scope`:**
- `universal` → proceeds to downstream spec
- `structurally-universal` → structural part proceeds, semantic part stays in product docs
- `product-specific` → does NOT enter Application MCP; goes to product documentation
- `deferred` → needs more signal from a second product before classification
