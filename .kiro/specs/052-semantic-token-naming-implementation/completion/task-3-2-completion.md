# Task 3.2 Completion: Migrate Badge Component Tokens

**Date**: January 25, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Task**: 3.2 Migrate Badge component tokens
**Status**: Complete
**Organization**: spec-completion
**Scope**: 052-semantic-token-naming-implementation

---

## Summary

Renamed badge component tokens to follow the `{component}.{variant}.{property}` naming pattern as defined in Spec 051 design authority.

## Changes Made

### Token Renames

| Old Name | New Name |
|----------|----------|
| `color.badge.background.notification` | `color.badge.notification.background` |
| `color.badge.text.notification` | `color.badge.notification.text` |

### Files Modified

1. **`src/tokens/semantic/ColorTokens.ts`**
   - Renamed token keys and `name` properties
   - Added Spec 052 comment noting the reorder
   - Preserved all other token properties (primitiveReferences, category, context, description)

2. **`src/tokens/semantic/__tests__/ColorTokens.test.ts`**
   - Updated all test references to use new token names
   - Updated test descriptions to reference Spec 052
   - Updated naming pattern test to verify `{component}.{variant}.{property}` order

## Validation

- Token definitions updated correctly
- Test file updated to match new token names
- No remaining references to old token names in TypeScript source files
- Badge tokens still reference correct primitives (pink400, white100)

## Requirements Satisfied

- **Requirement 3.2**: Badge component tokens reordered to `{component}.{variant}.{property}` pattern
- **Requirement 4.1**: Old token names removed (clean break)
- **Requirement 4.2**: Migration mapping applied correctly

## Notes

- Component files (CSS, Swift, Kotlin) will be updated in Tasks 5.9, 6.9, and 7.9
- Platform token generation (Task 4) will produce the new token names in dist/ outputs
