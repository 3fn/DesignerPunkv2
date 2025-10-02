/**
 * Letter Spacing Token Definitions
 * 
 * Letter spacing tokens provide unitless values for character spacing adjustments.
 * Base value: 0 (normal spacing)
 * Mathematical progression: Em-based increments for typography refinement
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Letter spacing token base value for mathematical calculations
 */
export const LETTER_SPACING_BASE_VALUE = 0;

/**
 * Generate platform values for letter spacing tokens
 */
function generateLetterSpacingPlatformValues(spacing: number): PlatformValues {
  return {
    web: { value: spacing, unit: 'em' },
    ios: { value: spacing, unit: 'em' },
    android: { value: spacing, unit: 'em' }
  };
}

/**
 * Letter spacing tokens with em-based progression for typography refinement
 */
export const letterSpacingTokens: Record<string, PrimitiveToken> = {
  letterSpacing025: {
    name: 'letterSpacing025',
    category: TokenCategory.LETTER_SPACING,
    baseValue: -0.025,
    familyBaseValue: LETTER_SPACING_BASE_VALUE,
    description: 'Tight letter spacing for large text',
    mathematicalRelationship: 'base - 0.025 = 0 - 0.025 = -0.025',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision-targeted for typography refinement
    platforms: generateLetterSpacingPlatformValues(-0.025)
  },

  letterSpacing050: {
    name: 'letterSpacing050',
    category: TokenCategory.LETTER_SPACING,
    baseValue: -0.05,
    familyBaseValue: LETTER_SPACING_BASE_VALUE,
    description: 'Very tight letter spacing for display text',
    mathematicalRelationship: 'base - 0.05 = 0 - 0.05 = -0.05',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision-targeted for typography refinement
    platforms: generateLetterSpacingPlatformValues(-0.05)
  },

  letterSpacing100: {
    name: 'letterSpacing100',
    category: TokenCategory.LETTER_SPACING,
    baseValue: LETTER_SPACING_BASE_VALUE,
    familyBaseValue: LETTER_SPACING_BASE_VALUE,
    description: 'Normal letter spacing - base unit',
    mathematicalRelationship: 'base × 1 = 0 × 1 = 0',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision-targeted for typography refinement
    platforms: generateLetterSpacingPlatformValues(LETTER_SPACING_BASE_VALUE)
  },

  letterSpacing125: {
    name: 'letterSpacing125',
    category: TokenCategory.LETTER_SPACING,
    baseValue: 0.025,
    familyBaseValue: LETTER_SPACING_BASE_VALUE,
    description: 'Loose letter spacing for small text',
    mathematicalRelationship: 'base + 0.025 = 0 + 0.025 = 0.025',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision-targeted for typography refinement
    platforms: generateLetterSpacingPlatformValues(0.025)
  },

  letterSpacing150: {
    name: 'letterSpacing150',
    category: TokenCategory.LETTER_SPACING,
    baseValue: 0.05,
    familyBaseValue: LETTER_SPACING_BASE_VALUE,
    description: 'Very loose letter spacing for emphasis',
    mathematicalRelationship: 'base + 0.05 = 0 + 0.05 = 0.05',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Precision-targeted for typography refinement
    platforms: generateLetterSpacingPlatformValues(0.05)
  }
};

/**
 * Array of all letter spacing token names for iteration
 */
export const letterSpacingTokenNames = Object.keys(letterSpacingTokens);

/**
 * Get letter spacing token by name
 */
export function getLetterSpacingToken(name: string): PrimitiveToken | undefined {
  return letterSpacingTokens[name];
}

/**
 * Get all letter spacing tokens as array
 */
export function getAllLetterSpacingTokens(): PrimitiveToken[] {
  return Object.values(letterSpacingTokens);
}