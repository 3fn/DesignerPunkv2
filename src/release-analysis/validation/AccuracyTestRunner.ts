/**
 * Accuracy Test Runner
 * 
 * Utility for running accuracy validation tests and generating comprehensive reports.
 * Provides CLI interface and programmatic API for accuracy validation.
 */

import { AccuracyValidationFramework, AccuracyValidationResult, RegressionTestResult } from './AccuracyValidationFramework';
import { AccuracyTestCases } from './AccuracyTestCases';
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

export class AccuracyTestRunner {
  private framework: AccuracyValidationFramework;

  constructor(config: ExtractionConfig) {
    this.framework = new AccuracyValidationFramework(config);
  }

  /**
   * Run accuracy validation tests with specified options
   */
  async runTests(options: AccuracyTestRunOptions = {}): Promise<AccuracyTestReport> {
    const testSuiteId = `accuracy-test-${Date.now()}`;
    const timestamp = new Date();

    // Register test cases based on options
    const testCases = this.selectTestCases(options);
    this.framework.registerTestCases(testCases);

    // Set baseline for regression testing if provided
    if (options.baselineResults) {
      this.framework.setBaselineResults(options.baselineResults);
    }

    // Run validation tests
    const results = await this.framework.validateAllTestCases();

    // Run regression tests if requested
    let regressionResult: RegressionTestResult | undefined;
    if (options.runRegression) {
      regressionResult = await this.framework.runRegressionTests(testSuiteId);
    }

    // Generate summary and recommendations
    const summary = this.generateSummary(results);
    const recommendations = this.generateRecommendations(results, summary);

    const report: AccuracyTestReport = {
      timestamp,
      testSuiteId,
      options,
      results,
      regressionResult,
      summary,
      recommendations
    };

    // Save results if requested
    if (options.saveResults && options.outputPath) {
      await this.saveReport(report, options.outputPath, options.outputFormat || 'detailed');
    }

    return report;
  }

  /**
   * Run quick accuracy check with default test cases
   */
  async runQuickCheck(): Promise<AccuracyTestReport> {
    return this.runTests({
      categories: ['structured'],
      difficulties: ['easy', 'medium'],
      outputFormat: 'summary'
    });
  }

  /**
   * Run comprehensive accuracy validation with all test cases
   */
  async runComprehensiveValidation(): Promise<AccuracyTestReport> {
    return this.runTests({
      runRegression: true,
      outputFormat: 'detailed'
    });
  }

  /**
   * Run regression tests against baseline
   */
  async runRegressionValidation(baselineResults: AccuracyValidationResult[]): Promise<AccuracyTestReport> {
    return this.runTests({
      runRegression: true,
      baselineResults,
      outputFormat: 'detailed'
    });
  }

