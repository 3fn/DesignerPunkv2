/**
 * TextInputField Web Component
 * 
 * Web platform implementation of the TextInputField component using Web Components.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary with blend.focusSaturate)
 * - Position animation (translateY)
 * - Respects prefers-reduced-motion
 * - WCAG 2.1 AA compliant
 * - Uses blend utilities for state colors (focus, disabled) instead of opacity workarounds
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 8.1, 8.2, 8.3, 13.1
 */

import {
  TextInputFieldProps,
  TextInputFieldState
} from '../../types';
// Import blend utilities for state color calculations
import {
  hexToRgb,
  rgbToHex,
  calculateSaturateBlend,
  calculateDesaturateBlend
} from '../../../../../blend';
import {
  createInitialState,
  handleFocus,
  handleBlur,
  handleValueChange,
  handleValidationChange,
  calculateLabelPosition,
  calculateIconVisibility
} from '../../stateManagement';
import { createIcon } from '../../../Icon/platforms/web/Icon.web';
import { iconSizes } from '../../../Icon/types';

// Blend token values (from semantic blend tokens)
// These match the CSS custom properties: --blend-focus-saturate, --blend-disabled-desaturate
const BLEND_FOCUS_SATURATE = 0.08;      // blend200 - 8% more saturated for focus emphasis
const BLEND_DISABLED_DESATURATE = 0.12; // blend300 - 12% less saturated for disabled state

/**
 * Apply saturate blend to a hex color string.
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param blendValue - Blend amount as decimal (0.0-1.0)
 * @returns Saturated hex color string
 */
function saturate(color: string, blendValue: number): string {
  try {
    const rgb = hexToRgb(color);
    const blended = calculateSaturateBlend(rgb, blendValue);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails
    return color;
  }
}

/**
 * Apply desaturate blend to a hex color string.
 * 
 * @param color - Hex color string (e.g., "#A855F7")
 * @param blendValue - Blend amount as decimal (0.0-1.0)
 * @returns Desaturated hex color string
 */
function desaturate(color: string, blendValue: number): string {
  try {
    const rgb = hexToRgb(color);
    const blended = calculateDesaturateBlend(rgb, blendValue);
    return rgbToHex(blended);
  } catch {
    // Return original color if parsing fails
    return color;
  }
}

/**
 * TextInputField Web Component
 * 
 * Custom element implementing the float label pattern with animated transitions.
 * Uses blend utilities for state colors (focus, disabled) instead of opacity workarounds.
 */
export class TextInputField extends HTMLElement {
  // Component state
  private state: TextInputFieldState;
  
  // DOM references
  private container: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;
  private helperTextElement: HTMLParagraphElement | null = null;
  private errorMessageElement: HTMLParagraphElement | null = null;
  
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  // Cached blend colors for state styling
  private _focusColor: string = '';
  private _disabledColor: string = '';
  
