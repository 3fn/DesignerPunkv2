# Design Document: Shadow and Glow Token System

**Date**: October 23, 2025
**Spec**: shadow-glow-token-system
**Status**: Design Phase
**Dependencies**: mathematical-token-system, cross-platform-build-system

---

## Important: Token System Architecture Alignment

> ⚠️ **CRITICAL**: This design follows the established DesignerPunk token system architecture documented in the [Token Category Pattern Guide](../../token-system/token-category-pattern-guide.md).

**Key Patterns to Follow**:
1. **Primitive tokens** export `PrimitiveToken` objects with all required metadata
2. **File location**: Primitive tokens live in `src/tokens/` (NOT in subdirectories)
3. **Semantic tokens** use string references via `primitiveReferences` object
4. **Semantic location**: Semantic tokens live in `src/tokens/semantic/`
5. **No registration functions** - tokens consumed directly from definition files
6. **Index integration** - tokens exported via `src/tokens/index.ts`

**Reference Files**:
- Primitive pattern: `src/tokens/SpacingTokens.ts`, `src/tokens/FontSizeTokens.ts`, `src/tokens/BorderWidthTokens.ts`
- Semantic pattern: `src/tokens/semantic/TypographyTokens.ts`, `src/tokens/semantic/BorderWidthTokens.ts`
- Token index: `src/tokens/index.ts`

**Current Issue**: Task 1.1 created `src/tokens/shadow/` subdirectory, but primitive tokens should be in `src/tokens/` directly. This will be corrected in fix tasks.

---

## Overview

This design document details the technical architecture for the Shadow and Glow token system. The system provides mathematically consistent primitives for creating depth (shadows) and emphasis (glows) effects across web, iOS, and Android platforms.

The design is grounded in natural lighting principles (sun arc throughout the day) and shadow quality characteristics (hard/moderate/soft), translated into precise mathematical primitives that maintain cross-platform consistency.

---

## Architecture

### System Components

```
Shadow & Glow Token System
├── Primitive Tokens (src/tokens/)
│   ├── ShadowOffsetTokens.ts      (offsetX, offsetY)
│   ├── ShadowBlurTokens.ts        (quality + depth blur values)
│   ├── ShadowOpacityTokens.ts     (quality + depth opacity values)
│   ├── ColorTokens.ts             (shadow color family: shadowDefault, shadowWarm, shadowCool, shadowAmbient)
│   ├── GlowBlurTokens.ts          (extended blur range)
│   └── GlowOpacityTokens.ts       (decreasing progression)
│
├── Semantic Tokens (src/tokens/semantic/)
│   ├── ShadowTokens.ts            (composed shadow tokens)
│   └── ColorTokens.ts             (shadow color semantics: color.shadow.default, color.shadow.warm, etc.)
│                                  (glow color semantics: glow.neonPurple, glow.neonCyan, glow.neonYellow)
│
├── Token Index (src/tokens/index.ts)
│   └── Exports all shadow/glow tokens
│
└── Cross-Platform Build System
    ├── Web (CSS box-shadow)
    ├── iOS (shadowOffset, shadowRadius, shadowOpacity)
    └── Android (elevation approximation)
```

### Design Principles

1. **Separation of Concerns**: Shadows (depth) and glows (emphasis) are separate token families
2. **Compositional Architecture**: Semantic tokens compose primitives using string references
3. **Natural Grounding**: Lighting concepts based on real-world sun arc and shadow quality
4. **Mathematical Consistency**: Base-8 system with 4px baseline grid alignment
5. **Strategic Flexibility**: Preferred patterns with intentional variation allowed
6. **Cross-Platform Unity**: Unitless primitives translate to platform-specific formats
7. **Token System Alignment**: Follows established patterns from SpacingTokens, FontSizeTokens, etc.

---

## Shadow Primitive Tokens

### File Organization

All shadow primitive token files live in `src/tokens/` directory:
- `src/tokens/ShadowOffsetTokens.ts`
- `src/tokens/ShadowBlurTokens.ts`
- `src/tokens/ShadowOpacityTokens.ts`
- `src/tokens/ColorTokens.ts` (shadow color family added to existing file)

### Offset Primitives (ShadowOffsetTokens.ts)

**Status**: Already implemented correctly in `src/tokens/shadow/ShadowOffsetTokens.ts` (needs to be moved to `src/tokens/`)

