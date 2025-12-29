/**
 * Theme-Aware Blend Utilities Tests
 * 
 * Tests for the theme-aware blend utility wrapper functions.
 * Validates that the factory functions work correctly and produce expected blend results.
 * 
 * Architecture: These utilities are designed for vanilla Web Components that read
 * theme colors from CSS custom properties via getComputedStyle(document.documentElement).
 * 
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */

import {
  useBlendUtilities, // deprecated alias, kept for backward compatibility
  getBlendUtilities,
  createBlendUtilities,
  BlendTokenValues,
  BlendUtilitiesResult
} from '../ThemeAwareBlendUtilities.web';

describe('ThemeAwareBlendUtilities.web', () => {
  describe('BlendTokenValues', () => {
    it('should have correct blend token values', () => {
      expect(BlendTokenValues.hoverDarker).toBe(0.08);
      expect(BlendTokenValues.pressedDarker).toBe(0.12);
      expect(BlendTokenValues.focusSaturate).toBe(0.08);
      expect(BlendTokenValues.disabledDesaturate).toBe(0.12);
      expect(BlendTokenValues.iconLighter).toBe(0.08);
    });
  });

  describe('createBlendUtilities', () => {
    let blendUtils: BlendUtilitiesResult;

    beforeEach(() => {
      blendUtils = createBlendUtilities();
    });

    it('should return all expected utility functions', () => {
      expect(typeof blendUtils.hoverColor).toBe('function');
      expect(typeof blendUtils.pressedColor).toBe('function');
      expect(typeof blendUtils.focusColor).toBe('function');
      expect(typeof blendUtils.disabledColor).toBe('function');
      expect(typeof blendUtils.iconColor).toBe('function');
      expect(typeof blendUtils.darkerBlend).toBe('function');
      expect(typeof blendUtils.lighterBlend).toBe('function');
      expect(typeof blendUtils.saturate).toBe('function');
      expect(typeof blendUtils.desaturate).toBe('function');
    });

    describe('hoverColor', () => {
      it('should darken color by 8% (blend200)', () => {
        const result = blendUtils.hoverColor('#A855F7');
        // 8% darker should produce a noticeably darker color
        expect(result).not.toBe('#A855F7');
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('should return original color for invalid input', () => {
        const result = blendUtils.hoverColor('invalid');
        expect(result).toBe('invalid');
      });
    });

    describe('pressedColor', () => {
      it('should darken color by 12% (blend300)', () => {
        const result = blendUtils.pressedColor('#A855F7');
        // 12% darker should produce a darker color than hover
        const hoverResult = blendUtils.hoverColor('#A855F7');
        expect(result).not.toBe('#A855F7');
        expect(result).not.toBe(hoverResult);
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('focusColor', () => {
      it('should saturate color by 8% (blend200)', () => {
        const result = blendUtils.focusColor('#A855F7');
        // Saturated color should be different
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('disabledColor', () => {
      it('should desaturate color by 12% (blend300)', () => {
        const result = blendUtils.disabledColor('#A855F7');
        // Desaturated color should be different
        expect(result).not.toBe('#A855F7');
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('iconColor', () => {
      it('should lighten color by 8% (blend200)', () => {
        const result = blendUtils.iconColor('#A855F7');
        // Lightened color should be different
        expect(result).not.toBe('#A855F7');
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    describe('generic blend functions', () => {
      it('darkerBlend should accept custom amount', () => {
        const result = blendUtils.darkerBlend('#A855F7', 0.20);
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('lighterBlend should accept custom amount', () => {
        const result = blendUtils.lighterBlend('#A855F7', 0.20);
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('saturate should accept custom amount', () => {
        const result = blendUtils.saturate('#A855F7', 0.20);
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });

      it('desaturate should accept custom amount', () => {
        const result = blendUtils.desaturate('#A855F7', 0.20);
        expect(result).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });
  });

  describe('useBlendUtilities (deprecated alias)', () => {
    it('should return the same interface as createBlendUtilities', () => {
      // useBlendUtilities is a deprecated alias for backward compatibility
      const aliasResult = useBlendUtilities();
      const factoryResult = createBlendUtilities();

      // Both should have the same function names
      expect(Object.keys(aliasResult).sort()).toEqual(Object.keys(factoryResult).sort());
    });

    it('should produce consistent results', () => {
      const aliasResult = useBlendUtilities();
      const testColor = '#FF5733';

      // Results should be consistent across calls
      expect(aliasResult.hoverColor(testColor)).toBe(aliasResult.hoverColor(testColor));
      expect(aliasResult.pressedColor(testColor)).toBe(aliasResult.pressedColor(testColor));
    });
  });

  describe('getBlendUtilities (primary export)', () => {
    it('should return the same interface as createBlendUtilities', () => {
      const getResult = getBlendUtilities();
      const factoryResult = createBlendUtilities();

      // Both should have the same function names
      expect(Object.keys(getResult).sort()).toEqual(Object.keys(factoryResult).sort());
    });

    it('should work for Web Component and vanilla TypeScript usage', () => {
      // Simulates how a Web Component would use this:
      // 1. Read color from CSS custom property (simulated here with hardcoded value)
      // 2. Apply blend utility to calculate state color
      const blendUtils = getBlendUtilities();
      const primaryColor = '#A855F7'; // Would come from getComputedStyle() in real usage
      const result = blendUtils.hoverColor(primaryColor);
      expect(result).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('Cross-platform consistency', () => {
    it('should use same blend token values as design system', () => {
      // These values should match BlendTokens in src/tokens/BlendTokens.ts
      // blend200 = 0.08, blend300 = 0.12
      expect(BlendTokenValues.hoverDarker).toBe(0.08);  // blend200
      expect(BlendTokenValues.pressedDarker).toBe(0.12); // blend300
      expect(BlendTokenValues.focusSaturate).toBe(0.08); // blend200
      expect(BlendTokenValues.disabledDesaturate).toBe(0.12); // blend300
      expect(BlendTokenValues.iconLighter).toBe(0.08); // blend200
    });
  });

  describe('Invalid input handling', () => {
    let blendUtils: BlendUtilitiesResult;

    beforeEach(() => {
      blendUtils = createBlendUtilities();
    });

    it('should return original color for invalid hex strings', () => {
      expect(blendUtils.hoverColor('not-a-color')).toBe('not-a-color');
      expect(blendUtils.pressedColor('invalid')).toBe('invalid');
      expect(blendUtils.focusColor('xyz')).toBe('xyz');
      expect(blendUtils.disabledColor('')).toBe('');
    });

    it('should handle edge case colors', () => {
      // Black
      expect(blendUtils.hoverColor('#000000')).toMatch(/^#[0-9A-F]{6}$/i);
      // White
      expect(blendUtils.lighterBlend('#FFFFFF', 0.08)).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
