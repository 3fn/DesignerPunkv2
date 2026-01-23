/**
 * Badge-Label-Base Component for Web Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Label)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Label-Base
 * 
 * A read-only, non-interactive visual indicator for displaying categorization,
 * status, or metadata text. Follows True Native Architecture with build-time
 * platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Informational: Conveys status or metadata at a glance
 * 
 * Uses <icon-base> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms.
 * 
 * @module Badge-Label-Base/platforms/web
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.1
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

/// <reference lib="dom" />

import { BadgeLabelSize, BADGE_LABEL_DEFAULTS, BADGE_LABEL_SIZE_TOKENS } from '../../types';
import { IconBaseName, IconBaseSize } from '../../../Icon-Base/types';
// Import Icon-Base to ensure it's registered before BadgeLabelBase uses it
import '../../../Icon-Base/platforms/web/IconBase.web';
// Import component token for max-width
import { getBadgeLabelMaxWidth } from '../../tokens';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import badgeStyles from './BadgeLabelBase.styles.css';

/**
 * Badge-Label-Base Web Component
 * 
 * A native web component that renders a label badge with optional leading icon.
 * Uses Shadow DOM for style encapsulation and token-based styling via CSS
 * custom properties.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties
 * - Supports three size variants (sm, md, lg)
 * - Optional leading icon via Icon-Base integration
 * - Truncation with title attribute for full text access
 * - Non-interactive: no tabindex, no click handlers
 * - WCAG 2.1 AA compliant:
 *   - Color contrast 4.5:1 minimum
 *   - Text scaling support
 *   - Screen reader accessible
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <badge-label-base label="Draft"></badge-label-base>
 * 
 * <!-- With size variant -->
 * <badge-label-base label="Status" size="sm"></badge-label-base>
 * 
 * <!-- With icon -->
 * <badge-label-base label="Approved" icon="check" size="md"></badge-label-base>
 * 
 * <!-- With truncation -->
 * <badge-label-base label="Very long category name" truncate="true"></badge-label-base>
 * 
 * <!-- With test ID -->
 * <badge-label-base label="Draft" test-id="status-badge"></badge-label-base>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const badge = document.createElement('badge-label-base') as BadgeLabelBase;
 * badge.label = 'Draft';
 * badge.size = 'md';
 * badge.icon = 'check';
 * document.body.appendChild(badge);
 * ```
 * 
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.1
 */
export class BadgeLabelBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): string[] {
    return ['label', 'size', 'icon', 'truncate', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    // @see Requirement 5.1 - Web component with Shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render of the badge component.
   */
  connectedCallback(): void {
    this.render();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * Triggers re-render to reflect the new attribute value.
   * Only re-renders if the element is connected to the DOM.
   * 
   * @param _name - Attribute name (unused, prefixed with underscore)
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
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
   * Get the badge label text.
   * 
   * @returns Label text or empty string
   * @see Requirement 1.1 - label prop renders text content
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }
  
  /**
   * Set the badge label text.
   */
  set label(value: string) {
    this.setAttribute('label', value);
  }
  
  /**
   * Get the badge size variant.
   * 
   * @returns Size variant (defaults to 'md')
   * @see Requirements 1.2, 1.3 - size prop with default
   */
  get size(): BadgeLabelSize {
    const size = this.getAttribute('size');
    return (size === 'sm' || size === 'md' || size === 'lg') ? size : BADGE_LABEL_DEFAULTS.size;
  }
  
  /**
   * Set the badge size variant.
   */
  set size(value: BadgeLabelSize) {
    this.setAttribute('size', value);
  }
  
  /**
   * Get the icon name.
   * 
   * @returns Icon name or null
   * @see Requirement 1.4 - optional leading icon
   */
  get icon(): IconBaseName | null {
    return this.getAttribute('icon') as IconBaseName | null;
  }
  
  /**
   * Set the icon name.
   */
  set icon(value: IconBaseName | null) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }
  
  /**
   * Get the truncation state.
   * 
   * @returns true if truncation enabled, false otherwise
   * @see Requirements 1.5, 1.7 - truncate prop with default
   */
  get truncate(): boolean {
    return this.getAttribute('truncate') === 'true';
  }
  
  /**
   * Set the truncation state.
   */
  set truncate(value: boolean) {
    if (value) {
      this.setAttribute('truncate', 'true');
    } else {
      this.removeAttribute('truncate');
    }
  }
  
  /**
   * Get the test ID.
   * 
   * @returns Test ID or null
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
   * Render the component into shadow DOM.
   * 
   * Generates the badge structure with appropriate size, icon, and truncation.
   * Uses external CSS file for token-based styling.
   * 
   * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.1
   */
  private render(): void {
    const label = this.label;
    const size = this.size;
    const icon = this.icon;
    const truncate = this.truncate;
    const testID = this.testID;
    
    // Get token values for this size
    const sizeTokens = BADGE_LABEL_SIZE_TOKENS[size];
    const iconSize = sizeTokens.iconSize as IconBaseSize;
    
    // Generate CSS classes
    const badgeClasses = [
      'badge-label',
      `badge-label--${size}`,
    ].join(' ');
    
    // Generate text classes
    const textClasses = [
      'badge-label__text',
      truncate ? 'badge-label__text--truncate' : '',
    ].filter(Boolean).join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';
    
    // Generate title attribute for truncated text
    // @see Requirement 1.6 - title attribute when truncated
    const titleAttr = truncate ? ` title="${this.escapeHtml(label)}"` : '';
    
    // Generate icon HTML if icon is provided
    // @see Requirement 1.4 - optional leading icon via Icon-Base
    // @see Requirement 6.2 - icon marked as decorative (aria-hidden in Icon-Base)
    const iconHTML = icon ? `
      <span class="badge-label__icon" aria-hidden="true">
        <icon-base name="${icon}" size="${iconSize}" color="inherit"></icon-base>
      </span>
    ` : '';
    
    // Get max-width from component token
    const maxWidth = getBadgeLabelMaxWidth();
    
    // Render shadow DOM content
    // @see Requirement 1.8 - non-interactive (no tabindex, no click handlers)
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        /* Override max-width with component token value */
        .badge-label__text--truncate {
          max-width: ${maxWidth}px;
        }
        ${badgeStyles}
      </style>
      <span class="${badgeClasses}"${testIDAttr}${titleAttr}>
        ${iconHTML}
        <span class="${textClasses}">${this.escapeHtml(label)}</span>
      </span>
    `;
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
}

/**
 * Register the custom element.
 * 
 * Makes <badge-label-base> available as a custom HTML element.
 */
if (!customElements.get('badge-label-base')) {
  customElements.define('badge-label-base', BadgeLabelBase);
}

/**
 * Default export for convenience.
 */
export default BadgeLabelBase;

