/**
 * Glow Blur Token Definitions
 * 
 * Glow blur tokens determine the radial spread of glow effects.
 * Base value: 8 units (8px baseline grid alignment)
 * 
 * Glow blur tokens use an extended blur range compared to shadow blur tokens,
 * providing larger blur amounts suitable for emphasis and energy effects.
 * 
 * Scale progression:
 * - glowBlur100: 8px (base value)
 * - glowBlur200: 16px (base × 2)
 * - glowBlur300: 24px (base × 3)
 * - glowBlur400: 32px (base × 4)
 * - glowBlur500: 40px (base × 5)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Glow blur base value for mathematical calculations
 */
export const GLOW_BLUR_BASE_VALUE = 8;

/**
 * Generate platform values for glow blur tokens
 */
function generateGlowBlurPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Glow blur tokens
 * 
 * Extended blur range for radial glow effects that convey emphasis and energy.
 * Larger blur amounts than shadow tokens to create diffuse, radiant effects.
 */
export const glowBlur: Record<string, PrimitiveToken> = {
  glowBlur100: {
    name: 'glowBlur100',
    category: TokenCategory.GLOW,
    baseValue: GLOW_BLUR_BASE_VALUE,
    familyBaseValue: GLOW_BLUR_BASE_VALUE,
    description: 'Glow blur 100 - base glow blur value',
    mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
    baselineGridAlignment: true, // 8 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowBlurPlatformValues(GLOW_BLUR_BASE_VALUE)
  },

  glowBlur200: {
    name: 'glowBlur200',
    category: TokenCategory.GLOW,
    baseValue: GLOW_BLUR_BASE_VALUE * 2,
    familyBaseValue: GLOW_BLUR_BASE_VALUE,
    description: 'Glow blur 200 - moderate glow blur',
    mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
    baselineGridAlignment: true, // 16 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowBlurPlatformValues(GLOW_BLUR_BASE_VALUE * 2)
  },

  glowBlur300: {
    name: 'glowBlur300',
    category: TokenCategory.GLOW,
    baseValue: GLOW_BLUR_BASE_VALUE * 3,
    familyBaseValue: GLOW_BLUR_BASE_VALUE,
    description: 'Glow blur 300 - strong glow blur',
    mathematicalRelationship: 'base × 3 = 8 × 3 = 24',
    baselineGridAlignment: true, // 24 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowBlurPlatformValues(GLOW_BLUR_BASE_VALUE * 3)
  },

  glowBlur400: {
    name: 'glowBlur400',
    category: TokenCategory.GLOW,
    baseValue: GLOW_BLUR_BASE_VALUE * 4,
    familyBaseValue: GLOW_BLUR_BASE_VALUE,
    description: 'Glow blur 400 - intense glow blur',
    mathematicalRelationship: 'base × 4 = 8 × 4 = 32',
    baselineGridAlignment: true, // 32 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowBlurPlatformValues(GLOW_BLUR_BASE_VALUE * 4)
  },

  glowBlur500: {
    name: 'glowBlur500',
    category: TokenCategory.GLOW,
    baseValue: GLOW_BLUR_BASE_VALUE * 5,
    familyBaseValue: GLOW_BLUR_BASE_VALUE,
    description: 'Glow blur 500 - maximum glow blur',
    mathematicalRelationship: 'base × 5 = 8 × 5 = 40',
    baselineGridAlignment: true, // 40 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateGlowBlurPlatformValues(GLOW_BLUR_BASE_VALUE * 5)
  }
};

/**
 * Array of all glow blur token names for iteration
 */
export const glowBlurNames = Object.keys(glowBlur);

/**
 * Get glow blur token by name
 */
export function getGlowBlurToken(name: string): PrimitiveToken | undefined {
  return glowBlur[name];
}

/**
 * Get all glow blur tokens as array
 */
export function getAllGlowBlurTokens(): PrimitiveToken[] {
  return Object.values(glowBlur);
}
