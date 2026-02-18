/**
 * FigmaTransformer — Converts DTCG tokens to Figma Variables and Styles format.
 *
 * Implements ITokenTransformer to produce DesignTokens.figma.json output
 * containing Figma variable definitions (primitives + semantics collections)
 * and style definitions (effect styles for shadows, text styles for typography).
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 1 (FigmaTransformer Implementation)
 */

import type {
  DTCGToken,
  DTCGGroup,
  DTCGTokenFile,
  DTCGType,
} from '../types/DTCGTypes';
import type {
  ITokenTransformer,
  TransformerConfig,
  TransformResult,
} from './ITokenTransformer';

/**
 * Figma variable type mapping.
 */
export type FigmaVariableType = 'FLOAT' | 'COLOR' | 'STRING' | 'BOOLEAN';

/**
 * A single Figma variable definition.
 */
export interface FigmaVariable {
  name: string;
  type: FigmaVariableType;
  valuesByMode: Record<string, unknown>;
  description?: string;
}

/**
 * A Figma variable collection (e.g., Primitives, Semantics).
 */
export interface FigmaVariableCollection {
  name: string;
  modes: string[];
  variables: FigmaVariable[];
}

/**
 * Effect style properties (shadow tokens).
 */
export interface EffectStyleProperties {
  effects: Array<{
    type: 'DROP_SHADOW' | 'INNER_SHADOW';
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
    color: { r: number; g: number; b: number; a: number };
  }>;
}

/**
 * Text style properties (typography tokens).
 */
