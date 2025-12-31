---
inclusion: manual
---

# Radius Tokens Guide

**Date**: December 30, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for radius tokens with numeric naming convention and mathematical relationships
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk radius token system provides a mathematically consistent foundation for corner rounding across all platforms. Radius tokens follow an 8-unit baseline grid with strategic flexibility exceptions, using numeric naming that exposes mathematical relationships.

**Key Principles**:
- **Numeric Naming**: Token names use numbers (025, 050, 100, etc.) that represent mathematical relationships
- **Mathematical Foundation**: All values derive from base unit (radius100 = 8px) with clear multipliers
- **Baseline Grid Alignment**: Primary tokens align to 8px baseline grid for visual consistency
- **Strategic Flexibility**: Exceptions (radius075, radius125, radius250) for component-level needs
- **Cross-Platform Consistency**: Unitless base values convert to platform-specific units

---

## Primitive Radius Tokens

### Base Unit System

All radius tokens derive from a base unit of **8px** (radius100):

| Token Name | Value | Mathematical Relationship | Baseline Aligned | Use Case |
|------------|-------|---------------------------|------------------|----------|
| `radius000` | 0px | 0 × base (radius100) | ✅ | Sharp corners, no rounding |
| `radius025` | 2px | 0.25 × base (radius100) | ❌ | Subtle rounding, minimal softening |
| `radius050` | 4px | 0.5 × base (radius100) | ❌ | Small rounding, compact elements |
| `radius075` | 6px | 0.75 × base (radius100) | ❌ | Strategic flexibility for components |
| `radius100` | 8px | 1 × base (baseline unit) | ✅ | Standard rounding, default radius |
| `radius125` | 10px | 1.25 × base (radius100) | ❌ | Strategic flexibility for components |
| `radius150` | 12px | 1.5 × base (radius100) | ❌ | Medium-large rounding |
| `radius200` | 16px | 2 × base (radius100) | ✅ | Large rounding, prominent elements |
| `radius250` | 20px | 2.5 × base (radius100) | ❌ | Strategic flexibility for components |
| `radius300` | 24px | 3 × base (radius100) | ✅ | Huge rounding, feature elements |
| `radius400` | 32px | 4 × base (radius100) | ✅ | Maximum rounding |
| `radiusFull` | 9999px | Special case (infinite) | ❌ | Perfect circles, pill shapes |

### Baseline Grid Alignment

**8px Baseline Grid**: Primary radius tokens (000, 100, 200, 300, 400) align to the 8px baseline grid, ensuring consistent visual rhythm across components.

**Strategic Flexibility Tokens**: radius075 (6px), radius125 (10px), and radius250 (20px) are mathematically derived exceptions that don't align to the 8px grid but maintain clear relationships to the base unit.

**Fractional Tokens**: radius025 (2px), radius050 (4px), and radius150 (12px) provide fine-grained control for specific component needs while maintaining mathematical relationships.

### Why Numeric Naming?

Numeric token names expose mathematical relationships that enable:

**Proportion Reasoning**: Developers and AI agents can calculate relationships without memorization
- "radius200 is 2× radius100" is immediately clear
- "radius050 is 0.5× radius100" shows the halving pattern
- "radius075 is 0.75× radius100" reveals the fractional relationship

**AI-Friendly Context**: Numeric names provide unambiguous mathematical context for AI collaboration
- No subjective interpretation needed
- Clear mathematical operations possible
- Consistent reasoning across all radius decisions

**Scalability**: Adding new tokens maintains mathematical consistency
- New tokens follow the same multiplier pattern
- Relationships remain clear as system grows
- No arbitrary naming decisions required

---

## Semantic Radius Tokens

Semantic radius tokens provide contextual meaning for specific component patterns. They reference primitive radius tokens and are organized by visual intent.

### Token Reference Table

| Semantic Token | Primitive Reference | Value | Use Case |
|----------------|---------------------|-------|----------|
| `radiusNone` | radius000 | 0px | Sharp corners, angular design |
| `radiusSubtle` | radius025 | 2px | Minimal softening, dense interfaces |
| `radiusSmall` | radius050 | 4px | Compact elements, chips, small buttons |
| `radiusNormal` | radius100 | 8px | Standard elements, buttons, cards, modals |
| `radiusLarge` | radius200 | 16px | Prominent elements, feature cards, hero sections |
| `radiusFull` | radiusFull | 9999px | Pills, circular avatars, badges |

### Semantic Token Details

#### radiusNone (Sharp Corners)

**References**: radius000 (0px)

