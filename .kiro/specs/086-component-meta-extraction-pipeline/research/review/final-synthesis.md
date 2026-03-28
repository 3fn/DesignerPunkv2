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

### Kenya

### Data

### Stacy

### Thurgood
