/**
 * TextInputField Web Component
 * 
 * Web platform implementation of the TextInputField component using Web Components.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary)
 * - Position animation (translateY)
 * - Respects prefers-reduced-motion
 * - WCAG 2.1 AA compliant
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 8.3
 */

import {
  TextInputFieldProps,
  TextInputFieldState,
  LabelAnimationState
} from '../../types';
import {
  createInitialState,
  createInitialAnimationState,
  handleFocus,
  handleBlur,
  handleValueChange,
  handleValidationChange,
  calculateLabelPosition,
  calculateIconVisibility,
  startLabelAnimation,
  completeLabelAnimation
} from '../../stateManagement';
import { createIcon } from '../../../Icon/platforms/web/Icon.web';

/**
 * TextInputField Web Component
 * 
 * Custom element implementing the float label pattern with animated transitions.
 */
export class TextInputField extends HTMLElement {
  // Component state
  private state: TextInputFieldState;
  private animationState: LabelAnimationState;
  
  // DOM references
  private container: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;
  private helperTextElement: HTMLParagraphElement | null = null;
  private errorMessageElement: HTMLParagraphElement | null = null;
  
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  constructor() {
    super();
    
    // Initialize shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize state
    this.state = createInitialState(this.getPropsFromAttributes());
    this.animationState = createInitialAnimationState();
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
      'type',
      'placeholder',
      'helper-text',
      'error-message',
      'is-success',
      'show-info-icon',
      'read-only',
      'required',
      'max-length',
      'autocomplete'
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
    
    // Update state based on attribute changes
    if (name === 'value') {
      this.state = handleValueChange(this.state, newValue || '');
      this.updateLabelPosition();
    } else if (name === 'error-message') {
      this.state = handleValidationChange(
        this.state,
        newValue || undefined,
        this.state.isSuccess
      );
      this.updateLabelPosition();
    } else if (name === 'is-success') {
      this.state = handleValidationChange(
        this.state,
        this.state.hasError ? this.getAttribute('error-message') || undefined : undefined,
        newValue === 'true'
      );
      this.updateLabelPosition();
    }
    
    // Re-render if needed
    if (this.isConnected) {
      this.render();
    }
  }
  
  /**
   * Get props from element attributes
   */
  private getPropsFromAttributes(): TextInputFieldProps {
    return {
      id: this.getAttribute('id') || '',
      label: this.getAttribute('label') || '',
      value: this.getAttribute('value') || '',
      onChange: () => {}, // Handled via events
      type: (this.getAttribute('type') as any) || 'text',
      placeholder: this.getAttribute('placeholder') || undefined,
      helperText: this.getAttribute('helper-text') || undefined,
      errorMessage: this.getAttribute('error-message') || undefined,
      isSuccess: this.getAttribute('is-success') === 'true',
      showInfoIcon: this.getAttribute('show-info-icon') === 'true',
      readOnly: this.hasAttribute('read-only'),
      required: this.hasAttribute('required'),
      maxLength: this.hasAttribute('max-length') ? parseInt(this.getAttribute('max-length')!, 10) : undefined,
      autocomplete: this.getAttribute('autocomplete') || undefined
    };
  }
  
  /**
   * Render component
   */
  private render(): void {
    const props = this.getPropsFromAttributes();
    const labelPosition = calculateLabelPosition(this.state);
    const iconVisibility = calculateIconVisibility(this.state, this.animationState);
    
    // Create container
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'text-input-field';
    }
    
    // Generate trailing icon HTML
    let trailingIconHTML = '';
    if (iconVisibility.showErrorIcon) {
      trailingIconHTML = createIcon({
        name: 'x',
        size: 24,
        color: 'color-error',
        className: 'trailing-icon error-icon'
      });
    } else if (iconVisibility.showSuccessIcon) {
      trailingIconHTML = createIcon({
        name: 'check',
        size: 24,
        color: 'color-success-strong',
        className: 'trailing-icon success-icon'
      });
    } else if (iconVisibility.showInfoIcon) {
      trailingIconHTML = createIcon({
        name: 'info',
        size: 24,
        color: 'color-text-subtle',
        className: 'trailing-icon info-icon'
      });
    }
    
