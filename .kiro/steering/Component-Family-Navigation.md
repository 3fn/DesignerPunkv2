---
inclusion: manual
name: Component-Family-Navigation
description: Navigation component family — wayfinding and view-switching components including segmented controls and tab bars. Load when building navigation components or reviewing family architecture.
---

# Navigation Components

**Date**: 2026-03-18
**Purpose**: MCP-queryable documentation for Navigation component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, navigation-implementation
**Last Reviewed**: 2026-03-18

---

## Family Overview

**Family**: Navigation
**Shared Need**: Wayfinding and view switching
**Readiness**: 🟡 Beta (2 components implemented, family hierarchy evolving)

### Purpose

The Navigation family provides components for user wayfinding and switching between views. Implemented components include a segmented control for mutually exclusive content views and a primary bottom tab bar for top-level app destinations.

### Key Characteristics

- **Mutually Exclusive Selection**: Exactly one option active at all times
- **Animated Indicators**: Choreographed indicator movement (segmented: four-phase shadow/resize/glide; tab bar: three-phase glow/glide)
- **Equal-Width Distribution**: Content-independent sizing with minimum touch targets
- **No Disabled States**: Unavailable options are removed from the array, not disabled
- **Icon + Text Variants**: Segmented control supports text or icon; tab bar is icon-only (v1)

### Stemma System Integration

- **Implemented Primitives**: Nav-SegmentedChoice-Base, Nav-TabBar-Base (web, iOS, Android)
- **Planned Variants**: 3 (Tabs, Breadcrumb, Header)
- **Cross-Platform**: All three platforms implemented with shared behavioral contracts

---

## Inheritance Structure

### Component Hierarchy

```
Nav-SegmentedChoice-Base (Primitive) [IMPLEMENTED]
    └── Segmented control for mutually exclusive views

Nav-TabBar-Base (Primitive) [IMPLEMENTED]
    └── Primary bottom navigation with icon-only tabs and dot indicator

Nav-Tabs (Semantic) [PLANNED]
    └── Horizontal/vertical tab navigation

Nav-Breadcrumb (Semantic) [PLANNED]
    └── Hierarchical path navigation

Nav-List (Semantic) [PLANNED]
    └── Vertical navigation menu

Nav-Header-Base (Primitive) [PLANNED]
    └── Top navigation header bar
```

> **Note**: Whether a shared Nav-Base primitive emerges depends on commonalities discovered when the next navigation component is implemented. Nav-SegmentedChoice-Base and Nav-TabBar-Base are currently standalone — they share behavioral patterns (selection, animation, keyboard nav) but differ enough in visual treatment and context that a shared base hasn't been warranted.

### Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Nav-SegmentedChoice-Base | Primitive | 🟢 Production | Segmented control for mutually exclusive content views |
| Nav-TabBar-Base | Primitive | 🟢 Production | Primary bottom navigation with icon-only tabs, dot indicator, and glow animation |
| Nav-Tabs | Semantic | 🔴 Planned | Horizontal/vertical tab navigation |
| Nav-Breadcrumb | Semantic | 🔴 Planned | Hierarchical path navigation |
| Nav-List | Semantic | 🔴 Planned | Vertical navigation menu |
| Nav-Header-Base | Primitive | 🔴 Planned | Top navigation header bar |

---

## Behavioral Contracts

### Nav-SegmentedChoice-Base Contracts

23 behavioral contracts across 10 categories, plus 2 exclusions. Full contract definitions in `src/components/core/Nav-SegmentedChoice-Base/contracts.yaml`.

