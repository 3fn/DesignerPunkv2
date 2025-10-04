/**
 * Baseline Grid Constants
 * 
 * Central definition of baseline grid unit used throughout the design system.
 * Changing this value will affect all spacing and radius tokens that require
 * baseline grid alignment.
 */

/**
 * Baseline grid unit in unitless base value
 * 
 * All spacing and radius tokens (except strategic flexibility tokens)
 * must align to multiples of this value.
 */
export const BASELINE_GRID_UNIT = 8;

/**
 * Check if a value aligns with the baseline grid
 */
export function isBaselineGridAligned(value: number): boolean {
  return value % BASELINE_GRID_UNIT === 0;
}

/**
 * Get the nearest baseline grid-aligned values
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
