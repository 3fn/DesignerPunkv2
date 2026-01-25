/**
 * Button-CTA Component for Web Platform (Vanilla Web Component)
 * 
 * Cross-platform call-to-action button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * Uses <icon-base> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Uses theme-aware blend utilities for state colors (hover, pressed, disabled, icon)
 * instead of opacity or filter workarounds. This ensures cross-platform consistency
 * with iOS and Android implementations.
 * 
 * @module Button-CTA/platforms/web
 * @see Requirements: 7.1, 7.2, 7.3, 7.4, 11.1, 11.2, 11.3
 */

/// <reference lib="dom" />

import { ButtonSize, ButtonStyle } from '../../types';
// Import Icon-Base to ensure it's registered before ButtonCTA uses it
// Migrated from legacy Icon directory to Icon-Base (Stemma System naming)
import '../../../Icon-Base/platforms/web/IconBase.web';
import { IconBaseSize, iconBaseSizes } from '../../../Icon-Base/types';
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
 * Map Button-CTA size to appropriate IconBaseSize using explicit token references.
 * 
 * Provides type-safe mapping from button size variants to icon sizes:
 * - small/medium: iconBaseSizes.size100 (24px)
 * - large: iconBaseSizes.size125 (32px)
 * 
 * Fails loudly if icon size token is missing to prevent silent fallback issues.
 * 
 * @param buttonSize - Button size variant
 * @returns Type-safe IconBaseSize value from token reference
 * @throws Error if icon size token is missing
 */
