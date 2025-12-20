/**
 * @category evergreen
 * @purpose Verify improved-test-example functionality works correctly
 */
/**
 * Example of improved test using fixtures
 * 
 * This demonstrates how tests should be written to avoid hard-coded values
 * and maintain flexibility when design system constants change.
 */

import { ThreeTierValidator, type ThreeTierValidationContext } from '../../validators/ThreeTierValidator';
import { TokenBuilder, TEST_CONSTANTS, isBaselineGridAligned } from '../fixtures/tokenFixtures';

describe('ThreeTierValidator (Improved)', () => {
  let validator: ThreeTierValidator;

  beforeEach(() => {
    validator = new ThreeTierValidator();
  });

  describe('Pass-level validation', () => {
    it('should validate primitive token with correct mathematical foundation', () => {
      // Use fixture instead of hard-coded values
      const token = TokenBuilder.createBaseSpacingToken();

      const context: ThreeTierValidationContext = {
        token,
        options: {
          enabledLevels: ['Pass', 'Warning', 'Error']
        }
      };

      const result = validator.validate(context);

      expect(result.primaryResult.level).toBe('Pass');
      expect(result.primaryResult.token).toBe('space100');
      expect(result.summary.level).toBe('Pass');
    });

    it('should validate strategic flexibility token as Pass', () => {
      // Fixture automatically uses correct SF value
      const token = TokenBuilder.createStrategicFlexibilityToken();

      const context: ThreeTierValidationContext = {
        token
      };

      const result = validator.validate(context);

      expect(result.primaryResult.level).toBe('Pass');
      expect(result.primaryResult.message).toContain('Strategic flexibility');
    });
  });

  describe('Error-level validation', () => {
    it('should error on baseline grid violation', () => {
      // Fixture creates invalid token based on current grid unit
      // Uses a value that is NOT strategic flexibility and NOT grid-aligned
      const token = TokenBuilder.createInvalidSpacingToken();

      // Verify our test assumptions
      expect(isBaselineGridAligned(token.baseValue)).toBe(false);
      expect(token.isStrategicFlexibility).toBe(false);

      const context: ThreeTierValidationContext = {
        token,
        mathematicalContext: {
          baselineGridRequirement: {
            required: true,
            gridUnit: TEST_CONSTANTS.BASELINE_GRID,
            expectedAlignment: true,
            actualAlignment: false
          }
        }
      };

      const result = validator.validate(context);

      // Test still works regardless of what the actual grid unit is
      // The ErrorValidator checks:
      // 1. Token category requires baseline grid alignment (spacing/radius)
      // 2. Token is NOT strategic flexibility (flag AND value check)
      // 3. baseValue % gridUnit !== 0
      expect(result.primaryResult.level).toBe('Error');
      expect(result.primaryResult.message).toContain('Baseline grid');
    });

    it('should validate tokens with different multipliers', () => {
      // Easy to create variations
      const doubleToken = TokenBuilder.createDoubleSpacingToken();
      const quarterToken = TokenBuilder.createQuarterSpacingToken();

      expect(doubleToken.baseValue).toBe(TEST_CONSTANTS.SPACING_DOUBLE);
      expect(quarterToken.baseValue).toBe(TEST_CONSTANTS.SPACING_QUARTER);
      
      // Double is 8-unit grid-aligned
      expect(isBaselineGridAligned(doubleToken.baseValue)).toBe(true);
      
      // Quarter (2) is strategic flexibility, not grid-aligned
      expect(isBaselineGridAligned(quarterToken.baseValue)).toBe(false);
      expect(quarterToken.isStrategicFlexibility).toBe(true);
    });
  });

  describe('Custom token variations', () => {
    it('should allow overriding specific properties', () => {
      // Can still customize when needed
      const customToken = TokenBuilder.createBaseSpacingToken({
        name: 'space100-custom',
        description: 'Custom description'
      });

      expect(customToken.name).toBe('space100-custom');
      expect(customToken.description).toBe('Custom description');
      // But still uses system base value
      expect(customToken.baseValue).toBe(TEST_CONSTANTS.SPACING_BASE);
    });
  });
});
