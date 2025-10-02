/**
 * Token Definitions - Barrel Export
 * 
 * Exports all token families for the Mathematical Token System.
 * Provides unified access to all primitive token families.
 */

// Spacing tokens
export {
  spacingTokens,
  spacingTokenNames,
  getSpacingToken,
  getAllSpacingTokens,
  SPACING_BASE_VALUE
} from './SpacingTokens';

// Font size tokens
export {
  fontSizeTokens,
  fontSizeTokenNames,
  getFontSizeToken,
  getAllFontSizeTokens,
  FONT_SIZE_BASE_VALUE,
  MODULAR_SCALE_RATIO
} from './FontSizeTokens';

// Line height tokens
export {
  lineHeightTokens,
  lineHeightTokenNames,
  getLineHeightToken,
  getAllLineHeightTokens,
  calculateComputedLineHeight,
  LINE_HEIGHT_BASE_VALUE
} from './LineHeightTokens';

// Density tokens
export {
  densityTokens,
  densityTokenNames,
  getDensityToken,
  getAllDensityTokens,
  applyDensityScaling,
  DENSITY_BASE_VALUE
} from './DensityTokens';

// Tap area tokens
export {
  tapAreaTokens,
  tapAreaTokenNames,
  getTapAreaToken,
  getAllTapAreaTokens,
  validateTapAreaAccessibility,
  TAP_AREA_BASE_VALUE
} from './TapAreaTokens';

// Radius tokens
export {
  radiusTokens,
  radiusTokenNames,
  getRadiusToken,
  getAllRadiusTokens,
  getBaselineAlignedRadiusTokens,
  getStrategicFlexibilityRadiusTokens,
  RADIUS_BASE_VALUE
} from './RadiusTokens';

// Combined token utilities
import { spacingTokens } from './SpacingTokens';
import { fontSizeTokens } from './FontSizeTokens';
import { lineHeightTokens } from './LineHeightTokens';
import { densityTokens } from './DensityTokens';
import { tapAreaTokens } from './TapAreaTokens';
import { radiusTokens } from './RadiusTokens';
import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';

/**
 * All primitive tokens combined by category
 */
export const allTokens = {
  [TokenCategory.SPACING]: spacingTokens,
  [TokenCategory.FONT_SIZE]: fontSizeTokens,
  [TokenCategory.LINE_HEIGHT]: lineHeightTokens,
  [TokenCategory.RADIUS]: radiusTokens,
  [TokenCategory.DENSITY]: densityTokens,
  [TokenCategory.TAP_AREA]: tapAreaTokens
};

/**
 * Get all tokens as a flat array
 */
export function getAllTokens(): PrimitiveToken[] {
  return [
    ...Object.values(spacingTokens),
    ...Object.values(fontSizeTokens),
    ...Object.values(lineHeightTokens),
    ...Object.values(radiusTokens),
    ...Object.values(densityTokens),
    ...Object.values(tapAreaTokens)
  ];
}

/**
 * Get tokens by category
 */
export function getTokensByCategory(category: TokenCategory): PrimitiveToken[] {
  const categoryTokens = allTokens[category];
  return categoryTokens ? Object.values(categoryTokens) : [];
}

/**
 * Get token by name across all categories
 */
export function getTokenByName(name: string): PrimitiveToken | undefined {
  const allTokensFlat = getAllTokens();
  return allTokensFlat.find(token => token.name === name);
}

/**
 * Get all strategic flexibility tokens
 */
export function getAllStrategicFlexibilityTokens(): PrimitiveToken[] {
  return getAllTokens().filter(token => token.isStrategicFlexibility);
}

/**
 * Get all baseline grid aligned tokens
 */
export function getAllBaselineAlignedTokens(): PrimitiveToken[] {
  return getAllTokens().filter(token => token.baselineGridAlignment);
}

/**
 * Get all precision targeted tokens
 */
export function getAllPrecisionTargetedTokens(): PrimitiveToken[] {
  return getAllTokens().filter(token => token.isPrecisionTargeted);
}

/**
 * Token family base values for reference
 */
export const TOKEN_FAMILY_BASE_VALUES = {
  [TokenCategory.SPACING]: 8,
  [TokenCategory.FONT_SIZE]: 16,
  [TokenCategory.LINE_HEIGHT]: 1.5,
  [TokenCategory.RADIUS]: 8,
  [TokenCategory.DENSITY]: 1.0,
  [TokenCategory.TAP_AREA]: 44
} as const;