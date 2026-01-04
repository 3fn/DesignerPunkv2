---
inclusion: manual
---

# Glow Token Usage Documentation

**Date**: October 24, 2025
**Last Reviewed**: 2025-12-30
**Purpose**: Glow token reference and usage guide
**Organization**: token-documentation
**Scope**: shadow-glow-token-system
**Layer**: 3
**Relevant Tasks**: component-development, token-selection

---

## Overview

The Glow Token System provides mathematically consistent primitives for creating emphasis and energy effects. Glows convey importance, interactivity, and visual energy using radial effects with zero offsets (unlike directional shadows).

The system currently provides glow primitive tokens (blur, opacity, color) as the foundation for future multi-layer glow architecture. Semantic glow tokens and cross-platform glow implementation are future scope, pending proof of concept validation.

**Current Scope**: Glow primitive tokens (foundation)  
**Future Scope**: Semantic glow tokens, multi-layer glow architecture, cross-platform glow implementation

---

## Glow Primitive Tokens

Glow primitives are the foundational building blocks for creating emphasis effects. Each primitive represents a single glow property with mathematically consistent values across platforms.

### Glow Blur Tokens

Glow blur determines the radial spread of glow effects. Glow blur tokens use an extended blur range compared to shadow blur tokens, providing larger blur amounts suitable for emphasis and energy effects.

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `glowBlur100` | 8px | Base glow blur value | Subtle glow effects, small elements |
| `glowBlur200` | 16px | Moderate glow blur | Standard glow effects, medium elements |
| `glowBlur300` | 24px | Strong glow blur | Prominent glow effects, large elements |
| `glowBlur400` | 32px | Intense glow blur | Dramatic glow effects, hero elements |
| `glowBlur500` | 40px | Maximum glow blur | Maximum emphasis, focal points |

**Mathematical Foundation**: Base value = 8px (8px baseline grid alignment)

**Scale Progression**: Linear progression with base × multiplier (1x, 2x, 3x, 4x, 5x)

**Comparison to Shadow Blur**:
- Shadow blur range: 4px - 24px (for depth effects)
- Glow blur range: 8px - 40px (for emphasis effects)
- Glow blur starts higher and extends further for radial spread

#### Usage Examples

```typescript
// Subtle glow for small interactive elements
const subtleGlow = {
  blur: 'glowBlur100',  // 8px
  opacity: 'glowOpacity100',  // 0.8
  color: 'glow.neonPurple'
};

// Standard glow for buttons and CTAs
const standardGlow = {
  blur: 'glowBlur200',  // 16px
  opacity: 'glowOpacity200',  // 0.6
  color: 'glow.neonCyan'
};

// Dramatic glow for hero elements
const dramaticGlow = {
  blur: 'glowBlur500',  // 40px
  opacity: 'glowOpacity100',  // 0.8
  color: 'glow.neonYellow'
};
```

### Glow Opacity Tokens

Glow opacity determines the transparency of glow effects. Glow opacity tokens use a decreasing progression to create multi-layer glow effects where inner layers are more opaque and outer layers are more transparent, creating a natural radial fade.

| Token | Value | Description | Use Case |
|-------|-------|-------------|----------|
| `glowOpacity100` | 0.8 | Most opaque (inner layer) | Inner glow layer, strong emphasis |
| `glowOpacity200` | 0.6 | Moderate opacity | Middle glow layer, balanced emphasis |
| `glowOpacity300` | 0.4 | Lighter opacity | Outer glow layer, subtle emphasis |
| `glowOpacity400` | 0.2 | Most transparent (outer layer) | Outermost glow layer, diffuse emphasis |

**Mathematical Foundation**: Base value = 0.8, decreasing progression with multipliers (1x, 0.75x, 0.5x, 0.25x)

**Multi-Layer Architecture**: Opacity values designed for layering multiple glows with decreasing opacity from inner to outer layers.

**Comparison to Shadow Opacity**:
- Shadow opacity range: 0.2 - 0.4 (for depth effects)
- Glow opacity range: 0.2 - 0.8 (for emphasis effects)
- Glow opacity starts higher for stronger visual impact

#### Usage Examples

