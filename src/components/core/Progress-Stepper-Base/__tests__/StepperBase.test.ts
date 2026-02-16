/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify Progress-Stepper-Base behavioral contracts, composition, state derivation, validation, and accessibility
 */

/**
 * Stepper-Base Tests
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * 
 * Tests verify:
 * - Stemma behavioral contracts: naming, type classification, prop validation, accessibility (Req 13.2, 13.8, 13.11, 13.14)
 * - Composition: renders nodes and connectors, no labels (Req 15.15-15.18)
 * - State derivation: priority logic error > completed > current > incomplete (Req 15.20)
 * - Validation: dev throw, production warn+clamp for >8 steps, throw for sm size (Req 15.35-15.37)
 * - Accessibility: ARIA progressbar, aria-value* attributes (Req 15.26)
 * 
 * Requirements: 13.2, 13.8, 13.11, 13.14, 15.11-15.15, 15.16-15.18, 15.20, 15.26, 15.35-15.37, 15.39
 * @see .kiro/specs/048-progress-family/requirements.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { ProgressStepperBase } from '../platforms/web/ProgressStepperBase.web';
import {
  deriveStepperNodeState,
  deriveStepperNodeContent,
  deriveConnectorState,
  clampCurrentStep,
  filterErrorSteps,
  STEPPER_MAX_STEPS,
} from '../types';

// ============================================================================
// Helpers
// ============================================================================

/** Create a stepper component with given attributes */
function createStepper(attrs: Record<string, string> = {}): ProgressStepperBase {
  const el = document.createElement('progress-stepper-base') as ProgressStepperBase;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  return el;
}

