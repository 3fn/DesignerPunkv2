# Task 2.2 Completion: Remove Badge tokens from ColorTokens.ts

**Date**: February 5, 2026
**Task**: 2.2 Remove Badge tokens from ColorTokens.ts
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Status**: Complete

---

## Summary

Removed Badge notification color tokens from `src/tokens/semantic/ColorTokens.ts` and added backward compatibility re-exports with deprecation warnings, completing the Badge token migration per Rosetta System architecture.

---

## Changes Made

### 1. Removed Badge Token Definitions

**File**: `src/tokens/semantic/ColorTokens.ts`

Removed the following tokens from the `colorTokens` object:
- `color.badge.notification.background` (referenced `pink400`)
- `color.badge.notification.text` (referenced `white100`)

### 2. Updated Token Count Comments

Updated all token count documentation:
- Previous count: 45 tokens (after Avatar migration)
- Current count: 43 tokens (after Badge migration)
- Updated `colorTokenNames` array documentation
- Updated `validateColorTokenCount()` function to expect 43 tokens
- Updated token breakdown comments to remove Badge tokens

### 3. Updated Migration Documentation

Updated the "COMPONENT TOKENS - MIGRATED" section to include Badge tokens:
- Added Badge token migration paths
- Added canonical import location reference
- Updated the "MIGRATED TO COMPONENT DIRECTORIES" header comment

### 4. Added Backward Compatibility Re-exports

Added re-export for `BadgeNotificationColorTokens`:
```typescript
export { BadgeNotificationColorTokens } from '../../components/core/Badge-Count-Notification/tokens';
```

Added deprecated helper function:
```typescript
export function getBadgeNotificationColorTokenDeprecated(key: string): string | undefined
```

With deprecation warning:
```
[DEPRECATED] Badge notification color tokens have moved to src/components/core/Badge-Count-Notification/tokens.ts.
Update your imports to avoid future breaking changes.
See .kiro/specs/058-component-token-architecture-cleanup for migration details.
```

---

## Requirements Traceability

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| 2.3 - Remove Badge tokens from ColorTokens.ts | ✅ Complete | Tokens removed from colorTokens object |
| 4.1 - Re-exports with deprecation warnings | ✅ Complete | BadgeNotificationColorTokens re-exported |
| 4.2 - Deprecation warnings indicate new location | ✅ Complete | Warning message includes canonical path |

---

## Validation

### Diagnostics Check
- ✅ No TypeScript errors in `src/tokens/semantic/ColorTokens.ts`
- ✅ No TypeScript errors in `src/components/core/Badge-Count-Notification/tokens.ts`

### Test Status
- ⚠️ ColorTokens.test.ts will fail until Task 4.1 updates test expectations
- Expected failures: Token count assertions (expect 45, now 43)
- Expected failures: Badge token existence tests (tokens now migrated)

---

## Files Modified

1. `src/tokens/semantic/ColorTokens.ts`
   - Removed Badge token definitions
   - Updated token count (45 → 43)
   - Added BadgeNotificationColorTokens re-export
   - Added getBadgeNotificationColorTokenDeprecated function
   - Updated migration documentation

---

## Next Steps

- Task 2.3: Update Badge component implementations to import from local tokens
- Task 4.1: Update ColorTokens.test.ts expectations (token count and Badge tests)

---

**Organization**: spec-completion
**Scope**: 058-component-token-architecture-cleanup
