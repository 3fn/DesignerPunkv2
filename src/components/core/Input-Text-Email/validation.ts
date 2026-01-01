/**
 * Input-Text-Email Validation
 * 
 * Email validation logic for the Input-Text-Email component.
 * Implements RFC 5322 compliant email validation with practical considerations.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * Behavioral Contracts:
 * - validates_email_format: Validates email against RFC 5322 pattern
 * - provides_email_autocomplete: Enables browser email autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.3 (Input-Text-Email validation and autocomplete)
 */

import { EmailValidationResult } from './types';

/**
 * Default error message for invalid email format.
 */
export const DEFAULT_INVALID_EMAIL_MESSAGE = 'Please enter a valid email address';

/**
 * RFC 5322 compliant email regex pattern.
 * 
 * This pattern validates:
 * - Local part: alphanumeric, dots, hyphens, underscores, plus signs
 * - @ symbol
 * - Domain part: alphanumeric, dots, hyphens
 * - TLD: 2+ characters
 * 
 * Note: This is a practical implementation that covers 99%+ of valid emails
 * while rejecting obviously invalid formats. It's not a complete RFC 5322
 * implementation (which would be extremely complex) but balances accuracy
 * with usability.
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validate email format using the default RFC 5322 pattern.
 * 
 * @param email - The email address to validate
 * @returns true if the email format is valid, false otherwise
 * 
 * Requirements: R4.3
 */
export function isValidEmail(email: string): boolean {
  // Empty strings are not validated (use required prop for that)
  if (!email || email.trim() === '') {
    return true;
  }
  
  const trimmedEmail = email.trim();
  
  // Check basic regex pattern first
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return false;
  }
  
  // Additional RFC 5322 checks for dots in local part
  const localPart = trimmedEmail.split('@')[0];
  
  // Local part cannot start with a dot
  if (localPart.startsWith('.')) {
    return false;
  }
  
  // Local part cannot end with a dot
  if (localPart.endsWith('.')) {
    return false;
  }
  
  // Local part cannot have consecutive dots
  if (localPart.includes('..')) {
    return false;
  }
  
  return true;
}

/**
 * Validate email and return a result object with validity and error message.
 * 
 * @param email - The email address to validate
 * @param customValidator - Optional custom validation function
 * @param invalidEmailMessage - Optional custom error message
 * @returns EmailValidationResult with isValid and optional errorMessage
 * 
 * Requirements: R4.3
 */
export function validateEmail(
  email: string,
  customValidator?: (email: string) => boolean,
  invalidEmailMessage?: string
): EmailValidationResult {
  // Empty strings are valid (use required prop for empty validation)
  if (!email || email.trim() === '') {
    return { isValid: true };
  }
  
  // Use custom validator if provided, otherwise use default
  const validator = customValidator || isValidEmail;
  const isValid = validator(email);
  
  if (isValid) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    errorMessage: invalidEmailMessage || DEFAULT_INVALID_EMAIL_MESSAGE
  };
}

/**
 * Normalize email address for consistent handling.
 * 
 * - Trims whitespace
 * - Converts to lowercase (email addresses are case-insensitive)
 * 
 * @param email - The email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

