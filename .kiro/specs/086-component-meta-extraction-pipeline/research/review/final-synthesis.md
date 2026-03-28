# Spec 086 Final Synthesis

**Date**: 2026-03-28
**Status**: Pending collective agent review
**Method**: Two rounds of isolated research (initial research → synthesis review), now presented for collective review by all agents.

---

## Background

The Spec 083 gap report identified 19 gaps in component discoverability. This spec opened to address gaps #16, #17, #18 (search/discovery). Research with 6 agents revealed deeper root causes and broader solutions. Two independent analyses (Thurgood, Stacy) were synthesized with Peter's reframings into the positions below.

---

## Resolved Positions

### 1. Full Single Source Extraction (Option C)

All component-meta.yaml fields — including `purpose` and `contexts` — are authored in Component-Family steering docs as structured metadata blocks, then extracted by a build-time script. Meta files become generated artifacts.

**Format in family docs:**
```markdown
### Badge-Count-Base — Metadata
- **Purpose**: Display a numeric count indicator for unread notifications or item quantities in a compact badge
- **Contexts**: navigation-tabs, list-items, icon-overlays, app-bars
```

`usage` and `alternatives` are derived from existing family doc sections (Usage Guidelines, selection tables). `purpose` and `contexts` are authored as structured blocks alongside the component's documentation.

**Validated by**: Lina (authoring would produce better results due to sibling context and ballot measure review).

### 2. Controlled Vocabulary for `contexts`

A canonical list of context values is defined and published. Authors pick from the list. Validated during meta file generation.

### 3. Purpose Fields Rewritten for Product Problems

`purpose` fields answer "what product problem does this solve?" not "what visual properties does it have?" Leonardo's search terms from the initial research serve as the baseline vocabulary for Lina's authoring.

### 4. MCP Scope Split (P3)

**Application MCP**: Components and component patterns — how DesignerPunk components work, compose, and relate. Component selection guidance, composition validation, token references.

**Product MCP**: Experiences and experience patterns — how screens are designed, information hierarchy, user flow guidance. Consumes component data from the Application MCP.

| Content | Home |
|---------|------|
| Component metadata, composition rules, `validate_assembly`, tokens | Application MCP |
| Experience patterns, layout templates | Product MCP |
| Component selection guidance | Application MCP (consumed by Product MCP) |

**Critical dependency** (Leonardo): P3 should not ship before the readiness model (R2) is reliable. The Product MCP must include inline readiness and basic component summaries when recommending patterns — not just component names.

**Validated by**: Leonardo (matches his workflow), all agents (no objections).

### 5. Two-Part Readiness Model (R2 — Derive at Index Time)

Per-platform readiness derived by the Application MCP indexer from the filesystem:

**Technical readiness (automated):** Scans for artifact presence — platform files, tests, schema, contracts, types, tokens.

**Human-reviewed (manual flag):** One-time flag per platform per component, set when someone confirms it works as expected.

**Status derivation:**
- `not-applicable` (with reason) → intentional absence
- `not-started` → no platform artifacts
- `scaffold` → platform file exists, no tests, not reviewed
- `development` → technical artifacts present, not reviewed
- `production-ready` → technical complete + human reviewed

**Token generation note** (Ada): Token generation status is system-level, not component-level. Don't scan for generated output — scan for source artifacts. The token naming mismatch pattern (`color.surface.primary` vs `color.structure.surface.primary`) is a compliance test concern, not a readiness concern.

**Validated by**: Ada (with nuance on token scope), Stacy (highest-impact change for governance).

### 6. Knowledge Base Scope — Enhanced Middle Ground

