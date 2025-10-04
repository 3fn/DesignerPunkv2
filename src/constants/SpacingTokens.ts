/**
 * Spacing Token Constants
 * 
 * Central definition of spacing family base value and mathematical progressions.
 */

import { BASELINE_GRID_UNIT } from './BaselineGrid';

/**
 * Spacing family base value (space100)
 * 
 * This is the foundational value for the spacing token family.
 * All other spacing tokens are derived from this value through
 * mathematical relationships.
 */
export const SPACING_BASE_VALUE = BASELINE_GRID_UNIT; // 8

/**
 * Common spacing multipliers
 * 
 * Grid Alignment:
 * - 8-unit grid (primary): space100, space200, space300, space400, space600, space800
 * - Strategic flexibility: space025 (2), space075 (6), space125 (10), space250 (20)
 * 
 * Note: space050 (4) and space150 (12) align to 4-unit sub-grid but should NOT be used
 * for spacing/radius. The 4-unit sub-grid is reserved exclusively for typography.
 */
export const SPACING_MULTIPLIERS = {
  SPACE_025: 0.25,  // space025 = 2 (strategic flexibility)
  SPACE_050: 0.5,   // space050 = 4 (DEPRECATED: use typography sub-grid only)
  SPACE_075: 0.75,  // space075 = 6 (strategic flexibility)
  SPACE_100: 1,     // space100 = 8 (base, 8-unit grid)
  SPACE_150: 1.5,   // space150 = 12 (DEPRECATED: use typography sub-grid only)
  SPACE_200: 2,     // space200 = 16 (8-unit grid)
  SPACE_300: 3,     // space300 = 24 (8-unit grid)
  SPACE_400: 4,     // space400 = 32 (8-unit grid)
  SPACE_600: 6,     // space600 = 48 (8-unit grid)
  SPACE_800: 8,     // space800 = 64 (8-unit grid)
} as const;

/**
 * Calculate spacing value from multiplier
 */
export function getSpacingValue(multiplier: number): number {
  return SPACING_BASE_VALUE * multiplier;
}

/**
 * Get spacing token name from multiplier
 */
export function getSpacingTokenName(multiplier: number): string {
  const multiplierValue = Math.round(multiplier * 100);
  return `space${multiplierValue.toString().padStart(3, '0')}`;
}
