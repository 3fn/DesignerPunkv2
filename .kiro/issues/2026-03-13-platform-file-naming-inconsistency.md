# Platform File Naming Convention Inconsistency

**Date**: 2026-03-13
**Discovered by**: Thurgood (during Spec 078 Task 2.3)
**Domain**: Lina (component scaffolding)
**Severity**: Low
**Status**: Open

---

## Issue

Component platform implementation files use two different naming conventions:

**Suffixed** (older components — Input-Text-Base, Button-CTA, Icon-Base, etc.):
- `InputTextBase.ios.swift`
- `InputTextBase.android.kt`
- `ButtonCTA.web.ts`

**Unsuffixed** (newer components — Avatar-Base, Button-VerticalList-Item, etc.):
- `Avatar.swift`
- `Avatar.kt`
- `VerticalListButtonItem.kt`

The platform suffix is redundant since the directory (`platforms/ios/`, `platforms/android/`, `platforms/web/`) already communicates the platform.

## Impact

- Spec 078 Task 2.3 had to relax `PLATFORM_PATTERNS` in `behavioral-contract-validation.test.ts` from `.ios.swift` / `.android.kt` to `.swift` / `.kt` to accommodate both conventions.
- Any future tooling that scans for platform files needs to handle both patterns.
- Minor readability inconsistency across the codebase.

## Recommendation

Standardize on one convention going forward. The unsuffixed approach is simpler since the directory provides context. Existing files don't need to be renamed — just pick a convention for new components.
