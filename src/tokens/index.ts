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

// Font family tokens
export {
  fontFamilyTokens,
  fontFamilyTokenNames,
  getFontFamilyToken,
  getAllFontFamilyTokens
} from './FontFamilyTokens';

// Font weight tokens
export {
  fontWeightTokens,
  fontWeightTokenNames,
  getFontWeightToken,
  getAllFontWeightTokens,
  FONT_WEIGHT_BASE_VALUE
} from './FontWeightTokens';

// Letter spacing tokens
export {
  letterSpacingTokens,
  letterSpacingTokenNames,
  getLetterSpacingToken,
  getAllLetterSpacingTokens,
  LETTER_SPACING_BASE_VALUE
} from './LetterSpacingTokens';

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

// Color tokens
export {
  colorTokens,
  colorTokenNames,
  getColorToken,
  getAllColorTokens,
  getColorTokensByFamily,
  resolveColorTokenValue,
  grayTokens,
  blackTokens,
  whiteTokens,
  yellowTokens,
  orangeTokens,
  purpleTokens,
  violetTokens,
  cyanTokens,
  tealTokens,
  shadowColorTokens,
  shadowColorTokenNames,
  getShadowColorToken,
  getAllShadowColorTokens,
  getShadowColorTokensByFamily,
  COLOR_BASE_VALUE,
  COLOR_FAMILIES,
  COLOR_SCALE,
  COLOR_MODES,
  COLOR_THEMES
} from './ColorTokens';

// Border width tokens
export {
  borderWidthTokens,
  borderWidthTokenNames,
  getBorderWidthToken,
  getAllBorderWidthTokens,
  BORDER_WIDTH_BASE_VALUE
} from './BorderWidthTokens';

// Shadow tokens
export {
  SHADOW_OFFSET_BASE_VALUE,
  shadowOffsetX,
  shadowOffsetY,
  shadowOffsetXNames,
  shadowOffsetYNames,
  getShadowOffsetXToken,
  getShadowOffsetYToken,
  getAllShadowOffsetXTokens,
  getAllShadowOffsetYTokens
} from './ShadowOffsetTokens';

export {
  SHADOW_BLUR_BASE_VALUE,
  shadowBlur,
  shadowBlurNames,
  getShadowBlurToken,
  getAllShadowBlurTokens
} from './ShadowBlurTokens';

export {
  SHADOW_OPACITY_BASE_VALUE,
  shadowOpacityTokens,
  shadowOpacityTokenNames,
  getShadowOpacityToken,
  getAllShadowOpacityTokens
} from './ShadowOpacityTokens';

// Glow tokens
export {
  GLOW_BLUR_BASE_VALUE,
  glowBlur,
  glowBlurNames,
  getGlowBlurToken,
  getAllGlowBlurTokens
} from './GlowBlurTokens';

export {
  GLOW_OPACITY_BASE_VALUE,
  glowOpacity,
  glowOpacityNames,
  getGlowOpacityToken,
  getAllGlowOpacityTokens
} from './GlowOpacityTokens';

// Combined token utilities
import { spacingTokens } from './SpacingTokens';
import { fontSizeTokens } from './FontSizeTokens';
import { fontFamilyTokens } from './FontFamilyTokens';
import { fontWeightTokens } from './FontWeightTokens';
import { lineHeightTokens } from './LineHeightTokens';
import { letterSpacingTokens } from './LetterSpacingTokens';
import { densityTokens } from './DensityTokens';
import { tapAreaTokens } from './TapAreaTokens';
import { radiusTokens } from './RadiusTokens';
import { colorTokens } from './ColorTokens';
import { borderWidthTokens } from './BorderWidthTokens';
import { shadowOffsetX, shadowOffsetY } from './ShadowOffsetTokens';
import { shadowBlur } from './ShadowBlurTokens';
import { shadowOpacityTokens } from './ShadowOpacityTokens';
import { glowBlur } from './GlowBlurTokens';
import { glowOpacity } from './GlowOpacityTokens';
import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';

/**
 * All primitive tokens combined by category
 */
export const allTokens = {
  [TokenCategory.SPACING]: spacingTokens,
  [TokenCategory.FONT_SIZE]: fontSizeTokens,
  [TokenCategory.FONT_FAMILY]: fontFamilyTokens,
  [TokenCategory.FONT_WEIGHT]: fontWeightTokens,
  [TokenCategory.LINE_HEIGHT]: lineHeightTokens,
  [TokenCategory.LETTER_SPACING]: letterSpacingTokens,
  [TokenCategory.RADIUS]: radiusTokens,
  [TokenCategory.DENSITY]: densityTokens,
  [TokenCategory.TAP_AREA]: tapAreaTokens,
  [TokenCategory.COLOR]: colorTokens,
  [TokenCategory.BORDER_WIDTH]: borderWidthTokens,
  [TokenCategory.SHADOW]: { ...shadowOffsetX, ...shadowOffsetY, ...shadowBlur, ...shadowOpacityTokens },
  [TokenCategory.GLOW]: { ...glowBlur, ...glowOpacity }
};

/**
 * Get all tokens as a flat array
 */
export function getAllTokens(): PrimitiveToken[] {
  return [
    ...Object.values(spacingTokens),
    ...Object.values(fontSizeTokens),
    ...Object.values(fontFamilyTokens),
    ...Object.values(fontWeightTokens),
    ...Object.values(lineHeightTokens),
    ...Object.values(letterSpacingTokens),
    ...Object.values(radiusTokens),
    ...Object.values(densityTokens),
    ...Object.values(tapAreaTokens),
    ...Object.values(colorTokens),
    ...Object.values(borderWidthTokens),
    ...Object.values(shadowOffsetX),
    ...Object.values(shadowOffsetY),
    ...Object.values(shadowBlur),
    ...Object.values(shadowOpacityTokens),
    ...Object.values(glowBlur),
    ...Object.values(glowOpacity)
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
  [TokenCategory.FONT_FAMILY]: 0, // N/A for categorical tokens
  [TokenCategory.FONT_WEIGHT]: 400,
  [TokenCategory.LINE_HEIGHT]: 1.5,
  [TokenCategory.LETTER_SPACING]: 0,
  [TokenCategory.RADIUS]: 8,
  [TokenCategory.DENSITY]: 1.0,
  [TokenCategory.TAP_AREA]: 44,
  [TokenCategory.COLOR]: 0, // N/A for hex color tokens
  [TokenCategory.BORDER_WIDTH]: 1,
  [TokenCategory.SHADOW]: 4,
  [TokenCategory.GLOW]: 8
} as const;