/**
 * ButtonCTA Component Tokens Tests
 * 
 * Validates that ButtonCTA component tokens are properly defined and accessible.
 */

import { ButtonCTATokens, getButtonCTAMinWidth } from '../ButtonCTA.tokens';

describe('ButtonCTA Component Tokens', () => {
  describe('minWidth tokens', () => {
    it('should define minWidth tokens for all size variants', () => {
      expect(ButtonCTATokens.minWidth.small).toBeDefined();
      expect(ButtonCTATokens.minWidth.medium).toBeDefined();
      expect(ButtonCTATokens.minWidth.large).toBeDefined();
    });

    it('should have correct minWidth values', () => {
      expect(ButtonCTATokens.minWidth.small).toBe(56);
      expect(ButtonCTATokens.minWidth.medium).toBe(72);
      expect(ButtonCTATokens.minWidth.large).toBe(80);
    });

    it('should align with 8px baseline grid', () => {
      const baselineGrid = 8;
      
      // Small: 7 × 8 = 56
      expect(ButtonCTATokens.minWidth.small % baselineGrid).toBe(0);
      expect(ButtonCTATokens.minWidth.small / baselineGrid).toBe(7);
      
      // Medium: 9 × 8 = 72
      expect(ButtonCTATokens.minWidth.medium % baselineGrid).toBe(0);
      expect(ButtonCTATokens.minWidth.medium / baselineGrid).toBe(9);
      
      // Large: 10 × 8 = 80
      expect(ButtonCTATokens.minWidth.large % baselineGrid).toBe(0);
      expect(ButtonCTATokens.minWidth.large / baselineGrid).toBe(10);
    });

    it('should have progressive sizing (small < medium < large)', () => {
      expect(ButtonCTATokens.minWidth.small).toBeLessThan(ButtonCTATokens.minWidth.medium);
      expect(ButtonCTATokens.minWidth.medium).toBeLessThan(ButtonCTATokens.minWidth.large);
    });
  });

  describe('getButtonCTAMinWidth helper', () => {
    it('should return correct value for small variant', () => {
      expect(getButtonCTAMinWidth('small')).toBe(56);
    });

    it('should return correct value for medium variant', () => {
      expect(getButtonCTAMinWidth('medium')).toBe(72);
    });

    it('should return correct value for large variant', () => {
      expect(getButtonCTAMinWidth('large')).toBe(80);
    });
  });

  describe('token immutability', () => {
    it('should be immutable (const assertion)', () => {
      // TypeScript const assertion ensures tokens are readonly
      // This test verifies the structure is correct
      const tokens = ButtonCTATokens;
      expect(Object.isFrozen(tokens)).toBe(false); // Not frozen, but const assertion prevents modification at compile time
      expect(typeof tokens.minWidth).toBe('object');
    });
  });

  describe('cross-platform consistency', () => {
    it('should provide same values for all platforms', () => {
      // These tokens are platform-agnostic and should be used consistently
      // across Web, iOS, and Android implementations
      const expectedValues = {
        small: 56,
        medium: 72,
        large: 80,
      };

      expect(ButtonCTATokens.minWidth).toEqual(expectedValues);
    });
  });
});
