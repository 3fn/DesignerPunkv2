/**
 * Blend Calculator Orchestrator
 *
 * Orchestrates blend calculations by routing to the appropriate blend function
 * based on the specified direction. Accepts color as hex string, blend token,
 * and direction, then returns the calculated color as hex string.
 *
 * @module blend/BlendCalculator
 */
import { BlendDirection } from '../tokens/BlendTokens';
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Blend Calculator class that orchestrates blend operations
 *
 * Routes blend calculations to the appropriate function based on direction
 * and handles color format conversions (hex → RGB → blend → hex)
 */
export declare class BlendCalculator {
    /**
     * Calculate blended color based on direction
     *
     * @param baseColor - Base color as hex string (e.g., "#A855F7")
     * @param blendToken - Blend token containing blend value
     * @param direction - Blend direction (darker, lighter, saturate, desaturate)
     * @returns Calculated color as hex string (e.g., "#9A4EE3")
     * @throws Error if hex color is invalid or direction is unsupported
     *
     * @example
     * const calculator = new BlendCalculator();
     *
     * // Darken purple500 by 8% (blend200)
     * const darker = calculator.calculateBlend("#A855F7", blend200Token, BlendDirection.DARKER);
     * // Returns: "#9A4EE3"
     *
     * // Lighten purple500 by 8% (blend200)
     * const lighter = calculator.calculateBlend("#A855F7", blend200Token, BlendDirection.LIGHTER);
     * // Returns: "#AF62F8"
     *
     * // Saturate purple500 by 8% (blend200)
     * const saturated = calculator.calculateBlend("#A855F7", blend200Token, BlendDirection.SATURATE);
     * // Returns more vibrant purple
     *
     * // Desaturate purple500 by 8% (blend200)
     * const desaturated = calculator.calculateBlend("#A855F7", blend200Token, BlendDirection.DESATURATE);
     * // Returns more muted purple
     */
    calculateBlend(baseColor: string, blendToken: PrimitiveToken, direction: BlendDirection): string;
}
/**
 * Convenience function for calculating blends without instantiating BlendCalculator
 *
 * @param baseColor - Base color as hex string (e.g., "#A855F7")
 * @param blendToken - Blend token containing blend value
 * @param direction - Blend direction (darker, lighter, saturate, desaturate)
 * @returns Calculated color as hex string (e.g., "#9A4EE3")
 *
 * @example
 * import { calculateBlend } from './BlendCalculator';
 * import { blendTokens, BlendDirection } from '../tokens/BlendTokens';
 *
 * const darker = calculateBlend("#A855F7", blendTokens.blend200, BlendDirection.DARKER);
 * // Returns: "#9A4EE3"
 */
export declare function calculateBlend(baseColor: string, blendToken: PrimitiveToken, direction: BlendDirection): string;
//# sourceMappingURL=BlendCalculator.d.ts.map