/**
 * Progress-Bar-Base — Web Implementation
 *
 * Continuous progress indicator with determinate and indeterminate modes.
 *
 * Stemma System: ProgressIndicator Family, Primitive (standalone)
 *
 * @module Progress-Bar-Base/platforms/web
 * @see .kiro/specs/090-linear-progress-bar/design.md
 */

/// <reference lib="dom" />

import { INDETERMINATE_STATIC_FILL } from '../../types';
import styles from './ProgressBarBase.styles.css';

const MILESTONES = [0, 25, 50, 75, 100];

export class ProgressBarBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _domCreated = false;
  private _lastAnnouncedMilestone = -1;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
    }
    this._update();
  }

  static get observedAttributes(): readonly string[] {
    return ['value', 'mode', 'size', 'accessibility-label', 'test-id'];
  }

  attributeChangedCallback(): void {
    if (!this._domCreated) return;
    this._update();
  }

  private _createDOM(): void {
    const style = document.createElement('style');
    style.textContent = styles;

    const track = document.createElement('div');
    track.classList.add('progress-bar');
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '1');

    const fill = document.createElement('div');
    fill.classList.add('progress-bar__fill');

    track.appendChild(fill);
    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(track);
  }

  private _update(): void {
    const track = this._shadowRoot.querySelector('.progress-bar') as HTMLElement;
    const fill = this._shadowRoot.querySelector('.progress-bar__fill') as HTMLElement;
    if (!track || !fill) return;

    const mode = this.getAttribute('mode') || 'determinate';
    const size = this.getAttribute('size') || 'md';
    const label = this.getAttribute('accessibility-label') || '';
    const testId = this.getAttribute('test-id');

    // Size
    track.className = `progress-bar progress-bar--${size}`;

    // Label
    track.setAttribute('aria-label', label);
    if (testId) track.setAttribute('data-testid', testId);

    if (mode === 'indeterminate') {
      fill.className = 'progress-bar__fill progress-bar__fill--indeterminate';
      fill.style.inlineSize = '';
      track.removeAttribute('aria-valuenow');

      // Reduced motion: static fill
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        fill.style.inlineSize = `${INDETERMINATE_STATIC_FILL * 100}%`;
        fill.style.opacity = '1';
      }
    } else {
      const valueAttr = this.getAttribute('value');
      if (valueAttr === null) {
        throw new Error('Progress-Bar-Base: value attribute is required in determinate mode');
      }
      const value = parseFloat(valueAttr);
      this._validateValue(value);

      fill.className = 'progress-bar__fill progress-bar__fill--determinate';
      fill.style.inlineSize = `${value * 100}%`;
      fill.style.opacity = '';
      track.setAttribute('aria-valuenow', String(value));

      this._announceMilestone(value);
    }
  }

  private _validateValue(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error(
        `Progress-Bar-Base: value must be between 0 and 1, received ${value}`
      );
    }
  }

  private _announceMilestone(value: number): void {
    const percentage = Math.round(value * 100);
    for (const milestone of MILESTONES) {
      if (percentage >= milestone && this._lastAnnouncedMilestone < milestone) {
        this._lastAnnouncedMilestone = milestone;
        // Live region announcement
        const track = this._shadowRoot.querySelector('.progress-bar');
        if (track) {
          track.setAttribute('aria-live', 'polite');
          // Remove after announcement to prevent repeat
          setTimeout(() => track.removeAttribute('aria-live'), 100);
        }
      }
    }
  }
}

if (!customElements.get('progress-bar')) {
  customElements.define('progress-bar', ProgressBarBase);
}
