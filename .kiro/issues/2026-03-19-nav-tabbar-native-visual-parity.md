# Issue: Nav-TabBar-Base iOS/Android Visual Parity with Web

**Date**: 2026-03-19
**Component**: Nav-TabBar-Base
**Spec**: 050
**Priority**: High
**Affects**: iOS, Android

---

## Summary

The web implementation of Nav-TabBar-Base was visually tuned during post-completion review. iOS and Android implementations need to be updated to match. Full-width anchored positioning remains unchanged on native — only visual styling and animation timing are affected.

---

## Changes to Port

### 1. Tab Bar Background Gradient
**Web reference** (`.tab-bar` in `NavTabBarBase.styles.css`):
- Replace solid `color.structure.canvas` background with a linear gradient
- Four stops: 80% → 88% → 96% → 100% opacity of `color.structure.canvas`
- Final stop at 48% vertical position (bottom half fully opaque)
- Native bars float over content, so translucency at the top edge is relevant

### 2. Active Tab Glow
**Web reference** (`.tab-item[aria-selected="true"]::before`):
- Glow only on active tab — remove inactive tab vignette
- Ellipse: `space-700` (56px) horizontal × 56% vertical
- Three color stops: accent 100% → accent 50% opacity → canvas 24% at 80% → transparent 100%
- iOS: Update `RadialGradient` parameters
- Android: Update `Brush.radialGradient` parameters

### 3. Tab Padding & Min-Height
- Inactive bottom padding: `space-inset-075` (6px)
- Active bottom padding: `space-inset-150` (12px)
- Inactive top padding: `space-inset-150` (12px)
- Active top padding: `space-inset-150` (12px)
- Tab min-height: `space-600` (48px) — prevents height shift during animation

### 4. Animation Timing
Replace the current three-phase choreography with:
- **0ms**: Dot starts gliding (duration 350ms, glide-decelerate easing)
- **16% of glide (~56ms)**: Departing tab settles down (padding transition, glow dims)
- **50% of glide (~175ms)**: Arriving tab lifts up (padding transition, icon swap, glow brightens)

### 5. Dot Position
Check current web dot `bottom` value and align native implementations.

---

## Platform Notes

### iOS
- Background gradient: `LinearGradient` in SwiftUI
- Glow: `RadialGradient` — update stops and ellipse geometry
- Animation: `withAnimation` with staggered `DispatchQueue.main.asyncAfter` or `Task.sleep` for 16%/50% timing
- Min-height: `.frame(minHeight:)` on tab items

### Android
- Background gradient: `Brush.linearGradient` in Compose
- Glow: `Brush.radialGradient` — update stops and radius
- Animation: Coroutine-based `Animatable` with `delay()` for 16%/50% timing
- Min-height: `Modifier.heightIn(min =)` on tab items

---

## Acceptance Criteria

- [ ] iOS glow matches web (active only, tighter ellipse, mid-stop)
- [ ] Android glow matches web
- [ ] iOS background gradient matches web (4-stop translucency)
- [ ] Android background gradient matches web
- [ ] iOS animation timing matches web (16%/50% stagger)
- [ ] Android animation timing matches web
- [ ] iOS tab min-height and padding values match web
- [ ] Android tab min-height and padding values match web
- [ ] No height shift during animation on either platform
- [ ] All existing tests pass

---

**Organization**: issue
**Scope**: 050-nav-tabbar-base
