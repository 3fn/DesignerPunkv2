/**
 * Progress-Indicator-Node-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Indicator-Node-Base
 * Type: Primitive (Base)
 * 
 * Progress-Indicator-Node-Base is a primitive component that renders individual
 * circular indicator nodes with state-based visual treatment. It serves as the
 * foundational building block for all Progress Indicator semantic variants.
 * 
 * Key Characteristics:
 * - 4 states: incomplete, current, completed, error
 * - 3 sizes: sm (12px), md (16px), lg (24px)
 * - Current state applies +4px size emphasis
 * - sm size always renders as dot (content ignored)
 * - Non-interactive, decorative (a11y handled by semantic variants)
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export {
  NodeState,
  NodeSize,
  NodeContent,
  NODE_BASE_DEFAULTS,
  NODE_SIZE_VALUES,
} from './types';

export type { ProgressIndicatorNodeBaseProps } from './types';

// Platform implementations
// - Web: ProgressIndicatorNodeBase (Task 2.1) ✅
// - iOS: ProgressIndicatorNodeBase (Task 2.1) ✅
// - Android: ProgressIndicatorNodeBase (Task 2.1) ✅
export { ProgressIndicatorNodeBase } from './platforms/web/ProgressIndicatorNodeBase.web';
