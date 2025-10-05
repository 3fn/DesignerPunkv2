/**
 * Performance Monitor
 * 
 * Monitors and tracks performance metrics for token generation operations.
 * Provides timing measurements, performance analysis, and optimization insights.
 */

export interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  totalDuration: number;
  operationCount: number;
  averageDuration: number;
  slowestOperation: PerformanceMetric | null;
  fastestOperation: PerformanceMetric | null;
  metrics: PerformanceMetric[];
  timestamp: Date;
}

/**
 * Performance Monitor for tracking token generation performance
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private activeOperations: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  startOperation(operation: string): void {
    this.activeOperations.set(operation, performance.now());
  }

  /**
   * End timing an operation and record the metric
   */
  endOperation(operation: string, metadata?: Record<string, any>): PerformanceMetric | null {
    const startTime = this.activeOperations.get(operation);
    
    if (startTime === undefined) {
      console.warn(`No start time found for operation: ${operation}`);
      return null;
    }

    const endTime = performance.now();
    const metric: PerformanceMetric = {
      operation,
      startTime,
      endTime,
      duration: endTime - startTime,
      metadata
    };

    this.metrics.push(metric);
    this.activeOperations.delete(operation);

    return metric;
  }

  /**
   * Measure the execution time of a function
   */
  async measure<T>(
    operation: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<{ result: T; metric: PerformanceMetric }> {
    this.startOperation(operation);
    
    try {
      const result = await fn();
      const metric = this.endOperation(operation, metadata);
      
      if (!metric) {
        throw new Error(`Failed to record metric for operation: ${operation}`);
      }

      return { result, metric };
    } catch (error) {
      this.endOperation(operation, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics for a specific operation
   */
  getMetricsForOperation(operation: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.operation === operation);
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalDuration: 0,
        operationCount: 0,
        averageDuration: 0,
        slowestOperation: null,
        fastestOperation: null,
        metrics: [],
        timestamp: new Date()
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;

    const sortedByDuration = [...this.metrics].sort((a, b) => a.duration - b.duration);
    const fastestOperation = sortedByDuration[0];
    const slowestOperation = sortedByDuration[sortedByDuration.length - 1];

    return {
      totalDuration,
      operationCount: this.metrics.length,
      averageDuration,
      slowestOperation,
      fastestOperation,
      metrics: this.getMetrics(),
      timestamp: new Date()
    };
  }

  /**
   * Check if performance meets target threshold
   */
  meetsPerformanceTarget(targetMs: number): boolean {
    const report = this.generateReport();
    return report.totalDuration <= targetMs;
  }

  /**
   * Get operations exceeding threshold
   */
  getSlowOperations(thresholdMs: number): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration > thresholdMs);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.activeOperations.clear();
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    total: number;
    average: number;
    min: number;
    max: number;
    median: number;
  } {
    if (this.metrics.length === 0) {
      return { total: 0, average: 0, min: 0, max: 0, median: 0 };
    }

    const durations = this.metrics.map(m => m.duration).sort((a, b) => a - b);
    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = total / durations.length;
    const min = durations[0];
    const max = durations[durations.length - 1];
    const median = durations[Math.floor(durations.length / 2)];

    return { total, average, min, max, median };
  }
}
