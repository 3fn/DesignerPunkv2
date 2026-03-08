# Progress-Pagination-Base

**Family**: Progress Indicator
**Type**: Semantic (Base)
**Readiness**: Development
**Platforms**: Web, iOS, Android

---

## Overview

Progress-Pagination-Base is a semantic component that composes Progress-Indicator-Node-Base primitives to create a simple pagination indicator for carousels, onboarding flows, and multi-page sequences.

It renders dots only — no connectors, no labels. State derivation is binary: the current item gets state `current`, everything else is `incomplete`.

### Key Characteristics

- Composes Node-Base only (no Connector-Base, no Label-Base)
- All nodes use `content='none'` (dots only)
- Binary state: `current` or `incomplete`
- 3 sizes: `sm`, `md`, `lg`
- Render-all-dots: all items rendered, viewport clips to ~5 visible with animated centering
- Max 50 items (dev: throws, production: warns and clamps)
- Non-interactive — navigation is handled by the parent flow
- Accessibility: `role="group"` with `aria-label` reflecting actual position

### Use Cases

- Image carousels
- Onboarding step indicators
- Multi-page form position
- Swipeable content page indicators

---

## Usage

### Web (Custom Element)

```html
<!-- Basic: 5 items, current is 3 -->
<progress-pagination-base total-items="5" current-item="3" size="sm"></progress-pagination-base>

<!-- Large set: 20 items, viewport clips to ~5 visible dots -->
<progress-pagination-base total-items="20" current-item="10" size="md"></progress-pagination-base>

<!-- Custom accessibility label -->
<progress-pagination-base
  total-items="10"
  current-item="3"
  accessibility-label="Slide 3 of 10"
></progress-pagination-base>
```

### iOS (SwiftUI)

```swift
// Basic: 5 items, current is 3, small dots
ProgressPaginationBase(totalItems: 5, currentItem: 3, size: .sm)

// Large set: 20 items, scroll centers current dot
ProgressPaginationBase(totalItems: 20, currentItem: 10, size: .md)

// Custom accessibility label
ProgressPaginationBase(
    totalItems: 10,
    currentItem: 3,
    accessibilityLabel: "Slide 3 of 10"
)
```

### Android (Jetpack Compose)

```kotlin
// Basic: 5 items, current is 3, small dots
ProgressPaginationBase(totalItems = 5, currentItem = 3, size = ProgressNodeSize.SM)

// Large set: 20 items, scroll centers current dot
ProgressPaginationBase(totalItems = 20, currentItem = 10, size = ProgressNodeSize.MD)

// Custom accessibility label
ProgressPaginationBase(
    totalItems = 10,
    currentItem = 3,
    accessibilityLabel = "Slide 3 of 10"
)
```

---

## API Reference

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `totalItems` | `number` | — | Yes | Total number of items/pages. Max 50 |
| `currentItem` | `number` | — | Yes | Current active item (1-indexed). Clamped to [1, totalItems] |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size variant for all nodes |
| `accessibilityLabel` | `string` | `'Page {currentItem} of {totalItems}'` | No | Custom accessibility label override |
| `testID` | `string` | `undefined` | No | Test identifier (web: `data-testid`, iOS: `accessibilityIdentifier`, Android: `testTag`) |

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `PAGINATION_MAX_ITEMS` | 50 | Maximum supported items |

### Validation Behavior

| Condition | Development | Production |
|-----------|-------------|------------|
| `totalItems > 50` | Throws `Error` with guidance | `console.warn` + clamp to 50 |
| `currentItem < 1` | Clamps to 1 | Clamps to 1 |
| `currentItem > totalItems` | Clamps to `totalItems` | Clamps to `totalItems` |

### Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `derivePaginationNodeState` | `(index, currentItem) → NodeState` | Returns `'current'` if index matches, `'incomplete'` otherwise |
| `clampCurrentItem` | `(currentItem, totalItems) → number` | Clamps to valid range [1, totalItems] |

---

## Composition

Progress-Pagination-Base composes a single primitive:

| Primitive | Usage | Props Passed |
|-----------|-------|--------------|
| [Node-Base](../Progress-Indicator-Node-Base/README.md) | One per item | `state` (current/incomplete), `size`, `content="none"` |

**Not composed:**
- Connector-Base — pagination uses dots without connecting lines
- Label-Base — pagination has no text labels

### Composition Diagram

```
Progress-Pagination-Base
├── viewport (fixed width, overflow clipped, pill shape)
└── track (all dots, centered via platform-native scrolling)
    └── Node-Base × totalItems
        ├── state = derivePaginationNodeState(index, currentItem)
        ├── size = props.size
        └── content = "none" (always dots)
```

---

## Rendering Architecture

All `totalItems` dots are rendered in the DOM. A fixed-width viewport clips to ~5 visible dots. The current dot is centered by translating the track (web) or native scroll centering (iOS/Android), clamped at edges to prevent overscroll.

### Viewport Behavior

| Condition | Behavior |
|-----------|----------|
| `totalItems ≤ 5` | All dots visible, no clipping needed |
| `totalItems > 5` | Viewport clips to ~5 visible, track centers current dot |
| Current near start | First dot at left edge (no overscroll) |
| Current near end | Last dot at right edge (no overscroll) |

### Animation

State transitions and track centering use split timing for a polished feel:

| Animation | Token | Duration | Easing | Description |
|-----------|-------|----------|--------|-------------|
| Dot scale | `motion.selectionTransition` | 250ms | easingStandard | Snappy state change |
| Dot color | `motion.settleTransition` | 350ms | easingDecelerate | Smooth follow-through |
| Track slide | `motion.settleTransition` | 350ms | easingDecelerate | Smooth follow-through |

