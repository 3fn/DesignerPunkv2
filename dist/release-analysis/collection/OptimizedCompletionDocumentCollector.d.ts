import { GitChanges } from '../git/GitHistoryAnalyzer';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { DocumentCollectionResult, DocumentFilter, CompletionDocumentCollector } from './CompletionDocumentCollector';
import { DocumentParsingConfig } from '../performance/DocumentParsingCache';
import { ParallelProcessingConfig } from '../performance/ParallelProcessor';
import { ProgressReportingConfig } from '../performance/ProgressReporter';
/**
 * Optimized collection configuration
 */
export interface OptimizedCollectionConfig {
    parsing: DocumentParsingConfig;
    parallel: ParallelProcessingConfig;
    progress: ProgressReportingConfig;
    enableOptimizations: boolean;
    fallbackToBasicCollection: boolean;
}
/**
 * Optimized collection result with performance metrics
 */
export interface OptimizedCollectionResult extends DocumentCollectionResult {
    performanceMetrics: {
        totalProcessingTime: number;
        cacheHitRate: number;
        parallelEfficiency: number;
        documentsFromCache: number;
        documentsReparsed: number;
        averageParseTime: number;
    };
}
/**
 * Optimized Completion Document Collector for large repositories
 *
 * Extends the basic CompletionDocumentCollector with performance optimizations:
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple documents
 * - Comprehensive progress reporting for long-running operations
 * - Fallback to basic collection if optimizations fail
 *
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
export declare class OptimizedCompletionDocumentCollector extends CompletionDocumentCollector {
    private documentCache;
    private parallelProcessor;
    private progressReporter;
    private optimizedConfig;
    constructor(workingDirectory: string | undefined, config: AnalysisConfig, optimizedConfig?: Partial<OptimizedCollectionConfig>);
    /**
     * Collect completion documents with optimizations
     * Requirements 5.1, 5.2, 5.3, 5.4: Optimized collection with all performance features
     */
    collectFromGitChangesOptimized(changes: GitChanges, filter?: DocumentFilter): Promise<OptimizedCollectionResult>;
    /**
     * Collect documents from specific paths with optimizations
     * Requirements 5.2, 5.3, 5.4: Optimized path-based collection
     */
    collectFromPathsOptimized(paths: string[], filter?: DocumentFilter): Promise<OptimizedCollectionResult>;
    /**
     * Discover documents with optimization
     */
    private discoverDocumentsOptimized;
    /**
     * Parse documents with parallel processing and caching
     * Requirements 5.2, 5.3: Incremental parsing with parallel processing
     */
    private parseDocumentsOptimized;
    /**
     * Filter documents with optimization
     */
    private filterDocumentsOptimized;
    /**
     * Check if document should be included (simplified filtering logic)
     */
    private shouldIncludeDocument;
    /**
     * Calculate performance metrics
     */
    private calculatePerformanceMetrics;
    /**
     * Fallback to basic collection
     */
    private fallbackToBasicCollection;
    /**
     * Set up progress event handlers
     */
    private setupProgressEventHandlers;
    /**
     * Get cache statistics
     */
    getCacheStats(): import("../performance/DocumentParsingCache").DocumentCacheStats;
    /**
     * Get processing statistics
     */
    getProcessingStats(): {
        completed: number;
        failed: number;
        active: number;
        totalRetries: number;
        averageProcessingTime: number;
        successRate: number;
    };
    /**
     * Get progress summary
     */
    getProgressSummary(): {
        overallProgress: number;
        currentPhase: string;
        elapsedTime: number;
        estimatedTimeRemaining: number;
        milestonesCount: number;
        phasesCompleted: number;
    };
    /**
     * Clear caches and reset state
     */
    reset(): void;
    /**
     * Prune old cache entries
     */
    pruneCaches(): number;
}
//# sourceMappingURL=OptimizedCompletionDocumentCollector.d.ts.map