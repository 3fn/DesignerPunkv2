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

### My Assessment: Strong agree, with one addition

**Q1**: Yes, this is exactly what I asked for. Per-platform readiness directly answers the questions I couldn't answer before: "Can this be specced against on iOS? Is the web implementation ahead of Android? Is the absence intentional?" The derivation-at-index-time approach is better than what I originally imagined (a manually maintained field) because it can't go stale. That's a meaningful improvement over my own recommendation.

**Q2**: The levels are right. The progression makes sense — each level represents a meaningful state change that affects my audit differently:

- `not-applicable`: I skip this platform for this component. No finding.
- `not-started`: If a spec references this component on this platform, that's a **critical** finding — you're speccing against something that doesn't exist.
- `scaffold`: The component has been started but isn't functional. Speccing against it is a **high** risk — contracts may change.
- `development`: Artifacts exist but haven't been human-verified. Speccing is reasonable but I'd flag it as a **medium** risk with a note to revisit after review.
- `production-ready`: Safe to spec against. No finding needed.

One thing I'd want clarity on: what's the `contract` field's relationship to platform status? The synthesis shows `contract: finalized | draft` at the component level. If the contract is `draft` but a platform is `development`, that's a different risk than `finalized` contract with `development` platform. A draft contract means the behavioral surface might change — that affects every platform simultaneously. I'd want to be able to distinguish "the implementation isn't done yet" from "the specification itself isn't settled."

**Q3**: Yes, but not in the way the question implies. I don't need to know *who* reviewed it — I need to know *what kind of review happened*. Lina reviewing means "the component matches its behavioral contracts and design intent." A platform agent reviewing means "the component works correctly on this specific platform." Those are different quality gates.

For my audit, the platform agent review is what matters most. Lina can confirm the component is architecturally sound, but Kenya confirming "this works correctly in SwiftUI with VoiceOver" is what tells me the iOS implementation is trustworthy for a product spec.

HOWEVER — adding two review types adds complexity to a model that's already more complex than the current single string. If we're choosing between "one reviewed flag" and "two reviewed flags," I'd take one and define it as "someone with platform expertise has confirmed this works on this platform." Keep it simple. The distinction between system review and product review is a nice-to-have, not a governance blocker.

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

### My Assessment: Agree — natural fit

**Q1**: Natural extension. The Lessons Synthesis Review already processes Leonardo's discoveries and platform agents' Implementation Reports. If Leonardo writes "I searched for X and couldn't find the right component" or "the MCP said to use Y but Z would have been better," that's already a lesson I'd be processing. Adding the explicit lens of "does this lesson reveal stale metadata?" is a small scope addition to work I'm already doing. It's one more question to ask of data I'm already reviewing.

It does NOT feel like too much scope because it's reactive, not proactive. I'm not auditing all 30 components' metadata every cycle — I'm checking whether the lessons from this cycle reveal metadata problems. That's bounded by the volume of lessons, which is bounded by the volume of product work.

**Q2**: I'd need the MCP queries I already use — `get_component_summary`, `get_prop_guidance`, `find_components` — to verify whether a reported issue is actually a metadata gap or a user error. If Leonardo says "I couldn't find a filter component," I'd run `find_components({ purpose: "filter" })` to check whether the metadata is actually deficient or whether Leonardo used the wrong search term. That's a small number of verification queries per lesson, not a full metadata audit.

**Q3**: Every review, but as a lightweight lens — not a dedicated phase. The question shouldn't be "did Leonardo explicitly flag an MCP issue?" because metadata problems often surface as indirect symptoms. Leonardo might write "I wasn't sure whether to use Container-Base or Container-Card-Base for the profile section" — that's not an explicit MCP complaint, but it might reveal that the selection guidance isn't clear enough. If I only check when MCP issues are explicitly flagged, I'll miss the indirect signals.

The cost of checking every time is low (a few extra MCP queries). The cost of missing a metadata degradation signal is higher (stale guidance propagates to future specs).

---

## Position 3: Selection Verification via Feedback Protocol

**Proposal**: Rather than building a spec validation tool, you'd be added as a reviewer on product specs with a specific mandate: verify component selection against family selection rules using `get_prop_guidance`. Intentional deviations from selection guidance would be documented as "escape hatches" in the spec, checked during your review, and tracked for migration during Lessons Synthesis Reviews.

**Questions**:
1. Is the feedback protocol the right mechanism for selection verification, or does it need a different touchpoint?
2. Is `get_prop_guidance` sufficient for checking selection correctness, or do you need additional queries?
3. For escape hatch documentation — what format would be most useful for your audit? A structured annotation in the spec? A separate tracking doc?

### My Assessment: Agree with a clarification on timing

