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
 * Generate platform values for piecewise linear easing tokens
 * 
 * Platform-specific formats:
 * - Web: CSS linear() function
 * - iOS: PiecewiseLinearEasing (CustomAnimation) with stops array
 * - Android: Custom Easing with lookup table
 * 
 * The stops array is stored as the platform value; builders convert to platform syntax.
 */
function generateLinearEasingPlatformValues(stops: Array<[number, number]>): PlatformValues {
  const stopsJson = JSON.stringify(stops);
  return {
    web: { value: stopsJson, unit: 'unitless' },
    ios: { value: stopsJson, unit: 'unitless' },
    android: { value: stopsJson, unit: 'unitless' }
  };
}

/**
 * Easing tokens with Material Design cubic-bezier curves
 */
export const easingTokens: Record<string, PrimitiveToken> = {
  easingStandard: {
    name: 'easingStandard',
    category: TokenCategory.EASING,
    baseValue: 0,
    familyBaseValue: 0,
    description: 'Standard easing - Balanced acceleration and deceleration for general transitions. Material Design standard curve.',
    mathematicalRelationship: 'Material Design standard curve: cubic-bezier(0.4, 0.0, 0.2, 1)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    easingType: 'cubicBezier',
    platforms: generateEasingPlatformValues('cubic-bezier(0.4, 0.0, 0.2, 1)')
  },

  easingDecelerate: {
    name: 'easingDecelerate',
    category: TokenCategory.EASING,
    baseValue: 0,
    familyBaseValue: 0,
    description: 'Decelerate easing - Quick start with gradual slowdown for entering elements. Material Design deceleration curve.',
    mathematicalRelationship: 'Material Design deceleration curve: cubic-bezier(0.0, 0.0, 0.2, 1)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    easingType: 'cubicBezier',
    platforms: generateEasingPlatformValues('cubic-bezier(0.0, 0.0, 0.2, 1)')
  },

  easingAccelerate: {
    name: 'easingAccelerate',
    category: TokenCategory.EASING,
    baseValue: 0,
    familyBaseValue: 0,
    description: 'Accelerate easing - Gradual start with quick finish for exiting elements. Material Design acceleration curve.',
    mathematicalRelationship: 'Material Design acceleration curve: cubic-bezier(0.4, 0.0, 1, 1)',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    easingType: 'cubicBezier',
    platforms: generateEasingPlatformValues('cubic-bezier(0.4, 0.0, 1, 1)')
  },

  easingGlideDecelerate: {
    name: 'easingGlideDecelerate',
    category: TokenCategory.EASING,
    baseValue: 0,
    familyBaseValue: 0,
    description: 'Glide decelerate easing - Aggressive deceleration with long settling tail. 41% of movement in first 10% of time. No overshoot. Weighted slide-to-stop feel.',
    mathematicalRelationship: 'Piecewise linear: 15 stops, aggressive deceleration curve. Paired with duration350 (350ms).',
    baselineGridAlignment: false,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    easingType: 'linear',
    easingDuration: 350,
    stops: [
      [0, 0], [0.009, 0.012], [0.02, 0.05], [0.092, 0.411],
      [0.118, 0.517], [0.146, 0.611], [0.177, 0.694],
      [0.211, 0.765], [0.248, 0.824], [0.289, 0.872],
      [0.334, 0.91], [0.384, 0.939], [0.509, 0.977],
      [0.684, 0.994], [1.0, 1.0]
    ],
    platforms: generateLinearEasingPlatformValues([
      [0, 0], [0.009, 0.012], [0.02, 0.05], [0.092, 0.411],
      [0.118, 0.517], [0.146, 0.611], [0.177, 0.694],
      [0.211, 0.765], [0.248, 0.824], [0.289, 0.872],
      [0.334, 0.91], [0.384, 0.939], [0.509, 0.977],
      [0.684, 0.994], [1.0, 1.0]
    ])
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
