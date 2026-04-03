# Design Document: Sizing Token Family

**Date**: 2026-04-03
**Spec**: 092 - Sizing Token Family
**Status**: Design Phase
**Dependencies**: None (Spec 090 benefits from this spec)

---

## Overview

New primitive token family for component dimensions (width, height, box size). 13 tokens with base 8. Migrates 6 component families + Nav-TabBar-Base from spacing primitives or hard-coded values to sizing primitives. Zero visual change.

---

## Architecture

### Token Hierarchy (Post-Migration)

```
SizingTokens.ts (13 primitives)
    │
    ├── Button-Icon tokens (size400, size500, size600)
    ├── Progress-Node tokens (size150–size300 base + current)
    ├── Avatar-Base tokens (size300–size1600)
    ├── Input-Checkbox-Base tokens (size300–size500)
    ├── Input-Radio-Base tokens (size300–size500)
    ├── Nav-TabBar-Base dot (size050)
    └── [Progress-Bar — Spec 090, references from the start]
```

No semantic sizing layer. Component tokens provide the semantic meaning — `buttonIcon.size.large` references `size600`, consumers see `size: 'lg'`.

### Relationship to Other Size-Like Tokens

| Family | Purpose | Stays Where It Is |
|--------|---------|-------------------|
| Sizing primitives (new) | Component box dimensions | — |
| `icon.size*` (semantic) | Icon dimensions derived from typography | ✅ Typography-bound |
| `tapArea*` (accessibility) | Touch target constraints | ✅ Constraint tokens |
| Spacing primitives | Gaps between/around elements | ✅ Different purpose |

---

## Data Models

### SizingTokens.ts

```typescript
const SIZING_BASE = 8;

const SizingTokens = {
  size050:  { value: SIZING_BASE * 0.5,  formula: 'base × 0.5',  category: TokenCategory.SIZING },
  size100:  { value: SIZING_BASE * 1,    formula: 'base × 1',    category: TokenCategory.SIZING },
  size150:  { value: SIZING_BASE * 1.5,  formula: 'base × 1.5',  category: TokenCategory.SIZING },
  size200:  { value: SIZING_BASE * 2,    formula: 'base × 2',    category: TokenCategory.SIZING },
  size250:  { value: SIZING_BASE * 2.5,  formula: 'base × 2.5',  category: TokenCategory.SIZING },
  size300:  { value: SIZING_BASE * 3,    formula: 'base × 3',    category: TokenCategory.SIZING },
  size400:  { value: SIZING_BASE * 4,    formula: 'base × 4',    category: TokenCategory.SIZING },
  size500:  { value: SIZING_BASE * 5,    formula: 'base × 5',    category: TokenCategory.SIZING },
  size600:  { value: SIZING_BASE * 6,    formula: 'base × 6',    category: TokenCategory.SIZING },
  size700:  { value: SIZING_BASE * 7,    formula: 'base × 7',    category: TokenCategory.SIZING },  // preemptive
  size800:  { value: SIZING_BASE * 8,    formula: 'base × 8',    category: TokenCategory.SIZING },  // preemptive
  size1000: { value: SIZING_BASE * 10,   formula: 'base × 10',   category: TokenCategory.SIZING },
  size1600: { value: SIZING_BASE * 16,   formula: 'base × 16',   category: TokenCategory.SIZING },
};
```

Actual implementation uses full `PrimitiveToken` shape (name, category, baseValue, familyBaseValue, description, mathematicalRelationship, baselineGridAlignment, platforms).

### TokenCategory Addition

```typescript
enum TokenCategory {
  // ... existing categories
  SIZING = 'sizing',
}
```

Generic primitive pass — no `DEDICATED_PRIMITIVE_CATEGORIES` entry.

---

## Components and Interfaces

### Files Created

| File | Purpose |
|------|---------|
| `src/tokens/SizingTokens.ts` | Sizing primitive definitions |
| `.kiro/steering/Token-Family-Sizing.md` | Family documentation |
| `src/components/core/Avatar-Base/avatar-sizing.tokens.ts` | Avatar sizing component tokens |
| `src/components/core/Input-Checkbox-Base/checkbox-sizing.tokens.ts` | Checkbox sizing component tokens |
| `src/components/core/Input-Radio-Base/radio-sizing.tokens.ts` | Radio sizing component tokens |

### Files Modified

| File | Change |
|------|--------|
| `src/tokens/index.ts` | Re-export SizingTokens |
| `src/types/PrimitiveToken.ts` | Add `TokenCategory.SIZING` |
| `src/components/core/Button-Icon/buttonIcon.tokens.ts` | `space400/500/600` → `size400/500/600` (3 refs) |
| `src/tokens/component/progress.ts` | `space150/200/250` → `size150/200/250` (base), `space200/250/300` → `size200/250/300` (current), `SPACING_BASE_VALUE` → `SIZING_BASE_VALUE`, remove formula computation for current-size — reference primitives directly |
| `src/components/core/Nav-TabBar-Base/` tokens | `space050` → `size050` (1 ref) |
| `.kiro/steering/Token-Family-Spacing.md` | Cross-reference: dimensional values should use sizing tokens |
| `.kiro/steering/Token-Quick-Reference.md` | Add sizing family to token documentation map |

