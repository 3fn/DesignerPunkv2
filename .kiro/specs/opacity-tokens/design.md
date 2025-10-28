# Design Document: Opacity Token System

**Date**: October 27, 2025
**Spec**: opacity-tokens
**Status**: Design Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system, shadow-glow-token-system
**Coordinated With**: blend-tokens (shared platform generator architecture, composition syntax)

---

## Overview

The Opacity Token System provides mathematically consistent transparency values for web, iOS, and Android platforms. The system uses a 0.08 base value with 13-token scale (0-100%) following the established scale notation pattern. Opacity tokens create transparency effects through alpha channel manipulation, distinct from blend tokens which create color modifications.

**Key Design Principles**:
- Formula-based derivation from base value (0.08)
- Scale notation consistent with other token families
- Unified generator integration (generates opacity values for all platforms)
- Direct alpha channel translation (no color calculation)
- Compositional architecture (opacity modifies existing colors)
- Cross-platform unitless values

**Coordination with Blend Tokens**: Shares platform generator architecture, composition syntax, and strategic flexibility patterns while maintaining independent implementation for alpha channel translation.

---

## Architecture

### Token Structure Hierarchy

```
Primitive Opacity Tokens (OpacityTokens.ts)
├── opacity000 (0.0) - Fully transparent
├── opacity100 (0.08) - Subtle transparency
├── opacity200 (0.16) - Light transparency
├── ... (8% increments)
└── opacity1300 (1.0) - Fully opaque

Semantic Opacity Tokens (semantic/OpacityTokens.ts)
├── opacityDisabled → opacity600
├── opacityOverlay → opacity400
├── opacityHover → opacity100
├── opacityPressed → opacity200
└── opacityLoading → opacity200

Component Tokens (Component Library - not in token system)
├── button.disabled → color at opacityDisabled
├── modal.backdrop → black at opacityOverlay
└── card.hover → surface at opacityHover
```

### Platform Translation Flow

```
Token Definition (Build Time)
    ↓
opacity600 = 0.48
    ↓
Platform Generator
    ↓
├─→ Web: opacity: 0.48 or rgba(color, 0.48)
├─→ iOS: .opacity(0.48) or Color(..., opacity: 0.48)
└─→ Android: alpha = 0.48f or Color.copy(alpha = 0.48f)
```

---

## Components and Interfaces

### Primitive Opacity Token Interface

```typescript
/**
 * Opacity primitive token structure
 * Extends base PrimitiveToken with opacity-specific properties
 */
interface OpacityToken extends PrimitiveToken {
  name: string;                    // e.g., "opacity600"
  category: TokenCategory.OPACITY;
  baseValue: number;               // Decimal value (0.0 - 1.0)
  familyBaseValue: number;         // OPACITY_BASE_VALUE (0.08)
  description: string;             // Use case description
  mathematicalRelationship: string; // Formula (e.g., "base × 6 = 0.08 × 6 = 0.48")
  baselineGridAlignment: false;    // Opacity is unitless, no grid alignment
  isStrategicFlexibility: boolean; // true for opacity150, opacity350, etc.
  isPrecisionTargeted: false;      // Not applicable for opacity
  platforms: PlatformValues;       // Unitless values for all platforms
}
```

### Platform Values for Opacity

```typescript
/**
 * Platform-specific opacity values
 * All platforms use same unitless value
 */
interface OpacityPlatformValues extends PlatformValues {
  web: {
    value: number;    // 0.0 - 1.0
    unit: 'unitless';
  };
  ios: {
    value: number;    // 0.0 - 1.0
    unit: 'unitless';
  };
  android: {
    value: number;    // 0.0 - 1.0
    unit: 'unitless';
  };
}
```

### Semantic Opacity Token Interface

```typescript
/**
 * Semantic opacity token structure
 * References primitive opacity tokens by name
 */
interface SemanticOpacityToken {
  name: string;                  // e.g., "opacityDisabled"
  primitiveReference: string;    // e.g., "opacity600"
  category: SemanticCategory.OPACITY;
  context: string;               // Use case context
  description: string;           // Detailed description
}
```

### Opacity Token Registry

```typescript
/**
 * Registry for opacity tokens
 * Provides lookup and validation
 */
class OpacityTokenRegistry {
  private primitiveTokens: Map<string, OpacityToken>;
  private semanticTokens: Map<string, SemanticOpacityToken>;
  
  /**
   * Get primitive opacity token by name
   */
  getPrimitiveToken(name: string): OpacityToken | undefined {
    return this.primitiveTokens.get(name);
  }
  
  /**
   * Get semantic opacity token by name
   */
  getSemanticToken(name: string): SemanticOpacityToken | undefined {
    return this.semanticTokens.get(name);
  }
  
  /**
   * Resolve semantic token to primitive value
   */
  resolveSemanticToken(name: string): number | undefined {
    const semantic = this.getSemanticToken(name);
    if (!semantic) return undefined;
    
    const primitive = this.getPrimitiveToken(semantic.primitiveReference);
    return primitive?.baseValue;
  }
}
```

