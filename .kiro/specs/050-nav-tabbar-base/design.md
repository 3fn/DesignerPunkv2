# Design Document: Nav-TabBar-Base

**Date**: March 18, 2026
**Spec**: 050 - Nav-TabBar-Base
**Status**: Design Phase
**Dependencies**:
- Spec 080 (Rosetta Mode Architecture) — Complete
- Spec 049 (Nav-SegmentedChoice-Base) — Complete (motion tokens, API pattern)

---

## Overview

Nav-TabBar-Base is a primary navigation primitive: icon-only tab items in a persistent bottom bar, with a dot indicator that glides between selections using a three-phase choreography. Radial glow gradients on all tabs provide active state prominence and inactive contrast protection. Build-time platform separation: floating pill on web, full-width anchored on native.

The component follows True Native architecture — unified TypeScript API, platform-native rendering (Web Component, SwiftUI View, Compose Composable). Mode (Day/Night) resolves through Spec 080's Level 2 semantic overrides, not component props.

---

## Architecture

### Component Hierarchy

```
Nav-TabBar-Base (Primitive)
├── Container (tablist)
│   ├── TabItem[] (tab)
│   │   ├── Icon (solid-fill active / outline-stroke inactive)
│   │   ├── IndicatorDot (active tab only — space050 × space050)
│   │   ├── GlowGradient (elliptical radial background on all tabs)
│   │   └── BadgeSlot (empty in v1 — composition slot for future Badge family)
```

Unlike Nav-SegmentedChoice-Base where the indicator is a separate sliding element, here the indicator dot is part of each tab item's layout. The dot glide animation moves a single dot element between tab positions.

### Props Interface

```typescript
interface TabBarProps {
  tabs: TabOption[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  testID?: string;
}

interface TabOption {
  value: string;
  icon: IconBaseName;
  activeIcon: IconBaseName;       // solid-fill variant
  accessibilityLabel: string;     // required — icon-only, no visible text
}
```

`icon` is the outline-stroke variant (inactive state). `activeIcon` is the solid-fill variant (active state). Both are required — the icon swap between outline↔solid is a snap transition, not a visual effect applied to a single icon.

Badge composition slot is a platform-level concern — Web Component named slot, SwiftUI ViewBuilder, Compose content lambda. Not represented in the TypeScript props interface.

### State Management

- **Selection**: Controlled via `selectedValue` + `onSelectionChange` (no internal state)
- **Focus**: Internal state tracking which tab has keyboard focus (web only)
- **Pressed**: Internal state tracking which inactive tab is being pressed (for `blend.pressedLighter` feedback)
- **Indicator dot position**: Derived from `selectedValue` — animated between tab centers on change
- **Glow intensity**: Per-tab animated value — dims on departing tab, brightens on arriving tab during selection change
- **Chrome offset**: Web only — `--chrome-offset` CSS custom property updated via Visual Viewport API

---

## Components and Interfaces

### Container

| Property | iOS / Android | Web (mobile + desktop) | Token |
|----------|--------------|----------------------|-------|
| Background | `color.structure.canvas` | `color.structure.canvas` | Level 2 dark override → `gray400` |
| Top stroke | `color.structure.border.subtle` | `color.structure.border.subtle` | Level 2 composite dark override |
| Width | Full-width | Pill (inline margins `space200`) | — |
| Border radius | — | `radiusFull` | Pill shape |
| Backdrop blur | — | Yes | Platform CSS |
| Position | Anchored to bottom, OS safe area | Floating above chrome | — |
| Padding | None (tabs fill content area) | `space.inset.050` / `space.inset.100` / `space.inset.150` / `space.inset.100` (T/R/B/L) | — |
| Tab distribution | Equal-width, no gaps | Equal-width, no gaps | `flex: 1` equivalent |

### Tab Item

| Property | Active | Inactive | Token |
|----------|--------|----------|-------|
| Padding top | `space.inset.150` | `space.inset.200` | Delta = icon lift |
| Padding inline | `space.inset.150` | `space.inset.150` | Same both states |
| Padding bottom | `space.inset.050` | `space.inset.100` | Active accommodates dot |
| Item spacing | `space.grouped.minimal` | 0 | Between icon and dot |
| Icon | Solid-fill, `color.action.navigation` | Outline-stroke, `color.icon.navigation.inactive` | Level 2 dark overrides |
| Indicator dot | `space050` × `space050`, `color.action.navigation` | Not rendered | — |
| Glow gradient | Accent center (prominent) | Canvas center (subtle vignette) | See § Glow Gradient |
| Min tappable width | `tapAreaMinimum` | `tapAreaMinimum` | Floor only — actual width exceeds |

