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
 * @see Requirements: 1.1, 1.5, 2.7, 3.1-3.8, 11.1, 15.1, 15.2 in .kiro/specs/042-avatar-component/requirements.md
 * @see .kiro/specs/042-avatar-component/design.md for implementation details
 */

import { AvatarType, AvatarSize, AVATAR_DEFAULTS } from '../../types';
import { IconBaseSize } from '../../../Icon-Base/types';
// Import createIconBase for rendering icons within Avatar
// Using the functional API for simpler integration within shadow DOM
import { createIconBase } from '../../../Icon-Base/platforms/web/IconBase.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
// @see scripts/esbuild-css-plugin.js
// @see Requirements: 1.1, 1.2, 1.3, 2.1-2.6 (token-based styling)
import avatarStyles from './Avatar.styles.css';

/**
 * Icon size mapping for Avatar sizes.
 * 
 * Maps avatar sizes to IconBaseSize values for the Icon component.
 * Uses existing icon tokens where available, with special handling for
 * xs and xxl which use component tokens (no IconBaseSize equivalent).
 * 
 * Icon sizes maintain 50% ratio with avatar sizes:
 * - xs (24px avatar) → 12px icon (component token)
 * - sm (32px avatar) → 16px icon (icon.size050, IconBaseSize 13)
 * - md (40px avatar) → 20px icon (icon.size075, IconBaseSize 18)
 * - lg (48px avatar) → 24px icon (icon.size100, IconBaseSize 24)
 * - xl (80px avatar) → 40px icon (icon.size500, IconBaseSize 40)
 * - xxl (128px avatar) → 64px icon (component token)
 * 
 * @see Requirements: 3.1-3.6 in .kiro/specs/042-avatar-component/requirements.md
 */
const AVATAR_ICON_SIZE_MAP: Record<AvatarSize, IconBaseSize | 'xs' | 'xxl'> = {
  xs: 'xs',    // 12px - uses avatar.icon.size.xs component token
  sm: 13,      // 16px - maps to icon.size050
  md: 18,      // 20px - maps to icon.size075
  lg: 24,      // 24px - maps to icon.size100
  xl: 40,      // 40px - maps to icon.size500
  xxl: 'xxl',  // 64px - uses avatar.icon.size.xxl component token
};

/**
 * Icon names for avatar types.
 * 
 * - Human: 'user' icon (person silhouette)
 * - Agent: 'settings' icon (placeholder for bot/AI icon)
 * 
 * @see Requirements: 3.7, 3.8 in .kiro/specs/042-avatar-component/requirements.md
 */
