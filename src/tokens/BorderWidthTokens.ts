/**
 * Border Width Token Definitions
 * 
 * Border width tokens follow a doubling progression with explicit mathematical relationships.
 * Base value: 1 unit
 * Mathematical progression: Doubling (1 → 2 → 4)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Border width token base value for mathematical calculations
 */
export const BORDER_WIDTH_BASE_VALUE = 1;

/**
 * Generate platform values for border width tokens
 */
function generateBorderWidthPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Border width tokens with doubling progression
 */
export const borderWidthTokens: Record<string, PrimitiveToken> = {
  borderWidth000: {
    name: 'borderWidth000',
    category: TokenCategory.BORDER_WIDTH,
    baseValue: 0,
    familyBaseValue: BORDER_WIDTH_BASE_VALUE,
    description: 'No border width - 0x base value. Used for borderless elements, removing borders.',
    mathematicalRelationship: 'base × 0 = 1 × 0 = 0',
    baselineGridAlignment: false, // Border widths don't require baseline grid alignment
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBorderWidthPlatformValues(0)
  },

  borderWidth100: {
    name: 'borderWidth100',
    category: TokenCategory.BORDER_WIDTH,
    baseValue: BORDER_WIDTH_BASE_VALUE,
    familyBaseValue: BORDER_WIDTH_BASE_VALUE,
    description: 'Base border width - 1x base value. Used for standard borders, default state.',
    mathematicalRelationship: 'base × 1 = 1 × 1 = 1',
    baselineGridAlignment: false, // Border widths don't require baseline grid alignment
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBorderWidthPlatformValues(BORDER_WIDTH_BASE_VALUE)
  },

  borderWidth200: {
    name: 'borderWidth200',
    category: TokenCategory.BORDER_WIDTH,
    baseValue: BORDER_WIDTH_BASE_VALUE * 2,
    familyBaseValue: BORDER_WIDTH_BASE_VALUE,
    description: 'Emphasized border width - 2x base value. Used for emphasized borders, active/focus states.',
    mathematicalRelationship: 'base × 2 = 1 × 2 = 2',
    baselineGridAlignment: false, // Border widths don't require baseline grid alignment
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBorderWidthPlatformValues(BORDER_WIDTH_BASE_VALUE * 2)
  },

  borderWidth400: {
    name: 'borderWidth400',
    category: TokenCategory.BORDER_WIDTH,
    baseValue: BORDER_WIDTH_BASE_VALUE * 4,
    familyBaseValue: BORDER_WIDTH_BASE_VALUE,
    description: 'Heavy border width - 4x base value. Used for heavy emphasis, strong visual weight (rare).',
    mathematicalRelationship: 'base × 4 = 1 × 4 = 4',
    baselineGridAlignment: false, // Border widths don't require baseline grid alignment
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBorderWidthPlatformValues(BORDER_WIDTH_BASE_VALUE * 4)
  }
};

/**
 * Array of all border width token names for iteration
 */
export const borderWidthTokenNames = Object.keys(borderWidthTokens);

/**
 * Get border width token by name
 */
export function getBorderWidthToken(name: string): PrimitiveToken | undefined {
  return borderWidthTokens[name];
}

/**
 * Get all border width tokens as array
 */
export function getAllBorderWidthTokens(): PrimitiveToken[] {
  return Object.values(borderWidthTokens);
}
