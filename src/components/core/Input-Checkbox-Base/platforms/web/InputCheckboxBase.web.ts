/**
 * Input-Checkbox-Base Web Component
 * 
 * Web platform implementation of the Input-Checkbox-Base component using Web Components.
 * Implements a binary selection control with three size variants, configurable label
 * alignment, and support for checked, unchecked, and indeterminate states.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Checkbox-Base
 * 
 * Features:
 * - Shadow DOM with hidden native checkbox for form compatibility
 * - Three size variants (sm, md, lg) with token-based sizing
 * - Label alignment (center, top) for single/multi-line labels
 * - Attribute reflection for reactive updates
 * - CSS logical properties for RTL support
 * - Icon-Base integration for checkmark/minus icons
 * - Blend utilities for hover state (8% darker border)
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * 
 * @module Input-Checkbox-Base/platforms/web
 * @see Requirements: 8.1, 8.2, 8.4, 2.1-2.9, 3.1-3.4, 1.4, 7.4
 */

import {
  CheckboxSize,
  LabelAlignment,
  LabelTypography,
  INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES,
  INPUT_CHECKBOX_BASE_DEFAULTS
} from '../../types';
import { createIconBase } from '../../../Icon-Base/platforms/web/IconBase.web';
import { IconBaseSize } from '../../../Icon-Base/types';

// Import theme-aware blend utilities for hover state color calculations
// Uses getBlendUtilities() factory for consistent state styling across components
// @see Requirements: 1.4, 7.4 - Hover applies blend.hoverDarker to border
import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import checkboxStyles from './InputCheckboxBase.web.css';

/** Counter for generating unique IDs when none provided */
let checkboxIdCounter = 0;

/**
 * Maps checkbox size to Icon-Base icon size.
 * 
 * - sm: icon.size050 (16px → rendered as 16px)
 * - md: icon.size075 (20px)
 * - lg: icon.size100 (24px)
 * 
 * @see Design doc: Token Usage by Size table
 */
const ICON_SIZE_MAP: Record<CheckboxSize, IconBaseSize> = {
  sm: 13,   // icon.size050 → 16px rendered
  md: 20,   // icon.size075 → 20px
  lg: 24    // icon.size100 → 24px
};

/**
 * Input-Checkbox-Base Web Component
 * 
 * Custom element implementing a checkbox with Shadow DOM encapsulation,
 * hidden native input for form compatibility, and token-based styling.
 * 
 * @example
 * ```html
 * <input-checkbox-base
 *   label="Accept terms"
 *   size="md"
 *   label-align="center"
 * ></input-checkbox-base>
 * ```
 */
export class InputCheckboxBaseElement extends HTMLElement {
  /** Shadow DOM root */
  private _shadowRoot: ShadowRoot;

  /** Reference to the hidden native checkbox */
  private _input: HTMLInputElement | null = null;

  /** Reference to the parent form element for reset handling */
  private _form: HTMLFormElement | null = null;

  /** Change callback (JS property, not attribute) */
  onChange: ((checked: boolean) => void) | null = null;

  /** Generated unique ID for label association */
  private _generatedId: string;

  /** Theme-aware blend utilities instance for hover state calculations */
  private _blendUtils: BlendUtilitiesResult;

  /** Cached hover border color (8% darker than default border) */
  private _hoverBorderColor: string = '';

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._generatedId = `checkbox-${++checkboxIdCounter}`;
    