function getIconSizeForButton(buttonSize: ButtonSize): IconBaseSize {
  let iconSize: IconBaseSize;
  
  switch (buttonSize) {
    case 'small':
    case 'medium':
      iconSize = iconBaseSizes.size100;
      if (!iconSize) {
        throw new Error('ButtonCTA: iconBaseSizes.size100 token is missing');
      }
      break;
    case 'large':
      iconSize = iconBaseSizes.size125;
      if (!iconSize) {
        throw new Error('ButtonCTA: iconBaseSizes.size125 token is missing');
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
  
  // Incremental DOM update tracking
  // @see Requirements: 2.1, 2.2, 2.3, 2.4, 2.5 - Incremental DOM update strategy
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  // @see Requirements: 2.4 - Cache references to DOM elements that will be updated
  private _button: HTMLButtonElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _iconEl: HTMLElement | null = null;
  private _iconContainer: HTMLSpanElement | null = null;
  
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
   * 
   * Defers blend color calculation until document is ready to ensure
   * CSS custom properties are available from parsed stylesheets.
   */
  connectedCallback(): void {
    // Defer blend color calculation until styles are loaded
    // This handles the case where custom elements are defined before CSS is parsed
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._calculateBlendColorsWithRetry();
        this.render();
      }, { once: true });
    } else {
      this._calculateBlendColorsWithRetry();
      this.render();
    }
    this._attachEventListeners();
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
          console.warn('ButtonCTA: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
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
   * - Hover: darkerBlend(color.action.primary, blend.hoverDarker) - 8% darker
   * - Pressed: darkerBlend(color.action.primary, blend.pressedDarker) - 12% darker
   * - Disabled: desaturate(color.action.primary, blend.disabledDesaturate) - 12% less saturated
   * - Icon: lighterBlend(color.contrast.onDark, blend.iconLighter) - 8% lighter
   * 
   * @see Requirements: 7.1, 7.2, 7.3, 7.4 - Button-CTA state colors
   * @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
   * @throws Error if required color tokens are missing from CSS custom properties
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get base colors from CSS custom properties
    // Fail loudly if required tokens are missing
    // Updated to use new semantic token names (Spec 052)
    const primaryColor = computedStyle.getPropertyValue('--color-action-primary').trim();
    const onDarkColor = computedStyle.getPropertyValue('--color-contrast-on-dark').trim();
    
    if (!primaryColor) {
      throw new Error('ButtonCTA: Required token --color-action-primary is missing from CSS custom properties');
    }
    if (!onDarkColor) {
      throw new Error('ButtonCTA: Required token --color-contrast-on-dark is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    // Uses semantic convenience functions from getBlendUtilities()
    // @see Requirements: 7.1 - Hover uses darkerBlend(color.action.primary, blend.hoverDarker)
    this._hoverColor = this._blendUtils.hoverColor(primaryColor);
    
    // @see Requirements: 7.2 - Pressed uses darkerBlend(color.action.primary, blend.pressedDarker)
    this._pressedColor = this._blendUtils.pressedColor(primaryColor);
    
    // @see Requirements: 7.3 - Disabled uses desaturate(color.action.primary, blend.disabledDesaturate)
    this._disabledColor = this._blendUtils.disabledColor(primaryColor);
    
    // @see Requirements: 7.4 - Icon uses lighterBlend(color.contrast.onDark, blend.iconLighter)
    // Icon for primary buttons: provides optical balance for icons on primary background
    this._iconColor = this._blendUtils.iconColor(onDarkColor);
    
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
   * Triggers incremental DOM update to reflect the new attribute value.
   * Uses _updateDOM() instead of full render to preserve element identity
   * for CSS transitions.
   * 
   * @see Requirements: 2.2, 2.3 - Update existing DOM elements via _updateDOM()
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    // Only update if value changed, element is connected, and DOM exists
    if (oldValue !== newValue && this.isConnected && this._domCreated) {
      this._updateDOM();
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
  
  // ============================================================================
  // Rendering (Incremental Update Architecture)
  // ============================================================================
  
  /**
   * Main render entry point.
   * 
   * Routes to _createDOM() for first render or _updateDOM() for subsequent updates.
   * This architecture enables CSS transitions by preserving DOM element identity.
   * 
   * @see Requirements: 2.1, 2.2, 2.3, 2.4, 2.5 - Incremental DOM update strategy
   */
  private render(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
      this._attachEventListeners();
    } else {
      this._updateDOM();
    }
  }
  
  /**
   * Create the initial DOM structure (called once).
   * 
   * Creates all elements and caches references for incremental updates.
   * This ensures DOM elements exist for CSS transitions to work.
   * 
   * CSS is imported as a string and injected into shadow DOM via <style> tag
   * for browser bundle compatibility.
   * 
   * Uses <icon-base> web component for icon rendering, following the same
   * component composition pattern as iOS and Android platforms.
   * 
   * @see Requirements: 2.1 - Create initial DOM structure via _createDOM()
   * @see Requirements: 2.4 - Cache references to DOM elements
   * @see Requirements: 8.2, 8.3 (components render correctly in browser bundles)
   */
  private _createDOM(): void {
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
    // - Small/Medium: 24px (iconBaseSize100)
    // - Large: 32px (iconBaseSize125)
    const iconSize: IconBaseSize = getIconSizeForButton(size);
    
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
    
    // Create the shadow DOM structure
    // Uses <icon-base> web component for icon rendering (component composition pattern)
    // This matches iOS and Android platforms which use IconBase() component composition
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
        <span class="button-cta__icon" aria-hidden="true" style="${icon ? '' : 'display: none;'}">
          <icon-base name="${icon || ''}" size="${iconSize}" color="inherit"></icon-base>
        </span>
        <span class="${labelClass}">${label}</span>
      </button>
    `;
    
    // Cache element references for incremental updates
    // @see Requirements: 2.4 - Cache references to DOM elements that will be updated
    this._button = this._shadowRoot.querySelector('button');
    this._labelEl = this._shadowRoot.querySelector('.button-cta__label, .button-cta__label--no-wrap');
    this._iconContainer = this._shadowRoot.querySelector('.button-cta__icon');
    this._iconEl = this._iconContainer?.querySelector('icon-base') || null;
  }
  
  /**
   * Update existing DOM elements (called on attribute changes).
   * 
   * Only updates properties that need to change, preserving DOM element identity.
   * This enables CSS transitions to animate smoothly between states.
   * 
   * Uses direct DOM APIs (element.setAttribute, element.className, element.style)
   * instead of innerHTML replacement.
   * 
   * @see Requirements: 2.2 - Update existing DOM elements via _updateDOM()
   * @see Requirements: 2.3 - SHALL NOT replace innerHTML of the shadow root
   * @see Requirements: 2.5 - Use direct DOM APIs for updates
   */
  private _updateDOM(): void {
    if (!this._button || !this._labelEl) return;
    
    const label = this.label;
    const size = this.size;
    const variant = this.buttonVariant;
    const icon = this.icon;
    const noWrap = this.noWrap;
    const disabled = this.disabled;
    const testID = this.testID;
    
    // Get icon size for button size variant
    const iconSize: IconBaseSize = getIconSizeForButton(size);
    
    // ─────────────────────────────────────────────────────────────────
    // Update button element
    // ─────────────────────────────────────────────────────────────────
    
    // Update CSS class (preserves element identity for transitions)
    const buttonClasses = [
      'button-cta',
      `button-cta--${size}`,
      `button-cta--${variant}`,
      disabled ? 'button-cta--disabled' : ''
    ].filter(Boolean).join(' ');
    this._button.className = buttonClasses;
    
    // Update disabled state
    if (disabled) {
      this._button.setAttribute('disabled', '');
      this._button.setAttribute('aria-disabled', 'true');
    } else {
      this._button.removeAttribute('disabled');
      this._button.setAttribute('aria-disabled', 'false');
    }
    
    // Update aria-label
    this._button.setAttribute('aria-label', label);
    
    // Update test ID
    if (testID) {
      this._button.setAttribute('data-testid', testID);
    } else {
      this._button.removeAttribute('data-testid');
    }
    
    // Update blend color CSS custom properties
    this._button.style.setProperty('--_cta-hover-bg', this._hoverColor);
    this._button.style.setProperty('--_cta-pressed-bg', this._pressedColor);
    this._button.style.setProperty('--_cta-disabled-bg', this._disabledColor);
    this._button.style.setProperty('--_cta-icon-color', this._iconColor);
    this._button.style.setProperty('--_cta-icon-optical', this._iconOpticalBalanceColor);
    
    // ─────────────────────────────────────────────────────────────────
    // Update label element
    // ─────────────────────────────────────────────────────────────────
    
    // Update label text
    this._labelEl.textContent = label;
    
    // Update label class for no-wrap
    this._labelEl.className = noWrap ? 'button-cta__label--no-wrap' : 'button-cta__label';
    
    // ─────────────────────────────────────────────────────────────────
    // Update icon element
    // ─────────────────────────────────────────────────────────────────
    
    if (this._iconContainer && this._iconEl) {
      // Show/hide icon container based on whether icon is set
      if (icon) {
        this._iconContainer.style.display = '';
        this._iconEl.setAttribute('name', icon);
        this._iconEl.setAttribute('size', String(iconSize));
      } else {
        this._iconContainer.style.display = 'none';
      }
    }
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