### Tab Item States

| State | Visual | Behavior |
|-------|--------|----------|
| Active | Solid icon, dot, prominent glow | No pressed state (tap is no-op) |
| Inactive | Outline icon, no dot, subtle vignette | Tappable — triggers selection change |
| Pressed (inactive only) | `blend.pressedLighter` on icon | Reverts on drag-away; release triggers animation |
| Focused (web only) | Focus ring via `:focus-visible` | Keyboard navigation |

### Glow Gradient

Elliptical radial gradient applied as tab item background, centered on icon center.

| Parameter | Value | Token |
|-----------|-------|-------|
| Shape | Elliptical | — |
| Horizontal radius | 88% of tab item width | — |
| Vertical radius | 88% of tab item height | — |
| Stop 0% (center) | Accent color at 100% | Active: `color.background.primary.subtle` / Inactive: `color.structure.canvas` |
| Stop 88% (near edge) | Container bg at 24% | `color.structure.canvas` @ `opacity024` |
| Stop 100% (edge) | Container bg at 0% | `color.structure.canvas` @ `opacity000` |
| Overflow | Bleeds into adjacent tabs | No clipping |

Active gradient: visible glow (cyan center distinct from container background).
Inactive gradient: subtle same-color vignette (center = container bg, nearly invisible — contrast protection against scrolling content).

---

## Animation Choreography

Three-phase sequence on selection change:

| Phase | What Happens | Timing | Easing |
|-------|-------------|--------|--------|
| 1. Depart (0ms) | Glow dims on departing tab; departing icon begins settling to inactive position | `duration150` | `easingAccelerate` |
| 2. Glide (after Phase 1) | Dot glides from departing to arriving tab center; icon outline↔solid snaps when arriving glow begins | `duration350` | `easingGlideDecelerate` |
| 3. Arrive (~80% through glide) | Arriving icon lifts to active position; glow brightens on arriving tab | `duration150` | `easingDecelerate` |

Phase 3 overlaps with the tail of Phase 2 (~80% through the glide) for a more fluid feel. The icon swap (outline→solid / solid→outline) is a snap, not a crossfade — it fires when the arriving glow begins animating in.

**Glow animation**: The gradient center color intensity is independently animatable. During transition, the departing tab's glow fades while the arriving tab's glow ramps up. This is not a binary on/off — it's a continuous opacity/intensity transition.

**Reduced motion**: All phases collapse to immediate state change. No animation executes.

**Initial render**: Selected tab appears in active state without animation.

**Callback timing**: `onSelectionChange` fires immediately on confirmed selection (press release), before animation begins. The animation is visual feedback, not a gate on navigation.

### Platform Animation APIs

| Platform | Dot glide | Glow transition | Icon swap |
|----------|-----------|-----------------|-----------|
| Web | CSS `transition` on `transform: translateX()` with `linear()` easing | CSS `transition` on gradient opacity | Class swap (outline↔solid icon element) |
| iOS | SwiftUI `.animation()` with `UnitCurve` (iOS 17+) | SwiftUI `.animation()` on gradient opacity | Conditional view (`if isActive`) |
| Android | Compose `animateDpAsState` or `Animatable` | Compose `animateFloatAsState` on gradient alpha | Conditional composable |

Phase 3 overlap timing (~80% through Phase 2) is a platform implementation concern. Web: animation delay or timeout. iOS: chained animation with delay. Android: `Animatable` with delay parameter.

---

## Web Chrome Tracking

Mobile web tab bar tracks browser toolbar show/hide to maintain position above the chrome.

| Property | Value |
|----------|-------|
| API | `window.visualViewport` resize/scroll events |
| Offset computation | `window.innerHeight - visualViewport.height` |
| Application | CSS custom property `--chrome-offset` on component host |
| Transition | `bottom 100ms ease-out` (below motion token scale — platform implementation detail) |
| Floating gap | `space200` above chrome offset |
| Fallback | If `visualViewport` unavailable, `--chrome-offset: 0px` — static positioning above `env(safe-area-inset-bottom)` |

Desktop web: same floating pill visual, no chrome tracking needed.

---

## Accessibility

### ARIA Model

- Container: `role="tablist"`
- Tab items: `role="tab"` + `aria-selected`
- No panel association in v1 (tab bar navigates between app sections, not in-page panels)

### Keyboard (Web)

