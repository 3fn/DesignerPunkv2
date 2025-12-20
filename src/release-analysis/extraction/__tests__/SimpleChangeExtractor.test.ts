/**
 * @category evergreen
 * @purpose Verify SimpleChangeExtractor functionality works correctly
 */
/**
 * Tests for SimpleChangeExtractor
 * 
 * Validates pattern-based change extraction functionality including
 * structured and unstructured document parsing.
 */

import { SimpleChangeExtractor } from '../SimpleChangeExtractor';
import { DEFAULT_ANALYSIS_CONFIG } from '../../config/AnalysisConfig';
import { CompletionDocument } from '../../types/AnalysisTypes';

describe('SimpleChangeExtractor', () => {
  let extractor: SimpleChangeExtractor;

  beforeEach(() => {
    extractor = new SimpleChangeExtractor(DEFAULT_ANALYSIS_CONFIG.extraction);
  });

  describe('parseCompletionDocument', () => {
    it('should extract changes from structured document', async () => {
      const document: CompletionDocument = {
        path: 'test-completion.md',
        content: `# Task Completion

## Breaking Changes
- Removed deprecated API method getUserData()
- Changed interface for TokenValidator

## New Features  
- Added mathematical token validation
- Implemented cross-platform generation

## Bug Fixes
- Fixed baseline grid alignment issue #123
- Corrected spacing calculation errors
`,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Test Completion',
          type: 'task-completion'
        }
      };

      const result = await extractor.parseCompletionDocument(document);

      expect(result.breakingChanges).toHaveLength(2);
      expect(result.newFeatures).toHaveLength(2);
      expect(result.bugFixes).toHaveLength(2);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should extract changes from unstructured document', async () => {
      const document: CompletionDocument = {
        path: 'unstructured-completion.md',
        content: `Completed the token system implementation. This introduces new feature for mathematical validation and fixes the bug with spacing calculations. The change removes the old API which is a breaking change.`,
        lastModified: new Date(),
        gitCommit: 'def456',
        metadata: {
          title: 'Unstructured Completion',
          type: 'task-completion'
        }
      };

      const result = await extractor.parseCompletionDocument(document);

      expect(result.breakingChanges.length + result.newFeatures.length + result.bugFixes.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle empty document', async () => {
      const document: CompletionDocument = {
        path: 'empty-completion.md',
        content: '',
        lastModified: new Date(),
        gitCommit: 'ghi789',
        metadata: {
          title: 'Empty Completion',
          type: 'task-completion'
        }
      };

      const result = await extractor.parseCompletionDocument(document);

      expect(result.breakingChanges).toHaveLength(0);
      expect(result.newFeatures).toHaveLength(0);
      expect(result.bugFixes).toHaveLength(0);
      expect(result.improvements).toHaveLength(0);
    });
  });

  describe('extractChanges', () => {
    it('should aggregate changes from multiple documents', async () => {
      const documents: CompletionDocument[] = [
        {
          path: 'doc1.md',
          content: `## Breaking Changes\n- API change in TokenValidator`,
          lastModified: new Date(),
          gitCommit: 'abc123',
          metadata: { title: 'Doc 1', type: 'task-completion' }
        },
        {
          path: 'doc2.md',
          content: `## New Features\n- Added mathematical validation`,
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Doc 2', type: 'task-completion' }
        }
      ];

      const result = await extractor.extractChanges(documents);

      expect(result.breakingChanges).toHaveLength(1);
      expect(result.newFeatures).toHaveLength(1);
      expect(result.metadata.documentsAnalyzed).toBe(2);
    });

    it('should filter out documentation-only changes', async () => {
      const documents: CompletionDocument[] = [
        {
          path: 'README.md',
          content: `Updated documentation and examples`,
          lastModified: new Date(),
          gitCommit: 'abc123',
          metadata: { title: 'README Update', type: 'other' }
        }
      ];

      const result = await extractor.extractChanges(documents);

      expect(result.metadata.filteredItems).toContain('README.md');
    });
  });

  describe('deduplicateChanges', () => {
    it('should remove duplicate changes', async () => {
      const changes = {
        breakingChanges: [
          {
            id: '1',
            title: 'API Change',
            description: 'Changed TokenValidator API',
            affectedAPIs: [],
            source: 'doc1.md:1',
            severity: 'medium' as const
          },
          {
            id: '2', 
            title: 'API Change',
            description: 'Changed TokenValidator API with more details',
            affectedAPIs: ['TokenValidator'],
            source: 'doc2.md:1',
            severity: 'medium' as const
          }
        ],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 2,
          extractionConfidence: 0.8,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = extractor.deduplicateChanges(changes);

      expect(result.breakingChanges).toHaveLength(1);
      expect(result.breakingChanges[0].description).toContain('more details');
    });
  });

  describe('validateExtraction', () => {
    it('should validate extraction results', () => {
      const changes = {
        breakingChanges: [],
        newFeatures: [
          {
            id: '1',
            title: 'New Feature',
            description: 'Added validation',
            benefits: [],
            requirements: [],
            artifacts: [],
            source: 'doc1.md:1',
            category: 'General'
          }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.8,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const validation = extractor.validateExtraction(changes);

      expect(validation.valid).toBe(true);
      expect(validation.confidence).toBe(0.8);
      expect(validation.errors).toHaveLength(0);
    });

    it('should flag low confidence extractions', () => {
      const changes = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.3, // Below minimum threshold
          ambiguousItems: ['unclear item'],
          filteredItems: []
        }
      };

      const validation = extractor.validateExtraction(changes);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Enhanced Extraction Integration', () => {
    it('should use structured section parsing for better accuracy', async () => {
      const document: CompletionDocument = {
        path: 'test-structured.md',
        content: `
# Task Completion

## Breaking Changes

- Removed deprecated API method \`oldFunction()\`
- Changed interface signature for \`UserManager\`

## New Features

- Added new authentication system
- Implemented user profile management

## Bug Fixes

- Fixed memory leak in token validation
- Resolved race condition in user sessions
        `,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Test Structured Document',
          type: 'task-completion'
        }
      };

      const result = await extractor.parseCompletionDocument(document);

      // Should extract from structured sections
      expect(result.breakingChanges).toHaveLength(2);
      expect(result.breakingChanges[0].title).toContain('Removed deprecated API');
      expect(result.breakingChanges[1].title).toContain('Changed interface signature');

      expect(result.newFeatures).toHaveLength(2);
      expect(result.newFeatures[0].title).toContain('Added new authentication');
      expect(result.newFeatures[1].title).toContain('Implemented user profile');

      expect(result.bugFixes).toHaveLength(2);
      expect(result.bugFixes[0].title).toContain('Fixed memory leak');
      expect(result.bugFixes[1].title).toContain('Resolved race condition');

      // Should have higher confidence due to structured sections
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should perform semantic deduplication', async () => {
      // Test the deduplication directly with the deduplicateChanges method
      const changes = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [
          {
            id: '1',
            title: 'Fixed authentication bug in login system',
            description: 'Fixed authentication bug in login system',
            affectedComponents: [],
            source: 'test',
            severity: 'medium' as const
          },
          {
            id: '2', 
            title: 'Fixed authentication bug in login system',
            description: 'Fixed authentication bug in login system',
            affectedComponents: [],
            source: 'test',
            severity: 'medium' as const
          }
        ],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.8,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const deduplicated = extractor.deduplicateChanges(changes);

      // Should deduplicate exact duplicates
      expect(deduplicated.bugFixes.length).toBe(1);
    });

    it('should integrate enhanced extraction methods successfully', async () => {
      const document: CompletionDocument = {
        path: 'test-integration.md',
        content: `
## Breaking Changes

- Removed deprecated API method \`oldFunction()\`

## New Features  

- Added new authentication system

## Bug Fixes

- Resolved actual authentication bug
        `,
        lastModified: new Date(),
        gitCommit: 'ghi789',
        metadata: {
          title: 'Test Integration Success',
          type: 'task-completion'
        }
      };

      const result = await extractor.parseCompletionDocument(document);

      // Should successfully extract all types of changes
      expect(result.breakingChanges.length).toBeGreaterThan(0);
      expect(result.newFeatures.length).toBeGreaterThan(0);
      expect(result.bugFixes.length).toBeGreaterThan(0);
      
      // Should have reasonable confidence
      expect(result.confidence).toBeGreaterThan(0.5);
      
      // Should extract meaningful titles
      expect(result.breakingChanges[0].title).toContain('Removed deprecated API');
      expect(result.newFeatures[0].title).toContain('Added new authentication');
      expect(result.bugFixes[0].title).toContain('Resolved actual authentication');
    });
  });
});