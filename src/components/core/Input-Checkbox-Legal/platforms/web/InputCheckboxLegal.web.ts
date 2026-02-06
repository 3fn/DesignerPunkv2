/**
 * Input-Checkbox-Legal Web Component
 * 
 * Web platform implementation of the Input-Checkbox-Legal component using Web Components.
 * Extends/wraps Input-Checkbox-Base with legal consent-specific functionality.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic Variant (extends Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * 
 * Key Differences from Input-Checkbox-Base:
 * - Fixed sizing: lg box (40px) with labelSm typography
 * - Fixed label alignment: top (for multi-line legal text)
 * - No indeterminate state support
 * - Explicit consent enforcement (prevents pre-checking)
 * - Audit trail support (timestamp, legalTextId, version)
 * - Required indicator visible by default
 * - No label truncation
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * 
 * @module Input-Checkbox-Legal/platforms/web
 * @see Requirements: 9.1-9.11
 */

import {
  ConsentChangeData,
  INPUT_CHECKBOX_LEGAL_OBSERVED_ATTRIBUTES,
  INPUT_CHECKBOX_LEGAL_DEFAULTS
} from '../../types';
import { InputCheckboxBaseElement } from '../../../Input-Checkbox-Base/platforms/web/InputCheckboxBase.web';

// Import CSS as string for browser bundle compatibility
import legalStyles from './InputCheckboxLegal.web.css';

/** Counter for generating unique IDs when none provided */
let legalCheckboxIdCounter = 0;

/**
 * Input-Checkbox-Legal Web Component
 * 
 * Custom element implementing a legal consent checkbox with Shadow DOM encapsulation.
 * Wraps Input-Checkbox-Base with additional legal consent functionality.
 * 
 * @example
 * ```html
 * <input-checkbox-legal
 *   label="I agree to the Terms of Service and Privacy Policy"
 *   legal-text-id="tos-v2"
 *   legal-text-version="2.0.0"
 * ></input-checkbox-legal>
 * ```
 */
export class InputCheckboxLegalElement extends HTMLElement {
  /** Shadow DOM root */
  private _shadowRoot: ShadowRoot;

  /** Reference to the wrapped base checkbox */
  private _baseCheckbox: InputCheckboxBaseElement | null = null;

  /** Generated unique ID for label association */
  private _generatedId: string;

  /** Flag to track if explicit consent warning has been shown */
  private _consentWarningShown: boolean = false;

  /** Base onChange callback (JS property, not attribute) */
  onChange: ((checked: boolean) => void) | null = null;

