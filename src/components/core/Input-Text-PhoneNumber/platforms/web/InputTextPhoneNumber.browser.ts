/**
 * Input-Text-PhoneNumber Browser Build
 * 
 * Standalone browser-compatible version of Input-Text-PhoneNumber web component.
 * This file bundles all dependencies inline for direct browser usage.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-PhoneNumber
 */

// Inline phone validation and formatting
const DEFAULT_INVALID_PHONE_MESSAGE = 'Please enter a valid phone number';
const DEFAULT_COUNTRY_CODE = 'US';

interface CountryConfig {
  code: string;
  dialCode: string;
  name: string;
  format: string;
  digitCount: number;
}

const COUNTRY_CODES: Record<string, CountryConfig> = {
  US: { code: 'US', dialCode: '+1', name: 'United States', format: '(###) ###-####', digitCount: 10 },
  CA: { code: 'CA', dialCode: '+1', name: 'Canada', format: '(###) ###-####', digitCount: 10 },
  GB: { code: 'GB', dialCode: '+44', name: 'United Kingdom', format: '#### ### ####', digitCount: 11 },
  DE: { code: 'DE', dialCode: '+49', name: 'Germany', format: '#### #######', digitCount: 11 },
  FR: { code: 'FR', dialCode: '+33', name: 'France', format: '## ## ## ## ##', digitCount: 10 },
  AU: { code: 'AU', dialCode: '+61', name: 'Australia', format: '#### ### ###', digitCount: 10 },
  JP: { code: 'JP', dialCode: '+81', name: 'Japan', format: '###-####-####', digitCount: 11 },
  IN: { code: 'IN', dialCode: '+91', name: 'India', format: '##### #####', digitCount: 10 },
  BR: { code: 'BR', dialCode: '+55', name: 'Brazil', format: '(##) #####-####', digitCount: 11 },
  MX: { code: 'MX', dialCode: '+52', name: 'Mexico', format: '## #### ####', digitCount: 10 }
};

function getCountryConfig(code: string): CountryConfig {
  return COUNTRY_CODES[code.toUpperCase()] || COUNTRY_CODES[DEFAULT_COUNTRY_CODE];
}

function extractDigits(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

function formatPhoneNumber(digits: string, countryCode: string = DEFAULT_COUNTRY_CODE): string {
  const config = getCountryConfig(countryCode);
  const format = config.format;
  
  if (!digits) return '';
  
  let result = '';
  let digitIndex = 0;
  
  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += format[i];
    }
  }
  
  return result;
}

function isValidPhoneNumber(phoneNumber: string, countryCode: string = DEFAULT_COUNTRY_CODE): boolean {
  if (!phoneNumber || phoneNumber.trim() === '') return true;
  const digits = extractDigits(phoneNumber);
  const config = getCountryConfig(countryCode);
  return digits.length === config.digitCount;
}

// Input-Text-PhoneNumber Web Component
class InputTextPhoneNumber extends HTMLElement {
  private shadow: ShadowRoot;
  private hasBeenValidated: boolean = false;
  private isPhoneValid: boolean = true;
  private currentCountryCode: string = DEFAULT_COUNTRY_CODE;
  private rawDigits: string = '';
  private formattedValue: string = '';

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
      'country-code',
      'auto-format',
      'invalid-phone-message'
    ];
  }

  connectedCallback() {
    this.currentCountryCode = this.getAttribute('country-code') || DEFAULT_COUNTRY_CODE;
    const initialValue = this.getAttribute('value') || '';
    this.rawDigits = extractDigits(initialValue);
    this.formattedValue = formatPhoneNumber(this.rawDigits, this.currentCountryCode);
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'country-code' && newValue) {
        this.currentCountryCode = newValue;
        this.formattedValue = formatPhoneNumber(this.rawDigits, this.currentCountryCode);
        this.hasBeenValidated = false;
        this.isPhoneValid = true;
      }
      if (name === 'value' && newValue !== null) {
        this.rawDigits = extractDigits(newValue);
        this.formattedValue = formatPhoneNumber(this.rawDigits, this.currentCountryCode);
        this.hasBeenValidated = false;
        this.isPhoneValid = true;
      }
      this.render();
    }
  }

  private render() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');
    const readOnly = this.hasAttribute('read-only');
    const propsErrorMessage = this.getAttribute('error-message');
    const helperText = this.getAttribute('helper-text');
    const isSuccess = this.getAttribute('is-success') === 'true';
    const showInfoIcon = this.getAttribute('show-info-icon') === 'true';
    const autoFormat = this.getAttribute('auto-format') !== 'false';
    const invalidPhoneMessage = this.getAttribute('invalid-phone-message') || DEFAULT_INVALID_PHONE_MESSAGE;

    const displayValue = autoFormat ? this.formattedValue : this.rawDigits;

    // Determine error message
    let errorMessage = propsErrorMessage;
    if (!errorMessage && this.hasBeenValidated && !this.isPhoneValid) {
      errorMessage = invalidPhoneMessage;
    }

    const hasError = !!errorMessage;
    const isFilled = displayValue.length > 0;

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
          type="tel"
          autocomplete="tel"
          value="${displayValue}"
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
        this.hasBeenValidated = true;
        this.isPhoneValid = isValidPhoneNumber(this.rawDigits, this.currentCountryCode);
        this.render();
      });
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const autoFormat = this.getAttribute('auto-format') !== 'false';
        const config = getCountryConfig(this.currentCountryCode);
        
        // Extract and limit digits
        const digits = extractDigits(target.value).slice(0, config.digitCount);
        this.rawDigits = digits;
        this.formattedValue = formatPhoneNumber(digits, this.currentCountryCode);
        
        // Update display
        const displayValue = autoFormat ? this.formattedValue : this.rawDigits;
        target.value = displayValue;
        this.setAttribute('value', displayValue);
        
        // Clear validation
        this.hasBeenValidated = false;
        this.isPhoneValid = true;
      });
    }
  }

  public validate(): { isValid: boolean; errorMessage?: string; formattedNumber?: string; rawDigits?: string } {
    this.hasBeenValidated = true;
    this.isPhoneValid = isValidPhoneNumber(this.rawDigits, this.currentCountryCode);
    this.render();
    
    return {
      isValid: this.isPhoneValid,
      errorMessage: this.isPhoneValid ? undefined : (this.getAttribute('invalid-phone-message') || DEFAULT_INVALID_PHONE_MESSAGE),
      formattedNumber: this.formattedValue,
      rawDigits: this.rawDigits
    };
  }

  public get isValid(): boolean {
    return this.isPhoneValid;
  }

  public get value(): string {
    return this.formattedValue;
  }

  public set value(newValue: string) {
    this.setAttribute('value', newValue);
  }

  public get rawValue(): string {
    return this.rawDigits;
  }

  public get countryCode(): string {
    return this.currentCountryCode;
  }

  public set countryCode(code: string) {
    this.setAttribute('country-code', code);
  }
}

// Register the custom element
if (!customElements.get('input-text-phone-number')) {
  customElements.define('input-text-phone-number', InputTextPhoneNumber);
}

// Export for module usage
export { InputTextPhoneNumber };

