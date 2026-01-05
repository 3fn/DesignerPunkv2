/**
 * @category evergreen
 * @purpose Verify component token validation meets Requirements 3.1-3.6
 * 
 * Component Token Validation Tests
 * 
 * Tests for component token validation including:
 * - Primitive reference validation (Requirement 3.5)
 * - Reasoning requirement validation (Requirement 3.4)
 * - Family-aware value validation (Requirements 3.2, 3.3)
 * - Actionable error messages (Requirement 3.6)
 * 
 * @see Requirements 3.1-3.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */

import { ValidationCoordinator, validateFamilyConformance } from '../ValidationCoordinator';
import { ThreeTierValidator } from '../../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { ComponentTokenRegistry, RegisteredComponentToken } from '../../registries/ComponentTokenRegistry';
import type { PrimitiveToken } from '../../types';
import { TokenCategory } from '../../types';
import { SPACING_BASE_VALUE } from '../../tokens/SpacingTokens';
import { RADIUS_BASE_VALUE } from '../../tokens/RadiusTokens';

// Helper function to create test primitive tokens
const createPrimitiveToken = (name: string, category: TokenCategory, value: number): PrimitiveToken => ({
  name,
  category,
  baseValue: value,
  familyBaseValue: category === TokenCategory.SPACING ? SPACING_BASE_VALUE : RADIUS_BASE_VALUE,
  description: `Test ${name} token`,
  mathematicalRelationship: `base × ${value / (category === TokenCategory.SPACING ? SPACING_BASE_VALUE : RADIUS_BASE_VALUE)} = ${value}`,
  baselineGridAlignment: value % 8 === 0,
  isStrategicFlexibility: false,
  isPrecisionTargeted: false,
  platforms: {
    web: { value, unit: 'px' },
    ios: { value, unit: 'pt' },
    android: { value, unit: 'dp' }
  }
});

