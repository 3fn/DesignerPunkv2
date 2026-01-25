/**
 * Button-Icon Component for Web Platform (Vanilla Web Component)
 * 
 * Circular icon-only interactive button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * Uses <icon-base> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Design Decisions:
 * - No `disabled` prop by design (see Requirement 11.1)
 * - Required `aria-label` for accessibility (see Requirement 4.1)
 * - Self-contained focus ring buffer (see Requirement 6.3)
 * - Circular shape via radiusCircle token (see Requirement 3.1)
 * 
 * @module Button-Icon/platforms/web
 * @see Requirements: 4.2, 14.3
 */

/// <reference lib="dom" />

import { ButtonIconSize, ButtonIconVariant, BUTTON_ICON_DEFAULTS } from '../../types';
// Import Icon-Base to ensure it's registered before Button-Icon uses it
// Migrated from legacy Icon directory to Icon-Base (Stemma System naming)
import '../../../Icon-Base/platforms/web/IconBase.web';
import { IconBaseSize, iconBaseSizes } from '../../../Icon-Base/types';
// Import theme-aware blend utilities for state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 1.1, 1.2, 1.5, 1.6 - Blend utility adoption
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// @see scripts/esbuild-css-plugin.js
// @see Requirements: 5.1, 5.3, 5.4 (external CSS file with esbuild plugin pattern)
import buttonIconStyles from './ButtonIcon.web.css';

/**
 * Map Button-Icon size to appropriate IconBaseSize using explicit token references.
 * 
 * Provides type-safe mapping from button size variants to icon sizes:
 * - small: iconBaseSizes.size050 (13px)
 * - medium: iconBaseSizes.size075 (18px)
 * - large: iconBaseSizes.size100 (24px)
 * 
 * Fails loudly if icon size token is missing to prevent silent fallback issues.
 * 
 * @param buttonSize - Button size variant
 * @returns Type-safe IconBaseSize value from token reference
 * @throws Error if icon size token is missing
 * 
 * @see Requirements 1.1, 1.2, 1.3
 */
function getIconSizeForButton(buttonSize: ButtonIconSize): IconBaseSize {
  let iconSize: IconBaseSize;
  
  switch (buttonSize) {
    case 'small':
      iconSize = iconBaseSizes.size050;
      if (!iconSize) {
        throw new Error('ButtonIcon: iconBaseSizes.size050 token is missing');
      }
      break;
    case 'medium':
      iconSize = iconBaseSizes.size075;
      if (!iconSize) {
        throw new Error('ButtonIcon: iconBaseSizes.size075 token is missing');
      }
      break;
    case 'large':
      iconSize = iconBaseSizes.size100;
      if (!iconSize) {
        throw new Error('ButtonIcon: iconBaseSizes.size100 token is missing');
      }
      break;
    default:
      throw new Error(`ButtonIcon: Invalid button size "${buttonSize}"`);
  }
  
  return iconSize;
}

/**
 * ButtonIcon Web Component
 * 
 * A native web component that renders a circular, icon-only button with token-based
 * styling and platform-specific interaction patterns.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic `<button>` element with type="button" for proper accessibility
 * - Token-based styling via CSS custom properties
 * - Circular shape via radiusCircle token (border-radius: 50%)
 * - Self-contained focus ring buffer (4px on all sides)
 * - WCAG 2.1 AA compliant:
 *   - Required aria-label for screen reader support
 *   - Keyboard navigation (Tab, Enter, Space)
 *   - Focus indicators with 3:1 contrast ratio
 *   - Minimum 48px touch targets for all sizes
 * 
 * RENDERING ARCHITECTURE:
 * Uses incremental DOM updates rather than full re-renders to enable CSS transitions.
 * - _createDOM(): Called once on first render, creates the full DOM structure
 * - _updateDOM(): Called on attribute changes, updates only changed properties
 * This preserves DOM element identity, allowing CSS transitions to animate smoothly.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <button-icon icon="settings" aria-label="Open settings"></button-icon>
 * 
 * <!-- With all attributes -->
 * <button-icon
 *   icon="settings"
 *   aria-label="Open settings"
 *   size="large"
 *   variant="primary"
 *   test-id="settings-button"
 * ></button-icon>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const button = document.createElement('button-icon') as ButtonIcon;
 * button.icon = 'settings';
 * button.ariaLabel = 'Open settings';
 * button.addEventListener('press', () => console.log('Clicked'));
 * document.body.appendChild(button);
 * ```
 * 
 * @see Requirements 4.2, 14.3
 * @see Requirements 2.1, 2.2, 2.3, 2.4, 2.5 - Incremental DOM update strategy
 */
