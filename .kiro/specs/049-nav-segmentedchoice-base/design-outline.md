# Nav-SegmentedChoice-Base Component - Design Outline

**Date**: January 19, 2026
**Last Updated**: 2026-03-10
**Purpose**: Capture design decisions and behavioral architecture before creating full spec
**Status**: Design Outline (Pre-Requirements) — behavioral decisions finalized, visual design pending Figma

> ✅ **TOKEN REVIEW COMPLETE** (2026-03-12): All token decisions resolved. Resolved: padding, radius, line-height, font-weight, container background, active segment background, hover state, shadow token, max-width (layout guidance), motion tokens. One infrastructure dependency remains: piecewise linear easing token type (see Motion Token Requirements).
>
> ⚠️ **DEPENDENCY**: Color tokens (`color.action.navigation`, label typeface) depend on Spec 076 (Primary Action Color Migration) which introduces theme-conditional primitive references (`wcagValue`). Spec 049 should proceed with the token names below; Spec 076 provides the infrastructure to define them.

---

## Component Overview

SegmentedChoice is a navigation control that allows users to switch between different content surfaces within a single view. It presents mutually exclusive options as connected segments, with the selected segment visually distinguished by a sliding indicator.

**Key Characteristics**:
- **Navigation**: Switches between content surfaces (not form input)
- **Mutual exclusivity**: Only one segment active at a time
- **Connected segments**: Options appear as unified control, equal-width, full-width container
- **Text or icon**: Each segment displays a text label OR an icon (not both)
- **Animated indicator**: Selection changes animate with a choreographed sliding indicator
- **Platform-agnostic**: Unified API across web/iOS/Android

**Platform Equivalents**:
- iOS: `UISegmentedControl`
- Android: `MaterialButtonToggleGroup`
- Web: Custom segmented control

---

## Architecture

### Component Structure

