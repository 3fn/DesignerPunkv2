# Requirements Document: Native Implementation Modernization

**Date**: 2026-04-03
**Spec**: 093 - Native Implementation Modernization
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

Spec 091's native readiness sweep discovered systemic patterns across iOS and Android implementations: hard-coded easing instead of token easing, Int-based config types instead of Compose types, inconsistent press feedback patterns, and outlier token access patterns. This spec modernizes all affected implementations to match established DesignerPunk patterns.

---

## Requirements

### Requirement 1: iOS Easing Token Modernization

**User Story**: As a component system maintainer, I want all iOS animations to use semantic motion tokens, so that easing behavior is token-driven and consistent across components.

#### Acceptance Criteria

1. All 8 remaining iOS files with hard-coded easing SHALL be updated to use semantic motion tokens:

   | File | Current | Token |
   |------|---------|-------|
   | Input-Checkbox-Base | `.easeOut`, `.easeInOut` | `MotionButtonPress`, `MotionSelectionTransition` |
   | Input-Radio-Base | `.easeOut`, `.easeInOut` | `MotionButtonPress`, `MotionSelectionTransition` |
   | Chip-Base | `.easeInOut` | `MotionButtonPress` |
   | Chip-Filter | `.easeInOut` | `MotionButtonPress` |
   | Chip-Input | `.easeInOut` | `MotionButtonPress` |
   | Button-VerticalList-Item | `.easeInOut` | `MotionSelectionTransition` |
   | Progress-Pagination-Base | `.easeInOut` | `MotionSelectionTransition` |
   | Nav-TabBar-Base | `.easeIn`, `.easeOut` | `MotionSelectionTransition` |

2. All animations SHALL use `withAnimation(DesignTokens.Motion*.easing)` — no `.speed()` fallback, no raw easing + duration combinations
3. WHEN no semantic motion token matches an animation's purpose THEN a new semantic motion token SHALL be created — not a raw easing fallback
4. Zero visual change is NOT a constraint — easing curves will change from symmetric (`.easeInOut`) to asymmetric (`easingStandard`). This is an intentional correction to match design intent.

### Requirement 2: Button-CTA Android Config Modernization

**User Story**: As a platform engineer, I want Button-CTA's config to use proper Compose types, so that token values flow through without lossy round-trips.

#### Acceptance Criteria

1. `ButtonCTASizeConfig` SHALL use Compose types: `Dp` for dimensions, `TextUnit` for typography, not `Int`
2. All `.toInt()` round-trips SHALL be eliminated — tokens referenced directly
3. `minWidth` values SHALL reference sizing tokens: `size700` (56), `size900` (72), `size1000` (80)
4. `touchTargetHeight` SHALL reference `size600` (48) and `size700` (56)
5. A `size900` token (base × 9 = 72) SHALL be added to `SizingTokens.ts`

### Requirement 3: Button-VerticalList-Item Press Feedback

**User Story**: As a component system maintainer, I want VerticalList-Item to use blend utilities for press feedback, so that interaction patterns are consistent across the Button family.

#### Acceptance Criteria

1. Hard-coded press overlay (`Color.black.opacity(0.1)`) SHALL be replaced with blend utility (`pressedBlend()`)
2. `tween()` animations SHALL use explicit easing token references
3. `LocalDesignTokens.current` pattern SHALL be removed — replaced with direct `DesignTokens.*` references

### Requirement 4: Checkbox/Radio Android Animation

**User Story**: As a platform engineer, I want Checkbox and Radio animations to use explicit easing and respect reduced motion, so that animation behavior is consistent and accessible.

#### Acceptance Criteria

1. `tween()` animations in Input-Checkbox-Base and Input-Radio-Base SHALL use explicit easing references
2. Both components SHALL check for reduced motion and disable animations when enabled

### Requirement 5: Progress-Node-Base Android Checkmark

**User Story**: As a component system maintainer, I want Progress-Node to use DesignerPunk's icon system instead of Material Icons, so that the component has no Material dependency.

#### Acceptance Criteria

1. `Icons.Filled.Check` SHALL be replaced with `IconBase("check")`
2. Material Icons import SHALL be removed

### Requirement 6: Design Decision Documentation

**User Story**: As any agent, I want the ripple vs blend design decision documented, so that future reviewers understand it's deliberate, not an inconsistency.

#### Acceptance Criteria

1. The Button family doc (`Component-Family-Button.md`) SHALL document the ripple vs blend distinction in Cross-Platform Notes:
   - Ripple: icon-only buttons (circular spatial feedback)
   - Blend: shaped buttons and surfaces (uniform darkening)
2. This is a platform-appropriate design choice, not an inconsistency to fix

### Documentation Requirements Waiver

This spec modernizes existing implementations. No new components or tokens (except `size900`). Standard component documentation requirements are not applicable.
