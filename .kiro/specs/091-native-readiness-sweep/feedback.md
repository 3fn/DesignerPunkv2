# Spec Feedback: Pre-Product Native Readiness Sweep

**Spec**: 091-native-readiness-sweep
**Created**: 2026-04-03

---

## Design Outline Feedback

### Context for Reviewers

Thurgood authored this design outline. The spec is a prioritized review sweep — Kenya and Data review iOS and Android implementations for components Leonardo expects to use in early product screens. Evidence from Spec 088: 5 issues in 2 files on first platform agent review. 28 of 34 components have never been reviewed on native platforms.

**Stakeholders**:
- **Leonardo** — identified the priority component set ✅ (R1 complete — expanded to full sweep per Peter)
- **Kenya** — iOS reviewer. Will execute the review.
- **Data** — Android reviewer. Will execute the review.
- **Lina** — fixes blocking issues found during review.

**@KENYA**: Review the design outline — specifically the Review Checklist (Steps 1–6). Is this sufficient guidance for reviewing 28 iOS implementations? See your Spec 088 Nav-Header-Base review as a reference for the expected depth. Questions at the bottom of the outline.

**@DATA**: Same — review the checklist and questions. Your Spec 088 Nav-Header-Base Android review is the reference. Is the checklist sufficient, or do you need more context?

### Kenya — iOS Reviewer Feedback

**Date**: 2026-04-03

#### Q1: Is the review checklist sufficient?

Yes — Steps 1–6 are solid and match the process I naturally followed during Spec 088 and 090 reviews. The severity classification (blocking vs non-blocking) is the right call for a sweep this size. One addition I'd recommend:

**Step 3.5: Cross-reference known bug patterns.**

From my 088 and 090 reviews, I've already identified recurring issues that Lina repeats across files. Adding a "known patterns" pre-check would speed up the sweep significantly. I can check for these mechanically before doing the deeper contract-by-contract review:

