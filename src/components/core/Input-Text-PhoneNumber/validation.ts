/**
 * Input-Text-PhoneNumber Validation
 * 
 * Phone number validation and formatting logic for the Input-Text-PhoneNumber component.
 * Implements international phone number formatting and validation.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 * 
 * Behavioral Contracts:
 * - validates_phone_format: Validates phone number against country-specific patterns
 * - provides_phone_formatting: Formats phone numbers as user types
 * - supports_international_formats: Handles multiple country formats
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.5 (Input-Text-PhoneNumber formatting and validation)
 */

import { CountryCode, PhoneValidationResult } from './types';

/**
 * Default error message for invalid phone number format.
 */
export const DEFAULT_INVALID_PHONE_MESSAGE = 'Please enter a valid phone number';

/**
 * Supported country codes with their formats.
 * 
 * Format legend:
 * - # = digit placeholder
 * - Spaces, parentheses, and dashes are formatting characters
 */
export const COUNTRY_CODES: Record<string, CountryCode> = {
  US: {
    code: 'US',
    dialCode: '+1',
    name: 'United States',
    format: '(###) ###-####',
    digitCount: 10
  },
  CA: {
    code: 'CA',
    dialCode: '+1',
    name: 'Canada',
    format: '(###) ###-####',
    digitCount: 10
  },
  GB: {
    code: 'GB',
    dialCode: '+44',
    name: 'United Kingdom',
    format: '#### ### ####',
    digitCount: 11
  },
  DE: {
    code: 'DE',
    dialCode: '+49',
    name: 'Germany',
    format: '#### #######',
    digitCount: 11
  },
  FR: {
    code: 'FR',
    dialCode: '+33',
    name: 'France',
    format: '## ## ## ## ##',
    digitCount: 10
  },
  AU: {
    code: 'AU',
    dialCode: '+61',
    name: 'Australia',
    format: '#### ### ###',
    digitCount: 10
  },
  JP: {
    code: 'JP',
    dialCode: '+81',
    name: 'Japan',
    format: '###-####-####',
    digitCount: 11
  },
  IN: {
    code: 'IN',
    dialCode: '+91',
    name: 'India',
    format: '##### #####',
    digitCount: 10
  },
  BR: {
    code: 'BR',
    dialCode: '+55',
    name: 'Brazil',
    format: '(##) #####-####',
    digitCount: 11
  },
  MX: {
    code: 'MX',
    dialCode: '+52',
    name: 'Mexico',
    format: '## #### ####',
    digitCount: 10
  }
};

/**
 * Default country code if none specified.
 */
export const DEFAULT_COUNTRY_CODE = 'US';

/**
 * Get country code configuration by code.
 * 
 * @param code - ISO 3166-1 alpha-2 country code
 * @returns CountryCode configuration or US as default
 */
export function getCountryConfig(code: string): CountryCode {
  return COUNTRY_CODES[code.toUpperCase()] || COUNTRY_CODES[DEFAULT_COUNTRY_CODE];
}

/**
 * Get all supported country codes.
 * 
 * @returns Array of CountryCode configurations
 */
export function getSupportedCountries(): CountryCode[] {
  return Object.values(COUNTRY_CODES);
}

/**
 * Extract digits only from a phone number string.
 * 
 * @param phoneNumber - Phone number string (may contain formatting)
 * @returns String containing only digits
 */
export function extractDigits(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

/**
 * Format a phone number according to country-specific format.
 * 
 * @param digits - Raw digits to format
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(digits: string, countryCode: string = DEFAULT_COUNTRY_CODE): string {
  const config = getCountryConfig(countryCode);
  const format = config.format;
  
  if (!digits) {
    return '';
  }
  
  let result = '';
  let digitIndex = 0;
  
  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += format[i];
    }
  }
  
  return result;
}

/**
 * Validate phone number format based on country.
 * 
 * @param phoneNumber - Phone number to validate (can be formatted or raw)
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if the phone number format is valid, false otherwise
 * 
 * Requirements: R4.5
 */
export function isValidPhoneNumber(phoneNumber: string, countryCode: string = DEFAULT_COUNTRY_CODE): boolean {
  // Empty strings are not validated (use required prop for that)
  if (!phoneNumber || phoneNumber.trim() === '') {
    return true;
  }
  
  const digits = extractDigits(phoneNumber);
  const config = getCountryConfig(countryCode);
  
  // Check if digit count matches expected count for the country
  return digits.length === config.digitCount;
}

/**
 * Validate phone number and return a result object with validity and error message.
 * 
 * @param phoneNumber - The phone number to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @param customValidator - Optional custom validation function
 * @param invalidPhoneMessage - Optional custom error message
 * @returns PhoneValidationResult with isValid, errorMessage, and formatted number
 * 
 * Requirements: R4.5
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
  customValidator?: (phoneNumber: string, countryCode: string) => boolean,
  invalidPhoneMessage?: string
): PhoneValidationResult {
  // Empty strings are valid (use required prop for empty validation)
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: true };
  }
  
  const digits = extractDigits(phoneNumber);
  const formattedNumber = formatPhoneNumber(digits, countryCode);
  
  // Use custom validator if provided, otherwise use default
  const validator = customValidator || isValidPhoneNumber;
  const isValid = validator(phoneNumber, countryCode);
  
  if (isValid) {
    return { 
      isValid: true,
      formattedNumber,
      rawDigits: digits
    };
  }
  
  return {
    isValid: false,
    errorMessage: invalidPhoneMessage || DEFAULT_INVALID_PHONE_MESSAGE,
    formattedNumber,
    rawDigits: digits
  };
}

/**
 * Get the expected digit count for a country.
 * 
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Expected digit count
 */
export function getExpectedDigitCount(countryCode: string = DEFAULT_COUNTRY_CODE): number {
  return getCountryConfig(countryCode).digitCount;
}

/**
 * Get the dial code for a country.
 * 
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Dial code (e.g., '+1')
 */
export function getDialCode(countryCode: string = DEFAULT_COUNTRY_CODE): string {
  return getCountryConfig(countryCode).dialCode;
}

/**
 * Get the full international phone number.
 * 
 * @param phoneNumber - Phone number (formatted or raw)
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Full international number (e.g., '+1 (555) 123-4567')
 */
export function getInternationalNumber(phoneNumber: string, countryCode: string = DEFAULT_COUNTRY_CODE): string {
  const digits = extractDigits(phoneNumber);
  const config = getCountryConfig(countryCode);
  const formatted = formatPhoneNumber(digits, countryCode);
  
  if (!formatted) {
    return '';
  }
  
  return `${config.dialCode} ${formatted}`;
}

/**
 * Parse a phone number input and handle formatting as user types.
 * 
 * @param input - Current input value
 * @param previousValue - Previous input value (for backspace detection)
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Object with formatted value and raw digits
 */
export function parsePhoneInput(
  input: string,
  previousValue: string = '',
  countryCode: string = DEFAULT_COUNTRY_CODE
): { formatted: string; rawDigits: string } {
  const digits = extractDigits(input);
  const config = getCountryConfig(countryCode);
  
  // Limit digits to expected count
  const limitedDigits = digits.slice(0, config.digitCount);
  const formatted = formatPhoneNumber(limitedDigits, countryCode);
  
  return {
    formatted,
    rawDigits: limitedDigits
  };
}

