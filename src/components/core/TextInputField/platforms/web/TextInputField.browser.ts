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
          min-height: var(--tap-area-recommended);
          background: var(--color-background);
          border: var(--border-default) solid var(--color-border);
          border-radius: var(--radius-150);
          padding: var(--space-inset-100);
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
