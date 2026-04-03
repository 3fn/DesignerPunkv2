/**
 * @category evergreen
 * @purpose Verify unified sizing tokens are correctly defined and structured
 */
import {
  SIZING_BASE_VALUE,
  sizingTokens,
  sizingTokenNames,
  getSizingToken,
  getAllSizingTokens
} from '../SizingTokens';
import { TokenCategory } from '../../types/PrimitiveToken';

describe('Sizing Tokens', () => {
  describe('Base Value', () => {
    it('should have base value of 8', () => {
      expect(SIZING_BASE_VALUE).toBe(8);
    });
  });

  describe('Token Count', () => {
    it('should define 13 sizing tokens', () => {
      expect(Object.keys(sizingTokens)).toHaveLength(13);
      expect(sizingTokenNames).toHaveLength(13);
      expect(getAllSizingTokens()).toHaveLength(13);
    });
  });

  describe('Formula Validation', () => {
    const expectedValues: Record<string, { multiplier: number; value: number }> = {
      size050:  { multiplier: 0.5, value: 4 },
      size100:  { multiplier: 1, value: 8 },
      size150:  { multiplier: 1.5, value: 12 },
      size200:  { multiplier: 2, value: 16 },
      size250:  { multiplier: 2.5, value: 20 },
      size300:  { multiplier: 3, value: 24 },
      size400:  { multiplier: 4, value: 32 },
      size500:  { multiplier: 5, value: 40 },
      size600:  { multiplier: 6, value: 48 },
      size700:  { multiplier: 7, value: 56 },
      size800:  { multiplier: 8, value: 64 },
      size1000: { multiplier: 10, value: 80 },
      size1600: { multiplier: 16, value: 128 },
    };

    for (const [name, expected] of Object.entries(expectedValues)) {
      it(`${name} should equal base × ${expected.multiplier} = ${expected.value}`, () => {
        const token = sizingTokens[name];
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
      const tokens = getAllSizingTokens();
      for (let i = 1; i < tokens.length; i++) {
        expect(tokens[i].baseValue).toBeGreaterThan(tokens[i - 1].baseValue);
      }
    });

    it('should have all values as multiples of 4 (baseline grid aligned)', () => {
      for (const token of getAllSizingTokens()) {
        expect(token.baseValue % 4).toBe(0);
        expect(token.baselineGridAlignment).toBe(true);
      }
    });

    it('should have familyBaseValue of 8 for all tokens', () => {
      for (const token of getAllSizingTokens()) {
        expect(token.familyBaseValue).toBe(SIZING_BASE_VALUE);
      }
    });

    it('should align with spacing scale for shared values', () => {
      // size100=8 matches space100=8, size300=24 matches space300=24, etc.
      const sharedValues = [
        { sizing: 'size050', value: 4 },
        { sizing: 'size100', value: 8 },
        { sizing: 'size150', value: 12 },
        { sizing: 'size200', value: 16 },
        { sizing: 'size250', value: 20 },
        { sizing: 'size300', value: 24 },
        { sizing: 'size400', value: 32 },
        { sizing: 'size500', value: 40 },
        { sizing: 'size600', value: 48 },
      ];
      for (const { sizing, value } of sharedValues) {
        expect(sizingTokens[sizing].baseValue).toBe(value);
      }
    });
  });

  describe('Token Structure', () => {
    it('should use TokenCategory.SIZING for all tokens', () => {
      for (const token of getAllSizingTokens()) {
        expect(token.category).toBe(TokenCategory.SIZING);
      }
    });

    it('should have platform values with correct units', () => {
      for (const token of getAllSizingTokens()) {
        expect(token.platforms.web.unit).toBe('px');
        expect(token.platforms.ios.unit).toBe('pt');
        expect(token.platforms.android.unit).toBe('dp');
      }
    });

    it('should have consistent values across platforms', () => {
      for (const token of getAllSizingTokens()) {
        expect(token.platforms.web.value).toBe(token.baseValue);
        expect(token.platforms.ios.value).toBe(token.baseValue);
        expect(token.platforms.android.value).toBe(token.baseValue);
      }
    });
  });

  describe('Lookup Helpers', () => {
    it('getSizingToken should return token by name', () => {
      expect(getSizingToken('size100')).toBe(sizingTokens.size100);
    });

    it('getSizingToken should return undefined for unknown name', () => {
      expect(getSizingToken('size999')).toBeUndefined();
    });
  });
});
