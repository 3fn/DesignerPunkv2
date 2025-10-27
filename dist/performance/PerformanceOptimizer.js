"use strict";
/**
 * Performance Optimizer
 *
 * Coordinates all performance optimization strategies for token generation.
 * Integrates caching, monitoring, and file generation optimization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceOptimizer = void 0;
const PerformanceMonitor_1 = require("./PerformanceMonitor");
const CachingStrategy_1 = require("./CachingStrategy");
const FileGenerationOptimizer_1 = require("./FileGenerationOptimizer");
/**
 * Performance Optimizer coordinator
 */
class PerformanceOptimizer {
    constructor(config = {}) {
        this.config = {
            targetGenerationTime: config.targetGenerationTime || 5,
            enableMonitoring: config.enableMonitoring !== false,
            enableCaching: config.enableCaching !== false,
            cacheVersion: config.cacheVersion || '1.0.0',
            optimizationOptions: config.optimizationOptions || {}
        };
        this.monitor = new PerformanceMonitor_1.PerformanceMonitor();
        this.cache = new CachingStrategy_1.CachingStrategy();
        this.fileOptimizer = new FileGenerationOptimizer_1.FileGenerationOptimizer(this.cache);
        // Set cache version
        this.cache.setVersion(this.config.cacheVersion);
    }
    /**
     * Optimize token generation with performance monitoring
     */
    async optimizeGeneration(tokens, platforms, generator) {
        // Start overall timing
        this.monitor.startOperation('total_generation');
        try {
            // Optimize file generation
            const outputs = await this.fileOptimizer.optimizeGeneration(tokens, platforms, generator, {
                ...this.config.optimizationOptions,
                enableCaching: this.config.enableCaching
            });
            // End timing
            const metric = this.monitor.endOperation('total_generation', {
                tokenCount: tokens.length,
                platformCount: platforms.length
            });
            if (!metric) {
                throw new Error('Failed to record performance metric');
            }
            // Check if meets performance target
            const meetsTarget = metric.duration <= this.config.targetGenerationTime;
            // Generate reports
            const performanceReport = this.monitor.generateReport();
            const cacheStats = this.cache.getStats();
            const optimizationStats = this.fileOptimizer.getStats();
            return {
                success: true,
                meetsTarget,
                totalDuration: metric.duration,
                targetDuration: this.config.targetGenerationTime,
                outputs,
                performanceReport,
                cacheStats,
                optimizationStats
            };
        }
        catch (error) {
            this.monitor.endOperation('total_generation', { error: true });
            throw error;
        }
    }
    /**
     * Optimize single platform generation
     */
    async optimizePlatformGeneration(platform, tokens, generator) {
        const operationName = `platform_generation_${platform}`;
        this.monitor.startOperation(operationName);
        try {
            // Check cache first
            if (this.config.enableCaching) {
                const cacheKey = `generation:${platform}`;
                const cached = this.cache.getCachedGeneration(cacheKey);
                if (cached) {
                    this.monitor.endOperation(operationName, { cached: true });
                    return JSON.parse(cached);
                }
            }
            // Generate output
            const output = await generator(platform, tokens);
            // Cache result
            if (this.config.enableCaching) {
                const cacheKey = `generation:${platform}`;
                this.cache.cacheGeneration(cacheKey, JSON.stringify(output));
            }
            this.monitor.endOperation(operationName, {
                tokenCount: tokens.length,
                cached: false
            });
            return output;
        }
        catch (error) {
            this.monitor.endOperation(operationName, { error: true });
            throw error;
        }
    }
    /**
     * Optimize token validation
     */
    async optimizeValidation(key, validator) {
        const operationName = `validation_${key}`;
        this.monitor.startOperation(operationName);
        try {
            // Check cache first
            if (this.config.enableCaching) {
                const cached = this.cache.getCachedValidation(key);
                if (cached !== null) {
                    this.monitor.endOperation(operationName, { cached: true });
                    return cached;
                }
            }
            // Run validation
            const result = await validator();
            // Cache result
            if (this.config.enableCaching) {
                this.cache.cacheValidation(key, result);
            }
            this.monitor.endOperation(operationName, { cached: false });
            return result;
        }
        catch (error) {
            this.monitor.endOperation(operationName, { error: true });
            throw error;
        }
    }
    /**
     * Batch process tokens for efficiency
     */
    async batchProcess(tokens, processor, batchSize = 50) {
        this.monitor.startOperation('batch_processing');
        try {
            const batches = this.fileOptimizer.batchTokens(tokens, batchSize);
            const results = [];
            for (const batch of batches) {
                const batchResults = await processor(batch);
                results.push(...batchResults);
            }
            this.monitor.endOperation('batch_processing', {
                tokenCount: tokens.length,
                batchCount: batches.length,
                batchSize
            });
            return results;
        }
        catch (error) {
            this.monitor.endOperation('batch_processing', { error: true });
            throw error;
        }
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
            optimizationOptions: {
                ...this.config.optimizationOptions,
                ...config.optimizationOptions
            }
        };
        // Update cache version if changed
        if (config.cacheVersion && config.cacheVersion !== this.cache.getVersion()) {
            this.cache.setVersion(config.cacheVersion);
        }
    }
    /**
     * Get performance statistics
     */
    getStats() {
        return {
            performance: this.monitor.generateReport(),
            cache: this.cache.getStats(),
            optimization: this.fileOptimizer.getStats()
        };
    }
    /**
     * Check if performance meets target
     */
    meetsPerformanceTarget() {
        return this.monitor.meetsPerformanceTarget(this.config.targetGenerationTime);
    }
    /**
     * Get slow operations
     */
    getSlowOperations(thresholdMs) {
        const threshold = thresholdMs || this.config.targetGenerationTime;
        return this.monitor.getSlowOperations(threshold);
    }
    /**
     * Clear all caches and reset statistics
     */
    reset() {
        this.monitor.clear();
        this.cache.invalidateAll();
        this.fileOptimizer.clearCaches();
    }
    /**
     * Prune old cache entries
     */
    pruneCache(maxAgeMs = 3600000) {
        return this.cache.pruneOldEntries(maxAgeMs);
    }
    /**
     * Get performance summary
     */
    getSummary() {
        const perfSummary = this.monitor.getSummary();
        const cacheStats = this.cache.getStats();
        return {
            meetsTarget: perfSummary.average <= this.config.targetGenerationTime,
            targetMs: this.config.targetGenerationTime,
            averageMs: perfSummary.average,
            cacheHitRate: cacheStats.hitRate,
            totalOperations: this.monitor.getMetrics().length
        };
    }
    /**
     * Export performance data for analysis
     */
    exportData() {
        return {
            config: this.config,
            metrics: this.monitor.getMetrics(),
            cacheStats: this.cache.getStats(),
            summary: this.getSummary()
        };
    }
}
exports.PerformanceOptimizer = PerformanceOptimizer;
//# sourceMappingURL=PerformanceOptimizer.js.map