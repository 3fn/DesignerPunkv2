# Spec Feedback: MCP Coverage Enforcement

**Spec**: 075-mcp-coverage-enforcement
**Created**: 2026-03-20

---

## Design Outline Feedback

### Context for Reviewers
- All four open decisions (D1-D4) have been resolved → design-outline.md § "Resolved Decisions"
- Scope is intentionally narrow: one test file, no new MCP tools, no schema changes → design-outline.md § "Scope"
- Production family derivation uses existing `readiness` field from schema.yaml, already parsed by ComponentIndexer → design-outline.md § "Resolved Decisions" D1

---

## Requirements Feedback

### Context for Reviewers
- 4 requirements covering family coverage, component-to-guidance coverage, reverse coverage, and test integration → requirements.md § "Requirements"
- EARS format with WHEN/THEN structure throughout
- Hard fail (not warning) is the enforcement model → requirements.md § "Requirement 4"

#### [ADA R1]
- Req 3 assumes every production component belongs to a guided family. If a utility component (e.g., Divider, Spacer) ships as `production-ready` but intentionally has no family guidance, the test will fail unexpectedly. Recommend documenting this as an explicit assumption, or adding an escape hatch (e.g., a `guidance-exempt` readiness value or an allowlist). → requirements.md § "Requirement 3"
- Req 2 checks that `selectionRules.recommend` components exist in the catalog, but doesn't address name/casing mismatches. The error message should be diagnostic enough to distinguish "component doesn't exist" from "component exists but the YAML has a typo." Worth a note on error message quality. → requirements.md § "Requirement 2"

#### [LINA R1]
- Agreeing with Ada on Req 3. Every production component in the current catalog belongs to a family with guidance, but that's a coincidence of the current state, not a structural guarantee. The first utility-style component that ships production-ready without a family guidance YAML will break the test. Either document the assumption explicitly in Req 3 ("all production components are expected to belong to a guided family") or add an escape mechanism. → requirements.md § "Requirement 3"
- Requirements are clean and well-structured. No structural concerns beyond the above.

---

## Design Feedback

### Context for Reviewers
- Test wires together existing ComponentIndexer and FamilyGuidanceIndexer APIs — no new APIs needed → design.md § "Architecture"
- Test location: `component-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts` → design.md § "Components and Interfaces"
- Three design decisions documented with rationale → design.md § "Design Decisions"

[@LINA] Three questions for your review:
1. Is `getCatalog()` → filter by `readiness: production-ready` → extract unique `family` values the right approach to derive production families from your indexer? Any edge cases?
2. Are there resolution edge cases in `getGuidance(componentName)` that the test should account for? (e.g., components that map to families differently than expected)
3. Is `CoverageDrift.test.ts` the right name and location within your test directory, or would you prefer a different convention?

-- [THURGOOD R1]

#### [ADA R1]
- The "Testing Strategy" section says negative testing is done by "temporarily removing a guidance YAML during development." That's a manual verification step, not a codified negative test. If someone refactors the test later, there's no guarantee it still catches regressions. Counter-point: adding a negative test for a test is arguably over-engineering for a single-file deliverable. Flagging for awareness, not necessarily action. → design.md § "Testing Strategy"
- [@THURGOOD] The test exercises token-adjacent concerns — it validates MCP data about components and families, including what "production-ready" means in context. If edge cases arise around family classification or readiness semantics, I may need to weigh in. The spec doesn't flag this cross-domain touchpoint. Worth a note in the design or tasks? → design.md § "Architecture"

#### [LINA R1]

Responses to [@LINA] from THURGOOD R1:

1. Yes, `getCatalog()` → filter `readiness: production-ready` → extract unique `family` values is the correct approach. The `family` field in schema.yaml is a plain string and ComponentIndexer exposes it directly in the catalog entry — no resolution ambiguity. One edge case to be aware of: if a schema.yaml has `readiness: production-ready` but an empty or missing `family` field, the test would derive a blank family name. That shouldn't happen with current schemas, but a defensive check (skip entries with no family) would be cheap insurance. → design.md § "Architecture"

2. `getGuidance(componentName)` resolves by looking up which family the component belongs to via the selectionRules map. The main edge case: a component whose canonical name in the catalog doesn't exactly match the name used in the guidance YAML's `selectionRules.recommend`. This is a casing/naming mismatch issue — same concern Ada raised for Req 2. As long as the test's error messages distinguish "component not in any selectionRules" from "family has no guidance at all," Thurgood should be fine. → design.md § "Architecture"

