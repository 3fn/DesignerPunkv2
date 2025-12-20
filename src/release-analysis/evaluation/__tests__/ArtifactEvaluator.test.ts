/**
 * @category evergreen
 * @purpose Verify ArtifactEvaluator functionality works correctly
 */
/**
 * Tests for Artifact Evaluation Framework
 * 
 * Validates the systematic evaluation of extraction approaches
 * and integration decision framework.
 */

import { ArtifactEvaluator, ComparisonResult, TestCase } from '../ArtifactEvaluator';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { DEFAULT_RELEASE_CONFIG } from '../../../release/config/ReleaseConfig';
import { CompletionDocument, ExtractedChanges } from '../../types/AnalysisTypes';

describe('ArtifactEvaluator', () => {
  let evaluator: ArtifactEvaluator;

  beforeEach(() => {
    evaluator = new ArtifactEvaluator(
      DEFAULT_ANALYSIS_CONFIG,
      DEFAULT_RELEASE_CONFIG.detection
    );
  });

  describe('Evaluation Framework', () => {
    it('should create evaluator with proper configuration', () => {
      expect(evaluator).toBeDefined();
    });

    it('should handle evaluation with synthetic test cases', async () => {
      // This test uses synthetic data to avoid dependency on file system
      const mockTestCase: TestCase = {
        id: 'test-case-1',
        name: 'Mock Test Case',
        document: {
          path: 'test/mock.md',
          content: `# Test Completion

## Breaking Changes
- Removed deprecated API method
- Changed interface signature

## New Features  
- Added new validation system
- Implemented cross-platform support

## Bug Fixes
- Fixed memory leak in token generation
- Resolved validation edge cases`,
          lastModified: new Date(),
          gitCommit: 'test-commit',
          metadata: {
            title: 'Mock Test Case',
            type: 'task-completion'
          }
        },
        expectedChanges: {
          breakingChanges: [
            {
              id: 'bc-1',
              title: 'Removed deprecated API method',
              description: 'Removed deprecated API method',
              affectedAPIs: ['API'],
              source: 'test/mock.md',
              severity: 'high'
            }
          ],
          newFeatures: [
            {
              id: 'nf-1',
              title: 'Added new validation system',
              description: 'Added new validation system',
              benefits: [],
              requirements: [],
              artifacts: [],
              source: 'test/mock.md',
              category: 'new-functionality'
            }
          ],
          bugFixes: [
            {
              id: 'bf-1',
              title: 'Fixed memory leak in token generation',
              description: 'Fixed memory leak in token generation',
              affectedComponents: ['TokenGenerator'],
              source: 'test/mock.md',
              severity: 'medium'
            }
          ],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        difficulty: 'medium',
        category: 'structured'
      };

      // Mock the private methods to use our test case
      const originalLoadTestCases = (evaluator as any).loadTestCases;
      (evaluator as any).loadTestCases = jest.fn().mockResolvedValue(undefined);
      (evaluator as any).testCases = [mockTestCase];

      const result = await evaluator.evaluateArtifacts();

      expect(result).toBeDefined();
      expect(result.recommendation).toBeDefined();
      expect(result.recommendation.decision).toMatch(/integrate|simplify|reject/);
      expect(result.recommendation.confidence).toBeGreaterThan(0);
      expect(result.recommendation.confidence).toBeLessThanOrEqual(1);
      expect(result.tradeoffAnalysis).toBeDefined();
      expect(result.rationale).toBeTruthy();
    }, 30000); // Increase timeout for evaluation

    it('should generate comprehensive evaluation report', async () => {
      const mockResult: ComparisonResult = {
        simpleApproach: {
          accuracy: {
            extractionAccuracy: 0.75,
            categorizationAccuracy: 0.70,
            deduplicationAccuracy: 0.80,
            falsePositiveRate: 0.15,
            falseNegativeRate: 0.10,
            precisionScore: 0.75,
            recallScore: 0.70,
            f1Score: 0.72
          },
          performance: {
            processingTimeMs: 150,
            memoryUsageMB: 5,
            throughputDocsPerSecond: 6.67,
            scalabilityFactor: 0.85,
            resourceEfficiency: 0.95
          },
          complexity: {
            linesOfCode: 1200,
            cyclomaticComplexity: 25,
            maintainabilityIndex: 75,
            dependencyCount: 5,
            testCoverage: 85,
            cognitiveLoad: 30
          },
          value: {
            accuracyImprovement: 0,
            performanceImprovement: 0,
            complexityCost: 0,
            maintenanceBurden: 0,
            integrationEffort: 0,
            overallValueScore: 0
          }
        },
        complexApproach: {
          accuracy: {
            extractionAccuracy: 0.85,
            categorizationAccuracy: 0.82,
            deduplicationAccuracy: 0.88,
            falsePositiveRate: 0.10,
            falseNegativeRate: 0.05,
            precisionScore: 0.85,
            recallScore: 0.80,
            f1Score: 0.82
          },
          performance: {
            processingTimeMs: 350,
            memoryUsageMB: 12,
            throughputDocsPerSecond: 2.86,
            scalabilityFactor: 0.65,
            resourceEfficiency: 0.88
          },
          complexity: {
            linesOfCode: 1435,
            cyclomaticComplexity: 45,
            maintainabilityIndex: 60,
            dependencyCount: 8,
            testCoverage: 90,
            cognitiveLoad: 60
          },
          value: {
            accuracyImprovement: 0,
            performanceImprovement: 0,
            complexityCost: 0,
            maintenanceBurden: 0,
            integrationEffort: 0,
            overallValueScore: 0
          }
        },
        recommendation: {
          decision: 'simplify',
          confidence: 0.7,
          conditions: ['Extract core extraction methods only', 'Simplify interfaces']
        },
        rationale: 'Moderate accuracy improvement detected, but full integration complexity not justified.',
        tradeoffAnalysis: {
          accuracyVsComplexity: 0.5,
          performanceVsComplexity: -10,
          valueVsCost: 0.5,
          riskAssessment: 'MEDIUM: Moderate complexity increase requires careful evaluation',
          mitigationStrategies: ['Extract only core methods', 'Simplify interfaces']
        }
      };

      const report = evaluator.generateEvaluationReport(mockResult);

      expect(report).toContain('# Artifact Evaluation Report');
      expect(report).toContain('## Executive Summary');
      expect(report).toContain('**Recommendation:** SIMPLIFY');
      expect(report).toContain('**Confidence:** 70%');
      expect(report).toContain('## Detailed Metrics Comparison');
      expect(report).toContain('## Tradeoff Analysis');
      expect(report).toContain('## Integration Conditions');
      expect(report).toContain('## Conclusion');
    });

    it('should make correct integration decisions based on metrics', () => {
      // Test high accuracy improvement -> integrate
      const highAccuracyMetrics = {
        simpleApproach: { accuracy: { extractionAccuracy: 0.6 }, performance: { processingTimeMs: 100 }, complexity: { cyclomaticComplexity: 20 } },
        complexApproach: { accuracy: { extractionAccuracy: 0.85 }, performance: { processingTimeMs: 300 }, complexity: { cyclomaticComplexity: 35 } }
      };

      const integrateRecommendation = (evaluator as any).generateRecommendation(
        highAccuracyMetrics.simpleApproach,
        highAccuracyMetrics.complexApproach
      );

      expect(integrateRecommendation.decision).toBe('integrate');
      expect(integrateRecommendation.confidence).toBeGreaterThan(0.7);

      // Test low accuracy improvement -> reject
      const lowAccuracyMetrics = {
        simpleApproach: { accuracy: { extractionAccuracy: 0.75 }, performance: { processingTimeMs: 100 }, complexity: { cyclomaticComplexity: 20 } },
        complexApproach: { accuracy: { extractionAccuracy: 0.78 }, performance: { processingTimeMs: 400 }, complexity: { cyclomaticComplexity: 50 } }
      };

      const rejectRecommendation = (evaluator as any).generateRecommendation(
        lowAccuracyMetrics.simpleApproach,
        lowAccuracyMetrics.complexApproach
      );

      expect(rejectRecommendation.decision).toBe('reject');
      expect(rejectRecommendation.alternatives).toBeDefined();
    });

    it('should calculate accurate fuzzy matching', () => {
      const fuzzyMatch = (evaluator as any).fuzzyMatch.bind(evaluator);

      // Exact match
      expect(fuzzyMatch('test string', 'test string')).toBe(true);

      // Similar match with common words
      expect(fuzzyMatch('implemented new feature', 'added new feature implementation')).toBe(true);

      // Partial match with shared key terms
      expect(fuzzyMatch('token validation system', 'validation system implementation')).toBe(true);

      // No match - completely different
      expect(fuzzyMatch('completely different text', 'unrelated content here')).toBe(false);

      // Empty strings
      expect(fuzzyMatch('', '')).toBe(true);
      expect(fuzzyMatch('test', '')).toBe(false);

      // Single word matches
      expect(fuzzyMatch('validation', 'validation')).toBe(true);
    });

    it('should assess risk levels correctly', () => {
      const assessRisk = (evaluator as any).assessRisk.bind(evaluator);

      // High risk - high complexity, low accuracy
      expect(assessRisk(0.05, 35, 200)).toContain('HIGH');

      // High risk - performance penalty
      expect(assessRisk(0.15, 20, 1200)).toContain('HIGH');

      // Medium risk - moderate complexity
      expect(assessRisk(0.15, 25, 300)).toContain('MEDIUM');

      // Low risk - high accuracy improvement
      expect(assessRisk(0.30, 15, 100)).toContain('LOW');
    });

    it('should generate appropriate mitigation strategies', () => {
      const generateMitigationStrategies = (evaluator as any).generateMitigationStrategies.bind(evaluator);

      // High complexity strategies
      const highComplexityStrategies = generateMitigationStrategies(0.15, 30, 200);
      expect(highComplexityStrategies).toContain('Extract only core extraction methods, leave out detection logic');
      expect(highComplexityStrategies).toContain('Simplify interfaces and remove unused configuration options');

      // High performance cost strategies
      const highPerformanceStrategies = generateMitigationStrategies(0.20, 15, 800);
      expect(highPerformanceStrategies).toContain('Optimize hot paths and reduce unnecessary processing');
      expect(highPerformanceStrategies).toContain('Implement caching for repeated operations');

      // Low accuracy strategies
      const lowAccuracyStrategies = generateMitigationStrategies(0.08, 20, 200);
      expect(lowAccuracyStrategies).toContain('Focus on specific accuracy improvements rather than full integration');
      expect(lowAccuracyStrategies).toContain('Implement hybrid approach with simple baseline and optional complexity');
    });
  });

  describe('Test Case Management', () => {
    it('should categorize document difficulty correctly', () => {
      const assessDifficulty = (evaluator as any).assessDifficulty.bind(evaluator);

      // Easy - structured and short
      const easyContent = `# Test
## Breaking Changes
- Simple change
## New Features
- Simple feature`;
      expect(assessDifficulty(easyContent)).toBe('easy');

      // Hard - unstructured and long
      const hardContent = 'A'.repeat(3000);
      expect(assessDifficulty(hardContent)).toBe('hard');
    });

    it('should categorize document structure correctly', () => {
      const categorizeDocument = (evaluator as any).categorizeDocument.bind(evaluator);

      // Structured
      const structuredContent = `# Test
## Section 1
Content
## Section 2  
Content
## Section 3
Content`;
      expect(categorizeDocument(structuredContent)).toBe('structured');

      // Unstructured
      const unstructuredContent = 'Just plain text without any sections or structure.';
      expect(categorizeDocument(unstructuredContent)).toBe('unstructured');

      // Mixed
      const mixedContent = `# Test
## One Section
Some content but not many sections.`;
      expect(categorizeDocument(mixedContent)).toBe('mixed');
    });
  });

  describe('Accuracy Calculation', () => {
    it('should calculate accuracy correctly for matching changes', () => {
      const calculateAccuracy = (evaluator as any).calculateAccuracy.bind(evaluator);

      const extracted: ExtractedChanges = {
        breakingChanges: [
          { id: '1', title: 'Removed API method', description: '', affectedAPIs: [], source: '', severity: 'high' }
        ],
        newFeatures: [
          { id: '2', title: 'Added new feature', description: '', benefits: [], requirements: [], artifacts: [], source: '', category: '' }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: { documentsAnalyzed: 1, extractionConfidence: 0.8, ambiguousItems: [], filteredItems: [] }
      };

      const expected: ExtractedChanges = {
        breakingChanges: [
          { id: '1', title: 'Removed API method', description: '', affectedAPIs: [], source: '', severity: 'high' }
        ],
        newFeatures: [
          { id: '2', title: 'Added new feature', description: '', benefits: [], requirements: [], artifacts: [], source: '', category: '' }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: { documentsAnalyzed: 1, extractionConfidence: 0.8, ambiguousItems: [], filteredItems: [] }
      };

      const accuracy = calculateAccuracy(extracted, expected);
      expect(accuracy).toBe(1.0); // Perfect match
    });

    it('should handle partial matches correctly', () => {
      const calculateAccuracy = (evaluator as any).calculateAccuracy.bind(evaluator);

      const extracted: ExtractedChanges = {
        breakingChanges: [
          { id: '1', title: 'Removed API method', description: '', affectedAPIs: [], source: '', severity: 'high' }
        ],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: { documentsAnalyzed: 1, extractionConfidence: 0.8, ambiguousItems: [], filteredItems: [] }
      };

      const expected: ExtractedChanges = {
        breakingChanges: [
          { id: '1', title: 'Removed API method', description: '', affectedAPIs: [], source: '', severity: 'high' }
        ],
        newFeatures: [
          { id: '2', title: 'Added new feature', description: '', benefits: [], requirements: [], artifacts: [], source: '', category: '' }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: { documentsAnalyzed: 1, extractionConfidence: 0.8, ambiguousItems: [], filteredItems: [] }
      };

      const accuracy = calculateAccuracy(extracted, expected);
      expect(accuracy).toBe(0.5); // 1 out of 2 expected items found
    });
  });
});