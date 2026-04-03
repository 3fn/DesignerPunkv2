/**
 * Input-Checkbox-Base Sizing Token Definitions
 *
 * Stemma System naming: [Family]-[Type] = Input-Checkbox-Base
 * Type: Primitive (foundational component)
 *
 * Sizing tokens for checkbox box dimensions only.
 * Icon sizes (checkmark) remain in the icon family — NOT sizing tokens.
 *
 * Note: Platform implementations currently compute box size from
 * iconSize + (inset × 2). These tokens document the expected result.
 * Both approaches produce identical values.
 *
 * @see .kiro/specs/092-sizing-token-family/design.md Decision 4
 */

import { defineComponentTokens } from '../../../build/tokens';
import { sizingTokens } from '../../../tokens/SizingTokens';

export const CheckboxSizingTokens = defineComponentTokens({
  component: 'InputCheckbox',
  family: 'sizing',
  tokens: {
    'box.sm': {
      reference: sizingTokens.size300,
      reasoning: 'Small checkbox box (24px). icon.size050 (16px) + inset.050 (4px) × 2.',
    },
    'box.md': {
      reference: sizingTokens.size400,
      reasoning: 'Medium checkbox box (32px). icon.size075 (20px) + inset.075 (6px) × 2.',
    },
    'box.lg': {
      reference: sizingTokens.size500,
      reasoning: 'Large checkbox box (40px). icon.size100 (24px) + inset.100 (8px) × 2.',
    },
  },
});
