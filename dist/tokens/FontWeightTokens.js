"use strict";
/**
 * Font Weight Token Definitions
 *
 * Font weight tokens follow standard numeric font weight values.
 * Base value: 400 (normal weight)
 * Mathematical progression: Standard font weight increments
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontWeightTokenNames = exports.fontWeightTokens = exports.FONT_WEIGHT_BASE_VALUE = void 0;
exports.getFontWeightToken = getFontWeightToken;
exports.getAllFontWeightTokens = getAllFontWeightTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Font weight token base value for mathematical calculations
 */
exports.FONT_WEIGHT_BASE_VALUE = 400;
/**
 * Generate platform values for font weight tokens (numeric across all platforms)
 */
function generateFontWeightPlatformValues(weight) {
    return {
        web: { value: weight, unit: 'fontWeight' },
        ios: { value: weight, unit: 'fontWeight' },
        android: { value: weight, unit: 'fontWeight' }
    };
}
/**
 * Font weight tokens with standard numeric progression
 */
exports.fontWeightTokens = {
    fontWeight100: {
        name: 'fontWeight100',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 100,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Thin font weight',
        mathematicalRelationship: 'base × 0.25 = 400 × 0.25 = 100',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(100)
    },
    fontWeight200: {
        name: 'fontWeight200',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 200,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Extra light font weight',
        mathematicalRelationship: 'base × 0.5 = 400 × 0.5 = 200',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(200)
    },
    fontWeight300: {
        name: 'fontWeight300',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 300,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Light font weight',
        mathematicalRelationship: 'base × 0.75 = 400 × 0.75 = 300',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(300)
    },
    fontWeight400: {
        name: 'fontWeight400',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: exports.FONT_WEIGHT_BASE_VALUE,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Normal font weight - base unit',
        mathematicalRelationship: 'base × 1 = 400 × 1 = 400',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(exports.FONT_WEIGHT_BASE_VALUE)
    },
    fontWeight500: {
        name: 'fontWeight500',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 500,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Medium font weight',
        mathematicalRelationship: 'base × 1.25 = 400 × 1.25 = 500',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(500)
    },
    fontWeight600: {
        name: 'fontWeight600',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 600,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Semi-bold font weight',
        mathematicalRelationship: 'base × 1.5 = 400 × 1.5 = 600',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(600)
    },
    fontWeight700: {
        name: 'fontWeight700',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 700,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Bold font weight',
        mathematicalRelationship: 'base × 1.75 = 400 × 1.75 = 700',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(700)
    },
    fontWeight800: {
        name: 'fontWeight800',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 800,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Extra bold font weight',
        mathematicalRelationship: 'base × 2 = 400 × 2 = 800',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(800)
    },
    fontWeight900: {
        name: 'fontWeight900',
        category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
        baseValue: 900,
        familyBaseValue: exports.FONT_WEIGHT_BASE_VALUE,
        description: 'Black font weight',
        mathematicalRelationship: 'base × 2.25 = 400 × 2.25 = 900',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateFontWeightPlatformValues(900)
    }
};
/**
 * Array of all font weight token names for iteration
 */
exports.fontWeightTokenNames = Object.keys(exports.fontWeightTokens);
/**
 * Get font weight token by name
 */
function getFontWeightToken(name) {
    return exports.fontWeightTokens[name];
}
/**
 * Get all font weight tokens as array
 */
function getAllFontWeightTokens() {
    return Object.values(exports.fontWeightTokens);
}
//# sourceMappingURL=FontWeightTokens.js.map