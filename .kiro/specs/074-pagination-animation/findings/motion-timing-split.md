# Motion Timing Split: Task 3 Animation Refinement

**Date**: 2026-03-07
**For**: Ada (token decision)
**Context**: Peter reviewed the Task 3 web demo. Animation works but feels too fast. He wants split timing:
- **Scale (size emphasis)**: keep at 250ms — the "snap" that signals state change
- **Color + slide (positional)**: slow to 350ms — the "follow-through" that gives polish

---

## Current State

All three animation properties (scale, color, slide) use `motion.selectionTransition` (250ms, easingStandard).

## Desired State

| Property | Duration | Easing | Purpose |
|----------|----------|--------|---------|
| `transform: scale()` | 250ms | easingStandard | Size emphasis — responsive snap |
| `background-color` | 350ms | ? | Color fade — smooth settle |
| `transform: translateX()` | 350ms | ? | Slide — smooth positional movement |

## Token Gap

No existing semantic token maps to 350ms + easingStandard. The available 350ms token is:
- `motion.modalSlide` — 350ms + **easingDecelerate** (starts fast, settles into place)

## Options

### Option 1: Use `motion.modalSlide` (350ms + easingDecelerate)
Decelerate easing means the slide starts fast and slows into its final position. This could feel natural for dots "settling into place" after a page change.

**Pro**: No new tokens. Reuses existing semantic token.
**Con**: `modalSlide` was designed for modal/overlay entry — semantic mismatch. Decelerate easing may feel different from the standard easing on the scale, creating a subtle inconsistency between the two transform components.

### Option 2: Reference primitives directly (350ms + easingStandard)
Use `--duration-350` and `--easing-standard` CSS custom properties directly, bypassing the semantic layer.

**Pro**: Exact timing Peter wants. No new tokens.
**Con**: Bypasses semantic token layer — goes against token governance (semantic first).

### Option 3: Create new semantic token (350ms + easingStandard)
e.g., `motion.contentSlide` or `motion.stateSettle` — 350ms + easingStandard.

**Pro**: Clean semantic mapping. Reusable if other components need a "slow standard" transition.
**Con**: New token for one use case (currently). Requires Ada to create, generate, and verify across platforms.

---

## Thurgood's Lean

Option 1 is worth trying first. Decelerate easing on the slide/color might actually feel better than standard — the "fast start, slow settle" matches the physical metaphor of dots sliding into position. If it feels wrong, Option 3 is the sustainable path.

## Questions for Ada

1. ~~Does `motion.modalSlide` (easingDecelerate) make semantic sense for pagination slide/color, or is the modal context too specific?~~
2. ~~If Option 3, what name? `motion.contentSlide`? `motion.stateSettle`? Something else?~~
3. ~~Is there a governance concern with split timing on a single component (two different motion tokens driving different properties of the same animation)?~~

---

## Ada's Assessment (2026-03-07)

### Q1: `motion.modalSlide` semantic fit — No

The token's description is explicitly "Used when modals, drawers, or overlays slide into view." Pagination dots repositioning is not an overlay entering the viewport. Using it here corrupts the token's semantic meaning — same problem as using `color.feedback.error.text` for a warning state. If someone audits token usage later, `modalSlide` on pagination dots would rightfully be questioned.

The *easing* (decelerate) might feel right for dots settling into position, but the right way to get that feel is through a properly named token, not by borrowing a modal token.

### Q2: Naming — depends on which easing Peter lands on

- If easingStandard (350ms): `motion.smoothTransition` — describes the character (smooth, deliberate), not a specific use case. Reusable for any component needing a longer version of `selectionTransition`.
- If easingDecelerate (350ms): `motion.settleTransition` — "settle" implies arriving at a resting position, which matches the decelerate curve's physics.
- Rejected `contentSlide` (too generic) and `stateSettle` (only describes half the behavior).

### Q3: Split timing governance — No concern

Split timing on a single component is good practice, not a governance issue. Different properties serve different perceptual purposes: scale snap (250ms) gives immediate state-change feedback, color/slide follow-through (350ms) gives the eye time to track movement. Using two tokens for two distinct perceptual roles is semantically cleaner than forcing one token to serve both.

### Recommendation

Peter will experiment with primitive duration/easing combos directly in the browser demo to find the right feel. Once he's landed on values, we create a properly named semantic token. This is the correct order — find the feel first, tokenize second.

### Status

**Blocked on**: Peter's experimentation with primitive timing values. Once he identifies the duration + easing combo that feels right, Ada will create the semantic token and regenerate platform output.
