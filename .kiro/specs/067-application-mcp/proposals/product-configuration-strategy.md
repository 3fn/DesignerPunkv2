# DRAFT: Product Configuration Layer — Strategy Doc Proposal

**Date**: 2026-03-02
**Author**: Ada (Rosetta Token Specialist)
**Status**: APPROVED — added to `.kiro/docs/agentic-ui-strategy.md` on 2026-03-02
**Target document**: `.kiro/docs/agentic-ui-strategy.md`
**Proposed placement**: After "Two MCPs, Two Audiences", before "Why DesignerPunk Is Better Positioned"

**Origin**: Pattern A interview surfaced a gap — products adopting DesignerPunk need a way to set component configuration defaults. Analysis and initial positions documented in `interviews/pattern-a-interview.md`. All four team members reviewed the analysis. Peter approved drafting the strategy section.

---

## Proposed Section

---

### Product Configuration Layer

The application MCP embodies DesignerPunk's opinionated intelligence — its best judgment about how to apply the design system. Out of the box, that intelligence reflects system-level defaults. Products adopting DesignerPunk need a way to tune that intelligence to their context without forking the system.

#### Three layers of product preference

Products express preferences at three levels:

1. **Token values** — "Our primary color is X." Solved by the Rosetta theming pipeline. Products create custom themes that change token values while preserving mathematical relationships.

2. **Component configuration defaults** — "Our containers default to padding 200." "Our submit buttons use the primary variant." No mechanism exists today. This is the gap.

3. **Assembly preferences** — "Our forms use elevated containers." "Our onboarding is 3 steps." Solved by project-level experience patterns (`source: project`, `extends` mechanism).

Layer 2 is the most common product need. Most products don't need custom patterns — they want to tune how the system's existing components behave by default.

#### Resolution order

When the MCP assembles guidance for an agent, product preferences merge with system defaults in a defined cascade:

```
Component built-in defaults → Product component defaults → Product role defaults → Pattern hints → Agent decision
```

Each layer overrides the previous. The agent always has final say — product defaults are defaults, not constraints. When multiple layers provide a value for the same property, the more contextual layer wins: role defaults override component defaults, pattern hints override role defaults, agent decisions override everything.

**Component defaults** apply whenever a component is used, regardless of context. **Role defaults** apply when a component fills a specific role in a pattern (e.g., `form-container`, `submit-action`). Role defaults are more contextual and override component defaults when both apply.

#### Scope: MCP advisory layer, not component runtime

The product configuration layer configures the MCP's *recommendations*, not the components themselves. A developer using Container-Base directly still gets the component's built-in default. The product default only surfaces when an agent queries the MCP for guidance.

This preserves developer flexibility. The MCP is the system's opinionated intelligence; developers can follow its guidance or diverge for exploration, experimentation, or edge cases the MCP's patterns don't cover. The MCP teaches; it doesn't constrain.

#### Boundary: configuration references tokens, doesn't create them

Product configuration values must reference existing token values. A product can set `Container-Base.padding: "200"` because `space.inset.200` exists. Setting `padding: "500"` is a blocking error — the value doesn't exist in the token system. If a product needs a value that doesn't exist, the path is to extend the token layer first, then reference the new value in configuration.

This enforces the token-first principle at the configuration layer. Products configure within the design system's vocabulary, not outside it.

#### Theme independence

Component configuration defaults are generally theme-independent. A product sets `padding: "200"` and it applies across all themes. If a product needs different prop defaults per theme, that's typically a signal the prop should be a token (theme-resolved) rather than a configuration default. Edge cases exist (e.g., variant selection in accessibility themes) — theme-conditional configuration is a future consideration.

#### Authorship and setup

Product configuration is authored by any stakeholder — developers, designers, or agents — and lives in the product's own repository. DesignerPunk ships with no product configuration; the MCP's defaults are the system defaults. A product connects its configuration to the MCP through a setup mechanism.

**Adoption requirement**: Seamless onboarding is a priority. Products should be able to configure the MCP quickly with clear guidance, starter templates, and a straightforward connection mechanism.

#### Integration points with existing architecture

The product configuration layer connects to existing 067 architecture:

- **`role` field on pattern components** — the hook for role-specific defaults
- **`source` field on patterns** (`system` / `project`) — separates system intelligence from product preferences
- **`extends` field on patterns** — project patterns inherit and override system patterns
- **`ApplicationSummary` response shape** — must accommodate merged defaults without breaking the response contract

#### Open questions (future spec territory)

- **Configuration file format and directory structure** — YAML is the likely format (consistent with schemas and patterns). Directory location and naming conventions to be determined.
- **MCP connection mechanism** — How the MCP discovers and loads product configuration. Configuration path at startup, environment variable, or convention-based scan.
- **Validation mechanism** — How product configuration values are validated against component property definitions. Blocking errors for invalid values are confirmed; the validation implementation is future spec territory.
- **Merge semantics** — Detailed rules for how component defaults, role defaults, and pattern hints compose. Edge cases (conflicting role defaults, circular extends) need specification.
- **CLI scaffolding** — Whether a `designerpunk init-product` or similar command scaffolds the configuration directory and starter template.

---

## Rationale

**Why add this now**: The Pattern A interview surfaced a real gap. Documenting the strategy prevents 067 and future specs from accidentally closing doors. The `ApplicationSummary` response shape in 067 should be designed with merged defaults in mind.

