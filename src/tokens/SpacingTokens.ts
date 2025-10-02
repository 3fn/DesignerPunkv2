/**
 * Spacing Token Definitions
 * 
 * Spacing tokens follow 8-unit baseline grid alignment with strategic flexibility exceptions.
 * Base value: 8 units
 * Mathematical progression: Systematic multiples of base value with strategic flexibility tokens
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';
import { STRATEGIC_FLEXIBILITY_TOKENS } from '../constants/StrategicFlexibilityTokens';

/**
 * Spacing token base value for mathematical calculations
 */
export const SPACING_BASE_VALUE = 8;

/**
 * Generate platform values for spacing tokens
 */
function generateSpacingPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Spacing tokens with 8-unit baseline grid alignment and strategic flexibility
 */
export const spacingTokens: Record<string, PrimitiveToken> = {
  space025: {
    name: 'space025',
    category: TokenCategory.SPACING,
    baseValue: 2,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Extra tight spacing - 0.25x base value',
    mathematicalRelationship: 'base × 0.25 = 8 × 0.25 = 2',
    baselineGridAlignment: false, // 2 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(2)
  },

  space050: {
    name: 'space050',
    category: TokenCategory.SPACING,
    baseValue: 4,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Tight spacing - 0.5x base value',
    mathematicalRelationship: 'base × 0.5 = 8 × 0.5 = 4',
    baselineGridAlignment: false, // 4 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(4)
  },

  space075: {
    name: 'space075',
    category: TokenCategory.SPACING,
    baseValue: STRATEGIC_FLEXIBILITY_TOKENS.space075.value,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Strategic flexibility spacing - 0.75x base value',
    mathematicalRelationship: STRATEGIC_FLEXIBILITY_TOKENS.space075.derivation,
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(STRATEGIC_FLEXIBILITY_TOKENS.space075.value)
  },

  space100: {
    name: 'space100',
    category: TokenCategory.SPACING,
    baseValue: SPACING_BASE_VALUE,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Base spacing - 1x base value',
    mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
    baselineGridAlignment: true, // 8 is baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(SPACING_BASE_VALUE)
  },

  space125: {
    name: 'space125',
    category: TokenCategory.SPACING,
    baseValue: STRATEGIC_FLEXIBILITY_TOKENS.space125.value,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Strategic flexibility spacing - 1.25x base value',
    mathematicalRelationship: STRATEGIC_FLEXIBILITY_TOKENS.space125.derivation,
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(STRATEGIC_FLEXIBILITY_TOKENS.space125.value)
  },

  space150: {
    name: 'space150',
    category: TokenCategory.SPACING,
    baseValue: 12,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Loose spacing - 1.5x base value',
    mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12',
    baselineGridAlignment: false, // 12 is not 8-unit aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(12)
  },

  space200: {
    name: 'space200',
    category: TokenCategory.SPACING,
    baseValue: 16,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Wide spacing - 2x base value',
    mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
    baselineGridAlignment: true, // 16 is baseline grid aligned (8 × 2)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(16)
  },

  space250: {
    name: 'space250',
    category: TokenCategory.SPACING,
    baseValue: STRATEGIC_FLEXIBILITY_TOKENS.space250.value,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Strategic flexibility spacing - 2.5x base value',
    mathematicalRelationship: STRATEGIC_FLEXIBILITY_TOKENS.space250.derivation,
    baselineGridAlignment: false, // Strategic flexibility exception
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(STRATEGIC_FLEXIBILITY_TOKENS.space250.value)
  },

  space300: {
    name: 'space300',
    category: TokenCategory.SPACING,
    baseValue: 24,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Extra wide spacing - 3x base value',
    mathematicalRelationship: 'base × 3 = 8 × 3 = 24',
    baselineGridAlignment: true, // 24 is baseline grid aligned (8 × 3)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(24)
  },

  space400: {
    name: 'space400',
    category: TokenCategory.SPACING,
    baseValue: 32,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Large spacing - 4x base value',
    mathematicalRelationship: 'base × 4 = 8 × 4 = 32',
    baselineGridAlignment: true, // 32 is baseline grid aligned (8 × 4)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(32)
  },

  space500: {
    name: 'space500',
    category: TokenCategory.SPACING,
    baseValue: 40,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Extra large spacing - 5x base value',
    mathematicalRelationship: 'base × 5 = 8 × 5 = 40',
    baselineGridAlignment: true, // 40 is baseline grid aligned (8 × 5)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(40)
  },

  space600: {
    name: 'space600',
    category: TokenCategory.SPACING,
    baseValue: 48,
    familyBaseValue: SPACING_BASE_VALUE,
    description: 'Huge spacing - 6x base value',
    mathematicalRelationship: 'base × 6 = 8 × 6 = 48',
    baselineGridAlignment: true, // 48 is baseline grid aligned (8 × 6)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateSpacingPlatformValues(48)
  }
};

/**
 * Array of all spacing token names for iteration
 */
export const spacingTokenNames = Object.keys(spacingTokens);

/**
 * Get spacing token by name
 */
export function getSpacingToken(name: string): PrimitiveToken | undefined {
  return spacingTokens[name];
}

/**
 * Get all spacing tokens as array
 */
export function getAllSpacingTokens(): PrimitiveToken[] {
  return Object.values(spacingTokens);
}