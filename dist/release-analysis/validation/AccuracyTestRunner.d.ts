/**
 * Accuracy Test Runner
 *
 * Utility for running accuracy validation tests and generating comprehensive reports.
 * Provides CLI interface and programmatic API for accuracy validation.
 */
import { AccuracyValidationResult, RegressionTestResult } from './AccuracyValidationFramework';
import { ExtractionConfig } from '../config/AnalysisConfig';
export interface AccuracyTestRunOptions {
    /** Test categories to include */
    categories?: ('structured' | 'unstructured' | 'mixed' | 'edge-case')[];
    /** Test difficulty levels to include */
    difficulties?: ('easy' | 'medium' | 'hard' | 'expert')[];
    /** Specific test case IDs to run */
    testCaseIds?: string[];
    /** Whether to run regression tests */
    runRegression?: boolean;
    /** Baseline results for regression testing */
    baselineResults?: AccuracyValidationResult[];
    /** Output format for results */
    outputFormat?: 'summary' | 'detailed' | 'json';
    /** Whether to save results to file */
    saveResults?: boolean;
    /** Output file path */
    outputPath?: string;
}
export interface AccuracyTestReport {
    timestamp: Date;
    testSuiteId: string;
    options: AccuracyTestRunOptions;
    results: AccuracyValidationResult[];
    regressionResult?: RegressionTestResult;
    summary: AccuracyTestSummary;
    recommendations: string[];
}
export interface AccuracyTestSummary {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    overallAccuracy: number;
    averageProcessingTime: number;
    categoryBreakdown: Map<string, CategorySummary>;
    accuracyMetrics: SystemAccuracyMetrics;
    performanceMetrics: SystemPerformanceMetrics;
}
export interface CategorySummary {
    testCount: number;
    passedCount: number;
    averageAccuracy: number;
    averageConfidence: number;
    commonIssues: string[];
}
export interface SystemAccuracyMetrics {
    extraction: {
        precision: number;
        recall: number;
        f1Score: number;
        detectionRate: number;
    };
    categorization: {
        categoryAccuracy: number;
        severityAccuracy: number;
        typeAccuracy: number;
    };
    versionBump: {
        correctBumpRate: number;
        confidenceRate: number;
        evidenceQuality: number;
    };
    confidence: {
        thresholdMetRate: number;
        averageConfidence: number;
        ambiguousItemRate: number;
    };
}
export interface SystemPerformanceMetrics {
    averageProcessingTime: number;
    memoryUsage: number;
    throughput: number;
    performanceConsistency: number;
}
export declare class AccuracyTestRunner {
    private framework;
    constructor(config: ExtractionConfig);
    /**
     * Run accuracy validation tests with specified options
     */
    runTests(options?: AccuracyTestRunOptions): Promise<AccuracyTestReport>;
    /**
     * Run quick accuracy check with default test cases
     */
    runQuickCheck(): Promise<AccuracyTestReport>;
    /**
     * Run comprehensive accuracy validation with all test cases
     */
    runComprehensiveValidation(): Promise<AccuracyTestReport>;
    /**
     * Run regression tests against baseline
     */
    runRegressionValidation(baselineResults: AccuracyValidationResult[]): Promise<AccuracyTestReport>;
    /**
     * Generate formatted report string
     */
    formatReport(report: AccuracyTestReport, format?: 'summary' | 'detailed' | 'json'): string;
    /**
     * Select test cases based on options
     */
    private selectTestCases;
    /**
     * Generate test summary
     */
    private generateSummary;
    /**
     * Calculate system-wide accuracy metrics
     */
    private calculateSystemAccuracyMetrics;
    /**
     * Calculate system performance metrics
     */
    private calculateSystemPerformanceMetrics;
    /**
     * Identify common issues across test results
     */
    private identifyCommonIssues;
    /**
     * Generate recommendations based on test results
     */
    private generateRecommendations;
    /**
     * Format summary report
     */
    private formatSummaryReport;
    /**
     * Format detailed report
     */
    private formatDetailedReport;
    /**
     * Save report to file
     */
    private saveReport;
}
//# sourceMappingURL=AccuracyTestRunner.d.ts.map