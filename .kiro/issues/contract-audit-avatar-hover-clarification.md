# Issue: Avatar-Base interaction_hover Without Focusable/Pressable

**Date**: February 28, 2026
**Severity**: Low
**Status**: Open
**Discovered During**: Post-064 contract audit
**Affects**: Avatar-Base
**Recommended Owner**: Lina (component domain)

---

## Summary

Avatar-Base has `interaction_hover` as an active contract but excludes `interaction_focusable`, `interaction_pressable`, and `interaction_focus_ring`. The exclusion rationale states interactive avatars should be wrapped in a button/link.

This is internally consistent but the `interaction_hover` contract should clarify it's pointer-only behavior with no keyboard equivalent. Currently the contract says "Visual feedback on hover when interactive=true" without noting the pointer-only scope.

---

## Current State

- **Active**: `interaction_hover` — "Visual feedback on hover when interactive=true"
- **Excluded**: `interaction_focusable` — "Avatar is a visual-only component. Interactive avatars must be wrapped in button/link."
- **Excluded**: `interaction_pressable` — "Avatar does not handle click/tap events."
- **Excluded**: `interaction_focus_ring` — "Focus ring is the wrapper's responsibility."

---

## Recommended Action

Add a clarifying note to the `interaction_hover` contract behavior text:

> "Hover is pointer-only — no keyboard equivalent exists on Avatar-Base. Keyboard focus and activation are the responsibility of the wrapping interactive element (button/link)."

This prevents an agent from assuming hover implies keyboard interactivity.
