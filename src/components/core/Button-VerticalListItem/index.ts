/**
 * Button-VerticalListItem Component Index
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (VerticalListItem)
 * Naming Convention: [Family]-[Type] = Button-VerticalListItem
 * 
 * Re-exports all Button-VerticalListItem component types and implementations.
 * 
 * @module Button-VerticalListItem
 */

// Export types
export type {
  VisualState,
  CheckmarkTransition,
  VerticalListButtonItemProps
} from './types';

// Export component tokens (Task 1.3)
export {
  VerticalListItemTokens,
  getVerticalListItemPaddingBlock,
  getVerticalListItemPaddingBlockTokenReference,
  VerticalListItemPaddingBlockTokenReferences
} from './buttonVerticalListItem.tokens';
export type { VerticalListItemPaddingBlockVariant } from './buttonVerticalListItem.tokens';

// Export visual state mapping (Task 2.1)
export {
  visualStateMap,
  getVisualStateStyles,
  isCheckmarkVisible,
  getVisualStateCssClass,
  isSelectModeState,
  isMultiSelectModeState,
  requiresEmphasisBorder,
  // Error state overlay (Task 2.2)
  applyErrorStyles,
  getVisualStateStylesWithError
} from './platforms/web/visualStateMapping';
export type { VisualStateStyles } from './platforms/web/visualStateMapping';

// Export web component (Task 2.3)
export { ButtonVerticalListItem } from './platforms/web/ButtonVerticalListItem.web';

// Platform implementations can also be imported directly from their platform-specific paths
// e.g., import { ButtonVerticalListItem } from './platforms/web/ButtonVerticalListItem.web';
