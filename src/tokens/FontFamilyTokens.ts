/**
 * Font Family Token Definitions
 * 
 * Font family tokens provide categorical font stack definitions for different use cases.
 * These are not mathematical values but categorical selections for typography.
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Generate platform values for font family tokens (same across all platforms)
 */
function generateFontFamilyPlatformValues(fontStack: string): PlatformValues {
  return {
    web: { value: fontStack, unit: 'fontFamily' },
    ios: { value: fontStack, unit: 'fontFamily' },
    android: { value: fontStack, unit: 'fontFamily' }
  };
}

/**
 * Font family tokens with platform-appropriate font stacks
 */
export const fontFamilyTokens: Record<string, PrimitiveToken> = {
  fontFamilySystem: {
    name: 'fontFamilySystem',
    category: TokenCategory.FONT_FAMILY,
    baseValue: 0, // N/A for categorical tokens
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Platform default font stack for system UI',
    mathematicalRelationship: 'N/A - Categorical value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontFamilyPlatformValues('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')
  },

  fontFamilyMono: {
    name: 'fontFamilyMono',
    category: TokenCategory.FONT_FAMILY,
    baseValue: 0, // N/A for categorical tokens
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Monospace font stack for code and technical content',
    mathematicalRelationship: 'N/A - Categorical value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontFamilyPlatformValues('SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace')
  },

  fontFamilyDisplay: {
    name: 'fontFamilyDisplay',
    category: TokenCategory.FONT_FAMILY,
    baseValue: 0, // N/A for categorical tokens
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Display font stack for headings and prominent text',
    mathematicalRelationship: 'N/A - Categorical value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontFamilyPlatformValues('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')
  },

  fontFamilyBody: {
    name: 'fontFamilyBody',
    category: TokenCategory.FONT_FAMILY,
    baseValue: 0, // N/A for categorical tokens
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Body font stack for general text content',
    mathematicalRelationship: 'N/A - Categorical value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateFontFamilyPlatformValues('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')
  }
};

/**
 * Array of all font family token names for iteration
 */
export const fontFamilyTokenNames = Object.keys(fontFamilyTokens);

/**
 * Get font family token by name
 */
export function getFontFamilyToken(name: string): PrimitiveToken | undefined {
  return fontFamilyTokens[name];
}

/**
 * Get all font family tokens as array
 */
export function getAllFontFamilyTokens(): PrimitiveToken[] {
  return Object.values(fontFamilyTokens);
}