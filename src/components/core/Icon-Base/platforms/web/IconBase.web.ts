/**
 * Icon-Base Component for Web Platform
 * 
 * Stemma System: Icons Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Icon-Base
 * 
 * Renders inline SVG icons with currentColor inheritance for automatic color matching.
 * Part of the DesignerPunk Icon System infrastructure.
 * 
 * This module provides both a web component (<icon-base>) and backward-compatible
 * functional API (createIconBase, IconBase class) for maximum flexibility.
 * 
 * Uses theme-aware blend utilities for optical balance adjustment when icons are 
 * paired with text. The iconColor() function from getBlendUtilities() compensates 
 * for icons appearing heavier than adjacent text due to stroke density and fill area.
 * 
 * @module Icon-Base/platforms/web
 * @see Requirements: 10.1, 10.2, 11.1, 11.2, 11.3 - Optical balance using theme-aware blend utilities
 */

import { IconBaseProps, IconBaseName, IconBaseSize } from '../../types';
// Import theme-aware blend utilities for optical balance calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Create blend utilities instance for icon optical balance
// Uses getBlendUtilities() factory for cross-platform consistency
const blendUtils: BlendUtilitiesResult = getBlendUtilities();

/**
 * Load SVG content for a given icon name.
 * 
 * Maps icon names to their SVG inner content (paths, lines, etc.) for inline rendering.
 * 
 * @param name - Icon name to load
 * @returns SVG inner content as string
 */
