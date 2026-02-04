/**
 * Chip-Base Type Definitions
 * 
 * Stemma System: Chip Family
 * Component Type: Primitive
 * Naming Convention: [Family]-[Type]-[Variant] = Chip-Base
 * 
 * Provides type-safe props for the Chip-Base component across all platforms.
 * Chip-Base is a compact, interactive element used for filtering, selection,
 * or input management.
 * 
 * @module Chip-Base/types
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 1.1-1.7 in .kiro/specs/045-chip-base/requirements.md
 */

/**
 * Icon name from the icon library.
 * Alias for string to maintain semantic clarity.
 */
export type IconName = string;

/**
 * Props interface for Chip-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * @see Requirements 1.1-1.7 in .kiro/specs/045-chip-base/requirements.md
 */
export interface ChipBaseProps {
  /**
   * Chip text content (required).
   * 
   * @see Requirement 1.1 in .kiro/specs/045-chip-base/requirements.md
   */
  label: string;
  
  /**
   * Optional leading icon.
   * 
   * When provided, renders an icon before the label text using Icon-Base
   * at icon.size075 (20px).
   * 
   * @see Requirement 1.2 in .kiro/specs/045-chip-base/requirements.md
   */
  icon?: IconName;
  
  /**
   * Disabled state - prevents interaction.
   * 
   * When true, chip does not respond to press events and applies
   * disabled visual styling.
   * 
   * @default false
   * @see Requirements 1.4, 1.5 in .kiro/specs/045-chip-base/requirements.md
   */
  disabled?: boolean;
  
  /**
   * Called when chip is pressed.
   * 
   * @see Requirement 1.3 in .kiro/specs/045-chip-base/requirements.md
   */
  onPress?: () => void;
  
  /**
   * Test ID for automated testing.
   * 
   * Used to identify chips in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}
