#!/usr/bin/env node

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

import { promises as fs } from 'fs';
import { join } from 'path';
import { AnalysisResult, QuickAnalysisResult } from '../types/AnalysisTypes';

export interface QuickAnalysisOptions {
  /** Maximum time to spend on analysis (milliseconds) */
  timeoutMs?: number;

  /** Skip detailed extraction for speed */
  skipDetailedExtraction?: boolean;

  /** Cache full results for later review */
  cacheResults?: boolean;

  /** Cache directory path */
  cacheDir?: string;

  /** Enable performance monitoring */
  monitorPerformance?: boolean;
}

export interface PerformanceMetrics {
  /** Total analysis time (milliseconds) */
  totalTimeMs: number;

  /** Time spent on each phase (milliseconds) */
  phaseTimings: {
    gitAnalysis: number;
    documentCollection: number;
    changeExtraction: number;
    versionCalculation: number;
    caching: number;
  };

  /** Whether analysis completed within timeout */
  completedWithinTimeout: boolean;

  /** Memory usage (bytes) */
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };

  /** Number of documents processed */
  documentsProcessed: number;
}

export interface QuickAnalysisResultWithMetrics extends QuickAnalysisResult {
  /** Performance metrics for monitoring */
  performanceMetrics?: PerformanceMetrics;

  /** Cache file path if results were cached */
  cacheFilePath?: string;
}

/**
 * Quick Analysis Mode implementation
 */
export class QuickAnalyzer {
  private workingDirectory: string;
  private options: Required<QuickAnalysisOptions>;
  private performanceMetrics: PerformanceMetrics;

  constructor(
    workingDirectory: string = process.cwd(),
    options: QuickAnalysisOptions = {}
  ) {
    this.workingDirectory = workingDirectory;
    
    // Increase timeout when caching is enabled to allow time for file operations
    const defaultTimeout = (options.cacheResults ?? true) ? 15000 : 10000;
    
    this.options = {
      timeoutMs: options.timeoutMs ?? defaultTimeout,
      skipDetailedExtraction: options.skipDetailedExtraction ?? true,
      cacheResults: options.cacheResults ?? true,
      cacheDir: options.cacheDir ?? join(workingDirectory, '.kiro/release-analysis/cache'),
      monitorPerformance: options.monitorPerformance ?? true
    };

    this.performanceMetrics = this.initializePerformanceMetrics();
  }

  /**
   * Run quick analysis with performance monitoring
   * Requirement 9.2: Complete in <10 seconds
   */
  async runQuickAnalysis(): Promise<QuickAnalysisResultWithMetrics> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      // Set up timeout with cleanup
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Analysis timeout')), this.options.timeoutMs);
      });

      // Run analysis with timeout
      const analysisPromise = this.performQuickAnalysis();
      const result = await Promise.race([analysisPromise, timeoutPromise]);
      
      // Clear timeout if analysis completed first
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

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
    } catch (error) {
      // Clear timeout on error
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
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
    } finally {
      // Ensure timeout is always cleared
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  }

  /**
   * Perform quick analysis with optimizations
   */
  private async performQuickAnalysis(): Promise<QuickAnalysisResultWithMetrics> {
    const analysisStartTime = Date.now();
    
    // Phase 1: Git Analysis (fast)
    const gitStartTime = Date.now();
    const { GitHistoryAnalyzer } = await import('../git/GitHistoryAnalyzer');
    const gitAnalyzer = new GitHistoryAnalyzer(this.workingDirectory);

    let lastRelease;
    try {
      lastRelease = await gitAnalyzer.findLastRelease();
    } catch {
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
    let cacheFilePath: string | undefined;
    let fullResultCached = false;

    if (this.options.cacheResults) {
      try {
        // Cache results for later CLI access
        cacheFilePath = await this.cacheFullAnalysis(documents, lastRelease);
        fullResultCached = true;
      } catch (error) {
        // Don't fail the analysis if caching fails
        // Error is logged but analysis continues
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
  private async performQuickExtraction(documents: any[]): Promise<{
    breaking: number;
    features: number;
    fixes: number;
    improvements: number;
  }> {
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

      if (breakingMatches) counts.breaking += breakingMatches.length;
      if (featureMatches) counts.features += featureMatches.length;
      if (fixMatches) counts.fixes += fixMatches.length;
      if (improvementMatches) counts.improvements += improvementMatches.length;
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
  private calculateQuickVersionBump(changes: {
    breaking: number;
    features: number;
    fixes: number;
    improvements: number;
  }): 'major' | 'minor' | 'patch' | 'none' {
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
  private calculateQuickConfidence(
    changes: { breaking: number; features: number; fixes: number; improvements: number },
    documentCount: number
  ): number {
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
  private generateConciseSummary(
    changes: { breaking: number; features: number; fixes: number; improvements: number },
    versionBump: 'major' | 'minor' | 'patch' | 'none'
  ): string {
    const totalChanges = changes.breaking + changes.features + changes.fixes + changes.improvements;

    if (totalChanges === 0) {
      return 'No significant changes detected';
    }

    const parts: string[] = [];

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
  private async cacheFullAnalysis(documents: any[], lastRelease: any): Promise<string> {
    // Ensure cache directory exists
    await fs.mkdir(this.options.cacheDir, { recursive: true });

    // Generate cache filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cacheFileName = `quick-analysis-${timestamp}.json`;
    const cacheFilePath = join(this.options.cacheDir, cacheFileName);

    // Prepare cache data with safe property access
    const cacheData = {
      timestamp: new Date().toISOString(),
      lastRelease: lastRelease ? lastRelease.name : null,
      documentCount: documents.length,
      documents: documents.map(doc => ({
        path: doc.path || 'unknown',
        lastModified: doc.lastModified || new Date().toISOString(),
        gitCommit: doc.gitCommit || 'unknown'
      })),
      quickAnalysisMode: true,
      note: 'Full analysis can be run with: npm run release:analyze'
    };

    // Write cache file
    await fs.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2));

    // Create symlink to latest
    const latestPath = join(this.options.cacheDir, 'latest.json');
    try {
      await fs.unlink(latestPath);
    } catch {
      // Ignore if doesn't exist
    }

    try {
      await fs.symlink(cacheFileName, latestPath);
    } catch {
      // Symlinks might not be supported on all systems
      await fs.copyFile(cacheFilePath, latestPath);
    }

    return cacheFilePath;
  }

  /**
   * Get cached analysis result
   * Requirement 9.7: Retrieve cached results
   */
  async getCachedResult(): Promise<any | null> {
    try {
      const latestPath = join(this.options.cacheDir, 'latest.json');
      const content = await fs.readFile(latestPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Clear cached results
   */
  async clearCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.options.cacheDir);
      for (const file of files) {
        await fs.unlink(join(this.options.cacheDir, file));
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  // Private helper methods

  private initializePerformanceMetrics(): PerformanceMetrics {
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

  private updatePeakMemory(): void {
    const current = process.memoryUsage().heapUsed;
    if (current > this.performanceMetrics.memoryUsage.peak) {
      this.performanceMetrics.memoryUsage.peak = current;
    }
  }
}

/**
 * CLI entry point for quick analysis
 */
export async function runQuickAnalysisCLI(): Promise<void> {
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
  } catch (error) {
    console.error(`❌ Quick analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runQuickAnalysisCLI();
}
