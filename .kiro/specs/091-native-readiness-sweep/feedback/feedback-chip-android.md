# Task 3.6 Review: Chip Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Chip-Base, Chip-Filter, Chip-Input

---

## Fix Verification

| Component | Issue | Status | Notes |
|-----------|-------|--------|-------|
| Chip-Base | Hard-coded `RoundedCornerShape(50)` | ❌ Not fixed | Still on line ~228 |
| Chip-Filter | Hard-coded `RoundedCornerShape(50)` | ❌ Not fixed | Still on line 284 |
| Chip-Input | Hard-coded `RoundedCornerShape(50)` | ❌ Not fixed | Still on line 227 |

**All three Phase 0 blocking issues remain unfixed.**

The comment says "Pill shape (radius.full equivalent)" — the intent is correct but the implementation should reference `DesignTokens.radius_full` or `DesignTokens.radius_half` instead of the literal `50`. `RoundedCornerShape(percent = 50)` would be the explicit form if using a percentage, but it should derive from the token.

---

## Production-Quality Assessment

### Chip-Base

**Clean primitive. Good token architecture aside from the shape issue.**

#### Strengths
- `ChipTokens` object with all token references — well-organized
- `pressedBlend()` for press feedback — cross-platform consistent
- `Role.Button` + `contentDescription` — contract satisfied
- `sizeIn(minHeight = ChipTokens.tapArea)` — 48dp touch target from token
- `IconBase` composition for leading icon — correct Stemma pattern
- `interactionSource` properly remembered, pressed state tracked
- `Surface` composable for clickable behavior — idiomatic for a chip

#### Concerns

**C1: `RoundedCornerShape(50)` — BLOCKING (unfixed from Phase 0).**
Should reference radius token.

**C2: `color_surface` and `color_border` and `color_primary` token names — verify.**
`ChipTokens` references `DesignTokens.color_surface`, `DesignTokens.color_border`, `DesignTokens.color_primary`. Need to verify these resolve to the correct semantic tokens (`color.structure.surface`, `color.structure.border`, `color.action.primary`). The naming without `structure` or `action` prefix suggests these might be shorthand aliases.

### Chip-Filter

**Correct toggle behavior. Inherits Chip-Base's strengths and shape issue.**

#### Strengths
- Selection state with `color.feedback.select.*` tokens — correct per contract
- Checkmark icon replaces leading icon when selected — contract satisfied
- `stateDescription` for TalkBack selection state — good accessibility
- Animated color transitions for selection state changes

#### Concerns

**C3: `RoundedCornerShape(50)` — BLOCKING (unfixed).**
Same as Chip-Base.

### Chip-Input

**Correct dismiss behavior. Dual icon layout handled properly.**

#### Strengths
- Trailing X icon always present — contract satisfied
- Dual icon support (leading + trailing X) — contract satisfied
- `contentDescription` with dismiss label — accessibility correct
- Press anywhere dismisses (not just X icon) — contract satisfied

#### Concerns

**C4: `RoundedCornerShape(50)` — BLOCKING (unfixed).**
Same as Chip-Base.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Chip-Base | 1 (C1) | 1 (C2) | Good architecture. Shape fix needed. |
| Chip-Filter | 1 (C3) | 0 | Clean toggle. Shape fix needed. |
| Chip-Input | 1 (C4) | 0 | Clean dismiss. Shape fix needed. |

**3 blocking issues — all the same fix.** `RoundedCornerShape(50)` → token reference in all three files. This is a one-pattern batch fix that Lina hasn't applied yet.

**Ship readiness:** After the shape fix, all three are ship-ready. The implementations are otherwise clean — good token usage, correct accessibility, proper Stemma composition.
