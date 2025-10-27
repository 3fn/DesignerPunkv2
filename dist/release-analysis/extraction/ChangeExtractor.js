"use strict";
/**
 * Change Extractor Interface Implementation
 *
 * Main interface for extracting changes from completion documents.
 * Coordinates between pattern matching, section parsing, and deduplication.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChangeExtractor = void 0;
const SimpleChangeExtractor_1 = require("./SimpleChangeExtractor");
/**
 * Default implementation of ChangeExtractor using SimpleChangeExtractor
 */
class DefaultChangeExtractor {
    constructor(config) {
        this.extractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(config);
    }
    /**
     * Extract changes from multiple completion documents
     */
    async extractChanges(documents) {
        return this.extractor.extractChanges(documents);
    }
    /**
     * Parse a single completion document for changes
     */
    async parseCompletionDocument(document) {
        return this.extractor.parseCompletionDocument(document);
    }
    /**
     * Deduplicate similar changes across documents
     */
    deduplicateChanges(changes) {
        return this.extractor.deduplicateChanges(changes);
    }
    /**
     * Validate extraction results
     */
    validateExtraction(changes) {
        return this.extractor.validateExtraction(changes);
    }
    /**
     * Get extraction statistics for debugging
     */
    getExtractionStats(changes) {
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
exports.DefaultChangeExtractor = DefaultChangeExtractor;
//# sourceMappingURL=ChangeExtractor.js.map