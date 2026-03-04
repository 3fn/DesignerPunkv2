# Task 2.1 Completion: Author `button.yaml`

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task Type**: Implementation (Subtask)
**Tier**: 2 (Standard)
**Agent**: Lina

---

## Artifacts Created

- `family-guidance/button.yaml` — companion YAML for Button family
- Updated `family-guidance/README.md` — added "Signals, Not Absolutes" convention
- Updated `.kiro/steering/Component-Family-Button.md` — added cross-reference to companion YAML

## Interview Summary (8 questions)

1. **Variant selection rules** — 4 rules (primary/secondary/tertiary/multiple-actions). Dropped destructive action — future semantic variant, not a current prop.
2. **Family member selection** — 3 rules distinguishing Button-CTA (promoted action), Button-Icon (compact/icon-only), Button-VerticalList-Set (evenly weighted choices). Key insight from Peter: CTAs are for clearly promoted choices (ideally one primary per view); VerticalList is for evenly prioritized choices.
3. **whenToUse/whenNotToUse** — Tightened from broad "triggering actions" to differentiating signals. Peter flagged that broad entries create conflicts with future components.
4. **Accessibility notes** — 3 actionable guardrails for agents composing layouts, not restatements of WCAG contracts.
5. **Patterns (D4 boundary test)** — Form Actions and Dialog Actions both classified as family-scoped. Form Actions cross-references `simple-form` and `account-onboarding` experience patterns. Dialog Actions has no experience pattern yet.
6. **Size selection** — Dropped. Size is a UI context/judgment call, not rule-based guidance.
7. **VerticalList-Set mode selection** — 3 rules (select/multiSelect/tap). Clear semantic intent per mode, similar to variant selection.
8. **Cross-reference** — Bidirectional: companion YAML references family doc, family doc references companion YAML with read-both protocol note.

## Schema Findings

- **`whenToUse`/`whenNotToUse` convention**: These are signals, not absolutes. Added "Signals, Not Absolutes" section to README. If convention proves insufficient, revisit with field renaming (`strongCandidateWhen`/`weakCandidateWhen`).
- **No schema structural changes needed** — Button's flat rules (no `group` field) validated the base schema shape as designed.
- **No `notes` field needed** — confirmed `rationale` alone is sufficient per review feedback.

## Component Gaps Identified

- **Neutral/de-emphasized filled variant**: Button-CTA needs a variant for multiple visible actions where none is clearly promoted. Peter's direction: alternative CTA set using a semantic "primary-alt" color token (possibly referencing gray400). Captured in `whenNotToUse`. Requires Ada consultation for token side.

## Pending

- Ada review for D9 compliance (token references in rationale text)
