/**
 * @category evergreen
 * @purpose Verify BlendCalculator functionality works correctly
 */
/**
 * BlendCalculator Integration Tests
 * 
 * Tests the BlendCalculator orchestrator with all blend directions
 * and verifies integration with color space utilities and blend tokens.
 */

import { BlendCalculator, calculateBlend } from '../BlendCalculator';
import { blendTokens, BlendDirection } from '../../tokens/BlendTokens';
import { hexToRgb } from '../ColorSpaceUtils';

describe('BlendCalculator', () => {
  let calculator: BlendCalculator;

  beforeEach(() => {
    calculator = new BlendCalculator();
  });

  describe('calculateBlend method', () => {
    describe('darker blend direction', () => {
      it('should darken purple500 with blend200', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.DARKER
        );

        // Verify result is a valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);

        // Verify color is darker than original
        const original = hexToRgb('#A855F7');
        const darkened = hexToRgb(result);
        expect(darkened.r).toBeLessThan(original.r);
        expect(darkened.g).toBeLessThan(original.g);
        expect(darkened.b).toBeLessThan(original.b);
      });

      it('should darken blue500 with blend300', () => {
        const result = calculator.calculateBlend(
          '#3B82F6',
          blendTokens.blend300,
          BlendDirection.DARKER
        );

        const original = hexToRgb('#3B82F6');
        const darkened = hexToRgb(result);
        expect(darkened.r).toBeLessThan(original.r);
        expect(darkened.g).toBeLessThan(original.g);
        expect(darkened.b).toBeLessThan(original.b);
      });

      it('should produce darker colors with increasing blend values', () => {
        const base = '#A855F7';
        const blend100Result = calculator.calculateBlend(base, blendTokens.blend100, BlendDirection.DARKER);
        const blend200Result = calculator.calculateBlend(base, blendTokens.blend200, BlendDirection.DARKER);
        const blend300Result = calculator.calculateBlend(base, blendTokens.blend300, BlendDirection.DARKER);

        const rgb100 = hexToRgb(blend100Result);
        const rgb200 = hexToRgb(blend200Result);
        const rgb300 = hexToRgb(blend300Result);

        // Higher blend values should produce darker colors
        expect(rgb200.r).toBeLessThan(rgb100.r);
        expect(rgb300.r).toBeLessThan(rgb200.r);
      });
    });

    describe('lighter blend direction', () => {
      it('should lighten purple500 with blend200', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.LIGHTER
        );

        // Verify result is a valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);

        // Verify color is lighter than original
        const original = hexToRgb('#A855F7');
        const lightened = hexToRgb(result);
        expect(lightened.r).toBeGreaterThan(original.r);
        expect(lightened.g).toBeGreaterThan(original.g);
        expect(lightened.b).toBeGreaterThan(original.b);
      });

      it('should lighten blue500 with blend300', () => {
        const result = calculator.calculateBlend(
          '#3B82F6',
          blendTokens.blend300,
          BlendDirection.LIGHTER
        );

        const original = hexToRgb('#3B82F6');
        const lightened = hexToRgb(result);
        expect(lightened.r).toBeGreaterThan(original.r);
        expect(lightened.g).toBeGreaterThan(original.g);
        expect(lightened.b).toBeGreaterThan(original.b);
      });

      it('should produce lighter colors with increasing blend values', () => {
        const base = '#A855F7';
        const blend100Result = calculator.calculateBlend(base, blendTokens.blend100, BlendDirection.LIGHTER);
        const blend200Result = calculator.calculateBlend(base, blendTokens.blend200, BlendDirection.LIGHTER);
        const blend300Result = calculator.calculateBlend(base, blendTokens.blend300, BlendDirection.LIGHTER);

        const rgb100 = hexToRgb(blend100Result);
        const rgb200 = hexToRgb(blend200Result);
        const rgb300 = hexToRgb(blend300Result);

        // Higher blend values should produce lighter colors
        expect(rgb200.r).toBeGreaterThan(rgb100.r);
        expect(rgb300.r).toBeGreaterThan(rgb200.r);
      });
    });

    describe('saturate blend direction', () => {
      it('should saturate purple500 with blend200', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.SATURATE
        );

        // Verify result is a valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
        
        // Result should be different from original (more saturated)
        expect(result).not.toBe('#A855F7');
      });

      it('should saturate blue500 with blend300', () => {
        const result = calculator.calculateBlend(
          '#3B82F6',
          blendTokens.blend300,
          BlendDirection.SATURATE
        );

        expect(result).toMatch(/^#[0-9A-F]{6}$/);
        expect(result).not.toBe('#3B82F6');
      });

      it('should handle saturation at maximum (clamped to 1.0)', () => {
        // Start with a highly saturated color
        const result = calculator.calculateBlend(
          '#FF0000',
          blendTokens.blend500,
          BlendDirection.SATURATE
        );

        // Should still return valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    describe('desaturate blend direction', () => {
      it('should desaturate purple500 with blend200', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.DESATURATE
        );

        // Verify result is a valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
        
        // Result should be different from original (less saturated)
        expect(result).not.toBe('#A855F7');
      });

      it('should desaturate blue500 with blend300', () => {
        const result = calculator.calculateBlend(
          '#3B82F6',
          blendTokens.blend300,
          BlendDirection.DESATURATE
        );

        expect(result).toMatch(/^#[0-9A-F]{6}$/);
        expect(result).not.toBe('#3B82F6');
      });

      it('should handle desaturation at minimum (clamped to 0.0)', () => {
        // Start with a gray color (low saturation)
        const result = calculator.calculateBlend(
          '#808080',
          blendTokens.blend500,
          BlendDirection.DESATURATE
        );

        // Should still return valid hex color
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    describe('error handling', () => {
      it('should throw error for invalid hex color', () => {
        expect(() => {
          calculator.calculateBlend(
            'invalid',
            blendTokens.blend200,
            BlendDirection.DARKER
          );
        }).toThrow('Invalid hex color');
      });

      it('should throw error for unsupported blend direction', () => {
        expect(() => {
          calculator.calculateBlend(
            '#A855F7',
            blendTokens.blend200,
            'invalid' as BlendDirection
          );
        }).toThrow('Unsupported blend direction');
      });
    });

    describe('integration with all blend tokens', () => {
      it('should work with blend100', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend100,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should work with blend200', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should work with blend300', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend300,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should work with blend400', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend400,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should work with blend500', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend500,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    describe('hex format handling', () => {
      it('should handle hex colors with # prefix', () => {
        const result = calculator.calculateBlend(
          '#A855F7',
          blendTokens.blend200,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should handle hex colors without # prefix', () => {
        const result = calculator.calculateBlend(
          'A855F7',
          blendTokens.blend200,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });

      it('should handle 3-digit hex colors', () => {
        const result = calculator.calculateBlend(
          '#ABC',
          blendTokens.blend200,
          BlendDirection.DARKER
        );
        expect(result).toMatch(/^#[0-9A-F]{6}$/);
      });
    });
  });

  describe('calculateBlend convenience function', () => {
    it('should work with darker direction', () => {
      const result = calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.DARKER
      );
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should work with lighter direction', () => {
      const result = calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.LIGHTER
      );
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should work with saturate direction', () => {
      const result = calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.SATURATE
      );
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should work with desaturate direction', () => {
      const result = calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.DESATURATE
      );
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should produce same results as BlendCalculator instance', () => {
      const instanceResult = calculator.calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.DARKER
      );
      const functionResult = calculateBlend(
        '#A855F7',
        blendTokens.blend200,
        BlendDirection.DARKER
      );
      expect(functionResult).toBe(instanceResult);
    });
  });

  describe('cross-direction integration', () => {
    it('should produce different results for different directions', () => {
      const base = '#A855F7';
      const token = blendTokens.blend200;

      const darker = calculator.calculateBlend(base, token, BlendDirection.DARKER);
      const lighter = calculator.calculateBlend(base, token, BlendDirection.LIGHTER);
      const saturated = calculator.calculateBlend(base, token, BlendDirection.SATURATE);
      const desaturated = calculator.calculateBlend(base, token, BlendDirection.DESATURATE);

      // All results should be different
      expect(darker).not.toBe(lighter);
      expect(darker).not.toBe(saturated);
      expect(darker).not.toBe(desaturated);
      expect(lighter).not.toBe(saturated);
      expect(lighter).not.toBe(desaturated);
      expect(saturated).not.toBe(desaturated);
    });

    it('should work with multiple colors and directions', () => {
      const colors = ['#A855F7', '#3B82F6', '#10B981', '#EF4444'];
      const directions = [
        BlendDirection.DARKER,
        BlendDirection.LIGHTER,
        BlendDirection.SATURATE,
        BlendDirection.DESATURATE
      ];

      colors.forEach(color => {
        directions.forEach(direction => {
          const result = calculator.calculateBlend(
            color,
            blendTokens.blend200,
            direction
          );
          expect(result).toMatch(/^#[0-9A-F]{6}$/);
        });
      });
    });
  });
});
