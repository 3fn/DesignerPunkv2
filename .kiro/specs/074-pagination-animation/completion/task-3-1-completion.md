# Task 3.1 Completion: Web — Fix Layout Twitch with Scale-Based Sizing

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 3.1 — Web: Fix layout twitch with scale-based sizing
**Agent**: Lina (component implementation)
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Added opt-in `sizing="scale"` attribute to Node-Base. When set, nodes use a fixed layout box at current-state size and `transform: scale()` for inactive states. Eliminates layout twitch during animation. Pagination-Base sets this attribute on all its nodes. Default behavior unchanged — steppers unaffected.

---

## Changes

### ProgressIndicatorNodeBase.web.ts
- Added `sizing` to `observedAttributes` (6th attribute)

### Progress-Indicator-Node-Base.schema.yaml
- Added `sizing` property: optional, type `"'scale'"`, default undefined

### ProgressIndicatorNodeBase.styles.css
- Added `:host([sizing="scale"]) .node` transition rule (transform + background-color)
- Added per-variant rules: fixed layout box at current-state size, `transform: scale()` for inactive
- Scale ratios: sm=0.75 (12/16), md=0.80 (16/20), lg=0.833 (20/24)
- Default `.node` rules unchanged — steppers get same width/height behavior as before

### ProgressPaginationBase.web.ts
- Added `node.setAttribute('sizing', 'scale')` in `_render()` loop

---

## Design Decisions

- **Hardcoded scale ratios** over `calc(var(--base) / var(--current))`: CSS unit division works in modern browsers but is risky on older ones. Three static values are simple and maintainable.
- **Scoping via attribute** (Option B): Unanimous decision — Ada, Lina, Thurgood, Peter. See `findings/scale-scoping-decision.md`.

---

## Open Item

**Gap spacing**: Fixed layout boxes at current-state size increase the visual gap between inactive dots (invisible space around scaled-down dots). Needs visual verification in demo. May be acceptable as-is.

---

## Verification

- Node-Base tests: 19/19 passed ✅
- Pagination-Base tests: 35/35 passed ✅
- Full suite: 291 suites, 7457 tests passed ✅
