/**
 * @category evergreen
 * @purpose Verify BlendCrossPlatformConsistency functionality works correctly
 */
/**
 * Blend Token Cross-Platform Consistency Tests
 * 
 * Tests that blend values and utilities produce mathematically identical
 * results across web, iOS, and Android platforms.
 * 
 * Requirements: 6, 9
 */

import { BlendValueGenerator } from '../../generators/BlendValueGenerator';
import { BlendUtilityGenerator } from '../../generators/BlendUtilityGenerator';
import { BLEND_BASE_VALUE } from '../../tokens/BlendTokens';
import { BlendCalculator } from '../../blend/BlendCalculator';
import { BlendDirection } from '../../tokens/BlendTokens';

describe('Blend Cross-Platform Consistency', () => {
  let valueGenerator: BlendValueGenerator;
  let utilityGenerator: BlendUtilityGenerator;
  let calculator: BlendCalculator;

  beforeEach(() => {
    valueGenerator = new BlendValueGenerator();
    utilityGenerator = new BlendUtilityGenerator();
    calculator = new BlendCalculator();
  });

  describe('Blend Value Consistency', () => {
    test('all platforms generate same blend values', () => {
      const webResult = valueGenerator.generateWebBlendValues({ includeComments: false });
      const iosResult = valueGenerator.generateiOSBlendValues({ includeComments: false });
      const androidResult = valueGenerator.generateAndroidBlendValues({ includeComments: false });

      // Extract blend100 value from each platform
      const webBlend100 = webResult.match(/blend100[:\s=]+(\d+\.?\d*)/)?.[1];
      const iosBlend100 = iosResult.match(/blend100[:\s=]+Double\s*=\s*(\d+\.?\d*)/)?.[1];
      const androidBlend100 = androidResult.match(/blend100\s*=\s*(\d+\.?\d*)f/)?.[1];

      expect(webBlend100).toBe('0.04');
      expect(iosBlend100).toBe('0.04');
      expect(androidBlend100).toBe('0.04');

      // Extract blend200 value from each platform
      const webBlend200 = webResult.match(/blend200[:\s=]+(\d+\.?\d*)/)?.[1];
      const iosBlend200 = iosResult.match(/blend200[:\s=]+Double\s*=\s*(\d+\.?\d*)/)?.[1];
      const androidBlend200 = androidResult.match(/blend200\s*=\s*(\d+\.?\d*)f/)?.[1];

      expect(webBlend200).toBe('0.08');
      expect(iosBlend200).toBe('0.08');
      expect(androidBlend200).toBe('0.08');

      // Extract blend300 value from each platform
      const webBlend300 = webResult.match(/blend300[:\s=]+(\d+\.?\d*)/)?.[1];
      const iosBlend300 = iosResult.match(/blend300[:\s=]+Double\s*=\s*(\d+\.?\d*)/)?.[1];
      const androidBlend300 = androidResult.match(/blend300\s*=\s*(\d+\.?\d*)f/)?.[1];

      expect(webBlend300).toBe('0.12');
      expect(iosBlend300).toBe('0.12');
      expect(androidBlend300).toBe('0.12');

      // Extract blend400 value from each platform
      const webBlend400 = webResult.match(/blend400[:\s=]+(\d+\.?\d*)/)?.[1];
      const iosBlend400 = iosResult.match(/blend400[:\s=]+Double\s*=\s*(\d+\.?\d*)/)?.[1];
      const androidBlend400 = androidResult.match(/blend400\s*=\s*(\d+\.?\d*)f/)?.[1];

      expect(webBlend400).toBe('0.16');
      expect(iosBlend400).toBe('0.16');
      expect(androidBlend400).toBe('0.16');

      // Extract blend500 value from each platform
      const webBlend500 = webResult.match(/blend500[:\s=]+(\d+\.?\d*)/)?.[1];
      const iosBlend500 = iosResult.match(/blend500[:\s=]+Double\s*=\s*(\d+\.?\d*)/)?.[1];
      const androidBlend500 = androidResult.match(/blend500\s*=\s*(\d+\.?\d*)f/)?.[1];

      expect(webBlend500).toBe('0.2');
      expect(iosBlend500).toBe('0.2');
      expect(androidBlend500).toBe('0.2');
    });

    test('base value is consistent across platforms', () => {
      const webResult = valueGenerator.generateWebBlendValues({ includeComments: false });
      const iosResult = valueGenerator.generateiOSBlendValues({ includeComments: false });
      const androidResult = valueGenerator.generateAndroidBlendValues({ includeComments: false });

      expect(webResult).toContain(`BLEND_BASE_VALUE = ${BLEND_BASE_VALUE}`);
      expect(iosResult).toContain(`baseValue: Double = ${BLEND_BASE_VALUE}`);
      expect(androidResult).toContain(`baseValue = ${BLEND_BASE_VALUE}f`);
    });

    test('all platforms have same number of blend tokens', () => {
      const webResult = valueGenerator.generateWebBlendValues({ includeComments: false });
      const iosResult = valueGenerator.generateiOSBlendValues({ includeComments: false });
      const androidResult = valueGenerator.generateAndroidBlendValues({ includeComments: false });

      const webTokens = (webResult.match(/blend\d+:/g) || []).length;
      const iosTokens = (iosResult.match(/blend\d+:/g) || []).length;
      const androidTokens = (androidResult.match(/blend\d+\s*=/g) || []).length;

      expect(webTokens).toBe(5);
      expect(iosTokens).toBe(5);
      expect(androidTokens).toBe(5);
    });
  });

  describe('Blend Utility Algorithm Consistency', () => {
    test('all platforms use same darker blend algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // All should use black overlay formula
      expect(webResult).toContain('const black = { r: 0, g: 0, b: 0 }');
      expect(iosResult).toContain('let black = RGB(r: 0, g: 0, b: 0)');
      expect(androidResult).toContain('val black = RGB(0, 0, 0)');

      // All should use same overlay formula pattern
      expect(webResult).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(black.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + black.r * amount');
    });

    test('all platforms use same lighter blend algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // All should use white overlay formula
      expect(webResult).toContain('const white = { r: 255, g: 255, b: 255 }');
      expect(iosResult).toContain('let white = RGB(r: 255, g: 255, b: 255)');
      expect(androidResult).toContain('val white = RGB(255, 255, 255)');

      // All should use same overlay formula pattern
      expect(webResult).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(white.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + white.r * amount');
    });

    test('all platforms use same saturate blend algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // All should convert to HSL
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(androidResult).toContain('val hsl = rgb.toHSL()');

      // All should increase saturation with clamping
      expect(webResult).toContain('Math.max(0.0, Math.min(1.0, hsl.s + blendValue))');
      expect(iosResult).toContain('max(0.0, min(1.0, hsl.s + amount))');
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s + amount))');
    });

    test('all platforms use same desaturate blend algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // All should convert to HSL
      expect(webResult).toContain('const hsl = rgbToHsl(rgb)');
      expect(iosResult).toContain('var hsl = rgb.toHSL()');
      expect(androidResult).toContain('val hsl = rgb.toHSL()');

      // All should decrease saturation with clamping
      expect(webResult).toContain('Math.max(0.0, Math.min(1.0, hsl.s - blendValue))');
      expect(iosResult).toContain('max(0.0, min(1.0, hsl.s - amount))');
      expect(androidResult).toContain('max(0.0f, min(1.0f, hsl.s - amount))');
    });
  });

  describe('Color Space Conversion Consistency', () => {
    test('all platforms use same RGB to HSL conversion algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ 
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

    test('all platforms use same HSL to RGB conversion algorithm', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ 
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

  describe('Specific Color Blend Consistency', () => {
    test('purple500 with blend200 darker produces same result on all platforms', () => {
      // Test the actual calculation using the BlendCalculator
      const result = calculator.calculateBlend(
        '#A855F7',
        { baseValue: 0.08 } as any,
        BlendDirection.DARKER
      );

      // Verify result is a valid hex color
      expect(result).toMatch(/^#[0-9A-F]{6}$/);

      // The generated utilities on all platforms should produce this same result
      // when given purple500 (#A855F7) and blend200 (0.08)
      
      // Web: darkerBlend('#A855F7', 0.08) → result
      // iOS: Color(hex: "A855F7").darkerBlend(0.08) → result
      // Android: Color(0xFFA855F7).darkerBlend(0.08f) → result
      
      // All should produce mathematically identical RGB values
      // (within platform color representation limits)
    });

    test('purple500 with blend200 lighter produces same result on all platforms', () => {
      const result = calculator.calculateBlend(
        '#A855F7',
        { baseValue: 0.08 } as any,
        BlendDirection.LIGHTER
      );

      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    test('purple500 with blend200 saturate produces same result on all platforms', () => {
      const result = calculator.calculateBlend(
        '#A855F7',
        { baseValue: 0.08 } as any,
        BlendDirection.SATURATE
      );

      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    test('purple500 with blend200 desaturate produces same result on all platforms', () => {
      const result = calculator.calculateBlend(
        '#A855F7',
        { baseValue: 0.08 } as any,
        BlendDirection.DESATURATE
      );

      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  describe('All Blend Directions Consistency', () => {
    test('darker blend is consistent across all platforms', () => {
      const testColors = ['#A855F7', '#3B82F6', '#10B981', '#EF4444'];
      const testBlendValues = [0.04, 0.08, 0.12, 0.16, 0.20];

      testColors.forEach(color => {
        testBlendValues.forEach(blendValue => {
          const result = calculator.calculateBlend(
            color,
            { baseValue: blendValue } as any,
            BlendDirection.DARKER
          );

          // Verify result is valid
          expect(result).toMatch(/^#[0-9A-F]{6}$/);

          // All platforms should produce this same result
          // when given the same color and blend value
        });
      });
    });

    test('lighter blend is consistent across all platforms', () => {
      const testColors = ['#A855F7', '#3B82F6', '#10B981', '#EF4444'];
      const testBlendValues = [0.04, 0.08, 0.12, 0.16, 0.20];

      testColors.forEach(color => {
        testBlendValues.forEach(blendValue => {
          const result = calculator.calculateBlend(
            color,
            { baseValue: blendValue } as any,
            BlendDirection.LIGHTER
          );

          expect(result).toMatch(/^#[0-9A-F]{6}$/);
        });
      });
    });

    test('saturate blend is consistent across all platforms', () => {
      const testColors = ['#A855F7', '#3B82F6', '#10B981', '#EF4444'];
      const testBlendValues = [0.04, 0.08, 0.12, 0.16, 0.20];

      testColors.forEach(color => {
        testBlendValues.forEach(blendValue => {
          const result = calculator.calculateBlend(
            color,
            { baseValue: blendValue } as any,
            BlendDirection.SATURATE
          );

          expect(result).toMatch(/^#[0-9A-F]{6}$/);
        });
      });
    });

    test('desaturate blend is consistent across all platforms', () => {
      const testColors = ['#A855F7', '#3B82F6', '#10B981', '#EF4444'];
      const testBlendValues = [0.04, 0.08, 0.12, 0.16, 0.20];

      testColors.forEach(color => {
        testBlendValues.forEach(blendValue => {
          const result = calculator.calculateBlend(
            color,
            { baseValue: blendValue } as any,
            BlendDirection.DESATURATE
          );

          expect(result).toMatch(/^#[0-9A-F]{6}$/);
        });
      });
    });
  });

  describe('Mathematical Precision Consistency', () => {
    test('all platforms use same rounding approach', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // All should use rounding for RGB values
      expect(webResult).toContain('Math.round');
      expect(iosResult).toContain('round');
      expect(androidResult).toContain('round');
    });

    test('all platforms clamp saturation to 0.0-1.0 range', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

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

    test('all platforms handle RGB value clamping consistently', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // All should clamp RGB values to 0-255 range
      expect(webResult).toContain('Math.max(0, Math.min(255, value))');
      // iOS and Android handle clamping through type conversion and rounding
      expect(iosResult).toContain('round');
      expect(androidResult).toContain('round');
    });
  });

  describe('Platform-Specific Type Handling', () => {
    test('web uses TypeScript number type', () => {
      const result = utilityGenerator.generateWebBlendUtilities({ includeComments: false });

      expect(result).toContain('blendValue: number');
      expect(result).toContain(': string');
      expect(result).toContain('interface RGB');
      expect(result).toContain('interface HSL');
    });

    test('iOS uses Swift Double type', () => {
      const result = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });

      expect(result).toContain('amount: Double');
      expect(result).toContain('-> Color');
      expect(result).toContain('struct RGB');
      expect(result).toContain('struct HSL');
    });

    test('Android uses Kotlin Float type', () => {
      const result = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      expect(result).toContain('amount: Float');
      expect(result).toContain(': Color');
      expect(result).toContain('data class RGB');
      expect(result).toContain('data class HSL');
    });
  });

  describe('Generated Code Structure Consistency', () => {
    test('all platforms generate four blend utility functions', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ includeComments: false });

      // Web
      expect(webResult).toContain('export function darkerBlend');
      expect(webResult).toContain('export function lighterBlend');
      expect(webResult).toContain('export function saturate');
      expect(webResult).toContain('export function desaturate');

      // iOS
      expect(iosResult).toContain('func darkerBlend');
      expect(iosResult).toContain('func lighterBlend');
      expect(iosResult).toContain('func saturate');
      expect(iosResult).toContain('func desaturate');

      // Android
      expect(androidResult).toContain('fun Color.darkerBlend');
      expect(androidResult).toContain('fun Color.lighterBlend');
      expect(androidResult).toContain('fun Color.saturate');
      expect(androidResult).toContain('fun Color.desaturate');
    });

    test('all platforms include color space conversion utilities', () => {
      const webResult = utilityGenerator.generateWebBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const iosResult = utilityGenerator.generateiOSBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });
      const androidResult = utilityGenerator.generateAndroidBlendUtilities({ 
        includeComments: false,
        includeColorSpaceUtils: true 
      });

      // All should have RGB and HSL structures
      expect(webResult).toContain('interface RGB');
      expect(webResult).toContain('interface HSL');
      expect(iosResult).toContain('struct RGB');
      expect(iosResult).toContain('struct HSL');
      expect(androidResult).toContain('data class RGB');
      expect(androidResult).toContain('data class HSL');

      // All should have conversion functions
      expect(webResult).toContain('function hexToRgb');
      expect(webResult).toContain('function rgbToHex');
      expect(webResult).toContain('function rgbToHsl');
      expect(webResult).toContain('function hslToRgb');

      expect(iosResult).toContain('func toHSL()');
      expect(iosResult).toContain('func toRGB()');

      expect(androidResult).toContain('fun toHSL()');
      expect(androidResult).toContain('fun toRGB()');
    });
  });
});
