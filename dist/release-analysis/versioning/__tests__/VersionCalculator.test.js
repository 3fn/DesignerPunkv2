"use strict";
/**
 * Unit tests for VersionCalculator
 *
 * Tests semantic version calculation, validation, and pre-release handling
 * based on extracted changes from completion documents.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const VersionCalculator_1 = require("../VersionCalculator");
describe('VersionCalculator', () => {
    let calculator;
    beforeEach(() => {
        calculator = new VersionCalculator_1.VersionCalculator();
    });
    describe('calculateVersionBump', () => {
        const baseChanges = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [],
            metadata: {
                documentsAnalyzed: 1,
                extractionConfidence: 0.9,
                ambiguousItems: [],
                filteredItems: []
            }
        };
        it('should recommend major version bump for breaking changes', () => {
            const breakingChange = {
                id: '1',
                title: 'Remove deprecated API',
                description: 'Removed old authentication method',
                affectedAPIs: ['auth.login'],
                source: 'task-1-completion.md',
                severity: 'high'
            };
            const changes = {
                ...baseChanges,
                breakingChanges: [breakingChange]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('major');
            expect(result.recommendedVersion).toBe('2.0.0');
            expect(result.evidence).toHaveLength(1);
            expect(result.evidence[0].type).toBe('breaking');
            expect(result.rationale).toContain('Major version bump required');
        });
        it('should recommend minor version bump for new features', () => {
            const feature = {
                id: '1',
                title: 'Add user preferences',
                description: 'Users can now customize their dashboard',
                benefits: ['Better UX'],
                requirements: ['REQ-1'],
                artifacts: ['UserPreferences.ts'],
                source: 'task-2-completion.md',
                category: 'enhancement'
            };
            const changes = {
                ...baseChanges,
                newFeatures: [feature]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('minor');
            expect(result.recommendedVersion).toBe('1.3.0');
            expect(result.evidence).toHaveLength(1);
            expect(result.evidence[0].type).toBe('feature');
            expect(result.rationale).toContain('Minor version bump recommended');
        });
        it('should recommend patch version bump for bug fixes', () => {
            const bugFix = {
                id: '1',
                title: 'Fix login validation',
                description: 'Fixed email validation regex',
                affectedComponents: ['LoginForm'],
                source: 'task-3-completion.md',
                severity: 'medium'
            };
            const changes = {
                ...baseChanges,
                bugFixes: [bugFix]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('patch');
            expect(result.recommendedVersion).toBe('1.2.4');
            expect(result.evidence).toHaveLength(1);
            expect(result.evidence[0].type).toBe('fix');
            expect(result.rationale).toContain('Patch version bump recommended');
        });
        it('should recommend patch version bump for improvements', () => {
            const improvement = {
                id: '1',
                title: 'Optimize database queries',
                description: 'Improved query performance by 50%',
                type: 'performance',
                impact: 'high',
                source: 'task-4-completion.md'
            };
            const changes = {
                ...baseChanges,
                improvements: [improvement]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('patch');
            expect(result.recommendedVersion).toBe('1.2.4');
            expect(result.evidence).toHaveLength(1);
            expect(result.evidence[0].type).toBe('improvement');
        });
        it('should recommend no version bump for documentation only', () => {
            const changes = {
                ...baseChanges,
                documentation: [{
                        id: '1',
                        title: 'Update README',
                        description: 'Added installation instructions',
                        type: 'readme',
                        source: 'task-5-completion.md'
                    }]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('none');
            expect(result.recommendedVersion).toBe('1.2.3');
            expect(result.rationale).toContain('No version bump required');
        });
        it('should prioritize breaking changes over features', () => {
            const breakingChange = {
                id: '1',
                title: 'Remove deprecated API',
                description: 'Removed old method',
                affectedAPIs: ['old.method'],
                source: 'task-1-completion.md',
                severity: 'high'
            };
            const feature = {
                id: '2',
                title: 'Add new feature',
                description: 'Added cool feature',
                benefits: ['Better UX'],
                requirements: ['REQ-1'],
                artifacts: ['Feature.ts'],
                source: 'task-2-completion.md',
                category: 'enhancement'
            };
            const changes = {
                ...baseChanges,
                breakingChanges: [breakingChange],
                newFeatures: [feature]
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('major');
            expect(result.recommendedVersion).toBe('2.0.0');
            expect(result.evidence).toHaveLength(2);
        });
        it('should calculate confidence based on extraction metadata', () => {
            const changes = {
                ...baseChanges,
                newFeatures: [{
                        id: '1',
                        title: 'Add feature',
                        description: 'New feature',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'test.md',
                        category: 'enhancement'
                    }],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.8,
                    ambiguousItems: ['unclear item', 'another unclear item'],
                    filteredItems: []
                }
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            // Base 0.8 + 0.1 (minor bump bonus) - 0.1 (2 ambiguous items * 0.05) = 0.8
            expect(result.confidence).toBeLessThan(0.85);
            expect(result.confidence).toBeGreaterThan(0.75);
        });
    });
    describe('validateSemanticVersioning', () => {
        it('should validate correct version progression', () => {
            const recommendation = {
                currentVersion: '1.2.3',
                recommendedVersion: '2.0.0',
                bumpType: 'major',
                rationale: 'Breaking changes',
                confidence: 0.9,
                evidence: [{
                        type: 'breaking',
                        description: 'Breaking change',
                        source: 'test.md',
                        impact: 'high'
                    }]
            };
            const result = calculator.validateSemanticVersioning(recommendation);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect invalid version format', () => {
            const recommendation = {
                currentVersion: 'invalid',
                recommendedVersion: '2.0.0',
                bumpType: 'major',
                rationale: 'Breaking changes',
                confidence: 0.9,
                evidence: []
            };
            const result = calculator.validateSemanticVersioning(recommendation);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Current version "invalid" is not a valid semantic version');
        });
        it('should detect invalid version progression', () => {
            const recommendation = {
                currentVersion: '1.2.3',
                recommendedVersion: '1.2.5', // Should be 1.2.4 for patch
                bumpType: 'patch',
                rationale: 'Bug fixes',
                confidence: 0.9,
                evidence: []
            };
            const result = calculator.validateSemanticVersioning(recommendation);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Version progression from 1.2.3 to 1.2.5 is invalid for patch bump');
        });
        it('should warn about low confidence', () => {
            const recommendation = {
                currentVersion: '1.2.3',
                recommendedVersion: '1.3.0',
                bumpType: 'minor',
                rationale: 'New features',
                confidence: 0.6, // Low confidence
                evidence: []
            };
            const result = calculator.validateSemanticVersioning(recommendation);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('Low confidence score (0.60) - manual review recommended');
        });
    });
    describe('generateVersionRationale', () => {
        it('should generate rationale for breaking changes', () => {
            const changes = {
                breakingChanges: [
                    {
                        id: '1',
                        title: 'Remove old API',
                        description: 'Removed deprecated method',
                        affectedAPIs: ['old.method'],
                        source: 'test.md',
                        severity: 'high'
                    },
                    {
                        id: '2',
                        title: 'Change interface',
                        description: 'Modified interface signature',
                        affectedAPIs: ['interface.method'],
                        source: 'test.md',
                        severity: 'medium'
                    }
                ],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const rationale = calculator.generateVersionRationale(changes);
            expect(rationale).toContain('Major version bump required due to 2 breaking change(s)');
            expect(rationale).toContain('Remove old API (high severity)');
            expect(rationale).toContain('Change interface (medium severity)');
        });
        it('should limit rationale items for readability', () => {
            const changes = {
                breakingChanges: Array.from({ length: 5 }, (_, i) => ({
                    id: `${i + 1}`,
                    title: `Breaking change ${i + 1}`,
                    description: `Description ${i + 1}`,
                    affectedAPIs: [`api${i + 1}`],
                    source: 'test.md',
                    severity: 'medium'
                })),
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const rationale = calculator.generateVersionRationale(changes);
            expect(rationale).toContain('Major version bump required due to 5 breaking change(s)');
            expect(rationale).toContain('... and 2 more breaking changes');
        });
    });
    describe('handlePreReleaseVersions', () => {
        it('should increment pre-release version', () => {
            const result = calculator.handlePreReleaseVersions('1.2.3-alpha.1', 'patch');
            expect(result).toBe('1.2.3-alpha.2');
        });
        it('should handle pre-release without number', () => {
            const result = calculator.handlePreReleaseVersions('1.2.3-beta', 'patch');
            expect(result).toBe('1.2.3-beta.1');
        });
        it('should handle rc pre-release', () => {
            const result = calculator.handlePreReleaseVersions('1.2.3-rc.2', 'patch');
            expect(result).toBe('1.2.3-rc.3');
        });
        it('should calculate normal version for non-pre-release', () => {
            const result = calculator.handlePreReleaseVersions('1.2.3', 'minor');
            expect(result).toBe('1.3.0');
        });
    });
    describe('edge cases', () => {
        it('should handle empty changes', () => {
            const changes = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0,
                    extractionConfidence: 1,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3');
            expect(result.bumpType).toBe('none');
            expect(result.recommendedVersion).toBe('1.2.3');
        });
        it('should handle invalid version format gracefully', () => {
            expect(() => {
                calculator.calculateVersionBump({}, 'invalid-version');
            }).toThrow('Invalid semantic version: invalid-version');
        });
        it('should handle version with build metadata', () => {
            const changes = {
                breakingChanges: [],
                newFeatures: [{
                        id: '1',
                        title: 'New feature',
                        description: 'Added feature',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'test.md',
                        category: 'enhancement'
                    }],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const result = calculator.calculateVersionBump(changes, '1.2.3+build.123');
            expect(result.bumpType).toBe('minor');
            expect(result.recommendedVersion).toBe('1.3.0');
        });
    });
});
//# sourceMappingURL=VersionCalculator.test.js.map