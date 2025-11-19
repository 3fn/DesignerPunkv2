/**
 * Core Type Definitions for Release Analysis System
 * 
 * This file consolidates type definitions used across the release-analysis module
 * to resolve TypeScript compilation errors and provide a single source of truth
 * for shared types.
 * 
 * Requirements addressed:
 * - 3.1: Define missing types for release-analysis module
 */

/**
 * Context information for error reporting
 * Provides details about where and when an error occurred
 */
export interface ErrorContext {
  /** The operation being performed when the error occurred */
  operation: string;
  
  /** The component or module where the error occurred */
  component: string;
  
  /** Optional file path related to the error */
  filePath?: string;
  
  /** Optional Git command that was being executed */
  gitCommand?: string;
  
  /** Optional user action that triggered the error */
  userAction?: string;
  
  /** Timestamp when the error occurred */
  timestamp: Date;
}

/**
 * Detailed error information structure
 * Provides comprehensive error details for handling and reporting
 */
export interface ErrorDetails {
  /** Unique error code for identification */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Severity level of the error */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Category of the error for classification */
  category: 'git' | 'parsing' | 'validation' | 'configuration' | 'filesystem' | 'network';
  
  /** Context information about where the error occurred */
  context: ErrorContext;
  
  /** Available recovery strategies for this error */
  recoveryStrategies: RecoveryStrategy[];
  
  /** User-facing guidance for resolving the error */
  userGuidance: string;
  
  /** Optional technical details for debugging */
  technicalDetails?: string;
}

/**
 * Recovery strategy for error handling
 * Defines how to recover from a specific error
 */
export interface RecoveryStrategy {
  /** Type of recovery strategy */
  type: 'fallback' | 'retry' | 'skip' | 'manual' | 'abort';
  
  /** Description of the recovery strategy */
  description: string;
  
  /** Optional action to execute for recovery */
  action?: () => Promise<any>;
  
  /** Guidance for manual recovery steps */
  guidance: string;
}

/**
 * Configuration options for evaluation process
 * Controls how evaluation is performed and reported
 */
export interface EvaluationOptions {
  /** Optional output path for evaluation results */
  outputPath?: string;
  
  /** Enable verbose logging during evaluation */
  verbose?: boolean;
  
  /** Optional path to test cases file */
  testCasesPath?: string;
  
  /** Output format for evaluation results */
  format?: 'markdown' | 'json' | 'console';
}

/**
 * Report structure for accuracy testing
 * Contains comprehensive results from accuracy validation tests
 */
export interface AccuracyTestReport {
  /** Timestamp when the test was run */
  timestamp: Date;
  
  /** Unique identifier for this test suite run */
  testSuiteId: string;
  
  /** Options used for this test run */
  options: AccuracyTestRunOptions;
  
  /** Individual test results */
  results: AccuracyValidationResult[];
  
  /** Optional regression test result */
  regressionResult?: RegressionTestResult;
  
  /** Summary of test results */
  summary: AccuracyTestSummary;
  
  /** Recommendations based on test results */
  recommendations: string[];
}

/**
 * Summary structure for accuracy test results
 * Provides high-level metrics and breakdowns
 */
export interface AccuracyTestSummary {
  /** Total number of tests run */
  totalTests: number;
  
  /** Number of tests that passed */
  passedTests: number;
  
  /** Number of tests that failed */
  failedTests: number;
  
  /** Overall accuracy percentage across all tests */
  overallAccuracy: number;
  
  /** Average processing time per test */
  averageProcessingTime: number;
  
  /** Breakdown of results by category */
  categoryBreakdown: Map<string, CategorySummary>;
  
  /** System-wide accuracy metrics */
  accuracyMetrics: SystemAccuracyMetrics;
  
  /** System-wide performance metrics */
  performanceMetrics: SystemPerformanceMetrics;
}

/**
 * Summary for a specific test category
 */
export interface CategorySummary {
  /** Number of tests in this category */
  testCount: number;
  
  /** Number of tests that passed in this category */
  passedCount: number;
  
  /** Average accuracy for this category */
  averageAccuracy: number;
  
  /** Average confidence for this category */
  averageConfidence: number;
  
  /** Common issues found in this category */
  commonIssues: string[];
}

/**
 * System-wide accuracy metrics
 */
export interface SystemAccuracyMetrics {
  /** Extraction accuracy metrics */
  extraction: {
    precision: number;
    recall: number;
    f1Score: number;
    detectionRate: number;
  };
  
  /** Categorization accuracy metrics */
  categorization: {
    categoryAccuracy: number;
    severityAccuracy: number;
    typeAccuracy: number;
  };
  
  /** Version bump accuracy metrics */
  versionBump: {
    correctBumpRate: number;
    confidenceRate: number;
    evidenceQuality: number;
  };
  
  /** Confidence scoring metrics */
  confidence: {
    thresholdMetRate: number;
    averageConfidence: number;
    ambiguousItemRate: number;
  };
}

/**
 * System-wide performance metrics
 */
export interface SystemPerformanceMetrics {
  /** Average processing time in milliseconds */
  averageProcessingTime: number;
  
  /** Total processing time in milliseconds */
  totalProcessingTime: number;
  
  /** Number of documents processed */
  documentsProcessed: number;
  
  /** Processing rate (documents per second) */
  processingRate: number;
}

/**
 * Options for running accuracy tests
 */
export interface AccuracyTestRunOptions {
  /** Categories of tests to run */
  categories?: string[];
  
  /** Whether to run regression tests */
  runRegression?: boolean;
  
  /** Baseline results for regression testing */
  baselineResults?: AccuracyValidationResult[];
  
  /** Output path for test results */
  outputPath?: string;
  
  /** Output format for test results */
  format?: 'summary' | 'detailed' | 'json';
}

/**
 * Result from a single accuracy validation test
 */
export interface AccuracyValidationResult {
  /** Unique identifier for this test */
  testId: string;
  
  /** Name of the test */
  testName: string;
  
  /** Category of the test */
  category: string;
  
  /** Whether the test passed */
  passed: boolean;
  
  /** Accuracy score (0-1) */
  accuracy: number;
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Processing time in milliseconds */
  processingTime: number;
  
  /** Expected result */
  expected: any;
  
  /** Actual result */
  actual: any;
  
  /** Issues found during validation */
  issues: string[];
}

/**
 * Result from regression testing
 */
export interface RegressionTestResult {
  /** Whether regression tests passed */
  passed: boolean;
  
  /** Number of regressions detected */
  regressionsDetected: number;
  
  /** Details of regressions */
  regressions: RegressionDetail[];
  
  /** Overall accuracy change */
  accuracyChange: number;
  
  /** Performance change */
  performanceChange: number;
}

/**
 * Detail about a specific regression
 */
export interface RegressionDetail {
  /** Test that regressed */
  testId: string;
  
  /** Previous accuracy */
  previousAccuracy: number;
  
  /** Current accuracy */
  currentAccuracy: number;
  
  /** Accuracy change (negative indicates regression) */
  accuracyChange: number;
  
  /** Description of the regression */
  description: string;
}