- Tab → focus enters on selected tab (`tabindex="0"`); Tab again exits
- Left/Right → adjacent tab (wraps)
- Enter/Space → select focused tab
- Roving tabindex: selected = `tabindex="0"`, others = `tabindex="-1"`

### Screen Readers

- Container announced as tab list
- Tabs announced by `accessibilityLabel` with selected/unselected state
- Icon-only — `accessibilityLabel` is the only text content; icon name is not announced

### Touch Targets

- Each tab enforces `min-width: tapAreaMinimum`
- Full tab item width is tappable (no dead zones between tabs — zero inter-tab spacing)
- In a 3–5 tab layout, actual tab width far exceeds `tapAreaMinimum`

---

## Behavioral Contracts

Contracts define the behavioral guarantees that platform implementations must satisfy. Full `contracts.yaml` is authored as a task deliverable; this section establishes the contract surface.

### Interaction (6)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `interaction_pressable` | Inactive tabs respond to press with `blend.pressedLighter`, revert on drag-away | R2 AC3-4 |
| `interaction_noop_active` | Active tab press is a no-op, no visual feedback | R1 AC3, R2 AC5 |
| `interaction_roving_tabindex` | Web: selected tab `tabindex="0"`, others `tabindex="-1"` | R7 AC1 |
| `interaction_keyboard_navigation` | Left/Right arrows move focus with wrapping | R7 AC2 |
| `interaction_keyboard_activation` | Enter/Space selects focused tab | R7 AC3 |
| `interaction_focus_ring` | `:focus-visible` with accessibility focus tokens | R7 AC5 |

### Animation (2)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `animation_coordination` | Three-phase choreography: depart → glide → arrive, Phase 3 overlaps Phase 2 at ~80% | R3 AC1-4, AC7 |
| `animation_initial_render` | Selected tab appears in active state without animation on first render | R3 AC6 |

### State (2)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `state_selected` | Exactly one tab selected at all times, controlled via `selectedValue` | R1 AC2 |
| `state_mode_driven` | Colors resolve through Spec 080 mode architecture, not component props | R10 AC4 |

### Visual (4)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `visual_state_colors` | Active: solid icon + `color.action.navigation` + dot. Inactive: outline icon + `color.icon.navigation.inactive` | R2 AC1-2 |
| `visual_background` | Container uses `color.structure.canvas` bg + `color.structure.border.subtle` top stroke | R5 AC6 |
| `visual_pill_container` | Web only: `radiusFull`, backdrop blur, inline margins, chrome tracking | R5 AC2-5 |
| `visual_gradient_glow` | Elliptical radial gradient on all tabs — accent center on active, canvas center on inactive, 88% radii, three stops, bleeds into adjacent tabs | R4 AC1-6 |

> **Governance note**: `visual_gradient_glow` is a proposed new concept not in the current Concept Catalog. If adopted, requires a ballot measure to add to the catalog. Alternative: fold glow behavior into `visual_state_colors`. Recommendation: keep separate — the glow is structurally distinct (gradient geometry, stops, independent animation) from simple state colors.

### Accessibility (4)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `accessibility_aria_roles` | Container `role="tablist"`, items `role="tab"` + `aria-selected` | R8 AC1-2 |
| `accessibility_reduced_motion` | All animation collapses to immediate state change | R3 AC5 |
| `accessibility_touch_target` | Min-width `tapAreaMinimum`, full tab width tappable | R9 AC1 |
| `accessibility_aria_label` | `accessibilityLabel` required, announced instead of icon name | R8 AC3 |

### Layout (1)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `layout_flexible_length` | 3–5 tabs, equal-width distribution, no inter-tab gaps | R5 AC7 |

### Validation (1)

| Contract | Description | Requirements |
|----------|-------------|--------------|
| `validation_selection_constraints` | Minimum 2 tabs, fallback on invalid `selectedValue` | R1 AC4-5 |

### Exclusions

| Excluded Contract | Reason |
|-------------------|--------|
| `state_disabled` | No disabled state. Unavailable destinations should not be rendered. |
| `interaction_hoverable` | No hover state on tabs. Pressed state (`blend.pressedLighter`) provides touch feedback; hover is not applicable to the primary mobile context. |

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `tabs.length < 2` | Throws runtime error with descriptive message |
| `selectedValue` doesn't match any tab | Select first tab as fallback |
| Icon segment missing `accessibilityLabel` | Compile-time TypeScript error (required property) |
| `visualViewport` unavailable (web) | Graceful fallback to static positioning |

---

## Testing Strategy

