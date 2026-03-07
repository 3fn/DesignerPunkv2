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

> "Window shifts with animated transition. Nodes animate size and color between states. Scroll animation moves one node at a time. Animation is disabled when `prefers-reduced-motion: reduce` is active."

---

## Accessibility

- `prefers-reduced-motion: reduce` — all animations disabled or reduced to instant transitions
- ARIA live region behavior during animation — screen reader announcements must not be delayed by animation
- Animation must not cause content to flash or flicker (WCAG 2.3.1)

---

## Design Decisions

### Decision 1: Separate Spec from 072

072 is a visual-only update (container background, padding, radius, gap). This spec changes behavioral contracts (animation, DOM update strategy). Keeping them separate means 072 can ship independently and this spec builds on the styled container.

### Decision 2: Default Animation Timing

Using CSS transition defaults for now. Specific easing curves and durations can be refined after seeing the animation in context. This avoids premature optimization of animation feel.

---

## Open Questions

1. **Lina**: What's the implementation approach for incremental DOM updates on web? Options include: (a) diff and patch existing nodes, (b) use a lightweight DOM reconciliation approach, (c) maintain a pool of 5 node elements and update their attributes. What's simplest given the Shadow DOM context?
   - *072 finding*: The Shadow DOM contains a `<style>` block + one container `<div>` + N `<progress-indicator-node-base>` children. Option (c) — maintaining a pool of node elements and updating attributes — is likely simplest. The container div and style tag can be created once in `connectedCallback`, then `_render()` only updates child node attributes and adds/removes nodes as needed.
2. **Lina**: How do iOS and Android handle this? Are the native platforms already doing incremental updates, or do they also rebuild?
   - *072 finding*: iOS uses SwiftUI declarative views (implicit diffing via `ForEach`). Android uses Compose recomposition (implicit diffing). Neither platform does full rebuilds — both already have element continuity. Animation on these platforms is primarily about adding animation modifiers, not restructuring the update strategy.
3. **Ada**: Are there animation-related tokens (duration, easing) in the token system, or is this purely CSS defaults for now?
4. **Peter**: Any preference on animation feel — snappy vs smooth? This can be refined after initial implementation, but a starting direction helps.
5. **Lina (new)**: The Node-Base rendering bugs (4 dots instead of 5, no current emphasis) need to be resolved before animation work. Should this be a prerequisite task within 074, or a separate fix?
6. **Lina (new)**: The `output/` directory contains a stale copy of generated tokens that the browser build script reads first (before `dist/`). This caused the container styling to not appear in the demo until manually synced. Should the build script be updated to read from `dist/` only, or should token generation write to both locations?

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
