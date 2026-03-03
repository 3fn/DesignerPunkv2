# Pattern A Interview: Simple Single-Step Form

**Date**: 2026-03-01
**Interviewer**: Lina (Stemma Component Specialist)
**Interviewee**: Peter
**Consultants**: Ada (token implications), Thurgood (validation/contract coverage)
**Purpose**: Author the first experience pattern through structured interview. Co-evolve the schema with real design judgment.

---

## Interview Log

### Q1: What's the minimum viable assembly for a "simple form"?

**Lina's question**: When you think of a "simple form" in DesignerPunk, what's the minimum viable assembly? What must be present for it to be a form and not just a collection of inputs?

**Peter's answer**:
- Requires an accessible label — doesn't have to be visible, but must be understood by screen readers
- Minimum one input field
- A submit action using Button-CTA or other semantically defined submit button component
- Should be captured within a Container component
- Fields default to vertical layout, but related compact fields (e.g., State + Zipcode) can align inline (block-start to block-end default, inline-start to inline-end for related compact pairs) — logical properties framing
- Consistent, fairly tight vertical (block) spacing between related fields
- Horizontal (inline) spacing at least double the vertical spacing when fields are side-by-side

**Schema observations**:
1. **Layout is richer than a keyword.** The `layout` field is currently a single string (`vertical-stack`). Peter's answer describes spacing relationships (tight block spacing, wider inline spacing) and conditional layout (vertical default, horizontal for related compact fields). May need `layoutGuidance` object or richer step-level hints.
2. **Nesting within a step.** Peter expects a Container component wrapping the form fields. The schema's `components` list is flat — no parent-child nesting within a step. Potential gap: should the pattern express that inputs go *inside* the container, or is `role: container` + hints sufficient?
3. **Accessible label is not a component.** The form label is an accessibility requirement on the container, not a separate component in the catalog. This belongs in `accessibility` notes or as a hint on the container component, not as a `PatternComponent` entry.

### Q2: Is the accessible label a component or a prop?

**Lina's question**: Is the form's accessible label a DesignerPunk component (like a heading) or a prop/attribute on the container?

**Peter's answer**:
- The "accessible label" is a property within the HTML `<form>` tag — not a separate component
- An optional visible label using Lg Label type style could be included, but it's not required
- All fields should be implicitly understood as required — only mark what's *optional*

**Schema observation**:
4. **Required/optional inversion.** Current schema uses `required: boolean`. Peter's convention: everything is required by default, only mark exceptions as optional. Rename `required` to `optional` (default `false`). Task 1.3 schema change.

### Q3: Which container component?

**Lina's question**: Container-Base or Container-Card-Base? Or is it a semantic concept?

**Peter's answer**:
- Container-Base or an appropriate semantic variant
- Products may want different visual treatments (no fill, fill + border, no styling) — Container provides that flexibility

**Lina's research (Component-Family-Container.md)**:
- Container-Base supports `semantic: 'fieldset'` — the HTML element for grouping form controls
- Container-Base has `accessibilityLabel` prop — provides the form's accessible name
- This means the pattern should use Container-Base with `semantic: fieldset` and `accessibilityLabel` hints

### Q4: Is Button-CTA the only submit action component?

**Lina's question**: Is Button-CTA the only component that serves as a form submit action, or could Button-Icon or another variant be the submit?

**Peter's answer**:
- Button-Icon could serve as a submit action in dense layouts or when submission isn't the primary focus
- This raises the question of whether a semantic Button-Submit component is warranted — a wrapper that could use Button-CTA or Button-Icon internally
- A semantic submit button could also have its own visual style (e.g., icon button in a rounded square instead of circle)

**Lina's assessment**:
- A semantic Button-Submit is an interesting idea but is a component-layer concern, not a pattern-layer concern
- For Pattern A, use Button-CTA with `role: submit-action` and hints about submit semantics
- Note the semantic submit component idea as a future consideration — separate spec territory
- Peter's response suggests the pattern should express the *role* (submit action) rather than mandate a specific component

**Schema observation**:
5. **Role-based component flexibility.** Peter's answer about submit buttons suggests some pattern slots should express a role requirement ("needs a submit action") rather than a specific component. The current schema ties each entry to a specific `component` name. May need a way to express "one of these components" or "any component with this capability." Flagging for further discussion — may be over-engineering for Tier 1.

