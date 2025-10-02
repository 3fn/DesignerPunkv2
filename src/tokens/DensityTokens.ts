/**
 * Density Token Definitions
 * 
 * Density tokens provide selective scaling for functional tokens (spacing, typography, tap areas)
 * while leaving aesthetic tokens (radius, line height ratios) unchanged.
 * Base value: 1.0 (no scaling applied)
 * Mathematical progression: Multipliers for functional token scaling
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Density token base value for mathematical calculations
 */
export const DENSITY_BASE_VALUE = 1.0;

/**
 * Generate platform values for density tokens
 */
function generateDensityPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Density tokens with selective application to functional tokens
 */
export const densityTokens: Record<string, PrimitiveToken> = {
  densityCompact: {
    name: 'densityCompact',
    category: TokenCategory.DENSITY,
    baseValue: 0.75,
    familyBaseValue: DENSITY_BASE_VALUE,
    description: 'Compact density - reduces functional token values by 25%',
    mathematicalRelationship: 'base × 0.75 = 1.0 × 0.75 = 0.75',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Selective application to functional tokens
    platforms: generateDensityPlatformValues(0.75)
  },

  densityDefault: {
    name: 'densityDefault',
    category: TokenCategory.DENSITY,
    baseValue: DENSITY_BASE_VALUE,
    familyBaseValue: DENSITY_BASE_VALUE,
    description: 'Default density - no scaling applied',
    mathematicalRelationship: 'base × 1 = 1.0 × 1 = 1.0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Selective application to functional tokens
    platforms: generateDensityPlatformValues(DENSITY_BASE_VALUE)
  },

  densityComfortable: {
    name: 'densityComfortable',
    category: TokenCategory.DENSITY,
    baseValue: 1.25,
    familyBaseValue: DENSITY_BASE_VALUE,
    description: 'Comfortable density - increases functional token values by 25%',
    mathematicalRelationship: 'base × 1.25 = 1.0 × 1.25 = 1.25',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Selective application to functional tokens
    platforms: generateDensityPlatformValues(1.25)
  },

  densitySpacious: {
    name: 'densitySpacious',
    category: TokenCategory.DENSITY,
    baseValue: 1.5,
    familyBaseValue: DENSITY_BASE_VALUE,
    description: 'Spacious density - increases functional token values by 50%',
    mathematicalRelationship: 'base × 1.5 = 1.0 × 1.5 = 1.5',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Selective application to functional tokens
    platforms: generateDensityPlatformValues(1.5)
  }
};

/**
 * Array of all density token names for iteration
 */
export const densityTokenNames = Object.keys(densityTokens);

/**
 * Get density token by name
 */
export function getDensityToken(name: string): PrimitiveToken | undefined {
  return densityTokens[name];
}

/**
 * Get all density tokens as array
 */
export function getAllDensityTokens(): PrimitiveToken[] {
  return Object.values(densityTokens);
}

/**
 * Apply density scaling to functional token values
 * Functional tokens: spacing, fontSize, tapArea
 * Aesthetic tokens (radius, lineHeight ratios) are NOT scaled
 */
export function applyDensityScaling(tokenValue: number, densityMultiplier: number, tokenCategory: TokenCategory): number {
  // Only apply density scaling to functional tokens
  const functionalTokens = [TokenCategory.SPACING, TokenCategory.FONT_SIZE, TokenCategory.TAP_AREA];
  
  if (functionalTokens.includes(tokenCategory)) {
    return tokenValue * densityMultiplier;
  }
  
  // Aesthetic tokens remain unchanged
  return tokenValue;
}