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
 * Generate SVG path for a rounded hexagon using quadratic Bézier curves.
 * 
 * Creates a pointy-top hexagon with smooth rounded corners using Q (quadratic Bézier)
 * commands. The hexagon fits within a square bounding box (1:1 aspect ratio) with
 * the hexagon's natural proportions maintained inside.
 * 
 * Hexagon Geometry (pointy-top, inscribed in square):
 * - 6 vertices with quadratic curves at each corner
 * - Corner radius proportional to size
 * - Pointy-top orientation (vertex at top and bottom)
 * - Width = Height × cos(30°) ≈ 0.866 (hexagon fits inside square)
 * 
 * @param size - The size of the bounding box (width = height)
 * @param cornerRadius - The radius for rounded corners (default: 8% of size)
 * @returns SVG path string with M, L, and Q commands
 * 
 * @see Requirements: 1.2, 1.3, 1.4, 11.1-11.4 in .kiro/specs/042-avatar-component/requirements.md
 */
function generateRoundedHexagonPath(size: number, cornerRadius?: number): string {
  // Default corner radius is 8% of size for visually pleasing rounded corners
  const r = cornerRadius ?? size * 0.08;
  
  // Hexagon geometry calculations
  // For a pointy-top hexagon inscribed in a square:
  // - Center is at (size/2, size/2)
  // - The hexagon's width = height × cos(30°) ≈ 0.866
  // - We center the hexagon horizontally in the square
  const cx = size / 2;
  const cy = size / 2;
  
  // Hexagon dimensions (fits inside square bounding box)
  // Height spans full size, width is narrower due to hexagon proportions
  const hexHeight = size;
  const hexWidth = size * Math.cos(Math.PI / 6); // cos(30°) ≈ 0.866
  
  // Calculate vertex positions (pointy-top orientation)
  // Vertices numbered 0-5 starting from top, going clockwise
  const halfWidth = hexWidth / 2;
  const quarterHeight = hexHeight / 4;
  
  // Vertex coordinates (clockwise from top)
  const vertices = [
    { x: cx, y: 0 },                           // 0: Top vertex
    { x: cx + halfWidth, y: quarterHeight },   // 1: Top-right vertex
    { x: cx + halfWidth, y: 3 * quarterHeight }, // 2: Bottom-right vertex
    { x: cx, y: hexHeight },                   // 3: Bottom vertex
    { x: cx - halfWidth, y: 3 * quarterHeight }, // 4: Bottom-left vertex
    { x: cx - halfWidth, y: quarterHeight },   // 5: Top-left vertex
  ];
  
  // Build path with quadratic Bézier curves at corners
  // For each vertex, we:
  // 1. Draw a line to a point before the vertex (offset by corner radius)
  // 2. Draw a quadratic curve through the vertex to a point after it
  
  const pathParts: string[] = [];
  const numVertices = vertices.length;
  
  for (let i = 0; i < numVertices; i++) {
    const curr = vertices[i];
    const next = vertices[(i + 1) % numVertices];
    const prev = vertices[(i - 1 + numVertices) % numVertices];
    
    // Calculate direction vectors
    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const toNext = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Normalize direction vectors
    const lenToPrev = Math.sqrt(toPrev.x * toPrev.x + toPrev.y * toPrev.y);
    const lenToNext = Math.sqrt(toNext.x * toNext.x + toNext.y * toNext.y);
    
    const normToPrev = { x: toPrev.x / lenToPrev, y: toPrev.y / lenToPrev };
    const normToNext = { x: toNext.x / lenToNext, y: toNext.y / lenToNext };
    
    // Calculate points before and after the vertex (offset by corner radius)
    const beforeVertex = {
      x: curr.x + normToPrev.x * r,
      y: curr.y + normToPrev.y * r,
    };
    const afterVertex = {
      x: curr.x + normToNext.x * r,
      y: curr.y + normToNext.y * r,
    };
    
    if (i === 0) {
      // Start path at the point after the first vertex
      pathParts.push(`M ${afterVertex.x.toFixed(2)} ${afterVertex.y.toFixed(2)}`);
    } else {
      // Line to point before current vertex
      pathParts.push(`L ${beforeVertex.x.toFixed(2)} ${beforeVertex.y.toFixed(2)}`);
      // Quadratic curve through vertex to point after vertex
      pathParts.push(`Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${afterVertex.x.toFixed(2)} ${afterVertex.y.toFixed(2)}`);
    }
  }
  
  // Close the path: line to before first vertex, then curve through it
  const firstVertex = vertices[0];
  const secondVertex = vertices[1];
  const lastVertex = vertices[numVertices - 1];
  
  // Direction from first vertex to last and to second
  const toLastFromFirst = { x: lastVertex.x - firstVertex.x, y: lastVertex.y - firstVertex.y };
  const toSecondFromFirst = { x: secondVertex.x - firstVertex.x, y: secondVertex.y - firstVertex.y };
  
  const lenToLast = Math.sqrt(toLastFromFirst.x * toLastFromFirst.x + toLastFromFirst.y * toLastFromFirst.y);
  const lenToSecond = Math.sqrt(toSecondFromFirst.x * toSecondFromFirst.x + toSecondFromFirst.y * toSecondFromFirst.y);
  
  const normToLast = { x: toLastFromFirst.x / lenToLast, y: toLastFromFirst.y / lenToLast };
  const normToSecond = { x: toSecondFromFirst.x / lenToSecond, y: toSecondFromFirst.y / lenToSecond };
  
  const beforeFirst = {
    x: firstVertex.x + normToLast.x * r,
    y: firstVertex.y + normToLast.y * r,
  };
  const afterFirst = {
    x: firstVertex.x + normToSecond.x * r,
    y: firstVertex.y + normToSecond.y * r,
  };
  
  // Line to before first vertex
  pathParts.push(`L ${beforeFirst.x.toFixed(2)} ${beforeFirst.y.toFixed(2)}`);
  // Curve through first vertex back to start point
  pathParts.push(`Q ${firstVertex.x.toFixed(2)} ${firstVertex.y.toFixed(2)} ${afterFirst.x.toFixed(2)} ${afterFirst.y.toFixed(2)}`);
  
  // Close path
  pathParts.push('Z');
  
  return pathParts.join(' ');
}