/** Read the schema YAML for Stemma contract assertions */
function readSchema(): string {
  const schemaPath = path.resolve(
    process.cwd(),
    'src/components/core/Progress-Stepper-Base/Progress-Stepper-Base.schema.yaml'
  );
  return fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Progress-Stepper-Base', () => {
  let schemaContent: string;

  beforeAll(() => {
    if (!customElements.get('progress-stepper-base')) {
      customElements.define('progress-stepper-base', ProgressStepperBase);
    }
    schemaContent = readSchema();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ==========================================================================
  // Stemma Behavioral Contracts (Req 13.2, 13.8, 13.11, 13.14)
  // ==========================================================================

  describe('Stemma Behavioral Contracts', () => {
    it('follows [Family]-[Type]-[Variant] naming pattern (Req 13.2)', () => {
      expect(schemaContent).toMatch(/name:\s*Progress-Stepper-Base/);
      expect(schemaContent).toMatch(/family:\s*Progress-Indicator/);
    });

    it('is classified as semantic component type (Req 13.8)', () => {
      expect(schemaContent).toMatch(/type:\s*semantic/);
    });

    it('requires totalSteps and currentStep props (Req 13.11)', () => {
      expect(schemaContent).toMatch(/totalSteps:[\s\S]*?required:\s*true/);
      expect(schemaContent).toMatch(/currentStep:[\s\S]*?required:\s*true/);
    });

    it('specifies role="progressbar" and aria-value* in accessibility (Req 13.14)', () => {
      expect(schemaContent).toMatch(/role='progressbar'/);
      expect(schemaContent).toMatch(/aria-value/);
    });
  });

  // ==========================================================================
  // Composition Tests (Req 15.15-15.18, 11.7-11.13)
  // ==========================================================================

  describe('Composition', () => {
    it('renders Node-Base primitives for each step (Req 15.16)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3', size: 'md' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      expect(nodes.length).toBe(5);
    });

    it('renders n-1 Connector-Base elements between nodes (Req 15.16)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3' });
      const connectors = el.shadowRoot!.querySelectorAll('progress-indicator-connector-base');
      expect(connectors.length).toBe(4);
    });

    it('does NOT render Label-Base elements (Req 15.16)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3' });
      const labels = el.shadowRoot!.querySelectorAll('progress-indicator-label-base');
      expect(labels.length).toBe(0);
    });

    it('passes content="checkmark" to completed nodes (Req 15.18)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '4' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // Steps 1-3 are completed (before currentStep=4)
      for (let i = 0; i < 3; i++) {
        expect(nodes[i].getAttribute('content')).toBe('checkmark');
      }
    });

    it('passes content="none" to current/incomplete/error nodes (Req 15.18)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3', 'error-steps': '5' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // Step 3 = current, step 4 = incomplete, step 5 = error — all should be 'none'
      expect(nodes[2].getAttribute('content')).toBe('none');
      expect(nodes[3].getAttribute('content')).toBe('none');
      expect(nodes[4].getAttribute('content')).toBe('none');
    });

    it('passes size prop to each node', () => {
      const el = createStepper({ 'total-steps': '3', 'current-step': '1', size: 'lg' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      nodes.forEach((node) => {
        expect(node.getAttribute('size')).toBe('lg');
      });
    });
  });


  // ==========================================================================
  // State Derivation Tests (Req 15.20, 10.3-10.7)
  // ==========================================================================

  describe('State Derivation', () => {
    it('deriveStepperNodeState returns "error" for steps in errorSteps (highest priority) (Req 10.3)', () => {
      expect(deriveStepperNodeState(2, 3, [2])).toBe('error');
    });

    it('deriveStepperNodeState returns "completed" for steps before currentStep (Req 10.4)', () => {
      expect(deriveStepperNodeState(1, 3, [])).toBe('completed');
      expect(deriveStepperNodeState(2, 3, [])).toBe('completed');
    });

    it('deriveStepperNodeState returns "current" for currentStep (Req 10.5)', () => {
      expect(deriveStepperNodeState(3, 3, [])).toBe('current');
    });

    it('deriveStepperNodeState returns "incomplete" for steps after currentStep (Req 10.6)', () => {
      expect(deriveStepperNodeState(4, 3, [])).toBe('incomplete');
      expect(deriveStepperNodeState(5, 3, [])).toBe('incomplete');
    });

    it('error overrides completed state (priority: error > completed) (Req 10.7)', () => {
      // Step 1 is before currentStep=3 (would be completed), but is in errorSteps
      expect(deriveStepperNodeState(1, 3, [1])).toBe('error');
    });

    it('error overrides current state (priority: error > current) (Req 10.7)', () => {
      // Step 3 is currentStep, but is in errorSteps
      expect(deriveStepperNodeState(3, 3, [3])).toBe('error');
    });

    it('deriveStepperNodeContent returns "checkmark" for completed, "none" for others', () => {
      expect(deriveStepperNodeContent('completed')).toBe('checkmark');
      expect(deriveStepperNodeContent('current')).toBe('none');
      expect(deriveStepperNodeContent('incomplete')).toBe('none');
      expect(deriveStepperNodeContent('error')).toBe('none');
    });

    it('deriveConnectorState returns "active" when both sides are completed', () => {
      expect(deriveConnectorState('completed', 'completed')).toBe('active');
    });

    it('deriveConnectorState returns "inactive" when either side is not completed', () => {
      expect(deriveConnectorState('completed', 'current')).toBe('inactive');
      expect(deriveConnectorState('current', 'incomplete')).toBe('inactive');
      expect(deriveConnectorState('incomplete', 'incomplete')).toBe('inactive');
    });

    it('rendered nodes reflect correct state derivation with priority', () => {
      // 5 steps, current=3, error on step 1
      const el = createStepper({ 'total-steps': '5', 'current-step': '3', 'error-steps': '1' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      expect(nodes[0].getAttribute('state')).toBe('error');      // step 1: error (overrides completed)
      expect(nodes[1].getAttribute('state')).toBe('completed');   // step 2: completed
      expect(nodes[2].getAttribute('state')).toBe('current');     // step 3: current
      expect(nodes[3].getAttribute('state')).toBe('incomplete');  // step 4: incomplete
      expect(nodes[4].getAttribute('state')).toBe('incomplete');  // step 5: incomplete
    });

    it('rendered connectors reflect correct state derivation', () => {
      // 4 steps, current=4 (all completed except current)
      const el = createStepper({ 'total-steps': '4', 'current-step': '4' });
      const connectors = el.shadowRoot!.querySelectorAll('progress-indicator-connector-base');
      // Connectors: between 1-2 (completed-completed=active), 2-3 (completed-completed=active), 3-4 (completed-current=inactive)
      expect(connectors[0].getAttribute('state')).toBe('active');
      expect(connectors[1].getAttribute('state')).toBe('active');
      expect(connectors[2].getAttribute('state')).toBe('inactive');
    });
  });

  // ==========================================================================
  // Validation Tests (Req 15.35-15.37, 8.4-8.5, 8.8-8.10)
  // ==========================================================================

  describe('Validation', () => {
    it('STEPPER_MAX_STEPS constant is 8 (Req 8.4)', () => {
      expect(STEPPER_MAX_STEPS).toBe(8);
    });

    it('clampCurrentStep clamps below lower bound to 1 (Req 15.36)', () => {
      expect(clampCurrentStep(0, 5)).toBe(1);
      expect(clampCurrentStep(-3, 5)).toBe(1);
    });

    it('clampCurrentStep clamps above upper bound to totalSteps (Req 15.36)', () => {
      expect(clampCurrentStep(10, 5)).toBe(5);
    });

    it('clampCurrentStep returns value when within bounds', () => {
      expect(clampCurrentStep(3, 5)).toBe(3);
    });

    it('filterErrorSteps removes indices outside valid range (Req 15.37)', () => {
      const result = filterErrorSteps([0, 1, 3, 6, 10], 5);
      expect(result).toEqual([1, 3]);
    });

    it('throws error when size="sm" (Req 8.10)', () => {
      expect(() => {
        createStepper({ 'total-steps': '3', 'current-step': '1', size: 'sm' });
      }).toThrow("Steppers require size 'md' or 'lg'");
    });

    it('warns and clamps in production when totalSteps > 8 (Req 8.5, 15.35)', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const el = createStepper({ 'total-steps': '12', 'current-step': '1' });
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('maximum is 8'));
        // Should render only 8 nodes (clamped)
        const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
        expect(nodes.length).toBe(8);
      } finally {
        warnSpy.mockRestore();
        process.env.NODE_ENV = origEnv;
      }
    });

    it('clamps currentStep outside bounds in rendered output (Req 15.36)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '10' });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // currentStep clamped to 5, so last node should be current
      const lastNode = nodes[nodes.length - 1];
      expect(lastNode.getAttribute('state')).toBe('current');
    });
  });


  // ==========================================================================
  // Accessibility Tests (Req 15.26, 7.3, 7.12)
  // ==========================================================================

  describe('Accessibility', () => {
    it('applies role="progressbar" to container (Req 7.3)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '2' });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container).not.toBeNull();
    });

    it('sets aria-valuenow to currentStep (Req 7.3)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3' });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container!.getAttribute('aria-valuenow')).toBe('3');
    });

    it('sets aria-valuemin to 1 (Req 7.3)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3' });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container!.getAttribute('aria-valuemin')).toBe('1');
    });

    it('sets aria-valuemax to totalSteps (Req 7.3)', () => {
      const el = createStepper({ 'total-steps': '5', 'current-step': '3' });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container!.getAttribute('aria-valuemax')).toBe('5');
    });

    it('aria-label defaults to "Step X of Y" (Req 7.12)', () => {
      const el = createStepper({ 'total-steps': '8', 'current-step': '4' });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container!.getAttribute('aria-label')).toBe('Step 4 of 8');
    });

    it('supports custom accessibility label override', () => {
      const el = createStepper({
        'total-steps': '5',
        'current-step': '2',
        'accessibility-label': 'Progress: step 2 of 5',
      });
      const container = el.shadowRoot!.querySelector('[role="progressbar"]');
      expect(container!.getAttribute('aria-label')).toBe('Progress: step 2 of 5');
    });
  });
});
