/**
 * @category evergreen
 * @purpose Verify integration functionality works correctly
 */
/**
 * Integration test for pattern-based change extraction
 * 
 * Tests the complete workflow from completion documents to extracted changes
 * using realistic completion document examples.
 */

import { DefaultChangeExtractor } from '../ChangeExtractor';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { CompletionDocument } from '../../types/AnalysisTypes';

describe('Change Extraction Integration', () => {
  let extractor: DefaultChangeExtractor;

  beforeEach(() => {
    extractor = new DefaultChangeExtractor(DEFAULT_ANALYSIS_CONFIG.extraction);
  });

  it('should extract changes from realistic completion documents', async () => {
    const documents: CompletionDocument[] = [
      {
        path: '.kiro/specs/token-system/completion/task-1-completion.md',
        content: `# Task 1 Completion: Mathematical Token Foundation

## Summary
Completed the implementation of mathematical token validation system with baseline grid alignment.

## Breaking Changes
- Removed deprecated TokenValidator.validate() method
- Changed PrimitiveToken interface to require mathematical relationships

## New Features
- Added mathematical validation for spacing tokens
- Implemented baseline grid alignment checking
- Created cross-platform token generation system

## Bug Fixes
- Fixed spacing calculation errors in baseline grid
- Corrected token reference validation logic
- Resolved circular dependency in token registry

## Improvements
- Optimized token lookup performance by 40%
- Enhanced error messages for validation failures
- Refactored token generation pipeline for maintainability
`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'abc123',
        metadata: {
          title: 'Task 1 Completion',
          task: '1',
          spec: 'token-system',
          type: 'task-completion'
        }
      },
      {
        path: '.kiro/specs/build-system/completion/task-2-completion.md',
        content: `# Task 2 Completion: Cross-Platform Build Integration

## What Changed
This task implements the cross-platform build system integration. The system now supports generating tokens for web, iOS, and Android platforms with proper unit conversion.

Key accomplishments:
- New feature: Platform-specific file generation
- Bug fix: Resolved unit conversion inconsistencies
- Improvement: Added build-time validation
- Breaking change: Modified BuildConfig interface structure
`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'def456',
        metadata: {
          title: 'Task 2 Completion',
          task: '2',
          spec: 'build-system',
          type: 'task-completion'
        }
      }
    ];

    const result = await extractor.extractChanges(documents);

    // Verify extraction results
    expect(result.breakingChanges.length).toBeGreaterThan(0);
    expect(result.newFeatures.length).toBeGreaterThan(0);
    expect(result.bugFixes.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeGreaterThan(0);

    // Verify specific extractions
    expect(result.breakingChanges.some(change => 
      change.title.toLowerCase().includes('tokenvalidator') ||
      change.title.toLowerCase().includes('buildconfig')
    )).toBe(true);

    expect(result.newFeatures.some(feature => 
      feature.title.toLowerCase().includes('mathematical') ||
      feature.title.toLowerCase().includes('platform')
    )).toBe(true);

    expect(result.bugFixes.some(fix => 
      fix.title.toLowerCase().includes('spacing') ||
      fix.title.toLowerCase().includes('unit conversion')
    )).toBe(true);

    // Verify metadata
    expect(result.metadata.documentsAnalyzed).toBe(2);
    expect(result.metadata.extractionConfidence).toBeGreaterThan(0.5);

    // Verify validation
    const validation = extractor.validateExtraction(result);
    expect(validation.valid).toBe(true);

    // Get extraction statistics
    const stats = extractor.getExtractionStats(result);
    expect(stats.totalChanges).toBeGreaterThan(0);
    expect(stats.changesByType.breakingChanges).toBeGreaterThan(0);
    expect(stats.changesByType.newFeatures).toBeGreaterThan(0);
    expect(stats.changesByType.bugFixes).toBeGreaterThan(0);
    expect(stats.changesByType.improvements).toBeGreaterThan(0);
  });

  it('should filter documentation-only documents', async () => {
    const documents: CompletionDocument[] = [
      {
        path: 'README.md',
        content: `# Updated Documentation

Updated the README with new examples and installation instructions.
Added API documentation and usage guides.
`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'ghi789',
        metadata: {
          title: 'Documentation Update',
          type: 'other'
        }
      },
      {
        path: '.kiro/specs/feature/completion/task-1-completion.md',
        content: `# Task Completion

## New Features
- Added user authentication system
- Implemented JWT token handling
`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'jkl012',
        metadata: {
          title: 'Feature Task Completion',
          task: '1',
          spec: 'feature',
          type: 'task-completion'
        }
      }
    ];

    const result = await extractor.extractChanges(documents);

    // Should filter out README.md
    expect(result.metadata.filteredItems).toContain('README.md');
    expect(result.metadata.documentsAnalyzed).toBe(1);

    // Should still extract from the task completion
    expect(result.newFeatures.length).toBeGreaterThan(0);
  });

  it('should handle unstructured completion documents', async () => {
    const documents: CompletionDocument[] = [
      {
        path: '.kiro/specs/misc/completion/task-3-completion.md',
        content: `Completed the validation system implementation. This introduces a new feature for token validation and fixes the bug with circular references. The implementation removes the old validation API which is a breaking change for existing users.`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'mno345',
        metadata: {
          title: 'Unstructured Completion',
          task: '3',
          spec: 'misc',
          type: 'task-completion'
        }
      }
    ];

    const result = await extractor.extractChanges(documents);

    // Should extract changes even from unstructured content
    expect(result.breakingChanges.length + result.newFeatures.length + result.bugFixes.length).toBeGreaterThan(0);
    expect(result.metadata.documentsAnalyzed).toBe(1);
    expect(result.metadata.extractionConfidence).toBeGreaterThan(0);
  });

  it('should deduplicate similar changes across documents', async () => {
    const documents: CompletionDocument[] = [
      {
        path: '.kiro/specs/spec1/completion/task-1-completion.md',
        content: `## Breaking Changes\n- Removed TokenValidator API`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'abc123',
        metadata: { title: 'Task 1', type: 'task-completion' }
      },
      {
        path: '.kiro/specs/spec2/completion/task-2-completion.md',
        content: `## Breaking Changes\n- Removed TokenValidator API with additional details about migration`,
        lastModified: new Date('2025-01-10'),
        gitCommit: 'def456',
        metadata: { title: 'Task 2', type: 'task-completion' }
      }
    ];

    const result = await extractor.extractChanges(documents);

    // Should deduplicate similar breaking changes
    expect(result.breakingChanges).toHaveLength(1);
    expect(result.breakingChanges[0].description).toContain('additional details');
    expect(result.metadata.documentsAnalyzed).toBe(2);
  });
});