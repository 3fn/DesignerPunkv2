/**
 * Button-VerticalList-Item Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-VerticalList-Item
 * Type: Primitive (foundational component)
 * Custom Element Tag: <button-vertical-list-item>
 * 
 * Platform-agnostic token definitions for the Button-VerticalList-Item component.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--vertical-list-item-padding-block-rest))
 * - iOS: Swift constants (VerticalListItemTokens.paddingBlockRest)
 * - Android: Kotlin constants (VerticalListItemTokens.paddingBlockRest)
 * 
 * Token Relationships:
 * - verticalListItem.paddingBlock.rest (11px) uses TokenWithValue pattern (SPACING_BASE_VALUE * 1.375)
 * - verticalListItem.paddingBlock.selected (10px) references space125 (strategic flexibility token)
 * 
 * Height Stability Math:
 * - Rest State: 48px = (1px border × 2) + (11px padding × 2) + 24px content
 * - Selected State: 48px = (2px border × 2) + (10px padding × 2) + 24px content
 * 
 * @see .kiro/specs/038-vertical-list-buttons/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens, SPACING_BASE_VALUE } from '../../../tokens/SpacingTokens';

/**
 * Button-VerticalList-Item component tokens defined using the hybrid authoring API.
 * 
 * Each token either references a primitive spacing token or uses a family-conformant
 * value with reasoning explaining why the token exists and its purpose in the component.
 * 
 * Token values:
 * - paddingBlock.rest: 11px (1.375 × base, uses TokenWithValue pattern)
 * - paddingBlock.selected: 10px (1.25 × base, references space125 strategic flexibility token)
 * 
 * These tokens implement padding compensation to maintain constant 48px height
 * when border width changes between rest (1px) and selected (2px) states.
 * 
 * @see Requirements 6.1, 6.2 in .kiro/specs/038-vertical-list-buttons/requirements.md
 */
export const VerticalListItemTokens = defineComponentTokens({
  component: 'VerticalListItem',
  family: 'spacing',
  tokens: {
    'paddingBlock.rest': {
      value: SPACING_BASE_VALUE * 1.375, // 11px
      reasoning: 'Block padding at rest state (1px border). 11px padding + 1px border = 12px per side, achieving 48px total with 24px content. Uses TokenWithValue pattern as no primitive token exists for 11px.',
    },
    'paddingBlock.selected': {
      reference: spacingTokens.space125,
      reasoning: 'Block padding when selected (2px border). 10px padding + 2px border = 12px per side, maintaining 48px total with 24px content. References space125 strategic flexibility token.',
    },
  },
});

/**
 * Type for Button-VerticalList-Item padding block variants
 */
export type VerticalListItemPaddingBlockVariant = 'rest' | 'selected';

/**
 * Get Button-VerticalList-Item padding block value for a given state variant
 * 
 * @param variant - State variant ('rest' | 'selected')
 * @returns Padding value in pixels
 * 
 * @example
 * ```typescript
 * getVerticalListItemPaddingBlock('rest')     // Returns 11
 * getVerticalListItemPaddingBlock('selected') // Returns 10
 * ```
 */
export function getVerticalListItemPaddingBlock(variant: VerticalListItemPaddingBlockVariant): number {
  return VerticalListItemTokens[`paddingBlock.${variant}`];
}

/**
 * Semantic token references for Button-VerticalList-Item padding block values
 * 
 * Maps state variants to their primitive token references or value derivations.
 * Used for documentation and cross-referencing with the token system.
 */
export const VerticalListItemPaddingBlockTokenReferences = {
  /** Rest state uses TokenWithValue (SPACING_BASE_VALUE * 1.375 = 11px) */
  rest: 'SPACING_BASE_VALUE * 1.375',
  
  /** Selected state references space125 (strategic flexibility token) */
  selected: 'space125',
} as const;

/**
 * Get the primitive token reference or derivation for a Button-VerticalList-Item padding block variant
 * 
 * @param variant - State variant ('rest' | 'selected')
 * @returns Primitive token reference name or value derivation formula
 * 
 * @example
 * ```typescript
 * getVerticalListItemPaddingBlockTokenReference('rest')     // Returns 'SPACING_BASE_VALUE * 1.375'
 * getVerticalListItemPaddingBlockTokenReference('selected') // Returns 'space125'
 * ```
 */
export function getVerticalListItemPaddingBlockTokenReference(variant: VerticalListItemPaddingBlockVariant): string {
  return VerticalListItemPaddingBlockTokenReferences[variant];
}
