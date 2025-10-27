"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPerformanceOptimizer = void 0;
const child_process_1 = require("child_process");
const PerformanceMonitor_1 = require("../../performance/PerformanceMonitor");
const CachingStrategy_1 = require("../../performance/CachingStrategy");
/**
 * Git Performance Optimizer for large repositories
 *
 * Implements efficient Git history analysis with caching, batching, and parallel processing
 * to handle large repositories with thousands of commits and files.
 *
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.4: Progress reporting for long-running analysis
 */
class GitPerformanceOptimizer {
    constructor(workingDirectory = process.cwd(), config = {}) {
        this.workingDirectory = workingDirectory;
        this.config = {
            maxCommitsPerBatch: 100,
            enableShallowClone: false,
            useGitCache: true,
            parallelFileProcessing: true,
            maxConcurrentOperations: 4,
            cacheExpirationMs: 30 * 60 * 1000, // 30 minutes
            ...config
        };
        this.performanceMonitor = new PerformanceMonitor_1.PerformanceMonitor();
        this.cachingStrategy = new CachingStrategy_1.CachingStrategy();
    }
    /**
     * Find last release with performance optimization
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    async findLastReleaseOptimized() {
        const cacheKey = 'last-release-tag';
        return await this.performanceMonitor.measure('findLastReleaseOptimized', async () => {
            // Check cache first
            if (this.config.useGitCache) {
                const cached = this.cachingStrategy.getCachedValidation(cacheKey);
                if (cached) {
                    return {
                        data: cached,
                        performanceMetrics: {
                            duration: 0,
                            cacheHit: true,
                            processedItems: 0
                        }
                    };
                }
            }
            // Use shallow operations for better performance
            const gitCommand = this.config.enableShallowClone
                ? 'tag -l --sort=-version:refname --merged HEAD'
                : 'tag -l --sort=-version:refname';
            const tagOutput = this.executeGitCommand(gitCommand);
            if (!tagOutput.trim()) {
                const result = null;
                if (this.config.useGitCache) {
                    this.cachingStrategy.cacheValidation(cacheKey, result);
                }
                return {
                    data: result,
                    performanceMetrics: {
                        duration: 0,
                        cacheHit: false,
                        processedItems: 0
                    }
                };
            }
            const tags = tagOutput.trim().split('\n');
            // Process tags in batches for large repositories
            const batches = this.createBatches(tags, Math.min(50, this.config.maxCommitsPerBatch));
            for (const batch of batches) {
                for (const tagName of batch.items) {
                    if (this.isReleaseTag(tagName)) {
                        const tagInfo = await this.getTagInfoOptimized(tagName);
                        if (tagInfo) {
                            if (this.config.useGitCache) {
                                this.cachingStrategy.cacheValidation(cacheKey, tagInfo);
                            }
                            return {
                                data: tagInfo,
                                performanceMetrics: {
                                    duration: batch.processingTime,
                                    cacheHit: false,
                                    batchCount: batches.length,
                                    processedItems: tags.length
                                }
                            };
                        }
                    }
                }
            }
            const result = null;
            if (this.config.useGitCache) {
                this.cachingStrategy.cacheValidation(cacheKey, result);
            }
            return {
                data: result,
                performanceMetrics: {
                    duration: 0,
                    cacheHit: false,
                    batchCount: batches.length,
                    processedItems: tags.length
                }
            };
        }).then(({ result, metric }) => ({
            ...result,
            performanceMetrics: {
                ...result.performanceMetrics,
                duration: metric.duration
            }
        }));
    }
    /**
     * Get changes since reference with batching and parallel processing
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    async getChangesSinceOptimized(reference) {
        const cacheKey = `changes-since-${reference}`;
        return await this.performanceMonitor.measure('getChangesSinceOptimized', async () => {
            // Check cache first
            if (this.config.useGitCache) {
                const cached = this.cachingStrategy.getCachedValidation(cacheKey);
                if (cached) {
                    return {
                        data: cached,
                        performanceMetrics: {
                            duration: 0,
                            cacheHit: true,
                            processedItems: 0
                        }
                    };
                }
            }
            const toCommit = this.executeGitCommand('rev-parse HEAD').trim();
            const fromCommit = this.executeGitCommand(`rev-parse ${reference}`).trim();
            // Use parallel processing for commits and file changes
            const [commits, fileChanges] = await Promise.all([
                this.getCommitsSinceOptimized(reference),
                this.getFileChangesSinceOptimized(reference)
            ]);
            // Determine time range
            const fromDate = this.getCommitDate(fromCommit);
            const toDate = new Date();
            const result = {
                commits: commits.data,
                addedFiles: fileChanges.data.added,
                modifiedFiles: fileChanges.data.modified,
                deletedFiles: fileChanges.data.deleted,
                timeRange: { from: fromDate, to: toDate }
            };
            if (this.config.useGitCache) {
                this.cachingStrategy.cacheValidation(cacheKey, result);
            }
            return {
                data: result,
                performanceMetrics: {
                    duration: Math.max(commits.performanceMetrics.duration, fileChanges.performanceMetrics.duration),
                    cacheHit: false,
                    batchCount: (commits.performanceMetrics.batchCount || 0) + (fileChanges.performanceMetrics.batchCount || 0),
                    processedItems: commits.performanceMetrics.processedItems + fileChanges.performanceMetrics.processedItems
                }
            };
        }).then(({ result, metric }) => ({
            ...result,
            performanceMetrics: {
                ...result.performanceMetrics,
                duration: metric.duration
            }
        }));
    }
    /**
     * Get commits since reference with batching
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    async getCommitsSinceOptimized(reference) {
        return await this.performanceMonitor.measure('getCommitsSinceOptimized', async () => {
            // Use --oneline for initial count to avoid loading full commit data
            const commitCountOutput = this.executeGitCommand(`rev-list --count ${reference}..HEAD`);
            const totalCommits = parseInt(commitCountOutput.trim(), 10) || 0;
            if (totalCommits === 0) {
                return {
                    data: [],
                    performanceMetrics: {
                        duration: 0,
                        cacheHit: false,
                        processedItems: 0
                    }
                };
            }
            // Process commits in batches to avoid memory issues
            const commits = [];
            const batchSize = this.config.maxCommitsPerBatch;
            const totalBatches = Math.ceil(totalCommits / batchSize);
            for (let i = 0; i < totalBatches; i++) {
                const skip = i * batchSize;
                const batch = await this.getCommitBatch(reference, skip, batchSize);
                commits.push(...batch.items);
            }
            return {
                data: commits,
                performanceMetrics: {
                    duration: 0, // Will be set by outer measure
                    cacheHit: false,
                    batchCount: totalBatches,
                    processedItems: totalCommits
                }
            };
        }).then(({ result, metric }) => ({
            ...result,
            performanceMetrics: {
                ...result.performanceMetrics,
                duration: metric.duration
            }
        }));
    }
    /**
     * Get file changes since reference with optimization
     * Requirement 5.1: Efficient Git history analysis for large repos
     */
    async getFileChangesSinceOptimized(reference) {
        return await this.performanceMonitor.measure('getFileChangesSinceOptimized', async () => {
            // Use --name-status for efficient file change detection
            const diffOutput = this.executeGitCommand(`diff --name-status ${reference}..HEAD`);
            const added = [];
            const modified = [];
            const deleted = [];
            if (!diffOutput.trim()) {
                return {
                    data: { added, modified, deleted },
                    performanceMetrics: {
                        duration: 0,
                        cacheHit: false,
                        processedItems: 0
                    }
                };
            }
            const lines = diffOutput.trim().split('\n');
            // Process file changes in parallel batches
            if (this.config.parallelFileProcessing && lines.length > 100) {
                const batches = this.createBatches(lines, 50);
                const results = await Promise.all(batches.map(batch => this.processFileChangeBatch(batch)));
                for (const result of results) {
                    added.push(...result.added);
                    modified.push(...result.modified);
                    deleted.push(...result.deleted);
                }
            }
            else {
                // Process sequentially for smaller sets
                for (const line of lines) {
                    const [status, ...pathParts] = line.split('\t');
                    const path = pathParts.join('\t');
                    switch (status[0]) {
                        case 'A':
                            added.push(path);
                            break;
                        case 'M':
                            modified.push(path);
                            break;
                        case 'D':
                            deleted.push(path);
                            break;
                        case 'R':
                        case 'C':
                            modified.push(path);
                            break;
                    }
                }
            }
            return {
                data: { added, modified, deleted },
                performanceMetrics: {
                    duration: 0, // Will be set by outer measure
                    cacheHit: false,
                    processedItems: lines.length
                }
            };
        }).then(({ result, metric }) => ({
            ...result,
            performanceMetrics: {
                ...result.performanceMetrics,
                duration: metric.duration
            }
        }));
    }
    /**
     * Get tag information with caching
     */
    async getTagInfoOptimized(tagName) {
        const cacheKey = `tag-info-${tagName}`;
        if (this.config.useGitCache) {
            const cached = this.cachingStrategy.getCachedValidation(cacheKey);
            if (cached) {
                return cached;
            }
        }
        try {
            const commit = this.executeGitCommand(`rev-list -n 1 ${tagName}`).trim();
            const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
            const date = new Date(dateStr);
            // Try to get tag message (for annotated tags)
            let message;
            try {
                message = this.executeGitCommand(`tag -l --format='%(contents)' ${tagName}`).trim();
                if (!message) {
                    message = undefined;
                }
            }
            catch {
                message = undefined;
            }
            const tagInfo = {
                name: tagName,
                commit,
                date,
                message
            };
            if (this.config.useGitCache) {
                this.cachingStrategy.cacheValidation(cacheKey, tagInfo);
            }
            return tagInfo;
        }
        catch {
            return null;
        }
    }
    /**
     * Get a batch of commits with efficient processing
     */
    async getCommitBatch(reference, skip, limit) {
        const startTime = Date.now();
        const commits = [];
        const errors = [];
        try {
            const commitOutput = this.executeGitCommand(`log ${reference}..HEAD --format="%H|%h|%an|%ci|%s" --name-only --skip=${skip} --max-count=${limit}`);
            if (!commitOutput.trim()) {
                return {
                    items: commits,
                    batchIndex: Math.floor(skip / limit),
                    totalBatches: 1,
                    processingTime: Date.now() - startTime,
                    errors
                };
            }
            // Split by double newlines to separate commits
            const sections = commitOutput.split('\n\n').filter(section => section.trim());
            for (const section of sections) {
                try {
                    const lines = section.trim().split('\n');
                    if (lines.length === 0)
                        continue;
                    // First line contains commit info
                    const commitLine = lines[0];
                    if (!commitLine.includes('|'))
                        continue;
                    const parts = commitLine.split('|');
                    if (parts.length < 5)
                        continue;
                    const [hash, shortHash, author, dateStr, ...messageParts] = parts;
                    const message = messageParts.join('|');
                    // Remaining lines are file names
                    const files = lines.slice(1).filter(line => line.trim() && !line.includes('|'));
                    commits.push({
                        hash: hash.trim(),
                        shortHash: shortHash.trim(),
                        author: author.trim(),
                        date: new Date(dateStr.trim()),
                        message: message.trim(),
                        files
                    });
                }
                catch (error) {
                    errors.push(`Failed to parse commit in batch: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        catch (error) {
            errors.push(`Batch processing failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            items: commits,
            batchIndex: Math.floor(skip / limit),
            totalBatches: 1, // Will be calculated by caller
            processingTime: Date.now() - startTime,
            errors
        };
    }
    /**
     * Process file change batch in parallel
     */
    async processFileChangeBatch(batch) {
        const added = [];
        const modified = [];
        const deleted = [];
        for (const line of batch.items) {
            const [status, ...pathParts] = line.split('\t');
            const path = pathParts.join('\t');
            switch (status[0]) {
                case 'A':
                    added.push(path);
                    break;
                case 'M':
                    modified.push(path);
                    break;
                case 'D':
                    deleted.push(path);
                    break;
                case 'R':
                case 'C':
                    modified.push(path);
                    break;
            }
        }
        return { added, modified, deleted };
    }
    /**
     * Create batches from array of items
     */
    createBatches(items, batchSize) {
        const batches = [];
        const totalBatches = Math.ceil(items.length / batchSize);
        for (let i = 0; i < items.length; i += batchSize) {
            const batchItems = items.slice(i, i + batchSize);
            batches.push({
                items: batchItems,
                batchIndex: Math.floor(i / batchSize),
                totalBatches,
                processingTime: 0, // Will be set during processing
                errors: []
            });
        }
        return batches;
    }
    /**
     * Check if a tag name looks like a release tag
     */
    isReleaseTag(tagName) {
        const semverPattern = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?$/;
        return semverPattern.test(tagName);
    }
    /**
     * Get commit date for a specific commit
     */
    getCommitDate(commit) {
        try {
            const dateStr = this.executeGitCommand(`log -1 --format=%ci ${commit}`).trim();
            return new Date(dateStr);
        }
        catch {
            return new Date();
        }
    }
    /**
     * Execute a Git command and return output
     */
    executeGitCommand(command) {
        try {
            return (0, child_process_1.execSync)(`git ${command}`, {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });
        }
        catch (error) {
            throw new Error(`Git command failed: git ${command}`);
        }
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return this.performanceMonitor.generateReport();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return this.cachingStrategy.getStats();
    }
    /**
     * Clear caches and reset performance metrics
     */
    reset() {
        this.performanceMonitor.clear();
        this.cachingStrategy.invalidateAll();
    }
    /**
     * Prune old cache entries
     */
    pruneCaches() {
        return this.cachingStrategy.pruneOldEntries(this.config.cacheExpirationMs);
    }
}
exports.GitPerformanceOptimizer = GitPerformanceOptimizer;
//# sourceMappingURL=GitPerformanceOptimizer.js.map