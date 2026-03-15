# Release Notes — v9.4.0

**Date**: 2026-03-14
**Type**: Minor Release
**Specs**: 079 (Token Compliance & Motion Build Fix)
**Previous**: v9.3.0

---

## Summary

Token pipeline correctness and compliance release. Eliminates duplicate browser CSS declarations for motion tokens, completes the token category migration started in Spec 049, fixes Android generator type inconsistency, and resolves all 20 TokenCompliance spacing violations.

## Changes

### Token Pipeline (Spec 079)

- **Category migration**: Added `DURATION` and `SCALE` to `TokenCategory` enum, migrated duration and scale tokens from `SPACING` category
- **Duplicate elimination**: Filtered `EASING`, `DURATION`, `SCALE` from primitive pass in `generateWebTokens()` — browser CSS no longer outputs motion tokens twice
- **Android generator type fix**: Spacing, radius, tap area, fontSize, and borderWidth tokens now output as `Dp` type (`val X = N.dp`) instead of `Float` (`const val X: Float = Nf`). This is a **breaking change for Android generated output** — any code consuming these tokens as `Float` must update to `Dp`
- **Component token derivation fix**: `formatAndroidComponentTokenValue()` now appends `.dp` for dimensional family derivations, ensuring type consistency between reference-based and value-based component tokens

### Token Compliance (Spec 079)

- **Avatar-Base Android**: 15 violations resolved — icon sizes reference `DesignTokens.icon_size_*`, dimensions reference `DesignTokens.space_*` and generated `AvatarTokens.*`, border widths reference `DesignTokens.border_width_*`
- **Button-VerticalList-Item Android**: 4 violations resolved — icon size, radius, and spacing now use token references; Preview composable intentionally excluded (decoupled from token system)
- **Button-VerticalList-Set iOS/Android**: 2 violations resolved — padding references `DesignTokens.space100` / `space_100`

### Other (post-9.3.0)

- **Nav-SegmentedChoice browser registration**: Added to `browser-entry.ts`, demo moved to Navigation section
- **Nav-SegmentedChoice Safari ESM fix**: Replaced async method with promise chain for Safari compatibility
- **Nav-SegmentedChoice demo rewrite**: Rewrote demo HTML to match established demo pattern
- **Platform file naming**: 8 unsuffixed files renamed to follow `.platform.ext` convention
- **README fix**: Broken Component Development Guide link corrected (closes GitHub PR #1)

## Test Suite

- 301 suites, 7,820 tests, 0 failures
- TokenCompliance: 0 violations (was 20 spacing + 1 motion false positive)

## Breaking Change Note

The Android generator type change (`Float` → `Dp`) affects generated output only. `dist/` is gitignored and not distributed. All internal component consumers were updated in the same spec. No external consumer impact.
