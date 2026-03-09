# Task 1 Parent Completion: Chips Family Guidance (Reference Family)

**Date**: 2026-03-09
**Spec**: 071 — Application MCP Completeness
**Task**: 1 — Chips Family Guidance (Reference Family)
**Agent**: Lina (1.1, 1.2), Ada (1.3), Thurgood (1.4)
**Type**: Parent
**Validation Tier**: Tier 3 — Comprehensive

---

## Summary

Authored `family-guidance/chips.yaml` as the reference family guidance file for Spec 071. Validated enriched schema additions (discouragedPatterns, composesWithFamilies), passed D9 compliance, and received Peter's approval as the replication template for remaining families.

---

## Success Criteria Verification

| Criterion | Status |
|-----------|--------|
| Chips companion YAML authored with full enriched schema | ✅ |
| Schema additions validated (discouraged patterns, cross-family refs) | ✅ |
| D9 compliance passed | ✅ (Ada, Task 1.3) |
| Peter approves as reference for remaining families | ✅ |
| FamilyGuidanceIndexer indexes Chips family | ✅ (4 families, 0 warnings) |

---

## Artifact

`family-guidance/chips.yaml` — 3 whenToUse, 5 whenNotToUse, 4 selectionRules, 4 discouragedPatterns, 3 composesWithFamilies, 5 accessibilityNotes, 2 patterns. No platformVariants (no platform divergence).

---

## Schema Decisions Validated

1. **discouragedPatterns**: Useful. Single severity level (no `advisory`/`caution` gradient). Schema: `pattern` + `rationale` + `override`.
2. **composesWithFamilies**: Helpful. Advisory note from Thurgood: watch for "don't confuse with" entries that belong in `whenNotToUse` instead.
3. **platformVariants**: Not exercised by Chips. First real test will be Icons (Task 4).

---

## Subtask Summary

| Subtask | Agent | Status |
|---------|-------|--------|
| 1.1 Read steering doc + existing YAMLs | Lina | ✅ |
| 1.2 Author chips.yaml | Lina | ✅ |
| 1.3 D9 compliance validation | Ada | ✅ |
| 1.4 Schema review gate | Thurgood + Peter | ✅ (severity fix applied) |

---

## Fix Applied

Removed `severity: advisory` from all 4 discouragedPatterns per Task 1.4 review. The field was included despite being explicitly removed during domain review feedback. Reference file now matches spec schema.
