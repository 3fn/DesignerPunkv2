/**
 * Chip-Input Component for Web Platform (Vanilla Web Component)
 * 
 * Semantic variant of Chip-Base that adds dismiss behavior.
 * Used for managing user-entered values like tags or selections.
 * 
 * Stemma System Naming: [Family]-[Type] = Chip-Input
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Key Characteristics:
 * - Always displays X icon as trailing element
 * - Supports both leading icon AND trailing X icon
 * - Tap anywhere dismisses (calls onDismiss)
 * - No selected state (dismiss-only behavior)
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Chip-Input/platforms/web
 * @see Requirements: 5.1-5.6, 7.5 in .kiro/specs/045-chip-base/requirements.md
 */

/// <reference lib="dom" />

import { ChipInputProps } from '../../types';
import { IconName, CHIP_BASE_OBSERVED_ATTRIBUTES } from '../../../Chip-Base/types';
// Import Icon-Base to ensure it's registered before ChipInput uses it
import '../../../Icon-Base/platforms/web/IconBase.web';
import { iconBaseSizes } from '../../../Icon-Base/types';
// Import theme-aware blend utilities for state color calculations
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
import chipBaseStyles from '../../../Chip-Base/platforms/web/ChipBase.styles.css';
import chipInputStyles from './ChipInput.styles.css';

/**
 * Observed attributes for the Chip-Input web component.
 * 
 * Same as Chip-Base (no additional attributes needed).
 * Note: No 'selected' attribute as Chip-Input doesn't have selected state.
 */
export const CHIP_INPUT_OBSERVED_ATTRIBUTES = CHIP_BASE_OBSERVED_ATTRIBUTES;

/**
 * Type for observed attribute names.
 */
export type ChipInputObservedAttribute = typeof CHIP_INPUT_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Chip-Input.
 * 
 * Extends HTMLElement with Chip-Input specific properties and methods.
 */
export interface IChipInputElement extends HTMLElement {
  label: string;
  icon: IconName | null;
  testID: string | null;
  onDismiss: (() => void) | null;
}


/**
 * ChipInputElement Web Component
 * 
 * A native web component that renders a dismissible chip element with
 * a trailing X icon. Tap anywhere on the chip to dismiss.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic button role with proper accessibility
 * - Token-based styling via CSS custom properties
 * - Always shows X icon as trailing element
 * - Supports both leading icon AND trailing X icon
 * - X icon has accessible label "Remove [label]"
 * - WCAG 2.1 AA compliant
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <chip-input label="Tag"></chip-input>
 * 
 * <!-- With leading icon -->
 * <chip-input label="Category" icon="tag"></chip-input>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const chip = document.createElement('chip-input') as ChipInputElement;
 * chip.label = 'Tag';
 * chip.onDismiss = () => console.log('Chip dismissed');
 * document.body.appendChild(chip);
 * ```
 * 
 * @see Requirements: 5.1-5.6, 7.5
 */
export class ChipInputElement extends HTMLElement implements IChipInputElement {
  private _shadowRoot: ShadowRoot;
  
  // Incremental DOM update tracking
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  private _chipEl: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _leadingIconContainer: HTMLSpanElement | null = null;
  private _leadingIconEl: HTMLElement | null = null;
  private _trailingIconContainer: HTMLSpanElement | null = null;
  private _dismissLabelEl: HTMLSpanElement | null = null;
  
