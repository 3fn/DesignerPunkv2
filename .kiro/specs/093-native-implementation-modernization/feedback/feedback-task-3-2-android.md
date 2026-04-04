# Task 3.2 Review: Button-VerticalList-Item Android Modernization

**Date**: 2026-04-03
**Reviewer**: Data
**Spec**: 093 - Native Implementation Modernization

---

## Fix Verification

### Explicit easing — ✅ Fixed
All three `tween()` calls now include `easing = DesignTokens.Easing.EasingStandard`. Duration references `DesignTokens.MotionSelectionTransition.duration`. Clean.

### LocalDesignTokens removal — ⚠️ Partially fixed
The composable body no longer uses `LocalDesignTokens.current` — all references are now `DesignTokens.*` directly. However:

**F1: `LocalDesignTokens` and `DesignTokensProvider` are still defined in the file (lines 60-137) — dead code.**
The `staticCompositionLocalOf` declaration, the `DesignTokensProvider` class with all its token properties, and the KDoc explaining the pattern are all still present. The composable has a comment "LocalDesignTokens removed — using DesignTokens.* directly" (line 238), but the definitions weren't actually removed. This is ~80 lines of dead code that will confuse anyone reading the file.

The completion doc claims "Zero `LocalDesignTokens` references in production code" — technically true (the composable doesn't *use* it), but the definition is still there and importable by other code.

### Press overlay → pressedBlend() — ❌ Not implemented
The task specified "Press overlay → `pressedBlend()`" (Req 3.1). The old `Color.black.opacity(0.1)` pattern is gone, but it wasn't replaced with `pressedBlend()` — the component uses `rememberRipple()` (line 459). This is the same Material ripple pattern that was already there.

The completion doc doesn't mention the press overlay change at all — it lists easing, LocalDesignTokens removal, and typography updates, but not the press feedback change.

This may be intentional — Issue 6 in the design outline documents ripple as appropriate for certain components. But the task explicitly said `pressedBlend()`, and the implementation doesn't match.

---

## Summary

| Requirement | Status | Notes |
|-------------|--------|-------|
| Req 3.1: Press overlay → pressedBlend() | ❌ Not done | Still uses `rememberRipple()` |
| Req 3.2: tween() → explicit easing | ✅ Done | All 3 calls have `EasingStandard` |
| Req 3.3: Remove LocalDesignTokens | ⚠️ Partial | Usage removed, definition (~80 lines) remains as dead code |

**Two items need attention:**
1. Remove the dead `LocalDesignTokens`/`DesignTokensProvider` definitions (~80 lines)
2. Clarify whether press feedback should be `pressedBlend()` (per task) or `rememberRipple()` (per Issue 6 design decision). If ripple is intentional here, the task description was wrong and should be updated. If `pressedBlend()` was intended, the implementation needs to change.
