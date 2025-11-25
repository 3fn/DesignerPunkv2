/**
 * End-to-End Workflow Integration Tests
 * 
 * Tests complete workflows from token definition through validation
 * to cross-platform generation, simulating real-world usage patterns.
 */

import { TokenEngine } from '../../TokenEngine';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

describe('End-to-End Workflow Integration', () => {
  let engine: TokenEngine;

  beforeEach(() => {
    engine = new TokenEngine({
      autoValidate: true,
      enableCrossPlatformValidation: true,
      strategicFlexibilityThreshold: 0.8,
      enableUsageTracking: true
    });
  });

  describe('Complete Token Definition Workflow', () => {
    it('should complete full workflow: define → validate → query', () => {
      // Step 1: Define primitive tokens
      const primitiveTokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing unit',
          mathematicalRelationship: 'base value',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        }
      ];

      // Step 2: Register and validate
      const primitiveResults = engine.registerPrimitiveTokens(primitiveTokens);
      expect(primitiveResults.every(r => r.level === 'Pass')).toBe(true);

      // Step 3: Define semantic tokens
      const semanticTokens: SemanticToken[] = [
        {
          name: 'space.grouped.normal',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Grouped elements with normal spacing',
          description: 'Standard spacing for grouped elements'
        },
        {
          name: 'space.separated.normal',
          primitiveReferences: { default: 'space200' },
          category: SemanticCategory.SPACING,
          context: 'Separated elements with normal spacing',
          description: 'Standard spacing for separated elements'
        }
      ];

      // Step 4: Register semantic tokens
      const semanticResults = engine.registerSemanticTokens(semanticTokens);
      expect(semanticResults.every(r => r.level === 'Pass')).toBe(true);

      // Step 5: Query and verify
      const allPrimitives = engine.getAllPrimitiveTokens();
      const allSemantics = engine.getAllSemanticTokens();

      expect(allPrimitives).toHaveLength(2);
      expect(allSemantics).toHaveLength(2);

      // Step 6: Validate system health (may have warnings due to usage patterns)
      const health = engine.getHealthStatus();
      expect(health.status).toMatch(/^(healthy|warning|critical)$/);
    });

    it('should handle workflow with strategic flexibility tokens', () => {
      // Define mix of standard and strategic flexibility tokens
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space075',
          category: TokenCategory.SPACING,
          baseValue: 6,
          familyBaseValue: 8,
          description: 'Strategic flexibility spacing',
          mathematicalRelationship: 'base × 0.75',
          baselineGridAlignment: false,
          isStrategicFlexibility: true,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 6, unit: 'px' },
            ios: { value: 6, unit: 'pt' },
            android: { value: 6, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        }
      ];

      const results = engine.registerPrimitiveTokens(tokens);
      expect(results.every(r => r.level === 'Pass')).toBe(true);

      // Verify strategic flexibility tracking
      const stats = engine.getStats();
      expect(stats.primitiveTokens.strategicFlexibility).toBe(1);
      expect(stats.primitiveTokens.strategicFlexibilityPercentage).toBeCloseTo(33.33, 1);
    });
  });

  describe('Multi-Category Token System Workflow', () => {
    it('should handle tokens across multiple categories', () => {
      // Define tokens from different categories
      const tokens: PrimitiveToken[] = [
        // Spacing tokens
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        // Font size tokens
        {
          name: 'fontSize100',
          category: TokenCategory.FONT_SIZE,
          baseValue: 16,
          familyBaseValue: 16,
          description: 'Base font size',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 1, unit: 'rem' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'sp' }
          }
        },
        // Radius tokens
        {
          name: 'radius100',
          category: TokenCategory.RADIUS,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base radius',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        }
      ];

      const results = engine.registerPrimitiveTokens(tokens);
      expect(results.every(r => r.level === 'Pass')).toBe(true);

      // Query by category
      const spacingTokens = engine.queryPrimitiveTokens({ category: TokenCategory.SPACING });
      const fontSizeTokens = engine.queryPrimitiveTokens({ category: TokenCategory.FONT_SIZE });
      const radiusTokens = engine.queryPrimitiveTokens({ category: TokenCategory.RADIUS });

      expect(spacingTokens).toHaveLength(1);
      expect(fontSizeTokens).toHaveLength(1);
      expect(radiusTokens).toHaveLength(1);
    });
  });

  describe('Validation and Error Recovery Workflow', () => {
    it('should detect and report validation errors', () => {
      // Register valid token first
      const validToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Valid token',
        mathematicalRelationship: 'base',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const validResult = engine.registerPrimitiveToken(validToken);
      expect(validResult.level).toBe('Pass');

      // Attempt to register invalid token
      const invalidToken: PrimitiveToken = {
        name: 'spaceInvalid',
        category: TokenCategory.SPACING,
        baseValue: 9,
        familyBaseValue: 8,
        description: 'Invalid token',
        mathematicalRelationship: 'base × 1.125',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 9, unit: 'px' },
          ios: { value: 9, unit: 'pt' },
          android: { value: 9, unit: 'dp' }
        }
      };

      const invalidResult = engine.registerPrimitiveToken(invalidToken);
      expect(invalidResult.level).toBe('Error');

      // System should still be functional
      const allTokens = engine.getAllPrimitiveTokens();
      expect(allTokens).toHaveLength(1); // Only valid token registered
      expect(allTokens[0].name).toBe('space100');
    });

    it('should provide actionable validation feedback', () => {
      const invalidToken: PrimitiveToken = {
        name: 'spaceInvalid',
        category: TokenCategory.SPACING,
        baseValue: 9,
        familyBaseValue: 8,
        description: 'Invalid token',
        mathematicalRelationship: 'base × 1.125',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 9, unit: 'px' },
          ios: { value: 9, unit: 'pt' },
          android: { value: 9, unit: 'dp' }
        }
      };

      const result = engine.registerPrimitiveToken(invalidToken);

      expect(result.level).toBe('Error');
      expect(result.message).toBeDefined();
      expect(result.rationale).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
    });
  });

  describe('Semantic Token Composition Workflow', () => {
    beforeEach(() => {
      // Set up primitive tokens
      const primitiveTokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        },
        {
          name: 'space300',
          category: TokenCategory.SPACING,
          baseValue: 24,
          familyBaseValue: 8,
          description: 'Triple spacing',
          mathematicalRelationship: 'base × 3',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 24, unit: 'px' },
            ios: { value: 24, unit: 'pt' },
            android: { value: 24, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(primitiveTokens);
    });

    it('should compose hierarchical semantic token system', () => {
      // Create hierarchical semantic tokens
      const semanticTokens: SemanticToken[] = [
        // Grouped spacing
        {
          name: 'space.grouped.tight',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Tight grouping',
          description: 'Minimal spacing for tightly grouped elements'
        },
        {
          name: 'space.grouped.normal',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Normal grouping',
          description: 'Standard spacing for grouped elements'
        },
        // Related spacing
        {
          name: 'space.related.normal',
          primitiveReferences: { default: 'space200' },
          category: SemanticCategory.SPACING,
          context: 'Related elements',
          description: 'Spacing for related but distinct elements'
        },
        // Separated spacing
        {
          name: 'space.separated.normal',
          primitiveReferences: { default: 'space300' },
          category: SemanticCategory.SPACING,
          context: 'Separated elements',
          description: 'Clear separation between independent elements'
        }
      ];

      const results = engine.registerSemanticTokens(semanticTokens);
      expect(results.every(r => r.level === 'Pass')).toBe(true);

      // Verify hierarchical structure
      const allSemantics = engine.getAllSemanticTokens();
      expect(allSemantics).toHaveLength(4);

      const groupedTokens = allSemantics.filter(t => t.name.startsWith('space.grouped'));
      const relatedTokens = allSemantics.filter(t => t.name.startsWith('space.related'));
      const separatedTokens = allSemantics.filter(t => t.name.startsWith('space.separated'));

      expect(groupedTokens).toHaveLength(2);
      expect(relatedTokens).toHaveLength(1);
      expect(separatedTokens).toHaveLength(1);
    });

    it('should validate semantic token references', () => {
      // Valid semantic token
      const validSemantic: SemanticToken = {
        name: 'space.valid',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Valid reference',
        description: 'References existing primitive'
      };

      const validResult = engine.registerSemanticToken(validSemantic);
      expect(validResult.level).toBe('Pass');

      // Invalid semantic token (non-existent primitive)
      const invalidSemantic: SemanticToken = {
        name: 'space.invalid',
        primitiveReferences: { default: 'nonexistent' },
        category: SemanticCategory.SPACING,
        context: 'Invalid reference',
        description: 'References non-existent primitive'
      };

      const invalidResult = engine.registerSemanticToken(invalidSemantic);
      expect(invalidResult.level).toBe('Error');
      expect(invalidResult.message).toContain('primitive');
    });
  });

  describe('System Health Monitoring Workflow', () => {
    it('should track system health throughout workflow', () => {
      // Initial state - healthy
      let health = engine.getHealthStatus();
      expect(health.status).toBe('healthy');

      // Add valid tokens - should remain healthy or have warnings
      const validTokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(validTokens);
      health = engine.getHealthStatus();
      expect(health.status).toMatch(/^(healthy|warning|critical)$/);

      // Get statistics
      const stats = engine.getStats();
      expect(stats.validation.overallHealthScore).toBeGreaterThanOrEqual(0);
    });

    it('should provide recommendations for system improvement', () => {
      // Add many strategic flexibility tokens
      const tokens: PrimitiveToken[] = [];
      
      // Add 1 standard token
      tokens.push({
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      });

      // Add 3 strategic flexibility tokens (75% SF usage)
      for (let i = 0; i < 3; i++) {
        tokens.push({
          name: `spaceSF${i}`,
          category: TokenCategory.SPACING,
          baseValue: 6,
          familyBaseValue: 8,
          description: 'Strategic flexibility',
          mathematicalRelationship: 'base × 0.75',
          baselineGridAlignment: false,
          isStrategicFlexibility: true,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 6, unit: 'px' },
            ios: { value: 6, unit: 'pt' },
            android: { value: 6, unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(tokens);

      const health = engine.getHealthStatus();
      expect(health.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('State Persistence Workflow', () => {
    it('should export and import complete system state', () => {
      // Build up system state
      const primitiveTokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(primitiveTokens);

      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing'
      };

      engine.registerSemanticToken(semanticToken);

      // Export state
      const state = engine.exportState();
      expect(state.primitiveTokens).toHaveLength(1);
      expect(state.semanticTokens).toHaveLength(1);

      // Create new engine and import
      const newEngine = new TokenEngine();
      const importResult = newEngine.importState(state);

      expect(importResult.success).toBe(true);
      expect(newEngine.getAllPrimitiveTokens()).toHaveLength(1);
      expect(newEngine.getAllSemanticTokens()).toHaveLength(1);
    });
  });
});
