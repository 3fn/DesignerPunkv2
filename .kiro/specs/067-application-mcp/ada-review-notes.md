# Ada's Review Notes — 067 Spec

**Date**: 2026-03-01
**Reviewer**: Ada (Rosetta token specialist)

---

## Token-Domain Findings

### 1. Pattern hints and token governance ⚠️ CONVENTION REQUEST

Experience pattern `hints` are prop-level guidance, not token references — outside my governance scope. But hints are a new documentation surface where authors may inadvertently embed raw values (`16px`, `#333`) instead of token references (`icon.size100`, `color.text.default`).

**Recommendation**: Add a convention note to the experience pattern schema definition: hints reference prop values and semantic intent, never raw pixel/color/spacing values. If a hint needs to reference a visual property, use token names.

**Counter-argument**: Premature governance. Tier 1 has 2-3 pattern files, all authored by Lina who knows the token system. Adding governance language to a barely-existing schema is over-engineering. But the convention is cheap to state now and expensive to retrofit at 30 pattern files.

### 2. `select_for_context` ranking heuristic — DESIGN DECISION NEEDED

Context matching is exact string matching against the `contexts` array, not fuzzy text search. When 6 components all match `registration-forms`, ranking order matters. Current `searchByPurpose` uses purpose-first/description-second/alphabetical — that heuristic doesn't transfer to exact-match context queries.

Options:
- (A) Alphabetical — simple, predictable, unhelpful
- (B) By component type (base → semantic → composite)
- (C) By role frequency in patterns (if a pattern exists, `required: true` components rank higher)
- (D) By `when_to_use` relevance (secondary text match within context-matched set)

Doesn't need solving in the design outline — flag for implementation phase.

---

## Observations (No Action Required)

### 3. `resolvedTokens` and assembly validation — FUTURE OPPORTUNITY

`validate_assembly` (Tier 1) is structural composition validation — Lina's domain. But if it gains accessibility validation (Q1), `resolvedTokens` could enable cross-component token consistency checks (e.g., conflicting color schemes, incompatible blend operations within an assembly). The 064/066 `resolvedTokens` structure was designed for this kind of analysis. Not a Tier 1 concern — flagging for when assembly validation scope expands.

### 4. Contexts vocabulary is substantial

68 unique context values across 28 components. `select_for_context` has real data from day one. Key contexts for the proposed initial pattern set: `login-forms` (2 components), `registration-forms` (4 components), `settings-screens` (3 components), `account-settings` (3 components).

---

## Input on Open Questions

**Q1 (Assembly validation scope)**: Keep accessibility checks in Tier 2. "Assembly-level WCAG" needs its own requirements analysis — what does it mean for a form to be accessible as an assembly? That question deserves dedicated analysis, not a bolt-on to structural validation.

**Q2 (Initial pattern set)**: Login form, registration flow, settings page are the right three. They exercise different composition patterns (single-step form, multi-step flow, list-based layout) and cover the most common contexts.

**Q3 (Configuration guidance)**: Defer. Let Tier 1 reveal whether pattern hints are sufficient or whether per-prop guidance is needed.

---

## Items Reviewed — No Concerns

- Tiering strategy (protocol-independent first, A2UI deferred to Tier 3) — correct
- Extend existing server decision (Q1) — correct, avoids indexer duplication
- Two-layer pattern architecture (system/project with `source` field from day one) — clean extension point
- Hybrid experience patterns (derived-from-contexts + authored files) — good balance
- Agent assignment for Ada (token implications review) — accurately scoped

---

## Supplemental Notes (2026-03-01, post Lina review)

After reviewing Lina's feedback and Peter's confirmed decisions.

### Amendment to Q1 position — Accessibility in Tier 1

My original position: keep accessibility checks in Tier 2. Lina and Peter decided Tier 1. I'm adjusting but not fully conceding.

**What I accept**: Lina's 5 specific checks (form has submit action, fields have labels, mutually exclusive choices use Radio-Set, required fields marked, legal consent not pre-checked) are individually tractable and derivable from existing data.

**Where I still disagree**: These checks are pattern-specific rules, not universal assembly validation. "Form has a submit action" only makes sense when validating a form. Hardcoding pattern-specific accessibility rules in the validator couples the validation engine to specific patterns. When the pattern library grows from 2 to 20, the validator becomes a growing list of special cases.

