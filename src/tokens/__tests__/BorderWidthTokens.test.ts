/**
 * Border Width Tokens Unit Tests
 * 
 * Tests for border width token structure, mathematical relationships, and cross-platform consistency.
 * Covers primitive token object structure, helper functions, and platform value generation.
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  borderWidthTokens,
  borderWidthTokenNames,
  getBorderWidthToken,
  getAllBorderWidthTokens,
  BORDER_WIDTH_BASE_VALUE
} from '../BorderWidthTokens';

describe('Border Width Tokens', () => {
  describe('PrimitiveToken Object Structure', () => {
    test('should have correct structure for all border width tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
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
        expect(token.category).toBe(TokenCategory.BORDER_WIDTH);
        
        // Validate platform structure
        expect(token.platforms).toHaveProperty('web');
        expect(token.platforms).toHaveProperty('ios');
        expect(token.platforms).toHaveProperty('android');
      });
    });

    test('should have correct token names', () => {
      expect(borderWidthTokenNames).toEqual(['borderWidth100', 'borderWidth200', 'borderWidth400']);
      expect(borderWidthTokenNames).toHaveLength(3);
    });

    test('should have all tokens in borderWidthTokens object', () => {
      expect(Object.keys(borderWidthTokens)).toEqual(borderWidthTokenNames);
      expect(Object.keys(borderWidthTokens)).toHaveLength(3);
    });
  });

  describe('Mathematical Relationships', () => {
    test('should have correct base value', () => {
      expect(BORDER_WIDTH_BASE_VALUE).toBe(1);
    });

    test('should maintain doubling progression', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      expect(borderWidth100?.baseValue).toBe(1);
      expect(borderWidth200?.baseValue).toBe(2);
      expect(borderWidth400?.baseValue).toBe(4);
    });

    test('should verify borderWidth200 = borderWidth100 × 2', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      
      expect(borderWidth200?.baseValue).toBe(borderWidth100!.baseValue * 2);
    });

    test('should verify borderWidth400 = borderWidth100 × 4', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      expect(borderWidth400?.baseValue).toBe(borderWidth100!.baseValue * 4);
    });

    test('should have correct mathematical relationship descriptions', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      expect(borderWidth100?.mathematicalRelationship).toBe('base × 1 = 1 × 1 = 1');
      expect(borderWidth200?.mathematicalRelationship).toBe('base × 2 = 1 × 2 = 2');
      expect(borderWidth400?.mathematicalRelationship).toBe('base × 4 = 1 × 4 = 4');
    });

    test('should have correct familyBaseValue for all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.familyBaseValue).toBe(BORDER_WIDTH_BASE_VALUE);
        expect(token.familyBaseValue).toBe(1);
      });
    });
  });

  describe('Helper Functions', () => {
    test('getBorderWidthToken should retrieve tokens by name', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      expect(borderWidth100).toBeDefined();
      expect(borderWidth100?.name).toBe('borderWidth100');
      
      expect(borderWidth200).toBeDefined();
      expect(borderWidth200?.name).toBe('borderWidth200');
      
      expect(borderWidth400).toBeDefined();
      expect(borderWidth400?.name).toBe('borderWidth400');
    });

    test('getBorderWidthToken should return undefined for invalid names', () => {
      const invalidToken = getBorderWidthToken('borderWidth300');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllBorderWidthTokens should return all tokens as array', () => {
      const allTokens = getAllBorderWidthTokens();
      
      expect(allTokens).toHaveLength(3);
      expect(allTokens.every(token => token.category === TokenCategory.BORDER_WIDTH)).toBe(true);
      
      const tokenNames = allTokens.map(token => token.name).sort();
      expect(tokenNames).toEqual(['borderWidth100', 'borderWidth200', 'borderWidth400']);
    });

    test('borderWidthTokenNames should match exported tokens', () => {
      const exportedNames = Object.keys(borderWidthTokens);
      expect(borderWidthTokenNames).toEqual(exportedNames);
    });
  });

  describe('Platform Values', () => {
    test('should have correct platform values for borderWidth100', () => {
      const token = getBorderWidthToken('borderWidth100');
      
      expect(token?.platforms.web).toEqual({ value: 1, unit: 'px' });
      expect(token?.platforms.ios).toEqual({ value: 1, unit: 'pt' });
      expect(token?.platforms.android).toEqual({ value: 1, unit: 'dp' });
    });

    test('should have correct platform values for borderWidth200', () => {
      const token = getBorderWidthToken('borderWidth200');
      
      expect(token?.platforms.web).toEqual({ value: 2, unit: 'px' });
      expect(token?.platforms.ios).toEqual({ value: 2, unit: 'pt' });
      expect(token?.platforms.android).toEqual({ value: 2, unit: 'dp' });
    });

    test('should have correct platform values for borderWidth400', () => {
      const token = getBorderWidthToken('borderWidth400');
      
      expect(token?.platforms.web).toEqual({ value: 4, unit: 'px' });
      expect(token?.platforms.ios).toEqual({ value: 4, unit: 'pt' });
      expect(token?.platforms.android).toEqual({ value: 4, unit: 'dp' });
    });

    test('should have consistent platform units across all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('px');
        expect(token.platforms.ios.unit).toBe('pt');
        expect(token.platforms.android.unit).toBe('dp');
      });
    });

    test('should maintain mathematical relationships in platform values', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      // Web platform
      expect(borderWidth200?.platforms.web.value).toBe((borderWidth100!.platforms.web.value as number) * 2);
      expect(borderWidth400?.platforms.web.value).toBe((borderWidth100!.platforms.web.value as number) * 4);
      
      // iOS platform
      expect(borderWidth200?.platforms.ios.value).toBe((borderWidth100!.platforms.ios.value as number) * 2);
      expect(borderWidth400?.platforms.ios.value).toBe((borderWidth100!.platforms.ios.value as number) * 4);
      
      // Android platform
      expect(borderWidth200?.platforms.android.value).toBe((borderWidth100!.platforms.android.value as number) * 2);
      expect(borderWidth400?.platforms.android.value).toBe((borderWidth100!.platforms.android.value as number) * 4);
    });
  });

  describe('Token Properties', () => {
    test('baselineGridAlignment should be false for all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.baselineGridAlignment).toBe(false);
      });
    });

    test('isStrategicFlexibility should be false for all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.isStrategicFlexibility).toBe(false);
      });
    });

    test('isPrecisionTargeted should be false for all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.isPrecisionTargeted).toBe(false);
      });
    });

    test('should have descriptive descriptions', () => {
      const borderWidth100 = getBorderWidthToken('borderWidth100');
      const borderWidth200 = getBorderWidthToken('borderWidth200');
      const borderWidth400 = getBorderWidthToken('borderWidth400');
      
      expect(borderWidth100?.description).toContain('Base border width');
      expect(borderWidth100?.description).toContain('standard borders');
      
      expect(borderWidth200?.description).toContain('Emphasized border width');
      expect(borderWidth200?.description).toContain('emphasized borders');
      
      expect(borderWidth400?.description).toContain('Heavy border width');
      expect(borderWidth400?.description).toContain('heavy emphasis');
    });

    test('should have correct category for all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.BORDER_WIDTH);
      });
    });
  });

  describe('Token Integration', () => {
    test('should integrate with token registry patterns', () => {
      // Test borderWidthTokens object structure
      expect(typeof borderWidthTokens).toBe('object');
      expect(Object.keys(borderWidthTokens)).toHaveLength(3);
      
      // Test borderWidthTokenNames array
      expect(Array.isArray(borderWidthTokenNames)).toBe(true);
      expect(borderWidthTokenNames).toHaveLength(3);
      
      // Test helper functions exist
      expect(typeof getBorderWidthToken).toBe('function');
      expect(typeof getAllBorderWidthTokens).toBe('function');
    });

    test('should have consistent token structure across all tokens', () => {
      const allTokens = getAllBorderWidthTokens();
      const firstToken = allTokens[0];
      const tokenKeys = Object.keys(firstToken).sort();
      
      allTokens.forEach(token => {
        const currentKeys = Object.keys(token).sort();
        expect(currentKeys).toEqual(tokenKeys);
      });
    });

    test('should support iteration over all tokens', () => {
      let count = 0;
      
      borderWidthTokenNames.forEach(name => {
        const token = getBorderWidthToken(name);
        expect(token).toBeDefined();
        expect(token?.name).toBe(name);
        count++;
      });
      
      expect(count).toBe(3);
    });
  });

  describe('Index File Integration', () => {
    // Import from index to test integration
    const {
      borderWidthTokens: indexBorderWidthTokens,
      borderWidthTokenNames: indexBorderWidthTokenNames,
      getBorderWidthToken: indexGetBorderWidthToken,
      getAllBorderWidthTokens: indexGetAllBorderWidthTokens,
      BORDER_WIDTH_BASE_VALUE: indexBORDER_WIDTH_BASE_VALUE,
      allTokens,
      getAllPrimitiveTokens,
      getTokensByCategory,
      getTokenByName,
      TOKEN_FAMILY_BASE_VALUES
    } = require('../index');

    test('should export border width tokens from index', () => {
      expect(indexBorderWidthTokens).toBeDefined();
      expect(indexBorderWidthTokens).toEqual(borderWidthTokens);
    });

    test('should export border width token names from index', () => {
      expect(indexBorderWidthTokenNames).toBeDefined();
      expect(indexBorderWidthTokenNames).toEqual(borderWidthTokenNames);
    });

    test('should export getBorderWidthToken from index', () => {
      expect(typeof indexGetBorderWidthToken).toBe('function');
      const token = indexGetBorderWidthToken('borderWidth100');
      expect(token).toBeDefined();
      expect(token?.name).toBe('borderWidth100');
    });

    test('should export getAllBorderWidthTokens from index', () => {
      expect(typeof indexGetAllBorderWidthTokens).toBe('function');
      const tokens = indexGetAllBorderWidthTokens();
      expect(tokens).toHaveLength(3);
    });

    test('should export BORDER_WIDTH_BASE_VALUE from index', () => {
      expect(indexBORDER_WIDTH_BASE_VALUE).toBe(1);
      expect(indexBORDER_WIDTH_BASE_VALUE).toBe(BORDER_WIDTH_BASE_VALUE);
    });

    test('should include border width tokens in allTokens object', () => {
      expect(allTokens[TokenCategory.BORDER_WIDTH]).toBeDefined();
      expect(allTokens[TokenCategory.BORDER_WIDTH]).toEqual(borderWidthTokens);
    });

    test('should include border width tokens in getAllPrimitiveTokens()', () => {
      const allTokensArray = getAllPrimitiveTokens();
      const borderWidthTokensInArray = allTokensArray.filter(
        (token: any) => token.category === TokenCategory.BORDER_WIDTH
      );
      
      expect(borderWidthTokensInArray).toHaveLength(3);
      expect(borderWidthTokensInArray.map((t: any) => t.name).sort()).toEqual([
        'borderWidth100',
        'borderWidth200',
        'borderWidth400'
      ]);
    });

    test('should return border width tokens from getTokensByCategory()', () => {
      const borderWidthTokensFromCategory = getTokensByCategory(TokenCategory.BORDER_WIDTH);
      
      expect(borderWidthTokensFromCategory).toHaveLength(3);
      expect(borderWidthTokensFromCategory.every((token: any) => token.category === TokenCategory.BORDER_WIDTH)).toBe(true);
      expect(borderWidthTokensFromCategory.map((t: any) => t.name).sort()).toEqual([
        'borderWidth100',
        'borderWidth200',
        'borderWidth400'
      ]);
    });

    test('should retrieve border width tokens by name from getTokenByName()', () => {
      const borderWidth100 = getTokenByName('borderWidth100');
      const borderWidth200 = getTokenByName('borderWidth200');
      const borderWidth400 = getTokenByName('borderWidth400');
      
      expect(borderWidth100).toBeDefined();
      expect(borderWidth100?.name).toBe('borderWidth100');
      expect(borderWidth100?.category).toBe(TokenCategory.BORDER_WIDTH);
      
      expect(borderWidth200).toBeDefined();
      expect(borderWidth200?.name).toBe('borderWidth200');
      
      expect(borderWidth400).toBeDefined();
      expect(borderWidth400?.name).toBe('borderWidth400');
    });

    test('should include BORDER_WIDTH in TOKEN_FAMILY_BASE_VALUES', () => {
      expect(TOKEN_FAMILY_BASE_VALUES[TokenCategory.BORDER_WIDTH]).toBe(1);
    });

    test('should maintain mathematical relationships through index exports', () => {
      const borderWidth100 = indexGetBorderWidthToken('borderWidth100');
      const borderWidth200 = indexGetBorderWidthToken('borderWidth200');
      const borderWidth400 = indexGetBorderWidthToken('borderWidth400');
      
      expect(borderWidth200?.baseValue).toBe(borderWidth100!.baseValue * 2);
      expect(borderWidth400?.baseValue).toBe(borderWidth100!.baseValue * 4);
    });
  });
});
