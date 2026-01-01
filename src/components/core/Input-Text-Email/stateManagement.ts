/**
 * Input-Text-Email State Management
 * 
 * Extends Input-Text-Base state management with email-specific validation.
 * Handles email validation on blur and state transitions.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * State Machine (extends Input-Text-Base):
 * - All Input-Text-Base states apply
 * - Email validation triggers on blur
 * - Error state set when email format is invalid
 * 
 * Behavioral Contracts:
 * - validates_email_format: Validates email against RFC 5322 pattern
 * - provides_email_autocomplete: Enables browser email autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.3
 */

import { InputTextEmailProps, InputTextEmailState, EmailValidationResult } from './types';
import { validateEmail, DEFAULT_INVALID_EMAIL_MESSAGE } from './validation';
import {
  createInitialState as createBaseInitialState,
  handleFocus as handleBaseFocus,
  handleBlur as handleBaseBlur,
  handleValueChange as handleBaseValueChange
} from '../Input-Text-Base/stateManagement';

/**
 * Create Initial State for Input-Text-Email
 * 
 * Creates the initial component state based on props.
 * Extends Input-Text-Base initial state with email-specific fields.
 * 
 * @param props - Component props
 * @returns Initial state
 */
export function createInitialState(props: InputTextEmailProps): InputTextEmailState {
  const baseState = createBaseInitialState({
    ...props,
    type: 'email',
    autocomplete: 'email'
  });
  
  return {
    ...baseState,
    isEmailValid: true, // Assume valid until validated
    hasBeenValidated: false
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
export function handleFocus(currentState: InputTextEmailState): InputTextEmailState {
  const baseState = handleBaseFocus(currentState);
  
  return {
    ...currentState,
    ...baseState
  };
}

/**
 * Handle Blur Event with Email Validation
 * 
 * Updates state when input loses focus.
 * Triggers email validation on blur.
 * 
 * @param currentState - Current component state
 * @param value - Current input value
 * @param customValidator - Optional custom validation function
 * @param invalidEmailMessage - Optional custom error message
 * @returns Updated state with validation result
 */
export function handleBlur(
  currentState: InputTextEmailState,
  value: string,
  customValidator?: (email: string) => boolean,
  invalidEmailMessage?: string
): InputTextEmailState {
  const baseState = handleBaseBlur(currentState);
  
  // Validate email on blur
  const validationResult = validateEmail(value, customValidator, invalidEmailMessage);
  
  return {
    ...currentState,
    ...baseState,
    isEmailValid: validationResult.isValid,
    hasBeenValidated: true,
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
  currentState: InputTextEmailState,
  newValue: string
): InputTextEmailState {
  const baseState = handleBaseValueChange(currentState, newValue);
  
  // Clear email validation error when user starts typing
  // (will be re-validated on blur)
  return {
    ...currentState,
    ...baseState,
    // Keep hasBeenValidated but clear the error state while typing
    hasError: false,
    isEmailValid: true
  };
}

/**
 * Get Email Validation Error Message
 * 
 * Returns the appropriate error message based on validation state.
 * 
 * @param state - Current component state
 * @param propsErrorMessage - Error message from props (takes precedence)
 * @param invalidEmailMessage - Custom invalid email message
 * @returns Error message to display, or undefined if no error
 */
export function getEmailErrorMessage(
  state: InputTextEmailState,
  propsErrorMessage?: string,
  invalidEmailMessage?: string
): string | undefined {
  // Props error message takes precedence
  if (propsErrorMessage) {
    return propsErrorMessage;
  }
  
  // Show email validation error if validated and invalid
  if (state.hasBeenValidated && !state.isEmailValid) {
    return invalidEmailMessage || DEFAULT_INVALID_EMAIL_MESSAGE;
  }
  
  return undefined;
}

