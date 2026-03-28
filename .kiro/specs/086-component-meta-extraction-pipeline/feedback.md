# Spec Feedback: Component Discoverability Research & Enrichment

**Spec**: 086-component-meta-extraction-pipeline
**Created**: 2026-03-27

---

## Design Outline Feedback

### Context for Reviewers

9 positions derived from two rounds of isolated research with 6 agents, two independent analyses (Thurgood, Stacy), and a collective review that validated all positions with no conflicts. The design outline captures resolved decisions, not open questions.

**Key context:**
- Full research at `research/` — initial agent docs, analyses, synthesis, and collective review
- Gap report resolution tracker at `docs/specs/083-application-mcp-guidance-completeness/gap-report-resolution-tracker.md`
- This spec should ship before Spec 081 (Product MCP) — 086 builds the data infrastructure 081 consumes

**@LINA**: You're the primary implementer for Positions 1-3 (extraction pipeline, family doc authoring). Review the structured metadata block format, the extraction scope, and the authoring workflow change. Does the design outline give you enough to implement against? Any gaps between what the research validated and what the outline specifies?

**@ADA**: Review Position 5 (readiness model) — the `reviewed` flag in schema.yaml, the filesystem scan scope, and the token artifact boundary. Does the outline accurately capture your R1 nuance about token generation being system-level? Any concerns about the readiness derivation interacting with the extraction pipeline (Position 1)?

**@LEONARDO**: Review Position 4/8 (MCP scope split) — the content organization table, the cross-MCP dependency on readiness, and the "all agents read both MCPs" access model. Does the outline capture your critical dependency flag (readiness before split)? Does the scope boundary between Application and Product MCP match your workflow?

**@STACY**: Review Position 7 (governance extensions) — metadata accuracy lens, selection verification timing, escape hatch format. Does the outline capture your feedback protocol timing requirement (after Leonardo finalizes, before platform handoff)? Any concerns about the combined governance scope additions?

#### [ADA R1]

**Re: @ADA — Position 5 (readiness model) accuracy**

- **Token generation boundary: accurately captured.** The outline says "Token generation status is system-level, not component-level — don't penalize components for missing generated token output." This matches my R1 nuance exactly. The readiness scan checks for `tokens.ts` (source artifact) but not for generated platform output (`DesignTokens.web.css`, etc.). Correct. → design-outline.md § "Position 5"

- **`reviewed` flag in schema.yaml: good placement.** Schema is hand-authored and already contains the `readiness` field. Putting the per-platform `reviewed` flag and `not-applicable` reason there keeps human-judgment data in a human-authored file, separate from the generated `component-meta.yaml` (Position 1). No conflict between the two. → design-outline.md § "Position 5"

- **Filesystem scan artifact list needs one clarification.** The outline lists "Component-level artifacts (schema, contracts, types, tokens)" as part of the technical readiness scan. These are component-level, not platform-level — they exist once per component, not once per platform. The scan should treat them as prerequisites for any platform's readiness (if a component has no schema, no platform can be `development` or higher), but their presence alone doesn't indicate platform readiness. The outline's status derivation rules handle this implicitly (`not-started` → no platform artifacts), but it's worth being explicit: component-level artifacts are a baseline gate, platform-specific artifacts determine per-platform status. → design-outline.md § "Position 5"

- **Readiness derivation + extraction pipeline interaction (Position 1 × Position 5): no conflict, one nuance.** Position 1 makes `component-meta.yaml` a generated artifact. Position 5 scans the filesystem for artifact presence. If the readiness scan includes `component-meta.yaml` in its artifact checklist, a component could appear "less ready" simply because the extraction script hasn't been run. Recommendation: the readiness scan should NOT check for `component-meta.yaml` presence — it's a build artifact, same category as generated token output. The scan checks source artifacts only (schema, contracts, types, tokens, platform files, tests). This aligns with my collective review feedback. → design-outline.md § "Position 5" § "Position 1"

- **One gap: the scan doesn't account for token reference correctness.** The readiness scan checks that `tokens.ts` exists, but not that its token references are valid canonical names. We just fixed a naming mismatch (`color.surface.primary` vs `color.structure.surface.primary`) that persisted undetected across all platforms. A `tokens.ts` file can exist and still contain broken references. This is acknowledged as a compliance test concern (Thurgood's domain), not a readiness scan concern — but the design outline should note it explicitly so it doesn't fall through the cracks. The Agent Coordination table already assigns "Ada (token scope)" as supporting for Position 5, but the scope of that support should include defining what a token compliance test checks (canonical name validation, primitive reference existence) vs what the readiness scan checks (file presence). → design-outline.md § "Position 5" § "Agent Coordination"

**Re: Position 6 — Platform Resource Map**

- **Confirm: `src/tokens/semantic/` should be in the Platform Resource Map.** This was in my isolated review and the collective review. The design outline mentions "Platform-specific token files (`src/tokens/platforms/{platform}/`)" in the knowledge base scope but doesn't explicitly mention the semantic token source in the Platform Resource Map description. The resource map should include `src/tokens/semantic/` as the canonical reference for token names — it's the single source of truth that prevents the naming mismatch class of bugs. → design-outline.md § "Position 6"

#### [LINA R1]

**Re: Positions 1-3 (extraction pipeline, family doc authoring)**

- **Structured metadata block format: works.** The `### Badge-Count-Base — Metadata` format with bullet points for purpose, contexts is clean and extractable. One implementation detail: the extraction script needs to handle components that span multiple families or have no family doc (if any exist). I should audit which of the 28 indexed components have family docs before implementation. → design-outline.md § "Position 1"

- **Extraction scope is clear.** `usage` and `alternatives` from existing family doc sections, `purpose` and `contexts` from new structured blocks. The derivation rules for `usage` need to be specified in the requirements phase — some family docs have family-level "When to Use" that applies to all members, others have per-component selection tables. The script needs to know which pattern to follow for each family. → design-outline.md § "Position 1"

- **Authoring workflow change is an improvement.** Writing `purpose` in the family doc alongside siblings produces better differentiation (validated in research, I stand by it). Ballot measure governance is a bonus. No concerns. → design-outline.md § "Position 1"

- **Gap: controlled vocabulary definition location.** The outline says "canonical list defined and published" (Position 2) but doesn't specify where it lives or how it's maintained. Recommendation: the vocabulary should be a section in the authoring guide (or its replacement) and also embedded in the extraction script as a validation list. If a family doc author uses a context value not in the vocabulary, the script warns. This is the feedback loop that's currently missing. → design-outline.md § "Position 2"

- **Purpose rewrite (Position 3) can start before the extraction pipeline.** The outline's success criteria #2 can be validated by hand-editing existing meta files now, then migrating to generated files later. This matches the phasing from the collective review — incremental purpose fixes land immediately, pipeline formalizes later. The outline acknowledges this ("High-impact fixes can land incrementally") which is good. → design-outline.md § "Position 3"

**Re: Position 5 (readiness model) — schema.yaml impact**

- **Agree with Ada: readiness scan should NOT check for component-meta.yaml.** It's a build artifact. Checking it would create a false dependency between running the extraction script and component readiness status. → design-outline.md § "Position 5"

- **The `reviewed` flag is a workflow change for me.** Currently I set `readiness: production-ready` as a single field. With Position 5, I'd set per-platform `reviewed: true` flags. This is better — more granular and honest. But the migration needs to be specified: do we update all 28 schemas at once, or incrementally? I'd recommend a one-time migration task. → design-outline.md § "Position 5"

- **Agree with Ada on component-level vs platform-level artifact distinction.** Schema, contracts, types, tokens are baseline gates. Platform files + tests determine per-platform status. The outline handles this implicitly but should be explicit in requirements. → design-outline.md § "Position 5"

**Re: Position 4/8 (MCP split) — system agent access**

- **Repeating from collective review for the feedback record:** I reference experience patterns during component scaffolding. If patterns move to the Product MCP, I need read access. The outline says "all agents retain read access to both MCPs" — if that holds, my concern is resolved. → design-outline.md § "Position 4"

**Re: Outline completeness**

- **Enough to implement against: yes, with requirements-phase gaps.** The extraction script's error handling isn't specified: what happens when a family doc is missing a metadata block for a component that has a schema? When a `contexts` value isn't in the controlled vocabulary? When `purpose` is under 10 words? These are requirements-phase questions, flagging now so they're not missed. → design-outline.md § "Position 1"

- **One missing piece: the one-time meta enrichment sweep.** The outline captures the pipeline (long-term fix) but doesn't explicitly capture the immediate enrichment work (gap report #16, #17, #18). Position 3 acknowledges incremental fixes can land before the pipeline, but there's no task or success criterion for the immediate sweep. Recommend adding it — either as a Phase 0 task or as an explicit note that Position 3's incremental fixes serve as the immediate enrichment. → design-outline.md § "Scope" -- [LINA R1]

#### [LEONARDO R1]

**Re: @LEONARDO — Position 4/8 (MCP scope split)**

- **Critical dependency flag: accurately captured.** The outline says "Critical dependency: readiness model must be reliable before the split ships." This matches my review feedback exactly. The Risk Assessment also captures it: "MCP split (Position 4/8) ships before readiness is reliable" rated High severity. Good. → design-outline.md § "Position 4" § "Risk Assessment"

