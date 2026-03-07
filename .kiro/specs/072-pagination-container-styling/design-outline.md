# Progress-Pagination-Base Container Styling Update — Design Outline

**Date**: March 6, 2026
**Purpose**: Update Progress-Pagination-Base visual styling to match Figma design analysis
**Status**: Design Outline (Ready for Formalization — Spec 073 complete)
**Prior Spec**: 048-progress-family (original implementation)
**Dependency**: Spec 073 (Opacity Architecture Evolution) — ✅ Complete
**Platforms**: Web, iOS, Android (all in scope)

---

## Context

This is the first component update driven by the Figma analysis pipeline. The analysis extractions (`analysis-progress-pagination` and `analysis-progress-indicator-primitive`, both extracted 2026-03-06 and 2026-03-03 respectively) reveal visual styling gaps between the Figma design and the current implementation.

**What this spec covers**: Container-level visual styling for Progress-Pagination-Base.
**What this spec does NOT cover**: Behavioral changes, new states, labels, or primitive-level changes.

**Source analysis data**:
- `analysis/analysis-progress-pagination/progress-pagination-analysis.md`
- `analysis/analysis-progress-indicator-primitive/progress-indicator-primitive-analysis.md`

---

## Scope: Visual-Only Update

The existing behavioral contracts, types, virtualization logic, accessibility implementation, and test suite remain unchanged. This update adds container styling that was absent from the initial implementation.

### What Changes

| Property | Current | Target | Token |
|----------|---------|--------|-------|
| Container background | None (transparent) | `rgba(0, 0, 0, 0.8)` | `color.scrim.standard` |
| Container border-radius | None | Pill shape | `radius.full` (9999px) |
| Container padding (Sm/Md) | None | 6px all sides | `space.inset.075` |
| Container padding (Lg) | None | 8px all sides | `space.inset.100` |
| Item gap (Sm/Md) | 6px/8px (fallback) | 4px | `space.grouped.tight` |
| Item gap (Lg) | 12px (fallback) | 8px | `space.grouped.normal` |

### What Does NOT Change

- Component API (props, types, constants)
- Behavioral contracts (composition, state derivation, virtualization, accessibility)
- Permanent test suite — no new behavioral tests needed

---

## Token Decisions (Resolved)

### 1. Container Background — `color.scrim.standard` ✅

Resolved by Spec 073. Semantic color token using the `TokenModifier` pattern:
```typescript
'color.scrim.standard': {
  name: 'color.scrim.standard',
  primitiveReferences: { value: 'black500' },
  modifiers: [{ type: 'opacity', reference: 'opacity080' }],
  modeInvariant: true,
  category: SemanticCategory.COLOR,
  context: 'Derived from black500 at opacity080 (80%). Scrim tokens dim content regardless of theme.',
  description: 'Standard scrim for floating surfaces over content — pagination pills, dense overlays, floating toolbars.'
}
```

Platform output: `rgba(0, 0, 0, 0.80)` / `UIColor(red: 0, green: 0, blue: 0, alpha: 0.80)` / `Color.argb(204, 0, 0, 0)`

**Note**: This token is `modeInvariant: true` — it does NOT change between light/dark themes. Do not wrap in mode-switching conditionals.

### 2. Container Border-Radius — `radius.full` ✅

**Decision**: `radius.full` (references `radiusMax` = 9999px), NOT `radius.circle`.

The container is a rounded rectangle (pill shape), not a true circle. The distinction in our system:
- `radius.circle` → `radiusHalf` (50%) — creates true circles from square elements
- `radius.full` → `radiusMax` (9999px) — creates pills from rectangles

