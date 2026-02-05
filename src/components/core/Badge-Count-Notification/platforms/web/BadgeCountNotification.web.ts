/**
 * Badge-Count-Notification Component for Web Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * 
 * A notification count badge with predefined styling and live region announcements
 * for screen readers. Extends Badge-Count-Base behavior with notification-specific
 * colors and accessibility features.
 * 
 * Key Characteristics:
 * - Inherits all Badge-Count-Base behavior (count display, max truncation, showZero)
 * - Fixed notification colors (pink400 background, white100 text)
 * - Live region announcements for accessibility (aria-live="polite")
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * COLOR TOKENS (Spec 058):
 * Badge notification color tokens are defined in the component directory at
 * src/components/core/Badge-Count-Notification/tokens.ts following the Rosetta
 * System architecture. The web component uses CSS custom properties generated
 * by the token build pipeline:
 * - --color-badge-notification-background (references pink400)
 * - --color-badge-notification-text (references white100)
 * 
 * @module Badge-Count-Notification/platforms/web
 * @see Requirements: 3.1-3.10, 4.7, 5.1, 6.3
 * @see ../../tokens.ts for component color token definitions
 * @see .kiro/specs/044-badge-base/design.md for design specification
 * @see .kiro/specs/058-component-token-architecture-cleanup for color token migration
 */

/// <reference lib="dom" />

import { BadgeCountSize, BADGE_COUNT_NOTIFICATION_DEFAULTS } from '../../types';

// Import CSS as string for browser bundle compatibility
import badgeStyles from './BadgeCountNotification.styles.css';

/**
 * Badge-Count-Notification Web Component
 * 
 * A native web component that renders a notification count badge with
 * automatic live region announcements for screen readers.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Fixed notification colors (not configurable)
 * - Implements aria-live="polite" and aria-atomic="true" for announcements
 * - Pluralized announcement text for proper grammar
 * - Inherits all Badge-Count-Base behavior
 * - WCAG 2.1 AA compliant:
 *   - Color contrast 6.33:1 (exceeds 4.5:1 minimum)
 *   - Live region announcements for count changes
 *   - Text scaling support
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <badge-count-notification count="5"></badge-count-notification>
 * 
 * <!-- With size variant -->
 * <badge-count-notification count="3" size="sm"></badge-count-notification>
 * 
 * <!-- With max truncation -->
 * <badge-count-notification count="150" max="99"></badge-count-notification>
 * 
 * <!-- Disable announcements -->
 * <badge-count-notification count="5" announce-changes="false"></badge-count-notification>
 * 
 * <!-- With test ID -->
 * <badge-count-notification count="5" test-id="notification-badge"></badge-count-notification>
 * ```
 * 
 * @see Requirements: 3.1-3.10, 4.7, 5.1, 6.3
 */
