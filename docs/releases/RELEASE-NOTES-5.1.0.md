# DesignerPunk v5.1.0 Release Notes

**Release Date**: January 21, 2026

---

## Overview

v5.1.0 introduces the **Container-Card-Base** type primitive component and enhances **Container-Base** with directional padding and border color support. This release also includes a fix for false-positive breaking change detection in the release analysis system.

---

## New Features

### Container-Card-Base Component

A new type primitive component for card UI patterns, providing a curated subset of Container-Base props with opinionated defaults for zero-config card rendering.

**Key Features:**
- Curated padding values: `'none' | '100' | '150' | '200'` (excludes 050, 300, 400)
- Surface-only backgrounds: `'surface.primary' | 'surface.secondary' | 'surface.tertiary'`
- Container shadow only: `'none' | 'container'`
- Rounded corners only: `'normal' | 'loose'` (no sharp corners)
- Interactive behavior with blend utilities (8% hover, 12% press)
- ARIA semantics based on role prop

**Opinionated Defaults:**
| Prop | Default | Token |
|------|---------|-------|
| padding | `'150'` | `space.inset.150` |
| background | `'surface.primary'` | `color.surface.primary` |
| shadow | `'container'` | `shadow.container` |
| borderRadius | `'normal'` | `radius-100` |

**Platforms:** Web (TypeScript), iOS (SwiftUI), Android (Jetpack Compose)

### Container-Base Enhancements

Enhanced with directional padding and border color support for asymmetric layouts and RTL internationalization.

**New Props:**
- `paddingVertical` / `paddingHorizontal` - Axis-level padding control
- `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd` - Individual edge control
- `borderColor` - Separate border color control with `color.border.default`, `color.border.subtle`, `color.border.emphasis`

**Override Hierarchy:** individual edges > axis props > uniform padding

**RTL Support:** CSS logical properties (Web) and native leading/trailing (iOS/Android)

---

## Bug Fixes

### Release Analysis False-Positive Fix

Fixed an issue where the release analysis system incorrectly detected `"- **Breaking Changes**: None"` as a breaking change, causing false major version bump recommendations.

**Root Causes Fixed:**
- Broken regex escaping in PatternMatcher.ts
- Incomplete negation patterns for compound phrases
- Missing defensive filtering for zero-confidence matches

---

## Files Changed

### New Files
- `src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts`
- `src/components/core/Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift`
- `src/components/core/Container-Card-Base/platforms/android/ContainerCardBase.android.kt`
- `src/components/core/Container-Card-Base/Container-Card-Base.schema.yaml`
- `src/components/core/Container-Card-Base/README.md`
- `src/components/core/Container-Card-Base/types.ts`
- `src/components/core/Container-Card-Base/tokens.ts`
- `src/components/core/Container-Card-Base/__tests__/ContainerCardBase.test.ts`

### Modified Files
- `src/components/core/Container-Base/platforms/web/ContainerBase.web.ts`
- `src/components/core/Container-Base/platforms/ios/ContainerBase.ios.swift`
- `src/components/core/Container-Base/platforms/android/ContainerBase.android.kt`
- `src/release-analysis/extraction/PatternMatcher.ts`
- `src/release-analysis/extraction/SimpleChangeExtractor.ts`

---

## Breaking Changes

None. All existing Container-Base usage remains unchanged.

---

## Migration Guide

No migration required. This is a backward-compatible minor release.

---

## Test Coverage

- 292 test suites passing
- 7,255 total tests
- All release-analysis tests passing (656 tests across 37 suites)

---

## Related Documentation

- [Container-Card-Base README](../../src/components/core/Container-Card-Base/README.md)
- [Container-Base README](../../src/components/core/Container-Base/README.md)
- [Component-Family-Container.md](../../.kiro/steering/Component-Family-Container.md)
- [Spec 043 Task Summaries](../specs/043-container-card-base/)

---

## Contributors

- Peter Michaels Allen - Project Creator
- AI Collaboration (Claude) - Implementation Partner
