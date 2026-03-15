# Task 1 Summary: Category Migration, Duplicate Elimination & Generator Fix

**Spec**: 079 — Token Compliance & Motion Build Fix
**Date**: 2026-03-14
**Agent**: Ada

## What Changed

Three token infrastructure issues resolved in one task:

1. **Category migration** — Duration (3) and scale (6) tokens moved from temporary `SPACING` category to proper `DURATION` and `SCALE` categories, completing the pattern started by `EASING` in Spec 049.

2. **Duplicate elimination** — Browser CSS no longer outputs motion tokens twice. The primitive pass in `generateWebTokens()` now filters `EASING`, `DURATION`, and `SCALE` categories. Motion tokens appear exclusively in the motion section with correct units (`150ms`, not `150`).

3. **Android generator consistency** — All dimensional token families (spacing, radius, tapArea, fontSize, borderWidth) now output as `Dp` type (`val name = N.dp`), matching the existing icon/elevation pattern. Previously these output as `Float` (`const val name: Float = Nf`), requiring component code to append `.dp` for some families but not others.

## Impact

- Browser consumers no longer encounter misleading unitless duration primitives
- Android component code can use all dimensional tokens uniformly (no `.dp` suffix needed)
- TokenCompliance test's `.dp` false positive is resolved (`.dp` on spacing/radius is now genuinely unnecessary)
- Tasks 2 and 3 (compliance fixes) can be implemented against the corrected generator output
