/**
 * Semantic border width tokens providing contextual meaning.
 * 
 * All tokens reference primitive BorderWidthTokens by name to maintain mathematical relationships.
 * Uses { value: 'primitiveTokenName' } pattern following semantic/SpacingTokens.ts pattern.
 * 
 * Token Selection Guidance:
 * - borderDefault: Standard borders for containers, inputs at rest, buttons at rest, dividers
 * - borderEmphasis: Emphasized borders for inputs on focus, selected cards, active buttons
 * - borderHeavy: Strong visual weight borders (rare, use sparingly)
 */

/**
 * Border width semantic token structure
 * Uses { value: 'primitiveTokenName' } format for primitive references
 */
interface BorderWidthSemanticToken {
  value: string;
}

/**
 * No border width - removes borders entirely.
 * 
 * References: borderWidth000 (0) - Note: This primitive token needs to be added
 * 
 * Use cases:
 * - Borderless cards: Cards without visible borders
 * - Borderless inputs: Input fields without borders (e.g., underline-only inputs)
 * - Removing borders: Explicitly removing borders from elements
 * - Reset states: Resetting border widths to none
 * 
 * Visual weight: None (no border)
 * 
 * Rationale: Explicit "none" token improves search/discoverability, communicates intent
 * (removing border vs. forgetting to add one), and provides consistent maintenance pattern
 * 
 * Platform output:
 * - Web: 0px
 * - iOS: 0pt
 * - Android: 0dp
 */
export const borderNone = { value: 'borderWidth000' } as BorderWidthSemanticToken;

/**
 * Default border width for standard elements.
 * 
 * References: borderWidth100 (1)
 * 
 * Use cases:
 * - Cards: Standard card borders
 * - Inputs at rest: Default input field borders
 * - Buttons at rest: Default button borders
 * - Dividers: Standard dividing lines between content
 * 
 * Visual weight: Standard, neutral
 * 
 * Platform output:
 * - Web: 1px
 * - iOS: 1pt
 * - Android: 1dp
 */
export const borderDefault = { value: 'borderWidth100' } as BorderWidthSemanticToken;

/**
 * Emphasized border width for active/focused states.
 * 
 * References: borderWidth200 (2)
 * 
 * Use cases:
 * - Inputs on focus: Input fields receiving user focus
 * - Selected cards: Cards in selected state
 * - Active buttons: Buttons in active/pressed state
 * - Web focus indicators: Use for outline-width in focus states
 * 
 * Visual weight: Emphasized, attention-drawing
 * 
 * Note: For web focus indicators, use with outline (not border) property.
 * For iOS and Android, prefer platform-native focus patterns.
 * 
 * Platform output:
 * - Web: 2px
 * - iOS: 2pt
 * - Android: 2dp
 */
export const borderEmphasis = { value: 'borderWidth200' } as BorderWidthSemanticToken;

/**
 * Heavy border width for strong visual weight.
 * 
 * References: borderWidth400 (4)
 * 
 * Use cases:
 * - Strong emphasis: Elements requiring dominant visual presence (rare)
 * - High-contrast boundaries: Maximum visual separation
 * - Brand-specific treatments: Special brand elements requiring heavy borders
 * 
 * Visual weight: Heavy, dominant
 * 
 * Warning: Use sparingly. Heavy borders can overwhelm interfaces.
 * Consider if borderEmphasis (2) would be sufficient before using this token.
 * 
 * Platform output:
 * - Web: 4px
 * - iOS: 4pt
 * - Android: 4dp
 */
export const borderHeavy = { value: 'borderWidth400' } as BorderWidthSemanticToken;

/**
 * Semantic border width tokens object for registry integration.
 * 
 * Note: Keys use short names (none, default, emphasis, heavy) because the
 * getAllSemanticTokens() function adds a 'border.' prefix when generating
 * CSS output. This produces correct CSS variable names like --border-none
 * instead of --border-none.
 */
export const SemanticBorderWidthTokens = {
  none: borderNone,
  default: borderDefault,
  emphasis: borderEmphasis,
  heavy: borderHeavy,
} as const;

/**
 * Type definition for semantic border width token keys.
 */
export type SemanticBorderWidthTokenKey = keyof typeof SemanticBorderWidthTokens;

/**
 * AI Agent Guidance for Border Width Token Selection
 * 
 * When applying border widths:
 * 
 * 1. No border (borderless elements, removing borders)?
 *    → Use borderNone
 *    → Explicitly communicates intent to remove border
 *    → Better than 0 for search/discoverability and maintenance
 * 
 * 2. Standard borders (cards, inputs at rest, buttons at rest, dividers)?
 *    → Use borderDefault
 *    → Provides neutral, standard visual weight
 * 
 * 3. Emphasized states (focus, selection, active)?
 *    → Use borderEmphasis
 *    → Draws attention without overwhelming
 *    → For web focus: Use with outline property, not border
 * 
 * 4. Strong visual weight (rare, special cases)?
 *    → Use borderHeavy
 *    → Consider if borderEmphasis would be sufficient first
 *    → Use sparingly to avoid overwhelming interface
 * 
 * 5. Platform-specific focus indicators?
 *    → Web: Use borderEmphasis with outline property
 *    → iOS: Use system-provided focus indicators
 *    → Android: Use ripple effects and elevation changes
 * 
 * 6. Component-specific needs?
 *    → Prioritize semantic tokens (borderNone, borderDefault, borderEmphasis, borderHeavy)
 *    → If semantic tokens don't meet requirements, use primitive tokens
 *    → If primitive tokens don't meet requirements, request component-specific token
 */
