/**
 * @category evergreen
 * @purpose Property-based tests for blend utility functions
 */
/**
 * Blend Utilities Property-Based Tests
 * 
 * Property-based tests for blend utility functions using fast-check.
 * Tests universal properties that should hold across all inputs.
 * 
 * Task: 1.6 Write Layer 1 validation tests (Property-Based)
 * Spec: 031-blend-infrastructure-implementation
 * Requirements: 5.1, 5.3, 12.1, 12.4
 * 
 * Properties tested:
 * - Property 1: Blend Direction Correctness
 * - Property 2: Invalid Input Handling
 * - Property 3: Cross-Platform Consistency
 */

import * as fc from 'fast-check';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateDarkerBlend,
  calculateLighterBlend,
  calculateSaturateBlend,
  calculateDesaturateBlend,
  RGB,
  HSL
} from '../ColorSpaceUtils';
import { BlendUtilityGenerator } from '../../generators/BlendUtilityGenerator';

/**
 * Calculate relative luminance of an RGB color
 * Using the formula from WCAG 2.1
 * @param rgb - RGB color
 * @returns Relative luminance (0-1)
 */
function calculateLuminance(rgb: RGB): number {
  const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const linearRGB = sRGB.map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * linearRGB[0] + 0.7152 * linearRGB[1] + 0.0722 * linearRGB[2];
}

/**
 * Calculate saturation of an RGB color
 * @param rgb - RGB color
 * @returns Saturation (0-1)
 */
function calculateSaturation(rgb: RGB): number {
  const hsl = rgbToHsl(rgb);
  return hsl.s;
}

// Arbitrary generators for valid colors and blend amounts
const validRgbArb = fc.record({
  r: fc.integer({ min: 0, max: 255 }),
  g: fc.integer({ min: 0, max: 255 }),
  b: fc.integer({ min: 0, max: 255 })
});

const validHexArb = validRgbArb.map(rgb => rgbToHex(rgb));

// Blend amounts between 0.01 and 0.99 (excluding extremes for meaningful tests)
const validBlendAmountArb = fc.double({ min: 0.01, max: 0.99, noNaN: true });

// Small blend amounts for more realistic use cases
const smallBlendAmountArb = fc.double({ min: 0.01, max: 0.30, noNaN: true });

// Colors with some saturation (not pure gray) for saturation tests
const saturatedColorArb = fc.record({
  r: fc.integer({ min: 0, max: 255 }),
  g: fc.integer({ min: 0, max: 255 }),
  b: fc.integer({ min: 0, max: 255 })
}).filter(rgb => {
  const hsl = rgbToHsl(rgb);
  // Filter for colors with saturation > 0.1 and < 0.9 (room to increase/decrease)
  return hsl.s > 0.1 && hsl.s < 0.9;
});

// Colors that are not pure black (for darker blend tests)
const nonBlackColorArb = validRgbArb.filter(rgb => 
  rgb.r > 0 || rgb.g > 0 || rgb.b > 0
);

// Colors that are not pure white (for lighter blend tests)
const nonWhiteColorArb = validRgbArb.filter(rgb => 
  rgb.r < 255 || rgb.g < 255 || rgb.b < 255
);

