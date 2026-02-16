/**
 * Progress-Pagination-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * Type: Semantic (Base)
 * 
 * Progress-Pagination-Base is a semantic component that composes
 * Progress-Indicator-Node-Base primitives to create a simple pagination
 * indicator for carousels and multi-page flows.
 * 
 * Key Characteristics:
 * - Composes Node-Base only (no connectors, no labels)
 * - All nodes use content='none' (dots only)
 * - States: incomplete, current (binary derivation)
 * - Sizes: sm, md, lg
 * - Virtualization: >5 items → sliding window of 5
 * - Max 50 items (dev throw, production warn+clamp)
 * - Accessibility: role="group" with actual position label
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export {
  PAGINATION_BASE_DEFAULTS,
  PAGINATION_MAX_ITEMS,
  PAGINATION_VISIBLE_WINDOW,
  derivePaginationNodeState,
  calculateVisibleWindow,
  clampCurrentItem,
} from './types';

export type { ProgressPaginationBaseProps } from './types';

// Re-export node types used by this component
export type { NodeState, NodeSize } from './types';

// Platform implementations
// - Web: ProgressPaginationBase (Task 3.1) ✅
// - iOS: ProgressPaginationBase (Task 3.1) ✅
// - Android: ProgressPaginationBase (Task 3.1) ✅
export { ProgressPaginationBase } from './platforms/web/ProgressPaginationBase.web';
