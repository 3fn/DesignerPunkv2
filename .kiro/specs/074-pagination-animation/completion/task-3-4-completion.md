# Task 3.4 Completion: Split-Timing Motion Strategy Decision

**Date**: 2026-03-07
**Task**: 3.4 Decision: Split-timing motion strategy
**Type**: Architecture
**Status**: Complete

---

## Decision

**Path A** — Create new semantic motion token `motion.settleTransition` (350ms/easingDecelerate) for color and slide follow-through transitions.

## Artifacts Created/Modified

- `src/tokens/semantic/MotionTokens.ts` — Added `motion.settleTransition` token definition
- `dist/DesignTokens.web.css` — Generated `--motion-settle-transition-duration` and `--motion-settle-transition-easing`
- `dist/DesignTokens.ios.swift` — Generated `motionSettleTransition` constant
- `dist/DesignTokens.android.kt` — Generated `motion_settle_transition` constant

## Implementation Notes

- Split-timing pattern: scale snap at 250ms/easingStandard (`motion.selectionTransition`), color+slide follow-through at 350ms/easingDecelerate (`motion.settleTransition`)
- Token name "settle" describes the perceptual character (arriving and settling into position), not a specific component
- Considered `motion.modalSlide` (same primitives) but rejected due to semantic mismatch — modal entry ≠ state follow-through
- Token creation followed governance: checkpoint presented, Peter approved
- Existing `--motion-color-transition-*` experimental properties in Node-Base CSS still reference non-existent custom properties — Lina needs to replace with `--motion-settle-transition-*` (tracked in Task 3.8)

## Validation

- Tier 1: Minimal — decision + token creation
- `npm run build` succeeded — platform outputs generated for web, iOS, Android
- `npm test` — 7424 passed, 2 pre-existing failures (`motion-color-transition-duration`, `motion-color-transition-easing` in token-completeness tests — resolves when Lina updates Node-Base CSS in Task 3.8)
- MCP index rebuilt and healthy

## Remaining Handoff to Lina

1. Replace `--motion-color-transition-*` with `--motion-settle-transition-*` in Node-Base CSS (`sizing="scale"` block)
2. Update PaginationBase.web.ts track slide transition to use `--motion-settle-transition-*`
