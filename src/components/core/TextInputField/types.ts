/**
 * Text Input Field Component Types
 * 
 * Defines the public API and internal state interfaces for the TextInputField component
 * across all platforms (web, iOS, Android).
 */

/**
 * Text Input Field Component Props
 * 
 * Defines the public API for the TextInputField component across all platforms.
 */
export interface TextInputFieldProps {
  /** Unique identifier for the input element */
  id: string;
  
  /** Label text (floats between placeholder and floated positions) */
  label: string;
  
  /** Current input value */
  value: string;
  
  /** Callback when value changes */
  onChange: (value: string) => void;
  
  /** Callback when input receives focus */
  onFocus?: () => void;
  
  /** Callback when input loses focus */
  onBlur?: () => void;
  
  /** Helper text displayed below input (persistent) */
  helperText?: string;
  
  /** Error message displayed below helper text (conditional) */
  errorMessage?: string;
  
  /** Success state indicator (shows success icon) */
  isSuccess?: boolean;
  
  /** Info icon support (shows info icon, triggers helper text) */
  showInfoIcon?: boolean;
  
  /** Input type (text, email, password, etc.) */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  
  /** Autocomplete attribute for browser autofill */
  autocomplete?: string;
  
  /** Placeholder text (only shown when label is floated and input is empty) */
  placeholder?: string;
  
  /** Read-only state (alternative to disabled) */
  readOnly?: boolean;
  
  /** Required field indicator */
  required?: boolean;
  
  /** Maximum length for input value */
  maxLength?: number;
  
  /** Test ID for automated testing */
  testID?: string;
  
  /** Additional CSS class names (web only) */
  className?: string;
}

/**
 * Text Input Field State
 * 
 * Internal state management for component behavior.
 */
export interface TextInputFieldState {
  /** Whether input currently has focus */
  isFocused: boolean;
  
  /** Whether input has content (determines label position) */
  isFilled: boolean;
  
  /** Whether input is in error state */
  hasError: boolean;
  
  /** Whether input is in success state */
  isSuccess: boolean;
  
  /** Whether label should be in floated position */
  isLabelFloated: boolean;
  
  /** Whether info icon should be shown (from props) */
  showInfoIcon?: boolean;
}
