/**
 * Nav-Header-App — Web Implementation
 * Thin wrapper composing nav-header (Nav-Header-Base) with permissive slots.
 * @module Nav-Header-App/platforms/web
 */

/// <reference lib="dom" />

import '../../../Nav-Header-Base/platforms/web/NavHeaderBase.web'; // composes: nav-header-base

export class NavHeaderApp extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    const header = document.createElement('nav-header') as HTMLElement;
    header.setAttribute('appearance', this.getAttribute('appearance') || 'opaque');
    header.setAttribute('show-separator', this.getAttribute('show-separator') ?? 'true');
    if (this.getAttribute('test-id')) header.setAttribute('test-id', this.getAttribute('test-id')!);

    header.innerHTML = `
      <slot name="leading" slot="leading"></slot>
      <slot name="center" slot="title"></slot>
      <slot name="trailing" slot="trailing"></slot>
    `;

    this._shadowRoot.appendChild(header);
  }
}

if (!customElements.get('nav-header-app')) {
  customElements.define('nav-header-app', NavHeaderApp);
}
