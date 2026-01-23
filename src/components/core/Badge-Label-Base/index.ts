/**
 * Badge-Label-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Label-Base
 * Type: Type Primitive (Label)
 * 
 * Badge-Label-Base is a type primitive component that displays categorization,
 * status, or metadata text in a compact visual indicator. It is read-only and
 * non-interactive.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Informational: Conveys status or metadata at a glance
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/044-badge-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export tokens
export {
  BadgeLabelBaseTokens,
  getBadgeLabelMaxWidth,
  BadgeLabelBaseTokenReferences,
} from './tokens';

// Export types
export {
  BadgeLabelSize,
  BadgeLabelBaseProps,
  BADGE_LABEL_DEFAULTS,
  BADGE_LABEL_SIZE_TOKENS,
} from './types';

// Platform implementations
// - Web: BadgeLabelBase (Task 2.2) ✅
// - iOS: BadgeLabelBase (Task 2.3)
// - Android: BadgeLabelBase (Task 2.4)
export { BadgeLabelBase } from './platforms/web/BadgeLabelBase.web';
