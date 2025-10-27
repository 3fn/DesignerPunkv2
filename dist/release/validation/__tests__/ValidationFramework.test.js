"use strict";
/**
 * Validation Framework Tests
 *
 * Tests for the comprehensive release validation system
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const ReleaseConfig_1 = require("../../config/ReleaseConfig");
describe('Validation Framework', () => {
    let releaseValidator;
    let semanticVersionValidator;
    let releaseReadinessValidator;
    let safetyValidator;
    beforeEach(() => {
        releaseValidator = new index_1.ReleaseValidator(ReleaseConfig_1.DEFAULT_RELEASE_CONFIG);
        semanticVersionValidator = new index_1.SemanticVersionValidator(ReleaseConfig_1.DEFAULT_RELEASE_CONFIG.versioning.semanticVersioning);
        releaseReadinessValidator = new index_1.ReleaseReadinessValidator(ReleaseConfig_1.DEFAULT_RELEASE_CONFIG.validation.validationRules);
        safetyValidator = new index_1.SafetyValidator(ReleaseConfig_1.DEFAULT_RELEASE_CONFIG.validation.safetyChecks);
    });
    describe('ReleaseValidator', () => {
        it('should validate configuration completeness', () => {
            const result = releaseValidator.validateConfiguration();
            expect(result).toBeDefined();
            expect(result.context).toBe('configuration-validation');
            expect(result.validatedAt).toBeInstanceOf(Date);
        });
        it('should validate error handling configuration', async () => {
            const result = await releaseValidator.validateErrorHandling();
            expect(result).toBeDefined();
            expect(result.context).toBe('error-handling-validation');
            expect(result.valid).toBe(true);
        });
        it('should generate error guidance for failed validation', () => {
            const mockValidationResult = {
                valid: false,
                errors: [{
                        code: 'TEST_ERROR',
                        message: 'Test error message',
                        severity: 'error',
                        suggestion: 'Test suggestion'
                    }],
                warnings: [{
                        code: 'TEST_WARNING',
                        message: 'Test warning message',
                        suggestion: 'Test warning suggestion'
                    }],
                validatedAt: new Date(),
                context: 'test-validation'
            };
            const guidance = releaseValidator.generateErrorGuidance(mockValidationResult);
            expect(guidance).toContain('Critical Issues');
            expect(guidance).toContain('Test error message');
            expect(guidance).toContain('Test suggestion');
            expect(guidance).toContain('Warnings');
            expect(guidance).toContain('Test warning message');
        });
        it('should validate release plan structure', async () => {
            const mockReleasePlan = {
                id: 'test-release-1',
                version: {
                    from: '1.0.0',
                    to: '1.1.0',
                    type: 'minor',
                    rationale: 'New features added',
                    calculatedAt: new Date()
                },
                packages: [{
                        name: '@designerpunk/tokens',
                        versionBump: {
                            from: '1.0.0',
                            to: '1.1.0',
                            type: 'minor',
                            rationale: 'New features added',
                            calculatedAt: new Date()
                        },
                        dependencyUpdates: [],
                        needsPublishing: true,
                        publishingPriority: 1
                    }],
                releaseNotes: {
                    version: '1.1.0',
                    date: new Date().toISOString(),
                    summary: 'Test release',
                    breakingChanges: [],
                    newFeatures: [],
                    improvements: [],
                    bugFixes: [],
                    format: 'markdown',
                    content: 'Test content'
                },
                publishingPlan: {
                    order: ['@designerpunk/tokens'],
                    parallelGroups: [['@designerpunk/tokens']],
                    estimatedDuration: 300000,
                    steps: []
                },
                validationResults: [],
                createdAt: new Date()
            };
            const result = await releaseValidator.validateReleasePlan(mockReleasePlan);
            expect(result).toBeDefined();
            expect(result.context).toBe('release-plan-validation');
            expect(result.valid).toBe(true);
        });
    });
    describe('SemanticVersionValidator', () => {
        it('should validate semantic version format', async () => {
            const result = await semanticVersionValidator.validateVersion('1.2.3');
            expect(result).toBeDefined();
            expect(result.context).toBe('version-format');
            expect(result.valid).toBe(true);
        });
        it('should reject invalid version format', async () => {
            const result = await semanticVersionValidator.validateVersion('invalid-version');
            expect(result).toBeDefined();
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0].code).toBe('INVALID_SEMVER_FORMAT');
        });
        it('should validate version bump progression', async () => {
            const versionBump = {
                from: '1.0.0',
                to: '1.1.0',
                type: 'minor',
                rationale: 'New features added',
                calculatedAt: new Date()
            };
            const result = await semanticVersionValidator.validateVersionBump(versionBump);
            expect(result).toBeDefined();
            expect(result.context).toBe('semantic-versioning');
            expect(result.valid).toBe(true);
        });
        it('should detect invalid version progression', async () => {
            const versionBump = {
                from: '1.1.0',
                to: '1.0.0',
                type: 'minor',
                rationale: 'Invalid progression',
                calculatedAt: new Date()
            };
            const result = await semanticVersionValidator.validateVersionBump(versionBump);
            expect(result).toBeDefined();
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
    describe('ReleaseReadinessValidator', () => {
        it('should validate release plan structure', async () => {
            const mockReleasePlan = {
                version: {
                    from: '1.0.0',
                    to: '1.0.1',
                    type: 'patch',
                    rationale: 'Test release',
                    calculatedAt: new Date()
                },
                packages: [],
                releaseNotes: {
                    version: '1.0.0',
                    date: new Date().toISOString(),
                    summary: 'Test release',
                    breakingChanges: [],
                    newFeatures: [],
                    improvements: [],
                    bugFixes: [],
                    format: 'markdown',
                    content: 'Test content'
                }
            };
            const result = await releaseReadinessValidator.validateReleaseReadiness(mockReleasePlan);
            expect(result).toBeDefined();
            expect(result.context).toBe('release-readiness');
        });
    });
    describe('SafetyValidator', () => {
        it('should validate release safety', async () => {
            const mockReleasePlan = {
                version: {
                    from: '1.0.0',
                    to: '1.0.1',
                    type: 'patch',
                    rationale: 'Bug fixes',
                    calculatedAt: new Date()
                },
                packages: [],
                releaseNotes: {
                    version: '1.0.1',
                    date: new Date().toISOString(),
                    summary: 'Bug fix release',
                    breakingChanges: [],
                    newFeatures: [],
                    improvements: [],
                    bugFixes: [],
                    format: 'markdown',
                    content: 'Bug fixes'
                },
                publishingPlan: {
                    order: [],
                    parallelGroups: [],
                    estimatedDuration: 0,
                    steps: []
                }
            };
            const result = await safetyValidator.validateReleaseSafety(mockReleasePlan);
            expect(result).toBeDefined();
            expect(result.context).toBe('release-safety');
        });
    });
    describe('Integration Tests', () => {
        it('should perform comprehensive validation', async () => {
            const mockReleasePlan = {
                id: 'test-release-comprehensive',
                version: {
                    from: '1.0.0',
                    to: '1.1.0',
                    type: 'minor',
                    rationale: 'New features and improvements',
                    calculatedAt: new Date()
                },
                packages: [{
                        name: '@designerpunk/tokens',
                        versionBump: {
                            from: '1.0.0',
                            to: '1.1.0',
                            type: 'minor',
                            rationale: 'New token features',
                            calculatedAt: new Date()
                        },
                        dependencyUpdates: [],
                        needsPublishing: true,
                        publishingPriority: 1
                    }],
                releaseNotes: {
                    version: '1.1.0',
                    date: new Date().toISOString(),
                    summary: 'Minor release with new features',
                    breakingChanges: [],
                    newFeatures: [{
                            id: 'feature-1',
                            title: 'New Token System',
                            description: 'Added new token system',
                            requirements: ['REQ-1'],
                            artifacts: ['tokens.ts'],
                            source: 'spec-completion.md',
                            category: 'new-functionality'
                        }],
                    improvements: [],
                    bugFixes: [],
                    format: 'markdown',
                    content: '# Release 1.1.0\n\nNew features added.'
                },
                publishingPlan: {
                    order: ['@designerpunk/tokens'],
                    parallelGroups: [['@designerpunk/tokens']],
                    estimatedDuration: 300000,
                    steps: [{
                            step: 1,
                            type: 'npm-publish',
                            packages: ['@designerpunk/tokens'],
                            description: 'Publish tokens package',
                            estimatedDuration: 60000,
                            canRunInParallel: false
                        }]
                },
                validationResults: [],
                createdAt: new Date()
            };
            const result = await releaseValidator.validateRelease(mockReleasePlan);
            expect(result).toBeDefined();
            expect(result.context).toBe('comprehensive-release-validation');
            expect(result.validatedAt).toBeInstanceOf(Date);
            // The result may have warnings and some expected errors in test environment
            expect(result).toBeDefined();
            expect(result.context).toBe('comprehensive-release-validation');
            // Check that we get expected validation errors for missing test environment setup
            const errorCodes = result.errors.map(e => e.code);
            expect(errorCodes).toContain('MISSING_SPEC_COMPLETION'); // Expected in test environment
            expect(errorCodes).toContain('MISSING_ROLLBACK_PLAN'); // Expected in test environment
            expect(errorCodes).toContain('MISSING_GITHUB_TOKEN'); // Expected in test environment
            expect(errorCodes).toContain('MISSING_NPM_TOKEN'); // Expected in test environment
        });
    });
});
//# sourceMappingURL=ValidationFramework.test.js.map