Shadow offsets determine shadow direction based on light source position (sun arc).

```typescript
/**
 * Shadow Offset Token Definitions
 * 
 * Shadow offset tokens determine shadow direction based on light source position (sun arc).
 * Base value: 4 units (4px baseline grid alignment)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const SHADOW_OFFSET_BASE_VALUE = 4;

function generateShadowOffsetPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

export const shadowOffsetXTokens: Record<string, PrimitiveToken> = {
  n300: {
    name: 'shadowOffsetX.n300',
    category: TokenCategory.SHADOW,
    baseValue: -12,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Sunrise shadow offset - large left offset',
    mathematicalRelationship: 'base × -3 = 4 × -3 = -12',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(-12)
  },
  // ... (n150, 000, 150, 300, etc.)
};

export const shadowOffsetYTokens: Record<string, PrimitiveToken> = {
  '100': {
    name: 'shadowOffsetY.100',
    category: TokenCategory.SHADOW,
    baseValue: 4,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Depth 100 / Noon - short shadow',
    mathematicalRelationship: 'base × 1 = 4 × 1 = 4',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(4)
  },
  // ... (200, 300, 400)
};

// Helper functions
export function getShadowOffsetXToken(name: string): PrimitiveToken | undefined {
  return shadowOffsetXTokens[name];
}

export function getShadowOffsetYToken(name: string): PrimitiveToken | undefined {
  return shadowOffsetYTokens[name];
}

export function getAllShadowOffsetXTokens(): PrimitiveToken[] {
  return Object.values(shadowOffsetXTokens);
}

export function getAllShadowOffsetYTokens(): PrimitiveToken[] {
  return Object.values(shadowOffsetYTokens);
}

export const shadowOffsetXNames = Object.keys(shadowOffsetXTokens);
export const shadowOffsetYNames = Object.keys(shadowOffsetYTokens);
```

### Blur Primitives (ShadowBlurTokens.ts)

Shadow blur determines edge definition based on shadow quality and depth.

```typescript
/**
 * Shadow Blur Token Definitions
 * 
 * Shadow blur tokens determine edge definition based on shadow quality and depth.
 * Base value: 4 units (4px baseline grid alignment)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const SHADOW_BLUR_BASE_VALUE = 4;

function generateShadowBlurPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

export const shadowBlurTokens: Record<string, PrimitiveToken> = {
  shadowBlurHard: {
    name: 'shadowBlurHard',
    category: TokenCategory.SHADOW,
    baseValue: 4,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Hard shadow blur - sharp, defined edges',
    mathematicalRelationship: 'base × 1 = 4 × 1 = 4',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(4)
  },
  
  shadowBlurModerate: {
    name: 'shadowBlurModerate',
    category: TokenCategory.SHADOW,
    baseValue: 12,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Moderate shadow blur - balanced definition',
    mathematicalRelationship: 'base × 3 = 4 × 3 = 12',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(12)
  },
  
  shadowBlurSoft: {
    name: 'shadowBlurSoft',
    category: TokenCategory.SHADOW,
    baseValue: 20,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Soft shadow blur - diffuse, gentle edges',
    mathematicalRelationship: 'base × 5 = 4 × 5 = 20',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(20)
  },
  
  shadowBlurDepth200: {
    name: 'shadowBlurDepth200',
    category: TokenCategory.SHADOW,
    baseValue: 16,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Depth 200 blur adjustment - increased blur for raised elements',
    mathematicalRelationship: 'base × 4 = 4 × 4 = 16',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(16)
  },
  
  shadowBlurDepth300: {
    name: 'shadowBlurDepth300',
    category: TokenCategory.SHADOW,
    baseValue: 24,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Depth 300 blur adjustment - maximum blur for floating elements',
    mathematicalRelationship: 'base × 6 = 4 × 6 = 24',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(24)
  }
};

// Helper functions
export function getShadowBlurToken(name: string): PrimitiveToken | undefined {
  return shadowBlurTokens[name];
}

export function getAllShadowBlurTokens(): PrimitiveToken[] {
  return Object.values(shadowBlurTokens);
}

export const shadowBlurTokenNames = Object.keys(shadowBlurTokens);
```

### Opacity Primitives (ShadowOpacityTokens.ts)

