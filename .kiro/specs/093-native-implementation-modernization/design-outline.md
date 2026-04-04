# Native Implementation Modernization — Design Outline

**Date**: 2026-04-03
**Author**: Lina
**Purpose**: Address systemic patterns discovered during Spec 091 native readiness sweep
**Status**: Design Outline — Draft
**Origin**: Spec 091 cross-cutting issues tracker

---

## Scope Assessment

### Fixes (code changes)

| # | Issue | Files | Effort |
|---|-------|-------|--------|
| 1 | P1 Easing: iOS hard-coded easing → token easing | 9 files | Medium — pattern change, not find-replace |
| 2 | Button-CTA Android: config type system (`Int` → `Dp`, hard-coded values → tokens) | 1 file | Medium — interconnected changes |
| 3 | Button-VerticalList-Item: press overlay → blend utility, tween easing | 1 file | Low |
| 4 | Checkbox/Radio Android: missing easing + reduced motion | 2 files | Low |
| 5 | Progress-Node-Base Android: Material checkmark → IconBase | 1 file | Low |

### Design Decisions (documentation, not code)

| # | Issue | Resolution |
|---|-------|-----------|
| 6 | Ripple vs blend (Button-Icon vs Button-CTA) | Document when each is appropriate |
| 7 | `LocalDesignTokens.current` pattern | Remove — outlier, no other component uses it |

### Deferred (architectural, out of scope)

| # | Issue | Rationale |
|---|-------|-----------|
| 8 | Container-Card-Base duplicated padding | Architectural refactor — Card delegates to Base correctly, duplication is in preview/test path only |
| 9 | Container-Card-Base `indication = null` | Design decision — blend utilities are the intended feedback. No fallback needed if blends work. |
| 10 | Container-Base file size | Refactoring — extract mapping functions. Not blocking, not modernization. |

---

## Issue 1: P1 Easing Pattern (iOS)

### Current State

9+ iOS files use SwiftUI built-in easing with token durations:
```swift
.easeInOut(duration: DesignTokens.Duration.duration150)
```

The generated tokens provide `Animation` objects:
```swift
DesignTokens.MotionFocusTransition.easing  // Animation
DesignTokens.MotionFocusTransition.duration // TimeInterval
```

### Recommended Pattern

Every animation references a semantic motion token directly:
```swift
withAnimation(DesignTokens.MotionSelectionTransition.easing) { ... }
withAnimation(DesignTokens.MotionButtonPress.easing) { ... }
```

No raw easing + duration combinations. No `.speed()` modifier. If a future animation doesn't have a matching semantic motion token, create one — don't fall back to raw tokens.

### Can It Be Incremental?

Yes. Each file can be updated independently. Batch by family for review efficiency.

### Semantic Motion Token Mapping (per Kenya F1)

Every animation uses a semantic motion token. No raw easing + duration fallbacks — if an animation doesn't have a matching semantic token, one is created. The `.speed()` pattern is not used.

| File | Current Easing | Semantic Motion Token |
|------|---------------|----------------------|
| Input-Checkbox-Base | `.easeOut` (press), `.easeInOut` (selection) | `MotionButtonPress`, `MotionSelectionTransition` |
| Input-Radio-Base | `.easeOut` (press), `.easeInOut` (selection) | `MotionButtonPress`, `MotionSelectionTransition` |
| Chip-Base | `.easeInOut` (press) | `MotionButtonPress` |
| Chip-Filter | `.easeInOut` (press/selection) | `MotionButtonPress` |
| Chip-Input | `.easeInOut` (press) | `MotionButtonPress` |
| Button-VerticalList-Item | `.easeInOut` (selection) | `MotionSelectionTransition` |
| Progress-Pagination-Base | `.easeInOut` (selection) | `MotionSelectionTransition` |
| Nav-TabBar-Base | `.easeIn`/`.easeOut` (tab switch) | `MotionSelectionTransition` |
| Container-Card-Base | Already fixed (091) | `MotionFocusTransition` ✅ |

All 8 remaining files have matching semantic motion tokens. No new tokens needed.

### Ada Input Needed

Confirm the `.timingCurve()` pattern is the right SwiftUI consumption API for raw easing tokens. The generated `Animation` objects may already handle this — need to verify what `DesignTokens.Easing.easingStandard` actually is in the generated Swift output.

---

## Issue 2: Button-CTA Android Config Types

