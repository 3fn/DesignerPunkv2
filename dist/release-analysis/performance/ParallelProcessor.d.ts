import { EventEmitter } from 'events';
/**
 * Parallel processing configuration
 */
export interface ParallelProcessingConfig {
    maxConcurrency: number;
    batchSize: number;
    enableProgressReporting: boolean;
    progressUpdateInterval: number;
    enableErrorRecovery: boolean;
    maxRetries: number;
    retryDelay: number;
}
/**
 * Processing task definition
 */
export interface ProcessingTask<T, R> {
    id: string;
    input: T;
    processor: (input: T) => Promise<R>;
    priority?: number;
    retries?: number;
}
/**
 * Processing result with metadata
 */
export interface ProcessingResult<R> {
    taskId: string;
    result?: R;
    error?: Error;
    processingTime: number;
    retryCount: number;
    success: boolean;
}
/**
 * Batch processing result
 */
export interface BatchResult<R> {
    batchId: string;
    results: ProcessingResult<R>[];
    batchSize: number;
    successCount: number;
    errorCount: number;
    totalProcessingTime: number;
    averageProcessingTime: number;
}
/**
 * Progress information for long-running operations
 */
export interface ProgressInfo {
    completed: number;
    total: number;
    percentage: number;
    currentBatch?: string;
    currentTask?: string;
    estimatedTimeRemaining?: number;
    processingRate?: number;
    errors: number;
    retries: number;
}
/**
 * Parallel Processor for completion document analysis
 *
 * Implements efficient parallel processing with progress reporting, error recovery,
 * and performance monitoring for large-scale document analysis operations.
 *
 * Requirements addressed:
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
export declare class ParallelProcessor<T, R> extends EventEmitter {
    private config;
    private performanceMonitor;
    private activeTasks;
    private completedTasks;
    private failedTasks;
    private startTime;
    private lastProgressUpdate;
    constructor(config?: Partial<ParallelProcessingConfig>);
    /**
     * Process tasks in parallel with progress reporting
     * Requirements 5.3, 5.4: Parallel processing with progress reporting
     */
    processTasks(tasks: ProcessingTask<T, R>[]): Promise<ProcessingResult<R>[]>;
    /**
     * Process a single batch of tasks in parallel
     */
    private processBatch;
    /**
     * Process a single task with error recovery
     */
    private processTask;
    /**
     * Create batches from tasks
     */
    private createBatches;
    /**
     * Emit progress information
     */
    private emitProgress;
    /**
     * Get total retry count across all tasks
     */
    private getTotalRetries;
    /**
     * Delay utility for retries
     */
    private delay;
    /**
     * Get processing statistics
     */
    getProcessingStats(): {
        completed: number;
        failed: number;
        active: number;
        totalRetries: number;
        averageProcessingTime: number;
        successRate: number;
    };
    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): import("../../performance/PerformanceMonitor").PerformanceReport;
    /**
     * Cancel all active tasks
     */
    cancelAll(): void;
    /**
     * Reset processor state
     */
    reset(): void;
}
//# sourceMappingURL=ParallelProcessor.d.ts.map