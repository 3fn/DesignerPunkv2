/**
 * Button-VerticalListItem Type Definitions
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (VerticalListItem)
 * Naming Convention: [Family]-[Type] = Button-VerticalListItem
 * 
 * Provides type-safe props and visual state definitions for the vertical list
 * button item component. This is a "dumb" presentational component that renders
 * visual states based on props received from a parent container.
 * 
 * @module Button-VerticalListItem/types
 */

import { IconBaseName } from '../Icon-Base/types';

/**
 * Visual state of the button item.
 * 
 * The visual state determines the button's appearance and is controlled by
 * the parent pattern. Different states are used in different selection modes:
 * 
 * - **Tap Mode**: Uses `rest` state only (simple action buttons)
 * - **Select Mode**: Uses `rest`, `selected`, `notSelected` (single-selection radio-style)
 * - **Multi-Select Mode**: Uses `checked`, `unchecked` (checkbox-style)
 * 
 * @remarks
 * - `rest`: Default state with neutral styling
 * - `selected`: Active selection in Select mode (shows checkmark, emphasis border)
 * - `notSelected`: Inactive item in Select mode when another item is selected
 * - `checked`: Active selection in Multi-Select mode (shows checkmark)
 * - `unchecked`: Inactive item in Multi-Select mode
 * 
 * @example
 * ```typescript
 * const state: VisualState = 'selected';
 * ```
 */
export type VisualState = 'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked';

/**
 * Checkmark transition behavior when hiding the selection indicator.
 * 
 * Controls how the checkmark disappears when transitioning away from
 * `selected` or `checked` states.
 * 
 * @remarks
 * - `fade`: Checkmark fades out using `motion.selectionTransition` (250ms)
 * - `instant`: Checkmark hides immediately without animation
 * 
 * Note: Checkmark always fades IN when becoming visible, regardless of this setting.
 * 
 * @example
 * ```typescript
 * // Smooth fade out for single-select scenarios
 * checkmarkTransition="fade"
 * 
 * // Instant hide for multi-select rapid toggling
 * checkmarkTransition="instant"
 * ```
 */
export type CheckmarkTransition = 'fade' | 'instant';

/**
 * Props interface for Button-VerticalListItem component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * The component is a "dumb" presentational component that renders visual states
 * based on props — all selection logic is managed by the parent pattern.
 * 
 * @remarks
 * The component follows True Native Architecture with separate implementations
 * per platform, but all platforms expose identical APIs using these shared types.
 * 
 * @example
 * ```typescript
 * // Basic usage in Tap mode
 * <vertical-list-button-item
 *   label="Settings"
 *   visualState="rest"
 *   onClick={handleClick}
 * />
 * 
 * // Select mode with selection indicator
 * <vertical-list-button-item
 *   label="Option A"
 *   description="This is the first option"
 *   visualState="selected"
 *   leadingIcon="check"
 *   onClick={handleSelect}
 * />
 * 
 * // Multi-Select mode with error state
 * <vertical-list-button-item
 *   label="Required Option"
 *   visualState="unchecked"
 *   error={true}
 *   onClick={handleToggle}
 * />
 * ```
 */
export interface VerticalListButtonItemProps {
  // ─────────────────────────────────────────────────────────────────
  // Content
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Button text label (required).
   * 
   * The primary text content displayed on the button. Should be concise
   * and descriptive of the option or action.
   * 
   * @remarks
   * - Styled with `typography.buttonMd`
   * - Color changes based on visual state
   * - Very long labels will truncate with ellipsis
   * 
   * @example
   * ```typescript
   * label="Enable notifications"
   * label="Dark mode"
   * label="Account settings"
   * ```
   */
  label: string;
  
  /**
   * Optional description text below the label.
   * 
   * Secondary text that provides additional context about the option.
   * Useful for explaining what an option does or its implications.
   * 
   * @remarks
   * - Styled with `typography.bodySm`
   * - Always uses `color.text.muted` regardless of visual state
   * - Wraps to multiple lines if needed
   * 
   * @example
   * ```typescript
   * description="Receive push notifications for new messages"
   * description="Automatically switch to dark mode at sunset"
   * ```
   */
  description?: string;
  
  /**
   * Optional leading icon from Icon System.
   * 
   * Displays an icon on the far left of the button, vertically centered.
   * Icon size is `iconBaseSizes.size100` (24px) to match `typography.buttonMd`.
   * 
   * @remarks
   * - Uses Icon-Base component internally
   * - Color matches label color with optical balance blend applied
   * - Position adapts for RTL layouts (appears on right in RTL)
   * 
   * @see {@link IconBaseName} for available icon names
   * 
   * @example
   * ```typescript
   * leadingIcon="settings"
   * leadingIcon="user"
   * leadingIcon="mail"
   * ```
   */
  leadingIcon?: IconBaseName;
  
