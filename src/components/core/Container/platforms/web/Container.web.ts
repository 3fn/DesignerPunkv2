/**
 * Container Web Component
 * 
 * Web platform implementation using Custom Elements with Shadow DOM.
 * Provides style encapsulation and semantic HTML support.
 * 
 * @see .kiro/specs/010-container-component/design.md for complete design
 * @see Requirements 10.1, 11.1, 11.2
 */

import { buildContainerStyles } from './token-mapping';
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

/**
 * Base styles for Container component
 * 
 * These styles provide the foundation for Container's visual appearance.
 * All token-based styling is applied via the buildContainerStyles function.
 * 
 * @see styles.css for detailed documentation of each style rule
 */
const BASE_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
  }
  
  .container {
    box-sizing: border-box;
    display: block;
    width: 100%;
  }
  
  .container:focus {
    outline: var(--border-border-emphasis) solid var(--color-primary);
    outline-offset: var(--space-grouped-minimal);
  }
  
  .container:focus:not(:focus-visible) {
    outline: none;
  }
  
  .container:focus-visible {
    outline: var(--border-border-emphasis) solid var(--color-primary);
    outline-offset: var(--space-grouped-minimal);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .container {
      transition: none !important;
      animation: none !important;
    }
  }
  
  @media (prefers-contrast: high) {
    .container {
      border-width: var(--border-border-emphasis);
    }
  }
  
  @media print {
    .container {
      box-shadow: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * Container web component class
 * 
 * Custom element that renders a container with design system token-based styling.
 * Uses Shadow DOM for style encapsulation and supports semantic HTML elements.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <dp-container padding="200" background="color.surface">
 *   <p>Content</p>
 * </dp-container>
 * 
 * <!-- With multiple styling props -->
 * <dp-container 
 *   padding="300"
 *   background="color.primary"
 *   shadow="shadow.container"
 *   border-radius="normal"
 *   layering="navigation"
 * >
 *   <p>Content</p>
 * </dp-container>
 * 
 * <!-- Semantic HTML -->
 * <dp-container semantic="article" accessibility-label="Blog post">
 *   <p>Content</p>
 * </dp-container>
 * ```
 */
export class ContainerWeb extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  /**
   * Observed attributes for the custom element
   * 
   * These attributes trigger attributeChangedCallback when modified.
   * Includes all Container props that can be set via HTML attributes.
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
      'accessibility-label'
    ];
  }

  constructor() {
    super();
    // Attach Shadow DOM with open mode for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  /**
   * Called when element is inserted into the DOM
   * 
   * Lifecycle method that triggers initial render.
   */
  connectedCallback(): void {
    this.render();
  }

  /**
   * Called when an observed attribute changes
   * 
   * Triggers re-render when any observed attribute is modified.
   * 
   * @param name - Attribute name that changed
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Only re-render if the value actually changed
    if (oldValue !== newValue) {
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

    // Render Shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>
        ${BASE_STYLES}
        
        .container {
          ${styles}
        }
      </style>
      <${semantic} class="container" ${accessibilityAttrs}>
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
    return buildContainerStyles(props);
  }

}

/**
 * Register the custom element
 * 
 * Defines the 'dp-container' custom element that can be used in HTML.
 * The 'dp-' prefix follows the DesignerPunk naming convention.
 */
if (!customElements.get('dp-container')) {
  customElements.define('dp-container', ContainerWeb);
}