Shadow opacity determines shadow darkness based on quality and depth.

```typescript
/**
 * Shadow Opacity Token Definitions
 * 
 * Shadow opacity tokens determine shadow darkness based on quality and depth.
 * Base value: 0.3 (unitless)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

export const SHADOW_OPACITY_BASE_VALUE = 0.3;

function generateShadowOpacityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

export const shadowOpacityTokens: Record<string, PrimitiveToken> = {
  shadowOpacityHard: {
    name: 'shadowOpacityHard',
    category: TokenCategory.SHADOW,
    baseValue: 0.4,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Hard shadow opacity - darker for sharp shadows',
    mathematicalRelationship: 'base × 1.33 = 0.3 × 1.33 ≈ 0.4',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(0.4)
  },
  
  shadowOpacityModerate: {
    name: 'shadowOpacityModerate',
    category: TokenCategory.SHADOW,
    baseValue: 0.3,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Moderate shadow opacity - balanced opacity',
    mathematicalRelationship: 'base × 1 = 0.3 × 1 = 0.3',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(0.3)
  },
  
  shadowOpacitySoft: {
    name: 'shadowOpacitySoft',
    category: TokenCategory.SHADOW,
    baseValue: 0.2,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Soft shadow opacity - lighter for diffuse shadows',
    mathematicalRelationship: 'base × 0.67 = 0.3 × 0.67 ≈ 0.2',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(0.2)
  },
  
  shadowOpacityDepth200: {
    name: 'shadowOpacityDepth200',
    category: TokenCategory.SHADOW,
    baseValue: 0.35,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Depth 200 opacity adjustment - slightly darker for raised elements',
    mathematicalRelationship: 'base × 1.17 = 0.3 × 1.17 ≈ 0.35',
    baselineGridAlignment: false,
    isStrategicFlexibility: true, // Strategic flexibility for visual quality
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(0.35)
  },
  
  shadowOpacityDepth300: {
    name: 'shadowOpacityDepth300',
    category: TokenCategory.SHADOW,
    baseValue: 0.4,
    familyBaseValue: SHADOW_OPACITY_BASE_VALUE,
    description: 'Depth 300 opacity adjustment - darkest for floating elements',
    mathematicalRelationship: 'base × 1.33 = 0.3 × 1.33 ≈ 0.4',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOpacityPlatformValues(0.4)
  }
};

// Helper functions
export function getShadowOpacityToken(name: string): PrimitiveToken | undefined {
  return shadowOpacityTokens[name];
}

export function getAllShadowOpacityTokens(): PrimitiveToken[] {
  return Object.values(shadowOpacityTokens);
}

export const shadowOpacityTokenNames = Object.keys(shadowOpacityTokens);
```

### Shadow Color Primitives (ColorTokens.ts)

Shadow colors are added to the existing `src/tokens/ColorTokens.ts` file as a new color family. Following art theory, shadows are rarely pure black but tinted by ambient light.

