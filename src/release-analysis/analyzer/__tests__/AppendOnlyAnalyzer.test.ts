/**
 * @category evergreen
 * @purpose Verify AppendOnlyAnalyzer functionality works correctly
 */
/**
 * Unit tests for AppendOnlyAnalyzer
 * 
 * Tests the append-only analysis functionality that enables O(m) complexity
 * where m = new documents instead of O(n) where n = total documents.
 */

import { AppendOnlyAnalyzer } from '../AppendOnlyAnalyzer';
import { DocumentAnalysisResult } from '../../state/types';
import { AnalysisConfig } from '../../config/AnalysisConfig';
import { CompletionDocumentCollector } from '../../collection/CompletionDocumentCollector';
import { DefaultChangeExtractor } from '../../extraction/ChangeExtractor';

// Mock dependencies
jest.mock('../../collection/CompletionDocumentCollector');
jest.mock('../../extraction/ChangeExtractor');

describe('AppendOnlyAnalyzer', () => {
  let analyzer: AppendOnlyAnalyzer;
  let mockConfig: AnalysisConfig;
  let mockCollector: jest.Mocked<CompletionDocumentCollector>;
  let mockExtractor: jest.Mocked<DefaultChangeExtractor>;

  beforeEach(() => {
    // Create mock config
    mockConfig = {
      extraction: {
        completionPatterns: ['**/*-completion.md'],
        summaryPatterns: ['**/task-*-summary.md'],
        preferSummaries: true,
        breakingChangeKeywords: ['breaking', 'removed', 'deprecated'],
        featureKeywords: ['feature', 'added', 'new'],
        bugFixKeywords: ['fix', 'bug', 'issue'],
        improvementKeywords: ['improve', 'enhance', 'optimize'],
        documentationKeywords: ['documentation', 'docs', 'readme'],
        sectionHeaders: {
          breakingChanges: ['Breaking Changes'],
          features: ['New Features', 'Features'],
          bugFixes: ['Bug Fixes', 'Fixes'],
          improvements: ['Improvements'],
          summary: ['Summary', 'Overview']
        }
      }
    } as AnalysisConfig;

    // Create analyzer instance
    analyzer = new AppendOnlyAnalyzer(mockConfig);

    // Get mocked instances
    mockCollector = (analyzer as any).collector as jest.Mocked<CompletionDocumentCollector>;
    mockExtractor = (analyzer as any).extractor as jest.Mocked<DefaultChangeExtractor>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeAndAppend - Requirement 5.3', () => {
    it('should return accumulated results unchanged when no new documents', async () => {
      const accumulatedResults: DocumentAnalysisResult[] = [
        {
          filePath: '.kiro/specs/001-test/completion/task-1-completion.md',
          specName: '001-test',
          taskNumber: '1',
          impactLevel: 'patch',
          releaseNoteContent: 'Existing result',
          analyzedAtCommit: 'abc123'
        }
      ];

      const result = await analyzer.analyzeAndAppend([], accumulatedResults);

      expect(result).toEqual(accumulatedResults);
      expect(result).toBe(accumulatedResults); // Should be same reference
      expect(mockCollector.collectFromPaths).not.toHaveBeenCalled();
    });
  });

  describe('analyzeAndAppend - Requirement 5.1, 5.2', () => {
    it('should analyze new documents and append results while preserving existing', async () => {
      const newDocumentPaths = [
        '.kiro/specs/002-new/completion/task-1-completion.md'
      ];

      const accumulatedResults: DocumentAnalysisResult[] = [
        {
          filePath: '.kiro/specs/001-test/completion/task-1-completion.md',
          specName: '001-test',
          taskNumber: '1',
          impactLevel: 'patch',
          releaseNoteContent: 'Existing result',
          analyzedAtCommit: 'abc123'
        }
      ];

      // Mock document collection
      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [
          {
            path: '.kiro/specs/002-new/completion/task-1-completion.md',
            content: '# Task 1 Completion\n\n## Summary\n\nAdded new feature\n\n## Other Section\n\nOther content',
            lastModified: new Date(),
            gitCommit: 'def456',
            metadata: {
              title: 'Task 1 Completion',
              type: 'task-completion'
            }
          }
        ],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      // Mock document analysis
      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [
          {
            id: 'feature-1',
            title: 'New feature',
            description: 'Added new feature',
            category: 'feature',
            source: 'test',
            benefits: [],
            requirements: [],
            artifacts: []
          }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, accumulatedResults);

      // Requirement 5.1: Append new results
      expect(result).toHaveLength(2);
      
      // Requirement 5.2: Preserve existing results unchanged
      expect(result[0]).toBe(accumulatedResults[0]);
      expect(result[0]).toEqual(accumulatedResults[0]);
      
      // Requirement 5.4: New result has all required fields
      expect(result[1]).toMatchObject({
        filePath: '.kiro/specs/002-new/completion/task-1-completion.md',
        specName: '002-new',
        taskNumber: '1',
        impactLevel: 'minor', // New feature = minor impact
        releaseNoteContent: 'Added new feature',
        analyzedAtCommit: 'def456'
      });
    });
  });

  describe('Impact Level Determination', () => {
    it('should determine major impact for breaking changes', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\n## Summary\n\nBreaking change',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [{
          id: 'breaking-1',
          title: 'Breaking change',
          description: 'Removed API',
          severity: 'high',
          migrationGuidance: 'Use new API',
          source: 'test',
          affectedAPIs: []
        }],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].impactLevel).toBe('major');
    });

    it('should determine minor impact for new features', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\n## Summary\n\nNew feature',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [{
          id: 'feature-1',
          title: 'New feature',
          description: 'Added feature',
          category: 'feature',
          source: 'test',
          benefits: [],
          requirements: [],
          artifacts: []
        }],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].impactLevel).toBe('minor');
    });

    it('should determine patch impact for bug fixes', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\n## Summary\n\nBug fix',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [{
          id: 'bugfix-1',
          title: 'Bug fix',
          description: 'Fixed bug',
          severity: 'medium',
          source: 'test',
          affectedComponents: []
        }],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].impactLevel).toBe('patch');
    });
  });

  describe('Metadata Extraction', () => {
    it('should extract spec name and task number correctly', async () => {
      const newDocumentPaths = ['.kiro/specs/008-icon-system/completion/task-2-parent-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/008-icon-system/completion/task-2-parent-completion.md',
          content: '# Task 2 Completion\n\n## Summary\n\nCompleted task',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 2 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].specName).toBe('008-icon-system');
      expect(result[0].taskNumber).toBe('2');
    });
  });

  describe('Error Handling', () => {
    it('should handle collection errors gracefully', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];
      const accumulatedResults: DocumentAnalysisResult[] = [{
        filePath: '.kiro/specs/001-test/completion/task-1-completion.md',
        specName: '001-test',
        taskNumber: '1',
        impactLevel: 'patch',
        releaseNoteContent: 'Existing result',
        analyzedAtCommit: 'abc123'
      }];

      // Mock document collection with errors
      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 0,
          documentsLoaded: 0,
          documentsFiltered: 0,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [{
          filePath: '.kiro/specs/002-new/completion/task-1-completion.md',
          error: 'File not found',
          type: 'access',
          recoverable: false
        }],
        warnings: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, accumulatedResults);

      // Should return accumulated results unchanged on error
      expect(result).toEqual(accumulatedResults);
    });
  });

  describe('Release Content Extraction', () => {
    it('should extract release content from Summary section', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\n## Summary\n\nThis is the summary content\n\n## Other Section\n\nOther content',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].releaseNoteContent).toBe('This is the summary content');
    });

    it('should fallback to Overview section if Summary not found', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\n## Overview\n\nThis is the overview content\n\n## Other Section\n\nOther content',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].releaseNoteContent).toBe('This is the overview content');
    });

    it('should fallback to title if no sections found', async () => {
      const newDocumentPaths = ['.kiro/specs/002-new/completion/task-1-completion.md'];

      mockCollector.collectFromPaths.mockResolvedValue({
        documents: [{
          path: '.kiro/specs/002-new/completion/task-1-completion.md',
          content: '# Task 1 Completion\n\nSome content without sections',
          lastModified: new Date(),
          gitCommit: 'def456',
          metadata: { title: 'Task 1 Completion', type: 'task-completion' }
        }],
        metadata: {
          totalFilesScanned: 1,
          documentsFound: 1,
          documentsLoaded: 1,
          documentsFiltered: 1,
          collectionDate: new Date(),
          processingTimeMs: 100
        },
        errors: [],
        warnings: []
      });

      mockExtractor.parseCompletionDocument.mockResolvedValue({
        document: {} as any,
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        confidence: 0.9,
        ambiguousItems: []
      });

      const result = await analyzer.analyzeAndAppend(newDocumentPaths, []);

      expect(result).toHaveLength(1);
      expect(result[0].releaseNoteContent).toBe('Task 1 Completion');
    });
  });
});
