/**
 * Baseline Grid Constants
 * 
 * Central definition of baseline grid unit used throughout the design system.
 * 
 * Grid Hierarchy:
 * - Primary Grid (8-unit): For spacing and radius tokens
 * - Sub-Grid (4-unit): Exclusively for typography (line height, font size alignment)
 * - Strategic Flexibility: Exceptional values (2, 6, 10, 20) for specific design needs
 */

/**
 * Primary baseline grid unit in unitless base value
 * 
 * All spacing and radius tokens (except strategic flexibility tokens)
 * must align to multiples of this value.
 */
export const BASELINE_GRID_UNIT = 8;

/**
 * Typography sub-grid unit in unitless base value
 * 
 * Used exclusively for typography tokens (line height, font size alignment).
 * Spacing and radius tokens should NOT use this sub-grid.
 */
export const TYPOGRAPHY_SUB_GRID_UNIT = 4;

/**
 * Check if a value aligns with the primary baseline grid (8-unit)
 */
export function isBaselineGridAligned(value: number): boolean {
  return value % BASELINE_GRID_UNIT === 0;
}

/**
 * Check if a value aligns with the typography sub-grid (4-unit)
 * This should only be used for typography tokens.
 */
export function isTypographySubGridAligned(value: number): boolean {
  return value % TYPOGRAPHY_SUB_GRID_UNIT === 0;
}

/**
 * Get the nearest baseline grid-aligned values (8-unit)
 */
export function getNearestBaselineGridValues(value: number): {
  lower: number;
  upper: number;
  nearest: number;
} {
  const lower = Math.floor(value / BASELINE_GRID_UNIT) * BASELINE_GRID_UNIT;
  const upper = Math.ceil(value / BASELINE_GRID_UNIT) * BASELINE_GRID_UNIT;
  const nearest = (value - lower) < (upper - value) ? lower : upper;

  return { lower, upper, nearest };
}
