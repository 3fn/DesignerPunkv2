# Safe Opacity + Color Combinations Guide

**Date**: October 28, 2025
**Purpose**: Document safe opacity + color combinations for WCAG compliance and visual quality
**Organization**: spec-guide
**Scope**: opacity-tokens
**Status**: Active

---

## Introduction

This guide provides comprehensive guidance on safe opacity + color combinations to ensure WCAG 2.1 AA compliance (4.5:1 contrast ratio for normal text, 3:1 for large text) and visual quality across the DesignerPunk design system. Opacity tokens modify color transparency, which directly impacts contrast ratios and accessibility.

**Key Principle**: Applying opacity to colors reduces contrast. Always validate contrast ratios when combining opacity with color tokens.

---

## Related Documentation

- [Opacity Token Requirements](./requirements.md) - Requirement 9 defines safe combination documentation needs
- [Opacity Token Design](./design.md) - Design decisions for opacity token system
- [Opacity Token Tasks](./tasks.md) - Implementation plan including this guide

---

## Text Opacity Combinations

### WCAG Contrast Requirements

**Normal Text** (< 18pt or < 14pt bold):
- Minimum contrast ratio: **4.5:1**
- Recommended: Avoid opacity on text, use explicit color tokens instead

**Large Text** (≥ 18pt or ≥ 14pt bold):
- Minimum contrast ratio: **3:1**
- Recommended: Avoid opacity on text, use explicit color tokens instead

### Safe Text Combinations

#### Dark Text on Light Background

**✅ SAFE - Full Opacity (Maintains Contrast)**

```typescript
// Dark text at full opacity on light background
text: {
  color: gray900,           // #1A1A1A
  opacity: opacity1300      // 100% - fully opaque
}
background: white100        // #FFFFFF

// Contrast: 16.1:1 ✅ (Exceeds 4.5:1 requirement)
```

```typescript
// Dark text at 96% opacity on light background
text: {
  color: gray900,           // #1A1A1A
  opacity: opacity1200      // 96% - almost fully opaque
}
background: white100        // #FFFFFF

// Contrast: ~15.5:1 ✅ (Exceeds 4.5:1 requirement)
```

**❌ UNSAFE - Reduced Opacity (Fails Contrast)**

```typescript
// Dark text at 48% opacity on light background
text: {
  color: gray900,           // #1A1A1A
  opacity: opacity600       // 48% - disabled state opacity
}
background: white100        // #FFFFFF

// Contrast: ~2.8:1 ❌ (Fails 4.5:1 requirement)
// Alternative: Use explicit gray600 color token instead
```

```typescript
// Dark text at 32% opacity on light background
text: {
  color: gray900,           // #1A1A1A
  opacity: opacity400       // 32% - overlay opacity
}
background: white100        // #FFFFFF

// Contrast: ~1.9:1 ❌ (Fails 4.5:1 requirement)
// Alternative: Use explicit gray400 color token instead
```

#### Light Text on Dark Background

**✅ SAFE - Full Opacity (Maintains Contrast)**

```typescript
// Light text at full opacity on dark background
text: {
  color: white100,          // #FFFFFF
  opacity: opacity1300      // 100% - fully opaque
}
background: gray900         // #1A1A1A

// Contrast: 16.1:1 ✅ (Exceeds 4.5:1 requirement)
```

```typescript
// Light text at 96% opacity on dark background
text: {
  color: white100,          // #FFFFFF
  opacity: opacity1200      // 96% - almost fully opaque
}
background: gray900         // #1A1A1A

// Contrast: ~15.5:1 ✅ (Exceeds 4.5:1 requirement)
```

**❌ UNSAFE - Reduced Opacity (Fails Contrast)**

```typescript
// Light text at 48% opacity on dark background
text: {
  color: white100,          // #FFFFFF
  opacity: opacity600       // 48% - disabled state opacity
}
background: gray900         // #1A1A1A

// Contrast: ~2.8:1 ❌ (Fails 4.5:1 requirement)
// Alternative: Use explicit gray400 color token instead
```

### Text Opacity Recommendation

**❌ AVOID: Applying opacity to text**

Instead of:
```typescript
// ❌ WRONG - Opacity reduces contrast unpredictably
text: {
  color: gray900,
  opacity: opacity600       // 48%
}
```

