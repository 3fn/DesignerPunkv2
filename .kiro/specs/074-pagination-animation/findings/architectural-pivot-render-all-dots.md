# Architectural Pivot: Render-All-Dots with TranslateX Centering

**Date**: 2026-03-07
**Author**: Lina (component implementation)
**Status**: Web implemented, iOS/Android pending
**Context**: Spec 074, Task 3 — Animation Refinement

---

## Problem

The original windowed rendering model (7-node buffer: 1 left buffer + 5 visible + 1 right buffer) had a fundamental flaw: buffer nodes participated in flex layout, pushing visible nodes out of position. The left buffer consumed layout space, causing:

1. The current dot appeared one position off-center
2. The first visible dot was actually the buffer, not the intended dot
3. Manual `translateX` per-node offsets couldn't fully compensate because `transform` doesn't affect flex layout

Multiple fix attempts (negative margins, absolute positioning, track-level translateX with buffers) all fought the same root issue: buffer nodes in a flex container create layout side effects.

## Decision

Replace the windowed buffer model with a render-all-dots approach:

1. Render all `totalItems` dots (up to 50) in a flex track
2. Use a fixed-width viewport container (`overflow: hidden` + `clip-path`) showing ~5 dots
3. Center the current dot via `translateX` on the track, clamped at edges
4. CSS transition on the track's `transform` provides smooth slide animation

## Why This Is Better

- **No buffer nodes** — eliminates the entire class of layout/offset bugs
- **Centering math is explicit** — `targetX = viewportCenter - activeCenter`, clamped to `[viewportWidth - trackWidth, 0]`
- **Maps to native platform idioms** — iOS `ScrollViewReader.scrollTo(anchor: .center)`, Android `LazyRow` with `animateScrollToItem()`
- **Composes cleanly with scale** — `transform: scale()` on individual nodes, `transform: translateX()` on the track (different elements, no composition conflicts)
- **Scales naturally** — 10 items, 50 items, same code path

## Trade-offs

- Renders up to 50 Node-Base custom elements instead of 7. Each is a Shadow DOM with a style sheet. At pagination dot complexity, this is negligible — but it's more DOM than the windowed approach.
- Hardcoded pixel values in JS (`stride`, `gap`, `padding`) duplicate CSS token values. If tokens change, JS must be updated in sync. This is tech debt to address.
- The `clip-path: inset(0 2px round var(--radius-full))` uses a 2px magic number to prevent dot slivers at pill edges. Should be evaluated for whether it needs to scale with size variant.

## Impact on Shared Code

### DOM Structure (Web)
```
.pagination (overflow: hidden, clip-path, border-radius, background, box-sizing: border-box)
  .pagination__track (inline-flex, gap, translateX for centering)
    progress-indicator-node-base × totalItems (sizing="scale")
```

### Centering Math
```
activeCenter = (currentItem - 1) × (stride + gap) + (stride / 2)
targetX = (contentWidth / 2) - activeCenter
clamp: min(0, max(contentWidth - trackWidth, targetX))
```

Where `contentWidth = (maxVisible × stride) + ((maxVisible - 1) × gap)` and `trackWidth = (totalItems × stride) + ((totalItems - 1) × gap)`.

### Hardcoded Values ↔ Token Mapping
| JS Constant | sm | md | lg | Token |
|---|---|---|---|---|
| stride | 16px | 20px | 24px | `progress.node.size.{size}.current` (layout box under `sizing="scale"`) |
| gap | 4px | 4px | 8px | `space.grouped.tight` (sm/md), `space.grouped.normal` (lg) |
| padding (inline) | 8px | 8px | 12px | `space.inset.100` (sm/md), `space.inset.150` (lg) |

These are duplicated between CSS tokens and JS constants. If any token value changes, the JS must be updated manually. This is tech debt.

### Reduced Motion
- First render: `transition: none` (instant snap to position)
- Subsequent renders: `transition: transform var(--motion-selection-transition-duration) var(--motion-selection-transition-easing)`
- `prefers-reduced-motion: reduce`: always `transition: none`
- Node-level scale/color transitions handled by Node-Base's existing `@media (prefers-reduced-motion: reduce)` rule

### types.ts
- `calculateVisibleWindow()` and `PAGINATION_VISIBLE_WINDOW` are no longer used by the web implementation
- They remain in `types.ts` for now (tests still exercise them as unit tests)
- iOS and Android still use them — will be removed when those platforms are updated
- Once all platforms are updated, these can be removed or deprecated

### CSS Changes
- `.pagination` padding split to `padding-block` / `padding-inline` (larger inline for pill curve clearance)
- Added `.pagination__track` inner flex container
- Added `clip-path: inset(0 2px round var(--radius-full))` for pill-shape clipping
- Gap moved from `.pagination` to `.pagination__track`

### Token Changes
- New token consumption: `space.inset.150` (inline padding for lg)
- No new tokens created — Ada should review whether the padding split warrants a component token

## What Remains

### For Ada (token review)
- Review the padding split (`inset.075`/`inset.100` block, `inset.100`/`inset.150` inline) — is this the right token mapping or should there be a dedicated component token?
- The split-timing experimentation properties (`--motion-color-transition-duration`, `--motion-color-transition-easing`) in Node-Base CSS are still unresolved — Peter needs to experiment with timing feels
- Those properties cause 2 token-completeness test failures (they use fallback pattern, not defined in tokens.css)

### For Thurgood (test/contract review)
- `performance_virtualization` contract in `contracts.yaml` needs updating — the web platform no longer virtualizes
- Test assertions updated: "renders all nodes when totalItems > 5" (was "renders exactly 5")
- Behavioral audit needed after iOS/Android are updated
- The `calculateVisibleWindow` unit tests still pass and are still valid as function tests — but the "Virtualization — Rendered Output" tests now verify the new behavior

### For Lina (remaining implementation)
- iOS: Replace windowed `ForEach` with `ScrollViewReader` + `scrollTo(anchor: .center)`
- Android: Replace windowed `Row` with `LazyRow`/`Row` + `ScrollState` + `animateScrollTo()`
- Remove `calculateVisibleWindow` calls from both native platforms
- Update component README
- Rebuild bundle and final verification (Task 3.5)

### Spec Scope
This pivot went beyond Spec 074's original Task 3 scope (which was scale-based sizing + slide animation). The rendering architecture change should be documented as a scope expansion in the task completion doc.
