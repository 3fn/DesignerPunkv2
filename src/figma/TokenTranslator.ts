/**
 * TokenTranslator — Translates Figma values to DesignerPunk tokens.
 *
 * Uses a variable-binding-first approach: match by Figma variable name
 * before falling back to value-based matching. This leverages the known
 * token names pushed by Spec 054a.
 *
 * @requirements Req 2
 * @spec 054b-figma-design-extract
 */

import type { DTCGTokenFile, DTCGToken, DTCGGroup } from '../generators/types/DTCGTypes';
import type {
  ClassificationTier,
  ClassifiedToken,
  UnidentifiedValue,
  UnidentifiedReason,
} from './ComponentAnalysis';

// Re-export for consumers that need the type alongside TokenTranslator
export type { DTCGTokenFile };

/**
 * Categories of token values that determine matching tolerance rules.
 */
export type TokenCategory = 'spacing' | 'color' | 'typography' | 'radius' | 'shadow' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing' | 'borderWidth' | 'opacity' | 'sizing';

/**
 * Result of translating a Figma value to a DesignerPunk token.
 */
export interface TranslationResult {
  /** Matched token path (dot notation), or empty string if no match */
  token: string;
  /** Match confidence level */
  confidence: 'exact' | 'approximate' | 'no-match';
  /** How the match was found */
  matchMethod: 'binding' | 'value';
  /** Original Figma value as string */
  rawValue: string;
  /** Primitive token path if resolved */
  primitive?: string;
  /** Semantic token path if resolved */
  semantic?: string;
  /** Suggested closest token when no exact match */
  suggestion?: string;
  /** Difference from matched token value (e.g., "±1px", "ΔE 2.1") */
  delta?: string;
}

/**
 * Aggregate counts of classified values across all three tiers.
 * @requirements Req 1 (AC 5)
 */
export interface ClassificationSummary {
  semanticIdentified: number;
  primitiveIdentified: number;
  unidentified: number;
}

/**
 * Convert a Figma variable name (slash notation) to a DTCG token path (dot notation).
 *
 * @example
 * figmaNameToTokenPath('space/100')           // → 'space.100'
 * figmaNameToTokenPath('color/purple/300')     // → 'color.purple.300'
 * figmaNameToTokenPath('color/feedback/success/text') // → 'color.feedback.success.text'
 */
