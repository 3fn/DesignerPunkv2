/**
 * Progress-Stepper-Detailed Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Stepper-Detailed
 * Type: Semantic (Detailed)
 * 
 * Progress-Stepper-Detailed is a semantic component that composes
 * Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base,
 * and Progress-Indicator-Label-Base primitives to create a detailed
 * stepper with labels and optional icons for complex multi-step flows.
 * 
 * Key Characteristics:
 * - Composes Node-Base + Connector-Base + Label-Base
 * - State priority: error > completed > current > incomplete
 * - Icon precedence: completed = checkmark always, user icon for others
 * - Connectors: active between completed nodes, inactive otherwise
 * - Sizes: md, lg only (sm throws error)
 * - Max 8 steps (dev throw, production warn+clamp)
 * - Accessibility: role="list" with role="listitem" per step
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export {
  STEPPER_DETAILED_DEFAULTS,
  STEPPER_DETAILED_MAX_STEPS,
  deriveStepperDetailedNodeState,
  deriveStepperDetailedNodeContent,
  deriveDetailedConnectorState,
  clampDetailedCurrentStep,
  filterDetailedErrorSteps,
} from './types';

export type {
  ProgressStepperDetailedProps,
  StepperDetailedSize,
  StepDefinition,
} from './types';

// Re-export node and connector types used by this component
export type { NodeState, NodeSize, NodeContent, ConnectorState } from './types';

// Platform implementations
// - Web: ProgressStepperDetailed (Task 5.1) ✅
// - iOS: ProgressStepperDetailed (Task 5.1) ✅
// - Android: ProgressStepperDetailed (Task 5.1) ✅
export { ProgressStepperDetailed } from './platforms/web/ProgressStepperDetailed.web';