```typescript
// Single-layer glow with strong opacity
const singleLayerGlow = {
  blur: 'glowBlur200',  // 16px
  opacity: 'glowOpacity100',  // 0.8
  color: 'glow.neonPurple'
};

// Multi-layer glow (future scope - example only)
const multiLayerGlow = {
  innerLayer: {
    blur: 'glowBlur100',  // 8px
    opacity: 'glowOpacity100',  // 0.8
    color: 'glow.neonCyan'
  },
  middleLayer: {
    blur: 'glowBlur200',  // 16px
    opacity: 'glowOpacity200',  // 0.6
    color: 'glow.neonCyan'
  },
  outerLayer: {
    blur: 'glowBlur300',  // 24px
    opacity: 'glowOpacity300',  // 0.4
    color: 'glow.neonCyan'
  }
};
```

### Glow Color Tokens

Glow colors reference existing vibrant primitive colors (purple500, cyan500, yellow500) for neon emphasis effects. Semantic glow color tokens provide purpose-based naming while referencing the systematic color family primitives.

#### Semantic Glow Colors

| Token | References | Description | Use Case |
|-------|-----------|-------------|----------|
| `glow.neonPurple` | purple500 | Vibrant purple glow | Brand emphasis, primary CTAs |
| `glow.neonCyan` | cyan500 | Vibrant cyan glow | Tech/digital emphasis, success states |
| `glow.neonYellow` | yellow500 | Vibrant yellow glow | Attention/warning emphasis, highlights |

**Note**: Glow colors reference existing vibrant colors from the core color system. No new primitive colors are created for glows - semantic glow tokens provide purpose-based naming for emphasis effects.

**Color Selection Rationale**:
- **purple500**: Brand authority and primary emphasis
- **cyan500**: Tech/digital aesthetic and success emphasis
- **yellow500**: Attention-grabbing and warning emphasis

#### Usage Examples

```typescript
// Purple glow for brand emphasis
const brandGlow = {
  blur: 'glowBlur200',  // 16px
  opacity: 'glowOpacity100',  // 0.8
  color: 'glow.neonPurple'  // purple500
};

// Cyan glow for tech/digital emphasis
const techGlow = {
  blur: 'glowBlur300',  // 24px
  opacity: 'glowOpacity200',  // 0.6
  color: 'glow.neonCyan'  // cyan500
};

// Yellow glow for attention/warning
const attentionGlow = {
  blur: 'glowBlur400',  // 32px
  opacity: 'glowOpacity100',  // 0.8
  color: 'glow.neonYellow'  // yellow500
};
```

---

## Future Scope: Semantic Glow Tokens

Semantic glow tokens will compose primitives to create complete glow styles for specific use cases. This is future scope pending proof of concept validation.

### Planned Semantic Glows (Example)

**Note**: These are conceptual examples for future implementation, not currently available.

#### glow.button (Conceptual)

Button glow for interactive emphasis.

**Potential Composition**:
- blur: `glowBlur200` (16px)
- opacity: `glowOpacity100` (0.8)
- color: `glow.neonPurple`

**Use Cases**: Primary buttons, CTAs with emphasis

#### glow.focus (Conceptual)

Focus state glow for accessibility.

**Potential Composition**:
- blur: `glowBlur100` (8px)
- opacity: `glowOpacity200` (0.6)
- color: `glow.neonCyan`

**Use Cases**: Focus indicators, keyboard navigation

#### glow.hero (Conceptual)

Hero element glow for maximum emphasis.

**Potential Composition**:
- Multiple layers with decreasing blur and opacity
- color: `glow.neonYellow`

**Use Cases**: Hero sections, focal points, dramatic emphasis

---

## Future Scope: Multi-Layer Glow Architecture

Multi-layer glow architecture will enable complex glow effects with multiple layers of decreasing blur and opacity. This is future scope pending proof of concept validation.

### Conceptual Multi-Layer Structure

**Note**: This is a conceptual example for future implementation, not currently available.

```typescript
// Conceptual multi-layer glow structure
interface MultiLayerGlow {
  layers: Array<{
    blur: string;      // Reference to glowBlur token
    opacity: string;   // Reference to glowOpacity token
    color: string;     // Reference to glow color token
  }>;
}

// Example: Three-layer glow
const threeLayerGlow: MultiLayerGlow = {
  layers: [
    {
      blur: 'glowBlur100',      // 8px - inner layer
      opacity: 'glowOpacity100', // 0.8
      color: 'glow.neonPurple'
    },
    {
      blur: 'glowBlur200',      // 16px - middle layer
      opacity: 'glowOpacity200', // 0.6
      color: 'glow.neonPurple'
    },
    {
      blur: 'glowBlur300',      // 24px - outer layer
      opacity: 'glowOpacity300', // 0.4
      color: 'glow.neonPurple'
    }
  ]
};
```