export interface TextStyleProperties {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

/**
 * A Figma style definition (effect or text).
 */
export interface FigmaStyleDefinition {
  type: 'EFFECT' | 'TEXT';
  name: string;
  properties: EffectStyleProperties | TextStyleProperties;
  description?: string;
}

/**
 * Complete Figma token file structure (intermediate artifact).
 */
export interface FigmaTokenFile {
  collections: FigmaVariableCollection[];
  styles: FigmaStyleDefinition[];
}

/**
 * Top-level DTCG groups that contain primitive tokens (direct values).
 * These become the Primitives collection in Figma.
 */
const PRIMITIVE_GROUPS = [
  'space',
  'color',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'letterSpacing',
  'radius',
  'borderWidth',
  'tapArea',
  'density',
  'breakpoint',
  'opacity',
  'duration',
  'easing',
  'scale',
  'blend',
] as const;

/**
 * Top-level DTCG groups that contain semantic tokens (alias references).
 * These become the Semantics collection in Figma.
 */
const SEMANTIC_GROUPS = [
  'semanticColor',
  'semanticSpace',
  'semanticBorderWidth',
  'semanticRadius',
  'semanticOpacity',
  'semanticBlend',
  'gridSpacing',
  'icon',
  'accessibility',
  'progressColor',
  'zIndex',
  'elevation',
] as const;

/**
 * Composite token groups handled as Figma styles (Task 1.3), not variables.
 */
const COMPOSITE_GROUPS = ['shadow', 'typography', 'glow', 'motion'] as const;

/**
 * FigmaTransformer converts DTCG tokens to Figma Variables and Styles format.
 *
 * Phase 1 implementation:
 * - Variables use `/` naming for Figma's visual grouping (e.g., `space/100`)
 * - Styles use `.` naming for flat style picker (e.g., `shadow.elevation200`)
 * - Light and dark modes contain identical values (future theme support)
 *
 * @requirements Req 1, Req 2, Req 3, Req 6
 */
export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables and Styles',
    outputExtension: '.figma.json',
    includeExtensions: false,
  };

  /**
   * Transform DTCG tokens to Figma format.
   *
   * Calls transformVariables() and transformStyles(), combines them into
   * a FigmaTokenFile, and returns formatted JSON with any warnings.
   *
   * @requirements Req 1, Req 10
   */
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    const warnings: string[] = [];

    const collections = this.transformVariables(dtcgTokens);
    const styles = this.transformStyles(dtcgTokens);

    // Collect warnings for empty results
    if (collections.length === 0) {
      warnings.push('No variable collections generated — no primitive or semantic token groups found in DTCG input.');
    }
    if (styles.length === 0) {
      warnings.push('No styles generated — no shadow or typography token groups found in DTCG input.');
    }

    // Collect per-collection stats for informational warnings
    for (const collection of collections) {
      if (collection.variables.length === 0) {
        warnings.push(`Collection "${collection.name}" has no variables.`);
      }
    }

    const figmaTokenFile: FigmaTokenFile = {
      collections,
      styles,
    };

    return {
      content: JSON.stringify(figmaTokenFile, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings,
    };
  }

  /**
   * Validate that the transformer can handle the given DTCG input.
   */
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return dtcgTokens != null && typeof dtcgTokens.$schema === 'string';
  }

  // ─── Variable Transformation (Task 1.2) ────────────────────────────

  /**
   * Transform DTCG tokens into Figma variable collections.
   * Produces two collections: Primitives and Semantics.
   *
   * @requirements Req 2, Req 6
   */
  transformVariables(dtcgTokens: DTCGTokenFile): FigmaVariableCollection[] {
    const collections: FigmaVariableCollection[] = [];

    const primitives = this.generatePrimitivesCollection(dtcgTokens);
    if (primitives.variables.length > 0) {
      collections.push(primitives);
    }

    const semantics = this.generateSemanticsCollection(dtcgTokens);
    if (semantics.variables.length > 0) {
      collections.push(semantics);
    }

    return collections;
  }

  /**
   * Generate the Primitives collection from direct-value token groups.
   * Includes space, color, fontSize, fontWeight, fontFamily, etc.
   *
   * @requirements Req 2
   */
  private generatePrimitivesCollection(
    dtcgTokens: DTCGTokenFile,
  ): FigmaVariableCollection {
    const variables: FigmaVariable[] = [];

    for (const groupName of PRIMITIVE_GROUPS) {
      const group = dtcgTokens[groupName] as DTCGGroup | undefined;
      if (!group) continue;

      const groupType = group.$type as DTCGType | undefined;
      this.extractVariablesFromGroup(
        group,
        groupName,
        groupType,
        variables,
        false,
      );
    }

    return {
      name: 'Primitives',
      modes: ['light', 'dark'],
      variables,
    };
  }

  /**
   * Generate the Semantics collection from alias-reference token groups.
   * Includes semanticColor, semanticSpace, gridSpacing, icon, etc.
   *
   * @requirements Req 2
   */
  private generateSemanticsCollection(
    dtcgTokens: DTCGTokenFile,
  ): FigmaVariableCollection {
    const variables: FigmaVariable[] = [];

    for (const groupName of SEMANTIC_GROUPS) {
      const group = dtcgTokens[groupName] as DTCGGroup | undefined;
      if (!group) continue;

      const groupType = group.$type as DTCGType | undefined;
      this.extractVariablesFromGroup(
        group,
        groupName,
        groupType,
        variables,
        true,
      );
    }

    return {
      name: 'Semantics',
      modes: ['light', 'dark'],
      variables,
    };
  }

  /**
   * Recursively extract variables from a DTCG group.
   * Handles nested groups (e.g., semanticSpace.grouped.none).
   */
  private extractVariablesFromGroup(
    group: DTCGGroup,
    parentPath: string,
    inheritedType: DTCGType | undefined,
    variables: FigmaVariable[],
    isSemantic: boolean,
  ): void {
    for (const [key, entry] of Object.entries(group)) {
      // Skip DTCG metadata keys
      if (key.startsWith('$')) continue;

      const value = entry as DTCGToken | DTCGGroup;
      if (!value || typeof value !== 'object') continue;

      // If it has $value, it's a token
      if ('$value' in value && value.$value !== undefined) {
        const token = value as DTCGToken;
        const tokenType = token.$type ?? inheritedType;
        const figmaName = this.toFigmaVariableName(parentPath, key);
        const figmaType = this.dtcgTypeToFigmaType(tokenType);

        const resolvedValue = isSemantic
          ? this.resolveAliasValue(token.$value)
          : this.resolveDirectValue(token.$value, tokenType);

        const description = this.buildVariableDescription(token);

        variables.push({
          name: figmaName,
          type: figmaType,
          valuesByMode: {
            light: resolvedValue,
            dark: resolvedValue,
          },
          ...(description ? { description } : {}),
        });
      } else {
        // It's a nested group — recurse
        const nestedGroup = value as DTCGGroup;
        const nestedType = nestedGroup.$type ?? inheritedType;
        const nestedPath = `${parentPath}/${key}`;
        this.extractVariablesFromGroup(
          nestedGroup,
          nestedPath,
          nestedType as DTCGType | undefined,
          variables,
          isSemantic,
        );
      }
    }
  }

  // ─── Style Transformation (Task 1.3) ────────────────────────────────

  /**
   * Transform DTCG composite tokens into Figma style definitions.
   * Produces effect styles from shadow tokens and text styles from typography tokens.
   *
   * @requirements Req 3
   */
  transformStyles(dtcgTokens: DTCGTokenFile): FigmaStyleDefinition[] {
    const styles: FigmaStyleDefinition[] = [];

    styles.push(...this.generateEffectStyles(dtcgTokens));
    styles.push(...this.generateTextStyles(dtcgTokens));

    return styles;
  }

  /**
   * Generate Figma effect styles from shadow tokens.
   * Each shadow token becomes a DROP_SHADOW effect style.
   *
   * Naming convention: `shadow.{tokenName}` (e.g., `shadow.container`)
   *
   * @requirements Req 3
   */
  private generateEffectStyles(
    dtcgTokens: DTCGTokenFile,
  ): FigmaStyleDefinition[] {
    const shadowGroup = dtcgTokens['shadow'] as DTCGGroup | undefined;
    if (!shadowGroup) return [];

    const styles: FigmaStyleDefinition[] = [];

    for (const [key, entry] of Object.entries(shadowGroup)) {
      if (key.startsWith('$')) continue;

      const token = entry as DTCGToken;
      if (!token || typeof token !== 'object' || !('$value' in token)) continue;

      const shadowValue = token.$value as Record<string, unknown>;
      if (!shadowValue || typeof shadowValue !== 'object') continue;

      const parsedColor = this.parseRgbaColor(shadowValue.color as string);

      const style: FigmaStyleDefinition = {
        type: 'EFFECT',
        name: this.toFigmaStyleName('shadow', key),
        properties: {
          effects: [
            {
              type: 'DROP_SHADOW',
              offset: {
                x: this.parseDimensionValue(
                  String(shadowValue.offsetX ?? '0px'),
                ),
                y: this.parseDimensionValue(
                  String(shadowValue.offsetY ?? '0px'),
                ),
              },
              radius: this.parseDimensionValue(
                String(shadowValue.blur ?? '0px'),
              ),
              spread: this.parseDimensionValue(
                String(shadowValue.spread ?? '0px'),
              ),
              color: parsedColor,
            },
          ],
        } as EffectStyleProperties,
      };

      if (token.$description) {
        style.description = `Source: shadow.${key} — ${token.$description}`;
      }

      styles.push(style);
    }

    return styles;
  }

  /**
   * Generate Figma text styles from typography tokens.
   * Each typography token becomes a text style with font properties.
   *
   * Naming convention: `typography.{tokenName}` (e.g., `typography.bodySm`)
   *
   * Typography token $value properties are alias references (e.g., "{fontFamily.fontFamilyBody}").
   * We resolve them to concrete values by looking up the referenced primitive.
   *
   * @requirements Req 3
   */
  private generateTextStyles(
    dtcgTokens: DTCGTokenFile,
  ): FigmaStyleDefinition[] {
    const typographyGroup = dtcgTokens['typography'] as DTCGGroup | undefined;
    if (!typographyGroup) return [];

    const styles: FigmaStyleDefinition[] = [];

    for (const [key, entry] of Object.entries(typographyGroup)) {
      if (key.startsWith('$')) continue;

      const token = entry as DTCGToken;
      if (!token || typeof token !== 'object' || !('$value' in token)) continue;

      const typoValue = token.$value as Record<string, unknown>;
      if (!typoValue || typeof typoValue !== 'object') continue;

      const style: FigmaStyleDefinition = {
        type: 'TEXT',
        name: this.toFigmaStyleName('typography', key),
        properties: {
          fontFamily: this.resolveTypographyRef(
            typoValue.fontFamily,
            dtcgTokens,
          ),
          fontSize: this.resolveTypographyNumericRef(
            typoValue.fontSize,
            dtcgTokens,
          ),
          fontWeight: this.resolveTypographyNumericRef(
            typoValue.fontWeight,
            dtcgTokens,
          ),
          lineHeight: this.resolveTypographyNumericRef(
            typoValue.lineHeight,
            dtcgTokens,
          ),
          letterSpacing: this.resolveTypographyNumericRef(
            typoValue.letterSpacing,
            dtcgTokens,
          ),
        } as TextStyleProperties,
      };

      if (token.$description) {
        style.description = `Source: typography.${key} — ${token.$description}`;
      }

      styles.push(style);
    }

    return styles;
  }

  // ─── Style Helpers ─────────────────────────────────────────────────

  /**
   * Convert a group name and token key to a Figma style name.
   * Uses `.` separator for flat style picker display.
   *
   * Examples:
   *   ("shadow", "container") → "shadow.container"
   *   ("typography", "bodySm") → "typography.bodySm"
   *
   * @requirements Req 3
   */
  toFigmaStyleName(group: string, tokenKey: string): string {
    return `${group}.${tokenKey}`;
  }

  /**
   * Parse an rgba() color string into Figma's {r, g, b, a} format.
   * Figma uses 0-1 range for r, g, b channels.
   */
  parseRgbaColor(
    colorStr: string | undefined,
  ): { r: number; g: number; b: number; a: number } {
    if (!colorStr) return { r: 0, g: 0, b: 0, a: 1 };

    const match = colorStr.match(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/,
    );
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };

    return {
      r: parseFloat(match[1]) / 255,
      g: parseFloat(match[2]) / 255,
      b: parseFloat(match[3]) / 255,
      a: match[4] !== undefined ? parseFloat(match[4]) : 1,
    };
  }

  /**
   * Resolve a typography property reference to a string value.
   * Handles alias references like "{fontFamily.fontFamilyBody}" by looking up
   * the referenced token's $value in the DTCG file.
   */
  private resolveTypographyRef(
    value: unknown,
    dtcgTokens: DTCGTokenFile,
  ): string {
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      const aliasPath = value.slice(1, -1);
      const resolved = this.lookupDTCGValue(aliasPath, dtcgTokens);
      if (Array.isArray(resolved)) return resolved.join(', ');
      if (typeof resolved === 'string') return resolved;
      return String(resolved ?? value);
    }
    if (Array.isArray(value)) return value.join(', ');
    return String(value ?? '');
  }

  /**
   * Resolve a typography property reference to a numeric value.
   * Handles alias references like "{fontSize.fontSize100}" by looking up
   * the referenced token's $value and parsing it to a number.
   */
  private resolveTypographyNumericRef(
    value: unknown,
    dtcgTokens: DTCGTokenFile,
  ): number {
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      const aliasPath = value.slice(1, -1);
      const resolved = this.lookupDTCGValue(aliasPath, dtcgTokens);
      if (typeof resolved === 'number') return resolved;
      if (typeof resolved === 'string') return parseFloat(resolved) || 0;
      return 0;
    }
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  }

  /**
   * Look up a DTCG token value by dot-separated path.
   * e.g., "fontFamily.fontFamilyBody" → dtcgTokens.fontFamily.fontFamilyBody.$value
   */
  private lookupDTCGValue(
    path: string,
    dtcgTokens: DTCGTokenFile,
  ): unknown {
    const parts = path.split('.');
    let current: unknown = dtcgTokens;

    for (const part of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }

    // If we landed on a token, return its $value
    if (
      current != null &&
      typeof current === 'object' &&
      '$value' in (current as object)
    ) {
      return (current as DTCGToken).$value;
    }

    return current;
  }

  // ─── Naming Conventions ────────────────────────────────────────────

  /**
   * Convert a DTCG token path to Figma variable name.
   * Uses `/` separator for Figma's visual grouping.
   *
   * Examples:
   *   ("space", "space100") → "space/100"
   *   ("color", "purple300") → "color/purple/300"
   *   ("semanticColor", "color.feedback.success.text") → "color/feedback/success/text"
   *   ("semanticSpace", "grouped") with nested "none" → "semanticSpace/grouped/none"
   *
   * @requirements Req 2
   */
  toFigmaVariableName(groupPath: string, tokenKey: string): string {
    // Semantic tokens often use dot-separated keys (e.g., "color.feedback.success.text")
    // Convert dots to slashes for Figma grouping
    if (tokenKey.includes('.')) {
      return tokenKey.replace(/\./g, '/');
    }

    // For primitive tokens, strip the group prefix from the token key
    // e.g., ("space", "space100") → "space/100"
    // e.g., ("color", "gray100") → "color/gray/100"
    const baseName = groupPath.split('/')[0];
    const stripped = this.stripGroupPrefix(baseName, tokenKey);
    const parts = this.splitNameAndNumber(stripped);

    // For nested groups (groupPath contains slashes, e.g., "semanticSpace/grouped"),
    // use the full groupPath to preserve hierarchy:
    // ("semanticSpace/grouped", "none") → "semanticSpace/grouped/none"
    const isNested = groupPath.includes('/');

    if (parts) {
      // Has a name + number suffix: "purple300" → "purple/300"
      if (isNested) {
        return `${groupPath}/${parts.name}/${parts.number}`;
      }
      return `${baseName}/${parts.name}/${parts.number}`;
    }

    // Simple name: "space100" → "space/100" or nested "semanticSpace/grouped/none"
    if (isNested) {
      return `${groupPath}/${stripped}`;
    }
    return `${baseName}/${stripped}`;
  }

  /**
   * Strip the group name prefix from a token key.
   * e.g., ("space", "space100") → "100"
   * e.g., ("color", "gray100") → "gray100"
   * e.g., ("fontSize", "fontSize100") → "100"
   */
  private stripGroupPrefix(groupName: string, tokenKey: string): string {
    // Handle camelCase group names like "fontSize" → strip "fontSize" prefix
    if (
      tokenKey.toLowerCase().startsWith(groupName.toLowerCase()) &&
      tokenKey.length > groupName.length
    ) {
      const remainder = tokenKey.slice(groupName.length);
      // Only strip if the remainder starts with a digit or uppercase
      if (/^[0-9A-Z]/.test(remainder)) {
        return remainder;
      }
    }
    return tokenKey;
  }

  /**
   * Split a token name into name + trailing number.
   * e.g., "gray100" → { name: "gray", number: "100" }
   * e.g., "100" → null (pure number, no name part)
   * e.g., "Max" → null (no number)
   */
  private splitNameAndNumber(
    value: string,
  ): { name: string; number: string } | null {
    const match = value.match(/^([a-zA-Z]+)(\d+)$/);
    if (match) {
      return { name: match[1], number: match[2] };
    }
    return null;
  }

  // ─── Type Mapping ──────────────────────────────────────────────────

  /**
   * Map DTCG token type to Figma variable type.
   */
  dtcgTypeToFigmaType(dtcgType: DTCGType | undefined): FigmaVariableType {
    switch (dtcgType) {
      case 'color':
        return 'COLOR';
      case 'fontFamily':
        return 'STRING';
      case 'number':
      case 'dimension':
      case 'fontWeight':
      case 'duration':
        return 'FLOAT';
      case 'cubicBezier':
        return 'STRING';
      default:
        return 'FLOAT';
    }
  }

  // ─── Value Resolution ──────────────────────────────────────────────

  /**
   * Resolve a direct (primitive) token value to a Figma-compatible value.
   * Strips units from dimensions, passes numbers through, stringifies arrays.
   */
  resolveDirectValue(
    value: unknown,
    tokenType: DTCGType | undefined,
  ): unknown {
    if (value === null || value === undefined) return 0;

    // Dimension values: strip unit suffix → number
    if (typeof value === 'string' && tokenType === 'dimension') {
      return this.parseDimensionValue(value);
    }

    // Duration values: strip "ms" → number
    if (typeof value === 'string' && tokenType === 'duration') {
      return parseFloat(value) || 0;
    }

    // Color values: pass through as string (Figma accepts rgba strings)
    if (typeof value === 'string' && tokenType === 'color') {
      return value;
    }

    // CubicBezier: stringify array
    if (Array.isArray(value) && tokenType === 'cubicBezier') {
      return `cubic-bezier(${value.join(', ')})`;
    }

    // FontFamily: join array with commas
    if (Array.isArray(value) && tokenType === 'fontFamily') {
      return value.join(', ');
    }

    // Numbers pass through
    if (typeof value === 'number') return value;

    // Fallback: return as-is
    return value;
  }

  /**
   * Resolve an alias reference value for semantic tokens.
   * Preserves the alias format for Figma variable references.
   *
   * DTCG alias format: "{group.tokenName}" → Figma alias: "group/tokenName"
   */
  resolveAliasValue(value: unknown): unknown {
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      // Extract alias path: "{color.purple300}" → "color/purple300"
      const aliasPath = value.slice(1, -1);
      // Convert dots to slashes for Figma reference format
      // Then apply the same naming logic to get proper grouping
      const parts = aliasPath.split('.');
      if (parts.length === 2) {
        const [group, token] = parts;
        // Reconstruct using Figma naming: strip prefix, split name/number
        const stripped = this.stripGroupPrefix(group, token);
        const nameNum = this.splitNameAndNumber(stripped);
        if (nameNum) {
          return { aliasOf: `${group}/${nameNum.name}/${nameNum.number}` };
        }
        return { aliasOf: `${group}/${stripped}` };
      }
      // Multi-level alias: just convert dots to slashes
      return { aliasOf: aliasPath.replace(/\./g, '/') };
    }

    // Non-alias values in semantic groups (rare but possible)
    return value;
  }

  /**
   * Parse a dimension value string to a number.
   * Handles px, em, %, and unitless values.
   */
  private parseDimensionValue(value: string): number {
    if (value.endsWith('px')) {
      return parseFloat(value) || 0;
    }
    if (value.endsWith('em')) {
      return parseFloat(value) || 0;
    }
    if (value.endsWith('%')) {
      return parseFloat(value) || 0;
    }
    return parseFloat(value) || 0;
  }

  // ─── Description Building ──────────────────────────────────────────

  /**
   * Build a variable description from DTCG token metadata.
   * Includes mathematical relationship and platform values when available.
   *
   * @requirements Req 2
   */
  buildVariableDescription(token: DTCGToken): string | undefined {
    const parts: string[] = [];

    // Add token description
    if (token.$description) {
      parts.push(token.$description);
    }

    const ext = token.$extensions?.designerpunk;
    if (ext) {
      // Add mathematical formula
      if (ext.formula) {
        parts.push(`Formula: ${ext.formula}`);
      }

      // Add platform support info
      if (ext.platforms) {
        const platformParts: string[] = [];
        for (const [platform, info] of Object.entries(ext.platforms)) {
          if (info && typeof info === 'object') {
            const supported = (info as { supported: boolean }).supported;
            const note = (info as { note?: string }).note;
            if (!supported && note) {
              platformParts.push(`${platform}: ${note}`);
            }
          }
        }
        if (platformParts.length > 0) {
          parts.push(`Platform notes: ${platformParts.join('; ')}`);
        }
      }
    }

    return parts.length > 0 ? parts.join(' | ') : undefined;
  }
}
