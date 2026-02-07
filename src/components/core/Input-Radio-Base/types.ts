/**
 * Input-Radio-Base Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Base
 * 
 * Provides type-safe props for the Input-Radio-Base component across all platforms.
 * Input-Radio-Base is a single-selection control with three size variants,
 * configurable label alignment, and support for selected/unselected states.
 * 
 * Key Differences from Checkbox:
 * - Single-select (mutual exclusivity within a group) vs multi-select
 * - Circular shape with filled dot indicator vs rounded square with checkmark
 * - No indeterminate state (not applicable to radio buttons)
 * - `value` prop is required (for form submission and group identification)
 * - `name` prop is important for native radio grouping
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @module Input-Radio-Base/types
 * @see .kiro/specs/047-input-radio-base/design.md for design specification
 * @see Requirements 1-8 in .kiro/specs/047-input-radio-base/requirements.md
 */

/**
 * Available radio size variants.
 * 
 * Each size corresponds to specific token values:
 * - 'sm': 24px circle (16px dot + 4px inset × 2), labelSm typography, space.grouped.normal gap
 * - 'md': 32px circle (20px dot + 6px inset × 2), labelMd typography, space.grouped.normal gap
 * - 'lg': 40px circle (24px dot + 8px inset × 2), labelLg typography, space.grouped.loose gap
 * 
 * Circle Size Formula: dotSize + (inset × 2)
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * const size: RadioSize = 'md'; // Default size
 * ```
 */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * Label alignment options relative to radio circle.
 * 
 * - 'center': Vertically centers the label with the radio circle (default)
 * - 'top': Aligns the label to the top of the radio circle (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * const align: LabelAlignment = 'top'; // For multi-line labels
 * ```
 */
export type LabelAlignment = 'center' | 'top';

/**
 * Props interface for Input-Radio-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * Note: DesignerPunk does not support disabled states. If an action is
 * unavailable, the component should not be rendered.
 * 
 * @see Requirements 1-8 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const props: InputRadioBaseProps = {
 *   label: 'Option A',
 *   value: 'option-a',
 *   onSelect: (value) => console.log('Selected:', value)
 * };
 * 
 * // With all options
 * const fullProps: InputRadioBaseProps = {
 *   selected: true,
 *   label: 'Premium Plan',
 *   value: 'premium',
 *   name: 'subscription-plan',
 *   size: 'lg',
 *   labelAlign: 'top',
 *   helperText: 'Best value for teams',
 *   onSelect: (value) => handleSelect(value),
 *   testID: 'premium-plan-radio'
 * };
 * ```
 */
export interface InputRadioBaseProps {
  /**
   * Whether radio is selected.
   * 
   * When true, displays a filled circular dot centered within the outer circle.
   * When false, displays only the outer circle border.
   * 
   * @default false
   * @see Requirement 1.1-1.2 in .kiro/specs/047-input-radio-base/requirements.md
   */
  selected?: boolean;
  
  /**
   * Label text (required for accessibility).
   * 
   * The label is associated with the radio via for/id (web) or
   * accessibility label (native) for screen reader support.
   * 
   * @see Requirement 6.1 in .kiro/specs/047-input-radio-base/requirements.md
   */
  label: string;
  
  /**
   * Value for form submission and group identification.
   * 
   * This value is used to identify the radio within a group and is
   * included in form submission data when the radio is selected.
   * Unlike checkbox, this is required for radio buttons.
   * 
   * @see Requirement 8.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  value: string;
  
  /**
   * Radio group name (for native form behavior).
   * 
   * Groups radios with the same name for mutual exclusivity.
   * Important for native radio grouping and form submission.
   * 
   * @see Requirement 8.8 in .kiro/specs/047-input-radio-base/requirements.md
   */
  name?: string;
  
  /**
   * Size variant.
   * 
   * Controls the radio circle size, dot size, gap, and label typography.
   * 
   * @default 'md'
   * @see Requirement 2.1-2.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  size?: RadioSize;
  
  /**
   * Vertical alignment of label relative to radio circle.
   * 
   * Use 'top' for multi-line labels to keep the radio aligned with
   * the first line of text.
   * 
   * @default 'center'
   * @see Requirement 3.1-3.4 in .kiro/specs/047-input-radio-base/requirements.md
   */
  labelAlign?: LabelAlignment;
  
  /**
   * Helper text displayed below radio (persistent).
   * 
   * Provides additional context or instructions. Associated with radio
   * via aria-describedby for accessibility.
   * 
   * @see Requirement 5.1, 5.6 in .kiro/specs/047-input-radio-base/requirements.md
   */
  helperText?: string;
  
  /**
   * Error message displayed below helper text (conditional).
   * 
   * When provided, applies error styling to radio border and sets
   * aria-invalid="true" on the input.
   * 
   * @see Requirement 5.2-5.5 in .kiro/specs/047-input-radio-base/requirements.md
   */
  errorMessage?: string;
  
  /**
   * Called when radio is selected.
   * 
   * Invoked when user selects the radio via:
   * - Mouse click (web)
   * - Touch tap (all platforms)
   * - Keyboard Space key (web)
   * 
   * Note: Unlike checkbox onChange which receives boolean, radio onSelect
   * receives the value string since radios are single-select controls.
   * 
   * @param value - The value of the selected radio
   * @see Requirement 6.4 in .kiro/specs/047-input-radio-base/requirements.md
   */
  onSelect?: (value: string) => void;
  
  /**
   * Unique identifier.
   * 
   * Used for label association (for/id) and form integration.
   * If not provided, a unique ID will be generated.
   */
  id?: string;
  
  /**
   * Test ID for automated testing.
   * 
   * Used to identify radios in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}

/**
 * Observed attributes for the Input-Radio-Base web component.
 * 
 * These attributes trigger re-rendering when changed via attributeChangedCallback.
 * The array is defined as a constant to ensure consistency between the
 * InputRadioBaseElement class and any code that needs to reference the attributes.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export const INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES = [
  'selected',
  'label',
  'value',
  'name',
  'size',
  'label-align',
  'helper-text',
  'error-message',
  'test-id'
] as const;

/**
 * Type for observed attribute names.
 * 
 * Derived from INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES for type safety.
 */
export type InputRadioBaseObservedAttribute = typeof INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Input-Radio-Base.
 * 
 * Extends HTMLElement with Input-Radio-Base specific properties and methods.
 * This interface defines the contract for the InputRadioBaseElement web component
 * implementation.
 * 
 * @see Requirement 8.1 in .kiro/specs/047-input-radio-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Create element programmatically
 * const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
 * radio.label = 'Option A';
 * radio.value = 'option-a';
 * radio.onSelect = (value) => console.log('Selected:', value);
 * document.body.appendChild(radio);
 * 
 * // Query existing element
 * const existingRadio = document.querySelector('input-radio-base') as InputRadioBaseElement;
 * console.log(existingRadio.selected);
 * ```
 */
export interface InputRadioBaseElement extends HTMLElement {
  /**
   * Whether radio is selected.
   * 
   * Reflects the 'selected' attribute.
   * @see Requirement 1.1-1.2 in .kiro/specs/047-input-radio-base/requirements.md
   */
  selected: boolean;
  
  /**
   * Label text.
   * 
   * Reflects the 'label' attribute.
   * @see Requirement 6.1 in .kiro/specs/047-input-radio-base/requirements.md
   */
  label: string;
  
  /**
   * Value for form submission.
   * 
   * Reflects the 'value' attribute.
   * @see Requirement 8.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  value: string;
  
  /**
   * Radio group name.
   * 
   * Reflects the 'name' attribute.
   * @see Requirement 8.8 in .kiro/specs/047-input-radio-base/requirements.md
   */
  name: string | null;
  
  /**
   * Size variant.
   * 
   * Reflects the 'size' attribute.
   * @see Requirement 2.1-2.9 in .kiro/specs/047-input-radio-base/requirements.md
   */
  size: RadioSize;
  
  /**
   * Label alignment.
   * 
   * Reflects the 'label-align' attribute.
   * @see Requirement 3.1-3.4 in .kiro/specs/047-input-radio-base/requirements.md
   */
  labelAlign: LabelAlignment;
  
  /**
   * Helper text.
   * 
   * Reflects the 'helper-text' attribute.
   * @see Requirement 5.1, 5.6 in .kiro/specs/047-input-radio-base/requirements.md
   */
  helperText: string | null;
  
  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   * @see Requirement 5.2-5.5 in .kiro/specs/047-input-radio-base/requirements.md
   */
  errorMessage: string | null;
  
  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  testID: string | null;
  
  /**
   * Select callback.
   * 
   * Called when the radio is selected via user interaction.
   * This is a JavaScript property, not an HTML attribute.
   * 
   * @see Requirement 6.4 in .kiro/specs/047-input-radio-base/requirements.md
   */
  onSelect: ((value: string) => void) | null;
}

/**
 * Default values for Input-Radio-Base props.
 * 
 * These defaults are applied when props are not explicitly provided.
 * 
 * @see Design document defaults section in .kiro/specs/047-input-radio-base/design.md
 */
export const INPUT_RADIO_BASE_DEFAULTS = {
  selected: false,
  size: 'md' as RadioSize,
  labelAlign: 'center' as LabelAlignment
} as const;