```
Nav-SegmentedChoice-Base (Primitive)
├── Provides foundational segmented navigation
├── Text or icon segments, selected state, sliding indicator
└── Semantic variants inherit from this

Future Semantic Variants (separate specs):
├── Nav-SegmentedChoice-Badge (segments with notification dot indicator)
└── Nav-SegmentedChoice-Scrollable (horizontal scroll for many segments)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

**Note on Badge variant**: The badge indicator is envisioned as a simple dot (similar to Badge-Count-Notification but smaller, without a number). This may require a new Badge family member (e.g., Badge-Dot-Base) that does not exist today. The base component's segment type should be extensible to accommodate this in a future variant without breaking changes.

---

## Visual Specifications

> Visual values extracted from Figma analysis (`analysis/analysis-segment/`, `analysis/analysis-segmented-controller/`). Values marked `[ADA]` require token governance decisions from Ada.

### Container

| Property | Value | Token |
|----------|-------|-------|
| Background | Near-white surface | `color.structure.surface` (→ white200) |
| Border Radius | 8px | `radius.normal` |
| Padding | 4px (all sides) | `space.inset.050` |
| Item Spacing | 0 (segments flush) | `space.grouped.none` |
| Border | 1px | `border.default` |
| Height | Auto (based on segment size) |  |

### Segment States

| State | Background | Text/Icon Color | Description |
|-------|------------|-----------------|-------------|
| **inactive** | transparent | `color.action.navigation` | Default state — sits on controller surface (white200) |
| **active** | `color.structure.canvas` (→ white100) | `color.action.navigation` | Selected segment — canvas "punches through" surface |
| **hover** | `blend.containerHoverDarker` (4% darker) | `color.action.navigation` | Mouse hover on inactive segments only (web) |
| **focus** | focus ring | `color.action.navigation` | Keyboard focus |

**Hover note**: Hover applies to inactive segments only. The active segment does not show hover feedback — it's already selected, and hover would falsely suggest "click me" for a no-op action. Uses `blend.containerHoverDarker` (4% darker) rather than `blend.hoverDarker` (8%) because segments are large interactive surfaces.

**Color note**: `color.action.navigation` is a new semantic token (cyan500 Standard / teal500 WCAG) defined in Spec 076. It provides a darker action shade than `color.action.primary` so navigation controls don't compete with page-level CTAs for visual prominence.

**Contrast (Standard theme)**: cyan500 on white100 = 4.27:1, on white200 = 3.93:1. This is sub-AA for normal text and does not qualify as "large text" under WCAG's strict definition (18px regular or 14px bold) — condensed size (fontSize100, 16px bold) is the edge case. This is an accepted trade-off: Standard theme prioritizes the cyan visual identity with bold weight as mitigation; the WCAG theme (teal500, 14.39:1 / 13.25:1 AAA) fully resolves contrast for users who need it. See Spec 076 design outline for the full accepted trade-off statement.

### Size Variants

| Property | Standard | Condensed | Token |
|----------|----------|-----------|-------|
| Segment padding (block) | 12px | 8px | `space.inset.150` / `space.inset.100` |
| Segment padding (inline) | 16px | 12px | `space.inset.200` / `space.inset.150` |
| Segment border-radius | 4px | 4px | `radius.small` (both states, both sizes) |
| Label font-size | 18px | 16px | `fontSize125` / `fontSize100` |
| Label font-weight | 700 | 700 | `fontWeight700` |
| Label line-height | — | — | `lineHeight125` / `lineHeight100` (paired with fontSize) |
| Label typeface | Display | Display | `[076: component token pending — Display typeface for navigation labels]` |
| Icon stroke color | — | — | Inherits from `color.action.navigation` via `currentColor` |

**Line-height note**: Figma values (28px, 24px) are artifacts of multiplier tooling limitations. Implementation uses the lineHeight token paired with the fontSize token.

**Typeface note**: Labels use the Display typeface, not the body typeface. This is a deliberate typographic identity choice for navigation controls. Component token to be created as part of Spec 076 or this spec's implementation.

### Layout

- **Segment width**: Equal — all segments divide the container width equally regardless of content length
- **Container width**: Full-width — stretches to fill parent container
- **Layout guidance**: The component does not enforce a max-width. Consuming layouts should constrain width via grid placement or container sizing. Recommended: 4 columns at the active breakpoint.
- **Implication for animation**: Since segments are equal-width, the indicator never resizes during transitions — it only slides. The resize phase of the choreography is effectively instant for the base component. (Variable-width segments would only apply to a future Scrollable variant.)

### Selection Indicator

The selection indicator is a **separate DOM/view element** that slides behind the selected segment. It is not a background on individual segments.

- **Style**: Background fill (`color.structure.canvas`) against container (`color.structure.surface`)
- **Shadow**: `shadow.navigation.indicator` (0 offset, 4px blur, 20% black — omnidirectional, tight but gentle edge definition)
- **Border Radius**: `radius.small` (4px, matches segment radius)

---

## Indicator Animation Choreography

Selection changes follow a four-phase animation sequence:

```
Phase 1: Shadow out     — indicator shadow/elevation fades to 0 (fast)
Phase 2: Resize + Glide — indicator width transitions to new segment width (fast)
                          indicator position slides to new segment position (glide, springy easing)
                          These happen simultaneously at different speeds
