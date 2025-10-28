# Design Document: Blend Token System

**Date**: October 27, 2025
**Spec**: blend-tokens
**Status**: Design Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system
**Coordinated With**: opacity-tokens (shared platform generator architecture, composition syntax)

---

## Overview

The Blend Token System provides mathematically consistent color modification values for web, iOS, and Android platforms. The system uses a 0.04 base value with 5-token scale (4-20%) following the established scale notation pattern. Blend tokens create new opaque colors through overlay operations (darker/lighter) and HSL adjustments (saturate/desaturate), distinct from opacity tokens which create transparency.

**Key Design Principles**:
- Formula-based derivation from base value (0.04)
- Refined 5-token scale optimized for interaction states
- Multiple blend directions (darker, lighter, saturate, desaturate)
- Unified generator integration (generates values + utilities)
- Runtime color calculation (Phase 1 - current focus)
- Universal application (works with any color)

**Implementation Approach**:
- **Phase 1 (Current)**: Unified generator outputs blend values and platform-specific utility functions for runtime calculation
- **Phase 2 (Future)**: Same utilities used for build-time pre-calculation of component token combinations

**Coordination with Opacity Tokens**: Shares platform generator architecture, composition syntax (blend → opacity order), and strategic flexibility patterns while maintaining independent implementation for color calculation.

---

## Architecture

### Token Structure Hierarchy

```
Primitive Blend Tokens (BlendTokens.ts)
├── blend100 (0.04) - Subtle modification
├── blend200 (0.08) - Standard modification
├── blend300 (0.12) - Strong modification
├── blend400 (0.16) - Very strong modification
└── blend500 (0.20) - Maximum modification

Semantic Blend Tokens (semantic/BlendTokens.ts)
├── blendHoverDarker → blend200 darker
├── blendHoverLighter → blend200 lighter
├── blendPressedDarker → blend300 darker
├── blendFocusSaturate → blend200 saturate
└── blendDisabledDesaturate → blend300 desaturate

Component Tokens (Component Library - not in token system)
├── button.hover → purple500 with blendHoverDarker
├── tile.hover → white100 with blendContainerHoverDarker
└── input.focus → blue500 with blendFocusSaturate
```

### Unified Generator Output Flow

```
Blend Token Definitions
    ↓
Unified Token Generator
    ↓
├─→ Blend Value Constants
│   ├─→ Web: blend100 = 0.04, blend200 = 0.08, ...
│   ├─→ iOS: blend100 = 0.04, blend200 = 0.08, ...
│   └─→ Android: blend100 = 0.04f, blend200 = 0.08f, ...
│
└─→ Blend Utility Functions
    ├─→ Web: darkerBlend(color, value), lighterBlend(color, value), ...
    ├─→ iOS: Color.darkerBlend(value), Color.lighterBlend(value), ...
    └─→ Android: Color.darkerBlend(value), Color.lighterBlend(value), ...
```

### Runtime Blend Calculation Flow (Phase 1)

```
Component Token Definition
    ↓
button.hover: purple500 with blend200 darker
    ↓
Runtime Execution
    ↓
Blend Utility Function
    ↓
├─→ Parse color: purple500 → RGB(168, 85, 247)
├─→ Get blend value: blend200 → 0.08
├─→ Calculate: darkerBlend(RGB(168, 85, 247), 0.08)
└─→ Result: RGB(154, 78, 227) → #9A4EE3
    ↓
Platform Rendering
    ↓
├─→ Web: background: #9A4EE3;
├─→ iOS: Color(hex: "9A4EE3")
└─→ Android: Color(0xFF9A4EE3)
```

### Future Build-Time Pre-Calculation Flow (Phase 2)

```
Component Token Definition
    ↓
button.hover: purple500 with blend200 darker
    ↓
Build-Time Execution
    ↓
Blend Utility Function (same as runtime)
    ↓
├─→ Parse color: purple500 → RGB(168, 85, 247)
├─→ Get blend value: blend200 → 0.08
├─→ Calculate: darkerBlend(RGB(168, 85, 247), 0.08)
└─→ Result: RGB(154, 78, 227) → #9A4EE3
    ↓
Platform Generator Output
    ↓
├─→ Web: button.hover = "#9A4EE3"; // Pre-calculated
├─→ iOS: static let buttonHover = Color(hex: "9A4EE3") // Pre-calculated
└─→ Android: val buttonHover = Color(0xFF9A4EE3) // Pre-calculated
```

