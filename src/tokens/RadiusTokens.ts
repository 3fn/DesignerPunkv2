/**
 * Radius Token Definitions
 * 
 * Radius tokens follow 8-unit baseline grid alignment with strategic flexibility exceptions.
 * Base value: 8 units
 * Mathematical progression: Systematic multiples of base value with strategic flexibility tokens
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Radius token base value for mathematical calculations
 */
export const RADIUS_BASE_VALUE = 8;

/**
 * Generate platform values for radius tokens
 */
function generateRadiusPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Radius tokens with 8-unit baseline grid alignment and strategic flexibility
 */
export const radiusTokens: Record<string, PrimitiveToken> = {
  radius000: {
    name: 'radius000',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 0,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'No radius - sharp corners',
    mathematicalRelationship: 'base × 0 = 8 × 0 = 0',
    baselineGridAlignment: true, // 0 is baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 0)
  },

  radius025: {
    name: 'radius025',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 0.25,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Subtle radius - 0.25x base value',
    mathematicalRelationship: 'base × 0.25 = 8 × 0.25 = 2',
    baselineGridAlignment: false, // 2 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 0.25)
  },

  radius050: {
    name: 'radius050',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 0.5,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Small radius - 0.5x base value',
    mathematicalRelationship: 'base × 0.5 = 8 × 0.5 = 4',
    baselineGridAlignment: false, // 4 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 0.5)
  },

  radius075: {
    name: 'radius075',
    category: TokenCategory.RADIUS,
    baseValue: 6,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Medium-small radius - 0.75x base value (strategic flexibility)',
    mathematicalRelationship: 'base × 0.75 = 8 × 0.75 = 6',
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(6)
  },

  radius100: {
    name: 'radius100',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Base radius - 1x base value',
    mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
    baselineGridAlignment: true, // 8 is baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE)
  },

  radius125: {
    name: 'radius125',
    category: TokenCategory.RADIUS,
    baseValue: 10,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Medium radius - 1.25x base value (strategic flexibility)',
    mathematicalRelationship: 'base × 1.25 = 8 × 1.25 = 10',
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(10)
  },

  radius150: {
    name: 'radius150',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 1.5,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Medium-large radius - 1.5x base value',
    mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12',
    baselineGridAlignment: false, // 12 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 1.5)
  },

  radius200: {
    name: 'radius200',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 2,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Large radius - 2x base value',
    mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
    baselineGridAlignment: true, // 16 is baseline grid aligned (8 × 2)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 2)
  },

  radius250: {
    name: 'radius250',
    category: TokenCategory.RADIUS,
    baseValue: 20,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Extra large radius - 2.5x base value (strategic flexibility)',
    mathematicalRelationship: 'base × 2.5 = 8 × 2.5 = 20',
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(20)
  },

  radius300: {
    name: 'radius300',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 3,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Huge radius - 3x base value',
    mathematicalRelationship: 'base × 3 = 8 × 3 = 24',
    baselineGridAlignment: true, // 24 is baseline grid aligned (8 × 3)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 3)
  },

  radius400: {
    name: 'radius400',
    category: TokenCategory.RADIUS,
    baseValue: RADIUS_BASE_VALUE * 4,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Maximum radius - 4x base value',
    mathematicalRelationship: 'base × 4 = 8 × 4 = 32',
    baselineGridAlignment: true, // 32 is baseline grid aligned (8 × 4)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(RADIUS_BASE_VALUE * 4)
  },

  radiusFull: {
    name: 'radiusFull',
    category: TokenCategory.RADIUS,
    baseValue: 9999,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Full radius - creates perfect circles/pills',
    mathematicalRelationship: 'special case = 9999 (effectively infinite)',
    baselineGridAlignment: false, // Special case for full radius
    isStrategicFlexibility: true, // Special strategic flexibility for full radius
    isPrecisionTargeted: false,
    platforms: generateRadiusPlatformValues(9999)
  },

  radiusHalf: {
    name: 'radiusHalf',
    category: TokenCategory.RADIUS,
    baseValue: 50,
    familyBaseValue: RADIUS_BASE_VALUE,
    description: 'Half radius (50%) - creates perfect circles when applied to square elements. Used for circular buttons, avatars, badges, and other circular UI elements.',
    mathematicalRelationship: 'percentage = 50% (creates circle from square)',
    baselineGridAlignment: false, // Percentage-based, not pixel-based
    isStrategicFlexibility: true, // Special strategic flexibility for percentage-based radius
    isPrecisionTargeted: false,
    platforms: {
      web: { value: '50%', unit: '%' },
      ios: { value: 'Circle', unit: 'shape' },
      android: { value: 50, unit: 'percent' }
    }
  }
};

/**
 * Array of all radius token names for iteration
 */
export const radiusTokenNames = Object.keys(radiusTokens);

/**
 * Get radius token by name
 */
export function getRadiusToken(name: string): PrimitiveToken | undefined {
  return radiusTokens[name];
}

/**
 * Get all radius tokens as array
 */
export function getAllRadiusTokens(): PrimitiveToken[] {
  return Object.values(radiusTokens);
}

/**
 * Get radius tokens by baseline grid alignment
 */
export function getBaselineAlignedRadiusTokens(): PrimitiveToken[] {
  return Object.values(radiusTokens).filter(token => token.baselineGridAlignment);
}

/**
 * Get strategic flexibility radius tokens
 */
export function getStrategicFlexibilityRadiusTokens(): PrimitiveToken[] {
  return Object.values(radiusTokens).filter(token => token.isStrategicFlexibility);
}