    // Build HTML structure
    this.container.innerHTML = `
      <div class="input-wrapper ${this.state.hasError ? 'error' : ''} ${this.state.isSuccess ? 'success' : ''} ${this.state.isFocused ? 'focused' : ''}">
        <label 
          for="${props.id}" 
          class="input-label ${labelPosition.isFloated ? 'floated' : ''}"
        >
          ${props.label}${props.required ? ' *' : ''}
        </label>
        <input
          id="${props.id}"
          type="${props.type}"
          class="input-element"
          value="${props.value}"
          placeholder="${labelPosition.isFloated && props.placeholder ? props.placeholder : ''}"
          ${props.readOnly ? 'readonly' : ''}
          ${props.required ? 'required' : ''}
          ${props.maxLength ? `maxlength="${props.maxLength}"` : ''}
          ${props.autocomplete ? `autocomplete="${props.autocomplete}"` : ''}
          aria-describedby="${props.helperText ? `helper-${props.id}` : ''} ${props.errorMessage ? `error-${props.id}` : ''}"
          ${props.errorMessage ? 'aria-invalid="true"' : ''}
        />
        ${trailingIconHTML ? `<div class="trailing-icon-container">${trailingIconHTML}</div>` : ''}
      </div>
      ${props.helperText ? `
        <p id="helper-${props.id}" class="helper-text">
          ${props.helperText}
        </p>
      ` : ''}
      ${props.errorMessage ? `
        <p id="error-${props.id}" class="error-message" role="alert">
          ${props.errorMessage}
        </p>
      ` : ''}
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = this.getStyles();
    
    // Clear shadow root and append new content
    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this.container);
    
    // Store DOM references
    this.inputElement = this._shadowRoot.querySelector('.input-element');
    this.labelElement = this._shadowRoot.querySelector('.input-label');
    this.helperTextElement = this._shadowRoot.querySelector('.helper-text');
    this.errorMessageElement = this._shadowRoot.querySelector('.error-message');
  }
  
  /**
   * Get component styles
   */
  private getStyles(): string {
    return `
      :host {
        display: block;
        width: 100%;
      }
      
      .text-input-field {
        width: 100%;
      }
      
      .input-wrapper {
        position: relative;
        width: 100%;
        min-height: var(--tap-area-recommended, 48px);
      }
      
