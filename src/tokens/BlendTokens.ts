/**
 * Blend Token Definitions
 * 
 * Blend tokens follow 0.04 base value with 5-token scale (4-20%) in 4% increments.
 * Base value: 0.04 (4%)
 * Mathematical progression: Systematic multiples of base value
 * Scale notation: blend100 = 1 × base, blend200 = 2 × base, etc.
 * 
 * Blend tokens create new opaque colors through mathematical operations:
 * - Darker: Overlay black at specified opacity
 * - Lighter: Overlay white at specified opacity
 * - Saturate: Increase color saturation in HSL space
 * - Desaturate: Decrease color saturation in HSL space
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Blend token base value for mathematical calculations
 */
export const BLEND_BASE_VALUE = 0.04;

/**
 * Blend direction types for color modification
 */
export enum BlendDirection {
  DARKER = 'darker',       // Overlay black
  LIGHTER = 'lighter',     // Overlay white
  SATURATE = 'saturate',   // Increase saturation
  DESATURATE = 'desaturate' // Decrease saturation
}

/**
 * Generate platform values for blend tokens
 * All platforms use same unitless value (0.0 - 1.0)
 */
function generateBlendPlatformValues(baseValue: number): PlatformValues {
  return {
    web: { value: baseValue, unit: 'unitless' },
    ios: { value: baseValue, unit: 'unitless' },
    android: { value: baseValue, unit: 'unitless' }
  };
}

/**
 * Blend tokens with 5-token scale from 4% to 20% in 4% increments
 */
export const blendTokens: Record<string, PrimitiveToken> = {
  blend100: {
    name: 'blend100',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Subtle modification - gentle feedback, container hover',
    mathematicalRelationship: 'base × 1 = 0.04 × 1 = 0.04',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE)
  },

  blend200: {
    name: 'blend200',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE * 2,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Standard modification - noticeable feedback, button hover',
    mathematicalRelationship: 'base × 2 = 0.04 × 2 = 0.08',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE * 2)
  },

  blend300: {
    name: 'blend300',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE * 3,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Strong modification - clear feedback, pressed state',
    mathematicalRelationship: 'base × 3 = 0.04 × 3 = 0.12',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE * 3)
  },

  blend400: {
    name: 'blend400',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE * 4,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Very strong modification - emphasized feedback',
    mathematicalRelationship: 'base × 4 = 0.04 × 4 = 0.16',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE * 4)
  },

  blend500: {
    name: 'blend500',
    category: TokenCategory.BLEND,
    baseValue: BLEND_BASE_VALUE * 5,
    familyBaseValue: BLEND_BASE_VALUE,
    description: 'Maximum modification - dramatic feedback',
    mathematicalRelationship: 'base × 5 = 0.04 × 5 = 0.20',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateBlendPlatformValues(BLEND_BASE_VALUE * 5)
  }
};

/**
 * Array of all blend token names for iteration
 */
export const blendTokenNames = Object.keys(blendTokens);

/**
 * Get blend token by name
 */
export function getBlendToken(name: string): PrimitiveToken | undefined {
  return blendTokens[name];
}

/**
 * Get all blend tokens as array
 */
export function getAllBlendTokens(): PrimitiveToken[] {
  return Object.values(blendTokens);
}
