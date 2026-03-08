# Design Outline: Pagination Animation Refinement (Task 3)

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Status**: Issue 1 implemented ✅, Issue 2 implemented ✅ (architectural pivot — see below)

---

## Problem Statement

Two animation issues identified during demo verification of Task 2:

### Issue 1: Layout Twitch on State Transition

When a node transitions between `incomplete` and `current`, the CSS animates actual `width`/`height` properties (e.g., 16px → 20px for md). This causes the node's layout box to grow/shrink, which pushes sibling nodes and triggers a visible twitch/jump in the flex container. The gap between dots shifts during the transition.

**Root cause**: Animating layout-affecting properties (`width`, `height`) instead of transform-only properties.

### Issue 2: Scroll Animation Lacks Positional Movement

When `currentItem` changes and the visible window shifts (e.g., page 5 → 6 in a 10-page set), all 5 nodes simultaneously swap their state attributes. The "current" emphasis appears to stay in the same position (position 3) because the node at position 3 simply changes from `incomplete` to `current`. There's no visual sense of the dots sliding left/right.

**Root cause**: The current animation only transitions node *properties* (size, color). There is no *positional* animation — nodes don't move within the container.

**What Peter expected**: The dot row should appear to slide, with the new current dot animating into the anchor position — similar to iOS `UIPageControl` behavior.

---

## Proposed Approach

### Issue 1 Fix: Transform-Based Size Emphasis

Replace `width`/`height` animation with `transform: scale()`, scoped via a new `sizing="scale"` attribute on Node-Base (Option B — approved by Ada, Lina, Thurgood, Peter).

**Scoping decision**: Node-Base is shared by Pagination-Base and Steppers. Steppers render content (checkmarks, icons) that must not be scaled. The scale behavior is opt-in via `sizing="scale"` — Pagination-Base sets this attribute on its nodes, Steppers don't. See `findings/scale-scoping-decision.md` for full analysis.

Each node gets a fixed layout box at the **current-state size** (the larger size). The visual circle renders at the base size by default via `transform: scale()`, and scales up to 1.0 when `current`. This means:

- The layout box never changes size → no sibling displacement → no twitch
- `transform: scale()` is GPU-composited → smoother animation, no layout reflow
- The flex gap stays constant throughout the transition

**Scale calculation example (md)**:
- Current size: 20px (the layout box)
- Base size: 16px
- Scale for inactive: 16/20 = 0.80
- Scale for current: 1.0

**Token mapping**:
| Variant | Layout box | Inactive scale | Current scale |
|---------|-----------|----------------|---------------|
| sm | `node.size.sm.current` (16px) | 0.75 (12/16) | 1.0 |
| md | `node.size.md.current` (20px) | 0.80 (16/20) | 1.0 |
| lg | `node.size.lg.current` (24px) | 0.833 (20/24) | 1.0 |

**Implementation note (Lina)**: Scale ratios may be computable via `calc(var(--base) / var(--current))` instead of hardcoded per variant. Needs verification that CSS `calc()` produces unitless values for `transform: scale()`.