### Multi-Layer Design Principles (Conceptual)

1. **Decreasing Blur**: Inner layers use smaller blur, outer layers use larger blur
2. **Decreasing Opacity**: Inner layers are more opaque, outer layers are more transparent
3. **Consistent Color**: All layers typically use the same color for cohesive effect
4. **Natural Fade**: Progression creates natural radial fade from center to edge

---

## Future Scope: Cross-Platform Glow Implementation

Cross-platform glow implementation will translate glow tokens to platform-specific formats. This is future scope pending gradient token system development.

### Web (CSS) - Future Scope

Glows will translate to CSS `box-shadow` with multiple layers.

**Conceptual Example**:

```css
/* Multi-layer glow (conceptual) */
.button-glow {
  box-shadow: 
    0 0 8px rgba(139, 92, 246, 0.8),   /* Inner layer */
    0 0 16px rgba(139, 92, 246, 0.6),  /* Middle layer */
    0 0 24px rgba(139, 92, 246, 0.4);  /* Outer layer */
}
```

### iOS (Swift) - Future Scope

iOS glow implementation will require gradient-based approaches or custom rendering.

**Challenges**:
- iOS `CALayer` shadows are directional (not radial)
- Multi-layer glows require multiple shadow layers or custom rendering
- Performance considerations for complex glow effects

**Potential Approaches**:
- Multiple `CALayer` shadows with zero offset
- Custom `CAGradientLayer` for radial glow effects
- Core Graphics custom rendering for complex glows

### Android (Kotlin) - Future Scope

Android glow implementation will require gradient-based approaches or custom drawables.

**Challenges**:
- Android elevation is directional (not radial)
- Multi-layer glows require custom drawables or gradient layers
- Performance considerations for complex glow effects

**Potential Approaches**:
- Custom `GradientDrawable` with radial gradient
- Multiple shadow layers in Compose
- Custom Canvas drawing for complex glows

---

## Design Guidelines

### When to Use Glows

**Appropriate Use Cases**:
- **Interactive emphasis**: Buttons, CTAs, interactive elements
- **Focus indicators**: Keyboard navigation, accessibility
- **Brand emphasis**: Hero elements, primary features
- **Status indication**: Success states, active states
- **Attention direction**: Focal points, important information

**Inappropriate Use Cases**:
- **Depth perception**: Use shadows for elevation, not glows
- **Subtle effects**: Glows are for emphasis, not subtlety
- **Excessive decoration**: Avoid overusing glows (visual noise)
- **Body text**: Glows should not be used on body text (readability)

### Glow Intensity Guidelines

**Subtle Glow** (glowBlur100-200, glowOpacity200-300):
- Small interactive elements
- Hover states
- Subtle emphasis

**Standard Glow** (glowBlur200-300, glowOpacity100-200):
- Primary buttons and CTAs
- Focus indicators
- Standard emphasis

**Dramatic Glow** (glowBlur400-500, glowOpacity100):
- Hero elements
- Maximum emphasis
- Focal points

### Color Selection Guidelines

**glow.neonPurple** (purple500):
- Brand-related emphasis
- Primary CTAs
- Authority and focus

**glow.neonCyan** (cyan500):
- Tech/digital aesthetic
- Success states
- Modern, clean emphasis

**glow.neonYellow** (yellow500):
- Attention-grabbing
- Warning emphasis
- Highlights and focal points

### Accessibility Considerations

**Contrast and Visibility**:
- Ensure glows don't reduce text contrast
- Test glows in both light and dark modes
- Consider users with photosensitivity

**Motion and Animation**:
- Animate glow changes smoothly
- Use appropriate easing functions
- Avoid rapid glow changes (motion sensitivity)
- Provide reduced motion alternatives

**Semantic Meaning**:
- Don't rely solely on glows to convey critical information
- Provide alternative cues (text, icons, borders)
- Use glows to enhance, not replace, semantic meaning

