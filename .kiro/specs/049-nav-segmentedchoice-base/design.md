# Design Document: Nav-SegmentedChoice-Base

**Date**: 2026-03-12
**Spec**: 049 - Nav-SegmentedChoice-Base
**Status**: Design Phase
**Dependencies**:
- Spec 076 (Primary Action Color Migration) — `color.action.navigation` + `wcagValue` infrastructure
- Easing infrastructure — piecewise linear token type for `easingGlideDecelerate`

---

## Overview

Nav-SegmentedChoice-Base is a navigation primitive: equal-width segments in a full-width container, with a sliding indicator that animates between selections using a four-phase choreography. Text or icon per segment (never both). Two sizes (Standard, Condensed). No disabled state.

The component follows True Native architecture — unified TypeScript API, platform-native rendering (Web Component, SwiftUI View, Compose Composable).

---

## Architecture

### Component Hierarchy

```
Nav-SegmentedChoice-Base (Primitive)
├── Container (tablist)
│   ├── Segment[] (tab) — text label OR icon
│   └── Indicator (separate element) — slides behind active segment
```

The indicator is a separate DOM/view element, not a per-segment background. This enables smooth slide animation without per-segment background transitions.

### Props Interface

```typescript
interface SegmentedChoiceProps {
  segments: SegmentOption[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  size?: 'standard' | 'condensed';  // default: 'standard'
  id?: string;                       // DOM identity for aria-controls generation
  testID?: string;                   // test automation only
}

type SegmentOption =
  | { value: string; label: string }
  | { value: string; icon: IconBaseName; accessibilityLabel: string }
```

`id` and `testID` are separate concerns: `id` drives `aria-controls` panel association (`[id]-panel-[value]`), `testID` is for test selectors. When `id` is omitted, `aria-controls` is not rendered.

### State Management

- **Selection**: Controlled via `selectedValue` + `onSelectionChange` (no internal state)
- **Focus**: Internal state tracking which segment has keyboard focus
- **Indicator position**: Derived from `selectedValue` — computed as segment index × segment width
- **Animation**: Triggered on `selectedValue` change, suppressed on initial render and when reduced motion is active

---

## Components and Interfaces

### Container

| Property | Token | Notes |
|----------|-------|-------|
| Background | `color.structure.surface` (→ white200) | |
| Border radius | `radius.normal` (8px) | |
| Padding | `space.inset.050` (4px all sides) | |
| Item spacing | `space.grouped.none` (0) | Segments flush |
| Border | `border.default` (1px) | |
| Width | 100% of parent | No component-level max-width |

### Segments

| Property | Standard | Condensed | Token |
|----------|----------|-----------|-------|
| Padding block | 12px | 8px | `space.inset.150` / `space.inset.100` |
| Padding inline | 16px | 12px | `space.inset.200` / `space.inset.150` |
| Border radius | 4px | 4px | `radius.small` |
| Font size | 18px | 16px | `fontSize125` / `fontSize100` |
| Font weight | 700 | 700 | `fontWeight700` |
| Line height | — | — | `lineHeight125` / `lineHeight100` |
| Typeface | Display | Display | Component token (pending 076 or this spec) |
| Text/icon color | — | — | `color.action.navigation` (both states) |
| Width | Equal share of container | | `flex: 1` with `min-width: tapAreaMinimum` |

### Segment States

| State | Background | Behavior |
|-------|------------|----------|
| Inactive | transparent | Sits on container surface |
| Active | `color.structure.canvas` (→ white100) | Canvas "punches through" surface |
| Hover (inactive only) | `blend.containerHoverDarker` (4%) | Web only; active segment has no hover |
| Focus | Focus ring | Keyboard focus indicator |

### Indicator

| Property | Token |
|----------|-------|
| Background | `color.structure.canvas` |
| Shadow | `shadow.navigation.indicator` (0 offset, 4px blur, 20% black) |
| Border radius | `radius.small` (4px) |

The indicator is positioned absolutely within the container and animated via the choreography described below.

---

## Indicator Animation Choreography

Four-phase sequence on selection change:

| Phase | Property | Duration | Easing | Primitives |
|-------|----------|----------|--------|------------|
| 1. Shadow out | shadow opacity | 150ms | accelerate | `duration150` + `easingAccelerate` |
| 2a. Resize | width | 150ms | standard | `duration150` + `easingStandard` |
| 2b. Glide | position | 350ms | glide decelerate | `duration350` + `easingGlideDecelerate` |
| 3. Shadow in | shadow opacity | 150ms | decelerate | `duration150` + `easingDecelerate` |

Phases 2a and 2b run simultaneously. Since segments are equal-width in the base component, resize is effectively instant — the indicator only slides.

