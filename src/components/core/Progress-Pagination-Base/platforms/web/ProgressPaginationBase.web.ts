/**
 * Progress-Pagination-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Simple pagination indicator composing Node-Base primitives (dots only).
 * Supports virtualization for large item counts (>5 items → sliding window).
 * 
 * @module Progress-Pagination-Base/platforms/web
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

import { NodeSize } from '../../../Progress-Indicator-Node-Base/types';
import {
  PAGINATION_BASE_DEFAULTS,
  PAGINATION_MAX_ITEMS,
  derivePaginationNodeState,
  calculateVisibleWindow,
  clampCurrentItem,
} from '../../types';

// Import CSS as string for browser bundle compatibility
import paginationStyles from './ProgressPaginationBase.styles.css';

/**
 * Progress-Pagination-Base Web Component
 * 
 * A native web component that composes Progress-Indicator-Node-Base primitives
 * to create a simple pagination indicator for carousels and multi-page flows.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Composes Node-Base primitives (no connectors, no labels)
 * - All nodes use content='none' (dots only)
 * - Virtualizes when totalItems > 5 (sliding window of 5)
 * - ARIA: role="group" with aria-label reflecting actual position
 * - Validates totalItems ≤ 50 (dev throw, production warn+clamp)
 * 
 * @example
 * ```html
 * <progress-pagination-base total-items="10" current-item="3" size="sm"></progress-pagination-base>
 * ```
 * 
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 */
export class ProgressPaginationBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['total-items', 'current-item', 'size', 'accessibility-label', 'test-id'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  // ============================================================================
  // Property Getters/Setters
  // ============================================================================

  /**
   * Get total number of items.
   * @see Requirements 2.9-2.10
   */
  get totalItems(): number {
    const attr = this.getAttribute('total-items');
    if (attr === null) return 0;
    const val = parseInt(attr, 10);
    return isNaN(val) ? 0 : val;
  }

  set totalItems(value: number) {
    this.setAttribute('total-items', String(value));
  }

  /**
   * Get current active item (1-indexed).
   * @see Requirement 2.11
   */
  get currentItem(): number {
    const attr = this.getAttribute('current-item');
    if (attr === null) return 1;
    const val = parseInt(attr, 10);
    return isNaN(val) ? 1 : val;
  }

  set currentItem(value: number) {
    this.setAttribute('current-item', String(value));
  }

  /**
   * Get size variant.
   * @see Requirement 2.1
   */
  get size(): NodeSize {
    const size = this.getAttribute('size');
    return (size === 'sm' || size === 'md' || size === 'lg') ? size : PAGINATION_BASE_DEFAULTS.size;
  }

  set size(value: NodeSize) {
    this.setAttribute('size', value);
  }

  get accessibilityLabel(): string | null {
    return this.getAttribute('accessibility-label');
  }

  set accessibilityLabel(value: string | null) {
    if (value) {
      this.setAttribute('accessibility-label', value);
    } else {
      this.removeAttribute('accessibility-label');
    }
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

  // ============================================================================
  // Rendering
  // ============================================================================

  /**
   * Render the pagination into shadow DOM.
   * 
   * Rendering logic:
   * 1. Validate totalItems (dev throw, production warn+clamp)
   * 2. Clamp currentItem to valid range
   * 3. Calculate visible window (virtualization if >5 items)
   * 4. Render Node-Base primitives for visible items
   * 5. Apply ARIA role="group" with actual position label
   * 
   * @see Requirements 2.1-2.12, 10.1-10.2, 11.1-11.6
   */
  private render(): void {
    let totalItems = this.totalItems;
    const size = this.size;
    const testID = this.testID;

    // Validation: totalItems > 50
    // @see Requirements 2.9-2.10
    if (totalItems > PAGINATION_MAX_ITEMS) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        throw new Error(
          `Progress-Pagination-Base supports a maximum of ${PAGINATION_MAX_ITEMS} items. ` +
          `Received ${totalItems} items. ` +
          `Consider using a different navigation pattern for larger sets.`
        );
      } else {
        console.warn(
          `Progress-Pagination-Base: Received ${totalItems} items but maximum is ${PAGINATION_MAX_ITEMS}. ` +
          `Rendering first ${PAGINATION_MAX_ITEMS} items only. ` +
          `Consider using a different navigation pattern.`
        );
        totalItems = PAGINATION_MAX_ITEMS;
      }
    }

    // Clamp currentItem to valid range
    // @see Requirement 2.11
    const currentItem = clampCurrentItem(this.currentItem, totalItems);

    // Calculate visible window
    // @see Requirements 2.4-2.8, 9.1-9.6
    const window = calculateVisibleWindow(currentItem, totalItems);

    // ARIA label reflects actual position, not virtualized subset
    // @see Requirements 2.12, 7.1-7.2, 9.7
    const ariaLabel = this.accessibilityLabel || `Page ${currentItem} of ${totalItems}`;

    const containerClasses = [
      'pagination',
      `pagination--${size}`,
    ].join(' ');

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    // Generate Node-Base elements for visible window
    // @see Requirements 11.1-11.6 — Composition contracts
    let nodesHTML = '';
    for (let i = window.start; i <= window.end; i++) {
      const state = derivePaginationNodeState(i, currentItem);
      nodesHTML += `<progress-indicator-node-base state="${state}" size="${size}" content="none"></progress-indicator-node-base>`;
    }

    this._shadowRoot.innerHTML = `
      <style>
        ${paginationStyles}
      </style>
      <div class="${containerClasses}"${testIDAttr} role="group" aria-label="${this.escapeHtml(ariaLabel)}">
        ${nodesHTML}
      </div>
    `;
  }

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

// Register the custom element
if (!customElements.get('progress-pagination-base')) {
  customElements.define('progress-pagination-base', ProgressPaginationBase);
}

export default ProgressPaginationBase;