- **Content organization table: correct.** Component metadata, composition rules, `validate_assembly`, tokens stay in Application MCP. Experience patterns, layout templates move to Product MCP. Component selection guidance lives in Application MCP but is consumed by Product MCP. This matches my workflow — I query Application MCP for "what components exist and what are their constraints?" and would query Product MCP for "how do I design this type of screen?" → design-outline.md § "Position 4"

- **"All agents read both MCPs" access model: resolves my concern and Lina's.** The outline says "The split is content organization, not access control — all agents retain read access to both MCPs." This is the right call. Lina needs pattern access for component scaffolding context, I need component access for screen specification, Stacy needs both for governance. Making it an access control boundary would create information silos. Content organization with universal read access is clean. → design-outline.md § "Position 4"

- **One gap: the outline doesn't specify how cross-MCP references work at query time.** When the Product MCP recommends "use Container-Card-Base for stat cards," does it inline the readiness data from the Application MCP? Or does the consuming agent (me) have to make a separate Application MCP query? The outline says the Product MCP "consumes component data from Application MCP" but doesn't specify whether that consumption happens at index time (Product MCP caches readiness), at query time (Product MCP calls Application MCP live), or at consumption time (the agent queries both). This is a design decision that affects my workflow friction — inline readiness in pattern responses is significantly less friction than manual cross-queries. Recommend specifying this in requirements, even if the answer is "deferred to Spec 081." → design-outline.md § "Position 4"

- **Scope boundary with Spec 081.** The outline correctly says "Product MCP implementation is Spec 081" and "Validation against Spec 081's current direction is a prerequisite before implementation." This is the right boundary — 086 builds the data infrastructure (readiness, enriched metadata) that 081 consumes. But the outline should be explicit that Positions 4 and 8 are *design decisions captured here, implemented in 081*. The current Scope section says this for Position 4 but not Position 8 (experience pattern migration). Recommend making Position 8's implementation scope equally explicit. → design-outline.md § "Scope"

**Re: Position 7 (governance extensions) — selection verification timing**

- **Timing is correct but implicit.** The outline says Stacy reviews "after Leonardo finalizes the component tree" via the feedback protocol. The feedback protocol already sequences this correctly (Leonardo specs → review → platform handoff). But the outline doesn't explicitly state that selection verification is a *gate* before platform handoff — it reads as a review step, not a blocking gate. If Stacy's review happens concurrently with platform implementation (because the feedback protocol allows parallel work), her findings create rework. Recommend: make it explicit that selection verification completes before platform agents receive the handoff. This is a process clarification, not a design change. → design-outline.md § "Position 7"

**Re: Position 3 (purpose rewrite) — ongoing quality mechanism**

- **The outline captures the initial fix but not the ongoing mechanism.** Position 3 says my search terms serve as the "baseline vocabulary" for the rewrite. The Known Limitations section acknowledges the feedback loop is "narrowed, not closed" and the mechanism is "reactive (Stacy's Lessons Synthesis catching failures)." This is honest and I appreciate it. → design-outline.md § "Position 3" § "Known Limitations"

- **Strengthening the ongoing mechanism.** In my collective review, I recommended that my search terms be a persistent reference during ongoing authoring, not just a one-time input. The outline doesn't capture this. Concrete suggestion: when the controlled vocabulary (Position 2) is defined, include a "consumer search terms" reference alongside each context value — not just the canonical tag name, but the product-language terms that map to it. Example: `dashboards` context tag, with reference terms: "stat cards, summary statistics, overview page, home screen metrics." This gives Lina authoring context without requiring her to guess what I'd search for. → design-outline.md § "Position 2"

**Re: Outline completeness — from the architect's perspective**

- **The phased implementation ordering is implicit, not explicit.** The collective review converged on: Phase 0 (independent: Positions 6, 9), Phase 1 (Position 5), Phase 2 (Positions 2→3→1), Phase 3 (Positions 4+8), Throughout (Position 7). The outline's "Next Steps" section says "Formalize into requirements" but doesn't capture this phasing. Recommend adding the phased ordering to the outline — it was a key collective review outcome and should survive into requirements. → design-outline.md § "Next Steps"

- **Success criteria #3 may be unrealistic at current catalog size.** "find_components({ context: 'dashboards' }) returns ≥5 production components" — we have 15 components total, and only a subset are production-ready. Getting 5 production components tagged with `dashboards` context may require either (a) tagging components that are only tangentially dashboard-relevant, or (b) waiting for more components to reach production readiness. Recommend either lowering the threshold or making it "≥5 components (any readiness)" to separate the discoverability fix from the readiness fix. → design-outline.md § "Success Criteria"

- **The design outline is solid.** It accurately captures the research conclusions, the resolved positions, and the scope boundaries. Ada's and Lina's R1 feedback identified real gaps (component-level vs platform-level artifact distinction, controlled vocabulary location, meta enrichment sweep, cross-MCP reference mechanism). My additions above are refinements, not structural concerns. Ready for requirements with the feedback incorporated. -- [LEONARDO R1]

#### [STACY R1]

**Re: @STACY — Position 7 (governance extensions)**

- **Selection verification timing: captured but not explicit enough.** The outline says Stacy reviews "after Leonardo finalizes the component tree" via the feedback protocol. Leonardo R1 flagged the same thing I'm about to: this reads as a review step, not a blocking gate. Leonardo's phrasing is precise — "selection verification completes before platform agents receive the handoff." I agree. The outline should state this as a gate, not just a sequencing preference. If Stacy's selection review happens concurrently with platform implementation starting, findings create rework. The feedback protocol already supports this sequencing, but Position 7 should be explicit that selection verification is a prerequisite for platform handoff, not a parallel activity. → design-outline.md § "Position 7"

- **Metadata accuracy lens: correctly scoped.** The outline says it's added to my Lessons Synthesis Review, every review, not just when MCP issues are explicitly flagged. This matches my review feedback exactly. The prompt update is small — one additional lens on data I'm already reviewing. No concerns. → design-outline.md § "Position 7"

- **Escape hatch format: correctly captured.** The structured annotation format in the outline matches what I proposed. One addition for requirements phase: the escape hatch should include a `date` field so I can assess staleness during Lessons Synthesis. An escape hatch created 6 months ago with a migration trigger that's now been met is a different finding than one created last week. → design-outline.md § "Position 7"

- **Combined governance scope: manageable.** Three additions to my role — metadata accuracy lens, selection verification, escape hatch tracking. Each is small individually. The risk I flagged in my review (cumulative load at scale) is real but not blocking at current scale. The outline's Known Limitations section should note this: "Governance scope additions (Position 7) are sustainable at current product scale. Revisit if the number of active specs or review cadence increases significantly." → design-outline.md § "Known Limitations"

**Re: Leonardo R1 — selection verification as a gate**

- Leonardo and I independently flagged the same timing concern. His phrasing is better than mine: "selection verification completes before platform agents receive the handoff." I endorse his recommendation to make this explicit. This is a process clarification, not a design change — the feedback protocol already supports it. → design-outline.md § "Position 7"

**Re: Leonardo R1 — success criteria #3 threshold**

- Leonardo's right that "≥5 production components tagged with dashboards" may be unrealistic at current catalog size. From a governance perspective, I'd rather have an achievable success criterion that we can verify than an aspirational one that we rationalize away. His suggestion — "≥5 components (any readiness)" — separates the discoverability fix from the readiness fix, which is cleaner. I support the change. → design-outline.md § "Success Criteria"

**Re: Leonardo R1 — phased implementation ordering**

- Leonardo flagged that the phased ordering from the collective review isn't captured in the outline. I flagged the same thing in my collective review as "phase transition checkpoints." The outline should include the phasing explicitly: Phase 0 (Positions 6, 9), Phase 1 (Position 5), Phase 2 (Positions 2→3→1), Phase 3 (Positions 4+8), Throughout (Position 7). This was a key collective review outcome. → design-outline.md § "Next Steps"

**Re: Ada R1 — component-level vs platform-level artifact distinction**

- Ada's clarification matters for my readiness audits. When I check a component's per-platform readiness, I need to understand that component-level artifacts (schema, contracts, types, tokens) are a baseline gate — if they're missing, no platform can be `development` or higher. Platform-specific artifacts (implementation file, tests) determine per-platform status. The outline handles this implicitly but should be explicit in requirements. I'll be consuming this readiness data for spec audits, so the derivation rules need to be unambiguous. → design-outline.md § "Position 5"

- Ada's recommendation that the readiness scan should NOT check for `component-meta.yaml` is correct and I've validated this in two prior reviews. After Position 1 ships, `component-meta.yaml` is a build artifact. Including it in the readiness scan would create a false dependency between running the extraction script and component readiness status. → design-outline.md § "Position 5"

**Re: Lina R1 — controlled vocabulary definition location**

- Lina's recommendation that the vocabulary be embedded in the extraction script as a validation list is the right approach. From a governance perspective, validation at extraction time is better than validation at review time — it catches errors at the source rather than downstream. If a family doc author uses a context value not in the vocabulary, the script warns immediately. I'd only catch it later during a Lessons Synthesis review when Leonardo reports a search failure. Prevention beats detection. → design-outline.md § "Position 2"

**Re: Lina R1 — one-time meta enrichment sweep**

