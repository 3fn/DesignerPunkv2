# Task 3.9 Review: ProgressIndicator Family — Android

**Date**: 2026-04-03
**Reviewer**: Data
**Components**: Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base, Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed

---

## Progress-Indicator-Node-Base

**Solid primitive. Reduced motion handled, state-based colors token-driven.**

#### Strengths
- Reduced motion via `TRANSITION_ANIMATION_SCALE` with `snap()` fallback
- `animateDpAsState` for size emphasis (+4dp on current) — smooth, token-driven
- `clearAndSetSemantics {}` — correctly decorative, semantic variants handle a11y
- State-based colors from `color.progress.*` tokens — correct family
- Content logic: sm always dot, md/lg support checkmark/icon — per contract
- `CircleShape` clipping — correct

#### Concerns

**C1: Uses `Icons.Filled.Check` (Material) instead of `IconBase("check")` for checkmark — NON-BLOCKING.**
The component uses `IconBase` for custom icons but Material `Icon` with `Icons.Filled.Check` for the checkmark. Should use `IconBase(name = "check")` for consistency with the rest of the design system.

**C2: `ProgressNodeSize.base` returns `Float` from spacing tokens, then `.dp` is applied — verify.**
`DesignTokens.space_150` etc. are `Dp` values. The `base` property returns `Float` (via implicit conversion?), then `baseDp` applies `.dp`. If `space_150` is `Dp`, this is the same `.dp` on `Dp` pattern. Needs verification.

**C3: Imports `motionDurationFast`, `motionDurationNormal`, `motionEasingStandard` — non-standard path.**
These are imported from `com.designerpunk.tokens` but aren't in the generated `DesignTokens` object. Must be extension properties or separate constants. Dependency chain is opaque.

---

## Progress-Indicator-Connector-Base

**Minimal, correct. Nothing to flag.**

#### Strengths
- `clearAndSetSemantics {}` — correctly decorative
- `connectorThickness` from `DesignTokens.border_width_100` — token-driven
- State-based color from `color.progress.*.connector` tokens — correct
- Simple `Box` with `fillMaxWidth().height().background()` — no Material dependency

No concerns. Ship-ready.

---

## Progress-Indicator-Label-Base

**Functional but has the hard-coded font size from Phase 1.**

#### Concerns

**C4: `labelFontSize = 14.sp` hard-coded — BLOCKING (carried from Phase 1 iOS finding).**
Should reference `DesignTokens.font_size_075` (which is 14). The value is correct but not token-driven. The comment says "typography.labelSm → fontSize075" but the code uses a literal.

---

## Progress-Pagination-Base

**Well-engineered. LazyRow with scroll centering is the right Android approach.**

#### Strengths
- `LazyRow` with `animateScrollToItem` for centering current dot — idiomatic Compose for scrollable lists
- Reduced motion: `scrollToItem` (instant) vs `animateScrollToItem` (animated) — correct
- Validation: max 50 items with debug throw / release log — appropriate
- `contentDescription` with "Page X of Y" — good accessibility
- Viewport width calculated from token-driven stride + gap + padding — precise
- Composes `ProgressIndicatorNodeBase` — correct Stemma pattern

No concerns. Ship-ready.

---

## Progress-Stepper-Base

**Clean orchestration. State derivation and connector logic correct.**

#### Strengths
- `require(size != SM)` — fail-loudly for unsupported size
- State derivation priority (error > completed > current > incomplete) — correct per contract
- Connector state derived from adjacent node states — correct
- `progressBarRangeInfo` for TalkBack — correct semantics for stepper progress
- `contentDescription` with "Step X of Y" — good accessibility
- Validation: max 8 steps with debug throw / release log — appropriate
- `Arrangement.spacedBy(stepperGap(size))` — token-driven spacing

No concerns. Ship-ready.

---

## Progress-Stepper-Detailed

**Extends Stepper-Base pattern with labels. CollectionInfo for TalkBack is excellent.**

#### Strengths
- `CollectionInfo` + `CollectionItemInfo` for TalkBack — enables "item X of Y" navigation, best accessibility pattern for steppers
- Step-level `contentDescription` with state, label, and optional/error context — thorough
- Composes Node-Base, Connector-Base, and Label-Base — correct Stemma composition
- Icon precedence (completed = checkmark always, user icon for others) — per contract

No concerns. Ship-ready.

---

## Summary

| Component | Blocking | Non-Blocking | Production Quality |
|-----------|----------|-------------|-------------------|
| Node-Base | 0 | 3 (C1-C3) | Solid. Material checkmark and token path concerns minor. |
| Connector-Base | 0 | 0 | Ship-ready. Minimal and correct. |
| Label-Base | 1 (C4) | 0 | Hard-coded font size needs token reference. |
| Pagination-Base | 0 | 0 | Ship-ready. Well-engineered. |
| Stepper-Base | 0 | 0 | Ship-ready. Clean orchestration. |
| Stepper-Detailed | 0 | 0 | Ship-ready. Best TalkBack accessibility in the family. |

**1 blocking issue:** Label-Base hard-coded `14.sp` → should reference `DesignTokens.font_size_075`.

**Ship readiness:** 5 of 6 are ship-ready. Label-Base needs the one-line font size fix.
