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
import { IconProps } from '../../types';
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
export declare function createIcon(props: IconProps): string;
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
export declare class Icon {
    private props;
    constructor(props: IconProps);
    /**
     * Render the icon as an HTML string.
     *
     * @returns SVG element as HTML string
     */
    render(): string;
    /**
     * Update icon properties.
     *
     * @param props - Partial icon properties to update
     */
    update(props: Partial<IconProps>): void;
    /**
     * Get current icon properties.
     *
     * @returns Current icon properties
     */
    getProps(): IconProps;
}
/**
 * Default export for convenience.
 */
export default Icon;
//# sourceMappingURL=Icon.web.d.ts.map