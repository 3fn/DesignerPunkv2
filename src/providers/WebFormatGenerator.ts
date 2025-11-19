import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { getPlatformTokenName } from '../naming/PlatformNamingRules';

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
      // For color tokens with mode/theme structure, we'll need special handling
      // For now, return as JSON string
      return JSON.stringify(value);
    }

    if (typeof value === 'string') {
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
      default:
        return String(value);
    }
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
   */
  formatSingleReferenceToken(semantic: SemanticToken): string {
    // Get the primitive reference name (e.g., 'purple300' from primitiveReferences)
    const primitiveRef = semantic.primitiveReferences.value || 
                         semantic.primitiveReferences.default ||
                         Object.values(semantic.primitiveReferences)[0];
    
    if (!primitiveRef) {
      throw new Error(`Semantic token ${semantic.name} has no primitive reference`);
    }

    // Convert semantic token name to appropriate format
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    // CSS custom property format
    // Convert primitive reference to kebab-case for CSS
    // Use semantic category as a hint for the primitive token category
    const cssPrimitiveRefName = getPlatformTokenName(primitiveRef, this.platform, semantic.category as any);
    const cssSemanticName = semanticName.startsWith('--') ? semanticName : `--${semanticName}`;
    const cssPrimitiveRef = cssPrimitiveRefName.startsWith('--') ? cssPrimitiveRefName : `--${cssPrimitiveRefName}`;
    
    return `  ${cssSemanticName}: var(${cssPrimitiveRef});`;
  }

  /**
   * Format a multi-reference semantic token (typography)
   * Generates individual CSS custom properties for each property
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
    
    return properties;
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
}
