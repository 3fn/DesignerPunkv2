# Synthesis Review: Stacy

**Agent**: Stacy — Product Governance & Quality Assurance
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position 1: Two-Part Readiness Model

**Proposal**: Per-platform readiness derived at index time by the Application MCP indexer:
- **Technical readiness** (automated): scans filesystem for artifact presence (platform files, tests, schema, contracts)
- **Human-reviewed** (manual flag): set when someone confirms the component works as expected
- **Status derivation**: not-applicable → not-started → scaffold → development → production-ready
- **Intentional absence**: `not-applicable` with documented reason for platforms where a component is deliberately not supported

**What this means for you**: When auditing a spec, you'd see per-platform readiness instead of a single "development" string. You could assess: "is this component safe to spec against on web? Is iOS ready? Is Android intentionally excluded?"

**Questions**:
1. Does this model give you what you need for spec auditing and parity assessment?
2. Is the status derivation (not-applicable → not-started → scaffold → development → production-ready) the right set of levels? Missing any?
3. Should the `reviewed` flag distinguish between "reviewed by Lina (system)" and "reviewed by a platform agent (product)"?

---

## Position 2: Metadata Review via Lessons Synthesis

**Proposal**: Rather than creating a new metadata review process, extend your existing Lessons Synthesis Review to include a metadata accuracy lens. When processing Leonardo's accumulated lessons, you'd also check:
- Do findings reveal stale `whenToUse` entries?
- Are there missing alternatives or incorrect readiness?
- Are `purpose` fields failing to match consumer search terms?

This would require a small update to your prompt to add metadata accuracy to your synthesis review scope.

**Questions**:
1. Does this feel like a natural extension of your existing review, or does it add too much scope?
2. Do you have enough context to assess metadata accuracy, or would you need additional MCP queries beyond what you currently use?
3. Should the metadata accuracy check happen at every Lessons Synthesis Review, or only when Leonardo's lessons specifically flag MCP issues?

---

## Position 3: Selection Verification via Feedback Protocol

**Proposal**: Rather than building a spec validation tool, you'd be added as a reviewer on product specs with a specific mandate: verify component selection against family selection rules using `get_prop_guidance`. Intentional deviations from selection guidance would be documented as "escape hatches" in the spec, checked during your review, and tracked for migration during Lessons Synthesis Reviews.

**Questions**:
1. Is the feedback protocol the right mechanism for selection verification, or does it need a different touchpoint?
2. Is `get_prop_guidance` sufficient for checking selection correctness, or do you need additional queries?
3. For escape hatch documentation — what format would be most useful for your audit? A structured annotation in the spec? A separate tracking doc?

---

## Position 4: Platform Resource Map for Parity

**Proposal**: A steering doc maps platform-specific resource locations (token files, component implementations, generated output). This gives you paths to find and compare platform implementations manually. At current scale, manual comparison is the approach; structured parity tooling is deferred.

**Questions**:
1. Does manual comparison using the resource map work for your current needs?
2. At what scale or trigger would you need structured parity tooling? (Number of components? Number of active platforms? Specific event?)

---

## Your Assessment

Please provide your honest assessment of each position — agree, disagree, or modify. Flag anything that would make your governance workflow harder.
