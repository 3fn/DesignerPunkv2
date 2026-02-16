/**
 * Progress-Pagination-Base Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Provides type-safe props for the Progress-Pagination-Base component
 * across all platforms. This semantic variant composes Node-Base primitives
 * to create a simple pagination indicator for carousels and multi-page flows.
 * 
 * @module Progress-Pagination-Base/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 2.1-2.3, 10.1-10.2, 11.1-11.6
 */

import { NodeState, NodeSize } from '../Progress-Indicator-Node-Base/types';

// Re-export for convenience
export { NodeState, NodeSize };

/**
 * Default values for Progress-Pagination-Base props.
 * 
 * @see Requirements 2.1-2.3
 */
export const PAGINATION_BASE_DEFAULTS = {
  /** Default size variant */
  size: 'md' as NodeSize,
} as const;

/**
 * Maximum number of items supported by Pagination-Base.
 * 
 * @see Requirement 2.9 - totalItems > 50 throws in dev
 * @see Requirement 2.10 - totalItems > 50 clamps in production
 */
export const PAGINATION_MAX_ITEMS = 50;

/**
 * Maximum number of visible nodes when virtualization is active.
 * 
 * @see Requirements 2.4-2.8 - Sliding window algorithm
 */
export const PAGINATION_VISIBLE_WINDOW = 5;

/**
 * Props interface for Progress-Pagination-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * 
 * @see Requirements 2.1-2.12 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <progress-pagination-base total-items="10" current-item="3" size="sm"></progress-pagination-base>
 * ```
 */
export interface ProgressPaginationBaseProps {
  /**
   * Total number of items/pages (required).
   * Maximum 50. Values > 50 throw in dev, clamp in production.
   * 
   * @see Requirements 2.9-2.10
   */
  totalItems: number;

  /**
   * Current active item (1-indexed, required).
   * Clamped to [1, totalItems] if out of bounds.
   * 
   * @see Requirement 2.11
   */
  currentItem: number;

  /**
   * Size variant for all nodes.
   * Defaults to 'md'.
   * 
   * @see Requirement 2.1 - Supports sm, md, lg
   */
  size?: NodeSize;

  /**
   * Custom accessibility label override.
   * Defaults to "Page {currentItem} of {totalItems}".
   * 
   * @see Requirement 2.12
   */
  accessibilityLabel?: string;

  /**
   * Test identifier for automated testing.
   */
  testID?: string;
}

/**
 * Derive node state for a given index in the pagination.
 * 
 * Pagination uses simple binary state derivation:
 * - current: index matches currentItem
 * - incomplete: all other indices
 * 
 * @see Requirements 10.1-10.2 - Pagination state logic
 */
export function derivePaginationNodeState(index: number, currentItem: number): NodeState {
  return index === currentItem ? 'current' : 'incomplete';
}

/**
 * Calculate the visible window for virtualized pagination.
 * 
 * When totalItems > 5, only 5 nodes are rendered using a sliding window:
 * - Pages 1-3: show nodes 1-5
 * - Pages 4 to (totalItems - 3): center current at position 3
 * - Last 3 pages: show last 5 nodes
 * 
 * @see Requirements 2.4-2.8, 9.1-9.6
 */
export function calculateVisibleWindow(
  currentItem: number,
  totalItems: number
): { start: number; end: number } {
  if (totalItems <= PAGINATION_VISIBLE_WINDOW) {
    return { start: 1, end: totalItems };
  }

  // Near start: show first 5
  if (currentItem <= 3) {
    return { start: 1, end: 5 };
  }

  // Near end: show last 5
  if (currentItem >= totalItems - 2) {
    return { start: totalItems - 4, end: totalItems };
  }

  // Middle: center current at position 3
  return { start: currentItem - 2, end: currentItem + 2 };
}

/**
 * Clamp currentItem to valid range [1, totalItems].
 * 
 * @see Requirement 2.11
 */
export function clampCurrentItem(currentItem: number, totalItems: number): number {
  return Math.max(1, Math.min(currentItem, totalItems));
}
