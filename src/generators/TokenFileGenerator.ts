/**
 * Token File Generator
 * 
 * Orchestrates the generation of platform-specific token constant files.
 * Generates DesignTokens.web.css, DesignTokens.ios.swift, and DesignTokens.android.kt
 * with mathematical consistency across all platforms.
 */

import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
import { WebFormatGenerator } from '../providers/WebFormatGenerator';
import { iOSFormatGenerator } from '../providers/iOSFormatGenerator';
import { AndroidFormatGenerator } from '../providers/AndroidFormatGenerator';
import { FileMetadata } from '../providers/FormatProvider';
import { getAllPrimitiveTokens, getTokensByCategory } from '../tokens';
import { getAllSemanticTokens, getAllZIndexTokens, getAllElevationTokens } from '../tokens/semantic';

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

/**
 * Token File Generator
 * Generates platform-specific token constant files with mathematical consistency
 */
export class TokenFileGenerator {
  private webGenerator: WebFormatGenerator;
  private iosGenerator: iOSFormatGenerator;
  private androidGenerator: AndroidFormatGenerator;

  constructor() {
    this.webGenerator = new WebFormatGenerator();
    this.iosGenerator = new iOSFormatGenerator();
    this.androidGenerator = new AndroidFormatGenerator('kotlin');
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
      
      // Special handling for ICON category tokens
      if (semantic.category === 'icon') {
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
    // Get fontSize and lineHeight primitive references
    const fontSizeRef = semantic.primitiveReferences.fontSize;
    const lineHeightRef = semantic.primitiveReferences.lineHeight;
    
    if (!fontSizeRef || !lineHeightRef) {
      console.warn(`Icon token ${semantic.name} missing fontSize or lineHeight reference`);
      return null;
    }
    
    // Import primitive tokens to resolve references
    const { fontSizeTokens } = require('../tokens/FontSizeTokens');
    const { lineHeightTokens } = require('../tokens/LineHeightTokens');
    
    // Resolve primitive tokens
    const fontSizeToken = fontSizeTokens[fontSizeRef];
    const lineHeightToken = lineHeightTokens[lineHeightRef];
    
    if (!fontSizeToken || !lineHeightToken) {
      console.warn(`Icon token ${semantic.name} references invalid primitives: ${fontSizeRef}, ${lineHeightRef}`);
      return null;
    }
    
    // Calculate icon size: fontSize × lineHeight (rounded)
    const calculatedSize = Math.round(fontSizeToken.baseValue * lineHeightToken.baseValue);
    
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
   * Extended to include semantic token validation
   */
  validateCrossPlatformConsistency(results: GenerationResult[]): {
    consistent: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check that all platforms have the same primitive token count
    const tokenCounts = results.map(r => r.tokenCount);
    const uniqueCounts = new Set(tokenCounts);

    if (uniqueCounts.size > 1) {
      issues.push(`Primitive token count mismatch across platforms: ${Array.from(uniqueCounts).join(', ')}`);
    }

    // Check that all platforms have the same semantic token count
    const semanticTokenCounts = results.map(r => r.semanticTokenCount);
    const uniqueSemanticCounts = new Set(semanticTokenCounts);

    if (uniqueSemanticCounts.size > 1) {
      issues.push(`Semantic token count mismatch across platforms: ${Array.from(uniqueSemanticCounts).join(', ')}`);
    }

    // Verify all platforms have same semantic token names
    // Extract token names from generated content for each platform
    const semanticTokenNames = this.extractSemanticTokenNames(results);

    if (semanticTokenNames.length > 0) {
      // Get the first platform's token names as reference
      const referenceNames = semanticTokenNames[0].names;
      const referencePlatform = semanticTokenNames[0].platform;

      // Compare other platforms against reference
      for (let i = 1; i < semanticTokenNames.length; i++) {
        const current = semanticTokenNames[i];

        // Check if token names match
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
      // Get the first platform's relationships as reference
      const referenceRelationships = relationships[0].relationships;
      const referencePlatform = relationships[0].platform;

      // Compare other platforms against reference
      for (let i = 1; i < relationships.length; i++) {
        const current = relationships[i];

        // Check each semantic token's primitive references
        for (const [semanticName, primitiveRefs] of Object.entries(referenceRelationships)) {
          const currentRefs = current.relationships[semanticName];

          if (!currentRefs) {
            issues.push(`${current.platform} missing semantic token '${semanticName}' present in ${referencePlatform}`);
            continue;
          }

          // Compare primitive references
          const refKeys = Object.keys(primitiveRefs).sort();
          const currKeys = Object.keys(currentRefs).sort();

          if (JSON.stringify(refKeys) !== JSON.stringify(currKeys)) {
            issues.push(`${current.platform} has different primitive references for '${semanticName}' compared to ${referencePlatform}`);
          } else {
            // Check that reference values match
            for (const key of refKeys) {
              if (primitiveRefs[key] !== currentRefs[key]) {
                issues.push(`${current.platform} semantic token '${semanticName}' references '${currentRefs[key]}' for ${key}, but ${referencePlatform} references '${primitiveRefs[key]}'`);
              }
            }
          }
        }
      }
    }

    // Check that all platforms generated successfully
    const invalidPlatforms = results.filter(r => !r.valid);
    if (invalidPlatforms.length > 0) {
      invalidPlatforms.forEach(r => {
        issues.push(`${r.platform} generation failed: ${r.errors?.join(', ')}`);
      });
    }

    return {
      consistent: issues.length === 0,
      issues
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
