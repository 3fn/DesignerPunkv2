/**
 * DTCG Token Format Generator
 *
 * Transforms DesignerPunk Rosetta System tokens into DTCG (Design Tokens Community Group)
 * Format Module 2025.10 compliant JSON output. Enables integration with industry-standard
 * design tools (Figma, Style Dictionary, Tokens Studio, Terrazzo) while preserving
 * DesignerPunk's mathematical foundations and governance rules through extensions.
 *
 * Key Principle: DTCG output is a parallel export for external tools.
 * DesignerPunk components continue importing tokens from TypeScript sources.
 * Code (Rosetta) remains the source of truth.
 *
 * @see https://tr.designtokens.org/format/
 * @requirements 7.1, 10.1-10.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { DTCGGeneratorConfig, DEFAULT_DTCG_GENERATOR_CONFIG } from './DTCGGeneratorConfig';
import type { DTCGTokenFile, DTCGGroup, DTCGToken, DTCGType, DesignerPunkExtensions } from './types/DTCGTypes';
import { getAllPrimitiveTokens } from '../tokens/index';
import { getAllSemanticTokens } from '../tokens/semantic/index';
import type { PrimitiveToken, ColorTokenValue } from '../types/PrimitiveToken';

// Primitive token imports
import { spacingTokens, SPACING_BASE_VALUE } from '../tokens/SpacingTokens';
import { colorTokens } from '../tokens/ColorTokens';
import { fontSizeTokens, FONT_SIZE_BASE_VALUE } from '../tokens/FontSizeTokens';
import { fontWeightTokens, FONT_WEIGHT_BASE_VALUE } from '../tokens/FontWeightTokens';
import { fontFamilyTokens } from '../tokens/FontFamilyTokens';
import { lineHeightTokens, LINE_HEIGHT_BASE_VALUE } from '../tokens/LineHeightTokens';
import { letterSpacingTokens, LETTER_SPACING_BASE_VALUE } from '../tokens/LetterSpacingTokens';
import { radiusTokens, RADIUS_BASE_VALUE } from '../tokens/RadiusTokens';
import { borderWidthTokens, BORDER_WIDTH_BASE_VALUE } from '../tokens/BorderWidthTokens';
import { tapAreaTokens, TAP_AREA_BASE_VALUE } from '../tokens/TapAreaTokens';
import { densityTokens, DENSITY_BASE_VALUE } from '../tokens/DensityTokens';
import { breakpointTokens, BREAKPOINT_BASE_VALUE } from '../tokens/BreakpointTokens';
import { opacityTokens, OPACITY_BASE_VALUE } from '../tokens/OpacityTokens';
import { durationTokens, DURATION_BASE_VALUE } from '../tokens/DurationTokens';
import { easingTokens } from '../tokens/EasingTokens';
import { scaleTokens, SCALE_BASE_VALUE } from '../tokens/ScaleTokens';
import { blendTokens, BLEND_BASE_VALUE } from '../tokens/BlendTokens';

// Shadow primitive token imports
import { shadowBlur, SHADOW_BLUR_BASE_VALUE } from '../tokens/ShadowBlurTokens';
import { shadowOffsetX, shadowOffsetY, SHADOW_OFFSET_BASE_VALUE } from '../tokens/ShadowOffsetTokens';
import { shadowOpacityTokens, SHADOW_OPACITY_BASE_VALUE } from '../tokens/ShadowOpacityTokens';

// Glow primitive token imports
import { glowBlur, GLOW_BLUR_BASE_VALUE } from '../tokens/GlowBlurTokens';
import { glowOpacity, GLOW_OPACITY_BASE_VALUE } from '../tokens/GlowOpacityTokens';

// Semantic token imports
import { colorTokens as semanticColorTokens } from '../tokens/semantic/ColorTokens';
import { spacingTokens as semanticSpacingTokens } from '../tokens/semantic/SpacingTokens';
import { SemanticBorderWidthTokens } from '../tokens/semantic/BorderWidthTokens';
import { SemanticRadiusTokens } from '../tokens/semantic/RadiusTokens';
import { opacityTokens as semanticOpacityTokens } from '../tokens/semantic/OpacityTokens';
import { blendTokens as semanticBlendTokens } from '../tokens/semantic/BlendTokens';
import { zIndexTokens } from '../tokens/semantic/ZIndexTokens';
import { elevationTokens } from '../tokens/semantic/ElevationTokens';
import { gridSpacingTokens } from '../tokens/semantic/GridSpacingTokens';
import { iconTokens } from '../tokens/semantic/IconTokens';
import { accessibilityTokens } from '../tokens/semantic/AccessibilityTokens';
import { motionTokens as semanticMotionTokens } from '../tokens/semantic/MotionTokens';
import { typographyTokens } from '../tokens/semantic/TypographyTokens';
import { progressColorTokens } from '../tokens/semantic/color-progress';
import { shadowTokens as semanticShadowTokens } from '../tokens/semantic/ShadowTokens';

/** Set of valid DTCG types for validation (Format Module 2025.10) */
const VALID_DTCG_TYPES: ReadonlySet<string> = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'shadow', 'typography', 'transition',
]);

/** Minimum expected primitive token count (programmatic validation threshold) */
const MIN_PRIMITIVE_TOKEN_COUNT = 200;

/** Minimum expected semantic token count (programmatic validation threshold) */
const MIN_SEMANTIC_TOKEN_COUNT = 180;

