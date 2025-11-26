import { PrimitiveToken, SemanticToken } from '../types';
import { BaseFormatProvider, FileMetadata } from './FormatProvider';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { getPlatformTokenName } from '../naming/PlatformNamingRules';

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
    
    // For primitive tokens, use the platform value directly
    let platformValue;
    if ('platforms' in token && token.platforms) {
      platformValue = token.platforms.android;
    } else if ('primitiveTokens' in token && token.primitiveTokens) {
      // For semantic tokens, get the first resolved primitive token
      const primitiveToken = Object.values(token.primitiveTokens)[0];
      if (!primitiveToken) {
        throw new Error(`Semantic token ${token.name} has no resolved primitive tokens`);
      }
      platformValue = primitiveToken.platforms?.android;
    }

    if (!platformValue) {
      throw new Error(`Token ${token.name} has no Android platform value`);
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
    // Special handling for inset spacing tokens with numeric names
    // Convert "inset.050" -> "space_inset_050" (snake_case for Android)
    if (category === 'spacing' && tokenName.startsWith('inset.')) {
      const numericPart = tokenName.replace('inset.', '');
      return `space_inset_${numericPart}`;
    }
    
    // Use platform naming rules for consistent naming
    return getPlatformTokenName(tokenName, this.platform, category as any);
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
      case 'borderWidth':
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
      case 'layering':
        return 'Dp'; // Elevation tokens use Dp type
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
      case 'borderWidth':
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

  /**
   * Format a single-reference semantic token
   * Generates: val colorPrimary = purple300
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
    // getPlatformTokenName will handle dot notation conversion (e.g., 'color.primary' -> 'color_primary')
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    // Convert primitive reference to appropriate format
    const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
    
    // Add WCAG comment for accessibility tokens
    const wcagComment = this.getWCAGComment(semantic);
    
    if (this.outputFormat === 'kotlin') {
      const tokenLine = `    val ${semanticName} = ${primitiveRefName}`;
      return wcagComment ? `    ${wcagComment}\n${tokenLine}` : tokenLine;
    } else {
      // XML format - reference another resource
      const resourceType = this.getXMLResourceType(semantic.category);
      const tokenLine = `    <${resourceType} name="${semanticName}">@${resourceType}/${primitiveRefName}</${resourceType}>`;
      return wcagComment ? `    ${wcagComment}\n${tokenLine}` : tokenLine;
    }
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
   * Generates: val typographyBodyMd = Typography(fontSize = fontSize100, ...)
   */
  formatMultiReferenceToken(semantic: SemanticToken): string {
    // Get all primitive references except 'value' and 'default' which are for single-reference tokens
    const refs = Object.entries(semantic.primitiveReferences)
      .filter(([key]) => key !== 'value' && key !== 'default');
    
    if (refs.length === 0) {
      throw new Error(`Multi-reference semantic token ${semantic.name} has no primitive references`);
    }

    // Convert semantic token name to appropriate format using platform naming rules
    // getPlatformTokenName will handle dot notation conversion (e.g., 'typography.bodyMd' -> 'typography_body_md')
    const semanticName = this.getTokenName(semantic.name, semantic.category);
    
    if (this.outputFormat === 'kotlin') {
      // Generate Typography data class initialization format
      const parameters = refs.map(([key, primitiveRef]) => {
        const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
        return `${key} = ${primitiveRefName}`;
      }).join(', ');
      
      return `    val ${semanticName} = Typography(${parameters})`;
    } else {
      // XML doesn't support object literals, so we'll generate individual properties
      // This is a limitation of XML resources
      const properties = refs.map(([key, primitiveRef]) => {
        const primitiveRefName = this.getTokenName(primitiveRef, semantic.category);
        const resourceType = this.getXMLResourceType(semantic.category);
        return `    <${resourceType} name="${semanticName}_${key}">@${resourceType}/${primitiveRefName}</${resourceType}>`;
      }).join('\n');
      
      return properties;
    }
  }

  /**
   * Generate section header comment
   * Marks primitive vs semantic sections
   */
  generateSectionComment(section: 'primitive' | 'semantic'): string {
    const sectionTitle = section === 'primitive' 
      ? 'PRIMITIVE TOKENS\n    Mathematical foundation'
      : 'SEMANTIC TOKENS\n    Use these for UI development';
    
    if (this.outputFormat === 'kotlin') {
      return [
        '',
        '    // ============================================',
        `    // ${sectionTitle}`,
        '    // ============================================',
        ''
      ].join('\n');
    } else {
      return [
        '',
        '    <!-- ============================================',
        `         ${sectionTitle}`,
        '         ============================================ -->',
        ''
      ].join('\n');
    }
  }

  /**
   * Generate Jetpack Compose alpha modifier
   * Outputs: Modifier.alpha(0.48f)
   * 
   * @param opacityValue - Unitless opacity value (0.0 - 1.0)
   * @returns Jetpack Compose alpha modifier string
   */
  generateAlphaModifier(opacityValue: number): string {
    // Format number to preserve decimal places (1.0 instead of 1)
    const formattedValue = this.formatFloatValue(opacityValue);
    return `Modifier.alpha(${formattedValue}f)`;
  }

  /**
   * Generate Jetpack Compose Color.copy with alpha
   * Outputs: Color(0xFF6B50A4).copy(alpha = 0.48f)
   * 
   * @param colorHex - Hex color value (e.g., 0xFF6B50A4)
   * @param alpha - Unitless alpha value (0.0 - 1.0)
   * @returns Jetpack Compose Color with alpha string
   */
  generateColorWithAlpha(colorHex: string, alpha: number): string {
    // Format number to preserve decimal places (1.0 instead of 1)
    const formattedAlpha = this.formatFloatValue(alpha);
    return `Color(${colorHex}).copy(alpha = ${formattedAlpha}f)`;
  }

  /**
   * Generate Kotlin constant for opacity token
   * Outputs: const val OPACITY_600 = 0.48f
   * 
   * @param tokenName - Token name (e.g., 'opacity600')
   * @param opacityValue - Unitless opacity value (0.0 - 1.0)
   * @returns Kotlin constant declaration string
   */
  generateConstant(tokenName: string, opacityValue: number): string {
    // Convert camelCase or kebab-case to UPPER_SNAKE_CASE for Kotlin constants
    // Also add underscores between letters and numbers (opacity600 → OPACITY_600)
    const constantName = tokenName
      .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase to snake_case
      .replace(/([a-zA-Z])(\d)/g, '$1_$2') // Add underscore between letter and number
      .replace(/-/g, '_') // kebab-case to snake_case
      .toUpperCase();
    
    // Format number to preserve decimal places (1.0 instead of 1)
    const formattedValue = this.formatFloatValue(opacityValue);
    return `const val ${constantName} = ${formattedValue}f`;
  }

  /**
   * Format float value to preserve decimal places
   * Ensures 1.0 stays as "1.0" instead of "1"
   * 
   * @param value - Numeric value to format
   * @returns Formatted string with decimal places preserved
   */
  private formatFloatValue(value: number): string {
    // If the value is a whole number (0 or 1), ensure it has .0
    if (value === 0 || value === 1) {
      return value.toFixed(1);
    }
    // Otherwise, return the value as-is (JavaScript will handle decimal places)
    return String(value);
  }

  /**
   * Format elevation token for Android
   * Generates Kotlin constant with .dp suffix
   * 
   * @param tokenName - Token name (e.g., 'elevation.modal')
   * @param elevationValue - Elevation value in dp (e.g., 16)
   * @returns Kotlin constant declaration string
   * 
   * @example
   * ```typescript
   * formatElevationToken('elevation.modal', 16)
   * // Returns: "val elevation_modal = 16.dp"
   * ```
   */
  formatElevationToken(tokenName: string, elevationValue: number): string {
    // Convert dot notation to snake_case for Kotlin naming convention
    // elevation.modal → elevation_modal
    const snakeCaseName = tokenName.replace(/\./g, '_');
    
    if (this.outputFormat === 'kotlin') {
      // Kotlin format: val elevation_modal = 16.dp
      return `    val ${snakeCaseName} = ${elevationValue}.dp`;
    } else {
      // XML format: <dimen name="elevation_modal">16dp</dimen>
      return `    <dimen name="${snakeCaseName}">${elevationValue}dp</dimen>`;
    }
  }

  /**
   * Format icon size token with calculated value
   * Generates: val iconSize100 = 24.dp with formula and typography pairing comments
   * 
   * @param tokenName - Icon token name (e.g., 'icon.size100')
   * @param calculatedSize - Calculated icon size in dp
   * @param category - Token category
   * @param description - Token description with formula (optional)
   * @param context - Token context with typography pairing (optional)
   * @returns Kotlin constant declaration string with comments
   */
  formatIconSizeToken(
    tokenName: string,
    calculatedSize: number,
    category: string,
    description?: string,
    context?: string
  ): string {
    const kotlinName = this.getTokenName(tokenName, category);
    
    // Build comment with formula and typography pairing
    const comments: string[] = [];
    if (description) {
      comments.push(description);
    }
    if (context) {
      comments.push(`Pairs with: ${context}`);
    }
    
    if (this.outputFormat === 'kotlin') {
      if (comments.length > 0) {
        return `    val ${kotlinName} = ${calculatedSize}.dp // ${comments.join(' | ')}`;
      }
      return `    val ${kotlinName} = ${calculatedSize}.dp`;
    } else {
      // XML format with comment
      if (comments.length > 0) {
        return `    <!-- ${comments.join(' | ')} -->\n    <dimen name="${kotlinName}">${calculatedSize}dp</dimen>`;
      }
      return `    <dimen name="${kotlinName}">${calculatedSize}dp</dimen>`;
    }
  }

  /**
   * Generate accessibility tokens section for Android platform
   * Generates Kotlin constants for focus indicator tokens with WCAG comments
   * 
   * WCAG References:
   * - 2.4.7 Focus Visible (Level AA)
   * - 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
   * 
   * @returns Array of Kotlin constant declaration strings with WCAG comments
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
    lines.push('    // Focus Indicator Offset - WCAG 2.4.7 Focus Visible');
    lines.push('    val accessibilityFocusOffset = 2.dp');
    lines.push('');
    
    lines.push('    // Focus Indicator Width - WCAG 2.4.7 Focus Visible');
    lines.push('    val accessibilityFocusWidth = 2.dp');
    lines.push('');
    
    lines.push('    // Focus Indicator Color - WCAG 2.4.7 Focus Visible, 1.4.11 Non-text Contrast (3:1 minimum)');
    lines.push('    val accessibilityFocusColor = colorPrimary');
    lines.push('');
    
    // Add usage example comment
    lines.push('    // Usage Example:');
    lines.push('    // .border(');
    lines.push('    //     width = accessibilityFocusWidth,');
    lines.push('    //     color = accessibilityFocusColor,');
    lines.push('    //     shape = RoundedCornerShape(cornerRadius + accessibilityFocusOffset)');
    lines.push('    // )');
    
    return lines;
  }
}
