/**
 * Input-Radio-Set Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Pattern (Set)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Set
 * 
 * Provides type-safe props for the Input-Radio-Set component across all platforms.
 * Input-Radio-Set is an orchestrator component that manages a group of
 * Input-Radio-Base children, providing:
 * - Mutual exclusivity (only one radio selected at a time)
 * - Controlled selection state via selectedValue
 * - Keyboard navigation (arrow keys, Home, End)
 * - Group-level validation and error display
 * 
 * Architectural Principle: ORCHESTRATION, NOT DUPLICATION
 * Input-Radio-Set orchestrates child Input-Radio-Base components. It does NOT
 * duplicate radio circle/dot rendering logic from Base. This ensures:
 * - ~80% less code than standalone implementation
 * - Base improvements automatically benefit Set usage
 * - Single source of truth for radio rendering
 * 
 * Platform State Coordination:
 * - Web: Slot-based composition (children rendered via <slot>)
 * - iOS: Environment values pass selection state to children
 * - Android: CompositionLocal passes selection state to children
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Radio-Set/types
 * @see .kiro/specs/047-input-radio-base/design.md for design specification
 * @see Requirements 9-11 in .kiro/specs/047-input-radio-base/requirements.md
 */

import type { RadioSize } from '../Input-Radio-Base/types';

/**
 * Props interface for Input-Radio-Set component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Input-Radio-Set orchestrates child Input-Radio-Base components to provide
 * group behavior including mutual exclusivity, keyboard navigation, and validation.
 * 
 * @see Requirements 9.1-9.10, 11.1-11.5 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const props: InputRadioSetProps = {
 *   selectedValue: 'option-a',
 *   onSelectionChange: (value) => console.log('Selected:', value)
 * };
 * 
 * // With validation
 * const validatedProps: InputRadioSetProps = {
 *   selectedValue: null,
 *   onSelectionChange: (value) => handleChange(value),
 *   required: true,
 *   error: true,
 *   errorMessage: 'Please select an option',
 *   size: 'md',
 *   testID: 'subscription-plan-group'
 * };
 * ```
 */
export interface InputRadioSetProps {
  /**
   * Currently selected value (controlled).
   * 
   * When provided, the Set passes `selected={true}` to the child
   * Input-Radio-Base whose `value` matches this prop. All other
   * children receive `selected={false}`.
   * 
   * Set to null when no radio is selected.
   * 
   * @default null
   * @see Requirement 9.3 in .kiro/specs/047-input-radio-base/requirements.md
   */
  selectedValue?: string | null;

  /**
   * Callback when selection changes.
   * 
   * Invoked when a user selects a radio within the group. The callback
   * receives the `value` of the newly selected Input-Radio-Base child.
   * 
   * Note: Clicking an already-selected radio does NOT trigger this callback,
   * as radio convention prevents deselection within a group.
   * 
   * @param value - The value of the newly selected radio, or null
   * @see Requirement 9.4, 9.6 in .kiro/specs/047-input-radio-base/requirements.md
   */
  onSelectionChange?: (value: string | null) => void;

  /**
   * Whether a selection is required.
   * 
   * When true and no selection exists, validation fails. Used for
   * form validation to ensure the user makes a selection.
   * 
   * @default false
   * @see Requirement 9.7 in .kiro/specs/047-input-radio-base/requirements.md
   */
  required?: boolean;

  /**
   * Error state indicator.
   * 
   * When true, the Set displays the errorMessage and applies error
   * styling to the container.
   * 
   * @default false
   * @see Requirement 9.8 in .kiro/specs/047-input-radio-base/requirements.md
   */
  error?: boolean;

  /**
   * Error message to display.
   * 
   * Displayed above the radio group when `error` is true.
   * Uses `role="alert"` for screen reader announcement.
   * 
   * @see Requirement 9.8, 9.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  errorMessage?: string;

  /**
   * Size variant applied to all children.
   * 
   * When provided on the Set, this size is propagated to all child
   * Input-Radio-Base components, ensuring visual consistency within
   * the group.
   * 
   * @default 'md'
   * @see Requirement 9.10 in .kiro/specs/047-input-radio-base/requirements.md
   */
  size?: RadioSize;

