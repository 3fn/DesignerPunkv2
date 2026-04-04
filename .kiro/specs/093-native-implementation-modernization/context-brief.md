# Spec 093: Native Implementation Modernization — Context Brief

**Date**: 2026-04-03
**Prepared by**: Thurgood
**For**: Lina (design outline author), Ada (easing token consultation)
**Origin**: Spec 091 cross-cutting issues — systemic patterns discovered during native readiness sweep

---

## Issues to Address

From `.kiro/specs/091-native-readiness-sweep/cross-cutting-issues.md`:

### 1. P1 Easing Pattern (iOS — systemic, 9+ files)

Hard-coded `.easeInOut`/`.easeIn`/`.easeOut` instead of token easing. Duration is token-driven, easing is SwiftUI built-in. Requires API pattern change: `DesignTokens.Easing.easingStandard.speed(1.0 / duration)` or equivalent.

**Ada's input needed**: How should SwiftUI consume easing tokens? The generated tokens provide `Animation` objects, but the common SwiftUI API (`.easeInOut(duration:)`) bakes in the curve. What's the recommended consumption pattern?

### 2. Button-CTA Android Config Types

- Config uses `Int` types with `.toInt()` round-trips on Dp tokens
- Hard-coded `minWidth` values (56, 72, 80)
- Hard-coded `touchTargetHeight = 48` for medium/large
- Inline typography construction instead of semantic token composites

### 3. Button-VerticalList-Item Mixed Patterns

- Hard-coded press overlay `Color.black.opacity(0.1)` instead of blend utility
- `tween()` without explicit easing
- `LocalDesignTokens.current` pattern outlier — standardize or document

### 4. Container-Card-Base Android Architecture

- Duplicated padding calculation between Card and Base
- `indication = null` disables ripple with no fallback visual feedback

### 5. Ripple vs Blend (Design Decision)

Button-Icon uses Material ripple, Button-CTA uses blend utilities. This may be a deliberate design decision, not an inconsistency. Needs clarification and documentation — either standardize on one approach or document when each is appropriate.

### 6. Progress-Indicator-Node-Base Android

- Material `Icons.Filled.Check` instead of `IconBase("check")` for checkmark
- Non-standard motion token import path

### 7. Checkbox/Radio Android

- Missing explicit easing on tween animations
- Missing reduced motion check (animations are subtle)

---

## Scope Questions for Lina

1. Which of these are fixes vs deliberate design decisions that need documentation?
2. Can the P1 easing pattern be addressed without touching every animation in every file, or is it all-or-nothing?
3. Is the `LocalDesignTokens.current` pattern in VerticalList-Item something to standardize across components or remove as an outlier?
4. Estimated effort — is this a multi-day spec or a focused cleanup?
