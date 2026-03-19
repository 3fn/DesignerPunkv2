/**
 * Nav-TabBar-Base — Web Implementation
 *
 * Primary bottom navigation with icon-only tabs, dot indicator,
 * and three-phase selection animation. Floating pill on web.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-TabBar-Base/platforms/web
 * @see .kiro/specs/050-nav-tabbar-base/design.md
 * @see Requirements: R1-R9
 */

/// <reference lib="dom" />

import type { TabBarProps, TabOption } from '../../types';
import type { IconBaseName } from '../../../Icon-Base/types';
import '../../../Icon-Base/platforms/web/IconBase.web';

import styles from './NavTabBarBase.styles.css';

const OBSERVED_ATTRIBUTES = [
  'tabs',
  'selected-value',
  'test-id',
] as const;

export class NavTabBarBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _domCreated = false;

  // Cached DOM references
  private _containerEl: HTMLDivElement | null = null;
  private _dotEl: HTMLSpanElement | null = null;
  private _tabEls: HTMLButtonElement[] = [];

  // Internal state
  private _tabs: TabOption[] = [];
  private _selectedValue = '';
  private _onSelectionChange: ((value: string) => void) | null = null;

  // Animation state
  private _isInitialRender = true;
  private _animating = false;

  static get observedAttributes(): readonly string[] {
    return OBSERVED_ATTRIBUTES;
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  // --- Public API ---

  get tabs(): TabOption[] {
    return this._tabs;
  }

  set tabs(value: TabOption[] | string) {
    const parsed = typeof value === 'string' ? JSON.parse(value) as TabOption[] : value;
    if (parsed.length < 2) {
      throw new Error(
        `Nav-TabBar-Base requires at least 2 tabs. Received: ${parsed.length}.`
      );
    }
    this._tabs = parsed;
    this._resolveSelectedValue();
    this._render();
  }

  get selectedValue(): string {
    return this._selectedValue;
  }

  set selectedValue(value: string) {
    const prev = this._selectedValue;
    this._selectedValue = value;
    this._resolveSelectedValue();
    if (prev !== this._selectedValue) {
      this._render();
    }
  }

  get onSelectionChange(): ((value: string) => void) | null {
    return this._onSelectionChange;
  }

  set onSelectionChange(fn: ((value: string) => void) | null) {
    this._onSelectionChange = fn;
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

  // --- Lifecycle ---

  connectedCallback(): void {
    this._render();
    this._shadowRoot.addEventListener('click', this._handleClick);
    this._shadowRoot.addEventListener('keydown', this._handleKeydown);
    this._initChromeTracking();
  }

  disconnectedCallback(): void {
    this._shadowRoot.removeEventListener('click', this._handleClick);
    this._shadowRoot.removeEventListener('keydown', this._handleKeydown);
    this._teardownChromeTracking();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    switch (name) {
      case 'tabs':
        if (value) this.tabs = value;
        break;
      case 'selected-value':
        if (value !== null) this.selectedValue = value;
        break;
      case 'test-id':
        this._updateTestID();
        break;
    }
  }

  // --- Internal ---

  /** @see R1 AC4, contract: validation_selection_constraints */
  private _resolveSelectedValue(): void {
    if (this._tabs.length === 0) return;
    if (!this._tabs.find(t => t.value === this._selectedValue)) {
      this._selectedValue = this._tabs[0].value;
    }
  }

  private _render(): void {
    if (!this.isConnected) return;

    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    }

    this._updateTabs();
    this._positionDot();
    this._updateTestID();
  }

  private _createDOM(): void {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    this._shadowRoot.appendChild(styleEl);

    this._containerEl = document.createElement('div');
    this._containerEl.classList.add('tab-bar');
    this._containerEl.setAttribute('role', 'tablist');
    this._shadowRoot.appendChild(this._containerEl);

    // Single dot element — positioned absolutely, animated between tabs
    this._dotEl = document.createElement('span');
    this._dotEl.classList.add('tab-bar__dot');
    this._containerEl.appendChild(this._dotEl);
  }

  /**
   * Sync tab buttons. Does NOT create dots inside buttons — the dot
   * is a single element positioned via _positionDot().
   */
  private _updateTabs(): void {
    if (!this._containerEl) return;

    while (this._tabEls.length > this._tabs.length) {
      this._tabEls.pop()!.remove();
    }

    for (let i = 0; i < this._tabs.length; i++) {
      const tab = this._tabs[i];
      const isSelected = tab.value === this._selectedValue;
      let btn = this._tabEls[i];

      if (!btn) {
        btn = document.createElement('button');
        btn.classList.add('tab-item');
        btn.setAttribute('role', 'tab');
        // Insert before dot so dot renders on top
        this._containerEl.insertBefore(btn, this._dotEl);
        this._tabEls.push(btn);
      }

      btn.setAttribute('aria-selected', String(isSelected));
      btn.setAttribute('aria-label', tab.accessibilityLabel);
      btn.tabIndex = isSelected ? 0 : -1;

      // Icon — solid (active) or outline (inactive)
      btn.innerHTML = '';
      const iconEl = document.createElement('icon-base') as HTMLElement;
      iconEl.setAttribute('name', (isSelected ? tab.activeIcon : tab.icon) as string);
      iconEl.setAttribute('size', '24');
      iconEl.setAttribute('aria-hidden', 'true');
      btn.appendChild(iconEl);

      // Badge slot
      const slot = document.createElement('slot');
      slot.name = `badge-${tab.value}`;
      btn.appendChild(slot);

      btn.dataset.value = tab.value;
    }

    if (this._isInitialRender) {
      this._isInitialRender = false;
    }
  }

  /**
   * Position dot below the selected tab's icon center (no animation).
   * Used for initial render and post-animation snap.
   */
  private _positionDot(): void {
    if (!this._dotEl || !this._containerEl || this._tabs.length === 0) return;

    const idx = this._tabs.findIndex(t => t.value === this._selectedValue);
    if (idx < 0) return;
    const btn = this._tabEls[idx];
    if (!btn) return;

    // Center dot horizontally under the tab using getBoundingClientRect for sub-pixel accuracy
    const containerRect = this._containerEl.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const tabCenter = btnRect.left - containerRect.left + btnRect.width / 2;
    this._dotEl.style.transition = 'none';
    this._dotEl.style.left = `${tabCenter}px`;
    this._dotEl.style.display = '';
  }

  private _updateTestID(): void {
    const testId = this.getAttribute('test-id');
    if (this._containerEl) {
      if (testId) {
        this._containerEl.setAttribute('data-testid', testId);
      } else {
        this._containerEl.removeAttribute('data-testid');
      }
    }
  }

  // --- Chrome Tracking (R5 AC4-5) ---

  private _initChromeTracking(): void {
    if (!window.visualViewport) return;
    window.visualViewport.addEventListener('resize', this._updateChromeOffset);
    window.visualViewport.addEventListener('scroll', this._updateChromeOffset);
    this._updateChromeOffset();
  }

  private _teardownChromeTracking(): void {
    if (!window.visualViewport) return;
    window.visualViewport.removeEventListener('resize', this._updateChromeOffset);
    window.visualViewport.removeEventListener('scroll', this._updateChromeOffset);
  }

  private _updateChromeOffset = (): void => {
    if (!window.visualViewport) return;
    const offset = window.innerHeight - window.visualViewport.height;
    this.style.setProperty('--chrome-offset', `${Math.max(0, offset)}px`);
  };

  // --- Selection ---

  /**
   * Shared selection logic for click and keyboard.
   * Callback fires immediately before animation (R3, design.md § Callback timing).
   * @see contract: interaction_pressable, interaction_noop_active
   */
  private _selectTab(value: string): void {
    if (value === this._selectedValue) return;

    const prevValue = this._selectedValue;
    this._selectedValue = value;

    // Callback fires before animation — R3 callback timing
    this._onSelectionChange?.(value);
    this.dispatchEvent(
      new CustomEvent('selection-change', { detail: { value }, bubbles: true })
    );

    if (this._prefersReducedMotion() || this._isInitialRender) {
      // Immediate state change — contract: accessibility_reduced_motion
      this._updateTabs();
      this._positionDot();
    } else {
      this._animateSelection(prevValue, value);
    }

    this._updateTestID();
  }

  // --- Animation Choreography (R3, contract: animation_coordination) ---

  /**
   * Three-phase selection animation.
   *
   * Phase 1 (0ms, duration150, easingAccelerate):
   *   Departing glow dims, departing icon begins settling.
   *
   * Phase 2 (after Phase 1, duration350, easingGlideDecelerate):
   *   Dot glides from departing to arriving tab center.
   *
   * Phase 3 (~80% through Phase 2, duration150, easingDecelerate):
   *   Arriving icon lifts, glow brightens, icon swap snaps.
   *
   * All timing via CSS custom properties from Rosetta motion tokens.
   */
  private _animateSelection(fromValue: string, toValue: string): void {
    if (!this._dotEl || !this._containerEl) return;

    const fromIdx = this._tabs.findIndex(t => t.value === fromValue);
    const toIdx = this._tabs.findIndex(t => t.value === toValue);
    if (fromIdx < 0 || toIdx < 0) return;

    const fromBtn = this._tabEls[fromIdx];
    const toBtn = this._tabEls[toIdx];
    if (!fromBtn || !toBtn) return;

    // Prevent re-entrant animation
    if (this._animating) {
      this._updateTabs();
      this._positionDot();
      return;
    }
    this._animating = true;

    // Phase durations used for setTimeout scheduling.
    const PHASE_SHORT = 150; // matches --duration-150
    const PHASE_GLIDE = 350; // matches --duration-350

    // --- Dot glide starts immediately ---
    const containerRect = this._containerEl.getBoundingClientRect();
    const toRect = toBtn.getBoundingClientRect();
    const toCenter = toRect.left - containerRect.left + toRect.width / 2;
    if (this._dotEl) {
      this._dotEl.style.transition = `left ${PHASE_GLIDE}ms var(--easing-glide-decelerate)`;
      this._dotEl.style.left = `${toCenter}px`;
    }

    // --- At 8%: departing tab settles down, glow dims ---
    setTimeout(() => {
      fromBtn.classList.add('tab-item--departing');
    }, PHASE_GLIDE * 0.08);

    // --- At 50%: arriving tab lifts up, icon swap, glow brightens ---
    setTimeout(() => {
      toBtn.classList.add('tab-item--arriving');
      this._updateTabs();

      // Clean up after lift/settle animations complete
      setTimeout(() => {
        fromBtn.classList.remove('tab-item--departing');
        toBtn.classList.remove('tab-item--arriving');
        if (this._dotEl) {
          this._dotEl.style.transition = 'none';
        }
        this._animating = false;
      }, PHASE_SHORT);
    }, PHASE_GLIDE * 0.5);
  }

  private _prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // --- Event Handlers ---

  private _handleClick = (e: Event): void => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.tab-item');
    if (!target) return;
    const value = target.dataset.value;
    if (value) this._selectTab(value);
  };

  private _handleKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    const target = ke.target as HTMLElement;
    if (!target.matches('.tab-item')) return;

    const currentIndex = this._tabEls.indexOf(target as HTMLButtonElement);
    if (currentIndex < 0) return;

    switch (ke.key) {
      case 'ArrowLeft':
        ke.preventDefault();
        this._tabEls[(currentIndex - 1 + this._tabs.length) % this._tabs.length].focus();
        break;
      case 'ArrowRight':
        ke.preventDefault();
        this._tabEls[(currentIndex + 1) % this._tabs.length].focus();
        break;
      case 'Enter':
      case ' ': {
        ke.preventDefault();
        const value = this._tabEls[currentIndex].dataset.value;
        if (value) this._selectTab(value);
        break;
      }
    }
  };
}

if (!customElements.get('nav-tab-bar')) {
  customElements.define('nav-tab-bar', NavTabBarBase);
}
