/**
 * Progress-Stepper-Detailed Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Detailed)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Detailed
 * 
 * Provides type-safe props for the Progress-Stepper-Detailed component
 * across all platforms. This semantic variant composes Node-Base,
 * Connector-Base, and Label-Base primitives to create a detailed stepper
 * with labels and optional icons for complex multi-step flows.
 * 
 * @module Progress-Stepper-Detailed/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 4.1-4.16, 11.14-11.22
 */

import { NodeState, NodeSize, NodeContent } from '../Progress-Indicator-Node-Base/types';
import { ConnectorState } from '../Progress-Indicator-Connector-Base/types';

// Re-export for convenience
export { NodeState, NodeSize, NodeContent, ConnectorState };

/**
 * Stepper size variants — sm is NOT supported for steppers.
 * 
 * @see Requirement 4.16 - Throw if sm
 */
export type StepperDetailedSize = 'md' | 'lg';

/**
 * Step definition for Stepper-Detailed.
 * Each step has a label, optional helper text, optional icon, and optional flag.
 * 
 * @see Requirements 4.1-4.8
 */
export interface StepDefinition {
  /** Primary label text for the step */
  label: string;
  /** Optional helper text displayed below the label */
  helperText?: string;
  /** Optional icon name — only applies to current/incomplete/error states (completed always shows checkmark) */
  icon?: string;
  /** Whether this step is optional */
  optional?: boolean;
}


/**
 * Default values for Progress-Stepper-Detailed props.
 * 
 * @see Requirements 4.1-4.3
 */
export const STEPPER_DETAILED_DEFAULTS = {
  /** Default size variant */
  size: 'md' as StepperDetailedSize,
  /** Default error steps (none) */
  errorSteps: [] as number[],
} as const;

/**
 * Maximum number of steps supported by Stepper-Detailed.
 * 
 * @see Requirement 4.9 - steps.length > 8 throws in dev
 * @see Requirement 4.10 - steps.length > 8 clamps in production
 */
export const STEPPER_DETAILED_MAX_STEPS = 8;

/**
 * Props interface for Progress-Stepper-Detailed component (platform-agnostic).
 * 
 * @see Requirements 4.1-4.16 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * <progress-stepper-detailed
 *   steps='[{"label":"Personal Info"},{"label":"Payment"},{"label":"Review"}]'
 *   current-step="2"
 *   size="md"
 * ></progress-stepper-detailed>
 * ```
 */
export interface ProgressStepperDetailedProps {
  /**
   * Array of step definitions (required).
   * Maximum 8 steps. Values > 8 throw in dev, clamp in production.
   * 
   * @see Requirements 4.9-4.10
   */
  steps: StepDefinition[];

  /**
   * Current active step (1-indexed, required).
   * Clamped to [1, steps.length] if out of bounds.
   * 
   * @see Requirement 4.11
   */
  currentStep: number;

  /**
   * Size variant for all nodes.
   * Only 'md' and 'lg' are supported. 'sm' throws an error.
   * Defaults to 'md'.
   * 
   * @see Requirement 4.16 - sm not supported
   */
  size?: StepperDetailedSize;

  /**
   * Array of step indices (1-indexed) that are in error state.
   * Invalid indices are filtered to valid range [1, steps.length].
   * 
   * @see Requirement 4.12
   */
  errorSteps?: number[];

  /**
   * Custom accessibility label override.
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
 * Same logic as Stepper-Base.
 * 
 * @see Requirements 4.3, 10.3-10.7 - Stepper state logic
 */
export function deriveStepperDetailedNodeState(
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
 * Derive content for a node based on its state and step definition.
 * 
 * Icon precedence:
 * - completed: ALWAYS checkmark (user icon ignored)
 * - current/incomplete/error with icon: 'icon'
 * - current/incomplete/error without icon: 'none'
 * 
 * @see Requirements 4.4-4.6, 11.17-11.19
 */
export function deriveStepperDetailedNodeContent(
  state: NodeState,
  step: StepDefinition
): NodeContent {
  if (state === 'completed') return 'checkmark';
  if (step.icon) return 'icon';
  return 'none';
}

/**
 * Derive connector state between two adjacent nodes.
 * Active when both nodes on either side are completed.
 * 
 * @see Requirements 11.21-11.22
 */
export function deriveDetailedConnectorState(
  leftState: NodeState,
  rightState: NodeState
): ConnectorState {
  return (leftState === 'completed' && rightState === 'completed') ? 'active' : 'inactive';
}

/**
 * Clamp currentStep to valid range [1, totalSteps].
 * 
 * @see Requirement 4.11
 */
export function clampDetailedCurrentStep(currentStep: number, totalSteps: number): number {
  return Math.max(1, Math.min(currentStep, totalSteps));
}

/**
 * Filter errorSteps to valid range [1, totalSteps].
 * 
 * @see Requirement 4.12
 */
export function filterDetailedErrorSteps(errorSteps: number[], totalSteps: number): number[] {
  return errorSteps.filter(step => step >= 1 && step <= totalSteps);
}
