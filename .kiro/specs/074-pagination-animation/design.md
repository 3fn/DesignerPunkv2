# Design Document: Pagination Animation

**Date**: 2026-03-07
**Spec**: 074 - Pagination Animation
**Status**: Design Phase
**Dependencies**: Spec 072 (Pagination Container Styling) — ✅ Complete

---

## Overview

Add animated state transitions and scroll animation to Progress-Pagination-Base across all platforms. The sliding window algorithm is unchanged — this spec adds visual animation to the existing positional logic. Includes prerequisite fixes for Node-Base rendering bugs, token pipeline build integration, and an iOS motion token type issue.

---

## Architecture

### Web DOM Strategy Change

The current `render()` method rebuilds the entire Shadow DOM on every attribute change (`innerHTML` replacement). This must change to incremental updates for CSS transitions to work.

**Current flow:**
```
attributeChangedCallback → render() → this._shadowRoot.innerHTML = <style> + <div> + N × <node-base>
```

**New flow:**
```
connectedCallback → create <style>, <div>, 5 × <node-base> once
attributeChangedCallback → _render() → update <div> class/aria-label, update each <node-base> state/size attributes
```

The `<progress-indicator-node-base>` custom element already observes `state`, `size`, and `content` via its own `attributeChangedCallback`. Updating attributes on persistent elements triggers the node's internal re-render, and CSS transitions fire because the element was never destroyed.

### Platform Animation Approaches

| Platform | Strategy | Mechanism |
|----------|----------|-----------|
| Web | Incremental DOM + CSS transitions | `transition` property on node elements, `motion.selectionTransition` timing |
| iOS | SwiftUI implicit animation | `.animation(.easeInOut(duration:))` modifier using `motion.selectionTransition` values |
| Android | Compose animation APIs | `animateXAsState` with `tween(durationMillis, easing)` using `motion.selectionTransition` values |

---

## Motion Token Usage

| Animation | Token | Duration | Easing | Rationale |
|-----------|-------|----------|--------|-----------|
| Node state change (size + color) | `motion.selectionTransition` | 250ms | easingStandard | Node current↔incomplete is a selection state change |
| Window scroll (dot repositioning) | `motion.selectionTransition` | 250ms | easingStandard | Unified timing for smooth feel; can split later if needed |

Platform resolution:
- Web: `transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)`
- iOS: `Animation.timingCurve(0.4, 0.0, 0.2, 1, duration: 0.25)`
- Android: `tween(durationMillis = 250, easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f))`

---

## Components and Interfaces

### Web — CSS Transitions

Add to `ProgressPaginationBase.styles.css`:
```css
progress-indicator-node-base {
  transition: all var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
}

@media (prefers-reduced-motion: reduce) {
  progress-indicator-node-base {
    transition: none;
  }
}
```

Note: The `transition` targets the custom element itself. The node's internal Shadow DOM handles its own size/color rendering — the transition on the outer element animates any layout changes (position within flex container). State-driven size/color animation may need to be applied within Node-Base's own styles. Lina to determine the correct transition target during implementation.

### Web — Incremental DOM Refactor

In `ProgressPaginationBase.web.ts`:

1. `connectedCallback`: Create `<style>`, container `<div>`, and 5 `<progress-indicator-node-base>` elements. Store references.
2. `_render()`: Update container class and aria-label. Loop through stored node references, update `state` and `size` attributes. Add/remove nodes only when visible count changes.
3. Remove `innerHTML` assignment from render path.

### iOS — SwiftUI Animation

Add `.animation()` modifier to the `ForEach` content or individual node views:
```swift
.animation(.timingCurve(0.4, 0.0, 0.2, 1, duration: 0.25), value: currentItem)
```

Reduced motion: check `UIAccessibility.isReduceMotionEnabled` and conditionally omit the `.animation()` modifier.

### Android — Compose Animation

Use `animateXAsState` for node properties:
```kotlin
val animatedSize by animateDpAsState(
    targetValue = if (isCurrent) currentSize else incompleteSize,
    animationSpec = tween(durationMillis = 250, easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f))
)
```

Reduced motion: check `Settings.Global.ANIMATOR_DURATION_SCALE` and use `snap()` spec instead of `tween()`.

---

## Token Pipeline Fix

### Changes

1. Add npm script: `"generate:platform-tokens": "ts-node scripts/generate-platform-tokens.ts"`
2. Wire into build: `prebuild` runs `generate:platform-tokens` (1.5s overhead)
3. Flip source priority in `build-browser-bundles.js`: `dist/` first, `output/` fallback (or remove `output/` entries)
4. Fix iOS generator: motion token shorthand constants use `Motion` type wrapper instead of `Typography`

---

## Data Models

No data model changes.

---

## Error Handling

No new error conditions from animation. The Node-Base rendering fixes (Requirement 6) address existing bugs.

---

## Testing Strategy

### Validation Gate: DOM Refactor

After the web DOM strategy refactor (Requirement 3) and before any animation code:
- Run full existing behavioral test suite: `npm test -- PaginationBase.test.ts`
- All tests must pass with zero failures
- This isolates refactor regressions from animation regressions

### Animation Tests

- Node state animation fires on `currentItem` change (web: verify transition CSS is applied)
- Scroll animation fires when visible window shifts
- `prefers-reduced-motion: reduce` disables all animation (web)
- Platform-equivalent reduced motion checks (iOS, Android)
- ARIA announcements not delayed by animation
- All existing behavioral contracts still pass

### Node-Base Fix Tests

- 5 nodes render when `totalItems >= 5`
- Current node displays size emphasis and distinct color
- No invalid `size` attribute passed to `<icon-base>`

---

## Design Decisions

### Decision 1: Separate Spec from 072

072 is visual-only (container styling). This spec changes behavioral contracts (animation, DOM strategy). Keeping them separate means 072 ships independently.

### Decision 2: Token-Based Animation Timing

`motion.selectionTransition` (250ms, easingStandard) for both state transitions and scroll. Unified timing for smooth feel. A dedicated scroll token would be premature for a single consumer — can split later if scroll timing needs independent tuning.

### Decision 3: Prerequisites Bundled

Node-Base rendering fixes, token pipeline fix, and iOS motion type fix are bundled as prerequisite tasks rather than separate specs. All three are small, well-scoped fixes that directly block 074's validation. Separate specs would be overhead.

### Decision 4: DOM Refactor Validation Gate

The web DOM strategy refactor is tested in isolation before animation code is added. This ensures the refactor doesn't introduce behavioral regressions that get masked by animation changes.