  /**
   * Test ID for automated testing.
   * 
   * Used to identify the radio group in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}

/**
 * Observed attributes for the Input-Radio-Set web component.
 * 
 * These attributes trigger re-rendering when changed via attributeChangedCallback.
 * The array is defined as a constant to ensure consistency between the
 * InputRadioSetElement class and any code that needs to reference the attributes.
 * 
 * @see Requirement 9.1 in .kiro/specs/047-input-radio-base/requirements.md
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export const INPUT_RADIO_SET_OBSERVED_ATTRIBUTES = [
  'selected-value',
  'required',
  'error',
  'error-message',
  'size',
  'test-id'
] as const;

/**
 * Type for observed attribute names.
 * 
 * Derived from INPUT_RADIO_SET_OBSERVED_ATTRIBUTES for type safety.
 */
export type InputRadioSetObservedAttribute = typeof INPUT_RADIO_SET_OBSERVED_ATTRIBUTES[number];

/**
 * Default values for Input-Radio-Set props.
 * 
 * These defaults are applied when props are not explicitly provided.
 * 
 * @see Design document defaults section in .kiro/specs/047-input-radio-base/design.md
 */
export const INPUT_RADIO_SET_DEFAULTS = {
  selectedValue: null as string | null,
  required: false,
  error: false,
  size: 'md' as RadioSize
} as const;

/**
 * Web component interface for Input-Radio-Set.
 * 
 * Extends HTMLElement with Input-Radio-Set specific properties and methods.
 * This interface defines the contract for the InputRadioSetElement web component
 * implementation.
 * 
 * The web implementation uses slot-based composition: child Input-Radio-Base
 * elements are rendered via a <slot> element, and the Set listens for selection
 * events from children to coordinate mutual exclusivity.
 * 
 * @see Requirement 9.1, 9.2, 11.1 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Create element programmatically
 * const radioSet = document.createElement('input-radio-set') as InputRadioSetElement;
 * radioSet.size = 'md';
 * radioSet.onSelectionChange = (value) => console.log('Selected:', value);
 * 
 * // Add child radios
 * const radio1 = document.createElement('input-radio-base');
 * radio1.setAttribute('label', 'Option A');
 * radio1.setAttribute('value', 'a');
 * radioSet.appendChild(radio1);
 * 
 * document.body.appendChild(radioSet);
 * 
 * // Query existing element
 * const existingSet = document.querySelector('input-radio-set') as InputRadioSetElement;
 * console.log(existingSet.selectedValue); // 'a' or null
 * ```
 */
export interface InputRadioSetElement extends HTMLElement {
  /**
   * Currently selected value.
   * 
   * Reflects the 'selected-value' attribute.
   * @see Requirement 9.3 in .kiro/specs/047-input-radio-base/requirements.md
   */
  selectedValue: string | null;

  /**
   * Whether a selection is required.
   * 
   * Reflects the 'required' attribute.
   * @see Requirement 9.7 in .kiro/specs/047-input-radio-base/requirements.md
   */
  required: boolean;

  /**
   * Error state indicator.
   * 
   * Reflects the 'error' attribute.
   * @see Requirement 9.8 in .kiro/specs/047-input-radio-base/requirements.md
   */
  error: boolean;

  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   * @see Requirement 9.8, 9.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  errorMessage: string | null;

  /**
   * Size variant applied to all children.
   * 
   * Reflects the 'size' attribute.
   * @see Requirement 9.10 in .kiro/specs/047-input-radio-base/requirements.md
   */
  size: RadioSize;

  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  testID: string | null;

  /**
   * Selection change callback.
   * 
   * Called when a child radio is selected via user interaction.
   * This is a JavaScript property, not an HTML attribute.
   * 
   * @see Requirement 9.4 in .kiro/specs/047-input-radio-base/requirements.md
   */
  onSelectionChange: ((value: string | null) => void) | null;
}
