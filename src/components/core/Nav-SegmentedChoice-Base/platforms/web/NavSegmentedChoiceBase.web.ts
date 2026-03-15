/**
 * Nav-SegmentedChoice-Base — Web Implementation
 * 
 * Navigation control for switching between mutually exclusive content views.
 * Web Component with Shadow DOM, tablist/tab ARIA pattern.
 * 
 * Stemma System: Navigation Family, Primitive (Base)
 * 
 * @module Nav-SegmentedChoice-Base/platforms/web
 * @see .kiro/specs/049-nav-segmentedchoice-base/design-outline.md
 * @see Requirements: 1.1–1.5, 7.1–7.3, 9.1–9.8, 10.1
 */

/// <reference lib="dom" />

import type {
  SegmentedChoiceProps,
  SegmentOption,
  SegmentedChoiceSize,
} from '../../types';
import { SEGMENTED_CHOICE_DEFAULTS } from '../../types';
import type { IconBaseName } from '../../../Icon-Base/types';
// Ensure Icon-Base is registered before we use it
import '../../../Icon-Base/platforms/web/IconBase.web';

import styles from './NavSegmentedChoiceBase.styles.css';

/** Attributes the component observes for changes */
const OBSERVED_ATTRIBUTES = [
  'segments',
  'selected-value',
  'size',
  'id',
  'test-id',
] as const;

/**
 * Type guard: is this a text segment?
 */
function isTextSegment(seg: SegmentOption): seg is { value: string; label: string } {
  return 'label' in seg;
}

/**
 * NavSegmentedChoiceBase Web Component
 * 
 * @example
 * ```html
 * <nav-segmented-choice
 *   segments='[{"value":"daily","label":"Daily"},{"value":"weekly","label":"Weekly"}]'
 *   selected-value="daily"
 *   size="standard">
 * </nav-segmented-choice>
 * ```
 */
