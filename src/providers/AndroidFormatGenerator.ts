import { PrimitiveToken, SemanticToken, TokenCategory } from '../types';
import { BaseFormatProvider, FileMetadata, FormatOptions } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';

/**
 * Android-specific format generator
 * Generates Kotlin constants or XML resources for Android platform token usage
 */
export class AndroidFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'android';
  readonly formats: OutputFormat[] = ['kotlin', 'xml'];

  private outputFormat: OutputFormat;

  constructor(outputFormat: OutputFormat = 'kotlin') {
    super();
    this.outputFormat = outputFormat;
  }

  formatToken(token: PrimitiveToken | SemanticToken): string {
    const tokenName = this.getTokenName(token.name, token.category);
    
    // For semantic tokens, use the resolved primitive token's platform value
    let platformValue;
    if ('platforms' in token) {
      platformValue = token.platforms.android;
    } else {
      // For semantic tokens, get the first resolved primitive token
      const primitiveToken = token.primitiveTokens ? Object.values(token.primitiveTokens)[0] : null;
      if (!primitiveToken) {
        throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
      }
      platformValue = primitiveToken.platforms.android;
    }

    if (this.outputFormat === 'kotlin') {
      return this.formatKotlinConstant(tokenName, platformValue.value, platformValue.unit, token.category);
    } else {
      return this.formatXMLResource(tokenName, platformValue.value, platformValue.unit, token.category);
    }
  }

  generateHeader(metadata?: FileMetadata): string {
    const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
    const version = metadata?.version || '1.0.0';

    if (this.outputFormat === 'kotlin') {
      return [
        '/**',
        ' * DesignerPunk Design System - Android Tokens',
        ` * Generated: ${timestamp}`,
        ` * Version: ${version}`,
        ' * Platform: Android (Kotlin Constants)',
        ' */',
        '',
        'package com.designerpunk.tokens',
        '',
        'object DesignTokens {'
      ].join('\n');
    } else {
      return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<!--',
        '  DesignerPunk Design System - Android Tokens',
        `  Generated: ${timestamp}`,
        `  Version: ${version}`,
        '  Platform: Android (XML Resources)',
        '-->',
        '<resources>'
      ].join('\n');
    }
  }

  generateFooter(): string {
    if (this.outputFormat === 'kotlin') {
      return '}';
    } else {
      return '</resources>';
    }
  }

  validateSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (this.outputFormat === 'kotlin') {
      // Basic Kotlin validation
      if (!content.includes('object DesignTokens')) {
        errors.push('Missing DesignTokens object declaration');
      }
      if (!content.includes('package com.designerpunk.tokens')) {
        errors.push('Missing package declaration');
      }
      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push('Unbalanced braces in Kotlin');
      }
    } else {
      // Basic XML validation
      if (!content.includes('<?xml version="1.0"')) {
        errors.push('Missing XML declaration');
      }
      if (!content.includes('<resources>')) {
        errors.push('Missing resources root element');
      }
      if (!content.includes('</resources>')) {
        errors.push('Missing closing resources tag');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  getTokenName(tokenName: string, category: string): string {
    if (this.outputFormat === 'kotlin') {
      // Convert to lowerCamelCase for Kotlin
      return tokenName.charAt(0).toLowerCase() + tokenName.slice(1);
    } else {
      // Convert to snake_case for XML resources
      return tokenName
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
        .toLowerCase();
    }
  }

  private formatKotlinConstant(name: string, value: number | string | object, unit: string, category: string): string {
    const kotlinType = this.getKotlinType(category, unit);
    const formattedValue = this.formatKotlinValue(value, unit, kotlinType);
    return `    const val ${name}: ${kotlinType} = ${formattedValue}`;
  }

  private formatXMLResource(name: string, value: number | string | object, unit: string, category: string): string {
    const resourceType = this.getXMLResourceType(category);
    const formattedValue = this.formatXMLValue(value, unit);
    return `    <${resourceType} name="${name}">${formattedValue}</${resourceType}>`;
  }

  private getKotlinType(category: string, unit: string): string {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
      case 'fontSize':
        return 'Float';
      case 'lineHeight':
      case 'density':
      case 'letterSpacing':
        return 'Float';
      case 'fontFamily':
        return 'String';
      case 'fontWeight':
        return 'Int';
      case 'color':
        return 'Int'; // Color as ARGB integer
      default:
        return 'Float';
    }
  }

  private getXMLResourceType(category: string): string {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
      case 'fontSize':
        return 'dimen';
      case 'fontFamily':
        return 'string';
      case 'fontWeight':
        return 'integer';
      case 'color':
        return 'color';
      case 'lineHeight':
      case 'density':
      case 'letterSpacing':
        return 'item'; // Generic item for unitless values
      default:
        return 'dimen';
    }
  }

  private formatKotlinValue(value: number | string | object, unit: string, kotlinType: string): string {
    if (typeof value === 'object') {
      // For color tokens with mode/theme structure
      return this.formatKotlinColor(value);
    }

    if (typeof value === 'string') {
      return `"${value}"`;
    }

    // Numeric values
    if (kotlinType === 'Float') {
      return `${value}f`;
    }
    return String(value);
  }

  private formatXMLValue(value: number | string | object, unit: string): string {
    if (typeof value === 'object') {
      // For color tokens, return placeholder
      return '@color/placeholder';
    }

    if (typeof value === 'string') {
      return value;
    }

    // Numeric values with units
    switch (unit) {
      case 'dp':
        return `${value}dp`;
      case 'sp':
        return `${value}sp`;
      case 'unitless':
        return String(value);
      default:
        return String(value);
    }
  }

  private formatKotlinColor(colorValue: object): string {
    // Placeholder for color formatting
    // Actual implementation would need the color structure
    return '0xFF000000.toInt() // placeholder';
  }

  protected generateCategoryComment(category: string): string {
    if (this.outputFormat === 'kotlin') {
      return `\n    // ${category.toUpperCase()} TOKENS`;
    } else {
      return `\n    <!-- ${category.toUpperCase()} TOKENS -->`;
    }
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    if (this.outputFormat === 'kotlin') {
      return `    // ${token.mathematicalRelationship}`;
    } else {
      return `    <!-- ${token.mathematicalRelationship} -->`;
    }
  }
}
