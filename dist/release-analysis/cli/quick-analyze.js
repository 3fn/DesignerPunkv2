#!/usr/bin/env node
"use strict";
/**
 * Quick Analysis Mode for Release Analysis System
 *
 * Optimized analysis mode that completes in <10 seconds for automatic hook integration.
 * Provides concise output suitable for AI agent feedback while caching full results.
 *
 * Requirements addressed:
 * - 9.2: Quick analysis mode completes in <10 seconds
 * - 9.3: Concise output suitable for AI agent feedback
 * - 9.7: Cache results for later CLI access
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
exports.QuickAnalyzer = void 0;
exports.runQuickAnalysisCLI = runQuickAnalysisCLI;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Quick Analysis Mode implementation
 */
class QuickAnalyzer {
    constructor(workingDirectory = process.cwd(), options = {}) {
        this.workingDirectory = workingDirectory;
        this.options = {
            timeoutMs: options.timeoutMs ?? 10000, // 10 seconds default
            skipDetailedExtraction: options.skipDetailedExtraction ?? true,
            cacheResults: options.cacheResults ?? true,
            cacheDir: options.cacheDir ?? (0, path_1.join)(workingDirectory, '.kiro/release-analysis/cache'),
            monitorPerformance: options.monitorPerformance ?? true
        };
        this.performanceMetrics = this.initializePerformanceMetrics();
    }
    /**
     * Run quick analysis with performance monitoring
     * Requirement 9.2: Complete in <10 seconds
     */
    async runQuickAnalysis() {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;
        try {
            // Set up timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Analysis timeout')), this.options.timeoutMs);
            });
            // Run analysis with timeout
            const analysisPromise = this.performQuickAnalysis();
            const result = await Promise.race([analysisPromise, timeoutPromise]);
            // Calculate final metrics
            const totalTime = Date.now() - startTime;
            const finalMemory = process.memoryUsage().heapUsed;
            this.performanceMetrics.totalTimeMs = totalTime;
            this.performanceMetrics.completedWithinTimeout = totalTime < this.options.timeoutMs;
            this.performanceMetrics.memoryUsage.final = finalMemory;
            return {
                ...result,
                performanceMetrics: this.options.monitorPerformance ? this.performanceMetrics : undefined
            };
        }
        catch (error) {
            // Return fallback result on timeout or error
            const totalTime = Date.now() - startTime;
            this.performanceMetrics.totalTimeMs = totalTime;
            this.performanceMetrics.completedWithinTimeout = false;
            return {
                versionBump: 'none',
                changeCount: {
                    breaking: 0,
                    features: 0,
                    fixes: 0,
                    improvements: 0
                },
                confidence: 0.1,
                summary: `Quick analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                fullResultCached: false,
                performanceMetrics: this.options.monitorPerformance ? this.performanceMetrics : undefined
            };
        }
    }
    /**
     * Perform quick analysis with optimizations
     */
    async performQuickAnalysis() {
        // Phase 1: Git Analysis (fast)
        const gitStartTime = Date.now();
        const { GitHistoryAnalyzer } = await Promise.resolve().then(() => __importStar(require('../git/GitHistoryAnalyzer')));
        const gitAnalyzer = new GitHistoryAnalyzer(this.workingDirectory);
        let lastRelease;
        try {
            lastRelease = await gitAnalyzer.findLastRelease();
        }
        catch {
            lastRelease = null;
        }
        const changes = lastRelease
            ? await gitAnalyzer.getChangesSince(lastRelease.name)
            : { commits: [], addedFiles: [], modifiedFiles: [], deletedFiles: [], timeRange: { from: new Date(), to: new Date() } };
        this.performanceMetrics.phaseTimings.gitAnalysis = Date.now() - gitStartTime;
        this.updatePeakMemory();
        // Phase 2: Document Collection (optimized)
        const collectionStartTime = Date.now();
        const documents = await gitAnalyzer.findCompletionDocuments(changes);
        this.performanceMetrics.phaseTimings.documentCollection = Date.now() - collectionStartTime;
        this.performanceMetrics.documentsProcessed = documents.length;
        this.updatePeakMemory();
        // Phase 3: Quick Change Extraction (simplified)
        const extractionStartTime = Date.now();
        const quickChanges = await this.performQuickExtraction(documents);
        this.performanceMetrics.phaseTimings.changeExtraction = Date.now() - extractionStartTime;
        this.updatePeakMemory();
        // Phase 4: Version Calculation (fast)
        const versionStartTime = Date.now();
        const versionBump = this.calculateQuickVersionBump(quickChanges);
        this.performanceMetrics.phaseTimings.versionCalculation = Date.now() - versionStartTime;
        // Phase 5: Cache full results if enabled
        const cachingStartTime = Date.now();
        let cacheFilePath;
        let fullResultCached = false;
        if (this.options.cacheResults) {
            try {
                // Run full analysis in background and cache
                cacheFilePath = await this.cacheFullAnalysis(documents, lastRelease);
                fullResultCached = true;
            }
            catch (error) {
                console.warn('Failed to cache full results:', error);
            }
        }
        this.performanceMetrics.phaseTimings.caching = Date.now() - cachingStartTime;
        // Generate concise summary
        const summary = this.generateConciseSummary(quickChanges, versionBump);
        return {
            versionBump,
            changeCount: quickChanges,
            confidence: this.calculateQuickConfidence(quickChanges, documents.length),
            summary,
            fullResultCached,
            cacheFilePath,
            performanceMetrics: this.options.monitorPerformance ? this.performanceMetrics : undefined
        };
    }
    /**
     * Perform quick extraction using simple pattern matching
     * Requirement 9.2: Optimized for speed
     */
    async performQuickExtraction(documents) {
        const counts = {
            breaking: 0,
            features: 0,
            fixes: 0,
            improvements: 0
        };
        // Simple pattern matching for speed
        const breakingPatterns = /breaking|incompatible|removed|deprecated/gi;
        const featurePatterns = /feature|new|add|implement/gi;
        const fixPatterns = /fix|bug|issue|resolve/gi;
        const improvementPatterns = /improve|enhance|optimize|refactor/gi;
        for (const doc of documents) {
            const content = doc.content || '';
            // Count pattern matches
            const breakingMatches = content.match(breakingPatterns);
            const featureMatches = content.match(featurePatterns);
            const fixMatches = content.match(fixPatterns);
            const improvementMatches = content.match(improvementPatterns);
            if (breakingMatches)
                counts.breaking += breakingMatches.length;
            if (featureMatches)
                counts.features += featureMatches.length;
            if (fixMatches)
                counts.fixes += fixMatches.length;
            if (improvementMatches)
                counts.improvements += improvementMatches.length;
        }
        // Normalize counts (avoid over-counting)
        counts.breaking = Math.min(counts.breaking, documents.length * 2);
        counts.features = Math.min(counts.features, documents.length * 3);
        counts.fixes = Math.min(counts.fixes, documents.length * 3);
        counts.improvements = Math.min(counts.improvements, documents.length * 3);
        return counts;
    }
    /**
     * Calculate quick version bump based on change counts
     * Requirement 9.2: Fast version calculation
     */
    calculateQuickVersionBump(changes) {
        if (changes.breaking > 0) {
            return 'major';
        }
        if (changes.features > 0) {
            return 'minor';
        }
        if (changes.fixes > 0 || changes.improvements > 0) {
            return 'patch';
        }
        return 'none';
    }
    /**
     * Calculate quick confidence score
     */
    calculateQuickConfidence(changes, documentCount) {
        if (documentCount === 0) {
            return 0.1;
        }
        const totalChanges = changes.breaking + changes.features + changes.fixes + changes.improvements;
        // Base confidence on document count and change detection
        let confidence = 0.5; // Base confidence for quick mode
        if (totalChanges > 0) {
            confidence += 0.2; // Found changes
        }
        if (documentCount >= 3) {
            confidence += 0.1; // Multiple documents analyzed
        }
        if (changes.breaking > 0) {
            confidence += 0.1; // Breaking changes are usually clear
        }
        return Math.min(confidence, 0.9); // Cap at 0.9 for quick mode
    }
    /**
     * Generate concise summary for AI agent feedback
     * Requirement 9.3: Concise output suitable for AI agent feedback
     */
    generateConciseSummary(changes, versionBump) {
        const totalChanges = changes.breaking + changes.features + changes.fixes + changes.improvements;
        if (totalChanges === 0) {
            return 'No significant changes detected';
        }
        const parts = [];
        if (changes.breaking > 0) {
            parts.push(`${changes.breaking} breaking change${changes.breaking > 1 ? 's' : ''}`);
        }
        if (changes.features > 0) {
            parts.push(`${changes.features} feature${changes.features > 1 ? 's' : ''}`);
        }
        if (changes.fixes > 0) {
            parts.push(`${changes.fixes} fix${changes.fixes > 1 ? 'es' : ''}`);
        }
        if (changes.improvements > 0) {
            parts.push(`${changes.improvements} improvement${changes.improvements > 1 ? 's' : ''}`);
        }
        const summary = parts.join(', ');
        return `${versionBump.toUpperCase()} version bump recommended: ${summary}`;
    }
    /**
     * Cache full analysis results for later CLI access
     * Requirement 9.7: Cache results for later CLI access
     */
    async cacheFullAnalysis(documents, lastRelease) {
        try {
            // Ensure cache directory exists
            await fs_1.promises.mkdir(this.options.cacheDir, { recursive: true });
            // Generate cache filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const cacheFileName = `quick-analysis-${timestamp}.json`;
            const cacheFilePath = (0, path_1.join)(this.options.cacheDir, cacheFileName);
            // Prepare cache data
            const cacheData = {
                timestamp: new Date().toISOString(),
                lastRelease: lastRelease ? lastRelease.name : null,
                documentCount: documents.length,
                documents: documents.map(doc => ({
                    path: doc.path,
                    lastModified: doc.lastModified,
                    gitCommit: doc.gitCommit
                })),
                quickAnalysisMode: true,
                note: 'Full analysis can be run with: npm run release:analyze'
            };
            // Write cache file
            await fs_1.promises.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2));
            // Create symlink to latest
            const latestPath = (0, path_1.join)(this.options.cacheDir, 'latest.json');
            try {
                await fs_1.promises.unlink(latestPath);
            }
            catch {
                // Ignore if doesn't exist
            }
            try {
                await fs_1.promises.symlink(cacheFileName, latestPath);
            }
            catch {
                // Symlinks might not be supported on all systems
                await fs_1.promises.copyFile(cacheFilePath, latestPath);
            }
            return cacheFilePath;
        }
        catch (error) {
            throw new Error(`Failed to cache results: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get cached analysis result
     * Requirement 9.7: Retrieve cached results
     */
    async getCachedResult() {
        try {
            const latestPath = (0, path_1.join)(this.options.cacheDir, 'latest.json');
            const content = await fs_1.promises.readFile(latestPath, 'utf-8');
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    /**
     * Clear cached results
     */
    async clearCache() {
        try {
            const files = await fs_1.promises.readdir(this.options.cacheDir);
            for (const file of files) {
                await fs_1.promises.unlink((0, path_1.join)(this.options.cacheDir, file));
            }
        }
        catch {
            // Ignore errors
        }
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    // Private helper methods
    initializePerformanceMetrics() {
        return {
            totalTimeMs: 0,
            phaseTimings: {
                gitAnalysis: 0,
                documentCollection: 0,
                changeExtraction: 0,
                versionCalculation: 0,
                caching: 0
            },
            completedWithinTimeout: false,
            memoryUsage: {
                initial: process.memoryUsage().heapUsed,
                peak: process.memoryUsage().heapUsed,
                final: 0
            },
            documentsProcessed: 0
        };
    }
    updatePeakMemory() {
        const current = process.memoryUsage().heapUsed;
        if (current > this.performanceMetrics.memoryUsage.peak) {
            this.performanceMetrics.memoryUsage.peak = current;
        }
    }
}
exports.QuickAnalyzer = QuickAnalyzer;
/**
 * CLI entry point for quick analysis
 */
async function runQuickAnalysisCLI() {
    const analyzer = new QuickAnalyzer(process.cwd(), {
        timeoutMs: 10000,
        skipDetailedExtraction: true,
        cacheResults: true,
        monitorPerformance: true
    });
    try {
        const result = await analyzer.runQuickAnalysis();
        // Display concise output
        console.log(`\n🚀 ${result.summary}`);
        console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%`);
        if (result.fullResultCached) {
            console.log(`   📦 Full results cached for detailed review`);
            console.log(`   Run 'npm run release:analyze' for complete analysis\n`);
        }
        // Display performance metrics if available
        if (result.performanceMetrics) {
            const metrics = result.performanceMetrics;
            console.log(`⏱️  Analysis completed in ${metrics.totalTimeMs}ms`);
            if (!metrics.completedWithinTimeout) {
                console.log(`   ⚠️  Warning: Analysis exceeded ${10000}ms timeout`);
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error(`❌ Quick analysis failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    runQuickAnalysisCLI();
}
//# sourceMappingURL=quick-analyze.js.map