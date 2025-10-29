"use strict";
/**
 * Color Space Conversion Utilities
 *
 * Provides conversion functions between RGB, HSL, and Hex color formats
 * for blend token calculations. All conversions use sRGB color space
 * for consistent cross-platform results.
 *
 * @module blend/ColorSpaceUtils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHsl = rgbToHsl;
exports.hslToRgb = hslToRgb;
exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;
exports.calculateDarkerBlend = calculateDarkerBlend;
exports.calculateLighterBlend = calculateLighterBlend;
exports.calculateSaturateBlend = calculateSaturateBlend;
exports.calculateDesaturateBlend = calculateDesaturateBlend;
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
function rgbToHsl(rgb) {
    // Normalize RGB values to 0-1 range
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (delta !== 0) {
        // Calculate saturation
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        // Calculate hue
        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / delta + 2) / 6;
                break;
            case b:
                h = ((r - g) / delta + 4) / 6;
                break;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Number(s.toFixed(4)),
        l: Number(l.toFixed(4))
    };
}
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
function hslToRgb(hsl) {
    const h = hsl.h / 360;
    const s = hsl.s;
    const l = hsl.l;
    let r, g, b;
    if (s === 0) {
        // Achromatic (gray)
        r = g = b = l;
    }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
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
function hexToRgb(hex) {
    // Remove # prefix if present
    const cleanHex = hex.replace(/^#/, '');
    // Validate hex string
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    // Expand 3-digit hex to 6-digit
    const fullHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;
    // Parse RGB values
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    return { r, g, b };
}
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
function rgbToHex(rgb) {
    const toHex = (value) => {
        const hex = Math.round(Math.max(0, Math.min(255, value))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}
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
function calculateDarkerBlend(baseColor, blendValue) {
    // Black overlay at specified opacity
    const black = { r: 0, g: 0, b: 0 };
    // Overlay formula: baseColor * (1 - blendValue) + black * blendValue
    // Since black is (0, 0, 0), this simplifies to: baseColor * (1 - blendValue)
    const r = baseColor.r * (1 - blendValue) + black.r * blendValue;
    const g = baseColor.g * (1 - blendValue) + black.g * blendValue;
    const b = baseColor.b * (1 - blendValue) + black.b * blendValue;
    // Clamp RGB values to 0-255 range and round
    return {
        r: Math.round(Math.max(0, Math.min(255, r))),
        g: Math.round(Math.max(0, Math.min(255, g))),
        b: Math.round(Math.max(0, Math.min(255, b)))
    };
}
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
function calculateLighterBlend(baseColor, blendValue) {
    // White overlay at specified opacity
    const white = { r: 255, g: 255, b: 255 };
    // Overlay formula: baseColor * (1 - blendValue) + white * blendValue
    const r = baseColor.r * (1 - blendValue) + white.r * blendValue;
    const g = baseColor.g * (1 - blendValue) + white.g * blendValue;
    const b = baseColor.b * (1 - blendValue) + white.b * blendValue;
    // Clamp RGB values to 0-255 range and round
    return {
        r: Math.round(Math.max(0, Math.min(255, r))),
        g: Math.round(Math.max(0, Math.min(255, g))),
        b: Math.round(Math.max(0, Math.min(255, b)))
    };
}
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
function calculateSaturateBlend(baseColor, blendValue) {
    // Convert RGB to HSL
    const hsl = rgbToHsl(baseColor);
    // Increase saturation, clamped to 0.0-1.0 range
    hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue));
    // Convert back to RGB
    return hslToRgb(hsl);
}
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
function calculateDesaturateBlend(baseColor, blendValue) {
    // Convert RGB to HSL
    const hsl = rgbToHsl(baseColor);
    // Decrease saturation, clamped to 0.0-1.0 range
    hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue));
    // Convert back to RGB
    return hslToRgb(hsl);
}
//# sourceMappingURL=ColorSpaceUtils.js.map