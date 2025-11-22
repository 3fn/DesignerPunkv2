/**
 * Token System Integration Tests
 * 
 * Comprehensive integration tests validating the complete token system
 * functionality including TokenEngine orchestration, registry coordination,
 * validation workflows, and translation services.
 */

import { TokenEngine } from '../../TokenEngine';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

describe('Token System Integration', () => {
  let engine: TokenEngine;

  beforeEach(() => {
    engine = new TokenEngine({
      autoValidate: true,
      enableCrossPlatformValidation: true,
      strategicFlexibilityThreshold: 0.8,
      enableUsageTracking: true
    });
  });

  describe('TokenEngine Initialization', () => {
    it('should initialize with default configuration', () => {
      const defaultEngine = new TokenEngine();
      const config = defaultEngine.getConfig();

      expect(config.autoValidate).toBe(true);
      expect(config.enableCrossPlatformValidation).toBe(true);
      expect(config.strategicFlexibilityThreshold).toBe(0.8);
      expect(config.enableUsageTracking).toBe(true);
    });

    it('should initialize with custom configuration', () => {
      const customEngine = new TokenEngine({
        autoValidate: false,
        strategicFlexibilityThreshold: 0.9,
        validationOptions: {
          strictMathematics: false,
          primitiveUsageThreshold: 0.5
        }
      });

      const config = customEngine.getConfig();
      expect(config.autoValidate).toBe(false);
      expect(config.strategicFlexibilityThreshold).toBe(0.9);
      expect(config.validationOptions?.strictMathematics).toBe(false);
      expect(config.validationOptions?.primitiveUsageThreshold).toBe(0.5);
    });

    it('should provide initial system statistics', () => {
      const stats = engine.getStats();

      expect(stats.primitiveTokens.total).toBe(0);
      expect(stats.semanticTokens.total).toBe(0);
      expect(stats.validation.passCount).toBe(0);
      expect(stats.validation.errorCount).toBe(0);
    });
  });

  describe('Primitive Token Registration and Validation', () => {
    it('should register and validate baseline grid-aligned token', () => {
      const token: PrimitiveToken = {
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
      };

      const result = engine.registerPrimitiveToken(token);

      expect(result.level).toBe('Pass');
      expect(result.token).toBe('space100');
      
      // Only retrieve token if validation passed
      if (result.level !== 'Error') {
        const retrievedToken = engine.getPrimitiveToken('space100');
        expect(retrievedToken).toBeDefined();
        expect(retrievedToken).toEqual(token);
      }
    });

    it('should register and validate strategic flexibility token', () => {
      const token: PrimitiveToken = {
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
      };

      const result = engine.registerPrimitiveToken(token);

      expect(result.level).toBe('Pass');
      expect(result.token).toBe('space075');
      
      // Only retrieve token if validation passed
      if (result.level !== 'Error') {
        const retrievedToken = engine.getPrimitiveToken('space075');
        expect(retrievedToken).toBeDefined();
      }
    });

    it('should detect invalid baseline grid alignment', () => {
      const token: PrimitiveToken = {
        name: 'spaceInvalid',
        category: TokenCategory.SPACING,
        baseValue: 9,
        familyBaseValue: 8,
        description: 'Invalid spacing',
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

      const result = engine.registerPrimitiveToken(token);

      expect(result.level).toBe('Error');
      expect(result.message).toContain('Baseline grid');
    });

    it('should register multiple tokens in batch', () => {
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
        }
      ];

      const results = engine.registerPrimitiveTokens(tokens);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.level === 'Pass')).toBe(true);
      
      // Only check token count if all validations passed
      if (results.every(r => r.level !== 'Error')) {
        expect(engine.getAllPrimitiveTokens()).toHaveLength(2);
      }
    });
  });

  describe('Semantic Token Registration and Validation', () => {
    beforeEach(() => {
      // Register primitive tokens first
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
    });

    it('should register semantic token with valid primitive reference', () => {
      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing for layouts',
        primitiveTokens: {}
      };

      const result = engine.registerSemanticToken(semanticToken);

      expect(result.level).toBe('Pass');
      expect(result.token).toBe('space.normal');
      
      // Only retrieve token if validation passed
      if (result.level !== 'Error') {
        const retrievedToken = engine.getSemanticToken('space.normal');
        expect(retrievedToken).toBeDefined();
      }
    });

    it('should detect invalid primitive reference', () => {
      const semanticToken: SemanticToken = {
        name: 'space.invalid',
        primitiveReferences: { default: 'nonexistent' },
        category: SemanticCategory.SPACING,
        context: 'Invalid reference',
        description: 'References non-existent primitive',
        primitiveTokens: {}
      };

      const result = engine.registerSemanticToken(semanticToken);

      expect(result.level).toBe('Error');
      expect(result.message).toContain('primitive');
    });

    it('should register multiple semantic tokens in batch', () => {
      const semanticTokens: SemanticToken[] = [
        {
          name: 'space.tight',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Tight spacing',
          description: 'Compact layouts',
          primitiveTokens: {}
        },
        {
          name: 'space.normal',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Normal spacing',
          description: 'Standard layouts',
          primitiveTokens: {}
        }
      ];

      const results = engine.registerSemanticTokens(semanticTokens);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.level === 'Pass')).toBe(true);
      
      // Only check token count if all validations passed
      if (results.every(r => r.level !== 'Error')) {
        expect(engine.getAllSemanticTokens()).toHaveLength(2);
      }
    });
  });

  describe('Token Query and Retrieval', () => {
    beforeEach(() => {
      // Register test tokens
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

      engine.registerPrimitiveTokens(primitiveTokens);
    });

    it('should retrieve primitive token by name', () => {
      const token = engine.getPrimitiveToken('space100');

      expect(token).toBeDefined();
      if (token) {
        expect(token.name).toBe('space100');
        expect(token.baseValue).toBe(8);
      }
    });

    it('should query primitive tokens by category', () => {
      const spacingTokens = engine.queryPrimitiveTokens({
        category: TokenCategory.SPACING
      });

      expect(spacingTokens).toHaveLength(1);
      expect(spacingTokens[0].name).toBe('space100');
    });

    it('should get all primitive tokens', () => {
      const allTokens = engine.getAllPrimitiveTokens();

      expect(allTokens).toHaveLength(2);
      expect(allTokens.map(t => t.name)).toContain('space100');
      expect(allTokens.map(t => t.name)).toContain('fontSize100');
    });
  });

  describe('System Validation', () => {
    beforeEach(() => {
      // Register mix of valid and problematic tokens
      const tokens: PrimitiveToken[] = [
        {
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

    it('should validate all tokens', () => {
      const results = engine.validateAllTokens();

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => ['Pass', 'Warning', 'Error'].includes(r.level))).toBe(true);
    });

    it('should generate validation report', () => {
      const report = engine.generateValidationReport();

      expect(report.summary).toBeDefined();
      expect(report.summary.passCount).toBeGreaterThanOrEqual(0);
      expect(report.summary.warningCount).toBeGreaterThanOrEqual(0);
      expect(report.summary.errorCount).toBeGreaterThanOrEqual(0);
      expect(report.summary.overallHealthScore).toBeGreaterThanOrEqual(0);
      expect(report.summary.overallHealthScore).toBeLessThanOrEqual(1);
    });

    it('should provide system health status', () => {
      const health = engine.getHealthStatus();

      expect(health.status).toMatch(/^(healthy|warning|critical)$/);
      expect(Array.isArray(health.issues)).toBe(true);
      expect(Array.isArray(health.recommendations)).toBe(true);
    });
  });

  describe('System Statistics', () => {
    beforeEach(() => {
      // Register various tokens
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

      engine.registerPrimitiveTokens(primitiveTokens);

      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing',
        primitiveTokens: {}
      };

      engine.registerSemanticToken(semanticToken);
    });

    it('should provide accurate primitive token statistics', () => {
      const stats = engine.getStats();

      expect(stats.primitiveTokens.total).toBe(2);
      expect(stats.primitiveTokens.strategicFlexibility).toBe(1);
      expect(stats.primitiveTokens.strategicFlexibilityPercentage).toBe(50);
    });

    it('should provide accurate semantic token statistics', () => {
      const stats = engine.getStats();

      expect(stats.semanticTokens.total).toBe(1);
    });

    it('should track validation statistics', () => {
      const stats = engine.getStats();

      expect(stats.validation.passCount).toBeGreaterThanOrEqual(0);
      expect(stats.validation.warningCount).toBeGreaterThanOrEqual(0);
      expect(stats.validation.errorCount).toBeGreaterThanOrEqual(0);
      expect(stats.validation.overallHealthScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      engine.updateConfig({
        strategicFlexibilityThreshold: 0.9,
        autoValidate: false
      });

      const config = engine.getConfig();
      expect(config.strategicFlexibilityThreshold).toBe(0.9);
      expect(config.autoValidate).toBe(false);
    });

    it('should preserve unmodified configuration', () => {
      const originalConfig = engine.getConfig();
      
      engine.updateConfig({
        strategicFlexibilityThreshold: 0.9
      });

      const newConfig = engine.getConfig();
      expect(newConfig.enableCrossPlatformValidation).toBe(originalConfig.enableCrossPlatformValidation);
      expect(newConfig.enableUsageTracking).toBe(originalConfig.enableUsageTracking);
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
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

      engine.registerPrimitiveToken(token);
    });

    it('should export system state', () => {
      const state = engine.exportState();

      expect(state.primitiveTokens).toHaveLength(1);
      expect(state.semanticTokens).toHaveLength(0);
      expect(state.config).toBeDefined();
      expect(state.stats).toBeDefined();
    });

    it('should import system state', () => {
      const state = engine.exportState();
      
      const newEngine = new TokenEngine();
      const result = newEngine.importState(state);

      expect(result.success).toBe(true);
      
      // Only check details if import succeeded
      if (result.success) {
        expect(result.errors).toHaveLength(0);
        expect(newEngine.getAllPrimitiveTokens()).toHaveLength(1);
      }
    });

    it('should reset system state', () => {
      engine.reset();

      expect(engine.getAllPrimitiveTokens()).toHaveLength(0);
      expect(engine.getAllSemanticTokens()).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate token registration', () => {
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

      engine.registerPrimitiveToken(token);
      const result = engine.registerPrimitiveToken(token);

      expect(result.level).toBe('Error');
      expect(result.message).toContain('already exists');
    });

    it('should handle invalid state import', () => {
      const invalidState = {
        primitiveTokens: [
          {
            name: 'invalid',
            category: TokenCategory.SPACING,
            baseValue: 9, // Invalid baseline grid
            familyBaseValue: 8,
            description: 'Invalid',
            mathematicalRelationship: 'invalid',
            baselineGridAlignment: false,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
              web: { value: 9, unit: 'px' as const },
              ios: { value: 9, unit: 'pt' as const },
              android: { value: 9, unit: 'dp' as const }
            }
          }
        ],
        semanticTokens: []
      };

      const result = engine.importState(invalidState);

      expect(result.success).toBe(false);
      
      // Only check errors if import failed
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Validation Before Registration', () => {
    it('should validate primitive token before registration and prevent registration on error', () => {
      // Create an invalid token (not baseline grid aligned, not strategic flexibility)
      const invalidToken: PrimitiveToken = {
        name: 'space999',
        category: TokenCategory.SPACING,
        baseValue: 9, // Invalid: not baseline grid aligned
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: 'invalid',
        baselineGridAlignment: false, // Claims not aligned
        isStrategicFlexibility: false, // Not strategic flexibility
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 9, unit: 'px' },
          ios: { value: 9, unit: 'pt' },
          android: { value: 9, unit: 'dp' }
        }
      };

      const result = engine.registerPrimitiveToken(invalidToken);

      // Validation should fail with error
      expect(result.level).toBe('Error');
      
      // Token should NOT be registered
      expect(engine.getPrimitiveToken('space999')).toBeUndefined();
    });

    it('should validate primitive token and allow registration on pass', () => {
      const validToken: PrimitiveToken = {
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

      const result = engine.registerPrimitiveToken(validToken);

      // Validation should pass
      expect(result.level).toBe('Pass');
      
      // Token should be registered
      expect(engine.getPrimitiveToken('space100')).toEqual(validToken);
    });

    it('should validate primitive token and allow registration on warning', () => {
      // Strategic flexibility token (may generate warning but should register)
      const warningToken: PrimitiveToken = {
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
      };

      const result = engine.registerPrimitiveToken(warningToken);

      // Should pass or warn (not error)
      expect(result.level).not.toBe('Error');
      
      // Token should be registered even with warning
      expect(engine.getPrimitiveToken('space075')).toEqual(warningToken);
    });

    it('should validate semantic token before registration and prevent registration on error', () => {
      // First register a valid primitive token
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

      // Create semantic token with invalid reference
      const invalidSemanticToken: SemanticToken = {
        name: 'spacing.invalid',
        category: SemanticCategory.SPACING,
        context: 'layout',
        description: 'Invalid semantic spacing',
        primitiveReferences: {
          value: 'nonexistent-token' // Invalid reference
        },
        platforms: {
          web: { value: 'var(--nonexistent-token)', unit: 'px' },
          ios: { value: 0, unit: 'pt' },
          android: { value: 0, unit: 'dp' }
        }
      };

      const result = engine.registerSemanticToken(invalidSemanticToken);

      // Validation should fail with error
      expect(result.level).toBe('Error');
      
      // Token should NOT be registered
      expect(engine.getSemanticToken('spacing.invalid')).toBeUndefined();
    });

    it('should validate semantic token and allow registration on pass', () => {
      // First register a valid primitive token
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

      // Create valid semantic token
      const validSemanticToken: SemanticToken = {
        name: 'spacing.base',
        category: SemanticCategory.SPACING,
        context: 'layout',
        description: 'Base semantic spacing',
        primitiveReferences: {
          value: 'space100'
        },
        platforms: {
          web: { value: 'var(--space100)', unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      const result = engine.registerSemanticToken(validSemanticToken);

      // Validation should pass
      expect(result.level).not.toBe('Error');
      
      // Token should be registered
      expect(engine.getSemanticToken('spacing.base')).toEqual(validSemanticToken);
    });

    it('should skip validation when autoValidate is disabled', () => {
      const engineNoValidation = new TokenEngine({
        autoValidate: false
      });

      // Create an invalid token
      const invalidToken: PrimitiveToken = {
        name: 'space999',
        category: TokenCategory.SPACING,
        baseValue: 9, // Invalid: not baseline grid aligned
        familyBaseValue: 8,
        description: 'Invalid spacing',
        mathematicalRelationship: 'invalid',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 9, unit: 'px' },
          ios: { value: 9, unit: 'pt' },
          android: { value: 9, unit: 'dp' }
        }
      };

      const result = engineNoValidation.registerPrimitiveToken(invalidToken);

      // Should register without validation (result from registry, not validator)
      // Token should be registered even though it's invalid
      expect(engineNoValidation.getPrimitiveToken('space999')).toEqual(invalidToken);
    });

    it('should validate batch registration and prevent registration of invalid tokens', () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Valid spacing',
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
          name: 'space999',
          category: TokenCategory.SPACING,
          baseValue: 9, // Invalid
          familyBaseValue: 8,
          description: 'Invalid spacing',
          mathematicalRelationship: 'invalid',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 9, unit: 'px' },
            ios: { value: 9, unit: 'pt' },
            android: { value: 9, unit: 'dp' }
          }
        }
      ];

      const results = engine.registerPrimitiveTokens(tokens);

      // First token should pass
      expect(results[0].level).toBe('Pass');
      if (results[0].level !== 'Error') {
        expect(engine.getPrimitiveToken('space100')).toBeDefined();
      }

      // Second token should fail
      expect(results[1].level).toBe('Error');
      if (results[1].level === 'Error') {
        expect(engine.getPrimitiveToken('space999')).toBeUndefined();
      }
    });
  });
});