  // ─────────────────────────────────────────────────────────────────
  // Visual State (controlled by parent)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Visual state of the button (required, controlled by parent).
   * 
   * Determines the button's visual appearance including background color,
   * border styling, text color, and checkmark visibility. This prop is
   * controlled by the parent pattern — the component does not manage
   * selection state internally.
   * 
   * @remarks
   * - `rest`: Neutral state (Tap mode, or initial Select/Multi-Select)
   * - `selected`: Active in Select mode (checkmark visible, emphasis border)
   * - `notSelected`: Inactive in Select mode (muted styling)
   * - `checked`: Active in Multi-Select mode (checkmark visible)
   * - `unchecked`: Inactive in Multi-Select mode (neutral styling)
   * 
   * @example
   * ```typescript
   * visualState="rest"        // Default/Tap mode
   * visualState="selected"    // Selected in single-select
   * visualState="checked"     // Checked in multi-select
   * ```
   */
  visualState: VisualState;
  
  // ─────────────────────────────────────────────────────────────────
  // Error State
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Error state indicator (optional, default: false).
   * 
   * When true, applies error styling to indicate validation failure.
   * The error treatment differs by mode:
   * 
   * - **Select mode** (`rest`, `selected`, `notSelected`): Full error treatment
   *   with `color.error.subtle` background, `borderEmphasis` border width,
   *   and `color.error.strong` border/text colors
   * - **Multi-Select mode** (`checked`, `unchecked`): Text/icon colors only
   *   change to `color.error.strong` (no border/background change)
   * - **Tap mode** (`rest` only): Error prop has no effect
   * 
   * @defaultValue false
   * 
   * @example
   * ```typescript
   * error={true}   // Show error styling
   * error={false}  // Normal styling (default)
   * error={hasValidationError}  // Conditional error
   * ```
   */
  error?: boolean;
  
  // ─────────────────────────────────────────────────────────────────
  // Animation Control
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Checkmark hide transition behavior (optional, default: 'fade').
   * 
   * Controls how the selection indicator (checkmark) disappears when
   * transitioning from `selected`/`checked` to other states.
   * 
   * @remarks
   * - `fade`: Smooth fade-out using `motion.selectionTransition` (250ms)
   * - `instant`: Immediate hide without animation
   * - Checkmark always fades IN regardless of this setting
   * 
   * @defaultValue 'fade'
   * 
   * @example
   * ```typescript
   * checkmarkTransition="fade"     // Smooth transition (default)
   * checkmarkTransition="instant"  // Immediate hide
   * ```
   */
  checkmarkTransition?: CheckmarkTransition;
  
  /**
   * Transition delay in milliseconds (optional).
   * 
   * Delays the start of state transition animations. Useful for creating
   * staggered animations when multiple items change state together.
   * 
   * @remarks
   * - Applied via CSS `transition-delay` property
   * - Affects all animated properties (background, border, padding, colors)
   * - Parent pattern can calculate delays based on item index
   * 
   * @example
   * ```typescript
   * transitionDelay={0}    // No delay (default)
   * transitionDelay={50}   // 50ms delay
   * transitionDelay={index * 30}  // Staggered by index
   * ```
   */
  transitionDelay?: number;
  
  // ─────────────────────────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Click/tap handler (optional).
   * 
   * Callback function invoked when the button is clicked or tapped.
   * The parent pattern uses this to update selection state.
   * 
   * @remarks
   * - Triggered by click, tap, Enter key, or Space key
   * - Component does NOT manage selection state — parent handles it
   * - No disabled state support (unavailable options should be hidden)
   * 
   * @example
   * ```typescript
   * onClick={() => handleItemSelect(itemId)}
   * onClick={handleToggle}
   * ```
   */
  onClick?: () => void;
  
  /**
   * Focus handler (optional).
   * 
   * Callback function invoked when the button receives focus.
   * Useful for parent pattern to track focused item for keyboard navigation.
   * 
   * @example
   * ```typescript
   * onFocus={() => setFocusedIndex(index)}
   * ```
   */
  onFocus?: () => void;
  
  /**
   * Blur handler (optional).
   * 
   * Callback function invoked when the button loses focus.
   * 
   * @example
   * ```typescript
   * onBlur={() => setFocusedIndex(null)}
   * ```
   */
  onBlur?: () => void;
  
  // ─────────────────────────────────────────────────────────────────
  // Testing
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Optional test ID for automated testing.
   * 
   * Identifier used by testing frameworks to locate the button element.
   * Platform-specific implementations map this to appropriate attributes:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   * 
   * @example
   * ```typescript
   * testID="list-item-settings"
   * testID="option-dark-mode"
   * testID={`list-item-${index}`}
   * ```
   */
  testID?: string;
}
