# Application MCP Guidance Completeness

**Date**: 2026-03-21
**Purpose**: Ensure family guidance YAMLs provide complete, quality-validated coverage for all production components, seed the experience pattern pipeline through design exercises, and establish governance to maintain coverage as families grow
**Organization**: spec-guide
**Scope**: 083-application-mcp-guidance-completeness
**Status**: Design outline — R1 feedback incorporated

---

## Problem Statement

Spec 075 (CoverageDrift) enforces that every production family has a guidance YAML. Spec 082 enforces that family names are canonical. But neither checks whether the guidance is *complete* or *quality-sufficient* within each family. And the Application MCP's experience pattern library (3 patterns) has never been stress-tested against real design problems.

### Current State

7 families with production-ready components, all with guidance YAMLs:

| Family | Production Components | selectionRules | Coverage |
|--------|----------------------|----------------|----------|
| Avatar | 1 | 1 | ✅ Minimal but complete |
| Badge | 3 | 4 | ✅ Complete |
| Button | 4 | 11 | ✅ Complete |
| Chip | 3 | 4 | ✅ Complete |
| Container | 1 (Container-Base only — Card-Base is `development`) | 9 | ✅ Complete |
| FormInput | 8 | 13 | ✅ Complete |
| Icon | 1 | 1 | ✅ Minimal but complete |

All 7 families meet the proposed quality standards today (Avatar and Icon both have 3 `whenToUse` entries — confirmed by Lina during R1 review).

2 families with guidance but no production components yet:
- **Navigation**: 2 components at `development` readiness, guidance exists
- **ProgressIndicator**: 6 components at `development` readiness, guidance exists

3 experience patterns exist: `simple-form`, `settings`, `onboarding`. None were derived from real design exercises — they were authored speculatively.

### The Gaps

1. **No dedicated quality enforcement**: CoverageDrift checks family-level existence and component reachability, but its file name and intent are about *coverage drift* — whether infrastructure exists. Quality enforcement (is the guidance *sufficient*?) has no home. The component reachability check in CoverageDrift is a quality concern living in an existence-enforcement file — a semantic mismatch that costs agents an extra disambiguation step on every failure.

2. **No guidance quality baseline**: A guidance YAML with one selectionRule and empty `whenNotToUse` technically passes all current tests. There's no minimum bar for what constitutes useful guidance.

3. **No documentation of what "good guidance" looks like**: When a new family goes production, the author has no reference for how thorough the guidance should be.

4. **Experience patterns untested against real design problems**: The 3 existing patterns were authored without Leonardo actually using them to spec screens. We don't know if they're sufficient, if the format works, or what's missing.

---

## Proposed Approach

### Three Pillars

This spec has three pillars that reinforce each other:

1. **Governance** — dedicated quality enforcement (`GuidanceCompleteness.test.ts`) with actionable error messages pointing to quality documentation
2. **Content** — design exercises that seed the experience pattern pipeline with real patterns derived from real design reasoning
3. **Signal** — gap report from the exercises that informs future specs (069, new family guidance, etc.)

### 1. Guidance Quality Enforcement (`GuidanceCompleteness.test.ts`)

A dedicated test file that enforces guidance *quality* — distinct from CoverageDrift which enforces guidance *existence*. This separation optimizes for AI agent disambiguation: file names are the first token of context an agent processes on test failure.

| File | Concern | Question |
|------|---------|----------|
| `CoverageDrift.test.ts` | Existence | Does every production family have a guidance YAML? |
| `GuidanceCompleteness.test.ts` | Quality | Is the guidance sufficient for every production component? |

**Migration**: The component reachability assertion currently in CoverageDrift moves to GuidanceCompleteness. CoverageDrift retains only family-level existence checks. This eliminates duplication and gives each file a single, clear concern.

**Quality checks**:
- Every production-ready component is reachable via `getGuidance(componentName)` (migrated from CoverageDrift)
- `whenToUse` is non-empty for every family with guidance
- `whenNotToUse` is non-empty for every family with guidance
- `accessibilityNotes` is non-empty for families with interactive components

**Enforcement level**: Non-empty presence checks, not count-based. `whenNotToUse: ["Don't use this when you shouldn't"]` passes a non-empty check but is useless — that's a quality problem no automated test can solve. Non-empty catches the real failure mode: author forgot the field or left it as `[]`.

**On failure**, error messages point to the resolution path:

```
Component "Input-Text-Email" is production-ready but not reachable via any family guidance selectionRule.
See Component Development Guide § "Family Guidance Standards" for requirements.
```

