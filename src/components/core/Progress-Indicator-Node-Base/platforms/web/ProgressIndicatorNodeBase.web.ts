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

  static get observedAttributes(): string[] {
    return ['state', 'size', 'content', 'icon', 'test-id'];
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
   * Render the node into shadow DOM.
   * 
   * Rendering logic:
   * 1. Determine effective content (sm always = dot)
   * 2. Build CSS classes for state + size
   * 3. Render inner content (dot, checkmark, icon, or empty circle)
   * 
   * @see Requirements 1.1-1.5, 12.1-12.16
   */
  private render(): void {
    const state = this.state;
    const size = this.size;
    const content = this.content;
    const iconName = this.icon;
    const testID = this.testID;

    // sm size always renders as dot regardless of content prop
    // @see Requirement 1.3
    const effectiveContent = size === 'sm' ? 'none' : content;

    const nodeClasses = [
      'node',
      `node--${state}`,
      `node--${size}`,
    ].join(' ');

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    // Generate inner content HTML
    let innerHTML = '';
    if (size === 'sm') {
      // sm: always a filled dot
      // @see Requirement 12.6
      innerHTML = '<span class="node__dot"></span>';
    } else if (effectiveContent === 'checkmark') {
      // md/lg + checkmark: render checkmark SVG
      // @see Requirement 12.8
      innerHTML = `<span class="node__content">${CHECKMARK_SVG}</span>`;
    } else if (effectiveContent === 'icon' && iconName) {
      // md/lg + icon: render icon-base element
      // @see Requirement 12.9
      innerHTML = `<span class="node__content"><icon-base name="${this.escapeHtml(iconName)}" size="${size === 'md' ? 13 : 18}" color="inherit"></icon-base></span>`;
    }
    // md/lg + none: empty circle (no inner content)
    // @see Requirement 12.7

    this._shadowRoot.innerHTML = `
      <style>
        ${nodeStyles}
      </style>
      <span class="${nodeClasses}"${testIDAttr} role="presentation" aria-hidden="true">
        ${innerHTML}
      </span>
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
if (!customElements.get('progress-indicator-node-base')) {
  customElements.define('progress-indicator-node-base', ProgressIndicatorNodeBase);
}

export default ProgressIndicatorNodeBase;
