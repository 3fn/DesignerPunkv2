/**
 * Input-Text-Password Validation Tests
 * 
 * Tests for password validation logic.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 */

import {
  validatePassword,
  validatePasswordRequirements,
  allRequirementsMet,
  generateDetailedErrorMessage,
  hasPasswordContent,
  createDefaultValidationDetails,
  PASSWORD_PATTERNS,
  DEFAULT_INVALID_PASSWORD_MESSAGE
} from '../validation';
import { PasswordRequirements, PasswordValidationDetails } from '../types';

describe('Input-Text-Password Validation', () => {
  describe('PASSWORD_PATTERNS', () => {
    it('should match uppercase letters', () => {
      expect(PASSWORD_PATTERNS.uppercase.test('A')).toBe(true);
      expect(PASSWORD_PATTERNS.uppercase.test('Z')).toBe(true);
      expect(PASSWORD_PATTERNS.uppercase.test('a')).toBe(false);
      expect(PASSWORD_PATTERNS.uppercase.test('1')).toBe(false);
    });

    it('should match lowercase letters', () => {
      expect(PASSWORD_PATTERNS.lowercase.test('a')).toBe(true);
      expect(PASSWORD_PATTERNS.lowercase.test('z')).toBe(true);
      expect(PASSWORD_PATTERNS.lowercase.test('A')).toBe(false);
      expect(PASSWORD_PATTERNS.lowercase.test('1')).toBe(false);
    });

    it('should match numbers', () => {
      expect(PASSWORD_PATTERNS.number.test('0')).toBe(true);
      expect(PASSWORD_PATTERNS.number.test('9')).toBe(true);
      expect(PASSWORD_PATTERNS.number.test('a')).toBe(false);
      expect(PASSWORD_PATTERNS.number.test('A')).toBe(false);
    });

    it('should match special characters', () => {
      expect(PASSWORD_PATTERNS.specialChar.test('!')).toBe(true);
      expect(PASSWORD_PATTERNS.specialChar.test('@')).toBe(true);
      expect(PASSWORD_PATTERNS.specialChar.test('#')).toBe(true);
      expect(PASSWORD_PATTERNS.specialChar.test('$')).toBe(true);
      expect(PASSWORD_PATTERNS.specialChar.test('a')).toBe(false);
      expect(PASSWORD_PATTERNS.specialChar.test('1')).toBe(false);
    });
  });

  describe('createDefaultValidationDetails', () => {
    it('should return all passing details', () => {
      const details = createDefaultValidationDetails();
      expect(details.meetsMinLength).toBe(true);
      expect(details.meetsMaxLength).toBe(true);
      expect(details.hasUppercase).toBe(true);
      expect(details.hasLowercase).toBe(true);
      expect(details.hasNumber).toBe(true);
      expect(details.hasSpecialChar).toBe(true);
    });
  });

  describe('validatePasswordRequirements', () => {
    describe('minLength', () => {
      it('should pass when password meets minimum length', () => {
        const result = validatePasswordRequirements('password', { minLength: 8 });
        expect(result.meetsMinLength).toBe(true);
      });

      it('should fail when password is shorter than minimum', () => {
        const result = validatePasswordRequirements('pass', { minLength: 8 });
        expect(result.meetsMinLength).toBe(false);
      });

      it('should pass when minLength is undefined', () => {
        const result = validatePasswordRequirements('a', {});
        expect(result.meetsMinLength).toBe(true);
      });
    });

    describe('maxLength', () => {
      it('should pass when password is within maximum length', () => {
        const result = validatePasswordRequirements('password', { maxLength: 20 });
        expect(result.meetsMaxLength).toBe(true);
      });

      it('should fail when password exceeds maximum length', () => {
        const result = validatePasswordRequirements('verylongpassword', { maxLength: 10 });
        expect(result.meetsMaxLength).toBe(false);
      });

      it('should pass when maxLength is undefined', () => {
        const result = validatePasswordRequirements('verylongpassword', {});
        expect(result.meetsMaxLength).toBe(true);
      });
    });

    describe('requireUppercase', () => {
      it('should pass when password has uppercase and required', () => {
        const result = validatePasswordRequirements('Password', { requireUppercase: true });
        expect(result.hasUppercase).toBe(true);
      });

      it('should fail when password lacks uppercase and required', () => {
        const result = validatePasswordRequirements('password', { requireUppercase: true });
        expect(result.hasUppercase).toBe(false);
      });

      it('should pass when uppercase not required', () => {
        const result = validatePasswordRequirements('password', { requireUppercase: false });
        expect(result.hasUppercase).toBe(true);
      });
    });

    describe('requireLowercase', () => {
      it('should pass when password has lowercase and required', () => {
        const result = validatePasswordRequirements('Password', { requireLowercase: true });
        expect(result.hasLowercase).toBe(true);
      });

      it('should fail when password lacks lowercase and required', () => {
        const result = validatePasswordRequirements('PASSWORD', { requireLowercase: true });
        expect(result.hasLowercase).toBe(false);
      });

      it('should pass when lowercase not required', () => {
        const result = validatePasswordRequirements('PASSWORD', { requireLowercase: false });
        expect(result.hasLowercase).toBe(true);
      });
    });

    describe('requireNumber', () => {
      it('should pass when password has number and required', () => {
        const result = validatePasswordRequirements('Password1', { requireNumber: true });
        expect(result.hasNumber).toBe(true);
      });

      it('should fail when password lacks number and required', () => {
        const result = validatePasswordRequirements('Password', { requireNumber: true });
        expect(result.hasNumber).toBe(false);
      });

      it('should pass when number not required', () => {
        const result = validatePasswordRequirements('Password', { requireNumber: false });
        expect(result.hasNumber).toBe(true);
      });
    });

    describe('requireSpecialChar', () => {
      it('should pass when password has special char and required', () => {
        const result = validatePasswordRequirements('Password!', { requireSpecialChar: true });
        expect(result.hasSpecialChar).toBe(true);
      });

      it('should fail when password lacks special char and required', () => {
        const result = validatePasswordRequirements('Password1', { requireSpecialChar: true });
        expect(result.hasSpecialChar).toBe(false);
      });

      it('should pass when special char not required', () => {
        const result = validatePasswordRequirements('Password1', { requireSpecialChar: false });
        expect(result.hasSpecialChar).toBe(true);
      });
    });

    describe('combined requirements', () => {
      it('should validate all requirements together', () => {
        const requirements: PasswordRequirements = {
          minLength: 8,
          maxLength: 20,
          requireUppercase: true,
          requireLowercase: true,
          requireNumber: true,
          requireSpecialChar: true
        };

        const validResult = validatePasswordRequirements('Password1!', requirements);
        expect(validResult.meetsMinLength).toBe(true);
        expect(validResult.meetsMaxLength).toBe(true);
        expect(validResult.hasUppercase).toBe(true);
        expect(validResult.hasLowercase).toBe(true);
        expect(validResult.hasNumber).toBe(true);
        expect(validResult.hasSpecialChar).toBe(true);
      });
    });
  });

  describe('allRequirementsMet', () => {
    it('should return true when all requirements are met', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: true,
        meetsMaxLength: true,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      expect(allRequirementsMet(details)).toBe(true);
    });

    it('should return false when any requirement is not met', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: true,
        meetsMaxLength: true,
        hasUppercase: false,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      expect(allRequirementsMet(details)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return valid result for empty password (use required for empty validation)', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return valid result for password meeting all requirements', () => {
      const requirements: PasswordRequirements = {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true
      };
      const result = validatePassword('Password1', requirements);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return invalid result with default message for failing password', () => {
      const requirements: PasswordRequirements = { minLength: 10 };
      const result = validatePassword('short', requirements);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(DEFAULT_INVALID_PASSWORD_MESSAGE);
    });

    it('should return invalid result with custom message', () => {
      const customMessage = 'Custom password error';
      const requirements: PasswordRequirements = { minLength: 10 };
      const result = validatePassword('short', requirements, undefined, customMessage);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(customMessage);
    });

    it('should use custom validator when provided', () => {
      const customValidator = (password: string) => password.includes('secret');
      
      const validResult = validatePassword('mysecretpassword', {}, customValidator);
      expect(validResult.isValid).toBe(true);
      
      const invalidResult = validatePassword('mypassword', {}, customValidator);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should include validation details in result', () => {
      const requirements: PasswordRequirements = {
        minLength: 8,
        requireUppercase: true
      };
      const result = validatePassword('password', requirements);
      expect(result.details).toBeDefined();
      expect(result.details.meetsMinLength).toBe(true);
      expect(result.details.hasUppercase).toBe(false);
    });
  });

  describe('generateDetailedErrorMessage', () => {
    it('should generate message for single missing requirement', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: false,
        meetsMaxLength: true,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      const requirements: PasswordRequirements = { minLength: 8 };
      const message = generateDetailedErrorMessage(details, requirements);
      expect(message).toBe('Password must contain at least 8 characters');
    });

    it('should generate message for multiple missing requirements', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: false,
        meetsMaxLength: true,
        hasUppercase: false,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      const requirements: PasswordRequirements = { minLength: 8, requireUppercase: true };
      const message = generateDetailedErrorMessage(details, requirements);
      expect(message).toBe('Password must contain at least 8 characters and one uppercase letter');
    });

    it('should generate message for three or more missing requirements', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: false,
        meetsMaxLength: true,
        hasUppercase: false,
        hasLowercase: true,
        hasNumber: false,
        hasSpecialChar: true
      };
      const requirements: PasswordRequirements = { 
        minLength: 8, 
        requireUppercase: true,
        requireNumber: true
      };
      const message = generateDetailedErrorMessage(details, requirements);
      expect(message).toBe('Password must contain at least 8 characters, one uppercase letter and one number');
    });

    it('should return default message when no specific errors', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: true,
        meetsMaxLength: true,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      const requirements: PasswordRequirements = {};
      const message = generateDetailedErrorMessage(details, requirements);
      expect(message).toBe(DEFAULT_INVALID_PASSWORD_MESSAGE);
    });

    it('should include maxLength error message', () => {
      const details: PasswordValidationDetails = {
        meetsMinLength: true,
        meetsMaxLength: false,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true
      };
      const requirements: PasswordRequirements = { maxLength: 20 };
      const message = generateDetailedErrorMessage(details, requirements);
      expect(message).toBe('Password must contain no more than 20 characters');
    });
  });

  describe('hasPasswordContent', () => {
    it('should return true for non-empty password', () => {
      expect(hasPasswordContent('password')).toBe(true);
    });

    it('should return false for empty password', () => {
      expect(hasPasswordContent('')).toBe(false);
    });

    it('should return true for whitespace-only password', () => {
      expect(hasPasswordContent('   ')).toBe(true);
    });
  });
});
