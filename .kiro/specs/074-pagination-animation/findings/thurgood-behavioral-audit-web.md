# Thurgood: Behavioral Audit — Web Implementation

**Date**: 2026-03-08
**Author**: Thurgood (behavioral audit)
**For**: Peter (review), Lina (action items)
**Context**: Spec 074, Task 3.9 — Behavioral audit of web implementation against contracts
**Status**: Audit complete

---

## Audit Scope

Audited the web implementation of Progress-Pagination-Base against all four contracts in `contracts.yaml`. Reviewed:
- `ProgressPaginationBase.web.ts` (component logic)
- `ProgressPaginationBase.styles.css` (component styles)
- `ProgressIndicatorNodeBase.styles.css` (node styles, `sizing="scale"` block)
- `PaginationBase.test.ts` (test assertions)

---

## Contract: `composition_node_only` — ✅ PASS

| Assertion | Evidence | Status |
|---|---|---|
| Renders Node-Base for each item | `document.createElement('progress-indicator-node-base')` in loop, count = `totalItems` | ✅ |
| No Connector-Base elements | No connector references in component | ✅ |
| No Label-Base elements | No label references in component | ✅ |
| All nodes have content='none' | `node.setAttribute('content', 'none')` line 222 | ✅ |

**Test coverage**: 4 tests in "Composition" describe block. All verify correct behavior.

**Minor language issue** (flagged in 3.7 finding): Contract says "for each visible item" — should say "for each item" post-pivot. Lina to fix in contract update pass.

---

## Contract: `state_binary_derivation` — ✅ PASS

| Assertion | Evidence | Status |
|---|---|---|
| Exactly one node has state 'current' | `derivePaginationNodeState(itemIndex, currentItem)` returns 'current' only when `itemIndex === currentItem` | ✅ |
| All other nodes have state 'incomplete' | Same function returns 'incomplete' for all non-matching indices | ✅ |
| State derivation is deterministic | Pure function, no side effects | ✅ |

**Test coverage**: 5 tests in "State Derivation" describe block. Includes determinism test (same props → same states).

---

## Contract: `rendering_and_animation` (proposed replacement for `performance_virtualization`) — ⚠️ CONDITIONAL PASS

This contract hasn't been updated in the YAML yet (3.7 finding delivered, Lina to implement). Auditing against the proposed contract from the 3.7 finding.

| Assertion | Evidence | Status |
|---|---|---|
| totalItems ≤ 5 renders all nodes without clipping | Viewport width calculation uses `maxVisible = Math.min(totalItems, 5)`, so ≤5 items means viewport fits all | ✅ |
| totalItems > 5 renders all nodes with viewport clipping | All nodes created in loop, `overflow: hidden` + `clip-path` on container | ✅ |
| Current dot centered when not at edges | `targetX = (contentWidth / 2) - activeCenter` | ✅ |
| First dot at left edge near start | Clamp: `Math.min(0, ...)` prevents positive translateX | ✅ |
| Last dot at right edge near end | Clamp: `Math.max(minX, ...)` where `minX = contentWidth - trackWidth` | ✅ |
| Track translation animates on currentItem change | `transition: transform var(--motion-settle-transition-duration) ...` when not initial and not reduced motion | ✅ |
| Node state transitions animate | Node-Base CSS has `transition: transform ..., background-color ...` in `sizing="scale"` block | ✅ |
| Animation disabled for reduced motion | `matchMedia('(prefers-reduced-motion: reduce)')` check, sets `transition: none` | ✅ |
| First render positions without animation | `isInitial` check via `!this._container.dataset.rendered`, sets `transition: none` | ✅ |
| ARIA announcements not delayed | `aria-label` set synchronously in same render pass, not deferred by animation | ✅ |

**One pending issue**: Node-Base CSS still uses experimental `--motion-color-transition-*` properties (Task 3.8). Once Lina replaces with `--motion-settle-transition-*`, the split-timing behavior is fully correct. Until then, the color transition falls back to `--motion-selection-transition-*` (250ms instead of 350ms) — functionally works, just not the intended feel.

**Test coverage**: "Virtualization — Rendered Output" has 2 tests (≤5 and >5 node counts). Animation and reduced motion are not directly tested in the unit test file — these are visual/behavioral properties that would need integration or visual regression tests. This is a coverage gap, but a known one — CSS transition behavior is difficult to assert in JSDOM.

---

## Contract: `accessibility_actual_position` — ✅ PASS

| Assertion | Evidence | Status |
|---|---|---|
| aria-label shows actual currentItem and totalItems | `Page ${currentItem} of ${totalItems}` — uses real values, not viewport subset | ✅ |
| role="group" applied | `this._container.setAttribute('role', 'group')` in `_setup()` | ✅ |
| Custom label override supported | `this.accessibilityLabel \|\| \`Page ${currentItem} of ${totalItems}\`` | ✅ |

**Test coverage**: 4 tests in "Accessibility" describe block. Includes virtualized position test (50 items, currentItem 26 → "Page 26 of 50").

---

## Summary

| Contract | Status | Action Needed |
|---|---|---|
| `composition_node_only` | ✅ Pass | Minor language fix (3.7 finding) |
| `state_binary_derivation` | ✅ Pass | None |
| `rendering_and_animation` | ⚠️ Conditional pass | Pending 3.7 YAML update + 3.8 token property fix |
| `accessibility_actual_position` | ✅ Pass | None |

**No new contract gaps identified.** The existing four contracts cover the component's behavioral surface. No additional contracts needed at this time.

**Coverage gap noted**: Animation and reduced motion behavior are not unit-testable in JSDOM. This is acceptable for now — these are visual behaviors verified by Peter's demo inspection. If a visual regression testing tool is adopted later, these should be the first candidates for automated coverage.

---

## References

- `findings/thurgood-contract-audit-performance-virtualization.md` — 3.7 contract rewrite recommendation
- `findings/thurgood-token-completeness-resolution.md` — 3.8 token property fix
- `contracts.yaml` — current contract definitions
- `PaginationBase.test.ts` — current test assertions
