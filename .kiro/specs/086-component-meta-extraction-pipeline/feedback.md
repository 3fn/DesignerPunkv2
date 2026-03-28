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

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

[Agent feedback rounds here]
