import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { getPlatformTokenName } from '../naming/PlatformNamingRules';

/**
 * iOS-specific format generator
 * Generates Swift constant declarations for iOS platform token usage
 */
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];

  formatToken(token: PrimitiveToken | SemanticToken): string {
    const tokenName = this.getTokenName(token.name, token.category);
    
    // Handle semantic-only tokens (like z-index tokens) that have direct values
    // These tokens have a 'value' property and 'platforms' array but no 'primitiveReferences'
    if ('value' in token && typeof token.value === 'number' && 
        'platforms' in token && Array.isArray(token.platforms)) {
      // This is a semantic-only token with a direct value (e.g., z-index tokens)
      let value = token.value;
      
      // For z-index tokens, scale down values (divide by 100) for SwiftUI conventions
      // Web uses 100, 200, 300... but iOS uses 1, 2, 3...
      if (token.category === 'layering') {
        value = token.value / 100;
      }
      
      const swiftType = this.getSwiftType(token.category, 'unitless');
      return this.formatSwiftConstant(tokenName, value, 'unitless', swiftType);
    }
    
    // Check if this is a primitive token (has 'baseValue' property)
    const isPrimitiveToken = 'baseValue' in token;
    
    // For semantic tokens, use the resolved primitive token's platform value
    let platformValue;
    if (isPrimitiveToken) {
      // This is a primitive token
      const primitiveToken = token as PrimitiveToken;
      platformValue = primitiveToken.platforms.ios;
    } else {
      // This is a semantic token - get the first resolved primitive token
      const semanticToken = token as SemanticToken;
      const primitiveToken = semanticToken.primitiveTokens ? Object.values(semanticToken.primitiveTokens)[0] : null;
      if (!primitiveToken) {
        throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
      }
      platformValue = primitiveToken.platforms.ios;
    }
    
    if (!platformValue) {
      throw new Error(`Token ${token.name} has no iOS platform value`);
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
    // Special handling for inset spacing tokens with numeric names
    // Convert "inset.050" -> "spaceInset050"
    if (category === 'spacing' && tokenName.startsWith('inset.')) {
      const numericPart = tokenName.replace('inset.', '');
      return `spaceInset${numericPart}`;
    }
    
    // Use platform naming rules for consistent naming
    return getPlatformTokenName(tokenName, this.platform, category as any);
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
      case 'borderWidth':
        return 'CGFloat';
      case 'layering':
        return 'CGFloat';
      default:
        return 'CGFloat';
    }
  }

  private formatSwiftValue(value: number | string | object, unit: string, swiftType: string): string {
    if (typeof value === 'object') {
      // For color tokens with mode/theme structure, generate UIColor
      return this.formatUIColor(value);
    }

    if (typeof value === 'string') {
      // Check if it's an RGBA string - convert to UIColor format
      if (value.startsWith('rgba(')) {
        return this.rgbaStringToUIColor(value);
      }
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
   * Convert an RGBA string to UIColor format
   * Input: 'rgba(184, 182, 200, 1)'
   * Output: 'UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 1.0)'
   * 
   * @param rgbaString - RGBA color string
   * @returns UIColor initialization string
   */
  rgbaStringToUIColor(rgbaString: string): string {
    const parsed = this.parseRgbaString(rgbaString);
    if (!parsed) {
      return `UIColor.clear /* Invalid RGBA: ${rgbaString} */`;
    }
    
    // Convert 0-255 RGB values to 0-1 range for UIColor
    const red = (parsed.r / 255).toFixed(2);
    const green = (parsed.g / 255).toFixed(2);
    const blue = (parsed.b / 255).toFixed(2);
    const alpha = parsed.a.toFixed(2);
    
    return `UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha})`;
  }

  /**
   * Format a mode-aware color object to UIColor
   * Extracts light/base value and converts to UIColor format
   * 
   * @param colorValue - Mode-aware color object
   * @returns UIColor initialization string
   */
  private formatUIColor(colorValue: object): string {
    const modeAware = colorValue as { light?: { base?: string }; dark?: { base?: string } };
    
    // Extract the light/base RGBA value
    if (modeAware.light?.base) {
      return this.rgbaStringToUIColor(modeAware.light.base);
    }
    
    // Fallback for unknown structures
    return 'UIColor { traitCollection in /* dynamic color implementation */ }';
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

  protected generateCategoryComment(category: string): string {
    return `\n    // MARK: - ${category.toUpperCase()} TOKENS`;
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    return `    /// ${token.mathematicalRelationship}`;
  }

  /**
   * Format a single-reference semantic token
   * Generates: static let colorPrimary = purple300
   * For baked-in RGBA values: static let colorStructureBorderSubtle: UIColor = UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 0.48)
   */
  formatSingleReferenceToken(semantic: SemanticToken): string {
    // Get the primitive reference name (e.g., 'purple300' from primitiveReferences)
    const primitiveRef = semantic.primitiveReferences.value || 
                         semantic.primitiveReferences.default ||
                         Object.values(semantic.primitiveReferences)[0];
    
    if (!primitiveRef) {
      throw new Error(`Semantic token ${semantic.name} has no primitive reference`);
    }

    // Convert semantic token name to appropriate format using platform naming rules
    // getPlatformTokenName will handle dot notation conversion (e.g., 'color.primary' -> 'colorPrimary')
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    // Check if the primitive reference is a baked-in RGBA value
    if (typeof primitiveRef === 'string' && primitiveRef.startsWith('rgba(')) {
      // Baked-in RGBA value - convert to UIColor format
      const uiColorValue = this.rgbaStringToUIColor(primitiveRef);
      const wcagComment = this.getWCAGComment(semantic);
      const tokenLine = `    public static let ${semanticName}: UIColor = ${uiColorValue}`;
      return wcagComment ? `    ${wcagComment}\n${tokenLine}` : tokenLine;
    }
    
    // Convert primitive reference to appropriate format
    const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
    
    // Add WCAG comment for accessibility tokens
    const wcagComment = this.getWCAGComment(semantic);
    const tokenLine = `    public static let ${semanticName} = ${primitiveRefName}`;
    
    return wcagComment ? `    ${wcagComment}\n${tokenLine}` : tokenLine;
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
    return `// WCAG ${wcagCriterion}${criterionName ? ` ${criterionName}` : ''}`;
  }

  /**
   * Format a multi-reference semantic token (typography)
   * Generates: static let typographyBodyMd = Typography(fontSize: fontSize100, ...)
   */
  formatMultiReferenceToken(semantic: SemanticToken): string {
    // Get all primitive references except 'value' and 'default' which are for single-reference tokens
    const refs = Object.entries(semantic.primitiveReferences)
      .filter(([key]) => key !== 'value' && key !== 'default');
    
    if (refs.length === 0) {
      throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
    }

    // Convert semantic token name to appropriate format using platform naming rules
    // getPlatformTokenName will handle dot notation conversion (e.g., 'typography.bodyMd' -> 'typographyBodyMd')
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    // Generate Typography struct initialization format
    const parameters = refs.map(([key, primitiveRef]) => {
      const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
      return `${key}: ${primitiveRefName}`;
    }).join(', ');
    
    return `    public static let ${semanticName} = Typography(${parameters})`;
  }

  /**
   * Generate section header comment
   * Marks primitive vs semantic sections
   */
  generateSectionComment(section: 'primitive' | 'semantic'): string {
    const sectionTitle = section === 'primitive' 
      ? 'PRIMITIVE TOKENS\n    /// Mathematical foundation'
      : 'SEMANTIC TOKENS\n    /// Use these for UI development';
    
    return [
      '',
      '    // ============================================',
      `    // ${sectionTitle}`,
      '    // ============================================',
      ''
    ].join('\n');
  }

  /**
   * Generate SwiftUI opacity modifier
   * Outputs: .opacity(0.48)
   * 
   * @param opacityValue - Opacity value (0.0 - 1.0)
   * @returns SwiftUI opacity modifier string
   */
  generateOpacityModifier(opacityValue: number): string {
    return `.opacity(${opacityValue})`;
  }

  /**
   * Generate SwiftUI Color with opacity parameter
   * Outputs: Color(red: r, green: g, blue: b, opacity: 0.48)
   * 
   * @param r - Red channel (0.0 - 1.0)
   * @param g - Green channel (0.0 - 1.0)
   * @param b - Blue channel (0.0 - 1.0)
   * @param opacity - Opacity value (0.0 - 1.0)
   * @returns SwiftUI Color with opacity string
   */
  generateColorWithOpacity(r: number, g: number, b: number, opacity: number): string {
    return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${opacity})`;
  }

  /**
   * Generate Swift constant for opacity token
   * Outputs: static let opacity600 = 0.48
   * 
   * @param tokenName - Opacity token name (e.g., 'opacity600')
   * @param opacityValue - Opacity value (0.0 - 1.0)
   * @returns Swift constant declaration string
   */
  generateConstant(tokenName: string, opacityValue: number): string {
    return `static let ${tokenName} = ${opacityValue}`;
  }

  /**
   * Format icon size token with calculated value
   * Generates: public static let iconSize100: CGFloat = 24 with formula and typography pairing comments
   * 
   * @param tokenName - Icon token name (e.g., 'icon.size100')
   * @param calculatedSize - Calculated icon size in points
   * @param category - Token category
   * @param description - Token description with formula (optional)
   * @param context - Token context with typography pairing (optional)
   * @returns Swift constant declaration string with comments
   */
  formatIconSizeToken(
    tokenName: string,
    calculatedSize: number,
    category: string,
    description?: string,
    context?: string
  ): string {
    const swiftName = this.getTokenName(tokenName, category);
    
    // Build comment with formula and typography pairing
    const comments: string[] = [];
    if (description) {
      comments.push(description);
    }
    if (context) {
      comments.push(`Pairs with: ${context}`);
    }
    
    if (comments.length > 0) {
      return `    public static let ${swiftName}: CGFloat = ${calculatedSize} // ${comments.join(' | ')}`;
    }
    
    return `    public static let ${swiftName}: CGFloat = ${calculatedSize}`;
  }

  /**
   * Generate accessibility tokens section for iOS platform
   * Generates Swift constants for focus indicator tokens with WCAG comments
   * 
   * WCAG References:
   * - 2.4.7 Focus Visible (Level AA)
   * - 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
   * 
   * @returns Array of Swift constant declaration strings with WCAG comments
   */
  generateAccessibilityTokens(): string[] {
    const lines: string[] = [];
    
    // Add section header with WCAG guidance
    lines.push('');
    lines.push('    // ============================================');
    lines.push('    // ACCESSIBILITY TOKENS');
    lines.push('    // Focus Indicators for Keyboard Navigation');
    lines.push('    // WCAG 2.4.7 Focus Visible (Level AA)');
    lines.push('    // WCAG 1.4.11 Non-text Contrast (Level AA)');
    lines.push('    // ============================================');
    lines.push('');
    
    // Focus indicator tokens with WCAG comments
    lines.push('    /// Focus Indicator Offset - WCAG 2.4.7 Focus Visible');
    lines.push('    public static let accessibilityFocusOffset: CGFloat = 2');
    lines.push('');
    
    lines.push('    /// Focus Indicator Width - WCAG 2.4.7 Focus Visible');
    lines.push('    public static let accessibilityFocusWidth: CGFloat = 2');
    lines.push('');
    
    lines.push('    /// Focus Indicator Color - WCAG 2.4.7 Focus Visible, 1.4.11 Non-text Contrast (3:1 minimum)');
    lines.push('    public static let accessibilityFocusColor: Color = .primary');
    lines.push('');
    
    // Add usage example comment
    lines.push('    /// Usage Example:');
    lines.push('    /// .overlay(');
    lines.push('    ///     RoundedRectangle(cornerRadius: cornerRadius + accessibilityFocusOffset)');
    lines.push('    ///         .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)');
    lines.push('    ///         .padding(-accessibilityFocusOffset)');
    lines.push('    /// )');
    
    return lines;
  }
}
