/**
 * Enhanced Change Extractor
 *
 * Implements sophisticated extraction of changes from completion documents.
 * Integrates complex extraction methods from CompletionAnalyzer with CLI workflow.
 * Uses structured section parsing with pattern-based fallback for maximum accuracy.
 */
import { ExtractionConfig } from '../config/AnalysisConfig';
import { CompletionDocument, ExtractedChanges, DocumentChanges, ExtractionValidation, BreakingChange, Feature, BugFix, Improvement, DocumentationChange, PatternMatch, SectionMatch } from '../types/AnalysisTypes';
import { ConfidenceScore, ItemConfidenceScore } from './ConfidenceMetrics';
export declare class SimpleChangeExtractor {
    private config;
    private patternMatcher;
    private categorizationSystem;
    private deduplicationEngine;
    private confidenceMetrics;
    constructor(config: ExtractionConfig);
    /**
     * Extract changes from multiple completion documents
     */
    extractChanges(documents: CompletionDocument[]): Promise<ExtractedChanges>;
    /**
     * Parse a single completion document for changes
     */
    parseCompletionDocument(document: CompletionDocument): Promise<DocumentChanges>;
    /**
     * Deduplicate similar changes across documents using enhanced deduplication engine
     */
    deduplicateChanges(changes: ExtractedChanges): ExtractedChanges;
    /**
     * Validate extraction results
     */
    validateExtraction(changes: ExtractedChanges): ExtractionValidation;
    /**
     * Parse structured document using enhanced section matches with complex extraction logic
     */
    private parseStructuredDocument;
    /**
     * Parse unstructured document using enhanced pattern matching with structured fallback
     */
    private parseUnstructuredDocument;
    /**
     * Extract breaking changes from a section using enhanced extraction
     */
    private extractBreakingChangesFromSection;
    /**
     * Extract features from a section
     */
    private extractFeaturesFromSection;
    /**
     * Extract bug fixes from a section
     */
    private extractBugFixesFromSection;
    /**
     * Extract improvements from a section
     */
    private extractImprovementsFromSection;
    /**
     * Extract mixed changes from summary section
     */
    private extractMixedChangesFromSection;
    /**
     * Create change item from pattern match
     */
    private createChangeFromPattern;
    /**
     * Enhanced section finding from CompletionAnalyzer
     * Provides more sophisticated section detection for structured documents
     */
    private findSections;
    /**
     * Enhanced extraction using structured sections first (from CompletionAnalyzer)
     */
    private extractBreakingChangesWithStructure;
    /**
     * Enhanced feature extraction with structured sections (from CompletionAnalyzer)
     */
    private extractFeaturesWithStructure;
    /**
     * Enhanced bug fix extraction with documentation filtering (from CompletionAnalyzer)
     */
    private extractBugFixesWithStructure;
    /**
     * Semantic deduplication methods from CompletionAnalyzer
     */
    private semanticDeduplicateBreakingChanges;
    private semanticDeduplicateFeatures;
    private semanticDeduplicateBugFixes;
    private semanticDeduplicateImprovements;
    /**
     * Generic semantic deduplication with similarity function
     */
    private semanticDeduplicate;
    /**
     * Calculate text similarity using Levenshtein distance
     */
    private calculateSimilarity;
    /**
     * Enhanced section parsing methods from CompletionAnalyzer
     */
    private parseBreakingChangeSection;
    private parseFeaturesSection;
    private parseBugFixSection;
    /**
     * Enhanced creation methods from CompletionAnalyzer
     */
    private createBreakingChangeFromLine;
    private createBreakingChangeFromCleanLine;
    private createFeatureFromMatch;
    private createFeatureFromCleanLine;
    private createBugFixFromMatch;
    private createBugFixFromCleanLine;
    /**
     * Enhanced severity determination from CompletionAnalyzer
     */
    private determineBreakingChangeSeverity;
    /**
     * Extract list items from content
     */
    private extractListItems;
    /**
     * Extract title from text (first sentence or line)
     */
    private extractTitle;
    /**
     * Extract affected APIs from text
     */
    private extractAffectedAPIs;
    /**
     * Extract migration guidance from text
     */
    private extractMigrationGuidance;
    /**
     * Assess breaking change severity using categorization system
     */
    private assessBreakingChangeSeverity;
    /**
     * Extract benefits from text using enhanced categorization system
     */
    private extractBenefits;
    /**
     * Extract requirements from text
     */
    private extractRequirements;
    /**
     * Extract artifacts from text
     */
    private extractArtifacts;
    /**
     * Categorize feature type using categorization system
     */
    private categorizeFeature;
    /**
     * Extract issue number from text
     */
    private extractIssueNumber;
    /**
     * Extract affected components from text
     */
    private extractAffectedComponents;
    /**
     * Assess bug fix severity using categorization system
     */
    private assessBugFixSeverity;
    /**
     * Categorize improvement type using categorization system
     */
    private categorizeImprovement;
    /**
     * Assess improvement impact using categorization system
     */
    private assessImprovementImpact;
    /**
     * Categorize documentation type
     */
    private categorizeDocumentation;
    /**
     * Aggregate changes from multiple documents
     */
    private aggregateChanges;
    /**
     * Build deduplication metadata from deduplication results
     */
    private buildDeduplicationMetadata;
    /**
     * Calculate confidence with deduplication considerations
     */
    private calculateConfidenceWithDeduplication;
    /**
     * Calculate overall confidence from aggregated changes
     */
    private calculateOverallConfidence;
    /**
     * Calculate comprehensive confidence metrics for extracted changes
     */
    calculateConfidenceMetrics(changes: ExtractedChanges, documents: CompletionDocument[], patternMatches?: PatternMatch[], sectionMatches?: SectionMatch[]): ConfidenceScore;
    /**
     * Calculate confidence for individual change items
     */
    calculateItemConfidence(item: BreakingChange | Feature | BugFix | Improvement | DocumentationChange, context: {
        patternMatch?: PatternMatch;
        sectionMatch?: SectionMatch;
        documentStructure: 'structured' | 'unstructured';
        extractionMethod: 'pattern' | 'section' | 'mixed';
    }): ItemConfidenceScore;
    /**
     * Generate quality report for extraction results
     */
    generateQualityReport(confidenceScore: ConfidenceScore, changes: ExtractedChanges): {
        summary: string;
        details: Array<{
            title: string;
            content: string;
        }>;
        recommendations: string[];
        actionItems: string[];
    };
    /**
     * Enhanced validation with confidence metrics
     */
    validateExtractionWithConfidence(changes: ExtractedChanges, documents: CompletionDocument[], patternMatches?: PatternMatch[], sectionMatches?: SectionMatch[]): ExtractionValidation & {
        confidenceScore: ConfidenceScore;
        status: 'pass' | 'warning' | 'fail';
        thresholdViolations: any[];
        recommendations: any[];
    };
    /**
     * Get categorization insights for validation
     */
    getCategorizationInsights(changes: ExtractedChanges): {
        totalCategorized: number;
        categoryDistribution: Record<string, number>;
        averageConfidence: number;
        lowConfidenceItems: string[];
    };
    /**
     * Enhanced extraction with confidence tracking
     */
    extractChangesWithConfidence(documents: CompletionDocument[]): Promise<{
        changes: ExtractedChanges;
        confidenceScore: ConfidenceScore;
        validation: ExtractionValidation & {
            confidenceScore: ConfidenceScore;
            status: 'pass' | 'warning' | 'fail';
            thresholdViolations: any[];
            recommendations: any[];
        };
    }>;
    /**
     * Extract changes with pattern and section match tracking
     */
    private extractChangesWithTracking;
    /**
     * Parse completion document with pattern and section match tracking
     */
    private parseCompletionDocumentWithTracking;
    /**
     * Parse unstructured document with pattern tracking
     */
    private parseUnstructuredDocumentWithPatterns;
}
//# sourceMappingURL=SimpleChangeExtractor.d.ts.map