describe('ComponentTokenValidation', () => {
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

    // Clear the ComponentTokenRegistry before each test
    ComponentTokenRegistry.clear();
  });

  // ==========================================================================
  // Requirement 3.5: Primitive Reference Validation
  // ==========================================================================

  describe('Primitive Reference Validation (Requirement 3.5)', () => {
    it('should pass validation for valid primitive reference', () => {
      // Register a primitive token first
      const primitiveToken = createPrimitiveToken('space100', TokenCategory.SPACING, 8);
      primitiveRegistry.register(primitiveToken, { skipValidation: true });

      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'Standard button padding for touch targets',
        primitiveReference: 'space100',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid primitive reference with descriptive error', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
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
      expect(result.errors[0]).toContain('button.padding');
      // Verify actionable guidance (Requirement 3.6)
      expect(result.errors[0]).toContain('Ensure the primitive token is registered');
    });

    it('should validate multiple primitive references correctly', () => {
      // Register primitive tokens
      const space100 = createPrimitiveToken('space100', TokenCategory.SPACING, 8);
      const space200 = createPrimitiveToken('space200', TokenCategory.SPACING, 16);
      primitiveRegistry.register(space100, { skipValidation: true });
      primitiveRegistry.register(space200, { skipValidation: true });

      const validToken: RegisteredComponentToken = {
        name: 'button.padding.small',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'Small button padding',
        primitiveReference: 'space100',
      };

      const invalidToken: RegisteredComponentToken = {
        name: 'button.padding.large',
        component: 'Button',
        family: 'spacing',
        value: 24,
        reasoning: 'Large button padding',
        primitiveReference: 'space300', // Does not exist
      };

      expect(coordinator.validateComponentToken(validToken).valid).toBe(true);
      expect(coordinator.validateComponentToken(invalidToken).valid).toBe(false);
    });
  });

  // ==========================================================================
  // Requirement 3.4: Reasoning Requirement Validation
  // ==========================================================================

  describe('Reasoning Requirement Validation (Requirement 3.4)', () => {
    it('should fail validation when reasoning is missing (empty string)', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: '',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('missing required reasoning');
      expect(result.errors[0]).toContain('button.padding');
      // Verify actionable guidance (Requirement 3.6)
      expect(result.errors[0]).toContain('Add a reasoning string');
    });

    it('should fail validation when reasoning is only whitespace', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: '   \t\n  ',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('missing required reasoning');
    });

    it('should pass validation when reasoning is provided', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'Standard button padding for touch targets',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept minimal but valid reasoning', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'x', // Minimal but valid
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
    });
  });

  // ==========================================================================
  // Requirements 3.2, 3.3: Family-Aware Value Validation
  // ==========================================================================

  describe('Spacing Family Validation (Requirements 3.2, 3.3)', () => {
    it('should pass validation for valid spacing value derivable from SPACING_BASE_VALUE', () => {
      // Valid spacing values: SPACING_BASE_VALUE * multiplier where multiplier is 0.25 increments
      const validValues = [
        { value: 0, multiplier: 0 },
        { value: 2, multiplier: 0.25 },
        { value: 4, multiplier: 0.5 },
        { value: 6, multiplier: 0.75 },
        { value: 8, multiplier: 1 },
        { value: 10, multiplier: 1.25 },
        { value: 12, multiplier: 1.5 },
        { value: 16, multiplier: 2 },
        { value: 24, multiplier: 3 },
        { value: 32, multiplier: 4 },
      ];

      for (const { value, multiplier } of validValues) {
        const token: RegisteredComponentToken = {
          name: `button.spacing.${multiplier}`,
          component: 'Button',
          family: 'spacing',
          value,
          reasoning: `Spacing value at ${multiplier}x base`,
        };

        const result = coordinator.validateComponentToken(token);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should fail validation for invalid spacing value (magic number) with descriptive error', () => {
      // Invalid values: not derivable from SPACING_BASE_VALUE with 0.25 increment multipliers
      const invalidValues = [3, 5, 7, 9, 11, 13, 15, 17, 19];

      for (const value of invalidValues) {
        const token: RegisteredComponentToken = {
          name: `button.spacing.invalid`,
          component: 'Button',
          family: 'spacing',
          value,
          reasoning: 'Invalid spacing value',
        };

        const result = coordinator.validateComponentToken(token);
        
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('does not conform to spacing family pattern');
        expect(result.errors[0]).toContain('SPACING_BASE_VALUE');
        // Verify actionable guidance (Requirement 3.6)
        expect(result.errors[0]).toContain('Use SPACING_BASE_VALUE * multiplier');
      }
    });
  });

  describe('Radius Family Validation (Requirements 3.2, 3.3)', () => {
    it('should pass validation for valid radius value', () => {
      const validValues = [0, 2, 4, 6, 8, 12, 16, 24, 32];

      for (const value of validValues) {
        const token: RegisteredComponentToken = {
          name: `button.radius.${value}`,
          component: 'Button',
          family: 'radius',
          value,
          reasoning: `Radius value ${value}`,
        };

        const result = coordinator.validateComponentToken(token);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should fail validation for invalid radius value', () => {
      const invalidValues = [3, 5, 7, 9, 11, 13, 15, 17];

      for (const value of invalidValues) {
        const token: RegisteredComponentToken = {
          name: `button.radius.invalid`,
          component: 'Button',
          family: 'radius',
          value,
          reasoning: 'Invalid radius value',
        };

        const result = coordinator.validateComponentToken(token);
        
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('does not conform to radius family pattern');
        expect(result.errors[0]).toContain('RADIUS_BASE_VALUE');
      }
    });

    it('should pass validation for pill radius (9999)', () => {
      const token: RegisteredComponentToken = {
        name: 'button.radius.pill',
        component: 'Button',
        family: 'radius',
        value: 9999,
        reasoning: 'Pill-shaped button',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for negative radius value', () => {
      const token: RegisteredComponentToken = {
        name: 'button.radius.negative',
        component: 'Button',
        family: 'radius',
        value: -4,
        reasoning: 'Negative radius',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('non-negative');
    });
  });

  describe('Color Family Validation (Requirements 3.2, 3.3)', () => {
    it('should reject custom numeric values for color family', () => {
      const token: RegisteredComponentToken = {
        name: 'button.color.primary',
        component: 'Button',
        family: 'color',
        value: 255,
        reasoning: 'Custom color value',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Color family does not support custom numeric values');
      expect(result.errors[0]).toContain('Use a reference to an existing color primitive');
    });

    it('should reject any numeric value for color family', () => {
      const colorValues = [0, 128, 255, 0xFF0000, 16777215];

      for (const value of colorValues) {
        const token: RegisteredComponentToken = {
          name: 'button.color.test',
          component: 'Button',
          family: 'color',
          value,
          reasoning: 'Color value',
        };

        const result = coordinator.validateComponentToken(token);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Color family does not support custom numeric values');
      }
    });
  });

  describe('Unknown Family Validation (Requirements 3.2, 3.3)', () => {
    it('should allow unknown family with warning', () => {
      const token: RegisteredComponentToken = {
        name: 'button.custom.value',
        component: 'Button',
        family: 'unknown-family',
        value: 42,
        reasoning: 'Custom value for unknown family',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('does not have specific validation rules');
      expect(result.warnings[0]).toContain('unknown-family');
    });

    it('should suggest adding validation or using primitive reference for unknown family', () => {
      const token: RegisteredComponentToken = {
        name: 'button.custom.value',
        component: 'Button',
        family: 'new-family',
        value: 100,
        reasoning: 'Custom value',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.warnings[0]).toContain('Consider adding validation');
    });
  });

  // ==========================================================================
  // Warning for Matching Existing Primitive
  // ==========================================================================

  describe('Warning for Matching Existing Primitive', () => {
    it('should return warning when spacing value matches existing primitive', () => {
      // Register a primitive token
      const primitiveToken = createPrimitiveToken('space150', TokenCategory.SPACING, 12);
      primitiveRegistry.register(primitiveToken, { skipValidation: true });

      const token: RegisteredComponentToken = {
        name: 'button.padding.medium',
        component: 'Button',
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
      expect(result.warnings[0]).toContain('Consider using a reference');
    });

    it('should return warning when radius value matches existing primitive', () => {
      // Register a radius primitive token
      const primitiveToken = createPrimitiveToken('radius200', TokenCategory.RADIUS, 16);
      primitiveRegistry.register(primitiveToken, { skipValidation: true });

      const token: RegisteredComponentToken = {
        name: 'button.radius.medium',
        component: 'Button',
        family: 'radius',
        value: 16, // Matches radius200
        reasoning: 'Custom radius that happens to match a primitive',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('matches existing primitive');
      expect(result.warnings[0]).toContain('radius200');
    });

    it('should not return warning when value does not match any primitive', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding.custom',
        component: 'Button',
        family: 'spacing',
        value: 20, // Valid but no matching primitive
        reasoning: 'Custom spacing value',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  // ==========================================================================
  // Requirement 3.6: Actionable Error Messages
  // ==========================================================================

  describe('Actionable Error Messages (Requirement 3.6)', () => {
    it('should provide actionable guidance for missing reasoning', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: '',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.errors[0]).toContain('Add a reasoning string');
      expect(result.errors[0]).toContain('explaining why this token exists');
    });

    it('should provide actionable guidance for invalid primitive reference', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'Valid reasoning',
        primitiveReference: 'invalid-ref',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.errors[0]).toContain('Ensure the primitive token is registered');
      expect(result.errors[0]).toContain('PrimitiveTokenRegistry');
    });

    it('should provide actionable guidance for invalid spacing value', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 13, // Invalid
        reasoning: 'Valid reasoning',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.errors[0]).toContain('Use SPACING_BASE_VALUE * multiplier');
      expect(result.errors[0]).toContain(`${SPACING_BASE_VALUE}`);
    });

    it('should provide actionable guidance for color family', () => {
      const token: RegisteredComponentToken = {
        name: 'button.color',
        component: 'Button',
        family: 'color',
        value: 255,
        reasoning: 'Valid reasoning',
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.errors[0]).toContain('Use a reference to an existing color primitive');
    });
  });

  // ==========================================================================
  // Multiple Validation Errors
  // ==========================================================================

  describe('Multiple Validation Errors', () => {
    it('should collect all errors when multiple validations fail', () => {
      const token: RegisteredComponentToken = {
        name: 'button.padding',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: '', // Missing reasoning
        primitiveReference: 'non-existent', // Invalid reference
      };

      const result = coordinator.validateComponentToken(token);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.some(e => e.includes('missing required reasoning'))).toBe(true);
      expect(result.errors.some(e => e.includes('non-existent primitive'))).toBe(true);
    });
  });

  // ==========================================================================
  // validateAllComponentTokens Tests
  // ==========================================================================

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
        name: 'button.padding.small',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: 'Small button padding',
      });
      ComponentTokenRegistry.register({
        name: 'button.padding.medium',
        component: 'Button',
        family: 'spacing',
        value: 12,
        reasoning: 'Medium button padding',
      });

      const result = coordinator.validateAllComponentTokens();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect errors from all invalid tokens', () => {
      // Register tokens with validation issues
      ComponentTokenRegistry.register({
        name: 'button.padding.a',
        component: 'Button',
        family: 'spacing',
        value: 8,
        reasoning: '', // Missing reasoning
      });
      ComponentTokenRegistry.register({
        name: 'card.padding.b',
        component: 'Card',
        family: 'spacing',
        value: 8,
        reasoning: '', // Missing reasoning
      });

      const result = coordinator.validateAllComponentTokens();

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.some(e => e.includes('button.padding.a'))).toBe(true);
      expect(result.errors.some(e => e.includes('card.padding.b'))).toBe(true);
    });

    it('should collect warnings from all tokens', () => {
      // Register tokens that will generate warnings
      ComponentTokenRegistry.register({
        name: 'button.custom.a',
        component: 'Button',
        family: 'unknown-family-a',
        value: 10,
        reasoning: 'Custom value',
      });
      ComponentTokenRegistry.register({
        name: 'card.custom.b',
        component: 'Card',
        family: 'unknown-family-b',
        value: 20,
        reasoning: 'Custom value',
      });

      const result = coordinator.validateAllComponentTokens();

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(2);
    });
  });
});

