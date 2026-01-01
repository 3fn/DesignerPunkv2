/**
 * Input-Text-PhoneNumber Validation Tests
 * 
 * Tests for phone number validation and formatting logic.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 */

import {
  isValidPhoneNumber,
  validatePhoneNumber,
  formatPhoneNumber,
  extractDigits,
  getCountryConfig,
  getSupportedCountries,
  getExpectedDigitCount,
  getDialCode,
  getInternationalNumber,
  parsePhoneInput,
  DEFAULT_INVALID_PHONE_MESSAGE,
  DEFAULT_COUNTRY_CODE,
  COUNTRY_CODES
} from '../validation';

describe('Input-Text-PhoneNumber Validation', () => {
  describe('extractDigits', () => {
    it('should extract digits from formatted phone number', () => {
      expect(extractDigits('(555) 123-4567')).toBe('5551234567');
    });

    it('should extract digits from international format', () => {
      expect(extractDigits('+1 (555) 123-4567')).toBe('15551234567');
    });

    it('should return empty string for empty input', () => {
      expect(extractDigits('')).toBe('');
    });

    it('should return empty string for non-digit input', () => {
      expect(extractDigits('abc-def')).toBe('');
    });

    it('should handle mixed input', () => {
      expect(extractDigits('Phone: 555-1234')).toBe('5551234');
    });
  });

  describe('formatPhoneNumber', () => {
    describe('US format', () => {
      it('should format 10 digits to US format', () => {
        expect(formatPhoneNumber('5551234567', 'US')).toBe('(555) 123-4567');
      });

      it('should format partial digits', () => {
        expect(formatPhoneNumber('555', 'US')).toBe('(555');
        expect(formatPhoneNumber('555123', 'US')).toBe('(555) 123');
      });

      it('should return empty string for empty input', () => {
        expect(formatPhoneNumber('', 'US')).toBe('');
      });
    });

    describe('UK format', () => {
      it('should format 11 digits to UK format', () => {
        expect(formatPhoneNumber('07911123456', 'GB')).toBe('0791 112 3456');
      });
    });

    describe('France format', () => {
      it('should format 10 digits to French format', () => {
        expect(formatPhoneNumber('0612345678', 'FR')).toBe('06 12 34 56 78');
      });
    });

    describe('Japan format', () => {
      it('should format 11 digits to Japanese format', () => {
        expect(formatPhoneNumber('09012345678', 'JP')).toBe('090-1234-5678');
      });
    });

    describe('default country', () => {
      it('should use US format when no country specified', () => {
        expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
      });
    });
  });

  describe('isValidPhoneNumber', () => {
    describe('US phone numbers', () => {
      it('should accept valid 10-digit US number', () => {
        expect(isValidPhoneNumber('5551234567', 'US')).toBe(true);
      });

      it('should accept formatted US number', () => {
        expect(isValidPhoneNumber('(555) 123-4567', 'US')).toBe(true);
      });

      it('should reject too few digits', () => {
        expect(isValidPhoneNumber('555123456', 'US')).toBe(false);
      });

      it('should reject too many digits', () => {
        expect(isValidPhoneNumber('55512345678', 'US')).toBe(false);
      });
    });

    describe('UK phone numbers', () => {
      it('should accept valid 11-digit UK number', () => {
        expect(isValidPhoneNumber('07911123456', 'GB')).toBe(true);
      });

      it('should reject 10-digit UK number', () => {
        expect(isValidPhoneNumber('0791112345', 'GB')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should accept empty string (use required for empty validation)', () => {
        expect(isValidPhoneNumber('')).toBe(true);
      });

      it('should accept whitespace-only string', () => {
        expect(isValidPhoneNumber('   ')).toBe(true);
      });

      it('should use US as default country', () => {
        expect(isValidPhoneNumber('5551234567')).toBe(true);
      });
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return valid result for valid phone number', () => {
      const result = validatePhoneNumber('5551234567', 'US');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
      expect(result.formattedNumber).toBe('(555) 123-4567');
      expect(result.rawDigits).toBe('5551234567');
    });

    it('should return invalid result with default message for invalid phone', () => {
      const result = validatePhoneNumber('123', 'US');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(DEFAULT_INVALID_PHONE_MESSAGE);
    });

    it('should return invalid result with custom message', () => {
      const customMessage = 'Custom error message';
      const result = validatePhoneNumber('123', 'US', undefined, customMessage);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(customMessage);
    });

    it('should use custom validator when provided', () => {
      const customValidator = (phone: string) => phone.startsWith('555');
      
      // Valid with custom validator
      const validResult = validatePhoneNumber('5551234567', 'US', customValidator);
      expect(validResult.isValid).toBe(true);
      
      // Invalid with custom validator
      const invalidResult = validatePhoneNumber('1234567890', 'US', customValidator);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should return valid for empty string', () => {
      const result = validatePhoneNumber('');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });
  });

  describe('getCountryConfig', () => {
    it('should return US config for US code', () => {
      const config = getCountryConfig('US');
      expect(config.code).toBe('US');
      expect(config.dialCode).toBe('+1');
      expect(config.digitCount).toBe(10);
    });

    it('should return UK config for GB code', () => {
      const config = getCountryConfig('GB');
      expect(config.code).toBe('GB');
      expect(config.dialCode).toBe('+44');
      expect(config.digitCount).toBe(11);
    });

    it('should be case-insensitive', () => {
      expect(getCountryConfig('us').code).toBe('US');
      expect(getCountryConfig('gb').code).toBe('GB');
    });

    it('should return US config for unknown country', () => {
      const config = getCountryConfig('XX');
      expect(config.code).toBe('US');
    });
  });

  describe('getSupportedCountries', () => {
    it('should return array of country configs', () => {
      const countries = getSupportedCountries();
      expect(Array.isArray(countries)).toBe(true);
      expect(countries.length).toBe(Object.keys(COUNTRY_CODES).length);
    });

    it('should include US and GB', () => {
      const countries = getSupportedCountries();
      const codes = countries.map(c => c.code);
      expect(codes).toContain('US');
      expect(codes).toContain('GB');
    });
  });

  describe('getExpectedDigitCount', () => {
    it('should return 10 for US', () => {
      expect(getExpectedDigitCount('US')).toBe(10);
    });

    it('should return 11 for UK', () => {
      expect(getExpectedDigitCount('GB')).toBe(11);
    });

    it('should return 10 for default (US)', () => {
      expect(getExpectedDigitCount()).toBe(10);
    });
  });

  describe('getDialCode', () => {
    it('should return +1 for US', () => {
      expect(getDialCode('US')).toBe('+1');
    });

    it('should return +44 for UK', () => {
      expect(getDialCode('GB')).toBe('+44');
    });

    it('should return +1 for default (US)', () => {
      expect(getDialCode()).toBe('+1');
    });
  });

  describe('getInternationalNumber', () => {
    it('should format US number with dial code', () => {
      expect(getInternationalNumber('5551234567', 'US')).toBe('+1 (555) 123-4567');
    });

    it('should format UK number with dial code', () => {
      expect(getInternationalNumber('07911123456', 'GB')).toBe('+44 0791 112 3456');
    });

    it('should return empty string for empty input', () => {
      expect(getInternationalNumber('', 'US')).toBe('');
    });
  });

  describe('parsePhoneInput', () => {
    it('should format input and return raw digits', () => {
      const result = parsePhoneInput('5551234567', '', 'US');
      expect(result.formatted).toBe('(555) 123-4567');
      expect(result.rawDigits).toBe('5551234567');
    });

    it('should limit digits to expected count', () => {
      const result = parsePhoneInput('555123456789', '', 'US');
      expect(result.rawDigits).toBe('5551234567');
      expect(result.formatted).toBe('(555) 123-4567');
    });

    it('should handle partial input', () => {
      const result = parsePhoneInput('555', '', 'US');
      expect(result.formatted).toBe('(555');
      expect(result.rawDigits).toBe('555');
    });

    it('should strip non-digits from input', () => {
      const result = parsePhoneInput('(555) 123', '', 'US');
      expect(result.rawDigits).toBe('555123');
    });
  });

  describe('COUNTRY_CODES', () => {
    it('should have 10 supported countries', () => {
      expect(Object.keys(COUNTRY_CODES).length).toBe(10);
    });

    it('should have consistent format patterns', () => {
      Object.values(COUNTRY_CODES).forEach(country => {
        const hashCount = (country.format.match(/#/g) || []).length;
        expect(hashCount).toBe(country.digitCount);
      });
    });
  });

  describe('DEFAULT_COUNTRY_CODE', () => {
    it('should be US', () => {
      expect(DEFAULT_COUNTRY_CODE).toBe('US');
    });
  });
});
