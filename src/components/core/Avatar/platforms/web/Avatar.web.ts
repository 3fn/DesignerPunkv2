/**
 * Avatar Component for Web Platform (Vanilla Web Component)
 * 
 * Visual representation component for users (Human) and AI agents (Agent) with
 * distinct shape-based differentiation. Human avatars render as circles (organic, natural),
 * while AI agent avatars render as hexagons (synthetic, constructed).
 * 
 * Stemma System Naming: [Family]-[Type] = Avatar
 * Component Type: Primitive (Base)
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses Shadow DOM for style encapsulation and token-based styling via CSS custom properties.
 * 
 * @module Avatar/platforms/web
 * @see Requirements: 1.1, 1.5, 2.7, 11.1 in .kiro/specs/042-avatar-component/requirements.md
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 */

import { AvatarType, AvatarSize, AVATAR_DEFAULTS } from '../../types';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// @see scripts/esbuild-css-plugin.js
// @see Requirements: 1.1, 1.2, 1.3, 2.1-2.6 (token-based styling)
import avatarStyles from './Avatar.styles.css';

/**
 * Avatar Web Component
 * 
 * A native web component that renders avatars with shape-based entity differentiation:
 * - Human type: Circle shape (border-radius: 50%)
 * - Agent type: Hexagon shape (SVG clipPath)
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties
 * - Supports six size variants (xs, sm, md, lg, xl, xxl)
 * - Interactive mode enables hover visual feedback
 * - Decorative mode hides avatar from screen readers
 * - WCAG 2.1 AA compliant accessibility
 * 
 * @example
 * ```html
 * <!-- Basic human avatar -->
 * <avatar-base type="human" size="md"></avatar-base>
 * 
 * <!-- Agent avatar with interactive hover -->
 * <avatar-base type="agent" size="lg" interactive="true"></avatar-base>
 * 
 * <!-- Human avatar with image -->
 * <avatar-base type="human" size="xl" src="/profile.jpg" alt="User profile"></avatar-base>
 * 
 * <!-- Decorative avatar (hidden from screen readers) -->
 * <avatar-base type="human" size="sm" decorative="true"></avatar-base>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const avatar = document.createElement('avatar-base') as AvatarBaseElement;
 * avatar.type = 'agent';
 * avatar.size = 'lg';
 * avatar.interactive = true;
 * document.body.appendChild(avatar);
 * ```
 * 
 * @see Requirements: 1.1, 1.5, 2.7, 11.1 in .kiro/specs/042-avatar-component/requirements.md
 */
