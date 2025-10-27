/**
 * Caching Strategy
 *
 * Implements efficient caching for token generation to reduce redundant processing.
 * Handles cache invalidation, versioning, and cache hit/miss tracking.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
import { SemanticToken } from '../types/SemanticToken';
export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    version: string;
    hits: number;
}
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    oldestEntry: number | null;
    newestEntry: number | null;
}
/**
 * Caching Strategy for token generation optimization
 */
export declare class CachingStrategy {
    private tokenCache;
    private generationCache;
    private validationCache;
    private hits;
    private misses;
    private currentVersion;
    /**
     * Set cache version for invalidation
     */
    setVersion(version: string): void;
    /**
     * Get current cache version
     */
    getVersion(): string;
    /**
     * Cache a token
     */
    cacheToken(key: string, token: PrimitiveToken | SemanticToken): void;
    /**
     * Get cached token
     */
    getCachedToken(key: string): (PrimitiveToken | SemanticToken) | null;
    /**
     * Check if token is cached
     */
    hasToken(key: string): boolean;
    /**
     * Invalidate token cache
     */
    invalidateToken(key: string): void;
    /**
     * Cache generation result
     */
    cacheGeneration(key: string, content: string): void;
    /**
     * Get cached generation result
     */
    getCachedGeneration(key: string): string | null;
    /**
     * Check if generation result is cached
     */
    hasGeneration(key: string): boolean;
    /**
     * Invalidate generation cache
     */
    invalidateGeneration(key: string): void;
    /**
     * Cache validation result
     */
    cacheValidation(key: string, result: any): void;
    /**
     * Get cached validation result
     */
    getCachedValidation(key: string): any | null;
    /**
     * Check if validation result is cached
     */
    hasValidation(key: string): boolean;
    /**
     * Invalidate validation cache
     */
    invalidateValidation(key: string): void;
    /**
     * Invalidate all caches
     */
    invalidateAll(): void;
    /**
     * Invalidate caches by pattern
     */
    invalidateByPattern(pattern: RegExp): void;
    /**
     * Prune old cache entries
     */
    pruneOldEntries(maxAgeMs: number): number;
    /**
     * Prune least recently used entries
     */
    pruneLRU(maxSize: number): number;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Reset cache statistics
     */
    resetStats(): void;
    /**
     * Get cache size breakdown
     */
    getSizeBreakdown(): {
        tokens: number;
        generations: number;
        validations: number;
        total: number;
    };
    /**
     * Get most frequently accessed entries
     */
    getMostAccessed(limit?: number): Array<{
        key: string;
        hits: number;
        type: string;
    }>;
}
//# sourceMappingURL=CachingStrategy.d.ts.map