**Use Cases**:
- Sharp-edged cards requiring angular appearance
- Rectangular containers with no corner rounding
- Input fields with sharp corners
- Explicitly removing border radius from elements
- Reset states for border radius

**Visual Style**: Sharp, angular, no softening

**Rationale**: Explicit "none" token improves search/discoverability, communicates intent (sharp corners vs. forgetting to add radius), and provides consistent maintenance pattern.

#### radiusSubtle (Minimal Softening)

**References**: radius025 (2px)

**Use Cases**:
- Elements requiring minimal corner rounding
- Dense interfaces with slight softening
- Minimal visual weight without drawing attention

**Visual Style**: Barely perceptible rounding, subtle softening

#### radiusSmall (Compact Elements)

**References**: radius050 (4px)

**Use Cases**:
- Small buttons and compact button elements
- Chips, tags, and badge components
- Small input fields
- Dense UI elements

**Visual Style**: Noticeable but compact rounding

#### radiusNormal (Standard Elements)

**References**: radius100 (8px)

**Use Cases**:
- Standard buttons (default button rounding)
- Cards (standard card corner rounding)
- Containers (default container rounding)
- Modals (modal dialog corner rounding)
- Standard inputs (default input field rounding)

**Visual Style**: Standard, balanced rounding

#### radiusLarge (Prominent Elements)

**References**: radius200 (16px)

**Use Cases**:
- Large cards and prominent feature cards
- Hero sections and large hero containers
- Prominent buttons with large emphasis
- Feature callouts and emphasized content blocks

**Visual Style**: Prominent, soft rounding

#### radiusFull (Pills and Circles)

**References**: radiusFull (9999px)

**Use Cases**:
- Pill-shaped buttons and badges
- Circular avatars and round avatar images
- Circular badges and notification badges
- Any element requiring perfect circular/pill shape

**Visual Style**: Perfect circles or pills (fully rounded)

---

## Mathematical Relationships

### Base Multiplier Pattern

All radius tokens follow a clear multiplier pattern from the base unit (radius100 = 8px):

```
radius000 = radius100 × 0     = 0px
radius025 = radius100 × 0.25  = 2px
radius050 = radius100 × 0.5   = 4px
radius075 = radius100 × 0.75  = 6px   (strategic flexibility)
radius100 = radius100 × 1     = 8px   (base unit)
radius125 = radius100 × 1.25  = 10px  (strategic flexibility)
radius150 = radius100 × 1.5   = 12px
radius200 = radius100 × 2     = 16px
radius250 = radius100 × 2.5   = 20px  (strategic flexibility)
radius300 = radius100 × 3     = 24px
radius400 = radius100 × 4     = 32px
radiusFull = 9999px                   (special case)
```

### Doubling Pattern

Many tokens follow a doubling pattern for easy mental calculation:

```
radius050 (4px)  → radius100 (8px)   → 2× increase
radius100 (8px)  → radius200 (16px)  → 2× increase
radius200 (16px) → radius400 (32px)  → 2× increase
```

### Proportional Relationships

Tokens maintain clear proportional relationships:

```
radius200 = 2 × radius100 = 4 × radius050
radius300 = 3 × radius100 = 1.5 × radius200
radius150 = 1.5 × radius100 = 3 × radius050
```

---

## Cross-Platform Usage

### Unitless Base Values

Radius tokens use unitless base values that convert to platform-specific units:

**Base Value**: 8 (unitless)

