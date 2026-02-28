# Task 1 Parent Completion: Pre-Schema Cleanup

**Date**: 2026-02-28
**Task**: 1 Pre-Schema Cleanup
**Type**: Parent
**Status**: Complete

---

## Success Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Avatar renamed to Avatar-Base across all file paths, schema references, contract references, test files, and steering docs | ✅ | Task 1.1 — directory renamed, 20+ files updated, 0 stale `components/core/Avatar/` paths remain |
| 3 stale motion contract names updated to correct semantic token names | ✅ | Task 1.2 — Avatar-Base→`motion.focusTransition`, Chip-Base→`motion.selectionTransition`, Chip-Filter→`motion.selectionTransition`. 8 additional stale refs in schema/platform files also cleaned. Ada reviewed and approved. |
| Button-Icon iOS scale value decision documented | ✅ | Task 1.3 — adjusted from 0.97 to `scale096` (0.96). Peter approved Option A (token alignment). Ada updated iOS MotionTokens.swift documentation to match. |
| All existing tests pass after cleanup (0 regressions) | ✅ | 290 suites, 7437 tests, 0 failures |

## Primary Artifacts

- Renamed `src/components/core/Avatar-Base/` directory and all internal files
- Updated contracts.yaml files for Avatar-Base, Chip-Base, Chip-Filter (+ Chip-Input as additional cleanup)
- Decision record for Button-Icon iOS scale value (adjusted to scale096)
- Ada's token-side alignment: `src/tokens/platforms/ios/MotionTokens.swift` documentation updated

## Subtask Summary

### 1.1 Rename Avatar to Avatar-Base
- Directory renamed, `component:` field updated, all import paths and comment references updated
- `family: Avatar` kept singular (matching project convention)
- Steering docs updated (ballot measure approved): removed stale "rename planned" notes from `stemma-system-principles.md` and `Component-Schema-Format.md`
- Completion: `task-1.1-completion.md`

### 1.2 Fix Stale Motion Contract Token Names
- 3 contracts updated per task scope + 8 additional stale references found and cleaned
- Token mappings: Avatar-Base hover→`motion.focusTransition`, Chip state transitions→`motion.selectionTransition`
- Zero `motion.duration.fast` references remain in `src/`
- Ada reviewed and approved mappings
- Completion: `task-1.2-completion.md`

### 1.3 Resolve Button-Icon iOS Scale Value
- Adjusted from hard-coded 0.97 to 0.96 (aligning with `scale096` token)
- Contract and README updated to reference token name
- Ada updated iOS MotionTokens.swift documentation example to use `DesignTokens.scale096`
- Completion: `task-1.3-completion.md`

## Observations

- **Family naming inconsistency**: Contracts.yaml `family:` fields use a mix of singular (Badge, Chip, Avatar) and plural (Buttons, Containers, Icons). Schema.yaml adds a third variant (FormInputs vs Input-Text). Flagged as a separate cleanup item — out of scope for 064.
- **Stale reference spread**: The `motion.duration.fast` name appeared in 11 files beyond the 3 contracts specified in the task. Cleaning all of them was the right call — partial cleanup would have left confusing inconsistencies.

## Validation

**Tier 3: Comprehensive**

- ✅ All 3 success criteria met
- ✅ Full test suite: 290 suites, 7437 tests, 0 failures (run after each subtask)
- ✅ No stale `components/core/Avatar/` paths in `src/`
- ✅ No stale `motion.duration.fast` references in `src/`
- ✅ No stale `0.97` scale values in Button-Icon
- ✅ Steering doc updates approved via ballot measure
- ✅ Ada consulted on Tasks 1.2 and 1.3
- ✅ Requirement 8.1, 8.2, 8.3 satisfied