/**
 * DTCGFormatGenerator — Main generator class that orchestrates token transformation
 * from Rosetta System tokens to DTCG Format Module 2025.10 compliant JSON.
 *
 * Usage:
 * ```typescript
 * const generator = new DTCGFormatGenerator();
 * const output = generator.generate();
 * generator.writeToFile('dist/DesignTokens.dtcg.json');
 * ```
 */
export class DTCGFormatGenerator {
  private readonly config: DTCGGeneratorConfig;

  constructor(config: Partial<DTCGGeneratorConfig> = {}) {
    this.config = { ...DEFAULT_DTCG_GENERATOR_CONFIG, ...config };
  }

  /**
   * Generate DTCG-compliant JSON from Rosetta tokens.
   *
   * Orchestrates all token generation methods, adds root-level metadata,
   * and validates token counts before returning the complete DTCG output.
   *
   * @returns Complete DTCGTokenFile ready for serialization
   * @throws Error if token count validation fails
   */
  generate(): DTCGTokenFile {
    const output: DTCGTokenFile = {
      $schema: this.config.schemaUrl,
    };

    // Add root-level DesignerPunk extensions (version, generatedAt, rosettaVersion)
    if (this.config.includeExtensions) {
      output.$extensions = {
        designerpunk: this.generateRootExtensions(),
      };
    }

    // --- Primitive token groups ---
    // Each method will be implemented in Task 2.2
    output.space = this.generateSpacingTokens();
    output.color = this.generateColorTokens();
    output.fontSize = this.generateFontSizeTokens();
    output.fontWeight = this.generateFontWeightTokens();
    output.fontFamily = this.generateFontFamilyTokens();
    output.lineHeight = this.generateLineHeightTokens();
    output.letterSpacing = this.generateLetterSpacingTokens();
    output.radius = this.generateRadiusTokens();
    output.borderWidth = this.generateBorderWidthTokens();
    output.tapArea = this.generateTapAreaTokens();
    output.density = this.generateDensityTokens();
    output.breakpoint = this.generateBreakpointTokens();
    output.opacity = this.generateOpacityTokens();
    output.duration = this.generateDurationTokens();
    output.easing = this.generateEasingTokens();
    output.scale = this.generateScaleTokens();
    output.blend = this.generateBlendTokens();

    // --- Semantic token groups ---
    output.semanticColor = this.generateSemanticColorTokens();
    output.semanticSpace = this.generateSemanticSpacingTokens();
    output.semanticBorderWidth = this.generateSemanticBorderWidthTokens();
    output.semanticRadius = this.generateSemanticRadiusTokens();
    output.semanticOpacity = this.generateSemanticOpacityTokens();
    output.semanticBlend = this.generateSemanticBlendTokens();
    output.gridSpacing = this.generateGridSpacingTokens();
    output.icon = this.generateIconTokens();
    output.accessibility = this.generateAccessibilityTokens();
    output.progressColor = this.generateProgressColorTokens();
    output.zIndex = this.generateZIndexTokens();
    output.elevation = this.generateElevationTokens();

    // --- Shadow & glow token groups (Tasks 2.4, 2.5) ---
    output.shadow = this.generateShadowTokens();
    output.glow = this.generateGlowTokens();

    // --- Composite token groups (Task 2.6) ---
    output.typography = this.generateTypographyTokens();
    output.motion = this.generateMotionTokens();

    // Validate token counts against expected minimums
    this.validateTokenCounts(output);

    // Post-processing: strip deprecated tokens if configured
    if (!this.config.includeDeprecated) {
      this.stripDeprecatedTokens(output);
    }

    return output;
  }

  /**
   * Write generated DTCG output to a JSON file.
   *
   * Creates the output directory if it doesn't exist. Overwrites existing files
   * without prompting (generation is idempotent).
   *
   * @param outputPath - File path for the output (e.g., 'dist/DesignTokens.dtcg.json')
   * @throws Error if file write fails (permissions, disk full, etc.)
   */
  writeToFile(outputPath: string): void {
    const output = this.generate();
    const indent = this.config.prettyPrint ? 2 : undefined;
    const json = JSON.stringify(output, null, indent);

    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, json, 'utf-8');

