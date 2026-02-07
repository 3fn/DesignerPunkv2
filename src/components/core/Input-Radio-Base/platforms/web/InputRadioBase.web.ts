/**
 * Input-Radio-Base Web Component
 * 
 * Web platform implementation of the Input-Radio-Base component using Web Components.
 * Implements a single-selection control with three size variants, configurable label
 * alignment, and support for selected/unselected states.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Base
 * 
 * Features:
 * - Shadow DOM with hidden native radio for form compatibility
 * - Form-Associated Custom Element using ElementInternals for proper form submission
 * - Three size variants (sm, md, lg) with token-based sizing
 * - Label alignment (center, top) for single/multi-line labels
 * - Attribute reflection for reactive updates
 * - CSS logical properties for RTL support
 * - Blend utilities for hover state (8% darker border)
 * - Circular shape with filled dot indicator (distinguishes from checkbox)
 * 
 * Key Differences from Checkbox:
 * - Single-select (mutual exclusivity within a group) vs multi-select
 * - Circular shape with filled dot indicator vs rounded square with checkmark
 * - No indeterminate state (not applicable to radio buttons)
 * - `value` prop is required (for form submission and group identification)
 * - `name` prop is important for native radio grouping
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * 
 * @module Input-Radio-Base/platforms/web
 * @see Requirements: 8.1, 8.2, 8.6 in .kiro/specs/047-input-radio-base/requirements.md
 */

import {
  RadioSize,
  LabelAlignment,
  INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES,
  INPUT_RADIO_BASE_DEFAULTS
} from '../../types';

// Import theme-aware blend utilities for hover state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 1.3, 7.4 - Hover applies blend.hoverDarker to border
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import radioStyles from './InputRadioBase.web.css';

/** Counter for generating unique IDs when none provided */
let radioIdCounter = 0;

/**
 * Input-Radio-Base Web Component
 * 
 * Custom element implementing a radio button with Shadow DOM encapsulation,
 * Form-Associated Custom Element API for proper form submission, and token-based styling.
 * 
 * Uses ElementInternals to participate in form submission, allowing the radio value
 * to be included in FormData when the radio is selected.
 * 
 * @example
 * ```html
 * <input-radio-base
 *   label="Option A"
 *   value="option-a"
 *   name="my-group"
 *   size="md"
 *   label-align="center"
 * ></input-radio-base>
 * ```
 * 
 * @see Requirement 8.1 - Register as <input-radio-base> custom element
 * @see Requirement 8.7 - Form submission includes radio value when selected
 */
export class InputRadioBaseElement extends HTMLElement {
  /**
   * Indicates this is a form-associated custom element.
   * Required for ElementInternals form participation.
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements
   */
  static formAssociated = true;

  /** Shadow DOM root */
  private _shadowRoot: ShadowRoot;

  /**
   * ElementInternals for form association.
   * Enables the component to participate in form submission via FormData.
   * @see Requirement 8.7 - Form submission includes radio value when selected
   */
  private _internals: ElementInternals;

  /** Reference to the hidden native radio input */
  private _input: HTMLInputElement | null = null;

  /** Reference to the parent form element for reset handling */
  private _form: HTMLFormElement | null = null;

  /** Select callback (JS property, not attribute) */
  onSelect: ((value: string) => void) | null = null;

  /** Generated unique ID for label association */
  private _generatedId: string;

  /** Theme-aware blend utilities instance for hover state calculations */
  private _blendUtils: BlendUtilitiesResult;

  /** Cached hover border color (8% darker than default border) */
  private _hoverBorderColor: string = '';

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._generatedId = `radio-${++radioIdCounter}`;
    
