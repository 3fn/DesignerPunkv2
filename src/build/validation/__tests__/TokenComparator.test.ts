/**
 * Token Comparator Tests
 * 
 * Tests token value comparison across platforms for primitive, semantic,
 * and component tokens.
 */

import { TokenComparator } from '../TokenComparator';
import { PrimitiveTokenRegistry } from '../../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../../registries/SemanticTokenRegistry';
import { PrimitiveToken, TokenCategory } from '../../../types/PrimitiveToken';
import { SemanticToken, SemanticCategory } from '../../../types/SemanticToken';
import { ComponentToken } from '../../tokens/ComponentToken';

describe('TokenComparator', () => {
  let comparator: TokenComparator;
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    comparator = new TokenComparator(primitiveRegistry, semanticRegistry);
  });

  // Helper function to create valid primitive tokens
  const createPrimitiveToken = (
    name: string,
    baseValue: number,
    platforms: { ios: number; android: number; web: number }
  ): PrimitiveToken => ({
    name,
    category: TokenCategory.SPACING,
    baseValue,
    familyBaseValue: 8,
    platforms: {
      web: { value: platforms.web, unit: 'px' },
      ios: { value: platforms.ios, unit: 'pt' },
      android: { value: platforms.android, unit: 'dp' }
    },
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    mathematicalRelationship: `${baseValue} = 8 × ${baseValue / 8}`,
    description: `Spacing token with base value ${baseValue}`
  });

  describe('Primitive Token Comparison', () => {
    it('should compare primitive token values across platforms', async () => {
      // Create a primitive token
      const token = createPrimitiveToken('space100', 8, { ios: 8, android: 8, web: 8 });

      primitiveRegistry.register(token);

      const result = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web']
      });

      expect(result.tokenName).toBe('space100');
      expect(result.tokenType).toBe('primitive');
      expect(result.isConsistent).toBe(true);
      expect(result.platforms).toEqual(['ios', 'android', 'web']);
      expect(result.platformValues).toHaveProperty('ios');
      expect(result.platformValues).toHaveProperty('android');
      expect(result.platformValues).toHaveProperty('web');
      expect(result.mathematicalAnalysis.consistencyScore).toBeGreaterThanOrEqual(0.95);
    });

    it('should report platform values from F1 validator', async () => {
      // Create a primitive token
      const token = createPrimitiveToken('space150', 12, { ios: 12, android: 12, web: 12 });

      primitiveRegistry.register(token);

      const result = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web']
      });

      // Verify we get platform-specific values from F1 validator
      expect(result.platformValues.android.value).toBe(12);
      expect(result.platformValues.ios.value).toBe(12);
      expect(result.platformValues.web.value).toBe(12);
      expect(result.tokenType).toBe('primitive');
      expect(result.f1ValidationResult).toBeDefined();
      expect(result.mathematicalAnalysis).toBeDefined();
    });

    it('should use F1 validator for primitive tokens', async () => {
      const token = createPrimitiveToken('space200', 16, { ios: 16, android: 16, web: 16 });

      primitiveRegistry.register(token);

      const result = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web']
      });

      // Should have F1 validation result
      expect(result.f1ValidationResult).toBeDefined();
      expect(result.f1ValidationResult?.tokenName).toBe('space200');
    });
  });

  describe('Semantic Token Comparison', () => {
    it('should compare semantic token by resolving to primitive', async () => {
      // Create primitive token
      const primitiveToken = createPrimitiveToken('space100', 8, { ios: 8, android: 8, web: 8 });

      primitiveRegistry.register(primitiveToken);

      // Create semantic token
      const semanticToken: SemanticToken = {
        name: 'space.inset.small',
        category: SemanticCategory.SPACING,
        primitiveReferences: {
          default: 'space100'
        },
        context: 'Small inset spacing for components',
        description: 'Small inset spacing'
      };

      semanticRegistry.register(semanticToken);

      const result = await comparator.compareToken({
        token: semanticToken,
        platforms: ['ios', 'android', 'web']
      });

      expect(result.tokenName).toBe('space.inset.small');
      expect(result.tokenType).toBe('semantic');
      expect(result.isConsistent).toBe(true);
      expect(result.recommendations.some(r => r.includes("references primitive 'space100'"))).toBe(true);
    });

    it('should throw error if primitive reference not found', async () => {
      const semanticToken: SemanticToken = {
        name: 'space.invalid',
        category: SemanticCategory.SPACING,
        primitiveReferences: {
          default: 'nonexistent'
        },
        context: 'Invalid semantic token for testing',
        description: 'Invalid semantic token'
      };

      semanticRegistry.register(semanticToken);

      await expect(
        comparator.compareToken({
          token: semanticToken,
          platforms: ['ios', 'android', 'web']
        })
      ).rejects.toThrow("primitive reference 'nonexistent' not found");
    });
  });

  describe('Component Token Comparison', () => {
    it('should compare component token values across platforms', async () => {
      const componentToken: ComponentToken = {
        name: 'button.padding.horizontal',
        category: 'spacing',
        baseValue: 16,
        component: 'Button',
        reasoning: 'Button requires specific horizontal padding for visual balance',
        platforms: {
          ios: { value: 16, unit: 'pt', token: 'button.padding.horizontal' },
          android: { value: 16, unit: 'dp', token: 'button.padding.horizontal' },
          web: { value: 16, unit: 'px', token: 'button.padding.horizontal' }
        },
        usage: {
          usageCount: 10,
          contexts: ['Button', 'IconButton'],
          appropriateUsage: true,
          appropriateUsageRate: 0.9
        },
        metadata: {
          createdAt: new Date(),
          createdBy: 'designer',
          approved: true,
          promotionCandidate: false
        }
      };

      const result = await comparator.compareToken({
        token: componentToken,
        platforms: ['ios', 'android', 'web']
      });

      expect(result.tokenName).toBe('button.padding.horizontal');
      expect(result.tokenType).toBe('component');
      expect(result.isConsistent).toBe(true);
      expect(result.platformValues.ios.value).toBe(16);
      expect(result.platformValues.android.value).toBe(16);
      expect(result.platformValues.web.value).toBe(16);
    });

    it('should detect inconsistencies in component token values', async () => {
      const componentToken: ComponentToken = {
        name: 'button.padding.vertical',
        category: 'spacing',
        baseValue: 12,
        component: 'Button',
        reasoning: 'Button vertical padding',
        platforms: {
          ios: { value: 12, unit: 'pt', token: 'button.padding.vertical' },
          android: { value: 14, unit: 'dp', token: 'button.padding.vertical' }, // Inconsistent!
          web: { value: 12, unit: 'px', token: 'button.padding.vertical' }
        },
        usage: {
          usageCount: 5,
          contexts: ['Button'],
          appropriateUsage: true,
          appropriateUsageRate: 0.85
        },
        metadata: {
          createdAt: new Date(),
          createdBy: 'designer',
          approved: true,
          promotionCandidate: false
        }
      };

      const result = await comparator.compareToken({
        token: componentToken,
        platforms: ['ios', 'android', 'web']
      });

      expect(result.isConsistent).toBe(false);
      expect(result.differences.length).toBeGreaterThan(0);
      expect(result.mathematicalAnalysis.failedPairs.length).toBeGreaterThan(0);
    });

    it('should recommend reviewing low usage rate component tokens', async () => {
      const componentToken: ComponentToken = {
        name: 'button.padding.special',
        category: 'spacing',
        baseValue: 10,
        component: 'Button',
        reasoning: 'Special button padding',
        platforms: {
          ios: { value: 10, unit: 'pt', token: 'button.padding.special' },
          android: { value: 10, unit: 'dp', token: 'button.padding.special' },
          web: { value: 10, unit: 'px', token: 'button.padding.special' }
        },
        usage: {
          usageCount: 2,
          contexts: ['Button'],
          appropriateUsage: false,
          appropriateUsageRate: 0.5 // Below 80% threshold
        },
        metadata: {
          createdAt: new Date(),
          createdBy: 'designer',
          approved: true,
          promotionCandidate: false
        }
      };

      const result = await comparator.compareToken({
        token: componentToken,
        platforms: ['ios', 'android', 'web']
      });

      expect(result.recommendations.some(r => r.includes('usage rate'))).toBe(true);
      expect(result.recommendations.some(r => r.includes('below 80% threshold'))).toBe(true);
    });
  });

  describe('Batch Token Comparison', () => {
    it('should compare multiple tokens and generate summary', async () => {
      // Create multiple tokens
      const token1 = createPrimitiveToken('space100', 8, { ios: 8, android: 8, web: 8 });
      const token2 = createPrimitiveToken('space200', 16, { ios: 16, android: 16, web: 16 });

      primitiveRegistry.register(token1);
      primitiveRegistry.register(token2);

      const result = await comparator.compareTokens(
        [token1, token2],
        ['ios', 'android', 'web']
      );

      expect(result.totalTokens).toBe(2);
      expect(result.tokenResults).toHaveLength(2);
      expect(result.byTokenType.primitive.total).toBe(2);
      expect(result.averageConsistencyScore).toBeGreaterThanOrEqual(0);
      expect(result.averageConsistencyScore).toBeLessThanOrEqual(1);
    });

    it('should provide platform issue tracking in batch results', async () => {
      const tokens: PrimitiveToken[] = [
        createPrimitiveToken('space100', 8, { ios: 8, android: 8, web: 8 }),
        createPrimitiveToken('space200', 16, { ios: 16, android: 16, web: 16 })
      ];

      tokens.forEach(token => primitiveRegistry.register(token));

      const result = await comparator.compareTokens(
        tokens,
        ['ios', 'android', 'web']
      );

      // Verify batch result structure
      expect(result.tokenResults.length).toBe(2);
      expect(result.platformIssues).toHaveProperty('ios');
      expect(result.platformIssues).toHaveProperty('android');
      expect(result.platformIssues).toHaveProperty('web');
      expect(result.byTokenType).toHaveProperty('primitive');
      expect(result.byTokenType).toHaveProperty('semantic');
      expect(result.byTokenType).toHaveProperty('component');
    });
  });

  describe('Comparison Options', () => {
    it('should apply custom tolerance multiplier', async () => {
      const token = createPrimitiveToken('space100', 8, { ios: 8, android: 8.05, web: 8 }); // Slight deviation

      primitiveRegistry.register(token);

      // With default tolerance, might fail
      const result1 = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web'],
        options: { toleranceMultiplier: 1 }
      });

      // With higher tolerance, should pass
      const result2 = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web'],
        options: { toleranceMultiplier: 10 }
      });

      expect(result2.toleranceLevel).toBeGreaterThan(result1.toleranceLevel);
    });

    it('should use strict mode for zero tolerance', async () => {
      const token = createPrimitiveToken('space100', 8, { ios: 8, android: 8, web: 8 });

      primitiveRegistry.register(token);

      const result = await comparator.compareToken({
        token,
        platforms: ['ios', 'android', 'web'],
        options: { strictMode: true }
      });

      expect(result).toBeDefined();
      // Strict mode is passed to F1 validator
    });
  });
});
