/**
 * Token File Generator
 *
 * Orchestrates the generation of platform-specific token constant files.
 * Generates DesignTokens.web.css, DesignTokens.ios.swift, and DesignTokens.android.kt
 * with mathematical consistency across all platforms.
 */
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
export declare class TokenFileGenerator {
    private webGenerator;
    private iosGenerator;
    private androidGenerator;
    constructor();
    /**
     * Generate all platform-specific token files
     */
    generateAll(options?: GenerationOptions): GenerationResult[];
    /**
     * Generate semantic token section for specified platform
     * Handles both single-reference and multi-reference tokens
     *
     * @param semantics - Array of semantic tokens to generate
     * @param platform - Target platform ('web', 'ios', or 'android')
     * @returns Array of formatted token strings
     */
    private generateSemanticSection;
    /**
     * Generate layering token section for specified platform
     * Handles semantic-only layering tokens (z-index and elevation)
     *
     * @param platform - Target platform ('web', 'ios', or 'android')
     * @returns Array of formatted token strings
     */
    private generateLayeringSection;
    /**
     * Generate web token file (JavaScript)
     */
    generateWebTokens(options?: GenerationOptions): GenerationResult;
    /**
     * Generate iOS token file (Swift)
     */
    generateiOSTokens(options?: GenerationOptions): GenerationResult;
    /**
     * Generate Android token file (Kotlin)
     */
    generateAndroidTokens(options?: GenerationOptions): GenerationResult;
    /**
     * Get unique categories from token list
     */
    private getUniqueCategories;
    /**
     * Validate mathematical consistency across platforms
     * Extended to include semantic token validation
     */
    validateCrossPlatformConsistency(results: GenerationResult[]): {
        consistent: boolean;
        issues: string[];
    };
    /**
     * Extract semantic token names from generated content
     * Parses the generated files to extract semantic token names
     *
     * @param results - Generation results for all platforms
     * @returns Array of platform token names
     */
    private extractSemanticTokenNames;
    /**
     * Extract primitive→semantic relationships from generated content
     * Analyzes semantic tokens to extract their primitive references
     *
     * @param results - Generation results for all platforms
     * @returns Array of platform relationships
     */
    private extractPrimitiveSemanticRelationships;
}
//# sourceMappingURL=TokenFileGenerator.d.ts.map