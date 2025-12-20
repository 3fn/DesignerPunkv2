/**
 * @category evergreen
 * @purpose Verify Opacity tokens are correctly defined and structured
 */
/**
 * Opacity Tokens Unit Tests
 * 
 * Tests for opacity token structure, mathematical relationships, and cross-platform consistency.
 * Covers primitive token object structure, helper functions, and platform value generation.
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  opacityTokens,
  opacityTokenNames,
  getOpacityToken,
  getAllOpacityTokens,
  OPACITY_BASE_VALUE
} from '../OpacityTokens';

describe('Opacity Tokens', () => {
  describe('Base Value', () => {
    test('OPACITY_BASE_VALUE should equal 0.08', () => {
      expect(OPACITY_BASE_VALUE).toBe(0.08);
    });
  });

  describe('PrimitiveToken Object Structure', () => {
    test('should have correct structure for all opacity tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        // Validate required fields
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('baseValue');
        expect(token).toHaveProperty('familyBaseValue');
        expect(token).toHaveProperty('description');
        expect(token).toHaveProperty('mathematicalRelationship');
        expect(token).toHaveProperty('baselineGridAlignment');
        expect(token).toHaveProperty('isStrategicFlexibility');
        expect(token).toHaveProperty('isPrecisionTargeted');
        expect(token).toHaveProperty('platforms');
        
        // Validate category
        expect(token.category).toBe(TokenCategory.OPACITY);
        
        // Validate platform structure
        expect(token.platforms).toHaveProperty('web');
        expect(token.platforms).toHaveProperty('ios');
        expect(token.platforms).toHaveProperty('android');
      });
    });

    test('should have correct token names', () => {
      expect(opacityTokenNames).toEqual([
        'opacity000',
        'opacity100',
        'opacity200',
        'opacity300',
        'opacity400',
        'opacity500',
        'opacity600',
        'opacity700',
        'opacity800',
        'opacity900',
        'opacity1000',
        'opacity1100',
        'opacity1200',
        'opacity1300'
      ]);
      expect(opacityTokenNames).toHaveLength(14);
    });

    test('should have all tokens in opacityTokens object', () => {
      expect(Object.keys(opacityTokens)).toEqual(opacityTokenNames);
      expect(Object.keys(opacityTokens)).toHaveLength(14);
    });
  });

  describe('Mathematical Relationships', () => {
    test('opacity100 should equal base value', () => {
      const opacity100 = getOpacityToken('opacity100');
      expect(opacity100?.baseValue).toBe(OPACITY_BASE_VALUE);
      expect(opacity100?.baseValue).toBe(0.08);
    });

    test('opacity600 should equal 6 × base value', () => {
      const opacity600 = getOpacityToken('opacity600');
      expect(opacity600?.baseValue).toBe(OPACITY_BASE_VALUE * 6);
      expect(opacity600?.baseValue).toBe(0.48);
    });

    test('should maintain 8% increment progression', () => {
      const opacity100 = getOpacityToken('opacity100');
      const opacity200 = getOpacityToken('opacity200');
      const opacity300 = getOpacityToken('opacity300');
      const opacity400 = getOpacityToken('opacity400');
      const opacity500 = getOpacityToken('opacity500');
      
      expect(opacity100?.baseValue).toBe(0.08);
      expect(opacity200?.baseValue).toBe(0.16);
      expect(opacity300?.baseValue).toBe(0.24);
      expect(opacity400?.baseValue).toBe(0.32);
      expect(opacity500?.baseValue).toBe(0.40);
    });

    test('should verify mathematical relationships for all tokens', () => {
      expect(getOpacityToken('opacity000')?.baseValue).toBe(0.0);
      expect(getOpacityToken('opacity100')?.baseValue).toBe(OPACITY_BASE_VALUE * 1);
      expect(getOpacityToken('opacity200')?.baseValue).toBe(OPACITY_BASE_VALUE * 2);
      expect(getOpacityToken('opacity300')?.baseValue).toBe(OPACITY_BASE_VALUE * 3);
      expect(getOpacityToken('opacity400')?.baseValue).toBe(OPACITY_BASE_VALUE * 4);
      expect(getOpacityToken('opacity500')?.baseValue).toBe(OPACITY_BASE_VALUE * 5);
      expect(getOpacityToken('opacity600')?.baseValue).toBe(OPACITY_BASE_VALUE * 6);
      expect(getOpacityToken('opacity700')?.baseValue).toBe(OPACITY_BASE_VALUE * 7);
      expect(getOpacityToken('opacity800')?.baseValue).toBe(OPACITY_BASE_VALUE * 8);
      expect(getOpacityToken('opacity900')?.baseValue).toBe(OPACITY_BASE_VALUE * 9);
      expect(getOpacityToken('opacity1000')?.baseValue).toBe(OPACITY_BASE_VALUE * 10);
      expect(getOpacityToken('opacity1100')?.baseValue).toBe(OPACITY_BASE_VALUE * 11);
      expect(getOpacityToken('opacity1200')?.baseValue).toBe(OPACITY_BASE_VALUE * 12);
      expect(getOpacityToken('opacity1300')?.baseValue).toBe(1.0);
    });

    test('should have correct mathematical relationship descriptions', () => {
      expect(getOpacityToken('opacity000')?.mathematicalRelationship).toBe('base × 0 = 0.08 × 0 = 0.0');
      expect(getOpacityToken('opacity100')?.mathematicalRelationship).toBe('base × 1 = 0.08 × 1 = 0.08');
      expect(getOpacityToken('opacity600')?.mathematicalRelationship).toBe('base × 6 = 0.08 × 6 = 0.48');
      expect(getOpacityToken('opacity1300')?.mathematicalRelationship).toBe('Special case: full opacity = 1.0');
    });

    test('should have correct familyBaseValue for all tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.familyBaseValue).toBe(OPACITY_BASE_VALUE);
        expect(token.familyBaseValue).toBe(0.08);
      });
    });
  });

  describe('Platform Values', () => {
    test('all tokens should have unitless platform values', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });

    test('should have correct platform values for opacity100', () => {
      const token = getOpacityToken('opacity100');
      
      expect(token?.platforms.web).toEqual({ value: 0.08, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.08, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.08, unit: 'unitless' });
    });

    test('should have correct platform values for opacity600', () => {
      const token = getOpacityToken('opacity600');
      
      expect(token?.platforms.web).toEqual({ value: 0.48, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.48, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.48, unit: 'unitless' });
    });

    test('should have correct platform values for opacity000', () => {
      const token = getOpacityToken('opacity000');
      
      expect(token?.platforms.web).toEqual({ value: 0.0, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.0, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.0, unit: 'unitless' });
    });

    test('should have correct platform values for opacity1300', () => {
      const token = getOpacityToken('opacity1300');
      
      expect(token?.platforms.web).toEqual({ value: 1.0, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 1.0, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 1.0, unit: 'unitless' });
    });

    test('should maintain mathematical relationships in platform values', () => {
      const opacity100 = getOpacityToken('opacity100');
      const opacity200 = getOpacityToken('opacity200');
      const opacity600 = getOpacityToken('opacity600');
      
      // Web platform
      expect(opacity200?.platforms.web.value).toBe((opacity100!.platforms.web.value as number) * 2);
      expect(opacity600?.platforms.web.value).toBe((opacity100!.platforms.web.value as number) * 6);
      
      // iOS platform
      expect(opacity200?.platforms.ios.value).toBe((opacity100!.platforms.ios.value as number) * 2);
      expect(opacity600?.platforms.ios.value).toBe((opacity100!.platforms.ios.value as number) * 6);
      
      // Android platform
      expect(opacity200?.platforms.android.value).toBe((opacity100!.platforms.android.value as number) * 2);
      expect(opacity600?.platforms.android.value).toBe((opacity100!.platforms.android.value as number) * 6);
    });

    test('should have same values across all platforms', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.value).toBe(token.platforms.ios.value);
        expect(token.platforms.ios.value).toBe(token.platforms.android.value);
      });
    });
  });

  describe('Helper Functions', () => {
    test('getOpacityToken should retrieve tokens by name', () => {
      const opacity100 = getOpacityToken('opacity100');
      const opacity600 = getOpacityToken('opacity600');
      const opacity1300 = getOpacityToken('opacity1300');
      
      expect(opacity100).toBeDefined();
      expect(opacity100?.name).toBe('opacity100');
      
      expect(opacity600).toBeDefined();
      expect(opacity600?.name).toBe('opacity600');
      
      expect(opacity1300).toBeDefined();
      expect(opacity1300?.name).toBe('opacity1300');
    });

    test('getOpacityToken should return undefined for invalid names', () => {
      const invalidToken = getOpacityToken('opacity150');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllOpacityTokens should return all tokens as array', () => {
      const allTokens = getAllOpacityTokens();
      
      expect(allTokens).toHaveLength(14);
      expect(allTokens.every(token => token.category === TokenCategory.OPACITY)).toBe(true);
      
      const tokenNames = allTokens.map(token => token.name);
      expect(tokenNames).toEqual(opacityTokenNames);
    });

    test('opacityTokenNames should match exported tokens', () => {
      const exportedNames = Object.keys(opacityTokens);
      expect(opacityTokenNames).toEqual(exportedNames);
    });
  });

  describe('Token Properties', () => {
    test('baselineGridAlignment should be false for all tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.baselineGridAlignment).toBe(false);
      });
    });

    test('isStrategicFlexibility should be false for all tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.isStrategicFlexibility).toBe(false);
      });
    });

    test('isPrecisionTargeted should be false for all tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.isPrecisionTargeted).toBe(false);
      });
    });

    test('should have descriptive descriptions', () => {
      const opacity000 = getOpacityToken('opacity000');
      const opacity100 = getOpacityToken('opacity100');
      const opacity600 = getOpacityToken('opacity600');
      const opacity1300 = getOpacityToken('opacity1300');
      
      expect(opacity000?.description).toContain('Fully transparent');
      expect(opacity100?.description).toContain('Subtle transparency');
      expect(opacity600?.description).toContain('Disabled state');
      expect(opacity1300?.description).toContain('Fully opaque');
    });

    test('should have correct category for all tokens', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.OPACITY);
      });
    });
  });

  describe('Token Integration', () => {
    test('should integrate with token registry patterns', () => {
      // Test opacityTokens object structure
      expect(typeof opacityTokens).toBe('object');
      expect(Object.keys(opacityTokens)).toHaveLength(14);
      
      // Test opacityTokenNames array
      expect(Array.isArray(opacityTokenNames)).toBe(true);
      expect(opacityTokenNames).toHaveLength(14);
      
      // Test helper functions exist
      expect(typeof getOpacityToken).toBe('function');
      expect(typeof getAllOpacityTokens).toBe('function');
    });

    test('should have consistent token structure across all tokens', () => {
      const allTokens = getAllOpacityTokens();
      const firstToken = allTokens[0];
      const tokenKeys = Object.keys(firstToken).sort();
      
      allTokens.forEach(token => {
        const currentKeys = Object.keys(token).sort();
        expect(currentKeys).toEqual(tokenKeys);
      });
    });

    test('should support iteration over all tokens', () => {
      let count = 0;
      
      opacityTokenNames.forEach(name => {
        const token = getOpacityToken(name);
        expect(token).toBeDefined();
        expect(token?.name).toBe(name);
        count++;
      });
      
      expect(count).toBe(14);
    });
  });

  describe('Value Range Validation', () => {
    test('all opacity values should be between 0.0 and 1.0', () => {
      const allTokens = getAllOpacityTokens();
      
      allTokens.forEach(token => {
        expect(token.baseValue).toBeGreaterThanOrEqual(0.0);
        expect(token.baseValue).toBeLessThanOrEqual(1.0);
      });
    });

    test('opacity000 should be 0.0 (fully transparent)', () => {
      const token = getOpacityToken('opacity000');
      expect(token?.baseValue).toBe(0.0);
    });

    test('opacity1300 should be 1.0 (fully opaque)', () => {
      const token = getOpacityToken('opacity1300');
      expect(token?.baseValue).toBe(1.0);
    });

    test('intermediate tokens should be between 0.0 and 1.0', () => {
      const intermediateTokens = [
        'opacity100', 'opacity200', 'opacity300', 'opacity400',
        'opacity500', 'opacity600', 'opacity700', 'opacity800',
        'opacity900', 'opacity1000', 'opacity1100', 'opacity1200'
      ];
      
      intermediateTokens.forEach(name => {
        const token = getOpacityToken(name);
        expect(token?.baseValue).toBeGreaterThan(0.0);
        expect(token?.baseValue).toBeLessThan(1.0);
      });
    });
  });
});