**Glide easing** (`easingGlideDecelerate`): Piecewise linear curve — 41% of movement in first 10% of time, then long gentle settle. No overshoot. Requires new easing token infrastructure (see Dependencies).

**Reduced motion**: All phases collapse to immediate state change.
**Initial render**: Indicator placed at selected position, no animation.

### Platform Animation APIs

| Platform | Glide curve | Shadow choreography |
|----------|-------------|---------------------|
| Web | CSS `linear()` | CSS transitions on `box-shadow` opacity |
| iOS | `UnitCurve` (iOS 17+) | SwiftUI `.animation()` on shadow |
| Android | Compose `keyframes` or custom `Easing` | `animateDpAsState` between 0.dp and 2.dp |

**Android shadow**: Must use `Modifier.shadow()` with mandatory `.clip(shape)` after. NOT `Surface(elevation = ...)` or `mapShadowToElevation()` — absolute elevation in Compose causes indicator shadow to disappear inside elevated parents.

---

## Accessibility

### ARIA Model

- Container: `role="tablist"`
- Segments: `role="tab"` + `aria-selected`
- Panel association: `aria-controls="[id]-panel-[value]"` (only when `id` prop provided)

### Keyboard

- Tab → focus enters on selected segment; Tab again exits
- Left/Up → previous segment (wraps)
- Right/Down → next segment (wraps)
- Enter/Space → select focused segment

### Screen Readers

- Container announced as tab list
- Segments announced as tab with selected/unselected state
- Icon segments announced by `accessibilityLabel`

### Touch Targets

- Each segment enforces `min-width: tapAreaMinimum` (WCAG 2.1 AA) — touch targets never compress below accessible size
- Standard size targets `tapAreaRecommended`
- When segment count exceeds what the viewport can accommodate at `tapAreaMinimum` per segment, the container overflows
- Soft recommendation: ≤5 text segments, ≤7 icon segments

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| `segments.length < 2` | Throws runtime error with descriptive message (e.g., `Nav-SegmentedChoice-Base requires at least 2 segments. Received: ${segments.length}.`) |
| `selectedValue` doesn't match any segment | Select first segment as fallback |
| `id` omitted | `aria-controls` not rendered; no error |
| Icon segment missing `accessibilityLabel` | Compile-time TypeScript error (union type enforcement) |

---

## Testing Strategy

### Behavioral Contract Tests (Lina)
- Selection: tap/click changes selection, no-op on active segment, fallback for invalid selectedValue
- Keyboard: arrow key navigation with wrapping, Enter/Space selection, Tab entry/exit
- Accessibility: roles, aria-selected, aria-controls generation, screen reader announcements
- Animation: choreography phases fire in order, reduced motion bypasses animation, initial render has no animation
- Size variants: correct tokens applied for standard vs condensed
- Hover: inactive-only hover on web, no hover on active segment

### Token Compliance Tests (Ada)
- All visual properties reference correct tokens
- Size variant tokens match specification
- Shadow token resolves correctly on all platforms

### Platform-Specific Tests (Lina)
- Web: Shadow DOM encapsulation, CSS custom properties, `linear()` easing output
- iOS: SwiftUI view renders, `UnitCurve` animation, accessibility traits
- Android: Compose rendering, `Modifier.shadow()` + `.clip()`, semantics

---

## Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Indicator as separate element | Enables smooth slide animation |
| 2 | Four-phase shadow choreography | Prevents heavy shadow dragging across surface |
| 3 | Split timing (fast resize, springy glide) | Handles variable-width gracefully; feels polished |
| 4 | Text OR icon (union type) | Clean constraint; mixed content creates visual inconsistency |
| 5 | No disabled state | Simplifies component; unavailable options should not be rendered |
| 6 | `id` prop for panel association | Separates DOM identity from `testID`; graceful degradation when omitted |
| 7 | Two sizes (standard, condensed) | Covers primary and compact use cases |
| 8 | `tablist`/`tab` ARIA model | Semantically correct for navigation between content surfaces |
| 9 | Hover on inactive only | Active segment hover is a no-op — false interactivity signal |
| 10 | `blend.containerHoverDarker` (4%) | Large surfaces need subtler hover than buttons (8%) |
| 11 | Fast phases use primitive refs directly | Choreography sub-animations are component-scoped, not reusable patterns |
| 12 | Glide easing as new primitive type | Piecewise linear needs single source of truth across 3 platforms |
| 13 | Full-width, no component max-width | Layout responsibility stays with consuming context |
| 14 | Android `Modifier.shadow()` | Elevation is absolute — inset indicator shadow disappears inside elevated parents |

---

## Future Enhancements (Separate Specs)

1. **Nav-SegmentedChoice-Badge**: Segments with notification dot (may require Badge-Dot-Base)
2. **Nav-SegmentedChoice-Scrollable**: Horizontal scroll for many segments (variable-width segments make resize phase relevant)
