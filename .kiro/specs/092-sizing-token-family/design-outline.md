# Sizing Token Family — Design Outline

**Date**: 2026-04-03
**Author**: Ada
**Purpose**: Define a new primitive token family for component dimensions (width, height, box size)
**Status**: Design Outline — Draft
**Origin**: Audit of 6+ component families using spacing primitives for non-spacing dimensional values

---

## Overview

DesignerPunk currently uses spacing primitives for two distinct purposes: gaps between/around elements (actual spacing) and physical dimensions of elements (sizing). This conflation works when the values overlap, but creates a semantic mismatch — changing a spacing scale for density shouldn't change component dimensions, and vice versa.

An audit of existing components identified 6 families with dimensional sizing needs:

| Component | Sizes (px) | Currently References |
|-----------|-----------|---------------------|
| Button-Icon | 32, 40, 48 | `space400`, `space500`, `space600` |
| Avatar-Base | 24, 32, 40, 48, 80, 128 | Component tokens (values, not spacing refs) |
| Progress-Node | 12, 16, 24 | Component tokens |
| Input-Checkbox | 24, 32, 40 | Component tokens |
| Input-Radio | 24, 32, 40 | Component tokens |
| Progress-Bar (Spec 090) | 4, 8, 12 | Proposed: `space050`, `space100`, `space150` |

**Timing**: Before product development begins. Same reasoning as the blur unification (Spec 089).

---

## The Semantic Problem

Spacing tokens answer: "How much gap between/around things?"
Sizing tokens answer: "How big is this thing?"

These are different design decisions. Consider:

- **Density modes**: Compact mode tightens spacing (less gap). Component dimensions (button height, avatar size) should stay the same — a button doesn't get shorter in compact mode, the gaps around it get smaller.
- **Responsive scaling**: On smaller screens, you might reduce spacing but keep component sizes. Or scale component sizes but keep spacing.
- **Design intent**: `progressBar.height.md = space100` reads as "the bar's height is one unit of spacing." `progressBar.height.md = size100` reads as "the bar's height is the base component size." The second communicates intent.

Today we don't have density modes, so the coupling is theoretical. But the semantic mismatch is real now — Button-Icon's `size.large = space600` is documented as a sizing token that references a spacing primitive.

---

## Mathematical Foundation

**Base value**: 16 (consistent with `fontSize100`, `blur100`)

### Proposed Scale

| Token | Formula | Value | Consumers |
|-------|---------|-------|-----------|
| `size025` | base × 0.25 | 4 | Progress-Bar sm |
| `size050` | base × 0.5 | 8 | Progress-Bar md |
| `size075` | base × 0.75 | 12 | Progress-Bar lg, Progress-Node sm |
| `size100` | base × 1 | 16 | Progress-Node md |
| `size150` | base × 1.5 | 24 | Progress-Node lg, Checkbox sm, Radio sm, Avatar xs |
| `size200` | base × 2 | 32 | Button-Icon sm, Checkbox md, Radio md, Avatar sm |
| `size250` | base × 2.5 | 40 | Button-Icon md, Checkbox lg, Radio lg, Avatar md |
| `size300` | base × 3 | 48 | Button-Icon lg, Avatar lg |
| `size500` | base × 5 | 80 | Avatar xl |
| `size800` | base × 8 | 128 | Avatar xxl |

10 tokens covering all existing component sizing values. All multiples of 4 (baseline grid aligned).

**Note**: The scale has a gap between `size300` (48) and `size500` (80). This reflects actual usage — no component currently needs 56 or 64 as a dimension. We can add `size350` (56), `size400` (64) later if needed. The naming convention accommodates this without renumbering.

### Comparison to Spacing Scale

| Value | Spacing Token | Sizing Token | Both Exist? |
|-------|--------------|-------------|-------------|
| 4 | `space050` | `size025` | ✅ |
| 8 | `space100` | `size050` | ✅ |
| 12 | `space150` | `size075` | ✅ |
| 16 | `space200` | `size100` | ✅ |
| 24 | `space300` | `size150` | ✅ |
| 32 | `space400` | `size200` | ✅ |
| 40 | `space500` | `size250` | ✅ |
| 48 | `space600` | `size300` | ✅ |
| 80 | — | `size500` | Sizing only |
| 128 | — | `size800` | Sizing only |