Use explicit color tokens:
```typescript
// ✅ CORRECT - Explicit color maintains predictable contrast
text: {
  color: gray600            // Explicit color token
}
```

**Rationale**: Opacity on text creates unpredictable contrast ratios that vary based on background color. Explicit color tokens ensure consistent, validated contrast across all contexts.

---

## Background Opacity Combinations

### Modal Overlays (Blocks Content)

Modal overlays block interaction with background content and don't require contrast validation since they're not meant to be read through.

**✅ SAFE - Standard Modal Overlays**

```typescript
// Dark modal overlay (most common)
modalBackdrop: {
  color: black500,          // #000000
  opacity: opacity400       // 32%
}

// Result: rgba(0, 0, 0, 0.32) - blocks content effectively
// No contrast requirement (content is blocked, not visible)
```

```typescript
// Medium modal overlay
modalBackdrop: {
  color: gray900,           // #1A1A1A
  opacity: opacity500       // 40%
}

// Result: rgba(26, 26, 26, 0.40) - stronger blocking
// No contrast requirement (content is blocked, not visible)
```

```typescript
// Strong modal overlay
modalBackdrop: {
  color: black500,          // #000000
  opacity: opacity600       // 48%
}

// Result: rgba(0, 0, 0, 0.48) - very strong blocking
// No contrast requirement (content is blocked, not visible)
```

**Semantic Token Usage**:
```typescript
// Use semantic token for consistency
modalBackdrop: {
  color: black500,
  opacity: opacityOverlay   // References opacity400 (32%)
}
```

### Glassmorphism (Content Visible Through)

Glassmorphism effects allow content to be visible through the surface, requiring contrast validation for any text on the glass surface.

**⚠️ REQUIRES VALIDATION - Glass Surfaces**

```typescript
// Glass card with blur
glassCard: {
  background: {
    color: gray700,         // #4A4A4A
    opacity: opacity600     // 48%
  },
  blur: 20px,
  border: {
    color: white300,        // #E5E5E5
    opacity: opacity200     // 16%
  }
}

// ⚠️ VALIDATE: Text on glass surface must maintain 4.5:1 contrast
// Contrast depends on:
// - Glass surface color + opacity
// - Background content behind glass
// - Text color on glass
```

**Validation Example**:
```typescript
// Glass surface with text
glassCard: {
  background: {
    color: gray700,         // #4A4A4A
    opacity: opacity600     // 48%
  },
  text: {
    color: white100         // #FFFFFF
  }
}

// ⚠️ VALIDATE: 
// - Measure contrast between white100 text and glass background
// - Account for content visible through glass
// - Test with various background content
// - Ensure minimum 4.5:1 contrast in all scenarios
```

**Recommendation**: For glassmorphism, use higher opacity values (opacity800 = 64% or opacity1000 = 80%) to ensure sufficient contrast for text while maintaining the glass effect.

### Solid Backgrounds (No Transparency)

**✅ SAFE - Full Opacity Backgrounds**

```typescript
// Solid background (no transparency)
card: {
  background: {
    color: white100,
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: gray900          // Contrast: 16.1:1 ✅
  }
}
```

```typescript
// Nearly solid background (minimal transparency)
card: {
  background: {
    color: white100,
    opacity: opacity1200    // 96% - almost fully opaque
  },
  text: {
    color: gray900          // Contrast: ~15.5:1 ✅
  }
}
```

---

## Button State Opacity Examples

### Primary Button States

**Default State (Full Opacity)**

```typescript
button.primary.default: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: white100         // #FFFFFF
  }
}

// Contrast: 4.8:1 ✅ (Exceeds 4.5:1 requirement)
```

**Hover State (Reduced Opacity)**

```typescript
button.primary.hover: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity1000    // 80% - subtle transparency
  },
  text: {
    color: white100         // #FFFFFF
  }
}

// ⚠️ VALIDATE: Contrast depends on background behind button
// - On white background: ~4.2:1 (May fail 4.5:1 requirement)
// - On gray background: Varies based on gray value
// Recommendation: Test with actual background colors
```

**Alternative Hover State (Explicit Color)**