- First render snaps to position without animation
- Animation disabled when reduced motion preference is active
- ARIA announcements update immediately, never delayed by animation

---

## Token Dependencies

### Component Size Tokens (`progress.node.size.*`)

| Token | Value | Usage |
|-------|-------|-------|
| `progress.node.size.sm` | 12px | Small node base size |
| `progress.node.size.md` | 16px | Medium node base size |
| `progress.node.size.lg` | 20px | Large node base size |
| `progress.node.size.sm.current` | 16px | Small current emphasis (+4px) |
| `progress.node.size.md.current` | 20px | Medium current emphasis (+4px) |
| `progress.node.size.lg.current` | 24px | Large current emphasis (+4px) |

### Component Gap Tokens (`space.grouped.*`)

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `space.grouped.tight` | 4px | `space050` | Gap between sm/md nodes |
| `space.grouped.normal` | 8px | `space100` | Gap between lg nodes |

### Container Tokens

| Token | Value | Primitive | Usage |
|-------|-------|-----------|-------|
| `color.scrim.standard` | rgba(0,0,0,0.80) | `black500` @ `opacity080` | Container background |
| `radius.full` | 9999px | `radiusMax` | Pill shape (Capsule) |
| `space.inset.075` | 6px | `space075` | Block padding (sm/md) |
| `space.inset.100` | 8px | `space100` | Block padding (lg), inline padding (sm/md) |
| `space.inset.150` | 12px | `space150` | Inline padding (lg) |

### Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `motion.selectionTransition` | 250ms / easingStandard | Dot scale animation |
| `motion.settleTransition` | 350ms / easingDecelerate | Dot color + track slide animation |

### Semantic Color Tokens (via Node-Base)

Color tokens are applied by the Node-Base primitive, not directly by Pagination-Base:

| Token | Primitive | State |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | Current node |
| `color.progress.pending.background` | `white300` | Incomplete nodes |

---

## Accessibility

### ARIA Implementation

| Platform | Role | Label |
|----------|------|-------|
| Web | `role="group"` | `aria-label="Page {currentItem} of {totalItems}"` |
| iOS | Grouped element | `accessibilityLabel("Page {currentItem} of {totalItems}")` |
| Android | Semantics block | `contentDescription = "Page {currentItem} of {totalItems}"` |

### Key Accessibility Behaviors

- ARIA label always reflects actual position (e.g., "Page 26 of 50")
- Custom `accessibilityLabel` prop overrides the default label
- Current node has non-color differentiation via +4px size emphasis
- Animation disabled when reduced motion preference is active

### WCAG 2.1 AA Compliance

- **1.3.1 Info and Relationships**: `role="group"` with descriptive `aria-label`
- **1.4.11 Non-text Contrast**: Current node size emphasis provides non-color differentiation
- **2.3.3 Animation from Interactions**: Respects reduced motion preferences on all platforms
- **4.1.2 Name, Role, Value**: `aria-label` reflects actual position

---

## Platform-Specific Notes

### Web
- Custom Element: `<progress-pagination-base>`
- Shadow DOM with `.pagination` (viewport) → `.pagination__track` (flex container) → Node-Base elements
- Track centering via `translateX`, CSS transition on transform
- `overflow: hidden` + `clip-path: inset(0 2px round var(--radius-full))` clips to pill shape
- Split padding: `padding-inline` one tier larger than `padding-block` for pill curve clearance
- `box-sizing: border-box` so width includes padding
- Attributes use kebab-case: `total-items`, `current-item`, `accessibility-label`, `test-id`

### iOS
- SwiftUI `View` struct: `ProgressPaginationBase`
- `ScrollViewReader` + `scrollTo(id, anchor: .center)` for native centering
- `ScrollView(.horizontal)` with `.scrollDisabled(true)` (programmatic scroll only)
- Container: `.background(colorScrimStandard)` → `.clipShape(Capsule())`
- Split padding: `.padding(.horizontal)` one tier larger than `.padding(.vertical)`
- Accessibility: `.accessibilityElement(children: .ignore)` with `.accessibilityLabel`

### Android
- Jetpack Compose `@Composable` function: `ProgressPaginationBase`
- `LazyRow` with `rememberLazyListState()` + `animateScrollToItem()` for native centering
- `userScrollEnabled = false` (programmatic scroll only)
- Container: `.background(color_scrim_standard, RoundedCornerShape(50%))` → `.clip()`
- Split padding via `PaddingValues(horizontal, vertical)`
- Accessibility: `semantics { contentDescription = ... }`

---

## Related Documentation

- [Node-Base](../Progress-Indicator-Node-Base/README.md) — Primitive node composed by this component
- [Connector-Base](../Progress-Indicator-Connector-Base/README.md) — Primitive connector (not used by Pagination)
- [Label-Base](../Progress-Indicator-Label-Base/README.md) — Primitive label (not used by Pagination)
- [Stepper-Base](../Progress-Stepper-Base/README.md) — Semantic variant: nodes + connectors
- [Stepper-Detailed](../Progress-Stepper-Detailed/README.md) — Semantic variant: nodes + connectors + labels
- [Spec Requirements](/.kiro/specs/048-progress-family/requirements.md) — Requirements 2.1–2.12, 7.1–7.2, 8.1–8.3, 9.1–9.7, 10.1–10.2, 11.1–11.6
- [Spec Design](/.kiro/specs/048-progress-family/design.md) — Design specification
