/**
 * Breakpoint Token Definitions
 * 
 * Breakpoint tokens define viewport width thresholds for responsive behavior.
 * Primarily used by web platforms for media queries and responsive grid systems.
 * Values are practical device-based measurements rather than mathematical progressions.
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Breakpoint token base value (smallest breakpoint)
 */
export const BREAKPOINT_BASE_VALUE = 320;

/**
 * Generate platform values for breakpoint tokens
 */
function generateBreakpointPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'px' },
    ios: { value: baseValue, unit: 'pt' },
    android: { value: baseValue, unit: 'dp' }
  };
}

/**
 * Breakpoint tokens with practical device-based values
 */
export const breakpointTokens: Record<string, PrimitiveToken> = {
  breakpointXs: {
    name: 'breakpointXs',
    category: TokenCategory.BREAKPOINT,
    baseValue: 320,
    familyBaseValue: BREAKPOINT_BASE_VALUE,
    description: 'Small mobile viewport baseline',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBreakpointPlatformValues(320)
  },

  breakpointSm: {
    name: 'breakpointSm',
    category: TokenCategory.BREAKPOINT,
    baseValue: 375,
    familyBaseValue: BREAKPOINT_BASE_VALUE,
    description: 'iPhone standard width and large mobile',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBreakpointPlatformValues(375)
  },

  breakpointMd: {
    name: 'breakpointMd',
    category: TokenCategory.BREAKPOINT,
    baseValue: 1024,
    familyBaseValue: BREAKPOINT_BASE_VALUE,
    description: 'Desktop and tablet landscape transition',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBreakpointPlatformValues(1024)
  },

  breakpointLg: {
    name: 'breakpointLg',
    category: TokenCategory.BREAKPOINT,
    baseValue: 1440,
    familyBaseValue: BREAKPOINT_BASE_VALUE,
    description: 'Large desktop and wide screen displays',
    mathematicalRelationship: 'Practical device-based value',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBreakpointPlatformValues(1440)
  }
};

/**
 * Array of all breakpoint token names for iteration
 */
export const breakpointTokenNames = Object.keys(breakpointTokens);

/**
 * Get breakpoint token by name
 */
export function getBreakpointToken(name: string): PrimitiveToken | undefined {
  return breakpointTokens[name];
}

/**
 * Get all breakpoint tokens as array
 */
export function getAllBreakpointTokens(): PrimitiveToken[] {
  return Object.values(breakpointTokens);
}
