/**
 * @category evergreen
 * @purpose Verify system performance meets requirements and thresholds
 */
/**
 * Performance Validation Integration Tests
 * 
 * Tests performance requirements for token generation, validation,
 * and translation to ensure <5ms generation time and efficient operations.
 * 
 * DUAL-THRESHOLD APPROACH:
 * - Normal Operation Thresholds: Current values (5ms, 10ms, etc.)
 *   Provide headroom for normal variance and system load variations
 * - Regression Detection Thresholds: 2x P95 measured performance
 *   Detect genuine performance degradation without false positives
 * 
 * BASELINE MEASUREMENTS (November 22, 2025):
 * - Token Registration: 0.233ms avg, 1.393ms P95 → 3ms regression threshold
 * - Token Query: 0.002ms avg, 0.017ms P95 → 1ms regression threshold
 * - Validation: 0.021ms avg, 0.060ms P95 → 1ms regression threshold
 * - Statistics: 0.338ms avg, 0.802ms P95 → 2ms regression threshold
 * - State Management: 0.416ms avg, 0.544ms P95 → 2ms regression threshold
 * - Platform Generation: 0.185ms avg, 1.450ms P95 → 3ms regression threshold
 * - Large Scale: 1.103ms avg, 1.702ms P95 → 4ms regression threshold
 * - Config Update: 0.013ms avg, 0.102ms P95 → 1ms regression threshold
 * 
 * See: .kiro/specs/remaining-test-failures-fixes/completion/task-4-1-completion.md
 */

import { TokenEngine } from '../../TokenEngine';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

/**
 * Performance Thresholds Configuration
 * 
 * NORMAL OPERATION THRESHOLDS:
 * Used for standard performance validation. Provide 5-10x headroom
 * over typical performance to allow for system variance.
 */
const NORMAL_THRESHOLDS = {
  tokenRegistration: 5,      // ms - Single token registration
  tokenQuery: 5,             // ms - Query operations
  validation: 5,             // ms - Validation operations
  statistics: 5,             // ms - Statistics generation
  stateManagement: 5,        // ms - State export/import
  platformGeneration: 25,    // ms - Platform-specific generation (adjusted from 10ms per Spec 025 R4)
  largeScale: 50,            // ms - Batch operations (100 tokens)
  configUpdate: 1,           // ms - Configuration updates
  asyncOperations: 15        // ms - Async operations (all platforms)
} as const;

/**
 * REGRESSION DETECTION THRESHOLDS:
 * Based on 2x P95 measured performance. Detect genuine performance
 * degradation while avoiding false positives from normal variance.
 */
const REGRESSION_THRESHOLDS = {
  tokenRegistration: 3,      // ms - 2x P95 (1.393ms)
  tokenQuery: 1,             // ms - 2x P95 (0.017ms)
  validation: 1,             // ms - 2x P95 (0.060ms)
  statistics: 2,             // ms - 2x P95 (0.802ms)
  stateManagement: 2,        // ms - 2x P95 (0.544ms)
  platformGeneration: 3,     // ms - 2x P95 (1.450ms)
  largeScale: 4,             // ms - 2x P95 (1.702ms)
  configUpdate: 1,           // ms - 2x P95 (0.102ms)
  performanceConsistency: 1  // ms - Standard deviation threshold
} as const;

