"use strict";
/**
 * File Generation Optimizer
 *
 * Optimizes platform-specific file generation for speed and efficiency.
 * Implements parallel generation, incremental updates, and output optimization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileGenerationOptimizer = void 0;
const CachingStrategy_1 = require("./CachingStrategy");
/**
 * File Generation Optimizer for performance optimization
 */
class FileGenerationOptimizer {
    constructor(cache) {
        this.previousTokenHashes = new Map();
        this.cache = cache || new CachingStrategy_1.CachingStrategy();
    }
    /**
     * Optimize file generation across platforms
     */
    async optimizeGeneration(tokens, platforms, generator, options = {}) {
        const { enableParallel = true, enableIncremental = true, enableCaching = true, maxParallel = 3 } = options;
        // Filter tokens for incremental generation
        const tokensToGenerate = enableIncremental
            ? this.filterChangedTokens(tokens)
            : tokens;
        // Check cache for existing generation results
        if (enableCaching && tokensToGenerate.length === 0) {
            const cachedResults = this.getCachedResults(platforms);
            if (cachedResults.length === platforms.length) {
                return cachedResults;
            }
        }
        // Create generation tasks
        const tasks = this.createGenerationTasks(tokensToGenerate, platforms);
        // Execute generation
        const results = enableParallel
            ? await this.generateParallel(tasks, generator, maxParallel)
            : await this.generateSequential(tasks, generator);
        // Cache results
        if (enableCaching) {
            this.cacheResults(results);
        }
        // Update token hashes for incremental generation
        if (enableIncremental) {
            this.updateTokenHashes(tokens);
        }
        return results;
    }
    /**
     * Generate files in parallel
     */
    async generateParallel(tasks, generator, maxParallel) {
        const results = [];
        const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);
        // Process tasks in batches
        for (let i = 0; i < sortedTasks.length; i += maxParallel) {
            const batch = sortedTasks.slice(i, i + maxParallel);
            const batchPromises = batch.map(task => generator(task.platform, task.tokens));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }
        return results;
    }
    /**
     * Generate files sequentially
     */
    async generateSequential(tasks, generator) {
        const results = [];
        const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);
        for (const task of sortedTasks) {
            const result = await generator(task.platform, task.tokens);
            results.push(result);
        }
        return results;
    }
    /**
     * Create generation tasks with priorities
     */
    createGenerationTasks(tokens, platforms) {
        // Prioritize platforms based on typical usage
        const platformPriorities = {
            web: 3,
            ios: 2,
            android: 1
        };
        return platforms.map(platform => ({
            platform,
            tokens,
            priority: platformPriorities[platform] || 0
        }));
    }
    /**
     * Filter tokens that have changed since last generation
     */
    filterChangedTokens(tokens) {
        return tokens.filter(token => {
            const currentHash = this.hashToken(token);
            const previousHash = this.previousTokenHashes.get(token.name);
            return currentHash !== previousHash;
        });
    }
    /**
     * Update token hashes for incremental generation
     */
    updateTokenHashes(tokens) {
        tokens.forEach(token => {
            const hash = this.hashToken(token);
            this.previousTokenHashes.set(token.name, hash);
        });
    }
    /**
     * Generate hash for token
     */
    hashToken(token) {
        // Simple hash based on token properties
        const tokenStr = JSON.stringify({
            name: token.name,
            category: token.category,
            ...(('baseValue' in token) ? { baseValue: token.baseValue } : {}),
            ...(('primitiveReference' in token) ? { primitiveReference: token.primitiveReference } : {})
        });
        // Simple string hash
        let hash = 0;
        for (let i = 0; i < tokenStr.length; i++) {
            const char = tokenStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }
    /**
     * Get cached generation results
     */
    getCachedResults(platforms) {
        const results = [];
        for (const platform of platforms) {
            const cacheKey = `generation:${platform}`;
            const cached = this.cache.getCachedGeneration(cacheKey);
            if (cached) {
                results.push(JSON.parse(cached));
            }
        }
        return results;
    }
    /**
     * Cache generation results
     */
    cacheResults(results) {
        results.forEach(result => {
            const cacheKey = `generation:${result.platform}`;
            this.cache.cacheGeneration(cacheKey, JSON.stringify(result));
        });
    }
    /**
     * Optimize output content
     */
    optimizeOutput(content, options = {}) {
        const { enableMinification = false } = options;
        if (!enableMinification) {
            return content;
        }
        // Remove extra whitespace
        let optimized = content.replace(/\n\s*\n/g, '\n');
        // Remove trailing whitespace
        optimized = optimized.replace(/[ \t]+$/gm, '');
        // Remove comments (simple implementation)
        optimized = optimized.replace(/\/\*[\s\S]*?\*\//g, '');
        optimized = optimized.replace(/\/\/.*/g, '');
        return optimized;
    }
    /**
     * Batch token processing for efficiency
     */
    batchTokens(tokens, batchSize = 50) {
        const batches = [];
        for (let i = 0; i < tokens.length; i += batchSize) {
            batches.push(tokens.slice(i, i + batchSize));
        }
        return batches;
    }
    /**
     * Clear optimization caches
     */
    clearCaches() {
        this.previousTokenHashes.clear();
        this.cache.invalidateAll();
    }
    /**
     * Get optimization statistics
     */
    getStats() {
        return {
            cachedTokens: this.previousTokenHashes.size,
            cacheStats: this.cache.getStats()
        };
    }
}
exports.FileGenerationOptimizer = FileGenerationOptimizer;
//# sourceMappingURL=FileGenerationOptimizer.js.map