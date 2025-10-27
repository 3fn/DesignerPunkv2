"use strict";
/**
 * Spacing Token Constants
 *
 * Central definition of spacing family base value and mathematical progressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPACING_MULTIPLIERS = exports.SPACING_BASE_VALUE = void 0;
exports.getSpacingValue = getSpacingValue;
exports.getSpacingTokenName = getSpacingTokenName;
const BaselineGrid_1 = require("./BaselineGrid");
/**
 * Spacing family base value (space100)
 *
 * This is the foundational value for the spacing token family.
 * All other spacing tokens are derived from this value through
 * mathematical relationships.
 */
exports.SPACING_BASE_VALUE = BaselineGrid_1.BASELINE_GRID_UNIT; // 8
/**
 * Common spacing multipliers
 *
 * Grid Alignment:
 * - 8-unit grid (primary): space100, space200, space300, space400, space600, space800
 * - Strategic flexibility: space025 (2), space050 (4), space075 (6), space125 (10), space150 (12), space250 (20)
 *
 * Note: Strategic flexibility tokens break the 8-unit grid for specific design needs.
 * Usage should maintain ≥80% appropriate usage patterns across the design system.
 */
exports.SPACING_MULTIPLIERS = {
    SPACE_025: 0.25, // space025 = 2 (strategic flexibility)
    SPACE_050: 0.5, // space050 = 4 (strategic flexibility)
    SPACE_075: 0.75, // space075 = 6 (strategic flexibility)
    SPACE_100: 1, // space100 = 8 (base, 8-unit grid)
    SPACE_150: 1.5, // space150 = 12 (strategic flexibility)
    SPACE_200: 2, // space200 = 16 (8-unit grid)
    SPACE_300: 3, // space300 = 24 (8-unit grid)
    SPACE_400: 4, // space400 = 32 (8-unit grid)
    SPACE_600: 6, // space600 = 48 (8-unit grid)
    SPACE_800: 8, // space800 = 64 (8-unit grid)
};
/**
 * Calculate spacing value from multiplier
 */
function getSpacingValue(multiplier) {
    return exports.SPACING_BASE_VALUE * multiplier;
}
/**
 * Get spacing token name from multiplier
 */
function getSpacingTokenName(multiplier) {
    const multiplierValue = Math.round(multiplier * 100);
    return `space${multiplierValue.toString().padStart(3, '0')}`;
}
//# sourceMappingURL=SpacingTokens.js.map