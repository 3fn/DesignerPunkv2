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

import { TextInputFieldState, TextInputFieldProps, LabelAnimationState } from './types';

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
 * - Default/floated: color.text.subtle
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
    color = 'color.text.subtle';
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
 * Determines which icons should be visible based on state and animation progress.
 * Icons appear after label float animation completes to avoid spatial conflicts.
 * 
 * Icon visibility rules:
 * - Error icon: Shows when hasError && label floated && animation complete
 * - Success icon: Shows when isSuccess && label floated && animation complete
 * - Info icon: Shows when showInfoIcon && (focused or filled) && animation complete
 * 
 * @param state - Current component state
 * @param animationState - Current label animation state
 * @returns Icon visibility configuration
 * 
 * Requirements: 4.4, 4.5
 */
export function calculateIconVisibility(
  state: TextInputFieldState,
  animationState: LabelAnimationState
): IconVisibility {
  // Icons appear after label floats (no spatial conflict)
  const labelFloated = state.isLabelFloated;
  const animationComplete = !animationState.isAnimating || animationState.progress >= 1.0;
  
  return {
    showErrorIcon: state.hasError && labelFloated && animationComplete,
    showSuccessIcon: state.isSuccess && labelFloated && animationComplete,
    showInfoIcon: !!state.showInfoIcon && (state.isFocused || state.isFilled) && animationComplete
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

/**
 * Create Initial Animation State
 * 
 * Creates the initial animation state (no animation in progress).
 * 
 * @returns Initial animation state
 */
export function createInitialAnimationState(): LabelAnimationState {
  return {
    isAnimating: false,
    direction: 'up',
    progress: 1.0
  };
}

/**
 * Start Label Animation
 * 
 * Initiates label animation in the specified direction.
 * 
 * @param direction - Animation direction ('up' for float, 'down' for return)
 * @returns Animation state with animation started
 */
export function startLabelAnimation(direction: 'up' | 'down'): LabelAnimationState {
  return {
    isAnimating: true,
    direction,
    progress: 0.0
  };
}

/**
 * Update Animation Progress
 * 
 * Updates animation progress (0-1).
 * 
 * @param currentState - Current animation state
 * @param progress - Animation progress (0-1)
 * @returns Updated animation state
 */
export function updateAnimationProgress(
  currentState: LabelAnimationState,
  progress: number
): LabelAnimationState {
  return {
    ...currentState,
    progress: Math.max(0, Math.min(1, progress)) // Clamp to 0-1
  };
}

/**
 * Complete Label Animation
 * 
 * Marks animation as complete.
 * 
 * @param currentState - Current animation state
 * @returns Animation state with animation complete
 */
export function completeLabelAnimation(
  currentState: LabelAnimationState
): LabelAnimationState {
  return {
    ...currentState,
    isAnimating: false,
    progress: 1.0
  };
}
