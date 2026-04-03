# Task 3.1 Review: Container Family — iOS

**Date**: 2026-04-03
**Reviewer**: Kenya
**Components**: Container-Base, Container-Card-Base
**Status**: Complete

---

## Fix Verification

### Container-Base

| Issue | Status | Notes |
|-------|--------|-------|
| P3: Hard-coded focus color `Color(red:0.69...)` | ✅ Fixed | Now `Color(DesignTokens.accessibilityFocusColor)` |
| P7: Hard-coded focus offset/width `= 2` | ✅ Fixed | Now `DesignTokens.accessibilityFocusOffset` / `.accessibilityFocusWidth` |
| P4: Duplicated `View.if` extension | ❌ Not fixed | Still defined here. Card-Base removed its copy (comment says "defined in Container-Base"). Task 3.10 will extract to shared utility. |

### Container-Card-Base

| Issue | Status | Notes |
|-------|--------|-------|
| P7: ~14 hard-coded token constants | ✅ Fixed | All now reference `DesignTokens.*` |
| P3: Hard-coded focus color | ✅ Fixed | Now `Color(DesignTokens.accessibilityFocusColor)` |
| P2: Local motion constants | ✅ Fixed | Now `DesignTokens.MotionFocusTransition.duration` / `.easing` |
| P4: Duplicated `View.if` | ✅ Fixed | Removed, defers to Container-Base's definition |
| P7: Wrong shadow values | ✅ Fixed | Now `DesignTokens.shadowOpacityModerate`, `DesignTokens.blur075`, `DesignTokens.shadowOffsetX000`, `DesignTokens.shadowOffsetY100` |

---

## New Issues Found During Review

### C1: Container-Base token resolution functions are stubs — BLOCKING

The core token resolution functions return placeholder values:

```swift
func resolveContainerBaseColorToken(_ tokenName: String?) -> Color {
    return tokenName != nil ? Color.gray : Color.clear
}

func resolveContainerBaseShadowToken(_ tokenName: String?) -> ContainerBaseShadowProperties {
    return ContainerBaseShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
}

func resolveContainerBaseOpacityToken(_ tokenName: String?) -> Double {
    return 1.0
}
```

Every background renders as `Color.gray`. Every shadow renders as nothing. Every opacity is 1.0. This means Container-Base doesn't actually work as a visual component — it's structurally correct but visually broken.

Container-Card-Base works around this by resolving its own tokens through the curated enum pattern (`mapCardBackgroundToColor` → `colorSurfacePrimary` → `DesignTokens.colorStructureSurfacePrimary`). So cards render correctly. But any direct Container-Base usage with `background: "color.surface"` renders gray.

**Impact**: Container-Base is a primitive — product agents don't use it directly (Card-Base and future variants compose it). But the stubs mean the composition path through Container-Base's `resolvedBackground` string prop is broken. Card-Base bypasses this by passing the string and then the Base's `resolveContainerBaseColorToken` returns gray, but Card-Base's own `interactionOverlayColor` uses `mapCardBackgroundToColor` which works correctly.

Wait — re-reading the body: Card-Base passes `background: resolvedBackground` (a string like `"color.structure.surface.primary"`) to Container-Base, which calls `resolveContainerBaseColorToken` on it and gets... `Color.gray`. **Cards are rendering with gray backgrounds, not their intended surface colors.**

This is a blocking issue. Either the resolution functions need real implementations, or Container-Card-Base needs to bypass the string-based resolution entirely and pass a resolved `Color` directly.

### C2: String-based token resolution architecture is fragile — NON-BLOCKING (architectural concern)

Same issue Data flagged on Android (C1 in their review). Container-Base accepts `background: String?`, `shadow: String?`, `borderColor: String?`, `opacity: String?` as string token names and resolves them at runtime. Every other iOS component uses typed enums or direct `DesignTokens.*` references.

This is an outlier pattern. It works if the resolution functions are implemented, but it's a maintenance risk — any new token name requires updating the switch statement in the resolver. The curated enum pattern in Card-Base is the better architecture.

Not blocking because Card-Base (the only current consumer) works around it. But this should be addressed before any new Container-Base consumers are built.

### C3: `cornerRadius` modifier is deprecated in iOS 17+ — NON-BLOCKING

```swift
.cornerRadius(cornerRadiusValue)
```

