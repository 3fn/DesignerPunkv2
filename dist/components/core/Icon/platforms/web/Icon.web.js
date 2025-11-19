"use strict";
/**
 * Icon Component for Web Platform
 *
 * Renders inline SVG icons with currentColor inheritance for automatic color matching.
 * Part of the DesignerPunk Icon System infrastructure.
 *
 * Note: This is a TypeScript implementation that provides the foundation for React integration.
 * When React is added to the project, this can be converted to a React component.
 *
 * @module Icon/platforms/web
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
exports.createIcon = createIcon;
/**
 * Load SVG content for a given icon name.
 *
 * Maps icon names to their SVG inner content (paths, lines, etc.) for inline rendering.
 *
 * @param name - Icon name to load
 * @returns SVG inner content as string
 */
function loadIconSVG(name) {
    // Map of icon names to their SVG content
    // In a production build system, this could be auto-generated from the assets directory
    const iconContent = {
        'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
        'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
        'arrow-up': '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
        'arrow-down': '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
        'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
        'check': '<polyline points="20 6 9 17 4 12"></polyline>',
        'x': '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
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
 * const iconHTML = createIcon({ name: 'arrow-right', size: 24 });
 *
 * // With custom styling
 * const styledIcon = createIcon({
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
function createIcon(props) {
    const { name, size, className = '', style = {}, testID, color = 'inherit' } = props;
    // Load SVG content based on icon name
    const svgContent = loadIconSVG(name);
    // Build class attribute
    const classAttr = `icon icon-${name} ${className}`.trim();
    // Determine stroke color based on color prop
    const strokeColor = color === 'inherit'
        ? 'currentColor'
        : `var(--${color})`; // Token reference becomes CSS custom property
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
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${classAttr}" aria-hidden="true"${testIDAttr}${styleAttr}>${svgContent}</svg>`;
}
/**
 * Icon class for web platform (object-oriented interface).
 *
 * Provides an object-oriented interface for creating and managing icons.
 * This can be used in vanilla JavaScript/TypeScript contexts or as a foundation
 * for framework-specific implementations.
 *
 * @example
 * ```typescript
 * // Create an icon instance
 * const icon = new Icon({ name: 'arrow-right', size: 24 });
 *
 * // Render to HTML string
 * const html = icon.render();
 *
 * // Insert into DOM
 * element.innerHTML = icon.render();
 * ```
 */
class Icon {
    constructor(props) {
        this.props = props;
    }
    /**
     * Render the icon as an HTML string.
     *
     * @returns SVG element as HTML string
     */
    render() {
        return createIcon(this.props);
    }
    /**
     * Update icon properties.
     *
     * @param props - Partial icon properties to update
     */
    update(props) {
        this.props = { ...this.props, ...props };
    }
    /**
     * Get current icon properties.
     *
     * @returns Current icon properties
     */
    getProps() {
        return { ...this.props };
    }
}
exports.Icon = Icon;
/**
 * Default export for convenience.
 */
exports.default = Icon;
//# sourceMappingURL=Icon.web.js.map