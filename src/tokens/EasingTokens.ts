/**
 * Easing Token Definitions
 * 
 * Easing tokens provide animation curve definitions for consistent motion feel across platforms.
 * Based on Material Design cubic-bezier curves for natural, physics-based motion.
 * 
 * Curve Characteristics:
 * - easingStandard: Balanced acceleration and deceleration for general transitions
 * - easingDecelerate: Quick start with gradual slowdown for entering elements
 * - easingAccelerate: Gradual start with quick finish for exiting elements
 * 
 * Usage Context:
 * - easingStandard: Most animations (float labels, state changes, general transitions)
 * - easingDecelerate: Elements entering the screen (modals, drawers, tooltips)
 * - easingAccelerate: Elements leaving the screen (dismissals, closures, exits)
 */

import { PrimitiveToken, TokenCategory, PlatformValues } from '../types/PrimitiveToken';

/**
 * Generate platform values for easing tokens
 * 
 * Platform-specific formats:
 * - Web: cubic-bezier CSS function - cubic-bezier(p1, p2, p3, p4)
 * - iOS: Animation.timingCurve Swift function - Animation.timingCurve(p1, p2, p3, p4)
 * - Android: CubicBezierEasing Kotlin function - CubicBezierEasing(p1f, p2f, p3f, p4f)
 * 
 * Note: The baseValue stores the cubic-bezier string for reference.
 * Platform-specific generation will convert to appropriate syntax.
 */
function generateEasingPlatformValues(cubicBezier: string): PlatformValues {
  return {
    web: { value: cubicBezier, unit: 'unitless' }, // CSS cubic-bezier format
    ios: { value: cubicBezier, unit: 'unitless' }, // Will be converted to Animation.timingCurve
    android: { value: cubicBezier, unit: 'unitless' } // Will be converted to CubicBezierEasing
  };
}

/**
 * Easing tokens with Material Design cubic-bezier curves
 */
export const easingTokens: Record<string, PrimitiveToken> = {
  easingStandard: {
    name: 'easingStandard',
    category: TokenCategory.SPACING, // Using SPACING temporarily until EASING category is added
    baseValue: 0, // N/A for categorical tokens - actual value stored in platforms
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Standard easing - Balanced acceleration and deceleration for general transitions. Material Design standard curve.',
    mathematicalRelationship: 'Material Design standard curve: cubic-bezier(0.4, 0.0, 0.2, 1)',
    baselineGridAlignment: false, // Easing tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateEasingPlatformValues('cubic-bezier(0.4, 0.0, 0.2, 1)')
  },

  easingDecelerate: {
    name: 'easingDecelerate',
    category: TokenCategory.SPACING, // Using SPACING temporarily until EASING category is added
    baseValue: 0, // N/A for categorical tokens - actual value stored in platforms
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Decelerate easing - Quick start with gradual slowdown for entering elements. Material Design deceleration curve.',
    mathematicalRelationship: 'Material Design deceleration curve: cubic-bezier(0.0, 0.0, 0.2, 1)',
    baselineGridAlignment: false, // Easing tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateEasingPlatformValues('cubic-bezier(0.0, 0.0, 0.2, 1)')
  },

  easingAccelerate: {
    name: 'easingAccelerate',
    category: TokenCategory.SPACING, // Using SPACING temporarily until EASING category is added
    baseValue: 0, // N/A for categorical tokens - actual value stored in platforms
    familyBaseValue: 0, // N/A for categorical tokens
    description: 'Accelerate easing - Gradual start with quick finish for exiting elements. Material Design acceleration curve.',
    mathematicalRelationship: 'Material Design acceleration curve: cubic-bezier(0.4, 0.0, 1, 1)',
    baselineGridAlignment: false, // Easing tokens don't align to baseline grid
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: generateEasingPlatformValues('cubic-bezier(0.4, 0.0, 1, 1)')
  }
};

/**
 * Array of all easing token names for iteration
 */
export const easingTokenNames = Object.keys(easingTokens);

/**
 * Get easing token by name
 * 
 * @param name - Token name (e.g., 'easingStandard', 'easingDecelerate', 'easingAccelerate')
 * @returns Easing token or undefined if not found
 * 
 * @example
 * const standardEasing = getEasingToken('easingStandard');
 * // Returns: { name: 'easingStandard', baseValue: 'cubic-bezier(0.4, 0.0, 0.2, 1)', ... }
 */
export function getEasingToken(name: string): PrimitiveToken | undefined {
  return easingTokens[name];
}

/**
 * Get all easing tokens as array
 * 
 * @returns Array of all easing tokens
 * 
 * @example
 * const allEasings = getAllEasingTokens();
 * // Returns: [easingStandard, easingDecelerate, easingAccelerate]
 */
export function getAllEasingTokens(): PrimitiveToken[] {
  return Object.values(easingTokens);
}
