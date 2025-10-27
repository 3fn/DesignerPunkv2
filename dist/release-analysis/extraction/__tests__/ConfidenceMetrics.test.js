"use strict";
/**
 * Tests for ConfidenceMetrics system
 *
 * Validates confidence scoring, quality indicators, uncertainty flagging,
 * and validation reporting functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ConfidenceMetrics_1 = require("../ConfidenceMetrics");
describe('ConfidenceMetrics', () => {
    let confidenceMetrics;
    let mockThresholds;
    beforeEach(() => {
        mockThresholds = {
            minimumConfidence: 0.6,
            uncertaintyThreshold: 0.8,
            reviewThreshold: 0.7,
            deduplicationThreshold: 0.8,
            semanticSimilarityThreshold: 0.7
        };
        confidenceMetrics = new ConfidenceMetrics_1.ConfidenceMetrics(mockThresholds);
    });
    describe('calculateConfidenceScore', () => {
        it('should calculate overall confidence score from components', () => {
            const mockChanges = {
                breakingChanges: [createMockBreakingChange()],
                newFeatures: [createMockFeature()],
                bugFixes: [createMockBugFix()],
                improvements: [createMockImprovement()],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 2,
                    extractionConfidence: 0.8,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const mockDocuments = [
                createMockDocument('doc1.md', 'Well structured document with clear sections'),
                createMockDocument('doc2.md', 'Another structured document')
            ];
            const result = confidenceMetrics.calculateConfidenceScore(mockChanges, mockDocuments);
            expect(result.overall).toBeGreaterThan(0);
            expect(result.overall).toBeLessThanOrEqual(1);
            expect(result.components).toHaveProperty('extraction');
            expect(result.components).toHaveProperty('categorization');
            expect(result.components).toHaveProperty('completeness');
            expect(result.components).toHaveProperty('consistency');
        });
        it('should include quality indicators', () => {
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.7,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const mockDocuments = [
                createMockDocument('doc1.md', '# Title\n\n## Section\n\n- Item 1\n- Item 2')
            ];
            const result = confidenceMetrics.calculateConfidenceScore(mockChanges, mockDocuments);
            expect(result.quality).toHaveProperty('completeness');
            expect(result.quality).toHaveProperty('consistency');
            expect(result.quality).toHaveProperty('structureQuality');
            expect(result.quality).toHaveProperty('categorizationAccuracy');
            expect(result.quality).toHaveProperty('informationRichness');
        });
        it('should identify uncertainties when confidence is low', () => {
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.4, // Low confidence
                    ambiguousItems: ['Unclear item 1', 'Unclear item 2'],
                    filteredItems: []
                }
            };
            const mockDocuments = [
                createMockDocument('doc1.md', 'Poorly structured content')
            ];
            const result = confidenceMetrics.calculateConfidenceScore(mockChanges, mockDocuments);
            expect(result.uncertainties.length).toBeGreaterThan(0);
            expect(result.uncertainties.some(u => u.type === 'ambiguous-categorization')).toBe(true);
            expect(result.uncertainties.some(u => u.type === 'low-confidence-extraction')).toBe(true);
        });
        it('should validate confidence against thresholds', () => {
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.5, // Below minimum threshold
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const mockDocuments = [
                createMockDocument('doc1.md', 'Content')
            ];
            const result = confidenceMetrics.calculateConfidenceScore(mockChanges, mockDocuments);
            expect(result.validation.meetsThresholds).toBe(false);
            expect(result.validation.status).toBe('fail');
            expect(result.validation.thresholdViolations.length).toBeGreaterThan(0);
            expect(result.validation.recommendations.length).toBeGreaterThan(0);
        });
    });
    describe('calculateItemConfidence', () => {
        it('should calculate confidence for individual items', () => {
            const mockItem = createMockFeature();
            const context = {
                documentStructure: 'structured',
                extractionMethod: 'section',
                sectionMatch: {
                    header: 'New Features',
                    content: 'Feature content',
                    startLine: 10,
                    endLine: 15,
                    type: 'feature',
                    confidence: 0.9
                }
            };
            const result = confidenceMetrics.calculateItemConfidence(mockItem, context);
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
            expect(result.factors.length).toBeGreaterThan(0);
            expect(result.factors.every(f => f.weight > 0 && f.weight <= 1)).toBe(true);
        });
        it('should identify uncertainties for low-quality items', () => {
            const mockItem = {
                id: 'test-feature',
                title: 'F', // Very short title
                description: 'Short', // Very short description
                benefits: [],
                requirements: [],
                artifacts: [],
                source: 'test.md:1',
                category: 'other'
            };
            const context = {
                documentStructure: 'unstructured',
                extractionMethod: 'pattern',
                patternMatch: {
                    pattern: 'feature',
                    match: 'feature',
                    confidence: 0.3, // Low confidence
                    context: 'feature context',
                    line: 1,
                    type: 'feature'
                }
            };
            const result = confidenceMetrics.calculateItemConfidence(mockItem, context);
            expect(result.uncertainties.length).toBeGreaterThan(0);
            expect(result.uncertainties.some(u => u.includes('title'))).toBe(true);
            expect(result.uncertainties.some(u => u.includes('description'))).toBe(true);
        });
    });
    describe('generateQualityReport', () => {
        it('should generate comprehensive quality report', () => {
            const mockConfidenceScore = {
                overall: 0.75,
                components: {
                    extraction: 0.8,
                    categorization: 0.7,
                    completeness: 0.75,
                    consistency: 0.7
                },
                quality: {
                    completeness: 0.75,
                    consistency: 0.7,
                    structureQuality: 0.8,
                    categorizationAccuracy: 0.7,
                    informationRichness: 0.6
                },
                uncertainties: [
                    {
                        type: 'ambiguous-categorization',
                        severity: 'medium',
                        description: 'Some items need review',
                        source: 'test',
                        suggestedAction: 'Review items',
                        affectedItems: ['item1']
                    }
                ],
                validation: {
                    meetsThresholds: true,
                    thresholdViolations: [],
                    recommendations: [],
                    status: 'pass'
                }
            };
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [createMockFeature()],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.75,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const result = confidenceMetrics.generateQualityReport(mockConfidenceScore, mockChanges);
            expect(result.summary).toContain('75.0%');
            expect(result.summary).toContain('PASS');
            expect(result.details.length).toBeGreaterThan(0);
            expect(result.details.every(d => d.title && d.content)).toBe(true);
            expect(Array.isArray(result.recommendations)).toBe(true);
            expect(Array.isArray(result.actionItems)).toBe(true);
        });
        it('should include high priority action items for critical issues', () => {
            const mockConfidenceScore = {
                overall: 0.4, // Low confidence
                components: {
                    extraction: 0.4,
                    categorization: 0.4,
                    completeness: 0.4,
                    consistency: 0.4
                },
                quality: {
                    completeness: 0.4,
                    consistency: 0.4,
                    structureQuality: 0.4,
                    categorizationAccuracy: 0.4,
                    informationRichness: 0.4
                },
                uncertainties: [
                    {
                        type: 'low-confidence-extraction',
                        severity: 'high',
                        description: 'Critical extraction issues',
                        source: 'test',
                        suggestedAction: 'Immediate review required',
                        affectedItems: ['critical-item']
                    }
                ],
                validation: {
                    meetsThresholds: false,
                    thresholdViolations: [
                        {
                            threshold: 'minimumConfidence',
                            expected: 0.6,
                            actual: 0.4,
                            impact: 'Quality below acceptable threshold'
                        }
                    ],
                    recommendations: [
                        {
                            type: 'review-extraction',
                            priority: 'high',
                            description: 'Critical review needed',
                            actions: ['Review extraction patterns', 'Validate results manually']
                        }
                    ],
                    status: 'fail'
                }
            };
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.4,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const result = confidenceMetrics.generateQualityReport(mockConfidenceScore, mockChanges);
            expect(result.actionItems.length).toBeGreaterThan(0);
            expect(result.actionItems.some(item => item.includes('HIGH PRIORITY'))).toBe(true);
        });
    });
    // Helper functions for creating mock data
    function createMockBreakingChange() {
        return {
            id: 'breaking-1',
            title: 'API method removed',
            description: 'The deprecated method has been removed from the API',
            affectedAPIs: ['oldMethod()'],
            migrationGuidance: 'Use newMethod() instead',
            source: 'test.md:10',
            severity: 'high'
        };
    }
    function createMockFeature() {
        return {
            id: 'feature-1',
            title: 'New authentication system',
            description: 'Added comprehensive authentication with OAuth2 support',
            benefits: ['Improved security', 'Better user experience'],
            requirements: ['OAuth2 provider setup'],
            artifacts: ['AuthService.ts', 'LoginComponent.tsx'],
            source: 'test.md:20',
            category: 'security'
        };
    }
    function createMockBugFix() {
        return {
            id: 'bugfix-1',
            title: 'Fixed memory leak in component',
            description: 'Resolved memory leak caused by event listener cleanup',
            issueNumber: '#123',
            affectedComponents: ['UserComponent'],
            source: 'test.md:30',
            severity: 'medium'
        };
    }
    function createMockImprovement() {
        return {
            id: 'improvement-1',
            title: 'Optimized database queries',
            description: 'Improved query performance by adding proper indexes',
            type: 'performance',
            impact: 'high',
            source: 'test.md:40'
        };
    }
    function createMockDocument(path, content) {
        return {
            path,
            content,
            lastModified: new Date(),
            gitCommit: 'abc123',
            metadata: {
                title: 'Test Document',
                type: 'task-completion'
            }
        };
    }
});
//# sourceMappingURL=ConfidenceMetrics.test.js.map