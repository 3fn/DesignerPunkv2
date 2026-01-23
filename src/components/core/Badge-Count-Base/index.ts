/**
 * Badge-Count-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Count-Base
 * Type: Type Primitive (Count)
 * 
 * Badge-Count-Base is a type primitive component that displays numeric values
 * like notification counts or quantities in a compact visual indicator. It is
 * read-only and non-interactive.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Shape-adaptive: Circular for single digits, pill for multi-digit
 * - Informational: Conveys counts or quantities at a glance
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/044-badge-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export {
  BadgeCountSize,
  BadgeCountBaseProps,
  BADGE_COUNT_DEFAULTS,
  BADGE_COUNT_SIZE_TOKENS,
} from './types';

// Export web platform implementation
export { BadgeCountBase } from './platforms/web/BadgeCountBase.web';

// Platform implementations:
// - Web: BadgeCountBase (Task 3.2) ✅
// - iOS: BadgeCountBase (Task 3.3) - pending
// - Android: BadgeCountBase (Task 3.4) - pending
