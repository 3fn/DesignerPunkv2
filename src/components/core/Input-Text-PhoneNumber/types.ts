/**
 * Input-Text-PhoneNumber Component Types
 * 
 * Defines the public API and internal state interfaces for the Input-Text-PhoneNumber component
 * across all platforms (web, iOS, Android).
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 */

import { InputTextBaseProps, InputTextBaseState } from '../Input-Text-Base/types';

/**
 * Supported country codes for phone number formatting
 */
export interface CountryCode {
  /** ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE') */
  code: string;
  
  /** Country dial code (e.g., '+1', '+44', '+49') */
  dialCode: string;
  
  /** Country name for display */
  name: string;
  
  /** Phone number format pattern (e.g., '(###) ###-####') */
  format: string;
  
  /** Expected digit count (excluding country code) */
  digitCount: number;
}

/**
 * Input-Text-PhoneNumber Component Props
 * 
 * Extends Input-Text-Base props with phone number-specific functionality.
 * The type and autocomplete properties are fixed for telephone input.
 */
export interface InputTextPhoneNumberProps extends Omit<InputTextBaseProps, 'type' | 'autocomplete'> {
  /** 
   * Input type is fixed to 'tel' for this semantic component.
   * This ensures proper keyboard and validation behavior across platforms.
   */
  readonly type?: 'tel';
  
  /** 
   * Autocomplete is fixed to 'tel' for browser autofill support.
   * This enables phone number suggestions from the browser.
   */
  readonly autocomplete?: 'tel';
  
  /**
   * Country code for phone number formatting and validation.
   * Defaults to 'US' if not specified.
   */
  countryCode?: string;
  
  /**
   * Whether to show the country code selector.
   * Defaults to false.
   */
  showCountrySelector?: boolean;
  
  /**
   * Callback when country code changes.
   */
  onCountryChange?: (countryCode: string) => void;
  
  /**
   * Whether to format the phone number as the user types.
   * Defaults to true.
   */
  autoFormat?: boolean;
  
  /**
   * Custom phone number validation function.
   * If not provided, uses the default validation based on country format.
   * Return true if valid, false if invalid.
   */
  customValidator?: (phoneNumber: string, countryCode: string) => boolean;
  
  /**
   * Custom error message for invalid phone number format.
   * If not provided, uses the default "Please enter a valid phone number".
   */
  invalidPhoneMessage?: string;
  
  /**
   * Callback when validation occurs.
   */
  onValidate?: (isValid: boolean, errorMessage?: string) => void;
}

/**
 * Input-Text-PhoneNumber State
 * 
 * Extends Input-Text-Base state with phone number-specific validation state.
 */
export interface InputTextPhoneNumberState extends InputTextBaseState {
  /** Whether the phone number format is valid */
  isPhoneValid: boolean;
  
  /** Whether validation has been triggered (on blur) */
  hasBeenValidated: boolean;
  
  /** Current country code */
  currentCountryCode: string;
  
  /** Formatted phone number for display */
  formattedValue: string;
  
  /** Raw digits only (no formatting) */
  rawDigits: string;
}

/**
 * Phone Number Validation Result
 * 
 * Result of phone number validation including validity and error message.
 */
export interface PhoneValidationResult {
  /** Whether the phone number is valid */
  isValid: boolean;
  
  /** Error message if invalid, undefined if valid */
  errorMessage?: string;
  
  /** Formatted phone number */
  formattedNumber?: string;
  
  /** Raw digits only */
  rawDigits?: string;
}

