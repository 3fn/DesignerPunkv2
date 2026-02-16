/**
 * Progress-Indicator-Connector-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Indicator-Connector-Base
 * Type: Primitive (Base)
 * 
 * Progress-Indicator-Connector-Base is a primitive component that renders
 * horizontal connecting lines between progress indicator nodes with
 * state-based color treatment. It serves as a building block for
 * Stepper-Base and Stepper-Detailed semantic variants.
 * 
 * Key Characteristics:
 * - 2 states: active, inactive
 * - 1px thickness (borderDefault token)
 * - Flexible length (fills space between nodes)
 * - Non-interactive, decorative (a11y handled by semantic variants)
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export {
  ConnectorState,
  CONNECTOR_BASE_DEFAULTS,
} from './types';

export type { ProgressIndicatorConnectorBaseProps } from './types';

// Platform implementations
// - Web: ProgressIndicatorConnectorBase (Task 2.2) ✅
// - iOS: ProgressIndicatorConnectorBase (Task 2.2) ✅
// - Android: ProgressIndicatorConnectorBase (Task 2.2) ✅
export { ProgressIndicatorConnectorBase } from './platforms/web/ProgressIndicatorConnectorBase.web';
