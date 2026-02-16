/**
 * Progress-Stepper-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Stepper-Base
 * Type: Semantic (Base)
 * 
 * Progress-Stepper-Base is a semantic component that composes
 * Progress-Indicator-Node-Base and Progress-Indicator-Connector-Base
 * primitives to create a stepper indicator for linear multi-step flows.
 * 
 * Key Characteristics:
 * - Composes Node-Base + Connector-Base (no labels)
 * - State priority: error > completed > current > incomplete
 * - Completed nodes get content='checkmark', others get content='none'
 * - Connectors: active between completed nodes, inactive otherwise
 * - Sizes: md, lg only (sm throws error)
 * - Max 8 steps (dev throw, production warn+clamp)
 * - Accessibility: role="progressbar" with aria-value* attributes
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export {
  STEPPER_BASE_DEFAULTS,
  STEPPER_MAX_STEPS,
  deriveStepperNodeState,
  deriveStepperNodeContent,
  deriveConnectorState,
  clampCurrentStep,
  filterErrorSteps,
} from './types';

export type { ProgressStepperBaseProps, StepperSize } from './types';

// Re-export node and connector types used by this component
export type { NodeState, NodeSize, NodeContent, ConnectorState } from './types';

// Platform implementations
// - Web: ProgressStepperBase (Task 4.1) ✅
// - iOS: ProgressStepperBase (Task 4.1) ✅
// - Android: ProgressStepperBase (Task 4.1) ✅
export { ProgressStepperBase } from './platforms/web/ProgressStepperBase.web';
