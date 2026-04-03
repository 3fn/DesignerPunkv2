/**
 * Avatar-Base Sizing Token Definitions
 *
 * Stemma System naming: [Family]-[Type] = Avatar-Base
 * Type: Primitive (foundational component)
 *
 * Platform-agnostic sizing tokens for Avatar-Base container dimensions.
 * References sizing primitives (Spec 092) instead of hard-coded values.
 *
 * Token Relationships:
 * - avatar.size.xs (24px) references size300
 * - avatar.size.sm (32px) references size400
 * - avatar.size.md (40px) references size500
 * - avatar.size.lg (48px) references size600
 * - avatar.size.xl (80px) references size1000
 * - avatar.size.xxl (128px) references size1600
 *
 * @see .kiro/specs/092-sizing-token-family/design.md
 */

import { defineComponentTokens } from '../../../build/tokens';
import { sizingTokens } from '../../../tokens/SizingTokens';

export const AvatarSizingTokens = defineComponentTokens({
  component: 'Avatar',
  family: 'sizing',
  tokens: {
    'size.xs': {
      reference: sizingTokens.size300,
      reasoning: 'Extra small avatar (24px). Compact contexts — inline mentions, dense lists.',
    },
    'size.sm': {
      reference: sizingTokens.size400,
      reasoning: 'Small avatar (32px). Comment threads, contact lists.',
    },
    'size.md': {
      reference: sizingTokens.size500,
      reasoning: 'Medium avatar (40px). Default size — profile cards, list items.',
    },
    'size.lg': {
      reference: sizingTokens.size600,
      reasoning: 'Large avatar (48px). Profile headers, prominent identity display.',
    },
    'size.xl': {
      reference: sizingTokens.size1000,
      reasoning: 'Extra large avatar (80px). Profile pages, hero sections.',
    },
    'size.xxl': {
      reference: sizingTokens.size1600,
      reasoning: 'Extra extra large avatar (128px). Full profile view, onboarding.',
    },
  },
});
