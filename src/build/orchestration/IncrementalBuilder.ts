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
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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
export class IncrementalBuilder {
  private options: Required<IncrementalBuildOptions>;
  private cache: Map<string, BuildCacheEntry>;
  private fileHashes: Map<string, string>;
  private previousTokenHash: string | null;

  constructor(options: IncrementalBuildOptions) {
    this.options = {
      ...options,
      maxCacheAge: options.maxCacheAge ?? 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    this.cache = new Map();
    this.fileHashes = new Map();
    this.previousTokenHash = null;
    
    // Load existing cache
    this.loadCache();
    
    // Initialize token hash
    this.previousTokenHash = this.hashTokenFiles();
  }

  /**
   * Detect changed source files since last build
   * 
   * @param platform - Platform to check changes for
   * @returns Array of file changes
   */
  detectChanges(platform: Platform): FileChange[] {
    const changes: FileChange[] = [];
    const allDirs = [...this.options.sourceDirs, ...this.options.tokenDirs];

    for (const dir of allDirs) {
      if (!fs.existsSync(dir)) {
        continue;
      }

      const files = this.getAllFiles(dir);
      
      for (const file of files) {
        const currentHash = this.hashFile(file);
        const previousHash = this.fileHashes.get(file);

        if (!previousHash) {
          // New file
          changes.push({
            path: file,
            type: 'added',
            hash: currentHash,
            timestamp: new Date(),
          });
        } else if (currentHash !== previousHash) {
          // Modified file
          changes.push({
            path: file,
            type: 'modified',
            hash: currentHash,
            timestamp: new Date(),
          });
        }

        // Update hash cache
        this.fileHashes.set(file, currentHash);
      }
    }

    // Check for deleted files
    for (const [file, hash] of this.fileHashes.entries()) {
      if (!fs.existsSync(file)) {
        changes.push({
          path: file,
          type: 'deleted',
          timestamp: new Date(),
        });
        this.fileHashes.delete(file);
      }
    }

    return changes;
  }

  /**
   * Check if tokens have changed since last build
   * 
   * @returns True if tokens changed, false otherwise
   */
  tokensChanged(): boolean {
    const currentTokenHash = this.hashTokenFiles();
    
    // Compare with previous hash
    const changed = this.previousTokenHash !== currentTokenHash;
    
    // Update previous hash for next check
    this.previousTokenHash = currentTokenHash;
    
    return changed;
  }

  /**
   * Rebuild only affected platform code
   * 
   * @param platform - Platform to build
   * @param buildFn - Function to perform actual build
   * @returns Incremental build result
   */
  async buildIncremental(
    platform: Platform,
    buildFn: () => Promise<BuildResult>
  ): Promise<IncrementalBuildResult> {
    const startTime = Date.now();
    
    // Detect changes
    const changedFiles = this.detectChanges(platform);
    const tokensChanged = this.tokensChanged();

    // Check cache
    const cacheKey = this.getCacheKey(platform);
    const cachedEntry = this.cache.get(cacheKey);

    // Determine if we can use cache
    const canUseCache = 
      cachedEntry &&
      changedFiles.length === 0 &&
      !tokensChanged &&
      this.isCacheValid(cachedEntry);

    if (canUseCache && cachedEntry) {
      // Cache hit - reuse cached build
      const timeSaved = cachedEntry.result.duration;
      
      return {
        cacheHit: true,
        result: cachedEntry.result,
        changedFiles: [],
        tokensRegenerated: false,
        cacheStats: {
          artifactsReused: cachedEntry.artifactPaths.length,
          artifactsRebuilt: 0,
          timeSaved,
        },
      };
    }

    // Cache miss - perform fresh build
    const result = await buildFn();
    const buildDuration = Date.now() - startTime;

    // Update cache
    const sourceHash = this.hashSourceFiles();
    const tokenHash = this.hashTokenFiles();
    
    const cacheEntry: BuildCacheEntry = {
      platform,
      sourceHash,
      tokenHash,
      result,
      timestamp: new Date(),
      artifactPaths: result.packagePath ? [result.packagePath] : [],
    };

    this.cache.set(cacheKey, cacheEntry);
    this.saveCache();

    // Calculate time saved (if we had a previous build)
    const timeSaved = cachedEntry ? cachedEntry.result.duration - buildDuration : 0;

    return {
      cacheHit: false,
      result,
      changedFiles,
      tokensRegenerated: tokensChanged,
      cacheStats: {
        artifactsReused: 0,
        artifactsRebuilt: 1,
        timeSaved: Math.max(0, timeSaved),
      },
    };
  }

  /**
   * Regenerate tokens only when F1 tokens change
   * 
   * @param regenerateFn - Function to regenerate tokens
   * @returns True if tokens were regenerated, false if cached
   */
  async regenerateTokensIfNeeded(
    regenerateFn: () => Promise<void>
  ): Promise<boolean> {
    if (this.tokensChanged()) {
      await regenerateFn();
      return true;
    }
    
    return false;
  }

  /**
   * Cache build artifacts for unchanged code
   * 
   * @param platform - Platform to cache artifacts for
   * @param artifactPaths - Paths to artifacts to cache
   */
  cacheArtifacts(platform: Platform, artifactPaths: string[]): void {
    const cacheKey = this.getCacheKey(platform);
    const entry = this.cache.get(cacheKey);

    if (entry) {
      entry.artifactPaths = artifactPaths;
      entry.timestamp = new Date();
      this.saveCache();
    }
  }

  /**
   * Clear build cache
   * 
   * @param platform - Optional platform to clear cache for (clears all if not specified)
   */
  clearCache(platform?: Platform): void {
    if (platform) {
      const cacheKey = this.getCacheKey(platform);
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
    
    this.saveCache();
  }

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
  } {
    const entries = Array.from(this.cache.values());
    
    return {
      totalEntries: entries.length,
      platforms: entries.map(e => e.platform),
      oldestEntry: entries.length > 0 
        ? new Date(Math.min(...entries.map(e => e.timestamp.getTime())))
        : null,
      newestEntry: entries.length > 0
        ? new Date(Math.max(...entries.map(e => e.timestamp.getTime())))
        : null,
      totalSize: entries.reduce((sum, e) => 
        sum + e.artifactPaths.reduce((s, p) => 
          s + (fs.existsSync(p) ? fs.statSync(p).size : 0), 0
        ), 0
      ),
    };
  }

  // Private helper methods

  /**
   * Get cache key for platform
   */
  private getCacheKey(platform: Platform): string {
    return `build-cache-${platform}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(entry: BuildCacheEntry): boolean {
    if (!this.options.validateCache) {
      return true;
    }

    // Check cache age
    const age = Date.now() - entry.timestamp.getTime();
    if (age > this.options.maxCacheAge) {
      return false;
    }

    // Check if cached artifacts still exist
    for (const artifactPath of entry.artifactPaths) {
      if (!fs.existsSync(artifactPath)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Hash a single file
   */
  private hashFile(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      return '';
    }

    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Hash multiple files
   */
  private hashFiles(filePaths: string[]): string {
    const hash = crypto.createHash('sha256');
    
    for (const filePath of filePaths.sort()) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        hash.update(content);
      }
    }
    
    return hash.digest('hex');
  }

  /**
   * Hash all source files
   */
  private hashSourceFiles(): string {
    const sourceFiles = this.options.sourceDirs.flatMap(dir =>
      fs.existsSync(dir) ? this.getAllFiles(dir) : []
    );
    
    return this.hashFiles(sourceFiles);
  }

  /**
   * Hash all token files
   */
  private hashTokenFiles(): string {
    const tokenFiles = this.options.tokenDirs.flatMap(dir =>
      fs.existsSync(dir) ? this.getAllFiles(dir) : []
    );
    
    return this.hashFiles(tokenFiles);
  }

  /**
   * Get all files in directory recursively
   */
  private getAllFiles(dir: string): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    const cacheFile = path.join(this.options.cacheDir, 'build-cache.json');
    
    if (!fs.existsSync(cacheFile)) {
      return;
    }

    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      
      for (const [key, value] of Object.entries(cacheData)) {
        const entry = value as any;
        this.cache.set(key, {
          ...entry,
          timestamp: new Date(entry.timestamp),
        });
      }
    } catch (error) {
      // Ignore cache load errors - will rebuild from scratch
      console.warn('Failed to load build cache:', error);
    }
  }

  /**
   * Save cache to disk
   */
  private saveCache(): void {
    const cacheFile = path.join(this.options.cacheDir, 'build-cache.json');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.options.cacheDir)) {
      fs.mkdirSync(this.options.cacheDir, { recursive: true });
    }

    try {
      const cacheData: Record<string, any> = {};
      
      for (const [key, value] of this.cache.entries()) {
        cacheData[key] = {
          ...value,
          timestamp: value.timestamp.toISOString(),
        };
      }
      
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      // Ignore cache save errors - will rebuild next time
      console.warn('Failed to save build cache:', error);
    }
  }
}
