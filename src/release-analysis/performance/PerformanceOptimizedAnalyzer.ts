import { GitHistoryAnalyzer, GitChanges, AnalysisScope } from '../git/GitHistoryAnalyzer';
import { CompletionDocument } from '../types/AnalysisTypes';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { OptimizedCompletionDocumentCollector, OptimizedCollectionResult } from '../collection/OptimizedCompletionDocumentCollector';
import { GitPerformanceOptimizer, GitOptimizationConfig } from './GitPerformanceOptimizer';
import { ProgressReporter, AnalysisPhase } from './ProgressReporter';
import { withErrorHandling } from '../errors/ErrorHandler';
import { ErrorContext } from '../types';

/**
 * Performance optimization configuration for the entire analysis pipeline
 */
export interface AnalysisOptimizationConfig {
  git: GitOptimizationConfig;
  enableOptimizations: boolean;
  enableProgressReporting: boolean;
  enablePerformanceMonitoring: boolean;
  fallbackToBasicAnalysis: boolean;
  performanceTargets: {
    maxAnalysisTimeMs: number;
    maxMemoryUsageMB: number;
    minCacheHitRate: number;
  };
}

/**
 * Comprehensive analysis result with performance metrics
 */
export interface OptimizedAnalysisResult {
  scope: AnalysisScope;
  collectionResult: OptimizedCollectionResult;
  performanceMetrics: {
    totalAnalysisTime: number;
    gitAnalysisTime: number;
    documentCollectionTime: number;
    cacheEfficiency: number;
    parallelEfficiency: number;
    memoryUsage: {
      peak: number;
      average: number;
      final: number;
    };
    performanceTargetsMet: boolean;
  };
  optimizationSummary: {
    optimizationsUsed: string[];
    fallbacksTriggered: string[];
    cacheStats: any;
    processingStats: any;
  };
}

