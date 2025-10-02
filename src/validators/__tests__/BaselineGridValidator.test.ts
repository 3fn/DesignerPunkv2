/**
 * BaselineGridValidator Unit Tests
 * 
 * Tests for baseline grid alignment validation with strategic flexibility support.
 * Covers validation logic, strategic flexibility handling, and mathematical reasoning.
 */

import { BaselineGridValidator, BASELINE_GRID_UNIT, BaselineGridValidationOptions } from '../BaselineGridValidator';
import { ValidationResult } from '../../types/ValidationResult';

describe('BaselineGridValidator', () => {
  let validator: BaselineGridValidator;

  beforeEach(() => {
    validator = new BaselineGridValidator();
  });

  describe('Baseline Grid Validation', () => {
    test('should validate 8-unit aligned values as Pass', () => {
      const testValues = [0, 8, 16, 24, 32, 40, 48, 56, 64];

      testValues.forEach(value => {
        const result = validator.validate(value, `test-${value}`);
        
        expect(result.level).toBe('Pass');
        expect(result.message).toBe('Baseline grid alignment validated');
        expect(result.mathematicalReasoning).toContain(`${value} ÷ ${BASELINE_GRID_UNIT}`);
        expect(result.mathematicalReasoning).toContain('whole number confirms alignment');
      });
    });

    test('should validate non-8-unit aligned values as Error', () => {
      const testValues = [1, 3, 5, 7, 9, 11, 13, 15];

      testValues.forEach(value => {
        const result = validator.validate(value, `test-${value}`);
        
        expect(result.level).toBe('Error');
        expect(result.message).toBe('Baseline grid alignment violation');
        expect(result.mathematicalReasoning).toContain(`${value} ÷ ${BASELINE_GRID_UNIT}`);
        expect(result.mathematicalReasoning).toContain('non-whole number indicates misalignment');
      });
    });

    test('should provide correction suggestions for invalid values', () => {
      const result = validator.validate(7, 'test-7');

      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Use 0 (0 × 8)');
      expect(result.suggestions).toContain('Use 8 (1 × 8)');
      expect(result.suggestions).toContain('Consider if this should be a strategic flexibility token');
    });

    test('should handle edge case values correctly', () => {
      // Test zero
      const zeroResult = validator.validate(0);
      expect(zeroResult.level).toBe('Pass');

      // Test negative values that are 8-unit aligned
      const negativeResult = validator.validate(-16);
      expect(negativeResult.level).toBe('Pass');

      // Test large values
      const largeResult = validator.validate(800);
      expect(largeResult.level).toBe('Pass');
    });
  });

  describe('Strategic Flexibility Token Handling', () => {
    test('should validate strategic flexibility values as Pass', () => {
      const strategicValues = [6, 10, 20];

      strategicValues.forEach(value => {
        const result = validator.validate(value, `strategic-${value}`);
        
        expect(result.level).toBe('Pass');
        expect(result.message).toBe('Strategic flexibility token - mathematically derived exception');
        expect(result.rationale).toContain('strategic flexibility token');
        expect(result.mathematicalReasoning).toContain('mathematically derived');
      });
    });

    test('should prioritize strategic flexibility over baseline grid validation', () => {
      // 6 is not 8-unit aligned but is strategic flexibility
      const result = validator.validate(6, 'space075');

      expect(result.level).toBe('Pass');
      expect(result.message).toBe('Strategic flexibility token - mathematically derived exception');
      expect(result.rationale).toContain('necessary design flexibility');
    });

    test('should disable strategic flexibility when configured', () => {
      const strictValidator = new BaselineGridValidator({ allowStrategicFlexibility: false });
      const result = strictValidator.validate(6, 'test-6');

      expect(result.level).toBe('Error');
      expect(result.message).toBe('Baseline grid alignment violation');
    });

    test('should provide strategic flexibility information in grid info', () => {
      const gridInfo = validator.getGridInfo();

      expect(gridInfo.allowStrategicFlexibility).toBe(true);
      expect(gridInfo.strategicFlexibilityValues).toEqual([6, 10, 20]);
    });
  });

  describe('Custom Grid Unit Configuration', () => {
    test('should use custom grid unit when provided', () => {
      const customValidator = new BaselineGridValidator({ customGridUnit: 4 });
      
      // 12 is aligned to 4-unit grid but not 8-unit grid
      const result = customValidator.validate(12, 'test-12');

      expect(result.level).toBe('Pass');
      expect(result.mathematicalReasoning).toContain('12 ÷ 4 = 3');
    });

    test('should validate against custom grid unit correctly', () => {
      const customValidator = new BaselineGridValidator({ customGridUnit: 12 });
      
      const validResult = customValidator.validate(24, 'test-24'); // 24 ÷ 12 = 2
      const invalidResult = customValidator.validate(16, 'test-16'); // 16 ÷ 12 = 1.33...

      expect(validResult.level).toBe('Pass');
      expect(invalidResult.level).toBe('Error');
    });

    test('should provide correct grid info for custom grid unit', () => {
      const customValidator = new BaselineGridValidator({ customGridUnit: 4 });
      const gridInfo = customValidator.getGridInfo();

      expect(gridInfo.gridUnit).toBe(4);
    });
  });

  describe('Batch Validation', () => {
    test('should validate multiple values at once', () => {
      const values = [
        { value: 8, tokenName: 'valid-8' },
        { value: 7, tokenName: 'invalid-7' },
        { value: 16, tokenName: 'valid-16' },
        { value: 6, tokenName: 'strategic-6' }
      ];

      const results = validator.validateBatch(values);

      expect(results).toHaveLength(4);
      expect(results[0].level).toBe('Pass'); // 8 is valid
      expect(results[1].level).toBe('Error'); // 7 is invalid
      expect(results[2].level).toBe('Pass'); // 16 is valid
      expect(results[3].level).toBe('Pass'); // 6 is strategic flexibility
    });

    test('should handle batch validation with missing token names', () => {
      const values = [
        { value: 8 },
        { value: 7 }
      ];

      const results = validator.validateBatch(values);

      expect(results).toHaveLength(2);
      expect(results[0].token).toBe('value-8');
      expect(results[1].token).toBe('value-7');
    });

    test('should handle empty batch validation', () => {
      const results = validator.validateBatch([]);

      expect(results).toHaveLength(0);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Mathematical Reasoning and Feedback', () => {
    test('should provide clear mathematical reasoning for valid values', () => {
      const result = validator.validate(24, 'space300');

      expect(result.mathematicalReasoning).toBe('24 ÷ 8 = 3 (whole number confirms alignment)');
    });

    test('should provide clear mathematical reasoning for invalid values', () => {
      const result = validator.validate(15, 'invalid-15');

      expect(result.mathematicalReasoning).toBe('15 ÷ 8 = 1.875 (non-whole number indicates misalignment)');
    });

    test('should provide appropriate suggestions for nearby valid values', () => {
      const result = validator.validate(15, 'test-15');

      expect(result.suggestions).toContain('Use 8 (1 × 8)');
      expect(result.suggestions).toContain('Use 16 (2 × 8)');
    });

    test('should handle edge cases in suggestion generation', () => {
      // Test value very close to zero
      const lowResult = validator.validate(1, 'test-1');
      expect(lowResult.suggestions).toContain('Use 0 (0 × 8)');
      expect(lowResult.suggestions).toContain('Use 8 (1 × 8)');

      // Test exact midpoint between grid values
      const midResult = validator.validate(12, 'test-12');
      expect(midResult.suggestions).toContain('Use 8 (1 × 8)');
      expect(midResult.suggestions).toContain('Use 16 (2 × 8)');
    });
  });

  describe('Token Name Handling', () => {
    test('should use provided token name in validation results', () => {
      const result = validator.validate(8, 'space100');

      expect(result.token).toBe('space100');
    });

    test('should generate default token name when not provided', () => {
      const result = validator.validate(8);

      expect(result.token).toBe('value-8');
    });

    test('should handle empty or undefined token names gracefully', () => {
      const result1 = validator.validate(8, '');
      const result2 = validator.validate(8, undefined);

      expect(result1.token).toBe('value-8');
      expect(result2.token).toBe('value-8');
    });
  });

  describe('Grid Information and Configuration', () => {
    test('should provide complete grid information', () => {
      const gridInfo = validator.getGridInfo();

      expect(gridInfo.gridUnit).toBe(8);
      expect(gridInfo.allowStrategicFlexibility).toBe(true);
      expect(gridInfo.strategicFlexibilityValues).toEqual([6, 10, 20]);
    });

    test('should reflect configuration changes in grid info', () => {
      const customValidator = new BaselineGridValidator({
        customGridUnit: 4,
        allowStrategicFlexibility: false
      });
      const gridInfo = customValidator.getGridInfo();

      expect(gridInfo.gridUnit).toBe(4);
      expect(gridInfo.allowStrategicFlexibility).toBe(false);
      expect(gridInfo.strategicFlexibilityValues).toEqual([]);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle decimal values correctly', () => {
      const result = validator.validate(8.5, 'test-decimal');

      expect(result.level).toBe('Error');
      expect(result.mathematicalReasoning).toContain('8.5 ÷ 8 = 1.0625');
    });

    test('should handle very large values', () => {
      const result = validator.validate(8000, 'test-large');

      expect(result.level).toBe('Pass');
      expect(result.mathematicalReasoning).toContain('8000 ÷ 8 = 1000');
    });

    test('should handle negative values', () => {
      const validNegative = validator.validate(-16, 'test-negative-valid');
      const invalidNegative = validator.validate(-15, 'test-negative-invalid');

      expect(validNegative.level).toBe('Pass');
      expect(invalidNegative.level).toBe('Error');
    });

    test('should handle zero correctly', () => {
      const result = validator.validate(0, 'test-zero');

      expect(result.level).toBe('Pass');
      expect(result.mathematicalReasoning).toContain('0 ÷ 8 = 0');
    });
  });
});