# Task 3.2 Completion: Chip-Base Missing Interaction Contracts

**Date**: 2026-03-01
**Spec**: 066 - Schema Completion and Contract Audit Resolution
**Lead**: Lina
**Review**: Thurgood
**Validation**: Tier 2 - Standard

---

## What Changed

Added 3 interaction contracts to Chip-Base's contracts.yaml:

1. **interaction_hover** — pointer-only hover with blend.hoverDarker (8% darker background) + primary border. Web only. WCAG 1.4.13.
2. **interaction_pressed** — blend.pressedDarker (12% darker) across all platforms. iOS/Android use pressedBlend() utility.
3. **interaction_focus_ring** — 2px outline with accessibility tokens, :focus-visible for keyboard-only, 4px in high contrast mode. WCAG 2.4.7.

All three behaviors already existed in platform implementations. The contracts formalize what was already built.

## Investigation Result

All three behaviors exist in platform code:
- **Hover**: CSS `:hover` with blend utility calculated `--_chip-hover-bg` (web only)
- **Pressed**: CSS `:active` + iOS `pressedBlend()` + Android `pressedBlend()` (all platforms)
- **Focus ring**: CSS `:focus-visible` with accessibility tokens, high contrast 4px fallback (all platforms)

No implementation gaps found — this was a contract documentation gap, not a behavior gap.

## Relationship to Existing Contracts

The existing `state_styling` contract already documented hover/pressed as visual states. The new contracts provide granular WCAG-mapped interaction coverage consistent with Button-CTA's contract pattern. Both can coexist — `state_styling` describes the visual system, the interaction contracts describe the individual behaviors.

## Validation

- Main tests: 7436/7437 passed (1 pre-existing)

## Thurgood Review Notes

**Review date**: 2026-03-01
**Verdict**: PASS

**Pre-existing test failure identified**: `InputRadioSet.stemma.test.ts:490` — validator flags `MISSING_ACCESSIBILITY_LABEL` as critical, test expects it not to be. Unrelated to 3.2. Lina to investigate — may overlap with Task 2.8 (Input-Radio-Set schema).