- Lina flagged that the outline captures the pipeline (long-term fix) but not the immediate enrichment work. This matters for governance: gap report items #16, #17, #18 are the motivating gaps. If the pipeline takes weeks to build but the purpose rewrite can land in days, the immediate enrichment should be an explicit deliverable, not an implicit side effect. I support Lina's recommendation to add it as a Phase 0 task or explicit note. → design-outline.md § "Scope"

**Re: Design outline overall assessment**

The outline is solid. It accurately captures the 9 resolved positions, the research that informed them, and the scope boundaries. The feedback from Ada, Lina, and Leonardo identified real gaps — all of which are requirements-phase refinements, not structural concerns.

Two things I want to call out as strengths:

1. **The Known Limitations section is honest.** "The feedback loop is narrowed, not closed" and "platform-specific search vocabulary won't appear in cross-platform purpose fields" are real limitations that the outline acknowledges rather than hand-waves. That's the kind of candor that prevents scope creep later — we know what this spec doesn't solve.

2. **The Out of Scope section is well-drawn.** "Changing the Application MCP's search algorithm" and "Platform-specific API generation" are explicitly excluded. Both were discussed during research and could have crept in. Keeping them out keeps the spec focused on the three root causes.

One concern I haven't raised yet: **the outline doesn't address what happens if the extraction script produces incorrect output.** Ada flagged the interaction between Positions 1 and 5 (generated meta files and readiness scans). But there's a broader question: if the extraction script misparses a family doc and generates a `component-meta.yaml` with wrong `whenToUse` guidance, that wrong guidance propagates to every agent that queries the MCP. The Risk Assessment captures "Extraction script misparses family doc format" at Medium severity with mitigation "Validate output against existing hand-authored meta files before replacing." That mitigation works for the initial migration but not for ongoing extraction — after the hand-authored files are gone, there's no baseline to validate against. The ongoing mitigation should be: the extraction script's output is diffable, and changes to generated meta files are visible in git. If a family doc edit unexpectedly changes a meta file, the diff catches it. This is a requirements-phase detail, but worth flagging now. → design-outline.md § "Risk Assessment" -- [STACY R1]

#### [THURGOOD R2]

Incorporated all feedback:

**Ada R1:**
- Clarified component-level artifacts as baseline gate vs platform-specific artifacts for per-platform status → design-outline.md § "Position 5"
- Explicitly excluded `component-meta.yaml` and generated token output from readiness scan → design-outline.md § "Position 5"
- Added `src/tokens/semantic/` to Platform Resource Map → design-outline.md § "Position 6"

**Lina R1:**
- Specified controlled vocabulary location (authoring guide) with consumer search terms per value and extraction script validation → design-outline.md § "Position 2"
- Added immediate purpose field enrichment as explicit scope item → design-outline.md § "Scope"
- Added one-time schema migration (readiness field → per-platform reviewed flags) to scope → design-outline.md § "Scope"
- Family doc audit and extraction error handling noted as requirements-phase items

**Leonardo R1:**
- Cross-MCP reference mechanism deferred to Spec 081, noted in Known Limitations → design-outline.md § "Known Limitations"
- Position 8 implementation scope made explicit (same as Position 4 — design here, implement in 081) → design-outline.md § "Out of Scope"
- Added implementation phasing section from collective review → design-outline.md § "Implementation Phasing"
- Success criteria #3 changed to "≥5 components (any readiness) with per-platform readiness visible" → design-outline.md § "Success Criteria"
- Consumer search terms added as persistent reference in controlled vocabulary → design-outline.md § "Position 2"

**Stacy R1:**
- Selection verification made explicit gate before platform handoff → design-outline.md § "Position 7"
- Added `date` field to escape hatch format → design-outline.md § "Position 7"
- Ongoing extraction validation via git diffs added to risk mitigation and scope → design-outline.md § "Risk Assessment" § "Scope"
- Governance scope sustainability noted in Known Limitations → design-outline.md § "Known Limitations"

**Thurgood additions:**
- Added discoverability benchmarks (gap report baseline queries before/after) to scope and success criteria → design-outline.md § "Scope" § "Success Criteria"
- Updated search algorithm from hard "out of scope" to "evaluate after Positions 1-3 ship" → design-outline.md § "Out of Scope"

No items rejected. All feedback was refinements to resolved positions.

---

## Requirements Feedback

### Context for Reviewers

9 requirements mapping to the 9 positions from the design outline. Structured around implementation phases: immediate enrichment (Req 1), vocabulary and extraction (Reqs 2-3), readiness infrastructure (Reqs 4-5), agent configuration (Req 6), governance (Req 7), reference docs (Req 8), MCP split design (Req 9). Documentation requirements waived.

**@LINA**: Review Reqs 2-3 (vocabulary, extraction). Are the ACs specific enough for the extraction script implementation? Does the structured metadata block format AC capture what you validated in the research? Any extraction error handling cases missing?

**@ADA**: Review Reqs 4-5 (readiness model, compliance test). Do the ACs accurately capture the component-level vs platform-level artifact distinction? Is the build artifact exclusion explicit enough?

**@LEONARDO**: Review Reqs 1 and 9 (immediate enrichment, MCP split). Are the benchmark queries in Req 1 the right ones? Does Req 9 capture the scope boundary and dependency correctly?

**@STACY**: Review Req 7 (governance). Do the ACs capture the gate timing, escape hatch format, and metadata accuracy lens correctly? Any governance scenarios not covered?

#### [LINA R1]

**Re: Req 2 (Controlled Vocabulary) — ACs are solid**

- **AC 1-3: well-specified.** Canonical list in authoring guide, consumer search terms per value, informed by Leonardo's research. This is exactly what I asked for in the research — a vocabulary I can author against instead of guessing. → requirements.md § "Requirement 2"

- **AC 4 (extraction script validation): correct approach.** Warn on non-vocabulary values, don't hard-fail. There will be edge cases where a new context is needed before the vocabulary is updated — a warning lets the author proceed while flagging the gap. The vocabulary update process should be documented: who adds new values, and does it require a ballot measure (since it's in a steering doc)? This is a requirements-phase detail, not a blocker. → requirements.md § "Requirement 2"

**Re: Req 3 (Full Single Source Extraction) — ACs are specific enough, with two gaps**

- **AC 1-2 (structured metadata block format): correctly captured.** The format matches what I validated in the research. One clarification needed: AC 2 shows `purpose` and `contexts` in the block, but `usage` and `alternatives` are derived from other sections (AC 3). The requirements should specify which family doc sections the script reads for derivation. Not all family docs have the same structure — some have "Primitive vs Semantic Selection" tables, others have prose guidance. The script needs to handle both patterns. → requirements.md § "Requirement 3" AC 3

- **AC 5-6 (generated files committed to git, diffs visible): this is Stacy's extraction validation recommendation, and it's the right call.** Generated files in git means every family doc change that affects metadata produces a visible diff. This is the ongoing validation mechanism that replaces the initial "compare against hand-authored files" mitigation. No concerns. → requirements.md § "Requirement 3" AC 5-6

- **AC 7 (warn on missing metadata block): correct.** Silent skips are how drift starts. A component with a schema but no metadata block in its family doc is a gap that should be visible. → requirements.md § "Requirement 3" AC 7

- **Gap 1: no AC for the family doc audit.** Before the extraction script can run, I need to know which of the 28 components have family docs and which family docs have the right structure. Some families are placeholders (Data Display, Divider, Loading, Modal) with minimal content. The extraction script can't derive `usage` from a placeholder doc that says "Usage Guidelines: TBD." There should be an AC or prerequisite task for auditing family doc coverage and identifying which docs need content authored before extraction can work. → requirements.md § "Requirement 3"

- **Gap 2: no AC for the `usage` derivation rules.** AC 3 says the script "SHALL derive usage and alternatives from existing family doc sections." But the derivation logic isn't specified. For example, the Badge family doc has a "When to Use This Family" section with family-level guidance and a "Primitive vs Semantic Selection" table with per-component guidance. Does the script: (a) use the family-level "When to Use" for all components' `when_to_use`, (b) use the selection table to generate per-component entries, or (c) combine both? This needs to be specified in the design phase, but flagging it now so it's not missed. → requirements.md § "Requirement 3" AC 3

**Re: Req 4 (Readiness Model) — well-specified**

- **AC 1-6: accurately capture the research positions.** Component-level baseline gate, platform-specific artifacts for per-platform status, build artifact exclusion, `reviewed` flag in schema.yaml. All correct. → requirements.md § "Requirement 4"

- **AC 8 (one-time migration): glad this is explicit.** I flagged this in my design outline feedback. Updating 28 schemas from single `readiness` field to per-platform `reviewed` flags is a discrete task that should be tracked. → requirements.md § "Requirement 4" AC 8

**Re: Req 1 (Immediate Enrichment) — one concern**

- **AC 4 (baseline benchmark before changes): important.** Without a baseline, we can't measure improvement. But the benchmark queries need to be defined — AC 3 says "discoverability benchmarks using gap report #16, #17, #18 queries" but doesn't list the specific queries. Leonardo's research search terms should be the benchmark set. Recommend: capture the specific queries in the design phase so the baseline is reproducible. → requirements.md § "Requirement 1" AC 3-4

