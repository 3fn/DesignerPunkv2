# Thurgood: Contract Audit — performance_virtualization

**Date**: 2026-03-07
**Author**: Thurgood (contract audit)
**For**: Lina (contract update implementation)
**Context**: Spec 074, Task 3.7 — Contract alignment after render-all-dots pivot
**Status**: Audit complete, ready for Lina to implement

---

## Summary

The `performance_virtualization` contract in `contracts.yaml` describes the old windowed 7-node buffer model. Web now uses render-all-dots with translateX track centering. The contract needs a full rewrite. The tests have already been updated to match the new behavior, but the contract YAML has not.

---

## Assertion-by-Assertion Audit

| Contract Assertion | Contract Says | Actual Behavior (Web) | Status |
|---|---|---|---|
| "Renders max 5 visible nodes" | Yes | No — renders all `totalItems` nodes | **Wrong** |
| "Only 5 nodes rendered when totalItems > 5" | Yes | No — all nodes rendered, viewport clips to ~5 | **Wrong** |
| "Pages 1-3: show nodes 1-5" | Window logic | N/A — no windowing | **Obsolete** |
| "Center current at position 3" | Window logic | Track translateX centers current dot | **Mechanically different** |
| "Last 3 pages: show last 5 nodes" | Window logic | Clamp prevents overscroll at edges | **Mechanically different** |
| "Nodes animate state transitions" | Yes | Yes — scale + color transitions | **Correct** |
| "Animation disabled for reduced motion" | Yes | Yes — `transition: none` | **Correct** |
| "ARIA announcements not delayed" | Yes | Yes — aria-label updates immediately | **Correct** |

---

## Recommendation: Rename and Rewrite

### Rename
`performance_virtualization` → `rendering_and_animation`

The web platform no longer virtualizes. The contract's behavioral intent (efficient rendering + viewport management + animation + reduced motion) is still valid, but the name is misleading.

### Proposed Contract

```yaml
  rendering_and_animation:
    category: performance
    description: Renders dots with viewport clipping and animated centering
    behavior: |
      Web: Renders all totalItems dots in a flex track inside a fixed-width
      viewport. The viewport clips to ~5 visible dots via overflow:hidden and
      clip-path. The current dot is centered by translating the track, clamped
      at edges to prevent overscroll. Track translation animates via CSS
      transition using motion.selectionTransition timing (250ms,
      easingStandard). Node state transitions (scale + color) animate
      independently via Node-Base CSS.

      iOS: Uses ScrollViewReader with scrollTo(anchor: .center) for native
      scroll centering. All dots rendered in HStack.

      Android: Uses LazyRow/ScrollState with animateScrollToItem() for native
      scroll centering. All dots rendered.

      All platforms: Animation is disabled when the platform's reduced-motion
      preference is active (web: prefers-reduced-motion: reduce, iOS:
      isReduceMotionEnabled, Android: ANIMATOR_DURATION_SCALE == 0).
      First render snaps to position without animation.
    wcag: "2.3.3 Animation from Interactions"
    platforms: [web, ios, android]
    validation:
      - totalItems ≤ 5 renders all nodes without clipping
      - totalItems > 5 renders all nodes with viewport clipping to ~5 visible
      - Current dot centered in viewport when not at edges
      - First dot at left edge when currentItem is near start
      - Last dot at right edge when currentItem is near end
      - Track translation animates on currentItem change
      - Node state transitions (scale, color) animate on currentItem change
      - Animation disabled when platform reduced-motion preference is active
      - First render positions without animation (no slide-in on mount)
      - ARIA announcements not delayed by animation
    test_approach: |
      Render with totalItems=10, currentItem=5. Verify all 10 nodes rendered.
      Verify track has translateX centering the current dot. Change currentItem
      and verify transition CSS is applied to track. Enable
      prefers-reduced-motion and verify transition is none. Verify first render
      has no transition. Verify aria-label updates immediately regardless of
      animation state.
    required: true
```

---

## Additional Finding: `composition_node_only` Contract

The `composition_node_only` contract says:

> "Composes Progress-Indicator-Node-Base for each visible item."

The phrase "visible item" is ambiguous post-pivot — could mean "visible in the viewport" or "all items." The tests correctly assert `nodes.length === totalItems`, so the behavior is right. The contract language should say "for each item" instead of "for each visible item."

### Proposed Fix

```yaml
# In composition_node_only, change:
behavior: |
  Composes Progress-Indicator-Node-Base for each item.
  # (was: "for each visible item")
```

Minor, but worth cleaning up in the same pass.

---

## Test State

The test file (`PaginationBase.test.ts`) has already been updated:
- `'renders all nodes when totalItems > 5 (native scroll handles viewport)'` asserts `nodes.length === 20` ✅
- The "Virtualization — calculateVisibleWindow" tests still pass as function-level unit tests (the function exists and works) but are no longer behavioral contract tests for web — they're orphaned. Disposition deferred to Task 3.12 when all platforms are off the windowed model.

---

## What Lina Needs to Do

1. Replace `performance_virtualization` with `rendering_and_animation` in `contracts.yaml` (use proposed contract above or adapt)
2. Update `composition_node_only` behavior text: "for each item" not "for each visible item"
3. No test changes needed — tests already match the new behavior

---

## References

- `findings/architectural-pivot-render-all-dots.md` — pivot decision record
- `design-outline-task3.md` — updated design outline with render-all-dots architecture
- `tasks.md` Task 3.7 — this task's definition and gate context
