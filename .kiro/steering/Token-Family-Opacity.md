---
inclusion: manual
name: Token-Family-Opacity
description: Opacity token family — transparency tokens with 8% base increment system and 14-token percentage-based scale (opacity000–opacity100). Load when working with transparency effects, disabled states, overlays, or visual hierarchy through opacity.
---

# Opacity Tokens Guide

**Date**: 2025-12-30
**Last Reviewed**: 2026-03-06
**Purpose**: Complete reference for opacity tokens with percentage-based naming convention and mathematical relationships
**Organization**: token-documentation
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The DesignerPunk opacity token system provides a mathematically consistent foundation for transparency effects across all platforms. Opacity tokens follow an 8% base increment system with a 14-token scale (0-100%), using percentage-based naming where the token name directly represents the opacity percentage.

**Key Principles**:
- **Percentage-Based Naming**: Token names use three-digit zero-padded percentage values (e.g., `opacity048` = 48%)
- **Mathematical Foundation**: All values derive from base unit (0.08 = 8%) with clear multipliers
- **Unitless Values**: All platforms use the same unitless values (0.0 - 1.0)
- **Semantic Mapping**: Four semantic tokens map to common transparency use cases
- **Cross-Platform Consistency**: Identical values across web, iOS, and Android

---

## Primitive Opacity Tokens

### Base Unit System

All opacity tokens derive from a base unit of **0.08 (8%)**:

| Token Name | Value | Percentage | Mathematical Relationship | Use Case |
|------------|-------|------------|---------------------------|----------|
| `opacity000` | 0.00 | 0% | 0 × base | Fully transparent, invisible |
| `opacity008` | 0.08 | 8% | 1 × base | Subtle hover feedback, very light overlay |
| `opacity016` | 0.16 | 16% | 2 × base | Light overlay, pressed state |
| `opacity024` | 0.24 | 24% | 3 × base | Medium-light overlay |
| `opacity032` | 0.32 | 32% | 4 × base | Ghost effects, medium overlay |
| `opacity040` | 0.40 | 40% | 5 × base | Strong overlay |
| `opacity048` | 0.48 | 48% | 6 × base | Disabled state, very strong overlay |
| `opacity056` | 0.56 | 56% | 7 × base | Nearly opaque, subtle transparency |
| `opacity064` | 0.64 | 64% | 8 × base | Very opaque, minimal transparency |
| `opacity072` | 0.72 | 72% | 9 × base | Extremely opaque |
| `opacity080` | 0.80 | 80% | 10 × base | Nearly full opacity |
| `opacity088` | 0.88 | 88% | 11 × base | Almost fully opaque |
| `opacity096` | 0.96 | 96% | 12 × base | Imperceptible transparency |
| `opacity100` | 1.00 | 100% | Special case | Fully opaque, no transparency |

### Why 8% Base Increment?

The 8% base increment provides:

**Fine-Grained Control**: 14 distinct opacity levels cover the full 0-100% range with meaningful visual differences between each step.

**Mathematical Consistency**: Each token represents a clear multiplier of the base value, enabling predictable calculations.

**Practical Coverage**: The scale covers all common transparency use cases from invisible (0%) to fully opaque (100%).

### Why Percentage-Based Naming?

Percentage-based token names provide immediate clarity:

**Intuitive Reading**: The token name directly communicates the opacity value
- `opacity048` is immediately understood as 48% opacity
- `opacity080` is immediately understood as 80% opacity
- No lookup table or multiplier calculation needed

**AI-Friendly Context**: Percentage names provide unambiguous context for AI collaboration
- No subjective interpretation needed
- Value is encoded in the name itself
- Consistent reasoning across all opacity decisions

**Scalability**: Adding new tokens maintains naming consistency
- New tokens follow the same percentage pattern
- Names remain self-documenting as system grows

---

## Semantic Opacity Tokens

Semantic opacity tokens provide contextual meaning for specific transparency patterns. They reference primitive opacity tokens and are organized by visual intent.

### Token Reference Table

| Semantic Token | Primitive Reference | Value | Percentage | Use Case |
|----------------|---------------------|-------|------------|----------|
| `opacity.subtle` | opacity088 | 0.88 | 88% | Minimal transparency, subtle effects |
| `opacity.medium` | opacity072 | 0.72 | 72% | Moderate transparency, overlays |
| `opacity.heavy` | opacity048 | 0.48 | 48% | Strong transparency, modal backgrounds |
| `opacity.ghost` | opacity032 | 0.32 | 32% | Maximum transparency, ghost effects |

### Semantic Token Details

#### opacity.subtle (Minimal Transparency)

**References**: opacity088 (0.88 / 88%)

