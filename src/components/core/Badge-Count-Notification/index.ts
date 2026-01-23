/**
 * Badge-Count-Notification Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * Type: Semantic Variant (inherits from Badge-Count-Base)
 * 
 * Badge-Count-Notification is a semantic variant that extends Badge-Count-Base
 * with notification-specific styling and live region announcements for screen
 * readers. It uses predefined notification color tokens and automatically
 * announces count changes to assistive technologies.
 * 
 * Key Characteristics:
 * - Inherits all Badge-Count-Base behavior (count display, max truncation, showZero)
 * - Fixed notification colors (pink400 background, white100 text)
 * - Live region announcements for accessibility
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/044-badge-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Types
export { 
  BadgeCountNotificationProps,
  BadgeCountSize,
  BADGE_COUNT_NOTIFICATION_DEFAULTS,
} from './types';

// Web Platform Implementation
export { BadgeCountNotification } from './platforms/web/BadgeCountNotification.web';

// Platform implementations:
// - Web: BadgeCountNotification (Task 4.2) - complete
// - iOS: BadgeCountNotification (Task 4.3) - complete
// - Android: BadgeCountNotification (Task 4.4) - pending
