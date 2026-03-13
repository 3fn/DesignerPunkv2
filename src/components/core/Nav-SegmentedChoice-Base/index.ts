/**
 * Nav-SegmentedChoice-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Nav-SegmentedChoice-Base
 * Type: Primitive (Base)
 * 
 * Nav-SegmentedChoice-Base is a navigation control that allows users to switch
 * between different content surfaces within a single view. It presents mutually
 * exclusive options as connected segments, with the selected segment visually
 * distinguished by a sliding indicator.
 * 
 * Key Characteristics:
 * - Text OR icon segments (union type, never both)
 * - Sliding indicator with four-phase animation choreography
 * - Sizes: standard, condensed
 * - Minimum 2 segments (runtime error if fewer)
 * - Keyboard: arrow keys, Enter/Space, Tab
 * - Accessibility: tablist/tab roles, aria-selected, aria-controls (when id provided)
 * 
 * @see .kiro/specs/049-nav-segmentedchoice-base for design specification
 */

// Export types
export type {
  SegmentedChoiceProps,
  TextSegmentOption,
  IconSegmentOption,
  SegmentOption,
  SegmentedChoiceSize,
} from './types';

export { SEGMENTED_CHOICE_DEFAULTS } from './types';

// Platform implementations
// - Web: NavSegmentedChoiceBase (Task 3) — pending
// - iOS: NavSegmentedChoiceBase (Task 4) — pending
// - Android: NavSegmentedChoiceBase (Task 5) — pending