**Gap spacing note (Lina concern #1)**: Fixed layout boxes at current-state size will increase the visual gap between inactive dots (invisible space around scaled-down dots). Evaluate visually after implementation — the larger gap may look fine for pagination dots. If not, address as a follow-up within 3.1.

**CSS approach**:
```css
/* Default: width/height sizing (steppers, unchanged) */
.node { width: var(...); height: var(...); }

/* Scale sizing (pagination, opt-in) */
:host([sizing="scale"]) .node {
  width: var(--progress-node-size-{size}-current);
  height: var(--progress-node-size-{size}-current);
  transform: scale(0.80);
  transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing),
              background-color var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}
:host([sizing="scale"]) .node--current {
  transform: scale(1.0);
}
```

**Counter-argument**: Scale-based sizing means the inactive dots are technically rendered at the current size and scaled down. This could produce slightly softer edges at small sizes due to subpixel rendering. At 12-24px dot sizes, this is likely imperceptible — but worth checking on low-DPI displays.

### Issue 2 Fix: Render-All-Dots with TranslateX Track Centering

> **Architectural pivot**: The original approach (per-node `translateX` with buffer nodes in a windowed model) was implemented but had a fundamental flaw — buffer nodes participated in flex layout, pushing visible nodes out of position. After multiple fix attempts, the rendering architecture was replaced entirely. See `findings/architectural-pivot-render-all-dots.md` for the full decision record.

**New approach**: Render all `totalItems` dots (up to 50) in a flex track inside a fixed-width clipping viewport. Center the current dot by translating the track.

**DOM structure (web)**:
```
.pagination (overflow: hidden, clip-path, border-radius, background, box-sizing: border-box)
  .pagination__track (inline-flex, gap, translateX for centering)
    progress-indicator-node-base × totalItems (sizing="scale")
```

**Centering math**:
```
stride = layout box size (current-state size, same for all nodes under sizing="scale")
activeCenter = (currentItem - 1) × (stride + gap) + (stride / 2)
contentWidth = (maxVisible × stride) + ((maxVisible - 1) × gap)
targetX = (contentWidth / 2) - activeCenter
clamp: min(0, max(contentWidth - trackWidth, targetX))
```

The clamp ensures the track never overscrolls — no empty space at either end. At page 1, the first dot sits at the left edge. At the last page, the last dot sits at the right edge. In the middle, the current dot is centered.

**Viewport sizing**:
The container width shows ~5 dots using `box-sizing: border-box`:
```
width = contentWidth + (padding × 2)
```

| Variant | stride | gap | padding (inline) | viewport |
|---------|--------|-----|------------------|----------|
| sm | 16px | 4px | 8px | 112px |
| md | 20px | 4px | 8px | 132px |
| lg | 24px | 8px | 12px | 176px |

**Clipping**: `overflow: hidden` clips to the rectangular box. `clip-path: inset(0 2px round var(--radius-full))` clips to the pill shape, preventing dot slivers at the rounded corners. The 2px inset is a visual correction — not token-derived.

**Padding split**: The container uses `padding-block` (vertical) and `padding-inline` (horizontal) separately. Inline padding is one token step larger than block padding to provide clearance for the pill curve:
- sm/md: `padding-block: space.inset.075` (6px), `padding-inline: space.inset.100` (8px)
- lg: `padding-block: space.inset.100` (8px), `padding-inline: space.inset.150` (12px)

**Animation**: The track's `translateX` is animated via CSS transition:
- First render: `transition: none` (instant snap)
- Subsequent renders: `transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing)`
- `prefers-reduced-motion: reduce`: always `transition: none`

Node-level scale and color transitions are handled by Node-Base's own CSS (unchanged from Issue 1).

**Counter-argument**: Renders up to 50 Shadow DOM elements instead of 7. At pagination dot complexity this is negligible, but it's more DOM. The hardcoded pixel values in JS (stride, gap, padding) duplicate CSS token values — if tokens change, JS must be updated manually. See `findings/architectural-pivot-render-all-dots.md` "Risks and Concerns" for details.

---

## Platform Considerations

### Web — ✅ Implemented
Render-all-dots with translateX track centering as described above.

### iOS — Pending
SwiftUI has native scroll centering via `ScrollViewReader` + `scrollTo(id, anchor: .center)`:
```swift
ScrollView(.horizontal, showsIndicators: false) {
    HStack(spacing: gap) {
        ForEach(1...totalItems, id: \.self) { index in
            ProgressIndicatorNodeBase(
                state: derivePaginationNodeState(index: index, currentItem: currentItem),
                size: size,
                content: .none
            )
            .id(index)
        }
    }
}
.scrollTargetLayout()
```
With `ScrollViewReader { proxy in ... proxy.scrollTo(currentItem, anchor: .center) }` on change.

Reduced motion: check `UIAccessibility.isReduceMotionEnabled`, use `nil` animation when true.

The `calculateVisibleWindow` function and windowed `ForEach` are removed.

### Android — Pending
Compose has `LazyRow` with `LazyListState` + `animateScrollToItem()`, or a `Row` inside a horizontally scrollable `ScrollState` with `animateScrollTo()`:
```kotlin
val listState = rememberLazyListState()
LazyRow(state = listState, horizontalArrangement = Arrangement.spacedBy(gap)) {
    items(totalItems) { index ->
        ProgressIndicatorNodeBase(
            state = derivePaginationNodeState(index + 1, currentItem),
            size = size,
            content = ProgressNodeContent.NONE
        )
    }
}
LaunchedEffect(currentItem) {
    listState.animateScrollToItem(currentItem - 1)
}
```

Reduced motion: check `Settings.Global.ANIMATOR_DURATION_SCALE`, use `scrollToItem()` (no animation) when reduced.

The `calculateVisibleWindow` function and windowed `Row` loop are removed.

---

## Resolved Questions

### For Peter — ✅ All resolved
1. **Large jumps**: Navigation is one-by-one (prev/next), window shifts by one position. Single-position slide animation always.
2. **Slide direction**: Dots slide left on forward, right on backward.
3. **iOS/Android priority**: Web first, validate, then native.
4. **Rendering architecture**: Render-all-dots approved over windowed buffer model.

### Cross-Component Scoping — ✅ Resolved
**Decision**: Option B — `sizing="scale"` attribute on Node-Base (unanimous: Ada, Lina, Thurgood, Peter).
- `sizing="scale"` naming chosen over `layout="fixed"` to avoid CSS `position: fixed` collision
- See `findings/scale-scoping-decision.md` for full analysis and all three agents' assessments
- Schema update to `Progress-Indicator-Node-Base.schema.yaml` required (optional string enum, default absent)

### For Ada — ✅ Resolved
4. **Scale values as tokens?** No. Derived from existing size token ratios, not independent design decisions. Do not tokenize.

### Lina's Concerns — ✅ Addressed
- **#1 Gap spacing**: Evaluated visually — acceptable with current token values.
- **#3 Cross-component**: Resolved via `sizing="scale"` scoping (Option B).
- **#5 Reduced motion for slide**: Implemented — track transition set to `none` when `prefers-reduced-motion: reduce`.

---

## Scope

### Completed (Web)
- Issue 1: Scale-based sizing via `sizing="scale"` on Node-Base ✅
- Issue 2: Render-all-dots with translateX track centering ✅
- Clip-path pill masking ✅
- Split inline/block padding ✅
- Reduced motion support ✅
- Tests updated ✅
- Browser bundle rebuilt ✅
- Peter demo verification ✅

### Remaining
- iOS: Implement native scroll centering (Task 3.10)
- Android: Implement native scroll centering (Task 3.11)
- Update `performance_virtualization` contract (Task 3.7)
- Resolve split-timing token question (Task 3.4)
- Resolve token-completeness test failures (Task 3.8)
- Update component README (Task 3.12)
- Update demo page text (Task 3.13)
- Remove `calculateVisibleWindow` from types.ts after all platforms updated
- Final rebuild + behavioral audit (Task 3.15)
