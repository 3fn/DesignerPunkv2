# Task 9.4.FIX.1 Completion: Update `color.structure.border.subtle` to use opacity composition

**Date**: January 25, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Task**: 9.4.FIX.1 - Update `color.structure.border.subtle` to use opacity composition
**Type**: Implementation (Architecture Fix)
**Status**: Complete
**Organization**: spec-completion
**Scope**: 052-semantic-token-naming-implementation

---

## Summary

Updated the `color.structure.border.subtle` token from a baked-in RGBA value to use opacity composition, aligning with the mathematical token foundation.

## Changes Made

### File: `src/tokens/semantic/ColorTokens.ts`

**Before:**
```typescript
'color.structure.border.subtle': {
  name: 'color.structure.border.subtle',
  primitiveReferences: { value: 'rgba(184, 182, 200, 0.48)' },
  // ...
}
```

**After:**
```typescript
'color.structure.border.subtle': {
  name: 'color.structure.border.subtle',
  primitiveReferences: { color: 'gray100', opacity: 'opacity600' },
  // ...
}
```

### Code Comment Added

Added comprehensive documentation explaining the opacity composition pattern:
- Explains the `color` + `opacity` key structure
- Documents how platform generators resolve to RGBA output
- References the opacity token scale definition
- Links to `src/tokens/OpacityTokens.ts` for opacity scale details

## Architectural Alignment

This change aligns with the mathematical token foundation:
- **opacity600** = 0.08 × 6 = 0.48 (from the opacity token scale)
- **gray100** = the primitive color token for borders
- Composition pattern allows automatic updates if either primitive changes

## Requirements Validated

- **Requirement 1.4**: Token supports transparency through opacity composition
- **Requirement 2.5**: Structure concept token uses proper primitive references

## Next Steps

The following tasks need to be completed to fully support this change:
- **Task 9.4.FIX.2**: Update validation tests to recognize opacity composition references
- **Task 9.4.FIX.3**: Update generators to resolve opacity composition to RGBA output
- **Task 9.4.FIX.4**: Regenerate platform tokens and verify output

---

*This task establishes the token definition pattern. Subsequent tasks will update the infrastructure to process this pattern correctly.*
