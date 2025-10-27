"use strict";
/**
 * Tests for AnalysisValidator
 *
 * Comprehensive test suite for validation system including version validation,
 * release note quality checks, confidence thresholds, and quality gates.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AnalysisValidator_1 = require("../AnalysisValidator");
describe('AnalysisValidator', () => {
    let validator;
    let mockChanges;
    let mockVersionRecommendation;
    beforeEach(() => {
        validator = new AnalysisValidator_1.AnalysisValidator();
        mockChanges = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [],
            metadata: {
                documentsAnalyzed: 3,
                extractionConfidence: 0.8,
                ambiguousItems: [],
                filteredItems: []
            }
        };
        mockVersionRecommendation = {
            currentVersion: '1.0.0',
            recommendedVersion: '1.1.0',
            bumpType: 'minor',
            rationale: 'Minor version bump due to new features',
            confidence: 0.85,
            evidence: [
                {
                    type: 'feature',
                    description: '2 new features added',
                    source: 'completion documents',
                    impact: 'medium',
                    count: 2
                }
            ]
        };
    });
    describe('validateAnalysis', () => {
        it('should validate complete analysis with passing results', () => {
            const releaseNotes = `# 1.1.0

This release includes 2 new features.

## ✨ New Features

- **Feature A**: Adds new functionality for users
- **Feature B**: Improves user experience with better interface`;
            mockChanges.newFeatures = [
                {
                    id: '1',
                    title: 'Feature A',
                    description: 'Adds new functionality',
                    benefits: ['Better UX'],
                    requirements: [],
                    artifacts: [],
                    source: 'task-1.md',
                    category: 'enhancement'
                },
                {
                    id: '2',
                    title: 'Feature B',
                    description: 'Improves interface',
                    benefits: ['Cleaner UI'],
                    requirements: [],
                    artifacts: [],
                    source: 'task-2.md',
                    category: 'ui'
                }
            ];
            const result = validator.validateAnalysis(mockChanges, mockVersionRecommendation, releaseNotes);
            expect(result.valid).toBe(true);
            expect(result.status).toBe('pass');
            expect(result.score).toBeGreaterThan(0.7);
            expect(result.errors).toHaveLength(0);
        });
        it('should fail validation for critical quality gate failures', () => {
            // Set low extraction confidence to trigger critical failure
            mockChanges.metadata.extractionConfidence = 0.5;
            const releaseNotes = '# 1.1.0\n\nSome changes.';
            const result = validator.validateAnalysis(mockChanges, mockVersionRecommendation, releaseNotes);
            expect(result.valid).toBe(false);
            expect(result.status).toBe('fail');
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.details.qualityGates.some(gate => gate.name === 'extraction_confidence' && !gate.passed && gate.critical)).toBe(true);
        });
        it('should generate warnings for non-critical issues', () => {
            // Add ambiguous items to trigger warnings
            mockChanges.metadata.ambiguousItems = ['unclear item 1', 'unclear item 2'];
            // Use release notes with vague language to trigger suggestions
            const releaseNotes = `# 1.1.0

## Features
- Various improvements and other changes`;
            const result = validator.validateAnalysis(mockChanges, mockVersionRecommendation, releaseNotes);
            expect(result.valid).toBe(true);
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings).toContainEqual(expect.stringContaining('ambiguous items detected'));
        });
    });
    describe('validateVersionRecommendation', () => {
        it('should validate correct semantic version progression', () => {
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.valid).toBe(true);
            expect(result.semanticCompliance).toBe(true);
            expect(result.progressionValid).toBe(true);
            expect(result.bumpTypeCorrect).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect invalid semantic version format', () => {
            mockVersionRecommendation.currentVersion = 'invalid-version';
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.valid).toBe(false);
            expect(result.semanticCompliance).toBe(false);
            expect(result.errors).toContainEqual(expect.stringContaining('Current version "invalid-version" is not a valid semantic version'));
        });
        it('should detect invalid version progression', () => {
            mockVersionRecommendation.recommendedVersion = '2.0.0'; // Should be 1.1.0 for minor bump
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.valid).toBe(false);
            expect(result.progressionValid).toBe(false);
            expect(result.errors).toContainEqual(expect.stringContaining('Version progression from 1.0.0 to 2.0.0 is invalid for minor bump'));
        });
        it('should detect incorrect bump type for breaking changes', () => {
            mockChanges.breakingChanges = [
                {
                    id: '1',
                    title: 'Breaking Change',
                    description: 'Removes old API',
                    affectedAPIs: ['oldAPI'],
                    source: 'task-1.md',
                    severity: 'high'
                }
            ];
            // Keep minor bump type - should be major for breaking changes
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.valid).toBe(false);
            expect(result.bumpTypeCorrect).toBe(false);
            expect(result.errors).toContainEqual(expect.stringContaining('Recommended minor bump is insufficient for detected changes (expected major)'));
        });
        it('should warn about low confidence for major version bumps', () => {
            mockVersionRecommendation.bumpType = 'major';
            mockVersionRecommendation.recommendedVersion = '2.0.0';
            mockVersionRecommendation.confidence = 0.6; // Below threshold for major bumps
            mockChanges.breakingChanges = [
                {
                    id: '1',
                    title: 'Breaking Change',
                    description: 'Major API change',
                    affectedAPIs: ['api'],
                    source: 'task-1.md',
                    severity: 'high'
                }
            ];
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.warnings).toContainEqual(expect.stringContaining('Low confidence (0.60) for major version bump - manual review recommended'));
        });
        it('should validate pre-release versions', () => {
            mockVersionRecommendation.currentVersion = '1.0.0-beta.1';
            mockVersionRecommendation.recommendedVersion = '1.0.0-beta.2';
            mockVersionRecommendation.bumpType = 'none'; // Pre-release increment doesn't follow normal bump rules
            const result = validator.validateVersionRecommendation(mockVersionRecommendation, mockChanges);
            expect(result.semanticCompliance).toBe(true);
            // Note: progressionValid may be false for pre-release versions as they don't follow standard bump rules
        });
    });
    describe('validateReleaseNotes', () => {
        it('should validate well-formatted release notes', () => {
            const releaseNotes = `# 1.1.0

This release includes 2 new features and 1 bug fix.

## ✨ New Features

- **Feature A**: Comprehensive description of the new feature that provides significant value to users
- **Feature B**: Another detailed feature description with clear benefits

## 🐛 Bug Fixes

- **Bug Fix**: Detailed description of what was fixed and why it matters`;
            mockChanges.newFeatures = [
                {
                    id: '1',
                    title: 'Feature A',
                    description: 'New feature',
                    benefits: [],
                    requirements: [],
                    artifacts: [],
                    source: 'task-1.md',
                    category: 'enhancement'
                }
            ];
            const result = validator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.valid).toBe(true);
            expect(result.formatting).toBeGreaterThan(0.8);
            expect(result.completeness).toBeGreaterThan(0.8);
            expect(result.clarity).toBeGreaterThan(0.8);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect empty release notes', () => {
            const result = validator.validateReleaseNotes('', mockChanges);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Release notes are empty');
            expect(result.score).toBe(0);
        });
        it('should detect missing breaking change documentation', () => {
            mockChanges.breakingChanges = [
                {
                    id: '1',
                    title: 'Breaking Change',
                    description: 'Removes API',
                    affectedAPIs: ['api'],
                    source: 'task-1.md',
                    severity: 'high'
                }
            ];
            const releaseNotes = `# 1.1.0

## Features
- New feature added`;
            const result = validator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Breaking changes detected but not documented in release notes');
        });
        it('should warn about missing migration guidance for breaking changes', () => {
            mockChanges.breakingChanges = [
                {
                    id: '1',
                    title: 'Breaking Change',
                    description: 'API change',
                    affectedAPIs: ['api'],
                    source: 'task-1.md',
                    severity: 'high'
                }
            ];
            const releaseNotes = `# 1.1.0

## Breaking Changes
- API has been changed`;
            const result = validator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.warnings).toContain('Breaking changes should include migration guidance');
        });
        it('should suggest improvements for short descriptions', () => {
            const releaseNotes = `# 1.1.0

## Features
- Fix
- Update
- Change`;
            const result = validator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.suggestions).toContainEqual(expect.stringContaining('change descriptions are very short - consider adding more detail'));
        });
        it('should suggest avoiding vague language', () => {
            const releaseNotes = `# 1.1.0

## Features
- Various improvements to the system
- Some bug fixes and other changes`;
            const result = validator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.suggestions).toContain('Consider replacing vague terms with specific descriptions');
        });
    });
    describe('validateConfidence', () => {
        it('should validate confidence levels above thresholds', () => {
            const result = validator.validateConfidence(mockChanges, mockVersionRecommendation);
            expect(result.valid).toBe(true);
            expect(result.thresholdsMet).toBe(true);
            expect(result.overallConfidence).toBeGreaterThan(0.8);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect confidence below minimum threshold', () => {
            mockChanges.metadata.extractionConfidence = 0.4;
            mockVersionRecommendation.confidence = 0.4;
            const result = validator.validateConfidence(mockChanges, mockVersionRecommendation);
            expect(result.valid).toBe(false);
            expect(result.thresholdsMet).toBe(false);
            expect(result.errors).toContainEqual(expect.stringContaining('Overall confidence (0.40) below minimum threshold'));
            expect(result.errors).toContainEqual(expect.stringContaining('Extraction confidence (0.40) below threshold'));
        });
        it('should warn about ambiguous items affecting confidence', () => {
            mockChanges.metadata.ambiguousItems = ['item1', 'item2'];
            const result = validator.validateConfidence(mockChanges, mockVersionRecommendation);
            expect(result.warnings).toContain('2 ambiguous items detected - may affect confidence');
        });
    });
    describe('quality gates', () => {
        it('should evaluate all enabled quality gates', () => {
            const releaseNotes = `# 1.1.0

## Features
- Well documented feature with comprehensive description`;
            const result = validator.validateAnalysis(mockChanges, mockVersionRecommendation, releaseNotes);
            expect(result.details.qualityGates).toHaveLength(4); // Default gates
            expect(result.details.qualityGates.every(gate => gate.passed)).toBe(true);
        });
        it('should fail critical quality gates', () => {
            mockChanges.metadata.extractionConfidence = 0.5; // Below critical threshold
            const result = validator.validateAnalysis(mockChanges, mockVersionRecommendation, '# 1.1.0');
            const extractionGate = result.details.qualityGates.find(gate => gate.name === 'extraction_confidence');
            expect(extractionGate?.passed).toBe(false);
            expect(extractionGate?.critical).toBe(true);
            expect(result.status).toBe('fail');
        });
    });
    describe('custom configuration', () => {
        it('should use custom confidence thresholds', () => {
            const customConfig = {
                confidenceThresholds: {
                    minimum: 0.9,
                    warning: 0.95,
                    good: 0.98,
                    extraction: 0.9,
                    version: 0.9
                }
            };
            const customValidator = new AnalysisValidator_1.AnalysisValidator(customConfig);
            // Confidence that would pass default thresholds but fail custom ones
            mockChanges.metadata.extractionConfidence = 0.85;
            mockVersionRecommendation.confidence = 0.85;
            const result = customValidator.validateConfidence(mockChanges, mockVersionRecommendation);
            expect(result.valid).toBe(false);
            expect(result.errors).toContainEqual(expect.stringContaining('below minimum threshold (0.9)'));
        });
        it('should use custom quality gates', () => {
            const customConfig = {
                qualityGates: [
                    { name: 'custom_gate', threshold: 0.95, critical: true, enabled: true }
                ]
            };
            const customValidator = new AnalysisValidator_1.AnalysisValidator(customConfig);
            const releaseNotes = '# 1.1.0\n\nChanges.';
            const result = customValidator.validateAnalysis(mockChanges, mockVersionRecommendation, releaseNotes);
            expect(result.details.qualityGates).toHaveLength(1);
            expect(result.details.qualityGates[0].name).toBe('custom_gate');
        });
        it('should use custom release note requirements', () => {
            const customConfig = {
                releaseNoteRequirements: {
                    minimumSections: 2,
                    requireBreakingChangeDetails: true,
                    requireMigrationGuidance: false,
                    minimumDescriptionLength: 50,
                    requireSummary: true
                }
            };
            const customValidator = new AnalysisValidator_1.AnalysisValidator(customConfig);
            const releaseNotes = `# 1.1.0

## Features
- Short description`; // Below 50 character minimum
            const result = customValidator.validateReleaseNotes(releaseNotes, mockChanges);
            expect(result.suggestions).toContainEqual(expect.stringContaining('change descriptions are very short'));
        });
    });
});
//# sourceMappingURL=AnalysisValidator.test.js.map