**Alternative I'd advocate for**: Make the pattern `accessibility` field machine-readable assertions instead of prose. Validation checks live in the pattern files, not the validator. `validate_assembly` evaluates the assertions declared by the pattern being built. Accessibility rules scale with the pattern library, not with hardcoded validator logic.

**Why I might be wrong**: Machine-readable accessibility assertions add schema complexity for 2 pattern files. Hardcoded checks are simpler to implement and sufficient for the proof-of-concept. The refactor to declarative assertions can happen when the pattern library grows. Pragmatism may beat architecture here.

**Net position**: I think the declarative approach is the better design. But if the team proceeds with hardcoded checks for Tier 1, I won't block it — I'll flag it as technical debt to revisit when the pattern count exceeds ~5.

### Amendment to ranking concern

Original concern about `select_for_context` ranking heuristic is resolved. Peter confirmed: no relevance scoring, deterministic filtering, agent decides relevance. Alphabetical sort. Clean.

### New concern: Assembly input schema

Lina flagged this as "not a blocker." I want to push harder. The input schema for `validate_assembly` defines the agent interaction contract — how an agent represents a component tree. This shapes every integration. Getting it wrong means every consuming agent builds against a bad contract.

**Recommendation**: Resolve the assembly input schema as an explicit design decision before implementation starts. Include it in the requirements doc or resolve it in the design phase. Don't discover it mid-build.

### Agreed positions (no amendments)

- Extend `findComponents` with `context` filter instead of new `select_for_context` tool — Lina is right
- 2 initial patterns instead of 3 — correct for proof-of-concept
- Interview-driven guidance capture — good approach, my consultation role (token implications of hints) is accurately scoped
- `get_prop_guidance` deferred to follow-up spec — pattern hints cover immediate need

---

## Pattern Interview Review (2026-03-02)

### Token issue: `space.stack.300` in settings-screen.yaml

The `sectionSpacing` hint references `space.stack.300` and `space.stack.200`. These tokens don't exist. The semantic spacing system uses `space.layout.separated.normal` (→ `space300` / 24px) and `space.layout.separated.tight` (→ `space200` / 16px).

Corrected hint:
```yaml
sectionSpacing: "Use space.layout.separated.normal (24px) between sections. Sections are independent content groups. For dense mobile layouts, space.layout.separated.tight (16px)."
```

This is the kind of drift D9 was designed to prevent. The PatternIndexer validates component names but not token names in hints — worth flagging as a future enhancement.

### Token issue: `simple-form.yaml` alternative reference

`simple-form.yaml` references `multi-step-flow` in alternatives. The actual pattern is named `account-onboarding`. Either update the reference or remove it if the intent was a generic multi-step pattern.

### Pattern B consultation responses

- **Conditional fieldset transitions**: Don't hint. Runtime interaction, product-specific. The segmented controller is itself a component gap — hinting at motion tokens for a nonexistent component is premature.
- **Branding area spacing**: Don't hint. Branding element is a component gap. Spacing depends on the component's sizing and visual weight, which we can't know until it exists.

### Pattern C consultation response applied

Section spacing recommendation (`space.layout.separated.normal`) was adopted but with incorrect token name (see above).

### Cross-pattern observations

- **D9 compliance**: Clean across all three patterns except the `space.stack` error in settings-screen.
- **Hint format consistency**: Padding hints use guidance-oriented format consistently. `componentGap` convention consistent.
- **`optional` field**: First use in account-onboarding (remember-me checkbox). Semantically correct.
- **Conditional content via `visibility` hints**: Works as a workaround. If conditional content recurs in future patterns, a schema-level mechanism would be cleaner. Track across future patterns.
- **Schema held up**: Three structurally different patterns (flat form, multi-section list, multi-step conditional) required no schema changes beyond Pattern A additions.

### Component gaps across all three patterns

| Gap | Surfaced in | Placeholder |
|-----|------------|-------------|
| Toggle/switch | settings-screen | Input-Checkbox-Base |
| Detail-value VerticalList-Item variant | settings-screen | Label text workaround |
| Expand-collapse/accordion | settings-screen | None (noted only) |
| Segmented controller | account-onboarding | Container-Base |
| Link/text-button | account-onboarding | Container-Base |
| Logo/branding element | account-onboarding | Container-Base |
| Text/paragraph display | account-onboarding | Container-Base |

No token implications from any of these gaps — they're component-layer concerns for Lina when the components are built. The `componentGap` hint convention handles them cleanly.
