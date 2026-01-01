/**
 * Input-Text-Email Component Types
 * 
 * Defines the public API and internal state interfaces for the Input-Text-Email component
 * across all platforms (web, iOS, Android).
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 */

import { InputTextBaseProps, InputTextBaseState } from '../Input-Text-Base/types';

/**
 * Input-Text-Email Component Props
 * 
 * Extends Input-Text-Base props with email-specific functionality.
 * The type and autocomplete properties are fixed for email input.
 */
export interface InputTextEmailProps extends Omit<InputTextBaseProps, 'type' | 'autocomplete'> {
  /** 
   * Input type is fixed to 'email' for this semantic component.
   * This ensures proper keyboard and validation behavior across platforms.
   */
  readonly type?: 'email';
  
  /** 
   * Autocomplete is fixed to 'email' for browser autofill support.
   * This enables email address suggestions from the browser.
   */
  readonly autocomplete?: 'email';
  
  /**
   * Custom email validation function.
   * If not provided, uses the default RFC 5322 compliant email regex.
   * Return true if valid, false if invalid.
   */
  customValidator?: (email: string) => boolean;
  
  /**
   * Custom error message for invalid email format.
   * If not provided, uses the default "Please enter a valid email address".
   */
  invalidEmailMessage?: string;
}

/**
 * Input-Text-Email State
 * 
 * Extends Input-Text-Base state with email-specific validation state.
 */
export interface InputTextEmailState extends InputTextBaseState {
  /** Whether the email format is valid */
  isEmailValid: boolean;
  
  /** Whether validation has been triggered (on blur) */
  hasBeenValidated: boolean;
}

/**
 * Email Validation Result
 * 
 * Result of email validation including validity and error message.
 */
export interface EmailValidationResult {
  /** Whether the email is valid */
  isValid: boolean;
  
  /** Error message if invalid, undefined if valid */
  errorMessage?: string;
}

