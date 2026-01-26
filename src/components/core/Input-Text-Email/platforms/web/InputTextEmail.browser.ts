/**
 * Input-Text-Email Browser Build
 * 
 * Standalone browser-compatible version of Input-Text-Email web component.
 * This file bundles all dependencies inline for direct browser usage.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 */

// Inline email validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const DEFAULT_INVALID_EMAIL_MESSAGE = 'Please enter a valid email address';

function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') {
    return true;
  }
  return EMAIL_REGEX.test(email.trim());
}

// Input-Text-Email Web Component
class InputTextEmail extends HTMLElement {
  private shadow: ShadowRoot;
  private hasBeenValidated: boolean = false;
  private isEmailValid: boolean = true;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'label',
      'value',
      'placeholder',
      'required',
      'disabled',
      'read-only',
      'error-message',
      'helper-text',
      'is-success',
      'show-info-icon',
      'invalid-email-message'
    ];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'value') {
        this.hasBeenValidated = false;
        this.isEmailValid = true;
      }
      this.render();
    }
  }

  private render() {
    const label = this.getAttribute('label') || '';
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');
    const readOnly = this.hasAttribute('read-only');
    const propsErrorMessage = this.getAttribute('error-message');
    const helperText = this.getAttribute('helper-text');
    const isSuccess = this.getAttribute('is-success') === 'true';
    const showInfoIcon = this.getAttribute('show-info-icon') === 'true';
    const invalidEmailMessage = this.getAttribute('invalid-email-message') || DEFAULT_INVALID_EMAIL_MESSAGE;

    // Determine error message
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this.hasBeenValidated && !this.isEmailValid) {
      errorMessage = invalidEmailMessage;
    }

    const hasError = !!errorMessage;
    const isFilled = value.length > 0;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          font-family: var(--typography-input-font-family, system-ui);
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          min-height: var(--tap-area-comfortable);
          background: var(--color-structure-canvas);
          border: var(--border-default) solid var(--color-structure-border);
          border-radius: var(--radius-150);
          padding-top: var(--space-inset-200);
          padding-bottom: var(--space-inset-none);
          padding-left: var(--space-inset-100);
          padding-right: var(--space-inset-100);
          transition: border-color var(--motion-float-label-duration) var(--motion-float-label-easing);
        }

        .input-container.focused {
          border-color: var(--color-action-primary);
        }

        .input-container.error {
          border-color: var(--color-error);
          background: var(--color-error-background);
        }

        .input-container.success {
          border-color: var(--color-success-strong);
        }

        .input-container.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--typography-input-font-family);
          font-size: var(--typography-input-font-size);
          line-height: var(--typography-input-line-height);
          font-weight: var(--typography-input-font-weight);
          color: var(--color-text-default);
          padding: var(--space-grouped-tight) 0;
        }

        input::placeholder {
          color: transparent;
        }

        label {
          position: absolute;
          left: var(--space-inset-100);
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--typography-label-md-font-family);
          font-size: var(--typography-label-md-font-size);
          line-height: var(--typography-label-md-line-height);
          font-weight: var(--typography-label-md-font-weight);
          color: var(--color-text-muted);
          pointer-events: none;
          transition: all var(--motion-float-label-duration) var(--motion-float-label-easing);
        }

        .input-container.focused label,
        .input-container.filled label {
          top: var(--space-grouped-minimal);
          transform: translateY(0);
          font-size: var(--typography-label-md-float-font-size);
          line-height: var(--typography-label-md-float-line-height);
          color: var(--color-action-primary);
        }

        .input-container.error label {
          color: var(--color-error);
        }

        .icon {
          margin-left: var(--space-grouped-tight);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .helper-text,
        .error-message {
          margin-top: var(--space-grouped-tight);
          font-family: var(--typography-caption-font-family);
          font-size: var(--typography-caption-font-size);
          line-height: var(--typography-caption-line-height);
          color: var(--color-text-muted);
        }

        .error-message {
          color: var(--color-error);
        }

        :host(:focus-within) .input-container {
          outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
          outline-offset: var(--accessibility-focus-offset);
        }
      </style>

      <div class="input-container ${isFilled ? 'filled' : ''} ${hasError ? 'error' : ''} ${isSuccess ? 'success' : ''} ${disabled ? 'disabled' : ''}">
        <input
          type="email"
          autocomplete="email"
          value="${value}"
          placeholder="${placeholder}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
          aria-label="${label}"
          ${hasError ? 'aria-invalid="true"' : ''}
          ${errorMessage ? `aria-describedby="error-${this.id}"` : ''}
        />
        <label>${label}${required ? ' *' : ''}</label>
        ${isSuccess ? '<span class="icon">✓</span>' : ''}
        ${hasError ? '<span class="icon">!</span>' : ''}
        ${showInfoIcon ? '<span class="icon">ℹ</span>' : ''}
      </div>

      ${helperText ? `<div class="helper-text">${helperText}</div>` : ''}
      ${errorMessage ? `<div class="error-message" id="error-${this.id}">${errorMessage}</div>` : ''}
    `;

    this.attachEventListeners();
  }

  private attachEventListeners() {
    const input = this.shadow.querySelector('input');
    if (input) {
      input.addEventListener('focus', () => {
        const container = this.shadow.querySelector('.input-container');
        container?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        const container = this.shadow.querySelector('.input-container');
        container?.classList.remove('focused');
        
        // Validate on blur
        const value = input.value;
        this.hasBeenValidated = true;
        this.isEmailValid = isValidEmail(value);
        this.render();
      });
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.setAttribute('value', target.value);
        this.hasBeenValidated = false;
        this.isEmailValid = true;
      });
    }
  }

  public validate(): { isValid: boolean; errorMessage?: string } {
    const value = this.getAttribute('value') || '';
    this.hasBeenValidated = true;
    this.isEmailValid = isValidEmail(value);
    this.render();
    
    return {
      isValid: this.isEmailValid,
      errorMessage: this.isEmailValid ? undefined : (this.getAttribute('invalid-email-message') || DEFAULT_INVALID_EMAIL_MESSAGE)
    };
  }

  public get isValid(): boolean {
    return this.isEmailValid;
  }

  public get value(): string {
    return this.getAttribute('value') || '';
  }

  public set value(newValue: string) {
    this.setAttribute('value', newValue);
  }
}

// Register the custom element
if (!customElements.get('input-text-email')) {
  customElements.define('input-text-email', InputTextEmail);
}

// Export for module usage
export { InputTextEmail };

