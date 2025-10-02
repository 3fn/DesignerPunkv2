/**
 * Sizing Token Definitions
 * 
 * Includes fontSize, lineHeight, density, and tapArea token families.
 * Each family has its own base value and mathematical progression.
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Base values for sizing token families
 */
export const FONT_SIZE_BASE_VALUE = 16;
export const LINE_HEIGHT_BASE_VALUE = 1.5;
export const DENSITY_BASE_VALUE = 1.0;
export const TAP_AREA_BASE_VALUE = 44;

/**
 * Modular scale ratio for fontSize progression (musical fourth)
 */
export const MODULAR_SCALE_RATIO = 1.125;

/**
 * Generate platform values for fontSize tokens
 */
function generateFontSizePlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue / 16, unit: 'rem' }, // Convert to REM (÷16)
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'sp' }
  };
}

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
  }
};

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
 * Get all sizing tokens by category
 */
export function getFontSizeTokens(): PrimitiveToken[] {
  return Object.values(fontSizeTokens);
}

export function getLineHeightTokens(): PrimitiveToken[] {
  return Object.values(lineHeightTokens);
}

export function getDensityTokens(): PrimitiveToken[] {
  return Object.values(densityTokens);
}

export function getTapAreaTokens(): PrimitiveToken[] {
  return Object.values(tapAreaTokens);
}

/**
 * Get sizing token by name and category
 */
export function getSizingToken(name: string, category: TokenCategory): PrimitiveToken | undefined {
  switch (category) {
    case TokenCategory.FONT_SIZE:
      return fontSizeTokens[name];
    case TokenCategory.LINE_HEIGHT:
      return lineHeightTokens[name];
    case TokenCategory.DENSITY:
      return densityTokens[name];
    case TokenCategory.TAP_AREA:
      return tapAreaTokens[name];
    default:
      return undefined;
  }
}