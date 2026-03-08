/**
 * Progress-Pagination-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Simple pagination indicator composing Node-Base primitives (dots only).
 * Renders all dots with a fixed-width viewport and translateX track centering.
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
 * - Renders all dots; fixed-width viewport with translateX centering
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
  private _container: HTMLDivElement | null = null;
  private _track: HTMLDivElement | null = null;
  private _nodes: HTMLElement[] = [];
  private _initialized = false;

  static get observedAttributes(): string[] {
    return ['total-items', 'current-item', 'size', 'accessibility-label', 'test-id'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    if (!this._initialized) {
      this._setup();
      this._initialized = true;
    }
    this._render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) {
      this._render();
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
  // DOM Setup & Rendering
  // ============================================================================

  /**
   * One-time DOM setup: create style, container, and initial node elements.
   */
  private _setup(): void {
    const style = document.createElement('style');
    style.textContent = paginationStyles;
    this._shadowRoot.appendChild(style);

    this._container = document.createElement('div');
    this._container.setAttribute('role', 'group');
    this._shadowRoot.appendChild(this._container);

    this._track = document.createElement('div');
    this._track.className = 'pagination__track';
    this._container.appendChild(this._track);
  }

  /**
   * Incremental render: update container and node elements.
   * 
   * Renders all dots (up to 50). The track is translated so the
   * current dot is centered in the fixed-width viewport, clamped
   * at the edges to avoid empty space.
   * 
   * @see Requirements 2.1-2.12, 10.1-10.2, 11.1-11.6
   */
  private _render(): void {
    if (!this._container || !this._track) return;

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

    const currentItem = clampCurrentItem(this.currentItem, totalItems);

    // Render all dots
    while (this._nodes.length < totalItems) {
      const node = document.createElement('progress-indicator-node-base');
      this._track.appendChild(node);
      this._nodes.push(node);
    }
    while (this._nodes.length > totalItems) {
      const node = this._nodes.pop()!;
      this._track.removeChild(node);
    }

    // Update node attributes
    for (let i = 0; i < totalItems; i++) {
      const itemIndex = i + 1;
      const node = this._nodes[i];
      node.setAttribute('state', derivePaginationNodeState(itemIndex, currentItem));
      node.setAttribute('size', size);
      node.setAttribute('content', 'none');
      node.setAttribute('sizing', 'scale');
    }

    // Read sizing constants from CSS custom properties (token-driven)
    const cs = getComputedStyle(this);
    const stride = parseFloat(cs.getPropertyValue(`--progress-node-size-${size}-current`));
    const gap = parseFloat(cs.getPropertyValue(size === 'lg' ? '--space-grouped-normal' : '--space-grouped-tight'));
    const padding = parseFloat(cs.getPropertyValue(size === 'lg' ? '--space-inset-150' : '--space-inset-100'));

    // Viewport shows max 5 dots
    const maxVisible = Math.min(totalItems, 5);
    const contentWidth = (maxVisible * stride) + ((maxVisible - 1) * gap);
    this._container.style.width = `${contentWidth + (padding * 2)}px`;
    this._container.style.boxSizing = 'border-box';

    // Center the current dot via translateX on the track, clamped at edges
    const trackWidth = (totalItems * stride) + ((totalItems - 1) * gap);
    const activeCenter = ((currentItem - 1) * (stride + gap)) + (stride / 2);
    let targetX = (contentWidth / 2) - activeCenter;

    // Clamp: track can't go past start or end
    const minX = contentWidth - trackWidth;
    targetX = Math.min(0, Math.max(minX, targetX));

    const isInitial = !this._container.dataset.rendered;
    const reduceMotion = typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isInitial || reduceMotion) {
      this._track.style.transition = 'none';
    } else {
      this._track.style.transition = 'transform var(--motion-settle-transition-duration) var(--motion-settle-transition-easing)';
    }
    this._track.style.transform = `translateX(${targetX}px)`;
    this._container.dataset.rendered = '1';

    // Update container
    this._container.className = `pagination pagination--${size}`;

    const ariaLabel = this.accessibilityLabel || `Page ${currentItem} of ${totalItems}`;
    this._container.setAttribute('aria-label', this.escapeHtml(ariaLabel));

    if (testID) {
      this._container.setAttribute('data-testid', this.escapeHtml(testID));
    } else {
      this._container.removeAttribute('data-testid');
    }
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
