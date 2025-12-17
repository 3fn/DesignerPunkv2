/**
 * Line Height Token Definitions
 * 
 * Line height tokens use precision multipliers to align with 8pt vertical rhythm
 * when combined with fontSize tokens. Base value: 1.5 (optimal reading ratio)
 * Mathematical progression: Precision-targeted multipliers for systematic alignment
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Line height token base value for mathematical calculations
 */
export const LINE_HEIGHT_BASE_VALUE = 1.5;

/**
 * Generate platform values for lineHeight tokens
 */
function generateLineHeightPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * LineHeight tokens with precision multipliers for 8pt vertical rhythm alignment
 */
export const lineHeightTokens: Record<string, PrimitiveToken> = {
  lineHeight050: {
    name: 'lineHeight050',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.538,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize050',
    mathematicalRelationship: 'fontSize050 × baseValue ≈ 20',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.538)
  },

  lineHeight075: {
    name: 'lineHeight075',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.429,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize075',
    mathematicalRelationship: 'fontSize075 × baseValue ≈ 20',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.429)
  },

  lineHeight100: {
    name: 'lineHeight100',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: LINE_HEIGHT_BASE_VALUE,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize100',
    mathematicalRelationship: 'fontSize100 × baseValue = 24',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(LINE_HEIGHT_BASE_VALUE)
  },

  lineHeight125: {
    name: 'lineHeight125',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.556,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize125',
    mathematicalRelationship: 'fontSize125 × baseValue ≈ 28',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.556)
  },

  lineHeight150: {
    name: 'lineHeight150',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.4,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize150',
    mathematicalRelationship: 'fontSize150 × baseValue = 28',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.4)
  },

  lineHeight200: {
    name: 'lineHeight200',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.391,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize200',
    mathematicalRelationship: 'fontSize200 × baseValue ≈ 32',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.391)
  },

  lineHeight300: {
    name: 'lineHeight300',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.231,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize300',
    mathematicalRelationship: 'fontSize300 × baseValue ≈ 32',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.231)
  },

  lineHeight400: {
    name: 'lineHeight400',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.241,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize400',
    mathematicalRelationship: 'fontSize400 × baseValue ≈ 36',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.241)
  },

  lineHeight500: {
    name: 'lineHeight500',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.212,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize500',
    mathematicalRelationship: 'fontSize500 × baseValue ≈ 40',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.212)
  },

  lineHeight600: {
    name: 'lineHeight600',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.19,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize600',
    mathematicalRelationship: 'fontSize600 × baseValue ≈ 44',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.19)
  },

  lineHeight700: {
    name: 'lineHeight700',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.143,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Line height paired with fontSize700',
    mathematicalRelationship: 'fontSize700 × baseValue ≈ 48',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.143)
  }
};

/**
 * Array of all line height token names for iteration
 */
export const lineHeightTokenNames = Object.keys(lineHeightTokens);

/**
 * Get line height token by name
 */
export function getLineHeightToken(name: string): PrimitiveToken | undefined {
  return lineHeightTokens[name];
}

/**
 * Get all line height tokens as array
 */
export function getAllLineHeightTokens(): PrimitiveToken[] {
  return Object.values(lineHeightTokens);
}

/**
 * Calculate computed line height for fontSize + lineHeight combination
 * This ensures proper 8pt vertical rhythm alignment
 */
export function calculateComputedLineHeight(fontSizeValue: number, lineHeightRatio: number): number {
  return fontSizeValue * lineHeightRatio;
}