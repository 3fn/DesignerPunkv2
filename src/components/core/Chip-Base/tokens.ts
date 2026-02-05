/**
 * Chip-Base Component Token Definitions
 * 
 * Stemma System naming: Chip (Family)
 * Components: Chip-Base (Primitive), Chip-Filter (Semantic), Chip-Input (Semantic)
 * 
 * Platform-agnostic token definitions for the Chip component family.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--chip-padding-block))
 * - iOS: Swift constants (ChipTokens.paddingBlock)
 * - Android: Kotlin constants (ChipTokens.paddingBlock)
 * 
 * Token Relationships:
 * - chip.paddingBlock (6px) references space075 (strategic flexibility token)
 * 
 * Height Calculation:
 * - Visual height: 32px = (6px padding × 2) + 20px content (buttonSm typography)
 * - Tap area: 48px (tapAreaRecommended) via expanded hit area
 * 
 * MIGRATION NOTE (Spec 058):
 * This file was migrated from src/tokens/components/chip.ts to follow the Rosetta
 * System architecture which mandates component tokens live at
 * src/components/[ComponentName]/tokens.ts.
 * 
 * @see .kiro/specs/045-chip-base/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 * @see .kiro/specs/058-component-token-architecture-cleanup for migration details
 * @see Requirements 8.1, 8.2, 8.3, 12.1-12.5 in .kiro/specs/045-chip-base/requirements.md
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Chip component tokens defined using the hybrid authoring API.
 * 
 * Each token references a primitive spacing token with reasoning explaining
 * why the token exists and its purpose in the component.
 * 
 * Token values:
 * - paddingBlock: 6px (references space075 strategic flexibility token)
 * 
 * The paddingBlock token achieves the 32px visual height specification:
 * - 6px top padding + 20px content (buttonSm line-height) + 6px bottom padding = 32px
 * 
 * @see Requirements 8.1, 8.2, 8.3 in .kiro/specs/045-chip-base/requirements.md
 */
export const ChipTokens = defineComponentTokens({
  component: 'Chip',
  family: 'spacing',
  tokens: {
    'paddingBlock': {
      reference: spacingTokens.space075,
      reasoning: 'Block padding achieving 32px visual height with buttonSm typography. 6px padding × 2 + 20px content = 32px. References space075 strategic flexibility token (0.75 × 8 = 6px) as no standard 8-unit aligned token provides this value.',
    },
  },
});

/**
 * Get Chip padding block value
 * 
 * @returns Padding block value in pixels (6)
 * 
 * @example
 * ```typescript
 * getChipPaddingBlock() // Returns 6
 * ```
 */
export function getChipPaddingBlock(): number {
  return ChipTokens['paddingBlock'];
}

/**
 * Token reference documentation for Chip padding block
 * 
 * Documents the primitive token reference and mathematical derivation.
 * Used for documentation and cross-referencing with the token system.
 */
export const ChipTokenReferences = {
  /** Padding block references space075 strategic flexibility token */
  paddingBlock: {
    value: 6,
    primitiveReference: 'space075',
    derivation: 'SPACING_BASE_VALUE × 0.75 = 8 × 0.75 = 6',
    isStrategicFlexibility: true,
  },
} as const;
