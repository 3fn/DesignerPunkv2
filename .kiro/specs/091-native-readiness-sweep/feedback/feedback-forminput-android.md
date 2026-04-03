# Task 3.4 Review: FormInput Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Input-Text-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set

---

## Input-Text-Base

**Well-implemented float label pattern. Reduced motion handled correctly. One type concern.**

#### Strengths
- Float label animation with `animateFloatAsState`/`animateDpAsState`/`animateColorAsState` — smooth, token-driven
- Reduced motion via `TRANSITION_ANIMATION_SCALE` with `snap()` fallback — correct
- `tween` uses explicit `easingStandard` — follows the gold standard pattern
- `BasicTextField` instead of Material `TextField` — avoids Material theme interference, correct for a design system
- Focus tracking with `onFocusChanged` and proper `onFocus`/`onBlur` callbacks
- Trailing icon priority (error > success > info) with opacity animation after label completes
- `semantics { error(errorMessage) }` — correct Compose pattern for error state accessibility

#### Concerns

**C1: `onValueChange` return type is `Void` (Java) not `Unit` (Kotlin) — BLOCKING.**
```kotlin
onValueChange: (String) -> Void,
```
Should be `(String) -> Unit`. `Void` is Java's `java.lang.Void` — this would require the callback to return `null` explicitly. Either this doesn't compile, or it works by accident because Kotlin's type inference handles it. Either way, it's wrong.

**C2: Token references use unqualified names.**
`motionFloatLabelDuration`, `easingStandard`, `typographyLabelMdFontSize`, `colorFeedbackErrorText`, `radius150`, `borderDefault`, `tapAreaRecommended`, etc. are referenced without `DesignTokens.` prefix. Same pattern as Container-Base — must be defined elsewhere in scope. Dependency chain is opaque but presumably works.

**C3: Uses `TRANSITION_ANIMATION_SCALE` instead of `ANIMATOR_DURATION_SCALE`.**
Other components (Progress-Bar-Base, Nav-TabBar-Base, Nav-SegmentedChoice-Base) check `ANIMATOR_DURATION_SCALE`. Input-Text-Base checks `TRANSITION_ANIMATION_SCALE`. Both are valid Android settings, but they control different things — `ANIMATOR_DURATION_SCALE` affects `ObjectAnimator`/Compose animations, `TRANSITION_ANIMATION_SCALE` affects window transitions. For Compose animations, `ANIMATOR_DURATION_SCALE` is the correct one. Non-blocking since both are typically set together by the user, but inconsistent with the rest of the codebase.

---

## Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber

**Thin semantic wrappers. Correctly delegate to Input-Text-Base.**

#### Strengths
- Email: RFC 5322 regex validation, email keyboard type, autofill support
- Password: Visibility toggle with `contentDescription` for show/hide state, secure masking, strength validation
- PhoneNumber: Country-specific formatting, international support, phone keyboard type
- All three compose Input-Text-Base — no duplicated rendering logic

#### Concerns

**C4: Password toggle uses Material `Icons.Filled.Visibility` — NON-BLOCKING.**
Should use `IconBase` with DesignerPunk icon names for consistency. Material icons introduce a dependency on `material-icons-extended`. Minor — the toggle works correctly and has proper accessibility labels.

No blocking issues in the semantic variants. They inherit Input-Text-Base's concerns (C1-C3).

---

## Input-Checkbox-Base

**Thorough implementation. Token architecture is exemplary.**

#### Strengths
- `CheckboxTokens` object with `get()` accessors for color tokens — ensures fresh values if tokens change at runtime (theme switching). Best token pattern in the codebase.
- `CheckboxSize` enum with computed properties (`iconSize`, `inset`, `boxSize`, `gap`, `radius`, `labelFontSize`) — all token-driven. Clean API.
- `ToggleableState` semantics for TalkBack — correct Compose pattern for checkbox (On/Off/Indeterminate)
- `clearAndSetSemantics` on helper/error text with prefixed `contentDescription` — good accessibility
- `mergeDescendants = true` on the clickable row — TalkBack treats the entire row as one element
- `LabelTypography` override for Legal checkbox pattern — good extensibility
- Padding compensation for height stability across border width changes — thoughtful