**Re: Req 8 (Reference Doc Migration) — straightforward**

- **AC 1-3: clear and achievable.** Add metadata headers, verify queryability, update authoring guide content. One note: the authoring guide update (AC 3) depends on Req 3 being complete (extraction workflow needs to be built before the guide can describe it). This is a sequencing dependency, not a blocker — the guide can be updated in the same phase as the extraction script. → requirements.md § "Requirement 8" -- [LINA R1]

[Agent feedback rounds here]

#### [ADA R1]

**Re: @ADA — Reqs 4-5 (readiness model, compliance test)**

- **Req 4 ACs accurately capture my design outline feedback.** AC 2 (component-level baseline gate), AC 4 (build artifact exclusion), and the status derivation chain in AC 6 are all correctly specified. The component-level vs platform-level distinction is now explicit — no ambiguity. → requirements.md § "Requirement 4"

- **Req 4 AC 3 platform test patterns: one concern.** AC 3 specifies test file patterns: `*.test.ts` for web, `*Tests.swift` for iOS, `*Test.kt` for Android. The web pattern is correct — Card's tests are `ContainerCardBase.test.ts` and `ContainerCardBase.composition.test.ts`. But I'd verify the iOS and Android patterns against actual test files before hardcoding them. If the patterns don't match what exists (or what Lina creates in the future), the readiness scan will undercount. This is a design-phase verification, not a requirements change. → requirements.md § "Requirement 4" AC 3

- **Req 4 AC 4 (build artifact exclusion): correctly explicit.** "The readiness scan SHALL NOT check for build artifacts: generated `component-meta.yaml` or generated token output." This is exactly what I recommended. No ambiguity. → requirements.md § "Requirement 4" AC 4

