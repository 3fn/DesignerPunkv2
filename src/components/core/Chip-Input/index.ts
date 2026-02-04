/**
 * Chip-Input Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Chip-Input
 * Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Chip-Input is a semantic variant of Chip-Base that adds dismiss behavior.
 * Used for managing user-entered values like tags or selections.
 * 
 * Key Characteristics:
 * - Dismissible: Tap anywhere to dismiss
 * - X icon: Always shows trailing X icon
 * - Inherits: All Chip-Base visual styling
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/045-chip-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export type { ChipInputProps } from './types';

// Web platform implementation
export { 
  ChipInputElement,
  CHIP_INPUT_OBSERVED_ATTRIBUTES,
  type ChipInputObservedAttribute,
  type IChipInputElement
} from './platforms/web/ChipInput.web';

// Platform implementations
// - Web: ChipInputElement (Task 3.6 - Complete)
// - iOS: ChipInput (Task 3.8)
// - Android: ChipInput (Task 3.8)
