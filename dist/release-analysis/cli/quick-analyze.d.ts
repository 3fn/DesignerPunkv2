#!/usr/bin/env node
/**
 * Quick Analysis Mode for Release Analysis System
 *
 * Optimized analysis mode that completes in <10 seconds for automatic hook integration.
 * Provides concise output suitable for AI agent feedback while caching full results.
 *
 * Requirements addressed:
 * - 9.2: Quick analysis mode completes in <10 seconds
 * - 9.3: Concise output suitable for AI agent feedback
 * - 9.7: Cache results for later CLI access
 */
import { QuickAnalysisResult } from '../types/AnalysisTypes';
export interface QuickAnalysisOptions {
    /** Maximum time to spend on analysis (milliseconds) */
    timeoutMs?: number;
    /** Skip detailed extraction for speed */
    skipDetailedExtraction?: boolean;
    /** Cache full results for later review */
    cacheResults?: boolean;
    /** Cache directory path */
    cacheDir?: string;
    /** Enable performance monitoring */
    monitorPerformance?: boolean;
}
export interface PerformanceMetrics {
    /** Total analysis time (milliseconds) */
    totalTimeMs: number;
    /** Time spent on each phase (milliseconds) */
    phaseTimings: {
        gitAnalysis: number;
        documentCollection: number;
        changeExtraction: number;
        versionCalculation: number;
        caching: number;
    };
    /** Whether analysis completed within timeout */
    completedWithinTimeout: boolean;
    /** Memory usage (bytes) */
    memoryUsage: {
        initial: number;
        peak: number;
        final: number;
    };
    /** Number of documents processed */
    documentsProcessed: number;
}
export interface QuickAnalysisResultWithMetrics extends QuickAnalysisResult {
    /** Performance metrics for monitoring */
    performanceMetrics?: PerformanceMetrics;
    /** Cache file path if results were cached */
    cacheFilePath?: string;
}
/**
 * Quick Analysis Mode implementation
 */
export declare class QuickAnalyzer {
    private workingDirectory;
    private options;
    private performanceMetrics;
    constructor(workingDirectory?: string, options?: QuickAnalysisOptions);
    /**
     * Run quick analysis with performance monitoring
     * Requirement 9.2: Complete in <10 seconds
     */
    runQuickAnalysis(): Promise<QuickAnalysisResultWithMetrics>;
    /**
     * Perform quick analysis with optimizations
     */
    private performQuickAnalysis;
    /**
     * Perform quick extraction using simple pattern matching
     * Requirement 9.2: Optimized for speed
     */
    private performQuickExtraction;
    /**
     * Calculate quick version bump based on change counts
     * Requirement 9.2: Fast version calculation
     */
    private calculateQuickVersionBump;
    /**
     * Calculate quick confidence score
     */
    private calculateQuickConfidence;
    /**
     * Generate concise summary for AI agent feedback
     * Requirement 9.3: Concise output suitable for AI agent feedback
     */
    private generateConciseSummary;
    /**
     * Cache full analysis results for later CLI access
     * Requirement 9.7: Cache results for later CLI access
     */
    private cacheFullAnalysis;
    /**
     * Get cached analysis result
     * Requirement 9.7: Retrieve cached results
     */
    getCachedResult(): Promise<any | null>;
    /**
     * Clear cached results
     */
    clearCache(): Promise<void>;
    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): PerformanceMetrics;
    private initializePerformanceMetrics;
    private updatePeakMemory;
}
/**
 * CLI entry point for quick analysis
 */
export declare function runQuickAnalysisCLI(): Promise<void>;
//# sourceMappingURL=quick-analyze.d.ts.map