---

## Components and Interfaces

### Primitive Blend Token Interface

```typescript
/**
 * Blend primitive token structure
 * Similar to opacity but for color modification
 */
interface BlendToken extends PrimitiveToken {
  name: string;                    // e.g., "blend200"
  category: TokenCategory.BLEND;
  baseValue: number;               // Decimal value (0.04 - 0.20)
  familyBaseValue: number;         // BLEND_BASE_VALUE (0.04)
  description: string;             // Use case description
  mathematicalRelationship: string; // Formula (e.g., "base × 2 = 0.04 × 2 = 0.08")
  baselineGridAlignment: false;    // Blend is unitless, no grid alignment
  isStrategicFlexibility: boolean; // true for blend150, blend250, etc.
  isPrecisionTargeted: false;      // Not applicable for blend
  platforms: PlatformValues;       // Unitless values for all platforms
}
```

### Blend Direction Enum

```typescript
/**
 * Blend direction types
 */
enum BlendDirection {
  DARKER = 'darker',       // Overlay black
  LIGHTER = 'lighter',     // Overlay white
  SATURATE = 'saturate',   // Increase saturation
  DESATURATE = 'desaturate' // Decrease saturation
}
```

### Blend Composition Interface

```typescript
/**
 * Blend composition structure
 * Defines color + blend + direction
 */
interface BlendComposition {
  color: string;              // Color token name (e.g., "purple500")
  blend: string;              // Blend token name (e.g., "blend200")
  direction: BlendDirection;  // Blend direction
}
```

### Semantic Blend Token Interface

```typescript
/**
 * Semantic blend token structure
 * References primitive blend token + direction
 */
interface SemanticBlendToken {
  name: string;                  // e.g., "blendHoverDarker"
  primitiveReference: string;    // e.g., "blend200"
  direction: BlendDirection;     // e.g., BlendDirection.DARKER
  category: SemanticCategory.BLEND;
  context: string;               // Use case context
  description: string;           // Detailed description
}
```

---

## Data Models

### Blend Token Definition File Structure

```typescript
// src/tokens/BlendTokens.ts

/**
 * Blend token base value for mathematical calculations
 */
export const BLEND_BASE_VALUE = 0.04;

/**
 * Generate platform values for blend tokens
 * All platforms use same unitless value
 */
function generateBlendPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Blend primitive tokens
 * 5-token scale from 4% to 20% in 4% increments
 */
export const blendTokens: Record<string, BlendToken> = {
  blend100: {
    name: 'blend100',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Subtle modification - gentle feedback, container hover',
    mathematicalRelationship: 'base × 1 = 0.04 × 1 = 0.04',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE)
  },
  
  blend200: {
    name: 'blend200',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE * 2,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Standard modification - noticeable feedback, button hover',
    mathematicalRelationship: 'base × 2 = 0.04 × 2 = 0.08',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE * 2)
  },
  
  // ... blend300, blend400, blend500
};
```

### Semantic Blend Token Definition

