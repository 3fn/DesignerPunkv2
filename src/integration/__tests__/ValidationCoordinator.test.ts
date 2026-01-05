/**
 * @category evergreen
 * @purpose Verify validation coordinator integrates validation systems correctly
 */
/**
 * ValidationCoordinator Tests
 * 
 * Tests for ValidationCoordinator to ensure it validates tokens without registering them.
 * Also tests component token validation including family-aware value validation.
 */

import { ValidationCoordinator, validateFamilyConformance } from '../ValidationCoordinator';
import { ThreeTierValidator } from '../../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { ComponentTokenRegistry, RegisteredComponentToken } from '../../registries/ComponentTokenRegistry';
import type { PrimitiveToken, SemanticToken } from '../../types';
import { TokenCategory, SemanticCategory } from '../../types';
import { SPACING_BASE_VALUE } from '../../tokens/SpacingTokens';
import { RADIUS_BASE_VALUE } from '../../tokens/RadiusTokens';

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

  // ============================================================================
  // Component Token Validation Tests
  // ============================================================================

  describe('Component Token Validation', () => {
    beforeEach(() => {
      // Clear the ComponentTokenRegistry before each test
      ComponentTokenRegistry.clear();
    });

    describe('validateComponentToken', () => {
      it('should pass validation for a valid component token with reasoning and primitive reference', () => {
        // Register a primitive token first
        const primitiveToken = createSpacingToken('space100', 8);
        primitiveRegistry.register(primitiveToken, { skipValidation: true });

        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: 'Standard button padding for touch targets',
          primitiveReference: 'space100',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it('should fail validation when reasoning is missing', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: '',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('missing required reasoning');
      });

      it('should fail validation when reasoning is only whitespace', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: '   ',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('missing required reasoning');
      });

      it('should fail validation when primitive reference does not exist', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: 'Standard button padding',
          primitiveReference: 'non-existent-primitive',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('non-existent primitive');
        expect(result.errors[0]).toContain('non-existent-primitive');
      });

      it('should pass validation when primitive reference exists', () => {
        // Register a primitive token first
        const primitiveToken = createSpacingToken('space100', 8);
        primitiveRegistry.register(primitiveToken, { skipValidation: true });

        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: 'Standard button padding',
          primitiveReference: 'space100',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should collect multiple errors when multiple validations fail', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: '',
          primitiveReference: 'non-existent-primitive',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(2);
        expect(result.errors.some(e => e.includes('missing required reasoning'))).toBe(true);
        expect(result.errors.some(e => e.includes('non-existent primitive'))).toBe(true);
      });

      // Family-aware validation tests (Task 3.2)
      it('should pass validation for valid spacing value without primitive reference', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: SPACING_BASE_VALUE * 1.5, // 12 - valid multiplier
          reasoning: 'Custom spacing for unique layout requirement',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should fail validation for invalid spacing value (magic number)', () => {
        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 13, // Not derivable from SPACING_BASE_VALUE (8) - 13/8 = 1.625, not a 0.25 increment
          reasoning: 'Custom spacing',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('does not conform to spacing family pattern');
        expect(result.errors[0]).toContain('SPACING_BASE_VALUE');
      });

      it('should pass validation for valid radius value', () => {
        const token: RegisteredComponentToken = {
          name: 'button-radius',
          component: 'button',
          family: 'radius',
          value: RADIUS_BASE_VALUE * 2, // 16 - valid multiplier
          reasoning: 'Custom radius for rounded buttons',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should fail validation for invalid radius value', () => {
        const token: RegisteredComponentToken = {
          name: 'button-radius',
          component: 'button',
          family: 'radius',
          value: 7, // Not derivable from RADIUS_BASE_VALUE (8)
          reasoning: 'Custom radius',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('does not conform to radius family pattern');
        expect(result.errors[0]).toContain('RADIUS_BASE_VALUE');
      });

      it('should pass validation for pill radius (9999)', () => {
        const token: RegisteredComponentToken = {
          name: 'button-radius-pill',
          component: 'button',
          family: 'radius',
          value: 9999,
          reasoning: 'Pill-shaped button',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should fail validation for color family with custom numeric value', () => {
        const token: RegisteredComponentToken = {
          name: 'button-color',
          component: 'button',
          family: 'color',
          value: 255,
          reasoning: 'Custom color',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('Color family does not support custom numeric values');
      });

      it('should pass validation for unknown family with warning', () => {
        const token: RegisteredComponentToken = {
          name: 'button-custom',
          component: 'button',
          family: 'unknown-family',
          value: 42,
          reasoning: 'Custom value for unknown family',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]).toContain('does not have specific validation rules');
      });

      it('should return warning when value matches existing primitive', () => {
        // Register a primitive token first
        const primitiveToken = createSpacingToken('space150', 12);
        primitiveRegistry.register(primitiveToken, { skipValidation: true });

        const token: RegisteredComponentToken = {
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 12, // Matches space150
          reasoning: 'Custom spacing that happens to match a primitive',
        };

        const result = coordinator.validateComponentToken(token);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]).toContain('matches existing primitive');
        expect(result.warnings[0]).toContain('space150');
      });
    });

    describe('validateAllComponentTokens', () => {
      it('should return valid result when no tokens are registered', () => {
        const result = coordinator.validateAllComponentTokens();

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it('should validate all registered component tokens', () => {
        // Register valid tokens
        ComponentTokenRegistry.register({
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: 'Standard button padding',
        });
        ComponentTokenRegistry.register({
          name: 'button-margin',
          component: 'button',
          family: 'spacing',
          value: 4,
          reasoning: 'Standard button margin',
        });

        const result = coordinator.validateAllComponentTokens();

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should collect errors from all invalid tokens', () => {
        // Register tokens with validation issues
        ComponentTokenRegistry.register({
          name: 'button-padding',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: '', // Missing reasoning
        });
        ComponentTokenRegistry.register({
          name: 'button-margin',
          component: 'button',
          family: 'spacing',
          value: 8,
          reasoning: '', // Missing reasoning
        });

        const result = coordinator.validateAllComponentTokens();

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(2);
        expect(result.errors.some(e => e.includes('button-padding'))).toBe(true);
        expect(result.errors.some(e => e.includes('button-margin'))).toBe(true);
      });
    });
  });

  // ============================================================================
  // validateFamilyConformance Tests
  // ============================================================================

  describe('validateFamilyConformance', () => {
    describe('spacing family', () => {
      it('should pass for valid spacing values (multiples of base)', () => {
        // Valid multipliers: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, etc.
        const validValues = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64];
        
        for (const value of validValues) {
          const result = validateFamilyConformance('spacing', value, primitiveRegistry);
          expect(result.valid).toBe(true);
        }
      });

      it('should fail for invalid spacing values (magic numbers)', () => {
        // Invalid values that don't follow the formula (not 0.25 increments of base 8)
        // 3/8=0.375, 5/8=0.625, 7/8=0.875, 9/8=1.125, 11/8=1.375, 13/8=1.625, etc.
        const invalidValues = [3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        for (const value of invalidValues) {
          const result = validateFamilyConformance('spacing', value, primitiveRegistry);
          expect(result.valid).toBe(false);
          expect(result.message).toContain('SPACING_BASE_VALUE');
        }
      });

      it('should return warning when value matches existing primitive', () => {
        // Register a primitive token
        const primitiveToken = createSpacingToken('space100', 8);
        primitiveRegistry.register(primitiveToken, { skipValidation: true });

        const result = validateFamilyConformance('spacing', 8, primitiveRegistry);

        expect(result.valid).toBe(true);
        expect(result.warning).toContain('matches existing primitive');
        expect(result.warning).toContain('space100');
      });
    });

    describe('radius family', () => {
      it('should pass for valid radius values', () => {
        const validValues = [0, 2, 4, 6, 8, 12, 16, 24, 32, 9999];
        
        for (const value of validValues) {
          const result = validateFamilyConformance('radius', value, primitiveRegistry);
          expect(result.valid).toBe(true);
        }
      });

      it('should fail for invalid radius values', () => {
        const invalidValues = [3, 5, 7, 9, 11, 13, 15, 17];
        
        for (const value of invalidValues) {
          const result = validateFamilyConformance('radius', value, primitiveRegistry);
          expect(result.valid).toBe(false);
          expect(result.message).toContain('RADIUS_BASE_VALUE');
        }
      });

      it('should fail for negative radius values', () => {
        const result = validateFamilyConformance('radius', -4, primitiveRegistry);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('non-negative');
      });

      it('should pass for pill radius (9999)', () => {
        const result = validateFamilyConformance('radius', 9999, primitiveRegistry);
        expect(result.valid).toBe(true);
      });
    });

    describe('fontSize family', () => {
      it('should pass for values on the modular scale', () => {
        // Base 16 with 1.125 ratio
        // Step 0: 16, Step 1: 18, Step 2: 20.25, Step 3: 22.78, Step 4: 25.63, Step 5: 28.83, Step 6: 32.44
        // With 0.5px tolerance, these should pass
        const validValues = [16, 18, 20, 23, 26, 29, 32];
        
        for (const value of validValues) {
          const result = validateFamilyConformance('fontSize', value, primitiveRegistry);
          expect(result.valid).toBe(true);
        }
      });

      it('should fail for values not on the modular scale', () => {
        // 17 is between 16 and 18, not on the scale
        const result = validateFamilyConformance('fontSize', 17, primitiveRegistry);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('modular scale');
      });

      it('should fail for non-positive values', () => {
        const result = validateFamilyConformance('fontSize', 0, primitiveRegistry);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('positive');
      });
    });

    describe('color family', () => {
      it('should fail for any numeric value', () => {
        const result = validateFamilyConformance('color', 255, primitiveRegistry);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('does not support custom numeric values');
      });
    });

    describe('unknown family', () => {
      it('should pass with warning for unknown families', () => {
        const result = validateFamilyConformance('unknown-family', 42, primitiveRegistry);
        expect(result.valid).toBe(true);
        expect(result.warning).toContain('does not have specific validation rules');
      });
    });
  });
});