export class NavSegmentedChoiceBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _domCreated = false;

  // Cached DOM references
  private _containerEl: HTMLDivElement | null = null;
  private _indicatorEl: HTMLDivElement | null = null;
  private _segmentEls: HTMLButtonElement[] = [];

  // Internal state
  private _segments: SegmentOption[] = [];
  private _selectedValue = '';
  private _size: SegmentedChoiceSize = SEGMENTED_CHOICE_DEFAULTS.size;
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

  // --- Public API (property accessors) ---

  get segments(): SegmentOption[] {
    return this._segments;
  }

  set segments(value: SegmentOption[] | string) {
    const parsed = typeof value === 'string' ? JSON.parse(value) as SegmentOption[] : value;
    if (parsed.length < 2) {
      throw new Error(
        `Nav-SegmentedChoice-Base requires at least 2 segments. Received: ${parsed.length}.`
      );
    }
    this._segments = parsed;
    this._resolveSelectedValue();
    this._render();
  }

  get selectedValue(): string {
    return this._selectedValue;
  }

  set selectedValue(value: string) {
    this._selectedValue = value;
    this._resolveSelectedValue();
    this._render();
  }

  get size(): SegmentedChoiceSize {
    return this._size;
  }

  set size(value: SegmentedChoiceSize) {
    this._size = value === 'condensed' ? 'condensed' : 'standard';
    this._render();
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
  }

  disconnectedCallback(): void {
    this._shadowRoot.removeEventListener('click', this._handleClick);
    this._shadowRoot.removeEventListener('keydown', this._handleKeydown);
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    switch (name) {
      case 'segments':
        if (value) this.segments = value;
        break;
      case 'selected-value':
        if (value !== null) {
          this._selectedValue = value;
          this._resolveSelectedValue();
          this._render();
        }
        break;
      case 'size':
        this.size = (value as SegmentedChoiceSize) ?? 'standard';
        break;
      case 'test-id':
        this._updateTestID();
        break;
    }
  }

  // --- Internal ---

  /**
   * If selectedValue doesn't match any segment, fall back to first segment.
   * @see Req 1.4
   */
  private _resolveSelectedValue(): void {
    if (this._segments.length === 0) return;
    const match = this._segments.find(s => s.value === this._selectedValue);
    if (!match) {
      this._selectedValue = this._segments[0].value;
    }
  }

  /**
   * Full render — creates or updates the Shadow DOM.
   */
  private _render(): void {
    if (!this.isConnected) return;

    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    }

    this._updateSegments();
    this._updateIndicator();
    this._updateTestID();
  }

  /**
   * One-time DOM creation.
   */
  private _createDOM(): void {
    // Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    this._shadowRoot.appendChild(styleEl);

    // Container (tablist)
    this._containerEl = document.createElement('div');
    this._containerEl.classList.add('segmented-choice');
    this._containerEl.setAttribute('role', 'tablist');
    this._shadowRoot.appendChild(this._containerEl);

    // Indicator
    this._indicatorEl = document.createElement('div');
    this._indicatorEl.classList.add('segmented-choice__indicator');
    this._containerEl.appendChild(this._indicatorEl);
  }

  /**
   * Sync segment buttons to match current segments array.
   */
  private _updateSegments(): void {
    if (!this._containerEl || !this._indicatorEl) return;

    const sizeClass = `segmented-choice__segment--${this._size}`;
    const componentId = this.id || null;

    // Remove excess buttons
    while (this._segmentEls.length > this._segments.length) {
      const el = this._segmentEls.pop()!;
      el.remove();
    }

    // Create or update buttons
    for (let i = 0; i < this._segments.length; i++) {
      const seg = this._segments[i];
      const isSelected = seg.value === this._selectedValue;
      let btn = this._segmentEls[i];

      if (!btn) {
        btn = document.createElement('button');
        btn.classList.add('segmented-choice__segment');
        btn.setAttribute('role', 'tab');
        this._containerEl.appendChild(btn);
        this._segmentEls.push(btn);
      }

      // Size class
      btn.className = `segmented-choice__segment ${sizeClass}`;

      // ARIA
      btn.setAttribute('aria-selected', String(isSelected));
      btn.tabIndex = isSelected ? 0 : -1;

      // aria-controls when id prop provided (Req 6.1–6.3)
      if (componentId) {
        btn.setAttribute('aria-controls', `${componentId}-panel-${seg.value}`);
      } else {
        btn.removeAttribute('aria-controls');
      }

      // Content
      if (isTextSegment(seg)) {
        btn.textContent = seg.label;
      } else {
        // Icon segment — use <icon-base> with currentColor
        btn.innerHTML = '';
        const iconEl = document.createElement('icon-base') as HTMLElement;
        iconEl.setAttribute('name', seg.icon as string);
        iconEl.setAttribute('size', this._size === 'condensed' ? '24' : '28');
        iconEl.setAttribute('aria-label', seg.accessibilityLabel);
        btn.appendChild(iconEl);
      }

      // Data attribute for value lookup
      btn.dataset.value = seg.value;
    }
  }

  /**
   * Position the indicator behind the selected segment (no animation).
   * Used for initial render and non-animated updates.
   * Uses physical properties (left/width) for Safari transition compatibility.
   * @see contract: animation_initial_render
   */
  private _updateIndicator(): void {
    if (!this._indicatorEl || this._segments.length === 0) return;

    const selectedIndex = this._segments.findIndex(s => s.value === this._selectedValue);
    if (selectedIndex < 0) return;

    const btn = this._segmentEls[selectedIndex];
    if (!btn) return;

    this._indicatorEl.style.transition = 'none';
    this._indicatorEl.style.left = `${btn.offsetLeft}px`;
    this._indicatorEl.style.width = `${btn.offsetWidth}px`;

    if (this._isInitialRender) {
      this._isInitialRender = false;
    }
  }

  /**
   * Apply test-id to the container.
   */
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

  /**
   * Delegated click handler — resolves which segment was clicked.
   * No-op on active segment (Req 1.3, contract: interaction_noop_active).
   * Invokes onSelectionChange for inactive segments (Req 1.1, contract: interaction_pressable).
   */
  private _handleClick = (e: Event): void => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>(
      '.segmented-choice__segment'
    );
    if (!target) return;

    const value = target.dataset.value;
    if (!value || value === this._selectedValue) return;

    const prevValue = this._selectedValue;
    this._selectedValue = value;
    this._updateSegments();
    this._updateTestID();
    this._animateIndicator(prevValue);
    this._onSelectionChange?.(value);
    this.dispatchEvent(new CustomEvent('selection-change', { detail: { value }, bubbles: true }));
  };

  /**
   * Keyboard handler — arrow navigation + Enter/Space activation.
   * @see Req 4.1–4.5, contracts: interaction_keyboard_navigation, interaction_keyboard_activation, interaction_roving_tabindex
   */
  private _handleKeydown = (e: Event): void => {
    const ke = e as KeyboardEvent;
    const target = ke.target as HTMLElement;
    if (!target.matches('.segmented-choice__segment')) return;

    const currentIndex = this._segmentEls.indexOf(target as HTMLButtonElement);
    if (currentIndex < 0) return;

    let nextIndex: number | null = null;

    switch (ke.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + this._segments.length) % this._segments.length;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % this._segments.length;
        break;
      case 'Enter':
      case ' ': {
        ke.preventDefault();
        const value = this._segmentEls[currentIndex].dataset.value;
        if (value && value !== this._selectedValue) {
          const prevValue = this._selectedValue;
          this._selectedValue = value;
          this._updateSegments();
          this._updateTestID();
          this._animateIndicator(prevValue);
          this._onSelectionChange?.(value);
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { value }, bubbles: true }));
        }
        return;
      }
      default:
        return;
    }

    // Arrow key — move focus only, don't change selection
    ke.preventDefault();
    this._segmentEls[nextIndex!].focus();
  };

  /**
   * Check if reduced motion is preferred.
   */
  private _prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Wait for a specific CSS transition to end on the indicator.
   */
  /**
   * Four-phase indicator animation choreography using CSS transition delays.
   * 
   * Phase 1 (0ms):       Shadow out — 150ms easingAccelerate
   * Phase 2+3 (150ms):   Resize + Glide — 150ms/350ms simultaneous
   * Phase 4 (500ms):     Shadow in — 150ms easingDecelerate
   * Total: ~650ms
   * 
   * @see Req 3.1–3.7, contracts: animation_coordination, animation_initial_render, accessibility_reduced_motion
   */
  private _animateIndicator(_prevValue: string): void {
    if (!this._indicatorEl || this._segments.length === 0) return;

    const selectedIndex = this._segments.findIndex(s => s.value === this._selectedValue);
    if (selectedIndex < 0) return;
    const btn = this._segmentEls[selectedIndex];
    if (!btn) return;

    const targetLeft = btn.offsetLeft;
    const targetWidth = btn.offsetWidth;

    // Reduced motion: instant move (contract: accessibility_reduced_motion)
    if (this._prefersReducedMotion()) {
      this._indicatorEl.style.transition = 'none';
      this._indicatorEl.style.left = `${targetLeft}px`;
      this._indicatorEl.style.width = `${targetWidth}px`;
      return;
    }

    // Prevent re-entrant animation — snap to current target if already animating
    if (this._animating) {
      this._indicatorEl.style.transition = 'none';
      this._indicatorEl.style.left = `${targetLeft}px`;
      this._indicatorEl.style.width = `${targetWidth}px`;
      this._animating = false;
      return;
    }

    this._animating = true;

    // Phase 1: Shadow out immediately
    this._indicatorEl.style.boxShadow = 'none';

    // All four phases as a single compound transition with delays.
    // Uses physical properties (left/width) because Safari doesn't
    // reliably transition logical properties (inset-inline-start/inline-size).
    // Force reflow so box-shadow: none applies before transition starts
    this._indicatorEl.offsetWidth;

    // Duration tokens already include ms units in browser build
    this._indicatorEl.style.transition = [
      'width var(--duration-150) var(--easing-standard) var(--duration-150)',
      'left var(--duration-350) var(--easing-glide-decelerate) var(--duration-150)',
      'box-shadow var(--duration-150) var(--easing-decelerate) calc(var(--duration-150) + var(--duration-350))',
    ].join(', ');
    this._indicatorEl.style.left = `${targetLeft}px`;
    this._indicatorEl.style.width = `${targetWidth}px`;
    this._indicatorEl.style.boxShadow = '';

    // Clean up after total animation time (~650ms + buffer)
    setTimeout(() => {
      if (this._indicatorEl) {
        this._indicatorEl.style.transition = '';
      }
      this._animating = false;
    }, 700);
  }
}

// Register custom element
if (!customElements.get('nav-segmented-choice')) {
  customElements.define('nav-segmented-choice', NavSegmentedChoiceBase);
}
