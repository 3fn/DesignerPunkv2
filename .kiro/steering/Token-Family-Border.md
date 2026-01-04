---
inclusion: manual
---

# Border Tokens Guide

**Date**: December 30, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Complete reference for border width tokens with numeric naming convention and mathematical relationships
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk border width token system provides a mathematically consistent foundation for border widths across all platforms. Border width tokens follow a doubling progression with explicit mathematical relationships, using numeric naming that exposes these relationships.

**Key Principles**:
- **Numeric Naming**: Token names use numbers (000, 100, 200, 400) that represent mathematical relationships
- **Mathematical Foundation**: All values derive from base unit (borderWidth100 = 1px) with clear multipliers
- **Doubling Progression**: Primary tokens follow a doubling pattern (1 → 2 → 4)
- **Cross-Platform Consistency**: Unitless base values convert to platform-specific units
- **Semantic Clarity**: Semantic tokens provide contextual meaning for common use cases

---

## Primitive Border Width Tokens

### Base Unit System

All border width tokens derive from a base unit of **1px** (borderWidth100):

| Token Name | Value | Mathematical Relationship | Use Case |
|------------|-------|---------------------------|----------|
| `borderWidth000` | 0px | 0 × base (borderWidth100) | No border, borderless elements |
| `borderWidth100` | 1px | 1 × base (baseline unit) | Standard borders, default state |
| `borderWidth200` | 2px | 2 × base (borderWidth100) | Emphasized borders, focus states |
| `borderWidth400` | 4px | 4 × base (borderWidth100) | Heavy borders, strong emphasis |

### Doubling Progression

Border width tokens follow a doubling progression for clear mathematical relationships:

```
borderWidth000 = 0px  (no border)
borderWidth100 = 1px  (base unit)
borderWidth200 = 2px  (2× base)
borderWidth400 = 4px  (4× base, or 2× borderWidth200)
```

### Why Numeric Naming?

Numeric token names expose mathematical relationships that enable:

**Proportion Reasoning**: Developers and AI agents can calculate relationships without memorization
- "borderWidth200 is 2× borderWidth100" is immediately clear
- "borderWidth400 is 4× borderWidth100" shows the doubling pattern
- "borderWidth400 is 2× borderWidth200" reveals the relationship between emphasized and heavy

**AI-Friendly Context**: Numeric names provide unambiguous mathematical context for AI collaboration
- No subjective interpretation needed
- Clear mathematical operations possible
- Consistent reasoning across all border width decisions

**Scalability**: Adding new tokens maintains mathematical consistency
- New tokens follow the same multiplier pattern
- Relationships remain clear as system grows
- No arbitrary naming decisions required

---

## Semantic Border Width Tokens

Semantic border width tokens provide contextual meaning for specific component patterns. They reference primitive border width tokens and are organized by visual intent.

### Token Reference Table

| Semantic Token | Primitive Reference | Value | Use Case |
|----------------|---------------------|-------|----------|
| `borderNone` | borderWidth000 | 0px | Borderless elements, removing borders |
| `borderDefault` | borderWidth100 | 1px | Standard borders, cards, inputs at rest |
| `borderEmphasis` | borderWidth200 | 2px | Focus states, selected elements, active states |
| `borderHeavy` | borderWidth400 | 4px | Strong visual weight, rare use cases |

### Semantic Token Details

#### borderNone (No Border)

**References**: borderWidth000 (0px)

**Use Cases**:
- Borderless cards without visible borders
- Borderless inputs (e.g., underline-only inputs)
- Explicitly removing borders from elements
- Reset states for border widths

**Visual Weight**: None (no border)

**Rationale**: Explicit "none" token improves search/discoverability, communicates intent (removing border vs. forgetting to add one), and provides consistent maintenance pattern.

#### borderDefault (Standard Borders)

**References**: borderWidth100 (1px)

**Use Cases**:
- Standard card borders
- Input fields at rest
- Button borders at rest
- Dividers between content sections
- Table cell borders

**Visual Weight**: Standard, neutral

**Component Examples**:
```typescript
// Card with standard border
<Card borderWidth="borderDefault">
  <Content />
</Card>

// Input field at rest
<Input borderWidth="borderDefault" />

// Divider line
<Divider borderWidth="borderDefault" />
```

#### borderEmphasis (Emphasized Borders)

**References**: borderWidth200 (2px)

**Use Cases**:
- Input fields on focus
- Selected cards
- Active buttons
- Web focus indicators (use with `outline` property)
- Highlighted content sections

**Visual Weight**: Emphasized, attention-drawing

