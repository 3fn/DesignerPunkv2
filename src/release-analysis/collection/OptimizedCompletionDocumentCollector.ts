import { GitChanges, CompletionDocument } from '../git/GitHistoryAnalyzer';
import { AnalysisConfig } from '../config/AnalysisConfig';
import { DocumentCollectionResult, DocumentFilter, CompletionDocumentCollector } from './CompletionDocumentCollector';
import {
  DocumentParsingCache,
  IncrementalParsingResult,
  DocumentParsingConfig
} from '../performance/DocumentParsingCache';
import {
  ParallelProcessor,
  ProcessingTask,
  ParallelProcessingConfig
} from '../performance/ParallelProcessor';
import {
  ProgressReporter,
  AnalysisPhase,
  ProgressReportingConfig
} from '../performance/ProgressReporter';
import { withErrorHandling, ErrorContext } from '../errors/ErrorHandler';

/**
 * Optimized collection configuration
 */
export interface OptimizedCollectionConfig {
  parsing: DocumentParsingConfig;
  parallel: ParallelProcessingConfig;
  progress: ProgressReportingConfig;
  enableOptimizations: boolean;
  fallbackToBasicCollection: boolean;
}

/**
 * Optimized collection result with performance metrics
 */
export interface OptimizedCollectionResult extends DocumentCollectionResult {
  performanceMetrics: {
    totalProcessingTime: number;
    cacheHitRate: number;
    parallelEfficiency: number;
    documentsFromCache: number;
    documentsReparsed: number;
    averageParseTime: number;
  };
}