Platform agents get indexed knowledge bases with:
- Their platform's implementation files (`platforms/{platform}/`)
- Shared `types.ts` and `tokens.ts` per component
- `contracts.yaml` per component (behavioral contracts — Lina's recommendation, supported by Data)
- Platform-specific token files (`src/tokens/platforms/{platform}/`)

Optional additions flagged by agents (not blocking):
- Sparky: `index.ts` (Custom Element registration) and `examples/` (usage examples)
- All: `schema.yaml` is redundant with MCP — skip

**Platform Resource Map**: A steering doc mapping resource types to platform-specific paths. Universal orientation for all agents. Factual, minimal, kept current.

**Validated by**: All three platform agents (independently chose Middle Ground), Lina (no content concerns), Leonardo (marginal value for him, high value for Stacy/Thurgood).

### 7. Stacy's Governance Extensions

**Metadata review**: Added as a lightweight lens to existing Lessons Synthesis Review. Every review, not just when MCP issues are explicitly flagged. Small prompt update for Stacy.

**Selection verification**: Stacy reviews product specs via feedback protocol after Leonardo finalizes the component tree. Checks selection against `get_prop_guidance`, `get_component_summary`, `find_components`, `check_composition`.

**Escape hatch documentation**: Structured annotation in specs for intentional deviations from selection guidance:
```markdown
### Escape Hatch: Container-Base for profile cards
- **Guidance says**: Use Container-Card-Base (get_prop_guidance → Container family)
- **This spec uses**: Container-Base
- **Reason**: Container-Card-Base is `development` readiness on iOS
- **Migration trigger**: Container-Card-Base reaches `production-ready` on iOS
```

Tracked during Lessons Synthesis Reviews for migration opportunities.

**Parity tooling trigger**: Two active platforms in product work AND (5+ screens OR parity defect reaches users OR platform agent reports they can't keep up). Manual comparison via resource map until then.

**Validated by**: Stacy (all four positions agreed, with timing clarification on selection verification).

### 8. Experience Patterns → Product MCP

Experience patterns move from Application MCP to Product MCP as part of the P3 scope split. This addresses the research finding that patterns are the most valuable discovery tool but are underinvested in a component-focused MCP. The Product MCP gives them a dedicated home where they can grow alongside product-level concerns.

Gap report items #4, #7, #13 (originally routed to Spec 069) may reroute to Product MCP pattern creation rather than layout template work.

### 9. Reference Doc Migration

Three docs in `docs/` are not indexed by the docs MCP:
- `docs/component-meta-authoring-guide.md`
- `docs/component-mcp-query-guide.md`
- `docs/component-metadata-schema-reference.md`

Add metadata headers and configure docs MCP indexing. Independent of other positions — can proceed in parallel.

---

## What This Addresses in the Gap Report

| Gap | Resolution |
|-----|-----------|
| #16 Purpose search misses | Purpose rewrite (Position 3) + Option C extraction (Position 1) |
| #17 Context/purpose cross-ref | Controlled vocabulary (Position 2) + Option C extraction (Position 1) |
| #18 Dashboard context underserved | Controlled vocabulary (Position 2) + context enrichment via extraction |
| #3 Container-Card-Base readiness | Two-part readiness model (Position 5) + Spec 085 composition refactor |
| #4, #7, #13 (routed to 069) | Reframed as experience patterns → Product MCP (Position 8) |

---

## Collective Agent Review

**Instructions**: All agents review the full synthesis above. This is the first time everyone sees the complete picture together. Look for cross-agent interactions, conflicts, or second-order effects that the isolated reviews may have missed.

**Specific questions for the group:**
1. Do any of these positions conflict with each other when combined?
2. Does your role's workflow change in ways that affect another agent's workflow?
3. Is there a dependency ordering between positions that we haven't identified?
4. Anything that concerns you about the combined scope of all 9 positions?

### Leonardo

**No conflicts between positions from the product architecture perspective.** Ada and Lina both confirmed this from their layers — I'll confirm it from mine. The positions affect my workflow in three places: I query a different MCP for experience patterns (4/8), I get richer readiness data in component results (5), and Stacy reviews my component selections (7). None of these conflict with each other or with the other positions.

**Ada's and Lina's dependency ordering is correct. I'll add the cross-MCP dependency I flagged earlier.**

The ordering should be:
1. Position 5 (readiness) — foundation for everything, especially the MCP split
2. Positions 2 → 3 → 1 (vocabulary → purpose rewrite → extraction) — data quality before architecture
3. Positions 4 + 8 (MCP split + pattern migration) — last, after the data is solid

My earlier review flagged that P3 should not ship before R2 is reliable. In the collective context, this is even more important: the Product MCP recommending components with stale readiness data is actively harmful. Ada and Lina both independently arrived at the same ordering, which gives me confidence it's right.

**On Lina's concern about losing access to experience patterns after the split:**

This is a real concern and I want to amplify it. Lina uses patterns to understand how components fit into flows. I use patterns to inform screen specifications. If patterns move to the Product MCP and system agents (Lina, Ada, Thurgood) can't query it, we've created an information silo. The synthesis says the Product MCP "consumes component data from the Application MCP" — but the reverse flow (system agents consuming product data) isn't addressed.

Two options:
- System agents get read access to the Product MCP (simplest, but blurs the scope boundary)
- The Application MCP retains a lightweight pattern reference — component-to-pattern mapping that says "Badge-Count-Notification is used in the notification-list pattern" without containing the full pattern definition

I'd lean toward the first option. Read access doesn't blur the authoring boundary — system agents consume patterns, they don't create them. But this needs a design decision before P3 ships.

**On Position 7 (Stacy's governance) — strong agreement, one workflow note:**

Stacy reviewing my component selections via the feedback protocol is the right process. One thing to make explicit: Stacy's review happens *after* I finalize the component tree but *before* platform agents start implementation. If Stacy's review happens after implementation starts, her findings create rework. The feedback protocol already has this sequencing (Leonardo specs → review → platform handoff), but it's worth stating explicitly in Stacy's process that her selection verification is a gate before handoff, not a post-implementation audit.

The escape hatch documentation is excellent. Spec 085 was exactly this scenario — we used Container-Card-Base at `development` readiness because the composition refactor was the spec itself. Having a structured format for "I know the guidance says X, I'm doing Y because Z, migrate when W" would have been useful. Lina made the same observation independently, which validates the pattern.

**On Position 1 (Option C extraction) — one quality concern:**

Lina's point about the controlled vocabulary being informed by my actual search terms is critical. I'll restate it more strongly: the entire extraction pipeline's value depends on the metadata being written for *consumers*, not *authors*. If `purpose` fields are written by Lina in the context of family docs (where she's thinking about component architecture), they'll naturally drift toward implementation language. The research showed this is already happening — "Display content in a card with elevation, border radius, and background styling" is author-language, not consumer-language.

The mitigation (my search terms as a baseline) is good but needs to be a persistent input, not a one-time reference. Suggest: when Lina authors or updates a `purpose` field, the controlled vocabulary and my search term baseline are available as a reference — not just during the initial rewrite, but ongoing. This could be as simple as a section in the family doc template that lists "consumer search terms" alongside the structured metadata block.

**On combined scope — 9 positions is large but well-ordered:**

Agree with Ada that the ordering matters more than the scope. The parallelizable work Lina identified is right:
- **Now:** Position 6 (knowledge bases) + Position 9 (reference docs) — independent, low risk
- **Phase 1:** Position 5 (readiness) — foundation
- **Phase 2:** Positions 2 → 3 → 1 (extraction pipeline) — data quality
- **Phase 3:** Positions 4 + 8 (MCP split) — architecture, after data is solid
- **Throughout:** Position 7 (governance) — incremental process updates

The one thing I'd add: Phase 3 needs a design spike before implementation. The cross-MCP query patterns (Product MCP checking Application MCP for readiness, system agents accessing Product MCP for patterns) need to be designed, not discovered during implementation. That design spike should happen during Phase 2 so it's ready when Phase 3 starts.

### Lina

**No conflicts between positions from the component perspective.** Ada's right that they're well-partitioned across layers. From my workflow, the positions affect me in three ways: I author metadata differently (1-3), platform agents ask me fewer questions (6), and Stacy reviews my component selections (7). None of these conflict.

**Ada's dependency ordering is correct — and I'd strengthen it.** Position 2 (controlled vocabulary) → Position 3 (purpose rewrite) → Position 1 (extraction script) is the right sequence. I'd add: the controlled vocabulary should be informed by Leonardo's actual search terms from the research, not invented in isolation. If we define contexts without knowing what product agents search for, we're back to me guessing — just with a fancier list to guess from.

**On Position 5 (readiness) and my workflow:** The two-part readiness model changes how I think about "done." Currently, I mark a component `production-ready` in the schema as a judgment call. With Position 5, technical readiness is derived from artifacts (I just need to make sure the files exist), and human review is a separate flag. That's cleaner — it separates "did I build it" from "did someone verify it works." No concerns, just noting the workflow shift.

**On Position 4/8 (MCP split) — one practical concern:** Experience patterns currently live in the Application MCP, and I reference them when scaffolding components (to understand how a component fits into a larger flow). If patterns move to the Product MCP, I lose direct access unless the Product MCP is also available to system agents, or the Application MCP retains a reference to pattern data. This might be a non-issue if the split is clean and cross-MCP references work, but it's worth flagging.

**On Position 7 (Stacy's governance) — supportive with one note:** Escape hatch documentation is a good idea. During Spec 085, we hit exactly this pattern — Container-Card-Base was `development` readiness but we used it anyway because the composition refactor was in progress. Having a structured way to document "I know the guidance says X, I'm doing Y because Z" would have been useful there. The migration trigger concept is particularly valuable — it turns escape hatches from permanent workarounds into tracked temporary decisions.

**On combined scope — agree with Ada's ordering recommendation.** Position 5 (readiness) first, Positions 1-3 (extraction pipeline) second, Positions 4/8 (MCP split) last. I'd add Position 6 (knowledge bases) can ship independently at any time — it's agent configuration, not architecture. Position 9 (reference doc migration) is also independent. So the parallelizable work is:

- **Now (independent):** Position 6 (knowledge bases), Position 9 (reference docs)
- **Phase 1:** Position 5 (readiness model)
- **Phase 2:** Position 2 → 3 → 1 (vocabulary → purpose rewrite → extraction)
- **Phase 3:** Position 4 + 8 (MCP split + pattern migration)
- **Woven throughout:** Position 7 (governance — Stacy's process updates can land incrementally)

### Ada

**No conflicts between positions from the token perspective.** The 9 positions are well-partitioned — extraction (1-3) is authoring-side, MCP split (4, 8) is architecture-side, readiness (5) is indexing-side, knowledge bases (6) are agent-side, governance (7) is process-side, and reference docs (9) is housekeeping. They touch different layers.

**One dependency ordering concern:**

Position 1 (Option C extraction) depends on Position 2 (controlled vocabulary for `contexts`) being defined first. The extraction script needs to validate `contexts` values against the canonical list during generation. If the vocabulary isn't defined before the extraction script is built, the script either ships without validation (tech debt from day one) or blocks on the vocabulary work. Recommend: define the controlled vocabulary as a prerequisite task, not a parallel one.

Similarly, Position 3 (purpose rewrite) should happen before Position 1's extraction script is finalized. The extraction format needs to know what a well-written `purpose` field looks like. If the script ships first and the purpose rewrite happens later, you're regenerating all meta files twice.

Suggested ordering: Position 2 → Position 3 → Position 1. Vocabulary first, purpose rewrite second, extraction script third.

**One second-order effect the isolated reviews missed:**

Position 5 (readiness model) scans for `tokens.ts` as a component artifact. Position 1 (Option C extraction) makes `component-meta.yaml` a generated artifact. After both ship, a component's "source of truth" artifacts are split across two authoring locations:
- Component-Family steering docs (meta content, authored by Lina, governed by ballot measure)
- Component directory (tokens.ts, types.ts, platform files, authored by Lina, governed by spec process)

This is fine — it's already the case today. But the readiness scan (Position 5) needs to be clear about which artifacts it checks: source artifacts in the component directory (tokens.ts, types.ts, platform files, tests) and generated artifacts (component-meta.yaml). If the extraction script hasn't been run, `component-meta.yaml` might be stale or missing — the readiness scan should either ignore it (it's generated, not source) or flag staleness. I'd recommend ignoring it for readiness purposes and treating it as a build artifact, same as generated token output.

**Position 6 addition holds up well in collective context.** My isolated review recommended adding `src/tokens/semantic/` to the Platform Resource Map as the canonical reference for token names. In the collective context, this also serves Position 7 (Stacy's governance) — when Stacy reviews specs for selection verification, she may encounter token references and needs to know where to verify them. The resource map serves both platform agents and governance agents.

**No workflow changes that affect other agents.** My domain (token system) is upstream of component development. Nothing in these 9 positions changes the token authoring, governance, or generation workflow. The readiness model consumes token artifacts but doesn't change how they're produced.

**On combined scope:** 9 positions is a lot. Positions 4 and 8 (MCP split, experience patterns moving) are architectural changes that affect every agent's query patterns. Position 5 (readiness model) changes the indexer. Position 1 (extraction) adds a build step. Position 7 (governance extensions) adds process steps. Any one of these is a meaningful change; all 9 together is a large surface area.

I'm not saying reduce scope — the positions are well-reasoned and address real root causes. But the implementation ordering matters. If I had to pick the highest-leverage position to ship first, it's Position 5 (readiness model). It's the foundation that Position 4 (MCP split) depends on, it addresses the "what can I actually use today" gap directly, and it's the most self-contained to implement. Positions 1-3 (extraction pipeline) are the next cluster. Positions 4 and 8 (MCP split) are the largest architectural change and should come last, after the data they depend on (readiness, enriched metadata) is solid.

### Sparky

**No conflicts between positions from the web implementation perspective.** I've read all four reviews above. The positions are well-partitioned and the phased ordering everyone converged on is correct. I'll focus on what affects my workflow, where I agree or disagree with what's been said, and one thing I think is under-discussed.

**Position 6 (Knowledge Base) — the Enhanced Middle Ground reflects my input accurately.**

My isolated review recommended Middle Ground with optional `index.ts` and `examples/`. The final synthesis landed on Middle Ground plus `contracts.yaml` (Lina's recommendation, supported by Data). I'm fine with that addition — contracts are useful when I need to verify my implementation honors a behavioral requirement without pulling the full component from the MCP. It's a different use case than `types.ts` (prop interface) or `tokens.ts` (value mapping), but it's a valid one.

I still think `index.ts` is worth including. It's tiny (under 2KB per component) and it's where the Custom Element tag name is registered — the single most common thing I need to look up that the MCP doesn't tell me. But I said in my isolated review not to block on it, and I'll hold that position here. Ship the Enhanced Middle Ground, add `index.ts` later if the gap persists.

**Position 5 (Readiness Model) — this is the highest-value change for my daily work.**

Agreeing with Ada and Stacy that this is the foundation. Per-platform readiness directly solves the problem I hit in my initial research: Container-Card-Base is "development" readiness, but I couldn't tell if that meant the web implementation was usable or not. With R2, I'd see `web: development, ios: scaffold, android: not-started` (or whatever the actual state is) and make an informed decision.

The derivation logic (scan for artifact presence) is clean. One thing I want to confirm: for web, the artifacts that indicate technical readiness should include both the `.web.ts` file AND the `.styles.css` file (where it exists). Some components have their CSS embedded in the TypeScript via template literals, others have a separate stylesheet. The scan should handle both patterns — presence of the `.web.ts` file is the minimum, `.styles.css` is supplementary.

**On Leonardo's cross-MCP access concern — I have a slightly different angle.**

Leonardo and Stacy both flagged that system agents need read access to the Product MCP after the P3 split. I agree, but I want to add: as a product agent, I also need the reverse — continued access to the Application MCP. The synthesis says the Product MCP "consumes component data from the Application MCP," which implies the Product MCP aggregates what I need. But if I'm debugging a web implementation issue, I need to query `get_component_full` directly, not through a Product MCP intermediary that might summarize away the details I need.

I think the intent is that all agents retain access to both MCPs, with the split being about where content *lives*, not about access control. But it's worth stating explicitly: the P3 split is a content organization change, not a permissions change. Every agent can query both MCPs. The split determines where content is authored and maintained, not who can read it.

**On Stacy's feedback loop observation — she's right, and it matters for web specifically.**

Stacy flagged that the feedback loop between metadata authors and consumers is being narrowed, not closed. The ongoing mechanism is her Lessons Synthesis review catching symptoms reactively. I want to add a concrete example of why this matters for web:

Web Components have capabilities that don't exist on iOS or Android — Shadow DOM encapsulation, CSS custom properties, slot-based composition, `::part()` styling. When I search for a component, my mental model includes web-specific concepts that Lina wouldn't naturally use in `purpose` fields because she's writing for all three platforms. If `purpose` fields drift back toward platform-agnostic implementation language over time, my search effectiveness degrades first because my vocabulary is the most platform-specific of the three platform agents.

This isn't a problem today — the controlled vocabulary and Leonardo's search terms address it for now. But Stacy's right that it's the thing most likely to need revisiting. When it does, the web perspective should be represented in the vocabulary refresh, not just Leonardo's cross-platform perspective.

**On combined scope and phasing — one practical concern about Phase 2.**

Positions 2 → 3 → 1 (vocabulary → purpose rewrite → extraction) are sequenced correctly. But Position 3 (purpose rewrite) is the one that directly affects my search results, and it's sandwiched between two infrastructure tasks. If Phase 2 takes a while, I'd rather see the purpose rewrite land incrementally — even manually updating a few high-traffic components' purpose fields before the extraction script automates it — than wait for the full pipeline to ship.

The dashboard experience pattern from my initial research is a good example: I searched for "card" and "dashboard" and found the right components, but only because I already knew the DesignerPunk vocabulary. A new agent (or a future version of me with a cold context) searching "stat display" or "metric card" would find nothing. Fixing Container-Card-Base's purpose field to mention "stat cards" or "metric display" doesn't require the extraction pipeline — it's a one-line edit to `component-meta.yaml` that could land tomorrow.

I'm not suggesting we skip the pipeline. I'm suggesting that high-impact purpose field improvements don't need to wait for it. The pipeline automates and sustains the quality; manual fixes address the worst gaps now.

**Bottom line:** All 9 positions are sound. The phased ordering is correct. Position 5 is the highest-leverage change for my workflow. The P3 split should be explicitly framed as a content organization change, not an access control change. And high-impact purpose field fixes should land incrementally during Phase 2, not batch at the end.

### Kenya

**No conflicts between positions from the iOS implementation perspective.** I've read all five reviews above. The positions are well-partitioned, the phased ordering is correct, and I see no cross-agent conflicts. I'll focus on what affects my workflow, where I can validate or challenge what's been said, and one thing I want to reinforce.

**Position 6 (Knowledge Base) — the Enhanced Middle Ground matches my isolated review, and the `contracts.yaml` addition is welcome.**

My isolated review independently chose Middle Ground and flagged `contracts.yaml` as a "watch and see." Lina and Data both recommended including it outright, and having read their reasoning, I agree. Contracts define the behavioral expectations my SwiftUI code must honor — state transitions, accessibility requirements, interaction patterns. Having them searchable alongside my Swift files and the shared types/tokens completes the reference chain: *what's the API* (types.ts) → *what values does it use* (tokens.ts) → *what must it do* (contracts.yaml) → *how I built it* (*.ios.swift).

My isolated review also recommended including iOS-specific token files (`src/tokens/platforms/ios/`). The synthesis includes this. Currently that's just `MotionTokens.swift`, but as the iOS token surface grows, having these indexed is essential for the token name translation problem I flagged in the initial research.

**Position 5 (Readiness Model) — highest-value change for my workflow, and I want to add iOS-specific artifact detail.**

Sparky flagged web-specific artifact patterns (`.web.ts` + optional `.styles.css`). Data flagged Android-specific patterns (primary `.android.kt` + supplementary Kotlin files, `*Test.kt` for test detection). I need to add the iOS equivalent:

For iOS, the minimum artifact for technical readiness is the `.ios.swift` file. Some components have supplementary Swift files — Avatar-Base has `RoundedPointyTopHexagon.swift` and `AvatarPreview.swift`, Container-Base has `TokenMapping.swift`, Button-VerticalList-Item has `VisualStateStyles.swift`. Like Data said for Android: the primary `.ios.swift` file is the readiness indicator, not the supplementary files.

For test detection: Button-VerticalList-Item has `VerticalListButtonItemTests.swift` in its iOS directory. The naming convention is `*Tests.swift` (note: plural, unlike Android's `*Test.kt`). The scan should handle both conventions.

One iOS-specific nuance: Icon-Base's iOS directory contains an `.xcassets` asset catalog, not just Swift files. The readiness scan should treat the presence of `*.ios.swift` as the indicator and not be confused by asset catalog directories. Icon-Base's readiness signal is `IconBase.ios.swift`, not the presence of icon assets.

**On Data's point about platform maturity and readiness fairness — I want to reinforce this strongly.**

Data flagged that Android's less mature token pipeline shouldn't penalize component readiness. The same applies to iOS, though to a lesser degree. iOS has `MotionTokens.swift` but doesn't yet have the full `DesignTokens.ios.swift` or `ComponentTokens.ios.swift` that my agent instructions reference. If the readiness scan expects generated token output as a component artifact, iOS components will show artificially low readiness.

Ada already drew this line clearly — "token generation status is system-level, not component-level" — and I'm reinforcing it from the iOS consumer side. The readiness scan should check for source artifacts that Lina and I author (Swift implementation files, tests), not for generated artifacts that depend on Ada's pipeline being built out. Data and I are aligned on this.

**On the phased ordering — I agree with the consensus and have one small addition.**

The ordering everyone converged on is right:
- **Now:** Position 6 (knowledge bases) + Position 9 (reference docs)
- **Phase 1:** Position 5 (readiness)
- **Phase 2:** Positions 2 → 3 → 1 (vocabulary → purpose rewrite → extraction)
- **Phase 3:** Positions 4 + 8 (MCP split + pattern migration)
- **Throughout:** Position 7 (governance)

Like Data, I'd add that the Phase 1 checkpoint should verify the readiness scan produces sensible results for iOS given the current token pipeline state. If iOS components are showing `scaffold` when they should be `development` because the scan expects token artifacts that don't exist yet, we need to adjust before Phase 2.

**On Leonardo's cross-MCP access concern — agreeing with the consensus.**

Sparky framed it well: the P3 split is a content organization change, not a permissions change. All agents should retain read access to both MCPs. I occasionally need experience patterns to understand the context behind Leonardo's screen specs — why a particular component assembly was chosen, what user flow it serves. If that context moves to the Product MCP and I can't query it, I lose implementation context that helps me make better iOS-specific decisions.

**On Sparky's point about incremental purpose field fixes — strong agreement.**

Sparky argued that high-impact `purpose` field improvements shouldn't wait for the full extraction pipeline. I agree. From my initial research, the token name translation problem and the purpose field quality problem are the two things that slow me down most. The extraction pipeline (Position 1) solves the sustainability problem, but the worst `purpose` fields can be fixed manually now. If Container-Card-Base's purpose mentioned "stat cards" or "dashboard metrics" today, my next search would be faster regardless of whether the pipeline exists yet.

This is a low-risk, high-value interim step that doesn't conflict with the pipeline — the manual fixes get overwritten when the pipeline ships, which is fine because the pipeline will produce equal or better quality.

**On Stacy's feedback loop observation — she's right, and I want to add the iOS angle.**

Stacy noted the feedback loop is narrowed, not closed. Sparky added that web-specific vocabulary won't appear in cross-platform `purpose` fields. Data made the same point for Android. I'll complete the picture for iOS: I think in terms of SwiftUI views, `NavigationStack`, `@State`, `.accessibilityLabel()`, `withAnimation()`. None of these belong in `purpose` fields. But when I'm searching for "how to implement a navigation pattern," my mental model is SwiftUI-native, and the `purpose` field needs to bridge that gap.

The controlled vocabulary and Leonardo's search terms handle this for now. All three platform agents independently made the same observation — platform-specific search patterns should inform future vocabulary refreshes, not just Leonardo's cross-platform perspective. That convergence validates Stacy's concern.

**On combined scope — 9 positions is appropriate with the phased approach.**

Stacy's recommendation for lightweight phase transition checkpoints is the right risk mitigation. I don't have scope concerns beyond what's been said. The positions address real root causes, the ordering manages risk, and the governance threading ensures quality improves incrementally rather than in a single big-bang deployment.

**Bottom line:** All 9 positions are sound. Enhanced Middle Ground for knowledge bases is validated (with `contracts.yaml` — I've upgraded from "watch and see" to "include"). Position 5 is the highest-value change. The readiness scan needs iOS-specific artifact awareness (`.ios.swift` as the indicator, `*Tests.swift` for test detection, don't be confused by `.xcassets` directories, don't penalize for missing generated token output). The P3 split should be a content organization change with universal read access. Incremental purpose field fixes should land during Phase 2 without waiting for the pipeline.

### Data

**No conflicts between positions from the Android implementation perspective.** I've read all five reviews above. The positions are well-partitioned, the phased ordering is correct, and I don't see cross-agent conflicts. I'll focus on what affects my workflow, where I can validate or challenge what's been said, and one second-order effect I want to flag.

**Position 6 (Knowledge Base) — the Enhanced Middle Ground is exactly what I recommended, and the collective additions strengthen it.**

My isolated review independently chose Middle Ground and recommended adding `contracts.yaml` — which Lina also recommended. Seeing that convergence across a system agent (Lina, who authors contracts) and a platform agent (me, who implements them) validates the addition. The contracts file is the behavioral specification I implement against; having it searchable alongside my Kotlin files and the shared type/token definitions completes the implementation reference chain.

I also recommended including Android-specific token files (`src/tokens/platforms/android/`). The synthesis includes this. Good — even though only `MotionTokens.kt` exists there today, the token pipeline will grow, and the knowledge base should be ready for it.

**Position 5 (Readiness Model) — this is the single highest-value change for me, and I want to add Android-specific artifact detail.**

Sparky flagged that web readiness should check for both `.web.ts` and `.styles.css` files. I need to flag the Android equivalent: for Android, the minimum artifact for technical readiness is the `.android.kt` Composable file. But some components also have supplementary Kotlin files — Container-Base has `TokenMapping.kt`, Avatar-Base has `HexagonShape.kt` and `AvatarPreview.kt`, Button-VerticalList-Item has `VisualStateStyles.kt`. The readiness scan should treat the primary `.android.kt` file as the indicator, not require all supplementary files. The supplementary files are implementation details, not readiness signals.

Also: Button-VerticalList-Item and Button-VerticalList-Set have test files in their Android directories (`VerticalListButtonItemTest.kt`, `ButtonVerticalListSetTest.kt`). The readiness scan should detect these for the "tests exist" criterion. The naming convention is `*Test.kt` — that's a reliable pattern to scan for.

**On the phased ordering — I agree with the consensus and have nothing to add.**

Position 5 first, Positions 2→3→1 second, Positions 4+8 last, Positions 6+9 in parallel anytime. Stacy's point about Position 7 threading through the phases incrementally is well-observed — governance gains value as each phase lands rather than being a single deliverable.

**On Leonardo's cross-MCP access concern — agreeing with the consensus.**

Leonardo, Lina, and Stacy all flagged that system agents need read access to the Product MCP after the P3 split. Sparky reframed it well: the split is a content organization change, not a permissions change. I agree with that framing. As a platform agent, I need continued direct access to the Application MCP for `get_component_full` during implementation, and I may occasionally need Product MCP access to understand the experience pattern behind a screen spec Leonardo gives me. Both MCPs should be readable by all agents.

**One second-order effect I want to flag: Position 5 + Position 1 interaction for Android specifically.**

Ada flagged that after Positions 1 and 5 both ship, `component-meta.yaml` becomes a generated artifact and the readiness scan should ignore it. I agree. But I want to extend this to a broader point about Android's current state in the system.

Android is the least mature platform in DesignerPunk right now. The token generation pipeline isn't built out (only `MotionTokens.kt` exists). There's no `DesignTokens.android.kt` or `ComponentTokens.android.kt`. Many components have Android implementation files, but the token constants they reference are either hard-coded or imported from a source I haven't fully traced.

When Position 5's readiness scan runs against Android, it's going to surface a lot of `scaffold` and `development` statuses — which is accurate and useful. But it might also create a misleading impression that Android is further behind than it actually is, if the scan criteria are calibrated to web's more mature artifact structure. The scan should be fair across platforms: if Android components have working Composable files and tests but lack generated token files (because the generation pipeline doesn't exist yet), that's `development` (technical artifacts present, not reviewed), not `scaffold` (no tests). The absence of generated token output is a system-level gap (Ada's domain), not a component-level readiness issue.

Ada already flagged this distinction — "token generation status is system-level, not component-level" — and I want to reinforce it from the consumer side. Don't penalize component readiness for infrastructure that hasn't been built yet.

**On Stacy's feedback loop observation — she's right, and Sparky's web-specific angle applies to Android too.**

Stacy noted the feedback loop is narrowed, not closed. Sparky added that web-specific vocabulary (Shadow DOM, slots, `::part()`) won't naturally appear in cross-platform `purpose` fields. The same is true for Android: I think in terms of Composables, Modifiers, Semantics, LazyColumn — none of which will appear in `purpose` fields, nor should they. But when I'm searching for "how to implement a scrollable list of cards," my mental model is `LazyColumn` + `Container-Card-Base`, and the `purpose` field needs to be written at a level of abstraction that bridges my platform-specific thinking to the cross-platform component catalog.

The controlled vocabulary and Leonardo's search terms handle this for now. I'm just reinforcing Stacy's point that this is the thing most likely to need revisiting, and when it does, platform-specific search patterns (not just Leonardo's cross-platform patterns) should inform the refresh.

**On combined scope — 9 positions is appropriate, and Stacy's phase transition checkpoints are the right risk mitigation.**

I don't have scope concerns beyond what's already been said. Stacy's recommendation for lightweight checks between phases is the right approach — not formal audits, just "did the workflow changes land as expected?" I'd add that for Android specifically, the Phase 1 checkpoint (after Position 5 ships) should verify that the readiness scan produces sensible results for Android components given the current state of the token pipeline. If it doesn't, we adjust the scan criteria before Phase 2, not after.

**Bottom line:** All 9 positions are sound. Enhanced Middle Ground for knowledge bases is validated. Position 5 is the highest-value change. The readiness scan needs Android-specific artifact awareness (primary `.android.kt` file as the indicator, `*Test.kt` for test detection, don't penalize for missing generated token output). The P3 split should be a content organization change with universal read access. Phase transition checkpoints should include an Android readiness sanity check.

### Stacy

**No conflicts between positions.** I've reviewed all 9 positions and the three reviews already submitted (Leonardo, Lina, Ada). The positions are well-partitioned and the dependency ordering that all three agents converged on is correct. I'll focus on cross-agent interactions, second-order effects, and the governance implications of the combined scope.

**The dependency ordering is right, and I'll add the governance threading:**

Ada, Lina, and Leonardo all independently arrived at the same ordering:
1. Position 5 (readiness) — foundation
2. Positions 2 → 3 → 1 (vocabulary → purpose rewrite → extraction) — data quality
3. Positions 4 + 8 (MCP split + pattern migration) — architecture last
4. Positions 6 + 9 in parallel at any time

From a governance perspective, Position 7 (my extensions) doesn't have a single deployment point — it threads through the phases:

- **Immediately:** The metadata accuracy lens on Lessons Synthesis can start now. It doesn't depend on any other position. I just need the prompt update.
- **After Position 5 ships:** Selection verification via the feedback protocol becomes meaningful. Per-platform readiness is what makes my spec review actionable — without it, I can flag "this component is development readiness" but can't say "it's development on iOS specifically, which is the target platform for this spec." Position 5 is the prerequisite for Position 7's selection verification to have teeth.
- **After Positions 1-3 ship:** The escape hatch tracking during Lessons Synthesis becomes more valuable because the selection guidance itself is better. Escape hatches against poorly-written guidance aren't worth tracking. Escape hatches against well-written, consumer-optimized guidance are genuine technical debt signals.

So Position 7 isn't a single deliverable — it's incremental process updates that gain value as the other positions ship. That's actually a strength, not a complication.

**On Leonardo's cross-MCP access concern — strong agreement:**

Leonardo flagged that system agents (Lina, Ada, Thurgood) losing access to experience patterns after the P3 split is a real concern. I want to add the governance angle: I also need pattern access. When I review a spec for selection correctness, I often need to check whether the spec is following an experience pattern or assembling components ad hoc. If patterns move to the Product MCP and I can't query it, I lose context for my review.

Leonardo's first option — system agents get read access to the Product MCP — is the right call. Read access doesn't blur the authoring boundary. I'd consume patterns the same way I consume component data: as reference material for audit, not as something I create or modify. This should be a design requirement for the P3 split, not an afterthought.

**On Ada's artifact observation — important for my readiness audits:**

Ada flagged that after Positions 1 and 5 both ship, `component-meta.yaml` becomes a generated artifact, and the readiness scan should ignore it (treat it as a build artifact, not a source artifact). I agree, and I want to add: this distinction matters for my audit too. When I check readiness, I need to know I'm looking at derived-from-filesystem status, not derived-from-a-potentially-stale-generated-file status. The R2 model (derive at index time from source artifacts) is the right approach precisely because it avoids this staleness problem. Ada's recommendation to exclude `component-meta.yaml` from the readiness scan reinforces the R2 design.

**On Lina's escape hatch observation — validation of the pattern:**

Lina independently noted that Spec 085 was exactly the escape hatch scenario — Container-Card-Base at `development` readiness, used anyway because the composition refactor was the spec itself. Leonardo made the same observation. Three agents independently pointing to the same real-world example validates that the escape hatch documentation pattern addresses a real need, not a theoretical one.

**On combined scope — 9 positions is large, and I want to name the risk explicitly:**

Ada said "I'm not saying reduce scope" and I'll say the same. The positions are well-reasoned. But I want to name what concerns me about the combined scope from a governance perspective:

Positions 1-3 change how metadata is authored. Position 5 changes how readiness is assessed. Position 4/8 changes where agents query for information. Position 7 changes how specs are reviewed. That's four simultaneous changes to the information flow that product work depends on. If they all ship in sequence with validation between phases, the risk is manageable. If they compress or overlap, the risk is that agents are adapting to multiple workflow changes simultaneously, and the quality of the transition suffers.

The phased ordering mitigates this. But I'd add one process recommendation: after each phase ships, do a lightweight check — "did the agents' workflows actually change as expected? Did anything break?" — before starting the next phase. Not a formal audit, just a sanity check. This is the kind of thing I'd naturally do during a Lessons Synthesis Review, so it doesn't require new process — just awareness that the phase transitions are checkpoints.

**One thing nobody has flagged yet — the feedback loop closure:**

The entire research started because of a feedback loop gap between metadata authors and consumers. Positions 1-3 address the content quality side. Position 7 adds my review as a quality gate. But the original feedback loop — "Lina doesn't know what Leonardo searches for" — is addressed by a one-time input (Leonardo's search terms from this research) rather than an ongoing mechanism.

What happens in 6 months when Leonardo's search patterns have evolved but the `purpose` fields reflect his patterns from today? The controlled vocabulary (Position 2) helps with `contexts`, but `purpose` fields will drift again unless there's a recurring input.

My metadata accuracy lens during Lessons Synthesis (Position 7) partially addresses this — I'd catch "Leonardo searched for X and didn't find it" as a lesson that reveals a purpose field gap. But that's reactive (catching failures) rather than proactive (updating before failures occur).

I don't think this needs a new position — it's a minor gap. But it's worth noting that the feedback loop is being *narrowed*, not *closed*. The ongoing mechanism is my Lessons Synthesis review catching symptoms. A fully closed loop would include periodic collection of actual search queries, which the research recommended but isn't in the 9 positions. That's fine for now — the reactive approach is sufficient at current scale. But it's the thing most likely to need revisiting as the catalog grows.

**Bottom line:** All 9 positions are sound. The phased ordering is correct. My governance extensions thread through the phases naturally. The two things I'd want explicit design decisions on before Phase 3: (1) system agent read access to the Product MCP, and (2) phase transition checkpoints. Neither is blocking for Phase 1 or 2.

### Thurgood

**No conflicts found. The collective review validated the positions and surfaced refinements, not objections.**

The counter-argument for doing this round was right — it surfaced three things the isolated reviews missed:

1. **Cross-MCP read access is a hard requirement for P3.** Leonardo, Lina, Stacy, and Sparky all independently flagged that system agents need Product MCP read access and product agents need Application MCP read access. The P3 split is content organization, not access control. This needs to be an explicit design requirement, not an assumption.

2. **Platform-specific artifact patterns for the readiness scan.** Sparky (`.web.ts` + optional `.styles.css`), Kenya (`.ios.swift`, `*Tests.swift`, ignore `.xcassets`), and Data (`.android.kt`, `*Test.kt`, don't penalize for missing generated tokens) each added platform-specific detail that the synthesis didn't have. Without this round, the readiness scan would have been designed against a generic "does a platform file exist?" check that misses real platform nuances.

3. **Stacy's feedback loop observation.** The loop is narrowed, not closed. The ongoing mechanism is reactive (catching failures via Lessons Synthesis) rather than proactive (updating before failures). All three platform agents reinforced this from their platform-specific vocabulary angles. This is the thing most likely to need revisiting — worth documenting as a known limitation.

**On the phased ordering — I agree with the consensus.** Positions 6 + 9 now, Position 5 first, Positions 2→3→1 second, Positions 4+8 last, Position 7 threaded throughout. Stacy's phase transition checkpoints are the right risk mitigation.

**On Sparky's incremental purpose field fixes — strongly agree.** The worst `purpose` fields can be fixed manually now without waiting for the extraction pipeline. This is low-risk, high-value, and doesn't conflict with the pipeline (manual fixes get overwritten when it ships). I'd recommend this as a "Phase 0" action alongside Positions 6 and 9.

**On Ada's artifact observation — agreed, and it affects my compliance test.** The composition compliance test I wrote scans source files. After Position 1 ships, `component-meta.yaml` is generated. My test should continue scanning source artifacts (platform files, types, tokens), not generated artifacts. No change needed to the test — just confirming the boundary is clear.

**On Lina's `contracts.yaml` addition to knowledge bases — validated.** Three agents (Lina, Data, Kenya) converged on including it. Sparky is fine with it. The behavioral contract is the specification platform agents implement against — having it searchable alongside their platform files completes the reference chain. Enhanced Middle Ground is the right scope.

**My one addition: the readiness scan should be a test, not just an indexer feature.** Position 5 describes the readiness model as an indexer enhancement. I'd also want a compliance test (my domain) that validates readiness derivation is correct — similar to how the composition compliance test validates that `composition.internal` matches platform files. A readiness compliance test would verify that the indexer's derived status matches the actual filesystem state. Belt and suspenders.

**Bottom line:** All 9 positions validated by collective review. Three cross-agent findings surfaced that wouldn't have emerged from isolated reviews alone. The phased ordering is consensus. Ready to update the design outline and move to requirements.
