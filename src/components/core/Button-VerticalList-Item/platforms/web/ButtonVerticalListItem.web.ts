/**
 * Button-VerticalList-Item Component for Web Platform (Vanilla Web Component)
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (VerticalList-Item)
 * Naming Convention: [Family]-[Type] = Button-VerticalList-Item
 * Custom Element Tag: <button-vertical-list-item>
 * 
 * A "dumb" presentational component that renders visual states based on props
 * received from a parent container. Handles no selection logic internally —
 * all state management is delegated to the parent pattern.
 * 
 * Uses Shadow DOM for style encapsulation and CSS logical properties for RTL support.
 * Follows the "fail loudly" philosophy — errors surface immediately during development
 * rather than silently degrading at runtime.
 * 
 * RENDERING ARCHITECTURE:
 * Uses incremental DOM updates rather than full re-renders to enable CSS transitions.
 * - _createDOM(): Called once on first render, creates the full DOM structure
 * - _updateDOM(): Called on attribute changes, updates only changed properties
 * This preserves DOM element identity, allowing CSS transitions to animate smoothly.
 * 
 * @module Button-VerticalList-Item/platforms/web
 * @see Requirements: 10.1, 11.1
 */

/// <reference lib="dom" />

import { VisualState, CheckmarkTransition } from '../../types';
import { IconBaseName, iconBaseSizes } from '../../../Icon-Base/types';
import { 
  getVisualStateStylesWithError, 
  VisualStateStyles,
  requiresEmphasisBorder 
} from './visualStateMapping';
import { 
  getVerticalListItemPaddingBlock, 
  VerticalListItemPaddingBlockVariant 
} from '../../Button-VerticalList-Item.tokens';

// Import Icon-Base to ensure it's registered before ButtonVerticalListItem uses it
import '../../../Icon-Base/platforms/web/IconBase.web';

// Import theme-aware blend utilities for state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// This follows the same pattern as Button-CTA for consistency across components
// @see scripts/esbuild-css-plugin.js
// @see src/types/css.d.ts
import componentStyles from './ButtonVerticalListItem.styles.css';

/**
 * Required CSS custom properties that must be present for the component to function.
 * The component will fail loudly if any of these are missing.
 * 
 * Updated for Spec 052 - Semantic Token Naming Implementation:
 * - color.select.* tokens migrated to color.feedback.select.* pattern
 */
const REQUIRED_CSS_VARIABLES = [
  // Color tokens
  '--color-background',
  '--color-text-default',
  '--color-text-muted',
  '--color-feedback-select-text-rest',
  '--color-feedback-select-background-rest',
  '--color-feedback-select-text-default',
  '--color-feedback-select-background-default',
  '--color-feedback-error-text',
  '--color-feedback-error-background',
  // Border tokens (semantic)
  '--border-default',
  '--border-emphasis',
  // Radius tokens
  '--radius-normal',  // radiusNormal = 8px
  // Spacing tokens
  '--space-inset-200',
  '--space-grouped-loose',
  // Accessibility tokens
  '--tap-area-recommended',  // 48px touch target
  '--accessibility-focus-width',
  '--accessibility-focus-offset',
  '--accessibility-focus-color',
  // Motion tokens (semantic) - required for animations
  '--motion-selection-transition-duration',
  '--motion-selection-transition-easing',
] as const;

/**
 * Validate that required CSS custom properties are available.
 * Throws descriptive error if any are missing.
 * 
 * @throws Error if required CSS variables are missing
 */
function validateRequiredTokens(): void {
  const computedStyle = getComputedStyle(document.documentElement);
  const missingTokens: string[] = [];
  
  for (const token of REQUIRED_CSS_VARIABLES) {
    const value = computedStyle.getPropertyValue(token).trim();
    if (!value) {
      missingTokens.push(token);
    }
  }
  
  if (missingTokens.length > 0) {
    throw new Error(
      `Button-VerticalList-Item: Missing required CSS variables: ${missingTokens.join(', ')}. ` +
      'Ensure Rosetta-generated tokens are loaded before using this component.'
    );
  }
}

