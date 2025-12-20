/**
 * @category evergreen
 * @purpose Verify Opacity tokens are correctly defined and structured
 */
/**
 * Semantic Opacity Tokens Unit Tests
 * 
 * Tests for semantic opacity token structure and primitive references.
 * Validates that semantic tokens correctly reference primitive opacity tokens.
 */

import {
  opacityTokens,
  opacityTokenNames,
  getOpacityToken,
  getAllOpacityTokens,
  validateOpacityTokenCount
} from '../OpacityTokens';
import { opacityTokens as primitiveOpacityTokens } from '../../OpacityTokens';

describe('Semantic Opacity Tokens', () => {
  describe('Token Structure', () => {
    test('should have all required properties', () => {
      Object.values(opacityTokens).forEach(token => {
        expect(token).toHaveProperty('name');
        expect(token).toHaveProperty('primitiveReferences');
        expect(token).toHaveProperty('category');
        expect(token).toHaveProperty('context');
        expect(token).toHaveProperty('description');
      });
    });

    test('should have primitiveReferences with value property', () => {
      Object.values(opacityTokens).forEach(token => {
        expect(token.primitiveReferences).toHaveProperty('value');
        expect(typeof token.primitiveReferences.value).toBe('string');
      });
    });

    test('should have exactly 4 semantic opacity tokens', () => {
      expect(Object.keys(opacityTokens)).toHaveLength(4);
      expect(opacityTokenNames).toHaveLength(4);
    });
  });

  describe('Primitive References', () => {
    test('opacity.subtle should reference opacity1100', () => {
      const token = opacityTokens['opacity.subtle'];
      expect(token.primitiveReferences.value).toBe('opacity1100');
    });

    test('opacity.medium should reference opacity900', () => {
      const token = opacityTokens['opacity.medium'];
      expect(token.primitiveReferences.value).toBe('opacity900');
    });

    test('opacity.heavy should reference opacity600', () => {
      const token = opacityTokens['opacity.heavy'];
      expect(token.primitiveReferences.value).toBe('opacity600');
    });

    test('opacity.ghost should reference opacity400', () => {
      const token = opacityTokens['opacity.ghost'];
      expect(token.primitiveReferences.value).toBe('opacity400');
    });

    test('all semantic tokens should reference valid primitive token names', () => {
      const validPrimitiveNames = Object.keys(primitiveOpacityTokens);
      
      Object.values(opacityTokens).forEach(token => {
        expect(validPrimitiveNames).toContain(token.primitiveReferences.value);
      });
    });
  });

  describe('Token Resolution', () => {
    test('opacity.subtle should resolve to opacity1100 (0.88)', () => {
      const semanticToken = opacityTokens['opacity.subtle'];
      const primitiveTokenName = semanticToken.primitiveReferences.value;
      const primitiveToken = primitiveOpacityTokens[primitiveTokenName];
      
      expect(primitiveToken.baseValue).toBe(0.88);
    });

    test('all semantic tokens should resolve to valid primitive values', () => {
      Object.values(opacityTokens).forEach(semanticToken => {
        const primitiveTokenName = semanticToken.primitiveReferences.value;
        const primitiveToken = primitiveOpacityTokens[primitiveTokenName];
        
        expect(primitiveToken).toBeDefined();
        expect(primitiveToken.baseValue).toBeGreaterThanOrEqual(0.0);
        expect(primitiveToken.baseValue).toBeLessThanOrEqual(1.0);
      });
    });

    test('semantic token references should be valid', () => {
      const expectedReferences = {
        'opacity.subtle': 'opacity1100',
        'opacity.medium': 'opacity900',
        'opacity.heavy': 'opacity600',
        'opacity.ghost': 'opacity400'
      };

      Object.entries(expectedReferences).forEach(([semanticName, primitiveName]) => {
        const semanticToken = opacityTokens[semanticName];
        expect(semanticToken.primitiveReferences.value).toBe(primitiveName);
        
        // Verify the primitive token exists
        const primitiveToken = primitiveOpacityTokens[primitiveName];
        expect(primitiveToken).toBeDefined();
      });
    });
  });

  describe('Helper Functions', () => {
    test('getOpacityToken should return token by name', () => {
      const token = getOpacityToken('opacity.subtle');
      expect(token).toBeDefined();
      expect(token?.name).toBe('opacity.subtle');
      expect(token?.primitiveReferences.value).toBe('opacity1100');
    });

    test('getOpacityToken should return undefined for invalid name', () => {
      const token = getOpacityToken('opacity.invalid');
      expect(token).toBeUndefined();
    });

    test('getAllOpacityTokens should return all tokens as array', () => {
      const tokens = getAllOpacityTokens();
      expect(tokens).toHaveLength(4);
      expect(Array.isArray(tokens)).toBe(true);
    });

    test('validateOpacityTokenCount should return true for correct count', () => {
      const isValid = validateOpacityTokenCount();
      expect(isValid).toBe(true);
    });
  });

  describe('Token Names', () => {
    test('should have expected token names', () => {
      const expectedNames = [
        'opacity.subtle',
        'opacity.medium',
        'opacity.heavy',
        'opacity.ghost'
      ];

      expectedNames.forEach(name => {
        expect(opacityTokenNames).toContain(name);
      });
    });

    test('opacityTokenNames should match object keys', () => {
      const objectKeys = Object.keys(opacityTokens);
      expect(opacityTokenNames).toEqual(objectKeys);
    });
  });

  describe('Semantic Categories', () => {
    test('all opacity tokens should be in INTERACTION category', () => {
      Object.values(opacityTokens).forEach(token => {
        expect(token.category).toBe('interaction');
      });
    });
  });

  describe('Context and Description', () => {
    test('all tokens should have non-empty context', () => {
      Object.values(opacityTokens).forEach(token => {
        expect(token.context).toBeTruthy();
        expect(token.context.length).toBeGreaterThan(0);
      });
    });

    test('all tokens should have non-empty description', () => {
      Object.values(opacityTokens).forEach(token => {
        expect(token.description).toBeTruthy();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });
  });
});
