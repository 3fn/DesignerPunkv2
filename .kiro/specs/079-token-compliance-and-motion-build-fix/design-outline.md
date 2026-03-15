# Token Compliance & Motion Build Fix

**Date**: 2026-03-14
**Purpose**: Fix duplicate motion primitives in browser CSS, complete EASING/DURATION/SCALE category migration, and resolve token compliance violations in Avatar-Base and Button-VerticalList
**Organization**: spec-guide
**Scope**: 079-token-compliance-and-motion-build-fix
**Status**: Design outline

---

## Problem Statement

Three related token issues surfaced during Spec 049 post-completion and Thurgood's compliance audit:

### Issue 1: Duplicate Duration Primitives in Browser CSS

The browser build (`dist/browser/tokens.css`) outputs duration tokens twice in the same `:root` block:

- Line ~433: `--duration-150: 150;` (unitless, from primitive pass)
- Line ~829: `--duration-150: 150ms;` (with units, from motion section)

The second declaration wins via CSS cascade, so resolved values are correct. But the unitless primitives are dead weight that actively mislead. This directly caused the Safari ESM animation bug in Nav-SegmentedChoice — a component used `calc(var(--duration-150) * 1ms)` which evaluated to `calc(150ms * 1ms)` (invalid CSS, ms × ms).

Easing and scale tokens also have dual output, but their values are identical both times. Duration is the only family where the two outputs differ.

**Root cause**: `generateWebTokens()` in `TokenFileGenerator.ts` assembles the CSS in two passes. The primitive pass iterates `getAllPrimitiveTokens()` (which includes duration/easing/scale) and calls `formatToken()` — outputting the raw `platforms.web` value (`{ value: 150, unit: 'unitless' }`). The motion section calls `WebBuilder.generateDurationTokens()` which appends `ms`. Both passes output the same tokens with different formatting.

### Issue 2: Incomplete Category Migration

Spec 049 Task 1.2 added `TokenCategory.EASING` and migrated the three easing tokens from `SPACING` to `EASING`. But duration and scale tokens were left as `SPACING` with comments saying "Using SPACING temporarily until DURATION/SCALE category is added." This was noted but not addressed because it was outside Spec 049's scope (easing infrastructure only).

The `SPACING` categorization means:
- Duration and scale tokens appear in the spacing section of the primitive pass output
- Category-based filtering can't distinguish them from actual spacing tokens
- The `allTokens` map in `index.ts` doesn't have `DURATION` or `SCALE` entries

### Issue 3: Token Compliance Violations (Avatar-Base & Button-VerticalList)

Thurgood's audit found 21 violations across two components, previously invisible because the files used unsuffixed naming that didn't match the TokenCompliance test's scan patterns. A naming convention fix made them visible.

**Avatar-Base Android (15 violations):**
- 6 icon sizes hard-coded instead of referencing `DesignTokens.icon_size*` (4 have direct token equivalents, 2 need component tokens at 12dp and 64dp)
- 6 avatar dimensions hard-coded (`24.dp`, `32.dp`, `40.dp`, `48.dp`, `80.dp`, `128.dp`) — need component tokens or token references
- 2 border widths hard-coded — should reference border width tokens
- 1 double-unitizing issue (`.dp` appended to already-unitized token)

**Button-VerticalList-Item Android (4 violations):**
- 1 double-unitizing (`DesignTokens.radius_100.dp`)
- 1 icon size hard-coded
- 2 hard-coded values in Preview composable (lower severity — preview-only code)

**Button-VerticalList-Set (2 violations):**
- iOS and Android: `8` / `8.dp` bottom padding — should reference spacing token

---

## Options

### Issue 1: Duplicate Duration Primitives

#### Option A: Filter Motion Tokens from Primitive Pass ← Approved

In `generateWebTokens()`, exclude tokens with motion-related categories (`EASING`, `DURATION`, `SCALE`) from the primitive loop. The motion section remains the authoritative output for these tokens. Filter applies to all three families — lightweight check confirmed no browser consumers depend on the primitive-section duplicates.

**Pros:**
- Narrowest change — only affects CSS assembly, not token definitions
- Doesn't break other consumers of `getAllPrimitiveTokens()` (DTCG, validators, Figma)
- Clean separation: primitive pass handles non-motion tokens, motion section handles motion tokens

**Cons:**
- Requires Issue 2 (category migration) to be done first — can't filter by `DURATION`/`SCALE` if they're still categorized as `SPACING`
- Creates a coupling between the filter list and the category enum

#### Option B: Remove Motion Tokens from `getAllPrimitiveTokens()`

Remove duration, easing, and scale from the `allTokens` map in `index.ts`.

**Pros:**
- Eliminates the dual-output at the source

**Cons:**
- Breaks DTCG generator, Figma transformer, validators, and any other consumer of `getAllPrimitiveTokens()`
- These tokens ARE primitives — removing them from the primitive collection is semantically wrong

#### Option C: Fix the Primitive Unit to `ms`

Change `DurationTokens.ts` to store `unit: 'ms'` instead of `'unitless'`.

**Pros:**
- Both passes would output `150ms` — still duplicated but consistent

