/**
 * Contract-Token Deriver
 *
 * Derives contract-token relationships by extracting token names from
 * accessibility and animation contract prose, then cross-referencing
 * against the component's schema token list.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirements 6.1–6.5
 */

import { ResolvedContracts, ContractTokenRelationships, ContractTokenPair, ContractTokenGap } from '../models';

/** Categories scoped for derivation */
const DERIVATION_CATEGORIES = new Set(['accessibility', 'animation']);

/**
 * Token name prefixes recognized by the extraction regex.
 *
 * IMPORTANT: This list is coupled to DERIVATION_CATEGORIES. If derivation
 * scope expands beyond accessibility/animation (e.g., to interaction contracts),
 * add the relevant prefixes here (e.g., `accessibility.`, `blend.`).
 */
const TOKEN_PATTERN = /\b((?:motion|color|opacity|duration|easing|scale)\.[a-zA-Z0-9.*]+|(?:duration|scale)\d{2,3}|easing[A-Z][a-zA-Z]*)\b/g;

/** Known stale token patterns that should be flagged */
const STALE_PATTERNS = [
  { pattern: /motion\.duration\.\w+/g, message: 'Stale motion token naming (motion.duration.X)' },
  { pattern: /motion\.easing\.\w+/g, message: 'Stale motion token naming (motion.easing.X)' },
];

export function deriveContractTokenRelationships(
  contracts: ResolvedContracts,
  schemaTokens: string[],
): ContractTokenRelationships {
  const resolved: ContractTokenPair[] = [];
  const gaps: ContractTokenGap[] = [];
  const tokenSet = new Set(schemaTokens);

  for (const [name, contract] of Object.entries(contracts.active)) {
    if (!DERIVATION_CATEGORIES.has(contract.category)) continue;

    // Check for stale patterns first
    for (const stale of STALE_PATTERNS) {
      const matches = contract.behavior.match(stale.pattern);
      if (matches) {
        for (const match of matches) {
          gaps.push({ contract: name, referencedToken: `${match} — ${stale.message}`, category: contract.category });
        }
      }
    }

    // Extract token references
    const matches = contract.behavior.matchAll(TOKEN_PATTERN);
    for (const match of matches) {
      const token = match[1];
      // Skip wildcard patterns like color.progress.*
      if (token.includes('*')) continue;

      if (tokenSet.has(token)) {
        resolved.push({ contract: name, token, category: contract.category });
      } else {
        gaps.push({ contract: name, referencedToken: token, category: contract.category });
      }
    }
  }

  return { resolved, gaps };
}
