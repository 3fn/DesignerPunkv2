"use strict";
/**
 * Line Height Token Definitions
 *
 * Line height tokens use precision multipliers to align with 8pt vertical rhythm
 * when combined with fontSize tokens. Base value: 1.5 (optimal reading ratio)
 * Mathematical progression: Precision-targeted multipliers for systematic alignment
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineHeightTokenNames = exports.lineHeightTokens = exports.LINE_HEIGHT_BASE_VALUE = void 0;
exports.getLineHeightToken = getLineHeightToken;
exports.getAllLineHeightTokens = getAllLineHeightTokens;
exports.calculateComputedLineHeight = calculateComputedLineHeight;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Line height token base value for mathematical calculations
 */
exports.LINE_HEIGHT_BASE_VALUE = 1.5;
/**
 * Generate platform values for lineHeight tokens
 */
function generateLineHeightPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'unitless' },
        ios: { value: baseValue, unit: 'unitless' },
        android: { value: baseValue, unit: 'unitless' }
    };
}
/**
 * LineHeight tokens with precision multipliers for 8pt vertical rhythm alignment
 */
exports.lineHeightTokens = {
    lineHeight050: {
        name: 'lineHeight050',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.0,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Tight line height - precision multiplier for dense text',
        mathematicalRelationship: 'base × 0.667 = 1.5 × 0.667 ≈ 1.0',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.0)
    },
    lineHeight075: {
        name: 'lineHeight075',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.25,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Compact line height - precision multiplier for readable text',
        mathematicalRelationship: 'base × 0.833 = 1.5 × 0.833 ≈ 1.25',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.25)
    },
    lineHeight100: {
        name: 'lineHeight100',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: exports.LINE_HEIGHT_BASE_VALUE,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Base line height - optimal for body text',
        mathematicalRelationship: 'base × 1 = 1.5 × 1 = 1.5',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(exports.LINE_HEIGHT_BASE_VALUE)
    },
    lineHeight125: {
        name: 'lineHeight125',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.75,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Loose line height - precision multiplier for comfortable reading',
        mathematicalRelationship: 'base × 1.167 = 1.5 × 1.167 ≈ 1.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.75)
    },
    lineHeight150: {
        name: 'lineHeight150',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.4,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'H6 line height - precision multiplier for 28px (4×7) with fontSize150',
        mathematicalRelationship: '28px ÷ 20px = 1.4 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.4)
    },
    lineHeight200: {
        name: 'lineHeight200',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.391,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'H5 line height - precision multiplier for 32px (4×8) with fontSize200',
        mathematicalRelationship: '32px ÷ 23px ≈ 1.391 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.391)
    },
    lineHeight300: {
        name: 'lineHeight300',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.231,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'H4 line height - precision multiplier for 32px (4×8) with fontSize300',
        mathematicalRelationship: '32px ÷ 26px ≈ 1.231 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.231)
    },
    lineHeight400: {
        name: 'lineHeight400',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.241,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'H3 line height - precision multiplier for 36px (4×9) with fontSize400',
        mathematicalRelationship: '36px ÷ 29px ≈ 1.241 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.241)
    },
    lineHeight500: {
        name: 'lineHeight500',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.212,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Display heading line height - precision multiplier for 40px (4×10) with fontSize500',
        mathematicalRelationship: '40px ÷ 33px = 1.212 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.212)
    },
    lineHeight600: {
        name: 'lineHeight600',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.19,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Large display line height - precision multiplier for 44px (4×11) with fontSize600',
        mathematicalRelationship: '44px ÷ 37px ≈ 1.19 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.19)
    },
    lineHeight700: {
        name: 'lineHeight700',
        category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
        baseValue: 1.143,
        familyBaseValue: exports.LINE_HEIGHT_BASE_VALUE,
        description: 'Extra large display line height - precision multiplier for 48px (4×12) with fontSize700',
        mathematicalRelationship: '48px ÷ 42px ≈ 1.143 (aligns to 4pt subgrid)',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for vertical rhythm
        platforms: generateLineHeightPlatformValues(1.143)
    }
};
/**
 * Array of all line height token names for iteration
 */
exports.lineHeightTokenNames = Object.keys(exports.lineHeightTokens);
/**
 * Get line height token by name
 */
function getLineHeightToken(name) {
    return exports.lineHeightTokens[name];
}
/**
 * Get all line height tokens as array
 */
function getAllLineHeightTokens() {
    return Object.values(exports.lineHeightTokens);
}
/**
 * Calculate computed line height for fontSize + lineHeight combination
 * This ensures proper 8pt vertical rhythm alignment
 */
function calculateComputedLineHeight(fontSizeValue, lineHeightRatio) {
    return fontSizeValue * lineHeightRatio;
}
//# sourceMappingURL=LineHeightTokens.js.map