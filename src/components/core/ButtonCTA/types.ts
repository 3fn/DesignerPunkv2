/**
 * Shared type definitions for ButtonCTA component
 * 
 * This file defines platform-agnostic types and interfaces used across
 * web, iOS, and Android implementations following True Native Architecture.
 * 
 * @module ButtonCTA/types
 */

import { IconName } from '../Icon/types';

/**
 * Button size variants
 * 
 * Defines three size options that follow the 8px baseline grid and meet
 * WCAG 2.1 AA touch target requirements (44px minimum).
 * 
 * @remarks
 * - **small**: 40px visual height (extends to 44px touch target on mobile)
 * - **medium**: 48px visual height (meets 44px touch target)
 * - **large**: 56px visual height (exceeds 44px touch target)
 * 
 * @example
 * ```typescript
 * <ButtonCTA size="small" label="Cancel" onPress={handleCancel} />
 * <ButtonCTA size="medium" label="Submit" onPress={handleSubmit} />
 * <ButtonCTA size="large" label="Get Started" onPress={handleStart} />
 * ```
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button visual styles
 * 
 * Defines three visual styles that establish clear hierarchy through
 * visual weight progression.
 * 
 * @remarks
 * - **primary**: Filled background with primary color (highest emphasis)
 * - **secondary**: Outlined with primary color border (medium emphasis)
 * - **tertiary**: Text-only with primary color (lowest emphasis)
 * 
 * All styles use the same color palette (color.primary) with different
 * visual treatments to maintain brand consistency while establishing
 * hierarchy through visual weight.
 * 
 * @example
 * ```typescript
 * <ButtonCTA style="primary" label="Save" onPress={handleSave} />
 * <ButtonCTA style="secondary" label="Cancel" onPress={handleCancel} />
 * <ButtonCTA style="tertiary" label="Learn More" onPress={handleLearnMore} />
 * ```
 */
export type ButtonStyle = 'primary' | 'secondary' | 'tertiary';

/**
 * Button component props (platform-agnostic)
 * 
 * Defines the complete API for the ButtonCTA component across all platforms.
 * Platform-specific implementations (web, iOS, Android) use these shared
 * type definitions to ensure API consistency.
 * 
 * @remarks
 * The component follows True Native Architecture with separate implementations
 * per platform, but all platforms expose identical APIs using these shared types.
 * 
 * @example
 * ```typescript
 * // Basic usage with required props
 * <ButtonCTA 
 *   label="Click me" 
 *   onPress={() => console.log('Clicked')} 
 * />
 * 
 * // With all optional props
 * <ButtonCTA
 *   label="Submit Form"
 *   size="large"
 *   style="primary"
 *   icon="arrow-right"
 *   noWrap={false}
 *   disabled={false}
 *   testID="submit-button"
 *   onPress={handleSubmit}
 * />
 * ```
 */
export interface ButtonProps {
  /**
   * Button text label (required)
   * 
   * The text content displayed on the button. Should be concise and
   * action-oriented (e.g., "Save", "Cancel", "Get Started").
   * 
   * @remarks
   * - Text wraps by default to support internationalization
   * - Use `noWrap` prop to truncate with ellipsis if needed
   * - Empty or whitespace-only labels will trigger validation warnings
   * 
   * @example
   * ```typescript
   * label="Save Changes"
   * label="Continue"
   * label="Learn More"
   * ```
   */
  label: string;
  
  /**
   * Button size variant (optional, default: 'medium')
   * 
   * Controls the button's height, padding, typography, and icon size.
   * Choose size based on visual hierarchy and context:
   * - small: Secondary actions, toolbars, dense layouts
   * - medium: Default for most buttons
   * - large: Primary CTAs, hero sections, high-emphasis actions
   * 
   * @defaultValue 'medium'
   * 
   * @example
   * ```typescript
   * size="small"   // 40px height, compact spacing
   * size="medium"  // 48px height, balanced spacing
   * size="large"   // 56px height, generous spacing
   * ```
   */
  size?: ButtonSize;
  
  /**
   * Button visual style (optional, default: 'primary')
   * 
   * Controls the button's visual treatment and emphasis level.
   * Choose style based on action importance:
   * - primary: Main action (highest emphasis)
   * - secondary: Alternative action (medium emphasis)
   * - tertiary: Subtle action (lowest emphasis)
   * 
   * @defaultValue 'primary'
   * 
   * @example
   * ```typescript
   * style="primary"    // Filled background, highest emphasis
   * style="secondary"  // Outlined, medium emphasis
   * style="tertiary"   // Text-only, lowest emphasis
   * ```
   */
  style?: ButtonStyle;
  
  /**
   * Optional leading icon from Icon System
   * 
   * Displays an icon before the button text. Icon size is automatically
   * determined by button size:
   * - small/medium: icon.size100 (24px)
   * - large: icon.size125 (32px)
   * 
   * @remarks
   * - Icons use optical weight compensation (blend token) for visual balance
   * - Icons are marked as decorative (aria-hidden) for accessibility
   * - Icon-text spacing follows semantic spacing tokens
   * 
   * @see {@link IconName} for available icon names
   * 
   * @example
   * ```typescript
   * icon="arrow-right"  // Navigation icon
   * icon="check"        // Confirmation icon
   * icon="plus"         // Add action icon
   * ```
   */
  icon?: IconName;
  
  /**
   * Prevent text wrapping (optional, default: false)
   * 
   * When true, text is truncated with ellipsis instead of wrapping to
   * multiple lines. Use for buttons in constrained spaces where wrapping
   * would break the layout.
   * 
   * @defaultValue false
   * 
   * @remarks
   * - Default behavior (false) allows text wrapping for accessibility
   * - Wrapping supports internationalization (long translations)
   * - Use noWrap sparingly (e.g., navigation bars, toolbars)
   * 
   * @example
   * ```typescript
   * noWrap={false}  // Text wraps (default, accessible)
   * noWrap={true}   // Text truncates with ellipsis
   * ```
   */
  noWrap?: boolean;
  
  /**
   * Click/tap handler (required)
   * 
   * Callback function invoked when the button is clicked or tapped.
   * Not called when button is disabled.
   * 
   * @remarks
   * - Function signature: `() => void`
   * - Not invoked when `disabled` is true
   * - Triggered by click, tap, Enter key, or Space key
   * 
   * @example
   * ```typescript
   * onPress={() => console.log('Clicked')}
   * onPress={handleSubmit}
   * onPress={() => navigation.navigate('Home')}
   * ```
   */
  onPress: () => void;
  
  /**
   * Optional test ID for automated testing
   * 
   * Identifier used by testing frameworks to locate the button element.
   * Platform-specific implementations map this to appropriate attributes:
   * - Web: data-testid
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   * 
   * @example
   * ```typescript
   * testID="submit-button"
   * testID="cancel-action"
   * testID="cta-get-started"
   * ```
   */
  testID?: string;
  
  /**
   * Optional disabled state (default: false)
   * 
   * When true, the button is non-interactive and visually indicates
   * disabled state. The onPress handler is not called when disabled.
   * 
   * @defaultValue false
   * 
   * @remarks
   * - Disabled buttons are not keyboard focusable
   * - Screen readers announce disabled state
   * - Visual styling indicates non-interactive state
   * 
   * @example
   * ```typescript
   * disabled={false}  // Interactive (default)
   * disabled={true}   // Non-interactive
   * disabled={isSubmitting}  // Conditional disable
   * ```
   */
  disabled?: boolean;
}
