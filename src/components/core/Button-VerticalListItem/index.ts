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

// Platform implementations are imported directly from their platform-specific paths
// e.g., import { ButtonVerticalListItem } from './platforms/web/ButtonVerticalListItem.web';
