# Design Document: Unified Blur Token Family

**Date**: 2026-03-30
**Spec**: 089 - Unified Blur Token Family
**Status**: Design Phase
**Dependencies**: None (Spec 088 depends on this spec)

---

## Overview

Replace two disconnected blur primitive families (shadow blur, glow blur) with a single unified family of 9 tokens. Add `TokenCategory.BLUR` to the token system. Migrate all consumers. Zero visual change.

---

## Architecture

### Token Hierarchy (Post-Migration)

```
BlurTokens.ts (9 primitives)
    │
    ├── ShadowTokens.ts (composites reference blur primitives by name)
    │       └── Component tokens (reference shadow composites — unchanged)
    │
    ├── [Glow composites — future, currently zero consumers]
    │
    └── [Surface blur — consumed by components in Spec 088, not this spec]
```

The blur primitives are a leaf dependency — they feed into shadow composites, which feed into component tokens. The migration changes the leaf names; everything above resolves to the same numeric values.

---

## Data Models

### BlurTokens.ts

```typescript
// Base value: 16 (consistent with fontSize100)
const BLUR_BASE = 16;

const BlurTokens = {
  blur000: { value: 0,                formula: '0',              category: TokenCategory.BLUR },
  blur025: { value: BLUR_BASE * 0.25, formula: 'base × 0.25',   category: TokenCategory.BLUR },
  blur050: { value: BLUR_BASE * 0.5,  formula: 'base × 0.5',    category: TokenCategory.BLUR },
  blur075: { value: BLUR_BASE * 0.75, formula: 'base × 0.75',   category: TokenCategory.BLUR },
  blur100: { value: BLUR_BASE * 1,    formula: 'base × 1',      category: TokenCategory.BLUR },
  blur125: { value: BLUR_BASE * 1.25, formula: 'base × 1.25',   category: TokenCategory.BLUR },
  blur150: { value: BLUR_BASE * 1.5,  formula: 'base × 1.5',    category: TokenCategory.BLUR },
  blur200: { value: BLUR_BASE * 2,    formula: 'base × 2',      category: TokenCategory.BLUR },
  blur250: { value: BLUR_BASE * 2.5,  formula: 'base × 2.5',    category: TokenCategory.BLUR },
};
```

### TokenCategory Addition

```typescript
enum TokenCategory {
  // ... existing categories
  BLUR = 'blur',
}
```

No `DEDICATED_PRIMITIVE_CATEGORIES` entry. Blur tokens flow through the generic primitive generation pass — standard numeric values like spacing, radius, or fontSize.

---

## Components and Interfaces

### Files Created

| File | Purpose |
|------|---------|
| `src/tokens/BlurTokens.ts` | Unified blur primitive definitions |
| `.kiro/steering/Token-Family-Blur.md` | Family documentation |

### Files Deleted

| File | Replaced By |
|------|------------|
| `src/tokens/ShadowBlurTokens.ts` | `BlurTokens.ts` |
| `src/tokens/GlowBlurTokens.ts` | `BlurTokens.ts` |

### Files Modified

| File | Change |
|------|--------|
| `src/tokens/index.ts` | Re-export `BlurTokens`, remove old exports |
| `src/types/PrimitiveToken.ts` | Add `TokenCategory.BLUR` |
| `src/tokens/semantic/ShadowTokens.ts` | Update blur primitive references (6 renames) |
| `.kiro/steering/Token-Family-Shadow.md` | Replace blur section with cross-reference |
| `.kiro/steering/Token-Family-Glow.md` | Replace blur section with cross-reference |

### Files Regenerated

| File | Notes |
|------|-------|
| `dist/web/DesignTokens.web.css` | Blur tokens as CSS custom properties |
| `dist/ios/DesignTokens.ios.swift` | Blur tokens as Swift constants |
| `dist/android/DesignTokens.android.kt` | Blur tokens as Kotlin constants |
| DTCG output | Blur tokens in DTCG format |

---

## Migration Mapping

### Shadow Blur

| Old Token | New Token | Value | Consumer |
|-----------|----------|-------|----------|
| `shadowBlurNone` | `blur000` | 0 | `ShadowTokens.ts` |
| `shadowBlurHard` | `blur025` | 4 | `ShadowTokens.ts` |
| `shadowBlurModerate` | `blur075` | 12 | `ShadowTokens.ts` |
| `shadowBlurSoft` | `blur125` | 20 | `ShadowTokens.ts` |
| `shadowBlurDepth200` | `blur100` | 16 | `ShadowTokens.ts` |
| `shadowBlurDepth300` | `blur150` | 24 | `ShadowTokens.ts` |

### Glow Blur

| Old Token | New Token | Value | Consumer |
|-----------|----------|-------|----------|
| `glowBlur100` | `blur050` | 8 | None |
| `glowBlur200` | `blur100` | 16 | None |
| `glowBlur300` | `blur150` | 24 | None |
| `glowBlur400` | `blur200` | 32 | None |
| `glowBlur500` | `blur250` | 40 | None |

---

## Error Handling

No runtime error handling needed. This is a build-time token definition change. Errors surface as:
- TypeScript compilation failures (if references are missed)
- Test failures (if values change)
- Generation pipeline warnings (if category is unrecognized)

---

## Testing Strategy

| Test Type | What It Validates |
|-----------|------------------|
| Formula validation | Each blur primitive's value = base × multiplier |
| Mathematical relationships | Scale progression: blur000 < blur025 < ... < blur250 |
| Shadow composite regression | Every shadow composite resolves to same numeric blur value as before |
| Cross-platform consistency | Generated blur values identical across web/iOS/Android |
| DTCG export | Blur tokens present in DTCG output |
| Existing test migration | All old `shadowBlur*` and `glowBlur*` test references updated |

---

## Correctness Properties

1. Every blur primitive value equals `BLUR_BASE × multiplier` (or 0 for blur000)
2. Every shadow composite resolves to the same numeric blur value before and after migration
3. No component token file changes — components reference shadow composites, not blur primitives
4. Glow blur migration has zero consumer updates
5. Generated platform token files contain all 9 blur primitives with correct numeric values
6. Old token names (`shadowBlur*`, `glowBlur*`) do not appear in any source file after migration
