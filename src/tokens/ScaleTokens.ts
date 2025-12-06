/**
 * Scale Token Definitions
 * 
 * Scale tokens provide transform-based animation scale factors for consistent sizing animations.
 * Base value: 1.00 (100% scale, no transformation)
 * Mathematical progression: 8-interval progression (0.04 increments) aligned with 8px baseline grid philosophy
 * 
 * Usage Context:
 * - scale088: Float label scale (16px × 0.88 = 14.08px → rounds to 14px)
 * - scale092: Subtle scale down for pressed states
 * - scale096: Button press feedback, subtle emphasis reduction
 * - scale100: Default/reset state, no transformation
 * - scale104: Hover emphasis, subtle scale up
 * - scale108: Strong emphasis, significant scale up
 * 
 * Rounding Behavior:
 * Scale tokens are applied during token generation, and results are rounded to whole pixel values
 * to ensure consistent rendering across platforms without subpixel rendering issues.
 * 
 * Example Calculations:
 * - 16px × 0.88 = 14.08px → rounds to 14px
 * - 16px × 0.92 = 14.72px → rounds to 15px
 * - 16px × 0.96 = 15.36px → rounds to 15px
 * - 16px × 1.00 = 16.00px → 16px (no rounding needed)
 * - 16px × 1.04 = 16.64px → rounds to 17px
 * - 16px × 1.08 = 17.28px → rounds to 17px
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Scale token base value for mathematical calculations (unitless scale factor)
 */
export const SCALE_BASE_VALUE = 1.00;

/**
 * Generate platform values for scale tokens
 * 
 * Platform-specific formats:
 * - Web: Unitless scale factor for CSS transform: scale()
 * - iOS: CGFloat scale factor for SwiftUI .scaleEffect()
 * - Android: Float scale factor for Compose .scale()
 * 
 * All platforms use the same unitless scale factor value.
 */
function generateScalePlatformValues(scaleFactor: number): PlatformValues {
  return {
    web: { value: scaleFactor, unit: 'unitless' }, // CSS transform: scale(0.88)
    ios: { value: scaleFactor, unit: 'unitless' }, // SwiftUI .scaleEffect(0.88)
    android: { value: scaleFactor, unit: 'unitless' } // Compose .scale(0.88f)
  };
}

/**
 * Scale tokens with 8-interval progression aligned with baseline grid philosophy
 */
export const scaleTokens: Record<string, PrimitiveToken> = {
  scale088: {
    name: 'scale088',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: 0.88,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Float label scale - 88% scale for text input label transitions. Example: 16px × 0.88 = 14.08px → rounds to 14px',
    mathematicalRelationship: 'base - 0.12 = 1.00 - 0.12 = 0.88 (8-interval progression: 3 × 0.04)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(0.88)
  },

  scale092: {
    name: 'scale092',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: 0.92,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Subtle scale down - 92% scale for pressed states and subtle emphasis reduction. Example: 16px × 0.92 = 14.72px → rounds to 15px',
    mathematicalRelationship: 'base - 0.08 = 1.00 - 0.08 = 0.92 (8-interval progression: 2 × 0.04)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(0.92)
  },

  scale096: {
    name: 'scale096',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: 0.96,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Button press feedback - 96% scale for button press states and subtle emphasis reduction. Example: 16px × 0.96 = 15.36px → rounds to 15px',
    mathematicalRelationship: 'base - 0.04 = 1.00 - 0.04 = 0.96 (8-interval progression: 1 × 0.04)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(0.96)
  },

  scale100: {
    name: 'scale100',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: SCALE_BASE_VALUE,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Default state - 100% scale, no transformation. Example: 16px × 1.00 = 16px',
    mathematicalRelationship: 'base × 1 = 1.00 × 1 = 1.00 (baseline, no transformation)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(SCALE_BASE_VALUE)
  },

  scale104: {
    name: 'scale104',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: 1.04,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Hover emphasis - 104% scale for hover states and subtle emphasis. Example: 16px × 1.04 = 16.64px → rounds to 17px',
    mathematicalRelationship: 'base + 0.04 = 1.00 + 0.04 = 1.04 (8-interval progression: 1 × 0.04)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(1.04)
  },

  scale108: {
    name: 'scale108',
    category: TokenCategory.SPACING, // Using SPACING temporarily until SCALE category is added
    baseValue: 1.08,
    familyBaseValue: SCALE_BASE_VALUE,
    description: 'Strong emphasis - 108% scale for strong hover emphasis and significant scale up. Example: 16px × 1.08 = 17.28px → rounds to 17px',
    mathematicalRelationship: 'base + 0.08 = 1.00 + 0.08 = 1.08 (8-interval progression: 2 × 0.04)',
    baselineGridAlignment: false, // Scale tokens don't align to baseline grid directly
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateScalePlatformValues(1.08)
  }
};

/**
 * Array of all scale token names for iteration
 */
export const scaleTokenNames = Object.keys(scaleTokens);

/**
 * Get scale token by name
 * 
 * @param name - Token name (e.g., 'scale088', 'scale092', 'scale096', 'scale100', 'scale104', 'scale108')
 * @returns Scale token or undefined if not found
 * 
 * @example
 * const floatLabelScale = getScaleToken('scale088');
 * // Returns: { name: 'scale088', baseValue: 0.88, ... }
 */
export function getScaleToken(name: string): PrimitiveToken | undefined {
  return scaleTokens[name];
}

/**
 * Get all scale tokens as array
 * 
 * @returns Array of all scale tokens
 * 
 * @example
 * const allScales = getAllScaleTokens();
 * // Returns: [scale088, scale092, scale096, scale100, scale104, scale108]
 */
export function getAllScaleTokens(): PrimitiveToken[] {
  return Object.values(scaleTokens);
}