```typescript
// src/tokens/semantic/BlendTokens.ts

/**
 * Semantic blend tokens for common interaction states
 * References primitive blend tokens with explicit direction
 */
export const semanticBlendTokens: Record<string, SemanticBlendToken> = {
  blendHoverDarker: {
    name: 'blendHoverDarker',
    primitiveReference: 'blend200',
    direction: BlendDirection.DARKER,
    category: SemanticCategory.BLEND,
    context: 'Standard hover feedback - darker color for light backgrounds',
    description: 'Blend for hover states with darkening (8% darker)'
  },
  
  blendHoverLighter: {
    name: 'blendHoverLighter',
    primitiveReference: 'blend200',
    direction: BlendDirection.LIGHTER,
    category: SemanticCategory.BLEND,
    context: 'Hover feedback on dark backgrounds - lighter color',
    description: 'Blend for hover states with lightening (8% lighter)'
  },
  
  blendPressedDarker: {
    name: 'blendPressedDarker',
    primitiveReference: 'blend300',
    direction: BlendDirection.DARKER,
    category: SemanticCategory.BLEND,
    context: 'Pressed state feedback - clear darkening',
    description: 'Blend for pressed states with darkening (12% darker)'
  },
  
  blendFocusSaturate: {
    name: 'blendFocusSaturate',
    primitiveReference: 'blend200',
    direction: BlendDirection.SATURATE,
    category: SemanticCategory.BLEND,
    context: 'Focus state feedback - more vibrant, attention-drawing',
    description: 'Blend for focus states with saturation increase (8% more saturated)'
  },
  
  blendDisabledDesaturate: {
    name: 'blendDisabledDesaturate',
    primitiveReference: 'blend300',
    direction: BlendDirection.DESATURATE,
    category: SemanticCategory.BLEND,
    context: 'Disabled state appearance - muted, inactive',
    description: 'Blend for disabled states with desaturation (12% less saturated)'
  },
  
  blendContainerHoverDarker: {
    name: 'blendContainerHoverDarker',
    primitiveReference: 'blend100',
    direction: BlendDirection.DARKER,
    category: SemanticCategory.BLEND,
    context: 'Subtle container hover - gentle surface feedback',
    description: 'Blend for container/surface hover with subtle darkening (4% darker)'
  }
};
```

---

## Blend Calculation Algorithms

### Darker Blend (Black Overlay)

```typescript
/**
 * Calculate darker blend by overlaying black
 * Formula: baseColor + (black at blendValue opacity)
 */
function calculateDarkerBlend(baseColor: RGB, blendValue: number): RGB {
  // Overlay black at specified opacity
  const black = { r: 0, g: 0, b: 0 };
  
  return {
    r: Math.round(baseColor.r * (1 - blendValue) + black.r * blendValue),
    g: Math.round(baseColor.g * (1 - blendValue) + black.g * blendValue),
    b: Math.round(baseColor.b * (1 - blendValue) + black.b * blendValue)
  };
}

// Example:
// purple500 (#A855F7) with blend200 darker (0.08)
// RGB(168, 85, 247) + black at 8%
// → RGB(154, 78, 227) → #9A4EE3
```

### Lighter Blend (White Overlay)

```typescript
/**
 * Calculate lighter blend by overlaying white
 * Formula: baseColor + (white at blendValue opacity)
 */
function calculateLighterBlend(baseColor: RGB, blendValue: number): RGB {
  // Overlay white at specified opacity
  const white = { r: 255, g: 255, b: 255 };
  
  return {
    r: Math.round(baseColor.r * (1 - blendValue) + white.r * blendValue),
    g: Math.round(baseColor.g * (1 - blendValue) + white.g * blendValue),
    b: Math.round(baseColor.b * (1 - blendValue) + white.b * blendValue)
  };
}

// Example:
// purple500 (#A855F7) with blend200 lighter (0.08)
// RGB(168, 85, 247) + white at 8%
// → RGB(175, 98, 248) → #AF62F8
```

### Saturate Blend (HSL Saturation Increase)

```typescript
/**
 * Calculate saturate blend by increasing HSL saturation
 * Formula: Convert to HSL, increase S, convert back to RGB
 */
function calculateSaturateBlend(baseColor: RGB, blendValue: number): RGB {
  // Convert RGB to HSL
  const hsl = rgbToHsl(baseColor);
  
  // Increase saturation (clamped to 100%)
  hsl.s = Math.min(1.0, hsl.s + blendValue);
  
  // Convert back to RGB
  return hslToRgb(hsl);
}

// Example:
// purple500 (#A855F7) with blend200 saturate (0.08)
// HSL(258°, 90%, 66%) → HSL(258°, 98%, 66%)
// → RGB(157, 78, 221) → #9D4EDD
```

### Desaturate Blend (HSL Saturation Decrease)

```typescript
/**
 * Calculate desaturate blend by decreasing HSL saturation
 * Formula: Convert to HSL, decrease S, convert back to RGB
 */
function calculateDesaturateBlend(baseColor: RGB, blendValue: number): RGB {
  // Convert RGB to HSL
  const hsl = rgbToHsl(baseColor);
  
  // Decrease saturation (clamped to 0%)
  hsl.s = Math.max(0.0, hsl.s - blendValue);
  
  // Convert back to RGB
  return hslToRgb(hsl);
}

// Example:
// purple500 (#A855F7) with blend200 desaturate (0.08)
// HSL(258°, 90%, 66%) → HSL(258°, 82%, 66%)
// → RGB(155, 109, 184) → #9B6DB8
```

