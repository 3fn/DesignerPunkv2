/**
 * Button-VerticalList-Set Component Index
 * 
 * Stemma System: Buttons Family
 * Component Type: Pattern (VerticalList-Set)
 * Naming Convention: [Family]-[Type] = Button-VerticalList-Set
 * Custom Element Tag: <button-vertical-list-set>
 * 
 * Re-exports all Button-VerticalList-Set component types and implementations.
 * 
 * @module Button-VerticalList-Set
 */

// Export types
export type {
  SelectionMode,
  ButtonVerticalListSetProps,
  SetInternalState,
  DerivedItemState
} from './types';

// Export state derivation function
export { deriveItemStates } from './types';

// Export component tokens (to be implemented in Task 2.3)
// export { ButtonVerticalListSetTokens } from './Button-VerticalList-Set.tokens';

// Export web component
export { ButtonVerticalListSet } from './platforms/web/ButtonVerticalListSet.web';

// Platform implementations can also be imported directly from their platform-specific paths
// e.g., import { ButtonVerticalListSet } from './platforms/web/ButtonVerticalListSet.web';
