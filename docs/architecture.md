---
layout: deep-dive
title: Architecture
description: True Native architecture, Rosetta token system, and cross-platform generation pipeline.
---

# Architecture

## True Native Philosophy

DesignerPunk doesn't wrap web views or use runtime platform detection. Instead, it generates genuinely native code for each platform at build time:

- **Web**: CSS custom properties (`--space-600: 48px`)
- **iOS**: Swift constants (`public static let space600: CGFloat = 48`)
- **Android**: Kotlin constants (`const val space_600: Float = 48f`)

Each platform gets idiomatic output — CSS uses `px` and `rem`, iOS uses `pt`, Android uses `dp` and `sp`. There's no abstraction layer at runtime, no performance cost, and no "lowest common denominator" compromise.

The same token source produces all three outputs. Change a base value, regenerate, and every platform updates.

## The Rosetta Token System

Rosetta is the token architecture that makes this work. It has three layers:

### Primitive Tokens — The Mathematical Foundation

Primitive tokens are the raw values. Each family starts with a base constant and derives its values through mathematical relationships:

| Family | Base Constant | Relationship | Example |
|--------|--------------|--------------|---------|
| Spacing | `8` | Multiples of base | `space-600 = 8 × 6 = 48px` |
| Font Size | `16` | Modular scale (1.125 ratio) | `font-size-200 = 16 × 1.125³ ≈ 23px` |
| Radius | `8` | Multiples of base | `radius-200 = 8 × 2 = 16px` |
| Line Height | `1.5` | Derived from base | `line-height-100 = 1.5` |
| Blend | `0.04` | Multiples of base | `blend-300 = 0.04 × 3 = 0.12` |
| Shadow Blur | `4` | Multiples of base | `shadow-blur-200 = 4 × 2 = 8px` |
| Duration | `250` | Offsets from base | `duration-150 = 250 - 100 = 150ms` |

16 primitive families, each with its own base constant and mathematical progression. The entire system grows from these few inputs.

### Semantic Tokens — Design Intent

Semantic tokens reference primitives but encode *purpose*:

```
--color-feedback-error-text    → references a primitive red
--color-feedback-success-text  → references a primitive green
--color-action-primary         → references the brand cyan
```

Using `color-feedback-error-text` instead of `red-500` makes code self-documenting and theme-aware. The semantic layer is where design decisions live — primitives are just math.

### Component Tokens — Scoped Usage

Component tokens reference primitives or semantics for specific component needs:

```
--button-cta-radius    → references radius-200
--badge-count-padding  → references space-100
```

This three-tier hierarchy means a single change to a primitive propagates through semantics and components automatically.

## Cross-Platform Generation Pipeline

The generation pipeline reads the token source (TypeScript definitions with mathematical relationships) and outputs platform-native files:

**The same token, three platforms:**

```css
/* Web — CSS Custom Properties */
--space-600: 48px;
```

```swift
// iOS — Swift Constants
public static let space600: CGFloat = 48
```

```kotlin
// Android — Kotlin Constants
const val space_600: Float = 48f
```

Each platform gets its own naming convention (`camelCase` for Swift, `snake_case` for Kotlin, `kebab-case` for CSS), its own unit system, and its own file format. The output files are:

- `DesignTokens.web.css` — 942 lines of CSS custom properties
- `DesignTokens.ios.swift` — Swift struct with static constants
- `DesignTokens.android.kt` — Kotlin object with const vals

## Unitless Architecture

Internally, all tokens are stored as unitless numbers. The base value for `space-600` is `48` — not `48px` or `48pt`. Units are applied at generation time based on the target platform:

| Token | Internal Value | Web | iOS | Android |
|-------|---------------|-----|-----|---------|
| `space-600` | `48` | `48px` | `48pt` | `48dp` |
| `font-size-200` | `23` | `1.4375rem` | `23pt` | `23sp` |
| `line-height-100` | `1.5` | `1.5` | `1.5` | `1.5` |

This is what makes True Native possible. The same mathematical value gets the right unit for each platform without any runtime conversion.

## 614 Tokens, 16 Families, 3 Platforms

The full token surface covers:

- **Spacing** — 8-unit baseline grid with strategic flexibility tokens
- **Typography** — Font size (modular scale), weight, line height, letter spacing, font family
- **Color** — Primitive palette + semantic color system with light/dark mode
- **Shape** — Radius, border width
- **Elevation** — Shadow offset, blur, opacity, composite shadows
- **Effects** — Blend, glow, opacity
- **Motion** — Duration, easing
- **Layout** — Breakpoints, grid gutters, grid margins
- **Accessibility** — Tap area minimums, density scaling
- **Layering** — Z-index hierarchy

Every value is either mathematically derived from a base constant or composed from tokens that are.
