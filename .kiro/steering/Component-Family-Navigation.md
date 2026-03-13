---
inclusion: manual
name: Component-Family-Navigation
description: Navigation component family — wayfinding and view-switching components including segmented controls. Load when building navigation components or reviewing family architecture.
---

# Navigation Components

**Date**: 2026-03-13
**Purpose**: MCP-queryable documentation for Navigation component family
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, ui-composition, navigation-implementation
**Last Reviewed**: 2026-03-13

---

## Family Overview

**Family**: Navigation
**Shared Need**: Wayfinding and view switching
**Readiness**: 🟡 Beta (1 component implemented, family hierarchy evolving)

### Purpose

The Navigation family provides components for user wayfinding and switching between views. The first implemented component is a segmented control for mutually exclusive content views.

### Key Characteristics

- **Mutually Exclusive Selection**: Exactly one option active at all times
- **Four-Phase Animation**: Choreographed indicator movement (shadow out → resize+glide → shadow in)
- **Equal-Width Segments**: Content-independent sizing with minimum touch targets
- **No Disabled States**: Unavailable options are removed from the array, not disabled

### Stemma System Integration

- **Implemented Primitive**: Nav-SegmentedChoice-Base (web, iOS, Android)
- **Planned Variants**: 4 (Tabs, Breadcrumb, List, Bar)
- **Cross-Platform**: All three platforms implemented with shared behavioral contracts

---

## Inheritance Structure

### Component Hierarchy

```
Nav-SegmentedChoice-Base (Primitive) [IMPLEMENTED]
    └── Segmented control for mutually exclusive views

Nav-Tabs (Semantic) [PLANNED]
    └── Horizontal/vertical tab navigation

Nav-Breadcrumb (Semantic) [PLANNED]
    └── Hierarchical path navigation

Nav-List (Semantic) [PLANNED]
    └── Vertical navigation menu

Nav-Bar (Semantic) [PLANNED]
    └── Top/bottom navigation bar
```

> **Note**: Whether a shared Nav-Base primitive emerges depends on commonalities discovered when the next navigation component is implemented. Nav-SegmentedChoice-Base is currently standalone.

### Components

| Component | Type | Status | Description |
|-----------|------|--------|-------------|
| Nav-SegmentedChoice-Base | Primitive | 🟢 Production | Segmented control for mutually exclusive content views |
| Nav-Tabs | Semantic | 🔴 Planned | Horizontal/vertical tab navigation |
| Nav-Breadcrumb | Semantic | 🔴 Planned | Hierarchical path navigation |
| Nav-List | Semantic | 🔴 Planned | Vertical navigation menu |
| Nav-Bar | Semantic | 🔴 Planned | Top/bottom navigation bar |

---

## Behavioral Contracts

### Nav-SegmentedChoice-Base Contracts

24 behavioral contracts across 10 categories, plus 2 exclusions. Full contract definitions in `src/components/core/Nav-SegmentedChoice-Base/contracts.yaml`.

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

---

## Usage Guidelines

### When to Use

- Switching between 2–5 mutually exclusive content views
- Top-of-content navigation where all options are peers
- Settings or preference toggles with immediate effect

### When Not to Use

- More than 5 options — consider Nav-Tabs (planned) or a dropdown
- Hierarchical navigation — consider Nav-Breadcrumb (planned)
- Actions that don't switch views — consider Chip-Filter or Button

### Segment Types

- **Text segments**: Label-only, for short descriptive labels
- **Icon segments**: Icon-only with required accessibilityLabel, for space-constrained layouts
- Do not mix text and icon segments in the same control

---

## Cross-Platform Notes

### Platform Implementations

| Platform | Technology | Animation Approach | Reduced Motion |
|----------|-----------|-------------------|----------------|
| Web | Web Component + Shadow DOM | CSS transitions + JS orchestration | `prefers-reduced-motion` media query |
| iOS | SwiftUI View | `withAnimation` + `DispatchQueue.main.asyncAfter` | `UIAccessibility.isReduceMotionEnabled` |
| Android | Jetpack Compose | `Animatable` + coroutine sequencing | `Settings.Global.TRANSITION_ANIMATION_SCALE` |

### Platform-Specific Behaviors

- **Web**: Hover state on inactive segments (`blend.containerHoverDarker`), roving tabindex, `linear()` CSS function for glide easing
- **iOS**: Consumes `PiecewiseLinearEasing` CustomAnimation (iOS 17+), `@FocusState` for external keyboard
- **Android**: `Modifier.shadow()` + `.clip()` for indicator shadow (not elevation), `FocusRequester` per segment for hardware keyboard, `BoxWithConstraints` for pixel-level indicator positioning

---

## Related Documentation

- [Component Quick Reference](./Component-Quick-Reference.md) - Family routing table
- [Stemma System Principles](./stemma-system-principles.md) - Architecture overview
- [Component MCP Document Template](./Component-MCP-Document-Template.md) - Template for family docs
- [Nav-SegmentedChoice-Base README](../../src/components/core/Nav-SegmentedChoice-Base/README.md) - Component documentation
- [Spec 049 Requirements](../../.kiro/specs/049-nav-segmentedchoice-base/requirements.md) - Spec requirements
- [Spec 049 Design Outline](../../.kiro/specs/049-nav-segmentedchoice-base/design-outline.md) - Spec design
