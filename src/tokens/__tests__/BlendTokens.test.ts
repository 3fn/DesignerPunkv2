/**
 * Blend Tokens Unit Tests
 * 
 * Tests for blend token structure, mathematical relationships, and cross-platform consistency.
 * Covers primitive token object structure, helper functions, and platform value generation.
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  blendTokens,
  blendTokenNames,
  getBlendToken,
  getAllBlendTokens,
  BLEND_BASE_VALUE,
  BlendDirection
} from '../BlendTokens';

describe('Blend Tokens', () => {
  describe('Base Value', () => {
    test('BLEND_BASE_VALUE should equal 0.04', () => {
      expect(BLEND_BASE_VALUE).toBe(0.04);
    });
  });

  describe('PrimitiveToken Object Structure', () => {
    test('should have correct structure for all blend tokens', () => {
      const allTokens = getAllBlendTokens();
      
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
        expect(token.category).toBe(TokenCategory.BLEND);
        
        // Validate platform structure
        expect(token.platforms).toHaveProperty('web');
        expect(token.platforms).toHaveProperty('ios');
        expect(token.platforms).toHaveProperty('android');
      });
    });

    test('should have correct token names', () => {
      expect(blendTokenNames).toEqual([
        'blend100',
        'blend200',
        'blend300',
        'blend400',
        'blend500'
      ]);
      expect(blendTokenNames).toHaveLength(5);
    });

    test('should have all tokens in blendTokens object', () => {
      expect(Object.keys(blendTokens)).toEqual(blendTokenNames);
      expect(Object.keys(blendTokens)).toHaveLength(5);
    });
  });

  describe('Mathematical Relationships', () => {
    test('blend100 should equal base value', () => {
      const blend100 = getBlendToken('blend100');
      expect(blend100?.baseValue).toBe(BLEND_BASE_VALUE);
      expect(blend100?.baseValue).toBe(0.04);
    });

    test('blend200 should equal 2 × base value', () => {
      const blend200 = getBlendToken('blend200');
      expect(blend200?.baseValue).toBe(BLEND_BASE_VALUE * 2);
      expect(blend200?.baseValue).toBe(0.08);
    });

    test('should maintain 4% increment progression', () => {
      const blend100 = getBlendToken('blend100');
      const blend200 = getBlendToken('blend200');
      const blend300 = getBlendToken('blend300');
      const blend400 = getBlendToken('blend400');
      const blend500 = getBlendToken('blend500');
      
      expect(blend100?.baseValue).toBe(0.04);
      expect(blend200?.baseValue).toBe(0.08);
      expect(blend300?.baseValue).toBe(0.12);
      expect(blend400?.baseValue).toBe(0.16);
      expect(blend500?.baseValue).toBe(0.20);
    });

    test('should verify mathematical relationships for all tokens', () => {
      expect(getBlendToken('blend100')?.baseValue).toBe(BLEND_BASE_VALUE * 1);
      expect(getBlendToken('blend200')?.baseValue).toBe(BLEND_BASE_VALUE * 2);
      expect(getBlendToken('blend300')?.baseValue).toBe(BLEND_BASE_VALUE * 3);
      expect(getBlendToken('blend400')?.baseValue).toBe(BLEND_BASE_VALUE * 4);
      expect(getBlendToken('blend500')?.baseValue).toBe(BLEND_BASE_VALUE * 5);
    });

    test('should have correct mathematical relationship descriptions', () => {
      expect(getBlendToken('blend100')?.mathematicalRelationship).toBe('base × 1 = 0.04 × 1 = 0.04');
      expect(getBlendToken('blend200')?.mathematicalRelationship).toBe('base × 2 = 0.04 × 2 = 0.08');
      expect(getBlendToken('blend300')?.mathematicalRelationship).toBe('base × 3 = 0.04 × 3 = 0.12');
      expect(getBlendToken('blend400')?.mathematicalRelationship).toBe('base × 4 = 0.04 × 4 = 0.16');
      expect(getBlendToken('blend500')?.mathematicalRelationship).toBe('base × 5 = 0.04 × 5 = 0.20');
    });

    test('should have correct familyBaseValue for all tokens', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.familyBaseValue).toBe(BLEND_BASE_VALUE);
        expect(token.familyBaseValue).toBe(0.04);
      });
    });
  });

  describe('Platform Values', () => {
    test('all tokens should have unitless platform values', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });

    test('should have correct platform values for blend100', () => {
      const token = getBlendToken('blend100');
      
      expect(token?.platforms.web).toEqual({ value: 0.04, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.04, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.04, unit: 'unitless' });
    });

    test('should have correct platform values for blend300', () => {
      const token = getBlendToken('blend300');
      
      expect(token?.platforms.web).toEqual({ value: 0.12, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.12, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.12, unit: 'unitless' });
    });

    test('should have correct platform values for blend500', () => {
      const token = getBlendToken('blend500');
      
      expect(token?.platforms.web).toEqual({ value: 0.20, unit: 'unitless' });
      expect(token?.platforms.ios).toEqual({ value: 0.20, unit: 'unitless' });
      expect(token?.platforms.android).toEqual({ value: 0.20, unit: 'unitless' });
    });

    test('should maintain mathematical relationships in platform values', () => {
      const blend100 = getBlendToken('blend100');
      const blend200 = getBlendToken('blend200');
      const blend500 = getBlendToken('blend500');
      
      // Web platform
      expect(blend200?.platforms.web.value).toBe((blend100!.platforms.web.value as number) * 2);
      expect(blend500?.platforms.web.value).toBe((blend100!.platforms.web.value as number) * 5);
      
      // iOS platform
      expect(blend200?.platforms.ios.value).toBe((blend100!.platforms.ios.value as number) * 2);
      expect(blend500?.platforms.ios.value).toBe((blend100!.platforms.ios.value as number) * 5);
      
      // Android platform
      expect(blend200?.platforms.android.value).toBe((blend100!.platforms.android.value as number) * 2);
      expect(blend500?.platforms.android.value).toBe((blend100!.platforms.android.value as number) * 5);
    });

    test('should have same values across all platforms', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.value).toBe(token.platforms.ios.value);
        expect(token.platforms.ios.value).toBe(token.platforms.android.value);
      });
    });
  });

  describe('Helper Functions', () => {
    test('getBlendToken should retrieve tokens by name', () => {
      const blend100 = getBlendToken('blend100');
      const blend300 = getBlendToken('blend300');
      const blend500 = getBlendToken('blend500');
      
      expect(blend100).toBeDefined();
      expect(blend100?.name).toBe('blend100');
      
      expect(blend300).toBeDefined();
      expect(blend300?.name).toBe('blend300');
      
      expect(blend500).toBeDefined();
      expect(blend500?.name).toBe('blend500');
    });

    test('getBlendToken should return undefined for invalid names', () => {
      const invalidToken = getBlendToken('blend150');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllBlendTokens should return all tokens as array', () => {
      const allTokens = getAllBlendTokens();
      
      expect(allTokens).toHaveLength(5);
      expect(allTokens.every(token => token.category === TokenCategory.BLEND)).toBe(true);
      
      const tokenNames = allTokens.map(token => token.name);
      expect(tokenNames).toEqual(blendTokenNames);
    });

    test('blendTokenNames should match exported tokens', () => {
      const exportedNames = Object.keys(blendTokens);
      expect(blendTokenNames).toEqual(exportedNames);
    });
  });

  describe('Token Properties', () => {
    test('baselineGridAlignment should be false for all tokens', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.baselineGridAlignment).toBe(false);
      });
    });

    test('isStrategicFlexibility should be false for all tokens', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.isStrategicFlexibility).toBe(false);
      });
    });

    test('isPrecisionTargeted should be false for all tokens', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.isPrecisionTargeted).toBe(false);
      });
    });

    test('should have descriptive descriptions', () => {
      const blend100 = getBlendToken('blend100');
      const blend200 = getBlendToken('blend200');
      const blend300 = getBlendToken('blend300');
      const blend500 = getBlendToken('blend500');
      
      expect(blend100?.description).toContain('Subtle modification');
      expect(blend200?.description).toContain('Standard modification');
      expect(blend300?.description).toContain('Strong modification');
      expect(blend500?.description).toContain('Maximum modification');
    });

    test('should have correct category for all tokens', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.BLEND);
      });
    });
  });

  describe('BlendDirection Enum', () => {
    test('should have all blend direction values', () => {
      expect(BlendDirection.DARKER).toBe('darker');
      expect(BlendDirection.LIGHTER).toBe('lighter');
      expect(BlendDirection.SATURATE).toBe('saturate');
      expect(BlendDirection.DESATURATE).toBe('desaturate');
    });

    test('should have exactly 4 blend directions', () => {
      const directions = Object.values(BlendDirection);
      expect(directions).toHaveLength(4);
      expect(directions).toEqual(['darker', 'lighter', 'saturate', 'desaturate']);
    });
  });

  describe('Token Integration', () => {
    test('should integrate with token registry patterns', () => {
      // Test blendTokens object structure
      expect(typeof blendTokens).toBe('object');
      expect(Object.keys(blendTokens)).toHaveLength(5);
      
      // Test blendTokenNames array
      expect(Array.isArray(blendTokenNames)).toBe(true);
      expect(blendTokenNames).toHaveLength(5);
      
      // Test helper functions exist
      expect(typeof getBlendToken).toBe('function');
      expect(typeof getAllBlendTokens).toBe('function');
    });

    test('should have consistent token structure across all tokens', () => {
      const allTokens = getAllBlendTokens();
      const firstToken = allTokens[0];
      const tokenKeys = Object.keys(firstToken).sort();
      
      allTokens.forEach(token => {
        const currentKeys = Object.keys(token).sort();
        expect(currentKeys).toEqual(tokenKeys);
      });
    });

    test('should support iteration over all tokens', () => {
      let count = 0;
      
      blendTokenNames.forEach(name => {
        const token = getBlendToken(name);
        expect(token).toBeDefined();
        expect(token?.name).toBe(name);
        count++;
      });
      
      expect(count).toBe(5);
    });
  });

  describe('Value Range Validation', () => {
    test('all blend values should be between 0.04 and 0.20', () => {
      const allTokens = getAllBlendTokens();
      
      allTokens.forEach(token => {
        expect(token.baseValue).toBeGreaterThanOrEqual(0.04);
        expect(token.baseValue).toBeLessThanOrEqual(0.20);
      });
    });

    test('blend100 should be 0.04 (minimum blend)', () => {
      const token = getBlendToken('blend100');
      expect(token?.baseValue).toBe(0.04);
    });

    test('blend500 should be 0.20 (maximum blend)', () => {
      const token = getBlendToken('blend500');
      expect(token?.baseValue).toBe(0.20);
    });

    test('intermediate tokens should be between 0.04 and 0.20', () => {
      const intermediateTokens = ['blend200', 'blend300', 'blend400'];
      
      intermediateTokens.forEach(name => {
        const token = getBlendToken(name);
        expect(token?.baseValue).toBeGreaterThan(0.04);
        expect(token?.baseValue).toBeLessThan(0.20);
      });
    });
  });
});
