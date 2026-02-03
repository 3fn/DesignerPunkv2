# Design Document: Primitive Radius Token Rename

**Date**: 2026-02-03
**Spec**: 055 - Primitive Radius Token Rename (radiusFull → radiusMax)
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This spec fixes a CSS variable naming collision where both the primitive token `radiusFull` and semantic token `radiusFull` generate the same CSS variable name `--radius-full`, causing invalid self-referencing CSS output.

**Solution**: Rename the primitive token from `radiusFull` to `radiusMax` while keeping the semantic token name unchanged. This eliminates the collision with minimal blast radius.

**Before**:
```css
/* Primitive */
--radius-full: 9999px;

/* Semantic - INVALID (self-reference) */
--radius-full: var(--radius-full);
```

**After**:
```css
/* Primitive */
--radius-max: 9999px;

/* Semantic - VALID */
--radius-full: var(--radius-max);
```

---

## Architecture

### Token Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                          │
│  badge-count-base, badge-count-notification                 │
│  Uses: var(--radius-full) ← NO CHANGES NEEDED               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Semantic Layer                           │
│  radiusFull = { value: 'radiusMax' }  ← UPDATE REFERENCE    │
│  Generates: --radius-full: var(--radius-max)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Primitive Layer                          │
│  radiusMax (was radiusFull) = 9999                          │
│  Generates: --radius-max: 9999px  ← RENAME TOKEN            │
└─────────────────────────────────────────────────────────────┘
```

### Files Affected

| File | Change Type | Description |
|------|-------------|-------------|
| `src/tokens/RadiusTokens.ts` | Rename | `radiusFull` → `radiusMax` |
| `src/tokens/semantic/RadiusTokens.ts` | Update reference | `{ value: 'radiusFull' }` → `{ value: 'radiusMax' }` |
| `src/tokens/__tests__/*.test.ts` | Update references | Test files referencing primitive `radiusFull` |
| `.kiro/steering/Token-Family-Radius.md` | Update docs | Documentation references |

---

## Components and Interfaces

### Primitive Token Definition (After)

```typescript
// src/tokens/RadiusTokens.ts
radiusMax: {
  name: 'radiusMax',
  category: TokenCategory.RADIUS,
  baseValue: 9999,
  familyBaseValue: RADIUS_BASE_VALUE,
  description: 'Maximum radius - creates perfect circles/pills',
  mathematicalRelationship: 'special case = 9999 (effectively infinite)',
  baselineGridAlignment: false,
  isStrategicFlexibility: true,
  isPrecisionTargeted: false,
  platforms: generateRadiusPlatformValues(9999)
}
```

### Semantic Token Reference (After)

```typescript
// src/tokens/semantic/RadiusTokens.ts
export const radiusFull = { value: 'radiusMax' } as RadiusSemanticToken;
```

---

## Design Decisions

### Decision 1: Rename Primitive, Keep Semantic Name

**Options Considered**:
1. Rename primitive `radiusFull` → `radiusMax`
2. Rename semantic `radiusFull` → `radiusMaximum`
3. Add prefix to primitive tokens (e.g., `primitiveRadiusFull`)

**Decision**: Option 1 - Rename primitive to `radiusMax`

**Rationale**: 
- Semantic token `radiusFull` is the public API used by components
- Renaming semantic would require updating all component CSS
- `radiusMax` accurately describes the token's purpose (maximum radius value)
- Minimal blast radius - only internal token references change

**Trade-offs**:
- ✅ **Gained**: No component changes needed, clear naming
- ❌ **Lost**: Primitive name no longer matches semantic name (acceptable)

### Decision 2: Update Description Text

**Decision**: Change description from "Full radius" to "Maximum radius"

**Rationale**: The description should match the new token name for consistency and clarity.

---

## Testing Strategy

### Unit Tests to Update

1. **AIReadableMathematicalRelationships.test.ts**
   - Update `radiusFull` references to `radiusMax`

2. **RadiusTokensFormulaValidation.test.ts**
   - Update test case names and assertions
   - Update token lookup references

3. **RadiusStrategicFlexibilityValidation.test.ts**
   - Update describe block name
   - Update all `radiusFull` references to `radiusMax`

4. **TokenCategories.test.ts**
   - Update special case token references

### Validation Approach

1. Run `npm test` to verify all tests pass
2. Generate CSS output and verify:
   - Primitive: `--radius-max: 9999px`
   - Semantic: `--radius-full: var(--radius-max)`
3. Visual verification of badge demo

---

## Error Handling

No new error handling required. This is a rename operation that maintains existing behavior.

---

## Correctness Properties

### Property 1: Primitive Token Value Preservation
**Validates: Requirements 1.2**

The primitive token `radiusMax` must have `baseValue === 9999`.

### Property 2: Semantic Token Reference Validity
**Validates: Requirements 2.1, 2.3**

The semantic token `radiusFull` must reference a valid primitive token that exists in the registry.

### Property 3: CSS Variable Name Uniqueness
**Validates: Requirements 1.4, 2.3**

Generated CSS must not contain self-referencing variables (no `var(--X): var(--X)` patterns).

### Property 4: Metadata Preservation
**Validates: Requirements 1.3**

The renamed token must preserve all metadata fields: `category`, `mathematicalRelationship`, `isStrategicFlexibility`.

---

## Risk Assessment

**Risk Level**: Low

- Simple rename operation
- No logic changes
- No component changes required
- Clear validation criteria
- Easily reversible if issues arise
