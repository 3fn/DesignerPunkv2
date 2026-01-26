import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { getPlatformTokenName } from '../naming/PlatformNamingRules';
import { getColorToken } from '../tokens/ColorTokens';
import { getOpacityToken } from '../tokens/OpacityTokens';

/**
 * Web-specific format generator
 * Generates CSS custom properties for web platform token usage
 */
export class WebFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'web';
  readonly formats: OutputFormat[] = ['css'];

  constructor() {
    super();
  }

  formatToken(token: PrimitiveToken | SemanticToken): string {
    const tokenName = this.getTokenName(token.name, token.category);
    
    // Handle semantic-only tokens (like z-index tokens) that have direct values
    // These tokens have a 'value' property and 'platforms' array but no 'primitiveReferences'
    if ('value' in token && typeof token.value === 'number' && 
        'platforms' in token && Array.isArray(token.platforms)) {
      // This is a semantic-only token with a direct value (e.g., z-index tokens)
      return this.formatCSSCustomProperty(tokenName, token.value, 'unitless');
    }
    
    // Check if this is a primitive token (has 'baseValue' property)
    const isPrimitiveToken = 'baseValue' in token;
    
    // For primitive tokens or semantic tokens with platform-specific values
    let platformValue;
    if (isPrimitiveToken) {
      // This is a primitive token
      const primitiveToken = token as PrimitiveToken;
      platformValue = primitiveToken.platforms.web;
    } else {
      // This is a semantic token - check for platforms property first
      const semanticToken = token as SemanticToken;
      if (semanticToken.platforms?.web) {
        platformValue = semanticToken.platforms.web;
      } else {
        // Get the first resolved primitive token
        const primitiveToken = semanticToken.primitiveTokens ? Object.values(semanticToken.primitiveTokens)[0] : null;
        if (!primitiveToken) {
          throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
        }
        platformValue = primitiveToken.platforms.web;
      }
    }
    
    if (!platformValue) {
      throw new Error(`Token ${token.name} has no web platform value`);
    }

    return this.formatCSSCustomProperty(tokenName, platformValue.value, platformValue.unit);
  }

  generateHeader(metadata?: FileMetadata): string {
    const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
    const version = metadata?.version || '1.0.0';

    return [
      '/**',
      ' * DesignerPunk Design System - Web Tokens',
      ` * Generated: ${timestamp}`,
      ` * Version: ${version}`,
      ' * Platform: Web (CSS Custom Properties)',
      ' *',
      ' * USAGE GUIDANCE:',
      ' * - Use semantic tokens (colorPrimary, borderDefault) for all UI development',
      ' * - Use primitive tokens (purple300, space100) only when no semantic exists',
      ' * - Comments show semantic → primitive relationships',
      ' */',
      '',
      ':root {'
    ].join('\n');
  }

  generateFooter(): string {
    return '}';
  }

  validateSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Basic CSS validation
    if (!content.includes(':root {')) {
      errors.push('Missing :root selector');
    }
    if (!content.match(/--[\w-]+:/)) {
      errors.push('No CSS custom properties found');
    }
    // Check for balanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces in CSS');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  getTokenName(tokenName: string, category: string): string {
    // Use web platform naming rules (kebab-case with -- prefix)
    // Special handling for breakpoint and grid spacing tokens to ensure proper naming
    if (category === 'breakpoint') {
      // Convert breakpointXs -> --breakpoint-xs
      const kebabName = tokenName.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--${kebabName}`;
    }
    
    if (tokenName.startsWith('grid')) {
      // Convert gridGutterXs -> --grid-gutter-xs
      // Convert gridMarginNative -> --grid-margin-native
      const kebabName = tokenName.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--${kebabName}`;
    }
    
    // Special handling for inset spacing tokens with numeric names
    // Convert "inset.050" -> "--space-inset-050"
    if (category === 'spacing' && tokenName.startsWith('inset.')) {
      const numericPart = tokenName.replace('inset.', '');
      return `--space-inset-${numericPart}`;
    }
    
    return getPlatformTokenName(tokenName, this.platform, category as any);
  }

  private formatCSSCustomProperty(name: string, value: number | string | object, unit: string): string {
    const formattedValue = this.formatCSSValue(value, unit);
    // Check if name already has the -- prefix (from getPlatformTokenName)
    const prefix = name.startsWith('--') ? '' : '--';
    return `  ${prefix}${name}: ${formattedValue};`;
  }

  private formatCSSValue(value: number | string | object, unit: string): string {
    if (typeof value === 'object') {
      // For color tokens with mode/theme structure, extract the light/base value
      // and format as RGBA for CSS output
      const colorValue = value as { light?: { base?: string }; dark?: { base?: string } };
      if (colorValue.light?.base) {
        // Return the RGBA string directly - it's already in CSS-compatible format
        return colorValue.light.base;
      }
      // Fallback to JSON string for unknown structures
      return JSON.stringify(value);
    }

    if (typeof value === 'string') {
      // Check if it's an RGBA string - return as-is for CSS
      if (value.startsWith('rgba(')) {
        return value;
      }
      // Font family or other string values
      return value;
    }

    // Numeric values with units
    switch (unit) {
      case 'rem':
        return `${value}rem`;
      case 'px':
        return `${value}px`;
      case 'em':
        return `${value}em`;
      case 'unitless':
        return String(value);
      case 'fontFamily':
        return String(value);
      case 'fontWeight':
        return String(value);
      case 'hex':
        return String(value);
      case 'rgba':
        // For RGBA unit, the value should already be an RGBA string
        return String(value);
      default:
        return String(value);
    }
  }

  /**
   * Parse an RGBA string into its component values
   * Input: 'rgba(184, 182, 200, 1)' or 'rgba(184, 182, 200, 0.48)'
   * Output: { r: 184, g: 182, b: 200, a: 1 } or { r: 184, g: 182, b: 200, a: 0.48 }
   * 
   * @param rgbaString - RGBA color string
   * @returns Object with r, g, b, a values or null if parsing fails
   */
  parseRgbaString(rgbaString: string): { r: number; g: number; b: number; a: number } | null {
    const match = rgbaString.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (!match) {
      return null;
    }
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: parseFloat(match[4])
    };
  }

  /**
   * Format a color token value for CSS output
   * Handles both RGBA strings and mode-aware color objects
   * 
   * @param colorValue - Color value (string or mode-aware object)
   * @returns CSS-compatible color string
   */
  formatColorValue(colorValue: string | object): string {
    if (typeof colorValue === 'string') {
      // Already an RGBA string, return as-is
      return colorValue;
    }
    
    // Mode-aware color object - extract light/base value
    const modeAware = colorValue as { light?: { base?: string }; dark?: { base?: string } };
    if (modeAware.light?.base) {
      return modeAware.light.base;
    }
    
    // Fallback
    return JSON.stringify(colorValue);
  }

  protected generateCategoryComment(category: string): string {
    return `\n  /* ${category.toUpperCase()} TOKENS */`;
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    return `  /* ${token.mathematicalRelationship} */`;
  }

  /**
   * Format a single-reference semantic token
   * Generates CSS custom property format: --color-primary: var(--purple-300);
   * For baked-in RGBA values: --color-structure-border-subtle: rgba(184, 182, 200, 0.48);
   * For opacity composition: --color-structure-border-subtle: rgba(184, 182, 200, 0.48);
   */
  formatSingleReferenceToken(semantic: SemanticToken): string {
    // Check for opacity composition pattern (has 'color' and 'opacity' keys)
    const refs = semantic.primitiveReferences as Record<string, string>;
    if (refs.color && refs.opacity) {
      return this.formatOpacityCompositionToken(semantic, refs.color, refs.opacity);
    }

    // Get the primitive reference name (e.g., 'purple300' from primitiveReferences)
    const primitiveRef = semantic.primitiveReferences.value || 
                         semantic.primitiveReferences.default ||
                         Object.values(semantic.primitiveReferences)[0];
    
    if (!primitiveRef) {
      throw new Error(`Semantic token ${semantic.name} has no primitive reference`);
    }

    // Convert semantic token name to appropriate format
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;
    
    // Check if the primitive reference is a baked-in RGBA value
    if (typeof primitiveRef === 'string' && primitiveRef.startsWith('rgba(')) {
      // Baked-in RGBA value - output directly
      const wcagComment = this.getWCAGComment(semantic);
      const tokenLine = `  ${cssSemanticName}: ${primitiveRef};`;
      return wcagComment ? `  ${wcagComment}\n${tokenLine}` : tokenLine;
    }
    
    // CSS custom property format
    // Convert primitive reference to kebab-case for CSS
    // Use semantic category as a hint for the primitive token category
    const cssPrimitiveRefName = getPlatformTokenName(primitiveRef, this.platform, semantic.category as any);
    const cssPrimitiveRef = cssPrimitiveRefName.startsWith('--') ? cssPrimitiveRefName : `--${cssPrimitiveRefName}`;
    
    // Add WCAG comment for accessibility tokens
    const wcagComment = this.getWCAGComment(semantic);
    const tokenLine = `  ${cssSemanticName}: var(${cssPrimitiveRef});`;
    
    return wcagComment ? `  ${wcagComment}\n${tokenLine}` : tokenLine;
  }

  /**
   * Format a semantic token with opacity composition
   * Resolves color primitive to RGB values and opacity primitive to alpha value
   * Output: rgba(r, g, b, alpha)
   * 
   * @param semantic - Semantic token with color+opacity composition
   * @param colorRef - Color primitive token name (e.g., 'gray100')
   * @param opacityRef - Opacity primitive token name (e.g., 'opacity600')
   * @returns CSS custom property string with resolved RGBA value
   */
  private formatOpacityCompositionToken(
    semantic: SemanticToken,
    colorRef: string,
    opacityRef: string
  ): string {
    // Resolve color primitive to get RGB values
    const colorToken = getColorToken(colorRef as any);
    if (!colorToken) {
      throw new Error(`Color primitive '${colorRef}' not found for token ${semantic.name}`);
    }

    // Resolve opacity primitive to get alpha value
    const opacityToken = getOpacityToken(opacityRef);
    if (!opacityToken) {
      throw new Error(`Opacity primitive '${opacityRef}' not found for token ${semantic.name}`);
    }

    // Extract RGB values from color token's web platform value
    const colorValue = colorToken.platforms.web.value as { light?: { base?: string } };
    const rgbaString = colorValue.light?.base;
    if (!rgbaString) {
      throw new Error(`Color token '${colorRef}' has no web platform value`);
    }

    // Parse the RGBA string to get RGB components
    const parsed = this.parseRgbaString(rgbaString);
    if (!parsed) {
      throw new Error(`Failed to parse RGBA value for color token '${colorRef}'`);
    }

    // Get opacity value (0.0 - 1.0)
    const opacityValue = opacityToken.baseValue;

    // Generate the composed RGBA value
    const composedRgba = this.generateRgbaAlpha(parsed.r, parsed.g, parsed.b, opacityValue);

    // Convert semantic token name to CSS format
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;

    // Add WCAG comment for accessibility tokens
    const wcagComment = this.getWCAGComment(semantic);
    const tokenLine = `  ${cssSemanticName}: ${composedRgba};`;

    return wcagComment ? `  ${wcagComment}\n${tokenLine}` : tokenLine;
  }

  /**
   * Get WCAG comment for accessibility tokens
   * Extracts WCAG information from token description
   */
  private getWCAGComment(semantic: SemanticToken): string | null {
    // Only add WCAG comments for accessibility tokens
    if (!semantic.name.startsWith('accessibility.')) {
      return null;
    }

    // Extract WCAG information from description
    // Format: "Accessibility token for focus offset (WCAG 2.4.7)"
    const wcagMatch = semantic.description?.match(/WCAG\s+([\d.]+)/);
    if (!wcagMatch) {
      return null;
    }

    const wcagCriterion = wcagMatch[1];
    
    // Map WCAG criteria to names
    const wcagNames: Record<string, string> = {
      '2.4.7': 'Focus Visible',
      '1.4.11': 'Non-text Contrast'
    };

    const criterionName = wcagNames[wcagCriterion] || '';
    return `/* WCAG ${wcagCriterion}${criterionName ? ` ${criterionName}` : ''} */`;
  }

  /**
   * Format a multi-reference semantic token (typography, shadow)
   * Generates individual CSS custom properties for each property
   * For shadow tokens, also generates a composite box-shadow value
   */
  formatMultiReferenceToken(semantic: SemanticToken): string {
    // Get all primitive references except 'value' and 'default' which are for single-reference tokens
    const refs = Object.entries(semantic.primitiveReferences)
      .filter(([key]) => key !== 'value' && key !== 'default');
    
    if (refs.length === 0) {
      throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
    }

    // Convert semantic token name to appropriate format
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    // CSS doesn't support object literals, so we'll generate individual properties
    // This is a limitation of CSS custom properties
    const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;
    
    const properties = refs.map(([key, primitiveRef]) => {
      // Convert primitive reference to kebab-case for CSS
      // Use semantic category as a hint for the primitive token category
      const cssPrimitiveRefName = getPlatformTokenName(primitiveRef, this.platform, semantic.category as any);
      const cssPrimitiveRef = cssPrimitiveRefName.startsWith('--') ? cssPrimitiveRefName : `--${cssPrimitiveRefName}`;
      // Convert property key to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssSemanticName}-${cssKey}: var(${cssPrimitiveRef});`;
    }).join('\n');
    
    // For shadow tokens, also generate a composite box-shadow value
    // This allows components to use: box-shadow: var(--shadow-container)
    if (semantic.category === 'shadow') {
      const compositeToken = this.formatCompositeShadowToken(semantic, cssSemanticName);
      return properties + '\n' + compositeToken;
    }
    
    return properties;
  }

  /**
   * Format a composite shadow token for CSS box-shadow usage
   * Generates: --shadow-container: <offset-x> <offset-y> <blur> rgba(0, 0, 0, <opacity>);
   * 
   * This allows components to use: box-shadow: var(--shadow-container)
   * instead of manually composing individual shadow properties.
   * 
   * @param semantic - Shadow semantic token
   * @param cssSemanticName - CSS custom property name (e.g., '--shadow-container')
   * @returns CSS custom property string with composite box-shadow value
   */
  private formatCompositeShadowToken(semantic: SemanticToken, cssSemanticName: string): string {
    // Build composite shadow value using var() references to individual properties
    // Format: offset-x offset-y blur rgba(0, 0, 0, opacity)
    // Using var() references allows the composite to stay in sync with individual properties
    const offsetX = `var(${cssSemanticName}-offset-x)`;
    const offsetY = `var(${cssSemanticName}-offset-y)`;
    const blur = `var(${cssSemanticName}-blur)`;
    const opacity = `var(${cssSemanticName}-opacity)`;
    
    // Use rgba with opacity variable for the shadow color
    // Note: CSS doesn't allow var() inside rgba() directly, so we use a calc-based approach
    // or rely on the browser's ability to handle this in modern CSS
    // For maximum compatibility, we compose the shadow using individual var() references
    const compositeValue = `${offsetX} ${offsetY} ${blur} rgba(0, 0, 0, ${opacity})`;
    
    return `  ${cssSemanticName}: ${compositeValue};`;
  }

  /**
   * Generate section header comment
   * Marks primitive vs semantic sections
   */
  generateSectionComment(section: 'primitive' | 'semantic'): string {
    const sectionTitle = section === 'primitive' 
      ? 'PRIMITIVE TOKENS\n  Mathematical foundation'
      : 'SEMANTIC TOKENS\n  Use these for UI development';
    
    return [
      '',
      '  /* ============================================',
      `   * ${sectionTitle}`,
      '   * ============================================ */',
      ''
    ].join('\n');
  }

  /**
   * Generate CSS opacity property
   * Outputs: opacity: 0.48;
   * 
   * @param opacityValue - Opacity value (0.0 - 1.0)
   * @returns CSS opacity property string
   */
  generateOpacityProperty(opacityValue: number): string {
    return `opacity: ${opacityValue};`;
  }

  /**
   * Generate RGBA alpha channel with color
   * Outputs: rgba(r, g, b, 0.48)
   * 
   * @param r - Red channel (0-255)
   * @param g - Green channel (0-255)
   * @param b - Blue channel (0-255)
   * @param alpha - Alpha channel (0.0 - 1.0)
   * @returns RGBA color string
   */
  generateRgbaAlpha(r: number, g: number, b: number, alpha: number): string {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Generate CSS custom property for opacity token
   * Outputs: --opacity600: 0.48;
   * 
   * @param tokenName - Opacity token name (e.g., 'opacity600')
   * @param opacityValue - Opacity value (0.0 - 1.0)
   * @returns CSS custom property string
   */
  generateCustomProperty(tokenName: string, opacityValue: number): string {
    // Ensure token name has -- prefix for CSS custom property
    const prefix = tokenName.startsWith('--') ? '' : '--';
    return `${prefix}${tokenName}: ${opacityValue};`;
  }

  /**
   * Format icon size token with calculated value
   * Generates: --icon-size-100: 24px; with formula and typography pairing comments
   * 
   * @param tokenName - Icon token name (e.g., 'icon.size100')
   * @param calculatedSize - Calculated icon size in pixels
   * @param category - Token category
   * @param description - Token description with formula (optional)
   * @param context - Token context with typography pairing (optional)
   * @returns CSS custom property string with comments
   */
  formatIconSizeToken(
    tokenName: string,
    calculatedSize: number,
    category: string,
    description?: string,
    context?: string
  ): string {
    const cssName = this.getTokenName(tokenName, category);
    const prefix = cssName.startsWith('--') ? '' : '--';
    
    // Build comment with formula and typography pairing
    const comments: string[] = [];
    if (description) {
      comments.push(description);
    }
    if (context) {
      comments.push(`Pairs with: ${context}`);
    }
    
    if (comments.length > 0) {
      return `  ${prefix}${cssName}: ${calculatedSize}px; /* ${comments.join(' | ')} */`;
    }
    
    return `  ${prefix}${cssName}: ${calculatedSize}px;`;
  }

  /**
   * Generate accessibility tokens section for web platform
   * Generates CSS custom properties for focus indicator tokens with WCAG comments
   * 
   * WCAG References:
   * - 2.4.7 Focus Visible (Level AA)
   * - 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
   * 
   * @returns Array of CSS custom property strings with WCAG comments
   */
  generateAccessibilityTokens(): string[] {
    const lines: string[] = [];
    
    // Add section header with WCAG guidance
    lines.push('');
    lines.push('  /* ============================================');
    lines.push('   * ACCESSIBILITY TOKENS');
    lines.push('   * Focus Indicators for Keyboard Navigation');
    lines.push('   * WCAG 2.4.7 Focus Visible (Level AA)');
    lines.push('   * WCAG 1.4.11 Non-text Contrast (Level AA)');
    lines.push('   * ============================================ */');
    lines.push('');
    
    // Focus indicator tokens with WCAG comments
    lines.push('  /* Focus Indicator Offset - WCAG 2.4.7 Focus Visible */');
    lines.push('  --accessibility-focus-offset: 2px;');
    lines.push('');
    
    lines.push('  /* Focus Indicator Width - WCAG 2.4.7 Focus Visible */');
    lines.push('  --accessibility-focus-width: 2px;');
    lines.push('');
    
    lines.push('  /* Focus Indicator Color - WCAG 2.4.7 Focus Visible, 1.4.11 Non-text Contrast (3:1 minimum) */');
    lines.push('  --accessibility-focus-color: var(--color-primary);');
    lines.push('');
    
    // Add usage example comment
    lines.push('  /* Usage Example:');
    lines.push('   * button:focus-visible {');
    lines.push('   *   outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);');
    lines.push('   *   outline-offset: var(--accessibility-focus-offset);');
    lines.push('   * }');
    lines.push('   */');
    
    return lines;
  }
}
