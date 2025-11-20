"use strict";
/**
 * Test file to validate IDE experience improvements
 * This file tests autocomplete, go-to-definition, and hover tooltips
 * for types created during TypeScript error resolution
 *
 * This file will be deleted after validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validFormat = exports.validCategory = exports.validSeverity = exports.performanceRate = exports.categorizationAccuracy = exports.extractionPrecision = exports.reportTimestamp = exports.summaryTotal = exports.optionsVerbose = exports.detailsSeverity = exports.contextOperation = exports.testAccuracyTestReport = exports.testAccuracyTestSummary = exports.testEvaluationOptions = exports.testErrorDetails = exports.testErrorContext = void 0;
// Test 1: ErrorContext autocomplete and type checking
const testErrorContext = {
    operation: 'test-operation',
    component: 'test-component',
    filePath: '/test/path',
    gitCommand: 'git log',
    userAction: 'test-action',
    timestamp: new Date()
};
exports.testErrorContext = testErrorContext;
// Test 2: ErrorDetails autocomplete and type checking
const testErrorDetails = {
    code: 'TEST_ERROR',
    message: 'Test error message',
    severity: 'medium',
    category: 'validation',
    context: testErrorContext,
    recoveryStrategies: [],
    userGuidance: 'Test guidance'
};
exports.testErrorDetails = testErrorDetails;
// Test 3: EvaluationOptions autocomplete and type checking
const testEvaluationOptions = {
    outputPath: '/test/output',
    verbose: true,
    testCasesPath: '/test/cases',
    format: 'markdown'
};
exports.testEvaluationOptions = testEvaluationOptions;
// Test 4: AccuracyTestSummary autocomplete and type checking
const testAccuracyTestSummary = {
    totalTests: 100,
    passedTests: 95,
    failedTests: 5,
    overallAccuracy: 0.95,
    averageProcessingTime: 100,
    categoryBreakdown: new Map(),
    accuracyMetrics: {
        extraction: {
            precision: 0.95,
            recall: 0.93,
            f1Score: 0.94,
            detectionRate: 0.96
        },
        categorization: {
            categoryAccuracy: 0.92,
            severityAccuracy: 0.91,
            typeAccuracy: 0.93
        },
        versionBump: {
            correctBumpRate: 0.94,
            confidenceRate: 0.90,
            evidenceQuality: 0.88
        },
        confidence: {
            thresholdMetRate: 0.85,
            averageConfidence: 0.87,
            ambiguousItemRate: 0.15
        }
    },
    performanceMetrics: {
        averageProcessingTime: 100,
        totalProcessingTime: 10000,
        documentsProcessed: 100,
        processingRate: 10
    }
};
exports.testAccuracyTestSummary = testAccuracyTestSummary;
// Test 5: AccuracyTestReport autocomplete and type checking
const testAccuracyTestReport = {
    timestamp: new Date(),
    testSuiteId: 'test-suite-1',
    options: {
        categories: ['test'],
        runRegression: false,
        format: 'summary'
    },
    results: [],
    summary: testAccuracyTestSummary,
    recommendations: ['Test recommendation']
};
exports.testAccuracyTestReport = testAccuracyTestReport;
// Test 6: Verify property access with autocomplete
const contextOperation = testErrorContext.operation; // Should autocomplete .operation
exports.contextOperation = contextOperation;
const detailsSeverity = testErrorDetails.severity; // Should autocomplete .severity
exports.detailsSeverity = detailsSeverity;
const optionsVerbose = testEvaluationOptions.verbose; // Should autocomplete .verbose
exports.optionsVerbose = optionsVerbose;
const summaryTotal = testAccuracyTestSummary.totalTests; // Should autocomplete .totalTests
exports.summaryTotal = summaryTotal;
const reportTimestamp = testAccuracyTestReport.timestamp; // Should autocomplete .timestamp
exports.reportTimestamp = reportTimestamp;
// Test 7: Verify nested property access
const extractionPrecision = testAccuracyTestSummary.accuracyMetrics.extraction.precision;
exports.extractionPrecision = extractionPrecision;
const categorizationAccuracy = testAccuracyTestSummary.accuracyMetrics.categorization.categoryAccuracy;
exports.categorizationAccuracy = categorizationAccuracy;
const performanceRate = testAccuracyTestSummary.performanceMetrics.processingRate;
exports.performanceRate = performanceRate;
// Test 8: Verify type unions work correctly
const validSeverity = 'high'; // Should accept 'low' | 'medium' | 'high' | 'critical'
exports.validSeverity = validSeverity;
const validCategory = 'git'; // Should accept specific categories
exports.validCategory = validCategory;
const validFormat = 'json'; // Should accept 'markdown' | 'json' | 'console'
exports.validFormat = validFormat;
//# sourceMappingURL=test-ide-experience.js.map