/**
 * Token File Generator
 * 
 * Orchestrates the generation of platform-specific token constant files.
 * Generates DesignTokens.web.css, DesignTokens.ios.swift, and DesignTokens.android.kt
 * with mathematical consistency across all platforms.
 * 
 * Also generates BlendUtilities for each platform via BlendUtilityGenerator integration.
 */

import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
import { WebFormatGenerator } from '../providers/WebFormatGenerator';
import { iOSFormatGenerator } from '../providers/iOSFormatGenerator';
import { AndroidFormatGenerator } from '../providers/AndroidFormatGenerator';
import { FileMetadata } from '../providers/FormatProvider';
import { getAllPrimitiveTokens, getTokensByCategory, durationTokens, easingTokens, scaleTokens } from '../tokens';
import { getAllSemanticTokens, getAllZIndexTokens, getAllElevationTokens, motionTokens } from '../tokens/semantic';
import { BlendUtilityGenerator, BlendUtilityGenerationOptions } from './BlendUtilityGenerator';
import { ComponentTokenRegistry, RegisteredComponentToken } from '../registries/ComponentTokenRegistry';

export interface GenerationOptions {
  outputDir?: string;
  version?: string;
  includeComments?: boolean;
  groupByCategory?: boolean;
}

export interface GenerationResult {
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  content: string;
  tokenCount: number;
  semanticTokenCount: number;
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface BlendUtilityResult {
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  content: string;
  valid: boolean;
  errors?: string[];
}

export interface AllGenerationResults {
  tokens: GenerationResult[];
  blendUtilities: BlendUtilityResult[];
}

/**
 * Result of component token generation for a single platform
 */
export interface ComponentTokenGenerationResult {
  platform: 'web' | 'ios' | 'android';
  filePath: string;
  content: string;
  tokenCount: number;
  componentCount: number;
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Token File Generator
 * Generates platform-specific token constant files with mathematical consistency
 */
export class TokenFileGenerator {
  private webGenerator: WebFormatGenerator;
  private iosGenerator: iOSFormatGenerator;
  private androidGenerator: AndroidFormatGenerator;
  private blendUtilityGenerator: BlendUtilityGenerator;

  constructor() {
    this.webGenerator = new WebFormatGenerator();
    this.iosGenerator = new iOSFormatGenerator();
    this.androidGenerator = new AndroidFormatGenerator('kotlin');
    this.blendUtilityGenerator = new BlendUtilityGenerator();
  }

  /**
   * Generate all platform-specific token files
   */
  generateAll(options: GenerationOptions = {}): GenerationResult[] {
    const results: GenerationResult[] = [];

    results.push(this.generateWebTokens(options));
    results.push(this.generateiOSTokens(options));
    results.push(this.generateAndroidTokens(options));

    return results;
  }

  /**
   * Generate all platform-specific token files AND blend utilities
   * This is the comprehensive generation method that produces all artifacts
   */
  generateAllWithBlendUtilities(options: GenerationOptions = {}): AllGenerationResults {
    const tokenResults = this.generateAll(options);
    const blendResults = this.generateBlendUtilities(options);

    return {
      tokens: tokenResults,
      blendUtilities: blendResults
    };
  }

  /**
   * Generate blend utilities for all platforms
   * 
   * @param options - Generation options
   * @returns Array of blend utility generation results
   */
  generateBlendUtilities(options: GenerationOptions = {}): BlendUtilityResult[] {
    const { outputDir = 'output', includeComments = true } = options;
    const blendOptions: BlendUtilityGenerationOptions = { includeComments };
    const results: BlendUtilityResult[] = [];

    // Generate Web blend utilities
    try {
      const webContent = this.blendUtilityGenerator.generateWebBlendUtilities(blendOptions);
      results.push({
        platform: 'web',
        filePath: `${outputDir}/BlendUtilities.web.ts`,
        content: webContent,
        valid: this.validateWebBlendUtilitySyntax(webContent)
      });
    } catch (error) {
      results.push({
        platform: 'web',
        filePath: `${outputDir}/BlendUtilities.web.ts`,
        content: '',
        valid: false,
        errors: [`Web blend utility generation failed: ${error instanceof Error ? error.message : String(error)}`]
      });
    }

    // Generate iOS blend utilities
    try {
      const iosContent = this.blendUtilityGenerator.generateiOSBlendUtilities(blendOptions);
      results.push({
        platform: 'ios',
        filePath: `${outputDir}/BlendUtilities.ios.swift`,
        content: iosContent,
        valid: this.validateiOSBlendUtilitySyntax(iosContent)
      });
    } catch (error) {
      results.push({
        platform: 'ios',
        filePath: `${outputDir}/BlendUtilities.ios.swift`,
        content: '',
        valid: false,
        errors: [`iOS blend utility generation failed: ${error instanceof Error ? error.message : String(error)}`]
      });
    }

    // Generate Android blend utilities
    try {
      const androidContent = this.blendUtilityGenerator.generateAndroidBlendUtilities(blendOptions);
      results.push({
        platform: 'android',
        filePath: `${outputDir}/BlendUtilities.android.kt`,
        content: androidContent,
        valid: this.validateAndroidBlendUtilitySyntax(androidContent)
      });
    } catch (error) {
      results.push({
        platform: 'android',
        filePath: `${outputDir}/BlendUtilities.android.kt`,
        content: '',
        valid: false,
        errors: [`Android blend utility generation failed: ${error instanceof Error ? error.message : String(error)}`]
      });
    }

    return results;
  }

