/**
 * Container-Base Web Component
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Web platform implementation using Custom Elements with Shadow DOM.
 * Provides style encapsulation and semantic HTML support.
 * 
 * Uses blend utilities for hover state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with iOS and Android implementations.
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/010-container-component/design.md for complete design
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/031-blend-infrastructure-implementation for blend utilities
 * @see Requirements 10.1, 11.1, 11.2
 */

import { buildContainerBaseStyles } from './token-mapping';
import type { 
  PaddingValue, 
  BorderValue, 
  BorderRadiusValue, 
  LayeringValue,
  SemanticHTMLElement
} from '../../types';
import type { 
  OpacityTokenName,
  ColorTokenName,
  ShadowTokenName
} from '../../../../../types/generated/TokenTypes';
// Import theme-aware blend utilities for hover state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

/**
 * Base styles for Container-Base component
 * 
 * These styles provide the foundation for Container-Base's visual appearance.
 * All token-based styling is applied via the buildContainerBaseStyles function.
 * 
 * Hover state uses blend utilities for cross-platform consistency:
 * - darkerBlend(color.surface, blend.hoverDarker) - 8% darker
 * 
 * @see styles.css for detailed documentation of each style rule
 */
const BASE_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
  }
  
  .container-base {
    box-sizing: border-box;
    display: block;
    width: 100%;
    transition: background-color var(--motion-focus-transition-duration) var(--motion-focus-transition-easing);
  }
  
  .container-base--hoverable:hover {
    background-color: var(--_container-base-hover-bg, inherit);
  }
  
  .container-base:focus {
    outline: var(--border-emphasis) solid var(--color-primary);
    outline-offset: var(--space-grouped-minimal);
  }
  
  .container-base:focus:not(:focus-visible) {
    outline: none;
  }
  
  .container-base:focus-visible {
    outline: var(--border-emphasis) solid var(--color-primary);
    outline-offset: var(--space-grouped-minimal);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .container-base {
      transition: none !important;
      animation: none !important;
    }
  }
  
  @media (prefers-contrast: high) {
    .container-base {
      border-width: var(--border-emphasis);
    }
  }
  
  @media print {
    .container-base {
      box-shadow: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * Container-Base web component class
 * 
 * Custom element that renders a container with design system token-based styling.
 * Uses Shadow DOM for style encapsulation and supports semantic HTML elements.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <container-base padding="200" background="color.surface">
 *   <p>Content</p>
 * </container-base>
 * 
 * <!-- With multiple styling props -->
 * <container-base 
 *   padding="300"
 *   background="color.primary"
 *   shadow="shadow.container"
 *   border-radius="normal"
 *   layering="navigation"
 * >
 *   <p>Content</p>
 * </container-base>
 * 
 * <!-- Semantic HTML -->
 * <container-base semantic="article" accessibility-label="Blog post">
 *   <p>Content</p>
 * </container-base>
 * ```
 */
export class ContainerBaseWeb extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  // Theme-aware blend utilities instance
  // Uses getBlendUtilities() factory for consistent state styling
  // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
  private _blendUtils: BlendUtilitiesResult;
  
  // Cached blend color for hover state
  private _hoverColor: string = '';

  /**
   * Observed attributes for the custom element
   * 
   * These attributes trigger attributeChangedCallback when modified.
   * Includes all Container-Base props that can be set via HTML attributes.
   */
  static get observedAttributes(): string[] {
    return [
      'padding',
      'background',
      'shadow',
      'border',
      'border-radius',
      'opacity',
      'layering',
      'semantic',
      'accessibility-label',
      'hoverable'
    ];
  }

  constructor() {
    super();
    // Attach Shadow DOM with open mode for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
    this._blendUtils = getBlendUtilities();
  }

  /**
   * Called when element is inserted into the DOM
   * 
   * Lifecycle method that triggers initial render.
   * Calculates blend colors from CSS custom properties.
   */
  connectedCallback(): void {
    this._calculateBlendColors();
    this.render();
  }
  
  /**
   * Calculate blend colors from CSS custom properties.
   * 
   * Reads base colors from CSS custom properties and applies theme-aware blend
   * utilities to generate hover state color.
   * 
   * Uses getBlendUtilities() factory functions instead of direct blend calculations
   * for cross-platform consistency with iOS and Android implementations.
   * 
   * State color mappings:
   * - Hover: darkerBlend(color.surface, blend.hoverDarker) - 8% darker
   * 
   * @see Requirements: 9.1 - Container hover state
   * @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get surface color from CSS custom properties for hover state
    // Use background prop if set, otherwise default to surface color
    const background = this.getAttribute('background');
    let baseColor = '';
    
    if (background) {
      // Convert token name to CSS custom property format
      const cssVarName = `--${background.replace(/\./g, '-')}`;
      baseColor = computedStyle.getPropertyValue(cssVarName).trim();
    }
    
    // Fallback to surface color if no background or couldn't resolve
    if (!baseColor) {
      baseColor = computedStyle.getPropertyValue('--color-surface').trim();
    }
    
    // If still no color, use canvas color token (white100)
    if (!baseColor) {
      baseColor = computedStyle.getPropertyValue('--color-canvas').trim();
    }
    
    // Final fallback - use background color token
    // If tokens are not loaded, this will result in an empty string
    // which is acceptable as the hover effect simply won't apply
    if (!baseColor) {
      baseColor = computedStyle.getPropertyValue('--color-background').trim();
    }
    
    // If no color could be resolved from tokens, skip hover color calculation
    // This follows the "fail loudly" philosophy - if tokens aren't loaded,
    // the hover effect won't work, which is visible during development
    if (!baseColor) {
      this._hoverColor = '';
      return;
    }
    
    // Calculate hover color using theme-aware blend utilities
    // Uses semantic convenience function from getBlendUtilities()
    // @see Requirements: 9.1 - Hover uses darkerBlend(color.surface, blend.hoverDarker)
    this._hoverColor = this._blendUtils.hoverColor(baseColor);
  }

  /**
   * Called when an observed attribute changes
   * 
   * Triggers re-render when any observed attribute is modified.
   * Recalculates blend colors when background changes.
   * 
   * @param name - Attribute name that changed
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Only re-render if the value actually changed
    if (oldValue !== newValue) {
      // Recalculate blend colors if background changed
      if (name === 'background') {
        this._calculateBlendColors();
      }
      this.render();
    }
  }

  /**
   * Render the container with current attributes
   * 
   * Builds the Shadow DOM structure with:
   * - Style element with token-based CSS
   * - Semantic HTML element (or div by default)
   * - Slot for child content
   * - Hover state support via blend utilities
   */
  private render(): void {
    // Get attribute values
    const padding = this.getAttribute('padding') as PaddingValue | null;
    const background = this.getAttribute('background') as ColorTokenName | null;
    const shadow = this.getAttribute('shadow') as ShadowTokenName | null;
    const border = this.getAttribute('border') as BorderValue | null;
    const borderRadius = this.getAttribute('border-radius') as BorderRadiusValue | null;
    const opacity = this.getAttribute('opacity') as OpacityTokenName | null;
    const layering = this.getAttribute('layering') as LayeringValue | null;
    const semantic = (this.getAttribute('semantic') as SemanticHTMLElement) || 'div';
    const accessibilityLabel = this.getAttribute('accessibility-label');
    const hoverable = this.getAttribute('hoverable') === 'true';

    // Build CSS styles from attributes
    const styles = this.buildStyles({
      padding,
      background,
      shadow,
      border,
      borderRadius,
      opacity,
      layering
    });

    // Build accessibility attributes
    // Note: No need to escape - the browser automatically escapes attribute values
    // when parsing HTML strings. Escaping would result in double-encoding.
    const accessibilityAttrs = accessibilityLabel 
      ? `aria-label="${accessibilityLabel.replace(/"/g, '&quot;')}"` 
      : '';
    
    // Build class names including hoverable state
    const containerClasses = ['container-base'];
    if (hoverable) {
      containerClasses.push('container-base--hoverable');
    }
    
    // Generate blend color CSS custom property for hover state
    // This is a component-specific calculated value (not a design token)
    // Using _container-base prefix to distinguish from design token references
    const hoverColorStyle = hoverable ? `--_container-base-hover-bg: ${this._hoverColor};` : '';

    // Render Shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>
        ${BASE_STYLES}
        
        .container-base {
          ${styles}
        }
      </style>
      <${semantic} class="${containerClasses.join(' ')}" ${accessibilityAttrs} style="${hoverColorStyle}">
        <slot></slot>
      </${semantic}>
    `;
  }

  /**
   * Build CSS styles from component props
   * 
   * Maps prop values to CSS custom properties that reference design system tokens.
   * Only includes styles for props that are actually set.
   * 
   * Uses the token-mapping module for consistent token-to-CSS conversion.
   * 
   * @param props - Object containing prop values
   * @returns CSS string with token-based styles
   */
  private buildStyles(props: {
    padding: PaddingValue | null;
    background: ColorTokenName | null;
    shadow: ShadowTokenName | null;
    border: BorderValue | null;
    borderRadius: BorderRadiusValue | null;
    opacity: OpacityTokenName | null;
    layering: LayeringValue | null;
  }): string {
    return buildContainerBaseStyles(props);
  }

}

/**
 * Register the custom element
 * 
 * Defines the 'container-base' custom element that can be used in HTML.
 * Follows Stemma System naming convention (lowercase with hyphens).
 */
if (!customElements.get('container-base')) {
  customElements.define('container-base', ContainerBaseWeb);
}
