/**
 * Incremental Build Support
 *
 * Detects changed source files and rebuilds only affected platform code.
 * Caches build artifacts for unchanged code and regenerates tokens only
 * when F1 tokens change. Provides significant performance improvements
 * for iterative development workflows.
 */
import { Platform } from '../types/Platform';
import { BuildResult } from '../types/BuildResult';
/**
 * File change information
 */
export interface FileChange {
    /** File path relative to project root */
    path: string;
    /** Type of change */
    type: 'added' | 'modified' | 'deleted';
    /** File hash (for modified files) */
    hash?: string;
    /** Timestamp of change */
    timestamp: Date;
}
/**
 * Build cache entry
 */
export interface BuildCacheEntry {
    /** Platform this cache entry is for */
    platform: Platform;
    /** Hash of source files used in this build */
    sourceHash: string;
    /** Hash of token files used in this build */
    tokenHash: string;
    /** Build result from cached build */
    result: BuildResult;
    /** Timestamp when cache entry was created */
    timestamp: Date;
    /** Paths to cached build artifacts */
    artifactPaths: string[];
}
/**
 * Incremental build options
 */
export interface IncrementalBuildOptions {
    /** Directory to store build cache */
    cacheDir: string;
    /** Source directories to watch for changes */
    sourceDirs: string[];
    /** Token directories to watch for changes */
    tokenDirs: string[];
    /** Whether to enable cache validation */
    validateCache: boolean;
    /** Maximum cache age in milliseconds (default: 7 days) */
    maxCacheAge?: number;
}
/**
 * Incremental build result
 */
export interface IncrementalBuildResult {
    /** Whether build was skipped due to cache hit */
    cacheHit: boolean;
    /** Build result (from cache or fresh build) */
    result: BuildResult;
    /** Files that changed since last build */
    changedFiles: FileChange[];
    /** Whether tokens were regenerated */
    tokensRegenerated: boolean;
    /** Cache statistics */
    cacheStats: {
        /** Number of cached artifacts reused */
        artifactsReused: number;
        /** Number of artifacts rebuilt */
        artifactsRebuilt: number;
        /** Time saved by using cache (milliseconds) */
        timeSaved: number;
    };
}
/**
 * Incremental builder
 *
 * Manages incremental builds by detecting changes, caching artifacts,
 * and rebuilding only what's necessary for fast iteration.
 */
export declare class IncrementalBuilder {
    private options;
    private cache;
    private fileHashes;
    private previousTokenHash;
    constructor(options: IncrementalBuildOptions);
    /**
     * Detect changed source files since last build
     *
     * @param platform - Platform to check changes for
     * @returns Array of file changes
     */
    detectChanges(platform: Platform): FileChange[];
    /**
     * Check if tokens have changed since last build
     *
     * @returns True if tokens changed, false otherwise
     */
    tokensChanged(): boolean;
    /**
     * Rebuild only affected platform code
     *
     * @param platform - Platform to build
     * @param buildFn - Function to perform actual build
     * @returns Incremental build result
     */
    buildIncremental(platform: Platform, buildFn: () => Promise<BuildResult>): Promise<IncrementalBuildResult>;
    /**
     * Regenerate tokens only when F1 tokens change
     *
     * @param regenerateFn - Function to regenerate tokens
     * @returns True if tokens were regenerated, false if cached
     */
    regenerateTokensIfNeeded(regenerateFn: () => Promise<void>): Promise<boolean>;
    /**
     * Cache build artifacts for unchanged code
     *
     * @param platform - Platform to cache artifacts for
     * @param artifactPaths - Paths to artifacts to cache
     */
    cacheArtifacts(platform: Platform, artifactPaths: string[]): void;
    /**
     * Clear build cache
     *
     * @param platform - Optional platform to clear cache for (clears all if not specified)
     */
    clearCache(platform?: Platform): void;
    /**
     * Get cache statistics
     *
     * @returns Cache statistics
     */
    getCacheStats(): {
        totalEntries: number;
        platforms: Platform[];
        oldestEntry: Date | null;
        newestEntry: Date | null;
        totalSize: number;
    };
    /**
     * Get cache key for platform
     */
    private getCacheKey;
    /**
     * Check if cache entry is still valid
     */
    private isCacheValid;
    /**
     * Hash a single file
     */
    private hashFile;
    /**
     * Hash multiple files
     */
    private hashFiles;
    /**
     * Hash all source files
     */
    private hashSourceFiles;
    /**
     * Hash all token files
     */
    private hashTokenFiles;
    /**
     * Get all files in directory recursively
     */
    private getAllFiles;
    /**
     * Load cache from disk
     */
    private loadCache;
    /**
     * Save cache to disk
     */
    private saveCache;
}
//# sourceMappingURL=IncrementalBuilder.d.ts.map