```typescript
button.primary.hover: {
  background: {
    color: purple600        // Explicit darker purple
  },
  text: {
    color: white100         // #FFFFFF
  }
}

// ✅ SAFE: Explicit color ensures predictable contrast
// Contrast: 6.2:1 ✅ (Exceeds 4.5:1 requirement)
```

**Pressed State (Further Reduced Opacity)**

```typescript
button.primary.pressed: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity900     // 72% - more transparency
  },
  text: {
    color: white100         // #FFFFFF
  }
}

// ⚠️ VALIDATE: Contrast depends on background behind button
// - On white background: ~3.8:1 (Fails 4.5:1 requirement)
// Recommendation: Use explicit color token instead
```

**Disabled State (No Contrast Requirement)**

```typescript
button.primary.disabled: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity600     // 48% - faded appearance
  },
  text: {
    color: white100,        // #FFFFFF
    opacity: opacity600     // 48% - faded text
  }
}

// ✅ SAFE: Disabled elements exempt from WCAG contrast requirements
// Semantic token usage:
button.primary.disabled: {
  background: {
    color: purple500,
    opacity: opacityDisabled  // References opacity600 (48%)
  }
}
```

### Secondary Button States

**Default State (Transparent Background)**

```typescript
button.secondary.default: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity000     // 0% - fully transparent
  },
  border: {
    color: purple500,       // #6B50A4
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: purple500        // #6B50A4
  }
}

// ⚠️ VALIDATE: Text contrast against page background
// - On white background: 4.8:1 ✅
// - On gray background: Varies based on gray value
```

**Hover State (Subtle Background)**

```typescript
button.secondary.hover: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity100     // 8% - very subtle background
  },
  border: {
    color: purple500,       // #6B50A4
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: purple500        // #6B50A4
  }
}

// ⚠️ VALIDATE: Text contrast against page background + subtle tint
// Semantic token usage:
button.secondary.hover: {
  background: {
    color: purple500,
    opacity: opacityHover   // References opacity100 (8%)
  }
}
```

**Pressed State (More Visible Background)**

```typescript
button.secondary.pressed: {
  background: {
    color: purple500,       // #6B50A4
    opacity: opacity200     // 16% - more visible background
  },
  border: {
    color: purple500,       // #6B50A4
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: purple500        // #6B50A4
  }
}

// ⚠️ VALIDATE: Text contrast against page background + tint
// Semantic token usage:
button.secondary.pressed: {
  background: {
    color: purple500,
    opacity: opacityPressed // References opacity200 (16%)
  }
}
```

---

## Unsafe Combinations with Alternatives

### Unsafe: Opacity on Text

**❌ WRONG - Opacity Reduces Contrast**

```typescript
// Disabled text with opacity
text.disabled: {
  color: gray900,           // #1A1A1A
  opacity: opacity600       // 48%
}
background: white100        // #FFFFFF

// Contrast: ~2.8:1 ❌ (Fails 4.5:1 requirement)
```

**✅ CORRECT - Explicit Color Token**

```typescript
// Disabled text with explicit color
text.disabled: {
  color: gray600            // Explicit gray token
}
background: white100        // #FFFFFF

// Contrast: Validated at token definition level
// Use color tokens designed for text on specific backgrounds
```

### Unsafe: Low Opacity on Interactive Elements

**❌ WRONG - Insufficient Contrast for Interaction**

```typescript
// Button with low opacity
button.primary: {
  background: {
    color: blue500,
    opacity: opacity400     // 32% - too transparent
  },
  text: {
    color: white100
  }
}

// Contrast: ~2.1:1 ❌ (Fails 4.5:1 requirement)
// User may not recognize as interactive element
```

**✅ CORRECT - Sufficient Opacity or Explicit Color**

```typescript
// Button with sufficient opacity
button.primary: {
  background: {
    color: blue500,
    opacity: opacity1300    // 100% - fully opaque
  },
  text: {
    color: white100
  }
}

// Contrast: 4.6:1 ✅ (Exceeds 4.5:1 requirement)
```

### Unsafe: Opacity on Small Text

**❌ WRONG - Small Text with Opacity**

```typescript
// Small caption text with opacity
caption: {
  fontSize: 12px,           // Small text
  color: gray900,
  opacity: opacity800       // 64%
}
background: white100

// Contrast: ~4.3:1 ❌ (Fails 4.5:1 for normal text)
// Small text requires higher contrast
```

