/**
 * Progress-Indicator-Connector-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Connector-Base
 * 
 * Connecting line element between progress indicator nodes.
 * Renders as a horizontal line with state-based color treatment.
 * 
 * @module Progress-Indicator-Connector-Base/platforms/web
 * @see Requirements: 1.6-1.7, 12.10-12.12
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

import { ConnectorState, CONNECTOR_BASE_DEFAULTS } from '../../types';

// Import CSS as string for browser bundle compatibility
import connectorStyles from './ProgressIndicatorConnectorBase.styles.css';

/**
 * Progress-Indicator-Connector-Base Web Component
 * 
 * A native web component that renders a horizontal connecting line between
 * progress indicator nodes with state-based color treatment.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Token-based styling via CSS custom properties
 * - Supports 2 states: active, inactive
 * - Uses 1px thickness (borderDefault token)
 * - Flexible length (fills space between nodes via flex: 1)
 * - Decorative element (aria-hidden)
 * 
 * @example
 * ```html
 * <progress-indicator-connector-base state="active"></progress-indicator-connector-base>
 * <progress-indicator-connector-base state="inactive"></progress-indicator-connector-base>
 * ```
 * 
 * @see Requirements: 1.6-1.7, 12.10-12.12
 */
export class ProgressIndicatorConnectorBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['state', 'test-id'];
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
   * Get the connector state.
   * @see Requirement 1.6 - Two states: active, inactive
   */
  get state(): ConnectorState {
    const state = this.getAttribute('state');
    return (state === 'active' || state === 'inactive') ? state : CONNECTOR_BASE_DEFAULTS.state;
  }

  set state(value: ConnectorState) {
    this.setAttribute('state', value);
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
   * Render the connector into shadow DOM.
   * 
   * @see Requirements 1.6-1.7, 12.10-12.12
   */
  private render(): void {
    const state = this.state;
    const testID = this.testID;

    const connectorClasses = [
      'connector',
      `connector--${state}`,
    ].join(' ');

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    this._shadowRoot.innerHTML = `
      <style>
        ${connectorStyles}
      </style>
      <span class="${connectorClasses}"${testIDAttr} role="presentation" aria-hidden="true"></span>
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
if (!customElements.get('progress-indicator-connector-base')) {
  customElements.define('progress-indicator-connector-base', ProgressIndicatorConnectorBase);
}

export default ProgressIndicatorConnectorBase;
