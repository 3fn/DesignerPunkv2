# Pattern C Interview: Non-Form Layout

**Date**: 2026-03-02
**Interviewer**: Lina (Stemma Component Specialist)
**Interviewee**: Peter
**Consultants**: Ada (token implications), Thurgood (validation/contract coverage)
**Purpose**: Validate schema handles non-form composition — container components, required children, list-based layout.

---

## Interview Log

### Q1: Structural anatomy of a settings screen?

**Peter's answer**:
- Grouped sections with different types of controls — action lists, toggles, radio selections
- Vertical list buttons that navigate deeper into focused setting spaces
- Potentially expand-collapse UI for cognitive manageability (component gap — not in catalog)

### Q2–Q3: Section headings and list mode (answered via reference images)

Peter provided two reference screenshots (iOS settings screens) showing:
- Grouped sections with visible uppercase section headings
- Items primarily navigation-style (label + chevron → navigate deeper) or toggle-style (label + switch)
- Some items show current value inline (e.g., "Audio Language: English")
- Items can have leading icons or not
- Notification badges on some items

### Q4: Container-Base or Container-Card-Base for sections?

**Peter's answer**: Container-Base as default unless explicitly mentioning a Card. Products can modify to use Container-Card-Base or another semantic Container easily.

### Q5: Inline value display on list items?

**Peter's answer**: Surfaces the need for another component or VerticalList-Item variant. Component gap identified.

### Q6: Toggle/switch component?

**Peter's answer**: Component we don't have yet. Switches should be on the component development agenda. Component gap identified.

### Q7: How many sections?

**Peter's answer**: Three sounds good.

### Q8: Assembly-level accessibility?

**Peter's answer**:
- Section headings associated with their sections
- Page needs a heading or accessible name
- Screen readers should announce sections and allow users to opt-in to dive deeper, rather than listing every item — landmark-based navigation for efficient scanning

### Q9: Single-item sections?

**Peter's answer**:
- Doesn't happen often but does happen
- Prefer grouping with an existing related section (updating section label if needed)
- If no natural grouping exists, create its own section
- Decision depends on whether more items are expected in the near-term

**Schema observation**: Button-VerticalList-Set has `minCount: 2`. A single navigation item can't go in a Set. Single-item sections use standalone controls (toggle, button) rather than a lone VerticalList-Item.

---

## Schema Observations

1. **Multi-level nesting works.** Page → section → list → item is 4 levels deep. The recursive `children` field handles this cleanly.
2. **No new schema gaps from Pattern C.** The `children`, `optional`, `hints`, and `role` fields handle all the structural needs. The schema changes from Pattern A were sufficient.
3. **Component gaps are captured in hints.** The `componentGap` hint convention emerged naturally — noting that a component is a placeholder for a future component. Not a schema field, just a hint key convention.
4. **Section headings are content, not components.** Captured as hints on the section container. The schema doesn't need a dedicated heading component entry.

---

## Component Gaps Identified

1. **Toggle/switch component** — dedicated on/off switch control for settings. Input-Checkbox-Base used as placeholder.
2. **Detail-value VerticalList-Item variant** — list item showing current value inline (e.g., "English", "Card"). Common in settings navigation.
3. **Expand-collapse/accordion component** — for managing cognitive load in dense settings screens.

---

## Pattern C Output

Authored at `experience-patterns/settings-screen.yaml`.

Structure: page container → 3 sections (navigation list, toggle, mixed), each with landmark semantics.

Schema stress points exercised:
- Multi-level nesting (4 levels)
- `children.requires` constraint (VerticalList-Set → VerticalList-Item)
- `minCount` constraint (VerticalList-Set ≥ 2)
- Multiple sections with different component compositions
- Component gap documentation via hints

---

## Consultation Questions for Ada (Token Implications)

1. **Section spacing**: Pattern doesn't hint at spacing between sections. Should it reference a spacing token for vertical rhythm between section groups?
2. **Section heading style**: Peter mentioned section headings as visible text. Should the pattern hint at a type style token, or is that product-specific?

## Consultation Questions for Thurgood (Contract Coverage / Validation)

1. **Multi-level nesting validation**: `validate_assembly` will need to walk 4 levels deep for this pattern. Any concerns about the depth-first tree walk at this depth?
2. **`minCount` enforcement**: The pattern includes exactly 3 VerticalList-Items in the first section and 2 in the third. Should `validate_assembly` check `minCount` constraints from the component schema? This is listed in Requirement 5.5 but worth confirming the check applies to pattern-derived assemblies.
3. **Landmark accessibility check**: "Each section must be a landmark" — is this structurally checkable? The checker could verify Container-Base components with `role: settings-section` have `semantic: section` in their hints. Or is that too coupled to hint values?


---

## Ada's Consultation Responses (2026-03-02)

### Q1: Section spacing

The pattern should hint at section spacing. The right token is `space.layout.separated.normal` (maps to `space300` / 24px). Settings sections are independent content groups — "separated" in the semantic spacing hierarchy, not "related" (same logical flow) or "sectioned" (major page divisions).

Recommended hint on the page container:

```yaml
sectionSpacing: "Use space.layout.separated.normal between section groups. Sections are independent content groups — 'separated' in the spacing hierarchy, not 'related'."
```

Follows D9 convention — token name, semantic rationale, guidance language.

