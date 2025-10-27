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
export declare class PerformanceMonitor {
    private metrics;
    private activeOperations;
    /**
     * Start timing an operation
     */
    startOperation(operation: string): void;
    /**
     * End timing an operation and record the metric
     */
    endOperation(operation: string, metadata?: Record<string, any>): PerformanceMetric | null;
    /**
     * Measure the execution time of a function
     */
    measure<T>(operation: string, fn: () => T | Promise<T>, metadata?: Record<string, any>): Promise<{
        result: T;
        metric: PerformanceMetric;
    }>;
    /**
     * Get all recorded metrics
     */
    getMetrics(): PerformanceMetric[];
    /**
     * Get metrics for a specific operation
     */
    getMetricsForOperation(operation: string): PerformanceMetric[];
    /**
     * Generate performance report
     */
    generateReport(): PerformanceReport;
    /**
     * Check if performance meets target threshold
     */
    meetsPerformanceTarget(targetMs: number): boolean;
    /**
     * Get operations exceeding threshold
     */
    getSlowOperations(thresholdMs: number): PerformanceMetric[];
    /**
     * Clear all metrics
     */
    clear(): void;
    /**
     * Get summary statistics
     */
    getSummary(): {
        total: number;
        average: number;
        min: number;
        max: number;
        median: number;
    };
}
//# sourceMappingURL=PerformanceMonitor.d.ts.map