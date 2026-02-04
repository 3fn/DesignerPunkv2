/**
 * Chip-Filter Component for Web Platform (Vanilla Web Component)
 * 
 * Semantic variant of Chip-Base that adds toggle/selection behavior.
 * Used for filtering content by multiple criteria.
 * 
 * Stemma System Naming: [Family]-[Type] = Chip-Filter
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Key Characteristics:
 * - Toggleable: Selected state changes on press
 * - Visual feedback: Checkmark icon when selected (replaces leading icon)
 * - Inherits: All Chip-Base visual styling and behavior
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Chip-Filter/platforms/web
 * @see Requirements: 4.1-4.6, 7.4 in .kiro/specs/045-chip-base/requirements.md
 */

/// <reference lib="dom" />

import { ChipFilterProps } from '../../types';
import { IconName, CHIP_BASE_OBSERVED_ATTRIBUTES } from '../../../Chip-Base/types';
// Import Icon-Base to ensure it's registered before ChipFilter uses it
import '../../../Icon-Base/platforms/web/IconBase.web';
import { iconBaseSizes } from '../../../Icon-Base/types';
// Import theme-aware blend utilities for state color calculations
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
import chipBaseStyles from '../../../Chip-Base/platforms/web/ChipBase.styles.css';
import chipFilterStyles from './ChipFilter.styles.css';

/**
 * Observed attributes for the Chip-Filter web component.
 * 
 * Extends Chip-Base attributes with 'selected' for toggle state.
 */
export const CHIP_FILTER_OBSERVED_ATTRIBUTES = [...CHIP_BASE_OBSERVED_ATTRIBUTES, 'selected'] as const;

/**
 * Type for observed attribute names.
 */
export type ChipFilterObservedAttribute = typeof CHIP_FILTER_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Chip-Filter.
 * 
 * Extends HTMLElement with Chip-Filter specific properties and methods.
 */
export interface IChipFilterElement extends HTMLElement {
  label: string;
  icon: IconName | null;
  testID: string | null;
  selected: boolean;
  onPress: (() => void) | null;
  onSelectionChange: ((selected: boolean) => void) | null;
}

/**
 * ChipFilterElement Web Component
 * 
 * A native web component that renders a toggleable chip element with
 * selected state styling and checkmark icon when selected.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic button role with aria-pressed for toggle state
 * - Token-based styling via CSS custom properties
 * - Selected state uses color.feedback.select.* tokens
 * - Checkmark icon replaces leading icon when selected
 * - WCAG 2.1 AA compliant
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <chip-filter label="Category"></chip-filter>
 * 
 * <!-- Selected state -->
 * <chip-filter label="Active" selected></chip-filter>
 * 
 * <!-- With icon (replaced by checkmark when selected) -->
 * <chip-filter label="Filter" icon="settings" selected></chip-filter>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const chip = document.createElement('chip-filter') as ChipFilterElement;
 * chip.label = 'Category';
 * chip.selected = false;
 * chip.onSelectionChange = (selected) => console.log('Selected:', selected);
 * document.body.appendChild(chip);
 * ```
 * 
 * @see Requirements: 4.1-4.6, 7.4
 */
export class ChipFilterElement extends HTMLElement implements IChipFilterElement {
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
  
