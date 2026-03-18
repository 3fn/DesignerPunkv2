/**
 * Theme override types for mode-aware and theme-aware semantic token resolution.
 * Used by SemanticOverrideResolver to swap primitiveReferences per context.
 *
 * @see design.md § "Semantic Override Types"
 * @see tasks.md Task 2.1, Task 10.1
 */

import type { TokenModifier } from '../../types/SemanticToken';

/** Override entry for a single semantic token in a specific context. */
export interface SemanticOverride {
  /** Replacement primitiveReferences. Replaces entire object — no partial merge. */
  primitiveReferences: Record<string, string>;
  /** Optional modifier override. Present (even []) = replace base. Absent = inherit base. */
  modifiers?: TokenModifier[];
}

/** Map of semantic token names to their overrides for a single context. */
export type SemanticOverrideMap = Record<string, SemanticOverride>;

/** The four resolution contexts: mode × theme. */
export type ThemeContext = 'light-base' | 'light-wcag' | 'dark-base' | 'dark-wcag';

/** Override maps keyed by context. Only contexts with overrides need entries. */
export type ContextOverrideSet = Partial<Record<ThemeContext, SemanticOverrideMap>>;
