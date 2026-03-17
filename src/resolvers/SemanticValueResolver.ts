/**
 * Semantic Value Resolver — Level 1 of the two-level mode-aware resolution system.
 *
 * Takes semantic tokens (with primitive reference names) and resolves them to
 * concrete rgba values for a given mode. Handles simple references and opacity
 * composition.
 *
 * @see design-outline.md § "Two-Level Resolution Flow" step 2
 * @see tasks.md Task 5.2
 */

import type { SemanticToken } from '../types/SemanticToken';
import type { ColorTokenValue } from '../types/PrimitiveToken';
import { getColorToken } from '../tokens/ColorTokens';
import { getOpacityToken } from '../tokens/OpacityTokens';

type Mode = 'light' | 'dark';
type Theme = 'base' | 'wcag';

/**
 * Resolve a color primitive's rgba value for the given mode and theme.
 * Falls back to light if dark slot value is missing.
 */
function resolveColorPrimitive(name: string, mode: Mode, theme: Theme = 'base'): string | null {
  try {
    const token = getColorToken(name as any);
    const colorValue = token.platforms.web.value as ColorTokenValue;
    return colorValue?.[mode]?.[theme] ?? colorValue?.light?.[theme] ?? null;
  } catch {
    return null;
  }
}

/** Parse rgba string into components. */
function parseRgba(rgba: string): { r: number; g: number; b: number } | null {
  const m = rgba.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
}

/**
 * Resolve a single semantic token's primitiveReferences to concrete rgba values
 * for the given mode. Returns a new token with baked values.
 */
export function resolveSemanticTokenValue(
  token: Omit<SemanticToken, 'primitiveTokens'>,
  mode: Mode,
  theme: Theme = 'base'
): Omit<SemanticToken, 'primitiveTokens'> {
  const refs = token.primitiveReferences;
  if (!refs) return token;

  // Modifier-based opacity composition: { value: 'black500' } + modifiers: [{ type: 'opacity', reference: 'opacity080' }]
  if (token.modifiers?.length) {
    const opacityMod = token.modifiers.find(m => m.type === 'opacity');
    const colorName = refs.value || refs.default;
    if (opacityMod && colorName && typeof colorName === 'string' && !colorName.startsWith('rgba(')) {
      const colorRgba = resolveColorPrimitive(colorName, mode, theme);
      const opacityToken = getOpacityToken(opacityMod.reference);
      if (colorRgba && opacityToken) {
        const parsed = parseRgba(colorRgba);
        if (parsed) {
          return {
            ...token,
            primitiveReferences: { value: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${opacityToken.baseValue})` },
            modifiers: [] // Composition resolved — clear modifiers
          };
        }
      }
    }
  }

  // Opacity composition: { color: 'gray100', opacity: 'opacity048' } (exactly 2 keys)
  const refKeys = Object.keys(refs);
  if (refs.color && refs.opacity && refKeys.length === 2) {
    const colorRgba = resolveColorPrimitive(refs.color, mode, theme);
    const opacityToken = getOpacityToken(refs.opacity);
    if (colorRgba && opacityToken) {
      const parsed = parseRgba(colorRgba);
      if (parsed) {
        return {
          ...token,
          primitiveReferences: { value: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${opacityToken.baseValue})` }
        };
      }
    }
    return token;
  }

  // Simple reference: { value: 'gray300' } or { default: 'gray300' }
  const refKey = refs.value ? 'value' : refs.default ? 'default' : null;
  const primitiveName = refKey ? refs[refKey] : Object.values(refs)[0];

  if (typeof primitiveName !== 'string' || primitiveName.startsWith('rgba(')) return token;

  const resolved = resolveColorPrimitive(primitiveName, mode, theme);
  if (!resolved) return token;

  const newRefs = { ...refs };
  if (refKey) {
    newRefs[refKey] = resolved;
  } else {
    newRefs[Object.keys(refs)[0]] = resolved;
  }
  return { ...token, primitiveReferences: newRefs };
}
