/**
 * Button-VerticalListItem Component for Web Platform (Vanilla Web Component)
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (VerticalListItem)
 * Naming Convention: [Family]-[Type] = Button-VerticalListItem
 * 
 * A "dumb" presentational component that renders visual states based on props
 * received from a parent container. Handles no selection logic internally —
 * all state management is delegated to the parent pattern.
 * 
 * Uses Shadow DOM for style encapsulation and CSS logical properties for RTL support.
 * Follows the "fail loudly" philosophy — errors surface immediately during development
 * rather than silently degrading at runtime.
 * 
 * @module Button-VerticalListItem/platforms/web
 * @see Requirements: 10.1, 11.1
 */

/// <reference lib="dom" />

import { VisualState, CheckmarkTransition, VerticalListButtonItemProps } from '../../types';
import { IconBaseName, iconBaseSizes } from '../../../Icon-Base/types';
import { 
  getVisualStateStylesWithError, 
  VisualStateStyles,
  requiresEmphasisBorder 
} from './visualStateMapping';
import { 
  getVerticalListItemPaddingBlock, 
  VerticalListItemPaddingBlockVariant 
} from '../../buttonVerticalListItem.tokens';

// Import Icon-Base to ensure it's registered before ButtonVerticalListItem uses it
import '../../../Icon-Base/platforms/web/IconBase.web';

/**
 * Required CSS custom properties that must be present for the component to function.
 * The component will fail loudly if any of these are missing.
 */
const REQUIRED_CSS_VARIABLES = [
  '--color-background',
  '--color-text-default',
  '--color-text-muted',
  '--color-select-selected-strong',
  '--color-select-selected-subtle',
  '--color-select-not-selected-strong',
  '--color-select-not-selected-subtle',
  '--color-error-strong',
  '--color-error-subtle',
  '--border-border-default',
  '--border-border-emphasis',
  '--radius-normal',
  '--space-inset-200',
  '--space-grouped-loose',
  '--accessibility-tap-area-recommended',
  '--accessibility-focus-width',
  '--accessibility-focus-offset',
  '--accessibility-focus-color',
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
      `Button-VerticalListItem: Missing required CSS variables: ${missingTokens.join(', ')}. ` +
      'Ensure Rosetta-generated tokens are loaded before using this component.'
    );
  }
}

/**
 * Get the padding-block value based on the visual state.
 * 
 * Uses padding compensation to maintain constant 48px height:
 * - Rest state (1px border): 11px padding
 * - Selected state (2px border): 10px padding
 * 
 * @param visualState - Current visual state
 * @returns Padding value in pixels as string (e.g., "11px")
 */
