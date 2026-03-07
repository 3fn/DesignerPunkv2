# Pagination Animation — Design Outline

**Date**: March 7, 2026
**Spec**: 074 - Pagination Animation
**Purpose**: Add state transition and scroll animations to Progress-Pagination-Base
**Status**: Design Outline (Draft)
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

The token system already has duration primitives (`duration150`, `duration250`, `duration350`), easing primitives (`easingStandard`, `easingDecelerate`, `easingAccelerate`), and semantic motion tokens that compose them. Animation timing should use these tokens rather than CSS defaults or hardcoded values. Candidate tokens: `motion.selectionTransition` for node state changes, `motion.focusTransition` for scroll animation. Ada to confirm semantic fit.

---

## Open Questions — Partially Resolved

1. ~~**Lina**: What's the implementation approach for incremental DOM updates on web?~~ **PARTIALLY RESOLVED**: Option (c) — maintain a pool of 5 node elements and update their attributes — is the likely approach. The Shadow DOM contains a `<style>` block + one container `<div>` + N `<progress-indicator-node-base>` children. The container div and style tag can be created once in `connectedCallback`, then `_render()` only updates child node attributes and adds/removes nodes as needed. Lina to confirm. (Thurgood analysis from 072 findings, 2026-03-06)

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

   **Recommendation for 074**: `motion.selectionTransition` (250ms, easingStandard) is the closest semantic match for pagination node state changes — a node transitioning between "current" and "incomplete" is a selection state change. Working assumption is to use `motion.selectionTransition` for both state transitions and scroll animation. Ada to confirm semantic fit and advise whether the scroll animation warrants a separate token (e.g., `motion.paginationScroll`) or if unified timing is correct. Prepared to move forward with `motion.selectionTransition` for both if Ada concurs.

4. ~~**Peter**: Any preference on animation feel — snappy vs smooth?~~ **RESOLVED**: Smooth. This aligns with `motion.selectionTransition` (250ms, easingStandard) — the longer duration with balanced easing produces a smooth, deliberate feel rather than a snappy one. (Peter, 2026-03-07)

5. ~~**Lina**: The Node-Base rendering bugs (4 dots instead of 5, no current emphasis) need to be resolved before animation work. Should this be a prerequisite task within 074, or a separate fix?~~ **RESOLVED**: Prerequisite task within 074. The bugs are small (likely a few-line rendering logic fix in Node-Base's web component) and blocking 074's visual validation. A separate spec would be overhead. Structure as an early task in 074's task list. (Lina recommendation, Peter confirmed, 2026-03-07)

6. **Lina → Ada**: The `output/` directory contains a stale copy of generated tokens that the browser build script reads first (before `dist/`). During 072, this caused the container styling to not appear in the demo until manually synced (`cp dist/DesignTokens.web.css output/`). Having two locations with different freshness is a recurring debugging trap. Recommendation: the build script should read from `dist/` only, or the generation script should write to both. Flagged for Ada to resolve as part of her next token pipeline work.

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

## Domain Review Recommendations

### Lina (Component Specialist) — Primary implementer
- DOM update strategy for web (the core challenge)
- iOS and Android animation implementation
- Animation accessibility (`prefers-reduced-motion`)

### Ada (Token Specialist)
- Animation token availability (duration, easing)
- Any token implications for animated state transitions

### Thurgood (Governance)
- Contract update review
- Test coverage audit after implementation (animation behavior tests, reduced-motion tests)