### Current State

```kotlin
data class ButtonCTASizeConfig(
    val fontSize: Int,        // should be Sp
    val lineHeight: Int,      // should be Sp
    val iconSize: Int,        // should be Dp
    val paddingHorizontal: Int, // should be Dp
    val paddingVertical: Int,   // should be Dp
    val minWidth: Int,          // hard-coded 56/72/80
    val touchTargetHeight: Int, // hard-coded 48/56
    val borderRadius: Int,      // should be Dp
)
```

Values extracted from tokens via `.toInt()`, then converted back with `.dp`/`.sp` at usage sites.

### Fix

Change config to use proper Compose types:
```kotlin
data class ButtonCTASizeConfig(
    val fontSize: TextUnit,
    val lineHeight: TextUnit,
    val iconSize: Dp,
    val paddingHorizontal: Dp,
    val paddingVertical: Dp,
    val minWidth: Dp,
    val touchTargetHeight: Dp,
    val borderRadius: Dp,
)
```

Reference tokens directly — no `.toInt()` round-trip. `minWidth` and `touchTargetHeight` derive from sizing/accessibility tokens.

**Token dependency**: `size900` (72, base × 9) needed for Button-CTA medium `minWidth`. Ada to add to `SizingTokens.ts` — same pattern as `size250` addition in Spec 092.

---

## Issue 3: Button-VerticalList-Item Press Overlay

### Current State
```kotlin
Color.black.opacity(configuration.isPressed ? 0.1 : 0)
```

### Fix
```kotlin
if (configuration.isPressed) pressedBlend() else Color.Transparent
```

Consistent with Button-CTA and other components using blend utilities.

---

## Issue 5: Progress-Node-Base Material Checkmark

### Current State
```kotlin
Icon(Icons.Filled.Check, ...)  // Material dependency
```

### Fix
```kotlin
IconBase(name = "check", size = iconSize, color = iconColor)
```

Removes Material Icons dependency, uses DesignerPunk's icon system.

---

## Issue 6: Ripple vs Blend — Design Decision

Button-Icon uses Material ripple (`rememberRipple`). Button-CTA uses blend utilities (`pressedBlend()`). Both are valid interaction feedback patterns.

**Recommendation**: Document as a deliberate distinction:
- **Ripple**: Used for icon-only buttons where the circular ripple provides clear spatial feedback
- **Blend**: Used for shaped buttons (CTA, cards) where the entire surface darkens

This isn't an inconsistency — it's a design choice. Add to the Button family doc's Cross-Platform Notes.

---

## Issue 7: LocalDesignTokens Pattern

`Button-VerticalList-Item` accesses tokens via `LocalDesignTokens.current` — a CompositionLocal provider. No other component uses this. 

**Recommendation**: Remove. Replace with direct `DesignTokens.*` references like every other component. The CompositionLocal adds complexity without benefit — DesignerPunk tokens don't change at runtime within a composition tree.

---

## Effort Estimate

| Category | Items | Effort |
|----------|-------|--------|
| iOS easing (P1) | 9 files | 1 day |
| Android fixes (CTA config, press overlay, checkmark, easing, reduced motion, LocalDesignTokens) | 5 files | 1 day |
| Documentation (ripple vs blend) | 1 doc update | 30 min |

**Total: ~2 days focused work.** This is a cleanup spec, not an architecture spec. No new components, no new tokens, no new patterns — just aligning existing code with established patterns.

---

## Answers to Thurgood's Scope Questions

1. **Fixes vs design decisions**: Issues 1-5, 7 are fixes. Issue 6 (ripple vs blend) is a design decision to document. Issues 8-10 are deferred architectural concerns.

2. **P1 easing incremental?**: Yes. Each file independent. Semantic motion tokens mapped per file (see table above).

3. **LocalDesignTokens pattern**: Remove. It's an outlier with no benefit.

4. **Estimated effort**: ~2 days. Focused cleanup, not multi-week architecture work.

---

## Tracking Confirmation (Data F4 / Kenya F3)

The two blocking component bugs flagged by Data and Kenya are **already fixed in Spec 091**:
- Button-VerticalList-Set `error()` crash → fixed in Task 3.2 (stateDescription + liveRegion)
- Input-Text-Base `Void → Unit` → fixed in Task 3.4

These are component-specific bugs, not systemic patterns — correctly out of scope for this spec.
