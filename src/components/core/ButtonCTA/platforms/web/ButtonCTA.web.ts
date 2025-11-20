/**
 * ButtonCTA Component for Web Platform (Vanilla Web Component)
 * 
 * Cross-platform call-to-action button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * @module ButtonCTA/platforms/web
 */

/// <reference lib="dom" />

import { ButtonSize, ButtonStyle } from '../../types';
import { createIcon } from '../../../Icon/platforms/web/Icon.web';

/**
 * ButtonCTA Web Component
 * 
 * A native web component that renders a semantic button element with token-based styling,
 * optional leading icon, and platform-specific interaction patterns.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic `<button>` element with proper accessibility
 * - Token-based styling via CSS custom properties
 * - Supports text wrapping by default (accessibility-first)
 * - WCAG 2.1 AA compliant:
 *   - Keyboard navigation (Tab, Enter, Space)
 *   - Focus indicators with 3:1 contrast ratio
 *   - Color contrast 4.5:1 for all styles
 *   - Screen reader support with ARIA attributes
 *   - Proper disabled state handling
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <button-cta label="Click me"></button-cta>
 * 
 * <!-- With all attributes -->
 * <button-cta
 *   label="Submit Form"
 *   size="large"
 *   style="primary"
 *   icon="arrow-right"
 *   no-wrap="false"
 *   disabled="false"
 *   test-id="submit-button"
 * ></button-cta>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const button = document.createElement('button-cta') as ButtonCTA;
 * button.label = 'Click me';
 * button.size = 'large';
 * button.addEventListener('press', () => console.log('Clicked'));
 * document.body.appendChild(button);
 * ```
 */
export class ButtonCTA extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _button: HTMLButtonElement | null = null;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): string[] {
    return ['label', 'size', 'style', 'icon', 'no-wrap', 'disabled', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render and sets up event listeners.
   */
  connectedCallback(): void {
    this.render();
    this._attachEventListeners();
  }
  
  /**
   * Called when the element is removed from the DOM.
   * 
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback(): void {
    this._detachEventListeners();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * Triggers re-render to reflect the new attribute value.
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      this.render();
      // Re-attach event listeners after re-render
      this._attachEventListeners();
    }
  }
  
  /**
   * Get the button label text.
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }
  
  /**
   * Set the button label text.
   */
  set label(value: string) {
    this.setAttribute('label', value);
  }
  
  /**
   * Get the button size variant.
   */
  get size(): ButtonSize {
    const size = this.getAttribute('size');
    return (size === 'small' || size === 'medium' || size === 'large') ? size : 'medium';
  }
  
  /**
   * Set the button size variant.
   */
  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }
  
  /**
   * Get the button visual style.
   */
  get buttonStyle(): ButtonStyle {
    const style = this.getAttribute('style');
    return (style === 'primary' || style === 'secondary' || style === 'tertiary') ? style : 'primary';
  }
  
  /**
   * Set the button visual style.
   */
  set buttonStyle(value: ButtonStyle) {
    this.setAttribute('style', value);
  }
  
  /**
   * Get the icon name.
   */
  get icon(): string | null {
    return this.getAttribute('icon');
  }
  
  /**
   * Set the icon name.
   */
  set icon(value: string | null) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }
  
  /**
   * Get the no-wrap state.
   */
  get noWrap(): boolean {
    return this.getAttribute('no-wrap') === 'true';
  }
  
  /**
   * Set the no-wrap state.
   */
  set noWrap(value: boolean) {
    this.setAttribute('no-wrap', value.toString());
  }
  
  /**
   * Get the disabled state.
   */
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  
  /**
   * Set the disabled state.
   */
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  
  /**
   * Get the test ID.
   */
  get testID(): string | null {
    return this.getAttribute('test-id');
  }
  
  /**
   * Set the test ID.
   */
  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  /**
   * Render the component.
   * 
   * Generates the button HTML with appropriate classes, icon, and label.
   * Loads CSS from external file and injects into shadow DOM.
   */
  private render(): void {
    const label = this.label;
    const size = this.size;
    const style = this.buttonStyle;
    const icon = this.icon;
    const noWrap = this.noWrap;
    const disabled = this.disabled;
    const testID = this.testID;
    
    // Generate class names
    const buttonClasses = [
      'button-cta',
      `button-cta--${size}`,
      `button-cta--${style}`,
      disabled ? 'button-cta--disabled' : ''
    ].filter(Boolean).join(' ');
    
    // Generate icon HTML if icon prop provided
    const iconSize = size === 'large' ? 32 : 24;
    const iconHTML = icon ? createIcon({ 
      name: icon as any, // Type assertion since IconName is from Icon types
      size: iconSize,
      color: 'inherit'
    }) : '';
    
    // Generate label class
    const labelClass = noWrap ? 'button-cta__label--no-wrap' : 'button-cta__label';
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Load CSS from external file
    // In production, this would be bundled or loaded via link tag
    const styleLink = `<link rel="stylesheet" href="./ButtonCTA.web.css">`;
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      ${styleLink}
      <button 
        class="${buttonClasses}"
        type="button"
        role="button"
        ${disabled ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'}
        ${testIDAttr}
        aria-label="${label}"
      >
        ${icon ? `<span class="button-cta__icon" aria-hidden="true">${iconHTML}</span>` : ''}
        <span class="${labelClass}">${label}</span>
      </button>
    `;
    
    // Store reference to button element for event handling
    this._button = this._shadowRoot.querySelector('button');
  }
  
  /**
   * Attach event listeners to the button.
   * 
   * Listens for click and keyboard events and dispatches custom 'press' event.
   * Ensures keyboard navigation (Tab, Enter, Space) works correctly.
   */
  private _attachEventListeners(): void {
    if (this._button) {
      this._button.addEventListener('click', this._handleClick);
      this._button.addEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Detach event listeners from the button.
   * 
   * Cleans up to prevent memory leaks.
   */
  private _detachEventListeners(): void {
    if (this._button) {
      this._button.removeEventListener('click', this._handleClick);
      this._button.removeEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Handle button click events.
   * 
   * Dispatches a custom 'press' event that bubbles up to parent elements.
   */
  private _handleClick = (event: Event): void => {
    // Don't dispatch if disabled
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // Dispatch custom 'press' event
    this.dispatchEvent(new CustomEvent('press', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: event }
    }));
  };
  
  /**
   * Handle keyboard events for accessibility.
   * 
   * Ensures Enter and Space keys activate the button (WCAG 2.1 AA requirement).
   * Native button elements handle this automatically, but we make it explicit
   * for clarity and to ensure consistent behavior across all browsers.
   * 
   * @param event - The keyboard event
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    // Don't handle if disabled
    if (this.disabled) {
      return;
    }
    
    // Handle Enter and Space keys (WCAG 2.1 AA keyboard navigation)
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default space scrolling
      
      // Dispatch custom 'press' event
      this.dispatchEvent(new CustomEvent('press', {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event }
      }));
    }
  };
}

/**
 * Register the custom element.
 * 
 * Makes <button-cta> available as a custom HTML element.
 */
if (!customElements.get('button-cta')) {
  customElements.define('button-cta', ButtonCTA);
}

/**
 * Default export for convenience.
 */
export default ButtonCTA;