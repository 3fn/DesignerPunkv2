/**
 * Shadow Blur Token Definitions
 * 
 * Shadow blur tokens determine edge definition based on shadow quality and depth.
 * Base value: 4 units (4px baseline grid alignment)
 * 
 * Quality-based blur tokens:
 * - shadowBlurHard: Sharp, defined edges (4px)
 * - shadowBlurModerate: Balanced definition (12px)
 * - shadowBlurSoft: Diffuse, gentle edges (20px)
 * 
 * Depth-based blur tokens:
 * - shadowBlurDepth200: Increased blur for raised elements (16px)
 * - shadowBlurDepth300: Maximum blur for floating elements (24px)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Shadow blur base value for mathematical calculations
 */
export const SHADOW_BLUR_BASE_VALUE = 4;

/**
 * Generate platform values for shadow blur tokens
 */
function generateShadowBlurPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Shadow blur tokens
 * 
 * Quality-based tokens define edge characteristics:
 * - Hard: Sharp, defined edges for strong shadows
 * - Moderate: Balanced definition for standard shadows
 * - Soft: Diffuse, gentle edges for subtle shadows
 * 
 * Depth-based tokens provide blur adjustments for elevation:
 * - Depth200: Increased blur for raised elements
 * - Depth300: Maximum blur for floating elements
 */
export const shadowBlur: Record<string, PrimitiveToken> = {
  shadowBlurHard: {
    name: 'shadowBlurHard',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_BLUR_BASE_VALUE,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Hard shadow blur - sharp, defined edges',
    mathematicalRelationship: 'base × 1 = 4 × 1 = 4',
    baselineGridAlignment: true, // 4 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(SHADOW_BLUR_BASE_VALUE)
  },

  shadowBlurModerate: {
    name: 'shadowBlurModerate',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_BLUR_BASE_VALUE * 3,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Moderate shadow blur - balanced definition',
    mathematicalRelationship: 'base × 3 = 4 × 3 = 12',
    baselineGridAlignment: true, // 12 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(SHADOW_BLUR_BASE_VALUE * 3)
  },

  shadowBlurSoft: {
    name: 'shadowBlurSoft',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_BLUR_BASE_VALUE * 5,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Soft shadow blur - diffuse, gentle edges',
    mathematicalRelationship: 'base × 5 = 4 × 5 = 20',
    baselineGridAlignment: true, // 20 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(SHADOW_BLUR_BASE_VALUE * 5)
  },

  shadowBlurDepth200: {
    name: 'shadowBlurDepth200',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_BLUR_BASE_VALUE * 4,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Depth 200 blur adjustment - increased blur for raised elements',
    mathematicalRelationship: 'base × 4 = 4 × 4 = 16',
    baselineGridAlignment: true, // 16 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(SHADOW_BLUR_BASE_VALUE * 4)
  },

  shadowBlurDepth300: {
    name: 'shadowBlurDepth300',
    category: TokenCategory.SHADOW,
    baseValue: SHADOW_BLUR_BASE_VALUE * 6,
    familyBaseValue: SHADOW_BLUR_BASE_VALUE,
    description: 'Depth 300 blur adjustment - maximum blur for floating elements',
    mathematicalRelationship: 'base × 6 = 4 × 6 = 24',
    baselineGridAlignment: true, // 24 is 4px baseline grid aligned
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateShadowBlurPlatformValues(SHADOW_BLUR_BASE_VALUE * 6)
  }
};

/**
 * Array of all shadow blur token names for iteration
 */
export const shadowBlurNames = Object.keys(shadowBlur);

/**
 * Get shadow blur token by name
 */
export function getShadowBlurToken(name: string): PrimitiveToken | undefined {
  return shadowBlur[name];
}

/**
 * Get all shadow blur tokens as array
 */
export function getAllShadowBlurTokens(): PrimitiveToken[] {
  return Object.values(shadowBlur);
}
