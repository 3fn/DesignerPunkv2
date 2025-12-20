/**
 * @category evergreen
 * @purpose Verify PrimitiveToken registry provides correct token lookup and management
 */
/**
 * PrimitiveTokenRegistry Unit Tests
 * 
 * Tests for primitive token registration, retrieval, validation, and category organization.
 * Covers baseline grid validation, strategic flexibility handling, and registry operations.
 */

import { PrimitiveTokenRegistry, TokenRegistrationOptions, TokenQueryOptions } from '../PrimitiveTokenRegistry';
import { PrimitiveToken, TokenCategory } from '../../types/PrimitiveToken';
import { ValidationResult } from '../../types/ValidationResult';

// Mock tokens for testing
const createMockToken = (overrides: Partial<PrimitiveToken> = {}): PrimitiveToken => ({
  name: 'test-token',
  category: TokenCategory.SPACING,
  baseValue: 8,
  familyBaseValue: 8,
  description: 'Test token',
  mathematicalRelationship: 'base × 1 = 8',
  baselineGridAlignment: true,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value: 8, unit: 'px' },
    ios: { value: 8, unit: 'pt' },
    android: { value: 8, unit: 'dp' }
  },
  ...overrides
});

const createSpacingToken = (name: string, value: number, isStrategicFlexibility = false): PrimitiveToken =>
  createMockToken({
    name,
    category: TokenCategory.SPACING,
    baseValue: value,
    baselineGridAlignment: value % 8 === 0,
    isStrategicFlexibility,
    platforms: {
      web: { value, unit: 'px' },
      ios: { value, unit: 'pt' },
      android: { value, unit: 'dp' }
    }
  });

const createFontSizeToken = (name: string, value: number): PrimitiveToken =>
  createMockToken({
    name,
    category: TokenCategory.FONT_SIZE,
    baseValue: value,
    familyBaseValue: 16,
    baselineGridAlignment: false, // fontSize doesn't require baseline grid alignment
    platforms: {
      web: { value: value / 16, unit: 'rem' },
      ios: { value, unit: 'pt' },
      android: { value, unit: 'sp' }
    }
  });

