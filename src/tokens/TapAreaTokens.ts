/**
 * Tap Area Token Definitions
 * 
 * Tap area tokens use precision multipliers to achieve specific accessibility targets
 * while maintaining baseline grid alignment where possible.
 * Base value: 44 units (WCAG 2.1 AA minimum tap target size)
 * Mathematical progression: Precision-targeted multipliers for accessibility compliance
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Tap area token base value for mathematical calculations (WCAG 2.1 AA minimum)
 */
export const TAP_AREA_BASE_VALUE = 44;

/**
 * Generate platform values for tapArea tokens
 */
function generateTapAreaPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * TapArea tokens with precision multipliers for accessibility targets
 */
export const tapAreaTokens: Record<string, PrimitiveToken> = {
  tapAreaMinimum: {
    name: 'tapAreaMinimum',
    category: TokenCategory.TAP_AREA,
    baseValue: TAP_AREA_BASE_VALUE,
    familyBaseValue: TAP_AREA_BASE_VALUE,
    description: 'Minimum tap area - WCAG 2.1 AA compliance (44pt)',
    mathematicalRelationship: 'base × 1 = 44 × 1 = 44',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for accessibility targets
    platforms: generateTapAreaPlatformValues(TAP_AREA_BASE_VALUE)
  },

  tapAreaRecommended: {
    name: 'tapAreaRecommended',
    category: TokenCategory.TAP_AREA,
    baseValue: Math.round(TAP_AREA_BASE_VALUE * 1.09), // ~48pt for better usability
    familyBaseValue: TAP_AREA_BASE_VALUE,
    description: 'Recommended tap area - enhanced usability (48pt)',
    mathematicalRelationship: 'base × 1.09 = 44 × 1.09 ≈ 48',
    baselineGridAlignment: true, // 48 aligns with 8-unit grid (8 × 6)
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for accessibility targets
    platforms: generateTapAreaPlatformValues(48)
  },

  tapAreaComfortable: {
    name: 'tapAreaComfortable',
    category: TokenCategory.TAP_AREA,
    baseValue: Math.round(TAP_AREA_BASE_VALUE * 1.27), // ~56pt for comfortable interaction
    familyBaseValue: TAP_AREA_BASE_VALUE,
    description: 'Comfortable tap area - spacious interaction (56pt)',
    mathematicalRelationship: 'base × 1.27 = 44 × 1.27 ≈ 56',
    baselineGridAlignment: true, // 56 aligns with 8-unit grid (8 × 7)
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for accessibility targets
    platforms: generateTapAreaPlatformValues(56)
  },

  tapAreaGenerous: {
    name: 'tapAreaGenerous',
    category: TokenCategory.TAP_AREA,
    baseValue: Math.round(TAP_AREA_BASE_VALUE * 1.45), // ~64pt for generous interaction
    familyBaseValue: TAP_AREA_BASE_VALUE,
    description: 'Generous tap area - extra spacious interaction (64pt)',
    mathematicalRelationship: 'base × 1.45 = 44 × 1.45 ≈ 64',
    baselineGridAlignment: true, // 64 aligns with 8-unit grid (8 × 8)
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision multiplier for accessibility targets
    platforms: generateTapAreaPlatformValues(64)
  }
};

/**
 * Array of all tap area token names for iteration
 */
export const tapAreaTokenNames = Object.keys(tapAreaTokens);

/**
 * Get tap area token by name
 */
export function getTapAreaToken(name: string): PrimitiveToken | undefined {
  return tapAreaTokens[name];
}

/**
 * Get all tap area tokens as array
 */
export function getAllTapAreaTokens(): PrimitiveToken[] {
  return Object.values(tapAreaTokens);
}

/**
 * Validate tap area meets accessibility requirements
 */
export function validateTapAreaAccessibility(tapAreaValue: number): {
  isAccessible: boolean;
  level: 'AA' | 'AAA' | 'Below AA';
  recommendation?: string;
} {
  if (tapAreaValue >= 44) {
    if (tapAreaValue >= 48) {
      return { isAccessible: true, level: 'AAA' };
    }
    return { isAccessible: true, level: 'AA' };
  }

  return {
    isAccessible: false,
    level: 'Below AA',
    recommendation: `Increase tap area to at least ${TAP_AREA_BASE_VALUE}pt for WCAG 2.1 AA compliance`
  };
}