export function figmaNameToTokenPath(figmaName: string): string {
  return figmaName.replace(/\//g, '.');
}

// ---------------------------------------------------------------------------
// Color conversion utilities for value-based matching
// ---------------------------------------------------------------------------

/** RGB color with channels in 0–255 range. */
interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** CIELAB color. */
interface Lab {
  L: number;
  a: number;
  b: number;
}

/**
 * Parse an rgba() string into RGB channels.
 * Handles both `rgba(r, g, b, a)` and `rgb(r, g, b)`.
 */
export function parseRgba(rgba: string): RGB | null {
  const match = rgba.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/,
  );
  if (!match) return null;
  return {
    r: parseFloat(match[1]),
    g: parseFloat(match[2]),
    b: parseFloat(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

/**
 * Parse a hex color string into RGB channels.
 * Supports #RGB, #RRGGBB, #RRGGBBAA.
 */
export function parseHex(hex: string): RGB | null {
  const h = hex.replace(/^#/, '');
  let r: number, g: number, b: number, a = 1;

  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else if (h.length === 8) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
  return { r, g, b, a };
}

/**
 * Convert sRGB (0–255) to linear RGB (0–1).
 */
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Convert RGB to CIELAB via XYZ (D65 illuminant).
 */
export function rgbToLab(rgb: RGB): Lab {
  // sRGB → linear RGB → XYZ (D65)
  const rl = srgbToLinear(rgb.r);
  const gl = srgbToLinear(rgb.g);
  const bl = srgbToLinear(rgb.b);

  let x = (0.4124564 * rl + 0.3575761 * gl + 0.1804375 * bl) / 0.95047;
  let y = (0.2126729 * rl + 0.7151522 * gl + 0.0721750 * bl) / 1.00000;
  let z = (0.0193339 * rl + 0.1191920 * gl + 0.9503041 * bl) / 1.08883;

  const epsilon = 0.008856;
  const kappa = 903.3;

  x = x > epsilon ? Math.cbrt(x) : (kappa * x + 16) / 116;
  y = y > epsilon ? Math.cbrt(y) : (kappa * y + 16) / 116;
  z = z > epsilon ? Math.cbrt(z) : (kappa * z + 16) / 116;

  return {
    L: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

/**
 * CIE76 color difference (ΔE).
 * Values < 3 are perceptually similar.
 */
export function deltaE(lab1: Lab, lab2: Lab): number {
  return Math.sqrt(
    (lab1.L - lab2.L) ** 2 +
    (lab1.a - lab2.a) ** 2 +
    (lab1.b - lab2.b) ** 2,
  );
}

// ---------------------------------------------------------------------------
// Dimension parsing
// ---------------------------------------------------------------------------

/**
 * Parse a dimension string (e.g., "24px", "50%") into a numeric value.
 * Returns NaN for non-parseable strings.
 */
function parseDimension(value: string): number {
  const match = value.match(/^([\d.]+)\s*(px|%)?$/);
  return match ? parseFloat(match[1]) : NaN;
}

// ---------------------------------------------------------------------------
// Internal types for value index
// ---------------------------------------------------------------------------

/** Entry in the flat value index used for value-based matching. */
interface ValueIndexEntry {
  tokenPath: string;
  numericValue: number;  // For dimension tokens (spacing, radius, fontSize)
  rgb: RGB | null;       // For color tokens
  family: string;        // Token family from extensions
}

// ---------------------------------------------------------------------------
// TokenTranslator
// ---------------------------------------------------------------------------

/**
 * Translates Figma values to DesignerPunk DTCG tokens using a binding-first
 * approach with value-based fallback.
 */
export class TokenTranslator {
  /**
   * Reverse index: Figma variable name (slash notation) → DTCG token path (dot notation).
   * Built at construction time by walking the DTCG tree and applying the same
   * naming transforms that FigmaTransformer.toFigmaVariableName uses during push.
   */
  private readonly figmaToTokenIndex: Map<string, string>;

  /**
   * Flat value index for value-based matching. Keyed by category, each entry
   * holds the token path, numeric value, and optional RGB for color tokens.
   */
  private readonly valueIndex: Map<TokenCategory, ValueIndexEntry[]>;

  /**
   * Reverse alias index: primitive token path → semantic token paths that alias it.
   * Built at construction time by scanning all tokens for DTCG alias references.
   * Used by enrichResponse to find semantic tokens for a given primitive.
   */
  private readonly primitiveToSemanticIndex: Map<string, string[]>;

  constructor(private readonly dtcgTokens: DTCGTokenFile) {
    this.figmaToTokenIndex = this.buildFigmaToTokenIndex();
    this.valueIndex = this.buildValueIndex();
    this.primitiveToSemanticIndex = this.buildPrimitiveToSemanticIndex();
  }

  /** Expose the DTCG token file for downstream consumers (e.g. composite token reconstruction). */
  getDtcgTokens(): DTCGTokenFile {
    return this.dtcgTokens;
  }

  /**
   * Walk the DTCG token tree and build a reverse lookup from Figma variable
   * names to DTCG token paths. Mirrors the naming logic in
   * FigmaTransformer.toFigmaVariableName so that extraction can reverse the
   * push transformation.
   */
  private buildFigmaToTokenIndex(): Map<string, string> {
    const index = new Map<string, string>();

    const walk = (node: Record<string, unknown>, parentPath: string, groupPath: string): void => {
      for (const key of Object.keys(node)) {
        if (key.startsWith('$')) continue;

        const child = node[key];
        if (child == null || typeof child !== 'object') continue;

        const dtcgPath = parentPath ? `${parentPath}.${key}` : key;

        if ('$value' in child) {
          // Leaf token — compute the Figma variable name
          const figmaName = this.toFigmaVariableName(groupPath, key);
          index.set(figmaName, dtcgPath);
        } else {
          // Group — recurse. groupPath uses slash separators for Figma hierarchy.
          const nextGroup = groupPath ? `${groupPath}/${key}` : key;
          walk(child as Record<string, unknown>, dtcgPath, nextGroup);
        }
      }
    };

    walk(this.dtcgTokens as unknown as Record<string, unknown>, '', '');
    return index;
  }

  /**
   * Build a flat value index for value-based matching.
   * Walks the DTCG tree and categorises each leaf token by family.
   */
  private buildValueIndex(): Map<TokenCategory, ValueIndexEntry[]> {
    const index = new Map<TokenCategory, ValueIndexEntry[]>();
    for (const cat of ['spacing', 'color', 'typography', 'radius', 'shadow', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'borderWidth', 'opacity', 'sizing'] as TokenCategory[]) {
      index.set(cat, []);
    }

    const walk = (node: Record<string, unknown>, parentPath: string): void => {
      for (const key of Object.keys(node)) {
        if (key.startsWith('$')) continue;
        const child = node[key];
        if (child == null || typeof child !== 'object') continue;

        const dtcgPath = parentPath ? `${parentPath}.${key}` : key;

        if ('$value' in child) {
          const token = child as DTCGToken;
          const family = token.$extensions?.designerpunk?.family ?? '';
          const type = token.$type;
          const value = token.$value;

          // Map family/type to category
          const category = this.familyToCategory(family, type);
          if (!category) {
            walk(child as Record<string, unknown>, dtcgPath);
            continue;
          }

          if (category === 'color') {
            const rgb = typeof value === 'string' ? parseRgba(value) : null;
            if (rgb) {
              index.get('color')!.push({ tokenPath: dtcgPath, numericValue: NaN, rgb, family });
            }
          } else if (category === 'spacing' || category === 'radius' || category === 'typography'
            || category === 'fontSize' || category === 'fontWeight' || category === 'lineHeight'
            || category === 'letterSpacing' || category === 'borderWidth' || category === 'opacity'
            || category === 'sizing') {
            const num = typeof value === 'string' ? parseDimension(value) : typeof value === 'number' ? value : NaN;
            if (!isNaN(num)) {
              index.get(category)!.push({ tokenPath: dtcgPath, numericValue: num, rgb: null, family });
            }
          }
          // shadow composites are handled separately (Task 3.7), skip for value index
        } else {
          walk(child as Record<string, unknown>, dtcgPath);
        }
      }
    };

    walk(this.dtcgTokens as unknown as Record<string, unknown>, '');
    return index;
  }

  /**
   * Build a reverse index from primitive token paths to the semantic tokens
   * that alias them. Walks the DTCG tree looking for alias references
   * (values matching `{group.key}` syntax) and maps the resolved primitive
   * path to the semantic token path.
   */
  private buildPrimitiveToSemanticIndex(): Map<string, string[]> {
    const index = new Map<string, string[]>();

    const walk = (node: Record<string, unknown>, parentPath: string): void => {
      for (const key of Object.keys(node)) {
        if (key.startsWith('$')) continue;
        const child = node[key];
        if (child == null || typeof child !== 'object') continue;

        const dtcgPath = parentPath ? `${parentPath}.${key}` : key;

        if ('$value' in child) {
          const token = child as DTCGToken;
          const value = token.$value;
          // Detect DTCG alias references: "{group.tokenKey}"
          if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const primitivePath = value.slice(1, -1); // strip { }
            const existing = index.get(primitivePath);
            if (existing) {
              existing.push(dtcgPath);
            } else {
              index.set(primitivePath, [dtcgPath]);
            }
          }
          // Also recurse into token objects that may have nested groups
          walk(child as Record<string, unknown>, dtcgPath);
        } else {
          walk(child as Record<string, unknown>, dtcgPath);
        }
      }
    };

    walk(this.dtcgTokens as unknown as Record<string, unknown>, '');
    return index;
  }

  /**
   * Map a token family and DTCG type to a TokenCategory for value matching.
   */
  private familyToCategory(family: string, type?: string): TokenCategory | null {
    if (family === 'spacing' || family === 'inset') return 'spacing';
    if (family === 'color') return 'color';
    if (family === 'radius') return 'radius';
    if (family === 'fontSize') return 'fontSize';
    if (family === 'fontWeight') return 'fontWeight';
    if (family === 'lineHeight') return 'lineHeight';
    if (family === 'letterSpacing') return 'letterSpacing';
    if (family === 'borderWidth') return 'borderWidth';
    if (family === 'opacity') return 'opacity';
    if (family === 'sizing' || family === 'icon' || family === 'tapArea') return 'sizing';
    if (type === 'color') return 'color';
    if (type === 'shadow') return 'shadow';
    return null;
  }

  /**
   * Convert a DTCG token key to a Figma variable name segment.
   * Mirrors FigmaTransformer.toFigmaVariableName logic for reverse lookup.
   */
  private toFigmaVariableName(groupPath: string, tokenKey: string): string {
    // Semantic tokens use dot-separated keys → convert dots to slashes
    if (tokenKey.includes('.')) {
      return tokenKey.replace(/\./g, '/');
    }

    const baseName = groupPath.split('/')[0];
    const stripped = this.stripGroupPrefix(baseName, tokenKey);
    const parts = this.splitNameAndNumber(stripped);

    const isNested = groupPath.includes('/');

    if (parts) {
      if (isNested) {
        return `${groupPath}/${parts.name}/${parts.number}`;
      }
      return `${baseName}/${parts.name}/${parts.number}`;
    }

    if (isNested) {
      return `${groupPath}/${stripped}`;
    }
    return `${baseName}/${stripped}`;
  }

  /**
   * Strip the group prefix from a token key if present.
   * e.g., ("space", "space100") → "100"
   */
  private stripGroupPrefix(groupName: string, tokenKey: string): string {
    if (
      tokenKey.toLowerCase().startsWith(groupName.toLowerCase()) &&
      tokenKey.length > groupName.length
    ) {
      const remainder = tokenKey.slice(groupName.length);
      if (/^[0-9A-Z]/.test(remainder)) {
        return remainder;
      }
    }
    return tokenKey;
  }

  /**
   * Split a name into alphabetic prefix and numeric suffix.
   * e.g., "purple300" → { name: "purple", number: "300" }
   */
  private splitNameAndNumber(value: string): { name: string; number: string } | null {
    const match = value.match(/^([a-zA-Z]+)(\d+)$/);
    if (match) {
      return { name: match[1], number: match[2] };
    }
    return null;
  }

  /**
   * Look up a token in the DTCG tree by dot-notation path.
   * Returns the token if found, or undefined.
   */
  lookupToken(tokenPath: string): DTCGToken | undefined {
    const parts = tokenPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = this.dtcgTokens;

    for (let i = 0; i < parts.length; i++) {
      if (current == null || typeof current !== 'object') return undefined;

      // Try single segment first (normal nested key)
      if (parts[i] in current) {
        current = current[parts[i]];
        continue;
      }

      // Try joining remaining segments for flat dot-separated keys
      // e.g., semanticColor has key "color.feedback.success.text"
      const remaining = parts.slice(i).join('.');
      if (remaining in current) {
        current = current[remaining];
        break;
      }

      return undefined;
    }

    // A valid DTCG token has a $value field
    if (current != null && typeof current === 'object' && '$value' in current) {
      return current as DTCGToken;
    }

    return undefined;
  }

  /**
   * Primary translation: match by Figma variable name → DTCG token path.
   *
   * Uses the reverse index built at construction time to map Figma variable
   * names back to DTCG token paths. This handles the non-trivial naming
   * transforms applied during push (group prefix stripping, name/number
   * splitting, semantic dot-to-slash conversion).
   *
   * Falls back to naive slash-to-dot conversion for names that weren't
   * produced by FigmaTransformer (e.g., manually created Figma variables).
   *
   * @requirements Req 2
   */
  translateByBinding(figmaVariableName: string): TranslationResult {
    // Primary: use the reverse index (handles push naming transforms)
    const indexedPath = this.figmaToTokenIndex.get(figmaVariableName);
    if (indexedPath) {
      const token = this.lookupToken(indexedPath);
      if (token) {
        return {
          token: indexedPath,
          confidence: 'exact',
          matchMethod: 'binding',
          rawValue: String(token.$value),
        };
      }
    }

    // Fallback: naive slash-to-dot conversion for manually created variables
    const naivePath = figmaNameToTokenPath(figmaVariableName);
    const naiveToken = this.lookupToken(naivePath);
    if (naiveToken) {
      return {
        token: naivePath,
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: String(naiveToken.$value),
      };
    }

    return {
      token: '',
      confidence: 'no-match',
      matchMethod: 'binding',
      rawValue: '',
    };
  }

  /**
   * Fallback translation: match by raw value with category-specific tolerance.
   *
   * Tolerance rules:
   * - Spacing: ±2px
   * - Color: ΔE < 3 (CIELAB)
   * - Font size (typography): ±1px
   * - Radius: ±1px
   *
   * @requirements Req 2
   */
  translateByValue(
    value: number | string,
    category: TokenCategory,
  ): TranslationResult {
    const rawValue = String(value);
    const entries = this.valueIndex.get(category);
    if (!entries || entries.length === 0) {
      return { token: '', confidence: 'no-match', matchMethod: 'value', rawValue };
    }

    if (category === 'color') {
      return this.matchColor(value, rawValue, entries);
    }

    return this.matchDimension(value, rawValue, category, entries);
  }

  /**
   * Match a color value against the color value index using CIELAB ΔE.
   */
  private matchColor(
    value: number | string,
    rawValue: string,
    entries: ValueIndexEntry[],
  ): TranslationResult {
    // Parse input color — accept hex or rgba
    let inputRgb: RGB | null = null;
    if (typeof value === 'string') {
      inputRgb = value.startsWith('#') ? parseHex(value) : parseRgba(value);
    }
    if (!inputRgb) {
      return { token: '', confidence: 'no-match', matchMethod: 'value', rawValue };
    }

    const inputLab = rgbToLab(inputRgb);
    let bestDelta = Infinity;
    let bestPath = '';

    for (const entry of entries) {
      if (!entry.rgb) continue;
      const entryLab = rgbToLab(entry.rgb);
      const d = deltaE(inputLab, entryLab);

      if (d < bestDelta) {
        bestDelta = d;
        bestPath = entry.tokenPath;
      }
    }

    if (bestDelta === 0) {
      return { token: bestPath, confidence: 'exact', matchMethod: 'value', rawValue };
    }

    if (bestDelta < 3) {
      return {
        token: bestPath,
        confidence: 'approximate',
        matchMethod: 'value',
        rawValue,
        delta: `ΔE ${bestDelta.toFixed(1)}`,
      };
    }

    // No match within tolerance — return suggestion
    return {
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue,
      suggestion: bestPath || undefined,
      delta: bestPath ? `ΔE ${bestDelta.toFixed(1)}` : undefined,
    };
  }

  /**
   * Match a dimension value (spacing, radius, typography/fontSize) against
   * the value index with category-specific tolerance.
   */
  private matchDimension(
    value: number | string,
    rawValue: string,
    category: TokenCategory,
    entries: ValueIndexEntry[],
  ): TranslationResult {
    const inputNum = typeof value === 'number'
      ? value
      : parseDimension(String(value));

    if (isNaN(inputNum)) {
      return { token: '', confidence: 'no-match', matchMethod: 'value', rawValue };
    }

    const tolerance = category === 'spacing' ? 2 : 1; // ±2px spacing, ±1px font/radius

    let bestDelta = Infinity;
    let bestPath = '';

    for (const entry of entries) {
      const d = Math.abs(entry.numericValue - inputNum);
      if (d < bestDelta) {
        bestDelta = d;
        bestPath = entry.tokenPath;
      }
    }

    if (bestDelta === 0) {
      return { token: bestPath, confidence: 'exact', matchMethod: 'value', rawValue };
    }

    if (bestDelta <= tolerance) {
      const sign = bestDelta === 0 ? '' : '±';
      return {
        token: bestPath,
        confidence: 'approximate',
        matchMethod: 'value',
        rawValue,
        delta: `${sign}${bestDelta}px`,
      };
    }

    // No match within tolerance — return suggestion
    return {
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue,
      suggestion: bestPath || undefined,
      delta: bestPath ? `±${bestDelta}px` : undefined,
    };
  }

  /**
   * Enrich a translation result with both primitive and semantic token references.
   *
   * - If the matched token is a semantic alias, resolves the underlying primitive.
   * - If the matched token is a primitive, searches for semantic tokens that alias it.
   * - Populates both `primitive` and `semantic` fields in the result.
   * - Prioritises the semantic token in the primary `token` field when available.
   *
   * @requirements Req 2
   */
  enrichResponse(result: TranslationResult): TranslationResult {
    // Nothing to enrich for no-match results
    if (result.confidence === 'no-match' || !result.token) {
      return result;
    }

    const token = this.lookupToken(result.token);
    if (!token) return result;

    const value = token.$value;
    const isAlias = typeof value === 'string' && value.startsWith('{') && value.endsWith('}');

    if (isAlias) {
      // Matched token is semantic — resolve the primitive it aliases
      const primitivePath = (value as string).slice(1, -1);
      return {
        ...result,
        semantic: result.token,
        primitive: primitivePath,
        // Keep semantic as the primary token (already is)
      };
    }

    // Matched token is primitive — search for semantic tokens that alias it
    const semanticPaths = this.primitiveToSemanticIndex.get(result.token);
    if (semanticPaths && semanticPaths.length > 0) {
      // Pick the first semantic token (stable ordering from tree walk)
      const semanticPath = semanticPaths[0];
      return {
        ...result,
        primitive: result.token,
        semantic: semanticPath,
        // Promote semantic to primary token field
        token: semanticPath,
      };
    }

    // Primitive with no semantic alias — just mark as primitive
    return {
      ...result,
      primitive: result.token,
    };
  }

  /**
   * Composite translation: tries binding first, then falls back to value-based matching.
   *
   * 1. If `figmaVariableName` is provided, attempt `translateByBinding()`.
   * 2. If binding returns an exact match, enrich and return immediately.
   * 3. Otherwise fall back to `translateByValue()` with the raw value.
   * 4. Enrich the result with primitive/semantic references.
   * 5. If still no match, return a no-match result with the closest suggestion (if any).
   *
   * @requirements Req 2
   */
  translate(
    figmaVariableName: string | undefined,
    rawValue: number | string,
    category: TokenCategory,
  ): TranslationResult {
    const rawStr = String(rawValue);

    // Step 1–2: Try binding-first when a variable name is available
    if (figmaVariableName) {
      const bindingResult = this.translateByBinding(figmaVariableName);
      if (bindingResult.confidence === 'exact') {
        return this.enrichResponse(bindingResult);
      }
    }

    // Step 3: Fall back to value-based matching
    const valueResult = this.translateByValue(rawValue, category);

    // Step 4: Enrich if we got a match
    if (valueResult.confidence !== 'no-match') {
      return this.enrichResponse(valueResult);
    }

    // Step 5: No match — return with suggestion from value search (if any)
    return {
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue: rawStr,
      suggestion: valueResult.suggestion,
      delta: valueResult.delta,
    };
  }

  /**
   * Classify an enriched TranslationResult into one of three tiers:
   * - **semantic**: Both semantic and primitive references confirmed
   * - **primitive**: Primitive reference found but no semantic exists
   * - **unidentified**: No token match found within tolerance
   *
   * Must be called on an enriched result (after `enrichResponse()`).
   *
   * @requirements Req 1 (AC 1–4)
   * @spec 054d-hierarchical-design-extraction
   */
  classifyTokenMatch(result: TranslationResult): ClassificationTier {
    // AC 4: No match → unidentified
    if (result.confidence === 'no-match') {
      return 'unidentified';
    }

    // AC 2: Has semantic token reference → semantic
    if (result.semantic) {
      return 'semantic';
    }

    // AC 3: Has primitive but no semantic → primitive
    if (result.primitive) {
      return 'primitive';
    }

    // Fallback: matched token but no primitive/semantic resolved
    // (shouldn't happen after enrichResponse, but defensive)
    return 'unidentified';
  }

  /**
   * Convert an enriched TranslationResult to a ClassifiedToken.
   * Only valid for results classified as 'semantic' or 'primitive'.
   *
   * @param result - Enriched translation result
   * @param property - CSS/Figma property name (e.g. 'padding-top', 'fill')
   * @returns ClassifiedToken with tier-appropriate fields
   *
   * @requirements Req 1 (AC 6)
   * @spec 054d-hierarchical-design-extraction
   */
  toClassifiedToken(result: TranslationResult, property: string): ClassifiedToken {
    return {
      property,
      semanticToken: result.semantic,
      primitiveToken: result.primitive ?? result.token,
      rawValue: result.rawValue,
      matchMethod: result.matchMethod,
      confidence: result.confidence as 'exact' | 'approximate',
      delta: result.delta,
    };
  }

  /**
   * Convert an enriched TranslationResult to an UnidentifiedValue.
   * Only valid for results classified as 'unidentified'.
   *
   * @param result - Translation result with no-match confidence
   * @param property - CSS/Figma property name
   * @param boundVariableId - Optional Figma variable ID if this was a binding
   * @returns UnidentifiedValue with reason and closest match info
   *
   * @requirements Req 1 (AC 6)
   * @spec 054d-hierarchical-design-extraction
   */
  toUnidentifiedValue(
    result: TranslationResult,
    property: string,
    boundVariableId?: string,
  ): UnidentifiedValue {
    const reason: UnidentifiedReason = boundVariableId
      ? 'unresolved-binding'
      : result.delta
        ? 'out-of-tolerance'
        : 'no-token-match';

    return {
      property,
      rawValue: result.rawValue,
      reason,
      closestMatch: result.suggestion
        ? { token: result.suggestion, delta: result.delta ?? '' }
        : undefined,
      boundVariableId,
    };
  }

  /**
   * Create a ClassificationSummary from arrays of classified results.
   *
   * @requirements Req 1 (AC 5)
   * @spec 054d-hierarchical-design-extraction
   */
  static createClassificationSummary(
    semanticIdentified: ClassifiedToken[],
    primitiveIdentified: ClassifiedToken[],
    unidentified: UnidentifiedValue[],
  ): ClassificationSummary {
    return {
      semanticIdentified: semanticIdentified.length,
      primitiveIdentified: primitiveIdentified.length,
      unidentified: unidentified.length,
    };
  }
}

