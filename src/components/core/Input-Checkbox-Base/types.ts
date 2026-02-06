/**
 * Input-Checkbox-Base Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Checkbox-Base
 * 
 * Provides type-safe props for the Input-Checkbox-Base component across all platforms.
 * Input-Checkbox-Base is a binary selection control with three size variants,
 * configurable label alignment, and support for checked, unchecked, and indeterminate states.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @module Input-Checkbox-Base/types
 * @see .kiro/specs/046-input-checkbox-base/design.md for design specification
 * @see Requirements 1-8 in .kiro/specs/046-input-checkbox-base/requirements.md
 */

/**
 * Available checkbox size variants.
 * 
 * Each size corresponds to specific token values:
 * - 'sm': 24px box (16px icon + 4px inset × 2), labelSm typography
 * - 'md': 32px box (20px icon + 6px inset × 2), labelMd typography
 * - 'lg': 40px box (24px icon + 8px inset × 2), labelLg typography
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * const size: CheckboxSize = 'md'; // Default size
 * ```
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Label alignment options relative to checkbox box.
 * 
 * - 'center': Vertically centers the label with the checkbox box (default)
 * - 'top': Aligns the label to the top of the checkbox box (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * const align: LabelAlignment = 'top'; // For multi-line labels
 * ```
 */
export type LabelAlignment = 'center' | 'top';

/**
 * Label typography override options.
 * 
 * Allows overriding the default label typography which normally matches the size variant.
 * This is primarily used by Input-Checkbox-Legal which needs lg box size with sm typography.
 * 
 * - 'inherit': Uses typography matching the size variant (default behavior)
 * - 'sm': Forces labelSm typography regardless of size
 * - 'md': Forces labelMd typography regardless of size
 * - 'lg': Forces labelLg typography regardless of size
 * 
 * @see Requirement 9.1 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Legal checkbox uses lg box with sm typography
 * const typography: LabelTypography = 'sm';
 * ```
 */
export type LabelTypography = 'inherit' | 'sm' | 'md' | 'lg';

/**
 * Props interface for Input-Checkbox-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * Note: DesignerPunk does not support disabled states. If an action is
 * unavailable, the component should not be rendered.
 * 
 * @see Requirements 1-8 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const props: InputCheckboxBaseProps = {
 *   label: 'Accept terms',
 *   onChange: (checked) => console.log('Checked:', checked)
 * };
 * 
 * // With all options
 * const fullProps: InputCheckboxBaseProps = {
 *   checked: true,
 *   label: 'Subscribe to newsletter',
 *   size: 'lg',
 *   labelAlign: 'top',
 *   helperText: 'We will send weekly updates',
 *   onChange: (checked) => handleChange(checked),
 *   testID: 'newsletter-checkbox'
 * };
 * ```
 */
