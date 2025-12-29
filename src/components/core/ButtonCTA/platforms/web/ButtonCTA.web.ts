/**
 * ButtonCTA Component for Web Platform (Vanilla Web Component)
 * 
 * Cross-platform call-to-action button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Uses <dp-icon> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Uses theme-aware blend utilities for state colors (hover, pressed, disabled, icon)
 * instead of opacity or filter workarounds. This ensures cross-platform consistency
 * with iOS and Android implementations.
 * 
 * @module ButtonCTA/platforms/web
 * @see Requirements: 7.1, 7.2, 7.3, 7.4, 11.1, 11.2, 11.3
 */

/// <reference lib="dom" />

import { ButtonSize, ButtonStyle } from '../../types';
// Import DPIcon to ensure it's registered before ButtonCTA uses it
import '../../../Icon/platforms/web/Icon.web';
import { IconSize, iconSizes } from '../../../Icon/types';
// Import theme-aware blend utilities for state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// @see scripts/esbuild-css-plugin.js
// @see Requirements: 8.2, 8.3 (components render correctly in browser bundles)
import buttonStyles from './ButtonCTA.web.css';

/**
 * Map ButtonCTA size to appropriate IconSize using explicit token references.
 * 
 * Provides type-safe mapping from button size variants to icon sizes:
 * - small/medium: iconSizes.size100 (24px)
 * - large: iconSizes.size125 (32px)
 * 
 * Fails loudly if icon size token is missing to prevent silent fallback issues.
 * 
 * @param buttonSize - Button size variant
 * @returns Type-safe IconSize value from token reference
 * @throws Error if icon size token is missing
 */