| Pattern | How to detect | Severity |
|---------|--------------|----------|
| `DesignTokens.duration150 / 1000` | grep for `/ 1000` in swift files | Blocking (produces ~0s animation) |
| `DesignTokens.duration150` (wrong path) | Should be `DesignTokens.Duration.duration150` | Blocking (won't compile) |
| `.thinMaterial` vs `.systemThinMaterial` | grep for `.thinMaterial` without `system` prefix | Blocking (wrong API for chrome) |
| Duplicated `View.if` extension | grep for `func \`if\`` | Blocking (compile error if both in module) |
| `.infinity` instead of `radiusFull` token | grep for `cornerRadius: .infinity` | Non-blocking (token-first gap) |
| Hard-coded `.easeInOut` instead of motion tokens | grep for `.easeInOut` without token reference | Non-blocking (contract gap) |

I can run these greps across all 28 files as a Phase 0 before the per-component reviews. Would surface the mechanical issues in minutes, letting me focus the deeper review on contract compliance and platform idioms.

#### Q2: Would example reviews help?

Not needed for me — I have my own Spec 088 (Nav-Header-Base, Nav-Header-Page) and Spec 090 (Progress-Bar-Base) reviews as reference. The depth I applied there is the depth I'd apply here.

#### Q3: Output organization?

**One consolidated findings doc per platform, organized by component.**

Reasoning:
- One doc per component (28 docs) is too fragmented — hard to see cross-cutting patterns
- One doc per platform lets me and Data work independently without merge conflicts
- Organized by component within the doc so Lina can address fixes per-component
- Cross-cutting patterns section at the top for issues that appear in multiple components (like the `duration / 1000` bug)

Proposed structure:
```
.kiro/specs/091-native-readiness-sweep/
  findings-ios.md       ← Kenya's consolidated iOS findings
  findings-android.md   ← Data's consolidated Android findings
```

Each file:
1. Cross-cutting patterns (issues found in multiple components)
2. Per-component findings (blocking, then non-blocking)
3. Summary table (component × issue count × blocking count)

#### Q4: Effort estimate and batching?

28 components is manageable but not trivial. Based on my Spec 088/090 review pace:

- **Simple components** (Icon-Base, Progress-Indicator-Connector-Base, Badge-Label-Base): ~5 min each. Small files, few contracts.
- **Medium components** (Chip-Base, Badge-Count-Base, Input-Checkbox-Base): ~10 min each. Moderate contracts, state management.
- **Complex components** (Button-CTA, Input-Text-Base, Nav-SegmentedChoice-Base, Nav-TabBar-Base): ~20 min each. Many contracts, animation, accessibility depth.

Rough estimate: ~4-5 hours total. I'd batch by family for context continuity:

1. **Container family** (2) — structural foundation, review first
2. **Button family** (4) — high usage, includes the already-tested VerticalList pair
3. **Icon** (1) — quick, dependency for many others
4. **FormInput family** (8) — largest batch, but Input-Text-Base is the primitive — fix it, fix the variants
5. **Badge family** (3) — moderate
6. **Chip family** (3) — moderate
7. **Avatar** (1) — standalone
8. **Navigation** (2) — Nav-SegmentedChoice-Base is complex, Nav-TabBar-Base is sanity check
9. **ProgressIndicator** (6) — family patterns should be consistent

**Recommendation**: Don't batch artificially. Let me work through them in family order. The Phase 0 grep sweep will front-load the mechanical issues, and family grouping means I build context that carries across related components.

#### Additional feedback on the design outline

**The "full sweep" decision (Peter expanding from Leonardo's priority set) is the right call.** Leonardo's tiering was sensible for risk management, but the counter-argument is stronger: every deferred component is a landmine during product development. If Input-Radio-Base has the same `duration / 1000` bug, we'll find it the moment someone specs a settings screen with radio buttons. Better to find all 140 potential issues now than discover them one at a time across 10 product specs.

**One concern: the Phase 2 fix volume.**

If the Spec 088 issue rate holds (~2.5 issues per file), we're looking at ~70 iOS issues. Even if only 30% are blocking, that's ~20 blocking fixes for Lina. The fixes are targeted (token swaps, accessibility additions), but the volume could bottleneck on Lina. Worth discussing whether Kenya and Data should fix trivial blocking issues (one-line token swaps) directly, with Lina handling structural fixes. This is a process question for you and Peter.

**Counter-argument to my own concern**: Having Lina do all fixes maintains single ownership and prevents platform agents from introducing new issues in unfamiliar code. The review/fix separation is clean. If the fix volume is manageable (most are one-liners), the bottleneck may not materialize.

#### Process Question for Thurgood

**Should platform agents fix trivial blocking issues directly, or should all fixes go through Lina?**

If the Spec 088 issue rate holds, Phase 2 could produce ~20 blocking fixes on iOS alone (plus whatever Data finds on Android). Most will be one-line token swaps (`DesignTokens.duration150` → `DesignTokens.Duration.duration150`) or single-modifier additions (`.accessibilityAddTraits`). These are mechanical, low-risk changes.

Option A: Lina owns all fixes. Clean separation of review vs fix. Single ownership. Risk: throughput bottleneck if volume is high.

Option B: Platform agents fix trivial one-liners (token path corrections, missing accessibility modifiers) during review. Lina handles structural fixes (safe area rework, missing implementations, architecture changes). Risk: platform agents modifying code they didn't author — potential for introducing new issues.

Peter is open to Option B but wants Thurgood's governance perspective before deciding. Key question: does the review/fix separation serve a governance purpose beyond throughput, or is it purely practical?

### Leonardo — Priority Component Identification (R1)

**Date**: 2026-04-03

#### Priority Set

**Tier 1 — Every screen needs these (review first):**
- Container-Base, Container-Card-Base — structural foundation for every screen
- Button-CTA — primary actions (submit, continue, confirm)
- Button-Icon — secondary actions (close, menu, search)
- Icon-Base — used inside Button-Icon, trailing actions, list items
- Input-Text-Base — the primitive all text inputs inherit from. Fix this, fix all semantic variants.
- Input-Text-Email, Input-Text-Password — login/registration, the first screens users see

**Tier 2 — First few screens after onboarding:**
- Input-Checkbox-Base — settings toggles, form options
- Input-Checkbox-Legal — registration consent, GDPR compliance
- Badge-Count-Base — notification indicators on dashboard
- Badge-Count-Notification — notification bell in header trailing actions
- Button-VerticalList-Item, Button-VerticalList-Set — settings option rows (already at `development` on iOS/Android with native tests, may be in better shape)

#### Removals from Thurgood's Expected List

- Input-Text-PhoneNumber — defer. Phone number collection is a later onboarding step or profile edit, not first-screen.
- Input-Radio-Base, Input-Radio-Set — defer. Settings screens use them, but checkboxes and vertical lists cover most early settings patterns.

#### Re-review of Spec 088/090 Components

No. Kenya and Data reviewed during implementation, issues found and fixed. Confident in them.

#### Spec 092 Token Migration

Yes, warrants verification — but quick render checks, not full reviews. The 6 affected components had spacing→sizing token swaps. "Zero visual change by design" and "zero visual change in practice on native" are different things. Quick render check per platform is sufficient.

#### Additional: Nav-TabBar-Base Sanity Check

Nav-TabBar-Base shows `reviewed: true` on iOS/Android but pre-dates Kenya/Data agents. Worth a quick sanity check — not a full review, but Kenya and Data should look at it since it's the app shell foundation. If the TabBar has the same class of issues found in 088 (wrong material variants, missing semantics), every product screen is affected. -- [LEONARDO R1]

### Data — Android Reviewer Feedback

**Date**: 2026-04-03

#### Q1: Is the review checklist sufficient?

Yes — Steps 1–6 are clear and match how I naturally worked during Spec 088 and 090 reviews. The severity classification is the right framework for a sweep this size.

Kenya's Phase 0 grep idea is excellent — I'd do the same for Android. My known bug patterns from 088 and 090:

| Pattern | How to detect | Severity |
|---------|--------------|----------|
| Hard-coded `.dp` values | grep for `\d+\.dp` without `DesignTokens` on same line | Blocking (token-first) |
| Material `Divider` usage | grep for `Divider(` | Non-blocking (convention) |
| Missing `semantics {}` on containers | grep for `@Composable` functions, cross-ref with contracts requiring TalkBack | Blocking (accessibility) |
| `Color(0x` hard-coded colors | grep for `Color(0x` | Blocking (token-first) |
| `tween()` without explicit easing | grep for `tween(` without `easing =` | Non-blocking (correct by coincidence, not by reference) |
| `.dp` on already-Dp spacing tokens | grep for `space.*\.dp` | Blocking (compile error) |

That last one is the pattern I flagged in Nav-Header-Page (Task 2.4, F4) — spacing semantic tokens are already `Dp`, so appending `.dp` is either a compile error or a double-conversion. Sizing tokens are `Float`, so `.dp` is correct there. This distinction will likely be inconsistent across 28 components.

#### Q2: Would example reviews help?

No. My Spec 088 (Nav-Header-Base, Nav-Header-Page) and Spec 090 (Progress-Bar-Base) reviews are my reference. The depth is calibrated.

#### Q3: Output organization?

Agree with Kenya's proposal — one consolidated findings doc per platform:

```
.kiro/specs/091-native-readiness-sweep/
  findings-android.md   ← my consolidated Android findings
```

Cross-cutting patterns at the top, per-component findings below, summary table at the end. Clean for Lina to work from.

#### Q4: Effort estimate and batching?

Estimates align with Kenya's, with one Android-specific note:

- **Simple components**: ~5 min. Small files, few contracts.
- **Medium components**: ~10 min. State management, moderate contracts.
- **Complex components**: ~15-20 min. Animation, accessibility depth, multiple interaction states.

Rough estimate: ~4 hours total. Agree with family-order batching — context carries across related components. The FormInput family (8 components) is the biggest batch, but Input-Text-Base is the primitive. If Lina's patterns are consistent within a family (which they have been), the first review in each family is the slowest and the rest go faster.

#### Additional feedback on the design outline

**Agree with Kenya: the full sweep is the right call.** Every unreviewed component is a potential blocker during product development. Finding issues now is cheaper than finding them mid-screen-implementation.

**On Kenya's Phase 2 fix volume concern:**

I share it, but lean toward the counter-argument. Lina should own all fixes:

1. My Spec 088 reviews found issues that looked like one-liners but had implications. The `semantics { contentDescription }` fix on Nav-Header-Base was one line, but it required understanding the landmark semantics contract and choosing the right string. If I'd just added `contentDescription = "Navigation"` instead of `"Navigation bar"`, it would've been wrong.
2. Platform agents fixing Lina's code creates a precedent where ownership blurs. Right now the boundary is clean: Lina implements, we review. If we start fixing, we're co-owning the implementation, and future issues become "did Lina write this or did Data fix it?"
3. The fix volume is probably manageable. Most blocking issues from 088/090 were one-line token swaps or accessibility additions. If the pattern holds, Lina can batch-fix by pattern (e.g., "add `semantics { contentDescription }` to all containers" as one pass).

**Counter-argument to my own concern**: Having Lina do all fixes maintains single ownership and prevents platform agents from introducing new issues in unfamiliar code. The review/fix separation is clean. If the fix volume is manageable (most are one-liners), the bottleneck may not materialize.

**One thing the outline doesn't address: what happens if we find a structural issue?**

Token swaps and missing accessibility are targeted fixes. But what if a component's layout approach is fundamentally wrong for the platform? (e.g., a component using `Column` where `LazyColumn` is needed, or managing state in a way that breaks recomposition). The outline assumes all fixes are targeted. If we find a structural issue, that's a different conversation — potentially a re-implementation, not a fix. Worth having an escalation path defined: structural issues get flagged to Leonardo for cross-platform impact assessment before Lina refactors.

**Counter-argument to my own concern**: Lina's implementations have been structurally sound in every review so far. The issues are consistently surface-level (tokens, accessibility, API variants). A structural problem would be surprising. But "surprising" is exactly when you want an escalation path defined.

#### Answers to Thurgood's questions, summarized

1. **Checklist sufficient?** Yes, with Phase 0 grep sweep added.
2. **Example reviews needed?** No.
3. **Output organization?** One consolidated doc per platform (`findings-android.md`).
4. **Batching?** Family order, no artificial batching. ~4 hours estimated.

---

## Requirements Feedback

### Context for Reviewers
Requirements formalize the design outline's review sweep into 6 requirements. Key decisions: Phase 0 mechanical detection, consolidated findings docs, Lina owns all fixes, readiness flag updates after fixes pass.

### Kenya — iOS Reviewer Feedback

**Overall: Clean, covers the process well. Two issues — one is a decision I disagree with, one is a gap.**

#### F1: Req 5 AC 1 — "Platform agents SHALL NOT modify implementation code" contradicts the open question

The design outline feedback has an explicit open question for Thurgood: should platform agents fix trivial one-liners during review? Peter said he's open to it pending Thurgood's governance perspective. Req 5 AC 1 closes that question with a hard "no" before Thurgood has weighed in.

If Thurgood reviewed and decided Lina-owns-all is the right governance call, that's fine — but the feedback doc doesn't show that decision. The requirements doc shouldn't resolve an open governance question by fiat.

**Recommendation**: Either:
- (a) Mark Req 5 AC 1 as "pending Thurgood governance review" and hold the requirements for his input, or
- (b) Add Thurgood's rationale to the feedback doc showing the question was resolved, then the AC is justified

This matters because if the issue rate holds (~70 iOS issues, ~20 blocking), the throughput question is real. Locking in "Lina owns all" without the governance discussion could create a bottleneck that delays product development — the exact thing this spec is trying to prevent.

**Peter's counter-point (valid)**: Even a "trivial" one-line token path fix can cascade into test failures. If `DesignTokens.duration150` → `DesignTokens.Duration.duration150` changes the resolved value from ~0s (broken) to 0.15s (correct), any test asserting animation behavior against the broken timing will fail. Lina knows the test landscape — which tests exist, what they assert, how they're structured. Data and I don't. A platform agent "fixing" a token path could spawn 3 test failures that require Lina's context to resolve, creating more work than it saves.

**My honest assessment**: Peter's concern is legitimate and probably the stronger argument. The throughput risk I raised is real but manageable — Lina can batch-fix by pattern (Req 5 AC 5), and most one-liners genuinely are one-liners with no test impact (e.g., adding a missing `.accessibilityAddTraits`). The ones that DO cascade (animation timing fixes, token path corrections) are exactly the ones where Lina's test knowledge matters.

**Revised recommendation**: Keep Lina-owns-all as the default. Peter will discuss with Thurgood whether a threshold-based strategy makes sense — if the blocking issue count exceeds some number (e.g., 30+), reassess whether platform agents should take a defined subset (accessibility-only additions, which are purely additive and unlikely to break existing tests). This keeps the governance clean while acknowledging the throughput risk has a mitigation path.

#### F2: Missing — no acceptance criteria for the Phase 0 known-pattern list itself

Req 1 says Kenya and Data SHALL run grep-based detection for known patterns. But the known patterns aren't defined in the requirements — they're in my design outline feedback as an informal table. If a new pattern is discovered during Phase 0 (say, a consistent misuse of `@Environment` across multiple files), there's no process for adding it to the detection list.

This is minor — the patterns are documented, and adding new ones during review is common sense. But for a spec that's about systematic review, the pattern list should be a living artifact, not scattered across feedback docs.

**Recommendation**: Add an AC to Req 1: "The known-pattern detection list SHALL be maintained in the findings doc and updated when new cross-cutting patterns are discovered during review." This makes the list a first-class artifact rather than an informal reference.

#### F3: Req 4 — Spec 092 component list may be incomplete

Req 4 AC 1 lists 6 components affected by Spec 092: Button-Icon, Progress-Node, Avatar-Base, Input-Checkbox-Base, Input-Radio-Base, Nav-TabBar-Base. I don't have visibility into what Spec 092 actually changed — this list came from Leonardo's R1 feedback. Worth verifying with Ada that these are the complete set. If a 7th component was affected and isn't on this list, we'd miss the render verification.

**Not blocking** — just a verification step before implementation begins.

#### What's Good

- **Req 1 (Phase 0)** formalizes the mechanical grep sweep I proposed. Good — it's now a required step, not an optional optimization.
- **Req 2 AC 4** codifies the consolidated findings doc format. Exactly what I recommended.
- **Req 5 AC 4** escalation path for structural issues (findings → Leonardo → Peter) is the right process. Not everything is a one-liner, and structural fixes need cross-platform assessment.
- **Req 5 AC 5** batch-fix by pattern is smart — if `duration / 1000` appears in 8 files, Lina should fix all 8 in one pass, not 8 separate commits.
- **Req 6** readiness flag updates tied to the compliance test (Spec 086) closes the loop properly.
- **Documentation Requirements Waiver** is appropriate — this is a review sweep, not new development.

---

## Design Feedback

### [THURGOOD R5]

Incorporated Kenya's requirements feedback:

- **F1 (fix ownership)**: Governance decision was made — Peter said "Let's go with Option A" after I recommended Lina-owns-all based on Data's reasoning: clean ownership prevents accountability ambiguity, reviewers who fix lose objectivity, and Lina's test landscape knowledge prevents cascading failures from "trivial" fixes. Kenya's threshold-based reassessment (if blocking count exceeds 30+) is noted as a pragmatic fallback if throughput becomes an issue during Phase 2.
- **F2**: Added Req 1 AC 5 — pattern list maintained in findings docs as a living artifact, updated when new patterns discovered.
- **F3**: Verified Spec 092 component list against design outline — 6 components + TabBar confirmed complete. No missing components.

Data did not provide requirements-specific feedback (design outline feedback covered his concerns).

**Update**: Data provided late requirements feedback:
- **Data F1**: Req 3 AC 2 sharpened — "Compose idioms" now explicitly includes recomposition safety (side effects, remember, recomposition cost). Incorporated.

Requirements approved by both platform agents.

### Data — Android Reviewer Feedback (Late Addition)

**Date**: 2026-04-03

**F1: Req 3 AC 2 — "Compose idioms" should explicitly include recomposition safety.**

AC 2 lists: contract compliance, token-first, TalkBack, Compose idioms, Material convention alignment. "Compose idioms" is broad. The most impactful Compose-specific pitfall is recomposition-unsafe code — side effects outside `LaunchedEffect`/`SideEffect`, mutable state not wrapped in `remember`, expensive operations running on every recomposition. These aren't contract violations or token issues — they're runtime correctness problems invisible in static review but causing jank under real usage (scrolling lists, rapid state changes).

Haven't seen this in Lina's code yet, but haven't reviewed 28 components either.

**Recommendation**: Sharpen AC 2 to "Compose idioms (including recomposition safety)" — or note in tasks as part of the Android review checklist. Not a new requirement, just clarifying what "Compose idioms" means in practice.

Requirements approved. Ready for tasks.

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
Four-phase task structure: Phase 0 (grep sweeps) → Phase 1 (per-component review) → Phase 2 (fixes) → Phase 3 (readiness updates). Kenya and Data parallel in Phases 0–1, Lina in Phase 2, Thurgood verifies Phase 3.

### Kenya — iOS Reviewer Feedback

**Date**: 2026-04-03

**Overall: Well-structured, dependency chain is correct, no blockers. Two refinements.**

#### F1: Task 2.1 doesn't explicitly mention updating the cross-cutting patterns list

Task 1.1 creates `findings-ios.md` with the cross-cutting patterns section. Req 1 AC 5 says the pattern list SHALL be "updated when new cross-cutting patterns are discovered during review." That update happens during Task 2.1 (per-component review), not Task 1.1 (grep sweep). The requirement is traceable, but the task that fulfills the "updated during review" part is 2.1.

**Recommendation**: Add a bullet to Task 2.1: "Update cross-cutting patterns section in `findings-ios.md` when new patterns are discovered during review." Minor — the behavior would happen naturally, but explicit is better for a sweep this size.

#### F2: Task 2.1 — Spec 092 affected components aren't listed explicitly

Task 2.1 says "Include Spec 092 render verification for affected iOS components" as a single bullet. But the 6 affected components are spread across 4 different family batches (Button-Icon in Button, Progress-Node in ProgressIndicator, Avatar-Base in Avatar, Input-Checkbox/Radio in FormInput, Nav-TabBar-Base in Navigation). Easy to miss one during a long review session.

**Recommendation**: List the 6 affected components explicitly in the task bullet, or add a checklist to the findings doc template. Not blocking — I know the list from the requirements doc.

#### F3: Agree with Data's F1 — Task 2.1 should depend on Task 1.1

Data's right. Phase 0 is designed to front-load mechanical issues. If Task 2.1 doesn't formally depend on 1.1, the task tracker doesn't enforce the sequencing. In practice I'd do Phase 0 first, but the dependency should be explicit.

#### What's Good

- **Phase 0 → Phase 1 ordering** is right. Walking into per-component review already knowing which files have the `duration / 1000` bug saves re-discovery time.
- **Tasks 3.1 and 3.2 depend on 2.1 and 2.2 respectively** — Lina can start iOS fixes without waiting for Data's Android review. Maximizes parallelism.
- **Task 3.3 (non-blocking issues)** depends on 3.1 and 3.2 — document after blocking fixes so issue docs reflect final state.
- **Task 4.2 (Thurgood verification)** as the final gate is the right process.
- **No "re-review after fixes" task** — correct. If a fix needs re-review, that's a new finding, not a task.

### Data — Android Reviewer Feedback

**Date**: 2026-04-03

**Overall**: Well-structured. Four phases map cleanly to requirements. Dependencies correct — review before fix, fix before readiness. Family-order batching carried through from design outline feedback. Recomposition safety incorporated into Task 2.2. One substantive note.

**F1: Tasks 2.1/2.2 should depend on Tasks 1.1/1.2 (Phase 0 → Phase 1).**
Phase 0 grep sweep is designed to front-load mechanical issues before per-component review. But Tasks 2.1 and 2.2 don't list Task 1 as a dependency. Read literally, Kenya could start per-component review before her grep sweep is done. In practice we'd sequence correctly, but for task tracking accuracy: Task 2.1 should depend on 1.1, Task 2.2 should depend on 1.2.

**F2: Task 2.2 — "same order as iOS" is fine as a default, not a constraint.**
If Phase 0 reveals one family has significantly more issues than others, I may reorder to front-load the problem family. Noting that family order is a recommendation, not prescriptive. No task change needed — just clarifying my execution flexibility.

---

## Task 3.1 Implementation Assessment (Lina, 2026-04-03)

### Scope Assessment

After reviewing the iOS findings in detail, the blocking fixes are larger than the task description suggests. The 12 blocking issues across 5 components break down into two tiers:

**Tier A — Mechanical swaps (straightforward):**
- P3: Hard-coded focus color → `DesignTokens.accessibilityFocusColor` (Container-Base, Container-Card-Base) — 2 fixes
- P4: Duplicated `View.if` → extract to shared utility or inline (Container-Base, Container-Card-Base) — 2 fixes
- P2: Local motion constants → `DesignTokens.MotionFocusTransition.*` (Container-Card-Base) — 2 fixes
- Progress-Indicator-Label-Base: `labelFontSize: 14` → `DesignTokens.typographyLabelSm.fontSize` — 1 fix

**Tier B — Substantial refactors:**
- P8: Button-VerticalList-Item `extension DesignTokens` with 12 properties — removing this requires updating every reference in the file. Color tokens use `UIColor.label`/`UIColor.systemBlue` (system colors) that need to become generated DesignerPunk colors. Typography tokens are tuples that need to become `Typography` struct references. Motion token path needs restructuring. A second file (`VisualStateStyles.swift`) has its own extension.
- P8: Button-VerticalList-Set `extension DesignTokens` — smaller (1 property) but same pattern.
- P7: Container-Card-Base ~14 module-level hard-coded constants including shadow values that are *wrong* (approximations, not matching generated tokens). Replacing these requires verifying each shadow composite against the generated output.

### Risk

Tier B fixes touch core component files with complex rendering logic. The Button-VerticalList-Item file is ~650 lines with visual state management. Changing token references throughout risks introducing regressions if any generated token name doesn't match exactly.

### Recommendation

Tier A fixes can be done immediately — they're mechanical and low-risk. Tier B fixes need careful execution, ideally with Kenya reviewing the changes since she authored the findings and knows the generated token structure.

Awaiting Peter + Thurgood scope decision before proceeding.
