"use strict";
/**
 * Density Token Definitions
 *
 * Density tokens provide selective scaling for functional tokens (spacing, typography, tap areas)
 * while leaving aesthetic tokens (radius, line height ratios) unchanged.
 * Base value: 1.0 (no scaling applied)
 * Mathematical progression: Multipliers for functional token scaling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.densityTokenNames = exports.densityTokens = exports.DENSITY_BASE_VALUE = void 0;
exports.getDensityToken = getDensityToken;
exports.getAllDensityTokens = getAllDensityTokens;
exports.applyDensityScaling = applyDensityScaling;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Density token base value for mathematical calculations
 */
exports.DENSITY_BASE_VALUE = 1.0;
/**
 * Generate platform values for density tokens
 */
function generateDensityPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'unitless' },
        ios: { value: baseValue, unit: 'unitless' },
        android: { value: baseValue, unit: 'unitless' }
    };
}
/**
 * Density tokens with selective application to functional tokens
 */
exports.densityTokens = {
    densityCompact: {
        name: 'densityCompact',
        category: PrimitiveToken_1.TokenCategory.DENSITY,
        baseValue: 0.75,
        familyBaseValue: exports.DENSITY_BASE_VALUE,
        description: 'Compact density - reduces functional token values by 25%',
        mathematicalRelationship: 'base × 0.75 = 1.0 × 0.75 = 0.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Selective application to functional tokens
        platforms: generateDensityPlatformValues(0.75)
    },
    densityDefault: {
        name: 'densityDefault',
        category: PrimitiveToken_1.TokenCategory.DENSITY,
        baseValue: exports.DENSITY_BASE_VALUE,
        familyBaseValue: exports.DENSITY_BASE_VALUE,
        description: 'Default density - no scaling applied',
        mathematicalRelationship: 'base × 1 = 1.0 × 1 = 1.0',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Selective application to functional tokens
        platforms: generateDensityPlatformValues(exports.DENSITY_BASE_VALUE)
    },
    densityComfortable: {
        name: 'densityComfortable',
        category: PrimitiveToken_1.TokenCategory.DENSITY,
        baseValue: 1.25,
        familyBaseValue: exports.DENSITY_BASE_VALUE,
        description: 'Comfortable density - increases functional token values by 25%',
        mathematicalRelationship: 'base × 1.25 = 1.0 × 1.25 = 1.25',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Selective application to functional tokens
        platforms: generateDensityPlatformValues(1.25)
    },
    densitySpacious: {
        name: 'densitySpacious',
        category: PrimitiveToken_1.TokenCategory.DENSITY,
        baseValue: 1.5,
        familyBaseValue: exports.DENSITY_BASE_VALUE,
        description: 'Spacious density - increases functional token values by 50%',
        mathematicalRelationship: 'base × 1.5 = 1.0 × 1.5 = 1.5',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Selective application to functional tokens
        platforms: generateDensityPlatformValues(1.5)
    }
};
/**
 * Array of all density token names for iteration
 */
exports.densityTokenNames = Object.keys(exports.densityTokens);
/**
 * Get density token by name
 */
function getDensityToken(name) {
    return exports.densityTokens[name];
}
/**
 * Get all density tokens as array
 */
function getAllDensityTokens() {
    return Object.values(exports.densityTokens);
}
/**
 * Apply density scaling to functional token values
 * Functional tokens: spacing, fontSize, tapArea
 * Aesthetic tokens (radius, lineHeight ratios) are NOT scaled
 */
function applyDensityScaling(tokenValue, densityMultiplier, tokenCategory) {
    // Only apply density scaling to functional tokens
    const functionalTokens = [PrimitiveToken_1.TokenCategory.SPACING, PrimitiveToken_1.TokenCategory.FONT_SIZE, PrimitiveToken_1.TokenCategory.TAP_AREA];
    if (functionalTokens.includes(tokenCategory)) {
        return tokenValue * densityMultiplier;
    }
    // Aesthetic tokens remain unchanged
    return tokenValue;
}
//# sourceMappingURL=DensityTokens.js.map