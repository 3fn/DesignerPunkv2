/**
 * Input-Text-Email Web Component
 * 
 * Web platform implementation of the Input-Text-Email component using Web Components.
 * Extends Input-Text-Base with email validation and autocomplete functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Email format validation on blur
 * - Browser email autocomplete support
 * - Email keyboard type on mobile
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - validates_email_format: Validates email against RFC 5322 pattern
 * - provides_email_autocomplete: Enables browser email autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.3 (Input-Text-Email validation and autocomplete)
 */

import { InputTextBase } from '../../../Input-Text-Base/platforms/web/InputTextBase.web';
import { validateEmail, DEFAULT_INVALID_EMAIL_MESSAGE } from '../../validation';

/**
 * Input-Text-Email Web Component
 * 
 * Extends Input-Text-Base with email-specific functionality.
 * Uses composition pattern to wrap the base component.
 */
export class InputTextEmail extends HTMLElement {
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  // Internal Input-Text-Base element
  private _baseInput: InputTextBase | null = null;
  
  // Email validation state
  private _hasBeenValidated: boolean = false;
  private _isEmailValid: boolean = true;
  
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
      'invalid-email-message'
    ];
  }
  
  /**
   * Connected callback - called when element is added to DOM
   */
  connectedCallback(): void {
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
    
    // Clear validation state when value changes
    if (name === 'value') {
      this._hasBeenValidated = false;
      this._isEmailValid = true;
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
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const helperText = this.getAttribute('helper-text') || '';
    const propsErrorMessage = this.getAttribute('error-message') || '';
    const isSuccess = this.getAttribute('is-success') === 'true';
    const showInfoIcon = this.getAttribute('show-info-icon') === 'true';
    const readOnly = this.hasAttribute('read-only');
    const required = this.hasAttribute('required');
    const maxLength = this.getAttribute('max-length');
    const disabled = this.hasAttribute('disabled');
    const invalidEmailMessage = this.getAttribute('invalid-email-message') || DEFAULT_INVALID_EMAIL_MESSAGE;
    
    // Determine error message (props error takes precedence over validation error)
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this._hasBeenValidated && !this._isEmailValid) {
      errorMessage = invalidEmailMessage;
    }
    
    // Build the base input element
    const baseInputHTML = `
      <input-text-base
        id="${id}"
        label="${label}"
        value="${value}"
        type="email"
        autocomplete="email"
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
    
    // Listen for change events to clear validation
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
  private onFocus = (event: Event): void => {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event - triggers email validation
   */
  private onBlur = (event: Event): void => {
    const value = this.getAttribute('value') || '';
    
    // Validate email on blur
    const validationResult = validateEmail(value);
    this._hasBeenValidated = true;
    this._isEmailValid = validationResult.isValid;
    
    // Re-render to show validation error if needed
    this.render();
    this.attachEventListeners();
    
    // Dispatch blur event
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    
    // Dispatch validation event
    this.dispatchEvent(new CustomEvent('validate', {
      detail: {
        isValid: this._isEmailValid,
        errorMessage: validationResult.errorMessage
      },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle change event - clears validation and updates value
   */
  private onChange = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const newValue = customEvent.detail?.value || '';
    
    // Update value attribute
    this.setAttribute('value', newValue);
    
    // Clear validation state when user types
    this._hasBeenValidated = false;
    this._isEmailValid = true;
    
    // Re-render to clear error state
    this.render();
    this.attachEventListeners();
    
    // Forward change event
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: newValue },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Programmatic validation method
   * 
   * Allows external code to trigger validation without blur.
   * 
   * @returns Validation result with isValid and optional errorMessage
   */
  public validate(): { isValid: boolean; errorMessage?: string } {
    const value = this.getAttribute('value') || '';
    const validationResult = validateEmail(value);
    
    this._hasBeenValidated = true;
    this._isEmailValid = validationResult.isValid;
    
    // Re-render to show validation state
    this.render();
    this.attachEventListeners();
    
    return validationResult;
  }
  
  /**
   * Check if the current value is a valid email
   */
  public get isValid(): boolean {
    return this._isEmailValid;
  }
  
  /**
   * Get the current value
   */
  public get value(): string {
    return this.getAttribute('value') || '';
  }
  
  /**
   * Set the current value
   */
  public set value(newValue: string) {
    this.setAttribute('value', newValue);
  }
}

// Register custom element
if (!customElements.get('input-text-email')) {
  customElements.define('input-text-email', InputTextEmail);
}

