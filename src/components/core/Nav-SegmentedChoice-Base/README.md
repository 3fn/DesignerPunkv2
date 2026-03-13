# Nav-SegmentedChoice-Base

**Stemma System**: Navigation Family
**Component Type**: Primitive (Base)
**Naming Convention**: `[Family]-[Type]-[Variant]` = Nav-SegmentedChoice-Base
**Status**: 🟢 All Platforms Implemented (Web, iOS, Android)

---

## Overview

Nav-SegmentedChoice-Base is a navigation control for switching between mutually exclusive content surfaces within a single view. It presents connected segments — text or icon — with a sliding indicator that animates between selections.

### Key Characteristics

- **Navigation**: Switches between content surfaces (not form input)
- **Mutual exclusivity**: Exactly one segment selected at all times
- **Text or icon**: Each segment displays a text label OR an icon (never both)
- **Animated indicator**: Four-phase choreographed sliding animation
- **Accessible**: tablist/tab ARIA pattern, keyboard navigation, reduced motion support

### Stemma Naming Convention

| Segment | Value | Meaning |
|---------|-------|---------|
| Family | `Nav` | Navigation component family |
| Type | `SegmentedChoice` | Mutually exclusive segment selector |
| Variant | `Base` | Foundational primitive (consumer-facing) |

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `segments` | `SegmentOption[]` | ✅ Yes | - | Array of segment options (minimum 2) |
| `selectedValue` | `string` | ✅ Yes | - | Currently selected segment value |
| `onSelectionChange` | `(value: string) => void` | ✅ Yes | - | Called when selection changes |
| `size` | `'standard' \| 'condensed'` | No | `'standard'` | Size variant |
| `id` | `string` | No | - | Drives aria-controls generation (`[id]-panel-[value]`) |
| `testID` | `string` | No | - | Test identifier |

### Segment Types

Segments are defined as a union type — each segment is either text or icon, never both:

```typescript
// Text segment
{ value: string; label: string }

// Icon segment (accessibilityLabel required)
{ value: string; icon: IconBaseName; accessibilityLabel: string }
```

### Size Variants

| Property | Standard | Condensed | Token |
|----------|----------|-----------|-------|
| Block padding | 12px | 8px | `space.inset.150` / `space.inset.100` |
| Inline padding | 16px | 12px | `space.inset.200` / `space.inset.150` |
| Font size | 18px | 16px | `fontSize125` / `fontSize100` |
| Line height | — | — | `lineHeight125` / `lineHeight100` |
| Font weight | 700 | 700 | `fontWeight700` |
| Icon size | 28 | 24 | Icon-Base size attribute |

---

## Usage Examples

### Web (Custom Element)

```html
<!-- Text segments -->
<nav-segmented-choice
  segments='[{"value":"daily","label":"Daily"},{"value":"weekly","label":"Weekly"}]'
  selected-value="daily"
  size="standard">
</nav-segmented-choice>

<!-- Icon segments -->
<nav-segmented-choice
  segments='[{"value":"list","icon":"list","accessibilityLabel":"List view"},{"value":"grid","icon":"grid","accessibilityLabel":"Grid view"}]'
  selected-value="list"
  size="condensed">
</nav-segmented-choice>

<!-- With panel association -->
<nav-segmented-choice
  id="freq"
  segments='[{"value":"monthly","label":"Monthly"},{"value":"onetime","label":"One-time"}]'
  selected-value="monthly">
</nav-segmented-choice>
<div id="freq-panel-monthly" role="tabpanel">Monthly content</div>
<div id="freq-panel-onetime" role="tabpanel" hidden>One-time content</div>
```

#### JavaScript API

```javascript
const el = document.querySelector('nav-segmented-choice');

// Property-based API
el.segments = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];
el.selectedValue = 'day';
el.onSelectionChange = (value) => console.log('Selected:', value);

// Event-based API (for declarative usage)
el.addEventListener('selection-change', (e) => {
  console.log('Selected:', e.detail.value);
});
```

### iOS (SwiftUI)

```swift
NavSegmentedChoiceBase(
    segments: [
        .text(value: "daily", label: "Daily"),
        .text(value: "weekly", label: "Weekly")
    ],
    selectedValue: $selection,
    onSelectionChange: { value in print(value) },
    size: .standard
)

// Icon segments
NavSegmentedChoiceBase(
    segments: [
        .icon(value: "list", icon: "list.bullet", accessibilityLabel: "List view"),
        .icon(value: "grid", icon: "square.grid.2x2", accessibilityLabel: "Grid view")
    ],
    selectedValue: $viewMode,
    size: .condensed
)

// With panel association
NavSegmentedChoiceBase(
    segments: [.text(value: "monthly", label: "Monthly"), .text(value: "onetime", label: "One-time")],
    selectedValue: $freq,
    componentId: "freq"
)
```

### Android (Jetpack Compose)

```kotlin
NavSegmentedChoiceBase(
    segments = listOf(
        SegmentOption.Text("daily", "Daily"),
        SegmentOption.Text("weekly", "Weekly")
    ),
    selectedValue = selection,
    onSelectionChange = { selection = it },
    size = NavSegmentedChoiceSize.STANDARD
)

// Icon segments
NavSegmentedChoiceBase(
    segments = listOf(
        SegmentOption.IconSegment("list", "list", "List view"),
        SegmentOption.IconSegment("grid", "grid", "Grid view")
    ),
    selectedValue = viewMode,
    onSelectionChange = { viewMode = it },
    size = NavSegmentedChoiceSize.CONDENSED
)

// With panel association
NavSegmentedChoiceBase(
    segments = listOf(
        SegmentOption.Text("monthly", "Monthly"),
        SegmentOption.Text("onetime", "One-time")
    ),
    selectedValue = freq,
    onSelectionChange = { freq = it },
    componentId = "freq"
)
```

