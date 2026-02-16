/**
 * Progress-Stepper-Base Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Base
 * 
 * Stepper indicator composing Node-Base and Connector-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * 
 * @module Progress-Stepper-Base/platforms/web
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

import {
  StepperSize,
  STEPPER_BASE_DEFAULTS,
  STEPPER_MAX_STEPS,
  deriveStepperNodeState,
  deriveStepperNodeContent,
  deriveConnectorState,
  clampCurrentStep,
  filterErrorSteps,
} from '../../types';

// Import CSS as string for browser bundle compatibility
import stepperStyles from './ProgressStepperBase.styles.css';

/**
 * Progress-Stepper-Base Web Component
 * 
 * A native web component that composes Progress-Indicator-Node-Base and
 * Progress-Indicator-Connector-Base primitives to create a stepper indicator
 * for linear multi-step flows.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Composes Node-Base + Connector-Base primitives (no labels)
 * - State priority: error > completed > current > incomplete
 * - Completed nodes get content='checkmark', others get content='none'
 * - Connectors: active between completed nodes, inactive otherwise
 * - ARIA: role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
 * - Validates totalSteps ≤ 8 (dev throw, production warn+clamp)
 * - Throws if size='sm' (steppers require md or lg)
 * 
 * @example
 * ```html
 * <progress-stepper-base total-steps="5" current-step="3" size="md"></progress-stepper-base>
 * ```
 * 
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 */
export class ProgressStepperBase extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['total-steps', 'current-step', 'size', 'error-steps', 'accessibility-label', 'test-id'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  // ============================================================================
  // Property Getters/Setters
  // ============================================================================

  /**
   * Get total number of steps.
   * @see Requirements 3.12-3.13
   */
  get totalSteps(): number {
    const attr = this.getAttribute('total-steps');
    if (attr === null) return 0;
    const val = parseInt(attr, 10);
    return isNaN(val) ? 0 : val;
  }

  set totalSteps(value: number) {
    this.setAttribute('total-steps', String(value));
  }

  /**
   * Get current active step (1-indexed).
   * @see Requirement 3.14
   */
  get currentStep(): number {
    const attr = this.getAttribute('current-step');
    if (attr === null) return 1;
    const val = parseInt(attr, 10);
    return isNaN(val) ? 1 : val;
  }

  set currentStep(value: number) {
    this.setAttribute('current-step', String(value));
  }

  /**
   * Get size variant.
   * @see Requirement 3.17 - sm not supported
   */
  get size(): StepperSize {
    const size = this.getAttribute('size');
    return (size === 'md' || size === 'lg') ? size : STEPPER_BASE_DEFAULTS.size;
  }

  set size(value: StepperSize) {
    this.setAttribute('size', value);
  }

  /**
   * Get error steps as array of 1-indexed step numbers.
   * Parses comma-separated string attribute.
   * @see Requirements 3.4, 3.15
   */
  get errorSteps(): number[] {
    const attr = this.getAttribute('error-steps');
    if (!attr) return [];
    return attr.split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
  }

  set errorSteps(value: number[]) {
    this.setAttribute('error-steps', value.join(','));
  }

  get accessibilityLabel(): string | null {
    return this.getAttribute('accessibility-label');
  }

  set accessibilityLabel(value: string | null) {
    if (value) {
      this.setAttribute('accessibility-label', value);
    } else {
      this.removeAttribute('accessibility-label');
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

  // ============================================================================
  // Rendering
  // ============================================================================

  /**
   * Render the stepper into shadow DOM.
   * 
   * Rendering logic:
   * 1. Validate size ≠ 'sm' (throw always)
   * 2. Validate totalSteps (dev throw, production warn+clamp)
   * 3. Clamp currentStep to valid range
   * 4. Filter errorSteps to valid range
   * 5. Derive node states with priority: error > completed > current > incomplete
   * 6. Render Node-Base and Connector-Base primitives
   * 7. Apply ARIA role="progressbar" with value attributes
   * 
   * @see Requirements 3.1-3.17, 10.3-10.7, 11.7-11.13
   */
  private render(): void {
    const rawSize = this.getAttribute('size');

    // Validation: size='sm' always throws
    // @see Requirement 3.17, 8.10
    if (rawSize === 'sm') {
      throw new Error(
        "Steppers require size 'md' or 'lg'. " +
        "Size 'sm' is only supported for Pagination-Base."
      );
    }

    let totalSteps = this.totalSteps;
    const size = this.size;
    const testID = this.testID;

    // Validation: totalSteps > 8
    // @see Requirements 3.12-3.13, 8.4-8.5
    if (totalSteps > STEPPER_MAX_STEPS) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        throw new Error(
          `Progress-Stepper-Base supports a maximum of ${STEPPER_MAX_STEPS} steps. ` +
          `Received ${totalSteps} steps. ` +
          `For longer flows, break into multiple sub-flows.`
        );
      } else {
        console.warn(
          `Progress-Stepper-Base: Received ${totalSteps} steps but maximum is ${STEPPER_MAX_STEPS}. ` +
          `Rendering first ${STEPPER_MAX_STEPS} steps only. ` +
          `Consider breaking into multiple sub-flows.`
        );
        totalSteps = STEPPER_MAX_STEPS;
      }
    }

    // Clamp currentStep to valid range
    // @see Requirement 3.14
    const currentStep = clampCurrentStep(this.currentStep, totalSteps);

    // Filter errorSteps to valid range
    // @see Requirement 3.15
    const errorSteps = filterErrorSteps(this.errorSteps, totalSteps);

    // ARIA attributes — role="progressbar"
    // @see Requirements 3.16, 7.3, 7.12
    const ariaLabel = this.accessibilityLabel || `Step ${currentStep} of ${totalSteps}`;

    const containerClasses = [
      'stepper',
      `stepper--${size}`,
    ].join(' ');

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    // Derive node states and build HTML
    // @see Requirements 10.3-10.7, 11.7-11.13
    const nodeStates = [];
    for (let i = 1; i <= totalSteps; i++) {
      nodeStates.push(deriveStepperNodeState(i, currentStep, errorSteps));
    }

    let innerHTML = '';
    for (let i = 0; i < nodeStates.length; i++) {
      const state = nodeStates[i];
      const content = deriveStepperNodeContent(state);

      // Render node
      innerHTML += `<progress-indicator-node-base state="${state}" size="${size}" content="${content}"></progress-indicator-node-base>`;

      // Render connector between nodes (n-1 connectors for n nodes)
      // @see Requirements 11.8, 11.12-11.13
      if (i < nodeStates.length - 1) {
        const connectorState = deriveConnectorState(nodeStates[i], nodeStates[i + 1]);
        innerHTML += `<progress-indicator-connector-base state="${connectorState}"></progress-indicator-connector-base>`;
      }
    }

    this._shadowRoot.innerHTML = `
      <style>
        ${stepperStyles}
      </style>
      <div class="${containerClasses}"${testIDAttr} role="progressbar" aria-valuenow="${currentStep}" aria-valuemin="1" aria-valuemax="${totalSteps}" aria-label="${this.escapeHtml(ariaLabel)}">
        ${innerHTML}
      </div>
    `;
  }

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

// Register the custom element
if (!customElements.get('progress-stepper-base')) {
  customElements.define('progress-stepper-base', ProgressStepperBase);
}

export default ProgressStepperBase;
