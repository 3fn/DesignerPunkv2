# Spec 086 Research Analysis: Stacy's Governance Perspective

**Date**: 2026-03-27
**Analyst**: Stacy
**Participants reviewed**: Leonardo, Sparky, Kenya, Data, Stacy, Lina
**Note**: This analysis is independent of Thurgood's. We may overlap on findings — that's convergent evidence, not redundancy.

---

## Executive Summary

The research reveals a system that works well for its primary purpose (component selection) but has structural gaps that will compound as the product scales. The MCP is strong on *what to use* and weak on *how to verify it was used correctly*. That's my core concern: the discoverability system is built for the decision-making moment but not for the accountability loop that follows.

Six findings, organized by what they mean for product governance.

---

## Finding 1: The Selection-to-Verification Gap

**The problem**: Leonardo selects components. Platform agents implement them. I audit whether the implementation matches the selection. But the tools that help Leonardo select don't help me verify.

Leonardo's workflow is well-served: `find_components` → `get_prop_guidance` → selection rules → decision. That chain works. But my workflow — "did Kenya actually use Container-Card-Base where Leonardo specified it, with the right props, referencing the right tokens?" — has no tooling support.

**Evidence across agents**:
- Leonardo makes selection decisions using `whenToUse`, `alternatives`, and selection rules — these are excellent for the decision point
- Platform agents (Sparky, Kenya, Data) all confirm they switch from MCP to source code for implementation — meaning the MCP loses visibility at the exact point where drift can occur
- My own research confirmed: I can audit selection correctness component-by-component using `get_prop_guidance`, but there's no way to validate a whole spec's component tree against selection rules in one pass

**Why this matters for governance**: If I can't efficiently verify that implementations match specs, and specs match selection guidance, then the selection guidance is advisory — not enforceable. The system has good rules but no enforcement mechanism.

**What I'd need**: A "spec validation" mode — give it a component tree with usage context, get back selection-rule violations. `validate_assembly` checks structural composition and accessibility. Nothing checks selection correctness.

**Counter-argument**: Maybe enforcement isn't the MCP's job. The MCP is a knowledge system, not a compliance system. Enforcement could live in code review, test assertions, or a separate audit tool. Building enforcement into the MCP risks making it rigid. But *some* mechanism needs to exist, and right now none does.

---

## Finding 2: Platform Agents Share the Same Gap, Described Differently

**The pattern**: Sparky, Kenya, and Data all describe the same fundamental problem — the MCP gets them to the right component but doesn't help them implement it on their platform. They describe it in platform-specific terms:

- Sparky: "No Custom Element tag names, no HTML attributes, no slot structure"
- Kenya: "No SwiftUI view name, no Swift token constants, no platform behavioral notes"
- Data: "No Composable signature, no Kotlin token constants, no Android-specific API surface"

**What governance sees**: This is one gap expressed three ways. The MCP's platform-agnostic design is architecturally sound (contracts *should* be universal), but it creates a blind spot between "component selected" and "component implemented." That blind spot is where parity drift happens.

When all three platform agents independently switch from MCP to source code at the same point in their workflow, that's a systemic handoff gap — not three individual complaints. And it's the handoff gap where I lose audit visibility.

**Parity implication**: If each platform agent is independently translating cross-platform contracts into platform-native code by reading source files, there's no shared reference point I can audit against. I can check that both iOS and web *claim* to implement Container-Card-Base, but I can't verify they're implementing the same behavioral surface without reading both codebases — which is outside my audit scope.

**What I'd need for parity auditing**: A per-platform API manifest that I can compare across platforms. Not implementation code — just the public API surface. "On web, Container-Card-Base exposes these attributes and events. On iOS, it exposes these SwiftUI parameters. On Android, these Composable parameters." Then I can check: do all three surfaces map to the same behavioral contract?

**Counter-argument**: Kenya raised a good one — baking platform details into the MCP couples metadata to implementation choices. If SwiftUI changes, you'd update both the contract AND the platform hints. The decoupling has real value. But the parity audit cost of that decoupling is also real. The question is whether generated (not hand-authored) platform API references could give us the audit surface without the coupling risk.

---

## Finding 3: Lina Is Authoring Blind, and That's a Process Problem

**The evidence**: Lina explicitly says she's "optimizing for search terms I can't predict." She has no data on what consumers actually search for. She doesn't test discoverability after authoring. There's no feedback loop.