function getPaddingBlockForState(visualState: VisualState): string {
  const variant: VerticalListItemPaddingBlockVariant = 
    requiresEmphasisBorder(visualState) ? 'selected' : 'rest';
  const paddingValue = getVerticalListItemPaddingBlock(variant);
  return `${paddingValue}px`;
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
 * - WCAG 2.1 AA compliant:
 *   - Keyboard navigation (Tab, Enter, Space)
 *   - Focus indicators with proper contrast
 *   - Screen reader support
 *   - NO disabled state support (unavailable options should be hidden)
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <vertical-list-button-item label="Option A" visual-state="rest"></vertical-list-button-item>
 * 
 * <!-- With all attributes -->
 * <vertical-list-button-item
 *   label="Settings"
 *   description="Configure your preferences"
 *   leading-icon="settings"
 *   visual-state="selected"
 *   error="false"
 *   checkmark-transition="fade"
 *   transition-delay="0"
 *   test-id="settings-option"
 * ></vertical-list-button-item>
 * ```
 * 
 * @see Requirements 10.1, 11.1
 */
export class ButtonVerticalListItem extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _button: HTMLButtonElement | null = null;
  private _tokensValidated: boolean = false;
  
  // Event callbacks (set via properties, not attributes)
  private _onClick: (() => void) | undefined;
  private _onFocus: (() => void) | undefined;
  private _onBlur: (() => void) | undefined;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
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
      'test-id'
    ];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
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
   * 
   * @param _name - Attribute name (unused, prefixed with underscore)
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    // Only re-render if the element is connected to the DOM and value changed
    if (oldValue !== newValue && this.isConnected && this._tokensValidated) {
      this.render();
      // Re-attach event listeners after re-render
      this._attachEventListeners();
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
  // Rendering
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Render the component.
   * 
   * Generates the button HTML with appropriate classes, icons, and content.
   * Uses CSS logical properties (padding-block, padding-inline) for RTL support.
   * 
   * @see Requirements 10.1, 11.1
   */
  private render(): void {
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
    
    // Get padding-block value based on visual state (padding compensation)
    const paddingBlock = getPaddingBlockForState(visualState);
    
    // Icon size for leading icon and checkmark (24px = iconBaseSizes.size100)
    const iconSize = iconBaseSizes.size100;
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate transition delay style
    const transitionDelayStyle = transitionDelay > 0 ? `transition-delay: ${transitionDelay}ms;` : '';
    
    // Generate checkmark transition class
    const checkmarkTransitionClass = checkmarkTransition === 'instant' 
      ? 'vertical-list-item__checkmark--instant' 
      : 'vertical-list-item__checkmark--fade';
    
    // Inline CSS for Shadow DOM styling
    // Uses CSS logical properties for RTL support
    const componentStyles = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .vertical-list-item {
          /* Layout */
          display: flex;
          align-items: center;
          gap: var(--space-grouped-loose);
          width: 100%;
          min-height: var(--accessibility-tap-area-recommended);
          
          /* Spacing - uses logical properties for RTL */
          padding-block: var(--vlbi-padding-block);
          padding-inline: var(--space-inset-200);
          
          /* Visual */
          background: var(--vlbi-background);
          border: var(--vlbi-border-width) solid var(--vlbi-border-color);
          border-radius: var(--radius-normal);
          
          /* Typography */
          font-family: inherit;
          text-align: start;
          cursor: pointer;
          
          /* Animation */
          transition: 
            background 250ms ease,
            border-color 250ms ease,
            border-width 250ms ease,
            padding 250ms ease,
            color 250ms ease;
        }
        
        /* Interactive states */
        .vertical-list-item:hover {
          filter: brightness(0.95);
        }
        
        .vertical-list-item:active {
          filter: brightness(0.90);
        }
        
        .vertical-list-item:focus-visible {
          outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
          outline-offset: var(--accessibility-focus-offset);
        }
        
        /* Content container */
        .vertical-list-item__content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0; /* Allow text truncation */
        }
        
        /* Label */
        .vertical-list-item__label {
          color: var(--vlbi-label-color);
          font-size: var(--typography-button-md-font-size, 1rem);
          font-weight: var(--typography-button-md-font-weight, 500);
          line-height: var(--typography-button-md-line-height, 1.5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* Description */
        .vertical-list-item__description {
          color: var(--color-text-muted);
          font-size: var(--typography-body-sm-font-size, 0.875rem);
          font-weight: var(--typography-body-sm-font-weight, 400);
          line-height: var(--typography-body-sm-line-height, 1.5);
        }
        
        /* Leading icon */
        .vertical-list-item__leading-icon {
          flex-shrink: 0;
          color: var(--vlbi-icon-color);
        }
        
        /* Checkmark (selection indicator) */
        .vertical-list-item__checkmark {
          flex-shrink: 0;
          color: var(--vlbi-icon-color);
        }
        
        .vertical-list-item__checkmark--fade {
          transition: opacity var(--motion-selection-transition-duration, 250ms) var(--motion-selection-transition-easing, ease);
        }
        
        .vertical-list-item__checkmark--instant {
          transition: none;
        }
        
        .vertical-list-item__checkmark--hidden {
          opacity: 0;
          visibility: hidden;
        }
        
        .vertical-list-item__checkmark--visible {
          opacity: 1;
          visibility: visible;
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .vertical-list-item {
            border-width: var(--border-border-emphasis) !important;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .vertical-list-item,
          .vertical-list-item__checkmark--fade {
            transition: none;
          }
        }
      </style>
    `;
    
    // Build leading icon HTML
    const leadingIconHtml = leadingIcon 
      ? `<span class="vertical-list-item__leading-icon"><icon-base name="${leadingIcon}" size="${iconSize}" color="inherit"></icon-base></span>`
      : '';
    
    // Build description HTML
    const descriptionHtml = description 
      ? `<span class="vertical-list-item__description">${description}</span>`
      : '';
    
    // Build checkmark HTML (always rendered, visibility controlled by CSS)
    const checkmarkVisibilityClass = styles.checkmarkVisible 
      ? 'vertical-list-item__checkmark--visible' 
      : 'vertical-list-item__checkmark--hidden';
    const checkmarkHtml = `<span class="vertical-list-item__checkmark ${checkmarkTransitionClass} ${checkmarkVisibilityClass}" aria-hidden="true"><icon-base name="check" size="${iconSize}" color="inherit"></icon-base></span>`;
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      ${componentStyles}
      <button
        class="vertical-list-item ${styles.cssClass}"
        type="button"
        role="button"
        aria-label="${label}"
        style="
          --vlbi-background: ${styles.background};
          --vlbi-border-width: ${styles.borderWidth};
          --vlbi-border-color: ${styles.borderColor};
          --vlbi-padding-block: ${paddingBlock};
          --vlbi-label-color: ${styles.labelColor};
          --vlbi-icon-color: ${styles.iconColor};
          ${transitionDelayStyle}
        "
        ${testIDAttr}
      >
        ${leadingIconHtml}
        <div class="vertical-list-item__content">
          <span class="vertical-list-item__label">${label}</span>
          ${descriptionHtml}
        </div>
        ${checkmarkHtml}
      </button>
    `;
    
    // Store reference to button element for event handling
    this._button = this._shadowRoot.querySelector('button');
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
   */
  private _handleClick = (): void => {
    if (this._onClick) {
      this._onClick();
    }
    
    // Dispatch custom 'click' event for external listeners
    this.dispatchEvent(new CustomEvent('click', {
      bubbles: true,
      composed: true
    }));
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
 * Makes <vertical-list-button-item> available as a custom HTML element.
 */
if (!customElements.get('vertical-list-button-item')) {
  customElements.define('vertical-list-button-item', ButtonVerticalListItem);
}

/**
 * Default export for convenience.
 */
export default ButtonVerticalListItem;