```typescript
/**
 * Shadow Color Family (added to ColorTokens.ts)
 * 
 * Shadow colors based on art theory: shadows are tinted by ambient light.
 * - Warm light creates cool shadows (blue-tinted)
 * - Cool light creates warm shadows (warm-tinted)
 * - Neutral light creates neutral shadows (black/gray)
 * 
 * Shadow colors are mode-agnostic (always dark) regardless of light/dark theme.
 */

// In ColorTokens.ts, add to existing colorTokens object:
export const colorTokens: Record<string, PrimitiveToken> = {
  // ... existing colors (gray, purple, cyan, etc.)
  
  // Shadow color family
  shadowDefault: {
    name: 'color.shadow.default',
    category: TokenCategory.COLOR,
    baseValue: {
      light: { base: 'rgb(0, 0, 0)', wcag: 'rgb(0, 0, 0)' },
      dark: { base: 'rgb(0, 0, 0)', wcag: 'rgb(0, 0, 0)' }  // Mode-agnostic
    },
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Default shadow color - pure black for neutral lighting',
    mathematicalRelationship: 'Pure black (0, 0, 0)',
    baselineGridAlignment: false, // Color is not spatial
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 'rgb(0, 0, 0)', unit: 'color' },
      ios: { value: 'UIColor.black', unit: 'color' },
      android: { value: 'Color.BLACK', unit: 'color' }
    }
  },
  
  shadowWarm: {
    name: 'color.shadow.warm',
    category: TokenCategory.COLOR,
    baseValue: {
      light: { base: 'rgb(20, 25, 40)', wcag: 'rgb(20, 25, 40)' },
      dark: { base: 'rgb(20, 25, 40)', wcag: 'rgb(20, 25, 40)' }  // Mode-agnostic
    },
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Warm shadow color - cool blue-gray tint (warm light creates cool shadows)',
    mathematicalRelationship: 'Blue-tinted gray for sunrise/sunset lighting',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 'rgb(20, 25, 40)', unit: 'color' },
      ios: { value: 'UIColor(red: 20/255, green: 25/255, blue: 40/255, alpha: 1)', unit: 'color' },
      android: { value: 'Color.rgb(20, 25, 40)', unit: 'color' }
    }
  },
  
  shadowCool: {
    name: 'color.shadow.cool',
    category: TokenCategory.COLOR,
    baseValue: {
      light: { base: 'rgb(25, 20, 15)', wcag: 'rgb(25, 20, 15)' },
      dark: { base: 'rgb(25, 20, 15)', wcag: 'rgb(25, 20, 15)' }  // Mode-agnostic
    },
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Cool shadow color - warm gray tint (cool light creates warm shadows)',
    mathematicalRelationship: 'Warm-tinted gray for cool lighting environments',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 'rgb(25, 20, 15)', unit: 'color' },
      ios: { value: 'UIColor(red: 25/255, green: 20/255, blue: 15/255, alpha: 1)', unit: 'color' },
      android: { value: 'Color.rgb(25, 20, 15)', unit: 'color' }
    }
  },
  
  shadowAmbient: {
    name: 'color.shadow.ambient',
    category: TokenCategory.COLOR,
    baseValue: {
      light: { base: 'rgb(15, 20, 30)', wcag: 'rgb(15, 20, 30)' },
      dark: { base: 'rgb(15, 20, 30)', wcag: 'rgb(15, 20, 30)' }  // Mode-agnostic
    },
    familyBaseValue: COLOR_BASE_VALUE,
    description: 'Ambient shadow color - blue-gray tint for overcast/ambient lighting',
    mathematicalRelationship: 'Blue-gray for ambient/overcast conditions',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
      web: { value: 'rgb(15, 20, 30)', unit: 'color' },
      ios: { value: 'UIColor(red: 15/255, green: 20/255, blue: 30/255, alpha: 1)', unit: 'color' },
      android: { value: 'Color.rgb(15, 20, 30)', unit: 'color' }
    }
  }
};
```

### Shadow Color Semantics (semantic/ColorTokens.ts)

Semantic shadow colors are added to `src/tokens/semantic/ColorTokens.ts` to provide semantic naming:

```typescript
/**
 * Shadow Color Semantics (added to semantic/ColorTokens.ts)
 * 
 * Semantic shadow colors reference primitive shadow colors from ColorTokens.ts
 */

// In semantic/ColorTokens.ts, add to existing colorTokens object:
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // ... existing semantic colors
  
  // Shadow color semantics
  'color.shadow.default': {
    name: 'color.shadow.default',
    primitiveReferences: {
      color: 'color.shadow.default'
    },
    category: SemanticCategory.COLOR,
    context: 'Default shadow color for standard UI shadows',
    description: 'Pure black shadow for neutral lighting (noon)'
  },
  
  'color.shadow.warm': {
    name: 'color.shadow.warm',
    primitiveReferences: {
      color: 'color.shadow.warm'
    },
    category: SemanticCategory.COLOR,
    context: 'Warm shadow color for sunrise/sunset lighting',
    description: 'Cool blue-gray tinted shadow (warm light creates cool shadows)'
  },
  
  'color.shadow.cool': {
    name: 'color.shadow.cool',
    primitiveReferences: {
      color: 'color.shadow.cool'
    },
    category: SemanticCategory.COLOR,
    context: 'Cool shadow color for cool lighting environments',
    description: 'Warm gray tinted shadow (cool light creates warm shadows)'
  },
  
  'color.shadow.ambient': {
    name: 'color.shadow.ambient',
    primitiveReferences: {
      color: 'color.shadow.ambient'
    },
    category: SemanticCategory.COLOR,
    context: 'Ambient shadow color for overcast/ambient lighting',
    description: 'Blue-gray tinted shadow for ambient conditions'
  }
};
```