`cornerRadius(_:)` is deprecated. The modern equivalent is `.clipShape(RoundedRectangle(cornerRadius:))`. Functionally identical, but Xcode will emit a deprecation warning. Since our minimum is iOS 17.0+, this should use the modern API.

### C4: Container-Base file has ~760 lines — NON-BLOCKING (maintainability)

Same concern Data raised on Android. The token mapping functions (`mapContainerBasePaddingToEdgeInsets`, `calculateDirectionalPadding`, `resolveContainerBaseBorderColor`, etc.) are ~200 lines that could live in a separate `ContainerBase+TokenMapping.swift` file. The view itself is clean — it's the supporting infrastructure that bloats the file.

### C5: `getContainerBaseBorderColor()` is dead code — NON-BLOCKING

```swift
func getContainerBaseBorderColor() -> Color {
    return Color.gray
}
```

Never called. `resolveContainerBaseBorderColor` handles border color resolution. Remove.

### C6: Container-Card-Base `cornerRadiusValue` referenced but not defined — POTENTIAL COMPILE ERROR

The `focusIndicatorOverlay` in Card-Base references `cornerRadiusValue`:
```swift
RoundedRectangle(cornerRadius: cornerRadiusValue)
```

But `cornerRadiusValue` is a computed property on `ContainerBase`, not `ContainerCardBase`. Card-Base doesn't define this property. This would be a compile error unless there's a `cornerRadiusValue` defined elsewhere in scope that I'm not seeing.

**Needs verification**: Either this compiles via an extension or implicit scope, or it's a bug introduced during the fix pass.

---

## Production-Quality Assessment

### Container-Base

**Structurally sound architecture, but the token resolution stubs make it non-functional as a standalone component.**

#### Strengths
- Padding override hierarchy (individual > axis > uniform) is correctly implemented and well-documented
- Directional padding maps logical properties (blockStart/inlineStart) to physical edges (top/leading) — correct for RTL
- Hover state via `hoverBlend()` from ThemeAwareBlendUtilities — clean, cross-platform consistent
- Focus indicator with accessibility tokens — correct WCAG 2.4.7 pattern
- `@FocusState` for keyboard navigation — idiomatic SwiftUI
- Generic `<Content: View>` with `@ViewBuilder` — correct pattern for a container primitive

#### Concerns
- C1 (stub resolvers) is the critical issue — backgrounds, shadows, and opacity don't resolve
- C2 (string-based architecture) is an outlier that no other component follows
- C4 (file size) makes navigation difficult

### Container-Card-Base

**Good architecture. Curated enum pattern is the right approach. Post-fix token references are correct.**

#### Strengths
- Curated enum subsets constrain the API to card-appropriate values — strong Stemma architecture
- Two-track composition (Card owns interaction, Base owns layout) is well-documented
- All token constants now reference `DesignTokens.*` — shadow values are correct post-fix
- Interactive state handling (hover, press) via blend utilities — correct
- Focus indicator with accessibility tokens — correct
- `DragGesture` for press detection — idiomatic SwiftUI (no UIKit patterns)
- Preview demonstrates multiple configurations — useful for visual verification

#### Concerns
- C1 inherited from Base — Card-Base may render gray backgrounds if Base's resolver is in the rendering path
- C6 potential compile error on `cornerRadiusValue`
- C3 deprecated `cornerRadius` modifier (inherited from Base composition)

---

## Summary

| Component | Fixes Verified | Remaining Blocking | New Issues | Production Quality |
|-----------|---------------|-------------------|------------|-------------------|
| Container-Base | 2/3 (View.if deferred to 3.10) | 1 (C1: stub resolvers) | 5 (C1-C5) | Not ready — stubs must be implemented |
| Container-Card-Base | 5/5 | 0 (pending C6 verification) | 1 (C6: cornerRadiusValue) | Ready with caveats — verify C6 compiles |

**Can we ship product screens using Container-Card-Base?** Yes, with caveats. The curated enum pattern bypasses the broken string resolution in Base. Cards will render correctly through their own token mapping. But C6 needs verification.

**Can we ship product screens using Container-Base directly?** No. The stub resolvers mean it renders gray backgrounds and no shadows. Product agents shouldn't use it directly (it's a primitive), but if any future variant composes it the same way Card-Base does (passing string token names), the same issue applies.

**Are these the quality bar we want?** Container-Card-Base post-fix is close. Container-Base needs the resolver stubs replaced with real implementations before it's production-quality infrastructure.
