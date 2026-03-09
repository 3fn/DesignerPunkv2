# Task 1.4 Schema Review Gate — Findings

**Date**: 2026-03-09
**Reviewer**: Thurgood
**Artifact**: `family-guidance/chips.yaml`
**Status**: Approved with one required fix

---

## Required Fix

### Remove `severity` field from discouragedPatterns

The `severity: advisory` field appears on all 4 discouraged patterns (lines 37, 41, 45, 49). The design.md schema does not include `severity` — it was explicitly removed during Ada/Lina feedback (collapsed to single level). The spec schema is `pattern` + `rationale` + `override` only.

**Action for Lina**: Remove all 4 `severity: advisory` lines from chips.yaml. This is the reference file — every subsequent family will copy this structure.

---

## Approved As-Is

| Area | Verdict | Notes |
|------|---------|-------|
| discouragedPatterns (content) | ✅ Useful | 4 patterns cover real boundary confusions and UX dead-ends |
| composesWithFamilies | ✅ Helpful | 3 entries map real composition and selection boundaries |
| component-meta alignment | ✅ Clean | No conflicts between component-level and family-level guidance |
| D9 compliance | ✅ Passed | Ada confirmed (Task 1.3) |
| FamilyGuidanceIndexer | ✅ 4 families indexed | No warnings |

## Advisory Notes (No Action Required)

- The Badges entry in `composesWithFamilies` is more of a selection boundary than a composition relationship. The field name implies composition. Watch for this pattern in other families — if `composesWithFamilies` starts accumulating "don't confuse with" entries, consider whether those belong in `whenNotToUse` only.
- `platformVariants` is not exercised by Chips (no platform divergence). First real test will be Icons (Task 4).

---

## Pending

- Lina applies the severity fix
- Peter gives final approval as reference for remaining families