---

## Unified Generator Output

### Blend Value Generation

```typescript
/**
 * Unified generator outputs blend value constants
 * Same mathematical values across all platforms
 */
class UnifiedBlendGenerator {
  /**
   * Generate blend value constants for platform
   */
  generateBlendValues(platform: Platform): string {
    const values = Object.entries(blendTokens).map(([name, token]) => {
      return this.formatBlendValue(platform, name, token.baseValue);
    });
    
    return values.join('\n');
  }
  
  /**
   * Format blend value for specific platform
   */
  private formatBlendValue(platform: Platform, name: string, value: number): string {
    switch (platform) {
      case 'web':
        return `export const ${name} = ${value};`;
      case 'ios':
        return `static let ${name}: Double = ${value}`;
      case 'android':
        return `const val ${name} = ${value}f`;
    }
  }
}
```

### Blend Utility Generation

```typescript
/**
 * Unified generator outputs platform-specific blend utilities
 * Same algorithms, platform-appropriate syntax
 */
class UnifiedBlendUtilityGenerator {
  /**
   * Generate blend utility functions for platform
   */
  generateBlendUtilities(platform: Platform): string {
    switch (platform) {
      case 'web':
        return this.generateWebUtilities();
      case 'ios':
        return this.generateiOSUtilities();
      case 'android':
        return this.generateAndroidUtilities();
    }
  }
}
```

### Web (TypeScript) Output

```typescript
/**
 * Web platform generator outputs TypeScript utilities
 */
class WebBlendGenerator {
  generate(): string {
    return `
// Blend value constants
export const BlendTokens = {
  blend100: 0.04,
  blend200: 0.08,
  blend300: 0.12,
  blend400: 0.16,
  blend500: 0.20
};

// Blend utility functions
export function darkerBlend(color: string, blendValue: number): string {
  const rgb = hexToRgb(color);
  const blended = calculateDarkerBlend(rgb, blendValue);
  return rgbToHex(blended);
}

export function lighterBlend(color: string, blendValue: number): string {
  const rgb = hexToRgb(color);
  const blended = calculateLighterBlend(rgb, blendValue);
  return rgbToHex(blended);
}

export function saturate(color: string, blendValue: number): string {
  const rgb = hexToRgb(color);
  const blended = calculateSaturateBlend(rgb, blendValue);
  return rgbToHex(blended);
}

export function desaturate(color: string, blendValue: number): string {
  const rgb = hexToRgb(color);
  const blended = calculateDesaturateBlend(rgb, blendValue);
  return rgbToHex(blended);
}
    `;
  }
}

// Example usage:
// import { BlendTokens, darkerBlend } from '@designerpunk/tokens';
// const hoverColor = darkerBlend('#A855F7', BlendTokens.blend200);
// Result: '#9A4EE3'
```

### iOS (Swift) Output

```swift
/**
 * iOS platform generator outputs Swift utilities
 */
class IOSBlendGenerator {
  generate(): string {
    return `
// Blend value constants
struct BlendTokens {
  static let blend100: Double = 0.04
  static let blend200: Double = 0.08
  static let blend300: Double = 0.12
  static let blend400: Double = 0.16
  static let blend500: Double = 0.20
}

// Blend utility functions
extension Color {
  func darkerBlend(_ amount: Double) -> Color {
    let rgb = self.toRGB()
    let blended = calculateDarkerBlend(rgb, amount)
    return Color(rgb: blended)
  }
  
  func lighterBlend(_ amount: Double) -> Color {
    let rgb = self.toRGB()
    let blended = calculateLighterBlend(rgb, amount)
    return Color(rgb: blended)
  }
  
  func saturate(_ amount: Double) -> Color {
    let rgb = self.toRGB()
    let blended = calculateSaturateBlend(rgb, amount)
    return Color(rgb: blended)
  }
  
