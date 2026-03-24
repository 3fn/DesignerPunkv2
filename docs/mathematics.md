---
layout: deep-dive
title: Mathematical Foundation
description: Modular scale derivation, baseline grid system, and token formula examples.
---

# Mathematical Foundation

## The Baseline Grid

The baseline grid is the spatial backbone of the system. Most spatial token families — spacing, radius, shadow offset, glow blur — share a base value of **8 units**.

Token values are derived as multiples of this base:

```
space-100 = 8 × 1  =  8px
space-200 = 8 × 2  = 16px
space-300 = 8 × 3  = 24px
space-400 = 8 × 4  = 32px
space-500 = 8 × 5  = 40px
space-600 = 8 × 6  = 48px
space-700 = 8 × 7  = 56px
space-800 = 8 × 8  = 64px
```

The same pattern applies to radius:

```
radius-100 = 8 × 1 =  8px
radius-200 = 8 × 2 = 16px
radius-300 = 8 × 3 = 24px
radius-400 = 8 × 4 = 32px
```

This shared base means spacing and radius values are inherently harmonious — a `space-200` padding and a `radius-200` corner use the same underlying value (16), creating visual consistency without manual coordination.

## Strategic Flexibility

A pure 8-unit grid only produces multiples of 8: `0, 8, 16, 24, 32...`. Real interfaces need finer granularity — a 2px internal padding, a 6px gap between icon and label, a 12px inset.

Rather than abandoning the grid, DesignerPunk introduces **strategic flexibility tokens** — values that are still mathematically derived from the base but break the strict grid progression:

```
space-025 = 8 × 0.25 =  2px   (fine-grain, component-internal)
space-050 = 8 × 0.5  =  4px   (sub-grid)
space-075 = 8 × 0.75 =  6px   (breaks 8-unit grid)
space-125 = 8 × 1.25 = 10px   (between standard steps)
space-150 = 8 × 1.5  = 12px   (sub-grid)
space-250 = 8 × 2.5  = 20px   (between standard steps)
```

Every value is still a rational multiple of the base constant. Nothing is arbitrary. The system tracks which tokens are grid-aligned and which are strategic flexibility exceptions, maintaining mathematical traceability even when the strict grid is insufficient.

## The Modular Scale

Typography uses a different mathematical model: the **modular scale**. Starting from a base font size of **16px** (the browser default), each step multiplies by a ratio of **1.125** (a musical major second interval):

```
font-size-050 = 16 × 1.125⁻² ≈ 13px   (0.8125rem)
font-size-075 = 16 × 1.125⁻¹ ≈ 14px   (0.875rem)
font-size-100 = 16 × 1.125⁰  = 16px   (1rem)
font-size-125 = 16 × 1.125¹  = 18px   (1.125rem)
font-size-150 = 16 × 1.125²  ≈ 20px   (1.25rem)
font-size-200 = 16 × 1.125³  ≈ 23px   (1.4375rem)
font-size-300 = 16 × 1.125⁴  ≈ 26px   (1.625rem)
font-size-400 = 16 × 1.125⁵  ≈ 29px   (1.8125rem)
font-size-500 = 16 × 1.125⁶  ≈ 33px   (2.0625rem)
font-size-600 = 16 × 1.125⁷  ≈ 37px   (2.3125rem)
font-size-700 = 16 × 1.125⁸  ≈ 42px   (2.625rem)
```

The 1.125 ratio produces a gentle, readable progression — each step is 12.5% larger than the previous. Values are rounded to the nearest 0.0625rem (1px) for pixel-grid alignment.

Why a musical interval? Modular scales have been used in typography since the Renaissance. The mathematical relationship between steps creates visual harmony the same way musical intervals create auditory harmony — the proportions feel "right" because they follow a consistent ratio, not because someone eyeballed them.

## Other Family Formulas

Each token family has its own base constant and derivation rule:

| Family | Base | Rule | Example |
|--------|------|------|---------|
| Spacing | `8` | `base × multiplier` | `space-300 = 8 × 3 = 24px` |
| Radius | `8` | `base × multiplier` | `radius-200 = 8 × 2 = 16px` |
| Font Size | `16` | `base × 1.125ⁿ` | `font-size-200 = 16 × 1.125³ ≈ 23px` |
| Line Height | `1.5` | Derived from base | `line-height-100 = 1.5` |
| Blend | `0.04` | `base × multiplier` | `blend-300 = 0.04 × 3 = 0.12` |
| Opacity | `0.08` | `base × multiplier` | `opacity-300 = 0.08 × 3 = 0.24` |
| Border Width | `1` | `base × multiplier` | `border-width-200 = 1 × 2 = 2px` |
| Shadow Blur | `4` | `base × multiplier` | `shadow-blur-200 = 4 × 2 = 8px` |
| Shadow Offset | `4` | `base × multiplier` | `shadow-offset-200 = 4 × 2 = 8px` |
| Duration | `250` | `base ± offset` | `duration-150 = 250 - 100 = 150ms` |
| Tap Area | `44` | Platform minimum | `tap-area-recommended = 44pt` |

The pattern is consistent: a small number of base constants, applied through simple mathematical operations, producing the entire token surface. No magic numbers.

## Why This Matters

Three practical benefits of mathematical derivation:

1. **Extensibility** — Need a new spacing value? Apply the formula. The value is determined by the system, not by a designer's judgment call. This eliminates "what should this value be?" debates.

2. **Consistency** — Values that share a mathematical base produce visual harmony automatically. Spacing, radius, and shadow tokens all derive from multiples of 8, so they align without manual coordination.

3. **Auditability** — Every token carries its derivation as metadata (`base × 3 = 8 × 3 = 24`). Tests validate that token values match their formulas. If a value drifts, the test suite catches it.
