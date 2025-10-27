/**
 * Pattern Matcher for Change Extraction
 *
 * Implements regex-based pattern matching for detecting different types of changes
 * in completion documents. Provides both keyword-based and section-based matching.
 */
import { ExtractionConfig } from '../config/AnalysisConfig';
import { PatternMatch, SectionMatch } from '../types/AnalysisTypes';
export declare class PatternMatcher {
    private config;
    constructor(config: ExtractionConfig);
    /**
     * Find all pattern matches in document content
     */
    findPatternMatches(content: string, documentPath: string): PatternMatch[];
    /**
     * Find structured sections in document content
     */
    findSectionMatches(content: string): SectionMatch[];
    /**
     * Check if content should be excluded based on documentation patterns
     */
    shouldExcludeContent(content: string, documentPath: string): boolean;
    /**
     * Find keyword matches in a line of text
     */
    private findKeywordMatches;
    /**
     * Calculate confidence score for keyword match
     */
    private calculateKeywordConfidence;
    /**
     * Calculate confidence score for section match
     */
    private calculateSectionConfidence;
    /**
     * Get context around a line (previous and next lines)
     */
    private getContext;
    /**
     * Check if a line is a header
     */
    private isHeader;
    /**
     * Extract header text from line
     */
    private extractHeaderText;
    /**
     * Classify header type based on text
     */
    private classifyHeader;
    /**
     * Extract content of a section
     */
    private extractSectionContent;
    /**
     * Count keyword matches in content
     */
    private countKeywordMatches;
    /**
     * Count all keyword matches across all categories
     */
    private countAllKeywordMatches;
    /**
     * Convert glob pattern to regex
     */
    private globToRegex;
    /**
     * Remove duplicate matches based on line and type
     */
    private deduplicateMatches;
}
//# sourceMappingURL=PatternMatcher.d.ts.map