# Design Document: Pagination Container Styling

**Date**: 2026-03-07
**Spec**: 072 - Pagination Container Styling
**Status**: Design Phase
**Dependencies**: Spec 073 (Opacity Architecture Evolution) — ✅ Complete

---

## Overview

Add container styling (background, border-radius, padding, gap) to Progress-Pagination-Base across web, iOS, and Android. All styling uses semantic tokens. No behavioral, API, or contract changes.

---

## Architecture

No architectural changes. This is a CSS/styling update on web and declarative modifier additions on iOS/Android. The component structure, DOM strategy, virtualization logic, and state derivation remain unchanged.

---

## Token Mapping

| Property | Token | Primitive | Value | Platform Output |
|----------|-------|-----------|-------|-----------------|
| Background | `color.scrim.standard` | black500 @ opacity080 | rgba(0,0,0,0.80) | CSS: `rgba()` / iOS: `UIColor` / Android: `Color` |
| Border-radius | `radius.full` | radiusMax | 9999px | CSS: `border-radius` / iOS: `Capsule()` / Android: `RoundedCornerShape(50%)` |
| Padding (Sm/Md) | `space.inset.075` | space075 | 6px | CSS: `padding` / iOS: `.padding()` / Android: `.padding()` |
| Padding (Lg) | `space.inset.100` | space100 | 8px | CSS: `padding` / iOS: `.padding()` / Android: `.padding()` |
| Gap (Sm/Md) | `space.grouped.tight` | space050 | 4px | CSS: `gap` / iOS: `PaginationGap` / Android: `paginationGap()` |
| Gap (Lg) | `space.grouped.normal` | space100 | 8px | CSS: `gap` / iOS: `PaginationGap` / Android: `paginationGap()` |

All tokens are semantic-level. No primitive direct usage. No component token creation.

---

## Components and Interfaces

### Web — CSS Changes

File: `ProgressPaginationBase.styles.css`

Container classes gain background, border-radius, and padding. Gap values updated from three tiers (sm/md/lg with fallbacks) to two tiers (sm+md / lg without fallbacks).

```css
.pagination {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-scrim-standard);
  border-radius: var(--radius-full);
}

.pagination--sm,
.pagination--md {
  padding: var(--space-inset-075);
  gap: var(--space-grouped-tight);
}

.pagination--lg {
  padding: var(--space-inset-100);
  gap: var(--space-grouped-normal);
}
```

Note: Exact CSS custom property names depend on the token generation output format. The above uses the expected naming convention.

### iOS — SwiftUI Changes

File: `ProgressPaginationBase.ios.swift`

Add styling modifiers to the container `HStack`:
- `.padding(size == .lg ? DesignTokens.spaceInset100 : DesignTokens.spaceInset075)`
- `.background(DesignTokens.colorScrimStandard)` 
- `.clipShape(Capsule())`

Modifier order matters in SwiftUI: padding first (so background extends to cover padded area), then background, then clip.

Update `PaginationGap.value(for:)`:
- Replace hardcoded values (6/8/12) with `DesignTokens` semantic references
- Collapse from 3 tiers to 2: sm+md → `DesignTokens.spaceGroupedTight`, lg → `DesignTokens.spaceGroupedNormal`

### Android — Compose Changes

File: `ProgressPaginationBase.android.kt`

Add styling modifiers to the container `Row`:
- `.background(color = DesignTokens.color_scrim_standard, shape = RoundedCornerShape(percent = 50))`
- `.padding(if (size == Size.Lg) DesignTokens.space_inset_100 else DesignTokens.space_inset_075)`

Update `paginationGap()`:
- Replace primitive token references (`space_075`/`space_100`/`space_150`) with semantic grouped tokens
- Collapse from 3 tiers to 2: sm+md → `DesignTokens.space_grouped_tight`, lg → `DesignTokens.space_grouped_normal`

---

## Data Models

No data model changes.

---

## Error Handling

No new error conditions. Token resolution failures are system-level bugs handled by the token pipeline, not by this component.

---

## Testing Strategy

No new permanent tests. This is a visual-only update with no behavioral changes.

**Permanent validation**: Existing behavioral test suite passes (`npm test -- PaginationBase.test.ts`). No regressions in composition, state, virtualization, or accessibility contracts.

**Temporary delivery validation** (removed after sign-off):
- Visual inspection against Figma screenshots for all 3 size variants on all 3 platforms
- Verify container background renders with correct opacity
- Verify pill shape at all sizes
- Verify padding scales correctly between Sm/Md and Lg
- Verify gap spacing matches token values (4px for sm/md, 8px for lg)

---

## Design Decisions

### Decision 1: Semantic Tokens Only

All 6 tokens are semantic-level. No primitive direct usage, no component token creation. The semantic tokens (`space.inset.*`, `space.grouped.*`, `radius.full`, `color.scrim.standard`) exist for exactly these use cases.

**Trade-off**: If the pagination container needs unique spacing that diverges from the semantic tokens in the future, component tokens would need to be created at that point. Current Figma values align perfectly with existing semantics, so this is the right choice now.

### Decision 2: No CSS Fallbacks

Token bindings use direct references without fallback values. If a token doesn't resolve, that's a system bug to fix, not something to mask with hardcoded fallbacks.

**Trade-off**: A missing token causes a visible rendering issue rather than a graceful degradation. Acceptable because token availability is validated at build time, not runtime.

### Decision 3: Two Gap Tiers Instead of Three

Sm and Md now share the same gap value (`space.grouped.tight` → 4px). The original 048 spec had three distinct values (6px/8px/12px). The Figma design has been updated — current Figma values are the source of truth.

**Trade-off**: Sm and Md pagination look more similar to each other. This is intentional per the updated design.