    // Initialize theme-aware blend utilities
    // Uses getBlendUtilities() factory for consistent state styling
    // @see Requirements: 1.4, 7.4 - Hover applies blend.hoverDarker to border
    this._blendUtils = getBlendUtilities();
  }

  // ---------------------------------------------------------------------------
  // Observed Attributes
  // ---------------------------------------------------------------------------

  static get observedAttributes(): string[] {
    return [...INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES];
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  connectedCallback(): void {
    // Calculate blend colors for hover state
    // @see Requirements: 1.4, 7.4 - Hover applies blend.hoverDarker to border
    this._calculateBlendColors();
    
    // Find and attach to parent form for reset handling
    // @see Requirements: 8.8 - Form reset returns checkbox to unchecked state
    this._attachToForm();
    
    this.render();
    this._attachListeners();
  }

  disconnectedCallback(): void {
    this._detachListeners();
    this._detachFromForm();
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
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
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }

  set indeterminate(value: boolean) {
    if (value) {
      this.setAttribute('indeterminate', '');
    } else {
      this.removeAttribute('indeterminate');
    }
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }

  get size(): CheckboxSize {
    const attr = this.getAttribute('size');
    if (attr === 'sm' || attr === 'md' || attr === 'lg') return attr;
    return INPUT_CHECKBOX_BASE_DEFAULTS.size;
  }

  set size(value: CheckboxSize) {
    this.setAttribute('size', value);
  }

  get labelAlign(): LabelAlignment {
    const attr = this.getAttribute('label-align');
    if (attr === 'center' || attr === 'top') return attr;
    return INPUT_CHECKBOX_BASE_DEFAULTS.labelAlign;
  }

  set labelAlign(value: LabelAlignment) {
    this.setAttribute('label-align', value);
  }

  /**
   * Label typography override.
   * 
   * Allows overriding the default label typography which normally matches the size variant.
   * When set to 'inherit' (default), typography matches the size variant.
   * When set to 'sm', 'md', or 'lg', forces that typography regardless of size.
   * 
   * @see Requirements: 9.1 - Legal uses lg box + labelSm typography
   */
  get labelTypography(): LabelTypography {
    const attr = this.getAttribute('label-typography');
    if (attr === 'inherit' || attr === 'sm' || attr === 'md' || attr === 'lg') return attr;
    return INPUT_CHECKBOX_BASE_DEFAULTS.labelTypography;
  }

  set labelTypography(value: LabelTypography) {
    this.setAttribute('label-typography', value);
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

  /**
   * Form field name for form submission.
   * 
   * When provided, the checkbox value will be included in form submission
   * data under this name.
   * 
   * @see Requirements: 8.5, 8.7 - Form submission includes checkbox value
   */
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

  /**
   * Value submitted with form when checkbox is checked.
   * 
   * Defaults to 'on' (standard HTML checkbox behavior).
   * 
   * @see Requirements: 8.5, 8.7 - Form submission includes checkbox value
   */
  get value(): string {
    return this.getAttribute('value') || 'on';
  }

  set value(value: string) {
    this.setAttribute('value', value);
  }

  // ---------------------------------------------------------------------------
  // Blend Color Calculation
  // ---------------------------------------------------------------------------

  /**
   * Calculate blend colors for hover state using theme-aware blend utilities.
   * 
   * Reads the default border color from CSS custom properties and calculates
   * the hover border color by applying blend.hoverDarker (8% darker).
   * 
   * @see Requirements: 1.4 - Hover feedback on border
   * @see Requirements: 7.4 - Web hover applies blend.hoverDarker to border
   */
  private _calculateBlendColors(): void {
    // Get computed styles to read CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Get the default border color (unchecked state)
    // This is --color-select-not-selected-strong
    const defaultBorderColor = computedStyle.getPropertyValue('--color-select-not-selected-strong').trim();
    
    if (defaultBorderColor) {
      // Calculate hover border color using blend.hoverDarker (8% darker)
      // @see Requirements: 7.4 - Hover applies blend.hoverDarker to border
      this._hoverBorderColor = this._blendUtils.hoverColor(defaultBorderColor);
    }
  }

  // ---------------------------------------------------------------------------
  // Form Integration
  // ---------------------------------------------------------------------------

  /**
   * Attach to parent form for reset handling.
   * 
   * Finds the closest parent form element and attaches a reset event listener
   * to implement form reset behavior (always reset to unchecked).
   * 
   * @see Requirements: 8.8 - Form reset returns checkbox to unchecked state
   */
  private _attachToForm(): void {
    this._form = this.closest('form');
    if (this._form) {
      this._form.addEventListener('reset', this._onFormReset);
    }
  }

  /**
   * Detach from parent form.
   * 
   * Removes the reset event listener when the component is disconnected.
   */
  private _detachFromForm(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
      this._form = null;
    }
  }

  /**
   * Handle form reset event.
   * 
   * Resets the checkbox to unchecked state. Per DesignerPunk philosophy,
   * pre-checked checkboxes are not supported, so reset always goes to unchecked.
   * 
   * @see Requirements: 8.8 - Form reset returns checkbox to unchecked state
   */
  private _onFormReset = (): void => {
    // Always reset to unchecked (pre-checked checkboxes not supported)
    this.checked = false;
    this.indeterminate = false;
    
    // Sync the native input
    if (this._input) {
      this._input.checked = false;
      this._input.indeterminate = false;
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  private render(): void {
    const id = this.getAttribute('id') || this._generatedId;
    const inputId = `${id}-input`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const labelText = this.label;
    const size = this.size;
    const labelAlign = this.labelAlign;
    const labelTypography = this.labelTypography;
    const isChecked = this.checked;
    const isIndeterminate = this.indeterminate;
    const helperText = this.helperText;
    const errorMessage = this.errorMessage;
    const hasError = !!errorMessage;
    const testId = this.testID;
    const inputName = this.name;
    const inputValue = this.value;

    // Build CSS class list
    // Typography override class is only added when labelTypography is not 'inherit'
    // @see Requirements: 9.1 - Legal uses lg box + labelSm typography
    const classes = [
      'checkbox',
      `checkbox--${size}`,
      labelAlign === 'top' ? 'checkbox--align-top' : '',
      labelTypography !== 'inherit' ? `checkbox--label-${labelTypography}` : '',
      isChecked ? 'checkbox--checked' : '',
      isIndeterminate ? 'checkbox--indeterminate' : '',
      hasError ? 'checkbox--error' : ''
    ].filter(Boolean).join(' ');

    // Build icon HTML (only when checked or indeterminate)
    let iconHTML = '';
    if (isIndeterminate) {
      iconHTML = createIconBase({
        name: 'minus',
        size: ICON_SIZE_MAP[size],
        color: 'inherit'
      });
    } else if (isChecked) {
      iconHTML = createIconBase({
        name: 'check',
        size: ICON_SIZE_MAP[size],
        color: 'inherit'
      });
    }

    // Build test-id attribute
    const testIdAttr = testId ? ` data-testid="${testId}"` : '';

    // Build aria-describedby attribute for accessibility
    // Associates helper text and error message with the checkbox
    // @see Requirements: 5.5, 5.6 - aria-describedby for error and helper text association
    const describedByParts: string[] = [];
    if (errorMessage) describedByParts.push(errorId);
    if (helperText) describedByParts.push(helperId);
    const ariaDescribedBy = describedByParts.length > 0 
      ? ` aria-describedby="${describedByParts.join(' ')}"` 
      : '';

    // Build helper text HTML
    // @see Requirements: 5.1 - Helper text displayed below checkbox
    const helperTextHTML = helperText 
      ? `<span class="checkbox__helper" id="${helperId}">${helperText}</span>` 
      : '';

    // Build error message HTML
    // @see Requirements: 5.2 - Error message displayed below helper text
    const errorMessageHTML = errorMessage 
      ? `<span class="checkbox__error" id="${errorId}" role="alert">${errorMessage}</span>` 
      : '';

    // Build name attribute for form submission
    // @see Requirements: 8.5, 8.7 - Form submission includes checkbox value
    const nameAttr = inputName ? ` name="${inputName}"` : '';

    // Build label ID for explicit for/id association
    // @see Requirements: 6.1 - Associate label with checkbox via for/id
    const labelId = `${id}-label`;

    // Render shadow DOM
    // Structure uses explicit for/id association for accessibility
    // @see Requirements: 6.1 - Label associated with checkbox via for/id
    // @see Requirements: 6.2 - Screen reader announces state changes via aria-checked
    // @see Requirements: 6.4 - Space key toggle handled by native checkbox
    // @see Requirements: 6.6 - Touch target minimum 44px via CSS
    this._shadowRoot.innerHTML = `
      <style>${checkboxStyles}</style>
      <div class="checkbox-container">
        <div class="${classes}"${testIdAttr}>
          <input
            type="checkbox"
            class="checkbox__input"
            id="${inputId}"${nameAttr}
            value="${inputValue}"
            aria-labelledby="${labelId}"
            ${isChecked ? 'checked' : ''}
            ${isIndeterminate ? 'aria-checked="mixed"' : `aria-checked="${isChecked}"`}
            ${hasError ? 'aria-invalid="true"' : ''}${ariaDescribedBy}
          />
          <label for="${inputId}" class="checkbox__touch-target">
            <span class="checkbox__box">
              ${iconHTML}
            </span>
            <span class="checkbox__content">
              <span class="checkbox__label" id="${labelId}">${labelText}</span>
            </span>
          </label>
        </div>
        ${helperTextHTML}
        ${errorMessageHTML}
      </div>
    `;

    // Store reference to native input
    this._input = this._shadowRoot.querySelector('.checkbox__input');
    
    // Store reference to the checkbox wrapper for applying blend colors
    const checkboxWrapper = this._shadowRoot.querySelector('.checkbox') as HTMLElement;
    
    // Apply blend colors as CSS custom properties
    // @see Requirements: 1.4, 7.4 - Hover applies blend.hoverDarker to border
    if (checkboxWrapper && this._hoverBorderColor) {
      checkboxWrapper.style.setProperty('--_checkbox-hover-border', this._hoverBorderColor);
    }

    // Sync indeterminate property (not settable via attribute)
    if (this._input) {
      this._input.indeterminate = isIndeterminate;
    }
  }

  // ---------------------------------------------------------------------------
  // Event Handling
  // ---------------------------------------------------------------------------

  private _onInputChange = (): void => {
    if (!this._input) return;

    const newChecked = this._input.checked;

    // Update attribute to reflect new state
    if (newChecked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    // Clear indeterminate on user interaction
    if (this.indeterminate) {
      this.removeAttribute('indeterminate');
    }

    // Fire callback
    this.onChange?.(newChecked);

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: newChecked },
        bubbles: true,
        composed: true
      })
    );
  };

  private _attachListeners(): void {
    this._input?.addEventListener('change', this._onInputChange);
  }

  private _detachListeners(): void {
    this._input?.removeEventListener('change', this._onInputChange);
  }
}

// Register custom element
if (!customElements.get('input-checkbox-base')) {
  customElements.define('input-checkbox-base', InputCheckboxBaseElement);
}
