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
      const result = registry.register(token);

      expect(result.level).toBe('Pass');
      expect(result.token).toBe('space100');
      expect(result.message).toBe('Token registered successfully');
      expect(registry.has('space100')).toBe(true);
    });

    test('should register strategic flexibility tokens without warnings', () => {
      const strategicToken = createSpacingToken('space075', 6, true);
      const result = registry.register(strategicToken);

      expect(result.level).toBe('Pass');
      expect(result.token).toBe('space075');
      expect(registry.has('space075')).toBe(true);
    });

    test('should prevent duplicate token registration by default', () => {
      const token1 = createSpacingToken('space100', 8);
      const token2 = createSpacingToken('space100', 16);

      registry.register(token1);
      const result = registry.register(token2);

      expect(result.level).toBe('Error');
      expect(result.message).toBe('Token already exists');
      expect(result.rationale).toContain('already registered');
      expect(registry.get('space100')?.baseValue).toBe(8); // Original token preserved
    });

    test('should allow token overwrite when explicitly enabled', () => {
      const token1 = createSpacingToken('space100', 8);
      const token2 = createSpacingToken('space100', 16);
      const options: TokenRegistrationOptions = { allowOverwrite: true };

      registry.register(token1);
      const result = registry.register(token2, options);

      expect(result.level).toBe('Pass');
      expect(registry.get('space100')?.baseValue).toBe(16); // Token was overwritten
    });

    test('should skip validation when requested', () => {
      const invalidToken = createSpacingToken('invalid-token', 7); // Not baseline grid aligned
      const options: TokenRegistrationOptions = { skipValidation: true };

      const result = registry.register(invalidToken, options);

      expect(result.level).toBe('Pass');
      expect(result.message).toBe('Token registered successfully');
      expect(result.rationale).toContain('Pass validation');
    });

    test('should reject tokens that fail baseline grid validation', () => {
      const invalidToken = createSpacingToken('space-invalid', 7); // Not baseline grid aligned
      const result = registry.register(invalidToken);

      expect(result.level).toBe('Error');
      expect(result.message).toBe('Baseline grid alignment violation');
      expect(result.suggestions).toBeDefined();
      expect(registry.has('space-invalid')).toBe(false);
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

  describe('Token Validation', () => {
    test('should validate spacing tokens against baseline grid', () => {
      const validToken = createSpacingToken('space200', 16);
      const invalidToken = createSpacingToken('space-invalid', 7);

      const validResult = registry.validateToken(validToken);
      const invalidResult = registry.validateToken(invalidToken);

      expect(validResult.level).toBe('Pass');
      expect(invalidResult.level).toBe('Error');
      expect(invalidResult.suggestions).toBeDefined();
    });

    test('should validate radius tokens against baseline grid', () => {
      const validRadiusToken = createMockToken({
        name: 'radius200',
        category: TokenCategory.RADIUS,
        baseValue: 16,
        baselineGridAlignment: true
      });

      const result = registry.validateToken(validRadiusToken);

      expect(result.level).toBe('Pass');
    });

    test('should pass validation for non-baseline-grid categories', () => {
      const fontSizeToken = createFontSizeToken('fontSize125', 18);
      const result = registry.validateToken(fontSizeToken);

      expect(result.level).toBe('Pass');
      expect(result.rationale).toContain('uses its own mathematical foundation');
    });

    test('should validate all registered tokens', () => {
      registry.register(createSpacingToken('space100', 8));
      registry.register(createSpacingToken('space075', 6, true)); // Strategic flexibility
      registry.register(createFontSizeToken('fontSize100', 16));

      const results = registry.validateAll();

      expect(results).toHaveLength(3);
      expect(results.every(result => result.level === 'Pass')).toBe(true);
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

    test('should include validation information', () => {
      const stats = registry.getStats();

      expect(stats.validationInfo).toBeDefined();
      expect(stats.validationInfo.gridUnit).toBe(8);
      expect(stats.validationInfo.allowStrategicFlexibility).toBe(true);
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
      expect(registry.validateAll()).toHaveLength(0);
      expect(registry.getStats().totalTokens).toBe(0);
    });

    test('should provide clear error messages for validation failures', () => {
      const invalidToken = createSpacingToken('space-invalid', 7);
      const result = registry.register(invalidToken);

      expect(result.level).toBe('Error');
      expect(result.message).toBe('Baseline grid alignment violation');
      expect(result.mathematicalReasoning).toContain('non-whole number');
      expect(result.suggestions).toContain('Use 8 (1 × 8)');
    });

    test('should handle strategic flexibility tokens correctly in validation', () => {
      const strategicToken = createSpacingToken('space075', 6, true);
      const result = registry.validateToken(strategicToken);

      expect(result.level).toBe('Pass');
      expect(result.message).toBe('Strategic flexibility token - mathematically derived exception');
      expect(result.mathematicalReasoning).toContain('mathematically derived');
    });
  });
});