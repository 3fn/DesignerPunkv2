/**
 * TextInputField Browser Build
 * 
 * Standalone browser-compatible version of TextInputField web component.
 * This file bundles all dependencies inline for direct browser usage.
 */

// Inline the state management
type InputState = 'default' | 'focused' | 'filled' | 'error' | 'success' | 'disabled' | 'readonly';

interface StateTransition {
  from: InputState;
  to: InputState;
  trigger: string;
}

function getInputState(
  value: string,
  isFocused: boolean,
  hasError: boolean,
  isSuccess: boolean,
  isDisabled: boolean,
  isReadOnly: boolean
): InputState {
  if (isDisabled) return 'disabled';
  if (isReadOnly) return 'readonly';
  if (hasError) return 'error';
  if (isSuccess) return 'success';
  if (isFocused) return 'focused';
  if (value.length > 0) return 'filled';
  return 'default';
}

// TextInputField Web Component
class TextInputField extends HTMLElement {
  private shadow: ShadowRoot;
  private input: HTMLInputElement;
  private labelElement: HTMLElement;
  private helperTextElement: HTMLElement | null = null;
  private errorMessageElement: HTMLElement | null = null;
  private iconContainer: HTMLElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.input = document.createElement('input');
    this.labelElement = document.createElement('label');
  }

  static get observedAttributes() {
    return [
      'label',
      'value',
      'type',
      'placeholder',
      'required',
      'disabled',
      'read-only',
      'error-message',
      'helper-text',
      'is-success',
      'show-info-icon'
    ];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    const label = this.getAttribute('label') || '';
    const value = this.getAttribute('value') || '';
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');
    const readOnly = this.hasAttribute('read-only');
    const errorMessage = this.getAttribute('error-message');
    const helperText = this.getAttribute('helper-text');
    const isSuccess = this.getAttribute('is-success') === 'true';
    const showInfoIcon = this.getAttribute('show-info-icon') === 'true';

    const hasError = !!errorMessage;
    const isFocused = document.activeElement === this.input;
    const state = getInputState(value, isFocused, hasError, isSuccess, disabled, readOnly);

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
          min-height: var(--tap-area-recommended, 48px);
          background: var(--color-background, #FFFFFF);
          border: var(--border-default, 1px) solid var(--color-border, #D1D5DB);
          border-radius: var(--radius-150, 12px);
          padding: var(--space-inset-100, 8px);
          transition: border-color var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
        }

        .input-container.focused {
          border-color: var(--color-primary, #3B82F6);
        }

        .input-container.error {
          border-color: var(--color-error, #EF4444);
          background: rgba(239, 68, 68, 0.05);
        }

        .input-container.success {
          border-color: var(--color-success-strong, #10B981);
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
          font-family: var(--typography-input-font-family, system-ui);
          font-size: var(--typography-input-font-size, 16px);
          line-height: var(--typography-input-line-height, 24px);
          font-weight: var(--typography-input-font-weight, 400);
          color: var(--color-text-default, #000000);
          padding: var(--space-grouped-tight, 4px) 0;
        }

        input::placeholder {
          color: transparent;
        }

        label {
          position: absolute;
          left: var(--space-inset-100, 8px);
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--typography-label-md-font-family, system-ui);
          font-size: var(--typography-label-md-font-size, 16px);
          line-height: var(--typography-label-md-line-height, 24px);
          font-weight: var(--typography-label-md-font-weight, 500);
          color: var(--color-text-muted, #6B7280);
          pointer-events: none;
          transition: all var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
        }

        .input-container.focused label,
        .input-container.filled label {
          top: var(--space-grouped-minimal, 2px);
          transform: translateY(0);
          font-size: var(--typography-label-md-float-font-size, 14px);
          line-height: var(--typography-label-md-float-line-height, 20px);
          color: var(--color-primary, #3B82F6);
        }

        .input-container.error label {
          color: var(--color-error, #EF4444);
        }

        .icon {
          margin-left: var(--space-grouped-tight, 4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .helper-text,
        .error-message {
          margin-top: var(--space-grouped-tight, 4px);
          font-family: var(--typography-caption-font-family, system-ui);
          font-size: var(--typography-caption-font-size, 13px);
          line-height: var(--typography-caption-line-height, 18px);
          color: var(--color-text-muted, #6B7280);
        }

        .error-message {
          color: var(--color-error, #EF4444);
        }

        :host(:focus-within) .input-container {
          outline: var(--accessibility-focus-width, 2px) solid var(--accessibility-focus-color, #3B82F6);
          outline-offset: var(--accessibility-focus-offset, 2px);
        }
      </style>

      <div class="input-container ${state}">
        <input
          type="${type}"
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

    // Store references
    this.input = this.shadow.querySelector('input')!;
    this.labelElement = this.shadow.querySelector('label')!;
    this.helperTextElement = this.shadow.querySelector('.helper-text');
    this.errorMessageElement = this.shadow.querySelector('.error-message');
    this.iconContainer = this.shadow.querySelector('.icon');
  }

  private attachEventListeners() {
    if (this.input) {
      this.input.addEventListener('focus', () => this.render());
      this.input.addEventListener('blur', () => this.render());
      this.input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.setAttribute('value', target.value);
      });
    }
  }
}

// Register the custom element
if (!customElements.get('text-input-field')) {
  customElements.define('text-input-field', TextInputField);
}

// Export for module usage
export { TextInputField };
