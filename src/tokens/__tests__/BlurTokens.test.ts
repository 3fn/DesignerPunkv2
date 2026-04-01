/**
 * @category evergreen
 * @purpose Verify unified blur tokens are correctly defined and structured
 */
import {
  BLUR_BASE_VALUE,
  blur,
  blurNames,
  getBlurToken,
  getAllBlurTokens
} from '../BlurTokens';
import { TokenCategory } from '../../types/PrimitiveToken';

describe('Unified Blur Tokens', () => {
  describe('Base Value', () => {
    it('should have base value of 16', () => {
      expect(BLUR_BASE_VALUE).toBe(16);
    });
  });

  describe('Token Count', () => {
    it('should define 9 blur tokens', () => {
      expect(Object.keys(blur)).toHaveLength(9);
      expect(blurNames).toHaveLength(9);
      expect(getAllBlurTokens()).toHaveLength(9);
    });
  });

  describe('Formula Validation', () => {
    const expectedValues: Record<string, { multiplier: number; value: number }> = {
      blur000: { multiplier: 0, value: 0 },
      blur025: { multiplier: 0.25, value: 4 },
      blur050: { multiplier: 0.5, value: 8 },
      blur075: { multiplier: 0.75, value: 12 },
      blur100: { multiplier: 1, value: 16 },
      blur125: { multiplier: 1.25, value: 20 },
      blur150: { multiplier: 1.5, value: 24 },
      blur200: { multiplier: 2, value: 32 },
      blur250: { multiplier: 2.5, value: 40 },
    };

    for (const [name, expected] of Object.entries(expectedValues)) {
      it(`${name} should equal base × ${expected.multiplier} = ${expected.value}`, () => {
        const token = blur[name];
        expect(token).toBeDefined();
        expect(token.baseValue).toBe(expected.value);
        expect(token.platforms.web.value).toBe(expected.value);
        expect(token.platforms.ios.value).toBe(expected.value);
        expect(token.platforms.android.value).toBe(expected.value);
      });
    }
  });

  describe('Mathematical Relationships', () => {
    it('should follow ascending scale progression', () => {
      const tokens = getAllBlurTokens();
      for (let i = 1; i < tokens.length; i++) {
        expect(tokens[i].baseValue).toBeGreaterThan(tokens[i - 1].baseValue);
      }
    });

    it('should have all values as multiples of 4 (baseline grid aligned)', () => {
      for (const token of getAllBlurTokens()) {
        expect(token.baseValue % 4).toBe(0);
        expect(token.baselineGridAlignment).toBe(true);
      }
    });

    it('should have familyBaseValue of 16 for all tokens', () => {
      for (const token of getAllBlurTokens()) {
        expect(token.familyBaseValue).toBe(BLUR_BASE_VALUE);
      }
    });
  });

  describe('Token Structure', () => {
    it('should use TokenCategory.BLUR for all tokens', () => {
      for (const token of getAllBlurTokens()) {
        expect(token.category).toBe(TokenCategory.BLUR);
      }
    });

    it('should have platform values with correct units', () => {
      for (const token of getAllBlurTokens()) {
        expect(token.platforms.web.unit).toBe('px');
        expect(token.platforms.ios.unit).toBe('pt');
        expect(token.platforms.android.unit).toBe('dp');
      }
    });

    it('should have consistent values across platforms', () => {
      for (const token of getAllBlurTokens()) {
        expect(token.platforms.web.value).toBe(token.baseValue);
        expect(token.platforms.ios.value).toBe(token.baseValue);
        expect(token.platforms.android.value).toBe(token.baseValue);
      }
    });
  });

  describe('Lookup Helpers', () => {
    it('getBlurToken should return token by name', () => {
      expect(getBlurToken('blur100')).toBe(blur.blur100);
    });

    it('getBlurToken should return undefined for unknown name', () => {
      expect(getBlurToken('blur999')).toBeUndefined();
    });
  });
});
