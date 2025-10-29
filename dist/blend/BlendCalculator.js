"use strict";
/**
 * Blend Calculator Orchestrator
 *
 * Orchestrates blend calculations by routing to the appropriate blend function
 * based on the specified direction. Accepts color as hex string, blend token,
 * and direction, then returns the calculated color as hex string.
 *
 * @module blend/BlendCalculator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendCalculator = void 0;
exports.calculateBlend = calculateBlend;
const ColorSpaceUtils_1 = require("./ColorSpaceUtils");
const BlendTokens_1 = require("../tokens/BlendTokens");
/**
 * Blend Calculator class that orchestrates blend operations
 *
 * Routes blend calculations to the appropriate function based on direction
 * and handles color format conversions (hex → RGB → blend → hex)
 */
class BlendCalculator {
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
    calculateBlend(baseColor, blendToken, direction) {
        // Parse hex color to RGB
        const rgb = (0, ColorSpaceUtils_1.hexToRgb)(baseColor);
        // Get blend value from token
        const blendValue = blendToken.baseValue;
        // Route to appropriate blend function based on direction
        let blendedRgb;
        switch (direction) {
            case BlendTokens_1.BlendDirection.DARKER:
                blendedRgb = (0, ColorSpaceUtils_1.calculateDarkerBlend)(rgb, blendValue);
                break;
            case BlendTokens_1.BlendDirection.LIGHTER:
                blendedRgb = (0, ColorSpaceUtils_1.calculateLighterBlend)(rgb, blendValue);
                break;
            case BlendTokens_1.BlendDirection.SATURATE:
                blendedRgb = (0, ColorSpaceUtils_1.calculateSaturateBlend)(rgb, blendValue);
                break;
            case BlendTokens_1.BlendDirection.DESATURATE:
                blendedRgb = (0, ColorSpaceUtils_1.calculateDesaturateBlend)(rgb, blendValue);
                break;
            default:
                throw new Error(`Unsupported blend direction: ${direction}`);
        }
        // Convert blended RGB back to hex
        return (0, ColorSpaceUtils_1.rgbToHex)(blendedRgb);
    }
}
exports.BlendCalculator = BlendCalculator;
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
function calculateBlend(baseColor, blendToken, direction) {
    const calculator = new BlendCalculator();
    return calculator.calculateBlend(baseColor, blendToken, direction);
}
//# sourceMappingURL=BlendCalculator.js.map