/**
 * Duration Token Definitions
 * 
 * Duration tokens provide animation timing values for consistent motion across platforms.
 * Base value: 250ms (standard transition duration)
 * Mathematical progression: Linear +100ms/-100ms intervals for predictable timing
 * 
 * Usage Context:
 * - duration150: Fast interactions (hover, focus states, micro-interactions)
 * - duration250: Standard transitions (float labels, state changes, most animations)
 * - duration350: Deliberate animations (modals, drawers, complex transitions)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Duration token base value for mathematical calculations (milliseconds)
 */
export const DURATION_BASE_VALUE = 250;

/**
 * Generate platform values for duration tokens
 * 
 * Platform-specific units:
 * - Web: milliseconds (ms) - stored as unitless, converted during generation
 * - iOS: TimeInterval (seconds) - stored as seconds
 * - Android: milliseconds (ms) - stored as unitless, converted during generation
 */
function generateDurationPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' }, // Milliseconds, converted to ms in generation
    ios: { value: baseValue / 1000, unit: 'unitless' }, // TimeInterval in seconds
    android: { value: baseValue, unit: 'unitless' } // Milliseconds, converted to ms in generation
  };
}

/**
 * Duration tokens with linear progression for predictable animation timing
 */
export const durationTokens: Record<string, PrimitiveToken> = {
  duration150: {
    name: 'duration150',
    category: TokenCategory.SPACING, // Using SPACING temporarily until DURATION category is added
    baseValue: 150,
    familyBaseValue: DURATION_BASE_VALUE,
    description: 'Fast interactions - 150ms duration for hover, focus states, and micro-interactions',
    mathematicalRelationship: 'base - 100 = 250 - 100 = 150',
    baselineGridAlignment: false, // Duration tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateDurationPlatformValues(150)
  },

  duration250: {
    name: 'duration250',
    category: TokenCategory.SPACING, // Using SPACING temporarily until DURATION category is added
    baseValue: DURATION_BASE_VALUE,
    familyBaseValue: DURATION_BASE_VALUE,
    description: 'Standard transitions - 250ms duration for float labels, state changes, and most animations',
    mathematicalRelationship: 'base × 1 = 250 × 1 = 250',
    baselineGridAlignment: false, // Duration tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateDurationPlatformValues(DURATION_BASE_VALUE)
  },

  duration350: {
    name: 'duration350',
    category: TokenCategory.SPACING, // Using SPACING temporarily until DURATION category is added
    baseValue: 350,
    familyBaseValue: DURATION_BASE_VALUE,
    description: 'Deliberate animations - 350ms duration for modals, drawers, and complex transitions',
    mathematicalRelationship: 'base + 100 = 250 + 100 = 350',
    baselineGridAlignment: false, // Duration tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateDurationPlatformValues(350)
  }
};

/**
 * Array of all duration token names for iteration
 */
export const durationTokenNames = Object.keys(durationTokens);

/**
 * Get duration token by name
 * 
 * @param name - Token name (e.g., 'duration150', 'duration250', 'duration350')
 * @returns Duration token or undefined if not found
 * 
 * @example
 * const fastDuration = getDurationToken('duration150');
 * // Returns: { name: 'duration150', baseValue: 150, ... }
 */
export function getDurationToken(name: string): PrimitiveToken | undefined {
  return durationTokens[name];
}

/**
 * Get all duration tokens as array
 * 
 * @returns Array of all duration tokens
 * 
 * @example
 * const allDurations = getAllDurationTokens();
 * // Returns: [duration150, duration250, duration350]
 */
export function getAllDurationTokens(): PrimitiveToken[] {
  return Object.values(durationTokens);
}
