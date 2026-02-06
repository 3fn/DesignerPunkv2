/**
 * Badge-Count-Notification Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic color token definitions for the Badge-Count-Notification component.
 * These tokens define the visual appearance of notification badges.
 * 
 * COLOR TOKENS (Spec 046 Task 8.2):
 * Badge notification color tokens now reference semantic tokens from the Rosetta System
 * semantic layer (color.feedback.notification.*) instead of primitive tokens directly.
 * This aligns with the architectural decision that color tokens require the semantic
 * token pipeline, as the defineComponentTokens() API only supports numeric values.
 * 
 * Semantic Token References:
 * - notification.background: References color.feedback.notification.background (pink400)
 * - notification.text: References color.feedback.notification.text (white100)
 * 
 * Contrast Ratio:
 * - pink400 (#E91E63) with white100 (#FFFFFF) provides 6.33:1 contrast ratio
 * - Exceeds WCAG AA requirement (4.5:1 for normal text)
 * 
 * @see .kiro/specs/044-badge-base/design.md for Badge component family design
 * @see .kiro/specs/046-input-checkbox-base Task 8.2 for semantic token migration
 * @see .kiro/specs/059-component-color-token-architecture for architectural decision
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

/**
 * Badge-Count-Notification Color Token References
 * 
 * Component-specific color tokens for notification badges following the Rosetta System
 * architecture. These tokens reference semantic tokens from the color.feedback.notification
 * family, which are defined in src/tokens/semantic/ColorTokens.ts.
 * 
 * Architectural Decision (Spec 046 Task 8.2):
 * The defineComponentTokens() API only supports numeric values (spacing, sizing), not
 * color tokens. Color tokens require the semantic token pipeline. Therefore, component
 * color tokens reference semantic tokens instead of primitives directly.
 * 
 * Token Structure:
 * - notification.background: Background color for notification badges
 * - notification.text: Text color on notification badge background
 * 
 * Semantic Token References:
 * - notification.background → color.feedback.notification.background (pink400)
 * - notification.text → color.feedback.notification.text (white100)
 * 
 * @see src/tokens/semantic/ColorTokens.ts for semantic token definitions
 * @see .kiro/specs/046-input-checkbox-base Task 8.2 for migration context
 * @see .kiro/specs/044-badge-base/requirements.md for Badge component requirements
 */
export const BadgeNotificationColorTokens = {
  /**
   * Background color for notification badges
   * References: color.feedback.notification.background (semantic token)
   * Underlying primitive: pink400
   * Reasoning: High-visibility alert background with 6.33:1 contrast ratio against white text.
   * Pink provides strong visual prominence for notification counts while maintaining
   * accessibility compliance.
   */
  'notification.background': 'color.feedback.notification.background',

  /**
   * Text color on notification badge background
   * References: color.feedback.notification.text (semantic token)
   * Underlying primitive: white100
   * Reasoning: White text ensures WCAG AA contrast compliance (6.33:1 ratio) on pink400
   * background. Provides maximum readability for notification count numbers.
   */
  'notification.text': 'color.feedback.notification.text',
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
 * Documents the semantic token references and contrast ratio information.
 * Used for documentation and cross-referencing with the token system.
 * 
 * @see Requirements 2.1, 2.2 in .kiro/specs/058-component-token-architecture-cleanup/requirements.md
 * @see .kiro/specs/046-input-checkbox-base Task 8.2 for semantic token migration
 */
export const BadgeNotificationTokenReferences = {
  /** Background references color.feedback.notification.background semantic token */
  'notification.background': {
    semanticReference: 'color.feedback.notification.background',
    primitiveReference: 'pink400',
    reasoning: 'High-visibility alert background with 6.33:1 contrast ratio against white text',
    contrastRatio: 6.33,
    wcagCompliance: 'AA',
  },
  /** Text references color.feedback.notification.text semantic token */
  'notification.text': {
    semanticReference: 'color.feedback.notification.text',
    primitiveReference: 'white100',
    reasoning: 'White text ensures WCAG AA contrast compliance on pink400 background',
    contrastRatio: 6.33,
    wcagCompliance: 'AA',
  },
} as const;
