"use strict";
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
exports.DocumentParsingCache = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const CachingStrategy_1 = require("../../performance/CachingStrategy");
/**
 * Document Parsing Cache for incremental document processing
 *
 * Implements intelligent caching and incremental parsing for completion documents
 * to avoid re-parsing unchanged files and optimize performance for large repositories.
 *
 * Requirements addressed:
 * - 5.2: Create incremental document parsing and caching
 * - 5.4: Add progress reporting for long-running analysis
 */
class DocumentParsingCache {
    constructor(workingDirectory = process.cwd(), config = {}) {
        this.cache = new Map();
        this.workingDirectory = workingDirectory;
        this.config = {
            enableCache: true,
            maxCacheSize: 1000,
            maxCacheAgeMs: 60 * 60 * 1000, // 1 hour
            enableIncrementalParsing: true,
            enableContentHashing: true,
            enableParallelParsing: true,
            maxConcurrentParsing: 4,
            ...config
        };
        this.cachingStrategy = new CachingStrategy_1.CachingStrategy();
        this.stats = {
            totalRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalParseTime: 0,
            documentsProcessed: 0
        };
    }
    /**
     * Parse document with incremental caching
     * Requirement 5.2: Create incremental document parsing and caching
     */
    async parseDocumentIncremental(filePath) {
        const startTime = Date.now();
        this.stats.totalRequests++;
        try {
            const fullPath = (0, path_1.join)(this.workingDirectory, filePath);
            const fileStats = (0, fs_1.statSync)(fullPath);
            // Check if we have a cached version
            if (this.config.enableCache && this.config.enableIncrementalParsing) {
                const cached = await this.getCachedDocument(filePath, fileStats);
                if (cached) {
                    this.stats.cacheHits++;
                    return {
                        document: cached.document,
                        fromCache: true,
                        parseTime: Date.now() - startTime,
                        cacheHit: true,
                        contentChanged: false
                    };
                }
            }
            // Parse document fresh
            this.stats.cacheMisses++;
            const document = await this.parseDocumentFresh(filePath);
            const parseTime = Date.now() - startTime;
            this.stats.totalParseTime += parseTime;
            this.stats.documentsProcessed++;
            // Cache the result
            if (this.config.enableCache) {
                await this.cacheDocument(filePath, document, fileStats, parseTime);
            }
            return {
                document,
                fromCache: false,
                parseTime,
                cacheHit: false,
                contentChanged: true
            };
        }
        catch (error) {
            throw new Error(`Failed to parse document ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Parse multiple documents with parallel processing
     * Requirements 5.2, 5.4: Parallel processing with progress reporting
     */
    async parseDocumentsParallel(filePaths, progressCallback) {
        const results = [];
        if (!this.config.enableParallelParsing || filePaths.length <= this.config.maxConcurrentParsing) {
            // Process sequentially or small batches
            for (let i = 0; i < filePaths.length; i++) {
                const filePath = filePaths[i];
                progressCallback?.({ completed: i, total: filePaths.length, currentFile: filePath });
                try {
                    const result = await this.parseDocumentIncremental(filePath);
                    results.push(result);
                }
                catch (error) {
                    console.warn(`Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        else {
            // Process in parallel batches
            const batchSize = this.config.maxConcurrentParsing;
            const totalBatches = Math.ceil(filePaths.length / batchSize);
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const startIndex = batchIndex * batchSize;
                const endIndex = Math.min(startIndex + batchSize, filePaths.length);
                const batch = filePaths.slice(startIndex, endIndex);
                // Process batch in parallel
                const batchPromises = batch.map(async (filePath, index) => {
                    const globalIndex = startIndex + index;
                    progressCallback?.({ completed: globalIndex, total: filePaths.length, currentFile: filePath });
                    try {
                        return await this.parseDocumentIncremental(filePath);
                    }
                    catch (error) {
                        console.warn(`Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
                        return null;
                    }
                });
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults.filter((result) => result !== null));
            }
        }
        progressCallback?.({ completed: filePaths.length, total: filePaths.length, currentFile: '' });
        return results;
    }
    /**
     * Check if document needs reparsing
     * Requirement 5.2: Incremental document parsing
     */
    async needsReparsing(filePath) {
        if (!this.config.enableCache || !this.config.enableIncrementalParsing) {
            return true;
        }
        try {
            const fullPath = (0, path_1.join)(this.workingDirectory, filePath);
            const fileStats = (0, fs_1.statSync)(fullPath);
            const cached = this.cache.get(filePath);
            if (!cached) {
                return true;
            }
            // Check if file has been modified
            if (cached.lastModified !== fileStats.mtime.getTime()) {
                return true;
            }
            // Check if cache entry is too old
            const now = Date.now();
            if (now - cached.lastAccessed > this.config.maxCacheAgeMs) {
                return true;
            }
            // Check content hash if enabled
            if (this.config.enableContentHashing) {
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                const content = await fs.readFile(fullPath, 'utf-8');
                const contentHash = this.calculateContentHash(content);
                if (cached.contentHash !== contentHash) {
                    return true;
                }
            }
            return false;
        }
        catch {
            return true;
        }
    }
    /**
     * Get cached document if valid
     */
    async getCachedDocument(filePath, fileStats) {
        const cached = this.cache.get(filePath);
        if (!cached) {
            return null;
        }
        // Check if file has been modified
        if (cached.lastModified !== fileStats.mtime.getTime()) {
            this.cache.delete(filePath);
            return null;
        }
        // Check if cache entry is too old
        const now = Date.now();
        if (now - cached.lastAccessed > this.config.maxCacheAgeMs) {
            this.cache.delete(filePath);
            return null;
        }
        // Verify content hash if enabled
        if (this.config.enableContentHashing) {
            try {
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                const content = await fs.readFile((0, path_1.join)(this.workingDirectory, filePath), 'utf-8');
                const contentHash = this.calculateContentHash(content);
                if (cached.contentHash !== contentHash) {
                    this.cache.delete(filePath);
                    return null;
                }
            }
            catch {
                this.cache.delete(filePath);
                return null;
            }
        }
        // Update access statistics
        cached.accessCount++;
        cached.lastAccessed = now;
        return cached;
    }
    /**
     * Parse document without cache
     */
    async parseDocumentFresh(filePath) {
        try {
            const fullPath = (0, path_1.join)(this.workingDirectory, filePath);
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            const content = await fs.readFile(fullPath, 'utf-8');
            const stats = (0, fs_1.statSync)(fullPath);
            // Get the commit that last modified this file
            const gitCommit = this.getFileLastCommit(filePath);
            // Extract metadata from the document
            const metadata = this.extractDocumentMetadata(content, filePath);
            return {
                path: filePath,
                content,
                lastModified: stats.mtime,
                gitCommit,
                metadata
            };
        }
        catch (error) {
            throw new Error(`Failed to parse document ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Cache parsed document
     */
    async cacheDocument(filePath, document, fileStats, parseTime) {
        // Check cache size limits
        if (this.cache.size >= this.config.maxCacheSize) {
            this.evictLeastRecentlyUsed();
        }
        const contentHash = this.config.enableContentHashing
            ? this.calculateContentHash(document.content)
            : '';
        const cacheEntry = {
            document,
            contentHash,
            fileSize: fileStats.size,
            lastModified: fileStats.mtime.getTime(),
            parseTime,
            accessCount: 1,
            lastAccessed: Date.now()
        };
        this.cache.set(filePath, cacheEntry);
    }
    /**
     * Calculate content hash for change detection
     */
    calculateContentHash(content) {
        return (0, crypto_1.createHash)('sha256').update(content).digest('hex');
    }
    /**
     * Evict least recently used cache entries
     */
    evictLeastRecentlyUsed() {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        // Remove oldest 25% of entries
        const toRemove = Math.ceil(entries.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i][0]);
        }
    }
    /**
     * Extract metadata from completion document content
     */
    extractDocumentMetadata(content, filePath) {
        const metadata = {
            title: '',
            type: 'other'
        };
        // Extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }
        // Extract metadata from document header
        const dateMatch = content.match(/\*\*Date\*\*:\s*(.+)$/m);
        if (dateMatch) {
            metadata.date = dateMatch[1].trim();
        }
        const taskMatch = content.match(/\*\*Task\*\*:\s*(.+)$/m);
        if (taskMatch) {
            metadata.task = taskMatch[1].trim();
        }
        const specMatch = content.match(/\*\*Spec\*\*:\s*(.+)$/m);
        if (specMatch) {
            metadata.spec = specMatch[1].trim();
        }
        const statusMatch = content.match(/\*\*Status\*\*:\s*(.+)$/m);
        if (statusMatch) {
            metadata.status = statusMatch[1].trim();
        }
        // Determine document type based on path and content
        if (filePath.includes('task-') && filePath.includes('-completion.md')) {
            metadata.type = 'task-completion';
        }
        else if (filePath.includes('spec-completion')) {
            metadata.type = 'spec-completion';
        }
        return metadata;
    }
    /**
     * Get the commit that last modified a file
     */
    getFileLastCommit(filePath) {
        try {
            const { execSync } = require('child_process');
            return execSync(`git log -1 --format=%H -- "${filePath}"`, {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
        }
        catch {
            return '';
        }
    }
    /**
     * Get cache statistics
     * Requirement 5.4: Progress reporting and performance metrics
     */
    getCacheStats() {
        const entries = Array.from(this.cache.values());
        const totalParseTime = entries.reduce((sum, entry) => sum + entry.parseTime, 0);
        const averageParseTime = entries.length > 0 ? totalParseTime / entries.length : 0;
        const cacheSizeBytes = entries.reduce((sum, entry) => sum + entry.fileSize, 0);
        const timestamps = entries.map(e => e.lastAccessed);
        const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : null;
        const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : null;
        const totalRequests = this.stats.cacheHits + this.stats.cacheMisses;
        const cacheHitRate = totalRequests > 0 ? this.stats.cacheHits / totalRequests : 0;
        return {
            totalDocuments: this.stats.documentsProcessed,
            cachedDocuments: this.cache.size,
            cacheHitRate,
            totalParseTime: this.stats.totalParseTime,
            averageParseTime,
            cacheSizeBytes,
            oldestEntry,
            newestEntry
        };
    }
    /**
     * Clear cache and reset statistics
     */
    clear() {
        this.cache.clear();
        this.stats = {
            totalRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalParseTime: 0,
            documentsProcessed: 0
        };
    }
    /**
     * Prune old cache entries
     */
    pruneOldEntries() {
        const now = Date.now();
        let pruned = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.lastAccessed > this.config.maxCacheAgeMs) {
                this.cache.delete(key);
                pruned++;
            }
        }
        return pruned;
    }
    /**
     * Get most frequently accessed documents
     */
    getMostAccessedDocuments(limit = 10) {
        const entries = Array.from(this.cache.entries());
        return entries
            .map(([path, entry]) => ({
            path,
            accessCount: entry.accessCount,
            parseTime: entry.parseTime
        }))
            .sort((a, b) => b.accessCount - a.accessCount)
            .slice(0, limit);
    }
    /**
     * Preload documents into cache
     */
    async preloadDocuments(filePaths) {
        const results = await this.parseDocumentsParallel(filePaths);
        console.log(`Preloaded ${results.length} documents into cache`);
    }
}
exports.DocumentParsingCache = DocumentParsingCache;
//# sourceMappingURL=DocumentParsingCache.js.map