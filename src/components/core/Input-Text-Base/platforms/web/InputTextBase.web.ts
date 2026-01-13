/**
 * Input-Text-Base Web Component
 * 
 * Web platform implementation of the Input-Text-Base component using Web Components.
 * Implements float label pattern with animated transitions using motion.floatLabel token.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Base
 * 
 * Features:
 * - Float label animation (labelMd → labelMdFloat)
 * - Color animation (text.subtle → primary with blend.focusSaturate)
 * - Position animation (translateY)
 * - Respects prefers-reduced-motion
 * - WCAG 2.1 AA compliant
 * - Uses theme-aware blend utilities for state colors (focus, disabled) instead of opacity workarounds
 * 
 * Behavioral Contracts:
 * - focusable: Can receive keyboard focus
 * - float_label_animation: Label animates on focus
 * - validates_on_blur: Validation triggers on blur
 * - error_state_display: Shows error message and styling
 * - success_state_display: Shows success styling
 * - disabled_state: Prevents interaction when disabled
 * - trailing_icon_display: Shows contextual trailing icons
 * - focus_ring: WCAG 2.4.7 focus visible indicator
 * - reduced_motion_support: Respects prefers-reduced-motion
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 8.1, 8.2, 8.3, 11.1, 11.2, 11.3, 13.1
 */

import {
  InputTextBaseProps,
  InputTextBaseState
} from '../../types';
// Import theme-aware blend utilities for state color calculations
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';
import {
  createInitialState,
  handleFocus,
  handleBlur,
  handleValueChange,
  handleValidationChange,
  calculateLabelPosition,
  calculateIconVisibility
} from '../../stateManagement';
import { createIcon } from '../../../Icon-Base/platforms/web/IconBase.web';
import { iconSizes } from '../../../Icon-Base/types';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// @see scripts/esbuild-css-plugin.js
// @see Requirements: 5.2, 5.3, 5.4 (external CSS file with esbuild plugin pattern)
import inputTextBaseStyles from './InputTextBase.web.css';

/**
 * Input-Text-Base Web Component
 * 
 * Custom element implementing the float label pattern with animated transitions.
 * Uses theme-aware blend utilities for state colors (focus, disabled).
 */
export class InputTextBase extends HTMLElement {
  // Component state
  private state: InputTextBaseState;
  
  // DOM references
  private container: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;
  private helperTextElement: HTMLParagraphElement | null = null;
  private errorMessageElement: HTMLParagraphElement | null = null;
  
  // Shadow DOM
  private _shadowRoot: ShadowRoot;
  
  // Theme-aware blend utilities instance
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  private _focusColor: string = '';
  private _disabledColor: string = '';
  
  constructor() {
    super();
    
    // Initialize shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize theme-aware blend utilities
    this._blendUtils = getBlendUtilities();
    
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
    // Defer blend color calculation until styles are loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._calculateBlendColorsWithRetry();
        this.render();
        this.attachEventListeners();
      }, { once: true });
    } else {
      this._calculateBlendColorsWithRetry();
      this.render();
      this.attachEventListeners();
    }
  }
  
  /**
   * Calculate blend colors with retry logic for CSS loading race conditions.
   * 
   * Uses requestAnimationFrame to ensure CSS is fully applied before reading
   * custom properties. Falls back to default colors if tokens are still unavailable.
   */
  private _calculateBlendColorsWithRetry(): void {
    try {
      this._calculateBlendColors();
    } catch (error) {
      // CSS might not be fully applied yet, retry after next frame
      requestAnimationFrame(() => {
        try {
          this._calculateBlendColors();
          this.render(); // Re-render with correct colors
        } catch (retryError) {
          // Log warning but don't break the component
          console.warn('InputTextBase: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   */
  private _calculateBlendColors(): void {
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    
    if (!primaryColor) {
      throw new Error('InputTextBase: Required token --color-primary is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    this._focusColor = this._blendUtils.focusColor(primaryColor);
    this._disabledColor = this._blendUtils.disabledColor(primaryColor);
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
    
    if (name === 'value') {
      this.state = handleValueChange(this.state, newValue || '');
      this.updateLabelPosition();
      // Update input element value directly without re-rendering to preserve focus
      if (this.inputElement && this.inputElement.value !== (newValue || '')) {
        this.inputElement.value = newValue || '';
      }
      return; // Don't re-render for value changes - preserves focus
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
    
    if (this.isConnected) {
      this.render();
    }
  }
  
  /**
   * Get props from element attributes
   */
  private getPropsFromAttributes(): InputTextBaseProps {
    return {
      id: this.getAttribute('id') || '',
      label: this.getAttribute('label') || '',
      value: this.getAttribute('value') || '',
      onChange: () => {},
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
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'input-text-base';
    }
    
    // Generate trailing icon HTML
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
    const blendColorStyles = `
      --_itb-focus-color: ${this._focusColor};
      --_itb-disabled-color: ${this._disabledColor};
    `;
    
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
    
    // Add styles using imported CSS string
    // @see Requirements: 5.2, 5.3, 5.4 (external CSS file with esbuild plugin pattern)
    const style = document.createElement('style');
    style.textContent = inputTextBaseStyles;
    
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
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  
  /**
   * Handle blur event
   */
  private onBlur = (): void => {
    this.state = handleBlur(this.state);
    this.updateLabelPosition();
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
    
    if (labelPosition.isFloated) {
      this.labelElement.classList.add('floated');
    } else {
      this.labelElement.classList.remove('floated');
    }
    
    const wrapper = this.container.querySelector('.input-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('focused', this.state.isFocused);
      wrapper.classList.toggle('filled', this.state.isFilled);
      wrapper.classList.toggle('error', this.state.hasError);
      wrapper.classList.toggle('success', this.state.isSuccess);
    }
    
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
if (!customElements.get('input-text-base')) {
  customElements.define('input-text-base', InputTextBase);
}