function getIconSizeForButton(buttonSize: ButtonSize): IconSize {
  let iconSize: IconSize;
  
  switch (buttonSize) {
    case 'small':
    case 'medium':
      iconSize = iconSizes.size100;
      if (!iconSize) {
        throw new Error('ButtonCTA: iconSizes.size100 token is missing');
      }
      break;
    case 'large':
      iconSize = iconSizes.size125;
      if (!iconSize) {
        throw new Error('ButtonCTA: iconSizes.size125 token is missing');
      }
      break;
    default:
      throw new Error(`ButtonCTA: Invalid button size "${buttonSize}"`);
  }
  
  return iconSize;
}

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
 * - Uses blend utilities for state colors (hover, pressed, disabled, icon)
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
 *   variant="primary"
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
  
  // Theme-aware blend utilities instance
  // Uses getBlendUtilities() factory for consistent state styling
  // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  private _disabledColor: string = '';
  private _iconColor: string = '';
  private _iconOpticalBalanceColor: string = '';
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): string[] {
    return ['label', 'size', 'variant', 'icon', 'no-wrap', 'disabled', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
    this._blendUtils = getBlendUtilities();
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render and sets up event listeners.
   * Calculates blend colors from CSS custom properties.
   */
  connectedCallback(): void {
    this._calculateBlendColors();
    this.render();
    this._attachEventListeners();
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads base colors from CSS custom properties and applies theme-aware blend
   * utilities to generate state colors (hover, pressed, disabled, icon).
   * 
   * Uses getBlendUtilities() factory functions instead of direct blend calculations
   * for cross-platform consistency with iOS and Android implementations.
   * 
   * State color mappings:
   * - Hover: darkerBlend(color.primary, blend.hoverDarker) - 8% darker
   * - Pressed: darkerBlend(color.primary, blend.pressedDarker) - 12% darker
   * - Disabled: desaturate(color.primary, blend.disabledDesaturate) - 12% less saturated
   * - Icon: lighterBlend(color.onPrimary, blend.iconLighter) - 8% lighter
   * 
   * @see Requirements: 7.1, 7.2, 7.3, 7.4 - ButtonCTA state colors
   * @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
   * @throws Error if required color tokens are missing from CSS custom properties
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get base colors from CSS custom properties
    // Fail loudly if required tokens are missing
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    const onPrimaryColor = computedStyle.getPropertyValue('--color-text-on-primary').trim();
    
    if (!primaryColor) {
      throw new Error('ButtonCTA: Required token --color-primary is missing from CSS custom properties');
    }
    if (!onPrimaryColor) {
      throw new Error('ButtonCTA: Required token --color-text-on-primary is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    // Uses semantic convenience functions from getBlendUtilities()
    // @see Requirements: 7.1 - Hover uses darkerBlend(color.primary, blend.hoverDarker)
    this._hoverColor = this._blendUtils.hoverColor(primaryColor);
    
    // @see Requirements: 7.2 - Pressed uses darkerBlend(color.primary, blend.pressedDarker)
    this._pressedColor = this._blendUtils.pressedColor(primaryColor);
    
    // @see Requirements: 7.3 - Disabled uses desaturate(color.primary, blend.disabledDesaturate)
    this._disabledColor = this._blendUtils.disabledColor(primaryColor);
    
    // @see Requirements: 7.4 - Icon uses lighterBlend(color.onPrimary, blend.iconLighter)
    // Icon for primary buttons: provides optical balance for icons on primary background
    this._iconColor = this._blendUtils.iconColor(onPrimaryColor);
    
    // Icon for secondary/tertiary buttons: provides optical balance for icons on light background
    this._iconOpticalBalanceColor = this._blendUtils.iconColor(primaryColor);
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
   * Get the button visual variant.
   */
  get buttonVariant(): ButtonStyle {
    const variant = this.getAttribute('variant');
    return (variant === 'primary' || variant === 'secondary' || variant === 'tertiary') ? variant : 'primary';
  }
  
  /**
   * Set the button visual variant.
   */
  set buttonVariant(value: ButtonStyle) {
    this.setAttribute('variant', value);
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
   * CSS is imported as a string and injected into shadow DOM via <style> tag
   * for browser bundle compatibility.
   * 
   * Uses <dp-icon> web component for icon rendering, following the same
   * component composition pattern as iOS and Android platforms.
   * 
   * Applies blend colors via CSS custom properties for state styling
   * (hover, pressed, disabled, icon) instead of opacity/filter workarounds.
   */
  private render(): void {
    const label = this.label;
    const size = this.size;
    const variant = this.buttonVariant;
    const icon = this.icon;
    const noWrap = this.noWrap;
    const disabled = this.disabled;
    const testID = this.testID;
    
    // Generate class names
    const buttonClasses = [
      'button-cta',
      `button-cta--${size}`,
      `button-cta--${variant}`,
      disabled ? 'button-cta--disabled' : ''
    ].filter(Boolean).join(' ');
    
    // Get icon size for button size variant
    // Icon sizes are type-safe mapped from button size:
    // - Small/Medium: 24px (iconSize100)
    // - Large: 32px (iconSize125)
    const iconSize: IconSize = getIconSizeForButton(size);
    
    // Generate label class
    const labelClass = noWrap ? 'button-cta__label--no-wrap' : 'button-cta__label';
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate blend color CSS custom properties
    // These are component-specific calculated values (not design tokens)
    // Using _cta prefix to distinguish from design token references
    const blendColorStyles = `
      --_cta-hover-bg: ${this._hoverColor};
      --_cta-pressed-bg: ${this._pressedColor};
      --_cta-disabled-bg: ${this._disabledColor};
      --_cta-icon-color: ${this._iconColor};
      --_cta-icon-optical: ${this._iconOpticalBalanceColor};
    `;
    
    // Use imported CSS string in <style> tag for browser bundle compatibility
    // This approach bundles CSS into JS, avoiding external CSS file dependencies
    // @see scripts/esbuild-css-plugin.js
    // @see Requirements: 8.2, 8.3 (components render correctly in browser bundles)
    
    // Render shadow DOM content
    // Uses <dp-icon> web component for icon rendering (component composition pattern)
    // This matches iOS and Android platforms which use Icon() component composition
    // @see Requirements: 8.2, 8.3 (components render correctly with interactivity)
    this._shadowRoot.innerHTML = `
      <style>${buttonStyles}</style>
      <button 
        class="${buttonClasses}"
        type="button"
        role="button"
        ${disabled ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'}
        ${testIDAttr}
        aria-label="${label}"
        style="${blendColorStyles}"
      >
        ${icon ? `<span class="button-cta__icon" aria-hidden="true"><dp-icon name="${icon}" size="${iconSize}" color="inherit"></dp-icon></span>` : ''}
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