**Platform-Specific Notes**:
- **Web**: Use with `outline` property for focus indicators, not `border`
- **iOS**: Prefer system-provided focus indicators
- **Android**: Prefer ripple effects and elevation changes

**Component Examples**:
```typescript
// Input field on focus
<Input borderWidth="borderEmphasis" state="focused" />

// Selected card
<Card borderWidth="borderEmphasis" selected={true}>
  <Content />
</Card>

// Web focus indicator (CSS)
.button:focus {
  outline-width: var(--border-emphasis);
  outline-style: solid;
  outline-color: var(--color-focus);
}
```

#### borderHeavy (Heavy Borders)

**References**: borderWidth400 (4px)

**Use Cases**:
- Strong emphasis requiring dominant visual presence (rare)
- High-contrast boundaries for maximum visual separation
- Brand-specific treatments requiring heavy borders
- Special decorative elements

**Visual Weight**: Heavy, dominant

**Warning**: Use sparingly. Heavy borders can overwhelm interfaces. Consider if `borderEmphasis` (2px) would be sufficient before using this token.

**Component Examples**:
```typescript
// Strong emphasis element (rare)
<FeatureCard borderWidth="borderHeavy">
  <HighlightedContent />
</FeatureCard>
```

---

## Usage Patterns

### Form Elements

Form elements use border tokens to communicate state:

| State | Semantic Token | Visual Effect |
|-------|----------------|---------------|
| Rest | `borderDefault` | Standard 1px border |
| Focus | `borderEmphasis` | Emphasized 2px border |
| Disabled | `borderDefault` + reduced opacity | Muted standard border |
| Error | `borderDefault` + error color | Standard border with error color |

**Example Implementation**:
```typescript
// Input component with state-based borders
const Input = ({ state, error }) => {
  const borderWidth = state === 'focused' ? 'borderEmphasis' : 'borderDefault';
  const borderColor = error ? 'colorError' : 'colorBorder';
  
  return <input style={{ borderWidth, borderColor }} />;
};
```

### Cards

Cards use border tokens for visual hierarchy:

| Card Type | Semantic Token | Use Case |
|-----------|----------------|----------|
| Standard | `borderDefault` | Default card appearance |
| Selected | `borderEmphasis` | User-selected card |
| Borderless | `borderNone` | Cards relying on shadow/background |
| Featured | `borderHeavy` | Rare, high-emphasis cards |

**Example Implementation**:
```typescript
// Card component with selection state
const Card = ({ selected, borderless }) => {
  let borderWidth = 'borderDefault';
  if (borderless) borderWidth = 'borderNone';
  if (selected) borderWidth = 'borderEmphasis';
  
  return <div style={{ borderWidth }}>{children}</div>;
};
```

### Dividers

Dividers use border tokens for content separation:

| Divider Type | Semantic Token | Use Case |
|--------------|----------------|----------|
| Standard | `borderDefault` | Normal content separation |
| Subtle | `borderNone` + background color | Very subtle separation |
| Emphasized | `borderEmphasis` | Section breaks, major divisions |

**Example Implementation**:
```typescript
// Divider component
const Divider = ({ emphasis }) => {
  const borderWidth = emphasis ? 'borderEmphasis' : 'borderDefault';
  
  return <hr style={{ borderTopWidth: borderWidth }} />;
};
```

### Focus Indicators (Web)

For web accessibility, use `borderEmphasis` with the `outline` property:

```css
/* Focus indicator using border token */
.interactive-element:focus {
  outline-width: var(--border-emphasis);  /* 2px */
  outline-style: solid;
  outline-color: var(--color-focus);
  outline-offset: 2px;
}

/* Alternative: focus-visible for keyboard-only focus */
.interactive-element:focus-visible {
  outline-width: var(--border-emphasis);
  outline-style: solid;
  outline-color: var(--color-focus);
}
```

**Important**: Use `outline` (not `border`) for focus indicators to avoid layout shifts.

---

## Cross-Platform Usage

### Unitless Base Values

Border width tokens use unitless base values that convert to platform-specific units:

**Base Value**: 1 (unitless)

