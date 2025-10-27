import { CompletionDocument } from '../git/GitHistoryAnalyzer';
/**
 * Document parsing cache entry
 */
export interface DocumentCacheEntry {
    document: CompletionDocument;
    contentHash: string;
    fileSize: number;
    lastModified: number;
    parseTime: number;
    accessCount: number;
    lastAccessed: number;
}
/**
 * Incremental parsing result
 */
export interface IncrementalParsingResult {
    document: CompletionDocument;
    fromCache: boolean;
    parseTime: number;
    cacheHit: boolean;
    contentChanged: boolean;
}
/**
 * Cache statistics for document parsing
 */
export interface DocumentCacheStats {
    totalDocuments: number;
    cachedDocuments: number;
    cacheHitRate: number;
    totalParseTime: number;
    averageParseTime: number;
    cacheSizeBytes: number;
    oldestEntry: number | null;
    newestEntry: number | null;
}
/**
 * Document parsing configuration
 */
export interface DocumentParsingConfig {
    enableCache: boolean;
    maxCacheSize: number;
    maxCacheAgeMs: number;
    enableIncrementalParsing: boolean;
    enableContentHashing: boolean;
    enableParallelParsing: boolean;
    maxConcurrentParsing: number;
}
/**
 * Document Parsing Cache for incremental document processing
 *
 * Implements intelligent caching and incremental parsing for completion documents
 * to avoid re-parsing unchanged files and optimize performance for large repositories.
 *
 * Requirements addressed:
 * - 5.2: Create incremental document parsing and caching
 * - 5.4: Add progress reporting for long-running analysis
 */
export declare class DocumentParsingCache {
    private cache;
    private cachingStrategy;
    private config;
    private workingDirectory;
    private stats;
    constructor(workingDirectory?: string, config?: Partial<DocumentParsingConfig>);
    /**
     * Parse document with incremental caching
     * Requirement 5.2: Create incremental document parsing and caching
     */
    parseDocumentIncremental(filePath: string): Promise<IncrementalParsingResult>;
    /**
     * Parse multiple documents with parallel processing
     * Requirements 5.2, 5.4: Parallel processing with progress reporting
     */
    parseDocumentsParallel(filePaths: string[], progressCallback?: (progress: {
        completed: number;
        total: number;
        currentFile: string;
    }) => void): Promise<IncrementalParsingResult[]>;
    /**
     * Check if document needs reparsing
     * Requirement 5.2: Incremental document parsing
     */
    needsReparsing(filePath: string): Promise<boolean>;
    /**
     * Get cached document if valid
     */
    private getCachedDocument;
    /**
     * Parse document without cache
     */
    private parseDocumentFresh;
    /**
     * Cache parsed document
     */
    private cacheDocument;
    /**
     * Calculate content hash for change detection
     */
    private calculateContentHash;
    /**
     * Evict least recently used cache entries
     */
    private evictLeastRecentlyUsed;
    /**
     * Extract metadata from completion document content
     */
    private extractDocumentMetadata;
    /**
     * Get the commit that last modified a file
     */
    private getFileLastCommit;
    /**
     * Get cache statistics
     * Requirement 5.4: Progress reporting and performance metrics
     */
    getCacheStats(): DocumentCacheStats;
    /**
     * Clear cache and reset statistics
     */
    clear(): void;
    /**
     * Prune old cache entries
     */
    pruneOldEntries(): number;
    /**
     * Get most frequently accessed documents
     */
    getMostAccessedDocuments(limit?: number): Array<{
        path: string;
        accessCount: number;
        parseTime: number;
    }>;
    /**
     * Preload documents into cache
     */
    preloadDocuments(filePaths: string[]): Promise<void>;
}
//# sourceMappingURL=DocumentParsingCache.d.ts.map