import { PrimitiveToken, SemanticToken, TokenCategory } from '../types';
import { BaseFormatProvider, FileMetadata, FormatOptions } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';

/**
 * iOS-specific format generator
 * Generates Swift constant declarations for iOS platform token usage
 */
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];

  formatToken(token: PrimitiveToken | SemanticToken): string {
    const tokenName = this.getTokenName(token.name, token.category);
    
    // For semantic tokens, use the resolved primitive token's platform value
    let platformValue;
    if ('platforms' in token) {
      platformValue = token.platforms.ios;
    } else {
      // For semantic tokens, get the first resolved primitive token
      const primitiveToken = token.primitiveTokens ? Object.values(token.primitiveTokens)[0] : null;
      if (!primitiveToken) {
        throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
      }
      platformValue = primitiveToken.platforms.ios;
    }
    
    const swiftType = this.getSwiftType(token.category, platformValue.unit);
    return this.formatSwiftConstant(tokenName, platformValue.value, platformValue.unit, swiftType);
  }

  generateHeader(metadata?: FileMetadata): string {
    const timestamp = metadata?.generatedAt?.toISOString() || new Date().toISOString();
    const version = metadata?.version || '1.0.0';

    return [
      '///',
      '/// DesignerPunk Design System - iOS Tokens',
      `/// Generated: ${timestamp}`,
      `/// Version: ${version}`,
      '/// Platform: iOS (Swift Constants)',
      '///',
      '',
      'import UIKit',
      '',
      'public struct DesignTokens {'
    ].join('\n');
  }

  generateFooter(): string {
    return '}';
  }

  validateSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Basic Swift validation
    if (!content.includes('public struct DesignTokens')) {
      errors.push('Missing DesignTokens struct declaration');
    }

    if (!content.includes('import UIKit')) {
      errors.push('Missing UIKit import');
    }

    // Check for balanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces in Swift');
    }

    // Check for proper constant declarations
    if (!content.match(/public static let \w+:/)) {
      errors.push('No Swift constant declarations found');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  getTokenName(tokenName: string, category: string): string {
    // Convert to lowerCamelCase for Swift
    // e.g., "space100" -> "space100", "fontSize125" -> "fontSize125"
    // Ensure first character is lowercase
    return tokenName.charAt(0).toLowerCase() + tokenName.slice(1);
  }

  private formatSwiftConstant(name: string, value: number | string | object, unit: string, swiftType: string): string {
    const formattedValue = this.formatSwiftValue(value, unit, swiftType);
    return `    public static let ${name}: ${swiftType} = ${formattedValue}`;
  }

  private getSwiftType(category: string, unit: string): string {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
      case 'fontSize':
        return 'CGFloat';
      case 'lineHeight':
      case 'density':
        return 'CGFloat';
      case 'fontFamily':
        return 'String';
      case 'fontWeight':
        return 'UIFont.Weight';
      case 'letterSpacing':
        return 'CGFloat';
      case 'color':
        return 'UIColor';
      default:
        return 'CGFloat';
    }
  }

  private formatSwiftValue(value: number | string | object, unit: string, swiftType: string): string {
    if (typeof value === 'object') {
      // For color tokens with mode/theme structure, generate UIColor.dynamicColor
      return this.formatDynamicColor(value);
    }

    if (typeof value === 'string') {
      if (swiftType === 'UIFont.Weight') {
        return this.formatFontWeight(value);
      }
      return `"${value}"`;
    }

    // Numeric values
    switch (unit) {
      case 'pt':
        return String(value);
      case 'unitless':
        return String(value);
      case 'em':
        return String(value);
      default:
        return String(value);
    }
  }

  private formatFontWeight(weight: string | number): string {
    // Map numeric weights to UIFont.Weight constants
    const weightValue = typeof weight === 'string' ? parseInt(weight) : weight;
    
    switch (weightValue) {
      case 100: return '.ultraLight';
      case 200: return '.thin';
      case 300: return '.light';
      case 400: return '.regular';
      case 500: return '.medium';
      case 600: return '.semibold';
      case 700: return '.bold';
      case 800: return '.heavy';
      case 900: return '.black';
      default: return '.regular';
    }
  }

  private formatDynamicColor(colorValue: object): string {
    // For mode-aware colors, generate UIColor.dynamicColor
    // This is a placeholder - actual implementation would need the color structure
    return 'UIColor { traitCollection in /* dynamic color implementation */ }';
  }

  protected generateCategoryComment(category: string): string {
    return `\n    // MARK: - ${category.toUpperCase()} TOKENS`;
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    return `    /// ${token.mathematicalRelationship}`;
  }
}
