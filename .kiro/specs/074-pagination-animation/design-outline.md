# Pagination Animation — Design Outline

**Date**: March 7, 2026
**Spec**: 074 - Pagination Animation
**Purpose**: Add state transition and scroll animations to Progress-Pagination-Base
**Status**: Design Outline (Ready for Formalization)
**Prior Spec**: 048-progress-family (original implementation)
**Depends On**: Spec 072 (Pagination Container Styling) — ✅ Complete
**Platforms**: Web, iOS, Android

---

## Context

The existing `performance_virtualization` contract in Progress-Pagination-Base implements a sliding window algorithm that already positions the current node correctly:
- Nodes 1–3: show nodes 1–5
- Nodes 4 to (totalItems - 3): center current at position 3
- Last 3 pages: show last 5 nodes

The positional logic is correct. What's missing is animation — the window currently shifts immediately with a full DOM rebuild (`innerHTML` replacement). This spec adds:
1. State transition animation (size and color when a node changes between current/incomplete)
2. Scroll animation (dots sliding when the visible window shifts)

### Spec 072 Baseline (Completed)

Spec 072 established the container styling that animation will operate within:

- **Container**: Dark translucent pill — `color.scrim.standard` (rgba(0,0,0,0.80)) background, `radius.full` (Capsule/pill shape)
- **Padding**: `space.inset.075` (sm/md), `space.inset.100` (lg)
- **Gap**: `space.grouped.tight` (sm/md = 4px), `space.grouped.normal` (lg = 8px)
- **Web CSS**: Container styles in `ProgressPaginationBase.styles.css`, injected into Shadow DOM via `<style>` tag. Sm/md share a single CSS rule; lg has its own.
- **iOS**: HStack modifiers — `.padding()` → `.background()` → `.clipShape(Capsule())`
- **Android**: Row modifiers — `.background(color, shape)` → `.padding()`
- **Gap tokens**: `PaginationGap` enum (iOS) and `paginationGap()` function (Android) now use semantic tokens (`spaceGroupedTight`/`spaceGroupedNormal`) instead of hardcoded/primitive values

### Known Node-Base Rendering Issues

The browser demo reveals two pre-existing Node-Base rendering problems that must be resolved before animation can be visually validated:

1. **Missing 5th dot**: Only 4 of 5 expected nodes render in the demo. Root cause TBD — may be a Node-Base Shadow DOM rendering issue or a timing issue with nested custom element registration.
2. **No current state emphasis**: The current node doesn't display the +4px size emphasis or distinct color. The tokens (`--color-progress-current-background`, `--progress-node-size-*-current`) are present in `tokens.css`, so this is likely a Node-Base rendering bug.
3. **Known Issue 4** (`.kiro/issues/web-component-demo-rendering-issues.md`): Node-Base passes invalid `size="18"` to `<icon-base>` for lg nodes, flooding the console with errors.

These are Node-Base primitive bugs, not Pagination-Base bugs. However, 074 should include a prerequisite task to fix or work around them, since animation validation requires all nodes to render correctly.

---

## Scope

### What Changes

| Aspect | Current (Post-072) | Proposed |
|--------|---------|----------|
| Container styling | Dark translucent pill (scrim background, capsule shape, padding, gap) | Unchanged — animation operates within existing container |
| Node state transitions | Instant (DOM rebuild) | Animated size and color (CSS transitions, default timing) |
| Window scroll | Instant (DOM rebuild) | Animated slide (one node at a time) |
| DOM update strategy (web) | Full `innerHTML` replacement per render | Incremental DOM updates (required for CSS transitions to work) |
| DOM update strategy (iOS) | SwiftUI `ForEach` rebuild | SwiftUI implicit animations (`.animation()` modifier) |
| DOM update strategy (Android) | Compose recomposition | Compose `animateXAsState` APIs |
| `prefers-reduced-motion` | Not applicable (no animation) | Respected — disable or minimize animation |

### What Does NOT Change

- Sliding window algorithm (`calculateVisibleWindow` in `types.ts`) — positional logic is unchanged
- Component API (props, types, constants)
- Accessibility contract (ARIA label still reflects actual position)
- State derivation contract (binary: current vs incomplete)
- Composition contract (Node-Base primitives only, no connectors, no labels)
- Maximum items (50), visible window size (5)

---

## Key Technical Consideration