#### Concerns

**C5: `tween()` without explicit easing — NON-BLOCKING.**
Two `animateColorAsState` calls use `tween(durationMillis = CheckboxTokens.animationDuration)` without `easing =`. Duration is token-driven but easing defaults to Material's standard. Should reference `DesignTokens.Easing.EasingStandard`. (Phase 0 Pattern 3)

**C6: No reduced motion check — NON-BLOCKING.**
No `ANIMATOR_DURATION_SCALE` check. Animations will run regardless of reduced motion setting. The animations are subtle (color transitions), so the impact is low, but the contract `accessibility_reduced_motion` isn't explicitly satisfied for this component. Other form inputs (Input-Text-Base) do check.

---

## Input-Checkbox-Legal

**Clean wrapper. Correctly delegates to Input-Checkbox-Base with fixed configuration.**

#### Strengths
- Wrapper pattern with fixed `size = Large`, `labelTypography = Small`, `labelAlign = Top` — correct per spec
- Audit trail support (timestamp, legalTextId, version) — good for compliance
- Pre-check prevention via `LaunchedEffect` — enforces explicit consent
- `clearAndSetSemantics` with "Required field" for required state

No concerns. Inherits Checkbox-Base's quality.

---

## Input-Radio-Base

**Mirrors Checkbox-Base's quality. Consistent patterns across the selection family.**

#### Strengths
- `RadioTokens` object mirrors `CheckboxTokens` pattern — consistent architecture
- `RadioSize` enum with computed properties — same clean pattern as `CheckboxSize`
- `RadioCircle` extracted as private composable — good decomposition
- `AnimatedVisibility` with `scaleIn`/`scaleOut` for dot — smooth selection indicator
- `Role.RadioButton` with `selected` semantics — correct TalkBack pattern
- `mergeDescendants = true` — consistent with Checkbox-Base

#### Concerns

**C7: `tween()` without explicit easing — NON-BLOCKING.**
Three calls without `easing =`. Same as Checkbox-Base. (Phase 0 Pattern 3)

**C8: No reduced motion check — NON-BLOCKING.**
Same gap as Checkbox-Base. `scaleIn`/`scaleOut` animations will run regardless of reduced motion.

---

## Input-Radio-Set

**Good orchestration pattern. CompositionLocal for state coordination is idiomatic Compose.**

#### Strengths
- `CompositionLocalProvider` for passing `selectedValue`, `onSelectionChange`, and `size` to children — correct Compose pattern for parent-child coordination
- `selectableGroup()` semantics — TalkBack announces as a group of selectable items
- `LiveRegionMode.Assertive` on error message — immediate announcement
- Controlled component pattern with proper state management

No concerns beyond what Radio-Base inherits.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Input-Text-Base | 1 (C1) | 2 (C2-C3) | Strong float label. `Void` return type needs fix. |
| Input-Text-Email | 0 | 0 | Clean wrapper. Inherits Base concerns. |
| Input-Text-Password | 0 | 1 (C4) | Clean. Material icon dependency minor. |
| Input-Text-PhoneNumber | 0 | 0 | Clean wrapper. |
| Input-Checkbox-Base | 0 | 2 (C5-C6) | Exemplary token architecture. Missing easing/reduced motion. |
| Input-Checkbox-Legal | 0 | 0 | Clean wrapper. |
| Input-Radio-Base | 0 | 2 (C7-C8) | Mirrors Checkbox quality. Same easing/reduced motion gap. |
| Input-Radio-Set | 0 | 0 | Good orchestration. |

**Blocking issues (1):**
1. **C1**: `(String) -> Void` should be `(String) -> Unit` in Input-Text-Base

**Cross-family pattern:** Checkbox-Base and Radio-Base share the same two non-blocking gaps (missing easing, missing reduced motion). These could be batch-fixed together.

**Ship readiness:** All 8 components are ship-ready after the `Void` → `Unit` fix. The missing easing and reduced motion on Checkbox/Radio are non-blocking — the animations are subtle color/scale transitions that don't cause accessibility issues in practice.
