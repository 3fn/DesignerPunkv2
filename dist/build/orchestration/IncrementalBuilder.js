"use strict";
/**
 * Incremental Build Support
 *
 * Detects changed source files and rebuilds only affected platform code.
 * Caches build artifacts for unchanged code and regenerates tokens only
 * when F1 tokens change. Provides significant performance improvements
 * for iterative development workflows.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementalBuilder = void 0;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Incremental builder
 *
 * Manages incremental builds by detecting changes, caching artifacts,
 * and rebuilding only what's necessary for fast iteration.
 */
class IncrementalBuilder {
    constructor(options) {
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
    detectChanges(platform) {
        const changes = [];
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
                }
                else if (currentHash !== previousHash) {
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
    tokensChanged() {
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
    async buildIncremental(platform, buildFn) {
        const startTime = Date.now();
        // Detect changes
        const changedFiles = this.detectChanges(platform);
        const tokensChanged = this.tokensChanged();
        // Check cache
        const cacheKey = this.getCacheKey(platform);
        const cachedEntry = this.cache.get(cacheKey);
        // Determine if we can use cache
        const canUseCache = cachedEntry &&
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
        const cacheEntry = {
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
    async regenerateTokensIfNeeded(regenerateFn) {
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
    cacheArtifacts(platform, artifactPaths) {
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
    clearCache(platform) {
        if (platform) {
            const cacheKey = this.getCacheKey(platform);
            this.cache.delete(cacheKey);
        }
        else {
            this.cache.clear();
        }
        this.saveCache();
    }
    /**
     * Get cache statistics
     *
     * @returns Cache statistics
     */
    getCacheStats() {
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
            totalSize: entries.reduce((sum, e) => sum + e.artifactPaths.reduce((s, p) => s + (fs.existsSync(p) ? fs.statSync(p).size : 0), 0), 0),
        };
    }
    // Private helper methods
    /**
     * Get cache key for platform
     */
    getCacheKey(platform) {
        return `build-cache-${platform}`;
    }
    /**
     * Check if cache entry is still valid
     */
    isCacheValid(entry) {
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
    hashFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return '';
        }
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }
    /**
     * Hash multiple files
     */
    hashFiles(filePaths) {
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
    hashSourceFiles() {
        const sourceFiles = this.options.sourceDirs.flatMap(dir => fs.existsSync(dir) ? this.getAllFiles(dir) : []);
        return this.hashFiles(sourceFiles);
    }
    /**
     * Hash all token files
     */
    hashTokenFiles() {
        const tokenFiles = this.options.tokenDirs.flatMap(dir => fs.existsSync(dir) ? this.getAllFiles(dir) : []);
        return this.hashFiles(tokenFiles);
    }
    /**
     * Get all files in directory recursively
     */
    getAllFiles(dir) {
        const files = [];
        if (!fs.existsSync(dir)) {
            return files;
        }
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...this.getAllFiles(fullPath));
            }
            else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
        return files;
    }
    /**
     * Load cache from disk
     */
    loadCache() {
        const cacheFile = path.join(this.options.cacheDir, 'build-cache.json');
        if (!fs.existsSync(cacheFile)) {
            return;
        }
        try {
            const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            for (const [key, value] of Object.entries(cacheData)) {
                const entry = value;
                this.cache.set(key, {
                    ...entry,
                    timestamp: new Date(entry.timestamp),
                });
            }
        }
        catch (error) {
            // Ignore cache load errors - will rebuild from scratch
            console.warn('Failed to load build cache:', error);
        }
    }
    /**
     * Save cache to disk
     */
    saveCache() {
        const cacheFile = path.join(this.options.cacheDir, 'build-cache.json');
        // Ensure cache directory exists
        if (!fs.existsSync(this.options.cacheDir)) {
            fs.mkdirSync(this.options.cacheDir, { recursive: true });
        }
        try {
            const cacheData = {};
            for (const [key, value] of this.cache.entries()) {
                cacheData[key] = {
                    ...value,
                    timestamp: value.timestamp.toISOString(),
                };
            }
            fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
        }
        catch (error) {
            // Ignore cache save errors - will rebuild next time
            console.warn('Failed to save build cache:', error);
        }
    }
}
exports.IncrementalBuilder = IncrementalBuilder;
//# sourceMappingURL=IncrementalBuilder.js.map