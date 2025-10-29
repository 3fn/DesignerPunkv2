"use strict";
/**
 * Blend Token Definitions
 *
 * Blend tokens follow 0.04 base value with 5-token scale (4-20%) in 4% increments.
 * Base value: 0.04 (4%)
 * Mathematical progression: Systematic multiples of base value
 * Scale notation: blend100 = 1 × base, blend200 = 2 × base, etc.
 *
 * Blend tokens create new opaque colors through mathematical operations:
 * - Darker: Overlay black at specified opacity
 * - Lighter: Overlay white at specified opacity
 * - Saturate: Increase color saturation in HSL space
 * - Desaturate: Decrease color saturation in HSL space
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.blendTokenNames = exports.blendTokens = exports.BlendDirection = exports.BLEND_BASE_VALUE = void 0;
exports.getBlendToken = getBlendToken;
exports.getAllBlendTokens = getAllBlendTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Blend token base value for mathematical calculations
 */
exports.BLEND_BASE_VALUE = 0.04;
/**
 * Blend direction types for color modification
 */
var BlendDirection;
(function (BlendDirection) {
    BlendDirection["DARKER"] = "darker";
    BlendDirection["LIGHTER"] = "lighter";
    BlendDirection["SATURATE"] = "saturate";
    BlendDirection["DESATURATE"] = "desaturate"; // Decrease saturation
})(BlendDirection || (exports.BlendDirection = BlendDirection = {}));
/**
 * Generate platform values for blend tokens
 * All platforms use same unitless value (0.0 - 1.0)
 */
function generateBlendPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'unitless' },
        ios: { value: baseValue, unit: 'unitless' },
        android: { value: baseValue, unit: 'unitless' }
    };
}
/**
 * Blend tokens with 5-token scale from 4% to 20% in 4% increments
 */
exports.blendTokens = {
    blend100: {
        name: 'blend100',
        category: PrimitiveToken_1.TokenCategory.BLEND,
        baseValue: exports.BLEND_BASE_VALUE,
        familyBaseValue: exports.BLEND_BASE_VALUE,
        description: 'Subtle modification - gentle feedback, container hover',
        mathematicalRelationship: 'base × 1 = 0.04 × 1 = 0.04',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBlendPlatformValues(exports.BLEND_BASE_VALUE)
    },
    blend200: {
        name: 'blend200',
        category: PrimitiveToken_1.TokenCategory.BLEND,
        baseValue: exports.BLEND_BASE_VALUE * 2,
        familyBaseValue: exports.BLEND_BASE_VALUE,
        description: 'Standard modification - noticeable feedback, button hover',
        mathematicalRelationship: 'base × 2 = 0.04 × 2 = 0.08',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBlendPlatformValues(exports.BLEND_BASE_VALUE * 2)
    },
    blend300: {
        name: 'blend300',
        category: PrimitiveToken_1.TokenCategory.BLEND,
        baseValue: exports.BLEND_BASE_VALUE * 3,
        familyBaseValue: exports.BLEND_BASE_VALUE,
        description: 'Strong modification - clear feedback, pressed state',
        mathematicalRelationship: 'base × 3 = 0.04 × 3 = 0.12',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBlendPlatformValues(exports.BLEND_BASE_VALUE * 3)
    },
    blend400: {
        name: 'blend400',
        category: PrimitiveToken_1.TokenCategory.BLEND,
        baseValue: exports.BLEND_BASE_VALUE * 4,
        familyBaseValue: exports.BLEND_BASE_VALUE,
        description: 'Very strong modification - emphasized feedback',
        mathematicalRelationship: 'base × 4 = 0.04 × 4 = 0.16',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBlendPlatformValues(exports.BLEND_BASE_VALUE * 4)
    },
    blend500: {
        name: 'blend500',
        category: PrimitiveToken_1.TokenCategory.BLEND,
        baseValue: exports.BLEND_BASE_VALUE * 5,
        familyBaseValue: exports.BLEND_BASE_VALUE,
        description: 'Maximum modification - dramatic feedback',
        mathematicalRelationship: 'base × 5 = 0.04 × 5 = 0.20',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBlendPlatformValues(exports.BLEND_BASE_VALUE * 5)
    }
};
/**
 * Array of all blend token names for iteration
 */
exports.blendTokenNames = Object.keys(exports.blendTokens);
/**
 * Get blend token by name
 */
function getBlendToken(name) {
    return exports.blendTokens[name];
}
/**
 * Get all blend tokens as array
 */
function getAllBlendTokens() {
    return Object.values(exports.blendTokens);
}
//# sourceMappingURL=BlendTokens.js.map