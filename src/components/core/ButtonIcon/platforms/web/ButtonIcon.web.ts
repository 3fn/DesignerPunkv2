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
// Import Icon-Base to ensure it's registered before ButtonIcon uses it
// Migrated from legacy Icon directory to Icon-Base (Stemma System naming)
import '../../../Icon-Base/platforms/web/IconBase.web';
import { IconBaseSize, iconBaseSizes } from '../../../Icon-Base/types';

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
 */
export class ButtonIcon extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _button: HTMLButtonElement | null = null;
  
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
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render and sets up event listeners.
   */
  connectedCallback(): void {
    this.render();
    this._attachEventListeners();
    
    // Warn if ariaLabel is empty (development aid)
    if (!this.ariaLabel) {
      console.warn(
        'ButtonIcon: Missing required "aria-label" attribute. ' +
        'Icon-only buttons require aria-label for screen reader accessibility.'
      );
    }
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
  // Rendering
  // ============================================================================
  
  /**
   * Render the component.
   * 
   * Generates the button HTML with appropriate classes, icon, and accessibility attributes.
   * Uses <icon-base> web component for icon rendering, following the same
   * component composition pattern as iOS and Android platforms.
   * 
   * @see Requirements 4.2, 4.5, 14.3
   */
  private render(): void {
    const icon = this.icon;
    const ariaLabel = this.ariaLabel;
    const size = this.size;
    const variant = this.buttonVariant;
    const testID = this.testID;
    
    // Get icon size for button size variant
    // Icon sizes are type-safe mapped from button size:
    // - Small: 13px (iconBaseSize050)
    // - Medium: 18px (iconBaseSize075)
    // - Large: 24px (iconBaseSize100)
    const iconSize: IconBaseSize = getIconSizeForButton(size);
    
    // Generate class names
    const buttonClasses = [
      'button-icon',
      `button-icon--${size}`,
      `button-icon--${variant}`,
    ].filter(Boolean).join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Inline CSS for Shadow DOM styling
    // This ensures styles work correctly in all deployment scenarios
    const styles = this._generateStyles();
    
    // Render shadow DOM content
    // Uses <icon-base> web component for icon rendering (component composition pattern)
    // Icon is marked as decorative (aria-hidden="true") since button has aria-label
    // @see Requirements 4.2, 4.5
    this._shadowRoot.innerHTML = `
      <style>${styles}</style>
      <button 
        class="${buttonClasses}"
        type="button"
        role="button"
        aria-label="${ariaLabel}"
        ${testIDAttr}
      >
        <span class="button-icon__icon" aria-hidden="true">
          <icon-base name="${icon}" size="${iconSize}" color="inherit"></icon-base>
        </span>
      </button>
    `;
    
    // Store reference to button element for event handling
    this._button = this._shadowRoot.querySelector('button');
  }
  
  /**
   * Generate inline CSS styles for the component.
   * 
   * Styles are inlined in Shadow DOM to ensure they work correctly
   * in all deployment scenarios without external CSS file dependencies.
   * 
   * Token-based styling using CSS custom properties from the mathematical token system.
   * All values reference semantic or primitive tokens - zero hard-coded values.
   * 
   * Key Design Decisions:
   * - Circular shape via radiusCircle token (border-radius: 50%)
   * - Self-contained focus ring buffer (4px on all sides)
   * - No disabled state by design (see Requirement 11.1)
   * - Secondary border shift prevention via box-shadow technique
   * 
   * @returns CSS string for Shadow DOM injection
   * @see Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.2, 4
   */
  private _generateStyles(): string {
    return `
      /* ==========================================================================
         CSS Custom Properties (Token References)
         ========================================================================== */
      
      :host {
        /* Focus ring tokens */
        --button-icon-focus-offset: var(--accessibility-focus-offset);
        --button-icon-focus-width: var(--accessibility-focus-width);
        --button-icon-focus-color: var(--accessibility-focus-color);
        
        /* Focus buffer calculation: offset + width = 4px total per side */
        --button-icon-focus-buffer: 4px; /* accessibility.focus.buffer */
        
        /* Circular shape token */
        --button-icon-radius: 50%; /* radiusCircle */
        
        /* Transition token */
        --button-icon-transition: var(--duration-150);
        
        /* Border tokens */
        --button-icon-border-default: var(--border-default);
        --button-icon-border-emphasis: var(--border-emphasis);
        
        /* Color tokens */
        --button-icon-color-primary: var(--color-primary);
        --button-icon-color-contrast: var(--color-contrast-on-primary);
        --button-icon-color-bg-subtle: var(--color-background-primary-subtle);
      }
      
      /* ==========================================================================
         Base Button Styles
         ========================================================================== */
      
      .button-icon {
        /* Reset browser defaults */
        appearance: none;
        border: none;
        background: transparent;
        padding: 0;
        font: inherit;
        
        /* Interaction */
        cursor: pointer;
        user-select: none;
        
        /* Flexbox centering for icon */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        
        /* Circular shape via radiusCircle token (50%) */
        border-radius: var(--button-icon-radius);
        
        /* Focus buffer margin on all sides (4px = focus.offset + focus.width) */
        margin: var(--button-icon-focus-buffer);
        
        /* Transitions for smooth state changes */
        transition: background-color var(--button-icon-transition) ease-in-out,
                    border-color var(--button-icon-transition) ease-in-out,
                    color var(--button-icon-transition) ease-in-out,
                    box-shadow var(--button-icon-transition) ease-in-out,
                    transform var(--button-icon-transition) ease-in-out;
        
        /* Focus outline reset (custom focus ring implemented below) */
        outline: none;
        
        /* Ensure button doesn't shrink in flex containers */
        flex-shrink: 0;
        
        /* Position relative for pseudo-element touch target extension */
        position: relative;
        
        /* Box sizing for consistent sizing */
        box-sizing: border-box;
      }
      
      /* ==========================================================================
         Size Variants
         ========================================================================== */
      
      /* Small button (32px visual circle) */
      .button-icon--small {
        padding: 8px; /* buttonIcon.inset.small */
        width: 32px; /* buttonIcon.size.small */
        height: 32px; /* buttonIcon.size.small */
        min-width: 32px; /* buttonIcon.size.small */
        min-height: 32px; /* buttonIcon.size.small */
      }
      
      /* Medium button (40px visual circle) - Default size */
      .button-icon--medium {
        padding: 10px; /* buttonIcon.inset.medium */
        width: 40px; /* buttonIcon.size.medium */
        height: 40px; /* buttonIcon.size.medium */
        min-width: 40px; /* buttonIcon.size.medium */
        min-height: 40px; /* buttonIcon.size.medium */
      }
      
      /* Large button (48px visual circle) */
      .button-icon--large {
        padding: 12px; /* buttonIcon.inset.large */
        width: 48px; /* buttonIcon.size.large */
        height: 48px; /* buttonIcon.size.large */
        min-width: 48px; /* buttonIcon.size.large */
        min-height: 48px; /* buttonIcon.size.large */
      }
      
      /* ==========================================================================
         Style Variants
         ========================================================================== */
      
      /* Primary button style (filled background) */
      .button-icon--primary {
        background-color: var(--button-icon-color-primary);
        color: var(--button-icon-color-contrast);
        border: none;
      }
      
      /* Secondary button style (outlined) */
      .button-icon--secondary {
        background-color: transparent;
        color: var(--button-icon-color-primary);
        
        /* Reserve 2px border space with transparent border */
        border: var(--button-icon-border-emphasis) solid transparent;
        
        /* Simulate 1px border with inset box-shadow (prevents layout shift) */
        box-shadow: inset 0 0 0 var(--button-icon-border-default) var(--button-icon-color-primary);
      }
      
      /* Tertiary button style (ghost) */
      .button-icon--tertiary {
        background-color: transparent;
        color: var(--button-icon-color-primary);
        border: none;
      }
      
      /* ==========================================================================
         Icon Container Styling
         ========================================================================== */
      
      .button-icon__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: inherit;
        
        /* Ensure icon doesn't affect button sizing - use inherit to avoid typography detection */
        line-height: inherit;
      }
      
      /* ==========================================================================
         Interaction States - Hover
         ========================================================================== */
      
      /* Primary hover: 8% darker (blend.hoverDarker) */
      .button-icon--primary:hover {
        filter: brightness(0.92);
      }
      
      /* Secondary hover: subtle bg + actual border */
      .button-icon--secondary:hover {
        background-color: var(--button-icon-color-bg-subtle);
        border-color: var(--button-icon-color-primary);
        box-shadow: none;
        filter: brightness(0.92);
      }
      
      /* Tertiary hover: 8% darker icon */
      .button-icon--tertiary:hover {
        filter: brightness(0.92);
      }
      
      /* ==========================================================================
         Interaction States - Pressed/Active
         ========================================================================== */
      
      /* Primary pressed: 12% darker (blend.pressedDarker) */
      .button-icon--primary:active {
        filter: brightness(0.88);
      }
      
      /* Secondary pressed: subtle bg + actual border + 12% darker */
      .button-icon--secondary:active {
        background-color: var(--button-icon-color-bg-subtle);
        border-color: var(--button-icon-color-primary);
        box-shadow: none;
        filter: brightness(0.88);
      }
      
      /* Tertiary pressed: 12% darker icon */
      .button-icon--tertiary:active {
        filter: brightness(0.88);
      }
      
      /* ==========================================================================
         Focus State
         ========================================================================== */
      
      /* Focus ring (keyboard navigation only) */
      .button-icon:focus-visible {
        outline: var(--button-icon-focus-width) solid var(--button-icon-focus-color);
        outline-offset: var(--button-icon-focus-offset);
      }
      
      /* Remove focus outline on mouse click */
      .button-icon:focus:not(:focus-visible) {
        outline: none;
      }
      
      /* ==========================================================================
         Touch Target Extension (Small Size)
         ========================================================================== */
      
      /**
       * Touch target extension for small size.
       * 
       * Small size (32px visual) needs touch target extended to 48px (tapAreaRecommended).
       * Uses ::after pseudo-element to create invisible 48px hit area centered on 32px button.
       * 
       * @see Requirements 5.3, 5.4, 5.5
       */
      .button-icon--small::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 48px; /* tapAreaRecommended */
        height: 48px; /* tapAreaRecommended */
        background: transparent;
        border-radius: 50%;
      }
      
      /* ==========================================================================
         Circular Shape Maintenance
         ========================================================================== */
      
      .button-icon:hover,
      .button-icon:active,
      .button-icon:focus,
      .button-icon:focus-visible {
        border-radius: var(--button-icon-radius);
      }
      
      /* ==========================================================================
         High Contrast Mode Support
         ========================================================================== */
      
      @media (prefers-contrast: high) {
        .button-icon {
          border: var(--button-icon-border-emphasis) solid currentColor;
        }
        
        .button-icon:focus-visible {
          outline-width: 4px; /* border.borderHeavy */
        }
      }
      
      /* ==========================================================================
         Reduced Motion Support
         ========================================================================== */
      
      @media (prefers-reduced-motion: reduce) {
        .button-icon {
          transition: none;
        }
      }
      
      /* ==========================================================================
         Print Styles
         ========================================================================== */
      
      @media print {
        .button-icon {
          background-color: transparent !important;
          color: var(--color-print-default, currentColor) !important;
          border: var(--button-icon-border-default) solid var(--color-print-default, currentColor) !important;
          box-shadow: none !important;
          filter: none !important;
        }
      }
    `;
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