**✅ CORRECT - Small Text with Full Opacity**

```typescript
// Small caption text with full opacity
caption: {
  fontSize: 12px,           // Small text
  color: gray900,
  opacity: opacity1300      // 100% - fully opaque
}
background: white100

// Contrast: 16.1:1 ✅ (Exceeds 4.5:1 requirement)
```

---

## Validation Workflow

### Step 1: Identify Opacity Usage

Determine where opacity is being applied:
- Text elements (avoid opacity)
- Background elements (validate if text is present)
- Interactive elements (validate contrast)
- Decorative elements (no validation needed)

### Step 2: Check Contrast Requirements

**Text Elements**:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Disabled text: Exempt from requirements

**Interactive Elements**:
- Button text: 4.5:1 minimum
- Link text: 4.5:1 minimum
- Form labels: 4.5:1 minimum

**Non-Text Elements**:
- UI components: 3:1 minimum (WCAG 2.1 Level AA)
- Graphical objects: 3:1 minimum

### Step 3: Measure Contrast

Use contrast checking tools:
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Panel
- Figma Contrast Plugin
- Stark Plugin

### Step 4: Apply Alternatives

If contrast fails:
1. **Remove opacity**: Use explicit color tokens
2. **Increase opacity**: Use higher opacity values (opacity1000, opacity1200)
3. **Change color**: Use darker/lighter color tokens
4. **Adjust background**: Modify background color for better contrast

### Step 5: Document Decisions

Document why specific opacity + color combinations were chosen:
- Contrast ratio measurements
- WCAG compliance verification
- Alternative approaches considered
- Platform-specific considerations

---

## Platform-Specific Considerations

### Web (CSS)

```css
/* Opacity property */
.button:disabled {
  opacity: 0.48; /* opacity600 */
}

/* RGBA alpha channel */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.32); /* black at opacity400 */
}

/* Validation: Use browser DevTools to check contrast */
```

### iOS (SwiftUI)

```swift
// Opacity modifier
Button("Click")
  .opacity(0.48) // opacity600

// Color alpha parameter
Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)

// Validation: Use Xcode Accessibility Inspector
```

### Android (Jetpack Compose)

```kotlin
// Alpha modifier
Button(
  modifier = Modifier.alpha(0.48f) // opacity600
)

// Color alpha parameter
Color(0xFF6B50A4).copy(alpha = 0.48f)

// Validation: Use Android Accessibility Scanner
```

---

## Relationship to Shadow and Glow Opacity

### Overview

The DesignerPunk design system includes three distinct opacity token systems, each optimized for different use cases:

1. **General Opacity Tokens** (this system) - For UI element transparency
2. **Shadow Opacity Tokens** - Specialized for shadow effects
3. **Glow Opacity Tokens** - Specialized for multi-layer glow effects

Understanding when to use each system is critical for maintaining design consistency and achieving the intended visual effects.

---

### General Opacity Tokens (This System)

**Purpose**: Control transparency of UI elements (buttons, overlays, backgrounds, etc.)

**Token Scale**: 13 tokens from 0% to 100% in 8% increments
- opacity000 = 0.0 (0%) - Fully transparent
- opacity100 = 0.08 (8%) - Subtle transparency
- opacity200 = 0.16 (16%) - Light transparency
- opacity300 = 0.24 (24%) - Medium-light transparency
- opacity400 = 0.32 (32%) - Modal scrim, medium overlay
- opacity500 = 0.40 (40%) - Strong overlay
- opacity600 = 0.48 (48%) - Disabled state
- opacity700 = 0.56 (56%) - Nearly opaque
- opacity800 = 0.64 (64%) - Very opaque
- opacity900 = 0.72 (72%) - Extremely opaque
- opacity1000 = 0.80 (80%) - Nearly full opacity
- opacity1100 = 0.88 (88%) - Subtle transparency
- opacity1200 = 0.96 (96%) - Almost fully opaque
- opacity1300 = 1.0 (100%) - Fully opaque

**Use Cases**:
- Button interaction states (hover, pressed, disabled)
- Modal overlays and backdrops
- Glassmorphism effects
- Loading skeleton states
- Background transparency
- Any UI element requiring transparency control

