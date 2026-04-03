/**
 * Component Tokens: Progress Indicator Family
 * 
 * Sizing, gap, and connector tokens for the Progress Indicator component family.
 * Uses the defineComponentTokens() API for pipeline integration and cross-platform output.
 * 
 * TOKEN COUNT: 10 component tokens
 * - Base sizes: 3 (sm, md, lg) — reference sizing primitives
 * - Current sizes: 3 (sm, md, lg) — reference sizing primitives (+4px emphasis)
 * - Gaps: 3 (sm, md, lg) — reference spacing primitives
 * - Connector: 1 (thickness) — references borderDefault (borderWidth100)
 * 
 * PRIMITIVE REFERENCES:
 * - Base sizes: size150 (12px), size200 (16px), size250 (20px)
 * - Current sizes: size200 (16px), size250 (20px), size300 (24px)
 * - Gaps: space075 (6px), space100 (8px), space150 (12px)
 * - Connector: borderWidth100 (1px)
 * 
 * @see .kiro/specs/048-progress-family/requirements.md (Requirements 5.7-5.15)
 * @see .kiro/specs/048-progress-family/design.md (Size Variant, Token Usage sections)
 */

import { defineComponentTokens } from '../../build/tokens';
import { spacingTokens } from '../../tokens/SpacingTokens';
import { sizingTokens } from '../../tokens/SizingTokens';
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
    // BASE NODE SIZES — reference sizing primitives (dimensions, not spacing)
    // ========================================================================

    'node.size.sm': {
      reference: sizingTokens.size150,
      reasoning: 'Small node base size (12px). Inactive dots in compact mobile contexts.',
    },
    'node.size.md': {
      reference: sizingTokens.size200,
      reasoning: 'Medium node base size (16px). Default inactive dot size.',
    },
    'node.size.lg': {
      reference: sizingTokens.size250,
      reasoning: 'Large node base size (20px). Inactive dots in desktop contexts.',
    },

    // ========================================================================
    // CURRENT NODE SIZES — reference sizing primitives directly (+4px emphasis)
    // Provides non-color visual differentiation of active position
    // ========================================================================

    'node.size.sm.current': {
      reference: sizingTokens.size200,
      reasoning: 'Current node emphasis for sm (16px). +4px over base 12px for non-color visual differentiation.',
    },
    'node.size.md.current': {
      reference: sizingTokens.size250,
      reasoning: 'Current node emphasis for md (20px). +4px over base 16px for non-color visual differentiation.',
    },
    'node.size.lg.current': {
      reference: sizingTokens.size300,
      reasoning: 'Current node emphasis for lg (24px). +4px over base 20px for non-color visual differentiation.',
    },

    // ========================================================================
    // GAP TOKENS — spacing between nodes (gaps are spacing, not sizing)
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
