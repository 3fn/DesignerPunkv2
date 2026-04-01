/**
 * Nav-Header-Base — Web Implementation
 *
 * Structural primitive for top-of-screen navigation bars.
 * Three-region layout, landmark semantics, safe area, appearance modes.
 * Internal only — semantic variants compose this.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-Header-Base/platforms/web
 * @see .kiro/specs/088-top-bar-component/design.md
 * @see contracts: accessibility_aria_roles, visual_background, visual_translucent,
 *      visual_separator, layout_three_regions, interaction_focus_order
 */

/// <reference lib="dom" />

import type { NavHeaderBaseProps } from '../../types';
import styles from './NavHeaderBase.styles.css';

const OBSERVED_ATTRIBUTES = [
  'appearance',
  'show-separator',
  'test-id',
] as const;

export class NavHeaderBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _domCreated = false;

  // --- Lifecycle ---

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    }
    this._updateAppearance();
    this._updateSeparator();
  }

  static get observedAttributes(): readonly string[] {
    return OBSERVED_ATTRIBUTES;
  }

  attributeChangedCallback(_name: string): void {
    if (!this._domCreated) return;
    this._updateAppearance();
    this._updateSeparator();
  }

  // --- DOM Creation ---

  private _createDOM(): void {
    const style = document.createElement('style');
    style.textContent = styles;

    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.classList.add('nav-header');

    if (this.getAttribute('test-id')) {
      header.setAttribute('data-testid', this.getAttribute('test-id')!);
    }

    // Leading region
    const leading = document.createElement('div');
    leading.classList.add('nav-header__leading');
    leading.innerHTML = '<slot name="leading"></slot>';

    // Title region
    const title = document.createElement('div');
    title.classList.add('nav-header__title');
    title.innerHTML = '<slot name="title"></slot>';

    // Trailing region
    const trailing = document.createElement('div');
    trailing.classList.add('nav-header__trailing');
    trailing.innerHTML = '<slot name="trailing"></slot>';

    header.appendChild(leading);
    header.appendChild(title);
    header.appendChild(trailing);

    // Separator
    const separator = document.createElement('div');
    separator.classList.add('nav-header__separator');
    separator.setAttribute('aria-hidden', 'true');
    header.appendChild(separator);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(header);
  }

  // --- Updates ---

  private _updateAppearance(): void {
    const header = this._shadowRoot.querySelector('.nav-header');
    if (!header) return;
    const translucent = this.getAttribute('appearance') === 'translucent';
    header.classList.toggle('nav-header--translucent', translucent);
  }

  private _updateSeparator(): void {
    const separator = this._shadowRoot.querySelector('.nav-header__separator') as HTMLElement;
    if (!separator) return;
    const show = this.getAttribute('show-separator') !== 'false';
    separator.style.display = show ? 'block' : 'none';
  }
}

// Register custom element
if (!customElements.get('nav-header')) {
  customElements.define('nav-header', NavHeaderBase);
}