**Example Usage**:
```typescript
// Button disabled state
button.disabled: {
  background: {
    color: purple500,
    opacity: opacityDisabled  // References opacity600 (48%)
  }
}

// Modal backdrop
modal.backdrop: {
  color: black500,
  opacity: opacityOverlay     // References opacity400 (32%)
}

// Hover state
card.hover: {
  background: {
    color: surface,
    opacity: opacityHover       // References opacity100 (8%)
  }
}
```

---

### Shadow Opacity Tokens (Specialized System)

**Purpose**: Control opacity of shadow effects based on shadow quality and blur amount

**Token Scale**: 3 quality-based tokens
- shadowOpacityHard = 0.4 (40%) - Hard shadows with minimal blur
- shadowOpacityModerate = 0.3 (30%) - Moderate shadows with medium blur
- shadowOpacitySoft = 0.2 (20%) - Soft shadows with high blur

**Key Difference**: Shadow opacity is contextual to shadow quality (hard/moderate/soft) and blur amount, not a linear scale like general opacity.

**Use Cases**:
- Drop shadows on cards, buttons, modals
- Elevation shadows for layered UI
- Shadow effects that convey depth
- Platform-specific shadow implementations

**Example Usage**:
```typescript
// Card shadow (moderate quality)
card.shadow: {
  offsetX: 0,
  offsetY: 4,
  blur: shadowBlurModerate,      // 8px blur
  color: black500,
  opacity: shadowOpacityModerate // 0.3 (30%)
}

// Modal shadow (soft quality)
modal.shadow: {
  offsetX: 0,
  offsetY: 8,
  blur: shadowBlurSoft,          // 16px blur
  color: black500,
  opacity: shadowOpacitySoft     // 0.2 (20%)
}

// Button shadow (hard quality)
button.shadow: {
  offsetX: 0,
  offsetY: 2,
  blur: shadowBlurHard,          // 4px blur
  color: black500,
  opacity: shadowOpacityHard     // 0.4 (40%)
}
```

**Why Separate from General Opacity**:
- Shadow opacity relates to shadow quality (hard/moderate/soft), not UI element transparency
- Shadow opacity is paired with blur amount for cohesive shadow effects
- Shadow opacity values are optimized for visual depth perception
- Mixing shadow and general opacity would create confusion about intent

**Approximate General Opacity Equivalents** (for reference only):
- shadowOpacityHard (0.4) ≈ opacity500 (40%) - but contextual to shadow blur
- shadowOpacityModerate (0.3) ≈ opacity400 (32%) - but contextual to shadow quality
- shadowOpacitySoft (0.2) ≈ opacity200 (16%) - but contextual to shadow softness

**Important**: Don't use general opacity tokens for shadows. The contextual relationship between shadow quality, blur, and opacity is critical for achieving proper shadow effects.

---

### Glow Opacity Tokens (Specialized System)

**Purpose**: Control opacity of multi-layer glow effects with radial progression

**Token Scale**: 4 layer-based tokens
- glowOpacity100 = 0.8 (80%) - Inner glow layer (brightest)
- glowOpacity200 = 0.6 (60%) - Mid-inner glow layer
- glowOpacity300 = 0.4 (40%) - Mid-outer glow layer
- glowOpacity400 = 0.2 (20%) - Outer glow layer (most diffuse)

**Key Difference**: Glow opacity is contextual to multi-layer radial effects, with inner layers brighter than outer layers.

**Use Cases**:
- Neon glow effects
- Emphasis glow on interactive elements
- Multi-layer radial glow effects
- Cyberpunk/futuristic visual effects

**Example Usage**:
```typescript
// Multi-layer neon glow effect
neonGlow: {
  layers: [
    {
      blur: glowBlur100,        // 4px blur
      color: purple500,
      opacity: glowOpacity100   // 0.8 (80%) - inner layer
    },
    {
      blur: glowBlur200,        // 8px blur
      color: purple500,
      opacity: glowOpacity200   // 0.6 (60%) - mid-inner layer
    },
    {
      blur: glowBlur300,        // 16px blur
      color: purple500,
      opacity: glowOpacity300   // 0.4 (40%) - mid-outer layer
    },
    {
      blur: glowBlur400,        // 32px blur
      color: purple500,
      opacity: glowOpacity400   // 0.2 (20%) - outer layer
    }
  ]
}

// Single-layer emphasis glow
button.emphasis: {
  glow: {
    blur: glowBlur200,          // 8px blur
    color: blue500,
    opacity: glowOpacity200     // 0.6 (60%)
  }
}
```