/**
 * Icon size mapping for Avatar sizes.
 * 
 * Maps avatar sizes to IconBaseSize values for the Icon component.
 * Uses existing icon tokens where available, with special handling for
 * xs and xxl which derive from icon.size050 using calc() multipliers.
 * 
 * Icon sizes maintain 50% ratio with avatar sizes:
 * - xs (24px avatar) → 12px icon (calc(icon.size050 × 0.75))
 * - sm (32px avatar) → 16px icon (icon.size050, IconBaseSize 13)
 * - md (40px avatar) → 20px icon (icon.size075, IconBaseSize 18)
 * - lg (48px avatar) → 24px icon (icon.size100, IconBaseSize 24)
 * - xl (80px avatar) → 40px icon (icon.size500, IconBaseSize 40)
 * - xxl (128px avatar) → 64px icon (calc(icon.size050 × 4))
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
 * Avatar size to pixel value mapping.
 * 
 * Used for SVG rendering where we need actual pixel values.
 * These values match the token-based CSS sizing.
 * 
 * @see Requirements: 2.1-2.6 in .kiro/specs/042-avatar-component/requirements.md
 */
const AVATAR_SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,   // space300
  sm: 32,   // space400
  md: 40,   // space500
  lg: 48,   // space600
  xl: 80,   // SPACING_BASE_VALUE * 10
  xxl: 128, // SPACING_BASE_VALUE * 16
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
   * For xs and xxl sizes, uses CSS calc() with icon tokens to derive the size.
   * For other sizes, uses the Icon-Base component with IconBaseSize values.
   * 
   * Icon Size Derivations (xs and xxl):
   * - xs (12px) = icon.size050 (16px) × 0.75
   * - xxl (64px) = icon.size050 (16px) × 4
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
    
    // For xs and xxl sizes, we need to use CSS calc() with icon tokens
    // since there's no IconBaseSize equivalent for 12px and 64px
    // Derive from icon.size050 (16px) to get proper px units
    if (iconSize === 'xs' || iconSize === 'xxl') {
      // Use calc() with icon.size050 to derive the size with proper px units
      // xs (12px) = icon.size050 (16px) × 0.75
      // xxl (64px) = icon.size050 (16px) × 4
      const sizeCalc = iconSize === 'xs' 
        ? 'calc(var(--icon-size-050) * 0.75)' 
        : 'calc(var(--icon-size-050) * 4)';
      const iconContent = this.getIconSVGContent(iconName);
      
      return `
        <span class="avatar__icon avatar__icon--${type}" style="width: ${sizeCalc}; height: ${sizeCalc};">
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
   * For agent type, uses inline SVG with Bézier curves for true rounded corners
   * instead of CSS clip-path (which clips borders and causes visual issues).
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
    // Escape testID to prevent XSS attacks
    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';
    
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
    
    // Render different structures based on type
    // Agent type uses SVG-based hexagon with Bézier curves for true rounded corners
    // Human type uses CSS border-radius for circle shape
    if (type === 'agent') {
      this._shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
          ${avatarStyles}
        </style>
        ${this.renderAgentSVG(size, interactive, decorative, testID)}
      `;
    } else {
      // Human type uses standard div with CSS border-radius
      this._shadowRoot.innerHTML = `
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
    }
    
    // Attach error handler to image element if present
    // @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
    this.attachImageErrorHandler();
  }
  
  /**
   * Render agent avatar using inline SVG with Bézier curves.
   * 
   * Uses SVG path with quadratic Bézier curves (Q commands) for true rounded corners
   * instead of the Ana Tudor technique (polygon + circles) which creates bumps.
   * 
   * SVG approach benefits:
   * - True rounded corners with smooth transitions
   * - Border applied via SVG stroke (not clipped like CSS border)
   * - 1:1 aspect ratio (square bounding box, hexagon fits inside)
   * - Interactive hover state works via CSS on stroke-width
   * 
   * @param size - Avatar size variant
   * @param interactive - Whether avatar shows hover visual feedback
   * @param decorative - Whether avatar is hidden from screen readers
   * @param testID - Test ID for automated testing
   * @returns HTML string for SVG-based agent avatar
   * 
   * @see Requirements: 1.2, 1.3, 1.4, 7.1-7.4, 11.1-11.4
   */
  private renderAgentSVG(size: AvatarSize, interactive: boolean, decorative: boolean, testID: string | null): string {
    const sizePx = AVATAR_SIZE_PX[size];
    const cornerRadius = sizePx * 0.08; // 8% of size for rounded corners
    
    // Generate the hexagon path with Bézier curves
    const hexPath = generateRoundedHexagonPath(sizePx, cornerRadius);
    
    // Determine border width based on size and interactive state
    // xs-xl: borderDefault (1px), xxl: borderEmphasis (2px)
    // Interactive hover increases to borderEmphasis (handled in CSS)
    const borderWidth = size === 'xxl' ? 2 : 1;
    
    // Generate CSS classes for the SVG container
    const svgClasses = [
      'avatar',
      'avatar--agent',
      `avatar--size-${size}`,
      interactive ? 'avatar--interactive' : '',
    ].filter(Boolean).join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';
    
    // Generate aria-hidden attribute for decorative avatars
    const ariaHiddenAttr = decorative ? ' aria-hidden="true"' : '';
    
    // Unique ID for clipPath (to avoid conflicts with multiple avatars)
    const clipId = `hexagon-clip-${Math.random().toString(36).substr(2, 9)}`;
    
    // Render icon content
    const iconContent = this.renderIconContent('agent', size);
    
    return `
      <div class="${svgClasses}"${testIDAttr}${ariaHiddenAttr}>
        <svg 
          class="avatar__hexagon-svg"
          width="${sizePx}" 
          height="${sizePx}" 
          viewBox="0 0 ${sizePx} ${sizePx}"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="${clipId}">
              <path d="${hexPath}" />
            </clipPath>
          </defs>
          
          <!-- Background fill -->
          <path 
            class="avatar__hexagon-bg"
            d="${hexPath}" 
            fill="var(--color-avatar-agent)"
          />
          
          <!-- Border stroke -->
          <path 
            class="avatar__hexagon-border"
            d="${hexPath}" 
            fill="none"
            stroke="${size === 'xxl' ? 'var(--white-100)' : 'var(--color-avatar-border)'}"
            stroke-width="${borderWidth}"
            stroke-opacity="${size === 'xxl' ? '1' : '0.48'}"
          />
        </svg>
        
        <!-- Icon content positioned over SVG -->
        <div class="avatar__content" style="clip-path: url(#${clipId});">
          ${iconContent}
        </div>
      </div>
    `;
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
