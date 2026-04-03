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

**Base value**: 8 (aligns with the 8px baseline grid and spacing base — `size100 = 8` means one grid unit, matching `space100 = 8`)

### Proposed Scale

| Token | Formula | Value | Consumers |
|-------|---------|-------|-----------|
| `size050` | base × 0.5 | 4 | Progress-Bar sm |
| `size100` | base × 1 | 8 | Progress-Bar md |
| `size150` | base × 1.5 | 12 | Progress-Bar lg, Progress-Node sm |
| `size200` | base × 2 | 16 | Progress-Node md |
| `size300` | base × 3 | 24 | Progress-Node lg, Checkbox sm, Radio sm, Avatar xs |
| `size400` | base × 4 | 32 | Button-Icon sm, Checkbox md, Radio md, Avatar sm |
| `size500` | base × 5 | 40 | Button-Icon md, Checkbox lg, Radio lg, Avatar md |
| `size600` | base × 6 | 48 | Button-Icon lg, Avatar lg |
| `size700` | base × 7 | 56 | (available) |
| `size800` | base × 8 | 64 | (available) |
| `size1000` | base × 10 | 80 | Avatar xl |
| `size1600` | base × 16 | 128 | Avatar xxl |

12 tokens covering all existing component sizing values plus two preemptive values (56, 64). All multiples of 4 (baseline grid aligned).

**Why base 8 instead of 16**: Sizing and spacing are the most closely related families — same grid, same value ranges, same consumers (component tokens). Having `size300 = 24` match `space300 = 24` is immediately intuitive. The numeric suffixes mean the same thing across both families. This outweighs consistency with blur (`blur100 = 16`) and fontSize (`fontSize100 = 16`), which operate in different domains.

**Note**: The scale has a gap between `size800` (64) and `size1000` (80), and between `size1000` (80) and `size1600` (128). This reflects actual usage — Avatar xl and xxl are exceptional sizes. The naming convention accommodates future additions (e.g., `size900` = 72, `size1200` = 96) without renumbering.

### Comparison to Spacing Scale

| Value | Spacing Token | Sizing Token | Both Exist? |
|-------|--------------|-------------|-------------|
| 4 | `space050` | `size050` | ✅ |
| 8 | `space100` | `size100` | ✅ |
| 12 | `space150` | `size150` | ✅ |
| 16 | `space200` | `size200` | ✅ |
| 24 | `space300` | `size300` | ✅ |
| 32 | `space400` | `size400` | ✅ |
| 40 | `space500` | `size500` | ✅ |
| 48 | `space600` | `size600` | ✅ |
| 56 | `space700` | `size700` | ✅ |
| 64 | `space800` | `size800` | ✅ |
| 80 | — | `size1000` | Sizing only |
| 128 | — | `size1600` | Sizing only |

With base 8, the numeric suffixes align perfectly between spacing and sizing for all shared values. The difference is purely semantic — spacing describes gaps, sizing describes dimensions.

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
| `space600` | `size600` | 48 |
| `space500` | `size500` | 40 |
| `space400` | `size400` | 32 |

Consumer: `src/components/core/Button-Icon/buttonIcon.tokens.ts`

### Other Components (component tokens with hard values)

Avatar, Progress-Node, Checkbox, Radio — these have component tokens with values but may not reference spacing primitives. The migration is: update component tokens to reference sizing primitives instead of hard-coded values or spacing references.

Scope TBD — needs Lina's input on which component token files need updating and whether any reference spacing primitives directly.

### Progress-Bar (new component, Spec 090)

No migration — Spec 090 would reference sizing primitives from the start.

---

## Scope

### In Scope
- Sizing primitive definitions (12 tokens in `SizingTokens.ts`)
- `TokenCategory.SIZING` (new category)
- Token registration in `src/tokens/index.ts`
- Generation pipeline (generic primitive pass — same as blur)
- DTCG and Figma export
- Token-Family-Sizing.md steering doc
- Test coverage (formula validation, mathematical relationships, cross-platform consistency)
- Regenerate `dist/` platform token files
- Button-Icon component token migration (`space*` → `size*` — 3 refs)
- Progress-Node component token migration (`space*` → `size*`, rename `SPACING_BASE_VALUE` to sizing base — 3 refs + formula constant)
- Avatar-Base component token file creation + sizing primitive references (6 sizes, currently hard-coded)
- Input-Checkbox-Base component token file creation + sizing primitive references (3 sizes, currently hard-coded)
- Input-Radio-Base component token file creation + sizing primitive references (3 sizes, currently hard-coded)
- Nav-TabBar-Base dot size migration (`space050` → `size050` — 1 ref)

### Out of Scope
- Progress-Bar (Spec 090) — references sizing primitives from the start, no migration
- Icon size tokens — remain in the semantic icon family (typography-derived)
- Tap area tokens — remain in the accessibility family (constraint tokens)
- Density mode implementation — future concern that motivates the separation but isn't part of this spec

### Key Constraint
**Zero visual change.** All component dimensions resolve to the same numeric values after migration.

---

## Confirmed Decisions (Ada + Peter, 2026-04-03)

### Q1: Scale Completeness — Include 56 and 64
Include `size700` (56) and `size800` (64) preemptively. They fill the gap between 48 and 80, sit on the baseline grid, and the naming convention accommodates them cleanly.

### Q2: Base Value — 8
Base 8 aligns with the baseline grid and spacing base. `size300 = 24` matches `space300 = 24` — numeric suffixes mean the same thing across both families.

### Q3: Naming — `size` Prefix
`size` is shorter, matches existing component token naming (`buttonIcon.size.large`), and is universally understood.

### Q4: DTCG Export — Yes
All 12 sizing primitives included in DTCG output, Figma export, and all platform token files. Consistent with spacing, blur, and other primitive families.

### Q5: Migration Scope — All Families in One Spec
All 6 component families plus Nav-TabBar-Base dot size migrated in this spec. No phasing — buttoned up before product development.

- Button-Icon, Progress-Node: swap spacing refs (low complexity)
- Avatar, Checkbox, Radio: create component token files + reference sizing primitives (medium complexity, coordinated with Lina)
- Nav-TabBar-Base: swap dot size ref (low complexity)

---

## Open Questions

None — all decisions confirmed.

---

## Dependencies

- **Spec 090** (Progress-Bar) benefits from this spec — can reference sizing primitives directly
- No upstream dependencies

---

## Risk Assessment

Low-medium risk. The primitive family creation and direct-ref migrations (Button-Icon, Progress-Node, TabBar) are mechanical. The component token file creation (Avatar, Checkbox, Radio) is broader — these components don't have `*.tokens.ts` files today, so the migration includes creating new infrastructure, not just swapping references. This is Lina's domain and requires coordination.

Mitigated by: zero visual change, strong test coverage, Lina's detailed migration assessment confirming no dual-purpose tokens or complications, and the component token layer insulating consumers from primitive changes.
