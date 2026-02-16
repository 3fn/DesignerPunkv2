/**
 * Progress-Stepper-Detailed Component for Web Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Detailed)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Detailed
 * 
 * Detailed stepper composing Node-Base, Connector-Base, and Label-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * Icon precedence: completed = checkmark always, user icon for current/incomplete/error.
 * 
 * @module Progress-Stepper-Detailed/platforms/web
 * @see Requirements: 4.1-4.16, 11.14-11.22
 * @see .kiro/specs/048-progress-family/design.md
 */

/// <reference lib="dom" />

import {
  StepDefinition,
  StepperDetailedSize,
  NodeState,
  STEPPER_DETAILED_DEFAULTS,
  STEPPER_DETAILED_MAX_STEPS,
  deriveStepperDetailedNodeState,
  deriveStepperDetailedNodeContent,
  deriveDetailedConnectorState,
  clampDetailedCurrentStep,
  filterDetailedErrorSteps,
} from '../../types';

// Import CSS as string for browser bundle compatibility
import stepperDetailedStyles from './ProgressStepperDetailed.styles.css';


/**
 * Progress-Stepper-Detailed Web Component
 * 
 * A native web component that composes Progress-Indicator-Node-Base,
 * Progress-Indicator-Connector-Base, and Progress-Indicator-Label-Base
 * primitives to create a detailed stepper with labels and optional icons.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Composes Node-Base + Connector-Base + Label-Base primitives
 * - State priority: error > completed > current > incomplete
 * - Icon precedence: completed = checkmark always, user icon for others
 * - ARIA: role="list" with each step as role="listitem"
 * - Validates steps.length ≤ 8 (dev throw, production warn+clamp)
 * - Throws if size='sm' (steppers require md or lg)
 * 
 * @example
 * ```html
 * <progress-stepper-detailed
 *   steps='[{"label":"Info"},{"label":"Payment"},{"label":"Review"}]'
 *   current-step="2"
 *   size="md"
 * ></progress-stepper-detailed>
 * ```
 * 
 * @see Requirements: 4.1-4.16, 11.14-11.22
 */