---

## Data Models

### Opacity Token Definition File Structure

```typescript
// src/tokens/OpacityTokens.ts

/**
 * Opacity token base value for mathematical calculations
 */
export const OPACITY_BASE_VALUE = 0.08;

/**
 * Generate platform values for opacity tokens
 * All platforms use same unitless value
 */
function generateOpacityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Opacity primitive tokens
 * 13-token scale from 0% to 100% in 8% increments
 */
export const opacityTokens: Record<string, OpacityToken> = {
  opacity000: {
    name: 'opacity000',
    category: TokenCategory.OPACITY,
    baseValue: 0.0,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Fully transparent - invisible',
    mathematicalRelationship: 'base × 0 = 0.08 × 0 = 0.0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(0.0)
  },
  
  opacity100: {
    name: 'opacity100',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Subtle transparency - very light overlay, gentle hover feedback',
    mathematicalRelationship: 'base × 1 = 0.08 × 1 = 0.08',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE)
  },
  
  // ... opacity200 through opacity1200 (8% increments)
  
  opacity1300: {
    name: 'opacity1300',
    category: TokenCategory.OPACITY,
    baseValue: 1.0,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Fully opaque - no transparency',
    mathematicalRelationship: 'Special case: full opacity = 1.0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(1.0)
  }
};
```

### Semantic Opacity Token Definition

```typescript
// src/tokens/semantic/OpacityTokens.ts

/**
 * Semantic opacity tokens for common use cases
 * References primitive opacity tokens
 */
export const semanticOpacityTokens: Record<string, SemanticOpacityToken> = {
  opacityDisabled: {
    name: 'opacityDisabled',
    primitiveReference: 'opacity600',
    category: SemanticCategory.OPACITY,
    context: 'Disabled UI elements - faded, inactive appearance',
    description: 'Opacity for disabled states (48% opacity)'
  },
  
  opacityOverlay: {
    name: 'opacityOverlay',
    primitiveReference: 'opacity400',
    category: SemanticCategory.OPACITY,
    context: 'Modal scrims and overlays - blocks background interaction',
    description: 'Opacity for modal backdrops and overlays (32% opacity)'
  },
  
  opacityHover: {
    name: 'opacityHover',
    primitiveReference: 'opacity100',
    category: SemanticCategory.OPACITY,
    context: 'Subtle hover feedback - gentle transparency change',
    description: 'Opacity for subtle hover states (8% opacity)'
  },
  
  opacityPressed: {
    name: 'opacityPressed',
    primitiveReference: 'opacity200',
    category: SemanticCategory.OPACITY,
    context: 'Pressed state feedback - noticeable transparency change',
    description: 'Opacity for pressed states (16% opacity)'
  },
  
  opacityLoading: {
    name: 'opacityLoading',
    primitiveReference: 'opacity200',
    category: SemanticCategory.OPACITY,
    context: 'Loading skeleton states - subtle, non-intrusive',
    description: 'Opacity for loading skeletons and placeholders (16% opacity)'
  }
};
```

---

## Platform Translation

### Web (CSS) Translation

```typescript
/**
 * Web platform generator for opacity tokens
 */
class WebOpacityGenerator {
  /**
   * Generate CSS opacity property
   */
  generateOpacityProperty(token: OpacityToken): string {
    return `opacity: ${token.baseValue};`;
  }
  
  /**
   * Generate CSS with rgba alpha channel
   * Used when opacity is applied to specific color
   */
  generateRgbaAlpha(color: string, opacity: OpacityToken): string {
    // Parse color to RGB
    const rgb = this.parseColorToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.baseValue})`;
  }
  
  /**
   * Generate CSS custom property
   */
  generateCustomProperty(token: OpacityToken): string {
    return `--${token.name}: ${token.baseValue};`;
  }
}

// Example output:
// .button:disabled { opacity: 0.48; }
// .modal-backdrop { background: rgba(0, 0, 0, 0.32); }
// :root { --opacity600: 0.48; }
```

### iOS (SwiftUI) Translation

```typescript
/**
 * iOS platform generator for opacity tokens
 */
class IOSOpacityGenerator {
  /**
   * Generate SwiftUI opacity modifier
   */
  generateOpacityModifier(token: OpacityToken): string {
    return `.opacity(${token.baseValue})`;
  }
  
