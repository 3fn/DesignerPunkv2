# Task 3.10 Completion: iOS Native Scroll Centering

**Date**: 2026-03-08
**Spec**: 074 — Pagination Animation
**Task**: 3.10 — iOS: Native scroll centering
**Agent**: Lina
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Replaced the windowed `ForEach` rendering model with render-all-dots + `ScrollViewReader` / `scrollTo(anchor: .center)` on iOS. Matches the web architecture (render all dots, clip viewport to ~5 visible, center current dot).

---

## Changes

### ProgressPaginationBase.ios.swift

- Removed `paginationVisibleWindow` constant
- Removed `calculateVisibleWindow()` function
- Removed `visibleWindow` computed property
- Added `ScrollViewReader` + `ScrollView(.horizontal)` wrapping all dots
- `ForEach(1...totalItems)` renders all dots (not windowed subset)
- `.scrollTo(currentItem, anchor: .center)` centers current dot
- `.scrollDisabled(true)` prevents user scroll (programmatic only)
- `.onAppear` snaps to position without animation (first render)
- `.onChange(of: currentItem)` animates scroll with `settleTransition` (350ms/easingDecelerate)
- Reduced motion: `scrollTo` without `withAnimation` wrapper
- Split padding: `.vertical` uses inset075/inset100, `.horizontal` uses inset100/inset150 (larger for pill curve clearance)
- Fixed viewport width via `viewportWidth` computed property using `size.currentSize`
- State transitions (size/color) still animate via `.animation(stateAnimation, value: currentItem)` using `selectionTransition` (250ms)

### ProgressPlatformParity.test.ts

- Updated "web and iOS render same node count" test — now asserts render-all-dots (no `calculateVisibleWindow` in either platform's own implementation)
- Updated "web and Android render same node count" test — acknowledges Android still uses windowed model (pending 3.11)
- Web assertion reads platform file directly to avoid false positive from concatenated `types.ts`

---

## Split-Timing on iOS

| Animation | Token | Duration | Easing |
|-----------|-------|----------|--------|
| Node state (size/color) | `selectionTransition` | 250ms | easeInOut |
| Scroll centering | `settleTransition` | 350ms | easeOut |

---

## Flag: iOS lg currentSize Discrepancy

iOS Node-Base defines `lg.currentSize = 28`, while web uses 24 (`progress.node.size.lg.current`). This is pre-existing in Node-Base, not introduced by this change. The viewport width calculation uses the iOS value consistently, so the component renders correctly. Worth flagging for Ada to review whether the iOS token mapping is stale.

---

## Verification

- Platform parity tests: 32/32 passed ✅
- Full suite: 291 suites, 7457 tests, 0 failures ✅
