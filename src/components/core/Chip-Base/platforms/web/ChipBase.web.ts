/**
 * Chip-Base Component for Web Platform (Vanilla Web Component)
 * 
 * Compact, interactive element for filtering, selection, or input management.
 * Follows True Native Architecture with build-time platform separation.
 * 
 * Stemma System Naming: [Family]-[Type] = Chip-Base
 * Component Type: Primitive
 * 
 * Uses <icon-base> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Uses theme-aware blend utilities for state colors (hover, pressed) instead of
 * opacity or filter workarounds. This ensures cross-platform consistency with
 * iOS and Android implementations.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Chip-Base/platforms/web
 * @see Requirements: 1.1-1.3, 2.1-2.6, 3.1-3.4, 6.1, 6.4 in .kiro/specs/045-chip-base/requirements.md
 */

/// <reference lib="dom" />

import { 
  ChipBaseElement as IChipBaseElement, 
  IconName,
  CHIP_BASE_OBSERVED_ATTRIBUTES 
} from '../../types';
// Import Icon-Base to ensure it's registered before ChipBase uses it
import '../../../Icon-Base/platforms/web/IconBase.web';
import { iconBaseSizes } from '../../../Icon-Base/types';
// Import theme-aware blend utilities for state color calculations
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import chipStyles from './ChipBase.styles.css';

/**
 * ChipBaseElement Web Component
 * 
 * A native web component that renders a compact, interactive chip element with
 * token-based styling, optional leading icon, and platform-specific interaction patterns.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic button role with proper accessibility
 * - Token-based styling via CSS custom properties
 * - Uses blend utilities for state colors (hover, pressed)
 * - WCAG 2.1 AA compliant:
 *   - Keyboard navigation (Tab, Enter, Space)
 *   - Focus indicators with 3:1 contrast ratio
 *   - 48px tap area (exceeds WCAG 44px requirement)
 *   - Screen reader support with ARIA attributes
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <chip-base label="Category"></chip-base>
 * 
 * <!-- With icon -->
 * <chip-base label="Filter" icon="check"></chip-base>
 * 
 * <!-- With all attributes -->
 * <chip-base
 *   label="Technology"
 *   icon="settings"
 *   test-id="tech-chip"
 * ></chip-base>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const chip = document.createElement('chip-base') as ChipBaseElement;
 * chip.label = 'Category';
 * chip.icon = 'check';
 * chip.onPress = () => console.log('Chip pressed');
 * document.body.appendChild(chip);
 * ```
 * 
 * @see Requirements: 1.1, 1.2, 1.3, 2.1-2.6, 3.1-3.4, 6.1, 6.4, 7.1-7.3, 7.6
 */
export class ChipBaseElement extends HTMLElement implements IChipBaseElement {
  private _shadowRoot: ShadowRoot;
  
  // Incremental DOM update tracking
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  private _chipEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _iconContainer: HTMLSpanElement | null = null;
  private _iconEl: HTMLElement | null = null;
  
