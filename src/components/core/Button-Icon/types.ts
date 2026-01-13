/**
 * Button-Icon Component Type Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-Icon
 * Type: Primitive (foundational component)
 * 
 * Shared TypeScript interfaces for the Button-Icon component.
 * These types are used across all platform implementations (web, iOS, Android).
 * 
 * Design Decisions:
 * - No `disabled` prop by design (see Requirement 11.1)
 * - Required `ariaLabel` for accessibility (see Requirement 4.1)
 * - Icon component integration for consistent icon rendering
 * 
 * @see .kiro/specs/035-button-icon-component/design.md for component design
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @module ButtonIcon/types
 */

import { IconBaseName } from '../Icon-Base/types';

/**
 * Button-Icon size variants.
 * 
 * Determines icon size and padding tokens used:
 * - `small`: icon.size050 (13px icon) + buttonIcon.inset.small (8px padding)
 * - `medium`: icon.size075 (18px icon) + buttonIcon.inset.medium (10px padding)
 * - `large`: icon.size100 (24px icon) + buttonIcon.inset.large (12px padding)
 * 
 * All sizes include a 4px transparent focus buffer on all sides
 * (accessibility.focus.offset + accessibility.focus.width).
 * 
 * @example
 * ```typescript
 * const size: ButtonIconSize = 'medium'; // Default size
 * ```
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
export type ButtonIconSize = 'small' | 'medium' | 'large';

/**
 * Button-Icon visual style variants.
 * 
 * Determines background, border, and icon color styling:
 * - `primary`: Solid color.primary background, color.contrast.onPrimary icon
 * - `secondary`: Transparent background, borderDefault border with color.primary, color.primary icon
 * - `tertiary`: Transparent background, no border, color.primary icon
 * 
 * @example
 * ```typescript
 * const variant: ButtonIconVariant = 'primary'; // Default variant
 * ```
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4
 */
export type ButtonIconVariant = 'primary' | 'secondary' | 'tertiary';

/**
 * Props interface for Button-Icon component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations use this interface to ensure consistent behavior.
 * 
 * Design Decision: No `disabled` prop is provided by design. Disabled buttons
 * remove affordance without explanation. Use alternative patterns instead:
 * - Hide unavailable actions
 * - Show validation messaging
 * - Use loading states
 * 
 * @example
 * ```typescript
 * // Web usage
 * <button-icon
 *   icon="settings"
 *   aria-label="Open settings"
 *   size="medium"
 *   variant="primary"
 * />
 * 
 * // TypeScript props
 * const props: ButtonIconProps = {
 *   icon: 'settings',
 *   ariaLabel: 'Open settings',
 *   onPress: () => console.log('pressed'),
 *   size: 'medium',
 *   variant: 'primary'
 * };
 * ```
 * 
 * @see Requirements 1.5, 2.4, 4.1, 11.1
 */
export interface ButtonIconProps {
  /**
   * Icon to display (from Icon component).
   * 
   * Must be one of the available IconBaseName values from the Icon-Base component.
   * TypeScript will provide autocomplete and compile-time validation.
   * 
   * @required
   * @see Icon-Base/types for available icon names
   */
  icon: IconBaseName;
  
  /**
   * Accessible label for screen readers.
   * 
   * This prop is required because icon-only buttons need explicit labels
   * for screen reader users to understand the button's purpose.
   * 
   * Platform-specific application:
   * - Web: Applied as `aria-label` attribute
   * - iOS: Applied via `.accessibilityLabel()` modifier
   * - Android: Applied via `contentDescription` parameter
   * 
   * @required
   * @see Requirements 4.1, 4.2, 4.3, 4.4
   * 
   * @example
   * ```typescript
   * ariaLabel="Close dialog"
   * ariaLabel="Add to favorites"
   * ariaLabel="Open settings menu"
   * ```
   */
  ariaLabel: string;
  
  /**
   * Click/tap handler.
   * 
   * Called when the button is activated via:
   * - Mouse click (web)
   * - Touch tap (all platforms)
   * - Keyboard Enter or Space (web)
   * 
   * @required
   */
  onPress: () => void;
  
  /**
   * Visual size variant.
   * 
   * Controls icon size and padding. All sizes meet WCAG 2.5.5 (Target Size Enhanced)
   * and 2.5.8 (Target Size Minimum) requirements with minimum 48px touch targets.
   * 
   * @default 'medium'
   * @see Requirements 1.5, 5.1, 5.2, 5.3
   */
  size?: ButtonIconSize;
  
  /**
   * Visual style variant.
   * 
   * Controls background color, border, and icon color styling.
   * 
   * @default 'primary'
   * @see Requirements 2.4
   */
  variant?: ButtonIconVariant;
  
  /**
   * Optional test ID for automated testing.
   * 
   * Platform-specific application:
   * - Web: Applied as `data-testid` attribute
   * - iOS: Applied via `.accessibilityIdentifier()` modifier
   * - Android: Applied via `testTag` in semantics
   * 
   * @optional
   */
  testID?: string;
}

/**
 * Default prop values for Button-Icon component.
 * 
 * Used by platform implementations to apply consistent defaults.
 * 
 * @see Requirements 1.5, 2.4
 */
export const BUTTON_ICON_DEFAULTS = {
  /** Default size variant */
  size: 'medium' as ButtonIconSize,
  /** Default visual style variant */
  variant: 'primary' as ButtonIconVariant,
} as const;
