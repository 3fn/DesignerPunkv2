---
inclusion: manual
name: Token-Family-Sizing
description: Sizing token family — component dimensions (width, height, box size). Separate from spacing (gaps). Load when working with component sizes, avatar dimensions, button sizes, or any component dimensional value.
---

# Sizing Token Family Documentation

**Date**: 2026-04-03
**Last Reviewed**: 2026-04-03
**Purpose**: Sizing primitive token reference and usage guide
**Organization**: token-documentation
**Scope**: token-system
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The Sizing Token Family provides primitives for component dimensions — widths, heights, and box sizes. It is semantically distinct from spacing, which describes gaps between and around elements.

**Why separate from spacing?** Spacing and sizing answer different design questions. Spacing: "How much gap?" Sizing: "How big is this thing?" If a future density mode tightens spacing, component dimensions should remain unchanged. The separation ensures independent scalability.

**Base value**: 8 (aligns with the 8px baseline grid and spacing base — `size100 = 8` matches `space100 = 8`)

---

## Sizing Primitive Tokens

| Token | Formula | Value | Platform Values |
|-------|---------|-------|-----------------|
| `size050` | base × 0.5 | 4 | 4px / 4pt / 4dp |
| `size100` | base × 1 | 8 | 8px / 8pt / 8dp |
| `size150` | base × 1.5 | 12 | 12px / 12pt / 12dp |
| `size200` | base × 2 | 16 | 16px / 16pt / 16dp |
| `size250` | base × 2.5 | 20 | 20px / 20pt / 20dp |
| `size300` | base × 3 | 24 | 24px / 24pt / 24dp |
| `size400` | base × 4 | 32 | 32px / 32pt / 32dp |
| `size500` | base × 5 | 40 | 40px / 40pt / 40dp |
| `size600` | base × 6 | 48 | 48px / 48pt / 48dp |
| `size700` | base × 7 | 56 | 56px / 56pt / 56dp |
| `size800` | base × 8 | 64 | 64px / 64pt / 64dp |
| `size1000` | base × 10 | 80 | 80px / 80pt / 80dp |
| `size1600` | base × 16 | 128 | 128px / 128pt / 128dp |

All values are multiples of 4 (baseline grid aligned).

---

## Relationship to Spacing

Sizing and spacing share the same base value (8) and the same grid. Numeric suffixes align: `size300 = 24` matches `space300 = 24`. The difference is purely semantic.

| Use Case | Token Family | Example |
|----------|-------------|---------|
| Gap between buttons | Spacing | `space200` (16px gap) |
| Button height | Sizing | `size600` (48px tall) |
| Padding inside a card | Spacing | `space200` (16px padding) |
| Avatar diameter | Sizing | `size500` (40px circle) |
| Margin below a heading | Spacing | `space150` (12px margin) |
| Progress bar height | Sizing | `size100` (8px tall) |

**Rule of thumb**: If it's the physical dimension of a component's container, use sizing. If it's the space between or around things, use spacing.

---

## Component Consumers

| Component | Tokens Used | Sizes |
|-----------|------------|-------|
| Button-Icon | `size400`, `size500`, `size600` | sm=32, md=40, lg=48 |
| Avatar-Base | `size300`–`size1600` | xs=24, sm=32, md=40, lg=48, xl=80, xxl=128 |
| Progress-Node | `size150`–`size300` | sm=12/16, md=16/20, lg=20/24 (base/current) |
| Input-Checkbox | `size300`, `size400`, `size500` | sm=24, md=32, lg=40 |
| Input-Radio | `size300`, `size400`, `size500` | sm=24, md=32, lg=40 |
| Nav-TabBar-Base | `size050` | dot=4 |
| Progress-Bar (Spec 090) | `size050`, `size100`, `size150` | sm=4, md=8, lg=12 |

---

## What Is NOT in This Family

| Token | Family | Why |
|-------|--------|-----|
| `icon.size050`–`icon.size200` | Semantic icon family | Derived from typography (fontSize × lineHeight) |
| `tapAreaMinimum`, `tapAreaRecommended` | Accessibility family | Constraint tokens, not dimensions |
| Spacing tokens (`space*`) | Spacing family | Gaps between/around elements |

---

## Mathematical Foundation

- **Base value**: 8 (same as spacing)
- **Progression**: Linear multipliers (0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 16)
- **Grid alignment**: All values are multiples of 4
- **Source file**: `src/tokens/SizingTokens.ts`
- **Category**: `TokenCategory.SIZING`
