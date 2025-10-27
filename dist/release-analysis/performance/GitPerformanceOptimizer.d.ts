import { GitChanges, GitTag } from '../git/GitHistoryAnalyzer';
/**
 * Git performance optimization configuration
 */
export interface GitOptimizationConfig {
    maxCommitsPerBatch: number;
    enableShallowClone: boolean;
    useGitCache: boolean;
    parallelFileProcessing: boolean;
    maxConcurrentOperations: number;
    cacheExpirationMs: number;
}
/**
 * Git operation result with performance metrics
 */
export interface GitOperationResult<T> {
    data: T;
    performanceMetrics: {
        duration: number;
        cacheHit: boolean;
        batchCount?: number;
        processedItems: number;
    };
}
/**
 * Batch processing result for Git operations
 */
export interface BatchResult<T> {
    items: T[];
    batchIndex: number;
    totalBatches: number;
    processingTime: number;
    errors: string[];
}
/**
 * Git Performance Optimizer for large repositories
 *
 * Implements efficient Git history analysis with caching, batching, and parallel processing
 * to handle large repositories with thousands of commits and files.
 *
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.4: Progress reporting for long-running analysis
 */
export declare class GitPerformanceOptimizer {
    private workingDirectory;
    private config;
    private performanceMonitor;
    private cachingStrategy;
    constructor(workingDirectory?: string, config?: Partial<GitOptimizationConfig>);
    /**
     * Find last release with performance optimization
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    findLastReleaseOptimized(): Promise<GitOperationResult<GitTag | null>>;
    /**
     * Get changes since reference with batching and parallel processing
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    getChangesSinceOptimized(reference: string): Promise<GitOperationResult<GitChanges>>;
    /**
     * Get commits since reference with batching
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    private getCommitsSinceOptimized;
    /**
     * Get file changes since reference with optimization
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    private getFileChangesSinceOptimized;
    /**
     * Get tag information with caching
     */
    private getTagInfoOptimized;
    /**
     * Get a batch of commits with efficient processing
     */
    private getCommitBatch;
    /**
     * Process file change batch in parallel
     */
    private processFileChangeBatch;
    /**
     * Create batches from array of items
     */
    private createBatches;
    /**
     * Check if a tag name looks like a release tag
     */
    private isReleaseTag;
    /**
     * Get commit date for a specific commit
     */
    private getCommitDate;
    /**
     * Execute a Git command and return output
     */
    private executeGitCommand;
    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): import("../../performance/PerformanceMonitor").PerformanceReport;
    /**
     * Get cache statistics
     */
    getCacheStats(): import("../../performance/CachingStrategy").CacheStats;
    /**
     * Clear caches and reset performance metrics
     */
    reset(): void;
    /**
     * Prune old cache entries
     */
    pruneCaches(): number;
}
//# sourceMappingURL=GitPerformanceOptimizer.d.ts.map