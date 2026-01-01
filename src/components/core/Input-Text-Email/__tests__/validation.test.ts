/**
 * Input-Text-Email Validation Tests
 * 
 * Tests for email validation logic.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 */

import { isValidEmail, validateEmail, normalizeEmail, DEFAULT_INVALID_EMAIL_MESSAGE } from '../validation';

describe('Input-Text-Email Validation', () => {
  describe('isValidEmail', () => {
    describe('valid emails', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@example.co.uk',
        'user@subdomain.example.com',
        'user123@example.com',
        'user_name@example.com',
        'user-name@example.com',
        'USER@EXAMPLE.COM',
        'user@123.123.123.123',
        "user!#$%&'*+/=?^_`{|}~-@example.com",
      ];

      validEmails.forEach((email) => {
        it(`should accept valid email: ${email}`, () => {
          expect(isValidEmail(email)).toBe(true);
        });
      });
    });

    describe('invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user@example.',
        'user @example.com',
        'user@ example.com',
        'user@example .com',
        'user@@example.com',
        '.user@example.com',
        'user.@example.com',
        'user..name@example.com',
      ];

      invalidEmails.forEach((email) => {
        it(`should reject invalid email: ${email}`, () => {
          expect(isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('edge cases', () => {
      it('should accept empty string (use required for empty validation)', () => {
        expect(isValidEmail('')).toBe(true);
      });

      it('should accept whitespace-only string (trimmed to empty)', () => {
        expect(isValidEmail('   ')).toBe(true);
      });

      it('should trim whitespace before validation', () => {
        expect(isValidEmail('  user@example.com  ')).toBe(true);
      });
    });
  });

  describe('validateEmail', () => {
    it('should return valid result for valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return invalid result with default message for invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(DEFAULT_INVALID_EMAIL_MESSAGE);
    });

    it('should return invalid result with custom message', () => {
      const customMessage = 'Custom error message';
      const result = validateEmail('invalid-email', undefined, customMessage);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(customMessage);
    });

    it('should use custom validator when provided', () => {
      const customValidator = (email: string) => email.endsWith('@company.com');
      
      // Valid with custom validator
      const validResult = validateEmail('user@company.com', customValidator);
      expect(validResult.isValid).toBe(true);
      
      // Invalid with custom validator (but valid email format)
      const invalidResult = validateEmail('user@example.com', customValidator);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should return valid for empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });
  });

  describe('normalizeEmail', () => {
    it('should trim whitespace', () => {
      expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
    });

    it('should convert to lowercase', () => {
      expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    it('should handle mixed case and whitespace', () => {
      expect(normalizeEmail('  User@Example.COM  ')).toBe('user@example.com');
    });
  });
});

