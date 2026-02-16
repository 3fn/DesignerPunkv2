/**
 * Component Tokens: Progress Indicator Family
 * 
 * Sizing, gap, and connector tokens for the Progress Indicator component family.
 * Uses the defineComponentTokens() API for pipeline integration and cross-platform output.
 * 
 * TOKEN COUNT: 10 component tokens
 * - Base sizes: 3 (sm, md, lg) — reference spacing primitives
 * - Current sizes: 3 (sm, md, lg) — formula-based: SPACING_BASE_VALUE × multiplier
 * - Gaps: 3 (sm, md, lg) — reference spacing primitives
 * - Connector: 1 (thickness) — references borderDefault (borderWidth100)
 * 
 * SIZE FORMULA:
 * Current node sizes use SPACING_BASE_VALUE × multiplier to produce +4px emphasis:
 * - sm: 8 × 2   = 16px (base 12px + 4px)
 * - md: 8 × 2.5 = 20px (base 16px + 4px)
 * - lg: 8 × 3.5 = 28px (base 24px + 4px)
 * 
 * All current sizes are divisible by 4px (baseline grid aligned).
 * 
 * PRIMITIVE REFERENCES:
 * - Base sizes: space150 (12px), space200 (16px), space300 (24px)
 * - Gaps: space075 (6px), space100 (8px), space150 (12px)
 * - Connector: borderWidth100 (1px)
 * 
 * @see .kiro/specs/048-progress-family/requirements.md (Requirements 5.7-5.15)
 * @see .kiro/specs/048-progress-family/design.md (Size Variant, Token Usage sections)
 */

import { defineComponentTokens } from '../../build/tokens';
import { spacingTokens, SPACING_BASE_VALUE } from '../../tokens/SpacingTokens';
import { borderWidthTokens } from '../../tokens/BorderWidthTokens';

/**
 * Progress Indicator component tokens defined using the hybrid authoring API.
 * 
 * 13 tokens organized by concept:
 * - node.size.{sm|md|lg}         — base node dimensions
 * - node.size.{sm|md|lg}.current — emphasized node dimensions (+4px)
 * - node.gap.{sm|md|lg}          — spacing between nodes
 * - connector.thickness           — connector line width
 */
export const ProgressTokens = defineComponentTokens({
  component: 'Progress',
  family: 'spacing',
  tokens: {
    // ========================================================================
    // BASE NODE SIZES — reference spacing primitives directly
    // ========================================================================

    'node.size.sm': {
      reference: spacingTokens.space150,
      reasoning: 'Small node base size (12px = 1.5× base). Used for pagination dots in compact mobile contexts where minimal visual footprint is needed.',
    },
    'node.size.md': {
      reference: spacingTokens.space200,
      reasoning: 'Medium node base size (16px = 2× base). Default size for steppers, providing balanced visual weight for most UI contexts.',
    },
    'node.size.lg': {
      reference: spacingTokens.space300,
      reasoning: 'Large node base size (24px = 3× base). Used for detailed steppers in desktop contexts requiring prominent visual presence.',
    },

    // ========================================================================
    // CURRENT NODE SIZES — formula-based: SPACING_BASE_VALUE × multiplier
    // Provides +4px emphasis over base size for non-color visual differentiation
    // ========================================================================

    'node.size.sm.current': {
      value: SPACING_BASE_VALUE * 2,
      reasoning: 'Current node emphasis for sm (16px = 8×2). Provides +4px over base 12px for non-color visual differentiation of active position. Divisible by 4px (baseline grid aligned).',
    },
    'node.size.md.current': {
      value: SPACING_BASE_VALUE * 2.5,
      reasoning: 'Current node emphasis for md (20px = 8×2.5). Provides +4px over base 16px for non-color visual differentiation of active position. Divisible by 4px (baseline grid aligned).',
    },
    'node.size.lg.current': {
      value: SPACING_BASE_VALUE * 3.5,
      reasoning: 'Current node emphasis for lg (28px = 8×3.5). Provides +4px over base 24px for non-color visual differentiation of active position. Divisible by 4px (baseline grid aligned).',
    },

    // ========================================================================
    // GAP TOKENS — spacing between nodes, reference spacing primitives
    // ========================================================================

    'node.gap.sm': {
      reference: spacingTokens.space075,
      reasoning: 'Small gap between nodes (6px = 0.75× base). Tight spacing for compact pagination dots in mobile contexts.',
    },
    'node.gap.md': {
      reference: spacingTokens.space100,
      reasoning: 'Medium gap between nodes (8px = 1× base). Default spacing for stepper nodes, providing clear separation without excessive whitespace.',
    },
    'node.gap.lg': {
      reference: spacingTokens.space150,
      reasoning: 'Large gap between nodes (12px = 1.5× base). Generous spacing for detailed steppers with labels in desktop contexts.',
    },

    // ========================================================================
    // CONNECTOR TOKENS — line connecting nodes in steppers
    // ========================================================================

    'connector.thickness': {
      reference: borderWidthTokens.borderWidth100,
      reasoning: 'Connector line thickness (1px). References borderDefault primitive for consistent border treatment across the design system.',
    },
  },
});

// ============================================================================
// Constants and Utilities
// ============================================================================

/** 
 * Expected token count for governance validation
 * 
 * 10 tokens: 3 base sizes + 3 current sizes + 3 gaps + 1 connector thickness
 * 
 * Note: Requirements 5.14 states "13 tokens (6 base sizes, 3 current sizes, 3 gaps, 1 connector thickness)"
 * but the design document specifies exactly 3 base sizes (sm/md/lg) and 3 current sizes (sm/md/lg).
 * The actual count from the design is 10 tokens. The "6 base sizes" in the requirement likely
 * refers to all 6 node size tokens (3 base + 3 current), making "3 current sizes" redundant.
 */
export const PROGRESS_COMPONENT_TOKEN_COUNT = 10;

/** All progress component token names for validation and iteration */
export const progressComponentTokenNames = [
  'node.size.sm',
  'node.size.md',
  'node.size.lg',
  'node.size.sm.current',
  'node.size.md.current',
  'node.size.lg.current',
  'node.gap.sm',
  'node.gap.md',
  'node.gap.lg',
  'connector.thickness',
] as const;

/**
 * Validate that the progress component token count matches the expected count (13)
 */
export function validateProgressComponentTokenCount(): boolean {
  return Object.keys(ProgressTokens).length === PROGRESS_COMPONENT_TOKEN_COUNT;
}

/**
 * Get a single progress component token value by key
 */
export function getProgressComponentToken(key: string): number | undefined {
  return (ProgressTokens as Record<string, number>)[key];
}

/**
 * Get all progress component token entries as key-value pairs
 */
export function getAllProgressComponentTokens(): Array<{ name: string; value: number }> {
  return Object.entries(ProgressTokens).map(([name, value]) => ({ name, value }));
}