    // Initialize ElementInternals for form association
    // This enables the component to participate in form submission
    // @see Requirement 8.7 - Form submission includes radio value when selected
    this._internals = this.attachInternals();
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 1.3, 7.4 - Hover applies blend.hoverDarker to border
    this._blendUtils = getBlendUtilities();
  }

  // ---------------------------------------------------------------------------
  // Observed Attributes
  // ---------------------------------------------------------------------------

  static get observedAttributes(): string[] {
    return [...INPUT_RADIO_BASE_OBSERVED_ATTRIBUTES];
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called when element is connected to the DOM.
   * 
   * Initializes blend utilities for hover state, attaches to parent form,
   * renders the component, and attaches event listeners.
   * 
   * @see Requirement 8.6 - Reactive updates via attributeChangedCallback
   */
  connectedCallback(): void {
    // Calculate blend colors for hover state
    // @see Requirements: 1.3, 7.4 - Hover applies blend.hoverDarker to border
    this._calculateBlendColors();
    
    // Find and attach to parent form for reset handling
    this._attachToForm();
    
    this.render();
    this._attachListeners();
    
    // Update form value based on initial selected state
    // @see Requirement 8.7 - Form submission includes radio value when selected
    this._updateFormValue();
  }

  disconnectedCallback(): void {
    this._detachListeners();
    this._detachFromForm();
  }

  /**
   * Called when an observed attribute changes.
   * 
   * Triggers re-render when attributes change to implement reactive updates.
   * Also updates form value when selected, name, or value attributes change.
   * 
   * @see Requirement 8.6 - Reactive updates via attributeChangedCallback
   * @see Requirement 8.7 - Form submission includes radio value when selected
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    if (this.isConnected) {
      this.render();
      this._attachListeners();
      
      // Update form value when relevant attributes change
      // @see Requirement 8.7 - Form submission includes radio value when selected
      if (name === 'selected' || name === 'value' || name === 'name') {
        this._updateFormValue();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Property Accessors (attribute reflection)
  // ---------------------------------------------------------------------------

  /**
   * Whether radio is selected.
   * 
   * Reflects the 'selected' attribute.
   * @see Requirement 1.1-1.2 - Selected/unselected states
   */
  get selected(): boolean {
    return this.hasAttribute('selected');
  }

  set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  /**
   * Label text.
   * 
   * Reflects the 'label' attribute.
   * @see Requirement 6.1 - Label association for accessibility
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

  /**
   * Value for form submission and group identification.
   * 
   * Reflects the 'value' attribute.
   * @see Requirement 8.9 - Value for form submission
   */
  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(value: string) {
    this.setAttribute('value', value);
  }

  /**
   * Radio group name.
   * 
   * Reflects the 'name' attribute.
   * @see Requirement 8.8 - Name attribute for radio grouping
   */
  get name(): string | null {
    return this.getAttribute('name');
  }

  set name(value: string | null) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  /**
   * Size variant.
   * 
   * Reflects the 'size' attribute.
   * @see Requirement 2.1-2.9 - Size variants
   */
  get size(): RadioSize {
    const attr = this.getAttribute('size');
    if (attr === 'sm' || attr === 'md' || attr === 'lg') return attr;
    return INPUT_RADIO_BASE_DEFAULTS.size;
  }

  set size(value: RadioSize) {
    this.setAttribute('size', value);
  }

  /**
   * Label alignment.
   * 
   * Reflects the 'label-align' attribute.
   * @see Requirement 3.1-3.4 - Label alignment options
   */
  get labelAlign(): LabelAlignment {
    const attr = this.getAttribute('label-align');
    if (attr === 'center' || attr === 'top') return attr;
    return INPUT_RADIO_BASE_DEFAULTS.labelAlign;
  }

  set labelAlign(value: LabelAlignment) {
    this.setAttribute('label-align', value);
  }

  /**
   * Helper text.
   * 
   * Reflects the 'helper-text' attribute.
   * @see Requirement 5.1, 5.6 - Helper text display and accessibility
   */
  get helperText(): string | null {
    return this.getAttribute('helper-text');
  }

  set helperText(value: string | null) {
    if (value) {
      this.setAttribute('helper-text', value);
    } else {
      this.removeAttribute('helper-text');
    }
  }

  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   * @see Requirement 5.2-5.5 - Error message display and accessibility
   */
  get errorMessage(): string | null {
    return this.getAttribute('error-message');
  }

  set errorMessage(value: string | null) {
    if (value) {
      this.setAttribute('error-message', value);
    } else {
      this.removeAttribute('error-message');
    }
  }

  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  get testID(): string | null {
    return this.getAttribute('test-id');
  }

  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }

  // ---------------------------------------------------------------------------
  // Blend Color Calculation
  // ---------------------------------------------------------------------------

  /**
   * Calculate blend colors for hover state using theme-aware blend utilities.
   * 
   * Reads the default border color from CSS custom properties and calculates
   * the hover border color by applying blend.hoverDarker (8% darker).
   * 
   * @see Requirement 1.3 - Hover feedback on border
   * @see Requirement 7.4 - Web hover applies blend.hoverDarker to border
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get the default border color (unselected state)
    // This is --color-select-not-selected-strong (color.feedback.select.border.default)
    const defaultBorderColor = computedStyle.getPropertyValue('--color-select-not-selected-strong').trim();
    
    if (defaultBorderColor) {
      // Calculate hover border color using blend.hoverDarker (8% darker)
      // @see Requirement 7.4 - Hover applies blend.hoverDarker to border
      this._hoverBorderColor = this._blendUtils.hoverColor(defaultBorderColor);
    }
  }

  // ---------------------------------------------------------------------------
  // Form Integration
  // ---------------------------------------------------------------------------

  /**
   * Update the form value using ElementInternals.
   * 
   * Sets the form value to the radio's value when selected, or null when not selected.
   * This enables the radio to participate in form submission via FormData.
   * 
   * Note: Includes graceful fallback for environments where ElementInternals.setFormValue
   * is not fully supported (e.g., JSDOM in tests).
   * 
   * @see Requirement 8.7 - Form submission includes radio value when selected
   * @see Requirement 8.9 - Value attribute for form submission value
   */
  private _updateFormValue(): void {
    // Check if setFormValue is available (not supported in all environments like JSDOM)
    if (typeof this._internals?.setFormValue !== 'function') {
      return;
    }
    
    const name = this.name;
    const value = this.value;
    const isSelected = this.selected;
    
    // Only set form value if we have a name (required for form submission)
    // When selected, set the value; when not selected, set null
    // @see Requirement 8.7 - Form submission includes radio value when selected
    if (name && isSelected) {
      this._internals.setFormValue(value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  /**
   * Attach to parent form for reset handling.
   * 
   * Finds the closest parent form element and attaches a reset event listener
   * to implement form reset behavior (always reset to unselected).
   * 
   * Form Integration Requirements:
   * - @see Requirement 8.7 - Form submission includes radio value when selected
   * - @see Requirement 8.8 - Name attribute for radio grouping
   * - @see Requirement 8.9 - Value attribute for form submission value
   * 
   * The component uses ElementInternals to participate in form submission,
   * allowing the radio value to be included in FormData when selected.
   */
  private _attachToForm(): void {
    this._form = this.closest('form');
    if (this._form) {
      this._form.addEventListener('reset', this._onFormReset);
    }
  }

  /**
   * Detach from parent form.
   * 
   * Removes the reset event listener when the component is disconnected.
   */
  private _detachFromForm(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
      this._form = null;
    }
  }

  /**
   * Handle form reset event.
   * 
   * Resets the radio to unselected state and updates the form value.
   */
  private _onFormReset = (): void => {
    // Always reset to unselected
    this.selected = false;
    
    // Sync the native input
    if (this._input) {
      this._input.checked = false;
    }
    
    // Update form value to null (not selected)
    // @see Requirement 8.7 - Form submission includes radio value when selected
    this._updateFormValue();
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  /**
   * Render the component's Shadow DOM.
   * 
   * Creates the internal structure with:
   * - Hidden native radio input for form compatibility
   * - Custom radio circle with dot indicator
   * - Label, helper text, and error message
   * 
   * @see Requirement 8.2 - Hidden native radio for form compatibility
   */
  private render(): void {
    const id = this.getAttribute('id') || this._generatedId;
    const inputId = `${id}-input`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const labelText = this.label;
    const size = this.size;
    const labelAlign = this.labelAlign;
    const isSelected = this.selected;
    const helperText = this.helperText;
    const errorMessage = this.errorMessage;
    const hasError = !!errorMessage;
    const testId = this.testID;
    const inputName = this.name;
    const inputValue = this.value;

    // Build CSS class list
    const classes = [
      'radio',
      `radio--${size}`,
      labelAlign === 'top' ? 'radio--align-top' : '',
      isSelected ? 'radio--selected' : '',
      hasError ? 'radio--error' : ''
    ].filter(Boolean).join(' ');

    // Build test-id attribute
    const testIdAttr = testId ? ` data-testid="${testId}"` : '';

    // Build aria-describedby attribute for accessibility
    // Associates helper text and error message with the radio
    // @see Requirements: 5.5, 5.6 - aria-describedby for error and helper text association
    const describedByParts: string[] = [];
    if (errorMessage) describedByParts.push(errorId);
    if (helperText) describedByParts.push(helperId);
    const ariaDescribedBy = describedByParts.length > 0 
      ? ` aria-describedby="${describedByParts.join(' ')}"` 
      : '';

    // Build helper text HTML
    // @see Requirement 5.1 - Helper text displayed below radio
    const helperTextHTML = helperText 
      ? `<span class="radio__helper" id="${helperId}">${helperText}</span>` 
      : '';

    // Build error message HTML
    // @see Requirement 5.2 - Error message displayed below helper text
    const errorMessageHTML = errorMessage 
      ? `<span class="radio__error" id="${errorId}" role="alert">${errorMessage}</span>` 
      : '';

    // Build name attribute for form submission
    // @see Requirement 8.8 - Name attribute for radio grouping
    const nameAttr = inputName ? ` name="${inputName}"` : '';

    // Build label ID for explicit for/id association
    // @see Requirement 6.1 - Associate label with radio via for/id
    const labelId = `${id}-label`;

    // Render shadow DOM
    // Structure uses explicit for/id association for accessibility
    // @see Requirement 6.1 - Label associated with radio via for/id
    // @see Requirement 6.2 - Screen reader announces state changes
    // @see Requirement 6.4 - Space key selection handled by native radio
    // @see Requirement 6.6 - Touch target minimum 44px via CSS
    this._shadowRoot.innerHTML = `
      <style>${radioStyles}</style>
      <div class="radio-container">
        <div class="${classes}"${testIdAttr}>
          <input
            type="radio"
            class="radio__input"
            id="${inputId}"${nameAttr}
            value="${inputValue}"
            aria-labelledby="${labelId}"
            ${isSelected ? 'checked' : ''}
            aria-checked="${isSelected}"
            ${hasError ? 'aria-invalid="true"' : ''}${ariaDescribedBy}
          />
          <label for="${inputId}" class="radio__touch-target">
            <span class="radio__circle">
              <span class="radio__dot"></span>
            </span>
            <span class="radio__content">
              <span class="radio__label" id="${labelId}">${labelText}</span>
            </span>
          </label>
        </div>
        ${helperTextHTML}
        ${errorMessageHTML}
      </div>
    `;

    // Store reference to native input
    this._input = this._shadowRoot.querySelector('.radio__input');

    // Ensure native input checked property is synchronized with selected state
    // This is critical for form submission - the checked property (not just attribute)
    // determines whether the radio value is included in FormData
    // @see Requirement 8.7 - Form submission includes radio value when selected
    if (this._input) {
      this._input.checked = isSelected;
    }

    // Store reference to the radio wrapper for applying blend colors
    const radioWrapper = this._shadowRoot.querySelector('.radio') as HTMLElement;
    
    // Apply blend colors as CSS custom properties
    // @see Requirements: 1.3, 7.4 - Hover applies blend.hoverDarker to border
    if (radioWrapper && this._hoverBorderColor) {
      radioWrapper.style.setProperty('--_radio-hover-border', this._hoverBorderColor);
    }
  }

  // ---------------------------------------------------------------------------
  // Event Handling
  // ---------------------------------------------------------------------------

  /**
   * Handle native radio input change event.
   * 
   * Updates the selected attribute, form value, and fires callbacks/events.
   * 
   * @see Requirement 8.7 - Form submission includes radio value when selected
   */
  private _onInputChange = (): void => {
    if (!this._input) return;

    const newSelected = this._input.checked;

    // Update attribute to reflect new state
    if (newSelected) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }

    // Update form value
    // @see Requirement 8.7 - Form submission includes radio value when selected
    this._updateFormValue();

    // Fire callback with value (not boolean like checkbox)
    if (newSelected) {
      this.onSelect?.(this.value);
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: this.value, selected: newSelected },
        bubbles: true,
        composed: true
      })
    );
  };

  private _attachListeners(): void {
    this._input?.addEventListener('change', this._onInputChange);
  }

  private _detachListeners(): void {
    this._input?.removeEventListener('change', this._onInputChange);
  }
}

// Register custom element
// @see Requirement 8.1 - Register as <input-radio-base> custom element
if (!customElements.get('input-radio-base')) {
  customElements.define('input-radio-base', InputRadioBaseElement);
}
