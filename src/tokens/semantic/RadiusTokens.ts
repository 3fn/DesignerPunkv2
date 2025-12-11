/**
 * Semantic radius tokens providing contextual meaning.
 * 
 * All tokens reference primitive RadiusTokens by name to maintain mathematical relationships.
 * Uses { value: 'primitiveTokenName' } pattern following semantic/SpacingTokens.ts pattern.
 * 
 * Token Selection Guidance:
 * - radiusNone: Sharp corners, no rounding (cards, containers, inputs requiring sharp edges)
 * - radiusSubtle: Minimal rounding for subtle softening
 * - radiusSmall: Small rounding for buttons, inputs, chips
 * - radiusNormal: Standard rounding for cards, containers, modals
 * - radiusLarge: Large rounding for prominent elements, feature cards
 * - radiusFull: Full rounding for pills, circular avatars, badges
 */

/**
 * Radius semantic token structure
 * Uses { value: 'primitiveTokenName' } format for primitive references
 */
interface RadiusSemanticToken {
  value: string;
}

/**
 * No radius - sharp corners with no rounding.
 * 
 * References: radius000 (0)
 * 
 * Use cases:
 * - Sharp-edged cards: Cards requiring sharp, angular appearance
 * - Rectangular containers: Containers with no corner rounding
 * - Sharp inputs: Input fields with sharp corners
 * - Removing radius: Explicitly removing border radius from elements
 * - Reset states: Resetting border radius to none
 * 
 * Visual style: Sharp, angular, no softening
 * 
 * Rationale: Explicit "none" token improves search/discoverability, communicates intent
 * (sharp corners vs. forgetting to add radius), and provides consistent maintenance pattern
 * 
 * Platform output:
 * - Web: 0px
 * - iOS: 0pt
 * - Android: 0dp
 */
export const radiusNone = { value: 'radius000' } as RadiusSemanticToken;

/**
 * Subtle radius for minimal corner softening.
 * 
 * References: radius025 (2)
 * 
 * Use cases:
 * - Subtle softening: Elements requiring minimal corner rounding
 * - Dense interfaces: Compact elements with slight softening
 * - Minimal visual weight: Subtle rounding without drawing attention
 * 
 * Visual style: Barely perceptible rounding, subtle softening
 * 
 * Platform output:
 * - Web: 2px
 * - iOS: 2pt
 * - Android: 2dp
 */
export const radiusSubtle = { value: 'radius025' } as RadiusSemanticToken;

/**
 * Small radius for compact elements.
 * 
 * References: radius050 (4)
 * 
 * Use cases:
 * - Small buttons: Compact button elements
 * - Chips: Tag and chip components
 * - Small inputs: Compact input fields
 * - Dense UI elements: Elements in dense interfaces
 * 
 * Visual style: Noticeable but compact rounding
 * 
 * Platform output:
 * - Web: 4px
 * - iOS: 4pt
 * - Android: 4dp
 */
export const radiusSmall = { value: 'radius050' } as RadiusSemanticToken;

/**
 * Normal radius for standard elements.
 * 
 * References: radius100 (8)
 * 
 * Use cases:
 * - Standard buttons: Default button rounding
 * - Cards: Standard card corner rounding
 * - Containers: Default container rounding
 * - Modals: Modal dialog corner rounding
 * - Standard inputs: Default input field rounding
 * 
 * Visual style: Standard, balanced rounding
 * 
 * Platform output:
 * - Web: 8px
 * - iOS: 8pt
 * - Android: 8dp
 */
export const radiusNormal = { value: 'radius100' } as RadiusSemanticToken;

/**
 * Large radius for prominent elements.
 * 
 * References: radius200 (16)
 * 
 * Use cases:
 * - Large cards: Prominent feature cards
 * - Hero sections: Large hero containers
 * - Prominent buttons: Large, emphasized buttons
 * - Feature callouts: Emphasized content blocks
 * 
 * Visual style: Prominent, soft rounding
 * 
 * Platform output:
 * - Web: 16px
 * - iOS: 16pt
 * - Android: 16dp
 */
export const radiusLarge = { value: 'radius200' } as RadiusSemanticToken;

/**
 * Full radius for pills and circular elements.
 * 
 * References: radiusFull (9999)
 * 
 * Use cases:
 * - Pills: Pill-shaped buttons and badges
 * - Circular avatars: Round avatar images
 * - Circular badges: Round notification badges
 * - Fully rounded elements: Any element requiring perfect circular/pill shape
 * 
 * Visual style: Perfect circles or pills (fully rounded)
 * 
 * Platform output:
 * - Web: 9999px (effectively infinite)
 * - iOS: 9999pt (effectively infinite)
 * - Android: 9999dp (effectively infinite)
 */
export const radiusFull = { value: 'radiusFull' } as RadiusSemanticToken;

/**
 * Semantic radius tokens object for registry integration.
 */
export const SemanticRadiusTokens = {
  radiusNone,
  radiusSubtle,
  radiusSmall,
  radiusNormal,
  radiusLarge,
  radiusFull,
} as const;

/**
 * Type definition for semantic radius token keys.
 */
export type SemanticRadiusTokenKey = keyof typeof SemanticRadiusTokens;

/**
 * AI Agent Guidance for Radius Token Selection
 * 
 * When applying border radius:
 * 
 * 1. No rounding (sharp corners, angular design)?
 *    → Use radiusNone
 *    → Explicitly communicates intent for sharp corners
 *    → Better than 0 for search/discoverability and maintenance
 * 
 * 2. Minimal softening (subtle rounding)?
 *    → Use radiusSubtle
 *    → Barely perceptible rounding for subtle softening
 * 
 * 3. Compact elements (small buttons, chips, dense UI)?
 *    → Use radiusSmall
 *    → Noticeable but compact rounding
 * 
 * 4. Standard elements (buttons, cards, containers, modals)?
 *    → Use radiusNormal
 *    → Standard, balanced rounding for most UI elements
 * 
 * 5. Prominent elements (large cards, hero sections)?
 *    → Use radiusLarge
 *    → Prominent, soft rounding for emphasized elements
 * 
 * 6. Pills and circular elements (badges, avatars)?
 *    → Use radiusFull
 *    → Perfect circles or pill shapes
 * 
 * 7. Component-specific needs?
 *    → Prioritize semantic tokens (radiusNone through radiusFull)
 *    → If semantic tokens don't meet requirements, use primitive tokens
 *    → If primitive tokens don't meet requirements, request component-specific token
 */
