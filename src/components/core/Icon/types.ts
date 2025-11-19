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
 * Available icon sizes calculated from fontSize × lineHeight formula.
 * 
 * Icon sizes are mathematically derived to maintain perfect optical balance
 * with their paired typography. Each size corresponds to a typography scale
 * and is calculated using the formula: iconSize = fontSize × lineHeight (rounded).
 * 
 * Core sizes (90% of use cases):
 * - 18px (size075): Small UI, compact layouts (bodySm, buttonSm, labelSm)
 * - 24px (size100): Standard UI, body text (bodyMd, buttonMd, labelMd, input)
 * - 32px (size125/200/300): Large UI, medium headings (bodyLg, buttonLg, h5, h4)
 * - 36px (size400): Large headings (h3)
 * - 40px (size500): Primary headings (h2)
 * 
 * Available sizes (10% of use cases):
 * - 13px (size050): Smallest text (caption, legal, labelXs)
 * - 28px (size150): Smallest heading (h6)
 * - 44px (size600): Primary heading (h1)
 * - 48px (size700): Display text (hero sections)
 * 
 * All sizes maintain 4pt subgrid alignment (except 13px and 18px, which are
 * smallest sizes where alignment trade-off is acceptable).
 * 
 * @example
 * ```typescript
 * const size: IconSize = 24; // Standard size for body text
 * const smallSize: IconSize = 18; // Small UI elements
 * const largeSize: IconSize = 40; // Primary headings
 * ```
 */
export type IconSize = 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48;

/**
 * Icon size token reference object mapping token names to calculated values.
 * 
 * This constant provides a type-safe way to reference icon size tokens by name
 * and get their calculated pixel values. Each token name corresponds to a
 * typography scale level and maps to the icon size calculated from that scale's
 * fontSize × lineHeight formula.
 * 
 * Token names follow the pattern `sizeXXX` where XXX is the scale level:
 * - size050: 13px (caption, legal, labelXs)
 * - size075: 18px (bodySm, buttonSm, labelSm)
 * - size100: 24px (bodyMd, buttonMd, labelMd, input) - standard
 * - size125: 32px (bodyLg, buttonLg, labelLg)
 * - size150: 28px (h6)
 * - size200: 32px (h5)
 * - size300: 32px (h4)
 * - size400: 36px (h3)
 * - size500: 40px (h2)
 * - size600: 44px (h1)
 * - size700: 48px (display)
 * 
 * Note: Multiple token names may map to the same calculated value due to
 * natural convergence in the mathematical formula. This is intentional and
 * preserves the relationship between icon sizes and typography scales.
 * 
 * @example
 * ```typescript
 * // Use token reference for type-safe icon sizing
 * <Icon name="arrow-right" size={iconSizes.size100} />
 * 
 * // Access calculated value
 * const standardIconSize = iconSizes.size100; // 24
 * 
 * // Map over all sizes
 * Object.entries(iconSizes).forEach(([token, size]) => {
 *   console.log(`${token}: ${size}px`);
 * });
 * ```
 */
export const iconSizes = {
  size050: 13,  // icon.size050 - caption, legal, labelXs
  size075: 18,  // icon.size075 - bodySm, buttonSm, labelSm
  size100: 24,  // icon.size100 - bodyMd, buttonMd, labelMd, input (standard)
  size125: 32,  // icon.size125 - bodyLg, buttonLg, labelLg
  size150: 28,  // icon.size150 - h6
  size200: 32,  // icon.size200 - h5
  size300: 32,  // icon.size300 - h4
  size400: 36,  // icon.size400 - h3
  size500: 40,  // icon.size500 - h2
  size600: 44,  // icon.size600 - h1
  size700: 48   // icon.size700 - display
} as const;

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
   * Must be one of the predefined IconSize values (13, 18, 24, 28, 32, 36, 40, 44, 48).
   * Sizes are calculated from fontSize × lineHeight formula to maintain optical balance
   * with paired typography.
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
  
  /**
   * Optional color override for optical weight compensation.
   * 
   * By default, icons inherit color from their parent component (recommended).
   * Use this property to specify a lighter color when icons appear heavier than
   * adjacent text due to stroke density (optical illusion).
   * 
   * Values:
   * - `'inherit'` (default): Use color inheritance (currentColor on web, template mode on iOS, LocalContentColor on Android)
   * - Token reference: Design system token name (e.g., 'color-text-secondary')
   * 
   * Platform-specific behavior:
   * - Web: 'inherit' uses currentColor, token reference becomes CSS custom property (var(--token))
   * - iOS: 'inherit' uses .primary, token reference uses Color parameter
   * - Android: 'inherit' uses LocalContentColor.current, token reference uses Color parameter
   * 
   * @example
   * ```typescript
   * // Default - inherit color from parent
   * <Icon name="arrow-right" size={24} />
   * 
   * // Explicit inheritance
   * <Icon name="arrow-right" size={24} color="inherit" />
   * 
   * // Optical weight compensation - lighter color for icon
   * <Icon name="arrow-right" size={24} color="color-text-secondary" />
   * ```
   * 
   * **When to use color override:**
   * - Icon paired with text label (use lighter color for icon to balance optical weight)
   * - Icon needs specific semantic color (error, success, warning)
   * - Complex layouts where inheritance doesn't provide correct color
   * 
   * **When to use inheritance (default):**
   * - Icon is the only element (no text to balance)
   * - Icon and text should have identical color
   * - Simple button/link contexts where parent color is correct
   */
  color?: 'inherit' | string;
}
