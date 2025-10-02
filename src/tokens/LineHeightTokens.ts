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
    baseValue: 1.0,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Tight line height - precision multiplier for dense text',
    mathematicalRelationship: 'base × 0.667 = 1.5 × 0.667 ≈ 1.0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.0)
  },

  lineHeight075: {
    name: 'lineHeight075',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.25,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Compact line height - precision multiplier for readable text',
    mathematicalRelationship: 'base × 0.833 = 1.5 × 0.833 ≈ 1.25',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.25)
  },

  lineHeight100: {
    name: 'lineHeight100',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: LINE_HEIGHT_BASE_VALUE,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Base line height - optimal for body text',
    mathematicalRelationship: 'base × 1 = 1.5 × 1 = 1.5',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(LINE_HEIGHT_BASE_VALUE)
  },

  lineHeight125: {
    name: 'lineHeight125',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 1.75,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Loose line height - precision multiplier for comfortable reading',
    mathematicalRelationship: 'base × 1.167 = 1.5 × 1.167 ≈ 1.75',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(1.75)
  },

  lineHeight150: {
    name: 'lineHeight150',
    category: TokenCategory.LINE_HEIGHT,
    baseValue: 2.0,
    familyBaseValue: LINE_HEIGHT_BASE_VALUE,
    description: 'Extra loose line height - precision multiplier for spacious text',
    mathematicalRelationship: 'base × 1.333 = 1.5 × 1.333 = 2.0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
    platforms: generateLineHeightPlatformValues(2.0)
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