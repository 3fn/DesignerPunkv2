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
