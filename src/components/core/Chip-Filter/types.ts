/**
 * Chip-Filter Type Definitions
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type]-[Variant] = Chip-Filter
 * 
 * Provides type-safe props for the Chip-Filter component across all platforms.
 * Chip-Filter extends Chip-Base with toggle/selection behavior for filtering
 * content by multiple criteria.
 * 
 * @module Chip-Filter/types
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 4.1-4.6 in .kiro/specs/045-chip-base/requirements.md
 */

import { ChipBaseProps } from '../Chip-Base/types';

/**
 * Props interface for Chip-Filter component (platform-agnostic).
 * 
 * Extends ChipBaseProps with selection state and toggle callback.
 * 
 * @see Requirements 4.1-4.6 in .kiro/specs/045-chip-base/requirements.md
 */
export interface ChipFilterProps extends ChipBaseProps {
  /**
   * Whether chip is in selected state.
   * 
   * When true, chip displays selected styling (primary background,
   * onPrimary text) and shows a checkmark icon.
   * 
   * @default false
   * @see Requirement 4.2 in .kiro/specs/045-chip-base/requirements.md
   */
  selected?: boolean;
  
  /**
   * Called when selection state changes.
   * 
   * Receives the new selected state as parameter.
   * 
   * @see Requirement 4.5 in .kiro/specs/045-chip-base/requirements.md
   */
  onSelectionChange?: (selected: boolean) => void;
}
