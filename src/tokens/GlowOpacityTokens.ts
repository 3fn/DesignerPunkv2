/**
 * Glow Opacity Token Definitions
 * 
 * Glow opacity tokens determine the transparency of glow effects.
 * Base value: 0.8 (unitless)
 * 
 * Glow opacity tokens use a decreasing progression to create multi-layer
 * glow effects where inner layers are more opaque and outer layers are
 * more transparent, creating a natural radial fade.
 * 
 * Decreasing progression:
 * - glowOpacity100: 0.8 (most opaque - inner layer)
 * - glowOpacity200: 0.6 (moderate opacity)
 * - glowOpacity300: 0.4 (lighter opacity)
 * - glowOpacity400: 0.2 (most transparent - outer layer)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Glow opacity base value for mathematical calculations
 */
export const GLOW_OPACITY_BASE_VALUE = 0.8;

/**
 * Generate platform values for glow opacity tokens
 */
function generateGlowOpacityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Glow opacity tokens
 * 
 * Decreasing opacity progression for multi-layer glow effects.
 * Inner layers (100) are more opaque, outer layers (400) are more transparent.
 */
export const glowOpacity: Record<string, PrimitiveToken> = {
  glowOpacity100: {
    name: 'glowOpacity100',
    category: TokenCategory.GLOW,
    baseValue: 0.8,
    familyBaseValue: GLOW_OPACITY_BASE_VALUE,
    description: 'Glow opacity 100 - most opaque (inner layer)',
    mathematicalRelationship: 'base × 1 = 0.8 × 1 = 0.8',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowOpacityPlatformValues(0.8)
  },

  glowOpacity200: {
    name: 'glowOpacity200',
    category: TokenCategory.GLOW,
    baseValue: 0.6,
    familyBaseValue: GLOW_OPACITY_BASE_VALUE,
    description: 'Glow opacity 200 - moderate opacity',
    mathematicalRelationship: 'base × 0.75 = 0.8 × 0.75 = 0.6',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowOpacityPlatformValues(0.6)
  },

  glowOpacity300: {
    name: 'glowOpacity300',
    category: TokenCategory.GLOW,
    baseValue: 0.4,
    familyBaseValue: GLOW_OPACITY_BASE_VALUE,
    description: 'Glow opacity 300 - lighter opacity',
    mathematicalRelationship: 'base × 0.5 = 0.8 × 0.5 = 0.4',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowOpacityPlatformValues(0.4)
  },

  glowOpacity400: {
    name: 'glowOpacity400',
    category: TokenCategory.GLOW,
    baseValue: 0.2,
    familyBaseValue: GLOW_OPACITY_BASE_VALUE,
    description: 'Glow opacity 400 - most transparent (outer layer)',
    mathematicalRelationship: 'base × 0.25 = 0.8 × 0.25 = 0.2',
    baselineGridAlignment: false, // Opacity is unitless
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowOpacityPlatformValues(0.2)
  }
};

/**
 * Array of all glow opacity token names for iteration
 */
export const glowOpacityNames = Object.keys(glowOpacity);

/**
 * Get glow opacity token by name
 */
export function getGlowOpacityToken(name: string): PrimitiveToken | undefined {
  return glowOpacity[name];
}

/**
 * Get all glow opacity tokens as array
 */
export function getAllGlowOpacityTokens(): PrimitiveToken[] {
  return Object.values(glowOpacity);
}
