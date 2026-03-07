# Pagination Animation — Design Outline

**Date**: March 6, 2026
**Spec**: 074 - Pagination Animation
**Purpose**: Add state transition and scroll animations to Progress-Pagination-Base
**Status**: Design Outline (Draft)
**Prior Spec**: 048-progress-family (original implementation)
**Depends On**: Spec 072 (Pagination Container Styling) — container must be styled before animation work
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

---

## Scope

### What Changes

| Aspect | Current | Proposed |
|--------|---------|----------|
| Node state transitions | Instant (DOM rebuild) | Animated size and color (CSS transitions, default timing) |
| Window scroll | Instant (DOM rebuild) | Animated slide (one node at a time) |
| DOM update strategy | Full `innerHTML` replacement | Incremental DOM updates (required for CSS transitions to work) |
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

The current web implementation uses `innerHTML` replacement on every render. CSS transitions require DOM element continuity — you can't animate an element that was destroyed and recreated. The render strategy must change from full replacement to incremental updates (reuse existing node elements, update their attributes).

This is the core implementation challenge. The animation CSS itself is straightforward; the DOM update strategy change is the real work.

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
2. **Lina**: How do iOS and Android handle this? Are the native platforms already doing incremental updates, or do they also rebuild?
3. **Ada**: Are there animation-related tokens (duration, easing) in the token system, or is this purely CSS defaults for now?
4. **Peter**: Any preference on animation feel — snappy vs smooth? This can be refined after initial implementation, but a starting direction helps.

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
