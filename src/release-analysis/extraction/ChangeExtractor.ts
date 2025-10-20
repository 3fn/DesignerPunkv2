/**
 * Change Extractor Interface Implementation
 * 
 * Main interface for extracting changes from completion documents.
 * Coordinates between pattern matching, section parsing, and deduplication.
 */

import { ExtractionConfig } from '../config/AnalysisConfig';
import { 
  CompletionDocument, 
  ExtractedChanges, 
  DocumentChanges, 
  ExtractionValidation 
} from '../types/AnalysisTypes';
import { SimpleChangeExtractor } from './SimpleChangeExtractor';

export interface ChangeExtractor {
  extractChanges(documents: CompletionDocument[]): Promise<ExtractedChanges>;
  parseCompletionDocument(document: CompletionDocument): Promise<DocumentChanges>;
  deduplicateChanges(changes: ExtractedChanges): ExtractedChanges;
  validateExtraction(changes: ExtractedChanges): ExtractionValidation;
}

/**
 * Default implementation of ChangeExtractor using SimpleChangeExtractor
 */
export class DefaultChangeExtractor implements ChangeExtractor {
  private extractor: SimpleChangeExtractor;

  constructor(config: ExtractionConfig) {
    this.extractor = new SimpleChangeExtractor(config);
  }

  /**
   * Extract changes from multiple completion documents
   */
  public async extractChanges(documents: CompletionDocument[]): Promise<ExtractedChanges> {
    return this.extractor.extractChanges(documents);
  }

  /**
   * Parse a single completion document for changes
   */
  public async parseCompletionDocument(document: CompletionDocument): Promise<DocumentChanges> {
    return this.extractor.parseCompletionDocument(document);
  }

  /**
   * Deduplicate similar changes across documents
   */
  public deduplicateChanges(changes: ExtractedChanges): ExtractedChanges {
    return this.extractor.deduplicateChanges(changes);
  }

  /**
   * Validate extraction results
   */
  public validateExtraction(changes: ExtractedChanges): ExtractionValidation {
    return this.extractor.validateExtraction(changes);
  }

  /**
   * Get extraction statistics for debugging
   */
  public getExtractionStats(changes: ExtractedChanges): {
    totalChanges: number;
    changesByType: Record<string, number>;
    averageConfidence: number;
    ambiguousCount: number;
    filteredCount: number;
  } {
    const totalChanges = changes.breakingChanges.length + changes.newFeatures.length + 
                        changes.bugFixes.length + changes.improvements.length;

    return {
      totalChanges,
      changesByType: {
        breakingChanges: changes.breakingChanges.length,
        newFeatures: changes.newFeatures.length,
        bugFixes: changes.bugFixes.length,
        improvements: changes.improvements.length,
        documentation: changes.documentation.length
      },
      averageConfidence: changes.metadata.extractionConfidence,
      ambiguousCount: changes.metadata.ambiguousItems.length,
      filteredCount: changes.metadata.filteredItems.length
    };
  }
}