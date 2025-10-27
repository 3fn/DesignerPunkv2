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
/**
 * Primary baseline grid unit in unitless base value
 *
 * All spacing and radius tokens (except strategic flexibility tokens)
 * must align to multiples of this value.
 */
export declare const BASELINE_GRID_UNIT = 8;
/**
 * Check if a value aligns with the primary baseline grid (8-unit)
 */
export declare function isBaselineGridAligned(value: number): boolean;
/**
 * Get the nearest baseline grid-aligned values (8-unit)
 */
export declare function getNearestBaselineGridValues(value: number): {
    lower: number;
    upper: number;
    nearest: number;
};
//# sourceMappingURL=BaselineGrid.d.ts.map