/**
 * Font Weight Token Definitions
 * 
 * Font weight tokens follow standard numeric font weight values.
 * Base value: 400 (normal weight)
 * Mathematical progression: Standard font weight increments
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Font weight token base value for mathematical calculations
 */
export const FONT_WEIGHT_BASE_VALUE = 400;

/**
 * Generate platform values for font weight tokens (numeric across all platforms)
 */
function generateFontWeightPlatformValues(weight: number): PlatformValues {
  return {
    web: { value: weight, unit: 'fontWeight' },
    ios: { value: weight, unit: 'fontWeight' },
    android: { value: weight, unit: 'fontWeight' }
  };
}

/**
 * Font weight tokens with standard numeric progression
 */
export const fontWeightTokens: Record<string, PrimitiveToken> = {
  fontWeight100: {
    name: 'fontWeight100',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 100,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Thin font weight',
    mathematicalRelationship: 'base × 0.25 = 400 × 0.25 = 100',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(100)
  },

  fontWeight200: {
    name: 'fontWeight200',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 200,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Extra light font weight',
    mathematicalRelationship: 'base × 0.5 = 400 × 0.5 = 200',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(200)
  },

  fontWeight300: {
    name: 'fontWeight300',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 300,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Light font weight',
    mathematicalRelationship: 'base × 0.75 = 400 × 0.75 = 300',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(300)
  },

  fontWeight400: {
    name: 'fontWeight400',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: FONT_WEIGHT_BASE_VALUE,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Normal font weight - base unit',
    mathematicalRelationship: 'base × 1 = 400 × 1 = 400',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(FONT_WEIGHT_BASE_VALUE)
  },

  fontWeight500: {
    name: 'fontWeight500',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 500,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Medium font weight',
    mathematicalRelationship: 'base × 1.25 = 400 × 1.25 = 500',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(500)
  },

  fontWeight600: {
    name: 'fontWeight600',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 600,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Semi-bold font weight',
    mathematicalRelationship: 'base × 1.5 = 400 × 1.5 = 600',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(600)
  },

  fontWeight700: {
    name: 'fontWeight700',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 700,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Bold font weight',
    mathematicalRelationship: 'base × 1.75 = 400 × 1.75 = 700',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(700)
  },

  fontWeight800: {
    name: 'fontWeight800',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 800,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Extra bold font weight',
    mathematicalRelationship: 'base × 2 = 400 × 2 = 800',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(800)
  },

  fontWeight900: {
    name: 'fontWeight900',
    category: TokenCategory.FONT_WEIGHT,
    baseValue: 900,
    familyBaseValue: FONT_WEIGHT_BASE_VALUE,
    description: 'Black font weight',
    mathematicalRelationship: 'base × 2.25 = 400 × 2.25 = 900',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontWeightPlatformValues(900)
  }
};

/**
 * Array of all font weight token names for iteration
 */
export const fontWeightTokenNames = Object.keys(fontWeightTokens);

/**
 * Get font weight token by name
 */
export function getFontWeightToken(name: string): PrimitiveToken | undefined {
  return fontWeightTokens[name];
}

/**
 * Get all font weight tokens as array
 */
export function getAllFontWeightTokens(): PrimitiveToken[] {
  return Object.values(fontWeightTokens);
}