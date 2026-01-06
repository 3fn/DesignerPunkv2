/**
 * Input-Text-PhoneNumber Web Component
 * 
 * Web platform implementation of the Input-Text-PhoneNumber component using Web Components.
 * Extends Input-Text-Base with phone number formatting and validation functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Phone number format validation on blur
 * - Auto-formatting as user types
 * - International format support
 * - Browser phone autocomplete support
 * - Phone keyboard type on mobile
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - validates_phone_format: Validates phone against country-specific patterns
 * - provides_phone_formatting: Formats phone numbers as user types
 * - supports_international_formats: Handles multiple country formats
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.5 (Input-Text-PhoneNumber formatting and validation)
 */

import { InputTextBase } from '../../../Input-Text-Base/platforms/web/InputTextBase.web';
import { 
  validatePhoneNumber, 
  parsePhoneInput,
  formatPhoneNumber,
  extractDigits,
  DEFAULT_INVALID_PHONE_MESSAGE,
  DEFAULT_COUNTRY_CODE 
} from '../../validation';

/**
 * Input-Text-PhoneNumber Web Component
 * 
 * Extends Input-Text-Base with phone number-specific functionality.
 * Uses composition pattern to wrap the base component.
 */
export class InputTextPhoneNumber extends HTMLElement {
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  // Internal Input-Text-Base element
  private _baseInput: InputTextBase | null = null;
  
  // Phone validation state
  private _hasBeenValidated: boolean = false;
  private _isPhoneValid: boolean = true;
  private _currentCountryCode: string = DEFAULT_COUNTRY_CODE;
  private _rawDigits: string = '';
  private _formattedValue: string = '';
  
  constructor() {
    super();
    
    // Initialize shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Get shadow root (for testing and external access)
   */
  get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }
  
  /**
   * Observed attributes for attribute change callbacks
   */
  static get observedAttributes(): string[] {
    return [
      'id',
      'label',
      'value',
      'placeholder',
      'helper-text',
      'error-message',
      'is-success',
      'show-info-icon',
      'read-only',
      'required',
      'max-length',
      'disabled',
      'country-code',
      'auto-format',
      'invalid-phone-message'
    ];
  }
  
  /**
   * Connected callback - called when element is added to DOM
   */
  connectedCallback(): void {
    this._currentCountryCode = this.getAttribute('country-code') || DEFAULT_COUNTRY_CODE;
    const initialValue = this.getAttribute('value') || '';
    this._rawDigits = extractDigits(initialValue);
    this._formattedValue = formatPhoneNumber(this._rawDigits, this._currentCountryCode);
    
    this.render();
    this.attachEventListeners();
  }
  
  /**
   * Disconnected callback - called when element is removed from DOM
   */
  disconnectedCallback(): void {
    this.detachEventListeners();
  }
  
  /**
   * Attribute changed callback - called when observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    
    // Handle country code change
    if (name === 'country-code' && newValue) {
      this._currentCountryCode = newValue;
      this._formattedValue = formatPhoneNumber(this._rawDigits, this._currentCountryCode);
      this._hasBeenValidated = false;
      this._isPhoneValid = true;
    }
    
    // Clear validation state when value changes externally
    if (name === 'value' && newValue !== null) {
      this._rawDigits = extractDigits(newValue);
      this._formattedValue = formatPhoneNumber(this._rawDigits, this._currentCountryCode);
      this._hasBeenValidated = false;
      this._isPhoneValid = true;
      // Don't re-render for value changes - handled by onChange to preserve focus
      return;
    }
    
    if (this.isConnected) {
      this.render();
    }
  }
  
  /**
   * Render component
   */
  private render(): void {
    const id = this.getAttribute('id') || '';
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const helperText = this.getAttribute('helper-text') || '';
    const propsErrorMessage = this.getAttribute('error-message') || '';
    const isSuccess = this.getAttribute('is-success') === 'true';
    const showInfoIcon = this.getAttribute('show-info-icon') === 'true';
    const readOnly = this.hasAttribute('read-only');
    const required = this.hasAttribute('required');
    const maxLength = this.getAttribute('max-length');
    const disabled = this.hasAttribute('disabled');
    const autoFormat = this.getAttribute('auto-format') !== 'false';
    const invalidPhoneMessage = this.getAttribute('invalid-phone-message') || DEFAULT_INVALID_PHONE_MESSAGE;
    
    // Determine display value
    const displayValue = autoFormat ? this._formattedValue : this._rawDigits;
    
    // Determine error message (props error takes precedence over validation error)
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this._hasBeenValidated && !this._isPhoneValid) {
      errorMessage = invalidPhoneMessage;
    }
    
    // Build the base input element
    const baseInputHTML = `
      <input-text-base
        id="${id}"
        label="${label}"
        value="${displayValue}"
        type="tel"
        autocomplete="tel"
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${helperText ? `helper-text="${helperText}"` : ''}
        ${errorMessage ? `error-message="${errorMessage}"` : ''}
        ${isSuccess ? 'is-success="true"' : ''}
        ${showInfoIcon ? 'show-info-icon="true"' : ''}
        ${readOnly ? 'read-only' : ''}
        ${required ? 'required' : ''}
        ${maxLength ? `max-length="${maxLength}"` : ''}
        ${disabled ? 'disabled' : ''}
      ></input-text-base>
    `;
    
