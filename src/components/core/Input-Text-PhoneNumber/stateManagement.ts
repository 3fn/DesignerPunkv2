/**
 * Input-Text-PhoneNumber State Management
 * 
 * Extends Input-Text-Base state management with phone number-specific functionality.
 * Handles phone number formatting and validation on blur.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 * 
 * State Machine (extends Input-Text-Base):
 * - All Input-Text-Base states apply
 * - Phone number formatting as user types
 * - Phone number validation triggers on blur
 * - Error state set when phone number format is invalid
 * 
 * Behavioral Contracts:
 * - validates_phone_format: Validates phone number against country-specific patterns
 * - provides_phone_formatting: Formats phone numbers as user types
 * - supports_international_formats: Handles multiple country formats
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.5
 */

import { InputTextPhoneNumberProps, InputTextPhoneNumberState } from './types';
import { 
  validatePhoneNumber, 
  parsePhoneInput,
  DEFAULT_INVALID_PHONE_MESSAGE,
  DEFAULT_COUNTRY_CODE,
  extractDigits,
  formatPhoneNumber
} from './validation';
import {
  createInitialState as createBaseInitialState,
  handleFocus as handleBaseFocus,
  handleBlur as handleBaseBlur,
  handleValueChange as handleBaseValueChange
} from '../Input-Text-Base/stateManagement';

/**
 * Create Initial State for Input-Text-PhoneNumber
 * 
 * Creates the initial component state based on props.
 * Extends Input-Text-Base initial state with phone number-specific fields.
 * 
 * @param props - Component props
 * @returns Initial state
 */
export function createInitialState(props: InputTextPhoneNumberProps): InputTextPhoneNumberState {
  const countryCode = props.countryCode || DEFAULT_COUNTRY_CODE;
  const rawDigits = extractDigits(props.value || '');
  const formattedValue = formatPhoneNumber(rawDigits, countryCode);
  
  const baseState = createBaseInitialState({
    ...props,
    type: 'tel',
    autocomplete: 'tel',
    value: formattedValue
  });
  
  return {
    ...baseState,
    isPhoneValid: true, // Assume valid until validated
    hasBeenValidated: false,
    currentCountryCode: countryCode,
    formattedValue,
    rawDigits
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
export function handleFocus(currentState: InputTextPhoneNumberState): InputTextPhoneNumberState {
  const baseState = handleBaseFocus(currentState);
  
  return {
    ...currentState,
    ...baseState
  };
}

/**
 * Handle Blur Event with Phone Number Validation
 * 
 * Updates state when input loses focus.
 * Triggers phone number validation on blur.
 * 
 * @param currentState - Current component state
 * @param value - Current input value
 * @param customValidator - Optional custom validation function
 * @param invalidPhoneMessage - Optional custom error message
 * @returns Updated state with validation result
 */
export function handleBlur(
  currentState: InputTextPhoneNumberState,
  value: string,
  customValidator?: (phoneNumber: string, countryCode: string) => boolean,
  invalidPhoneMessage?: string
): InputTextPhoneNumberState {
  const baseState = handleBaseBlur(currentState);
  
  // Validate phone number on blur
  const validationResult = validatePhoneNumber(
    value, 
    currentState.currentCountryCode,
    customValidator, 
    invalidPhoneMessage
  );
  
  return {
    ...currentState,
    ...baseState,
    isPhoneValid: validationResult.isValid,
    hasBeenValidated: true,
    hasError: !validationResult.isValid || currentState.hasError
  };
}

/**
 * Handle Value Change with Auto-Formatting
 * 
 * Updates state when input value changes.
 * Formats phone number as user types.
 * Clears validation error when user starts typing again.
 * 
 * @param currentState - Current component state
 * @param newValue - New input value
 * @param autoFormat - Whether to auto-format the phone number
 * @returns Updated state with formatted value
 */
export function handleValueChange(
  currentState: InputTextPhoneNumberState,
  newValue: string,
  autoFormat: boolean = true
): InputTextPhoneNumberState {
  const { formatted, rawDigits } = parsePhoneInput(
    newValue,
    currentState.formattedValue,
    currentState.currentCountryCode
  );
  
  const displayValue = autoFormat ? formatted : newValue;
  const baseState = handleBaseValueChange(currentState, displayValue);
  
  // Clear phone validation error when user starts typing
  // (will be re-validated on blur)
  return {
    ...currentState,
    ...baseState,
    formattedValue: formatted,
    rawDigits,
    // Keep hasBeenValidated but clear the error state while typing
    hasError: false,
    isPhoneValid: true
  };
}

/**
 * Handle Country Code Change
 * 
 * Updates state when country code changes.
 * Re-formats the phone number for the new country.
 * 
 * @param currentState - Current component state
 * @param newCountryCode - New country code
 * @returns Updated state with new country and re-formatted number
 */
export function handleCountryChange(
  currentState: InputTextPhoneNumberState,
  newCountryCode: string
): InputTextPhoneNumberState {
  const formatted = formatPhoneNumber(currentState.rawDigits, newCountryCode);
  
  return {
    ...currentState,
    currentCountryCode: newCountryCode,
    formattedValue: formatted,
    // Clear validation when country changes
    hasBeenValidated: false,
    isPhoneValid: true,
    hasError: false
  };
}

/**
 * Get Phone Number Error Message
 * 
 * Returns the appropriate error message based on validation state.
 * 
 * @param state - Current component state
 * @param propsErrorMessage - Error message from props (takes precedence)
 * @param invalidPhoneMessage - Custom invalid phone message
 * @returns Error message to display, or undefined if no error
 */
export function getPhoneErrorMessage(
  state: InputTextPhoneNumberState,
  propsErrorMessage?: string,
  invalidPhoneMessage?: string
): string | undefined {
  // Props error message takes precedence
  if (propsErrorMessage) {
    return propsErrorMessage;
  }
  
  // Show phone validation error if validated and invalid
  if (state.hasBeenValidated && !state.isPhoneValid) {
    return invalidPhoneMessage || DEFAULT_INVALID_PHONE_MESSAGE;
  }
  
  return undefined;
}

/**
 * Get Display Value
 * 
 * Returns the value to display in the input.
 * Uses formatted value if auto-format is enabled.
 * 
 * @param state - Current component state
 * @param autoFormat - Whether auto-format is enabled
 * @returns Display value
 */
export function getDisplayValue(
  state: InputTextPhoneNumberState,
  autoFormat: boolean = true
): string {
  return autoFormat ? state.formattedValue : state.rawDigits;
}

/**
 * Get Raw Phone Number
 * 
 * Returns the raw digits without formatting.
 * 
 * @param state - Current component state
 * @returns Raw digits string
 */
export function getRawPhoneNumber(state: InputTextPhoneNumberState): string {
  return state.rawDigits;
}

