/**
 * ValidationCoordinator Tests
 * 
 * Tests for ValidationCoordinator to ensure it validates tokens without registering them.
 */

import { ValidationCoordinator } from '../ValidationCoordinator';
import { ThreeTierValidator } from '../../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import type { PrimitiveToken, SemanticToken } from '../../types';
import { TokenCategory, SemanticCategory } from '../../types';

// Helper functions to create test tokens
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

const createSpacingToken = (name: string, value: number): PrimitiveToken =>
  createMockToken({
    name,
    category: TokenCategory.SPACING,
    baseValue: value,
    baselineGridAlignment: value % 8 === 0,
    platforms: {
      web: { value, unit: 'px' },
      ios: { value, unit: 'pt' },
      android: { value, unit: 'dp' }
    }
  });

const createSemanticToken = (name: string, primitiveRef: string): SemanticToken => ({
  name,
  category: SemanticCategory.SPACING,
  description: 'Test semantic token',
  context: 'test',
  primitiveReferences: {
    value: primitiveRef
  }
});

describe('ValidationCoordinator', () => {
  let coordinator: ValidationCoordinator;
  let validator: ThreeTierValidator;
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    validator = new ThreeTierValidator();
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
    
    coordinator = new ValidationCoordinator(
      validator,
      primitiveRegistry,
      semanticRegistry,
      {
        strategicFlexibilityThreshold: 0.8,
        primitiveUsageThreshold: 0.2,
        enableUsageTracking: true
      }
    );
  });

  describe('validateToken', () => {
    it('should validate a primitive token without registering it', () => {
      const token = createSpacingToken('space100', 8);

      // Validate the token
      const result = coordinator.validateToken(token);

      // Validation should return a result
      expect(result).toBeDefined();
      expect(result.token).toBe('space100');
      expect(result.level).toBeDefined();

      // Token should NOT be registered in the registry
      expect(primitiveRegistry.has('space100')).toBe(false);
    });

    it('should validate a semantic token without registering it', () => {
      // First register a primitive token that the semantic token will reference
      const primitiveToken = createSpacingToken('space100', 8);
      primitiveRegistry.register(primitiveToken, { skipValidation: true });

      const semanticToken = createSemanticToken('space.small', 'space100');

      // Validate the semantic token
      const result = coordinator.validateToken(semanticToken);

      // Validation should return a result
      expect(result).toBeDefined();
      expect(result.token).toBe('space.small');
      expect(result.level).toBeDefined();

      // Semantic token should NOT be registered in the registry
      expect(semanticRegistry.has('space.small')).toBe(false);
    });
  });

  describe('validateAllTokens', () => {
    it('should validate all registered tokens', () => {
      // Register some tokens first
      const primitive1 = createSpacingToken('space100', 8);
      const primitive2 = createSpacingToken('space200', 16);

      primitiveRegistry.register(primitive1, { skipValidation: true });
      primitiveRegistry.register(primitive2, { skipValidation: true });

      // Validate all tokens
      const results = coordinator.validateAllTokens();

      // Should return validation results for all registered tokens
      expect(results).toHaveLength(2);
      expect(results[0].token).toBe('space100');
      expect(results[1].token).toBe('space200');
    });
  });

  describe('validatePrimitiveTokens', () => {
    it('should validate only primitive tokens', () => {
      // Register primitive and semantic tokens
      const primitiveToken = createSpacingToken('space100', 8);
      const semanticToken = createSemanticToken('space.small', 'space100');

      primitiveRegistry.register(primitiveToken, { skipValidation: true });
      semanticRegistry.register(semanticToken, { skipValidation: true });

      // Validate only primitive tokens
      const results = coordinator.validatePrimitiveTokens();

      // Should return validation results only for primitive tokens
      expect(results).toHaveLength(1);
      expect(results[0].token).toBe('space100');
    });
  });

  describe('validateSemanticTokens', () => {
    it('should validate only semantic tokens', () => {
      // Register primitive and semantic tokens
      const primitiveToken = createSpacingToken('space100', 8);
      const semanticToken = createSemanticToken('space.small', 'space100');

      primitiveRegistry.register(primitiveToken, { skipValidation: true });
      semanticRegistry.register(semanticToken, { skipValidation: true });

      // Validate only semantic tokens
      const results = coordinator.validateSemanticTokens();

      // Should return validation results only for semantic tokens
      expect(results).toHaveLength(1);
      expect(results[0].token).toBe('space.small');
    });
  });
});
