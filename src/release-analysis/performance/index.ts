/**
 * Release Analysis Performance Optimization Components
 * 
 * This module provides performance optimization components for large repository analysis:
 * - GitPerformanceOptimizer: Efficient Git history analysis with caching and batching
 * - DocumentParsingCache: Incremental document parsing with intelligent caching
 * - ParallelProcessor: Parallel processing with progress reporting and error recovery
 * - ProgressReporter: Comprehensive progress reporting for long-running operations
 * 
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */

// Git Performance Optimization
export {
  GitPerformanceOptimizer,
  type GitOptimizationConfig,
  type GitOperationResult,
  type BatchResult
} from './GitPerformanceOptimizer';

// Document Parsing Cache
export {
  DocumentParsingCache,
  type DocumentCacheEntry,
  type IncrementalParsingResult,
  type DocumentCacheStats,
  type DocumentParsingConfig
} from './DocumentParsingCache';

// Parallel Processing
export {
  ParallelProcessor,
  type ParallelProcessingConfig,
  type ProcessingTask,
  type ProcessingResult,
  type BatchResult as ParallelBatchResult,
  type ProgressInfo
} from './ParallelProcessor';

// Progress Reporting
export {
  ProgressReporter,
  type ProgressReportingConfig,
  type AnalysisPhase,
  type DetailedProgress,
  type ProgressMilestone
} from './ProgressReporter';