Phase 3: Shadow in      — indicator shadow/elevation fades back in (fast)
```

**Phase 2 detail**: Width snaps quickly while position glides with an overshoot easing curve (similar to `cubic-bezier(.32, 1.25, .64, 1)`). This handles variable-width segments gracefully — the indicator resizes quickly then slides to position.

**Reduced motion**: When `prefers-reduced-motion: reduce` is active, the indicator moves instantly to the new position without animation (all phases collapse to immediate state change).

**Initial render**: The indicator appears at the selected segment's position without animation on first render.

### Motion Token Requirements

| Phase | Property | Duration | Easing | Primitive References |
|-------|----------|----------|--------|---------------------|
| Shadow out | opacity/shadow | 150ms | accelerate | `duration150` + `easingAccelerate` |
| Resize | width | 150ms | standard | `duration150` + `easingStandard` |
| Glide | left/position | 350ms | glide decelerate | `duration350` + `easingGlideDecelerate` ⚠️ |
| Shadow in | opacity/shadow | 150ms | decelerate | `duration150` + `easingDecelerate` |

**Fast phases**: Use primitive token references directly at the component level. These are choreography implementation details, not reusable system-wide motion patterns — no new semantic motion tokens needed.

**Glide phase**: Uses a piecewise linear easing curve with aggressive deceleration and a long settling tail:
```css
linear(0, 0.012 0.9%, 0.05 2%, 0.411 9.2%, 0.517 11.8%, 0.611 14.6%,
0.694 17.7%, 0.765 21.1%, 0.824 24.8%, 0.872 28.9%, 0.91 33.4%,
0.939 38.4%, 0.977 50.9%, 0.994 68.4%, 1)
```
Character: 41% of movement in the first 10% of time, then a long gentle settle. No overshoot. Like a weighted object sliding to a stop.

> ⚠️ **INFRASTRUCTURE REQUIRED**: `easingGlideDecelerate` requires extending the easing token system to support piecewise linear curves alongside cubic-bezier. This is a dedicated task covering:
> - New `easingType` field on easing tokens (`cubicBezier` | `linear`)
> - New `easingGlideDecelerate` primitive with stops array
> - Platform builder updates: Web (`linear()`), iOS (`KeyframeAnimator` + `LinearKeyframe`), Android (Compose `keyframes`)
> - DTCG generator update (new type alongside `cubicBezier`)
> - Figma transformer update
> - Token-Family-Motion/Easing steering doc updates
> - Test updates across 4+ test files

**Platform equivalents for glide curve**:
- **Web**: CSS `linear()` — native support
- **iOS**: `KeyframeAnimator` with `LinearKeyframe` segments (iOS 17+)
- **Android**: Compose `keyframes { }` with linear interpolation between stops

**Reference implementation**: [Animated Segmented Control by Malik Dellidj](https://codepen.io/kowlor/pen/KKgWzvO) — demonstrates the separate-element indicator and split-timing approach. DesignerPunk adds the shadow choreography on top.

---

## Component API Design

### Props Interface

```typescript
interface SegmentedChoiceProps {
  /** Array of segment options (minimum 2) */
  segments: SegmentOption[];

  /** Currently selected segment value */
  selectedValue: string;

  /** Called when selection changes */
  onSelectionChange: (value: string) => void;

  /** Size variant */
  size?: 'standard' | 'condensed';

  /** DOM identity — drives aria-controls generation ([id]-panel-[value]) */
  id?: string;

  /** Test ID for automated testing */
  testID?: string;
}

// Text OR icon — mutually exclusive via union type
type SegmentOption =
  | { value: string; label: string }
  | { value: string; icon: IconBaseName; accessibilityLabel: string }
```

**Key API decisions**:
- **No disabled prop** — neither component-level nor segment-level. If an option is unavailable, don't render the segment.
- **Text OR icon** — enforced via union type. A segment has a `label` (text) or an `icon` + `accessibilityLabel` (icon). Never both.
- **`accessibilityLabel` required for icon segments** — an icon-only segment with no accessible name is a WCAG failure.
- **Minimum 2 segments** — enforced by throwing an error at runtime (e.g., `throw new Error('Nav-SegmentedChoice-Base requires at least 2 segments. Received: ${segments.length}.')`). Fail loudly during development, no silent degradation. A single-segment control is meaningless.
- **No hard maximum** — each segment enforces `min-width: tapAreaMinimum` so touch targets are always accessible. On narrow viewports with too many segments, the container will overflow rather than compress segments below the minimum. Documentation recommends ≤5 text segments or ≤7 icon segments. The future Scrollable variant is the answer for many segments.
- **`id` prop for panel association** — optional. When provided, generates `aria-controls="[id]-panel-[value]"` on each segment. When omitted, `aria-controls` is not rendered. Separate from `testID` (test automation only).

### Default Values

```typescript
const defaults = {
  size: 'standard'
};
```

### Usage Examples

```tsx
// Basic text segments (donation frequency)
<SegmentedChoice
  segments={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'one-time', label: 'One-time' }
  ]}
  selectedValue={frequency}
  onSelectionChange={setFrequency}
/>

// Three text segments
<SegmentedChoice
  segments={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ]}
  selectedValue={view}
  onSelectionChange={setView}
/>