**Platform Conversion**:
- **Web**: 8px
- **iOS**: 8pt
- **Android**: 8dp

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Radius Tokens */
  --radius-000: 0px;
  --radius-025: 2px;
  --radius-050: 4px;
  --radius-075: 6px;
  --radius-100: 8px;
  --radius-125: 10px;
  --radius-150: 12px;
  --radius-200: 16px;
  --radius-250: 20px;
  --radius-300: 24px;
  --radius-400: 32px;
  --radius-full: 9999px;
  
  /* Semantic Radius Tokens */
  --radius-none: var(--radius-000);
  --radius-subtle: var(--radius-025);
  --radius-small: var(--radius-050);
  --radius-normal: var(--radius-100);
  --radius-large: var(--radius-200);
  --radius-full-semantic: var(--radius-full);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Radius Tokens
    static let radius000: CGFloat = 0
    static let radius025: CGFloat = 2
    static let radius050: CGFloat = 4
    static let radius075: CGFloat = 6
    static let radius100: CGFloat = 8
    static let radius125: CGFloat = 10
    static let radius150: CGFloat = 12
    static let radius200: CGFloat = 16
    static let radius250: CGFloat = 20
    static let radius300: CGFloat = 24
    static let radius400: CGFloat = 32
    static let radiusFull: CGFloat = 9999
    
    // Semantic Radius Tokens
    static let radiusNone = radius000
    static let radiusSubtle = radius025
    static let radiusSmall = radius050
    static let radiusNormal = radius100
    static let radiusLarge = radius200
    static let radiusFullSemantic = radiusFull
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Radius Tokens
    val radius_000 = 0.dp
    val radius_025 = 2.dp
    val radius_050 = 4.dp
    val radius_075 = 6.dp
    val radius_100 = 8.dp
    val radius_125 = 10.dp
    val radius_150 = 12.dp
    val radius_200 = 16.dp
    val radius_250 = 20.dp
    val radius_300 = 24.dp
    val radius_400 = 32.dp
    val radius_full = 9999.dp
    
    // Semantic Radius Tokens
    val radius_none = radius_000
    val radius_subtle = radius_025
    val radius_small = radius_050
    val radius_normal = radius_100
    val radius_large = radius_200
    val radius_full_semantic = radius_full
}
```

---

## Usage Guidelines

### When to Use Primitive Tokens

Use primitive radius tokens when:
- No semantic token exists for your use case
- Building component-level tokens that reference primitives
- Creating new semantic radius patterns
- Fine-tuning visual balance requires specific values

**Example**:
```typescript
// Component-level token referencing primitive
export const cardTokens = {
  borderRadius: 'radius150',  // Reference primitive directly for 12px
};
```

### When to Use Semantic Tokens

Use semantic radius tokens for:
- Standard component rounding (buttons, cards, inputs)
- Consistent visual language across the design system
- Clear communication of design intent

**Example**:
```typescript
// Component using semantic tokens
<Card borderRadius="radiusNormal">  {/* 8px standard rounding */}
  <Content />
</Card>

<Button borderRadius="radiusSmall">  {/* 4px compact rounding */}
  Submit
</Button>

<Avatar borderRadius="radiusFull">  {/* Perfect circle */}
  <Image />
</Avatar>
```

### Strategic Flexibility Tokens

Use strategic flexibility tokens (radius075, radius125, radius250) when:
- Component-level radius needs don't align to 8px grid
- Fine-tuning visual balance requires off-grid values
- Mathematical relationships are more important than grid alignment

**Example**:
```typescript
// Component token using strategic flexibility
export const chipTokens = {
  borderRadius: 'radius075',  // 6px - strategic flexibility for compact chips
};
```

**Important**: Strategic flexibility tokens should be used appropriately (≥80% of usage should be justified by component-level needs). Overuse indicates the baseline grid may need adjustment.

### AI Agent Token Selection Guidance

When applying border radius:

1. **No rounding (sharp corners, angular design)?**
   → Use `radiusNone`
   → Explicitly communicates intent for sharp corners
   → Better than 0 for search/discoverability and maintenance

2. **Minimal softening (subtle rounding)?**
   → Use `radiusSubtle`
   → Barely perceptible rounding for subtle softening

3. **Compact elements (small buttons, chips, dense UI)?**
   → Use `radiusSmall`
   → Noticeable but compact rounding

4. **Standard elements (buttons, cards, containers, modals)?**
   → Use `radiusNormal`
   → Standard, balanced rounding for most UI elements

5. **Prominent elements (large cards, hero sections)?**
   → Use `radiusLarge`
   → Prominent, soft rounding for emphasized elements

6. **Pills and circular elements (badges, avatars)?**
   → Use `radiusFull`
   → Perfect circles or pill shapes

7. **Component-specific needs?**
   → Prioritize semantic tokens (radiusNone through radiusFull)
   → If semantic tokens don't meet requirements, use primitive tokens
   → If primitive tokens don't meet requirements, request component-specific token

---

## Related Documentation

- **Radius Token Source**: `src/tokens/RadiusTokens.ts` - Primitive radius token definitions
- **Semantic Radius Source**: `src/tokens/semantic/RadiusTokens.ts` - Semantic radius token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Mathematical Token System**: `.kiro/specs/mathematical-token-system/design.md` - Mathematical foundations
- **Component Development Guide**: `./Component Development and Practices Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `./Token Resolution Patterns.md` - Strategic guidance on token type selection and validation
- **Spacing Tokens Guide**: `./spacing-tokens.md` - Related spacing token documentation

---

*This guide provides complete reference for radius tokens with numeric naming convention and mathematical relationships that enable proportion reasoning and AI-human collaboration.*