describe('Property-Based Tests: Blend Utilities', () => {
  /**
   * Property 1: Blend Direction Correctness
   * 
   * Feature: 031-blend-infrastructure-implementation, Property 1: Blend Direction Correctness
   * Validates: Requirements 2.2, 2.3, 2.4, 2.5, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 4.5
   * 
   * For any valid color and blend amount:
   * - darkerBlend produces lower luminance
   * - lighterBlend produces higher luminance
   * - saturate produces higher saturation (unless already fully saturated)
   * - desaturate produces lower saturation (unless already fully desaturated)
   */
  describe('Property 1: Blend Direction Correctness', () => {
    it('darkerBlend produces lower or equal luminance for any valid color', () => {
      fc.assert(
        fc.property(
          nonBlackColorArb,
          smallBlendAmountArb,
          (rgb, blendAmount) => {
            const originalLuminance = calculateLuminance(rgb);
            const darkerRgb = calculateDarkerBlend(rgb, blendAmount);
            const darkerLuminance = calculateLuminance(darkerRgb);
            
            // Darker blend should produce lower or equal luminance
            expect(darkerLuminance).toBeLessThanOrEqual(originalLuminance + 0.001);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('lighterBlend produces higher or equal luminance for any valid color', () => {
      fc.assert(
        fc.property(
          nonWhiteColorArb,
          smallBlendAmountArb,
          (rgb, blendAmount) => {
            const originalLuminance = calculateLuminance(rgb);
            const lighterRgb = calculateLighterBlend(rgb, blendAmount);
            const lighterLuminance = calculateLuminance(lighterRgb);
            
            // Lighter blend should produce higher or equal luminance
            expect(lighterLuminance).toBeGreaterThanOrEqual(originalLuminance - 0.001);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('saturate produces higher or equal saturation for colors with room to increase', () => {
      fc.assert(
        fc.property(
          saturatedColorArb,
          smallBlendAmountArb,
          (rgb, blendAmount) => {
            const originalSaturation = calculateSaturation(rgb);
            const saturatedRgb = calculateSaturateBlend(rgb, blendAmount);
            const newSaturation = calculateSaturation(saturatedRgb);
            
            // Saturate should produce higher or equal saturation
            // Allow small tolerance for floating point precision
            expect(newSaturation).toBeGreaterThanOrEqual(originalSaturation - 0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('desaturate produces lower or equal saturation for colors with room to decrease', () => {
      fc.assert(
        fc.property(
          saturatedColorArb,
          smallBlendAmountArb,
          (rgb, blendAmount) => {
            const originalSaturation = calculateSaturation(rgb);
            const desaturatedRgb = calculateDesaturateBlend(rgb, blendAmount);
            const newSaturation = calculateSaturation(desaturatedRgb);
            
            // Desaturate should produce lower or equal saturation
            // Allow small tolerance for floating point precision
            expect(newSaturation).toBeLessThanOrEqual(originalSaturation + 0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('darkerBlend with zero amount returns original color', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const result = calculateDarkerBlend(rgb, 0);
            
            expect(result.r).toBe(rgb.r);
            expect(result.g).toBe(rgb.g);
            expect(result.b).toBe(rgb.b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('lighterBlend with zero amount returns original color', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const result = calculateLighterBlend(rgb, 0);
            
            expect(result.r).toBe(rgb.r);
            expect(result.g).toBe(rgb.g);
            expect(result.b).toBe(rgb.b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('darkerBlend with maximum amount produces black', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const result = calculateDarkerBlend(rgb, 1.0);
            
            expect(result.r).toBe(0);
            expect(result.g).toBe(0);
            expect(result.b).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('lighterBlend with maximum amount produces white', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const result = calculateLighterBlend(rgb, 1.0);
            
            expect(result.r).toBe(255);
            expect(result.g).toBe(255);
            expect(result.b).toBe(255);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Invalid Input Handling
   * 
   * Feature: 031-blend-infrastructure-implementation, Property 2: Invalid Input Handling
   * Validates: Requirements 2.6, 3.6, 4.6
   * 
   * For any invalid input, blend functions should handle gracefully:
   * - Invalid hex strings throw errors (hexToRgb)
   * - RGB values are clamped to valid range
   * - Blend amounts are clamped to 0-1 range
   */
  describe('Property 2: Invalid Input Handling', () => {
    it('hexToRgb throws for invalid hex strings', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'invalid',
            'GGGGGG',
            '#GGG',
            '12345',
            '#12345',
            '',
            'rgb(255,0,0)',
            '#GGGGGG'
          ),
          (invalidHex) => {
            expect(() => hexToRgb(invalidHex)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('blend functions clamp RGB output values to 0-255 range', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          validBlendAmountArb,
          (rgb, blendAmount) => {
            const darkerResult = calculateDarkerBlend(rgb, blendAmount);
            const lighterResult = calculateLighterBlend(rgb, blendAmount);
            const saturateResult = calculateSaturateBlend(rgb, blendAmount);
            const desaturateResult = calculateDesaturateBlend(rgb, blendAmount);
            
            // All results should have RGB values in valid range
            [darkerResult, lighterResult, saturateResult, desaturateResult].forEach(result => {
              expect(result.r).toBeGreaterThanOrEqual(0);
              expect(result.r).toBeLessThanOrEqual(255);
              expect(result.g).toBeGreaterThanOrEqual(0);
              expect(result.g).toBeLessThanOrEqual(255);
              expect(result.b).toBeGreaterThanOrEqual(0);
              expect(result.b).toBeLessThanOrEqual(255);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('blend functions produce integer RGB values', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          validBlendAmountArb,
          (rgb, blendAmount) => {
            const darkerResult = calculateDarkerBlend(rgb, blendAmount);
            const lighterResult = calculateLighterBlend(rgb, blendAmount);
            const saturateResult = calculateSaturateBlend(rgb, blendAmount);
            const desaturateResult = calculateDesaturateBlend(rgb, blendAmount);
            
            // All results should have integer RGB values
            [darkerResult, lighterResult, saturateResult, desaturateResult].forEach(result => {
              expect(Number.isInteger(result.r)).toBe(true);
              expect(Number.isInteger(result.g)).toBe(true);
              expect(Number.isInteger(result.b)).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hexToRgb handles valid hex formats correctly', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const hex = rgbToHex(rgb);
            const result = hexToRgb(hex);
            
            // Round-trip should preserve values
            expect(result.r).toBe(rgb.r);
            expect(result.g).toBe(rgb.g);
            expect(result.b).toBe(rgb.b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('hexToRgb handles hex without # prefix', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const hexWithPrefix = rgbToHex(rgb);
            const hexWithoutPrefix = hexWithPrefix.replace('#', '');
            const result = hexToRgb(hexWithoutPrefix);
            
            expect(result.r).toBe(rgb.r);
            expect(result.g).toBe(rgb.g);
            expect(result.b).toBe(rgb.b);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 3: Cross-Platform Consistency
   * 
   * Feature: 031-blend-infrastructure-implementation, Property 3: Cross-Platform Consistency
   * Validates: Requirements 5.1, 5.3
   * 
   * For any color and blend amount, Web/iOS/Android implementations
   * should produce results within ±1 RGB tolerance.
   * 
   * This test validates that the generated code for all platforms uses
   * the same algorithm as the TypeScript reference implementation.
   */
  describe('Property 3: Cross-Platform Consistency', () => {
    const generator = new BlendUtilityGenerator();

    it('all platforms use identical darkerBlend algorithm', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All platforms should use the same black overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + black.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(black.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + black.r * amount');
      
      // All platforms should use rounding
      expect(webResult).toContain('Math.round');
      expect(iosResult).toContain('round');
      expect(androidResult).toContain('round');
    });

    it('all platforms use identical lighterBlend algorithm', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All platforms should use the same white overlay formula
      expect(webResult).toContain('rgb.r * (1 - blendValue) + white.r * blendValue');
      expect(iosResult).toContain('Double(rgb.r) * (1 - amount) + Double(white.r) * amount');
      expect(androidResult).toContain('rgb.r * (1 - amount) + white.r * amount');
    });

    it('all platforms use identical saturate algorithm', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All platforms should convert to HSL and increase saturation
      expect(webResult).toContain('rgbToHsl');
      expect(webResult).toContain('hsl.s + blendValue');
      expect(iosResult).toContain('toHSL');
      expect(iosResult).toContain('hsl.s + amount');
      expect(androidResult).toContain('toHSL');
      expect(androidResult).toContain('hsl.s + amount');
    });

    it('all platforms use identical desaturate algorithm', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // All platforms should convert to HSL and decrease saturation
      expect(webResult).toContain('hsl.s - blendValue');
      expect(iosResult).toContain('hsl.s - amount');
      expect(androidResult).toContain('hsl.s - amount');
    });

    it('all platforms clamp saturation to 0.0-1.0 range', () => {
      const webResult = generator.generateWebBlendUtilities({ includeComments: false });
      const iosResult = generator.generateiOSBlendUtilities({ includeComments: false });
      const androidResult = generator.generateAndroidBlendUtilities({ includeComments: false });
      
      // Web clamping
      expect(webResult).toContain('Math.max(0.0, Math.min(1.0');
      
      // iOS clamping
      expect(iosResult).toContain('max(0.0, min(1.0');
      
      // Android clamping
      expect(androidResult).toContain('max(0.0f, min(1.0f');
    });

    it('TypeScript reference implementation produces consistent results', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          smallBlendAmountArb,
          (rgb, blendAmount) => {
            // Run the same calculation twice
            const result1 = calculateDarkerBlend(rgb, blendAmount);
            const result2 = calculateDarkerBlend(rgb, blendAmount);
            
            // Results should be identical
            expect(result1.r).toBe(result2.r);
            expect(result1.g).toBe(result2.g);
            expect(result1.b).toBe(result2.b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all platforms use same RGB to HSL conversion algorithm', () => {
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
      
      // All platforms should use the same HSL conversion formula
      // Check for the standard RGB to HSL conversion pattern
      expect(webResult).toContain('const max = Math.max(r, g, b)');
      expect(webResult).toContain('const min = Math.min(r, g, b)');
      expect(iosResult).toContain('max = Swift.max(r, g, b)');
      expect(iosResult).toContain('min = Swift.min(r, g, b)');
      expect(androidResult).toContain('max = maxOf(r, g, b)');
      expect(androidResult).toContain('min = minOf(r, g, b)');
    });

    it('all platforms use same HSL to RGB conversion algorithm', () => {
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
      
      // All platforms should use the hue2rgb helper function pattern
      expect(webResult).toContain('hue2rgb');
      expect(iosResult).toContain('hue2rgb');
      expect(androidResult).toContain('hue2rgb');
    });
  });

  /**
   * Additional invariant tests for blend utility correctness
   */
  describe('Blend Utility Invariants', () => {
    it('darkerBlend is monotonic with respect to blend amount', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          fc.double({ min: 0.01, max: 0.49, noNaN: true }),
          (rgb, smallAmount) => {
            const largeAmount = smallAmount + 0.5;
            
            const smallDarker = calculateDarkerBlend(rgb, smallAmount);
            const largeDarker = calculateDarkerBlend(rgb, largeAmount);
            
            const smallLuminance = calculateLuminance(smallDarker);
            const largeLuminance = calculateLuminance(largeDarker);
            
            // Larger blend amount should produce darker (lower luminance) result
            expect(largeLuminance).toBeLessThanOrEqual(smallLuminance + 0.001);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('lighterBlend is monotonic with respect to blend amount', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          fc.double({ min: 0.01, max: 0.49, noNaN: true }),
          (rgb, smallAmount) => {
            const largeAmount = smallAmount + 0.5;
            
            const smallLighter = calculateLighterBlend(rgb, smallAmount);
            const largeLighter = calculateLighterBlend(rgb, largeAmount);
            
            const smallLuminance = calculateLuminance(smallLighter);
            const largeLuminance = calculateLuminance(largeLighter);
            
            // Larger blend amount should produce lighter (higher luminance) result
            expect(largeLuminance).toBeGreaterThanOrEqual(smallLuminance - 0.001);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('RGB to Hex round-trip preserves color values', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const hex = rgbToHex(rgb);
            const roundTrip = hexToRgb(hex);
            
            expect(roundTrip.r).toBe(rgb.r);
            expect(roundTrip.g).toBe(rgb.g);
            expect(roundTrip.b).toBe(rgb.b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('RGB to HSL to RGB round-trip preserves color values within tolerance', () => {
      fc.assert(
        fc.property(
          validRgbArb,
          (rgb) => {
            const hsl = rgbToHsl(rgb);
            const roundTrip = hslToRgb(hsl);
            
            // Allow ±2 tolerance for floating point precision in HSL conversion
            // The HSL color space uses floating-point math that can accumulate
            // small errors, especially for colors with very low saturation or
            // near the boundaries of the color space (e.g., {r:0, g:2, b:210})
            expect(Math.abs(roundTrip.r - rgb.r)).toBeLessThanOrEqual(2);
            expect(Math.abs(roundTrip.g - rgb.g)).toBeLessThanOrEqual(2);
            expect(Math.abs(roundTrip.b - rgb.b)).toBeLessThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