**Use Cases**:
- Subtle overlay effects with minimal visual impact
- Background tints that barely affect underlying content
- Soft shadows and gentle visual effects
- Elements that need slight transparency without losing prominence

**Visual Style**: Almost fully opaque, barely perceptible transparency

**Accessibility Note**: High opacity ensures content remains clearly visible and readable.

#### opacity.medium (Moderate Transparency)

**References**: opacity072 (0.72 / 72%)

**Use Cases**:
- Overlay backgrounds for tooltips and popovers
- Semi-transparent panels and sidebars
- Visual effects requiring noticeable but not dominant transparency
- Backdrop effects for focused content areas

**Visual Style**: Noticeable transparency while maintaining content visibility

**Accessibility Note**: Content behind medium opacity overlays should not contain critical information that users need to read.

#### opacity.heavy (Strong Transparency)

**References**: opacity048 (0.48 / 48%)

**Use Cases**:
- Modal dialog backdrop/scrim
- Disabled state overlays
- Strong background dimming effects
- Content de-emphasis overlays

**Visual Style**: Significant transparency, clearly obscures background content

**Accessibility Note**: Heavy opacity significantly reduces visibility of underlying content. Ensure users understand that background content is intentionally obscured.

#### opacity.ghost (Maximum Transparency)

**References**: opacity032 (0.32 / 32%)

**Use Cases**:
- Ghost button backgrounds
- Placeholder and skeleton loading states
- Watermark effects
- Very subtle background tints
- Hover state backgrounds for transparent buttons

**Visual Style**: Highly transparent, background content clearly visible through element

**Accessibility Note**: Ghost opacity should not be used for text or critical UI elements as it may not meet contrast requirements.

---

## Mathematical Relationships

### Base Multiplier Pattern

All opacity tokens follow a clear multiplier pattern from the base unit (0.08):

```
opacity000 = 0.08 × 0  = 0.00 (0%)
opacity008 = 0.08 × 1  = 0.08 (8%)
opacity016 = 0.08 × 2  = 0.16 (16%)
opacity024 = 0.08 × 3  = 0.24 (24%)
opacity032 = 0.08 × 4  = 0.32 (32%)
opacity040 = 0.08 × 5  = 0.40 (40%)
opacity048 = 0.08 × 6  = 0.48 (48%)
opacity056 = 0.08 × 7  = 0.56 (56%)
opacity064 = 0.08 × 8  = 0.64 (64%)
opacity072 = 0.08 × 9  = 0.72 (72%)
opacity080 = 0.08 × 10 = 0.80 (80%)
opacity088 = 0.08 × 11 = 0.88 (88%)
opacity096 = 0.08 × 12 = 0.96 (96%)
opacity100 = 1.00 (special case: full opacity)
```

### Doubling Pattern

Many tokens follow a doubling pattern for easy mental calculation:

```
opacity008 (0.08) → opacity016 (0.16) → 2× increase
opacity016 (0.16) → opacity032 (0.32) → 2× increase
opacity032 (0.32) → opacity064 (0.64) → 2× increase
```

### Proportional Relationships

Tokens maintain clear proportional relationships:

```
opacity032 = 2 × opacity016 = 4 × opacity008
opacity048 = 3 × opacity016 = 1.5 × opacity032
opacity064 = 2 × opacity032 = 4 × opacity016
```

---

## Cross-Platform Usage

### Unitless Values

Opacity tokens use unitless values (0.0 - 1.0) that are identical across all platforms:

**Value Range**: 0.0 (fully transparent) to 1.0 (fully opaque)

**Platform Consistency**: Web, iOS, and Android all use the same unitless values, ensuring visual consistency across platforms.

### Platform-Specific Output

#### Web (CSS Custom Properties)

```css
:root {
  /* Primitive Opacity Tokens */
  --opacity-000: 0;
  --opacity-008: 0.08;
  --opacity-016: 0.16;
  --opacity-024: 0.24;
  --opacity-032: 0.32;
  --opacity-040: 0.40;
  --opacity-048: 0.48;
  --opacity-056: 0.56;
  --opacity-064: 0.64;
  --opacity-072: 0.72;
  --opacity-080: 0.80;
  --opacity-088: 0.88;
  --opacity-096: 0.96;
  --opacity-100: 1;
  
  /* Semantic Opacity Tokens */
  --opacity-subtle: var(--opacity-088);
  --opacity-medium: var(--opacity-072);
  --opacity-heavy: var(--opacity-048);
  --opacity-ghost: var(--opacity-032);
}

/* Usage Examples */
.modal-backdrop {
  background-color: rgba(0, 0, 0, var(--opacity-heavy));
}

.ghost-button {
  background-color: rgba(255, 255, 255, var(--opacity-ghost));
}

.disabled-overlay {
  opacity: var(--opacity-048);
}
```