**Photosensitivity Warning**:
- Avoid rapid glow pulsing or flashing
- Limit glow animation frequency
- Provide option to disable glow effects

---

## Mathematical Foundation

### Base-8 System

Glow tokens follow the base-8 mathematical foundation:

- **Blur base**: 8px (8px baseline grid alignment)
- **Opacity base**: 0.8 (unitless)

### Baseline Grid Alignment

Glow blur values align to the 4px baseline grid:

- **Aligned values**: 8, 16, 24, 32, 40 (multiples of 8, which are multiples of 4)
- **Opacity**: Unitless values don't require grid alignment

### Mathematical Relationships

**Blur Tokens**:
- glowBlur100 = base × 1 = 8 × 1 = 8
- glowBlur200 = base × 2 = 8 × 2 = 16
- glowBlur300 = base × 3 = 8 × 3 = 24
- glowBlur400 = base × 4 = 8 × 4 = 32
- glowBlur500 = base × 5 = 8 × 5 = 40

**Opacity Tokens**:
- glowOpacity100 = base × 1 = 0.8 × 1 = 0.8
- glowOpacity200 = base × 0.75 = 0.8 × 0.75 = 0.6
- glowOpacity300 = base × 0.5 = 0.8 × 0.5 = 0.4
- glowOpacity400 = base × 0.25 = 0.8 × 0.25 = 0.2

### Comparison to Shadow Tokens

| Property | Shadow Range | Glow Range | Rationale |
|----------|--------------|------------|-----------|
| Blur | 4px - 24px | 8px - 40px | Glows need larger radial spread for emphasis |
| Opacity | 0.2 - 0.4 | 0.2 - 0.8 | Glows need higher opacity for visual impact |
| Offset | -12px to 16px | 0px (radial) | Shadows are directional, glows are radial |
| Base Value | 4px (offset/blur) | 8px (blur) | Glows start with larger base for emphasis |

---

## Current Implementation Status

### Available Now

✅ **Glow Blur Primitives**: glowBlur100-500 (8px - 40px)  
✅ **Glow Opacity Primitives**: glowOpacity100-400 (0.8 - 0.2)  
✅ **Glow Color Semantics**: glow.neonPurple, glow.neonCyan, glow.neonYellow  
✅ **Mathematical Foundation**: Base-8 system with baseline grid alignment  
✅ **Documentation**: Primitive token reference and usage guidelines

### Future Scope

⏳ **Semantic Glow Tokens**: Composed glow styles for specific use cases  
⏳ **Multi-Layer Glow Architecture**: Complex glow effects with multiple layers  
⏳ **Cross-Platform Glow Implementation**: Web, iOS, and Android glow generation  
⏳ **Glow Animation Patterns**: Standardized glow animation and transition patterns  
⏳ **Glow Validation System**: Validation for glow usage and accessibility

### Why Future Scope?

The glow system requires proof of concept validation before full implementation:

1. **Multi-Layer Complexity**: Multi-layer glows are more complex than single-layer shadows
2. **Platform Limitations**: iOS and Android have limited native glow support
3. **Gradient Token Dependency**: Cross-platform glows require gradient token system
4. **Performance Validation**: Complex glows need performance testing across platforms
5. **Use Case Validation**: Need real-world usage to validate semantic glow patterns

The current primitive tokens provide the foundation for experimentation and proof of concept development.

---

## Related Documentation

- [Shadow Token Documentation](./Token-Family-Shadow.md) - Shadow primitive and semantic tokens for depth effects
- [Token System Overview](../token-system-overview.md) - Complete token system architecture
- [Shadow and Glow Design Document](../../.kiro/specs/shadow-glow-token-system/design.md) - Detailed design decisions and rationale
- [Shadow and Glow Requirements](../../.kiro/specs/shadow-glow-token-system/requirements.md) - System requirements and acceptance criteria
- [Component Development Guide](./Component-Development-Guide.md) - Token usage in component development
- [Token Resolution Patterns](./Token-Resolution-Patterns.md) - Strategic guidance on token type selection and validation

---

*This documentation provides comprehensive guidance for using glow primitive tokens as the foundation for future emphasis effects. Semantic glow tokens and cross-platform glow implementation are future scope pending proof of concept validation.*
