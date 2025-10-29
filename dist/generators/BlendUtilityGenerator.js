"use strict";
/**
 * Blend Utility Generator
 *
 * Generates platform-specific blend utility functions that calculate
 * blended colors at runtime using blend values. Outputs TypeScript
 * functions for web that work with hex color strings.
 *
 * @module generators/BlendUtilityGenerator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendUtilityGenerator = void 0;
/**
 * Blend Utility Generator
 * Generates platform-specific blend utility functions
 */
class BlendUtilityGenerator {
    /**
     * Generate blend utilities for web platform (TypeScript)
     *
     * Outputs TypeScript functions that work with hex color strings:
     * - darkerBlend(color, blendValue): string
     * - lighterBlend(color, blendValue): string
     * - saturate(color, blendValue): string
     * - desaturate(color, blendValue): string
     *
     * @param options - Generation options
     * @returns TypeScript code as string
     */
    generateWebBlendUtilities(options = {}) {
        const { includeComments = true, includeColorSpaceUtils = true } = options;
        const lines = [];
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Blend Utility Functions');
            lines.push(' * ');
            lines.push(' * Runtime color calculation utilities for blend tokens.');
            lines.push(' * All functions accept hex color strings and blend values,');
            lines.push(' * returning the calculated color as a hex string.');
            lines.push(' * ');
            lines.push(' * @example');
            lines.push(' * import { BlendTokens, darkerBlend } from "@designerpunk/tokens";');
            lines.push(' * ');
            lines.push(' * const hoverColor = darkerBlend("#A855F7", BlendTokens.blend200);');
            lines.push(' * // Returns: "#9A4EE3" (purple500 + 8% black)');
            lines.push(' */');
            lines.push('');
        }
        // Include color space utilities if requested
        if (includeColorSpaceUtils) {
            lines.push(this.generateColorSpaceUtilities(includeComments));
            lines.push('');
        }
        // Generate darkerBlend function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate darker blend by overlaying black');
            lines.push(' * ');
            lines.push(' * @param color - Base color as hex string (e.g., "#A855F7")');
            lines.push(' * @param blendValue - Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push(' * @returns Darkened color as hex string');
            lines.push(' * ');
            lines.push(' * @example');
            lines.push(' * const darker = darkerBlend("#A855F7", 0.08);');
            lines.push(' * // Returns: "#9A4EE3" (8% darker purple)');
            lines.push(' */');
        }
        lines.push('export function darkerBlend(color: string, blendValue: number): string {');
        lines.push('  const rgb = hexToRgb(color);');
        lines.push('  const black = { r: 0, g: 0, b: 0 };');
        lines.push('  const blended = {');
        lines.push('    r: Math.round(rgb.r * (1 - blendValue) + black.r * blendValue),');
        lines.push('    g: Math.round(rgb.g * (1 - blendValue) + black.g * blendValue),');
        lines.push('    b: Math.round(rgb.b * (1 - blendValue) + black.b * blendValue)');
        lines.push('  };');
        lines.push('  return rgbToHex(blended);');
        lines.push('}');
        lines.push('');
        // Generate lighterBlend function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate lighter blend by overlaying white');
            lines.push(' * ');
            lines.push(' * @param color - Base color as hex string (e.g., "#A855F7")');
            lines.push(' * @param blendValue - Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push(' * @returns Lightened color as hex string');
            lines.push(' * ');
            lines.push(' * @example');
            lines.push(' * const lighter = lighterBlend("#A855F7", 0.08);');
            lines.push(' * // Returns: "#AF62F8" (8% lighter purple)');
            lines.push(' */');
        }
        lines.push('export function lighterBlend(color: string, blendValue: number): string {');
        lines.push('  const rgb = hexToRgb(color);');
        lines.push('  const white = { r: 255, g: 255, b: 255 };');
        lines.push('  const blended = {');
        lines.push('    r: Math.round(rgb.r * (1 - blendValue) + white.r * blendValue),');
        lines.push('    g: Math.round(rgb.g * (1 - blendValue) + white.g * blendValue),');
        lines.push('    b: Math.round(rgb.b * (1 - blendValue) + white.b * blendValue)');
        lines.push('  };');
        lines.push('  return rgbToHex(blended);');
        lines.push('}');
        lines.push('');
        // Generate saturate function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate saturate blend by increasing HSL saturation');
            lines.push(' * ');
            lines.push(' * @param color - Base color as hex string (e.g., "#A855F7")');
            lines.push(' * @param blendValue - Saturation increase as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push(' * @returns Saturated color as hex string');
            lines.push(' * ');
            lines.push(' * @example');
            lines.push(' * const saturated = saturate("#A855F7", 0.08);');
            lines.push(' * // Returns more vibrant purple (8% more saturated)');
            lines.push(' */');
        }
        lines.push('export function saturate(color: string, blendValue: number): string {');
        lines.push('  const rgb = hexToRgb(color);');
        lines.push('  const hsl = rgbToHsl(rgb);');
        lines.push('  hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue));');
        lines.push('  const saturated = hslToRgb(hsl);');
        lines.push('  return rgbToHex(saturated);');
        lines.push('}');
        lines.push('');
        // Generate desaturate function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate desaturate blend by decreasing HSL saturation');
            lines.push(' * ');
            lines.push(' * @param color - Base color as hex string (e.g., "#A855F7")');
            lines.push(' * @param blendValue - Saturation decrease as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push(' * @returns Desaturated color as hex string');
            lines.push(' * ');
            lines.push(' * @example');
            lines.push(' * const desaturated = desaturate("#A855F7", 0.08);');
            lines.push(' * // Returns more muted purple (8% less saturated)');
            lines.push(' */');
        }
        lines.push('export function desaturate(color: string, blendValue: number): string {');
        lines.push('  const rgb = hexToRgb(color);');
        lines.push('  const hsl = rgbToHsl(rgb);');
        lines.push('  hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue));');
        lines.push('  const desaturated = hslToRgb(hsl);');
        lines.push('  return rgbToHex(desaturated);');
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate blend utilities for iOS platform (Swift)
     *
     * Outputs Swift Color extension methods that work with SwiftUI Color:
     * - darkerBlend(_ amount: Double) -> Color
     * - lighterBlend(_ amount: Double) -> Color
     * - saturate(_ amount: Double) -> Color
     * - desaturate(_ amount: Double) -> Color
     *
     * @param options - Generation options
     * @returns Swift code as string
     */
    generateiOSBlendUtilities(options = {}) {
        const { includeComments = true, includeColorSpaceUtils = true } = options;
        const lines = [];
        if (includeComments) {
            lines.push('//');
            lines.push('// Blend Utility Functions');
            lines.push('//');
            lines.push('// Runtime color calculation utilities for blend tokens.');
            lines.push('// All functions accept blend values and return calculated colors.');
            lines.push('//');
            lines.push('// Example:');
            lines.push('// import DesignerPunkTokens');
            lines.push('//');
            lines.push('// let hoverColor = Color(hex: "A855F7").darkerBlend(BlendTokens.blend200)');
            lines.push('// // Returns: Color(hex: "9A4EE3") (purple500 + 8% black)');
            lines.push('//');
            lines.push('');
        }
        lines.push('import SwiftUI');
        lines.push('');
        // Include color space utilities if requested
        if (includeColorSpaceUtils) {
            lines.push(this.generateiOSColorSpaceUtilities(includeComments));
            lines.push('');
        }
        // Generate Color extension with blend methods
        lines.push('extension Color {');
        lines.push('');
        // Generate darkerBlend method
        if (includeComments) {
            lines.push('    /// Calculate darker blend by overlaying black');
            lines.push('    ///');
            lines.push('    /// - Parameter amount: Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push('    /// - Returns: Darkened color');
            lines.push('    ///');
            lines.push('    /// Example:');
            lines.push('    /// ```swift');
            lines.push('    /// let darker = Color(hex: "A855F7").darkerBlend(0.08)');
            lines.push('    /// // Returns: Color(hex: "9A4EE3") (8% darker purple)');
            lines.push('    /// ```');
        }
        lines.push('    func darkerBlend(_ amount: Double) -> Color {');
        lines.push('        let rgb = self.toRGB()');
        lines.push('        let black = RGB(r: 0, g: 0, b: 0)');
        lines.push('        let blended = RGB(');
        lines.push('            r: Int(round(Double(rgb.r) * (1 - amount) + Double(black.r) * amount)),');
        lines.push('            g: Int(round(Double(rgb.g) * (1 - amount) + Double(black.g) * amount)),');
        lines.push('            b: Int(round(Double(rgb.b) * (1 - amount) + Double(black.b) * amount))');
        lines.push('        )');
        lines.push('        return Color(rgb: blended)');
        lines.push('    }');
        lines.push('');
        // Generate lighterBlend method
        if (includeComments) {
            lines.push('    /// Calculate lighter blend by overlaying white');
            lines.push('    ///');
            lines.push('    /// - Parameter amount: Blend amount as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push('    /// - Returns: Lightened color');
            lines.push('    ///');
            lines.push('    /// Example:');
            lines.push('    /// ```swift');
            lines.push('    /// let lighter = Color(hex: "A855F7").lighterBlend(0.08)');
            lines.push('    /// // Returns: Color(hex: "AF62F8") (8% lighter purple)');
            lines.push('    /// ```');
        }
        lines.push('    func lighterBlend(_ amount: Double) -> Color {');
        lines.push('        let rgb = self.toRGB()');
        lines.push('        let white = RGB(r: 255, g: 255, b: 255)');
        lines.push('        let blended = RGB(');
        lines.push('            r: Int(round(Double(rgb.r) * (1 - amount) + Double(white.r) * amount)),');
        lines.push('            g: Int(round(Double(rgb.g) * (1 - amount) + Double(white.g) * amount)),');
        lines.push('            b: Int(round(Double(rgb.b) * (1 - amount) + Double(white.b) * amount))');
        lines.push('        )');
        lines.push('        return Color(rgb: blended)');
        lines.push('    }');
        lines.push('');
        // Generate saturate method
        if (includeComments) {
            lines.push('    /// Calculate saturate blend by increasing HSL saturation');
            lines.push('    ///');
            lines.push('    /// - Parameter amount: Saturation increase as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push('    /// - Returns: Saturated color');
            lines.push('    ///');
            lines.push('    /// Example:');
            lines.push('    /// ```swift');
            lines.push('    /// let saturated = Color(hex: "A855F7").saturate(0.08)');
            lines.push('    /// // Returns more vibrant purple (8% more saturated)');
            lines.push('    /// ```');
        }
        lines.push('    func saturate(_ amount: Double) -> Color {');
        lines.push('        let rgb = self.toRGB()');
        lines.push('        var hsl = rgb.toHSL()');
        lines.push('        hsl.s = max(0.0, min(1.0, hsl.s + amount))');
        lines.push('        let saturated = hsl.toRGB()');
        lines.push('        return Color(rgb: saturated)');
        lines.push('    }');
        lines.push('');
        // Generate desaturate method
        if (includeComments) {
            lines.push('    /// Calculate desaturate blend by decreasing HSL saturation');
            lines.push('    ///');
            lines.push('    /// - Parameter amount: Saturation decrease as decimal (0.0-1.0, e.g., 0.08 for 8%)');
            lines.push('    /// - Returns: Desaturated color');
            lines.push('    ///');
            lines.push('    /// Example:');
            lines.push('    /// ```swift');
            lines.push('    /// let desaturated = Color(hex: "A855F7").desaturate(0.08)');
            lines.push('    /// // Returns more muted purple (8% less saturated)');
            lines.push('    /// ```');
        }
        lines.push('    func desaturate(_ amount: Double) -> Color {');
        lines.push('        let rgb = self.toRGB()');
        lines.push('        var hsl = rgb.toHSL()');
        lines.push('        hsl.s = max(0.0, min(1.0, hsl.s - amount))');
        lines.push('        let desaturated = hsl.toRGB()');
        lines.push('        return Color(rgb: desaturated)');
        lines.push('    }');
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate blend utilities for Android platform (Kotlin)
     *
     * Outputs Kotlin Color extension functions that work with Compose Color:
     * - darkerBlend(amount: Float): Color
     * - lighterBlend(amount: Float): Color
     * - saturate(amount: Float): Color
     * - desaturate(amount: Float): Color
     *
     * @param options - Generation options
     * @returns Kotlin code as string
     */
    generateAndroidBlendUtilities(options = {}) {
        const { includeComments = true, includeColorSpaceUtils = true } = options;
        const lines = [];
        if (includeComments) {
            lines.push('//');
            lines.push('// Blend Utility Functions');
            lines.push('//');
            lines.push('// Runtime color calculation utilities for blend tokens.');
            lines.push('// All functions accept blend values and return calculated colors.');
            lines.push('//');
            lines.push('// Example:');
            lines.push('// import com.designerpunk.tokens.BlendTokens');
            lines.push('// import com.designerpunk.tokens.darkerBlend');
            lines.push('//');
            lines.push('// val hoverColor = Color(0xFFA855F7).darkerBlend(BlendTokens.blend200)');
            lines.push('// // Returns: Color(0xFF9A4EE3) (purple500 + 8% black)');
            lines.push('//');
            lines.push('');
        }
        lines.push('package com.designerpunk.tokens');
        lines.push('');
        lines.push('import androidx.compose.ui.graphics.Color');
        lines.push('import kotlin.math.max');
        lines.push('import kotlin.math.min');
        lines.push('import kotlin.math.round');
        lines.push('');
        // Include color space utilities if requested
        if (includeColorSpaceUtils) {
            lines.push(this.generateAndroidColorSpaceUtilities(includeComments));
            lines.push('');
        }
        // Generate darkerBlend extension function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate darker blend by overlaying black');
            lines.push(' *');
            lines.push(' * @param amount Blend amount as decimal (0.0-1.0, e.g., 0.08f for 8%)');
            lines.push(' * @return Darkened color');
            lines.push(' *');
            lines.push(' * Example:');
            lines.push(' * ```kotlin');
            lines.push(' * val darker = Color(0xFFA855F7).darkerBlend(0.08f)');
            lines.push(' * // Returns: Color(0xFF9A4EE3) (8% darker purple)');
            lines.push(' * ```');
            lines.push(' */');
        }
        lines.push('fun Color.darkerBlend(amount: Float): Color {');
        lines.push('    val rgb = this.toRGB()');
        lines.push('    val black = RGB(0, 0, 0)');
        lines.push('    val blended = RGB(');
        lines.push('        r = round(rgb.r * (1 - amount) + black.r * amount).toInt(),');
        lines.push('        g = round(rgb.g * (1 - amount) + black.g * amount).toInt(),');
        lines.push('        b = round(rgb.b * (1 - amount) + black.b * amount).toInt()');
        lines.push('    )');
        lines.push('    return blended.toColor()');
        lines.push('}');
        lines.push('');
        // Generate lighterBlend extension function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate lighter blend by overlaying white');
            lines.push(' *');
            lines.push(' * @param amount Blend amount as decimal (0.0-1.0, e.g., 0.08f for 8%)');
            lines.push(' * @return Lightened color');
            lines.push(' *');
            lines.push(' * Example:');
            lines.push(' * ```kotlin');
            lines.push(' * val lighter = Color(0xFFA855F7).lighterBlend(0.08f)');
            lines.push(' * // Returns: Color(0xFFAF62F8) (8% lighter purple)');
            lines.push(' * ```');
            lines.push(' */');
        }
        lines.push('fun Color.lighterBlend(amount: Float): Color {');
        lines.push('    val rgb = this.toRGB()');
        lines.push('    val white = RGB(255, 255, 255)');
        lines.push('    val blended = RGB(');
        lines.push('        r = round(rgb.r * (1 - amount) + white.r * amount).toInt(),');
        lines.push('        g = round(rgb.g * (1 - amount) + white.g * amount).toInt(),');
        lines.push('        b = round(rgb.b * (1 - amount) + white.b * amount).toInt()');
        lines.push('    )');
        lines.push('    return blended.toColor()');
        lines.push('}');
        lines.push('');
        // Generate saturate extension function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate saturate blend by increasing HSL saturation');
            lines.push(' *');
            lines.push(' * @param amount Saturation increase as decimal (0.0-1.0, e.g., 0.08f for 8%)');
            lines.push(' * @return Saturated color');
            lines.push(' *');
            lines.push(' * Example:');
            lines.push(' * ```kotlin');
            lines.push(' * val saturated = Color(0xFFA855F7).saturate(0.08f)');
            lines.push(' * // Returns more vibrant purple (8% more saturated)');
            lines.push(' * ```');
            lines.push(' */');
        }
        lines.push('fun Color.saturate(amount: Float): Color {');
        lines.push('    val rgb = this.toRGB()');
        lines.push('    val hsl = rgb.toHSL()');
        lines.push('    val saturated = hsl.copy(s = max(0.0f, min(1.0f, hsl.s + amount)))');
        lines.push('    return saturated.toRGB().toColor()');
        lines.push('}');
        lines.push('');
        // Generate desaturate extension function
        if (includeComments) {
            lines.push('/**');
            lines.push(' * Calculate desaturate blend by decreasing HSL saturation');
            lines.push(' *');
            lines.push(' * @param amount Saturation decrease as decimal (0.0-1.0, e.g., 0.08f for 8%)');
            lines.push(' * @return Desaturated color');
            lines.push(' *');
            lines.push(' * Example:');
            lines.push(' * ```kotlin');
            lines.push(' * val desaturated = Color(0xFFA855F7).desaturate(0.08f)');
            lines.push(' * // Returns more muted purple (8% less saturated)');
            lines.push(' * ```');
            lines.push(' */');
        }
        lines.push('fun Color.desaturate(amount: Float): Color {');
        lines.push('    val rgb = this.toRGB()');
        lines.push('    val hsl = rgb.toHSL()');
        lines.push('    val desaturated = hsl.copy(s = max(0.0f, min(1.0f, hsl.s - amount)))');
        lines.push('    return desaturated.toRGB().toColor()');
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate Android color space utility functions
     *
     * @param includeComments - Whether to include comments
     * @returns Kotlin code for color space utilities
     */
    generateAndroidColorSpaceUtilities(includeComments) {
        const lines = [];
        if (includeComments) {
            lines.push('// Color Space Utilities');
            lines.push('// Internal utilities for color conversion');
            lines.push('');
        }
        // RGB data class
        lines.push('data class RGB(val r: Int, val g: Int, val b: Int) {');
        lines.push('    fun toHSL(): HSL {');
        lines.push('        val r = this.r / 255.0f');
        lines.push('        val g = this.g / 255.0f');
        lines.push('        val b = this.b / 255.0f');
        lines.push('');
        lines.push('        val max = maxOf(r, g, b)');
        lines.push('        val min = minOf(r, g, b)');
        lines.push('        val delta = max - min');
        lines.push('');
        lines.push('        var h = 0f');
        lines.push('        var s = 0f');
        lines.push('        val l = (max + min) / 2');
        lines.push('');
        lines.push('        if (delta != 0f) {');
        lines.push('            s = if (l > 0.5f) delta / (2 - max - min) else delta / (max + min)');
        lines.push('');
        lines.push('            h = when (max) {');
        lines.push('                r -> ((g - b) / delta + (if (g < b) 6 else 0)) / 6');
        lines.push('                g -> ((b - r) / delta + 2) / 6');
        lines.push('                b -> ((r - g) / delta + 4) / 6');
        lines.push('                else -> 0f');
        lines.push('            }');
        lines.push('        }');
        lines.push('');
        lines.push('        return HSL(');
        lines.push('            h = round(h * 360).toInt(),');
        lines.push('            s = s,');
        lines.push('            l = l');
        lines.push('        )');
        lines.push('    }');
        lines.push('');
        lines.push('    fun toColor(): Color {');
        lines.push('        return Color(');
        lines.push('            red = r / 255f,');
        lines.push('            green = g / 255f,');
        lines.push('            blue = b / 255f');
        lines.push('        )');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        // HSL data class
        lines.push('data class HSL(val h: Int, val s: Float, val l: Float) {');
        lines.push('    fun toRGB(): RGB {');
        lines.push('        val h = this.h / 360.0f');
        lines.push('        val s = this.s');
        lines.push('        val l = this.l');
        lines.push('');
        lines.push('        val r: Float');
        lines.push('        val g: Float');
        lines.push('        val b: Float');
        lines.push('');
        lines.push('        if (s == 0f) {');
        lines.push('            r = l');
        lines.push('            g = l');
        lines.push('            b = l');
        lines.push('        } else {');
        lines.push('            fun hue2rgb(p: Float, q: Float, t: Float): Float {');
        lines.push('                var t = t');
        lines.push('                if (t < 0) t += 1');
        lines.push('                if (t > 1) t -= 1');
        lines.push('                if (t < 1f / 6) return p + (q - p) * 6 * t');
        lines.push('                if (t < 1f / 2) return q');
        lines.push('                if (t < 2f / 3) return p + (q - p) * (2f / 3 - t) * 6');
        lines.push('                return p');
        lines.push('            }');
        lines.push('');
        lines.push('            val q = if (l < 0.5f) l * (1 + s) else l + s - l * s');
        lines.push('            val p = 2 * l - q');
        lines.push('            r = hue2rgb(p, q, h + 1f / 3)');
        lines.push('            g = hue2rgb(p, q, h)');
        lines.push('            b = hue2rgb(p, q, h - 1f / 3)');
        lines.push('        }');
        lines.push('');
        lines.push('        return RGB(');
        lines.push('            r = round(r * 255).toInt(),');
        lines.push('            g = round(g * 255).toInt(),');
        lines.push('            b = round(b * 255).toInt()');
        lines.push('        )');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        // Color extension for conversion
        lines.push('fun Color.toRGB(): RGB {');
        lines.push('    return RGB(');
        lines.push('        r = (red * 255).toInt(),');
        lines.push('        g = (green * 255).toInt(),');
        lines.push('        b = (blue * 255).toInt()');
        lines.push('    )');
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate iOS color space utility functions
     *
     * @param includeComments - Whether to include comments
     * @returns Swift code for color space utilities
     */
    generateiOSColorSpaceUtilities(includeComments) {
        const lines = [];
        if (includeComments) {
            lines.push('// Color Space Utilities');
            lines.push('// Internal utilities for color conversion');
            lines.push('');
        }
        // RGB struct
        lines.push('struct RGB {');
        lines.push('    let r: Int');
        lines.push('    let g: Int');
        lines.push('    let b: Int');
        lines.push('');
        lines.push('    func toHSL() -> HSL {');
        lines.push('        let r = Double(self.r) / 255.0');
        lines.push('        let g = Double(self.g) / 255.0');
        lines.push('        let b = Double(self.b) / 255.0');
        lines.push('');
        lines.push('        let max = Swift.max(r, g, b)');
        lines.push('        let min = Swift.min(r, g, b)');
        lines.push('        let delta = max - min');
        lines.push('');
        lines.push('        var h: Double = 0');
        lines.push('        var s: Double = 0');
        lines.push('        let l = (max + min) / 2');
        lines.push('');
        lines.push('        if delta != 0 {');
        lines.push('            s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)');
        lines.push('');
        lines.push('            switch max {');
        lines.push('            case r:');
        lines.push('                h = ((g - b) / delta + (g < b ? 6 : 0)) / 6');
        lines.push('            case g:');
        lines.push('                h = ((b - r) / delta + 2) / 6');
        lines.push('            case b:');
        lines.push('                h = ((r - g) / delta + 4) / 6');
        lines.push('            default:');
        lines.push('                break');
        lines.push('            }');
        lines.push('        }');
        lines.push('');
        lines.push('        return HSL(');
        lines.push('            h: Int(round(h * 360)),');
        lines.push('            s: Double(String(format: "%.4f", s))!,');
        lines.push('            l: Double(String(format: "%.4f", l))!');
        lines.push('        )');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        // HSL struct
        lines.push('struct HSL {');
        lines.push('    let h: Int');
        lines.push('    var s: Double');
        lines.push('    let l: Double');
        lines.push('');
        lines.push('    func toRGB() -> RGB {');
        lines.push('        let h = Double(self.h) / 360.0');
        lines.push('        let s = self.s');
        lines.push('        let l = self.l');
        lines.push('');
        lines.push('        var r: Double, g: Double, b: Double');
        lines.push('');
        lines.push('        if s == 0 {');
        lines.push('            r = l');
        lines.push('            g = l');
        lines.push('            b = l');
        lines.push('        } else {');
        lines.push('            func hue2rgb(_ p: Double, _ q: Double, _ t: Double) -> Double {');
        lines.push('                var t = t');
        lines.push('                if t < 0 { t += 1 }');
        lines.push('                if t > 1 { t -= 1 }');
        lines.push('                if t < 1/6 { return p + (q - p) * 6 * t }');
        lines.push('                if t < 1/2 { return q }');
        lines.push('                if t < 2/3 { return p + (q - p) * (2/3 - t) * 6 }');
        lines.push('                return p');
        lines.push('            }');
        lines.push('');
        lines.push('            let q = l < 0.5 ? l * (1 + s) : l + s - l * s');
        lines.push('            let p = 2 * l - q');
        lines.push('            r = hue2rgb(p, q, h + 1/3)');
        lines.push('            g = hue2rgb(p, q, h)');
        lines.push('            b = hue2rgb(p, q, h - 1/3)');
        lines.push('        }');
        lines.push('');
        lines.push('        return RGB(');
        lines.push('            r: Int(round(r * 255)),');
        lines.push('            g: Int(round(g * 255)),');
        lines.push('            b: Int(round(b * 255))');
        lines.push('        )');
        lines.push('    }');
        lines.push('}');
        lines.push('');
        // Color extensions for conversion
        lines.push('extension Color {');
        lines.push('    init(rgb: RGB) {');
        lines.push('        self.init(');
        lines.push('            red: Double(rgb.r) / 255.0,');
        lines.push('            green: Double(rgb.g) / 255.0,');
        lines.push('            blue: Double(rgb.b) / 255.0');
        lines.push('        )');
        lines.push('    }');
        lines.push('');
        lines.push('    init(hex: String) {');
        lines.push('        let cleanHex = hex.replacingOccurrences(of: "#", with: "")');
        lines.push('        let scanner = Scanner(string: cleanHex)');
        lines.push('        var hexNumber: UInt64 = 0');
        lines.push('');
        lines.push('        if scanner.scanHexInt64(&hexNumber) {');
        lines.push('            let r = Int((hexNumber & 0xFF0000) >> 16)');
        lines.push('            let g = Int((hexNumber & 0x00FF00) >> 8)');
        lines.push('            let b = Int(hexNumber & 0x0000FF)');
        lines.push('            self.init(rgb: RGB(r: r, g: g, b: b))');
        lines.push('        } else {');
        lines.push('            self.init(red: 0, green: 0, blue: 0)');
        lines.push('        }');
        lines.push('    }');
        lines.push('');
        lines.push('    func toRGB() -> RGB {');
        lines.push('        #if canImport(UIKit)');
        lines.push('        var r: CGFloat = 0');
        lines.push('        var g: CGFloat = 0');
        lines.push('        var b: CGFloat = 0');
        lines.push('        var a: CGFloat = 0');
        lines.push('        UIColor(self).getRed(&r, green: &g, blue: &b, alpha: &a)');
        lines.push('        return RGB(r: Int(r * 255), g: Int(g * 255), b: Int(b * 255))');
        lines.push('        #else');
        lines.push('        let nsColor = NSColor(self)');
        lines.push('        var r: CGFloat = 0');
        lines.push('        var g: CGFloat = 0');
        lines.push('        var b: CGFloat = 0');
        lines.push('        var a: CGFloat = 0');
        lines.push('        nsColor.getRed(&r, green: &g, blue: &b, alpha: &a)');
        lines.push('        return RGB(r: Int(r * 255), g: Int(g * 255), b: Int(b * 255))');
        lines.push('        #endif');
        lines.push('    }');
        lines.push('}');
        return lines.join('\n');
    }
    /**
     * Generate color space utility functions
     *
     * @param includeComments - Whether to include JSDoc comments
     * @returns TypeScript code for color space utilities
     */
    generateColorSpaceUtilities(includeComments) {
        const lines = [];
        if (includeComments) {
            lines.push('// Color Space Utilities');
            lines.push('// Internal utilities for color conversion');
            lines.push('');
        }
        // RGB interface
        lines.push('interface RGB {');
        lines.push('  r: number;');
        lines.push('  g: number;');
        lines.push('  b: number;');
        lines.push('}');
        lines.push('');
        // HSL interface
        lines.push('interface HSL {');
        lines.push('  h: number;');
        lines.push('  s: number;');
        lines.push('  l: number;');
        lines.push('}');
        lines.push('');
        // hexToRgb function
        lines.push('function hexToRgb(hex: string): RGB {');
        lines.push('  const cleanHex = hex.replace(/^#/, "");');
        lines.push('  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {');
        lines.push('    throw new Error(`Invalid hex color: ${hex}`);');
        lines.push('  }');
        lines.push('  const fullHex = cleanHex.length === 3');
        lines.push('    ? cleanHex.split("").map(char => char + char).join("")');
        lines.push('    : cleanHex;');
        lines.push('  return {');
        lines.push('    r: parseInt(fullHex.substring(0, 2), 16),');
        lines.push('    g: parseInt(fullHex.substring(2, 4), 16),');
        lines.push('    b: parseInt(fullHex.substring(4, 6), 16)');
        lines.push('  };');
        lines.push('}');
        lines.push('');
        // rgbToHex function
        lines.push('function rgbToHex(rgb: RGB): string {');
        lines.push('  const toHex = (value: number): string => {');
        lines.push('    const hex = Math.round(Math.max(0, Math.min(255, value))).toString(16);');
        lines.push('    return hex.length === 1 ? "0" + hex : hex;');
        lines.push('  };');
        lines.push('  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();');
        lines.push('}');
        lines.push('');
        // rgbToHsl function
        lines.push('function rgbToHsl(rgb: RGB): HSL {');
        lines.push('  const r = rgb.r / 255;');
        lines.push('  const g = rgb.g / 255;');
        lines.push('  const b = rgb.b / 255;');
        lines.push('  const max = Math.max(r, g, b);');
        lines.push('  const min = Math.min(r, g, b);');
        lines.push('  const delta = max - min;');
        lines.push('  let h = 0;');
        lines.push('  let s = 0;');
        lines.push('  const l = (max + min) / 2;');
        lines.push('  if (delta !== 0) {');
        lines.push('    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);');
        lines.push('    switch (max) {');
        lines.push('      case r:');
        lines.push('        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;');
        lines.push('        break;');
        lines.push('      case g:');
        lines.push('        h = ((b - r) / delta + 2) / 6;');
        lines.push('        break;');
        lines.push('      case b:');
        lines.push('        h = ((r - g) / delta + 4) / 6;');
        lines.push('        break;');
        lines.push('    }');
        lines.push('  }');
        lines.push('  return {');
        lines.push('    h: Math.round(h * 360),');
        lines.push('    s: Number(s.toFixed(4)),');
        lines.push('    l: Number(l.toFixed(4))');
        lines.push('  };');
        lines.push('}');
        lines.push('');
        // hslToRgb function
        lines.push('function hslToRgb(hsl: HSL): RGB {');
        lines.push('  const h = hsl.h / 360;');
        lines.push('  const s = hsl.s;');
        lines.push('  const l = hsl.l;');
        lines.push('  let r: number, g: number, b: number;');
        lines.push('  if (s === 0) {');
        lines.push('    r = g = b = l;');
        lines.push('  } else {');
        lines.push('    const hue2rgb = (p: number, q: number, t: number): number => {');
        lines.push('      if (t < 0) t += 1;');
        lines.push('      if (t > 1) t -= 1;');
        lines.push('      if (t < 1 / 6) return p + (q - p) * 6 * t;');
        lines.push('      if (t < 1 / 2) return q;');
        lines.push('      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;');
        lines.push('      return p;');
        lines.push('    };');
        lines.push('    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;');
        lines.push('    const p = 2 * l - q;');
        lines.push('    r = hue2rgb(p, q, h + 1 / 3);');
        lines.push('    g = hue2rgb(p, q, h);');
        lines.push('    b = hue2rgb(p, q, h - 1 / 3);');
        lines.push('  }');
        lines.push('  return {');
        lines.push('    r: Math.round(r * 255),');
        lines.push('    g: Math.round(g * 255),');
        lines.push('    b: Math.round(b * 255)');
        lines.push('  };');
        lines.push('}');
        return lines.join('\n');
    }
}
exports.BlendUtilityGenerator = BlendUtilityGenerator;
//# sourceMappingURL=BlendUtilityGenerator.js.map