/**
 * Unit Tests for Completion Document Analyzer
 * 
 * Tests completion document parsing accuracy, content extraction,
 * and analysis confidence calculations.
 * 
 * Mock Strategy:
 * - jest.mock('fs'): Mock file system operations for completion document reading
 * - No shared mocks: Each test creates fresh mocks with specific test data
 * - Focus on analysis logic: Tests validate content extraction and confidence scoring
 */

import { promises as fs } from 'fs';
import { CompletionAnalyzer } from '../CompletionAnalyzer';
import { DetectionConfig, DEFAULT_RELEASE_CONFIG } from '../../config/ReleaseConfig';
import {
  ReleaseAnalysis,
  BreakingChange,
  Feature,
  BugFix,
  Improvement
} from '../../types/ReleaseTypes';

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn()
  }
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('CompletionAnalyzer', () => {
  let analyzer: CompletionAnalyzer;
  let config: DetectionConfig;

  beforeEach(() => {
    config = DEFAULT_RELEASE_CONFIG.detection;
    analyzer = new CompletionAnalyzer(config);
    jest.clearAllMocks();
  });

  describe('Document Parsing', () => {
    it('should parse spec completion document correctly', async () => {
      const documentPath = '.kiro/specs/test-spec/completion/spec-completion-summary.md';
      const content = `
# Spec Completion Summary

**Date**: 2025-01-10
**Spec**: F1 - Test Specification
**Status**: Complete

## Overview
Successfully completed the test specification with all requirements met.

## Breaking Changes
- Removed deprecated \`validateOld()\` method from ValidationInterface
- Changed signature of \`validate()\` method to include options parameter

## New Features
- Implemented advanced token validation engine
- Added comprehensive error reporting system
- Created cross-platform compatibility layer

## Bug Fixes
- Fixed memory leak in token parser
- Resolved edge case in validation logic
- Corrected error message formatting

## Improvements
- Optimized validation performance by 40%
- Enhanced error messages with suggestions
- Refactored codebase for better maintainability

## Migration Guide
Users need to update their validation calls:
\`\`\`typescript
// Old
validator.validateOld(token);

// New
validator.validate(token, { strict: true });
\`\`\`
`;

      mockFs.readFile.mockResolvedValue(content);

      const analysis = await analyzer.parseSpecCompletionDocument(documentPath);

      expect(analysis.breakingChanges).toHaveLength(2);
      expect(analysis.newFeatures).toHaveLength(3);
      expect(analysis.bugFixes).toHaveLength(3);
      expect(analysis.improvements).toHaveLength(3);
      expect(analysis.suggestedVersionBump).toBe('major');
      expect(analysis.confidence).toBeGreaterThan(0.8);
    });

    it('should parse task completion document and determine patch necessity', async () => {
      const documentPath = '.kiro/specs/test-spec/completion/task-1-completion.md';
      const content = `
# Task 1.1 Completion

**Date**: 2025-01-10
**Task**: 1.1 Implement validation system
**Status**: Complete

## Summary
Implemented the core validation system with comprehensive error handling.

## Implementation Approach
- Created TypeScript interfaces for validation
- Implemented rule-based validation engine
- Added comprehensive error reporting

## Key Decisions
- Used factory pattern for validator creation
- Implemented caching for performance
- Added extensive logging for debugging

## Artifacts Created
- \`src/validation/ValidationEngine.ts\`
- \`src/validation/ValidationRules.ts\`
- \`src/validation/ErrorReporter.ts\`

## Testing
- Unit tests for all validation rules
- Integration tests for error handling
- Performance tests for large token sets
`;

      mockFs.readFile.mockResolvedValue(content);

      const result = await analyzer.parseTaskCompletionDocument(documentPath);

      expect(result.needsPatchRelease).toBe(true);
      expect(result.patchReleaseReason).toContain('implementation changes');
      expect(result.analysis.newFeatures).toHaveLength(0); // No explicit new features section
      expect(result.analysis.confidence).toBeGreaterThan(0.6);
    });

    it('should not require patch release for documentation-only tasks', async () => {
      const documentPath = '.kiro/specs/test-spec/completion/task-2-completion.md';
      const content = `
# Task 2.1 Completion

**Date**: 2025-01-10
**Task**: 2.1 Update documentation
**Status**: Complete

## Summary
Updated project documentation and examples.

## Documentation Updates
- Updated README.md with latest installation instructions
- Added comprehensive API documentation
- Created usage examples and tutorials
- Fixed typos and formatting issues

## Key Changes
- Reorganized documentation structure
- Added code examples for common use cases
- Updated screenshots and diagrams
`;

      mockFs.readFile.mockResolvedValue(content);

      const result = await analyzer.parseTaskCompletionDocument(documentPath);

      expect(result.needsPatchRelease).toBe(false);
      expect(result.analysis.confidence).toBeGreaterThan(0.6);
    });
  });

  describe('Breaking Change Detection', () => {
    it('should detect breaking changes by keywords', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Changes Made
- Removed the deprecated validateToken() method
- Breaking change: Updated TokenValidator interface signature
- Incompatible change to configuration format
- Migration required for existing users
`,
        metadata: { title: 'Test Document' }
      };

      const breakingChanges = await analyzer.extractBreakingChanges(document);

      expect(breakingChanges).toHaveLength(4);
      expect(breakingChanges[0].title).toContain('Removed the deprecated validateToken()');
      expect(breakingChanges[1].title).toContain('Breaking change: Updated TokenValidator');
      expect(breakingChanges[2].title).toContain('Incompatible change to configuration');
      expect(breakingChanges[3].title).toContain('Migration required for existing users');
    });

    it('should detect breaking changes by structure analysis', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Breaking Changes
- Removed \`TokenValidator.validateOld()\` method
- Changed \`ValidationOptions\` interface structure
- Updated configuration file format

## Migration Guide
Update your code as follows:
\`\`\`typescript
// Old
validator.validateOld(token);

// New  
validator.validate(token, options);
\`\`\`
`,
        metadata: { title: 'Test Document' }
      };

      const breakingChanges = await analyzer.detectBreakingChangesWithStructure(document);

      expect(breakingChanges.length).toBeGreaterThan(0);
      expect(breakingChanges.some(bc => bc.title.includes('validateOld'))).toBe(true);
      expect(breakingChanges.some(bc => bc.affectedAPIs.length > 0)).toBe(true);
    });

    it('should extract affected APIs from breaking changes', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## API Changes
- Removed interface TokenValidator
- Updated class ValidationEngine  
- Modified function validateToken
- Changed method parseConfiguration

The ValidationInterface now requires implementation of validate() method.
`,
        metadata: { title: 'Test Document' }
      };

      const breakingChanges = await analyzer.extractBreakingChanges(document);

      const hasAPIReferences = breakingChanges.some(bc => 
        bc.affectedAPIs.includes('TokenValidator') ||
        bc.affectedAPIs.includes('ValidationEngine') ||
        bc.affectedAPIs.includes('validateToken')
      );

      expect(hasAPIReferences).toBe(true);
    });
  });

  describe('Feature Extraction', () => {
    it('should extract features from structured sections', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## New Features
- Implemented advanced token validation with rule engine
- Added comprehensive error reporting system
- Created cross-platform compatibility layer

## Features Implemented
- Real-time validation feedback
- Batch validation processing
- Custom validation rule support
`,
        metadata: { title: 'Test Document' }
      };

      const features = await analyzer.extractFeatures(document);

      expect(features).toHaveLength(6);
      expect(features[0].title).toContain('advanced token validation');
      expect(features[1].title).toContain('error reporting system');
      expect(features[2].title).toContain('cross-platform compatibility');
    });

    it('should extract features from implementation patterns', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Implementation Summary
- Implemented new validation engine for token processing
- Created new error handling system with detailed messages
- Added new configuration management system
- Built new performance monitoring tools
`,
        metadata: { title: 'Test Document' }
      };

      const features = await analyzer.extractFeatures(document);

      expect(features.length).toBeGreaterThan(0);
      expect(features.some(f => f.title.includes('validation engine'))).toBe(true);
      expect(features.some(f => f.title.includes('error handling system'))).toBe(true);
    });

    it('should not extract implementation as features when bug fixes are present', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Bug Fixes
- Fixed validation error handling
- Resolved memory leak issues

## Implementation
- Implemented fix for validation edge cases
- Created workaround for parser issues
`,
        metadata: { title: 'Test Document' }
      };

      const features = await analyzer.extractFeatures(document);

      // Should not extract implementation items as features when bug fixes are present
      expect(features.length).toBe(0);
    });
  });

  describe('Bug Fix Extraction', () => {
    it('should extract bug fixes from structured sections', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Bug Fixes
- Fixed memory leak in token parser
- Resolved edge case in validation logic
- Corrected error message formatting

## Issues Resolved
- Fixed race condition in async validation
- Resolved configuration loading timeout
`,
        metadata: { title: 'Test Document' }
      };

      const bugFixes = await analyzer.extractBugFixes(document);

      expect(bugFixes).toHaveLength(5);
      expect(bugFixes[0].title).toContain('memory leak in token parser');
      expect(bugFixes[1].title).toContain('edge case in validation logic');
      expect(bugFixes[2].title).toContain('error message formatting');
    });

    it('should extract bug fixes from fix patterns', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Changes Made
- Fixed the validation timeout issue
- Resolved the configuration parsing problem
- Corrected the error handling behavior
`,
        metadata: { title: 'Test Document' }
      };

      const bugFixes = await analyzer.extractBugFixes(document);

      expect(bugFixes.length).toBeGreaterThan(0);
      expect(bugFixes.some(bf => bf.title.includes('validation timeout'))).toBe(true);
      expect(bugFixes.some(bf => bf.title.includes('configuration parsing'))).toBe(true);
    });
  });

  describe('Improvement Extraction', () => {
    it('should extract improvements from structured sections', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Improvements
- Optimized validation performance by 40%
- Enhanced error messages with suggestions
- Refactored codebase for better maintainability

## Enhancements
- Improved user experience with better feedback
- Enhanced configuration validation
`,
        metadata: { title: 'Test Document' }
      };

      const improvements = await analyzer.extractImprovements(document);

      expect(improvements).toHaveLength(5);
      expect(improvements[0].title).toContain('validation performance');
      expect(improvements[1].title).toContain('error messages');
      expect(improvements[2].title).toContain('codebase for better maintainability');
    });

    it('should extract improvements from improvement patterns', async () => {
      const document = {
        path: 'test.md',
        content: `
# Completion Document

## Changes Made
- Improved the validation algorithm efficiency
- Enhanced the error reporting system
- Optimized memory usage in token processing
- Refactored the configuration management
`,
        metadata: { title: 'Test Document' }
      };

      const improvements = await analyzer.extractImprovements(document);

      expect(improvements.length).toBeGreaterThan(0);
      expect(improvements.some(imp => imp.title.includes('validation algorithm'))).toBe(true);
      expect(improvements.some(imp => imp.title.includes('error reporting'))).toBe(true);
    });
  });

  describe('Document Metadata Extraction', () => {
    it('should extract metadata from document headers', async () => {
      const content = `
# Task Completion Document

**Date**: 2025-01-10
**Task**: 1.1 Implement validation system
**Spec**: F1 - Token System
**Status**: Complete

## Content
Document content here.
`;

      const metadata = (analyzer as any).extractDocumentMetadata(content);

      expect(metadata.title).toBe('Task Completion Document');
      expect(metadata.date).toBe('2025-01-10');
      expect(metadata.task).toBe('1.1 Implement validation system');
      expect(metadata.spec).toBe('F1 - Token System');
      expect(metadata.status).toBe('Complete');
    });

    it('should handle missing metadata gracefully', async () => {
      const content = `
# Simple Document

Just some content without metadata.
`;

      const metadata = (analyzer as any).extractDocumentMetadata(content);

      expect(metadata.title).toBe('Simple Document');
      expect(metadata.date).toBeUndefined();
      expect(metadata.task).toBeUndefined();
      expect(metadata.spec).toBeUndefined();
      expect(metadata.status).toBeUndefined();
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate high confidence for well-structured documents', async () => {
      const document = {
        path: 'test.md',
        content: `
# Well Structured Document

**Date**: 2025-01-10
**Task**: 1.1 Test Task
**Status**: Complete

## Summary
Comprehensive summary of work completed.

## Implementation Approach
Detailed implementation approach.

## Key Decisions
Important decisions made during implementation.

## Artifacts Created
- \`src/file1.ts\`
- \`src/file2.ts\`

## Breaking Changes
- Removed old API method

## New Features
- Added new validation system

## Bug Fixes
- Fixed memory leak

## Improvements
- Optimized performance
`,
        metadata: {
          title: 'Well Structured Document',
          date: '2025-01-10',
          task: '1.1 Test Task',
          status: 'Complete'
        }
      };

      const analysis: ReleaseAnalysis = {
        breakingChanges: [{ id: 'bc1', title: 'Test', description: 'Test', affectedAPIs: [], source: 'test.md', severity: 'medium' }],
        newFeatures: [{ id: 'f1', title: 'Test', description: 'Test', requirements: [], artifacts: [], source: 'test.md', category: 'new-functionality' }],
        bugFixes: [{ id: 'bf1', title: 'Test', description: 'Test', source: 'test.md', severity: 'medium' }],
        improvements: [{ id: 'i1', title: 'Test', description: 'Test', type: 'performance', source: 'test.md' }],
        suggestedVersionBump: 'major',
        confidence: 0,
        analyzedAt: new Date()
      };

      const confidence = (analyzer as any).calculateDocumentConfidence(document, analysis);

      expect(confidence).toBeGreaterThan(0.9);
    });

    it('should calculate lower confidence for minimal documents', async () => {
      const document = {
        path: 'test.md',
        content: 'Minimal content',
        metadata: { title: 'Untitled' }
      };

      const analysis: ReleaseAnalysis = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        suggestedVersionBump: 'patch',
        confidence: 0,
        analyzedAt: new Date()
      };

      const confidence = (analyzer as any).calculateDocumentConfidence(document, analysis);

      expect(confidence).toBeLessThan(0.7);
    });
  });

  describe('Version Bump Determination', () => {
    it('should suggest major version for breaking changes', async () => {
      const analysis: ReleaseAnalysis = {
        breakingChanges: [{ id: 'bc1', title: 'Test', description: 'Test', affectedAPIs: [], source: 'test.md', severity: 'medium' }],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        suggestedVersionBump: 'patch',
        confidence: 0,
        analyzedAt: new Date()
      };

      const versionBump = (analyzer as any).determineSuggestedVersionBump(analysis);

      expect(versionBump).toBe('major');
    });

    it('should suggest minor version for new features', async () => {
      const analysis: ReleaseAnalysis = {
        breakingChanges: [],
        newFeatures: [{ id: 'f1', title: 'Test', description: 'Test', requirements: [], artifacts: [], source: 'test.md', category: 'new-functionality' }],
        bugFixes: [],
        improvements: [],
        suggestedVersionBump: 'patch',
        confidence: 0,
        analyzedAt: new Date()
      };

      const versionBump = (analyzer as any).determineSuggestedVersionBump(analysis);

      expect(versionBump).toBe('minor');
    });

    it('should suggest patch version for fixes and improvements', async () => {
      const analysis: ReleaseAnalysis = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [{ id: 'bf1', title: 'Test', description: 'Test', source: 'test.md', severity: 'medium' }],
        improvements: [{ id: 'i1', title: 'Test', description: 'Test', type: 'performance', source: 'test.md' }],
        suggestedVersionBump: 'patch',
        confidence: 0,
        analyzedAt: new Date()
      };

      const versionBump = (analyzer as any).determineSuggestedVersionBump(analysis);

      expect(versionBump).toBe('patch');
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors gracefully', async () => {
      const documentPath = 'non-existent-file.md';

      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(analyzer.parseSpecCompletionDocument(documentPath))
        .rejects.toThrow('Failed to parse spec completion document');
    });

    it('should handle malformed documents', async () => {
      const documentsPath = '.kiro/specs/test-spec/completion';

      mockFs.readdir.mockResolvedValue(['malformed.md'] as any);
      mockFs.readFile.mockResolvedValue('Malformed content without proper structure');

      const analysis = await analyzer.analyzeCompletionDirectory(documentsPath);

      expect(analysis).toBeDefined();
      expect(analysis.confidence).toBeLessThan(0.8);
    });

    it('should handle empty completion directories', async () => {
      const documentsPath = '.kiro/specs/test-spec/completion';

      mockFs.readdir.mockResolvedValue([] as any);

      const analysis = await analyzer.analyzeCompletionDirectory(documentsPath);

      expect(analysis).toBeDefined();
      expect(analysis.breakingChanges).toHaveLength(0);
      expect(analysis.newFeatures).toHaveLength(0);
      expect(analysis.bugFixes).toHaveLength(0);
      expect(analysis.improvements).toHaveLength(0);
    });
  });
});