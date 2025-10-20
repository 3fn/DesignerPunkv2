import { EventEmitter } from 'events';
import { PerformanceMonitor } from '../../performance/PerformanceMonitor';

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
export class ParallelProcessor<T, R> extends EventEmitter {
  private config: ParallelProcessingConfig;
  private performanceMonitor: PerformanceMonitor;
  private activeTasks: Set<string> = new Set();
  private completedTasks: Map<string, ProcessingResult<R>> = new Map();
  private failedTasks: Map<string, ProcessingResult<R>> = new Map();
  private startTime: number = 0;
  private lastProgressUpdate: number = 0;

  constructor(config: Partial<ParallelProcessingConfig> = {}) {
    super();
    this.config = {
      maxConcurrency: 4,
      batchSize: 10,
      enableProgressReporting: true,
      progressUpdateInterval: 1000, // 1 second
      enableErrorRecovery: true,
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      ...config
    };
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Process tasks in parallel with progress reporting
   * Requirements 5.3, 5.4: Parallel processing with progress reporting
   */
  async processTasks(tasks: ProcessingTask<T, R>[]): Promise<ProcessingResult<R>[]> {
    this.startTime = Date.now();
    this.activeTasks.clear();
    this.completedTasks.clear();
    this.failedTasks.clear();

    return await this.performanceMonitor.measure(
      'parallelProcessing',
      async () => {
        // Sort tasks by priority if specified
        const sortedTasks = tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        
        // Create batches
        const batches = this.createBatches(sortedTasks);
        const allResults: ProcessingResult<R>[] = [];

        // Process batches sequentially, tasks within batches in parallel
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          const batchId = `batch-${batchIndex}`;
          
          this.emitProgress({
            completed: allResults.length,
            total: tasks.length,
            percentage: (allResults.length / tasks.length) * 100,
            currentBatch: batchId,
            errors: this.failedTasks.size,
            retries: this.getTotalRetries()
          });

          const batchResults = await this.processBatch(batch, batchId);
          allResults.push(...batchResults.results);

          // Emit batch completion
          this.emit('batchCompleted', batchResults);
        }

        // Emit final progress
        this.emitProgress({
          completed: allResults.length,
          total: tasks.length,
          percentage: 100,
          errors: this.failedTasks.size,
          retries: this.getTotalRetries()
        });

        return allResults;
      }
    ).then(({ result }) => result);
  }

  /**
   * Process a single batch of tasks in parallel
   */
  private async processBatch(tasks: ProcessingTask<T, R>[], batchId: string): Promise<BatchResult<R>> {
    const startTime = Date.now();
    const results: ProcessingResult<R>[] = [];

    // Create semaphore for concurrency control
    const semaphore = new Semaphore(this.config.maxConcurrency);
    
    // Process tasks in parallel with concurrency limit
    const taskPromises = tasks.map(async (task) => {
      await semaphore.acquire();
      
      try {
        const result = await this.processTask(task);
        results.push(result);
        
        if (result.success) {
          this.completedTasks.set(task.id, result);
        } else {
          this.failedTasks.set(task.id, result);
        }

        // Update progress if enough time has passed
        if (this.config.enableProgressReporting) {
          const now = Date.now();
          if (now - this.lastProgressUpdate >= this.config.progressUpdateInterval) {
            this.emitProgress({
              completed: this.completedTasks.size,
              total: tasks.length,
              percentage: (this.completedTasks.size / tasks.length) * 100,
              currentBatch: batchId,
              currentTask: task.id,
              errors: this.failedTasks.size,
              retries: this.getTotalRetries()
            });
            this.lastProgressUpdate = now;
          }
        }

        return result;
      } finally {
        semaphore.release();
        this.activeTasks.delete(task.id);
      }
    });

    await Promise.all(taskPromises);

    const totalProcessingTime = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    const averageProcessingTime = results.length > 0 
      ? results.reduce((sum, r) => sum + r.processingTime, 0) / results.length 
      : 0;

    return {
      batchId,
      results,
      batchSize: tasks.length,
      successCount,
      errorCount,
      totalProcessingTime,
      averageProcessingTime
    };
  }