  /**
   * Generate SwiftUI Color with opacity parameter
   */
  generateColorWithOpacity(color: string, opacity: OpacityToken): string {
    // Parse color to RGB components
    const rgb = this.parseColorToRgb(color);
    return `Color(red: ${rgb.r}, green: ${rgb.g}, blue: ${rgb.b}, opacity: ${opacity.baseValue})`;
  }
  
  /**
   * Generate Swift constant
   */
  generateConstant(token: OpacityToken): string {
    return `static let ${this.toCamelCase(token.name)} = ${token.baseValue}`;
  }
}

// Example output:
// Button("Click").opacity(0.48)
// Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)
// static let opacity600 = 0.48
```

### Android (Jetpack Compose) Translation

```typescript
/**
 * Android platform generator for opacity tokens
 */
class AndroidOpacityGenerator {
  /**
   * Generate Jetpack Compose alpha modifier
   */
  generateAlphaModifier(token: OpacityToken): string {
    return `Modifier.alpha(${token.baseValue}f)`;
  }
  
  /**
   * Generate Jetpack Compose Color.copy with alpha
   */
  generateColorWithAlpha(color: string, opacity: OpacityToken): string {
    return `Color(${this.parseColorToHex(color)}).copy(alpha = ${token.baseValue}f)`;
  }
  
  /**
   * Generate Kotlin constant
   */
  generateConstant(token: OpacityToken): string {
    return `const val ${this.toUpperSnakeCase(token.name)} = ${token.baseValue}f`;
  }
}

// Example output:
// Button(modifier = Modifier.alpha(0.48f))
// Color(0xFF6B50A4).copy(alpha = 0.48f)
// const val OPACITY_600 = 0.48f
```

---

## Composition Syntax

### Opacity with Color

```typescript
/**
 * Composition: Apply opacity to color
 * Syntax: color at opacity
 */
interface OpacityComposition {
  color: string;      // Color token name (e.g., "purple500")
  opacity: string;    // Opacity token name (e.g., "opacity600")
}

// Example usage:
// purple500 at opacity600
// → purple500 with 48% opacity
```

### Opacity with Blend (Coordinated)

```typescript
/**
 * Composition: Apply blend then opacity
 * Syntax: color with blend at opacity
 * Order: blend first, then opacity
 */
interface BlendOpacityComposition {
  color: string;      // Color token name
  blend: string;      // Blend token name
  blendDirection: 'darker' | 'lighter' | 'saturate' | 'desaturate';
  opacity: string;    // Opacity token name
}

// Example usage:
// purple500 with blend200 darker at opacity600
// → Step 1: Apply blend (purple500 + 8% black = #7C3AED)
// → Step 2: Apply opacity (#7C3AED at 48% opacity)
```

---

## Design Decisions

### Decision 1: 0.08 Base Value

**Options Considered**:
1. 0.05 (5%) - Finer control, more tokens needed
2. 0.08 (8%) - Aligns with 8px baseline grid philosophy
3. 0.10 (10%) - Simpler mental math, standard percentage thinking

**Decision**: 0.08 (8%)

**Rationale**: Aligns with 8px baseline grid philosophy, creating conceptual consistency across the token system. Provides sufficient granularity (8% increments) for transparency effects without overwhelming complexity. The 8% increment enables nuanced control (80% → 88% for subtle hover transitions) while maintaining mathematical consistency.

**Trade-offs**:
- ✅ Gained: Conceptual alignment with baseline grid, nuanced control
- ❌ Lost: Simpler 10% mental math
- ⚠️ Risk: Developers must remember "opacity700 = 56%" (not as obvious as 10% increments)

### Decision 2: 13-Token Scale (0-100%)

**Options Considered**:
1. 8 tokens (0%, 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%, 100%)
2. 11 tokens (0%, 10%, 20%... 100%)
3. 13 tokens (0%, 8%, 16%... 100%)

**Decision**: 13 tokens with 8% increments

**Rationale**: Full 0-100% range needed for transparency effects (unlike blend which only needs 4-20%). The 8% increment provides nuanced control for subtle transitions while maintaining mathematical consistency with base value. Comprehensive coverage without excessive complexity.

**Trade-offs**:
- ✅ Gained: Full transparency range, nuanced control, mathematical consistency
- ❌ Lost: Simplicity of fewer tokens
- ⚠️ Risk: 13 tokens might feel like many, but full range justifies it

### Decision 3: Direct Alpha Channel Translation

**Options Considered**:
1. Direct alpha channel (opacity: 0.48)
2. Percentage values (opacity: 48%)
3. 0-255 scale (opacity: 122)

**Decision**: Direct alpha channel (0.0 - 1.0)

**Rationale**: Unitless decimal values (0.0 - 1.0) translate directly to platform alpha channels without conversion. Web CSS, iOS SwiftUI, and Android Compose all use 0.0-1.0 scale natively. This ensures cross-platform consistency and eliminates conversion errors.

**Trade-offs**:
- ✅ Gained: Direct platform mapping, no conversion needed, cross-platform consistency
- ❌ Lost: Percentage thinking (48% vs 0.48)
- ⚠️ Risk: Developers must think in decimals, not percentages

### Decision 4: Scale Notation (Not Value Notation)

**Options Considered**:
1. Scale notation: opacity600 = 0.48 (number is multiplier)
2. Value notation: opacity048 = 0.48 (number is value)

**Decision**: Scale notation

**Rationale**: Maintains consistency with entire token system (space100, fontSize100, radius100). Enables pattern-based reasoning for AI agents. Supports base value changes without renaming tokens. While value notation would be more explicit, scale notation aligns with mathematical foundation philosophy.

**Trade-offs**:
- ✅ Gained: System consistency, pattern-based reasoning, base value flexibility
- ❌ Lost: Explicit value in name (opacity048 immediately tells you 48%)
- ⚠️ Risk: Requires learning "opacity600 = 48%" mapping

---

## Error Handling

### Invalid Opacity Values

```typescript
/**
 * Validate opacity value is within valid range
 */
