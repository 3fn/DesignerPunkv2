"use strict";
/**
 * Edge Case Tests for Release Analysis System
 *
 * Tests for unusual scenarios, boundary conditions, and error cases
 * that might not be covered in regular unit tests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleChangeExtractor_1 = require("../extraction/SimpleChangeExtractor");
const VersionCalculator_1 = require("../versioning/VersionCalculator");
const ReleaseNoteGenerator_1 = require("../notes/ReleaseNoteGenerator");
const AnalysisConfig_1 = require("../config/AnalysisConfig");
describe('Release Analysis Edge Cases', () => {
    let extractor;
    let calculator;
    let generator;
    beforeEach(() => {
        extractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction);
        calculator = new VersionCalculator_1.VersionCalculator();
        generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    });
    describe('Document Content Edge Cases', () => {
        it('should handle documents with only whitespace', async () => {
            const document = {
                path: 'whitespace.md',
                content: '   \n\n\t\t   \n   ',
                lastModified: new Date(),
                gitCommit: 'whitespace123',
                metadata: {
                    title: 'Whitespace Document',
                    type: 'task-completion'
                }
            };
            const result = await extractor.parseCompletionDocument(document);
            expect(result.breakingChanges).toHaveLength(0);
            expect(result.newFeatures).toHaveLength(0);
            expect(result.bugFixes).toHaveLength(0);
            expect(result.improvements).toHaveLength(0);
            expect(result.confidence).toBeLessThanOrEqual(0.5);
        });
        it('should handle documents with special characters and unicode', async () => {
            const document = {
                path: 'unicode.md',
                content: `# Tâsk Cømpletion 🚀

## Breaking Changes 💥
- Removed deprecated API méthod with émojis 🔥
- Changed interfâce for Tøken Validatør 

## New Features ✨
- Added mathematical tøken validation with ∑ symbols
- Implemented cross-platform generation with → arrows

## Bug Fixes 🐛
- Fixed baseline grid alignment issue #123 ✅
- Corrected spacing calculation errors with ± tolerance
`,
                lastModified: new Date(),
                gitCommit: 'unicode123',
                metadata: {
                    title: 'Unicode Test',
                    type: 'task-completion'
                }
            };
            const result = await extractor.parseCompletionDocument(document);
            expect(result.breakingChanges).toHaveLength(2);
            expect(result.newFeatures).toHaveLength(2);
            expect(result.bugFixes).toHaveLength(2);
            expect(result.confidence).toBeGreaterThan(0.5);
        });
        it('should handle documents with malformed markdown', async () => {
            const document = {
                path: 'malformed.md',
                content: `# Incomplete Header
## Breaking Changes
- Missing closing bracket [
- Unmatched **bold text
### Nested header without parent
* Mixed list styles
1. Numbered
- Bullet
## New Features
[Link without URL]()
![Image without src]()
\`\`\`
Code block without closing
`,
                lastModified: new Date(),
                gitCommit: 'malformed123',
                metadata: {
                    title: 'Malformed Markdown',
                    type: 'task-completion'
                }
            };
            const result = await extractor.parseCompletionDocument(document);
            // Should still extract some information despite malformed markdown
            expect(result.breakingChanges.length + result.newFeatures.length).toBeGreaterThan(0);
            expect(result.confidence).toBeGreaterThan(0);
        });
        it('should handle extremely long documents', async () => {
            const longContent = Array.from({ length: 1000 }, (_, i) => `- Change item ${i}: This is a very long description that goes on and on with lots of details about what changed in this particular item number ${i}.`).join('\n');
            const document = {
                path: 'long.md',
                content: `# Long Document\n\n## New Features\n\n${longContent}`,
                lastModified: new Date(),
                gitCommit: 'long123',
                metadata: {
                    title: 'Long Document',
                    type: 'task-completion'
                }
            };
            const startTime = Date.now();
            const result = await extractor.parseCompletionDocument(document);
            const endTime = Date.now();
            expect(result.newFeatures.length).toBeGreaterThan(0);
            expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
        });
    });
    describe('Version Calculation Edge Cases', () => {
        it('should handle version overflow scenarios', () => {
            const changes = {
                breakingChanges: [{
                        id: '1',
                        title: 'Breaking change',
                        description: 'Major change',
                        affectedAPIs: [],
                        source: 'test.md',
                        severity: 'high'
                    }],
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
            // Test very high version numbers
            const result = calculator.calculateVersionBump(changes, '999.999.999');
            expect(result.recommendedVersion).toBe('1000.0.0');
        });
        it('should handle zero versions', () => {
            const changes = {
                breakingChanges: [],
                newFeatures: [{
                        id: '1',
                        title: 'First feature',
                        description: 'Initial feature',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'test.md',
                        category: 'initial'
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
            const result = calculator.calculateVersionBump(changes, '0.0.0');
            expect(result.recommendedVersion).toBe('0.1.0');
        });
        it('should handle complex pre-release versions', () => {
            const changes = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [{
                        id: '1',
                        title: 'Bug fix',
                        description: 'Fixed issue',
                        affectedComponents: [],
                        source: 'test.md',
                        severity: 'low'
                    }],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            // Test various pre-release formats
            expect(calculator.handlePreReleaseVersions('1.0.0-alpha', 'patch')).toBe('1.0.0-alpha.1');
            expect(calculator.handlePreReleaseVersions('1.0.0-beta.5', 'patch')).toBe('1.0.0-beta.6');
            expect(calculator.handlePreReleaseVersions('1.0.0-rc.1', 'patch')).toBe('1.0.0-rc.2');
            expect(calculator.handlePreReleaseVersions('1.0.0-alpha.1.2', 'patch')).toBe('1.0.1');
        });
        it('should handle conflicting change types', () => {
            const conflictingChanges = {
                breakingChanges: [{
                        id: '1',
                        title: 'Breaking change',
                        description: 'Major change',
                        affectedAPIs: [],
                        source: 'test.md',
                        severity: 'low' // Low severity breaking change
                    }],
                newFeatures: [{
                        id: '2',
                        title: 'Critical feature',
                        description: 'Very important feature',
                        benefits: ['Critical improvement'],
                        requirements: [],
                        artifacts: [],
                        source: 'test.md',
                        category: 'critical'
                    }],
                bugFixes: [{
                        id: '3',
                        title: 'Critical bug fix',
                        description: 'Fixed critical issue',
                        affectedComponents: [],
                        source: 'test.md',
                        severity: 'critical'
                    }],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 3,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const result = calculator.calculateVersionBump(conflictingChanges, '1.0.0');
            // Breaking changes should always win
            expect(result.bumpType).toBe('major');
            expect(result.recommendedVersion).toBe('2.0.0');
            expect(result.evidence).toHaveLength(3);
        });
    });
    describe('Release Note Generation Edge Cases', () => {
        it('should handle changes with missing or null fields', async () => {
            const changesWithNulls = {
                breakingChanges: [{
                        id: '1',
                        title: 'Breaking change',
                        description: 'Change with missing fields',
                        affectedAPIs: [],
                        // migrationGuidance is undefined
                        source: 'test.md',
                        severity: 'medium'
                    }],
                newFeatures: [{
                        id: '2',
                        title: 'Feature with empty arrays',
                        description: 'Feature description',
                        benefits: [], // Empty array
                        requirements: [], // Empty array
                        artifacts: [], // Empty array
                        source: 'test.md',
                        category: '' // Empty string
                    }],
                bugFixes: [{
                        id: '3',
                        title: 'Bug fix without issue',
                        description: 'Bug fix description',
                        // issueNumber is undefined
                        affectedComponents: [],
                        source: 'test.md',
                        severity: 'low'
                    }],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 3,
                    extractionConfidence: 0.8,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const releaseNotes = await generator.generateReleaseNotes(changesWithNulls, '1.1.0');
            expect(releaseNotes).toContain('# 1.1.0');
            expect(releaseNotes).toContain('**Breaking change**');
            expect(releaseNotes).toContain('**Feature with empty arrays**');
            expect(releaseNotes).toContain('**Bug fix without issue**');
            expect(releaseNotes).not.toContain('**Migration:**'); // Should not show empty migration
            expect(releaseNotes).not.toContain('**Benefits:**'); // Should not show empty benefits
            expect(releaseNotes).not.toContain('**Issue:**'); // Should not show empty issue
        });
        it('should handle extremely long change descriptions', async () => {
            const longDescription = 'This is an extremely long description that goes on and on with lots of details about what changed and why it changed and how it affects users and what they need to do about it and more information that keeps going and going until it becomes very long indeed. '.repeat(10);
            const changesWithLongDescriptions = {
                breakingChanges: [{
                        id: '1',
                        title: 'Breaking change with long description',
                        description: longDescription,
                        affectedAPIs: ['api1', 'api2', 'api3', 'api4', 'api5'],
                        migrationGuidance: longDescription,
                        source: 'test.md',
                        severity: 'high'
                    }],
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
            const releaseNotes = await generator.generateReleaseNotes(changesWithLongDescriptions, '2.0.0');
            expect(releaseNotes).toContain('# 2.0.0');
            expect(releaseNotes).toContain('**Breaking change with long description**');
            expect(releaseNotes.length).toBeGreaterThan(1000); // Should include the long content
        });
        it('should handle special characters in change titles and descriptions', async () => {
            const changesWithSpecialChars = {
                breakingChanges: [{
                        id: '1',
                        title: 'Breaking: Remove `deprecated()` method & update <Interface>',
                        description: 'Removed method with special chars: @deprecated, #hash, $variable, %percent, ^caret, &ampersand, *asterisk, ()parentheses, []brackets, {}braces, |pipe, \\backslash, /slash, ?question, !exclamation, ~tilde, `backtick`, "quotes", \'apostrophe\'',
                        affectedAPIs: ['method()', 'Interface<T>', 'Class.property'],
                        source: 'test.md',
                        severity: 'high'
                    }],
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
            const releaseNotes = await generator.generateReleaseNotes(changesWithSpecialChars, '2.0.0');
            expect(releaseNotes).toContain('# 2.0.0');
            expect(releaseNotes).toContain('Breaking: Remove `deprecated()` method');
            expect(releaseNotes).toContain('special chars:');
        });
    });
    describe('Deduplication Edge Cases', () => {
        it('should handle near-duplicate changes with slight variations', async () => {
            const changesWithDuplicates = {
                breakingChanges: [],
                newFeatures: [
                    {
                        id: '1',
                        title: 'Add user authentication system',
                        description: 'Added user authentication system with login and logout',
                        benefits: ['Security'],
                        requirements: [],
                        artifacts: [],
                        source: 'task-1.md',
                        category: 'auth'
                    },
                    {
                        id: '2',
                        title: 'Add user authentication',
                        description: 'Added user authentication with login/logout functionality',
                        benefits: ['Better security'],
                        requirements: [],
                        artifacts: [],
                        source: 'task-2.md',
                        category: 'authentication'
                    },
                    {
                        id: '3',
                        title: 'Implement authentication system',
                        description: 'Implemented authentication system for users',
                        benefits: ['Improved security'],
                        requirements: [],
                        artifacts: [],
                        source: 'task-3.md',
                        category: 'security'
                    }
                ],
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
            const deduplicated = extractor.deduplicateChanges(changesWithDuplicates);
            // Should reduce the number of similar features
            expect(deduplicated.newFeatures.length).toBeLessThan(changesWithDuplicates.newFeatures.length);
            expect(deduplicated.newFeatures.length).toBeGreaterThan(0);
        });
        it('should preserve distinct changes that appear similar', async () => {
            const changesWithSimilarButDistinct = {
                breakingChanges: [],
                newFeatures: [
                    {
                        id: '1',
                        title: 'Add user authentication',
                        description: 'Added user authentication for web interface',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'web-auth.md',
                        category: 'web'
                    },
                    {
                        id: '2',
                        title: 'Add user authentication',
                        description: 'Added user authentication for mobile app',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'mobile-auth.md',
                        category: 'mobile'
                    },
                    {
                        id: '3',
                        title: 'Add user authentication',
                        description: 'Added user authentication for API endpoints',
                        benefits: [],
                        requirements: [],
                        artifacts: [],
                        source: 'api-auth.md',
                        category: 'api'
                    }
                ],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 3,
                    extractionConfidence: 0.9,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const deduplicated = extractor.deduplicateChanges(changesWithSimilarButDistinct);
            // Should preserve distinct implementations even with similar titles
            expect(deduplicated.newFeatures.length).toBeGreaterThan(0);
        });
    });
    describe('Confidence Calculation Edge Cases', () => {
        it('should handle confidence calculation with extreme values', () => {
            const extremeChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0, // No documents
                    extractionConfidence: 0, // Zero confidence
                    ambiguousItems: Array.from({ length: 100 }, (_, i) => `ambiguous-${i}`), // Many ambiguous items
                    filteredItems: Array.from({ length: 50 }, (_, i) => `filtered-${i}`) // Many filtered items
                }
            };
            const result = calculator.calculateVersionBump(extremeChanges, '1.0.0');
            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
            expect(result.bumpType).toBe('none');
        });
        it('should handle confidence calculation with perfect scores', () => {
            const perfectChanges = {
                breakingChanges: [],
                newFeatures: [{
                        id: '1',
                        title: 'Perfect feature',
                        description: 'Well-documented feature',
                        benefits: ['Clear benefit'],
                        requirements: ['Clear requirement'],
                        artifacts: ['PerfectFeature.ts'],
                        source: 'perfect.md',
                        category: 'perfect'
                    }],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 1.0, // Perfect confidence
                    ambiguousItems: [], // No ambiguous items
                    filteredItems: [] // No filtered items
                }
            };
            const result = calculator.calculateVersionBump(perfectChanges, '1.0.0');
            expect(result.confidence).toBeGreaterThan(0.9);
            expect(result.bumpType).toBe('minor');
        });
    });
});
//# sourceMappingURL=EdgeCases.test.js.map