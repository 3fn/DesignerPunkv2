/**
 * @category evergreen
 * @purpose Verify WCAG validation catches invalid patterns and enforces rules
 */
/**
 * WCAGValidator Unit Tests
 * 
 * Tests for WCAG compliance validation of accessibility tokens.
 * Covers contrast ratio calculations, focus visibility validation,
 * and WCAG success criteria compliance.
 */

import { WCAGValidator, WCAGValidationResult } from '../WCAGValidator';

describe('WCAGValidator', () => {
  let validator: WCAGValidator;

  beforeEach(() => {
    validator = new WCAGValidator();
  });

  describe('Focus Contrast Validation', () => {
    describe('WCAG 1.4.11 Non-text Contrast (3:1 minimum)', () => {
      test('should pass with sufficient contrast (3:1 or higher)', () => {
        // Blue on white - high contrast
        const result = validator.validateFocusContrast('#3B82F6', '#FFFFFF');
        
        expect(result.level).toBe('pass');
        expect(result.message).toContain('meets WCAG 1.4.11');
        expect(result.contrastRatio).toBeGreaterThanOrEqual(3.0);
      });

      test('should pass with exactly 3:1 contrast ratio', () => {
        // Colors with approximately 3:1 contrast
        const result = validator.validateFocusContrast('#767676', '#FFFFFF');
        
        expect(result.level).toBe('pass');
        expect(result.contrastRatio).toBeGreaterThanOrEqual(3.0);
      });

      test('should fail with insufficient contrast (below 3:1)', () => {
        // Light gray on white - low contrast
        const result = validator.validateFocusContrast('#E0E0E0', '#FFFFFF');
        
        expect(result.level).toBe('error');
        expect(result.message).toContain('fails WCAG 1.4.11');
        expect(result.wcag).toBe('1.4.11 Non-text Contrast (Level AA)');
        expect(result.contrastRatio).toBeLessThan(3.0);
      });

      test('should include contrast ratio in result', () => {
        const result = validator.validateFocusContrast('#000000', '#FFFFFF');
        
        expect(result.contrastRatio).toBeDefined();
        expect(result.contrastRatio).toBeCloseTo(21, 1); // Maximum contrast
      });

      test('should handle black on white (maximum contrast)', () => {
        const result = validator.validateFocusContrast('#000000', '#FFFFFF');
        
        expect(result.level).toBe('pass');
        expect(result.contrastRatio).toBeCloseTo(21, 1);
      });

      test('should handle white on black (maximum contrast)', () => {
        const result = validator.validateFocusContrast('#FFFFFF', '#000000');
        
        expect(result.level).toBe('pass');
        expect(result.contrastRatio).toBeCloseTo(21, 1);
      });
    });
  });

  describe('Focus Visibility Validation', () => {
    describe('WCAG 2.4.7 Focus Visible', () => {
      test('should pass with recommended values (2px width, 2px offset)', () => {
        const result = validator.validateFocusVisibility(2, 2);
        
        expect(result.level).toBe('pass');
        expect(result.message).toContain('meets WCAG 2.4.7');
      });

      test('should warn with minimum valid values (1px width, 0px offset)', () => {
        const result = validator.validateFocusVisibility(0, 1);
        
        // 0px offset with 1px width is valid but suboptimal
        expect(result.level).toBe('warning');
        expect(result.message).toContain('may have reduced visibility');
      });

      test('should pass with larger values', () => {
        const result = validator.validateFocusVisibility(4, 3);
        
        expect(result.level).toBe('pass');
      });

      test('should fail with width below 1px', () => {
        const result = validator.validateFocusVisibility(2, 0);
        
        expect(result.level).toBe('error');
        expect(result.message).toContain('below minimum');
        expect(result.wcag).toBe('2.4.7 Focus Visible (Level AA)');
      });

      test('should fail with negative offset', () => {
        const result = validator.validateFocusVisibility(-1, 2);
        
        expect(result.level).toBe('error');
        expect(result.message).toContain('negative');
        expect(result.wcag).toBe('2.4.7 Focus Visible (Level AA)');
      });

      test('should warn with suboptimal but valid values (0px offset, 1px width)', () => {
        const result = validator.validateFocusVisibility(0, 1);
        
        expect(result.level).toBe('warning');
        expect(result.message).toContain('may have reduced visibility');
        expect(result.message).toContain('consider 2px');
      });
    });
  });

  describe('Contrast Ratio Calculation', () => {
    test('should calculate correct contrast ratio for black and white', () => {
      const ratio = validator.calculateContrastRatio('#000000', '#FFFFFF');
      
      expect(ratio).toBeCloseTo(21, 1); // Maximum contrast
    });

    test('should calculate correct contrast ratio for same colors', () => {
      const ratio = validator.calculateContrastRatio('#808080', '#808080');
      
      expect(ratio).toBeCloseTo(1, 1); // Minimum contrast
    });

    test('should handle 3-digit hex format (#RGB)', () => {
      const ratio = validator.calculateContrastRatio('#000', '#FFF');
      
      expect(ratio).toBeCloseTo(21, 1);
    });

    test('should handle 6-digit hex format (#RRGGBB)', () => {
      const ratio = validator.calculateContrastRatio('#000000', '#FFFFFF');
      
      expect(ratio).toBeCloseTo(21, 1);
    });

    test('should handle colors with # prefix', () => {
      const ratio = validator.calculateContrastRatio('#3B82F6', '#FFFFFF');
      
      expect(ratio).toBeGreaterThan(1);
    });

    test('should handle colors without # prefix', () => {
      const ratio = validator.calculateContrastRatio('3B82F6', 'FFFFFF');
      
      expect(ratio).toBeGreaterThan(1);
    });

    test('should be symmetric (order should not matter)', () => {
      const ratio1 = validator.calculateContrastRatio('#3B82F6', '#FFFFFF');
      const ratio2 = validator.calculateContrastRatio('#FFFFFF', '#3B82F6');
      
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });

    test('should calculate known contrast ratios correctly', () => {
      // Test with known color pairs and their approximate contrast ratios
      const testCases = [
        { color1: '#000000', color2: '#FFFFFF', expectedRatio: 21 },
        { color1: '#767676', color2: '#FFFFFF', expectedRatio: 4.54 }, // Actual ratio for #767676
        { color1: '#595959', color2: '#FFFFFF', expectedRatio: 7.0 },  // Actual ratio for #595959
      ];

      testCases.forEach(({ color1, color2, expectedRatio }) => {
        const ratio = validator.calculateContrastRatio(color1, color2);
        expect(ratio).toBeCloseTo(expectedRatio, 0.5);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid hex format gracefully', () => {
      // Invalid format should fallback to black (#000000)
      const ratio = validator.calculateContrastRatio('invalid', '#FFFFFF');
      
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThanOrEqual(21);
    });

    test('should handle empty string gracefully', () => {
      const ratio = validator.calculateContrastRatio('', '#FFFFFF');
      
      expect(ratio).toBeGreaterThan(1);
    });

    test('should handle very small width values', () => {
      const result = validator.validateFocusVisibility(2, 0.5);
      
      expect(result.level).toBe('error');
    });

    test('should handle very large width values', () => {
      const result = validator.validateFocusVisibility(10, 100);
      
      expect(result.level).toBe('pass');
    });

    test('should handle zero offset with adequate width', () => {
      const result = validator.validateFocusVisibility(0, 2);
      
      expect(result.level).toBe('pass');
    });
  });

  describe('Integration with Accessibility Tokens', () => {
    test('should validate typical focus indicator configuration', () => {
      // Typical configuration: 2px offset, 2px width, blue on white
      const visibilityResult = validator.validateFocusVisibility(2, 2);
      const contrastResult = validator.validateFocusContrast('#3B82F6', '#FFFFFF');
      
      expect(visibilityResult.level).toBe('pass');
      expect(contrastResult.level).toBe('pass');
    });

    test('should detect invalid focus indicator configuration', () => {
      // Invalid configuration: 0px width, low contrast
      const visibilityResult = validator.validateFocusVisibility(2, 0);
      const contrastResult = validator.validateFocusContrast('#E0E0E0', '#FFFFFF');
      
      expect(visibilityResult.level).toBe('error');
      expect(contrastResult.level).toBe('error');
    });

    test('should provide actionable feedback for improvements', () => {
      // Suboptimal configuration
      const result = validator.validateFocusVisibility(0, 1);
      
      expect(result.level).toBe('warning');
      expect(result.message).toContain('consider');
    });
  });
});