  /**
   * Generate formatted report string
   */
  formatReport(report: AccuracyTestReport, format: 'summary' | 'detailed' | 'json' = 'detailed'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'summary':
        return this.formatSummaryReport(report);
      case 'detailed':
        return this.formatDetailedReport(report);
      default:
        return this.formatDetailedReport(report);
    }
  }

  /**
   * Select test cases based on options
   */
  private selectTestCases(options: AccuracyTestRunOptions) {
    let testCases = AccuracyTestCases.getAllTestCases();

    // Filter by specific test case IDs
    if (options.testCaseIds && options.testCaseIds.length > 0) {
      testCases = testCases.filter(tc => options.testCaseIds!.includes(tc.id));
    }

    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      testCases = testCases.filter(tc => options.categories!.includes(tc.metadata.category));
    }

    // Filter by difficulties
    if (options.difficulties && options.difficulties.length > 0) {
      testCases = testCases.filter(tc => options.difficulties!.includes(tc.metadata.difficulty));
    }

    return testCases;
  }

  /**
   * Generate test summary
   */
  private generateSummary(results: AccuracyValidationResult[]): AccuracyTestSummary {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const overallAccuracy = results.reduce((sum, r) => sum + r.overallAccuracy, 0) / totalTests;
    const averageProcessingTime = results.reduce((sum, r) => sum + r.details.processingTime, 0) / totalTests;

    // Category breakdown
    const categoryBreakdown = new Map<string, CategorySummary>();
    const categoryGroups = new Map<string, AccuracyValidationResult[]>();

    results.forEach(result => {
      const testCase = AccuracyTestCases.getAllTestCases().find(tc => tc.id === result.testCaseId);
      if (testCase) {
        const category = testCase.metadata.category;
        if (!categoryGroups.has(category)) {
          categoryGroups.set(category, []);
        }
        categoryGroups.get(category)!.push(result);
      }
    });

    categoryGroups.forEach((categoryResults, category) => {
      const testCount = categoryResults.length;
      const passedCount = categoryResults.filter(r => r.passed).length;
      const averageAccuracy = categoryResults.reduce((sum, r) => sum + r.overallAccuracy, 0) / testCount;
      const averageConfidence = categoryResults.reduce((sum, r) => sum + r.confidenceValidation.actualConfidence, 0) / testCount;
      
      const commonIssues = this.identifyCommonIssues(categoryResults);

      categoryBreakdown.set(category, {
        testCount,
        passedCount,
        averageAccuracy,
        averageConfidence,
        commonIssues
      });
    });

    // System accuracy metrics
    const accuracyMetrics = this.calculateSystemAccuracyMetrics(results);
    const performanceMetrics = this.calculateSystemPerformanceMetrics(results);

    return {
      totalTests,
      passedTests,
      failedTests,
      overallAccuracy,
      averageProcessingTime,
      categoryBreakdown,
      accuracyMetrics,
      performanceMetrics
    };
  }

  /**
   * Calculate system-wide accuracy metrics
   */
  private calculateSystemAccuracyMetrics(results: AccuracyValidationResult[]): SystemAccuracyMetrics {
    const extraction = {
      precision: results.reduce((sum, r) => sum + r.extractionAccuracy.precision, 0) / results.length,
      recall: results.reduce((sum, r) => sum + r.extractionAccuracy.recall, 0) / results.length,
      f1Score: results.reduce((sum, r) => sum + r.extractionAccuracy.f1Score, 0) / results.length,
      detectionRate: results.reduce((sum, r) => sum + r.extractionAccuracy.detectionRate, 0) / results.length
    };

    const categorization = {
      categoryAccuracy: results.reduce((sum, r) => sum + r.categorizationAccuracy.categoryAccuracy, 0) / results.length,
      severityAccuracy: results.reduce((sum, r) => sum + r.categorizationAccuracy.severityAccuracy, 0) / results.length,
      typeAccuracy: results.reduce((sum, r) => sum + r.categorizationAccuracy.typeAccuracy, 0) / results.length
    };

    const versionBump = {
      correctBumpRate: results.filter(r => r.versionBumpAccuracy.correctBumpType).length / results.length,
      confidenceRate: results.filter(r => r.versionBumpAccuracy.confidenceMet).length / results.length,
      evidenceQuality: results.reduce((sum, r) => sum + r.versionBumpAccuracy.evidenceQuality, 0) / results.length
    };

    const confidence = {
      thresholdMetRate: results.filter(r => r.confidenceValidation.confidenceMet).length / results.length,
      averageConfidence: results.reduce((sum, r) => sum + r.confidenceValidation.actualConfidence, 0) / results.length,
      ambiguousItemRate: results.reduce((sum, r) => sum + r.confidenceValidation.ambiguousItemsCount, 0) / results.length
    };

    return {
      extraction,
      categorization,
      versionBump,
      confidence
    };
  }

  /**
   * Calculate system performance metrics
   */
  private calculateSystemPerformanceMetrics(results: AccuracyValidationResult[]): SystemPerformanceMetrics {
    const processingTimes = results.map(r => r.details.processingTime);
    const averageProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    
    // Calculate performance consistency (lower variance = higher consistency)
    const variance = processingTimes.reduce((sum, time) => sum + Math.pow(time - averageProcessingTime, 2), 0) / processingTimes.length;
    const standardDeviation = Math.sqrt(variance);
    const performanceConsistency = 1 - (standardDeviation / averageProcessingTime);

    return {
      averageProcessingTime,
      memoryUsage: process.memoryUsage().heapUsed,
      throughput: results.length / (averageProcessingTime / 1000),
      performanceConsistency: Math.max(0, performanceConsistency)
    };
  }

  /**
   * Identify common issues across test results
   */
  private identifyCommonIssues(results: AccuracyValidationResult[]): string[] {
    const issues: string[] = [];
    const errorCounts = new Map<string, number>();
    const warningCounts = new Map<string, number>();

    results.forEach(result => {
      result.errors.forEach(error => {
        const key = `${error.type}: ${error.message}`;
        errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
      });

      result.warnings.forEach(warning => {
        const key = `${warning.type}: ${warning.message}`;
        warningCounts.set(key, (warningCounts.get(key) || 0) + 1);
      });
    });

    // Add frequent errors (appearing in >25% of results)
    const threshold = Math.ceil(results.length * 0.25);
    errorCounts.forEach((count, error) => {
      if (count >= threshold) {
        issues.push(`Frequent error: ${error} (${count}/${results.length} tests)`);
      }
    });

    warningCounts.forEach((count, warning) => {
      if (count >= threshold) {
        issues.push(`Frequent warning: ${warning} (${count}/${results.length} tests)`);
      }
    });

    return issues;
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(results: AccuracyValidationResult[], summary: AccuracyTestSummary): string[] {
    const recommendations: string[] = [];

    // Overall accuracy recommendations
    if (summary.overallAccuracy < 0.8) {
      recommendations.push(`Overall accuracy (${(summary.overallAccuracy * 100).toFixed(1)}%) is below target (80%). Consider reviewing extraction patterns and validation logic.`);
    }

    // Extraction accuracy recommendations
    if (summary.accuracyMetrics.extraction.precision < 0.8) {
      recommendations.push(`Low precision (${(summary.accuracyMetrics.extraction.precision * 100).toFixed(1)}%) indicates too many false positives. Review extraction patterns to be more specific.`);
    }

    if (summary.accuracyMetrics.extraction.recall < 0.8) {
      recommendations.push(`Low recall (${(summary.accuracyMetrics.extraction.recall * 100).toFixed(1)}%) indicates missing true positives. Consider expanding extraction patterns or improving fallback mechanisms.`);
    }

    if (summary.accuracyMetrics.extraction.detectionRate < 0.9) {
      recommendations.push(`Low detection rate for must-detect items (${(summary.accuracyMetrics.extraction.detectionRate * 100).toFixed(1)}%). Critical changes may be missed - review extraction logic for must-detect scenarios.`);
    }

    // Version bump recommendations
    if (summary.accuracyMetrics.versionBump.correctBumpRate < 0.9) {
      recommendations.push(`Version bump accuracy (${(summary.accuracyMetrics.versionBump.correctBumpRate * 100).toFixed(1)}%) is below target (90%). Review version calculation logic.`);
    }

    // Confidence recommendations
    if (summary.accuracyMetrics.confidence.thresholdMetRate < 0.7) {
      recommendations.push(`Low confidence threshold met rate (${(summary.accuracyMetrics.confidence.thresholdMetRate * 100).toFixed(1)}%). Consider adjusting confidence thresholds or improving extraction quality.`);
    }

    // Performance recommendations
    if (summary.performanceMetrics.averageProcessingTime > 2000) {
      recommendations.push(`Average processing time (${summary.performanceMetrics.averageProcessingTime}ms) is high. Consider performance optimizations.`);
    }

    if (summary.performanceMetrics.performanceConsistency < 0.8) {
      recommendations.push(`Performance consistency (${(summary.performanceMetrics.performanceConsistency * 100).toFixed(1)}%) is low. Processing times vary significantly - investigate performance bottlenecks.`);
    }

    // Category-specific recommendations
    summary.categoryBreakdown.forEach((categorySummary, category) => {
      if (categorySummary.averageAccuracy < 0.7) {
        recommendations.push(`${category} documents have low accuracy (${(categorySummary.averageAccuracy * 100).toFixed(1)}%). Focus improvement efforts on this category.`);
      }

      if (categorySummary.commonIssues.length > 0) {
        recommendations.push(`${category} documents have recurring issues: ${categorySummary.commonIssues.slice(0, 2).join(', ')}`);
      }
    });

    // Success recommendations
    if (summary.overallAccuracy > 0.9) {
      recommendations.push('Excellent overall accuracy! Consider using current configuration as baseline for regression testing.');
    }

    if (recommendations.length === 0) {
      recommendations.push('All accuracy metrics meet or exceed targets. System is performing well.');
    }

    return recommendations;
  }

  /**
   * Format summary report
   */
  private formatSummaryReport(report: AccuracyTestReport): string {
    const { summary } = report;
    
    return `
# Accuracy Validation Summary Report

**Generated**: ${report.timestamp.toISOString()}
**Test Suite**: ${report.testSuiteId}

## Overall Results
- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passedTests} (${((summary.passedTests / summary.totalTests) * 100).toFixed(1)}%)
- **Failed**: ${summary.failedTests} (${((summary.failedTests / summary.totalTests) * 100).toFixed(1)}%)
- **Overall Accuracy**: ${(summary.overallAccuracy * 100).toFixed(1)}%

## Key Metrics
- **Extraction F1 Score**: ${(summary.accuracyMetrics.extraction.f1Score * 100).toFixed(1)}%
- **Version Bump Accuracy**: ${(summary.accuracyMetrics.versionBump.correctBumpRate * 100).toFixed(1)}%
- **Confidence Threshold Met**: ${(summary.accuracyMetrics.confidence.thresholdMetRate * 100).toFixed(1)}%
- **Average Processing Time**: ${summary.averageProcessingTime.toFixed(0)}ms

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}
`.trim();
  }

  /**
   * Format detailed report
   */
  private formatDetailedReport(report: AccuracyTestReport): string {
    const { summary } = report;
    
    let categoryDetails = '';
    summary.categoryBreakdown.forEach((categorySummary, category) => {
      categoryDetails += `
### ${category.charAt(0).toUpperCase() + category.slice(1)} Documents
- **Tests**: ${categorySummary.testCount}
- **Passed**: ${categorySummary.passedCount} (${((categorySummary.passedCount / categorySummary.testCount) * 100).toFixed(1)}%)
- **Average Accuracy**: ${(categorySummary.averageAccuracy * 100).toFixed(1)}%
- **Average Confidence**: ${(categorySummary.averageConfidence * 100).toFixed(1)}%
${categorySummary.commonIssues.length > 0 ? `- **Common Issues**: ${categorySummary.commonIssues.join('; ')}` : ''}
`;
    });

    return `
# Accuracy Validation Detailed Report

**Generated**: ${report.timestamp.toISOString()}
**Test Suite**: ${report.testSuiteId}

## Executive Summary
- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passedTests} (${((summary.passedTests / summary.totalTests) * 100).toFixed(1)}%)
- **Failed**: ${summary.failedTests} (${((summary.failedTests / summary.totalTests) * 100).toFixed(1)}%)
- **Overall Accuracy**: ${(summary.overallAccuracy * 100).toFixed(1)}%

## Extraction Accuracy Metrics
- **Precision**: ${(summary.accuracyMetrics.extraction.precision * 100).toFixed(1)}%
- **Recall**: ${(summary.accuracyMetrics.extraction.recall * 100).toFixed(1)}%
- **F1 Score**: ${(summary.accuracyMetrics.extraction.f1Score * 100).toFixed(1)}%
- **Detection Rate**: ${(summary.accuracyMetrics.extraction.detectionRate * 100).toFixed(1)}%

## Categorization Accuracy Metrics
- **Category Accuracy**: ${(summary.accuracyMetrics.categorization.categoryAccuracy * 100).toFixed(1)}%
- **Severity Accuracy**: ${(summary.accuracyMetrics.categorization.severityAccuracy * 100).toFixed(1)}%
- **Type Accuracy**: ${(summary.accuracyMetrics.categorization.typeAccuracy * 100).toFixed(1)}%

## Version Bump Accuracy Metrics
- **Correct Bump Rate**: ${(summary.accuracyMetrics.versionBump.correctBumpRate * 100).toFixed(1)}%
- **Confidence Rate**: ${(summary.accuracyMetrics.versionBump.confidenceRate * 100).toFixed(1)}%
- **Evidence Quality**: ${(summary.accuracyMetrics.versionBump.evidenceQuality * 100).toFixed(1)}%

## Confidence Validation Metrics
- **Threshold Met Rate**: ${(summary.accuracyMetrics.confidence.thresholdMetRate * 100).toFixed(1)}%
- **Average Confidence**: ${(summary.accuracyMetrics.confidence.averageConfidence * 100).toFixed(1)}%
- **Ambiguous Item Rate**: ${summary.accuracyMetrics.confidence.ambiguousItemRate.toFixed(1)} per test

## Performance Metrics
- **Average Processing Time**: ${summary.performanceMetrics.averageProcessingTime.toFixed(0)}ms
- **Throughput**: ${summary.performanceMetrics.throughput.toFixed(1)} tests/second
- **Performance Consistency**: ${(summary.performanceMetrics.performanceConsistency * 100).toFixed(1)}%
- **Memory Usage**: ${(summary.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB

## Category Breakdown
${categoryDetails}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

${report.regressionResult ? `
## Regression Analysis
- **Regression Detected**: ${report.regressionResult.regressionDetected ? 'Yes' : 'No'}
- **Accuracy Change**: ${(report.regressionResult.summary.accuracyChange * 100).toFixed(2)}%
- **New Failures**: ${report.regressionResult.summary.newFailures.length}
- **Fixed Issues**: ${report.regressionResult.summary.fixedIssues.length}
` : ''}
`.trim();
  }

  /**
   * Save report to file
   */
  private async saveReport(report: AccuracyTestReport, outputPath: string, format: 'summary' | 'detailed' | 'json'): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const content = this.formatReport(report, format);
    const extension = format === 'json' ? '.json' : '.md';
    const fullPath = path.resolve(outputPath + extension);
    
    await fs.writeFile(fullPath, content, 'utf-8');
  }
}