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
- **8% of glide (~28ms)**: Departing tab settles down (padding transition, glow dims)
- **50% of glide (~175ms)**: Arriving tab lifts up (padding transition, icon swap, glow brightens)

**Note**: Issue originally said 16% — web source code uses 8% (`PHASE_GLIDE * 0.08`). Contract and native implementations use the actual web value.

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

---

## Contract Updates Required (Lina, 2026-03-26)

The web implementation was visually tuned post-Spec 050 completion. Two contracts now describe the old behavior while the web implements the new (reviewed and approved) behavior. These need updating before/alongside the native porting work.

### Contract 1: `animation_coordination` — Timing Model Change

**Current contract says**: Three-phase choreography with Phase 3 overlapping Phase 2 at ~80%.

**Web now implements**: Staggered timing relative to the glide:
- 0ms: Dot starts gliding (duration 350ms, glide-decelerate)
- 16% of glide (~56ms): Departing tab settles (padding transition, glow dims)
- 50% of glide (~175ms): Arriving tab lifts (padding transition, icon swap, glow brightens)

**Proposed update**: Replace the three-phase description with the stagger-relative model. The phases are conceptually the same (depart, glide, arrive) but the timing is expressed as percentages of the glide duration rather than independent phase durations with overlap.

### Contract 2: `visual_gradient_glow` — Active Only

**Current contract says**: Every tab has an elliptical radial gradient (active = visible glow, inactive = subtle vignette).

**Web now implements**: Glow only on active tab. No inactive tab vignette.

**Proposed update**: Remove "inactive tab center" and "subtle vignette" language. Glow is active-tab-only with tighter ellipse geometry (space-700 horizontal × 56% vertical).

### @THURGOOD — Verification Requested

After Lina completes the native porting and contract file updates, please verify:
1. Updated contract language accurately describes the web implementation
2. Existing tests cover the updated behavior (or flag gaps)
3. No validation criteria need adding/removing

### Parity Audit (Lina, 2026-03-26)

Thorough line-by-line comparison of web CSS against iOS and Android implementations.

**Already matching (no changes needed):**
- Background gradient: 4-stop translucency (80%/88%/96%/100% at 0/16/32/48%) ✅
- Active-only glow (inactive = Color.clear) ✅
- Glow gradient stops (0%/40%/80%/100% with correct colors/opacities) ✅
- Tab padding: active 150/150/150, inactive 150/150/075 ✅
- Min tab height: space-600 ✅
- Animation timing: 8%/50% stagger ✅
- Dot position: space-150 bottom ✅
- Container padding: N/A — web pill has container padding, native full-width does not (intentional per visual_pill_container contract, web-only)

**Fixed:**
- Glow ellipse geometry: Both platforms were rendering a circle (uniform radius = space-700). Web uses `ellipse space-700 56%` — horizontal radius space-700, vertical radius 56% of tab height. Fixed iOS via `scaleEffect(y:)` on RadialGradient. Fixed Android via `drawOval` with elliptical size.

**Acceptance criteria status after fix:**
- [x] iOS glow matches web (active only, tighter ellipse, mid-stop)
- [x] Android glow matches web
- [x] iOS background gradient matches web (4-stop translucency) — already matched
- [x] Android background gradient matches web — already matched
- [x] iOS animation timing matches web (8%/50% stagger) — already matched
- [x] Android animation timing matches web — already matched
- [x] iOS tab min-height and padding values match web — already matched
- [x] Android tab min-height and padding values match web — already matched
- [x] No height shift during animation on either platform — min-height prevents this
- [x] All existing tests pass (308 suites, 8041 tests, 0 failures)