#### iOS (Swift)

```swift
struct DesignTokens {
    // Primitive Opacity Tokens
    static let opacity000: CGFloat = 0.0
    static let opacity008: CGFloat = 0.08
    static let opacity016: CGFloat = 0.16
    static let opacity024: CGFloat = 0.24
    static let opacity032: CGFloat = 0.32
    static let opacity040: CGFloat = 0.40
    static let opacity048: CGFloat = 0.48
    static let opacity056: CGFloat = 0.56
    static let opacity064: CGFloat = 0.64
    static let opacity072: CGFloat = 0.72
    static let opacity080: CGFloat = 0.80
    static let opacity088: CGFloat = 0.88
    static let opacity096: CGFloat = 0.96
    static let opacity100: CGFloat = 1.0
    
    // Semantic Opacity Tokens
    static let opacitySubtle = opacity088
    static let opacityMedium = opacity072
    static let opacityHeavy = opacity048
    static let opacityGhost = opacity032
}

// Usage Examples
struct ModalBackdrop: View {
    var body: some View {
        Color.black.opacity(DesignTokens.opacityHeavy)
    }
}

struct GhostButton: View {
    var body: some View {
        Button("Action") { }
            .background(Color.white.opacity(DesignTokens.opacityGhost))
    }
}
```

#### Android (Kotlin)

```kotlin
object DesignTokens {
    // Primitive Opacity Tokens
    const val opacity_000 = 0.0f
    const val opacity_008 = 0.08f
    const val opacity_016 = 0.16f
    const val opacity_024 = 0.24f
    const val opacity_032 = 0.32f
    const val opacity_040 = 0.40f
    const val opacity_048 = 0.48f
    const val opacity_056 = 0.56f
    const val opacity_064 = 0.64f
    const val opacity_072 = 0.72f
    const val opacity_080 = 0.80f
    const val opacity_088 = 0.88f
    const val opacity_096 = 0.96f
    const val opacity_100 = 1.0f
    
    // Semantic Opacity Tokens
    val opacity_subtle = opacity_088
    val opacity_medium = opacity_072
    val opacity_heavy = opacity_048
    val opacity_ghost = opacity_032
}

// Usage Examples
@Composable
fun ModalBackdrop() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = DesignTokens.opacity_heavy))
    )
}

@Composable
fun GhostButton(onClick: () -> Unit) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White.copy(alpha = DesignTokens.opacity_ghost)
        )
    ) {
        Text("Action")
    }
}
```

---

## Usage Patterns

### Overlay and Backdrop Effects

Use opacity tokens for modal backdrops, overlays, and scrim effects:

```typescript
// Modal backdrop - use heavy opacity for strong dimming
<ModalBackdrop opacity="opacity.heavy" />  // 48% opacity

// Tooltip overlay - use medium opacity for moderate dimming
<TooltipBackdrop opacity="opacity.medium" />  // 72% opacity

// Subtle overlay - use subtle opacity for minimal effect
<SubtleOverlay opacity="opacity.subtle" />  // 88% opacity
```

### Disabled States

Use opacity tokens to indicate disabled or inactive states:

```typescript
// Disabled button - apply opacity to entire element
<Button disabled opacity="opacity048">  // 48% opacity
  Submit
</Button>

// Disabled content area
<ContentArea disabled opacity="opacity048">
  <Content />
</ContentArea>
```

### Hover and Interaction Effects

Use opacity tokens for hover states and interaction feedback:

```typescript
// Hover background - use ghost opacity for subtle feedback
<Button hoverBackground="rgba(255, 255, 255, opacity.ghost)">  // 32% opacity
  Action
</Button>

// Pressed state - use light opacity for pressed feedback
<Button pressedBackground="rgba(0, 0, 0, opacity016)">  // 16% opacity
  Action
</Button>

// Subtle hover - use very light opacity
<ListItem hoverBackground="rgba(0, 0, 0, opacity008)">  // 8% opacity
  Item
</ListItem>
```

### Ghost and Transparent Elements

Use opacity tokens for ghost buttons and transparent UI elements:

```typescript
// Ghost button - transparent background with visible border
<GhostButton backgroundOpacity="opacity.ghost">  // 32% opacity
  Secondary Action
</GhostButton>

// Skeleton loading state
<SkeletonLoader opacity="opacity.ghost" />  // 32% opacity

// Watermark effect
<Watermark opacity="opacity024" />  // 24% opacity
```

---

## Accessibility Considerations

### Contrast Requirements