  func desaturate(_ amount: Double) -> Color {
    let rgb = self.toRGB()
    let blended = calculateDesaturateBlend(rgb, amount)
    return Color(rgb: blended)
  }
}
    `;
  }
}

// Example usage:
// import DesignerPunkTokens
// let hoverColor = Color(hex: "A855F7").darkerBlend(BlendTokens.blend200)
// Result: Color(hex: "9A4EE3")
```

### Android (Kotlin) Output

```kotlin
/**
 * Android platform generator outputs Kotlin utilities
 */
class AndroidBlendGenerator {
  generate(): string {
    return `
// Blend value constants
object BlendTokens {
  const val blend100 = 0.04f
  const val blend200 = 0.08f
  const val blend300 = 0.12f
  const val blend400 = 0.16f
  const val blend500 = 0.20f
}

// Blend utility functions
fun Color.darkerBlend(amount: Float): Color {
  val rgb = this.toRGB()
  val blended = calculateDarkerBlend(rgb, amount)
  return Color(rgb = blended)
}

fun Color.lighterBlend(amount: Float): Color {
  val rgb = this.toRGB()
  val blended = calculateLighterBlend(rgb, amount)
  return Color(rgb = blended)
}

fun Color.saturate(amount: Float): Color {
  val rgb = this.toRGB()
  val blended = calculateSaturateBlend(rgb, amount)
  return Color(rgb = blended)
}

fun Color.desaturate(amount: Float): Color {
  val rgb = this.toRGB()
  val blended = calculateDesaturateBlend(rgb, amount)
  return Color(rgb = blended)
}
    `;
  }
}

// Example usage:
// import com.designerpunk.tokens.BlendTokens
// import com.designerpunk.tokens.darkerBlend
// val hoverColor = Color(0xFFA855F7).darkerBlend(BlendTokens.blend200)
// Result: Color(0xFF9A4EE3)
```

---

## Composition with Opacity (Coordinated)

### Blend + Opacity Order of Operations

```typescript
/**
 * Composition: Apply blend first, then opacity
 * Coordinated with opacity-tokens spec
 */
interface BlendOpacityComposition {
  color: string;              // Base color token
  blend: string;              // Blend token name
  blendDirection: BlendDirection;
  opacity: string;            // Opacity token name
}

/**
 * Calculate blend + opacity composition
 */
function calculateBlendOpacityComposition(
  composition: BlendOpacityComposition
): { color: string; opacity: number } {
  // Step 1: Calculate blended color
  const blendedColor = blendCalculator.calculateBlend(
    composition.color,
    blendTokens[composition.blend],
    composition.blendDirection
  );
  
  // Step 2: Get opacity value
  const opacityValue = opacityTokens[composition.opacity].baseValue;
  
  return {
    color: blendedColor,
    opacity: opacityValue
  };
}

// Example:
// purple500 with blend200 darker at opacity600
// → Step 1: purple500 + 8% black = #9A4EE3
// → Step 2: #9A4EE3 at 48% opacity
// → Result: rgba(154, 78, 227, 0.48)
```

---

## Design Decisions

### Decision 1: 0.04 Base Value (Different from Opacity)

**Options Considered**:
1. 0.08 (same as opacity) - Alignment with opacity system
2. 0.04 (refined) - Optimized for subtle color modifications
3. 0.05 (5%) - Simpler mental math

**Decision**: 0.04 (4%)

**Rationale**: Blend modifications need subtler control than opacity transparency. Interactive states (hover, pressed) require gentle feedback (4-12%) rather than dramatic changes. Container surfaces need very subtle feedback (4%). The 0.04 base enables nuanced control optimized for color modification, distinct from opacity's transparency needs.

**Trade-offs**:
- ✅ Gained: Subtle control for interaction states, optimized for color modification
- ❌ Lost: Alignment with opacity base value
- ⚠️ Risk: Two different base values to remember (opacity 0.08, blend 0.04)

**Counter-argument**: "Why not use same base as opacity for consistency?"
**Response**: Consistency in approach (formula-based, scale notation) is more valuable than consistency in values. Different purposes require different scales. Forcing same base would compromise blend's effectiveness for subtle interaction feedback.

### Decision 2: Runtime Calculation with Future Build-Time Optimization