  // Theme-aware blend utilities instance
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  
  // Event callback
  private _onDismiss: (() => void) | null = null;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): readonly string[] {
    return CHIP_INPUT_OBSERVED_ATTRIBUTES;
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
          console.warn('ChipInput: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   */
  private _calculateBlendColors(): void {
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get surface color for state calculations
    const surfaceColor = computedStyle.getPropertyValue('--color-structure-surface').trim();
    
    if (!surfaceColor) {
      throw new Error('ChipInput: Required token --color-structure-surface is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    this._hoverColor = this._blendUtils.hoverColor(surfaceColor);
    this._pressedColor = this._blendUtils.pressedColor(surfaceColor);
  }
  
  /**
   * Called when the element is removed from the DOM.
   */
  disconnectedCallback(): void {
    this._detachEventListeners();
  }
  
  /**
   * Called when an observed attribute changes.
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
   * Get the icon name (leading icon).
   */
  get icon(): IconName | null {
    return this.getAttribute('icon');
  }
  
  /**
   * Set the icon name (leading icon).
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
   * Get the dismiss callback.
   * 
   * @see Requirement 5.4 - onDismiss callback
   */
  get onDismiss(): (() => void) | null {
    return this._onDismiss;
  }
  
  /**
   * Set the dismiss callback.
   */
  set onDismiss(value: (() => void) | null) {
    this._onDismiss = value;
  }
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  /**
   * Main render entry point.
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
   * Create the initial DOM structure.
   * 
   * Chip-Input always shows:
   * - Optional leading icon (if icon prop provided)
   * - Label text
   * - Trailing X icon (always visible)
   * 
   * @see Requirements: 5.2, 5.3 - X icon as trailing element, both icons supported
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
    
    // Accessible label for X icon: "Remove [label]"
    // @see Requirement 7.5 - X icon accessible label
    const dismissLabel = `Remove ${label}`;
    
    // Create the shadow DOM structure
    // Note: Chip-Input supports BOTH leading icon AND trailing X icon
    // @see Requirement 5.3 - Support both leading icon AND trailing X icon
    this._shadowRoot.innerHTML = `
      <style>${chipBaseStyles}${chipInputStyles}</style>
      <div 
        class="chip-base chip-input"
        role="button"
        tabindex="0"
        ${testIDAttr}
        aria-label="${dismissLabel}"
        style="${blendColorStyles}"
      >
        <span class="chip-base__icon" aria-hidden="true" style="${icon ? '' : 'display: none;'}">
          <icon-base name="${icon || ''}" size="${iconSize}" color="inherit"></icon-base>
        </span>
        <span class="chip-base__label">${label}</span>
        <span class="chip-input__trailing-icon" aria-hidden="true">
          <icon-base name="x" size="${iconSize}" color="inherit"></icon-base>
        </span>
        <span class="chip-input__dismiss-label">${dismissLabel}</span>
      </div>
    `;
    
    // Cache element references for incremental updates
    this._chipEl = this._shadowRoot.querySelector('.chip-input');
    this._labelEl = this._shadowRoot.querySelector('.chip-base__label');
    this._leadingIconContainer = this._shadowRoot.querySelector('.chip-base__icon');
    this._leadingIconEl = this._leadingIconContainer?.querySelector('icon-base') || null;
    this._trailingIconContainer = this._shadowRoot.querySelector('.chip-input__trailing-icon');
    this._dismissLabelEl = this._shadowRoot.querySelector('.chip-input__dismiss-label');
  }
  
  /**
   * Update existing DOM elements.
   * 
   * @see Requirements: 5.2, 5.3, 7.5 - Update icons and accessible label
   */
  private _updateDOM(): void {
    if (!this._chipEl || !this._labelEl) return;
    
    const label = this.label;
    const icon = this.icon;
    const testID = this.testID;
    
    // Icon size for chips: icon.size075 (20px)
    const iconSize = iconBaseSizes.size075;
    
    // Accessible label for X icon: "Remove [label]"
    const dismissLabel = `Remove ${label}`;
    
    // Update aria-label
    this._chipEl.setAttribute('aria-label', dismissLabel);
    
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
    
    // Update leading icon
    if (this._leadingIconContainer && this._leadingIconEl) {
      if (icon) {
        this._leadingIconContainer.style.display = '';
        this._leadingIconEl.setAttribute('name', icon);
        this._leadingIconEl.setAttribute('size', String(iconSize));
      } else {
        this._leadingIconContainer.style.display = 'none';
      }
    }
    
    // Update accessible dismiss label
    if (this._dismissLabelEl) {
      this._dismissLabelEl.textContent = dismissLabel;
    }
    
    // Note: Trailing X icon is always visible, no update needed
  }
  
  // ============================================================================
  // Event Handling
  // ============================================================================
  
  /**
   * Attach event listeners to the chip.
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
   * Calls onDismiss callback when chip is pressed anywhere.
   * 
   * @see Requirement 5.4 - Tap anywhere calls onDismiss
   */
  private _handleClick = (_event: Event): void => {
    // Call onDismiss callback
    if (this._onDismiss) {
      this._onDismiss();
    }
    
    // Dispatch custom 'dismiss' event
    this.dispatchEvent(new CustomEvent('dismiss', {
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle keyboard events for accessibility.
   * 
   * Ensures Enter and Space keys dismiss the chip.
   * 
   * @see Requirement 7.5 - Keyboard activation
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default space scrolling
      this._handleClick(event);
    }
  };
}

/**
 * Register the custom element.
 */
if (!customElements.get('chip-input')) {
  customElements.define('chip-input', ChipInputElement);
}

/**
 * Default export for convenience.
 */
export default ChipInputElement;
