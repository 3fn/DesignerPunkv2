/**
 * @category evergreen
 * @purpose Verify I validation catches invalid patterns and enforces rules
 */
/**
 * IValidator Interface Tests
 * 
 * Tests to verify the IValidator interface contract (sync-only)
 */

import { 
  IValidator, 
  ValidationResult, 
  ValidationLevel
} from '../IValidator';

describe('IValidator Interface', () => {
  describe('Interface Contract', () => {
    it('should allow synchronous validator implementation', () => {
      // Arrange
      class SyncValidator implements IValidator<number> {
        readonly name = 'SyncValidator';
        
        validate(input: number): ValidationResult {
          return {
            level: 'Pass',
            token: `value-${input}`,
            message: 'Validation passed',
            rationale: 'Input is valid',
            mathematicalReasoning: `Value ${input} meets criteria`
          };
        }
      }

      const validator = new SyncValidator();
      
      // Act
      const result = validator.validate(8);
      
      // Assert
      expect(validator.name).toBe('SyncValidator');
      expect(result.level).toBe('Pass');
      expect(result.token).toBe('value-8');
      expect(result.message).toBe('Validation passed');
    });

    it('should allow validator that returns null', () => {
      // Arrange
      class NullValidator implements IValidator<string> {
        readonly name = 'NullValidator';
        
        validate(input: string): ValidationResult | null {
          // Return null when no issues found
          if (input === 'valid') {
            return null;
          }
          
          return {
            level: 'Error',
            token: input,
            message: 'Validation failed',
            rationale: 'Input is invalid',
            mathematicalReasoning: 'Validation check failed'
          };
        }
      }

      const validator = new NullValidator();
      
      // Act
      const validResult = validator.validate('valid');
      const invalidResult = validator.validate('invalid');
      
      // Assert
      expect(validator.name).toBe('NullValidator');
      expect(validResult).toBeNull();
      expect(invalidResult).not.toBeNull();
      expect(invalidResult?.level).toBe('Error');
    });

    it('should support polymorphic validator usage', () => {
      // Arrange
      class ValidatorA implements IValidator<number> {
        readonly name = 'ValidatorA';
        validate(input: number): ValidationResult {
          return {
            level: 'Pass',
            token: `${input}`,
            message: 'A validated',
            rationale: 'Valid',
            mathematicalReasoning: 'Math A'
          };
        }
      }

      class ValidatorB implements IValidator<number> {
        readonly name = 'ValidatorB';
        validate(input: number): ValidationResult {
          return {
            level: 'Warning',
            token: `${input}`,
            message: 'B validated',
            rationale: 'Valid with warning',
            mathematicalReasoning: 'Math B'
          };
        }
      }

      const validators: IValidator<number>[] = [
        new ValidatorA(),
        new ValidatorB()
      ];
      
      // Act
      const results = validators.map(v => {
        const result = v.validate(8);
        if (result === null) {
          return {
            level: 'Pass' as const,
            token: 'test',
            message: 'No issues found',
            rationale: 'Validation passed',
            mathematicalReasoning: 'No issues detected'
          };
        }
        return result;
      });
      
      // Assert
      expect(results).toHaveLength(2);
      expect(results[0].level).toBe('Pass');
      expect(results[1].level).toBe('Warning');
    });
  });

  describe('ValidationResult Structure', () => {
    it('should support all required fields', () => {
      // Arrange
      const result: ValidationResult = {
        level: 'Pass',
        token: 'test-token',
        message: 'Test message',
        rationale: 'Test rationale',
        mathematicalReasoning: 'Test reasoning'
      };
      
      // Assert
      expect(result.level).toBe('Pass');
      expect(result.token).toBe('test-token');
      expect(result.message).toBe('Test message');
      expect(result.rationale).toBe('Test rationale');
      expect(result.mathematicalReasoning).toBe('Test reasoning');
    });

    it('should support optional fields', () => {
      // Arrange
      const result: ValidationResult = {
        level: 'Error',
        token: 'test-token',
        message: 'Test message',
        rationale: 'Test rationale',
        mathematicalReasoning: 'Test reasoning',
        suggestions: ['Suggestion 1', 'Suggestion 2'],
        errors: ['Error 1'],
        warnings: ['Warning 1'],
        valid: false
      };
      
      // Assert
      expect(result.suggestions).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
      expect(result.valid).toBe(false);
    });

    it('should support all validation levels', () => {
      // Arrange
      const levels: ValidationLevel[] = ['Pass', 'Warning', 'Error'];
      
      // Act & Assert
      levels.forEach(level => {
        const result: ValidationResult = {
          level,
          token: 'test',
          message: 'Test',
          rationale: 'Test',
          mathematicalReasoning: 'Test'
        };
        
        expect(result.level).toBe(level);
      });
    });
  });



  describe('Type Safety', () => {
    it('should enforce type safety for input parameter', () => {
      // Arrange
      interface CustomInput {
        value: number;
        name: string;
      }

      class TypedValidator implements IValidator<CustomInput> {
        readonly name = 'TypedValidator';
        
        validate(input: CustomInput): ValidationResult {
          return {
            level: 'Pass',
            token: input.name,
            message: `Validated ${input.value}`,
            rationale: 'Type-safe validation',
            mathematicalReasoning: `Value: ${input.value}`
          };
        }
      }

      const validator = new TypedValidator();
      
      // Act
      const result = validator.validate({ value: 8, name: 'test' });
      
      // Assert
      expect(result.token).toBe('test');
      expect(result.message).toBe('Validated 8');
    });

    it('should support generic any type for flexible validators', () => {
      // Arrange
      class FlexibleValidator implements IValidator {
        readonly name = 'FlexibleValidator';
        
        validate(input: any): ValidationResult {
          return {
            level: 'Pass',
            token: String(input),
            message: 'Flexible validation',
            rationale: 'Accepts any input',
            mathematicalReasoning: 'Generic validation'
          };
        }
      }

      const validator = new FlexibleValidator();
      
      // Act
      const result1 = validator.validate(8);
      const result2 = validator.validate('test');
      const result3 = validator.validate({ key: 'value' });
      
      // Assert
      expect(result1.token).toBe('8');
      expect(result2.token).toBe('test');
      expect(result3.token).toBe('[object Object]');
    });
  });
});
