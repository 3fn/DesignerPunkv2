/**
 * Deduplication Engine
 *
 * Enhanced deduplication system with similarity detection, change merging,
 * and manual review flagging for uncertain duplicates.
 */
import { BreakingChange, Feature, BugFix, Improvement, DocumentationChange } from '../types/AnalysisTypes';
import { ConfidenceThresholds } from '../config/AnalysisConfig';
export interface DeduplicationResult<T> {
    /** Deduplicated items */
    items: T[];
    /** Items that were merged during deduplication */
    mergedItems: MergedItem<T>[];
    /** Items flagged for manual review due to uncertain similarity */
    uncertainDuplicates: UncertainDuplicate<T>[];
    /** Deduplication statistics */
    statistics: DeduplicationStatistics;
}
export interface MergedItem<T> {
    /** The final merged item */
    result: T;
    /** The original items that were merged */
    sources: T[];
    /** Similarity scores between merged items */
    similarities: number[];
    /** Reason for merging */
    reason: string;
}
export interface UncertainDuplicate<T> {
    /** The items that might be duplicates */
    items: T[];
    /** Similarity score between items */
    similarity: number;
    /** Reason for uncertainty */
    reason: string;
    /** Suggested action for manual review */
    suggestedAction: 'merge' | 'keep-separate' | 'needs-clarification';
}
export interface DeduplicationStatistics {
    /** Total items processed */
    totalProcessed: number;
    /** Number of duplicates found and merged */
    duplicatesRemoved: number;
    /** Number of items flagged for manual review */
    uncertainItems: number;
    /** Final item count after deduplication */
    finalCount: number;
    /** Deduplication effectiveness (0-1) */
    effectiveness: number;
}
export interface SimilarityMetrics {
    /** Overall similarity score (0-1) */
    overall: number;
    /** Title similarity score (0-1) */
    title: number;
    /** Description similarity score (0-1) */
    description: number;
    /** Metadata similarity score (0-1) */
    metadata: number;
}
export declare class DeduplicationEngine {
    private confidenceThresholds;
    /** Similarity threshold for considering items as duplicates */
    private readonly DUPLICATE_THRESHOLD;
    /** Similarity threshold for flagging uncertain duplicates */
    private readonly UNCERTAIN_THRESHOLD;
    /** Maximum similarity threshold - items above this are definitely duplicates */
    private readonly DEFINITE_DUPLICATE_THRESHOLD;
    constructor(confidenceThresholds: ConfidenceThresholds);
    /**
     * Deduplicate breaking changes with enhanced similarity detection
     */
    deduplicateBreakingChanges(changes: BreakingChange[]): DeduplicationResult<BreakingChange>;
    /**
     * Deduplicate features with enhanced similarity detection
     */
    deduplicateFeatures(features: Feature[]): DeduplicationResult<Feature>;
    /**
     * Deduplicate bug fixes with enhanced similarity detection
     */
    deduplicateBugFixes(bugFixes: BugFix[]): DeduplicationResult<BugFix>;
    /**
     * Deduplicate improvements with enhanced similarity detection
     */
    deduplicateImprovements(improvements: Improvement[]): DeduplicationResult<Improvement>;
    /**
     * Deduplicate documentation changes with enhanced similarity detection
     */
    deduplicateDocumentation(documentation: DocumentationChange[]): DeduplicationResult<DocumentationChange>;
    /**
     * Generic deduplication algorithm with similarity calculation and merging
     */
    private deduplicateItems;
    /**
     * Calculate text similarity between two strings
     */
    private calculateTextSimilarity;
    /**
     * Calculate similarity between two arrays of strings
     */
    private calculateArraySimilarity;
    /**
     * Normalize text for comparison
     */
    private normalizeText;
    /**
     * Determine suggested action based on similarity metrics
     */
    private determineSuggestedAction;
    /**
     * Merge multiple breaking changes into one
     */
    private mergeBreakingChanges;
    /**
     * Merge multiple features into one
     */
    private mergeFeatures;
    /**
     * Merge multiple bug fixes into one
     */
    private mergeBugFixes;
    /**
     * Merge multiple improvements into one
     */
    private mergeImprovements;
    /**
     * Merge multiple documentation changes into one
     */
    private mergeDocumentation;
    /**
     * Select the primary item from a list (most detailed)
     */
    private selectPrimaryItem;
    /**
     * Merge multiple descriptions into one comprehensive description
     */
    private mergeDescriptions;
    /**
     * Merge multiple arrays into one deduplicated array
     */
    private mergeArrays;
    /**
     * Merge multiple sources into one source string
     */
    private mergeSources;
    /**
     * Merge migration guidance from multiple breaking changes
     */
    private mergeMigrationGuidance;
    /**
     * Select the highest severity from a list
     */
    private selectHighestSeverity;
    /**
     * Select the highest impact from a list
     */
    private selectHighestImpact;
}
//# sourceMappingURL=DeduplicationEngine.d.ts.map