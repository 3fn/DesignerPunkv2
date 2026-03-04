# Task 2.2 Completion: Author `form-inputs.yaml`

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task Type**: Implementation (Subtask)
**Tier**: 2 (Standard)
**Agent**: Lina

---

## Artifacts Created

- `family-guidance/form-inputs.yaml` — companion YAML for Form Inputs family
- Updated `.kiro/steering/Component-Family-Form-Inputs.md` — added cross-reference to companion YAML

## Interview Summary (8 questions)

1. **Grouped selection rules** — validated `group` field with three groups (Text Inputs, Checkboxes, Radio Buttons). 6 text input rules, 4 checkbox rules, 2 radio rules.
2. **Cross-group selection rules** — Peter's key insight: mandatory single-select → radio, optional single-select or multi-select → checkbox. Reasoning: radios cannot be deselected once selected, so optional selections require checkbox.
3. **whenToUse/whenNotToUse** — includes cross-reference to Button-VerticalList-Set and consistency guardrail about not mixing input families.
4. **Accessibility notes** — 5 guardrails including validation timing (blur for text, submit for others).
5. **Patterns (D4 boundary test)** — Radio Group and Parent-Child Checkbox are family-scoped. Login Form, Registration, Settings Panel are cross-family → experience patterns. Base + Set orchestration pattern recognized as a general architectural principle.
6. **Cross-reference** — bidirectional, same pattern as Button.
7. **URL input** — added as Input-Text-Base with `type: url` prop. Placeholder for future semantic variant.
8. **Form composition conventions** — Peter provided field ordering, required/optional indication, and validation timing guidance. See schema findings below.

## Schema Findings

- **`group` field validated** — three groups work as designed. Flat rules and grouped rules coexist in the same `selectionRules` array.
- **`compositionNotes` field candidate** — three pieces of guidance don't fit current schema:
  - Field stack ordering (name → address → payment before delivery)
  - Required/optional indication ("never show required, indicate optional in hint text")
  - Don't mix input families within a form
  - Base + Set orchestration principle ("always use Set when available")
  - **Decision: defer to Task 2.4 schema review gate.** If Container surfaces similar composition guidance, add `compositionNotes` as a schema change.

## Component Gaps Identified

- **Textarea** — multi-line text input not yet implemented
- **Search** — search interface component not yet implemented
- **Payment semantic inputs** — Input-Text-CreditCard, Input-Text-BankAccount, etc. not yet implemented
- **Input-Checkbox-Legal `showRequiredIndicator` default conflict** — defaults to `true`, but design convention says never show required, only indicate optional. Potential component update needed.

## Pending

- Ada review for D9 compliance