**Q1**: The feedback protocol is the right mechanism, but the timing matters. I should review *after* Leonardo has finalized the spec's component tree, not during his drafting process. If I'm reviewing selection correctness while Leonardo is still iterating on the architecture, I'm adding friction to his creative process without adding value — he might change the selection before I finish reviewing it.

The right touchpoint: Leonardo marks the spec as "ready for review" → I review component selection as part of the feedback protocol → findings go back to Leonardo before platform agents begin implementation. This means selection issues are caught before they propagate to three platform implementations, which is the whole point.

**Q2**: `get_prop_guidance` is the primary tool, but I'd also use:
- `get_component_summary` — to check readiness (especially with the new per-platform model) and verify the component exists
- `find_components` — to check if there's a better component Leonardo might have missed
- `check_composition` — to verify parent-child relationships in the component tree are valid

So it's a small toolkit, not a single query. But these are all queries I demonstrated in my original research — nothing new needed.

**Q3**: Structured annotation in the spec, not a separate tracking doc. Here's why: the escape hatch is a property of *that spec's decision*, not a standalone item. If it lives in the spec, anyone reading the spec sees the deviation and the rationale. If it lives in a separate doc, the spec looks like it made a wrong choice unless you also check the tracking doc.

Format I'd want:

```markdown
### Escape Hatch: Container-Base for profile cards
- **Guidance says**: Use Container-Card-Base for card-like content (get_prop_guidance → Container family)
- **This spec uses**: Container-Base
- **Reason**: Container-Card-Base is `development` readiness on iOS; not safe to spec against
- **Migration trigger**: Container-Card-Base reaches `production-ready` on iOS
```

During Lessons Synthesis Reviews, I'd scan active specs for escape hatches and check whether the migration trigger has been met. If Container-Card-Base is now production-ready on iOS, I flag it: "this spec can now migrate to the correct component."

---

## Position 4: Platform Resource Map for Parity

**Proposal**: A steering doc maps platform-specific resource locations (token files, component implementations, generated output). This gives you paths to find and compare platform implementations manually. At current scale, manual comparison is the approach; structured parity tooling is deferred.

**Questions**:
1. Does manual comparison using the resource map work for your current needs?
2. At what scale or trigger would you need structured parity tooling? (Number of components? Number of active platforms? Specific event?)

### My Assessment: Agree — sufficient for now, with a clear trigger for revisiting

**Q1**: Yes, for current needs. We're primarily single-platform (iOS) for product work. Parity auditing is dormant. The resource map gives me the paths I'd need when a second platform comes online, and at 30 components, manual comparison is feasible. I can open the iOS and web implementations of the same component, compare the behavioral surface, and flag discrepancies. It's not fast, but it's not blocking.

**Q2**: The trigger isn't a number — it's a combination of conditions:

- **Two or more active platforms in product work** (not just "components exist on both platforms" but "we're shipping product screens on both"). This is the activation trigger for parity auditing in general.
- **AND** one of:
  - More than 5 product screens implemented across platforms (volume makes manual comparison time-prohibitive)
  - A parity defect reaches users (evidence that manual comparison missed something)
  - A platform agent reports they can't keep up with cross-referencing the other platform's implementation (workflow signal)

The first condition is necessary. The second is the escalation trigger. Without the first, there's nothing to audit. Without the second, manual comparison is working.

I'd recommend we document this trigger explicitly so it's not forgotten. When the conditions are met, the investment conversation happens proactively rather than reactively after a parity failure.

---

## Overall Assessment

All four positions address real governance needs I identified in my analysis. The synthesis has done something I appreciate: it found process-based solutions using existing mechanisms (Lessons Synthesis, Feedback Protocol, resource maps) rather than building new tooling. That's pragmatic and low-risk.

The readiness model (Position 1) is the highest-impact change for my work. It transforms readiness from a useless single string into an actionable, per-platform, automatically-derived quality signal. The R2 approach (derive at index time) is better than what I originally asked for.

The one thing I'd flag as a risk: Positions 2 and 3 both add scope to my role — metadata accuracy lens on Lessons Synthesis, plus selection verification on spec reviews. Each addition is small, but they compound. I'm comfortable with both because they're extensions of work I'm already doing, not new workflows. But if more scope additions come in future specs, we should check whether the cumulative load is sustainable.

**Counter-argument to my own assessment**: I'm agreeing with all four positions. That should trigger skepticism — am I being agreeable because the positions were designed to address my stated needs? Possibly. The positions are well-crafted responses to my analysis findings, so agreement is expected. But I should note: I haven't seen a position I'd push back on hard, and that might mean I'm not thinking critically enough about second-order effects. The escape hatch tracking during Lessons Synthesis, for example, adds a recurring obligation that grows with the number of active specs. At 3 specs, it's trivial. At 30, it's a real workload. I don't know where the tipping point is.