describe('PrimitiveTokenRegistry', () => {
  let registry: PrimitiveTokenRegistry;

  beforeEach(() => {
    registry = new PrimitiveTokenRegistry();
  });

  describe('Token Registration', () => {
    test('should register a valid token successfully', () => {
      const token = createSpacingToken('space100', 8);
      
      expect(() => registry.register(token)).not.toThrow();
      expect(registry.has('space100')).toBe(true);
    });

    test('should register strategic flexibility tokens without warnings', () => {
      const strategicToken = createSpacingToken('space075', 6, true);
      
      expect(() => registry.register(strategicToken)).not.toThrow();
      expect(registry.has('space075')).toBe(true);
    });

    test('should prevent duplicate token registration by default', () => {
      const token1 = createSpacingToken('space100', 8);
      const token2 = createSpacingToken('space100', 16);

      registry.register(token1);
      
      expect(() => registry.register(token2)).toThrow('already registered');
      expect(registry.get('space100')?.baseValue).toBe(8); // Original token preserved
    });

    test('should allow token overwrite when explicitly enabled', () => {
      const token1 = createSpacingToken('space100', 8);
      const token2 = createSpacingToken('space100', 16);
      const options: TokenRegistrationOptions = { allowOverwrite: true };

      registry.register(token1);
      
      expect(() => registry.register(token2, options)).not.toThrow();
      expect(registry.get('space100')?.baseValue).toBe(16); // Token was overwritten
    });

    test('should register tokens without validation (validation removed from registry)', () => {
      const token = createSpacingToken('space-any', 7); // Any value allowed now
      
      expect(() => registry.register(token)).not.toThrow();
      expect(registry.has('space-any')).toBe(true);
    });
  });

  describe('Token Retrieval', () => {
    beforeEach(() => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space200', 16));
      registry.register(createFontSizeToken('fontSize100', 16));
    });

    test('should retrieve existing tokens by name', () => {
      const token = registry.get('space100');

      expect(token).toBeDefined();
      expect(token?.name).toBe('space100');
      expect(token?.baseValue).toBe(8);
    });

    test('should return undefined for non-existent tokens', () => {
      const token = registry.get('non-existent');

      expect(token).toBeUndefined();
    });

    test('should check token existence correctly', () => {
      expect(registry.has('space100')).toBe(true);
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('Token Querying', () => {
    beforeEach(() => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space200', 16));
      registry.register(createSpacingToken('space075', 6, true)); // Strategic flexibility
      registry.register(createFontSizeToken('fontSize100', 16));
      registry.register(createFontSizeToken('fontSize125', 18));
    });

    test('should return all tokens when no filters applied', () => {
      const tokens = registry.query();

      expect(tokens).toHaveLength(5);
    });

    test('should filter tokens by category', () => {
      const spacingTokens = registry.query({ category: TokenCategory.SPACING });
      const fontSizeTokens = registry.query({ category: TokenCategory.FONT_SIZE });

      expect(spacingTokens).toHaveLength(3);
      expect(fontSizeTokens).toHaveLength(2);
      expect(spacingTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
    });

    test('should exclude strategic flexibility tokens when requested', () => {
      const nonStrategicTokens = registry.query({ includeStrategicFlexibility: false });

      expect(nonStrategicTokens).toHaveLength(4);
      expect(nonStrategicTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
    });

    test('should sort tokens by name', () => {
      const sortedTokens = registry.query({ sortBy: 'name' });

      expect(sortedTokens[0].name).toBe('fontSize100');
      expect(sortedTokens[1].name).toBe('fontSize125');
      expect(sortedTokens[2].name).toBe('space075');
    });

    test('should sort tokens by value', () => {
      const sortedTokens = registry.query({ sortBy: 'value' });

      expect(sortedTokens[0].baseValue).toBe(6); // space075
      expect(sortedTokens[1].baseValue).toBe(8); // space100
      expect(sortedTokens[4].baseValue).toBe(18); // fontSize125
    });

    test('should sort tokens by category', () => {
      const sortedTokens = registry.query({ sortBy: 'category' });

      // fontSize comes before spacing alphabetically
      expect(sortedTokens[0].category).toBe(TokenCategory.FONT_SIZE);
      expect(sortedTokens[1].category).toBe(TokenCategory.FONT_SIZE);
      expect(sortedTokens[2].category).toBe(TokenCategory.SPACING);
    });
  });

  describe('Category Organization', () => {
    beforeEach(() => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space200', 16));
      registry.register(createFontSizeToken('fontSize100', 16));
    });

    test('should organize tokens by category', () => {
      const spacingTokens = registry.getByCategory(TokenCategory.SPACING);
      const fontSizeTokens = registry.getByCategory(TokenCategory.FONT_SIZE);

      expect(spacingTokens).toHaveLength(2);
      expect(fontSizeTokens).toHaveLength(1);
      expect(spacingTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
    });

    test('should return empty array for categories with no tokens', () => {
      const radiusTokens = registry.getByCategory(TokenCategory.RADIUS);

      expect(radiusTokens).toHaveLength(0);
      expect(Array.isArray(radiusTokens)).toBe(true);
    });

    test('should maintain category organization after token removal', () => {
      registry.remove('space100');
      const spacingTokens = registry.getByCategory(TokenCategory.SPACING);

      expect(spacingTokens).toHaveLength(1);
      expect(spacingTokens[0].name).toBe('space200');
    });
  });

  describe('Storage-Only Behavior', () => {
    test('should store tokens without validation (validation moved to validators)', () => {
      const token1 = createSpacingToken('space200', 16);
      const token2 = createSpacingToken('space-any', 7); // Any value allowed

      expect(() => registry.register(token1)).not.toThrow();
      expect(() => registry.register(token2)).not.toThrow();
      expect(registry.has('space200')).toBe(true);
      expect(registry.has('space-any')).toBe(true);
    });

    test('should register all tokens regardless of baseline grid alignment', () => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space075', 6, true)); // Strategic flexibility
      registry.register(createFontSizeToken('fontSize100', 16));

      expect(registry.query()).toHaveLength(3);
    });
  });

  describe('Registry Statistics', () => {
    beforeEach(() => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space075', 6, true)); // Strategic flexibility
      registry.register(createFontSizeToken('fontSize100', 16));
    });

    test('should provide accurate registry statistics', () => {
      const stats = registry.getStats();

      expect(stats.totalTokens).toBe(3);
      expect(stats.strategicFlexibilityCount).toBe(1);
      expect(stats.strategicFlexibilityPercentage).toBeCloseTo(33.33, 2);
    });

    test('should provide category statistics', () => {
      const stats = registry.getStats();

      expect(stats.categoryStats[TokenCategory.SPACING]).toBe(2);
      expect(stats.categoryStats[TokenCategory.FONT_SIZE]).toBe(1);
      expect(stats.categoryStats[TokenCategory.RADIUS]).toBe(0);
    });

    test('should not include validation information (validation removed from registry)', () => {
      const stats = registry.getStats();

      expect((stats as any).validationInfo).toBeUndefined();
    });
  });

  describe('Token Removal and Cleanup', () => {
    beforeEach(() => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createFontSizeToken('fontSize100', 16));
    });

    test('should remove existing tokens successfully', () => {
      const removed = registry.remove('space100');

      expect(removed).toBe(true);
      expect(registry.has('space100')).toBe(false);
      expect(registry.getByCategory(TokenCategory.SPACING)).toHaveLength(0);
    });

    test('should return false when removing non-existent tokens', () => {
      const removed = registry.remove('non-existent');

      expect(removed).toBe(false);
    });

    test('should clear all tokens and reset categories', () => {
      expect(registry.query()).toHaveLength(2);

      registry.clear();

      expect(registry.query()).toHaveLength(0);
      expect(registry.getByCategory(TokenCategory.SPACING)).toHaveLength(0);
      expect(registry.getByCategory(TokenCategory.FONT_SIZE)).toHaveLength(0);
    });

    test('should maintain category structure after clearing', () => {
      registry.clear();
      registry.register(createSpacingToken('space100', 8));

      const spacingTokens = registry.getByCategory(TokenCategory.SPACING);
      expect(spacingTokens).toHaveLength(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty registry operations gracefully', () => {
      expect(registry.query()).toHaveLength(0);
      expect(registry.getStats().totalTokens).toBe(0);
    });

    test('should register any token value (validation moved to validators)', () => {
      const token1 = createSpacingToken('space-any-1', 7);
      const token2 = createSpacingToken('space-any-2', 13);
      
      expect(() => registry.register(token1)).not.toThrow();
      expect(() => registry.register(token2)).not.toThrow();
      expect(registry.has('space-any-1')).toBe(true);
      expect(registry.has('space-any-2')).toBe(true);
    });

    test('should handle strategic flexibility tokens as regular tokens', () => {
      const strategicToken = createSpacingToken('space075', 6, true);
      
      expect(() => registry.register(strategicToken)).not.toThrow();
      expect(registry.has('space075')).toBe(true);
    });
  });
});