export class AvatarBaseElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   * 
   * Attributes:
   * - type: Entity type ('human' | 'agent') - determines shape
   * - size: Size variant ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')
   * - src: Image source URL (human only)
   * - alt: Alt text for accessibility (required if src provided)
   * - interactive: Whether avatar shows hover visual feedback
   * - decorative: Hide from screen readers
   * - testid: Test ID for automated testing
   * 
   * @see Requirements: 1.5, 2.7 in .kiro/specs/042-avatar-component/requirements.md
   */
  static get observedAttributes(): string[] {
    return ['type', 'size', 'src', 'alt', 'interactive', 'decorative', 'testid'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    // @see Requirements: 11.1 - Web component with Shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render of the avatar component.
   * 
   * @see Requirements: 11.1 - connectedCallback with initial render
   */
  connectedCallback(): void {
    this.render();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * Triggers re-render to reflect the new attribute value.
   * Only re-renders if the element is connected to the DOM to prevent
   * errors during initial attribute setup before connectedCallback.
   * 
   * @param _name - Attribute name (unused, prefixed with underscore)
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   * 
   * @see Requirements: 11.1 - attributeChangedCallback for prop updates
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    // Only re-render if the element is connected to the DOM
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }
  
  // ============================================================================
  // Property Getters/Setters
  // ============================================================================
  
  /**
   * Get the avatar entity type.
   * 
   * @returns 'human' or 'agent' (defaults to 'human')
   * @see Requirements: 1.5 - Default to "human" type when prop omitted
   */
  get type(): AvatarType {
    const type = this.getAttribute('type');
    return (type === 'human' || type === 'agent') ? type : AVATAR_DEFAULTS.type;
  }
  
  /**
   * Set the avatar entity type.
   */
  set type(value: AvatarType) {
    this.setAttribute('type', value);
  }
  
  /**
   * Get the avatar size variant.
   * 
   * @returns Size variant (defaults to 'md')
   * @see Requirements: 2.7 - Default to "md" size when prop omitted
   */
  get size(): AvatarSize {
    const size = this.getAttribute('size');
    const validSizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    return validSizes.includes(size as AvatarSize) ? (size as AvatarSize) : AVATAR_DEFAULTS.size;
  }
  
  /**
   * Set the avatar size variant.
   */
  set size(value: AvatarSize) {
    this.setAttribute('size', value);
  }
  
  /**
   * Get the image source URL.
   * 
   * @returns Image URL or null
   */
  get src(): string | null {
    return this.getAttribute('src');
  }
  
  /**
   * Set the image source URL.
   */
  set src(value: string | null) {
    if (value) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }
  
  /**
   * Get the alt text for accessibility.
   * 
   * @returns Alt text or null
   */
  get alt(): string | null {
    return this.getAttribute('alt');
  }
  
  /**
   * Set the alt text for accessibility.
   */
  set alt(value: string | null) {
    if (value) {
      this.setAttribute('alt', value);
    } else {
      this.removeAttribute('alt');
    }
  }
  
  /**
   * Get the interactive state.
   * 
   * @returns true if interactive, false otherwise (defaults to false)
   * @see Requirements: 8.4 - Default interactive to false when prop omitted
   */
  get interactive(): boolean {
    return this.getAttribute('interactive') === 'true';
  }
  
  /**
   * Set the interactive state.
   */
  set interactive(value: boolean) {
    if (value) {
      this.setAttribute('interactive', 'true');
    } else {
      this.removeAttribute('interactive');
    }
  }
  
  /**
   * Get the decorative state.
   * 
   * @returns true if decorative, false otherwise (defaults to false)
   * @see Requirements: 9.3 - Default decorative to false when prop omitted
   */
  get decorative(): boolean {
    return this.getAttribute('decorative') === 'true';
  }
  
  /**
   * Set the decorative state.
   */
  set decorative(value: boolean) {
    if (value) {
      this.setAttribute('decorative', 'true');
    } else {
      this.removeAttribute('decorative');
    }
  }
  
  /**
   * Get the test ID.
   * 
   * @returns Test ID or null
   */
  get testID(): string | null {
    return this.getAttribute('testid');
  }
  
  /**
   * Set the test ID.
   */
  set testID(value: string | null) {
    if (value) {
      this.setAttribute('testid', value);
    } else {
      this.removeAttribute('testid');
    }
  }
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  /**
   * Render the component into shadow DOM.
   * 
   * Generates the avatar structure with appropriate shape, size, and content.
   * Uses external CSS file (Avatar.styles.css) for token-based styling.
   * 
   * @see Requirements: 1.1, 1.2, 1.3, 1.5, 2.1-2.7, 11.1
   */
  private render(): void {
    const type = this.type;
    const size = this.size;
    const src = this.src;
    const alt = this.alt;
    const interactive = this.interactive;
    const decorative = this.decorative;
    const testID = this.testID;
    
    // Generate CSS classes based on props
    const avatarClasses = [
      'avatar',
      `avatar--${type}`,
      `avatar--size-${size}`,
      interactive ? 'avatar--interactive' : ''
    ].filter(Boolean).join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate aria-hidden attribute for decorative avatars
    // @see Requirements: 9.2 - Apply aria-hidden="true" when decorative prop is true
    const ariaHiddenAttr = decorative ? ' aria-hidden="true"' : '';
    
    // Warn in development if src is provided without alt
    // @see Requirements: 5.4 - Require alt prop when src is provided
    if (src && !alt && typeof console !== 'undefined') {
      console.warn(
        'AvatarBaseElement: "alt" prop is required when "src" is provided for accessibility. ' +
        'Please add an alt attribute describing the image.'
      );
    }
    
    // Render shadow DOM content
    // Uses external CSS file (Avatar.styles.css) for token-based styling
    // @see Requirements: 1.1, 1.2, 1.3, 2.1-2.6 - Shape and size styling
    this._shadowRoot.innerHTML = `
      <!--
        SVG ClipPath Definition for Rounded Hexagon (Agent Type)
        
        Uses the Ana Tudor technique: polygon + circles at vertices for rounded corners.
        clipPathUnits="objectBoundingBox" makes it responsive without JavaScript.
        
        Hexagon Geometry:
        - Pointy-top orientation (vertex at top and bottom)
        - Aspect ratio: cos(30°) ≈ 0.866 (width = height × 0.866)
        - Corner radius: 0.05 (relative to bounding box)
        
        @see Requirements: 1.2, 1.3, 1.4, 11.1, 11.2, 11.3, 11.4
      -->
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="rounded-hexagon" clipPathUnits="objectBoundingBox">
            <!-- Base hexagon polygon (pointy-top orientation) -->
            <polygon points="0.5,0 0.933,0.25 0.933,0.75 0.5,1 0.067,0.75 0.067,0.25" />
            <!-- Rounded corner circles (Ana Tudor technique) -->
            <circle cx="0.5" cy="0.05" r="0.05" />
            <circle cx="0.89" cy="0.27" r="0.05" />
            <circle cx="0.89" cy="0.73" r="0.05" />
            <circle cx="0.5" cy="0.95" r="0.05" />
            <circle cx="0.11" cy="0.73" r="0.05" />
            <circle cx="0.11" cy="0.27" r="0.05" />
          </clipPath>
        </defs>
      </svg>
      
      <style>
        :host {
          display: inline-block;
        }
        ${avatarStyles}
      </style>
      <div class="${avatarClasses}"${testIDAttr}${ariaHiddenAttr}>
        <!-- Content (icon or image) will be added in Task 3 -->
      </div>
    `;
  }
}

/**
 * Register the custom element.
 * 
 * Makes <avatar-base> available as a custom HTML element.
 * 
 * @see Requirements: 11.1 - Register custom element as <avatar-base>
 */
if (!customElements.get('avatar-base')) {
  customElements.define('avatar-base', AvatarBaseElement);
}

/**
 * Default export for convenience.
 */
export default AvatarBaseElement;
