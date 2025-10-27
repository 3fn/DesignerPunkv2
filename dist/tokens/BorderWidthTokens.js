"use strict";
/**
 * Border Width Token Definitions
 *
 * Border width tokens follow a doubling progression with explicit mathematical relationships.
 * Base value: 1 unit
 * Mathematical progression: Doubling (1 → 2 → 4)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.borderWidthTokenNames = exports.borderWidthTokens = exports.BORDER_WIDTH_BASE_VALUE = void 0;
exports.getBorderWidthToken = getBorderWidthToken;
exports.getAllBorderWidthTokens = getAllBorderWidthTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Border width token base value for mathematical calculations
 */
exports.BORDER_WIDTH_BASE_VALUE = 1;
/**
 * Generate platform values for border width tokens
 */
function generateBorderWidthPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'px' },
        ios: { value: baseValue, unit: 'pt' },
        android: { value: baseValue, unit: 'dp' }
    };
}
/**
 * Border width tokens with doubling progression
 */
exports.borderWidthTokens = {
    borderWidth100: {
        name: 'borderWidth100',
        category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
        baseValue: exports.BORDER_WIDTH_BASE_VALUE,
        familyBaseValue: exports.BORDER_WIDTH_BASE_VALUE,
        description: 'Base border width - 1x base value. Used for standard borders, default state.',
        mathematicalRelationship: 'base × 1 = 1 × 1 = 1',
        baselineGridAlignment: false, // Border widths don't require baseline grid alignment
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBorderWidthPlatformValues(exports.BORDER_WIDTH_BASE_VALUE)
    },
    borderWidth200: {
        name: 'borderWidth200',
        category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
        baseValue: exports.BORDER_WIDTH_BASE_VALUE * 2,
        familyBaseValue: exports.BORDER_WIDTH_BASE_VALUE,
        description: 'Emphasized border width - 2x base value. Used for emphasized borders, active/focus states.',
        mathematicalRelationship: 'base × 2 = 1 × 2 = 2',
        baselineGridAlignment: false, // Border widths don't require baseline grid alignment
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBorderWidthPlatformValues(exports.BORDER_WIDTH_BASE_VALUE * 2)
    },
    borderWidth400: {
        name: 'borderWidth400',
        category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
        baseValue: exports.BORDER_WIDTH_BASE_VALUE * 4,
        familyBaseValue: exports.BORDER_WIDTH_BASE_VALUE,
        description: 'Heavy border width - 4x base value. Used for heavy emphasis, strong visual weight (rare).',
        mathematicalRelationship: 'base × 4 = 1 × 4 = 4',
        baselineGridAlignment: false, // Border widths don't require baseline grid alignment
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBorderWidthPlatformValues(exports.BORDER_WIDTH_BASE_VALUE * 4)
    }
};
/**
 * Array of all border width token names for iteration
 */
exports.borderWidthTokenNames = Object.keys(exports.borderWidthTokens);
/**
 * Get border width token by name
 */
function getBorderWidthToken(name) {
    return exports.borderWidthTokens[name];
}
/**
 * Get all border width tokens as array
 */
function getAllBorderWidthTokens() {
    return Object.values(exports.borderWidthTokens);
}
//# sourceMappingURL=BorderWidthTokens.js.map