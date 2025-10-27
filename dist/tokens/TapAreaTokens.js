"use strict";
/**
 * Tap Area Token Definitions
 *
 * Tap area tokens use precision multipliers to achieve specific accessibility targets
 * while maintaining baseline grid alignment where possible.
 * Base value: 44 units (WCAG 2.1 AA minimum tap target size)
 * Mathematical progression: Precision-targeted multipliers for accessibility compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapAreaTokenNames = exports.tapAreaTokens = exports.TAP_AREA_BASE_VALUE = void 0;
exports.getTapAreaToken = getTapAreaToken;
exports.getAllTapAreaTokens = getAllTapAreaTokens;
exports.validateTapAreaAccessibility = validateTapAreaAccessibility;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Tap area token base value for mathematical calculations (WCAG 2.1 AA minimum)
 */
exports.TAP_AREA_BASE_VALUE = 44;
/**
 * Generate platform values for tapArea tokens
 */
function generateTapAreaPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'px' },
        ios: { value: baseValue, unit: 'pt' },
        android: { value: baseValue, unit: 'dp' }
    };
}
/**
 * TapArea tokens with precision multipliers for accessibility targets
 */
exports.tapAreaTokens = {
    tapAreaMinimum: {
        name: 'tapAreaMinimum',
        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
        baseValue: exports.TAP_AREA_BASE_VALUE,
        familyBaseValue: exports.TAP_AREA_BASE_VALUE,
        description: 'Minimum tap area - WCAG 2.1 AA compliance (44pt)',
        mathematicalRelationship: 'base × 1 = 44 × 1 = 44',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for accessibility targets
        platforms: generateTapAreaPlatformValues(exports.TAP_AREA_BASE_VALUE)
    },
    tapAreaRecommended: {
        name: 'tapAreaRecommended',
        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
        baseValue: Math.round(exports.TAP_AREA_BASE_VALUE * 1.09), // ~48pt for better usability
        familyBaseValue: exports.TAP_AREA_BASE_VALUE,
        description: 'Recommended tap area - enhanced usability (48pt)',
        mathematicalRelationship: 'base × 1.09 = 44 × 1.09 ≈ 48',
        baselineGridAlignment: true, // 48 aligns with 8-unit grid (8 × 6)
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for accessibility targets
        platforms: generateTapAreaPlatformValues(48)
    },
    tapAreaComfortable: {
        name: 'tapAreaComfortable',
        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
        baseValue: Math.round(exports.TAP_AREA_BASE_VALUE * 1.27), // ~56pt for comfortable interaction
        familyBaseValue: exports.TAP_AREA_BASE_VALUE,
        description: 'Comfortable tap area - spacious interaction (56pt)',
        mathematicalRelationship: 'base × 1.27 = 44 × 1.27 ≈ 56',
        baselineGridAlignment: true, // 56 aligns with 8-unit grid (8 × 7)
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for accessibility targets
        platforms: generateTapAreaPlatformValues(56)
    },
    tapAreaGenerous: {
        name: 'tapAreaGenerous',
        category: PrimitiveToken_1.TokenCategory.TAP_AREA,
        baseValue: Math.round(exports.TAP_AREA_BASE_VALUE * 1.45), // ~64pt for generous interaction
        familyBaseValue: exports.TAP_AREA_BASE_VALUE,
        description: 'Generous tap area - extra spacious interaction (64pt)',
        mathematicalRelationship: 'base × 1.45 = 44 × 1.45 ≈ 64',
        baselineGridAlignment: true, // 64 aligns with 8-unit grid (8 × 8)
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision multiplier for accessibility targets
        platforms: generateTapAreaPlatformValues(64)
    }
};
/**
 * Array of all tap area token names for iteration
 */
exports.tapAreaTokenNames = Object.keys(exports.tapAreaTokens);
/**
 * Get tap area token by name
 */
function getTapAreaToken(name) {
    return exports.tapAreaTokens[name];
}
/**
 * Get all tap area tokens as array
 */
function getAllTapAreaTokens() {
    return Object.values(exports.tapAreaTokens);
}
/**
 * Validate tap area meets accessibility requirements
 */
function validateTapAreaAccessibility(tapAreaValue) {
    if (tapAreaValue >= 44) {
        if (tapAreaValue >= 48) {
            return { isAccessible: true, level: 'AAA' };
        }
        return { isAccessible: true, level: 'AA' };
    }
    return {
        isAccessible: false,
        level: 'Below AA',
        recommendation: `Increase tap area to at least ${exports.TAP_AREA_BASE_VALUE}pt for WCAG 2.1 AA compliance`
    };
}
//# sourceMappingURL=TapAreaTokens.js.map