export class ButtonIcon extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  // Incremental DOM update tracking
  // @see Requirements: 2.1, 2.2, 2.3, 2.4, 2.5 - Incremental DOM update strategy
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  // @see Requirements: 2.4 - Cache references to DOM elements that will be updated
  private _button: HTMLButtonElement | null = null;
  private _iconEl: HTMLElement | null = null;
  private _iconContainer: HTMLSpanElement | null = null;
  
  // Theme-aware blend utilities instance
  // Uses getBlendUtilities() factory for consistent state styling
  // @see Requirements: 1.1, 1.2, 1.5, 1.6 - Blend utility adoption
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   * 
   * @see Requirements 4.2 - aria-label attribute for accessibility
   */
  static get observedAttributes(): string[] {
    return ['icon', 'aria-label', 'size', 'variant', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 1.1, 1.2, 1.5, 1.6 - Blend utility adoption
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
    
    // Warn if ariaLabel is empty (development aid)
    if (!this.ariaLabel) {
      console.warn(
        'ButtonIcon: Missing required "aria-label" attribute. ' +
        'Icon-only buttons require aria-label for screen reader accessibility.'
      );
    }
  }
  
  /**
   * Calculate blend colors with retry logic for CSS loading race conditions.
   * 
   * Uses requestAnimationFrame to ensure CSS is fully applied before reading
   * custom properties. Falls back to default colors if tokens are still unavailable.
   * 
   * @see Requirements: 1.1, 1.2, 1.5, 1.6 - Blend utility adoption
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
          console.warn('ButtonIcon: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads base colors from CSS custom properties and applies theme-aware blend
   * utilities to generate state colors (hover, pressed).
   * 
   * Uses getBlendUtilities() factory functions instead of direct blend calculations
   * for cross-platform consistency with iOS and Android implementations.
   * 
   * State color mappings:
   * - Hover: darkerBlend(color.primary, blend.hoverDarker) - 8% darker
   * - Pressed: darkerBlend(color.primary, blend.pressedDarker) - 12% darker
   * 
   * @see Requirements: 1.1, 1.2, 1.5, 1.6 - Blend utility adoption
   * @throws Error if required color tokens are missing from CSS custom properties
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get base color from CSS custom properties
    // For ButtonIcon, we use the action primary color as the base for all variants
    const primaryColor = computedStyle.getPropertyValue('--color-action-primary').trim();
    
    if (!primaryColor) {
      throw new Error('ButtonIcon: Required token --color-action-primary is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    // Uses semantic convenience functions from getBlendUtilities()
    // @see Requirements: 1.1 - Hover uses darkerBlend(color.action.primary, blend.hoverDarker)
    this._hoverColor = this._blendUtils.hoverColor(primaryColor);
    
    // @see Requirements: 1.2 - Pressed uses darkerBlend(color.action.primary, blend.pressedDarker)
    this._pressedColor = this._blendUtils.pressedColor(primaryColor);
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
  
  // ============================================================================
  // Property Getters/Setters
  // ============================================================================
  
  /**
   * Get the icon name.
   */
  get icon(): string {
    return this.getAttribute('icon') || '';
  }
  
  /**
   * Set the icon name.
   */
  set icon(value: string) {
    this.setAttribute('icon', value);
  }
  
  /**
   * Get the accessible label.
   * 
   * @see Requirements 4.1, 4.2
   */
  get ariaLabel(): string {
    return this.getAttribute('aria-label') || '';
  }
  
  /**
   * Set the accessible label.
   * 
   * @see Requirements 4.1, 4.2
   */
  set ariaLabel(value: string) {
    this.setAttribute('aria-label', value);
  }
  
  /**
   * Get the button size variant.
   * 
   * @see Requirements 1.1, 1.2, 1.3, 1.5
   */
  get size(): ButtonIconSize {
    const size = this.getAttribute('size');
    return (size === 'small' || size === 'medium' || size === 'large') 
      ? size 
      : BUTTON_ICON_DEFAULTS.size;
  }
  
  /**
   * Set the button size variant.
   */
  set size(value: ButtonIconSize) {
    this.setAttribute('size', value);
  }
  
  /**
   * Get the button visual variant.
   * 
   * @see Requirements 2.1, 2.2, 2.3, 2.4
   */
  get buttonVariant(): ButtonIconVariant {
    const variant = this.getAttribute('variant');
    return (variant === 'primary' || variant === 'secondary' || variant === 'tertiary') 
      ? variant 
      : BUTTON_ICON_DEFAULTS.variant;
  }
  
  /**
   * Set the button visual variant.
   */
  set buttonVariant(value: ButtonIconVariant) {
    this.setAttribute('variant', value);
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
   * @see Requirements: 2.1 - Create initial DOM structure via _createDOM()
   * @see Requirements: 2.4 - Cache references to DOM elements
   * @see Requirements: 5.1, 5.3, 5.4 - External CSS file with esbuild plugin pattern
   */
  private _createDOM(): void {
    const icon = this.icon;
    const ariaLabel = this.ariaLabel;
    const size = this.size;
    const variant = this.buttonVariant;
    const testID = this.testID;
    
    // Get icon size for button size variant
    const iconSize: IconBaseSize = getIconSizeForButton(size);
    
    // Generate class names
    const buttonClasses = [
      'button-icon',
      `button-icon--${size}`,
      `button-icon--${variant}`,
    ].filter(Boolean).join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate blend color CSS custom properties
    const blendColorStyles = `
      --_bi-hover-bg: ${this._hoverColor};
      --_bi-pressed-bg: ${this._pressedColor};
    `;
    
    // Create the shadow DOM structure
    // Uses <icon-base> web component for icon rendering (component composition pattern)
    // Icon is marked as decorative (aria-hidden="true") since button has aria-label
    // @see Requirements 4.2, 4.5
    this._shadowRoot.innerHTML = `
      <style>${buttonIconStyles}</style>
      <button 
        class="${buttonClasses}"
        type="button"
        role="button"
        aria-label="${ariaLabel}"
        ${testIDAttr}
        style="${blendColorStyles}"
      >
        <span class="button-icon__icon" aria-hidden="true">
          <icon-base name="${icon}" size="${iconSize}" color="inherit"></icon-base>
        </span>
      </button>
    `;
    
    // Cache element references for incremental updates
    // @see Requirements: 2.4 - Cache references to DOM elements that will be updated
    this._button = this._shadowRoot.querySelector('button');
    this._iconContainer = this._shadowRoot.querySelector('.button-icon__icon');
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
    if (!this._button || !this._iconEl) return;
    
    const icon = this.icon;
    const ariaLabel = this.ariaLabel;
    const size = this.size;
    const variant = this.buttonVariant;
    const testID = this.testID;
    
    // Get icon size for button size variant
    const iconSize: IconBaseSize = getIconSizeForButton(size);
    
    // ─────────────────────────────────────────────────────────────────
    // Update button element
    // ─────────────────────────────────────────────────────────────────
    
    // Update CSS class (preserves element identity for transitions)
    const buttonClasses = [
      'button-icon',
      `button-icon--${size}`,
      `button-icon--${variant}`,
    ].filter(Boolean).join(' ');
    this._button.className = buttonClasses;
    
    // Update aria-label
    this._button.setAttribute('aria-label', ariaLabel);
    
    // Update test ID
    if (testID) {
      this._button.setAttribute('data-testid', testID);
    } else {
      this._button.removeAttribute('data-testid');
    }
    
    // Update blend color CSS custom properties
    // @see Requirements: 1.5, 1.6 - Apply colors via CSS custom properties
    this._button.style.setProperty('--_bi-hover-bg', this._hoverColor);
    this._button.style.setProperty('--_bi-pressed-bg', this._pressedColor);
    
    // ─────────────────────────────────────────────────────────────────
    // Update icon element
    // ─────────────────────────────────────────────────────────────────
    
    // Update icon name and size (direct DOM API, preserves element identity)
    this._iconEl.setAttribute('name', icon);
    this._iconEl.setAttribute('size', String(iconSize));
  }
  
  // ============================================================================
  // Event Handling
  // ============================================================================
  
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
 * Makes <button-icon> available as a custom HTML element.
 * 
 * @see Requirements 14.3 - True Native Architecture with separate platform implementations
 */
if (!customElements.get('button-icon')) {
  customElements.define('button-icon', ButtonIcon);
}

/**
 * Default export for convenience.
 */
export default ButtonIcon;