---

## Token Dependencies

### Container

| Token | Purpose |
|-------|---------|
| `color.structure.surface` | Container background |
| `color.structure.border` | Container border color |
| `border.default` | Container border width |
| `radius.normal` | Container border-radius |
| `space.inset.050` | Container padding |
| `space.grouped.none` | Segment gap (0) |

### Indicator

| Token | Purpose |
|-------|---------|
| `color.structure.canvas` | Indicator background |
| `radius.small` | Indicator border-radius |
| `shadow.navigation.indicator` | Indicator shadow |

### Segments

| Token | Purpose |
|-------|---------|
| `color.action.navigation` | Text/icon color (all states) |
| `radius.small` | Segment border-radius |
| `fontWeight700` | Label font weight |
| `tapAreaMinimum` | Minimum segment width |
| `blend.containerHoverDarker` | Hover background (inactive, web only) |

### Animation

| Token | Purpose |
|-------|---------|
| `duration150` | Shadow out/in, resize phase timing |
| `duration350` | Glide phase timing |
| `easingAccelerate` | Shadow out easing |
| `easingStandard` | Resize easing |
| `easingGlideDecelerate` | Glide easing (piecewise linear) |
| `easingDecelerate` | Shadow in easing |

### Focus

| Token | Purpose |
|-------|---------|
| `accessibility.focus.width` | Focus ring width |
| `accessibility.focus.color` | Focus ring color |
| `accessibility.focus.offset` | Focus ring offset |

---

## Accessibility

### WCAG 2.1 AA Compliance

- **1.1.1 Non-text Content**: Icon segments announced by `accessibilityLabel`
- **1.4.13 Content on Hover**: Hover feedback on inactive segments only
- **2.1.1 Keyboard**: Full keyboard operation (arrows, Enter/Space, Tab)
- **2.3.3 Animation from Interactions**: Reduced motion disables animation
- **2.4.7 Focus Visible**: `:focus-visible` ring with accessibility tokens
- **2.5.5 Target Size**: `tapAreaMinimum` enforced per segment
- **4.1.2 Name, Role, Value**: tablist/tab roles, aria-selected, aria-controls

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus enters on selected segment; Tab again exits control |
| Arrow Left/Up | Move focus to previous segment (wraps) |
| Arrow Right/Down | Move focus to next segment (wraps) |
| Enter / Space | Select the focused segment |

### Screen Reader Behavior

- Container announced as "tab list"
- Each segment announced as "tab" with selected/unselected state
- Icon segments announced by their `accessibilityLabel`
- `aria-controls` generated when `id` prop provided (`[id]-panel-[value]`)

---

## Animation Choreography

Selection changes trigger a four-phase indicator animation:

1. **Shadow out** — shadow fades to none (150ms, accelerate easing)
2. **Resize** — width transitions to new segment (150ms, standard easing)
3. **Glide** — position slides to new segment (350ms, glide decelerate easing)
4. **Shadow in** — shadow fades back (150ms, decelerate easing)

Phases 2 and 3 run simultaneously. The glide uses a piecewise linear curve (`easingGlideDecelerate`) with aggressive deceleration and a long settling tail.

**Reduced motion**: All phases collapse to instant position change.
**Initial render**: Indicator appears at selected position without animation.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| No disabled state | Unavailable options should not be rendered |
| Text OR icon (not both) | Clean constraint; mixed content creates visual inconsistency |
| Hover on inactive only | Active segment hover is a no-op — feedback would be misleading |
| `blend.containerHoverDarker` (4%) | Segments are large surfaces — 8% would be visually heavy |
| Indicator as separate element | Enables smooth slide animation |
| Shadow choreography | Prevents heavy shadow dragging across surface |

---

## Platform-Specific Behavior

### Web
- Web Component with Shadow DOM
- CSS transitions + JS-orchestrated phase sequencing
- `prefers-reduced-motion` media query (CSS safety net + JS check)
- `:focus-visible` for keyboard-only focus indication

### iOS
- SwiftUI View with GeometryReader for equal-width segments
- `withAnimation` + `DispatchQueue.main.asyncAfter` phase sequencing
- Consumes `PiecewiseLinearEasing` CustomAnimation (iOS 17+) for glide easing
- `UIAccessibility.isReduceMotionEnabled` for reduced motion
- `@FocusState` + `.onMoveCommand` for external keyboard navigation

### Android
- Jetpack Compose with `BoxWithConstraints` for pixel-level indicator positioning
- `Animatable` + coroutine sequencing for four-phase animation
- `Modifier.shadow()` + `.clip()` for indicator shadow (not elevation)
- `Settings.Global.TRANSITION_ANIMATION_SCALE` for reduced motion
- `FocusRequester` + `onKeyEvent` for hardware keyboard navigation

---

## Related

- **Spec**: `.kiro/specs/049-nav-segmentedchoice-base/`
- **Schema**: `Nav-SegmentedChoice-Base.schema.yaml`
- **Contracts**: `contracts.yaml`
- **Component Meta**: `component-meta.yaml`
- **Design Outline**: `.kiro/specs/049-nav-segmentedchoice-base/design-outline.md`
