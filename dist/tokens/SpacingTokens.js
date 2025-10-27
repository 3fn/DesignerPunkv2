"use strict";
/**
 * Spacing Token Definitions
 *
 * Spacing tokens follow 8-unit baseline grid alignment with strategic flexibility exceptions.
 * Base value: 8 units
 * Mathematical progression: Systematic multiples of base value with strategic flexibility tokens
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.spacingTokenNames = exports.spacingTokens = exports.SPACING_BASE_VALUE = void 0;
exports.getSpacingToken = getSpacingToken;
exports.getAllSpacingTokens = getAllSpacingTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
const StrategicFlexibilityTokens_1 = require("../constants/StrategicFlexibilityTokens");
/**
 * Spacing token base value for mathematical calculations
 */
exports.SPACING_BASE_VALUE = 8;
/**
 * Generate platform values for spacing tokens
 */
function generateSpacingPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'px' },
        ios: { value: baseValue, unit: 'pt' },
        android: { value: baseValue, unit: 'dp' }
    };
}
/**
 * Spacing tokens with 8-unit baseline grid alignment and strategic flexibility
 */
exports.spacingTokens = {
    space025: {
        name: 'space025',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 0.25,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Extra tight spacing - 0.25x base value',
        mathematicalRelationship: 'base × 0.25 = 8 × 0.25 = 2',
        baselineGridAlignment: false, // 2 is not 8-unit aligned
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 0.25)
    },
    space050: {
        name: 'space050',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 0.5,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Tight spacing - 0.5x base value',
        mathematicalRelationship: 'base × 0.5 = 8 × 0.5 = 4',
        baselineGridAlignment: false, // 4 is not 8-unit aligned
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 0.5)
    },
    space075: {
        name: 'space075',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space075.value,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Strategic flexibility spacing - 0.75x base value',
        mathematicalRelationship: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space075.derivation,
        baselineGridAlignment: false, // Strategic flexibility exception
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space075.value)
    },
    space100: {
        name: 'space100',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Base spacing - 1x base value',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        baselineGridAlignment: true, // 8 is baseline grid aligned
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE)
    },
    space125: {
        name: 'space125',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space125.value,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Strategic flexibility spacing - 1.25x base value',
        mathematicalRelationship: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space125.derivation,
        baselineGridAlignment: false, // Strategic flexibility exception
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space125.value)
    },
    space150: {
        name: 'space150',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 1.5,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Loose spacing - 1.5x base value',
        mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12',
        baselineGridAlignment: false, // 12 is not 8-unit aligned
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 1.5)
    },
    space200: {
        name: 'space200',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 2,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Wide spacing - 2x base value',
        mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
        baselineGridAlignment: true, // 16 is baseline grid aligned (8 × 2)
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 2)
    },
    space250: {
        name: 'space250',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space250.value,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Strategic flexibility spacing - 2.5x base value',
        mathematicalRelationship: StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space250.derivation,
        baselineGridAlignment: false, // Strategic flexibility exception
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space250.value)
    },
    space300: {
        name: 'space300',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 3,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Extra wide spacing - 3x base value',
        mathematicalRelationship: 'base × 3 = 8 × 3 = 24',
        baselineGridAlignment: true, // 24 is baseline grid aligned (8 × 3)
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 3)
    },
    space400: {
        name: 'space400',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 4,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Large spacing - 4x base value',
        mathematicalRelationship: 'base × 4 = 8 × 4 = 32',
        baselineGridAlignment: true, // 32 is baseline grid aligned (8 × 4)
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 4)
    },
    space500: {
        name: 'space500',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 5,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Extra large spacing - 5x base value',
        mathematicalRelationship: 'base × 5 = 8 × 5 = 40',
        baselineGridAlignment: true, // 40 is baseline grid aligned (8 × 5)
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 5)
    },
    space600: {
        name: 'space600',
        category: PrimitiveToken_1.TokenCategory.SPACING,
        baseValue: exports.SPACING_BASE_VALUE * 6,
        familyBaseValue: exports.SPACING_BASE_VALUE,
        description: 'Huge spacing - 6x base value',
        mathematicalRelationship: 'base × 6 = 8 × 6 = 48',
        baselineGridAlignment: true, // 48 is baseline grid aligned (8 × 6)
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateSpacingPlatformValues(exports.SPACING_BASE_VALUE * 6)
    }
};
/**
 * Array of all spacing token names for iteration
 */
exports.spacingTokenNames = Object.keys(exports.spacingTokens);
/**
 * Get spacing token by name
 */
function getSpacingToken(name) {
    return exports.spacingTokens[name];
}
/**
 * Get all spacing tokens as array
 */
function getAllSpacingTokens() {
    return Object.values(exports.spacingTokens);
}
//# sourceMappingURL=SpacingTokens.js.map