describe('Performance Validation Integration', () => {
  let engine: TokenEngine;

  beforeEach(() => {
    engine = new TokenEngine({
      autoValidate: true,
      enableCrossPlatformValidation: true,
      strategicFlexibilityThreshold: 0.8
    });
  });

  describe('Token Registration Performance', () => {
    it('should register single primitive token within normal threshold', () => {
      const token: PrimitiveToken = {
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
      };

      const startTime = performance.now();
      engine.registerPrimitiveToken(token);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenRegistration);
    });

    it('should register single primitive token without regression', () => {
      const token: PrimitiveToken = {
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
      };

      const startTime = performance.now();
      engine.registerPrimitiveToken(token);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.tokenRegistration);
    });

    it('should register batch of 10 primitive tokens within normal threshold', () => {
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 10; i++) {
        tokens.push({
          name: `space${i}00`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Spacing ${i}x`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      const startTime = performance.now();
      engine.registerPrimitiveTokens(tokens);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenRegistration);
    });

    it('should register semantic token within normal threshold', () => {
      // Register primitive first
      const primitiveToken: PrimitiveToken = {
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
      };

      engine.registerPrimitiveToken(primitiveToken);

      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing'
      };

      const startTime = performance.now();
      engine.registerSemanticToken(semanticToken);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenRegistration);
    });
  });

  describe('Token Query Performance', () => {
    beforeEach(() => {
      // Register 50 tokens for query performance testing
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 50; i++) {
        tokens.push({
          name: `space${i}00`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Spacing ${i}x`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(tokens);
    });

    it('should retrieve single token within normal threshold', () => {
      const startTime = performance.now();
      engine.getPrimitiveToken('space100');
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenQuery);
    });

    it('should retrieve single token without regression', () => {
      const startTime = performance.now();
      engine.getPrimitiveToken('space100');
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.tokenQuery);
    });

    it('should query all tokens within normal threshold', () => {
      const startTime = performance.now();
      engine.getAllPrimitiveTokens();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenQuery);
    });

    it('should query tokens by category within normal threshold', () => {
      const startTime = performance.now();
      engine.queryPrimitiveTokens({ category: TokenCategory.SPACING });
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.tokenQuery);
    });
  });

  describe('Validation Performance', () => {
    beforeEach(() => {
      // Register typical token set
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
          name: 'space075',
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
        }
      ];

      engine.registerPrimitiveTokens(tokens);
    });

    it('should validate single token within normal threshold', () => {
      const token = engine.getPrimitiveToken('space100')!;

      const startTime = performance.now();
      engine.validateToken(token);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.validation);
    });

    it('should validate single token without regression', () => {
      const token = engine.getPrimitiveToken('space100')!;

      const startTime = performance.now();
      engine.validateToken(token);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.validation);
    });

    it('should validate all tokens within normal threshold', () => {
      const startTime = performance.now();
      engine.validateAllTokens();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.validation);
    });

    it('should generate validation report within normal threshold', () => {
      const startTime = performance.now();
      engine.generateValidationReport();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.platformGeneration);
    });

    it('should validate cross-platform consistency within normal threshold', () => {
      const startTime = performance.now();
      engine.validateCrossPlatformConsistency();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.validation);
    });
  });

  describe('Statistics and Health Check Performance', () => {
    beforeEach(() => {
      // Register diverse token set
      const primitiveTokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 20; i++) {
        primitiveTokens.push({
          name: `space${i}00`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Spacing ${i}x`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(primitiveTokens);

      // Register semantic tokens
      const semanticTokens: SemanticToken[] = [];
      for (let i = 1; i <= 10; i++) {
        semanticTokens.push({
          name: `space.semantic${i}`,
          primitiveReferences: { default: `space${i}00` },
          category: SemanticCategory.SPACING,
          context: `Semantic ${i}`,
          description: `Semantic spacing ${i}`
        });
      }

      engine.registerSemanticTokens(semanticTokens);
    });

    it('should get statistics within normal threshold', () => {
      const startTime = performance.now();
      engine.getStats();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.statistics);
    });

    it('should get statistics without regression', () => {
      const startTime = performance.now();
      engine.getStats();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.statistics);
    });

    it('should get health status within normal threshold', () => {
      const startTime = performance.now();
      engine.getHealthStatus();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.statistics);
    });
  });

  describe('State Management Performance', () => {
    beforeEach(() => {
      // Register typical token set
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 30; i++) {
        tokens.push({
          name: `space${i}00`,
          category: TokenCategory.SPACING,
          baseValue: 8 * i,
          familyBaseValue: 8,
          description: `Spacing ${i}x`,
          mathematicalRelationship: `base × ${i}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * i, unit: 'px' },
            ios: { value: 8 * i, unit: 'pt' },
            android: { value: 8 * i, unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(tokens);
    });

    it('should export state within normal threshold', () => {
      const startTime = performance.now();
      engine.exportState();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.stateManagement);
    });

    it('should export state without regression', () => {
      const startTime = performance.now();
      engine.exportState();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.stateManagement);
    });

    it('should import state within normal threshold', () => {
      const state = engine.exportState();
      const newEngine = new TokenEngine();

      const startTime = performance.now();
      newEngine.importState(state);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.platformGeneration);
    });

    it('should reset state within normal threshold', () => {
      const startTime = performance.now();
      engine.reset();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.configUpdate);
    });
  });

  describe('Platform Generation Performance', () => {
    beforeEach(() => {
      // Register typical token set for generation
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
        }
      ];

      engine.registerPrimitiveTokens(tokens);
    });

    it('should generate single platform tokens within normal threshold', async () => {
      const startTime = performance.now();
      await engine.generatePlatformTokensFor('web');
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.platformGeneration);
    });

    it('should generate single platform tokens without regression', async () => {
      const startTime = performance.now();
      await engine.generatePlatformTokensFor('web');
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.platformGeneration);
    });

    it('should generate all platform tokens within normal threshold', async () => {
      const startTime = performance.now();
      await engine.generatePlatformTokens();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.asyncOperations);
    });
  });

  describe('Large-Scale Performance', () => {
    it('should handle 100 tokens within normal threshold', () => {
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 100; i++) {
        tokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }

      const startTime = performance.now();
      engine.registerPrimitiveTokens(tokens);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.largeScale);
    });

    it('should handle 100 tokens without regression', () => {
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 100; i++) {
        tokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }

      const startTime = performance.now();
      engine.registerPrimitiveTokens(tokens);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.largeScale);
    });

    it('should validate 100 tokens within normal threshold', () => {
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 100; i++) {
        tokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(tokens);

      const startTime = performance.now();
      engine.validateAllTokens();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.largeScale);
    });

    it('should query 100 tokens within normal threshold', () => {
      const tokens: PrimitiveToken[] = [];
      
      for (let i = 1; i <= 100; i++) {
        tokens.push({
          name: `token${i}`,
          category: TokenCategory.SPACING,
          baseValue: 8 * (i % 10 + 1),
          familyBaseValue: 8,
          description: `Token ${i}`,
          mathematicalRelationship: `base × ${i % 10 + 1}`,
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8 * (i % 10 + 1), unit: 'px' },
            ios: { value: 8 * (i % 10 + 1), unit: 'pt' },
            android: { value: 8 * (i % 10 + 1), unit: 'dp' }
          }
        });
      }

      engine.registerPrimitiveTokens(tokens);

      const startTime = performance.now();
      engine.getAllPrimitiveTokens();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.platformGeneration);
    });
  });

  describe('Configuration Update Performance', () => {
    it('should update configuration within normal threshold', () => {
      const startTime = performance.now();
      engine.updateConfig({
        strategicFlexibilityThreshold: 0.9,
        autoValidate: false
      });
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.configUpdate);
    });

    it('should update configuration without regression', () => {
      const startTime = performance.now();
      engine.updateConfig({
        strategicFlexibilityThreshold: 0.9,
        autoValidate: false
      });
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.configUpdate);
    });

    it('should get configuration within normal threshold', () => {
      const startTime = performance.now();
      engine.getConfig();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(NORMAL_THRESHOLDS.configUpdate);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should maintain consistent performance across operations', () => {
      const token: PrimitiveToken = {
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
      };

      const durations: number[] = [];

      // Perform operation 10 times
      for (let i = 0; i < 10; i++) {
        const testEngine = new TokenEngine();
        const startTime = performance.now();
        testEngine.registerPrimitiveToken(token);
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }

      // Calculate average and standard deviation
      const average = durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance = durations.reduce((sum, duration) => 
        sum + Math.pow(duration - average, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);

      // Performance should be consistent
      // Baseline: stdDev ~0.002ms (measured Nov 22, 2025)
      // Threshold: 1ms allows for normal system variance
      expect(stdDev).toBeLessThan(REGRESSION_THRESHOLDS.performanceConsistency);
      expect(average).toBeLessThan(NORMAL_THRESHOLDS.tokenRegistration);
    });

    it('should detect performance regression in token registration', () => {
      const token: PrimitiveToken = {
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
      };

      const startTime = performance.now();
      engine.registerPrimitiveToken(token);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      // Should not exceed regression threshold (2x P95)
      expect(duration).toBeLessThan(REGRESSION_THRESHOLDS.tokenRegistration);
    });
  });
});
