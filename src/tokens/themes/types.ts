/**
 * Theme override types for mode-aware semantic token resolution.
 * Used by SemanticOverrideResolver to swap primitiveReferences in dark mode.
 *
 * @see design.md § "Semantic Override Types"
 * @see tasks.md Task 2.1
 */

import type { TokenModifier } from '../../types/SemanticToken';

/** Override entry for a single semantic token's dark mode resolution. */
export interface SemanticOverride {
  /** Replacement primitiveReferences for dark mode. Replaces entire object — no partial merge. */
  primitiveReferences: Record<string, string>;
  /** Optional modifier override. Present (even []) = replace base. Absent = inherit base. */
  modifiers?: TokenModifier[];
}

/** Map of semantic token names to their dark mode overrides. */
export type SemanticOverrideMap = Record<string, SemanticOverride>;