### Q5: How many example fields for a simple form?

**Lina's question**: What's the minimum set of field types to include? How many example fields feel right?

**Peter's answer**:
- Could be any single input — simplest idea is an email collection form ("Provide your email to subscribe to our mailing list") or a toggle ("Activate to turn on Accessibility mode")
- Concern about examples drifting from current implementation — DesignerPunk has avoided code examples for this reason
- Pattern hints are guidance, not rendered code, so drift risk is lower but not zero

**Lina's assessment**:
- Pattern A: Container-Base (fieldset), Input-Text-Email, Button-CTA. Three components. Minimal real form.
- PatternIndexer validates component names against catalog at index time — catches renames/removals
- Hint values are harder to validate automatically — manual review concern, acceptable at 3 pattern files

### Q6: Is the form standalone or embedded?

**Lina's question**: Is the email subscription form a standalone page experience or always embedded within a larger page?

**Peter's answer**:
- Depends on the experience being crafted — could be standalone, a primary section, or ancillary
- Greatly depends on the prompt
- A good thing for the agent to prompt a human about if uncertain about the form's priority

**Lina's assessment**:
- Page-level context is product-specific and prompt-dependent — not a system-level pattern concern
- Pattern describes the form assembly. Placement is determined by the agent based on the prompt or by asking the human.
- Page layout deferred to Pattern C (non-form layout) where it's the explicit focus

**Schema observation**:
6. **Placement guidance.** The pattern might benefit from a top-level field noting that the agent should clarify placement with the human. Not prescriptive — advisory. Flagging for Pattern C to see if the same need surfaces.

### Q7: Assembly-level accessibility beyond individual components?

**Lina's question**: What assembly-level accessibility requirements apply to a simple form beyond what individual components enforce?

**Peter's answer**:
- Error and validation behaviors are important
- Most error handling is field-by-field (already handled by component contracts)
- There should be a generalized error communicated by the fieldset that the form has an error
- Success/validation feedback: some experiences communicate in-form, some on a subsequent page, some via notification or other method

**Lina's assessment — accessibility list for Pattern A**:
1. Form element (fieldset) must have an accessible name
2. Focus order follows visual order (block-start to block-end)
3. Form must have a submit action
4. Field-level errors handled by individual components (existing contracts)
5. Form-level error summary must be communicated to assistive technology (e.g., `aria-live` region or alert role)
6. Success/completion feedback required — method varies by experience (in-form message, page redirect, notification)

**Schema observation**:
7. **Structural vs. behavioral accessibility notes.** Items 1-3 are structurally checkable by `AccessibilityChecker` (tree shape). Items 5-6 are behavioral guidance (runtime behavior, not tree shape). The `accessibility` array captures both — some are machine-checkable, some are advisory. The `AccessibilityChecker` should only enforce what it can verify structurally.

### Q8: Loading states during form submission?

**Lina's question**: Should the pattern hint that the submit button shows a loading state during submission? Button-CTA has a loading state (the legitimate disabled use case preserved in 066).

**Peter's answer**:
- Prefers to avoid loading states — exposure of loading makes humans *feel* the experience is slow, even if equally fast
- Two conditions for loading:
  1. Known slow operation (e.g., communication with a slow 3rd-party service)
  2. Experience taking longer than expected — trigger loading display after ~5 seconds as a "we're working on it" signal

**Additional note from Peter on form validation**:
- Some forms intentionally provide no validation feedback — neutral responses for security/UX reasons
- Example: password reset flow responds "If your information matches our records, we will communicate to that channel directly" — form passes data through without judging validity

**Lina's assessment**:
- Loading state guidance captured as a hint on the submit button: don't default to loading
- Validation feedback note softened: feedback is recommended, not required. Neutral responses are a valid design choice.

---

## Schema Changes Identified (Task 1.3)

1. **Add `children` to `PatternComponent`** — nesting support for container → field relationships
2. **Rename `required` to `optional`** (default `false`) — everything required by default, only mark exceptions
3. **`layout` field enrichment** — deferred. `vertical-stack` sufficient for Pattern A. Horizontal alignment (address/payment fields) may need richer layout guidance in future patterns.
4. **Placement guidance field** — deferred. Flagged for Pattern C to see if the same need surfaces.
5. **Role-based component flexibility** — flagged. Some slots may need to express "any component with this capability" rather than a specific component name. Deferred — may be over-engineering for Tier 1.

