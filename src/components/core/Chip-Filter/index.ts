/**
 * Chip-Filter Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Chip-Filter
 * Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Chip-Filter is a semantic variant of Chip-Base that adds toggle/selection
 * behavior. Used for filtering content by multiple criteria.
 * 
 * Key Characteristics:
 * - Toggleable: Selected state changes on press
 * - Visual feedback: Checkmark icon when selected
 * - Inherits: All Chip-Base visual styling and behavior
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/045-chip-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export type { ChipFilterProps } from './types';

// Web platform implementation
export { 
  ChipFilterElement, 
  CHIP_FILTER_OBSERVED_ATTRIBUTES,
  type ChipFilterObservedAttribute 
} from './platforms/web/ChipFilter.web';

// Platform implementations
// - Web: ChipFilterElement (Task 3.2) ✓
// - iOS: ChipFilter (Task 3.4)
// - Android: ChipFilter (Task 3.4)