function loadIconSVG(name: IconBaseName): string {
  // Map of icon names to their SVG content
  // In a production build system, this could be auto-generated from the assets directory
  const iconContent: Record<IconBaseName, string> = {
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
    'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
    'arrow-up': '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
    'arrow-down': '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
    'check': '<polyline points="20 6 9 17 4 12"></polyline>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    'x-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    'info': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    'plus': '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    'minus': '<line x1="5" y1="12" x2="19" y2="12"></line>',
    'circle': '<circle cx="12" cy="12" r="10"></circle>',
    'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    'settings': '<circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m0 6l-4.24 4.24M23 12h-6m-6 0H1m18.66 5.66l-4.24-4.24m0-6l-4.24-4.24"></path>',
    'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  };

  return iconContent[name] || iconContent['circle']; // Fallback to circle if icon not found
}

/**
 * Create an SVG icon element with the specified properties.
 * 
 * This function generates an SVG string that can be used in various contexts:
 * - Direct HTML insertion
 * - React dangerouslySetInnerHTML
 * - Template literals
 * - Server-side rendering
 * 
 * The SVG uses currentColor for stroke, enabling automatic color inheritance
 * from parent elements. Icons are marked as aria-hidden="true" for accessibility.
 * 
 * @param props - Icon properties
 * @returns SVG element as HTML string
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const iconHTML = createIconBase({ name: 'arrow-right', size: 24 });
 * 
 * // With custom styling
 * const styledIcon = createIconBase({ 
 *   name: 'check', 
 *   size: 32, 
 *   className: 'success-icon',
 *   style: { marginRight: '8px' }
 * });
 * 
 * // Insert into DOM
 * element.innerHTML = iconHTML;
 * ```
 */
export function createIconBase(props: IconBaseProps): string {
  const { name, size, className = '', style = {}, testID, color = 'inherit', opticalBalance = false } = props;
  
  // Load SVG content based on icon name
  const svgContent = loadIconSVG(name);
  
  // Map size to pixel value for explicit SVG dimensions
  // This ensures icons render correctly regardless of CSS context (Shadow DOM, etc.)
  const sizePixelMap: Record<IconBaseSize, number> = {
    13: 16,   // icon-size-050: 16px
    20: 20,   // icon-size-075: 20px
    24: 24,   // icon-size-100: 24px
    28: 28,   // icon-size-125: 28px
    32: 32,   // icon-size-200: 32px
    36: 36,   // icon-size-400: 36px
    40: 40,   // icon-size-500: 40px
    44: 44,   // icon-size-600: 44px
    48: 48    // icon-size-700: 48px
  };
  
  const sizePixels = sizePixelMap[size];
  
  // Fail loudly if size is not a valid IconBaseSize value
  // This follows the "fail loudly" philosophy to surface issues early during development
  if (sizePixels === undefined) {
    throw new Error(
      `Invalid icon size: ${size}. ` +
      `Valid sizes are: ${Object.keys(sizePixelMap).join(', ')}. ` +
      `Ensure you're using a valid IconBaseSize value (13, 20, 24, 28, 32, 36, 40, 44, 48).`
    );
  }
  
  // Map size to CSS class (using icon size token scale) - kept for semantic styling
  const sizeClassMap: Record<IconBaseSize, string> = {
    13: 'icon-base--size-050',
    20: 'icon-base--size-075',
    24: 'icon-base--size-100',
    28: 'icon-base--size-125',  // Note: size125 and size150 both = 28px
    32: 'icon-base--size-200',  // Note: size125, size200, size300 all = 32px
    36: 'icon-base--size-400',
    40: 'icon-base--size-500',
    44: 'icon-base--size-600',
    48: 'icon-base--size-700'
  };
  
  const sizeClass = sizeClassMap[size];
  
  // Build class attribute with size class
  const classAttr = `icon-base ${sizeClass} icon-base-${name} ${className}`.trim();
  
  // Determine stroke color based on color prop and optical balance
  // When opticalBalance is true and color is a hex value, apply iconColor()
  // from theme-aware blend utilities to compensate for icons appearing heavier than adjacent text
  // @see Requirements: 10.1, 10.2 - Optical balance using blend utilities
  // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
  let strokeColor: string;
  if (color === 'inherit') {
    strokeColor = 'currentColor';
  } else if (opticalBalance && color.startsWith('#')) {
    // Apply optical balance using iconColor() from theme-aware blend utilities
    // Uses lighterBlend(color, blend.iconLighter) internally (8% lighter)
    // This uses blend utilities instead of CSS filter: brightness() workaround
    strokeColor = blendUtils.iconColor(color);
  } else if (color.startsWith('#')) {
    // Direct hex color without optical balance
    strokeColor = color;
  } else {
    // Token reference becomes CSS custom property
    strokeColor = `var(--${color})`;
  }
  
  // Use CSS variable for stroke width to follow token-first design system approach
  // This references --icon-stroke-width which is defined in the token stylesheet
  const strokeWidth = 'var(--icon-stroke-width)';
  
  // Build style attribute
  const styleStr = Object.entries(style)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value}`;
    })
    .join('; ');
  
  // Build test ID attribute
  const testIDAttr = testID ? ` data-testid="${testID}"` : '';
  
  // Build style attribute
  const styleAttr = styleStr ? ` style="${styleStr}"` : '';
  
  // Set explicit width/height on SVG for reliable rendering across all contexts
  return `<svg width="${sizePixels}" height="${sizePixels}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${classAttr}" aria-hidden="true"${testIDAttr}${styleAttr}>${svgContent}</svg>`;
}

/**
 * IconBase class for web platform (object-oriented interface).
 * 
 * Provides an object-oriented interface for creating and managing icons.
 * This can be used in vanilla JavaScript/TypeScript contexts or as a foundation
 * for framework-specific implementations.
 * 
 * @example
 * ```typescript
 * // Create an icon instance
 * const icon = new IconBase({ name: 'arrow-right', size: 24 });
 * 
 * // Render to HTML string
 * const html = icon.render();
 * 
 * // Insert into DOM
 * element.innerHTML = icon.render();
 * ```
 */
export class IconBase {
  private props: IconBaseProps;
  
  constructor(props: IconBaseProps) {
    this.props = props;
  }
  
  /**
   * Render the icon as an HTML string.
   * 
   * @returns SVG element as HTML string
   */
  render(): string {
    return createIconBase(this.props);
  }
  
  /**
   * Update icon properties.
   * 
   * @param props - Partial icon properties to update
   */
  update(props: Partial<IconBaseProps>): void {
    this.props = { ...this.props, ...props };
  }
  
  /**
   * Get current icon properties.
   * 
   * @returns Current icon properties
   */
  getProps(): IconBaseProps {
    return { ...this.props };
  }
}

/**
 * Icon-Base Web Component
 * 
 * A native web component that renders inline SVG icons with currentColor inheritance.
 * Follows True Native Architecture with Shadow DOM encapsulation.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <icon-base name="arrow-right" size="24"></icon-base>
 * 
 * <!-- With color override -->
 * <icon-base name="check" size="32" color="color-success"></icon-base>
 * 
 * <!-- With test ID -->
 * <icon-base name="settings" size="24" test-id="settings-icon"></icon-base>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const icon = document.createElement('icon-base') as IconBaseElement;
 * icon.name = 'arrow-right';
 * icon.size = 24;
 * document.body.appendChild(icon);
 * ```
 */
export class IconBaseElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'test-id', 'optical-balance'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback(): void {
    this.render();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * @param _name - Attribute name (unused, prefixed with underscore)
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    // Only re-render if the element is connected to the DOM
    // This prevents errors during initial attribute setup before connectedCallback
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }
  
  // Property getters/setters
  get name(): IconBaseName {
    return (this.getAttribute('name') || 'circle') as IconBaseName;
  }
  
  set name(value: IconBaseName) {
    this.setAttribute('name', value);
  }
  
  get size(): IconBaseSize {
    const sizeAttr = this.getAttribute('size');
    
    // If no size attribute is provided, throw an error
    // This follows the "fail loudly" philosophy to surface issues early during development
    if (!sizeAttr) {
      throw new Error(
        `Missing required "size" attribute on <icon-base>. ` +
        `Valid sizes are: 13, 18, 24, 28, 32, 36, 40, 44, 48.`
      );
    }
    
    const size = parseInt(sizeAttr, 10);
    // Validate size is one of the allowed IconBaseSize values
    const validSizes: IconBaseSize[] = [13, 20, 24, 28, 32, 36, 40, 44, 48];
    
    if (!validSizes.includes(size as IconBaseSize)) {
      throw new Error(
        `Invalid icon size: ${size}. ` +
        `Valid sizes are: ${validSizes.join(', ')}. ` +
        `Ensure you're using a valid IconBaseSize value.`
      );
    }
    
    return size as IconBaseSize;
  }
  
  set size(value: IconBaseSize) {
    this.setAttribute('size', value.toString());
  }
  
  get color(): string {
    return this.getAttribute('color') || 'inherit';
  }
  
  set color(value: string) {
    this.setAttribute('color', value);
  }
  
  get testID(): string | null {
    return this.getAttribute('test-id');
  }
  
  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  /**
   * Get the optical balance state.
   * 
   * When true, applies lighterBlend to the color for optical weight compensation.
   */
  get opticalBalance(): boolean {
    return this.getAttribute('optical-balance') === 'true';
  }
  
  /**
   * Set the optical balance state.
   */
  set opticalBalance(value: boolean) {
    if (value) {
      this.setAttribute('optical-balance', 'true');
    } else {
      this.removeAttribute('optical-balance');
    }
  }
  
  /**
   * Render the component into shadow DOM.
   * 
   * Generates SVG markup with currentColor inheritance and injects it into
   * the shadow DOM. The SVG uses CSS classes for token-based sizing
   * and CSS custom properties for token-based color and stroke width.
   */
  private render(): void {
    const name = this.name;
    const size = this.size;
    const color = this.color;
    const testID = this.testID;
    const opticalBalance = this.opticalBalance;
    
    // Load SVG content
    const svgContent = loadIconSVG(name);
    
    // Map size to CSS class (using icon size token scale)
    const sizeClassMap: Record<IconBaseSize, string> = {
      13: 'icon-base--size-050',
      20: 'icon-base--size-075',
      24: 'icon-base--size-100',
      28: 'icon-base--size-125',  // Note: size125 and size150 both = 28px
      32: 'icon-base--size-200',  // Note: size125, size200, size300 all = 32px
      36: 'icon-base--size-400',
      40: 'icon-base--size-500',
      44: 'icon-base--size-600',
      48: 'icon-base--size-700'
    };
    
    const sizeClass = sizeClassMap[size];
    
    // Determine stroke color based on color prop and optical balance
    // When opticalBalance is true and color is a hex value, apply iconColor()
    // from theme-aware blend utilities to compensate for icons appearing heavier than adjacent text
    // @see Requirements: 10.1, 10.2 - Optical balance using blend utilities
    // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
    let strokeColor: string;
    if (color === 'inherit') {
      strokeColor = 'currentColor';
    } else if (opticalBalance && color.startsWith('#')) {
      // Apply optical balance using iconColor() from theme-aware blend utilities
      // Uses lighterBlend(color, blend.iconLighter) internally (8% lighter)
      // This uses blend utilities instead of CSS filter: brightness() workaround
      strokeColor = blendUtils.iconColor(color);
    } else if (color.startsWith('#')) {
      // Direct hex color without optical balance
      strokeColor = color;
    } else {
      // Token reference becomes CSS custom property
      strokeColor = `var(--${color})`;
    }
    
    // Use CSS variable for stroke width to follow token-first design system approach
    // This references --icon-stroke-width which is defined in the token stylesheet
    const strokeWidth = 'var(--icon-stroke-width)';
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Inline CSS for reliable Shadow DOM styling
    // Inlining avoids relative path issues in different deployment scenarios
    const styles = `
      <style>
        .icon-base {
          display: inline-block;
          vertical-align: middle;
          flex-shrink: 0;
          color: inherit;
        }
        
        .icon-base--size-050 { width: var(--icon-size-050); height: var(--icon-size-050); }
        .icon-base--size-075 { width: var(--icon-size-075); height: var(--icon-size-075); }
        .icon-base--size-100 { width: var(--icon-size-100); height: var(--icon-size-100); }
        .icon-base--size-125 { width: var(--icon-size-125); height: var(--icon-size-125); }
        .icon-base--size-150 { width: var(--icon-size-150); height: var(--icon-size-150); }
        .icon-base--size-200 { width: var(--icon-size-200); height: var(--icon-size-200); }
        .icon-base--size-300 { width: var(--icon-size-300); height: var(--icon-size-300); }
        .icon-base--size-400 { width: var(--icon-size-400); height: var(--icon-size-400); }
        .icon-base--size-500 { width: var(--icon-size-500); height: var(--icon-size-500); }
        .icon-base--size-600 { width: var(--icon-size-600); height: var(--icon-size-600); }
        .icon-base--size-700 { width: var(--icon-size-700); height: var(--icon-size-700); }
        
        @media print {
          .icon-base { color: var(--color-print-default) !important; }
        }
        
        @media (prefers-contrast: high) {
          .icon-base { stroke: currentColor !important; }
        }
      </style>
    `;
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      ${styles}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="${strokeColor}"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-base ${sizeClass} icon-base-${name}"
        aria-hidden="true"${testIDAttr}
      >
        ${svgContent}
      </svg>
    `;
  }
}

/**
 * Register the custom element.
 */
if (!customElements.get('icon-base')) {
  customElements.define('icon-base', IconBaseElement);
}

/**
 * Default export for convenience.
 */
export default IconBaseElement;

// Legacy aliases for backward compatibility
export { createIconBase as createIcon };
export { IconBase as Icon };
