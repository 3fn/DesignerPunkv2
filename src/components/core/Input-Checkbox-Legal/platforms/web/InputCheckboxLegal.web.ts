/**
 * Input-Checkbox-Legal Web Component
 * 
 * Web platform implementation of the Input-Checkbox-Legal component using Web Components.
 * Wraps Input-Checkbox-Base with legal consent-specific functionality and fixed configuration.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic Variant (wraps Base)
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
 * Implementation Pattern:
 * This component wraps Input-Checkbox-Base, configuring it with fixed props
 * (size="lg", label-align="top", label-typography="sm") and adding Legal-specific
 * features on top. This reduces code duplication by ~80% and ensures Legal
 * inherits Base improvements automatically.
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
// Import Base component to ensure it's registered
import { InputCheckboxBaseElement } from '../../../Input-Checkbox-Base/platforms/web/InputCheckboxBase.web';

// Import CSS as string for browser bundle compatibility
import legalStyles from './InputCheckboxLegal.web.css';

/** Counter for generating unique IDs when none provided */
let legalCheckboxIdCounter = 0;

/**
 * Input-Checkbox-Legal Web Component
 * 
 * Custom element wrapping Input-Checkbox-Base with legal consent functionality.
 * Uses fixed lg box size with labelSm typography for legal text readability.
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

  /** Reference to the wrapped Input-Checkbox-Base element */
  private _baseCheckbox: InputCheckboxBaseElement | null = null;

  /** Reference to the parent form element for reset handling */
  private _form: HTMLFormElement | null = null;

  /** Generated unique ID for label association */
  private _generatedId: string;

  /** Flag to track if explicit consent warning has been shown */
  private _consentWarningShown: boolean = false;

  /** Flag to prevent re-syncing Base when change originates from Base */
  private _isHandlingBaseChange: boolean = false;

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
    this._enforceExplicitConsent();
    
    // Find and attach to parent form for reset handling
    this._attachToForm();
    
    this.render();
    this._attachListeners();
  }

  disconnectedCallback(): void {
    this._detachListeners();
    this._detachFromForm();
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
    
    // Warn if indeterminate is set (not supported)
    if (name === 'indeterminate' && newValue !== null) {
      console.warn(
        'Input-Checkbox-Legal: Indeterminate state is not supported for legal consent checkboxes. ' +
        'Legal consent is binary (checked/unchecked).'
      );
    }
    
    if (this.isConnected && !this._isHandlingBaseChange) {
      this._updateBaseCheckbox();
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

  get requiresExplicitConsent(): boolean {
    const attr = this.getAttribute('requires-explicit-consent');
    if (attr === null) return INPUT_CHECKBOX_LEGAL_DEFAULTS.requiresExplicitConsent;
    return attr !== 'false';
  }

  set requiresExplicitConsent(value: boolean) {
    if (value) {
      this.setAttribute('requires-explicit-consent', '');
    } else {
      this.setAttribute('requires-explicit-consent', 'false');
    }
  }

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

  get showRequiredIndicator(): boolean {
    const attr = this.getAttribute('show-required-indicator');
    if (attr === null) return INPUT_CHECKBOX_LEGAL_DEFAULTS.showRequiredIndicator;
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
  // Form Integration
  // ---------------------------------------------------------------------------

  private _attachToForm(): void {
    this._form = this.closest('form');
    if (this._form) {
      this._form.addEventListener('reset', this._onFormReset);
    }
  }

  private _detachFromForm(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
      this._form = null;
    }
  }

  private _onFormReset = (): void => {
    this.checked = false;
    if (this._baseCheckbox) {
      this._baseCheckbox.checked = false;
    }
  };

  // ---------------------------------------------------------------------------
  // Explicit Consent Enforcement
  // ---------------------------------------------------------------------------

  private _enforceExplicitConsent(): void {
    if (this.requiresExplicitConsent && this.hasAttribute('checked')) {
      this._showConsentWarning();
      this.removeAttribute('checked');
    }
  }

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
    const showRequired = this.showRequiredIndicator;

    // Build required indicator HTML
    const requiredHTML = showRequired 
      ? '<span class="checkbox__required" aria-hidden="true">Required</span>' 
      : '';

    // Render shadow DOM with wrapped Input-Checkbox-Base
    this._shadowRoot.innerHTML = `
      <style>${legalStyles}</style>
      <div class="checkbox-container checkbox--legal">
        ${requiredHTML}
        <input-checkbox-base
          id="${id}-base"
          size="lg"
          label-align="top"
          label-typography="sm"
        ></input-checkbox-base>
      </div>
    `;

    // Store reference to base checkbox
    this._baseCheckbox = this._shadowRoot.querySelector('input-checkbox-base') as InputCheckboxBaseElement;
    
    // Update base checkbox with current attributes
    this._updateBaseCheckbox();
  }

  /**
   * Update the wrapped Input-Checkbox-Base with current attribute values.
   * Forwards relevant attributes to Base while maintaining fixed configuration.
   */
  private _updateBaseCheckbox(): void {
    if (!this._baseCheckbox) return;

    // Forward relevant attributes to Base
    // Note: size, label-align, and label-typography are fixed and set in render()
    
    // Label
    if (this.label) {
      this._baseCheckbox.setAttribute('label', this.label);
    }
    
    // Checked state (already enforced for explicit consent)
    if (this.checked) {
      this._baseCheckbox.setAttribute('checked', '');
    } else {
      this._baseCheckbox.removeAttribute('checked');
    }
    
    // Helper text
    if (this.helperText) {
      this._baseCheckbox.setAttribute('helper-text', this.helperText);
    } else {
      this._baseCheckbox.removeAttribute('helper-text');
    }
    
    // Error message
    if (this.errorMessage) {
      this._baseCheckbox.setAttribute('error-message', this.errorMessage);
    } else {
      this._baseCheckbox.removeAttribute('error-message');
    }
    
    // Test ID
    if (this.testID) {
      this._baseCheckbox.setAttribute('test-id', this.testID);
    } else {
      this._baseCheckbox.removeAttribute('test-id');
    }
    
    // Form name
    if (this.name) {
      this._baseCheckbox.setAttribute('name', this.name);
    } else {
      this._baseCheckbox.removeAttribute('name');
    }
    
    // Form value
    this._baseCheckbox.setAttribute('value', this.value);
    
    // Never set indeterminate on Base (not supported for Legal)
    this._baseCheckbox.removeAttribute('indeterminate');
  }

  // ---------------------------------------------------------------------------
  // Event Handling
  // ---------------------------------------------------------------------------

  /**
   * Handle change event from wrapped Input-Checkbox-Base.
   * Transforms to consent-change event with audit trail data.
   */
  private _onBaseChange = (event: Event): void => {
    // Prevent the base's change event from bubbling up
    event.stopPropagation();
    
    const customEvent = event as CustomEvent<{ checked: boolean }>;
    const newChecked = customEvent.detail.checked;

    // Set flag to prevent attributeChangedCallback from re-syncing Base
    // (which would cause infinite loop or state reset)
    this._isHandlingBaseChange = true;
    
    // Update our checked attribute to reflect new state
    if (newChecked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
    
    // Clear flag after attribute update
    this._isHandlingBaseChange = false;

    // Generate ISO 8601 timestamp
    const timestamp = new Date().toISOString();

    // Fire base onChange callback
    this.onChange?.(newChecked);

    // Build consent change data with audit trail
    const consentData: ConsentChangeData = {
      consented: newChecked,
      timestamp
    };

    // Include audit trail data if provided
    if (this.legalTextId) {
      consentData.legalTextId = this.legalTextId;
    }

    if (this.legalTextVersion) {
      consentData.legalTextVersion = this.legalTextVersion;
    }

    // Fire consent change callback
    this.onConsentChange?.(consentData);

    // Dispatch custom consent-change event
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
