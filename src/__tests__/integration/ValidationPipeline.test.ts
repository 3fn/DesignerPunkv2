/**
 * @category evergreen
 * @purpose Verify ValidationPipeline functionality works correctly
 */
/**
 * ValidationPipeline Integration Tests
 * 
 * Tests the ValidationPipeline's integration with TokenEngine to ensure
 * validation occurs correctly for already-registered tokens.
 */

import { TokenEngine } from '../../TokenEngine';
import { ValidationPipeline } from '../../workflows/ValidationPipeline';
import { TokenCategory, SemanticCategory } from '../../types';
import type { PrimitiveToken, SemanticToken } from '../../types';

describe('ValidationPipeline Integration', () => {
  let engine: TokenEngine;
  let pipeline: ValidationPipeline;

  beforeEach(() => {
    engine = new TokenEngine({
      autoValidate: true,
      enableCrossPlatformValidation: true
    });
    pipeline = new ValidationPipeline(engine);
  });

  describe('Pipeline Initialization', () => {
    it('should initialize pipeline', () => {
      expect(() => pipeline.initialize()).not.toThrow();
    });

    it('should reset pipeline', () => {
      pipeline.initialize();
      expect(() => pipeline.reset()).not.toThrow();
    });

    it('should throw error when validating without initialization', async () => {
      await expect(pipeline.validate()).rejects.toThrow('not initialized');
    });
  });

  describe('Primitive Token Validation', () => {
    beforeEach(() => {
      pipeline.initialize();
    });

    it('should validate registered primitive tokens', async () => {
      // Register valid primitive token (validation happens before registration)
      const token: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      // Token is validated before registration by engine
      engine.registerPrimitiveToken(token);

      // Pipeline validates already-registered tokens
      const results = await pipeline.validate();

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.token === 'space100')).toBe(true);
    });

    it('should validate multiple primitive tokens', async () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
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
          mathematicalRelationship: 'base × 2 = 8 × 2 = 16',
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

      // Tokens are validated before registration by engine
      engine.registerPrimitiveTokens(tokens);

      // Pipeline validates already-registered tokens
      const results = await pipeline.validate();

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.token === 'space100')).toBe(true);
      expect(results.some(r => r.token === 'space200')).toBe(true);
    });
  });

  describe('Semantic Token Validation', () => {
    beforeEach(() => {
      pipeline.initialize();

      // Register primitive token first
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
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

    it('should validate registered semantic tokens', async () => {
      // Register valid semantic token (validation happens before registration)
      const semanticToken: SemanticToken = {
        name: 'space.normal',
        primitiveReferences: { default: 'space100' },
        category: SemanticCategory.SPACING,
        context: 'Normal spacing',
        description: 'Standard spacing for layouts'
      };

      // Token is validated before registration by engine
      engine.registerSemanticToken(semanticToken);

      // Pipeline validates already-registered tokens
      const results = await pipeline.validate();

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.token === 'space.normal')).toBe(true);
    });

    it('should validate multiple semantic tokens', async () => {
      const semanticTokens: SemanticToken[] = [
        {
          name: 'space.tight',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Tight spacing',
          description: 'Compact layouts'
        },
        {
          name: 'space.normal',
          primitiveReferences: { default: 'space100' },
          category: SemanticCategory.SPACING,
          context: 'Normal spacing',
          description: 'Standard layouts'
        }
      ];

      // Tokens are validated before registration by engine
      engine.registerSemanticTokens(semanticTokens);

      // Pipeline validates already-registered tokens
      const results = await pipeline.validate();

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.token === 'space.tight')).toBe(true);
      expect(results.some(r => r.token === 'space.normal')).toBe(true);
    });
  });

  describe('Pipeline Stage Results', () => {
    beforeEach(() => {
      pipeline.initialize();

      // Register test tokens
      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
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

      engine.registerSemanticToken(semanticToken);
    });

    it('should provide stage results', async () => {
      await pipeline.validate();

      const stageResults = pipeline.getStageResults();

      expect(stageResults.length).toBeGreaterThan(0);
      expect(stageResults.some(s => s.stage === 'Primitive Token Validation')).toBe(true);
      expect(stageResults.some(s => s.stage === 'Semantic Token Validation')).toBe(true);
    });

    it('should provide validation summary', async () => {
      await pipeline.validate();

      const summary = pipeline.getSummary();

      expect(summary.totalStages).toBeGreaterThan(0);
      expect(summary.passedStages).toBeGreaterThanOrEqual(0);
      expect(summary.failedStages).toBeGreaterThanOrEqual(0);
      expect(summary.totalErrors).toBeGreaterThanOrEqual(0);
      expect(summary.totalWarnings).toBeGreaterThanOrEqual(0);
      // Tokens may have Pass or Warning results, both are valid
      expect(summary.totalPasses + summary.totalWarnings).toBeGreaterThan(0);
    });

    it('should check if pipeline passed', async () => {
      await pipeline.validate();

      const passed = pipeline.isPassed();

      expect(typeof passed).toBe('boolean');
    });

    it('should get failed stages', async () => {
      await pipeline.validate();

      const failedStages = pipeline.getFailedStages();

      expect(Array.isArray(failedStages)).toBe(true);
    });
  });

  describe('Validation Configuration', () => {
    beforeEach(() => {
      pipeline.initialize();

      const primitiveToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
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

    it('should validate with strict mathematics', async () => {
      const results = await pipeline.validate({
        strictMathematics: true
      });

      expect(results.length).toBeGreaterThan(0);
    });

    it('should validate with cross-platform consistency', async () => {
      const results = await pipeline.validate({
        requireCrossPlatformConsistency: true
      });

      expect(results.length).toBeGreaterThan(0);
    });

    it('should validate with reference integrity', async () => {
      const results = await pipeline.validate({
        validateReferences: true
      });

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Before Registration Pattern', () => {
    beforeEach(() => {
      pipeline.initialize();
    });

    it('should demonstrate that tokens are validated before registration', async () => {
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

      // Attempt to register invalid token
      // Engine validates before registration and prevents registration on error
      const registrationResult = engine.registerPrimitiveToken(invalidToken);

      // Registration should fail
      expect(registrationResult.level).toBe('Error');

      // Token should NOT be in registry
      expect(engine.getPrimitiveToken('space999')).toBeUndefined();

      // Pipeline validation should not find the invalid token
      // because it was never registered
      const pipelineResults = await pipeline.validate();

      // Invalid token should not appear in pipeline results
      expect(pipelineResults.some(r => r.token === 'space999')).toBe(false);
    });

    it('should demonstrate that valid tokens are registered after validation', async () => {
      // Create a valid token
      const validToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      // Register valid token
      // Engine validates before registration and allows registration on pass
      const registrationResult = engine.registerPrimitiveToken(validToken);

      // Registration should succeed (Pass or Warning both allow registration)
      expect(['Pass', 'Warning']).toContain(registrationResult.level);

      // Token should be in registry
      expect(engine.getPrimitiveToken('space100')).toBeDefined();

      // Pipeline validation should find the valid token
      const pipelineResults = await pipeline.validate();

      // Valid token should appear in pipeline results
      expect(pipelineResults.some(r => r.token === 'space100')).toBe(true);
    });
  });
});
