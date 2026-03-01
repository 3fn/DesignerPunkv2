# Lina's Review Notes — 066 Spec

**Date**: 2026-03-01
**Reviewer**: Lina
**Requested by**: Thurgood (5 items) + organic findings (3 items)

---

## Thurgood's Review Items

### 1. CompositionDefinition before/after ✅

Model is correct. Nothing missing. The `CompositionRule.then.children` uses `Partial<CompositionDefinition['children']>` so it auto-inherits the new `requires` field. No change needed to `CompositionRule`.

### 2. omits and other inheriting components ⚠️ ACTION NEEDED

Legal's `omits: [size, indeterminate, labelAlign]` is correct — matches `Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'>` in types.ts.

**Finding**: 4 other inheriting components also use `Omit` and need the field added to their existing schemas:

| Component | Omits | Has schema? |
|-----------|-------|-------------|
| Chip-Input | `onPress` | ✅ existing |
| Input-Text-Email | `type`, `autocomplete` | ✅ existing |
| Input-Text-Password | `type`, `autocomplete` | ✅ existing |
| Input-Text-PhoneNumber | `type`, `autocomplete` | ✅ existing |

**Recommendation**: Fold into Task 1.5 (existing schema migration) — add `omits` to these 4 schemas alongside the `composes` → `internal` rename.

### 3. Task 1 sequencing ✅

Sequencing is correct. 1.2 (omits) and 1.3 (composition) are independent of each other but sequential is fine since I'm sole lead on both.

### 4. Token verification approach ⚠️ MINOR FIX

- Step 1 says "Read types.ts for token references" — types.ts defines props/interfaces, not tokens. Fix to: "Read types.ts for props, types, defaults."
- Missing step: check for `.tokens.ts` file. 3 of 8 schemaless components have them (Avatar-Base, Button-Icon, Button-VerticalList-Item). These are the most reliable token source.

### 5. Task 4.2 steering doc updates ⚠️ PROCESS FIX

Component-Development-Standards.md and Component-Development-Guide.md are steering docs — must be ballot measures for Peter's approval, not direct edits. Task should be structured as "draft proposals" not "update directly."

Additional: add `.tokens.ts` to the Component-Development-Guide file organization listing.

---

## Organic Findings

### Task 1.1 — Backward compatibility is unnecessary (APPROVED by Peter)

The parser accepting both `composes` (old) and `internal` (new) during migration adds dead code. If Task 1.5 migrates all existing schemas in the same commit, both formats never coexist. Clean break: update parser to `internal` only, migrate all schemas in the same task.

### Task 1.3 — CompositionChecker `requires` semantics (FOR THURGOOD TO REVIEW)

The task description says "if parent has `requires: [X]` and child is not X, composition is invalid." This conflates `requires` with `allowed`.

- `requires` = "at least one of type X must be present" (cardinality/presence check)
- `allowed` = "only these types are valid" (type filter)

The checker should validate `requires` as a presence check (are required types present in the child set?), not as a type filter. The `allowed` field handles type filtering. Thurgood should review the CompositionChecker task description to ensure this distinction is clear.

### Task 3.3 — state_disabled scope ambiguity (FOR THURGOOD TO CONSIDER)

The task says "For components outside the 8 (Chip-Base, Chip-Filter, Chip-Input): document findings only." But Button-VerticalList-Set IS one of the 8 being schemaed and also has `state_disabled` excluded. The wording implies only the 3 Chip components are outside scope, but the full list of 9 affected components should be checked against the 8 being schemaed to clarify which get fixes vs documentation.

Affected components with `state_disabled` excluded:
- Button-Icon ← being schemaed ✅
- Button-VerticalList-Item ← being schemaed ✅
- Button-VerticalList-Set ← being schemaed ✅
- Chip-Base ← NOT being schemaed (has schema already)
- Chip-Filter ← NOT being schemaed (has schema already)
- Chip-Input ← NOT being schemaed (has schema already)
- Input-Checkbox-Base ← being schemaed ✅
- Input-Radio-Base ← being schemaed ✅
- Input-Radio-Set ← being schemaed ✅

So 6 of 9 are being schemaed, not 5. Only 3 (Chip family) are document-only.
