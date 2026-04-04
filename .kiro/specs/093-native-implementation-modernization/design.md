# Design Document: Native Implementation Modernization

**Date**: 2026-04-03
**Spec**: 093 - Native Implementation Modernization
**Status**: Design Phase
**Dependencies**: None (Ada creates `size900` as part of this spec)

---

## Overview

Modernize systemic patterns across iOS (8 files) and Android (5 files) implementations discovered during Spec 091's native readiness sweep. Replace hard-coded easing with semantic motion tokens, modernize Button-CTA's config type system, standardize press feedback patterns, and document the ripple vs blend design decision.

---

## Architecture

No architectural changes. All fixes align existing code with established patterns — semantic motion tokens, Compose types, blend utilities, direct token references. The patterns already exist in newer components (Nav-Header-Page, Nav-SegmentedChoice-Base); this spec brings older components up to the same standard.

---

## Design Decisions

### Decision 1: Semantic Motion Tokens Only (No Fallbacks)

Every iOS animation uses a semantic motion token directly:

```swift
withAnimation(DesignTokens.MotionSelectionTransition.easing) { ... }
```

No `.speed()` modifier. No raw easing + duration combinations. If an animation doesn't have a matching semantic motion token, one is created — not a verbose workaround.

**Trade-off acknowledged**: Code changes from simple `.easeInOut(duration:)` to semantic token references. Token correctness over code simplicity — right call for a design system.

**Not zero visual change**: Easing curves change from symmetric (`.easeInOut`) to asymmetric (`easingStandard` = cubic-bezier 0.4, 0.0, 0.2, 1). This is an intentional correction to match design intent.

### Decision 2: Button-CTA Config Type Modernization

Replace `Int`-based config with proper Compose types:

```kotlin
// Before
data class ButtonCTASizeConfig(
    val fontSize: Int,           // lossy
    val minWidth: Int,           // hard-coded
    val touchTargetHeight: Int,  // hard-coded
    // ...
)

// After
data class ButtonCTASizeConfig(
    val fontSize: TextUnit,      // direct token
    val minWidth: Dp,            // sizing token
    val touchTargetHeight: Dp,   // sizing/accessibility token
    // ...
)
```

Token mapping for previously hard-coded values:

| Value | Token | Purpose |
|-------|-------|---------|
| 56dp | `size700` | Small minWidth |
| 72dp | `size900` (new) | Medium minWidth |
| 80dp | `size1000` | Large minWidth |
| 48dp | `size600` | Medium/large touchTargetHeight |
| 56dp | `size700` | Small touchTargetHeight |

### Decision 3: Blend Utility for Press Feedback

Button-VerticalList-Item's hard-coded press overlay:

```kotlin
// Before
Color.black.opacity(configuration.isPressed ? 0.1 : 0)

// After
if (configuration.isPressed) pressedBlend() else Color.Transparent
```

Consistent with Button-CTA and Container-Card-Base.

### Decision 4: Ripple vs Blend — Documented Design Choice

Not a fix — a documentation clarification:

- **Ripple** (`rememberRipple`): Icon-only buttons (Button-Icon). Circular spatial feedback matches the circular touch target.
- **Blend** (`pressedBlend()`): Shaped buttons and surfaces (Button-CTA, Container-Card-Base, Button-VerticalList-Item). Uniform darkening across the entire surface.

Platform note: iOS doesn't have ripple — SwiftUI uses scale transforms and color blends. The distinction is Android-specific.

### Decision 5: Remove LocalDesignTokens Outlier

Button-VerticalList-Item's `LocalDesignTokens.current` CompositionLocal pattern is removed. Replaced with direct `DesignTokens.*` references — consistent with every other component. The CompositionLocal adds complexity without benefit (tokens don't change at runtime within a composition tree).

---

## Components and Interfaces

### New Token

| Token | Formula | Value | Consumer |
|-------|---------|-------|----------|
| `size900` | base × 9 | 72 | Button-CTA medium minWidth |

Added to `SizingTokens.ts` by Ada. Single consumer, baseline grid aligned (8 × 9).

### Files Modified

**iOS (8 files — easing modernization):**

| File | Change |
|------|--------|
| `Input-Checkbox-Base/platforms/ios/*.ios.swift` | `.easeOut` → `MotionButtonPress`, `.easeInOut` → `MotionSelectionTransition` |
| `Input-Radio-Base/platforms/ios/*.ios.swift` | `.easeOut` → `MotionButtonPress`, `.easeInOut` → `MotionSelectionTransition` |
| `Chip-Base/platforms/ios/*.ios.swift` | `.easeInOut` → `MotionButtonPress` |
| `Chip-Filter/platforms/ios/*.ios.swift` | `.easeInOut` → `MotionButtonPress` |
| `Chip-Input/platforms/ios/*.ios.swift` | `.easeInOut` → `MotionButtonPress` |
| `Button-VerticalList-Item/platforms/ios/*.ios.swift` | `.easeInOut` → `MotionSelectionTransition` |
| `Progress-Pagination-Base/platforms/ios/*.ios.swift` | `.easeInOut` → `MotionSelectionTransition` |
| `Nav-TabBar-Base/platforms/ios/*.ios.swift` | `.easeIn`/`.easeOut` → `MotionSelectionTransition` |

**Android (5 files):**

| File | Change |
|------|--------|
| `Button-CTA/platforms/android/*.android.kt` | Config `Int` → `Dp`/`TextUnit`, hard-coded → tokens |
| `Button-VerticalList-Item/platforms/android/*.android.kt` | Press overlay → blend, tween easing, remove `LocalDesignTokens` |
| `Input-Checkbox-Base/platforms/android/*.android.kt` | Add explicit easing + reduced motion check |
| `Input-Radio-Base/platforms/android/*.android.kt` | Add explicit easing + reduced motion check |
| `Progress-Indicator-Node-Base/platforms/android/*.android.kt` | `Icons.Filled.Check` → `IconBase("check")` |

**Documentation (1 file):**

| File | Change |
|------|--------|
| `.kiro/steering/Component-Family-Button.md` | Add ripple vs blend design decision to Cross-Platform Notes |

**Token (1 file):**

| File | Change |
|------|--------|
| `src/tokens/SizingTokens.ts` | Add `size900` (base × 9 = 72) |

---

## Error Handling

No new error handling. All changes are pattern alignment — replacing one valid approach with the established DesignerPunk approach.

---

## Testing Strategy

| Test Category | What It Validates |
|--------------|-------------------|
| Existing component tests | All pass after easing/token changes (animations may behave slightly differently due to easing curve change) |
| Formula validation | `size900` value = base × 9 = 72 |
| Token compliance | No hard-coded easing in iOS files, no `Int` types in Button-CTA config |
| Reduced motion | Checkbox/Radio respect reduced motion setting |

---

## Correctness Properties

1. No iOS animation uses `.easeInOut`, `.easeIn`, or `.easeOut` — all use semantic motion tokens
2. No `.speed()` modifier appears in any iOS animation
3. Button-CTA config has zero `Int` types — all `Dp`, `TextUnit`, or `Sp`
4. No `.toInt()` appears in Button-CTA token consumption
5. Button-VerticalList-Item has no `LocalDesignTokens` references
6. Progress-Indicator-Node-Base has no Material Icons import
7. Input-Checkbox-Base and Input-Radio-Base check reduced motion before animating
