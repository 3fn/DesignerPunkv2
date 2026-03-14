# Platform File Naming Convention Inconsistency

**Date**: 2026-03-13
**Discovered by**: Thurgood (during Spec 078 Task 2.3)
**Domain**: Lina (component scaffolding)
**Severity**: Low
**Status**: Resolved — Convention confirmed, opportunistic fixes

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

---

## Lina Assessment (2026-03-13)

### Full Survey

The inconsistency is broader than the initial report. Three distinct issues:

**1. Platform suffix inconsistency**

| Convention | iOS | Android | Web |
|-----------|-----|---------|-----|
| Suffixed (`.ios.swift`, `.android.kt`, `.web.ts`) | 21 | 24 | 25 |
| Unsuffixed (`.swift`, `.kt`) | 5 | 3 | — |

Unsuffixed iOS: Avatar-Base, Button-VerticalList-Set, Chip-Base, Chip-Filter, Chip-Input
Unsuffixed Android: Avatar-Base, Button-VerticalList-Item, Button-VerticalList-Set

**~~2. `.web.ts` vs `.browser.ts`~~** ← RETRACTED

The Input-Text family `.browser.ts` files are intentional — they're standalone browser-bundle variants that exist alongside the `.web.ts` files. Not a naming inconsistency.

**3. PascalCase name reordering**

Button-VerticalList-Item: iOS file is `VerticalListButtonItem.ios.swift`, web is `ButtonVerticalListItem.web.ts`. The component name segments are reordered across platforms.

### Recommendation

Disagree with unsuffixed approach. Recommend standardizing on **suffixed** (`ComponentName.ios.swift`, `.android.kt`, `.web.ts`) because:

- Already the >80% majority convention
- Matches the scaffolding template in Lina's agent prompt
- More explicit in editor tabs — `BadgeCountBase.ios.swift` communicates platform without checking directory path
- Counter-argument: the suffix is technically redundant since `platforms/ios/` already communicates platform. But redundancy in naming aids readability when files are viewed outside their directory context (editor tabs, search results, git diffs).

### Resolution Strategy

Fix outliers **opportunistically** when those components are next touched for functional work — not as a dedicated rename sweep. A bulk rename would touch imports, test files, and risk breakage for zero functional benefit.

### Convention for New Components

Already documented in Lina's scaffolding workflow:
```
platforms/
  web/ComponentName.web.ts
  ios/ComponentName.ios.swift
  android/ComponentName.android.kt
```

---

## Resolution (2026-03-13)

**Convention**: Suffixed — `ComponentName.ios.swift`, `ComponentName.android.kt`, `ComponentName.web.ts`

**Rationale**: Lina's assessment accepted. Suffixed is the >80% majority, matches the scaffolding template, and aids readability in editor tabs, search results, and diffs. Thurgood's initial unsuffixed recommendation withdrawn.

**Existing outliers** (8 unsuffixed files, 4 `.browser.ts` files, 1 PascalCase reorder): Fix opportunistically when those components are next touched for functional work. No dedicated rename sweep.

**Documentation**: Convention already reflected in Component Development Guide's "Component Structure Pattern" file listing and Lina's scaffolding workflow. No additional doc changes needed.

**No spec required.** This is a convention confirmation, not a code change.

---

## Fix Applied (2026-03-13)

Renamed all 8 unsuffixed platform files to follow the suffixed convention. Updated 3 schema.yaml files and 2 READMEs with new filenames.

**Files renamed:**
- `Avatar-Base`: `Avatar.swift` → `Avatar.ios.swift`, `Avatar.kt` → `Avatar.android.kt`
- `Button-VerticalList-Set`: `ButtonVerticalListSet.swift` → `ButtonVerticalListSet.ios.swift`, `ButtonVerticalListSet.kt` → `ButtonVerticalListSet.android.kt`
- `Button-VerticalList-Item`: `VerticalListButtonItem.kt` → `VerticalListButtonItem.android.kt`
- `Chip-Base`: `ChipBase.swift` → `ChipBase.ios.swift`
- `Chip-Filter`: `ChipFilter.swift` → `ChipFilter.ios.swift`
- `Chip-Input`: `ChipInput.swift` → `ChipInput.ios.swift`

**Correction**: The `.browser.ts` files in the Input-Text family are NOT naming inconsistencies — they're intentional standalone browser-bundle variants that coexist with `.web.ts` files. Initial rename attempt overwrote the real `.web.ts` files; reverted immediately.

**Remaining**: Button-VerticalList-Item iOS file uses reordered PascalCase (`VerticalListButtonItem` vs `ButtonVerticalListItem`). Not renamed — the name is deeply embedded in Swift/Kotlin source, test classes, and test utilities. Fix deferred to when the component is next refactored.

**Validation**: Build clean (1.55 MB raw, ~298.07 KB gzipped). 302 suites, 7852 tests, 2 pre-existing failures (TokenCompliance — unrelated). Zero regressions from renames.
