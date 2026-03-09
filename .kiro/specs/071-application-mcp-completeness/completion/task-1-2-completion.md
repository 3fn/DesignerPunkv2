# Task 1.2 Completion: Author chips.yaml with Enriched Schema

**Date**: 2026-03-09
**Spec**: 071 — Application MCP Completeness
**Task**: 1.2 — Author chips.yaml with enriched schema
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Authored `family-guidance/chips.yaml` as the reference family guidance file with all enriched schema additions (discouragedPatterns, composesWithFamilies). No platformVariants — Chips have no platform divergence.

---

## Artifact

`family-guidance/chips.yaml`

---

## Schema Coverage

| Field | Count | Notes |
|-------|-------|-------|
| whenToUse | 3 | Filter, Input, general compact interactive |
| whenNotToUse | 5 | Badges, Buttons, Navigation, Form Inputs, single-select gap |
| selectionRules | 4 | Filter, Input, Input-in-forms, Base |
| discouragedPatterns | 4 | Form controls, single-select, interactive badges, orphaned Input |
| composesWithFamilies | 3 | Form Inputs, Buttons, Badges |
| accessibilityNotes | 5 | Tap area, aria-pressed, X icon label, no disabled, keyboard |
| patterns | 2 | Filter Bar, Tag Input |
| platformVariants | 0 | N/A — no platform divergence |

---

## Interview Inputs (from Peter)

- Chips should not be used as a replacement for interactive badges
- Chip-Base and Chip-Filter should not be used in forms
- Chip-Input can be used in forms for multi-select interactions of dynamic user-created values (tags, skills, recipients)
- For fixed option sets, use Input-Checkbox-Base instead

---

## Validation

- YAML parse: clean (python3 yaml.safe_load)
- Build: 291 suites, 7448 tests, 0 failures
- FamilyGuidanceIndexer: 4 families indexed (Buttons, Chips, Containers, Form Inputs), 0 warnings
- `getGuidance('Chips')`: returns guidance with 1 selectionRules group, 2 patterns

---

## Pending

- D9 compliance validation (Task 1.3 — Ada's domain)
- Schema review gate (Task 1.4 — Peter approval)
