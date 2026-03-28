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

---

## Requirements Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

[Agent feedback rounds here]
