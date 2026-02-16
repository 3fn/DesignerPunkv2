/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify Progress-Stepper-Detailed behavioral contracts, composition, icon precedence, state derivation, validation, and accessibility
 */

/**
 * Stepper-Detailed Tests
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Detailed)
 * 
 * Tests verify:
 * - Stemma behavioral contracts: naming, type classification, prop validation, accessibility (Req 13.3, 13.9, 13.12, 13.15)
 * - Composition: renders nodes, connectors, and labels (Req 15.15-15.17)
 * - Icon precedence: completed = checkmark always, user icon for current/incomplete/error (Req 15.18)
 * - State derivation: priority logic error > completed > current > incomplete (Req 15.20)
 * - Validation: dev throw, production warn+clamp for >8 steps, throw for sm size (Req 15.35-15.37)
 * - Accessibility: ARIA list, error/optional announcements (Req 15.27-15.29)
 * 
 * Requirements: 13.3, 13.9, 13.12, 13.15, 15.11-15.15, 15.16-15.18, 15.20, 15.27-15.29, 15.35-15.37, 15.39
 * @see .kiro/specs/048-progress-family/requirements.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { ProgressStepperDetailed } from '../platforms/web/ProgressStepperDetailed.web';
import {
  StepDefinition,
  deriveStepperDetailedNodeState,
  deriveStepperDetailedNodeContent,
  deriveDetailedConnectorState,
  clampDetailedCurrentStep,
  filterDetailedErrorSteps,
  STEPPER_DETAILED_MAX_STEPS,
} from '../types';

// ============================================================================
// Helpers
// ============================================================================

/** Create a stepper-detailed component with given attributes */
function createStepperDetailed(attrs: Record<string, string> = {}): ProgressStepperDetailed {
  const el = document.createElement('progress-stepper-detailed') as ProgressStepperDetailed;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  return el;
}

/** Build a steps JSON string from step definitions */
function stepsJSON(steps: StepDefinition[]): string {
  return JSON.stringify(steps);
}

/** Read the schema YAML for Stemma contract assertions */
function readSchema(): string {
  const schemaPath = path.resolve(
    process.cwd(),
    'src/components/core/Progress-Stepper-Detailed/Progress-Stepper-Detailed.schema.yaml'
  );
  return fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '';
}

/** Sample 3-step definition for reuse */
const SAMPLE_STEPS: StepDefinition[] = [
  { label: 'Personal Info' },
  { label: 'Payment' },
  { label: 'Review' },
];

/** Sample 5-step definition with icons and optional */
const RICH_STEPS: StepDefinition[] = [
  { label: 'Account', icon: 'user' },
  { label: 'Address', icon: 'home' },
  { label: 'Payment', icon: 'credit-card' },
  { label: 'Extras', optional: true, helperText: 'Skip if not needed' },
  { label: 'Confirm' },
];

// ============================================================================
// Test Suite
// ============================================================================