// ==========================================================================
// validateFamilyConformance Direct Tests
// ==========================================================================

// ==========================================================================
// NFR 3: Performance Tests
// ==========================================================================

/**
 * @category evergreen
 * @purpose Verify component token validation meets NFR 3 performance requirement
 * 
 * NFR 3.2: Validation SHALL complete in under 1 second for typical component counts
 * 
 * @see NFR 3.2 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */
describe('Component Token Validation Performance (NFR 3)', () => {
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

    // Clear the ComponentTokenRegistry before each test
    ComponentTokenRegistry.clear();
  });

  /**
   * Helper function to generate mock component tokens for performance testing
   * 
   * Generates tokens across multiple components and families to simulate
   * realistic usage patterns.
   */
  function generateMockComponentTokens(count: number): RegisteredComponentToken[] {
    const tokens: RegisteredComponentToken[] = [];
    const components = ['Button', 'Card', 'Input', 'Modal', 'Dropdown', 'Tooltip', 'Badge', 'Avatar', 'Chip', 'Tab'];
    const families = ['spacing', 'radius', 'fontSize'];
    const validSpacingValues = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];
    const validRadiusValues = [0, 2, 4, 6, 8, 12, 16, 24, 32, 9999];
    const validFontSizeValues = [16, 18, 20, 23, 26, 29, 32];

    for (let i = 0; i < count; i++) {
      const component = components[i % components.length];
      const family = families[i % families.length];
      
      let value: number;
      switch (family) {
        case 'spacing':
          value = validSpacingValues[i % validSpacingValues.length];
          break;
        case 'radius':
          value = validRadiusValues[i % validRadiusValues.length];
          break;
        case 'fontSize':
          value = validFontSizeValues[i % validFontSizeValues.length];
          break;
        default:
          value = 8;
      }

      tokens.push({
        name: `${component.toLowerCase()}.${family}.token${i}`,
        component,
        family,
        value,
        reasoning: `Performance test token ${i} for ${component} ${family}`,
      });
    }

    return tokens;
  }

  it('should validate 50 component tokens in under 1 second (NFR 3.2)', () => {
    // Setup: Register 50 component tokens (typical upper bound per NFR 3.2)
    const tokens = generateMockComponentTokens(50);
    tokens.forEach(token => ComponentTokenRegistry.register(token));

    // Verify tokens are registered
    expect(ComponentTokenRegistry.getAll()).toHaveLength(50);

    // Measure validation time
    const startTime = performance.now();
    const result = coordinator.validateAllComponentTokens();
    const endTime = performance.now();

    const duration = endTime - startTime;

    // NFR 3.2: validation SHALL complete in under 1 second
    expect(duration).toBeLessThan(1000);

    // Verify validation actually ran (all tokens should be valid)
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate individual component tokens efficiently', () => {
    // Test single token validation performance
    const token: RegisteredComponentToken = {
      name: 'button.padding.test',
      component: 'Button',
      family: 'spacing',
      value: 8,
      reasoning: 'Performance test token',
    };

    // Measure validation time for single token
    const startTime = performance.now();
    const result = coordinator.validateComponentToken(token);
    const endTime = performance.now();

    const duration = endTime - startTime;

    // Single token validation should be very fast (< 10ms)
    expect(duration).toBeLessThan(10);
    expect(result.valid).toBe(true);
  });

  it('should scale linearly with token count', () => {
    // Test that validation time scales reasonably with token count
    const smallBatch = generateMockComponentTokens(10);
    const largeBatch = generateMockComponentTokens(50);

    // Register and validate small batch
    smallBatch.forEach(token => ComponentTokenRegistry.register(token));
    const smallStartTime = performance.now();
    coordinator.validateAllComponentTokens();
    const smallDuration = performance.now() - smallStartTime;

    // Clear and register large batch
    ComponentTokenRegistry.clear();
    largeBatch.forEach(token => ComponentTokenRegistry.register(token));
    const largeStartTime = performance.now();
    coordinator.validateAllComponentTokens();
    const largeDuration = performance.now() - largeStartTime;

    // Large batch (5x tokens) should not take more than 10x the time
    // This ensures roughly linear scaling with reasonable overhead
    expect(largeDuration).toBeLessThan(smallDuration * 10);
  });
});

