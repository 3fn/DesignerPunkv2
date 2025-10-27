import { PrimitiveToken, SemanticToken } from '../types';
import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
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
    validateSyntax(content: string): {
        valid: boolean;
        errors?: string[];
    };
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
export declare abstract class BaseFormatProvider implements FormatProvider {
    abstract readonly platform: TargetPlatform;
    abstract readonly formats: OutputFormat[];
    abstract formatToken(token: PrimitiveToken | SemanticToken): string;
    abstract generateHeader(metadata?: FileMetadata): string;
    abstract generateFooter(): string;
    abstract validateSyntax(content: string): {
        valid: boolean;
        errors?: string[];
    };
    abstract getTokenName(tokenName: string, category: string): string;
    generateFile(tokens: (PrimitiveToken | SemanticToken)[], options?: FormatOptions): string;
    protected groupTokensByCategory(tokens: (PrimitiveToken | SemanticToken)[]): Record<string, (PrimitiveToken | SemanticToken)[]>;
    protected generateCategoryComment(category: string): string;
    protected generateMathematicalComment(token: PrimitiveToken): string;
    protected formatValue(value: number | string | object, unit: string): string;
}
//# sourceMappingURL=FormatProvider.d.ts.map