**Cons:**
- Band-aid — doesn't fix the duplication, just makes it less dangerous
- Changes the token definition's cross-platform contract (iOS and Android also read `platforms.web`)
- Doesn't address easing/scale duplication (harmless but wasteful)

### Issue 2: Category Migration

Single option: Add `DURATION` and `SCALE` to `TokenCategory` enum, update the tokens, update the `allTokens` map. Same pattern as the `EASING` migration in Spec 049 Task 1.2.

### Issue 3: Token Compliance Violations

Two sub-options for the avatar dimension tokens (12dp, 64dp) that have no existing token:

#### Option X: Create Component Tokens ← Approved

Create avatar component tokens for both dimensions and icon sizes. The 0.5× ratio (icon = half avatar dimension) is a clean mathematical relationship.

```
avatar.dimension.xs = 24    avatar.icon.xs = 12
avatar.dimension.s  = 32    avatar.icon.s  = 16
avatar.dimension.m  = 40    avatar.icon.m  = 20
avatar.dimension.l  = 48    avatar.icon.l  = 24
avatar.dimension.xl = 80    avatar.icon.xl = 40
avatar.dimension.xxl = 128  avatar.icon.xxl = 64
```

**Pros:**
- Follows the token hierarchy (component tokens for component-specific values)
- Makes the values discoverable and themeable

**Cons:**
- Requires human approval (component token creation governance)
- 12dp and 64dp may not align with the icon size scale's mathematical progression

#### Option Y: Reference Nearest Primitive + Scale

Use `icon.size050` (16dp) with a scale factor, or accept the gap and document it.

**Pros:**
- No new tokens needed

**Cons:**
- Mathematically imprecise — 12dp isn't a clean scale of any existing icon token
- Obscures the design intent

---

## Open Questions

1. **Should the Preview composable violations (Button-VerticalList-Item) be fixed or waived?**
   **Resolved**: Fix them. The effort is trivial (~2 minutes per violation) and keeps the TokenCompliance test clean. Waiving would require maintaining exclusion logic that costs more than the fix.

2. **Avatar dimensions (24, 32, 40, 48, 80, 128dp) — component tokens or primitive references?**
   **Resolved**: Component tokens. Avatar needs its own dimension scale AND its own icon-within-avatar scale. The icon-to-avatar ratio is a clean 0.5× mathematical relationship (icon is half the avatar dimension). Using spacing tokens for avatar sizing would be semantically wrong — these are independently motivated values that happen to align with the baseline grid.

   Component token structure:
   ```
   avatar.dimension.xs = 24    avatar.icon.xs = 12
   avatar.dimension.s  = 32    avatar.icon.s  = 16
   avatar.dimension.m  = 40    avatar.icon.m  = 20
   avatar.dimension.l  = 48    avatar.icon.l  = 24
   avatar.dimension.xl = 80    avatar.icon.xl = 40
   avatar.dimension.xxl = 128  avatar.icon.xxl = 64
   ```

   Note: The existing Avatar Android code has incorrect comments — `iconDimension = 40.dp` is labeled "references icon.size500" but `icon.size500` resolves to 33dp, not 40dp. Similarly `iconDimension = 24.dp` is labeled "references icon.size100" but `icon.size100` resolves to 16dp. These comments are aspirational, not factual. The component token approach makes the actual values explicit.

3. **Should the filter in Option A also remove the duplicate easing and scale output?**
   **Resolved**: Yes, filter all three motion families. A lightweight check of browser distribution consumers confirmed no JS/ESM code depends on the primitive-section duplicates — all references are CSS custom property lookups (`var(--duration-150)`) that resolve to the motion section's output.

4. **Does the `unit: 'unitless'` in DurationTokens need updating regardless?**
   **Resolved**: No code change. Option A makes it moot for web output — `formatToken()` never sees duration tokens. The `unitless` designation is technically correct for the cross-platform data model (iOS converts to seconds, Android to ms). Fix the misleading comment only: clarify that the unit is applied by `WebBuilder.generateDurationTokens()`, not by the primitive pass.

---

## Dependencies

- **Spec 049 Task 1.2**: Established the `EASING` category pattern that Issue 2 extends
- **Token-Family-Motion.md**: Updated in Spec 049 Task 1.6 — may need minor updates for new categories
- **TokenCompliance test**: Already updated by Thurgood to surface the violations

---

## Cross-Domain Notes

- Issue 1 (build pipeline) and Issue 2 (category migration) are Ada's domain
- Issue 3 (component compliance fixes) is Lina's domain — platform implementation files
- Issue 3's component token creation decisions need Peter's approval per governance
- The 12dp and 64dp icon sizes may need Ada's input on whether they fit the icon size scale's mathematical progression

---

## Origin

- Issue 1: Discovered by Lina during Safari ESM bug investigation (`.kiro/issues/2026-03-14-browser-token-duplicate-duration-primitives.md`)
- Issue 2: Noted during Spec 049 Task 1.2 as deferred cleanup
- Issue 3: Discovered by Thurgood during TokenCompliance audit (`.kiro/issues/2026-03-14-token-compliance-violations-avatar-verticallist.md`)
