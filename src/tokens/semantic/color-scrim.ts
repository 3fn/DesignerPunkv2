/**
 * Semantic Scrim Color Token Definitions
 * 
 * Scrim tokens provide dark translucent overlays for floating surfaces over content.
 * These are mode-invariant — scrims dim content regardless of light/dark theme.
 * 
 * Uses the modifier architecture: base color + opacity modifier.
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

export const scrimColorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'color.scrim.standard': {
    name: 'color.scrim.standard',
    primitiveReferences: { value: 'black500' },
    modifiers: [{ type: 'opacity', reference: 'opacity080' }],
    modeInvariant: true,
    category: SemanticCategory.COLOR,
    context: 'Derived from black500 at opacity080 (80%). Scrim tokens dim content regardless of theme.',
    description: 'Standard scrim for floating surfaces over content — pagination pills, dense overlays, floating toolbars.'
  }
};

export const scrimColorTokenNames = Object.keys(scrimColorTokens);
export const SCRIM_COLOR_TOKEN_COUNT = 1;

export function getScrimColorToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return scrimColorTokens[name];
}

export function getAllScrimColorTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(scrimColorTokens);
}
