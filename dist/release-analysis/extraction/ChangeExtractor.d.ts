/**
 * Change Extractor Interface Implementation
 *
 * Main interface for extracting changes from completion documents.
 * Coordinates between pattern matching, section parsing, and deduplication.
 */
import { ExtractionConfig } from '../config/AnalysisConfig';
import { CompletionDocument, ExtractedChanges, DocumentChanges, ExtractionValidation } from '../types/AnalysisTypes';
export interface ChangeExtractor {
    extractChanges(documents: CompletionDocument[]): Promise<ExtractedChanges>;
    parseCompletionDocument(document: CompletionDocument): Promise<DocumentChanges>;
    deduplicateChanges(changes: ExtractedChanges): ExtractedChanges;
    validateExtraction(changes: ExtractedChanges): ExtractionValidation;
}
/**
 * Default implementation of ChangeExtractor using SimpleChangeExtractor
 */
export declare class DefaultChangeExtractor implements ChangeExtractor {
    private extractor;
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
     * Deduplicate similar changes across documents
     */
    deduplicateChanges(changes: ExtractedChanges): ExtractedChanges;
    /**
     * Validate extraction results
     */
    validateExtraction(changes: ExtractedChanges): ExtractionValidation;
    /**
     * Get extraction statistics for debugging
     */
    getExtractionStats(changes: ExtractedChanges): {
        totalChanges: number;
        changesByType: Record<string, number>;
        averageConfidence: number;
        ambiguousCount: number;
        filteredCount: number;
    };
}
//# sourceMappingURL=ChangeExtractor.d.ts.map