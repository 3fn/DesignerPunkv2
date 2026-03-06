/**
 * Opacity Token Definitions
 * 
 * Opacity tokens follow 0.08 base value with 14-token scale (0-100%) in 8% increments.
 * Base value: 0.08 (8%)
 * Mathematical progression: Systematic multiples of base value
 * Naming: Three-digit zero-padded percentage values (opacity080 = 80%)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Opacity token base value for mathematical calculations
 */
export const OPACITY_BASE_VALUE = 0.08;

/**
 * Generate platform values for opacity tokens
 * All platforms use same unitless value (0.0 - 1.0)
 */
function generateOpacityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Opacity tokens with 14-token scale from 0% to 100% in 8% increments
 */
export const opacityTokens: Record<string, PrimitiveToken> = {
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

  opacity008: {
    name: 'opacity008',
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

  opacity016: {
    name: 'opacity016',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 2,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Light transparency - light overlay, pressed state',
    mathematicalRelationship: 'base × 2 = 0.08 × 2 = 0.16',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 2)
  },

  opacity024: {
    name: 'opacity024',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 3,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Medium-light transparency - medium-light overlay',
    mathematicalRelationship: 'base × 3 = 0.08 × 3 = 0.24',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 3)
  },

  opacity032: {
    name: 'opacity032',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 4,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Medium transparency - modal scrim, medium overlay',
    mathematicalRelationship: 'base × 4 = 0.08 × 4 = 0.32',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 4)
  },

  opacity040: {
    name: 'opacity040',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 5,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Strong transparency - strong overlay',
    mathematicalRelationship: 'base × 5 = 0.08 × 5 = 0.40',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 5)
  },

  opacity048: {
    name: 'opacity048',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 6,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Disabled state - faded, very strong overlay',
    mathematicalRelationship: 'base × 6 = 0.08 × 6 = 0.48',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 6)
  },

  opacity056: {
    name: 'opacity056',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 7,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Nearly opaque - subtle transparency',
    mathematicalRelationship: 'base × 7 = 0.08 × 7 = 0.56',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 7)
  },

  opacity064: {
    name: 'opacity064',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 8,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Very opaque - minimal transparency',
    mathematicalRelationship: 'base × 8 = 0.08 × 8 = 0.64',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 8)
  },

  opacity072: {
    name: 'opacity072',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 9,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Extremely opaque - very minimal transparency',
    mathematicalRelationship: 'base × 9 = 0.08 × 9 = 0.72',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 9)
  },

  opacity080: {
    name: 'opacity080',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 10,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Nearly full opacity - barely visible transparency',
    mathematicalRelationship: 'base × 10 = 0.08 × 10 = 0.80',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 10)
  },

  opacity088: {
    name: 'opacity088',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 11,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Subtle transparency - almost fully opaque',
    mathematicalRelationship: 'base × 11 = 0.08 × 11 = 0.88',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 11)
  },

  opacity096: {
    name: 'opacity096',
    category: TokenCategory.OPACITY,
    baseValue: OPACITY_BASE_VALUE * 12,
    familyBaseValue: OPACITY_BASE_VALUE,
    description: 'Almost fully opaque - imperceptible transparency',
    mathematicalRelationship: 'base × 12 = 0.08 × 12 = 0.96',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateOpacityPlatformValues(OPACITY_BASE_VALUE * 12)
  },

  opacity100: {
    name: 'opacity100',
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

/**
 * Array of all opacity token names for iteration
 */
export const opacityTokenNames = Object.keys(opacityTokens);

/**
 * Get opacity token by name
 */
export function getOpacityToken(name: string): PrimitiveToken | undefined {
  return opacityTokens[name];
}

/**
 * Get all opacity tokens as array
 */
export function getAllOpacityTokens(): PrimitiveToken[] {
  return Object.values(opacityTokens);
}
