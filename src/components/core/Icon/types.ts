/**
 * Icon System Type Definitions
 * 
 * Provides type-safe icon names and sizing for cross-platform icon components.
 * Part of the DesignerPunk Icon System infrastructure.
 * 
 * @module Icon/types
 */

/**
 * Available icon names in the Icon System.
 * 
 * Initial set includes 15 icons (~5% of Feather Icons library):
 * - Navigation: arrow-right, arrow-left, arrow-up, arrow-down, chevron-right
 * - Actions: check, x, plus, minus
 * - UI Elements: circle, heart
 * - Complex: settings, user, mail, calendar
 * 
 * @example
 * ```typescript
 * const iconName: IconName = 'arrow-right';
 * ```
 */
export type IconName =
  // Navigation icons
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-right'
  
  // Action icons
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  
  // UI element icons
  | 'circle'
  | 'heart'
  
  // Complex icons
  | 'settings'
  | 'user'
  | 'mail'
  | 'calendar';

/**
 * Available icon sizes aligned with 8px baseline grid.
 * 
 * Size variants:
 * - 16px: Small UI elements and compact layouts
 * - 24px: Standard UI elements and body text
 * - 32px: Large UI elements and headings
 * - 40px: Extra large UI elements and display text
 * 
 * All sizes follow 8px baseline grid alignment for consistent spacing
 * and visual rhythm with other UI elements.
 * 
 * @example
 * ```typescript
 * const size: IconSize = 24; // Standard size
 * ```
 */
export type IconSize = 16 | 24 | 32 | 40;

/**
 * Props interface for Icon component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * @example
 * ```typescript
 * // Web usage
 * <Icon name="arrow-right" size={24} className="custom-icon" />
 * 
 * // iOS usage
 * Icon(name: "arrow-right", size: 24)
 * 
 * // Android usage
 * Icon(name = "arrow-right", size = 24.dp)
 * ```
 */
export interface IconProps {
  /**
   * Icon name (type-safe).
   * 
   * Must be one of the available IconName values. TypeScript will provide
   * autocomplete and compile-time validation.
   */
  name: IconName;
  
  /**
   * Icon size in pixels.
   * 
   * Must be one of the predefined IconSize values (16, 24, 32, 40).
   * Sizes are aligned with 8px baseline grid.
   */
  size: IconSize;
  
  /**
   * Optional CSS class name (web only).
   * 
   * Allows custom styling on web platform. Ignored on iOS and Android.
   */
  className?: string;
  
  /**
   * Optional style overrides (platform-specific).
   * 
   * - Web: React.CSSProperties object with CSS properties
   * - iOS: SwiftUI modifiers (not applicable to this prop)
   * - Android: Modifier (not applicable to this prop)
   * 
   * Type varies by platform implementation. For web, this accepts
   * standard CSS properties as a JavaScript object.
   * 
   * @example
   * ```typescript
   * // Web example
   * style={{ color: 'red', marginLeft: '8px' }}
   * ```
   */
  style?: Record<string, any>;
  
  /**
   * Optional test ID for testing.
   * 
   * Used to identify icons in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}
