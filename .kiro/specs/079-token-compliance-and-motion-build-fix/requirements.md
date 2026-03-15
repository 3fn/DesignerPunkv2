# Requirements: Token Compliance & Motion Build Fix

**Date**: 2026-03-14
**Spec**: 079 — Token Compliance & Motion Build Fix
**Status**: Requirements Phase
**Dependencies**: Spec 049 (EASING category pattern)

---

## 1. Duplicate Duration Primitive Elimination

1.1 **When** the browser build generates `tokens.css`, **the system shall** output each duration, easing, and scale token exactly once in the motion section, not duplicated in the primitive section.

1.2 **When** `generateWebTokens()` iterates primitive tokens, **the system shall** exclude tokens with categories `EASING`, `DURATION`, and `SCALE` from the primitive pass output.

1.3 **The system shall** preserve all non-motion primitive tokens in the primitive pass output without modification.

1.4 **The system shall** preserve the motion section output (with `ms` units for duration) without modification.

## 2. Category Migration

2.1 **The system shall** define `DURATION` and `SCALE` values in the `TokenCategory` enum.

2.2 **When** duration tokens are defined, **the system shall** categorize them as `DURATION` instead of `SPACING`.

2.3 **When** scale tokens are defined, **the system shall** categorize them as `SCALE` instead of `SPACING`.

2.4 **The system shall** include `DURATION` and `SCALE` entries in the `allTokens` map in `src/tokens/index.ts`.

2.5 **The system shall** preserve existing `EASING` categorization without modification.

## 3. Token Compliance — Avatar-Base

3.1 **When** Avatar-Base Android references icon sizes that have existing tokens (S=16dp, M=20dp, L=24dp, XL=40dp), **the implementation shall** use `DesignTokens.icon_size*` references instead of hard-coded `Dp` values.

3.2 **The system shall** define component tokens for avatar dimensions (`avatar.dimension.xs` through `avatar.dimension.xxl`) and for the two avatar icon sizes without existing tokens (`avatar.icon.xs` = 12dp, `avatar.icon.xxl` = 64dp). The component token definition shall document the 0.5× icon-to-dimension ratio.

3.3 **When** Avatar-Base Android references avatar dimensions or avatar-specific icon sizes, **the implementation shall** use the component tokens defined in 3.2.

3.4 **When** Avatar-Base Android references border widths, **the implementation shall** use border width token references instead of hard-coded values.

3.5 **The implementation shall not** append `.dp` to any `DesignTokens.*` reference (tokens are pre-unitized).

## 4. Token Compliance — Button-VerticalList

4.1 **When** Button-VerticalList-Item Android references `DesignTokens.radius_100`, **the implementation shall not** append `.dp` (double-unitizing violation).

4.2 **When** Button-VerticalList-Item Android references icon sizes, **the implementation shall** use `DesignTokens.icon_size*` instead of hard-coded values.

4.3 **When** Button-VerticalList-Item Android Preview composable uses spacing values, **the implementation shall** use `DesignTokens.space*` references.

4.4 **When** Button-VerticalList-Set uses bottom padding (iOS and Android), **the implementation shall** use spacing token references instead of hard-coded `8` / `8.dp`.

## 5. Android Generator Type Consistency

5.1 **The system shall** generate all dimensional token families (spacing, radius, tap area) as `Dp` type in the Android output, matching the existing pattern for icon sizes and elevations.

5.2 **When** the Android generator outputs spacing tokens, **the system shall** use `val` with `.dp` suffix instead of `const val` with `Float` type.

5.3 **When** the Android generator outputs radius tokens, **the system shall** use `val` with `.dp` suffix instead of `const val` with `Float` type.

5.4 **When** the Android generator outputs tap area tokens, **the system shall** use `val` with `.dp` suffix instead of `const val` with `Float` type.

5.5 **When** Android component files consume spacing, radius, or tap area tokens after the generator update, **the implementation shall not** append `.dp` (tokens are now pre-unitized as `Dp`).

## 6. Validation

6.1 **When** the full test suite runs after all changes, **the system shall** pass all TokenCompliance tests with zero spacing and zero motion violations.

6.2 **When** the browser build runs after Issue 1 changes, **the system shall** produce `tokens.css` with no duplicate CSS custom property declarations for duration, easing, or scale tokens.