**Counter-argument**: This is strategy without a concrete product need. We might architect a configuration layer that no real product wants. The resolution order follows well-understood cascade patterns (CSS, theme systems, build tool configs), so the risk is low — but it's not zero.

**Impact**: No implementation changes. Informs future design decisions.

---

## Consultation Requests

### For Lina

This proposal affects the MCP response shapes and indexer you're building in 067. Specific questions:

1. Does the resolution order (built-in → product component defaults → product role defaults → pattern hints → agent decision) create any concerns for how `ApplicationSummary` or `get_experience_pattern` responses are structured?
2. Does the "MCP advisory layer, not component runtime" scoping feel right from the component architecture side? Any cases where a product would reasonably expect configuration defaults to affect components directly, not just MCP guidance?
3. Any concerns about the indexer needing to scan an external product configuration directory in the future? Does that change how you'd design the indexer now?

### For Thurgood

This proposal introduces a validation surface — product configuration values validated against component property definitions. Specific questions:

1. The "blocking error on invalid values" position (e.g., `padding: "500"` when the component only accepts `none | 050–400`) — does this align with how you'd approach configuration validation? Any edge cases where a warning might be more appropriate than a blocking error?
2. The resolution order is a cascade with 5 layers. Merge conflicts are possible (e.g., product component default says `padding: "200"`, product role default says `padding: "300"`). Should the strategy doc take a position on conflict resolution, or leave it for the implementation spec?
3. Any structural concerns about the proposal that should be addressed before it goes into the strategy doc?

---

## Lina's Review (2026-03-02)

### Overall Assessment

No blocking concerns. The strategy identifies a real gap, proposes a clean resolution order, and stays out of 067's implementation scope. Ready for ballot measure from my perspective.

### Responses to Consultation Questions

**Q1 — Resolution order and response shapes**: No concerns. The cascade merges before the response is assembled — the agent sees the final result, not the layers. `ApplicationSummary` is designed as flat promoted fields (`whenToUse`, `contexts`, `alternatives`), not a nested `defaults` sub-object. Product defaults can be merged into those flat fields without changing the interface. No 067 design changes needed.

**Q2 — MCP advisory vs. component runtime**: Scoping feels right. One edge case worth noting: if a product sets `Container-Base.padding: "200"` as a default and an agent follows it, but a developer inspects the component and sees no built-in padding default — there's a disconnect. This is fine as long as the MCP's guidance is transparent about being a recommendation. The agent should pass the value explicitly, not assume the component defaults to it. Not a problem with the strategy — just a documentation note for the future implementation spec.

**Q3 — Indexer scanning external directories**: No concerns for current design. `PatternIndexer` already scans a directory path passed at startup. Adding a product configuration directory in a future spec follows the same pattern — pass the path, scan, merge. I wouldn't change the indexer design now to accommodate this. The extension point is natural.

### Additional Notes

- The "boundary: configuration references tokens, doesn't create them" section is important and well-stated. Prevents the configuration layer from becoming a backdoor for arbitrary values. Good governance.
- The theme independence principle (configuration is theme-independent; if you need per-theme defaults, the prop should be a token) is a clean rule that avoids complexity.

## Thurgood's Review (2026-03-02)

### Overall Assessment

Well-scoped. Stays at the strategy level, marks implementation details as "future spec territory," doesn't prescribe file formats or merge semantics. The resolution order is clear and follows established cascade patterns. The "MCP advisory layer, not component runtime" boundary is the right call. Ready for ballot measure.

### Responses to Consultation Questions

**Q1 — Blocking error on invalid values**: Agree with blocking errors for values that don't exist in the token/prop system. `padding: "500"` when the component doesn't accept it is a configuration error, not a preference. Surface at index time (when MCP loads configuration), not query time.

One edge case where a warning is better: product configuration references a component that gets renamed or removed in a future DesignerPunk version. That's deprecation, not error. Warning ("Component 'Button-CTA' not found — configuration entry ignored") is more appropriate than blocking the MCP from starting. Implementation detail — doesn't need to be in the strategy doc, noting for the future spec.

**Q2 — Conflict resolution**: Take a position now. The resolution order already implies the answer: later layers override earlier layers (specificity wins, same as CSS cascade). The strategy doc should state this explicitly — one sentence: "When multiple layers provide a value for the same property, the more contextual layer wins." Prevents the future spec from re-deriving the principle.

**Q3 — Structural concerns**: Two minor refinements, neither blocking:

1. **Theme independence** — The claim "if a product needs different prop defaults per theme, that's a signal the prop should be a token" is probably right in most cases. But consider: a product wants `Button-CTA.variant: "primary"` in their standard theme and `variant: "high-contrast"` in their accessibility theme. `variant` is a prop, not a token. Suggest softening to "generally theme-independent" with a note that theme-conditional configuration is a future consideration. Lina endorsed the principle as-is — this is a genuine disagreement between us. I think the absolute rule will hit an exception; she thinks the rule is clean. Peter's call.

2. **Adoption requirement paragraph** — "Must ship with a setup guide, a starter template, and a clear connection mechanism" reads like a requirement in a strategy doc. Suggest reframing as a principle ("prioritize seamless onboarding") and leaving specific deliverables in the open questions where they already appear.

### No Blocking Concerns

Draft is ready for ballot measure with or without the refinements above.