---

## Pattern A Output

Authored at `experience-patterns/simple-form.yaml`.

Components:
- Container-Base (form-container, semantic fieldset)
  - Input-Text-Email (form-field)
  - Button-CTA (submit-action)

Key design decisions captured:
- No loading state by default on submit
- Neutral form validation is a valid approach
- Page-level placement is prompt-dependent, not pattern-prescribed
- Visible form label optional; accessible name on fieldset required

---

## Consultation Questions for Ada (Token Implications)

1. **Form container padding**: Pattern hints `padding: "200"` (maps to `space.inset.200` / 16px). Is that the right default, or should the pattern be agnostic about the specific padding value?
2. **Color tokens**: Pattern doesn't reference any color tokens for the container background. Should it hint at a background color (e.g., `color.surface`), or is that product-specific?
3. **Loading threshold timing**: Peter's ~5 second loading delay — does that align with any motion/timing tokens, or is it purely behavioral guidance?

---

## Consultation Questions for Thurgood (Contract Coverage / Validation)

1. **AccessibilityChecker scope**: Three structurally checkable rules identified — fieldset has accessible name, form has submit action, focus order follows visual order. Sufficient for initial `AccessibilityChecker` scope, or are there contract-level checks to add?
2. **Nesting and composition validation**: Pattern uses `children` nesting (Container-Base → Input-Text-Email, Container-Base → Button-CTA). Any composition validation concerns? The `AssemblyValidator` will need to validate these as valid parent-child pairs.
3. **Neutral validation and contracts**: The neutral validation pattern (no feedback, pass-through) — does this conflict with Input-Text-Email's `error_state` contract? Or is `error_state` only triggered when the component is explicitly configured for validation?


---

## Ada's Consultation Responses (2026-03-02)

### Q1: Form container padding — `padding: "200"`

Recommend making the hint guidance-oriented rather than a specific value:

```yaml
padding: "Use space.inset tokens. 200 (16px) is a reasonable default for standalone forms. Compact embedded forms may use 100 or 150."
```

This follows D9 (token governance convention) — uses token names, gives a default, acknowledges context matters.

Counter-argument: a specific value (`"200"`) is more actionable for a mediocre agent. The teaching philosophy says opinions should be strong enough for acceptable results. Peter's call — he agreed with the guidance approach.

**Decision**: Peter approved guidance-oriented hint language.

### Q2: Color tokens for container background

The pattern should not hint at a background color. Container-Base's background is product-specific — a form on a white page needs none, a form in a card needs `color.surface.elevated`, a form in a dark section needs `color.surface.inverse`. Omitting the hint is correct. The component's own defaults and the product's theme handle this.

**Decision**: Peter agreed. No background color hint.

### Q3: Loading threshold timing (~5 seconds)

Purely behavioral guidance. No motion or timing token applies. The motion token system covers UI transition durations (150ms–350ms), not application-level loading thresholds. The hint as written is correct — behavioral guidance, not a token reference. No token governance concern.

### Additional observations

- **`children` nesting**: Clean. Maps directly to existing composition model. No token implications.
- **`optional` rename**: Good call. Matches Peter's design philosophy (mark exceptions, not the common case).
- **Forward reference in `alternatives`**: Pattern references `multi-step-flow` which doesn't exist yet (Pattern B). PatternIndexer should handle forward references gracefully — validate at query time, not index time. Not a token concern, flagging for Lina.

---

## Product Configuration Layer — Ada's Analysis (2026-03-02)

**Origin**: Peter's Q2 follow-up — "How do products integrated with DesignerPunk set those defaults?"

### The gap

Products adopting DesignerPunk need to express three kinds of preferences:

1. **Token values** — "Our primary color is X." **Solved** by Rosetta theming pipeline.
2. **Component defaults** — "Our containers default to `padding: 200`." **No mechanism exists.**
3. **Assembly preferences** — "Our forms use elevated containers." **Solved** by project-level patterns (`extends`).

