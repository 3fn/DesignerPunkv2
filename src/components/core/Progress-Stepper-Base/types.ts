/**
 * Progress-Stepper-Base Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Base
 * 
 * Provides type-safe props for the Progress-Stepper-Base component
 * across all platforms. This semantic variant composes Node-Base and
 * Connector-Base primitives to create a stepper indicator for linear
 * multi-step flows.
 * 
 * @module Progress-Stepper-Base/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 3.1-3.17, 10.3-10.7, 11.7-11.13
 */

import { NodeState, NodeSize, NodeContent } from '../Progress-Indicator-Node-Base/types';
import { ConnectorState } from '../Progress-Indicator-Connector-Base/types';

// Re-export for convenience
export { NodeState, NodeSize, NodeContent, ConnectorState };

/**
 * Stepper size variants — sm is NOT supported for steppers.
 * 
 * @see Requirement 3.17 - Throw if sm
 */
export type StepperSize = 'md' | 'lg';

/**
 * Default values for Progress-Stepper-Base props.
 * 
 * @see Requirements 3.1-3.3
 */
export const STEPPER_BASE_DEFAULTS = {
  /** Default size variant */
  size: 'md' as StepperSize,
  /** Default error steps (none) */
  errorSteps: [] as number[],
} as const;

/**
 * Maximum number of steps supported by Stepper-Base.
 * 
 * @see Requirement 3.12 - totalSteps > 8 throws in dev
 * @see Requirement 3.13 - totalSteps > 8 clamps in production
 */
export const STEPPER_MAX_STEPS = 8;


/**
 * Props interface for Progress-Stepper-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * 
 * @see Requirements 3.1-3.17 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <progress-stepper-base total-steps="5" current-step="3" size="md"></progress-stepper-base>
 * ```
 */
export interface ProgressStepperBaseProps {
  /**
   * Total number of steps (required).
   * Maximum 8. Values > 8 throw in dev, clamp in production.
   * 
   * @see Requirements 3.12-3.13
   */
  totalSteps: number;

  /**
   * Current active step (1-indexed, required).
   * Clamped to [1, totalSteps] if out of bounds.
   * 
   * @see Requirement 3.14
   */
  currentStep: number;

  /**
   * Size variant for all nodes.
   * Only 'md' and 'lg' are supported. 'sm' throws an error.
   * Defaults to 'md'.
   * 
   * @see Requirement 3.17 - sm not supported
   */
  size?: StepperSize;

  /**
   * Array of step indices (1-indexed) that are in error state.
   * Invalid indices are filtered to valid range [1, totalSteps].
   * 
   * @see Requirements 3.4, 3.15
   */
  errorSteps?: number[];

  /**
   * Custom accessibility label override.
   * Defaults to "Step {currentStep} of {totalSteps}".
   * 
   * @see Requirement 3.16
   */
  accessibilityLabel?: string;

  /**
   * Test identifier for automated testing.
   */
  testID?: string;
}

/**
 * Derive node state for a given step index in the stepper.
 * 
 * State priority: error > completed > current > incomplete
 * 
 * @see Requirements 10.3-10.7 - Stepper state logic
 */
export function deriveStepperNodeState(
  index: number,
  currentStep: number,
  errorSteps: number[]
): NodeState {
  if (errorSteps.includes(index)) return 'error';
  if (index < currentStep) return 'completed';
  if (index === currentStep) return 'current';
  return 'incomplete';
}

/**
 * Derive content for a node based on its state.
 * 
 * - completed: checkmark
 * - all others: none
 * 
 * @see Requirements 3.8-3.9, 11.10-11.11
 */
export function deriveStepperNodeContent(state: NodeState): NodeContent {
  return state === 'completed' ? 'checkmark' : 'none';
}

/**
 * Derive connector state between two adjacent nodes.
 * 
 * Active when both nodes on either side are completed.
 * Specifically: connector between step i and step i+1 is active
 * when step i is completed (not error, not current, not incomplete).
 * 
 * @see Requirements 3.10-3.11, 11.12-11.13
 */
export function deriveConnectorState(
  leftState: NodeState,
  rightState: NodeState
): ConnectorState {
  return (leftState === 'completed' && rightState === 'completed') ? 'active' : 'inactive';
}

/**
 * Clamp currentStep to valid range [1, totalSteps].
 * 
 * @see Requirement 3.14
 */
export function clampCurrentStep(currentStep: number, totalSteps: number): number {
  return Math.max(1, Math.min(currentStep, totalSteps));
}

/**
 * Filter errorSteps to valid range [1, totalSteps].
 * 
 * @see Requirement 3.15
 */
export function filterErrorSteps(errorSteps: number[], totalSteps: number): number[] {
  return errorSteps.filter(step => step >= 1 && step <= totalSteps);
}
