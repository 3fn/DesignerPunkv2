"use strict";
/**
 * Baseline Grid Constants
 *
 * Central definition of baseline grid unit used throughout the design system.
 *
 * Grid Hierarchy:
 * - Primary Grid (8-unit): For spacing and radius tokens (space100, space200, etc.)
 * - Strategic Flexibility: Exceptional values that break the 8-unit grid
 *   - 2, 4, 6, 10, 12, 20 - for specific design needs
 *   - Usage should maintain ≥80% appropriate usage patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASELINE_GRID_UNIT = void 0;
exports.isBaselineGridAligned = isBaselineGridAligned;
exports.getNearestBaselineGridValues = getNearestBaselineGridValues;
/**
 * Primary baseline grid unit in unitless base value
 *
 * All spacing and radius tokens (except strategic flexibility tokens)
 * must align to multiples of this value.
 */
exports.BASELINE_GRID_UNIT = 8;
/**
 * Check if a value aligns with the primary baseline grid (8-unit)
 */
function isBaselineGridAligned(value) {
    return value % exports.BASELINE_GRID_UNIT === 0;
}
/**
 * Get the nearest baseline grid-aligned values (8-unit)
 */
function getNearestBaselineGridValues(value) {
    const lower = Math.floor(value / exports.BASELINE_GRID_UNIT) * exports.BASELINE_GRID_UNIT;
    const upper = Math.ceil(value / exports.BASELINE_GRID_UNIT) * exports.BASELINE_GRID_UNIT;
    const nearest = (value - lower) < (upper - value) ? lower : upper;
    return { lower, upper, nearest };
}
//# sourceMappingURL=BaselineGrid.js.map