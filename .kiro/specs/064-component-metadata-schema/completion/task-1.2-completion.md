# Task 1.2 Completion: Fix Stale Motion Contract Token Names

**Date**: 2026-02-28
**Task**: 1.2 Fix stale motion contract token names
**Type**: Implementation
**Status**: Complete — pending Ada review

---

## Artifacts Modified

### Contracts (task-scoped — 3 files)
- `Avatar-Base/contracts.yaml` — `interaction_hover` behavior: `motion.duration.fast` → `motion.focusTransition`
- `Chip-Base/contracts.yaml` — `state_styling` behavior: `motion.duration.fast` → `motion.selectionTransition`
- `Chip-Filter/contracts.yaml` — `state_selected_styling` behavior: `motion.duration.fast` → `motion.selectionTransition`

### Additional stale references found and fixed (same token name, different files)
- `Avatar-Base/README.md` — hover transition description
- `Avatar-Base/platforms/web/Avatar.styles.css` — CSS comment
- `Chip-Base/Chip-Base.schema.yaml` — tokens list
- `Chip-Base/platforms/ios/ChipBase.swift` — token reference comment
- `Chip-Base/platforms/android/ChipBase.android.kt` — token reference comment
- `Chip-Filter/Chip-Filter.schema.yaml` — tokens list
- `Chip-Filter/platforms/ios/ChipFilter.swift` — token reference comment
- `Chip-Filter/platforms/android/ChipFilter.android.kt` — token reference comment
- `Chip-Input/Chip-Input.schema.yaml` — tokens list
- `Chip-Input/platforms/ios/ChipInput.swift` — token reference comment
- `Chip-Input/platforms/android/ChipInput.android.kt` — token reference comment

## Implementation Details

### Token Mapping Rationale

| Component | Contract | Old Reference | New Reference | Rationale |
|-----------|----------|---------------|---------------|-----------|
| Avatar-Base | interaction_hover | motion.duration.fast | motion.focusTransition | Hover is an interactive state transition. CSS already uses `--motion-focus-transition-duration`. Token description: "focus state transitions for interactive elements" (duration150 + easingStandard). |
| Chip-Base | state_styling | motion.duration.fast | motion.selectionTransition | Chips are selection controls. CSS already uses `--motion-selection-transition-duration`. Token description: "selection state changes for selectable elements" (duration250 + easingStandard). |
| Chip-Filter | state_selected_styling | motion.duration.fast | motion.selectionTransition | Inherits Chip-Base transition behavior. Same token applies. |

### Scope Expansion Note

The task specified 3 contracts.yaml files. During execution, 8 additional files were found with the same stale `motion.duration.fast` reference (schema.yaml token lists, platform implementation comments, README). These were updated for consistency since they reference the same token and leaving them stale would create confusion.

## Validation

**Tier 2: Standard**

- ✅ All 3 contracts.yaml files updated with correct semantic token names
- ✅ All additional stale references cleaned up (11 files total)
- ✅ Zero `motion.duration.fast` references remain in `src/`
- ✅ Full test suite: 290 suites, 7437 tests, 0 failures
- ✅ Requirement 8.2 satisfied

---

## 🔍 Ada Review Request

**Context**: Task 1.2 specifies Ada as consultant for correct semantic motion token names. Lina proceeded based on implementation evidence but needs Ada to confirm the mappings are semantically correct.

**What to review:**

1. **Avatar-Base hover transition → `motion.focusTransition`**
   - Is `focusTransition` the right semantic token for hover state changes on an interactive avatar?
   - The CSS implementation already uses `--motion-focus-transition-duration/easing`.
   - Alternative consideration: Should there be a dedicated `motion.hoverTransition` token, or is `focusTransition` semantically appropriate for both focus and hover state changes?

2. **Chip-Base/Chip-Filter state transitions → `motion.selectionTransition`**
   - Is `selectionTransition` the right semantic token for chip state styling (hover, pressed, selected)?
   - The CSS implementation already uses `--motion-selection-transition-duration/easing`.
   - Note: Chip-Base's `state_styling` contract covers hover/pressed states (not just selection), but the implementation uses `selectionTransition` for all of them. Is that semantically correct, or should hover/pressed use a different token?

**If corrections needed**: Update the contract behavior text in the relevant contracts.yaml files and note the correction in this doc.

## Ada Review (2026-02-28)

**Reviewer**: Ada (Rosetta token specialist)
**Verdict**: Both mappings confirmed semantically correct. No corrections needed.

### 1. Avatar-Base hover → `motion.focusTransition` ✅

`motion.focusTransition` (duration150 + easingStandard) is semantically appropriate. Hover and focus are both "attention state" transitions — fast, responsive feedback signals that tell the user "this element is interactive and you're engaging with it." The 150ms timing is correct for hover — it needs to feel immediate.

A separate `motion.hoverTransition` token is not warranted. Hover and focus share the same design intent (signal interactivity, not commitment). Splitting them would create a distinction without a meaningful design difference. If hover ever needs to feel different from focus, we can split then.

### 2. Chip-Base/Chip-Filter → `motion.selectionTransition` ✅

`motion.selectionTransition` (duration250 + easingStandard) is the right token. Chips are fundamentally selection controls — their primary interaction is selecting/deselecting. The 250ms timing gives state changes enough visual weight to feel deliberate.

Re: hover/pressed using the same token as selection — this is correct. Having all chip state transitions at the same speed creates visual coherence. A chip that hovers at 150ms but selects at 250ms would feel inconsistent. The single transition declaration covering all state changes is the right approach.

**Nuance for future reference:** If a purely navigational (non-selection) chip variant is ever built, it might want `focusTransition` instead. Not a current concern — all existing chip components are selection controls.

### Scope Expansion

The cleanup of 8 additional files beyond the 3 specified contracts.yaml was the right call. Leaving stale `motion.duration.fast` references in schema.yaml token lists and platform comments while fixing contracts would create confusion.
