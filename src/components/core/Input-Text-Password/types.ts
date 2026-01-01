/**
 * Input-Text-Password Component Types
 * 
 * Defines the public API and internal state interfaces for the Input-Text-Password component
 * across all platforms (web, iOS, Android).
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 */

import { InputTextBaseProps, InputTextBaseState } from '../Input-Text-Base/types';

/**
 * Password validation requirements configuration
 */
export interface PasswordRequirements {
  /** Minimum password length */
  minLength?: number;
  
  /** Maximum password length */
  maxLength?: number;
  
  /** Require at least one uppercase letter */
  requireUppercase?: boolean;
  
  /** Require at least one lowercase letter */
  requireLowercase?: boolean;
  
  /** Require at least one number */
  requireNumber?: boolean;
  
  /** Require at least one special character */
  requireSpecialChar?: boolean;
}

/**
 * Input-Text-Password Component Props
 * 
 * Extends Input-Text-Base props with password-specific functionality.
 * The type property toggles between 'password' and 'text' for visibility.
 */
export interface InputTextPasswordProps extends Omit<InputTextBaseProps, 'type' | 'autocomplete'> {
  /** 
   * Input type toggles between 'password' (masked) and 'text' (visible).
   * Controlled by showPassword prop or internal state.
   */
  readonly type?: 'password' | 'text';
  
  /** 
   * Autocomplete type for password autofill support.
   * Use 'current-password' for login forms, 'new-password' for registration/change.
   */
  readonly autocomplete?: 'current-password' | 'new-password';
  
  /**
   * Whether password is currently visible.
   * Can be controlled externally or managed internally.
   */
  showPassword?: boolean;
  
  /**
   * Callback when password visibility is toggled.
   * Receives the new visibility state.
   */
  onToggleVisibility?: (visible: boolean) => void;
  
  /**
   * Whether to show the password visibility toggle button.
   * Defaults to true.
   */
  showToggle?: boolean;
  
  /**
   * Whether this is for a new password (registration/change).
   * Affects autocomplete attribute.
   */
  isNewPassword?: boolean;
  
  /**
   * Minimum password length for validation.
   */
  minLength?: number;
  
  /**
   * Require at least one uppercase letter.
   */
  requireUppercase?: boolean;
  
  /**
   * Require at least one lowercase letter.
   */
  requireLowercase?: boolean;
  
  /**
   * Require at least one number.
   */
  requireNumber?: boolean;
  
  /**
   * Require at least one special character.
   */
  requireSpecialChar?: boolean;
  
  /**
   * Custom password validation function.
   * If not provided, uses the default validation based on requirements.
   * Return true if valid, false if invalid.
   */
  customValidator?: (password: string) => boolean;
  
  /**
   * Custom error message for invalid password.
   * If not provided, uses the default "Password does not meet requirements".
   */
  invalidPasswordMessage?: string;
}

/**
 * Input-Text-Password State
 * 
 * Extends Input-Text-Base state with password-specific state.
 */
export interface InputTextPasswordState extends InputTextBaseState {
  /** Whether the password is currently visible */
  isPasswordVisible: boolean;
  
  /** Whether the password meets requirements */
  isPasswordValid: boolean;
  
  /** Whether validation has been triggered (on blur) */
  hasBeenValidated: boolean;
  
  /** Detailed validation results for each requirement */
  validationDetails: PasswordValidationDetails;
}

/**
 * Password Validation Details
 * 
 * Detailed results for each password requirement.
 */
export interface PasswordValidationDetails {
  /** Whether minimum length is met */
  meetsMinLength: boolean;
  
  /** Whether maximum length is met */
  meetsMaxLength: boolean;
  
  /** Whether uppercase requirement is met */
  hasUppercase: boolean;
  
  /** Whether lowercase requirement is met */
  hasLowercase: boolean;
  
  /** Whether number requirement is met */
  hasNumber: boolean;
  
  /** Whether special character requirement is met */
  hasSpecialChar: boolean;
}

/**
 * Password Validation Result
 * 
 * Result of password validation including validity, error message, and details.
 */
export interface PasswordValidationResult {
  /** Whether the password is valid */
  isValid: boolean;
  
  /** Error message if invalid, undefined if valid */
  errorMessage?: string;
  
  /** Detailed validation results */
  details: PasswordValidationDetails;
}
