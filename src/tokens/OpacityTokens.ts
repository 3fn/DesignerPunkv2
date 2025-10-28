/**
 * Opacity Token Definitions
 * 
 * Opacity tokens follow 0.08 base value with 13-token scale (0-100%) in 8% increments.
 * Base value: 0.08 (8%)
 * Mathematical progression: Systematic multiples of base value
 * Scale notation: opacity100 = 1 × base, opacity200 = 2 × base, etc.
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
 * Opacity tokens with 13-token scale from 0% to 100% in 8% increments
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

  opacity200: {
    name: 'opacity200',
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

  opacity300: {
    name: 'opacity300',
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

  opacity400: {
    name: 'opacity400',
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

  opacity500: {
    name: 'opacity500',
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

  opacity600: {
    name: 'opacity600',
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

  opacity700: {
    name: 'opacity700',
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

  opacity800: {
    name: 'opacity800',
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

  opacity900: {
    name: 'opacity900',
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

  opacity1000: {
    name: 'opacity1000',
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

  opacity1100: {
    name: 'opacity1100',
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

  opacity1200: {
    name: 'opacity1200',
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
