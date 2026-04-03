/**
 * Input-Radio-Base Sizing Token Definitions
 *
 * Stemma System naming: [Family]-[Type] = Input-Radio-Base
 * Type: Primitive (foundational component)
 *
 * Sizing tokens for radio button box dimensions only.
 * Radio dot rendering uses separate visual tokens.
 *
 * Note: Platform implementations currently compute box size from
 * iconSize + (inset × 2). These tokens document the expected result.
 * Both approaches produce identical values.
 *
 * @see .kiro/specs/092-sizing-token-family/design.md Decision 4
 */

import { defineComponentTokens } from '../../../build/tokens';
import { sizingTokens } from '../../../tokens/SizingTokens';

export const RadioSizingTokens = defineComponentTokens({
  component: 'InputRadio',
  family: 'sizing',
  tokens: {
    'box.sm': {
      reference: sizingTokens.size300,
      reasoning: 'Small radio box (24px). Same dimensions as checkbox sm.',
    },
    'box.md': {
      reference: sizingTokens.size400,
      reasoning: 'Medium radio box (32px). Same dimensions as checkbox md.',
    },
    'box.lg': {
      reference: sizingTokens.size500,
      reasoning: 'Large radio box (40px). Same dimensions as checkbox lg.',
    },
  },
});
