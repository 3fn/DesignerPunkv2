/**
 * Input-Text-Password Web Component
 * 
 * Web platform implementation of the Input-Text-Password component using Web Components.
 * Extends Input-Text-Base with secure input and password toggle functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 * 
 * Features:
 * - Inherits all Input-Text-Base features (float label, validation states, etc.)
 * - Secure password masking by default
 * - Password visibility toggle button
 * - Password strength validation on blur
 * - Browser password autocomplete support
 * - Custom validation function support
 * 
 * Behavioral Contracts:
 * - provides_secure_input: Masks password input by default
 * - supports_password_toggle: Show/hide password functionality
 * - provides_password_autocomplete: Enables browser password autofill
 * - inherits_all_input_text_base_contracts: All base contracts apply
 * 
 * Requirements: R4.4 (Input-Text-Password secure input and toggle)
 */

import { InputTextBase } from '../../../Input-Text-Base/platforms/web/InputTextBase.web';
import { validatePassword, DEFAULT_INVALID_PASSWORD_MESSAGE } from '../../validation';
import { PasswordRequirements } from '../../types';

/**
 * Input-Text-Password Web Component
 * 
 * Extends Input-Text-Base with password-specific functionality.
 * Uses composition pattern to wrap the base component.
 */
export class InputTextPassword extends HTMLElement {
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  // Internal Input-Text-Base element
  private _baseInput: InputTextBase | null = null;
  
  // Password state
  private _isPasswordVisible: boolean = false;
  private _hasBeenValidated: boolean = false;
  private _isPasswordValid: boolean = true;
  
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
      'show-password',
      'show-toggle',
      'is-new-password',
      'min-length',
      'require-uppercase',
      'require-lowercase',
      'require-number',
      'require-special-char',
      'invalid-password-message'
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
    
    // Handle show-password attribute
    if (name === 'show-password') {
      this._isPasswordVisible = newValue === 'true';
    }
    
    // Clear validation state when value changes
    if (name === 'value') {
      this._hasBeenValidated = false;
      this._isPasswordValid = true;
      // Don't re-render for value changes - handled by onChange to preserve focus
      return;
    }
    
