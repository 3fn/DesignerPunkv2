# Component Token Android Type Inconsistency — Derivation Values Output as Int

**Date**: 2026-03-14
**Discovered by**: Thurgood (audit of Task 2.1 completion, Spec 079)
**Domain**: Ada (token pipeline/generator)
**Severity**: Low (technical debt — no longer a blocker)
**Status**: Open (downgraded — Lina worked around it in Task 2.2)
**Related**: Spec 079 Task 1.4 (Android generator type fix)

---

## Summary

After Task 1.4 fixed the Android generator to output `Dp` for spacing/radius/tap area primitives, component tokens that *reference* those primitives correctly inherit the `Dp` type. But component tokens that use *derivation values* (raw numbers from `value:` instead of `reference:`) still output as plain `Int`. This creates mixed types within the same Kotlin object.

## Evidence

`dist/ComponentTokens.android.kt` — AvatarTokens object:

```kotlin
// Reference-based → Dp (correct)
val sizeXs = SpacingTokens.space300    // Dp (space300 = 24.dp)
val sizeSm = SpacingTokens.space400    // Dp
val sizeMd = SpacingTokens.space500    // Dp
val sizeLg = SpacingTokens.space600    // Dp

// Derivation-based → Int (inconsistent)
val sizeXl = 80                        // Int
val sizeXxl = 128                      // Int
val iconSizeXs = 12                    // Int
val iconSizeXxl = 64                   // Int
```

## Root Cause

`TokenFileGenerator.formatAndroidComponentTokenValue()` at line 574:

```typescript
// Return raw value for non-reference tokens
return String(token.value);
```

Reference tokens go through `getFamilyClassName()` and resolve to `SpacingTokens.space300` (which is `Dp`). Derivation tokens just get `String(80)` — no unit suffix.

## Affected Tokens (6 total)

| Token | Component | Value | Family |
|-------|-----------|-------|--------|
| `sizeXl` | Avatar | 80 | spacing |
| `sizeXxl` | Avatar | 128 | spacing |
| `iconSizeXs` | Avatar | 12 | spacing |
| `iconSizeXxl` | Avatar | 64 | spacing |
| `maxWidth` | BadgeLabelBase | 120 | spacing |
| `paddingBlockRest` | SegmentedChoice | 11 | spacing |

## Impact

Task 2.2 (Lina fixing Avatar Android token references) is blocked. If Lina replaces hard-coded `80.dp` with `AvatarTokens.sizeXl`, the type changes from `Dp` to `Int` — she'd need to append `.dp` on some avatar tokens but not others within the same component. This defeats the consistency goal of the generator fix.

## Suggested Fix

In `formatAndroidComponentTokenValue()`, append `.dp` for dimensional family derivations:

```typescript
if (['spacing'].includes(token.family)) {
  return `${token.value}.dp`;
}
return String(token.value);
```

## Caveat

`BadgeLabelBase.maxWidth` (120) and `SegmentedChoice.paddingBlockRest` (11) are also spacing-family derivations. A blanket `.dp` for all spacing-family values may be correct for these (both are dimensional), but Ada should verify that the family alone is sufficient to determine the unit, or if a more granular approach is needed.

## Recommendation

Fix before Task 2.2 begins. The fix is small (a few lines in the formatter) and is a natural extension of Task 1.4's generator work.

## Current Status (Updated 2026-03-14)

Lina completed Task 2.2 before this issue was discovered. She identified the type inconsistency independently and worked around it:

- XL (`80.dp`) and XXL (`128.dp`) dimensions kept as hard-coded `Dp` literals instead of referencing `AvatarTokens.sizeXl` / `sizeXxl` (which are `Int`)
- Icon gap-fillers (`iconSizeXs`, `iconSizeXxl`) defined locally in the file's `AvatarTokens` object with explicit `: Dp = 12.dp` / `64.dp` typing, not referencing the generated `ComponentTokens.android.kt` values

This is correct and compiles, but means 4 values in `Avatar.android.kt` are not consuming the generated component tokens:

| Line | Current | After generator fix |
|------|---------|-------------------|
| ~247 | `dimension = 80.dp` | `dimension = AvatarTokens.sizeXl` |
| ~252 | `dimension = 128.dp` | `dimension = AvatarTokens.sizeXxl` |
| ~84 | `val iconSizeXs: Dp = 12.dp` | Remove — use generated `AvatarTokens.iconSizeXs` |
| ~91 | `val iconSizeXxl: Dp = 64.dp` | Remove — use generated `AvatarTokens.iconSizeXxl` |

**Follow-up**: Once Ada fixes the generator to append `.dp` to derivation values, Lina can do a small cleanup pass to replace these 4 hard-coded values with generated component token references.
