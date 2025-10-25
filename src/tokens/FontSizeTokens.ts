/**
 * Font Size Token Definitions
 * 
 * Font size tokens follow 1.125 modular scale (musical fourth) with base value 16.
 * Base value: 16 units (standard browser default)
 * Mathematical progression: Modular scale with strategic flexibility exceptions
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Font size token base value for mathematical calculations
 */
export const FONT_SIZE_BASE_VALUE = 16;

/**
 * Modular scale ratio for fontSize progression (musical fourth)
 */
export const MODULAR_SCALE_RATIO = 1.125;

/**
 * Generate platform values for fontSize tokens
 */
function generateFontSizePlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue / FONT_SIZE_BASE_VALUE, unit: 'rem' }, // Convert to 1 REM
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'sp' }
  };
}

/**
 * FontSize tokens with 1.125 modular scale progression
 */
export const fontSizeTokens: Record<string, PrimitiveToken> = {
  fontSize050: {
    name: 'fontSize050',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE / Math.pow(MODULAR_SCALE_RATIO, 2)), // ~12.6 → 13
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Small font size - 0.5x relative scale',
    mathematicalRelationship: 'base ÷ (1.125²) = 16 ÷ 1.266 ≈ 13',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(13)
  },

  fontSize075: {
    name: 'fontSize075',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO), // ~14.2 → 14
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Small-medium font size - 0.75x relative scale',
    mathematicalRelationship: 'base ÷ 1.125 = 16 ÷ 1.125 ≈ 14',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(14)
  },

  fontSize100: {
    name: 'fontSize100',
    category: TokenCategory.FONT_SIZE,
    baseValue: FONT_SIZE_BASE_VALUE,
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Base font size - 1x scale',
    mathematicalRelationship: 'base × 1 = 16 × 1 = 16',
    baselineGridAlignment: true, // 16 aligns with 8-unit grid (8 × 2)
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(FONT_SIZE_BASE_VALUE)
  },

  fontSize125: {
    name: 'fontSize125',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO), // 18
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Medium font size - 1.25x relative scale',
    mathematicalRelationship: 'base × 1.125 = 16 × 1.125 = 18',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(18)
  },

  fontSize150: {
    name: 'fontSize150',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2)), // ~20.3 → 20
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Large font size - 1.5x relative scale',
    mathematicalRelationship: 'base × (1.125²) = 16 × 1.266 ≈ 20',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(20)
  },

  fontSize200: {
    name: 'fontSize200',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 3)), // ~22.8 → 23
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Extra large font size - 2x relative scale',
    mathematicalRelationship: 'base × (1.125³) = 16 × 1.424 ≈ 23',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(23)
  },

  fontSize300: {
    name: 'fontSize300',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 4)), // ~25.6 → 26
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Heading font size - 3x relative scale',
    mathematicalRelationship: 'base × (1.125⁴) = 16 × 1.602 ≈ 26',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(26)
  },

  fontSize400: {
    name: 'fontSize400',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 5)), // ~28.8 → 29
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Large heading font size - 4x relative scale',
    mathematicalRelationship: 'base × (1.125⁵) = 16 × 1.802 ≈ 29',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontSizePlatformValues(29)
  },

  fontSize500: {
    name: 'fontSize500',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 6)) + 1, // ~32.4 → 32 + 1 = 33 (adjusted for 4pt subgrid)
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Display heading font size - 5x relative scale',
    mathematicalRelationship: 'base × (1.125⁶) = 16 × 2.027 ≈ 32.4 → 33 (adjusted for 4pt subgrid)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Adjusted for 4pt subgrid alignment
    platforms: generateFontSizePlatformValues(Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 6)) + 1)
  },

  fontSize600: {
    name: 'fontSize600',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 7)) + 1, // ~36.5 → 36 + 1 = 37 (adjusted for 4pt subgrid)
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Large display font size - 6x relative scale',
    mathematicalRelationship: 'base × (1.125⁷) = 16 × 2.281 ≈ 36.5 → 37 (adjusted for 4pt subgrid)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Adjusted for 4pt subgrid alignment
    platforms: generateFontSizePlatformValues(Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 7)) + 1)
  },

  fontSize700: {
    name: 'fontSize700',
    category: TokenCategory.FONT_SIZE,
    baseValue: Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 8)) + 1, // ~41.1 → 41 + 1 = 42 (adjusted for 4pt subgrid)
    familyBaseValue: FONT_SIZE_BASE_VALUE,
    description: 'Extra large display font size - 7x relative scale',
    mathematicalRelationship: 'base × (1.125⁸) = 16 × 2.566 ≈ 41.1 → 42 (adjusted for 4pt subgrid)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: true, // Adjusted for 4pt subgrid alignment
    platforms: generateFontSizePlatformValues(Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 8)) + 1)
  }
};

/**
 * Array of all font size token names for iteration
 */
export const fontSizeTokenNames = Object.keys(fontSizeTokens);

/**
 * Get font size token by name
 */
export function getFontSizeToken(name: string): PrimitiveToken | undefined {
  return fontSizeTokens[name];
}

/**
 * Get all font size tokens as array
 */
export function getAllFontSizeTokens(): PrimitiveToken[] {
  return Object.values(fontSizeTokens);
}