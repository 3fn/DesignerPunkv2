/**
 * Token File Generator
 * 
 * Orchestrates the generation of platform-specific token constant files.
 * Generates DesignTokens.web.js, DesignTokens.ios.swift, and DesignTokens.android.kt
 * with mathematical consistency across all platforms.
 */

import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';
import { WebFormatGenerator } from '../providers/WebFormatGenerator';
import { iOSFormatGenerator } from '../providers/iOSFormatGenerator';
import { AndroidFormatGenerator } from '../providers/AndroidFormatGenerator';
import { FileMetadata } from '../providers/FormatProvider';
import { getAllTokens, getTokensByCategory } from '../tokens';

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
  valid: boolean;
  errors?: string[];
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
    this.webGenerator = new WebFormatGenerator('javascript');
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

    const tokens = getAllTokens();
    const lines: string[] = [];

    // Add header
    lines.push(this.webGenerator.generateHeader(metadata));

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

    // Add footer
    lines.push(this.webGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.webGenerator.validateSyntax(content);

    return {
      platform: 'web',
      filePath: `${outputDir}/DesignTokens.web.js`,
      content,
      tokenCount: tokens.length,
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

    const tokens = getAllTokens();
    const lines: string[] = [];

    // Add header
    lines.push(this.iosGenerator.generateHeader(metadata));

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

    // Add footer
    lines.push(this.iosGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.iosGenerator.validateSyntax(content);

    return {
      platform: 'ios',
      filePath: `${outputDir}/DesignTokens.ios.swift`,
      content,
      tokenCount: tokens.length,
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

    const tokens = getAllTokens();
    const lines: string[] = [];

    // Add header
    lines.push(this.androidGenerator.generateHeader(metadata));

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

    // Add footer
    lines.push(this.androidGenerator.generateFooter());

    const content = lines.join('\n');
    const validation = this.androidGenerator.validateSyntax(content);

    return {
      platform: 'android',
      filePath: `${outputDir}/DesignTokens.android.kt`,
      content,
      tokenCount: tokens.length,
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
   */
  validateCrossPlatformConsistency(results: GenerationResult[]): {
    consistent: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check that all platforms have the same token count
    const tokenCounts = results.map(r => r.tokenCount);
    const uniqueCounts = new Set(tokenCounts);
    
    if (uniqueCounts.size > 1) {
      issues.push(`Token count mismatch across platforms: ${Array.from(uniqueCounts).join(', ')}`);
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
}