/**
 * Get the padding-block value based on the visual state and error state.
 * 
 * Uses padding compensation to maintain constant 48px height:
 * - Rest state (1px border): 11px padding
 * - Selected state (2px border): 10px padding
 * 
 * When error=true in Select mode (rest, selected, notSelected), emphasis border
 * is applied, so padding must also be adjusted to maintain height stability.
 * 
 * @param visualState - Current visual state
 * @param error - Whether error state is active
 * @returns Padding value in pixels as string (e.g., "11px")
 */
function getPaddingBlockForState(visualState: VisualState, error: boolean = false): string {
  // Determine if emphasis border (2px) is needed:
  // 1. 'selected' state always uses emphasis border
  // 2. Error state in Select mode (rest, selected, notSelected) uses emphasis border
  const isSelectModeState = visualState === 'rest' || visualState === 'selected' || visualState === 'notSelected';
  const needsEmphasisBorder = requiresEmphasisBorder(visualState) || (error && isSelectModeState);
  
  const variant: VerticalListItemPaddingBlockVariant = 
    needsEmphasisBorder ? 'selected' : 'rest';
  const paddingValue = getVerticalListItemPaddingBlock(variant);
  return `${paddingValue}px`;
}

/**
 * Resolve a CSS variable reference to its computed hex color value.
 * 
 * Takes a CSS variable reference like 'var(--color-text-default)' and returns
 * the computed hex color value by reading from document.documentElement.
 * 
 * @param cssVarReference - CSS variable reference (e.g., 'var(--color-text-default)')
 * @returns Computed hex color value (e.g., '#FFFFFF') or the original value if not resolvable
 */
function resolveCssVariableToHex(cssVarReference: string): string {
  // Extract the variable name from var(--name) format
  const match = cssVarReference.match(/var\(([^)]+)\)/);
  if (!match) {
    // Not a CSS variable reference, return as-is
    return cssVarReference;
  }
  
  const varName = match[1].trim();
  const computedStyle = getComputedStyle(document.documentElement);
  const computedValue = computedStyle.getPropertyValue(varName).trim();
  
  // Return the computed value (should be a hex color)
  return computedValue || cssVarReference;
}


/**
 * ButtonVerticalListItem Web Component
 * 
 * A native web component that renders a semantic button element with token-based styling,
 * optional leading icon, and visual state-driven appearance.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic `<button>` element with proper accessibility
 * - Token-based styling via CSS custom properties
 * - CSS logical properties for RTL support
 * - Fail-loudly token validation
 * - Incremental DOM updates for smooth CSS transitions
 * - WCAG 2.1 AA compliant:
 *   - Keyboard navigation (Tab, Enter, Space)
 *   - Focus indicators with proper contrast
 *   - Screen reader support
 *   - NO disabled state support (unavailable options should be hidden)
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <button-vertical-list-item label="Option A" visual-state="rest"></button-vertical-list-item>
 * 
 * <!-- With all attributes -->
 * <button-vertical-list-item
 *   label="Settings"
 *   description="Configure your preferences"
 *   leading-icon="settings"
 *   visual-state="selected"
 *   error="false"
 *   checkmark-transition="fade"
 *   transition-delay="0"
 *   test-id="settings-option"
 * ></button-vertical-list-item>
 * ```
 * 
 * @see Requirements 10.1, 11.1
 */
