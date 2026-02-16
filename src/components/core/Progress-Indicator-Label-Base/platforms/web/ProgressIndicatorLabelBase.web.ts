/**
 * Progress-Indicator-Label-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Label-Base
 * 
 * Label element positioned centered below progress indicator nodes.
 * Renders primary label text with optional helper text, using
 * typography.labelSm token for consistent text styling.
 * 
 * @module Progress-Indicator-Label-Base/platforms/web
 * @see Requirements: 1.8-1.10
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

// Import CSS as string for browser bundle compatibility
import labelStyles from './ProgressIndicatorLabelBase.styles.css';

/**
 * Progress-Indicator-Label-Base Web Component
 * 
 * A native web component that renders a label centered below a progress
 * indicator node with optional helper text and ellipsis truncation.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties (typography.labelSm)
 * - Supports optional helper text below primary label
 * - Truncates with ellipsis when text exceeds available width
 * - Decorative element (aria-hidden)
 * 
 * @example
 * ```html
 * <progress-indicator-label-base label="Step 1" helper-text="Personal Info"></progress-indicator-label-base>
 * <progress-indicator-label-base label="Review" optional></progress-indicator-label-base>
 * ```
 * 
 * @see Requirements: 1.8-1.10
 */
export class ProgressIndicatorLabelBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['label', 'helper-text', 'optional', 'test-id'];
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
   * Get the primary label text.
   * @see Requirement 1.8 - Position centered below node
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

  /**
   * Get the helper text.
   * @see Requirement 1.9 - Support optional helper text
   */
  get helperText(): string | null {
    return this.getAttribute('helper-text');
  }

  set helperText(value: string | null) {
    if (value) {
      this.setAttribute('helper-text', value);
    } else {
      this.removeAttribute('helper-text');
    }
  }

  /**
   * Get whether this step is optional.
   */
  get optional(): boolean {
    return this.hasAttribute('optional');
  }

  set optional(value: boolean) {
    if (value) {
      this.setAttribute('optional', '');
    } else {
      this.removeAttribute('optional');
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
   * Render the label into shadow DOM.
   * 
   * @see Requirements 1.8-1.10
   */
  private render(): void {
    const label = this.label;
    const helperText = this.helperText;
    const testID = this.testID;

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    // Build helper text HTML if provided
    // @see Requirement 1.9 - Support optional helper text
    const helperHTML = helperText
      ? `<span class="label__helper">${this.escapeHtml(helperText)}</span>`
      : '';

    this._shadowRoot.innerHTML = `
      <style>
        ${labelStyles}
      </style>
      <span class="label"${testIDAttr} role="presentation" aria-hidden="true">
        <span class="label__text">${this.escapeHtml(label)}</span>
        ${helperHTML}
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
if (!customElements.get('progress-indicator-label-base')) {
  customElements.define('progress-indicator-label-base', ProgressIndicatorLabelBase);
}

export default ProgressIndicatorLabelBase;