### Files Regenerated

| File | Notes |
|------|-------|
| `dist/web/DesignTokens.web.css` | Sizing tokens as CSS custom properties |
| `dist/ios/DesignTokens.ios.swift` | Sizing tokens as Swift constants |
| `dist/android/DesignTokens.android.kt` | Sizing tokens as Kotlin constants |
| DTCG output | Sizing tokens in DTCG format |

---

## Design Decisions

### Decision 1: Base 8 Alignment

Base 8 aligns sizing suffixes with spacing: `size300 = 24` matches `space300 = 24`. Numeric suffixes mean the same thing across both families. This outweighs consistency with blur (base 16) and fontSize (base 16), which operate in different domains.

### Decision 2: No Semantic Layer

Component tokens provide semantic meaning. `buttonIcon.size.large = size600` is self-documenting. A semantic layer (`sizing.component.large = size600`) would be 1:1 aliasing with no added value.

### Decision 3: Progress-Node Direct References

Current-size (emphasized) tokens reference sizing primitives directly instead of computing from `SIZING_BASE_VALUE × multiplier`. If the sizing base changes independently of spacing in the future, computed values would shift unexpectedly. Direct references are explicit and resilient.

### Decision 4: Checkbox/Radio Icon Exclusion

Checkbox and Radio have both box dimensions (sizing tokens) and icon dimensions (icon tokens). The component token files reference sizing primitives for the box/container only. Checkmark and radio dot icons continue using `icon.size*` tokens — they're typography-derived, not component-dimensional.

---

## Migration Mapping

### Button-Icon

| Old Reference | New Reference | Value |
|--------------|--------------|-------|
| `space400` | `size400` | 32 |
| `space500` | `size500` | 40 |
| `space600` | `size600` | 48 |

### Progress-Node (base sizes)

| Old Reference | New Reference | Value |
|--------------|--------------|-------|
| `space150` | `size150` | 12 |
| `space200` | `size200` | 16 |
| `space250` | `size250` | 20 |

### Progress-Node (current/emphasized sizes)

| Old Pattern | New Reference | Value |
|------------|--------------|-------|
| `SPACING_BASE_VALUE × 2` | `size200` | 16 |
| `SPACING_BASE_VALUE × 2.5` | `size250` | 20 |
| `SPACING_BASE_VALUE × 3` | `size300` | 24 |

### Nav-TabBar-Base

| Old Reference | New Reference | Value |
|--------------|--------------|-------|
| `space050` | `size050` | 4 |

### Avatar-Base (new token file — hard-coded → primitives)

| Size | Value | Token |
|------|-------|-------|
| xs | 24 | `size300` |
| sm | 32 | `size400` |
| md | 40 | `size500` |
| lg | 48 | `size600` |
| xl | 80 | `size1000` |
| xxl | 128 | `size1600` |

### Input-Checkbox-Base (new token file — hard-coded → primitives)

| Size | Value | Token |
|------|-------|-------|
| sm | 24 | `size300` |
| md | 32 | `size400` |
| lg | 40 | `size500` |

### Input-Radio-Base (new token file — hard-coded → primitives)

| Size | Value | Token |
|------|-------|-------|
| sm | 24 | `size300` |
| md | 32 | `size400` |
| lg | 40 | `size500` |

---

## Error Handling

No runtime error handling needed. Build-time token definition change. Errors surface as TypeScript compilation failures or test failures.

---

## Testing Strategy

| Test Type | What It Validates |
|-----------|------------------|
| Formula validation | Each sizing primitive's value = base × multiplier |
| Mathematical relationships | Scale progression: size050 < size100 < ... < size1600 |
| Component regression | All component tests pass — dimensions unchanged |
| Cross-platform consistency | Generated sizing values identical across web/iOS/Android |
| DTCG export | Sizing tokens present in DTCG output |
| Token compliance | No spacing primitives used for dimensional values in migrated components |

---

## Correctness Properties

1. Every sizing primitive value equals `SIZING_BASE × multiplier`
2. Every migrated component renders at the same pixel dimensions before and after
3. No component public API changes — `size: 'sm' | 'md' | 'lg'` unchanged
4. No spacing primitive is referenced for dimensional purposes in migrated components
5. Generated platform token files contain all 13 sizing primitives with correct numeric values
6. Checkbox and Radio icon sizes remain in the icon family — not migrated to sizing
7. Progress-Node current-size tokens reference sizing primitives directly — no base × multiplier computation
