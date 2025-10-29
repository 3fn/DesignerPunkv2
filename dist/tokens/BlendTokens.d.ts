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
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Blend token base value for mathematical calculations
 */
export declare const BLEND_BASE_VALUE = 0.04;
/**
 * Blend direction types for color modification
 */
export declare enum BlendDirection {
    DARKER = "darker",// Overlay black
    LIGHTER = "lighter",// Overlay white
    SATURATE = "saturate",// Increase saturation
    DESATURATE = "desaturate"
}
/**
 * Blend tokens with 5-token scale from 4% to 20% in 4% increments
 */
export declare const blendTokens: Record<string, PrimitiveToken>;
/**
 * Array of all blend token names for iteration
 */
export declare const blendTokenNames: string[];
/**
 * Get blend token by name
 */
export declare function getBlendToken(name: string): PrimitiveToken | undefined;
/**
 * Get all blend tokens as array
 */
export declare function getAllBlendTokens(): PrimitiveToken[];
//# sourceMappingURL=BlendTokens.d.ts.map