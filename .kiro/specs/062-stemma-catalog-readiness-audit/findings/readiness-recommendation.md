# Readiness Recommendation

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 3 (Task 3.1)
**Status**: Complete

---

## Recommendation: Align Existing Components First, Then Proceed

The catalog has sufficient behavioral contract *diversity* to support schema formalization, but insufficient *consistency* to build a reliable schema on top of. The recommendation is to align the contract system first, then proceed with schema design.

---

## Evidence Summary

### Diversity Is Sufficient

The catalog exercises 7 structurally distinct contract patterns across 8 active families:

1. **Interaction contracts** (focus, press, hover, disabled) — Buttons, Form Inputs, Chips, Containers
2. **Validation/state contracts** (validation, error, success, float-label) — Form Inputs
3. **Composition contracts** (component-to-component assembly) — Progress
4. **Performance contracts** (runtime optimization) — Progress
5. **Content/shape contracts** (content-driven rendering) — Badges
6. **Notification contracts** (live region announcements) — Badges
7. **Orchestration contracts** (parent-child state coordination) — Buttons (VerticalList-Set)

Additional patterns exist in single components (consent/audit trail in Checkbox-Legal, form integration in Checkbox/Radio). The placeholder families (Modals, Data Displays, Dividers, Loading, Navigation) would likely introduce:
- **Modal/overlay contracts** (focus trapping, backdrop, dismiss) — structurally new
- **Loading/progress contracts** (indeterminate, determinate, skeleton) — partially covered by Progress
- **Navigation contracts** (active state, routing, breadcrumb) — structurally new

These are new patterns, but the schema can be designed to accommodate them if the schema's contract model is flexible enough. The current diversity provides enough variety to stress-test a schema design.

### Consistency Is Not Sufficient

The contract system has four documentation formats, a disconnected standard library, and significant gaps:

| Issue | Severity | Impact on Schema |
|-------|----------|-----------------|
| 4 different contract documentation formats | High | Schema can't consume contracts uniformly |
| Standard library (16 contracts) referenced by 0 components | High | No canonical vocabulary exists |
| 8 components have no schema YAML | High | No machine-parseable contract source |
| 2 components have zero documented contracts | Medium | Schema has nothing to consume |
| Naming inconsistencies across formats | Medium | Schema must reconcile or pick one |
| Inheritance implicit in Chip family | Low | Schema can infer from parent |
| Checkbox inheritance conceptual only | Low | Schema can infer from README |

### Test Confidence Is Low

92% of tested components use source code pattern matching as their primary test approach. This verifies that implementation artifacts exist but not that behaviors work correctly. The schema would be exposing contracts as capabilities to agents, but those capabilities are largely unverified at the behavioral level.

---

## Why Not "Proceed" or "Defer"

### Why Not Proceed Now

Building the schema on top of the current contract system would mean:
1. The schema generator would need to handle 4 different input formats — adding complexity to the transformer
2. The schema would encode naming inconsistencies (is it `pressable` or `clickable`? `hover_state` or `hoverable`?) — creating confusion for consuming agents
3. 8 components would be missing from the schema (no machine-parseable source) or require manual schema entries — defeating the "generated with human annotations" approach
4. 2 components would have no contract data at all — gaps in the catalog

The schema *could* be built this way, but it would be building on a foundation that needs repair. The integration methodology (Process-Integration-Methodology.md) Step 2 says "the schema should be expressive enough to satisfy the known integration target(s)" — but the schema's *input* also needs to be consistent enough to generate from.

### Why Not Defer

The diversity is there. The patterns are rich enough. Deferring until all 13 families are complete would delay the schema unnecessarily — the placeholder families would add new patterns but wouldn't invalidate the patterns already present. The alignment work is bounded and estimable (Lina estimated 2-3 days for the relationship model, 1-2 days for migration). This is not a "wait for the world to be perfect" situation — it's a "fix the foundation before building on it" situation.

---

## Recommended Sequencing

1. **Uniform contract system design** — Define the canonical format, vocabulary, and hierarchy model (uses this audit's design brief as input)
2. **Contract migration** — Align all 28 components to the uniform system (Lina's domain for component contracts, Ada's for token compliance)
3. **Schema formalization** — Build the component metadata schema consuming the uniform contracts
4. **A2UI validation** — Validate schema against A2UI as proof-of-concept

Steps 1-2 are prerequisites. Steps 3-4 can begin as soon as the migration reaches a critical mass (not necessarily 100% — the first families migrated can validate the schema design while remaining families catch up).

---

## Counter-Argument: Proceed Now, Align During Schema Design

The strongest case for proceeding now:

The schema design process itself would *force* contract reconciliation. You can't build a schema without deciding on a canonical vocabulary, format, and hierarchy model. The alignment work would happen as a natural byproduct of schema design rather than as a separate prerequisite step.

This path is faster (one effort instead of two sequential efforts) and avoids the risk of designing a uniform contract system that doesn't serve the schema well. If the schema is the primary consumer, let the schema's needs drive the contract system design.

**Why I still recommend aligning first**: The contract system serves more than just the schema. It serves developers reading component documentation, test authors writing behavioral tests, and Lina when building new components. Designing contracts to serve the schema risks optimizing for machine consumption at the expense of human utility. The contract system should lead the schema by a half-step — this was Lina's recommendation and I agree with it.

**Honest caveat**: This is a judgment call, not a clear-cut decision. Both paths are defensible. The "align first" path is more cautious and produces a better contract system. The "proceed now" path is faster and might produce an equally good schema. I lean toward caution because the contract system divergence is worse than initially expected (4 formats, not 3; 12 categories, not 5; 2 components with zero contracts).

---

## Conditions for Proceeding Without Full Alignment

If the decision is to proceed without full alignment, these minimum conditions should be met:

1. **Canonical vocabulary decided** — Pick one name for each behavioral concept (e.g., `pressable` not `clickable`)
2. **Machine-parseable contracts for all components** — The 8 schema-less components need at minimum a schema YAML with contract declarations
3. **Avatar and Button-Icon contracts documented** — Can't include them in the schema without knowing what they guarantee
4. **Inheritance model decided** — Explicit listing vs. implicit inheritance affects schema generation

These are a subset of full alignment — enough to build a schema, but not enough to have a clean contract system.