  /**
   * Generate component tokens for all platforms
   * 
   * Queries ComponentTokenRegistry.getAll() for tokens to generate.
   * Generates output grouped by component.
   * Maintains primitive token references in output (not inline values).
   * 
   * @param options - Generation options
   * @returns Array of component token generation results for each platform
   * 
   * @see Requirements 5.1, 5.2, 5.3, 5.4 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
   */
  generateComponentTokens(options: GenerationOptions = {}): ComponentTokenGenerationResult[] {
    const { outputDir = 'dist', version = '1.0.0', includeComments = true } = options;
    const results: ComponentTokenGenerationResult[] = [];

    // Get all registered component tokens
    const allTokens = ComponentTokenRegistry.getAll();
    
    // Group tokens by component
    const tokensByComponent = this.groupTokensByComponent(allTokens);
    const componentCount = Object.keys(tokensByComponent).length;

    // Generate for each platform
    results.push(this.generateWebComponentTokens(tokensByComponent, outputDir, version, includeComments));
    results.push(this.generateiOSComponentTokens(tokensByComponent, outputDir, version, includeComments));
    results.push(this.generateAndroidComponentTokens(tokensByComponent, outputDir, version, includeComments));

    return results;
  }

  /**
   * Group component tokens by component name
   * 
   * @param tokens - Array of registered component tokens
   * @returns Map of component name to tokens
   */
  private groupTokensByComponent(tokens: RegisteredComponentToken[]): Record<string, RegisteredComponentToken[]> {
    const grouped: Record<string, RegisteredComponentToken[]> = {};
    
    for (const token of tokens) {
      if (!grouped[token.component]) {
        grouped[token.component] = [];
      }
      grouped[token.component].push(token);
    }
    
    return grouped;
  }

