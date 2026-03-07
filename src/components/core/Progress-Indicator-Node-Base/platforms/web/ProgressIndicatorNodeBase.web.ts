/**
 * Progress-Indicator-Node-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Node-Base
 * 
 * Individual indicator element with state-based visual treatment.
 * Renders as a circular node with color, size, and content determined by state.
 * 
 * @module Progress-Indicator-Node-Base/platforms/web
 * @see Requirements: 1.1-1.5, 12.1-12.16
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

import { NodeState, NodeSize, NodeContent, NODE_BASE_DEFAULTS } from '../../types';

// Import CSS as string for browser bundle compatibility
import nodeStyles from './ProgressIndicatorNodeBase.styles.css';

/**
 * Checkmark SVG path for completed nodes.
 * Uses Feather Icons check path for consistency with Icon-Base.
 */
const CHECKMARK_SVG = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

/**
 * Progress-Indicator-Node-Base Web Component
 * 
 * A native web component that renders a circular indicator node with
 * state-based colors, size emphasis for current state, and optional content.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties
 * - Supports 4 states: incomplete, current, completed, error
 * - Supports 3 sizes: sm (12px), md (16px), lg (24px)
 * - Current state applies +4px size emphasis
 * - sm size always renders as dot (content ignored)
 * - Transitions respect prefers-reduced-motion
 * 
 * @example
 * ```html
 * <progress-indicator-node-base state="current" size="md"></progress-indicator-node-base>
 * <progress-indicator-node-base state="completed" size="lg" content="checkmark"></progress-indicator-node-base>
 * ```
 * 
 * @see Requirements: 1.1-1.5, 12.1-12.16
 */
export class ProgressIndicatorNodeBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _node: HTMLSpanElement | null = null;
  private _initialized = false;

  static get observedAttributes(): string[] {
    return ['state', 'size', 'content', 'icon', 'test-id', 'sizing'];
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
   * Get the node state.
   * @see Requirement 1.1 - Four states
   */
  get state(): NodeState {
    const state = this.getAttribute('state');
    const valid: NodeState[] = ['incomplete', 'current', 'completed', 'error'];
    return valid.includes(state as NodeState) ? (state as NodeState) : 'incomplete';
  }

  set state(value: NodeState) {
    this.setAttribute('state', value);
  }

  /**
   * Get the node size.
   * @see Requirement 1.2 - Three sizes
   */
  get size(): NodeSize {
    const size = this.getAttribute('size');
    return (size === 'sm' || size === 'md' || size === 'lg') ? size : NODE_BASE_DEFAULTS.size;
  }

  set size(value: NodeSize) {
    this.setAttribute('size', value);
  }

  /**
   * Get the content type.
   * @see Requirements 1.3-1.4 - Content per size
   */
  get content(): NodeContent {
    const content = this.getAttribute('content');
    const valid: NodeContent[] = ['none', 'checkmark', 'icon'];
    return valid.includes(content as NodeContent) ? (content as NodeContent) : NODE_BASE_DEFAULTS.content;
  }

  set content(value: NodeContent) {
    this.setAttribute('content', value);
  }

  /**
   * Get the icon name (when content='icon').
   */
  get icon(): string | null {
    return this.getAttribute('icon');
  }

  set icon(value: string | null) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
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
   * One-time DOM setup: create style and persistent node span.
   */
  private _setup(): void {
    const style = document.createElement('style');
    style.textContent = nodeStyles;
    this._shadowRoot.appendChild(style);

    this._node = document.createElement('span');
    this._node.setAttribute('role', 'presentation');
    this._node.setAttribute('aria-hidden', 'true');
    this._shadowRoot.appendChild(this._node);
  }

  /**
   * Incremental render: update class and inner content on persistent node.
   * 
   * @see Requirements 1.1-1.5, 12.1-12.16
   */
  private _render(): void {
    if (!this._node) return;

    const state = this.state;
    const size = this.size;
    const content = this.content;
    const iconName = this.icon;
    const testID = this.testID;

    // sm size always renders as dot regardless of content prop
    // @see Requirement 1.3
    const effectiveContent = size === 'sm' ? 'none' : content;

    this._node.className = `node node--${state} node--${size}`;

    if (testID) {
      this._node.setAttribute('data-testid', this.escapeHtml(testID));
    } else {
      this._node.removeAttribute('data-testid');
    }

    // Generate inner content HTML
    let innerHTML = '';
    if (size === 'sm') {
      innerHTML = '<span class="node__dot"></span>';
    } else if (effectiveContent === 'checkmark') {
      innerHTML = `<span class="node__content">${CHECKMARK_SVG}</span>`;
    } else if (effectiveContent === 'icon' && iconName) {
      innerHTML = `<span class="node__content"><icon-base name="${this.escapeHtml(iconName)}" size="${size === 'md' ? 13 : 20}" color="inherit"></icon-base></span>`;
    }
    this._node.innerHTML = innerHTML;
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
if (!customElements.get('progress-indicator-node-base')) {
  customElements.define('progress-indicator-node-base', ProgressIndicatorNodeBase);
}

export default ProgressIndicatorNodeBase;