The Figma value of `50` is a fixed pixel value that creates a pill at certain sizes, but `radius.full` (9999px) is the robust approach that works at any container dimension. The pagination dots themselves use `radius.circle` (they're actual circles), but the container uses `radius.full`.

(Ada, 2026-03-06)

### 3. Container Padding — `space.inset.075` / `space.inset.100` ✅

**Decision**: Use semantic inset tokens, not primitives directly.

| Size | Token | Resolves to |
|------|-------|-------------|
| Sm/Md | `space.inset.075` | `space075` → 6px |
| Lg | `space.inset.100` | `space100` → 8px |

Inset tokens exist specifically for "padding within components and containers." Using primitives directly when a semantic token covers the exact use case would violate the token selection priority (semantic first). The Figma analysis binds to primitives because that's the Figma representation — the code representation should use the semantic layer.

(Ada recommendation, Peter approved, 2026-03-06)

### 4. Item Gap — `space.grouped.tight` / `space.grouped.normal` ✅

**Decision**: Adopt current Figma values. No CSS fallbacks.

| Size | Token | Resolves to | Previous (048) |
|------|-------|-------------|----------------|
| Sm/Md | `space.grouped.tight` | `space050` → 4px | 6px / 8px |
| Lg | `space.grouped.normal` | `space100` → 8px | 12px |

The Figma design has been updated since the original 048 spec. Current Figma values are the source of truth. Key change: Sm and Md now share the same gap value, simplifying from three spacing tiers to two.

CSS custom property fallbacks (`var(--token, fallback)`) are removed — if a token doesn't resolve, that's a bug to fix, not a fallback to paper over.

(Peter, 2026-03-06)

---

## Complete Token Summary

| Property | Token | Primitive | Value | Governance |
|----------|-------|-----------|-------|------------|
| Background | `color.scrim.standard` | black500 @ opacity080 | rgba(0,0,0,0.80) | Semantic ✅ |
| Border-radius | `radius.full` | radiusMax | 9999px | Semantic ✅ |
| Padding (Sm/Md) | `space.inset.075` | space075 | 6px | Semantic ✅ |
| Padding (Lg) | `space.inset.100` | space100 | 8px | Semantic ✅ |
| Gap (Sm/Md) | `space.grouped.tight` | space050 | 4px | Semantic ✅ |
| Gap (Lg) | `space.grouped.normal` | space100 | 8px | Semantic ✅ |

All tokens are semantic-level. No primitive direct usage. No component token creation needed.

---

## Implementation Approach

### Web First, Then iOS and Android

All three platforms are in scope. Web is implemented first to validate the design, then iOS and Android follow. The container styling is purely visual — no behavioral contracts change — so platform implementations are independent.

### Files to Modify — Web

1. `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.styles.css`
   - Add container background, border-radius, padding
   - Update gap values to match current Figma design
   - Remove CSS fallback values

### Files to Modify — iOS and Android

**Lina to confirm**: What platform files need updating for container styling? Potential candidates:
- `src/components/core/Progress-Pagination-Base/platforms/ios/` — styling/layout changes
- `src/components/core/Progress-Pagination-Base/platforms/android/` — styling/layout changes
- Token mapping files if container tokens need platform-specific resolution

### Files to Modify — Shared

1. `src/components/core/Progress-Pagination-Base/README.md`
   - Update Token Dependencies section to reflect container tokens
   - Add container styling documentation

2. `src/components/core/Progress-Pagination-Base/Progress-Pagination-Base.schema.yaml`
   - Add container token references

### Files NOT Modified

- `types.ts` — no API changes
- `contracts.yaml` — no behavioral contract changes
- `index.ts` — no export changes
- `ProgressPaginationBase.web.ts` — no logic changes (CSS-only update for web)
- `__tests__/PaginationBase.test.ts` — no permanent test changes

---

## Delivery Validation

Per our discussion: no permanent style tests. Functional behavioral tests remain as-is.

**Temporary delivery validation** (removed after sign-off):
- Visual inspection against Figma screenshots for all 3 size variants
- Verify container background renders with correct opacity
- Verify pill shape at all sizes
- Verify padding scales correctly between Sm/Md and Lg
- Verify gap spacing matches approved token values

**Permanent validation**:
- Existing behavioral test suite passes (`npm test -- PaginationBase.test.ts`)
- No regressions in composition, state, virtualization, or accessibility contracts

---

## Design Decisions

### Decision 1: Scoped Spec (Not Additive to 048)

This is a standalone spec scoped to this specific update, not an amendment to 048-progress-family. The original spec (048) remains as the historical record of the initial implementation. This spec (072) records the container styling update.

**Rationale**: Specs are scoped to a particular need at a moment in time. The README and schema serve as the living truth of current state.

### Decision 2: Web-First Sequencing, All Platforms In Scope

Container styling is applied to web first, then iOS and Android. All three platforms are deliverables.

**Rationale**: Validate the design on one platform before committing cross-platform effort. The container styling is purely visual — no behavioral contracts change — so platform implementations are independent. Figma analysis is a blueprint for all platforms.

### Decision 3: No Labels in Pagination

The Figma analysis shows Label text nodes in Md/Lg variants of the Progress Indicator Primitive instances within the pagination component. These labels are inherited from the primitive's variant structure and are NOT intended for pagination use.

**Confirmed**: Pagination remains dots-only. Labels are part of the primitive's capability set, leveraged by Stepper components, not by Pagination.

### Decision 4: No Additional States

The primitive analysis shows 4 states (Incomplete, Complete, Error, Current). Pagination continues to use only 2 (current, incomplete). Complete and Error states are part of the primitive's capability set for Stepper components.

### Decision 5: No CSS Fallbacks

Token bindings use direct token references without fallback values. If a token doesn't resolve, that's a system bug to fix — not something to mask with hardcoded fallbacks.

---

## Domain Review Recommendations

### Ada (Token Specialist) — ✅ Complete
- ~~Validate `color.scrim` semantic token proposal~~ → `color.scrim.standard` delivered in Spec 073
- ~~Confirm container border-radius token choice~~ → `radius.full` (not `radius.circle`)
- ~~Verify item spacing values~~ → Figma values confirmed as source of truth
- ~~Advise on container padding token strategy~~ → Semantic inset tokens (`space.inset.075`/`.100`)

### Lina (Component Specialist) — After Formalization
- Implement CSS changes per approved token decisions
- Implement iOS and Android container styling
- Confirm platform file scope for iOS/Android
- Update README token documentation

### Thurgood (Governance) — After Implementation
- Audit that behavioral test suite still passes
- Verify no contract drift from the styling update
- Confirm delivery validation checklist is completed

---

## Resolved Questions

1. ~~**Ada**: Is `rgba(0, 0, 0, 0.8)` a blend token, opacity token, or standalone semantic color?~~ → `color.scrim.standard` using `TokenModifier` pattern. See Spec 073.
2. ~~**Ada**: `semanticRadius.circle` or `semanticRadius.pill` for the container?~~ → `radius.full` (9999px pill shape). `radius.circle` (50%) is for true circles only. (Ada, 2026-03-06)
3. ~~**Ada**: Do the Figma gap values supersede the original spec values?~~ → Yes. Figma design updated since 048. Current Figma values are source of truth. (Peter, 2026-03-06)
4. ~~**Ada**: Primitive padding tokens directly, or component tokens?~~ → Semantic inset tokens: `space.inset.075` / `space.inset.100`. (Ada recommendation, Peter approved, 2026-03-06)
5. ~~**Peter**: Should iOS/Android be in-scope for this spec, or deferred?~~ → All platforms in scope. (Peter, 2026-03-06)

## Open Questions for Lina

1. **iOS/Android platform files**: What files need updating for container styling on iOS and Android? Are the changes purely declarative (styling/layout), or do token mappings need updating? (Flagged by Thurgood, 2026-03-06)

2. **Token resolution on native platforms**: The Complete Token Summary above lists 6 semantic tokens. Are all of these already available in the generated platform files (`DesignTokens.swift`, `DesignTokens.kt`), or do any need to be added to the generator output? In particular, `color.scrim.standard` is new (Spec 073) — confirm it will be present in generated output before 072 implementation begins. (Flagged by Thurgood, 2026-03-06)

3. **DOM update strategy**: The current web implementation uses full `innerHTML` replacement on render. The CSS-only changes in this spec (background, radius, padding, gap) don't require DOM strategy changes — but Spec 074 (Pagination Animation) will. Is there anything in the CSS implementation here that should be done with 074 in mind to avoid rework? (Flagged by Thurgood, 2026-03-06)
