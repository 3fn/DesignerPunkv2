/**
 * File Generation Optimizer
 *
 * Optimizes platform-specific file generation for speed and efficiency.
 * Implements parallel generation, incremental updates, and output optimization.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
import { TranslationOutput, TargetPlatform } from '../types/TranslationOutput';
import { CachingStrategy } from './CachingStrategy';
export interface OptimizationOptions {
    /** Enable parallel generation across platforms */
    enableParallel?: boolean;
    /** Enable incremental generation (only changed tokens) */
    enableIncremental?: boolean;
    /** Enable output minification */
    enableMinification?: boolean;
    /** Enable caching */
    enableCaching?: boolean;
    /** Maximum parallel operations */
    maxParallel?: number;
}
export interface GenerationTask {
    platform: TargetPlatform;
    tokens: Array<PrimitiveToken | SemanticToken>;
    priority: number;
}
/**
 * File Generation Optimizer for performance optimization
 */
export declare class FileGenerationOptimizer {
    private cache;
    private previousTokenHashes;
    constructor(cache?: CachingStrategy);
    /**
     * Optimize file generation across platforms
     */
    optimizeGeneration(tokens: Array<PrimitiveToken | SemanticToken>, platforms: TargetPlatform[], generator: (platform: TargetPlatform, tokens: Array<PrimitiveToken | SemanticToken>) => Promise<TranslationOutput>, options?: OptimizationOptions): Promise<TranslationOutput[]>;
    /**
     * Generate files in parallel
     */
    private generateParallel;
    /**
     * Generate files sequentially
     */
    private generateSequential;
    /**
     * Create generation tasks with priorities
     */
    private createGenerationTasks;
    /**
     * Filter tokens that have changed since last generation
     */
    private filterChangedTokens;
    /**
     * Update token hashes for incremental generation
     */
    private updateTokenHashes;
    /**
     * Generate hash for token
     */
    private hashToken;
    /**
     * Get cached generation results
     */
    private getCachedResults;
    /**
     * Cache generation results
     */
    private cacheResults;
    /**
     * Optimize output content
     */
    optimizeOutput(content: string, options?: OptimizationOptions): string;
    /**
     * Batch token processing for efficiency
     */
    batchTokens(tokens: Array<PrimitiveToken | SemanticToken>, batchSize?: number): Array<Array<PrimitiveToken | SemanticToken>>;
    /**
     * Clear optimization caches
     */
    clearCaches(): void;
    /**
     * Get optimization statistics
     */
    getStats(): {
        cachedTokens: number;
        cacheStats: any;
    };
}
//# sourceMappingURL=FileGenerationOptimizer.d.ts.map