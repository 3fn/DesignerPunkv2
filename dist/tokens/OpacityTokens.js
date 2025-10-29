"use strict";
/**
 * Opacity Token Definitions
 *
 * Opacity tokens follow 0.08 base value with 13-token scale (0-100%) in 8% increments.
 * Base value: 0.08 (8%)
 * Mathematical progression: Systematic multiples of base value
 * Scale notation: opacity100 = 1 × base, opacity200 = 2 × base, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.opacityTokenNames = exports.opacityTokens = exports.OPACITY_BASE_VALUE = void 0;
exports.getOpacityToken = getOpacityToken;
exports.getAllOpacityTokens = getAllOpacityTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Opacity token base value for mathematical calculations
 */
exports.OPACITY_BASE_VALUE = 0.08;
/**
 * Generate platform values for opacity tokens
 * All platforms use same unitless value (0.0 - 1.0)
 */
function generateOpacityPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'unitless' },
        ios: { value: baseValue, unit: 'unitless' },
        android: { value: baseValue, unit: 'unitless' }
    };
}
/**
 * Opacity tokens with 13-token scale from 0% to 100% in 8% increments
 */
exports.opacityTokens = {
    opacity000: {
        name: 'opacity000',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: 0.0,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Fully transparent - invisible',
        mathematicalRelationship: 'base × 0 = 0.08 × 0 = 0.0',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(0.0)
    },
    opacity100: {
        name: 'opacity100',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Subtle transparency - very light overlay, gentle hover feedback',
        mathematicalRelationship: 'base × 1 = 0.08 × 1 = 0.08',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE)
    },
    opacity200: {
        name: 'opacity200',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 2,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Light transparency - light overlay, pressed state',
        mathematicalRelationship: 'base × 2 = 0.08 × 2 = 0.16',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 2)
    },
    opacity300: {
        name: 'opacity300',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 3,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Medium-light transparency - medium-light overlay',
        mathematicalRelationship: 'base × 3 = 0.08 × 3 = 0.24',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 3)
    },
    opacity400: {
        name: 'opacity400',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 4,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Medium transparency - modal scrim, medium overlay',
        mathematicalRelationship: 'base × 4 = 0.08 × 4 = 0.32',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 4)
    },
    opacity500: {
        name: 'opacity500',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 5,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Strong transparency - strong overlay',
        mathematicalRelationship: 'base × 5 = 0.08 × 5 = 0.40',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 5)
    },
    opacity600: {
        name: 'opacity600',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 6,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Disabled state - faded, very strong overlay',
        mathematicalRelationship: 'base × 6 = 0.08 × 6 = 0.48',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 6)
    },
    opacity700: {
        name: 'opacity700',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 7,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Nearly opaque - subtle transparency',
        mathematicalRelationship: 'base × 7 = 0.08 × 7 = 0.56',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 7)
    },
    opacity800: {
        name: 'opacity800',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 8,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Very opaque - minimal transparency',
        mathematicalRelationship: 'base × 8 = 0.08 × 8 = 0.64',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 8)
    },
    opacity900: {
        name: 'opacity900',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 9,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Extremely opaque - very minimal transparency',
        mathematicalRelationship: 'base × 9 = 0.08 × 9 = 0.72',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 9)
    },
    opacity1000: {
        name: 'opacity1000',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 10,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Nearly full opacity - barely visible transparency',
        mathematicalRelationship: 'base × 10 = 0.08 × 10 = 0.80',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 10)
    },
    opacity1100: {
        name: 'opacity1100',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 11,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Subtle transparency - almost fully opaque',
        mathematicalRelationship: 'base × 11 = 0.08 × 11 = 0.88',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 11)
    },
    opacity1200: {
        name: 'opacity1200',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: exports.OPACITY_BASE_VALUE * 12,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Almost fully opaque - imperceptible transparency',
        mathematicalRelationship: 'base × 12 = 0.08 × 12 = 0.96',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(exports.OPACITY_BASE_VALUE * 12)
    },
    opacity1300: {
        name: 'opacity1300',
        category: PrimitiveToken_1.TokenCategory.OPACITY,
        baseValue: 1.0,
        familyBaseValue: exports.OPACITY_BASE_VALUE,
        description: 'Fully opaque - no transparency',
        mathematicalRelationship: 'Special case: full opacity = 1.0',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateOpacityPlatformValues(1.0)
    }
};
/**
 * Array of all opacity token names for iteration
 */
exports.opacityTokenNames = Object.keys(exports.opacityTokens);
/**
 * Get opacity token by name
 */
function getOpacityToken(name) {
    return exports.opacityTokens[name];
}
/**
 * Get all opacity tokens as array
 */
function getAllOpacityTokens() {
    return Object.values(exports.opacityTokens);
}
//# sourceMappingURL=OpacityTokens.js.map