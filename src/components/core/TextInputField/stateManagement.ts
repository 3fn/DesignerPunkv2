/**
 * Text Input Field State Management
 * 
 * Implements state machine logic for TextInputField component behavior.
 * Handles state transitions, label positioning, and icon visibility coordination.
 * 
 * State Machine:
 * - Empty, Not Focused (default)
 * - Empty, Focused (active)
 * - Filled, Not Focused (filled)
 * - Filled, Focused (active filled)
 * - Error (any focus/fill state)
 * - Success (any focus/fill state)
 * 
 * Requirements: 1.1, 1.4, 2.1, 2.3, 4.4
 */

import { TextInputFieldState, TextInputFieldProps } from './types';

/**
 * Label Position Result
 * 
 * Describes the calculated position and styling for the label.
 */
export interface LabelPosition {
  /** Whether label should be in floated position (above input) */
  isFloated: boolean;
  
  /** Typography token to use for label */
  fontSize: string;
  
  /** Color token to use for label */
  color: string;
  
  /** Position description (for platform-specific implementation) */
  position: 'above' | 'inside';
}

/**
 * Icon Visibility Result
 * 
 * Describes which icons should be visible based on state and animation.
 */
export interface IconVisibility {
  /** Whether error icon should be visible */
  showErrorIcon: boolean;
  
  /** Whether success icon should be visible */
  showSuccessIcon: boolean;
  
  /** Whether info icon should be visible */
  showInfoIcon: boolean;
}

/**
 * Calculate Label Position
 * 
 * Determines label position, typography, and color based on component state.
 * 
 * Label floats when:
 * - Input has focus (user is interacting)
 * - Input has content (preserve context)
 * 
 * Label color changes based on:
 * - Error state: color.error
 * - Success state: color.success
 * - Focused state: color.primary
 * - Default/floated: color.text.muted
 * 
 * @param state - Current component state
 * @returns Label position configuration
 * 
 * Requirements: 1.1, 1.2, 2.1, 2.3
 */
export function calculateLabelPosition(state: TextInputFieldState): LabelPosition {
  // Label floats when input has focus OR has content
  const shouldFloat = state.isFocused || state.isFilled;
  
  // Determine label color based on state priority:
  // 1. Error state (highest priority)
  // 2. Success state
  // 3. Focused state
  // 4. Default/floated state
  let color: string;
  if (state.hasError) {
    color = 'color.error';
  } else if (state.isSuccess) {
    color = 'color.success';
  } else if (state.isFocused) {
    color = 'color.primary';
  } else {
    color = 'color.text.muted';
  }
  
  return {
    isFloated: shouldFloat,
    fontSize: shouldFloat ? 'typography.labelMdFloat' : 'typography.labelMd',
    color,
    position: shouldFloat ? 'above' : 'inside'
  };
}

/**
 * Calculate Icon Visibility
 * 
 * Determines which icons should be visible based on component state.
 * CSS transition-delay handles animation timing coordination, so this function
 * only needs to consider the current state (no animation state required).
 * 
 * Icon visibility rules:
 * - Error icon: Shows when hasError && label floated
 * - Success icon: Shows when isSuccess && label floated
 * - Info icon: Shows when showInfoIcon && (focused or filled)
 * 
 * Note: Animation timing is now handled by CSS transition-delay on the icon
 * container, eliminating the need for JavaScript-based animation coordination.
 * 
 * @param state - Current component state
 * @returns Icon visibility configuration
 * 
 * Requirements: 3.1, 3.2
 */
export function calculateIconVisibility(state: TextInputFieldState): IconVisibility {
  // Icons appear when label is floated (CSS handles animation timing)
  const labelFloated = state.isLabelFloated;
  
  return {
    showErrorIcon: state.hasError && labelFloated,
    showSuccessIcon: state.isSuccess && labelFloated,
    showInfoIcon: !!state.showInfoIcon && (state.isFocused || state.isFilled)
  };
}

/**
 * Create Initial State
 * 
 * Creates the initial component state based on props.
 * 
 * @param props - Component props
 * @returns Initial state
 */
export function createInitialState(props: TextInputFieldProps): TextInputFieldState {
  const isFilled = props.value.length > 0;
  const hasError = !!props.errorMessage;
  const isSuccess = !!props.isSuccess;
  
  return {
    isFocused: false,
    isFilled,
    hasError,
    isSuccess,
    isLabelFloated: isFilled, // Label floats if input has initial value
    showInfoIcon: props.showInfoIcon
  };
}

/**
 * Handle Focus Event
 * 
 * Updates state when input receives focus.
 * 
 * State transitions:
 * - Empty, Not Focused → Empty, Focused
 * - Filled, Not Focused → Filled, Focused
 * 
 * @param currentState - Current component state
 * @returns Updated state
 * 
 * Requirements: 1.2, 2.2
 */
export function handleFocus(currentState: TextInputFieldState): TextInputFieldState {
  return {
    ...currentState,
    isFocused: true,
    isLabelFloated: true // Label floats when focused
  };
}

/**
 * Handle Blur Event
 * 
 * Updates state when input loses focus.
 * 
 * State transitions:
 * - Empty, Focused → Empty, Not Focused (label returns)
 * - Filled, Focused → Filled, Not Focused (label stays floated)
 * 
 * @param currentState - Current component state
 * @returns Updated state
 * 
 * Requirements: 1.3, 2.3
 */
export function handleBlur(currentState: TextInputFieldState): TextInputFieldState {
  return {
    ...currentState,
    isFocused: false,
    isLabelFloated: currentState.isFilled // Label stays floated if input has content
  };
}

/**
 * Handle Value Change
 * 
 * Updates state when input value changes.
 * 
 * State transitions:
 * - Empty, Focused → Filled, Focused (user types)
 * - Filled, Focused → Empty, Focused (user clears)
 * 
 * @param currentState - Current component state
 * @param newValue - New input value
 * @returns Updated state
 * 
 * Requirements: 1.4
 */
export function handleValueChange(
  currentState: TextInputFieldState,
  newValue: string
): TextInputFieldState {
  const isFilled = newValue.length > 0;
  
  return {
    ...currentState,
    isFilled,
    isLabelFloated: currentState.isFocused || isFilled // Label floats if focused or filled
  };
}

/**
 * Handle Validation State Change
 * 
 * Updates state when validation state changes (error or success).
 * 
 * State transitions:
 * - Any State → Error (validation fails)
 * - Any State → Success (validation succeeds)
 * - Error/Success → Previous State (validation clears)
 * 
 * @param currentState - Current component state
 * @param errorMessage - Error message (if validation failed)
 * @param isSuccess - Success state (if validation succeeded)
 * @returns Updated state
 * 
 * Requirements: 2.4, 2.5
 */
export function handleValidationChange(
  currentState: TextInputFieldState,
  errorMessage?: string,
  isSuccess?: boolean
): TextInputFieldState {
  return {
    ...currentState,
    hasError: !!errorMessage,
    isSuccess: !!isSuccess
  };
}
