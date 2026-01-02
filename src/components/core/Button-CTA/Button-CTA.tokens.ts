/**
 * Button-CTA Component Tokens
 * 
 * Component-specific tokens for Button-CTA that don't fit into the general
 * semantic token system. These tokens are specific to button sizing and layout.
 * 
 * Token Naming Pattern: buttonCTA.[property].[variant]
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * Related Requirements:
 * - Requirement 6.1-6.3: Minimum width requirements for button sizes
 * - Design Decision H3: Component-specific tokens with semantic naming
 */

/**
 * Minimum Width Tokens
 * 
 * These tokens define the minimum width for each button size variant.
 * Values are chosen to ensure buttons have adequate touch targets and
 * visual presence while maintaining compositional architecture principles.
 * 
 * Design Rationale (from H3):
 * - Component-specific tokens provide clarity for button sizing
 * - Semantic naming (small/medium/large) balances component needs with system conventions
 * - Values don't need to align with existing primitive tokens (space700, space900, space1000)
 * - Compositional architecture maintained through mathematical relationships
 * 
 * Values:
 * - Small: 56px (7 × 8px baseline grid)
 * - Medium: 72px (9 × 8px baseline grid)
 * - Large: 80px (10 × 8px baseline grid, aligns with space1000)
 */
export const ButtonCTATokens = {
  /**
   * Minimum width for small buttons
   * 
   * Usage: Small buttons in compact layouts, secondary actions
   * Value: 56px (7 × 8px baseline grid)
   * Platforms: Web, iOS, Android
   */
  minWidth: {
    small: 56,
    
    /**
     * Minimum width for medium buttons
     * 
     * Usage: Standard buttons, primary actions
     * Value: 72px (9 × 8px baseline grid)
     * Platforms: Web, iOS, Android
     */
    medium: 72,
    
    /**
     * Minimum width for large buttons
     * 
     * Usage: Prominent buttons, hero actions
     * Value: 80px (10 × 8px baseline grid, aligns with space1000)
     * Platforms: Web, iOS, Android
     */
    large: 80,
  },
} as const;

/**
 * Type definitions for Button-CTA tokens
 */
export type ButtonCTAMinWidthVariant = keyof typeof ButtonCTATokens.minWidth;

/**
 * Helper function to get minWidth token value
 * 
 * @param variant - The button size variant (small, medium, large)
 * @returns The minimum width value in pixels
 */
export function getButtonCTAMinWidth(variant: ButtonCTAMinWidthVariant): number {
  return ButtonCTATokens.minWidth[variant];
}