  /** Consent change callback with audit trail data (JS property, not attribute) */
  onConsentChange: ((data: ConsentChangeData) => void) | null = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._generatedId = `legal-checkbox-${++legalCheckboxIdCounter}`;
  }

  // ---------------------------------------------------------------------------
  // Observed Attributes
  // ---------------------------------------------------------------------------

  static get observedAttributes(): string[] {
    return [...INPUT_CHECKBOX_LEGAL_OBSERVED_ATTRIBUTES];
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback(): void {
    // Enforce explicit consent before rendering
    // @see Requirements: 9.3-9.4 - Prevent pre-checking with console warning
    this._enforceExplicitConsent();
    
    this.render();
    this._attachListeners();
  }

  disconnectedCallback(): void {
    this._detachListeners();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    
    // Re-enforce explicit consent when checked attribute changes
    if (name === 'checked') {
      this._enforceExplicitConsent();
    }
    
    if (this.isConnected) {
      this.render();
      this._attachListeners();
    }
  }

  // ---------------------------------------------------------------------------
  // Property Accessors (attribute reflection)
  // ---------------------------------------------------------------------------

  get checked(): boolean {
    return this.hasAttribute('checked');
  }

  set checked(value: boolean) {
    // Enforce explicit consent when setting checked programmatically
    if (value && this.requiresExplicitConsent) {
      this._showConsentWarning();
      // Override to false
      this.removeAttribute('checked');
      return;
    }
    
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

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

  get errorMessage(): string | null {
    return this.getAttribute('error-message');
  }

  set errorMessage(value: string | null) {
    if (value) {
      this.setAttribute('error-message', value);
    } else {
      this.removeAttribute('error-message');
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

  get name(): string | null {
    return this.getAttribute('name');
  }

  set name(value: string | null) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  get value(): string {
    return this.getAttribute('value') || 'on';
  }

  set value(value: string) {
    this.setAttribute('value', value);
  }

  /**
   * Whether explicit consent is required.
   * 
   * When true, prevents pre-checking the checkbox and emits console warning
   * if checked={true} is passed.
   * 
   * @default true
   * @see Requirements: 9.3-9.4
   */
  get requiresExplicitConsent(): boolean {
    const attr = this.getAttribute('requires-explicit-consent');
    // Default to true if attribute not set
    if (attr === null) return INPUT_CHECKBOX_LEGAL_DEFAULTS.requiresExplicitConsent;
    // 'false' string means false, anything else (including empty string) means true
    return attr !== 'false';
  }

  set requiresExplicitConsent(value: boolean) {
    if (value) {
      this.setAttribute('requires-explicit-consent', '');
    } else {
      this.setAttribute('requires-explicit-consent', 'false');
    }
  }

  /**
   * Legal text ID for audit trail.
   * 
   * @see Requirements: 9.6
   */
  get legalTextId(): string | null {
    return this.getAttribute('legal-text-id');
  }

  set legalTextId(value: string | null) {
    if (value) {
      this.setAttribute('legal-text-id', value);
    } else {
      this.removeAttribute('legal-text-id');
    }
  }

  /**
   * Legal text version for audit trail.
   * 
   * @see Requirements: 9.7
   */
  get legalTextVersion(): string | null {
    return this.getAttribute('legal-text-version');
  }

  set legalTextVersion(value: string | null) {
    if (value) {
      this.setAttribute('legal-text-version', value);
    } else {
      this.removeAttribute('legal-text-version');
    }
  }

  /**
   * Whether to show required indicator.
   * 
   * @default true
   * @see Requirements: 9.8-9.9
   */
  get showRequiredIndicator(): boolean {
    const attr = this.getAttribute('show-required-indicator');
    // Default to true if attribute not set
    if (attr === null) return INPUT_CHECKBOX_LEGAL_DEFAULTS.showRequiredIndicator;
    // 'false' string means false, anything else (including empty string) means true
    return attr !== 'false';
  }

  set showRequiredIndicator(value: boolean) {
    if (value) {
      this.setAttribute('show-required-indicator', '');
    } else {
      this.setAttribute('show-required-indicator', 'false');
    }
  }

  // ---------------------------------------------------------------------------
  // Explicit Consent Enforcement
  // ---------------------------------------------------------------------------

  /**
   * Enforce explicit consent by preventing pre-checked state.
   * 
   * If requiresExplicitConsent is true and checked is true, override to false
   * and emit console warning.
   * 
   * @see Requirements: 9.3-9.4
   */
  private _enforceExplicitConsent(): void {
    if (this.requiresExplicitConsent && this.hasAttribute('checked')) {
      this._showConsentWarning();
      this.removeAttribute('checked');
    }
  }

  /**
   * Show console warning for explicit consent violation.
   * 
   * Only shows warning once per component instance to avoid spam.
   * 
   * @see Requirements: 9.4 - Console warning for pre-check override
   */
  private _showConsentWarning(): void {
    if (!this._consentWarningShown) {
      console.warn(
        'Input-Checkbox-Legal: Pre-checked state not allowed with requiresExplicitConsent. ' +
        'Overriding to unchecked. Legal consent must be explicitly given by the user.'
      );
      this._consentWarningShown = true;
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  private render(): void {
    const id = this.getAttribute('id') || this._generatedId;
    const labelText = this.label;
    const helperText = this.helperText;
    const errorMessage = this.errorMessage;
    const testId = this.testID;
    const inputName = this.name;
    const inputValue = this.value;
    const showRequired = this.showRequiredIndicator;
    
    // Get checked state (already enforced by _enforceExplicitConsent)
    const isChecked = this.checked;

    // Build test-id attribute
    const testIdAttr = testId ? ` test-id="${testId}"` : '';
    
    // Build name attribute
    const nameAttr = inputName ? ` name="${inputName}"` : '';
    
    // Build helper text attribute
    const helperAttr = helperText ? ` helper-text="${this._escapeAttr(helperText)}"` : '';
    
    // Build error message attribute
    const errorAttr = errorMessage ? ` error-message="${this._escapeAttr(errorMessage)}"` : '';

    // Build required indicator HTML
    // @see Requirements: 9.8-9.9 - Required indicator default visible
    const requiredHTML = showRequired 
      ? '<span class="legal-checkbox__required" aria-hidden="true">Required</span>' 
      : '';

    // Render shadow DOM
    // Uses Input-Checkbox-Base with fixed configuration:
    // - size="lg" (40px box)
    // - label-align="top" (for multi-line legal text)
    // - No indeterminate attribute (not supported)
    // 
    // @see Requirements: 9.1-9.2 - Fixed sizing and alignment
    // @see Requirements: 9.10 - No indeterminate state support
    this._shadowRoot.innerHTML = `
      <style>${legalStyles}</style>
      <div class="legal-checkbox-container">
        ${requiredHTML}
        <input-checkbox-base
          class="legal-checkbox__base"
          id="${id}-base"
          label="${this._escapeAttr(labelText)}"
          size="lg"
          label-align="top"
          value="${inputValue}"
          ${isChecked ? 'checked' : ''}${nameAttr}${helperAttr}${errorAttr}${testIdAttr}
        ></input-checkbox-base>
      </div>
    `;

    // Store reference to base checkbox
    this._baseCheckbox = this._shadowRoot.querySelector('input-checkbox-base') as InputCheckboxBaseElement;
    
    // Apply labelSm typography override via CSS class
    // The CSS handles the typography override via ::part() selector
    // @see Requirements: 9.1 - Fixed sizing: lg box with labelSm typography
    // @see Requirements: 9.11 - Label text SHALL NOT be truncated
  }

  /**
   * Escape attribute value for safe HTML insertion.
   */
  private _escapeAttr(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ---------------------------------------------------------------------------
  // Event Handling
  // ---------------------------------------------------------------------------

  /**
   * Handle change event from base checkbox.
   * 
   * Generates ISO 8601 timestamp and calls both onChange and onConsentChange
   * callbacks with appropriate data.
   * 
   * @see Requirements: 9.5-9.7 - Consent change with timestamp and audit trail
   */
  private _onBaseChange = (event: Event): void => {
    const customEvent = event as CustomEvent<{ checked: boolean }>;
    const newChecked = customEvent.detail.checked;

    // Update our checked attribute to reflect new state
    if (newChecked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    // Generate ISO 8601 timestamp
    // @see Requirements: 9.5 - ISO 8601 timestamp string
    const timestamp = new Date().toISOString();

    // Fire base onChange callback
    this.onChange?.(newChecked);

    // Build consent change data with audit trail
    // @see Requirements: 9.5-9.7 - Audit trail data
    const consentData: ConsentChangeData = {
      consented: newChecked,
      timestamp
    };

    // Include audit trail data if provided
    // @see Requirements: 9.6 - legalTextId in callback
    if (this.legalTextId) {
      consentData.legalTextId = this.legalTextId;
    }

    // @see Requirements: 9.7 - legalTextVersion in callback
    if (this.legalTextVersion) {
      consentData.legalTextVersion = this.legalTextVersion;
    }

    // Fire consent change callback
    this.onConsentChange?.(consentData);

    // Dispatch custom consent-change event
    // @see Design doc: Input-Checkbox-Legal Implementation section
    this.dispatchEvent(
      new CustomEvent('consent-change', {
        detail: consentData,
        bubbles: true,
        composed: true
      })
    );

    // Also dispatch standard change event for compatibility
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: newChecked },
        bubbles: true,
        composed: true
      })
    );
  };

  private _attachListeners(): void {
    this._baseCheckbox?.addEventListener('change', this._onBaseChange);
  }

  private _detachListeners(): void {
    this._baseCheckbox?.removeEventListener('change', this._onBaseChange);
  }
}

// Register custom element
if (!customElements.get('input-checkbox-legal')) {
  customElements.define('input-checkbox-legal', InputCheckboxLegalElement);
}