### 2. Family Guidance Standards (Component Development Guide)

Add a "Family Guidance Standards" section documenting the quality bar. This is the resolution path that the completeness test points to:

- Every production component must appear in at least one selectionRule
- `whenToUse` must be non-empty (what problem does this family solve?)
- `whenNotToUse` must be non-empty (what's the common misuse?)
- `accessibilityNotes` must be non-empty if the family has interactive components
- `displayName` must be present (or fall back to registry — already enforced by Spec 082)

### 3. Experience Pattern Seeding via Design Exercises

Leonardo and Peter run design exercises on 3 practice screens during the **design phase** of this spec. The design document *is* the exercise output — it captures the component selection reasoning, the patterns that emerged, and the gaps discovered.

**Why the design phase, not tasks**: Experience patterns encode *what components to assemble and in what arrangement* — design decisions, not code decisions. The valuable signal comes from the design conversation between Leonardo and Peter. The design document captures the *why* (reasoning, trade-offs, discoveries). The tasks formalize the *what* (create pattern X, update guidance Y, file gap report Z).

**Screen selection principle**: Maximize family coverage diversity across the 7 production families (Avatar, Badge, Button, Chip, Container, FormInput, Icon). Screens should exercise different component families — not all form-heavy, not all list-based. Leonardo proposes specific screen concepts when exercises begin; the principle governs selection.

**Component readiness constraint**: Exercises may reference development-readiness components (Navigation, ProgressIndicator) when the design naturally calls for them. Patterns that include non-production components are tagged with a readiness caveat noting which components must ship before the pattern is fully validatable by `validate_assembly`. Real design doesn't stop at the production boundary.

**Provisional pattern classification**: Each exercise-produced pattern is tagged with a provisional scope: `general` (DesignerPunk-wide), `product-specific`, or `uncertain`. This gives the Lessons Synthesis Review something to work with rather than starting classification from scratch. It's a signal, not a binding decision.

**Output**:
- New experience patterns formalized in existing format (if the format is insufficient, that's a gap report finding, not a mid-exercise format change)
- Application MCP gap report (see below)
- Input for future specs: 069 (layout templates), new family guidance, potential format evolution

**Token gap routing**: When exercises surface token needs (e.g., a spacing token that doesn't exist for a particular composition), Leonardo routes those to Ada via the gap report with enough context for her to assess.

**This is the first iteration of a continuous process.** Every future product screen is a potential experience pattern source. This spec seeds the pipeline; it doesn't complete the pattern library. Product-specific patterns that aren't generalizable to DesignerPunk will eventually live in the Product MCP (Spec 081).

### 4. Application MCP Gap Report

A dedicated file capturing where the Application MCP fell short during design exercises:

**Location**: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`

**Entry format**:
- Description of what was needed
- What was tried (MCP query, tool used)
- What happened (result or lack thereof)
- Classification: missing component / missing pattern / missing guidance / unexpected result / token gap
- Downstream target: which spec or agent should address it (069, 081, Ada, Lina, etc.)

Structured enough to be referenceable by downstream specs, lightweight enough to not slow down the exercises.

### 5. Navigation Guidance Readiness

Navigation's guidance YAML exists but its components are `development` readiness. When they ship as production-ready, the component-level completeness test will catch any gaps. No action needed now — the governance infrastructure handles it automatically.

---

## Resolved Decisions

| ID | Decision | Resolution | Rationale |
|----|----------|------------|-----------|
| D1 | Test location | New `GuidanceCompleteness.test.ts`; migrate component reachability out of CoverageDrift | CoverageDrift = existence, GuidanceCompleteness = quality. Separate files optimize AI agent disambiguation — file names are the first token of context on failure. Single-concern files = one fewer hop in error resolution. |
| D2 | Quality enforcement | Non-empty presence checks (hard enforcement) with actionable error messages pointing to Component Dev Guide | Non-empty catches the real failure mode (author forgot). Count-based enforcement is theater. Error messages teach resolution. |
| D3 | Number of design exercises | Start with 3, Peter's call to continue | Maximize family coverage diversity. Enough variety to surface patterns without dragging. This seeds a continuous pipeline. |
| D4 | Experience pattern format | Match existing format; gaps become findings | Don't evolve the format mid-exercise. Format evolution is a separate deliberate decision informed by the gap report. |
| D5 | Component readiness in exercises | Exercises may reference development-readiness components with readiness caveat tags | Real design doesn't stop at the production boundary. Caveat tags note which components must ship before the pattern is fully validatable. |
| D6 | Gap report format | Dedicated file with structured entries (description, query, result, classification, downstream target) | Must be discoverable and referenceable by downstream specs. Location: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md` |
| D7 | Provisional pattern classification | Tag each pattern as `general`, `product-specific`, or `uncertain` | Gives Lessons Synthesis Review a starting point. Signal, not binding decision. |

---

## Scope

### In Scope
- `GuidanceCompleteness.test.ts` — quality enforcement (component reachability + non-empty field checks)
- CoverageDrift migration — remove component reachability assertion (moves to GuidanceCompleteness)
- "Family Guidance Standards" section in Component Development Guide
- Leonardo + Peter design exercises (3 practice screens, design phase)
- New experience patterns derived from exercises (with readiness caveats and provisional classification)
- Application MCP gap report

### Out of Scope
- Platform implementation of exercise screens (design-only exercises)
- Navigation guidance content updates (components aren't production-ready yet)
- Guidance YAML schema validation (structure is already validated by `FamilyGuidanceIndexer`)
- Layout templates (Spec 069 — separate concern, though exercises may surface needs)
- Experience pattern format evolution (gap report finding, not this spec's deliverable)

---

## Dependencies

| Spec | Relationship |
|------|-------------|
| 075 | CoverageDrift — component reachability assertion migrates out; family-level existence checks remain |
| 082 | Family naming + registry (canonical names, `displayName`, `FamilyNameValidation`) |
| 068 | FamilyGuidanceIndexer — `componentToFamily` map used by completeness test |

---

## Effort Estimate

Small-medium. The governance work (test migration + new quality checks + Component Dev Guide section) is small. The design exercises are the variable — depends on how many screens and how much iteration each takes. The exercises are also the highest-value deliverable, since they produce real content (experience patterns) and real signal (gap report).

**Task sequencing**: Governance first (clean baseline + completeness test validates current state), then exercises (informed by the quality standards and validated by the governance infrastructure). Tasks formalize the exercise output.

---

## Classification Gate

Exercise findings inform the system — they do not automatically enter it. Every gap identified during design exercises passes through a classification gate before any system change occurs.

### Flow

```
Exercises → Gap Report → Classification Gate → System changes (universal only)
                                             → Product documentation (product-specific)
                                             → Deferred (uncertain — needs more signal)
```

### Classification Categories

1. **Universal** — the need exists across products regardless of domain. Dashboards, notification lists, empty states, filter bars. These are candidates for system patterns, component-meta enrichments, or new components. Proceeds to downstream specs.

2. **Structurally universal, semantically product-specific** — the *shape* is universal but the *meaning* is product-specific. A "content list item" is universal. A "legislation update card" is product-specific. The system provides the structural component; the product provides the semantic context. The structural part proceeds to downstream specs. The semantic part stays in product documentation.

3. **Product-specific** — the need only exists in this product's domain. Does NOT enter the Application MCP. Goes to Product MCP (future, Spec 081) or stays in product documentation.

4. **Uncertain** — not enough signal to classify. Deferred until a second product exercises the same need. If two products need it independently, it's universal. If only one does, it's product-specific.

### Who Decides

Peter makes the classification call. The architect who designed the screen (Leonardo) has a natural bias toward "this should be in the system" — it would have made his job easier. The governance lead (Thurgood) has a bias toward "let's add it" — more coverage feels like progress. Peter sees both sides and can distinguish "that's Working Class talking" from "that's DesignerPunk talking."

Leonardo's provisional tags (`general`, `product-specific`, `uncertain`) are the first pass. Peter reviews and finalizes before any gap proceeds to a downstream spec.

### What This Means for MCP Content Changes

Enriching `purpose` text and `contexts` arrays in component-meta files follows the same gate. Adding `"dashboards"` as a context is universal — dashboards exist in every product. Adding `"civic-engagement"` as a context is product bleed. The gap report captures what Leonardo searched for; the classification gate determines what gets indexed.

---

## Reevaluation Triggers

- When Navigation or ProgressIndicator components reach production readiness, the completeness test activates automatically
- If quality issues emerge in practice (agents selecting wrong components because guidance is too sparse), non-empty checks may need to evolve into richer validation
- If the design exercises reveal that the experience pattern format is insufficient, format evolution becomes a follow-up spec or an addition to 069
- When the first real product spec runs through Leonardo, the continuous pattern pipeline activates — future patterns come from product work, not exercises