When using opacity tokens, ensure sufficient contrast for accessibility:

**Text Content**: Never apply low opacity values to text that users need to read. Text should maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text).

**Interactive Elements**: Ensure interactive elements remain clearly visible and distinguishable, even when using transparency effects.

**Focus Indicators**: Focus indicators should not be affected by opacity tokens that would reduce their visibility below accessibility requirements.

### Opacity and Color Contrast

When combining opacity with colors:

```typescript
// ❌ AVOID: Low opacity on text
<Text opacity="opacity032">Important information</Text>  // May fail contrast

// ✅ CORRECT: Full opacity on text, opacity on backgrounds
<Container backgroundOpacity="opacity.ghost">
  <Text>Important information</Text>  // Full opacity text
</Container>
```

### Disabled State Accessibility

When using opacity for disabled states:

**Visual Indication**: Opacity alone may not be sufficient to indicate disabled state. Combine with other visual cues (color changes, icons, cursor changes).

**Screen Reader Support**: Ensure disabled state is communicated to assistive technologies through proper ARIA attributes, not just visual opacity changes.

```typescript
// ✅ CORRECT: Opacity + ARIA for disabled state
<Button 
  disabled 
  aria-disabled="true"
  opacity="opacity048"
>
  Submit
</Button>
```

### Motion and Animation

When animating opacity:

**Reduced Motion**: Respect user preferences for reduced motion. Provide instant opacity changes as an alternative to animated transitions.

**Animation Duration**: Keep opacity transitions brief (150-300ms) to avoid disorienting users.

```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .fade-element {
    transition: none;
  }
}
```

---

## Usage Guidelines

### When to Use Primitive Tokens

Use primitive opacity tokens when:
- No semantic token exists for your use case
- Building component-level tokens that reference primitives
- Creating new semantic opacity patterns
- Fine-tuning visual balance requires specific values

**Example**:
```typescript
// Component-level token referencing primitive
export const tooltipTokens = {
  backdropOpacity: 'opacity024',  // Reference primitive directly for 24%
};
```

### When to Use Semantic Tokens

Use semantic opacity tokens for:
- Standard transparency patterns (overlays, disabled states, ghost effects)
- Consistent visual language across the design system
- Clear communication of design intent

**Example**:
```typescript
// Component using semantic tokens
<Modal backdropOpacity="opacity.heavy">  {/* 48% for modal scrim */}
  <Content />
</Modal>

<GhostButton backgroundOpacity="opacity.ghost">  {/* 32% for ghost effect */}
  Secondary Action
</GhostButton>
```

### AI Agent Token Selection Guidance

When applying opacity:

1. **Modal backdrop or strong overlay?**
   → Use `opacity.heavy`
   → 48% opacity for significant background dimming

2. **Moderate overlay or semi-transparent panel?**
   → Use `opacity.medium`
   → 72% opacity for noticeable but not dominant transparency

3. **Subtle effect or minimal transparency?**
   → Use `opacity.subtle`
   → 88% opacity for barely perceptible transparency

4. **Ghost button or maximum transparency?**
   → Use `opacity.ghost`
   → 32% opacity for highly transparent elements

5. **Disabled state?**
   → Use `opacity048` (primitive)
   → 48% opacity is standard for disabled elements

6. **Hover feedback?**
   → Use `opacity008` or `opacity016` (primitives)
   → 8-16% opacity for subtle interaction feedback

7. **Fully transparent or fully opaque?**
   → Use `opacity000` (0%) or `opacity100` (100%)
   → Edge cases for complete transparency or opacity

8. **Component-specific needs?**
   → Prioritize semantic tokens (subtle, medium, heavy, ghost)
   → If semantic tokens don't meet requirements, use primitive tokens
   → If primitive tokens don't meet requirements, request component-specific token

---

## Related Documentation

- **Opacity Token Source**: `src/tokens/OpacityTokens.ts` - Primitive opacity token definitions
- **Semantic Opacity Source**: `src/tokens/semantic/OpacityTokens.ts` - Semantic opacity token definitions
- **Token System Overview**: `docs/token-system-overview.md` - Complete token system reference
- **Mathematical Token System**: `.kiro/specs/mathematical-token-system/design.md` - Mathematical foundations
- **Component Development Guide**: `./Component-Development-Guide.md` - Token usage in component development
- **Token Resolution Patterns**: `./Token-Resolution-Patterns.md` - Strategic guidance on token type selection and validation
- **Color Tokens Guide**: `./Token-Family-Color.md` - Related color token documentation (opacity often combined with colors)

---

*This guide provides complete reference for opacity tokens with percentage-based naming convention and mathematical relationships that enable intuitive usage and AI-human collaboration.*