The current web implementation uses `innerHTML` replacement on every render — the entire Shadow DOM content (style tag + container div + all node elements) is rebuilt from scratch. CSS transitions require DOM element continuity — you can't animate an element that was destroyed and recreated. The render strategy must change from full replacement to incremental updates (reuse existing node elements, update their attributes).

This is the core implementation challenge. The animation CSS itself is straightforward; the DOM update strategy change is the real work.

### Web Implementation Details (from 072)

- **Shadow DOM structure**: `this._shadowRoot.innerHTML` sets a `<style>` block (with `paginationStyles` imported as string) + a `<div class="pagination pagination--{size}">` container + N `<progress-indicator-node-base>` child elements
- **Container classes**: `pagination` (base) + `pagination--{size}` (variant). Sm/md share one CSS rule, lg has its own.
- **Node generation**: A `for` loop from `window.start` to `window.end` builds HTML string with `state`, `size`, and `content="none"` attributes
- **Render trigger**: `attributeChangedCallback` calls `_render()` on any observed attribute change (`total-items`, `current-item`, `size`, `accessibility-label`, `test-id`)

The incremental update approach needs to preserve the `<style>` and container `<div>`, and only update/add/remove child `<progress-indicator-node-base>` elements within it.

### iOS/Android Considerations

- **iOS**: SwiftUI's `ForEach` with `id: \.self` already provides element identity. Adding `.animation()` modifier to the HStack or individual nodes may be sufficient for implicit animation. The 072 modifier chain (`.padding()` → `.background()` → `.clipShape(Capsule())`) should not interfere with animation modifiers.
- **Android**: Compose recomposition with `animateXAsState` APIs. The 072 modifier chain (`.background(color, shape)` → `.padding()`) is applied to the Row and should not conflict with animation on child composables.

---

## Contract Update

The `performance_virtualization` contract in `contracts.yaml` currently states:

> "Window shifts immediately (no animation)."

This must be updated to:

> "Window shifts with animated transition. When the visible window changes, nodes animate to their new states (size and color) using `motion.selectionTransition` timing. Animation is disabled when `prefers-reduced-motion: reduce` is active."

---

## Accessibility

- `prefers-reduced-motion: reduce` — all animations disabled or reduced to instant transitions
- ARIA live region behavior during animation — screen reader announcements must not be delayed by animation
- Animation must not cause content to flash or flicker (WCAG 2.3.1)

---

## Design Decisions

### Decision 1: Separate Spec from 072

072 is a visual-only update (container background, padding, radius, gap). This spec changes behavioral contracts (animation, DOM update strategy). Keeping them separate means 072 can ship independently and this spec builds on the styled container.

### Decision 2: Token-Based Animation Timing

The token system already has duration primitives (`duration150`, `duration250`, `duration350`), easing primitives (`easingStandard`, `easingDecelerate`, `easingAccelerate`), and semantic motion tokens that compose them. Animation timing uses these tokens rather than CSS defaults or hardcoded values. **Confirmed**: `motion.selectionTransition` (250ms, easingStandard) for both state transitions and scroll animation. (Ada confirmed, Peter approved, 2026-03-07)

---

## Open Questions — Resolved