describe('validateFamilyConformance', () => {
  let primitiveRegistry: PrimitiveTokenRegistry;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
  });

  describe('spacing family', () => {
    it('should pass for valid spacing values (0.25 increment multipliers)', () => {
      const validValues = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64];
      
      for (const value of validValues) {
        const result = validateFamilyConformance('spacing', value, primitiveRegistry);
        expect(result.valid).toBe(true);
      }
    });

    it('should fail for invalid spacing values', () => {
      const invalidValues = [3, 5, 7, 9, 11, 13, 15, 17, 19];
      
      for (const value of invalidValues) {
        const result = validateFamilyConformance('spacing', value, primitiveRegistry);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('SPACING_BASE_VALUE');
      }
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
      }
    });

    it('should fail for negative radius', () => {
      const result = validateFamilyConformance('radius', -4, primitiveRegistry);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('non-negative');
    });
  });

  describe('fontSize family', () => {
    it('should pass for values on the modular scale', () => {
      // Base 16 with 1.125 ratio, with 0.5px tolerance
      const validValues = [16, 18, 20, 23, 26, 29, 32];
      
      for (const value of validValues) {
        const result = validateFamilyConformance('fontSize', value, primitiveRegistry);
        expect(result.valid).toBe(true);
      }
    });

    it('should fail for values not on the modular scale', () => {
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
    it('should pass with warning', () => {
      const result = validateFamilyConformance('unknown-family', 42, primitiveRegistry);
      expect(result.valid).toBe(true);
      expect(result.warning).toContain('does not have specific validation rules');
    });
  });
});
