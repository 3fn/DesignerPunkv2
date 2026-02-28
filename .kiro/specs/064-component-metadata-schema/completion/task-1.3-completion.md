# Task 1.3 Completion: Resolve Button-Icon iOS Scale Value

**Date**: 2026-02-28
**Task**: 1.3 Resolve Button-Icon iOS scale value
**Type**: Implementation
**Status**: Complete

---

## Decision

**Adjusted to `scale096` (0.96).** The previous value of 0.97 did not align with any token in the scale token system (which uses 0.04 increments). `scale096` is described as "Button press feedback" — the exact use case. The visual difference (1%) is imperceptible. Peter approved Option A (token alignment) over Option B (platform exception).

## Artifacts Modified

- `Button-Icon/platforms/ios/ButtonIcon.ios.swift` — `.scaleEffect(isPressed ? 0.97 : 1.0)` → `.scaleEffect(isPressed ? 0.96 : 1.0)`
- `Button-Icon/contracts.yaml` — `iOS: scale animation (0.97)` → `iOS: scale animation (scale096 = 0.96)`
- `Button-Icon/README.md` — `Scale animation on press (0.97 scale)` → `Scale animation on press (scale096 = 0.96)`

## Validation

**Tier 2: Standard**

- ✅ iOS implementation updated to use scale096-aligned value (0.96)
- ✅ Contract and README updated to reference token name
- ✅ No remaining 0.97 references in Button-Icon
- ✅ Full test suite: 290 suites, 7437 tests, 0 failures
- ✅ Requirement 8.3 satisfied

## Ada Review Note

Token alignment confirmed correct — `scale096` is explicitly described as "Button press feedback" in the scale token family, and the 0.04-increment progression is maintained.

**Ada follow-up (2026-02-28):** Upgraded the iOS implementation from hardcoded literal `0.96` to `DesignTokens.scale096` / `DesignTokens.scale100` constants, matching the pattern used for all other token references in the file. Also fixed a stale `0.97` in `MotionTokens.swift`'s `motionButtonPress` doc example.

Files modified:
- `Button-Icon/platforms/ios/ButtonIcon.ios.swift` — `0.96` → `DesignTokens.scale096`, `1.0` → `DesignTokens.scale100`
- `src/tokens/platforms/ios/MotionTokens.swift` — doc example updated from `0.97` literal to `DesignTokens.scale096` / `DesignTokens.scale100`