export interface InputCheckboxBaseProps {
  /**
   * Whether checkbox is checked.
   * 
   * @default false
   * @see Requirement 1.1-1.2 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  checked?: boolean;
  
  /**
   * Indeterminate state (overrides checked visually).
   * 
   * When true, displays a horizontal dash icon instead of checkmark,
   * indicating partial selection (e.g., parent checkbox with some children selected).
   * 
   * @default false
   * @see Requirement 1.3 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  indeterminate?: boolean;
  
  /**
   * Label text (required for accessibility).
   * 
   * The label is associated with the checkbox via for/id (web) or
   * accessibility label (native) for screen reader support.
   * 
   * @see Requirement 6.1 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  label: string;
  
  /**
   * Size variant.
   * 
   * Controls the checkbox box size, icon size, gap, and label typography.
   * 
   * @default 'md'
   * @see Requirement 2.1-2.9 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  size?: CheckboxSize;
  
  /**
   * Vertical alignment of label relative to checkbox box.
   * 
   * Use 'top' for multi-line labels to keep the checkbox aligned with
   * the first line of text.
   * 
   * @default 'center'
   * @see Requirement 3.1-3.4 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  labelAlign?: LabelAlignment;
  
  /**
   * Override label typography independent of size variant.
   * 
   * By default ('inherit'), label typography matches the size variant:
   * - sm size → labelSm typography
   * - md size → labelMd typography
   * - lg size → labelLg typography
   * 
   * This prop allows overriding that behavior, primarily for Input-Checkbox-Legal
   * which uses lg box size with sm typography.
   * 
   * @default 'inherit'
   * @see Requirement 9.1 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  labelTypography?: LabelTypography;
  
  /**
   * Helper text displayed below checkbox (persistent).
   * 
   * Provides additional context or instructions. Associated with checkbox
   * via aria-describedby for accessibility.
   * 
   * @see Requirement 5.1, 5.6 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  helperText?: string;
  
  /**
   * Error message displayed below helper text (conditional).
   * 
   * When provided, applies error styling to checkbox border and sets
   * aria-invalid="true" on the input.
   * 
   * @see Requirement 5.2-5.5 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  errorMessage?: string;
  
  /**
   * Called when checkbox state changes.
   * 
   * Invoked when user toggles the checkbox via:
   * - Mouse click (web)
   * - Touch tap (all platforms)
   * - Keyboard Space key (web)
   * 
   * @param checked - The new checked state
   * @see Requirement 6.4 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  onChange?: (checked: boolean) => void;
  
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
   * Used to identify checkboxes in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
  
  /**
   * Form field name for form submission.
   * 
   * When provided, the checkbox value will be included in form submission
   * data under this name. Required for form integration.
   * 
   * @see Requirement 8.7 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  name?: string;
  
  /**
   * Value submitted with form when checkbox is checked.
   * 
   * This value is included in form submission data when the checkbox
   * is checked. If not provided, defaults to 'on' (standard HTML behavior).
   * 
   * @default 'on'
   * @see Requirement 8.7 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  value?: string;
}

/**
 * Observed attributes for the Input-Checkbox-Base web component.
 * 
 * These attributes trigger re-rendering when changed via attributeChangedCallback.
 * The array is defined as a constant to ensure consistency between the
 * InputCheckboxBaseElement class and any code that needs to reference the attributes.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export const INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES = [
  'checked',
  'indeterminate',
  'label',
  'size',
  'label-align',
  'label-typography',
  'helper-text',
  'error-message',
  'test-id',
  'name',
  'value'
] as const;

/**
 * Type for observed attribute names.
 * 
 * Derived from INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES for type safety.
 */
export type InputCheckboxBaseObservedAttribute = typeof INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Input-Checkbox-Base.
 * 
 * Extends HTMLElement with Input-Checkbox-Base specific properties and methods.
 * This interface defines the contract for the InputCheckboxBaseElement web component
 * implementation.
 * 
 * @see Requirement 8.1 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Create element programmatically
 * const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
 * checkbox.label = 'Accept terms';
 * checkbox.onChange = (checked) => console.log('Checked:', checked);
 * document.body.appendChild(checkbox);
 * 
 * // Query existing element
 * const existingCheckbox = document.querySelector('input-checkbox-base') as InputCheckboxBaseElement;
 * console.log(existingCheckbox.checked);
 * ```
 */
export interface InputCheckboxBaseElement extends HTMLElement {
  /**
   * Whether checkbox is checked.
   * 
   * Reflects the 'checked' attribute.
   */
  checked: boolean;
  
  /**
   * Indeterminate state.
   * 
   * Reflects the 'indeterminate' attribute.
   */
  indeterminate: boolean;
  
  /**
   * Label text.
   * 
   * Reflects the 'label' attribute.
   */
  label: string;
  
  /**
   * Size variant.
   * 
   * Reflects the 'size' attribute.
   */
  size: CheckboxSize;
  
  /**
   * Label alignment.
   * 
   * Reflects the 'label-align' attribute.
   */
  labelAlign: LabelAlignment;
  
  /**
   * Label typography override.
   * 
   * Reflects the 'label-typography' attribute.
   */
  labelTypography: LabelTypography;
  
  /**
   * Helper text.
   * 
   * Reflects the 'helper-text' attribute.
   */
  helperText: string | null;
  
  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   */
  errorMessage: string | null;
  
  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  testID: string | null;
  
  /**
   * Form field name.
   * 
   * Reflects the 'name' attribute.
   */
  name: string | null;
  
  /**
   * Form field value when checked.
   * 
   * Reflects the 'value' attribute.
   */
  value: string;
  
  /**
   * Change callback.
   * 
   * Called when the checkbox state changes via user interaction.
   * This is a JavaScript property, not an HTML attribute.
   */
  onChange: ((checked: boolean) => void) | null;
}

/**
 * Default values for Input-Checkbox-Base props.
 * 
 * These defaults are applied when props are not explicitly provided.
 * 
 * @see Design document defaults section
 */
export const INPUT_CHECKBOX_BASE_DEFAULTS = {
  checked: false,
  indeterminate: false,
  size: 'md' as CheckboxSize,
  labelAlign: 'center' as LabelAlignment,
  labelTypography: 'inherit' as LabelTypography
} as const;