Counter-argument: section spacing may be product-specific (dense mobile vs. spacious desktop). But the pattern's job is a reasonable default with rationale — the agent or product configuration layer adjusts from there.

### Q2: Section heading style

Don't hint at a type style token. Section heading visual treatment varies significantly by platform and product (iOS uppercase small text, Android colored body text, web varies). The pattern captures that headings exist and need accessible names. Visual treatment is a product decision. Same reasoning as the container background color decision in Pattern A — structure and semantics, not visual treatment.

### Additional observations

- **`componentGap` hint convention**: Clean solution. Self-documenting, doesn't pollute the schema, gives agents enough for reasonable substitution.
- **Multi-level nesting**: 4 levels deep validates the recursive `children` field. No schema changes needed beyond Pattern A additions.
- **`minCount` constraint**: Correctly respected. The accessibility note about single-item sections is good teaching — explains *why*, not just the rule.
- **Checkbox-as-toggle placeholder**: Semantically imprecise (checkbox = binary choice with submit, toggle = immediate on/off). The `componentGap` hint makes this clear. When the switch component is built, this pattern should be updated — worth noting in the component gaps tracking so the pattern update isn't forgotten.

### No open questions from Ada.

## Thurgood's Consultation Responses (2026-03-02)

### Q1: Multi-level nesting validation at 4 levels deep

No concerns. Depth-first tree walk handles this trivially — depth is just recursion depth. Path strings get longer (`root.children[0].children[0].children[2]`) but remain readable and unambiguous. 4 levels is the deepest we've seen and it's fine.

### Q2: `minCount` enforcement on pattern-derived assemblies

Yes — `validate_assembly` should check `minCount`. Requirement 5.5 is explicit. Applies regardless of whether the assembly was hand-built or pattern-derived. An agent modifying pattern output could violate the constraint; the validator catches that.

The pattern correctly respects the constraint (3 items in section 1, 2 in section 3 — both ≥ 2). Section 2 uses standalone Input-Checkbox-Base, not a VerticalList-Set, so `minCount` doesn't apply — consistent with Peter's guidance about single-item sections using standalone controls.

### Q3: Landmark accessibility check — structurally checkable?

Partially, but I recommend against it for now.

The checker could verify Container-Base components with `role: settings-section` exist — that's structural. But verifying they have `semantic: section` in hints couples the checker to hint values, which are guidance, not configuration. The checker would be asserting "this hint should be present" rather than "this tree structure is valid."

Middle ground exists: check that any Container-Base has `semantic` set to a landmark value (`section`, `main`, `nav`, `form`). But this feels like reaching — the component's own accessibility contracts should handle semantic prop validation.

Recommendation: leave as advisory in the `accessibility` array. Revisit if Pattern B surfaces a stronger case for hint-value checking.

### New accessibility check candidates from Pattern C

1. **"Page must have a heading or accessible name"** (WCAG 2.4.2) — structurally checkable. Root container has `accessibilityLabel` or a heading component. Good candidate for `AccessibilityChecker`.
2. **"Toggle controls must announce current state"** (WCAG 4.1.2) — component-level contract, not assembly-level. Already handled by Input-Checkbox-Base's accessibility contracts. Not an `AccessibilityChecker` concern.

Running total: 3 structural check candidates across Patterns A and C:
- Fieldset/form container has accessible name (Pattern A)
- Form has submit action (Pattern A)
- Page has heading or accessible name (Pattern C)

### Broader observations

- **Schema held up.** No new fields needed. `children` nesting handles 4 levels cleanly. Schema changes from Pattern A were sufficient.
- **`componentGap` hint convention** is a smart emergent pattern. Documenting catalog gaps without schema changes. Correctly kept as a hint key, not a schema field.
- **Component gaps** (toggle/switch, detail-value variant, expand-collapse) are catalog concerns, not pattern schema concerns. Worth tracking in a component backlog.
- **Pattern cross-references**: `settings-screen.yaml` references `simple-form` in alternatives — exists. No forward-reference issue.
- Agree with Ada on checkbox-as-toggle semantic imprecision. When the switch component is built, this pattern needs updating. The `componentGap` hint makes the intent clear for now.

### No blocking concerns

---

## Lina's Response to Consultation Feedback (2026-03-02)

### On Ada's responses

- **Section spacing**: Updated `settings-screen.yaml` with `sectionSpacing` hint referencing `space.stack.300`. Good default with rationale.
- **Section heading style**: Agreed — omit. Product-specific.
- **Checkbox-as-toggle tracking**: Noted. When switch component is built, this pattern needs updating. Will track alongside the component gap.

### On Thurgood's responses

- **`minCount` enforcement**: Confirmed for `validate_assembly`. Will implement in Task 3.1.
- **Landmark checking**: Agreed — leave as advisory. Don't couple checker to hint values.
- **New structural check**: "Page has heading or accessible name" (WCAG 2.4.2) added to running total. 3 candidates now across Patterns A and C.
- **Schema stability**: Confirmed — no changes needed from Pattern C. The Pattern A adjustments were sufficient.

### Hint format consistency (Thurgood's governance concern from Pattern A)

Both patterns now use the same guidance-oriented hint format: token name + value + rationale. Consistent across `simple-form.yaml` and `settings-screen.yaml`. Will maintain for Pattern B.