const AVATAR_ICON_NAMES = {
  human: 'user',
  agent: 'settings', // Placeholder - ideally would be a bot/AI icon
} as const;

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
   * Generate icon content HTML for the avatar.
   * 
   * Renders the appropriate icon based on avatar type:
   * - Human: 'user' icon (person silhouette)
   * - Agent: 'settings' icon (placeholder for bot/AI)
   * 
   * Icon size is determined by avatar size using the 50% ratio mapping.
   * For xs and xxl sizes, uses CSS custom properties from component tokens.
   * For other sizes, uses the Icon-Base component with IconBaseSize values.
   * 
   * @param type - Avatar type ('human' or 'agent')
   * @param size - Avatar size variant
   * @returns HTML string for icon content
   * 
   * @see Requirements: 3.1-3.8, 15.1, 15.2 in .kiro/specs/042-avatar-component/requirements.md
   */
  private renderIconContent(type: AvatarType, size: AvatarSize): string {
    const iconName = AVATAR_ICON_NAMES[type];
    const iconSize = AVATAR_ICON_SIZE_MAP[size];
    
    // For xs and xxl sizes, we need to use CSS custom properties
    // since there's no IconBaseSize equivalent for 12px and 64px
    if (iconSize === 'xs' || iconSize === 'xxl') {
      // Use inline SVG with CSS custom property for size
      // This allows the icon to use the avatar component tokens
      const sizeVar = iconSize === 'xs' ? 'var(--avatar-icon-size-xs)' : 'var(--avatar-icon-size-xxl)';
      const iconContent = this.getIconSVGContent(iconName);
      
      return `
        <span class="avatar__icon avatar__icon--${type}" style="width: ${sizeVar}; height: ${sizeVar};">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="var(--icon-stroke-width)" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="avatar__icon-svg"
            aria-hidden="true"
          >
            ${iconContent}
          </svg>
        </span>
      `;
    }
    
    // For standard sizes (sm, md, lg, xl), use the Icon-Base component
    // The createIconBase function generates the SVG with proper sizing
    const iconHTML = createIconBase({
      name: iconName,
      size: iconSize as IconBaseSize,
      color: 'inherit', // Inherit color from parent (set via CSS)
    });
    
    return `
      <span class="avatar__icon avatar__icon--${type}">
        ${iconHTML}
      </span>
    `;
  }
  
  /**
   * Get SVG inner content for a given icon name.
   * 
   * Used for xs and xxl sizes where we need custom sizing via CSS custom properties.
   * 
   * @param name - Icon name
   * @returns SVG inner content (paths, lines, etc.)
   */
  private getIconSVGContent(name: string): string {
    // Icon content matching Icon-Base component
    const iconContent: Record<string, string> = {
      'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
      'settings': '<circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m0 6l-4.24 4.24M23 12h-6m-6 0H1m18.66 5.66l-4.24-4.24m0-6l-4.24-4.24"></path>',
      'circle': '<circle cx="12" cy="12" r="10"></circle>',
    };
    
    return iconContent[name] || iconContent['circle'];
  }
  
  /**
   * Render image content HTML for the avatar.
   * 
   * Renders an image element when src prop is provided for human type avatars.
   * Agent type avatars ignore the src prop and always show icon content.
   * 
   * Image styling:
   * - object-fit: cover for proper scaling
   * - Clipped to circle shape via parent border-radius
   * - Full width/height to fill avatar container
   * 
   * Error handling:
   * - onerror handler falls back to icon placeholder
   * - Removes src attribute to prevent retry loops
   * 
   * @param src - Image source URL
   * @param alt - Alt text for accessibility
   * @returns HTML string for image content
   * 
   * @see Requirements: 5.1, 5.2, 5.3, 5.6 in .kiro/specs/042-avatar-component/requirements.md
   */
  private renderImageContent(src: string, alt: string | null): string {
    // Escape HTML entities in src and alt to prevent XSS
    const escapedSrc = this.escapeHtml(src);
    const escapedAlt = alt ? this.escapeHtml(alt) : '';
    
    return `
      <img 
        class="avatar__image" 
        src="${escapedSrc}" 
        alt="${escapedAlt}"
        loading="lazy"
      />
    `;
  }
  
  /**
   * Handle image load error by falling back to icon placeholder.
   * 
   * When an image fails to load:
   * 1. Removes the src attribute to prevent retry loops
   * 2. Triggers re-render to show icon placeholder
   * 
   * This method is called from the image's onerror event handler
   * which is set up in connectedCallback.
   * 
   * @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
   */
  private handleImageError(): void {
    // Remove src attribute to prevent retry loops and trigger fallback
    // @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
    this.removeAttribute('src');
    // Re-render will happen automatically via attributeChangedCallback
  }
  
  /**
   * Escape HTML entities to prevent XSS attacks.
   * 
   * @param str - String to escape
   * @returns Escaped string safe for HTML insertion
   */
  private escapeHtml(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
  
  /**
   * Determine what content to render based on avatar type and props.
   * 
   * Content priority:
   * 1. For agent type: Always render icon (src prop is ignored)
   * 2. For human type with src: Render image
   * 3. For human type without src: Render icon placeholder
   * 
   * @param type - Avatar type ('human' or 'agent')
   * @param size - Avatar size variant
   * @param src - Image source URL (optional)
   * @param alt - Alt text for accessibility (optional)
   * @returns HTML string for avatar content
   * 
   * @see Requirements: 5.1, 5.5 in .kiro/specs/042-avatar-component/requirements.md
   */
  private renderContent(type: AvatarType, size: AvatarSize, src: string | null, alt: string | null): string {
    // Agent type always shows icon, ignoring src prop
    // @see Requirements: 5.5 - Agent type ignores src prop
    if (type === 'agent') {
      return this.renderIconContent(type, size);
    }
    
    // Human type with src shows image
    // @see Requirements: 5.1 - Human type with src displays image
    if (src) {
      return this.renderImageContent(src, alt);
    }
    
    // Human type without src shows icon placeholder
    return this.renderIconContent(type, size);
  }
  
  /**
   * Render the component into shadow DOM.
   * 
   * Generates the avatar structure with appropriate shape, size, and content.
   * Uses external CSS file (Avatar.styles.css) for token-based styling.
   * 
   * @see Requirements: 1.1, 1.2, 1.3, 1.5, 2.1-2.7, 3.1-3.8, 5.1-5.5, 11.1, 15.1, 15.2
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
    // Add 'avatar--has-image' class when displaying an image (human type with src)
    const hasImage = type === 'human' && src;
    const avatarClasses = [
      'avatar',
      `avatar--${type}`,
      `avatar--size-${size}`,
      interactive ? 'avatar--interactive' : '',
      hasImage ? 'avatar--has-image' : ''
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
        ${this.renderContent(type, size, src, alt)}
      </div>
    `;
    
    // Attach error handler to image element if present
    // @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
    this.attachImageErrorHandler();
  }
  
  /**
   * Attach error handler to image element in shadow DOM.
   * 
   * Called after render to set up the onerror handler for image fallback.
   * Uses event listener instead of inline onerror attribute for better
   * security and separation of concerns.
   * 
   * @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
   */
  private attachImageErrorHandler(): void {
    const img = this._shadowRoot.querySelector('.avatar__image');
    if (img) {
      img.addEventListener('error', () => this.handleImageError(), { once: true });
    }
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
