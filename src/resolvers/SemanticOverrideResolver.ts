/**
 * SemanticOverrideResolver — Level 2 of the two-level mode-aware resolution system.
 *
 * Sits between Registry and Generation in the token pipeline. For dark mode,
 * swaps primitiveReferences on overridden tokens. For light mode, passes
 * tokens through unchanged.
 *
 * @see design.md § "Two-Level Resolution"
 * @see tasks.md Task 2.2
 */

import type { SemanticToken } from '../types/SemanticToken';
import type { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import type { SemanticOverrideMap } from '../tokens/themes/types';

export interface OverrideValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ResolvedTokenSets {
  light: SemanticToken[];
  dark: SemanticToken[];
}

export class SemanticOverrideResolver {
  constructor(
    private registry: SemanticTokenRegistry,
    private overrides: SemanticOverrideMap
  ) {}

  /** Validate all override keys exist in the semantic token registry. */
  validate(): OverrideValidationResult {
    const errors: string[] = [];
    for (const key of Object.keys(this.overrides)) {
      if (!this.registry.get(key)) {
        errors.push(`Orphaned override key "${key}": no matching semantic token in registry`);
      }
    }
    return { valid: errors.length === 0, errors };
  }

  /** Resolve a single token for the given mode. */
  resolve(token: SemanticToken, mode: 'light' | 'dark'): SemanticToken {
    if (mode === 'light') return token;

    const override = this.overrides[token.name];
    if (!override) return token;

    return {
      ...token,
      primitiveReferences: override.primitiveReferences,
      modifiers: 'modifiers' in override ? override.modifiers : token.modifiers,
    };
  }

  /** Produce light and dark token sets from an array of semantic tokens. */
  resolveAll(tokens: SemanticToken[]): ResolvedTokenSets {
    return {
      light: tokens.map(t => this.resolve(t, 'light')),
      dark: tokens.map(t => this.resolve(t, 'dark')),
    };
  }
}
