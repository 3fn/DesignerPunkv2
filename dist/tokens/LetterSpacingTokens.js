"use strict";
/**
 * Letter Spacing Token Definitions
 *
 * Letter spacing tokens provide unitless values for character spacing adjustments.
 * Base value: 0 (normal spacing)
 * Mathematical progression: Em-based increments for typography refinement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.letterSpacingTokenNames = exports.letterSpacingTokens = exports.LETTER_SPACING_BASE_VALUE = void 0;
exports.getLetterSpacingToken = getLetterSpacingToken;
exports.getAllLetterSpacingTokens = getAllLetterSpacingTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Letter spacing token base value for mathematical calculations
 */
exports.LETTER_SPACING_BASE_VALUE = 0;
/**
 * Generate platform values for letter spacing tokens
 */
function generateLetterSpacingPlatformValues(spacing) {
    return {
        web: { value: spacing, unit: 'em' },
        ios: { value: spacing, unit: 'em' },
        android: { value: spacing, unit: 'em' }
    };
}
/**
 * Letter spacing tokens with em-based progression for typography refinement
 */
exports.letterSpacingTokens = {
    letterSpacing025: {
        name: 'letterSpacing025',
        category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
        baseValue: -0.025,
        familyBaseValue: exports.LETTER_SPACING_BASE_VALUE,
        description: 'Tight letter spacing for large text',
        mathematicalRelationship: 'base - 0.025 = 0 - 0.025 = -0.025',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision-targeted for typography refinement
        platforms: generateLetterSpacingPlatformValues(-0.025)
    },
    letterSpacing050: {
        name: 'letterSpacing050',
        category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
        baseValue: -0.05,
        familyBaseValue: exports.LETTER_SPACING_BASE_VALUE,
        description: 'Very tight letter spacing for display text',
        mathematicalRelationship: 'base - 0.05 = 0 - 0.05 = -0.05',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision-targeted for typography refinement
        platforms: generateLetterSpacingPlatformValues(-0.05)
    },
    letterSpacing100: {
        name: 'letterSpacing100',
        category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
        baseValue: exports.LETTER_SPACING_BASE_VALUE,
        familyBaseValue: exports.LETTER_SPACING_BASE_VALUE,
        description: 'Normal letter spacing - base unit',
        mathematicalRelationship: 'base × 1 = 0 × 1 = 0',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision-targeted for typography refinement
        platforms: generateLetterSpacingPlatformValues(exports.LETTER_SPACING_BASE_VALUE)
    },
    letterSpacing125: {
        name: 'letterSpacing125',
        category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
        baseValue: 0.025,
        familyBaseValue: exports.LETTER_SPACING_BASE_VALUE,
        description: 'Loose letter spacing for small text',
        mathematicalRelationship: 'base + 0.025 = 0 + 0.025 = 0.025',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision-targeted for typography refinement
        platforms: generateLetterSpacingPlatformValues(0.025)
    },
    letterSpacing150: {
        name: 'letterSpacing150',
        category: PrimitiveToken_1.TokenCategory.LETTER_SPACING,
        baseValue: 0.05,
        familyBaseValue: exports.LETTER_SPACING_BASE_VALUE,
        description: 'Very loose letter spacing for emphasis',
        mathematicalRelationship: 'base + 0.05 = 0 + 0.05 = 0.05',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true, // Precision-targeted for typography refinement
        platforms: generateLetterSpacingPlatformValues(0.05)
    }
};
/**
 * Array of all letter spacing token names for iteration
 */
exports.letterSpacingTokenNames = Object.keys(exports.letterSpacingTokens);
/**
 * Get letter spacing token by name
 */
function getLetterSpacingToken(name) {
    return exports.letterSpacingTokens[name];
}
/**
 * Get all letter spacing tokens as array
 */
function getAllLetterSpacingTokens() {
    return Object.values(exports.letterSpacingTokens);
}
//# sourceMappingURL=LetterSpacingTokens.js.map