  // Event callbacks
  private _onPress: (() => void) | null = null;
  private _onSelectionChange: ((selected: boolean) => void) | null = null;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): readonly string[] {
    return CHIP_FILTER_OBSERVED_ATTRIBUTES;
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
          console.warn('ChipFilter: Could not calculate blend colors, using CSS fallbacks', retryError);
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
      throw new Error('ChipFilter: Required token --color-structure-surface is missing from CSS custom properties');
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
   * Get the selected state.
   * 
   * @see Requirement 4.1 - selected boolean prop
   */
  get selected(): boolean {
    return this.hasAttribute('selected');
  }
  
  /**
   * Set the selected state.
   * 
   * @see Requirement 4.2 - selected state styling
   */
  set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
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
  
  /**
   * Get the selection change callback.
   * 
   * @see Requirement 4.5 - onSelectionChange callback
   */
  get onSelectionChange(): ((selected: boolean) => void) | null {
    return this._onSelectionChange;
  }
  
  /**
   * Set the selection change callback.
   */
  set onSelectionChange(value: ((selected: boolean) => void) | null) {
    this._onSelectionChange = value;
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
   * When selected, displays checkmark icon instead of leading icon.
   * 
   * @see Requirements: 4.2, 4.3, 4.4 - Selected state styling and checkmark
   */
  private _createDOM(): void {
    const label = this.label;
    const icon = this.icon;
    const testID = this.testID;
    const selected = this.selected;
    
    // Icon size for chips: icon.size075 (20px)
    const iconSize = iconBaseSizes.size075;
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate blend color CSS custom properties
    const blendColorStyles = `
      --_chip-hover-bg: ${this._hoverColor};
      --_chip-pressed-bg: ${this._pressedColor};
    `;
    
    // Determine which icon to show:
    // - When selected: always show checkmark (replaces leading icon)
    // - When not selected: show leading icon if provided
    // @see Requirement 4.3, 4.4 - Checkmark when selected, replaces leading icon
    const displayIcon = selected ? 'check' : icon;
    const showIcon = selected || icon;
    
    // CSS class for selected state
    const selectedClass = selected ? ' chip-filter--selected' : '';
    
    // Create the shadow DOM structure
    this._shadowRoot.innerHTML = `
      <style>${chipBaseStyles}${chipFilterStyles}</style>
      <div 
        class="chip-base chip-filter${selectedClass}"
        role="button"
        tabindex="0"
        ${testIDAttr}
        aria-label="${label}"
        aria-pressed="${selected}"
        style="${blendColorStyles}"
      >
        <span class="chip-base__icon" aria-hidden="true" style="${showIcon ? '' : 'display: none;'}">
          <icon-base name="${displayIcon || ''}" size="${iconSize}" color="inherit"></icon-base>
        </span>
        <span class="chip-base__label">${label}</span>
      </div>
    `;
    
    // Cache element references for incremental updates
    this._chipEl = this._shadowRoot.querySelector('.chip-filter');
    this._labelEl = this._shadowRoot.querySelector('.chip-base__label');
    this._iconContainer = this._shadowRoot.querySelector('.chip-base__icon');
    this._iconEl = this._iconContainer?.querySelector('icon-base') || null;
  }
  
  /**
   * Update existing DOM elements.
   * 
   * @see Requirements: 4.2, 4.3, 4.4 - Selected state updates
   */
  private _updateDOM(): void {
    if (!this._chipEl || !this._labelEl) return;
    
    const label = this.label;
    const icon = this.icon;
    const testID = this.testID;
    const selected = this.selected;
    
    // Icon size for chips: icon.size075 (20px)
    const iconSize = iconBaseSizes.size075;
    
    // Update aria-label
    this._chipEl.setAttribute('aria-label', label);
    
    // Update aria-pressed for accessibility
    // @see Requirement 7.4 - aria-pressed attribute
    this._chipEl.setAttribute('aria-pressed', String(selected));
    
    // Update test ID
    if (testID) {
      this._chipEl.setAttribute('data-testid', testID);
    } else {
      this._chipEl.removeAttribute('data-testid');
    }
    
    // Update blend color CSS custom properties
    this._chipEl.style.setProperty('--_chip-hover-bg', this._hoverColor);
    this._chipEl.style.setProperty('--_chip-pressed-bg', this._pressedColor);
    
    // Update selected class
    if (selected) {
      this._chipEl.classList.add('chip-filter--selected');
    } else {
      this._chipEl.classList.remove('chip-filter--selected');
    }
    
    // Update label text
    this._labelEl.textContent = label;
    
    // Update icon
    // When selected: show checkmark (replaces leading icon)
    // When not selected: show leading icon if provided
    const displayIcon = selected ? 'check' : icon;
    const showIcon = selected || icon;
    
    if (this._iconContainer && this._iconEl) {
      if (showIcon) {
        this._iconContainer.style.display = '';
        this._iconEl.setAttribute('name', displayIcon || '');
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
   * Toggles selected state and calls callbacks.
   * 
   * @see Requirement 4.5 - Toggle selected state on press
   */
  private _handleClick = (_event: Event): void => {
    // Toggle selected state
    const newSelected = !this.selected;
    this.selected = newSelected;
    
    // Call onSelectionChange callback
    if (this._onSelectionChange) {
      this._onSelectionChange(newSelected);
    }
    
    // Call onPress callback (inherited from Chip-Base behavior)
    if (this._onPress) {
      this._onPress();
    }
    
    // Dispatch custom 'selectionchange' event
    this.dispatchEvent(new CustomEvent('selectionchange', {
      bubbles: true,
      composed: true,
      detail: { selected: newSelected }
    }));
    
    // Dispatch custom 'press' event for compatibility
    this.dispatchEvent(new CustomEvent('press', {
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle keyboard events for accessibility.
   * 
   * @see Requirement 7.4 - Keyboard activation
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
if (!customElements.get('chip-filter')) {
  customElements.define('chip-filter', ChipFilterElement);
}

/**
 * Default export for convenience.
 */
export default ChipFilterElement;
