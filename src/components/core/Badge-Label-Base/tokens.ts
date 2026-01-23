/**
 * Badge-Label-Base Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Badge-Label-Base
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token definitions for the Badge-Label-Base component.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--badge-label-base-maxwidth))
 * - iOS: Swift constants (BadgeLabelBaseTokens.maxWidth)
 * - Android: Kotlin constants (BadgeLabelBaseTokens.maxWidth)
 * 
 * Token Relationships:
 * - badge-label-base.maxWidth (120px) uses family-conformant value (8 × 15)
 * 
 * @see .kiro/specs/044-badge-base/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 * @see Requirements 4.8, 9.3, 9.4, 9.5 in .kiro/specs/044-badge-base/requirements.md
 */

import { defineComponentTokens } from '../../../build/tokens';
import { SPACING_BASE_VALUE } from '../../../tokens/SpacingTokens';

/**
 * Badge-Label-Base component tokens defined using the hybrid authoring API.
 * 
 * Each token includes reasoning explaining why the token exists and its purpose
 * in the component.
 * 
 * Max-width token value:
 * - maxWidth: 120px (15 × base, family-conformant value)
 *   No primitive token exists at this scale, so we use a family-conformant value
 *   that follows the spacing family's mathematical pattern (BASE_VALUE × multiplier).
 * 
 * @see Requirements 4.8, 9.3, 9.4, 9.5 in .kiro/specs/044-badge-base/requirements.md
 */
export const BadgeLabelBaseTokens = defineComponentTokens({
  component: 'Badge-Label-Base',
  family: 'spacing',
  tokens: {
    'maxWidth': {
      value: SPACING_BASE_VALUE * 15, // 8 × 15 = 120px
      reasoning: 'Maximum width for truncated badges; allows ~12-15 characters before ellipsis while maintaining compact badge appearance. Value follows spacing family pattern (8 × 15 = 120px) but exceeds standard spacing scale, requiring component-level definition.',
    },
  },
});

/**
 * Get Badge-Label-Base max-width value
 * 
 * @returns Max-width value in pixels (120)
 * 
 * @example
 * ```typescript
 * getBadgeLabelMaxWidth() // Returns 120
 * ```
 */
export function getBadgeLabelMaxWidth(): number {
  return BadgeLabelBaseTokens['maxWidth'];
}

/**
 * Token reference documentation for Badge-Label-Base max-width
 * 
 * Documents the mathematical derivation and family conformance.
 * Used for documentation and cross-referencing with the token system.
 */
export const BadgeLabelBaseTokenReferences = {
  /** Max-width uses family-conformant value: 8 × 15 = 120px */
  maxWidth: {
    value: 120,
    derivation: 'SPACING_BASE_VALUE × 15 = 8 × 15 = 120',
    familyConformant: true,
    primitiveReference: null, // No primitive token at this scale
  },
} as const;
