/**
 * Badge-Count-Base Component for Web Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Count)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Base
 * 
 * A read-only, non-interactive visual indicator for displaying numeric values
 * like notification counts or quantities. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Shape-adaptive: Circular for single digits, pill for multi-digit
 * - Informational: Conveys counts or quantities at a glance
 * 
 * @module Badge-Count-Base/platforms/web
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.1
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

/// <reference lib="dom" />

import { BadgeCountSize, BADGE_COUNT_DEFAULTS } from '../../types';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import badgeStyles from './BadgeCountBase.styles.css';

/**
 * Badge-Count-Base Web Component
 * 
 * A native web component that renders a count badge with automatic shape
 * adaptation (circular for single digits, pill for multi-digit).
 * Uses Shadow DOM for style encapsulation and token-based styling via CSS
 * custom properties.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties
 * - Supports three size variants (sm, md, lg)
 * - Automatic circular/pill shape based on digit count
 * - Max truncation with "[max]+" display
 * - showZero behavior for zero count handling
 * - Non-interactive: no tabindex, no click handlers
 * - WCAG 2.1 AA compliant:
 *   - Color contrast 4.5:1 minimum
 *   - Text scaling support
 *   - Screen reader accessible
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <badge-count-base count="5"></badge-count-base>
 * 
 * <!-- With size variant -->
 * <badge-count-base count="3" size="sm"></badge-count-base>
 * 
 * <!-- With max truncation -->
 * <badge-count-base count="150" max="99"></badge-count-base>
 * 
 * <!-- Show zero -->
 * <badge-count-base count="0" show-zero="true"></badge-count-base>
 * 
 * <!-- With test ID -->
 * <badge-count-base count="5" test-id="notification-badge"></badge-count-base>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const badge = document.createElement('badge-count-base') as BadgeCountBase;
 * badge.count = 5;
 * badge.size = 'md';
 * badge.max = 99;
 * document.body.appendChild(badge);
 * ```
 * 
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.1
 */
export class BadgeCountBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): string[] {
    return ['count', 'max', 'show-zero', 'size', 'test-id'];
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
   * Get the badge count value.
   * 
   * @returns Count value (defaults to 0 if invalid)
   * @see Requirement 2.1 - count prop renders numeric value
   */
  get count(): number {
    const countAttr = this.getAttribute('count');
    if (countAttr === null) return 0;
    
    const parsed = parseInt(countAttr, 10);
    // Handle NaN by returning 0
    // @see Error Handling in design.md - count is NaN → Render 0
    if (isNaN(parsed)) return 0;
    
    // Handle negative by returning absolute value or 0
    // @see Error Handling in design.md - count is negative → Render absolute value or 0
    return Math.abs(parsed);
  }
  
  /**
   * Set the badge count value.
   */
  set count(value: number) {
    this.setAttribute('count', String(value));
  }
  
  /**
   * Get the maximum value before truncation.
   * 
   * @returns Max value (defaults to 99)
   * @see Requirements 2.4, 2.5 - max prop with default
   */
  get max(): number {
    const maxAttr = this.getAttribute('max');
    if (maxAttr === null) return BADGE_COUNT_DEFAULTS.max;
    
    const parsed = parseInt(maxAttr, 10);
    // Handle invalid max by using default
    // @see Error Handling in design.md - max is 0 or negative → Use default (99)
    if (isNaN(parsed) || parsed <= 0) return BADGE_COUNT_DEFAULTS.max;
    
    return parsed;
  }
  
  /**
   * Set the maximum value before truncation.
   */
  set max(value: number) {
    this.setAttribute('max', String(value));
  }
  
  /**
   * Get the showZero state.
   * 
   * @returns true if badge should show when count is 0, false otherwise
   * @see Requirements 2.6, 2.7, 2.8 - showZero prop with default
   */
  get showZero(): boolean {
    return this.getAttribute('show-zero') === 'true';
  }
  
  /**
   * Set the showZero state.
   */
  set showZero(value: boolean) {
    if (value) {
      this.setAttribute('show-zero', 'true');
    } else {
      this.removeAttribute('show-zero');
    }
  }
  
  /**
   * Get the badge size variant.
   * 
   * @returns Size variant (defaults to 'md')
   * @see Requirements 2.9, 2.10 - size prop with default
   */
  get size(): BadgeCountSize {
    const size = this.getAttribute('size');
    return (size === 'sm' || size === 'md' || size === 'lg') ? size : BADGE_COUNT_DEFAULTS.size;
  }
  
  /**
   * Set the badge size variant.
   */
  set size(value: BadgeCountSize) {
    this.setAttribute('size', value);
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
   * Get the display text for the count.
   * 
   * Handles max truncation logic: if count > max, displays "[max]+".
   * 
   * @returns Display text for the count
   * @see Requirement 2.4 - max truncation logic
   */
  private getDisplayText(): string {
    const count = this.count;
    const max = this.max;
    
    // @see Requirement 2.4 - count exceeds max → display "[max]+"
    if (count > max) {
      return `${max}+`;
    }
    
    return String(count);
  }
  
  /**
   * Determine if the badge should be visible.
   * 
   * @returns true if badge should render, false if hidden
   * @see Requirements 2.6, 2.7 - showZero behavior
   */
  private shouldRender(): boolean {
    const count = this.count;
    const showZero = this.showZero;
    
    // @see Requirement 2.6 - count is 0 AND showZero is false → NOT render
    if (count === 0 && !showZero) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Render the component into shadow DOM.
   * 
   * Generates the badge structure with appropriate size and shape.
   * Uses external CSS file for token-based styling.
   * 
   * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.1
   */
  private render(): void {
    // Check if badge should be rendered
    // @see Requirements 2.6, 2.7 - showZero behavior
    if (!this.shouldRender()) {
      this._shadowRoot.innerHTML = '';
      return;
    }
    
    const size = this.size;
    const testID = this.testID;
    const displayText = this.getDisplayText();
    
    // Generate CSS classes
    const badgeClasses = [
      'badge-count',
      `badge-count--${size}`,
    ].join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';
    
    // Render shadow DOM content
    // @see Requirement 2.11 - non-interactive (no tabindex, no click handlers)
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        :host([hidden]) {
          display: none;
        }
        ${badgeStyles}
      </style>
      <span class="${badgeClasses}"${testIDAttr}>
        <span class="badge-count__text">${this.escapeHtml(displayText)}</span>
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
 * Makes <badge-count-base> available as a custom HTML element.
 */
if (!customElements.get('badge-count-base')) {
  customElements.define('badge-count-base', BadgeCountBase);
}

/**
 * Default export for convenience.
 */
export default BadgeCountBase;
