import { PrimitiveToken, SemanticToken } from '../types';
import { TranslationOutput, TargetPlatform, OutputFormat } from '../types/TranslationOutput';

/**
 * Base interface for format generation providers
 * Defines consistent contract for generating platform-specific token syntax
 */
export interface FormatProvider {
  /**
   * Platform identifier for this format provider
   */
  readonly platform: TargetPlatform;

  /**
   * Output format(s) supported by this provider
   */
  readonly formats: OutputFormat[];

  /**
   * Generate platform-specific token constant declaration
   * @param token - The primitive or semantic token to format
   * @returns Platform-specific constant declaration string
   */
  formatToken(token: PrimitiveToken | SemanticToken): string;

  /**
   * Generate complete file content with all tokens
   * @param tokens - Array of tokens to include in the file
   * @param options - Optional formatting options
   * @returns Complete file content string
   */
  generateFile(tokens: (PrimitiveToken | SemanticToken)[], options?: FormatOptions): string;

  /**
   * Generate file header/preamble with imports and metadata
   * @param metadata - Optional metadata to include in header
   * @returns File header string
   */
  generateHeader(metadata?: FileMetadata): string;

  /**
   * Generate file footer/closing content
   * @returns File footer string
   */
  generateFooter(): string;

  /**
   * Validate that generated syntax is correct for the platform
   * @param content - Generated file content to validate
   * @returns Validation result with any errors
   */
  validateSyntax(content: string): { valid: boolean; errors?: string[] };

  /**
   * Get naming convention for token on this platform
   * @param tokenName - Original token name
   * @param category - Token category
   * @returns Platform-appropriate token name
   */
  getTokenName(tokenName: string, category: string): string;
}

/**
 * Options for format generation
 */
export interface FormatOptions {
  /** Include comments in generated file */
  includeComments?: boolean;
  
  /** Group tokens by category */
  groupByCategory?: boolean;
  
  /** Sort tokens alphabetically */
  sortAlphabetically?: boolean;
  
  /** Include mathematical relationships in comments */
  includeMathematicalContext?: boolean;
  
  /** Custom formatting preferences */
  customOptions?: Record<string, any>;
}

/**
 * Metadata for generated files
 */
export interface FileMetadata {
  /** Generation timestamp */
  generatedAt?: Date;
  
  /** System version */
  version?: string;
  
  /** Additional metadata */
  custom?: Record<string, any>;
}

/**
 * Abstract base class providing common format generation functionality
 */
export abstract class BaseFormatProvider implements FormatProvider {
  abstract readonly platform: TargetPlatform;
  abstract readonly formats: OutputFormat[];

  abstract formatToken(token: PrimitiveToken | SemanticToken): string;
  abstract generateHeader(metadata?: FileMetadata): string;
  abstract generateFooter(): string;
  abstract validateSyntax(content: string): { valid: boolean; errors?: string[] };
  abstract getTokenName(tokenName: string, category: string): string;

  generateFile(tokens: (PrimitiveToken | SemanticToken)[], options: FormatOptions = {}): string {
    const {
      includeComments = true,
      groupByCategory = true,
      sortAlphabetically = false,
      includeMathematicalContext = false
    } = options;

    let processedTokens = [...tokens];

    // Sort if requested
    if (sortAlphabetically) {
      processedTokens.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Group by category if requested
    const tokenGroups = groupByCategory
      ? this.groupTokensByCategory(processedTokens)
      : { all: processedTokens };

    // Generate file content
    const parts: string[] = [];
    parts.push(this.generateHeader());

    for (const [category, categoryTokens] of Object.entries(tokenGroups)) {
      if (groupByCategory && category !== 'all') {
        parts.push(this.generateCategoryComment(category));
      }

      for (const token of categoryTokens) {
        if (includeComments && includeMathematicalContext && 'mathematicalRelationship' in token) {
          parts.push(this.generateMathematicalComment(token as PrimitiveToken));
        }
        parts.push(this.formatToken(token));
      }

      if (groupByCategory && category !== 'all') {
        parts.push(''); // Add spacing between categories
      }
    }

    parts.push(this.generateFooter());

    return parts.join('\n');
  }

  protected groupTokensByCategory(tokens: (PrimitiveToken | SemanticToken)[]): Record<string, (PrimitiveToken | SemanticToken)[]> {
    const groups: Record<string, (PrimitiveToken | SemanticToken)[]> = {};

    for (const token of tokens) {
      const category = token.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(token);
    }

    return groups;
  }

  protected generateCategoryComment(category: string): string {
    return `// ${category.toUpperCase()} TOKENS`;
  }

  protected generateMathematicalComment(token: PrimitiveToken): string {
    return `// ${token.mathematicalRelationship}`;
  }

  protected formatValue(value: number | string | object, unit: string): string {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return unit === 'unitless' ? String(value) : `${value}${unit}`;
  }
}