// Icon segments (view mode toggle)
<SegmentedChoice
  segments={[
    { value: 'list', icon: 'list', accessibilityLabel: 'List view' },
    { value: 'grid', icon: 'grid', accessibilityLabel: 'Grid view' }
  ]}
  selectedValue={viewMode}
  onSelectionChange={setViewMode}
  size="condensed"
/>
```

### Panel Association

The component controls selection state only — it does not render or manage content panels. Developers associate panels using standard ARIA attributes:

```html
<!-- The component renders this structure (when id="freq" is provided) -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="freq-panel-monthly">Monthly</button>
  <button role="tab" aria-selected="false" aria-controls="freq-panel-onetime">One-time</button>
</div>

<!-- Developer provides panels separately -->
<div id="freq-panel-monthly" role="tabpanel">...</div>
<div id="freq-panel-onetime" role="tabpanel" hidden>...</div>
```

To make panel association easy, the component generates deterministic `aria-controls` values from segment values when the `id` prop is provided (e.g., `id="freq"` + segment value `"monthly"` → `aria-controls="freq-panel-monthly"`). When `id` is omitted, `aria-controls` is not rendered — the developer handles panel wiring. The `id` prop is separate from `testID` (which is for test automation only).

---

## Accessibility

### ARIA Model

- Container: `role="tablist"`
- Each segment: `role="tab"` with `aria-selected` reflecting selection state
- Each segment generates `aria-controls` pointing to a panel ID (developer provides the panel)
- WCAG 2.1 AA compliance for all interaction states

### Keyboard Navigation

- **Tab**: Focus enters the control on the currently selected segment. Tab again exits the control.
- **Left/Up arrow**: Move focus to previous segment (wraps from first to last)
- **Right/Down arrow**: Move focus to next segment (wraps from last to first)
- **Enter/Space**: Select the focused segment

### Screen Readers

- Container announced as tab list
- Each segment announced as tab with selected/unselected state
- Selection change announced
- Icon segments announced by their `accessibilityLabel`

### Touch Targets

- Each segment enforces `min-width: tapAreaMinimum` (WCAG 2.1 AA floor) — touch targets never compress below accessible size
- Standard size targets `tapAreaRecommended` for enhanced usability
- When segment count exceeds what the viewport can accommodate at `tapAreaMinimum` per segment, the container will overflow. The Scrollable variant is the solution for this case.

---

## Platform Considerations

### Web
- Web Component with Shadow DOM
- Indicator animation via CSS transitions (shadow phases) + JS-orchestrated position/width updates
- `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`
- `prefers-reduced-motion` media query disables animation

### iOS
- SwiftUI View
- Indicator animation via SwiftUI `.animation()` with custom timing curves
- `accessibilityElement` with `.tabBar` trait equivalent
- `UIAccessibility.isReduceMotionEnabled` check

### Android
- Jetpack Compose Composable
- Indicator animation via Compose `animateFloatAsState` / `Animatable` with custom easing
- Semantics: `Role.Tab` with `selected` state
- `Settings.Global.ANIMATOR_DURATION_SCALE` check for reduced motion

> ⚠️ **Lina: Indicator shadow on Android** — `shadow.navigation.indicator` must use `Modifier.shadow(elevation = 2.dp, shape = RoundedCornerShape(4.dp))`, NOT `Surface(elevation = ...)` or the `mapShadowToElevation()` pipeline. Reason: Android elevation is absolute, not relative to parent. If the SegmentedChoice sits inside an elevated surface (e.g., a Card at 8dp), a child with `elevation = 2.dp` renders *below* its parent — the shadow disappears. `Modifier.shadow()` renders a purely visual shadow without affecting z-ordering, which is the correct behavior for an inset indicator element. Additional notes:
> - `Modifier.shadow()` requires an explicit `Shape` — pass `RoundedCornerShape` matching `radius.small`
> - Must apply `.clip(shape)` after `.shadow()` to prevent shadow bleed outside rounded corners on some Android versions
> - Shadow choreography (fade out/in) animates the elevation parameter between `0.dp` and `2.dp` via `animateDpAsState`
> - Web (`box-shadow`) and iOS (`.shadow()`) don't have this concern — their shadows are already purely visual

**All platforms**: Same public API (props interface). Platform-native animation APIs. No runtime platform detection.

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Background fill indicator (not underline) | Clearer selection indicator, consistent with platform conventions |
| 2 | Indicator as separate element | Enables smooth slide animation without per-segment background transitions |
| 3 | Choreographed shadow animation | Shadow out → resize+glide → shadow in prevents heavy shadow dragging across surface |
| 4 | Split timing (fast resize, springy glide) | Handles variable-width segments gracefully; feels polished |
| 5 | Text OR icon (not both) | Clean constraint; mixed content creates visual inconsistency |
| 6 | No disabled state | Simplifies component; unavailable options should not be rendered |
| 7 | Two sizes (standard, condensed) | Covers primary and compact use cases without over-engineering |
| 8 | `tablist`/`tab` ARIA model | Semantically correct for navigation between content surfaces |
| 9 | No hard segment maximum | Soft recommendation (≤5 text, ≤7 icon); Scrollable variant handles overflow |
| 10 | Panel association via `id` prop + `aria-controls` | `id` drives panel wiring (`[id]-panel-[value]`), separate from `testID`. Graceful degradation when omitted |
| 11 | Union type for segment options | Type-safe enforcement of text XOR icon at compile time |
| 12 | `shadow.navigation.indicator` for indicator shadow | New semantic shadow token — omnidirectional, tight blur (4px), low opacity (20%). Distinct from `shadow.navigation` (nav bars) |
| 13 | Android: `Modifier.shadow()` not `elevation` for indicator | Elevation is absolute in Compose — inset indicator shadow would disappear inside elevated parents. `Modifier.shadow()` is purely visual |
| 14 | Hover on inactive segments only | Active segment hover is a no-op — showing hover feedback would falsely suggest interactivity |
| 15 | `blend.containerHoverDarker` for hover (4%) | Segments are large surfaces — 8% (`blend.hoverDarker`) would be visually heavy |
| 16 | Fast motion phases use primitive refs directly | Choreography sub-animations are component-scoped, not reusable system patterns — semantic tokens would create false coupling |
| 17 | Glide easing tokenized as new primitive type | Piecewise linear curve needs single source of truth across 3 platforms to prevent drift. Requires easing infrastructure extension |
| 18 | No max-width on component | Layout responsibility stays with consuming context. Component is full-width within parent. Recommended: 4 grid columns |

---

## Future Enhancements (Separate Specs)

1. **Nav-SegmentedChoice-Badge**: Segments with notification dot indicator (may require Badge-Dot-Base component)
2. **Nav-SegmentedChoice-Scrollable**: Horizontal scroll for many segments

---

## Blocked On

- **Spec 076 (Primary Action Color Migration)**: Provides `color.action.navigation` semantic token and the `wcagValue` infrastructure for theme-conditional primitive references. Spec 049 can proceed with token names but cannot generate correct WCAG theme output until 076 lands.
- **Ada token review (remaining)**: Piecewise linear easing token infrastructure (new primitive type for glide curve)
- **Figma analysis files**: `analysis/analysis-segment/` (individual segment) and `analysis/analysis-segmented-controller/` (assembled controller)

---

## Dependencies

| Spec | Relationship | Status |
|------|-------------|--------|
| 076 | `color.action.navigation` token + `wcagValue` infrastructure | Design outline created |
| 048 | Progress family (established Stemma patterns) | Complete |

---

## Next Steps

1. ✅ **Design outline created** — Decisions documented
2. ✅ **Review with Peter** — Behavioral decisions finalized
3. ✅ **Figma design delivery** — Visual specifications extracted
4. ✅ **Ada token review (partial)** — Resolved: padding, radius, line-height, font-weight, backgrounds, label color strategy
5. ✅ **Ada token review (complete)** — Resolved: hover state, shadow token, max-width, motion tokens. Easing infrastructure task identified.
6. ⏳ **Easing infrastructure** — Extend easing token system for piecewise linear curves (`easingGlideDecelerate`)
7. ⏳ **Spec 076 execution** — Provides color token infrastructure
7. ⏳ **Create requirements.md** — EARS format
8. ⏳ **Create design.md** — Detailed architecture
9. ⏳ **Create tasks.md** — Implementation plan

---

**Organization**: spec-guide
**Scope**: 049-nav-segmentedchoice-base
