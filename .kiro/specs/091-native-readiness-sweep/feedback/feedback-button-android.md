# Task 3.2 Review: Button Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Button-CTA, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set

---

## Fix Verification

### Button-VerticalList-Set
| Issue | Status | Notes |
|-------|--------|-------|
| `.dp` on already-Dp token (`space_grouped_normal.dp`) | ✅ Fixed | Now uses `DesignTokens.space_grouped_normal` directly (line 539) |

---

## Production-Quality Assessment

### Button-CTA

**Solid implementation. Token usage is thorough but has a type-safety concern.**

#### Strengths
- All three size configs reference `DesignTokens.*` for spacing, radius, font, icon sizes, and touch targets
- Blend utilities for hover/pressed/disabled states — cross-platform consistent
- `interactionSource` properly remembered, pressed state tracked via `collectIsPressedAsState()`
- Loading and disabled states handled per contract
- Icon composition via `IconBase` with decorative semantics

#### Concerns

**C1: `.toInt()` on Dp token values throughout `getButtonCTASizeConfig()`.**
`DesignTokens.space_inset_200.toInt()`, `DesignTokens.radius_100.toInt()`, etc. The spacing/radius tokens are `Dp` values. Calling `.toInt()` on a `Dp` extracts the raw numeric value, which is then used as `Int` in the config and later converted back with `.dp`. This round-trip works but is fragile — if Compose ever changes `Dp.toInt()` behavior, or if a token resolves to a non-integer Dp (e.g., 10.5.dp), the truncation would silently lose precision. The config should use `Dp` types directly, like Button-Icon does.

**C2: Hard-coded `minWidth` values (56, 72, 80).**
These aren't token-referenced. If they're spec-defined constants, they should at minimum be named constants with comments explaining the derivation. Currently they're magic numbers.

**C3: Hard-coded `touchTargetHeight = 48` for medium and large.**
Small correctly references `DesignTokens.tap_area_minimum.toInt()`, but medium uses `48` and large uses `56` as raw integers. Medium should reference `tapAreaRecommended` and large should derive from the height.

**C4: Typography constructed inline instead of referencing semantic tokens.**
Each size config builds a `TextStyle(fontSize = ..., fontWeight = ..., lineHeight = ...)` manually. The generated `DesignTokens` has `typography_button_md` and `typography_button_lg` composites. Using those would be more maintainable and consistent.

### Button-Icon

**Clean, well-structured. The strongest implementation in this family.**

#### Strengths
- Token usage is excellent — `DesignTokens.icon_size_*`, `ButtonIconTokens.inset*`, `accessibility_focus_offset/width`, `tap_area_recommended` all referenced correctly
- `CircleShape` for circular button — idiomatic Compose
- Focus buffer calculated from accessibility tokens, not hard-coded
- `contentDescription` from required `ariaLabel` — contract satisfied
- Icon marked decorative via `IconBase(contentDescription = null)`
- Variant-specific colors all reference `DesignTokens.color_*`

#### Concerns

**C5: Uses Material ripple (`rememberRipple`) while Button-CTA uses `indication = null`.**
Inconsistent interaction feedback pattern within the same family. Button-CTA uses blend utilities for press feedback, Button-Icon uses Material ripple. Both work, but a consumer building a screen with both components gets different press feedback styles. This is a cross-platform consistency question — worth flagging to Leonardo.

**C6: `border_border_default` token name.**
Line 301: `DesignTokens.border_border_default`. The double "border" suggests either a naming issue in the generated tokens or a wrong reference. Should verify this resolves to `borderDefault` (1dp).

### Button-VerticalList-Item

**Feature-rich, well-documented, but has a significant architectural issue.**

#### Strengths
- Comprehensive visual state system (rest, selected, notSelected, checked, unchecked) with animated transitions
- Padding compensation for height stability (48dp constant) — clever approach
- Focus tracking via `LaunchedEffect(isFocused)` with proper previous-state comparison — avoids redundant callbacks
- `clearAndSetSemantics {}` on checkmark — correctly decorative
- `stateDescription` for TalkBack selection state — good accessibility
- RTL handled automatically via Compose layout direction

#### Concerns

**C7: Duplicate `IconBase` composable defined locally.**
Lines ~570-600 define a local `IconBase` placeholder that shadows the real `IconBase` from `com.designerpunk.components.core`. This means the component might be using the placeholder (which renders an empty `Box`) instead of the real icon component. This is a **blocking** issue if the import doesn't take precedence — the component would render invisible icons.

**C8: `tween()` without explicit easing on color/dimension animations.**
Multiple `tween(durationMillis = tokens.motionSelectionTransitionDuration)` calls without `easing =`. Same pattern flagged in Phase 0. Duration is token-driven but easing defaults to Material's `FastOutSlowInEasing` instead of referencing `DesignTokens.Easing.EasingStandard`.

**C9: `LocalDesignTokens.current` pattern not seen elsewhere.**
The component accesses tokens via `val tokens = LocalDesignTokens.current` — a CompositionLocal provider. No other Android component uses this pattern; they reference `DesignTokens.*` directly. Either this is a newer pattern that should be adopted everywhere, or it's an outlier. If `LocalDesignTokens` isn't provided in the composition tree, this would crash at runtime.

### Button-VerticalList-Set

**Well-structured state coordination. Accessibility is thorough.**

#### Strengths
- Mode-driven ARIA roles: `Role.Button` for tap, `Role.RadioButton` for select, `Role.Checkbox` for multiSelect — correct per contract
- `CollectionInfo` for TalkBack navigation in select/multiSelect modes — good Android-specific accessibility
- `LiveRegionMode.Assertive` on error message — immediate TalkBack announcement
- Visual state derivation and transition delay calculation delegated to pure functions — testable
- Controlled component pattern with proper state coordination across children

#### Concerns

**C10: `error("Invalid selection")` inside `semantics {}` block.**
Line ~510: `if (error) { error("Invalid selection") }`. The `error()` function inside a `semantics` block throws an `IllegalStateException`, not sets an ARIA error state. This is a **blocking** bug — when `error = true`, the component crashes instead of marking the field as invalid. Should use a semantics property like `error` or `contentDescription` to communicate the error state.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Button-CTA | 0 | 4 (C1-C4) | Good. Type-safety and hard-coded values are tech debt. |
| Button-Icon | 0 | 2 (C5-C6) | Strongest in the family. Minor consistency concern. |
| Button-VerticalList-Item | 1 (C7) | 2 (C8-C9) | Feature-rich but shadow IconBase is potentially breaking. |
| Button-VerticalList-Set | 1 (C10) | 0 | Good architecture. `error()` crash is a serious bug. |

**Blocking issues (2):**
1. **C7**: Duplicate `IconBase` in VerticalList-Item may shadow the real component — invisible icons
2. **C10**: `error()` in semantics block crashes the app when `error = true`

**Ship readiness:** Button-CTA and Button-Icon are ready. VerticalList-Item and VerticalList-Set need the two blocking issues resolved first — both are straightforward fixes but have real runtime impact.
