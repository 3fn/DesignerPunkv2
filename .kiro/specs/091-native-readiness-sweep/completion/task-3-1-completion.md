# Task 3.1 Completion: Container Family Fixes

**Date**: 2026-04-03
**Task**: 3.1 Container Family (Container-Base, Container-Card-Base)
**Type**: Implementation
**Status**: Complete — pending Kenya/Data review

---

## iOS Fixes

### Container-Base
- P3: Hard-coded accessibility focus color/width/offset → `DesignTokens.accessibilityFocus*` (3 fixes)
- P4: `View.if` kept as canonical location (Card-Base's duplicate removed)

### Container-Card-Base
- P7: All ~14 module-level constants replaced with `DesignTokens.*` references:
  - Spacing: `spaceInset050/100/150/200` → `DesignTokens.spaceInset*`
  - Radius: `radius100/200` → `DesignTokens.radius*`
  - Border: `borderDefault` → `DesignTokens.borderDefault`
  - Colors: `colorBorder`/`colorBorderSubtle` → `DesignTokens.colorStructureBorder*` (was `UIColor.separator`)
  - Shadow: corrected values — `opacity(0.1)` → `shadowOpacityModerate`, `radius: 8` → `blur075`, `y: 2` → `shadowOffsetY100`
- P3: Focus color → `DesignTokens.accessibilityFocusColor`
- P2: Motion constants → `DesignTokens.MotionFocusTransition.duration/easing`
- P4: Duplicated `View.if` removed

### Progress-Indicator-Label-Base (bonus)
- P7: `labelFontSize: 14` → `DesignTokens.typographyLabelSm.fontSize`

## Android Fixes

### Container-Base
- Hard-coded radius `4f/8f/16f` → `DesignTokens.radius050/100/200`
- Hard-coded focus color `0xFFB026FF` → `DesignTokens.accessibilityFocusColor`

### Container-Card-Base
- Hard-coded radius `8f/16f` → `DesignTokens.radius100/200`

## Round 2: Kenya/Data Full Production-Quality Review Fixes

### Container-Base iOS (Kenya C1, C2, C3, C5)
- C1 (BLOCKING): Refactored from String? → typed values (Color?, ContainerBaseShadowProperties?, Double). Deleted 5 string-based resolver stubs that returned Color.gray/zero. Cards now render correct colors.
- C2: String-based architecture eliminated — consistent with all other Stemma components
- C3: Deprecated `.cornerRadius()` → `.clipShape(RoundedRectangle())`
- C5: Dead `getContainerBaseBorderColor()` removed (already gone in refactor)

### Container-Card-Base iOS (Kenya C6)
- C6: `cornerRadiusValue` (private on Base) → `mapCardBorderRadiusToCornerRadius(borderRadius)` in focus overlay

### Container-Base Android (Data F1)
- F1: Stale "purple300" comment updated

### Container-Card-Base Android (Data F2/C5, C7)
- F2/C5: `CardRole.Link → Role.Button` documented with TODO (Compose lacks Role.Link)
- C7: Interaction overlay clipped to card border radius via `.clip(RoundedCornerShape())`