**Why Separate from General Opacity**:
- Glow opacity relates to multi-layer radial effects, not UI element transparency
- Glow opacity is paired with blur amount for cohesive glow progression
- Glow opacity values are optimized for inner-to-outer layer progression
- Mixing glow and general opacity would create confusion about layer relationships

**Approximate General Opacity Equivalents** (for reference only):
- glowOpacity100 (0.8) ≈ opacity1000 (80%) - but contextual to inner glow layer
- glowOpacity200 (0.6) ≈ opacity800 (64%) - but contextual to glow layer progression
- glowOpacity300 (0.4) ≈ opacity500 (40%) - but contextual to outer glow layer
- glowOpacity400 (0.2) ≈ opacity200 (16%) - but contextual to most diffuse layer

**Important**: Don't use general opacity tokens for glows. The contextual relationship between glow layers, blur progression, and opacity is critical for achieving proper multi-layer glow effects.

---

### Decision Framework: Which Opacity System to Use?

Use this decision tree to determine which opacity system is appropriate:

#### Question 1: What are you applying opacity to?

**UI Element (button, card, overlay, background)**
→ Use **General Opacity Tokens**

**Shadow Effect (drop shadow, elevation shadow)**
→ Use **Shadow Opacity Tokens**

**Glow Effect (neon glow, emphasis glow, radial glow)**
→ Use **Glow Opacity Tokens**

#### Question 2: Does the opacity relate to a specific visual effect?

**No - General transparency control**
→ Use **General Opacity Tokens**

**Yes - Shadow quality (hard/moderate/soft)**
→ Use **Shadow Opacity Tokens**

**Yes - Multi-layer glow progression**
→ Use **Glow Opacity Tokens**

#### Question 3: Is the opacity paired with blur?

**No blur involved**
→ Use **General Opacity Tokens**

**Blur for shadow depth**
→ Use **Shadow Opacity Tokens**

**Blur for glow diffusion**
→ Use **Glow Opacity Tokens**

---

### Common Mistakes to Avoid

#### ❌ WRONG: Using General Opacity for Shadows

```typescript
// ❌ WRONG - General opacity doesn't convey shadow quality
card.shadow: {
  blur: 8,
  color: black500,
  opacity: opacity400  // General opacity token
}
```

```typescript
// ✅ CORRECT - Shadow opacity conveys shadow quality
card.shadow: {
  blur: shadowBlurModerate,
  color: black500,
  opacity: shadowOpacityModerate  // Shadow opacity token
}
```

#### ❌ WRONG: Using Shadow Opacity for UI Elements

```typescript
// ❌ WRONG - Shadow opacity is for shadows, not UI elements
button.disabled: {
  background: {
    color: purple500,
    opacity: shadowOpacityModerate  // Shadow opacity token
  }
}
```

```typescript
// ✅ CORRECT - General opacity for UI elements
button.disabled: {
  background: {
    color: purple500,
    opacity: opacityDisabled  // General opacity token
  }
}
```

#### ❌ WRONG: Using General Opacity for Multi-Layer Glows

```typescript
// ❌ WRONG - General opacity doesn't convey glow layer progression
neonGlow: {
  layers: [
    { blur: 4, color: purple500, opacity: opacity1000 },  // General opacity
    { blur: 8, color: purple500, opacity: opacity800 },   // General opacity
    { blur: 16, color: purple500, opacity: opacity500 }   // General opacity
  ]
}
```

```typescript
// ✅ CORRECT - Glow opacity conveys layer progression
neonGlow: {
  layers: [
    { blur: glowBlur100, color: purple500, opacity: glowOpacity100 },  // Inner layer
    { blur: glowBlur200, color: purple500, opacity: glowOpacity200 },  // Mid layer
    { blur: glowBlur300, color: purple500, opacity: glowOpacity300 }   // Outer layer
  ]
}
```

#### ❌ WRONG: Using Glow Opacity for Shadows

```typescript
// ❌ WRONG - Glow opacity is for radial glows, not shadows
card.shadow: {
  blur: 8,
  color: black500,
  opacity: glowOpacity200  // Glow opacity token
}
```

