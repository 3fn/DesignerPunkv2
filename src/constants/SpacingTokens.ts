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
 */
export const SPACING_MULTIPLIERS = {
  SPACE_025: 0.25,  // space025 = 2
  SPACE_050: 0.5,   // space050 = 4
  SPACE_075: 0.75,  // space075 = 6 (strategic flexibility)
  SPACE_100: 1,     // space100 = 8 (base)
  SPACE_150: 1.5,   // space150 = 12
  SPACE_200: 2,     // space200 = 16
  SPACE_300: 3,     // space300 = 24
  SPACE_400: 4,     // space400 = 32
  SPACE_600: 6,     // space600 = 48
  SPACE_800: 8,     // space800 = 64
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
