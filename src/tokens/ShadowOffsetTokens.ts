/**
 * Shadow Offset Token Definitions
 * 
 * Shadow offset tokens determine shadow direction based on light source position (sun arc).
 * Base value: 4 units (4px baseline grid alignment)
 * 
 * X-axis offsets (horizontal direction):
 * - Negative values: Sunrise/morning shadows (shadow falls left)
 * - Zero value: Noon shadows (no horizontal offset)
 * - Positive values: Afternoon/sunset shadows (shadow falls right)
 * 
 * Y-axis offsets (vertical direction):
 * - All positive values (shadows fall downward)
 * - Values scale with depth (greater depth = larger offset)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Shadow offset base value for mathematical calculations
 */
export const SHADOW_OFFSET_BASE_VALUE = 4;

/**
 * Generate platform values for shadow offset tokens
 */
function generateShadowOffsetPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Shadow offset X tokens (horizontal direction)
 * 
 * Naming convention:
 * - n300, n150, n100: Negative values for sunrise/morning (shadow falls left)
 * - 000: Zero value for noon (no horizontal offset)
 * - 100, 150, 300: Positive values for afternoon/sunset (shadow falls right)
 */
export const shadowOffsetX: Record<string, PrimitiveToken> = {
  n300: {
    name: 'shadowOffsetX.n300',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * -3,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Sunrise shadow offset - large left offset',
    mathematicalRelationship: 'base × -3 = 4 × -3 = -12',
    baselineGridAlignment: true, // 12 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * -3)
  },

  n200: {
    name: 'shadowOffsetX.n200',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * -2,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Strategic flexibility - medium-large left offset',
    mathematicalRelationship: 'base × -2 = 4 × -2 = -8',
    baselineGridAlignment: true, // 8 is 4px baseline grid aligned
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * -2)
  },

  n150: {
    name: 'shadowOffsetX.n150',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * -1.5,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Morning shadow offset - medium left offset',
    mathematicalRelationship: 'base × -1.5 = 4 × -1.5 = -6',
    baselineGridAlignment: false, // 6 is not 4px baseline grid aligned (strategic flexibility)
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * -1.5)
  },

  n100: {
    name: 'shadowOffsetX.n100',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * -1,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Strategic flexibility - small left offset',
    mathematicalRelationship: 'base × -1 = 4 × -1 = -4',
    baselineGridAlignment: true, // 4 is 4px baseline grid aligned
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * -1)
  },

  '000': {
    name: 'shadowOffsetX.000',
    category: TokenCategory.SHADOW,
    baseValue: 0,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Noon shadow offset - no horizontal offset',
    mathematicalRelationship: 'base × 0 = 4 × 0 = 0',
    baselineGridAlignment: true, // 0 is baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(0)
  },

  '100': {
    name: 'shadowOffsetX.100',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Strategic flexibility - small right offset',
    mathematicalRelationship: 'base × 1 = 4 × 1 = 4',
    baselineGridAlignment: true, // 4 is 4px baseline grid aligned
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE)
  },

  '150': {
    name: 'shadowOffsetX.150',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 1.5,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Afternoon shadow offset - medium right offset',
    mathematicalRelationship: 'base × 1.5 = 4 × 1.5 = 6',
    baselineGridAlignment: false, // 6 is not 4px baseline grid aligned (strategic flexibility)
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 1.5)
  },

  '200': {
    name: 'shadowOffsetX.200',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 2,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Strategic flexibility - medium-large right offset',
    mathematicalRelationship: 'base × 2 = 4 × 2 = 8',
    baselineGridAlignment: true, // 8 is 4px baseline grid aligned
    isStrategicFlexibility: true,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 2)
  },

  '300': {
    name: 'shadowOffsetX.300',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 3,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Sunset shadow offset - large right offset',
    mathematicalRelationship: 'base × 3 = 4 × 3 = 12',
    baselineGridAlignment: true, // 12 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 3)
  }
};

/**
 * Shadow offset Y tokens (vertical direction)
 * 
 * All Y offsets are positive (shadows fall downward).
 * Values scale with depth:
 * - 100: Depth 100 / Noon - short shadow
 * - 200: Depth 200 - medium shadow
 * - 300: Morning/Afternoon - medium-long shadow
 * - 400: Depth 300 / Sunrise/Sunset - long shadow
 */
export const shadowOffsetY: Record<string, PrimitiveToken> = {
  '100': {
    name: 'shadowOffsetY.100',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Depth 100 / Noon - short shadow',
    mathematicalRelationship: 'base × 1 = 4 × 1 = 4',
    baselineGridAlignment: true, // 4 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE)
  },

  '200': {
    name: 'shadowOffsetY.200',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 2,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Depth 200 - medium shadow',
    mathematicalRelationship: 'base × 2 = 4 × 2 = 8',
    baselineGridAlignment: true, // 8 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 2)
  },

  '300': {
    name: 'shadowOffsetY.300',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 3,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Morning/Afternoon - medium-long shadow',
    mathematicalRelationship: 'base × 3 = 4 × 3 = 12',
    baselineGridAlignment: true, // 12 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 3)
  },

  '400': {
    name: 'shadowOffsetY.400',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_OFFSET_BASE_VALUE * 4,
    familyBaseValue: SHADOW_OFFSET_BASE_VALUE,
    description: 'Depth 300 / Sunrise/Sunset - long shadow',
    mathematicalRelationship: 'base × 4 = 4 × 4 = 16',
    baselineGridAlignment: true, // 16 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowOffsetPlatformValues(SHADOW_OFFSET_BASE_VALUE * 4)
  }
};

/**
 * Array of all shadow offset X token names for iteration
 */
export const shadowOffsetXNames = Object.keys(shadowOffsetX);

/**
 * Array of all shadow offset Y token names for iteration
 */
export const shadowOffsetYNames = Object.keys(shadowOffsetY);

/**
 * Get shadow offset X token by name
 */
export function getShadowOffsetXToken(name: string): PrimitiveToken | undefined {
  return shadowOffsetX[name];
}

/**
 * Get shadow offset Y token by name
 */
export function getShadowOffsetYToken(name: string): PrimitiveToken | undefined {
  return shadowOffsetY[name];
}

/**
 * Get all shadow offset X tokens as array
 */
export function getAllShadowOffsetXTokens(): PrimitiveToken[] {
  return Object.values(shadowOffsetX);
}

/**
 * Get all shadow offset Y tokens as array
 */
export function getAllShadowOffsetYTokens(): PrimitiveToken[] {
  return Object.values(shadowOffsetY);
}