  /**
   * Process a single task with error recovery
   */
  private async processTask(task: ProcessingTask<T, R>): Promise<ProcessingResult<R>> {
    const taskStartTime = Date.now();
    this.activeTasks.add(task.id);
    let retryCount = 0;
    let lastError: Error | undefined;

    while (retryCount <= (task.retries || this.config.maxRetries)) {
      try {
        const result = await task.processor(task.input);
        
        return {
          taskId: task.id,
          result,
          processingTime: Date.now() - taskStartTime,
          retryCount,
          success: true
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        retryCount++;

        if (this.config.enableErrorRecovery && retryCount <= (task.retries || this.config.maxRetries)) {
          // Wait before retry
          await this.delay(this.config.retryDelay * retryCount);
          
          this.emit('taskRetry', {
            taskId: task.id,
            retryCount,
            error: lastError,
            maxRetries: task.retries || this.config.maxRetries
          });
        }
      }
    }

    return {
      taskId: task.id,
      error: lastError,
      processingTime: Date.now() - taskStartTime,
      retryCount: retryCount - 1,
      success: false
    };
  }

  /**
   * Create batches from tasks
   */
  private createBatches(tasks: ProcessingTask<T, R>[]): ProcessingTask<T, R>[][] {
    const batches: ProcessingTask<T, R>[][] = [];
    
    for (let i = 0; i < tasks.length; i += this.config.batchSize) {
      const batch = tasks.slice(i, i + this.config.batchSize);
      batches.push(batch);
    }
    
    return batches;
  }

  /**
   * Emit progress information
   */
  private emitProgress(progress: Partial<ProgressInfo>): void {
    if (!this.config.enableProgressReporting) {
      return;
    }

    const now = Date.now();
    const elapsed = now - this.startTime;
    const rate = progress.completed ? progress.completed / (elapsed / 1000) : 0;
    const remaining = progress.total && progress.completed && rate > 0 
      ? (progress.total - progress.completed) / rate * 1000 
      : undefined;

    const fullProgress: ProgressInfo = {
      completed: 0,
      total: 0,
      percentage: 0,
      errors: 0,
      retries: 0,
      ...progress,
      processingRate: rate,
      estimatedTimeRemaining: remaining
    };

    this.emit('progress', fullProgress);
  }

  /**
   * Get total retry count across all tasks
   */
  private getTotalRetries(): number {
    let totalRetries = 0;
    
    for (const result of this.completedTasks.values()) {
      totalRetries += result.retryCount;
    }
    
    for (const result of this.failedTasks.values()) {
      totalRetries += result.retryCount;
    }
    
    return totalRetries;
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
  } {
    const completed = this.completedTasks.size;
    const failed = this.failedTasks.size;
    const active = this.activeTasks.size;
    const total = completed + failed;
    
    const allResults = [...this.completedTasks.values(), ...this.failedTasks.values()];
    const averageProcessingTime = allResults.length > 0
      ? allResults.reduce((sum, r) => sum + r.processingTime, 0) / allResults.length
      : 0;
    
    const successRate = total > 0 ? completed / total : 0;

    return {
      completed,
      failed,
      active,
      totalRetries: this.getTotalRetries(),
      averageProcessingTime,
      successRate
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.generateReport();
  }

  /**
   * Cancel all active tasks
   */
  cancelAll(): void {
    this.activeTasks.clear();
    this.emit('cancelled');
  }

  /**
   * Reset processor state
   */
  reset(): void {
    this.activeTasks.clear();
    this.completedTasks.clear();
    this.failedTasks.clear();
    this.performanceMonitor.clear();
    this.startTime = 0;
    this.lastProgressUpdate = 0;
  }
}

/**
 * Semaphore for concurrency control
 */
class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    
    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift();
      if (resolve) {
        this.permits--;
        resolve();
      }
    }
  }

  getAvailablePermits(): number {
    return this.permits;
  }

  getQueueLength(): number {
    return this.waitQueue.length;
  }
}