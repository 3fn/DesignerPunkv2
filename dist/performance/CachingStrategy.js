"use strict";
/**
 * Caching Strategy
 *
 * Implements efficient caching for token generation to reduce redundant processing.
 * Handles cache invalidation, versioning, and cache hit/miss tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingStrategy = void 0;
/**
 * Caching Strategy for token generation optimization
 */
class CachingStrategy {
    constructor() {
        this.tokenCache = new Map();
        this.generationCache = new Map();
        this.validationCache = new Map();
        this.hits = 0;
        this.misses = 0;
        this.currentVersion = '1.0.0';
    }
    /**
     * Set cache version for invalidation
     */
    setVersion(version) {
        if (version !== this.currentVersion) {
            this.currentVersion = version;
            this.invalidateAll();
        }
    }
    /**
     * Get current cache version
     */
    getVersion() {
        return this.currentVersion;
    }
    // ============================================================================
    // Token Caching
    // ============================================================================
    /**
     * Cache a token
     */
    cacheToken(key, token) {
        this.tokenCache.set(key, {
            value: token,
            timestamp: Date.now(),
            version: this.currentVersion,
            hits: 0
        });
    }
    /**
     * Get cached token
     */
    getCachedToken(key) {
        const entry = this.tokenCache.get(key);
        if (!entry) {
            this.misses++;
            return null;
        }
        // Check version compatibility
        if (entry.version !== this.currentVersion) {
            this.tokenCache.delete(key);
            this.misses++;
            return null;
        }
        // Update hit count
        entry.hits++;
        this.hits++;
        return entry.value;
    }
    /**
     * Check if token is cached
     */
    hasToken(key) {
        const entry = this.tokenCache.get(key);
        return entry !== undefined && entry.version === this.currentVersion;
    }
    /**
     * Invalidate token cache
     */
    invalidateToken(key) {
        this.tokenCache.delete(key);
    }
    // ============================================================================
    // Generation Result Caching
    // ============================================================================
    /**
     * Cache generation result
     */
    cacheGeneration(key, content) {
        this.generationCache.set(key, {
            value: content,
            timestamp: Date.now(),
            version: this.currentVersion,
            hits: 0
        });
    }
    /**
     * Get cached generation result
     */
    getCachedGeneration(key) {
        const entry = this.generationCache.get(key);
        if (!entry) {
            this.misses++;
            return null;
        }
        // Check version compatibility
        if (entry.version !== this.currentVersion) {
            this.generationCache.delete(key);
            this.misses++;
            return null;
        }
        // Update hit count
        entry.hits++;
        this.hits++;
        return entry.value;
    }
    /**
     * Check if generation result is cached
     */
    hasGeneration(key) {
        const entry = this.generationCache.get(key);
        return entry !== undefined && entry.version === this.currentVersion;
    }
    /**
     * Invalidate generation cache
     */
    invalidateGeneration(key) {
        this.generationCache.delete(key);
    }
    // ============================================================================
    // Validation Result Caching
    // ============================================================================
    /**
     * Cache validation result
     */
    cacheValidation(key, result) {
        this.validationCache.set(key, {
            value: result,
            timestamp: Date.now(),
            version: this.currentVersion,
            hits: 0
        });
    }
    /**
     * Get cached validation result
     */
    getCachedValidation(key) {
        const entry = this.validationCache.get(key);
        if (!entry) {
            this.misses++;
            return null;
        }
        // Check version compatibility
        if (entry.version !== this.currentVersion) {
            this.validationCache.delete(key);
            this.misses++;
            return null;
        }
        // Update hit count
        entry.hits++;
        this.hits++;
        return entry.value;
    }
    /**
     * Check if validation result is cached
     */
    hasValidation(key) {
        const entry = this.validationCache.get(key);
        return entry !== undefined && entry.version === this.currentVersion;
    }
    /**
     * Invalidate validation cache
     */
    invalidateValidation(key) {
        this.validationCache.delete(key);
    }
    // ============================================================================
    // Cache Management
    // ============================================================================
    /**
     * Invalidate all caches
     */
    invalidateAll() {
        this.tokenCache.clear();
        this.generationCache.clear();
        this.validationCache.clear();
        this.resetStats();
    }
    /**
     * Invalidate caches by pattern
     */
    invalidateByPattern(pattern) {
        // Invalidate matching token cache entries
        for (const key of this.tokenCache.keys()) {
            if (pattern.test(key)) {
                this.tokenCache.delete(key);
            }
        }
        // Invalidate matching generation cache entries
        for (const key of this.generationCache.keys()) {
            if (pattern.test(key)) {
                this.generationCache.delete(key);
            }
        }
        // Invalidate matching validation cache entries
        for (const key of this.validationCache.keys()) {
            if (pattern.test(key)) {
                this.validationCache.delete(key);
            }
        }
    }
    /**
     * Prune old cache entries
     */
    pruneOldEntries(maxAgeMs) {
        const now = Date.now();
        let pruned = 0;
        // Prune token cache
        for (const [key, entry] of this.tokenCache.entries()) {
            if (now - entry.timestamp > maxAgeMs) {
                this.tokenCache.delete(key);
                pruned++;
            }
        }
        // Prune generation cache
        for (const [key, entry] of this.generationCache.entries()) {
            if (now - entry.timestamp > maxAgeMs) {
                this.generationCache.delete(key);
                pruned++;
            }
        }
        // Prune validation cache
        for (const [key, entry] of this.validationCache.entries()) {
            if (now - entry.timestamp > maxAgeMs) {
                this.validationCache.delete(key);
                pruned++;
            }
        }
        return pruned;
    }
    /**
     * Prune least recently used entries
     */
    pruneLRU(maxSize) {
        let pruned = 0;
        // Prune token cache
        if (this.tokenCache.size > maxSize) {
            const entries = Array.from(this.tokenCache.entries())
                .sort((a, b) => a[1].hits - b[1].hits);
            const toRemove = entries.slice(0, this.tokenCache.size - maxSize);
            toRemove.forEach(([key]) => {
                this.tokenCache.delete(key);
                pruned++;
            });
        }
        // Prune generation cache
        if (this.generationCache.size > maxSize) {
            const entries = Array.from(this.generationCache.entries())
                .sort((a, b) => a[1].hits - b[1].hits);
            const toRemove = entries.slice(0, this.generationCache.size - maxSize);
            toRemove.forEach(([key]) => {
                this.generationCache.delete(key);
                pruned++;
            });
        }
        // Prune validation cache
        if (this.validationCache.size > maxSize) {
            const entries = Array.from(this.validationCache.entries())
                .sort((a, b) => a[1].hits - b[1].hits);
            const toRemove = entries.slice(0, this.validationCache.size - maxSize);
            toRemove.forEach(([key]) => {
                this.validationCache.delete(key);
                pruned++;
            });
        }
        return pruned;
    }
    // ============================================================================
    // Cache Statistics
    // ============================================================================
    /**
     * Get cache statistics
     */
    getStats() {
        const totalSize = this.tokenCache.size + this.generationCache.size + this.validationCache.size;
        const totalRequests = this.hits + this.misses;
        const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;
        // Find oldest and newest entries
        const allEntries = [
            ...Array.from(this.tokenCache.values()),
            ...Array.from(this.generationCache.values()),
            ...Array.from(this.validationCache.values())
        ];
        const timestamps = allEntries.map(e => e.timestamp);
        const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : null;
        const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : null;
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate,
            size: totalSize,
            oldestEntry,
            newestEntry
        };
    }
    /**
     * Reset cache statistics
     */
    resetStats() {
        this.hits = 0;
        this.misses = 0;
    }
    /**
     * Get cache size breakdown
     */
    getSizeBreakdown() {
        return {
            tokens: this.tokenCache.size,
            generations: this.generationCache.size,
            validations: this.validationCache.size,
            total: this.tokenCache.size + this.generationCache.size + this.validationCache.size
        };
    }
    /**
     * Get most frequently accessed entries
     */
    getMostAccessed(limit = 10) {
        const allEntries = [];
        // Collect token cache entries
        for (const [key, entry] of this.tokenCache.entries()) {
            allEntries.push({ key, hits: entry.hits, type: 'token' });
        }
        // Collect generation cache entries
        for (const [key, entry] of this.generationCache.entries()) {
            allEntries.push({ key, hits: entry.hits, type: 'generation' });
        }
        // Collect validation cache entries
        for (const [key, entry] of this.validationCache.entries()) {
            allEntries.push({ key, hits: entry.hits, type: 'validation' });
        }
        return allEntries
            .sort((a, b) => b.hits - a.hits)
            .slice(0, limit);
    }
}
exports.CachingStrategy = CachingStrategy;
//# sourceMappingURL=CachingStrategy.js.map