  constructor() {
    super();
    
    // Initialize shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize state
    this.state = createInitialState(this.getPropsFromAttributes());
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
      'autocomplete',
      'disabled'
    ];
  }
  
  /**
   * Connected callback - called when element is added to DOM
   */
  connectedCallback(): void {
    this._calculateBlendColors();
    this.render();
    this.attachEventListeners();
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads base colors from CSS custom properties and applies blend utilities
   * to generate state colors (focus, disabled).
   * 
   * Uses blend utilities instead of opacity workarounds for
   * cross-platform consistency with iOS and Android implementations.
   * 
   * Focus: saturate(color.primary, blend.focusSaturate) - 8% more saturated
   * Disabled: desaturate(color.primary, blend.disabledDesaturate) - 12% less saturated
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get base color from CSS custom properties
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    
    if (!primaryColor) {
      // Fallback to CSS custom properties if computed value not available
      // This ensures we still use tokens even if calculation fails
      console.warn('TextInputField: --color-primary computed value not found, using token reference');
      this._focusColor = 'var(--color-primary)';
      this._disabledColor = 'var(--color-text-muted)';
      return;
    }
    
    // Calculate blend colors using blend utilities
    // Focus: saturate(color.primary, blend.focusSaturate) - 8% more saturated for emphasis
    this._focusColor = saturate(primaryColor, BLEND_FOCUS_SATURATE);
    
    // Disabled: desaturate(color.primary, blend.disabledDesaturate) - 12% less saturated
    this._disabledColor = desaturate(primaryColor, BLEND_DISABLED_DESATURATE);
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
    const iconVisibility = calculateIconVisibility(this.state);
    
    // Create container
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'text-input-field';
    }
    
    // Generate trailing icon HTML
    // Icon size uses icon.size100 (24px) - standard size for bodyMd/labelMd/input typography
    const iconSize = iconSizes.size100;
    let trailingIconHTML = '';
    if (iconVisibility.showErrorIcon) {
      trailingIconHTML = createIcon({
        name: 'x',
        size: iconSize,
        color: 'color-error',
        className: 'trailing-icon error-icon'
      });
    } else if (iconVisibility.showSuccessIcon) {
      trailingIconHTML = createIcon({
        name: 'check',
        size: iconSize,
        color: 'color-success-strong',
        className: 'trailing-icon success-icon'
      });
    } else if (iconVisibility.showInfoIcon) {
      trailingIconHTML = createIcon({
        name: 'info',
        size: iconSize,
        color: 'color-text-subtle',
        className: 'trailing-icon info-icon'
      });
    }
    
    // Generate blend color CSS custom properties
    // These are component-specific calculated values (not design tokens)
    // Using _tif prefix to distinguish from design token references
    const blendColorStyles = `
      --_tif-focus-color: ${this._focusColor};
      --_tif-disabled-color: ${this._disabledColor};
    `;
    
    // Check disabled state
    const isDisabled = this.hasAttribute('disabled');
    
    // Build HTML structure
    this.container.innerHTML = `
      <div class="input-wrapper ${this.state.hasError ? 'error' : ''} ${this.state.isSuccess ? 'success' : ''} ${this.state.isFocused ? 'focused' : ''} ${this.state.isFilled ? 'filled' : ''} ${isDisabled ? 'disabled' : ''}" style="${blendColorStyles}">
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
          ${isDisabled ? 'disabled' : ''}
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
        min-height: var(--tap-area-recommended);
      }
      
      .input-element {
        width: 100%;
        min-height: var(--tap-area-recommended);
        padding: var(--space-inset-100);
        padding-right: calc(var(--space-inset-100) + var(--icon-size-100) + var(--space-inset-100));
        font-family: var(--typography-input-font-family);
        font-size: var(--typography-input-font-size);
        line-height: var(--typography-input-line-height);
        font-weight: var(--typography-input-font-weight);
        letter-spacing: var(--typography-input-letter-spacing);
        color: var(--color-text-default);
        background: var(--color-background);
        border: var(--border-border-default) solid var(--color-border);
        border-radius: var(--radius-150);
        outline: none;
        box-sizing: border-box;
        transition: border-color var(--motion-float-label-duration) var(--motion-float-label-easing);
      }
      
      .input-element:focus {
        /* Focus: saturate(color.primary, blend.focusSaturate) - 8% more saturated */
        border-color: var(--_tif-focus-color, var(--color-primary));
      }
      
      /* Focus ring for keyboard navigation (WCAG 2.4.7 Focus Visible) */
      .input-element:focus-visible {
        outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
        outline-offset: var(--accessibility-focus-offset);
        /* Focus ring transition using motion.focusTransition token (A2) */
        transition: outline-color var(--motion-focus-transition-duration) var(--motion-focus-transition-easing);
      }
      
      /* Disabled state: desaturate(color.primary, blend.disabledDesaturate) - 12% less saturated */
      .input-element:disabled {
        border-color: var(--_tif-disabled-color, var(--color-border));
        color: var(--color-text-muted);
        cursor: not-allowed;
        opacity: 1; /* Remove opacity workaround - use desaturated color instead */
      }
      
      /* Ensure focus ring is visible in all states */
      .input-wrapper.error .input-element:focus-visible {
        outline-color: var(--accessibility-focus-color);
      }
      
      .input-wrapper.success .input-element:focus-visible {
        outline-color: var(--accessibility-focus-color);
      }
      
      .input-wrapper.error .input-element {
        border-color: var(--color-error-strong);
      }
      
      .input-wrapper.success .input-element {
        border-color: var(--color-success-strong);
      }
      
      .input-label {
        position: absolute;
        left: var(--space-inset-100);
        top: 50%;
        transform: translateY(-50%);
        font-family: var(--typography-label-md-font-family);
        font-size: var(--typography-label-md-font-size);
        line-height: var(--typography-label-md-line-height);
        font-weight: var(--typography-label-md-font-weight);
        letter-spacing: var(--typography-label-md-letter-spacing);
        color: var(--color-text-muted);
        pointer-events: none;
        transition: 
          transform var(--motion-float-label-duration) var(--motion-float-label-easing),
          font-size var(--motion-float-label-duration) var(--motion-float-label-easing),
          color var(--motion-float-label-duration) var(--motion-float-label-easing);
      }
      
      .input-label.floated {
        transform: translateY(calc(-100% - var(--space-grouped-tight)));
        font-size: var(--typography-label-md-float-font-size);
        line-height: var(--typography-label-md-float-line-height);
      }
      
      .input-wrapper.focused .input-label.floated {
        /* Focus: saturate(color.primary, blend.focusSaturate) - 8% more saturated */
        color: var(--_tif-focus-color, var(--color-primary));
      }
      
      .input-wrapper.error .input-label {
        color: var(--color-error-strong);
      }
      
      .input-wrapper.success .input-label {
        color: var(--color-success-strong);
      }
      
      /* Disabled state label: desaturate(color.primary, blend.disabledDesaturate) - 12% less saturated */
      .input-wrapper.disabled .input-label {
        color: var(--_tif-disabled-color, var(--color-text-muted));
      }
      
      .helper-text {
        margin: var(--space-grouped-minimal) 0 0 0;
        padding: 0;
        font-family: var(--typography-caption-font-family);
        font-size: var(--typography-caption-font-size);
        line-height: var(--typography-caption-line-height);
        font-weight: var(--typography-caption-font-weight);
        letter-spacing: var(--typography-caption-letter-spacing);
        color: var(--color-text-muted);
      }
      
      .error-message {
        margin: var(--space-grouped-minimal) 0 0 0;
        padding: 0;
        font-family: var(--typography-caption-font-family);
        font-size: var(--typography-caption-font-size);
        line-height: var(--typography-caption-line-height);
        font-weight: var(--typography-caption-font-weight);
        letter-spacing: var(--typography-caption-letter-spacing);
        color: var(--color-error-strong);
      }
      
      .trailing-icon-container {
        position: absolute;
        right: var(--space-inset-100);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        /* Base state: hidden with delayed appearance (waits for label animation) */
        opacity: 0;
        transition: opacity var(--motion-float-label-duration) var(--motion-float-label-easing);
        transition-delay: var(--motion-float-label-duration);
      }
      
      /* Icons visible when focused (after label animation delay) */
      .input-wrapper.focused .trailing-icon-container {
        opacity: 1;
        transition-delay: var(--motion-float-label-duration);
      }
      
      /* Icons visible when filled (after label animation delay) */
      .input-wrapper.filled .trailing-icon-container {
        opacity: 1;
        transition-delay: var(--motion-float-label-duration);
      }
      
      /* Icons hide immediately when unfocusing empty input (no delay) */
      .input-wrapper:not(.focused):not(.filled) .trailing-icon-container {
        opacity: 0;
        transition-delay: 0ms;
      }
      
      .trailing-icon {
        display: block;
      }
      
      /* Respect prefers-reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        .input-element,
        .input-element:focus-visible,
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
    this.state = handleFocus(this.state);
    this.updateLabelPosition();
    
    // Dispatch focus event
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event
   */
  private onBlur = (): void => {
    this.state = handleBlur(this.state);
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
      wrapper.classList.toggle('filled', this.state.isFilled);
      wrapper.classList.toggle('error', this.state.hasError);
      wrapper.classList.toggle('success', this.state.isSuccess);
    }
    
    // Icon visibility is now handled by CSS transition-delay
    // No JavaScript timing coordination needed
    this.updateIconVisibility();
  }
  
  /**
   * Update icon visibility with animation coordination
   */
  private updateIconVisibility(): void {
    if (!this.container) return;
    
    const iconVisibility = calculateIconVisibility(this.state);
    const iconContainer = this.container.querySelector('.trailing-icon-container') as HTMLElement;
    
    if (!iconContainer) return;
    
    // Show/hide icon based on visibility state
    // CSS transition-delay handles animation timing coordination
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

