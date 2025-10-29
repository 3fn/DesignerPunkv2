/**
 * Color Space Conversion Utilities
 *
 * Provides conversion functions between RGB, HSL, and Hex color formats
 * for blend token calculations. All conversions use sRGB color space
 * for consistent cross-platform results.
 *
 * @module blend/ColorSpaceUtils
 */
/**
 * RGB color representation
 */
export interface RGB {
    r: number;
    g: number;
    b: number;
}
/**
 * HSL color representation
 */
export interface HSL {
    h: number;
    s: number;
    l: number;
}
/**
 * Convert RGB color to HSL color space
 *
 * @param rgb - RGB color with values 0-255
 * @returns HSL color with h: 0-360, s: 0-1, l: 0-1
 *
 * @example
 * const hsl = rgbToHsl({ r: 168, g: 85, b: 247 });
 * // Returns: { h: 258, s: 0.90, l: 0.65 }
 */
export declare function rgbToHsl(rgb: RGB): HSL;
/**
 * Convert HSL color to RGB color space
 *
 * @param hsl - HSL color with h: 0-360, s: 0-1, l: 0-1
 * @returns RGB color with values 0-255
 *
 * @example
 * const rgb = hslToRgb({ h: 258, s: 0.90, l: 0.65 });
 * // Returns: { r: 168, g: 85, b: 247 }
 */
export declare function hslToRgb(hsl: HSL): RGB;
/**
 * Parse hex color string to RGB
 *
 * Supports both 3-digit and 6-digit hex formats with or without # prefix
 *
 * @param hex - Hex color string (e.g., "#A855F7", "A855F7", "#ABC", "ABC")
 * @returns RGB color with values 0-255
 * @throws Error if hex string is invalid
 *
 * @example
 * const rgb = hexToRgb("#A855F7");
 * // Returns: { r: 168, g: 85, b: 247 }
 *
 * const rgb2 = hexToRgb("#ABC");
 * // Returns: { r: 170, g: 187, b: 204 }
 */
export declare function hexToRgb(hex: string): RGB;
/**
 * Convert RGB color to hex string
 *
 * @param rgb - RGB color with values 0-255
 * @returns Hex color string with # prefix (e.g., "#A855F7")
 *
 * @example
 * const hex = rgbToHex({ r: 168, g: 85, b: 247 });
 * // Returns: "#A855F7"
 */
export declare function rgbToHex(rgb: RGB): string;
/**
 * Calculate darker blend by overlaying black at specified opacity
 *
 * Uses overlay formula: baseColor + (black at blendValue opacity)
 * This creates a darker version of the base color while maintaining
 * its hue characteristics.
 *
 * @param baseColor - RGB color to darken (values 0-255)
 * @param blendValue - Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)
 * @returns Darkened RGB color with values clamped to 0-255
 *
 * @example
 * // Darken purple500 by 8% (blend200)
 * const darker = calculateDarkerBlend({ r: 168, g: 85, b: 247 }, 0.08);
 * // Returns darker purple: { r: 154, g: 78, b: 227 }
 *
 * @example
 * // Darken blue500 by 12% (blend300)
 * const darker = calculateDarkerBlend({ r: 59, g: 130, b: 246 }, 0.12);
 * // Returns darker blue
 */
export declare function calculateDarkerBlend(baseColor: RGB, blendValue: number): RGB;
/**
 * Calculate lighter blend by overlaying white at specified opacity
 *
 * Uses overlay formula: baseColor + (white at blendValue opacity)
 * This creates a lighter version of the base color while maintaining
 * its hue characteristics.
 *
 * @param baseColor - RGB color to lighten (values 0-255)
 * @param blendValue - Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)
 * @returns Lightened RGB color with values clamped to 0-255
 *
 * @example
 * // Lighten purple500 by 8% (blend200)
 * const lighter = calculateLighterBlend({ r: 168, g: 85, b: 247 }, 0.08);
 * // Returns lighter purple: { r: 175, g: 98, b: 248 }
 *
 * @example
 * // Lighten blue500 by 12% (blend300)
 * const lighter = calculateLighterBlend({ r: 59, g: 130, b: 246 }, 0.12);
 * // Returns lighter blue
 */
export declare function calculateLighterBlend(baseColor: RGB, blendValue: number): RGB;
/**
 * Calculate saturate blend by increasing HSL saturation
 *
 * Converts RGB to HSL, increases saturation by the blend value,
 * then converts back to RGB. This creates a more vibrant, intense
 * version of the base color.
 *
 * @param baseColor - RGB color to saturate (values 0-255)
 * @param blendValue - Saturation increase amount as decimal (0.0-1.0, e.g., 0.08 for 8%)
 * @returns Saturated RGB color with values clamped to 0-255
 *
 * @example
 * // Saturate purple500 by 8% (blend200)
 * const saturated = calculateSaturateBlend({ r: 168, g: 85, b: 247 }, 0.08);
 * // Returns more vibrant purple with increased saturation
 *
 * @example
 * // Saturate blue500 by 12% (blend300)
 * const saturated = calculateSaturateBlend({ r: 59, g: 130, b: 246 }, 0.12);
 * // Returns more vibrant blue
 */
export declare function calculateSaturateBlend(baseColor: RGB, blendValue: number): RGB;
/**
 * Calculate desaturate blend by decreasing HSL saturation
 *
 * Converts RGB to HSL, decreases saturation by the blend value,
 * then converts back to RGB. This creates a more muted, less intense
 * version of the base color, useful for disabled states.
 *
 * @param baseColor - RGB color to desaturate (values 0-255)
 * @param blendValue - Saturation decrease amount as decimal (0.0-1.0, e.g., 0.08 for 8%)
 * @returns Desaturated RGB color with values clamped to 0-255
 *
 * @example
 * // Desaturate purple500 by 8% (blend200)
 * const desaturated = calculateDesaturateBlend({ r: 168, g: 85, b: 247 }, 0.08);
 * // Returns more muted purple with decreased saturation
 *
 * @example
 * // Desaturate blue500 by 12% (blend300) for disabled state
 * const desaturated = calculateDesaturateBlend({ r: 59, g: 130, b: 246 }, 0.12);
 * // Returns more muted blue
 */
export declare function calculateDesaturateBlend(baseColor: RGB, blendValue: number): RGB;
//# sourceMappingURL=ColorSpaceUtils.d.ts.map