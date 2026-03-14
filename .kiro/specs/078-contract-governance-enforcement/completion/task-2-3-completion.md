# Task 2.3 Completion: Update behavioral-contract-validation test to auto-discover

**Date**: 2026-03-13
**Spec**: 078 — Contract Governance & Enforcement
**Task**: 2.3 — Update behavioral-contract-validation test to auto-discover
**Agent**: Thurgood
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Replaced hard-coded 7-component `COMPONENTS` array with filesystem auto-discovery scanning all components with non-empty `contracts.yaml`. Now validates all 29 components. Fixed two pre-existing issues exposed by the broader scope.

## Changes

### Primary: Auto-discovery (behavioral-contract-validation.test.ts)

Replaced:
```typescript
const COMPONENTS = ['Input-Text-Base', 'Input-Text-Email', ...]; // 7 hard-coded
```
With:
```typescript
const COMPONENTS = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(/* has non-empty contracts.yaml */);
```

### Fix 1: Platform file patterns (behavioral-contract-validation.test.ts)

The test expected `.ios.swift` / `.android.kt` suffixes, but newer components use `.swift` / `.kt`. Relaxed patterns to match any file with the platform's language extension. Pre-existing bug masked by the curated 7-component list.

### Fix 2: Missing `platforms` field in Badge schemas

Three Badge component schemas (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base) were missing the top-level `platforms:` field. All three have web/iOS/Android implementations. Added `platforms: [web, ios, android]` to each. Pre-existing data gap masked by the curated list.

### Fix 3: Guard against missing platforms in schema

Added `|| []` fallback for `schema.platforms` iteration to prevent crash when a schema lacks the field. Defensive coding for the platform parity check.

## Files Modified

| File | Change |
|------|--------|
| `src/__tests__/stemma-system/behavioral-contract-validation.test.ts` | Auto-discovery, pattern fix, platforms guard |
| `src/components/core/Badge-Count-Base/Badge-Count-Base.schema.yaml` | Added `platforms: [web, ios, android]` |
| `src/components/core/Badge-Count-Notification/Badge-Count-Notification.schema.yaml` | Added `platforms: [web, ios, android]` |
| `src/components/core/Badge-Label-Base/Badge-Label-Base.schema.yaml` | Added `platforms: [web, ios, android]` |

## Requirements Addressed

| Requirement | How |
|-------------|-----|
| 5.1 — Replace hard-coded array with filesystem discovery | `readdirSync` + `contracts.yaml` existence + non-empty filter |
| 5.2 — All previously validated components still pass | All 10 test cases pass, now covering 29 components instead of 7 |

## Validation

- Test passes: 10 tests, all passing (now covering 29 components)
- Full suite: 301 suites, 7820 tests, 0 failures
