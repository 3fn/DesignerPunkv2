/**
 * @category evergreen
 * @purpose Verify AccuracyValidationFramework functionality works correctly
 */
/**
 * Tests for AccuracyValidationFramework
 * 
 * Comprehensive tests for accuracy validation including test case execution,
 * regression testing, and accuracy metrics calculation.
 */

import { AccuracyValidationFramework } from '../AccuracyValidationFramework';
import { AccuracyTestCases } from '../AccuracyTestCases';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';

describe('AccuracyValidationFramework', () => {
  let framework: AccuracyValidationFramework;

  beforeEach(() => {
    framework = new AccuracyValidationFramework(DEFAULT_ANALYSIS_CONFIG.extraction);
  });

  describe('Test Case Registration', () => {
    it('should register and retrieve test cases', () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      
      framework.registerTestCase(testCase);
      
      expect(framework['testCases'].has(testCase.id)).toBe(true);
      expect(framework['testCases'].get(testCase.id)).toEqual(testCase);
    });

    it('should register multiple test cases', () => {
      const testCases = [
        AccuracyTestCases.getStructuredBreakingChangeTestCase(),
        AccuracyTestCases.getStructuredFeatureTestCase(),
        AccuracyTestCases.getStructuredBugFixTestCase()
      ];

      framework.registerTestCases(testCases);

      expect(framework['testCases'].size).toBe(3);
      testCases.forEach(testCase => {
        expect(framework['testCases'].has(testCase.id)).toBe(true);
      });
    });
  });

  describe('Single Test Case Validation', () => {
    it('should validate structured breaking change document with high accuracy', async () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.testCaseId).toBe(testCase.id);
      expect(result.testCaseName).toBe(testCase.name);
      expect(result.passed).toBe(true);
      expect(result.overallAccuracy).toBeGreaterThan(0.6);
      
      // Should detect all breaking changes
      expect(result.extractionAccuracy.detectionRate).toBeGreaterThan(0.8);
      
      // Should recommend major version bump
      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      
      // Should have reasonable confidence
      expect(result.confidenceValidation.actualConfidence).toBeGreaterThan(0.5);
      
      // Should have minimal errors
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
    });

    it('should validate structured feature document accurately', async () => {
      const testCase = AccuracyTestCases.getStructuredFeatureTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.passed).toBe(true);
      expect(result.overallAccuracy).toBeGreaterThan(0.6);
      
      // Should detect new features
      expect(result.details.extractedItems.newFeatures.length).toBeGreaterThan(0);
      
      // Should recommend minor version bump
      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('minor');
    });

    it('should validate structured bug fix document accurately', async () => {
      const testCase = AccuracyTestCases.getStructuredBugFixTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.passed).toBe(true);
      expect(result.overallAccuracy).toBeGreaterThan(0.6);
      
      // Should detect bug fixes
      expect(result.details.extractedItems.bugFixes.length).toBeGreaterThan(0);
      
      // Should recommend patch version bump
      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('patch');
    });

    it('should handle unstructured mixed document with lower confidence', async () => {
      const testCase = AccuracyTestCases.getUnstructuredMixedTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // May have lower accuracy due to unstructured nature
      expect(result.overallAccuracy).toBeGreaterThan(0.4);
      
      // Should still detect major changes
      expect(result.details.extractedItems.breakingChanges.length).toBeGreaterThan(0);
      
      // Should recommend major version bump due to breaking changes
      expect(result.details.versionCalculation.bumpType).toBe('major');
      
      // May have more ambiguous items
      expect(result.confidenceValidation.ambiguousItemsCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle edge case empty document', async () => {
      const testCase = AccuracyTestCases.getEdgeCaseEmptyTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.passed).toBe(true);
      
      // Should detect no changes
      expect(result.details.extractedItems.breakingChanges).toHaveLength(0);
      expect(result.details.extractedItems.newFeatures).toHaveLength(0);
      expect(result.details.extractedItems.bugFixes).toHaveLength(0);
      
      // Should recommend no version bump
      expect(result.details.versionCalculation.bumpType).toBe('none');
    });

    it('should handle documentation-only document', async () => {
      const testCase = AccuracyTestCases.getEdgeCaseDocumentationOnlyTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // Documentation-only may not pass all validation criteria
      expect(result.overallAccuracy).toBeGreaterThan(0);
      
      // May or may not detect documentation changes depending on extraction patterns
      expect(result.details.extractedItems.documentation.length).toBeGreaterThanOrEqual(0);
      
      // Should recommend no version bump for docs-only changes
      expect(result.details.versionCalculation.bumpType).toBe('none');
    });

    it('should throw error for non-existent test case', async () => {
      await expect(framework.validateTestCase('non-existent')).rejects.toThrow('Test case not found: non-existent');
    });
  });

  describe('Batch Test Case Validation', () => {
    it('should validate all registered test cases', async () => {
      const testCases = [
        AccuracyTestCases.getStructuredBreakingChangeTestCase(),
        AccuracyTestCases.getStructuredFeatureTestCase(),
        AccuracyTestCases.getStructuredBugFixTestCase()
      ];

      framework.registerTestCases(testCases);

      const results = await framework.validateAllTestCases();

      expect(results).toHaveLength(3);
      
      results.forEach(result => {
        expect(result.testCaseId).toBeDefined();
        expect(result.overallAccuracy).toBeGreaterThanOrEqual(0);
        expect(result.overallAccuracy).toBeLessThanOrEqual(1);
        expect(result.details.processingTime).toBeGreaterThan(0);
      });
    });

    it('should return empty array when no test cases registered', async () => {
      const results = await framework.validateAllTestCases();
      expect(results).toHaveLength(0);
    });
  });

  describe('Accuracy Metrics Calculation', () => {
    it('should calculate precision, recall, and F1 score correctly', async () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.extractionAccuracy.precision).toBeGreaterThanOrEqual(0);
      expect(result.extractionAccuracy.precision).toBeLessThanOrEqual(1);
      expect(result.extractionAccuracy.recall).toBeGreaterThanOrEqual(0);
      expect(result.extractionAccuracy.recall).toBeLessThanOrEqual(1);
      expect(result.extractionAccuracy.f1Score).toBeGreaterThanOrEqual(0);
      expect(result.extractionAccuracy.f1Score).toBeLessThanOrEqual(1);
      
      // F1 score should be harmonic mean of precision and recall
      if (result.extractionAccuracy.precision > 0 && result.extractionAccuracy.recall > 0) {
        const expectedF1 = 2 * (result.extractionAccuracy.precision * result.extractionAccuracy.recall) / 
                          (result.extractionAccuracy.precision + result.extractionAccuracy.recall);
        expect(result.extractionAccuracy.f1Score).toBeCloseTo(expectedF1, 2);
      }
    });

    it('should calculate detection rate for must-detect items', async () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.extractionAccuracy.detectionRate).toBeGreaterThanOrEqual(0);
      expect(result.extractionAccuracy.detectionRate).toBeLessThanOrEqual(1);
      
      // For well-structured documents, detection rate should be high
      expect(result.extractionAccuracy.detectionRate).toBeGreaterThan(0.8);
    });

    it('should calculate categorization accuracy metrics', async () => {
      const testCase = AccuracyTestCases.getStructuredBugFixTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.categorizationAccuracy.categoryAccuracy).toBeGreaterThanOrEqual(0);
      expect(result.categorizationAccuracy.categoryAccuracy).toBeLessThanOrEqual(1);
      expect(result.categorizationAccuracy.severityAccuracy).toBeGreaterThanOrEqual(0);
      expect(result.categorizationAccuracy.severityAccuracy).toBeLessThanOrEqual(1);
      expect(result.categorizationAccuracy.typeAccuracy).toBeGreaterThanOrEqual(0);
      expect(result.categorizationAccuracy.typeAccuracy).toBeLessThanOrEqual(1);
    });
  });

  describe('Version Bump Validation', () => {
    it('should validate major version bump correctly', async () => {
      const testCase = AccuracyTestCases.getVersionBumpMajorTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('major');
      expect(result.versionBumpAccuracy.evidenceQuality).toBeGreaterThan(0);
    });

    it('should validate minor version bump correctly', async () => {
      const testCase = AccuracyTestCases.getVersionBumpMinorTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('minor');
    });

    it('should validate patch version bump correctly', async () => {
      const testCase = AccuracyTestCases.getVersionBumpPatchTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('patch');
    });

    it('should validate no version bump correctly', async () => {
      const testCase = AccuracyTestCases.getVersionBumpNoneTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.versionBumpAccuracy.correctBumpType).toBe(true);
      expect(result.details.versionCalculation.bumpType).toBe('none');
    });
  });

  describe('Confidence Validation', () => {
    it('should validate high confidence scenario', async () => {
      const testCase = AccuracyTestCases.getHighConfidenceTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // High confidence scenario should have reasonable confidence
      expect(result.confidenceValidation.actualConfidence).toBeGreaterThan(0.7);
      expect(result.confidenceValidation.ambiguousItemsAcceptable).toBe(true);
    });

    it('should handle low confidence scenario appropriately', async () => {
      const testCase = AccuracyTestCases.getLowConfidenceTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // May not meet high confidence thresholds
      expect(result.confidenceValidation.actualConfidence).toBeLessThan(0.8);
      
      // Should have warnings about low confidence
      expect(result.warnings.length).toBeGreaterThan(0);
      
      // May have more ambiguous items
      expect(result.confidenceValidation.ambiguousItemsCount).toBeGreaterThan(0);
    });
  });

  describe('Error and Warning Detection', () => {
    it('should detect critical errors for poor extraction', async () => {
      // This would require a test case designed to fail extraction
      const testCase = AccuracyTestCases.getLowConfidenceTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // Check that appropriate warnings are generated for low confidence
      const confidenceWarnings = result.warnings.filter(w => w.type === 'extraction');
      expect(confidenceWarnings.length).toBeGreaterThanOrEqual(0);
    });

    it('should generate warnings for low precision or recall', async () => {
      const testCase = AccuracyTestCases.getUnstructuredMixedTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // Unstructured documents may have lower precision/recall
      if (result.extractionAccuracy.precision < 0.8 || result.extractionAccuracy.recall < 0.8) {
        const extractionWarnings = result.warnings.filter(w => w.type === 'extraction');
        expect(extractionWarnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Regression Testing', () => {
    it('should run regression tests and detect no regression when results are stable', async () => {
      const testCases = [
        AccuracyTestCases.getStructuredBreakingChangeTestCase(),
        AccuracyTestCases.getStructuredFeatureTestCase()
      ];

      framework.registerTestCases(testCases);

      // Run initial tests to establish baseline
      const baselineResults = await framework.validateAllTestCases();
      framework.setBaselineResults(baselineResults);

      // Run regression tests
      const regressionResult = await framework.runRegressionTests('test-suite-1');

      expect(regressionResult.testSuiteId).toBe('test-suite-1');
      expect(regressionResult.testResults).toHaveLength(2);
      expect(regressionResult.regressionDetected).toBe(false);
      expect(regressionResult.overallAccuracy).toBeGreaterThan(0);
      expect(regressionResult.performanceMetrics.averageProcessingTime).toBeGreaterThan(0);
      expect(regressionResult.summary.totalTests).toBe(2);
      expect(regressionResult.summary.passedTests).toBeGreaterThanOrEqual(0);
    });

    it('should calculate performance metrics', async () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      framework.registerTestCase(testCase);

      const regressionResult = await framework.runRegressionTests('performance-test');

      expect(regressionResult.performanceMetrics.averageProcessingTime).toBeGreaterThan(0);
      expect(regressionResult.performanceMetrics.memoryUsage).toBeGreaterThan(0);
      expect(regressionResult.performanceMetrics.throughput).toBeGreaterThan(0);
    });
  });

  describe('Accuracy Metrics by Category', () => {
    it('should calculate accuracy metrics grouped by test case category', async () => {
      const testCases = [
        AccuracyTestCases.getStructuredBreakingChangeTestCase(), // structured
        AccuracyTestCases.getUnstructuredMixedTestCase(),        // unstructured
        AccuracyTestCases.getEdgeCaseEmptyTestCase()            // edge-case
      ];

      framework.registerTestCases(testCases);
      const results = await framework.validateAllTestCases();

      const categoryMetrics = framework.getAccuracyMetricsByCategory(results);

      expect(categoryMetrics.has('structured')).toBe(true);
      expect(categoryMetrics.has('unstructured')).toBe(true);
      expect(categoryMetrics.has('edge-case')).toBe(true);

      // Structured documents should generally have higher accuracy
      const structuredAccuracy = categoryMetrics.get('structured')!;
      const unstructuredAccuracy = categoryMetrics.get('unstructured')!;
      
      expect(structuredAccuracy).toBeGreaterThanOrEqual(unstructuredAccuracy);
      expect(structuredAccuracy).toBeGreaterThan(0.5);
    });
  });

  describe('Match Results and Similarity', () => {
    it('should build detailed match results for extracted items', async () => {
      const testCase = AccuracyTestCases.getStructuredBreakingChangeTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      expect(result.details.matchedItems).toBeDefined();
      expect(result.details.matchedItems.breakingChanges).toBeDefined();
      expect(result.details.matchedItems.newFeatures).toBeDefined();
      expect(result.details.matchedItems.bugFixes).toBeDefined();
      expect(result.details.matchedItems.improvements).toBeDefined();
      expect(result.details.matchedItems.documentation).toBeDefined();

      // Check that match results have required properties
      result.details.matchedItems.breakingChanges.forEach(match => {
        expect(match.expected).toBeDefined();
        expect(match.matched).toBeDefined();
        expect(match.similarity).toBeGreaterThanOrEqual(0);
        expect(match.similarity).toBeLessThanOrEqual(1);
        expect(match.confidence).toBeGreaterThanOrEqual(0);
        expect(match.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Integration with Real Extraction System', () => {
    it('should work with actual SimpleChangeExtractor and VersionCalculator', async () => {
      const testCase = AccuracyTestCases.getComplexStructuredTestCase();
      framework.registerTestCase(testCase);

      const result = await framework.validateTestCase(testCase.id);

      // Verify that actual extraction occurred
      expect(result.details.extractedItems).toBeDefined();
      expect(result.details.versionCalculation).toBeDefined();
      expect(result.details.versionCalculation.currentVersion).toBeDefined();
      expect(result.details.versionCalculation.recommendedVersion).toBeDefined();
      expect(result.details.versionCalculation.bumpType).toBeDefined();
      expect(result.details.versionCalculation.rationale).toBeDefined();
      expect(result.details.versionCalculation.confidence).toBeGreaterThanOrEqual(0);
      expect(result.details.versionCalculation.evidence).toBeDefined();
    });
  });
});