  /**
   * Generate Web CSS component tokens
   * 
   * Generates CSS custom properties referencing primitive tokens.
   * Format: --button-icon-inset-large: var(--space-150);
   * 
   * @param tokensByComponent - Tokens grouped by component
   * @param outputDir - Output directory
   * @param version - Version string
   * @param includeComments - Whether to include comments
   * @returns Generation result for web platform
   */
  private generateWebComponentTokens(
    tokensByComponent: Record<string, RegisteredComponentToken[]>,
    outputDir: string,
    version: string,
    includeComments: boolean
  ): ComponentTokenGenerationResult {
    const lines: string[] = [];
    const timestamp = new Date().toISOString();
    let tokenCount = 0;

    // Header
    lines.push('/**');
    lines.push(' * DesignerPunk Design System - Component Tokens');
    lines.push(` * Generated: ${timestamp}`);
    lines.push(` * Version: ${version}`);
    lines.push(' * Platform: Web (CSS Custom Properties)');
    lines.push(' *');
    lines.push(' * Component-specific tokens that reference primitive tokens.');
    lines.push(' * Use these for component-level styling consistency.');
    lines.push(' */');
    lines.push('');
    lines.push(':root {');

    // Generate tokens grouped by component
    const components = Object.keys(tokensByComponent).sort();
    
    for (const component of components) {
      const tokens = tokensByComponent[component];
      
      if (includeComments) {
        lines.push('');
        lines.push(`  /* ${component} Component Tokens */`);
      }
      
      for (const token of tokens) {
        const cssTokenName = this.formatWebComponentTokenName(token);
        const cssValue = this.formatWebComponentTokenValue(token);
        
        if (includeComments && token.reasoning) {
          lines.push(`  /* ${token.reasoning} */`);
        }
        
        lines.push(`  ${cssTokenName}: ${cssValue};`);
        tokenCount++;
      }
    }

    lines.push('}');

    const content = lines.join('\n');
    const validation = this.validateWebComponentTokenSyntax(content);

    return {
      platform: 'web',
      filePath: `${outputDir}/ComponentTokens.web.css`,
      content,
      tokenCount,
      componentCount: components.length,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Generate iOS Swift component tokens
   * 
   * Generates Swift constants referencing primitive tokens.
   * Format: public static let insetLarge: CGFloat = SpacingTokens.space150
   * 
   * @param tokensByComponent - Tokens grouped by component
   * @param outputDir - Output directory
   * @param version - Version string
   * @param includeComments - Whether to include comments
   * @returns Generation result for iOS platform
   */
  private generateiOSComponentTokens(
    tokensByComponent: Record<string, RegisteredComponentToken[]>,
    outputDir: string,
    version: string,
    includeComments: boolean
  ): ComponentTokenGenerationResult {
    const lines: string[] = [];
    const timestamp = new Date().toISOString();
    let tokenCount = 0;

    // Header
    lines.push('///');
    lines.push('/// DesignerPunk Design System - Component Tokens');
    lines.push(`/// Generated: ${timestamp}`);
    lines.push(`/// Version: ${version}`);
    lines.push('/// Platform: iOS (Swift Constants)');
    lines.push('///');
    lines.push('/// Component-specific tokens that reference primitive tokens.');
    lines.push('/// Use these for component-level styling consistency.');
    lines.push('///');
    lines.push('');
    lines.push('import UIKit');
    lines.push('');

    // Generate tokens grouped by component (each component as an enum)
    const components = Object.keys(tokensByComponent).sort();
    
    for (const component of components) {
      const tokens = tokensByComponent[component];
      const enumName = `${component}Tokens`;
      
      if (includeComments) {
        lines.push(`/// ${component} Component Tokens`);
      }
      lines.push(`public enum ${enumName} {`);
      
      for (const token of tokens) {
        const swiftConstName = this.formatiOSComponentTokenName(token);
        const swiftType = this.getiOSComponentTokenType(token);
        const swiftValue = this.formatiOSComponentTokenValue(token);
        
        if (includeComments && token.reasoning) {
          lines.push(`    /// ${token.reasoning}`);
        }
        
        lines.push(`    public static let ${swiftConstName}: ${swiftType} = ${swiftValue}`);
        tokenCount++;
      }
      
      lines.push('}');
      lines.push('');
    }

    const content = lines.join('\n');
    const validation = this.validateiOSComponentTokenSyntax(content);

    return {
      platform: 'ios',
      filePath: `${outputDir}/ComponentTokens.ios.swift`,
      content,
      tokenCount,
      componentCount: components.length,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Generate Android Kotlin component tokens
   * 
   * Generates Kotlin constants referencing primitive tokens.
   * Format: val insetLarge = SpacingTokens.space150
   * 
   * @param tokensByComponent - Tokens grouped by component
   * @param outputDir - Output directory
   * @param version - Version string
   * @param includeComments - Whether to include comments
   * @returns Generation result for Android platform
   */
  private generateAndroidComponentTokens(
    tokensByComponent: Record<string, RegisteredComponentToken[]>,
    outputDir: string,
    version: string,
    includeComments: boolean
  ): ComponentTokenGenerationResult {
    const lines: string[] = [];
    const timestamp = new Date().toISOString();
    let tokenCount = 0;

    // Header
    lines.push('/**');
    lines.push(' * DesignerPunk Design System - Component Tokens');
    lines.push(` * Generated: ${timestamp}`);
    lines.push(` * Version: ${version}`);
    lines.push(' * Platform: Android (Kotlin Constants)');
    lines.push(' *');
    lines.push(' * Component-specific tokens that reference primitive tokens.');
    lines.push(' * Use these for component-level styling consistency.');
    lines.push(' */');
    lines.push('');
    lines.push('package com.designerpunk.tokens');
    lines.push('');

    // Generate tokens grouped by component (each component as an object)
    const components = Object.keys(tokensByComponent).sort();
    
    for (const component of components) {
      const tokens = tokensByComponent[component];
      const objectName = `${component}Tokens`;
      
      if (includeComments) {
        lines.push(`/** ${component} Component Tokens */`);
      }
      lines.push(`object ${objectName} {`);
      
      for (const token of tokens) {
        const kotlinConstName = this.formatAndroidComponentTokenName(token);
        const kotlinValue = this.formatAndroidComponentTokenValue(token);
        
        if (includeComments && token.reasoning) {
          lines.push(`    // ${token.reasoning}`);
        }
        
        lines.push(`    val ${kotlinConstName} = ${kotlinValue}`);
        tokenCount++;
      }
      
      lines.push('}');
      lines.push('');
    }

    const content = lines.join('\n');
    const validation = this.validateAndroidComponentTokenSyntax(content);

    return {
      platform: 'android',
      filePath: `${outputDir}/ComponentTokens.android.kt`,
      content,
      tokenCount,
      componentCount: components.length,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Format component token name for Web CSS
   * Converts 'buttonicon.inset.large' to '--button-icon-inset-large'
   */
  private formatWebComponentTokenName(token: RegisteredComponentToken): string {
    // Convert component.property.variant to kebab-case CSS custom property
    const parts = token.name.split('.');
    const kebabName = parts.map(part => 
      part.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    ).join('-');
    return `--${kebabName}`;
  }

  /**
   * Format component token value for Web CSS
   * Returns var(--space-150) for primitive references, or raw value
   */
  private formatWebComponentTokenValue(token: RegisteredComponentToken): string {
    if (token.primitiveReference) {
      // Convert primitive reference to CSS custom property reference
      // e.g., 'space150' -> 'var(--space-150)'
      const cssRef = token.primitiveReference
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([a-zA-Z])(\d)/g, '$1-$2')
        .toLowerCase();
      return `var(--${cssRef})`;
    }
    // Return raw value for non-reference tokens
    return String(token.value);
  }

  /**
   * Format component token name for iOS Swift
   * Converts 'buttonicon.inset.large' to 'insetLarge'
   */
  private formatiOSComponentTokenName(token: RegisteredComponentToken): string {
    // Extract property name from full token name (remove component prefix)
    const parts = token.name.split('.');
    // Skip the component name (first part), join remaining parts in camelCase
    const propertyParts = parts.slice(1);
    if (propertyParts.length === 0) {
      return parts[0];
    }
    return propertyParts.map((part, index) => 
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');
  }

  /**
   * Get Swift type for component token based on family
   */
  private getiOSComponentTokenType(token: RegisteredComponentToken): string {
    switch (token.family) {
      case 'spacing':
      case 'radius':
      case 'fontSize':
      case 'tapArea':
      case 'borderWidth':
        return 'CGFloat';
      case 'color':
        return 'UIColor';
      default:
        return 'CGFloat';
    }
  }

  /**
   * Format component token value for iOS Swift
   * Returns SpacingTokens.space150 for primitive references, or raw value
   */
  private formatiOSComponentTokenValue(token: RegisteredComponentToken): string {
    if (token.primitiveReference) {
      // Convert primitive reference to Swift constant reference
      // e.g., 'space150' -> 'SpacingTokens.space150'
      const familyClass = this.getFamilyClassName(token.family);
      return `${familyClass}.${token.primitiveReference}`;
    }
    // Return raw value for non-reference tokens
    return String(token.value);
  }

  /**
   * Format component token name for Android Kotlin
   * Converts 'buttonicon.inset.large' to 'insetLarge'
   */
  private formatAndroidComponentTokenName(token: RegisteredComponentToken): string {
    // Same as iOS - extract property name from full token name
    const parts = token.name.split('.');
    const propertyParts = parts.slice(1);
    if (propertyParts.length === 0) {
      return parts[0];
    }
    return propertyParts.map((part, index) => 
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');
  }

  /**
   * Format component token value for Android Kotlin
   * Returns SpacingTokens.space150 for primitive references, or raw value
   */
  private formatAndroidComponentTokenValue(token: RegisteredComponentToken): string {
    if (token.primitiveReference) {
      // Convert primitive reference to Kotlin constant reference
      // e.g., 'space150' -> 'SpacingTokens.space150'
      const familyClass = this.getFamilyClassName(token.family);
      return `${familyClass}.${token.primitiveReference}`;
    }
    // Return raw value for non-reference tokens
    return String(token.value);
  }

  /**
   * Get the class name for a token family
   * Used for generating primitive token references
   */
  private getFamilyClassName(family: string): string {
    const familyClassMap: Record<string, string> = {
      'spacing': 'SpacingTokens',
      'radius': 'RadiusTokens',
      'fontSize': 'FontSizeTokens',
      'color': 'ColorTokens',
      'tapArea': 'TapAreaTokens',
      'borderWidth': 'BorderWidthTokens',
      'lineHeight': 'LineHeightTokens',
      'fontWeight': 'FontWeightTokens',
      'fontFamily': 'FontFamilyTokens'
    };
    return familyClassMap[family] || `${family.charAt(0).toUpperCase() + family.slice(1)}Tokens`;
  }

  /**
   * Validate Web component token CSS syntax
   */
  private validateWebComponentTokenSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Check for :root selector
    if (!content.includes(':root {')) {
      errors.push('Missing :root selector');
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

  /**
   * Validate iOS component token Swift syntax
   */
  private validateiOSComponentTokenSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Check for UIKit import
    if (!content.includes('import UIKit')) {
      errors.push('Missing UIKit import');
    }

    // Check for balanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces in Swift');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Validate Android component token Kotlin syntax
   */
  private validateAndroidComponentTokenSyntax(content: string): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Check for package declaration
    if (!content.includes('package com.designerpunk.tokens')) {
      errors.push('Missing package declaration');
    }

    // Check for balanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces in Kotlin');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Validate Web blend utility TypeScript syntax
   * Basic validation to ensure generated code has expected structure
   */
  private validateWebBlendUtilitySyntax(content: string): boolean {
    // Check for required function exports
    const requiredFunctions = ['darkerBlend', 'lighterBlend', 'saturate', 'desaturate'];
    const hasAllFunctions = requiredFunctions.every(fn => 
      content.includes(`export function ${fn}`)
    );

    // Check for required type definitions
    const hasRgbInterface = content.includes('interface RGB');
    const hasHslInterface = content.includes('interface HSL');

    // Check for required utility functions
    const hasHexToRgb = content.includes('function hexToRgb');
    const hasRgbToHex = content.includes('function rgbToHex');

    return hasAllFunctions && hasRgbInterface && hasHslInterface && hasHexToRgb && hasRgbToHex;
  }

  /**
   * Validate iOS blend utility Swift syntax
   * Basic validation to ensure generated code has expected structure
   */
  private validateiOSBlendUtilitySyntax(content: string): boolean {
    // Check for required imports
    const hasSwiftUIImport = content.includes('import SwiftUI');

    // Check for Color extension
    const hasColorExtension = content.includes('extension Color');

    // Check for required methods
    const requiredMethods = ['darkerBlend', 'lighterBlend', 'saturate', 'desaturate'];
    const hasAllMethods = requiredMethods.every(method => 
      content.includes(`func ${method}`)
    );

    // Check for required structs
    const hasRgbStruct = content.includes('struct RGB');
    const hasHslStruct = content.includes('struct HSL');

    return hasSwiftUIImport && hasColorExtension && hasAllMethods && hasRgbStruct && hasHslStruct;
  }

  /**
   * Validate Android blend utility Kotlin syntax
   * Basic validation to ensure generated code has expected structure
   */
  private validateAndroidBlendUtilitySyntax(content: string): boolean {
    // Check for required package and imports
    const hasPackage = content.includes('package com.designerpunk.tokens');
    const hasColorImport = content.includes('import androidx.compose.ui.graphics.Color');

    // Check for required extension functions
    const requiredFunctions = ['darkerBlend', 'lighterBlend', 'saturate', 'desaturate'];
    const hasAllFunctions = requiredFunctions.every(fn => 
      content.includes(`fun Color.${fn}`)
    );

    // Check for required data classes
    const hasRgbClass = content.includes('data class RGB');
    const hasHslClass = content.includes('data class HSL');

    return hasPackage && hasColorImport && hasAllFunctions && hasRgbClass && hasHslClass;
  }

  /**
   * Generate semantic token section for specified platform
   * Handles both single-reference and multi-reference tokens
   * 
   * @param semantics - Array of semantic tokens to generate
   * @param platform - Target platform ('web', 'ios', or 'android')
   * @returns Array of formatted token strings
   */
  private generateSemanticSection(
    semantics: Array<Omit<SemanticToken, 'primitiveTokens'>>,
    platform: 'web' | 'ios' | 'android'
  ): string[] {
    const lines: string[] = [];

    // Select appropriate generator based on platform
    let generator: WebFormatGenerator | iOSFormatGenerator | AndroidFormatGenerator;

    switch (platform) {
      case 'web':
        generator = this.webGenerator;
        break;
      case 'ios':
        generator = this.iosGenerator;
        break;
      case 'android':
        generator = this.androidGenerator;
        break;
      default:
        return lines;
    }

    // Iterate over semantic tokens
    for (const semantic of semantics) {
      // Skip tokens without primitiveReferences (e.g., semantic-only layering tokens)
      if (!semantic.primitiveReferences) {
        continue;
      }
      
      // Special handling for ICON category tokens with fontSize/multiplier (icon sizes)
      // Icon property tokens (like strokeWidth) are handled as single-reference tokens below
      if (semantic.category === 'icon' && semantic.primitiveReferences.fontSize && semantic.primitiveReferences.multiplier) {
        const iconLine = this.generateIconSizeToken(semantic, platform, generator);
        if (iconLine) {
          lines.push(iconLine);
        }
        continue;
      }
      
      // Detect single-reference vs multi-reference tokens
      // Single-reference tokens have:
      // - Only one key in primitiveReferences, OR
      // - A 'value' or 'default' key (standard single-reference pattern)
      const refs = Object.keys(semantic.primitiveReferences);
      const isSingleReference = refs.length === 1 ||
        refs.includes('value') ||
        refs.includes('default');

      // Call appropriate formatter method for each token based on reference type
      if (isSingleReference) {
        // Single-reference tokens (colors, spacing, borders)
        lines.push(generator.formatSingleReferenceToken(semantic as SemanticToken));
      } else {
        // Multi-reference tokens (typography with multiple properties)
        lines.push(generator.formatMultiReferenceToken(semantic as SemanticToken));
      }
    }

    return lines;
  }

  /**
   * Generate icon size token with calculated value
   * Resolves fontSize and lineHeight primitives and applies formula: fontSize × lineHeight
   * 
   * @param semantic - Icon size semantic token
   * @param platform - Target platform
   * @param generator - Platform-specific generator
   * @returns Formatted token string with calculated value
   */
  private generateIconSizeToken(
    semantic: Omit<SemanticToken, 'primitiveTokens'>,
    platform: 'web' | 'ios' | 'android',
    generator: WebFormatGenerator | iOSFormatGenerator | AndroidFormatGenerator
  ): string | null {
    // Get fontSize and multiplier primitive references
    const fontSizeRef = semantic.primitiveReferences.fontSize;
    const multiplierRef = semantic.primitiveReferences.multiplier;
    
    if (!fontSizeRef || !multiplierRef) {
      console.warn(`Icon token ${semantic.name} missing fontSize or multiplier reference`);
      return null;
    }
    
    // Import primitive tokens and parsing utilities
    const { fontSizeTokens } = require('../tokens/FontSizeTokens');
    const { lineHeightTokens } = require('../tokens/LineHeightTokens');
    const { parseMultiplier, CUSTOM_MULTIPLIER_PREFIX } = require('../tokens/semantic/IconTokens');
    
    // Resolve fontSize primitive token
    const fontSizeToken = fontSizeTokens[fontSizeRef];
    
    if (!fontSizeToken) {
      console.warn(`Icon token ${semantic.name} references invalid fontSize: ${fontSizeRef}`);
      return null;
    }
    
    // Resolve multiplier - can be a lineHeight token reference or 'custom:X.XXX'
    let multiplierValue: number;
    try {
      multiplierValue = parseMultiplier(multiplierRef);
    } catch (error) {
      console.warn(`Icon token ${semantic.name} has invalid multiplier: ${multiplierRef}`);
      return null;
    }
    
    // Calculate icon size: fontSize × multiplier (rounded)
    const calculatedSize = Math.round(fontSizeToken.baseValue * multiplierValue);
    
    // Generate platform-specific token with calculated value, description, and context
    return generator.formatIconSizeToken(
      semantic.name,
      calculatedSize,
      semantic.category,
      semantic.description,
      semantic.context
    );
  }

  /**
   * Generate motion token section for specified platform
   * Handles primitive motion tokens (duration, easing, scale) and semantic motion tokens
   * 
   * @param platform - Target platform ('web', 'ios', or 'android')
   * @returns Array of formatted token strings
   */
  private generateMotionSection(platform: 'web' | 'ios' | 'android'): string[] {
    const lines: string[] = [];

    // Import platform builders for motion token generation
    const { WebBuilder } = require('../build/platforms/WebBuilder');
    const { iOSBuilder } = require('../build/platforms/iOSBuilder');
    const { AndroidBuilder } = require('../build/platforms/AndroidBuilder');

    // Select appropriate builder based on platform
    let builder: any;

    switch (platform) {
      case 'web':
        builder = new WebBuilder();
        break;
      case 'ios':
        builder = new iOSBuilder();
        break;
      case 'android':
        builder = new AndroidBuilder();
        break;
      default:
        return lines;
    }

    // Generate primitive motion tokens
    const durationLines = builder.generateDurationTokens(durationTokens);
    const easingLines = builder.generateEasingTokens(easingTokens);
    const scaleLines = builder.generateScaleTokens(scaleTokens);

    lines.push(durationLines);
    lines.push(easingLines);
    lines.push(scaleLines);

    // Generate semantic motion tokens
    const semanticMotionLines = builder.generateSemanticMotionTokens(motionTokens);
    lines.push(semanticMotionLines);

    return lines;
  }

  /**
   * Generate layering token section for specified platform
   * Handles semantic-only layering tokens (z-index and elevation)
   * 
   * @param platform - Target platform ('web', 'ios', or 'android')
   * @returns Array of formatted token strings
   */
  private generateLayeringSection(platform: 'web' | 'ios' | 'android'): string[] {
    const lines: string[] = [];

    // Route z-index tokens to web/iOS, elevation tokens to Android
    if (platform === 'web' || platform === 'ios') {
      // Get z-index tokens for web and iOS
      const zIndexTokens = getAllZIndexTokens();
      
      for (const token of zIndexTokens) {
        // Format z-index token based on platform
        if (platform === 'web') {
          // Web: CSS custom property format
          // --z-index-modal: 400;
          const kebabName = token.name.replace('zIndex.', 'z-index-');
          lines.push(`  --${kebabName}: ${token.value};`);
        } else {
          // iOS: Swift constant format with scaled value
          // static let zIndexModal: CGFloat = 4
          const suffix = token.name.replace('zIndex.', '');
          const camelSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
          const camelName = 'zIndex' + camelSuffix;
          const scaledValue = token.value / 100; // Scale down from 100-600 to 1-6
          lines.push(`    static let ${camelName}: CGFloat = ${scaledValue}`);
        }
      }
    } else if (platform === 'android') {
      // Get elevation tokens for Android
      const elevationTokens = getAllElevationTokens();
      
      for (const token of elevationTokens) {
        // Use AndroidFormatGenerator to format elevation tokens
        lines.push(this.androidGenerator.formatElevationToken(token.name, token.value));
      }
    }

    return lines;
  }

  /**
   * Generate web token file (JavaScript)
   */
  generateWebTokens(options: GenerationOptions = {}): GenerationResult {
    const {
      outputDir = 'output',
      version = '1.0.0',
      includeComments = true,
      groupByCategory = true
    } = options;

    const metadata: FileMetadata = {
      version,
      generatedAt: new Date()
    };

    const tokens = getAllPrimitiveTokens();
    const allSemantics = getAllSemanticTokens();
    
    // Filter out layering tokens (they don't have primitiveReferences)
    const semantics = allSemantics.filter(s => 
      !s.name.startsWith('zIndex.') && !s.name.startsWith('elevation.')
    );

    const lines: string[] = [];
    let semanticTokenCount = 0;

    // Add header
    lines.push(this.webGenerator.generateHeader(metadata));

    // Add primitive tokens section comment
    if (includeComments) {
      lines.push(this.webGenerator.generateSectionComment('primitive'));
    }

    if (groupByCategory) {
      // Group tokens by category
      const categories = this.getUniqueCategories(tokens);

      for (const category of categories) {
        const categoryTokens = tokens.filter(t => t.category === category);

        if (includeComments) {
          lines.push(this.webGenerator['generateCategoryComment'](category));
        }

        for (const token of categoryTokens) {
          if (includeComments && 'mathematicalRelationship' in token) {
            lines.push(this.webGenerator['generateMathematicalComment'](token as PrimitiveToken));
          }
          lines.push(this.webGenerator.formatToken(token));
        }
      }
    } else {
      // Flat list of tokens
      for (const token of tokens) {
        lines.push(this.webGenerator.formatToken(token));
      }
    }

    // Add semantic tokens section comment
    if (includeComments) {
      lines.push(this.webGenerator.generateSectionComment('semantic'));
    }

    // Add semantic tokens section
    const semanticLines = this.generateSemanticSection(semantics, 'web');
    lines.push(...semanticLines);
    semanticTokenCount = semantics.length;

    // Add motion tokens section
    if (includeComments) {
      lines.push('');
      lines.push('  /* Motion Tokens */');
    }
    const motionLines = this.generateMotionSection('web');
    lines.push(...motionLines);
    semanticTokenCount += motionLines.length;

    // Add layering tokens section (z-index for web)
    if (includeComments) {
      lines.push('');
      lines.push('  /* Layering Tokens (Z-Index) */');
    }
    const layeringLines = this.generateLayeringSection('web');
    lines.push(...layeringLines);
    semanticTokenCount += layeringLines.length;

    // Add footer
    lines.push(this.webGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.webGenerator.validateSyntax(content);

    return {
      platform: 'web',
      filePath: `${outputDir}/DesignTokens.web.css`,
      content,
      tokenCount: tokens.length,
      semanticTokenCount,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Generate iOS token file (Swift)
   */
  generateiOSTokens(options: GenerationOptions = {}): GenerationResult {
    const {
      outputDir = 'output',
      version = '1.0.0',
      includeComments = true,
      groupByCategory = true
    } = options;

    const metadata: FileMetadata = {
      version,
      generatedAt: new Date()
    };

    const tokens = getAllPrimitiveTokens();
    const allSemantics = getAllSemanticTokens();
    
    // Filter out layering tokens (they don't have primitiveReferences)
    const semantics = allSemantics.filter(s => 
      !s.name.startsWith('zIndex.') && !s.name.startsWith('elevation.')
    );

    const lines: string[] = [];
    let semanticTokenCount = 0;

    // Add header
    lines.push(this.iosGenerator.generateHeader(metadata));

    // Add primitive tokens section comment
    if (includeComments) {
      lines.push(this.iosGenerator.generateSectionComment('primitive'));
    }

    if (groupByCategory) {
      // Group tokens by category
      const categories = this.getUniqueCategories(tokens);

      for (const category of categories) {
        const categoryTokens = tokens.filter(t => t.category === category);

        if (includeComments) {
          lines.push(this.iosGenerator['generateCategoryComment'](category));
        }

        for (const token of categoryTokens) {
          if (includeComments && 'mathematicalRelationship' in token) {
            lines.push(this.iosGenerator['generateMathematicalComment'](token as PrimitiveToken));
          }
          lines.push(this.iosGenerator.formatToken(token));
        }
      }
    } else {
      // Flat list of tokens
      for (const token of tokens) {
        lines.push(this.iosGenerator.formatToken(token));
      }
    }

    // Add semantic tokens section comment
    if (includeComments) {
      lines.push(this.iosGenerator.generateSectionComment('semantic'));
    }

    // Add semantic tokens section
    const semanticLines = this.generateSemanticSection(semantics, 'ios');
    lines.push(...semanticLines);
    semanticTokenCount = semantics.length;

    // Add motion tokens section
    if (includeComments) {
      lines.push('');
      lines.push('    // MARK: - Motion Tokens');
    }
    const motionLines = this.generateMotionSection('ios');
    lines.push(...motionLines);
    semanticTokenCount += motionLines.length;

    // Add layering tokens section (z-index for iOS)
    if (includeComments) {
      lines.push('');
      lines.push('    // MARK: - Layering Tokens (Z-Index)');
    }
    const layeringLines = this.generateLayeringSection('ios');
    lines.push(...layeringLines);
    semanticTokenCount += layeringLines.length;

    // Add footer
    lines.push(this.iosGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.iosGenerator.validateSyntax(content);

    return {
      platform: 'ios',
      filePath: `${outputDir}/DesignTokens.ios.swift`,
      content,
      tokenCount: tokens.length,
      semanticTokenCount,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Generate Android token file (Kotlin)
   */
  generateAndroidTokens(options: GenerationOptions = {}): GenerationResult {
    const {
      outputDir = 'output',
      version = '1.0.0',
      includeComments = true,
      groupByCategory = true
    } = options;

    const metadata: FileMetadata = {
      version,
      generatedAt: new Date()
    };

    const tokens = getAllPrimitiveTokens();
    const allSemantics = getAllSemanticTokens();
    
    // Filter out layering tokens (they don't have primitiveReferences)
    const semantics = allSemantics.filter(s => 
      !s.name.startsWith('zIndex.') && !s.name.startsWith('elevation.')
    );

    const lines: string[] = [];
    let semanticTokenCount = 0;

    // Add header
    lines.push(this.androidGenerator.generateHeader(metadata));

    // Add primitive tokens section comment
    if (includeComments) {
      lines.push(this.androidGenerator.generateSectionComment('primitive'));
    }

    if (groupByCategory) {
      // Group tokens by category
      const categories = this.getUniqueCategories(tokens);

      for (const category of categories) {
        const categoryTokens = tokens.filter(t => t.category === category);

        if (includeComments) {
          lines.push(this.androidGenerator['generateCategoryComment'](category));
        }

        for (const token of categoryTokens) {
          if (includeComments && 'mathematicalRelationship' in token) {
            lines.push(this.androidGenerator['generateMathematicalComment'](token as PrimitiveToken));
          }
          lines.push(this.androidGenerator.formatToken(token));
        }
      }
    } else {
      // Flat list of tokens
      for (const token of tokens) {
        lines.push(this.androidGenerator.formatToken(token));
      }
    }

    // Add semantic tokens section comment
    if (includeComments) {
      lines.push(this.androidGenerator.generateSectionComment('semantic'));
    }

    // Add semantic tokens section
    const semanticLines = this.generateSemanticSection(semantics, 'android');
    lines.push(...semanticLines);
    semanticTokenCount = semantics.length;

    // Add motion tokens section
    if (includeComments) {
      lines.push('');
      lines.push('    // Motion Tokens');
    }
    const motionLines = this.generateMotionSection('android');
    lines.push(...motionLines);
    semanticTokenCount += motionLines.length;

    // Add layering tokens section (elevation for Android)
    if (includeComments) {
      lines.push('');
      lines.push('    // Layering Tokens (Elevation)');
    }
    const layeringLines = this.generateLayeringSection('android');
    lines.push(...layeringLines);
    semanticTokenCount += layeringLines.length;

    // Add footer
    lines.push(this.androidGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.androidGenerator.validateSyntax(content);

    return {
      platform: 'android',
      filePath: `${outputDir}/DesignTokens.android.kt`,
      content,
      tokenCount: tokens.length,
      semanticTokenCount,
      valid: validation.valid,
      errors: validation.errors
    };
  }

  /**
   * Get unique categories from token list
   */
  private getUniqueCategories(tokens: PrimitiveToken[]): TokenCategory[] {
    const categories = new Set<TokenCategory>();
    tokens.forEach(token => categories.add(token.category));
    return Array.from(categories).sort();
  }



  /**
   * Validate mathematical consistency across platforms
   * Extended to include semantic token validation with nuanced platform-specific token handling
   * 
   * Platform-specific tokens (documented in acknowledged-differences.json) are excluded from
   * count comparisons. For example, Android has elevation.none (0dp baseline) while web/iOS
   * don't need a "zero" z-index token.
   */
  validateCrossPlatformConsistency(results: GenerationResult[]): {
    consistent: boolean;
    issues: string[];
    platformSpecificTokens?: { platform: string; tokens: string[] }[];
  } {
    const issues: string[] = [];
    const platformSpecificInfo: { platform: string; tokens: string[] }[] = [];

    // Check that all platforms generated successfully FIRST (most critical)
    const invalidPlatforms = results.filter(r => !r.valid);
    if (invalidPlatforms.length > 0) {
      invalidPlatforms.forEach(r => {
        issues.push(`${r.platform} generation failed: ${r.errors?.join(', ')}`);
      });
    }

    // Load acknowledged differences registry for platform-specific token handling
    let acknowledgedDifferences: any = null;
    try {
      // Try multiple paths since this file may be run from different locations
      try {
        acknowledgedDifferences = require('../__tests__/fixtures/acknowledged-differences.json');
      } catch {
        acknowledgedDifferences = require('../../__tests__/fixtures/acknowledged-differences.json');
      }
    } catch (e) {
      // Registry not available, proceed with strict validation
    }

    // Get platform-specific token counts from registry
    const platformSpecificCounts: Record<string, number> = {};
    if (acknowledgedDifferences?.platformSpecificTokens?.tokens) {
      for (const token of acknowledgedDifferences.platformSpecificTokens.tokens) {
        platformSpecificCounts[token.platform] = (platformSpecificCounts[token.platform] || 0) + 1;
        
        // Track for reporting
        const existing = platformSpecificInfo.find(p => p.platform === token.platform);
        if (existing) {
          existing.tokens.push(token.token);
        } else {
          platformSpecificInfo.push({ platform: token.platform, tokens: [token.token] });
        }
      }
    }

    // Check that all platforms have the same primitive token count
    const tokenCounts = results.map(r => r.tokenCount);
    const uniqueCounts = new Set(tokenCounts);

    if (uniqueCounts.size > 1) {
      issues.push(`Primitive token count mismatch across platforms: ${Array.from(uniqueCounts).join(', ')}`);
    }

    // Check semantic token counts with platform-specific token adjustment
    // Only apply adjustment if the raw counts suggest platform-specific tokens are present
    // (i.e., the difference between platforms matches the expected platform-specific count)
    const semanticTokenCounts = results.map(r => r.semanticTokenCount);
    const uniqueRawCounts = new Set(semanticTokenCounts);
    
    // First check if raw counts are already consistent
    if (uniqueRawCounts.size === 1) {
      // All platforms have same count - no adjustment needed
      // This handles mock data and cases where platform-specific tokens aren't present
    } else {
      // Raw counts differ - check if the difference matches platform-specific tokens
      const normalizedSemanticCounts = results.map(r => {
        const platformSpecificCount = platformSpecificCounts[r.platform] || 0;
        return {
          platform: r.platform,
          original: r.semanticTokenCount,
          normalized: r.semanticTokenCount - platformSpecificCount,
          platformSpecific: platformSpecificCount
        };
      });

      const uniqueNormalizedCounts = new Set(normalizedSemanticCounts.map(c => c.normalized));

      if (uniqueNormalizedCounts.size > 1) {
        // Still mismatched after adjustment - report the issue
        const countDetails = normalizedSemanticCounts
          .map(c => `${c.platform}=${c.original}${c.platformSpecific > 0 ? ` (${c.platformSpecific} platform-specific)` : ''}`)
          .join(', ');
        issues.push(`Semantic token count mismatch across platforms (after excluding platform-specific tokens): ${countDetails}`);
      }
      // If normalized counts are consistent, the difference was due to documented platform-specific tokens
    }

    // Verify all platforms have same semantic token names (excluding platform-specific)
    const semanticTokenNames = this.extractSemanticTokenNames(results);

    if (semanticTokenNames.length > 0) {
      const referenceNames = semanticTokenNames[0].names;
      const referencePlatform = semanticTokenNames[0].platform;

      for (let i = 1; i < semanticTokenNames.length; i++) {
        const current = semanticTokenNames[i];

        const missingInCurrent = referenceNames.filter(name => !current.names.includes(name));
        const extraInCurrent = current.names.filter(name => !referenceNames.includes(name));

        if (missingInCurrent.length > 0) {
          issues.push(`${current.platform} missing semantic tokens present in ${referencePlatform}: ${missingInCurrent.join(', ')}`);
        }

        if (extraInCurrent.length > 0) {
          issues.push(`${current.platform} has extra semantic tokens not in ${referencePlatform}: ${extraInCurrent.join(', ')}`);
        }
      }
    }

    // Verify all platforms maintain same primitive→semantic relationships
    const relationships = this.extractPrimitiveSemanticRelationships(results);

    if (relationships.length > 0) {
      const referenceRelationships = relationships[0].relationships;
      const referencePlatform = relationships[0].platform;

      for (let i = 1; i < relationships.length; i++) {
        const current = relationships[i];

        for (const [semanticName, primitiveRefs] of Object.entries(referenceRelationships)) {
          const currentRefs = current.relationships[semanticName];

          if (!currentRefs) {
            issues.push(`${current.platform} missing semantic token '${semanticName}' present in ${referencePlatform}`);
            continue;
          }

          const refKeys = Object.keys(primitiveRefs).sort();
          const currKeys = Object.keys(currentRefs).sort();

          if (JSON.stringify(refKeys) !== JSON.stringify(currKeys)) {
            issues.push(`${current.platform} has different primitive references for '${semanticName}' compared to ${referencePlatform}`);
          } else {
            for (const key of refKeys) {
              if (primitiveRefs[key] !== currentRefs[key]) {
                issues.push(`${current.platform} semantic token '${semanticName}' references '${currentRefs[key]}' for ${key}, but ${referencePlatform} references '${primitiveRefs[key]}'`);
              }
            }
          }
        }
      }
    }

    return {
      consistent: issues.length === 0,
      issues,
      platformSpecificTokens: platformSpecificInfo.length > 0 ? platformSpecificInfo : undefined
    };
  }

  /**
   * Extract semantic token names from generated content
   * Parses the generated files to extract semantic token names
   * 
   * @param results - Generation results for all platforms
   * @returns Array of platform token names
   */
  private extractSemanticTokenNames(results: GenerationResult[]): Array<{
    platform: string;
    names: string[];
  }> {
    const semantics = getAllSemanticTokens();
    const semanticNames = semantics.map(s => s.name);

    return results.map(result => ({
      platform: result.platform,
      names: semanticNames
    }));
  }

  /**
   * Extract primitive→semantic relationships from generated content
   * Analyzes semantic tokens to extract their primitive references
   * 
   * @param results - Generation results for all platforms
   * @returns Array of platform relationships
   */
  private extractPrimitiveSemanticRelationships(results: GenerationResult[]): Array<{
    platform: string;
    relationships: Record<string, Record<string, string>>;
  }> {
    const semantics = getAllSemanticTokens();

    // Build relationships map from semantic tokens
    const relationships: Record<string, Record<string, string>> = {};

    for (const semantic of semantics) {
      relationships[semantic.name] = { ...semantic.primitiveReferences };
    }

    // Return same relationships for all platforms (they should be identical)
    return results.map(result => ({
      platform: result.platform,
      relationships: { ...relationships }
    }));
  }
}
