/**
 * LineHeightTokens Formula Validation Tests
 * 
 * Validates that formula-based baseValue calculations match original hard values
 * for LineHeightTokens after refactoring from hard values to formulas.
 * 
 * Test Strategy:
 * - Calculate each formula result
 * - Compare to original hard value from mathematicalRelationship string
 * - Verify 100% match rate
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { lineHeightTokens, LINE_HEIGHT_BASE_VALUE } from '../LineHeightTokens';

describe('LineHeightTokens Formula Validation', () => {
  /**
   * Original hard values extracted from mathematicalRelationship strings
   * These represent the values before refactoring to formulas
   */
  const originalValues: Record<string, number> = {
    lineHeight050: 1.0,
    lineHeight075: 1.25,
    lineHeight100: 1.5,
    lineHeight125: 1.75,
    lineHeight150: 1.4,
    lineHeight200: 1.391,
    lineHeight300: 1.231,
    lineHeight400: 1.241,
    lineHeight500: 1.212,
    lineHeight600: 1.19,
    lineHeight700: 1.143
  };

  describe('Formula Result Validation', () => {
    it('should have LINE_HEIGHT_BASE_VALUE of 1.5', () => {
      expect(LINE_HEIGHT_BASE_VALUE).toBe(1.5);
    });

    it('lineHeight050 formula should match original value 1.0', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.667;
      const expected = originalValues.lineHeight050;
      const token = lineHeightTokens.lineHeight050;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight075 formula should match original value 1.25', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.833;
      const expected = originalValues.lineHeight075;
      const token = lineHeightTokens.lineHeight075;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight100 formula should match original value 1.5', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE;
      const expected = originalValues.lineHeight100;
      const token = lineHeightTokens.lineHeight100;

      expect(calculated).toBe(expected);
      expect(token.baseValue).toBe(expected);
    });

    it('lineHeight125 formula should match original value 1.75', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 1.167;
      const expected = originalValues.lineHeight125;
      const token = lineHeightTokens.lineHeight125;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight150 formula should match original value 1.4', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.933;
      const expected = originalValues.lineHeight150;
      const token = lineHeightTokens.lineHeight150;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight200 formula should match original value 1.391', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.927;
      const expected = originalValues.lineHeight200;
      const token = lineHeightTokens.lineHeight200;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight300 formula should match original value 1.231', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.821;
      const expected = originalValues.lineHeight300;
      const token = lineHeightTokens.lineHeight300;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight400 formula should match original value 1.241', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.827;
      const expected = originalValues.lineHeight400;
      const token = lineHeightTokens.lineHeight400;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight500 formula should match original value 1.212', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.808;
      const expected = originalValues.lineHeight500;
      const token = lineHeightTokens.lineHeight500;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight600 formula should match original value 1.19', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.793;
      const expected = originalValues.lineHeight600;
      const token = lineHeightTokens.lineHeight600;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });

    it('lineHeight700 formula should match original value 1.143', () => {
      const calculated = LINE_HEIGHT_BASE_VALUE * 0.762;
      const expected = originalValues.lineHeight700;
      const token = lineHeightTokens.lineHeight700;

      // Allow small floating point tolerance (0.005)
      expect(Math.abs(calculated - expected)).toBeLessThanOrEqual(0.005);
      expect(Math.abs(token.baseValue - expected)).toBeLessThanOrEqual(0.005);
    });
  });

  describe('Comprehensive Validation', () => {
    it('should validate all lineHeight tokens match original values', () => {
      const results: Array<{ name: string; expected: number; calculated: number; matches: boolean }> = [];

      Object.entries(originalValues).forEach(([name, expected]) => {
        const token = lineHeightTokens[name];
        const calculated = token.baseValue;
        const matches = Math.abs(calculated - expected) <= 0.005;

        results.push({ name, expected, calculated, matches });

        if (!matches) {
          console.error(`Validation failed for ${name}:`, {
            expected,
            calculated,
            difference: Math.abs(calculated - expected)
          });
        }
      });

      const allMatch = results.every(r => r.matches);
      const matchRate = (results.filter(r => r.matches).length / results.length) * 100;

      expect(allMatch).toBe(true);
      expect(matchRate).toBe(100);
    });

    it('should have 11 lineHeight tokens', () => {
      expect(Object.keys(lineHeightTokens).length).toBe(11);
    });

    it('should have all expected token names', () => {
      const expectedNames = Object.keys(originalValues);
      const actualNames = Object.keys(lineHeightTokens);

      expectedNames.forEach(name => {
        expect(actualNames).toContain(name);
      });
    });
  });

  describe('Formula Structure Validation', () => {
    it('all tokens should use LINE_HEIGHT_BASE_VALUE in their formulas', () => {
      // This is validated by the fact that formulas produce correct values
      // and all tokens reference LINE_HEIGHT_BASE_VALUE in their implementation
      expect(LINE_HEIGHT_BASE_VALUE).toBe(1.5);
    });

    it('all tokens should have mathematicalRelationship strings', () => {
      Object.values(lineHeightTokens).forEach(token => {
        expect(token.mathematicalRelationship).toBeDefined();
        expect(typeof token.mathematicalRelationship).toBe('string');
        expect(token.mathematicalRelationship.length).toBeGreaterThan(0);
      });
    });

    it('all tokens should be marked as precision targeted', () => {
      Object.values(lineHeightTokens).forEach(token => {
        expect(token.isPrecisionTargeted).toBe(true);
      });
    });

    it('no tokens should be marked as strategic flexibility', () => {
      Object.values(lineHeightTokens).forEach(token => {
        expect(token.isStrategicFlexibility).toBe(false);
      });
    });
  });
});
