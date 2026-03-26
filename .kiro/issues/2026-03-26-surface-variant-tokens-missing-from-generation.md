# Surface Token Naming Mismatch: Card Uses Short Form, Token System Uses Full Form

**Date**: 2026-03-26
**Discovered by**: Ada (Spec 085 Task 2.0 verification)
**Domain**: Ada (token system)
**Severity**: Medium (elevated from Low — confirmed web rendering bug)
**Status**: Resolved
**Related**: `.kiro/specs/085-container-card-base-composition/completion/task-2-0-completion.md`

---

## Issue

The token generation system produces `colorStructureSurface` (singular) but does not produce surface variant tokens: `colorStructureSurfacePrimary`, `colorStructureSurfaceSecondary`, `colorStructureSurfaceTertiary`.

Multiple component native files reference these non-existent generated constants. The code is aspirational — the native files are reference implementations, not compiled artifacts — so there's no runtime failure today. But the gap means:

1. Native platform files reference constants that don't exist in generated output
2. Base's iOS TokenMapping uses placeholder values (`Color.white`, `Color(white: 0.96)`, `Color(white: 0.93)`) instead of generated constants for surface variants
3. Base's Android TokenMapping references `DesignTokens.color_structure_surface_primary/secondary/tertiary` which don't exist in generated output

## Evidence

**Generated output** (`final-verification/DesignTokens.ios.swift`):
```swift
public static let colorStructureSurface = white200  // exists
// colorStructureSurfacePrimary — MISSING
// colorStructureSurfaceSecondary — MISSING
// colorStructureSurfaceTertiary — MISSING
```

**Generated output** (`final-verification/DesignTokens.android.kt`):
```kotlin
val color_structure_surface = white_200  // exists
// color_structure_surface_primary — MISSING
// color_structure_surface_secondary — MISSING
// color_structure_surface_tertiary — MISSING
```

**Generated output** (`final-verification/DesignTokens.web.css`):
```css
--color-surface: var(--white-200);  /* exists */
/* --color-surface-primary — MISSING */
/* --color-surface-secondary — MISSING */
/* --color-surface-tertiary — MISSING */
```

**Components referencing non-existent constants:**
- `Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift` (line 847-849)
- `Container-Card-Base/platforms/android/ContainerCardBase.android.kt` (line 691-693)
- `Container-Base/platforms/ios/TokenMapping.swift` (lines 446-448 — added by Spec 085 Task 2.0, uses placeholders)
- `Container-Base/platforms/android/TokenMapping.kt` (lines 570-572 — added by Spec 085 Task 2.0, references non-existent constants)

## Investigation Findings (Ada, 2026-03-26)

### Q1: Do surface variants exist in the token source?

**Yes.** Fully defined in `src/tokens/semantic/ColorTokens.ts` (added Feb 22, commit `28ca8f2e`):
- `color.structure.surface.primary` → `white200` (rgba 245, 245, 250)
- `color.structure.surface.secondary` → `white300` (rgba 232, 232, 240)
- `color.structure.surface.tertiary` → `white400` (rgba 197, 197, 213)

Confirmed via `getAllSemanticTokens()` — all four surface tokens (including the base `color.structure.surface`) are returned.

### Q2: Are they generated correctly?

**Yes.** Fresh generation run (`generateTokenFiles()`) produces all variants on all three platforms:
- Web: `--color-structure-surface-primary: rgba(245, 245, 250, 1);`
- iOS: `public static let colorStructureSurfacePrimary: UIColor = UIColor(red: 0.96, green: 0.96, blue: 0.98, alpha: 1.00)`
- Android: `val color_structure_surface_primary = Color.argb(255, 245, 245, 250)`

The `final-verification/` files are stale snapshots (web CSS from Jan 14, Android from Feb 7, iOS from Mar 6) that predate or missed the surface variant addition. No tests or configs reference these files — safe to regenerate.

### Q3: Web CSS variable resolution — silent failure?

**Yes — confirmed. This is a real bug, not just a stale snapshot issue.**

Card's `tokens.ts` maps `'surface.primary'` → `'color.surface.primary'`. On web, this produces CSS variable `var(--color-surface-primary)`. But the canonical token name is `color.structure.surface.primary`, which generates CSS variable `--color-structure-surface-primary`. **The names don't match.**