**What governance sees**: This is a classic process gap — the author and the consumer are disconnected, with no mechanism to close the loop. It's the same pattern I'd flag in any product process: if the person writing the spec never sees how the person reading the spec interprets it, quality degrades over time.

**The specific failures this causes**:
- `purpose` fields describe implementation properties instead of product problems (Leonardo's core complaint)
- `contexts` tags are guessed without validation (Lina's core complaint)
- No post-authoring verification (Lina has never run `find_components` to test her own metadata)

**What I'd recommend**: A lightweight feedback loop, not a heavy process.

1. After this research, publish Leonardo's actual search terms as a reference for Lina. That's immediate, zero-infrastructure.
2. Add a "discoverability check" step to the component-meta authoring workflow: after writing the meta file, run 3-5 `find_components` queries that a product agent would plausibly use. If the component doesn't appear, revise.
3. Periodically (quarterly? per-release?) collect actual search queries from product agents and compare against what the metadata surfaces. This is the long-term feedback loop.

**Counter-argument**: Adding process steps to Lina's workflow adds overhead. If the component catalog stays small (30 components), the discoverability problem is manageable through catalog browsing — Leonardo confirmed this is his most common fallback. The feedback loop matters more at scale.

---

## Finding 4: Readiness Is a Governance Blind Spot

**The evidence**: Three agents independently flagged readiness granularity:
- Data: "What does 'development' mean practically? Is the Android implementation complete? A stub?"
- Sparky: "I need per-platform readiness, not a single field"
- My own research: "No readiness-to-spec impact guidance — can you spec against development components?"

**What governance sees**: Readiness is the single field I'd use most for audit decisions, and it's the least informative field in the metadata. When I audit a spec that references Container-Card-Base (`development` readiness), I need to answer:

1. Is it safe to spec against this component? (Spec quality audit)
2. Is the web implementation usable? (Implementation coverage audit)
3. Is the iOS implementation at the same stage as web? (Parity audit)
4. Should I flag this as technical debt? (Documentation audit)

The current single `readiness` field answers none of these questions.

**What I'd need**:
- Per-platform readiness: `{ web: "production-ready", ios: "development", android: "not-started" }`
- Readiness definitions: what each level means for spec authors ("you can spec against development components, but expect contract changes") and for implementers ("development means the contract is draft, implementation may be partial")
- Contract stability indicator: is the behavioral contract finalized even if the implementation isn't?

**Priority assessment**: This is low-effort, high-governance-impact. Adding a per-platform readiness object to the meta schema and defining what each level means would immediately improve my ability to audit specs and flag risks.

---

## Finding 5: Experience Patterns Are Undervalued Relative to Their Impact

**The evidence**: Leonardo and Sparky both reach for experience patterns before individual component search. Leonardo's fallback chain lists patterns at step 3, but his actual task responses show he goes to patterns first when they exist. Sparky's most detailed, confident answers came from tasks where a pattern existed (dashboard, multi-section-form).

**What governance sees**: Patterns are the highest-leverage discoverability investment because they solve the composition problem that individual component metadata can't. A pattern tells you "for a settings screen, use these components in this structure with these accessibility requirements." Individual component metadata tells you "Container-Base can be used for page sections" — true but insufficient for building a screen.

**The governance angle**: Patterns are also the most auditable artifact. When Leonardo specs a screen using the `dashboard` pattern, I can verify the spec follows the pattern. When Leonardo assembles a screen from individual components without a pattern, I'm auditing against his judgment — which is harder and more subjective.

More patterns = more auditable specs = better governance coverage.

**Current state**: 9 patterns indexed (per `get_component_health`). Leonardo identified gaps for notification lists, settings screens with grouped sections, and dashboard layouts. Sparky identified gaps for sticky filter bars and form error summaries.

**Recommendation**: Prioritize pattern creation for the most common product screens. Each new pattern simultaneously improves discoverability (Leonardo's concern), implementation guidance (platform agents' concern), and auditability (my concern). Triple value per unit of effort.

---

## Finding 6: The "Changed vs Stayed the Same" Responses Reveal the MCP's True Value Boundary

Every agent was asked what changed after accessing the MCP and what stayed the same. The pattern across all six responses is remarkably consistent:

**What changed** (MCP's unique value):
- DesignerPunk-specific design decisions (no disabled states, `aria-pressed` vs `aria-selected`)
- Composition relationships (Container-Card-Base composes Container-Base internally)
- Component existence and gaps (no continuous progress bar, no list item component)
- Selection rules that encode design intent
- Token semantic levels (mode maps, level-1 vs level-2)

**What stayed the same** (not the MCP's job):
- Platform implementation knowledge (SwiftUI, Compose, Web Components)
- General design patterns (how to structure a form, when to use tabs vs segments)
- Accessibility fundamentals (ARIA roles, VoiceOver, TalkBack)

**What governance takes from this**: The MCP's value is encoding *decisions that have already been made* — design philosophy, component selection logic, composition constraints, accessibility stances. It's a decision record, not a knowledge base.

This means the quality of the MCP is directly proportional to the quality of the decisions it encodes. If a selection rule is wrong, the MCP propagates that error to every agent that queries it. If a `whenNotToUse` entry is missing, the MCP silently allows a bad selection.

**Governance implication**: The MCP metadata needs periodic review — not just for accuracy, but for completeness of decision encoding. Are all the important selection decisions captured? Are the `whenNotToUse` entries comprehensive? Are the alternatives bidirectionally consistent? This is an audit I should be doing, and I haven't been.

---

## Cross-Cutting Observation: The Research Method Itself

This is a process note, not a finding — but it's worth capturing.

The isolated per-agent research method worked. Six agents, answering independently, converged on the same core findings (vocabulary mismatch, platform implementation gap, readiness granularity) while also surfacing role-specific insights that wouldn't have emerged from a group discussion. Leonardo's vocabulary mismatch complaint and Lina's "authoring blind" complaint are two sides of the same coin — but neither agent would have articulated the other's perspective.

The method also revealed something about agent self-awareness. Every agent accurately identified the boundary of the MCP's value for their role. Nobody overclaimed. Nobody said "the MCP should teach me SwiftUI." That's a healthy signal — the agents understand their tools and their own expertise.

**Process recommendation**: Use this isolated-then-synthesize method for future cross-agent research. It prevents anchoring bias and produces richer findings than a group session would.

---

## Priority Recommendations (Governance Perspective)

| Priority | Finding | Why (Governance) | Recommended Action |
|----------|---------|-------------------|-------------------|
| 1 | Readiness granularity (#4) | Directly blocks spec audit and parity audit | Add per-platform readiness to meta schema; define readiness levels |
| 2 | Vocabulary mismatch (via Lina feedback loop, #3) | Root cause of selection errors I'd later have to catch | Publish consumer search terms; add discoverability check to authoring workflow |
| 3 | Experience patterns (#5) | Highest-leverage improvement for auditability | Prioritize pattern creation for common product screens |
| 4 | Selection-to-verification gap (#1) | No enforcement mechanism for selection rules | Explore spec-level validation (component tree against selection rules) |
| 5 | Platform API manifests (#2) | Parity auditing is currently manual and outside audit scope | Consider generated per-platform API surfaces for parity comparison |
| 6 | MCP metadata review cadence (#6) | Decision encoding quality degrades without review | Establish periodic metadata accuracy audit |

**Note on priority differences from Thurgood**: Thurgood would likely prioritize the vocabulary mismatch and dual maintenance findings — those are discoverability and infrastructure concerns in his domain. I'm prioritizing readiness granularity and the selection-to-verification gap because those directly affect my ability to audit product quality. Both prioritizations are valid; they reflect different operational needs.

---

## What I'd Want to Discuss with Peter

1. **Is selection-rule enforcement worth building?** The MCP has good selection rules. Nothing enforces them. Is that acceptable, or should we invest in a validation tool? The answer depends on how much selection drift we're actually seeing in practice — and we don't have data on that yet.

2. **Should I be auditing MCP metadata quality?** Finding 6 suggests the MCP is only as good as the decisions it encodes. Someone should periodically verify that the metadata is complete and accurate. That's governance work. But it's also system-level work that might be Thurgood's domain. Where does the boundary fall?

3. **How much parity auditing infrastructure is worth building now?** We're currently iOS-only for product work. Parity auditing is dormant. But the platform agents' research reveals that the parity gap will be significant when a second platform comes online. Do we invest now (when it's cheap to build but not yet needed) or later (when it's needed but more expensive to retrofit)?