    // Add styles (minimal - mostly inherited from base)
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
    `;
    
    // Clear shadow root and append new content
    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(style);
    
    const container = document.createElement('div');
    container.innerHTML = baseInputHTML;
    this._shadowRoot.appendChild(container);
    
    // Store reference to base input
    this._baseInput = this._shadowRoot.querySelector('input-text-base');
  }
  
  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    // Listen for blur events to trigger validation
    this._shadowRoot.addEventListener('blur', this.onBlur, true);
    
    // Listen for change events to format and update value
    this._shadowRoot.addEventListener('change', this.onChange, true);
    
    // Forward focus events
    this._shadowRoot.addEventListener('focus', this.onFocus, true);
  }
  
  /**
   * Detach event listeners
   */
  private detachEventListeners(): void {
    this._shadowRoot.removeEventListener('blur', this.onBlur, true);
    this._shadowRoot.removeEventListener('change', this.onChange, true);
    this._shadowRoot.removeEventListener('focus', this.onFocus, true);
  }
  
  /**
   * Handle focus event
   */
  private onFocus = (_event: Event): void => {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event - triggers phone validation
   */
  private onBlur = (_event: Event): void => {
    const invalidPhoneMessage = this.getAttribute('invalid-phone-message') || DEFAULT_INVALID_PHONE_MESSAGE;
    
    // Validate phone on blur
    const validationResult = validatePhoneNumber(this._rawDigits, this._currentCountryCode);
    this._hasBeenValidated = true;
    this._isPhoneValid = validationResult.isValid;
    
    // Update inner component's error-message attribute directly without re-rendering
    // This preserves focus and avoids DOM destruction
    if (this._baseInput) {
      const propsErrorMessage = this.getAttribute('error-message') || '';
      if (!propsErrorMessage && !this._isPhoneValid) {
        this._baseInput.setAttribute('error-message', invalidPhoneMessage);
      } else if (!propsErrorMessage && this._isPhoneValid) {
        this._baseInput.removeAttribute('error-message');
      }
    }
    
    // Dispatch blur event
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    
    // Dispatch validation event
    this.dispatchEvent(new CustomEvent('validate', {
      detail: {
        isValid: this._isPhoneValid,
        errorMessage: validationResult.errorMessage,
        formattedNumber: this._formattedValue,
        rawDigits: this._rawDigits
      },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle change event - formats and updates value
   */
  private onChange = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const newValue = customEvent.detail?.value || '';
    const autoFormat = this.getAttribute('auto-format') !== 'false';
    
    // Parse and format the input
    const { formatted, rawDigits } = parsePhoneInput(
      newValue,
      this._formattedValue,
      this._currentCountryCode
    );
    
    this._rawDigits = rawDigits;
    this._formattedValue = formatted;
    
    // Clear validation state when user types
    this._hasBeenValidated = false;
    this._isPhoneValid = true;
    
    // Update value attribute with formatted or raw value
    const displayValue = autoFormat ? formatted : rawDigits;
    this.setAttribute('value', displayValue);
    
    // Update the inner input's value attribute directly without re-rendering
    // This preserves focus while updating the displayed value
    if (this._baseInput) {
      this._baseInput.setAttribute('value', displayValue);
    }
    
    // Forward change event with both formatted and raw values
    this.dispatchEvent(new CustomEvent('change', {
      detail: { 
        value: displayValue,
        formattedValue: formatted,
        rawDigits: rawDigits
      },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Programmatic validation method
   * 
   * Allows external code to trigger validation without blur.
   * 
   * @returns Validation result with isValid, errorMessage, and formatted number
   */
  public validate(): { isValid: boolean; errorMessage?: string; formattedNumber?: string; rawDigits?: string } {
    const validationResult = validatePhoneNumber(this._rawDigits, this._currentCountryCode);
    
    this._hasBeenValidated = true;
    this._isPhoneValid = validationResult.isValid;
    
    // Re-render to show validation state
    this.render();
    this.attachEventListeners();
    
    return {
      ...validationResult,
      formattedNumber: this._formattedValue,
      rawDigits: this._rawDigits
    };
  }
  
  /**
   * Check if the current value is a valid phone number
   */
  public get isValid(): boolean {
    return this._isPhoneValid;
  }
  
  /**
   * Get the current formatted value
   */
  public get value(): string {
    return this._formattedValue;
  }
  
  /**
   * Set the current value
   */
  public set value(newValue: string) {
    this.setAttribute('value', newValue);
  }
  
  /**
   * Get the raw digits (no formatting)
   */
  public get rawDigits(): string {
    return this._rawDigits;
  }
  
  /**
   * Get the current country code
   */
  public get countryCode(): string {
    return this._currentCountryCode;
  }
  
  /**
   * Set the country code
   */
  public set countryCode(code: string) {
    this.setAttribute('country-code', code);
  }
}

// Register custom element
if (!customElements.get('input-text-phone-number')) {
  customElements.define('input-text-phone-number', InputTextPhoneNumber);
}