function validateOpacityValue(value: number): ValidationResult {
  if (value < 0.0 || value > 1.0) {
    return {
      status: 'error',
      message: `Opacity value ${value} is out of range. Must be between 0.0 and 1.0.`
    };
  }
  return { status: 'pass' };
}
```

### Missing Token References

```typescript
/**
 * Validate opacity token exists
 */
function validateOpacityToken(tokenName: string): ValidationResult {
  const token = opacityTokenRegistry.getPrimitiveToken(tokenName);
  if (!token) {
    return {
      status: 'error',
      message: `Opacity token "${tokenName}" not found. Available tokens: ${availableTokens.join(', ')}`
    };
  }
  return { status: 'pass' };
}
```

### Semantic Token Resolution

```typescript
/**
 * Validate semantic token resolves to primitive
 */
function validateSemanticResolution(semanticName: string): ValidationResult {
  const value = opacityTokenRegistry.resolveSemanticToken(semanticName);
  if (value === undefined) {
    return {
      status: 'error',
      message: `Semantic token "${semanticName}" could not be resolved to primitive value.`
    };
  }
  return { status: 'pass' };
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('OpacityTokens', () => {
  test('base value is 0.08', () => {
    expect(OPACITY_BASE_VALUE).toBe(0.08);
  });
  
  test('opacity100 equals base value', () => {
    expect(opacityTokens.opacity100.baseValue).toBe(0.08);
  });
  
  test('opacity600 equals 6 × base value', () => {
    expect(opacityTokens.opacity600.baseValue).toBe(0.48);
  });
  
  test('all tokens have unitless platform values', () => {
    Object.values(opacityTokens).forEach(token => {
      expect(token.platforms.web.unit).toBe('unitless');
      expect(token.platforms.ios.unit).toBe('unitless');
      expect(token.platforms.android.unit).toBe('unitless');
    });
  });
});
```

### Integration Tests

```typescript
describe('Opacity Platform Translation', () => {
  test('web generator produces valid CSS', () => {
    const css = webGenerator.generateOpacityProperty(opacityTokens.opacity600);
    expect(css).toBe('opacity: 0.48;');
  });
  
  test('iOS generator produces valid SwiftUI', () => {
    const swift = iosGenerator.generateOpacityModifier(opacityTokens.opacity600);
    expect(swift).toBe('.opacity(0.48)');
  });
  
  test('Android generator produces valid Compose', () => {
    const kotlin = androidGenerator.generateAlphaModifier(opacityTokens.opacity600);
    expect(kotlin).toBe('Modifier.alpha(0.48f)');
  });
});
```

### Semantic Token Tests

```typescript
describe('Semantic Opacity Tokens', () => {
  test('opacityDisabled resolves to opacity600', () => {
    const value = opacityTokenRegistry.resolveSemanticToken('opacityDisabled');
    expect(value).toBe(0.48);
  });
  
  test('all semantic tokens resolve to valid primitives', () => {
    Object.keys(semanticOpacityTokens).forEach(name => {
      const value = opacityTokenRegistry.resolveSemanticToken(name);
      expect(value).toBeGreaterThanOrEqual(0.0);
      expect(value).toBeLessThanOrEqual(1.0);
    });
  });
});
```

---

*This design document provides the technical architecture for implementing the opacity token system with cross-platform consistency, compositional flexibility, and coordination with the blend token system.*
