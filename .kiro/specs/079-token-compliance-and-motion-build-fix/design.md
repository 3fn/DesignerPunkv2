# Design Document: Token Compliance & Motion Build Fix

**Date**: 2026-03-14
**Spec**: 079 — Token Compliance & Motion Build Fix
**Status**: Design Phase
**Dependencies**: Spec 049 (EASING category pattern)

---

## Overview

Three related fixes to the token system: eliminate duplicate motion primitives in browser CSS output, complete the DURATION/SCALE category migration started in Spec 049, and resolve 20 token compliance violations in Avatar-Base and Button-VerticalList platform files.

## Architecture

### Issue 1: Primitive Pass Filter

`TokenFileGenerator.generateWebTokens()` assembles CSS in two passes. The primitive pass iterates `getAllPrimitiveTokens()` and outputs raw values. The motion section calls `WebBuilder.generateDurationTokens()` which outputs duration tokens with `ms` units. Both passes emit the same tokens — duration gets different formatting, easing and scale get identical output.

**Fix**: Add a category filter in the primitive pass loop:

```typescript
// In generateWebTokens() primitive pass
const MOTION_CATEGORIES = new Set([TokenCategory.EASING, TokenCategory.DURATION, TokenCategory.SCALE]);

for (const token of getAllPrimitiveTokens()) {
  if (MOTION_CATEGORIES.has(token.category)) continue; // handled by motion section
  // ... existing formatToken() logic
}
```

This requires Issue 2 (category migration) to complete first — can't filter by `DURATION`/`SCALE` if they're still `SPACING`.

### Issue 2: Category Enum Extension

Extend `TokenCategory` in `src/types/PrimitiveToken.ts`:

```typescript
export enum TokenCategory {
  // ... existing values
  EASING = 'easing',    // already exists (Spec 049)
  DURATION = 'duration', // new
  SCALE = 'scale'        // new
}
```

Update token definitions in `DurationTokens.ts` and `ScaleTokens.ts` to use the new categories. Update `allTokens` map in `src/tokens/index.ts` to include `DURATION` and `SCALE` entries.

### Issue 3: Component Token Structure

**Avatar component tokens** (`src/components/core/Avatar-Base/tokens.ts`):

```
avatar.dimension.xs  = 24     avatar.icon.xs  = 12
avatar.dimension.s   = 32     avatar.icon.s   = 16
avatar.dimension.m   = 40     avatar.icon.m   = 20
avatar.dimension.l   = 48     avatar.icon.l   = 24
avatar.dimension.xl  = 80     avatar.icon.xl  = 40
avatar.dimension.xxl = 128    avatar.icon.xxl = 64
```

Mathematical relationship: icon = dimension × 0.5 (consistent across all sizes).

Note: Existing code comments claim icon sizes reference `icon.size050` (16dp), `icon.size075` (20dp), etc. — but the actual hard-coded values don't match those tokens. The component token approach makes the real values explicit.

**Button-VerticalList fixes** are straightforward token reference substitutions — no new tokens needed.

## Error Handling

- If `DURATION` or `SCALE` category is missing when the filter runs, the primitive pass falls through to existing behavior (duplicates persist but nothing breaks).
- Component token creation follows `defineComponentTokens()` pattern with required reasoning fields.

## Testing Strategy

- Existing `TokenCompliance.test.ts` validates Issue 3 fixes (should go from 20 violations to 0).
- Browser build output can be validated by checking `tokens.css` for duplicate `--duration-*` declarations.
- Existing token validation tests cover category enum changes.