---

## Shadow Semantic Tokens

### File Organization

Semantic shadow tokens live in `src/tokens/semantic/ShadowTokens.ts`

### Compositional Structure

Semantic shadow tokens compose primitives using string references (following semantic/TypographyTokens.ts pattern).

```typescript
/**
 * Semantic Shadow Token Definitions
 * 
 * Shadow semantic tokens compose primitive shadow tokens using string references
 * to create complete shadow styles for specific use cases.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

export const shadowTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'shadow.container': {
    name: 'shadow.container',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurModerate',
      opacity: 'shadowOpacityModerate',
      color: 'color.shadow.default'
    },
    category: SemanticCategory.SHADOW,
    context: 'Standard container shadow with noon lighting and moderate quality',
    description: 'Container shadow with no horizontal offset, 4px vertical offset, 12px blur, moderate opacity'
  },
  
  'shadow.modal': {
    name: 'shadow.modal',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.200',
      blur: 'shadowBlurDepth200',
      opacity: 'shadowOpacityDepth200',
      color: 'color.shadow.default'
    },
    category: SemanticCategory.SHADOW,
    context: 'Modal shadow with noon lighting and depth 200',
    description: 'Modal shadow with no horizontal offset, 8px vertical offset, 16px blur, slightly darker opacity'
  },
  
  'shadow.fab': {
    name: 'shadow.fab',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.300',
      offsetY: 'shadowOffsetY.400',
      blur: 'shadowBlurHard',
      opacity: 'shadowOpacityHard',
      color: 'color.shadow.warm'
    },
    category: SemanticCategory.SHADOW,
    context: 'Floating action button shadow with sunset lighting and hard quality',
    description: 'Dramatic shadow with 12px right offset, 16px down offset, 4px blur, darker opacity, warm (blue-gray) tint'
  },
  
  'shadow.hover': {
    name: 'shadow.hover',
    primitiveReferences: {
      offsetX: 'shadowOffsetX.000',
      offsetY: 'shadowOffsetY.100',
      blur: 'shadowBlurSoft',
      opacity: 'shadowOpacitySoft',
      color: 'color.shadow.default'
    },
    category: SemanticCategory.SHADOW,
    context: 'Hover state shadow with noon lighting and soft quality',
    description: 'Subtle shadow with no horizontal offset, 4px vertical offset, 20px blur, lighter opacity'
  }
};

// Helper functions
export function getShadowToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return shadowTokens[name];
}

export function getAllShadowTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(shadowTokens);
}

export const shadowTokenNames = Object.keys(shadowTokens);
```

---

## Glow Primitive Tokens

Glow primitives follow the same `PrimitiveToken` pattern as shadow primitives, with files in `src/tokens/`:
- `src/tokens/GlowBlurTokens.ts`
- `src/tokens/GlowOpacityTokens.ts`

Structure is identical to shadow primitives with appropriate base values and ranges.

### Glow Color Semantics (semantic/ColorTokens.ts)

Glow colors reference existing vibrant color tokens (purple500, cyan500, yellow500). Semantic glow colors are added to `src/tokens/semantic/ColorTokens.ts`:

```typescript
/**
 * Glow Color Semantics (added to semantic/ColorTokens.ts)
 * 
 * Semantic glow colors reference existing vibrant primitive colors
 */

// In semantic/ColorTokens.ts, add to existing colorTokens object:
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // ... existing semantic colors
  
  // Glow color semantics
  'glow.neonPurple': {
    name: 'glow.neonPurple',
    primitiveReferences: {
      color: 'color.purple.500'
    },
    category: SemanticCategory.COLOR,
    context: 'Neon purple glow color for emphasis effects',
    description: 'Vibrant purple glow referencing purple500'
  },
  
  'glow.neonCyan': {
    name: 'glow.neonCyan',
    primitiveReferences: {
      color: 'color.cyan.500'
    },
    category: SemanticCategory.COLOR,
    context: 'Neon cyan glow color for emphasis effects',
    description: 'Vibrant cyan glow referencing cyan500'
  },
  
  'glow.neonYellow': {
    name: 'glow.neonYellow',
    primitiveReferences: {
      color: 'color.yellow.500'
    },
    category: SemanticCategory.COLOR,
    context: 'Neon yellow glow color for emphasis effects',
    description: 'Vibrant yellow glow referencing yellow500'
  }
};
```