The `structure` segment is missing from Card's token references.

**Impact on Card's web implementation:**

Pre-refactor (current): Card's `_calculateBlendColors()` tries `--color-surface-primary` (fails), then falls back to `--color-structure-surface-primary` (succeeds). So hover/press blend colors work. But the actual background color applied via `background: var(--color-surface-primary)` in Card's styles silently fails — the card renders with no explicit background (inherits from parent or browser default, which happens to be white, close enough to `surface.primary` that it's visually unnoticeable).

Post-refactor (Spec 085): Card passes `background="color.surface.primary"` to Base. Base calls `tokenToCssVar('color.surface.primary')` → `var(--color-surface-primary)`. Same silent failure — background doesn't render from the token system.

**Why it wasn't caught:** `surface.primary` resolves to `white200` which is near-white (rgba 245, 245, 250). On a white page background, a missing card background is visually indistinguishable from the correct one. The bug would become visible with `surface.secondary` or `surface.tertiary` (which are noticeably different grays), or in dark mode.

### Q4: Scope of the naming mismatch

Card's schema, `tokens.ts`, and `types.ts` all use the short form (`color.surface.primary`). The canonical token name uses the full form (`color.structure.surface.primary`). This mismatch exists in:
- `Container-Card-Base/tokens.ts` — `cardBackgroundTokenMap`
- `Container-Card-Base/Container-Card-Base.schema.yaml` — `tokens.color` section and `default_tokens.background`
- `Container-Card-Base/platforms/web/ContainerCardBase.web.ts` — blend color fallback chain (has the correct name as fallback, but primary lookup uses wrong name)

Other components using surface tokens should be checked for the same mismatch.

## Root Cause

**Token naming mismatch.** Card was authored using `color.surface.primary` (short form) but the Rosetta token system uses `color.structure.surface.primary` (full form with concept segment). The `structure` concept prefix is part of the canonical name per the Spec 052 semantic token naming restructure.

This is not a generation gap or a definition gap — it's a naming gap between how Card references tokens and how the token system names them.

## Fix

**Update Card's token references to use canonical names:**

1. `Container-Card-Base/tokens.ts` — Change `cardBackgroundTokenMap`:
   - `'surface.primary': 'color.structure.surface.primary'`
   - `'surface.secondary': 'color.structure.surface.secondary'`
   - `'surface.tertiary': 'color.structure.surface.tertiary'`

2. `Container-Card-Base/tokens.ts` — Change `cardBorderColorTokenMap`:
   - Verify `'border.default': 'color.border.default'` is correct (check if canonical name is `color.structure.border.default` or `color.border.default`)
   - `'border.subtle': 'color.structure.border.subtle'` — already correct

3. `Container-Card-Base/Container-Card-Base.schema.yaml` — Update `tokens.color` and `default_tokens` to use canonical names

4. Regenerate `final-verification/` files

5. Audit other components for the same `color.surface` vs `color.structure.surface` mismatch

**Severity reassessment:** Elevated from Low to Medium. This is a real rendering bug on web, not just a documentation issue. It's masked by the near-white color of `surface.primary` but would be visible with secondary/tertiary surfaces or in dark mode.

## Resolution (Ada, 2026-03-26)

Fixed Card's token references to use canonical names. 4 files changed:

- `Container-Card-Base/tokens.ts` — `cardBackgroundTokenMap` and `cardBorderColorTokenMap` updated to canonical names, `cardDefaultTokens` updated
- `Container-Card-Base/Container-Card-Base.schema.yaml` — `tokens.color` and `default_tokens` updated
- `Container-Card-Base/__tests__/ContainerCardBase.test.ts` — 13 test assertions updated
- `Container-Card-Base/__tests__/ContainerCardBase.composition.test.ts` — 1 test assertion updated

Full test suite: 308 suites, 8041 tests, 0 failures.

**Remaining follow-ups:**
- Regenerate `final-verification/` files (stale snapshots)
- Audit other components for the same `color.surface` vs `color.structure.surface` naming mismatch
- Native TokenMapping placeholder values vs generated constants (pre-existing tech debt, not related to this fix)
