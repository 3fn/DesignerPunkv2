/**
 * @category evergreen
 * @purpose Verify FontSizeTokensFormulaValidation tokens are correctly defined and structured
 */
/**
 * FontSizeTokens Formula Validation Tests
 * 
 * Validates that refactored formulas produce the same values as original hard values.
 * This ensures the refactoring from hard values to formulas is mathematically correct.
 */

import { fontSizeTokens, FONT_SIZE_BASE_VALUE, MODULAR_SCALE_RATIO } from '../FontSizeTokens';

describe('FontSizeTokens Formula Validation', () => {
  /**
   * Original hard values before refactoring to formulas
   * These values are the source of truth for validation
   */
  const originalValues: Record<string, number> = {
    fontSize050: 13,
    fontSize075: 14,
    fontSize100: 16,
    fontSize125: 18,
    fontSize150: 20,
    fontSize200: 23,
    fontSize300: 26,
    fontSize400: 29,
    fontSize500: 33,
    fontSize600: 37,
    fontSize700: 42
  };

  describe('Formula Results Match Original Values', () => {
    Object.entries(originalValues).forEach(([tokenName, expectedValue]) => {
      it(`should calculate ${tokenName} correctly (expected: ${expectedValue})`, () => {
        const token = fontSizeTokens[tokenName];
        expect(token).toBeDefined();
        expect(token.baseValue).toBe(expectedValue);
      });
    });
  });

  describe('Formula Consistency', () => {
    it('should use FONT_SIZE_BASE_VALUE constant (16)', () => {
      expect(FONT_SIZE_BASE_VALUE).toBe(16);
    });

    it('should use MODULAR_SCALE_RATIO constant (1.125)', () => {
      expect(MODULAR_SCALE_RATIO).toBe(1.125);
    });

    it('should calculate fontSize050 using division formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE / Math.pow(MODULAR_SCALE_RATIO, 2));
      expect(fontSizeTokens.fontSize050.baseValue).toBe(expected);
      expect(expected).toBe(13);
    });

    it('should calculate fontSize075 using division formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE / MODULAR_SCALE_RATIO);
      expect(fontSizeTokens.fontSize075.baseValue).toBe(expected);
      expect(expected).toBe(14);
    });

    it('should use FONT_SIZE_BASE_VALUE directly for fontSize100', () => {
      expect(fontSizeTokens.fontSize100.baseValue).toBe(FONT_SIZE_BASE_VALUE);
      expect(FONT_SIZE_BASE_VALUE).toBe(16);
    });

    it('should calculate fontSize125 using multiplication formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO);
      expect(fontSizeTokens.fontSize125.baseValue).toBe(expected);
      expect(expected).toBe(18);
    });

    it('should calculate fontSize150 using power formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 2));
      expect(fontSizeTokens.fontSize150.baseValue).toBe(expected);
      expect(expected).toBe(20);
    });

    it('should calculate fontSize200 using power formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 3));
      expect(fontSizeTokens.fontSize200.baseValue).toBe(expected);
      expect(expected).toBe(23);
    });

    it('should calculate fontSize300 using power formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 4));
      expect(fontSizeTokens.fontSize300.baseValue).toBe(expected);
      expect(expected).toBe(26);
    });

    it('should calculate fontSize400 using power formula', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 5));
      expect(fontSizeTokens.fontSize400.baseValue).toBe(expected);
      expect(expected).toBe(29);
    });

    it('should calculate fontSize500 using power formula with adjustment', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 6)) + 1;
      expect(fontSizeTokens.fontSize500.baseValue).toBe(expected);
      expect(expected).toBe(33);
    });

    it('should calculate fontSize600 using power formula with adjustment', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 7)) + 1;
      expect(fontSizeTokens.fontSize600.baseValue).toBe(expected);
      expect(expected).toBe(37);
    });

    it('should calculate fontSize700 using power formula with adjustment', () => {
      const expected = Math.round(FONT_SIZE_BASE_VALUE * Math.pow(MODULAR_SCALE_RATIO, 8)) + 1;
      expect(fontSizeTokens.fontSize700.baseValue).toBe(expected);
      expect(expected).toBe(42);
    });
  });

  describe('Mathematical Relationship Strings', () => {
    it('should preserve mathematicalRelationship strings unchanged', () => {
      expect(fontSizeTokens.fontSize050.mathematicalRelationship).toBe('base ÷ (1.125²) = 16 ÷ 1.266 ≈ 13');
      expect(fontSizeTokens.fontSize075.mathematicalRelationship).toBe('base ÷ 1.125 = 16 ÷ 1.125 ≈ 14');
      expect(fontSizeTokens.fontSize100.mathematicalRelationship).toBe('base × 1 = 16 × 1 = 16');
      expect(fontSizeTokens.fontSize125.mathematicalRelationship).toBe('base × 1.125 = 16 × 1.125 = 18');
      expect(fontSizeTokens.fontSize150.mathematicalRelationship).toBe('base × (1.125²) = 16 × 1.266 ≈ 20');
      expect(fontSizeTokens.fontSize200.mathematicalRelationship).toBe('base × (1.125³) = 16 × 1.424 ≈ 23');
      expect(fontSizeTokens.fontSize300.mathematicalRelationship).toBe('base × (1.125⁴) = 16 × 1.602 ≈ 26');
      expect(fontSizeTokens.fontSize400.mathematicalRelationship).toBe('base × (1.125⁵) = 16 × 1.802 ≈ 29');
      expect(fontSizeTokens.fontSize500.mathematicalRelationship).toBe('base × (1.125⁶) = 16 × 2.027 ≈ 32.4 → 33 (adjusted for 4pt subgrid)');
      expect(fontSizeTokens.fontSize600.mathematicalRelationship).toBe('base × (1.125⁷) = 16 × 2.281 ≈ 36.5 → 37 (adjusted for 4pt subgrid)');
      expect(fontSizeTokens.fontSize700.mathematicalRelationship).toBe('base × (1.125⁸) = 16 × 2.566 ≈ 41.1 → 42 (adjusted for 4pt subgrid)');
    });
  });

  describe('Platform Values', () => {
    it('should generate correct platform values for all tokens', () => {
      Object.entries(originalValues).forEach(([tokenName, expectedValue]) => {
        const token = fontSizeTokens[tokenName];
        
        // Web: REM units (baseValue / 16)
        expect(token.platforms.web.value).toBe(expectedValue / FONT_SIZE_BASE_VALUE);
        expect(token.platforms.web.unit).toBe('rem');
        
        // iOS: pt units (baseValue)
        expect(token.platforms.ios.value).toBe(expectedValue);
        expect(token.platforms.ios.unit).toBe('pt');
        
        // Android: sp units (baseValue)
        expect(token.platforms.android.value).toBe(expectedValue);
        expect(token.platforms.android.unit).toBe('sp');
      });
    });
  });

  describe('Validation Summary', () => {
    it('should have 100% match rate between formulas and original values', () => {
      const totalTokens = Object.keys(originalValues).length;
      let matchCount = 0;

      Object.entries(originalValues).forEach(([tokenName, expectedValue]) => {
        const token = fontSizeTokens[tokenName];
        if (token && token.baseValue === expectedValue) {
          matchCount++;
        }
      });

      const matchRate = (matchCount / totalTokens) * 100;
      expect(matchRate).toBe(100);
      expect(matchCount).toBe(totalTokens);
    });

    it('should validate all 11 fontSize tokens', () => {
      expect(Object.keys(originalValues).length).toBe(11);
      expect(Object.keys(fontSizeTokens).length).toBeGreaterThanOrEqual(11);
    });
  });
});