### Behavioral Contract Tests (Lina)
- Selection: tap/click changes selection, no-op on active tab, fallback for invalid selectedValue, minimum tab count error
- Visual states: active (solid icon + dot + glow), inactive (outline icon + vignette), pressed (blend on inactive only, revert on drag-away)
- Keyboard: arrow key navigation with wrapping, Enter/Space selection, Tab entry/exit, roving tabindex
- Accessibility: roles, aria-selected, accessibilityLabel announced, selection state communicated
- Animation: three-phase choreography fires in order, reduced motion bypasses, initial render has no animation, icon swap is snap not crossfade
- Glow: gradient on all tabs, active vs inactive center color, bleed into adjacent tabs
- Touch targets: full tab width tappable, min-width enforced

### Token Compliance Tests (Ada)
- All color tokens resolve correctly in both modes (Level 2 dark overrides)
- Spacing tokens match specification (inset, grouped)
- Motion tokens used for all animation phases (no hard-coded timing)
- `blend.pressedLighter` applies correctly on inactive press
- Gradient stops use correct opacity tokens

### Platform-Specific Tests (Lina)
- Web: Shadow DOM encapsulation, floating pill with `radiusFull`, chrome tracking via Visual Viewport API, `--chrome-offset` custom property, fallback positioning
- iOS: Full-width anchored, OS safe area, haptic feedback on selection, `UnitCurve` animation
- Android: Full-width anchored, Material 3 `NavigationBar` base, `Modifier.shadow()` patterns

---

## Design Decisions

| # | Decision | Rationale | Trade-offs |
|---|----------|-----------|------------|
| 1 | Dot as per-tab-item element, not separate sliding element | Unlike 049's indicator, the dot is small enough that animating a single dot between positions (via transform) is simpler than managing a separate positioned element. The dot's position is derived from the selected tab's center. | Slightly different animation model than 049 — but the visual effect (gliding dot) is the same. |
| 2 | Three-phase choreography with overlap | Phase 3 overlaps Phase 2 at ~80% for fluidity. Borrowed from 049's proven pattern but adapted — 049 has 4 phases (shadow out/in), this has 3 (glow dim/brighten replaces shadow). | More complex than sequential phases, but feels more polished per Peter's direction. |
| 3 | Glow on all tabs (not just active) | Inactive tabs get same-color vignette for contrast protection against scrolling content. Active tabs get accent glow. Same gradient structure, different center color. | Slightly more rendering work than active-only glow, but eliminates the need for a separate contrast protection mechanism. |
| 4 | Icon swap as snap, not crossfade | Crossfade during glide would require rendering both icon variants simultaneously. Snap when arriving glow begins is cleaner and avoids double-rendering. | Less "smooth" than crossfade, but Peter confirmed snap is the desired behavior. |
| 5 | Build-time platform separation | Web (floating pill) vs native (full-width anchored) are genuinely different visual treatments. Runtime branching would violate True Native architecture. | Three platform implementations to maintain. |
| 6 | No disabled state | Unavailable destinations should not be rendered. Consistent with 049's approach. | Cannot gray out a tab — must remove it entirely. |
| 7 | `blend.pressedLighter` for inactive press | Lighten blend on dark-surface icons (inactive tabs). Completes blend family symmetry with `pressedDarker`. | New token required — but fills a structural gap in the blend family. |
| 8 | Zero inter-tab spacing | Tabs fill padded bounds with no gaps. Dead zones between tabs reduce touch target coverage and conflict with R9 (full width tappable). | No visual separator between tabs — but the glow gradients and icon state differences provide sufficient visual separation. |
| 9 | Chrome tracking as platform implementation detail | 100ms ease-out is below the motion token scale. This is viewport tracking, not a design animation. | Hard-coded timing for a single-use platform behavior. Acceptable per Ada F42. |
| 10 | Badge slot empty in v1 | Structure includes the slot for future Badge family composition. No badge tokens or rendering. | Slight structural overhead for an unused slot — but Peter's direction was "light effort" for future integration. |

---

## Future Enhancements (Separate Specs)

1. **Nav-TabBar-Labeled**: Restores icon + label layout (typography tokens from Figma need deliberate mapping)
2. **Nav-TabBar-Floating**: Elevated floating bar with rounded corners for native platforms
3. **Nav-TabBar-Minimal**: Icon-only, labels appear on selection
4. **Badge integration**: Populate badge slot with Badge-Count-Base / Badge-Count-Notification composition

---

**Organization**: spec-guide
**Scope**: 050-nav-tabbar-base