Layer 2 is the gap. Most products don't need custom patterns — they want to tune component defaults.

### Proposed resolution order

```
Component built-in → Product component-defaults → Product role-defaults → Pattern hints → Agent decision
```

Each layer overrides the previous. The agent always has final say.

### What a product configuration layer could look like

```yaml
# product-config.yaml
product: fintech-app
theme: fintech-dark

component-defaults:
  Container-Base:
    padding: "200"
    borderRadius: "100"
  Button-CTA:
    variant: primary

role-defaults:
  form-container:
    semantic: fieldset
    padding: "200"
  submit-action:
    variant: primary
```

Two levels:
- **Component defaults** — apply whenever this component is used, regardless of context
- **Role defaults** — apply when a component fills a specific role in a pattern

### MCP integration points

- `get_component_full` returns metadata with product defaults merged into property definitions
- `get_experience_pattern` returns hints with product role-defaults merged
- Indexer scans `product-config.yaml` alongside schemas and patterns — same indexing model, new data source

### Impact on 067

067 doesn't need to implement this, but shouldn't close doors. Current assessment:
- Pattern hints as overridable guidance ✅ (already the case)
- `role` field on pattern components ✅ (the hook for role-defaults)
- System/project separation via `source` field ✅ (prevents product opinions in system patterns)
- `ApplicationSummary` response shape — **worth noting for Lina**: design it so merged defaults can be accommodated later without breaking the response contract

### Counter-argument

Writing strategy without a concrete product need risks designing in a vacuum. The safer move is to wait until a product adopts DesignerPunk and hits the limitation. The resolution order (built-in → product → role → pattern → agent) follows well-understood patterns (CSS cascade, theme systems), so the risk of premature design is low — but it's not zero.

### Recommendation

Document as a strategy section in the agentic UI strategy doc. Not a spec — a page of thinking that informs current decisions. Cheap to write, prevents future specs from accidentally closing doors.

**Status**: Pending consultation with Lina and Thurgood before strategy doc proposal.


## Thurgood's Consultation Responses (2026-03-02)

### Q1: AccessibilityChecker scope — 3 structural checks sufficient?

Two of the three are structurally checkable. The third is not.

1. **Fieldset has accessible name** → Checkable. Container-Base with `semantic: fieldset` must have `accessibilityLabel`. Tree inspection.
2. **Form has submit action** → Checkable. Tree must contain a component with `role: submit-action`.
3. **Focus order follows visual order** → Not structurally checkable. Focus order is a rendering concern. The `AssemblyValidator` sees `children` array order but can't verify rendered output matches. Stays as advisory guidance in the `accessibility` array — not a machine-enforced check.

Two structural checks from Pattern A is a reasonable starting point. Patterns C and B will likely surface more. Don't force checks that aren't structurally verifiable.

**Counter-argument**: Focus order could be approximated by verifying `children` array order matches a "logical" order (form fields before submit). But "logical order" is context-dependent — the checker would be encoding layout opinions, not accessibility rules. Keep the checker honest about what it can verify.

### Q2: Nesting and composition validation

Clean. Container-Base has no `prohibited` constraints blocking Input-Text-Email or Button-CTA. `AssemblyValidator` calls `checkComposition` per edge — existing logic handles this.

