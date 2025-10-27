"use strict";
/**
 * Integration tests for SimpleChangeExtractor confidence metrics functionality
 *
 * Tests the integration between SimpleChangeExtractor and ConfidenceMetrics
 * to ensure confidence scoring, quality indicators, and uncertainty flagging
 * work correctly in the extraction workflow.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleChangeExtractor_1 = require("../SimpleChangeExtractor");
const AnalysisConfig_1 = require("../../config/AnalysisConfig");
describe('SimpleChangeExtractor - Confidence Metrics Integration', () => {
    let extractor;
    let config;
    beforeEach(() => {
        config = AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction;
        extractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(config);
    });
    describe('extractChangesWithConfidence', () => {
        it('should extract changes with comprehensive confidence metrics', async () => {
            const documents = [
                {
                    path: 'task-1-completion.md',
                    content: `# Task 1 Completion

## Breaking Changes
- Removed deprecated API method oldMethod()
- Changed interface signature for UserService

## New Features  
- Added OAuth2 authentication system
- Implemented user profile management

## Bug Fixes
- Fixed memory leak in UserComponent (#123)
- Resolved database connection timeout issue

## Improvements
- Optimized query performance with better indexing
- Enhanced error handling throughout the application
`,
                    lastModified: new Date(),
                    gitCommit: 'abc123',
                    metadata: {
                        title: 'Task 1 Completion',
                        task: '1',
                        type: 'task-completion'
                    }
                }
            ];
            const result = await extractor.extractChangesWithConfidence(documents);
            // Verify changes were extracted
            expect(result.changes.breakingChanges.length).toBeGreaterThan(0);
            expect(result.changes.newFeatures.length).toBeGreaterThan(0);
            expect(result.changes.bugFixes.length).toBeGreaterThan(0);
            expect(result.changes.improvements.length).toBeGreaterThan(0);
            // Verify confidence score structure
            expect(result.confidenceScore).toHaveProperty('overall');
            expect(result.confidenceScore).toHaveProperty('components');
            expect(result.confidenceScore).toHaveProperty('quality');
            expect(result.confidenceScore).toHaveProperty('uncertainties');
            expect(result.confidenceScore).toHaveProperty('validation');
            // Verify confidence components
            expect(result.confidenceScore.components).toHaveProperty('extraction');
            expect(result.confidenceScore.components).toHaveProperty('categorization');
            expect(result.confidenceScore.components).toHaveProperty('completeness');
            expect(result.confidenceScore.components).toHaveProperty('consistency');
            // Verify validation includes confidence score
            expect(result.validation).toHaveProperty('confidenceScore');
            expect(result.validation.confidenceScore).toStrictEqual(result.confidenceScore);
        });
        it('should handle low-quality documents with appropriate confidence scores', async () => {
            const documents = [
                {
                    path: 'poor-quality.md',
                    content: `Some changes were made. Fixed stuff. Added things.`,
                    lastModified: new Date(),
                    gitCommit: 'def456',
                    metadata: {
                        title: 'Poor Quality Document',
                        type: 'other'
                    }
                }
            ];
            const result = await extractor.extractChangesWithConfidence(documents);
            // Should have lower confidence due to poor structure
            expect(result.confidenceScore.overall).toBeLessThan(0.7);
            // Should identify uncertainties
            expect(result.confidenceScore.uncertainties.length).toBeGreaterThan(0);
            // Should have validation warnings or failures
            expect(result.validation.status).not.toBe('pass');
        });
        it('should provide detailed quality indicators', async () => {
            const documents = [
                {
                    path: 'well-structured.md',
                    content: `# Feature Implementation Completion

**Date**: 2025-01-10
**Task**: Implement user authentication
**Status**: Complete

## Summary
Successfully implemented comprehensive user authentication system with OAuth2 support.

## Breaking Changes
- **API Change**: Modified UserService.authenticate() method signature
  - **Migration**: Update calls to include new options parameter
  - **Affected APIs**: UserService.authenticate(), AuthController.login()

## New Features
- **OAuth2 Authentication**: Complete OAuth2 implementation with Google and GitHub providers
  - **Benefits**: Enhanced security, improved user experience, reduced password management
  - **Artifacts**: AuthService.ts, OAuthProvider.ts, LoginComponent.tsx
  
## Bug Fixes
- **Memory Leak Fix**: Resolved memory leak in UserComponent event listeners (#456)
  - **Affected Components**: UserComponent, ProfileComponent
  - **Severity**: High - was causing browser crashes

## Improvements
- **Performance**: Optimized authentication token validation
  - **Type**: Performance improvement
  - **Impact**: High - 50% faster login times
`,
                    lastModified: new Date(),
                    gitCommit: 'ghi789',
                    metadata: {
                        title: 'Feature Implementation Completion',
                        task: 'auth-system',
                        type: 'task-completion'
                    }
                }
            ];
            const result = await extractor.extractChangesWithConfidence(documents);
            // Should have high confidence due to good structure
            expect(result.confidenceScore.overall).toBeGreaterThan(0.7);
            // Quality indicators should be good
            expect(result.confidenceScore.quality.structureQuality).toBeGreaterThan(0.7);
            expect(result.confidenceScore.quality.informationRichness).toBeGreaterThan(0.4);
            expect(result.confidenceScore.quality.completeness).toBeGreaterThan(0.6);
            // Should have minimal uncertainties
            expect(result.confidenceScore.uncertainties.length).toBeLessThan(3);
            // Validation should pass
            expect(result.validation.status).toBe('pass');
        });
    });
    describe('calculateItemConfidence', () => {
        it('should calculate confidence for individual extracted items', async () => {
            const documents = [
                {
                    path: 'test.md',
                    content: `## New Features\n- Added comprehensive user authentication system with OAuth2 support`,
                    lastModified: new Date(),
                    gitCommit: 'test123',
                    metadata: {
                        title: 'Test',
                        type: 'task-completion'
                    }
                }
            ];
            const result = await extractor.extractChangesWithConfidence(documents);
            if (result.changes.newFeatures.length > 0) {
                const feature = result.changes.newFeatures[0];
                const itemConfidence = extractor.calculateItemConfidence(feature, {
                    documentStructure: 'structured',
                    extractionMethod: 'section'
                });
                expect(itemConfidence.confidence).toBeGreaterThan(0);
                expect(itemConfidence.confidence).toBeLessThanOrEqual(1);
                expect(itemConfidence.factors.length).toBeGreaterThan(0);
                expect(itemConfidence.factors.every(f => f.weight > 0)).toBe(true);
            }
        });
    });
    describe('generateQualityReport', () => {
        it('should generate comprehensive quality reports', async () => {
            const documents = [
                {
                    path: 'mixed-quality.md',
                    content: `# Mixed Quality Document

## Features
- New authentication (good detail)
- Added stuff (poor detail)

## Fixes  
- Fixed critical bug #123 in UserService
- Fixed things
`,
                    lastModified: new Date(),
                    gitCommit: 'mixed123',
                    metadata: {
                        title: 'Mixed Quality',
                        type: 'task-completion'
                    }
                }
            ];
            const result = await extractor.extractChangesWithConfidence(documents);
            const qualityReport = extractor.generateQualityReport(result.confidenceScore, result.changes);
            expect(qualityReport.summary).toContain('%');
            expect(qualityReport.details.length).toBeGreaterThan(0);
            expect(qualityReport.details.every(d => d.title && d.content)).toBe(true);
            expect(Array.isArray(qualityReport.recommendations)).toBe(true);
            expect(Array.isArray(qualityReport.actionItems)).toBe(true);
        });
    });
    describe('validateExtractionWithConfidence', () => {
        it('should provide enhanced validation with confidence insights', async () => {
            const documents = [
                {
                    path: 'validation-test.md',
                    content: `Minimal content with unclear changes`,
                    lastModified: new Date(),
                    gitCommit: 'val123',
                    metadata: {
                        title: 'Validation Test',
                        type: 'other'
                    }
                }
            ];
            const changes = await extractor.extractChanges(documents);
            const validation = extractor.validateExtractionWithConfidence(changes, documents);
            expect(validation).toHaveProperty('confidenceScore');
            expect(validation.confidenceScore).toHaveProperty('overall');
            expect(validation.confidenceScore).toHaveProperty('validation');
            // Should include confidence-based validation results
            if (validation.confidenceScore.overall < config.confidenceThresholds.minimumConfidence) {
                expect(validation.errors.some(e => e.type === 'confidence')).toBe(true);
            }
            if (validation.confidenceScore.uncertainties.length > 0) {
                expect(validation.warnings.length).toBeGreaterThan(0);
            }
        });
    });
    describe('confidence threshold handling', () => {
        it('should respect confidence thresholds in validation', async () => {
            // Create extractor with strict thresholds
            const strictConfig = {
                ...config,
                confidenceThresholds: {
                    minimumConfidence: 0.9,
                    uncertaintyThreshold: 0.95,
                    reviewThreshold: 0.85,
                    deduplicationThreshold: 0.8,
                    semanticSimilarityThreshold: 0.7
                }
            };
            const strictExtractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(strictConfig);
            const documents = [
                {
                    path: 'average-quality.md',
                    content: `## Changes\n- Made some improvements\n- Fixed issues`,
                    lastModified: new Date(),
                    gitCommit: 'avg123',
                    metadata: {
                        title: 'Average Quality',
                        type: 'task-completion'
                    }
                }
            ];
            const result = await strictExtractor.extractChangesWithConfidence(documents);
            // With strict thresholds, should likely fail validation
            expect(result.validation.status).not.toBe('pass');
            expect(result.validation.thresholdViolations.length).toBeGreaterThan(0);
            expect(result.validation.recommendations.length).toBeGreaterThan(0);
        });
        it('should pass validation with lenient thresholds', async () => {
            // Create extractor with lenient thresholds
            const lenientConfig = {
                ...config,
                confidenceThresholds: {
                    minimumConfidence: 0.3,
                    uncertaintyThreshold: 0.5,
                    reviewThreshold: 0.4,
                    deduplicationThreshold: 0.8,
                    semanticSimilarityThreshold: 0.7
                }
            };
            const lenientExtractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(lenientConfig);
            const documents = [
                {
                    path: 'basic-content.md',
                    content: `Some changes were made`,
                    lastModified: new Date(),
                    gitCommit: 'basic123',
                    metadata: {
                        title: 'Basic Content',
                        type: 'other'
                    }
                }
            ];
            const result = await lenientExtractor.extractChangesWithConfidence(documents);
            // With lenient thresholds, should likely pass validation
            expect(result.validation.thresholdViolations.length).toBe(0);
        });
    });
});
//# sourceMappingURL=SimpleChangeExtractor-confidence.test.js.map