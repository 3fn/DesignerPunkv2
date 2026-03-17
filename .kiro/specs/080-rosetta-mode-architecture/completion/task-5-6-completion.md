# Task 5.6 Completion: Write Generator Integration Tests

**Date**: 2026-03-17
**Task**: 5.6 Write generator integration tests
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/generators/__tests__/ModeAwareGeneration.test.ts` (new — 12 tests)

## Test Coverage

### Web (3 tests)
- `light-dark()` output for mode-differentiated tokens ✅
- Single value for mode-invariant tokens ✅
- `color-scheme: light dark` declaration ✅

### iOS (2 tests)
- Dynamic `UIColor` with `userInterfaceStyle` for mode-differentiated tokens ✅
- Single static `UIColor` for mode-invariant tokens ✅

### Android (2 tests)
- `_light`/`_dark` suffixed values for mode-differentiated tokens ✅
- Single value for mode-invariant tokens ✅

### DTCG (2 tests)
- No `modes.light`/`modes.dark` when values are identical ✅
- Existing `modes.wcag` preserved (Spec 077 coexistence) ✅

### F37 Guard (3 tests)
- Throws on `semanticTokens` without `darkSemanticTokens` ✅
- Throws on `darkSemanticTokens` without `semanticTokens` ✅
- Works when neither provided (fallback path) ✅

## Validation

- 12/12 new tests pass
- 7839/7843 full suite pass (4 pre-existing demo-system failures)

### Requirements Trace
- R6 AC1-4: Platform output formats verified ✅
- R9 AC1-3: DTCG mode context verified ✅
- Testing strategy Layer 3 ✅
