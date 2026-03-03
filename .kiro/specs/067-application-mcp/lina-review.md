# Lina's Review: 067 Application MCP Design Outline

**Date**: 2026-03-01
**Reviewer**: Lina (Stemma Component Specialist)
**Status**: Review complete — feedback incorporated into planning

---

## Overall Assessment

The outline is well-structured. Tiering is smart — protocol-independent capabilities first, A2UI deferred. The decision to extend the existing server rather than spin up a separate one is correct. The experience pattern schema is the most interesting and highest-value part of this work.

---

## Feedback by Topic

### 1. `select_for_context` — Extend `findComponents`, Don't Create a New Tool

The existing `findComponents` accepts `category`, `concept`, `platform`, and `purpose` filters. Adding a `context` filter is a small extension to the same method. A dedicated `select_for_context` tool risks being a thin wrapper.

The real value isn't the context filter — it's the enriched response shape. Today `findComponents` returns `ComponentSummary`, which lacks `when_to_use`, `when_not_to_use`, and `alternatives`.

**Recommendation**: Add a `context` filter to `findComponents` and return an enriched response shape (an `ApplicationSummary` or similar) that includes selection guidance fields. One tool, richer output.

**No relevance scoring.** Peter confirmed: no ranking algorithms. Return exact-match results sorted deterministically (alphabetical). The consuming agent decides relevance. We provide facts and opinions, not rankings.

### 2. `validate_assembly` — Accessibility Belongs in Tier 1

Structural-only validation is a half-measure. The application MCP's purpose is guiding agents toward good results. "Structurally valid but inaccessible" is a bad outcome.

**Agreed with Peter**: assembly-level accessibility checks are a Tier 1 expectation. Basic checks:
- Form has a submit action
- Form fields have labels
- Mutually exclusive choices use Radio-Set, not multiple Checkboxes
- Required fields are marked
- Legal consent checkboxes are not pre-checked

These are tractable and derive from existing contract and component-meta data.

### 3. Experience Patterns — Start with 2, Not 3

The outline proposes 3 initial patterns (login, registration, settings). Authoring cost is underestimated — the YAML structure is easy, but the design judgment in `hints` and `accessibility` notes is the hard part.

**Recommendation**: Start with login form and registration flow. Both are well-understood from recent 066 work. Settings page can follow once the format is validated.

### 4. `get_prop_guidance` (Tier 2) — Defer to Follow-Up Spec

Pattern `hints` already provide context-specific prop guidance. A standalone per-component guidance tool adds value only when configuring outside a known pattern — a less common case for the initial proof-of-concept.

**Recommendation**: Defer entirely to a follow-up spec. Don't leave it as "maybe in this spec."

### 5. Assembly Input Schema — Needs Definition

The outline covers selection, assembly guidance, and validation but doesn't define how an agent represents a component tree for validation. What does the input to `validate_assembly` look like?

Not a blocker — but should be a design decision during implementation.

### 6. Pattern Authoring Cost

The outline rates authoring 2-3 patterns as "Low-Medium." Having authored schemas for 8 components in 066, I'd rate each pattern as Medium. The design judgment — what hints to include, what accessibility notes matter at the assembly level, what alternatives to reference — is the expensive part.

---

## Interview-Driven Guidance Capture

Peter proposed an interview approach for authoring pattern guidance: agents ask questions about component usage, Peter answers, and the answers become pattern content. This is the agreed approach.

**Why it works:**
- Surfaces tacit design knowledge that wouldn't emerge from documentation alone
- Naturally produces the right granularity — definitive answers are system-level guidance, "it depends" answers are project-level
- Validates the pattern schema — if an answer has no field to live in, the schema has a gap

**Execution approach — front-loaded within spec execution:**
1. Define experience pattern schema (YAML structure)
2. Interview for pattern #1 (login form) — fill the schema live, discover gaps
3. Adjust schema if interview reveals structural gaps
4. Build indexer and tools against validated schema
5. Interview for pattern #2 (registration flow) — faster with proven format
6. Wire up `validate_assembly` with accessibility checks

The first pattern co-evolves with the schema. The second pattern benefits from a battle-tested format.

**Interview domain split:**
- Lina leads: component selection, composition, roles, hints
- Ada consulted: token implications of hints
- Thurgood consulted: contract coverage, assembly-level validation checks

---

## Revised Tool Recommendation

| Tool | Tier | Notes |
|------|------|-------|
| `findComponents` (enhanced) | 1 | Add `context` filter + enriched response with `when_to_use`, `alternatives` |
| `get_experience_pattern` | 1 | Serve authored pattern files |
| `list_experience_patterns` | 1 | List available patterns with descriptions |
| `validate_assembly` | 1 | Tree validation + assembly-level accessibility checks |
| `get_prop_guidance` | Deferred | Follow-up spec — pattern hints cover immediate need |
| `render_a2ui` | 3 | Defer unless protocol stabilizes |

---

## Decisions Confirmed with Peter

1. No relevance scoring — deterministic filtering, agent decides relevance
2. Accessibility validation in Tier 1
3. Interview-driven guidance capture, front-loaded within execution
4. 2 initial patterns (login, registration), not 3

---

## Supplemental Notes (2026-03-01, post Ada review)

After reading Ada's review notes and reflecting on points of agreement and disagreement.

### New agreement: Token governance convention for hints

Ada's recommendation to add a convention note ("hints reference prop values and semantic intent, never raw values") is correct and cheap. Should be included in the pattern schema definition from day one.

### Amended position: Assembly input schema

My original note called this "not a blocker — work it out during implementation." Ada pushed harder: the assembly input schema defines the agent interaction contract, and getting it wrong means every consuming agent builds against a bad contract.

**I'm upgrading this to: resolve before implementation.** The assembly input schema should be an explicit design decision in the requirements or design phase. It determines how agents represent component trees for validation — that's a foundational interface, not an implementation detail.

### Partial disagreement: Accessibility checks — hardcoded vs. declarative

Ada advocates for machine-readable accessibility assertions in pattern files so the validator stays generic and rules scale with the pattern library. Architecturally, this is the better long-term design.

**Where I disagree for Tier 1**: Declarative assertions require a rule engine embedded in YAML — the pattern schema jumps from descriptive ("here's what a registration flow looks like") to prescriptive ("here are machine-evaluable constraints"). That's significant schema complexity for 2 pattern files.

**Where I agree with Ada**: Hardcoded checks are technical debt. When the pattern library grows past ~5, the validator becomes a growing list of special cases.

**My position**: Hardcoded checks for Tier 1, with explicit acknowledgment that this is conscious technical debt. Revisit when pattern count exceeds ~5. Ada's declarative approach becomes the target architecture for that refactor.

### Disagreement: 2 patterns vs. 3

Ada recommends 3 initial patterns (login, registration, settings) to exercise different composition patterns. I maintain 2 (login, registration). The format validation happens on pattern #1. Pattern #2 confirms the format works. Pattern #3 adds authoring cost without adding format confidence. Settings page exercises a different composition pattern (list-based layout), which is valuable — but that value is better captured after the schema is proven, not during the proof-of-concept.

Peter's call on this one.
