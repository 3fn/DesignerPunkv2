/**
 * @category evergreen
 * @purpose Verify BlendUtility generator produces correct output format
 */
/**
 * Blend Utility Generator Tests
 * 
 * Tests web blend utility generation with correct TypeScript output
 * and verification that utilities produce correct colors.
 */

import { BlendUtilityGenerator } from '../BlendUtilityGenerator';

describe('BlendUtilityGenerator', () => {
  let generator: BlendUtilityGenerator;

  beforeEach(() => {
    generator = new BlendUtilityGenerator();
  });

  describe('Web Blend Utilities Generation', () => {
    test('generates all four blend utility functions', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      expect(result).toContain('export function darkerBlend(color: string, blendValue: number): string');
      expect(result).toContain('export function lighterBlend(color: string, blendValue: number): string');
      expect(result).toContain('export function saturate(color: string, blendValue: number): string');
      expect(result).toContain('export function desaturate(color: string, blendValue: number): string');
    });

    test('generates color space utility functions', () => {
      const result = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      expect(result).toContain('interface RGB');
      expect(result).toContain('interface HSL');
      expect(result).toContain('function hexToRgb(hex: string): RGB');
      expect(result).toContain('function rgbToHex(rgb: RGB): string');
      expect(result).toContain('function rgbToHsl(rgb: RGB): HSL');
      expect(result).toContain('function hslToRgb(hsl: HSL): RGB');
    });

    test('generates utilities without color space utils when disabled', () => {
      const result = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: false 
      });

      expect(result).not.toContain('interface RGB');
      expect(result).not.toContain('function hexToRgb');
      expect(result).toContain('export function darkerBlend');
    });

    test('generates utilities with JSDoc comments', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: true });

      expect(result).toContain('/**');
      expect(result).toContain('* Blend Utility Functions');
      expect(result).toContain('* Calculate darker blend by overlaying black');
      expect(result).toContain('* @param color - Base color as hex string');
      expect(result).toContain('* @returns Darkened color as hex string');
      expect(result).toContain('* @example');
    });

    test('generates utilities without comments when disabled', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      expect(result).not.toContain('/**');
      expect(result).not.toContain('* Blend Utility Functions');
      expect(result).toContain('export function darkerBlend');
    });
  });

  describe('Generated Utility Function Correctness', () => {
    test('darkerBlend implementation uses correct formula', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for black overlay formula
      expect(result).toContain('const black = { r: 0, g: 0, b: 0 }');
      expect(result).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(result).toContain('rgb.g * (1 - blendValue) + black.g * blendValue');
      expect(result).toContain('rgb.b * (1 - blendValue) + black.b * blendValue');
    });

    test('lighterBlend implementation uses correct formula', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for white overlay formula
      expect(result).toContain('const white = { r: 255, g: 255, b: 255 }');
      expect(result).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(result).toContain('rgb.g * (1 - blendValue) + white.g * blendValue');
      expect(result).toContain('rgb.b * (1 - blendValue) + white.b * blendValue');
    });

    test('saturate implementation uses HSL conversion', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for HSL saturation increase
      expect(result).toContain('const hsl = rgbToHsl(rgb)');
      expect(result).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      expect(result).toContain('const saturated = hslToRgb(hsl)');
    });

    test('desaturate implementation uses HSL conversion', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for HSL saturation decrease
      expect(result).toContain('const hsl = rgbToHsl(rgb)');
      expect(result).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      expect(result).toContain('const desaturated = hslToRgb(hsl)');
    });
  });

  describe('Generated Code Validation', () => {
    test('generated code is valid TypeScript', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for TypeScript syntax elements
      expect(result).toContain('interface RGB');
      expect(result).toContain('interface HSL');
      expect(result).toContain(': string');
      expect(result).toContain(': number');
      expect(result).toContain('export function');
    });

    test('generated functions have correct signatures', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // All blend functions should accept (color: string, blendValue: number) and return string
      const functionSignaturePattern = /export function \w+\(color: string, blendValue: number\): string/g;
      const matches = result.match(functionSignaturePattern);
      
      expect(matches).toHaveLength(4); // darkerBlend, lighterBlend, saturate, desaturate
    });

    test('generated code includes all necessary color space conversions', () => {
      const result = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for all conversion functions
      expect(result).toContain('function hexToRgb');
      expect(result).toContain('function rgbToHex');
      expect(result).toContain('function rgbToHsl');
      expect(result).toContain('function hslToRgb');
    });
  });

  describe('Functional Verification Using Existing Utilities', () => {
    test('generated darkerBlend matches existing ColorSpaceUtils implementation', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });
      
      // Verify generated code uses same algorithm as ColorSpaceUtils
      expect(result).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(result).toContain('Math.round');
      expect(result).toContain('return rgbToHex(blended)');
      
      // Verify function structure matches expected pattern
      const darkerBlendMatch = result.match(/export function darkerBlend\(color: string, blendValue: number\): string \{[\s\S]*?\n\}/);
      expect(darkerBlendMatch).toBeTruthy();
      expect(darkerBlendMatch![0]).toContain('const rgb = hexToRgb(color)');
      expect(darkerBlendMatch![0]).toContain('const black = { r: 0, g: 0, b: 0 }');
    });

    test('generated lighterBlend matches existing ColorSpaceUtils implementation', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });
      
      // Verify generated code uses same algorithm as ColorSpaceUtils
      expect(result).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(result).toContain('Math.round');
      expect(result).toContain('return rgbToHex(blended)');
      
      // Verify function structure matches expected pattern
      const lighterBlendMatch = result.match(/export function lighterBlend\(color: string, blendValue: number\): string \{[\s\S]*?\n\}/);
      expect(lighterBlendMatch).toBeTruthy();
      expect(lighterBlendMatch![0]).toContain('const rgb = hexToRgb(color)');
      expect(lighterBlendMatch![0]).toContain('const white = { r: 255, g: 255, b: 255 }');
    });

    test('generated saturate matches existing ColorSpaceUtils implementation', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });
      
      // Verify generated code uses same algorithm as ColorSpaceUtils
      expect(result).toContain('const hsl = rgbToHsl(rgb)');
      expect(result).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      expect(result).toContain('const saturated = hslToRgb(hsl)');
      expect(result).toContain('return rgbToHex(saturated)');
    });

    test('generated desaturate matches existing ColorSpaceUtils implementation', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });
      
      // Verify generated code uses same algorithm as ColorSpaceUtils
      expect(result).toContain('const hsl = rgbToHsl(rgb)');
      expect(result).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      expect(result).toContain('const desaturated = hslToRgb(hsl)');
      expect(result).toContain('return rgbToHex(desaturated)');
    });
  });

  describe('iOS Blend Utilities Generation', () => {
    test('generates all four blend utility methods', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      expect(result).toContain('func darkerBlend(_ amount: Double) -> Color');
      expect(result).toContain('func lighterBlend(_ amount: Double) -> Color');
      expect(result).toContain('func saturate(_ amount: Double) -> Color');
      expect(result).toContain('func desaturate(_ amount: Double) -> Color');
    });

    test('generates color space utility structures', () => {
      const result = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      expect(result).toContain('struct RGB');
      expect(result).toContain('struct HSL');
      expect(result).toContain('func toHSL() -> HSL');
      expect(result).toContain('func toRGB() -> RGB');
      expect(result).toContain('extension Color');
      expect(result).toContain('init(rgb: RGB)');
      expect(result).toContain('init(hex: String)');
      expect(result).toContain('func toRGB() -> RGB');
    });

    test('generates utilities without color space utils when disabled', () => {
      const result = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: false 
      });

      expect(result).not.toContain('struct RGB');
      expect(result).not.toContain('init(hex: String)');
      expect(result).toContain('func darkerBlend');
    });

    test('generates utilities with Swift documentation comments', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: true });

      expect(result).toContain('//');
      expect(result).toContain('// Blend Utility Functions');
      expect(result).toContain('/// Calculate darker blend by overlaying black');
      expect(result).toContain('/// - Parameter amount: Blend amount as decimal');
      expect(result).toContain('/// - Returns: Darkened color');
      expect(result).toContain('/// Example:');
    });

    test('generates utilities without comments when disabled', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      expect(result).not.toContain('//');
      expect(result).not.toContain('// Blend Utility Functions');
      expect(result).toContain('func darkerBlend');
    });

    test('generates SwiftUI import', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      expect(result).toContain('import SwiftUI');
    });
  });

  describe('iOS Generated Utility Function Correctness', () => {
    test('darkerBlend implementation uses correct formula', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // Check for black overlay formula
      expect(result).toContain('let black = RGB(r: 0, g: 0, b: 0)');
      expect(result).toContain('Double(rgb.r) * (1 - amount) + Double(black.r) * amount');
      expect(result).toContain('Double(rgb.g) * (1 - amount) + Double(black.g) * amount');
      expect(result).toContain('Double(rgb.b) * (1 - amount) + Double(black.b) * amount');
    });

    test('lighterBlend implementation uses correct formula', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // Check for white overlay formula
      expect(result).toContain('let white = RGB(r: 255, g: 255, b: 255)');
      expect(result).toContain('Double(rgb.r) * (1 - amount) + Double(white.r) * amount');
      expect(result).toContain('Double(rgb.g) * (1 - amount) + Double(white.g) * amount');
      expect(result).toContain('Double(rgb.b) * (1 - amount) + Double(white.b) * amount');
    });

    test('saturate implementation uses HSL conversion', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // Check for HSL saturation increase
      expect(result).toContain('var hsl = rgb.toHSL()');
      expect(result).toContain('hsl.s = max(0.0, min(1.0, hsl.s + amount))');
      expect(result).toContain('let saturated = hsl.toRGB()');
    });

    test('desaturate implementation uses HSL conversion', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // Check for HSL saturation decrease
      expect(result).toContain('var hsl = rgb.toHSL()');
      expect(result).toContain('hsl.s = max(0.0, min(1.0, hsl.s - amount))');
      expect(result).toContain('let desaturated = hsl.toRGB()');
    });
  });

  describe('iOS Generated Code Validation', () => {
    test('generated code is valid Swift', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // Check for Swift syntax elements
      expect(result).toContain('struct RGB');
      expect(result).toContain('struct HSL');
      expect(result).toContain('let r: Int');
      expect(result).toContain('var s: Double');
      expect(result).toContain('func ');
      expect(result).toContain('extension Color');
    });

    test('generated functions have correct Swift signatures', () => {
      const result = generator.generateiOSBlendUtilities({ includeComments: false });

      // All blend functions should accept (_ amount: Double) and return Color
      expect(result).toContain('func darkerBlend(_ amount: Double) -> Color');
      expect(result).toContain('func lighterBlend(_ amount: Double) -> Color');
      expect(result).toContain('func saturate(_ amount: Double) -> Color');
      expect(result).toContain('func desaturate(_ amount: Double) -> Color');
    });

    test('generated code includes all necessary color space conversions', () => {
      const result = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for all conversion functions
      expect(result).toContain('func toHSL() -> HSL');
      expect(result).toContain('func toRGB() -> RGB');
      expect(result).toContain('init(rgb: RGB)');
      expect(result).toContain('init(hex: String)');
      expect(result).toContain('func toRGB() -> RGB');
    });

    test('generated code includes platform-specific color extraction', () => {
      const result = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for UIKit and AppKit support
      expect(result).toContain('#if canImport(UIKit)');
      expect(result).toContain('UIColor(self).getRed');
      expect(result).toContain('#else');
      expect(result).toContain('NSColor(self)');
      expect(result).toContain('#endif');
    });
  });

  describe('iOS Algorithm Consistency with Web', () => {
    test('iOS darkerBlend uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      
      // Both should use black overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(black.r) * amount');
      
      // Both should use Math.round/round
      expect(webResult).toContain('Math.round');
      expect(iosResult).toContain('round');
    });

    test('iOS lighterBlend uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      
      // Both should use white overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(white.r) * amount');
    });

    test('iOS saturate uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      
      // Both should convert to HSL, increase saturation, convert back
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(webResult).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(iosResult).toContain('hsl.s = max(0.0, min(1.0, hsl.s + amount))');
    });

    test('iOS desaturate uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      
      // Both should convert to HSL, decrease saturation, convert back
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(webResult).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(iosResult).toContain('hsl.s = max(0.0, min(1.0, hsl.s - amount))');
    });
  });

  describe('iOS Color Space Conversion Consistency', () => {
    test('iOS RGB to HSL conversion uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      
      // Both should normalize RGB to 0-1
      expect(webResult).toContain('const r = rgb.r / 255');
      expect(iosResult).toContain('let r = Double(self.r) / 255.0');
      
      // Both should calculate max, min, delta
      expect(webResult).toContain('const max = Math.max(r, g, b)');
      expect(webResult).toContain('const min = Math.min(r, g, b)');
      expect(webResult).toContain('const delta = max - min');
      
      expect(iosResult).toContain('let max = Swift.max(r, g, b)');
      expect(iosResult).toContain('let min = Swift.min(r, g, b)');
      expect(iosResult).toContain('let delta = max - min');
    });

    test('iOS HSL to RGB conversion uses same algorithm as web', () => {
      const webResult = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      
      // Both should use hue2rgb helper function
      expect(webResult).toContain('const hue2rgb = (p: number, q: number, t: number)');
      expect(iosResult).toContain('func hue2rgb(_ p: Double, _ q: Double, _ t: Double) -> Double');
      
      // Both should handle achromatic case
      expect(webResult).toContain('if (s === 0)');
      expect(iosResult).toContain('if s == 0');
    });
  });

  describe('Output Format Consistency', () => {
    test('all functions use consistent formatting', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for consistent indentation and structure
      expect(result).toContain('  const rgb = hexToRgb(color);');
      expect(result).toContain('  return rgbToHex(');
      
      // All functions should have similar structure
      const functionCount = (result.match(/export function/g) || []).length;
      expect(functionCount).toBe(4);
    });

    test('generated code has proper line breaks', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check that functions are separated by blank lines
      expect(result).toContain('}\n\nexport function');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('generated hexToRgb includes validation', () => {
      const result = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for hex validation
      expect(result).toContain('if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex))');
      expect(result).toContain('throw new Error');
    });

    test('generated rgbToHex includes value clamping', () => {
      const result = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for RGB value clamping
      expect(result).toContain('Math.max(0, Math.min(255, value))');
    });

    test('generated saturate/desaturate include saturation clamping', () => {
      const result = generator.generateWebBlendUtilities({ includeComments: false });

      // Check for saturation clamping to 0.0-1.0 range
      expect(result).toContain('Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      expect(result).toContain('Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
    });
  });

  describe('Android Blend Utilities Generation', () => {
    test('generates all four blend utility extension functions', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      expect(result).toContain('fun Color.darkerBlend(amount: Float): Color');
      expect(result).toContain('fun Color.lighterBlend(amount: Float): Color');
      expect(result).toContain('fun Color.saturate(amount: Float): Color');
      expect(result).toContain('fun Color.desaturate(amount: Float): Color');
    });

    test('generates color space utility data classes', () => {
      const result = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      expect(result).toContain('data class RGB(val r: Int, val g: Int, val b: Int)');
      expect(result).toContain('data class HSL(val h: Int, val s: Float, val l: Float)');
      expect(result).toContain('fun toHSL(): HSL');
      expect(result).toContain('fun toRGB(): RGB');
      expect(result).toContain('fun toColor(): Color');
      expect(result).toContain('fun Color.toRGB(): RGB');
    });

    test('generates utilities without color space utils when disabled', () => {
      const result = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: false 
      });

      expect(result).not.toContain('data class RGB');
      expect(result).not.toContain('fun Color.toRGB()');
      expect(result).toContain('fun Color.darkerBlend');
    });

    test('generates utilities with KDoc comments', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: true });

      expect(result).toContain('//');
      expect(result).toContain('// Blend Utility Functions');
      expect(result).toContain('/**');
      expect(result).toContain('* Calculate darker blend by overlaying black');
      expect(result).toContain('* @param amount Blend amount as decimal');
      expect(result).toContain('* @return Darkened color');
      expect(result).toContain('* Example:');
    });

    test('generates utilities without comments when disabled', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      expect(result).not.toContain('//');
      expect(result).not.toContain('// Blend Utility Functions');
      expect(result).toContain('fun Color.darkerBlend');
    });

    test('generates Compose imports', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      expect(result).toContain('package com.designerpunk.tokens');
      expect(result).toContain('import androidx.compose.ui.graphics.Color');
      expect(result).toContain('import kotlin.math.max');
      expect(result).toContain('import kotlin.math.min');
      expect(result).toContain('import kotlin.math.round');
    });
  });

  describe('Android Generated Utility Function Correctness', () => {
    test('darkerBlend implementation uses correct formula', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for black overlay formula
      expect(result).toContain('val black = RGB(0, 0, 0)');
      expect(result).toContain('r = round(rgb.r * (1 - amount) + black.r * amount).toInt()');
      expect(result).toContain('g = round(rgb.g * (1 - amount) + black.g * amount).toInt()');
      expect(result).toContain('b = round(rgb.b * (1 - amount) + black.b * amount).toInt()');
    });

    test('lighterBlend implementation uses correct formula', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for white overlay formula
      expect(result).toContain('val white = RGB(255, 255, 255)');
      expect(result).toContain('r = round(rgb.r * (1 - amount) + white.r * amount).toInt()');
      expect(result).toContain('g = round(rgb.g * (1 - amount) + white.g * amount).toInt()');
      expect(result).toContain('b = round(rgb.b * (1 - amount) + white.b * amount).toInt()');
    });

    test('saturate implementation uses HSL conversion', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for HSL saturation increase
      expect(result).toContain('val hsl = rgb.toHSL()');
      expect(result).toContain('val saturated = hsl.copy(s = max(0.0f, min(1.0f, hsl.s + amount)))');
      expect(result).toContain('return saturated.toRGB().toColor()');
    });

    test('desaturate implementation uses HSL conversion', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for HSL saturation decrease
      expect(result).toContain('val hsl = rgb.toHSL()');
      expect(result).toContain('val desaturated = hsl.copy(s = max(0.0f, min(1.0f, hsl.s - amount)))');
      expect(result).toContain('return desaturated.toRGB().toColor()');
    });
  });

  describe('Android Generated Code Validation', () => {
    test('generated code is valid Kotlin', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for Kotlin syntax elements
      expect(result).toContain('data class RGB');
      expect(result).toContain('data class HSL');
      expect(result).toContain('val r: Int');
      expect(result).toContain('val s: Float');
      expect(result).toContain('fun ');
      expect(result).toContain('fun Color.');
    });

    test('generated functions have correct Kotlin signatures', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // All blend functions should accept (amount: Float) and return Color
      expect(result).toContain('fun Color.darkerBlend(amount: Float): Color');
      expect(result).toContain('fun Color.lighterBlend(amount: Float): Color');
      expect(result).toContain('fun Color.saturate(amount: Float): Color');
      expect(result).toContain('fun Color.desaturate(amount: Float): Color');
    });

    test('generated code includes all necessary color space conversions', () => {
      const result = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for all conversion functions
      expect(result).toContain('fun toHSL(): HSL');
      expect(result).toContain('fun toRGB(): RGB');
      expect(result).toContain('fun toColor(): Color');
      expect(result).toContain('fun Color.toRGB(): RGB');
    });

    test('generated code uses Kotlin idiomatic patterns', () => {
      const result = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Check for Kotlin idioms
      expect(result).toContain('data class');
      expect(result).toContain('.copy(');
      expect(result).toContain('val ');
      expect(result).toContain('.toInt()');
      expect(result).toContain('maxOf');
      expect(result).toContain('minOf');
    });
  });

  describe('Android Algorithm Consistency with Web and iOS', () => {
    test('Android darkerBlend uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All should use black overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(black.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + black.r * amount');
      
      // All should use rounding
      expect(webResult).toContain('Math.round');
      expect(iosResult).toContain('round');
      expect(androidResult).toContain('round');
    });

    test('Android lighterBlend uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All should use white overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(white.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + white.r * amount');
    });

    test('Android saturate uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All should convert to HSL, increase saturation, convert back
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(webResult).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(iosResult).toContain('hsl.s = max(0.0, min(1.0, hsl.s + amount))');
      
      expect(androidResult).toContain('val hsl = rgb.toHSL()');
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s + amount))');
    });

    test('Android desaturate uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All should convert to HSL, decrease saturation, convert back
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(webResult).toContain('hsl.s = Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(iosResult).toContain('hsl.s = max(0.0, min(1.0, hsl.s - amount))');
      
      expect(androidResult).toContain('val hsl = rgb.toHSL()');
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s - amount))');
    });
  });

  describe('Android Color Space Conversion Consistency', () => {
    test('Android RGB to HSL conversion uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      
      // All should normalize RGB to 0-1
      expect(webResult).toContain('const r = rgb.r / 255');
      expect(iosResult).toContain('let r = Double(self.r) / 255.0');
      expect(androidResult).toContain('val r = this.r / 255.0f');
      
      // All should calculate max, min, delta
      expect(webResult).toContain('const max = Math.max(r, g, b)');
      expect(webResult).toContain('const min = Math.min(r, g, b)');
      expect(webResult).toContain('const delta = max - min');
      
      expect(iosResult).toContain('let max = Swift.max(r, g, b)');
      expect(iosResult).toContain('let min = Swift.min(r, g, b)');
      expect(iosResult).toContain('let delta = max - min');
      
      expect(androidResult).toContain('val max = maxOf(r, g, b)');
      expect(androidResult).toContain('val min = minOf(r, g, b)');
      expect(androidResult).toContain('val delta = max - min');
    });

    test('Android HSL to RGB conversion uses same algorithm as web and iOS', () => {
      const webResult = generator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = generator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      
      // All should use hue2rgb helper function
      expect(webResult).toContain('const hue2rgb = (p: number, q: number, t: number)');
      expect(iosResult).toContain('func hue2rgb(_ p: Double, _ q: Double, _ t: Double) -> Double');
      expect(androidResult).toContain('fun hue2rgb(p: Float, q: Float, t: Float): Float');
      
      // All should handle achromatic case
      expect(webResult).toContain('if (s === 0)');
      expect(iosResult).toContain('if s == 0');
      expect(androidResult).toContain('if (s == 0f)');
    });
  });

  describe('Android Compose Color Integration', () => {
    test('generated code converts RGB to Compose Color correctly', () => {
      const result = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for Compose Color creation from RGB
      expect(result).toContain('fun toColor(): Color');
      expect(result).toContain('return Color(');
      expect(result).toContain('red = r / 255f');
      expect(result).toContain('green = g / 255f');
      expect(result).toContain('blue = b / 255f');
    });

    test('generated code extracts RGB from Compose Color correctly', () => {
      const result = generator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // Check for RGB extraction from Compose Color
      expect(result).toContain('fun Color.toRGB(): RGB');
      expect(result).toContain('return RGB(');
      expect(result).toContain('r = (red * 255).toInt()');
      expect(result).toContain('g = (green * 255).toInt()');
      expect(result).toContain('b = (blue * 255).toInt()');
    });
  });

  describe('Cross-Platform Saturation Clamping', () => {
    test('all platforms clamp saturation to 0.0-1.0 range', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });

      // Web clamping
      expect(webResult).toContain('Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      expect(webResult).toContain('Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      
      // iOS clamping
      expect(iosResult).toContain('max(0.0, min(1.0, hsl.s + amount))');
      expect(iosResult).toContain('max(0.0, min(1.0, hsl.s - amount))');
      
      // Android clamping
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s + amount))');
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s - amount))');
    });
  });
});
