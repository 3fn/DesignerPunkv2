/**
 * Chip-Input Type Definitions
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type]-[Variant] = Chip-Input
 * 
 * Provides type-safe props for the Chip-Input component across all platforms.
 * Chip-Input extends Chip-Base with dismiss behavior for managing user-entered
 * values like tags or selections.
 * 
 * @module Chip-Input/types
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 5.1-5.6 in .kiro/specs/045-chip-base/requirements.md
 */

import { ChipBaseProps } from '../Chip-Base/types';

/**
 * Props interface for Chip-Input component (platform-agnostic).
 * 
 * Extends ChipBaseProps (minus onPress) with dismiss callback.
 * Chip-Input always shows an X icon and dismisses on tap anywhere.
 * 
 * @see Requirements 5.1-5.6 in .kiro/specs/045-chip-base/requirements.md
 */
export interface ChipInputProps extends Omit<ChipBaseProps, 'onPress'> {
  /**
   * Called when chip is dismissed (tap anywhere on chip).
   * 
   * @see Requirement 5.4 in .kiro/specs/045-chip-base/requirements.md
   */
  onDismiss?: () => void;
}