/**
 * Performance Optimized Analyzer for large repository release analysis
 * 
 * Integrates all performance optimization components to provide efficient analysis
 * of large repositories with comprehensive progress reporting and performance monitoring.
 * 
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
export class PerformanceOptimizedAnalyzer {
  private gitAnalyzer: GitHistoryAnalyzer;
  private gitOptimizer: GitPerformanceOptimizer;
  private documentCollector: OptimizedCompletionDocumentCollector;
  private progressReporter: ProgressReporter;
  private config: AnalysisOptimizationConfig;
  private workingDirectory: string;
  private analysisConfig: AnalysisConfig;

  constructor(
    workingDirectory: string = process.cwd(),
    analysisConfig: AnalysisConfig,
    optimizationConfig: Partial<AnalysisOptimizationConfig> = {}
  ) {
    this.workingDirectory = workingDirectory;
    this.analysisConfig = analysisConfig;
    
    this.config = {
      git: {
        maxCommitsPerBatch: 100,
        enableShallowClone: false,
        useGitCache: true,
        parallelFileProcessing: true,
        maxConcurrentOperations: 4,
        cacheExpirationMs: 30 * 60 * 1000
      },
      enableOptimizations: true,
      enableProgressReporting: true,
      enablePerformanceMonitoring: true,
      fallbackToBasicAnalysis: true,
      performanceTargets: {
        maxAnalysisTimeMs: 30 * 1000, // 30 seconds
        maxMemoryUsageMB: 512, // 512 MB
        minCacheHitRate: 0.3 // 30%
      },
      ...optimizationConfig
    };

    // Initialize components
    this.gitAnalyzer = new GitHistoryAnalyzer(workingDirectory);
    this.gitOptimizer = new GitPerformanceOptimizer(workingDirectory, this.config.git);
    this.documentCollector = new OptimizedCompletionDocumentCollector(
      workingDirectory,
      analysisConfig,
      {
        enableOptimizations: this.config.enableOptimizations,
        fallbackToBasicCollection: this.config.fallbackToBasicAnalysis
      }
    );
    this.progressReporter = new ProgressReporter({
      enableConsoleOutput: this.config.enableProgressReporting,
      enableDetailedLogging: this.config.enablePerformanceMonitoring
    });
  }

  /**
   * Perform optimized release analysis
   * Requirements 5.1, 5.2, 5.3, 5.4: Complete optimized analysis pipeline
   */
  async analyzeReleaseOptimized(reference?: string): Promise<OptimizedAnalysisResult> {
    const startTime = Date.now();
    const memoryStart = process.memoryUsage();
    let peakMemory = memoryStart.heapUsed;
    let memorySum = memoryStart.heapUsed;
    let memorySamples = 1;

    // Set up memory monitoring
    const memoryMonitor = setInterval(() => {
      const current = process.memoryUsage().heapUsed;
      peakMemory = Math.max(peakMemory, current);
      memorySum += current;
      memorySamples++;
    }, 1000);

    const context: ErrorContext = {
      operation: 'analyzeReleaseOptimized',
      component: 'PerformanceOptimizedAnalyzer',
      timestamp: new Date()
    };

    try {
      const result = await withErrorHandling(async () => {
        // Initialize progress reporting
        const phases: AnalysisPhase[] = [
          {
            name: 'git-analysis',
            description: 'Analyzing Git history and determining scope',
            weight: 2
          },
          {
            name: 'document-collection',
            description: 'Collecting and parsing completion documents',
            weight: 5
          },
          {
            name: 'finalization',
            description: 'Finalizing analysis and generating metrics',
            weight: 1
          }
        ];

        this.progressReporter.initializePhases(phases);

        // Phase 1: Git Analysis
        this.progressReporter.startPhase('git-analysis');
        const { scope, gitAnalysisTime } = await this.performGitAnalysisOptimized(reference);
        this.progressReporter.completePhase('git-analysis', 
          `Found ${scope.completionDocuments.length} completion documents since ${scope.fromTag || scope.fromCommit || 'beginning'}`
        );

        // Phase 2: Document Collection
        this.progressReporter.startPhase('document-collection');
        const documentCollectionStart = Date.now();
        
        // Create GitChanges from scope for collection
        const gitChanges: GitChanges = {
          commits: [], // Not needed for document collection
          addedFiles: scope.completionDocuments.map(d => d.path),
          modifiedFiles: [],
          deletedFiles: [],
          timeRange: { from: new Date(0), to: scope.analysisDate }
        };

        const collectionResult = await this.documentCollector.collectFromGitChangesOptimized(gitChanges);
        const documentCollectionTime = Date.now() - documentCollectionStart;
        
        this.progressReporter.completePhase('document-collection',
          `Processed ${collectionResult.documents.length} documents (${collectionResult.performanceMetrics.cacheHitRate * 100}% cache hit rate)`
        );

        // Phase 3: Finalization
        this.progressReporter.startPhase('finalization');
        const analysisResult = this.finalizeAnalysis(
          scope,
          collectionResult,
          startTime,
          gitAnalysisTime,
          documentCollectionTime,
          peakMemory,
          memorySum / memorySamples
        );
        this.progressReporter.completePhase('finalization');

        // Complete analysis
        this.progressReporter.completeAnalysis(
          `Analysis complete: ${analysisResult.collectionResult.documents.length} documents processed in ${analysisResult.performanceMetrics.totalAnalysisTime}ms`
        );

        return analysisResult;
      }, context);

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(`Optimized analysis failed: ${result.error?.message || 'Unknown error'}`);
      }
    } finally {
      clearInterval(memoryMonitor);
    }
  }

  /**
   * Perform Git analysis with optimizations
   */
  private async performGitAnalysisOptimized(reference?: string): Promise<{
    scope: AnalysisScope;
    gitAnalysisTime: number;
  }> {
    const gitAnalysisStart = Date.now();

    try {
      let fromTag: string | undefined;
      let fromCommit: string | undefined;

      if (reference) {
        fromCommit = reference;
      } else if (this.config.enableOptimizations) {
        // Use optimized last release finding
        this.progressReporter.updateProgress(0, 100, 'Finding last release tag');
        const lastReleaseResult = await this.gitOptimizer.findLastReleaseOptimized();
        
        if (lastReleaseResult.data) {
          fromTag = lastReleaseResult.data.name;
          fromCommit = lastReleaseResult.data.commit;
        }
        this.progressReporter.updateProgress(25, 100, 'Found last release');
      } else {
        // Fallback to basic Git analyzer
        const lastRelease = await this.gitAnalyzer.findLastRelease();
        if (lastRelease) {
          fromTag = lastRelease.name;
          fromCommit = lastRelease.commit;
        }
      }

      // Get changes since reference
      this.progressReporter.updateProgress(50, 100, 'Analyzing changes since last release');
      
      let changes: GitChanges;
      if (this.config.enableOptimizations && fromCommit) {
        const changesResult = await this.gitOptimizer.getChangesSinceOptimized(fromCommit);
        changes = changesResult.data;
      } else if (fromCommit) {
        changes = await this.gitAnalyzer.getChangesSince(fromCommit);
      } else {
        // No reference point - analyze all available documents
        changes = {
          commits: [],
          addedFiles: [],
          modifiedFiles: [],
          deletedFiles: [],
          timeRange: { from: new Date(0), to: new Date() }
        };
      }

      this.progressReporter.updateProgress(75, 100, 'Finding completion documents');

      // Find completion documents
      const completionDocuments = await this.gitAnalyzer.findCompletionDocuments(changes);
      
      this.progressReporter.updateProgress(100, 100, 'Git analysis complete');

      const scope: AnalysisScope = {
        fromTag,
        fromCommit,
        toCommit: 'HEAD',
        completionDocuments,
        analysisDate: new Date()
      };

      return {
        scope,
        gitAnalysisTime: Date.now() - gitAnalysisStart
      };
    } catch (error) {
      if (this.config.fallbackToBasicAnalysis) {
        console.warn(`Optimized Git analysis failed, falling back to basic analysis: ${error instanceof Error ? error.message : String(error)}`);
        
        // Fallback to basic analysis
        const lastRelease = await this.gitAnalyzer.findLastRelease();
        const changes = lastRelease 
          ? await this.gitAnalyzer.getChangesSince(lastRelease.commit)
          : { commits: [], addedFiles: [], modifiedFiles: [], deletedFiles: [], timeRange: { from: new Date(0), to: new Date() } };
        
        const completionDocuments = await this.gitAnalyzer.findCompletionDocuments(changes);

        const scope: AnalysisScope = {
          fromTag: lastRelease?.name,
          fromCommit: lastRelease?.commit,
          toCommit: 'HEAD',
          completionDocuments,
          analysisDate: new Date()
        };

        return {
          scope,
          gitAnalysisTime: Date.now() - gitAnalysisStart
        };
      } else {
        throw error;
      }
    }
  }

  /**
   * Finalize analysis with performance metrics
   */
  private finalizeAnalysis(
    scope: AnalysisScope,
    collectionResult: OptimizedCollectionResult,
    startTime: number,
    gitAnalysisTime: number,
    documentCollectionTime: number,
    peakMemory: number,
    averageMemory: number
  ): OptimizedAnalysisResult {
    const totalAnalysisTime = Date.now() - startTime;
    const finalMemory = process.memoryUsage().heapUsed;

    // Check performance targets
    const performanceTargetsMet = this.checkPerformanceTargets(
      totalAnalysisTime,
      peakMemory,
      collectionResult.performanceMetrics.cacheHitRate
    );

    // Gather optimization summary
    const optimizationSummary = {
      optimizationsUsed: this.getOptimizationsUsed(),
      fallbacksTriggered: this.getFallbacksTriggered(),
      cacheStats: this.documentCollector.getCacheStats(),
      processingStats: this.documentCollector.getProcessingStats()
    };

    return {
      scope,
      collectionResult,
      performanceMetrics: {
        totalAnalysisTime,
        gitAnalysisTime,
        documentCollectionTime,
        cacheEfficiency: collectionResult.performanceMetrics.cacheHitRate,
        parallelEfficiency: collectionResult.performanceMetrics.parallelEfficiency,
        memoryUsage: {
          peak: peakMemory,
          average: averageMemory,
          final: finalMemory
        },
        performanceTargetsMet
      },
      optimizationSummary
    };
  }

  /**
   * Check if performance targets are met
   */
  private checkPerformanceTargets(
    totalTime: number,
    peakMemory: number,
    cacheHitRate: number
  ): boolean {
    const timeTarget = totalTime <= this.config.performanceTargets.maxAnalysisTimeMs;
    const memoryTarget = (peakMemory / 1024 / 1024) <= this.config.performanceTargets.maxMemoryUsageMB;
    const cacheTarget = cacheHitRate >= this.config.performanceTargets.minCacheHitRate;

    return timeTarget && memoryTarget && cacheTarget;
  }

  /**
   * Get list of optimizations that were used
   */
  private getOptimizationsUsed(): string[] {
    const optimizations: string[] = [];

    if (this.config.enableOptimizations) {
      optimizations.push('git-performance-optimization');
      optimizations.push('document-parsing-cache');
      optimizations.push('parallel-processing');
    }

    if (this.config.enableProgressReporting) {
      optimizations.push('progress-reporting');
    }

    if (this.config.git.useGitCache) {
      optimizations.push('git-caching');
    }

    if (this.config.git.parallelFileProcessing) {
      optimizations.push('parallel-file-processing');
    }

    return optimizations;
  }

  /**
   * Get list of fallbacks that were triggered
   */
  private getFallbacksTriggered(): string[] {
    // This would be populated by tracking fallback usage throughout the analysis
    // For now, return empty array - could be enhanced with actual fallback tracking
    return [];
  }

  /**
   * Get comprehensive performance report
   */
  getPerformanceReport(): {
    gitOptimizer: any;
    documentCollector: {
      cache: any;
      processing: any;
      progress: any;
    };
    progressReporter: any;
  } {
    return {
      gitOptimizer: {
        performance: this.gitOptimizer.getPerformanceMetrics(),
        cache: this.gitOptimizer.getCacheStats()
      },
      documentCollector: {
        cache: this.documentCollector.getCacheStats(),
        processing: this.documentCollector.getProcessingStats(),
        progress: this.documentCollector.getProgressSummary()
      },
      progressReporter: this.progressReporter.getProgressSummary()
    };
  }

  /**
   * Reset all optimizations and clear caches
   */
  reset(): void {
    this.gitOptimizer.reset();
    this.documentCollector.reset();
    this.progressReporter.reset();
  }

  /**
   * Prune old cache entries across all components
   */
  pruneCaches(): {
    gitCachesPruned: number;
    documentCachesPruned: number;
  } {
    return {
      gitCachesPruned: this.gitOptimizer.pruneCaches(),
      documentCachesPruned: this.documentCollector.pruneCaches()
    };
  }

  /**
   * Update optimization configuration
   */
  updateConfig(newConfig: Partial<AnalysisOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}