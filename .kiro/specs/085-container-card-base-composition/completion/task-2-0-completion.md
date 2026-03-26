# Task 2.0 Completion: Extend Base's Native Token Mappings

**Date**: 2026-03-26
**Task**: 2.0 Extend Base's native token mappings
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

- `src/components/core/Container-Base/platforms/ios/TokenMapping.swift` — Added 6 new token mappings + 3 color constants
- `src/components/core/Container-Base/platforms/android/TokenMapping.kt` — Added 3 new token mappings + 3 color constants

## Implementation Details

**iOS additions to `resolveColorToken()`:**
- `"color.surface.primary"` → `colorSurfacePrimary` (white)
- `"color.surface.secondary"` → `colorSurfaceSecondary` (0.96 white)
- `"color.surface.tertiary"` → `colorSurfaceTertiary` (0.93 white)
- `"color.border.default"` → `colorBorder` (existing constant, new mapping)
- `"color.structure.border.subtle"` → `colorBorderSubtle` (existing constant, new mapping)

iOS already had `colorBorderSubtle` as a private constant but it wasn't mapped in the switch.

**Android additions to `resolveColorToken()`:**
- `"color.surface.primary"` → `colorSurfacePrimary` (via `DesignTokens.color_structure_surface_primary`)
- `"color.surface.secondary"` → `colorSurfaceSecondary` (via `DesignTokens.color_structure_surface_secondary`)
- `"color.surface.tertiary"` → `colorSurfaceTertiary` (via `DesignTokens.color_structure_surface_tertiary`)

Android already handled `"color.border.default"` and `"color.structure.border.subtle"`.

**Shadow mappings**: No changes needed — both platforms already handle `"shadow.container"`.

## Validation

- ✅ Full test suite: 308 suites, 8041 tests, 0 failures
- ✅ No existing Container-Base tests broken
- ✅ Unblocks Tasks 2.1 (iOS) and 2.2 (Android)

## Note for Ada

iOS surface color constants use placeholder values (`Color.white`, `Color(white: 0.96)`, `Color(white: 0.93)`) matching the existing pattern in Base's TokenMapping. Android uses `DesignTokens` generated constants. The iOS placeholders will be replaced when the build system generates iOS token constants. Ada should verify these placeholder values are reasonable approximations.
