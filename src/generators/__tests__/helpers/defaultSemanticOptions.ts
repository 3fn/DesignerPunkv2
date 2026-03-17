/**
 * Shared test helper: provides default resolved semantic tokens for generator tests.
 * Used after Task 5.7 removed self-fetch fallback from generators (Spec 080, D9).
 */
import { getAllSemanticTokens } from '../../../tokens/semantic';
import { resolveSemanticTokenValue } from '../../../resolvers/SemanticValueResolver';
import type { SemanticToken } from '../../../types/SemanticToken';

type ResolvedToken = Omit<SemanticToken, 'primitiveTokens'>;

const cached: { light?: ResolvedToken[]; dark?: ResolvedToken[] } = {};

function resolve() {
  if (!cached.light) {
    const base = getAllSemanticTokens();
    cached.light = base.map(t => resolveSemanticTokenValue(t, 'light'));
    cached.dark = base.map(t => resolveSemanticTokenValue(t, 'dark'));
  }
  return { semanticTokens: cached.light!, darkSemanticTokens: cached.dark! };
}

export function defaultSemanticOptions() {
  return resolve();
}
