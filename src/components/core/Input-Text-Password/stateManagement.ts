/**
 * Input-Text-Password State Management
 * 
 * Extends Input-Text-Base state management with password-specific functionality.
 * Handles password visibility toggle and validation on blur.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 * 
 * State Machine (extends Input-Text-Base):
 * - All Input-Text-Base states apply
 * - Password visibility toggles between masked and visible
 * - Password validation triggers on blur
 * - Error state set when password doesn't meet requirements
 * 
 * Behavioral Contracts:
 * - provides_secure_input: Masks password input by default
 * - supports_password_toggle: Show/hide password functionality
 * - provides_password_autocomplete: Enables browser password autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.4
 */

import { 
  InputTextPasswordProps, 
  InputTextPasswordState, 
  PasswordRequirements,
  PasswordValidationDetails 
} from './types';
import { 
  validatePassword, 
  createDefaultValidationDetails,
  DEFAULT_INVALID_PASSWORD_MESSAGE 
} from './validation';
import {
  createInitialState as createBaseInitialState,
  handleFocus as handleBaseFocus,
  handleBlur as handleBaseBlur,
  handleValueChange as handleBaseValueChange
} from '../Input-Text-Base/stateManagement';

/**
 * Create Initial State for Input-Text-Password
 * 
 * Creates the initial component state based on props.
 * Extends Input-Text-Base initial state with password-specific fields.
 * 
 * @param props - Component props
 * @returns Initial state
 */
export function createInitialState(props: InputTextPasswordProps): InputTextPasswordState {
  const autocomplete = props.isNewPassword ? 'new-password' : 'current-password';
  const type = props.showPassword ? 'text' : 'password';
  
  const baseState = createBaseInitialState({
    ...props,
    type,
    autocomplete
  });
  
  return {
    ...baseState,
    isPasswordVisible: props.showPassword || false,
    isPasswordValid: true, // Assume valid until validated
    hasBeenValidated: false,
    validationDetails: createDefaultValidationDetails()
  };
}

/**
 * Handle Focus Event
 * 
 * Updates state when input receives focus.
 * Delegates to Input-Text-Base focus handler.
 * 
 * @param currentState - Current component state
 * @returns Updated state
 */
export function handleFocus(currentState: InputTextPasswordState): InputTextPasswordState {
  const baseState = handleBaseFocus(currentState);
  
  return {
    ...currentState,
    ...baseState
  };
}

/**
 * Handle Blur Event with Password Validation
 * 
 * Updates state when input loses focus.
 * Triggers password validation on blur.
 * 
 * @param currentState - Current component state
 * @param value - Current input value
 * @param requirements - Password requirements configuration
 * @param customValidator - Optional custom validation function
 * @param invalidPasswordMessage - Optional custom error message
 * @returns Updated state with validation result
 */
export function handleBlur(
  currentState: InputTextPasswordState,
  value: string,
  requirements: PasswordRequirements = {},
  customValidator?: (password: string) => boolean,
  invalidPasswordMessage?: string
): InputTextPasswordState {
  const baseState = handleBaseBlur(currentState);
  
  // Validate password on blur
  const validationResult = validatePassword(
    value, 
    requirements, 
    customValidator, 
    invalidPasswordMessage
  );
  
  return {
    ...currentState,
    ...baseState,
    isPasswordValid: validationResult.isValid,
    hasBeenValidated: true,
    validationDetails: validationResult.details,
    hasError: !validationResult.isValid || currentState.hasError
  };
}

/**
 * Handle Value Change
 * 
 * Updates state when input value changes.
 * Clears validation error when user starts typing again.
 * 
 * @param currentState - Current component state
 * @param newValue - New input value
 * @returns Updated state
 */
export function handleValueChange(
  currentState: InputTextPasswordState,
  newValue: string
): InputTextPasswordState {
  const baseState = handleBaseValueChange(currentState, newValue);
  
  // Clear password validation error when user starts typing
  // (will be re-validated on blur)
  return {
    ...currentState,
    ...baseState,
    // Keep hasBeenValidated but clear the error state while typing
    hasError: false,
    isPasswordValid: true,
    validationDetails: createDefaultValidationDetails()
  };
}

/**
 * Handle Password Visibility Toggle
 * 
 * Toggles password visibility between masked and visible.
 * 
 * @param currentState - Current component state
 * @returns Updated state with toggled visibility
 */
export function handleToggleVisibility(
  currentState: InputTextPasswordState
): InputTextPasswordState {
  return {
    ...currentState,
    isPasswordVisible: !currentState.isPasswordVisible
  };
}

/**
 * Set Password Visibility
 * 
 * Sets password visibility to a specific value.
 * 
 * @param currentState - Current component state
 * @param visible - Whether password should be visible
 * @returns Updated state
 */
export function setPasswordVisibility(
  currentState: InputTextPasswordState,
  visible: boolean
): InputTextPasswordState {
  return {
    ...currentState,
    isPasswordVisible: visible
  };
}

/**
 * Get Password Error Message
 * 
 * Returns the appropriate error message based on validation state.
 * 
 * @param state - Current component state
 * @param propsErrorMessage - Error message from props (takes precedence)
 * @param invalidPasswordMessage - Custom invalid password message
 * @returns Error message to display, or undefined if no error
 */
export function getPasswordErrorMessage(
  state: InputTextPasswordState,
  propsErrorMessage?: string,
  invalidPasswordMessage?: string
): string | undefined {
  // Props error message takes precedence
  if (propsErrorMessage) {
    return propsErrorMessage;
  }
  
  // Show password validation error if validated and invalid
  if (state.hasBeenValidated && !state.isPasswordValid) {
    return invalidPasswordMessage || DEFAULT_INVALID_PASSWORD_MESSAGE;
  }
  
  return undefined;
}

/**
 * Get Input Type Based on Visibility
 * 
 * Returns 'text' if password is visible, 'password' if masked.
 * 
 * @param state - Current component state
 * @returns Input type string
 */
export function getInputType(state: InputTextPasswordState): 'password' | 'text' {
  return state.isPasswordVisible ? 'text' : 'password';
}

/**
 * Get Autocomplete Value
 * 
 * Returns the appropriate autocomplete value based on isNewPassword.
 * 
 * @param isNewPassword - Whether this is for a new password
 * @returns Autocomplete attribute value
 */
export function getAutocompleteValue(isNewPassword: boolean): 'current-password' | 'new-password' {
  return isNewPassword ? 'new-password' : 'current-password';
}
