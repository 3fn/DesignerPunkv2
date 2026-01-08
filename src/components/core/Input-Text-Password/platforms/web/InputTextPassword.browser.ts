/**
 * Input-Text-Password Browser Build
 * 
 * Standalone browser-compatible version of Input-Text-Password web component.
 * This file bundles all dependencies inline for direct browser usage.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 */

// Inline password validation
const DEFAULT_INVALID_PASSWORD_MESSAGE = 'Password does not meet requirements';

const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
};

interface PasswordRequirements {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

interface PasswordValidationDetails {
  meetsMinLength: boolean;
  meetsMaxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

function validatePasswordRequirements(
  password: string,
  requirements: PasswordRequirements
): PasswordValidationDetails {
  return {
    meetsMinLength: requirements.minLength === undefined || password.length >= requirements.minLength,
    meetsMaxLength: requirements.maxLength === undefined || password.length <= requirements.maxLength,
    hasUppercase: !requirements.requireUppercase || PASSWORD_PATTERNS.uppercase.test(password),
    hasLowercase: !requirements.requireLowercase || PASSWORD_PATTERNS.lowercase.test(password),
    hasNumber: !requirements.requireNumber || PASSWORD_PATTERNS.number.test(password),
    hasSpecialChar: !requirements.requireSpecialChar || PASSWORD_PATTERNS.specialChar.test(password)
  };
}

function allRequirementsMet(details: PasswordValidationDetails): boolean {
  return (
    details.meetsMinLength &&
    details.meetsMaxLength &&
    details.hasUppercase &&
    details.hasLowercase &&
    details.hasNumber &&
    details.hasSpecialChar
  );
}

// Input-Text-Password Web Component
class InputTextPassword extends HTMLElement {
  private shadow: ShadowRoot;
  private isPasswordVisible: boolean = false;
  private hasBeenValidated: boolean = false;
  private isPasswordValid: boolean = true;

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
      'show-password',
      'show-toggle',
      'is-new-password',
      'min-length',
      'max-length',
      'require-uppercase',
      'require-lowercase',
      'require-number',
      'require-special-char',
      'invalid-password-message'
    ];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'show-password') {
        this.isPasswordVisible = newValue === 'true';
      }
      if (name === 'value') {
        this.hasBeenValidated = false;
        this.isPasswordValid = true;
      }
      this.render();
    }
  }

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
    const showToggle = this.getAttribute('show-toggle') !== 'false';
    const isNewPassword = this.hasAttribute('is-new-password');
    const invalidPasswordMessage = this.getAttribute('invalid-password-message') || DEFAULT_INVALID_PASSWORD_MESSAGE;

    const inputType = this.isPasswordVisible ? 'text' : 'password';
    const autocomplete = isNewPassword ? 'new-password' : 'current-password';

    // Determine error message
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this.hasBeenValidated && !this.isPasswordValid) {
      errorMessage = invalidPasswordMessage;
    }

    const hasError = !!errorMessage;
    const isFilled = value.length > 0;

    const showIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

    const hideIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`;

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
          background: var(--color-background);
          border: var(--border-default) solid var(--color-border);
          border-radius: var(--radius-150);
          padding-top: var(--space-inset-200);
          padding-bottom: var(--space-inset-none);
          padding-left: var(--space-inset-100);
          padding-right: var(--space-inset-100);
          transition: border-color var(--motion-float-label-duration) var(--motion-float-label-easing);
        }

        .input-container.focused {
          border-color: var(--color-primary);
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
          padding-right: ${showToggle ? '40px' : '0'};
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
          color: var(--color-primary);
        }

        .input-container.error label {
          color: var(--color-error);
        }

        .toggle-button {
          position: absolute;
          right: var(--space-inset-100, 12px);
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted, #666);
          border-radius: 4px;
        }

        .toggle-button:hover:not(:disabled) {
          color: var(--color-text-default, #333);
          background-color: rgba(0, 0, 0, 0.05);
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
          width: 20px;
          height: 20px;
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
          type="${inputType}"
          autocomplete="${autocomplete}"
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
        ${showToggle ? `
          <button 
            type="button" 
            class="toggle-button" 
            aria-label="${this.isPasswordVisible ? 'Hide password' : 'Show password'}"
            aria-pressed="${this.isPasswordVisible}"
            ${disabled ? 'disabled' : ''}
          >
            ${this.isPasswordVisible ? hideIcon : showIcon}
          </button>
        ` : ''}
        ${isSuccess && !showToggle ? '<span class="icon">✓</span>' : ''}
        ${hasError && !showToggle ? '<span class="icon">!</span>' : ''}
        ${showInfoIcon && !showToggle ? '<span class="icon">ℹ</span>' : ''}
      </div>

      ${helperText ? `<div class="helper-text">${helperText}</div>` : ''}
      ${errorMessage ? `<div class="error-message" id="error-${this.id}">${errorMessage}</div>` : ''}
    `;

    this.attachEventListeners();
  }

  private attachEventListeners() {
    const input = this.shadow.querySelector('input');
    const toggleButton = this.shadow.querySelector('.toggle-button');
    
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
        const requirements = this.getRequirements();
        const details = validatePasswordRequirements(value, requirements);
        
        this.hasBeenValidated = true;
        this.isPasswordValid = value.length === 0 || allRequirementsMet(details);
        this.render();
      });
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.setAttribute('value', target.value);
        this.hasBeenValidated = false;
        this.isPasswordValid = true;
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.isPasswordVisible = !this.isPasswordVisible;
        this.render();
        
        // Focus back on input
        const newInput = this.shadow.querySelector('input');
        newInput?.focus();
      });
    }
  }

  public validate(): { isValid: boolean; errorMessage?: string; details?: PasswordValidationDetails } {
    const value = this.getAttribute('value') || '';
    const requirements = this.getRequirements();
    const details = validatePasswordRequirements(value, requirements);
    
    this.hasBeenValidated = true;
    this.isPasswordValid = value.length === 0 || allRequirementsMet(details);
    this.render();
    
    return {
      isValid: this.isPasswordValid,
      errorMessage: this.isPasswordValid ? undefined : (this.getAttribute('invalid-password-message') || DEFAULT_INVALID_PASSWORD_MESSAGE),
      details
    };
  }

  public toggleVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.render();
  }

  public setVisibility(visible: boolean): void {
    this.isPasswordVisible = visible;
    this.render();
  }

  public get isValid(): boolean {
    return this.isPasswordValid;
  }

  public get isVisible(): boolean {
    return this.isPasswordVisible;
  }

  public get value(): string {
    return this.getAttribute('value') || '';
  }

  public set value(newValue: string) {
    this.setAttribute('value', newValue);
  }
}

// Register the custom element
if (!customElements.get('input-text-password')) {
  customElements.define('input-text-password', InputTextPassword);
}

// Export for module usage
export { InputTextPassword };