---

## Token Index Integration

All shadow and glow tokens must be exported via `src/tokens/index.ts`:

```typescript
// Shadow primitive exports
export {
  SHADOW_OFFSET_BASE_VALUE,
  shadowOffsetXTokens,
  shadowOffsetYTokens,
  shadowOffsetXNames,
  shadowOffsetYNames,
  getShadowOffsetXToken,
  getShadowOffsetYToken,
  getAllShadowOffsetXTokens,
  getAllShadowOffsetYTokens
} from './ShadowOffsetTokens';

export {
  SHADOW_BLUR_BASE_VALUE,
  shadowBlurTokens,
  shadowBlurTokenNames,
  getShadowBlurToken,
  getAllShadowBlurTokens
} from './ShadowBlurTokens';

// ... (other shadow primitives)

// Add to allTokens object
export const allTokens: Record<TokenCategory, Record<string, PrimitiveToken>> = {
  // ... existing tokens
  [TokenCategory.SHADOW]: {
    ...shadowOffsetXTokens,
    ...shadowOffsetYTokens,
    ...shadowBlurTokens,
    ...shadowOpacityTokens,
    ...shadowSpreadTokens,
    ...shadowColorTokens
  }
};

// Add to TOKEN_FAMILY_BASE_VALUES
export const TOKEN_FAMILY_BASE_VALUES: Record<TokenCategory, number> = {
  // ... existing values
  [TokenCategory.SHADOW]: SHADOW_OFFSET_BASE_VALUE
};
```

---

## Cross-Platform Translation

Translation strategies remain the same as originally designed:
- **Web**: CSS box-shadow format
- **iOS**: shadowOffset, shadowRadius, shadowOpacity, shadowColor
- **Android**: elevation approximation or custom drawable

---

## Design Decisions

### Decision 1: Correct File Organization Pattern

**Problem**: Task 1.1 created `src/tokens/shadow/` subdirectory for primitive tokens.

**Decision**: Move primitive tokens to `src/tokens/` directly (no subdirectory).

**Rationale**: 
- Existing system has ALL primitive tokens in `src/tokens/` directly
- Only semantic tokens use subdirectories (`src/tokens/semantic/`)
- Consistency with SpacingTokens, FontSizeTokens, BorderWidthTokens, etc.

**Trade-offs**:
- ✅ Gained: Consistency with existing system
- ❌ Lost: Work from Task 1.1 (needs to be moved)
- ⚠️ Risk: None - this is the correct pattern

### Decision 2: Follow Token Category Pattern Guide

**Decision**: Strictly follow patterns documented in Token Category Pattern Guide.

**Rationale**:
- Pattern guide exists specifically to prevent mistakes like this
- Border-width tokens went through same correction process
- Following established patterns ensures system consistency

### Decision 3: Remove Spread Property from Shadow Composition

**Problem**: Initial spec included spread property for shadows.

**Decision**: Remove spread property entirely from shadow composition.

**Rationale**:
- iOS doesn't support spread
- Android doesn't support spread
- Web supports it but it's rarely used
- Most shadows use spread: 0
- Cross-platform consistency is more important than web-only feature

**Trade-offs**:
- ✅ Gained: True cross-platform shadow consistency
- ✅ Gained: Simpler shadow composition (fewer properties)
- ❌ Lost: Web-specific spread capability
- ⚠️ Risk: None - spread is rarely used in practice

**Counter-Arguments**:
- **Argument**: "Some web designs use spread for shadow effects"
- **Response**: Spread is a web-only feature that breaks cross-platform consistency. If web-specific spread is needed, it can be added as a web-only enhancement in the future, but the core shadow system should work across all platforms.

### Decision 4: Shadow Colors in ColorTokens, Not Separate File

**Problem**: Initial spec included separate ShadowColorTokens.ts file.

**Decision**: Add shadow colors to existing ColorTokens.ts as a new color family.

