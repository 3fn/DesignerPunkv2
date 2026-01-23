/**
 * Badge-Count-Notification Type Definitions
 * 
 * Stemma System: Badge Family
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * 
 * Provides type-safe props for the Badge-Count-Notification component across all platforms.
 * Badge-Count-Notification is a semantic variant that extends Badge-Count-Base with
 * notification-specific styling and live region announcements for screen readers.
 * 
 * @module Badge-Count-Notification/types
 * @see .kiro/specs/044-badge-base/design.md for design specification
 * @see Requirements 3.1-3.10 in .kiro/specs/044-badge-base/requirements.md
 */

import { BadgeCountSize, BADGE_COUNT_DEFAULTS } from '../Badge-Count-Base/types';

// Re-export shared types from Badge-Count-Base
export { BadgeCountSize, BADGE_COUNT_DEFAULTS };

/**
 * Default values for Badge-Count-Notification props.
 * 
 * Inherits defaults from Badge-Count-Base and adds notification-specific defaults.
 * 
 * @see Requirements 3.6 in .kiro/specs/044-badge-base/requirements.md
 */
export const BADGE_COUNT_NOTIFICATION_DEFAULTS = {
  ...BADGE_COUNT_DEFAULTS,
  /** Default announceChanges behavior - announce count changes to screen readers */
  announceChanges: true,
} as const;

/**
 * Props interface for Badge-Count-Notification component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Inherits all props from Badge-Count-Base and adds notification-specific props.
 * 
 * @see Requirements 3.1-3.10 in .kiro/specs/044-badge-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <badge-count-notification count="5"></badge-count-notification>
 * 
 * // With announceChanges disabled
 * <badge-count-notification count="5" announce-changes="false"></badge-count-notification>
 * 
 * // With max truncation
 * <badge-count-notification count="150" max="99"></badge-count-notification>
 * ```
 */
export interface BadgeCountNotificationProps {
  /**
   * Notification count (required).
   * 
   * The count to display inside the notification badge.
   * 
   * @see Requirement 3.2 in .kiro/specs/044-badge-base/requirements.md
   */
  count: number;
  
  /**
   * Maximum before showing "[max]+".
   * 
   * When count exceeds this value, displays "[max]+" (e.g., "99+").
   * Inherited from Badge-Count-Base.
   * 
   * @default 99
   * @see Requirement 3.2 in .kiro/specs/044-badge-base/requirements.md
   */
  max?: number;
  
  /**
   * Whether to show badge when count is 0.
   * 
   * When false (default), badge is not rendered when count is 0.
   * When true, badge renders showing "0".
   * Inherited from Badge-Count-Base.
   * 
   * @default false
   * @see Requirement 3.2 in .kiro/specs/044-badge-base/requirements.md
   */
  showZero?: boolean;
  
  /**
   * Size variant.
   * 
   * Determines typography and spacing tokens applied.
   * Inherited from Badge-Count-Base.
   * 
   * @default 'md'
   * @see Requirement 3.2 in .kiro/specs/044-badge-base/requirements.md
   */
  size?: BadgeCountSize;
  
  /**
   * Whether to announce count changes to screen readers.
   * 
   * When true (default), count changes are announced via live regions.
   * When false, count changes are not announced.
   * 
   * @default true
   * @see Requirements 3.3, 3.6, 3.7 in .kiro/specs/044-badge-base/requirements.md
   */
  announceChanges?: boolean;
  
  /**
   * Optional test ID for automated testing.
   * 
   * Used to identify badges in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}