| Contract | Category | WCAG | Platforms |
|----------|----------|------|-----------|
| `visual_background` | visual | — | web, ios, android |
| `visual_border` | visual | — | web, ios, android |
| `visual_shadow` | visual | — | web, ios, android |
| `visual_state_colors` | visual | — | web, ios, android |
| `visual_size_variants` | visual | — | web, ios, android |
| `layout_flexible_length` | layout | 2.5.5 | web, ios, android |
| `content_displays_label` | content | — | web, ios, android |
| `content_supports_icon` | content | — | web, ios, android |
| `content_displays_fallback` | content | — | web, ios, android |
| `interaction_pressable` | interaction | — | web, ios, android |
| `interaction_noop_active` | interaction | — | web, ios, android |
| `interaction_hover` | interaction | 1.4.13 | web |
| `interaction_focus_ring` | interaction | 2.4.7 | web, ios, android |
| `interaction_keyboard_navigation` | interaction | 2.1.1 | web |
| `interaction_keyboard_activation` | interaction | 2.1.1 | web |
| `interaction_roving_tabindex` | interaction | 2.1.1 | web |
| `animation_coordination` | animation | — | web, ios, android |
| `animation_initial_render` | animation | — | web, ios, android |
| `accessibility_aria_roles` | accessibility | 4.1.2 | web, ios, android |
| `accessibility_aria_controls` | accessibility | 4.1.2 | web, ios, android |
| `accessibility_alt_text` | accessibility | 1.1.1 | web, ios, android |
| `accessibility_reduced_motion` | accessibility | 2.3.3 | web, ios, android |
| `validation_selection_constraints` | validation | — | web, ios, android |

**Exclusions**: `state_disabled`, `interaction_segment_disabled` — DesignerPunk does not support disabled states.

### Nav-TabBar-Base Contracts

20 behavioral contracts across 9 categories, plus 2 exclusions. Full contract definitions in `src/components/core/Nav-TabBar-Base/contracts.yaml`.

| Contract | Category | WCAG | Platforms |
|----------|----------|------|-----------|
| `visual_background` | visual | — | web, ios, android |
| `visual_state_colors` | visual | — | web, ios, android |
| `visual_gradient_glow` | visual | — | web, ios, android |
| `visual_pill_container` | visual | — | web |
| `state_selected` | state | — | web, ios, android |
| `state_mode_driven` | state | — | web, ios, android |
| `layout_flexible_length` | layout | — | web, ios, android |
| `interaction_pressable` | interaction | — | web, ios, android |
| `interaction_noop_active` | interaction | — | web, ios, android |
| `interaction_roving_tabindex` | interaction | 2.1.1 | web |
| `interaction_keyboard_navigation` | interaction | 2.1.1 | web |
| `interaction_keyboard_activation` | interaction | 2.1.1 | web |
| `interaction_focus_ring` | interaction | 2.4.7 | web |
| `animation_coordination` | animation | — | web, ios, android |
| `animation_initial_render` | animation | — | web, ios, android |
| `accessibility_aria_roles` | accessibility | 4.1.2 | web, ios, android |
| `accessibility_aria_label` | accessibility | 4.1.2 | web, ios, android |
| `accessibility_reduced_motion` | accessibility | 2.3.3 | web, ios, android |
| `accessibility_touch_target` | accessibility | 2.5.5 | web, ios, android |
| `validation_selection_constraints` | validation | — | web, ios, android |

**Exclusions**: `state_disabled`, `interaction_hoverable` — No disabled or hover states on tab bar.

---

## Token Dependencies

### Nav-SegmentedChoice-Base Tokens

| Category | Token | Purpose |
|----------|-------|---------|
| Color | `color.structure.surface` | Container background |
| Color | `color.structure.canvas` | Indicator background |
| Color | `color.structure.border` | Container border |
| Color | `color.action.navigation` | Segment text/icon color |
| Border | `border.default` | Container border width |
| Radius | `radius.normal` | Container border radius |
| Radius | `radius.small` | Indicator and segment radius |
| Shadow | `shadow.navigation.indicator` | Indicator depth shadow |
| Spacing | `space.050` | Container padding |
| Spacing | `space.100`, `space.150`, `space.200` | Size-variant padding |
| Typography | `fontSize100`, `fontSize125` | Size-variant font sizes |
| Typography | `lineHeight100`, `lineHeight125` | Size-variant line heights |
| Typography | `fontWeight700` | Segment text weight |
| Touch | `tapAreaMinimum` | Minimum segment width |
| Easing | `easingAccelerate`, `easingStandard`, `easingGlideDecelerate`, `easingDecelerate` | Animation phase easing |
| Duration | `duration150`, `duration350` | Animation phase timing |
| Blend | `blend.containerHoverDarker` | Hover state (web only) |

### Nav-TabBar-Base Tokens