**Platform Conversion**:
- **Web**: 1px
- **iOS**: 1pt
- **Android**: 1dp

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Border Width Tokens */
  --border-width-000: 0px;
  --border-width-100: 1px;
  --border-width-200: 2px;
  --border-width-400: 4px;
  
  /* Semantic Border Width Tokens */
  --border-none: var(--border-width-000);
  --border-default: var(--border-width-100);
  --border-emphasis: var(--border-width-200);
  --border-heavy: var(--border-width-400);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Border Width Tokens
    static let borderWidth000: CGFloat = 0
    static let borderWidth100: CGFloat = 1
    static let borderWidth200: CGFloat = 2
    static let borderWidth400: CGFloat = 4
    
    // Semantic Border Width Tokens
    static let borderNone = borderWidth000
    static let borderDefault = borderWidth100
    static let borderEmphasis = borderWidth200
    static let borderHeavy = borderWidth400
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Border Width Tokens
    val border_width_000 = 0.dp
    val border_width_100 = 1.dp
    val border_width_200 = 2.dp
    val border_width_400 = 4.dp
    
    // Semantic Border Width Tokens
    val border_none = border_width_000
    val border_default = border_width_100
    val border_emphasis = border_width_200
    val border_heavy = border_width_400
}
```

---

## Mathematical Relationships

### Base Multiplier Pattern

All border width tokens follow a clear multiplier pattern from the base unit (borderWidth100 = 1px):

```
borderWidth000 = borderWidth100 × 0 = 0px
borderWidth100 = borderWidth100 × 1 = 1px  (base unit)
borderWidth200 = borderWidth100 × 2 = 2px
borderWidth400 = borderWidth100 × 4 = 4px
```

### Doubling Pattern

Tokens follow a doubling pattern for easy mental calculation:

```
borderWidth100 (1px) → borderWidth200 (2px) → 2× increase
borderWidth200 (2px) → borderWidth400 (4px) → 2× increase
```

### Proportional Relationships

Tokens maintain clear proportional relationships:

```
borderWidth200 = 2 × borderWidth100
borderWidth400 = 4 × borderWidth100 = 2 × borderWidth200
```

---

## Usage Guidelines

### When to Use Primitive Tokens

Use primitive border width tokens when:
- No semantic token exists for your use case
- Building component-level tokens that reference primitives
- Creating new semantic border width patterns
- Fine-tuning visual balance requires specific values

**Example**:
```typescript
// Component-level token referencing primitive
export const customComponentTokens = {
  borderWidth: 'borderWidth200',  // Reference primitive directly
};
```

### When to Use Semantic Tokens

Use semantic border width tokens for:
- Standard component borders (cards, inputs, buttons)
- State-based border changes (focus, selection, active)
- Consistent visual language across the design system
- Clear communication of design intent

**Example**:
```typescript
// Component using semantic tokens
<Card borderWidth="borderDefault">  {/* 1px standard border */}
  <Content />
</Card>

<Input borderWidth="borderEmphasis" state="focused">  {/* 2px focus border */}
  Enter text
</Input>
```

### AI Agent Token Selection Guidance

When applying border widths:

1. **No border (borderless elements, removing borders)?**
   → Use `borderNone`
   → Explicitly communicates intent to remove border
   → Better than 0 for search/discoverability and maintenance

2. **Standard borders (cards, inputs at rest, buttons at rest, dividers)?**
   → Use `borderDefault`
   → Provides neutral, standard visual weight

3. **Emphasized states (focus, selection, active)?**
   → Use `borderEmphasis`
   → Draws attention without overwhelming
   → For web focus: Use with `outline` property, not `border`

4. **Strong visual weight (rare, special cases)?**
   → Use `borderHeavy`
   → Consider if `borderEmphasis` would be sufficient first
   → Use sparingly to avoid overwhelming interface

5. **Platform-specific focus indicators?**
   → Web: Use `borderEmphasis` with `outline` property
   → iOS: Use system-provided focus indicators
   → Android: Use ripple effects and elevation changes

6. **Component-specific needs?**
   → Prioritize semantic tokens (borderNone, borderDefault, borderEmphasis, borderHeavy)
   → If semantic tokens don't meet requirements, use primitive tokens
   → If primitive tokens don't meet requirements, request component-specific token

---

## Related Documentation

- **Border Width Token Source**: `src/tokens/BorderWidthTokens.ts` - Primitive border width token definitions
- **Semantic Border Width Source**: `src/tokens/semantic/BorderWidthTokens.ts` - Semantic border width token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Mathematical Token System**: `.kiro/specs/mathematical-token-system/design.md` - Mathematical foundations
- **Component Development Guide**: `./Component-Development-Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `./Token-Resolution-Patterns.md` - Strategic guidance on token type selection and validation
- **Radius Tokens Guide**: `./Token-Family-Radius.md` - Related radius token documentation
- **Spacing Tokens Guide**: `./Token-Family-Spacing.md` - Related spacing token documentation

---

*This guide provides complete reference for border width tokens with numeric naming convention and mathematical relationships that enable proportion reasoning and AI-human collaboration.*
