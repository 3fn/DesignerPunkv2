/**
 * Input-Text-Password Validation
 * 
 * Password validation logic for the Input-Text-Password component.
 * Implements configurable password strength validation.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 * 
 * Behavioral Contracts:
 * - provides_secure_input: Masks password input by default
 * - supports_password_toggle: Show/hide password functionality
 * - provides_password_autocomplete: Enables browser password autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.4 (Input-Text-Password secure input and toggle)
 */

import { 
  PasswordRequirements, 
  PasswordValidationResult, 
  PasswordValidationDetails 
} from './types';

/**
 * Default error message for invalid password.
 */
export const DEFAULT_INVALID_PASSWORD_MESSAGE = 'Password does not meet requirements';

/**
 * Regex patterns for password validation
 */
export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
};

/**
 * Create default validation details (all passing)
 */
export function createDefaultValidationDetails(): PasswordValidationDetails {
  return {
    meetsMinLength: true,
    meetsMaxLength: true,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSpecialChar: true
  };
}

/**
 * Validate password against requirements.
 * 
 * @param password - The password to validate
 * @param requirements - Password requirements configuration
 * @returns PasswordValidationDetails with results for each requirement
 * 
 * Requirements: R4.4
 */
export function validatePasswordRequirements(
  password: string,
  requirements: PasswordRequirements
): PasswordValidationDetails {
  const {
    minLength,
    maxLength,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false
  } = requirements;
  
  return {
    meetsMinLength: minLength === undefined || password.length >= minLength,
    meetsMaxLength: maxLength === undefined || password.length <= maxLength,
    hasUppercase: !requireUppercase || PASSWORD_PATTERNS.uppercase.test(password),
    hasLowercase: !requireLowercase || PASSWORD_PATTERNS.lowercase.test(password),
    hasNumber: !requireNumber || PASSWORD_PATTERNS.number.test(password),
    hasSpecialChar: !requireSpecialChar || PASSWORD_PATTERNS.specialChar.test(password)
  };
}

/**
 * Check if all validation details pass.
 * 
 * @param details - Validation details to check
 * @returns true if all requirements are met
 */
export function allRequirementsMet(details: PasswordValidationDetails): boolean {
  return (
    details.meetsMinLength &&
    details.meetsMaxLength &&
    details.hasUppercase &&
    details.hasLowercase &&
    details.hasNumber &&
    details.hasSpecialChar
  );
}

/**
 * Validate password and return a result object with validity, error message, and details.
 * 
 * @param password - The password to validate
 * @param requirements - Password requirements configuration
 * @param customValidator - Optional custom validation function
 * @param invalidPasswordMessage - Optional custom error message
 * @returns PasswordValidationResult with isValid, errorMessage, and details
 * 
 * Requirements: R4.4
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = {},
  customValidator?: (password: string) => boolean,
  invalidPasswordMessage?: string
): PasswordValidationResult {
  // Empty strings are valid (use required prop for empty validation)
  if (!password || password.length === 0) {
    return { 
      isValid: true, 
      details: createDefaultValidationDetails() 
    };
  }
  
  // Use custom validator if provided
  if (customValidator) {
    const isValid = customValidator(password);
    return {
      isValid,
      errorMessage: isValid ? undefined : (invalidPasswordMessage || DEFAULT_INVALID_PASSWORD_MESSAGE),
      details: createDefaultValidationDetails() // Custom validator doesn't provide details
    };
  }
  
  // Validate against requirements
  const details = validatePasswordRequirements(password, requirements);
  const isValid = allRequirementsMet(details);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : (invalidPasswordMessage || DEFAULT_INVALID_PASSWORD_MESSAGE),
    details
  };
}

/**
 * Generate a human-readable error message based on validation details.
 * 
 * @param details - Validation details
 * @param requirements - Password requirements configuration
 * @returns Human-readable error message
 */
export function generateDetailedErrorMessage(
  details: PasswordValidationDetails,
  requirements: PasswordRequirements
): string {
  const errors: string[] = [];
  
  if (!details.meetsMinLength && requirements.minLength) {
    errors.push(`at least ${requirements.minLength} characters`);
  }
  
  if (!details.meetsMaxLength && requirements.maxLength) {
    errors.push(`no more than ${requirements.maxLength} characters`);
  }
  
  if (!details.hasUppercase && requirements.requireUppercase) {
    errors.push('one uppercase letter');
  }
  
  if (!details.hasLowercase && requirements.requireLowercase) {
    errors.push('one lowercase letter');
  }
  
  if (!details.hasNumber && requirements.requireNumber) {
    errors.push('one number');
  }
  
  if (!details.hasSpecialChar && requirements.requireSpecialChar) {
    errors.push('one special character');
  }
  
  if (errors.length === 0) {
    return DEFAULT_INVALID_PASSWORD_MESSAGE;
  }
  
  if (errors.length === 1) {
    return `Password must contain ${errors[0]}`;
  }
  
  const lastError = errors.pop();
  return `Password must contain ${errors.join(', ')} and ${lastError}`;
}

/**
 * Check if password has any content (for determining if validation should run)
 * 
 * @param password - The password to check
 * @returns true if password has content
 */
export function hasPasswordContent(password: string): boolean {
  return password.length > 0;
}