| Category | Token | Purpose |
|----------|-------|---------|
| Color | `color.structure.canvas` | Container background |
| Color | `color.structure.border.subtle` | Top stroke |
| Color | `color.action.navigation` | Active icon + dot |
| Color | `color.icon.navigation.inactive` | Inactive icon |
| Color | `color.background.primary.subtle` | Glow center (active) |
| Opacity | `opacity.024` | Glow edge opacity |
| Spacing | `space.050`, `space.100`, `space.150`, `space.200` | Padding variants |
| Spacing | `space.grouped.minimal` | Icon-to-dot spacing |
| Touch | `tapAreaMinimum` | Minimum tab width |
| Easing | `easingGlideDecelerate` | Dot glide curve |
| Duration | `duration150`, `duration350` | Animation phase timing |
| Blend | `blend.pressedLighter` | Inactive tab press (12% lighter) |

---

## Component Metadata

### Nav-SegmentedChoice-Base — Metadata
- **Purpose**: Switch between mutually exclusive content views using connected segments with a sliding indicator.
- **Contexts**: settings-screens, dashboards

### Nav-TabBar-Base — Metadata
- **Purpose**: Navigate between top-level app destinations via a persistent bottom tab bar with icon-only tabs and animated dot indicator.
- **Contexts**: navigation-tabs, app-bars

---

## Usage Guidelines

### When to Use

- **Nav-SegmentedChoice-Base**: Switching between 2–5 mutually exclusive content views within a single screen
- **Nav-TabBar-Base**: Persistent bottom navigation between 3–5 top-level app destinations

### When Not to Use

- More than 5 options — consider Nav-Tabs (planned) or a dropdown
- Hierarchical navigation — consider Nav-Breadcrumb (planned)
- Actions that don't switch views — consider Chip-Filter or Button
- In-page content switching — use Nav-SegmentedChoice-Base, not Nav-TabBar-Base

### Segment/Tab Types

- **Nav-SegmentedChoice-Base**: Text segments (label-only) or icon segments (icon-only with accessibilityLabel). Do not mix.
- **Nav-TabBar-Base**: Icon-only with required accessibilityLabel. Each tab has active (solid) and inactive (outline) icon variants.

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | SegmentedChoice Animation | TabBar Animation | Reduced Motion |
|----------|-----------|--------------------------|-----------------|----------------|
| Web | Web Component + Shadow DOM | CSS transitions + JS orchestration (4-phase) | CSS transitions + JS orchestration (3-phase) | `prefers-reduced-motion` |
| iOS | SwiftUI View | `withAnimation` + `DispatchQueue.main.asyncAfter` | `withAnimation` + `DispatchQueue.main.asyncAfter` | `UIAccessibility.isReduceMotionEnabled` |
| Android | Jetpack Compose | `Animatable` + coroutine sequencing | `Animatable` + coroutine sequencing | `Settings.Global.ANIMATOR_DURATION_SCALE` |

### Platform-Specific Behaviors

- **Web (SegmentedChoice)**: Hover state on inactive segments (`blend.containerHoverDarker`), roving tabindex, `linear()` CSS function for glide easing
- **Web (TabBar)**: Floating pill container with backdrop blur, Visual Viewport API chrome tracking, roving tabindex
- **iOS**: Consumes `PiecewiseLinearEasing` CustomAnimation (iOS 17+), `@FocusState` for external keyboard, haptic feedback on tab bar selection
- **Android**: `Modifier.shadow()` + `.clip()` for segmented indicator shadow, `MutableInteractionSource` + `pressedLighterBlend()` for tab bar pressed state, `FocusRequester` per item for hardware keyboard

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Component MCP Document Template](./Component-MCP-Document-Template.md) - Template for family docs
- [Nav-SegmentedChoice-Base README](../../src/components/core/Nav-SegmentedChoice-Base/README.md) - Component documentation
- [Nav-TabBar-Base README](../../src/components/core/Nav-TabBar-Base/README.md) - Component documentation
- [Spec 049 Requirements](../../.kiro/specs/049-nav-segmentedchoice-base/requirements.md) - SegmentedChoice spec
- [Spec 050 Design](../../.kiro/specs/050-nav-tabbar-base/design.md) - TabBar spec