export class ProgressStepperDetailed extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['steps', 'current-step', 'size', 'error-steps', 'accessibility-label', 'test-id'];
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
   * Get steps array from JSON attribute.
   * @see Requirements 4.1-4.2
   */
  get steps(): StepDefinition[] {
    const attr = this.getAttribute('steps');
    if (!attr) return [];
    try {
      const parsed = JSON.parse(attr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set steps(value: StepDefinition[]) {
    this.setAttribute('steps', JSON.stringify(value));
  }

  /**
   * Get current active step (1-indexed).
   * @see Requirement 4.11
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
   * @see Requirement 4.16 - sm not supported
   */
  get size(): StepperDetailedSize {
    const size = this.getAttribute('size');
    return (size === 'md' || size === 'lg') ? size : STEPPER_DETAILED_DEFAULTS.size;
  }

  set size(value: StepperDetailedSize) {
    this.setAttribute('size', value);
  }

  /**
   * Get error steps as array of 1-indexed step numbers.
   * @see Requirement 4.12
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
   * Render the detailed stepper into shadow DOM.
   * 
   * Rendering logic:
   * 1. Validate size ≠ 'sm' (throw always)
   * 2. Validate steps.length (dev throw, production warn+clamp)
   * 3. Clamp currentStep to valid range
   * 4. Filter errorSteps to valid range
   * 5. Derive node states with priority: error > completed > current > incomplete
   * 6. Apply icon precedence: completed = checkmark, user icon for others
   * 7. Render Node-Base, Connector-Base, and Label-Base primitives
   * 8. Apply ARIA role="list" with role="listitem" per step
   * 
   * @see Requirements 4.1-4.16, 11.14-11.22
   */
  private render(): void {
    const rawSize = this.getAttribute('size');

    // Validation: size='sm' always throws
    // @see Requirement 4.16, 8.10
    if (rawSize === 'sm') {
      throw new Error(
        "Steppers require size 'md' or 'lg'. " +
        "Size 'sm' is only supported for Pagination-Base."
      );
    }

    let steps = this.steps;
    const size = this.size;
    const testID = this.testID;
    const totalSteps = steps.length;

    // Validation: steps.length > 8
    // @see Requirements 4.9-4.10, 8.6-8.7
    if (totalSteps > STEPPER_DETAILED_MAX_STEPS) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        throw new Error(
          `Progress-Stepper-Detailed supports a maximum of ${STEPPER_DETAILED_MAX_STEPS} steps. ` +
          `Received ${totalSteps} steps. ` +
          `For longer flows, break into multiple sub-flows.`
        );
      } else {
        console.warn(
          `Progress-Stepper-Detailed: Received ${totalSteps} steps but maximum is ${STEPPER_DETAILED_MAX_STEPS}. ` +
          `Rendering first ${STEPPER_DETAILED_MAX_STEPS} steps only. ` +
          `Consider breaking into multiple sub-flows.`
        );
        steps = steps.slice(0, STEPPER_DETAILED_MAX_STEPS);
      }
    }

    const effectiveTotalSteps = steps.length;

    // Clamp currentStep to valid range
    // @see Requirement 4.11
    const currentStep = clampDetailedCurrentStep(this.currentStep, effectiveTotalSteps);

    // Filter errorSteps to valid range
    // @see Requirement 4.12
    const errorSteps = filterDetailedErrorSteps(this.errorSteps, effectiveTotalSteps);

    // ARIA attributes — role="list"
    // @see Requirements 4.13-4.15, 7.4-7.6, 7.13
    const ariaLabel = this.accessibilityLabel || `Step ${currentStep} of ${effectiveTotalSteps}`;

    const containerClasses = [
      'stepper-detailed',
      `stepper-detailed--${size}`,
    ].join(' ');

    const testIDAttr = testID ? ` data-testid="${this.escapeHtml(testID)}"` : '';

    // Derive node states
    // @see Requirements 4.3, 10.3-10.7
    const nodeStates: NodeState[] = [];
    for (let i = 1; i <= effectiveTotalSteps; i++) {
      nodeStates.push(deriveStepperDetailedNodeState(i, currentStep, errorSteps));
    }

    // Build step HTML
    let innerHTML = '';
    for (let i = 0; i < nodeStates.length; i++) {
      const state = nodeStates[i];
      const step = steps[i];
      const content = deriveStepperDetailedNodeContent(state, step);
      const iconAttr = (content === 'icon' && step.icon) ? ` icon="${this.escapeHtml(step.icon)}"` : '';

      // Build ARIA label for listitem
      // @see Requirements 4.13-4.15, 7.5-7.6
      let itemAriaLabel = `Step ${i + 1} of ${effectiveTotalSteps}: ${step.label}`;
      if (errorSteps.includes(i + 1)) {
        itemAriaLabel += ', error';
      }
      if (step.optional) {
        itemAriaLabel += ', optional';
      }

      // Build node row with connectors
      let nodeRowHTML = '';

      // Left side: connector from previous step or spacer
      if (i > 0) {
        const connectorState = deriveDetailedConnectorState(nodeStates[i - 1], nodeStates[i]);
        nodeRowHTML += `<div class="stepper-detailed__connector"><progress-indicator-connector-base state="${connectorState}"></progress-indicator-connector-base></div>`;
      } else {
        nodeRowHTML += `<div class="stepper-detailed__spacer"></div>`;
      }

      // Node
      nodeRowHTML += `<progress-indicator-node-base state="${state}" size="${size}" content="${content}"${iconAttr}></progress-indicator-node-base>`;

      // Right side: connector to next step or spacer
      if (i < nodeStates.length - 1) {
        const connectorState = deriveDetailedConnectorState(nodeStates[i], nodeStates[i + 1]);
        nodeRowHTML += `<div class="stepper-detailed__connector"><progress-indicator-connector-base state="${connectorState}"></progress-indicator-connector-base></div>`;
      } else {
        nodeRowHTML += `<div class="stepper-detailed__spacer"></div>`;
      }

      // Build label
      // @see Requirements 4.7-4.8, 11.16, 11.20
      const helperAttr = step.helperText ? ` helper-text="${this.escapeHtml(step.helperText)}"` : '';
      const optionalAttr = step.optional ? ' optional' : '';

      innerHTML += `<div class="stepper-detailed__step" role="listitem" aria-label="${this.escapeHtml(itemAriaLabel)}">`;
      innerHTML += `<div class="stepper-detailed__node-row">${nodeRowHTML}</div>`;
      innerHTML += `<div class="stepper-detailed__label"><progress-indicator-label-base label="${this.escapeHtml(step.label)}"${helperAttr}${optionalAttr}></progress-indicator-label-base></div>`;
      innerHTML += `</div>`;
    }

    this._shadowRoot.innerHTML = `
      <style>
        ${stepperDetailedStyles}
      </style>
      <div class="${containerClasses}"${testIDAttr} role="list" aria-label="${this.escapeHtml(ariaLabel)}">
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
if (!customElements.get('progress-stepper-detailed')) {
  customElements.define('progress-stepper-detailed', ProgressStepperDetailed);
}

export default ProgressStepperDetailed;
