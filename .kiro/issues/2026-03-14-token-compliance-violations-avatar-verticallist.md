# Token Compliance Violations — Avatar-Base & Button-VerticalList

**Date**: 2026-03-14
**Discovered by**: Thurgood (audit of pre-existing TokenCompliance test failures)
**Domain**: Lina (platform implementation files)
**Severity**: Medium
**Status**: Open

---

## Root Cause

These violations were always present but invisible to the TokenCompliance test. The files used unsuffixed naming (`Avatar.kt`, `Avatar.swift`) which didn't match the test's `.android.kt` / `.ios.swift` scan patterns. The naming convention fix (commit `2c1e9e70`) made them visible.

## Already Fixed (Thurgood)

- ✅ `tween(durationMillis = 0)` false positive — test regex updated to allow zero-duration as intentional "no animation" pattern

## Violations for Lina (20 remaining)

### Avatar-Base Android (15 violations)

**Icon sizes — hard-coded instead of referencing DesignTokens:**
- `iconSizeXs: Dp = 12.dp` — component token gap filler (no icon token at 12dp). Needs component token.
- `iconSizeXxl: Dp = 64.dp` — component token gap filler (no icon token at 64dp). Needs component token.
- `iconDimension = 16.dp` → should be `DesignTokens.icon_size050`
- `iconDimension = 20.dp` → should be `DesignTokens.icon_size075`
- `iconDimension = 24.dp` → should be `DesignTokens.icon_size100`
- `iconDimension = 40.dp` → should be `DesignTokens.icon_size500`

**Avatar dimensions — hard-coded enum values:**
- `dimension = 24.dp`, `32.dp`, `40.dp`, `48.dp`, `80.dp`, `128.dp` — these are avatar sizing. Need component tokens or token references.

**Border widths:**
- `borderWidthDefault: Dp = 1.dp` → should reference border width token
- `borderWidthEmphasis: Dp = 2.dp` → should reference border width token

**Note on `.dp` suffix:** Per the token consumption rule, tokens are pre-unitized. `DesignTokens.radius_100.dp` is double-unitizing — the `.dp` must not be appended when consuming tokens.

### Button-VerticalList-Item Android (4 violations)

- `radiusNormal: Dp = DesignTokens.radius_100.dp` → remove `.dp` (double-unitizing)
- `iconSize100: Dp = 24.dp` → should be `DesignTokens.icon_size100`
- `RoundedCornerShape(4.dp)` — in placeholder preview box
- `.padding(16.dp)` and `Arrangement.spacedBy(16.dp)` — in Preview composable

### Button-VerticalList-Set (2 violations)

- iOS line 546: `.padding(.bottom, 8)` → should reference spacing token
- Android line 525: `.padding(bottom = 8.dp)` → should reference spacing token