/**
 * Optimized Completion Document Collector for large repositories
 * 
 * Extends the basic CompletionDocumentCollector with performance optimizations:
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple documents
 * - Comprehensive progress reporting for long-running operations
 * - Fallback to basic collection if optimizations fail
 * 
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
export class OptimizedCompletionDocumentCollector extends CompletionDocumentCollector {
  private documentCache: DocumentParsingCache;
  private parallelProcessor: ParallelProcessor<string, IncrementalParsingResult>;
  private progressReporter: ProgressReporter;
  private optimizedConfig: OptimizedCollectionConfig;

  constructor(
    workingDirectory: string = process.cwd(),
    config: AnalysisConfig,
    optimizedConfig: Partial<OptimizedCollectionConfig> = {}
  ) {
    super(workingDirectory, config);

    this.optimizedConfig = {
      parsing: {
        enableCache: true,
        maxCacheSize: 1000,
        maxCacheAgeMs: 60 * 60 * 1000, // 1 hour
        enableIncrementalParsing: true,
        enableContentHashing: true,
        enableParallelParsing: true,
        maxConcurrentParsing: 4
      },
      parallel: {
        maxConcurrency: 4,
        batchSize: 10,
        enableProgressReporting: true,
        progressUpdateInterval: 1000,
        enableErrorRecovery: true,
        maxRetries: 3,
        retryDelay: 1000
      },
      progress: {
        enableConsoleOutput: true,
        enableDetailedLogging: false,
        updateInterval: 1000,
        showEstimatedTime: true,
        showProcessingRate: true,
        showMemoryUsage: false,
        enableProgressBar: true,
        progressBarWidth: 40
      },
      enableOptimizations: true,
      fallbackToBasicCollection: true,
      ...optimizedConfig
    };

    this.documentCache = new DocumentParsingCache(workingDirectory, this.optimizedConfig.parsing);
    this.parallelProcessor = new ParallelProcessor(this.optimizedConfig.parallel);
    this.progressReporter = new ProgressReporter(this.optimizedConfig.progress);

    // Set up progress event forwarding
    this.setupProgressEventHandlers();
  }

  /**
   * Collect completion documents with optimizations
   * Requirements 5.1, 5.2, 5.3, 5.4: Optimized collection with all performance features
   */
  async collectFromGitChangesOptimized(
    changes: GitChanges,
    filter?: DocumentFilter
  ): Promise<OptimizedCollectionResult> {
    const startTime = Date.now();

    // Check if optimizations are enabled
    if (!this.optimizedConfig.enableOptimizations) {
      return this.fallbackToBasicCollection(changes, filter, startTime);
    }

    const context: ErrorContext = {
      operation: 'collectFromGitChangesOptimized',
      component: 'OptimizedCompletionDocumentCollector',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      // Initialize progress reporting
      const phases: AnalysisPhase[] = [
        {
          name: 'discovery',
          description: 'Discovering completion documents',
          weight: 1
        },
        {
          name: 'parsing',
          description: 'Parsing and caching documents',
          weight: 4
        },
        {
          name: 'filtering',
          description: 'Applying filters and validation',
          weight: 1
        }
      ];

      this.progressReporter.initializePhases(phases);

      // Phase 1: Discovery
      this.progressReporter.startPhase('discovery', 'Finding completion documents in Git changes');
      const relevantFiles = [...changes.addedFiles, ...changes.modifiedFiles];
      const discoveredPaths = await this.discoverDocumentsOptimized(relevantFiles);
      this.progressReporter.completePhase('discovery', `Found ${discoveredPaths.length} completion documents`);

      // Phase 2: Parallel parsing with caching
      this.progressReporter.startPhase('parsing', 'Parsing documents with intelligent caching');
      const parsingResults = await this.parseDocumentsOptimized(discoveredPaths);
      this.progressReporter.completePhase('parsing', `Parsed ${parsingResults.length} documents`);

      // Phase 3: Filtering
      this.progressReporter.startPhase('filtering', 'Applying filters and validation');
      const documents = parsingResults.map(r => r.document);
      const filteredDocuments = await this.filterDocumentsOptimized(documents, filter);
      this.progressReporter.completePhase('filtering', `${filteredDocuments.length} documents after filtering`);

      // Calculate performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(parsingResults, startTime);

      // Complete analysis
      this.progressReporter.completeAnalysis(
        `Processed ${filteredDocuments.length} documents in ${performanceMetrics.totalProcessingTime}ms`
      );

      return {
        documents: filteredDocuments,
        metadata: {
          totalFilesScanned: relevantFiles.length,
          documentsFound: discoveredPaths.length,
          documentsLoaded: parsingResults.length,
          documentsFiltered: filteredDocuments.length,
          collectionDate: new Date(),
          processingTimeMs: performanceMetrics.totalProcessingTime
        },
        errors: [],
        warnings: [],
        performanceMetrics
      };
    }, context);

    if (result.success && result.data) {
      return result.data;
    } else {
      // Fallback to basic collection on error
      console.warn(`Optimized collection failed: ${result.error?.message}. Falling back to basic collection.`);
      return this.fallbackToBasicCollection(changes, filter, startTime);
    }
  }

  /**
   * Collect documents from specific paths with optimizations
   * Requirements 5.2, 5.3, 5.4: Optimized path-based collection
   */
  async collectFromPathsOptimized(
    paths: string[],
    filter?: DocumentFilter
  ): Promise<OptimizedCollectionResult> {
    const startTime = Date.now();

    if (!this.optimizedConfig.enableOptimizations) {
      return this.fallbackToBasicCollection({
        commits: [],
        addedFiles: paths,
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      }, filter, startTime);
    }

    try {
      // Initialize progress reporting
      const phases: AnalysisPhase[] = [
        {
          name: 'discovery',
          description: 'Validating document paths',
          weight: 1
        },
        {
          name: 'parsing',
          description: 'Parsing documents with caching',
          weight: 4
        },
        {
          name: 'filtering',
          description: 'Applying filters',
          weight: 1
        }
      ];

      this.progressReporter.initializePhases(phases);

      // Phase 1: Discovery (validation)
      this.progressReporter.startPhase('discovery');
      const discoveredPaths = await this.discoverDocumentsOptimized(paths);
      this.progressReporter.completePhase('discovery');

      // Phase 2: Parsing
      this.progressReporter.startPhase('parsing');
      const parsingResults = await this.parseDocumentsOptimized(discoveredPaths);
      this.progressReporter.completePhase('parsing');

      // Phase 3: Filtering
      this.progressReporter.startPhase('filtering');
      const documents = parsingResults.map(r => r.document);
      const filteredDocuments = await this.filterDocumentsOptimized(documents, filter);
      this.progressReporter.completePhase('filtering');

      // Calculate performance metrics
      const performanceMetrics = this.calculatePerformanceMetrics(parsingResults, startTime);

      this.progressReporter.completeAnalysis();

      return {
        documents: filteredDocuments,
        metadata: {
          totalFilesScanned: paths.length,
          documentsFound: discoveredPaths.length,
          documentsLoaded: parsingResults.length,
          documentsFiltered: filteredDocuments.length,
          collectionDate: new Date(),
          processingTimeMs: performanceMetrics.totalProcessingTime
        },
        errors: [],
        warnings: [],
        performanceMetrics
      };
    } catch (error) {
      console.warn(`Optimized path collection failed: ${error instanceof Error ? error.message : String(error)}`);
      return this.fallbackToBasicCollection({
        commits: [],
        addedFiles: paths,
        modifiedFiles: [],
        deletedFiles: [],
        timeRange: { from: new Date(), to: new Date() }
      }, filter, startTime);
    }
  }

  /**
   * Discover documents with optimization
   */
  private async discoverDocumentsOptimized(filePaths: string[]): Promise<string[]> {
    const discoveredPaths: string[] = [];
    let processed = 0;

    for (const filePath of filePaths) {
      if (this.isCompletionDocument(filePath)) {
        discoveredPaths.push(filePath);
      }

      processed++;
      this.progressReporter.updateProgress(
        processed,
        filePaths.length,
        `Checking ${filePath}`
      );
    }

    return discoveredPaths;
  }

  /**
   * Parse documents with parallel processing and caching
   * Requirements 5.2, 5.3: Incremental parsing with parallel processing
   */
  private async parseDocumentsOptimized(filePaths: string[]): Promise<IncrementalParsingResult[]> {
    // Create processing tasks
    const tasks: ProcessingTask<string, IncrementalParsingResult>[] = filePaths.map(filePath => ({
      id: filePath,
      input: filePath,
      processor: async (path: string) => {
        return await this.documentCache.parseDocumentIncremental(path);
      }
    }));

    // Set up progress reporting for parallel processing
    this.parallelProcessor.on('progress', (progress) => {
      this.progressReporter.updateProgress(
        progress.completed,
        progress.total,
        progress.currentTask || 'Processing documents'
      );
    });

    // Process tasks in parallel
    const results = await this.parallelProcessor.processTasks(tasks);

    // Extract successful results
    return results
      .filter(result => result.success && result.result)
      .map(result => result.result!);
  }

  /**
   * Filter documents with optimization
   */
  private async filterDocumentsOptimized(
    documents: CompletionDocument[],
    filter?: DocumentFilter
  ): Promise<CompletionDocument[]> {
    let processed = 0;
    const filteredDocuments: CompletionDocument[] = [];

    for (const document of documents) {
      // Apply filtering logic (reuse from parent class)
      const shouldInclude = this.shouldIncludeDocument(document, filter);

      if (shouldInclude) {
        filteredDocuments.push(document);
      }

      processed++;
      this.progressReporter.updateProgress(
        processed,
        documents.length,
        `Filtering ${document.path}`
      );
    }

    return filteredDocuments;
  }

  /**
   * Check if document should be included (simplified filtering logic)
   */
  private shouldIncludeDocument(document: CompletionDocument, filter?: DocumentFilter): boolean {
    // Basic filtering - can be extended with more sophisticated logic
    if (!filter) {
      return true;
    }

    // Check document types
    if (filter.documentTypes && filter.documentTypes.length > 0) {
      if (!filter.documentTypes.includes(document.metadata.type)) {
        return false;
      }
    }

    // Check include patterns
    if (filter.includePatterns && filter.includePatterns.length > 0) {
      const matches = filter.includePatterns.some(pattern =>
        this.matchesPattern(document.path, pattern)
      );
      if (!matches) {
        return false;
      }
    }

    // Check exclude patterns
    if (filter.excludePatterns && filter.excludePatterns.length > 0) {
      const excluded = filter.excludePatterns.some(pattern =>
        this.matchesPattern(document.path, pattern)
      );
      if (excluded) {
        return false;
      }
    }

    return true;
  }





  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(
    parsingResults: IncrementalParsingResult[],
    startTime: number
  ): OptimizedCollectionResult['performanceMetrics'] {
    const totalProcessingTime = Date.now() - startTime;
    const documentsFromCache = parsingResults.filter(r => r.fromCache).length;
    const documentsReparsed = parsingResults.filter(r => !r.fromCache).length;
    const cacheHitRate = parsingResults.length > 0 ? documentsFromCache / parsingResults.length : 0;

    const totalParseTime = parsingResults.reduce((sum, r) => sum + r.parseTime, 0);
    const averageParseTime = parsingResults.length > 0 ? totalParseTime / parsingResults.length : 0;

    // Calculate parallel efficiency (simplified)
    const parallelStats = this.parallelProcessor.getProcessingStats();
    const parallelEfficiency = parallelStats.successRate;

    return {
      totalProcessingTime,
      cacheHitRate,
      parallelEfficiency,
      documentsFromCache,
      documentsReparsed,
      averageParseTime
    };
  }

  /**
   * Fallback to basic collection
   */
  private async fallbackToBasicCollection(
    changes: GitChanges,
    filter?: DocumentFilter,
    startTime?: number
  ): Promise<OptimizedCollectionResult> {
    const basicResult = await super.collectFromGitChanges(changes, filter);

    return {
      ...basicResult,
      performanceMetrics: {
        totalProcessingTime: startTime ? Date.now() - startTime : 0,
        cacheHitRate: 0,
        parallelEfficiency: 0,
        documentsFromCache: 0,
        documentsReparsed: basicResult.documents.length,
        averageParseTime: 0
      }
    };
  }

  /**
   * Set up progress event handlers
   */
  private setupProgressEventHandlers(): void {
    this.parallelProcessor.on('progress', (progress) => {
      // Progress is handled in parseDocumentsOptimized
    });

    this.parallelProcessor.on('error', (error) => {
      this.progressReporter.reportError(error.error, undefined, error.taskId);
    });

    this.progressReporter.on('error', (error) => {
      console.error(`Progress reporting error: ${error.error.message}`);
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.documentCache.getCacheStats();
  }

  /**
   * Get processing statistics
   */
  getProcessingStats() {
    return this.parallelProcessor.getProcessingStats();
  }

  /**
   * Get progress summary
   */
  getProgressSummary() {
    return this.progressReporter.getProgressSummary();
  }

  /**
   * Clear caches and reset state
   */
  reset(): void {
    this.documentCache.clear();
    this.parallelProcessor.reset();
    this.progressReporter.reset();
  }

  /**
   * Prune old cache entries
   */
  pruneCaches(): number {
    return this.documentCache.pruneOldEntries();
  }
}