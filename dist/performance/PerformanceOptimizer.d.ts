/**
 * Performance Optimizer
 *
 * Coordinates all performance optimization strategies for token generation.
 * Integrates caching, monitoring, and file generation optimization.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
import { TranslationOutput, TargetPlatform } from '../types/TranslationOutput';
import { OptimizationOptions } from './FileGenerationOptimizer';
export interface PerformanceConfig {
    /** Target generation time in milliseconds */
    targetGenerationTime?: number;
    /** Enable performance monitoring */
    enableMonitoring?: boolean;
    /** Enable caching */
    enableCaching?: boolean;
    /** Cache version for invalidation */
    cacheVersion?: string;
    /** Optimization options */
    optimizationOptions?: OptimizationOptions;
}
export interface PerformanceResult {
    success: boolean;
    meetsTarget: boolean;
    totalDuration: number;
    targetDuration: number;
    outputs: TranslationOutput[];
    performanceReport: any;
    cacheStats: any;
    optimizationStats: any;
}
/**
 * Performance Optimizer coordinator
 */
export declare class PerformanceOptimizer {
    private monitor;
    private cache;
    private fileOptimizer;
    private config;
    constructor(config?: PerformanceConfig);
    /**
     * Optimize token generation with performance monitoring
     */
    optimizeGeneration(tokens: Array<PrimitiveToken | SemanticToken>, platforms: TargetPlatform[], generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>): Promise<PerformanceResult>;
    /**
     * Optimize single platform generation
     */
    optimizePlatformGeneration(platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>, generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>): Promise<TranslationOutput>;
    /**
     * Optimize token validation
     */
    optimizeValidation<T>(key: string, validator: () => T | Promise<T>): Promise<T>;
    /**
     * Batch process tokens for efficiency
     */
    batchProcess<T>(tokens: Array<PrimitiveToken | SemanticToken>, processor: (batch: Array<PrimitiveToken | SemanticToken>) => Promise<T[]>, batchSize?: number): Promise<T[]>;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<PerformanceConfig>): void;
    /**
     * Get performance statistics
     */
    getStats(): {
        performance: any;
        cache: any;
        optimization: any;
    };
    /**
     * Check if performance meets target
     */
    meetsPerformanceTarget(): boolean;
    /**
     * Get slow operations
     */
    getSlowOperations(thresholdMs?: number): any[];
    /**
     * Clear all caches and reset statistics
     */
    reset(): void;
    /**
     * Prune old cache entries
     */
    pruneCache(maxAgeMs?: number): number;
    /**
     * Get performance summary
     */
    getSummary(): {
        meetsTarget: boolean;
        targetMs: number;
        averageMs: number;
        cacheHitRate: number;
        totalOperations: number;
    };
    /**
     * Export performance data for analysis
     */
    exportData(): {
        config: Required<PerformanceConfig>;
        metrics: any[];
        cacheStats: any;
        summary: any;
    };
}
//# sourceMappingURL=PerformanceOptimizer.d.ts.map