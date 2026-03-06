# Progress-Pagination-Base Container Styling Update — Design Outline

**Date**: March 6, 2026
**Purpose**: Update Progress-Pagination-Base visual styling to match Figma design analysis
**Status**: Design Outline (Draft — Blocked on Spec 073)
**Prior Spec**: 048-progress-family (original implementation)
**Blocked By**: Spec 073 (Opacity Architecture Evolution) — scrim tokens and modifier architecture required before container background can be implemented

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

| Property | Current | Figma Analysis | Notes |
|----------|---------|----------------|-------|
| Container background | None (transparent) | `rgba(0, 0, 0, 0.8)` | Dark scrim — see Token Decisions below |
| Container border-radius | None | `50` (pill shape) | Suggested: `semanticRadius.circle` |
| Container padding (Sm/Md) | None | `space.space075` (all sides) | Primitive token binding in Figma |
| Container padding (Lg) | None | `space.space100` (all sides) | Primitive token binding in Figma |
| Item spacing (Sm/Md) | `var(--progress-node-gap-sm/md)` fallback 6px/8px | `semanticSpace.grouped.tight` → `space.space050` | ⚠️ Ada: verify resolved values match or differ |
| Item spacing (Lg) | `var(--progress-node-gap-lg)` fallback 12px | `semanticSpace.grouped.normal` → `space.space100` | ⚠️ Ada: verify resolved values match or differ |

### What Does NOT Change

- Component API (props, types, constants)
- Behavioral contracts (composition, state derivation, virtualization, accessibility)
- Platform implementations (iOS, Android) — scoped to web initially
- Permanent test suite — no new behavioral tests needed

---

## Token Decisions (Pending Ada Review)

### 1. Container Background — Resolved by Spec 073

The Figma analysis shows `rgba(0, 0, 0, 0.8)` as the container fill. This is now addressed by Spec 073's scrim token architecture.

**Resolved**: `color.scrim.standard` — a semantic color token using the new `TokenModifier` pattern:
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

Platform output: `rgba(0, 0, 0, 0.80)` / `UIColor(red: 0, green: 0, blue: 0, alpha: 0.80)` / `Color(0f, 0f, 0f, 0.80f)`

**Note**: This token is `modeInvariant: true` — it does NOT change between light/dark themes. Do not wrap in mode-switching conditionals. The MCP server may surface `modeInvariant` as a queryable property (pending 073 or separate MCP update).

### 2. Container Border-Radius

The Figma analysis suggests `semanticRadius.circle` (value: 50). This is a full pill shape.

**Question for Ada**: Is `semanticRadius.circle` the correct semantic for a pill-shaped container? Or should this be `semanticRadius.pill`? The node dots use `circle` (they're actual circles), but the container is a rounded rectangle that happens to use a large radius.

### 3. Container Padding

Figma binds padding to primitive space tokens:
- Sm/Md: `space.space075` (all sides)
- Lg: `space.space100` (all sides)

**Decision needed**: Should these be referenced as primitive tokens directly, or should we create component tokens (e.g., `progress.pagination.padding.sm`, `progress.pagination.padding.lg`)?

Per Core Goals token governance: primitive tokens require prior context or human acknowledgment. We have the Figma analysis as context. Component tokens require explicit human approval.

**Recommendation**: Use primitive tokens directly. The padding values are straightforward and don't encode complex semantic intent that would benefit from a component token abstraction. Creating component tokens here adds indirection without adding clarity.

HOWEVER — counter-argument: if other progress family components (Stepper-Base, Stepper-Detailed) also get container styling later, having component tokens would ensure consistency across the family. Worth considering whether this is a one-off or a pattern.

### 4. Item Spacing — Verify or Update

Current implementation uses component gap tokens (`progress.node.gap.sm/md/lg`) with CSS custom property fallbacks.

The Figma analysis shows:
- Sm/Md: `semanticSpace.grouped.tight` → `space.space050`
- Lg: `semanticSpace.grouped.normal` → `space.space100`

The original design outline (048) specified:
- Sm gap: `space075` (6px)
- Md gap: `space100` (8px)
- Lg gap: `space150` (12px)

**These may conflict.** The Figma analysis shows Sm and Md using the same spacing (`space050`), while the original spec had them different. Ada needs to verify:
1. What are the resolved pixel values of `space050` and `space100`?
2. Has the Figma design changed the gap values since the original spec?
3. Should we update the component gap tokens, or is the Figma analysis reflecting a different context?

---

## Implementation Approach

### Web Only (Initial Scope)

This update targets the web platform CSS only. iOS and Android implementations would follow as separate tasks if the design is approved.

### Files to Modify

1. `src/components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.styles.css`
   - Add container background, border-radius, padding
   - Update gap values if Ada confirms changes needed

2. `src/components/core/Progress-Pagination-Base/README.md`
   - Update Token Dependencies section to reflect container tokens
   - Add container styling documentation

3. `src/components/core/Progress-Pagination-Base/Progress-Pagination-Base.schema.yaml`
   - Add container token references if new component tokens are created

### Files NOT Modified

- `types.ts` — no API changes
- `contracts.yaml` — no behavioral contract changes
- `index.ts` — no export changes
- `ProgressPaginationBase.web.ts` — no logic changes (CSS-only update)
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

### Decision 2: Web-First, Platform-Follow

Container styling is applied to web first. iOS and Android follow as separate tasks within this spec if the web implementation is approved.

**Rationale**: Validate the design on one platform before committing cross-platform effort. The container styling is purely visual — no behavioral contracts change — so platform implementations are independent.

### Decision 3: No Labels in Pagination

The Figma analysis shows Label text nodes in Md/Lg variants of the Progress Indicator Primitive instances within the pagination component. These labels are inherited from the primitive's variant structure and are NOT intended for pagination use.

**Confirmed**: Pagination remains dots-only. Labels are part of the primitive's capability set, leveraged by Stepper components, not by Pagination.

### Decision 4: No Additional States

The primitive analysis shows 4 states (Incomplete, Complete, Error, Current). Pagination continues to use only 2 (current, incomplete). Complete and Error states are part of the primitive's capability set for Stepper components.

---

## Domain Review Recommendations

### Ada (Token Specialist) — Required Before Implementation
- Validate `color.scrim` semantic token proposal
- Confirm container border-radius token choice (`circle` vs `pill`)
- Verify item spacing values (Figma analysis vs original spec)
- Advise on container padding token strategy (primitive direct vs component tokens)

### Lina (Component Specialist) — After Ada Review
- Implement CSS changes per approved token decisions
- Update README token documentation
- Cross-platform implementation (iOS, Android) if approved

### Thurgood (Governance) — After Implementation
- Audit that behavioral test suite still passes
- Verify no contract drift from the styling update
- Confirm delivery validation checklist is completed

---

## Open Questions

1. ~~**Ada**: Is `rgba(0, 0, 0, 0.8)` a blend token, opacity token, or standalone semantic color?~~ **RESOLVED**: `color.scrim.standard` using `TokenModifier` pattern. See Spec 073.
2. **Ada**: `semanticRadius.circle` or `semanticRadius.pill` for the container?
3. **Ada**: Do the Figma gap values (`space050` for Sm/Md, `space100` for Lg) supersede the original spec values (`space075`/`space100`/`space150`)?
4. **Ada**: Primitive padding tokens directly, or component tokens for container padding?
5. **Peter**: Should iOS/Android be in-scope for this spec, or deferred?
