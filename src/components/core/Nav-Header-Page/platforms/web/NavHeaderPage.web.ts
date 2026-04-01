/**
 * Nav-Header-Page — Web Implementation
 *
 * Opinionated page-level navigation bar. Composes Nav-Header-Base.
 * Back/close actions, h1 title, trailing actions, collapsible scroll.
 *
 * Stemma System: Navigation Family, Semantic (inherits Nav-Header-Base)
 *
 * @module Nav-Header-Page/platforms/web
 * @see .kiro/specs/088-top-bar-component/design.md
 */

/// <reference lib="dom" />

import type { NavHeaderPageProps } from '../../types';
import '../../../Nav-Header-Base/platforms/web/NavHeaderBase.web';
import styles from './NavHeaderPage.styles.css';

const SCROLL_THRESHOLD = 8;

export class NavHeaderPage extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _domCreated = false;
  private _lastScrollY = 0;
  private _hidden = false;
  private _scrollHandler: (() => void) | null = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    }
    this._setupScroll();
  }

  disconnectedCallback(): void {
    this._teardownScroll();
  }

  static get observedAttributes(): readonly string[] {
    return ['title', 'title-alignment', 'scroll-behavior', 'appearance', 'show-separator', 'test-id'];
  }

  attributeChangedCallback(): void {
    if (!this._domCreated) return;
    this._updateTitle();
    this._updateAlignment();
    this._setupScroll();
  }

  // --- DOM ---

  private _createDOM(): void {
    const style = document.createElement('style');
    style.textContent = styles;

    const header = document.createElement('nav-header') as HTMLElement;
    header.setAttribute('appearance', this.getAttribute('appearance') || 'opaque');
    header.setAttribute('show-separator', this.getAttribute('show-separator') ?? 'true');
    if (this.getAttribute('test-id')) {
      header.setAttribute('test-id', this.getAttribute('test-id')!);
    }

    // Leading slot
    const leading = document.createElement('div');
    leading.setAttribute('slot', 'leading');
    leading.innerHTML = '<slot name="leading-action"></slot>';

    // Title
    const titleWrapper = document.createElement('div');
    titleWrapper.setAttribute('slot', 'title');
    const alignment = this._getAlignment();
    titleWrapper.className = `nav-header-page__title-wrapper--${alignment}`;

    const h1 = document.createElement('h1');
    h1.className = 'nav-header-page__title';
    h1.textContent = this.getAttribute('title') || '';
    titleWrapper.appendChild(h1);

    // Trailing slot
    const trailing = document.createElement('div');
    trailing.setAttribute('slot', 'trailing');
    trailing.className = 'nav-header-page__trailing';
    trailing.innerHTML = '<slot name="trailing-actions"></slot>';

    // Close action (separate from trailing, with gap)
    const closeSlot = document.createElement('slot');
    closeSlot.name = 'close-action';
    const closeGap = document.createElement('span');
    closeGap.className = 'nav-header-page__close-gap';

    trailing.appendChild(closeGap);
    trailing.appendChild(closeSlot);

    header.appendChild(leading);
    header.appendChild(titleWrapper);
    header.appendChild(trailing);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(header);
  }

  // --- Updates ---

  private _getAlignment(): string {
    const explicit = this.getAttribute('title-alignment');
    if (explicit) return explicit;
    return 'leading'; // Web default
  }

  private _updateTitle(): void {
    const h1 = this._shadowRoot.querySelector('.nav-header-page__title');
    if (h1) h1.textContent = this.getAttribute('title') || '';
  }

  private _updateAlignment(): void {
    const wrapper = this._shadowRoot.querySelector('[slot="title"]');
    if (!wrapper) return;
    const alignment = this._getAlignment();
    wrapper.className = `nav-header-page__title-wrapper--${alignment}`;
  }

  // --- Collapsible Scroll ---

  private _setupScroll(): void {
    this._teardownScroll();
    if (this.getAttribute('scroll-behavior') !== 'collapsible') return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this._lastScrollY = window.scrollY;
    this._scrollHandler = () => this._onScroll();
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  private _teardownScroll(): void {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
  }

  private _onScroll(): void {
    const currentY = window.scrollY;
    const delta = currentY - this._lastScrollY;

    if (delta > SCROLL_THRESHOLD && !this._hidden) {
      this._hidden = true;
      this.classList.add('nav-header-page--hidden');
    } else if (delta < -SCROLL_THRESHOLD && this._hidden) {
      this._hidden = false;
      this.classList.remove('nav-header-page--hidden');
    }

    this._lastScrollY = currentY;
  }
}

if (!customElements.get('nav-header-page')) {
  customElements.define('nav-header-page', NavHeaderPage);
}
