"use strict";
/**
 * Tests for ReleaseNoteGenerator
 *
 * Validates release note generation functionality including markdown formatting,
 * structured sections, breaking change highlighting, and template customization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ReleaseNoteGenerator_1 = require("../ReleaseNoteGenerator");
describe('ReleaseNoteGenerator', () => {
    let generator;
    let mockChanges;
    beforeEach(() => {
        generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
        mockChanges = {
            breakingChanges: [
                {
                    id: 'break-1',
                    title: 'Token System Refactor',
                    description: 'Mathematical token validation now requires explicit baseline grid alignment',
                    affectedAPIs: ['TokenValidator', 'BaselineGridValidator'],
                    migrationGuidance: 'Update validation calls to include baseline grid context',
                    source: 'task-1-completion.md',
                    severity: 'high'
                }
            ],
            newFeatures: [
                {
                    id: 'feat-1',
                    title: 'Cross-Platform Token Generation',
                    description: 'Generate platform-specific token files from unitless base values',
                    benefits: ['Consistent design tokens across web, iOS, and Android'],
                    requirements: ['Mathematical token foundation'],
                    artifacts: ['TokenGenerator.ts', 'PlatformAdapters.ts'],
                    source: 'task-2-completion.md',
                    category: 'Core System'
                },
                {
                    id: 'feat-2',
                    title: 'Strategic Flexibility Tracking',
                    description: 'Monitor usage patterns of strategic flexibility tokens',
                    benefits: ['Data-driven decisions on token system evolution'],
                    requirements: ['Usage analytics'],
                    artifacts: ['FlexibilityTracker.ts'],
                    source: 'task-3-completion.md',
                    category: 'Analytics'
                }
            ],
            bugFixes: [
                {
                    id: 'fix-1',
                    title: 'Baseline Grid Validation Edge Cases',
                    description: 'Fixed validation errors for edge cases in baseline grid alignment',
                    issueNumber: '123',
                    affectedComponents: ['BaselineGridValidator', 'ToleranceCalculator'],
                    source: 'task-4-completion.md',
                    severity: 'medium'
                }
            ],
            improvements: [
                {
                    id: 'imp-1',
                    title: 'Performance Optimization',
                    description: 'Improved token generation performance for large token sets',
                    type: 'performance',
                    impact: 'medium',
                    source: 'task-5-completion.md'
                }
            ],
            documentation: [
                {
                    id: 'doc-1',
                    title: 'API Documentation Update',
                    description: 'Updated API documentation with new token validation examples',
                    type: 'api-docs',
                    source: 'task-6-completion.md'
                }
            ],
            metadata: {
                documentsAnalyzed: 6,
                extractionConfidence: 0.95,
                ambiguousItems: [],
                filteredItems: []
            }
        };
    });
    describe('generateReleaseNotes', () => {
        it('should generate complete release notes with default template', async () => {
            const releaseNotes = await generator.generateReleaseNotes(mockChanges, '1.2.0');
            expect(releaseNotes).toContain('# 1.2.0');
            expect(releaseNotes).toContain('*Released:');
            expect(releaseNotes).toContain('This release includes 1 breaking change, 2 new features, 1 bug fix, 1 improvement.');
            expect(releaseNotes).toContain('## 🚨 Breaking Changes');
            expect(releaseNotes).toContain('## ✨ New Features');
            expect(releaseNotes).toContain('## 🐛 Bug Fixes');
            expect(releaseNotes).toContain('## ⚡ Improvements');
            expect(releaseNotes).not.toContain('## 📚 Documentation'); // Disabled by default
        });
        it('should apply custom template correctly', async () => {
            const customTemplate = {
                format: 'markdown',
                sections: [
                    { type: 'breaking', title: '⚠️ Breaking Changes', enabled: true, priority: 1, includeSource: true },
                    { type: 'features', title: '🎉 New Features', enabled: true, priority: 2, includeSource: false }
                ],
                styling: {
                    headerLevel: 3,
                    bulletStyle: '*',
                    includeMetadata: true,
                    includeSummary: false
                }
            };
            const releaseNotes = await generator.generateReleaseNotes(mockChanges, '1.2.0', customTemplate);
            expect(releaseNotes).toContain('## 1.2.0');
            expect(releaseNotes).toContain('### ⚠️ Breaking Changes');
            expect(releaseNotes).toContain('### 🎉 New Features');
            expect(releaseNotes).not.toContain('This release includes'); // Summary disabled
            expect(releaseNotes).toContain('### Metadata');
            expect(releaseNotes).toContain('* **Generated:**');
            expect(releaseNotes).toContain('* **Total Changes:**');
        });
        it('should handle empty changes gracefully', async () => {
            const emptyChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0,
                    extractionConfidence: 1.0,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const releaseNotes = await generator.generateReleaseNotes(emptyChanges, '1.0.1');
            expect(releaseNotes).toContain('# 1.0.1');
            expect(releaseNotes).toContain('No significant changes in this release.');
            expect(releaseNotes).not.toContain('## 🚨 Breaking Changes');
            expect(releaseNotes).not.toContain('## ✨ New Features');
        });
    });
    describe('formatBreakingChanges', () => {
        it('should format breaking changes with all details', () => {
            const formatted = generator.formatBreakingChanges(mockChanges.breakingChanges);
            expect(formatted).toContain('**Token System Refactor**');
            expect(formatted).toContain('Mathematical token validation now requires explicit baseline grid alignment');
            expect(formatted).toContain('**Affected APIs:** TokenValidator, BaselineGridValidator');
            expect(formatted).toContain('**Migration:** Update validation calls to include baseline grid context');
            expect(formatted).toContain('**Severity:** HIGH');
        });
        it('should handle breaking changes without optional fields', () => {
            const minimalBreakingChange = {
                id: 'break-minimal',
                title: 'Simple Breaking Change',
                description: 'A basic breaking change',
                affectedAPIs: [],
                source: 'test.md',
                severity: 'low'
            };
            const formatted = generator.formatBreakingChanges([minimalBreakingChange]);
            expect(formatted).toContain('**Simple Breaking Change**');
            expect(formatted).toContain('A basic breaking change');
            expect(formatted).not.toContain('**Affected APIs:**');
            expect(formatted).not.toContain('**Migration:**');
            expect(formatted).not.toContain('**Severity:**'); // Low severity not shown
        });
        it('should return empty string for no breaking changes', () => {
            const formatted = generator.formatBreakingChanges([]);
            expect(formatted).toBe('');
        });
    });
    describe('formatNewFeatures', () => {
        it('should format features with benefits and category', () => {
            const formatted = generator.formatNewFeatures(mockChanges.newFeatures);
            expect(formatted).toContain('**Cross-Platform Token Generation**');
            expect(formatted).toContain('Generate platform-specific token files from unitless base values');
            expect(formatted).toContain('**Benefits:** Consistent design tokens across web, iOS, and Android');
            expect(formatted).toContain('**Category:** Core System');
            expect(formatted).toContain('**Strategic Flexibility Tracking**');
            expect(formatted).toContain('**Category:** Analytics');
        });
        it('should handle features without optional fields', () => {
            const minimalFeature = {
                id: 'feat-minimal',
                title: 'Simple Feature',
                description: 'A basic feature',
                benefits: [],
                requirements: [],
                artifacts: [],
                source: 'test.md',
                category: ''
            };
            const formatted = generator.formatNewFeatures([minimalFeature]);
            expect(formatted).toContain('**Simple Feature**');
            expect(formatted).toContain('A basic feature');
            expect(formatted).not.toContain('**Benefits:**');
            expect(formatted).not.toContain('**Category:**');
        });
        it('should return empty string for no features', () => {
            const formatted = generator.formatNewFeatures([]);
            expect(formatted).toBe('');
        });
    });
    describe('formatBugFixes', () => {
        it('should format bug fixes with issue numbers and components', () => {
            const formatted = generator.formatBugFixes(mockChanges.bugFixes);
            expect(formatted).toContain('**Baseline Grid Validation Edge Cases**');
            expect(formatted).toContain('Fixed validation errors for edge cases in baseline grid alignment');
            expect(formatted).toContain('**Issue:** #123');
            expect(formatted).toContain('**Components:** BaselineGridValidator, ToleranceCalculator');
        });
        it('should handle bug fixes without optional fields', () => {
            const minimalBugFix = {
                id: 'fix-minimal',
                title: 'Simple Fix',
                description: 'A basic bug fix',
                affectedComponents: [],
                source: 'test.md',
                severity: 'low'
            };
            const formatted = generator.formatBugFixes([minimalBugFix]);
            expect(formatted).toContain('**Simple Fix**');
            expect(formatted).toContain('A basic bug fix');
            expect(formatted).not.toContain('**Issue:**');
            expect(formatted).not.toContain('**Components:**');
        });
        it('should return empty string for no bug fixes', () => {
            const formatted = generator.formatBugFixes([]);
            expect(formatted).toBe('');
        });
    });
    describe('formatImprovements', () => {
        it('should format improvements with type and impact', () => {
            const formatted = generator.formatImprovements(mockChanges.improvements);
            expect(formatted).toContain('**Performance Optimization**');
            expect(formatted).toContain('Improved token generation performance for large token sets');
            expect(formatted).toContain('**Type:** performance');
            expect(formatted).toContain('**Impact:** medium');
        });
        it('should handle improvements without optional fields', () => {
            const minimalImprovement = {
                id: 'imp-minimal',
                title: 'Simple Improvement',
                description: 'A basic improvement',
                type: 'other',
                impact: 'low',
                source: 'test.md'
            };
            const formatted = generator.formatImprovements([minimalImprovement]);
            expect(formatted).toContain('**Simple Improvement**');
            expect(formatted).toContain('A basic improvement');
            expect(formatted).toContain('**Type:** other');
            expect(formatted).not.toContain('**Impact:**'); // Low impact not shown
        });
        it('should return empty string for no improvements', () => {
            const formatted = generator.formatImprovements([]);
            expect(formatted).toBe('');
        });
    });
    describe('formatDocumentationChanges', () => {
        it('should format documentation changes with type', () => {
            const formatted = generator.formatDocumentationChanges(mockChanges.documentation);
            expect(formatted).toContain('**API Documentation Update**');
            expect(formatted).toContain('Updated API documentation with new token validation examples');
            expect(formatted).toContain('**Type:** api-docs');
        });
        it('should return empty string for no documentation changes', () => {
            const formatted = generator.formatDocumentationChanges([]);
            expect(formatted).toBe('');
        });
    });
    describe('applyTemplate', () => {
        it('should apply template with correct header levels', () => {
            const content = {
                version: '1.0.0',
                date: '2025-10-20',
                summary: 'Test summary',
                sections: [
                    {
                        title: 'Breaking Changes',
                        priority: 1,
                        items: [
                            { title: 'Test Change', description: 'Test description' }
                        ]
                    }
                ]
            };
            const template = {
                format: 'markdown',
                sections: [
                    { type: 'breaking', title: 'Breaking Changes', enabled: true, priority: 1, includeSource: false }
                ],
                styling: {
                    headerLevel: 3,
                    bulletStyle: '*',
                    includeMetadata: false,
                    includeSummary: true
                }
            };
            const result = generator.applyTemplate(content, template);
            expect(result).toContain('## 1.0.0');
            expect(result).toContain('### Breaking Changes');
            expect(result).toContain('* **Test Change**');
            expect(result).toContain('Test summary');
        });
        it('should respect section priority ordering', () => {
            const content = {
                version: '1.0.0',
                date: '2025-10-20',
                summary: '',
                sections: [
                    { title: 'New Features', priority: 2, items: [{ title: 'Feature', description: '' }] },
                    { title: 'Breaking Changes', priority: 1, items: [{ title: 'Breaking', description: '' }] }
                ]
            };
            const template = {
                format: 'markdown',
                sections: [
                    { type: 'features', title: 'New Features', enabled: true, priority: 2, includeSource: false },
                    { type: 'breaking', title: 'Breaking Changes', enabled: true, priority: 1, includeSource: false }
                ],
                styling: {
                    headerLevel: 2,
                    bulletStyle: '-',
                    includeMetadata: false,
                    includeSummary: false
                }
            };
            const result = generator.applyTemplate(content, template);
            const breakingIndex = result.indexOf('## Breaking Changes');
            const featuresIndex = result.indexOf('## New Features');
            expect(breakingIndex).toBeLessThan(featuresIndex);
        });
        it('should include source information when configured', () => {
            const content = {
                version: '1.0.0',
                date: '2025-10-20',
                summary: '',
                sections: [
                    {
                        title: 'Breaking Changes',
                        priority: 1,
                        items: [
                            { title: 'Test Change', description: 'Test description', source: 'test-file.md' }
                        ]
                    }
                ]
            };
            const template = {
                format: 'markdown',
                sections: [
                    { type: 'breaking', title: 'Breaking Changes', enabled: true, priority: 1, includeSource: true }
                ],
                styling: {
                    headerLevel: 2,
                    bulletStyle: '-',
                    includeMetadata: false,
                    includeSummary: false
                }
            };
            const result = generator.applyTemplate(content, template);
            expect(result).toContain('**Source:** test-file.md');
        });
    });
    describe('summary generation', () => {
        it('should generate accurate summary for multiple change types', async () => {
            const releaseNotes = await generator.generateReleaseNotes(mockChanges, '1.2.0');
            expect(releaseNotes).toContain('This release includes 1 breaking change, 2 new features, 1 bug fix, 1 improvement.');
        });
        it('should handle singular vs plural correctly', async () => {
            const singleChanges = {
                ...mockChanges,
                breakingChanges: [mockChanges.breakingChanges[0]],
                newFeatures: [mockChanges.newFeatures[0]],
                bugFixes: [mockChanges.bugFixes[0]],
                improvements: [mockChanges.improvements[0]]
            };
            const releaseNotes = await generator.generateReleaseNotes(singleChanges, '1.0.1');
            expect(releaseNotes).toContain('This release includes 1 breaking change, 1 new feature, 1 bug fix, 1 improvement.');
        });
        it('should generate appropriate summary for no changes', async () => {
            const emptyChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 0,
                    extractionConfidence: 1.0,
                    ambiguousItems: [],
                    filteredItems: []
                }
            };
            const releaseNotes = await generator.generateReleaseNotes(emptyChanges, '1.0.1');
            expect(releaseNotes).toContain('No significant changes in this release.');
        });
    });
});
//# sourceMappingURL=ReleaseNoteGenerator.test.js.map