The values overlap significantly — that's expected, since both are built on the baseline grid. The difference is semantic, not mathematical. The naming differs because the base values differ (spacing base = 8, sizing base = 16).

---

## Architecture

### No Semantic Sizing Layer

Same decision as blur (Spec 089): no intermediate semantic tokens. Component tokens provide the semantic meaning:

```
Primitives:    size025  size050  size075  size100  size150  size200  size250  size300  size500  size800
                  ↓       ↓       ↓        ↓        ↓        ↓        ↓        ↓        ↓        ↓
Component:    progressBar.height  node.size  checkbox.size  buttonIcon.size  avatar.size
```

Component tokens like `buttonIcon.size.large` reference `size300` instead of `space600`. The consumer API doesn't change — components still expose `size: 'sm' | 'md' | 'lg'`.

### Relationship to Existing Size-Like Tokens

DesignerPunk already has size-like tokens in specialized families:

- **`tapAreaMinimum` / `tapAreaRecommended`** (accessibility family) — touch target minimums. These are constraints, not dimensions. They stay in the accessibility family.
- **`icon.size050` through `icon.size200`** (semantic icon family) — icon dimensions derived from typography. These are semantically bound to typography scaling. They stay in the icon family.

The sizing primitive family is for **component box dimensions** — the physical width/height of a component's container. It doesn't replace specialized sizing tokens that have their own derivation logic.

---

## Migration

### Button-Icon (explicit spacing references)

| Old Reference | New Reference | Value (unchanged) |
|--------------|--------------|-------------------|
| `space600` | `size300` | 48 |
| `space500` | `size250` | 40 |
| `space400` | `size200` | 32 |

Consumer: `src/components/core/Button-Icon/buttonIcon.tokens.ts`

### Other Components (component tokens with hard values)

Avatar, Progress-Node, Checkbox, Radio — these have component tokens with values but may not reference spacing primitives. The migration is: update component tokens to reference sizing primitives instead of hard-coded values or spacing references.

Scope TBD — needs Lina's input on which component token files need updating and whether any reference spacing primitives directly.

### Progress-Bar (new component, Spec 090)

No migration — Spec 090 would reference sizing primitives from the start.

---

## Scope

### In Scope
- Sizing primitive definitions (10 tokens in `SizingTokens.ts`)
- `TokenCategory.SIZING` (new category)
- Token registration in `src/tokens/index.ts`
- Generation pipeline (generic primitive pass — same as blur)
- DTCG and Figma export
- Token-Family-Sizing.md steering doc
- Test coverage (formula validation, mathematical relationships, cross-platform consistency)
- Regenerate `dist/` platform token files
- Button-Icon component token migration (`space*` → `size*`)

### Out of Scope
- Avatar, Checkbox, Radio, Progress-Node component token migrations — these should be coordinated with Lina and may be separate subtasks or a follow-up
- Icon size tokens — remain in the semantic icon family (typography-derived)
- Tap area tokens — remain in the accessibility family (constraint tokens)
- Density mode implementation — future concern that motivates the separation but isn't part of this spec

### Key Constraint
**Zero visual change.** All component dimensions resolve to the same numeric values after migration.

---

## Open Questions

1. **Scale completeness**: Should we include `size350` (56) and `size400` (64) preemptively? They're on the baseline grid and correspond to `space700` and `space800`. No current consumers, but they fill the gap between 48 and 80. Lean no — add when needed, naming accommodates it.

2. **Component token migration scope**: Should this spec migrate all 6 component families, or just Button-Icon (the only one explicitly referencing spacing primitives) and leave others for follow-up? Lina's input needed.

3. **Naming**: `size` prefix vs `dimension` prefix? `size` is shorter and matches how components already name their tokens (`buttonIcon.size.large`). `dimension` is more precise but verbose. Lean `size`.

---

## Dependencies

- **Spec 090** (Progress-Bar) benefits from this spec — can reference sizing primitives directly
- No upstream dependencies

---

## Risk Assessment

Low risk for the primitive family creation. The migration surface depends on open question 2 — Button-Icon only is small, all 6 families is broader but still mechanical (same values, different references).

Mitigated by: zero visual change, strong test coverage, component token layer insulating consumers from primitive changes.