**Options Considered**:
1. Runtime-only calculation - Generate utilities, calculate at runtime
2. Build-time-only pre-calculation - Pre-calculate all color combinations
3. Phased approach - Runtime first (Phase 1), build-time optimization later (Phase 2)

**Decision**: Phased approach (Runtime → Build-time)

**Rationale**: 
**Phase 1 (Runtime)** provides maximum flexibility for dynamic theming, theme switching, and user-customizable colors. The unified generator outputs blend values and platform-specific utilities that calculate colors at runtime using identical algorithms across platforms. This ensures cross-platform consistency through mathematical equivalence rather than pre-calculated values.

**Phase 2 (Build-time)** will use the same utilities to pre-calculate static color combinations during build, optimizing performance for components that don't need dynamic calculation. The architecture supports both approaches without changes - same functions, different execution context.

**Trade-offs**:
- ✅ Gained: Dynamic theming flexibility, theme switching, user customization, elegant future optimization path
- ✅ Gained: Cross-platform consistency through identical algorithms
- ✅ Gained: Same utilities work for both runtime and build-time
- ❌ Lost: Immediate runtime performance optimization (deferred to Phase 2)
- ⚠️ Risk: Runtime calculation overhead for static colors (mitigated in Phase 2)

**Counter-argument**: "Why not pre-calculate everything at build time for performance?"
**Response**: Pre-calculation sacrifices flexibility for performance. Modern devices handle these calculations trivially. Dynamic theming and user customization are increasingly important. Phase 1 provides flexibility; Phase 2 adds optimization without architectural changes.

### Decision 3: sRGB Color Space Standardization

**Options Considered**:
1. sRGB - Standard color space, universal support
2. Display P3 - Wide gamut, modern devices
3. Per-platform - sRGB for web, P3 for iOS

**Decision**: sRGB

**Rationale**: Blend tokens prioritize consistency over gamut. Interaction feedback needs predictable results more than maximum vibrancy. sRGB provides universal device support and consistent calculations. Display P3 support can be added as future enhancement without changing mathematical foundation.

**Trade-offs**:
- ✅ Gained: Universal support, predictable calculations, cross-platform consistency
- ❌ Lost: Wide gamut vibrancy on modern displays
- ⚠️ Risk: Not taking advantage of P3 capabilities on modern devices

---

## Testing Strategy

### Unit Tests

```typescript
describe('BlendTokens', () => {
  test('base value is 0.04', () => {
    expect(BLEND_BASE_VALUE).toBe(0.04);
  });
  
  test('blend200 equals 2 × base value', () => {
    expect(blendTokens.blend200.baseValue).toBe(0.08);
  });
  
  test('darker blend produces darker color', () => {
    const result = calculateDarkerBlend({ r: 168, g: 85, b: 247 }, 0.08);
    expect(result.r).toBeLessThan(168);
    expect(result.g).toBeLessThan(85);
    expect(result.b).toBeLessThan(247);
  });
  
  test('saturate blend increases saturation', () => {
    const baseHsl = { h: 258, s: 0.9, l: 0.66 };
    const result = calculateSaturateBlend(hslToRgb(baseHsl), 0.08);
    const resultHsl = rgbToHsl(result);
    expect(resultHsl.s).toBeGreaterThan(0.9);
  });
});
```

### Integration Tests

```typescript
describe('Blend Platform Translation', () => {
  test('web generator produces valid hex color', () => {
    const css = webGenerator.generateBlendedColor('purple500', blendTokens.blend200, BlendDirection.DARKER);
    expect(css).toMatch(/background: #[0-9A-F]{6};/);
  });
  
  test('blend + opacity composition works correctly', () => {
    const result = calculateBlendOpacityComposition({
      color: 'purple500',
      blend: 'blend200',
      blendDirection: BlendDirection.DARKER,
      opacity: 'opacity600'
    });
    expect(result.opacity).toBe(0.48);
    expect(result.color).toMatch(/#[0-9A-F]{6}/);
  });
});
```

---

*This design document provides the technical architecture for implementing the blend token system with unified generator integration, runtime color calculation (Phase 1), cross-platform consistency through identical algorithms, and coordination with the opacity token system for compositional flexibility. The architecture elegantly supports future build-time pre-calculation optimization (Phase 2) without requiring changes to the core calculation functions.*
