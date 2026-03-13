# Task 1.2 Completion: Extend Easing Token Type System

**Date**: 2026-03-13
**Spec**: 049 — Nav-SegmentedChoice-Base
**Task**: 1.2 — Extend easing token type system
**Type**: Architecture
**Agent**: Ada

---

## What Was Done

Extended the easing token type system to support both cubic bezier and piecewise linear curves.

### Changes

| File | Change |
|------|--------|
| `src/types/PrimitiveToken.ts` | Added `EASING` to `TokenCategory` enum. Added optional `easingType`, `stops`, `easingDuration` fields to `PrimitiveToken`. |
| `src/tokens/EasingTokens.ts` | Added `generateLinearEasingPlatformValues()`. Updated 3 existing tokens from `SPACING` to `EASING` category with `easingType: 'cubicBezier'`. Defined `easingGlideDecelerate` with 15-stop piecewise linear curve and `easingDuration: 350`. |
| `src/tokens/index.ts` | Added `[TokenCategory.EASING]: easingTokens` to `allTokens` map. |
| `src/tokens/__tests__/MotionTokens.test.ts` | Updated 4 tests: cubic-bezier filter, EASING category, token count 3→4, token names list. |
| `src/tokens/__tests__/MotionTokens.property.test.ts` | Updated 2 property tests to handle both easing types. |
| `src/validators/__tests__/ThreeTierValidator.test.ts` | Added EASING to `familyUsagePatterns` fixture. |

### Token Definition

```typescript
easingGlideDecelerate: {
  easingType: 'linear',
  easingDuration: 350,  // paired with duration350
  stops: [
    [0, 0], [0.009, 0.012], [0.02, 0.05], [0.092, 0.411],
    [0.118, 0.517], [0.146, 0.611], [0.177, 0.694],
    [0.211, 0.765], [0.248, 0.824], [0.289, 0.872],
    [0.334, 0.91], [0.384, 0.939], [0.509, 0.977],
    [0.684, 0.994], [1.0, 1.0]
  ]
}
```

### Design Decisions

1. Optional fields on `PrimitiveToken` (not type union) — avoids breaking all existing token definitions
2. `easingDuration` on token — piecewise linear curves are time-scale dependent (per Lina/Ada/Peter agreement in 1.1)
3. `EASING` category replaces `SPACING` workaround — existing tokens updated

## Known Downstream Breakage

DTCG generator crashes on `generate()` because `generateEasingTokens()` tries to parse the new token as cubic-bezier. This is expected and will be fixed in Task 1.4. Platform builders (1.3) also need conditional paths.

## Validation

- `src/tokens/`: 30 suites, 1020 tests passing
- `src/validators/`: 16 suites, 557 tests passing
- Total: 46 suites, 1577 tests, 0 failures