      .input-element {
        width: 100%;
        min-height: var(--tap-area-recommended, 48px);
        padding: var(--space-inset-100, 8px);
        padding-right: calc(var(--space-inset-100, 8px) + 24px + var(--space-inset-100, 8px));
        font-family: var(--typography-input-font-family, system-ui);
        font-size: var(--typography-input-font-size, 16px);
        line-height: var(--typography-input-line-height, 24px);
        font-weight: var(--typography-input-font-weight, 400);
        letter-spacing: var(--typography-input-letter-spacing, 0);
        color: var(--color-text-default, #000000);
        background: var(--color-background, #FFFFFF);
        border: var(--border-default, 1px) solid var(--color-border, #D1D5DB);
        border-radius: var(--radius-150, 12px);
        outline: none;
        box-sizing: border-box;
        transition: border-color var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
      }
      
      .input-element:focus {
        border-color: var(--color-primary, #3B82F6);
      }
      
      /* Focus ring for keyboard navigation (WCAG 2.4.7 Focus Visible) */
      .input-element:focus-visible {
        outline: var(--accessibility-focus-width, 2px) solid var(--accessibility-focus-color, #3B82F6);
        outline-offset: var(--accessibility-focus-offset, 2px);
      }
      
      /* Ensure focus ring is visible in all states */
      .input-wrapper.error .input-element:focus-visible {
        outline-color: var(--accessibility-focus-color, #3B82F6);
      }
      
      .input-wrapper.success .input-element:focus-visible {
        outline-color: var(--accessibility-focus-color, #3B82F6);
      }
      
      .input-wrapper.error .input-element {
        border-color: var(--color-error, #EF4444);
      }
      
      .input-wrapper.success .input-element {
        border-color: var(--color-success-strong, #10B981);
      }
      
      .input-label {
        position: absolute;
        left: var(--space-inset-100, 8px);
        top: 50%;
        transform: translateY(-50%);
        font-family: var(--typography-label-md-font-family, system-ui);
        font-size: var(--typography-label-md-font-size, 16px);
        line-height: var(--typography-label-md-line-height, 24px);
        font-weight: var(--typography-label-md-font-weight, 500);
        letter-spacing: var(--typography-label-md-letter-spacing, 0);
        color: var(--color-text-muted, #6B7280);
        pointer-events: none;
        transition: 
          transform var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0)),
          font-size var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0)),
          color var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
      }
      
      .input-label.floated {
        transform: translateY(calc(-100% - var(--space-grouped-tight, 4px)));
        font-size: var(--typography-label-md-float-font-size, 14px);
        line-height: var(--typography-label-md-float-line-height, 20px);
      }
      
      .input-wrapper.focused .input-label.floated {
        color: var(--color-primary, #3B82F6);
      }
      
      .input-wrapper.error .input-label {
        color: var(--color-error, #EF4444);
      }
      
      .input-wrapper.success .input-label {
        color: var(--color-success-strong, #10B981);
      }
      
      .helper-text {
        margin: var(--space-grouped-minimal, 2px) 0 0 0;
        padding: 0;
        font-family: var(--typography-caption-font-family, system-ui);
        font-size: var(--typography-caption-font-size, 13px);
        line-height: var(--typography-caption-line-height, 18px);
        font-weight: var(--typography-caption-font-weight, 400);
        letter-spacing: var(--typography-caption-letter-spacing, 0);
        color: var(--color-text-muted, #6B7280);
      }
      
      .error-message {
        margin: var(--space-grouped-minimal, 2px) 0 0 0;
        padding: 0;
        font-family: var(--typography-caption-font-family, system-ui);
        font-size: var(--typography-caption-font-size, 13px);
        line-height: var(--typography-caption-line-height, 18px);
        font-weight: var(--typography-caption-font-weight, 400);
        letter-spacing: var(--typography-caption-letter-spacing, 0);
        color: var(--color-error, #EF4444);
      }
      
      .trailing-icon-container {
        position: absolute;
        right: var(--space-inset-100, 8px);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 1;
        transition: opacity var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
      }
      
      .trailing-icon {
        display: block;
      }
      
      /* Respect prefers-reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        .input-element,
        .input-label,
        .trailing-icon-container {
          transition: none;
        }
      }
    `;
  }
  
  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    if (this.inputElement) {
      this.inputElement.addEventListener('focus', this.onFocus);
      this.inputElement.addEventListener('blur', this.onBlur);
      this.inputElement.addEventListener('input', this.onInput);
    }
  }
  
  /**
   * Detach event listeners
   */
  private detachEventListeners(): void {
    if (this.inputElement) {
      this.inputElement.removeEventListener('focus', this.onFocus);
      this.inputElement.removeEventListener('blur', this.onBlur);
      this.inputElement.removeEventListener('input', this.onInput);
    }
  }
  
  /**
   * Handle focus event
   */
  private onFocus = (): void => {
    const previousFloated = this.state.isLabelFloated;
    this.state = handleFocus(this.state);
    
    // Start animation if label wasn't already floated
    if (!previousFloated) {
      this.animationState = startLabelAnimation('up');
    }
    
    this.updateLabelPosition();
    
    // Dispatch focus event
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event
   */
  private onBlur = (): void => {
    const previousFloated = this.state.isLabelFloated;
    this.state = handleBlur(this.state);
    
    // Start animation if label should return
    if (previousFloated && !this.state.isLabelFloated) {
      this.animationState = startLabelAnimation('down');
    }
    
    this.updateLabelPosition();
    
    // Dispatch blur event
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle input event
   */
  private onInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    
    this.state = handleValueChange(this.state, newValue);
    this.updateLabelPosition();
    
    // Dispatch change event
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: newValue },
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Update label position based on state
   */
  private updateLabelPosition(): void {
    if (!this.labelElement || !this.container) return;
    
    const labelPosition = calculateLabelPosition(this.state);
    
    // Update label class
    if (labelPosition.isFloated) {
      this.labelElement.classList.add('floated');
    } else {
      this.labelElement.classList.remove('floated');
    }
    
    // Update wrapper classes
    const wrapper = this.container.querySelector('.input-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('focused', this.state.isFocused);
      wrapper.classList.toggle('error', this.state.hasError);
      wrapper.classList.toggle('success', this.state.isSuccess);
    }
    
    // Complete animation after transition
    if (this.animationState.isAnimating) {
      setTimeout(() => {
        this.animationState = completeLabelAnimation(this.animationState);
        // Re-render to update icon visibility after animation completes
        this.updateIconVisibility();
      }, 250); // Match motion.floatLabel duration
    }
  }
  
  /**
   * Update icon visibility with animation coordination
   */
  private updateIconVisibility(): void {
    if (!this.container) return;
    
    const iconVisibility = calculateIconVisibility(this.state, this.animationState);
    const iconContainer = this.container.querySelector('.trailing-icon-container') as HTMLElement;
    
    if (!iconContainer) return;
    
    // Show/hide icon based on visibility state and animation completion
    const shouldShow = iconVisibility.showErrorIcon || 
                      iconVisibility.showSuccessIcon || 
                      iconVisibility.showInfoIcon;
    
    if (shouldShow) {
      iconContainer.style.opacity = '1';
    } else {
      iconContainer.style.opacity = '0';
    }
  }
}

// Register custom element
if (!customElements.get('text-input-field')) {
  customElements.define('text-input-field', TextInputField);
}

