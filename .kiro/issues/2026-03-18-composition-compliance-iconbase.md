# Composition Compliance: Components Using Raw Icons Instead of IconBase

**Date**: 2026-03-18
**Discovered by**: Peter (review of Nav-TabBar-Base implementation)
**Domain**: Thurgood (test governance), Lina (component implementation)
**Severity**: Medium
**Status**: Open

---

## Issue

Components that list `Icon-Base` in their `composition.internal` schema field are not consistently composing through the `IconBase` component on native platforms. Instead, they use raw platform primitives (`Image(systemName:)` on iOS, `Icon(painter:)` on Android) which bypasses the design system's icon rendering pipeline (token-based sizing, optical balance, decorative accessibility).

The web platform doesn't have this problem because `<icon-base>` is a custom element — there's no "quick path" alternative.

## Root Cause

Native UI frameworks provide first-class icon primitives that work without importing the design system component. When implementing under time pressure or pattern-matching from references that have the same gap, it's easy to reach for the framework primitive instead of the Stemma composition.

## Affected Components

### Confirmed Fixed
- `Nav-TabBar-Base` — iOS and Android fixed (2026-03-18, Spec 050)

### Confirmed Affected
- `Nav-SegmentedChoice-Base` — iOS uses `Image(systemName:)`, Android uses `Icon(` (Spec 049)

### Needs Audit
All components with `Icon-Base` in `composition.internal` should be audited. Many already use `IconBase(` correctly (Button-Icon, Button-CTA, Chip-Base, etc.) but a systematic check would confirm.

## Proposed Solution: Composition Compliance Test

Add a static source analysis test (Thurgood's domain) that:

1. Reads each component's `schema.yaml` for `composition.internal` entries
2. For each composed child component, verifies the platform source files contain the expected composition call:
   - `Icon-Base` → iOS: `IconBase(`, Android: `IconBase(`, Web: `icon-base` or `<icon-base`
   - Pattern generalizes to other composed components
3. Fails with a clear message: "ComponentX lists Icon-Base in composition.internal but platforms/ios/ComponentX.ios.swift does not contain IconBase("

This catches the issue mechanically rather than relying on developer memory.

## Interim Fix

Nav-SegmentedChoice-Base iOS and Android implementations should be updated to use `IconBase(` — tracked in this issue.
