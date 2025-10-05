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
  readonly formats: OutputFormat[] = ['css', 'javascript'];

  private outputFormat: OutputFormat;

  constructor(outputFormat: OutputFormat = 'css') {
    super();
    this.outputFormat = outputFormat;
  }

  formatToken(token: PrimitiveToken | SemanticToken): string {
    const tokenName = this.getTokenName(token.name, token.category);
    
    // For semantic tokens, use the resolved primitive token's platform value
    let platformValue;
    if ('platforms' in token) {
      platformValue = token.platforms.web;
    } else {
      // For semantic tokens, get the first resolved primitive token
      const primitiveToken = token.primitiveTokens ? Object.values(token.primitiveTokens)[0] : null;
      if (!primitiveToken) {
        throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
      }
      platformValue = primitiveToken.platforms.web;
    }

    if (this.outputFormat === 'css') {
      return this.formatCSSCustomProperty(tokenName, platformValue.value, platformValue.unit);
    } else {
      return this.formatJavaScriptConstant(tokenName, platformValue.value, platformValue.unit);
    }
  }

  generateHeader(metadata?: FileMetadata): string {
    const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
    const version = metadata?.version || '1.0.0';

    if (this.outputFormat === 'css') {
      return [
        '/**',
        ' * DesignerPunk Design System - Web Tokens',
        ` * Generated: ${timestamp}`,
        ` * Version: ${version}`,
        ' * Platform: Web (CSS Custom Properties)',
        ' */',
        '',
        ':root {'
      ].join('\n');
    } else {
      return [
        '/**',
        ' * DesignerPunk Design System - Web Tokens',
        ` * Generated: ${timestamp}`,
        ` * Version: ${version}`,
        ' * Platform: Web (JavaScript Constants)',
        ' */',
        '',
        'export const DesignTokens = {'
      ].join('\n');
    }
  }

  generateFooter(): string {
    if (this.outputFormat === 'css') {
      return '}';
    } else {
      return '};';
    }
  }

  validateSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (this.outputFormat === 'css') {
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
    } else {
      // Basic JavaScript validation
      if (!content.includes('export const')) {
        errors.push('Missing export statement');
      }
      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push('Unbalanced braces in JavaScript');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  getTokenName(tokenName: string, category: string): string {
    // Use platform naming rules for consistent naming
    const platformName = getPlatformTokenName(tokenName, this.platform, category as any);
    
    // For JavaScript output, remove the CSS custom property prefix
    if (this.outputFormat === 'javascript' && platformName.startsWith('--')) {
      // Convert back to camelCase for JavaScript
      return tokenName.charAt(0).toLowerCase() + tokenName.slice(1);
    }
    
    return platformName;
  }

  private formatCSSCustomProperty(name: string, value: number | string | object, unit: string): string {
    const formattedValue = this.formatCSSValue(value, unit);
    return `  --${name}: ${formattedValue};`;
  }

  private formatJavaScriptConstant(name: string, value: number | string | object, unit: string): string {
    const formattedValue = this.formatJSValue(value, unit);
    return `  ${name}: ${formattedValue},`;
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

  private formatJSValue(value: number | string | object, unit: string): string {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    if (typeof value === 'string') {
      return `'${value}'`;
    }

    // Numeric values - include unit as string for JavaScript
    switch (unit) {
      case 'rem':
        return `'${value}rem'`;
      case 'px':
        return `'${value}px'`;
      case 'em':
        return `'${value}em'`;
      case 'unitless':
        return String(value);
      case 'fontFamily':
        return `'${value}'`;
      case 'fontWeight':
        return String(value);
      case 'hex':
        return `'${value}'`;
      default:
        return String(value);
    }
  }

  protected generateCategoryComment(category: string): string {
    if (this.outputFormat === 'css') {
      return `\n  /* ${category.toUpperCase()} TOKENS */`;
    } else {
      return `\n  // ${category.toUpperCase()} TOKENS`;
    }
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    if (this.outputFormat === 'css') {
      return `  /* ${token.mathematicalRelationship} */`;
    } else {
      return `  // ${token.mathematicalRelationship}`;
    }
  }
}