**Rationale**:
- Colors are colors, regardless of use case
- Follows compositional architecture pattern (typography doesn't include color)
- Shadow colors could be reused beyond shadows (subtle text, borders, backgrounds)
- Maintains separation of concerns (colors vs spatial properties)
- Consistent with how the system already works

**Trade-offs**:
- ✅ Gained: Consistency with compositional architecture
- ✅ Gained: Potential reusability of shadow colors
- ✅ Gained: Clear separation of concerns
- ❌ Lost: None - this is the correct pattern
- ⚠️ Risk: None - follows established patterns

**Counter-Arguments**:
- **Argument**: "Shadow colors are only used for shadows, so they should be in ShadowColorTokens"
- **Response**: Separation of concerns is more important. Colors are colors, shadows are spatial properties. This matches how typography tokens don't include color - they reference ColorTokens. The same pattern applies here.

### Decision 5: Shadow Colors Based on Art Theory

**Problem**: Initial spec assumed shadows are pure black.

**Decision**: Shadow colors are tinted based on ambient light (art theory: warm light creates cool shadows, cool light creates warm shadows).

**Rationale**:
- Art theory: shadows are rarely pure black, but tinted by ambient light
- Aligns with sun arc lighting framework (sunrise/sunset have warm light → cool shadows)
- Provides visual sophistication and natural appearance
- Mode-agnostic (shadows always dark) regardless of light/dark theme

**Trade-offs**:
- ✅ Gained: More natural, sophisticated shadow appearance
- ✅ Gained: Alignment with sun arc lighting framework
- ✅ Gained: Art theory grounding for design decisions
- ❌ Lost: Simplicity of pure black shadows
- ⚠️ Risk: Minimal - default shadow still uses pure black for standard UI

**Counter-Arguments**:
- **Argument**: "Pure black shadows are simpler and more predictable"
- **Response**: Default shadow color is still pure black (shadowDefault). Tinted shadows (shadowWarm, shadowCool, shadowAmbient) are available for enhanced visual quality when appropriate. This provides both simplicity and sophistication.

### Decision 6: Shadow Color Family Architecture

**Problem**: Initial implementation used purpose-based naming (shadowDefault, shadowWarm, shadowCool, shadowAmbient) rather than systematic color family structure.

**Decision**: Refactor shadow colors to use systematic color family structure (shadowBlack100, shadowBlue100, shadowOrange100, shadowGray100) following the established color token pattern.

**Rationale**:

The DesignerPunk color system uses systematic color families (gray100-900, purple100-900, cyan100-900, etc.) rather than purpose-based naming. Shadow colors should follow this same pattern for architectural consistency:

1. **Systematic Structure**: Color families use numeric scales (100-900) that indicate lightness/darkness relationships. Shadow colors should follow this pattern even though they currently only have one value per family.

2. **Future Flexibility**: Using shadowBlack100, shadowBlue100, etc. allows for future expansion (shadowBlack200, shadowBlack300) if needed, without breaking the naming convention. Purpose-based names (shadowDefault, shadowWarm) don't provide this flexibility.

3. **Architectural Consistency**: Every other color in the system uses family structure. Shadow colors being the exception creates architectural inconsistency and confusion about when to use which naming pattern.

4. **Semantic Layer Separation**: The semantic layer (color.shadow.default, color.shadow.warm, etc.) provides the purpose-based naming. Primitive tokens should use systematic structure, semantic tokens provide meaning.

5. **Art Theory Alignment**: The color families align with art theory:
   - shadowBlack100: Pure black for neutral lighting (default)
   - shadowBlue100: Blue-tinted for warm light environments (warm light creates cool shadows)
   - shadowOrange100: Orange-tinted for cool light environments (cool light creates warm shadows)
   - shadowGray100: Gray-tinted for ambient/overcast lighting

**Shadow Color Family Structure**:

```typescript
// Primitive tokens (ColorTokens.ts) - systematic family structure
// Note: Primitive token names follow the pattern 'shadowBlack100' (not 'color.shadow.black.100')
// This matches existing color token naming: gray100, purple300, cyan400, etc.

shadowBlack100: {
  name: 'shadowBlack100',
  baseValue: { light: { base: 'rgb(0, 0, 0)', wcag: 'rgb(0, 0, 0)' }, dark: { base: 'rgb(0, 0, 0)', wcag: 'rgb(0, 0, 0)' } },
  description: 'Shadow black 100 - pure black for neutral lighting'
}

shadowBlue100: {
  name: 'shadowBlue100',
  baseValue: { light: { base: 'rgb(20, 25, 40)', wcag: 'rgb(20, 25, 40)' }, dark: { base: 'rgb(20, 25, 40)', wcag: 'rgb(20, 25, 40)' } },
  description: 'Shadow blue 100 - blue-gray tint for warm light (sunrise/sunset)'
}

shadowOrange100: {
  name: 'shadowOrange100',
  baseValue: { light: { base: 'rgb(25, 20, 15)', wcag: 'rgb(25, 20, 15)' }, dark: { base: 'rgb(25, 20, 15)', wcag: 'rgb(25, 20, 15)' } },
  description: 'Shadow orange 100 - warm tint for cool light environments'
}

shadowGray100: {
  name: 'shadowGray100',
  baseValue: { light: { base: 'rgb(15, 20, 30)', wcag: 'rgb(15, 20, 30)' }, dark: { base: 'rgb(15, 20, 30)', wcag: 'rgb(15, 20, 30)' } },
  description: 'Shadow gray 100 - blue-gray tint for ambient/overcast lighting'
}

// Semantic tokens (semantic/ColorTokens.ts) - purpose-based naming
'color.shadow.default': {
  primitiveReferences: { value: 'shadowBlack100' },
  description: 'Default shadow color for standard UI shadows'
}

'color.shadow.warm': {
  primitiveReferences: { value: 'shadowBlue100' },
  description: 'Warm shadow color for sunrise/sunset lighting'
}

'color.shadow.cool': {
  primitiveReferences: { value: 'shadowOrange100' },
  description: 'Cool shadow color for cool lighting environments'
}

'color.shadow.ambient': {
  primitiveReferences: { value: 'shadowGray100' },
  description: 'Ambient shadow color for overcast/ambient lighting'
}
```

**Mode-Agnostic Values**:

Shadow colors use identical values across light/dark modes and base/wcag themes because shadows are always dark regardless of theme. This is intentional and provides future flexibility:

- **Current State**: All modes/themes use the same shadow color values
- **Future Flexibility**: If design requirements change (e.g., lighter shadows in dark mode), the structure supports different values per mode without changing the architecture
- **Architectural Consistency**: Follows the same mode/theme structure as other color tokens, even though current values are identical

**Trade-offs**:

- ✅ **Gained**: Architectural consistency with all other color tokens
- ✅ **Gained**: Future flexibility for additional shadow color values (shadowBlack200, etc.)
- ✅ **Gained**: Clear separation between primitive (systematic) and semantic (purpose-based) naming
- ✅ **Gained**: Alignment with established color family patterns
- ❌ **Lost**: Slightly longer primitive token names (shadowBlack100 vs shadowDefault)
- ❌ **Lost**: Initial implementation work (requires refactoring)
- ⚠️ **Risk**: Minimal - semantic layer maintains simple naming for consumers

**Counter-Arguments**:

- **Argument**: "Purpose-based naming (shadowDefault, shadowWarm) is more intuitive at the primitive level"
- **Response**: Intuitive naming belongs in the semantic layer, which is where most developers will consume these tokens. Primitive tokens should follow systematic structure for architectural consistency. The semantic layer provides color.shadow.default, color.shadow.warm, etc. which are intuitive and purpose-based.

- **Argument**: "We only have one value per shadow color family, so numeric scales (100) are unnecessary"
- **Response**: The numeric scale provides future flexibility without breaking changes. If we later need shadowBlack200 for a lighter shadow variant, the architecture supports it. Starting with systematic structure is easier than refactoring later.

- **Argument**: "Identical values across modes/themes means we don't need the mode/theme structure"
- **Response**: The mode/theme structure provides future flexibility and architectural consistency. If design requirements change (e.g., lighter shadows in dark mode), the structure supports it without architectural changes. Consistency with other color tokens is more important than optimizing for current identical values.

**Implementation Impact**:

This decision requires refactoring tasks 2.3 and 2.4:
- Task 2.6: Refactor shadow color primitives to use color family structure
- Task 2.7: Update semantic shadow colors to reference new primitives
- Task 2.8: Update requirements document with new acceptance criteria

The refactoring maintains the same semantic token names (color.shadow.default, etc.) so consumers of the semantic layer are unaffected. Only the primitive token structure changes.

---

*This design document provides the technical architecture for implementing the Shadow and Glow token system aligned with the established DesignerPunk token system patterns.*
