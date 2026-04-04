# Task 2.2 Review: Chip Family iOS Easing — Kenya

**Date**: 2026-04-03
**Reviewer**: Kenya
**Components**: Chip-Base, Chip-Filter, Chip-Input
**Status**: ✅ Approved with one note

---

## Verification

### Chip-Base

| Line | Before | After | Correct? |
|------|--------|-------|----------|
| 289 | `.easeInOut(duration: ChipTokens.animationDuration)` | `DesignTokens.MotionButtonPress.easing` | ✅ Press → ButtonPress |

### Chip-Filter

| Line | Before | After | Correct? |
|------|--------|-------|----------|
| 328 | `.easeInOut(duration: ChipFilterTokens.animationDuration)` | `DesignTokens.MotionButtonPress.easing` | ✅ Press → ButtonPress |
| 329 | `.easeInOut(duration: ChipFilterTokens.animationDuration)` | `DesignTokens.MotionButtonPress.easing` | ⚠️ See note |

### Chip-Input

| Line | Before | After | Correct? |
|------|--------|-------|----------|
| 293 | `.easeInOut(duration: ChipInputTokens.animationDuration)` | `DesignTokens.MotionButtonPress.easing` | ✅ Press → ButtonPress |

## Note: Chip-Filter line 329 — `selected` uses ButtonPress instead of SelectionTransition

Line 329 animates the `selected` state change (chip toggling between selected/unselected). This is semantically a selection transition, not a press. The correct token would be `MotionSelectionTransition.easing` (250ms, standard) rather than `MotionButtonPress.easing` (150ms, accelerate).

**Impact**: The selection animation will be faster (150ms vs 250ms) and use accelerate easing instead of standard. For a chip toggle this is subtle — the chip is small and the visual change (border/background color swap) is quick by nature. Not blocking, but semantically `MotionSelectionTransition` is the more accurate token.

**Non-blocking** — the animation works and feels responsive. Flagging for semantic correctness.

## Assessment

- 3 of 4 replacements are semantically correct
- 1 replacement (Chip-Filter `selected`) uses ButtonPress where SelectionTransition would be more accurate
- Zero hard-coded easing remaining in production code
- No `.speed()` modifier — clean direct usage