export class BadgeCountNotification extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _previousCount: number | null = null;
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): string[] {
    return ['count', 'max', 'show-zero', 'size', 'announce-changes', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    // @see Requirement 5.1 - Web component with Shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback(): void {
    this.render();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * Triggers re-render and handles announcement logic for count changes.
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) {
      // Track count changes for announcement logic
      if (name === 'count' && oldValue !== null) {
        this._previousCount = parseInt(oldValue, 10);
      }
      
      this.render();
    }
  }
  
  // ============================================================================
  // Property Getters/Setters
  // ============================================================================
  
  /**
   * Get the badge count value.
   * 
   * @see Requirement 3.2 - inherits count behavior from Badge-Count-Base
   */
  get count(): number {
    const countAttr = this.getAttribute('count');
    if (countAttr === null) return 0;
    
    const parsed = parseInt(countAttr, 10);
    if (isNaN(parsed)) return 0;
    return Math.abs(parsed);
  }
  
  set count(value: number) {
    this.setAttribute('count', String(value));
  }
  
  /**
   * Get the maximum value before truncation.
   * 
   * @see Requirement 3.2 - inherits max behavior from Badge-Count-Base
   */
  get max(): number {
    const maxAttr = this.getAttribute('max');
    if (maxAttr === null) return BADGE_COUNT_NOTIFICATION_DEFAULTS.max;
    
    const parsed = parseInt(maxAttr, 10);
    if (isNaN(parsed) || parsed <= 0) return BADGE_COUNT_NOTIFICATION_DEFAULTS.max;
    return parsed;
  }
  
  set max(value: number) {
    this.setAttribute('max', String(value));
  }
  
  /**
   * Get the showZero state.
   * 
   * @see Requirement 3.2 - inherits showZero behavior from Badge-Count-Base
   */
  get showZero(): boolean {
    return this.getAttribute('show-zero') === 'true';
  }
  
  set showZero(value: boolean) {
    if (value) {
      this.setAttribute('show-zero', 'true');
    } else {
      this.removeAttribute('show-zero');
    }
  }
  
  /**
   * Get the badge size variant.
   * 
   * @see Requirement 3.2 - inherits size behavior from Badge-Count-Base
   */
  get size(): BadgeCountSize {
    const size = this.getAttribute('size');
    return (size === 'sm' || size === 'md' || size === 'lg') 
      ? size 
      : BADGE_COUNT_NOTIFICATION_DEFAULTS.size;
  }
  
  set size(value: BadgeCountSize) {
    this.setAttribute('size', value);
  }
  
  /**
   * Get the announceChanges state.
   * 
   * @returns true if count changes should be announced (default), false otherwise
   * @see Requirements 3.3, 3.6, 3.7 - announceChanges prop
   */
  get announceChanges(): boolean {
    const attr = this.getAttribute('announce-changes');
    // Default is true, only false if explicitly set to "false"
    return attr !== 'false';
  }
  
  set announceChanges(value: boolean) {
    if (value) {
      this.removeAttribute('announce-changes');
    } else {
      this.setAttribute('announce-changes', 'false');
    }
  }
  
  /**
   * Get the test ID.
   */
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
   * Get the display text for the count.
   * 
   * @see Requirement 3.2 - inherits max truncation from Badge-Count-Base
   */
  private getDisplayText(): string {
    const count = this.count;
    const max = this.max;
    
    if (count > max) {
      return `${max}+`;
    }
    
    return String(count);
  }
  
  /**
   * Get the announcement text for screen readers.
   * 
   * Implements pluralization logic:
   * - "1 notification" (singular)
   * - "5 notifications" (plural)
   * - "99 or more notifications" (overflow)
   * 
   * @see Requirements 3.4, 3.5 - pluralized announcement text
   */
  private getAnnouncementText(): string {
    const count = this.count;
    const max = this.max;
    
    // @see Requirement 3.5 - overflow announcement
    if (count > max) {
      return `${max} or more notifications`;
    }
    
    // @see Requirement 3.4 - pluralized text
    if (count === 1) {
      return '1 notification';
    }
    
    return `${count} notifications`;
  }
  
  /**
   * Determine if the badge should be visible.
   * 
   * @see Requirement 3.2 - inherits showZero behavior from Badge-Count-Base
   */
  private shouldRender(): boolean {
    const count = this.count;
    const showZero = this.showZero;
    
    if (count === 0 && !showZero) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Determine if an announcement should be made.
   * 
   * Only announces when:
   * - announceChanges is true
   * - There was a previous count (not initial render)
   * - The count has actually changed
   * 
   * @see Requirements 3.3, 3.7 - announcement conditions
   */
  private shouldAnnounce(): boolean {
    if (!this.announceChanges) {
      return false;
    }
    
    // Only announce if there was a previous count (not initial render)
    if (this._previousCount === null) {
      return false;
    }
    
    // Only announce if count actually changed
    return this._previousCount !== this.count;
  }
  
  /**
   * Render the component into shadow DOM.
   * 
   * @see Requirements: 3.1-3.10, 4.7, 5.1, 6.3
   */
  private render(): void {
    // Check if badge should be rendered
    if (!this.shouldRender()) {
      this._shadowRoot.innerHTML = '';
      return;
    }
    
    const size = this.size;
    const testID = this.testID;
    const displayText = this.getDisplayText();
    const announcementText = this.getAnnouncementText();
    const shouldAnnounce = this.shouldAnnounce();
    
    // Generate CSS classes
    const badgeClasses = [
      'badge-count-notification',
      `badge-count-notification--${size}`,
    ].join(' ');
    
    // Generate test ID attribute
    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';
    
    // Live region attributes for accessibility
    // @see Requirement 3.8 - aria-live="polite" and aria-atomic="true"
    const liveRegionAttrs = this.announceChanges 
      ? ' aria-live="polite" aria-atomic="true"'
      : '';
    
    // Visually hidden announcement text
    // Only include if announcements are enabled
    // @see Requirement 3.8 - visually hidden announcement text
    const announcementHtml = this.announceChanges
      ? `<span class="badge-count-notification__announcement" role="status">${this.escapeHtml(announcementText)}</span>`
      : '';
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        :host([hidden]) {
          display: none;
        }
        ${badgeStyles}
      </style>
      <span class="${badgeClasses}"${testIDAttr}${liveRegionAttrs}>
        <span class="badge-count-notification__text">${this.escapeHtml(displayText)}</span>
        ${announcementHtml}
      </span>
    `;
    
    // Reset previous count after render
    this._previousCount = this.count;
  }
  
  /**
   * Escape HTML entities to prevent XSS attacks.
   */
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

/**
 * Register the custom element.
 */
if (!customElements.get('badge-count-notification')) {
  customElements.define('badge-count-notification', BadgeCountNotification);
}

/**
 * Default export for convenience.
 */
export default BadgeCountNotification;
