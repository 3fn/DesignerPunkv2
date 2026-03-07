# Task 1.3 Completion: Fix iOS Motion Token Type

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 1.3 — Fix iOS motion token type
**Status**: ✅ Complete
**Agent**: Ada (token pipeline)
**Validation**: Tier 2 — Standard

---

## Problem

The iOS generator's `formatMultiReferenceToken` method hardcoded `Typography()` as the type wrapper for all multi-reference semantic tokens. Motion tokens (which compose duration + easing primitives) were incorrectly output as:

```swift
public static let motionSelectionTransition = Typography(duration: duration250, easing: easingStandard)
```

## Fix

In `src/providers/iOSFormatGenerator.ts`, `formatMultiReferenceToken` now selects the type wrapper based on token name prefix:
- `motion.*` tokens → `Motion()`
- All other multi-reference tokens → `Typography()` (unchanged)

## Generated Output (After)

```swift
public static let motionSelectionTransition = Motion(duration: duration250, easing: easingStandard)
```

Typography tokens remain unchanged:
```swift
public static let typographyBodySm = Typography(fontSize: fontSize075, ...)
```

## Validation

- All 5 motion shorthand constants now use `Motion()` wrapper
- All 20 typography shorthand constants still use `Typography()` wrapper
- Full test suite: 291 suites, 7457 tests, all passing
