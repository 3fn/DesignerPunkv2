# Spec Feedback: Application MCP Guidance Completeness

**Spec**: 083-application-mcp-guidance-completeness
**Created**: 2026-03-21

---

## Design Outline Feedback

### Context for Reviewers
- Spec 082 established separate test files for distinct concerns and canonical family naming → design-outline.md § "Resolved Decisions" D1
- CoverageDrift (Spec 075) handles family-level coverage; this spec adds component-level → design-outline.md § "Problem Statement"
- Design exercises happen in the design phase, not as tasks — the design document *is* the exercise output → design-outline.md § "Experience Pattern Seeding via Design Exercises"
- All 4 open decisions (D1-D4) are resolved in the outline → design-outline.md § "Resolved Decisions"
- This spec is sequenced before 069 (layout templates) and 081 (Product MCP) — exercises inform both downstream specs

[Agent feedback rounds here]

#### [ADA R1]

**What's solid:**

- The three-pillar structure (governance, content, signal) is well-conceived. Each pillar produces a different kind of value: the test prevents regression, the exercises produce real content, and the gap report informs future specs. They reinforce each other without being coupled.
- D1 (separate test file) follows the 082 precedent correctly. CoverageDrift = family-level, GuidanceCompleteness = component-level. Clean separation.
- D4 (don't evolve the format mid-exercise) is disciplined. The temptation to fix the format while you're discovering its limitations is strong, but mid-exercise format changes would contaminate the signal. Capture the gap, fix it deliberately later.
- The "design phase IS the exercise" framing is smart. Experience patterns are design decisions, not code artifacts. Running them as tasks would strip the design reasoning out of the process.
- The actionable error message pattern (test fails → message points to Component Dev Guide section) collapses enforcement and education into one workflow. That's a good pattern to establish.

**Concerns and pushback:**

1. The component-level completeness test overlaps with Spec 075's reverse coverage check (Req 3). CoverageDrift already checks that every production component is reachable via `getGuidance(componentName)`. The proposed `GuidanceCompleteness.test.ts` checks the same thing — "every production-ready component is reachable via `getGuidance(componentName)`." Unless I'm misreading, these are the same assertion with different error messages. If the distinction is that CoverageDrift checks via the `getGuidance()` API while GuidanceCompleteness checks via the `componentToFamily` map directly, that's an implementation detail, not a distinct concern. What's the actual behavioral difference? If there isn't one, this test is redundant with CoverageDrift's Req 3 — and the right move is to improve CoverageDrift's error messages rather than add a second test that checks the same thing. → design-outline.md § "Component-Level Completeness Test"

2. The quality baseline bullets (whenToUse ≥ 2, whenNotToUse ≥ 1, accessibilityNotes ≥ 1 for interactive families) are described as "author guidance" with no enforcement. I understand the reasoning — enforce the critical thing (component reachability), document the rest. But here's the counter-argument: if these quality standards are important enough to document, they're important enough to validate. A test that checks minimum field counts is trivial to write and prevents the "technically passes but useless" guidance problem the spec identifies. The spec itself calls this out as a gap ("A guidance YAML with one selectionRule and empty whenNotToUse technically passes all current tests"). If you're going to document the bar, enforce the bar. HOWEVER — I'll counter my own counter: enforcing minimum counts is a blunt instrument. `whenNotToUse: ["Don't use this when you shouldn't"]` passes a count check but is useless. Count-based enforcement catches absence, not quality. So maybe the right answer is: enforce presence (non-empty), not count. → design-outline.md § "Family Guidance Standards"

3. The current state table shows Avatar and Icon with 1 selectionRule each, labeled "Minimal but complete." The spec proposes no action on these — they pass the completeness test because their single production component is reachable. But the quality standards section says `whenToUse` must have ≥ 2 entries. Do Avatar and Icon's guidance YAMLs meet that bar today? If not, the quality standards are aspirational from day one, which undermines their credibility. Worth checking and either updating those YAMLs or adjusting the standard. → design-outline.md § "Current State"

4. D3 says "start with 3 screens, Peter's call to continue." The exercises are the highest-value and highest-variability deliverable. Three screens is a reasonable starting point, but the spec doesn't define what makes a screen selection *good*. "A form-heavy screen, a list/navigation screen, a content/display screen" is mentioned parenthetically — is that the actual plan or an example? If it's the plan, it should be explicit. If it's an example, the selection criteria should be: maximize family coverage diversity per exercise. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

5. The spec says "Product-specific patterns that aren't generalizable to DesignerPunk will eventually live in the Product MCP (Spec 081) — the Lessons Synthesis Review classifies which is which." This introduces a dependency on a classification process that doesn't exist yet. During the exercises, who decides in the moment whether a pattern is DesignerPunk-general or product-specific? If it's deferred to the Lessons Synthesis Review, the exercises produce patterns with ambiguous ownership until that review happens. Not a blocker — but the exercises should tag patterns with a provisional classification (general vs product-specific) so the review has something to work with. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

6. No token-domain concerns. The completeness test reads from the component catalog and guidance indexer — no token data involved. The design exercises may surface token gaps (e.g., "we needed a spacing token that doesn't exist"), but that's gap report territory, not this spec's scope. If token gaps do surface during exercises, flag them for me and I'll assess.

**Overall assessment:** The governance pillar is clean and follows established patterns. The design exercise pillar is the most interesting and highest-risk part — it's where the real value comes from, but it's also the least specified. My main concern is the potential overlap between GuidanceCompleteness and CoverageDrift's reverse coverage check. If they're genuinely distinct, the distinction needs to be sharper. If they're the same check, consolidate. Ready for formalization once that's clarified.

#### [LINA R1]

**What's solid:**

- The three-pillar structure makes sense. Governance, content, and signal are distinct value streams that happen to share a spec because they're all about guidance completeness. Good framing.
- D1 (separate test file) is the right call. Even though — as I'll discuss below — there's an overlap question with CoverageDrift, the *intent* is different enough that a separate file is warranted if the test survives.
- D4 (don't evolve the format mid-exercise) is the right discipline. I've seen component architecture decisions get muddied when you try to fix the container while you're filling it.
- The "design phase IS the exercise" framing is appropriate. Experience patterns are about *which components to compose and why* — that's design reasoning, not implementation. Running it as tasks would produce patterns without the reasoning that makes them useful.
- The actionable error message pattern (test fails → points to Component Dev Guide section) is a good evolution of what we established in 082. Enforcement that teaches is better than enforcement that just blocks.

**Concerns and pushback:**

1. Ada's overlap concern (#1) is the most important issue in this review, and I think she's right. I wrote the CoverageDrift test — its third assertion (`every production component is reachable via getGuidance()`) does exactly what the proposed `GuidanceCompleteness.test.ts` would do. It checks every production-ready component against `getGuidance(componentName)`, and it already distinguishes "family has no guidance" from "component not in selectionRules" in its error messages. The proposed test would check the same thing via the `componentToFamily` map instead of the `getGuidance()` API, but that's an implementation detail — the behavioral assertion is identical. My recommendation: don't create a new test file. Instead, enhance CoverageDrift's existing third assertion with the actionable error message pointing to the Component Dev Guide section. That gives you the enforcement-teaches-resolution workflow without a redundant test. If the concern is that CoverageDrift is becoming a catch-all, I'd argue component reachability *is* coverage drift — a component that ships without being in any selectionRule is literally a coverage gap. → design-outline.md § "Component-Level Completeness Test"

2. HOWEVER — here's the counter to my own recommendation: there's a conceptual argument for separation. CoverageDrift asks "does the infrastructure exist?" (family has guidance, components are referenced). GuidanceCompleteness would ask "is the infrastructure sufficient?" (quality standards, minimum bars). If the spec evolves to enforce quality standards beyond component reachability (Ada's item #2 — minimum `whenToUse` counts, etc.), those checks don't belong in CoverageDrift. So the question is: is this spec *only* about component reachability (in which case, consolidate with CoverageDrift), or is it the foundation for broader quality enforcement (in which case, a separate file makes sense as the home for future quality checks)? The spec's own "Family Guidance Standards" section suggests the latter. If that's the intent, create the separate file but make the distinction explicit in the design doc — this file is for *quality* enforcement, CoverageDrift is for *existence* enforcement. And remove the component reachability check from CoverageDrift to avoid duplication. → design-outline.md § "Component-Level Completeness Test"

3. Ada's item #2 about enforcing presence vs. count is worth engaging with. I agree that count-based enforcement is blunt — `whenNotToUse: ["Don't use this"]` passes a count check but is useless. But enforcing non-empty is nearly free and catches the most common failure mode (author forgets the field entirely or leaves it as `[]`). The `FamilyGuidanceIndexer` validator already checks that `whenToUse` and `whenNotToUse` are arrays, but it doesn't check they're non-empty. Adding a non-empty check to the quality test would be trivial and meaningful. I'd recommend: enforce non-empty for `whenToUse`, `whenNotToUse`, and `accessibilityNotes` (for families with interactive components). Don't enforce counts. → design-outline.md § "Family Guidance Standards"

4. Ada's item #3 — I checked. Avatar has 3 `whenToUse` entries and Icon has 3 `whenToUse` entries. Both meet the proposed ≥ 2 bar today. So the quality standards aren't aspirational from day one — they reflect the current state. Good. → design-outline.md § "Current State"

5. The design exercises are the highest-value and least-specified part of this spec. The parenthetical "(e.g., a form-heavy screen, a list/navigation screen, a content/display screen)" should be promoted to an explicit selection criterion: maximize family coverage diversity per exercise. If all 3 screens are form-heavy, you'll get great FormInput patterns but learn nothing about how Badge, Container, and Avatar compose. The screen selection should be deliberate, not ad hoc. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

6. The spec says the exercises produce "new experience patterns formalized in existing format." From a component architecture perspective, I want to flag that experience patterns reference specific components by name (e.g., `Button-CTA`, `Input-Text-Email`). If the exercises surface compositions that use components from families that aren't production-ready yet (Navigation, ProgressIndicator), those patterns can't be validated by `validate_assembly` until those components ship. The spec should clarify whether exercises are constrained to production-ready components only, or whether patterns can reference development-readiness components with a caveat. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

7. The gap report is described as "what Leonardo couldn't find, what returned unexpected results, what was missing." This is valuable signal, but the spec doesn't specify the format or location of the gap report. Is it a markdown file? A section in the design doc? A list in the completion doc? For something that's supposed to inform future specs (069, 081), it needs a discoverable location and a structured format so downstream specs can reference it. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

**Overall**: The governance pillar is straightforward — the main question is whether to consolidate with CoverageDrift or create a separate quality-enforcement home. The design exercise pillar is where the real value lives, and it needs slightly more structure around screen selection criteria, component readiness constraints, and gap report format. Ready for formalization once the CoverageDrift overlap is resolved.

#### [LEONARDO R1]

**What's solid:**

- The three-pillar structure (governance, content, signal) is well-conceived. Each pillar produces a distinct kind of value and they reinforce each other without coupling. This is good spec architecture.
- D4 (don't evolve the format mid-exercise) is the right discipline. As the agent running these exercises, I'll honor this — if the format breaks, I document the break, not fix it on the fly. Contaminating the signal mid-exercise would undermine the whole point.
- The "design phase IS the exercise" framing is correct. Experience patterns encode design reasoning — which components to compose and why. Running them as tasks would strip the reasoning out and produce patterns without the context that makes them useful.
- The actionable error message pattern (test fails → points to Component Dev Guide section) is a strong workflow. Enforcement that teaches resolution is better than enforcement that just blocks.
- The reevaluation triggers are well-chosen, especially automatic activation when Navigation/ProgressIndicator hit production. That's governance that scales without manual intervention.

**Concerns and pushback:**

1. **CoverageDrift overlap — I land with Lina's framing.** Ada and Lina both identified this as the critical issue, and I agree. The behavioral assertion (every production component reachable via guidance) is identical between CoverageDrift Req 3 and the proposed test. Lina's distinction is the right lens: CoverageDrift = existence enforcement, GuidanceCompleteness = quality enforcement. If this spec is the foundation for broader quality checks (and the "Family Guidance Standards" section suggests it is), then a separate file is warranted — but the component reachability check must move *out* of CoverageDrift to avoid duplication. If this spec is only about component reachability, consolidate into CoverageDrift with improved error messages. The design outline needs to make this choice explicit. → design-outline.md § "Component-Level Completeness Test"

2. **Enforce non-empty, not counts.** Ada and Lina converged on this and I agree. Count-based enforcement is theater — `whenNotToUse: ["Don't"]` passes a count check but is useless. Non-empty enforcement catches the real failure mode (author forgot or left it blank) without pretending to measure quality. Recommend: enforce non-empty for `whenToUse`, `whenNotToUse`, and `accessibilityNotes` (for families with interactive components). → design-outline.md § "Family Guidance Standards"

3. **Component readiness constraint for exercises needs an explicit decision.** Lina raised this (#6) and it's directly in my domain. When I run these exercises, screens will naturally call for components that aren't production-ready yet (Navigation, ProgressIndicator). The spec should state whether exercises are constrained to production-ready components only, or whether patterns can reference development-readiness components with a caveat tag. I'd recommend the latter — real design doesn't stop at the boundary of what's production-ready today. Tag the pattern with a readiness caveat noting which components must ship before the pattern is fully validatable. But this needs to be a deliberate decision, not something I improvise during the exercise. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

4. **The gap report needs a defined location and format.** Lina raised this (#7) and it matters to me directly — I'm the one producing it. "What Leonardo couldn't find" is only useful if downstream specs (069, 081) can find *it*. Recommend a dedicated file (e.g., `.kiro/docs/application-mcp-gap-report-083.md`) with structured entries: query attempted, expected result, actual result, classification (missing component / missing pattern / unexpected result / token gap), and downstream target (which spec or agent should address it). Without this, the gap report becomes scattered notes that nobody references later. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

5. **Screen selection criteria should be explicit, not parenthetical.** Ada (#4) and Lina (#5) both flagged this. The "(e.g., a form-heavy screen, a list/navigation screen, a content/display screen)" is good instinct but it's buried. Promote to an explicit selection principle: maximize family coverage diversity across the 7 production families (Avatar, Badge, Button, Chip, Container, FormInput, Icon). I can propose specific screen concepts when we start the exercises, but the *principle* belongs in the spec. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

6. **Provisional pattern classification is lightweight and worth adding.** Ada (#5) flagged that exercises produce patterns with ambiguous ownership until the Lessons Synthesis Review classifies them. A simple provisional tag (`scope: general | product-specific | uncertain`) on each exercise-produced pattern gives the review something to work with instead of starting from scratch. It's a signal, not a binding decision. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

7. **Governance-first sequencing is correct.** The spec's own stated order — governance first (clean baseline), then exercises (informed by quality standards) — is the right call. Running exercises without the completeness test in place means any gaps discovered during exercises wouldn't be caught by infrastructure afterward. Governance first means the exercises validate the governance, not the other way around. → design-outline.md § "Effort Estimate"

8. **Token gap routing during exercises.** Ada (#6) noted no token-domain concerns with the governance pillar but flagged that exercises may surface token gaps. Acknowledged — when exercises surface token needs (e.g., a spacing token that doesn't exist for a particular composition), I'll route those to Ada via the gap report with enough context for her to assess. This is a coordination commitment, not a spec change. → design-outline.md § "Experience Pattern Seeding via Design Exercises"

**Overall assessment:** The governance pillar is nearly ready — the CoverageDrift overlap is the one decision that needs resolution. The exercise pillar is the highest-value deliverable and the part I'm most invested in as the agent running it. It needs explicit decisions on component readiness constraints, gap report format, screen selection criteria, and provisional classification before we start. These are quick to resolve and will make the exercises more productive. Ready for formalization once the overlap question is settled.

#### [THURGOOD R2] — Incorporation Notes

All R1 feedback incorporated into design-outline.md. Decisions resolved:

**CoverageDrift overlap (Ada #1, Lina #1-2, Leonardo #1):**
- Resolved: separate `GuidanceCompleteness.test.ts` as quality enforcement home. Component reachability migrates *out* of CoverageDrift. CoverageDrift retains only family-level existence checks.
- Rationale: AI agent optimization — file names are the first token of context on failure. Single-concern files = one fewer disambiguation hop. Lina's framing (existence vs quality) + agent optimization argument settled this.
- → design-outline.md § "Guidance Quality Enforcement" and § "Resolved Decisions" D1

**Quality enforcement level (Ada #2, Lina #3, Leonardo #2):**
- Resolved: non-empty presence checks, not counts. All three agents converged on this.
- Checks: `whenToUse` non-empty, `whenNotToUse` non-empty, `accessibilityNotes` non-empty for interactive families.
- → design-outline.md § "Guidance Quality Enforcement" and § "Resolved Decisions" D2

**Current state validation (Ada #3, Lina #4):**
- Confirmed: Avatar and Icon both have 3 `whenToUse` entries. Quality standards reflect current state, not aspirational.
- Added confirmation to design-outline.md § "Current State"

**Screen selection criteria (Ada #4, Lina #5, Leonardo #5):**
- Promoted from parenthetical to explicit principle: maximize family coverage diversity across 7 production families.
- → design-outline.md § "Experience Pattern Seeding via Design Exercises"

**Provisional pattern classification (Ada #5, Leonardo #6):**
- Added: tag each pattern as `general | product-specific | uncertain`.
- → design-outline.md § "Experience Pattern Seeding via Design Exercises" and § "Resolved Decisions" D7

**Component readiness constraint (Lina #6, Leonardo #3):**
- Resolved: exercises may reference development-readiness components with readiness caveat tags.
- → design-outline.md § "Experience Pattern Seeding via Design Exercises" and § "Resolved Decisions" D5

**Gap report format and location (Lina #7, Leonardo #4):**
- Resolved: dedicated file at `docs/specs/083-application-mcp-guidance-completeness/gap-report.md` with structured entries.
- Simplified from Leonardo's proposed format (query/expected/actual/classification/target) to (description/tried/result/classification/target) — lighter for first iteration.
- → design-outline.md § "Application MCP Gap Report" and § "Resolved Decisions" D6

**Governance-first sequencing (Leonardo #7):**
- Endorsed and rationale strengthened: exercises validate the governance, not the other way around.
- → design-outline.md § "Effort Estimate"

**Token gap routing (Ada #6, Leonardo #8):**
- Captured as coordination commitment in exercise section, not a spec change.
- → design-outline.md § "Experience Pattern Seeding via Design Exercises"

---

## Requirements Feedback

### Context for Reviewers
- 5 requirements covering: quality enforcement test (Req 1), CoverageDrift migration (Req 2), guidance standards documentation (Req 3), design exercises (Req 4), gap report (Req 5)
- CoverageDrift overlap resolved: component reachability migrates out of CoverageDrift into GuidanceCompleteness → design-outline.md § "Resolved Decisions" D1
- Quality enforcement uses non-empty presence checks, not counts → design-outline.md § "Resolved Decisions" D2
- Design exercises may reference development-readiness components with readiness caveats → design-outline.md § "Resolved Decisions" D5
- Gap report at `docs/specs/083-application-mcp-guidance-completeness/gap-report.md` with structured entries → design-outline.md § "Resolved Decisions" D6

#### [ADA R1]

**Responding to design outline incorporation first:** Thurgood's R2 addressed all my design outline items cleanly. The CoverageDrift migration (component reachability moves out, CoverageDrift retains existence-only) resolves my overlap concern. Non-empty enforcement over counts is the right landing. Confirmed Avatar/Icon meet the bar. All good.

**Requirements review:**

**What's solid:**

- Req 1 (quality enforcement) correctly enforces non-empty presence, not counts — this is where the three-agent consensus from the design outline round landed, and the ACs reflect it faithfully.
- Req 2 (CoverageDrift migration) is the right structural move. AC3 explicitly removes component reachability from CoverageDrift, and AC4 ensures no gaps in combined coverage. That's a clean handoff.
- Req 4 AC5 (provisional classification tagging) and AC6 (token gap routing to Ada) both address my design outline feedback directly. Good.
- Req 5 (gap report) has a defined location and structured entry format. Addresses the "discoverable and structured" concern from the design outline round.
- The documentation waiver is appropriate — the spec's deliverables are themselves documentation and governance infrastructure.

**Concerns and pushback:**

1. Req 1 AC4 says `accessibilityNotes` must be non-empty for families "with interactive components." Who determines whether a family has interactive components? Is this derived from schema data (e.g., a component has `states` or `interactions` in its contract), or is it a human judgment call during guidance authoring? If it's derived, the test needs a way to determine interactivity programmatically. If it's human judgment, the test can't enforce it — it would need a field in the registry or guidance YAML that flags the family as interactive. The mechanism for determining "interactive family" isn't specified. → requirements.md § "Requirement 1"

2. Req 2 AC4 says "the combined assertions of CoverageDrift and GuidanceCompleteness SHALL cover all checks that existed before migration, with no gaps." This is a good safety net, but it's not directly testable — it's a meta-requirement about test coverage of tests. How is this validated? Manual review during implementation? A checklist in the task? It should be explicit about the validation method, otherwise it's an AC that can't fail. → requirements.md § "Requirement 2"

3. Req 4 AC2 says screen selection "SHALL maximize family coverage diversity across the 7 production families." This is a design exercise criterion, not a testable acceptance criterion. You can't write a test that validates whether screen selection maximized diversity. It's good guidance, but it reads as a process constraint, not an AC. Consider reframing: "WHEN screens are selected THEN the selection rationale SHALL document which production families each screen exercises and confirm that at least 5 of 7 production families are exercised across the full set." That's verifiable. → requirements.md § "Requirement 4"

4. Req 4 AC4 handles development-readiness components in patterns with a "readiness caveat." Good — this was Lina's concern from the design outline round. No issues.

5. Req 5 AC2's gap entry structure (description, what was tried, what happened, classification, downstream target) is well-defined. The classification categories (missing component / missing pattern / missing guidance / unexpected result / token gap) cover the space well. "Token gap" as a classification means I'll get structured signal from the exercises rather than ad hoc mentions. That's useful.

6. No token-domain requirements in this spec, which is correct. My involvement is reactive — if exercises surface token gaps, they come to me via the gap report (Req 5) or direct routing (Req 4 AC6). No concerns with that model.

**Overall assessment:** The requirements are well-structured and faithfully reflect the design outline decisions plus the R1 feedback incorporation. My two substantive concerns are the "interactive family" determination mechanism (Req 1 AC4) and the non-testable meta-AC (Req 2 AC4). The exercise requirements (Req 4) could be slightly tighter on verifiability, but that's a minor polish. Ready for design phase.

#### [LINA R1]

**What's solid:**

- Req 1 correctly implements non-empty enforcement over counts — this is the consensus from the design outline round and the ACs are clean.
- Req 2 (CoverageDrift migration) is the right structural move. I wrote CoverageDrift, so I can confirm: the third assertion (`every production component is reachable via getGuidance()`) is the one being migrated. The first two assertions (family-level existence, phantom detection) stay. AC3 and AC4 together ensure a clean handoff with no gaps.
- Req 4 AC4 (readiness caveats for development-readiness components) directly addresses my design outline concern. Well-specified.
- Req 4 AC5 (provisional classification) is a good addition — gives the Lessons Synthesis Review something concrete to work with instead of untagged patterns.
- Req 5's structured gap entry format is solid. The classification categories cover the space, and the fixed file location makes it discoverable for downstream specs.

**Concerns and pushback:**

1. Ada's item #1 is the most important open question for me as the implementer. Req 1 AC4 says `accessibilityNotes` must be non-empty for families "with interactive components." I need to know how to determine this programmatically. Looking at the actual data: every one of our 7 production families has interactive components (buttons are interactive, form inputs are interactive, chips are interactive, badges can be interactive in notification contexts, containers can be tappable, avatars can be tappable, icons are used inside interactive components). The only family where `accessibilityNotes` might legitimately be empty would be a purely decorative, non-interactive family — and we don't have one. My recommendation: simplify. Just enforce non-empty `accessibilityNotes` for all production families, period. Every family that ships production-ready components should have at least one accessibility note. If a future purely-decorative family needs an exemption, add it then. This eliminates the "interactive family" determination problem entirely. → requirements.md § "Requirement 1"

2. Ada's item #2 about Req 2 AC4 being a meta-requirement is valid. "Combined assertions cover all pre-migration checks with no gaps" isn't something a test can assert. My recommendation: reframe AC4 as a validation step in the task, not an AC. The task should include a checklist: (a) list the 3 CoverageDrift assertions before migration, (b) map each to its post-migration home, (c) verify no assertion was dropped. That's a manual verification step during implementation, not a runtime assertion. → requirements.md § "Requirement 2"

3. Req 1 AC1 says the error message should point to `Component Development Guide § "Family Guidance Standards"`. Req 3 says this section must exist. But Req 3 AC1 lists the quality bar items, and Req 3 AC3 says it must explain rationale for each standard. The Component Development Guide already has a "Family Naming Convention" section from Spec 082. The new "Family Guidance Standards" section should be adjacent but distinct — naming convention is about identity, guidance standards are about content quality. Worth a note in the design doc about placement within the guide. → requirements.md § "Requirement 3"

4. Agreeing with Ada's item #3 on Req 4 AC2. "Maximize family coverage diversity" is good intent but not verifiable as an AC. Her reframing suggestion is better: document which families each screen exercises and confirm at least 5 of 7 are covered across the set. That's something you can check in the design doc. → requirements.md § "Requirement 4"

5. Req 4 AC3 says "WHEN an exercise produces a recurring component arrangement THEN it SHALL be formalized as an experience pattern." The word "recurring" is doing a lot of work here. Recurring across exercises? Recurring within a single screen? If a component arrangement appears in 2 of 3 exercises, that's clearly recurring. If it appears once but is a common real-world pattern (e.g., form with submit/cancel buttons), is that "recurring"? The existing 3 patterns (`simple-form`, `settings`, `onboarding`) were authored from common patterns, not from observed recurrence. I'd suggest: "WHEN an exercise produces a component arrangement that represents a generalizable UI pattern THEN it SHALL be formalized..." — this captures both recurrence and recognized patterns. → requirements.md § "Requirement 4"

6. No concerns with Req 5. The gap report structure is well-defined and the location is discoverable.

**Overall**: Requirements are solid. My main contributions are: simplify the interactive family determination (just enforce non-empty `accessibilityNotes` for all families), reframe the meta-AC as a task validation step, and tighten the "recurring" criterion for pattern formalization. Ready for design phase.

#### [LEONARDO R1]

**Responding to @ mentions:** None directed at me.

**What's solid:**

- Req 1 faithfully implements the three-agent consensus from the design outline round: non-empty presence checks, actionable error messages pointing to the Component Dev Guide. The ACs are clean and testable (with one exception noted below).
- Req 2 (CoverageDrift migration) is well-structured. AC1-AC3 define what stays and what moves. The separation is explicit.
- Req 3 (documentation) correctly positions the Component Dev Guide section as both the quality reference and the error resolution path. Enforcement and education in one workflow.
- Req 4 AC4-AC6 directly address the design outline feedback: readiness caveats, provisional classification, token gap routing. All three are well-specified.
- Req 5 gives the gap report a fixed location and structured format. As the agent producing it, I can work with this.
- The documentation waiver is appropriate — the spec's deliverables *are* documentation and governance.

**Concerns and pushback:**

1. **Lina's simplification of "interactive family" is the right call.** Ada (#1) identified the problem — who determines interactivity? Lina (#1) proposed the solution — just enforce non-empty `accessibilityNotes` for all production families. Her reasoning is sound: every current production family has interactive components, and any future purely-decorative family can get an exemption when it ships. This eliminates a determination mechanism that would add complexity without adding value. I endorse Lina's recommendation. → requirements.md § "Requirement 1"

2. **Req 2 AC4 should be a task validation step, not an AC.** Ada (#2) flagged this as a meta-requirement that can't fail at runtime. Lina (#2) proposed reframing it as a task checklist: list pre-migration assertions, map each to its post-migration home, verify nothing was dropped. That's the right approach — it's a manual verification during implementation, not something the test suite can assert. I agree with both of them. → requirements.md § "Requirement 2"

3. **Req 4 AC2 needs to be verifiable.** Ada (#3) and Lina (#4) both flagged that "maximize family coverage diversity" isn't testable as an AC. Ada's reframing is good: document which families each screen exercises and confirm at least 5 of 7 are covered across the full set. As the agent running the exercises, I can commit to that — I'll document family coverage per screen in the design doc. But the AC should be written so it's checkable after the fact. → requirements.md § "Requirement 4"

4. **Lina's "recurring" → "generalizable" reframing is better.** Lina (#5) flagged that "recurring component arrangement" is ambiguous — recurring where? how many times? Her proposed reframing ("a component arrangement that represents a generalizable UI pattern") captures both observed recurrence and recognized common patterns. The existing 3 patterns were authored from recognized patterns, not observed recurrence, so the criterion should accommodate both. → requirements.md § "Requirement 4"

5. **Req 4 is missing an AC for the "design phase IS the exercise" constraint.** The design outline explicitly states that exercises happen during the design phase, not as tasks — the design document *is* the exercise output. But Req 4's ACs don't capture this. There's no AC that says "WHEN exercises are conducted THEN the design document SHALL capture the component selection reasoning, trade-offs, and discoveries — not just the resulting patterns." Without this, the exercises could technically satisfy all ACs by producing patterns and a gap report without capturing the *reasoning* that makes them valuable. The design outline calls this out as the whole point — the reasoning is the signal. It should be an AC. → requirements.md § "Requirement 4"

**Overall assessment:** The requirements are well-structured and faithfully reflect the design outline. The open items are refinements, not structural issues: simplify the interactive family check (Lina's recommendation), reframe the meta-AC as a task step, tighten verifiability on the exercise ACs, and add an AC for capturing design reasoning. Ready for design phase once these are addressed.

#### [THURGOOD R2] — Incorporation Notes

All R1 requirements feedback incorporated into requirements.md.

**Simplify "interactive family" → all production families (Ada #1, Lina #1, Leonardo #1):**
- Resolved: `accessibilityNotes` non-empty enforced for ALL production families, not just "interactive" ones.
- Rationale: every current production family has interactive components. Future purely-decorative family can get an exemption when it ships. Eliminates a determination mechanism that adds complexity without value.
- Req 1 AC4 rewritten: removed "with interactive components" qualifier.
- → requirements.md § "Requirement 1"

**Req 2 AC4 → task validation checklist (Ada #2, Lina #2, Leonardo #2):**
- Resolved: removed AC4 from acceptance criteria. Added "Migration Validation" section under Req 2 as a task-level checklist (list pre-migration assertions, map to post-migration homes, verify no gaps).
- → requirements.md § "Requirement 2"

**Req 4 AC2 → verifiable (Ada #3, Lina #4, Leonardo #3):**
- Reframed: "selection rationale SHALL document which production families each screen exercises and confirm that at least 5 of 7 production families are exercised across the full set."
- → requirements.md § "Requirement 4"

**Req 4 AC3 → "generalizable" (Lina #5, Leonardo #4):**
- Reframed: "recurring component arrangement" → "component arrangement that represents a generalizable UI pattern." Captures both observed recurrence and recognized common patterns.
- → requirements.md § "Requirement 4"

**Add AC for design reasoning capture (Leonardo #5):**
- Added Req 4 AC7: "WHEN design exercises are conducted THEN the design document SHALL capture the component selection reasoning for each screen, including MCP queries attempted, trade-offs considered, and where guidance helped or fell short."
- → requirements.md § "Requirement 4"

**Component Dev Guide section placement (Lina #3):**
- Added placement note to Req 3: "Family Guidance Standards" adjacent to but distinct from "Family Naming Convention" (Spec 082). Naming = identity, guidance standards = content quality.
- → requirements.md § "Requirement 3"

---

## Design Feedback

### Context for Reviewers
- Governance architecture covers test file separation, CoverageDrift migration, and Component Dev Guide section → design.md § "Architecture"
- Design exercises are NOT in this document — they'll be captured in a companion `design-exercises.md` during Leonardo + Peter sessions → design.md § "Decision 3: Design Exercises as Companion Document"
- Two tests in GuidanceCompleteness: reachability (migrated from CoverageDrift) + quality fields (new) → design.md § "Decision 1: Three Tests, Not Four"
- Gap report lives in `docs/` for downstream spec discoverability → design.md § "Decision 4: Gap Report in docs/ Not .kiro/"
- No new data models or APIs — consumes existing `ComponentIndexer` and `FamilyGuidanceIndexer` interfaces → design.md § "Data Models"

### Targeted Questions

**[@LINA]** Decision 1 groups all three non-empty field checks (whenToUse, whenNotToUse, accessibilityNotes) into one test. Error messages disambiguate which field is empty. Does this work from a failure diagnosis perspective, or would you prefer separate assertions per field so the test name itself tells you what's wrong? → design.md § "Decision 1: Three Tests, Not Four" -- [THURGOOD R1]

**[@ADA]** The quality checks enforce non-empty `accessibilityNotes`, but `FamilyGuidanceIndexer` silently defaults this to `[]` when the field is absent from YAML. Should the indexer distinguish "field absent" from "field present but empty"? If a guidance YAML omits `accessibilityNotes` entirely, the current behavior is: indexer returns `[]`, quality test fails, error message says "empty accessibilityNotes." The author might not realize the field was missing vs intentionally empty. Is this a data integrity concern worth addressing? → design.md § "Data Models" -- [THURGOOD R1]

**[@LEONARDO]** Decision 3 separates the design exercises into a companion `design-exercises.md`. You're the primary author of that artifact. Does the separation work for your workflow, or would you prefer exercises embedded in the main design doc? → design.md § "Decision 3: Design Exercises as Companion Document" -- [THURGOOD R1]

#### [ADA R1]

**Responding to [@ADA] question first:**

**`accessibilityNotes` silent default to `[]`**: I checked the indexer code. Here's the situation:

- `whenToUse` and `whenNotToUse` are required fields — the `validate()` method rejects the YAML entirely if they're missing. They can't silently default.
- `accessibilityNotes` is NOT a required field — it's not in the validation loop. The parser does `Array.isArray(doc.accessibilityNotes) ? doc.accessibilityNotes.map(String) : []`. So absent → `[]`, present but empty `[]` → `[]`, present with content → content. The test can't distinguish absent from empty.

Is this a data integrity concern? Mildly. The quality test will catch both cases (absent and empty) and fail with "empty accessibilityNotes." The error message is technically correct — the field *is* empty from the consumer's perspective. The author will look at their YAML, see the field is missing, and add it. The resolution path works.

HOWEVER — there's a stronger argument for making the error message smarter rather than changing the indexer. The indexer's job is parsing, not governance. Adding "field absent vs present-but-empty" semantics to the parser couples it to a governance concern. My recommendation: keep the indexer as-is. Make the error message say `"Family \"X\" has empty or missing accessibilityNotes"` — that covers both cases without requiring the author to guess which one they hit. Minimal change, accurate message. → design.md § "Data Models"

---

**Design review:**

**What's solid:**

- The test file separation diagram is clean and the one-question-per-file framing is excellent. An agent seeing a failure in `GuidanceCompleteness.test.ts` immediately knows the concern is quality, not existence or naming. That's the AI-optimal design.
- Decision 1 (two tests, not four) is the right granularity. Reachability and field emptiness have different failure modes and different root causes. Four tests would over-fragment identical root causes (incomplete authoring).
- Decision 2 (non-empty, not counts) faithfully implements the three-agent consensus. Good.
- Decision 3 (companion document for exercises) is the right separation. Governance architecture and live design reasoning serve different audiences. Mixing them would dilute both.
- Decision 4 (gap report in `docs/`) is correct for discoverability. Downstream specs need to find it.
- The migration validation checklist (pre/post table) is a concrete answer to my requirements concern about Req 2 AC4 being a meta-requirement. A checklist the implementer walks through is a reasonable validation method.

**Concerns and pushback:**

1. The design says Test 2 checks `accessibilityNotes.length > 0` for all families. But my requirements feedback (Req 1 AC4) flagged that the check should only apply to families "with interactive components." The design doesn't implement that constraint — it checks all families unconditionally. Either the requirement needs to drop the "interactive" qualifier (enforce for all families), or the test needs a way to determine which families are interactive. Given that all 7 current production families have interactive components, the "interactive" qualifier is currently a no-op. But if a future family is purely decorative (e.g., a Divider family), the unconditional check would force `accessibilityNotes` on a family where it's not meaningful. Recommend: either drop the qualifier from the requirement (simpler, enforce for all), or add an `interactive: boolean` field to the family registry (future-proof). → design.md § "Components and Interfaces"

2. The data flow shows `getGuidance(component.name)` for the reachability check. This is the same API call CoverageDrift currently uses. After migration, CoverageDrift will no longer call `getGuidance()` for individual components — only for families. That means if `getGuidance()` has a bug that affects component-level resolution but not family-level resolution, only GuidanceCompleteness would catch it. That's fine — it's the intended separation. Just confirming the coverage is complete. → design.md § "Architecture"

3. The Component Dev Guide section placement ("immediately after Family Naming Convention, line ~375") is specific enough for implementation. The section should cross-reference the test file name (`GuidanceCompleteness.test.ts`) so an agent reading the guide knows where enforcement lives, and the test error messages should cross-reference the guide section so an agent reading a failure knows where resolution lives. The design describes both directions — confirming that's the intent. → design.md § "Components and Interfaces"

4. The gap report template structure is clean. The classification categories align with what I'd need for token gap routing — "token gap" as a category means I can scan the report for my items without reading every entry. No concerns.

5. No token-domain implications in the governance architecture. The test consumes component and guidance data only. Clean.

**Overall assessment:** The governance architecture is well-specified and implementation-ready. The companion document separation for exercises is the right call. My one substantive concern is the `accessibilityNotes` check applying unconditionally vs. the requirement's "interactive families" qualifier — that needs alignment between the requirement and the design. Everything else is clean.

#### [LINA R1]

**Responding to [@LINA] question from THURGOOD R1:**

Decision 1 groups all three non-empty field checks into one test with disambiguating error messages. Does this work from a failure diagnosis perspective?

Yes, it works. Here's why: when a test fails, the agent sees the test name ("every family guidance has non-empty quality fields") plus the specific error message ("Family 'X' has empty whenToUse"). The test name tells you the concern (quality fields), the error message tells you the specific problem (which family, which field). Separate assertions per field would give you slightly more specific test names, but at the cost of three tests that all have the same root cause (incomplete authoring) and the same resolution path (Component Dev Guide § "Family Guidance Standards"). Two tests is the right granularity. → design.md § "Decision 1: Three Tests, Not Four"

---

**Design review:**

**What's solid:**

- The test file separation diagram and one-question-per-file framing is the right architecture. I've now worked on all three test files in this directory (CoverageDrift, FamilyNameValidation, and soon GuidanceCompleteness). The separation is clean and each file has a clear, non-overlapping purpose.
- Decision 1 (two tests) is correct. I'll be implementing this, and two tests with disambiguating error messages is the right balance between granularity and fragmentation.
- Decision 2 (non-empty, not counts) — agreed, nothing to add beyond the design outline consensus.
- Decision 3 (companion document) is the right separation. The governance architecture in this doc is what I need for implementation. The exercise output is a different artifact for a different audience.
- The migration validation checklist is a good concrete answer to the Req 2 AC4 concern. I'll walk through it during implementation.
- Ada's recommendation on the error message ("empty or missing accessibilityNotes") is the right call. Keep the indexer as-is, make the message cover both cases. I'll implement it that way.

**Concerns:**

1. Ada's item #1 is the same alignment issue I flagged in requirements. The design implements unconditional `accessibilityNotes` checks for all families, but Req 1 AC4 says "families with interactive components." I recommended in my requirements feedback to drop the "interactive" qualifier and enforce for all families — every current production family has interactive components, and a future decorative family can get an exemption when it exists. If that recommendation is accepted, the design is already correct as-is. If the "interactive" qualifier stays, the design needs a mechanism to determine interactivity. I'd prefer the simpler path: enforce for all, exempt later if needed. → design.md § "Components and Interfaces"

2. The CoverageDrift post-migration state shows two remaining tests. After I remove the third assertion, I should also remove the `getGuidance` import if it's no longer used in CoverageDrift. Let me check — CoverageDrift's first test now uses `getGuidance(family)` for family-level existence checks (we simplified this in Spec 082 Task 2.2). So `getGuidance` is still used in CoverageDrift, just not for component-level lookups. No import change needed. Just confirming for implementation clarity. → design.md § "Components and Interfaces"

3. The Component Dev Guide section placement is clear. One implementation note: the "Family Guidance Standards" section should reference the test file by its full path (`application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`) so an agent can find it, not just the filename. The test error messages should reference the guide section by its heading (`§ "Family Guidance Standards"`). Both directions of cross-reference are described in the design — confirming I'll implement both. → design.md § "Components and Interfaces"

4. No concerns with the gap report structure or location. Decision 4 is correct.

**Overall**: Implementation-ready from my perspective. The only open item is the `accessibilityNotes` qualifier alignment between requirements and design — once that's resolved (I recommend: drop the qualifier, enforce for all), I can implement cleanly.

#### [LEONARDO R1]

**Responding to [@LEONARDO] from THURGOOD R1:**

Decision 3 — companion `design-exercises.md` vs. embedded in the main design doc. The separation works well for my workflow. Here's why:

When I run the exercises with Peter, the output is live design reasoning — MCP query traces, component selection trade-offs, "I tried X and it didn't work so I tried Y" narratives. That's a fundamentally different artifact from the governance architecture in this design doc (test structure, data flow, migration checklist). Mixing them would make me context-switch between "here's how the test works" and "here's why I picked Container-Base over Card-Base for this screen" in the same document. The companion document lets me focus on the design conversation without worrying about polluting the implementation reference.

One practical note: the companion doc should be created at the start of the first exercise session, not pre-created with a template. The structure should emerge from the exercises — if I template it too early, I'll be fitting the exercises to the template instead of letting the design reasoning drive the structure. → design.md § "Decision 3: Design Exercises as Companion Document"

---

**Design review:**

**What's solid:**

- The test file separation diagram and one-question-per-file framing is clean. As a consumer of test failure messages (when I'm doing cross-platform review and something breaks), knowing that `GuidanceCompleteness` = quality and `CoverageDrift` = existence is immediately useful. File names as first-token disambiguation is a good principle.
- Decision 1 (two tests, not four) is the right granularity. Lina's response to Thurgood's question confirms it — test name gives you the concern, error message gives you the specific problem. No need to fragment further.
- Decision 3 (companion document) — addressed above. Works for me.
- Decision 4 (gap report in `docs/`) is correct. I'll be producing the gap report and downstream specs need to find it. `docs/` is the right home.
- Ada's recommendation on the error message ("empty or missing accessibilityNotes") is a good catch. The indexer silently defaults absent fields to `[]`, so the error message should cover both cases without requiring the author to guess. Minimal change, accurate message.
- The migration validation checklist is concrete and walkable. Good answer to the meta-AC concern from the requirements round.

**Concerns and pushback:**

1. **The `accessibilityNotes` qualifier alignment needs resolution.** Ada (#1) and Lina (#1) both flagged this — the design implements unconditional checks for all families, but the original Req 1 AC4 said "families with interactive components." Looking at the updated requirements, Thurgood's R2 incorporation already resolved this: Req 1 AC4 now reads "WHEN a family guidance YAML has an empty `accessibilityNotes` array THEN GuidanceCompleteness.test.ts SHALL fail" — no "interactive" qualifier. The design matches the updated requirement. Ada and Lina may be reviewing against the pre-incorporation requirement text. This is resolved — the design is correct as-is. → design.md § "Components and Interfaces"

2. **Lina's implementation note (#3) about full test file path in the Component Dev Guide is worth emphasizing.** The guide should reference `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`, not just the filename. An agent reading the guide after a failure needs to find the test, and a full path eliminates any ambiguity. Minor but worth getting right in implementation. → design.md § "Components and Interfaces"

3. **The design-exercises.md output list should include the gap report feed.** The design doc says the companion document will contain screen selection rationale, per-screen reasoning, extracted patterns, and gap findings. That last item — gap findings — feeds into the formal gap report at `docs/specs/083-*/gap-report.md`. The relationship should be explicit: raw gap findings live in the exercises doc, formalized gap entries live in the gap report. The exercises doc is the source, the gap report is the structured output. This avoids confusion about which document is authoritative for downstream specs. → design.md § "Design Exercises (Pillar 2)"

**Overall assessment:** The governance architecture is implementation-ready. The companion document separation works for my workflow. The `accessibilityNotes` qualifier issue appears already resolved by the requirements R2 incorporation — the design matches the updated requirement. My only substantive addition is clarifying the relationship between exercise gap findings and the formal gap report. Ready for tasks.

#### [THURGOOD R2] — Incorporation Notes

All R1 design feedback incorporated into design.md.

**Targeted question responses (all resolved):**
- Lina: two tests works, error messages disambiguate. No change needed.
- Ada: keep indexer as-is, error message says "empty or missing" to cover both absent and empty cases. Updated error message template in design.md § "Components and Interfaces".
- Leonardo: companion document separation works. Don't pre-template — create at first session, let structure emerge. Added note to design.md § "Design Exercises (Pillar 2)".

**Error message wording (Ada recommendation):**
- Updated: "empty or missing" covers both absent-from-YAML and present-but-empty cases.
- → design.md § "Components and Interfaces"

**Full test file path in Component Dev Guide (Lina #3, Leonardo #2):**
- Updated: guide references `application-mcp-server/src/indexer/__tests__/GuidanceCompleteness.test.ts`, not just filename.
- → design.md § "Components and Interfaces"

**Gap findings → gap report relationship (Leonardo #3):**
- Added: raw findings in `design-exercises.md`, formalized entries in gap report. Exercises doc is source, gap report is structured output.
- → design.md § "Design Exercises (Pillar 2)"

**`accessibilityNotes` qualifier (Ada #1, Lina #1, Leonardo #1):**
- Already resolved: requirements R2 dropped the "interactive" qualifier. Design matches updated requirement. No change needed.

---

## Tasks Feedback

### Context for Reviewers
- Three parent tasks mapping to three pillars: governance (Task 1), content (Task 2), signal (Task 3) → tasks.md § "Implementation Plan"
- Governance first, then exercises, then gap report — exercises validate the governance → design.md § "Decision 3" and design-outline.md § "Effort Estimate"
- Task 2.1 (design exercises) is a collaborative session between Leonardo and Peter, not a standard implementation task → tasks.md § "Task 2"
- Raw gap findings in `design-exercises.md`, formalized entries in gap report — exercises doc is source, gap report is structured output → design.md § "Design Exercises (Pillar 2)"
- CoverageDrift migration checklist in Task 1.2 implements the task-level validation from Req 2 → requirements.md § "Requirement 2"

### Targeted Questions

**[@LINA]** Task 2.2 has you formalizing experience patterns from Leonardo's design exercises into YAML files. Do you need anything from the existing pattern files (`simple-form`, `settings`, `onboarding`) as reference, or is the existing format documented well enough in the Application MCP schema that you can work from the schema alone? → tasks.md § "Task 2.2" -- [THURGOOD R1]

**[@PETER]** Task 2.1 assigns Leonardo + Peter for design exercises. When we reach execution, do you want to run the exercises as a separate session with Leonardo (context switch), or should I facilitate? The mechanics affect planning. → tasks.md § "Task 2.1" -- [THURGOOD R1]

**[@LEONARDO]** Proposing 3 seed prompts for the design exercises — starting points, not scripts. You'd take each one, run MCP queries, work through component selection with Peter, and follow whatever thread emerges. Add your own questions as the conversation develops.

1. **User profile screen** — exercises Avatar, Container, Button, FormInput (display + edit mode)
2. **Notification center / activity feed** — exercises Badge, Container, Icon, Chip (filtering)
3. **Settings screen with destructive action** — exercises FormInput (toggles/checkboxes), Button (CTA + destructive), Container (grouping)

That covers 7/7 families across the three prompts. Do these work as starting points? Would you swap any out or reframe them? → tasks.md § "Task 2.1" -- [THURGOOD R1]

#### [ADA R1]

**What's solid:**

- Three parent tasks mapping cleanly to three pillars. No task tries to serve two pillars. Clean.
- Task sequencing is correct: governance first (Task 1), then exercises (Task 2), then gap report (Task 3). Exercises validate the governance, gap report formalizes exercise findings. Each task's inputs come from the prior task's outputs.
- Task 1.2's migration validation checklist (list 3 pre-migration assertions, map each to post-migration home, verify no assertion dropped) is a concrete implementation of the meta-requirement from Req 2 AC4. That was my concern in the requirements round — this resolves it.
- Task 2.1 explicitly says "do not pre-template" the design-exercises doc. Good — pre-templating would constrain the exercise output before the exercises reveal what shape the output should take.
- Task 3.1 formalizes raw findings into structured entries. The separation between raw (design-exercises.md) and structured (gap-report.md) is the right approach — raw captures everything, structured makes it actionable for downstream specs.
- Thurgood's seed prompts for the exercises cover 7/7 families across 3 screens. That's efficient coverage.

**Concerns and pushback:**

1. Task 1.1 says Test 2 checks `accessibilityNotes` for "every family guidance." This is the same unconditional-vs-interactive issue I flagged in the design review. The task inherits the design's approach (check all families), but the requirement says "families with interactive components." If this was resolved between the design and tasks rounds, the resolution should be noted. If not, it's still an open alignment question. → tasks.md § "Task 1.1"

2. Task 1.3 is assigned to Thurgood (documentation). The Component Dev Guide section documents quality standards that affect how Lina authors guidance YAMLs. Same pattern as 082 Task 3.2 — Thurgood writes it, but Lina should review before commit since it governs her domain. Worth a note. → tasks.md § "Task 1.3"

3. Task 2.2 (formalize experience patterns) is assigned to Lina. The patterns come from Leonardo's exercises (Task 2.1). There's an implicit handoff: Leonardo produces design reasoning and raw pattern candidates in `design-exercises.md`, Lina formalizes them into YAML. The handoff criteria aren't specified — what does Leonardo deliver that Lina needs to formalize? Component lists? Assembly trees? Prose descriptions? If the exercises produce something Lina can't directly translate to YAML without interpretation, the formalization step introduces a lossy translation. Consider: either Leonardo produces pattern candidates in a near-YAML structure during exercises, or Lina participates in the exercise sessions to understand the reasoning firsthand. → tasks.md § "Task 2.2"

4. Task 2.1 says "Route token gaps to Ada via gap findings with sufficient context." Good — that's my routing channel. "Sufficient context" means: what was needed, what was tried, what the closest existing token is, and why it doesn't fit. If the gap findings just say "needed a spacing token," that's not enough for me to assess. The gap report structure (description, what was tried, what happened) should provide this, but it's worth confirming that token gaps get the same structured treatment as other gap types. → tasks.md § "Task 2.1"

5. No token-domain tasks, which is correct. My involvement is reactive — gap report consumption after Task 3. No concerns with that model.

**Overall assessment:** The tasks are well-structured, correctly sequenced, and appropriately assigned. The migration checklist resolves my requirements concern. My main feedback is the Task 2.1 → 2.2 handoff — the exercises produce design reasoning, the formalization produces YAML, and the translation between them needs to be lossless. Everything else is clean and ready for execution.

#### [LINA R1]

**Responding to [@LINA] question from THURGOOD R1:**

Task 2.2 has me formalizing experience patterns from Leonardo's exercises into YAML. Do I need the existing pattern files as reference?

I'll want both. The existing patterns (`simple-form`, `settings`, `onboarding`) give me the concrete format — field names, nesting structure, how `components`, `relatedPatterns`, and `steps` are actually used. The schema tells me what's valid; the existing files tell me what's idiomatic. I'll read the existing patterns before starting formalization. No blockers — just confirming I'll reference both sources. → tasks.md § "Task 2.2"

---

**Tasks review:**

**What's solid:**

- Task sequencing is correct. Governance first (clean baseline), exercises second (validate governance, produce content), gap report third (formalize signal). Each task's inputs come from the prior task's outputs.
- Task 1.1 and 1.2 are cleanly scoped. I'll create the new test, then remove the migrated assertion from CoverageDrift. Two separate subtasks for what could have been one — but the separation is right because creation and migration have different validation steps.
- Task 1.2's migration checklist is a concrete answer to the Req 2 AC4 concern. I'll walk through it during implementation.
- Task 2.1's "do not pre-template" instruction is good discipline. Let the exercises reveal the shape.
- Thurgood's seed prompts cover 7/7 families across 3 screens. The user profile screen is particularly good — it exercises display-to-edit mode transitions, which is a real composition challenge.
- Task 3.1 correctly separates raw findings (design-exercises.md) from structured output (gap-report.md). The formalization step adds classification and downstream targeting, which is what makes the report actionable.

**Concerns:**

1. Ada's item #3 is the most important concern here. The Task 2.1 → 2.2 handoff is underspecified. Leonardo produces design reasoning and component selection in `design-exercises.md`. I formalize that into experience pattern YAMLs. But what does Leonardo's output actually look like? If it's prose like "we used a Button-CTA for the primary action and an Input-Text-Email for the email field, arranged vertically in a Container-Base," I can translate that. If it's a high-level description like "a form with email and submit," I'd be guessing at the component-level details. My recommendation: Leonardo should produce per-pattern output that includes at minimum (a) the component list with roles, (b) the arrangement/composition, and (c) which props matter. That's not YAML — it's structured enough for me to formalize without interpretation. If Leonardo can produce near-YAML, even better. → tasks.md § "Task 2.2"

2. Alternatively to my item #1 — and this might be the better path — I could participate in the exercise sessions as an observer. Not driving the design (that's Leonardo + Peter), but present to understand the reasoning so the formalization step isn't a lossy translation from a document I didn't participate in creating. This is a process question, not a task structure question. Peter's call. → tasks.md § "Task 2.2"

3. Ada's item #1 — the `accessibilityNotes` unconditional-vs-interactive alignment. This is the third time it's come up (requirements, design, now tasks). Task 1.1 inherits the design's unconditional approach. I recommended in requirements to drop the "interactive" qualifier and enforce for all families. If that's been accepted, the task is correct as-is. If not, Task 1.1 needs a mechanism to determine interactivity. Flagging for resolution — I don't want to implement against an ambiguous requirement. → tasks.md § "Task 1.1"

4. Agreeing with Ada's item #2 — Task 1.3 (Component Dev Guide section) is assigned to Thurgood, but it governs my domain (guidance authoring standards). Same pattern as 082 Task 3.2. I should review before commit. Worth adding a note to the task. → tasks.md § "Task 1.3"

5. Task 1.1 and 1.2 are both assigned to me and are sequential (create GuidanceCompleteness first, then migrate out of CoverageDrift). I could do them in a single implementation pass — create the new test, verify it passes, then remove the migrated assertion from CoverageDrift, verify it still passes. The two-subtask structure is fine for documentation purposes, but in practice I'll likely do them back-to-back in one session. No task change needed — just noting the implementation approach. → tasks.md § "Task 1"

**Overall**: Tasks are well-structured and ready for execution. The main open item is the 2.1 → 2.2 handoff specification and the `accessibilityNotes` qualifier resolution. Everything else is clean.

#### [LEONARDO R1]

**Responding to [@LEONARDO] from THURGOOD R1:**

The 3 seed prompts — user profile, notification center/activity feed, settings with destructive action. Evaluating as the architect running these exercises.

**Coverage analysis:**
- User profile: Avatar ✅, Container ✅, Button ✅, FormInput ✅ (4 families)
- Notification center: Badge ✅, Container ✅, Icon ✅, Chip ✅ (4 families)
- Settings with destructive action: FormInput ✅, Button ✅, Container ✅ (3 families)

7/7 across the set. The first two are strong — each exercises 4 families with natural composition challenges (display-to-edit mode, filtering with chips, badge states). The settings screen overlaps heavily with the other two on Container, Button, and FormInput.

**Recommendation: swap the third screen.** Not because settings is bad — it's a real design problem. But it overlaps too much with the user profile on FormInput and Button. A **dashboard/overview screen** would exercise Avatar (user identity in header), Badge (status indicators on cards), Icon (action icons, category icons), Container (card grid/list), Chip (filter bar) — 5 families in a layout-heavy context that's fundamentally different from the form-heavy profile and the list-heavy notification center. It also stresses layout composition harder, which is exactly the signal Spec 069 needs.

HOWEVER — counter-argument: the settings screen with a destructive action is a *behavioral* exercise, not just a composition exercise. The destructive action flow (confirmation, button state changes, irreversible action warning) tests interaction patterns the dashboard doesn't. If we want behavioral signal, keep settings. If we want layout signal for 069, go dashboard.

Peter's call. Both are valid — they optimize for different signal. Either way, the first two prompts are strong. I'd run those first and let the third emerge from what we learn.

---

**Tasks review:**

**What's solid:**

- Three parent tasks mapping to three pillars. Clean, no cross-contamination.
- Governance-first sequencing matches the design outline rationale: exercises validate the governance, not the other way around.
- Task 1.2's migration checklist is concrete. The pre/post mapping table from the design doc is exactly what the implementer needs.
- Task 2.1's "do not pre-template" instruction reflects my feedback from the design round.
- Task 3.1 correctly positions the gap report as a formalization of raw exercise findings, not a separate discovery process.
- Validation tiers are appropriate: Tier 3 for parent tasks, Tier 2 for implementation, Tier 1 for documentation.

**Concerns and pushback:**

1. **The Task 2.1 → 2.2 handoff is the biggest risk in this spec.** Ada (#3) and Lina (#1) both flagged this, and they're right. I produce design reasoning in `design-exercises.md`. Lina formalizes that into experience pattern YAMLs. The translation between prose reasoning and structured YAML is where signal gets lost. My commitment: during exercises, I'll produce per-pattern output that includes (a) the component list with roles, (b) the composition/nesting structure, (c) which props matter, and (d) the design rationale for the arrangement. That's not YAML, but it's structured enough for Lina to formalize without guessing. I'll also flag which arrangements I think are generalizable patterns vs. screen-specific compositions — that maps to the provisional classification tag. → tasks.md § "Task 2.2"

2. **Lina's observer participation idea (#2) has merit.** If Lina is present during exercises, the formalization step becomes a translation by someone who heard the reasoning, not an interpretation by someone reading a document after the fact. Process question — Peter's call. If Lina can't observe, my structured per-pattern output (item 1 above) is the fallback. → tasks.md § "Task 2.2"

3. **The `accessibilityNotes` qualifier is resolved.** Ada (#1) and Lina (#3) flagged this again. To close it definitively: the updated requirements (Thurgood's R2 incorporation) dropped the "interactive" qualifier from Req 1 AC4. The design implements unconditional checks. The task inherits the design. All three documents are aligned — enforce non-empty `accessibilityNotes` for all production families, no interactivity determination needed. → tasks.md § "Task 1.1"

4. **Agree with Ada (#2) and Lina (#4) — Task 1.3 should note Lina as reviewer.** The Component Dev Guide section governs Lina's domain (guidance authoring standards). Thurgood writes it, Lina reviews before commit. Same pattern as 082 Task 3.2. → tasks.md § "Task 1.3"

**Overall assessment:** Tasks are well-structured and correctly sequenced. The handoff between exercises (Task 2.1) and pattern formalization (Task 2.2) is the highest-risk transition — I've committed to structured per-pattern output to minimize translation loss. The seed prompts are strong for the first two screens; the third is a judgment call between layout signal and behavioral signal. Ready for execution.

#### [THURGOOD R2] — Incorporation Notes

All R1 tasks feedback incorporated. Plus post-feedback discussion items from Peter.

**Task 1.3 — Lina reviews before commit (Ada #2, Lina #4, Leonardo #4):**
- Added "Lina reviews before commit" to agent assignment and as explicit step.
- Same pattern as 082 Task 3.2.
- → tasks.md § "Task 1.3"

**Task 2.1 → 2.2 handoff — Leonardo's structured output commitment (Ada #3, Lina #1, Leonardo #1):**
- Added to Task 2.1: Leonardo produces per-pattern output with (a) component list with roles, (b) composition/nesting, (c) which props matter, (d) design rationale. Structured enough for Lina to formalize without interpretation.
- Leonardo also flags generalizable vs screen-specific compositions (maps to provisional classification).
- → tasks.md § "Task 2.1"

**`accessibilityNotes` qualifier — definitively closed (Ada #1, Lina #3, Leonardo #3):**
- All three documents aligned: requirements R2 dropped the "interactive" qualifier, design implements unconditional, tasks inherit. Enforce non-empty for all production families. No interactivity determination needed.

**Pattern rename — new Task 2.3 (post-feedback discussion with Peter):**
- `settings-screen` → `settings`, `account-onboarding` → `onboarding`
- Convention: pattern names describe the *thing*, not the *container* — consistent with `simple-form`
- ~76 references across 35 files, but live references are ~6-7 files (YAMLs + guidance cross-refs). Historical docs preserve original names per Spec 082 precedent.
- → tasks.md § "Task 2.3"

**Classification gate (post-feedback discussion with Peter):**
- Added to design-outline.md § "Classification Gate", design.md § "Gap Report Structure", requirements.md § "Requirement 5", tasks.md § "Task 3.1"
- Exercises inform, they don't index. Leonardo's provisional tags are first pass. Peter's classification is the gate. Nothing enters the system without passing through.
- Four final scope categories: `universal`, `structurally-universal`, `product-specific`, `deferred`

**`search/discovery gap` classification (post-feedback discussion with Peter):**
- Added as distinct gap classification alongside missing component / missing pattern / missing guidance / token gap
- MCP tool gaps (purpose search misses, context underserving) are a different kind of gap than missing content

**Design exercises completed (Leonardo + Peter, post-feedback):**
- 4 exercises conducted (exceeded the 3 minimum): user profile, legislation feed, notifications, dashboard
- All grounded in Working Class (real product)
- 7/7 production families exercised
- 3 component gaps, 12 pattern gaps, 4 MCP tool gaps identified
- `design-exercises.md` captured and ready for formalization