1. ~~**Lina**: What's the implementation approach for incremental DOM updates on web?~~ **RESOLVED**: Option (c) — maintain a stable set of node elements and update their attributes. Confirmed by Lina after reviewing the full `render()` method (2026-03-07).

   **Current state**: `render()` rebuilds the entire Shadow DOM on every call — `this._shadowRoot.innerHTML` replaces the `<style>` block, container `<div>`, and all `<progress-indicator-node-base>` children. This is triggered by `attributeChangedCallback` on any observed attribute change.

   **Approach**: Split `render()` into two phases:
   - **One-time setup** (`connectedCallback`): Create the `<style>` element and container `<div>` once. Append them to `_shadowRoot`. Pre-create 5 `<progress-indicator-node-base>` elements as children of the container.
   - **Update** (`_render()` on attribute change): Update the container's `class` and `aria-label`. For each node child, update its `state` and `size` attributes. If the visible window size changes (rare — only when `totalItems` drops below 5), add or remove node children.

   **Why this works**: The node elements persist across renders, so CSS transitions on `<progress-indicator-node-base>` (which applies its own transitions internally via its Shadow DOM) will fire when `state` changes from `incomplete` to `current` or vice versa. The container `<div>` also persists, so any scroll/slide animation on the container's children will work.

   **What to watch for**: The `<progress-indicator-node-base>` custom element must handle attribute changes via its own `attributeChangedCallback` — it already does (it observes `state`, `size`, `content`). No changes needed in Node-Base for this to work. The key constraint is that we never destroy and recreate node elements during normal pagination — only update their attributes.

   **Complexity**: Low-medium. The refactor is straightforward but touches the core render path, so the test audit checkpoint (see Lina's feedback below) is important.

2. ~~**Lina**: How do iOS and Android handle this?~~ **RESOLVED**: iOS uses SwiftUI declarative views (implicit diffing via `ForEach`) — already has element continuity. Android uses Compose recomposition (implicit diffing) — already has element continuity. Neither platform does full rebuilds. Animation on these platforms is about adding animation modifiers (`.animation()` on iOS, `animateXAsState` on Android), not restructuring the update strategy. (Thurgood analysis from 072 findings, 2026-03-06)

3. ~~**Ada**: Are there animation-related tokens (duration, easing) in the token system?~~ **RESOLVED**: Yes. Full motion token system exists. (Thurgood audit, 2026-03-07)

   **Primitive tokens available**:
   - `duration150` (150ms) — fast interactions, hover/focus states
   - `duration250` (250ms) — standard transitions, state changes
   - `duration350` (350ms) — deliberate animations, modals/drawers

   - `easingStandard` — `cubic-bezier(0.4, 0.0, 0.2, 1)` — balanced acceleration/deceleration
   - `easingDecelerate` — `cubic-bezier(0.0, 0.0, 0.2, 1)` — quick start, gradual slowdown (entering elements)
   - `easingAccelerate` — `cubic-bezier(0.4, 0.0, 1, 1)` — gradual start, quick finish (exiting elements)

   **Semantic motion tokens available**:
   - `motion.focusTransition` — 150ms + easingStandard (focus state changes)
   - `motion.selectionTransition` — 250ms + easingStandard (selection state changes)
   - `motion.buttonPress` — 150ms + easingAccelerate (press feedback)
   - `motion.modalSlide` — 350ms + easingDecelerate (overlay entry)
   - `motion.floatLabel` — 250ms + easingStandard (label float)

   **Recommendation for 074**: `motion.selectionTransition` (250ms, easingStandard) for both state transitions and scroll animation. A node transitioning between "current" and "incomplete" is a selection state change — direct semantic match. For scroll, the spatial repositioning isn't strictly a "selection" but 250ms/easingStandard gives the right feel, and a dedicated `motion.paginationScroll` token would be premature for a single consumer. Can split later if scroll timing needs independent tuning. (Ada confirmed, Peter approved, 2026-03-07)

4. ~~**Peter**: Any preference on animation feel — snappy vs smooth?~~ **RESOLVED**: Smooth. This aligns with `motion.selectionTransition` (250ms, easingStandard) — the longer duration with balanced easing produces a smooth, deliberate feel rather than a snappy one. (Peter, 2026-03-07)

5. ~~**Lina**: The Node-Base rendering bugs (4 dots instead of 5, no current emphasis) need to be resolved before animation work. Should this be a prerequisite task within 074, or a separate fix?~~ **RESOLVED**: Prerequisite task within 074. The bugs are small (likely a few-line rendering logic fix in Node-Base's web component) and blocking 074's visual validation. A separate spec would be overhead. Structure as an early task in 074's task list. (Lina recommendation, Peter confirmed, 2026-03-07)

6. ~~**Lina → Ada**: The `output/` directory contains a stale copy of generated tokens that the browser build script reads first (before `dist/`). During 072, this caused the container styling to not appear in the demo until manually synced (`cp dist/DesignTokens.web.css output/`). Having two locations with different freshness is a recurring debugging trap.~~ **RESOLVED**: Ada investigated. Root cause: `output/` is a fossil from the original pipeline — generation moved to `dist/` but `build-browser-bundles.js` still prefers `output/` (commit `3fd1ac77` added `dist/` as fallback, never flipped priority). Additionally, `generate-platform-tokens.ts` is not wired into `npm run build` at all — platform token regeneration is entirely manual. Fix included as a prerequisite task in 074. See "Token Pipeline Fix" section below. (Ada analysis, Peter confirmed, 2026-03-07)

---

## Lina's Feedback (Component Specialist, 2026-03-07)

### Motion Token Selection

`motion.selectionTransition` is the right semantic match for node state changes. For scroll animation, I initially considered `motion.focusTransition` (150ms) but 150ms may feel too fast for spatial rearrangement where the user needs to track dot position. Starting with `motion.selectionTransition` for everything is simpler — we can split later if the scroll feels wrong. Ada should weigh in on whether unified timing is semantically correct or whether a dedicated scroll token is warranted.

### Contract Wording

The proposed contract text "Scroll animation moves one node at a time" is ambiguous. The actual behavior: the entire visible window shifts by one position, and all nodes animate their new states simultaneously. Suggested wording:

> "Window shifts with animated transition. When the visible window changes, nodes animate to their new states (size and color) using `motion.selectionTransition` timing. Animation is disabled when `prefers-reduced-motion: reduce` is active."

### Node-Base Prerequisite

Recommend structuring the Node-Base rendering fixes as Task 1 (or Task 0) in 074's task list — "Fix Node-Base web rendering: 5th dot, current state emphasis, icon size validation." This unblocks visual validation for all subsequent animation tasks.

### ⚠️ Thurgood: DOM Strategy Refactor — Test Audit Checkpoint

The "What Does NOT Change" section states the composition contract is unchanged, but the web DOM update strategy change (from `innerHTML` replacement to incremental updates) is a significant internal refactor. If the incremental approach introduces subtle behavioral differences — timing of child custom element upgrades, attribute change ordering, Shadow DOM mutation sequencing — the existing behavioral tests need to catch it.

**Recommendation**: Run the full existing behavioral test suite after the DOM strategy refactor but *before* adding any animation code. This isolates regressions from the refactor itself vs. regressions from animation. Consider making this an explicit validation gate in the task structure: "DOM refactor complete → behavioral suite green → proceed to animation."

---

## Token Pipeline Fix (Ada — Prerequisite)

### Problem

Two issues cause stale platform tokens during development:

1. **`generate-platform-tokens.ts` is not in the build pipeline.** It's a standalone script — `npm run build` does not regenerate `DesignTokens.web.css`, `DesignTokens.ios.swift`, or `DesignTokens.android.kt`. Token source changes compile and pass tests, but generated platform output stays stale until someone manually runs `npx ts-node scripts/generate-platform-tokens.ts`.

2. **`build-browser-bundles.js` prefers `output/` over `dist/`.** The `output/` directory is a fossil from the original pipeline (pre-`dist/`). No script writes to it anymore, but the browser build script checks it first. Result: browser demo uses stale `output/` tokens even when `dist/` is fresh.

### History

- Original pipeline wrote to `output/`. Build script read from `output/`. Worked fine.
- Generation script migrated to `dist/`. Build script added `dist/` as fallback (commit `3fd1ac77`) but kept `output/` as primary.
- Nobody flipped the priority. `output/` files are now months stale (iOS/Android: Feb 3, web CSS: manually copied Mar 7).

### Fix (3 changes)

1. **Add npm script**: `"generate:platform-tokens": "ts-node scripts/generate-platform-tokens.ts"`
2. **Wire into build**: `prebuild` runs both `generate:types` and `generate:platform-tokens` (1.5s overhead — negligible)
3. **Flip source priority** in `build-browser-bundles.js`: `dist/` first, `output/` fallback (or remove `output/` entries entirely)

### iOS Motion Token Type Fix

The iOS generator wraps motion tokens in `Typography` structs (e.g., `motionSelectionTransition = Typography(duration:easing:)`). This is a type mismatch — motion tokens aren't typography. The structured output (`MotionSelectionTransition` struct with `Duration`/`Easing` fields) is correct; the shorthand constants on lines 595-599 need a proper `Motion` type wrapper. Fix in the iOS generator as part of this task.

---

## Domain Review Recommendations

### Lina (Component Specialist) — Primary implementer
- DOM update strategy for web (the core challenge)
- iOS and Android animation implementation
- Animation accessibility (`prefers-reduced-motion`)

### Ada (Token Specialist)
- Animation token availability (duration, easing) — ✅ Confirmed: `motion.selectionTransition` for both state and scroll
- iOS motion token type bug fix (shorthand constants use `Typography` wrapper — should be a `Motion` type)
- Token pipeline fix: wire `generate-platform-tokens.ts` into build, flip `output/`→`dist/` priority

### Thurgood (Governance)
- Contract update review
- Test coverage audit after implementation (animation behavior tests, reduced-motion tests)