describe('Progress-Stepper-Detailed', () => {
  let schemaContent: string;

  beforeAll(() => {
    if (!customElements.get('progress-stepper-detailed')) {
      customElements.define('progress-stepper-detailed', ProgressStepperDetailed);
    }
    schemaContent = readSchema();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ==========================================================================
  // Stemma Behavioral Contracts (Req 13.3, 13.9, 13.12, 13.15)
  // ==========================================================================

  describe('Stemma Behavioral Contracts', () => {
    it('follows [Family]-[Type]-[Variant] naming pattern (Req 13.3)', () => {
      expect(schemaContent).toMatch(/name:\s*Progress-Stepper-Detailed/);
      expect(schemaContent).toMatch(/family:\s*Progress-Indicator/);
    });

    it('is classified as semantic component type (Req 13.9)', () => {
      expect(schemaContent).toMatch(/type:\s*semantic/);
    });

    it('requires steps and currentStep props (Req 13.12)', () => {
      expect(schemaContent).toMatch(/steps:[\s\S]*?required:\s*true/);
      expect(schemaContent).toMatch(/currentStep:[\s\S]*?required:\s*true/);
    });

    it('specifies role="list" and role="listitem" in accessibility (Req 13.15)', () => {
      expect(schemaContent).toMatch(/role='list'/);
      expect(schemaContent).toMatch(/role='listitem'/);
    });
  });

  // ==========================================================================
  // Composition Tests (Req 15.15-15.17, 11.14-11.22)
  // ==========================================================================

  describe('Composition', () => {
    it('renders Node-Base primitives for each step (Req 15.17)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '2',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      expect(nodes.length).toBe(3);
    });

    it('renders Connector-Base elements between nodes (n-1 connectors) (Req 15.17)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(RICH_STEPS),
        'current-step': '3',
      });
      const connectors = el.shadowRoot!.querySelectorAll('progress-indicator-connector-base');
      // 5 steps → connectors between each pair. Layout uses 2 connectors per inner step,
      // but logical connector count is n-1 = 4 minimum. Let's check > 0 and correct pattern.
      expect(connectors.length).toBeGreaterThanOrEqual(4);
    });

    it('renders Label-Base primitives for each step (Req 15.17)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
      });
      const labels = el.shadowRoot!.querySelectorAll('progress-indicator-label-base');
      expect(labels.length).toBe(3);
    });

    it('passes size prop to each node', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
        size: 'lg',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      nodes.forEach((node) => {
        expect(node.getAttribute('size')).toBe('lg');
      });
    });

    it('passes label text to Label-Base primitives (Req 11.20)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
      });
      const labels = el.shadowRoot!.querySelectorAll('progress-indicator-label-base');
      expect(labels[0].getAttribute('label')).toBe('Personal Info');
      expect(labels[1].getAttribute('label')).toBe('Payment');
      expect(labels[2].getAttribute('label')).toBe('Review');
    });

    it('passes helper text to Label-Base when provided (Req 11.20)', () => {
      const stepsWithHelper: StepDefinition[] = [
        { label: 'Step 1', helperText: 'Some help' },
        { label: 'Step 2' },
      ];
      const el = createStepperDetailed({
        steps: stepsJSON(stepsWithHelper),
        'current-step': '1',
      });
      const labels = el.shadowRoot!.querySelectorAll('progress-indicator-label-base');
      expect(labels[0].getAttribute('helper-text')).toBe('Some help');
      expect(labels[1].hasAttribute('helper-text')).toBe(false);
    });
  });

  // ==========================================================================
  // Icon Precedence Tests (Req 15.18, 4.4-4.6, 11.17-11.19)
  // ==========================================================================

  describe('Icon Precedence', () => {
    it('deriveStepperDetailedNodeContent returns "checkmark" for completed state (Req 4.4)', () => {
      const step: StepDefinition = { label: 'Done', icon: 'star' };
      expect(deriveStepperDetailedNodeContent('completed', step)).toBe('checkmark');
    });

    it('completed nodes ignore user icon — always checkmark (Req 4.4, 11.17)', () => {
      const step: StepDefinition = { label: 'Done', icon: 'custom-icon' };
      expect(deriveStepperDetailedNodeContent('completed', step)).toBe('checkmark');
    });

    it('deriveStepperDetailedNodeContent returns "icon" for current/incomplete/error with icon (Req 4.5)', () => {
      const step: StepDefinition = { label: 'Active', icon: 'user' };
      expect(deriveStepperDetailedNodeContent('current', step)).toBe('icon');
      expect(deriveStepperDetailedNodeContent('incomplete', step)).toBe('icon');
      expect(deriveStepperDetailedNodeContent('error', step)).toBe('icon');
    });

    it('deriveStepperDetailedNodeContent returns "none" for current/incomplete/error without icon (Req 4.6)', () => {
      const step: StepDefinition = { label: 'No Icon' };
      expect(deriveStepperDetailedNodeContent('current', step)).toBe('none');
      expect(deriveStepperDetailedNodeContent('incomplete', step)).toBe('none');
      expect(deriveStepperDetailedNodeContent('error', step)).toBe('none');
    });

    it('rendered completed nodes have content="checkmark" even when step has icon (Req 11.17)', () => {
      // 3 steps with icons, current=3 → steps 1,2 are completed
      const stepsWithIcons: StepDefinition[] = [
        { label: 'A', icon: 'star' },
        { label: 'B', icon: 'heart' },
        { label: 'C', icon: 'check' },
      ];
      const el = createStepperDetailed({
        steps: stepsJSON(stepsWithIcons),
        'current-step': '3',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      expect(nodes[0].getAttribute('content')).toBe('checkmark');
      expect(nodes[1].getAttribute('content')).toBe('checkmark');
    });

    it('rendered current/incomplete nodes with icon have content="icon" (Req 11.18)', () => {
      const stepsWithIcons: StepDefinition[] = [
        { label: 'A', icon: 'user' },
        { label: 'B', icon: 'home' },
        { label: 'C', icon: 'star' },
      ];
      const el = createStepperDetailed({
        steps: stepsJSON(stepsWithIcons),
        'current-step': '1',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // Step 1 = current with icon, steps 2-3 = incomplete with icon
      expect(nodes[0].getAttribute('content')).toBe('icon');
      expect(nodes[1].getAttribute('content')).toBe('icon');
      expect(nodes[2].getAttribute('content')).toBe('icon');
    });

    it('rendered current/incomplete nodes without icon have content="none" (Req 11.19)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // No icons in SAMPLE_STEPS
      expect(nodes[0].getAttribute('content')).toBe('none');
      expect(nodes[1].getAttribute('content')).toBe('none');
      expect(nodes[2].getAttribute('content')).toBe('none');
    });
  });

  // ==========================================================================
  // State Derivation Tests (Req 15.20, 10.3-10.7)
  // ==========================================================================

  describe('State Derivation', () => {
    it('deriveStepperDetailedNodeState returns "error" for steps in errorSteps (highest priority) (Req 10.3)', () => {
      expect(deriveStepperDetailedNodeState(2, 3, [2])).toBe('error');
    });

    it('deriveStepperDetailedNodeState returns "completed" for steps before currentStep (Req 10.4)', () => {
      expect(deriveStepperDetailedNodeState(1, 3, [])).toBe('completed');
      expect(deriveStepperDetailedNodeState(2, 3, [])).toBe('completed');
    });

    it('deriveStepperDetailedNodeState returns "current" for currentStep (Req 10.5)', () => {
      expect(deriveStepperDetailedNodeState(3, 3, [])).toBe('current');
    });

    it('deriveStepperDetailedNodeState returns "incomplete" for steps after currentStep (Req 10.6)', () => {
      expect(deriveStepperDetailedNodeState(4, 3, [])).toBe('incomplete');
    });

    it('error overrides completed state (priority: error > completed) (Req 10.7)', () => {
      expect(deriveStepperDetailedNodeState(1, 3, [1])).toBe('error');
    });

    it('error overrides current state (priority: error > current) (Req 10.7)', () => {
      expect(deriveStepperDetailedNodeState(3, 3, [3])).toBe('error');
    });

    it('deriveDetailedConnectorState returns "active" when both sides are completed', () => {
      expect(deriveDetailedConnectorState('completed', 'completed')).toBe('active');
    });

    it('deriveDetailedConnectorState returns "inactive" when either side is not completed', () => {
      expect(deriveDetailedConnectorState('completed', 'current')).toBe('inactive');
      expect(deriveDetailedConnectorState('current', 'incomplete')).toBe('inactive');
    });

    it('rendered nodes reflect correct state derivation with priority', () => {
      // 5 steps, current=3, error on step 1
      const el = createStepperDetailed({
        steps: stepsJSON(RICH_STEPS),
        'current-step': '3',
        'error-steps': '1',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      expect(nodes[0].getAttribute('state')).toBe('error');
      expect(nodes[1].getAttribute('state')).toBe('completed');
      expect(nodes[2].getAttribute('state')).toBe('current');
      expect(nodes[3].getAttribute('state')).toBe('incomplete');
      expect(nodes[4].getAttribute('state')).toBe('incomplete');
    });
  });

  // ==========================================================================
  // Validation Tests (Req 15.35-15.37, 8.6-8.10)
  // ==========================================================================

  describe('Validation', () => {
    it('STEPPER_DETAILED_MAX_STEPS constant is 8 (Req 8.6)', () => {
      expect(STEPPER_DETAILED_MAX_STEPS).toBe(8);
    });

    it('clampDetailedCurrentStep clamps below lower bound to 1 (Req 15.36)', () => {
      expect(clampDetailedCurrentStep(0, 5)).toBe(1);
      expect(clampDetailedCurrentStep(-3, 5)).toBe(1);
    });

    it('clampDetailedCurrentStep clamps above upper bound to totalSteps (Req 15.36)', () => {
      expect(clampDetailedCurrentStep(10, 5)).toBe(5);
    });

    it('filterDetailedErrorSteps removes indices outside valid range (Req 15.37)', () => {
      const result = filterDetailedErrorSteps([0, 1, 3, 6, 10], 5);
      expect(result).toEqual([1, 3]);
    });

    it('throws error when size="sm" (Req 8.10)', () => {
      expect(() => {
        createStepperDetailed({
          steps: stepsJSON(SAMPLE_STEPS),
          'current-step': '1',
          size: 'sm',
        });
      }).toThrow("Steppers require size 'md' or 'lg'");
    });

    it('warns and clamps in production when steps.length > 8 (Req 8.7, 15.35)', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const tenSteps: StepDefinition[] = Array.from({ length: 10 }, (_, i) => ({
          label: `Step ${i + 1}`,
        }));
        const el = createStepperDetailed({
          steps: stepsJSON(tenSteps),
          'current-step': '1',
        });
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('maximum is 8'));
        const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
        expect(nodes.length).toBe(8);
      } finally {
        warnSpy.mockRestore();
        process.env.NODE_ENV = origEnv;
      }
    });

    it('clamps currentStep outside bounds in rendered output (Req 15.36)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '10',
      });
      const nodes = el.shadowRoot!.querySelectorAll('progress-indicator-node-base');
      // currentStep clamped to 3, so last node should be current
      const lastNode = nodes[nodes.length - 1];
      expect(lastNode.getAttribute('state')).toBe('current');
    });
  });

  // ==========================================================================
  // Accessibility Tests (Req 15.27-15.29, 7.4-7.6, 7.13)
  // ==========================================================================

  describe('Accessibility', () => {
    it('applies role="list" to container (Req 7.4)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '2',
      });
      const container = el.shadowRoot!.querySelector('[role="list"]');
      expect(container).not.toBeNull();
    });

    it('applies role="listitem" to each step (Req 7.4)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
      });
      const items = el.shadowRoot!.querySelectorAll('[role="listitem"]');
      expect(items.length).toBe(3);
    });

    it('aria-label defaults to "Step X of Y" on container (Req 7.13)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(RICH_STEPS),
        'current-step': '3',
      });
      const container = el.shadowRoot!.querySelector('[role="list"]');
      expect(container!.getAttribute('aria-label')).toBe('Step 3 of 5');
    });

    it('error steps include "error" suffix in listitem aria-label (Req 7.5, 15.28)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '2',
        'error-steps': '1',
      });
      const items = el.shadowRoot!.querySelectorAll('[role="listitem"]');
      expect(items[0].getAttribute('aria-label')).toContain('error');
    });

    it('optional steps include "optional" suffix in listitem aria-label (Req 7.6, 15.29)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(RICH_STEPS),
        'current-step': '1',
      });
      const items = el.shadowRoot!.querySelectorAll('[role="listitem"]');
      // RICH_STEPS[3] is optional
      expect(items[3].getAttribute('aria-label')).toContain('optional');
    });

    it('listitem aria-label includes step label text (Req 7.13)', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '1',
      });
      const items = el.shadowRoot!.querySelectorAll('[role="listitem"]');
      expect(items[0].getAttribute('aria-label')).toContain('Personal Info');
      expect(items[1].getAttribute('aria-label')).toContain('Payment');
    });

    it('supports custom accessibility label override', () => {
      const el = createStepperDetailed({
        steps: stepsJSON(SAMPLE_STEPS),
        'current-step': '2',
        'accessibility-label': 'Checkout progress',
      });
      const container = el.shadowRoot!.querySelector('[role="list"]');
      expect(container!.getAttribute('aria-label')).toBe('Checkout progress');
    });
  });
});