**Flag for Task 1.3**: The `children` field on `PatternComponent` was added during the interview (schema observation #1). The design.md `PatternComponent` interface doesn't have it yet — needs `children?: PatternComponent[]`. Recursive type, same structure as `AssemblyNode`. Lina will catch this during 1.3, but flagging explicitly.

**Flag for Task 1.4 (my schema review gate)**: The `children` nesting creates a recursive structure that mirrors `AssemblyNode`. I'll verify that the pattern's component tree and the `AssemblyNode` input structure are aligned — an agent should be able to derive an `AssemblyNode` from a pattern's component tree without transformation gymnastics. If they diverge, that's a usability problem.

### Q3: Neutral validation and error_state contracts

No conflict. Input-Text-Email's `error_state` contract describes what happens *when the component is configured to show an error* — it doesn't mandate that errors must be shown. A form that never activates error state simply never triggers the contract. The neutral validation pattern is a design choice about *when* to activate the contract, not a violation of it.

Good example of the distinction between component contracts (what a component CAN do) and pattern guidance (what a component SHOULD do in context).

### Additional observations

**Schema observation #5 (role-based component flexibility)**: Peter's answer about Button-Icon as an alternative submit action reveals that some pattern slots are role slots, not component slots. For Tier 1, the `alternatives` field handles this. If it surfaces again in Patterns C or B, may need a schema-level solution. I'll track across interviews and revisit at the schema review gate.

**Ada's forward reference note**: Good catch. `simple-form.yaml` references `multi-step-flow` in `alternatives` — doesn't exist yet. PatternIndexer should validate component references at index time (they're in the catalog) but treat pattern cross-references as advisory. Lina should handle in Task 1.5.

**Padding hint format**: The bare value `padding: "200"` is more actionable for a mediocre agent than Ada's guidance-oriented paragraph. A strong default produces acceptable results (teaching philosophy). Ada's concern about contextual deviation is legitimate, but I'd solve it at the schema level (README guidance on "how to interpret hints") rather than embedding teaching in every hint value. My governance concern: whatever format is chosen, it must be consistent across all 3 patterns. Inconsistency between patterns is what I'd flag at the review gate.

### No blocking concerns

The interview surfaced real schema gaps (children nesting, required→optional), the accessibility checks are correctly scoped (2 structural, rest advisory), and the deferred items are appropriately deferred. Nothing blocks proceeding to Task 1.3.

### Position on Ada's Product Configuration Layer Proposal

Support the draft. The resolution order (component built-in → product defaults → role defaults → pattern hints → agent decision) follows well-understood cascade patterns. Documenting it now is cheap — a page of thinking, not a spec. The risk of *not* documenting it is that 067 or a follow-up spec accidentally closes a door. The `role` field and `source`/`extends` fields are already the hooks — if we don't articulate how they compose, implementation choices will implicitly answer the question without the full picture.

Agree with Ada's own counter-argument (designing without a concrete product need risks vacuum design), but it doesn't change the position. She's proposing a strategy page, not implementation. Cost asymmetry favors writing it.

**One concern: scope creep.** The draft should stay conceptual — resolution order, integration points, open questions. If it starts specifying `product-config.yaml` field names, indexer scan paths, or merge semantics, it's drifting into spec territory without spec rigor. Anything implementation-specific should be explicitly marked "future spec territory."

Position: draft it, all four weigh in, keep it conceptual.

---

## Lina's Response to Consultation Feedback (2026-03-02)

### On Ada's responses

- **Padding hint format**: Updated `simple-form.yaml` to use guidance-oriented language per Peter's approval. Will ensure all 3 patterns follow the same convention.
- **No background color**: Agreed. Omitting is correct.
- **Loading threshold**: Confirmed behavioral, no token concern.
- **Forward references**: Will handle in Task 1.5 — PatternIndexer validates component names against catalog at index time, treats pattern-to-pattern cross-references as advisory (no error if referenced pattern doesn't exist yet).
- **Product configuration layer**: Good forward-looking analysis. Key takeaway for Task 2.1: design `ApplicationSummary` so merged defaults can be accommodated later without breaking the response contract. Agree with documenting as strategy, not implementing in 067.

### On Thurgood's responses

- **Focus order not structurally checkable**: Agreed — I was wrong to include it as a structural check. Two checks from Pattern A: fieldset has accessible name, form has submit action. Focus order stays as advisory in the `accessibility` array.
- **`children` / `AssemblyNode` alignment**: Will ensure the structures are parallel in Task 1.3 so an agent can derive an `AssemblyNode` from a pattern's component tree without transformation.
- **Neutral validation / error_state**: Clear — capability vs. obligation. No conflict.
- **Padding hint consistency**: Thurgood's governance point is the real concern. Will ensure consistent hint format convention across all 3 patterns regardless of which format is chosen.
- **Role-based flexibility tracking**: Noted. Will watch for this in Patterns C and B.

### Updated schema change list for Task 1.3

1. Add `children?: PatternComponent[]` to `PatternComponent` — recursive nesting
2. Rename `required` to `optional` (default `false`)
3. Update design.md `PatternComponent` interface to match
4. Ensure `PatternComponent` tree structure aligns with `AssemblyNode` (Thurgood's flag)
5. Update README schema reference
