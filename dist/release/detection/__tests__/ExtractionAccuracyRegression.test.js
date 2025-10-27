"use strict";
/**
 * Regression Tests for Extraction Logic Improvements
 *
 * These tests validate the specific extraction logic fixes implemented in Task 2.5:
 * - Prioritized extraction strategy eliminates dual extraction
 * - Semantic deduplication reduces false positives
 * - Documentation filtering prevents doc fixes from triggering releases
 * - Improved section parsing prevents header contamination and content bleeding
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CompletionAnalyzer_1 = require("../CompletionAnalyzer");
const ReleaseConfig_1 = require("../../config/ReleaseConfig");
// Mock fs module
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        readdir: jest.fn(),
        stat: jest.fn(),
        access: jest.fn()
    }
}));
const mockFs = fs_1.promises;
describe('Extraction Accuracy Regression Tests', () => {
    let analyzer;
    let config;
    beforeEach(() => {
        config = ReleaseConfig_1.DEFAULT_RELEASE_CONFIG.detection;
        analyzer = new CompletionAnalyzer_1.CompletionAnalyzer(config);
        jest.clearAllMocks();
    });
    describe('Prioritized Extraction Strategy', () => {
        it('should eliminate dual extraction duplication', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Breaking Changes
- Removed deprecated API method

## Summary
This task removed deprecated API method and updated documentation.
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should only extract from structured section, not duplicate from summary
            expect(analysis.breakingChanges).toHaveLength(1);
            expect(analysis.breakingChanges[0].title).toContain('deprecated API method');
        });
        it('should prioritize structured sections over pattern matching', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## New Features
- Advanced validation system
- Error reporting framework

## Summary
We implemented new validation and created error reporting.
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should extract 2 features from structured section, not additional ones from summary
            expect(analysis.newFeatures).toHaveLength(2);
            expect(analysis.newFeatures[0].title).toContain('Advanced validation system');
            expect(analysis.newFeatures[1].title).toContain('Error reporting framework');
        });
    });
    describe('Semantic Deduplication', () => {
        it('should reduce false positives through semantic deduplication', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Bug Fixes
- Fixed memory leak in parser
- Resolved memory leak issue in token parser
- Corrected parser memory management
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should deduplicate semantically similar bug fixes
            // All three items refer to the same memory leak fix
            expect(analysis.bugFixes.length).toBeLessThan(3);
            expect(analysis.bugFixes.length).toBeGreaterThan(0);
        });
        it('should preserve genuinely different items', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Bug Fixes
- Fixed memory leak in parser
- Resolved validation error handling
- Corrected configuration loading
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should preserve all three genuinely different bug fixes
            expect(analysis.bugFixes).toHaveLength(3);
        });
    });
    describe('Documentation Filtering', () => {
        it('should prevent documentation fixes from triggering releases', async () => {
            const documentContent = `
# Task Completion

## Documentation Updates
- Fixed typos in README
- Updated API documentation
- Corrected code examples

## Summary
Updated documentation with fixes and improvements.
`;
            mockFs.readFile.mockResolvedValue(documentContent);
            const taskAnalysis = await analyzer.parseTaskCompletionDocument('test-completion.md');
            // Documentation-only changes should not trigger patch releases
            expect(taskAnalysis.needsPatchRelease).toBe(false);
            expect(taskAnalysis.analysis.bugFixes).toHaveLength(0);
            expect(taskAnalysis.analysis.newFeatures).toHaveLength(0);
        });
        it('should still detect code fixes alongside documentation', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Bug Fixes
- Fixed validation logic error

## Documentation Updates
- Updated API documentation
- Fixed typos in README

## Summary
Fixed validation bug and updated documentation.
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should detect the code fix but not treat documentation as bug fixes
            expect(analysis.bugFixes).toHaveLength(1);
            expect(analysis.bugFixes[0].title).toContain('validation logic error');
        });
    });
    describe('Improved Section Parsing', () => {
        it('should prevent header contamination', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Breaking Changes
- Removed deprecated method

## New Features  
- Advanced validation system

## Summary
Completed implementation successfully.
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Headers should not contaminate content
            expect(analysis.breakingChanges[0].title).not.toContain('## Breaking Changes');
            expect(analysis.newFeatures[0].title).not.toContain('## New Features');
            // Content should be clean
            expect(analysis.breakingChanges[0].title).toContain('deprecated method');
            expect(analysis.newFeatures[0].title).toContain('Advanced validation system');
        });
        it('should prevent content bleeding between sections', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Breaking Changes
- Removed old API

## Bug Fixes
- Fixed parser error
- Resolved validation issue

## New Features
- Added new validation engine
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Each section should contain only its own content
            expect(analysis.breakingChanges).toHaveLength(1);
            expect(analysis.breakingChanges[0].title).toContain('old API');
            expect(analysis.breakingChanges[0].title).not.toContain('parser error');
            expect(analysis.breakingChanges[0].title).not.toContain('validation engine');
            expect(analysis.bugFixes).toHaveLength(2);
            expect(analysis.bugFixes.some(bf => bf.title.includes('parser error'))).toBe(true);
            expect(analysis.bugFixes.some(bf => bf.title.includes('validation issue'))).toBe(true);
            expect(analysis.newFeatures).toHaveLength(1);
            expect(analysis.newFeatures[0].title).toContain('validation engine');
        });
        it('should handle malformed section boundaries gracefully', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Breaking Changes
- Removed old API
Some additional text without proper formatting

## Bug Fixes
- Fixed parser error

Random text between sections

## New Features
- Added validation engine
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Should still extract properly formatted items
            expect(analysis.breakingChanges).toHaveLength(1);
            expect(analysis.bugFixes).toHaveLength(1);
            expect(analysis.newFeatures).toHaveLength(1);
            // Should not include malformed content
            expect(analysis.breakingChanges[0].title).not.toContain('Some additional text');
            expect(analysis.bugFixes[0].title).not.toContain('Random text');
        });
    });
    describe('Context Building Improvements', () => {
        it('should reduce malformed descriptions from context bleeding', async () => {
            const document = {
                path: 'test-completion.md',
                content: `
# Task Completion

## Breaking Changes
- Removed deprecated validateOld() method
- Changed ValidationOptions interface to require strict parameter

## Implementation Details
The validateOld method was causing performance issues.
The ValidationOptions change improves type safety.

## Migration Guide
Update your code to use the new validation method.
`,
                metadata: { title: 'Test Completion' }
            };
            const analysis = await analyzer.analyzeDocument(document, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Descriptions should be clean and not include context from other sections
            expect(analysis.breakingChanges).toHaveLength(2);
            const validateOldChange = analysis.breakingChanges.find(bc => bc.title.includes('validateOld'));
            expect(validateOldChange).toBeDefined();
            expect(validateOldChange.description).not.toContain('Migration Guide');
            expect(validateOldChange.description).not.toContain('Implementation Details');
            const validationOptionsChange = analysis.breakingChanges.find(bc => bc.title.includes('ValidationOptions'));
            expect(validationOptionsChange).toBeDefined();
            expect(validationOptionsChange.description).not.toContain('validateOld method');
        });
    });
    describe('Confidence Scoring Improvements', () => {
        it('should provide accurate confidence scores with improved extraction', async () => {
            const wellStructuredDocument = {
                path: 'test-completion.md',
                content: `
# Task Completion

**Date**: 2025-01-10
**Task**: 1.1 Test task
**Status**: Complete

## Summary
Well-structured completion with clear sections.

## Breaking Changes
- Removed deprecated API

## New Features
- Added validation engine

## Implementation Approach
Used systematic approach with proper testing.

## Artifacts Created
- src/validator.ts
- src/engine.ts
`,
                metadata: {
                    title: 'Task Completion',
                    date: '2025-01-10',
                    task: '1.1 Test task',
                    status: 'Complete'
                }
            };
            const analysis = await analyzer.analyzeDocument(wellStructuredDocument, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Well-structured document with clear sections should have high confidence
            expect(analysis.confidence).toBeGreaterThan(0.8);
        });
        it('should provide lower confidence for poorly structured documents', async () => {
            const poorlyStructuredDocument = {
                path: 'test-completion.md',
                content: `
# Completion

Did some work on the system.
`,
                metadata: { title: 'Completion' }
            };
            const analysis = await analyzer.analyzeDocument(poorlyStructuredDocument, {
                specName: 'test',
                completionType: 'task',
                documentPaths: ['test-completion.md']
            });
            // Poorly structured document should have lower confidence
            expect(analysis.confidence).toBeLessThan(0.7);
        });
    });
});
//# sourceMappingURL=ExtractionAccuracyRegression.test.js.map