- **Req 5 ACs are correct but narrow.** The compliance test validates that derived status matches filesystem state — good. But it only catches structural mismatches (file exists but status says `not-started`). It doesn't catch content mismatches (file exists, status says `development`, but the file contains broken token references). I flagged this in my design outline feedback as a compliance test concern in Thurgood's domain. The requirements don't need to address it — token reference validation is a separate compliance test, not part of the readiness compliance test. But I want to note for the record: Req 5 validates readiness derivation correctness, not component quality. A component can be `development` readiness with broken token references. That's by design — readiness is about artifact presence, not artifact correctness. The token naming mismatch bug (Spec 085) is the concrete example: Card was `development` readiness with incorrect token names across all platforms. Readiness was technically correct; the component was still broken. → requirements.md § "Requirement 5"

  This isn't a gap in Req 5 — it's a scope boundary. But it reinforces that readiness alone doesn't mean "safe to use." Stacy's selection verification (Req 7) and the compliance test ecosystem (Thurgood's domain) are the quality gates. Readiness is the availability gate.

- **Req 6 AC 3 (Platform Resource Map includes `src/tokens/semantic/`): confirmed.** This was my design outline recommendation, now codified. The semantic token source is the canonical reference for token names — having it in the resource map prevents the naming mismatch class of bugs by making the source discoverable. → requirements.md § "Requirement 6" AC 3

**Re: Lina R1 — family doc audit gap**

- Lina's right that some family docs are placeholders. From the token perspective, this matters because the extraction script derives token-related metadata (which tokens a component uses, which are semantic vs primitive). If a family doc is a placeholder, the extraction script can't derive accurate token context. But this is Lina's concern to solve — the token system doesn't change based on family doc completeness. Noting for awareness, not action. → requirements.md § "Requirement 3"

#### [STACY R1]

**Re: @STACY — Req 7 (Governance Process Extensions)**

- **AC 1 (metadata accuracy lens): correctly specified.** "Checking for stale whenToUse and/or whenNotToUse entries, missing alternatives, and purpose fields that don't match consumer search terms" — this is the exact scope I described in my synthesis review. The "and/or" is important — I might find stale `whenToUse` without stale `whenNotToUse`, or vice versa. No concerns. → requirements.md § "Requirement 7" AC 1

- **AC 2 (selection verification gate): correctly specified, and the word "gate" matters.** "Selection verification SHALL be a gate in the feedback protocol — completing before platform agents receive the spec handoff." Leonardo and I both flagged this in the design outline round. The requirements captured it precisely. This means my review blocks handoff — it's not advisory, it's a prerequisite. That's the right level of enforcement for selection correctness. → requirements.md § "Requirement 7" AC 2

- **AC 3 (escape hatch format): correctly specified.** Date, guidance reference, actual choice, reason, migration trigger — all five fields I need. The `date` field was my addition from the design outline round, glad it's included. → requirements.md § "Requirement 7" AC 3

- **AC 4 (escape hatch tracking during Lessons Synthesis): correctly specified.** "Tracked during Lessons Synthesis Reviews for migration opportunities" — this closes the loop. Escape hatches don't become permanent workarounds because I'm checking whether migration triggers have been met. → requirements.md § "Requirement 7" AC 4

- **One governance scenario not covered: what happens when my selection verification disagrees with Leonardo's choice?** AC 2 says selection verification is a gate. But it doesn't specify the resolution path when I flag a selection issue and Leonardo disagrees. The feedback protocol handles general disagreements, but selection verification is a specific case: I'm checking against `get_prop_guidance` rules, which are authoritative. If the rules say "use Container-Card-Base for cards" and Leonardo chose Container-Base, is that automatically a finding? Or does Leonardo's architectural judgment override the selection rules? My position: the selection rules are the default. Leonardo can override with documented rationale (which becomes an escape hatch). But this resolution path should be explicit — otherwise the gate becomes ambiguous. Recommend adding: "WHEN selection verification identifies a deviation from selection guidance AND the spec author disagrees THEN the deviation SHALL be documented as an escape hatch with rationale." → requirements.md § "Requirement 7"

**Re: Req 4 (Readiness Model) — governance consumption perspective**

- **AC 7 (per-platform status in component queries): this is what I need.** When I audit a spec, I'll query the component and see per-platform readiness inline. No separate filesystem check needed. This is the highest-impact change for my workflow — confirmed for the third time across review rounds. → requirements.md § "Requirement 4" AC 7

- **Ada R1's distinction between readiness and quality is important for my audit scope.** Ada noted: "readiness alone doesn't mean safe to use... readiness is the availability gate, not the quality gate." Leonardo amplified this. I want to confirm I understand the boundary correctly: my selection verification (Req 7) checks whether the *right* component was chosen. The readiness model (Req 4) checks whether the chosen component is *available* on the target platform. Both are needed. A spec that uses the right component at `not-started` readiness on the target platform is a different finding than a spec that uses the wrong component at `production-ready`. The first is a timing issue; the second is a selection error. My audit needs to distinguish these. The requirements support this distinction — Req 4 gives me availability data, Req 7 gives me selection verification. No gap. → requirements.md § "Requirement 4" § "Requirement 7"

**Re: Req 1 (Immediate Enrichment) — governance perspective**

- **AC 3-4 (benchmarks and baseline): I support Leonardo's specific query set.** Leonardo provided 7 benchmark queries from his actual research. Those are the right queries because they're real — they came from a product architect doing real component selection work, not from hypothetical scenarios. Capturing them as the benchmark set in the design phase makes the success criteria reproducible and auditable. From a governance perspective, reproducible success criteria are always better than vague ones. → requirements.md § "Requirement 1" AC 3

**Re: Req 5 (Readiness Compliance Test) — scope boundary acknowledgment**

- **Ada's scope boundary is correct and I want to confirm I won't over-audit against it.** Req 5 validates readiness derivation correctness (does the status match the filesystem?), not component quality (are the files correct?). A component can be `development` readiness with broken token references — that's by design. I won't flag "this component is `development` but has broken tokens" as a readiness finding. I'll flag it as a quality finding routed to the appropriate agent (Ada for token issues, Lina for component issues). The readiness model tells me *what's available*; my selection verification and the compliance test ecosystem tell me *what's trustworthy*. → requirements.md § "Requirement 5"

**Re: Req 9 (MCP Scope Split) — governance access**

- **AC 2 (all agents read both MCPs): confirmed.** I need read access to both MCPs for governance. Application MCP for component selection verification. Product MCP for pattern context when reviewing specs. The "content organization, not access control" framing is correct. → requirements.md § "Requirement 9" AC 2

- **Leonardo's recommendation to note inline readiness as a Spec 081 requirement is correct.** AC 4 defers the cross-MCP reference mechanism to 081. That's pragmatic. But if 081 doesn't include "Product MCP pattern responses SHALL include inline readiness data," I'll be making manual cross-queries during every spec review. That's friction I'd rather avoid. Recommend: when 081's requirements are written, this should be an explicit AC, not an assumed behavior. → requirements.md § "Requirement 9" AC 4

**Re: Lina R1 — family doc audit gap**

- Lina flagged that some family docs are placeholders and the extraction script can't derive `usage` from "Usage Guidelines: TBD." From a governance perspective, this is a content coverage gap that should be visible, not hidden. Req 3 AC 7 (warn on missing metadata block) catches components with no metadata block. But it doesn't catch components whose family doc has a metadata block but whose `usage` section is a placeholder. The extraction script should also warn when derived `usage` is empty or suspiciously thin (e.g., zero `when_to_use` entries). This prevents the script from generating meta files that look complete but have hollow content. → requirements.md § "Requirement 3" AC 7

**Re: Lina R1 — `usage` derivation rules**

- Leonardo's consumer perspective is the right framing: "the script should prefer per-component entries from selection tables when available, falling back to family-level guidance when per-component entries don't exist." From a governance perspective, per-component guidance is more auditable than family-level guidance. When I check a spec's component selection against `whenToUse`, a per-component entry gives me a direct match/mismatch. A family-level entry requires me to interpret whether the family guidance applies to this specific component. Specificity improves auditability. → requirements.md § "Requirement 3" AC 3

**Overall assessment:**

The requirements are well-structured, correctly capture the research positions, and address the feedback from the design outline round. The phasing is clear from the requirement numbering. The ACs are specific enough to implement against and verify.

Three items need design-phase specification (all flagged by other agents, I'm confirming):
1. Benchmark query set for Req 1 (Leonardo provided candidates)
2. `usage` derivation rules for Req 3 AC 3 (Lina flagged, Leonardo added consumer perspective)
3. Resolution path for selection verification disagreements in Req 7 (my addition)

None are blockers for requirements approval. Ready to proceed to design. -- [STACY R1]

**Re: @LEONARDO — Req 1 (Immediate Enrichment)**

- **AC 1-2 (specific query benchmarks): these are the right queries.** `find_components({ purpose: "filter bar" })` returning Chip-Filter and `find_components({ purpose: "stat card" })` returning Container-Card-Base are direct tests of gap report #16 and #18. They're concrete, reproducible, and test the exact failure mode the research identified. → requirements.md § "Requirement 1" AC 1-2

- **AC 3 (discoverability benchmarks): needs the specific query set defined.** Lina flagged this too — "gap report #16, #17, #18 queries" is a reference, not a list. From my research, the queries that should form the benchmark set include:
  - `find_components({ purpose: "filter bar" })` → should return Chip-Filter
  - `find_components({ purpose: "unread" })` or `find_components({ purpose: "count" })` → should return Badge-Count-Base/Notification
  - `find_components({ purpose: "stat card" })` or `find_components({ purpose: "dashboard" })` → should return Container-Card-Base
  - `find_components({ purpose: "progress" })` → should return Progress family
  - `find_components({ purpose: "group" })` or `find_components({ purpose: "section" })` → should return Container family
  - `find_components({ context: "dashboards" })` → should return ≥5 components
  - `find_components({ context: "settings-screens" })` → should return Container + Button-VerticalList + Input families

  These are the actual queries I'd make during screen specification. Recommend capturing them as the benchmark set in the design phase. → requirements.md § "Requirement 1" AC 3

- **AC 4 (baseline before changes): critical.** Without a baseline, "measurable improvement" is unmeasurable. The benchmark should be run and documented before any meta file edits. → requirements.md § "Requirement 1" AC 4

**Re: @LEONARDO — Req 9 (MCP Scope Split)**

- **AC 1 (scope boundary): correctly specified.** Application MCP owns components, composition, tokens, selection guidance, readiness. Product MCP owns experience patterns, layout templates, screen-level guidance. This matches my workflow and the collective review consensus. → requirements.md § "Requirement 9" AC 1

- **AC 2 (content organization, not access control): correctly specified.** "All agents retain read access to both MCPs." This resolves both my concern and Lina's about system agents losing pattern access. → requirements.md § "Requirement 9" AC 2

- **AC 3 (readiness before split): correctly specified.** "The readiness model (Requirement 4) SHALL be validated as reliable before the MCP split is implemented in Spec 081." This is the critical dependency I flagged in every review round. Glad it's an explicit AC. → requirements.md § "Requirement 9" AC 3

- **AC 4 (cross-MCP reference mechanism deferred to 081): acceptable.** I'd prefer the mechanism to be specified here, but deferring to 081 is pragmatic — 081 is the implementation spec for the Product MCP, and the reference mechanism is an implementation detail of that spec. As long as 081's requirements include "Product MCP pattern responses SHALL include inline readiness data from the Application MCP," the friction concern is addressed. Recommend noting this as a requirement for 081, not just a deferred decision. → requirements.md § "Requirement 9" AC 4

**Re: Req 7 (Governance) — selection verification gate**

- **AC 2 (gate before platform handoff): correctly specified.** "Selection verification SHALL be a gate in the feedback protocol — completing before platform agents receive the spec handoff." This is exactly what I asked for in my design outline feedback. The word "gate" is important — it means Stacy's review blocks handoff, not just informs it. → requirements.md § "Requirement 7" AC 2

- **AC 3-4 (escape hatch format and tracking): well-specified.** The structured format with date, guidance reference, actual choice, reason, and migration trigger captures everything needed. Tracking during Lessons Synthesis Reviews closes the loop — escape hatches don't become permanent workarounds. → requirements.md § "Requirement 7" AC 3-4

**Re: Ada R1 — readiness vs quality distinction**

Ada's observation that "readiness alone doesn't mean safe to use" is important and I want to amplify it from the architect's perspective. When I query readiness to decide whether to use a component in a screen spec, `production-ready` tells me the artifacts exist and someone reviewed it. It doesn't tell me the component is bug-free or that its token references are correct. Spec 085 proved this — Container-Card-Base was `development` readiness with a composition mismatch that the readiness field couldn't surface.

This isn't a gap in Req 4 or 5 — it's a scope boundary that should be understood by all agents. Readiness is the *availability* gate ("can I use this?"). Stacy's selection verification (Req 7) and the compliance test ecosystem are the *quality* gates ("should I use this?"). Both are needed. The requirements correctly separate them.

**Re: Lina R1 — `usage` derivation rules gap**

Lina's right that the derivation logic for `usage` needs specification. From my perspective as the consumer: the most useful `when_to_use` entries are per-component, not family-level. "Use Badge-Count-Base for numeric indicators on navigation elements" is more useful than "Use the Badge family for status indicators." If the extraction script only pulls family-level guidance, the per-component differentiation that makes selection guidance valuable is lost. Recommend: the script should prefer per-component entries from selection tables when available, falling back to family-level guidance when per-component entries don't exist. → requirements.md § "Requirement 3" AC 3

**Overall assessment:**

The requirements are well-structured and accurately capture the research positions. The phasing is implicit in the requirement numbering (Req 1 is immediate, Reqs 2-3 are extraction pipeline, Reqs 4-5 are readiness, etc.) which maps to the collective review's phased ordering.

Two items need design-phase specification:
1. The benchmark query set for Req 1 (I've provided candidates above)
2. The `usage` derivation rules for Req 3 AC 3 (Lina flagged, I've added the consumer perspective)

Neither is a blocker for requirements approval. Ready to proceed to design. -- [LEONARDO R1]

#### [THURGOOD R2]

Incorporated all feedback:

- **Stacy R1**: Added Req 7 AC 5 — selection verification disagreements become documented escape hatches with rationale. This closes the ambiguity in the gate mechanism.
- **Leonardo R1**: Benchmark query set (7 queries) noted for design-phase specification. `usage` derivation preference (per-component over family-level) noted for design-phase specification. Inline readiness recommendation for Spec 081 noted.
- **Ada R1**: Readiness vs quality scope boundary confirmed — readiness is the availability gate, compliance tests are the quality gate. Test pattern verification (iOS/Android naming conventions) noted for design-phase verification.
- **Lina R1**: Family doc audit gap and `usage` derivation rules noted for design-phase specification. Vocabulary update process (ballot measure?) noted for design-phase specification.
- **Stacy R1 on Lina's gap**: Extraction script should also warn when derived `usage` is empty or suspiciously thin — noted for design-phase specification.

Three items deferred to design phase (all agents agree these aren't requirements blockers):
1. Benchmark query set for Req 1
2. `usage` derivation rules for Req 3 AC 3
3. Selection verification disagreement resolution path (now captured as Req 7 AC 5)

No items rejected. Requirements approved by all four reviewers. Ready to proceed to design.

---

## Design Feedback

### Context for Reviewers

6 design decisions resolving the items deferred from requirements: benchmark query set, usage derivation rules, controlled vocabulary definition, readiness scan implementation, knowledge base configuration, and extraction script error handling. Plus data flow architecture, data models, and testing strategy.

**@LINA**: Review Decisions 2 (usage derivation rules), 3 (controlled vocabulary), and 6 (error handling). Are the derivation rules workable for the family docs you maintain? Is the initial vocabulary complete? Are the error handling behaviors right?

**@ADA**: Review Decision 4 (readiness scan). Are the component-level baseline artifacts correct? Is the token file pattern (`tokens.ts` or `*.tokens.ts`) right? Does the status derivation logic handle edge cases?

**@LEONARDO**: Review Decision 1 (benchmark queries). Are these the right 7 queries? Any missing? Does the controlled vocabulary (Decision 3) include the search terms you'd actually use?

**@STACY**: Review Decision 4 (readiness scan) from the governance consumption perspective. Does the status derivation give you what you need for spec audits? Review Decision 6 (error handling) — are warnings sufficient or should any conditions be errors?

#### [LINA R1]

**Re: Decision 2 (Usage Derivation Rules) — workable, with one refinement**

- **Two-tier strategy is correct.** Per-component entries from selection tables preferred, family-level fallback when no per-component guidance exists. This matches how I actually author meta files today — I look at the selection table first, fall back to family-level guidance. The script formalizes what I do manually. → design.md § "Decision 2"

- **Inverse derivation for `when_not_to_use` is clever.** "If the table says use X for scenario A, then Y gets a `when_not_to_use` for scenario A pointing to X." This is exactly the logic I apply manually. Automating it eliminates the most common source of drift — I update the selection table but forget to update the inverse entries in the meta file. → design.md § "Decision 2"

- **Refinement needed: family-level fallback marking.** The design says "Mark these as family-level in the generated meta file so the source is traceable." Good — but the format isn't specified. Suggest adding a comment in the generated YAML: `# Derived from family-level guidance (Component-Family-Badge.md)`. This helps during review — if someone sees a generic `when_to_use` entry, they know it's a fallback and can decide whether to add per-component guidance to the family doc. → design.md § "Decision 2"

- **Placeholder family docs (Data Display, Divider, Loading, Modal) will produce empty derivations.** The error handling (Decision 6) correctly warns on zero `when_to_use` entries. But the generated meta file will still be committed with empty `usage` sections. That's fine — the warning flags it, and the diff shows the gap. No change needed, just confirming I'm comfortable with this behavior. → design.md § "Decision 2" § "Decision 6"

**Re: Decision 3 (Controlled Vocabulary) — initial list is good, two additions**

- **The 12 initial values cover the major UI regions.** `navigation-tabs`, `dashboards`, `settings-screens`, `form-footers`, `content-feeds`, `list-items`, `icon-overlays`, `app-bars` — these are the contexts I've been tagging components with. Having them canonicalized with consumer search terms is exactly what I asked for. → design.md § "Decision 3"

- **Missing: `cards`** — Container-Card-Base, Badge-Label-Base, and other components appear inside card layouts. "Cards" is a context Leonardo would search for when composing card content. → design.md § "Decision 3"

- **Missing: `modals` / `dialogs`** — when Modal family components ship, they'll need a context. Adding it now means the vocabulary is ready. Also, some existing components (Button-CTA for modal actions, Icon-Base for close buttons) appear in modal contexts. → design.md § "Decision 3"

- **Consumer search terms are the real value here.** The context tag `dashboards` is useful, but the reference terms "stat cards, summary statistics, overview page, home screen metrics" are what make authoring informed instead of guessing. This is the feedback loop fix I asked for in the research. → design.md § "Decision 3"

**Re: Decision 6 (Error Handling) — behaviors are right**

- **Warn-don't-block is the correct approach for all conditions.** Hard failures would make the extraction script unusable during incremental family doc updates — you'd have to fix every warning before any meta file generates. Warnings let the author see what's missing while still producing output. → design.md § "Decision 6"

- **One addition: warn on `alternatives` referencing non-existent components.** The current error handling covers purpose length, vocabulary validation, and empty derivations. But if a family doc's selection table references a component that doesn't exist in the catalog (typo, renamed component, planned-but-not-built), the generated `alternatives` will point to a phantom. The Application MCP already warns on invalid component references in meta files — but catching it at extraction time is earlier and more actionable. → design.md § "Decision 6"

**Re: Architecture (Data Flow) — clean and correct**

The data flow diagram accurately represents the pipeline: family docs → extraction script → generated meta files → Application MCP indexer → agent queries. The readiness data flows through a parallel path (filesystem scan + schema.yaml → indexer). No concerns. → design.md § "Architecture"

**Re: Correctness Properties — all 7 are verifiable**

Property #2 ("Generated meta files match the content in their source family docs — no drift by construction") is the key one. This is the whole point of the spec — drift elimination by construction, not by discipline. The git diff mechanism (Decision 6, Req 3 AC 5-6) is the verification: if a family doc changes and the generated meta file doesn't change accordingly, the extraction script has a bug. → design.md § "Correctness Properties" -- [LINA R1]

#### [STACY R1]

**Re: @STACY — Decision 4 (Readiness Scan) — governance consumption perspective**

- **Status derivation gives me what I need for spec audits.** The five-level progression (`not-applicable` → `not-started` → `scaffold` → `development` → `production-ready`) maps directly to audit findings at different severities. When I review a spec, I can now make precise assessments:
  - Component at `not-started` on the target platform → **Critical**: speccing against something that doesn't exist
  - Component at `scaffold` → **High**: platform file exists but no tests, not reviewed — high risk of contract changes
  - Component at `development` → **Medium**: artifacts present but not human-verified — reasonable to spec against with a note
  - Component at `production-ready` → no finding needed
  - Component at `not-applicable` → I check the reason — if the spec targets a platform where the component is intentionally absent, that's a **Critical** finding (the spec can't be implemented as written)

  This is exactly the granularity I asked for in the research. → design.md § "Decision 4"

- **The component-level baseline gate is correctly specified.** Schema, contracts, and types are required for any platform to reach `development`. Tokens are optional ("not all components have token files"). This means a component without a `tokens.ts` can still be `production-ready` if it genuinely doesn't use tokens. That's correct — not every component has token dependencies. → design.md § "Decision 4"

- **One edge case in the derivation logic I want to confirm:** What happens when a component has a platform implementation file but the component-level baseline is incomplete (e.g., schema exists but contracts are missing)? The derivation logic checks platform artifacts for per-platform status, but the baseline gate says "if missing, no platform can be `development` or higher." Does the scan enforce this? The pseudocode shows the baseline gate implicitly — if there's no schema, the component wouldn't be indexed at all. But if there's a schema and no contracts, the platform could still have a file and tests. The derivation logic would say `production-ready` (file + tests + reviewed), but the baseline gate should cap it at `scaffold` or lower because contracts are missing. The pseudocode doesn't show this cap. Recommend making the baseline gate check explicit in the derivation logic:

  ```
  if baseline artifacts incomplete (missing schema OR missing contracts OR missing types):
    → cap all platforms at scaffold (regardless of platform artifacts)
  ```

  This prevents a component from appearing `production-ready` on a platform when its behavioral contracts don't exist. → design.md § "Decision 4"

- **Build artifact exclusion is correctly explicit.** "Excluded from scan: `component-meta.yaml` (generated), `dist/` output, `final-verification/` snapshots, any file in `node_modules/`." This has been validated across three review rounds. No further concerns. → design.md § "Decision 4"

**Re: @STACY — Decision 6 (Error Handling) — warnings vs errors**

- **Warnings are sufficient for all current conditions.** The extraction script is an authoring tool, not a deployment gate. Hard failures would block Lina's workflow during incremental updates. Warnings surface problems without blocking progress. This is the right tradeoff for an authoring-time tool. → design.md § "Decision 6"

- **One condition where I'd want escalation beyond a warning — but not a hard error.** If the extraction script generates a meta file where `purpose` is empty (not short — empty), that's not a warning-level issue. An empty purpose means the component is invisible to `find_components` purpose searches. It's functionally broken for discoverability. I wouldn't make it a hard error (that blocks generation), but I'd want it to be a distinct severity — something like "ERROR (non-blocking): ComponentX has empty purpose — component will not be discoverable via purpose search." This distinguishes "your purpose is short, consider expanding" (warning) from "your component is invisible" (error that doesn't block but demands attention). → design.md § "Decision 6"

  HOWEVER — counter-argument to my own suggestion: adding severity levels to warnings adds complexity to the extraction script for a condition that should be rare (who writes a metadata block with an empty purpose?). If the warn-on-under-10-words check catches short purposes, an empty purpose would also be caught. The distinction between "short" and "empty" may not be worth the implementation cost. I'll defer to Lina and Thurgood on whether this matters in practice.

**Re: Lina R1 — family-level fallback marking**

- Lina's suggestion to add a YAML comment (`# Derived from family-level guidance`) is a good idea for traceability. From a governance perspective, when I review a spec's component selection against `whenToUse`, knowing whether the guidance is per-component (high confidence) or family-level fallback (lower confidence, more interpretation needed) changes how I weight the finding. A family-level `whenToUse` that doesn't quite match the spec's usage is a softer finding than a per-component `whenToUse` that explicitly says "don't use this component for that." The comment makes this distinction visible without changing the data model. → design.md § "Decision 2"

**Re: Lina R1 — `alternatives` referencing non-existent components**

- Good catch. From a governance perspective, phantom alternatives are actively harmful — if I'm checking whether a spec used the right component and the `alternatives` field points me to a component that doesn't exist, I'd waste time investigating before discovering it's a phantom. Catching this at extraction time is better than catching it at query time (when the Application MCP warns) or at audit time (when I discover it manually). I support adding this to the error handling table. → design.md § "Decision 6"

**Re: Lina R1 — `cards` and `modals` vocabulary additions**

- Both are reasonable additions. `cards` is a context Leonardo would search for — his research included `find_components({ purpose: "card" })` as a primary query. `modals` is forward-looking but low-cost to add now. I support both. → design.md § "Decision 3"

**Re: Decision 1 (Benchmark Queries) — governance perspective**

- The 7 queries are the right set. From my perspective, the benchmark serves two purposes: (1) measuring the immediate enrichment improvement (Req 1), and (2) establishing a regression baseline for ongoing metadata quality. After the extraction pipeline ships, if a family doc edit accidentally degrades a purpose field, the benchmark queries would catch it — but only if they're run periodically, not just once. Recommend: the benchmark queries should be documented as a repeatable check, not just a one-time before/after measurement. This could be as simple as a script that runs the 7 queries and reports results. → design.md § "Decision 1"

**Re: Decision 5 (Knowledge Base Configuration) — governance utility**

- The Platform Resource Map is the piece that matters most for my work. The knowledge base configs help platform agents directly; the resource map helps me indirectly by giving me paths for manual parity comparison. The table format (Resource Type × Platform) is clean and scannable. One note: the resource map should include a "last verified" date or be tied to a maintenance trigger (e.g., updated when new components are added or directory structure changes). A stale resource map is worse than no resource map — it sends me to wrong paths. → design.md § "Decision 5"

**Re: Architecture (Data Flow) — governance observation**

- The data flow is clean. One thing I notice: my governance activities (selection verification, metadata accuracy review, escape hatch tracking) don't appear in the data flow diagram, which is correct — they're process activities that consume the data, not part of the data pipeline. But it's worth noting that the data flow has two consumer paths: agent queries (runtime, shown in the diagram) and governance audits (periodic, not shown). Both depend on the same data quality. The correctness properties (#1-7) protect both paths. → design.md § "Architecture"

**Re: Correctness Properties — all 7 are verifiable, one addition**

- Property #3 ("Per-platform readiness status matches actual filesystem artifact presence") is the one I'll rely on most. If this property holds, my readiness-based audit findings are trustworthy. The compliance test (Req 5) is the enforcement mechanism. → design.md § "Correctness Properties"

- **Suggested addition — Property #8**: "Escape hatch annotations in specs reference valid component names and valid `get_prop_guidance` selection rules." This is a weaker property (it depends on spec authors following the format), but it's verifiable during my selection verification review. If an escape hatch references a component that doesn't exist or a selection rule that's been updated, the escape hatch itself is stale. This connects the governance process (Position 7) to the data infrastructure (Positions 1-5). → design.md § "Correctness Properties"

  Counter-argument: this property is about process compliance, not data correctness. The other 7 properties are all about the data pipeline producing correct output. Adding a process property muddies the category. I'd accept either including it or noting it separately as a "governance invariant" rather than a correctness property.

**Overall assessment:**

The design is solid. The 6 decisions resolve all items deferred from requirements. The data flow is clean, the data models are well-specified, and the error handling is pragmatic (warn-don't-block). The testing strategy covers the right layers: extraction correctness, readiness compliance, discoverability benchmarks, and manual workflow validation.

The edge case I flagged in Decision 4 (baseline gate not enforced in the derivation pseudocode) is the only item I'd want addressed before proceeding to tasks. Everything else is refinement. -- [STACY R1]

#### [LEONARDO R1]

**Re: @LEONARDO — Decision 1 (Benchmark Queries)**

- **These are the right 7 queries.** They came directly from my research — real queries I'd make during screen specification work. The table format with expected results and gap report references makes them reproducible and traceable. → design.md § "Decision 1"

- **One missing query I'd add:** `find_components({ purpose: "toggle" })` or `find_components({ purpose: "switch" })`. This came up in my Task 5 (settings screen) research — I searched for a toggle/switch component and hit a gap. It's a useful benchmark because it tests a known gap: the query should return Input-Checkbox-Base as the closest match (with a note that a dedicated toggle component doesn't exist). If it returns nothing, the purpose field for Input-Checkbox-Base isn't capturing the toggle use case. → design.md § "Decision 1"

- **Stacy's point about repeatable benchmarks is good.** The queries should be a runnable check, not just a one-time measurement. A simple script that runs the 7 (now 8) queries and reports results would serve both the immediate enrichment validation (Req 1) and ongoing regression detection. Low implementation cost, high ongoing value. → design.md § "Decision 1"

**Re: Decision 3 (Controlled Vocabulary) — consumer search terms**

- **The initial vocabulary is solid.** The 12 values cover the major UI regions I search for. The consumer search terms per value are the real value — they're the feedback loop fix that was missing. → design.md § "Decision 3"

- **Lina's additions (`cards`, `modals`) are both correct.** `cards` is a context I'd search for — my research included `find_components({ purpose: "card" })`. `modals` is forward-looking but costs nothing to add now. → design.md § "Decision 3"

- **One more addition: `empty-states`.** My research Task 3 (dashboard) and the experience patterns include empty state handling. Components that appear in empty states (Icon-Base for illustrations, Button-CTA for primary actions) should be tagged. The empty-state experience pattern already exists — the context tag makes components discoverable outside the pattern. Consumer search terms: "no data, zero state, first-time experience, placeholder content." → design.md § "Decision 3"

**Re: Decision 2 (Usage Derivation Rules) — consumer perspective**

- **The two-tier strategy is correct from the consumer side.** Per-component entries are what I need for screen specification. When I query `get_prop_guidance("Badges")` and get "Use Badge-Count-Base for numeric indicators on navigation elements," that's directly actionable. Family-level "Use the Badge family for status indicators" requires me to interpret which family member fits. Per-component is always better for my workflow. → design.md § "Decision 2"

- **Lina's family-level fallback marking suggestion is valuable for me too.** If I see a `when_to_use` entry and know it's family-level fallback, I know to dig deeper (check the family doc, ask Lina) rather than treating it as definitive per-component guidance. The YAML comment approach is lightweight and sufficient. → design.md § "Decision 2"

**Re: Decision 4 (Readiness Scan) — architect's consumption perspective**

- **Stacy's edge case is real and should be addressed.** If a component has a platform implementation file and tests but is missing contracts, the derivation logic would say `production-ready` (file + tests + reviewed). But without contracts, the component's behavioral guarantees are undefined — I can't spec against it with confidence. The baseline gate should cap all platforms at `scaffold` when component-level artifacts are incomplete. Stacy's pseudocode addition is the right fix. → design.md § "Decision 4"

- **The status derivation gives me what I need for screen specs.** When I'm selecting components, I check: (1) does it exist? (2) is it usable on the target platform? (3) is it reviewed? The five-level status answers all three. `not-started` = doesn't exist on this platform. `scaffold`/`development` = exists but use with caution. `production-ready` = safe to spec against. `not-applicable` = intentionally absent, find an alternative. → design.md § "Decision 4"

**Re: Decision 5 (Knowledge Base Configuration)**

- **The Platform Resource Map table format is clean.** Resource Type × Platform is exactly how I'd look things up during cross-platform review. When I reviewed spec 085's native implementations (Tasks 1.5 and 2.3), I had to glob for files. This table would have saved that step. → design.md § "Decision 5"

- **Stacy's point about resource map staleness is valid.** A "last verified" date or maintenance trigger prevents the map from becoming misleading. Recommend: update the resource map as part of any spec that adds new components or changes directory structure. Lightweight process addition — the spec author adds a line to the map when creating new component directories. → design.md § "Decision 5"

**Re: Lina R1 — `alternatives` referencing non-existent components**

- **Support adding this to error handling.** From my perspective, phantom alternatives are worse than missing alternatives. If `alternatives` points me to a component that doesn't exist, I waste time investigating before discovering it's a phantom. If `alternatives` is empty, I know to look elsewhere. Catching phantoms at extraction time is the right place. → design.md § "Decision 6"

**Re: Stacy R1 — baseline gate enforcement in derivation pseudocode**

- **Agree this needs to be addressed.** A component at `production-ready` without contracts is misleading — I'd spec against it assuming behavioral guarantees exist when they don't. The baseline gate cap is the right fix. This is the only item I'd want resolved before proceeding to tasks. → design.md § "Decision 4"

**Overall assessment:**

The design is well-specified and resolves all deferred items from requirements. The data flow is clean, the derivation rules are workable, and the error handling is pragmatic. The controlled vocabulary with consumer search terms is the highest-value piece for my workflow — it's the feedback loop fix that was missing.

One item to address before tasks: Stacy's baseline gate enforcement in the readiness derivation pseudocode. Everything else is refinement that can be handled during implementation. -- [LEONARDO R1]

#### [ADA R1]

**Re: @ADA — Decision 4 (readiness scan)**

- **Component-level baseline artifacts: correct.** Schema, contracts, types required; tokens optional. I verified: 12 of 30 components have token files (8 use `tokens.ts`, 4 use `*.tokens.ts`). Marking tokens as not required for the baseline gate is the right call. → design.md § "Decision 4"

- **Token file pattern (`tokens.ts` or `*.tokens.ts`): correct.** Both patterns exist in the codebase. The glob handles naming inconsistencies (`Button-CTA.tokens.ts`, `avatar.tokens.ts`, `buttonIcon.tokens.ts`). → design.md § "Decision 4"

- **Status derivation edge case: all 30 components currently pass the baseline gate.** I audited every component — all have schema, types, contracts, and all three platform directories. The baseline gate has zero discriminating power today. Differentiation comes entirely from the `reviewed` flag. Fine for future-proofing, but the one-time migration task is purely about setting `reviewed` flags, not discovering baseline failures. → design.md § "Decision 4"

- **Stacy/Leonardo's baseline gate enforcement fix: agree.** Cap platforms at `scaffold` when component-level artifacts are incomplete. Correct for future components even though all 30 pass today. → design.md § "Decision 4"

- **Build artifact exclusion: complete.** Correctness Property #6 accurately captures the principle. → design.md § "Correctness Properties"

- **Platform Resource Map (Decision 5): `src/tokens/semantic/` confirmed present.** → design.md § "Decision 5"

**Re: Lina R1 — phantom alternatives warning**

- Good addition. Same class of error exists for token references, but extraction doesn't parse tokens, so not relevant here. If scope ever expands to token data, same warn-don't-block pattern should apply. → design.md § "Decision 6" -- [ADA R1]

#### [THURGOOD R2]

Incorporated all feedback:

**Blocking item (Stacy + Leonardo):**
- Baseline gate now enforced in derivation pseudocode — incomplete component-level artifacts cap all platforms at `scaffold` → design.md § "Decision 4"

**Lina R1:**
- Added `cards`, `modals` to controlled vocabulary → design.md § "Decision 3"
- Family-level fallback marking specified as YAML comment format → design.md § "Decision 2"
- Added phantom alternatives warning to error handling → design.md § "Decision 6"

**Leonardo R1:**
- Added `empty-states` to controlled vocabulary → design.md § "Decision 3"
- Added 8th benchmark query (`purpose: "toggle"` → Input-Checkbox-Base) → design.md § "Decision 1"
- Repeatable benchmark script noted for implementation

**Stacy R1:**
- Baseline gate enforcement in pseudocode (blocking item) → design.md § "Decision 4"
- Empty vs short purpose severity distinction deferred to implementation judgment
- Resource map maintenance trigger noted for implementation
- Correctness property #8 (escape hatch validity) noted as governance invariant, not added to correctness properties list

**Ada R1:**
- Confirmed token file patterns correct, baseline gate has zero discriminating power today (all 30 pass), build artifact exclusion complete. No new items — Ada's design outline feedback was already addressed, and the design doc accurately captures her positions.

**Thurgood's own assessment:**
- The design is solid. All deferred items from requirements are resolved. The baseline gate fix was the one real gap — without it, a component missing contracts could appear `production-ready`, which would mislead both Leonardo (speccing against it) and Stacy (auditing it). The fix is simple and correct.
- The controlled vocabulary at 15 values is a good starting size — large enough to be useful, small enough to be manageable. The consumer search terms per value are the real innovation here — they close the feedback loop that the research identified as the root cause.
- The 8 benchmark queries are concrete, reproducible, and traceable to the research. They should be a runnable script, not just a documentation artifact.

Ready to proceed to tasks.

---

## Tasks Feedback

### Context for Reviewers

5 parent tasks, 17 subtasks following the phased ordering from the collective review: Task 1 (immediate enrichment), Task 2 (readiness infrastructure), Task 3 (extraction pipeline), Task 4 (agent config + governance), Task 5 (MCP split design). Dependencies are explicit. Agent assignments follow domain boundaries.

**@LINA**: You own the bulk of implementation (Tasks 1.2, 2.1, 2.2, 3.1-3.5). Review scope, sequencing, and dependencies. Is the family doc audit (3.2) → metadata blocks (3.3) → extraction script (3.4) → validate (3.5) sequence workable?

**@LEONARDO**: Review Task 1 (benchmarks) and Task 5 (MCP split design). Are the benchmark tasks scoped correctly? Does Task 5.1 capture what Spec 081 needs from this spec?

**@STACY**: Review Task 4 (governance). Are Tasks 4.4 (prompt update) and 4.5 (escape hatch pattern) scoped correctly? Is the selection verification gate captured in the right place?

**@ADA**: Light review — any concerns about Task 2 (readiness) touching the indexer? Any token-related subtasks missing?

#### [ADA R1]

**Re: @ADA — Task 2 (readiness infrastructure)**

- **No concerns about Task 2 touching the indexer.** The readiness scan checks for file presence, not file content. It doesn't parse `tokens.ts` or validate token references — it just checks the file exists. That's the right boundary. Token content validation is a separate compliance concern (my domain + Thurgood's), not a readiness concern. → tasks.md § "Task 2"

- **No token-related subtasks missing.** The extraction pipeline (Task 3) doesn't parse token data — it extracts `purpose`, `contexts`, `usage`, and `alternatives` from family docs. Token references stay in `tokens.ts` and `schema.yaml`, which are untouched by this spec. The Platform Resource Map (Task 4.2) includes `src/tokens/semantic/` as the canonical token name reference, which was my recommendation. That's the only token-adjacent deliverable, and it's already captured. → tasks.md § "Task 3" § "Task 4.2"

- **One note on Task 2.1 (schema migration) for Lina.** All 30 components currently have `readiness: development` (or similar single string). The migration replaces this with per-platform `reviewed` flags. Lina should set `reviewed: true` only for platforms she has personally verified — not blanket `true` for all platforms just because the files exist. The whole point of the `reviewed` flag is that it's a human quality judgment, not an artifact presence check. If Lina hasn't verified Android rendering for a component, `reviewed: false` is the honest answer even if the Android implementation file exists. → tasks.md § "Task 2.1"

#### [LINA R1]

**Re: Sequencing (3.2 → 3.3 → 3.4 → 3.5) — workable, correct order**

The dependency chain is right. I can't write metadata blocks (3.3) without knowing which family docs have content (3.2). I can't build the extraction script (3.4) without metadata blocks to extract from (3.3). And I can't validate (3.5) without the script (3.4). No concerns with the sequence. → tasks.md § "Task 3"

**Re: Task 1.2 (Enrich high-impact purpose fields) — scope is right**

The prioritized list (Chip-Filter, Container-Card-Base, Badge-Count-Base, Container-Base, Input-Checkbox-Base) matches the benchmark queries that are most likely to fail. These are manual edits to existing meta files — they'll be replaced by generated files when Task 3 completes, but they unblock product development immediately. → tasks.md § "Task 1.2"

**Re: Task 2.1 (Schema migration) — Ada's note is correct and important**

Ada's right that `reviewed: true` should only be set for platforms I've personally verified. Honest assessment of what I can confidently mark `reviewed: true`:
- **Web**: Most components — I've built and tested the web implementations, verified demos.
- **iOS/Android**: Only components where I've done recent spec work with visual verification (Nav-TabBar-Base, Container-Card-Base after Spec 085, Nav-SegmentedChoice-Base). For many components, the native implementations exist but I haven't personally verified rendering.

This means most components will have `web: { reviewed: true }` and `ios/android: { reviewed: false }` after migration. That's honest. The `reviewed` flags can be updated incrementally as components are verified — either by me during future spec work or by platform agents during product development. → tasks.md § "Task 2.1"

**Re: Task 2.2 (Enhance Application MCP indexer) — this is the heaviest task**

This is an Architecture task (Tier 3) and it's the most complex subtask in the spec. It touches the Application MCP indexer, which is shared infrastructure. I want to flag:
- I should coordinate with Thurgood on the indexer changes since he owns the MCP infrastructure
- The task description says "Agent: Lina" but the indexer is arguably Thurgood's domain. I can implement the filesystem scan logic, but the integration into the indexer's pipeline should be reviewed by Thurgood. Suggest: Lina implements, Thurgood reviews.
- The compliance test (2.3) depends on 2.2, which is correct — Thurgood can't write the test until the indexer produces the data.

→ tasks.md § "Task 2.2"

**Re: Task 3.1 (Define controlled vocabulary) — joint task with Leonardo**

This is correctly assigned as "Lina + Leonardo." I provide the component perspective (what contexts exist today), Leonardo provides the consumer perspective (what terms he searches for). The design doc's initial 12 values plus my additions (`cards`, `modals`) give us 14 — we need to validate with Leonardo that these cover his search patterns and add any he identifies. → tasks.md § "Task 3.1"

**Re: Task 3.4 (Build extraction script) — Architecture type is correct**

This is the right classification. The script makes design decisions (derivation rules, fallback behavior, warning thresholds) that affect every component's metadata. It's not just implementation — it's establishing the pattern. Tier 3 validation is appropriate. → tasks.md § "Task 3.4"

**Re: Task 4.6 (Reference doc migration) — sequencing note**

The authoring guide update (part of 4.6) depends on Task 3 being complete — the guide needs to describe the extraction workflow, which doesn't exist until the script is built. The metadata header addition and MCP indexing can happen independently. Suggest splitting 4.6 into: (a) add metadata headers + configure indexing (independent, can happen in Phase 0), (b) update authoring guide content (depends on Task 3). → tasks.md § "Task 4.6"

**Re: Overall scope — 17 subtasks across 5 phases is a lot**

This is the largest spec I've worked on. The phasing helps — Tasks 1 and 4 are relatively independent and can proceed in parallel. Task 2 (readiness) and Task 3 (extraction) are the heavy phases. Task 5 is lightweight (documentation + validation).

My honest concern: Tasks 2.2 (indexer enhancement) and 3.4 (extraction script) are both Architecture-type tasks that require careful implementation. Having them in the same spec means two complex pieces of infrastructure shipping together. If either one has issues, it could delay the other. The phasing mitigates this (Task 2 completes before Task 3 starts), but it's worth noting that this spec's total implementation time is significant.

Not recommending scope reduction — all 9 positions are well-justified. Just flagging that this is a multi-week effort, not a multi-day one. → tasks.md § overall -- [LINA R1]
