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
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @module Chip-Base/types
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 1.1, 1.2, 1.3 in .kiro/specs/045-chip-base/requirements.md
 */

/**
 * Icon name from the icon library.
 * 
 * Alias for string to maintain semantic clarity and allow flexibility
 * for icon names that may not be in the IconBaseName union type.
 * 
 * @example
 * ```typescript
 * const icon: IconName = 'check';
 * const customIcon: IconName = 'custom-icon';
 * ```
 */
export type IconName = string;

/**
 * Props interface for Chip-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * Note: DesignerPunk does not support disabled states. If an action is
 * unavailable, the component should not be rendered.
 * 
 * @see Requirements 1.1, 1.2, 1.3 in .kiro/specs/045-chip-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const props: ChipBaseProps = {
 *   label: 'Category',
 *   onPress: () => console.log('pressed')
 * };
 * 
 * // With icon
 * const propsWithIcon: ChipBaseProps = {
 *   label: 'Filter',
 *   icon: 'check',
 *   onPress: () => console.log('pressed'),
 *   testID: 'filter-chip'
 * };
 * ```
 */
export interface ChipBaseProps {
  /**
   * Chip text content (required).
   * 
   * The label text to display inside the chip.
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
   * Called when chip is pressed.
   * 
   * Invoked on:
   * - Mouse click (web)
   * - Touch tap (all platforms)
   * - Keyboard Enter or Space (web)
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

/**
 * Observed attributes for the Chip-Base web component.
 * 
 * These attributes trigger re-rendering when changed via attributeChangedCallback.
 * The array is defined as a constant to ensure consistency between the
 * ChipBaseElement class and any code that needs to reference the attributes.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export const CHIP_BASE_OBSERVED_ATTRIBUTES = ['label', 'icon', 'test-id'] as const;

/**
 * Type for observed attribute names.
 * 
 * Derived from CHIP_BASE_OBSERVED_ATTRIBUTES for type safety.
 */
export type ChipBaseObservedAttribute = typeof CHIP_BASE_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Chip-Base.
 * 
 * Extends HTMLElement with Chip-Base specific properties and methods.
 * This interface defines the contract for the ChipBaseElement web component
 * implementation.
 * 
 * @see Requirements 1.1, 1.2, 1.3 in .kiro/specs/045-chip-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Create element programmatically
 * const chip = document.createElement('chip-base') as ChipBaseElement;
 * chip.label = 'Category';
 * chip.icon = 'check';
 * chip.onPress = () => console.log('pressed');
 * document.body.appendChild(chip);
 * 
 * // Query existing element
 * const existingChip = document.querySelector('chip-base') as ChipBaseElement;
 * console.log(existingChip.label);
 * ```
 */
export interface ChipBaseElement extends HTMLElement {
  /**
   * Observed attributes for automatic re-rendering on change.
   * 
   * Static getter that returns the list of attributes to observe.
   * When these attributes change, attributeChangedCallback is invoked.
   */
  // Note: Static members cannot be declared in interfaces, but this documents
  // the expected static property on the implementing class:
  // static observedAttributes: readonly string[];
  
  /**
   * Chip text content.
   * 
   * Reflects the 'label' attribute.
   */
  label: string;
  
  /**
   * Optional leading icon name.
   * 
   * Reflects the 'icon' attribute.
   */
  icon: IconName | null;
  
  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  testID: string | null;
  
  /**
   * Press callback.
   * 
   * Called when the chip is activated via click, tap, or keyboard.
   * This is a JavaScript property, not an HTML attribute.
   */
  onPress: (() => void) | null;
}

