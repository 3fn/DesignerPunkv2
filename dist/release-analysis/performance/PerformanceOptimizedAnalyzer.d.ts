import { AnalysisScope } from '../git/GitHistoryAnalyzer';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { OptimizedCollectionResult } from '../collection/OptimizedCompletionDocumentCollector';
import { GitOptimizationConfig } from './GitPerformanceOptimizer';
/**
 * Performance optimization configuration for the entire analysis pipeline
 */
export interface AnalysisOptimizationConfig {
    git: GitOptimizationConfig;
    enableOptimizations: boolean;
    enableProgressReporting: boolean;
    enablePerformanceMonitoring: boolean;
    fallbackToBasicAnalysis: boolean;
    performanceTargets: {
        maxAnalysisTimeMs: number;
        maxMemoryUsageMB: number;
        minCacheHitRate: number;
    };
}
/**
 * Comprehensive analysis result with performance metrics
 */
export interface OptimizedAnalysisResult {
    scope: AnalysisScope;
    collectionResult: OptimizedCollectionResult;
    performanceMetrics: {
        totalAnalysisTime: number;
        gitAnalysisTime: number;
        documentCollectionTime: number;
        cacheEfficiency: number;
        parallelEfficiency: number;
        memoryUsage: {
            peak: number;
            average: number;
            final: number;
        };
        performanceTargetsMet: boolean;
    };
    optimizationSummary: {
        optimizationsUsed: string[];
        fallbacksTriggered: string[];
        cacheStats: any;
        processingStats: any;
    };
}
/**
 * Performance Optimized Analyzer for large repository release analysis
 *
 * Integrates all performance optimization components to provide efficient analysis
 * of large repositories with comprehensive progress reporting and performance monitoring.
 *
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
export declare class PerformanceOptimizedAnalyzer {
    private gitAnalyzer;
    private gitOptimizer;
    private documentCollector;
    private progressReporter;
    private config;
    private workingDirectory;
    private analysisConfig;
    constructor(workingDirectory: string | undefined, analysisConfig: AnalysisConfig, optimizationConfig?: Partial<AnalysisOptimizationConfig>);
    /**
     * Perform optimized release analysis
     * Requirements 5.1, 5.2, 5.3, 5.4: Complete optimized analysis pipeline
     */
    analyzeReleaseOptimized(reference?: string): Promise<OptimizedAnalysisResult>;
    /**
     * Perform Git analysis with optimizations
     */
    private performGitAnalysisOptimized;
    /**
     * Finalize analysis with performance metrics
     */
    private finalizeAnalysis;
    /**
     * Check if performance targets are met
     */
    private checkPerformanceTargets;
    /**
     * Get list of optimizations that were used
     */
    private getOptimizationsUsed;
    /**
     * Get list of fallbacks that were triggered
     */
    private getFallbacksTriggered;
    /**
     * Get comprehensive performance report
     */
    getPerformanceReport(): {
        gitOptimizer: any;
        documentCollector: {
            cache: any;
            processing: any;
            progress: any;
        };
        progressReporter: any;
    };
    /**
     * Reset all optimizations and clear caches
     */
    reset(): void;
    /**
     * Prune old cache entries across all components
     */
    pruneCaches(): {
        gitCachesPruned: number;
        documentCachesPruned: number;
    };
    /**
     * Update optimization configuration
     */
    updateConfig(newConfig: Partial<AnalysisOptimizationConfig>): void;
}
//# sourceMappingURL=PerformanceOptimizedAnalyzer.d.ts.map