```typescript
// ✅ CORRECT - Shadow opacity for shadows
card.shadow: {
  blur: shadowBlurModerate,
  color: black500,
  opacity: shadowOpacityModerate  // Shadow opacity token
}
```

---

### Why Three Separate Systems?

**Design Intent Communication**:
- Token names communicate design intent (disabled state vs shadow quality vs glow layer)
- Semantic clarity prevents misuse and confusion
- AI agents can reason about appropriate token usage

**Contextual Optimization**:
- Each system optimized for its specific use case
- Shadow opacity paired with shadow blur for cohesive effects
- Glow opacity paired with glow blur for layer progression
- General opacity provides comprehensive UI transparency control

**Mathematical Relationships**:
- General opacity: Linear 8% increments for UI transparency
- Shadow opacity: Quality-based values (hard/moderate/soft)
- Glow opacity: Layer-based progression (inner to outer)

**Maintainability**:
- Clear separation prevents token misuse
- Each system can evolve independently
- Documentation and validation can be system-specific

---

### Cross-Reference Summary

**For UI Element Transparency**:
- Use: General Opacity Tokens (opacity000 - opacity1300)
- Documentation: This guide (Safe Opacity + Color Combinations Guide)
- Examples: Button states, modal overlays, glassmorphism, disabled states

**For Shadow Effects**:
- Use: Shadow Opacity Tokens (shadowOpacityHard, shadowOpacityModerate, shadowOpacitySoft)
- Documentation: Shadow Token System Guide (`.kiro/specs/shadow-glow-token-system/`)
- Examples: Card shadows, elevation shadows, drop shadows

**For Glow Effects**:
- Use: Glow Opacity Tokens (glowOpacity100 - glowOpacity400)
- Documentation: Glow Token System Guide (`.kiro/specs/shadow-glow-token-system/`)
- Examples: Neon glows, emphasis glows, multi-layer radial glows

---

## Summary of Best Practices

### DO ✅

- **Use full opacity for text** (opacity1300 = 100%)
- **Use explicit color tokens** instead of opacity on text
- **Validate contrast** when combining opacity with color
- **Use semantic tokens** for common patterns (opacityDisabled, opacityOverlay)
- **Test with actual backgrounds** when using transparency
- **Document contrast ratios** for all text + opacity combinations

### DON'T ❌

- **Apply opacity to text** (use explicit color tokens instead)
- **Use low opacity on interactive elements** without validation
- **Assume opacity maintains contrast** (always measure)
- **Forget disabled state exemption** (disabled elements exempt from WCAG)
- **Use opacity for color variations** (use color token variants instead)

### VALIDATE ⚠️

- **Glassmorphism effects** (content visible through surface)
- **Button hover states** (opacity depends on background)
- **Overlay text** (text on semi-transparent backgrounds)
- **Small text with opacity** (requires higher contrast)
- **Interactive elements** (must maintain 3:1 minimum for UI components)

---

## Future Enhancements

### Build-Time Validation

Future versions of the design system may include build-time validation:

```typescript
// Automatic contrast validation during component generation
validateOpacityColorCombination({
  text: { color: 'gray900', opacity: 'opacity600' },
  background: 'white100'
});

// Error: Contrast ratio 2.8:1 fails WCAG 4.5:1 requirement
// Suggestion: Use explicit gray600 color token instead
```

### Contrast Calculation Utilities

```typescript
// Calculate contrast ratio for opacity + color combinations
const contrastRatio = calculateContrastWithOpacity({
  foreground: { color: gray900, opacity: opacity600 },
  background: white100
});

// Returns: { ratio: 2.8, passes: false, requirement: 4.5 }
```

### Semantic Token Expansion

Additional semantic tokens based on validated combinations:

```typescript
// Future semantic tokens
opacityTextSecondary: opacity1200  // 96% - secondary text
opacityTextTertiary: opacity1000   // 80% - tertiary text
opacityBackgroundSubtle: opacity100 // 8% - subtle background tint
```

---

*This guide provides comprehensive guidance on safe opacity + color combinations to ensure WCAG compliance and visual quality. Always validate contrast ratios when combining opacity with color tokens, and prefer explicit color tokens over opacity for text elements.*
