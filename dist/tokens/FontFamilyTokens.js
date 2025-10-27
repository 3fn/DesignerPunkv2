"use strict";
/**
 * Font Family Token Definitions
 *
 * Font family tokens provide categorical font stack definitions for different use cases.
 * These are not mathematical values but categorical selections for typography.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontFamilyTokenNames = exports.fontFamilyTokens = void 0;
exports.getFontFamilyToken = getFontFamilyToken;
exports.getAllFontFamilyTokens = getAllFontFamilyTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Generate platform values for font family tokens (same across all platforms)
 */
function generateFontFamilyPlatformValues(fontStack) {
    return {
        web: { value: fontStack, unit: 'fontFamily' },
        ios: { value: fontStack, unit: 'fontFamily' },
        android: { value: fontStack, unit: 'fontFamily' }
    };
}
/**
 * Font family tokens with platform-appropriate font stacks
 */
exports.fontFamilyTokens = {
    fontFamilySystem: {
        name: 'fontFamilySystem',
        category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
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
        category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
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
        category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
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
        category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
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
exports.fontFamilyTokenNames = Object.keys(exports.fontFamilyTokens);
/**
 * Get font family token by name
 */
function getFontFamilyToken(name) {
    return exports.fontFamilyTokens[name];
}
/**
 * Get all font family tokens as array
 */
function getAllFontFamilyTokens() {
    return Object.values(exports.fontFamilyTokens);
}
//# sourceMappingURL=FontFamilyTokens.js.map