      // Log generation summary
      const primitiveCount = getAllPrimitiveTokens().length;
      const semanticCount = getAllSemanticTokens().length;
      console.log(
        `✅ DTCG output written to ${outputPath} — Generated ${primitiveCount} primitive tokens, ${semanticCount} semantic tokens`
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write DTCG output to ${outputPath}: ${message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Generate root-level DesignerPunk extension metadata.
   *
   * Includes generator version, generation timestamp, and Rosetta system version
   * for traceability and debugging.
   */
  private generateRootExtensions(): { version: string; generatedAt: string; rosettaVersion: string } {
    // Read version from package.json at runtime
    let rosettaVersion = 'unknown';
    try {
      const pkgPath = path.resolve(__dirname, '../../package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      rosettaVersion = pkg.version || 'unknown';
    } catch {
      // Fallback — package.json not found or unreadable
    }

    return {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      rosettaVersion,
    };
  }

  /**
   * Validate that generated token counts meet expected minimums.
   *
   * Uses programmatic counting via getAllPrimitiveTokens() and getAllSemanticTokens()
   * rather than hard-coded values, so validation stays current as the token system grows.
   *
   * @param _output - The generated DTCGTokenFile (reserved for future per-group validation)
   * @throws Error if primitive or semantic token counts fall below minimum thresholds
   */
  private validateTokenCounts(_output: DTCGTokenFile): void {
    const primitiveCount = getAllPrimitiveTokens().length;
    const semanticCount = getAllSemanticTokens().length;

    if (primitiveCount < MIN_PRIMITIVE_TOKEN_COUNT) {
      throw new Error(
        `Token count validation failed. Expected at least ${MIN_PRIMITIVE_TOKEN_COUNT} primitive tokens, got ${primitiveCount}. ` +
        `This may indicate a missing token category in the generator.`
      );
    }

    if (semanticCount < MIN_SEMANTIC_TOKEN_COUNT) {
      throw new Error(
        `Token count validation failed. Expected at least ${MIN_SEMANTIC_TOKEN_COUNT} semantic tokens, got ${semanticCount}. ` +
        `This may indicate a missing semantic token category in the generator.`
      );
    }
  }

  /**
   * Remove deprecated tokens from the output when includeDeprecated is false.
   *
   * Recursively walks the DTCG output tree and removes any token that has
   * `$extensions.designerpunk.deprecated: true`. This preserves the group structure
   * while filtering out individual deprecated tokens.
   *
   * @param obj - The DTCG output object to filter (mutated in place)
   */
  private stripDeprecatedTokens(obj: Record<string, unknown>): void {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) continue; // Skip DTCG meta-properties
      const value = obj[key];
      if (value && typeof value === 'object') {
        const token = value as Record<string, unknown>;
        // Check if this is a token with deprecated extension
        const extensions = token.$extensions as { designerpunk?: DesignerPunkExtensions } | undefined;
        if (extensions?.designerpunk?.deprecated) {
          delete obj[key];
        } else {
          // Recurse into groups
          this.stripDeprecatedTokens(token);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Token generation stubs — implemented in Tasks 2.2–2.6
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Primitive token generation (Task 2.2)
  // ---------------------------------------------------------------------------

  /**
   * Generate spacing primitive tokens as DTCG dimension type.
   * Maps spacing baseValue to `{value}px` dimension format.
   */
  private generateSpacingTokens(): DTCGGroup {
    return this.generateDimensionGroup(spacingTokens, 'spacing', SPACING_BASE_VALUE);
  }

  /**
   * Generate color primitive tokens as DTCG color type.
   * Resolves mode-aware RGBA values using light.base as default.
   */
  private generateColorTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'color' };
    for (const [key, token] of Object.entries(colorTokens)) {
      const colorValue = this.resolveColorValue(token, key);
      const extensions = this.buildPrimitiveExtensions(token, 'color');
      group[key] = this.toDTCGToken(colorValue, 'color', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate font size primitive tokens as DTCG dimension type.
   * Uses baseValue (unitless) converted to `{value}px`.
   */
  private generateFontSizeTokens(): DTCGGroup {
    return this.generateDimensionGroup(fontSizeTokens, 'fontSize', FONT_SIZE_BASE_VALUE);
  }

  /**
   * Generate font weight primitive tokens as DTCG fontWeight type.
   * Font weights are numeric values (100–900).
   */
  private generateFontWeightTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'fontWeight' };
    for (const [key, token] of Object.entries(fontWeightTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'fontWeight', FONT_WEIGHT_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'fontWeight', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate font family primitive tokens as DTCG fontFamily type.
   * DTCG fontFamily expects an array of font names.
   */
  private generateFontFamilyTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'fontFamily' };
    for (const [key, token] of Object.entries(fontFamilyTokens)) {
      const fontStack = String(token.platforms.web.value);
      const families = fontStack.split(',').map(f => f.trim().replace(/^["']|["']$/g, ''));
      const extensions = this.buildPrimitiveExtensions(token, 'fontFamily');
      group[key] = this.toDTCGToken(families, 'fontFamily', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate line height primitive tokens as DTCG number type.
   * Line heights are unitless multipliers.
   */
  private generateLineHeightTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(lineHeightTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'lineHeight', LINE_HEIGHT_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate letter spacing primitive tokens as DTCG dimension type.
   * Letter spacing uses em units.
   */
  private generateLetterSpacingTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(letterSpacingTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'letterSpacing', LETTER_SPACING_BASE_VALUE);
      group[key] = this.toDTCGToken(`${token.baseValue}em`, 'dimension', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate radius primitive tokens as DTCG dimension type.
   * Handles special cases: radiusMax (9999px), radiusHalf (50%).
   */
  private generateRadiusTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(radiusTokens)) {
      let value: string;
      if (token.name === 'radiusHalf') {
        value = '50%';
      } else {
        value = `${token.baseValue}px`;
      }
      const extensions = this.buildPrimitiveExtensions(token, 'radius', RADIUS_BASE_VALUE);
      group[key] = this.toDTCGToken(value, 'dimension', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate border width primitive tokens as DTCG dimension type.
   */
  private generateBorderWidthTokens(): DTCGGroup {
    return this.generateDimensionGroup(borderWidthTokens, 'borderWidth', BORDER_WIDTH_BASE_VALUE);
  }

  /**
   * Generate tap area primitive tokens as DTCG dimension type.
   */
  private generateTapAreaTokens(): DTCGGroup {
    return this.generateDimensionGroup(tapAreaTokens, 'tapArea', TAP_AREA_BASE_VALUE);
  }

  /**
   * Generate density primitive tokens as DTCG number type.
   * Density values are unitless multipliers.
   */
  private generateDensityTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(densityTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'density', DENSITY_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate breakpoint primitive tokens as DTCG dimension type.
   */
  private generateBreakpointTokens(): DTCGGroup {
    return this.generateDimensionGroup(breakpointTokens, 'breakpoint', BREAKPOINT_BASE_VALUE);
  }

  /**
   * Generate opacity primitive tokens as DTCG number type.
   * Opacity values are unitless (0–1).
   */
  private generateOpacityTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(opacityTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'opacity', OPACITY_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate duration primitive tokens as DTCG duration type.
   * DTCG duration format: `{value}ms`.
   */
  private generateDurationTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'duration' };
    for (const [key, token] of Object.entries(durationTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'duration', DURATION_BASE_VALUE);
      group[key] = this.toDTCGToken(`${token.baseValue}ms`, 'duration', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate easing primitive tokens as DTCG cubicBezier type.
   * Parses cubic-bezier CSS string into [p1, p2, p3, p4] array.
   */
  private generateEasingTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'cubicBezier' };
    for (const [key, token] of Object.entries(easingTokens)) {
      const bezierStr = String(token.platforms.web.value);
      const match = bezierStr.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
      if (!match) {
        throw new Error(`Invalid easing value for ${token.name}: ${bezierStr}. Expected cubic-bezier(p1, p2, p3, p4) format.`);
      }
      const bezierArray = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
      const extensions = this.buildPrimitiveExtensions(token, 'easing');
      group[key] = this.toDTCGToken(bezierArray, 'cubicBezier', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate scale primitive tokens as DTCG number type.
   * Scale values are unitless multipliers.
   */
  private generateScaleTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(scaleTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'scale', SCALE_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate blend primitive tokens as DTCG number type with blendType extension.
   * Blend values are unitless (0–1) with blendType metadata.
   */
  private generateBlendTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(blendTokens)) {
      const extensions = this.buildPrimitiveExtensions(token, 'blend', BLEND_BASE_VALUE);
      group[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
    }
    return group;
  }

  // ---------------------------------------------------------------------------
  // Semantic token generation (Task 2.3)
  // ---------------------------------------------------------------------------

  /**
   * Generate semantic color tokens with alias references to primitive colors.
   * Uses `{color.primitiveRef}` syntax to preserve primitive→semantic hierarchy.
   */
  private generateSemanticColorTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'color' };
    for (const [key, token] of Object.entries(semanticColorTokens)) {
      const refs = token.primitiveReferences;
      // Determine alias value — use {color.primitiveRef} syntax
      const primaryRef = refs.value || refs.color;
      if (!primaryRef) continue;

      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveColorAlias(primaryRef)
        : `{color.${primaryRef}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'color',
      };
      // If token has separate color + opacity composition, note it
      if (refs.color && refs.opacity) {
        extensions.primitiveRefs = { color: refs.color, opacity: refs.opacity };
      }

      group[key] = this.toDTCGToken(aliasValue, 'color', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate semantic spacing tokens with alias references to primitive spacing.
   * Preserves hierarchical structure: grouped/related/separated/sectioned + inset.
   */
  private generateSemanticSpacingTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [category, levels] of Object.entries(semanticSpacingTokens)) {
      const subGroup: DTCGGroup = { $type: 'dimension' };
      for (const [level, token] of Object.entries(levels as Record<string, { value: string }>)) {
        const aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveDimensionAlias(token.value, spacingTokens)
          : `{space.${token.value}}`;

        const extensions: DesignerPunkExtensions = {
          family: 'spacing',
          primitiveRefs: { value: token.value },
        };

        subGroup[level] = this.toDTCGToken(aliasValue, 'dimension', `Semantic spacing: ${category}.${level}`, extensions);
      }
      group[category] = subGroup;
    }
    return group;
  }

  /**
   * Generate semantic border width tokens with alias references to primitive border widths.
   */
  private generateSemanticBorderWidthTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(SemanticBorderWidthTokens)) {
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveDimensionAlias(token.value, borderWidthTokens)
        : `{borderWidth.${token.value}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'borderWidth',
        primitiveRefs: { value: token.value },
      };

      group[key] = this.toDTCGToken(aliasValue, 'dimension', `Semantic border width: ${key}`, extensions);
    }
    return group;
  }

  /**
   * Generate semantic radius tokens with alias references to primitive radius.
   */
  private generateSemanticRadiusTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(SemanticRadiusTokens)) {
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveDimensionAlias(token.value, radiusTokens)
        : `{radius.${token.value}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'radius',
        primitiveRefs: { value: token.value },
      };

      group[key] = this.toDTCGToken(aliasValue, 'dimension', `Semantic radius: ${key}`, extensions);
    }
    return group;
  }

  /**
   * Generate semantic opacity tokens with alias references to primitive opacity.
   */
  private generateSemanticOpacityTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(semanticOpacityTokens)) {
      const ref = token.primitiveReferences.value;
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveNumberAlias(ref, opacityTokens)
        : `{opacity.${ref}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'opacity',
        primitiveRefs: { value: ref },
      };

      group[key] = this.toDTCGToken(aliasValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate semantic blend tokens with alias references to primitive blend values.
   * Includes blendType extension for blend direction.
   */
  private generateSemanticBlendTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(semanticBlendTokens)) {
      const ref = token.primitiveReferences.value;
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveNumberAlias(ref, blendTokens)
        : `{blend.${ref}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'blend',
        primitiveRefs: { value: ref },
      };
      // Map BlendDirection to DesignerPunk blendType extension
      if (token.direction === 'darker') {
        extensions.blendType = 'darkerBlend';
      } else if (token.direction === 'lighter') {
        extensions.blendType = 'lighterBlend';
      }

      group[key] = this.toDTCGToken(aliasValue, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate z-index tokens as DTCG number type.
   * Z-index tokens are semantic-only (no primitive layer).
   */
  private generateZIndexTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(zIndexTokens)) {
      const extensions: DesignerPunkExtensions = {
        family: 'zIndex',
        platforms: {
          web: { supported: true },
          ios: { supported: true },
          android: { supported: false, note: 'Use elevation tokens instead' },
        },
      };

      group[key] = this.toDTCGToken(token.value, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate elevation tokens as DTCG number type with platform extensions.
   * Elevation tokens are Android-only semantic tokens.
   */
  private generateElevationTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'number' };
    for (const [key, token] of Object.entries(elevationTokens)) {
      const extensions: DesignerPunkExtensions = {
        family: 'elevation',
        platforms: {
          web: { supported: false, note: 'Use z-index + shadow tokens instead' },
          ios: { supported: false, note: 'Use z-index + shadow tokens instead' },
          android: { supported: true, elevation: token.value },
        },
      };

      group[key] = this.toDTCGToken(token.value, 'number', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate grid spacing tokens with alias references to primitive spacing.
   */
  private generateGridSpacingTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(gridSpacingTokens)) {
      const ref = token.primitiveReferences.spacing;
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveDimensionAlias(ref, spacingTokens)
        : `{space.${ref}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'gridSpacing',
        primitiveRefs: { spacing: ref },
      };

      group[key] = this.toDTCGToken(aliasValue, 'dimension', token.description, extensions);
    }
    return group;
  }

  /**
   * Generate icon tokens as DTCG dimension type.
   * Icon sizes are calculated from fontSize × multiplier.
   */
  private generateIconTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(iconTokens)) {
      const refs = token.primitiveReferences;

      // icon.strokeWidth references a borderWidth primitive
      if (refs.value) {
        const aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveDimensionAlias(refs.value, borderWidthTokens)
          : `{borderWidth.${refs.value}}`;

        const extensions: DesignerPunkExtensions = {
          family: 'icon',
          primitiveRefs: { value: refs.value },
        };

        group[key] = this.toDTCGToken(aliasValue, 'dimension', token.description, extensions);
      } else if (refs.fontSize && refs.multiplier) {
        // Icon size tokens — calculated value, include formula in extensions
        const extensions: DesignerPunkExtensions = {
          family: 'icon',
          primitiveRefs: { fontSize: refs.fontSize, multiplier: refs.multiplier },
        };

        // For icon sizes, use the alias to fontSize as the value
        const aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveDimensionAlias(refs.fontSize, fontSizeTokens)
          : `{fontSize.${refs.fontSize}}`;

        group[key] = this.toDTCGToken(aliasValue, 'dimension', token.description, extensions);
      }
    }
    return group;
  }

  /**
   * Generate accessibility tokens with alias references to their primitive sources.
   */
  private generateAccessibilityTokens(): DTCGGroup {
    const group: DTCGGroup = {};
    for (const [key, token] of Object.entries(accessibilityTokens)) {
      const ref = token.primitiveReferences.value;

      // Determine DTCG type based on what the token references
      let dtcgType: DTCGType;
      let aliasValue: string;
      if (key.includes('color')) {
        dtcgType = 'color';
        aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveColorAlias(ref)
          : `{color.${ref}}`;
      } else if (key.includes('width')) {
        dtcgType = 'dimension';
        aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveDimensionAlias(ref, borderWidthTokens)
          : `{borderWidth.${ref}}`;
      } else {
        // offset references a spacing primitive
        dtcgType = 'dimension';
        aliasValue = this.config.resolveAliases
          ? this.resolvePrimitiveDimensionAlias(ref, spacingTokens)
          : `{space.${ref}}`;
      }

      const extensions: DesignerPunkExtensions = {
        family: 'accessibility',
        primitiveRefs: { value: ref },
      };

      group[key] = this.toDTCGToken(aliasValue, dtcgType, token.description, extensions);
    }
    return group;
  }

  /**
   * Generate progress color tokens with alias references to primitive colors.
   */
  private generateProgressColorTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'color' };
    for (const [key, token] of Object.entries(progressColorTokens)) {
      const ref = token.primitiveReferences.value;
      const aliasValue = this.config.resolveAliases
        ? this.resolvePrimitiveColorAlias(ref)
        : `{color.${ref}}`;

      const extensions: DesignerPunkExtensions = {
        family: 'color',
        primitiveRefs: { value: ref },
      };

      group[key] = this.toDTCGToken(aliasValue, 'color', token.description, extensions);
    }
    return group;
  }

  /**
   * Resolve a primitive color alias to its actual value.
   * Used when resolveAliases is true.
   */
  private resolvePrimitiveColorAlias(primitiveName: string): string {
    const primitiveToken = (colorTokens as Record<string, PrimitiveToken>)[primitiveName];
    if (primitiveToken) {
      return this.resolveColorValue(primitiveToken, primitiveName);
    }
    // Fallback: return alias syntax if primitive not found
    return `{color.${primitiveName}}`;
  }

  /**
   * Resolve a primitive dimension alias to its actual `{value}px` value.
   * Used when resolveAliases is true.
   */
  private resolvePrimitiveDimensionAlias(primitiveName: string, registry: Record<string, PrimitiveToken>): string {
    const primitiveToken = registry[primitiveName];
    if (primitiveToken) {
      return `${primitiveToken.baseValue}px`;
    }
    // Fallback: return alias syntax if primitive not found
    return `{${primitiveName}}`;
  }

  /**
   * Resolve a primitive number alias to its actual numeric value.
   * Used when resolveAliases is true for unitless tokens (opacity, blend, etc.).
   */
  private resolvePrimitiveNumberAlias(primitiveName: string, registry: Record<string, PrimitiveToken>): number {
    const primitiveToken = registry[primitiveName];
    if (primitiveToken) {
      return primitiveToken.baseValue;
    }
    return 0;
  }

  // Shadow token generation (Task 2.4)

  /**
   * Generate shadow composition tokens as DTCG shadow type.
   *
   * Each semantic shadow token references primitives for offsetX, offsetY, blur,
   * opacity, and color. The generator resolves these primitives, merges color+opacity
   * into a single RGBA value (shadow opacity replaces color alpha per Design Decision 3),
   * and outputs a DTCG shadow composite value.
   *
   * @requirements 5.1-5.5
   */
  private generateShadowTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'shadow' };

    for (const [key, token] of Object.entries(semanticShadowTokens)) {
      const refs = token.primitiveReferences;

      // Resolve primitive values
      const offsetXToken = this.resolveShadowPrimitive(refs.offsetX, shadowOffsetX);
      const offsetYToken = this.resolveShadowPrimitive(refs.offsetY, shadowOffsetY);
      const blurToken = this.resolveShadowPrimitive(refs.blur, shadowBlur);
      const opacityToken = this.resolveShadowPrimitive(refs.opacity, shadowOpacityTokens);
      const colorToken = (colorTokens as Record<string, PrimitiveToken>)[refs.color];

      if (!offsetXToken || !offsetYToken || !blurToken || !opacityToken || !colorToken) {
        throw new Error(
          `Shadow token "${key}" has unresolvable primitive references. ` +
          `Missing: ${[
            !offsetXToken && `offsetX(${refs.offsetX})`,
            !offsetYToken && `offsetY(${refs.offsetY})`,
            !blurToken && `blur(${refs.blur})`,
            !opacityToken && `opacity(${refs.opacity})`,
            !colorToken && `color(${refs.color})`,
          ].filter(Boolean).join(', ')}`
        );
      }

      // Resolve color RGBA and merge with shadow opacity (replace alpha, don't multiply)
      const colorRgba = this.resolveColorValue(colorToken, `shadow.${key}.color`);
      const opacityValue = opacityToken.baseValue;
      const mergedColor = this.mergeShadowColor(colorRgba, opacityValue, key);

      // Build DTCG shadow composite value
      const shadowValue = {
        offsetX: `${offsetXToken.baseValue}px`,
        offsetY: `${offsetYToken.baseValue}px`,
        blur: `${blurToken.baseValue}px`,
        spread: '0px',
        color: mergedColor,
      };

      // Build extensions
      const extensions: DesignerPunkExtensions = {
        family: 'shadow',
        primitiveRefs: {
          offsetX: refs.offsetX,
          offsetY: refs.offsetY,
          blur: refs.blur,
          opacity: refs.opacity,
          color: refs.color,
        },
      };

      // Include Android elevation
      if (token.platforms?.android?.elevation !== undefined) {
        extensions.platforms = {
          android: {
            supported: true,
            elevation: token.platforms.android.elevation,
          },
        };
      }

      // Use dot-separated key for DTCG group (shadow.container → container)
      const dtcgKey = key.startsWith('shadow.') ? key.slice('shadow.'.length) : key;
      group[dtcgKey] = this.toDTCGToken(shadowValue, 'shadow', token.description, extensions);
    }

    return group;
  }

  /**
   * Resolve a shadow primitive token from its registry.
   * Handles dot-notation names (e.g., 'shadowOffsetX.000' → key '000').
   */
  private resolveShadowPrimitive(
    tokenName: string,
    registry: Record<string, PrimitiveToken>
  ): PrimitiveToken | null {
    // Try direct lookup first
    if (registry[tokenName]) {
      return registry[tokenName];
    }
    // Handle dot notation (e.g., 'shadowOffsetX.000' → '000')
    const dotIndex = tokenName.lastIndexOf('.');
    if (dotIndex !== -1) {
      const shortKey = tokenName.slice(dotIndex + 1);
      if (registry[shortKey]) {
        return registry[shortKey];
      }
    }
    return null;
  }
  /**
     * Generate glow primitive tokens as individual DTCG tokens.
     *
     * Glow primitives (blur, opacity) are exported individually — composed glow tokens
     * are not yet implemented. Glows share offset primitives with shadows (shadowOffsetX,
     * shadowOffsetY) and use the same color primitives.
     *
     * All glow tokens include:
     * - `$extensions.designerpunk.glowType: "emission"` — identifies glow effect type
     * - `$extensions.designerpunk.status: "partial"` — composed glows not yet implemented
     *
     * @requirements 5.6, 5.7
     */
    private generateGlowTokens(): DTCGGroup {
      const group: DTCGGroup = {
        $description: 'Glow effect primitives. Composed glows not yet implemented — glows share offset primitives with shadows (shadowOffsetX, shadowOffsetY).',
      };

      // Glow blur tokens → DTCG dimension type
      const blur: DTCGGroup = { $type: 'dimension' };
      for (const [key, token] of Object.entries(glowBlur)) {
        const extensions = this.buildPrimitiveExtensions(token, 'glow', GLOW_BLUR_BASE_VALUE);
        extensions.glowType = 'emission';
        extensions.status = 'partial';
        blur[key] = this.toDTCGToken(`${token.baseValue}px`, 'dimension', token.description, extensions);
      }
      group.blur = blur;

      // Glow opacity tokens → DTCG number type
      const opacity: DTCGGroup = { $type: 'number' };
      for (const [key, token] of Object.entries(glowOpacity)) {
        const extensions = this.buildPrimitiveExtensions(token, 'glow', GLOW_OPACITY_BASE_VALUE);
        extensions.glowType = 'emission';
        extensions.status = 'partial';
        opacity[key] = this.toDTCGToken(token.baseValue, 'number', token.description, extensions);
      }
      group.opacity = opacity;

      return group;
    }

  /**
   * Generate typography composition tokens as DTCG typography type.
   *
   * Typography tokens compose primitive references (fontFamily, fontSize, fontWeight,
   * lineHeight, letterSpacing) into DTCG typography composite values using alias syntax.
   *
   * @requirements 6.1, 6.5
   */
  private generateTypographyTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'typography' };

    for (const [key, token] of Object.entries(typographyTokens)) {
      const refs = token.primitiveReferences;

      // Build DTCG typography composite value — resolve or alias based on config
      let typographyValue: Record<string, unknown>;
      if (this.config.resolveAliases) {
        const ffToken = (fontFamilyTokens as Record<string, PrimitiveToken>)[refs.fontFamily];
        const fontStack = ffToken ? String(ffToken.platforms.web.value) : refs.fontFamily;
        const families = fontStack.split(',').map(f => f.trim().replace(/^["']|["']$/g, ''));

        typographyValue = {
          fontFamily: families,
          fontSize: this.resolvePrimitiveDimensionAlias(refs.fontSize, fontSizeTokens),
          fontWeight: (fontWeightTokens as Record<string, PrimitiveToken>)[refs.fontWeight]?.baseValue ?? refs.fontWeight,
          lineHeight: (lineHeightTokens as Record<string, PrimitiveToken>)[refs.lineHeight]?.baseValue ?? refs.lineHeight,
          letterSpacing: (letterSpacingTokens as Record<string, PrimitiveToken>)[refs.letterSpacing]
            ? `${(letterSpacingTokens as Record<string, PrimitiveToken>)[refs.letterSpacing].baseValue}em`
            : refs.letterSpacing,
        };
      } else {
        typographyValue = {
          fontFamily: `{fontFamily.${refs.fontFamily}}`,
          fontSize: `{fontSize.${refs.fontSize}}`,
          fontWeight: `{fontWeight.${refs.fontWeight}}`,
          lineHeight: `{lineHeight.${refs.lineHeight}}`,
          letterSpacing: `{letterSpacing.${refs.letterSpacing}}`,
        };
      }

      // Build extensions with primitive references
      const extensions: DesignerPunkExtensions = {
        family: 'typography',
        primitiveRefs: { ...refs },
      };

      // Use dot-separated key for DTCG group (typography.bodyMd → bodyMd)
      const dtcgKey = key.startsWith('typography.') ? key.slice('typography.'.length) : key;
      group[dtcgKey] = this.toDTCGToken(typographyValue, 'typography', token.description, extensions);
    }

    return group;
  }

  /**
   * Generate motion composition tokens as DTCG transition type.
   *
   * Motion tokens compose primitive duration and easing references into DTCG transition
   * composite values. Delay defaults to '0ms' when not defined. Scale is included in
   * extensions when present.
   *
   * @requirements 6.2, 6.3, 6.4, 6.5
   */
  private generateMotionTokens(): DTCGGroup {
    const group: DTCGGroup = { $type: 'transition' };

    for (const [key, token] of Object.entries(semanticMotionTokens)) {
      const refs = token.primitiveReferences;

      // Build DTCG transition composite value — resolve or alias based on config
      let transitionValue: Record<string, unknown>;
      if (this.config.resolveAliases) {
        const durToken = (durationTokens as Record<string, PrimitiveToken>)[refs.duration];
        const easToken = (easingTokens as Record<string, PrimitiveToken>)[refs.easing];

        // Resolve easing to cubicBezier array
        let timingFunction: unknown = refs.easing;
        if (easToken) {
          const bezierStr = String(easToken.platforms.web.value);
          const match = bezierStr.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
          if (match) {
            timingFunction = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
          }
        }

        transitionValue = {
          duration: durToken ? `${durToken.baseValue}ms` : `{duration.${refs.duration}}`,
          timingFunction,
          delay: '0ms',
        };
      } else {
        transitionValue = {
          duration: `{duration.${refs.duration}}`,
          timingFunction: `{easing.${refs.easing}}`,
          delay: '0ms',
        };
      }

      // Build extensions with primitive references
      const extensions: DesignerPunkExtensions = {
        family: 'motion',
        primitiveRefs: {
          duration: refs.duration,
          easing: refs.easing,
        },
      };

      // Include scale in extensions when present (Requirement 6.4)
      if (refs.scale) {
        extensions.primitiveRefs!.scale = refs.scale;
        (extensions as Record<string, unknown>).scale = this.config.resolveAliases
          ? (scaleTokens as Record<string, PrimitiveToken>)[refs.scale]?.baseValue ?? `{scale.${refs.scale}}`
          : `{scale.${refs.scale}}`;
      }

      // Use dot-separated key for DTCG group (motion.floatLabel → floatLabel)
      const dtcgKey = key.startsWith('motion.') ? key.slice('motion.'.length) : key;
      group[dtcgKey] = this.toDTCGToken(transitionValue, 'transition', token.description, extensions);
    }

    return group;
  }

  // ---------------------------------------------------------------------------
  // Shared helpers for primitive token generation
  // ---------------------------------------------------------------------------

  /**
   * Generate a DTCG group of dimension tokens from a record of PrimitiveTokens.
   * Converts baseValue to `{value}px` format.
   */
  private generateDimensionGroup(
    tokens: Record<string, PrimitiveToken>,
    family: string,
    familyBase?: number
  ): DTCGGroup {
    const group: DTCGGroup = { $type: 'dimension' };
    for (const [key, token] of Object.entries(tokens)) {
      const extensions = this.buildPrimitiveExtensions(token, family, familyBase);
      group[key] = this.toDTCGToken(`${token.baseValue}px`, 'dimension', token.description, extensions);
    }
    return group;
  }

  /**
   * Resolve a color token's RGBA value from its mode/theme structure.
   * Uses light.base as the default resolved value for DTCG output.
   *
   * @param token - The primitive color token to resolve
   * @param tokenName - Optional token name for error messages
   * @returns Resolved color string (e.g., "rgba(255, 0, 0, 1)")
   * @throws Error if the resolved color value is not a valid color format
   */
  private resolveColorValue(token: PrimitiveToken, tokenName?: string): string {
    const webValue = token.platforms.web.value;
    let resolved: string;
    if (typeof webValue === 'string') {
      resolved = webValue;
    } else {
      // ColorTokenValue structure: { light: { base, wcag }, dark: { base, wcag } }
      const colorVal = webValue as ColorTokenValue;
      resolved = colorVal.light.base;
    }

    // Validate the resolved color is a recognizable format
    if (!resolved || typeof resolved !== 'string') {
      const name = tokenName || token.name || 'unknown';
      throw new Error(
        `Invalid token value for "${name}": ${String(resolved)}. Expected valid color format (hex, rgb, rgba).`
      );
    }

    const isValidColor =
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(resolved) ||
      /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(resolved);

    if (!isValidColor) {
      const name = tokenName || token.name || 'unknown';
      throw new Error(
        `Invalid token value for "${name}": ${resolved}. Expected valid color format (hex, rgb, rgba).`
      );
    }

    return resolved;
  }

  /**
   * Build DesignerPunk extension metadata for a primitive token.
   * Includes formula, family, and baseValue when includeExtensions is true.
   */
  private buildPrimitiveExtensions(
    token: PrimitiveToken,
    family: string,
    familyBase?: number
  ): DesignerPunkExtensions {
    const ext: DesignerPunkExtensions = {
      formula: token.mathematicalRelationship,
      family,
    };
    if (familyBase !== undefined && familyBase !== 0) {
      ext.baseValue = familyBase;
    }
    return ext;
  }

  /**
   * Merge shadow color and opacity into a single RGBA value.
   *
   * Replaces the color's alpha channel with the shadow's opacity value
   * (does NOT multiply). Shadow opacity is authoritative per Design Decision 3.
   *
   * @param colorRgba - Color in rgba(r, g, b, a) format
   * @param opacity - Shadow opacity value (0–1)
   * @param shadowName - Optional shadow token name for error messages
   * @returns Merged rgba string with shadow opacity as alpha
   * @throws Error if colorRgba is not in valid rgba format
   */
  mergeShadowColor(colorRgba: string, opacity: number, shadowName?: string): string {
    const match = colorRgba.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/);
    if (!match) {
      const context = shadowName ? ` for "${shadowName}"` : '';
      throw new Error(
        `Shadow color merge failed${context}: ${colorRgba}. Expected rgba(r, g, b, a) format.`
      );
    }
    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * Convert a Rosetta primitive token to a DTCG token with optional extensions.
   *
   * @param value - The token value in DTCG format
   * @param type - The DTCG type for this token
   * @param description - Optional token description
   * @param extensions - Optional DesignerPunk extension metadata
   * @returns A DTCGToken object
   * @throws Error if the type is not a valid DTCG type
   */
  toDTCGToken(
    value: unknown,
    type: DTCGType,
    description?: string,
    extensions?: DesignerPunkExtensions
  ): DTCGToken {
    // Validate DTCG type
    if (!VALID_DTCG_TYPES.has(type)) {
      throw new Error(
        `Invalid token type: "${type}". No DTCG mapping exists. ` +
        `Valid types: ${Array.from(VALID_DTCG_TYPES).join(', ')}.`
      );
    }

    const token: DTCGToken = {
      $value: value,
      $type: type,
    };

    if (description) {
      token.$description = description;
    }

    if (this.config.includeExtensions && extensions && Object.keys(extensions).length > 0) {
      token.$extensions = { designerpunk: extensions };
    }

    return token;
  }
}