    if (this.isConnected) {
      this.render();
    }
  }
  
  /**
   * Get password requirements from attributes
   */
  private getRequirements(): PasswordRequirements {
    return {
      minLength: this.getAttribute('min-length') ? parseInt(this.getAttribute('min-length')!, 10) : undefined,
      maxLength: this.getAttribute('max-length') ? parseInt(this.getAttribute('max-length')!, 10) : undefined,
      requireUppercase: this.hasAttribute('require-uppercase'),
      requireLowercase: this.hasAttribute('require-lowercase'),
      requireNumber: this.hasAttribute('require-number'),
      requireSpecialChar: this.hasAttribute('require-special-char')
    };
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
    const showToggle = this.getAttribute('show-toggle') !== 'false'; // Default true
    const isNewPassword = this.hasAttribute('is-new-password');
    const invalidPasswordMessage = this.getAttribute('invalid-password-message') || DEFAULT_INVALID_PASSWORD_MESSAGE;
    
    // Determine input type based on visibility
    const inputType = this._isPasswordVisible ? 'text' : 'password';
    const autocomplete = isNewPassword ? 'new-password' : 'current-password';
    
    // Determine error message (props error takes precedence over validation error)
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this._hasBeenValidated && !this._isPasswordValid) {
      errorMessage = invalidPasswordMessage;
    }
    
    // Build the toggle button HTML
    const toggleButtonHTML = showToggle ? `
      <button 
        type="button" 
        class="toggle-button" 
        aria-label="${this._isPasswordVisible ? 'Hide password' : 'Show password'}"
        aria-pressed="${this._isPasswordVisible}"
        ${disabled ? 'disabled' : ''}
      >
        ${this._isPasswordVisible ? this.getHideIcon() : this.getShowIcon()}
      </button>
    ` : '';
    
    // Build the base input element
    const baseInputHTML = `
      <div class="password-container">
        <input-text-base
          id="${id}"
          label="${label}"
          value="${value}"
          type="${inputType}"
          autocomplete="${autocomplete}"
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
        ${toggleButtonHTML}
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      .password-container {
        position: relative;
        display: flex;
        align-items: flex-start;
      }
      
      input-text-base {
        flex: 1;
      }
      
      .toggle-button {
        position: absolute;
        right: var(--space-inset-100, 12px);
        /* Position to vertically center within the input field */
        /* The input field has min-height of tap-area-comfortable (56px) */
        /* Center the button at 28px from top (half of 56px input height) */
        top: calc(var(--tap-area-comfortable, 56px) / 2);
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: var(--space-grouped-minimal, 4px);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted, #666);
        border-radius: var(--radius-150, 4px);
        transition: color var(--motion-focus-transition-duration) var(--motion-focus-transition-easing), background-color var(--motion-focus-transition-duration) var(--motion-focus-transition-easing);
        z-index: 1;
      }
      
      .toggle-button:hover:not(:disabled) {
        color: var(--color-text-default, #333);
        background-color: var(--color-background-hover, rgba(0, 0, 0, 0.05));
      }
      
      .toggle-button:focus {
        outline: var(--accessibility-focus-width, 2px) solid var(--accessibility-focus-color, #0066cc);
        outline-offset: var(--accessibility-focus-offset, 2px);
      }
      
      .toggle-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .toggle-button svg {
        width: var(--icon-size-100, 20px);
        height: var(--icon-size-100, 20px);
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
   * Get show password icon (eye)
   */
  private getShowIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  }
  
  /**
   * Get hide password icon (eye-off)
   */
  private getHideIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`;
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
    
    // Listen for toggle button clicks
    const toggleButton = this._shadowRoot.querySelector('.toggle-button');
    if (toggleButton) {
      toggleButton.addEventListener('click', this.onToggleClick);
    }
  }
  
  /**
   * Detach event listeners
   */
  private detachEventListeners(): void {
    this._shadowRoot.removeEventListener('blur', this.onBlur, true);
    this._shadowRoot.removeEventListener('change', this.onChange, true);
    this._shadowRoot.removeEventListener('focus', this.onFocus, true);
    
    const toggleButton = this._shadowRoot.querySelector('.toggle-button');
    if (toggleButton) {
      toggleButton.removeEventListener('click', this.onToggleClick);
    }
  }
  
  /**
   * Handle focus event
   */
  private onFocus = (_event: Event): void => {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event - triggers password validation
   */
  private onBlur = (_event: Event): void => {
    const value = this.getAttribute('value') || '';
    const requirements = this.getRequirements();
    const invalidPasswordMessage = this.getAttribute('invalid-password-message') || DEFAULT_INVALID_PASSWORD_MESSAGE;
    
    // Validate password on blur
    const validationResult = validatePassword(value, requirements);
    this._hasBeenValidated = true;
    this._isPasswordValid = validationResult.isValid;
    
    // Update inner component's error-message attribute directly without re-rendering
    // This preserves focus and avoids DOM destruction
    if (this._baseInput) {
      const propsErrorMessage = this.getAttribute('error-message') || '';
      if (!propsErrorMessage && !this._isPasswordValid) {
        this._baseInput.setAttribute('error-message', invalidPasswordMessage);
      } else if (!propsErrorMessage && this._isPasswordValid) {
        this._baseInput.removeAttribute('error-message');
      }
    }
    
    // Dispatch blur event
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    
    // Dispatch validation event
    this.dispatchEvent(new CustomEvent('validate', {
      detail: {
        isValid: this._isPasswordValid,
        errorMessage: validationResult.errorMessage,
        details: validationResult.details
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
    
    // Update value attribute (this will trigger attributeChangedCallback)
    // But we DON'T want to re-render here as it would destroy focus
    this.setAttribute('value', newValue);
    
    // Clear validation state when user types
    this._hasBeenValidated = false;
    this._isPasswordValid = true;
    
    // Update the inner input's value attribute directly without re-rendering
    if (this._baseInput) {
      this._baseInput.setAttribute('value', newValue);
    }
    
    // Forward change event
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: newValue },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle toggle button click
   */
  private onToggleClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    
    // Toggle visibility
    this._isPasswordVisible = !this._isPasswordVisible;
    
    // Re-render with new visibility
    this.render();
    this.attachEventListeners();
    
    // Dispatch toggle event
    this.dispatchEvent(new CustomEvent('toggle-visibility', {
      detail: { visible: this._isPasswordVisible },
      bubbles: true,
      composed: true
    }));
    
    // Focus back on input after toggle
    const input = this._baseInput?.shadowRoot?.querySelector('input');
    if (input) {
      input.focus();
    }
  };
  
  /**
   * Programmatic validation method
   * 
   * Allows external code to trigger validation without blur.
   * 
   * @returns Validation result with isValid, errorMessage, and details
   */
  public validate(): { isValid: boolean; errorMessage?: string; details?: object } {
    const value = this.getAttribute('value') || '';
    const requirements = this.getRequirements();
    const validationResult = validatePassword(value, requirements);
    
    this._hasBeenValidated = true;
    this._isPasswordValid = validationResult.isValid;
    
    // Re-render to show validation state
    this.render();
    this.attachEventListeners();
    
    return validationResult;
  }
  
  /**
   * Toggle password visibility programmatically
   */
  public toggleVisibility(): void {
    this._isPasswordVisible = !this._isPasswordVisible;
    this.render();
    this.attachEventListeners();
  }
  
  /**
   * Set password visibility programmatically
   */
  public setVisibility(visible: boolean): void {
    this._isPasswordVisible = visible;
    this.render();
    this.attachEventListeners();
  }
  
  /**
   * Check if the current password is valid
   */
  public get isValid(): boolean {
    return this._isPasswordValid;
  }
  
  /**
   * Check if password is currently visible
   */
  public get isVisible(): boolean {
    return this._isPasswordVisible;
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
if (!customElements.get('input-text-password')) {
  customElements.define('input-text-password', InputTextPassword);
}