export class ButtonVerticalListItem extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _tokensValidated: boolean = false;
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  private _button: HTMLButtonElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _descriptionEl: HTMLSpanElement | null = null;
  private _leadingIconContainer: HTMLSpanElement | null = null;
  private _leadingIconEl: HTMLElement | null = null;
  private _checkmarkContainer: HTMLSpanElement | null = null;
  private _checkmarkIconEl: HTMLElement | null = null;
  
  // Theme-aware blend utilities instance
  // Uses getBlendUtilities() factory for consistent state styling
  // @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend colors for state styling
  // These replace CSS filter: brightness() for mathematically correct state colors
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  
  // Event callbacks (set via properties, not attributes)
  private _onClick: (() => void) | undefined;
  private _onFocus: (() => void) | undefined;
  private _onBlur: (() => void) | undefined;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   * 
   * Note: 'disabled' is intentionally observed to throw an error if set.
   * This component explicitly does NOT support disabled states per accessibility
   * standards — unavailable options should be hidden, not disabled.
   * 
   * @see Requirements 10.2
   */
  static get observedAttributes(): string[] {
    return [
      'label',
      'description',
      'leading-icon',
      'visual-state',
      'error',
      'checkmark-transition',
      'transition-delay',
      'test-id',
      'role',           // ARIA role (button, radio, checkbox) - set by parent Set
      'aria-checked',   // ARIA checked state - set by parent Set
      'disabled' // Observed to throw error if set (fail loudly)
    ];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    // delegatesFocus: true enables proper tab navigation by automatically
    // delegating focus to the first focusable element in the shadow DOM
    // @see Requirements: 1.5 - delegatesFocus for tab navigation
    this._shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
    this._blendUtils = getBlendUtilities();
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs fail-loudly token validation and initial render.
   * Defers validation until document is ready to ensure CSS custom properties
   * are available from parsed stylesheets.
   * 
   * @throws Error if required CSS variables are missing
   */
  connectedCallback(): void {
    // Defer token validation until styles are loaded
    // This handles the case where custom elements are defined before CSS is parsed
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._validateAndRender();
      }, { once: true });
    } else {
      this._validateAndRender();
    }
  }
  
  /**
   * Validate tokens and render the component.
   * 
   * @throws Error if required CSS variables are missing
   */
  private _validateAndRender(): void {
    // Fail loudly if required tokens are missing
    // This follows the "fail loudly" philosophy to surface issues early during development
    if (!this._tokensValidated) {
      validateRequiredTokens();
      this._tokensValidated = true;
    }
    
    // Calculate blend colors for hover/pressed states
    // @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
    this._calculateBlendColorsWithRetry();
    
    this._render();
  }
  
  /**
   * Calculate blend colors with retry logic for CSS loading race conditions.
   * 
   * Uses requestAnimationFrame to ensure CSS is fully applied before reading
   * custom properties. Falls back to default colors if tokens are still unavailable.
   * 
   * @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
   */
  private _calculateBlendColorsWithRetry(): void {
    try {
      this._calculateBlendColors();
    } catch (error) {
      // CSS might not be fully applied yet, retry after next frame
      requestAnimationFrame(() => {
        try {
          this._calculateBlendColors();
          this._render(); // Re-render with correct colors
        } catch (retryError) {
          // Log warning but don't break the component
          console.warn('ButtonVerticalListItem: Could not calculate blend colors, using CSS fallbacks', retryError);
        }
      });
    }
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads base background color from CSS custom properties and applies theme-aware
   * blend utilities to generate state colors (hover, pressed).
   * 
   * Uses getBlendUtilities() factory functions instead of CSS filter: brightness()
   * for cross-platform consistency with iOS and Android implementations.
   * 
   * State color mappings:
   * - Hover: darkerBlend(color.background, blend.hoverDarker) - 8% darker
   * - Pressed: darkerBlend(color.background, blend.pressedDarker) - 12% darker
   * 
   * @see Requirements: 1.3, 1.4 - Blend utility adoption for hover/pressed states
   * @see Requirements: 1.5 - SHALL NOT use CSS filter: brightness()
   * @see Requirements: 1.6 - Apply via component-scoped CSS custom properties
   * @throws Error if required color tokens are missing from CSS custom properties
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get base background color from CSS custom properties
    // This is the color that hover/pressed states will be calculated from
    const backgroundColor = computedStyle.getPropertyValue('--color-background').trim();
    
    if (!backgroundColor) {
      throw new Error('Button-VerticalList-Item: Required token --color-background is missing from CSS custom properties');
    }
    
    // Calculate blend colors using theme-aware blend utilities
    // Uses semantic convenience functions from getBlendUtilities()
    // @see Requirements: 1.3 - Hover uses hoverColor() (8% darker)
    this._hoverColor = this._blendUtils.hoverColor(backgroundColor);
    
    // @see Requirements: 1.4 - Pressed uses pressedColor() (12% darker)
    this._pressedColor = this._blendUtils.pressedColor(backgroundColor);
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
   * Throws error if 'disabled' attribute is set (fail loudly philosophy).
   * 
   * @param name - Attribute name
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   * @throws Error if 'disabled' attribute is set
   * @see Requirements 10.2
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Fail loudly if disabled attribute is set
    // This component explicitly does NOT support disabled states per accessibility standards
    // Unavailable options should be hidden, not disabled
    // @see Requirements 10.2
    if (name === 'disabled') {
      throw new Error(
        'Button-VerticalList-Item: The "disabled" attribute is not supported. ' +
        'Per accessibility standards, unavailable options should be hidden rather than disabled. ' +
        'Remove the disabled attribute and hide the component instead.'
      );
    }
    
    // Only update if the element is connected to the DOM, value changed, and DOM exists
    if (oldValue !== newValue && this.isConnected && this._tokensValidated && this._domCreated) {
      this._updateDOM();
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Property Getters/Setters
  // ─────────────────────────────────────────────────────────────────
  
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
   * Get the description text.
   */
  get description(): string | undefined {
    const desc = this.getAttribute('description');
    return desc || undefined;
  }
  
  /**
   * Set the description text.
   */
  set description(value: string | undefined) {
    if (value) {
      this.setAttribute('description', value);
    } else {
      this.removeAttribute('description');
    }
  }
  
  /**
   * Get the leading icon name.
   */
  get leadingIcon(): IconBaseName | undefined {
    const icon = this.getAttribute('leading-icon');
    return icon as IconBaseName | undefined;
  }
  
  /**
   * Set the leading icon name.
   */
  set leadingIcon(value: IconBaseName | undefined) {
    if (value) {
      this.setAttribute('leading-icon', value);
    } else {
      this.removeAttribute('leading-icon');
    }
  }
  
  /**
   * Get the visual state.
   */
  get visualState(): VisualState {
    const state = this.getAttribute('visual-state');
    const validStates: VisualState[] = ['rest', 'selected', 'notSelected', 'checked', 'unchecked'];
    
    if (state && validStates.includes(state as VisualState)) {
      return state as VisualState;
    }
    
    // Default to 'rest' if not specified or invalid
    return 'rest';
  }
  
  /**
   * Set the visual state.
   */
  set visualState(value: VisualState) {
    this.setAttribute('visual-state', value);
  }
  
  /**
   * Get the error state.
   */
  get error(): boolean {
    return this.getAttribute('error') === 'true';
  }
  
  /**
   * Set the error state.
   */
  set error(value: boolean) {
    this.setAttribute('error', value.toString());
  }
  
  /**
   * Get the checkmark transition behavior.
   */
  get checkmarkTransition(): CheckmarkTransition {
    const transition = this.getAttribute('checkmark-transition');
    return (transition === 'instant') ? 'instant' : 'fade';
  }
  
  /**
   * Set the checkmark transition behavior.
   */
  set checkmarkTransition(value: CheckmarkTransition) {
    this.setAttribute('checkmark-transition', value);
  }
  
  /**
   * Get the transition delay in milliseconds.
   */
  get transitionDelay(): number {
    const delay = this.getAttribute('transition-delay');
    return delay ? parseInt(delay, 10) : 0;
  }
  
  /**
   * Set the transition delay in milliseconds.
   */
  set transitionDelay(value: number) {
    this.setAttribute('transition-delay', value.toString());
  }
  
  /**
   * Get the test ID.
   */
  get testID(): string | undefined {
    const testId = this.getAttribute('test-id');
    return testId || undefined;
  }
  
  /**
   * Set the test ID.
   */
  set testID(value: string | undefined) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  /**
   * Disabled property getter.
   * 
   * Always returns false because this component does not support disabled states.
   * Per accessibility standards, unavailable options should be hidden, not disabled.
   * 
   * @returns Always false
   * @see Requirements 10.2
   */
  get disabled(): boolean {
    return false;
  }
  
  /**
   * Disabled property setter.
   * 
   * Throws an error if called with true. This component explicitly does NOT support
   * disabled states per accessibility standards — unavailable options should be hidden,
   * not disabled.
   * 
   * @param value - The disabled value (must be false)
   * @throws Error if value is true
   * @see Requirements 10.2
   */
  set disabled(value: boolean) {
    if (value) {
      throw new Error(
        'Button-VerticalList-Item: The "disabled" property is not supported. ' +
        'Per accessibility standards, unavailable options should be hidden rather than disabled. ' +
        'Set disabled to false or hide the component instead.'
      );
    }
    // If value is false, do nothing (component is already not disabled)
  }
  
  // ─────────────────────────────────────────────────────────────────
  // ARIA Properties (controlled by parent Set)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Get the ARIA role for the item.
   * 
   * The role is controlled by the parent Set component based on mode:
   * - Tap mode: 'button'
   * - Select mode: 'radio'
   * - MultiSelect mode: 'checkbox'
   * 
   * @returns The ARIA role ('button', 'radio', or 'checkbox')
   * @see Requirements 3.4, 4.7, 5.5
   */
  get itemRole(): 'button' | 'radio' | 'checkbox' {
    const role = this.getAttribute('role');
    if (role === 'radio' || role === 'checkbox') {
      return role;
    }
    return 'button';
  }
  
  /**
   * Set the ARIA role for the item.
   * 
   * @param value - The ARIA role ('button', 'radio', or 'checkbox')
   * @see Requirements 3.4, 4.7, 5.5
   */
  set itemRole(value: 'button' | 'radio' | 'checkbox') {
    this.setAttribute('role', value);
  }
  
  /**
   * Get the ARIA checked state.
   * 
   * Used in Select mode (radio) and MultiSelect mode (checkbox) to indicate
   * whether the item is selected/checked.
   * 
   * Note: Named 'itemAriaChecked' to avoid conflict with HTMLElement.ariaChecked
   * which has a different type signature (string | null).
   * 
   * @returns true if checked, false if not checked, undefined if not applicable
   * @see Requirements 4.7, 5.5
   */
  get itemAriaChecked(): boolean | undefined {
    const checked = this.getAttribute('aria-checked');
    if (checked === 'true') return true;
    if (checked === 'false') return false;
    return undefined;
  }
  
  /**
   * Set the ARIA checked state.
   * 
   * Note: Named 'itemAriaChecked' to avoid conflict with HTMLElement.ariaChecked
   * which has a different type signature (string | null).
   * 
   * @param value - true if checked, false if not checked, undefined to remove
   * @see Requirements 4.7, 5.5
   */
  set itemAriaChecked(value: boolean | undefined) {
    if (value === undefined) {
      this.removeAttribute('aria-checked');
    } else {
      this.setAttribute('aria-checked', value.toString());
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Event Callback Properties
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Set the onClick callback.
   */
  set onClick(callback: (() => void) | undefined) {
    this._onClick = callback;
  }
  
  /**
   * Get the onClick callback.
   */
  get onClick(): (() => void) | undefined {
    return this._onClick;
  }
  
  /**
   * Set the onFocus callback.
   */
  set onFocus(callback: (() => void) | undefined) {
    this._onFocus = callback;
  }
  
  /**
   * Get the onFocus callback.
   */
  get onFocus(): (() => void) | undefined {
    return this._onFocus;
  }
  
  /**
   * Set the onBlur callback.
   */
  set onBlur(callback: (() => void) | undefined) {
    this._onBlur = callback;
  }
  
  /**
   * Get the onBlur callback.
   */
  get onBlur(): (() => void) | undefined {
    return this._onBlur;
  }

  
  // ─────────────────────────────────────────────────────────────────
  // Rendering (Incremental Update Architecture)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Main render entry point.
   * 
   * Routes to _createDOM() for first render or _updateDOM() for subsequent updates.
   * This architecture enables CSS transitions by preserving DOM element identity.
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
   * Creates all elements including containers that may be hidden.
   * This ensures DOM elements exist for CSS transitions to work.
   * 
   * @see Requirements 10.1, 11.1
   */
  private _createDOM(): void {
    const iconSize = iconBaseSizes.size100;
    
    // Create the shadow DOM structure with all containers
    // Leading icon container is always present (visibility controlled via CSS)
    // Checkmark container is always present (visibility controlled via CSS)
    this._shadowRoot.innerHTML = `
      <style>${componentStyles}</style>
      <button
        class="vertical-list-item"
        type="button"
        role="button"
      >
        <span class="vertical-list-item__leading-icon">
          <icon-base size="${iconSize}" optical-balance="true"></icon-base>
        </span>
        <div class="vertical-list-item__content">
          <span class="vertical-list-item__label"></span>
          <span class="vertical-list-item__description"></span>
        </div>
        <span class="vertical-list-item__checkmark" aria-hidden="true">
          <icon-base name="check" size="${iconSize}" optical-balance="true"></icon-base>
        </span>
      </button>
    `;
    
    // Cache element references for incremental updates
    this._button = this._shadowRoot.querySelector('button');
    this._labelEl = this._shadowRoot.querySelector('.vertical-list-item__label');
    this._descriptionEl = this._shadowRoot.querySelector('.vertical-list-item__description');
    this._leadingIconContainer = this._shadowRoot.querySelector('.vertical-list-item__leading-icon');
    this._leadingIconEl = this._leadingIconContainer?.querySelector('icon-base') || null;
    this._checkmarkContainer = this._shadowRoot.querySelector('.vertical-list-item__checkmark');
    this._checkmarkIconEl = this._checkmarkContainer?.querySelector('icon-base') || null;
    
    // Apply initial state
    this._updateDOM();
  }
  
  /**
   * Update existing DOM elements (called on attribute changes).
   * 
   * Only updates properties that need to change, preserving DOM element identity.
   * This enables CSS transitions to animate smoothly between states.
   * 
   * @see Requirements 10.1, 11.1
   */
  private _updateDOM(): void {
    if (!this._button) return;
    
    const label = this.label;
    const description = this.description;
    const leadingIcon = this.leadingIcon;
    const visualState = this.visualState;
    const error = this.error;
    const checkmarkTransition = this.checkmarkTransition;
    const transitionDelay = this.transitionDelay;
    const testID = this.testID;
    
    // Get visual state styles with error overlay if applicable
    const styles: VisualStateStyles = getVisualStateStylesWithError(visualState, error);
    
    // Get padding-block value based on visual state and error state (padding compensation)
    const paddingBlock = getPaddingBlockForState(visualState, error);
    
    // Get ARIA attributes (controlled by parent Set)
    const itemRole = this.itemRole;
    const itemAriaChecked = this.itemAriaChecked;
    
    // ─────────────────────────────────────────────────────────────────
    // Update button element
    // ─────────────────────────────────────────────────────────────────
    
    // Update CSS class (for semantic markers and potential state-specific overrides)
    this._button.className = `vertical-list-item ${styles.cssClass}`;
    
    // Update aria-label
    this._button.setAttribute('aria-label', label);
    
    // Update ARIA role (controlled by parent Set based on mode)
    // @see Requirements 3.4, 4.7, 5.5
    this._button.setAttribute('role', itemRole);
    
    // Update aria-checked (for radio and checkbox roles)
    // @see Requirements 4.7, 5.5
    if (itemRole === 'radio' || itemRole === 'checkbox') {
      this._button.setAttribute('aria-checked', itemAriaChecked === true ? 'true' : 'false');
    } else {
      // Button role doesn't use aria-checked
      this._button.removeAttribute('aria-checked');
    }
    
    // Update test ID
    if (testID) {
      this._button.setAttribute('data-testid', testID);
    } else {
      this._button.removeAttribute('data-testid');
    }
    
    // Update CSS custom properties (these drive the visual styling and transitions)
    this._button.style.setProperty('--_vlbi-background', styles.background);
    this._button.style.setProperty('--_vlbi-border-width', styles.borderWidth);
    this._button.style.setProperty('--_vlbi-border-color', styles.borderColor);
    this._button.style.setProperty('--_vlbi-padding-block', paddingBlock);
    this._button.style.setProperty('--_vlbi-label-color', styles.labelColor);
    this._button.style.setProperty('--_vlbi-icon-color', styles.iconColor);
    
    // Update blend color CSS custom properties for hover/pressed states
    // These replace CSS filter: brightness() for mathematically correct state colors
    // @see Requirements: 1.3, 1.4, 1.5, 1.6 - Blend utility adoption
    this._button.style.setProperty('--_vlbi-hover-bg', this._hoverColor);
    this._button.style.setProperty('--_vlbi-pressed-bg', this._pressedColor);
    
    // Update transition delay
    if (transitionDelay > 0) {
      this._button.style.transitionDelay = `${transitionDelay}ms`;
    } else {
      this._button.style.transitionDelay = '';
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Update label
    // ─────────────────────────────────────────────────────────────────
    
    if (this._labelEl) {
      this._labelEl.textContent = label;
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Update description (show/hide via display)
    // ─────────────────────────────────────────────────────────────────
    
    if (this._descriptionEl) {
      if (description) {
        this._descriptionEl.textContent = description;
        this._descriptionEl.style.display = '';
      } else {
        this._descriptionEl.textContent = '';
        this._descriptionEl.style.display = 'none';
      }
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Update leading icon (show/hide via display, update icon name and color)
    // ─────────────────────────────────────────────────────────────────
    
    if (this._leadingIconContainer && this._leadingIconEl) {
      if (leadingIcon) {
        const iconColorHex = resolveCssVariableToHex(styles.iconColor);
        this._leadingIconEl.setAttribute('name', leadingIcon);
        this._leadingIconEl.setAttribute('color', iconColorHex);
        this._leadingIconContainer.style.display = '';
      } else {
        this._leadingIconContainer.style.display = 'none';
      }
    }
    
    // ─────────────────────────────────────────────────────────────────
    // Update checkmark (visibility via CSS classes, color update)
    // ─────────────────────────────────────────────────────────────────
    
    if (this._checkmarkContainer && this._checkmarkIconEl) {
      // Update checkmark color
      const checkmarkColorHex = resolveCssVariableToHex(styles.iconColor);
      this._checkmarkIconEl.setAttribute('color', checkmarkColorHex);
      
      // Update transition mode class
      const transitionClass = checkmarkTransition === 'instant' 
        ? 'vertical-list-item__checkmark--instant' 
        : 'vertical-list-item__checkmark--fade';
      
      // Update visibility class
      const visibilityClass = styles.checkmarkVisible 
        ? 'vertical-list-item__checkmark--visible' 
        : 'vertical-list-item__checkmark--hidden';
      
      // Set all classes at once
      this._checkmarkContainer.className = `vertical-list-item__checkmark ${transitionClass} ${visibilityClass}`;
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Event Handling
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Attach event listeners to the button.
   */
  private _attachEventListeners(): void {
    if (this._button) {
      this._button.addEventListener('click', this._handleClick);
      this._button.addEventListener('focus', this._handleFocus);
      this._button.addEventListener('blur', this._handleBlur);
      this._button.addEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Detach event listeners from the button.
   */
  private _detachEventListeners(): void {
    if (this._button) {
      this._button.removeEventListener('click', this._handleClick);
      this._button.removeEventListener('focus', this._handleFocus);
      this._button.removeEventListener('blur', this._handleBlur);
      this._button.removeEventListener('keydown', this._handleKeyDown);
    }
  }
  
  /**
   * Handle button click events.
   * 
   * Note: We do NOT dispatch a custom 'click' event here because the native
   * click event from the internal <button> element already bubbles through
   * the shadow DOM boundary to external listeners. Dispatching a custom event
   * would cause duplicate click events to reach external listeners.
   * 
   * @see Requirements 1.6, 1.7 - Single click event per user interaction
   */
  private _handleClick = (): void => {
    if (this._onClick) {
      this._onClick();
    }
    // Native click event from the internal button already bubbles through
    // the shadow DOM boundary - no need to dispatch a custom event
  };
  
  /**
   * Handle button focus events.
   */
  private _handleFocus = (): void => {
    if (this._onFocus) {
      this._onFocus();
    }
    
    // Dispatch custom 'focus' event for external listeners
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle button blur events.
   */
  private _handleBlur = (): void => {
    if (this._onBlur) {
      this._onBlur();
    }
    
    // Dispatch custom 'blur' event for external listeners
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true
    }));
  };
  
  /**
   * Handle keyboard events for accessibility.
   * 
   * Ensures Enter and Space keys activate the button (WCAG 2.1 AA requirement).
   * 
   * @param event - The keyboard event
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    // Handle Enter and Space keys (WCAG 2.1 AA keyboard navigation)
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default space scrolling
      this._handleClick();
    }
  };
}

/**
 * Register the custom element.
 * 
 * Makes <button-vertical-list-item> available as a custom HTML element.
 */
if (!customElements.get('button-vertical-list-item')) {
  customElements.define('button-vertical-list-item', ButtonVerticalListItem);
}

/**
 * Default export for convenience.
 */
export default ButtonVerticalListItem;