  // Theme-aware blend utilities instance
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  
  // Event callback
  private _onPress: (() => void) | null = null;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): readonly string[] {
    return CHIP_BASE_OBSERVED_ATTRIBUTES;
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize theme-aware blend utilities
    this._blendUtils = getBlendUtilities();
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render and sets up event listeners.
   * Calculates blend colors from CSS custom properties.
   */
  connectedCallback(): void {
    // Defer blend color calculation until styles are loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._calculateBlendColorsWithRetry();
        this._render();
      }, { once: true });
    } else {
      this._calculateBlendColorsWithRetry();
      this._render();
    }
  }
  
  /**
   * Calculate blend colors with retry logic for CSS loading race conditions.
   */
  private _calculateBlendColorsWithRetry(): void {
    try {
      this._calculateBlendColors();
    } catch (error) {
      // CSS might not be fully applied yet, retry after next frame
      requestAnimationFrame(() => {
        try {
          this._calculateBlendColors();
          this._render();
        } catch (retryError) {
          console.warn('ChipBase: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads surface color from CSS custom properties and applies theme-aware blend
   * utilities to generate state colors (hover, pressed).
   * 
   * State color mappings:
   * - Hover: darkerBlend(color.structure.surface, blend.hoverDarker) - 8% darker
   * - Pressed: darkerBlend(color.structure.surface, blend.pressedDarker) - 12% darker
   * 
   * @see Requirements: 3.2, 3.3 - Hover and pressed state colors
   */
  private _calculateBlendColors(): void {
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get surface color for state calculations
    const surfaceColor = computedStyle.getPropertyValue('--color-structure-surface').trim();
    
    if (!surfaceColor) {
      throw new Error('ChipBase: Required token --color-structure-surface is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    this._hoverColor = this._blendUtils.hoverColor(surfaceColor);
    this._pressedColor = this._blendUtils.pressedColor(surfaceColor);
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
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected && this._domCreated) {
      this._updateDOM();
    }
  }
  
  // ============================================================================
  // Property Accessors
  // ============================================================================
  
  /**
   * Get the chip label text.
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }
  
  /**
   * Set the chip label text.
   */
  set label(value: string) {
    this.setAttribute('label', value);
  }
  
  /**
   * Get the icon name.
   */
  get icon(): IconName | null {
    return this.getAttribute('icon');
  }
  
  /**
   * Set the icon name.
   */
  set icon(value: IconName | null) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
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
   * Get the press callback.
   */
  get onPress(): (() => void) | null {
    return this._onPress;
  }
  
  /**
   * Set the press callback.
   */
  set onPress(value: (() => void) | null) {
    this._onPress = value;
  }
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  /**
   * Main render entry point.
   * 
   * Routes to _createDOM() for first render or _updateDOM() for subsequent updates.
   */
  private _render(): void {
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
   * Uses <icon-base> web component for icon rendering.
   * 
   * @see Requirements: 1.1, 1.2, 2.1-2.6
   */
  private _createDOM(): void {
    const label = this.label;
    const icon = this.icon;
    const testID = this.testID;
    
    // Icon size for chips: icon.size075 (20px)
    const iconSize = iconBaseSizes.size075;
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate blend color CSS custom properties
    const blendColorStyles = `
      --_chip-hover-bg: ${this._hoverColor};
      --_chip-pressed-bg: ${this._pressedColor};
    `;
    
    // Create the shadow DOM structure
    this._shadowRoot.innerHTML = `
      <style>${chipStyles}</style>
      <div 
        class="chip-base"
        role="button"
        tabindex="0"
        ${testIDAttr}
        aria-label="${label}"
        style="${blendColorStyles}"
      >
        <span class="chip-base__icon" aria-hidden="true" style="${icon ? '' : 'display: none;'}">
          <icon-base name="${icon || ''}" size="${iconSize}" color="inherit"></icon-base>
        </span>
        <span class="chip-base__label">${label}</span>
      </div>
    `;
    
    // Cache element references for incremental updates
    this._chipEl = this._shadowRoot.querySelector('.chip-base');
    this._labelEl = this._shadowRoot.querySelector('.chip-base__label');
    this._iconContainer = this._shadowRoot.querySelector('.chip-base__icon');
    this._iconEl = this._iconContainer?.querySelector('icon-base') || null;
  }
  
  /**
   * Update existing DOM elements (called on attribute changes).
   * 
   * Only updates properties that need to change, preserving DOM element identity.
   * 
   * @see Requirements: 2.2, 2.3
   */
  private _updateDOM(): void {
    if (!this._chipEl || !this._labelEl) return;
    
    const label = this.label;
    const icon = this.icon;
    const testID = this.testID;
    
    // Icon size for chips: icon.size075 (20px)
    const iconSize = iconBaseSizes.size075;
    
    // Update aria-label
    this._chipEl.setAttribute('aria-label', label);
    
    // Update test ID
    if (testID) {
      this._chipEl.setAttribute('data-testid', testID);
    } else {
      this._chipEl.removeAttribute('data-testid');
    }
    
    // Update blend color CSS custom properties
    this._chipEl.style.setProperty('--_chip-hover-bg', this._hoverColor);
    this._chipEl.style.setProperty('--_chip-pressed-bg', this._pressedColor);
    
    // Update label text
    this._labelEl.textContent = label;
    
    // Update icon
    if (this._iconContainer && this._iconEl) {
      if (icon) {
        this._iconContainer.style.display = '';
        this._iconEl.setAttribute('name', icon);
        this._iconEl.setAttribute('size', String(iconSize));
      } else {
        this._iconContainer.style.display = 'none';
      }
    }
  }
  
  // ============================================================================
  // Event Handling
  // ============================================================================
  
  /**
   * Attach event listeners to the chip.
   * 
   * Listens for click and keyboard events and calls onPress callback.
   * 
   * @see Requirements: 1.3, 7.1, 7.3 - Press handling and keyboard activation
   */
  private _attachEventListeners(): void {
    if (this._chipEl) {
      this._chipEl.addEventListener('click', this._handleClick);
      this._chipEl.addEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Detach event listeners from the chip.
   */
  private _detachEventListeners(): void {
    if (this._chipEl) {
      this._chipEl.removeEventListener('click', this._handleClick);
      this._chipEl.removeEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Handle chip click events.
   * 
   * Calls the onPress callback if defined.
   * 
   * @see Requirements: 1.3 - Call onPress callback when pressed
   */
  private _handleClick = (_event: Event): void => {
    if (this._onPress) {
      this._onPress();
    }
    
    // Dispatch custom 'press' event for event listener pattern
    this.dispatchEvent(new CustomEvent('press', {
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle keyboard events for accessibility.
   * 
   * Ensures Enter and Space keys activate the chip (WCAG 2.1 AA requirement).
   * 
   * @see Requirements: 7.3 - Space/Enter activates chip
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default space scrolling
      
      if (this._onPress) {
        this._onPress();
      }
      
      // Dispatch custom 'press' event
      this.dispatchEvent(new CustomEvent('press', {
        bubbles: true,
        composed: true
      }));
    }
  };
}

/**
 * Register the custom element.
 * 
 * Makes <chip-base> available as a custom HTML element.
 */
if (!customElements.get('chip-base')) {
  customElements.define('chip-base', ChipBaseElement);
}

/**
 * Default export for convenience.
 */
export default ChipBaseElement;