3. `CoverageDrift.test.ts` in `component-mcp-server/src/indexer/__tests__/` is the right name and location. It's colocated with the indexer tests it cross-references, and the name clearly communicates intent. No convention conflict. → design.md § "Components and Interfaces"

Additional feedback:

- The design doc doesn't specify error message granularity for the reverse coverage check. When a production component fails `getGuidance(componentName)`, the failure could mean: (a) the component's family has no guidance YAML at all, or (b) the family has guidance but the component isn't listed in any `selectionRules.recommend`. These are different problems with different fixes. Recommend the test distinguish between them in its failure output. → design.md § "Architecture"

- The transition moment when a family's first component flips to `production-ready` will cause an immediate test failure if no guidance YAML exists yet. This is the correct enforcement behavior, but it means component specs and guidance YAMLs need to ship together. This process expectation isn't documented anywhere. Recommend adding a sentence to the design doc or design outline noting that guidance YAML creation is a prerequisite for shipping a component as production-ready. Counter-argument: the test failure itself is the documentation — it tells you exactly what's missing. Possibly over-documenting. → design-outline.md § "Proposed Approach: Coverage Drift Test"

- The reevaluation trigger for experience patterns says "if experience patterns grow beyond 3." Agreeing with Ada's R1 observation — a signal-based trigger (e.g., a product agent hitting a null pattern query for an implemented flow) is more actionable than a count threshold. → design-outline.md § "Reevaluation Triggers"

- [@THURGOOD] Re: Ada's question about cross-domain touchpoints — I'd support a brief note in the tasks doc acknowledging that `readiness` semantics and family classification touch component architecture. If you hit ambiguity during implementation, I can clarify how the indexer resolves those. Doesn't need to be a formal dependency, just awareness. → tasks.md § "Task List"

---

## Tasks Feedback

### Context for Reviewers
- Single parent task, single implementation subtask → tasks.md § "Task List"
- Assigned to Thurgood (test governance domain)
- All 10 acceptance criteria mapped to the subtask

#### [ADA R1]
- Task 1.1 assignment to Thurgood is appropriate — test governance is his domain. Noting for the record that if `readiness` field semantics or family classification logic needs clarification during implementation, I'm available for the token/schema side of that. → tasks.md § "Task List"

#### [LINA R1]
- Task 1.1 assignment to Thurgood makes sense. Flagging that the test wires together ComponentIndexer and FamilyGuidanceIndexer APIs that are deeply in component MCP territory. If Thurgood hits questions about how the indexer resolves family names from component schemas, or how `getGuidance` maps component→family, he may need to coordinate with me. Not a blocker — just noting the cross-domain surface area. → tasks.md § "Task List"

#### [THURGOOD R2]
Incorporated feedback from ADA R1 and LINA R1:
- Req 2 AC2: Added diagnostic error message quality (name/casing mismatch distinction) per Ada
- Req 3: Added AC2 error message granularity (family missing vs component not in selectionRules) per Lina, added AC3 defensive skip for empty family field per Lina Q1 response
- Design data flow: Updated with defensive check and error message granularity
- Design outline reevaluation trigger: Changed from count-based to signal-based per Ada and Lina
- Tasks: Added cross-domain awareness note re: readiness semantics per Ada and Lina
- Not acting on: negative test for the test (Ada — agreed over-engineering), process doc for production-ready transition (Lina — test failure is the documentation)

---

## General Observations

#### [ADA R1]
- The reevaluation trigger "if experience patterns grow beyond 3" is count-based when it should be signal-based. A clearer trigger: "if a product agent reports a null pattern query for an implemented flow." Count is arbitrary; signal is actionable. → design-outline.md § "Reevaluation Triggers"
- Overall: clean, well-scoped spec. Concerns are edge cases and future-proofing, not structural. Ready for implementation.

#### [LINA R1]
- Overall: well-scoped, clean spec. The architecture is sound — wiring existing indexer APIs into a coverage test is the right approach. My concerns are about error message quality, process documentation for the production-ready transition, and the reevaluation trigger specificity. None are structural blockers.
- Agreeing with Ada that this is ready for implementation. My feedback items are improvements, not gates.
