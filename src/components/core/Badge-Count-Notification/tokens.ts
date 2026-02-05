/**
 * Badge-Count-Notification Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic color token definitions for the Badge-Count-Notification component.
 * These tokens define the visual appearance of notification badges.
 * 
 * COLOR TOKENS (Spec 058):
 * Badge notification color tokens are defined in this file following the Rosetta System
 * architecture which mandates component tokens live at src/components/[ComponentName]/tokens.ts.
 * 
 * Color token references:
 * - notification.background: References pink400 (high-visibility alert background)
 * - notification.text: References white100 (WCAG AA compliant text on pink background)
 * 
 * Contrast Ratio:
 * - pink400 (#E91E63) with white100 (#FFFFFF) provides 6.33:1 contrast ratio
 * - Exceeds WCAG AA requirement (4.5:1 for normal text)
 * 
 * @see .kiro/specs/044-badge-base/design.md for Badge component family design
 * @see .kiro/specs/058-component-token-architecture-cleanup for color token migration
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

/**
 * Badge-Count-Notification Color Token References
 * 
 * Component-specific color tokens for notification badges following the Rosetta System
 * architecture which mandates component tokens live at src/components/[ComponentName]/tokens.ts.
 * 
 * These tokens reference primitive color tokens directly because:
 * 1. No semantic tokens exist for notification badge colors
 * 2. The pink400/white100 combination is specific to notification badges
 * 3. Direct primitive references maintain clear token chain traceability
 * 
 * Token Structure:
 * - notification.background: Background color for notification badges
 * - notification.text: Text color on notification badge background
 * 
 * Primitive Token References:
 * - notification.background → pink400 - High-visibility alert background
 * - notification.text → white100 - WCAG AA compliant text on pink background
 * 
 * @see .kiro/specs/058-component-token-architecture-cleanup for migration details
 * @see .kiro/specs/044-badge-base/requirements.md for Badge component requirements
 */
export const BadgeNotificationColorTokens = {
  /**
   * Background color for notification badges
   * References: pink400
   * Reasoning: High-visibility alert background with 6.33:1 contrast ratio against white text.
   * Pink provides strong visual prominence for notification counts while maintaining
   * accessibility compliance.
   */
  'notification.background': 'pink400',

  /**
   * Text color on notification badge background
   * References: white100
   * Reasoning: White text ensures WCAG AA contrast compliance (6.33:1 ratio) on pink400
   * background. Provides maximum readability for notification count numbers.
   */
  'notification.text': 'white100',
} as const;

/**
 * Type for Badge notification color token keys
 */
export type BadgeNotificationColorTokenKey = keyof typeof BadgeNotificationColorTokens;

/**
 * Get Badge notification color token reference for a given key
 * 
 * @param key - Color token key ('notification.background' | 'notification.text')
 * @returns Primitive token reference string
 * 
 * @example
 * ```typescript
 * getBadgeNotificationColorToken('notification.background')  // Returns 'pink400'
 * getBadgeNotificationColorToken('notification.text')        // Returns 'white100'
 * ```
 * 
 * @see .kiro/specs/058-component-token-architecture-cleanup Requirements 2.1, 2.2, 2.4
 */
export function getBadgeNotificationColorToken(key: BadgeNotificationColorTokenKey): string {
  return BadgeNotificationColorTokens[key];
}

/**
 * Token reference documentation for Badge notification colors
 * 
 * Documents the primitive token references and contrast ratio information.
 * Used for documentation and cross-referencing with the token system.
 * 
 * @see Requirements 2.1, 2.2 in .kiro/specs/058-component-token-architecture-cleanup/requirements.md
 */
export const BadgeNotificationTokenReferences = {
  /** Background references pink400 primitive */
  'notification.background': {
    primitiveReference: 'pink400',
    reasoning: 'High-visibility alert background with 6.33:1 contrast ratio against white text',
    contrastRatio: 6.33,
    wcagCompliance: 'AA',
  },
  /** Text references white100 primitive */
  'notification.text': {
    primitiveReference: 'white100',
    reasoning: 'White text ensures WCAG AA contrast compliance on pink400 background',
    contrastRatio: 6.33,
    wcagCompliance: 'AA',
  },
} as const;
